export function formatCurrency(amount: number, currency = "BDT", locale = "en-BD") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, currencyDisplay: "symbol", minimumFractionDigits: 2 }).format(amount);
  } catch {
    const prefix = currency === "BDT" ? "৳" : "";
    return `${prefix}${amount.toFixed(2)}`;
  }
}
