import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';

// Components
import TitleBar from './components/TitleBar';
import StatusBadge from './components/StatusBadge';
import ClipboardToggle from './components/ClipboardToggle';
import TextInput from './components/TextInput';
import FileUpload from './components/FileUpload';
import ClipboardList from './components/ClipboardList';
import ServerConfig from './components/ServerConfig';
import Toast from './components/Toast';
import Settings from './components/Settings';
import LanguageSetup from './components/LanguageSetup';

// i18n
import { t, defaultLanguage } from './i18n/translations';

function App() {
    // Socket state
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [serverUrl, setServerUrl] = useState('http://127.0.0.1:8000');
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
        return localStorage.getItem('quicktype_theme') || 'dark';
    });

    // Language state
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('quicktype_language') || null;
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
        if (themeName === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }
    }, []);

    // İlk yüklemede dil ve tema kontrolü
    useEffect(() => {
        const initApp = async () => {
            let savedLang = localStorage.getItem('quicktype_language');

            // LocalStorage'da yoksa Electron'dan (diskten) okumayı dene
            if (!savedLang && window.electronAPI?.getLanguage) {
                try {
                    const electronLang = await window.electronAPI.getLanguage();
                    if (electronLang) {
                        savedLang = electronLang;
                        localStorage.setItem('quicktype_language', savedLang);
                        console.log('Language synced from Electron:', savedLang);
                    }
                } catch (e) {
                    console.error('Failed to sync language from Electron:', e);
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
        const savedTheme = localStorage.getItem('quicktype_theme') || 'dark';
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, [applyTheme]);

    // Tema değişikliği
    const handleThemeChange = useCallback((newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('quicktype_theme', newTheme);
        applyTheme(newTheme);
        window.electronAPI?.setTheme?.(newTheme);
    }, [applyTheme]);

    // Toast göster
    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    }, []);

    // Dil değişikliği
    const handleLanguageChange = useCallback((langCode) => {
        setLanguage(langCode);
        localStorage.setItem('quicktype_language', langCode);

        // Socket üzerinden dil değişikliğini yayınla
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('language_change', { language: langCode });
        }

        showToast(t('languageChanged', langCode), 'success');
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

        setTimeout(() => setIsRetrying(false), 3000);
    }, []);

    // Yeni eklenen öğeler için highlight temizle
    useEffect(() => {
        if (newItemIds.size > 0) {
            const timer = setTimeout(() => {
                setNewItemIds(new Set());
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [newItemIds]);

    // Socket bağlantısı kur
    const connectToServer = useCallback((url) => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        // localhost'u 127.0.0.1'e çevir (IPv6 sorununu önlemek için)
        const fixedUrl = url.replace('localhost', '127.0.0.1');

        const newSocket = io(fixedUrl, {
            transports: ['websocket', 'polling'], // WebSocket öncelikli (daha hızlı)
            reconnection: true,
            reconnectionDelay: 1000,              // 1 saniye
            reconnectionDelayMax: 5000,           // Maksimum 5 saniye
            reconnectionAttempts: Infinity,       // Sonsuz deneme
            randomizationFactor: 0.5,             // Thundering herd önleme
            timeout: 15000
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            setConnectionError(null);
            setIsRetrying(false);

            // Ref kullanarak güncel dili al
            const currentLang = languageRef.current || defaultLanguage;
            showToast(t('connectedToServer', currentLang), 'success');

            // Bağlandığında mevcut dili gönder
            const storedLang = localStorage.getItem('quicktype_language') || defaultLanguage;
            newSocket.emit('language_change', { language: storedLang });
        });

        newSocket.on('disconnect', (reason) => {
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
        newSocket.on('clipboard_init', (data) => {
            setClipboardItems(data.items || []);
            setClipboardEnabled(data.enabled);
        });

        newSocket.on('clipboard_update', (item) => {
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

        newSocket.on('clipboard_state', (data) => {
            setClipboardEnabled(data.enabled);
        });

        newSocket.on('clipboard_deleted', (data) => {
            setClipboardItems(prev => prev.filter(item => item.id !== data.id));
        });

        newSocket.on('clipboard_cleared', () => {
            setClipboardItems([]);
        });

        newSocket.on('clipboard_copied', (data) => {
            if (data.success) {
                const currentLang = languageRef.current || defaultLanguage;
                showToast(t('copiedToPCClipboard', currentLang), 'success');
            }
        });

        newSocket.on('clipboard_error', (data) => {
            const currentLang = languageRef.current || defaultLanguage;
            const errorMsg = data.error || t('errorUnknown', currentLang);
            showToast(errorMsg, 'error');
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
            showToast(t('cannotConnectToServer', currentLang), 'error');
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
            // Ref kontrolü ile gereksiz güncellemeleri önle (gerçi setState zaten kontrol eder)
            if (data.language && data.language !== languageRef.current) {
                setLanguage(data.language);
                localStorage.setItem('quicktype_language', data.language);
                showToast(t('languageChanged', data.language), 'info');
            }
        });

        socketRef.current = newSocket;
        setSocket(newSocket);
        setServerUrl(url);
        localStorage.setItem('quicktype_server_url', url);
    }, [showToast]); // language bağımlılığını kaldırdık

    // İlk yükleme
    useEffect(() => {
        const savedUrl = localStorage.getItem('quicktype_server_url') || 'http://127.0.0.1:8000';
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
            showToast(t('sentAsPopup', language || defaultLanguage), 'success');
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
            showToast(t('copiedToClipboard', language || defaultLanguage), 'success');
        } catch (err) {
            showToast(t('copyFailed', language || defaultLanguage), 'error');
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
            }, 3000);
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
                    showToast(t('copiedToClipboard', lang), 'success');
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
                    showToast(t('imageCopiedToClipboard', lang), 'success');
                } catch (clipboardError) {
                    // Fallback: Base64 olarak text şeklinde kopyala (bazı sistemlerde)
                    console.warn('Direct image copy failed, trying fallback:', clipboardError);
                    const reader = new FileReader();
                    reader.onload = async () => {
                        await navigator.clipboard.writeText(reader.result);
                        showToast(t('imageCopiedToClipboard', lang), 'success');
                    };
                    reader.readAsDataURL(blob);
                }
            } else {
                // Dosya - indirme linkini kopyala
                const downloadUrl = `${serverUrl}/api/clipboard/download/${id}`;
                await navigator.clipboard.writeText(downloadUrl);
                showToast(t('downloadLinkCopied', lang), 'success');
            }
        } catch (err) {
            console.error('Copy failed:', err);
            showToast(t('copyFailed', lang), 'error');
        }
    };

    // Dil seçimi ekranını göster
    if (showLanguageSetup) {
        return <LanguageSetup onLanguageSelect={handleLanguageSetupComplete} />;
    }

    const currentLang = language || defaultLanguage;

    return (
        <div className="app-container">
            {/* Background Orbs */}
            <div className="bg-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

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
                <div className="glass-panel header-section">
                    <div className="header-content">
                        <div className="header-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="2" width="6" height="4" rx="1" ry="1"></rect>
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                            </svg>
                        </div>
                        <div className="header-text">
                            <h1>{t('clipboardManagement', currentLang)}</h1>
                            <p>{t('twoWaySync', currentLang)}</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <StatusBadge isConnected={isConnected} language={currentLang} />
                        <button
                            className="header-settings-btn"
                            onClick={() => setSettingsOpen(true)}
                            title={t('settings', currentLang)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        </button>
                    </div>
                </div>

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
                {connectionError && !isConnected && (
                    <div className="connection-error-panel glass-panel">
                        <div className="connection-error-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <div className="connection-error-text">
                            <span className="error-title">{t('connectionLost', currentLang)}</span>
                            <span className="error-message">{connectionError}</span>
                        </div>
                        <button
                            className={`retry-btn ${isRetrying ? 'retrying' : ''}`}
                            onClick={handleRetry}
                            disabled={isRetrying}
                        >
                            {isRetrying ? (
                                <>
                                    <div className="retry-spinner"></div>
                                    <span>{t('retrying', currentLang)}</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                    <span>{t('retry', currentLang)}</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
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
            {popupData && (
                <div className="popup-modal-overlay" onClick={handleClosePopup}>
                    <div className="popup-modal glass-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-header">
                            <h3>{t('sharedContent', currentLang)}</h3>
                            <button className="popup-close-btn" onClick={handleClosePopup}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="popup-body">
                            <pre className="popup-text">{popupData.content}</pre>
                        </div>
                        <div className="popup-actions">
                            <button className="popup-copy-btn" onClick={handleCopyPopup}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                <span>{t('copy', currentLang)}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
