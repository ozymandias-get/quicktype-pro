import React from 'react';

function TitleBar() {
    const isElectron = window.electronAPI?.isElectron;

    const handleMinimize = () => {
        if (isElectron) {
            window.electronAPI.minimize();
        }
    };

    const handleMaximize = () => {
        if (isElectron) {
            window.electronAPI.maximize();
        }
    };

    const handleClose = () => {
        if (isElectron) {
            window.electronAPI.close();
        }
    };

    return (
        <div className="title-bar">
            <div className="title-bar-content">
                <svg className="title-bar-logo" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="2" width="6" height="4" rx="1" ry="1"></rect>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                </svg>
                <span className="title-bar-text">QuickType Pro</span>
            </div>

            {isElectron && (
                <div className="title-bar-buttons">
                    <button className="title-btn minimize" onClick={handleMinimize} title="Küçült" aria-label="Küçült" />
                    <button className="title-btn maximize" onClick={handleMaximize} title="Büyüt" aria-label="Büyüt" />
                    <button className="title-btn close" onClick={handleClose} title="Kapat" aria-label="Kapat" />
                </div>
            )}
        </div>
    );
}

export default TitleBar;
