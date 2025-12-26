const { app, BrowserWindow, Tray, Menu, nativeImage, shell, ipcMain } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Hardware acceleration açık kalacak (performans için)

let mainWindow;
let tray;
let isQuitting = false;
let pythonProcess = null;
let startMinimized = false; // Başlangıçta gizli başlat

// Python backend URL - IPv4 açıkça belirtilmeli (Node.js localhost'u IPv6 olarak çözümler)
const BACKEND_URL = 'http://127.0.0.1:8000';

// ==================== AUTO-LAUNCH YÖNETİMİ ====================

// Ayarlar dosyası yolu
const settingsPath = path.join(app.getPath('userData'), 'settings.json');

/**
 * Ayarları yükle
 */
function loadSettings() {
    try {
        if (fs.existsSync(settingsPath)) {
            const data = fs.readFileSync(settingsPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Ayarlar yüklenemedi:', e.message);
    }
    return { autoLaunch: true, startMinimized: true }; // Varsayılan olarak aktif
}

/**
 * Ayarları kaydet
 */
function saveSettings(settings) {
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    } catch (e) {
        console.error('Ayarlar kaydedilemedi:', e.message);
    }
}

/**
 * Auto-launch durumunu güncelle
 */
function setAutoLaunch(enable) {
    app.setLoginItemSettings({
        openAtLogin: enable,
        path: app.getPath('exe'),
        args: ['--hidden'] // Gizli başlat
    });

    const settings = loadSettings();
    settings.autoLaunch = enable;
    saveSettings(settings);
    console.log(`🚀 Başlangıçta çalıştır: ${enable ? 'Aktif' : 'Pasif'}`);
}

/**
 * Auto-launch durumunu kontrol et
 */
function isAutoLaunchEnabled() {
    const settings = loadSettings();
    return settings.autoLaunch !== false; // Varsayılan true
}

/**
 * Gizli başlat ayarını güncelle
 */
function setStartMinimized(enable) {
    const settings = loadSettings();
    settings.startMinimized = enable;
    saveSettings(settings);
    console.log(`🔇 Arka planda başlat: ${enable ? 'Aktif' : 'Pasif'}`);
}

/**
 * Gizli başlat durumunu kontrol et
 */
function isStartMinimizedEnabled() {
    const settings = loadSettings();
    return settings.startMinimized !== false; // Varsayılan true
}

// ==================== PYTHON BACKEND YÖNETİMİ ====================

/**
 * Python backend'in çalışıp çalışmadığını kontrol et
 */
function checkBackendReady() {
    return new Promise((resolve) => {
        console.log(`[DEBUG] Backend kontrolü: ${BACKEND_URL}/api/status`);
        const req = http.get(`${BACKEND_URL}/api/status`, (res) => {
            console.log(`[DEBUG] Yanıt alındı, status: ${res.statusCode}`);
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`[DEBUG] Veri: ${data}`);
                try {
                    const json = JSON.parse(data);
                    const isOnline = json.status === 'online';
                    console.log(`[DEBUG] Parse edildi, online: ${isOnline}`);
                    resolve(isOnline);
                } catch (e) {
                    console.log(`[DEBUG] Parse hatası: ${e.message}`);
                    resolve(res.statusCode === 200);
                }
            });
        });
        req.on('error', (err) => {
            console.log(`[DEBUG] Bağlantı hatası: ${err.message}`);
            resolve(false);
        });
        req.setTimeout(2000, () => {
            console.log('[DEBUG] Timeout!');
            req.destroy();
            resolve(false);
        });
    });
}

/**
 * Backend hazır olana kadar bekle
 */
async function waitForBackend(maxAttempts = 30, interval = 500) {
    for (let i = 0; i < maxAttempts; i++) {
        const ready = await checkBackendReady();
        if (ready) {
            console.log('✅ Python backend hazır!');
            return true;
        }
        console.log(`⏳ Backend bekleniyor... (${i + 1}/${maxAttempts})`);
        await new Promise(r => setTimeout(r, interval));
    }
    console.error('❌ Backend başlatılamadı!');
    return false;
}

/**
 * Python backend'i başlat
 */
