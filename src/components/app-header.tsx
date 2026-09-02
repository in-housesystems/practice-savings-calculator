import { PRESETS } from "@/lib/presets";
import { usePractice } from "@/lib/store";
import type { Period } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const practiceName = usePractice((s) => s.practiceName);
  const setPracticeName = usePractice((s) => s.setPracticeName);
  const period = usePractice((s) => s.period);
  const setPeriod = usePractice((s) => s.setPeriod);
  const loadPreset = usePractice((s) => s.loadPreset);

  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-teal px-4 py-3 text-teal-fg sm:px-5">
        <p className="text-xs font-medium uppercase tracking-widest">Practice Savings Calculator</p>
        <PeriodToggle period={period} onChange={setPeriod} />
      </div>

      <div className="flex flex-col gap-1">
        <input
          value={practiceName}
          onChange={(e) => setPracticeName(e.target.value)}
          className="w-full min-w-0 border-0 bg-transparent font-display text-3xl leading-tight tracking-tight text-ink outline-none placeholder:text-muted sm:text-4xl"
          aria-label="Practice name"
          placeholder="Practice name"
        />
        <nav className="flex flex-wrap gap-x-5" aria-label="Presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="h-11 text-sm text-muted transition-colors duration-150 hover:text-ink"
              onClick={() => loadPreset(preset.state)}
            >
              {preset.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function PeriodToggle({
  period,
  onChange,
}: {
  period: Period;
  onChange: (period: Period) => void;
}) {
  return (
    <div className="flex rounded-full bg-teal-fg/12 p-1" role="tablist" aria-label="Period">
      {(["month", "year"] as const).map((p) => (
        <button
          key={p}
          type="button"
          role="tab"
          aria-selected={period === p}
          onClick={() => onChange(p)}
          className={cn(
            "h-10 min-w-20 rounded-full px-4 text-sm font-medium capitalize transition-[background-color,color] duration-150",
            period === p ? "bg-raised text-teal" : "text-teal-fg/80 hover:text-teal-fg",
          )}
        >
          {p === "month" ? "Month" : "Year"}
        </button>
      ))}
    </div>
  );
}
