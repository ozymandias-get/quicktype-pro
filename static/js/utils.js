/**
 * Utility Functions Module
 * Yardımcı fonksiyonlar ve sabitler
 */

// Constants
export const MOUSE_SENSITIVITY = 1.5;
export const SCROLL_SENSITIVITY = 1;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_FILES_AT_ONCE = 5;

/**
 * HTML karakterlerini escape eder
 * @param {string} text - Escape edilecek metin
 * @returns {string} Escape edilmiş metin
 */
export function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Dosya boyutunu okunabilir formata çevirir
 * @param {number} bytes - Byte cinsinden boyut
 * @returns {string} Okunabilir boyut
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Toast bildirim gösterir
 * @param {string} message - Gösterilecek mesaj
 * @param {'info'|'success'|'error'} type - Bildirim tipi
 */
export function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 rounded-xl text-sm font-medium shadow-2xl animate-slide-up';

    if (type === 'success') {
        toast.classList.add('bg-emerald-500/90', 'text-white');
    } else if (type === 'error') {
        toast.classList.add('bg-rose-500/90', 'text-white');
    } else {
        toast.classList.add('bg-blue-500/90', 'text-white');
    }

    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
