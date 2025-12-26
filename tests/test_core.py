"""
QuickType Pro - Test Suite
Temel fonksiyonellik testleri

Çalıştırma: python -m pytest tests/ -v
"""
import pytest
import os
import sys
import time
from collections import deque

# Test dizinini path'e ekle
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class TestConfig:
    """config.py testleri"""
    
    def test_config_imports(self):
        """Config modülü import edilebiliyor"""
        from app.config import APP_VERSION, APP_TITLE, SERVER_PORT
        assert APP_VERSION is not None
        assert APP_TITLE == "QuickType Pro"
        assert SERVER_PORT == 8000
    
    def test_socket_io_config(self):
        """Socket.IO yapılandırması mevcut"""
        from app.config import SOCKET_IO_CONFIG
        assert 'async_mode' in SOCKET_IO_CONFIG
        assert 'ping_timeout' in SOCKET_IO_CONFIG
        assert SOCKET_IO_CONFIG['ping_timeout'] > 0
    
    def test_allowed_special_keys(self):
        """Özel tuş whitelist'i doğru"""
        from app.config import ALLOWED_SPECIAL_KEYS
        assert 'enter' in ALLOWED_SPECIAL_KEYS
        assert 'backspace' in ALLOWED_SPECIAL_KEYS
        assert 'esc' in ALLOWED_SPECIAL_KEYS
        # Güvenlik: Tehlikeli tuşlar olmamalı
        assert 'eval' not in ALLOWED_SPECIAL_KEYS
        assert 'exec' not in ALLOWED_SPECIAL_KEYS


class TestSecurity:
    """security.py testleri"""
    
    def test_sanitize_char_valid(self):
        """Geçerli karakterler sanitize edilmiyor"""
        from app.security import sanitize_char
        assert sanitize_char('a') == 'a'
        assert sanitize_char('Z') == 'Z'
        assert sanitize_char('5') == '5'
        assert sanitize_char('@') == '@'
    
    def test_sanitize_char_invalid(self):
        """Geçersiz karakterler temizleniyor"""
        from app.security import sanitize_char
        assert sanitize_char('') == ''
        assert sanitize_char(None) == ''
        assert sanitize_char('ab') == ''  # Birden fazla karakter
        assert sanitize_char(chr(0)) == ''  # Null byte
        assert sanitize_char(chr(7)) == ''  # Bell
    
    def test_sanitize_char_whitespace(self):
        """Whitespace karakterler korunuyor"""
        from app.security import sanitize_char
        assert sanitize_char('\t') == '\t'
        assert sanitize_char('\n') == '\n'
    
    def test_validate_special_key(self):
        """Özel tuş doğrulama çalışıyor"""
        from app.security import validate_special_key
        assert validate_special_key('enter') is True
        assert validate_special_key('backspace') is True
        assert validate_special_key('invalid_key') is False
        assert validate_special_key('') is False
    
    def test_validate_mouse_button(self):
        """Mouse button doğrulama çalışıyor"""
        from app.security import validate_mouse_button
        assert validate_mouse_button('left') is True
        assert validate_mouse_button('right') is True
        assert validate_mouse_button('middle') is False
        assert validate_mouse_button('') is False
    
    def test_validate_numeric(self):
        """Sayısal değer doğrulama çalışıyor"""
        from app.security import validate_numeric
        assert validate_numeric(50) == 50.0
        assert validate_numeric(-50) == -50.0
        assert validate_numeric(2000) == 1000.0  # Max sınırı
        assert validate_numeric(-2000) == -1000.0  # Min sınırı
        assert validate_numeric('invalid') == 0.0
    
    def test_rate_limit(self):
        """Rate limiting doğru çalışıyor"""
        from app.security import check_rate_limit
        test_ip = 'test_192.168.1.1'
        
        # İlk istek geçmeli
        assert check_rate_limit(test_ip) is True
        
        # Birkaç istek daha
        for _ in range(10):
            check_rate_limit(test_ip)
        
        # Hala geçmeli (limit yüksek)
        assert check_rate_limit(test_ip) is True
    
    def test_connection_logs_bounded(self):
        """Bağlantı logları sınırlı (memory leak yok)"""
        from app.security import connection_logs, MAX_CONNECTION_LOGS
        assert isinstance(connection_logs, deque)
        assert connection_logs.maxlen == MAX_CONNECTION_LOGS


