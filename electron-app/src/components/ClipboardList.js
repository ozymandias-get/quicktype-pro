import React, { useState, useRef } from 'react';
import ClipboardItem from './ClipboardItem';
import { t } from '../i18n/translations';

function ClipboardList({ items, serverUrl, onDelete, onCopyToPC, onCopyToLocal, language = 'en', newItemIds = new Set() }) {
    const [deletingIds, setDeletingIds] = useState(new Set());
    const [swipingId, setSwipingId] = useState(null);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const swipeThreshold = 100; // Silme için minimum swipe mesafesi

    // Swipe başlangıç
    const handleTouchStart = (e, itemId) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        setSwipingId(itemId);
    };

    // Swipe hareket
    const handleTouchMove = (e) => {
        if (!swipingId) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = touchStartRef.current.x - currentX;
        const diffY = Math.abs(touchStartRef.current.y - currentY);

        // Dikey scroll'dan daha fazla yatay hareket olmalı
        if (diffY > Math.abs(diffX)) {
            setSwipingId(null);
            setSwipeOffset(0);
            return;
        }

        // Sadece sola swipe
        if (diffX > 0) {
            setSwipeOffset(Math.min(diffX, 150));
        }
    };

    // Swipe bitiş
    const handleTouchEnd = (itemId) => {
        if (swipeOffset > swipeThreshold) {
            handleDeleteWithAnimation(itemId);
        }
        setSwipingId(null);
        setSwipeOffset(0);
    };

    // Animasyonlu silme
    const handleDeleteWithAnimation = (id) => {
        setDeletingIds(prev => new Set([...prev, id]));

        // Animasyon bittikten sonra gerçek silme
        setTimeout(() => {
            onDelete(id);
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }, 300);
    };

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
                    <div className="clipboard-empty-text">{t('noItemsYet', language)}</div>
                    <div className="clipboard-empty-hint">{t('addTextOrFile', language)}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="clipboard-list">
            {items.map(item => {
                const isDeleting = deletingIds.has(item.id);
                const isSwiping = swipingId === item.id;
                const isNew = newItemIds.has(item.id);

                return (
                    <div
                        key={item.id}
                        className={`clipboard-item-wrapper ${isDeleting ? 'deleting' : ''} ${isNew ? 'new-item' : ''}`}
                        onTouchStart={(e) => handleTouchStart(e, item.id)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd(item.id)}
                        style={{
                            transform: isSwiping ? `translateX(-${swipeOffset}px)` : 'translateX(0)',
                            transition: isSwiping ? 'none' : 'transform 0.3s ease'
                        }}
                    >
                        {/* Swipe Delete Background */}
                        {isSwiping && swipeOffset > 0 && (
                            <div
                                className="swipe-delete-bg"
                                style={{
                                    opacity: Math.min(swipeOffset / swipeThreshold, 1)
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                <span>{t('swipeToDelete', language)}</span>
                            </div>
                        )}

                        <ClipboardItem
                            item={item}
                            serverUrl={serverUrl}
                            onDelete={() => handleDeleteWithAnimation(item.id)}
                            onCopyToPC={onCopyToPC}
                            onCopyToLocal={onCopyToLocal}
                            language={language}
                            isNew={isNew}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default ClipboardList;
