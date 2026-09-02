import { money, moneyUnit } from "@/lib/format";
import type { CalcResult, Period } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NumericField } from "@/components/numeric-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { usePractice } from "@/lib/store";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  result: CalcResult;
  period: Period;
};

export function InternalCost({ result, period }: Props) {
  const k = period === "year" ? 12 : 1;
  const overhead = usePractice((s) => s.overhead);
  const updateOverhead = usePractice((s) => s.updateOverhead);
  const addEquipment = usePractice((s) => s.addEquipment);
  const updateEquipment = usePractice((s) => s.updateEquipment);
  const removeEquipment = usePractice((s) => s.removeEquipment);
  const toggleEquipment = usePractice((s) => s.toggleEquipment);

  const slices = result.slices.filter((s) => s.monthly > 0.004);

  return (
    <section>
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">Internal cost</h2>
        <p className="font-display text-xl tabular-nums tracking-tight text-ink">
          {money(result.internalMonthly * k)}
        </p>
      </header>

      <ul className="mt-4 divide-y divide-line border-t border-b border-line">
        {slices.length === 0 ? (
          <li className="py-4 text-sm text-muted">No internal costs yet.</li>
        ) : (
          slices.map((slice) => (
            <li key={slice.key} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
              <span className="text-ink-soft">{slice.label}</span>
              <span className="tabular-nums text-ink">{money(slice.monthly * k)}</span>
            </li>
          ))
        )}
      </ul>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <NumericField
          id="labor-rate"
          label="Tech rate"
          prefix="$"
          suffix="/hr"
          decimals={0}
          value={overhead.laborHourlyRate}
          onChange={(laborHourlyRate) => updateOverhead({ laborHourlyRate })}
        />
        <NumericField
          id="software"
          label="Software / mo"
          prefix="$"
          decimals={0}
          value={overhead.softwareMonthly}
          onChange={(softwareMonthly) => updateOverhead({ softwareMonthly })}
        />
        <NumericField
          id="space"
          label="Space / mo"
          prefix="$"
          decimals={0}
          value={overhead.spaceMonthly}
          onChange={(spaceMonthly) => updateOverhead({ spaceMonthly })}
        />
        <NumericField
          id="utilities"
          label="Utilities / mo"
          prefix="$"
          decimals={0}
          value={overhead.utilitiesMonthly}
          onChange={(utilitiesMonthly) => updateOverhead({ utilitiesMonthly })}
        />
        <NumericField
          id="maint"
          label="Maintenance / yr"
          prefix="$"
          decimals={0}
          value={overhead.maintenanceYearly}
          onChange={(maintenanceYearly) => updateOverhead({ maintenanceYearly })}
        />
        <NumericField
          id="setup"
          label="Setup"
          prefix="$"
          decimals={0}
          value={overhead.setupCost}
          onChange={(setupCost) => updateOverhead({ setupCost })}
        />
        <NumericField
          id="setup-months"
          label="Amortize"
          suffix="mo"
          decimals={0}
          min={1}
          value={overhead.setupAmortMonths}
          onChange={(setupAmortMonths) => updateOverhead({ setupAmortMonths })}
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted">Equipment</h3>
          <Button type="button" variant="ghost" size="sm" onClick={addEquipment}>
            <Plus />
            Add
          </Button>
        </div>
        <ul className="mt-2 divide-y divide-line border-t border-line">
          {overhead.equipment.map((item) => {
            const monthly =
              item.included && item.lifeYears > 0 ? item.purchasePrice / (item.lifeYears * 12) : 0;
            return (
              <li
                key={item.id}
                className={cn("py-4", !item.included && "opacity-50")}
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={item.included}
                    onCheckedChange={() => toggleEquipment(item.id)}
                    aria-label={`Include ${item.name || "equipment"}`}
                  />
                  <Input
                    id={`${item.id}-name`}
                    value={item.name}
                    onChange={(e) => updateEquipment(item.id, { name: e.target.value })}
                    aria-label="Equipment name"
                    className="h-11 min-w-0 flex-1 border-transparent bg-transparent px-0 text-sm font-medium shadow-none hover:border-line focus-visible:border-teal"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-muted hover:text-umber"
                    onClick={() => removeEquipment(item.id)}
                    aria-label={`Remove ${item.name || "equipment"}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:pl-14">
                  <NumericField
                    id={`${item.id}-price`}
                    label="Purchase"
                    prefix="$"
                    decimals={0}
                    value={item.purchasePrice}
                    onChange={(purchasePrice) => updateEquipment(item.id, { purchasePrice })}
                  />
                  <NumericField
                    id={`${item.id}-life`}
                    label="Life"
                    suffix="yr"
                    decimals={0}
                    min={1}
                    value={item.lifeYears}
                    onChange={(lifeYears) => updateEquipment(item.id, { lifeYears })}
                  />
                </div>
                <p className="mt-2 text-xs tabular-nums text-muted sm:pl-14">
                  {item.included ? `${moneyUnit(monthly)} / mo` : "Excluded"}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}