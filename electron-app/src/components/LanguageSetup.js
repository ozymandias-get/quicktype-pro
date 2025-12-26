import React from 'react';
import { supportedLanguages } from '../i18n/translations';

function LanguageSetup({ onLanguageSelect }) {
    return (
        <div className="language-setup-overlay">
            <div className="language-setup-container">
                {/* Minimal Header */}
                <div className="setup-header-minimal">
                    <h1 className="setup-title-minimal">QuickType Pro</h1>
                    <p className="setup-subtitle-minimal">Select your language</p>
                </div>

                {/* Language Selection */}
                <div className="setup-languages">
                    {supportedLanguages.map((lang, index) => (
                        <button
                            key={lang.code}
                            className="setup-language-btn"
                            onClick={() => onLanguageSelect(lang.code)}
                            style={{ animationDelay: `${index * 0.06}s` }}
                        >
                            <span className="lang-flag">{lang.flag}</span>
                            <span className="lang-name">{lang.name}</span>
                            <div className="lang-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LanguageSetup;
