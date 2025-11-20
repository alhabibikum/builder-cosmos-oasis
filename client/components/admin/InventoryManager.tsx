import { useMemo, useState } from "react";
import { getProducts, getProductById } from "@/lib/catalog";
import {
  getStock,
  setStock,
  adjustStock,
  getThreshold,
  setThreshold,
  getInventoryHistory,
  type InventoryEvent,
} from "@/lib/inventory";
import { formatCurrency } from "@/lib/money";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function InventoryManager() {
  const [selected, setSelected] = useState<string>("");
  const products = getProducts({ includeHidden: true });

  const lowStock = useMemo(() => {
    return products
      .map((p) => {
        const th = getThreshold(p.id);
        if (p.sizes && p.sizes.length) {
          const lows = p.sizes.filter((s) => getStock(p.id, s as any) <= th);
          return lows.length
            ? { id: p.id, title: p.title, sizes: lows, threshold: th }
            : null;
        }
        const qty = getStock(p.id);
        return qty <= th
          ? { id: p.id, title: p.title, sizes: [], threshold: th }
          : null;
      })
      .filter(Boolean) as {
      id: string;
      title: string;
      sizes: string[];
      threshold: number;
    }[];
  }, [products]);

  const totalUnits = useMemo(() => {
    return products.reduce((sum, p) => {
      if (p.sizes && p.sizes.length)
        return (
          sum + p.sizes.reduce((s, sz) => s + getStock(p.id, sz as any), 0)
        );
      return sum + getStock(p.id);
    }, 0);
  }, [products]);

  const history = getInventoryHistory();
  const chartData = useMemo(
    () => buildChartData(selected, history),
    [selected, history],
  );

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Low Stock Items" value={lowStock.length.toString()} icon="alert" />
        <Card title="Total Units In Stock" value={totalUnits.toString()} icon="package" />
        <Card title="Products Managed" value={products.length.toString()} icon="box" />
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="border-b p-4 font-semibold text-foreground">Low Stock Alerts</div>
        <div className="divide-y">
          {lowStock.map((l) => (
            <div
              key={l.id}
              className="grid gap-3 p-4 md:grid-cols-3 md:items-center"
            >
              <div>
                <div className="font-semibold line-clamp-1 text-foreground">{l.title}</div>
                <div className="text-xs text-muted-foreground">{l.id}</div>
              </div>
              <div className="text-sm font-medium text-red-600">
                {l.sizes.length ? (
                  <span>Low: {l.sizes.join(", ")}</span>
                ) : (
                  <span>Low total stock</span>
                )}
              </div>
              <div className="flex items-center gap-2 md:justify-end">
                <label className="text-xs text-muted-foreground">Min:</label>
                <input
                  type="number"
                  className="h-9 w-20 rounded-lg border px-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  defaultValue={l.threshold}
                  onBlur={(e) =>
                    setThreshold(l.id, Number(e.target.value) || 0)
                  }
                />
                <button
                  className="h-9 rounded-lg border px-3 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setSelected(l.id)}
                >
                  Chart
                </button>
              </div>
            </div>
          ))}
          {lowStock.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No low stock alerts.
            </div>
          )}
        </div>
      </div>

      <StockAdjuster onSelect={(id) => setSelected(id)} />

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="border-b p-4 font-semibold text-foreground">Inventory Trends</div>
        <div className="p-4">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            <label className="text-xs font-medium text-foreground">Product</label>
            <select
              className="h-10 flex-1 rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">�� Select a product —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          {selected ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="qty"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Select a product to view trends.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="border-b p-4 font-semibold text-foreground">Recent Adjustments</div>
        <div className="divide-y max-h-[400px] overflow-y-auto">
          {history.slice(0, 50).map((h, i) => (
            <div
              key={i}
              className="grid gap-2 p-4 text-sm md:grid-cols-5 md:items-center md:gap-0"
            >
              <div className="md:col-span-2">
                <div className="font-semibold line-clamp-1 text-foreground">
                  {getProductById(h.id)?.title || h.id}
                </div>
                <div className="text-xs text-muted-foreground">
                  {h.id}
                  {h.size ? ` • ${h.size}` : ""}
                </div>
              </div>
              <div className={`font-semibold ${h.delta < 0 ? "text-red-600" : "text-green-600"}`}>
                {h.delta > 0 ? `+${h.delta}` : h.delta}
              </div>
              <div className="text-foreground font-medium">Qty: {h.qtyAfter}</div>
              <div className="text-right text-xs text-muted-foreground">
                {new Date(h.at).toLocaleString()}
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No history yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon }: { title: string; value: string; icon?: string }) {
  return (
    <div className="rounded-xl border bg-white p-5 md:p-6 transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">{value}</h3>
        </div>
        <div className="rounded-lg bg-accent/10 p-3">
          {icon === 'alert' && (
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0-10a9 9 0 110 18 9 9 0 010-18z" />
            </svg>
          )}
          {icon === 'package' && (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 10v10l8 4" />
            </svg>
          )}
          {icon === 'box' && (
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9-4v4m0 0v4" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

function StockAdjuster({ onSelect }: { onSelect: (id: string) => void }) {
  const products = getProducts({ includeHidden: true });
  const [pid, setPid] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [mode, setMode] = useState<"set" | "adjust">("adjust");
  const [value, setValue] = useState<number>(0);
  const [reason, setReason] = useState<string>("");

  const p = products.find((x) => x.id === pid);

  const apply = () => {
    if (!pid) return alert("Select a product");
    if (mode === "set") {
      setStock(pid, value, size as any, reason || undefined);
    } else {
      adjustStock(pid, value, size as any, reason || undefined);
    }
    onSelect(pid);
    alert("Inventory updated");
  };

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div className="border-b p-4 font-semibold text-foreground">Stock Adjustment</div>
      <div className="grid gap-3 p-4 md:grid-cols-5 md:items-end md:gap-2">
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-medium text-foreground">Product</span>
          <select
            className="h-10 rounded-lg border px-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={pid}
            onChange={(e) => setPid(e.target.value)}
          >
            <option value="">— Select —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        {p?.sizes?.length ? (
          <label className="grid gap-1 text-sm">
            <span className="text-xs font-medium text-foreground">Size</span>
            <select
              className="h-10 rounded-lg border px-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">— Any —</option>
              {p.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div />
        )}
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-medium text-foreground">Mode</span>
          <select
            className="h-10 rounded-lg border px-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="adjust">Adjust ±</option>
            <option value="set">Set Qty</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs font-medium text-foreground">
            {mode === "set" ? "Qty" : "Δ"}
          </span>
          <input
            type="number"
            className="h-10 rounded-lg border px-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={value}
            onChange={(e) => setValue(Number(e.target.value) || 0)}
          />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="text-xs font-medium text-foreground">Reason (optional)</span>
          <input
            className="h-10 rounded-lg border px-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
        <div className="md:col-span-5">
          <button
            className="h-10 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={apply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function buildChartData(id: string, history: InventoryEvent[]) {
  if (!id) return [] as { time: string; qty: number }[];
  const data = history
    .filter((h) => h.id === id)
    .slice()
    .reverse();
  let qty = 0;
  const points = data.map((h) => {
    qty = h.qtyAfter; // since sorted ascending by time
    return { time: new Date(h.at).toLocaleDateString(), qty };
  });
  // collapse by day
  const map = new Map<string, number>();
  points.forEach((p) => map.set(p.time, p.qty));
  return Array.from(map.entries()).map(([time, qty]) => ({ time, qty }));
}
