import type { GpuSpec, PcieSpec, RamSpec } from "@/data/hardware";
import type { ModelSpec, QuantizationSpec } from "@/data/models";

/** KV cache + context/runtime overhead multiplier applied on top of raw weight size. */
export const CONTEXT_OVERHEAD_FACTOR = 1.15;

/** Efficiency factor applied to raw memory bandwidth to get real-world achievable bandwidth. */
export const BANDWIDTH_EFFICIENCY_FACTOR = 0.85;

/** Fraction of theoretical peak TFLOPS/GFLOPS realistically achieved during prefill. */
const GPU_COMPUTE_UTILIZATION = 0.35;
const CPU_COMPUTE_UTILIZATION = 0.15;

export type FitStatus = "FULL_VRAM" | "PARTIAL_OFFLOAD" | "OOM";

export interface HardwareInput {
  gpu: GpuSpec;
  /** Optional second GPU for dual-GPU configurations. */
  secondGpu?: GpuSpec | null;
  cpuComputeGFLOPS: number;
  ram: RamSpec;
  ramCapacityGB: number;
  pcie: PcieSpec;
}

export interface SimulationInput {
  hardware: HardwareInput;
  model: ModelSpec;
  quant: QuantizationSpec;
  contextLengthTokens: number;
  outputTokens: number;
}

export interface SimulationResult {
  modelMemoryGB: number;
  totalVramGB: number;
  effectiveGpuBandwidthGBs: number;
  fitStatus: FitStatus;
  gpuLayerRatio: number;
  offloadedToRamGB: number;
  effectiveBandwidthGBs: number;
  tokensPerSecond: number;
  ttftMs: number;
  vramUsedGB: number;
  vramUtilizationPct: number;
}

/** Step 1: Model Weight Size Calculation (GB), including KV cache/context overhead. */
export function calculateModelMemoryGB(paramsB: number, bitsPerWeight: number): number {
  return ((paramsB * bitsPerWeight) / 8) * CONTEXT_OVERHEAD_FACTOR;
}

/**
 * Combined GPU pool for single or dual-GPU setups. Dual GPU VRAM adds up, but the
 * usable bandwidth is bottlenecked by the slower card once layers are split across
 * both devices, so we take the minimum rather than the sum.
 */
export function resolveGpuPool(gpu: GpuSpec, secondGpu?: GpuSpec | null) {
  if (!secondGpu) {
    return { vramGB: gpu.vramGB, bandwidthGBs: gpu.bandwidthGBs, fp16TFLOPS: gpu.fp16TFLOPS };
  }
  return {
    vramGB: gpu.vramGB + secondGpu.vramGB,
    bandwidthGBs: Math.min(gpu.bandwidthGBs, secondGpu.bandwidthGBs),
    fp16TFLOPS: gpu.fp16TFLOPS + secondGpu.fp16TFLOPS,
  };
}

/** Step 2: Hardware Placement & Memory Allocation. */
export function calculatePlacement(modelMemoryGB: number, vramGB: number, ramCapacityGB: number) {
  if (modelMemoryGB <= vramGB) {
    return {
      fitStatus: "FULL_VRAM" as FitStatus,
      gpuLayerRatio: 1,
      offloadedToRamGB: 0,
    };
  }

  const offloadedToRamGB = modelMemoryGB - vramGB;

  if (offloadedToRamGB > ramCapacityGB) {
    return {
      fitStatus: "OOM" as FitStatus,
      gpuLayerRatio: Math.max(vramGB / modelMemoryGB, 0),
      offloadedToRamGB,
    };
  }

  return {
    fitStatus: "PARTIAL_OFFLOAD" as FitStatus,
    gpuLayerRatio: vramGB / modelMemoryGB,
    offloadedToRamGB,
  };
}

/** Step 3: Effective Memory Bandwidth (the generation-phase bottleneck). */
export function calculateEffectiveBandwidth(
  fitStatus: FitStatus,
  gpuLayerRatio: number,
  gpuBandwidthGBs: number,
  ramBandwidthGBs: number,
  pcieEfficiencyFactor: number,
): number {
  if (fitStatus === "FULL_VRAM") {
    return gpuBandwidthGBs * BANDWIDTH_EFFICIENCY_FACTOR;
  }

  // Harmonic-mean blend: time-per-byte is additive across the GPU-resident and
  // RAM-resident portions of the model, so bandwidth (bytes/sec) combines this way.
  const harmonicBandwidth =
    1 / (gpuLayerRatio / gpuBandwidthGBs + (1 - gpuLayerRatio) / ramBandwidthGBs);

  // Partial offload requires shuttling activations between GPU and system RAM over
  // PCIe every token, so real-world throughput sits a bit below the pure harmonic mean.
  return harmonicBandwidth * BANDWIDTH_EFFICIENCY_FACTOR * pcieEfficiencyFactor;
}

