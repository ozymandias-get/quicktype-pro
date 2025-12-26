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

    // Electron olduğunu bildir
    isElectron: true
});

// Pencere hazır olduğunda
window.addEventListener('DOMContentLoaded', () => {
    console.log('QuickType Pro Desktop - Electron preload yüklendi');
});
