/**
 * QuickType Pro - Pencere ve Tray Yönetimi Modülü
 * Ana pencere ve system tray oluşturma/yönetim
 */
const { BrowserWindow, Tray, Menu, nativeImage, shell } = require('electron');
const path = require('path');
const settings = require('./settings');
const { BACKEND_URL } = require('./backend');

// Referanslar
let mainWindow = null;
let tray = null;
let isQuitting = false;

/**
 * isQuitting durumunu set et
 * @param {boolean} value
 */
function setQuitting(value) {
    isQuitting = value;
}

/**
 * isQuitting durumunu al
 * @returns {boolean}
 */
function getQuitting() {
    return isQuitting;
}

/**
 * Ana pencereyi oluştur
 * @param {boolean} startMinimized - Gizli başlat mı
 * @returns {BrowserWindow}
 */
function createWindow(startMinimized = false) {
    const launchedHidden = process.argv.includes('--hidden');
    const shouldStartMinimized = launchedHidden || (startMinimized && settings.isStartMinimizedEnabled());

    // Menü çubuğunu kaldır
    Menu.setApplicationMenu(null);

    mainWindow = new BrowserWindow({
        width: 420,
        height: 700,
        minWidth: 380,
        minHeight: 500,
        frame: true,
        autoHideMenuBar: true,
        backgroundColor: '#050a15',
        titleBarStyle: 'default',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '..', 'preload.js')
        },
        icon: path.join(__dirname, '..', 'public', 'icon.png'),
        show: false,
        skipTaskbar: false,
        resizable: true,
        alwaysOnTop: false
    });

    // Development veya production moduna göre URL
    let startUrl = process.env.ELECTRON_START_URL ||
        `file://${path.join(__dirname, '..', 'build', 'index.html')}`;

    // Dev modunda HTTP protokolünü zorla ve sadece yükle
    if (startUrl.includes('localhost:3000') || startUrl.includes('127.0.0.1:3000')) {
        startUrl = startUrl.replace('https://', 'http://');
    }

    console.log('� Yüklenen URL:', startUrl);
    mainWindow.loadURL(startUrl);

    // HTTPS hatalarını sadece logla (yeniden deneme yapma - sonsuz döngü önlenir)
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        if (errorCode === -501 || errorDescription.includes('SSL')) {
            console.log('⚠️ SSL hatası (yoksayılıyor):', validatedURL);
        }
    });

    // Hazır olunca göster
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

    return mainWindow;
}

/**
 * System tray oluştur
 * @returns {Tray}
 */
function createTray() {
    const iconPath = path.join(__dirname, '..', 'public', 'icon.png');
    let trayIcon;

    try {
        trayIcon = nativeImage.createFromPath(iconPath);
        trayIcon = trayIcon.resize({ width: 16, height: 16 });
    } catch (e) {
        trayIcon = nativeImage.createEmpty();
    }

    tray = new Tray(trayIcon);
    tray.setToolTip('QuickType Pro - Pano Yönetimi');

    const autoLaunchEnabled = settings.isAutoLaunchEnabled();
    const startMinimizedEnabled = settings.isStartMinimizedEnabled();

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
                settings.setAutoLaunch(menuItem.checked);
            }
        },
        {
            label: '🔇 Arka Planda Başlat',
            type: 'checkbox',
            checked: startMinimizedEnabled,
            click: (menuItem) => {
                settings.setStartMinimized(menuItem.checked);
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
                const { app } = require('electron');
                isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);

    // Tray'e tıklayınca pencereyi göster/gizle
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

    return tray;
}

/**
 * Ana pencere referansını al
 * @returns {BrowserWindow|null}
 */
function getMainWindow() {
    return mainWindow;
}

/**
 * Tray referansını al
 * @returns {Tray|null}
 */
function getTray() {
    return tray;
}

module.exports = {
    createWindow,
    createTray,
    getMainWindow,
    getTray,
    setQuitting,
    getQuitting
};
