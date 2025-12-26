import React, { useState } from 'react';

function TextInput({ onSend, onSendPopup }) {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        if (text.trim()) {
            onSend(text);
            setText('');
        }
    };

    const handlePopupSubmit = () => {
        if (text.trim()) {
            onSendPopup(text);
            setText('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="glass-panel text-input-container">
            <div className="text-input-wrapper">
                <textarea
                    className="text-input"
                    placeholder="Metin ekle veya yapıştır... (Enter ile gönder, Shift+Enter yeni satır)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className="send-buttons">
                    {/* Pop-up Gönder Butonu */}
                    <button
                        className="popup-send-btn"
                        onClick={handlePopupSubmit}
                        title="Pop-up olarak gönder"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                        </svg>
                    </button>
                    {/* Arşive Gönder Butonu */}
                    <button
                        className="send-btn"
                        onClick={handleSubmit}
                        title="Arşive kaydet (Enter)"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TextInput;


