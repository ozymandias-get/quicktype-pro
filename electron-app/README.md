# QuickType Pro - Electron Desktop Application

## Açıklama
Bu, QuickType Pro uygulamasının Electron masaüstü sürümüdür. Sadece **Pano Yönetimi** özelliğini içerir.
Mouse ve klavye kontrolü bu sürümde yoktur - bu özellikler sadece mobil tarayıcı arayüzünde mevcuttur.

## Özellikler
- ✅ İki yönlü pano senkronizasyonu
- ✅ Metin paylaşımı (PC ↔ Telefon)
- ✅ Dosya paylaşımı
- ✅ System tray entegrasyonu
- ✅ Modern glassmorphism tasarım
- ❌ Klavye kontrolü (sadece mobilden)
- ❌ Mouse/Touchpad kontrolü (sadece mobilden)

## Kurulum

### 1. Bağımlılıkları yükleyin
```bash
cd electron-app
npm install
```

### 2. Development modunda çalıştırın
```bash
npm run dev
```

### 3. Production build
```bash
npm run build
```

### 4. Executable oluştur
```bash
npm run dist
```

## Kullanım

1. **Backend'i başlatın** (ana klasörde):
   ```bash
   python main.py
   ```

2. **Electron uygulamasını başlatın**:
   ```bash
   cd electron-app
   npm start
   ```

3. **Mobil arayüz için**: Telefonunuzun tarayıcısından `http://[BILGISAYAR_IP]:8000` adresine gidin

## Mimari

```
quicktype-pro/
├── main.py                 # Python backend giriş noktası
├── app/                    # Python backend modülleri
│   ├── clipboard_manager.py
│   ├── controllers.py      # Keyboard/Mouse (mobil için)
│   ├── socket_events.py
│   └── ...
├── static/                 # Mobil web arayüzü (tüm özellikler)
│   ├── index.html
│   └── app.js
└── electron-app/           # Electron desktop (sadece pano)
    ├── main.js             # Electron ana işlem
    ├── src/                # React bileşenleri
    └── public/
```

## Not
- Electron uygulaması çalışması için Python backend'in çalışıyor olması gerekir
- Backend varsayılan olarak `http://localhost:8000` adresinde çalışır
- Farklı bir adreste çalışıyorsa, Electron uygulamasından sunucu adresini değiştirebilirsiniz
