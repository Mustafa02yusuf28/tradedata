'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogContent } from '@/lib/blog';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/ImageUpload';

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState<BlogContent[]>([
    { 
      type: 'paragraph', 
      content: '', 
      order: 0,
      formatting: {},
      title: ''
    }
  ]);
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'premium'>('public');
  const [keywords, setKeywords] = useState('');
  const [uploadStatuses, setUploadStatuses] = useState<Record<number, 'idle' | 'uploading' | 'done' | 'error'>>({});

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        if (!res.ok) {
          router.push('/dashboard');
          return;
        }
        setIsAuthenticated(true);
      } catch {
        router.push('/dashboard');
      }
    };
    checkAuth();
  }, [router]);

  const addParagraph = () => {
    const newOrder = content.length;
    setContent([...content, { 
      type: 'paragraph', 
      content: '', 
      order: newOrder,
      formatting: {},
      title: ''
    }]);
  };

  const addImage = () => {
    const newOrder = content.length;
    setContent([...content, { 
      type: 'image', 
      content: '', 
      order: newOrder,
      imageUrl: '',
      imageFile: null
    }]);
  };

  const addLink = () => {
    const newOrder = content.length;
    setContent([...content, { 
      type: 'link', 
      content: '', 
      order: newOrder
    }]);
  };

  const updateContent = (index: number, newContent: string) => {
    const updatedContent = [...content];
    updatedContent[index].content = newContent;
    setContent(updatedContent);
  };

  const updateContentTitle = (index: number, title: string) => {
    const updatedContent = [...content];
    updatedContent[index].title = title;
    setContent(updatedContent);
  };

  const updateContentFormatting = (index: number, formatting: BlogContent['formatting']) => {
    const updatedContent = [...content];
    updatedContent[index].formatting = formatting;
    setContent(updatedContent);
  };

  const updateImageFile = (index: number, file: File | null) => {
    const updatedContent = [...content];
    if (file) {
      updatedContent[index].imageFile = file;
      updatedContent[index].imageUrl = '';
    } else {
      updatedContent[index].imageFile = null;
    }
    setContent(updatedContent);
  };

  const updateImageUrl = (index: number, url: string) => {
    const updatedContent = [...content];
    updatedContent[index].imageUrl = url;
    updatedContent[index].imageFile = null;
    setContent(updatedContent);
  };

  const removeContent = (index: number) => {
    if (content.length > 1) {
      const updatedContent = content.filter((_, i) => i !== index);
      // Reorder the remaining content
      const reorderedContent = updatedContent.map((item, i) => ({
        ...item,
        order: i
      }));
      setContent(reorderedContent);
    }
  };

  const moveContent = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === content.length - 1)
    ) {
      return;
    }

    const updatedContent = [...content];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap the items
    [updatedContent[index], updatedContent[targetIndex]] = [updatedContent[targetIndex], updatedContent[index]];
    
    // Update the order
    updatedContent[index].order = index;
    updatedContent[targetIndex].order = targetIndex;
    
    setContent(updatedContent);
  };

  const handleUploadStatusChange = (index: number, status: 'idle' | 'uploading' | 'done' | 'error') => {
    setUploadStatuses(prev => ({ ...prev, [index]: status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    // Check if at least one content block has content
    const hasContent = content.some(item => item.content.trim());
    if (!hasContent) {
      setError('At least one content block is required');
      return;
    }

    // Add validation in handleSubmit
    const hasInvalidImage = content.some(
      item => item.type === 'image' && (!item.imageUrl || !item.imageUrl.trim())
    );
    if (hasInvalidImage) {
      setError('Please upload all images or remove empty image blocks before submitting.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create FormData for the blog post
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('content', JSON.stringify(
        content.filter(item =>
          (item.type === 'paragraph' && item.content.trim()) ||
          (item.type === 'image' && item.imageUrl && item.imageUrl.trim()) ||
          (item.type === 'link' && item.content.trim())
        )
      ));
      formData.append('visibility', visibility);
      
      if (keywords.trim()) {
        formData.append('keywords', keywords);
      }

      if (thumbnailFile) {
        formData.append('thumbnailFile', thumbnailFile);
      } else if (thumbnail.trim()) {
        formData.append('thumbnail', thumbnail.trim());
      }

      const response = await fetch('/api/blog', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      // Redirect to the created post
      router.push(`/community/post/${data.post._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContentBlock = (item: BlogContent, index: number) => {
    return (
      <div key={index} className="blog-content-block">
        <div className="blog-content-header">
          <span className="blog-content-type">{item.type}</span>
          <div className="blog-content-actions">
            {index > 0 && (
              <button
                type="button"
                onClick={() => moveContent(index, 'up')}
                className="blog-content-action-btn"
                title="Move Up"
              >
                ↑
              </button>
            )}
            {index < content.length - 1 && (
              <button
                type="button"
                onClick={() => moveContent(index, 'down')}
                className="blog-content-action-btn"
                title="Move Down"
              >
                ↓
              </button>
            )}
            {content.length > 1 && (
              <button
                type="button"
                onClick={() => removeContent(index)}
                className="blog-content-action-btn blog-content-remove"
                title="Remove"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        {item.type === 'paragraph' && (
          <RichTextEditor
            value={item.content}
            onChange={(value) => updateContent(index, value)}
            title={item.title}
            onTitleChange={(title) => updateContentTitle(index, title)}
            formatting={item.formatting}
            onFormattingChange={(formatting) => updateContentFormatting(index, formatting)}
          />
        )}
        
        {item.type === 'image' && (
          <ImageUpload
            imageUrl={item.imageUrl}
            onImageUrlChange={(url) => updateImageUrl(index, url)}
            imageFile={item.imageFile}
            onImageFileChange={(file) => updateImageFile(index, file)}
            placeholder="Enter image URL or upload a file..."
            label="Content Image"
            onUploadStatusChange={(status) => handleUploadStatusChange(index, status)}
          />
        )}
        
        {item.type === 'link' && (
          <input
            type="url"
            value={item.content ?? ''}
            onChange={(e) => updateContent(index, e.target.value)}
            placeholder="Enter link URL..."
            className="blog-content-input"
          />
        )}
      </div>
    );
  };

  const anyImageUploading = Object.values(uploadStatuses).includes('uploading');

  if (!isAuthenticated) {
    return (
      <div className="blog-create-loading">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="blog-create-container">
      <div className="blog-create-content">
        <div className="blog-create-header">
          <h1 className="blog-create-title">Create New Blog Post</h1>
          <p className="blog-create-subtitle">Share your trading insights with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="blog-create-form">
          {/* Title */}
          <div className="blog-form-group">
            <label htmlFor="title" className="blog-form-label">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title..."
              className="blog-form-input"
              required
            />
          </div>

          {/* Description */}
          <div className="blog-form-group">
            <label htmlFor="description" className="blog-form-label">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your post..."
              className="blog-form-textarea"
              rows={3}
              required
            />
          </div>

          {/* SEO Keywords */}
          <div className="blog-form-group">
            <label htmlFor="keywords" className="blog-form-label">SEO Keywords (optional)</label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Comma-separated keywords for SEO (e.g. trading, options, stocks)"
              className="blog-form-input"
            />
            <small style={{ color: '#b5eaea' }}>Separate keywords with commas. These will be used for search engine optimization.</small>
          </div>

          {/* Thumbnail */}
          <div className="blog-form-group">
            <ImageUpload
              imageUrl={thumbnail}
              onImageUrlChange={(url) => setThumbnail(url)}
              imageFile={thumbnailFile}
              onImageFileChange={(file) => setThumbnailFile(file)}
              placeholder="Enter thumbnail image URL or upload a file..."
              label="Thumbnail Image (Optional)"
            />
          </div>

          {/* Visibility Selector */}
          <div className="blog-form-group">
            <label htmlFor="visibility" className="blog-form-label">Visibility</label>
            <select
              id="visibility"
              value={visibility}
              onChange={e => setVisibility(e.target.value as 'public' | 'premium')}
              className="blog-form-input"
            >
              <option value="public">Public (Everyone can read)</option>
              <option value="premium">Premium (Premium users only)</option>
            </select>
          </div>

          {/* Content */}
          <div className="blog-form-group">
            <div className="blog-content-header">
              <label className="blog-form-label">Content *</label>
              <div className="blog-content-buttons">
                <button
                  type="button"
                  onClick={addParagraph}
                  className="blog-content-btn"
                >
                  Add Paragraph
                </button>
                <button
                  type="button"
                  onClick={addImage}
                  className="blog-content-btn"
                >
                  Add Image
                </button>
                <button
                  type="button"
                  onClick={addLink}
                  className="blog-content-btn"
                >
                  Add Link
                </button>
              </div>
            </div>
            
            <div className="blog-content-blocks">
              {content.map((item, index) => renderContentBlock(item, index))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="blog-error">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="blog-form-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="blog-cancel-btn"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="blog-submit-btn"
              disabled={isSubmitting || anyImageUploading}
            >
              {isSubmitting ? 'Creating Post...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 