import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
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

const queryClient = new QueryClient();

const App = () => (
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
              <Route
                path="/profiles"
                element={
                  <Placeholder
                    title="My Dogs"
                    description="Manage your dog profiles and measurements"
                    suggestedActions={[
                      "Add detailed measurements for perfect fit",
                      "Upload photos of your furry friends",
                      "Save multiple design templates",
                    ]}
                  />
                }
              />
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
                    description="Access your Dogzilla account"
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
                    description="Create your Dogzilla account"
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

createRoot(document.getElementById("root")!).render(<App />);
