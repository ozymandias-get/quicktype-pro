import React from 'react';

function ClipboardItem({ item, serverUrl, onDelete, onCopyToPC, onCopyToLocal }) {
    const isFromPhone = item.source === 'phone';
    const isText = item.content_type === 'text';
    const isImage = item.content_type === 'image';

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };



    const handleItemClick = () => {
        // Tüm içerik türleri için kopyalama yap
        onCopyToLocal(item.id);
    };

    const handleCopyClick = (e) => {
        e.stopPropagation();
        onCopyToPC(item.id);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(item.id);
    };

    const handleDownloadClick = (e) => {
        e.stopPropagation();
        // Download link açılacak
    };

    return (
        <div
            className={`glass-panel clipboard-item ${isFromPhone ? 'from-phone' : 'from-pc'}`}
            onClick={handleItemClick}
            style={{ cursor: 'pointer' }}
        >
            {/* Header */}
            <div className="clipboard-item-header">
                <div className={`clipboard-item-source ${isFromPhone ? 'phone' : 'pc'}`}>
                    {isFromPhone ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                            <line x1="12" y1="18" x2="12.01" y2="18"></line>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                    )}
                    <span>{isFromPhone ? 'Telefon' : 'PC'}</span>
                    <span className="clipboard-item-time">• {item.formatted_time}</span>
                </div>

                <div className="clipboard-item-actions">
                    {isText && (
                        <button
                            className="clipboard-item-btn copy"
                            onClick={handleCopyClick}
                            title="PC'ye Kopyala"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                    )}

                    {!isText && (
                        <>
                            <button
                                className="clipboard-item-btn copy"
                                onClick={handleCopyClick}
                                title="Panoya Kopyala"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                            <a
                                href={`${serverUrl}/api/clipboard/download/${item.id}`}
                                download
                                className="clipboard-item-btn download"
                                onClick={handleDownloadClick}
                                title="İndir"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            </a>
                        </>
                    )}

                    <button
                        className="clipboard-item-btn delete"
                        onClick={handleDeleteClick}
                        title="Sil"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            {isText ? (
                <div className="clipboard-item-content">
                    {item.preview || item.content?.substring(0, 100) || ''}
                    {(item.preview?.length >= 100 || (item.content?.length || 0) > 100) && '...'}
                </div>
            ) : (
                <div className="clipboard-item-file">
                    <div className="clipboard-item-file-icon">
                        {isImage ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                        )}
                    </div>
                    <div className="clipboard-item-file-info">
                        <div className="clipboard-item-file-name">{item.filename || 'Dosya'}</div>
                        <div className="clipboard-item-file-size">{formatFileSize(item.size)}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClipboardItem;
