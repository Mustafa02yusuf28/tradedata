export interface GammaDataPoint {
  strike: number;
  callGamma: number;
  putGamma: number;
  totalGamma: number;
  netGamma: number;
  cumulative: number;
}

export interface GammaPattern {
  name: string;
  description: string;
  data: GammaDataPoint[];
  implications: string[];
}

export const gammaPatterns: Record<string, GammaPattern> = {
  bullish: {
    name: "Bullish Market Pattern",
    description: "High call gamma above current price, low put gamma below",
    data: [
      { strike: 24000, callGamma: 0.001, putGamma: 0.8, totalGamma: 0.801, netGamma: -0.799, cumulative: 0.801 },
      { strike: 24200, callGamma: 0.002, putGamma: 0.6, totalGamma: 0.602, netGamma: -0.598, cumulative: 1.403 },
      { strike: 24400, callGamma: 0.005, putGamma: 0.4, totalGamma: 0.405, netGamma: -0.395, cumulative: 1.808 },
      { strike: 24600, callGamma: 0.012, putGamma: 0.2, totalGamma: 0.212, netGamma: -0.188, cumulative: 2.020 },
      { strike: 24800, callGamma: 0.025, putGamma: 0.1, totalGamma: 0.125, netGamma: -0.075, cumulative: 2.145 },
      { strike: 25000, callGamma: 0.035, putGamma: 0.05, totalGamma: 0.085, netGamma: 0.03, cumulative: 2.230 },
      { strike: 25200, callGamma: 0.040, putGamma: 0.02, totalGamma: 0.062, netGamma: 0.038, cumulative: 2.292 },
      { strike: 25400, callGamma: 0.035, putGamma: 0.01, totalGamma: 0.045, netGamma: 0.034, cumulative: 2.337 },
      { strike: 25600, callGamma: 0.025, putGamma: 0.005, totalGamma: 0.030, netGamma: 0.024, cumulative: 2.367 }
    ],
    implications: [
      "Market expects upward movement",
      "Call gamma creates buying pressure on rallies",
      "Limited downside support from puts",
      "Higher volatility on breaks below support"
    ]
  },
  
  bearish: {
    name: "Bearish Market Pattern",
    description: "High put gamma below current price, minimal call gamma above",
    data: [
      { strike: 24000, callGamma: 0.005, putGamma: 0.8, totalGamma: 0.805, netGamma: -0.795, cumulative: 0.805 },
      { strike: 24200, callGamma: 0.008, putGamma: 0.9, totalGamma: 0.908, netGamma: -0.892, cumulative: 1.713 },
      { strike: 24400, callGamma: 0.012, putGamma: 1.0, totalGamma: 1.012, netGamma: -0.988, cumulative: 2.725 },
      { strike: 24600, callGamma: 0.018, putGamma: 0.8, totalGamma: 0.818, netGamma: -0.782, cumulative: 3.543 },
      { strike: 24800, callGamma: 0.022, putGamma: 0.5, totalGamma: 0.522, netGamma: -0.478, cumulative: 4.065 },
      { strike: 25000, callGamma: 0.020, putGamma: 0.2, totalGamma: 0.220, netGamma: -0.18, cumulative: 4.285 },
      { strike: 25200, callGamma: 0.015, putGamma: 0.1, totalGamma: 0.115, netGamma: -0.085, cumulative: 4.400 },
      { strike: 25400, callGamma: 0.010, putGamma: 0.05, totalGamma: 0.060, netGamma: -0.04, cumulative: 4.460 },
      { strike: 25600, callGamma: 0.005, putGamma: 0.02, totalGamma: 0.025, netGamma: -0.015, cumulative: 4.485 }
    ],
    implications: [
      "Strong downside protection from put gamma",
      "Limited upside momentum from calls",
      "Price tends to find support at high put gamma levels",
      "Potential for squeeze if price breaks above resistance"
    ]
  },

  neutral: {
    name: "Neutral/Balanced Pattern",
    description: "Balanced gamma distribution around current price",
    data: [
      { strike: 24000, callGamma: 0.01, putGamma: 0.4, totalGamma: 0.41, netGamma: -0.39, cumulative: 0.41 },
      { strike: 24200, callGamma: 0.015, putGamma: 0.35, totalGamma: 0.365, netGamma: -0.335, cumulative: 0.775 },
      { strike: 24400, callGamma: 0.025, putGamma: 0.3, totalGamma: 0.325, netGamma: -0.275, cumulative: 1.100 },
      { strike: 24600, callGamma: 0.035, putGamma: 0.25, totalGamma: 0.285, netGamma: -0.215, cumulative: 1.385 },
      { strike: 24800, callGamma: 0.040, putGamma: 0.2, totalGamma: 0.240, netGamma: -0.16, cumulative: 1.625 },
      { strike: 25000, callGamma: 0.040, putGamma: 0.15, totalGamma: 0.190, netGamma: -0.11, cumulative: 1.815 },
      { strike: 25200, callGamma: 0.035, putGamma: 0.12, totalGamma: 0.155, netGamma: -0.085, cumulative: 1.970 },
      { strike: 25400, callGamma: 0.025, putGamma: 0.10, totalGamma: 0.125, netGamma: -0.075, cumulative: 2.095 },
      { strike: 25600, callGamma: 0.015, putGamma: 0.08, totalGamma: 0.095, netGamma: -0.065, cumulative: 2.190 }
    ],
    implications: [
      "Market in equilibrium state",
      "Range-bound trading likely",
      "Moderate volatility expectations",
      "Breakouts require significant momentum"
    ]
  },

  squeeze: {
    name: "Gamma Squeeze Setup",
    description: "High gamma concentration at current price level",
    data: [
      { strike: 24000, callGamma: 0.02, putGamma: 0.3, totalGamma: 0.32, netGamma: -0.28, cumulative: 0.32 },
      { strike: 24200, callGamma: 0.05, putGamma: 0.4, totalGamma: 0.45, netGamma: -0.35, cumulative: 0.77 },
      { strike: 24400, callGamma: 0.12, putGamma: 0.6, totalGamma: 0.72, netGamma: -0.48, cumulative: 1.49 },
      { strike: 24600, callGamma: 0.25, putGamma: 0.8, totalGamma: 1.05, netGamma: -0.55, cumulative: 2.54 },
      { strike: 24800, callGamma: 0.40, putGamma: 1.0, totalGamma: 1.40, netGamma: -0.60, cumulative: 3.94 },
      { strike: 25000, callGamma: 0.45, putGamma: 0.8, totalGamma: 1.25, netGamma: -0.35, cumulative: 5.19 },
      { strike: 25200, callGamma: 0.30, putGamma: 0.5, totalGamma: 0.80, netGamma: -0.20, cumulative: 5.99 },
      { strike: 25400, callGamma: 0.15, putGamma: 0.3, totalGamma: 0.45, netGamma: -0.15, cumulative: 6.44 },
      { strike: 25600, callGamma: 0.08, putGamma: 0.15, totalGamma: 0.23, netGamma: -0.07, cumulative: 6.67 }
    ],
    implications: [
      "High gamma creates explosive potential",
      "Small price moves can trigger large hedging flows",
      "Increased volatility around gamma peak",
      "Potential for rapid directional moves"
    ]
  },

  lowGamma: {
    name: "Low Gamma Environment",
    description: "Minimal gamma across all strikes - trending market",
    data: [
      { strike: 24000, callGamma: 0.001, putGamma: 0.05, totalGamma: 0.051, netGamma: -0.049, cumulative: 0.051 },
      { strike: 24200, callGamma: 0.002, putGamma: 0.04, totalGamma: 0.042, netGamma: -0.038, cumulative: 0.093 },
      { strike: 24400, callGamma: 0.003, putGamma: 0.035, totalGamma: 0.038, netGamma: -0.032, cumulative: 0.131 },
      { strike: 24600, callGamma: 0.004, putGamma: 0.03, totalGamma: 0.034, netGamma: -0.026, cumulative: 0.165 },
      { strike: 24800, callGamma: 0.005, putGamma: 0.025, totalGamma: 0.030, netGamma: -0.020, cumulative: 0.195 },
      { strike: 25000, callGamma: 0.006, putGamma: 0.02, totalGamma: 0.026, netGamma: -0.014, cumulative: 0.221 },
      { strike: 25200, callGamma: 0.005, putGamma: 0.015, totalGamma: 0.020, netGamma: -0.010, cumulative: 0.241 },
      { strike: 25400, callGamma: 0.004, putGamma: 0.012, totalGamma: 0.016, netGamma: -0.008, cumulative: 0.257 },
      { strike: 25600, callGamma: 0.003, putGamma: 0.01, totalGamma: 0.013, netGamma: -0.007, cumulative: 0.270 }
    ],
    implications: [
      "Low hedging pressure from market makers",
      "Market can trend more freely",
      "Less volatility dampening effect",
      "Fundamental factors drive price more than gamma"
    ]
  }
}; 