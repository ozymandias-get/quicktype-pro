/**
 * Socket Manager Module
 * Socket.IO bağlantı yönetimi - Production-Ready Version
 * 
 * Özellikler:
 * - Event listener cleanup mekanizması
 * - Memory leak önleme
 * - Robust error handling
 * - Constants ile magic number'lar elimine edildi
 * - Singleton pattern ile tekrar başlatma koruması
 * - PWA arka plan/ön plan yönetimi
 */

import { showToast } from './utils.js';

// ==================== CONSTANTS ====================
const SOCKET_CONFIG = {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 300,           // 300ms - çok hızlı yeniden deneme
    reconnectionDelayMax: 2000,       // Maksimum 2 saniye bekle
    randomizationFactor: 0.2,         // Az rastgelelik
    timeout: 20000,                   // 20 saniye timeout - mobil için daha uzun
    transports: ['polling', 'websocket'], // Polling öncelikli - daha güvenilir bağlantı
    upgrade: true,                    // WebSocket'e yükselt
    forceNew: false,
    multiplex: true,
    autoConnect: true,                // Otomatik bağlan
    path: '/socket.io/'               // Explicit path
};

// Heartbeat aralığı (ms) - Socket.IO'nun kendi ping mekanizması olduğu için
// bu değer daha uzun tutulabilir, sadece ek güvenlik katmanı
const HEARTBEAT_INTERVAL_MS = 25000;

// Toast gösterim süresi (ms)
const TOAST_DEBOUNCE_MS = 1000;

// ==================== SOCKET INSTANCE ====================
export const socket = io(SOCKET_CONFIG);

// ==================== STATE MANAGEMENT ====================
/**
 * Module-level state container
 * Daha iyi encapsulation ve test edilebilirlik için
 */
const state = {
    isReconnecting: false,
    isInitialConnection: true,
    isInitialized: false,           // Singleton pattern için
    statusDotElement: null,
    heartbeatIntervalId: null,
    lastToastTime: 0,               // Toast debouncing için
    eventHandlers: new Map()        // Cleanup için handler referansları
};

// ==================== STATUS INDICATOR ====================
/**
 * Status göstergesini güncelle (optimized)
 * @param {'connected'|'disconnected'|'connecting'} status
 */
function updateStatusIndicator(status) {
    const element = state.statusDotElement;
    if (!element) {
        console.warn('⚠️ Status indicator element bulunamadı');
        return;
    }

    // CSS class map - daha maintainable
    const statusClasses = {
        connected: ['bg-green-500', 'shadow-[0_0_12px_rgba(34,197,94,0.8)]'],
        disconnected: ['bg-red-500', 'shadow-[0_0_12px_rgba(239,68,68,0.8)]'],
        connecting: ['bg-yellow-500', 'shadow-[0_0_12px_rgba(234,179,8,0.8)]', 'animate-pulse']
    };

    // Tüm olası class'ları tek seferde temizle
    const allClasses = Object.values(statusClasses).flat();
    element.classList.remove(...allClasses);

    // Yeni durumun class'larını ekle
    const newClasses = statusClasses[status];
    if (newClasses) {
        element.classList.add(...newClasses);
    }
}

/**
 * Debounced toast gösterimi - çok sık bildirim önleme
 * @param {string} message 
 * @param {'info'|'success'|'error'} type 
 */
function showDebouncedToast(message, type) {
    const now = Date.now();
    if (now - state.lastToastTime > TOAST_DEBOUNCE_MS) {
        state.lastToastTime = now;
        showToast(message, type);
    }
}

// ==================== EVENT HANDLERS ====================
/**
 * Event handler factory - cleanup için referans tutuyoruz
 * @param {string} eventName 
 * @param {Function} handler 
 */
function registerHandler(eventName, handler) {
    // Önce eski handler'ı kaldır (varsa)
    if (state.eventHandlers.has(eventName)) {
        const existingHandler = state.eventHandlers.get(eventName);
        socket.off(eventName, existingHandler);
    }

    // Yeni handler'ı kaydet ve ekle
    state.eventHandlers.set(eventName, handler);
    socket.on(eventName, handler);
}

