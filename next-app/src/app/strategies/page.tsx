"use client";

import Link from 'next/link';

export default function StrategiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="relative max-w-7xl mx-auto pt-16 md:pt-24">
        <h1 className="text-5xl font-bold text-center text-white animate-glow strategies-title">
          Trading Strategies
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 mt-16 p-4">
          {/* Strategy Card: Gamma Guide */}
          <Link href="/strategies/gamma-guide" passHref className="group no-underline">
            <div className="stat-card h-full flex items-center justify-center p-8 text-center bg-white/5 border-2 border-white/20 rounded-2xl transition-all duration-300 hover:border-neon-cyan/80 hover:shadow-[0_8px_32px_0_rgba(0,255,204,0.15)]">
              <h2 className="text-2xl font-bold text-white">
                Gamma Guide
              </h2>
            </div>
          </Link>

          {/* Placeholder Strategy Card 1 */}
          <Link href="#" passHref className="group no-underline">
            <div className="stat-card h-full flex items-center justify-center p-8 text-center bg-white/5 border-2 border-white/20 rounded-2xl transition-all duration-300 hover:border-neon-cyan/80 hover:shadow-[0_8px_32px_0_rgba(0,255,204,0.15)]">
              <h2 className="text-2xl font-bold text-white">
                Volatility Arbitrage
              </h2>
            </div>
          </Link>

          {/* Placeholder Strategy Card 2 */}
          <Link href="#" passHref className="group no-underline">
            <div className="stat-card h-full flex items-center justify-center p-8 text-center bg-white/5 border-2 border-white/20 rounded-2xl transition-all duration-300 hover:border-neon-cyan/80 hover:shadow-[0_8px_32px_0_rgba(0,255,204,0.15)]">
              <h2 className="text-2xl font-bold text-white">
                Mean Reversion
              </h2>
            </div>
          </Link>

          {/* Placeholder "Coming Soon" Card */}
          <div className="stat-card h-full flex items-center justify-center p-8 text-center bg-white/5 border-2 border-dashed border-white/20 rounded-2xl opacity-60 cursor-not-allowed">
            <h2 className="text-2xl font-bold text-white/70">
              New Strategy (Soon)
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
} 