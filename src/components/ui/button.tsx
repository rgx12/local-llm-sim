import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const variantClasses = {
  primary:
    "bg-(--amber) text-(--amber-ink) hover:bg-[#ffc633] active:translate-y-px shadow-[0_0_0_1px_var(--amber-dim),0_0_18px_-4px_rgba(255,179,0,0.55)]",
  secondary: "bg-(--panel-recessed) text-(--ink) border border-(--line) hover:border-(--line-bright)",
  ghost: "bg-transparent text-(--ink-dim) hover:text-(--ink) hover:bg-(--panel-recessed)",
  outline: "border border-(--line) text-(--ink) hover:border-(--amber-dim)",
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
          "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
          variantClasses[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
