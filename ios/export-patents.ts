import { ALL_COLORIZED_EQUATIONS } from "../src/data/colorizedEquations";
import { ARCHIVAL_PARALLEL_READINGS } from "../src/data/editions/parallelReadings";
import { allPatents } from "../src/data/patents/index";
import { PATENT_PHYSICS_REGISTRY } from "../src/physics/telemetryData";

type SourceVisualizationRoute = {
  spatialComponent: string;
  vectorComponent: string;
};

async function sourceVisualizationRoutes(): Promise<Map<string, SourceVisualizationRoute>> {
  const source = await Bun.file(
    new URL("../src/components/patents/visuals/index.tsx", import.meta.url),
  ).text();
  const switchStart = source.indexOf("switch (patentId)");
  const switchEnd = source.indexOf("\n          default:", switchStart);
  if (switchStart < 0 || switchEnd < 0) {
    throw new Error("Could not locate the canonical PatentVisualDispatcher switch");
  }
  const dispatcher = source.slice(switchStart, switchEnd);
  const cases = [...dispatcher.matchAll(/case "([^"]+)":/g)];
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

const visualizationRoutes = await sourceVisualizationRoutes();

const patentAssetGlob = new Bun.Glob("**/*.{png,txt}");
const allBundledAssetPaths = [
  ...patentAssetGlob.scanSync({
    cwd: new URL("../public/patents", import.meta.url).pathname,
    onlyFiles: true,
  }),
]
  .map((path) => `patents/${path}`)
  .sort();
const bundledAssetSet = new Set(allBundledAssetPaths);

function equationsFor(patentId: string) {
  const published = ALL_COLORIZED_EQUATIONS[patentId] ?? [];
  return published.length > 0
    ? published
    : (ALL_COLORIZED_EQUATIONS[`_legacy-unpublished-${patentId}`] ?? []);
}

function referencedEditionAssets(value: unknown): string[] {
  const assets = new Set<string>();
  const visit = (node: unknown) => {
    if (Array.isArray(node)) {
      for (const child of node) visit(child);
      return;
    }
    if (!node || typeof node !== "object") return;
    for (const [key, child] of Object.entries(node)) {
      if (key === "src" && typeof child === "string" && child.startsWith("/patents/")) {
        assets.add(child.slice(1));
      } else {
        visit(child);
      }
    }
  };
  visit(value);
  return [...assets].sort();
}

const exported = allPatents.map((patent) => {
  const editionAssets = referencedEditionAssets(patent.archivalEdition);
  const availableEditionAssets = editionAssets.filter((path) => bundledAssetSet.has(path));
  const withheldAssets = editionAssets.filter((path) => !bundledAssetSet.has(path));
  return {
    id: patent.id,
    patentNumber: patent.patentNumber,
    title: patent.title,
    shortTitle: patent.shortTitle,
    subtitle: patent.subtitle,
    inventors: patent.inventors,
    inventorLocation: patent.inventorLocation,
    grantDate: patent.grantDate,
    filingDate: patent.filingDate,
    era: patent.era,
    category: patent.category,
    categoryLabel: patent.categoryLabel,
    summary: patent.summary,
    heroQuote: patent.heroQuote,
    originalPdfURL: `https://classic-patents.com${patent.originalPdfUrl}`,
    googlePatentsURL: patent.googlePatentsUrl,
    usptoClassification: patent.usptoClassification,
    originalText: patent.originalText,
    originalTextAsset: patent.originalTextAsset,
    archivalEdition: patent.archivalEdition,
    archivalParallelReadings: ARCHIVAL_PARALLEL_READINGS[patent.id] ?? {},
    plainEnglish: patent.plainEnglishExplanation,
    claims: patent.claims,
    drawings: patent.drawings,
    history: patent.historicalContext,
    tags: patent.tags ?? [],
    stats: patent.stats,
    equations: equationsFor(patent.id),
    physics: PATENT_PHYSICS_REGISTRY[patent.id],
    sourceVisualization: visualizationRoutes.get(patent.id),
    bundledAssets: [
      ...new Set([
        ...availableEditionAssets,
        ...allBundledAssetPaths.filter((path) => path.includes(patent.id)),
        ...(patent.originalTextAsset?.url?.startsWith("/patents/")
          ? [patent.originalTextAsset.url.slice(1)]
          : []),
      ]),
    ].sort(),
    withheldAssets,
  };
});

const missingVisualizationRoutes = exported.filter((patent) => !patent.sourceVisualization);
if (missingVisualizationRoutes.length > 0) {
  throw new Error(
    `Missing source visualization routes for: ${missingVisualizationRoutes.map((patent) => patent.id).join(", ")}`,
  );
}

const output = new URL("./Resources/patents.json", import.meta.url);
await Bun.write(output, `${JSON.stringify(exported, null, 2)}\n`);
const manifestOutput = new URL("./Resources/patent-assets.json", import.meta.url);
await Bun.write(manifestOutput, `${JSON.stringify(allBundledAssetPaths, null, 2)}\n`);

const totals = exported.reduce(
  (sum, patent) => ({
    editions: sum.editions + (patent.archivalEdition ? 1 : 0),
    equations: sum.equations + patent.equations.length,
    drawings: sum.drawings + patent.drawings.length,
    callouts:
      sum.callouts + patent.drawings.reduce((count, drawing) => count + drawing.callouts.length, 0),
    assets: sum.assets + patent.bundledAssets.length,
    visualizations: sum.visualizations + (patent.sourceVisualization ? 1 : 0),
    withheldAssets: sum.withheldAssets + patent.withheldAssets.length,
  }),
  {
    editions: 0,
    equations: 0,
    drawings: 0,
    callouts: 0,
    assets: 0,
    visualizations: 0,
    withheldAssets: 0,
  },
);
console.log(
  `Exported ${exported.length} patents, ${totals.editions} editions, ${totals.equations} equations, ` +
    `${totals.drawings} drawings, ${totals.callouts} callouts, ${totals.visualizations} visualization routes, ` +
    `${totals.assets} patent-linked assets, and ${totals.withheldAssets} explicitly withheld upstream crops ` +
    `(${allBundledAssetPaths.length} total bundled assets) to ${output.pathname}`,
);
