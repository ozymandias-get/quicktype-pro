/**
 * QuickType Pro - Python Backend Yönetimi Modülü
 * Backend başlatma, durdurma ve durum kontrolü
 */
const { app } = require('electron');
const { spawn, exec } = require('child_process');
const https = require('https');
const path = require('path');

// Backend URL - Başlangıçta varsayılan, ama dinamik değişebilir
let currentBackendUrl = 'https://127.0.0.1:8000';

// Python process referansı
let pythonProcess = null;

/**
 * Backend URL'ini döndür
 * @returns {string}
 */
function getBackendUrl() {
    return currentBackendUrl;
}

/**
 * Backend'in hazır olup olmadığını kontrol et
 * @returns {Promise<boolean>}
 */
function checkBackendReady() {
    return new Promise(async (resolve) => {
        // Önce HTTPS dene
        const tryHttps = await checkUrl('https://127.0.0.1:8000/api/status');
        if (tryHttps) {
            currentBackendUrl = 'https://127.0.0.1:8000';
            resolve(true);
            return;
        }

        // Olmazsa HTTP dene (Setup Mode)
        const tryHttp = await checkUrl('http://127.0.0.1:8000/api/status');
        if (tryHttp) {
            currentBackendUrl = 'http://127.0.0.1:8000';
            console.log('⚠️ Backend HTTP modunda çalışıyor (Setup Mode)');
            resolve(true);
            return;
        }

        resolve(false);
    });
}

/**
 * URL kontrolü yapan yardımcı fonksiyon
 */
function checkUrl(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : require('http');
        const req = client.get(url, { rejectUnauthorized: false }, (res) => {
            // Veriyi tüket ki socket asılı kalmasın
            res.resume();
            resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(1000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

/**
 * Backend hazır olana kadar bekle
 * @param {number} maxAttempts - Maksimum deneme sayısı
 * @param {number} interval - Deneme aralığı (ms)
 * @returns {Promise<boolean>}
 */
async function waitForBackend(maxAttempts = 30, interval = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
        const ready = await checkBackendReady();
        if (ready) return true;
        await new Promise(r => setTimeout(r, interval));
    }
    return false;
}

/**
 * Python backend'i başlat
 * @returns {Promise<void>}
 */
function startPythonBackend() {
    return new Promise((resolve, reject) => {
        const isPackaged = app.isPackaged;

        let backendPath;
        let args = [];
        let cwd;

        if (isPackaged) {
            backendPath = path.join(process.resourcesPath, 'backend', 'quicktype-backend.exe');
            cwd = path.dirname(backendPath);
            // Pass certs dir in userData
            const certsDir = path.join(app.getPath('userData'), 'certs');
            args = ['--certs-dir', certsDir];
        } else {
            backendPath = 'python';
            // Also pass certs dir in dev mode standardizing on userData
            const certsDir = path.join(app.getPath('userData'), 'certs');
            args = ['main.py', '--certs-dir', certsDir];
            cwd = path.join(__dirname, '..', '..');
        }

        pythonProcess = spawn(backendPath, args, {
            cwd: cwd,
            shell: !isPackaged,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: process.env,
            detached: false
        });

        // Pipe stdout/stderr to log file in production
        if (isPackaged && pythonProcess.stdout) {
            const fs = require('fs');
            const logPath = path.join(app.getPath('userData'), 'backend.log');
            const stream = fs.createWriteStream(logPath, { flags: 'a' });
            pythonProcess.stdout.pipe(stream);
            pythonProcess.stderr.pipe(stream);
        }

        pythonProcess.on('error', (error) => reject(error));
        pythonProcess.on('close', () => { pythonProcess = null; });

        setTimeout(() => resolve(), 3000);
    });
}

/**
 * Python backend'i kapat
 */
function stopPythonBackend() {
    // Spawn edilen process'i kapat
    if (pythonProcess) {
        try {
            pythonProcess.kill('SIGTERM');
        } catch (e) { }
    }

    // Windows'ta port 8000'deki process'i kapat
    if (process.platform === 'win32') {
        exec('for /f "tokens=5" %a in (\'netstat -aon ^| findstr :8000 ^| findstr LISTENING\') do taskkill /f /pid %a',
            { shell: true },
            (err) => {
                if (err) {
                    console.log('Port 8000 üzerinde çalışan process bulunamadı veya kapatıldı');
                }
            }
        );
    } else {
        exec('pkill -f "python main.py"');
    }

    pythonProcess = null;
}

/**
 * Python process referansını döndür
 * @returns {ChildProcess|null}
 */
function getPythonProcess() {
    return pythonProcess;
}

/**
 * Python process'i öldür
 */
function killPythonProcess() {
    if (pythonProcess) {
        pythonProcess.kill();
        pythonProcess = null;
    }
}

module.exports = {
    getBackendUrl,
    checkBackendReady,
    waitForBackend,
    startPythonBackend,
    stopPythonBackend,
    getPythonProcess,
    killPythonProcess
};
