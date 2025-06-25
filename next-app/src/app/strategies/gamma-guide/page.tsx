"use client";

import React, { useState } from 'react';
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

// Pattern-specific mechanics from resource.txt
const patternMechanics: Record<PatternType, string> = {
  bullish: `BULLISH PATTERN - The Upside Acceleration Machine\n\nHow Big Money Builds This:\n\nStep 1: ACCUMULATION PHASE\n- Institutions buy massive call spreads at 25000-25400\n- Retail follows with smaller call positions\n- Market makers sell calls, creating SHORT GAMMA position\n- Result: Massive call gamma wall above current price\n\nThe Exposure Build-Up:\n- Market maker position: Short 50,000 call contracts at 25000 strike\n- Delta exposure: Each 1% price move = $25M hedging required\n- Gamma exposure: As price approaches 25000, hedging accelerates exponentially\n\nReal-Time Mechanics:\n\nPrice: 24950 → 25000 (Breaking call gamma wall)\n\nMillisecond 1: Price ticks to 25000\nMillisecond 2: Market maker algorithms detect delta imbalance\nMillisecond 3: Automatic hedge orders: BUY 100,000 shares\nMillisecond 4: Price jumps to 25020 from buying pressure\nMillisecond 5: Delta recalculated - need MORE hedging\nMillisecond 6: BUY another 150,000 shares\nMillisecond 7: Price at 25050, triggering next gamma level\n\nHow Big Money Exploits This:\n\nPre-Positioning (Days Before):\n- Smart money identifies building call gamma at 25000\n- Accumulates long positions in 24800-24950 range\n- Waits for retail/news catalyst to trigger gamma squeeze\n\nExecution (During Spike):\n- As price hits 25000, adds to positions knowing gamma will accelerate move\n- Uses gamma amplification to achieve 3-5x normal profit on same directional bet\n- Exits portions as gamma peaks are reached\n\nPost-Spike (Profit Taking):\n- Sells into gamma-induced buying pressure\n- Knows that above major gamma walls, buying pressure diminishes\n- Often shorts at gamma peaks for reversal plays`,
  bearish: `BEARISH PATTERN - The Put Protection Fortress\n\nHow Big Money Builds This:\n\nScenario: Major institution holds $10B equity position\nProblem: Needs downside protection\nSolution: Buy massive put spreads creating gamma fortress\n\nThe Protection Mechanism:\n- Institution buys: 200,000 put contracts at 24400 strike\n- Market makers sell puts: Must hedge by shorting stock as price falls\n- Result: Creates buying support exactly where institution needs it\n\nExposure Dynamics:\n\nInstitution's Portfolio:\n- Long $10B in stocks\n- Long $500M in 24400 puts\n- Gamma effect: Each 1% drop below 24400 triggers $50M in market maker buying\n\nHow This Manipulates Price Action:\n\nArtificial Support Creation:\n- Put gamma makes 24400 act like "magnetic floor"\n- Natural selling gets absorbed by forced market maker hedging\n- Creates illusion of strong fundamental support\n\nThe Squeeze Setup:\n- If enough selling pressure builds, put gamma can be overwhelmed\n- When 24400 breaks with volume, ALL put hedging reverses\n- Market makers switch from buying to selling, accelerating decline\n\nBig Money's Double Game:\n\nPhase 1 - Build Protection:\n- Buy puts to create gamma support\n- Continue holding equity positions\n- Market appears "supported" at put levels\n\nPhase 2 - Exploit the Break:\n- Monitor for signs put gamma will fail\n- When breakdown appears imminent, sell equity holdings\n- Short additional positions knowing put gamma failure will accelerate decline\n- Profit from both sides: insurance payout from puts + short profits`,
  squeeze: `GAMMA SQUEEZE - The Nuclear Option\n\nHow Big Money Creates Squeezes:\n\nSetup Phase (Weeks/Months):\nTarget: Force gamma squeeze in specific stock/index\nCapital Required: $1-5B for major index squeeze\n\nWeek 1-4: Accumulate options positions\n- Buy calls AND puts at same strikes (straddles/strangles)\n- Focus on strikes near current price\n- Build massive gamma concentration\n\nWeek 5-8: Position for catalyst\n- Research upcoming events (earnings, Fed meetings, etc.)\n- Coordinate with other institutions\n- Prepare directional positions\n\nThe Squeeze Mechanism:\n\nCurrent Price: 24900 (Near maximum gamma at 25000)\n\nGamma Exposure Calculation:\n- 500,000 call contracts at 25000 strike\n- 400,000 put contracts at 25000 strike  \n- Total gamma exposure: $2.5B per 1% move\n\nCatalyst Trigger:\n- Fed announcement, earnings surprise, geopolitical event\n- Price moves 0.5% in either direction\n- Triggers $1.25B in forced hedging flows\n\nExecution Day:\n\n9:30 AM: Market opens, price at 24900\n9:31 AM: News breaks (planned catalyst)\n9:32 AM: Price moves to 25050\n9:33 AM: $2.5B in automatic buy orders hit market\n9:34 AM: Price gaps to 25200\n9:35 AM: Next gamma level triggered, another $1B in buying\n9:40 AM: Price at 25500, 20% move in 10 minutes\n\nHow Institutions Profit:\n\nThe Orchestrators:\n- Positioned long before squeeze\n- Use gamma amplification to achieve 50-100x leverage effect\n- Exit during peak volatility when others are forced to buy\n\nThe Followers:\n- Algorithmic funds detect squeeze in real-time\n- Jump on momentum knowing gamma will sustain move\n- Risk management: Exit before gamma exhaustion\n\nThe Victims:\n- Retail traders caught short during squeeze\n- Smaller market makers without adequate hedging systems\n- Pension funds forced to buy at worst prices`,
  lowGamma: `LOW GAMMA ENVIRONMENT - Big Money's Trending Paradise\n\nHow This Benefits Large Capital:\n\nInstitutional Advantage:\n- Can deploy $10-50B without gamma interference\n- Trends persist longer without artificial support/resistance\n- Fundamental analysis more reliable\n\nThe Stealth Accumulation:\nInstitution wants to build $20B position:\n\nHigh Gamma Environment:\n- Large purchases trigger hedging flows\n- Price moves against them immediately\n- Must pay premium for gamma-induced volatility\n\nLow Gamma Environment:\n- Can accumulate over weeks/months\n- Price moves naturally based on supply/demand\n- No gamma amplification working against them\n\nTrend Exploitation:\n- Once trend established, minimal gamma to stop momentum\n- Can ride trends for months instead of days\n- Options strategies work based on fundamentals, not gamma distortions`,
  neutral: `NEUTRAL PATTERN - The Range Trading Cash Machine\n\nHow Market Makers Profit:\n\nThe Setup:\n- Balanced gamma creates stable trading range\n- Predictable support/resistance levels\n- Low volatility environment\n\nThe Strategy:\n\nRange: 24000-25600 (1600 point range)\n\nMarket Maker Playbook:\n- Sell premium at range extremes\n- Buy at 24000-24200, sell at 25400-25600\n- Collect decay as price oscillates\n- Gamma balance prevents explosive moves\n\nInstitutional Range Strategy:\n- Deploy mean reversion algorithms\n- Sell vol at range tops, buy vol at range bottoms\n- Profit from gamma balance keeping price contained`
};

