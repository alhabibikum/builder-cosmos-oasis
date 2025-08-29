import { FormEvent, useState } from "react";
import { useCart } from "@/store/cart";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/money";
import PaymentMethods, {
  type ManualPaymentData,
} from "@/components/site/PaymentMethods";
import { upsertOrder } from "@/lib/orders";
import { adjustStock } from "@/lib/inventory";

const BD_DISTRICTS = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chapai Nawabganj",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokathi",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];

export default function Checkout() {
  const { total, detailed, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<ManualPaymentData>({
    method: "cod",
    mobile: "",
  });
  const [district, setDistrict] = useState<string>("Dhaka");
  const [upazila, setUpazila] = useState<string>("");
  const navigate = useNavigate();
  const baseShipping = district === "Dhaka" ? 80 : 150;
  const shipping = total >= 15000 ? 0 : baseShipping;
  const grand = total + shipping;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (payment.method !== "cod") {
      if (!payment.mobile || !payment.transactionId) {
        alert(
          "Please provide mobile number and transaction ID for your payment.",
        );
        return;
      }
    }
    setLoading(true);
    setTimeout(() => {
      const orderId = `PB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const orderPayload = {
        id: orderId,
        items: detailed,
        totals: { subtotal: total, shipping, total: grand },
        payment,
        status: "placed",
        paymentVerified: false,
        createdAt: new Date().toISOString(),
        shippingAddress: { country: "Bangladesh", district, upazila },
      };
      upsertOrder(orderPayload as any);
      // Deduct inventory
      detailed.forEach((i) => adjustStock(i.product.id, -i.qty, i.size as any));
      localStorage.setItem("lastOrder", JSON.stringify(orderPayload));
      clear();
      navigate(`/order-confirmation?order=${encodeURIComponent(orderId)}`);
    }, 800);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-3">
      <section className="space-y-6 rounded-xl border p-4 md:col-span-2">
        <div className="text-lg font-semibold">Shipping Details</div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="h-11 rounded-md border px-3"
            required
            placeholder="First name"
          />
          <input
            className="h-11 rounded-md border px-3"
            required
            placeholder="Last name"
          />
          <input
            className="h-11 rounded-md border px-3 sm:col-span-2"
            type="email"
            required
            placeholder="Email"
          />
          <input
            className="h-11 rounded-md border px-3 sm:col-span-2"
            required
            placeholder="Address"
          />
          <select
            className="h-11 rounded-md border px-3"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
          >
            {BD_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            className="h-11 rounded-md border px-3"
            required
            value={upazila}
            onChange={(e) => setUpazila(e.target.value)}
            placeholder="Upazila/Thana"
          />
          <input
            className="h-11 rounded-md border px-3"
            required
            inputMode="numeric"
            pattern="\\d{4,5}"
            title="Enter 4-5 digit postal code"
            placeholder="Postal code"
          />
          <input
            className="h-11 rounded-md border px-3 sm:col-span-2"
            required
            type="tel"
            inputMode="numeric"
            pattern="01\\d{9}"
            title="Bangladesh mobile number starting with 01 (11 digits)"
            placeholder="Phone (e.g., 01XXXXXXXXX)"
          />
          <input
            className="h-11 rounded-md border px-3 sm:col-span-2 bg-muted"
            value="Bangladesh"
            readOnly
          />
        </div>
        <div className="pt-2 text-sm text-muted-foreground">
          We’ll send order updates to your email. By placing this order you
          agree to our policies.
        </div>

        <PaymentMethods onChange={setPayment} />
      </section>
      <aside className="space-y-3 rounded-xl border p-4">
        <div className="text-lg font-semibold">Order Summary</div>
        <div className="space-y-2">
          {detailed.map((i) => (
            <div
              key={i.productId}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <img
                  src={i.product.image}
                  className="h-12 w-10 rounded object-cover"
                />
                <div>
                  <div className="line-clamp-1">{i.product.title}</div>
                  <div className="text-muted-foreground">
                    {i.qty} × {formatCurrency(i.product.price)}
                  </div>
                </div>
              </div>
              <div>{formatCurrency(i.product.price * i.qty)}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Shipping</span>
          <span>
            {shipping === 0
              ? "Free (over ৳15,000)"
              : `${district === "Dhaka" ? "Inside Dhaka" : "Outside Dhaka"} • ${formatCurrency(shipping)}`}
          </span>
        </div>
        <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
          <span>Total</span>
          <span>{formatCurrency(grand)}</span>
        </div>
        <button
          disabled={loading}
          className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          {loading ? "Processing…" : "Place Order"}
        </button>
        <div className="pt-2 text-xs text-muted-foreground">
          Manual payments (bKash/Nagad/Rocket) are verified within 1–12 hours.
          COD requires phone confirmation.
        </div>
      </aside>
    </form>
  );
}