/** Step 4: Generation Speed (tokens/second). */
export function calculateTokensPerSecond(effectiveBandwidthGBs: number, modelMemoryGB: number): number {
  if (modelMemoryGB <= 0) return 0;
  return effectiveBandwidthGBs / modelMemoryGB;
}

/** Step 5: Time To First Token (TTFT) — compute-bound prefill phase. */
export function calculateTtftMs(
  paramsB: number,
  promptTokens: number,
  gpuLayerRatio: number,
  gpuFp16TFLOPS: number,
  cpuComputeGFLOPS: number,
): number {
  // Standard inference FLOPs approximation: ~2 FLOPs per parameter per token.
  const flopsPerToken = 2 * paramsB * 1e9;
  const totalFlops = flopsPerToken * Math.max(promptTokens, 1);

  const gpuThroughputFlops = gpuFp16TFLOPS * 1e12 * GPU_COMPUTE_UTILIZATION;
  const cpuThroughputFlops = cpuComputeGFLOPS * 1e9 * CPU_COMPUTE_UTILIZATION;

  // Blend GPU/CPU compute throughput by how much of the model resides on each device.
  const effectiveThroughputFlops =
    gpuLayerRatio * gpuThroughputFlops + (1 - gpuLayerRatio) * cpuThroughputFlops;

  if (effectiveThroughputFlops <= 0) return Infinity;

  const prefillSeconds = totalFlops / effectiveThroughputFlops;
  return prefillSeconds * 1000;
}

export function runSimulation(input: SimulationInput): SimulationResult {
  const { hardware, model, quant, contextLengthTokens } = input;
  const gpuPool = resolveGpuPool(hardware.gpu, hardware.secondGpu);

  const modelMemoryGB = calculateModelMemoryGB(model.paramsB, quant.bitsPerWeight);

  const placement = calculatePlacement(modelMemoryGB, gpuPool.vramGB, hardware.ramCapacityGB);

  const effectiveBandwidthGBs =
    placement.fitStatus === "OOM"
      ? 0
      : calculateEffectiveBandwidth(
          placement.fitStatus,
          placement.gpuLayerRatio,
          gpuPool.bandwidthGBs,
          hardware.ram.bandwidthGBs,
          hardware.pcie.efficiencyFactor,
        );

  const tokensPerSecond =
    placement.fitStatus === "OOM" ? 0 : calculateTokensPerSecond(effectiveBandwidthGBs, modelMemoryGB);

  const ttftMs =
    placement.fitStatus === "OOM"
      ? Infinity
      : calculateTtftMs(
          model.paramsB,
          contextLengthTokens,
          placement.gpuLayerRatio,
          gpuPool.fp16TFLOPS,
          hardware.cpuComputeGFLOPS,
        );

  const vramUsedGB = Math.min(modelMemoryGB, gpuPool.vramGB);
  const vramUtilizationPct = gpuPool.vramGB > 0 ? (vramUsedGB / gpuPool.vramGB) * 100 : 0;

  return {
    modelMemoryGB,
    totalVramGB: gpuPool.vramGB,
    effectiveGpuBandwidthGBs: gpuPool.bandwidthGBs,
    fitStatus: placement.fitStatus,
    gpuLayerRatio: placement.gpuLayerRatio,
    offloadedToRamGB: placement.offloadedToRamGB,
    effectiveBandwidthGBs,
    tokensPerSecond,
    ttftMs,
    vramUsedGB,
    vramUtilizationPct,
  };
}

export type SpeedTier = "slow" | "usable" | "fast" | "blazing";

export function getSpeedTier(tokensPerSecond: number): SpeedTier {
  if (tokensPerSecond < 5) return "slow";
  if (tokensPerSecond < 15) return "usable";
  if (tokensPerSecond < 40) return "fast";
  return "blazing";
}

export const SPEED_TIER_LABELS: Record<SpeedTier, string> = {
  slow: "Slow",
  usable: "Usable",
  fast: "Fast",
  blazing: "Blazing Fast",
};

export const FIT_STATUS_LABELS: Record<FitStatus, string> = {
  FULL_VRAM: "100% VRAM (Optimal)",
  PARTIAL_OFFLOAD: "Partial Offload (VRAM + RAM)",
  OOM: "OOM (Out of Memory)",
};
