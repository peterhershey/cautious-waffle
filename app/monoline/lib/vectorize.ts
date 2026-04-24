import { vectorize } from "@neplex/vectorizer";

const COLOR_MODE_BINARY = 1;
const HIERARCHICAL_STACKED = 0;
const PATH_SIMPLIFY_SPLINE = 2;

export async function rasterToSvg(pngBuffer: Buffer): Promise<string> {
  return vectorize(pngBuffer, {
    colorMode: COLOR_MODE_BINARY,
    hierarchical: HIERARCHICAL_STACKED,
    filterSpeckle: 4,
    colorPrecision: 2,
    layerDifference: 16,
    mode: PATH_SIMPLIFY_SPLINE,
    cornerThreshold: 60,
    lengthThreshold: 4,
    maxIterations: 10,
    spliceThreshold: 45,
    pathPrecision: 2,
  });
}
