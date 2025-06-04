"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  useEffect(() => {
    // TODO: Implement session check with NextAuth
    setIsAuthenticated(false);
  }, []);

  return (
    <header className="relative z-10 backdrop-blur-[20px] bg-white/5 border-b border-white/10 px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#00ffcc] to-[#0080ff] bg-clip-text text-transparent">
                TradingPro
              </span>
            </Link>
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`relative px-4 py-2 rounded-lg transition-all duration-300 overflow-hidden group ${
                      isActive
                        ? 'text-[#00ffcc] bg-[#00ffcc]/10 transform -translate-y-0.5'
                        : 'text-white/70 hover:text-[#00ffcc] hover:bg-[#00ffcc]/10 hover:transform hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {/* Shimmer effect */}
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-500 group-hover:left-[100%]" />
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white/70 hover:text-[#00ffcc] hover:bg-white/10 transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6 transition-transform duration-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ transform: isMobileMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
            {!isAuthenticated ? (
              <Link href="/api/auth/signin" className="bg-gradient-to-r from-[#00ffcc] to-[#0080ff] text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#00ffcc]/40">
                Sign In
              </Link>
            ) : (
              <Link href="/api/auth/signout" className="ml-4 bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-600">
                Sign Out
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-white/5 border-t border-white/10 backdrop-blur-[20px]">
            {navigation.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-[#00ffcc] bg-[#00ffcc]/10'
                      : 'text-white/70 hover:text-[#00ffcc] hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 