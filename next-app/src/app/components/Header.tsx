'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AuthModal from '../../components/AuthModal';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [pathname]);

  const handleProtectedRouteClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setNotification({ show: true, message: 'Signed out successfully!' });
      setTimeout(() => setNotification({ show: false, message: '' }), 1500);
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">TradingPro</div>
        <ul className="nav-links">
          <li>
            <Link 
              href="/dashboard" 
              className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/strategies" 
              className={`nav-link ${pathname === '/strategies' ? 'active' : ''}`}
              onClick={handleProtectedRouteClick}
            >
              Strategies
            </Link>
          </li>
          <li>
            <Link 
              href="/news" 
              className={`nav-link ${pathname === '/news' ? 'active' : ''}`}
              onClick={handleProtectedRouteClick}
            >
              News
            </Link>
          </li>
          <li>
            <Link 
              href="/events" 
              className={`nav-link ${pathname === '/events' ? 'active' : ''}`}
              onClick={handleProtectedRouteClick}
            >
              Events
            </Link>
          </li>
          <li>
            <Link 
              href="/community" 
              className={`nav-link ${pathname === '/community' ? 'active' : ''}`}
            >
              Community
            </Link>
          </li>
        </ul>
        {isAuthenticated ? (
          <button 
            className="sign-in-btn" 
            onClick={handleLogout}
          >
            Sign Out
          </button>
        ) : (
          <button className="sign-in-btn" onClick={() => setIsAuthModalOpen(true)}>
            Sign In
          </button>
        )}
      </nav>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthenticated(true);
          setIsAuthModalOpen(false);
          router.refresh();
        }}
      />
      {notification.show && (
        <div className="fixed top-4 right-4 bg-[#00ffcc] text-black px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-out z-[60]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}
    </header>
  );
} 