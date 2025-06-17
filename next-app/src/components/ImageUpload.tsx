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
}

export default function ImageUpload({
  imageUrl,
  onImageUrlChange,
  imageFile,
  onImageFileChange,
  placeholder = "Enter image URL or upload a file...",
  label = "Image",
  accept = "image/*"
}: ImageUploadProps) {
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageFileChange) {
      setIsUploading(true);
      setUploadError('');

      try {
        // Upload file to server
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        // Update the image URL with the uploaded file URL
        if (onImageUrlChange) {
          onImageUrlChange(data.url);
        }
        setPreviewUrl(data.url);
        
        // Clear the file reference since we now have a URL
        onImageFileChange(null);
        
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'Upload failed');
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } finally {
        setIsUploading(false);
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