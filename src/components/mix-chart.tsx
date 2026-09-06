import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { money } from "@/lib/format";
import type { ApplianceLine, Period } from "@/lib/types";

type Props = {
  lines: ApplianceLine[];
  period: Period;
};

type Row = {
  name: string;
  lab: number;
  house: number;
};

function shortName(name: string): string {
  const trimmed = name.trim() || "Untitled";
  const cut = trimmed.split(/[(/]/)[0]?.trim() || trimmed;
  return cut.length > 16 ? `${cut.slice(0, 15)}…` : cut;
}

export function MixChart({ lines, period }: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const k = period === "year" ? 12 : 1;
  const data: Row[] = lines
    .filter((l) => l.enabled && l.volume > 0)
    .map((l) => ({
      name: shortName(l.name),
      lab: Math.round(l.labSpend * k),
      house: Math.round((l.variableTotal + l.allocatedOverhead) * k),
    }));

  const height = Math.max(180, data.length * 44);

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center text-sm text-muted">
        Enable an appliance with volume to compare.
      </div>
    );
  }

  if (!ready) {
    return <div className="h-56 rounded-lg bg-surface" aria-hidden="true" />;
  }

  return (
    <div
      className="w-full"
      style={{ height }}
      role="img"
      aria-label={`Lab invoice and in-house cost comparison per ${period} for ${data.length} appliance${data.length === 1 ? "" : "s"}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
          barGap={4}
          barCategoryGap={14}
        >
          <CartesianGrid horizontal={false} stroke="var(--color-line)" strokeDasharray="3 6" />
          <XAxis
            type="number"
            tick={{ fill: "var(--color-muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--color-line)" }}
            tickLine={false}
            tickFormatter={(v: number) => {
              if (v === 0) return "$0";
              if (Math.abs(v) >= 1000) return `$${Math.round(v / 1000)}k`;
              return `$${v}`;
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={92}
            tick={{ fill: "var(--color-ink-soft)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--color-line)", fillOpacity: 0.35 }}
            content={<ChartTip period={period} />}
          />
          <Bar
            dataKey="lab"
            name="Lab invoices"
            fill="var(--color-ink)"
            fillOpacity={0.72}
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="house"
            name="In-house"
            fill="var(--color-teal)"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartTip({
  active,
  payload,
  label,
  period,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  period: Period;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md bg-ink px-3 py-2 text-xs text-paper shadow-border">
      <p className="font-medium">{label}</p>
      <p className="mt-1 text-paper/60">Per {period}</p>
      <ul className="mt-2 grid gap-1">
        {payload.map((p) => (
          <li key={p.name} className="flex items-center justify-between gap-6">
            <span>{p.name}</span>
            <span className="tabular-nums">{money(p.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
