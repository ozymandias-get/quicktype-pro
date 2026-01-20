import React, { useState, useEffect } from 'react';
import { t } from '../../i18n/translations';
import { APP_CONSTANTS } from '../../constants';

function StartupSettings({ language = APP_CONSTANTS.DEFAULT_LANGUAGE }) {
    const [expanded, setExpanded] = useState(false);
    const [launchAtStartup, setLaunchAtStartup] = useState(true);
    const [startMinimized, setStartMinimized] = useState(true);

    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.getAutoLaunch?.().then(enabled => {
                setLaunchAtStartup(enabled);
            });
            window.electronAPI.getStartMinimized?.().then(enabled => {
                setStartMinimized(enabled);
            });
        }
    }, []);

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

    if (!window.electronAPI) return null;

    return (
        <div className="settings-section">
            <button
                className={`settings-menu-item ${expanded ? 'expanded' : ''}`}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="settings-menu-icon startup-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
                <div className="settings-menu-info">
                    <span className="settings-menu-label">{t('launchAtStartup', language)}</span>
                    <span className="settings-menu-value">
                        {launchAtStartup ? t('on', language) : t('off', language)}
                    </span>
                </div>
                <div className={`settings-menu-arrow ${expanded ? 'rotated' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </button>

            {/* Startup Options */}
            <div className={`language-dropdown ${expanded ? 'open' : ''}`}>
                <div className="startup-options">
                    {/* Launch at Startup Toggle */}
                    <div className="startup-option">
                        <div className="startup-option-info">
                            <span className="startup-option-icon">🚀</span>
                            <div className="startup-option-text">
                                <span className="startup-option-label">{t('launchAtStartup', language)}</span>
                                <span className="startup-option-desc">{t('launchAtStartupDesc', language)}</span>
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
                                <span className="startup-option-label">{t('startMinimized', language)}</span>
                                <span className="startup-option-desc">{t('startMinimizedDesc', language)}</span>
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
    );
}

export default StartupSettings;
