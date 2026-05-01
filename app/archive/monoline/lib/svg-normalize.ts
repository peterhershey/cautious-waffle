export type NormalizeOptions = {
  strokeWidth?: number;
  strokeColor?: string;
  backgroundColor?: string;
};

const VIEWBOX_RE = /viewBox\s*=\s*"([^"]+)"/i;
const WIDTH_ATTR_RE = /\swidth\s*=\s*"([^"]+)"/i;
const HEIGHT_ATTR_RE = /\sheight\s*=\s*"([^"]+)"/i;
const WIDTH_RE = /\swidth\s*=\s*"[^"]+"/i;
const HEIGHT_RE = /\sheight\s*=\s*"[^"]+"/i;
const FILL_ATTR_RE = /\sfill\s*=\s*"[^"]*"/gi;
const STROKE_ATTR_RE = /\sstroke\s*=\s*"[^"]*"/gi;
const STROKE_WIDTH_ATTR_RE = /\sstroke-width\s*=\s*"[^"]*"/gi;
const INLINE_FILL_STYLE_RE = /fill\s*:\s*[^;"']+;?/gi;
const INLINE_STROKE_STYLE_RE = /stroke\s*:\s*[^;"']+;?/gi;

function parseDimension(raw: string | undefined): number | null {
  if (!raw) return null;
  const num = parseFloat(raw);
  return Number.isFinite(num) && num > 0 ? num : null;
}

export function normalizeSvg(
  rawSvg: string,
  opts: NormalizeOptions = {},
): string {
  const strokeWidth = opts.strokeWidth ?? 1.5;
  const strokeColor = opts.strokeColor ?? "#FFFFFF";
  const backgroundColor = opts.backgroundColor ?? "#000000";

  let svg = rawSvg;

  const viewBoxMatch = svg.match(VIEWBOX_RE);
  const widthVal = parseDimension(svg.match(WIDTH_ATTR_RE)?.[1]);
  const heightVal = parseDimension(svg.match(HEIGHT_ATTR_RE)?.[1]);

  let viewBox: string;
  if (viewBoxMatch) {
    viewBox = viewBoxMatch[1];
  } else if (widthVal && heightVal) {
    viewBox = `0 0 ${widthVal} ${heightVal}`;
  } else {
    throw new Error(
      "Vectorizer output missing viewBox and width/height attributes",
    );
  }

  svg = svg.replace(FILL_ATTR_RE, "");
  svg = svg.replace(STROKE_ATTR_RE, "");
  svg = svg.replace(STROKE_WIDTH_ATTR_RE, "");
  svg = svg.replace(INLINE_FILL_STYLE_RE, "");
  svg = svg.replace(INLINE_STROKE_STYLE_RE, "");

  svg = svg.replace(
    /<svg([^>]*)>/i,
    (_match, attrs: string) => {
      let cleaned = attrs.replace(WIDTH_RE, "").replace(HEIGHT_RE, "");
      if (!/xmlns\s*=/.test(cleaned)) {
        cleaned = ` xmlns="http://www.w3.org/2000/svg"${cleaned}`;
      }
      const backgroundRect = `<rect x="0" y="0" width="100%" height="100%" fill="${backgroundColor}"/>`;
      const groupOpen = `<g fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">`;
      return `<svg${cleaned} viewBox="${viewBox}">${backgroundRect}${groupOpen}`;
    },
  );

  svg = svg.replace(/<\/svg>/i, "</g></svg>");

  return svg;
}
