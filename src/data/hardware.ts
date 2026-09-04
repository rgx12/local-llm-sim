export type GpuVendor = "nvidia" | "amd" | "intel" | "apple" | "custom";
export type GpuSegment = "consumer" | "workstation" | "datacenter";

export interface GpuSpec {
  id: string;
  name: string;
  vendor: GpuVendor;
  segment?: GpuSegment;
  vramGB: number;
  bandwidthGBs: number;
  fp16TFLOPS: number;
  /** Apple-style unified memory shared between CPU/GPU. */
  isUnifiedMemory?: boolean;
  isCustom?: boolean;
}

export const GPUS: GpuSpec[] = [
  // --- NVIDIA GeForce RTX 50 series (Blackwell) ---
  { id: "rtx-5090", name: "NVIDIA RTX 5090", vendor: "nvidia", segment: "consumer", vramGB: 32, bandwidthGBs: 1792, fp16TFLOPS: 105 },
  { id: "rtx-5080", name: "NVIDIA RTX 5080", vendor: "nvidia", segment: "consumer", vramGB: 16, bandwidthGBs: 960, fp16TFLOPS: 56.3 },
  { id: "rtx-5070-ti", name: "NVIDIA RTX 5070 Ti", vendor: "nvidia", segment: "consumer", vramGB: 16, bandwidthGBs: 896, fp16TFLOPS: 44 },
  { id: "rtx-5070", name: "NVIDIA RTX 5070", vendor: "nvidia", segment: "consumer", vramGB: 12, bandwidthGBs: 672, fp16TFLOPS: 30.9 },

  // --- NVIDIA GeForce RTX 40 series (Ada Lovelace) ---
  { id: "rtx-4090", name: "NVIDIA RTX 4090", vendor: "nvidia", segment: "consumer", vramGB: 24, bandwidthGBs: 1008, fp16TFLOPS: 82.6 },
  { id: "rtx-4080-super", name: "NVIDIA RTX 4080 Super", vendor: "nvidia", segment: "consumer", vramGB: 16, bandwidthGBs: 736, fp16TFLOPS: 52.2 },
  { id: "rtx-4080", name: "NVIDIA RTX 4080", vendor: "nvidia", segment: "consumer", vramGB: 16, bandwidthGBs: 716.8, fp16TFLOPS: 48.7 },
  { id: "rtx-4070-ti-super", name: "NVIDIA RTX 4070 Ti Super", vendor: "nvidia", segment: "consumer", vramGB: 16, bandwidthGBs: 672, fp16TFLOPS: 44.1 },
  { id: "rtx-4070-ti", name: "NVIDIA RTX 4070 Ti", vendor: "nvidia", segment: "consumer", vramGB: 12, bandwidthGBs: 504.2, fp16TFLOPS: 40.1 },
  { id: "rtx-4070-super", name: "NVIDIA RTX 4070 Super", vendor: "nvidia", segment: "consumer", vramGB: 12, bandwidthGBs: 504.2, fp16TFLOPS: 35.5 },
  { id: "rtx-4070", name: "NVIDIA RTX 4070", vendor: "nvidia", segment: "consumer", vramGB: 12, bandwidthGBs: 504.2, fp16TFLOPS: 29.1 },
  { id: "rtx-4060-ti-16gb", name: "NVIDIA RTX 4060 Ti 16GB", vendor: "nvidia", segment: "consumer", vramGB: 16, bandwidthGBs: 288, fp16TFLOPS: 22.1 },
  { id: "rtx-4060-ti-8gb", name: "NVIDIA RTX 4060 Ti 8GB", vendor: "nvidia", segment: "consumer", vramGB: 8, bandwidthGBs: 288, fp16TFLOPS: 22.1 },
  { id: "rtx-4060", name: "NVIDIA RTX 4060", vendor: "nvidia", segment: "consumer", vramGB: 8, bandwidthGBs: 272, fp16TFLOPS: 15.1 },

  // --- NVIDIA GeForce RTX 30 series (Ampere) ---
  { id: "rtx-3090-ti", name: "NVIDIA RTX 3090 Ti", vendor: "nvidia", segment: "consumer", vramGB: 24, bandwidthGBs: 1008, fp16TFLOPS: 40 },
  { id: "rtx-3090", name: "NVIDIA RTX 3090", vendor: "nvidia", segment: "consumer", vramGB: 24, bandwidthGBs: 936, fp16TFLOPS: 35.6 },
  { id: "rtx-3080-ti", name: "NVIDIA RTX 3080 Ti", vendor: "nvidia", segment: "consumer", vramGB: 12, bandwidthGBs: 912, fp16TFLOPS: 34.1 },
  { id: "rtx-3080-12gb", name: "NVIDIA RTX 3080 12GB", vendor: "nvidia", segment: "consumer", vramGB: 12, bandwidthGBs: 912, fp16TFLOPS: 30.6 },
  { id: "rtx-3080", name: "NVIDIA RTX 3080 10GB", vendor: "nvidia", segment: "consumer", vramGB: 10, bandwidthGBs: 760, fp16TFLOPS: 29.8 },
  { id: "rtx-3070-ti", name: "NVIDIA RTX 3070 Ti", vendor: "nvidia", segment: "consumer", vramGB: 8, bandwidthGBs: 608, fp16TFLOPS: 21.7 },
  { id: "rtx-3070", name: "NVIDIA RTX 3070", vendor: "nvidia", segment: "consumer", vramGB: 8, bandwidthGBs: 448, fp16TFLOPS: 20.3 },
  { id: "rtx-3060-ti", name: "NVIDIA RTX 3060 Ti", vendor: "nvidia", segment: "consumer", vramGB: 8, bandwidthGBs: 448, fp16TFLOPS: 16.2 },
  { id: "rtx-3060", name: "NVIDIA RTX 3060 12GB", vendor: "nvidia", segment: "consumer", vramGB: 12, bandwidthGBs: 360, fp16TFLOPS: 12.7 },
  { id: "rtx-3060-8gb", name: "NVIDIA RTX 3060 8GB", vendor: "nvidia", segment: "consumer", vramGB: 8, bandwidthGBs: 240, fp16TFLOPS: 12.7 },

  // --- NVIDIA GeForce RTX 20 series (Turing, still common secondhand) ---
  { id: "rtx-2080-ti", name: "NVIDIA RTX 2080 Ti", vendor: "nvidia", segment: "consumer", vramGB: 11, bandwidthGBs: 616, fp16TFLOPS: 26.9 },

  // --- NVIDIA RTX / Quadro workstation ---
  { id: "rtx-6000-ada", name: "NVIDIA RTX 6000 Ada", vendor: "nvidia", segment: "workstation", vramGB: 48, bandwidthGBs: 960, fp16TFLOPS: 91.1 },
  { id: "rtx-5000-ada", name: "NVIDIA RTX 5000 Ada", vendor: "nvidia", segment: "workstation", vramGB: 32, bandwidthGBs: 576, fp16TFLOPS: 65.3 },
  { id: "rtx-4000-ada", name: "NVIDIA RTX 4000 Ada", vendor: "nvidia", segment: "workstation", vramGB: 20, bandwidthGBs: 360, fp16TFLOPS: 26.7 },
  { id: "rtx-a6000", name: "NVIDIA RTX A6000", vendor: "nvidia", segment: "workstation", vramGB: 48, bandwidthGBs: 768, fp16TFLOPS: 38.7 },
  { id: "rtx-a5000", name: "NVIDIA RTX A5000", vendor: "nvidia", segment: "workstation", vramGB: 24, bandwidthGBs: 768, fp16TFLOPS: 27.8 },

  // --- NVIDIA datacenter ---
  { id: "h200-sxm", name: "NVIDIA H200 SXM", vendor: "nvidia", segment: "datacenter", vramGB: 141, bandwidthGBs: 4800, fp16TFLOPS: 989 },
  { id: "h100-sxm", name: "NVIDIA H100 SXM", vendor: "nvidia", segment: "datacenter", vramGB: 80, bandwidthGBs: 3350, fp16TFLOPS: 989 },
  { id: "h100-pcie", name: "NVIDIA H100 PCIe", vendor: "nvidia", segment: "datacenter", vramGB: 80, bandwidthGBs: 2000, fp16TFLOPS: 756 },
  { id: "a100-80gb", name: "NVIDIA A100 80GB SXM", vendor: "nvidia", segment: "datacenter", vramGB: 80, bandwidthGBs: 2039, fp16TFLOPS: 312 },
  { id: "a100-40gb", name: "NVIDIA A100 40GB", vendor: "nvidia", segment: "datacenter", vramGB: 40, bandwidthGBs: 1555, fp16TFLOPS: 312 },
  { id: "l40s", name: "NVIDIA L40S", vendor: "nvidia", segment: "datacenter", vramGB: 48, bandwidthGBs: 864, fp16TFLOPS: 181 },
  { id: "v100-32gb", name: "NVIDIA V100 32GB", vendor: "nvidia", segment: "datacenter", vramGB: 32, bandwidthGBs: 900, fp16TFLOPS: 125 },

  // --- AMD Radeon RX (RDNA3 / RDNA2) ---
  { id: "rx-7900-xtx", name: "AMD RX 7900 XTX", vendor: "amd", segment: "consumer", vramGB: 24, bandwidthGBs: 960, fp16TFLOPS: 122.8 },
  { id: "rx-7900-xt", name: "AMD RX 7900 XT", vendor: "amd", segment: "consumer", vramGB: 20, bandwidthGBs: 800, fp16TFLOPS: 103 },
  { id: "rx-7800-xt", name: "AMD RX 7800 XT", vendor: "amd", segment: "consumer", vramGB: 16, bandwidthGBs: 624, fp16TFLOPS: 74.3 },
  { id: "rx-7600", name: "AMD RX 7600", vendor: "amd", segment: "consumer", vramGB: 8, bandwidthGBs: 288, fp16TFLOPS: 43.5 },
  { id: "rx-6900-xt", name: "AMD RX 6900 XT", vendor: "amd", segment: "consumer", vramGB: 16, bandwidthGBs: 512, fp16TFLOPS: 46.1 },
  { id: "rx-6800-xt", name: "AMD RX 6800 XT", vendor: "amd", segment: "consumer", vramGB: 16, bandwidthGBs: 512, fp16TFLOPS: 41.3 },

  // --- AMD Radeon Pro / Instinct ---
  { id: "radeon-pro-w7900", name: "AMD Radeon Pro W7900", vendor: "amd", segment: "workstation", vramGB: 48, bandwidthGBs: 864, fp16TFLOPS: 122.6 },
  { id: "instinct-mi300x", name: "AMD Instinct MI300X", vendor: "amd", segment: "datacenter", vramGB: 192, bandwidthGBs: 5300, fp16TFLOPS: 1307 },

  // --- Intel Arc ---
  { id: "arc-a770", name: "Intel Arc A770 16GB", vendor: "intel", segment: "consumer", vramGB: 16, bandwidthGBs: 560, fp16TFLOPS: 39.3 },
  { id: "arc-b580", name: "Intel Arc B580", vendor: "intel", segment: "consumer", vramGB: 12, bandwidthGBs: 456, fp16TFLOPS: 34 },

  // --- Apple Silicon (unified memory) ---
  { id: "apple-m1", name: "Apple M1", vendor: "apple", vramGB: 16, bandwidthGBs: 68.25, fp16TFLOPS: 2.6, isUnifiedMemory: true },
  { id: "apple-m1-pro", name: "Apple M1 Pro", vendor: "apple", vramGB: 32, bandwidthGBs: 200, fp16TFLOPS: 5.2, isUnifiedMemory: true },
  { id: "apple-m1-max", name: "Apple M1 Max", vendor: "apple", vramGB: 64, bandwidthGBs: 400, fp16TFLOPS: 10.4, isUnifiedMemory: true },
  { id: "apple-m1-ultra", name: "Apple M1 Ultra", vendor: "apple", vramGB: 128, bandwidthGBs: 800, fp16TFLOPS: 21, isUnifiedMemory: true },
  { id: "apple-m2", name: "Apple M2", vendor: "apple", vramGB: 24, bandwidthGBs: 100, fp16TFLOPS: 3.6, isUnifiedMemory: true },
  { id: "apple-m2-pro", name: "Apple M2 Pro", vendor: "apple", vramGB: 32, bandwidthGBs: 200, fp16TFLOPS: 6.8, isUnifiedMemory: true },
  { id: "apple-m2-max", name: "Apple M2 Max", vendor: "apple", vramGB: 96, bandwidthGBs: 400, fp16TFLOPS: 13.6, isUnifiedMemory: true },
  { id: "apple-m2-ultra", name: "Apple M2 Ultra", vendor: "apple", vramGB: 192, bandwidthGBs: 800, fp16TFLOPS: 27.2, isUnifiedMemory: true },
  { id: "apple-m3", name: "Apple M3", vendor: "apple", vramGB: 24, bandwidthGBs: 100, fp16TFLOPS: 4.1, isUnifiedMemory: true },
  { id: "apple-m3-pro", name: "Apple M3 Pro", vendor: "apple", vramGB: 36, bandwidthGBs: 150, fp16TFLOPS: 7.4, isUnifiedMemory: true },
  { id: "apple-m3-max", name: "Apple M3 Max", vendor: "apple", vramGB: 128, bandwidthGBs: 400, fp16TFLOPS: 28.4, isUnifiedMemory: true },
  { id: "apple-m3-ultra", name: "Apple M3 Ultra", vendor: "apple", vramGB: 512, bandwidthGBs: 819, fp16TFLOPS: 52, isUnifiedMemory: true },
  { id: "apple-m4", name: "Apple M4", vendor: "apple", vramGB: 32, bandwidthGBs: 120, fp16TFLOPS: 4.6, isUnifiedMemory: true },
  { id: "apple-m4-pro", name: "Apple M4 Pro", vendor: "apple", vramGB: 64, bandwidthGBs: 273, fp16TFLOPS: 9.2, isUnifiedMemory: true },
  { id: "apple-m4-max", name: "Apple M4 Max", vendor: "apple", vramGB: 128, bandwidthGBs: 546, fp16TFLOPS: 18.4, isUnifiedMemory: true },

  // --- Custom ---
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

export type CpuVendor = "intel" | "amd" | "apple";
export type CpuSegment = "desktop" | "hedt" | "server" | "apple";

export interface CpuSpec {
  id: string;
  name: string;
  vendor: CpuVendor;
  segment: CpuSegment;
  /** Approximate real-world FP32 throughput in GFLOPS, used for CPU-bound prefill. */
  computeGFLOPS: number;
}

export const CPUS: CpuSpec[] = [
  // --- Budget / entry ---
  { id: "budget-quadcore", name: "Budget Quad-Core (e.g. i3 / Ryzen 3)", vendor: "intel", segment: "desktop", computeGFLOPS: 120 },
  { id: "i3-14100", name: "Intel Core i3-14100", vendor: "intel", segment: "desktop", computeGFLOPS: 135 },

  // --- Intel Core desktop (12th-14th gen) ---
  { id: "i5-13600k", name: "Intel Core i5-13600K", vendor: "intel", segment: "desktop", computeGFLOPS: 420 },
  { id: "i5-14600k", name: "Intel Core i5-14600K", vendor: "intel", segment: "desktop", computeGFLOPS: 440 },
  { id: "i7-14700k", name: "Intel Core i7-14700K", vendor: "intel", segment: "desktop", computeGFLOPS: 560 },
  { id: "i9-13900k", name: "Intel Core i9-13900K", vendor: "intel", segment: "desktop", computeGFLOPS: 600 },
  { id: "i9-14900k", name: "Intel Core i9-14900K", vendor: "intel", segment: "desktop", computeGFLOPS: 620 },

  // --- Intel Core Ultra (Arrow Lake-S) ---
  { id: "ultra5-245k", name: "Intel Core Ultra 5 245K", vendor: "intel", segment: "desktop", computeGFLOPS: 430 },
  { id: "ultra7-265k", name: "Intel Core Ultra 7 265K", vendor: "intel", segment: "desktop", computeGFLOPS: 580 },
  { id: "ultra9-285k", name: "Intel Core Ultra 9 285K", vendor: "intel", segment: "desktop", computeGFLOPS: 650 },

  // --- AMD Ryzen desktop (Zen 3 / Zen 4 / Zen 5) ---
  { id: "ryzen5-5600", name: "AMD Ryzen 5 5600", vendor: "amd", segment: "desktop", computeGFLOPS: 260 },
  { id: "ryzen7-5800x3d", name: "AMD Ryzen 7 5800X3D", vendor: "amd", segment: "desktop", computeGFLOPS: 340 },
  { id: "ryzen5-7600x", name: "AMD Ryzen 5 7600X", vendor: "amd", segment: "desktop", computeGFLOPS: 330 },
  { id: "ryzen7-7700x", name: "AMD Ryzen 7 7700X", vendor: "amd", segment: "desktop", computeGFLOPS: 430 },
  { id: "ryzen-7800x3d", name: "AMD Ryzen 7 7800X3D", vendor: "amd", segment: "desktop", computeGFLOPS: 480 },
  { id: "ryzen9-7900x", name: "AMD Ryzen 9 7900X", vendor: "amd", segment: "desktop", computeGFLOPS: 640 },
  { id: "ryzen9-7950x3d", name: "AMD Ryzen 9 7950X3D", vendor: "amd", segment: "desktop", computeGFLOPS: 740 },
  { id: "ryzen-9950x", name: "AMD Ryzen 9 9950X", vendor: "amd", segment: "desktop", computeGFLOPS: 720 },
  { id: "ryzen9-9900x", name: "AMD Ryzen 9 9900X", vendor: "amd", segment: "desktop", computeGFLOPS: 680 },
  { id: "ryzen9-9950x3d", name: "AMD Ryzen 9 9950X3D", vendor: "amd", segment: "desktop", computeGFLOPS: 780 },

  // --- HEDT / workstation ---
  { id: "threadripper-7960x", name: "AMD Threadripper 7960X", vendor: "amd", segment: "hedt", computeGFLOPS: 1050 },
  { id: "threadripper-7970x", name: "AMD Threadripper 7970X", vendor: "amd", segment: "hedt", computeGFLOPS: 1400 },
  { id: "threadripper-7980x", name: "AMD Threadripper 7980X", vendor: "amd", segment: "hedt", computeGFLOPS: 2800 },
  { id: "threadripper-pro-7995wx", name: "AMD Threadripper PRO 7995WX", vendor: "amd", segment: "hedt", computeGFLOPS: 4200 },
  { id: "xeon-w9-3495x", name: "Intel Xeon w9-3495X", vendor: "intel", segment: "hedt", computeGFLOPS: 2600 },

  // --- Server ---
  { id: "epyc-9654", name: "AMD EPYC 9654 (Genoa, 96C)", vendor: "amd", segment: "server", computeGFLOPS: 4300 },
  { id: "epyc-9754", name: "AMD EPYC 9754 (Bergamo, 128C)", vendor: "amd", segment: "server", computeGFLOPS: 5000 },
  { id: "xeon-platinum-8592", name: "Intel Xeon Platinum 8592+ (64C)", vendor: "intel", segment: "server", computeGFLOPS: 2900 },

  // --- Apple Silicon CPU cores ---
  { id: "apple-m1-cpu", name: "Apple M1 CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 200 },
  { id: "apple-m1-pro-cpu", name: "Apple M1 Pro/Max CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 340 },
  { id: "apple-m1-ultra-cpu", name: "Apple M1 Ultra CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 680 },
  { id: "apple-m2-cpu", name: "Apple M2 CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 230 },
  { id: "apple-m2-pro-cpu", name: "Apple M2 Pro/Max CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 420 },
  { id: "apple-m2-ultra-cpu", name: "Apple M2 Ultra CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 820 },
  { id: "apple-m3-cpu", name: "Apple M3 CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 260 },
  { id: "apple-m3-pro-cpu", name: "Apple M3 Pro CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 440 },
  { id: "apple-m3-max-cpu", name: "Apple M3 Max CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 600 },
  { id: "apple-m3-ultra-cpu", name: "Apple M3 Ultra CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 1150 },
  { id: "apple-m4-cpu", name: "Apple M4 CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 320 },
  { id: "apple-m4-pro-cpu", name: "Apple M4 Pro CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 520 },
  { id: "apple-m4-max-cpu", name: "Apple M4 Max CPU cores", vendor: "apple", segment: "apple", computeGFLOPS: 650 },
];

export type RamChannelLayout = "dual" | "quad" | "octa" | "unified";

export interface RamSpec {
  id: string;
  name: string;
  type: "DDR4" | "DDR5" | "Unified";
  layout: RamChannelLayout;
  speedMHz: number;
  bandwidthGBs: number;
}

export const RAM_OPTIONS: RamSpec[] = [
  // --- DDR4 ---
  { id: "ddr4-2666-dual", name: "DDR4-2666 Dual-Channel", type: "DDR4", layout: "dual", speedMHz: 2666, bandwidthGBs: 41.6 },
  { id: "ddr4-3000-dual", name: "DDR4-3000 Dual-Channel", type: "DDR4", layout: "dual", speedMHz: 3000, bandwidthGBs: 48 },
  { id: "ddr4-3200-dual", name: "DDR4-3200 Dual-Channel", type: "DDR4", layout: "dual", speedMHz: 3200, bandwidthGBs: 50 },
  { id: "ddr4-3600-dual", name: "DDR4-3600 Dual-Channel", type: "DDR4", layout: "dual", speedMHz: 3600, bandwidthGBs: 57.6 },
  { id: "ddr4-3200-quad", name: "DDR4-3200 Quad-Channel (HEDT/Xeon-W)", type: "DDR4", layout: "quad", speedMHz: 3200, bandwidthGBs: 100 },

  // --- DDR5 ---
  { id: "ddr5-4800-dual", name: "DDR5-4800 Dual-Channel", type: "DDR5", layout: "dual", speedMHz: 4800, bandwidthGBs: 76.8 },
  { id: "ddr5-5200-dual", name: "DDR5-5200 Dual-Channel", type: "DDR5", layout: "dual", speedMHz: 5200, bandwidthGBs: 83.2 },
  { id: "ddr5-5600-dual", name: "DDR5-5600 Dual-Channel", type: "DDR5", layout: "dual", speedMHz: 5600, bandwidthGBs: 89.6 },
  { id: "ddr5-6000-dual", name: "DDR5-6000 Dual-Channel", type: "DDR5", layout: "dual", speedMHz: 6000, bandwidthGBs: 96 },
  { id: "ddr5-6400-dual", name: "DDR5-6400 Dual-Channel", type: "DDR5", layout: "dual", speedMHz: 6400, bandwidthGBs: 102.4 },
  { id: "ddr5-7200-dual", name: "DDR5-7200 Dual-Channel", type: "DDR5", layout: "dual", speedMHz: 7200, bandwidthGBs: 115.2 },
  { id: "ddr5-8000-dual", name: "DDR5-8000 Dual-Channel", type: "DDR5", layout: "dual", speedMHz: 8000, bandwidthGBs: 128 },
  { id: "ddr5-6000-quad", name: "DDR5-6000 Quad-Channel (Threadripper)", type: "DDR5", layout: "quad", speedMHz: 6000, bandwidthGBs: 192 },
  { id: "ddr5-4800-octa", name: "DDR5-4800 12-Channel (EPYC/Xeon Server)", type: "DDR5", layout: "octa", speedMHz: 4800, bandwidthGBs: 460 },

  // --- Apple unified memory, by chip class ---
  { id: "unified-68", name: "Unified Memory — M1 class (~68 GB/s)", type: "Unified", layout: "unified", speedMHz: 0, bandwidthGBs: 68.25 },
  { id: "unified-100", name: "Unified Memory — M2/M3 class (~100 GB/s)", type: "Unified", layout: "unified", speedMHz: 0, bandwidthGBs: 100 },
  { id: "unified-120", name: "Unified Memory — M4 class (~120 GB/s)", type: "Unified", layout: "unified", speedMHz: 0, bandwidthGBs: 120 },
  { id: "unified-150", name: "Unified Memory — M3 Pro class (~150 GB/s)", type: "Unified", layout: "unified", speedMHz: 0, bandwidthGBs: 150 },
  { id: "unified-200", name: "Unified Memory — M1/M2 Pro class (~200 GB/s)", type: "Unified", layout: "unified", speedMHz: 0, bandwidthGBs: 200 },
  { id: "unified-273", name: "Unified Memory — M4 Pro class (~273 GB/s)", type: "Unified", layout: "unified", speedMHz: 0, bandwidthGBs: 273 },
  { id: "unified-400", name: "Unified Memory — Max class (~400 GB/s)", type: "Unified", layout: "unified", speedMHz: 0, bandwidthGBs: 400 },
  { id: "unified-546", name: "Unified Memory — M4 Max class (~546 GB/s)", type: "Unified", layout: "unified", speedMHz: 0, bandwidthGBs: 546 },
  { id: "unified-800", name: "Unified Memory — M1/M2 Ultra class (~800 GB/s)", type: "Unified", layout: "unified", speedMHz: 0, bandwidthGBs: 800 },
  { id: "unified-819", name: "Unified Memory — M3 Ultra class (~819 GB/s)", type: "Unified", layout: "unified", speedMHz: 0, bandwidthGBs: 819 },
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

export const RAM_CAPACITY_OPTIONS_GB = [8, 16, 32, 64, 96, 128, 192, 256, 384, 512, 768];
