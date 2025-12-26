"""
QuickType Pro - Concurrency & Async Tests
Bu testler, uygulamadaki asenkron işlemlerin gerçekten non-blocking çalıştığını doğrular.
pytest-asyncio bağımlılığı olmadan çalışacak şekilde tasarlanmıştır.
"""
import asyncio
import time
import os
import sys

# Test dizinini path'e ekle
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.controllers import type_character, move_mouse, press_special_key
from app.clipboard_manager import clipboard_manager

def test_controller_non_blocking():
    """Controller fonksiyonlarının non-blocking olduğunu doğrular"""
    async def _test():
        start_time = time.time()
        # 3 işlemi aynı anda başlat
        tasks = [
            type_character('a'),
            move_mouse(10, 10),
            press_special_key('space')
        ]
        await asyncio.gather(*tasks)
        return time.time() - start_time

    # asyncio.run ile çalıştır
    duration = asyncio.run(_test())
    assert duration < 1.0, "Controller işlemleri çok uzun sürdü"

def test_clipboard_upload_async(tmp_path):
    """Async dosya yüklemenin dosya oluşturduğunu doğrular"""
    original_upload_dir = clipboard_manager.upload_dir
    clipboard_manager.upload_dir = str(tmp_path)
    
    async def _test():
        content = "SGVsbG8="
        filename = "test_async.txt"
        item = await clipboard_manager.add_from_phone_async(
            content=content,
            content_type="file",
            filename=filename
        )
        return item

    try:
        item = asyncio.run(_test())
        assert item is not None
        assert item.filename == "test_async.txt"
        
        expected_path = os.path.join(str(tmp_path), item.content)
        assert os.path.exists(expected_path)
        with open(expected_path, 'rb') as f:
            assert f.read() == b"Hello"
    finally:
        clipboard_manager.upload_dir = original_upload_dir

def test_heavy_load_simulation():
    """Ağır yük altında event loop'un donmadığını doğrular"""
    async def blocking_simulator(duration):
        await asyncio.to_thread(time.sleep, duration)
        return True

    async def _test():
        start_time = time.time()
        mouse_tasks = [move_mouse(1, 1) for _ in range(50)]
        long_task = blocking_simulator(0.1)
        await asyncio.gather(*mouse_tasks, long_task)
        return time.time() - start_time

    duration = asyncio.run(_test())
    print(f"Total duration: {duration}s")
    assert duration < 2.0
