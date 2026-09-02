import { money } from "@/lib/format";
import type { ApplianceLine, Period } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NumericField } from "@/components/numeric-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { usePractice } from "@/lib/store";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  lines: ApplianceLine[];
  period: Period;
};

export function ApplianceList({ lines, period }: Props) {
  const appliances = usePractice((s) => s.appliances);
  const addAppliance = usePractice((s) => s.addAppliance);
  const updateAppliance = usePractice((s) => s.updateAppliance);
  const removeAppliance = usePractice((s) => s.removeAppliance);
  const toggleAppliance = usePractice((s) => s.toggleAppliance);
  const k = period === "year" ? 12 : 1;

  return (
    <section>
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">Appliances</h2>
        <Button type="button" variant="ghost" size="sm" onClick={addAppliance}>
          <Plus />
          Add
        </Button>
      </header>

      {appliances.length === 0 ? (
        <div className="mt-6 border-t border-line py-10 text-center">
          <p className="text-sm text-muted">No appliances yet.</p>
          <Button type="button" variant="outline" className="mt-4" onClick={addAppliance}>
            Add appliance
          </Button>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-line border-t border-line">
          {appliances.map((item) => {
            const line = lines.find((l) => l.id === item.id);
            const net = (line?.net ?? 0) * k;
            const underwater = (line?.net ?? 0) < -1 && item.enabled && item.monthlyVolume > 0;
            return (
              <li
                key={item.id}
                className={cn("py-5", !item.enabled && "opacity-50")}
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={() => toggleAppliance(item.id)}
                    aria-label={`Include ${item.name || "appliance"} in-house`}
                  />
                  <Input
                    id={`${item.id}-name`}
                    value={item.name}
                    onChange={(e) => updateAppliance(item.id, { name: e.target.value })}
                    aria-label="Appliance name"
                    className="h-11 min-w-0 flex-1 border-transparent bg-transparent px-0 text-base font-medium shadow-none hover:border-line focus-visible:border-teal"
                  />
                  <span
                    className={cn(
                      "shrink-0 text-sm font-medium tabular-nums",
                      underwater ? "text-umber" : net >= 0 ? "text-sage" : "text-muted",
                    )}
                  >
                    {money(net)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-muted hover:text-umber"
                    onClick={() => removeAppliance(item.id)}
                    aria-label={`Remove ${item.name || "appliance"}`}
                  >
                    <Trash2 />
                  </Button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:pl-14 lg:grid-cols-5">
                  <NumericField
                    id={`${item.id}-vol`}
                    label="Qty / mo"
                    decimals={0}
                    value={item.monthlyVolume}
                    onChange={(monthlyVolume) => updateAppliance(item.id, { monthlyVolume })}
                  />
                  <NumericField
                    id={`${item.id}-lab`}
                    label="Lab fee"
                    prefix="$"
                    decimals={0}
                    value={item.labFee}
                    onChange={(labFee) => updateAppliance(item.id, { labFee })}
                  />
                  <NumericField
                    id={`${item.id}-mat`}
                    label="Materials"
                    prefix="$"
                    decimals={2}
                    value={item.materialCost}
                    onChange={(materialCost) => updateAppliance(item.id, { materialCost })}
                  />
                  <NumericField
                    id={`${item.id}-min`}
                    label="Labor"
                    suffix="min"
                    decimals={0}
                    value={item.laborMinutes}
                    onChange={(laborMinutes) => updateAppliance(item.id, { laborMinutes })}
                  />
                  <NumericField
                    id={`${item.id}-scrap`}
                    label="Remakes"
                    suffix="%"
                    decimals={0}
                    max={100}
                    value={item.scrapPercent}
                    onChange={(scrapPercent) => updateAppliance(item.id, { scrapPercent })}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}