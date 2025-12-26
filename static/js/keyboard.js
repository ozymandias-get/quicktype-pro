/**
 * Keyboard Module
 * Klavye girişi ve kontrol butonları yönetimi
 */

import { socket } from './socket-manager.js';

// State variables
let isShiftActive = false;
let lastInputValue = '';

/**
 * Klavye modülünü başlatır
 * @param {Object} elements - DOM elementleri
 */
export function initKeyboard(elements) {
    const { input, clearBtn, shiftBtn, controlButtons, tabButtons, tabContents } = elements;

    if (input) {
        initKeyboardInput(input, clearBtn, tabButtons, tabContents);
    }

    if (clearBtn && input) {
        initClearButton(clearBtn, input);
    }

    // Ana kontrol butonları (ESC, Backspace, Enter - view-keyboard'daki ana butonlar)
    initMainControlButtons(input, clearBtn);

    if (shiftBtn) {
        initShiftButton(shiftBtn);
    }

    // Panel toggle işlevleri
    initMousePanel();
    initMoreKeysPanel();

    // Extended panel içindeki butonlar
    initQuickActionButtons();
    initExtendedKeys();
}

/**
 * Mouse Kontrolü panelini başlatır
 */
function initMousePanel() {
    const toggleBtn = document.getElementById('mouse-panel-toggle');
    const panel = document.getElementById('mouse-panel');
    const chevron = document.getElementById('mouse-panel-chevron');

    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = !panel.classList.contains('hidden');
        panel.classList.toggle('hidden', isOpen);

        if (chevron) {
            chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    });
}

/**
 * Diğer Tuşlar panelini başlatır
 */
function initMoreKeysPanel() {
    const toggleBtn = document.getElementById('more-keys-toggle');
    const panel = document.getElementById('more-keys-panel');
    const chevron = document.getElementById('more-keys-chevron');

    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = !panel.classList.contains('hidden');
        panel.classList.toggle('hidden', isOpen);

        if (chevron) {
            chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    });
}

/**
 * Hızlı eylem butonlarını başlatır (Kopyala, Yapıştır, vb.)
 */
function initQuickActionButtons() {
    const actionButtons = document.querySelectorAll('[data-action]');

    actionButtons.forEach(btn => {
        let isHandled = false; // Çift tetiklemeyi önle

        const handleAction = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Çift tetiklemeyi önle (touchstart + click aynı anda tetiklenebilir)
            if (isHandled) return;
            isHandled = true;
            setTimeout(() => { isHandled = false; }, 200);

            const action = btn.dataset.action;
            socket.emit('keyboard_shortcut', { action: action });

            // Visual feedback
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 150);
        };

        btn.addEventListener('touchstart', handleAction, { passive: false });
        btn.addEventListener('click', handleAction);
    });
}

/**
 * Genişletilmiş tuşları başlatır (F tuşları, gezinme tuşları, ok tuşları vb.)
 * Sadece #more-keys-panel içindeki data-key butonlarına event listener ekler
 */
function initExtendedKeys() {
    const extendedKeys = document.querySelectorAll('#more-keys-panel [data-key]');

    extendedKeys.forEach(btn => {
        const handlePress = (e) => {
            e.preventDefault();
            const key = btn.dataset.key;
            socket.emit('type_char', { type: 'special', value: key });

            // Visual feedback
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 100);
        };

        btn.addEventListener('touchstart', handlePress, { passive: false });
        btn.addEventListener('mousedown', handlePress);
    });
}

/**
 * Klavye input alanını başlatır
 */
function initKeyboardInput(input, clearBtn, tabButtons, tabContents) {
    const autoResize = () => {
        input.style.height = 'auto';
        const maxHeight = 300;
        const newHeight = Math.min(input.scrollHeight, maxHeight);
        input.style.height = newHeight + 'px';
    };

    const switchToKeyboardIfNeeded = () => {
        const keyboardTab = document.getElementById('view-keyboard');
        const keyboardBtn = document.querySelector('[data-target="view-keyboard"]');

        if (keyboardTab && keyboardBtn && !keyboardTab.classList.contains('active')) {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            keyboardBtn.classList.add('active');
            keyboardTab.classList.add('active');
        }
    };

    input.addEventListener('touchstart', () => {
        switchToKeyboardIfNeeded();
    }, { passive: true });

    input.addEventListener('click', () => {
        switchToKeyboardIfNeeded();
    });

    input.addEventListener('input', (e) => {
        autoResize();
        const currentVal = input.value;

        if (currentVal.length > 0) clearBtn.classList.remove('opacity-0');
        else clearBtn.classList.add('opacity-0');

        if (!socket.connected) {
            lastInputValue = currentVal;
            return;
        }

        if (e.inputType === 'insertLineBreak') {
            socket.emit('type_char', { type: 'special', value: 'enter' });
            input.value = '';
            lastInputValue = '';
            return;
        } else if (currentVal.length > lastInputValue.length) {
            const addedChars = currentVal.slice(lastInputValue.length);
            if (addedChars) {
                addedChars.split('').forEach(char => {
                    socket.emit('type_char', { type: 'char', value: char });
                });
            }
        } else if (currentVal.length < lastInputValue.length) {
            const diff = lastInputValue.length - currentVal.length;
            for (let i = 0; i < diff; i++) {
                socket.emit('type_char', { type: 'special', value: 'backspace' });
            }
        }
        lastInputValue = currentVal;
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            socket.emit('type_char', { type: 'special', value: 'enter' });
            input.value = '';
            lastInputValue = '';
        }
    });
}

/**
 * Temizleme butonunu başlatır
 */
function initClearButton(clearBtn, input) {
    clearBtn.addEventListener('click', () => {
        input.value = '';
        lastInputValue = '';
        input.style.height = 'auto';
        input.focus();
        clearBtn.classList.add('opacity-0');
    });
}

/**
 * Ana kontrol butonlarını başlatır (ESC, Backspace, Enter)
 * Sadece view-keyboard'daki ana 3 butona uygulanır
 */
function initMainControlButtons(input, clearBtn) {
    // Ana butonlar için selector - #view-keyboard'un direkt çocukları
    const mainButtons = document.querySelectorAll('#view-keyboard > div > .grid:first-child [data-key]');

    mainButtons.forEach(btn => {
        const handlePress = (e) => {
            e.preventDefault();
            const key = btn.dataset.key;
            socket.emit('type_char', { type: 'special', value: key });

            if (key === 'enter' && input) {
                input.value = '';
                lastInputValue = '';
                input.style.height = 'auto';
                if (clearBtn) clearBtn.classList.add('opacity-0');
            }
        };
        btn.addEventListener('touchstart', handlePress, { passive: false });
        btn.addEventListener('mousedown', handlePress);
    });
}

/**
 * Shift butonunu başlatır
 */
function initShiftButton(shiftBtn) {
    const toggleShift = (e) => {
        e.preventDefault();
        isShiftActive = !isShiftActive;
        shiftBtn.classList.toggle('active', isShiftActive);
        socket.emit('toggle_shift', { active: isShiftActive });
    };
    shiftBtn.addEventListener('touchstart', toggleShift, { passive: false });
    shiftBtn.addEventListener('mousedown', toggleShift);
}

/**
 * Shift durumunu sıfırlar
 */
export function resetShiftState() {
    isShiftActive = false;
}

/**
 * Input değerini sıfırlar
 */
export function resetInputState() {
    lastInputValue = '';
}


