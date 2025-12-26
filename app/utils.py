"""
QuickType Pro - Yardımcı Fonksiyonlar
Genel yardımcı fonksiyonlar
"""
import socket


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
    print("\n" + "=" * 50)
    print("  🔒 QuickType Pro - Güvenli Sürüm 2.0")
    print("=" * 50)
    print(f"\n  📍 Sunucu Adresi: http://{ip}:{port}")
    print("\n  Güvenlik Özellikleri:")
    print("  ✓ Rate limiting (DDoS koruması)")
    print("  ✓ Input sanitization (Girdi doğrulama)")
    print("  ✓ Bağlantı loglama")
    print("  ✓ Güvenlik başlıkları (CSP, XSS, vb.)")
    print("=" * 50 + "\n")
