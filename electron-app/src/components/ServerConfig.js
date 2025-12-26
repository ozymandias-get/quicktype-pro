import React, { useState } from 'react';
import { t } from '../i18n/translations';

function ServerConfig({ serverUrl, isConnected, onConnect, language = 'en' }) {
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
                className="glass-panel server-config"
                onClick={() => setIsEditing(true)}
                style={{ cursor: 'pointer' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>{serverUrl}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel server-config">
            <div style={{ marginBottom: '8px', fontSize: '12px', color: '#94a3b8' }}>
                {t('serverAddress', language)}
            </div>
            <div className="server-input-group">
                <input
                    type="text"
                    className="server-input"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="http://192.168.1.x:8000"
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
