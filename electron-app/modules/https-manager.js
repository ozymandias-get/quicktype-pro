/**
 * QuickType Pro - HTTPS/Sertifika Yönetimi Modülü
 * Sertifika oluşturma, kontrol ve export IPC handler'ları
 */
const { ipcMain, shell, app } = require('electron');
const os = require('os');
const path = require('path');
const CertificateManager = require('../certificateManager');

// Sertifika yöneticisi instance
let certManager = null;

/**
 * HTTPS IPC handler'ları kur
 * @param {Function} getMainWindow - Ana pencere getter fonksiyonu
 * @param {Function} killBackendProcess - Backend process öldürme fonksiyonu
 */
function setupHttpsHandlers(getMainWindow, killBackendProcess) {
    certManager = new CertificateManager();

    // Sertifika durumunu kontrol et
    ipcMain.handle('check-https-status', async () => {
        const certStatus = certManager.checkExistingCerts();
        const mkcertInstalled = await certManager.checkMkcert();
        const localIP = certManager.getLocalIP();

        let httpsWorking = false;
        if (certStatus.exists) {
            const testResult = await certManager.testHttpsConnection();
            httpsWorking = testResult.success;
        }

        return {
            certificatesExist: certStatus.exists,
            mkcertInstalled,
            httpsWorking,
            localIP,
            httpsUrl: `https://${localIP}:8000`
        };
    });

    // HTTPS kurulumunu başlat
    ipcMain.handle('setup-https', async (event) => {
        try {
            const mainWindow = getMainWindow();
            const result = await certManager.fullSetup((message, progress) => {
                if (mainWindow) {
                    mainWindow.webContents.send('https-setup-progress', { message, progress });
                }
            });

            return result;
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    });

    // Root CA'yı dışa aktar (telefon için)
    ipcMain.handle('export-root-ca', async () => {
        try {
            const destPath = path.join(os.homedir(), 'Desktop', 'QuickType-RootCA.crt');
            await certManager.exportRootCA(destPath);

            // Dosya konumunu aç
            shell.showItemInFolder(destPath);

            return {
                success: true,
                path: destPath,
                message: 'Sertifika masaüstüne kaydedildi'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    });

    // Yerel IP'yi al
    ipcMain.handle('get-local-ip', () => {
        return certManager.getLocalIP();
    });

    // IP değişikliği kontrolü
    ipcMain.handle('check-ip-change', () => {
        return certManager.checkIPChange();
    });

    // Sertifikayı yenile (IP değiştiğinde)
    ipcMain.handle('renew-certificate', async (event) => {
        try {
            const mainWindow = getMainWindow();
            const result = await certManager.generateCertificates((message) => {
                if (mainWindow) {
                    mainWindow.webContents.send('https-setup-progress', { message, progress: 50 });
                }
            });

            return {
                success: true,
                localIP: result.localIP,
                message: 'Sertifika yenilendi! Değişikliklerin uygulanması için sunucuyu yeniden başlatın.'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    });

    // Uygulamayı yeniden başlat
    ipcMain.handle('restart-app', async () => {
        if (killBackendProcess) {
            killBackendProcess();
        }
        await new Promise(r => setTimeout(r, 500));
        app.relaunch();
        app.exit(0);
    });
}

/**
 * Sertifika yöneticisi instance'ını al
 * @returns {CertificateManager|null}
 */
function getCertManager() {
    return certManager;
}

module.exports = {
    setupHttpsHandlers,
    getCertManager
};
