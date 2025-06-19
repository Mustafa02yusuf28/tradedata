'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlogPost, BlogContent } from '@/lib/blog';
import Head from 'next/head';

const DEFAULT_TRENDING_KEYWORDS = [
  // High-Volume Primary Keywords
  'AI trading platform', 'crypto trading platform', 'best day trading platforms 2025', 'online trading platform', 'stock market analysis AI',
  // Market-Defining Keywords
  'Trump trading strategies', 'AI stock market analysis', 'interest rates trading platform',
  // Trading Dashboard
  'AI trading dashboard', 'real-time crypto trading dashboard', 'multi-asset trading platform dashboard', 'advanced algorithmic trading dashboard', 'professional day trading dashboard',
  'NIFTY 50 trading dashboard live', 'NSE BSE real-time dashboard', 'US stock market trading dashboard', 'S&P 500 NASDAQ trading interface', 'European stock market dashboard',
  'FTSE DAX CAC trading platform', 'Chinese stock market dashboard', 'Shanghai Shenzhen trading terminal',
  'Trump tariff trading dashboard', 'AI-powered market volatility tracker', 'crypto derivatives trading platform', 'high-frequency trading dashboard', 'institutional trading terminal 2025',
  // Stock Market Analysis
  'comprehensive stock market analysis', 'AI-powered market analysis tools', 'professional stock market research',
  'NIFTY stock analysis India', 'Indian equity market analysis', 'US stock market technical analysis', 'Wall Street stock research', 'European market analysis tools',
  'Euro STOXX analysis platform', 'Chinese stock market analysis', 'A-shares H-shares analysis',
  'geopolitical stock market analysis', 'war impact stock analysis', 'global crisis market analysis', 'inflation hedge stock analysis',
  // Portfolio Tracking
  'intelligent portfolio tracking', 'multi-asset portfolio tracker', 'automated portfolio management',
  'NIFTY portfolio tracking app', 'Indian mutual fund portfolio tracker', 'US portfolio tracking software', '401k IRA portfolio tracker', 'European portfolio management',
  'UCITS fund portfolio tracking', 'Chinese market portfolio tracker', 'Hong Kong portfolio management',
  'war-proof portfolio tracking', 'crisis-resistant investment tracker', 'global uncertainty portfolio monitor', 'safe haven portfolio tracker',
  // Trading Strategies
  'proven trading strategies', 'algorithmic trading strategies', 'professional trading methods',
  'NIFTY trading strategies India', 'NSE intraday trading strategies', 'US day trading strategies', 'swing trading strategies America', 'European market trading strategies',
  'forex EUR trading strategies', 'Chinese market trading tactics', 'A-share trading strategies',
  'war trading strategies', 'geopolitical trading methods', 'crisis trading strategies', 'global uncertainty trading tactics',
  // Market Analytics
  'advanced market analytics', 'real-time market data analytics', 'institutional market analytics',
  'NIFTY market analytics India', 'BSE NSE market intelligence', 'US market analytics platform', 'NYSE NASDAQ market data', 'European market analytics',
  'London Frankfurt market data', 'Chinese market analytics', 'mainland China market intelligence',
  'war impact market analytics', 'geopolitical market intelligence', 'global crisis market analytics', 'supply chain disruption analytics',
  // Financial Tools
  'professional financial tools', 'comprehensive trading tools', 'institutional financial software',
  'NIFTY financial tools India', 'Indian stock market tools', 'US financial analysis tools', 'American trading software', 'European financial tools',
  'EU market analysis tools', 'Chinese financial tools', 'Asia-Pacific trading tools',
  'war economy financial tools', 'crisis management financial tools', 'global uncertainty analysis tools', 'safe haven investment tools',
  // Investment Platform
  'global investment platform', 'multi-market investment platform', 'institutional investment platform',
  'NIFTY investment platform India', 'Indian equity investment app', 'US investment platform', 'American brokerage platform', 'European investment platform',
  'EU regulated investment app', 'Chinese investment platform', 'Asia investment platform',
  'war-time investment platform', 'crisis investment platform', 'global news investment alerts', 'geopolitical investment platform',
  // Trading Community
  'global trading community', 'professional traders network', 'social trading community',
  'NIFTY traders community India', 'Indian stock traders forum', 'US trading community', 'American day traders network', 'European trading community',
  'EU traders social network', 'Chinese trading community', 'Asia-Pacific traders forum',
  'war trading community', 'crisis traders network', 'global news trading discussions', 'geopolitical trading forum',
  // Market Insights
  'exclusive market insights', 'professional market intelligence', 'institutional market insights',
  'NIFTY market insights India', 'Indian stock market intelligence', 'US market insights daily', 'Wall Street market intelligence', 'European market insights',
  'Euro market intelligence', 'Chinese market insights', 'mainland China market reports',
  'war market insights', 'geopolitical market intelligence', 'global crisis market insights', 'commodity war market analysis',
  // Trading Education
  'comprehensive trading education', 'professional trading courses', 'advanced trading education',
  'NIFTY trading education India', 'Indian stock market courses', 'US trading education', 'American trading academy', 'European trading education',
  'EU trading certification', 'Chinese market education', 'Asia trading courses',
  'war economy trading education', 'crisis trading education', 'global uncertainty trading course', 'geopolitical trading training',
  // Long-Tail & High-Intent
  'best NIFTY real-time trading dashboard with global news alerts', 'US stock market analysis during geopolitical crisis', 'multi-market portfolio tracking for war economy',
  'European market trading strategies amid global uncertainty', 'Chinese stock market analytics with geopolitical insights', 'global investment platform with crisis management tools',
  'professional trading community for international markets', 'comprehensive market insights during global conflicts', 'advanced trading education for volatile markets',
  // Ultra-High Intent
  'best AI trading platform for beginners 2025', 'crypto trading dashboard with advanced analytics', 'NIFTY real-time trading platform India', 'US stock market AI analysis tool',
  'European crypto trading platform regulated', 'Chinese market trading dashboard English', 'multi-market portfolio tracker app', 'institutional grade trading platform',
  // Trending Topics
  'Trump presidency trading strategies', 'AI stock market prediction platform', 'crypto trading during rate changes', 'volatile market trading dashboard', 'automated trading platform 2025', 'social trading community platform',
  // Geographic + Trending
  'Mumbai NIFTY AI trading platform', 'New York crypto trading dashboard', 'London European market analytics', 'Singapore multi-market trading app', 'Hong Kong China stocks platform',
  // Conversion-Focused
  'how to trade during market volatility', 'best trading platform for beginners', 'automated trading strategies that work', 'safest crypto trading platform 2025', 'lowest fee trading platform comparison',
  'trading platform with real-time alerts', 'multi-screen trading dashboard setup', 'mobile trading app with advanced charts', 'commission-free trading platform', 'paper trading platform for practice',
];

