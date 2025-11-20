import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NavItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

export default function SidebarNav() {
  const items: NavItem[] = [
    {
      value: "overview",
      label: "Overview",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: "Dashboard stats",
    },
    {
      value: "customers",
      label: "Customers",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M7 20H2v-2a3 3 0 015.856-1.487M15 7a3 3 0 11-6 0 3 3 0 016 0zM4 9a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: "Manage customers",
    },
    {
      value: "products",
      label: "Products",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4" />
        </svg>
      ),
      description: "Edit inventory",
    },
    {
      value: "orders",
      label: "Orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      description: "View & manage",
    },
    {
      value: "inventory",
      label: "Inventory",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Stock levels",
    },
    {
      value: "content",
      label: "Posts & Content",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v4m5 0v8m-5-8a2 2 0 012-2h2.5M8 8h6" />
        </svg>
      ),
      description: "Blog & pages",
    },
  ];

  return (
    <nav aria-label="Admin sections" className="sticky top-16">
      <div className="rounded-xl border bg-white p-3 md:p-4">
        <div className="mb-4 text-xs font-semibold text-foreground uppercase tracking-wide px-2">
          Sections
        </div>
        <TabsList className="flex flex-col w-full gap-2 md:gap-2.5 rounded-xl border-0 bg-transparent p-0">
          {items.map((item) => (
            <NavCard key={item.value} item={item} />
          ))}
        </TabsList>
      </div>
    </nav>
  );
}

function NavCard({ item }: { item: NavItem }) {
  return (
    <TabsTrigger
      value={item.value}
      className="group relative p-3 rounded-lg border bg-gradient-to-br from-white to-gray-50 transition-all justify-start text-left data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white data-[state=active]:border-primary hover:border-primary hover:shadow-md hover:from-primary/5 data-[state=active]:shadow-md"
    >
      <div className="flex items-start gap-3 w-full">
        <div className="flex-shrink-0 mt-0.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white transition-colors">
            {item.icon}
          </div>
        </div>
        <div className="text-left flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground group-data-[state=active]:text-white transition-colors">
            {item.label}
          </div>
          {item.description && (
            <div className="text-xs text-muted-foreground group-data-[state=active]:text-white/80 mt-0.5 line-clamp-1">
              {item.description}
            </div>
          )}
        </div>
      </div>
    </TabsTrigger>
  );
}
