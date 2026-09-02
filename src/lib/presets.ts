import type { Appliance, Equipment, Overhead, PracticeState } from "./types";

function app(
  id: string,
  name: string,
  monthlyVolume: number,
  labFee: number,
  materialCost: number,
  laborMinutes: number,
  scrapPercent: number,
  enabled = true,
): Appliance {
  return {
    id,
    name,
    enabled,
    monthlyVolume,
    labFee,
    materialCost,
    laborMinutes,
    scrapPercent,
  };
}

function eq(
  id: string,
  name: string,
  purchasePrice: number,
  lifeYears: number,
  included = true,
): Equipment {
  return { id, name, purchasePrice, lifeYears, included };
}

const dentalOverhead: Overhead = {
  equipment: [
    eq("eq-printer", "Resin 3D printer", 6800, 5),
    eq("eq-wash", "Wash & cure station", 1450, 5),
    eq("eq-finish", "Finishing & polish kit", 920, 7),
    eq("eq-scanner", "Dedicated lab scanner", 18500, 5, false),
  ],
  softwareMonthly: 289,
  maintenanceYearly: 960,
  spaceMonthly: 420,
  utilitiesMonthly: 55,
  setupCost: 2400,
  setupAmortMonths: 12,
  laborHourlyRate: 34,
};

export const dentalGeneral: PracticeState = {
  practiceName: "Northside Dental",
  overhead: dentalOverhead,
  appliances: [
    app("ap-guard", "Night guards (hard)", 22, 175, 18, 28, 6),
    app("ap-essix", "Essix retainers", 18, 95, 8, 14, 8),
    app("ap-splint", "Occlusal splints", 8, 245, 24, 40, 5),
    app("ap-guide", "Surgical guides", 6, 335, 22, 48, 10),
    app("ap-tray", "Whitening trays", 14, 62, 6, 12, 8),
    app("ap-flipper", "Flippers / stayplates", 4, 215, 28, 50, 7),
    app("ap-sport", "Sports mouthguards", 5, 88, 12, 20, 6, false),
  ],
};

export const orthoPractice: PracticeState = {
  practiceName: "Riverside Orthodontics",
  overhead: {
    ...dentalOverhead,
    equipment: [
      eq("eq-printer", "Resin 3D printer (dual)", 12400, 5),
      eq("eq-wash", "Wash & cure station", 1450, 5),
      eq("eq-thermo", "Pressure former", 2800, 8),
      eq("eq-scanner", "Dedicated lab scanner", 18500, 5, true),
    ],
    softwareMonthly: 410,
    spaceMonthly: 640,
    laborHourlyRate: 36,
  },
  appliances: [
    app("ap-retainer", "Essix / Vivera-style retainers", 48, 90, 7, 12, 8),
    app("ap-hawley", "Hawley retainers", 10, 165, 22, 55, 4),
    app("ap-aligner", "In-house aligner stages", 120, 18, 3.5, 4, 10),
    app("ap-expander", "Expanders / RPE", 6, 285, 38, 70, 5),
    app("ap-habit", "Habit / habit-breaker appliances", 3, 240, 32, 65, 5),
    app("ap-bleaching", "Bleaching trays", 16, 55, 5, 10, 8),
  ],
};

export const emptyPractice: PracticeState = {
  practiceName: "Your practice",
  appliances: [
    app("ap-new", "New appliance", 0, 0, 0, 0, 5),
  ],
  overhead: {
    equipment: [eq("eq-new", "New equipment", 0, 5)],
    softwareMonthly: 0,
    maintenanceYearly: 0,
    spaceMonthly: 0,
    utilitiesMonthly: 0,
    setupCost: 0,
    setupAmortMonths: 12,
    laborHourlyRate: 32,
  },
};

export const PRESETS = [
  { id: "dental", label: "Dental", state: dentalGeneral },
  { id: "ortho", label: "Ortho", state: orthoPractice },
  { id: "blank", label: "Empty", state: emptyPractice },
] as const;

export const DEFAULT_STATE: PracticeState = structuredClone(dentalGeneral);

export function blankAppliance(): Appliance {
  return app("ap", "New appliance", 0, 0, 0, 0, 5);
}

export function blankEquipment(): Equipment {
  return eq("eq", "New equipment", 0, 5);
}
