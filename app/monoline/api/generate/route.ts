import { NextResponse } from "next/server";
import { runPipeline } from "../../lib/pipeline";
import type { SupportedMediaType } from "../../lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  imageBase64?: string;
  mediaType?: SupportedMediaType;
  stylePrompt?: string;
  strokeWidth?: number;
};

const ALLOWED_MEDIA: SupportedMediaType[] = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { imageBase64, mediaType, stylePrompt, strokeWidth } = body;

  if (!imageBase64 || !mediaType || !stylePrompt) {
    return NextResponse.json(
      { error: "Missing imageBase64, mediaType, or stylePrompt." },
      { status: 400 },
    );
  }
  if (!ALLOWED_MEDIA.includes(mediaType)) {
    return NextResponse.json(
      { error: `Unsupported mediaType: ${mediaType}` },
      { status: 400 },
    );
  }

  try {
    const result = await runPipeline({
      imageBase64,
      mediaType,
      stylePrompt,
      strokeWidth,
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[monoline] pipeline failed:", err);
    return NextResponse.json(
      { error: `Pipeline failed: ${message}` },
      { status: 500 },
    );
  }
}
