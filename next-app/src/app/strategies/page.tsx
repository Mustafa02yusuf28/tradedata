"use client";

import Link from 'next/link';

export default function StrategiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="relative max-w-7xl mx-auto pt-16 md:pt-24">
        <h1 className="text-5xl font-bold text-center mb-32 text-white animate-glow">
          Trading Strategies
        </h1>
        <Link href="/strategies/gamma-guide" className="no-underline group w-96 mx-auto">
          <div className="stat-card bg-white/10 backdrop-blur-2xl border-2 border-neon-cyan/40 rounded-2xl p-10 transition-all duration-300 group-hover:shadow-[0_8px_32px_0_rgba(0,255,204,0.15)] group-hover:border-neon-cyan/80 relative overflow-hidden text-white group-hover:transform-none">
            <h2 className="text-3xl font-extrabold mb-3 tracking-wide text-center" style={{ color: '#fff' }}>
              TOTAL GAMMA GUIDE
            </h2>
            <div className="text-lg font-semibold mb-2 text-center" style={{ color: '#fff' }}>
              Master market patterns based on gamma exposure
            </div>
            <p className="text-base text-center" style={{ color: '#fff' }}>
              Discover how gamma exposure influences market patterns and learn to recognize bullish and bearish scenarios. Dive into interactive charts and gain practical knowledge for informed trading decisions.
            </p>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan/40 via-neon-blue/30 to-transparent opacity-60 group-hover:opacity-100 transition-all duration-300" />
          </div>
        </Link>
      </div>
    </div>
  );
} 