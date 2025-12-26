import React from 'react';

function StatusBadge({ isConnected }) {
    return (
        <div className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
            <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
            <span>{isConnected ? 'Bağlı' : 'Bağlantı Yok'}</span>
        </div>
    );
}

export default StatusBadge;
