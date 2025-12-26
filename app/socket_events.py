"""
QuickType Pro - Socket.IO Olayları
WebSocket event handler'ları - Async & Optimized Version

Değişiklikler:
- Controller çağrıları await edildi (Non-blocking)
- Clipboard dosya yükleme işlemi async yapıldı
- Global state yönetimi iyileştirildi
"""
import socketio
import asyncio
import logging
from typing import Optional, Any, Dict

from .config import SOCKET_IO_CONFIG
from .security import (
    get_client_ip,
    log_connection,
    sanitize_char,
    validate_special_key,
    validate_mouse_button,
    validate_numeric,
    validate_shortcut_action
)
from .controllers import (
    type_character,
    press_special_key,
    toggle_shift as ctrl_toggle_shift,
    release_shift,
    release_left_button,
    move_mouse,
    click_mouse,
    scroll_mouse,
    start_drag,
    end_drag,
    execute_shortcut
)
from .clipboard_manager import clipboard_manager

# ==================== LOGGING SETUP ====================
logger = logging.getLogger(__name__)

# ==================== SOCKET.IO SERVER ====================
sio = socketio.AsyncServer(**SOCKET_IO_CONFIG)

# ==================== THREAD-SAFE CLIPBOARD QUEUE ====================
_clipboard_queue: Optional[asyncio.Queue] = None
_clipboard_task: Optional[asyncio.Task] = None
_event_loop: Optional[asyncio.AbstractEventLoop] = None


def _get_safe_sid_prefix(sid: Optional[str]) -> str:
    """Session ID'nin güvenli prefix'ini al"""
    if not sid or not isinstance(sid, str):
        return "UNKNOWN"
    return sid[:8] if len(sid) >= 8 else sid


def on_pc_clipboard_change(item_data: Dict[str, Any]) -> None:
    """
    PC panosu değiştiğinde çağrılır (Thread-safe callback)
    """
    global _clipboard_queue, _event_loop
    
    if _clipboard_queue is None or _event_loop is None:
        return
    
    try:
        # Thread-safe queue ekleme
        _event_loop.call_soon_threadsafe(
            lambda: _clipboard_queue.put_nowait(item_data)
        )
    except RuntimeError:
        pass
    except asyncio.QueueFull:
        logger.warning("Clipboard queue dolu, öğe atlandı")


async def clipboard_broadcast_task() -> None:
    """PC pano değişikliklerini yayınlayan arka plan görevi"""
    global _clipboard_queue
    
    logger.info("Clipboard broadcast task başlatıldı")
    
    while True:
        try:
            item_data = await _clipboard_queue.get()
            try:
                await sio.emit('clipboard_update', item_data)
            except Exception as e:
                logger.error(f"Clipboard emit hatası: {e}")
            finally:
                _clipboard_queue.task_done()
                
        except asyncio.CancelledError:
            logger.info("Clipboard broadcast task iptal edildi")
            break
        except Exception as e:
            logger.error(f"Clipboard broadcast task hatası: {e}")
            await asyncio.sleep(0.5)


async def start_clipboard_monitoring() -> None:
    """Sistemi başlat"""
    global _clipboard_queue, _clipboard_task, _event_loop
    
    _event_loop = asyncio.get_running_loop()
    _clipboard_queue = asyncio.Queue(maxsize=100)
    
    _clipboard_task = asyncio.create_task(
        clipboard_broadcast_task(),
        name="clipboard_broadcast"
    )
    
    clipboard_manager.set_callback(on_pc_clipboard_change)
    clipboard_manager.start_monitoring()
    
    logger.info("Clipboard monitoring sistemi başlatıldı")


async def stop_clipboard_monitoring() -> None:
    """Sistemi durdur"""
    global _clipboard_task
    
    if _clipboard_task:
        _clipboard_task.cancel()
        try:
            await _clipboard_task
        except asyncio.CancelledError:
            pass
        _clipboard_task = None
    
    clipboard_manager.stop_monitoring()
    logger.info("Clipboard monitoring sistemi durduruldu")


