"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Strategies', path: '/strategies' },
  { name: 'News', path: '/news' },
  { name: 'Events', path: '/events' },
  { name: 'Community', path: '/community' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      router.push('/login');
    } catch {
      // Optionally log a generic error or do nothing
    }
  };

  useEffect(() => {
    console.log('[Header] isMobileMenuOpen:', isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    console.log('[Header] mounted');
    return () => {
      console.log('[Header] unmounted');
    };
  }, []);

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">Fluxtrade</div>
        <ul className="nav-links desktop-only">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`nav-link${pathname === item.path ? ' active' : ''}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mobile-only flex items-center justify-center w-10 h-10 rounded-lg bg-black/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan transition-all duration-300"
        >
          <span className="sr-only">Open main menu</span>
          <img src="/icons8-hamburger-menu.svg" alt="Menu" width={28} height={28} />
        </button>
        <div className="desktop-only">
          {!isAuthenticated ? (
            <Link href="/login" className="sign-in-btn">
              Sign In
            </Link>
          ) : (
            <button onClick={handleLogout} className="sign-in-btn">
              Sign Out
            </button>
          )}
        </div>
      </nav>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-start pt-24 animate-fade-in-out">
          <ul className="w-full max-w-xs mx-auto space-y-4">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`nav-link block text-center text-lg py-4${pathname === item.path ? ' active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="sign-in-btn w-full block text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="sign-in-btn w-full block text-center"
                >
                  Sign Out
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header; 