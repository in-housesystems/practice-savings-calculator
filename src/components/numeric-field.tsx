import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { parseNumber } from "@/lib/format";

type Props = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
};

function formatDisplay(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return "";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function NumericField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  decimals = 0,
  min = 0,
  max,
  disabled,
  className,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(formatDisplay(value, decimals));

  useEffect(() => {
    if (!focused) setDraft(formatDisplay(value, decimals));
  }, [value, decimals, focused]);

  function commit(raw: string) {
    const parsed = parseNumber(raw);
    if (parsed === null) {
      setDraft(formatDisplay(value, decimals));
      return;
    }
    let next = parsed;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    onChange(next);
    setDraft(formatDisplay(next, decimals));
  }

  return (
    <div className={cn("grid gap-1", className)}>
      <Label htmlFor={id} className="text-xs font-medium text-muted">
        {label}
      </Label>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted">
            {prefix}
          </span>
        ) : null}
        <Input
          id={id}
          inputMode="decimal"
          disabled={disabled}
          value={focused ? draft : formatDisplay(value, decimals)}
          onFocus={() => {
            setFocused(true);
            setDraft(
              Number.isFinite(value) ? String(Number(value.toFixed(decimals))) : "",
            );
          }}
          onChange={(e) => {
            const raw = e.target.value;
            setDraft(raw);
            const parsed = parseNumber(raw);
            if (parsed === null) return;
            let next = parsed;
            if (min !== undefined) next = Math.max(min, next);
            if (max !== undefined) next = Math.min(max, next);
            onChange(next);
          }}
          onBlur={() => {
            setFocused(false);
            commit(draft);
          }}
          className={cn("h-11 tabular-nums", prefix && "pl-7", suffix && "pr-9")}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}