function startPythonBackend() {
    return new Promise((resolve, reject) => {
        // Production modda gömülü EXE kullan, development modda python kullan
        const isPackaged = app.isPackaged;

        let backendPath;
        let args = [];
        let cwd;

        if (isPackaged) {
            // Production: Gömülü EXE
            backendPath = path.join(process.resourcesPath, 'backend', 'quicktype-backend.exe');
            cwd = path.dirname(backendPath);
            console.log('📦 Production modu - Gömülü backend kullanılıyor');
            console.log(`   EXE: ${backendPath}`);
        } else {
            // Development: Python script
            backendPath = 'python';
            args = ['main.py'];
            cwd = path.join(__dirname, '..');
            console.log('🔧 Development modu - Python script kullanılıyor');
            console.log(`   Dizin: ${cwd}`);
        }

        console.log('🐍 Python backend başlatılıyor...');

        // spawn ile backend'i başlat
        pythonProcess = spawn(backendPath, args, {
            cwd: cwd,
            shell: !isPackaged, // Development modda shell gerekli
            stdio: ['ignore', 'pipe', 'pipe'],
            env: process.env,
            detached: false
        });

        // Python çıktılarını logla
        if (pythonProcess.stdout) {
            pythonProcess.stdout.on('data', (data) => {
                console.log(`[Backend] ${data.toString().trim()}`);
            });
        }

        if (pythonProcess.stderr) {
            pythonProcess.stderr.on('data', (data) => {
                console.error(`[Backend ERR] ${data.toString().trim()}`);
            });
        }

        pythonProcess.on('error', (error) => {
            console.error('❌ Backend başlatma hatası:', error.message);
            reject(error);
        });

        pythonProcess.on('spawn', () => {
            console.log('🐍 Backend process spawned');
        });

        pythonProcess.on('close', (code) => {
            console.log(`🐍 Backend process kapandı (kod: ${code})`);
            pythonProcess = null;
        });

        // 3 saniye bekle - uvicorn'un başlaması için
        setTimeout(() => {
            console.log('⏰ 3 saniye bekleme tamamlandı');
            resolve();
        }, 3000);
    });
}

/**
 * Python backend'i kapat
 */
function stopPythonBackend() {
    console.log('🛑 Python backend kapatılıyor...');

    // Önce spawn edilen process'i kapat
    if (pythonProcess) {
        try {
            pythonProcess.kill('SIGTERM');
        } catch (e) {
            console.log('Python process kapatılamadı:', e.message);
        }
    }

    // Windows'ta port 8000'deki process'i bul ve kapat
    if (process.platform === 'win32') {
        // Sadece port 8000 kullanan process'i kapat (daha güvenli)
        exec('for /f "tokens=5" %a in (\'netstat -aon ^| findstr :8000 ^| findstr LISTENING\') do taskkill /f /pid %a', { shell: true }, (err) => {
            if (err) {
                console.log('Port 8000 üzerinde çalışan process bulunamadı veya kapatıldı');
            }
        });
    } else {
        exec('pkill -f "python main.py"');
    }

    pythonProcess = null;
}

