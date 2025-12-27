/**
 * QuickType Pro - HTTPS Sertifika Yöneticisi
 * Electron uygulaması içinden mkcert kurulumu ve sertifika yönetimi
 */

const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const https = require('https');
const os = require('os');

class CertificateManager {
    constructor() {
        this.certsDir = this.getCertsDir();
        this.mkcertInstalled = false;
        // Önbellek - tekrar eden logları önlemek için
        this._cache = {
            certs: null,
            mkcert: null,
            localIP: null,
            lastCertCheck: 0,
            lastMkcertCheck: 0,
            lastIPCheck: 0
        };
        // Cache süresi (60 saniye - logları azaltmak için)
        this._cacheTTL = 60000;
        this._loggedOnce = { certs: false, mkcert: false, ip: false };
    }

    /**
     * Sertifika dizinini belirle
     */
    getCertsDir() {
        // Production: resourcesPath içinde
        // Development: proje kök dizininde
        if (process.resourcesPath && fs.existsSync(path.join(process.resourcesPath, 'backend'))) {
            return path.join(process.resourcesPath, 'certs');
        }
        return path.join(__dirname, '..', 'certs');
    }

    /**
     * Sertifika dizinini oluştur
     */
    ensureCertsDir() {
        if (!fs.existsSync(this.certsDir)) {
            fs.mkdirSync(this.certsDir, { recursive: true });
        }
    }

    /**
     * Mevcut sertifikaları kontrol et (önbellekli)
     */
    checkExistingCerts(forceRefresh = false) {
        const now = Date.now();

        // Cache geçerliyse cached değeri döndür
        if (!forceRefresh && this._cache.certs && (now - this._cache.lastCertCheck) < this._cacheTTL) {
            return this._cache.certs;
        }

        const certNames = [
            ['localhost+2.pem', 'localhost+2-key.pem'],
            ['cert.pem', 'key.pem'],
            ['server.crt', 'server.key']
        ];

        for (const [cert, key] of certNames) {
            const certPath = path.join(this.certsDir, cert);
            const keyPath = path.join(this.certsDir, key);

            if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
                this._cache.certs = {
                    exists: true,
                    certPath,
                    keyPath,
                    certName: cert
                };
                this._cache.lastCertCheck = now;
                return this._cache.certs;
            }
        }