/**
 * Tüm event handler'ları temizle
 */
function cleanupEventHandlers() {
    state.eventHandlers.forEach((handler, eventName) => {
        socket.off(eventName, handler);
    });
    state.eventHandlers.clear();
}

// ==================== HEARTBEAT ====================
/**
 * Heartbeat başlat - bağlantıyı canlı tutmak için periyodik ping
 * Socket.IO'nun kendi mekanizmasına ek olarak çalışır
 */
function startHeartbeat() {
    // Zaten çalışıyorsa yeni interval oluşturma
    if (state.heartbeatIntervalId !== null) {
        return;
    }

    state.heartbeatIntervalId = setInterval(() => {
        if (socket.connected) {
            socket.emit('heartbeat', { timestamp: Date.now() });
        }
    }, HEARTBEAT_INTERVAL_MS);

    console.log('💓 Heartbeat başlatıldı');
}

/**
 * Heartbeat durdur
 */
function stopHeartbeat() {
    if (state.heartbeatIntervalId !== null) {
        clearInterval(state.heartbeatIntervalId);
        state.heartbeatIntervalId = null;
        console.log('💔 Heartbeat durduruldu');
    }
}

// ==================== VISIBILITY HANDLER ====================
/**
 * PWA arka plan/ön plan yönetimi
 * Uygulama arka plana alındığında bağlantı kopabilir
 * Ön plana geldiğinde hızlıca yeniden bağlan
 */
function initVisibilityHandler() {
    // Visibility change handler
    const visibilityHandler = () => {
        if (document.visibilityState === 'visible') {
            console.log('📱 Uygulama ön plana geldi');

            // Bağlantı durumunu kontrol et
            if (!socket.connected) {
                console.log('🔄 Bağlantı kopmuş, yeniden bağlanılıyor...');
                updateStatusIndicator('connecting');
                socket.connect();
            }
        } else {
            console.log('📱 Uygulama arka plana alındı');
        }
    };

    // Page show handler (iOS için ek destek)
    const pageShowHandler = (event) => {
        if (event.persisted) {
            console.log('📱 Sayfa cache\'den geri yüklendi');
            if (!socket.connected) {
                updateStatusIndicator('connecting');
                socket.connect();
            }
        }
    };

    // Online handler
    const onlineHandler = () => {
        console.log('🌐 İnternet bağlantısı geri geldi');
        if (!socket.connected) {
            updateStatusIndicator('connecting');
            socket.connect();
        }
    };

    // Offline handler
    const offlineHandler = () => {
        console.log('🌐 İnternet bağlantısı kesildi');
        updateStatusIndicator('disconnected');
    };

    // Event listener'ları ekle
    document.addEventListener('visibilitychange', visibilityHandler);
    window.addEventListener('pageshow', pageShowHandler);
    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    // Cleanup fonksiyonu döndür
    return () => {
        document.removeEventListener('visibilitychange', visibilityHandler);
        window.removeEventListener('pageshow', pageShowHandler);
        window.removeEventListener('online', onlineHandler);
        window.removeEventListener('offline', offlineHandler);
    };
}

// Visibility cleanup referansı
let cleanupVisibility = null;

// ==================== PUBLIC API ====================
/**
 * Socket bağlantı event'lerini başlatır
 * @param {Object} elements - DOM elementleri { statusDot, shiftBtn }
 * @param {Function} onConnected - Bağlantı kurulduğunda çalışacak callback
 * @throws {Error} Elements parametresi geçersizse
 */
