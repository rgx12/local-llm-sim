"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, Heart, Loader2, Search } from "lucide-react";
import { useSimulatorStore } from "@/store/useSimulatorStore";
import type { HfModelDetail, HfQuantFile, HfSearchResult } from "@/lib/huggingface";
import { cn, formatNumber } from "@/lib/utils";

const inputClass =
  "w-full border border-(--line) bg-(--panel-recessed) px-2 py-1.5 font-(family-name:--font-data) text-[13px] text-(--ink) outline-none focus-visible:border-(--amber) placeholder:text-(--ink-faint)";

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${formatNumber(n / 1_000_000, 1)}M`;
  if (n >= 1_000) return `${formatNumber(n / 1_000, 1)}k`;
  return `${n}`;
}

async function readJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export function HuggingFaceSearch() {
  const { hfSelection, setHfQuant } = useSimulatorStore();

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [results, setResults] = useState<HfSearchResult[]>([]);

  const [detail, setDetail] = useState<HfModelDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const searchAbortRef = useRef<AbortController | null>(null);
  const detailAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    const handle = setTimeout(async () => {
      if (trimmed.length < 2) {
        setResults([]);
        setSearchError(null);
        setSearching(false);
        return;
      }

      searchAbortRef.current?.abort();
      const controller = new AbortController();
      searchAbortRef.current = controller;
      setSearching(true);
      setSearchError(null);
      try {
        const res = await fetch(`/api/hf/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        const data = await readJson(res);
        if (!res.ok) throw new Error(data?.error ?? "Search failed.");
        setResults(data?.results ?? []);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setSearchError((err as Error).message || "Search failed.");
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    return () => {
      searchAbortRef.current?.abort();
      detailAbortRef.current?.abort();
    };
  }, []);

  async function openRepo(repoId: string) {
    detailAbortRef.current?.abort();
    const controller = new AbortController();
    detailAbortRef.current = controller;
    setLoadingDetail(true);
    setDetailError(null);
    setDetail(null);
    try {
      const res = await fetch(`/api/hf/model?repo=${encodeURIComponent(repoId)}`, {
        signal: controller.signal,
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data?.error ?? "Could not load this repo.");
      setDetail(data as HfModelDetail);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setDetailError((err as Error).message || "Could not load this repo.");
    } finally {
      setLoadingDetail(false);
    }
  }

  function pickQuant(q: HfQuantFile) {
    if (!detail) return;
    setHfQuant(detail, q);
  }

  if (detail) {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setDetail(null)}
          className="flex items-center gap-1.5 text-xs text-(--ink-dim) hover:text-(--amber)"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to search
        </button>

        <div className="border border-(--line) bg-(--panel-recessed)/50 p-3">
          <div className="font-(family-name:--font-data) text-sm text-(--ink)">{detail.repoId}</div>
          <div className="mt-1 text-[11px] text-(--ink-faint)">
            {formatNumber(detail.paramsB, detail.paramsB < 1 ? 2 : 1)}B params
            {detail.architecture && ` · ${detail.architecture}`}
            {detail.contextLength && ` · ${formatCompact(detail.contextLength)} ctx`}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-(--ink-dim)">Quantization ({detail.quantFiles.length} available)</span>
          <div className="flex max-h-56 flex-col gap-1 overflow-y-auto border border-(--line) p-1">
            {detail.quantFiles.map((q) => {
              const isSelected =
                hfSelection?.repoId === detail.repoId && hfSelection.quant.quant === q.quant;
              return (
                <button
                  key={q.quant}
                  onClick={() => pickQuant(q)}
                  className={cn(
                    "flex items-center justify-between gap-2 border px-2 py-1.5 text-left font-(family-name:--font-data) text-[12px] transition-colors",
                    isSelected
                      ? "border-(--amber) text-(--amber)"
                      : "border-transparent text-(--ink-dim) hover:border-(--line-bright) hover:text-(--ink)",
                  )}
                >
                  <span>{q.quant}</span>
                  <span className="text-(--ink-faint)">
                    {formatNumber(q.sizeGB, 2)} GB · {formatNumber(q.bitsPerWeight, 2)} bpw
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-(--ink-faint)" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Hugging Face for GGUF repos…"
          className={cn(inputClass, "pl-7")}
        />
        {searching && (
          <Loader2 className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-(--amber)" />
        )}
      </div>

      {searchError && <p className="text-xs text-(--status-critical)">{searchError}</p>}
      {detailError && <p className="text-xs text-(--status-critical)">{detailError}</p>}
      {loadingDetail && <p className="text-xs text-(--ink-faint)">Loading GGUF file list…</p>}

      {results.length > 0 && (
        <div className="flex max-h-64 flex-col gap-1 overflow-y-auto border border-(--line) p-1">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => openRepo(r.id)}
              className="flex items-center justify-between gap-2 border border-transparent px-2 py-1.5 text-left font-(family-name:--font-data) text-[12px] text-(--ink-dim) transition-colors hover:border-(--line-bright) hover:text-(--ink)"
            >
              <span className="truncate">{r.id}</span>
              <span className="flex shrink-0 items-center gap-2 text-[10px] text-(--ink-faint)">
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" /> {formatCompact(r.downloads)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" /> {formatCompact(r.likes)}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {query.trim().length >= 2 && !searching && results.length === 0 && !searchError && (
        <p className="text-xs text-(--ink-faint)">No GGUF repos found for &quot;{query}&quot;.</p>
      )}

      {hfSelection && (
        <div className="mt-1 border border-(--amber-dim)/50 bg-(--panel-recessed)/50 px-2 py-1.5 text-[11px] text-(--ink-dim)">
          Active: <span className="text-(--amber)">{hfSelection.repoId}</span> ({hfSelection.quant.quant})
        </div>
      )}
    </div>
  );
}
