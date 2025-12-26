/**
 * Clipboard Module
 * Pano yönetimi ve dosya yükleme
 */

import { socket } from './socket-manager.js';
import { formatFileSize, showToast, MAX_FILE_SIZE, MAX_FILES_AT_ONCE } from './utils.js';
import { showUploadProgress, updateUploadProgress, removeUploadProgress } from './upload-progress.js';

// Clipboard state
let clipboardItems = [];
let clipboardEnabled = true;

// DOM element referansları
let clipboardListEl = null;
let clipboardEmptyEl = null;
let clearAllClipboardEl = null;
let clipboardToggleEl = null;
let toggleLabelEl = null;

const SOURCE_ICONS = {
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
    pc: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
};

const ACTION_ICONS = {
    copy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`
};

/**
 * Clipboard modülünü başlatır
 * @param {Object} elements - DOM elementleri
 */
export function initClipboard(elements) {
    const {
        clipboardToggle,
        toggleLabel,
        clipboardTextInput,
        sendTextBtn,
        popupSendBtn,
        fileUploadArea,
        fileInput,
        clipboardList,
        clipboardEmpty,
        clearAllClipboard
    } = elements;

    // Referansları kaydet
    clipboardListEl = clipboardList;
    clipboardEmptyEl = clipboardEmpty;
    clearAllClipboardEl = clearAllClipboard;
    clipboardToggleEl = clipboardToggle;
    toggleLabelEl = toggleLabel;

    // Toggle handler
    if (clipboardToggle) {
        clipboardToggle.addEventListener('click', () => {
            clipboardEnabled = !clipboardEnabled;
            socket.emit('clipboard_toggle', { enabled: clipboardEnabled });
            updateClipboardToggle();
        });
    }

    // Send text handler (arşive kaydet)
    if (sendTextBtn && clipboardTextInput) {
        sendTextBtn.addEventListener('click', () => {
            const text = clipboardTextInput.value.trim();
            if (text) {
                socket.emit('clipboard_add', {
                    content: text,
                    content_type: 'text'
                });
                clipboardTextInput.value = '';
            }
        });

        clipboardTextInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendTextBtn.click();
            }
        });
    }

    // Pop-up send handler (arşive kaydetme, sadece göster)
    if (popupSendBtn && clipboardTextInput) {
        popupSendBtn.addEventListener('click', () => {
            const text = clipboardTextInput.value.trim();
            if (text) {
                // Pop-up olarak gönder (arşive kaydetme)
                socket.emit('clipboard_popup', {
                    content: text,
                    content_type: 'text'
                });
                clipboardTextInput.value = '';
                showToast('Pop-up olarak gönderildi!', 'success');
            }
        });
    }

    // File upload handlers
    if (fileUploadArea && fileInput) {
        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('dragover');
        });

        fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
            fileInput.value = '';
        });
    }

    // Clear all handler - çift tıklama ile onay
    if (clearAllClipboard) {
        let confirmState = false;
        let confirmTimeout = null;

        clearAllClipboard.addEventListener('click', () => {
            if (!confirmState) {
                // İlk tıklama - onay moduna geç
                confirmState = true;
                clearAllClipboard.textContent = '⚠️ Emin misiniz? (Tıklayın)';
                clearAllClipboard.classList.add('confirm-pending');

                // 3 saniye sonra sıfırla
                confirmTimeout = setTimeout(() => {
                    confirmState = false;
                    clearAllClipboard.textContent = 'Tümünü Temizle';
                    clearAllClipboard.classList.remove('confirm-pending');
                }, 3000);
            } else {
                // İkinci tıklama - sil
                clearTimeout(confirmTimeout);
                socket.emit('clipboard_clear');
                confirmState = false;
                clearAllClipboard.textContent = 'Tümünü Temizle';
                clearAllClipboard.classList.remove('confirm-pending');
            }
        });
    }

    // Pop-up modal'ı başlat
    initPopupModal();

    // Socket events
    initClipboardSocketEvents();
}

/**
 * Clipboard socket event'lerini başlatır
 */
function initClipboardSocketEvents() {
    socket.on('clipboard_init', (data) => {
        clipboardItems = data.items || [];
        clipboardEnabled = data.enabled;
        updateClipboardToggle();
        renderClipboardItems();
    });

    socket.on('clipboard_update', (item) => {
        const existingIndex = clipboardItems.findIndex(i => i.id === item.id);
        if (existingIndex >= 0) {
            clipboardItems[existingIndex] = item;
        } else {
            clipboardItems.unshift(item);
        }
        renderClipboardItems();
    });

    socket.on('clipboard_state', (data) => {
        clipboardEnabled = data.enabled;
        updateClipboardToggle();
    });

    socket.on('clipboard_deleted', (data) => {
        clipboardItems = clipboardItems.filter(item => item.id !== data.id);
        renderClipboardItems();
    });

    socket.on('clipboard_cleared', () => {
        clipboardItems = [];
        renderClipboardItems();
    });

    socket.on('clipboard_copied', (data) => {
        if (data.success) {
            if (data.type === 'file') {
                showToast('Dosya yolu PC panosuna kopyalandı!', 'success');
            } else {
                showToast('PC panosuna kopyalandı!', 'success');
            }
        } else {
            showToast('Kopyalama başarısız', 'error');
        }
    });

    socket.on('clipboard_error', (data) => {
        showToast(data.error || 'Bir hata oluştu', 'error');
    });

    // Pop-up göster event'i
    socket.on('clipboard_popup_show', (data) => {
        showPopupModal(data);
    });
}

/**
 * Toggle durumunu günceller
 */
function updateClipboardToggle() {
    if (clipboardToggleEl && toggleLabelEl) {
        if (clipboardEnabled) {
            clipboardToggleEl.classList.add('active');
            toggleLabelEl.textContent = 'Açık';
            toggleLabelEl.classList.remove('text-slate-400');
            toggleLabelEl.classList.add('text-emerald-400');
        } else {
            clipboardToggleEl.classList.remove('active');
            toggleLabelEl.textContent = 'Kapalı';
            toggleLabelEl.classList.remove('text-emerald-400');
            toggleLabelEl.classList.add('text-slate-400');
        }
    }
}

/**
 * Dosyaları işler
 */
function handleFiles(files) {
    const fileArray = Array.from(files).slice(0, MAX_FILES_AT_ONCE);

    if (files.length > MAX_FILES_AT_ONCE) {
        showToast(`En fazla ${MAX_FILES_AT_ONCE} dosya yükleyebilirsiniz`, 'error');
    }

    fileArray.forEach((file, index) => {
        if (file.size > MAX_FILE_SIZE) {
            showToast(`${file.name} çok büyük (max 50MB)`, 'error');
            return;
        }

        if (file.size === 0) {
            showToast(`${file.name} boş dosya`, 'error');
            return;
        }

        uploadFileWithProgress(file, index, fileArray.length);
    });
}

/**
 * Dosyayı ilerleme göstergesiyle yükler
 */
function uploadFileWithProgress(file, index, total) {
    const uploadId = Date.now() + '_' + index;

    showUploadProgress(uploadId, file.name, 0);

    const reader = new FileReader();

    reader.onprogress = (e) => {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 50);
            updateUploadProgress(uploadId, percent);
        }
    };

    reader.onload = (e) => {
        updateUploadProgress(uploadId, 60);

        const base64 = e.target.result.split(',')[1];
        const contentType = file.type.startsWith('image/') ? 'image' : 'file';

        if (!socket.connected) {
            removeUploadProgress(uploadId);
            showToast('Bağlantı yok, tekrar deneyin', 'error');
            return;
        }

        updateUploadProgress(uploadId, 80);

        socket.emit('clipboard_add', {
            content: base64,
            content_type: contentType,
            filename: file.name
        });

        const timeout = setTimeout(() => {
            removeUploadProgress(uploadId);
            showToast(`${file.name} yüklenirken zaman aşımı`, 'error');
        }, 30000);

        const successHandler = (item) => {
            if (item.filename === file.name || item.filename?.includes(file.name)) {
                clearTimeout(timeout);
                updateUploadProgress(uploadId, 100);
                setTimeout(() => removeUploadProgress(uploadId), 500);
                socket.off('clipboard_update', successHandler);
            }
        };

        const errorHandler = (data) => {
            clearTimeout(timeout);
            removeUploadProgress(uploadId);
            showToast(data.error || `${file.name} yüklenemedi`, 'error');
            socket.off('clipboard_error', errorHandler);
        };

        socket.on('clipboard_update', successHandler);
        socket.on('clipboard_error', errorHandler);

        setTimeout(() => {
            socket.off('clipboard_update', successHandler);
            socket.off('clipboard_error', errorHandler);
        }, 35000);
    };

    reader.onerror = () => {
        removeUploadProgress(uploadId);
        showToast(`${file.name} okunamadı`, 'error');
    };

    reader.readAsDataURL(file);
}

/**
 * Clipboard öğelerini render eder
 */
function renderClipboardItems() {
    if (!clipboardListEl) return;

    if (clipboardEmptyEl && clearAllClipboardEl) {
        if (clipboardItems.length === 0) {
            clipboardEmptyEl.classList.remove('hidden');
            clearAllClipboardEl.classList.add('hidden');
        } else {
            clipboardEmptyEl.classList.add('hidden');
            clearAllClipboardEl.classList.remove('hidden');
        }
    }

    clipboardListEl.querySelectorAll('.clipboard-item').forEach(el => el.remove());

    clipboardItems.forEach(item => {
        const itemEl = createClipboardItemElement(item);
        clipboardListEl.insertBefore(itemEl, clipboardEmptyEl);
    });
}

/**
 * Clipboard öğesi elementi oluşturur
 */
function createClipboardItemElement(item) {
    const container = document.createElement('div');
    container.className = `clipboard-item glass-panel rounded-2xl p-4 shadow-lg ${item.source === 'phone' ? 'from-phone' : 'from-pc'}`;
    container.dataset.id = item.id;

    const header = document.createElement('div');
    header.className = 'flex items-start justify-between';

    const sourceInfo = document.createElement('div');
    sourceInfo.className = `flex items-center gap-2 ${item.source === 'phone' ? 'text-emerald-400' : 'text-blue-400'}`;

    const iconWrapper = document.createElement('span');
    iconWrapper.innerHTML = item.source === 'phone' ? SOURCE_ICONS.phone : SOURCE_ICONS.pc;
    sourceInfo.appendChild(iconWrapper);

    const sourceLabel = document.createElement('span');
    sourceLabel.className = 'text-xs font-medium';
    sourceLabel.textContent = item.source === 'phone' ? 'Telefon' : 'PC';
    sourceInfo.appendChild(sourceLabel);

    if (item.formatted_time) {
        const time = document.createElement('span');
        time.className = 'text-xs text-slate-500';
        time.textContent = `• ${item.formatted_time}`;
        sourceInfo.appendChild(time);
    }

    const actions = document.createElement('div');
    actions.className = 'flex items-center gap-1';

    if (item.content_type === 'text') {
        const copyBtn = createActionButton('copy-btn', 'PC\'ye Kopyala', ACTION_ICONS.copy);
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            socket.emit('clipboard_copy_to_pc', { id: item.id });
        });
        actions.appendChild(copyBtn);
    } else {
        const copyFileBtn = createActionButton('copy-file-btn', 'PC\'ye Kopyala', ACTION_ICONS.copy);
        copyFileBtn.dataset.id = item.id;
        copyFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            socket.emit('clipboard_copy_file_to_pc', { id: item.id });
            showToast('Dosya PC panosuna kopyalanıyor...', 'info');
        });
        actions.appendChild(copyFileBtn);

        const downloadLink = document.createElement('a');
        downloadLink.href = `/api/clipboard/download/${encodeURIComponent(item.id)}`;
        downloadLink.download = '';
        downloadLink.className = 'action-btn download-btn p-2 rounded-lg hover:bg-green-500/20 text-slate-400 hover:text-green-400 transition-all';
        downloadLink.title = 'İndir';
        downloadLink.innerHTML = ACTION_ICONS.download;
        actions.appendChild(downloadLink);
    }

    const deleteBtn = createActionButton('delete-btn', 'Sil', ACTION_ICONS.delete, 'hover:bg-rose-500/20 text-slate-400 hover:text-rose-400');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        socket.emit('clipboard_delete', { id: item.id });
    });
    actions.appendChild(deleteBtn);

    header.appendChild(sourceInfo);
    header.appendChild(actions);

    const contentArea = document.createElement('div');
    if (item.content_type === 'text') {
        const preview = item.preview || item.content?.substring(0, 100) || '';
        const textEl = document.createElement('p');
        textEl.className = 'text-sm text-slate-200 mt-2 break-words line-clamp-3';
        textEl.textContent = preview.length >= 100 ? `${preview}...` : preview;
        contentArea.appendChild(textEl);

        container.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/clipboard/content/${encodeURIComponent(item.id)}`);
                if (!response.ok) throw new Error('İçerik alınamadı');
                const data = await response.json();
                if (data.content) {
                    await navigator.clipboard.writeText(data.content);
                    showToast('Panoya kopyalandı!', 'success');
                }
            } catch (err) {
                console.error('Copy failed:', err);
                showToast('Panoya kopyalanamadı', 'error');
            }
        });
        container.style.cursor = 'pointer';
    } else {
        const fileRow = document.createElement('div');
        fileRow.className = 'flex items-center gap-3 mt-2';

        const fileIconWrapper = document.createElement('span');
        fileIconWrapper.innerHTML = item.content_type === 'image' ? ACTION_ICONS.image : ACTION_ICONS.file;
        fileRow.appendChild(fileIconWrapper);

        const infoCol = document.createElement('div');
        infoCol.className = 'flex-1 min-w-0';

        const nameEl = document.createElement('p');
        nameEl.className = 'text-sm text-slate-200 truncate';
        nameEl.textContent = item.filename || 'Dosya';

        const sizeEl = document.createElement('p');
        sizeEl.className = 'text-xs text-slate-500';
        sizeEl.textContent = formatFileSize(item.size || 0);

        infoCol.appendChild(nameEl);
        infoCol.appendChild(sizeEl);
        fileRow.appendChild(infoCol);
        contentArea.appendChild(fileRow);
    }

    container.appendChild(header);
    container.appendChild(contentArea);

    return container;
}

