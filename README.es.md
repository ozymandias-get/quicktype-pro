<div align="center">

# ⌨️ QuickType Pro

**Controla tu ordenador desde tu teléfono**

![Version](https://img.shields.io/badge/version-3.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![License](https://img.shields.io/badge/license-MIT-orange)

*Aplicación de escritorio Electron para PC e interfaz web para dispositivos móviles*

---

### 🌍 Idiomas / Languages

[🇬🇧 English](README.md) | [🇹🇷 Türkçe](README.tr.md) | [🇩🇪 Deutsch](README.de.md) | [🇫🇷 Français](README.fr.md) | [🇪🇸 Español](README.es.md) | [🇨🇳 中文](README.zh.md)

---

</div>

## ✨ Características

| Característica | 📱 Móvil | 🖥️ PC (Electron) |
|----------------|:--------:|:----------------:|
| ⌨️ Teclado Remoto | ✅ | ❌ |
| 🖱️ Touchpad/Ratón | ✅ | ❌ |
| 📋 Sync Portapapeles | ✅ | ✅ |
| 📁 Compartir Archivos | ✅ | ✅ |
| 🔄 Bandeja del Sistema | ❌ | ✅ |
| 🌓 Modo Oscuro/Claro | ✅ | ✅ |
| 🌍 Multiidioma | ✅ | ✅ |

---

## 📸 Capturas de Pantalla

### 🖥️ Aplicación de Escritorio Electron

<div align="center">
<img src="screenshots/electron-app.png" alt="Electron Desktop App" width="350"/>
</div>

### 📱 Interfaz Web Móvil

<div align="center">
<table>
<tr>
<td align="center"><img src="screenshots/mobile-keyboard.png" alt="Teclado" width="200"/><br/><b>Teclado</b></td>
<td align="center"><img src="screenshots/mobile-touchpad.png" alt="Touchpad" width="200"/><br/><b>Touchpad</b></td>
</tr>
<tr>
<td align="center"><img src="screenshots/mobile-keys.png" alt="Teclas Especiales" width="200"/><br/><b>Teclas Especiales</b></td>
<td align="center"><img src="screenshots/mobile-clipboard.png" alt="Portapapeles" width="200"/><br/><b>Portapapeles</b></td>
</tr>
</table>
</div>

---

## 🔒 Seguridad

Esta aplicación está diseñada para funcionar en tu red local:

- ✅ **Solo HTTPS** - Conexiones HTTP deshabilitadas
- ✅ **SSL/TLS** cifrado para todo el tráfico
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ Infraestructura lista para WebAuthn/Face ID
- ✅ Limitación de velocidad (protección DDoS)
- ✅ Validación de entrada
- ✅ Protección contra path traversal
- ✅ Registro de conexiones
- ✅ Cabeceras de seguridad (CSP, XSS, COOP, etc.)

> 🔐 **Nota de seguridad**: La aplicación requiere certificados HTTPS para ejecutarse. HTTP está completamente deshabilitado.

> ⚠️ **Advertencia**: ¡Usa esta aplicación solo en redes de confianza!

### 🔐 Configuración HTTPS (Recomendado)

Para conexiones seguras y soporte Face ID, HTTPS se configura **desde la aplicación**:

1. Abre QuickType Pro
2. Ve a **Configuración** (⚙️) → **HTTPS / Security**
3. Haz clic en "**Configurar HTTPS**"
4. ¡Listo! Accede vía `https://[PC_IP]:8000`

#### 📱 Instalación del Certificado en el Teléfono

1. En Configuración, haz clic en "**Exportar para Teléfono**"
2. Envía el archivo `QuickType-RootCA.crt` a tu teléfono
3. Instala:
   - **iPhone**: Ajustes → General → VPN y gestión de dispositivos → Instalar
   - **Android**: Abrir archivo → Instalar como certificado CA

> 💡 **Nota**: El Root CA solo necesita instalarse una vez. Permanece válido incluso cuando se renuevan los certificados.

#### 🔄 Cambios de Dirección IP

Si la dirección IP de tu PC cambia:
- La app mostrará una advertencia en Configuración
- Haz clic en "**Renovar Certificado**" - la app se reiniciará automáticamente
- ¡No necesitas reinstalar el certificado del teléfono!

> 💡 **Consejo**: Configura una IP estática en los Ajustes de Red de Windows para evitar este problema permanentemente.

---

## 🚀 Inicio Rápido

### Requisitos

- Python 3.8+
- Node.js 16+ (para Electron)
- Windows 10/11

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_NOMBRE_USUARIO/klavye.git
cd klavye

# 2. Instalar dependencias de Python
pip install -r requirements.txt

# 3. Iniciar el backend
python main.py
```

### 📱 Acceso Móvil

1. Primero, configura los certificados HTTPS (ver sección Seguridad arriba)
2. Anota la dirección IP mostrada al iniciar la app
3. Ve a `https://[PC_IP]:8000` desde el navegador de tu teléfono
4. ¡Comienza a usar todas las funciones!

### 🖥️ Configuración de Electron (PC)

```bash
cd electron-app
npm install
npm start
```

---

## 🔧 Modo Desarrollador

### Backend
```bash
# Iniciar en modo debug
$env:LOG_LEVEL="DEBUG"
python main.py
```

### Electron
```bash
cd electron-app
npm run dev
```

### Build de Producción
```bash
cd electron-app
npm run dist
```

---

## ⚙️ Configuración

| Variable de Entorno | Defecto | Descripción |
|---------------------|---------|-------------|
| `LOG_LEVEL` | `INFO` | Nivel de log (DEBUG, INFO, WARNING, ERROR) |
| `CORS_ORIGINS` | `*` | Orígenes CORS permitidos |

### Ejemplo de Configuración

```powershell
# Permitir acceso solo desde IPs específicas
$env:CORS_ORIGINS="https://192.168.1.100:8000,https://192.168.1.101:8000"
python main.py
```

---

## 📦 Estructura del Proyecto

```
📁 QuickType-Pro/
├── 📄 main.py                  # Punto de entrada del backend Python
├── 📄 requirements.txt         # Dependencias de Python
├── 📁 app/                     # Módulos del backend
│   ├── __init__.py             # Init del paquete
│   ├── config.py               # Configuración y constantes
│   ├── security.py             # Rate limiting, validación
│   ├── middleware.py           # Middleware de seguridad HTTP
│   ├── routes.py               # Endpoints de API
│   ├── controllers.py          # Control de teclado/ratón
│   ├── socket_events.py        # Eventos WebSocket
│   ├── clipboard_manager.py    # Sync portapapeles & compartir archivos
│   └── utils.py                # Funciones auxiliares
├── 📁 static/                  # Interfaz web móvil (PWA)
│   ├── index.html              # UI Móvil
│   ├── manifest.json           # Manifiesto PWA
│   └── sw.js                   # Service Worker
├── 📁 electron-app/            # Aplicación de escritorio
│   ├── main.js                 # Punto de entrada Electron
│   ├── preload.js              # Script de precarga
│   ├── certificateManager.js   # Gestión certificados HTTPS
│   ├── 📁 modules/             # Arquitectura modular
│   │   ├── settings.js         # Gestión de configuración
│   │   ├── backend.js          # Control backend Python
│   │   ├── window.js           # Gestión ventana y bandeja
│   │   ├── updater.js          # Sistema de actualización auto
│   │   ├── ipc-handlers.js     # Comunicación IPC
│   │   └── https-manager.js    # Handlers IPC HTTPS
│   ├── 📁 src/                 # Frontend React
│   └── 📁 public/              # Assets estáticos
├── 📁 certs/                   # Certificados SSL (generados auto)
├── 📁 tests/                   # Tests unitarios
├── 📁 uploads/                 # Almacenamiento archivos compartidos
└── 📁 .github/workflows/       # CI/CD (GitHub Actions)
```

---

## 🐛 Solución de Problemas

<details>
<summary><b>El backend no inicia</b></summary>

```bash
pip install -r requirements.txt --upgrade
```
</details>

<details>
<summary><b>No se puede conectar</b></summary>

1. Abre el puerto 8000 en el firewall
2. Asegúrate de que el PC y el teléfono estén en la misma red
3. Desactiva temporalmente el antivirus
</details>

<details>
<summary><b>El portapapeles no funciona (Windows)</b></summary>

```bash
pip install pywin32 --upgrade
```
</details>

---

## 📄 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

---

<div align="center">

Hecho con ❤️ usando **QuickType Pro**

</div>
