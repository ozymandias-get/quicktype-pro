<div align="center">

# ⌨️ QuickType Pro

**Telefonunuzdan bilgisayarınızı kontrol edin**

![Version](https://img.shields.io/badge/version-3.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![License](https://img.shields.io/badge/license-MIT-orange)

*PC için Electron masaüstü uygulaması ve mobil cihazlar için web arayüzü*

---

### 🌍 Diller / Languages

[🇬🇧 English](README.md) | [🇹🇷 Türkçe](README.tr.md) | [🇩🇪 Deutsch](README.de.md) | [🇫🇷 Français](README.fr.md) | [🇪🇸 Español](README.es.md) | [🇨🇳 中文](README.zh.md)

---

</div>

## ✨ Özellikler

| Özellik | 📱 Mobil | 🖥️ PC (Electron) |
|---------|:--------:|:----------------:|
| ⌨️ Uzak Klavye | ✅ | ❌ |
| 🖱️ Touchpad/Mouse | ✅ | ❌ |
| 📋 Pano Senkronizasyonu | ✅ | ✅ |
| 📁 Dosya Paylaşımı | ✅ | ✅ |
| 🔄 System Tray | ❌ | ✅ |
| 🌓 Koyu/Açık Tema | ✅ | ✅ |
| 🌍 Çoklu Dil | ✅ | ✅ |

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

- ✅ **Sadece HTTPS** - HTTP bağlantıları devre dışı
- ✅ **SSL/TLS** şifreleme (tüm trafik)
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ WebAuthn/Face ID hazır altyapı
- ✅ Rate limiting (DDoS koruması)
- ✅ Input sanitization (Girdi doğrulama)
- ✅ Path traversal koruması
- ✅ Bağlantı loglama
- ✅ Güvenlik başlıkları (CSP, XSS, COOP, vb.)

> 🔐 **Güvenlik Notu**: Uygulama çalışmak için HTTPS sertifikaları gerektirir. HTTP tamamen devre dışıdır.

> ⚠️ **Uyarı**: Bu uygulamayı yalnızca güvendiğiniz ağlarda kullanın!

### 🔐 HTTPS Kurulumu (Önerilen)

Güvenli bağlantı ve Face ID desteği için HTTPS **uygulama içinden** yapılandırılır:

1. QuickType Pro'yu açın
2. **Ayarlar** (⚙️) → **HTTPS / Security** bölümüne gidin
3. "**HTTPS Kur**" butonuna tıklayın
4. Tamam! `https://[PC_IP]:8000` üzerinden erişin

#### 📱 Telefon Sertifikası Kurulumu

1. Ayarlar'da "**Telefon için Dışa Aktar**" butonuna tıklayın
2. `QuickType-RootCA.crt` dosyasını telefonunuza gönderin
3. Yükleyin:
   - **iPhone**: Ayarlar → Genel → VPN ve Cihaz Yönetimi → Yükle
   - **Android**: Dosyayı aç → CA Sertifikası olarak yükle

> 💡 **Not**: Root CA'yı yalnızca bir kez yüklemeniz yeterli. Sertifikalar yenilense bile geçerli kalır.

#### 🔄 IP Adresi Değişiklikleri

PC'nizin IP adresi değişirse:
- Uygulama Ayarlar'da uyarı gösterecek
- "**Sertifikayı Yenile**" tıklayın - uygulama otomatik yeniden başlayacak
- Telefon sertifikasını yeniden yüklemenize gerek yok!

> 💡 **İpucu**: Bu sorunu kalıcı olarak önlemek için Windows Ağ Ayarlarından sabit IP belirleyin.

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

1. Önce HTTPS sertifikalarını kurun (yukarıdaki Güvenlik bölümüne bakın)
2. Uygulama başladığında gösterilen IP adresini not alın
3. Telefonunuzun tarayıcısından `https://[PC_IP]:8000` adresine gidin
4. Tüm özellikleri kullanmaya başlayın!

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
$env:CORS_ORIGINS="https://192.168.1.100:8000,https://192.168.1.101:8000"
python main.py
```

---

## 📦 Proje Yapısı

```
📁 QuickType-Pro/
├── 📄 main.py                  # Python backend giriş noktası
├── 📄 requirements.txt         # Python bağımlılıkları
├── 📁 app/                     # Backend modülleri
│   ├── __init__.py             # Paket init
│   ├── config.py               # Yapılandırma & sabitler
│   ├── security.py             # Rate limiting, doğrulama
│   ├── middleware.py           # HTTP güvenlik middleware
│   ├── routes.py               # API endpoint'leri
│   ├── controllers.py          # Klavye/Mouse kontrolü
│   ├── socket_events.py        # WebSocket olayları
│   ├── clipboard_manager.py    # Pano senkronizasyonu & dosya paylaşımı
│   └── utils.py                # Yardımcı fonksiyonlar
├── 📁 static/                  # Mobil web arayüzü (PWA)
│   ├── index.html              # Mobil UI
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker
├── 📁 electron-app/            # Desktop uygulaması
│   ├── main.js                 # Electron giriş noktası
│   ├── preload.js              # Preload script
│   ├── certificateManager.js   # HTTPS sertifika yönetimi
│   ├── 📁 modules/             # Modüler mimari
│   │   ├── settings.js         # Ayarlar yönetimi
│   │   ├── backend.js          # Python backend kontrolü
│   │   ├── window.js           # Pencere & tray yönetimi
│   │   ├── updater.js          # Otomatik güncelleme sistemi
│   │   ├── ipc-handlers.js     # IPC iletişimi
│   │   └── https-manager.js    # HTTPS IPC handler'ları
│   ├── 📁 src/                 # React frontend
│   └── 📁 public/              # Statik dosyalar
├── 📁 certs/                   # SSL sertifikaları (otomatik oluşturulur)
├── 📁 tests/                   # Birim testleri
├── 📁 uploads/                 # Paylaşılan dosya deposu
└── 📁 .github/workflows/       # CI/CD (GitHub Actions)
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
