export type SourceVisualizationRoute = {
  spatialComponent: string;
  vectorComponent: string;
};

/**
 * Reads the explicit patent dispatcher without depending on formatter-specific
 * indentation. Consecutive case labels intentionally share the first visual
 * pair that follows them, matching JavaScript switch fallthrough semantics.
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
    const spatialComponent = segment.match(/<([A-Z][A-Za-z0-9]*3D)\b/)?.[1];
    const vectorComponent = segment.match(/<([A-Z][A-Za-z0-9]*Sim)\b/)?.[1];
    if (!spatialComponent || !vectorComponent) continue;

    for (const id of pendingIds) {
      routes.set(id, { spatialComponent, vectorComponent });
    }
    pendingIds = [];
  }

  if (pendingIds.length > 0) {
    throw new Error(`Patent visual routes have no component pair: ${pendingIds.join(", ")}`);
  }

  return routes;
}
