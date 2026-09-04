"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Square, Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SimulationResult } from "@/engine/llmCalculator";
import { getSpeedTier, SPEED_TIER_LABELS, type SpeedTier } from "@/engine/llmCalculator";
import { cn, formatNumber } from "@/lib/utils";
import type { SamplePrompt } from "@/data/models";

const CODE_FILLER = [
  "import requests\n",
  "from bs4 import BeautifulSoup\n",
  "import csv\n\n",
  "def scrape_links(url: str) -> list[str]:\n",
  '    """Fetch a page and return every absolute link found."""\n',
  "    response = requests.get(url, timeout=10)\n",
  "    response.raise_for_status()\n",
  "    soup = BeautifulSoup(response.text, 'html.parser')\n",
  "    links = [a['href'] for a in soup.find_all('a', href=True)]\n",
  "    return links\n\n",
  "def save_to_csv(links: list[str], path: str) -> None:\n",
  "    with open(path, 'w', newline='') as f:\n",
  "        writer = csv.writer(f)\n",
  "        writer.writerow(['link'])\n",
  "        writer.writerows([[link] for link in links])\n\n",
  "if __name__ == '__main__':\n",
  "    try:\n",
  "        found = scrape_links('https://example.com')\n",
  "        save_to_csv(found, 'links.csv')\n",
  "        print(f'Saved {len(found)} links.')\n",
  "    except requests.RequestException as exc:\n",
  "        print(f'Failed to fetch page: {exc}')\n",
];

const PROSE_FILLER =
  "The document outlines three core findings. First, deployment latency dropped by an estimated margin " +
  "after the caching layer was introduced. Second, the risk register highlights dependency drift as the " +
  "primary operational hazard going into next quarter. Third, the recommendation is to stage the rollout " +
  "across two phases, validating telemetry before widening exposure. Overall the analysis supports moving " +
  "forward with the plan, provided the monitoring gaps identified in section four are closed beforehand. " +
  "Stakeholders should review the appendix for the full risk matrix and cost breakdown before the next sync. ";

const STORY_FILLER =
  "The drill bit had been silent for six hours when Okafor first noticed the readings drift. Deep in the " +
  "belt, the Persephone's crew had learned to trust silence more than noise, so when the seismic array " +
  "returned a shape that matched nothing in the survey manuals, nobody joked about it. She flagged it to " +
  "the captain, who flagged it to nobody, because there was nobody left to tell. What they had found " +
  "beneath the ice was not ore. It was a door, and it had been waiting a very long time for someone to knock. ";

const QA_FILLER =
  "The capital of Australia is Canberra, not Sydney as many assume. Canberra was purpose-built as a " +
  "compromise capital between Sydney and Melbourne and has a metropolitan population of roughly 460,000 people. ";

function fillerForPrompt(promptId: string): string {
  switch (promptId) {
    case "python-script":
      return CODE_FILLER.join("");
    case "summarize-doc":
      return PROSE_FILLER;
    case "creative-writing":
      return STORY_FILLER;
    case "quick-qa":
      return QA_FILLER;
    default:
      return PROSE_FILLER + STORY_FILLER;
  }
}

function buildOutputTokens(promptId: string, count: number): string[] {
  const base = fillerForPrompt(promptId);
  const words = base.split(/(\s+)/).filter(Boolean);
  const tokens: string[] = [];
  let i = 0;
  while (tokens.length < count) {
    tokens.push(words[i % words.length]);
    i++;
  }
  return tokens.slice(0, count);
}

const GAUGE_SEGMENTS: { tier: SpeedTier; from: number; to: number; className: string }[] = [
  { tier: "slow", from: 0, to: 5, className: "bg-red-500" },
  { tier: "usable", from: 5, to: 15, className: "bg-amber-500" },
  { tier: "fast", from: 15, to: 40, className: "bg-emerald-500" },
  { tier: "blazing", from: 40, to: 80, className: "bg-sky-400" },
];

function gaugePositionPercent(tokPerSec: number): number {
  if (tokPerSec <= 0) return 0;
  for (const seg of GAUGE_SEGMENTS) {
    if (tokPerSec <= seg.to) {
      const segIndex = GAUGE_SEGMENTS.indexOf(seg);
      const within = (tokPerSec - seg.from) / (seg.to - seg.from);
      return segIndex * 25 + within * 25;
    }
  }
  return 100;
}

