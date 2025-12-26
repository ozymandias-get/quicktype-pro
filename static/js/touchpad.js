/**
 * Touchpad Module
 * Mouse/touchpad kontrolü
 */

import { socket } from './socket-manager.js';
import { MOUSE_SENSITIVITY, SCROLL_SENSITIVITY } from './utils.js';

let lastTouch = null;
let touchStartTime = 0;
let isScrolling = false;
let isDragging = false;
let firstTapTime = 0;

/**
 * Touchpad modülünü başlatır
 * @param {Object} elements - DOM elementleri
 */
export function initTouchpad(elements) {
    const { touchSurface, scrollStrip, leftClickBtn, rightClickBtn } = elements;

    if (touchSurface && scrollStrip) {
        initTouchSurface(touchSurface, scrollStrip);
    }

    if (leftClickBtn) {
        leftClickBtn.addEventListener('click', () => {
            socket.emit('mouse_click', { button: 'left' });
        });
    }

    if (rightClickBtn) {
        rightClickBtn.addEventListener('click', () => {
            socket.emit('mouse_click', { button: 'right' });
        });
    }
}

/**
 * Dokunmatik yüzeyi başlatır
 */
function initTouchSurface(touchSurface, scrollStrip) {
    // Ana touch başlangıç event'i
    touchSurface.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        lastTouch = { x: touch.clientX, y: touch.clientY };
        touchStartTime = Date.now();

        const rect = scrollStrip.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            isScrolling = true;
        } else {
            isScrolling = false;
            if (Date.now() - firstTapTime < 250) {
                isDragging = true;
                socket.emit('mouse_drag', { state: 'start' });
            }
        }
    }, { passive: false });

    // Touch hareket event'i
    touchSurface.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!lastTouch) return;

        const touch = e.touches[0];
        const dx = touch.clientX - lastTouch.x;
        const dy = touch.clientY - lastTouch.y;

        if (isScrolling) {
            socket.emit('mouse_scroll', { dy: -dy * SCROLL_SENSITIVITY });
        } else {
            const distance = Math.sqrt(dx * dx + dy * dy);
            const accel = distance > 5 ? 1.5 : 1.0;

            socket.emit('mouse_move', {
                dx: dx * MOUSE_SENSITIVITY * accel,
                dy: dy * MOUSE_SENSITIVITY * accel
            });
        }

        lastTouch = { x: touch.clientX, y: touch.clientY };
    }, { passive: false });

    // Touch bitiş event'i
    touchSurface.addEventListener('touchend', (e) => {
        e.preventDefault();
        const duration = Date.now() - touchStartTime;

        if (isDragging) {
            isDragging = false;
            socket.emit('mouse_drag', { state: 'end' });
        }
        else if (!isScrolling && duration < 200) {
            if (e.changedTouches.length === 1) {
                firstTapTime = Date.now();
                socket.emit('mouse_click', { button: 'left' });
            }
        }

        lastTouch = null;
        isScrolling = false;
    });

    // 2 parmak tıklama (sağ click)
    touchSurface.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            socket.emit('mouse_click', { button: 'right' });
            lastTouch = null;
        }
    });
}
