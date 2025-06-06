"use client";

import { useState } from 'react';
import { gammaPatterns } from '@/data/gammaPatterns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';

// REMOVED unused patternIcons variable

type PatternType = 'bullish' | 'bearish' | 'neutral' | 'squeeze' | 'lowGamma';

// Define interfaces for Tooltip props and payload entries
interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
  // Add other properties if used, e.g., dataKey?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => { // MODIFIED: Used CustomTooltipProps
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-100/90 p-3 border border-neon-cyan/20 rounded-lg shadow-lg backdrop-blur-sm">
        <p className="font-semibold text-white">{`Strike: ${label}`}</p>
        {payload.map((entry: TooltipPayloadEntry, index: number) => ( // MODIFIED: Used TooltipPayloadEntry
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${entry.value.toFixed(4)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function GammaGuidePage() {
  const [selectedPattern, setSelectedPattern] = useState<PatternType>('bullish');
  const pattern = gammaPatterns[selectedPattern];

  return (
    <div className="main-content">
      <h1 className="dashboard-title mb-8">Gamma Guide</h1>
      <div className="quick-actions mb-16 flex flex-wrap gap-4 justify-center z-10 relative">
        {Object.entries(gammaPatterns).map(([key, pat]) => (
          <button
            key={key}
            onClick={() => setSelectedPattern(key as PatternType)}
            className={`action-btn font-bold text-base md:text-lg px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 border border-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-neon-cyan/80 ${
              selectedPattern === key
                ? 'ring-2 ring-neon-cyan/80 scale-105 bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 text-neon-cyan border-neon-cyan'
                : 'text-white/80 hover:text-neon-cyan hover:border-neon-cyan/40'
            }`}
            style={{ minHeight: 60 }}
          >
            {pat.name}
          </button>
        ))}
      </div>

      <div className="chart-section mt-24 mb-16 p-10 rounded-3xl z-0 relative">
        <div className="mb-4">
          <h2 className="chart-title mb-2">{pattern.name}</h2>
          <p className="chart-subtitle">{pattern.description}</p>
        </div>
        {pattern.data.length === 0 ? (
          <div className="text-center text-red-400 font-semibold py-12">No data available for this pattern.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-16">
            {/* Individual Gamma Chart */}
            <div className="stat-card rounded-xl">
              <h3 className="font-semibold mb-2 text-neon-cyan">Individual Gamma Distribution</h3>
              <div style={{ minHeight: 260, height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pattern.data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.1)" />
                    <XAxis dataKey="strike" stroke="rgba(0,255,204,0.5)" tick={{ fill: 'rgba(0,255,204,0.7)' }} />
                    <YAxis stroke="rgba(0,255,204,0.5)" tick={{ fill: 'rgba(0,255,204,0.7)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="callGamma" stroke="#00ffcc" strokeWidth={2} name="Call Gamma" />
                    <Line type="monotone" dataKey="putGamma" stroke="#ff0080" strokeWidth={2} name="Put Gamma" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-sm text-white/60">
                <strong className="text-neon-cyan">How to Read:</strong> Green line shows call gamma, red line shows put gamma. Higher values indicate more hedging pressure at those strikes.
              </div>
            </div>

            {/* Total Gamma Chart */}
            <div className="stat-card rounded-xl">
              <h3 className="font-semibold mb-2 text-neon-cyan">Total Gamma per Strike</h3>
              <div style={{ minHeight: 260, height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pattern.data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,128,255,0.1)" />
                    <XAxis dataKey="strike" stroke="rgba(0,128,255,0.5)" tick={{ fill: 'rgba(0,128,255,0.7)' }} />
                    <YAxis stroke="rgba(0,128,255,0.5)" tick={{ fill: 'rgba(0,128,255,0.7)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="totalGamma" fill="#0080ff" name="Total Gamma" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-sm text-white/60">
                <strong className="text-neon-cyan">How to Read:</strong> Taller bars = more total gamma exposure. These strikes act as &quot;magnets&quot; or &quot;resistance&quot; levels.
              </div>
            </div>

            {/* Net Gamma Chart */}
            <div className="stat-card rounded-xl">
              <h3 className="font-semibold mb-2 text-neon-cyan">Net Gamma (Call - Put)</h3>
              <div style={{ minHeight: 260, height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pattern.data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.1)" />
                    <XAxis dataKey="strike" stroke="rgba(0,255,204,0.5)" tick={{ fill: 'rgba(0,255,204,0.7)' }} />
                    <YAxis stroke="rgba(0,255,204,0.5)" tick={{ fill: 'rgba(0,255,204,0.7)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" strokeDasharray="2 2" />
                    <Bar dataKey="netGamma" fill="#00ffcc" name="Net Gamma" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-sm text-white/60">
                <strong className="text-neon-cyan">How to Read:</strong> Positive = call gamma dominance (bullish bias), Negative = put gamma dominance (bearish bias or support).
              </div>
            </div>

            {/* Cumulative Gamma Chart */}
            <div className="stat-card rounded-xl" style={{ border: '2px solid #00ffcc33' }}>
              <h3 className="font-semibold mb-2 text-neon-cyan">Cumulative Gamma <span className="text-yellow-400">⭐ Most Important!</span></h3>
              <div style={{ minHeight: 260, height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pattern.data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,204,0.1)" />
                    <XAxis dataKey="strike" stroke="rgba(0,255,204,0.5)" tick={{ fill: 'rgba(0,255,204,0.7)' }} />
                    <YAxis stroke="rgba(0,255,204,0.5)" tick={{ fill: 'rgba(0,255,204,0.7)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="cumulative" 
                      stroke="#00ffcc" 
                      fill="#00ffcc" 
                      fillOpacity={0.1}
                      strokeWidth={3}
                      name="Cumulative Gamma"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-sm text-white/60">
                <strong className="text-neon-cyan">How to Read:</strong> Shows total gamma &quot;wall&quot; building up. Steep slopes = strong gamma levels that can halt price movement.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chart-section mt-16 mb-16 p-10 rounded-3xl z-0 relative">
        <h3 className="chart-title mb-2">Market Implications</h3>
        <ul className="list-disc list-inside space-y-2 text-white/80">
          {pattern.implications.map((implication, index) => (
            <li key={index}>{implication}</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 