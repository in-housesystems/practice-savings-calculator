import { hours, money, payback } from "@/lib/format";
import type { CalcResult, Period } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  result: CalcResult;
  period: Period;
};

export function HeroLedger({ result, period }: Props) {
  const k = period === "year" ? 12 : 1;
  const savings = result.savingsMonthly * k;
  const lab = result.labSpendMonthly * k;
  const internal = result.internalMonthly * k;
  const hoursShown = result.hoursMonthly * k;
  const positive = savings >= 0;
  const maxBar = Math.max(lab, internal, 1);
  const cadence = period === "year" ? "year" : "month";

  return (
    <section className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
      <div className="lg:col-span-6">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          {positive ? "Kept" : "Shortfall"} / {cadence}
        </p>
        <p
          className={cn(
            "mt-2 font-display text-5xl leading-none tracking-tight tabular-nums sm:text-6xl",
            positive ? "text-sage" : "text-umber",
          )}
        >
          {money(savings)}
        </p>
      </div>

      <div className="grid gap-4 lg:col-span-6">
        <BarRow label="Lab" value={lab} max={maxBar} tone="lab" />
        <BarRow label="Internal" value={internal} max={maxBar} tone="house" />
        <p className="text-sm tabular-nums text-muted">
          Payback {payback(result.paybackMonths)}
          <span className="mx-2 text-line-strong">·</span>
          {hours(hoursShown)}
        </p>
      </div>
    </section>
  );
}

function BarRow({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "lab" | "house";
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
        <span className="text-sm tabular-nums text-ink">{money(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-out",
            tone === "lab" && "bg-ink/70",
            tone === "house" && "bg-teal",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}