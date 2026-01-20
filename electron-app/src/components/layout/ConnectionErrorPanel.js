import React from 'react';
import { t } from '../../i18n/translations';
import { APP_CONSTANTS } from '../../constants';

function ConnectionErrorPanel({ isConnected, connectionError, isRetrying, onRetry, language = APP_CONSTANTS.DEFAULT_LANGUAGE }) {
    if (isConnected || !connectionError) return null;

    return (
        <div className="connection-error-panel glass-panel">
            <div className="connection-error-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <div className="connection-error-text">
                <span className="error-title">{t('connectionLost', language)}</span>
                <span className="error-message">{connectionError}</span>
            </div>
            <button
                className={`retry-btn ${isRetrying ? 'retrying' : ''}`}
                onClick={onRetry}
                disabled={isRetrying}
            >
                {isRetrying ? (
                    <>
                        <div className="retry-spinner"></div>
                        <span>{t('retrying', language)}</span>
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                        </svg>
                        <span>{t('retry', language)}</span>
                    </>
                )}
            </button>
        </div>
    );
}

export default ConnectionErrorPanel;
