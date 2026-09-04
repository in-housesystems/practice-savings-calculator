import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compute, primaryInsight } from "./calc.ts";
import { money } from "./format.ts";
import {
  DEFAULT_STATE,
  PRESETS,
  dentalGeneral,
  emptyPractice,
  orthoPractice,
} from "./presets.ts";

describe("presets", () => {
  it("defaults to the Dental Northside mix", () => {
    assert.equal(DEFAULT_STATE.practiceName, "Northside Dental");
    assert.deepEqual(
      PRESETS.map((p) => p.id),
      ["dental", "ortho", "blank"],
    );
    assert.deepEqual(
      PRESETS.map((p) => p.label),
      ["Dental", "Ortho", "Empty"],
    );
    assert.equal(PRESETS[0].state.practiceName, "Northside Dental");
    assert.equal(PRESETS[1].state.practiceName, "Riverside Orthodontics");
    assert.equal(PRESETS[2].state.practiceName, "Your practice");
  });
});

describe("compute", () => {
  it("pins Dental default kept / month", () => {
    const result = compute(dentalGeneral);
    // Sports mouthguards stay off; remaining monthly volume is 72 units.
    assert.equal(result.totalVolume, 72);
    assert.equal(result.labSpendMonthly, 11258);
    assert.equal(Math.round(result.internalMonthly), 3370);
    assert.equal(Math.round(result.savingsMonthly), 7888);
    assert.equal(money(result.savingsMonthly), "$7,888");
    assert.equal(money(result.savingsMonthly * 12), "$94,656");
    assert.equal(primaryInsight(result), "Night guards (hard) · 34% of keep");
  });

  it("pins Ortho mix kept / month", () => {
    const result = compute(orthoPractice);
    assert.equal(result.totalVolume, 203);
    assert.equal(result.labSpendMonthly, 11440);
    assert.equal(Math.round(result.internalMonthly), 4862);
    assert.equal(Math.round(result.savingsMonthly), 6578);
    assert.equal(money(result.savingsMonthly), "$6,578");
    assert.equal(money(result.savingsMonthly * 12), "$78,933");
  });

  it("pins Empty mix at zero spend and a volume prompt", () => {
    const result = compute(emptyPractice);
    assert.equal(result.totalVolume, 0);
    assert.equal(result.labSpendMonthly, 0);
    assert.equal(result.internalMonthly, 0);
    assert.equal(result.savingsMonthly, 0);
    assert.equal(money(result.savingsMonthly), "$0");
    assert.equal(primaryInsight(result), "Add monthly volume to an appliance.");
  });
});