function createActionButton(baseClass, title, iconSvg, extraClasses = '') {
    const btn = document.createElement('button');
    btn.className = `action-btn ${baseClass} p-2 rounded-lg hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-all ${extraClasses}`.trim();
    btn.title = title;
    btn.innerHTML = iconSvg;
    return btn;
}

// ==================== POP-UP MODAL FUNCTIONS ====================

let popupData = null; // Geçici pop-up verisi

/**
 * Pop-up modal'ı başlatır
 */
function initPopupModal() {
    const modal = document.getElementById('clipboard-popup-modal');
    const overlay = document.getElementById('popup-overlay');
    const closeBtn = document.getElementById('popup-close-btn');
    const copyBtn = document.getElementById('popup-copy-btn');
    const downloadBtn = document.getElementById('popup-download-btn');

    if (!modal) return;

    // Kapatma butonları
    if (closeBtn) {
        closeBtn.addEventListener('click', () => hidePopupModal());
    }
    if (overlay) {
        overlay.addEventListener('click', () => hidePopupModal());
    }

    // ESC tuşu ile kapatma
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            hidePopupModal();
        }
    });

    // Kopyala butonu
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            if (!popupData) return;

            try {
                if (popupData.content_type === 'text') {
                    await navigator.clipboard.writeText(popupData.content);
                    showToast('Panoya kopyalandı!', 'success');
                } else if (popupData.content_type === 'image' && popupData.dataUrl) {
                    // Resmi kopyala
                    const response = await fetch(popupData.dataUrl);
                    const blob = await response.blob();
                    await navigator.clipboard.write([
                        new ClipboardItem({ [blob.type]: blob })
                    ]);
                    showToast('Resim panoya kopyalandı!', 'success');
                } else if (popupData.content) {
                    // Fallback: metin olarak kopyala
                    await navigator.clipboard.writeText(popupData.content);
                    showToast('Panoya kopyalandı!', 'success');
                }
            } catch (err) {
                console.error('Copy failed:', err);
                // Fallback için textarea kullan
                try {
                    const textarea = document.createElement('textarea');
                    textarea.value = popupData.content || '';
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    showToast('Panoya kopyalandı!', 'success');
                } catch (e) {
                    showToast('Kopyalama başarısız', 'error');
                }
            }
        });
    }

    // İndir butonu
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (!popupData || !popupData.dataUrl) return;

            const a = document.createElement('a');
            a.href = popupData.dataUrl;
            a.download = popupData.filename || 'download';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showToast('İndiriliyor...', 'success');
        });
    }
}

