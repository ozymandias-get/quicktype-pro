import React, { useState, useEffect, useCallback } from 'react';
import { supportedLanguages, t } from '../i18n/translations';

function Settings({ isOpen, onClose, currentLanguage, onLanguageChange, onThemeChange, currentTheme }) {
    const [languageExpanded, setLanguageExpanded] = useState(false);
    const [themeExpanded, setThemeExpanded] = useState(false);
    const [startupExpanded, setStartupExpanded] = useState(false);
    const [updateExpanded, setUpdateExpanded] = useState(false);

    // Başlangıç ayarları state
    const [launchAtStartup, setLaunchAtStartup] = useState(true);
    const [startMinimized, setStartMinimized] = useState(true);

    // Güncelleme state
    const [appVersion, setAppVersion] = useState('');
    const [updateStatus, setUpdateStatus] = useState('idle'); // idle, checking, available, downloading, ready, error, up-to-date
    const [updateProgress, setUpdateProgress] = useState(0);
    const [updateInfo, setUpdateInfo] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    // Electron ayarlarını ve güncelleme event'lerini yükle
    useEffect(() => {
        if (isOpen && window.electronAPI) {
            // Ayarları yükle
            window.electronAPI.getAutoLaunch?.().then(enabled => {
                setLaunchAtStartup(enabled);
            });
            window.electronAPI.getStartMinimized?.().then(enabled => {
                setStartMinimized(enabled);
            });

            // Uygulama versiyonunu al
            window.electronAPI.getAppVersion?.().then(version => {
                setAppVersion(version);
            });
        }
    }, [isOpen]);

    // Güncelleme event listener'ları
    useEffect(() => {
        if (!window.electronAPI) return;

        const cleanupFns = [];

        // Kontrol ediliyor
        if (window.electronAPI.onUpdateChecking) {
            const cleanup = window.electronAPI.onUpdateChecking(() => {
                setUpdateStatus('checking');
                setUpdateError(null);
            });
            cleanupFns.push(cleanup);
        }

        // Güncelleme mevcut
        if (window.electronAPI.onUpdateAvailable) {
            const cleanup = window.electronAPI.onUpdateAvailable((event, info) => {
                setUpdateStatus('available');
                setUpdateInfo(info);
            });
            cleanupFns.push(cleanup);
        }

        // Güncelleme yok (güncel)
        if (window.electronAPI.onUpdateNotAvailable) {
            const cleanup = window.electronAPI.onUpdateNotAvailable(() => {
                setUpdateStatus('up-to-date');
            });
            cleanupFns.push(cleanup);
        }

        // İndirme ilerlemesi
        if (window.electronAPI.onUpdateProgress) {
            const cleanup = window.electronAPI.onUpdateProgress((event, percent) => {
                setUpdateStatus('downloading');
                setUpdateProgress(percent);
            });
            cleanupFns.push(cleanup);
        }

        // Güncelleme indirildi
        if (window.electronAPI.onUpdateDownloaded) {
            const cleanup = window.electronAPI.onUpdateDownloaded((event, info) => {
                setUpdateStatus('ready');
                setUpdateInfo(info);
            });
            cleanupFns.push(cleanup);
        }

        // Güncelleme hatası
        if (window.electronAPI.onUpdateError) {
            const cleanup = window.electronAPI.onUpdateError((event, error) => {
                setUpdateStatus('error');
                setUpdateError(error?.message || 'Unknown error');
            });
            cleanupFns.push(cleanup);
        }

        return () => {
            cleanupFns.forEach(fn => fn && fn());
        };
    }, []);

    // Güncelleme kontrolü
    const handleCheckForUpdates = useCallback(async () => {
        if (!window.electronAPI?.checkForUpdates) {
            setUpdateStatus('error');
            setUpdateError(t('devModeUpdate', currentLanguage));
            return;
        }

        setUpdateStatus('checking');
        setUpdateError(null);

        try {
            const result = await window.electronAPI.checkForUpdates();

            if (result.status === 'dev-mode') {
                setUpdateStatus('error');
                setUpdateError(t('devModeUpdate', currentLanguage));
            } else if (result.status === 'error') {
                setUpdateStatus('error');
                setUpdateError(result.message);
            }
            // Diğer durumlar event listener'lar tarafından handle edilir
        } catch (error) {
            setUpdateStatus('error');
            setUpdateError(error.message);
        }
    }, [currentLanguage]);

    // Güncellemeyi yükle
    const handleInstallUpdate = useCallback(() => {
        if (window.electronAPI?.installUpdate) {
            window.electronAPI.installUpdate();
        }
    }, []);

    if (!isOpen) return null;

    const handleLanguageSelect = (langCode) => {
        onLanguageChange(langCode);
        setLanguageExpanded(false);
    };

    const handleThemeSelect = (theme) => {
        onThemeChange?.(theme);
        setThemeExpanded(false);
    };

    const handleLaunchAtStartupToggle = () => {
        const newValue = !launchAtStartup;
        setLaunchAtStartup(newValue);
        window.electronAPI?.setAutoLaunch?.(newValue);
    };

    const handleStartMinimizedToggle = () => {
        const newValue = !startMinimized;
        setStartMinimized(newValue);
        window.electronAPI?.setStartMinimized?.(newValue);
    };

    // Mevcut dili bul
    const currentLang = supportedLanguages.find(l => l.code === currentLanguage);

    // Tema seçenekleri
    const themes = [
        { code: 'dark', name: t('darkMode', currentLanguage), icon: '🌙' },
        { code: 'light', name: t('lightMode', currentLanguage), icon: '☀️' },
        { code: 'system', name: t('systemDefault', currentLanguage), icon: '💻' }
    ];

    const getCurrentThemeName = () => {
        const theme = themes.find(th => th.code === currentTheme);
        return theme ? `${theme.icon} ${theme.name}` : `🌙 ${t('darkMode', currentLanguage)}`;
    };

    // Güncelleme durumu metni
    const getUpdateStatusText = () => {
        switch (updateStatus) {
            case 'checking':
                return t('checking', currentLanguage);
            case 'available':
                return t('updateAvailable', currentLanguage);
            case 'downloading':
                return `${t('downloading', currentLanguage)} ${updateProgress}%`;
            case 'ready':
                return t('readyToInstall', currentLanguage);
            case 'up-to-date':
                return t('upToDate', currentLanguage);
            case 'error':
                return t('updateError', currentLanguage);
            default:
                return `v${appVersion}`;
        }
    };

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-modal glass-panel" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="settings-header">
                    <button className="settings-back-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <h2>{t('settings', currentLanguage)}</h2>
                    <div style={{ width: '32px' }}></div>
                </div>

                {/* Settings Content */}
                <div className="settings-content">
                    {/* Theme Section */}
                    <div className="settings-section">
                        <button
                            className={`settings-menu-item ${themeExpanded ? 'expanded' : ''}`}
                            onClick={() => setThemeExpanded(!themeExpanded)}
                        >
                            <div className="settings-menu-icon theme-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                            </div>
                            <div className="settings-menu-info">
                                <span className="settings-menu-label">{t('theme', currentLanguage)}</span>
                                <span className="settings-menu-value">{getCurrentThemeName()}</span>
                            </div>
                            <div className={`settings-menu-arrow ${themeExpanded ? 'rotated' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </button>

                        {/* Theme Options */}
                        <div className={`language-dropdown ${themeExpanded ? 'open' : ''}`}>
                            <div className="language-options">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.code}
                                        className={`language-option ${currentTheme === theme.code ? 'active' : ''}`}
                                        onClick={() => handleThemeSelect(theme.code)}
                                    >
                                        <span className="language-flag">{theme.icon}</span>
                                        <span className="language-name">{theme.name}</span>
                                        {currentTheme === theme.code && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Language Section */}
                    <div className="settings-section">
                        <button
                            className={`settings-menu-item ${languageExpanded ? 'expanded' : ''}`}
                            onClick={() => setLanguageExpanded(!languageExpanded)}
                        >
                            <div className="settings-menu-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                            </div>
                            <div className="settings-menu-info">
                                <span className="settings-menu-label">{t('language', currentLanguage)}</span>
                                <span className="settings-menu-value">
                                    {currentLang?.flag} {currentLang?.name}
                                </span>
                            </div>
                            <div className={`settings-menu-arrow ${languageExpanded ? 'rotated' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </button>

                        {/* Language Options */}
                        <div className={`language-dropdown ${languageExpanded ? 'open' : ''}`}>
                            <div className="language-options">
                                {supportedLanguages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                                        onClick={() => handleLanguageSelect(lang.code)}
                                    >
                                        <span className="language-flag">{lang.flag}</span>
                                        <span className="language-name">{lang.name}</span>
                                        {currentLanguage === lang.code && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Startup Settings Section - Only show in Electron */}
                    {window.electronAPI && (
                        <div className="settings-section">
                            <button
                                className={`settings-menu-item ${startupExpanded ? 'expanded' : ''}`}
                                onClick={() => setStartupExpanded(!startupExpanded)}
                            >
                                <div className="settings-menu-icon startup-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                </div>
                                <div className="settings-menu-info">
                                    <span className="settings-menu-label">{t('launchAtStartup', currentLanguage)}</span>
                                    <span className="settings-menu-value">
                                        {launchAtStartup ? t('on', currentLanguage) : t('off', currentLanguage)}
                                    </span>
                                </div>
                                <div className={`settings-menu-arrow ${startupExpanded ? 'rotated' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </button>

                            {/* Startup Options */}
                            <div className={`language-dropdown ${startupExpanded ? 'open' : ''}`}>
                                <div className="startup-options">
                                    {/* Launch at Startup Toggle */}
                                    <div className="startup-option">
                                        <div className="startup-option-info">
                                            <span className="startup-option-icon">🚀</span>
                                            <div className="startup-option-text">
                                                <span className="startup-option-label">{t('launchAtStartup', currentLanguage)}</span>
                                                <span className="startup-option-desc">{t('launchAtStartupDesc', currentLanguage)}</span>
                                            </div>
                                        </div>
                                        <button
                                            className={`toggle-switch ${launchAtStartup ? 'active' : ''}`}
                                            onClick={handleLaunchAtStartupToggle}
                                        ></button>
                                    </div>

                                    {/* Start Minimized Toggle */}
                                    <div className="startup-option">
                                        <div className="startup-option-info">
                                            <span className="startup-option-icon">🔇</span>
                                            <div className="startup-option-text">
                                                <span className="startup-option-label">{t('startMinimized', currentLanguage)}</span>
                                                <span className="startup-option-desc">{t('startMinimizedDesc', currentLanguage)}</span>
                                            </div>
                                        </div>
                                        <button
                                            className={`toggle-switch ${startMinimized ? 'active' : ''}`}
                                            onClick={handleStartMinimizedToggle}
                                        ></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Updates Section - Only show in Electron */}
                    {window.electronAPI && (
                        <div className="settings-section">
                            <button
                                className={`settings-menu-item ${updateExpanded ? 'expanded' : ''}`}
                                onClick={() => setUpdateExpanded(!updateExpanded)}
                            >
                                <div className="settings-menu-icon update-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                        <path d="M3 3v5h5"></path>
                                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                                        <path d="M16 21h5v-5"></path>
                                    </svg>
                                </div>
                                <div className="settings-menu-info">
                                    <span className="settings-menu-label">{t('updates', currentLanguage)}</span>
                                    <span className={`settings-menu-value ${updateStatus === 'ready' ? 'update-ready' : ''} ${updateStatus === 'error' ? 'update-error-text' : ''}`}>
                                        {getUpdateStatusText()}
                                    </span>
                                </div>
                                <div className={`settings-menu-arrow ${updateExpanded ? 'rotated' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </button>

                            {/* Update Options */}
                            <div className={`language-dropdown ${updateExpanded ? 'open' : ''}`}>
                                <div className="update-options">
                                    {/* Version Info */}
                                    <div className="update-info-row">
                                        <span className="update-info-label">{t('currentVersion', currentLanguage)}</span>
                                        <span className="update-info-value">v{appVersion}</span>
                                    </div>

                                    {/* Update Info (if available) */}
                                    {updateInfo && (
                                        <div className="update-info-row">
                                            <span className="update-info-label">{t('latestVersion', currentLanguage)}</span>
                                            <span className="update-info-value update-new">v{updateInfo.version}</span>
                                        </div>
                                    )}

                                    {/* Progress Bar (if downloading) */}
                                    {updateStatus === 'downloading' && (
                                        <div className="update-progress">
                                            <div className="update-progress-bar">
                                                <div
                                                    className="update-progress-fill"
                                                    style={{ width: `${updateProgress}%` }}
                                                ></div>
                                            </div>
                                            <span className="update-progress-text">{updateProgress}%</span>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {updateStatus === 'error' && updateError && (
                                        <div className="update-error-message">
                                            <span>⚠️ {updateError}</span>
                                        </div>
                                    )}

                                    {/* Up to date message */}
                                    {updateStatus === 'up-to-date' && (
                                        <div className="update-success-message">
                                            <span>✅ {t('upToDate', currentLanguage)}</span>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="update-actions">
                                        {updateStatus === 'ready' ? (
                                            <button
                                                className="update-btn update-btn-install"
                                                onClick={handleInstallUpdate}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                                {t('installAndRestart', currentLanguage)}
                                            </button>
                                        ) : (
                                            <button
                                                className={`update-btn ${updateStatus === 'checking' ? 'checking' : ''}`}
                                                onClick={handleCheckForUpdates}
                                                disabled={updateStatus === 'checking' || updateStatus === 'downloading'}
                                            >
                                                {updateStatus === 'checking' ? (
                                                    <>
                                                        <div className="update-spinner"></div>
                                                        {t('checking', currentLanguage)}
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                                            <path d="M3 3v5h5"></path>
                                                        </svg>
                                                        {t('checkForUpdates', currentLanguage)}
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Settings;
