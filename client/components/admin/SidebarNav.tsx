import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SidebarNav() {
  const items: { value: string; label: string; icon?: React.ReactNode }[] = [
    { value: "overview", label: "Overview" },
    { value: "customers", label: "Customers" },
    { value: "products", label: "Products" },
    { value: "orders", label: "Orders" },
    { value: "inventory", label: "Inventory" },
    { value: "content", label: "Posts & Content" },
  ];
  return (
    <nav aria-label="Admin sections" className="sticky top-16">
      <TabsList className="flex w-full flex-col gap-1 rounded-xl border bg-sidebar p-2 text-sm">
        {items.map((it) => (
          <TabsTrigger
            key={it.value}
            value={it.value}
            className="justify-start rounded-lg px-3 py-2 text-left data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground data-[state=active]:shadow-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {it.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </nav>
  );
}
