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
    <Tabs value={tab} onValueChange={setTab} orientation="vertical" className="grid gap-4 md:grid-cols-5">
      <aside className="md:col-span-1">
        <div className="mb-2 md:hidden">
          <label className="text-xs text-muted-foreground">Section</label>
          <select className="mt-1 h-10 w-full rounded-md border px-2 text-sm" value={tab} onChange={(e) => setTab(e.target.value)}>
            <option value="overview">Overview</option>
            <option value="customers">Customers</option>
            <option value="products">Products</option>
            <option value="orders">Orders</option>
            <option value="inventory">Inventory</option>
            <option value="content">Posts & Content</option>
          </select>
        </div>
        <div className="hidden md:block">
          <SidebarNav />
        </div>
      </aside>
      <section className="md:col-span-4">
        <TabsContent value="overview">{overview}</TabsContent>
        <TabsContent value="customers">{customers}</TabsContent>
        <TabsContent value="products">{products}</TabsContent>
        <TabsContent value="orders">{orders}</TabsContent>
        <TabsContent value="inventory">{inventory}</TabsContent>
        <TabsContent value="content">{content}</TabsContent>
      </section>
    </Tabs>
  );
}
