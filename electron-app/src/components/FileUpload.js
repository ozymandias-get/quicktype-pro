import React, { useState, useRef, useCallback } from 'react';
import { t } from '../i18n/translations';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES_AT_ONCE = 5;

function FileUpload({ onUpload, showToast, language = 'en' }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleClick = () => {
        if (!isUploading) {
            fileInputRef.current?.click();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!isUploading) {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const validateAndProcessFiles = useCallback((fileList) => {
        const files = Array.from(fileList);
        const validFiles = [];

        // Maksimum dosya sayısı kontrolü
        if (files.length > MAX_FILES_AT_ONCE) {
            const msg = t('maxFilesAllowed', language).replace('{count}', MAX_FILES_AT_ONCE);
            showToast?.(msg, 'error');
        }

        files.slice(0, MAX_FILES_AT_ONCE).forEach(file => {
            // Boyut kontrolü
            if (file.size > MAX_FILE_SIZE) {
                const msg = t('fileTooLarge', language).replace('{filename}', file.name);
                showToast?.(msg, 'error');
                return;
            }

            // Boş dosya kontrolü
            if (file.size === 0) {
                const msg = t('fileIsEmpty', language).replace('{filename}', file.name);
                showToast?.(msg, 'error');
                return;
            }

            validFiles.push(file);
        });

        return validFiles;
    }, [showToast, language]);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        if (isUploading) return;

        const validFiles = validateAndProcessFiles(e.dataTransfer.files);
        if (validFiles.length > 0) {
            processUpload(validFiles);
        }
    };

    const handleFileChange = (e) => {
        if (isUploading) return;

        const validFiles = validateAndProcessFiles(e.target.files);
        if (validFiles.length > 0) {
            processUpload(validFiles);
        }
        e.target.value = '';
    };

    const processUpload = async (files) => {
        setIsUploading(true);
        setUploadProgress(0);

        // Dosyaları doğrudan parent'a gönder (File dizisi olarak)
        if (onUpload) {
            onUpload(files);
        }

        setIsUploading(false);
        setUploadProgress(0);
    };

    return (
        <div className="glass-panel file-upload-area">
            <div
                className={`file-drop-zone ${isDragOver ? 'dragover' : ''} ${isUploading ? 'uploading' : ''}`}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {isUploading ? (
                    <>
                        <div className="upload-spinner"></div>
                        <div className="file-drop-text">{t('uploadingProgress', language).replace('{progress}', uploadProgress)}</div>
                        <div className="upload-progress-bar">
                            <div
                                className="upload-progress-fill"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="file-drop-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>
                        <div className="file-drop-text">{t('tapToUploadFile', language)}</div>
                        <div className="file-drop-hint">{t('imagesPdfEtc', language)}</div>
                    </>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                disabled={isUploading}
                style={{ display: 'none' }}
            />
        </div>
    );
}

export default FileUpload;
