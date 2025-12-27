/**
 * QuickType Pro - Ayarlar Yönetimi Modülü
 * Uygulama ayarlarının yüklenmesi, kaydedilmesi ve yönetimi
 */
const { app } = require('electron');
const fs = require('fs');
const path = require('path');

// Ayarlar dosyası yolu - lazy evaluation
let _settingsPath = null;
function getSettingsPath() {
    if (!_settingsPath) {
        _settingsPath = path.join(app.getPath('userData'), 'settings.json');
    }
    return _settingsPath;
}

// Varsayılan ayarlar
const DEFAULT_SETTINGS = {
    autoLaunch: true,
    startMinimized: true,
    language: 'en',
    theme: 'dark'
};

// Desteklenen değerler
const SUPPORTED_LANGUAGES = ['en', 'tr', 'de', 'fr', 'es', 'zh'];
const SUPPORTED_THEMES = ['dark', 'light', 'system'];

/**
 * Ayarları yükle
 * @returns {Object} Ayarlar objesi
 */
function loadSettings() {
    try {
        if (fs.existsSync(getSettingsPath())) {
            const data = fs.readFileSync(getSettingsPath(), 'utf8');
            return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
        }
    } catch (e) {
        console.error('Ayarlar yüklenemedi:', e.message);
    }
    return { ...DEFAULT_SETTINGS };
}

/**
 * Ayarları kaydet
 * @param {Object} settings - Kaydedilecek ayarlar
 */
function saveSettings(settings) {
    try {
        fs.writeFileSync(getSettingsPath(), JSON.stringify(settings, null, 2));
    } catch (e) {
        console.error('Ayarlar kaydedilemedi:', e.message);
    }
}

/**
 * Auto-launch durumunu güncelle
 * @param {boolean} enable - Aktif/Pasif
 */
function setAutoLaunch(enable) {
    app.setLoginItemSettings({
        openAtLogin: enable,
        path: app.getPath('exe'),
        args: ['--hidden']
    });

    const settings = loadSettings();
    settings.autoLaunch = enable;
    saveSettings(settings);
    console.log(`🚀 Başlangıçta çalıştır: ${enable ? 'Aktif' : 'Pasif'}`);
}

/**
 * Auto-launch durumunu kontrol et
 * @returns {boolean}
 */
function isAutoLaunchEnabled() {
    const settings = loadSettings();
    return settings.autoLaunch !== false;
}

/**
 * Gizli başlat ayarını güncelle
 * @param {boolean} enable - Aktif/Pasif
 */
function setStartMinimized(enable) {
    const settings = loadSettings();
    settings.startMinimized = enable;
    saveSettings(settings);
    console.log(`🔇 Arka planda başlat: ${enable ? 'Aktif' : 'Pasif'}`);
}

/**
 * Gizli başlat durumunu kontrol et
 * @returns {boolean}
 */
function isStartMinimizedEnabled() {
    const settings = loadSettings();
    return settings.startMinimized !== false;
}

/**
 * Dil ayarını kaydet
 * @param {string} language - Dil kodu
 * @returns {boolean} Başarılı mı
 */
function setLanguage(language) {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
        console.warn('Desteklenmeyen dil:', language);
        return false;
    }

    const settings = loadSettings();
    settings.language = language;
    saveSettings(settings);
    console.log(`🌐 Dil ayarlandı: ${language}`);
    return true;
}

/**
 * Kayıtlı dili getir
 * @returns {string}
 */
function getLanguage() {
    const settings = loadSettings();
    return settings.language || 'en';
}

/**
 * Tema ayarını kaydet
 * @param {string} theme - Tema adı
 * @returns {boolean} Başarılı mı
 */
function setTheme(theme) {
    if (!SUPPORTED_THEMES.includes(theme)) {
        console.warn('Desteklenmeyen tema:', theme);
        return false;
    }

    const settings = loadSettings();
    settings.theme = theme;
    saveSettings(settings);
    console.log(`🎨 Tema ayarlandı: ${theme}`);
    return true;
}

/**
 * Kayıtlı temayı getir
 * @returns {string}
 */
function getTheme() {
    const settings = loadSettings();
    return settings.theme || 'dark';
}

module.exports = {
    loadSettings,
    saveSettings,
    setAutoLaunch,
    isAutoLaunchEnabled,
    setStartMinimized,
    isStartMinimizedEnabled,
    setLanguage,
    getLanguage,
    setTheme,
    getTheme,
    SUPPORTED_LANGUAGES,
    SUPPORTED_THEMES
};
