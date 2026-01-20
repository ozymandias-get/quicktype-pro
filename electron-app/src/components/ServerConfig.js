import React, { useState } from 'react';
import { t } from '../i18n/translations';
import { APP_CONSTANTS } from '../constants';

function ServerConfig({ serverUrl, isConnected, onConnect, language = APP_CONSTANTS.DEFAULT_LANGUAGE }) {
    const [url, setUrl] = useState(serverUrl);
    const [isEditing, setIsEditing] = useState(false);

    const handleConnect = () => {
        if (url.trim()) {
            onConnect(url.trim());
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleConnect();
        }
    };

    if (!isEditing && isConnected) {
        return (
            <div
                className="glass-panel server-config server-config-connected"
                onClick={() => setIsEditing(true)}
            >
                <div className="server-config-content">
                    <div className="server-config-left">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span className="server-config-url">{serverUrl}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel server-config">
            <div className="server-config-label">
                {t('serverAddress', language)}
            </div>
            <div className="server-input-group">
                <input
                    type="text"
                    className="server-input"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={APP_CONSTANTS.DEFAULT_PLACEHOLDER_IP}
                    autoFocus
                />
                <button
                    className="server-connect-btn"
                    onClick={handleConnect}
                    disabled={!url.trim()}
                >
                    {t('connect', language)}
                </button>
            </div>
        </div>
    );
}

export default ServerConfig;
