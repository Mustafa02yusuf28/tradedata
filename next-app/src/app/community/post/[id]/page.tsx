'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('free');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        }
      } catch {
        setIsAuthenticated(false);
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

        setPost(data.post);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderContent = (content: BlogPost['content']) => {
    return content.map((item, index) => {
      switch (item.type) {
        case 'paragraph':
          return (
            <div key={index} className="blog-post-paragraph-container">
              {item.title && (
                <h3 className="blog-post-paragraph-title">{item.title}</h3>
              )}
              <p 
                className="blog-post-paragraph"
                style={{
                  fontWeight: item.formatting?.bold ? 'bold' : 'normal',
                  fontStyle: item.formatting?.italic ? 'italic' : 'normal',
                  color: item.formatting?.color || 'inherit',
                  fontSize: item.formatting?.fontSize === 'small' ? '0.875rem' :
                           item.formatting?.fontSize === 'large' ? '1.125rem' :
                           item.formatting?.fontSize === 'xlarge' ? '1.25rem' : '1rem',
                  backgroundColor: item.formatting?.highlight ? 'rgba(255, 255, 0, 0.3)' : 'transparent',
                  padding: item.formatting?.highlight ? '2px 4px' : '0',
                  borderRadius: item.formatting?.highlight ? '3px' : '0',
                }}
              >
                {item.content}
              </p>
            </div>
          );
        
        case 'image':
          const imageUrl = item.imageUrl || item.content;
          return (
            <div key={index} className="blog-post-image-container">
              <img 
                src={imageUrl} 
                alt="Blog content"
                className="blog-post-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          );
        
        case 'link':
          return (
            <div key={index} className="blog-post-link-container">
              <a 
                href={item.content} 
                target="_blank" 
                rel="noopener noreferrer"
                className="blog-post-link"
              >
                {item.content}
              </a>
            </div>
          );
        
        default:
          return null;
      }
    });
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/blog/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete post');
      }

      // Redirect to community page after successful deletion
      router.push('/community');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const canEdit = isAuthenticated && (
    post?.authorId === currentUserEmail || userRole === 'admin'
  );

  const canDelete = isAuthenticated && (
    post?.authorId === currentUserEmail || userRole === 'admin'
  );

  if (loading) {
    return (
      <div className="blog-post-loading">
        <div className="blog-post-loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-error">
        <h1 className="blog-post-error-title">Post Not Found</h1>
        <p className="blog-post-error-message">{error || 'The post you are looking for does not exist.'}</p>
        <Link href="/community" className="blog-post-error-btn">
          Back to Community
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      <div className="blog-post-content">
        {/* Header */}
        <div className="blog-post-header">
          <Link href="/community" className="blog-post-back-btn">
            ← Back to Community
          </Link>
          
          <div className="blog-post-meta">
            <span className="blog-post-author">By {post.author}</span>
            <span className="blog-post-date">{formatDate(post.createdAt)}</span>
          </div>

          {/* Edit and Delete Buttons */}
          {(canEdit || canDelete) && (
            <div className="blog-post-actions">
              {canEdit && (
                <Link 
                  href={`/community/edit/${post._id}`} 
                  className="blog-post-edit-btn"
                >
                  Edit Post
                </Link>
              )}
              {canDelete && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="blog-post-delete-btn"
                >
                  Delete Post
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="blog-post-title">{post.title}</h1>

        {/* Description */}
        <p className="blog-post-description">{post.description}</p>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="blog-post-thumbnail">
            <img 
              src={post.thumbnail} 
              alt={post.title}
              className="blog-post-thumbnail-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="blog-post-body">
          {renderContent(post.content)}
        </div>

        {/* Footer */}
        <div className="blog-post-footer">
          <div className="blog-post-footer-meta">
            <span className="blog-post-footer-author">Written by {post.author}</span>
            <span className="blog-post-footer-date">
              Published on {formatDate(post.createdAt)}
            </span>
          </div>
          
          <Link href="/community" className="blog-post-footer-btn">
            Back to Community
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="blog-delete-modal-overlay">
          <div className="blog-delete-modal">
            <h3 className="blog-delete-modal-title">Delete Post</h3>
            <p className="blog-delete-modal-message">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="blog-delete-modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="blog-delete-modal-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="blog-delete-modal-confirm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 