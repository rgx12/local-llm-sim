export interface HfSearchResult {
  id: string;
  likes: number;
  downloads: number;
}

export interface HfQuantFile {
  /** Quant label parsed from the GGUF filename, e.g. "Q4_K_M". */
  quant: string;
  sizeGB: number;
  /** Derived from actual file size / total param count — not a lookup table. */
  bitsPerWeight: number;
  /** >1 when the quant is split across multiple shard files (sizes are summed). */
  fileCount: number;
}

export interface HfModelDetail {
  repoId: string;
  architecture: string | null;
  contextLength: number | null;
  paramsB: number;
  quantFiles: HfQuantFile[];
}

/** Known llama.cpp/GGUF quantization tokens, longest-first so e.g. Q4_K_M beats Q4. */
const KNOWN_QUANT_TOKENS = [
  "Q4_0_4_4",
  "Q4_0_4_8",
  "Q4_0_8_8",
  "IQ2_XXS",
  "IQ2_XS",
  "IQ2_S",
  "IQ2_M",
  "IQ3_XXS",
  "IQ3_XS",
  "IQ3_S",
  "IQ3_M",
  "IQ4_XS",
  "IQ4_NL",
  "IQ1_S",
  "IQ1_M",
  "Q2_K_L",
  "Q2_K_S",
  "Q2_K",
  "Q3_K_XL",
  "Q3_K_L",
  "Q3_K_M",
  "Q3_K_S",
  "Q3_K",
  "Q4_K_L",
  "Q4_K_M",
  "Q4_K_S",
  "Q4_K",
  "Q5_K_L",
  "Q5_K_M",
  "Q5_K_S",
  "Q5_K",
  "Q6_K_L",
  "Q6_K",
  "Q8_0",
  "Q5_0",
  "Q5_1",
  "Q4_0",
  "Q4_1",
  "BF16",
  "FP16",
  "F16",
  "FP32",
  "F32",
].sort((a, b) => b.length - a.length);

/** Pulls a known quant token out of a GGUF filename, e.g. "Model-Q4_K_M.gguf" -> "Q4_K_M". */
export function extractQuantLabel(filename: string): string | null {
  const upper = filename.toUpperCase();
  for (const token of KNOWN_QUANT_TOKENS) {
    if (upper.includes(token)) return token;
  }
  return null;
}

export const HF_REPO_ID_PATTERN = /^[\w.-]+\/[\w.-]+$/;
