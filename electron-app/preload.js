const { contextBridge, ipcRenderer } = require('electron');

// Güvenli API'ler
contextBridge.exposeInMainWorld('electronAPI', {
    // Pencere kontrolleri
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),

    // Platform bilgisi
    platform: process.platform,

    // Ayarlar listener
    onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),

    // Dil ayarları
    getLanguage: () => ipcRenderer.invoke('get-language'),
    setLanguage: (language) => ipcRenderer.invoke('set-language', language),

    // Tema ayarları
    getTheme: () => ipcRenderer.invoke('get-theme'),
    setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),

    // Başlangıç ayarları
    getAutoLaunch: () => ipcRenderer.invoke('get-auto-launch'),
    setAutoLaunch: (enabled) => ipcRenderer.invoke('set-auto-launch', enabled),
    getStartMinimized: () => ipcRenderer.invoke('get-start-minimized'),
    setStartMinimized: (enabled) => ipcRenderer.invoke('set-start-minimized', enabled),

    // Global hotkey
    onToggleWindow: (callback) => ipcRenderer.on('toggle-window', callback),

    // ==================== GÜNCELLEME API'LERİ ====================
    // Manuel güncelleme kontrolü
    checkForUpdates: () => ipcRenderer.invoke('check-for-updates-manual'),

    // Güncellemeyi yükle ve yeniden başlat
    installUpdate: () => ipcRenderer.send('install-update'),

    // Uygulama versiyonu
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),

    // Güncelleme event listener'ları
    onUpdateChecking: (callback) => {
        ipcRenderer.on('update-checking', callback);
        return () => ipcRenderer.removeListener('update-checking', callback);
    },
    onUpdateAvailable: (callback) => {
        ipcRenderer.on('update-available', callback);
        return () => ipcRenderer.removeListener('update-available', callback);
    },
    onUpdateNotAvailable: (callback) => {
        ipcRenderer.on('update-not-available', callback);
        return () => ipcRenderer.removeListener('update-not-available', callback);
    },
    onUpdateProgress: (callback) => {
        ipcRenderer.on('update-progress', callback);
        return () => ipcRenderer.removeListener('update-progress', callback);
    },
    onUpdateDownloaded: (callback) => {
        ipcRenderer.on('update-downloaded', callback);
        return () => ipcRenderer.removeListener('update-downloaded', callback);
    },
    onUpdateError: (callback) => {
        ipcRenderer.on('update-error', callback);
        return () => ipcRenderer.removeListener('update-error', callback);
    },

    // Electron olduğunu bildir
    isElectron: true
});

// Pencere hazır olduğunda
window.addEventListener('DOMContentLoaded', () => {
    console.log('QuickType Pro Desktop - Electron preload yüklendi');
});
