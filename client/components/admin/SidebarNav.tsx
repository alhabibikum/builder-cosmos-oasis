import { useContext } from "react";
import { Tabs } from "@/components/ui/tabs";

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M3 20.394A9.969 9.969 0 0112 21c4.904 0 9.26-2.354 11.996-5.951M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        <div className="mb-4 text-xs font-semibold text-foreground uppercase tracking-wide">
          Sections
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:grid-cols-1 md:gap-3">
          {items.map((item) => (
            <NavCard key={item.value} item={item} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavCard({ item }: { item: NavItem }) {
  const tabsContext = useContext(Tabs);

  return (
    <button
      onClick={() => {
        const tabsElement = document.querySelector('[role="tablist"]');
        if (tabsElement) {
          const trigger = tabsElement.querySelector(`[value="${item.value}"]`);
          if (trigger instanceof HTMLElement) {
            trigger.click();
          }
        }
      }}
      className="group relative p-3 rounded-lg border bg-gradient-to-br from-white to-gray-50 transition-all hover:border-primary hover:shadow-md hover:from-primary/5"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            {item.icon}
          </div>
        </div>
        <div className="text-left flex-1 min-w-0">
          <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
            {item.label}
          </div>
          {item.description && (
            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {item.description}
            </div>
          )}
        </div>
      </div>
      <div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
    </button>
  );
}
