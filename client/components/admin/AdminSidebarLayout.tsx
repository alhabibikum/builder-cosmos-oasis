import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import SidebarNav from "@/components/admin/SidebarNav";

export default function AdminSidebarLayout({
  overview,
  customers,
  products,
  orders,
  inventory,
  content,
}: {
  overview: React.ReactNode;
  customers: React.ReactNode;
  products: React.ReactNode;
  orders: React.ReactNode;
  inventory: React.ReactNode;
  content: React.ReactNode;
}) {
  const [tab, setTab] = useState<string>("overview");
  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      orientation="vertical"
      className="grid gap-6 md:gap-8 lg:grid-cols-5"
    >
      <aside className="lg:col-span-1">
        <div className="block lg:hidden mb-6">
          <label className="block text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
            Quick Navigation
          </label>
          <select
            className="w-full h-11 rounded-lg border bg-white px-4 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary"
            value={tab}
            onChange={(e) => setTab(e.target.value)}
          >
            <option value="overview">📊 Overview</option>
            <option value="customers">👥 Customers</option>
            <option value="products">📦 Products</option>
            <option value="orders">🛒 Orders</option>
            <option value="inventory">✅ Inventory</option>
            <option value="content">📝 Posts & Content</option>
          </select>
        </div>
        <div className="hidden lg:block">
          <SidebarNav />
        </div>
      </aside>
      <section className="lg:col-span-4 space-y-6 md:space-y-8">
        <TabsContent value="overview" className="m-0">
          {overview}
        </TabsContent>
        <TabsContent value="customers" className="m-0">
          {customers}
        </TabsContent>
        <TabsContent value="products" className="m-0">
          {products}
        </TabsContent>
        <TabsContent value="orders" className="m-0">
          {orders}
        </TabsContent>
        <TabsContent value="inventory" className="m-0">
          {inventory}
        </TabsContent>
        <TabsContent value="content" className="m-0">
          {content}
        </TabsContent>
      </section>
    </Tabs>
  );
}
