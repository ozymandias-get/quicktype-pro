export const APP_CONSTANTS = {
    DEFAULT_SERVER_URL: 'https://127.0.0.1:8000',
    LOCALHOST_IPV4: '127.0.0.1',
    TIMEOUTS: {
        TOAST: 2500,
        RETRY_DELAY: 3000,
        HIGHLIGHT_DURATION: 2000,
        SOCKET_RECONNECTION_DELAY: 1000,
        SOCKET_RECONNECTION_DELAY_MAX: 5000,
        SOCKET_TIMEOUT: 15000,
    },
    STORAGE_KEYS: {
        THEME: 'quicktype_theme',
        LANGUAGE: 'quicktype_language',
        SERVER_URL: 'quicktype_server_url',
    },
    THEMES: {
        DARK: 'dark',
        LIGHT: 'light',
        SYSTEM: 'system',
    },
    SOCKET_EVENTS: {
        CONNECT: 'connect',
        DISCONNECT: 'disconnect',
        CLIPBOARD_INIT: 'clipboard_init',
        CLIPBOARD_UPDATE: 'clipboard_update',
        CLIPBOARD_STATE: 'clipboard_state',
        CLIPBOARD_DELETED: 'clipboard_deleted',
        CLIPBOARD_CLEARED: 'clipboard_cleared',
        CLIPBOARD_COPIED: 'clipboard_copied',
        CLIPBOARD_ERROR: 'clipboard_error',
        LANGUAGE_CHANGE: 'language_change',
        LANGUAGE_CHANGED: 'language_changed',
    },
    FILE_UPLOAD: {
        MAX_SIZE: 50 * 1024 * 1024, // 50MB
        MAX_FILES: 5,
    },
    SWIPE: {
        THRESHOLD: 100,
        MAX_OFFSET: 150,
        ANIMATION_DELAY: 300,
    },
    CLIPBOARD_ITEM: {
        PREVIEW_LENGTH: 100,
        KILOBYTE: 1024,
    },
    DEFAULT_PLACEHOLDER_IP: 'https://192.168.1.x:8000',
    TOAST_TYPES: {
        INFO: 'info',
        SUCCESS: 'success',
        ERROR: 'error',
    },
    UPDATE_STATUS: {
        IDLE: 'idle',
        CHECKING: 'checking',
        AVAILABLE: 'available',
        DOWNLOADING: 'downloading',
        READY: 'ready',
        UP_TO_DATE: 'up-to-date',
        ERROR: 'error',
        DEV_MODE: 'dev-mode',
    },
    LANGUAGES: {
        EN: 'en',
        TR: 'tr',
    },
    DEFAULT_LANGUAGE: 'en',
    ITEM_SOURCES: {
        PHONE: 'phone',
        PC: 'pc',
    }
};
