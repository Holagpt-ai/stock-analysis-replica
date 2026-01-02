import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Menu, X, Search, TrendingUp, TrendingDown } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/contexts/ThemeContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock chart data for indices
const mockChartData = [
  { time: "9:30", value: 100 },
  { time: "10:00", value: 102 },
  { time: "10:30", value: 101 },
  { time: "11:00", value: 103 },
  { time: "11:30", value: 102 },
  { time: "12:00", value: 104 },
];

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Fetch data from tRPC
  const topGainers = trpc.stocks.getTopGainers.useQuery({ limit: 10 });
  const topLosers = trpc.stocks.getTopLosers.useQuery({ limit: 10 });
  const indices = trpc.indices.getAll.useQuery();
  const news = trpc.news.getLatest.useQuery({ limit: 10 });
  const upcomingIPOs = trpc.ipos.getUpcoming.useQuery({ limit: 8 });
  const recentIPOs = trpc.ipos.getRecent.useQuery({ limit: 8 });

  // Search functionality
  const searchResults = trpc.stocks.search.useQuery(
    { query: searchQuery, limit: 10 },
    { enabled: searchQuery.length > 0 }
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SA</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">Stock Analysis</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-medium hover:text-primary transition">Home</a>
            <a href="/screener" className="text-sm font-medium hover:text-primary transition">Stocks</a>
            <a href="/watchlist" className="text-sm font-medium hover:text-primary transition">Watchlist</a>
            <a href="/#ipos" className="text-sm font-medium hover:text-primary transition">IPOs</a>
            <a href="/#news" className="text-sm font-medium hover:text-primary transition">News</a>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                className="pl-10 bg-secondary"
                value={searchQuery}
                onChange={handleSearch}
              />
              {showSearchResults && searchResults.data && searchResults.data.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10">
                  {searchResults.data.slice(0, 5).map((stock) => (
                    <div key={stock.id} className="px-4 py-2 hover:bg-secondary cursor-pointer border-b last:border-b-0">
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground">{stock.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-lg transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.location.href = getLoginUrl()}>
                  Login
                </Button>
                <Button size="sm" onClick={() => window.location.href = getLoginUrl()}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-card">
            <div className="container py-4 space-y-3">
              <a href="/" className="block text-sm font-medium hover:text-primary transition">Home</a>
              <a href="/screener" className="block text-sm font-medium hover:text-primary transition">Stocks</a>
              <a href="/watchlist" className="block text-sm font-medium hover:text-primary transition">Watchlist</a>
              <a href="/#ipos" className="block text-sm font-medium hover:text-primary transition">IPOs</a>
              <a href="/#news" className="block text-sm font-medium hover:text-primary transition">News</a>
              <div className="pt-3 border-t border-border space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="text-sm text-muted-foreground">{user?.name}</div>
                    <Button variant="outline" size="sm" onClick={logout} className="w-full">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = getLoginUrl()} className="w-full">
                      Login
                    </Button>
                    <Button size="sm" onClick={() => window.location.href = getLoginUrl()} className="w-full">
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold">Stock Market Analysis</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time stock data, market insights, and investment tools for informed decision-making
          </p>
          
          {/* Search Bar - Mobile */}
          <div className="md:hidden mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                className="pl-10 bg-secondary"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </section>

        {/* Market Indices */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Market Indices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {indices.data?.map((index) => (
              <Card key={index.id} className="hover:shadow-lg transition">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{index.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{index.value.toLocaleString()}</span>
                    <Badge variant={parseFloat(index.changePercent) >= 0 ? "default" : "destructive"}>
                      {parseFloat(index.changePercent) >= 0 ? "+" : ""}{index.changePercent}%
                    </Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={60}>
                    <LineChart data={mockChartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={parseFloat(index.changePercent) >= 0 ? "#22c55e" : "#ef4444"}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Gainers & Losers */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Gainers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-2xl font-bold">Top Gainers</h2>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary">
                        <th className="text-left p-3 font-medium">Symbol</th>
                        <th className="text-right p-3 font-medium">Price</th>
                        <th className="text-right p-3 font-medium">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topGainers.isLoading ? (
                        <tr>
                          <td colSpan={3} className="p-3 text-center text-muted-foreground">Loading...</td>
                        </tr>
                      ) : topGainers.data?.slice(0, 10).map((stock) => (
                        <tr key={stock.id} className="border-b border-border hover:bg-secondary transition">
                          <td className="p-3 font-medium">{stock.symbol}</td>
                          <td className="text-right p-3">${stock.price}</td>
                          <td className="text-right p-3">
                            <Badge variant="default" className="bg-green-600">
                              +{stock.changePercent}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Losers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <h2 className="text-2xl font-bold">Top Losers</h2>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary">
                        <th className="text-left p-3 font-medium">Symbol</th>
                        <th className="text-right p-3 font-medium">Price</th>
                        <th className="text-right p-3 font-medium">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topLosers.isLoading ? (
                        <tr>
                          <td colSpan={3} className="p-3 text-center text-muted-foreground">Loading...</td>
                        </tr>
                      ) : topLosers.data?.slice(0, 10).map((stock) => (
                        <tr key={stock.id} className="border-b border-border hover:bg-secondary transition">
                          <td className="p-3 font-medium">{stock.symbol}</td>
                          <td className="text-right p-3">${stock.price}</td>
                          <td className="text-right p-3">
                            <Badge variant="destructive">
                              {stock.changePercent}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent IPOs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Recent IPOs</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Symbol</th>
                      <th className="text-left p-3 font-medium">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentIPOs.isLoading ? (
                      <tr>
                        <td colSpan={3} className="p-3 text-center text-muted-foreground">Loading...</td>
                      </tr>
                    ) : recentIPOs.data?.slice(0, 8).map((ipo) => (
                      <tr key={ipo.id} className="border-b border-border hover:bg-secondary transition">
                        <td className="p-3">{ipo.ipoDate ? new Date(ipo.ipoDate).toLocaleDateString() : "N/A"}</td>
                        <td className="p-3 font-medium">{ipo.symbol || "N/A"}</td>
                        <td className="p-3">{ipo.companyName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Upcoming IPOs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Upcoming IPOs</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Symbol</th>
                      <th className="text-left p-3 font-medium">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingIPOs.isLoading ? (
                      <tr>
                        <td colSpan={3} className="p-3 text-center text-muted-foreground">Loading...</td>
                      </tr>
                    ) : upcomingIPOs.data?.slice(0, 8).map((ipo) => (
                      <tr key={ipo.id} className="border-b border-border hover:bg-secondary transition">
                        <td className="p-3">{ipo.ipoDate ? new Date(ipo.ipoDate).toLocaleDateString() : "N/A"}</td>
                        <td className="p-3 font-medium">{ipo.symbol || "N/A"}</td>
                        <td className="p-3">{ipo.companyName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Market News */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Market News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.isLoading ? (
              <p className="text-muted-foreground">Loading news...</p>
            ) : news.data?.slice(0, 6).map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {article.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{article.source}</span>
                    <span className="text-muted-foreground">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary mt-16">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <h3 className="font-bold">Markets</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">All Stocks</a></li>
                <li><a href="#" className="hover:text-foreground transition">Stock Screener</a></li>
                <li><a href="#" className="hover:text-foreground transition">Market Movers</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold">IPOs</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">IPO News</a></li>
                <li><a href="#" className="hover:text-foreground transition">Recent IPOs</a></li>
                <li><a href="#" className="hover:text-foreground transition">Upcoming IPOs</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold">Tools</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Watchlist</a></li>
                <li><a href="#" className="hover:text-foreground transition">Stock Analysis</a></li>
                <li><a href="#" className="hover:text-foreground transition">Technical Chart</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Stock Analysis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
