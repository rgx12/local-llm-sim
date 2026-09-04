import { NextRequest, NextResponse } from "next/server";
import { extractQuantLabel, HF_REPO_ID_PATTERN, type HfModelDetail, type HfQuantFile } from "@/lib/huggingface";

interface HfTreeEntry {
  path: string;
  size?: number;
  lfs?: { size: number };
}

interface HfModelInfoResponse {
  gguf?: {
    total?: number;
    architecture?: string;
    context_length?: number;
  };
}

export async function GET(req: NextRequest) {
  const repo = req.nextUrl.searchParams.get("repo")?.trim();
  if (!repo || !HF_REPO_ID_PATTERN.test(repo)) {
    return NextResponse.json({ error: "Invalid repo id — expected the form owner/name." }, { status: 400 });
  }

  try {
    const [infoRes, treeRes] = await Promise.all([
      fetch(`https://huggingface.co/api/models/${repo}?expand[]=gguf`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      }),
      fetch(`https://huggingface.co/api/models/${repo}/tree/main`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      }),
    ]);

    if (!infoRes.ok || !treeRes.ok) {
      return NextResponse.json({ error: "Model or file list not found on Hugging Face." }, { status: 502 });
    }

    const info = (await infoRes.json()) as HfModelInfoResponse;
    const tree = (await treeRes.json()) as HfTreeEntry[];

    const totalParams = info.gguf?.total;
    if (!totalParams) {
      return NextResponse.json(
        { error: "No GGUF header metadata found for this repo — it may not be a quantized GGUF repo." },
        { status: 404 },
      );
    }

    const byQuant = new Map<string, { bytes: number; count: number }>();
    for (const entry of tree) {
      if (!entry.path.toLowerCase().endsWith(".gguf")) continue;
      const label = extractQuantLabel(entry.path);
      if (!label) continue;
      const bytes = entry.lfs?.size ?? entry.size ?? 0;
      if (bytes <= 0) continue;

      const existing = byQuant.get(label);
      if (existing) {
        existing.bytes += bytes;
        existing.count += 1;
      } else {
        byQuant.set(label, { bytes, count: 1 });
      }
    }

    const quantFiles: HfQuantFile[] = Array.from(byQuant.entries())
      .map(([quant, { bytes, count }]) => ({
        quant,
        sizeGB: bytes / 1e9,
        bitsPerWeight: (bytes * 8) / totalParams,
        fileCount: count,
      }))
      .sort((a, b) => a.sizeGB - b.sizeGB);

    if (quantFiles.length === 0) {
      return NextResponse.json(
        { error: "No recognizable GGUF quant files found in this repo." },
        { status: 404 },
      );
    }

    const detail: HfModelDetail = {
      repoId: repo,
      architecture: info.gguf?.architecture ?? null,
      contextLength: info.gguf?.context_length ?? null,
      paramsB: totalParams / 1e9,
      quantFiles,
    };

    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Could not reach Hugging Face." }, { status: 502 });
  }
}
