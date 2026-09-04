"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export function Slider({ className, ...props }: SliderPrimitive.SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-800">
        <SliderPrimitive.Range className="absolute h-full bg-emerald-500" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-emerald-500 bg-slate-950 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
    </SliderPrimitive.Root>
  );
}
