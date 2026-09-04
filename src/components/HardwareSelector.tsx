"use client";

import { Cpu, MemoryStick, Zap, PlusCircle } from "lucide-react";
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      {children}
    </div>
  );
}

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
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-emerald-400" /> Hardware Configurator
        </CardTitle>
        <CardDescription>Build your rig and see what it can actually run.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field label="GPU">
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
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <Field label="VRAM (GB)">
              <input
                type="number"
                min={1}
                value={customGpu.vramGB}
                onChange={(e) => setCustomGpu({ vramGB: Number(e.target.value) })}
                className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
              />
            </Field>
            <Field label="Bandwidth (GB/s)">
              <input
                type="number"
                min={1}
                value={customGpu.bandwidthGBs}
                onChange={(e) => setCustomGpu({ bandwidthGBs: Number(e.target.value) })}
                className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
              />
            </Field>
            <Field label="FP16 TFLOPS">
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={customGpu.fp16TFLOPS}
                onChange={(e) => setCustomGpu({ fp16TFLOPS: Number(e.target.value) })}
                className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-100"
              />
            </Field>
          </div>
        )}

        <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <input
            type="checkbox"
            checked={dualGpuEnabled}
            onChange={(e) => setDualGpuEnabled(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 accent-emerald-500"
          />
          <PlusCircle className="h-3.5 w-3.5" /> Add a second GPU (dual-GPU build)
        </label>

        {dualGpuEnabled && (
          <Field label="Second GPU">
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

        <div className="h-px bg-slate-800" />

        <Field label="CPU">
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
          <Field label="System RAM Type/Speed">
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

          <Field label="System RAM Capacity">
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

        <Field label="PCIe Generation">
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

        <div className="mt-1 grid grid-cols-2 gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <div className="flex items-center gap-2">
            <MemoryStick className="h-4 w-4 text-emerald-400" />
            <div>
              <div className="text-[11px] text-slate-500">Total VRAM</div>
              <div className="text-sm font-semibold text-slate-100">
                {formatNumber(pool.vramGB, 0)} GB
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <div>
              <div className="text-[11px] text-slate-500">System RAM Bandwidth</div>
              <div className="text-sm font-semibold text-slate-100">
                {formatNumber(ram.bandwidthGBs, 1)} GB/s
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
