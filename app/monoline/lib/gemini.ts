import { GoogleGenAI, Modality } from "@google/genai";

export type SupportedMediaType = "image/png" | "image/jpeg" | "image/webp";

const MODEL = "gemini-3.1-flash-image-preview";

export async function generateMonoline(
  imageBase64: string,
  mediaType: SupportedMediaType,
  stylePrompt: string,
): Promise<Buffer> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: mediaType, data: imageBase64 } },
          {
            text: `${stylePrompt}\n\nTransform the provided screenshot into a monoline illustration following the style guidance above. Preserve the structural layout and hierarchy, but abstract away specific text, colors, and pixel-level detail.`,
          },
        ],
      },
    ],
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart?.inlineData?.data) {
    throw new Error("Gemini returned no image data");
  }

  return Buffer.from(imagePart.inlineData.data, "base64");
}
