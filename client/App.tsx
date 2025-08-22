import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import DesignStudio from "./pages/DesignStudio";
import Profiles from "./pages/Profiles";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import Orders from "./pages/Orders";
import Measurements from "./pages/Measurements";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/customize" element={<DesignStudio />} />
                <Route path="/profiles" element={<Profiles />} />
                <Route path="/measurements" element={<Measurements />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/tracking/:orderId" element={<OrderTracking />} />
                <Route
                  path="/orders"
                  element={
                    <Placeholder
                      title="Order History"
                      description="Track your orders and manage deliveries"
                      suggestedActions={[
                        "View order status and tracking",
                        "Reorder your favorite designs",
                        "Leave reviews for completed orders",
                      ]}
                    />
                  }
                />
                <Route
                  path="/login"
                  element={
                    <Placeholder
                      title="Sign In"
                      description="Access your JOGGYDOGGY account"
                      suggestedActions={[
                        "Sign in with Google, Facebook, or Apple",
                        "Access your saved dog profiles",
                        "Continue your design projects",
                      ]}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <Placeholder
                      title="Get Started"
                      description="Create your JOGGYDOGGY account"
                      suggestedActions={[
                        "Join thousands of happy pet parents",
                        "Get exclusive access to new styles",
                        "Save your designs and measurements",
                      ]}
                    />
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
