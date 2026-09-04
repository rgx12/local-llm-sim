import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
  segments?: number;
}

export function Progress({ value, className, barClassName, segments = 24 }: ProgressProps) {
  const clamped = Math.min(Math.max(value, 0), 100);
  const litSegments = Math.round((clamped / 100) * segments);

  return (
    <div className={cn("flex h-3 w-full gap-[2px]", className)} aria-hidden>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 border border-(--line) bg-(--panel-recessed) transition-colors duration-300",
            i < litSegments && cn("bg-(--amber) border-(--amber-dim)", barClassName),
          )}
        />
      ))}
    </div>
  );
}
