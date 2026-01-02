import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Watchlist() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user's watchlist
  const watchlist = trpc.watchlist.getMyWatchlist.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const removeFromWatchlist = trpc.watchlist.remove.useMutation({
    onSuccess: () => {
      watchlist.refetch();
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Please log in to view your watchlist</h1>
          <Button onClick={() => setLocation("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold">My Watchlist</h1>
          <p className="text-muted-foreground mt-2">Track your favorite stocks and monitor their performance</p>
        </div>
      </div>

      {/* Content */}
      <main className="container py-8">
        {watchlist.isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your watchlist...</p>
          </div>
        ) : watchlist.data && watchlist.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.data.map((item: any) => (
              <Card key={item.watchlist.id} className="hover:shadow-lg transition">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.stocks.symbol}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.stocks.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWatchlist.mutate({ stockId: item.stocks.id })}
                      disabled={removeFromWatchlist.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${item.stocks.price}</span>
                    <Badge variant={parseFloat(item.stocks.changePercent) >= 0 ? "default" : "destructive"}>
                      {parseFloat(item.stocks.changePercent) >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {parseFloat(item.stocks.changePercent) >= 0 ? "+" : ""}{item.stocks.changePercent}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Change</p>
                      <p className="font-medium">${item.stocks.change}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-medium">{item.stocks.volume || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
            <Button onClick={() => setLocation("/")}>Browse Stocks</Button>
          </div>
        )}
      </main>
    </div>
  );
}
