export type ModelCategory = "flagship" | "large" | "medium" | "small";

export interface ModelSpec {
  id: string;
  name: string;
  family: string;
  paramsB: number;
  category: ModelCategory;
  description: string;
}

export const MODELS: ModelSpec[] = [
  {
    id: "deepseek-r1-405b",
    name: "DeepSeek-R1 / Llama 3.1 405B",
    family: "DeepSeek / Llama",
    paramsB: 405,
    category: "flagship",
    description: "Frontier-scale reasoning model. Requires multi-GPU or heavy offload.",
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    family: "Llama",
    paramsB: 70,
    category: "large",
    description: "High quality general-purpose model, needs a 24GB+ GPU or offload.",
  },
  {
    id: "qwen-2.5-72b",
    name: "Qwen 2.5 72B",
    family: "Qwen",
    paramsB: 72,
    category: "large",
    description: "Strong multilingual + coding performance at 70B-class size.",
  },
  {
    id: "deepseek-r1-distill-llama-8b",
    name: "DeepSeek-R1-Distill-Llama 8B",
    family: "DeepSeek",
    paramsB: 8,
    category: "small",
    description: "Distilled reasoning model, fits comfortably on consumer GPUs.",
  },
  {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B",
    family: "Llama",
    paramsB: 8,
    category: "small",
    description: "Fast, well-rounded small model, ideal for 8-16GB VRAM.",
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B",
    family: "Mistral",
    paramsB: 7,
    category: "small",
    description: "Efficient dense model, a long-time local-inference favorite.",
  },
  {
    id: "phi-4",
    name: "Phi-4",
    family: "Microsoft Phi",
    paramsB: 14,
    category: "medium",
    description: "Compact reasoning-focused model punching above its size class.",
  },
];

export interface QuantizationSpec {
  id: string;
  name: string;
  bitsPerWeight: number;
  description: string;
}

export const QUANTIZATIONS: QuantizationSpec[] = [
  { id: "fp16", name: "FP16", bitsPerWeight: 16.0, description: "Full 16-bit precision, largest size, highest fidelity." },
  { id: "q8_0", name: "Q8_0", bitsPerWeight: 8.5, description: "Near-lossless 8-bit quantization." },
  { id: "q5_k_m", name: "Q5_K_M", bitsPerWeight: 5.5, description: "Balanced 5-bit quant, minor quality loss." },
  { id: "q4_k_m", name: "Q4_K_M", bitsPerWeight: 4.5, description: "The standard 4-bit quant — best size/quality tradeoff." },
  { id: "iq3_xs", name: "IQ3_XS", bitsPerWeight: 3.0, description: "Aggressive 3-bit quant for tight VRAM budgets." },
  { id: "q2_k", name: "Q2_K", bitsPerWeight: 2.5, description: "Extreme 2-bit compression, noticeable quality loss." },
];

export interface SamplePrompt {
  id: string;
  label: string;
  promptText: string;
  /** Approximate prompt token count fed into the prefill phase. */
  promptTokens: number;
  /** Default number of output tokens to stream/generate. */
  outputTokenTarget: number;
}

export const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: "python-script",
    label: "Write a Python script",
    promptText:
      "Write a Python script that scrapes a webpage, extracts all links, and saves them to a CSV file. Include error handling and docstrings.",
    promptTokens: 400,
    outputTokenTarget: 512,
  },
  {
    id: "summarize-doc",
    label: "Summarize a 10-page document",
    promptText:
      "Summarize the following 10-page technical document into a concise executive summary highlighting key findings, risks, and recommendations...",
    promptTokens: 6500,
    outputTokenTarget: 400,
  },
  {
    id: "creative-writing",
    label: "Creative writing (short story)",
    promptText:
      "Write a short science fiction story about a deep-space mining crew that discovers something that shouldn't exist.",
    promptTokens: 150,
    outputTokenTarget: 900,
  },
  {
    id: "long-context-chat",
    label: "Long-context chat (128k stress test)",
    promptText:
      "Given the entire codebase and conversation history provided, explain the architecture and propose a refactor plan.",
    promptTokens: 32000,
    outputTokenTarget: 600,
  },
  {
    id: "quick-qa",
    label: "Quick factual Q&A",
    promptText: "What is the capital of Australia and what is its approximate population?",
    promptTokens: 40,
    outputTokenTarget: 60,
  },
];
