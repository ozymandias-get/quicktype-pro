/**
 * QuickType Pro - Çoklu Dil Desteği (i18n) - Mobil Versiyon
 * Desteklenen diller: İngilizce, Türkçe
 */

const translations = {
    en: {
        code: 'en',
        name: 'English',
        flag: '🇬🇧',
        translations: {
            // App
            appName: 'QuickType Pro',
            mobileControlCenter: 'Mobile Control Center',

            // Status
            status: 'Status',
            connected: 'Connected',
            disconnected: 'Disconnected',

            // Keyboard view
            keyboard: 'Keyboard',
            clipboard: 'Clipboard',
            touchHereToType: 'Touch here and start typing...',
            mouseControl: 'Mouse Control',
            otherKeys: 'Other Keys',

            // Actions
            selectAll: 'Select All',
            copy: 'Copy',
            paste: 'Paste',
            cut: 'Cut',
            undo: 'Undo',
            redo: 'Redo',

            // Clipboard view
            clipboardManagement: 'Clipboard',
            twoWaySync: 'Two-way synchronization',
            off: 'Off',
            on: 'On',
            addTextOrPaste: 'Add text or paste...',
            showAsPopup: 'Show as popup',
            saveToArchive: 'Save to archive',
            tapToUploadFile: 'Tap to upload file',
            imagesPdfEtc: 'Images, PDF, etc.',
            fromPhone: 'From Phone',
            fromPC: 'From PC',
            noItemsYet: 'No items yet',
            addTextOrFile: 'Add text or file',
            clearAll: 'Clear All',

            // Popup
            sharedContent: 'Shared Content',
            download: 'Download',

            // Misc
            refresh: 'Refresh',

            // Clipboard JS Updates (New)
            popupSent: 'Sent as popup!',
            fileCopiedToPC: 'File path copied to PC clipboard!',
            copiedToPC: 'Copied to PC clipboard!',
            copyFailed: 'Copy failed',
            uploadMaxFiles: 'You can upload max {count} files',
            fileTooLarge: '{filename} is too large (max 50MB)',
            fileEmpty: '{filename} is empty',
            noConnection: 'No connection, try again',
            uploadTimeout: 'Timeout uploading {filename}',
            uploadFailed: '{filename} upload failed',
            fileReadError: 'Could not read {filename}',
            download: 'Download',
            delete: 'Delete',
            file: 'File',
            fromPhone: 'From Phone',
            fromPC: 'From PC',
            confirmClear: '⚠️ Are you sure? (Click again)',
            copyToPC: 'Copy to PC',
            downloading: 'Downloading...',
            copiedToClipboard: 'Copied to clipboard!',
            copyToClipboardFailed: 'Could not copy to clipboard'
        }
    },
    tr: {
        code: 'tr',
        name: 'Türkçe',
        flag: '🇹🇷',
        translations: {
            // App
            appName: 'QuickType Pro',
            mobileControlCenter: 'Mobil Kontrol Merkezi',

            // Status
            status: 'Durum',
            connected: 'Bağlandı',
            disconnected: 'Bağlantı Kesildi',

            // Keyboard view
            keyboard: 'Klavye',
            clipboard: 'Pano',
            touchHereToType: 'Buraya dokun ve yazmaya başla...',
            mouseControl: 'Mouse Kontrolü',
            otherKeys: 'Diğer Tuşlar',

            // Actions
            selectAll: 'Tümü Seç',
            copy: 'Kopyala',
            paste: 'Yapıştır',
            cut: 'Kes',
            undo: 'Geri Al',
            redo: 'İleri Al',

            // Clipboard view
            clipboardManagement: 'Pano',
            twoWaySync: 'İki yönlü senkronizasyon',
            off: 'Kapalı',
            on: 'Açık',
            addTextOrPaste: 'Metin ekle veya yapıştır...',
            showAsPopup: 'Pop-up olarak göster',
            saveToArchive: 'Arşive kaydet',
            tapToUploadFile: 'Dosya yüklemek için dokun',
            imagesPdfEtc: 'Resim, PDF, vb.',
            fromPhone: 'Telefondan',
            fromPC: 'PC\'den',
            noItemsYet: 'Henüz bir öğe yok',
            addTextOrFile: 'Metin veya dosya ekleyin',
            clearAll: 'Tümünü Temizle',

            // Popup
            sharedContent: 'Paylaşılan İçerik',
            download: 'İndir',

            // Misc
            refresh: 'Yenile',

            // Clipboard JS Updates (New)
            popupSent: 'Pop-up olarak gönderildi!',
            fileCopiedToPC: 'Dosya yolu PC panosuna kopyalandı!',
            copiedToPC: 'PC panosuna kopyalandı!',
            copyFailed: 'Kopyalama başarısız',
            uploadMaxFiles: 'En fazla {count} dosya yükleyebilirsiniz',
            fileTooLarge: '{filename} çok büyük (max 50MB)',
            fileEmpty: '{filename} boş dosya',
            noConnection: 'Bağlantı yok, tekrar deneyin',
            uploadTimeout: '{filename} yüklenirken zaman aşımı',
            uploadFailed: '{filename} yüklenemedi',
            fileReadError: '{filename} okunamadı',
            download: 'İndir',
            delete: 'Sil',
            file: 'Dosya',
            fromPhone: 'Telefondan',
            fromPC: 'PC\'den',
            confirmClear: '⚠️ Emin misiniz? (Tıklayın)',
            copyToPC: 'PC\'ye Kopyala',
            downloading: 'İndiriliyor...',
            copiedToClipboard: 'Panoya kopyalandı!',
            copyToClipboardFailed: 'Panoya kopyalanamadı'
        }
    },

};

// Varsayılan dil
const defaultLanguage = 'en';

