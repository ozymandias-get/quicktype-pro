import React from 'react';
import { t } from '../i18n/translations';
import { APP_CONSTANTS } from '../constants';

function StatusBadge({ isConnected, language = APP_CONSTANTS.DEFAULT_LANGUAGE }) {
    return (
        <div className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
            <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
            <span>{isConnected ? t('connected', language) : t('disconnected', language)}</span>
        </div>
    );
}

export default StatusBadge;
