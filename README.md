<div align="center">

# ⌨️ QuickType Pro

**Telefonunuzdan bilgisayarınızı kontrol edin**

![Version](https://img.shields.io/badge/version-2.1--secure-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![License](https://img.shields.io/badge/license-MIT-orange)

*PC için Electron masaüstü uygulaması ve mobil cihazlar için web arayüzü*

</div>

---

## ✨ Özellikler

| Özellik | 📱 Mobil | 🖥️ PC (Electron) |
|---------|:--------:|:----------------:|
| ⌨️ Uzak Klavye | ✅ | ❌ |
| 🖱️ Touchpad/Mouse | ✅ | ❌ |
| 📋 Pano Senkronizasyonu | ✅ | ✅ |
| 📁 Dosya Paylaşımı | ✅ | ✅ |
| 🔄 System Tray | ❌ | ✅ |

---

## 📸 Ekran Görüntüleri

### 🖥️ Electron Desktop Uygulaması

<div align="center">
<img src="screenshots/electron-app.png" alt="Electron Desktop App" width="350"/>
</div>

### 📱 Mobil Web Arayüzü

<div align="center">
<table>
<tr>
<td align="center"><img src="screenshots/mobile-keyboard.png" alt="Klavye" width="200"/><br/><b>Klavye</b></td>
<td align="center"><img src="screenshots/mobile-touchpad.png" alt="Touchpad" width="200"/><br/><b>Touchpad</b></td>
</tr>
<tr>
<td align="center"><img src="screenshots/mobile-keys.png" alt="Özel Tuşlar" width="200"/><br/><b>Özel Tuşlar</b></td>
<td align="center"><img src="screenshots/mobile-clipboard.png" alt="Pano" width="200"/><br/><b>Pano</b></td>
</tr>
</table>
</div>

---

## 🔒 Güvenlik

Bu uygulama yerel ağınızda çalışmak üzere tasarlanmıştır:

- ✅ Rate limiting (DDoS koruması)
- ✅ Input sanitization (Girdi doğrulama)
- ✅ Path traversal koruması
- ✅ Bağlantı loglama
- ✅ Güvenlik başlıkları (CSP, XSS, vb.)

> ⚠️ **Uyarı**: Bu uygulamayı yalnızca güvendiğiniz ağlarda kullanın!

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Python 3.8+
- Node.js 16+ (Electron için)
- Windows 10/11

### Kurulum

```bash
# 1. Repository'yi klonla
git clone https://github.com/KULLANICI_ADINIZ/klavye.git
cd klavye

# 2. Python bağımlılıklarını yükle
pip install -r requirements.txt

# 3. Backend'i başlat
python main.py
```

### 📱 Mobil Erişim

1. Backend çalışırken terminalde IP adresini görüntüleyin
2. Telefonunuzun tarayıcısından `http://[PC_IP]:8000` adresine gidin
3. Tüm özellikleri kullanmaya başlayın!

### 🖥️ Electron (PC) Kurulumu

```bash
cd electron-app
npm install
npm start
```

---

## 🔧 Geliştirici Modu

### Backend
```bash
# Debug modunda başlat
$env:LOG_LEVEL="DEBUG"
python main.py
```

### Electron
```bash
cd electron-app
npm run dev
```

### Production Build
```bash
cd electron-app
npm run dist
```

---

## ⚙️ Yapılandırma

| Ortam Değişkeni | Varsayılan | Açıklama |
|-----------------|------------|----------|
| `LOG_LEVEL` | `INFO` | Log seviyesi (DEBUG, INFO, WARNING, ERROR) |
| `CORS_ORIGINS` | `*` | İzin verilen CORS origin'leri |

### Örnek Yapılandırma

```powershell
# Sadece belirli IP'lerden erişime izin ver
$env:CORS_ORIGINS="http://192.168.1.100:8000,http://192.168.1.101:8000"
python main.py
```

---

## 📦 Proje Yapısı

```
📁 QuickType-Pro/
├── 📄 main.py              # Python backend giriş noktası
├── 📄 requirements.txt     # Python bağımlılıkları
├── 📁 app/                 # Backend modülleri
│   ├── config.py           # Yapılandırma
│   ├── security.py         # Güvenlik fonksiyonları
│   ├── middleware.py       # HTTP middleware
│   ├── routes.py           # API endpoint'leri
│   ├── controllers.py      # Klavye/Mouse kontrolü
│   ├── socket_events.py    # WebSocket olayları
│   └── clipboard_manager.py # Pano yönetimi
├── 📁 static/              # Mobil web arayüzü
├── 📁 electron-app/        # Desktop uygulaması
└── 📁 uploads/             # Paylaşılan dosyalar
```

---

## 🐛 Sorun Giderme

<details>
<summary><b>Backend başlamıyor</b></summary>

```bash
pip install -r requirements.txt --upgrade
```
</details>

<details>
<summary><b>Bağlantı kurulamıyor</b></summary>

1. Firewall'da 8000 portunu açın
2. PC ve telefon aynı ağda mı kontrol edin
3. Antivirüs yazılımını geçici olarak devre dışı bırakın
</details>

<details>
<summary><b>Pano çalışmıyor (Windows)</b></summary>

```bash
pip install pywin32 --upgrade
```
</details>

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

<div align="center">

**QuickType Pro** ile ❤️ yapıldı

</div>
