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
from app.utils import get_local_ip, print_startup_banner


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
    
    # Statik dosyaları ekle
    app.mount("/static", StaticFiles(directory="static"), name="static")
    
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


# ==================== ANA BAŞLATMA ====================
if __name__ == "__main__":
    local_ip = get_local_ip()
    print_startup_banner(local_ip, SERVER_PORT)
    
    socket_app = create_socket_app()
    uvicorn.run(socket_app, host=SERVER_HOST, port=SERVER_PORT, log_level="warning")
