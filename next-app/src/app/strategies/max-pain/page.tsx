"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';

interface OptionData {
  strike: number;
  callOI: number;
  putOI: number;
}

const MaxPainStrategy = () => {
  const [currentPrice, setCurrentPrice] = useState<number>(29450);
  const [multiple, setMultiple] = useState<number>(50);
  const [instrumentName, setInstrumentName] = useState<string>("NIFTY");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>("");

  // Function to round to nearest multiple
  const roundToNearestMultiple = (price: number) => {
    return Math.round(price / multiple) * multiple;
  };

  // Function to generate strikes based on current price
  const generateStrikes = (price: number) => {
    const roundedPrice = roundToNearestMultiple(price);
    const strikes: number[] = [];
    
    // Generate 16 strikes below
    for (let i = 16; i > 0; i--) {
      strikes.push(roundedPrice - (i * multiple));
    }
    
    // Add current price
    strikes.push(roundedPrice);
    
    // Generate 16 strikes above
    for (let i = 1; i <= 16; i++) {
      strikes.push(roundedPrice + (i * multiple));
    }
    
    return strikes;
  };

  const [optionsData, setOptionsData] = useState<OptionData[]>([]);

  // Generate initial options data on client only
  useEffect(() => {
    const strikes = generateStrikes(currentPrice);
    setOptionsData(strikes.map(strike => ({
      strike,
      callOI: Math.floor(Math.random() * 10000),
      putOI: Math.floor(Math.random() * 10000)
    })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(e.target.value);
    if (!isNaN(newPrice)) {
      setCurrentPrice(newPrice);
    }
  };

  // Handle price change completion (on blur)
  const handlePriceBlur = () => {
    const roundedPrice = roundToNearestMultiple(currentPrice);
    setCurrentPrice(roundedPrice);
    
    // Update options data with new strikes
    const newStrikes = generateStrikes(roundedPrice);
    const newOptionsData = newStrikes.map(strike => {
      const existingData = optionsData.find(opt => opt.strike === strike);
      return {
        strike,
        callOI: existingData?.callOI || Math.floor(Math.random() * 10000),
        putOI: existingData?.putOI || Math.floor(Math.random() * 10000)
      };
    });
    setOptionsData(newOptionsData);
  };

  // Handle multiple change
  const handleMultipleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMultiple = parseInt(e.target.value);
    if (!isNaN(newMultiple) && newMultiple > 0) {
      setMultiple(newMultiple);
      // Update current price to nearest multiple
      const roundedPrice = roundToNearestMultiple(currentPrice);
      setCurrentPrice(roundedPrice);
      
      // Update options data with new strikes
      const newStrikes = generateStrikes(roundedPrice);
      const newOptionsData = newStrikes.map(strike => {
        const existingData = optionsData.find(opt => opt.strike === strike);
        return {
          strike,
          callOI: existingData?.callOI || Math.floor(Math.random() * 10000),
          putOI: existingData?.putOI || Math.floor(Math.random() * 10000)
        };
      });
      setOptionsData(newOptionsData);
    }
  };

  // Handle name editing
  const startEditingName = () => {
    setTempName(instrumentName);
    setIsEditingName(true);
  };

  const saveInstrumentName = () => {
    if (tempName.trim()) {
      setInstrumentName(tempName.trim());
    }
    setIsEditingName(false);
  };

  // Calculate max pain for each strike
  const maxPainData = useMemo(() => {
    const strikes = optionsData.map(d => d.strike);
    
    return strikes.map(testStrike => {
      let callPain = 0;
      let putPain = 0;

      optionsData.forEach(option => {
        if (option.strike < testStrike) {
          callPain += (testStrike - option.strike) * option.callOI;
        }
        if (option.strike > testStrike) {
          putPain += (option.strike - testStrike) * option.putOI;
        }
      });

      return {
        strike: testStrike,
        callPain,
        putPain,
        totalPain: callPain + putPain
      };
    });
  }, [optionsData]);

  // Find max pain point
  const maxPainPoint = useMemo(() => {
    if (maxPainData.length === 0) return { strike: 0, callPain: 0, putPain: 0, totalPain: 0 };
    return maxPainData.reduce((min, current) =>
      current.totalPain < min.totalPain ? current : min
    );
  }, [maxPainData]);

  // Open Interest chart data
  const oiData = optionsData.map(d => ({
    strike: d.strike,
    callOI: d.callOI,
    putOI: -d.putOI,
    totalOI: d.callOI + d.putOI
  }));

  const updateOI = (index: number, field: keyof OptionData, value: string) => {
    const newData = [...optionsData];
    newData[index] = {
      ...newData[index],
      [field]: parseInt(value) || 0
    };
    setOptionsData(newData);
  };

  return (
    <div className="max-pain-container">
      <div className="max-pain-content">
        <h1 className="max-pain-title">
          Max Pain Strategy
        </h1>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="max-pain-price-input"
                  placeholder="Enter instrument name"
                />
                <button
                  onClick={saveInstrumentName}
                  className="px-3 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-white/70">{instrumentName}</h2>
                <button
                  onClick={startEditingName}
                  className="max-pain-change-btn"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white/70">Current Price:</label>
              <input
                type="number"
                value={currentPrice}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
                step={multiple}
                min="0"
                className="max-pain-price-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white/70">Strike Multiple:</label>
              <input
                type="number"
                value={multiple}
                onChange={handleMultipleChange}
                min="1"
                className="max-pain-price-input"
              />
            </div>
          </div>
        </div>

        <div className="max-pain-grid">
          {/* Max Pain Chart */}
          <div className="max-pain-card">
            <h2>Max Pain Analysis</h2>
            <div className="max-pain-info-box">
              <h3>Max Pain Level: {maxPainPoint.strike}</h3>
              <p>Total Pain: ₹{(maxPainPoint.totalPain / 100000).toFixed(1)} Lakhs</p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={maxPainData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="strike" 
                  stroke="rgba(255, 255, 255, 0.5)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                />
                <YAxis 
                  stroke="rgba(255, 255, 255, 0.5)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 20, 20, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                  formatter={(value: number, name: string) => [
                    `₹${(value / 100000).toFixed(1)}L`, 
                    name === 'totalPain' ? 'Total Pain' : name === 'callPain' ? 'Call Pain' : 'Put Pain'
                  ]}
                />
                <Bar dataKey="callPain" fill="#ef4444" name="callPain" />
                <Bar dataKey="putPain" fill="#22c55e" name="putPain" />
                <Line type="monotone" dataKey="totalPain" stroke="#00ffcc" strokeWidth={3} name="totalPain" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Open Interest Chart */}
          <div className="max-pain-card">
            <h2>Open Interest Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={oiData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="strike" 
                  stroke="rgba(255, 255, 255, 0.5)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                />
                <YAxis 
                  stroke="rgba(255, 255, 255, 0.5)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                  tickFormatter={(value) => Math.abs(value).toLocaleString()}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 20, 20, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value).toLocaleString(), 
                    name === 'callOI' ? 'Call OI' : 'Put OI'
                  ]}
                />
                <Bar dataKey="callOI" fill="#3b82f6" name="callOI" />
                <Bar dataKey="putOI" fill="#f59e0b" name="putOI" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Input Table */}
        <div className="max-pain-card">
          <h2>Options Data (Editable)</h2>
          <div className="overflow-x-auto">
            <table className="max-pain-table">
              <thead>
                <tr>
                  <th>Strike</th>
                  <th>Call OI</th>
                  <th>Put OI</th>
                  <th>Total OI</th>
                  <th>Pain if Expiry Here</th>
                </tr>
              </thead>
              <tbody>
                {optionsData.map((row, index) => {
                  const painData = maxPainData.find(d => d.strike === row.strike);
                  return (
                    <tr key={row.strike}>
                      <td>{row.strike}</td>
                      <td>
                        <input
                          type="number"
                          value={row.callOI}
                          onChange={(e) => updateOI(index, 'callOI', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.putOI}
                          onChange={(e) => updateOI(index, 'putOI', e.target.value)}
                        />
                      </td>
                      <td>{(row.callOI + row.putOI).toLocaleString()}</td>
                      <td>₹{(painData?.totalPain || 0 / 100000).toFixed(1)}L</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explanation */}
        <div className="max-pain-card">
          <h2>How Max Pain Works</h2>
          <div className="max-pain-explanation">
            <div>
              <h3>Calculation Logic:</h3>
              <ul>
                <li>• <strong>Call Pain:</strong> Sum of (Test Strike - Call Strike) × Call OI for ITM calls</li>
                <li>• <strong>Put Pain:</strong> Sum of (Put Strike - Test Strike) × Put OI for ITM puts</li>
                <li>• <strong>Total Pain:</strong> Call Pain + Put Pain</li>
                <li>• <strong>Max Pain:</strong> Strike with minimum total pain</li>
              </ul>
            </div>
            <div>
              <h3>Trading Implications:</h3>
              <ul>
                <li>• Market tends to drift toward max pain near expiry</li>
                <li>• Higher OI creates stronger gravitational pull</li>
                <li>• More relevant for weekly/monthly expiries</li>
                <li>• Combine with GEX for better analysis</li>
              </ul>
            </div>
          </div>
          <div className="max-pain-analysis">
            <p>
              <strong>Current Analysis:</strong> Max pain is at {maxPainPoint.strike}, which is {currentPrice > maxPainPoint.strike ? 'below' : 'above'} current price ({currentPrice}). 
              This suggests {currentPrice > maxPainPoint.strike ? 'downward' : 'upward'} pressure as expiry approaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaxPainStrategy; 