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

const SERIES_YOUR_BUILD = "#c87f08";
const SERIES_REFERENCE = "#0e93b5";
const GRID_LINE = "#2a342c";
const AXIS_INK = "#8b9289";
const TICK_INK = "#c9cec4";

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
        <CardTitle>
          <BarChart3 className="h-4 w-4 text-(--amber)" /> Hardware comparison
        </CardTitle>
        <CardDescription>
          {model.name} ({quant.name}) generation speed across reference GPUs — same RAM/PCIe as your build.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke={GRID_LINE} />
              <XAxis
                type="number"
                stroke={AXIS_INK}
                tick={{ fill: AXIS_INK, fontSize: 11, fontFamily: "var(--font-data)" }}
                label={{
                  value: "tok/s",
                  position: "insideBottomRight",
                  fill: AXIS_INK,
                  fontSize: 11,
                  offset: -2,
                }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={170}
                stroke={AXIS_INK}
                tick={{ fill: TICK_INK, fontSize: 11, fontFamily: "var(--font-data)" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(233,230,220,0.04)" }}
                contentStyle={{
                  background: "#0d1310",
                  border: "1px solid #414f43",
                  borderRadius: 0,
                  fontSize: 12,
                  fontFamily: "var(--font-data)",
                  color: "#e9e6dc",
                }}
                labelStyle={{ color: "#8b9289" }}
                formatter={(value) => [`${formatNumber(Number(value), 1)} tok/s`, "Speed"]}
              />
              <Bar dataKey="tokPerSec" radius={0} maxBarSize={16}>
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
        <div className="mt-2 flex items-center gap-4 text-xs text-(--ink-dim)">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2" style={{ background: SERIES_REFERENCE }} />
            Reference GPU
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2" style={{ background: SERIES_YOUR_BUILD }} />
            Your build
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
