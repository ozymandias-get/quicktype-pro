/**
 * QuickType Pro - Electron Ana Giriş Noktası
 * Modüler yapı ile organize edilmiş masaüstü uygulaması
 * 
 * Modüller:
 * - settings.js: Ayarlar yönetimi
 * - backend.js: Python backend yönetimi
 * - window.js: Pencere ve tray yönetimi
 * - updater.js: Otomatik güncelleme
 * - ipc-handlers.js: Genel IPC handler'ları
 * - https-manager.js: HTTPS/Sertifika yönetimi
 */
const { app, BrowserWindow, globalShortcut } = require('electron');

// ==================== MODÜL İMPORTLARI ====================
const settings = require('./modules/settings');
const backend = require('./modules/backend');
const windowManager = require('./modules/window');
const updater = require('./modules/updater');
const ipcHandlers = require('./modules/ipc-handlers');
const httpsManager = require('./modules/https-manager');

// ==================== HTTPS/SSL YAPLANDIRMASI ====================
// Self-signed sertifikalar için (development modunda)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// ==================== GLOBAL STATE ====================
let startMinimized = false;

// Quitting state referansı (updater için)
const quittingRef = {
    get value() { return windowManager.getQuitting(); },
    set value(v) { windowManager.setQuitting(v); }
};

// ==================== TEK INSTANCE KONTROLÜ ====================
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    // İkinci instance açıldığında
    app.on('second-instance', () => {
        const mainWindow = windowManager.getMainWindow();
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    });

    // ==================== UYGULAMA HAZIR ====================
    app.whenReady().then(async () => {
        console.log('🚀 App ready, başlatılıyor...');

        // İlk çalıştırmada varsayılan ayarları set et
        const currentSettings = settings.loadSettings();
        if (currentSettings.autoLaunch === undefined) {
            settings.setAutoLaunch(true);
            settings.setStartMinimized(true);
        }

        // Dil ayarı yoksa log
        if (currentSettings.language === undefined) {
            console.log('🌐 İlk çalıştırma - dil seçimi bekliyor');
        }

        // --hidden argümanı ile başlatıldıysa
        startMinimized = process.argv.includes('--hidden');

        // ==================== BACKEND BAŞLATMA ====================
        try {
            let backendReady = await backend.checkBackendReady();

            if (!backendReady) {
                await backend.startPythonBackend();
                backendReady = await backend.waitForBackend();

                if (!backendReady) {
                    console.error('❌ Backend başlatılamadı!');
                    app.quit();
                    return;
                }
            }
        } catch (error) {
            console.error('❌ Backend hatası:', error.message);
            app.quit();
            return;
        }

        console.log('✅ QuickType Pro başlatıldı');

        // ==================== UI OLUŞTURMA ====================
        windowManager.createWindow(startMinimized);
        windowManager.createTray();

        // ==================== IPC HANDLER'LARI KUR ====================
        ipcHandlers.setupIpcHandlers(windowManager.getMainWindow);
        httpsManager.setupHttpsHandlers(
            windowManager.getMainWindow,
            backend.killPythonProcess
        );

        // ==================== GÜNCELLEME SİSTEMİ ====================
        updater.initUpdater(windowManager.getMainWindow, quittingRef);

        // Güncelleme kontrolü (10 saniye sonra)
        setTimeout(() => {
            updater.checkForUpdates();
        }, 10000);

        // ==================== GLOBAL HOTKEY ====================
        const toggleWindowShortcut = 'CommandOrControl+Shift+Q';
        const registered = globalShortcut.register(toggleWindowShortcut, () => {
            const mainWindow = windowManager.getMainWindow();
            if (mainWindow) {
                if (mainWindow.isVisible()) {
                    mainWindow.hide();
                } else {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        });

        if (!registered) {
            console.warn('Hotkey kaydedilemedi');
        }

        // macOS aktivasyon
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                windowManager.createWindow(startMinimized);
            }
        });
    });
}

// ==================== UYGULAMA YAŞAM DÖNGÜSÜ ====================
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (!windowManager.getQuitting()) {
            return; // Tray'de kal
        }
        app.quit();
    }
});

app.on('before-quit', () => {
    windowManager.setQuitting(true);
    globalShortcut.unregisterAll();
    backend.stopPythonBackend();
});
