import { allPatents } from "../src/data/patents/index";
import { ALL_COLORIZED_EQUATIONS } from "../src/data/colorizedEquations";
import { ARCHIVAL_PARALLEL_READINGS } from "../src/data/editions/parallelReadings";
import { PATENT_PHYSICS_REGISTRY } from "../src/physics/telemetryData";

type ExportedPatent = Record<string, any> & { id: string };

const failures: string[] = [];
const requireVisualParity = process.argv.includes("--require-visual-parity");
const assert = (condition: unknown, message: string) => {
  if (!condition) failures.push(message);
};
const same = (actual: unknown, expected: unknown, label: string) => {
  assert(JSON.stringify(actual) === JSON.stringify(expected), label);
};

// Keep the native TeX renderer honest. Its fallback deliberately remains
// readable for defensive runtime behavior, but every alphabetic TeX command
// in the shipped corpus must have an explicit native interpretation here.
const supportedTeXCommands = new Set([
  "Delta", "Gamma", "Lambda", "Omega", "Phi", "Pi", "Psi", "Rightarrow", "Sigma", "Theta",
  "alpha", "approx", "bar", "begin", "beta", "cap", "cdot", "circ", "cos", "ddot", "delta",
  "dot", "dots", "downarrow", "ell", "end", "epsilon", "eta", "exp", "frac", "gamma", "ge",
  "gg", "hat", "implies", "in", "infty", "int", "kappa", "lambda", "le", "left", "leftarrow",
  "leq", "lesssim", "lfloor", "ln", "log", "longrightarrow", "mathbf", "mathcal", "mathrm", "mbox", "min",
  "mu", "nabla", "nu", "oint", "omega", "partial", "perp", "phi", "pi", "pm", "pmod", "prime",
  "prod", "propto", "psi", "qquad", "quad", "rfloor", "rho", "right", "rightarrow",
  "rightleftharpoons", "sigma", "sim", "sin", "sqrt", "sum", "tan", "tau", "text", "textcolor",
  "theta", "times", "to", "uparrow", "varepsilon", "vec", "xi", "xrightarrow", "zeta",
]);

const collectTeXCommands = (value: unknown, commands = new Set<string>()): Set<string> => {
  if (typeof value === "string") {
    for (const match of value.matchAll(/\\([A-Za-z]+)/g)) commands.add(match[1]);
  } else if (Array.isArray(value)) {
    for (const child of value) collectTeXCommands(child, commands);
  } else if (value && typeof value === "object") {
    for (const child of Object.values(value)) collectTeXCommands(child, commands);
  }
  return commands;
};

const resourceURL = new URL("./Resources/patents.json", import.meta.url);
const records = (await Bun.file(resourceURL).json()) as ExportedPatent[];
for (const command of collectTeXCommands(records)) {
  assert(supportedTeXCommands.has(command), `native equation renderer does not support \\${command}`);
}
const byId = new Map(records.map((record) => [record.id, record]));
assert(records.length === allPatents.length, `record count ${records.length} != ${allPatents.length}`);
assert(byId.size === records.length, "bundled patent ids are not unique");
assert(
  records.every((record) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.id)),
  "a bundled patent id is unsafe for native cache paths",
);
assert(
  new Set(records.map((record) => record.patentNumber)).size === records.length,
  "bundled patent numbers are not unique",
);
same(records.map((record) => record.id), allPatents.map((patent) => patent.id), "patent order or ids drifted");

const projectConfiguration = await Bun.file(
  new URL("./project.yml", import.meta.url),
).text();
assert(
  /excludes:\s*[\s\S]*PatentDetailView\.swift/.test(projectConfiguration),
  "the superseded external-link PatentDetailView must stay excluded from the native target",
);

const equationsFor = (patentId: string) => {
  const published = ALL_COLORIZED_EQUATIONS[patentId] ?? [];
  return published.length > 0
    ? published
    : (ALL_COLORIZED_EQUATIONS[`_legacy-unpublished-${patentId}`] ?? []);
};

const referencedEditionAssets = (value: unknown): string[] => {
  const assets = new Set<string>();
  const visit = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(visit);
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
};

