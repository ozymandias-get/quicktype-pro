"""
QuickType Pro - Pano (Clipboard) Yöneticisi
İki yönlü pano senkronizasyonu ve dosya paylaşımı - Async & Robust Version

Değişiklikler:
- Dosya I/O işlemleri asenkron hale getirildi (blocking önlendi)
- Windows Pano erişimi için retry mekanizması eklendi
- Thread-safe yapı korundu
"""
import os
import sys
import re
import time
import logging
import threading
import base64
import uuid
import asyncio
from datetime import datetime
from typing import Optional, List, Dict, Any, Callable
from dataclasses import dataclass, field

# Logging yapılandırması
logger = logging.getLogger(__name__)

# Pano kütüphaneleri
try:
    import win32clipboard
    import win32con
    HAS_CLIPBOARD = True
except ImportError:
    HAS_CLIPBOARD = False
    logger.warning("⚠️ Pano desteği için: pip install pywin32")


# ==================== VERİ YAPILARI ====================
@dataclass
class ClipboardItem:
    """Tek bir pano öğesi"""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    content_type: str = "text"  # text, image, file
    content: str = ""  # Metin veya base64 encoded
    filename: Optional[str] = None  # Dosya adı (varsa)
    source: str = "phone"  # phone, pc
    timestamp: float = field(default_factory=time.time)
    size: int = 0  # Byte cinsinden boyut

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "content_type": self.content_type,
            "content": self.content[:500] if self.content_type == "text" else "[data]",
            "preview": self.content[:100] if self.content_type == "text" else None,
            "filename": self.filename,
            "source": self.source,
            "timestamp": self.timestamp,
            "size": self.size,
            "formatted_time": datetime.fromtimestamp(self.timestamp).strftime("%H:%M:%S")
        }


# Güvenlik: Tehlikeli karakterleri temizle
def sanitize_filename(filename: str) -> str:
    """Dosya adını güvenli hale getir - path traversal koruması"""
    if not filename:
        return f"file_{uuid.uuid4().hex[:8]}"
    
    # Path bileşenlerini kaldır
    filename = os.path.basename(filename)
    
    # Tehlikeli karakterleri kaldır
    filename = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '_', filename)
    
    # Boşlukları alt çizgiye çevir
    filename = filename.strip().replace(' ', '_')
    
    # Çok uzunsa kısalt (Windows MAX_PATH için)
    name, ext = os.path.splitext(filename)
    if len(filename) > 200:
        filename = name[:190] + ext
    
    if not filename or filename == ext:
        filename = f"file_{uuid.uuid4().hex[:8]}{ext}"
    
    return filename