/**
 * Pop-up modal'ını gösterir
 * @param {Object} data - Pop-up verisi
 */
function showPopupModal(data) {
    const modal = document.getElementById('clipboard-popup-modal');
    const textContainer = document.getElementById('popup-text-content');
    const fileContainer = document.getElementById('popup-file-content');
    const downloadBtn = document.getElementById('popup-download-btn');

    if (!modal) return;

    // Geçici veriyi sakla
    popupData = data;

    // Önceki içeriği temizle
    textContainer?.classList.add('hidden');
    fileContainer?.classList.add('hidden');
    downloadBtn?.classList.add('hidden');

    if (data.content_type === 'text') {
        // Metin içeriği
        if (textContainer) {
            const textEl = textContainer.querySelector('.popup-text');
            if (textEl) {
                textEl.textContent = data.content || '';
            }
            textContainer.classList.remove('hidden');
        }
    } else if (data.content_type === 'image' || data.content_type === 'file') {
        // Dosya içeriği
        if (fileContainer) {
            const previewEl = fileContainer.querySelector('.popup-file-preview');
            const nameEl = fileContainer.querySelector('.popup-file-name');
            const sizeEl = fileContainer.querySelector('.popup-file-size');

            if (previewEl) {
                previewEl.innerHTML = '';

                if (data.content_type === 'image' && data.content) {
                    // Resim önizlemesi
                    const img = document.createElement('img');
                    const dataUrl = data.content.startsWith('data:')
                        ? data.content
                        : `data:image/png;base64,${data.content}`;
                    img.src = dataUrl;
                    img.alt = data.filename || 'Resim';
                    previewEl.appendChild(img);
                    popupData.dataUrl = dataUrl;
                } else {
                    // Dosya ikonu
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'file-icon';
                    iconDiv.innerHTML = ACTION_ICONS.file;
                    previewEl.appendChild(iconDiv);

                    if (data.content) {
                        popupData.dataUrl = data.content.startsWith('data:')
                            ? data.content
                            : `data:application/octet-stream;base64,${data.content}`;
                    }
                }
            }

            if (nameEl) {
                nameEl.textContent = data.filename || 'Dosya';
            }

            if (sizeEl) {
                sizeEl.textContent = data.size ? formatFileSize(data.size) : '';
            }

            fileContainer.classList.remove('hidden');
            downloadBtn?.classList.remove('hidden');
        }
    }

    // Modal'ı göster
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Pop-up modal'ını gizler ve veriyi temizler
 */
function hidePopupModal() {
    const modal = document.getElementById('clipboard-popup-modal');

    if (modal) {
        modal.classList.add('hidden');
    }

    // Geçici veriyi temizle
    popupData = null;

    // İçeriği temizle
    const textContainer = document.getElementById('popup-text-content');
    const fileContainer = document.getElementById('popup-file-content');

    if (textContainer) {
        const textEl = textContainer.querySelector('.popup-text');
        if (textEl) textEl.textContent = '';
    }

    if (fileContainer) {
        const previewEl = fileContainer.querySelector('.popup-file-preview');
        if (previewEl) previewEl.innerHTML = '';
    }

    document.body.style.overflow = '';
}

// Pop-up fonksiyonlarını dışa aktar
export { showPopupModal, hidePopupModal };
