"use client";

import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';


// Mock data for the illustrative chart
const riskManagementData = [
  { time: 'Day 1', withRisk: 40, withoutRisk: 100 },
  { time: 'Day 2', withRisk: 80, withoutRisk: 125 },
  { time: 'Day 3', withRisk: 120, withoutRisk: 90 },
  { time: 'Day 4', withRisk: 118, withoutRisk: 250 },
  { time: 'Day 5', withRisk: 140, withoutRisk: 60 },
  { time: 'Day 6', withRisk: 138, withoutRisk: 110 },
  { time: 'Day 7', withRisk: 170, withoutRisk: 45 },
  { time: 'Day 8', withRisk: 200, withoutRisk: 80 },
  { time: 'Day 9', withRisk:190, withoutRisk: 25 },
  { time: 'Day 10', withRisk: 300, withoutRisk: 15 },
];


export default function StrategiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="relative max-w-7xl mx-auto pt-16 md:pt-24">
        <h1 className="text-5xl font-bold text-center text-white animate-glow strategies-title">
          Trading Strategies
        </h1>

        <div className="strategies-grid">
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

        {/* Chart Section for Risk Management */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold text-center text-white mb-4">The Symbiotic Relationship of Strategy & Risk</h2>
          
          <div className="risk-chart-container p-8 rounded-2xl" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={riskManagementData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.5)" />
                <YAxis stroke="rgba(255, 255, 255, 0.5)" domain={['dataMin - 20', 'dataMax + 20']}/>
                <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 20, 0.8)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                <Legend wrapperStyle={{ color: '#fff', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="withRisk" name="Strategy with Good Risk Management" stroke="#00ffcc" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="withoutRisk" name="Strategy without Risk Management" stroke="#ff0080" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 