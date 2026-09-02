import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "./utils";
import { blankAppliance, blankEquipment, DEFAULT_STATE } from "./presets";
import type { Appliance, Equipment, Overhead, Period, PracticeState } from "./types";

type PracticeStore = PracticeState & {
  period: Period;
  setPeriod: (period: Period) => void;
  setPracticeName: (practiceName: string) => void;
  loadPreset: (state: PracticeState) => void;
  reset: () => void;
  addAppliance: () => void;
  updateAppliance: (id: string, patch: Partial<Appliance>) => void;
  removeAppliance: (id: string) => void;
  toggleAppliance: (id: string) => void;
  updateOverhead: (patch: Partial<Omit<Overhead, "equipment">>) => void;
  addEquipment: () => void;
  updateEquipment: (id: string, patch: Partial<Equipment>) => void;
  removeEquipment: (id: string) => void;
  toggleEquipment: (id: string) => void;
};

export const usePractice = create<PracticeStore>()(
  persist(
    (set) => ({
      ...structuredClone(DEFAULT_STATE),
      period: "month",
      setPeriod: (period) => set({ period }),
      setPracticeName: (practiceName) => set({ practiceName }),
      loadPreset: (state) =>
        set({
          practiceName: state.practiceName,
          appliances: structuredClone(state.appliances),
          overhead: structuredClone(state.overhead),
        }),
      reset: () =>
        set({
          ...structuredClone(DEFAULT_STATE),
          period: "month",
        }),
      addAppliance: () =>
        set((s) => ({
          appliances: [...s.appliances, { ...blankAppliance(), id: uid("ap") }],
        })),
      updateAppliance: (id, patch) =>
        set((s) => ({
          appliances: s.appliances.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      removeAppliance: (id) =>
        set((s) => ({ appliances: s.appliances.filter((a) => a.id !== id) })),
      toggleAppliance: (id) =>
        set((s) => ({
          appliances: s.appliances.map((a) =>
            a.id === id ? { ...a, enabled: !a.enabled } : a,
          ),
        })),
      updateOverhead: (patch) =>
        set((s) => ({ overhead: { ...s.overhead, ...patch } })),
      addEquipment: () =>
        set((s) => ({
          overhead: {
            ...s.overhead,
            equipment: [...s.overhead.equipment, { ...blankEquipment(), id: uid("eq") }],
          },
        })),
      updateEquipment: (id, patch) =>
        set((s) => ({
          overhead: {
            ...s.overhead,
            equipment: s.overhead.equipment.map((e) =>
              e.id === id ? { ...e, ...patch } : e,
            ),
          },
        })),
      removeEquipment: (id) =>
        set((s) => ({
          overhead: {
            ...s.overhead,
            equipment: s.overhead.equipment.filter((e) => e.id !== id),
          },
        })),
      toggleEquipment: (id) =>
        set((s) => ({
          overhead: {
            ...s.overhead,
            equipment: s.overhead.equipment.map((e) =>
              e.id === id ? { ...e, included: !e.included } : e,
            ),
          },
        })),
    }),
    {
      name: "house-lab-v1",
      skipHydration: true,
      partialize: (s) => ({
        practiceName: s.practiceName,
        appliances: s.appliances,
        overhead: s.overhead,
        period: s.period,
      }),
    },
  ),
);

export function rehydratePractice() {
  void usePractice.persist.rehydrate();
}
