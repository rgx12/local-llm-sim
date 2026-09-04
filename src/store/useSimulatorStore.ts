import { create } from "zustand";
import {
  CPUS,
  GPUS,
  PCIE_OPTIONS,
  RAM_OPTIONS,
  type GpuSpec,
  type PcieGen,
} from "@/data/hardware";
import { MODELS, QUANTIZATIONS, SAMPLE_PROMPTS } from "@/data/models";

interface CustomGpuOverrides {
  vramGB: number;
  bandwidthGBs: number;
  fp16TFLOPS: number;
}

interface SimulatorState {
  gpuId: string;
  customGpu: CustomGpuOverrides;
  dualGpuEnabled: boolean;
  secondGpuId: string;
  cpuId: string;
  ramId: string;
  ramCapacityGB: number;
  pcieGen: PcieGen;

  modelId: string;
  quantId: string;
  contextLengthTokens: number;
  samplePromptId: string;
  outputTokens: number;

  setGpuId: (id: string) => void;
  setCustomGpu: (overrides: Partial<CustomGpuOverrides>) => void;
  setDualGpuEnabled: (enabled: boolean) => void;
  setSecondGpuId: (id: string) => void;
  setCpuId: (id: string) => void;
  setRamId: (id: string) => void;
  setRamCapacityGB: (gb: number) => void;
  setPcieGen: (gen: PcieGen) => void;

  setModelId: (id: string) => void;
  setQuantId: (id: string) => void;
  setContextLengthTokens: (tokens: number) => void;
  setSamplePromptId: (id: string) => void;
  setOutputTokens: (tokens: number) => void;

  getEffectiveGpu: () => GpuSpec;
}

export const useSimulatorStore = create<SimulatorState>((set, get) => ({
  gpuId: "rtx-4090",
  customGpu: { vramGB: 16, bandwidthGBs: 500, fp16TFLOPS: 30 },
  dualGpuEnabled: false,
  secondGpuId: "rtx-4090",
  cpuId: "ryzen-7800x3d",
  ramId: "ddr5-6000-dual",
  ramCapacityGB: 32,
  pcieGen: "4.0",

  modelId: "llama-3.1-8b",
  quantId: "q4_k_m",
  contextLengthTokens: 8192,
  samplePromptId: "python-script",
  outputTokens: SAMPLE_PROMPTS[0].outputTokenTarget,

  setGpuId: (id) => set({ gpuId: id }),
  setCustomGpu: (overrides) => set((s) => ({ customGpu: { ...s.customGpu, ...overrides } })),
  setDualGpuEnabled: (enabled) => set({ dualGpuEnabled: enabled }),
  setSecondGpuId: (id) => set({ secondGpuId: id }),
  setCpuId: (id) => set({ cpuId: id }),
  setRamId: (id) => set({ ramId: id }),
  setRamCapacityGB: (gb) => set({ ramCapacityGB: gb }),
  setPcieGen: (gen) => set({ pcieGen: gen }),

  setModelId: (id) => set({ modelId: id }),
  setQuantId: (id) => set({ quantId: id }),
  setContextLengthTokens: (tokens) => set({ contextLengthTokens: tokens }),
  setSamplePromptId: (id) => {
    const prompt = SAMPLE_PROMPTS.find((p) => p.id === id);
    set({ samplePromptId: id, outputTokens: prompt?.outputTokenTarget ?? get().outputTokens });
  },
  setOutputTokens: (tokens) => set({ outputTokens: tokens }),

  getEffectiveGpu: () => {
    const state = get();
    const base = GPUS.find((g) => g.id === state.gpuId) ?? GPUS[0];
    if (base.isCustom) {
      return { ...base, ...state.customGpu };
    }
    return base;
  },
}));

export function useResolvedConfig() {
  const state = useSimulatorStore();
  const gpu = state.getEffectiveGpu();
  const secondGpu = state.dualGpuEnabled
    ? GPUS.find((g) => g.id === state.secondGpuId) ?? null
    : null;
  const cpu = CPUS.find((c) => c.id === state.cpuId) ?? CPUS[0];
  const ram = RAM_OPTIONS.find((r) => r.id === state.ramId) ?? RAM_OPTIONS[0];
  const pcie = PCIE_OPTIONS.find((p) => p.gen === state.pcieGen) ?? PCIE_OPTIONS[1];
  const model = MODELS.find((m) => m.id === state.modelId) ?? MODELS[0];
  const quant = QUANTIZATIONS.find((q) => q.id === state.quantId) ?? QUANTIZATIONS[0];
  const samplePrompt = SAMPLE_PROMPTS.find((p) => p.id === state.samplePromptId) ?? SAMPLE_PROMPTS[0];

  return { gpu, secondGpu, cpu, ram, pcie, model, quant, samplePrompt };
}
