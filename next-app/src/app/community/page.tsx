'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';
import AuthModal from '@/components/AuthModal';
import Head from 'next/head';

export default function CommunityPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // SEO metadata
  const pageTitle = "Trading Community - Share Insights & Learn Strategies";
  const pageDescription = "Join our trading community to share insights, learn strategies, and connect with fellow traders. Access expert analysis, trading tips, and market discussions.";
  const pageKeywords = "trading community, trading insights, trading strategies, market analysis, trading tips, trading education, stock market discussion";

  useEffect(() => {
    // Fetch all data in parallel
    const fetchAllData = async () => {
      try {
        // Fetch user role (includes auth check) and posts in parallel
        const [userRes, postsRes] = await Promise.all([
          fetch('/api/auth/user-role'),
          fetch('/api/blog')
        ]);

        // Handle user authentication and role
        if (userRes.ok) {
          const userData = await userRes.json();
          setIsAuthenticated(userData.authenticated || false);
          setUserRole(userData.role || 'free');
        } else {
          setIsAuthenticated(false);
          setUserRole('free');
        }

        // Handle posts
        if (postsRes.ok) {
          const data = await postsRes.json();
          if (data.posts) {
            // Ensure dates are properly converted to Date objects
            const processedPosts = data.posts.map((post: BlogPost) => ({
              ...post,
              createdAt: new Date(post.createdAt),
              updatedAt: new Date(post.updatedAt)
            }));
            setPosts(processedPosts);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsAuthenticated(false);
        setUserRole('free');
      } finally {
        setIsLoading(false);
        setIsAuthLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/blog/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.posts) {
        // Ensure dates are properly converted to Date objects for search results
        const processedPosts = data.posts.map((post: BlogPost) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt)
        }));
        setSearchResults(processedPosts);
      }
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const displayPosts = searchResults.length > 0 ? searchResults : posts;
  const featuredPost = displayPosts[0];
  const secondaryPosts = displayPosts.slice(1, 3);
  // Fix recent posts logic - show all posts in sidebar for better visibility
  const sidebarPosts = displayPosts; // Show all posts in sidebar

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDefaultThumbnail = (title: string) => {
    // Generate a simple color based on title for default thumbnails
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const colorIndex = title.length % colors.length;
    return `https://via.placeholder.com/400x200/${colors[colorIndex].slice(1)}/ffffff?text=${encodeURIComponent(title.slice(0, 20))}`;
  };

  // Helper function to safely convert dates to ISO string
  const toISOString = (date: string | Date) => {
    try {
      return new Date(date).toISOString();
    } catch (error) {
      console.error('Error converting date to ISO string:', error);
      return new Date().toISOString(); // fallback to current date
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={pageKeywords} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://fluxtrade.vercel.app/community" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDescription} />
          <link rel="canonical" href="https://fluxtrade.vercel.app/community" />
        </Head>
        <div className="community-container">
          <div className="community-content">
            <div className="community-header">
              <h1 className="community-title">Trading Community</h1>
              <p className="community-subtitle">Share insights, learn strategies, and connect with fellow traders</p>
              <div className="community-loading">
                <div className="community-loading-spinner"></div>
                <p>Loading community posts...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fluxtrade.vercel.app/community" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link rel="canonical" href="https://fluxtrade.vercel.app/community" />
        
        {/* Structured Data for Community Page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Trading Community",
              "description": pageDescription,
              "url": "https://fluxtrade.vercel.app/community",
              "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": displayPosts.length,
                "itemListElement": displayPosts.slice(0, 10).map((post, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Article",
                    "name": post.title,
                    "description": post.description,
                    "url": `https://fluxtrade.vercel.app/community/post/${post._id.toString()}`,
                    "author": {
                      "@type": "Person",
                      "name": post.author
                    },
                    "datePublished": toISOString(post.createdAt),
                    "dateModified": toISOString(post.updatedAt)
                  }
                }))
              }
            })
          }}
        />
      </Head>
      <div className="community-container">
        <div className="community-content">
          {/* Header Section */}
          <div className="community-header">
            <h1 className="community-title">Trading Community</h1>
            <p className="community-subtitle">Share insights, learn strategies, and connect with fellow traders</p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="community-search-form">
              <div className="community-search-container">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for trading insights..."
                  className="community-search-input"
                />
                <button type="submit" className="community-search-btn">
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
                {searchResults.length > 0 && (
                  <button type="button" onClick={clearSearch} className="community-clear-btn">
                    Clear
                  </button>
                )}
              </div>
            </form>

            {/* Create Post Button - Only show after auth is loaded */}
            {!isAuthLoading && isAuthenticated && (userRole === 'premium' || userRole === 'admin') && (
              <Link href="/community/create" className="community-create-btn">
                Create New Post
              </Link>
            )}

            {!isAuthLoading && isAuthenticated && userRole === 'free' && (
              <div className="community-upgrade-notice">
                <p>Upgrade to Premium to create posts and share your insights!</p>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="community-grid">
            {/* Main Content Area */}
            <div className="community-main">
              {/* Featured Post */}
              {featuredPost && (
                <div className="community-featured">
                  <h2 className="community-section-title">Featured Post</h2>
                  <div className="community-featured-card">
                    <div className="community-featured-image">
                      <img 
                        src={featuredPost.thumbnail || getDefaultThumbnail(featuredPost.title)} 
                        alt={featuredPost.title}
                        className="community-featured-img"
                      />
                    </div>
                    <div className="community-featured-content">
                      <h3 className="community-featured-title">{featuredPost.title}</h3>
                      <p className="community-featured-description">{featuredPost.description}</p>
                      <div className="community-featured-meta">
                        <span className="community-author">By {featuredPost.author}</span>
                        <span className="community-date">{formatDate(featuredPost.createdAt)}</span>
                      </div>
                      <Link href={`/community/post/${featuredPost._id.toString()}`} className="community-read-more">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Secondary Posts */}
              {secondaryPosts.length > 0 && (
                <div className="community-secondary">
                  <h2 className="community-section-title">Recent Posts</h2>
                  <div className="community-secondary-grid">
                    {secondaryPosts.map((post) => (
                      <div key={post._id.toString()} className="community-secondary-card">
                        <div className="community-secondary-image">
                          <img 
                            src={post.thumbnail || getDefaultThumbnail(post.title)} 
                            alt={post.title}
                            className="community-secondary-img"
                          />
                        </div>
                        <div className="community-secondary-content">
                          <h3 className="community-secondary-title">{post.title}</h3>
                          <p className="community-secondary-description">{post.description}</p>
                          <div className="community-secondary-meta">
                            <span className="community-author">By {post.author}</span>
                            <span className="community-date">{formatDate(post.createdAt)}</span>
                          </div>
                          <Link href={`/community/post/${post._id.toString()}`} className="community-read-more">
                            Read More
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="community-search-results">
                  <h2 className="community-section-title">
                    Search Results for &quot;{searchQuery}&quot; ({searchResults.length} posts)
                  </h2>
                  <div className="community-search-grid">
                    {searchResults.map((post) => (
                      <div key={post._id.toString()} className="community-search-card">
                        <div className="community-search-image">
                          <img 
                            src={post.thumbnail || getDefaultThumbnail(post.title)} 
                            alt={post.title}
                            className="community-search-img"
                          />
                        </div>
                        <div className="community-search-content">
                          <h3 className="community-search-title">{post.title}</h3>
                          <p className="community-search-description">{post.description}</p>
                          <div className="community-search-meta">
                            <span className="community-author">By {post.author}</span>
                            <span className="community-date">{formatDate(post.createdAt)}</span>
                          </div>
                          <Link href={`/community/post/${post._id.toString()}`} className="community-read-more">
                            Read More
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Posts Message */}
              {displayPosts.length === 0 && !isSearching && (
                <div className="community-empty">
                  <h2 className="community-section-title">
                    {searchResults.length === 0 && searchQuery ? 'No posts found' : 'No posts yet'}
                  </h2>
                  <p className="community-empty-text">
                    {searchResults.length === 0 && searchQuery 
                      ? 'Try adjusting your search terms or browse all posts.'
                      : 'Be the first to share your trading insights!'
                    }
                  </p>
                  {!isAuthLoading && isAuthenticated && (userRole === 'premium' || userRole === 'admin') && (
                    <Link href="/community/create" className="community-create-btn">
                      Create First Post
                    </Link>
                  )}
                  {!isAuthLoading && isAuthenticated && userRole === 'free' && (
                    <div className="community-upgrade-notice">
                      <p>Upgrade to Premium to create the first post!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="community-sidebar">
              <div className="community-sidebar-section">
                <h3 className="community-sidebar-title">Recent Posts</h3>
                <div className="community-sidebar-posts">
                  {sidebarPosts.length > 0 ? (
                    sidebarPosts.map((post) => (
                      <div key={post._id.toString()} className="community-sidebar-post">
                        <div className="community-sidebar-image">
                          <img 
                            src={post.thumbnail || getDefaultThumbnail(post.title)} 
                            alt={post.title}
                            className="community-sidebar-img"
                          />
                        </div>
                        <div className="community-sidebar-content">
                          <h4 className="community-sidebar-post-title">{post.title}</h4>
                          <div className="community-sidebar-meta">
                            <span className="community-author">{post.author}</span>
                            <span className="community-date">{formatDate(post.createdAt)}</span>
                          </div>
                          <Link href={`/community/post/${post._id.toString()}`} className="community-sidebar-link">
                            Read More
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="community-sidebar-empty">No additional posts to show</p>
                  )}
                </div>
              </div>

              {!isAuthLoading && !isAuthenticated && (
                <div className="community-sidebar-section">
                  <h3 className="community-sidebar-title">Join the Community</h3>
                  <p className="community-sidebar-text">
                    Sign in to create posts, share insights, and connect with fellow traders.
                  </p>
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="community-sidebar-btn"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {!isAuthLoading && isAuthenticated && userRole === 'free' && (
                <div className="community-sidebar-section">
                  <h3 className="community-sidebar-title">Upgrade to Premium</h3>
                  <p className="community-sidebar-text">
                    Get access to create posts, share your trading insights, and engage with the community.
                  </p>
                  <div className="community-sidebar-btn">
                    Contact Admin
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthenticated(true);
          setIsAuthModalOpen(false);
          // Refresh the page to update user role and permissions
          window.location.reload();
        }}
      />
    </>
  );
} 