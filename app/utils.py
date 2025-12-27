"""
QuickType Pro - Yardımcı Fonksiyonlar
Genel yardımcı fonksiyonlar
"""
import os
import sys
import socket
from pathlib import Path


def get_base_dir() -> Path:
    """
    PyInstaller ile paketlenmiş EXE veya normal Python için base dizini döndür.
    Bu fonksiyon projenin kök dizinini verir.
    """
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        # PyInstaller ile paketlenmiş EXE modunda
        return Path(sys._MEIPASS)
    else:
        # Normal Python modunda - app/ klasörünün bir üst dizini
        return Path(__file__).resolve().parent.parent


def get_local_ip() -> str:
    """Yerel IP adresini al"""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP


def print_startup_banner(ip: str, port: int):
    """Başlangıç banner'ını yazdır"""
    print("\n" + "=" * 55)
    print("  🔒 QuickType Pro - HTTPS Only v2.1")
    print("=" * 55)
    print(f"\n  📍 Sunucu Adresi:")
    print(f"     🔐 https://{ip}:{port}")
    print("\n  🛡️  Güvenlik Özellikleri:")
    print("     ✓ HTTPS ZORUNLU (HTTP devre dışı)")
    print("     ✓ SSL/TLS Şifreleme (tüm trafik)")
    print("     ✓ HSTS (HTTP Strict Transport Security)")
    print("     ✓ WebAuthn/Face ID hazır altyapı")
    print("     ✓ Rate limiting (DDoS koruması)")
    print("     ✓ Input sanitization (Girdi doğrulama)")
    print("     ✓ Bağlantı loglama")
    print("     ✓ Güvenlik başlıkları (CSP, XSS, COOP, COEP)")
    print("=" * 55 + "\n")

