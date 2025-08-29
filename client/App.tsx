import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/site/Layout";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import PlaceholderPage from "@/components/site/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/new" element={<PlaceholderPage title="New Arrivals" />} />
            <Route path="/bestsellers" element={<PlaceholderPage title="Best Sellers" />} />
            <Route path="/sale" element={<PlaceholderPage title="Sale" />} />
            <Route path="/about" element={<PlaceholderPage title="About Us" />} />
            <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
            <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
            <Route path="/policies" element={<PlaceholderPage title="Policies" />} />
            <Route path="/account" element={<PlaceholderPage title="Your Account" />} />
            <Route path="/cart" element={<PlaceholderPage title="Your Cart" />} />
            <Route path="*" element={<PlaceholderPage title="Page Not Found" description="The page you are looking for does not exist." />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
