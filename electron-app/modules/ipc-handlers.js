/**
 * QuickType Pro - IPC Handler'ları Modülü
 * Pencere, ayarlar ve genel IPC iletişimi
 */
const { ipcMain } = require('electron');
const settings = require('./settings');

/**
 * IPC handler'ları kur
 * @param {Function} getMainWindow - Ana pencere getter fonksiyonu
 */
function setupIpcHandlers(getMainWindow) {
    setupWindowHandlers(getMainWindow);
    setupSettingsHandlers();
}

/**
 * Pencere kontrol handler'ları
 * @param {Function} getMainWindow
 */
function setupWindowHandlers(getMainWindow) {
    ipcMain.on('window-minimize', () => {
        const mainWindow = getMainWindow();
        if (mainWindow) mainWindow.minimize();
    });

    ipcMain.on('window-maximize', () => {
        const mainWindow = getMainWindow();
        if (mainWindow) {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        }
    });

    ipcMain.on('window-close', () => {
        const mainWindow = getMainWindow();
        if (mainWindow) mainWindow.hide();
    });
}

/**
 * Ayar handler'ları
 */
function setupSettingsHandlers() {
    // Dil ayarları
    ipcMain.handle('get-language', () => {
        return settings.getLanguage();
    });

    ipcMain.handle('set-language', (event, language) => {
        return settings.setLanguage(language);
    });

    // Tema ayarları
    ipcMain.handle('get-theme', () => {
        return settings.getTheme();
    });

    ipcMain.handle('set-theme', (event, theme) => {
        return settings.setTheme(theme);
    });

    // Başlangıç ayarları
    ipcMain.handle('get-auto-launch', () => {
        return settings.isAutoLaunchEnabled();
    });

    ipcMain.handle('set-auto-launch', (event, enabled) => {
        settings.setAutoLaunch(enabled);
        return enabled;
    });

    ipcMain.handle('get-start-minimized', () => {
        return settings.isStartMinimizedEnabled();
    });

    ipcMain.handle('set-start-minimized', (event, enabled) => {
        settings.setStartMinimized(enabled);
        return enabled;
    });
}

module.exports = {
    setupIpcHandlers
};
