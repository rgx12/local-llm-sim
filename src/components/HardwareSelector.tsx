"use client";

import { Cpu, MemoryStick, SlidersHorizontal, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CPUS,
  GPUS,
  PCIE_OPTIONS,
  RAM_CAPACITY_OPTIONS_GB,
  RAM_OPTIONS,
  type PcieGen,
} from "@/data/hardware";
import { resolveGpuPool } from "@/engine/llmCalculator";
import { useSimulatorStore, useResolvedConfig } from "@/store/useSimulatorStore";
import { formatNumber } from "@/lib/utils";

function Field({ tag, label, children }: { tag: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-baseline gap-2 text-xs text-(--ink-dim)">
        <span className="font-(family-name:--font-data) text-(--amber-dim)">{tag}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "border border-(--line) bg-(--panel-recessed) px-2 py-1.5 font-(family-name:--font-data) text-[13px] text-(--ink) outline-none focus-visible:border-(--amber)";

export function HardwareSelector() {
  const {
    gpuId,
    setGpuId,
    customGpu,
    setCustomGpu,
    dualGpuEnabled,
    setDualGpuEnabled,
    secondGpuId,
    setSecondGpuId,
    cpuId,
    setCpuId,
    ramId,
    setRamId,
    ramCapacityGB,
    setRamCapacityGB,
    pcieGen,
    setPcieGen,
  } = useSimulatorStore();

  const { gpu, secondGpu, ram } = useResolvedConfig();
  const pool = resolveGpuPool(gpu, secondGpu);
  const isCustom = gpu.isCustom;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <SlidersHorizontal className="h-4 w-4 text-(--amber)" /> Build configuration
        </CardTitle>
        <CardDescription>Set the rig, read what it can carry.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field tag="G1" label="GPU">
          <Select value={gpuId} onValueChange={setGpuId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GPUS.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                  {!g.isCustom && ` — ${g.vramGB}GB, ${g.bandwidthGBs} GB/s`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {isCustom && (
          <div className="grid grid-cols-3 gap-2 border border-(--line) bg-(--panel-recessed)/50 p-3">
            <Field tag="a" label="VRAM (GB)">
              <input
                type="number"
                min={1}
                value={customGpu.vramGB}
                onChange={(e) => setCustomGpu({ vramGB: Number(e.target.value) })}
                className={inputClass}
              />
            </Field>
            <Field tag="b" label="Bandwidth (GB/s)">
              <input
                type="number"
                min={1}
                value={customGpu.bandwidthGBs}
                onChange={(e) => setCustomGpu({ bandwidthGBs: Number(e.target.value) })}
                className={inputClass}
              />
            </Field>
            <Field tag="c" label="FP16 TFLOPS">
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={customGpu.fp16TFLOPS}
                onChange={(e) => setCustomGpu({ fp16TFLOPS: Number(e.target.value) })}
                className={inputClass}
              />
            </Field>
          </div>
        )}

        <label className="flex items-center gap-2 text-xs text-(--ink-dim)">
          <input
            type="checkbox"
            checked={dualGpuEnabled}
            onChange={(e) => setDualGpuEnabled(e.target.checked)}
            className="h-3.5 w-3.5"
            style={{ accentColor: "var(--amber)" }}
          />
          <PlusCircle className="h-3.5 w-3.5" /> Add a second GPU (dual-GPU build)
        </label>

        {dualGpuEnabled && (
          <Field tag="G2" label="Second GPU">
            <Select value={secondGpuId} onValueChange={setSecondGpuId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GPUS.filter((g) => !g.isCustom).map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name} — {g.vramGB}GB, {g.bandwidthGBs} GB/s
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}

        <div className="h-px bg-(--line)" />

        <Field tag="G3" label="CPU">
          <Select value={cpuId} onValueChange={setCpuId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CPUS.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field tag="G4" label="System RAM">
            <Select value={ramId} onValueChange={setRamId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RAM_OPTIONS.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field tag="G5" label="RAM capacity">
            <Select value={String(ramCapacityGB)} onValueChange={(v) => setRamCapacityGB(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RAM_CAPACITY_OPTIONS_GB.map((gb) => (
                  <SelectItem key={gb} value={String(gb)}>
                    {gb} GB
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field tag="G6" label="PCIe generation">
          <Select value={pcieGen} onValueChange={(v) => setPcieGen(v as PcieGen)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PCIE_OPTIONS.map((p) => (
                <SelectItem key={p.gen} value={p.gen}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="mt-1 border border-(--line) bg-(--panel-recessed)/50">
          <div className="flex items-center gap-2 border-b border-(--line) px-3 py-2.5">
            <MemoryStick className="h-3.5 w-3.5 text-(--amber-dim)" />
            <span className="flex-1 text-xs text-(--ink-dim)">Total VRAM</span>
            <span className="font-(family-name:--font-data) text-sm font-medium text-(--ink)">
              {formatNumber(pool.vramGB, 0)} GB
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Cpu className="h-3.5 w-3.5 text-(--amber-dim)" />
            <span className="flex-1 text-xs text-(--ink-dim)">System RAM bandwidth</span>
            <span className="font-(family-name:--font-data) text-sm font-medium text-(--ink)">
              {formatNumber(ram.bandwidthGBs, 1)} GB/s
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
