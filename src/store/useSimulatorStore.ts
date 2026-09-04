import { create } from "zustand";
import {
  CPUS,
  GPUS,
  PCIE_OPTIONS,
  RAM_OPTIONS,
  type GpuSpec,
  type PcieGen,
} from "@/data/hardware";
import { MODELS, QUANTIZATIONS, SAMPLE_PROMPTS, type ModelCategory, type ModelSpec, type QuantizationSpec } from "@/data/models";
import type { HfModelDetail, HfQuantFile } from "@/lib/huggingface";

interface CustomGpuOverrides {
  vramGB: number;
  bandwidthGBs: number;
  fp16TFLOPS: number;
}

export type ModelSource = "curated" | "huggingface";

export interface HfSelection {
  repoId: string;
  architecture: string | null;
  contextLength: number | null;
  paramsB: number;
  quant: HfQuantFile;
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

  modelSource: ModelSource;
  modelId: string;
  quantId: string;
  hfSelection: HfSelection | null;
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

  setModelSource: (source: ModelSource) => void;
  setModelId: (id: string) => void;
  setQuantId: (id: string) => void;
  setHfQuant: (detail: HfModelDetail, quant: HfQuantFile) => void;
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

  modelSource: "curated",
  modelId: "llama-3.1-8b",
  quantId: "q4_k_m",
  hfSelection: null,
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

  setModelSource: (source) => set({ modelSource: source }),
  setModelId: (id) => set({ modelId: id, modelSource: "curated" }),
  setQuantId: (id) => set({ quantId: id, modelSource: "curated" }),
  setHfQuant: (detail, quant) =>
    set({
      modelSource: "huggingface",
      hfSelection: {
        repoId: detail.repoId,
        architecture: detail.architecture,
        contextLength: detail.contextLength,
        paramsB: detail.paramsB,
        quant,
      },
    }),
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

function categorizeParams(paramsB: number): ModelCategory {
  if (paramsB >= 150) return "flagship";
  if (paramsB >= 40) return "large";
  if (paramsB >= 15) return "medium";
  return "small";
}

function repoDisplayName(repoId: string): string {
  return repoId.split("/")[1] ?? repoId;
}

function buildHfModelSpec(sel: HfSelection): ModelSpec {
  return {
    id: `hf:${sel.repoId}`,
    name: repoDisplayName(sel.repoId),
    family: "Hugging Face",
    paramsB: sel.paramsB,
    category: categorizeParams(sel.paramsB),
    description: `Fetched live from huggingface.co/${sel.repoId}${sel.architecture ? ` — ${sel.architecture} architecture` : ""}.`,
  };
}

function buildHfQuantSpec(sel: HfSelection): QuantizationSpec {
  return {
    id: sel.quant.quant,
    name: sel.quant.quant,
    bitsPerWeight: sel.quant.bitsPerWeight,
    description: `${sel.quant.sizeGB.toFixed(2)} GB actual GGUF file size on Hugging Face${sel.quant.fileCount > 1 ? ` (${sel.quant.fileCount} shards)` : ""}.`,
  };
}

export function useResolvedConfig() {
  const state = useSimulatorStore();
  const gpu = state.getEffectiveGpu();
  const secondGpu = state.dualGpuEnabled
    ? GPUS.find((g) => g.id === state.secondGpuId) ?? null
    : null;
  const cpu = CPUS.find((c) => c.id === state.cpuId) ?? CPUS[0];
  const ram = RAM_OPTIONS.find((r) => r.id === state.ramId) ?? RAM_OPTIONS[0];
  const pcie = PCIE_OPTIONS.find((p) => p.gen === state.pcieGen) ?? PCIE_OPTIONS[1];

  const useHf = state.modelSource === "huggingface" && state.hfSelection !== null;
  const model = useHf ? buildHfModelSpec(state.hfSelection!) : MODELS.find((m) => m.id === state.modelId) ?? MODELS[0];
  const quant = useHf ? buildHfQuantSpec(state.hfSelection!) : QUANTIZATIONS.find((q) => q.id === state.quantId) ?? QUANTIZATIONS[0];

  const samplePrompt = SAMPLE_PROMPTS.find((p) => p.id === state.samplePromptId) ?? SAMPLE_PROMPTS[0];

  return { gpu, secondGpu, cpu, ram, pcie, model, quant, samplePrompt };
}
