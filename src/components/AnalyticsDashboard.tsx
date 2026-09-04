import { Gauge, Clock, HardDrive, MemoryStick } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { SimulationResult } from "@/engine/llmCalculator";
import { FIT_STATUS_LABELS, getSpeedTier, SPEED_TIER_LABELS } from "@/engine/llmCalculator";
import { cn, formatGB, formatNumber } from "@/lib/utils";

const fitToneMap = {
  FULL_VRAM: "success",
  PARTIAL_OFFLOAD: "warning",
  OOM: "danger",
} as const;

const speedToneMap = {
  slow: "danger",
  usable: "warning",
  fast: "success",
  blazing: "success",
} as const;

function formatMs(ms: number): string {
  if (!Number.isFinite(ms)) return "∞";
  const seconds = ms / 1000;
  if (seconds >= 3600) return `${formatNumber(seconds / 3600, 1)} h`;
  if (seconds >= 60) return `${formatNumber(seconds / 60, 1)} min`;
  if (seconds >= 1) return `${formatNumber(seconds, 2)} s`;
  return `${formatNumber(ms, 0)} ms`;
}

export function AnalyticsDashboard({ result }: { result: SimulationResult }) {
  const tier = getSpeedTier(result.tokensPerSecond);
  const vramPct = Math.min(result.vramUtilizationPct, 100);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-emerald-400" /> Estimated Speed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-50">
            {result.fitStatus === "OOM" ? "—" : formatNumber(result.tokensPerSecond, 1)}
            <span className="ml-1 text-base font-medium text-slate-400">tok/s</span>
          </div>
          <Badge tone={speedToneMap[tier]} className="mt-2">
            {SPEED_TIER_LABELS[tier]}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-emerald-400" /> Fit Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-semibold leading-snug text-slate-100">
            {FIT_STATUS_LABELS[result.fitStatus]}
          </div>
          <Badge tone={fitToneMap[result.fitStatus]} className="mt-2">
            {result.fitStatus === "PARTIAL_OFFLOAD"
              ? `${formatGB(result.offloadedToRamGB)} offloaded`
              : result.fitStatus === "OOM"
                ? `Short by ${formatGB(result.offloadedToRamGB)}`
                : "All layers on GPU"}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" /> Time To First Token
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-50">{formatMs(result.ttftMs)}</div>
          <p className="mt-2 text-xs text-slate-500">Prefill phase, compute-bound</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2">
            <MemoryStick className="h-4 w-4 text-emerald-400" /> VRAM Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-sm font-semibold text-slate-100">
            {formatGB(result.vramUsedGB)} / {formatGB(result.totalVramGB)} ({formatNumber(vramPct, 0)}%)
          </div>
          <Progress
            value={vramPct}
            barClassName={cn(
              result.fitStatus === "OOM" && "bg-red-500",
              result.fitStatus === "PARTIAL_OFFLOAD" && "bg-amber-500",
            )}
          />
          <p className="mt-2 text-xs text-slate-500">
            Model size: {formatGB(result.modelMemoryGB)} (incl. KV cache overhead)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
