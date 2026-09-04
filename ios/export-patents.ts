import { createHash } from "node:crypto";
import { ALL_COLORIZED_EQUATIONS } from "../src/data/colorizedEquations";
import { ARCHIVAL_PARALLEL_READINGS } from "../src/data/editions/parallelReadings";
import { evaluateArchivalPublicationState } from "../src/data/editions/publicationApproval";
import { allPatents } from "../src/data/patents/index";
import { PATENT_PHYSICS_REGISTRY } from "../src/physics/telemetryData";
import type { Patent } from "../src/types/patent";
import {
  parseSourceVisualizationRoutes,
  type SourceVisualizationRoute,
} from "./native-visualization-routes";

async function sourceVisualizationRoutes(): Promise<Map<string, SourceVisualizationRoute>> {
  const source = await Bun.file(
    new URL("../src/components/patents/visuals/index.tsx", import.meta.url),
  ).text();
  return parseSourceVisualizationRoutes(source);
}

const visualizationRoutes = await sourceVisualizationRoutes();
const sourceBoundedPatentIds = new Set<string>();
for (const [patentId, route] of visualizationRoutes) {
  if (route.kind === "source-bound-pdf-only") sourceBoundedPatentIds.add(patentId);
}

const patentAssetGlob = new Bun.Glob("**/*.{png,txt}");
const allPatentAssetPaths = [
  ...patentAssetGlob.scanSync({
    cwd: new URL("../public/patents", import.meta.url).pathname,
    onlyFiles: true,
  }),
]
  .map((path) => `patents/${path}`)
  .sort();
const allBundledAssetPaths = allPatentAssetPaths.filter(
  (path) => ![...sourceBoundedPatentIds].some((patentId) => path.includes(patentId)),
);
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

async function pinnedPdfSha256For(patent: Patent): Promise<string | undefined> {
  if (patent.originalTextAsset?.sourcePdfSha256) return undefined;
  const pdf = Bun.file(new URL(`../public${patent.originalPdfUrl}`, import.meta.url));
  if (!(await pdf.exists())) {
    throw new Error(`${patent.id}: pinned source PDF is unavailable for native export`);
  }
  return createHash("sha256")
    .update(new Uint8Array(await pdf.arrayBuffer()))
    .digest("hex");
}

const exported = await Promise.all(
  allPatents.map(async (patent) => {
    const sourceVisualization = visualizationRoutes.get(patent.id);
    if (!sourceVisualization) {
      throw new Error(`Missing source visualization route for: ${patent.id}`);
    }
    const isSourceBounded = sourceVisualization.kind === "source-bound-pdf-only";
    const editionAssets = isSourceBounded ? [] : referencedEditionAssets(patent.archivalEdition);
    const availableEditionAssets = editionAssets.filter((path) => bundledAssetSet.has(path));
    const withheldAssets = editionAssets.filter((path) => !bundledAssetSet.has(path));
    const physics = PATENT_PHYSICS_REGISTRY[patent.id];
    const publication = evaluateArchivalPublicationState(patent);
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
      originalTextAsset: isSourceBounded ? undefined : patent.originalTextAsset,
      pinnedPdfSha256: await pinnedPdfSha256For(patent),
      archivalEdition: isSourceBounded ? undefined : patent.archivalEdition,
      archivalPublication: {
        status: publication.status,
        isPublished: publication.isPublished,
        reasonCode: publication.reasonCode,
        explanation: publication.explanation,
      },
      archivalParallelReadings: isSourceBounded
        ? {}
        : (ARCHIVAL_PARALLEL_READINGS[patent.id] ?? {}),
      plainEnglish: patent.plainEnglishExplanation,
      claims: patent.claims,
      drawings: patent.drawings,
      history: patent.historicalContext,
      tags: patent.tags ?? [],
      stats: patent.stats,
      equations: equationsFor(patent.id),
      physics: isSourceBounded && physics ? { ...physics, controls: [] } : physics,
      sourceVisualization,
      bundledAssets: isSourceBounded
        ? []
        : [
            ...new Set([
              ...availableEditionAssets,
              ...allBundledAssetPaths.filter((path) => path.includes(patent.id)),
              ...(patent.originalTextAsset?.url?.startsWith("/patents/")
                ? [patent.originalTextAsset.url.slice(1)]
                : []),
            ]),
          ].sort(),
      withheldAssets: isSourceBounded ? [] : withheldAssets,
    };
  }),
);

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
    sourceBoundaries:
      sum.sourceBoundaries + (patent.sourceVisualization.kind === "source-bound-pdf-only" ? 1 : 0),
    withheldAssets: sum.withheldAssets + patent.withheldAssets.length,
  }),
  {
    editions: 0,
    equations: 0,
    drawings: 0,
    callouts: 0,
    assets: 0,
    visualizations: 0,
    sourceBoundaries: 0,
    withheldAssets: 0,
  },
);
console.log(
  `Exported ${exported.length} patents, ${totals.editions} editions, ${totals.equations} equations, ` +
    `${totals.drawings} drawings, ${totals.callouts} callouts, ${totals.visualizations} visualization routes, ` +
    `${totals.sourceBoundaries} PDF-only source boundaries, ${totals.assets} patent-linked assets, and ` +
    `${totals.withheldAssets} explicitly withheld upstream crops ` +
    `(${allBundledAssetPaths.length} total bundled assets) to ${output.pathname}`,
);
