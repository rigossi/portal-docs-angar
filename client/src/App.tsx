import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Intro from "./pages/Intro";
import Autenticacao from "./pages/Autenticacao";
import Propostas from "./pages/Propostas";
import Webhooks from "./pages/Webhooks";
import GuiaCompleto from "./pages/GuiaCompleto";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Intro} />
      <Route path="/autenticacao" component={Autenticacao} />
      <Route path="/propostas" component={Propostas} />
      <Route path="/webhooks" component={Webhooks} />
      <Route path="/guia-completo" component={GuiaCompleto} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