for (const patent of allPatents) {
  const record = byId.get(patent.id);
  if (!record) {
    failures.push(`missing patent ${patent.id}`);
    continue;
  }
  same(record.originalText, patent.originalText, `${patent.id}: original text drifted`);
  same(record.originalTextAsset, patent.originalTextAsset, `${patent.id}: text provenance drifted`);
  same(record.archivalEdition, patent.archivalEdition, `${patent.id}: archival edition drifted`);
  same(
    record.archivalParallelReadings,
    ARCHIVAL_PARALLEL_READINGS[patent.id] ?? {},
    `${patent.id}: parallel readings drifted`,
  );
  same(record.plainEnglish, patent.plainEnglishExplanation, `${patent.id}: explanation drifted`);
  same(record.claims, patent.claims, `${patent.id}: claims drifted`);
  same(record.drawings, patent.drawings, `${patent.id}: drawings drifted`);
  same(record.history, patent.historicalContext, `${patent.id}: history drifted`);
  same(record.stats, patent.stats, `${patent.id}: stats drifted`);
  same(record.equations, equationsFor(patent.id), `${patent.id}: equations drifted`);
  same(record.physics, PATENT_PHYSICS_REGISTRY[patent.id], `${patent.id}: physics drifted`);
  assert(
    record.originalPdfURL === `https://classic-patents.com${patent.originalPdfUrl}`,
    `${patent.id}: PDF URL is not the canonical first-party URL`,
  );
  assert(
    /^[0-9a-f]{64}$/i.test(record.originalTextAsset?.sourcePdfSha256 ?? ""),
    `${patent.id}: canonical PDF SHA-256 is missing or malformed`,
  );
  assert(record.sourceVisualization?.spatialComponent, `${patent.id}: missing spatial visualization route`);
  assert(record.sourceVisualization?.vectorComponent, `${patent.id}: missing vector visualization route`);

  const claimNumbers = record.claims.map((claim: { number: number }) => claim.number);
  const claimNumberSet = new Set(claimNumbers);
  assert(claimNumberSet.size === claimNumbers.length, `${patent.id}: duplicate claim number`);
  for (const claim of record.claims) {
    assert(Number.isInteger(claim.number) && claim.number > 0, `${patent.id}: invalid claim number ${claim.number}`);
    for (const dependency of claim.dependsOn ?? []) {
      assert(
        claimNumberSet.has(dependency) && dependency !== claim.number,
        `${patent.id}/claim-${claim.number}: invalid dependency ${dependency}`,
      );
    }
  }
  if (record.stats) {
    assert(record.stats.totalClaims === record.claims.length, `${patent.id}: total-claim statistic drifted`);
    assert(
      record.stats.independentClaims === record.claims.filter((claim: { isIndependent: boolean }) => claim.isIndependent).length,
      `${patent.id}: independent-claim statistic drifted`,
    );
  }

  const drawingIDs = record.drawings.map((drawing: { figureNumber: string }) => drawing.figureNumber);
  assert(new Set(drawingIDs).size === drawingIDs.length, `${patent.id}: duplicate drawing figure number`);
  for (const drawing of record.drawings) {
    const calloutIDs = drawing.callouts.map((callout: { id: string }) => callout.id);
    assert(new Set(calloutIDs).size === calloutIDs.length, `${patent.id}/${drawing.figureNumber}: duplicate callout id`);
    for (const callout of drawing.callouts) {
      assert(
        Number.isFinite(callout.x) && Number.isFinite(callout.y)
          && 0 <= callout.x && callout.x <= 100
          && 0 <= callout.y && callout.y <= 100,
        `${patent.id}/${drawing.figureNumber}/${callout.id}: invalid callout coordinate`,
      );
    }
  }

  const equationIDs = record.equations.map((equation: { id: string }) => equation.id);
  assert(new Set(equationIDs).size === equationIDs.length, `${patent.id}: duplicate equation id`);
  for (const equation of record.equations) {
    assert(equation.patentId === patent.id, `${patent.id}/${equation.id}: equation patent id drifted`);
    const variableIDs = new Set(equation.variables.map((variable: { id: string }) => variable.id));
    assert(variableIDs.size === equation.variables.length, `${patent.id}/${equation.id}: duplicate equation variable id`);
    for (const fragment of equation.plainEnglishSentence) {
      assert(
        fragment.variableId == null || variableIDs.has(fragment.variableId),
        `${patent.id}/${equation.id}: sentence references unknown variable ${fragment.variableId}`,
      );
    }
    assert(
      equation.claimRef == null || claimNumberSet.has(equation.claimRef),
      `${patent.id}/${equation.id}: equation references unknown claim ${equation.claimRef}`,
    );
  }

  if (record.physics) {
    const controlIDs = record.physics.controls.map((control: { id: string }) => control.id);
    assert(new Set(controlIDs).size === controlIDs.length, `${patent.id}: duplicate physics control id`);
    for (const control of record.physics.controls) {
      assert(
        Number.isFinite(control.min) && Number.isFinite(control.max)
          && Number.isFinite(control.step) && Number.isFinite(control.defaultValue)
          && control.min <= control.defaultValue && control.defaultValue <= control.max
          && control.step > 0,
        `${patent.id}/${control.id}: invalid physics control contract`,
      );
    }
  }
}

