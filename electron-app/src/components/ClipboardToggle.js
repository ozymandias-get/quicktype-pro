import React from 'react';
import { t } from '../i18n/translations';

function ClipboardToggle({ enabled, onToggle, language = 'en' }) {
    return (
        <div className="toggle-container glass-panel">
            <div className="toggle-label">
                <div className="toggle-label-text">{t('twoWaySync', language)}</div>
                <div className="toggle-label-hint">{enabled ? t('on', language) : t('off', language)}</div>
            </div>
            <div
                className={`toggle-switch ${enabled ? 'active' : ''}`}
                onClick={onToggle}
            ></div>
        </div>
    );
}

export default ClipboardToggle;
