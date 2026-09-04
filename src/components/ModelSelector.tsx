"use client";

import { BrainCircuit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MODELS, QUANTIZATIONS, SAMPLE_PROMPTS } from "@/data/models";
import { useSimulatorStore, useResolvedConfig } from "@/store/useSimulatorStore";
import { formatNumber } from "@/lib/utils";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      {children}
    </div>
  );
}

function formatContext(tokens: number): string {
  if (tokens >= 1000) return `${formatNumber(tokens / 1000, tokens % 1000 === 0 ? 0 : 1)}k`;
  return `${tokens}`;
}

export function ModelSelector() {
  const {
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
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-emerald-400" /> Model &amp; Prompt
        </CardTitle>
        <CardDescription>Pick what you want to run and how hard you want to push it.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field label="Model">
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} ({m.paramsB}B)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Quantization">
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

        <Field label={`Context Length — ${formatContext(contextLengthTokens)} tokens`}>
          <Slider
            min={2048}
            max={131072}
            step={1024}
            value={[contextLengthTokens]}
            onValueChange={([v]) => setContextLengthTokens(v)}
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>2k</span>
            <span>32k</span>
            <span>128k</span>
          </div>
        </Field>

        <Field label="Sample Prompt">
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
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{samplePrompt.promptText}</p>
        </Field>

        <Field label={`Output Length Target — ${outputTokens} tokens`}>
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
