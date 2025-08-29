import { useState } from "react";

export type PaymentMethod = "bkash" | "nagad" | "rocket" | "cod";

export interface ManualPaymentData {
  method: PaymentMethod;
  mobile: string;
  transactionId?: string;
  screenshotDataUrl?: string;
}

export default function PaymentMethods({ onChange }: { onChange: (data: ManualPaymentData) => void }) {
  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [mobile, setMobile] = useState("");
  const [trx, setTrx] = useState("");
  const [shot, setShot] = useState<string | undefined>();

  const update = (next?: Partial<ManualPaymentData>) => {
    const payload: ManualPaymentData = {
      method,
      mobile,
      transactionId: trx || undefined,
      screenshotDataUrl: shot,
      ...next,
    };
    onChange(payload);
  };

  const onFile = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      const url = r.result as string;
      setShot(url);
      update({ screenshotDataUrl: url });
    };
    r.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="text-lg font-semibold">Payment Method</div>
      <div className="grid gap-2 sm:grid-cols-4">
        {[{ k: "bkash", label: "bKash" }, { k: "nagad", label: "Nagad" }, { k: "rocket", label: "Rocket" }, { k: "cod", label: "Cash on Delivery" }].map((m) => (
          <button
            key={m.k}
            type="button"
            onClick={() => {
              setMethod(m.k as PaymentMethod);
              update({ method: m.k as PaymentMethod });
            }}
            className={`rounded-md border px-3 py-2 text-sm ${method === m.k ? "border-primary" : ""}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {method !== "cod" && (
        <div className="space-y-3 rounded-md border p-3">
          <div className="text-sm font-medium">Provide transaction details for manual verification</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="h-11 rounded-md border px-3" required value={mobile} onChange={(e) => { setMobile(e.target.value); update({ mobile: e.target.value }); }} placeholder="Sender mobile number (11 digits)" />
            <input className="h-11 rounded-md border px-3" required value={trx} onChange={(e) => { setTrx(e.target.value); update({ transactionId: e.target.value }); }} placeholder="Transaction ID" />
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-muted-foreground">Upload screenshot / receipt (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
              {shot && <img src={shot} alt="payment" className="mt-2 h-28 rounded border object-cover" />}
            </div>
            <div className="sm:col-span-2 text-xs text-muted-foreground">We will verify your payment and email confirmation. If information is incomplete, processing may be delayed.</div>
          </div>
        </div>
      )}

      {method === "cod" && (
        <div className="rounded-md border p-3 text-sm text-muted-foreground">You will pay in cash upon delivery. Our courier will contact you before arrival.</div>
      )}
    </div>
  );
}
