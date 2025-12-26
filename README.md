<div align="center">

# ⌨️ QuickType Pro

**Control your computer from your phone**

![Version](https://img.shields.io/badge/version-2.1--secure-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![License](https://img.shields.io/badge/license-MIT-orange)

*Electron desktop app for PC and web interface for mobile devices*

---

### 🌍 Languages / Diller / Sprachen

[🇬🇧 English](README.md) | [🇹🇷 Türkçe](README.tr.md) | [🇩🇪 Deutsch](README.de.md) | [🇫🇷 Français](README.fr.md) | [🇪🇸 Español](README.es.md) | [🇨🇳 中文](README.zh.md)

---

</div>

## ✨ Features

| Feature | 📱 Mobile | 🖥️ PC (Electron) |
|---------|:--------:|:----------------:|
| ⌨️ Remote Keyboard | ✅ | ❌ |
| 🖱️ Touchpad/Mouse | ✅ | ❌ |
| 📋 Clipboard Sync | ✅ | ✅ |
| 📁 File Sharing | ✅ | ✅ |
| 🔄 System Tray | ❌ | ✅ |
| 🌓 Dark/Light Theme | ✅ | ✅ |
| 🌍 Multi-language | ✅ | ✅ |

---

## 📸 Screenshots

### 🖥️ Electron Desktop Application

<div align="center">
<img src="screenshots/electron-app.png" alt="Electron Desktop App" width="350"/>
</div>

### 📱 Mobile Web Interface

<div align="center">
<table>
<tr>
<td align="center"><img src="screenshots/mobile-keyboard.png" alt="Keyboard" width="200"/><br/><b>Keyboard</b></td>
<td align="center"><img src="screenshots/mobile-touchpad.png" alt="Touchpad" width="200"/><br/><b>Touchpad</b></td>
</tr>
<tr>
<td align="center"><img src="screenshots/mobile-keys.png" alt="Special Keys" width="200"/><br/><b>Special Keys</b></td>
<td align="center"><img src="screenshots/mobile-clipboard.png" alt="Clipboard" width="200"/><br/><b>Clipboard</b></td>
</tr>
</table>
</div>

---

## 🔒 Security

This application is designed to work on your local network:

- ✅ Rate limiting (DDoS protection)
- ✅ Input sanitization
- ✅ Path traversal protection
- ✅ Connection logging
- ✅ Security headers (CSP, XSS, etc.)

> ⚠️ **Warning**: Only use this application on trusted networks!

---

## 🚀 Quick Start

### Requirements

- Python 3.8+
- Node.js 16+ (for Electron)
- Windows 10/11

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ozymandias-get/quicktype-pro.git
cd quicktype-pro

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Start the backend
python main.py
```

### 📱 Mobile Access

1. While the backend is running, note the IP address shown in the terminal
2. Go to `http://[PC_IP]:8000` from your phone's browser
3. Start using all features!

### 🖥️ Electron (PC) Setup

```bash
cd electron-app
npm install
npm start
```

---

## 🔧 Developer Mode

### Backend
```bash
# Start in debug mode
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

## ⚙️ Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `LOG_LEVEL` | `INFO` | Log level (DEBUG, INFO, WARNING, ERROR) |
| `CORS_ORIGINS` | `*` | Allowed CORS origins |

### Example Configuration

```powershell
# Allow access only from specific IPs
$env:CORS_ORIGINS="http://192.168.1.100:8000,http://192.168.1.101:8000"
python main.py
```

---

## 📦 Project Structure

```
📁 QuickType-Pro/
├── 📄 main.py              # Python backend entry point
├── 📄 requirements.txt     # Python dependencies
├── 📁 app/                 # Backend modules
│   ├── config.py           # Configuration
│   ├── security.py         # Security functions
│   ├── middleware.py       # HTTP middleware
│   ├── routes.py           # API endpoints
│   ├── controllers.py      # Keyboard/Mouse control
│   ├── socket_events.py    # WebSocket events
│   └── clipboard_manager.py # Clipboard management
├── 📁 static/              # Mobile web interface
├── 📁 electron-app/        # Desktop application
└── 📁 uploads/             # Shared files
```

---

## 🐛 Troubleshooting

<details>
<summary><b>Backend won't start</b></summary>

```bash
pip install -r requirements.txt --upgrade
```
</details>

<details>
<summary><b>Cannot connect</b></summary>

1. Open port 8000 in your firewall
2. Make sure PC and phone are on the same network
3. Temporarily disable antivirus software
</details>

<details>
<summary><b>Clipboard not working (Windows)</b></summary>

```bash
pip install pywin32 --upgrade
```
</details>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ using **QuickType Pro**

</div>
