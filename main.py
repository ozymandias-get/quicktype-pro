"""
QuickType Pro - Ana Giriş Noktası
Modüler yapı ile organize edilmiş uzak klavye/mouse uygulaması
"""
import uvicorn
import socketio
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

# Uygulama modülleri
from app.config import APP_TITLE, SERVER_HOST, SERVER_PORT
from app.middleware import SecurityMiddleware
from app.routes import router
from app.socket_events import sio
from app.utils import get_local_ip, print_startup_banner, get_base_dir

# Proje kök dizini - utils'den merkezi fonksiyon kullanılıyor
BASE_DIR = get_base_dir()


def create_app() -> FastAPI:
    """FastAPI uygulamasını oluştur ve yapılandır"""
    app = FastAPI(
        title=APP_TITLE,
        docs_url=None,
        redoc_url=None,
        openapi_url=None
    )
    
    # Middleware ekle
    app.add_middleware(SecurityMiddleware)
    
    # Route'ları ekle
    app.include_router(router)
    
    # Statik dosyaları ekle (mutlak yol kullan)
    static_dir = BASE_DIR / "static"
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
    
    # Startup event - pano izleme sistemini başlat
    @app.on_event("startup")
    async def startup_event():
        from app.socket_events import start_clipboard_monitoring
        await start_clipboard_monitoring()
    
    # Shutdown event - temizlik
    @app.on_event("shutdown")
    async def shutdown_event():
        from app.socket_events import stop_clipboard_monitoring
        await stop_clipboard_monitoring()
    
    return app


def create_socket_app():
    """Socket.IO ile sarmalanmış ASGI uygulamasını oluştur"""
    app = create_app()
    return socketio.ASGIApp(sio, other_asgi_app=app)


# ==================== SSL SERTİFİKA YAPLANDIRMASI ====================
def get_ssl_config():
    """
    SSL sertifika yollarını döndür.
    mkcert ile oluşturulan sertifikalar certs/ klasöründe olmalı.
    HTTPS ZORUNLU - Sertifika bulunamazsa uygulama başlamaz.
    """
    cert_dir = BASE_DIR / "certs"
    
    # Olası sertifika dosya adları
    cert_names = [
        ("localhost+2.pem", "localhost+2-key.pem"),  # mkcert varsayılan
        ("cert.pem", "key.pem"),  # Alternatif isimler
        ("server.crt", "server.key"),  # Klasik isimler
    ]
    
    for cert_file, key_file in cert_names:
        cert_path = cert_dir / cert_file
        key_path = cert_dir / key_file
        
        if cert_path.exists() and key_path.exists():
            print(f"🔐 SSL Sertifikaları bulundu:")
            print(f"   📜 Sertifika: {cert_path}")
            print(f"   🔑 Anahtar: {key_path}")
            return str(cert_path), str(key_path)
    
    return None, None


# ==================== ANA BAŞLATMA ====================
if __name__ == "__main__":
    import argparse
    import sys
    
    parser = argparse.ArgumentParser()
    parser.add_argument("--certs-dir", help="Directory for SSL certificates")
    args, unknown = parser.parse_known_args()
    
    local_ip = get_local_ip()
    print_startup_banner(local_ip, SERVER_PORT)
    
    # SSL yapılandırmasını al
    ssl_certfile = None
    ssl_keyfile = None
    
    # 1. Komut satırından gelen dizine bak
    if args.certs_dir:
        from pathlib import Path
        custom_cert_dir = Path(args.certs_dir)
        print(f"📂 Sertifika dizini (CLI): {custom_cert_dir}")
        
        cert_names = [
            ("localhost+2.pem", "localhost+2-key.pem"),
            ("cert.pem", "key.pem"),
            ("server.crt", "server.key"),
        ]
        
        for cert_file, key_file in cert_names:
            c_path = custom_cert_dir / cert_file
            k_path = custom_cert_dir / key_file
            if c_path.exists() and k_path.exists():
                ssl_certfile = str(c_path)
                ssl_keyfile = str(k_path)
                print(f"🔐 Sertifika bulundu: {cert_file}")
                break
    
    # 2. Bulunamadıysa varsayılan get_ssl_config'i dene
    if not ssl_certfile:
        ssl_certfile, ssl_keyfile = get_ssl_config()
    
    # ==================== HTTPS ZORUNLU MU? ====================
    # Sertifika yoksa SETUP MODE (HTTP) başlat
    use_ssl = True
    if not ssl_certfile or not ssl_keyfile:
        print("\n" + "=" * 60)
        print("⚠️ SSL SERTİFİKALARI BULUNAMADI - KURULUM MODU")
        print("=" * 60)
        print("   Uygulama HTTP (Güvensiz) modunda başlatılıyor.")
        print("   Lütfen Ayarlar -> HTTPS menüsünden sertifikaları oluşturun.")
        print("=" * 60 + "\n")
        use_ssl = False
    
    socket_app = create_socket_app()
    
    # Uvicorn yapılandırması
    uvicorn_config = {
        "host": SERVER_HOST,
        "port": SERVER_PORT,
        "log_level": "info",
    }
    
    if use_ssl:
        uvicorn_config["ssl_certfile"] = ssl_certfile
        uvicorn_config["ssl_keyfile"] = ssl_keyfile
        print(f"\n🔒 HTTPS modunda başlatılıyor: https://{local_ip}:{SERVER_PORT}")
    else:
        print(f"\n⚠️ HTTP (Setup) modunda başlatılıyor: http://{local_ip}:{SERVER_PORT}")
    
    uvicorn.run(socket_app, **uvicorn_config)