// Helper to convert newlines to <br> for paragraphs
function formatParagraphContent(text: string) {
  // Escape HTML to prevent XSS, then replace newlines with <br>
  const escapeHtml = (unsafe: string) =>
    unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  return escapeHtml(text).replace(/\n/g, '<br>');
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorStatus, setErrorStatus] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('free');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch post and user data in parallel
        const [postRes, userRes] = await Promise.all([
          fetch(`/api/blog/${params.id}`),
          fetch('/api/auth/user-role')
        ]);

        // Handle post data
        if (postRes.ok) {
          const postData = await postRes.json();
          // Ensure dates are properly converted to Date objects
          if (postData.post) {
            postData.post.createdAt = new Date(postData.post.createdAt);
            postData.post.updatedAt = new Date(postData.post.updatedAt);
          }
          setPost(postData.post);
        } else {
          setErrorStatus(postRes.status);
          setError('Post not found');
        }

        // Handle user data
        if (userRes.ok) {
          const userData = await userRes.json();
          setIsAuthenticated(userData.authenticated || false);
          setUserRole(userData.role || 'free');
          setCurrentUserEmail(userData.email || '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/blog/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/community');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderContent = (content: BlogContent[]) => {
    return content.map((item, index) => {
      switch (item.type) {
        case 'paragraph':
          return (
            <div key={index} className="blog-post-paragraph-container">
              {item.title && (
                <h3 className="blog-post-paragraph-title">{item.title}</h3>
              )}
              <div 
                className="blog-post-paragraph"
                dangerouslySetInnerHTML={{ __html: formatParagraphContent(item.content) }}
              />
            </div>
          );
        case 'image':
          return (
            <div key={index} className="blog-post-image-container">
              <img 
                src={item.imageUrl} 
                alt={item.content || 'Blog post image'}
                className="blog-post-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  // Check permissions
  const canEdit = isAuthenticated && post && (
    currentUserEmail === post.authorId || userRole === 'admin'
  );
  const canDelete = isAuthenticated && post && (
    currentUserEmail === post.authorId || userRole === 'admin'
  );
  const isPremium = post?.visibility === 'premium';
  const isAllowed = !isPremium || userRole === 'premium' || userRole === 'admin';

  // SEO metadata
  const pageTitle = post ? `${post.title} - Trading Insights` : 'Blog Post - Fluxtrade Trading';
  const pageDescription = post ? post.description : 'Read expert trading insights and market analysis from our community.';
  const pageKeywords = post && post.keywords && post.keywords.length > 0
    ? post.keywords.join(', ') + ', ' + DEFAULT_TRENDING_KEYWORDS.join(', ')
    : DEFAULT_TRENDING_KEYWORDS.join(', ');
  const pageUrl = post ? `https://fluxtrade.vercel.app/community/post/${post._id.toString()}` : 'https://fluxtrade.vercel.app/community';
  const pageImage = post?.thumbnail || 'https://fluxtrade.vercel.app/og-image.jpg';

  // Helper function to safely convert dates to ISO string
  const toISOString = (date: string | Date) => {
    try {
      return new Date(date).toISOString();
    } catch (error) {
      console.error('Error converting date to ISO string:', error);
      return new Date().toISOString(); // fallback to current date
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... | Fluxtrade Trading</title>
          <meta name="description" content="Loading blog post..." />
        </Head>
        <div className="blog-post-container">
          <div className="blog-post-content">
            <div className="blog-post-loading">
              <div className="blog-post-loading-spinner"></div>
              <p>Loading post...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !post) {
    if (errorStatus === 401 || errorStatus === 403) {
      return (
        <>
          <Head>
            <title>Premium Content - Fluxtrade Trading</title>
            <meta name="description" content="This content is available for premium members only." />
            <meta name="robots" content="noindex, nofollow" />
          </Head>
          <div className="blog-post-error">
            <h1 className="blog-post-error-title">Premium Content</h1>
            <p className="blog-post-error-message">
              This post is for premium members only.<br />
              Please <Link href="/dashboard">subscribe to premium</Link> or contact admin for access.
            </p>
            <Link href="/community" className="blog-post-error-btn">
              Back to Community
            </Link>
          </div>
        </>
      );
    }
    // Default: 404 or other error
    return (
      <>
        <Head>
          <title>Post Not Found - Fluxtrade Trading</title>
          <meta name="description" content="The requested blog post could not be found." />
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="blog-post-error">
          <h1 className="blog-post-error-title">Post Not Found</h1>
          <p className="blog-post-error-message">{error || 'The post you are looking for does not exist.'}</p>
          <Link href="/community" className="blog-post-error-btn">
            Back to Community
          </Link>
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
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={toISOString(post.createdAt)} />
        <meta property="article:modified_time" content={toISOString(post.updatedAt)} />
        <meta property="article:section" content="Trading Insights" />
        <meta property="article:tag" content="trading, market analysis, strategies" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        <link rel="canonical" href={pageUrl} />
        
        {/* Structured Data for Blog Post */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "description": post.description,
              "image": pageImage,
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "publisher": {
                "@type": "Organization",
                "name": "Fluxtrade Trading",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://fluxtrade.vercel.app/logo.png"
                }
              },
              "datePublished": toISOString(post.createdAt),
              "dateModified": toISOString(post.updatedAt),
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": pageUrl
              },
              "articleSection": "Trading Insights",
              "keywords": pageKeywords
            })
          }}
        />
      </Head>
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
              {isPremium && (
                <span className="blog-post-premium-badge">Premium</span>
              )}
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

          {/* Content or Premium Gating */}
          <div className="blog-post-body">
            {isAllowed ? (
              renderContent(post.content)
            ) : (
              <div className="blog-post-premium-message">
                <h2>This post is for premium members only.</h2>
                <p>Upgrade your account to access this content.</p>
                <Link href="/dashboard" className="blog-post-upgrade-btn">Upgrade Now</Link>
              </div>
            )}
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
    </>
  );
} 