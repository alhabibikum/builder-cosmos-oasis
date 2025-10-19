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
      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Low Stock Items" value={lowStock.length.toString()} />
        <Card title="Total Units In Stock" value={totalUnits.toString()} />
        <Card title="Products Managed" value={products.length.toString()} />
      </div>

      <div className="rounded-xl border">
        <div className="border-b p-3 font-semibold">Alerts</div>
        <div className="divide-y">
          {lowStock.map((l) => (
            <div
              key={l.id}
              className="grid gap-2 p-3 md:grid-cols-3 md:items-center"
            >
              <div>
                <div className="font-semibold line-clamp-1">{l.title}</div>
                <div className="text-xs text-muted-foreground">{l.id}</div>
              </div>
              <div className="text-sm text-red-600">
                {l.sizes.length ? (
                  <span>Low sizes: {l.sizes.join(", ")}</span>
                ) : (
                  <span>Low total stock</span>
                )}
              </div>
              <div className="flex items-center gap-2 md:justify-end">
                <label className="text-xs">Threshold</label>
                <input
                  type="number"
                  className="h-8 w-20 rounded-md border px-2 text-sm"
                  defaultValue={l.threshold}
                  onBlur={(e) =>
                    setThreshold(l.id, Number(e.target.value) || 0)
                  }
                />
                <button
                  className="rounded-md border px-2 py-1 text-xs"
                  onClick={() => setSelected(l.id)}
                >
                  View Trends
                </button>
              </div>
            </div>
          ))}
          {lowStock.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No low stock alerts.
            </div>
          )}
        </div>
      </div>

      <StockAdjuster onSelect={(id) => setSelected(id)} />

      <div className="rounded-xl border">
        <div className="border-b p-3 font-semibold">Inventory Trends</div>
        <div className="p-3">
          <div className="mb-2 flex items-center gap-2 text-sm">
            <label className="text-xs">Product</label>
            <select
              className="h-9 rounded-md border px-2 text-sm"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">— Select a product —</option>
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
            <div className="p-4 text-center text-sm text-muted-foreground">
              Select a product to view trends.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="border-b p-3 font-semibold">Recent Adjustments</div>
        <div className="divide-y">
          {history.slice(0, 50).map((h, i) => (
            <div
              key={i}
              className="grid gap-1 p-3 text-sm md:grid-cols-5 md:items-center"
            >
              <div className="md:col-span-2">
                <div className="font-medium line-clamp-1">
                  {getProductById(h.id)?.title || h.id}
                </div>
                <div className="text-xs text-muted-foreground">
                  {h.id}
                  {h.size ? ` • ${h.size}` : ""}
                </div>
              </div>
              <div className={h.delta < 0 ? "text-red-600" : "text-green-600"}>
                {h.delta > 0 ? `+${h.delta}` : h.delta}
              </div>
              <div className="text-muted-foreground">Qty: {h.qtyAfter}</div>
              <div className="text-right text-xs text-muted-foreground">
                {new Date(h.at).toLocaleString()}
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No history yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border p-4 transition-shadow hover:shadow-sm">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
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
    <div className="rounded-xl border">
      <div className="border-b p-3 font-semibold">Stock Adjustment</div>
      <div className="grid gap-3 p-3 md:grid-cols-5 md:items-end">
        <label className="grid gap-1 text-sm">
          <span className="text-xs">Product</span>
          <select
            className="h-10 rounded-md border px-2"
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
            <span className="text-xs">Size</span>
            <select
              className="h-10 rounded-md border px-2"
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
          <span className="text-xs">Mode</span>
          <select
            className="h-10 rounded-md border px-2"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="adjust">Adjust by ±</option>
            <option value="set">Set absolute</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-xs">
            {mode === "set" ? "Quantity" : "Delta"}
          </span>
          <input
            type="number"
            className="h-10 rounded-md border px-2"
            value={value}
            onChange={(e) => setValue(Number(e.target.value) || 0)}
          />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          <span className="text-xs">Reason (optional)</span>
          <input
            className="h-10 rounded-md border px-2"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
        <div className="md:col-span-5">
          <button
            className="rounded-md border px-3 py-2 text-sm"
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
