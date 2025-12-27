/**
 * QuickType Pro - Python Backend Yönetimi Modülü
 * Backend başlatma, durdurma ve durum kontrolü
 */
const { app } = require('electron');
const { spawn, exec } = require('child_process');
const https = require('https');
const path = require('path');

// Backend URL - SADECE HTTPS
const BACKEND_URL = 'https://127.0.0.1:8000';

// Python process referansı
let pythonProcess = null;

/**
 * Backend URL'ini döndür
 * @returns {string}
 */
function getBackendUrl() {
    return BACKEND_URL;
}

/**
 * Backend'in hazır olup olmadığını kontrol et
 * @returns {Promise<boolean>}
 */
function checkBackendReady() {
    return new Promise((resolve) => {
        const req = https.get(`${BACKEND_URL}/api/status`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.status === 'online');
                } catch (e) {
                    resolve(res.statusCode === 200);
                }
            });
        });
        req.on('error', () => resolve(false));
        req.setTimeout(2000, () => {
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
async function waitForBackend(maxAttempts = 30, interval = 500) {
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
        } else {
            backendPath = 'python';
            args = ['main.py'];
            cwd = path.join(__dirname, '..', '..');
        }

        pythonProcess = spawn(backendPath, args, {
            cwd: cwd,
            shell: !isPackaged,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: process.env,
            detached: false
        });

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
    BACKEND_URL,
    getBackendUrl,
    checkBackendReady,
    waitForBackend,
    startPythonBackend,
    stopPythonBackend,
    getPythonProcess,
    killPythonProcess
};
