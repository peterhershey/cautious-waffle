import { generateMonoline, SupportedMediaType } from "./gemini";
import { rasterToSvg } from "./vectorize";
import { normalizeSvg } from "./svg-normalize";

export type PipelineInput = {
  imageBase64: string;
  mediaType: SupportedMediaType;
  stylePrompt: string;
  strokeWidth?: number;
};

export type PipelineOutput = {
  svg: string;
};

export async function runPipeline(
  input: PipelineInput,
): Promise<PipelineOutput> {
  const rasterPng = await generateMonoline(
    input.imageBase64,
    input.mediaType,
    input.stylePrompt,
  );
  const rawSvg = await rasterToSvg(rasterPng);
  try {
    const svg = normalizeSvg(rawSvg, {
      strokeWidth: input.strokeWidth ?? 1.5,
    });
    return { svg };
  } catch (err) {
    console.error(
      "[monoline] normalize failed. Raw SVG head:",
      rawSvg.slice(0, 400),
    );
    throw err;
  }
}
