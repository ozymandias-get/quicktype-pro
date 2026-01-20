import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';

// Components
import TitleBar from './components/TitleBar';
import ClipboardToggle from './components/ClipboardToggle';
import TextInput from './components/TextInput';
import FileUpload from './components/FileUpload';
import ClipboardList from './components/ClipboardList';
import ServerConfig from './components/ServerConfig';
import Toast from './components/Toast';
import Settings from './components/Settings';
import LanguageSetup from './components/LanguageSetup';

// Extracted Components
import AppBackground from './components/layout/AppBackground';
import HeaderSection from './components/layout/HeaderSection';
import ConnectionErrorPanel from './components/layout/ConnectionErrorPanel';
import SharedContentPopup from './components/popups/SharedContentPopup';

// i18n
import { t, defaultLanguage } from './i18n/translations';
import { APP_CONSTANTS } from './constants';

function App() {
    // Socket state
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [serverUrl, setServerUrl] = useState(APP_CONSTANTS.DEFAULT_SERVER_URL);
    const [connectionError, setConnectionError] = useState(null);
    const [isRetrying, setIsRetrying] = useState(false);

    // Clipboard state
    const [clipboardItems, setClipboardItems] = useState([]);
    const [clipboardEnabled, setClipboardEnabled] = useState(true);
    const [newItemIds, setNewItemIds] = useState(new Set()); // Yeni eklenen öğeler için highlight

    // Toast state
    const [toast, setToast] = useState(null);

    // Pop-up state
    const [popupData, setPopupData] = useState(null);

    // Clear all confirm state
    const [clearConfirm, setClearConfirm] = useState(false);
    const clearTimeoutRef = useRef(null);

    // Settings state
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Theme state
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.THEME) || APP_CONSTANTS.THEMES.DARK;
    });

    // Language state
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.LANGUAGE) || null;
    });
    const [showLanguageSetup, setShowLanguageSetup] = useState(false);

    // Pull to refresh state
    const [isPulling, setIsPulling] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Refs
    const socketRef = useRef(null);
    const mainContentRef = useRef(null);
    const languageRef = useRef(language);

    // Dil değiştiğinde ref'i güncelle (callback'ler için)
    useEffect(() => {
        languageRef.current = language;
    }, [language]);

    // Tema uygula
    const applyTheme = useCallback((themeName) => {
        document.documentElement.setAttribute('data-theme', themeName);
        if (themeName === APP_CONSTANTS.THEMES.SYSTEM) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? APP_CONSTANTS.THEMES.DARK : APP_CONSTANTS.THEMES.LIGHT);
        }
    }, []);

    // İlk yüklemede dil ve tema kontrolü
    useEffect(() => {
        const initApp = async () => {
            let savedLang = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.LANGUAGE);

            // LocalStorage'da yoksa Electron'dan (diskten) okumayı dene
            if (!savedLang && window.electronAPI?.getLanguage) {
                try {
                    const electronLang = await window.electronAPI.getLanguage();
                    if (electronLang) {
                        savedLang = electronLang;
                        localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.LANGUAGE, savedLang);
                        // console.log removed (Rule: forbidden-console-log)
                    }
                } catch (e) {
                    // console.error removed, strictly suppressed in production or use internal logger if needed
                }
            }

            if (!savedLang) {
                setShowLanguageSetup(true);
            } else {
                setLanguage(savedLang);
            }
        };

        initApp();

        // Tema yükle
        const savedTheme = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.THEME) || APP_CONSTANTS.THEMES.DARK;
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, [applyTheme]);

    // Tema değişikliği
    const handleThemeChange = useCallback((newTheme) => {
        setTheme(newTheme);
        localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.THEME, newTheme);
        applyTheme(newTheme);
        window.electronAPI?.setTheme?.(newTheme);
    }, [applyTheme]);

    // Toast göster
    const showToast = useCallback((message, type = APP_CONSTANTS.TOAST_TYPES.INFO) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), APP_CONSTANTS.TIMEOUTS.TOAST);
    }, []);

    // Dil değişikliği
    const handleLanguageChange = useCallback((langCode, isFromSocket = false) => {
        setLanguage(langCode);
        localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.LANGUAGE, langCode);

        // Electron ayarlarına da kaydet (Böylece yeniden başlatınca hatırlanır)
        window.electronAPI?.setLanguage?.(langCode);

        // Socket üzerinden dil değişikliğini yayınla (sadece biz değiştirdiysek)
        if (!isFromSocket && socketRef.current && socketRef.current.connected) {
            socketRef.current.emit(APP_CONSTANTS.SOCKET_EVENTS.LANGUAGE_CHANGE, { language: langCode });
        }

        if (!isFromSocket) {
            showToast(t('languageChanged', langCode), APP_CONSTANTS.TOAST_TYPES.SUCCESS);
        }
    }, [showToast]);

    // Language setup tamamlandığında
    const handleLanguageSetupComplete = useCallback((langCode) => {
        handleLanguageChange(langCode);
        setShowLanguageSetup(false);
    }, [handleLanguageChange]);

    // Retry bağlantı - socket connector'ı kullan
    const handleRetry = useCallback(() => {
        setIsRetrying(true);
        setConnectionError(null);

        // Socket'i yeniden bağla
        if (socketRef.current) {
            socketRef.current.connect();
        }

        setTimeout(() => setIsRetrying(false), APP_CONSTANTS.TIMEOUTS.RETRY_DELAY);
    }, []);

    // Yeni eklenen öğeler için highlight temizle
    useEffect(() => {
        if (newItemIds.size > 0) {
            const timer = setTimeout(() => {
                setNewItemIds(new Set());
            }, APP_CONSTANTS.TIMEOUTS.HIGHLIGHT_DURATION);
            return () => clearTimeout(timer);
        }
    }, [newItemIds]);

    // Socket bağlantısı kur
    const connectToServer = useCallback((url) => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        // localhost'u 127.0.0.1'e çevir (IPv6 sorununu önlemek için)
        const fixedUrl = url.replace('localhost', APP_CONSTANTS.LOCALHOST_IPV4);

        const newSocket = io(fixedUrl, {
            transports: ['websocket', 'polling'], // WebSocket öncelikli (daha hızlı)
            reconnection: true,
            reconnectionDelay: APP_CONSTANTS.TIMEOUTS.SOCKET_RECONNECTION_DELAY,
            reconnectionDelayMax: APP_CONSTANTS.TIMEOUTS.SOCKET_RECONNECTION_DELAY_MAX,
            reconnectionAttempts: Infinity,       // Sonsuz deneme
            randomizationFactor: 0.5,             // Thundering herd önleme
            timeout: APP_CONSTANTS.TIMEOUTS.SOCKET_TIMEOUT
        });

        newSocket.on(APP_CONSTANTS.SOCKET_EVENTS.CONNECT, () => {
            setIsConnected(true);
            setConnectionError(null);
            setIsRetrying(false);

            // Ref kullanarak güncel dili al
            const currentLang = languageRef.current || defaultLanguage;
            showToast(t('connectedToServer', currentLang), APP_CONSTANTS.TOAST_TYPES.SUCCESS);

            // Bağlandığında mevcut dili gönder
            const storedLang = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.LANGUAGE) || defaultLanguage;
            newSocket.emit(APP_CONSTANTS.SOCKET_EVENTS.LANGUAGE_CHANGE, { language: storedLang });
        });

        newSocket.on(APP_CONSTANTS.SOCKET_EVENTS.DISCONNECT, (reason) => {
            setIsConnected(false);
            const currentLang = languageRef.current || defaultLanguage;

            if (reason === 'io server disconnect') {
                setConnectionError(t('connectionLost', currentLang));
                newSocket.connect();
            } else if (reason === 'transport close') {
                setConnectionError(t('errorServerUnreachable', currentLang));
            }
        });

        // Clipboard events
        newSocket.on(APP_CONSTANTS.SOCKET_EVENTS.CLIPBOARD_INIT, (data) => {
            setClipboardItems(data.items || []);
            setClipboardEnabled(data.enabled);
        });

        newSocket.on(APP_CONSTANTS.SOCKET_EVENTS.CLIPBOARD_UPDATE, (item) => {
            setClipboardItems(prev => {
                const existingIndex = prev.findIndex(i => i.id === item.id);
                if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex] = item;
                    return updated;
                }
                // Yeni öğe eklendi - highlight için işaretle
                setNewItemIds(prevIds => new Set([...prevIds, item.id]));
                return [item, ...prev];
            });
        });

        newSocket.on(APP_CONSTANTS.SOCKET_EVENTS.CLIPBOARD_STATE, (data) => {
            setClipboardEnabled(data.enabled);
        });

        newSocket.on(APP_CONSTANTS.SOCKET_EVENTS.CLIPBOARD_DELETED, (data) => {
            setClipboardItems(prev => prev.filter(item => item.id !== data.id));
        });

        newSocket.on(APP_CONSTANTS.SOCKET_EVENTS.CLIPBOARD_CLEARED, () => {
            setClipboardItems([]);
        });

        newSocket.on(APP_CONSTANTS.SOCKET_EVENTS.CLIPBOARD_COPIED, (data) => {
            if (data.success) {
                const currentLang = languageRef.current || defaultLanguage;
                showToast(t('copiedToPCClipboard', currentLang), APP_CONSTANTS.TOAST_TYPES.SUCCESS);
            }
        });

        newSocket.on(APP_CONSTANTS.SOCKET_EVENTS.CLIPBOARD_ERROR, (data) => {
            const currentLang = languageRef.current || defaultLanguage;
            const errorMsg = data.error || t('errorUnknown', currentLang);
            showToast(errorMsg, APP_CONSTANTS.TOAST_TYPES.ERROR);
        });

        newSocket.on('connect_error', (error) => {
            const currentLang = languageRef.current || defaultLanguage;
            // Detaylı hata mesajları
            let errorMessage = t('errorServerUnreachable', currentLang);
            if (error.message.includes('timeout')) {
                errorMessage = t('errorTimeout', currentLang);
            } else if (error.message.includes('xhr') || error.message.includes('network')) {
                errorMessage = t('errorNetworkError', currentLang);
            }
            setConnectionError(errorMessage);
        });

        newSocket.on('reconnect_failed', () => {
            const currentLang = languageRef.current || defaultLanguage;
            setConnectionError(t('cannotConnectToServer', currentLang));
            showToast(t('cannotConnectToServer', currentLang), APP_CONSTANTS.TOAST_TYPES.ERROR);
        });

        newSocket.on('reconnecting', () => {
            setIsRetrying(true);
        });

        // Pop-up event - diğer cihazlardan gelen
        newSocket.on('clipboard_popup_show', (data) => {
            setPopupData(data);
        });

        // Dil değişikliği event'i - diğer cihazlardan gelen
        newSocket.on('language_changed', (data) => {
            // Ref kontrolü ile gereksiz güncellemeleri önle
            if (data.language && data.language !== languageRef.current) {
                // isFromSocket = true olarak çağır
                handleLanguageChange(data.language, true);

                // Toast göster (bilgi amaçlı)
                showToast(t('languageChanged', data.language), APP_CONSTANTS.TOAST_TYPES.INFO);
            }
        });

        socketRef.current = newSocket;
        setSocket(newSocket);
        setServerUrl(url);
        localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.SERVER_URL, url);
    }, [showToast]); // language bağımlılığını kaldırdık

    // İlk yükleme
    useEffect(() => {
        const savedUrl = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.SERVER_URL) || APP_CONSTANTS.DEFAULT_SERVER_URL;
        setServerUrl(savedUrl);
        connectToServer(savedUrl);

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [connectToServer]);

    // Toggle handler
    const handleToggle = () => {
        const newState = !clipboardEnabled;
        setClipboardEnabled(newState);
        socket?.emit('clipboard_toggle', { enabled: newState });
    };

    // Text gönder (arşive kaydet)
    const handleSendText = (text) => {
        if (text.trim() && socket) {
            socket.emit('clipboard_add', {
                content: text.trim(),
                content_type: 'text'
            });
        }
    };

    // Pop-up olarak gönder (arşive kaydetme)
    const handleSendPopup = (text) => {
        if (text.trim() && socket) {
            socket.emit('clipboard_popup', {
                content: text.trim(),
                content_type: 'text'
            });
            showToast(t('sentAsPopup', language || defaultLanguage), APP_CONSTANTS.TOAST_TYPES.SUCCESS);
        }
    };

    // Pop-up kapat
    const handleClosePopup = () => {
        setPopupData(null);
    };

    // Pop-up içeriğini kopyala
    const handleCopyPopup = async () => {
        if (!popupData) return;
        try {
            await navigator.clipboard.writeText(popupData.content || '');
            showToast(t('copiedToClipboard', language || defaultLanguage), APP_CONSTANTS.TOAST_TYPES.SUCCESS);
        } catch (err) {
            showToast(t('copyFailed', language || defaultLanguage), APP_CONSTANTS.TOAST_TYPES.ERROR);
        }
    };

    // Dosya gönder
    const handleSendFiles = (files) => {
        if (!socket) return;

        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result.split(',')[1];
                const contentType = file.type.startsWith('image/') ? 'image' : 'file';

                socket.emit('clipboard_add', {
                    content: base64,
                    content_type: contentType,
                    filename: file.name
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Öğe sil
    const handleDeleteItem = (id) => {
        socket?.emit('clipboard_delete', { id });
    };

    // Tümünü temizle - çift tıklama onaylı
    const handleClearAll = () => {
        if (!clearConfirm) {
            // İlk tıklama - onay moduna geç
            setClearConfirm(true);
            clearTimeoutRef.current = setTimeout(() => {
                setClearConfirm(false);
            }, APP_CONSTANTS.TIMEOUTS.RETRY_DELAY);
        } else {
            // İkinci tıklama - sil
            if (clearTimeoutRef.current) {
                clearTimeout(clearTimeoutRef.current);
            }
            socket?.emit('clipboard_clear');
            setClearConfirm(false);
        }
    };

    // PC'ye kopyala
    const handleCopyToPC = (id) => {
        socket?.emit('clipboard_copy_to_pc', { id });
    };

    // Telefon panosuna kopyala - Resim ve dosya desteği ile
    const handleCopyToLocal = async (id) => {
        const item = clipboardItems.find(i => i.id === id);
        if (!item) return;
        const lang = language || defaultLanguage;

        try {
            if (item.content_type === 'text') {
                // Metin içeriği kopyala
                const response = await fetch(`${serverUrl}/api/clipboard/content/${id}`);
                const data = await response.json();
                if (data.content) {
                    await navigator.clipboard.writeText(data.content);
                    showToast(t('copiedToClipboard', lang), APP_CONSTANTS.TOAST_TYPES.SUCCESS);
                }
            } else if (item.content_type === 'image') {
                // Resim içeriği kopyala - Blob olarak
                const response = await fetch(`${serverUrl}/api/clipboard/download/${id}`);
                const blob = await response.blob();

                try {
                    // Modern Clipboard API ile resim kopyala
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            [blob.type]: blob
                        })
                    ]);
                    showToast(t('imageCopiedToClipboard', lang), APP_CONSTANTS.TOAST_TYPES.SUCCESS);
                } catch (clipboardError) {
                    // Fallback: Base64 olarak text şeklinde kopyala (bazı sistemlerde)
                    // console.warn removed or replaced with conditional logs if necessary, 
                    // keeping silent fallbacks for cleaner console
                    const reader = new FileReader();
                    reader.onload = async () => {
                        await navigator.clipboard.writeText(reader.result);
                        showToast(t('imageCopiedToClipboard', lang), APP_CONSTANTS.TOAST_TYPES.SUCCESS);
                    };
                    reader.readAsDataURL(blob);
                }
            } else {
                // Dosya - indirme linkini kopyala
                const downloadUrl = `${serverUrl}/api/clipboard/download/${id}`;
                await navigator.clipboard.writeText(downloadUrl);
                showToast(t('downloadLinkCopied', lang), APP_CONSTANTS.TOAST_TYPES.SUCCESS);
            }
        } catch (err) {
            // console.error removed
            showToast(t('copyFailed', lang), APP_CONSTANTS.TOAST_TYPES.ERROR);
        }
    };

    // Dil seçimi ekranını göster
    if (showLanguageSetup) {
        return <LanguageSetup onLanguageSelect={handleLanguageSetupComplete} />;
    }

    const currentLang = language || defaultLanguage;

    return (
        <div className="app-container">
            {/* Background */}
            <AppBackground />

            {/* Title Bar */}
            <TitleBar />

            {/* Main Content */}
            <div className="main-content">
                {/* Server Config */}
                <ServerConfig
                    serverUrl={serverUrl}
                    isConnected={isConnected}
                    onConnect={connectToServer}
                    language={currentLang}
                />

                {/* Header */}
                <HeaderSection
                    language={currentLang}
                    isConnected={isConnected}
                    onOpenSettings={() => setSettingsOpen(true)}
                />

                {/* Toggle */}
                <ClipboardToggle
                    enabled={clipboardEnabled}
                    onToggle={handleToggle}
                    language={currentLang}
                />

                {/* Text Input */}
                <TextInput
                    onSend={handleSendText}
                    onSendPopup={handleSendPopup}
                    language={currentLang}
                />

                {/* File Upload */}
                <FileUpload
                    onUpload={handleSendFiles}
                    language={currentLang}
                />

                {/* Legend */}
                <div className="legend">
                    <div className="legend-item">
                        <div className="legend-dot phone"></div>
                        <span>{t('fromPhone', currentLang)}</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-dot pc"></div>
                        <span>{t('fromPC', currentLang)}</span>
                    </div>
                </div>

                {/* Clipboard List */}
                <ClipboardList
                    items={clipboardItems}
                    serverUrl={serverUrl}
                    onDelete={handleDeleteItem}
                    onCopyToPC={handleCopyToPC}
                    onCopyToLocal={handleCopyToLocal}
                    language={currentLang}
                    newItemIds={newItemIds}
                />

                {/* Clear All */}
                {clipboardItems.length > 0 && (
                    <button
                        className={`clear-all-btn ${clearConfirm ? 'confirm-pending' : ''}`}
                        onClick={handleClearAll}
                    >
                        {clearConfirm ? t('confirmClear', currentLang) : t('clearAll', currentLang)}
                    </button>
                )}

                {/* Connection Error Retry */}
                <ConnectionErrorPanel
                    isConnected={isConnected}
                    connectionError={connectionError}
                    isRetrying={isRetrying}
                    onRetry={handleRetry}
                    language={currentLang}
                />
            </div>

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} />}

            {/* Settings Modal */}
            <Settings
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                currentLanguage={currentLang}
                onLanguageChange={handleLanguageChange}
                currentTheme={theme}
                onThemeChange={handleThemeChange}
            />

            {/* Pop-up Modal */}
            <SharedContentPopup
                popupData={popupData}
                onClose={handleClosePopup}
                onCopy={handleCopyPopup}
                language={currentLang}
            />
        </div>
    );
}

export default App;
