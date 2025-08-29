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
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import NewArrivals from "./pages/NewArrivals";
import BestSellers from "./pages/BestSellers";
import Sale from "./pages/Sale";
import PlaceholderPage from "@/components/site/PlaceholderPage";
import { CartProvider } from "@/store/cart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/new" element={<NewArrivals />} />
              <Route path="/bestsellers" element={<BestSellers />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/about" element={<PlaceholderPage title="About Us" />} />
              <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
              <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
              <Route path="/policies" element={<PlaceholderPage title="Policies" />} />
              <Route path="/account" element={<PlaceholderPage title="Your Account" />} />
              <Route path="*" element={<PlaceholderPage title="Page Not Found" description="The page you are looking for does not exist." />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
