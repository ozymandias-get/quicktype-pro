import React, { useState } from 'react';
import { t } from '../../i18n/translations';
import { APP_CONSTANTS } from '../../constants';

function ThemeSettings({ currentTheme, onThemeChange, language = APP_CONSTANTS.DEFAULT_LANGUAGE }) {
    const [expanded, setExpanded] = useState(false);

    const themes = [
        { code: APP_CONSTANTS.THEMES.DARK, name: t('darkMode', language), icon: '🌙' },
        { code: APP_CONSTANTS.THEMES.LIGHT, name: t('lightMode', language), icon: '☀️' },
        { code: APP_CONSTANTS.THEMES.SYSTEM, name: t('systemDefault', language), icon: '💻' }
    ];

    const getCurrentThemeName = () => {
        const theme = themes.find(th => th.code === currentTheme);
        return theme ? `${theme.icon} ${theme.name}` : `🌙 ${t('darkMode', language)}`;
    };

    const handleThemeSelect = (theme) => {
        onThemeChange?.(theme);
        setExpanded(false);
    };

    return (
        <div className="settings-section">
            <button
                className={`settings-menu-item ${expanded ? 'expanded' : ''}`}
                onClick={() => setExpanded(!expanded)}
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
                    <span className="settings-menu-label">{t('theme', language)}</span>
                    <span className="settings-menu-value">{getCurrentThemeName()}</span>
                </div>
                <div className={`settings-menu-arrow ${expanded ? 'rotated' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </button>

            {/* Theme Options */}
            <div className={`language-dropdown ${expanded ? 'open' : ''}`}>
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
    );
}

export default ThemeSettings;
