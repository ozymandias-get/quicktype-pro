/**
 * Upload Progress Module
 * Dosya yükleme ilerleme UI'ı
 */

import { escapeHtml } from './utils.js';

/**
 * Yükleme ilerleme göstergesini oluşturur
 * @param {string} id - Benzersiz yükleme ID'si
 * @param {string} filename - Dosya adı
 * @param {number} percent - İlerleme yüzdesi
 */
export function showUploadProgress(id, filename, percent) {
    let container = document.getElementById('upload-progress-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'upload-progress-container';
        container.className = 'fixed bottom-24 left-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(container);
    }

    const progressEl = document.createElement('div');
    progressEl.id = `upload-${id}`;
    progressEl.className = 'glass-panel rounded-xl p-3 shadow-xl animate-slide-up';
    progressEl.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-slate-300 truncate max-w-[200px]">${escapeHtml(filename)}</span>
            <span class="text-xs text-blue-400 progress-percent">${percent}%</span>
        </div>
        <div class="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 progress-bar" style="width: ${percent}%"></div>
        </div>
    `;
    container.appendChild(progressEl);
}

/**
 * Yükleme ilerlemesini günceller
 * @param {string} id - Yükleme ID'si
 * @param {number} percent - Yeni ilerleme yüzdesi
 */
export function updateUploadProgress(id, percent) {
    const el = document.getElementById(`upload-${id}`);
    if (el) {
        el.querySelector('.progress-bar').style.width = `${percent}%`;
        el.querySelector('.progress-percent').textContent = `${percent}%`;
    }
}

/**
 * Yükleme ilerleme göstergesini kaldırır
 * @param {string} id - Yükleme ID'si
 */
export function removeUploadProgress(id) {
    const el = document.getElementById(`upload-${id}`);
    if (el) {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            el.remove();
            // Container boşsa kaldır
            const container = document.getElementById('upload-progress-container');
            if (container && container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }
}