function createWindow() {
    // Komut satırı argümanlarını kontrol et
    const launchedHidden = process.argv.includes('--hidden');
    const shouldStartMinimized = launchedHidden || (startMinimized && isStartMinimizedEnabled());

    // Menü çubuğunu kaldır
    Menu.setApplicationMenu(null);

    mainWindow = new BrowserWindow({
        width: 420,
        height: 700,
        minWidth: 380,
        minHeight: 500,
        frame: true,  // Native Windows title bar kullan - yırtılmayı önler
        autoHideMenuBar: true,  // Menü çubuğunu gizle
        backgroundColor: '#050a15',
        titleBarStyle: 'default',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'public', 'icon.png'),
        show: false,
        skipTaskbar: false,
        resizable: true,
        alwaysOnTop: false
    });

    // Development veya production moduna göre URL
    const startUrl = process.env.ELECTRON_START_URL ||
        `file://${path.join(__dirname, 'build', 'index.html')}`;

    mainWindow.loadURL(startUrl);

    // Hazır olunca göster (gizli başlat seçeneği aktifse gösterme)
    mainWindow.once('ready-to-show', () => {
        if (!shouldStartMinimized) {
            mainWindow.show();
            console.log('🪟 Pencere gösterildi');
        } else {
            console.log('🔇 Pencere arka planda başlatıldı');
        }
    });

    // DevTools - development modda
    if (process.env.ELECTRON_START_URL) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    // Kapatma davranışı - minimize to tray
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createTray() {
    // Tray ikonu oluştur
    const iconPath = path.join(__dirname, 'public', 'icon.png');
    let trayIcon;

    try {
        trayIcon = nativeImage.createFromPath(iconPath);
        trayIcon = trayIcon.resize({ width: 16, height: 16 });
    } catch (e) {
        // Fallback - boş ikon
        trayIcon = nativeImage.createEmpty();
    }

    tray = new Tray(trayIcon);
    tray.setToolTip('QuickType Pro - Pano Yönetimi');

    // Auto-launch ve start minimized durumlarını al
    const autoLaunchEnabled = isAutoLaunchEnabled();
    const startMinimizedEnabled = isStartMinimizedEnabled();

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'QuickType Pro',
            enabled: false,
            icon: trayIcon
        },
        { type: 'separator' },
        {
            label: '📋 Pano Yönetimi',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        {
            label: '🌐 Mobil Arayüz Aç',
            click: () => {
                shell.openExternal(BACKEND_URL);
            }
        },
        { type: 'separator' },
        {
            label: '🚀 Windows ile Başlat',
            type: 'checkbox',
            checked: autoLaunchEnabled,
            click: (menuItem) => {
                setAutoLaunch(menuItem.checked);
            }
        },
        {
            label: '🔇 Arka Planda Başlat',
            type: 'checkbox',
            checked: startMinimizedEnabled,
            click: (menuItem) => {
                setStartMinimized(menuItem.checked);
            }
        },
        { type: 'separator' },
        {
            label: '⚙️ Ayarlar',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.webContents.send('open-settings');
                }
            }
        },
        { type: 'separator' },
        {
            label: '❌ Çıkış',
            click: () => {
                isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);

    // Tray'e tıklayınca pencereyi göster
    tray.on('click', () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                mainWindow.hide();
            } else {
                mainWindow.show();
                mainWindow.focus();
            }
        }
    });
}

// Tek instance kontrolü
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    });

    app.whenReady().then(async () => {
        console.log('🚀 App ready, başlatılıyor...');

        // İlk çalıştırmada auto-launch'ı varsayılan olarak aktif et
        const settings = loadSettings();
        if (settings.autoLaunch === undefined) {
            setAutoLaunch(true);
            setStartMinimized(true);
        }

        // --hidden argümanı ile başlatıldıysa
        startMinimized = process.argv.includes('--hidden');
        console.log(`🔇 Gizli başlat modu: ${startMinimized}`);

        // Önce backend zaten çalışıyor mu kontrol et
        try {
            console.log('⏳ Mevcut backend kontrol ediliyor...');
            let backendReady = await checkBackendReady();

            if (backendReady) {
                console.log('✅ Backend zaten çalışıyor!');
            } else {
                // Backend çalışmıyorsa başlat
                console.log('⏳ Python backend başlatılıyor...');
                await startPythonBackend();
                console.log('⏳ Backend bekleniyor...');
                backendReady = await waitForBackend();
                console.log('📡 Backend durumu:', backendReady);

                if (!backendReady) {
                    console.error('❌ Backend başlatılamadı, uygulama kapatılıyor...');
                    app.quit();
                    return;
                }
            }
        } catch (error) {
            console.error('❌ Backend başlatma hatası:', error);
            app.quit();
            return;
        }

        console.log('🪟 Pencere oluşturuluyor...');
        // Backend hazır, şimdi pencereyi oluştur
        createWindow();
        console.log('📌 Tray oluşturuluyor...');
        createTray();
        console.log('✅ Başlatma tamamlandı!');

        // IPC Handlers - Pencere kontrolleri
        ipcMain.on('window-minimize', () => {
            if (mainWindow) mainWindow.minimize();
        });

        ipcMain.on('window-maximize', () => {
            if (mainWindow) {
                if (mainWindow.isMaximized()) {
                    mainWindow.unmaximize();
                } else {
                    mainWindow.maximize();
                }
            }
        });

        ipcMain.on('window-close', () => {
            if (mainWindow) mainWindow.hide();
        });

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Windows'ta tray'de kalmasını sağla
        if (!isQuitting) {
            return;
        }
        app.quit();
    }
});

app.on('before-quit', () => {
    isQuitting = true;
    stopPythonBackend(); // Python'u kapat
});
