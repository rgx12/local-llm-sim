"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GPUS, REFERENCE_GPU_IDS } from "@/data/hardware";
import { runSimulation } from "@/engine/llmCalculator";
import { useResolvedConfig, useSimulatorStore } from "@/store/useSimulatorStore";
import { formatNumber } from "@/lib/utils";

const SERIES_YOUR_BUILD = "#d95926";
const SERIES_REFERENCE = "#3987e5";

export function ComparisonChart() {
  const { ramCapacityGB } = useSimulatorStore();
  const { gpu, secondGpu, ram, pcie, model, quant, cpu } = useResolvedConfig();

  const data = useMemo(() => {
    const isSimpleSingleGpu = !secondGpu && !gpu.isCustom;

    const referenceRows = REFERENCE_GPU_IDS.map((id) => {
      const refGpu = GPUS.find((g) => g.id === id)!;
      const result = runSimulation({
        hardware: {
          gpu: refGpu,
          cpuComputeGFLOPS: cpu.computeGFLOPS,
          ram,
          ramCapacityGB,
          pcie,
        },
        model,
        quant,
        contextLengthTokens: 4096,
        outputTokens: 256,
      });
      return {
        name: refGpu.name,
        tokPerSec: Number(result.tokensPerSecond.toFixed(2)),
        isCurrent: isSimpleSingleGpu && refGpu.id === gpu.id,
      };
    });

    if (!isSimpleSingleGpu) {
      const result = runSimulation({
        hardware: { gpu, secondGpu, cpuComputeGFLOPS: cpu.computeGFLOPS, ram, ramCapacityGB, pcie },
        model,
        quant,
        contextLengthTokens: 4096,
        outputTokens: 256,
      });
      const label = secondGpu ? `${gpu.name} + ${secondGpu.name}` : gpu.name;
      referenceRows.push({
        name: `${label} (Your Build)`,
        tokPerSec: Number(result.tokensPerSecond.toFixed(2)),
        isCurrent: true,
      });
    }

    return referenceRows.sort((a, b) => a.tokPerSec - b.tokPerSec);
  }, [gpu, secondGpu, ram, pcie, model, quant, cpu, ramCapacityGB]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-400" /> Hardware Comparison
        </CardTitle>
        <CardDescription>
          {model.name} ({quant.name}) generation speed across reference GPUs — same RAM/PCIe as your build.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="#2c2c2a" />
              <XAxis
                type="number"
                stroke="#898781"
                tick={{ fill: "#898781", fontSize: 11 }}
                label={{ value: "tok/s", position: "insideBottomRight", fill: "#898781", fontSize: 11, offset: -2 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={170}
                stroke="#898781"
                tick={{ fill: "#c3c2b7", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  background: "#1a1a19",
                  border: "1px solid #383835",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#ffffff",
                }}
                formatter={(value) => [`${formatNumber(Number(value), 1)} tok/s`, "Speed"]}
              />
              <Bar dataKey="tokPerSec" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.isCurrent ? SERIES_YOUR_BUILD : SERIES_REFERENCE}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: SERIES_REFERENCE }} />
            Reference GPU
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: SERIES_YOUR_BUILD }} />
            Your Build
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
