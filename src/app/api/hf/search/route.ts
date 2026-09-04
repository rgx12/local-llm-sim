import { NextRequest, NextResponse } from "next/server";
import type { HfSearchResult } from "@/lib/huggingface";

interface HfSearchApiRow {
  id: string;
  likes?: number;
  downloads?: number;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] satisfies HfSearchResult[] });
  }

  const url = new URL("https://huggingface.co/api/models");
  url.searchParams.set("search", q);
  url.searchParams.set("filter", "gguf");
  url.searchParams.set("sort", "downloads");
  url.searchParams.set("direction", "-1");
  url.searchParams.set("limit", "20");

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Hugging Face returned ${res.status}.` }, { status: 502 });
    }

    const rows = (await res.json()) as HfSearchApiRow[];
    const results: HfSearchResult[] = rows.map((m) => ({
      id: m.id,
      likes: m.likes ?? 0,
      downloads: m.downloads ?? 0,
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Could not reach Hugging Face." }, { status: 502 });
  }
}
