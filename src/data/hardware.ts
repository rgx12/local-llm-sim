export type GpuVendor = "nvidia" | "apple" | "amd" | "custom";

export interface GpuSpec {
  id: string;
  name: string;
  vendor: GpuVendor;
  vramGB: number;
  bandwidthGBs: number;
  fp16TFLOPS: number;
  /** Apple-style unified memory shared between CPU/GPU. */
  isUnifiedMemory?: boolean;
  isCustom?: boolean;
}

export const GPUS: GpuSpec[] = [
  {
    id: "rtx-5090",
    name: "NVIDIA RTX 5090",
    vendor: "nvidia",
    vramGB: 32,
    bandwidthGBs: 1792,
    fp16TFLOPS: 105,
  },
  {
    id: "rtx-4090",
    name: "NVIDIA RTX 4090",
    vendor: "nvidia",
    vramGB: 24,
    bandwidthGBs: 1008,
    fp16TFLOPS: 82,
  },
  {
    id: "rtx-4070-ti-super",
    name: "NVIDIA RTX 4070 Ti Super",
    vendor: "nvidia",
    vramGB: 16,
    bandwidthGBs: 672,
    fp16TFLOPS: 44,
  },
  {
    id: "rtx-3060",
    name: "NVIDIA RTX 3060",
    vendor: "nvidia",
    vramGB: 12,
    bandwidthGBs: 360,
    fp16TFLOPS: 12.7,
  },
  {
    id: "apple-m3-max",
    name: "Apple M3 Max",
    vendor: "apple",
    vramGB: 128,
    bandwidthGBs: 400,
    fp16TFLOPS: 28.4,
    isUnifiedMemory: true,
  },
  {
    id: "apple-m2-ultra",
    name: "Apple M2 Ultra",
    vendor: "apple",
    vramGB: 192,
    bandwidthGBs: 800,
    fp16TFLOPS: 27.2,
    isUnifiedMemory: true,
  },
  {
    id: "custom",
    name: "Custom GPU (manual entry)",
    vendor: "custom",
    vramGB: 16,
    bandwidthGBs: 500,
    fp16TFLOPS: 30,
    isCustom: true,
  },
];

export const REFERENCE_GPU_IDS = [
  "rtx-3060",
  "rtx-4070-ti-super",
  "rtx-4090",
  "rtx-5090",
  "apple-m3-max",
  "apple-m2-ultra",
];

export interface CpuSpec {
  id: string;
  name: string;
  /** Approximate real-world FP32 throughput in GFLOPS, used for CPU-bound prefill. */
  computeGFLOPS: number;
}

export const CPUS: CpuSpec[] = [
  { id: "budget-quadcore", name: "Budget Quad-Core (e.g. i3 / Ryzen 3)", computeGFLOPS: 120 },
  { id: "i5-13600k", name: "Intel Core i5-13600K", computeGFLOPS: 420 },
  { id: "i9-14900k", name: "Intel Core i9-14900K", computeGFLOPS: 620 },
  { id: "ryzen-7800x3d", name: "AMD Ryzen 7 7800X3D", computeGFLOPS: 480 },
  { id: "ryzen-9950x", name: "AMD Ryzen 9 9950X", computeGFLOPS: 720 },
  { id: "threadripper-7970x", name: "AMD Threadripper 7970X", computeGFLOPS: 1400 },
  { id: "apple-m3-max-cpu", name: "Apple M3 Max CPU cores", computeGFLOPS: 600 },
  { id: "apple-m2-ultra-cpu", name: "Apple M2 Ultra CPU cores", computeGFLOPS: 820 },
];

export type RamChannelLayout = "dual" | "quad" | "unified";

export interface RamSpec {
  id: string;
  name: string;
  type: "DDR4" | "DDR5" | "Unified";
  layout: RamChannelLayout;
  speedMHz: number;
  bandwidthGBs: number;
}

export const RAM_OPTIONS: RamSpec[] = [
  { id: "ddr4-3200-dual", name: "DDR4-3200 Dual-Channel", type: "DDR4", layout: "dual", speedMHz: 3200, bandwidthGBs: 50 },
  { id: "ddr4-3600-dual", name: "DDR4-3600 Dual-Channel", type: "DDR4", layout: "dual", speedMHz: 3600, bandwidthGBs: 57.6 },
  { id: "ddr5-5600-dual", name: "DDR5-5600 Dual-Channel", type: "DDR5", layout: "dual", speedMHz: 5600, bandwidthGBs: 89.6 },
  { id: "ddr5-6000-dual", name: "DDR5-6000 Dual-Channel", type: "DDR5", layout: "dual", speedMHz: 6000, bandwidthGBs: 96 },
  { id: "ddr5-8000-dual", name: "DDR5-8000 Dual-Channel", type: "DDR5", layout: "dual", speedMHz: 8000, bandwidthGBs: 128 },
  { id: "ddr5-6000-quad", name: "DDR5-6000 Quad-Channel (HEDT/Server)", type: "DDR5", layout: "quad", speedMHz: 6000, bandwidthGBs: 192 },
  { id: "unified-400", name: "Unified Memory (~400 GB/s class)", type: "Unified", layout: "unified", speedMHz: 0, bandwidthGBs: 400 },
];

export type PcieGen = "3.0" | "4.0" | "5.0";

export interface PcieSpec {
  gen: PcieGen;
  label: string;
  /** Efficiency multiplier applied to effective bandwidth only during partial GPU/RAM offload. */
  efficiencyFactor: number;
}

export const PCIE_OPTIONS: PcieSpec[] = [
  { gen: "3.0", label: "PCIe 3.0 x16", efficiencyFactor: 0.9 },
  { gen: "4.0", label: "PCIe 4.0 x16", efficiencyFactor: 0.96 },
  { gen: "5.0", label: "PCIe 5.0 x16", efficiencyFactor: 1.0 },
];

export const RAM_CAPACITY_OPTIONS_GB = [16, 32, 64, 128, 256];
