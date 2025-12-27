<div align="center">

# ⌨️ QuickType Pro

**从手机控制您的电脑**

![Version](https://img.shields.io/badge/version-3.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![License](https://img.shields.io/badge/license-MIT-orange)

*PC端Electron桌面应用程序和移动设备Web界面*

---

### 🌍 语言 / Languages

[🇬🇧 English](README.md) | [🇹🇷 Türkçe](README.tr.md) | [🇩🇪 Deutsch](README.de.md) | [🇫🇷 Français](README.fr.md) | [🇪🇸 Español](README.es.md) | [🇨🇳 中文](README.zh.md)

---

</div>

## ✨ 功能特性

| 功能 | 📱 移动端 | 🖥️ PC (Electron) |
|------|:--------:|:----------------:|
| ⌨️ 远程键盘 | ✅ | ❌ |
| 🖱️ 触控板/鼠标 | ✅ | ❌ |
| 📋 剪贴板同步 | ✅ | ✅ |
| 📁 文件共享 | ✅ | ✅ |
| 🔄 系统托盘 | ❌ | ✅ |
| 🌓 深色/浅色模式 | ✅ | ✅ |
| 🌍 多语言支持 | ✅ | ✅ |

---

## 📸 截图

### 🖥️ Electron 桌面应用程序

<div align="center">
<img src="screenshots/electron-app.png" alt="Electron Desktop App" width="350"/>
</div>

### 📱 移动端Web界面

<div align="center">
<table>
<tr>
<td align="center"><img src="screenshots/mobile-keyboard.png" alt="键盘" width="200"/><br/><b>键盘</b></td>
<td align="center"><img src="screenshots/mobile-touchpad.png" alt="触控板" width="200"/><br/><b>触控板</b></td>
</tr>
<tr>
<td align="center"><img src="screenshots/mobile-keys.png" alt="特殊按键" width="200"/><br/><b>特殊按键</b></td>
<td align="center"><img src="screenshots/mobile-clipboard.png" alt="剪贴板" width="200"/><br/><b>剪贴板</b></td>
</tr>
</table>
</div>

---

## 🔒 安全性

本应用程序设计用于在本地网络中运行：

- ✅ **仅HTTPS** - HTTP连接已禁用
- ✅ **SSL/TLS** 加密所有流量
- ✅ HSTS（HTTP严格传输安全）
- ✅ WebAuthn/Face ID 就绪基础设施
- ✅ 速率限制（DDoS防护）
- ✅ 输入验证
- ✅ 路径遍历防护
- ✅ 连接日志记录
- ✅ 安全头部（CSP、XSS、COOP等）

> 🔐 **安全说明**：应用程序需要HTTPS证书才能运行。HTTP已完全禁用。

> ⚠️ **警告**：请仅在受信任的网络中使用此应用程序！

### 🔐 HTTPS设置（推荐）

对于安全连接和Face ID支持，HTTPS **从应用内** 配置：

1. 打开 QuickType Pro
2. 进入 **设置** (⚙️) → **HTTPS / Security**
3. 点击 "**设置HTTPS**"
4. 完成！通过 `https://[PC_IP]:8000` 访问

#### 📱 手机证书安装

1. 在设置中，点击 "**导出到手机**"
2. 将 `QuickType-RootCA.crt` 文件发送到您的手机
3. 安装：
   - **iPhone**：设置 → 通用 → VPN与设备管理 → 安装
   - **Android**：打开文件 → 安装为CA证书

> 💡 **注意**：Root CA只需安装一次。即使证书更新也保持有效。

#### 🔄 IP地址变更

如果您的PC IP地址发生变化：
- 应用将在设置中显示警告
- 点击 "**更新证书**" - 应用将自动重启
- 无需重新安装手机证书！

> 💡 **提示**：在Windows网络设置中设置静态IP以永久避免此问题。

---

## 🚀 快速开始

### 系统要求

- Python 3.8+
- Node.js 16+（用于Electron）
- Windows 10/11

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/您的用户名/klavye.git
cd klavye

# 2. 安装Python依赖
pip install -r requirements.txt

# 3. 启动后端
python main.py
```

### 📱 移动端访问

1. 首先设置HTTPS证书（请参阅上面的安全部分）
2. 记下应用启动时显示的IP地址
3. 在手机浏览器中访问 `https://[PC_IP]:8000`
4. 开始使用所有功能！！

### 🖥️ Electron（PC）设置

```bash
cd electron-app
npm install
npm start
```

---

## 🔧 开发者模式

### 后端
```bash
# 以调试模式启动
$env:LOG_LEVEL="DEBUG"
python main.py
```

### Electron
```bash
cd electron-app
npm run dev
```

### 生产构建
```bash
cd electron-app
npm run dist
```

---

## ⚙️ 配置

| 环境变量 | 默认值 | 描述 |
|----------|--------|------|
| `LOG_LEVEL` | `INFO` | 日志级别（DEBUG、INFO、WARNING、ERROR） |
| `CORS_ORIGINS` | `*` | 允许的CORS来源 |

### 配置示例

```powershell
# 仅允许特定IP访问
$env:CORS_ORIGINS="https://192.168.1.100:8000,https://192.168.1.101:8000"
python main.py
```

---

## 📦 项目结构

```
📁 QuickType-Pro/
├── 📄 main.py                  # Python后端入口点
├── 📄 requirements.txt         # Python依赖
├── 📁 app/                     # 后端模块
│   ├── __init__.py             # 包初始化
│   ├── config.py               # 配置和常量
│   ├── security.py             # 速率限制、验证
│   ├── middleware.py           # HTTP安全中间件
│   ├── routes.py               # API端点
│   ├── controllers.py          # 键盘/鼠标控制
│   ├── socket_events.py        # WebSocket事件
│   ├── clipboard_manager.py    # 剪贴板同步和文件共享
│   └── utils.py                # 辅助函数
├── 📁 static/                  # 移动端Web界面（PWA）
│   ├── index.html              # 移动端UI
│   ├── manifest.json           # PWA清单
│   └── sw.js                   # Service Worker
├── 📁 electron-app/            # 桌面应用程序
│   ├── main.js                 # Electron入口点
│   ├── preload.js              # 预加载脚本
│   ├── certificateManager.js   # HTTPS证书管理
│   ├── 📁 modules/             # 模块化架构
│   │   ├── settings.js         # 设置管理
│   │   ├── backend.js          # Python后端控制
│   │   ├── window.js           # 窗口和托盘管理
│   │   ├── updater.js          # 自动更新系统
│   │   ├── ipc-handlers.js     # IPC通信
│   │   └── https-manager.js    # HTTPS IPC处理程序
│   ├── 📁 src/                 # React前端
│   └── 📁 public/              # 静态资源
├── 📁 certs/                   # SSL证书（自动生成）
├── 📁 tests/                   # 单元测试
├── 📁 uploads/                 # 共享文件存储
└── 📁 .github/workflows/       # CI/CD（GitHub Actions）
```

---

## 🐛 故障排除

<details>
<summary><b>后端无法启动</b></summary>

```bash
pip install -r requirements.txt --upgrade
```
</details>

<details>
<summary><b>无法连接</b></summary>

1. 在防火墙中开放8000端口
2. 确保PC和手机在同一网络中
3. 临时禁用杀毒软件
</details>

<details>
<summary><b>剪贴板不工作（Windows）</b></summary>

```bash
pip install pywin32 --upgrade
```
</details>

---

## 📄 许可证

本项目基于 [MIT许可证](LICENSE) 授权。

---

<div align="center">

使用 **QuickType Pro** 用❤️制作

</div>
