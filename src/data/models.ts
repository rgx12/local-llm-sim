export type ModelCategory = "flagship" | "large" | "medium" | "small";

export interface ModelSpec {
  id: string;
  name: string;
  family: string;
  /** Total weight parameters in billions — what actually has to fit in memory. */
  paramsB: number;
  /** For MoE models: parameters activated per token (informational; sizing uses paramsB). */
  activeParamsB?: number;
  isMoE?: boolean;
  category: ModelCategory;
  description: string;
}

export const MODELS: ModelSpec[] = [
  // --- Meta Llama ---
  { id: "llama-2-7b", name: "Llama 2 7B", family: "Llama", paramsB: 7, category: "small", description: "Meta's first widely-adopted open chat model." },
  { id: "llama-2-13b", name: "Llama 2 13B", family: "Llama", paramsB: 13, category: "small", description: "Mid-size Llama 2, a common 16GB-VRAM target." },
  { id: "llama-2-70b", name: "Llama 2 70B", family: "Llama", paramsB: 70, category: "large", description: "The original 70B-class open weights release." },
  { id: "llama-3-8b", name: "Llama 3 8B", family: "Llama", paramsB: 8, category: "small", description: "Big quality jump over Llama 2 at the same size." },
  { id: "llama-3-70b", name: "Llama 3 70B", family: "Llama", paramsB: 70, category: "large", description: "Flagship dense model of the Llama 3 launch." },
  { id: "llama-3.1-8b", name: "Llama 3.1 8B", family: "Llama", paramsB: 8, category: "small", description: "Fast, well-rounded small model, ideal for 8-16GB VRAM." },
  { id: "llama-3.1-70b", name: "Llama 3.1 70B", family: "Llama", paramsB: 70, category: "large", description: "128k-context 70B, needs 24GB+ or offload." },
  { id: "llama-3.1-405b", name: "Llama 3.1 405B", family: "Llama", paramsB: 405, category: "flagship", description: "Meta's largest dense open-weight release. Multi-GPU or heavy offload territory." },
  { id: "llama-3.2-1b", name: "Llama 3.2 1B", family: "Llama", paramsB: 1, category: "small", description: "Edge/mobile-class model, runs on almost anything." },
  { id: "llama-3.2-3b", name: "Llama 3.2 3B", family: "Llama", paramsB: 3, category: "small", description: "Small on-device model with solid instruction following." },
  { id: "llama-3.2-11b-vision", name: "Llama 3.2 11B Vision", family: "Llama", paramsB: 11, category: "small", description: "Multimodal (image+text) 11B model." },
  { id: "llama-3.2-90b-vision", name: "Llama 3.2 90B Vision", family: "Llama", paramsB: 90, category: "large", description: "Multimodal flagship, image+text at 70B-class weight." },
  { id: "llama-3.3-70b", name: "Llama 3.3 70B", family: "Llama", paramsB: 70, category: "large", description: "High quality general-purpose model, needs a 24GB+ GPU or offload." },
  { id: "llama-4-scout", name: "Llama 4 Scout (109B MoE)", family: "Llama", paramsB: 109, activeParamsB: 17, isMoE: true, category: "large", description: "109B total / 17B active MoE — full weights must still be resident to serve." },
  { id: "llama-4-maverick", name: "Llama 4 Maverick (400B MoE)", family: "Llama", paramsB: 400, activeParamsB: 17, isMoE: true, category: "flagship", description: "400B total / 17B active MoE flagship — massive VRAM+RAM footprint despite light per-token compute." },

  // --- Mistral AI ---
  { id: "mistral-7b", name: "Mistral 7B", family: "Mistral", paramsB: 7, category: "small", description: "Efficient dense model, a long-time local-inference favorite." },
  { id: "mixtral-8x7b", name: "Mixtral 8x7B (MoE)", family: "Mistral", paramsB: 46.7, activeParamsB: 12.9, isMoE: true, category: "large", description: "8-expert MoE; 46.7B total weights, 12.9B active per token." },
  { id: "mixtral-8x22b", name: "Mixtral 8x22B (MoE)", family: "Mistral", paramsB: 141, activeParamsB: 39, isMoE: true, category: "large", description: "141B total / 39B active MoE, strong reasoning and code." },
  { id: "mistral-nemo-12b", name: "Mistral NeMo 12B", family: "Mistral", paramsB: 12, category: "small", description: "128k-context 12B built with NVIDIA." },
  { id: "mistral-small-3.1-24b", name: "Mistral Small 3.1 24B", family: "Mistral", paramsB: 24, category: "medium", description: "Latency-optimized 24B, competitive with much larger models." },
  { id: "mistral-large-2-123b", name: "Mistral Large 2 123B", family: "Mistral", paramsB: 123, category: "large", description: "Mistral's dense flagship, GPT-4-class benchmarks." },
  { id: "codestral-22b", name: "Codestral 22B", family: "Mistral", paramsB: 22, category: "medium", description: "Code-specialist model covering 80+ languages." },
  { id: "ministral-8b", name: "Ministral 8B", family: "Mistral", paramsB: 8, category: "small", description: "Edge-optimized 8B with a large context window." },
  { id: "ministral-3b", name: "Ministral 3B", family: "Mistral", paramsB: 3, category: "small", description: "Sub-4B edge model for on-device deployment." },

  // --- Alibaba Qwen ---
  { id: "qwen2.5-0.5b", name: "Qwen 2.5 0.5B", family: "Qwen", paramsB: 0.5, category: "small", description: "Tiny model for constrained devices or speculative decoding." },
  { id: "qwen2.5-1.5b", name: "Qwen 2.5 1.5B", family: "Qwen", paramsB: 1.5, category: "small", description: "Compact general-purpose model." },
  { id: "qwen2.5-3b", name: "Qwen 2.5 3B", family: "Qwen", paramsB: 3, category: "small", description: "Balanced small model for laptops and mini-PCs." },
  { id: "qwen2.5-7b", name: "Qwen 2.5 7B", family: "Qwen", paramsB: 7, category: "small", description: "Popular 7B-class daily-driver model." },
  { id: "qwen2.5-14b", name: "Qwen 2.5 14B", family: "Qwen", paramsB: 14, category: "small", description: "Strong mid-size model, comfortable on 16GB VRAM at Q4." },
  { id: "qwen2.5-32b", name: "Qwen 2.5 32B", family: "Qwen", paramsB: 32, category: "medium", description: "High quality 32B, a favorite for 24GB-VRAM builds." },
  { id: "qwen-2.5-72b", name: "Qwen 2.5 72B", family: "Qwen", paramsB: 72, category: "large", description: "Strong multilingual + coding performance at 70B-class size." },
  { id: "qwen2.5-coder-32b", name: "Qwen 2.5 Coder 32B", family: "Qwen", paramsB: 32, category: "medium", description: "Code-specialist variant, near GPT-4-class on coding benchmarks." },
  { id: "qwen3-0.6b", name: "Qwen 3 0.6B", family: "Qwen", paramsB: 0.6, category: "small", description: "Latest-gen ultra-compact model." },
  { id: "qwen3-4b", name: "Qwen 3 4B", family: "Qwen", paramsB: 4, category: "small", description: "Small Qwen 3 with hybrid think/no-think modes." },
  { id: "qwen3-8b", name: "Qwen 3 8B", family: "Qwen", paramsB: 8, category: "small", description: "Qwen 3 generation 8B daily-driver." },
  { id: "qwen3-14b", name: "Qwen 3 14B", family: "Qwen", paramsB: 14, category: "small", description: "Qwen 3 mid-size, strong reasoning-mode toggle." },
  { id: "qwen3-32b", name: "Qwen 3 32B", family: "Qwen", paramsB: 32, category: "medium", description: "Qwen 3 dense flagship at the 32B tier." },
  { id: "qwen3-30b-a3b", name: "Qwen 3 30B-A3B (MoE)", family: "Qwen", paramsB: 30, activeParamsB: 3, isMoE: true, category: "medium", description: "30B total / 3B active MoE — cheap compute, still needs full weights resident." },
  { id: "qwen3-235b-a22b", name: "Qwen 3 235B-A22B (MoE)", family: "Qwen", paramsB: 235, activeParamsB: 22, isMoE: true, category: "flagship", description: "235B total / 22B active MoE flagship reasoning model." },
  { id: "qwq-32b", name: "QwQ 32B", family: "Qwen", paramsB: 32, category: "medium", description: "Dedicated reasoning model, long chain-of-thought outputs." },

  // --- DeepSeek ---
  { id: "deepseek-v2-236b", name: "DeepSeek V2 236B (MoE)", family: "DeepSeek", paramsB: 236, activeParamsB: 21, isMoE: true, category: "flagship", description: "236B total / 21B active MoE, DeepSeek's second-gen flagship." },
  { id: "deepseek-v3-671b", name: "DeepSeek V3 671B (MoE)", family: "DeepSeek", paramsB: 671, activeParamsB: 37, isMoE: true, category: "flagship", description: "671B total / 37B active MoE — frontier-scale, needs serious multi-GPU or heavy offload." },
  { id: "deepseek-r1-671b", name: "DeepSeek R1 671B (MoE)", family: "DeepSeek", paramsB: 671, activeParamsB: 37, isMoE: true, category: "flagship", description: "671B total / 37B active reasoning MoE, matches o1-class benchmarks." },
  { id: "deepseek-r1-distill-qwen-1.5b", name: "DeepSeek-R1-Distill-Qwen 1.5B", family: "DeepSeek", paramsB: 1.5, category: "small", description: "Smallest R1 reasoning distill, runs almost anywhere." },
  { id: "deepseek-r1-distill-qwen-7b", name: "DeepSeek-R1-Distill-Qwen 7B", family: "DeepSeek", paramsB: 7, category: "small", description: "R1 reasoning distilled onto a Qwen 7B base." },
  { id: "deepseek-r1-distill-qwen-14b", name: "DeepSeek-R1-Distill-Qwen 14B", family: "DeepSeek", paramsB: 14, category: "small", description: "Mid-size R1 distill with strong reasoning traces." },
  { id: "deepseek-r1-distill-qwen-32b", name: "DeepSeek-R1-Distill-Qwen 32B", family: "DeepSeek", paramsB: 32, category: "medium", description: "Largest Qwen-based R1 distill, near-R1 reasoning quality." },
  { id: "deepseek-r1-distill-llama-8b", name: "DeepSeek-R1-Distill-Llama 8B", family: "DeepSeek", paramsB: 8, category: "small", description: "Distilled reasoning model, fits comfortably on consumer GPUs." },
  { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek-R1-Distill-Llama 70B", family: "DeepSeek", paramsB: 70, category: "large", description: "Largest R1 distill, Llama-70B-based reasoning model." },
  { id: "deepseek-coder-v2-236b", name: "DeepSeek Coder V2 236B (MoE)", family: "DeepSeek", paramsB: 236, activeParamsB: 21, isMoE: true, category: "flagship", description: "Code-specialist MoE, GPT-4-Turbo-class on coding benchmarks." },
  { id: "deepseek-coder-v2-lite-16b", name: "DeepSeek Coder V2 Lite 16B (MoE)", family: "DeepSeek", paramsB: 16, activeParamsB: 2.4, isMoE: true, category: "medium", description: "Compact code MoE, 16B total / 2.4B active." },

  // --- Google Gemma ---
  { id: "gemma-2b", name: "Gemma 2B", family: "Gemma", paramsB: 2, category: "small", description: "Google's first small open weights release." },
  { id: "gemma-7b", name: "Gemma 7B", family: "Gemma", paramsB: 7, category: "small", description: "Original Gemma 7B, built on Gemini research." },
  { id: "gemma-2-2b", name: "Gemma 2 2B", family: "Gemma", paramsB: 2, category: "small", description: "Distilled 2B, punches well above its size." },
  { id: "gemma-2-9b", name: "Gemma 2 9B", family: "Gemma", paramsB: 9, category: "small", description: "Popular 9B daily driver with strong benchmarks." },
  { id: "gemma-2-27b", name: "Gemma 2 27B", family: "Gemma", paramsB: 27, category: "medium", description: "Largest Gemma 2, competitive with 70B-class models." },
  { id: "gemma-3-1b", name: "Gemma 3 1B", family: "Gemma", paramsB: 1, category: "small", description: "Latest-gen ultra-light Gemma for edge devices." },
  { id: "gemma-3-4b", name: "Gemma 3 4B", family: "Gemma", paramsB: 4, category: "small", description: "Multimodal-capable small Gemma 3." },
  { id: "gemma-3-12b", name: "Gemma 3 12B", family: "Gemma", paramsB: 12, category: "small", description: "Mid-size Gemma 3 with 128k context." },
  { id: "gemma-3-27b", name: "Gemma 3 27B", family: "Gemma", paramsB: 27, category: "medium", description: "Gemma 3 flagship, single-GPU-friendly at Q4." },

  // --- Microsoft Phi ---
  { id: "phi-2", name: "Phi-2 2.7B", family: "Phi", paramsB: 2.7, category: "small", description: "Early small-model-punches-above-weight showcase." },
  { id: "phi-3-mini", name: "Phi-3 Mini 3.8B", family: "Phi", paramsB: 3.8, category: "small", description: "Phone-deployable model with surprising capability." },
  { id: "phi-3-small", name: "Phi-3 Small 7B", family: "Phi", paramsB: 7, category: "small", description: "Mid-tier Phi-3 with a 128k-context variant." },
  { id: "phi-3-medium", name: "Phi-3 Medium 14B", family: "Phi", paramsB: 14, category: "small", description: "Largest Phi-3, still comfortable on a single consumer GPU." },
  { id: "phi-3.5-mini", name: "Phi-3.5 Mini 3.8B", family: "Phi", paramsB: 3.8, category: "small", description: "Refreshed mini model with better multilingual support." },
  { id: "phi-3.5-moe", name: "Phi-3.5 MoE 41.9B", family: "Phi", paramsB: 41.9, activeParamsB: 6.6, isMoE: true, category: "large", description: "16-expert MoE, 41.9B total / 6.6B active." },
  { id: "phi-4", name: "Phi-4", family: "Phi", paramsB: 14, category: "small", description: "Compact reasoning-focused model punching above its size class." },
  { id: "phi-4-mini", name: "Phi-4 Mini 3.8B", family: "Phi", paramsB: 3.8, category: "small", description: "Small, function-calling-tuned Phi-4 variant." },

  // --- 01.AI Yi ---
  { id: "yi-1.5-6b", name: "Yi 1.5 6B", family: "Yi", paramsB: 6, category: "small", description: "Bilingual (EN/ZH) small model." },
  { id: "yi-1.5-9b", name: "Yi 1.5 9B", family: "Yi", paramsB: 9, category: "small", description: "Mid-size Yi with strong benchmark scores for its class." },
  { id: "yi-1.5-34b", name: "Yi 1.5 34B", family: "Yi", paramsB: 34, category: "medium", description: "Largest open Yi 1.5, competitive with 70B-class models." },

  // --- Cohere ---
  { id: "command-r-35b", name: "Command R 35B", family: "Cohere", paramsB: 35, category: "medium", description: "RAG- and tool-use-optimized 35B model." },
  { id: "command-r-plus-104b", name: "Command R+ 104B", family: "Cohere", paramsB: 104, category: "large", description: "Cohere's flagship, built for enterprise RAG workflows." },
  { id: "command-r7b", name: "Command R7B", family: "Cohere", paramsB: 7, category: "small", description: "Compact member of the Command R family." },
  { id: "aya-expanse-32b", name: "Aya Expanse 32B", family: "Cohere", paramsB: 32, category: "medium", description: "Multilingual model covering 23 languages." },

  // --- Databricks ---
  { id: "dbrx-132b", name: "DBRX 132B (MoE)", family: "Databricks", paramsB: 132, activeParamsB: 36, isMoE: true, category: "large", description: "Fine-grained 16-expert MoE, 132B total / 36B active." },

  // --- TII Falcon ---
  { id: "falcon-7b", name: "Falcon 7B", family: "Falcon", paramsB: 7, category: "small", description: "Early efficient open model from TII." },
  { id: "falcon-40b", name: "Falcon 40B", family: "Falcon", paramsB: 40, category: "large", description: "Was state-of-the-art open weights on release." },
  { id: "falcon-180b", name: "Falcon 180B", family: "Falcon", paramsB: 180, category: "flagship", description: "One of the largest dense open releases." },
  { id: "falcon3-10b", name: "Falcon 3 10B", family: "Falcon", paramsB: 10, category: "small", description: "Latest-gen Falcon, efficiency-focused 10B." },

  // --- Other notable open models ---
  { id: "starcoder2-15b", name: "StarCoder2 15B", family: "Other", paramsB: 15, category: "medium", description: "Code-generation model trained on The Stack v2." },
  { id: "codellama-34b", name: "Code Llama 34B", family: "Other", paramsB: 34, category: "medium", description: "Llama 2 fine-tuned for code across many languages." },
  { id: "codellama-70b", name: "Code Llama 70B", family: "Other", paramsB: 70, category: "large", description: "Largest Code Llama variant." },
  { id: "wizardlm2-8x22b", name: "WizardLM 2 8x22B (MoE)", family: "Other", paramsB: 141, activeParamsB: 39, isMoE: true, category: "large", description: "Mixtral-8x22B-based instruction-tuned MoE." },
  { id: "zephyr-7b-beta", name: "Zephyr 7B Beta", family: "Other", paramsB: 7, category: "small", description: "Mistral-based DPO-tuned chat model." },
  { id: "solar-10.7b", name: "Solar 10.7B", family: "Other", paramsB: 10.7, category: "small", description: "Depth-upscaled dense model from Upstage." },
  { id: "internlm2.5-20b", name: "InternLM2.5 20B", family: "Other", paramsB: 20, category: "medium", description: "Shanghai AI Lab's flagship dense model." },
  { id: "glm-4-9b", name: "GLM-4 9B", family: "Other", paramsB: 9, category: "small", description: "Zhipu AI's bilingual 9B chat model." },
  { id: "mpt-30b", name: "MPT 30B", family: "Other", paramsB: 30, category: "medium", description: "MosaicML's 8k-context commercial-friendly model." },
  { id: "olmo-2-32b", name: "OLMo 2 32B", family: "Other", paramsB: 32, category: "medium", description: "Allen AI's fully open (weights + data + code) model." },
  { id: "granite-3.0-8b", name: "Granite 3.0 8B", family: "Other", paramsB: 8, category: "small", description: "IBM's enterprise-focused open model." },
  { id: "jamba-1.5-large", name: "Jamba 1.5 Large (MoE, 398B)", family: "Other", paramsB: 398, activeParamsB: 94, isMoE: true, category: "flagship", description: "Hybrid Mamba-Transformer MoE with a 256k context window." },
  { id: "arctic-480b", name: "Arctic 480B (MoE)", family: "Other", paramsB: 480, activeParamsB: 17, isMoE: true, category: "flagship", description: "Snowflake's enterprise MoE, 480B total / 17B active." },
  { id: "grok-1-314b", name: "Grok-1 314B (MoE)", family: "Other", paramsB: 314, activeParamsB: 86, isMoE: true, category: "flagship", description: "xAI's open-weighted MoE base model." },
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
