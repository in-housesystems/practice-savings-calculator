export type Period = "month" | "year";

export type Appliance = {
  id: string;
  name: string;
  enabled: boolean;
  monthlyVolume: number;
  labFee: number;
  materialCost: number;
  laborMinutes: number;
  scrapPercent: number;
};

export type Equipment = {
  id: string;
  name: string;
  purchasePrice: number;
  lifeYears: number;
  included: boolean;
};

export type Overhead = {
  equipment: Equipment[];
  softwareMonthly: number;
  maintenanceYearly: number;
  spaceMonthly: number;
  utilitiesMonthly: number;
  setupCost: number;
  setupAmortMonths: number;
  laborHourlyRate: number;
};

export type PracticeState = {
  practiceName: string;
  appliances: Appliance[];
  overhead: Overhead;
};

export type ApplianceLine = {
  id: string;
  name: string;
  enabled: boolean;
  volume: number;
  labFee: number;
  materialsPerUnit: number;
  laborPerUnit: number;
  variablePerUnit: number;
  labSpend: number;
  materialsTotal: number;
  laborTotal: number;
  variableTotal: number;
  hours: number;
  allocatedOverhead: number;
  allocatedPerUnit: number;
  fullyLoadedPerUnit: number;
  gross: number;
  net: number;
};

export type CostSlice = {
  key: string;
  label: string;
  monthly: number;
};

export type CalcResult = {
  lines: ApplianceLine[];
  labSpendMonthly: number;
  materialsMonthly: number;
  laborMonthly: number;
  equipmentMonthly: number;
  softwareMonthly: number;
  maintenanceMonthly: number;
  spaceMonthly: number;
  utilitiesMonthly: number;
  setupMonthly: number;
  fixedMonthly: number;
  variableMonthly: number;
  internalMonthly: number;
  savingsMonthly: number;
  hoursMonthly: number;
  capex: number;
  paybackMonths: number;
  totalVolume: number;
  slices: CostSlice[];
};
