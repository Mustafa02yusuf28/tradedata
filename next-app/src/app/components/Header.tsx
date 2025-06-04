'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

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
            >
              Strategies
            </Link>
          </li>
          <li>
            <Link 
              href="/news" 
              className={`nav-link ${pathname === '/news' ? 'active' : ''}`}
            >
              News
            </Link>
          </li>
          <li>
            <Link 
              href="/events" 
              className={`nav-link ${pathname === '/events' ? 'active' : ''}`}
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
        <button className="sign-in-btn">Sign In</button>
      </nav>
    </header>
  );
} 