const publicRoot = new URL("../public/patents", import.meta.url).pathname;
const assetGlob = new Bun.Glob("**/*.{png,txt}");
const sourceAssets = [...assetGlob.scanSync({ cwd: publicRoot, onlyFiles: true })]
  .map((path) => `patents/${path}`)
  .sort();
const manifest = (await Bun.file(new URL("./Resources/patent-assets.json", import.meta.url)).json()) as string[];
const manifestSet = new Set(manifest);
same(manifest, sourceAssets, "bundled non-PDF asset manifest drifted");
assert(!manifest.some((path) => path.toLowerCase().endsWith(".pdf")), "a PDF was bundled into the app");
for (const record of records) {
  const sourcePatent = allPatents.find((patent) => patent.id === record.id);
  const editionAssets = referencedEditionAssets(sourcePatent?.archivalEdition);
  const expectedWithheld = editionAssets.filter((path) => !manifestSet.has(path));
  const expectedBundled = [
    ...new Set([
      ...editionAssets.filter((path) => manifestSet.has(path)),
      ...sourceAssets.filter((path) => path.includes(record.id)),
      ...(sourcePatent?.originalTextAsset?.url?.startsWith("/patents/")
        ? [sourcePatent.originalTextAsset.url.slice(1)]
        : []),
    ]),
  ].sort();
  same(record.bundledAssets, expectedBundled, `${record.id}: bundled asset ledger drifted`);
  same(record.withheldAssets, expectedWithheld, `${record.id}: withheld asset ledger drifted`);
  for (const path of record.bundledAssets ?? []) {
    assert(manifest.includes(path), `${record.id}: linked asset is absent from the bundle manifest: ${path}`);
  }
  for (const path of record.withheldAssets ?? []) {
    assert(!manifest.includes(path), `${record.id}: an available asset is incorrectly marked withheld: ${path}`);
    assert(
      record.archivalEdition?.completeFacsimileReviewed !== true,
      `${record.id}: an approved edition references a missing source asset: ${path}`,
    );
  }
}

const visualDispatcher = await Bun.file(
  new URL("../src/components/patents/visuals/index.tsx", import.meta.url),
).text();
for (const record of records) {
  assert(
    visualDispatcher.includes(`<${record.sourceVisualization.spatialComponent}`),
    `${record.id}: spatial component no longer exists`,
  );
  assert(
    visualDispatcher.includes(`<${record.sourceVisualization.vectorComponent}`),
    `${record.id}: vector component no longer exists`,
  );
}

