import React, { useState } from 'react';
import { supportedLanguages, t } from '../../i18n/translations';

function LanguageSettings({ currentLanguage, onLanguageChange }) {
    const [expanded, setExpanded] = useState(false);

    const currentLang = supportedLanguages.find(l => l.code === currentLanguage);

    const handleLanguageSelect = (langCode) => {
        onLanguageChange(langCode);
        setExpanded(false);
    };

    return (
        <div className="settings-section">
            <button
                className={`settings-menu-item ${expanded ? 'expanded' : ''}`}
                onClick={() => setExpanded(!expanded)}
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
                <div className={`settings-menu-arrow ${expanded ? 'rotated' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </button>

            {/* Language Options */}
            <div className={`language-dropdown ${expanded ? 'open' : ''}`}>
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
    );
}

export default LanguageSettings;
