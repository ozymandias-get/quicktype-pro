import React, { useState } from 'react';
import { t } from '../i18n/translations';
import { useAutoUpdate } from '../hooks/useAutoUpdate';
import HttpsSettings from './HttpsSettings';
import ThemeSettings from './settings/ThemeSettings';
import LanguageSettings from './settings/LanguageSettings';
import StartupSettings from './settings/StartupSettings';
import UpdateSettings from './settings/UpdateSettings';
import '../styles/https.css';

function Settings({ isOpen, onClose, currentLanguage, onLanguageChange, onThemeChange, currentTheme }) {
    const [httpsExpanded, setHttpsExpanded] = useState(false);

    // Auto-update logic hoisted here so it persists even when modal is closed
    const updateState = useAutoUpdate(currentLanguage);

    if (!isOpen) return null;

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
                    <div className="settings-spacer"></div>
                </div>

                {/* Settings Content */}
                <div className="settings-content">
                    {/* Theme Section */}
                    <ThemeSettings
                        currentTheme={currentTheme}
                        onThemeChange={onThemeChange}
                        language={currentLanguage}
                    />

                    {/* Language Section */}
                    <LanguageSettings
                        currentLanguage={currentLanguage}
                        onLanguageChange={onLanguageChange}
                    />

                    {/* Startup Settings Section - Only show in Electron */}
                    <StartupSettings language={currentLanguage} />

                    {/* HTTPS/Security Section - Only show in Electron */}
                    {window.electronAPI && (
                        <div className="settings-section">
                            <button
                                className={`settings-menu-item ${httpsExpanded ? 'expanded' : ''}`}
                                onClick={() => setHttpsExpanded(!httpsExpanded)}
                            >
                                <div className="settings-menu-icon https-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                                <div className="settings-menu-info">
                                    <span className="settings-menu-label">{t('httpsSettings', currentLanguage)}</span>
                                    <span className="settings-menu-value">{t('faceIdReady', currentLanguage)}</span>
                                </div>
                                <div className={`settings-menu-arrow ${httpsExpanded ? 'rotated' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </button>

                            {/* HTTPS Options */}
                            <div className={`language-dropdown ${httpsExpanded ? 'open' : ''}`}>
                                <HttpsSettings language={currentLanguage} />
                            </div>
                        </div>
                    )}

                    {/* Updates Section - Only show in Electron, passes prop now */}
                    <UpdateSettings
                        language={currentLanguage}
                        updateState={updateState}
                    />
                </div>
            </div>
        </div>
    );
}

export default Settings;
