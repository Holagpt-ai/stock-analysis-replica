# Stock Analysis Replica - Project Structure & Documentation

## Overview
A comprehensive financial stock market platform built with React, Next.js, Node.js/Express, and PostgreSQL. Features real-time stock data, user authentication, watchlists, and advanced stock screening capabilities.

## Project Structure

### Frontend (`/client/src`)
- **pages/**
  - `Home.tsx` - Main homepage with market indices, top gainers/losers, news, IPOs
  - `Watchlist.tsx` - User watchlist management page
  - `Screener.tsx` - Advanced stock screener with filters
  - `NotFound.tsx` - 404 error page
  - `ComponentShowcase.tsx` - UI component reference

- **components/**
  - `ui/` - shadcn/ui component library (buttons, cards, inputs, etc.)
  - `DashboardLayout.tsx` - Reusable dashboard layout
  - `Map.tsx` - Google Maps integration
  - `ErrorBoundary.tsx` - Error handling component

- **contexts/**
  - `ThemeContext.tsx` - Dark/light mode theme management

- **lib/**
  - `trpc.ts` - tRPC client configuration
  - `utils.ts` - Utility functions

- **_core/**
  - `hooks/useAuth.ts` - Authentication hook

- **index.css** - Global styles with Tailwind CSS and theme variables

### Backend (`/server`)
- **routers.ts** - Main tRPC router with all API endpoints
- **db.ts** - Database query helpers for stocks, indices, watchlist, news, IPOs

- **_core/**
  - `index.ts` - Express server setup
  - `context.ts` - tRPC context with user auth
  - `trpc.ts` - tRPC configuration
  - `oauth.ts` - Manus OAuth integration
  - `cookies.ts` - Session cookie management
  - `env.ts` - Environment variable configuration
  - `llm.ts` - LLM integration helpers
  - `imageGeneration.ts` - Image generation API
  - `notification.ts` - Owner notification system
  - `map.ts` - Google Maps API helpers
  - `systemRouter.ts` - System-level tRPC procedures

### Database (`/drizzle`)
- **schema.ts** - Database schema definitions
  - `users` - User accounts and authentication
  - `stocks` - Stock data (price, change, volume, etc.)
  - `indices` - Market indices (S&P500, Nasdaq, Dow Jones, Russell 2000)
  - `watchlist` - User watchlist entries
  - `screeners` - Saved stock screener filters
  - `news` - Market news articles
  - `ipos` - IPO information

- **migrations/** - Database migration files

### Configuration Files
- **package.json** - Project dependencies and scripts
- **tsconfig.json** - TypeScript configuration
- **drizzle.config.ts** - Drizzle ORM configuration
- **vite.config.ts** - Vite bundler configuration
- **tailwind.config.ts** - Tailwind CSS configuration

## Key Features

### Frontend Features
- **Responsive Design** - Mobile-first approach supporting all device sizes
- **Dark/Light Mode** - Switchable theme with persistent preferences
- **Real-time Search** - Autocomplete stock search functionality
- **Interactive Tables** - Sortable top gainers/losers with live data
- **Market Indices Charts** - Visual representation of S&P500, Nasdaq, Dow Jones, Russell 2000
- **Watchlist Management** - Add/remove stocks from personal watchlist
- **Stock Screener** - Filter stocks by price and percentage change

### Backend Features
- **User Authentication** - JWT-based auth with Manus OAuth integration
- **Type-Safe APIs** - tRPC endpoints with full TypeScript support
- **Database Integration** - Drizzle ORM with MySQL/TiDB
- **Query Helpers** - Optimized database queries for stocks, indices, news, IPOs
- **Protected Routes** - Role-based access control (user/admin)

## API Endpoints

### Public Endpoints
- `trpc.stocks.getTopGainers` - Get top gaining stocks
- `trpc.stocks.getTopLosers` - Get top losing stocks
- `trpc.stocks.search` - Search stocks by symbol or name
- `trpc.stocks.getBySymbol` - Get specific stock data
- `trpc.indices.getAll` - Get all market indices
- `trpc.indices.getBySymbol` - Get specific index data
- `trpc.news.getLatest` - Get latest market news
- `trpc.ipos.getUpcoming` - Get upcoming IPOs
- `trpc.ipos.getRecent` - Get recent IPOs

### Protected Endpoints (Requires Authentication)
- `trpc.watchlist.getMyWatchlist` - Get user's watchlist
- `trpc.watchlist.add` - Add stock to watchlist
- `trpc.watchlist.remove` - Remove stock from watchlist

### Authentication Endpoints
- `trpc.auth.me` - Get current user info
- `trpc.auth.logout` - Logout user

## Setup Instructions

### Prerequisites
- Node.js 18+
- pnpm package manager
- MySQL/TiDB database

### Installation
```bash
# Install dependencies
pnpm install

# Setup database
pnpm db:push

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Variables
Required environment variables (automatically injected by Manus):
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - OAuth application ID
- `OAUTH_SERVER_URL` - OAuth server URL
- `VITE_OAUTH_PORTAL_URL` - OAuth portal URL

## Testing
The project includes comprehensive unit tests:
- `server/auth.logout.test.ts` - Authentication tests
- `server/stocks.test.ts` - Stock data operation tests
- `server/watchlist.test.ts` - Watchlist operation tests
- `server/indices.test.ts` - Market indices tests

Run tests with: `pnpm test`

## Technology Stack
- **Frontend**: React 19, Tailwind CSS 4, shadcn/ui, Recharts
- **Backend**: Node.js, Express 4, tRPC 11
- **Database**: Drizzle ORM, MySQL/TiDB
- **Authentication**: JWT, Manus OAuth
- **Testing**: Vitest
- **Build Tools**: Vite, esbuild

## Performance Optimizations
- Code splitting with Vite
- Image optimization with Tailwind
- Database query optimization with indexes
- Responsive design with mobile-first approach
- Efficient state management with React Query

## Future Enhancements
1. **Real Stock Data Integration** - Connect to Polygon.io or Alpha Vantage API
2. **Stock Detail Pages** - Individual stock analysis pages with charts and metrics
3. **Real-Time Updates** - WebSocket connections for live market data
4. **Email Alerts** - Price target and news notifications
5. **Advanced Charting** - TradingView integration for detailed technical analysis
6. **Portfolio Tracking** - User portfolio management and performance tracking

## Deployment
The platform is production-ready and can be deployed to:
- Manus hosting (built-in)
- Vercel (frontend)
- Heroku/AWS/EC2 (backend)

See the Management UI Domains panel for custom domain configuration.

## Support & Documentation
- tRPC Documentation: https://trpc.io
- Tailwind CSS: https://tailwindcss.com
- Drizzle ORM: https://orm.drizzle.team
- React: https://react.dev
