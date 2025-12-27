"""
QuickType Pro - Güvenlik Fonksiyonları
Rate limiting, sanitization ve validation işlemleri

Güvenlik Özellikleri:
- Rate limiting (IP bazlı)
- Input validation ve sanitization
- Bağlantı loglama (bounded, thread-safe)
"""
import time
import logging
import threading
from datetime import datetime
from collections import defaultdict, deque
from typing import Dict, Any

from .config import (
    RATE_LIMIT_WINDOW,
    MAX_REQUESTS_PER_WINDOW,
    ALLOWED_SPECIAL_KEYS,
    ALLOWED_MOUSE_BUTTONS,
    ALLOWED_SHORTCUT_ACTIONS
)

# Logging yapılandırması
logger = logging.getLogger(__name__)

# ==================== GÜVENLİK YAPILARI ====================
# Rate limiting için - thread-safe
_rate_limit_lock = threading.Lock()
request_counts: Dict[str, Dict[str, Any]] = defaultdict(
    lambda: {'count': 0, 'window_start': time.time()}
)

# Memory leak önleme: Maksimum takip edilecek IP sayısı
MAX_TRACKED_IPS = 1000
# Eski kayıtları temizleme aralığı (saniye) - 5 dakika
CLEANUP_INTERVAL = 300
_last_cleanup_time = time.time()

# Bağlantı logları - bounded deque ile memory leak önleme
MAX_CONNECTION_LOGS = 100
_log_lock = threading.Lock()
connection_logs: deque = deque(maxlen=MAX_CONNECTION_LOGS)


def _cleanup_stale_entries(current_time: float) -> None:
    """Eski rate limit kayıtlarını temizle (lock içinde çağrılmalı)"""
    global _last_cleanup_time
    
    # Temizleme aralığı kontrolü
    if current_time - _last_cleanup_time < CLEANUP_INTERVAL:
        return
    
    _last_cleanup_time = current_time
    
    # 2x RATE_LIMIT_WINDOW'dan eski kayıtları bul
    stale_threshold = current_time - (RATE_LIMIT_WINDOW * 2)
    stale_ips = [
        ip for ip, data in request_counts.items()
        if data['window_start'] < stale_threshold
    ]
    
    # Eski kayıtları sil
    for ip in stale_ips:
        del request_counts[ip]
    
    if stale_ips:
        logger.debug(f"Rate limit temizliği: {len(stale_ips)} eski IP kaldırıldı")


# ==================== IP İŞLEMLERİ ====================
def get_client_ip(request_or_environ) -> str:
    """İstemci IP adresini al"""
    if isinstance(request_or_environ, dict):
        forwarded = request_or_environ.get('HTTP_X_FORWARDED_FOR', '')
        if forwarded:
            return forwarded.split(',')[0].strip()
        return request_or_environ.get('REMOTE_ADDR', 'unknown')
    else:
        forwarded = request_or_environ.headers.get('X-Forwarded-For', '')
        if forwarded:
            return forwarded.split(',')[0].strip()
        return request_or_environ.client.host if request_or_environ.client else 'unknown'


# ==================== RATE LIMITING ====================
def check_rate_limit(client_ip: str) -> bool:
    """Rate limiting kontrolü - thread-safe, memory-safe"""
    current_time = time.time()
    
    with _rate_limit_lock:
        # Periyodik temizlik
        _cleanup_stale_entries(current_time)
        
        # Maksimum IP kontrolü (saldırı önleme)
        if len(request_counts) >= MAX_TRACKED_IPS and client_ip not in request_counts:
            logger.warning(f"Maksimum IP limiti aşıldı, yeni IP reddediliyor: {client_ip[:16]}...")
            return False
        
        client_data = request_counts[client_ip]
        
        if current_time - client_data['window_start'] > RATE_LIMIT_WINDOW:
            client_data['count'] = 0
            client_data['window_start'] = current_time
        
        client_data['count'] += 1
        return client_data['count'] <= MAX_REQUESTS_PER_WINDOW


# ==================== LOGLAMA ====================
def log_connection(ip: str, event_type: str, details: str = "") -> None:
    """Bağlantı logla - thread-safe, bounded"""
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'ip': ip,
        'event': event_type,
        'details': details
    }
    
    with _log_lock:
        connection_logs.append(log_entry)
        # NOT: deque(maxlen=N) otomatik olarak eski öğeleri siler
    
    # Yapılandırılmış loglama
    logger.info(f"[{event_type}] {ip} - {details}")


# ==================== SANITIZATION VE VALIDATION ====================
def sanitize_char(char: str) -> str:
    """Karakter sanitizasyonu"""
    if not char or not isinstance(char, str):
        return ""
    if len(char) != 1:
        return ""
    if ord(char) < 32 and char not in ('\t', '\n', '\r'):
        return ""
    return char


def validate_special_key(key: str) -> bool:
    """Özel tuş doğrulama"""
    return key in ALLOWED_SPECIAL_KEYS


def validate_mouse_button(button: str) -> bool:
    """Mouse button doğrulama"""
    return button in ALLOWED_MOUSE_BUTTONS


def validate_numeric(value, min_val: float = -1000, max_val: float = 1000) -> float:
    """Sayısal değer doğrulama ve sınırlama"""
    try:
        val = float(value)
        return max(min_val, min(max_val, val))
    except (TypeError, ValueError):
        return 0.0


def validate_shortcut_action(action: str) -> bool:
    """Kısayol action doğrulama"""
    return action in ALLOWED_SHORTCUT_ACTIONS

