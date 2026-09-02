import type { ApplianceLine, CalcResult, CostSlice, PracticeState } from "./types";

function n(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function compute(state: PracticeState): CalcResult {
  const rate = Math.max(0, n(state.overhead.laborHourlyRate));

  const lines: ApplianceLine[] = state.appliances.map((a) => {
    const volume = a.enabled ? Math.max(0, n(a.monthlyVolume)) : 0;
    const scrap = Math.max(0, n(a.scrapPercent)) / 100;
    const materialsPerUnit = Math.max(0, n(a.materialCost)) * (1 + scrap);
    const laborPerUnit = (Math.max(0, n(a.laborMinutes)) / 60) * rate;
    const variablePerUnit = materialsPerUnit + laborPerUnit;
    const labFee = Math.max(0, n(a.labFee));
    const labSpend = volume * labFee;
    const materialsTotal = volume * materialsPerUnit;
    const laborTotal = volume * laborPerUnit;
    const variableTotal = volume * variablePerUnit;
    const hours = volume * (Math.max(0, n(a.laborMinutes)) / 60);
    return {
      id: a.id,
      name: a.name,
      enabled: a.enabled,
      volume,
      labFee,
      materialsPerUnit,
      laborPerUnit,
      variablePerUnit,
      labSpend,
      materialsTotal,
      laborTotal,
      variableTotal,
      hours,
      allocatedOverhead: 0,
      allocatedPerUnit: 0,
      fullyLoadedPerUnit: variablePerUnit,
      gross: labSpend - variableTotal,
      net: labSpend - variableTotal,
    };
  });

  const active = lines.filter((l) => l.enabled && l.volume > 0);
  const totalVolume = active.reduce((s, l) => s + l.volume, 0);
  const labSpendMonthly = active.reduce((s, l) => s + l.labSpend, 0);
  const materialsMonthly = active.reduce((s, l) => s + l.materialsTotal, 0);
  const laborMonthly = active.reduce((s, l) => s + l.laborTotal, 0);
  const variableMonthly = materialsMonthly + laborMonthly;
  const hoursMonthly = active.reduce((s, l) => s + l.hours, 0);

  const oh = state.overhead;
  const equipmentMonthly = oh.equipment
    .filter((e) => e.included && n(e.lifeYears) > 0)
    .reduce((s, e) => s + Math.max(0, n(e.purchasePrice)) / (n(e.lifeYears) * 12), 0);
  const softwareMonthly = Math.max(0, n(oh.softwareMonthly));
  const maintenanceMonthly = Math.max(0, n(oh.maintenanceYearly)) / 12;
  const spaceMonthly = Math.max(0, n(oh.spaceMonthly));
  const utilitiesMonthly = Math.max(0, n(oh.utilitiesMonthly));
  const setupMonthly =
    n(oh.setupAmortMonths) > 0 ? Math.max(0, n(oh.setupCost)) / n(oh.setupAmortMonths) : 0;

  const fixedMonthly =
    equipmentMonthly +
    softwareMonthly +
    maintenanceMonthly +
    spaceMonthly +
    utilitiesMonthly +
    setupMonthly;

  const internalMonthly = variableMonthly + fixedMonthly;
  const savingsMonthly = labSpendMonthly - internalMonthly;

  const capex =
    oh.equipment.filter((e) => e.included).reduce((s, e) => s + Math.max(0, n(e.purchasePrice)), 0) +
    Math.max(0, n(oh.setupCost));
  const paybackMonths = savingsMonthly > 0.005 ? capex / savingsMonthly : Number.POSITIVE_INFINITY;

  const allocated = lines.map((l) => {
    const share = totalVolume > 0 ? l.volume / totalVolume : 0;
    const allocatedOverhead = share * fixedMonthly;
    const allocatedPerUnit = l.volume > 0 ? allocatedOverhead / l.volume : 0;
    const fullyLoadedPerUnit = l.variablePerUnit + allocatedPerUnit;
    const net = l.labSpend - (l.variableTotal + allocatedOverhead);
    return { ...l, allocatedOverhead, allocatedPerUnit, fullyLoadedPerUnit, net };
  });

  const slices: CostSlice[] = [
    { key: "materials", label: "Materials & remakes", monthly: materialsMonthly },
    { key: "labor", label: "Technician labor", monthly: laborMonthly },
    { key: "equipment", label: "Equipment (amortized)", monthly: equipmentMonthly },
    { key: "software", label: "Design software", monthly: softwareMonthly },
    { key: "maintenance", label: "Maintenance", monthly: maintenanceMonthly },
    { key: "space", label: "Lab space", monthly: spaceMonthly },
    { key: "utilities", label: "Utilities", monthly: utilitiesMonthly },
    { key: "setup", label: "Setup & training", monthly: setupMonthly },
  ];

  return {
    lines: allocated,
    labSpendMonthly,
    materialsMonthly,
    laborMonthly,
    equipmentMonthly,
    softwareMonthly,
    maintenanceMonthly,
    spaceMonthly,
    utilitiesMonthly,
    setupMonthly,
    fixedMonthly,
    variableMonthly,
    internalMonthly,
    savingsMonthly,
    hoursMonthly,
    capex,
    paybackMonths,
    totalVolume,
    slices,
  };
}

export function primaryInsight(result: CalcResult): string | null {
  const active = result.lines.filter((l) => l.enabled && l.volume > 0);
  if (active.length === 0) return "Add monthly volume to an appliance.";

  const losers = active.filter((l) => l.net < -1);
  if (losers.length === 1) {
    return `${losers[0].name} costs more in-house after overhead.`;
  }
  if (losers.length > 1) {
    return `${losers.length} appliances cost more in-house after overhead.`;
  }

  const best = [...active].sort((a, b) => b.net - a.net)[0];
  if (best && result.savingsMonthly > 1 && best.net > 0) {
    const pct = Math.round((best.net / result.savingsMonthly) * 100);
    return `${best.name} · ${Math.max(0, pct)}% of keep`;
  }

  if (result.savingsMonthly < -1) return "In-house costs more than the lab at this mix.";
  if (Math.abs(result.savingsMonthly) <= 1) return "This mix is at break-even.";
  return null;
}
