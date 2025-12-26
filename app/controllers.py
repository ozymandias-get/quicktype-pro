"""
QuickType Pro - Controller Modülü
Keyboard ve Mouse controller'ları - Async Wrapper Version

Değişiklikler:
- Tüm fonksiyonlar async hale getirildi
- Blocking I/O işlemleri (pynput) thread pool'a taşındı (asyncio.to_thread)
- Hata yönetimi ve loglama eklendi
"""
import asyncio
import logging
from pynput.keyboard import Controller as KbdController, Key
from pynput.mouse import Controller as MouseController, Button

# Logger yapılandırması
logger = logging.getLogger(__name__)

# ==================== CONTROLLERS (SYNC) ====================
# Pynput controller'ları senkron çalışır, biz bunları wrap edeceğiz
_keyboard = KbdController()
_mouse = MouseController()

# ==================== KEY MAPPING ====================
KEY_MAP = {
    # Basic keys
    'backspace': Key.backspace,
    'enter': Key.enter,
    'space': Key.space,
    'tab': Key.tab,
    'esc': Key.esc,
    
    # Arrow keys
    'up': Key.up,
    'down': Key.down,
    'left': Key.left,
    'right': Key.right,
    
    # Modifier keys
    'caps': Key.caps_lock,
    'delete': Key.delete,
    'insert': Key.insert,
    
    # Navigation keys
    'home': Key.home,
    'end': Key.end,
    'pageup': Key.page_up,
    'pagedown': Key.page_down,
    'printscreen': Key.print_screen,
    'scrolllock': Key.scroll_lock,
    
    # Function keys
    'f1': Key.f1, 'f2': Key.f2, 'f3': Key.f3, 'f4': Key.f4,
    'f5': Key.f5, 'f6': Key.f6, 'f7': Key.f7, 'f8': Key.f8,
    'f9': Key.f9, 'f10': Key.f10, 'f11': Key.f11, 'f12': Key.f12,
}

# ==================== KEYBOARD SHORTCUTS ====================
SHORTCUT_MAP = {
    'select-all': ('ctrl', 'a'),
    'copy': ('ctrl', 'c'),
    'paste': ('ctrl', 'v'),
    'cut': ('ctrl', 'x'),
    'undo': ('ctrl', 'z'),
    'redo': ('ctrl', 'y'),
}

# ==================== ASYNC HELPERS ====================
async def _run_blocking(func, *args):
    """Senkron fonksiyonu thread pool'da çalıştır"""
    try:
        return await asyncio.to_thread(func, *args)
    except Exception as e:
        logger.error(f"Controller hatası ({func.__name__}): {e}")
        return None

# ==================== KEYBOARD FUNCTIONS (ASYNC) ====================
async def type_character(char: str):
    """Karakter yaz (Non-blocking)"""
    def _sync_type():
        _keyboard.type(char)
    await _run_blocking(_sync_type)


async def press_special_key(key_name: str):
    """Özel tuşa bas ve bırak (Non-blocking)"""
    def _sync_press():
        if key_name in KEY_MAP:
            key = KEY_MAP[key_name]
            _keyboard.press(key)
            _keyboard.release(key)
    await _run_blocking(_sync_press)


async def execute_shortcut(action: str):
    """Klavye kısayolunu çalıştır (Non-blocking)"""
    def _sync_shortcut():
        if action not in SHORTCUT_MAP:
            return False
        
        modifier, key_char = SHORTCUT_MAP[action]
        try:
            if modifier == 'ctrl':
                _keyboard.press(Key.ctrl)
                _keyboard.type(key_char)
                _keyboard.release(Key.ctrl)
            return True
        except Exception:
            return False
            
    return await _run_blocking(_sync_shortcut)


async def toggle_shift(active: bool):
    """Shift tuşunu aç/kapa (Non-blocking)"""
    def _sync_toggle():
        if active:
            _keyboard.press(Key.shift)
        else:
            _keyboard.release(Key.shift)
    await _run_blocking(_sync_toggle)


async def release_shift():
    """Shift tuşunu bırak (Non-blocking)"""
    def _sync_release():
        _keyboard.release(Key.shift)
    await _run_blocking(_sync_release)


# ==================== MOUSE FUNCTIONS (ASYNC) ====================
async def move_mouse(dx: float, dy: float):
    """Mouse'u hareket ettir (Non-blocking)"""
    def _sync_move():
        _mouse.move(dx, dy)
    await _run_blocking(_sync_move)


async def click_mouse(button: str):
    """Mouse tıkla (Non-blocking)"""
    def _sync_click():
        if button == 'left':
            _mouse.click(Button.left)
        elif button == 'right':
            _mouse.click(Button.right)
    await _run_blocking(_sync_click)


async def scroll_mouse(dy: float):
    """Mouse scroll (Non-blocking)"""
    def _sync_scroll():
        _mouse.scroll(0, dy)
    await _run_blocking(_sync_scroll)


async def start_drag():
    """Sürüklemeyi başlat (Non-blocking)"""
    def _sync_start_drag():
        _mouse.press(Button.left)
    await _run_blocking(_sync_start_drag)


async def end_drag():
    """Sürüklemeyi bitir (Non-blocking)"""
    def _sync_end_drag():
        _mouse.release(Button.left)
    await _run_blocking(_sync_end_drag)


async def release_left_button():
    """Sol tuşu bırak (Non-blocking)"""
    def _sync_release_left():
        _mouse.release(Button.left)
    await _run_blocking(_sync_release_left)

