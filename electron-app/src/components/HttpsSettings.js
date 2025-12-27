import React, { useState, useEffect, useCallback } from 'react';

/**
 * HTTPS Sertifika Kurulum Bileşeni
 * Electron uygulaması içinden sertifika kurulumu yönetir
 */
function HttpsSettings({ language = 'en' }) {
    const [status, setStatus] = useState({
        loading: true,
        certificatesExist: false,
        mkcertInstalled: false,
        httpsWorking: false,
        localIP: '',
        httpsUrl: ''
    });

    const [ipChange, setIpChange] = useState({
        checked: false,
        changed: false,
        currentIP: '',
        certIP: '',
        message: ''
    });

    const [setupInProgress, setSetupInProgress] = useState(false);
    const [setupProgress, setSetupProgress] = useState({ message: '', progress: 0 });
    const [setupResult, setSetupResult] = useState(null);

    // Çeviriler
    const translations = {
        en: {
            httpsSettings: 'HTTPS / Security',
            httpsStatus: 'HTTPS Status',
            active: 'Active',
            inactive: 'Inactive',
            notConfigured: 'Not Configured',
            localIP: 'Local IP',
            httpsUrl: 'HTTPS URL',
            setupHttps: 'Setup HTTPS',
            setupInProgress: 'Setting up...',
            exportCert: 'Export for Phone',
            exportCertDesc: 'Save certificate to desktop for mobile devices',
            setupComplete: 'HTTPS Setup Complete!',
            setupFailed: 'Setup Failed',
            mkcertRequired: 'mkcert will be installed automatically',
            adminRequired: 'Administrator privileges may be required',
            phoneInstructions: 'Phone Instructions',
            iphoneSteps: 'iPhone: Settings → General → VPN & Device Management → Install',
            androidSteps: 'Android: Open file → Install as CA Certificate',
            ipChanged: 'IP Changed!',
            ipChangedDesc: 'Your IP address changed. Renew certificate for phone connection.',
            renewCert: 'Renew Certificate',
            renewing: 'Renewing...',
            staticIpTip: '💡 Tip: Set a static IP in Windows Network Settings to avoid this issue.',
            restartingIn: 'Restarting in',
            seconds: 'seconds...',
            restartNow: 'Restart Now'
        },
        tr: {
            httpsSettings: 'HTTPS / Güvenlik',
            httpsStatus: 'HTTPS Durumu',
            active: 'Aktif',
            inactive: 'Pasif',
            notConfigured: 'Yapılandırılmamış',
            localIP: 'Yerel IP',
            httpsUrl: 'HTTPS Adresi',
            setupHttps: 'HTTPS Kur',
            setupInProgress: 'Kuruluyor...',
            exportCert: 'Telefon için Dışa Aktar',
            exportCertDesc: 'Mobil cihazlar için sertifikayı masaüstüne kaydet',
            setupComplete: 'HTTPS Kurulumu Tamamlandı!',
            setupFailed: 'Kurulum Başarısız',
            mkcertRequired: 'mkcert otomatik olarak yüklenecek',
            adminRequired: 'Yönetici izinleri gerekebilir',
            phoneInstructions: 'Telefon Talimatları',
            iphoneSteps: 'iPhone: Ayarlar → Genel → VPN ve Cihaz Yönetimi → Yükle',
            androidSteps: 'Android: Dosyayı aç → CA Sertifikası olarak yükle',
            ipChanged: 'IP Değişti!',
            ipChangedDesc: 'IP adresiniz değişti. Telefon bağlantısı için sertifikayı yenileyin.',
            renewCert: 'Sertifikayı Yenile',
            renewing: 'Yenileniyor...',
            staticIpTip: '💡 İpucu: Bu sorunu kalıcı olarak çözmek için Windows Ağ Ayarlarından sabit IP belirleyin.',
            restartingIn: 'Yeniden başlatılıyor',
            seconds: 'saniye...',
            restartNow: 'Şimdi Yeniden Başlat'
        }
    };

    const t = (key) => translations[language]?.[key] || translations.en[key] || key;

    // HTTPS durumunu kontrol et
    const checkStatus = useCallback(async () => {
        if (!window.electronAPI?.checkHttpsStatus) {
            setStatus(prev => ({ ...prev, loading: false }));
            return;
        }

        try {
            const result = await window.electronAPI.checkHttpsStatus();
            setStatus({
                loading: false,
                ...result
            });
        } catch (error) {
            console.error('HTTPS status check failed:', error);
            setStatus(prev => ({ ...prev, loading: false }));
        }
    }, []);

    useEffect(() => {
        checkStatus();
        checkIPChange();

        // Progress listener
        if (window.electronAPI?.onHttpsSetupProgress) {
            const cleanup = window.electronAPI.onHttpsSetupProgress((event, data) => {
                setSetupProgress(data);
            });
            return cleanup;
        }
    }, [checkStatus]);

    // IP değişikliği kontrolü
    const checkIPChange = async () => {
        if (!window.electronAPI?.checkIPChange) return;

        try {
            const result = await window.electronAPI.checkIPChange();
            setIpChange({
                checked: true,
                ...result
            });
        } catch (error) {
            console.error('IP change check failed:', error);
        }
    };

    // HTTPS kurulumunu başlat
    const handleSetupHttps = async () => {
        if (!window.electronAPI?.setupHttps) return;

        setSetupInProgress(true);
        setSetupResult(null);
        setSetupProgress({ message: '', progress: 0 });

        try {
            const result = await window.electronAPI.setupHttps();
            setSetupResult(result);

            if (result.success) {
                // Durumu yeniden kontrol et
                await checkStatus();
            }
        } catch (error) {
            setSetupResult({
                success: false,
                message: error.message
            });
        } finally {
            setSetupInProgress(false);
        }
    };

    // Root CA dışa aktar
    const handleExportCert = async () => {
        if (!window.electronAPI?.exportRootCA) return;

        try {
            const result = await window.electronAPI.exportRootCA();
            if (result.success) {
                setSetupResult({
                    success: true,
                    message: result.message
                });
            }
        } catch (error) {
            setSetupResult({
                success: false,
                message: error.message
            });
        }
    };

    // Sertifikayı yenile (IP değiştiğinde)
    const [restartCountdown, setRestartCountdown] = useState(null);

    const handleRenewCert = async () => {
        if (!window.electronAPI?.renewCertificate) return;

        setSetupInProgress(true);
        setSetupResult(null);

        try {
            const result = await window.electronAPI.renewCertificate();
            setSetupResult(result);

            if (result.success) {
                // IP değişikliği durumunu sıfırla
                setIpChange(prev => ({ ...prev, changed: false, certIP: result.localIP }));

                // 3 saniye geri sayım başlat
                setRestartCountdown(3);

                const countdownInterval = setInterval(() => {
                    setRestartCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(countdownInterval);
                            // Uygulamayı yeniden başlat
                            window.electronAPI?.restartApp?.();
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } catch (error) {
            setSetupResult({
                success: false,
                message: error.message
            });
        } finally {
            setSetupInProgress(false);
        }
    };

    // Manuel olarak hemen yeniden başlat
    const handleRestartNow = () => {
        window.electronAPI?.restartApp?.();
    };

    // Electron değilse gösterme
    if (!window.electronAPI) {
        return null;
    }

    const getStatusBadge = () => {
        if (status.loading) {
            return <span className="https-status-badge loading">...</span>;
        }
        if (status.httpsWorking) {
            return <span className="https-status-badge active">🔒 {t('active')}</span>;
        }
        if (status.certificatesExist) {
            return <span className="https-status-badge inactive">⚠️ {t('inactive')}</span>;
        }
        return <span className="https-status-badge not-configured">❌ {t('notConfigured')}</span>;
    };

    return (
        <div className="https-settings">
            {/* Status Header */}
            <div className="https-status-header">
                <div className="https-status-info">
                    <span className="https-status-label">{t('httpsStatus')}</span>
                    {getStatusBadge()}
                </div>
                {status.localIP && (
                    <div className="https-ip-info">
                        <span className="https-ip-label">{t('localIP')}:</span>
                        <code className="https-ip-value">{status.localIP}</code>
                    </div>
                )}
            </div>

            {/* HTTPS URL */}
            {status.httpsUrl && status.certificatesExist && (
                <div className="https-url-display">
                    <span className="https-url-label">{t('httpsUrl')}:</span>
                    <code className="https-url-value">{status.httpsUrl}</code>
                </div>
            )}

            {/* Setup Progress */}
            {setupInProgress && (
                <div className="https-progress">
                    <div className="https-progress-bar">
                        <div
                            className="https-progress-fill"
                            style={{ width: `${setupProgress.progress}%` }}
                        />
                    </div>
                    <span className="https-progress-text">{setupProgress.message}</span>
                </div>
            )}

            {/* Setup Result */}
            {setupResult && (
                <div className={`https-result ${setupResult.success ? 'success' : 'error'}`}>
                    {setupResult.success ? '✅' : '❌'} {setupResult.message}

                    {/* Restart countdown */}
                    {setupResult.success && restartCountdown !== null && restartCountdown > 0 && (
                        <div className="https-restart-countdown">
                            <p>{t('restartingIn')} <strong>{restartCountdown}</strong> {t('seconds')}</p>
                            <button className="https-restart-now-btn" onClick={handleRestartNow}>
                                {t('restartNow')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* IP Change Warning */}
            {ipChange.checked && ipChange.changed && status.certificatesExist && (
                <div className="https-ip-warning">
                    <div className="https-ip-warning-header">
                        <span className="https-ip-warning-icon">⚠️</span>
                        <span className="https-ip-warning-title">{t('ipChanged')}</span>
                    </div>
                    <p className="https-ip-warning-desc">{t('ipChangedDesc')}</p>
                    <div className="https-ip-warning-details">
                        <span>📍 {ipChange.certIP} → {ipChange.currentIP}</span>
                    </div>
                    <button
                        className="https-renew-btn"
                        onClick={handleRenewCert}
                        disabled={setupInProgress}
                    >
                        {setupInProgress ? (
                            <>
                                <div className="https-spinner" />
                                {t('renewing')}
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                    <path d="M3 3v5h5"></path>
                                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                                    <path d="M16 21h5v-5"></path>
                                </svg>
                                {t('renewCert')}
                            </>
                        )}
                    </button>

                    {/* Static IP Tip */}
                    <div className="https-static-ip-tip">
                        <span>{t('staticIpTip')}</span>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="https-actions">
                {/* Setup Button */}
                {!status.certificatesExist && (
                    <button
                        className="https-setup-btn"
                        onClick={handleSetupHttps}
                        disabled={setupInProgress}
                    >
                        {setupInProgress ? (
                            <>
                                <div className="https-spinner" />
                                {t('setupInProgress')}
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                {t('setupHttps')}
                            </>
                        )}
                    </button>
                )}

                {/* Export Certificate Button */}
                {status.certificatesExist && (
                    <button
                        className="https-export-btn"
                        onClick={handleExportCert}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        {t('exportCert')}
                    </button>
                )}
            </div>

            {/* Setup Info */}
            {!status.certificatesExist && !setupInProgress && (
                <div className="https-setup-info">
                    <p>ℹ️ {t('mkcertRequired')}</p>
                    <p>⚠️ {t('adminRequired')}</p>
                </div>
            )}

            {/* Phone Instructions */}
            {status.certificatesExist && (
                <div className="https-phone-instructions">
                    <h4>📱 {t('phoneInstructions')}</h4>
                    <ul>
                        <li>{t('iphoneSteps')}</li>
                        <li>{t('androidSteps')}</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default HttpsSettings;
