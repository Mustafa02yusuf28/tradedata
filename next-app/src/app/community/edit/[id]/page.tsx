'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlogPost, BlogContent } from '@/lib/blog';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/ImageUpload';

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('free');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState<BlogContent[]>([]);
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'premium'>('public');
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    // Check authentication status and user role
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        if (res.ok) {
          setIsAuthenticated(true);
          const data = await res.json();
          setCurrentUserEmail(data.user.email || '');
          
          // Get user role from database
          const userRes = await fetch('/api/auth/user-role');
          if (userRes.ok) {
            const userData = await userRes.json();
            setUserRole(userData.role || 'free');
          }
        } else {
          setIsAuthenticated(false);
          router.push('/login');
        }
      } catch {
        setIsAuthenticated(false);
        router.push('/login');
      }
    };
    checkAuth();

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Post not found');
        }

        const fetchedPost = data.post;
        setPost(fetchedPost);
        
        // Populate form with existing data
        setTitle(fetchedPost.title);
        setDescription(fetchedPost.description);
        setContent(fetchedPost.content);
        setThumbnail(fetchedPost.thumbnail || '');
        setVisibility(fetchedPost.visibility || 'public');
        if (fetchedPost.keywords && Array.isArray(fetchedPost.keywords)) {
          setKeywords(fetchedPost.keywords.join(', '));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id, router]);

  // Check if user can edit this post
  const canEdit = isAuthenticated && post && (
    post.authorId === currentUserEmail || userRole === 'admin'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit) {
      setError('You do not have permission to edit this post.');
      return;
    }

    if (!title.trim() || !description.trim() || content.length === 0) {
      setError('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('content', JSON.stringify(content));
      formData.append('author', post!.author);
      formData.append('authorId', post!.authorId);
      formData.append('visibility', visibility);
      
      if (thumbnailFile) {
        formData.append('thumbnailFile', thumbnailFile);
      } else if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      if (keywords.trim()) {
        formData.append('keywords', keywords);
      }

      const response = await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update post');
      }

      // Redirect to the updated post
      router.push(`/community/post/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const addParagraph = () => {
    setContent([
      ...content,
      { type: 'paragraph', content: '', order: content.length, formatting: {}, title: '' }
    ]);
  };

  const addImage = () => {
    setContent([
      ...content,
      { type: 'image', content: '', order: content.length, imageUrl: '', imageFile: null }
    ]);
  };

  const addLink = () => {
    setContent([
      ...content,
      { type: 'link', content: '', order: content.length }
    ]);
  };

  const updateContentBlock = (index: number, updated: Partial<BlogContent>) => {
    setContent(content.map((item, i) => i === index ? { ...item, ...updated } : item));
  };

  const removeContentBlock = (index: number) => {
    if (content.length > 1) {
      const updated = content.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i }));
      setContent(updated);
    }
  };

  const moveContentBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === content.length - 1)) return;
    const updated = [...content];
    const target = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    updated.forEach((item, i) => item.order = i);
    setContent(updated);
  };

  // Handlers for image upload in content blocks
  const handleImageUrlChange = (index: number, url: string) => {
    updateContentBlock(index, { imageUrl: url, content: url, imageFile: null });
  };
  const handleImageFileChange = (index: number, file: File | null) => {
    if (file) {
      updateContentBlock(index, { imageFile: file, imageUrl: '', content: '' });
    } else {
      updateContentBlock(index, { imageFile: null });
    }
  };

  if (loading) {
    return (
      <div className="blog-create-loading">
        <p>Loading post...</p>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="blog-error">
        <h1 className="blog-create-title">Post Not Found</h1>
        <p>{error}</p>
        <Link href="/community" className="blog-cancel-btn">Back to Community</Link>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="blog-error">
        <h1 className="blog-create-title">Access Denied</h1>
        <p>You do not have permission to edit this post.</p>
        <Link href="/community" className="blog-cancel-btn">Back to Community</Link>
      </div>
    );
  }

  return (
    <div className="blog-create-container">
      <div className="blog-create-content">
        <div className="blog-create-header">
          <h1 className="blog-create-title">Edit Post</h1>
          <Link href="/community/drafts" className="blog-content-btn" style={{ marginLeft: 16 }}>
            My Drafts
          </Link>
          <p className="blog-create-subtitle">Update your trading insights for the community</p>
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
              onImageUrlChange={setThumbnail}
              imageFile={thumbnailFile}
              onImageFileChange={setThumbnailFile}
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
                <button type="button" onClick={addParagraph} className="blog-content-btn">Add Paragraph</button>
                <button type="button" onClick={addImage} className="blog-content-btn">Add Image</button>
                <button type="button" onClick={addLink} className="blog-content-btn">Add Link</button>
              </div>
            </div>
            <div className="blog-content-blocks">
              {content.map((item, index) => (
                <div key={index} className="blog-content-block">
                  <div className="blog-content-header">
                    <span className="blog-content-type">{item.type}</span>
                    <div className="blog-content-actions">
                      {index > 0 && (
                        <button type="button" onClick={() => moveContentBlock(index, 'up')} className="blog-content-action-btn" title="Move Up">↑</button>
                      )}
                      {index < content.length - 1 && (
                        <button type="button" onClick={() => moveContentBlock(index, 'down')} className="blog-content-action-btn" title="Move Down">↓</button>
                      )}
                      {content.length > 1 && (
                        <button type="button" onClick={() => removeContentBlock(index)} className="blog-content-action-btn blog-content-remove" title="Remove">×</button>
                      )}
                    </div>
                  </div>
                  {item.type === 'paragraph' && (
                    <RichTextEditor
                      value={item.content}
                      onChange={(value: string) => updateContentBlock(index, { content: value })}
                      title={item.title}
                      onTitleChange={(title: string) => updateContentBlock(index, { title })}
                      formatting={item.formatting}
                      onFormattingChange={(formatting: BlogContent['formatting']) => updateContentBlock(index, { formatting })}
                    />
                  )}
                  {item.type === 'image' && (
                    <ImageUpload
                      imageUrl={item.imageUrl || item.content}
                      onImageUrlChange={(url: string) => handleImageUrlChange(index, url)}
                      imageFile={item.imageFile}
                      onImageFileChange={(file: File | null) => handleImageFileChange(index, file)}
                      placeholder="Enter image URL or upload a file..."
                      label="Content Image"
                    />
                  )}
                  {item.type === 'link' && (
                    <input
                      type="url"
                      value={item.content}
                      onChange={(e) => updateContentBlock(index, { content: e.target.value })}
                      placeholder="Enter link URL..."
                      className="blog-content-input"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Error Message */}
          {error && <div className="blog-error">{error}</div>}
          {/* Submit Button */}
          <div className="blog-form-actions">
            <button type="button" onClick={() => router.back()} className="blog-cancel-btn" disabled={saving}>Cancel</button>
            <button type="submit" className="blog-submit-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 