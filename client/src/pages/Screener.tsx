import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, TrendingUp, TrendingDown, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Screener() {
  const [, setLocation] = useLocation();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minChange, setMinChange] = useState("");
  const [maxChange, setMaxChange] = useState("");

  // Fetch all stocks for filtering
  const topGainers = trpc.stocks.getTopGainers.useQuery({ limit: 100 });
  const topLosers = trpc.stocks.getTopLosers.useQuery({ limit: 100 });

  // Combine and filter stocks
  const allStocks = [...(topGainers.data || []), ...(topLosers.data || [])];
  const uniqueStocks = Array.from(
    new Map(allStocks.map((stock) => [stock.id, stock])).values()
  );

  const filteredStocks = uniqueStocks.filter((stock) => {
    const price = parseFloat(stock.price);
    const change = parseFloat(stock.changePercent);

    if (minPrice && price < parseFloat(minPrice)) return false;
    if (maxPrice && price > parseFloat(maxPrice)) return false;
    if (minChange && change < parseFloat(minChange)) return false;
    if (maxChange && change > parseFloat(maxChange)) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-secondary">
        <div className="container py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={() => setLocation("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Stock Screener</h1>
          <p className="text-muted-foreground mt-2">Filter and discover stocks based on your criteria</p>
        </div>
      </div>

      {/* Content */}
      <main className="container py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Stocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Min Price ($)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Max Price ($)</label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Min Change (%)</label>
                <Input
                  type="number"
                  placeholder="-100"
                  value={minChange}
                  onChange={(e) => setMinChange(e.target.value)}
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Max Change (%)</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={maxChange}
                  onChange={(e) => setMaxChange(e.target.value)}
                  step="0.1"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                  setMinChange("");
                  setMaxChange("");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
              <div className="text-sm text-muted-foreground ml-auto flex items-center">
                {filteredStocks.length} stocks found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="text-left p-3 font-medium">Symbol</th>
                    <th className="text-left p-3 font-medium">Company</th>
                    <th className="text-right p-3 font-medium">Price</th>
                    <th className="text-right p-3 font-medium">Change</th>
                    <th className="text-right p-3 font-medium">% Change</th>
                    <th className="text-right p-3 font-medium">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {topGainers.isLoading || topLosers.isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-3 text-center text-muted-foreground">
                        Loading stocks...
                      </td>
                    </tr>
                  ) : filteredStocks.length > 0 ? (
                    filteredStocks.map((stock) => (
                      <tr key={stock.id} className="border-b border-border hover:bg-secondary transition cursor-pointer">
                        <td className="p-3 font-medium">{stock.symbol}</td>
                        <td className="p-3">{stock.name}</td>
                        <td className="text-right p-3">${stock.price}</td>
                        <td className="text-right p-3">${stock.change}</td>
                        <td className="text-right p-3">
                          <Badge variant={parseFloat(stock.changePercent) >= 0 ? "default" : "destructive"}>
                            {parseFloat(stock.changePercent) >= 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {parseFloat(stock.changePercent) >= 0 ? "+" : ""}{stock.changePercent}%
                          </Badge>
                        </td>
                        <td className="text-right p-3 text-muted-foreground">{stock.volume || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-3 text-center text-muted-foreground">
                        No stocks match your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