        this._cache.certs = { exists: false };
        this._cache.lastCertCheck = now;
        return this._cache.certs;
    }

    /**
     * Sertifikadaki IP'yi oku (dosya adından veya openssl ile)
     */
    getCertificateIP() {
        const certPath = path.join(this.certsDir, 'localhost+2.pem');

        if (!fs.existsSync(certPath)) {
            return null;
        }

        // Sertifika oluşturulduğunda IP'yi ayrı bir dosyada saklayalım
        const ipFilePath = path.join(this.certsDir, '.cert-ip');

        if (fs.existsSync(ipFilePath)) {
            try {
                return fs.readFileSync(ipFilePath, 'utf-8').trim();
            } catch (e) {
                return null;
            }
        }

        return null;
    }

    /**
     * Sertifika IP'sini kaydet
     */
    saveCertificateIP(ip) {
        const ipFilePath = path.join(this.certsDir, '.cert-ip');
        try {
            fs.writeFileSync(ipFilePath, ip, 'utf-8');
        } catch (e) {
            // Sessiz hata
        }
    }

    /**
     * IP değişikliği kontrolü
     * @returns {object} { changed: boolean, currentIP: string, certIP: string|null }
     */
    checkIPChange() {
        const currentIP = this.getLocalIP();
        const certIP = this.getCertificateIP();

        // Sertifika yoksa veya IP kaydedilmemişse
        if (!certIP) {
            return {
                changed: false,
                needsRenewal: false,
                currentIP,
                certIP: null,
                message: 'Sertifika IP bilgisi bulunamadı'
            };
        }

        const changed = currentIP !== certIP;

        return {
            changed,
            needsRenewal: changed,
            currentIP,
            certIP,
            message: changed
                ? `IP değişti (${certIP} → ${currentIP}). Sertifika yenilenmeli.`
                : 'IP değişmedi'
        };
    }

    /**
     * mkcert yüklü mü kontrol et (önbellekli)
     */
    async checkMkcert(forceRefresh = false) {
        const now = Date.now();

        // Cache geçerliyse cached değeri döndür
        if (!forceRefresh && this._cache.mkcert !== null && (now - this._cache.lastMkcertCheck) < this._cacheTTL) {
            return this._cache.mkcert;
        }

        return new Promise((resolve) => {
            exec('mkcert -version', (error) => {
                this.mkcertInstalled = !error;
                this._cache.mkcert = !error;
                this._cache.lastMkcertCheck = now;
                resolve(this._cache.mkcert);
            });
        });
    }

    /**
     * mkcert'i winget ile yükle
     */
    async installMkcert(progressCallback) {
        return new Promise((resolve, reject) => {
            progressCallback?.('mkcert yükleniyor...');

            exec(
                'winget install FiloSottile.mkcert --accept-package-agreements --accept-source-agreements',
                { timeout: 120000 },
                (error) => {
                    if (error) {
                        reject(new Error('mkcert yüklenemedi'));
                    } else {
                        const newPath = `${process.env.Path};${process.env.LOCALAPPDATA}\\Microsoft\\WinGet\\Packages\\FiloSottile.mkcert_Microsoft.Winget.Source_8wekyb3d8bbwe`;
                        process.env.Path = newPath;
                        this.mkcertInstalled = true;
                        resolve(true);
                    }
                }
            );
        });
    }

    /**
     * Root CA'yı yükle (tarayıcıların güvenmesi için)
     */
    async installRootCA(progressCallback) {
        return new Promise((resolve) => {
            progressCallback?.('Root CA kuruluyor...');
            exec('mkcert -install', { timeout: 30000 }, () => resolve(true));
        });
    }

    /**
     * Yerel IP adresini bul (önbellekli)
     */
    getLocalIP(forceRefresh = false) {
        const now = Date.now();

        // Cache geçerliyse cached değeri döndür (IP için daha uzun cache - 30 saniye)
        if (!forceRefresh && this._cache.localIP && (now - this._cache.lastIPCheck) < 30000) {
            return this._cache.localIP;
        }

        const interfaces = os.networkInterfaces();

        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                // IPv4, internal olmayan, özel ağ aralığında
                if (iface.family === 'IPv4' && !iface.internal) {
                    if (iface.address.startsWith('192.168.') ||
                        iface.address.startsWith('10.') ||
                        iface.address.startsWith('172.')) {
                        this._cache.localIP = iface.address;
                        this._cache.lastIPCheck = now;
                        return iface.address;
                    }
                }
            }
        }


        this._cache.localIP = '192.168.1.1';
        this._cache.lastIPCheck = now;
        return '192.168.1.1';
    }

    /**
     * SSL sertifikalarını oluştur
     */
    async generateCertificates(progressCallback) {
        return new Promise((resolve, reject) => {
            this.ensureCertsDir();
            const localIP = this.getLocalIP();
            progressCallback?.('Sertifikalar oluşturuluyor...');

            // Eski sertifikaları sil
            ['localhost+2.pem', 'localhost+2-key.pem'].forEach(f => {
                const filePath = path.join(this.certsDir, f);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            });

            exec(
                `mkcert -cert-file localhost+2.pem -key-file localhost+2-key.pem localhost 127.0.0.1 ${localIP}`,
                { cwd: this.certsDir, timeout: 30000 },
                (error) => {
                    if (error) {
                        reject(new Error('Sertifika oluşturulamadı'));
                    } else {
                        this.saveCertificateIP(localIP);
                        resolve({
                            success: true,
                            localIP,
                            certPath: path.join(this.certsDir, 'localhost+2.pem'),
                            keyPath: path.join(this.certsDir, 'localhost+2-key.pem')
                        });
                    }
                }
            );
        });
    }

    /**
     * Root CA'yı dışa aktar (telefon için)
     */
    async exportRootCA(destPath) {
        return new Promise((resolve, reject) => {
            exec('mkcert -CAROOT', (error, stdout) => {
                if (error) {
                    reject(error);
                    return;
                }

                const caRoot = stdout.trim();
                const rootCAPath = path.join(caRoot, 'rootCA.pem');

                if (!fs.existsSync(rootCAPath)) {
                    reject(new Error('Root CA dosyası bulunamadı'));
                    return;
                }

                const destFile = destPath || path.join(os.homedir(), 'Desktop', 'QuickType-RootCA.crt');
                fs.copyFileSync(rootCAPath, destFile);
                resolve(destFile);
            });
        });
    }

    /**
     * Tam kurulum akışı
     */
    async fullSetup(progressCallback) {
        const result = {
            success: false,
            message: '',
            localIP: '',
            httpsUrl: ''
        };

        try {
            // 1. mkcert kontrolü
            progressCallback?.('mkcert kontrol ediliyor...', 10);
            const hasMkcert = await this.checkMkcert();

            if (!hasMkcert) {
                // 2. mkcert yükle
                progressCallback?.('mkcert yükleniyor (bu biraz sürebilir)...', 20);
                await this.installMkcert(progressCallback);
            }

            // 3. Root CA kur
            progressCallback?.('Güvenlik sertifikaları hazırlanıyor...', 50);
            await this.installRootCA(progressCallback);

            // 4. Sertifikaları oluştur
            progressCallback?.('SSL sertifikaları oluşturuluyor...', 70);
            const certResult = await this.generateCertificates(progressCallback);

            // 5. Sonuç
            progressCallback?.('Kurulum tamamlandı!', 100);

            result.success = true;
            result.localIP = certResult.localIP;
            result.httpsUrl = `https://${certResult.localIP}:8000`;
            result.message = 'HTTPS kurulumu başarıyla tamamlandı!';

            return result;

        } catch (error) {
            result.message = error.message;
            return result;
        }
    }

    /**
     * HTTPS bağlantısını test et
     */
    async testHttpsConnection(url = 'https://127.0.0.1:8000/api/status') {
        return new Promise((resolve) => {
            const req = https.get(url, { rejectUnauthorized: false }, (res) => {
                resolve({
                    success: res.statusCode === 200,
                    statusCode: res.statusCode
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    error: error.message
                });
            });

            req.setTimeout(3000, () => {
                req.destroy();
                resolve({
                    success: false,
                    error: 'Timeout'
                });
            });
        });
    }
}

module.exports = CertificateManager;
