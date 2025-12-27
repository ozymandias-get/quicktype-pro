/**
 * QuickType Pro - Otomatik Güncelleme Modülü
 * Uygulama güncelleme kontrolü ve yönetimi
 */
const { app, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

// Referanslar
let mainWindowRef = null;
let isQuittingRef = { value: false };

// Güncelleme ayarları
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

/**
 * Updater'ı başlat
 * @param {Function} getMainWindow - Ana pencere getter fonksiyonu
 * @param {Object} quittingRef - isQuitting referansı { value: boolean }
 */
function initUpdater(getMainWindow, quittingRef) {
    mainWindowRef = getMainWindow;
    isQuittingRef = quittingRef;

    setupEventHandlers();
    setupIpcHandlers();
}

/**
 * Güncelleme kontrolü başlat
 */
function checkForUpdates() {
    if (app.isPackaged) {
        autoUpdater.checkForUpdatesAndNotify();
    }
}

/**
 * Event handler'ları kur
 */
function setupEventHandlers() {
    // Güncelleme bulundu
    autoUpdater.on('update-available', (info) => {
        console.log(`✅ Yeni güncelleme bulundu: v${info.version}`);

        const mainWindow = mainWindowRef();
        if (mainWindow) {
            mainWindow.webContents.send('update-available', info);
        }

        // mainWindow null olabilir, bu durumda parent'sız dialog göster
        const dialogOptions = {
            type: 'info',
            title: 'Güncelleme Mevcut',
            message: `QuickType Pro v${info.version} indiriliyor...`,
            detail: 'Güncelleme arka planda indirilecek. Tamamlandığında bildirim alacaksınız.',
            buttons: ['Tamam']
        };
        if (mainWindow) {
            dialog.showMessageBox(mainWindow, dialogOptions);
        } else {
            dialog.showMessageBox(dialogOptions);
        }
    });

    // Güncelleme yok
    autoUpdater.on('update-not-available', (info) => {
        console.log('✅ Uygulama güncel:', info.version);

        const mainWindow = mainWindowRef();
        if (mainWindow) {
            mainWindow.webContents.send('update-not-available', {
                version: info.version,
                message: 'Uygulama güncel'
            });
        }
    });

    // İndirme ilerlemesi
    autoUpdater.on('download-progress', (progressObj) => {
        const percent = Math.round(progressObj.percent);
        console.log(`📥 İndiriliyor: ${percent}%`);

        const mainWindow = mainWindowRef();
        if (mainWindow) {
            mainWindow.webContents.send('update-progress', percent);
            mainWindow.setProgressBar(percent / 100);
        }
    });

    // Güncelleme indirildi
    autoUpdater.on('update-downloaded', (info) => {
        console.log(`✅ Güncelleme indirildi: v${info.version}`);

        const mainWindow = mainWindowRef();
        if (mainWindow) {
            mainWindow.setProgressBar(-1);
            mainWindow.webContents.send('update-downloaded', info);
        }

        // mainWindow null olabilir
        const dialogOptions = {
            type: 'info',
            title: 'Güncelleme Hazır',
            message: `QuickType Pro v${info.version} yüklenmeye hazır!`,
            detail: 'Şimdi yeniden başlat tuşuna basarak güncellemeyi yükleyebilirsiniz.',
            buttons: ['Şimdi Yeniden Başlat', 'Sonra'],
            defaultId: 0,
            cancelId: 1
        };

        const showPromise = mainWindow
            ? dialog.showMessageBox(mainWindow, dialogOptions)
            : dialog.showMessageBox(dialogOptions);

        showPromise.then((result) => {
            if (result.response === 0) {
                isQuittingRef.value = true;
                autoUpdater.quitAndInstall(false, true);
            }
        });
    });

    // Güncelleme hatası
    autoUpdater.on('error', (error) => {
        console.error('❌ Güncelleme hatası:', error.message);

        const mainWindow = mainWindowRef();
        if (mainWindow) {
            mainWindow.setProgressBar(-1);
            mainWindow.webContents.send('update-error', { message: error.message });
        }
    });
}

/**
 * IPC handler'ları kur
 */
function setupIpcHandlers() {
    // Uygulama versiyonu
    ipcMain.handle('get-app-version', () => {
        return app.getVersion();
    });

    // Manuel güncelleme kontrolü
    ipcMain.handle('check-for-updates-manual', async () => {
        if (!app.isPackaged) {
            console.log('⚠️ Development modunda güncelleme kontrolü atlandı');
            return {
                status: 'dev-mode',
                message: 'Güncelleme kontrolü sadece production modunda çalışır'
            };
        }

        console.log('🔄 Manuel güncelleme kontrolü başlatılıyor...');

        const mainWindow = mainWindowRef();
        if (mainWindow) {
            mainWindow.webContents.send('update-checking');
        }

        try {
            const result = await autoUpdater.checkForUpdates();
            return {
                status: 'checking',
                currentVersion: app.getVersion(),
                latestVersion: result?.updateInfo?.version
            };
        } catch (error) {
            console.error('❌ Güncelleme kontrolü hatası:', error.message);
            return {
                status: 'error',
                message: error.message
            };
        }
    });

    // Güncellemeyi yükle
    ipcMain.on('install-update', () => {
        console.log('🔄 Güncelleme yükleniyor ve yeniden başlatılıyor...');
        isQuittingRef.value = true;
        autoUpdater.quitAndInstall(false, true);
    });

    // Eski check-for-updates (geri uyumluluk)
    ipcMain.on('check-for-updates', () => {
        checkForUpdates();
    });
}

module.exports = {
    initUpdater,
    checkForUpdates
};
