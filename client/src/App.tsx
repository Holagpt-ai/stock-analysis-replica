import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import DashboardLayout from "./components/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import Screener from "./pages/Screener";

function withDashboardLayout(Component: React.ComponentType) {
  return function Wrapped() {
    return (
      <DashboardLayout>
        <Component />
      </DashboardLayout>
    );
  };
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={withDashboardLayout(Home)} />
      <Route path={""} component={withDashboardLayout(Home)} />
      <Route path={"/watchlist"} component={withDashboardLayout(Watchlist)} />
      <Route path={"/screener"} component={withDashboardLayout(Screener)} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
