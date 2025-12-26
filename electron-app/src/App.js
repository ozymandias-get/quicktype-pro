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

function App() {
    // Socket state
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [serverUrl, setServerUrl] = useState('http://127.0.0.1:8000');

    // Clipboard state
    const [clipboardItems, setClipboardItems] = useState([]);
    const [clipboardEnabled, setClipboardEnabled] = useState(true);

    // Toast state
    const [toast, setToast] = useState(null);

    // Pop-up state
    const [popupData, setPopupData] = useState(null);

    // Clear all confirm state
    const [clearConfirm, setClearConfirm] = useState(false);
    const clearTimeoutRef = useRef(null);

    // Refs
    const socketRef = useRef(null);

    // Toast göster
    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    }, []);

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
            showToast('Sunucuya bağlandı!', 'success');
        });

        newSocket.on('disconnect', (reason) => {
            setIsConnected(false);
            // Sunucu tarafından kapatıldıysa yeniden bağlan
            if (reason === 'io server disconnect') {
                newSocket.connect();
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
                showToast('PC panosuna kopyalandı!', 'success');
            }
        });

        newSocket.on('clipboard_error', (data) => {
            showToast(data.error || 'Bir hata oluştu', 'error');
        });

        newSocket.on('connect_error', () => {
            // İlk bağlantı hatası - sessiz kal (reconnect deneyecek)
        });

        newSocket.on('reconnect_failed', () => {
            showToast('Sunucuya bağlanılamıyor!', 'error');
        });

        // Pop-up event - diğer cihazlardan gelen
        newSocket.on('clipboard_popup_show', (data) => {
            setPopupData(data);
        });

        socketRef.current = newSocket;
        setSocket(newSocket);
        setServerUrl(url);
        localStorage.setItem('quicktype_server_url', url);
    }, [showToast]);

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
            showToast('Pop-up olarak gönderildi!', 'success');
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
            showToast('Panoya kopyalandı!', 'success');
        } catch (err) {
            showToast('Kopyalama başarısız!', 'error');
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

        try {
            if (item.content_type === 'text') {
                // Metin içeriği kopyala
                const response = await fetch(`${serverUrl}/api/clipboard/content/${id}`);
                const data = await response.json();
                if (data.content) {
                    await navigator.clipboard.writeText(data.content);
                    showToast('Panoya kopyalandı!', 'success');
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
                    showToast('Resim panoya kopyalandı!', 'success');
                } catch (clipboardError) {
                    // Fallback: Base64 olarak text şeklinde kopyala (bazı sistemlerde)
                    console.warn('Direct image copy failed, trying fallback:', clipboardError);
                    const reader = new FileReader();
                    reader.onload = async () => {
                        await navigator.clipboard.writeText(reader.result);
                        showToast('Resim verisi kopyalandı!', 'success');
                    };
                    reader.readAsDataURL(blob);
                }
            } else {
                // Dosya - indirme linkini kopyala
                const downloadUrl = `${serverUrl}/api/clipboard/download/${id}`;
                await navigator.clipboard.writeText(downloadUrl);
                showToast('İndirme linki kopyalandı!', 'success');
            }
        } catch (err) {
            console.error('Copy failed:', err);
            showToast('Kopyalama başarısız!', 'error');
        }
    };

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
                            <h1>Pano Yönetimi</h1>
                            <p>İki yönlü senkronizasyon</p>
                        </div>
                    </div>
                    <StatusBadge isConnected={isConnected} />
                </div>

                {/* Toggle */}
                <ClipboardToggle
                    enabled={clipboardEnabled}
                    onToggle={handleToggle}
                />

                {/* Text Input */}
                <TextInput onSend={handleSendText} onSendPopup={handleSendPopup} />

                {/* File Upload */}
                <FileUpload onUpload={handleSendFiles} />

                {/* Legend */}
                <div className="legend">
                    <div className="legend-item">
                        <div className="legend-dot phone"></div>
                        <span>Telefondan</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-dot pc"></div>
                        <span>PC'den</span>
                    </div>
                </div>

                {/* Clipboard List */}
                <ClipboardList
                    items={clipboardItems}
                    serverUrl={serverUrl}
                    onDelete={handleDeleteItem}
                    onCopyToPC={handleCopyToPC}
                    onCopyToLocal={handleCopyToLocal}
                />

                {/* Clear All */}
                {clipboardItems.length > 0 && (
                    <button
                        className={`clear-all-btn ${clearConfirm ? 'confirm-pending' : ''}`}
                        onClick={handleClearAll}
                    >
                        {clearConfirm ? '⚠️ Emin misiniz? (Tıklayın)' : 'Tümünü Temizle'}
                    </button>
                )}
            </div>

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} />}

            {/* Pop-up Modal */}
            {popupData && (
                <div className="popup-modal-overlay" onClick={handleClosePopup}>
                    <div className="popup-modal glass-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="popup-header">
                            <h3>Paylaşılan İçerik</h3>
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
                                <span>Kopyala</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
