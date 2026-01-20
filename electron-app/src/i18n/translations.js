/**
 * QuickType Pro - Çoklu Dil Desteği (i18n)
 * Desteklenen diller: İngilizce, Türkçe
 */

import { APP_CONSTANTS } from '../constants';

const translations = {
    [APP_CONSTANTS.LANGUAGES.EN]: {
        code: APP_CONSTANTS.LANGUAGES.EN,
        name: 'English',
        flag: '🇬🇧',
        translations: {
            // App
            appName: 'QuickType Pro',

            // Settings
            settings: 'Settings',
            language: 'Language',
            selectLanguage: 'Select Language',
            languageChanged: 'Language changed successfully!',

            // Clipboard
            clipboardManagement: 'Clipboard Management',
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
            confirmClear: '⚠️ Are you sure? (Click again)',

            // Keyboard
            keyboard: 'Keyboard',
            clipboard: 'Clipboard',
            mouseControl: 'Mouse Control',
            otherKeys: 'Other Keys',
            touchHereToType: 'Touch here and start typing...',

            // Actions
            selectAll: 'Select All',
            copy: 'Copy',
            paste: 'Paste',
            cut: 'Cut',
            undo: 'Undo',
            redo: 'Redo',
            delete: 'Delete',

            // Status
            connected: 'Connected',
            disconnected: 'Disconnected',
            connecting: 'Connecting...',
            connectedToServer: 'Connected to server!',
            cannotConnectToServer: 'Cannot connect to server!',

            // Toast messages
            copiedToClipboard: 'Copied to clipboard!',
            copiedToPCClipboard: 'Copied to PC clipboard!',
            imageCopiedToClipboard: 'Image copied to clipboard!',
            downloadLinkCopied: 'Download link copied!',
            copyFailed: 'Copy failed!',
            sentAsPopup: 'Sent as popup!',

            // First run / Setup
            welcome: 'Welcome to QuickType Pro!',
            chooseLanguage: 'Choose your language',
            continue: 'Continue',

            // Server config
            serverAddress: 'Server Address',
            connect: 'Connect',

            // Shared content popup
            sharedContent: 'Shared Content',
            download: 'Download',

            // Misc
            refresh: 'Refresh',
            close: 'Close',
            back: 'Back',

            // Theme
            theme: 'Theme',
            darkMode: 'Dark Mode',
            lightMode: 'Light Mode',
            systemDefault: 'System Default',

            // Startup settings
            launchAtStartup: 'Launch at Startup',
            startMinimized: 'Start Minimized',
            launchAtStartupDesc: 'Open app when Windows starts',
            startMinimizedDesc: 'Start in system tray',

            // Connection
            retry: 'Retry',
            retrying: 'Retrying...',
            connectionLost: 'Connection lost',
            reconnecting: 'Reconnecting...',
            tryAgain: 'Try Again',

            // Errors
            errorServerUnreachable: 'Server is unreachable. Check if the server is running.',
            errorTimeout: 'Connection timed out. Please try again.',
            errorNetworkError: 'Network error. Check your connection.',
            errorUnknown: 'An unknown error occurred.',

            // Pull to refresh
            pullToRefresh: 'Pull to refresh',
            releaseToRefresh: 'Release to refresh',
            refreshing: 'Refreshing...',

            // Swipe
            swipeToDelete: 'Swipe to delete',

            // File upload
            uploadingFile: 'Uploading file...',
            uploadComplete: 'Upload complete!',
            uploadFailed: 'Upload failed',
            maxFilesAllowed: 'Maximum {count} files allowed',
            fileTooLarge: '{filename} is too large (max 50MB)',
            fileIsEmpty: '{filename} is empty',
            uploadingProgress: 'Uploading... {progress}%',

            // Updates
            updates: 'Updates',
            checkForUpdates: 'Check for Updates',
            checking: 'Checking...',
            upToDate: 'Up to date',
            updateAvailable: 'Update Available',
            downloading: 'Downloading...',
            downloadingUpdate: 'Downloading update...',
            readyToInstall: 'Ready to Install',
            installAndRestart: 'Install & Restart',
            currentVersion: 'Current Version',
            latestVersion: 'Latest Version',
            updateError: 'Update Error',
            updateErrorDesc: 'Could not check for updates. Please try again later.',
            devModeUpdate: 'Updates only available in production build',
            newVersionAvailable: 'New version available!',

            // HTTPS & Security
            httpsSettings: 'HTTPS / Security',
            httpsStatus: 'HTTPS Status',
            active: 'Active',
            inactive: 'Inactive',
            notConfigured: 'Not Configured',
            localIP: 'Local IP',
            httpsUrl: 'HTTPS URL',
            setupHttps: 'Setup HTTPS',
            repairHttps: 'Repair HTTPS',
            setupInProgress: 'Setting up...',
            exportCert: 'Export for Phone',
            exportCertDesc: 'Save certificate to desktop for mobile devices',
            setupComplete: 'HTTPS Setup Complete!',
            setupFailed: 'Setup Failed',
            mkcertRequired: 'mkcert will be installed automatically',
            adminRequired: 'Administrator privileges may be required',
            phoneInstructions: 'Phone Instructions',
            iphoneSteps: 'iPhone: Settings → General → VPN & Device Management → Install',
            androidSteps: 'Android: Open file → Install as CA Certificate',
            ipChanged: 'IP Changed!',
            ipChangedDesc: 'Your IP address changed. Renew certificate for phone connection.',
            renewCert: 'Renew Certificate',
            renewing: 'Renewing...',
            staticIpTip: '💡 Tip: Set a static IP in Windows Network Settings to avoid this issue.',
            restartingIn: 'Restarting in',
            seconds: 'seconds...',
            restartNow: 'Restart Now',
            faceIdReady: '🔒 Face ID Ready'
        }
    },
    [APP_CONSTANTS.LANGUAGES.TR]: {
        code: APP_CONSTANTS.LANGUAGES.TR,
        name: 'Türkçe',
        flag: '🇹🇷',
        translations: {
            // App
            appName: 'QuickType Pro',

            // Settings
            settings: 'Ayarlar',
            language: 'Dil',
            selectLanguage: 'Dil Seçin',
            languageChanged: 'Dil başarıyla değiştirildi!',

            // Clipboard
            clipboardManagement: 'Pano Yönetimi',
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
            confirmClear: '⚠️ Emin misiniz? (Tekrar Tıklayın)',

            // Keyboard
            keyboard: 'Klavye',
            clipboard: 'Pano',
            mouseControl: 'Mouse Kontrolü',
            otherKeys: 'Diğer Tuşlar',
            touchHereToType: 'Buraya dokun ve yazmaya başla...',

            // Actions
            selectAll: 'Tümü Seç',
            copy: 'Kopyala',
            paste: 'Yapıştır',
            cut: 'Kes',
            undo: 'Geri Al',
            redo: 'İleri Al',
            delete: 'Sil',

            // Status
            connected: 'Bağlandı',
            disconnected: 'Bağlantı Kesildi',
            connecting: 'Bağlanıyor...',
            connectedToServer: 'Sunucuya bağlandı!',
            cannotConnectToServer: 'Sunucuya bağlanılamıyor!',

            // Toast messages
            copiedToClipboard: 'Panoya kopyalandı!',
            copiedToPCClipboard: 'PC panosuna kopyalandı!',
            imageCopiedToClipboard: 'Resim panoya kopyalandı!',
            downloadLinkCopied: 'İndirme linki kopyalandı!',
            copyFailed: 'Kopyalama başarısız!',
            sentAsPopup: 'Pop-up olarak gönderildi!',

            // First run / Setup
            welcome: 'QuickType Pro\'ya Hoş Geldiniz!',
            chooseLanguage: 'Dilinizi seçin',
            continue: 'Devam Et',

            // Server config
            serverAddress: 'Sunucu Adresi',
            connect: 'Bağlan',

            // Shared content popup
            sharedContent: 'Paylaşılan İçerik',
            download: 'İndir',

            // Misc
            refresh: 'Yenile',
            close: 'Kapat',
            back: 'Geri',

            // Theme
            theme: 'Tema',
            darkMode: 'Koyu Mod',
            lightMode: 'Açık Mod',
            systemDefault: 'Sistem Varsayılanı',

            // Startup settings
            launchAtStartup: 'Başlangıçta Çalıştır',
            startMinimized: 'Arka Planda Başlat',
            launchAtStartupDesc: 'Windows başladığında uygulamayı aç',
            startMinimizedDesc: 'Sistem tepsisinde başlat',

            // Connection
            retry: 'Tekrar Dene',
            retrying: 'Yeniden bağlanıyor...',
            connectionLost: 'Bağlantı kesildi',
            reconnecting: 'Yeniden bağlanıyor...',
            tryAgain: 'Tekrar Dene',

            // Errors
            errorServerUnreachable: 'Sunucuya ulaşılamıyor. Sunucunun çalıştığından emin olun.',
            errorTimeout: 'Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.',
            errorNetworkError: 'Ağ hatası. Bağlantınızı kontrol edin.',
            errorUnknown: 'Bilinmeyen bir hata oluştu.',

            // Pull to refresh
            pullToRefresh: 'Yenilemek için çekin',
            releaseToRefresh: 'Yenilemek için bırakın',
            refreshing: 'Yenileniyor...',

            // Swipe
            swipeToDelete: 'Silmek için kaydırın',

            // File upload
            uploadingFile: 'Dosya yükleniyor...',
            uploadComplete: 'Yükleme tamamlandı!',
            uploadFailed: 'Yükleme başarısız',
            maxFilesAllowed: 'En fazla {count} dosya yükleyebilirsiniz',
            fileTooLarge: '{filename} çok büyük (maksimum 50MB)',
            fileIsEmpty: '{filename} boş',
            uploadingProgress: 'Yükleniyor... %{progress}',

            // Updates
            updates: 'Güncellemeler',
            checkForUpdates: 'Güncelleme Kontrol Et',
            checking: 'Kontrol ediliyor...',
            upToDate: 'Güncel',
            updateAvailable: 'Güncelleme Mevcut',
            downloading: 'İndiriliyor...',
            downloadingUpdate: 'Güncelleme indiriliyor...',
            readyToInstall: 'Yüklenmeye Hazır',
            installAndRestart: 'Yükle ve Yeniden Başlat',
            currentVersion: 'Mevcut Sürüm',
            latestVersion: 'Son Sürüm',
            updateError: 'Güncelleme Hatası',
            updateErrorDesc: 'Güncelleme kontrolü yapılamadı. Lütfen daha sonra tekrar deneyin.',
            devModeUpdate: 'Güncellemeler sadece production build\'da çalışır',
            newVersionAvailable: 'Yeni sürüm mevcut!',

            // HTTPS & Security
            httpsSettings: 'HTTPS / Güvenlik',
            httpsStatus: 'HTTPS Durumu',
            active: 'Aktif',
            inactive: 'Pasif',
            notConfigured: 'Yapılandırılmamış',
            localIP: 'Yerel IP',
            httpsUrl: 'HTTPS Adresi',
            setupHttps: 'HTTPS Kur',
            repairHttps: 'HTTPS Onar',
            setupInProgress: 'Kuruluyor...',
            exportCert: 'Telefon için Dışa Aktar',
            exportCertDesc: 'Mobil cihazlar için sertifikayı masaüstüne kaydet',
            setupComplete: 'HTTPS Kurulumu Tamamlandı!',
            setupFailed: 'Kurulum Başarısız',
            mkcertRequired: 'mkcert otomatik olarak yüklenecek',
            adminRequired: 'Yönetici izinleri gerekebilir',
            phoneInstructions: 'Telefon Talimatları',
            iphoneSteps: 'iPhone: Ayarlar → Genel → VPN ve Cihaz Yönetimi → Yükle',
            androidSteps: 'Android: Dosyayı aç → CA Sertifikası olarak yükle',
            ipChanged: 'IP Değişti!',
            ipChangedDesc: 'IP adresiniz değişti. Telefon bağlantısı için sertifikayı yenileyin.',
            renewCert: 'Sertifikayı Yenile',
            renewing: 'Yenileniyor...',
            staticIpTip: '💡 İpucu: Bu sorunu kalıcı olarak çözmek için Windows Ağ Ayarlarından sabit IP belirleyin.',
            restartingIn: 'Yeniden başlatılıyor',
            seconds: 'saniye...',
            restartNow: 'Şimdi Yeniden Başlat',
            faceIdReady: '🔒 Face ID Hazır'
        }
    },
};

// Desteklenen dillerin listesi
export const supportedLanguages = Object.keys(translations).map(code => ({
    code,
    name: translations[code].name,
    flag: translations[code].flag
}));

// Varsayılan dil
export const defaultLanguage = APP_CONSTANTS.DEFAULT_LANGUAGE;

// Çeviri fonksiyonu
export function t(key, lang = APP_CONSTANTS.DEFAULT_LANGUAGE) {
    const language = translations[lang] || translations[defaultLanguage];
    return language.translations[key] || translations[defaultLanguage].translations[key] || key;
}

// Tüm çevirileri getir
export function getTranslations(lang = APP_CONSTANTS.DEFAULT_LANGUAGE) {
    return translations[lang]?.translations || translations[defaultLanguage].translations;
}

export default translations;
