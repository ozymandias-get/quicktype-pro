import React from 'react';
import ClipboardItem from './ClipboardItem';

function ClipboardList({ items, serverUrl, onDelete, onCopyToPC, onCopyToLocal }) {
    if (!items || items.length === 0) {
        return (
            <div className="clipboard-list">
                <div className="clipboard-empty">
                    <div className="clipboard-empty-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="2" width="6" height="4" rx="1" ry="1"></rect>
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        </svg>
                    </div>
                    <div className="clipboard-empty-text">Henüz bir öğe yok</div>
                    <div className="clipboard-empty-hint">Metin veya dosya ekleyin</div>
                </div>
            </div>
        );
    }

    return (
        <div className="clipboard-list">
            {items.map(item => (
                <ClipboardItem
                    key={item.id}
                    item={item}
                    serverUrl={serverUrl}
                    onDelete={onDelete}
                    onCopyToPC={onCopyToPC}
                    onCopyToLocal={onCopyToLocal}
                />
            ))}
        </div>
    );
}

export default ClipboardList;