class ClipboardManager:
    """Pano yönetimi sınıfı - Async destekli, Retry mekanizmalı"""
    
    def __init__(self, max_items: int = 50):
        self.items: List[ClipboardItem] = []
        self.max_items = max_items
        self.is_enabled = True
        self.last_pc_content = ""
        self._lock = threading.RLock()
        self._monitor_thread: Optional[threading.Thread] = None
        self._running = False
        self._callback: Optional[Callable] = None
        
        # Dosya depolama
        # PyInstaller EXE modunda _MEIPASS salt okunurdur, 
        # bu yüzden uploads için executable'ın yanındaki dizini kullanmalıyız
        if getattr(sys, 'frozen', False):
            # EXE modunda: EXE'nin bulunduğu dizin
            exe_dir = os.path.dirname(sys.executable)
            self.upload_dir = os.path.abspath(os.path.join(exe_dir, "uploads"))
        else:
            # Normal Python modunda
            self.upload_dir = os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "uploads")
            )
        os.makedirs(self.upload_dir, exist_ok=True)
        logger.info(f"Upload dizini: {self.upload_dir}")
    
    def set_callback(self, callback):
        self._callback = callback
    
    def start_monitoring(self):
        """PC panosunu izlemeye başla"""
        if not HAS_CLIPBOARD:
            return
        
        if self._monitor_thread and self._monitor_thread.is_alive():
            return
        
        self._running = True
        self._monitor_thread = threading.Thread(target=self._monitor_pc_clipboard, daemon=True)
        self._monitor_thread.start()
    
    def stop_monitoring(self):
        self._running = False
        if self._monitor_thread:
            self._monitor_thread.join(timeout=2)
    
    def _monitor_pc_clipboard(self):
        """PC panosunu periyodik olarak kontrol et"""
        while self._running:
            try:
                if self.is_enabled:
                    content = self._get_pc_clipboard()
                    if content and content != self.last_pc_content:
                        self.last_pc_content = content
                        
                        item = ClipboardItem(
                            content_type="text",
                            content=content,
                            source="pc",
                            size=len(content.encode('utf-8'))
                        )
                        self._add_item(item)
                        
                        if self._callback:
                            self._callback(item.to_dict())
            except Exception:
                pass
            
            time.sleep(1)
    
    def _get_pc_clipboard(self) -> Optional[str]:
        """PC panosundan metin al - RETRY mekanizmalı"""
        if not HAS_CLIPBOARD:
            return None
        
        for _ in range(3):  # 3 deneme
            try:
                win32clipboard.OpenClipboard()
                try:
                    if win32clipboard.IsClipboardFormatAvailable(win32con.CF_UNICODETEXT):
                        data = win32clipboard.GetClipboardData(win32con.CF_UNICODETEXT)
                        return data
                finally:
                    win32clipboard.CloseClipboard()
                break  # Başarılı ise döngüden çık
            except win32clipboard.error:
                time.sleep(0.1)  # Kısa bekle ve tekrar dene
            except Exception as e:
                logger.error(f"Pano okuma hatası: {e}")
                break
        return None
    
    def _set_pc_clipboard(self, text: str) -> bool:
        """PC panosuna metin kopyala - RETRY mekanizmalı"""
        if not HAS_CLIPBOARD:
            return False
        
        for _ in range(3):
            try:
                win32clipboard.OpenClipboard()
                try:
                    win32clipboard.EmptyClipboard()
                    win32clipboard.SetClipboardData(win32con.CF_UNICODETEXT, text)
                    self.last_pc_content = text
                    return True
                finally:
                    win32clipboard.CloseClipboard()
            except win32clipboard.error:
                time.sleep(0.1)
            except Exception:
                break
        return False
    
    def _add_item(self, item: ClipboardItem):
        """Öğe ekle (Thread-safe)"""
        with self._lock:
            self.items = [i for i in self.items if i.content != item.content]
            self.items.insert(0, item)
            
            if len(self.items) > self.max_items:
                removed = self.items[self.max_items:]
                self.items = self.items[:self.max_items]
                
                # Silinen dosyaları temizle
                for r in removed:
                    if r.content_type in ["file", "image"] and r.content:
                        self._delete_file(r.content)
    
    async def add_from_phone_async(self, content: str, content_type: str = "text", 
                                 filename: Optional[str] = None) -> Optional[ClipboardItem]:
        """Telefondan gelen içerik ekle - ASYNC Wrapper"""
        
        # Metin ise direkt işle (CPU bound değil)
        if content_type == "text":
            size = len(content.encode('utf-8'))
            item = ClipboardItem(
                content_type="text",
                content=content,
                source="phone",
                size=size
            )
            if self.is_enabled:
                await asyncio.to_thread(self._set_pc_clipboard, content)
            
            self._add_item(item)
            return item
            
        elif content_type in ["image", "file"]:
            # Dosya yazma işlemi blocking'dir, thread'e taşıyalım
            return await asyncio.to_thread(self._save_file_internal, content, content_type, filename)
            
        return None

    def _save_file_internal(self, content: str, content_type: str, filename: Optional[str]) -> Optional[ClipboardItem]:
        """Dosyayı diske kaydet (Senkron - Thread içinde çalışacak)"""
        try:
            file_data = base64.b64decode(content)
            item_id = str(uuid.uuid4())[:8]
            
            if filename:
                clean_filename = sanitize_filename(filename)
                safe_filename = f"{item_id}_{clean_filename}"
            else:
                ext = ".png" if content_type == "image" else ".bin"
                safe_filename = f"{item_id}{ext}"
            
            filepath = os.path.abspath(os.path.join(self.upload_dir, safe_filename))
            if not filepath.startswith(self.upload_dir):
                logger.warning(f"Path traversal blocked: {filename}")
                return None
            
            # Blocking I/O
            with open(filepath, 'wb') as f:
                f.write(file_data)
            
            item = ClipboardItem(
                id=item_id,
                content_type=content_type,
                content=safe_filename,
                filename=filename or safe_filename,
                source="phone",
                size=len(file_data)
            )
            self._add_item(item)
            return item
        except Exception as e:
            logger.error(f"Dosya kaydetme hatası: {e}")
            return None

    # Geriye uyumluluk için senkron metod (gerekirse)
    def add_from_phone(self, content: str, content_type: str = "text", filename: Optional[str] = None):
        """Senkron wrapper (Eski kodlar için)"""
        if content_type == "text":
            size = len(content.encode('utf-8'))
            item = ClipboardItem(
                content_type=content_type,
                content=content,
                filename=filename,
                source="phone",
                size=size
            )
            if self.is_enabled:
                self._set_pc_clipboard(content)
            self._add_item(item)
            return item
        else:
            # Async kullanılması önerilir
            return self._save_file_internal(content, content_type, filename)

    def get_all_items(self) -> List[dict]:
        with self._lock:
            return [item.to_dict() for item in self.items]
    
    def get_item(self, item_id: str) -> Optional[ClipboardItem]:
        with self._lock:
            for item in self.items:
                if item.id == item_id:
                    return item
        return None
    
    def get_file_path(self, item_id: str) -> Optional[str]:
        item = self.get_item(item_id)
        if item and item.content_type in ["image", "file"]:
            filepath = os.path.abspath(os.path.join(self.upload_dir, item.content))
            if not filepath.startswith(self.upload_dir):
                return None
            if os.path.exists(filepath):
                return filepath
        return None
    
    def get_full_content(self, item_id: str) -> Optional[str]:
        with self._lock:
            for item in self.items:
                if item.id == item_id:
                    return item.content
        return None
    
    def delete_item(self, item_id: str) -> bool:
        with self._lock:
            for i, item in enumerate(self.items):
                if item.id == item_id:
                    if item.content_type in ["image", "file"]:
                        self._delete_file(item.content)
                    self.items.pop(i)
                    return True
        return False
    
    def _delete_file(self, filename: str) -> bool:
        try:
            filepath = os.path.abspath(os.path.join(self.upload_dir, filename))
            if not filepath.startswith(self.upload_dir):
                return False
            if os.path.exists(filepath):
                os.remove(filepath)
                return True
            return False
        except Exception:
            return False
    
    def clear_all(self):
        with self._lock:
            for item in self.items:
                if item.content_type in ["image", "file"]:
                    self._delete_file(item.content)
            self.items.clear()
    
    def toggle_enabled(self, enabled: bool):
        self.is_enabled = enabled
        return self.is_enabled
    
    def copy_to_pc(self, item_id: str) -> bool:
        item = self.get_item(item_id)
        if item and item.content_type == "text":
            return self._set_pc_clipboard(item.content)
        return False
    
    def copy_file_to_pc(self, item_id: str) -> bool:
        if not HAS_CLIPBOARD:
            return False
        
        item = self.get_item(item_id)
        if not item or item.content_type not in ["image", "file"]:
            return False
        
        try:
            filepath = os.path.join(self.upload_dir, item.content)
            if not os.path.exists(filepath):
                return False
            
            # COM/OLE işlemleri blocking'dir, thread pool gerekebilir
            # Ancak win32clipboard işlemleri genelde MainThread ister veya STA
            # Basit metin kopyalama (dosya yolu) yeterli şimdilik
            abs_path = os.path.abspath(filepath)
            return self._set_pc_clipboard(abs_path)
                
        except Exception:
            return False


# Singleton instance
clipboard_manager = ClipboardManager()
