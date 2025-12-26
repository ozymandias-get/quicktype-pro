<div align="center">

# ⌨️ QuickType Pro

**Contrôlez votre ordinateur depuis votre téléphone**

![Version](https://img.shields.io/badge/version-2.1--secure-blue)
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

- ✅ Limitation de débit (protection DDoS)
- ✅ Validation des entrées
- ✅ Protection contre le path traversal
- ✅ Journalisation des connexions
- ✅ En-têtes de sécurité (CSP, XSS, etc.)

> ⚠️ **Avertissement** : N'utilisez cette application que sur des réseaux de confiance !

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

1. Notez l'adresse IP affichée dans le terminal
2. Accédez à `http://[PC_IP]:8000` depuis le navigateur de votre téléphone
3. Commencez à utiliser toutes les fonctionnalités !

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
$env:CORS_ORIGINS="http://192.168.1.100:8000,http://192.168.1.101:8000"
python main.py
```

---

## 📦 Structure du Projet

```
📁 QuickType-Pro/
├── 📄 main.py              # Point d'entrée du backend Python
├── 📄 requirements.txt     # Dépendances Python
├── 📁 app/                 # Modules backend
│   ├── config.py           # Configuration
│   ├── security.py         # Fonctions de sécurité
│   ├── middleware.py       # Middleware HTTP
│   ├── routes.py           # Points d'API
│   ├── controllers.py      # Contrôle clavier/souris
│   ├── socket_events.py    # Événements WebSocket
│   └── clipboard_manager.py # Gestion presse-papiers
├── 📁 static/              # Interface web mobile
├── 📁 electron-app/        # Application de bureau
└── 📁 uploads/             # Fichiers partagés
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
