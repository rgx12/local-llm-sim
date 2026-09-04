"use client";

import { useMemo } from "react";
import { Cpu } from "lucide-react";
import { HardwareSelector } from "@/components/HardwareSelector";
import { ModelSelector } from "@/components/ModelSelector";
import { TokenStreamer } from "@/components/TokenStreamer";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { ComparisonChart } from "@/components/ComparisonChart";
import { runSimulation } from "@/engine/llmCalculator";
import { useResolvedConfig, useSimulatorStore } from "@/store/useSimulatorStore";

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

  return (
    <div className="flex-1 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.08),_transparent_55%)]">
      <header className="border-b border-slate-900/80 bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
            <Cpu className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-50">LLM Build Sim</h1>
            <p className="text-xs text-slate-500">Local Hardware &amp; Inference Speed Simulator</p>
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

        <footer className="pb-6 pt-2 text-center text-xs text-slate-600">
          Estimates are approximations based on simplified bandwidth/compute models — real-world
          performance varies by inference engine, driver, and quantization implementation.
        </footer>
      </main>
    </div>
  );
}
