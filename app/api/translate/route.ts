import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = body?.text;
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "missing text" }, { status: 400 });
    }

    const targets: Record<string, string> = { en: "en", jp: "ja", zh: "zh" };

    const translateTo = async (target: string) => {
      const res = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, source: "auto", target }),
      });
      if (!res.ok) return "";
      const data = await res.json();
      return data.translatedText || data.translated_text || "";
    };

    const entries = await Promise.all(
      Object.entries(targets).map(async ([k, v]) => {
        const t = await translateTo(v);
        return [k, t];
      }),
    );

    const result = Object.fromEntries(entries);
    return NextResponse.json(result);
  } catch (err) {
    console.error("translate error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