function SpeedGauge({ tokensPerSecond }: { tokensPerSecond: number }) {
  const tier = getSpeedTier(tokensPerSecond);
  const pointerPct = Math.min(gaugePositionPercent(tokensPerSecond), 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-3 w-full">
        <div
          className="absolute -top-4 -translate-x-1/2 text-[10px] font-semibold text-slate-200 transition-all duration-300"
          style={{ left: `${pointerPct}%` }}
        >
          ▼
        </div>
      </div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {GAUGE_SEGMENTS.map((seg) => (
          <div key={seg.tier} className={cn("h-full flex-1 opacity-80", seg.className)} />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-slate-500">
        {GAUGE_SEGMENTS.map((seg) => (
          <span key={seg.tier} className={cn(tier === seg.tier && "font-semibold text-slate-200")}>
            {SPEED_TIER_LABELS[seg.tier]}
          </span>
        ))}
      </div>
    </div>
  );
}

interface TokenStreamerProps {
  result: SimulationResult;
  samplePrompt: SamplePrompt;
  outputTokens: number;
}

type StreamPhase = "idle" | "ttft" | "streaming" | "done";

export function TokenStreamer({ result, samplePrompt, outputTokens }: TokenStreamerProps) {
  const [phase, setPhase] = useState<StreamPhase>("idle");
  const [visibleTokens, setVisibleTokens] = useState<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runIdRef = useRef(0);

  const tokens = useMemo(
    () => buildOutputTokens(samplePrompt.id, outputTokens),
    [samplePrompt.id, outputTokens],
  );

  const isOom = result.fitStatus === "OOM";
  const msPerToken = result.tokensPerSecond > 0 ? 1000 / result.tokensPerSecond : 1000;
  const visualTtftMs = Math.min(result.ttftMs, 4000);

  function stop() {
    runIdRef.current++;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase("idle");
  }

  function run() {
    if (isOom) return;
    runIdRef.current++;
    const myRun = runIdRef.current;
    setVisibleTokens([]);
    setPhase("ttft");

    timeoutRef.current = setTimeout(() => {
      if (runIdRef.current !== myRun) return;
      setPhase("streaming");

      let index = 0;
      const step = () => {
        if (runIdRef.current !== myRun) return;
        index++;
        setVisibleTokens(tokens.slice(0, index));
        if (index >= tokens.length) {
          setPhase("done");
          return;
        }
        timeoutRef.current = setTimeout(step, Math.max(msPerToken, 1));
      };
      step();
    }, visualTtftMs);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" /> Live Inference Preview
        </CardTitle>
        <CardDescription>Streams the response at your simulated tokens/sec rate.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="min-h-[220px] rounded-lg border border-slate-800 bg-black/70 p-3 font-mono text-[13px] leading-relaxed text-emerald-300 shadow-inner">
          <div className="mb-2 whitespace-pre-wrap text-slate-400">
            <span className="text-slate-500">$ </span>
            {samplePrompt.promptText}
          </div>
          {isOom ? (
            <div className="text-red-400">
              CUDA error: out of memory — model does not fit in available VRAM + system RAM.
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
              {phase === "ttft" && <span className="text-slate-500">waiting for first token…</span>}
              {visibleTokens.join("")}
              {(phase === "streaming" || phase === "ttft") && (
                <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-emerald-400 align-middle" />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {phase === "streaming" || phase === "ttft" ? (
            <Button variant="secondary" onClick={stop} className="w-full sm:w-auto">
              <Square className="h-4 w-4" /> Stop
            </Button>
          ) : (
            <Button onClick={run} disabled={isOom} className="w-full sm:w-auto">
              <Play className="h-4 w-4" /> Run Benchmark Simulation
            </Button>
          )}
          <div className="text-xs text-slate-500">
            {phase === "done" && `Generated ${tokens.length} tokens.`}
            {phase === "idle" && !isOom && "Ready to simulate."}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs font-medium text-slate-400">Speed Meter</span>
            <span className="text-xs font-semibold text-slate-200">
              {formatNumber(result.tokensPerSecond, 1)} tok/s
            </span>
          </div>
          <SpeedGauge tokensPerSecond={result.tokensPerSecond} />
        </div>
      </CardContent>
    </Card>
  );
}
