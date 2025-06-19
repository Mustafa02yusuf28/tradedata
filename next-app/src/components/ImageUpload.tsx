'use client';

import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  imageUrl?: string;
  onImageUrlChange?: (url: string) => void;
  imageFile?: File | null;
  onImageFileChange?: (file: File | null) => void;
  placeholder?: string;
  label?: string;
  accept?: string;
  onUploadStatusChange?: (status: 'idle' | 'uploading' | 'done' | 'error') => void;
}

export default function ImageUpload({
  imageUrl,
  onImageUrlChange,
  imageFile,
  onImageFileChange,
  placeholder = "Enter image URL or upload a file...",
  label = "Image",
  accept = "image/*",
  onUploadStatusChange
}: ImageUploadProps) {
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageFileChange) {
      setIsUploading(true);
      setUploadError('');
      setUploadProgress(0);
      if (onUploadStatusChange) onUploadStatusChange('uploading');
      try {
        // Upload file to server with progress
        const formData = new FormData();
        formData.append('file', file);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onload = () => {
          setIsUploading(false);
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            if (onImageUrlChange) onImageUrlChange(data.url);
            setPreviewUrl(data.url);
            if (onUploadStatusChange) onUploadStatusChange('done');
            onImageFileChange(null);
          } else {
            setUploadError('Upload failed');
            if (onUploadStatusChange) onUploadStatusChange('error');
          }
        };
        xhr.onerror = () => {
          setIsUploading(false);
          setUploadError('Upload failed');
          if (onUploadStatusChange) onUploadStatusChange('error');
        };
        xhr.send(formData);
      } catch (error) {
        setIsUploading(false);
        setUploadError(error instanceof Error ? error.message : 'Upload failed');
        if (onUploadStatusChange) onUploadStatusChange('error');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlChange = (url: string) => {
    if (onImageUrlChange) {
      onImageUrlChange(url);
    }
    setPreviewUrl(url);
  };

  const clearImage = () => {
    if (onImageFileChange) onImageFileChange(null);
    if (onImageUrlChange) onImageUrlChange('');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCurrentImageUrl = () => {
    if (uploadMode === 'file' && imageFile) {
      return previewUrl;
    }
    return imageUrl || previewUrl;
  };

  return (
    <div className="image-upload">
      <div className="image-upload-header">
        <label className="image-upload-label">{label}</label>
        <div className="image-upload-mode-toggle">
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`image-upload-mode-btn ${uploadMode === 'url' ? 'active' : ''}`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('file')}
            className={`image-upload-mode-btn ${uploadMode === 'file' ? 'active' : ''}`}
          >
            Upload File
          </button>
        </div>
      </div>

      {uploadMode === 'url' ? (
        <div className="image-upload-url">
          <input
            type="url"
            value={imageUrl ?? ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            className="image-upload-input"
          />
        </div>
      ) : (
        <div className="image-upload-file">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="image-upload-file-input"
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="image-upload-file-btn"
            disabled={isUploading}
          >
            {isUploading ? '📤 Uploading...' : '📁 Choose File'}
          </button>
          {imageFile && (
            <span className="image-upload-file-name">
              {imageFile.name}
            </span>
          )}
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="image-upload-error">
          {uploadError}
        </div>
      )}

      {/* Preview */}
      {getCurrentImageUrl() && (
        <div className="image-upload-preview">
          <img
            src={getCurrentImageUrl()}
            alt="Preview"
            className="image-upload-preview-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={clearImage}
            className="image-upload-clear-btn"
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {isUploading && (
        <div className="image-upload-progress">
          <div className="image-upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
          <span className="image-upload-progress-text">{uploadProgress}%</span>
        </div>
      )}

      {/* Help text */}
      <div className="image-upload-help">
        {uploadMode === 'url' ? (
          <p>Enter a valid image URL (e.g., https://example.com/image.jpg)</p>
        ) : (
          <p>Supported formats: JPG, PNG, GIF, WebP (max 5MB)</p>
        )}
      </div>
    </div>
  );
} 