// Mevcut dil (localStorage'dan yükle veya varsayılan kullan)
let currentLanguage = localStorage.getItem('quicktype_language') || defaultLanguage;

/**
 * Çeviri fonksiyonu
 * @param {string} key - Çeviri anahtarı
 * @param {string} lang - Dil kodu (opsiyonel, varsayılan: mevcut dil)
 * @returns {string} - Çevrilmiş metin
 */
export function t(key, lang = currentLanguage) {
    const language = translations[lang] || translations[defaultLanguage];
    return language.translations[key] || translations[defaultLanguage].translations[key] || key;
}

/**
 * Mevcut dili değiştir
 * @param {string} langCode - Yeni dil kodu
 */
export function setLanguage(langCode) {
    if (translations[langCode]) {
        currentLanguage = langCode;
        localStorage.setItem('quicktype_language', langCode);
        return true;
    }
    return false;
}

/**
 * Mevcut dili getir
 * @returns {string} - Mevcut dil kodu
 */
export function getLanguage() {
    return currentLanguage;
}

/**
 * Desteklenen dillerin listesini getir
 * @returns {Array} - Desteklenen diller
 */
export function getSupportedLanguages() {
    return Object.keys(translations).map(code => ({
        code,
        name: translations[code].name,
        flag: translations[code].flag
    }));
}

/**
 * Sayfa içeriğini güncelle (DOM elementlerini çevir)
 */
export function updatePageContent() {
    const lang = currentLanguage;

    // Header
    const headerTitle = document.querySelector('.text-2xl.font-semibold');
    if (headerTitle) headerTitle.textContent = t('appName', lang);

    const headerSubtitle = document.querySelector('.text-xs.text-slate-500.mt-1');
    if (headerSubtitle) headerSubtitle.textContent = t('mobileControlCenter', lang);

    // Input placeholder
    const keyboardInput = document.getElementById('keyboard-input');
    if (keyboardInput) keyboardInput.placeholder = t('touchHereToType', lang);

    // Tabs
    const keyboardTab = document.querySelector('[data-target="view-keyboard"] .tab-label');
    if (keyboardTab) keyboardTab.textContent = t('keyboard', lang);

    const clipboardTab = document.querySelector('[data-target="view-clipboard"] .tab-label');
    if (clipboardTab) clipboardTab.textContent = t('clipboard', lang);

    // Mouse control toggle
    const mouseToggleSpan = document.querySelector('#mouse-panel-toggle span.font-medium');
    if (mouseToggleSpan) mouseToggleSpan.textContent = t('mouseControl', lang);

    // More keys toggle
    const moreKeysSpan = document.querySelector('#more-keys-toggle span.font-medium');
    if (moreKeysSpan) moreKeysSpan.textContent = t('otherKeys', lang);

    // Clipboard header
    const clipboardTitle = document.querySelector('#view-clipboard .text-lg.font-semibold');
    if (clipboardTitle) clipboardTitle.textContent = t('clipboardManagement', lang);

    const clipboardSubtitle = document.querySelector('#view-clipboard .text-xs.text-slate-500');
    if (clipboardSubtitle) clipboardSubtitle.textContent = t('twoWaySync', lang);

    // Toggle label
    const toggleLabel = document.getElementById('toggle-label');
    if (toggleLabel) {
        const isOn = document.getElementById('clipboard-toggle')?.classList.contains('active');
        toggleLabel.textContent = isOn ? t('on', lang) : t('off', lang);
    }

    // Text input
    const clipboardTextInput = document.getElementById('clipboard-text-input');
    if (clipboardTextInput) clipboardTextInput.placeholder = t('addTextOrPaste', lang);

    // File upload
    const fileDropText = document.querySelector('.file-upload-area .text-sm.text-slate-400');
    if (fileDropText) fileDropText.textContent = t('tapToUploadFile', lang);

    const fileDropHint = document.querySelector('.file-upload-area .text-xs.text-slate-500');
    if (fileDropHint) fileDropHint.textContent = t('imagesPdfEtc', lang);

    // Legend
    const legendItems = document.querySelectorAll('.legend .flex.items-center.gap-2 span');
    if (legendItems.length >= 2) {
        legendItems[0].textContent = t('fromPhone', lang);
        legendItems[1].textContent = t('fromPC', lang);
    }

    // Empty state
    const emptyText = document.querySelector('#clipboard-empty p');
    if (emptyText) emptyText.textContent = t('noItemsYet', lang);

    const emptyHint = document.querySelector('#clipboard-empty .text-xs.mt-1');
    if (emptyHint) emptyHint.textContent = t('addTextOrFile', lang);

    // Clear all button
    const clearAllBtn = document.getElementById('clear-all-clipboard');
    if (clearAllBtn) clearAllBtn.textContent = t('clearAll', lang);

    // Popup
    const popupTitle = document.querySelector('.popup-title');
    if (popupTitle) popupTitle.textContent = t('sharedContent', lang);

    const popupCopyBtn = document.querySelector('.popup-copy-btn span');
    if (popupCopyBtn) popupCopyBtn.textContent = t('copy', lang);

    // Quick actions
    const actionLabels = {
        'select-all': t('selectAll', lang),
        'copy': t('copy', lang),
        'paste': t('paste', lang),
        'cut': t('cut', lang),
        'undo': t('undo', lang),
        'redo': t('redo', lang)
    };

    document.querySelectorAll('.extra-key-btn-compact').forEach(btn => {
        const action = btn.dataset.action;
        const span = btn.querySelector('span');
        if (span && actionLabels[action]) {
            span.textContent = actionLabels[action];
        }
    });
}

export default { t, setLanguage, getLanguage, getSupportedLanguages, updatePageContent };
