import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const toneClasses = {
  neutral: "border-(--line) text-(--ink-dim)",
  good: "border-(--status-good)/40 text-(--status-good)",
  warn: "border-(--status-warn)/40 text-(--status-warn)",
  critical: "border-(--status-critical)/40 text-(--status-critical)",
};

const dotClasses = {
  neutral: "bg-(--ink-dim)",
  good: "bg-(--status-good) shadow-[0_0_6px_0_var(--status-good)]",
  warn: "bg-(--status-warn) shadow-[0_0_6px_0_var(--status-warn)]",
  critical: "bg-(--status-critical) shadow-[0_0_6px_0_var(--status-critical)]",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof toneClasses;
}

export function Badge({ className, tone = "neutral", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-1 font-(family-name:--font-data) text-[11px] font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[tone])} />
      {children}
    </span>
  );
}
