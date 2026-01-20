import React from 'react';
import { t } from '../../i18n/translations';

function SharedContentPopup({ popupData, onClose, onCopy, language }) {
    if (!popupData) return null;

    return (
        <div className="popup-modal-overlay" onClick={onClose}>
            <div className="popup-modal glass-panel" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h3>{t('sharedContent', language)}</h3>
                    <button className="popup-close-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="popup-body">
                    <pre className="popup-text">{popupData.content}</pre>
                </div>
                <div className="popup-actions">
                    <button className="popup-copy-btn" onClick={onCopy}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>{t('copy', language)}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SharedContentPopup;
