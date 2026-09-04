import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const variantClasses = {
  primary:
    "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_-4px_rgba(16,185,129,0.6)]",
  secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
  ghost: "bg-transparent text-slate-300 hover:bg-slate-800",
  outline: "border border-slate-700 text-slate-200 hover:bg-slate-800",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
