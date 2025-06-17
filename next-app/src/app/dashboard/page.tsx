"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

export default function DashboardPage() {
  const [latestBlog, setLatestBlog] = useState<BlogPost | null>(null);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);

  useEffect(() => {
    // Fetch latest blog post
    const fetchLatestBlog = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();
        if (data.posts && data.posts.length > 0) {
          setLatestBlog(data.posts[0]); // Get the latest post
        }
      } catch (error) {
        console.error('Error fetching latest blog:', error);
      } finally {
        setIsLoadingBlog(false);
      }
    };

    fetchLatestBlog();

    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        (card as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)';
      });
      
      card.addEventListener('mouseleave', () => {
        (card as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
      });
    });

    // Simulate real-time updates
    const updatePortfolioValue = () => {
      const valueElement = document.querySelector('.portfolio .stat-value');
      if (!valueElement) return;
      
      const currentValue = parseFloat(valueElement.textContent?.replace('$', '').replace(',', '') || '12345');
      const change = (Math.random() - 0.5) * 100;
      const newValue = Math.max(0, currentValue + change);
      
      valueElement.textContent = '$' + newValue.toLocaleString(undefined, {maximumFractionDigits: 0});
      
      // Update change indicator
      const changeElement = document.querySelector('.portfolio .stat-change');
      if (changeElement) {
        const changePercent = ((change / currentValue) * 100).toFixed(1);
        const arrow = change >= 0 ? '↗' : '↘';
        const color = change >= 0 ? '#00ffcc' : '#ff6b6b';
        
        changeElement.innerHTML = `${arrow} $${Math.abs(change).toFixed(0)} (${changePercent}%)`;
        (changeElement as HTMLElement).style.color = color;
      }
    };

    // Update portfolio value every 5 seconds
    const interval = setInterval(updatePortfolioValue, 5000);

    // Add intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe all cards and sections
    const elements = document.querySelectorAll('.stat-card, .chart-section, .action-btn');
    elements.forEach(el => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(30px)';
      (el as HTMLElement).style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Cleanup
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <main className="main-content">
      <h1 className="dashboard-title">Trading Dashboard</h1>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Link href="/strategies" className="stat-card-dashboard strategies cursor-pointer hover:bg-white/10 transition-all duration-300">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Trading Strategies</div>
          <div className="stat-value">5</div>
          <div className="stat-change">
            ↗ +2 this week
          </div>
        </Link>

        <div className="stat-card-dashboard blog">
          <div className="stat-label">Latest Blog Post</div>
          {isLoadingBlog ? (
            <div className="stat-value">Loading...</div>
          ) : latestBlog ? (
            <>
              <div className="stat-value blog-title">{latestBlog.title}</div>
              <div className="stat-change">
                By {latestBlog.author} • {formatDate(latestBlog.createdAt)}
              </div>
              <Link href={`/community/post/${latestBlog._id.toString()}`} className="blog-read-more">
                Read More →
              </Link>
            </>
          ) : (
            <>
              <div className="stat-value">No posts yet</div>
              <div className="stat-change">
                Be the first to share insights
              </div>
            </>
          )}
        </div>

        <Link href="/news" className="stat-card-dashboard news cursor-pointer hover:bg-white/10 transition-all duration-300">
          <div className="stat-icon">📰</div>
          <div className="stat-label">Latest News</div>
          <div className="stat-value">15</div>
          <div className="stat-change">
            <span className="loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
            Live updates
          </div>
        </Link>
      </div>

      {/* Interactive Chart Section */}
      <div className="chart-section">
        <div className="chart-header">
          <h2 className="chart-title">Portfolio Performance</h2>
          <p className="chart-subtitle">Real-time market visualization and analytics</p>
        </div>
        <div className="mock-chart">
          <div className="chart-line"></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link href="/strategies" className="action-btn">
          <h3>📈 Create Strategy</h3>
          <p>Build new trading algorithms</p>
        </Link>
        <Link href="#" className="action-btn">
          <h3>📊 Market Analysis</h3>
          <p>Deep dive into market trends</p>
        </Link>
        <Link href="#" className="action-btn">
          <h3>🔔 Set Alerts</h3>
          <p>Configure price notifications</p>
        </Link>
        <Link href="#" className="action-btn">
          <h3>📱 Mobile App</h3>
          <p>Trade on the go</p>
        </Link>
      </div>
    </main>
  );
} 