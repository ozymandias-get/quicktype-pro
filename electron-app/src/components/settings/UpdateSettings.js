import React, { useState } from 'react';
import { t } from '../../i18n/translations';
import { APP_CONSTANTS } from '../../constants';

function UpdateSettings({ language, updateState }) {
    const [expanded, setExpanded] = useState(false);
    const {
        appVersion,
        updateStatus,
        updateProgress,
        updateInfo,
        updateError,
        checkForUpdates,
        installUpdate,
        getUpdateStatusText
    } = updateState;

    if (!window.electronAPI) return null;

    return (
        <div className="settings-section">
            <button
                className={`settings-menu-item ${expanded ? 'expanded' : ''}`}
                onClick={() => setExpanded(!expanded)}
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
                    <span className="settings-menu-label">{t('updates', language)}</span>
                    <span className={`settings-menu-value ${updateStatus === APP_CONSTANTS.UPDATE_STATUS.READY ? 'update-ready' : ''} ${updateStatus === APP_CONSTANTS.UPDATE_STATUS.ERROR ? 'update-error-text' : ''}`}>
                        {getUpdateStatusText()}
                    </span>
                </div>
                <div className={`settings-menu-arrow ${expanded ? 'rotated' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </button>

            {/* Update Options */}
            <div className={`language-dropdown ${expanded ? 'open' : ''}`}>
                <div className="update-options">
                    {/* Version Info */}
                    <div className="update-info-row">
                        <span className="update-info-label">{t('currentVersion', language)}</span>
                        <span className="update-info-value">v{appVersion}</span>
                    </div>

                    {/* Update Info (if available) */}
                    {updateInfo && (
                        <div className="update-info-row">
                            <span className="update-info-label">{t('latestVersion', language)}</span>
                            <span className="update-info-value update-new">v{updateInfo.version}</span>
                        </div>
                    )}

                    {/* Progress Bar (if downloading) */}
                    {updateStatus === APP_CONSTANTS.UPDATE_STATUS.DOWNLOADING && (
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
                    {updateStatus === APP_CONSTANTS.UPDATE_STATUS.ERROR && updateError && (
                        <div className="update-error-message">
                            <span>⚠️ {updateError}</span>
                        </div>
                    )}

                    {/* Up to date message */}
                    {updateStatus === APP_CONSTANTS.UPDATE_STATUS.UP_TO_DATE && (
                        <div className="update-success-message">
                            <span>✅ {t('upToDate', language)}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="update-actions">
                        {updateStatus === APP_CONSTANTS.UPDATE_STATUS.READY ? (
                            <button
                                className="update-btn update-btn-install"
                                onClick={installUpdate}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                {t('installAndRestart', language)}
                            </button>
                        ) : (
                            <button
                                className={`update-btn ${updateStatus === APP_CONSTANTS.UPDATE_STATUS.CHECKING ? 'checking' : ''}`}
                                onClick={checkForUpdates}
                                disabled={updateStatus === APP_CONSTANTS.UPDATE_STATUS.CHECKING || updateStatus === APP_CONSTANTS.UPDATE_STATUS.DOWNLOADING}
                            >
                                {updateStatus === APP_CONSTANTS.UPDATE_STATUS.CHECKING ? (
                                    <>
                                        <div className="update-spinner"></div>
                                        {t('checking', language)}
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                            <path d="M3 3v5h5"></path>
                                        </svg>
                                        {t('checkForUpdates', language)}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateSettings;
