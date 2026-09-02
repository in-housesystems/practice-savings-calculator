const moneyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const moneyExact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const moneyCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function money(value: number, exact = false): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = exact ? value : Math.round(value);
  const abs = exact ? moneyExact.format(Math.abs(rounded)) : moneyFmt.format(Math.abs(rounded));
  if (rounded < 0) return `−${abs}`;
  return abs;
}

export function moneyUnit(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return moneyExact.format(value);
}

export function compactMoney(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 10000) return moneyCompact.format(Math.round(value));
  return money(value);
}

export function hours(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const v = Math.round(value * 10) / 10;
  return `${v.toLocaleString("en-US")} hr`;
}

export function payback(months: number): string {
  if (!Number.isFinite(months) || months > 240) return "Does not pay back";
  if (months < 1) return "Under 1 month";
  if (months < 12) return `${Math.ceil(months)} mo`;
  const years = months / 12;
  if (years < 3) {
    const y = Math.floor(months / 12);
    const m = Math.ceil(months % 12);
    if (m === 0 || m === 12) return `${Math.round(months / 12)} yr`;
    return `${y} yr ${m} mo`;
  }
  return `${years.toFixed(1)} yr`;
}

export function pct(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return `${Math.round(value)}%`;
}

export function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/[$,%\s,]/g, "").replace(/−/g, "-");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}
