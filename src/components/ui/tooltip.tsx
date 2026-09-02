import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export function TooltipProvider({
  delay = 400,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider> & { delay?: number }) {
  return <TooltipPrimitive.Provider delayDuration={delay} {...props} />;
}

export function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />;
}

export function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger {...props} />;
}

export function TooltipContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-xs rounded-md bg-ink px-3 py-2 text-xs leading-snug text-paper shadow-border",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
