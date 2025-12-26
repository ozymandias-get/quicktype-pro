import React from 'react';

function ClipboardToggle({ enabled, onToggle }) {
    return (
        <div className="glass-panel toggle-container">
            <div className="toggle-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: enabled ? '#10b981' : '#64748b' }}>
                    <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
                </svg>
                <div>
                    <div className="toggle-label-text">Pano Senkronizasyonu</div>
                    <div className="toggle-label-hint">{enabled ? 'Aktif' : 'Pasif'}</div>
                </div>
            </div>
            <div
                className={`toggle-switch ${enabled ? 'active' : ''}`}
                onClick={onToggle}
            />
        </div>
    );
}

export default ClipboardToggle;
