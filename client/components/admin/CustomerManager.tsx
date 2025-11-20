import { useEffect, useMemo, useState } from "react";
import {
  loadCustomers,
  saveCustomers,
  upsertCustomer,
  deleteCustomer,
  addInteraction,
  type CustomerProfile,
  type CustomerStatus,
  getPurchaseStats,
} from "@/lib/customers";
import { formatCurrency } from "@/lib/money";

const STATUSES: CustomerStatus[] = [
  "lead",
  "active",
  "vip",
  "inactive",
  "banned",
];

export default function CustomerManager() {
  const [list, setList] = useState<CustomerProfile[]>(loadCustomers());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "all">("all");
  const [minOrders, setMinOrders] = useState<number>(0);
  const [minSpent, setMinSpent] = useState<number>(0);
  const [editing, setEditing] = useState<CustomerProfile | null>(null);
  const stats = useMemo(() => getPurchaseStats(), [list]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "customers") setList(loadCustomers());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return list.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (q) {
        const inText = [c.name, c.email, c.phone, (c.tags || []).join(" ")]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!inText.includes(q)) return false;
      }
      const key = c.email?.toLowerCase() || c.phone || "";
      const st = stats[key] || { orders: 0, spent: 0 };
      if (st.orders < minOrders) return false;
      if (st.spent < minSpent) return false;
      return true;
    });
  }, [list, query, status, minOrders, minSpent, stats]);

  const onNew = () =>
    setEditing({
      id: "",
      name: "",
      email: "",
      phone: "",
      status: "lead",
      tags: [],
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

  const persist = () => {
    if (!editing) return;
    if (!editing.name.trim()) return alert("Name is required");
    const next = upsertCustomer(editing);
    setList(next);
    const saved = editing.id ? next.find((c) => c.id === editing.id) : next[0];
    setEditing(saved || null);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this customer?")) return;
    setList(deleteCustomer(id));
    if (editing?.id === id) setEditing(null);
  };

  const exportJson = () => alert(JSON.stringify(list, null, 2));
  const importJson = () => {
    const text = prompt("Paste customers JSON array");
    if (!text) return;
    try {
      const arr = JSON.parse(text);
      if (!Array.isArray(arr)) throw new Error("Invalid JSON");
      saveCustomers(arr);
      setList(loadCustomers());
    } catch {
      alert("Invalid JSON");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="md:col-span-2 rounded-xl border bg-white overflow-hidden">
        <div className="flex flex-col gap-2 border-b p-4 md:gap-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers..."
            className="h-10 rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Search customers"
          />
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="h-10 flex-1 rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Status filter"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              className="h-10 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={onNew}
            >
              New
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-b p-4 text-xs md:flex-row md:gap-1">
          <label className="inline-flex items-center gap-2">
            Min Orders
            <input
              type="number"
              className="h-9 w-20 rounded-lg border px-2"
              value={minOrders}
              onChange={(e) => setMinOrders(Number(e.target.value) || 0)}
              min={0}
            />
          </label>
          <label className="inline-flex items-center gap-2">
            Min Spent
            <input
              type="number"
              className="h-9 w-24 rounded-lg border px-2"
              value={minSpent}
              onChange={(e) => setMinSpent(Number(e.target.value) || 0)}
              min={0}
            />
          </label>
          <div className="ml-auto flex items-center gap-1">
            <button
              className="h-9 rounded-lg border px-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={exportJson}
            >
              Export
            </button>
            <button
              className="h-9 rounded-lg border px-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={importJson}
            >
              Import
            </button>
          </div>
        </div>
        <div className="divide-y max-h-[600px] overflow-y-auto">
          {filtered.map((c) => {
            const key = c.email?.toLowerCase() || c.phone || "";
            const st = stats[key] || { orders: 0, spent: 0 };
            return (
              <button
                key={c.id}
                onClick={() => setEditing(c)}
                className={`w-full p-4 text-left text-sm transition-all hover:bg-accent/10 ${
                  editing?.id === c.id
                    ? "bg-primary/5 border-l-2 border-primary"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="font-semibold line-clamp-1 text-foreground">
                    {c.name}
                  </div>
                  <span
                    className={`rounded-lg px-2 py-1 text-xs font-medium capitalize ${
                      c.status === "vip"
                        ? "bg-amber-100 text-amber-700"
                        : c.status === "active"
                          ? "bg-green-100 text-green-700"
                          : c.status === "lead"
                            ? "bg-blue-100 text-blue-700"
                            : c.status === "inactive"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground line-clamp-1 mb-1">
                  {c.email || "—"} • {c.phone || "—"}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {st.orders} orders • {formatCurrency(st.spent)} spent
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No customers found.
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-3 rounded-xl border bg-white overflow-hidden flex flex-col">
        <div className="border-b p-4 font-semibold text-foreground">
          Customer Profile
        </div>
        {!editing ? (
          <div className="flex-1 flex items-center justify-center p-8 text-sm text-muted-foreground">
            Select a customer to view or create a new one.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto grid gap-3 p-4 md:p-6">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Name">
                <input
                  className="h-10 w-full rounded-md border px-2"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
              </Field>
              <Field label="Status">
                <select
                  className="h-10 w-full rounded-md border px-2"
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      status: e.target.value as CustomerStatus,
                    })
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Email">
                <input
                  className="h-10 w-full rounded-md border px-2"
                  value={editing.email || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, email: e.target.value })
                  }
                />
              </Field>
              <Field label="Phone">
                <input
                  className="h-10 w-full rounded-md border px-2"
                  value={editing.phone || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, phone: e.target.value })
                  }
                />
              </Field>
              <Field label="Tags (comma separated)">
                <input
                  className="h-10 w-full rounded-md border px-2"
                  value={(editing.tags || []).join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </Field>
            </div>
            <Field label="Notes">
              <textarea
                className="min-h-[90px] w-full rounded-md border p-2"
                value={editing.notes || ""}
                onChange={(e) =>
                  setEditing({ ...editing, notes: e.target.value })
                }
              />
            </Field>

            <div className="flex items-center gap-2 border-t pt-3">
              <button
                className="rounded-md border px-3 py-2 text-sm"
                onClick={persist}
              >
                Save
              </button>
              {editing.id && (
                <button
                  className="rounded-md border px-3 py-2 text-sm text-red-600"
                  onClick={() => remove(editing.id)}
                >
                  Delete
                </button>
              )}
            </div>

            {editing.id && (
              <div className="grid gap-2 border-t pt-3">
                <div className="text-sm font-medium">Recent Interactions</div>
                <InteractionComposer
                  onAdd={(t, note) =>
                    setList(addInteraction(editing.id!, { type: t, note }))
                  }
                />
                <div className="divide-y rounded-md border">
                  {(editing.interactions || []).map((i) => (
                    <div key={i.id} className="grid gap-1 p-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="capitalize">{i.type}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(i.at).toLocaleString()}
                        </span>
                      </div>
                      {i.note && (
                        <div className="text-xs text-muted-foreground">
                          {i.note}
                        </div>
                      )}
                    </div>
                  ))}
                  {(editing.interactions || []).length === 0 && (
                    <div className="p-3 text-center text-xs text-muted-foreground">
                      No interactions yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs">{label}</span>
      {children}
    </label>
  );
}

function InteractionComposer({
  onAdd,
}: {
  onAdd: (type: InteractionType, note?: string) => void;
}) {
  type InteractionType = "note" | "call" | "email" | "meeting";
  const [type, setType] = useState<InteractionType>("note");
  const [note, setNote] = useState("");
  return (
    <div className="flex items-center gap-2">
      <select
        className="h-9 rounded-md border px-2 text-sm"
        value={type}
        onChange={(e) => setType(e.target.value as InteractionType)}
        aria-label="Interaction type"
      >
        <option value="note">Note</option>
        <option value="call">Call</option>
        <option value="email">Email</option>
        <option value="meeting">Meeting</option>
      </select>
      <input
        className="h-9 flex-1 rounded-md border px-2 text-sm"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note (optional)"
        aria-label="Interaction note"
      />
      <button
        className="rounded-md border px-3 py-2 text-sm"
        onClick={() => {
          onAdd(type, note);
          setNote("");
        }}
      >
        Add
      </button>
    </div>
  );
}
