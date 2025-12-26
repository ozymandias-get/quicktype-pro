/**
 * QuickType Pro - Çoklu Dil Desteği (i18n)
 * Desteklenen diller: İngilizce, Türkçe, Almanca, Fransızca, İspanyolca
 */

const translations = {
    en: {
        code: 'en',
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
            confirmClear: '⚠️ Are you sure? (Click)',

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
            newVersionAvailable: 'New version available!'
        }
    },
    tr: {
        code: 'tr',
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
            confirmClear: '⚠️ Emin misiniz? (Tıklayın)',

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
            newVersionAvailable: 'Yeni sürüm mevcut!'
        }
    },
    de: {
        code: 'de',
        name: 'Deutsch',
        flag: '🇩🇪',
        translations: {
            // App
            appName: 'QuickType Pro',

            // Settings
            settings: 'Einstellungen',
            language: 'Sprache',
            selectLanguage: 'Sprache auswählen',
            languageChanged: 'Sprache erfolgreich geändert!',

            // Clipboard
            clipboardManagement: 'Zwischenablage-Verwaltung',
            twoWaySync: 'Bidirektionale Synchronisierung',
            off: 'Aus',
            on: 'An',
            addTextOrPaste: 'Text hinzufügen oder einfügen...',
            showAsPopup: 'Als Popup anzeigen',
            saveToArchive: 'Im Archiv speichern',
            tapToUploadFile: 'Zum Hochladen tippen',
            imagesPdfEtc: 'Bilder, PDF, usw.',
            fromPhone: 'Vom Telefon',
            fromPC: 'Vom PC',
            noItemsYet: 'Noch keine Elemente',
            addTextOrFile: 'Text oder Datei hinzufügen',
            clearAll: 'Alle löschen',
            confirmClear: '⚠️ Sind Sie sicher? (Klicken)',

            // Keyboard
            keyboard: 'Tastatur',
            clipboard: 'Zwischenablage',
            mouseControl: 'Maussteuerung',
            otherKeys: 'Weitere Tasten',
            touchHereToType: 'Hier tippen und schreiben...',

            // Actions
            selectAll: 'Alles auswählen',
            copy: 'Kopieren',
            paste: 'Einfügen',
            cut: 'Ausschneiden',
            undo: 'Rückgängig',
            redo: 'Wiederholen',

            // Status
            connected: 'Verbunden',
            disconnected: 'Getrennt',
            connecting: 'Verbinden...',
            connectedToServer: 'Mit Server verbunden!',
            cannotConnectToServer: 'Verbindung zum Server nicht möglich!',

            // Toast messages
            copiedToClipboard: 'In Zwischenablage kopiert!',
            copiedToPCClipboard: 'In PC-Zwischenablage kopiert!',
            imageCopiedToClipboard: 'Bild in Zwischenablage kopiert!',
            downloadLinkCopied: 'Download-Link kopiert!',
            copyFailed: 'Kopieren fehlgeschlagen!',
            sentAsPopup: 'Als Popup gesendet!',

            // First run / Setup
            welcome: 'Willkommen bei QuickType Pro!',
            chooseLanguage: 'Wählen Sie Ihre Sprache',
            continue: 'Weiter',

            // Server config
            serverAddress: 'Serveradresse',
            connect: 'Verbinden',

            // Shared content popup
            sharedContent: 'Geteilter Inhalt',
            download: 'Herunterladen',

            // Misc
            refresh: 'Aktualisieren',
            close: 'Schließen',
            back: 'Zurück',

            // Theme
            theme: 'Thema',
            darkMode: 'Dunkelmodus',
            lightMode: 'Hellmodus',
            systemDefault: 'Systemstandard',

            // Startup settings
            launchAtStartup: 'Beim Start öffnen',
            startMinimized: 'Minimiert starten',
            launchAtStartupDesc: 'App beim Windows-Start öffnen',
            startMinimizedDesc: 'Im Infobereich starten',

            // Connection
            retry: 'Wiederholen',
            retrying: 'Wird erneut versucht...',
            connectionLost: 'Verbindung verloren',
            reconnecting: 'Erneut verbinden...',
            tryAgain: 'Erneut versuchen',

            // Errors
            errorServerUnreachable: 'Server nicht erreichbar. Prüfen Sie, ob der Server läuft.',
            errorTimeout: 'Verbindung zeitüberschreitung. Bitte erneut versuchen.',
            errorNetworkError: 'Netzwerkfehler. Prüfen Sie Ihre Verbindung.',
            errorUnknown: 'Ein unbekannter Fehler ist aufgetreten.',

            // Pull to refresh
            pullToRefresh: 'Zum Aktualisieren ziehen',
            releaseToRefresh: 'Loslassen zum Aktualisieren',
            refreshing: 'Wird aktualisiert...',

            // Swipe
            swipeToDelete: 'Zum Löschen wischen',

            // File upload
            uploadingFile: 'Datei wird hochgeladen...',
            uploadComplete: 'Upload abgeschlossen!',
            uploadFailed: 'Upload fehlgeschlagen',

            // Updates
            updates: 'Updates',
            checkForUpdates: 'Nach Updates suchen',
            checking: 'Wird überprüft...',
            upToDate: 'Aktuell',
            updateAvailable: 'Update verfügbar',
            downloading: 'Wird heruntergeladen...',
            downloadingUpdate: 'Update wird heruntergeladen...',
            readyToInstall: 'Bereit zur Installation',
            installAndRestart: 'Installieren & Neustarten',
            currentVersion: 'Aktuelle Version',
            latestVersion: 'Neueste Version',
            updateError: 'Update-Fehler',
            updateErrorDesc: 'Updates konnten nicht überprüft werden. Bitte später erneut versuchen.',
            devModeUpdate: 'Updates nur im Production-Build verfügbar',
            newVersionAvailable: 'Neue Version verfügbar!'
        }
    },
    fr: {
        code: 'fr',
        name: 'Français',
        flag: '🇫🇷',
        translations: {
            // App
            appName: 'QuickType Pro',

            // Settings
            settings: 'Paramètres',
            language: 'Langue',
            selectLanguage: 'Sélectionner la langue',
            languageChanged: 'Langue changée avec succès!',

            // Clipboard
            clipboardManagement: 'Gestion du presse-papiers',
            twoWaySync: 'Synchronisation bidirectionnelle',
            off: 'Désactivé',
            on: 'Activé',
            addTextOrPaste: 'Ajouter du texte ou coller...',
            showAsPopup: 'Afficher en popup',
            saveToArchive: 'Enregistrer dans l\'archive',
            tapToUploadFile: 'Appuyez pour télécharger',
            imagesPdfEtc: 'Images, PDF, etc.',
            fromPhone: 'Du téléphone',
            fromPC: 'Du PC',
            noItemsYet: 'Aucun élément',
            addTextOrFile: 'Ajouter du texte ou un fichier',
            clearAll: 'Tout effacer',
            confirmClear: '⚠️ Êtes-vous sûr? (Cliquez)',

            // Keyboard
            keyboard: 'Clavier',
            clipboard: 'Presse-papiers',
            mouseControl: 'Contrôle souris',
            otherKeys: 'Autres touches',
            touchHereToType: 'Touchez ici pour taper...',

            // Actions
            selectAll: 'Tout sélectionner',
            copy: 'Copier',
            paste: 'Coller',
            cut: 'Couper',
            undo: 'Annuler',
            redo: 'Rétablir',

            // Status
            connected: 'Connecté',
            disconnected: 'Déconnecté',
            connecting: 'Connexion...',
            connectedToServer: 'Connecté au serveur!',
            cannotConnectToServer: 'Impossible de se connecter au serveur!',

            // Toast messages
            copiedToClipboard: 'Copié dans le presse-papiers!',
            copiedToPCClipboard: 'Copié dans le presse-papiers du PC!',
            imageCopiedToClipboard: 'Image copiée dans le presse-papiers!',
            downloadLinkCopied: 'Lien de téléchargement copié!',
            copyFailed: 'Échec de la copie!',
            sentAsPopup: 'Envoyé en popup!',

            // First run / Setup
            welcome: 'Bienvenue dans QuickType Pro!',
            chooseLanguage: 'Choisissez votre langue',
            continue: 'Continuer',

            // Server config
            serverAddress: 'Adresse du serveur',
            connect: 'Connecter',

            // Shared content popup
            sharedContent: 'Contenu partagé',
            download: 'Télécharger',

            // Misc
            refresh: 'Actualiser',
            close: 'Fermer',
            back: 'Retour',

            // Theme
            theme: 'Thème',
            darkMode: 'Mode sombre',
            lightMode: 'Mode clair',
            systemDefault: 'Défaut système',

            // Startup settings
            launchAtStartup: 'Lancer au démarrage',
            startMinimized: 'Démarrer minimisé',
            launchAtStartupDesc: 'Ouvrir l\'app au démarrage Windows',
            startMinimizedDesc: 'Démarrer dans la barre système',

            // Connection
            retry: 'Réessayer',
            retrying: 'Nouvelle tentative...',
            connectionLost: 'Connexion perdue',
            reconnecting: 'Reconnexion...',
            tryAgain: 'Réessayer',

            // Errors
            errorServerUnreachable: 'Serveur inaccessible. Vérifiez si le serveur fonctionne.',
            errorTimeout: 'Délai de connexion dépassé. Veuillez réessayer.',
            errorNetworkError: 'Erreur réseau. Vérifiez votre connexion.',
            errorUnknown: 'Une erreur inconnue est survenue.',

            // Pull to refresh
            pullToRefresh: 'Tirez pour actualiser',
            releaseToRefresh: 'Relâchez pour actualiser',
            refreshing: 'Actualisation...',

            // Swipe
            swipeToDelete: 'Glissez pour supprimer',

            // File upload
            uploadingFile: 'Téléchargement du fichier...',
            uploadComplete: 'Téléchargement terminé!',
            uploadFailed: 'Échec du téléchargement',

            // Updates
            updates: 'Mises à jour',
            checkForUpdates: 'Rechercher des mises à jour',
            checking: 'Vérification...',
            upToDate: 'À jour',
            updateAvailable: 'Mise à jour disponible',
            downloading: 'Téléchargement...',
            downloadingUpdate: 'Téléchargement de la mise à jour...',
            readyToInstall: 'Prêt à installer',
            installAndRestart: 'Installer et Redémarrer',
            currentVersion: 'Version actuelle',
            latestVersion: 'Dernière version',
            updateError: 'Erreur de mise à jour',
            updateErrorDesc: 'Impossible de vérifier les mises à jour. Veuillez réessayer plus tard.',
            devModeUpdate: 'Mises à jour disponibles uniquement en build de production',
            newVersionAvailable: 'Nouvelle version disponible!'
        }
    },
    es: {
        code: 'es',
        name: 'Español',
        flag: '🇪🇸',
        translations: {
            // App
            appName: 'QuickType Pro',

            // Settings
            settings: 'Configuración',
            language: 'Idioma',
            selectLanguage: 'Seleccionar idioma',
            languageChanged: '¡Idioma cambiado con éxito!',

            // Clipboard
            clipboardManagement: 'Gestión del portapapeles',
            twoWaySync: 'Sincronización bidireccional',
            off: 'Desactivado',
            on: 'Activado',
            addTextOrPaste: 'Agregar texto o pegar...',
            showAsPopup: 'Mostrar como popup',
            saveToArchive: 'Guardar en archivo',
            tapToUploadFile: 'Toca para subir archivo',
            imagesPdfEtc: 'Imágenes, PDF, etc.',
            fromPhone: 'Del teléfono',
            fromPC: 'Del PC',
            noItemsYet: 'No hay elementos',
            addTextOrFile: 'Agregar texto o archivo',
            clearAll: 'Borrar todo',
            confirmClear: '⚠️ ¿Está seguro? (Clic)',

            // Keyboard
            keyboard: 'Teclado',
            clipboard: 'Portapapeles',
            mouseControl: 'Control del ratón',
            otherKeys: 'Otras teclas',
            touchHereToType: 'Toca aquí para escribir...',

            // Actions
            selectAll: 'Seleccionar todo',
            copy: 'Copiar',
            paste: 'Pegar',
            cut: 'Cortar',
            undo: 'Deshacer',
            redo: 'Rehacer',

            // Status
            connected: 'Conectado',
            disconnected: 'Desconectado',
            connecting: 'Conectando...',
            connectedToServer: '¡Conectado al servidor!',
            cannotConnectToServer: '¡No se puede conectar al servidor!',

            // Toast messages
            copiedToClipboard: '¡Copiado al portapapeles!',
            copiedToPCClipboard: '¡Copiado al portapapeles del PC!',
            imageCopiedToClipboard: '¡Imagen copiada al portapapeles!',
            downloadLinkCopied: '¡Enlace de descarga copiado!',
            copyFailed: '¡Error al copiar!',
            sentAsPopup: '¡Enviado como popup!',

            // First run / Setup
            welcome: '¡Bienvenido a QuickType Pro!',
            chooseLanguage: 'Elige tu idioma',
            continue: 'Continuar',

            // Server config
            serverAddress: 'Dirección del servidor',
            connect: 'Conectar',

            // Shared content popup
            sharedContent: 'Contenido compartido',
            download: 'Descargar',

            // Misc
            refresh: 'Actualizar',
            close: 'Cerrar',
            back: 'Volver',

            // Theme
            theme: 'Tema',
            darkMode: 'Modo oscuro',
            lightMode: 'Modo claro',
            systemDefault: 'Predeterminado del sistema',

            // Startup settings
            launchAtStartup: 'Iniciar con Windows',
            startMinimized: 'Iniciar minimizado',
            launchAtStartupDesc: 'Abrir app al iniciar Windows',
            startMinimizedDesc: 'Iniciar en la bandeja del sistema',

            // Connection
            retry: 'Reintentar',
            retrying: 'Reintentando...',
            connectionLost: 'Conexión perdida',
            reconnecting: 'Reconectando...',
            tryAgain: 'Intentar de nuevo',

            // Errors
            errorServerUnreachable: 'Servidor inalcanzable. Verifique si el servidor está funcionando.',
            errorTimeout: 'Tiempo de conexión agotado. Por favor, inténtelo de nuevo.',
            errorNetworkError: 'Error de red. Verifique su conexión.',
            errorUnknown: 'Ha ocurrido un error desconocido.',

            // Pull to refresh
            pullToRefresh: 'Desliza para actualizar',
            releaseToRefresh: 'Suelta para actualizar',
            refreshing: 'Actualizando...',

            // Swipe
            swipeToDelete: 'Desliza para eliminar',

            // File upload
            uploadingFile: 'Subiendo archivo...',
            uploadComplete: '¡Subida completada!',
            uploadFailed: 'Error al subir',

            // Updates
            updates: 'Actualizaciones',
            checkForUpdates: 'Buscar Actualizaciones',
            checking: 'Comprobando...',
            upToDate: 'Actualizado',
            updateAvailable: 'Actualización Disponible',
            downloading: 'Descargando...',
            downloadingUpdate: 'Descargando actualización...',
            readyToInstall: 'Listo para Instalar',
            installAndRestart: 'Instalar y Reiniciar',
            currentVersion: 'Versión Actual',
            latestVersion: 'Última Versión',
            updateError: 'Error de Actualización',
            updateErrorDesc: 'No se pudo verificar las actualizaciones. Inténtelo de nuevo más tarde.',
            devModeUpdate: 'Actualizaciones solo disponibles en build de producción',
            newVersionAvailable: '¡Nueva versión disponible!'
        }
    },
    zh: {
        code: 'zh',
        name: '中文',
        flag: '🇨🇳',
        translations: {
            // App
            appName: 'QuickType Pro',

            // Settings
            settings: '设置',
            language: '语言',
            selectLanguage: '选择语言',
            languageChanged: '语言更改成功！',

            // Clipboard
            clipboardManagement: '剪贴板管理',
            twoWaySync: '双向同步',
            off: '关闭',
            on: '开启',
            addTextOrPaste: '添加文本或粘贴...',
            showAsPopup: '显示为弹窗',
            saveToArchive: '保存到存档',
            tapToUploadFile: '点击上传文件',
            imagesPdfEtc: '图片、PDF等',
            fromPhone: '来自手机',
            fromPC: '来自电脑',
            noItemsYet: '暂无项目',
            addTextOrFile: '添加文本或文件',
            clearAll: '清除全部',
            confirmClear: '⚠️ 确定吗？(点击)',

            // Keyboard
            keyboard: '键盘',
            clipboard: '剪贴板',
            mouseControl: '鼠标控制',
            otherKeys: '其他按键',
            touchHereToType: '点击此处开始输入...',

            // Actions
            selectAll: '全选',
            copy: '复制',
            paste: '粘贴',
            cut: '剪切',
            undo: '撤销',
            redo: '重做',

            // Status
            connected: '已连接',
            disconnected: '已断开',
            connecting: '连接中...',
            connectedToServer: '已连接到服务器！',
            cannotConnectToServer: '无法连接到服务器！',

            // Toast messages
            copiedToClipboard: '已复制到剪贴板！',
            copiedToPCClipboard: '已复制到电脑剪贴板！',
            imageCopiedToClipboard: '图片已复制到剪贴板！',
            downloadLinkCopied: '下载链接已复制！',
            copyFailed: '复制失败！',
            sentAsPopup: '已作为弹窗发送！',

            // First run / Setup
            welcome: '欢迎使用 QuickType Pro！',
            chooseLanguage: '选择您的语言',
            continue: '继续',

            // Server config
            serverAddress: '服务器地址',
            connect: '连接',

            // Shared content popup
            sharedContent: '共享内容',
            download: '下载',

            // Misc
            refresh: '刷新',
            close: '关闭',
            back: '返回',

            // Theme
            theme: '主题',
            darkMode: '深色模式',
            lightMode: '浅色模式',
            systemDefault: '跟随系统',

            // Startup settings
            launchAtStartup: '开机启动',
            startMinimized: '最小化启动',
            launchAtStartupDesc: 'Windows启动时打开应用',
            startMinimizedDesc: '在系统托盘中启动',

            // Connection
            retry: '重试',
            retrying: '正在重试...',
            connectionLost: '连接断开',
            reconnecting: '正在重连...',
            tryAgain: '再试一次',

            // Errors
            errorServerUnreachable: '无法访问服务器。请检查服务器是否正在运行。',
            errorTimeout: '连接超时。请重试。',
            errorNetworkError: '网络错误。请检查您的连接。',
            errorUnknown: '发生未知错误。',

            // Pull to refresh
            pullToRefresh: '下拉刷新',
            releaseToRefresh: '松开刷新',
            refreshing: '刷新中...',

            // Swipe
            swipeToDelete: '滑动删除',

            // File upload
            uploadingFile: '正在上传文件...',
            uploadComplete: '上传完成！',
            uploadFailed: '上传失败',

            // Updates
            updates: '更新',
            checkForUpdates: '检查更新',
            checking: '检查中...',
            upToDate: '已是最新版本',
            updateAvailable: '有可用更新',
            downloading: '下载中...',
            downloadingUpdate: '正在下载更新...',
            readyToInstall: '准备安装',
            installAndRestart: '安装并重启',
            currentVersion: '当前版本',
            latestVersion: '最新版本',
            updateError: '更新错误',
            updateErrorDesc: '无法检查更新。请稍后重试。',
            devModeUpdate: '更新仅在生产版本中可用',
            newVersionAvailable: '有新版本可用！'
        }
    }
};

// Desteklenen dillerin listesi
export const supportedLanguages = Object.keys(translations).map(code => ({
    code,
    name: translations[code].name,
    flag: translations[code].flag
}));

// Varsayılan dil
export const defaultLanguage = 'en';

// Çeviri fonksiyonu
export function t(key, lang = 'en') {
    const language = translations[lang] || translations[defaultLanguage];
    return language.translations[key] || translations[defaultLanguage].translations[key] || key;
}

// Tüm çevirileri getir
export function getTranslations(lang = 'en') {
    return translations[lang]?.translations || translations[defaultLanguage].translations;
}

export default translations;