# ==================== CONNECTION EVENTS ====================
@sio.event
async def connect(sid: str, environ: dict) -> None:
    try:
        client_ip = get_client_ip(environ)
        safe_sid = _get_safe_sid_prefix(sid)
        log_connection(client_ip, "CONNECTED", f"SID: {safe_sid}...")
        
        items = clipboard_manager.get_all_items()
        await sio.emit('clipboard_init', {
            'items': items,
            'enabled': clipboard_manager.is_enabled
        }, room=sid)
        
    except Exception as e:
        logger.error(f"Connect event hatası: {e}")


@sio.event
async def disconnect(sid: str) -> None:
    safe_sid = _get_safe_sid_prefix(sid)
    log_connection("unknown", "DISCONNECTED", f"SID: {safe_sid}...")
    
    # Temizlik - await kullanarak
    try:
        await release_left_button()
        await release_shift()
    except Exception as e:
        logger.debug(f"Disconnect cleanup hatası: {e}")


@sio.event
async def heartbeat(sid: str, data: Any) -> None:
    pass


# ==================== KEYBOARD EVENTS ====================
@sio.event
async def toggle_shift(sid: str, data: Any) -> None:
    try:
        if isinstance(data, dict) and data.get('active'):
            await ctrl_toggle_shift(True)
        else:
            await ctrl_toggle_shift(False)
    except Exception as e:
        logger.error(f"toggle_shift hatası: {e}")


@sio.event
async def type_char(sid: str, data: Any) -> None:
    try:
        if not isinstance(data, dict):
            return
        
        msg_type = data.get('type')
        value = data.get('value')

        if msg_type == 'char':
            sanitized = sanitize_char(value)
            if sanitized:
                await type_character(sanitized)
        
        elif msg_type == 'special':
            if not validate_special_key(value):
                return
            await press_special_key(value)
            
    except Exception as e:
        logger.error(f"type_char hatası: {e}")


@sio.event
async def keyboard_shortcut(sid: str, data: Any) -> None:
    try:
        if not isinstance(data, dict):
            return
        
        action = data.get('action')
        if not validate_shortcut_action(action):
            return
        
        await execute_shortcut(action)
        
    except Exception as e:
        logger.error(f"keyboard_shortcut hatası: {e}")


# ==================== MOUSE EVENTS ====================
@sio.event
async def mouse_move(sid: str, data: Any) -> None:
    try:
        if not isinstance(data, dict):
            return
        dx = validate_numeric(data.get('dx', 0), -100, 100)
        dy = validate_numeric(data.get('dy', 0), -100, 100)
        await move_mouse(dx, dy)
    except Exception as e:
        logger.error(f"mouse_move hatası: {e}")


@sio.event
async def mouse_click(sid: str, data: Any) -> None:
    try:
        if not isinstance(data, dict):
            return
        button = data.get('button')
        if not validate_mouse_button(button):
            return
        await click_mouse(button)
    except Exception as e:
        logger.error(f"mouse_click hatası: {e}")


@sio.event
async def mouse_scroll(sid: str, data: Any) -> None:
    try:
        if not isinstance(data, dict):
            return
        dy = validate_numeric(data.get('dy', 0), -50, 50)
        await scroll_mouse(dy)
    except Exception as e:
        logger.error(f"mouse_scroll hatası: {e}")


@sio.event
async def mouse_drag(sid: str, data: Any) -> None:
    try:
        if not isinstance(data, dict):
            return
        state = data.get('state')
        if state == 'start':
            await start_drag()
        elif state == 'end':
            await end_drag()
    except Exception as e:
        logger.error(f"mouse_drag hatası: {e}")


# ==================== CLIPBOARD EVENTS ====================
@sio.event
async def clipboard_add(sid: str, data: Any) -> None:
    try:
        if not isinstance(data, dict):
            return
        
        content = data.get('content', '')
        content_type = data.get('content_type', 'text')
        filename = data.get('filename')
        
        # Dosya boyutu kontrolü
        if len(str(content)) > 50 * 1024 * 1024:
            await sio.emit('clipboard_error', {'error': 'Dosya çok büyük (max 50MB)'}, room=sid)
            return
        
        # Async metodu çağır - await ile
        item = await clipboard_manager.add_from_phone_async(content, content_type, filename)
        
        if item:
            await sio.emit('clipboard_update', item.to_dict())
        else:
            await sio.emit('clipboard_error', {'error': 'Öğe eklenemedi'}, room=sid)
            
    except Exception as e:
        logger.error(f"clipboard_add hatası: {e}")