export function initSocketEvents(elements, onConnected) {
    // Parametre validasyonu
    if (!elements || typeof elements !== 'object') {
        console.error('❌ initSocketEvents: elements parametresi geçersiz');
        return;
    }

    const { statusDot, shiftBtn } = elements;

    // Tekrar başlatma koruması - eski listener'ları temizle
    if (state.isInitialized) {
        console.log('🔄 Socket events yeniden başlatılıyor, eski handler\'lar temizleniyor...');
        cleanupEventHandlers();
        stopHeartbeat();
        if (cleanupVisibility) {
            cleanupVisibility();
        }
    }

    // State güncelle
    state.statusDotElement = statusDot;
    state.isInitialized = true;

    // Mevcut durumu kontrol et
    if (socket.connected) {
        updateStatusIndicator('connected');
        state.isInitialConnection = false;
        startHeartbeat();
        if (typeof onConnected === 'function') {
            onConnected();
        }
    } else {
        updateStatusIndicator('connecting');
    }

    // Connect handler
    registerHandler('connect', () => {
        console.log('✅ Bağlantı kuruldu');
        const wasReconnecting = state.isReconnecting;
        const wasInitial = state.isInitialConnection;
        state.isReconnecting = false;
        state.isInitialConnection = false;

        // Status indicator güncelle
        updateStatusIndicator('connected');

        // Heartbeat başlat
        startHeartbeat();

        // Shift durumunu sıfırla
        if (shiftBtn) {
            shiftBtn.classList.remove('active');
        }

        // Callback çağır
        if (typeof onConnected === 'function') {
            onConnected();
        }

        // Yeniden bağlandıysa bildirim göster (ilk bağlantı değilse)
        if (wasReconnecting && !wasInitial) {
            showDebouncedToast('Bağlantı yeniden kuruldu!', 'success');
        }
    });

    // Disconnect handler
    registerHandler('disconnect', (reason) => {
        console.log('❌ Bağlantı koptu:', reason);
        updateStatusIndicator('disconnected');
        stopHeartbeat();

        // Sunucu tarafından kapatıldıysa yeniden bağlan
        if (reason === 'io server disconnect') {
            setTimeout(() => {
                socket.connect();
            }, 100);
        }
    });

    // Reconnecting handler
    registerHandler('reconnecting', () => {
        console.log('🔄 Yeniden bağlanılıyor...');
        state.isReconnecting = true;
        updateStatusIndicator('connecting');
    });

    // Reconnect attempt handler
    registerHandler('reconnect_attempt', (attemptNumber) => {
        console.log(`🔄 Yeniden bağlanma denemesi: ${attemptNumber}`);
        state.isReconnecting = true;
        updateStatusIndicator('connecting');
    });

    // Reconnect success handler
    registerHandler('reconnect', (attemptNumber) => {
        console.log(`✅ Yeniden bağlandı (deneme: ${attemptNumber})`);
    });

    // Reconnect failed handler
    registerHandler('reconnect_failed', () => {
        console.log('❌ Tüm yeniden bağlanma denemeleri başarısız');
        updateStatusIndicator('disconnected');
        showDebouncedToast('Sunucuya bağlanılamıyor!', 'error');
    });

    // Connect error handler
    registerHandler('connect_error', (error) => {
        console.log('⚠️ Bağlantı hatası:', error?.message || 'Bilinmeyen hata');
        updateStatusIndicator('connecting');
    });

    // PWA visibility handler
    cleanupVisibility = initVisibilityHandler();
}

/**
 * Socket bağlantısını ve tüm kaynakları temizle
 * Sayfa kapatılırken veya modül unload edilirken çağrılmalı
 */
export function cleanup() {
    console.log('🧹 Socket manager temizleniyor...');
    cleanupEventHandlers();
    stopHeartbeat();
    if (cleanupVisibility) {
        cleanupVisibility();
        cleanupVisibility = null;
    }
    state.isInitialized = false;
}

/**
 * Socket bağlantı durumunu döndürür
 * @returns {boolean} Bağlı mı
 */
export function isConnected() {
    return socket.connected;
}

/**
 * Mevcut bağlantı state'ini döndürür (debug için)
 * @returns {Object} State snapshot
 */
export function getState() {
    return {
        connected: socket.connected,
        isReconnecting: state.isReconnecting,
        isInitialConnection: state.isInitialConnection,
        isInitialized: state.isInitialized,
        heartbeatActive: state.heartbeatIntervalId !== null
    };
}

// ==================== PAGE UNLOAD CLEANUP ====================
// Sayfa kapatılırken temizlik yap
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        cleanup();
    });
}

