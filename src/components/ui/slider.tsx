"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export function Slider({ className, ...props }: SliderPrimitive.SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none select-none items-center py-1", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-[3px] w-full grow bg-(--line)">
        <SliderPrimitive.Range className="absolute h-full bg-(--amber)" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-3.5 w-2 border border-(--amber) bg-(--panel) shadow-[0_0_6px_-1px_rgba(255,179,0,0.7)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--amber)" />
    </SliderPrimitive.Root>
  );
}