@sio.event
async def clipboard_toggle(sid: str, data: Any) -> None:
    try:
        if not isinstance(data, dict):
            return
        enabled = data.get('enabled', True)
        new_state = clipboard_manager.toggle_enabled(enabled)
        await sio.emit('clipboard_state', {'enabled': new_state})
    except Exception as e:
        logger.error(f"clipboard_toggle hatası: {e}")


@sio.event
async def clipboard_delete(sid: str, data: Any) -> None:
    try:
        if not isinstance(data, dict):
            return
        item_id = data.get('id')
        if item_id:
            success = clipboard_manager.delete_item(item_id)
            if success:
                await sio.emit('clipboard_deleted', {'id': item_id})
    except Exception as e:
        logger.error(f"clipboard_delete hatası: {e}")


@sio.event
async def clipboard_clear(sid: str) -> None:
    try:
        clipboard_manager.clear_all()
        await sio.emit('clipboard_cleared', {})
    except Exception as e:
        logger.error(f"clipboard_clear hatası: {e}")


@sio.event
async def clipboard_copy_to_pc(sid: str, data: Any) -> None:
    try:
        if not isinstance(data, dict):
            return
        item_id = data.get('id')
        if item_id:
            success = clipboard_manager.copy_to_pc(item_id)
            await sio.emit('clipboard_copied', {
                'id': item_id, 
                'success': success
            }, room=sid)
    except Exception as e:
        logger.error(f"clipboard_copy_to_pc hatası: {e}")


@sio.event
async def clipboard_copy_file_to_pc(sid: str, data: Any) -> None:
    try:
        if not isinstance(data, dict):
            return
        item_id = data.get('id')
        if item_id:
            success = clipboard_manager.copy_file_to_pc(item_id)
            await sio.emit('clipboard_copied', {
                'id': item_id, 
                'success': success, 
                'type': 'file'
            }, room=sid)
    except Exception as e:
        logger.error(f"clipboard_copy_file_to_pc hatası: {e}")


@sio.event
async def clipboard_get_content(sid: str, data: Any) -> None:
    try:
        if not isinstance(data, dict):
            return
        item_id = data.get('id')
        if item_id:
            content = clipboard_manager.get_full_content(item_id)
            await sio.emit('clipboard_content', {
                'id': item_id, 
                'content': content
            }, room=sid)
    except Exception as e:
        logger.error(f"clipboard_get_content hatası: {e}")


@sio.event
async def clipboard_popup(sid: str, data: Any) -> None:
    """
    Pop-up olarak içerik gönder - arşive kaydetmez, 
    gönderen cihaz HARİÇ diğer tüm istemcilere geçici olarak gösterir
    """
    try:
        if not isinstance(data, dict):
            return
        
        content = data.get('content', '')
        content_type = data.get('content_type', 'text')
        filename = data.get('filename')
        
        # Boyut kontrolü
        if len(str(content)) > 50 * 1024 * 1024:
            await sio.emit('clipboard_error', {'error': 'İçerik çok büyük (max 50MB)'}, room=sid)
            return
        
        # Pop-up verisini hazırla
        popup_data = {
            'content': content,
            'content_type': content_type,
            'filename': filename,
            'source': 'phone'
        }
        
        # Gönderen cihaz HARİÇ diğer tüm istemcilere pop-up olarak gönder
        # skip_sid parametresi ile gönderen hariç tutulur
        await sio.emit('clipboard_popup_show', popup_data, skip_sid=sid)
        logger.info(f"Pop-up gönderildi (gönderen hariç): {content_type}")
        
    except Exception as e:
        logger.error(f"clipboard_popup hatası: {e}")


