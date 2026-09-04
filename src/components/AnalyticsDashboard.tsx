import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { SimulationResult } from "@/engine/llmCalculator";
import { FIT_STATUS_LABELS, getSpeedTier, SPEED_TIER_LABELS } from "@/engine/llmCalculator";
import { cn, formatGB, formatNumber } from "@/lib/utils";

const fitToneMap = {
  FULL_VRAM: "good",
  PARTIAL_OFFLOAD: "warn",
  OOM: "critical",
} as const;

const speedToneMap = {
  slow: "critical",
  usable: "warn",
  fast: "good",
  blazing: "good",
} as const;

function formatMs(ms: number): string {
  if (!Number.isFinite(ms)) return "∞";
  const seconds = ms / 1000;
  if (seconds >= 3600) return `${formatNumber(seconds / 3600, 1)} h`;
  if (seconds >= 60) return `${formatNumber(seconds / 60, 1)} min`;
  if (seconds >= 1) return `${formatNumber(seconds, 2)} s`;
  return `${formatNumber(ms, 0)} ms`;
}

function DataRow({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "good" | "warn" | "critical";
}) {
  const toneColor =
    tone === "good" ? "text-(--status-good)" : tone === "warn" ? "text-(--status-warn)" : tone === "critical" ? "text-(--status-critical)" : "text-(--ink)";
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-(--line) py-2.5 first:border-t-0">
      <span className="text-xs text-(--ink-dim)">{label}</span>
      <span className="text-right">
        <span className={cn("font-(family-name:--font-data) text-sm font-medium", toneColor)}>{value}</span>
        {detail && <span className="ml-2 text-[11px] text-(--ink-faint)">{detail}</span>}
      </span>
    </div>
  );
}

export function AnalyticsDashboard({ result }: { result: SimulationResult }) {
  const tier = getSpeedTier(result.tokensPerSecond);
  const vramPct = Math.min(result.vramUtilizationPct, 100);
  const isOom = result.fitStatus === "OOM";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Primary readout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr]">
          <div className="power-on flex flex-col items-start justify-center border border-(--line) bg-(--panel-recessed) px-6 py-5 sm:min-w-[240px]">
            <div className="flex items-baseline gap-2">
              {isOom ? (
                <span className="font-(family-name:--font-data) text-4xl font-bold leading-none text-(--status-critical)">
                  no fit
                </span>
              ) : (
                <span
                  className="font-(family-name:--font-data) text-6xl font-bold leading-none text-(--amber)"
                  style={{ textShadow: "0 0 28px rgba(255,179,0,0.35)" }}
                >
                  {formatNumber(result.tokensPerSecond, 1)}
                </span>
              )}
              {!isOom && <span className="font-(family-name:--font-data) text-lg text-(--ink-dim)">tok/s</span>}
            </div>
            <Badge tone={isOom ? "critical" : speedToneMap[tier]} className="mt-3">
              {isOom ? "Out of memory" : SPEED_TIER_LABELS[tier]}
            </Badge>
          </div>

          <div className="flex flex-col justify-center">
            <DataRow
              label="Fit status"
              value={FIT_STATUS_LABELS[result.fitStatus]}
              tone={fitToneMap[result.fitStatus]}
              detail={
                result.fitStatus === "PARTIAL_OFFLOAD"
                  ? `${formatGB(result.offloadedToRamGB)} offloaded`
                  : result.fitStatus === "OOM"
                    ? `short by ${formatGB(result.offloadedToRamGB)}`
                    : undefined
              }
            />
            <DataRow label="Time to first token" value={formatMs(result.ttftMs)} detail="prefill, compute-bound" />
            <div className="border-t border-(--line) py-2.5">
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-xs text-(--ink-dim)">VRAM utilization</span>
                <span className="font-(family-name:--font-data) text-sm font-medium text-(--ink)">
                  {formatGB(result.vramUsedGB)} / {formatGB(result.totalVramGB)} ({formatNumber(vramPct, 0)}%)
                </span>
              </div>
              <Progress
                value={vramPct}
                barClassName={cn(
                  result.fitStatus === "OOM" && "!bg-(--status-critical) !border-(--status-critical)",
                  result.fitStatus === "PARTIAL_OFFLOAD" && "!bg-(--status-warn) !border-(--status-warn)",
                )}
              />
              <p className="mt-1.5 text-[11px] text-(--ink-faint)">
                Model size {formatGB(result.modelMemoryGB)} incl. KV cache overhead
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
