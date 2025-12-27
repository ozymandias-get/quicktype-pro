<div align="center">

# ⌨️ QuickType Pro

**Contrôlez votre ordinateur depuis votre téléphone**

![Version](https://img.shields.io/badge/version-3.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![License](https://img.shields.io/badge/license-MIT-orange)

*Application de bureau Electron pour PC et interface web pour appareils mobiles*

---

### 🌍 Langues / Languages

[🇬🇧 English](README.md) | [🇹🇷 Türkçe](README.tr.md) | [🇩🇪 Deutsch](README.de.md) | [🇫🇷 Français](README.fr.md) | [🇪🇸 Español](README.es.md) | [🇨🇳 中文](README.zh.md)

---

</div>

## ✨ Fonctionnalités

| Fonctionnalité | 📱 Mobile | 🖥️ PC (Electron) |
|----------------|:--------:|:----------------:|
| ⌨️ Clavier à distance | ✅ | ❌ |
| 🖱️ Touchpad/Souris | ✅ | ❌ |
| 📋 Sync presse-papiers | ✅ | ✅ |
| 📁 Partage de fichiers | ✅ | ✅ |
| 🔄 Barre système | ❌ | ✅ |
| 🌓 Mode Sombre/Clair | ✅ | ✅ |
| 🌍 Multilingue | ✅ | ✅ |

---

## 📸 Captures d'écran

### 🖥️ Application de bureau Electron

<div align="center">
<img src="screenshots/electron-app.png" alt="Electron Desktop App" width="350"/>
</div>

### 📱 Interface Web Mobile

<div align="center">
<table>
<tr>
<td align="center"><img src="screenshots/mobile-keyboard.png" alt="Clavier" width="200"/><br/><b>Clavier</b></td>
<td align="center"><img src="screenshots/mobile-touchpad.png" alt="Touchpad" width="200"/><br/><b>Touchpad</b></td>
</tr>
<tr>
<td align="center"><img src="screenshots/mobile-keys.png" alt="Touches spéciales" width="200"/><br/><b>Touches spéciales</b></td>
<td align="center"><img src="screenshots/mobile-clipboard.png" alt="Presse-papiers" width="200"/><br/><b>Presse-papiers</b></td>
</tr>
</table>
</div>

---

## 🔒 Sécurité

Cette application est conçue pour fonctionner sur votre réseau local :

- ✅ **HTTPS uniquement** - Connexions HTTP désactivées
- ✅ **SSL/TLS** chiffrement pour tout le trafic
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ Infrastructure prête pour WebAuthn/Face ID
- ✅ Limitation de débit (protection DDoS)
- ✅ Validation des entrées
- ✅ Protection contre le path traversal
- ✅ Journalisation des connexions
- ✅ En-têtes de sécurité (CSP, XSS, COOP, etc.)

> 🔐 **Note de sécurité** : L'application nécessite des certificats HTTPS pour fonctionner. HTTP est complètement désactivé.

> ⚠️ **Avertissement** : N'utilisez cette application que sur des réseaux de confiance !

### 🔐 Configuration HTTPS (Recommandé)

Pour des connexions sécurisées et le support Face ID, HTTPS est configuré **depuis l'application** :

1. Ouvrez QuickType Pro
2. Allez dans **Paramètres** (⚙️) → **HTTPS / Security**
3. Cliquez sur "**Configurer HTTPS**"
4. Terminé ! Accédez via `https://[PC_IP]:8000`

#### 📱 Installation du Certificat sur Téléphone

1. Dans les Paramètres, cliquez sur "**Exporter pour Téléphone**"
2. Envoyez le fichier `QuickType-RootCA.crt` à votre téléphone
3. Installez :
   - **iPhone** : Réglages → Général → VPN et gestion des appareils → Installer
   - **Android** : Ouvrir le fichier → Installer comme certificat CA

> 💡 **Note** : Le Root CA ne doit être installé qu'une seule fois. Il reste valide même lors du renouvellement des certificats.

#### 🔄 Changements d'Adresse IP

Si l'adresse IP de votre PC change :
- L'application affiche un avertissement dans les Paramètres
- Cliquez sur "**Renouveler le Certificat**" - l'application redémarre automatiquement
- Pas besoin de réinstaller le certificat du téléphone !

> 💡 **Conseil** : Définissez une IP statique dans les Paramètres Réseau Windows pour éviter définitivement ce problème.

---

## 🚀 Démarrage rapide

### Prérequis

- Python 3.8+
- Node.js 16+ (pour Electron)
- Windows 10/11

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/VOTRE_NOM_UTILISATEUR/klavye.git
cd klavye

# 2. Installer les dépendances Python
pip install -r requirements.txt

# 3. Démarrer le backend
python main.py
```

### 📱 Accès Mobile

1. Configurez d'abord les certificats HTTPS (voir section Sécurité ci-dessus)
2. Notez l'adresse IP affichée au démarrage de l'app
3. Accédez à `https://[PC_IP]:8000` depuis le navigateur de votre téléphone
4. Commencez à utiliser toutes les fonctionnalités !

### 🖥️ Configuration Electron (PC)

```bash
cd electron-app
npm install
npm start
```

---

## 🔧 Mode Développeur

### Backend
```bash
# Démarrer en mode debug
$env:LOG_LEVEL="DEBUG"
python main.py
```

### Electron
```bash
cd electron-app
npm run dev
```

### Build de Production
```bash
cd electron-app
npm run dist
```

---

## ⚙️ Configuration

| Variable d'environnement | Défaut | Description |
|--------------------------|--------|-------------|
| `LOG_LEVEL` | `INFO` | Niveau de log (DEBUG, INFO, WARNING, ERROR) |
| `CORS_ORIGINS` | `*` | Origines CORS autorisées |

### Exemple de Configuration

```powershell
# Autoriser l'accès uniquement depuis des IPs spécifiques
$env:CORS_ORIGINS="https://192.168.1.100:8000,https://192.168.1.101:8000"
python main.py
```

---

## 📦 Structure du Projet

```
📁 QuickType-Pro/
├── 📄 main.py                  # Point d'entrée du backend Python
├── 📄 requirements.txt         # Dépendances Python
├── 📁 app/                     # Modules backend
│   ├── __init__.py             # Init du paquet
│   ├── config.py               # Configuration & constantes
│   ├── security.py             # Rate limiting, validation
│   ├── middleware.py           # Middleware de sécurité HTTP
│   ├── routes.py               # Points d'API
│   ├── controllers.py          # Contrôle clavier/souris
│   ├── socket_events.py        # Événements WebSocket
│   ├── clipboard_manager.py    # Sync presse-papiers & partage fichiers
│   └── utils.py                # Fonctions utilitaires
├── 📁 static/                  # Interface web mobile (PWA)
│   ├── index.html              # UI Mobile
│   ├── manifest.json           # Manifeste PWA
│   └── sw.js                   # Service Worker
├── 📁 electron-app/            # Application de bureau
│   ├── main.js                 # Point d'entrée Electron
│   ├── preload.js              # Script de préchargement
│   ├── certificateManager.js   # Gestion certificats HTTPS
│   ├── 📁 modules/             # Architecture modulaire
│   │   ├── settings.js         # Gestion des paramètres
│   │   ├── backend.js          # Contrôle backend Python
│   │   ├── window.js           # Gestion fenêtre & barre système
│   │   ├── updater.js          # Système de mise à jour auto
│   │   ├── ipc-handlers.js     # Communication IPC
│   │   └── https-manager.js    # Handlers IPC HTTPS
│   ├── 📁 src/                 # Frontend React
│   └── 📁 public/              # Assets statiques
├── 📁 certs/                   # Certificats SSL (générés auto)
├── 📁 tests/                   # Tests unitaires
├── 📁 uploads/                 # Stockage fichiers partagés
└── 📁 .github/workflows/       # CI/CD (GitHub Actions)
```

---

## 🐛 Dépannage

<details>
<summary><b>Le backend ne démarre pas</b></summary>

```bash
pip install -r requirements.txt --upgrade
```
</details>

<details>
<summary><b>Impossible de se connecter</b></summary>

1. Ouvrez le port 8000 dans le pare-feu
2. Assurez-vous que le PC et le téléphone sont sur le même réseau
3. Désactivez temporairement l'antivirus
</details>

<details>
<summary><b>Presse-papiers ne fonctionne pas (Windows)</b></summary>

```bash
pip install pywin32 --upgrade
```
</details>

---

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

---

<div align="center">

Fait avec ❤️ en utilisant **QuickType Pro**

</div>
