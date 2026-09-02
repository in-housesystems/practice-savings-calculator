import { useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { ApplianceList } from "@/components/appliance-list";
import { HeroLedger } from "@/components/hero-ledger";
import { InternalCost } from "@/components/internal-cost";
import { MixChart } from "@/components/mix-chart";
import { compute, primaryInsight } from "@/lib/calc";
import { money } from "@/lib/format";
import { rehydratePractice, usePractice } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  useEffect(() => {
    rehydratePractice();
  }, []);

  const practiceName = usePractice((s) => s.practiceName);
  const appliances = usePractice((s) => s.appliances);
  const overhead = usePractice((s) => s.overhead);
  const period = usePractice((s) => s.period);

  const result = useMemo(
    () => compute({ practiceName, appliances, overhead }),
    [practiceName, appliances, overhead],
  );
  const note = useMemo(() => primaryInsight(result), [result]);
  const k = period === "year" ? 12 : 1;
  const savings = result.savingsMonthly * k;
  const positive = savings >= 0;

  return (
    <main
      className="min-h-dvh bg-paper pb-24 text-ink md:pb-12"
      style={{ backgroundColor: "#f3efe6", color: "#1a1814" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:gap-10 lg:px-8 lg:py-10">
        <AppHeader />
        <div className="h-px bg-line" role="presentation" />
        <HeroLedger result={result} period={period} />
        {note ? <p className="text-sm text-ink-soft">{note}</p> : null}

        <section>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
              Lab vs in-house
            </h2>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-sm bg-ink/70" />
                Lab
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-sm bg-teal" />
                In-house
              </span>
            </div>
          </div>
          <MixChart lines={result.lines} period={period} />
        </section>

        <div className="h-px bg-line" role="presentation" />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ApplianceList lines={result.lines} period={period} />
          </div>
          <div className="lg:col-span-5">
            <InternalCost result={result} period={period} />
          </div>
        </div>

        <p className="border-t border-line pt-5 text-xs text-muted">
          Planning model. Equipment is straight-line amortized. Overhead allocated by volume.
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            {positive ? "Kept" : "Short"} / {period}
          </span>
          <span
            className={cn(
              "font-display text-2xl tabular-nums tracking-tight",
              positive ? "text-sage" : "text-umber",
            )}
          >
            {money(savings)}
          </span>
        </div>
      </div>
    </main>
  );
}