"use client";

import { Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { HuggingFaceSearch } from "@/components/HuggingFaceSearch";
import { MODELS, QUANTIZATIONS, SAMPLE_PROMPTS } from "@/data/models";
import { useSimulatorStore, useResolvedConfig, type ModelSource } from "@/store/useSimulatorStore";
import { cn, formatNumber, groupBy } from "@/lib/utils";

const modelGroups = groupBy(MODELS, (m) => m.family);

function Field({
  tag,
  label,
  value,
  children,
}: {
  tag: string;
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-baseline justify-between gap-2 text-xs text-(--ink-dim)">
        <span>
          <span className="font-(family-name:--font-data) text-(--amber-dim)">{tag}</span> {label}
        </span>
        {value && <span className="font-(family-name:--font-data) text-(--ink)">{value}</span>}
      </label>
      {children}
    </div>
  );
}

function SourceToggle() {
  const { modelSource, setModelSource } = useSimulatorStore();

  const options: { id: ModelSource; label: string }[] = [
    { id: "curated", label: "Curated list" },
    { id: "huggingface", label: "Hugging Face search" },
  ];

  return (
    <div className="flex border border-(--line)">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setModelSource(opt.id)}
          className={cn(
            "flex-1 px-2 py-1.5 font-(family-name:--font-data) text-[12px] transition-colors",
            modelSource === opt.id
              ? "bg-(--panel-recessed) text-(--amber)"
              : "text-(--ink-faint) hover:text-(--ink-dim)",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function formatContext(tokens: number): string {
  if (tokens >= 1000) return `${formatNumber(tokens / 1000, tokens % 1000 === 0 ? 0 : 1)}k`;
  return `${tokens}`;
}

export function ModelSelector() {
  const {
    modelSource,
    modelId,
    setModelId,
    quantId,
    setQuantId,
    contextLengthTokens,
    setContextLengthTokens,
    samplePromptId,
    setSamplePromptId,
    outputTokens,
    setOutputTokens,
  } = useSimulatorStore();

  const { samplePrompt } = useResolvedConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Layers className="h-4 w-4 text-(--amber)" /> Model &amp; workload
        </CardTitle>
        <CardDescription>Pick what runs, and how hard it gets pushed.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field tag="M1" label="Model source">
          <SourceToggle />
        </Field>

        {modelSource === "curated" ? (
          <>
            <Field tag="M2" label="Model">
              <Select value={modelId} onValueChange={setModelId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(modelGroups.entries()).map(([group, items]) => (
                    <SelectGroup key={group}>
                      <SelectLabel>{group}</SelectLabel>
                      {items.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name} ({m.paramsB}B)
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field tag="M3" label="Quantization">
              <Select value={quantId} onValueChange={setQuantId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUANTIZATIONS.map((q) => (
                    <SelectItem key={q.id} value={q.id}>
                      {q.name} (~{q.bitsPerWeight} bpw)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </>
        ) : (
          <Field tag="M2" label="Hugging Face GGUF repo + quant">
            <HuggingFaceSearch />
          </Field>
        )}

        <Field tag="M4" label="Context length" value={`${formatContext(contextLengthTokens)} tok`}>
          <Slider
            min={2048}
            max={131072}
            step={1024}
            value={[contextLengthTokens]}
            onValueChange={([v]) => setContextLengthTokens(v)}
          />
          <div className="flex justify-between text-[10px] text-(--ink-faint)">
            <span>2k</span>
            <span>32k</span>
            <span>128k</span>
          </div>
        </Field>

        <Field tag="M5" label="Sample prompt">
          <Select value={samplePromptId} onValueChange={setSamplePromptId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SAMPLE_PROMPTS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1 line-clamp-2 text-xs text-(--ink-faint)">{samplePrompt.promptText}</p>
        </Field>

        <Field tag="M6" label="Output length target" value={`${outputTokens} tok`}>
          <Slider
            min={32}
            max={2048}
            step={32}
            value={[outputTokens]}
            onValueChange={([v]) => setOutputTokens(v)}
          />
        </Field>
      </CardContent>
    </Card>
  );
}