const swiftGlob = new Bun.Glob("Sources/**/*.swift");
const swiftSources = [...swiftGlob.scanSync({ cwd: new URL(".", import.meta.url).pathname, onlyFiles: true })];
let urlSessionFiles = 0;
for (const path of swiftSources) {
  const source = await Bun.file(new URL(path, new URL(".", import.meta.url))).text();
  assert(!/\b(?:import WebKit|WKWebView)\b/.test(source), `${path}: WebKit is forbidden`);
  if (path !== "Sources/PatentDetailView.swift") {
    assert(!/(^|[^A-Za-z0-9_])Link\s*\(/m.test(source), `${path}: direct external Link is forbidden`);
  }
  if (source.includes("URLSession")) {
    urlSessionFiles += 1;
    assert(path === "Sources/PatentPDFReader.swift", `${path}: unexpected network access`);
  }
}
assert(urlSessionFiles === 1, `expected one native network boundary, found ${urlSessionFiles}`);

const pdfReaderSource = await Bun.file(
  new URL("./Sources/PatentPDFReader.swift", import.meta.url),
).text();
assert(
  pdfReaderSource.includes("SHA256()") && pdfReaderSource.includes("expectedSHA256"),
  "native PDF cache/download path is not bound to the bundled source digest",
);
assert(
  pdfReaderSource.includes("url.port == nil || url.port == 443"),
  "native PDF network boundary permits a non-standard HTTPS service",
);
assert(
  pdfReaderSource.includes("activeRequestToken")
    && pdfReaderSource.includes(".task(id: patent.id)"),
  "native PDF reader can publish stale state after switching patents",
);

const figureResolverSource = await Bun.file(
  new URL("./Sources/PatentFigureAtlasView.swift", import.meta.url),
).text();
assert(
  figureResolverSource.includes("guard !hasWithheldReviewedCrop(token: token, in: patent) else { return nil }"),
  "native figure resolver can bypass a withheld reviewed crop through a bundled alias",
);
assert(
  figureResolverSource.includes("static func markerText(for callout:")
    && figureResolverSource.includes("static func displayTitle(for callout:"),
  "native figure callouts do not normalize the source corpus' two historical field conventions",
);

// Content parity and visualization parity are separate acceptance surfaces.
// An animated source plate preserves evidence, but it is not the same thing as
// translating both source visualization components into a native mechanism.
const bespokeNativeVisuals = new Set([
  "gb-913-watt-separate-condenser",
  "gb-931-arkwright-water-frame",
  "us-381968-tesla-motor",
  "us-4136359-wozniak-apple",
]);
for (const id of bespokeNativeVisuals) {
  assert(byId.has(id), `native visualization coverage names unknown patent ${id}`);
}
const nativeVisualizationSource = await Bun.file(
  new URL("./Sources/PatentVisualizationView.swift", import.meta.url),
).text();
assert(
  nativeVisualizationSource.includes("drawArkwrightWaterFrame")
    && nativeVisualizationSource.includes('"gb-931-arkwright-water-frame"'),
  "Arkwright is counted as bespoke without a native Water Frame mechanism",
);
if (requireVisualParity) {
  for (const record of records) {
    assert(bespokeNativeVisuals.has(record.id), `${record.id}: bespoke native visualization is not implemented`);
  }
}

if (failures.length > 0) {
  console.error(`Native parity failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

const totals = records.reduce(
  (sum, patent) => ({
    editions: sum.editions + (patent.archivalEdition ? 1 : 0),
    equations: sum.equations + patent.equations.length,
    claims: sum.claims + patent.claims.length,
    drawings: sum.drawings + patent.drawings.length,
    callouts: sum.callouts + patent.drawings.reduce(
      (count: number, drawing: { callouts: unknown[] }) => count + drawing.callouts.length,
      0,
    ),
    withheldAssets: sum.withheldAssets + patent.withheldAssets.length,
  }),
  { editions: 0, equations: 0, claims: 0, drawings: 0, callouts: 0, withheldAssets: 0 },
);
console.log(
  `Native content/export parity green: ${records.length} patents, ${totals.editions} editions, ` +
    `${totals.claims} claims, ${totals.equations} equations, ${totals.drawings} drawings, ` +
    `${totals.callouts} callouts, ${records.length} source visualization pairs, ` +
    `${manifest.length} bundled non-PDF assets, ${totals.withheldAssets} explicitly gated source crops, ` +
    `one first-party PDF network boundary. Bespoke native mechanism parity: ` +
    `${bespokeNativeVisuals.size}/${records.length}; the remaining records use an explicitly identified source-plate fallback.`,
);