class TestClipboardManager:
    """clipboard_manager.py testleri"""
    
    def test_sanitize_filename_normal(self):
        """Normal dosya adları korunuyor"""
        from app.clipboard_manager import sanitize_filename
        assert sanitize_filename('test.txt') == 'test.txt'
        assert sanitize_filename('my_file.pdf') == 'my_file.pdf'
    
    def test_sanitize_filename_path_traversal(self):
        """Path traversal engelleniyor"""
        from app.clipboard_manager import sanitize_filename
        # Path traversal denemeleri
        assert sanitize_filename('../../../etc/passwd') == 'passwd'
        assert sanitize_filename('..\\..\\Windows\\System32') == 'System32'
        assert sanitize_filename('/etc/passwd') == 'passwd'
        assert sanitize_filename('C:\\Windows\\System32\\config') == 'config'
    
    def test_sanitize_filename_special_chars(self):
        """Özel karakterler temizleniyor"""
        from app.clipboard_manager import sanitize_filename
        result = sanitize_filename('file<>:"|?*.txt')
        assert '<' not in result
        assert '>' not in result
        assert ':' not in result
        assert '|' not in result
        assert '?' not in result
        assert '*' not in result
    
    def test_sanitize_filename_empty(self):
        """Boş dosya adı işleniyor"""
        from app.clipboard_manager import sanitize_filename
        result = sanitize_filename('')
        assert result.startswith('file_')
        assert len(result) > 5
    
    def test_sanitize_filename_long(self):
        """Uzun dosya adı kısaltılıyor"""
        from app.clipboard_manager import sanitize_filename
        long_name = 'a' * 300 + '.txt'
        result = sanitize_filename(long_name)
        assert len(result) <= 200
    
    def test_clipboard_manager_init(self):
        """ClipboardManager düzgün başlatılıyor"""
        from app.clipboard_manager import ClipboardManager
        manager = ClipboardManager(max_items=10)
        assert manager.max_items == 10
        assert manager.is_enabled is True
        assert len(manager.items) == 0
    
    def test_upload_dir_is_absolute(self):
        """Upload dizini mutlak yol"""
        from app.clipboard_manager import clipboard_manager
        assert os.path.isabs(clipboard_manager.upload_dir)


class TestShortcutValidation:
    """Kısayol doğrulama testleri"""
    
    def test_allowed_shortcuts(self):
        """İzin verilen kısayollar"""
        from app.security import validate_shortcut_action
        allowed = ['select-all', 'copy', 'paste', 'cut', 'undo', 'redo']
        for action in allowed:
            assert validate_shortcut_action(action) is True
    
    def test_blocked_shortcuts(self):
        """Engellenen kısayollar"""
        from app.security import validate_shortcut_action
        blocked = ['delete', 'format', 'shutdown', 'reboot', 'eval', '']
        for action in blocked:
            assert validate_shortcut_action(action) is False


# Edge case testleri
class TestEdgeCases:
    """Edge case testleri"""
    
    def test_empty_inputs(self):
        """Boş girdiler düzgün işleniyor"""
        from app.security import sanitize_char, validate_special_key
        from app.clipboard_manager import sanitize_filename
        
        assert sanitize_char('') == ''
        assert validate_special_key('') is False
        result = sanitize_filename('')
        assert result is not None and len(result) > 0
    
    def test_none_inputs(self):
        """None girdiler hata vermiyor"""
        from app.security import sanitize_char
        assert sanitize_char(None) == ''
    
    def test_unicode_inputs(self):
        """Unicode karakterler destekleniyor"""
        from app.security import sanitize_char
        assert sanitize_char('ş') == 'ş'
        assert sanitize_char('ğ') == 'ğ'
        assert sanitize_char('🔑') == '🔑'


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
