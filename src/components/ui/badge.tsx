import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const toneClasses = {
  neutral: "bg-slate-800 text-slate-300",
  success: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
  danger: "bg-red-500/15 text-red-400 ring-1 ring-red-500/30",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof toneClasses;
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
