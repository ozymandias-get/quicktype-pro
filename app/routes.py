"""
QuickType Pro - HTTP Route'ları
FastAPI endpoint'leri
"""
from fastapi import APIRouter
from fastapi.responses import FileResponse, JSONResponse

from .config import APP_VERSION
from .clipboard_manager import clipboard_manager
from .utils import get_base_dir


# Base dizin - merkezi utils'den
BASE_DIR = get_base_dir()


# ==================== ROUTER ====================
router = APIRouter()


# ==================== HTTP ENDPOINT'LERİ ====================
@router.get("/")
async def read_index():
    """Ana sayfa"""
    return FileResponse(BASE_DIR / 'static' / 'index.html')


@router.get("/api/status")
async def get_status():
    """Sunucu durumu"""
    return JSONResponse(content={
        "status": "online",
        "version": APP_VERSION
    })


# ==================== PANO ENDPOINT'LERİ ====================
@router.get("/api/clipboard")
async def get_clipboard_items():
    """Tüm pano öğelerini getir"""
    return JSONResponse(content={
        "items": clipboard_manager.get_all_items(),
        "enabled": clipboard_manager.is_enabled
    })


@router.get("/api/clipboard/download/{item_id}")
async def download_clipboard_file(item_id: str):
    """Pano dosyasını indir"""
    file_path = clipboard_manager.get_file_path(item_id)
    if file_path:
        item = clipboard_manager.get_item(item_id)
        filename = item.filename if item else item_id
        return FileResponse(
            file_path, 
            filename=filename,
            media_type='application/octet-stream'
        )
    return JSONResponse(
        status_code=404,
        content={"error": "Dosya bulunamadı"}
    )


@router.get("/api/clipboard/content/{item_id}")
async def get_clipboard_content(item_id: str):
    """Pano öğesinin tam içeriğini getir"""
    content = clipboard_manager.get_full_content(item_id)
    if content:
        return JSONResponse(content={"content": content})
    return JSONResponse(
        status_code=404,
        content={"error": "İçerik bulunamadı"}
    )
