"use client";

import { useEffect, useState } from "react";

// Averages pixel color of an image, returns "rgb(r,g,b)".
// Saturation is nudged up so the color reads as a light source rather than mud.
export function useDominantColor(src: string, fallback = "rgb(220,150,90)") {
  const [color, setColor] = useState<string>(fallback);

  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      try {
        const c = document.createElement("canvas");
        const SIZE = 24;
        c.width = SIZE;
        c.height = SIZE;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const data = ctx.getImageData(0, 0, SIZE, SIZE).data;
        let r = 0,
          g = 0,
          b = 0,
          n = 0;
        for (let i = 0; i < data.length; i += 4) {
          // Weight by perceived luminance so bright/colored areas dominate.
          const pr = data[i];
          const pg = data[i + 1];
          const pb = data[i + 2];
          const lum = 0.299 * pr + 0.587 * pg + 0.114 * pb;
          const w = 0.3 + lum / 255; // 0.3..1.3
          r += pr * w;
          g += pg * w;
          b += pb * w;
          n += w;
        }
        r = Math.round(r / n);
        g = Math.round(g / n);
        b = Math.round(b / n);

        // Boost saturation ~1.4x around the luminance center.
        const boost = 1.4;
        const mean = (r + g + b) / 3;
        r = Math.max(0, Math.min(255, Math.round(mean + (r - mean) * boost)));
        g = Math.max(0, Math.min(255, Math.round(mean + (g - mean) * boost)));
        b = Math.max(0, Math.min(255, Math.round(mean + (b - mean) * boost)));

        setColor(`rgb(${r}, ${g}, ${b})`);
      } catch {
        // canvas tainted or decode failed — keep fallback
      }
    };
    return () => {
      cancelled = true;
    };
  }, [src]);

  return color;
}
