import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "role" | "type"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({
  className,
  checked = false,
  onCheckedChange,
  disabled,
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150",
        checked ? "bg-teal" : "bg-line-strong",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/35",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none block size-5 rounded-full bg-raised shadow-sm transition-transform duration-150",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
