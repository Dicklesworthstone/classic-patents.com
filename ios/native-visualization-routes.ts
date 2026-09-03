export type SourceVisualizationRoute =
  | {
      kind: "model";
      spatialComponent: string;
      vectorComponent: string;
    }
  | {
      kind: "source-bound-pdf-only";
      sourceBoundary: string;
    };

export const SOURCE_BOUNDARY_PDF_ONLY =
  "The public record is limited to the pinned facsimile and checked claim reading. No reviewed transcription, archival edition, model, controls, quantitative metrics, or USDZ asset is shipped in the native app.";

/**
 * Reads the explicit patent dispatcher without depending on formatter-specific
 * indentation. Consecutive case labels intentionally share the first visual
 * pair that follows them, matching JavaScript switch fallthrough semantics.
 *
 * A case that renders `<SourceVisualUnavailable` instead of a 3D/2D pair is a
 * source-bound PDF-only route: the native app ships only the pinned facsimile
 * and checked claim reading for it, never a model.
 */
export function parseSourceVisualizationRoutes(
  source: string,
): Map<string, SourceVisualizationRoute> {
  const switchMatch = /\bswitch\s*\(\s*patentId\s*\)\s*\{/.exec(source);
  if (!switchMatch) {
    throw new Error("Could not locate the canonical PatentVisualDispatcher switch");
  }

  const bodyStart = switchMatch.index + switchMatch[0].length;
  const switchRemainder = source.slice(bodyStart);
  const defaultMatch = /^\s*default\s*:/m.exec(switchRemainder);
  if (!defaultMatch || defaultMatch.index === undefined) {
    throw new Error("Could not locate the canonical PatentVisualDispatcher default case");
  }

  const dispatcher = switchRemainder.slice(0, defaultMatch.index);
  const cases = [...dispatcher.matchAll(/case\s+"([^"]+)"\s*:/g)];
  const routes = new Map<string, SourceVisualizationRoute>();
  let pendingIds: string[] = [];

  for (const [index, match] of cases.entries()) {
    pendingIds.push(match[1]);
    const segmentStart = (match.index ?? 0) + match[0].length;
    const segmentEnd = cases[index + 1]?.index ?? dispatcher.length;
    const segment = dispatcher.slice(segmentStart, segmentEnd);
    if (segment.includes("<SourceVisualUnavailable")) {
      for (const id of pendingIds) {
        routes.set(id, { kind: "source-bound-pdf-only", sourceBoundary: SOURCE_BOUNDARY_PDF_ONLY });
      }
      pendingIds = [];
      continue;
    }
    const spatialComponent = segment.match(/<([A-Z][A-Za-z0-9]*3D)\b/)?.[1];
    const vectorComponent = segment.match(/<([A-Z][A-Za-z0-9]*Sim)\b/)?.[1];
    if (!spatialComponent || !vectorComponent) continue;

    for (const id of pendingIds) {
      routes.set(id, { kind: "model", spatialComponent, vectorComponent });
    }
    pendingIds = [];
  }

  if (pendingIds.length > 0) {
    throw new Error(`Patent visual routes have no component pair: ${pendingIds.join(", ")}`);
  }

  return routes;
}
