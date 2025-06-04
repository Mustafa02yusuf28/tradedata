# Trading Platform

A modern, multipurpose trading information platform that serves as a comprehensive resource for traders and investors.

## Features

- **Strategies**: Data-driven verified trading strategies with performance metrics
- **News**: Real-time market news and updates
- **Events**: Economic calendar and market-moving events
- **Community**: Discussion forums and knowledge sharing

## Tech Stack

### Frontend
- React.js with TypeScript
- Redux Toolkit for state management
- Tailwind CSS with shadcn/ui
- TradingView widgets for charts

### Backend
- Node.js with Express
- PostgreSQL database
- Redis for caching
- WebSocket for real-time updates

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd trading-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development servers:
```bash
npm run dev
```

## Project Structure

```
trading-platform/
├── client/          # Frontend application
├── server/          # Backend application
├── shared/          # Shared utilities and types
└── docs/            # Documentation
```

## Development

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linting

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 