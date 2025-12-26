"""
QuickType Pro - Yapılandırma ve Sabitler

Bu dosyadaki ayarlar uygulamanın güvenlik ve performans
davranışlarını kontrol eder.
"""
import os
import logging
from typing import List, Union

# ==================== LOGGING AYARLARI ====================
LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

# Logging'i yapılandır
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL.upper(), logging.INFO),
    format=LOG_FORMAT
)
logger = logging.getLogger(__name__)

# ==================== GÜVENLIK AYARLARI ====================
# Rate limiting ayarları
RATE_LIMIT_WINDOW = 60  # saniye
MAX_REQUESTS_PER_WINDOW = 300  # Pencere başına maksimum istek

# Güvenlik için izin verilen özel tuşlar (whitelist)
ALLOWED_SPECIAL_KEYS = {
    # Basic keys
    'backspace', 'enter', 'space', 'tab', 'esc',
    # Arrow keys
    'up', 'down', 'left', 'right',
    # Modifier keys
    'caps', 'delete', 'insert',
    # Navigation keys
    'home', 'end', 'pageup', 'pagedown', 'printscreen', 'scrolllock',
    # Function keys
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'
}

# Güvenlik için izin verilen kısayol eylemleri
ALLOWED_SHORTCUT_ACTIONS = {
    'select-all', 'copy', 'paste', 'cut', 'undo', 'redo'
}

# Güvenlik için izin verilen mouse buttonları
ALLOWED_MOUSE_BUTTONS = {'left', 'right'}

# ==================== UYGULAMA AYARLARI ====================
APP_TITLE = "QuickType Pro"
APP_VERSION = "2.2-async-optimized"
SERVER_HOST = os.environ.get('HOST', "0.0.0.0")
try:
    SERVER_PORT = int(os.environ.get('PORT', 8000))
except ValueError:
    logger.warning("Geçersiz PORT ortam değişkeni, varsayılan 8000 kullanılıyor.")
    SERVER_PORT = 8000

# ==================== CORS VE SOCKET.IO AYARLARI ====================
def parse_cors_origins(env_val: str) -> Union[str, List[str]]:
    """CORS originlerini parse et"""
    if env_val == '*':
        return '*'
    return [origin.strip() for origin in env_val.split(',') if origin.strip()]

CORS_ALLOWED_ORIGINS = parse_cors_origins(os.environ.get('CORS_ORIGINS', '*'))

# Socket.IO yapılandırması
SOCKET_IO_CONFIG = {
    'async_mode': 'asgi',
    'cors_allowed_origins': CORS_ALLOWED_ORIGINS,
    'ping_timeout': 30,
    'ping_interval': 10,
    'max_http_buffer_size': 100 * 1024 * 1024,  # 100MB
    'async_handlers': True,
    'always_connect': True,
    'logger': False,
    'engineio_logger': False,
    'transports': ['polling', 'websocket'],
    'http_compression': True
}

# ==================== CSP BAŞLIKLARI ====================
CSP_POLICY = (
    "default-src 'self' https://cdn.tailwindcss.com https://fonts.googleapis.com "
    "https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn-icons-png.flaticon.com; "
    "style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com; "
    "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com;"
)

