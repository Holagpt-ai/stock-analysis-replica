import { ENV } from "./_core/env";

const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";
const FMP_API_KEY = process.env.FMP_API_KEY;

interface StockQuote {
  symbol: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  sharesOutstanding: number;
  timestamp: number;
}

interface IndexQuote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
}

/**
 * Fetch real-time stock quote data from FMP API
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  if (!FMP_API_KEY) {
    console.warn("[FMP] API key not configured");
    return null;
  }

  try {
    const url = `${FMP_BASE_URL}/quote/${symbol}?apikey=${FMP_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[FMP] Failed to fetch ${symbol}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error(`[FMP] Error fetching stock ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch multiple stock quotes
 */
export async function getStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  if (!FMP_API_KEY) {
    console.warn("[FMP] API key not configured");
    return [];
  }

  try {
    const symbolsStr = symbols.join(",");
    const url = `${FMP_BASE_URL}/quote/${symbolsStr}?apikey=${FMP_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[FMP] Failed to fetch quotes: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[FMP] Error fetching stock quotes:", error);
    return [];
  }
}

/**
 * Fetch top gainers
 */
export async function getTopGainers(): Promise<StockQuote[]> {
  if (!FMP_API_KEY) {
    console.warn("[FMP] API key not configured");
    return [];
  }

  try {
    const url = `${FMP_BASE_URL}/gainers?apikey=${FMP_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[FMP] Failed to fetch gainers: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data.slice(0, 20) : [];
  } catch (error) {
    console.error("[FMP] Error fetching top gainers:", error);
    return [];
  }
}

/**
 * Fetch top losers
 */
export async function getTopLosers(): Promise<StockQuote[]> {
  if (!FMP_API_KEY) {
    console.warn("[FMP] API key not configured");
    return [];
  }

  try {
    const url = `${FMP_BASE_URL}/losers?apikey=${FMP_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[FMP] Failed to fetch losers: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data.slice(0, 20) : [];
  } catch (error) {
    console.error("[FMP] Error fetching top losers:", error);
    return [];
  }
}

/**
 * Fetch market indices (S&P 500, Nasdaq, Dow Jones, Russell 2000)
 */
export async function getMarketIndices(): Promise<IndexQuote[]> {
  if (!FMP_API_KEY) {
    console.warn("[FMP] API key not configured");
    return [];
  }

  const indices = ["^GSPC", "^IXIC", "^DJI", "^RUT"]; // S&P 500, Nasdaq, Dow Jones, Russell 2000
  const quotes = await getStockQuotes(indices);

  return quotes.map((quote) => ({
    symbol: quote.symbol,
    name: getIndexName(quote.symbol),
    price: quote.price,
    changesPercentage: quote.changesPercentage,
    change: quote.change,
  }));
}

/**
 * Get human-readable name for index symbol
 */
function getIndexName(symbol: string): string {
  const names: Record<string, string> = {
    "^GSPC": "S&P 500",
    "^IXIC": "Nasdaq Composite",
    "^DJI": "Dow Jones",
    "^RUT": "Russell 2000",
  };
  return names[symbol] || symbol;
}

/**
 * Search for stocks by query
 */
export async function searchStocks(query: string): Promise<StockQuote[]> {
  if (!FMP_API_KEY) {
    console.warn("[FMP] API key not configured");
    return [];
  }

  try {
    const url = `${FMP_BASE_URL}/search?query=${query}&limit=20&apikey=${FMP_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[FMP] Failed to search stocks: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    
    // Search returns different format, need to fetch quotes for each symbol
    if (Array.isArray(data) && data.length > 0) {
      const symbols = data.map((item: any) => item.symbol).slice(0, 10);
      return getStockQuotes(symbols);
    }

    return [];
  } catch (error) {
    console.error("[FMP] Error searching stocks:", error);
    return [];
  }
}

/**
 * Fetch company profile
 */
export async function getCompanyProfile(symbol: string): Promise<any | null> {
  if (!FMP_API_KEY) {
    console.warn("[FMP] API key not configured");
    return null;
  }

  try {
    const url = `${FMP_BASE_URL}/profile/${symbol}?apikey=${FMP_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[FMP] Failed to fetch profile for ${symbol}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error(`[FMP] Error fetching company profile for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch historical price data
 */
export async function getHistoricalPrices(symbol: string, limit: number = 100): Promise<any[]> {
  if (!FMP_API_KEY) {
    console.warn("[FMP] API key not configured");
    return [];
  }

  try {
    const url = `${FMP_BASE_URL}/historical-price-full/${symbol}?limit=${limit}&apikey=${FMP_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[FMP] Failed to fetch historical prices for ${symbol}: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.historical || [];
  } catch (error) {
    console.error(`[FMP] Error fetching historical prices for ${symbol}:`, error);
    return [];
  }
}
