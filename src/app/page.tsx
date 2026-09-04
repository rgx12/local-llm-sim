"use client";

import { useMemo } from "react";
import { HardwareSelector } from "@/components/HardwareSelector";
import { ModelSelector } from "@/components/ModelSelector";
import { TokenStreamer } from "@/components/TokenStreamer";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { ComparisonChart } from "@/components/ComparisonChart";
import { runSimulation } from "@/engine/llmCalculator";
import { useResolvedConfig, useSimulatorStore } from "@/store/useSimulatorStore";
import { cn } from "@/lib/utils";

const STATUS_COPY = {
  FULL_VRAM: { label: "Ready", tone: "bg-(--status-good)" },
  PARTIAL_OFFLOAD: { label: "Offloading", tone: "bg-(--status-warn)" },
  OOM: { label: "Overloaded", tone: "bg-(--status-critical)" },
} as const;

export default function Home() {
  const { contextLengthTokens, outputTokens, ramCapacityGB } = useSimulatorStore();
  const { gpu, secondGpu, cpu, ram, pcie, model, quant, samplePrompt } = useResolvedConfig();

  const result = useMemo(
    () =>
      runSimulation({
        hardware: {
          gpu,
          secondGpu,
          cpuComputeGFLOPS: cpu.computeGFLOPS,
          ram,
          ramCapacityGB,
          pcie,
        },
        model,
        quant,
        contextLengthTokens,
        outputTokens,
      }),
    [gpu, secondGpu, cpu, ram, ramCapacityGB, pcie, model, quant, contextLengthTokens, outputTokens],
  );

  const status = STATUS_COPY[result.fitStatus];

  return (
    <div className="flex-1">
      <header className="border-b border-(--line)">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-tight text-(--ink)">LLM-BENCH</h1>
            <p className="text-xs text-(--ink-dim)">Local inference readout for custom PC builds</p>
          </div>
          <div className="ml-auto flex items-center gap-2 border border-(--line) px-3 py-1.5">
            <span className={cn("h-2 w-2 rounded-full", status.tone)} />
            <span className="font-(family-name:--font-data) text-xs text-(--ink-dim)">{status.label}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <div className="flex flex-col gap-6">
            <HardwareSelector />
            <ModelSelector />
          </div>

          <div className="flex flex-col gap-6">
            <AnalyticsDashboard result={result} />
            <TokenStreamer
              key={`${gpu.id}-${secondGpu?.id ?? "none"}-${cpu.id}-${ram.id}-${ramCapacityGB}-${pcie.gen}-${model.id}-${quant.id}-${samplePrompt.id}-${outputTokens}`}
              result={result}
              samplePrompt={samplePrompt}
              outputTokens={outputTokens}
            />
            <ComparisonChart />
          </div>
        </div>

        <footer className="border-t border-(--line) pt-4 pb-2 font-(family-name:--font-data) text-[11px] text-(--ink-faint)">
          Estimates are approximations from simplified bandwidth/compute models — real-world performance
          varies by inference engine, driver, and quantization implementation.
        </footer>
      </main>
    </div>
  );
}
