import { useState, useEffect, useCallback } from 'react';
import { t } from '../i18n/translations';
import { APP_CONSTANTS } from '../constants';

export const useAutoUpdate = (language) => {
    const [appVersion, setAppVersion] = useState('');
    const [updateStatus, setUpdateStatus] = useState(APP_CONSTANTS.UPDATE_STATUS.IDLE); // idle, checking, available, downloading, ready, error, up-to-date
    const [updateProgress, setUpdateProgress] = useState(0);
    const [updateInfo, setUpdateInfo] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    // Initial version check
    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.getAppVersion?.().then(version => {
                setAppVersion(version);
            });
        }
    }, []);

    // Event listeners
    useEffect(() => {
        if (!window.electronAPI) return;

        const cleanupFns = [];

        if (window.electronAPI.onUpdateChecking) {
            cleanupFns.push(window.electronAPI.onUpdateChecking(() => {
                setUpdateStatus(APP_CONSTANTS.UPDATE_STATUS.CHECKING);
                setUpdateError(null);
            }));
        }

        if (window.electronAPI.onUpdateAvailable) {
            cleanupFns.push(window.electronAPI.onUpdateAvailable((event, info) => {
                setUpdateStatus(APP_CONSTANTS.UPDATE_STATUS.AVAILABLE);
                setUpdateInfo(info);
            }));
        }

        if (window.electronAPI.onUpdateNotAvailable) {
            cleanupFns.push(window.electronAPI.onUpdateNotAvailable(() => {
                setUpdateStatus(APP_CONSTANTS.UPDATE_STATUS.UP_TO_DATE);
            }));
        }

        if (window.electronAPI.onUpdateProgress) {
            cleanupFns.push(window.electronAPI.onUpdateProgress((event, percent) => {
                setUpdateStatus(APP_CONSTANTS.UPDATE_STATUS.DOWNLOADING);
                setUpdateProgress(percent);
            }));
        }

        if (window.electronAPI.onUpdateDownloaded) {
            cleanupFns.push(window.electronAPI.onUpdateDownloaded((event, info) => {
                setUpdateStatus(APP_CONSTANTS.UPDATE_STATUS.READY);
                setUpdateInfo(info);
            }));
        }

        if (window.electronAPI.onUpdateError) {
            cleanupFns.push(window.electronAPI.onUpdateError((event, error) => {
                setUpdateStatus(APP_CONSTANTS.UPDATE_STATUS.ERROR);
                setUpdateError(error?.message || 'Unknown error');
            }));
        }

        return () => {
            cleanupFns.forEach(fn => fn && fn());
        };
    }, []);

    const checkForUpdates = useCallback(async () => {
        if (!window.electronAPI?.checkForUpdates) {
            setUpdateStatus(APP_CONSTANTS.UPDATE_STATUS.ERROR);
            setUpdateError(t('devModeUpdate', language));
            return;
        }

        setUpdateStatus(APP_CONSTANTS.UPDATE_STATUS.CHECKING);
        setUpdateError(null);

        try {
            const result = await window.electronAPI.checkForUpdates();
            if (result.status === APP_CONSTANTS.UPDATE_STATUS.DEV_MODE) {
                setUpdateStatus(APP_CONSTANTS.UPDATE_STATUS.ERROR);
                setUpdateError(t('devModeUpdate', language));
            } else if (result.status === APP_CONSTANTS.UPDATE_STATUS.ERROR) {
                setUpdateStatus(APP_CONSTANTS.UPDATE_STATUS.ERROR);
                setUpdateError(result.message);
            }
        } catch (error) {
            setUpdateStatus(APP_CONSTANTS.UPDATE_STATUS.ERROR);
            setUpdateError(error.message);
        }
    }, [language]);

    const installUpdate = useCallback(() => {
        if (window.electronAPI?.installUpdate) {
            window.electronAPI.installUpdate();
        }
    }, []);

    const getUpdateStatusText = () => {
        switch (updateStatus) {
            case APP_CONSTANTS.UPDATE_STATUS.CHECKING:
                return t('checking', language);
            case APP_CONSTANTS.UPDATE_STATUS.AVAILABLE:
                return t('updateAvailable', language);
            case APP_CONSTANTS.UPDATE_STATUS.DOWNLOADING:
                return `${t('downloading', language)} ${updateProgress}%`;
            case APP_CONSTANTS.UPDATE_STATUS.READY:
                return t('readyToInstall', language);
            case APP_CONSTANTS.UPDATE_STATUS.UP_TO_DATE:
                return t('upToDate', language);
            case APP_CONSTANTS.UPDATE_STATUS.ERROR:
                return t('updateError', language);
            default:
                return `v${appVersion}`;
        }
    };

    return {
        appVersion,
        updateStatus,
        updateProgress,
        updateInfo,
        updateError,
        checkForUpdates,
        installUpdate,
        getUpdateStatusText
    };
};