function PatternMechanicsCollapse({ patternType, open, onToggle }: { patternType: PatternType, open: boolean, onToggle: () => void }) {
  return (
    <div className="show-pattern-mechanics">
      <button
        className="show-button"
        style={{ boxShadow: '0 0 16px 2px #00ffcc44, 0 2px 16px 0 rgba(0,255,204,0.08)' }}
        onClick={onToggle}
      >
        {open ? 'Hide Pattern Mechanics' : 'Show Pattern Mechanics'}
      </button>
      {open && (
        <div className="w-full max-w-3xl bg-dark-900/85 rounded-2xl p-10 text-white/95 text-base md:text-lg shadow-[0_0_32px_4px_rgba(0,255,204,0.10)] flex flex-col items-start animate-fade-in pattern-mechanics-margin" style={{ boxShadow: '0 0 24px 2px rgba(0,255,204,0.10) inset' }}>
          <h3 className="text-neon-cyan font-extrabold text-xl mb-6 tracking-wide drop-shadow-neon">Pattern Mechanics</h3>
          <div
            className="leading-loose tracking-wide w-full px-2"
            style={{ fontFamily: 'Inter, sans-serif', wordBreak: 'break-word', margin: 0, padding: 0 }}
          >
            {patternMechanics[patternType]
              .split('\n')
              .map((line, idx) => {
                // Detect subtitle: all uppercase or ends with a colon
                const isSubtitle =
                  line.trim().length > 0 &&
                  (line.trim() === line.trim().toUpperCase() || line.trim().endsWith(':'));
                if (isSubtitle) {
                  // Add a spacer above subtitle unless it's the first line
                  return (
                    <React.Fragment key={idx}>
                      {idx !== 0 && <div style={{ height: '1.5em' }} />}
                      <p
                        className="pattern-mechanics-subtitle mt-8 mb-2 font-bold text-lg md:text-2xl text-neon-cyan drop-shadow-neon"
                        style={{ letterSpacing: '0.01em' }}
                      >
                        {line}
                      </p>
                    </React.Fragment>
                  );
                }
                // Normal paragraph
                return (
                  <p key={idx} className="mb-4 last:mb-0">
                    {line}
                  </p>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GammaGuidePage() {
  const [selectedPattern, setSelectedPattern] = useState<PatternType>('bullish');
  // Store open state per pattern
  const [mechanicsOpen, setMechanicsOpen] = useState<Record<PatternType, boolean>>({
    bullish: false,
    bearish: false,
    neutral: false,
    squeeze: false,
    lowGamma: false,
  });
  const pattern = gammaPatterns[selectedPattern];

  // Toggle function for the collapse
  const toggleMechanics = (patternType: PatternType) => {
    setMechanicsOpen((prev) => ({ ...prev, [patternType]: !prev[patternType] }));
  };

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
          <PatternMechanicsCollapse 
            patternType={selectedPattern} 
            open={mechanicsOpen[selectedPattern]} 
            onToggle={() => toggleMechanics(selectedPattern)} 
          />
        </div>
        {pattern.data.length === 0 ? (
          <div className="text-center text-red-400 font-semibold py-12">No data available for this pattern.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-16">
            {/* Individual Gamma Chart */}
            <div className="stat-card-gamma rounded-xl">
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
            <div className="stat-card-gamma rounded-xl">
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
            <div className="stat-card-gamma rounded-xl">
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
            <div className="stat-card-gamma rounded-xl" style={{ border: '2px solid #00ffcc33' }}>
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