/**
 * QuickType Pro - Main Application
 * Ana uygulama modülü - tüm modülleri birleştirir
 */

import { socket, initSocketEvents } from './socket-manager.js';
import { initKeyboard, resetShiftState } from './keyboard.js';
import { initTouchpad } from './touchpad.js';
import { initClipboard } from './clipboard.js';
import { initTabs } from './tabs.js';
import { showToast } from './utils.js';

/**
 * DOM elementlerini toplar
 */
function getElements() {
    return {
        // Status
        statusDot: document.getElementById('status-dot'),
        statusBadge: document.querySelector('.fixed.top-12.left-4'), // Status badge container

        // Keyboard
        input: document.getElementById('keyboard-input'),
        clearBtn: document.getElementById('clear-btn'),
        shiftBtn: document.getElementById('shift-btn'),
        controlButtons: document.querySelectorAll('[data-key]'),

        // Tabs
        tabButtons: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),

        // Touchpad
        touchSurface: document.getElementById('touch-surface'),
        scrollStrip: document.getElementById('scroll-strip'),
        leftClickBtn: document.getElementById('left-click'),
        rightClickBtn: document.getElementById('right-click'),

        // Clipboard
        clipboardToggle: document.getElementById('clipboard-toggle'),
        toggleLabel: document.getElementById('toggle-label'),
        clipboardTextInput: document.getElementById('clipboard-text-input'),
        sendTextBtn: document.getElementById('send-text-btn'),
        popupSendBtn: document.getElementById('popup-send-btn'),
        fileUploadArea: document.getElementById('file-upload-area'),
        fileInput: document.getElementById('file-input'),
        clipboardList: document.getElementById('clipboard-list'),
        clipboardEmpty: document.getElementById('clipboard-empty'),
        clearAllClipboard: document.getElementById('clear-all-clipboard')
    };
}



/**
 * Uygulamayı başlatır
 */
function initApp() {
    const elements = getElements();

    // Socket bağlantısını başlat
    initSocketEvents(elements, () => {
        // Bağlantı kurulduğunda
        resetShiftState();

        // Klavye açıksa focus
        if (elements.input && document.getElementById('view-keyboard')?.classList.contains('active')) {
            elements.input.focus();
        }
    });



    // Tab sistemini başlat
    initTabs(elements, (tabId) => {
        console.log(`Tab değişti: ${tabId}`);
    });

    // Klavyeyi başlat
    initKeyboard(elements);

    // Touchpad'i başlat
    initTouchpad(elements);

    // Clipboard'ı başlat
    initClipboard(elements);

    console.log('✅ QuickType Pro başlatıldı');
}

// DOM hazır olduğunda uygulamayı başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for debugging
window.QuickType = {
    socket,
    version: '2.0.0'
};
