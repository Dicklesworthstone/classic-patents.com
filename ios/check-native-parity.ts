import { createHash } from "node:crypto";
import { ALL_COLORIZED_EQUATIONS } from "../src/data/colorizedEquations";
import { ARCHIVAL_PARALLEL_READINGS } from "../src/data/editions/parallelReadings";
import { evaluateArchivalPublicationState } from "../src/data/editions/publicationApproval";
import { allPatents } from "../src/data/patents/index";
import { PATENT_PHYSICS_REGISTRY } from "../src/physics/telemetryData";

type ExportedPatent = Record<string, any> & { id: string };

const KWOLEK_ID = "us-3671542-kwolek-kevlar";
const isSourceBoundPDFOnly = (record: ExportedPatent): boolean =>
  record.sourceVisualization?.kind === "source-bound-pdf-only";
const sha256 = async (file: Bun.BunFile): Promise<string> =>
  createHash("sha256")
    .update(new Uint8Array(await file.arrayBuffer()))
    .digest("hex");

const failures: string[] = [];
const requireVisualParity = process.argv.includes("--require-visual-parity");
const requireKwolekSourceBoundary = process.argv.includes("--kwolek-source-boundary");
const isNullish = (value: unknown): value is null | undefined =>
  value === null || value === undefined;
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
  "Delta",
  "Gamma",
  "Lambda",
  "Longleftrightarrow",
  "Omega",
  "Phi",
  "Pi",
  "Psi",
  "Rightarrow",
  "Sigma",
  "Theta",
  "alpha",
  "approx",
  "bar",
  "begin",
  "beta",
  "bigl",
  "bigr",
  "bmod",
  "boldsymbol",
  "cap",
  "cdot",
  "circ",
  "cos",
  "cot",
  "ddot",
  "delta",
  "dot",
  "dots",
  "downarrow",
  "dashv",
  "ell",
  "end",
  "epsilon",
  "eta",
  "exp",
  "frac",
  "gamma",
  "ge",
  "geq",
  "gg",
  "hat",
  "hookrightarrow",
  "implies",
  "in",
  "infty",
  "int",
  "kappa",
  "lambda",
  "land",
  "le",
  "left",
  "leftarrow",
  "leq",
  "lesssim",
  "lfloor",
  "lVert",
  "ll",
  "ln",
  "log",
  "longrightarrow",
  "ldots",
  "mathbb",
  "mathbf",
  "mathcal",
  "mathrm",
  "mbox",
  "min",
  "mu",
  "nabla",
  "neg",
  "nu",
  "oint",
  "omega",
  "operatorname",
  "partial",
  "perp",
  "phi",
  "pi",
  "pm",
  "pmod",
  "prime",
  "prod",
  "propto",
  "psi",
  "qquad",
  "quad",
  "rfloor",
  "rVert",
  "rho",
  "right",
  "rightarrow",
  "rightleftharpoons",
  "sigma",
  "sim",
  "sin",
  "sqrt",
  "sum",
  "subset",
  "tan",
  "tau",
  "text",
  "textcolor",
  "theta",
  "times",
  "to",
  "uparrow",
  "varnothing",
  "varepsilon",
  "vec",
  "wedge",
  "xi",
  "xrightarrow",
  "zeta",
  "arcsin",
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

// This deliberately narrow mode proves the native publication boundary for a
// source-bounded record without claiming that every evolving catalogue record
// has already received a native USDZ export. The normal command below remains
// the full-corpus parity gate.
if (requireKwolekSourceBoundary) {
  const focusedFailures: string[] = [];
  const assertFocused = (condition: unknown, message: string) => {
    if (!condition) focusedFailures.push(message);
  };
  const sameFocused = (actual: unknown, expected: unknown, message: string) => {
    assertFocused(JSON.stringify(actual) === JSON.stringify(expected), message);
  };
  const publicKwolek = allPatents.find((patent) => patent.id === KWOLEK_ID);
  const nativeKwolek = records.find((record) => record.id === KWOLEK_ID);

  assertFocused(publicKwolek !== undefined, "the public Kwolek record is absent");
  assertFocused(nativeKwolek !== undefined, "the native Kwolek record is absent");
  assertFocused(
    publicKwolek?.originalTextAsset === undefined && publicKwolek?.archivalEdition === undefined,
    "public Kwolek reintroduced a reviewed transcript or archival edition",
  );
  assertFocused(
    publicKwolek?.drawings.length === 0,
    "public Kwolek reintroduced an active source drawing or model claim",
  );
  const publicKwolekPhysics = PATENT_PHYSICS_REGISTRY[KWOLEK_ID];
  assertFocused(
    publicKwolekPhysics?.controls.length === 0 &&
      publicKwolekPhysics.engineMethod.includes("model withheld"),
    "public Kwolek exposes controls",
  );
  const publicClaimStates = publicKwolekPhysics?.computeMetrics({}) ?? [];
  assertFocused(
    publicClaimStates.map((metric) => metric.label).join("|") === "Claim 1|Claim 2|Visual Model" &&
      publicClaimStates.every(
        (metric) =>
          metric.provenance === "source-disclosed" || metric.provenance === "refusal-bounded",
      ),
    "public Kwolek reintroduced a quantitative or performance metric",
  );

  if (nativeKwolek) {
    assertFocused(
      nativeKwolek.sourceVisualization?.kind === "source-bound-pdf-only",
      "native Kwolek is not source-bound PDF-only",
    );
    assertFocused(
      nativeKwolek.originalTextAsset === undefined && nativeKwolek.archivalEdition === undefined,
      "native Kwolek ships a transcript or archival edition",
    );
    sameFocused(
      nativeKwolek.archivalParallelReadings,
      {},
      "native Kwolek ships archival parallel readings",
    );
    assertFocused(
      Array.isArray(nativeKwolek.physics?.controls) && nativeKwolek.physics.controls.length === 0,
      "native Kwolek exposes controls",
    );
    assertFocused(
      nativeKwolek.physics?.metrics === undefined &&
        nativeKwolek.physics?.computeMetrics === undefined,
      "native Kwolek exposes invented quantitative metrics",
    );
    assertFocused(
      nativeKwolek.sourceVisualization?.spatialComponent === undefined &&
        nativeKwolek.sourceVisualization?.vectorComponent === undefined,
      "native Kwolek leaks legacy visualization component names",
    );
    assertFocused(
      nativeKwolek.bundledAssets?.length === 0 && nativeKwolek.withheldAssets?.length === 0,
      "native Kwolek ships or inventories withheld legacy public assets",
    );
  }

  const kwolekPdf = Bun.file(new URL(`../public/patents/pdfs/${KWOLEK_ID}.pdf`, import.meta.url));
  assertFocused(await kwolekPdf.exists(), "the pinned Kwolek facsimile is missing");
  if (nativeKwolek && (await kwolekPdf.exists())) {
    sameFocused(
      nativeKwolek.pinnedPdfSha256,
      await sha256(kwolekPdf),
      "native Kwolek pinned-PDF digest drifted",
    );
  }

  const assetManifest = (await Bun.file(
    new URL("./Resources/patent-assets.json", import.meta.url),
  ).json()) as string[];
  assertFocused(
    !assetManifest.some((path) => path.includes(KWOLEK_ID)),
    "Kwolek public source assets leaked into the native asset manifest",
  );

  type FocusedNativeVisualization = {
    id: string;
    kind?: string;
    asset: string | null;
    builder: string;
    spatialComponent?: string;
    vectorComponent?: string;
    meshCount: number;
    namedNodeCount: number;
    sourceBoundary?: string;
  };
  const nativeVisualizations = (await Bun.file(
    new URL("./Resources/native-visualizations.json", import.meta.url),
  ).json()) as FocusedNativeVisualization[];
  const kwolekExhibits = nativeVisualizations.filter((entry) => entry.id === KWOLEK_ID);
  assertFocused(kwolekExhibits.length === 1, "Kwolek native exhibit is not uniquely registered");
  const nativeExhibit = kwolekExhibits[0];
  assertFocused(
    nativeExhibit?.kind === "source-bound-pdf-only" &&
      nativeExhibit.asset === null &&
      nativeExhibit.builder === "source-bound:pdf-only" &&
      nativeExhibit.meshCount === 0 &&
      nativeExhibit.namedNodeCount === 0 &&
      nativeExhibit.spatialComponent === undefined &&
      nativeExhibit.vectorComponent === undefined,
    "Kwolek native manifest leaks a USDZ asset, geometry, or legacy component",
  );
  assertFocused(
    nativeExhibit?.sourceBoundary?.includes("pinned facsimile") === true,
    "Kwolek native manifest omits the facsimile boundary explanation",
  );

  const projectConfiguration = await Bun.file(new URL("./project.yml", import.meta.url)).text();
  assertFocused(
    projectConfiguration.includes(`NativeModels/${KWOLEK_ID}.usdz`) &&
      projectConfiguration.includes(`--exclude='figures/${KWOLEK_ID}/'`) &&
      projectConfiguration.includes(`--exclude='source-text/${KWOLEK_ID}.txt'`) &&
      projectConfiguration.includes(`--exclude='transcripts/${KWOLEK_ID}.txt'`) &&
      projectConfiguration.includes(`--exclude='transcripts/${KWOLEK_ID}-reviewed.txt'`),
    "the native project still copies a Kwolek legacy model or source artifact",
  );
  const nativeProject = await Bun.file(
    new URL("./FrankenPatents.xcodeproj/project.pbxproj", import.meta.url),
  ).text();
  assertFocused(
    !nativeProject.includes(`${KWOLEK_ID}.usdz`),
    "the checked-in Xcode project still references the Kwolek USDZ",
  );
  const preservedLegacyFiles = [
    Bun.file(new URL(`./Resources/NativeModels/${KWOLEK_ID}.usdz`, import.meta.url)),
    Bun.file(new URL(`../public/patents/source-text/${KWOLEK_ID}.txt`, import.meta.url)),
    Bun.file(new URL(`../public/patents/transcripts/${KWOLEK_ID}.txt`, import.meta.url)),
  ];
  for (const legacyFile of preservedLegacyFiles) {
    assertFocused(
      await legacyFile.exists(),
      `a preserved Kwolek legacy file is missing: ${legacyFile.name}`,
    );
  }

  const [
    webDispatcherSource,
    visualizationSource,
    documentSource,
    librarySource,
    modelExporterSource,
  ] = await Promise.all([
    Bun.file(new URL("../src/components/patents/visuals/index.tsx", import.meta.url)).text(),
    Bun.file(new URL("./Sources/PatentVisualizationView.swift", import.meta.url)).text(),
    Bun.file(new URL("./Sources/NativeDocumentKit.swift", import.meta.url)).text(),
    Bun.file(new URL("./Sources/PatentLibrary.swift", import.meta.url)).text(),
    Bun.file(new URL("./export-native-models.ts", import.meta.url)).text(),
  ]);
  const kwolekCaseStart = webDispatcherSource.indexOf(`case "${KWOLEK_ID}":`);
  const kwolekCaseEnd = webDispatcherSource.indexOf("case ", kwolekCaseStart + 1);
  const kwolekDispatcherCase = webDispatcherSource.slice(
    kwolekCaseStart,
    kwolekCaseEnd < 0 ? undefined : kwolekCaseEnd,
  );
  assertFocused(
    kwolekCaseStart >= 0 &&
      kwolekDispatcherCase.includes("<SourceVisualUnavailable") &&
      !kwolekDispatcherCase.includes("KwolekKevlar3D") &&
      !kwolekDispatcherCase.includes("KwolekKevlarSim"),
    "public Kwolek dispatcher still activates a legacy 2D or 3D model",
  );
  assertFocused(
    visualizationSource.includes("NativePDFOnlySourceBoundaryExhibit") &&
      visualizationSource.includes("if isSourceBoundPDFOnly"),
    "native visualization UI cannot render the PDF-only boundary",
  );
  assertFocused(
    documentSource.includes("PDFOnlySourceReader") &&
      documentSource.includes("else if patent.originalTextAsset != nil"),
    "native source reader can misrepresent Kwolek as a bundled edition",
  );
  assertFocused(
    librarySource.includes("case .sourceBoundPDFOnly") &&
      librarySource.includes("is not PDF-only in the native bundle"),
    "native record validation does not enforce the Kwolek boundary",
  );
  assertFocused(
    modelExporterSource.includes('includes("--manifest-only")') &&
      modelExporterSource.includes("nativeModelDigestsBefore") &&
      modelExporterSource.includes("sourceBoundManifestEntry") &&
      modelExporterSource.includes("Manifest-only export altered a preserved native USDZ asset"),
    "the scoped native manifest exporter no longer proves USDZ preservation",
  );

  if (focusedFailures.length > 0) {
    console.error(
      `Kwolek source-bound native parity failed (${focusedFailures.length}):\n- ${focusedFailures.join("\n- ")}`,
    );
    process.exit(1);
  }
  console.log(
    "Kwolek source-bound native parity green: facsimile-only route, no edition/transcript/assets/controls/metrics/USDZ, and preserved legacy files.",
  );
  process.exit(0);
}

const corpusTeXCommands = collectTeXCommands(records);
for (const command of corpusTeXCommands) {
  assert(
    supportedTeXCommands.has(command),
    `native equation renderer does not support \\${command}`,
  );
}
const nativeMathSource = await Bun.file(
  new URL("./Sources/NativeMathView.swift", import.meta.url),
).text();
const nativeFormatterSource = await Bun.file(
  new URL("./Sources/NativeDocumentKit.swift", import.meta.url),
).text();
for (const command of corpusTeXCommands) {
  if (["begin", "end"].includes(command)) continue;
  assert(
    nativeMathSource.includes(`"${command}"`),
    `native equation layout has no explicit implementation for \\${command}`,
  );
  assert(
    nativeFormatterSource.includes(`\\\\${command}`),
    `native equation accessibility formatter has no explicit implementation for \\${command}`,
  );
}
const supportedEditionBlocks = new Set([
  "masthead",
  "heading",
  "paragraph",
  "claim",
  "figure-sheet",
  "table",
  "equation",
]);
const supportedEditionInlines = new Set(["text", "emphasis", "small-caps", "term", "reference"]);
for (const record of records) {
  for (const block of record.archivalEdition?.blocks ?? []) {
    assert(
      supportedEditionBlocks.has(block.kind),
      `${record.id}: native edition reader does not render ${block.kind}`,
    );
    const visitInlines = (value: unknown) => {
      if (Array.isArray(value)) {
        for (const child of value) visitInlines(child);
      } else if (value && typeof value === "object") {
        const object = value as Record<string, unknown>;
        if (typeof object.kind === "string" && typeof object.text === "string") {
          assert(
            supportedEditionInlines.has(object.kind),
            `${record.id}: native edition reader does not render inline ${object.kind}`,
          );
        }
        for (const child of Object.values(object)) visitInlines(child);
      }
    };
    for (const value of [block.inlines, block.description, block.headers, block.rows]) {
      visitInlines(value);
    }
  }
}
const byId = new Map(records.map((record) => [record.id, record]));
assert(
  records.length === allPatents.length,
  `record count ${records.length} != ${allPatents.length}`,
);
assert(byId.size === records.length, "bundled patent ids are not unique");
assert(
  records.every((record) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.id)),
  "a bundled patent id is unsafe for native cache paths",
);
assert(
  new Set(records.map((record) => record.patentNumber)).size === records.length,
  "bundled patent numbers are not unique",
);
same(
  records.map((record) => record.id),
  allPatents.map((patent) => patent.id),
  "patent order or ids drifted",
);

const projectConfiguration = await Bun.file(new URL("./project.yml", import.meta.url)).text();
assert(
  /excludes:\s*[\s\S]*PatentDetailView\.swift/.test(projectConfiguration),
  "the superseded external-link PatentDetailView must stay excluded from the native target",
);
assert(
  projectConfiguration.includes(`NativeModels/${KWOLEK_ID}.usdz`),
  "the preserved Kwolek USDZ is not excluded from the native resource target",
);
for (const excludedKwolekSourcePath of [
  `figures/${KWOLEK_ID}/`,
  `source-text/${KWOLEK_ID}.txt`,
  `transcripts/${KWOLEK_ID}.txt`,
  `transcripts/${KWOLEK_ID}-reviewed.txt`,
]) {
  assert(
    projectConfiguration.includes(`--exclude='${excludedKwolekSourcePath}'`),
    `the Kwolek source-bound build copy does not exclude ${excludedKwolekSourcePath}`,
  );
}
const generatedProject = await Bun.file(
  new URL("./FrankenPatents.xcodeproj/project.pbxproj", import.meta.url),
).text();
assert(
  !generatedProject.includes(`${KWOLEK_ID}.usdz`),
  "the Kwolek USDZ is still included by the checked-in native project",
);
const preservedKwolekUSDZ = Bun.file(
  new URL(`./Resources/NativeModels/${KWOLEK_ID}.usdz`, import.meta.url),
);
assert(await preservedKwolekUSDZ.exists(), "the preserved legacy Kwolek USDZ was deleted");

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
  const sourceBounded = isSourceBoundPDFOnly(record);
  same(record.originalText, patent.originalText, `${patent.id}: original text drifted`);
  if (sourceBounded) {
    assert(
      record.originalTextAsset === undefined,
      `${patent.id}: source-bound record ships a transcript`,
    );
    assert(
      record.archivalEdition === undefined,
      `${patent.id}: source-bound record ships an archival edition`,
    );
    same(
      record.archivalParallelReadings,
      {},
      `${patent.id}: source-bound record ships parallel readings`,
    );
    assert(
      Array.isArray(record.physics?.controls) && record.physics.controls.length === 0,
      `${patent.id}: source-bound record ships native controls`,
    );
  } else {
    same(
      record.originalTextAsset,
      patent.originalTextAsset,
      `${patent.id}: text provenance drifted`,
    );
    same(record.archivalEdition, patent.archivalEdition, `${patent.id}: archival edition drifted`);
    same(
      record.archivalParallelReadings,
      ARCHIVAL_PARALLEL_READINGS[patent.id] ?? {},
      `${patent.id}: parallel readings drifted`,
    );
  }
  const publication = evaluateArchivalPublicationState(patent);
  same(
    record.archivalPublication,
    {
      status: publication.status,
      isPublished: publication.isPublished,
      reasonCode: publication.reasonCode,
      explanation: publication.explanation,
    },
    `${patent.id}: archival publication state drifted`,
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
  const reconstructionQuarantined =
    record.archivalPublication?.reasonCode === "FABRICATION_OR_RECONSTRUCTION_QUARANTINE";
  assert(
    reconstructionQuarantined ||
      /^[0-9a-f]{64}$/i.test(
        sourceBounded
          ? (record.pinnedPdfSha256 ?? "")
          : (record.originalTextAsset?.sourcePdfSha256 ?? ""),
      ),
    `${patent.id}: canonical PDF SHA-256 is missing or malformed outside an explicit reconstruction quarantine`,
  );
  if (sourceBounded) {
    assert(
      typeof record.sourceVisualization?.sourceBoundary === "string" &&
        record.sourceVisualization.sourceBoundary.includes("pinned facsimile"),
      `${patent.id}: source-bound route has no facsimile explanation`,
    );
    assert(
      record.sourceVisualization?.spatialComponent === undefined &&
        record.sourceVisualization?.vectorComponent === undefined,
      `${patent.id}: source-bound route leaks a legacy visualization pair`,
    );
  } else {
    assert(
      record.sourceVisualization?.kind === "model",
      `${patent.id}: authored route is not a model route`,
    );
    assert(
      record.sourceVisualization?.spatialComponent,
      `${patent.id}: missing spatial visualization route`,
    );
    assert(
      record.sourceVisualization?.vectorComponent,
      `${patent.id}: missing vector visualization route`,
    );
  }

  const claimNumbers = record.claims.map((claim: { number: number }) => claim.number);
  const claimNumberSet = new Set(claimNumbers);
  assert(claimNumberSet.size === claimNumbers.length, `${patent.id}: duplicate claim number`);
  for (const claim of record.claims) {
    assert(
      Number.isInteger(claim.number) && claim.number > 0,
      `${patent.id}: invalid claim number ${claim.number}`,
    );
    for (const dependency of claim.dependsOn ?? []) {
      assert(
        claimNumberSet.has(dependency) && dependency !== claim.number,
        `${patent.id}/claim-${claim.number}: invalid dependency ${dependency}`,
      );
    }
  }
  if (record.stats) {
    assert(
      record.stats.totalClaims === record.claims.length,
      `${patent.id}: total-claim statistic drifted`,
    );
    assert(
      record.stats.independentClaims ===
        record.claims.filter((claim: { isIndependent: boolean }) => claim.isIndependent).length,
      `${patent.id}: independent-claim statistic drifted`,
    );
  }

  const drawingIDs = record.drawings.map(
    (drawing: { figureNumber: string }) => drawing.figureNumber,
  );
  assert(
    new Set(drawingIDs).size === drawingIDs.length,
    `${patent.id}: duplicate drawing figure number`,
  );
  for (const drawing of record.drawings) {
    const calloutIDs = drawing.callouts.map((callout: { id: string }) => callout.id);
    assert(
      new Set(calloutIDs).size === calloutIDs.length,
      `${patent.id}/${drawing.figureNumber}: duplicate callout id`,
    );
    for (const callout of drawing.callouts) {
      assert(
        Number.isFinite(callout.x) &&
          Number.isFinite(callout.y) &&
          0 <= callout.x &&
          callout.x <= 100 &&
          0 <= callout.y &&
          callout.y <= 100,
        `${patent.id}/${drawing.figureNumber}/${callout.id}: invalid callout coordinate`,
      );
    }
  }

  const equationIDs = record.equations.map((equation: { id: string }) => equation.id);
  assert(new Set(equationIDs).size === equationIDs.length, `${patent.id}: duplicate equation id`);
  for (const equation of record.equations) {
    assert(
      equation.patentId === patent.id,
      `${patent.id}/${equation.id}: equation patent id drifted`,
    );
    const variableIDs = new Set(equation.variables.map((variable: { id: string }) => variable.id));
    assert(
      variableIDs.size === equation.variables.length,
      `${patent.id}/${equation.id}: duplicate equation variable id`,
    );
    for (const fragment of equation.plainEnglishSentence) {
      assert(
        isNullish(fragment.variableId) || variableIDs.has(fragment.variableId),
        `${patent.id}/${equation.id}: sentence references unknown variable ${fragment.variableId}`,
      );
    }
    assert(
      isNullish(equation.claimRef) || claimNumberSet.has(equation.claimRef),
      `${patent.id}/${equation.id}: equation references unknown claim ${equation.claimRef}`,
    );
  }

  if (record.physics) {
    const controlIDs = record.physics.controls.map((control: { id: string }) => control.id);
    assert(
      new Set(controlIDs).size === controlIDs.length,
      `${patent.id}: duplicate physics control id`,
    );
    for (const control of record.physics.controls) {
      assert(
        Number.isFinite(control.min) &&
          Number.isFinite(control.max) &&
          Number.isFinite(control.step) &&
          Number.isFinite(control.defaultValue) &&
          control.min <= control.defaultValue &&
          control.defaultValue <= control.max &&
          control.step > 0,
        `${patent.id}/${control.id}: invalid physics control contract`,
      );
    }
  }
}

const sourceBoundedRecords = records.filter(isSourceBoundPDFOnly);
same(
  sourceBoundedRecords.map((record) => record.id),
  [KWOLEK_ID],
  "native source-bound routes drifted",
);
const publicKwolek = allPatents.find((patent) => patent.id === KWOLEK_ID);
const nativeKwolek = byId.get(KWOLEK_ID);
assert(publicKwolek !== undefined, "the public Kwolek record is absent");
assert(nativeKwolek !== undefined, "the native Kwolek record is absent");
assert(
  publicKwolek?.originalTextAsset === undefined && publicKwolek?.archivalEdition === undefined,
  "public Kwolek record reintroduced an unreviewed transcript or archival edition",
);
if (nativeKwolek) {
  assert(
    nativeKwolek.sourceVisualization?.kind === "source-bound-pdf-only",
    "native Kwolek route is not PDF-only",
  );
  assert(
    nativeKwolek.originalTextAsset === undefined,
    "native Kwolek ships a reviewed transcript claim",
  );
  assert(
    nativeKwolek.archivalEdition === undefined,
    "native Kwolek ships an archival edition claim",
  );
  same(nativeKwolek.archivalParallelReadings, {}, "native Kwolek ships archival parallel readings");
  assert(nativeKwolek.bundledAssets.length === 0, "native Kwolek ships public-patent assets");
  assert(nativeKwolek.withheldAssets.length === 0, "native Kwolek reports withheld bundled assets");
  assert(
    Array.isArray(nativeKwolek.physics?.controls) && nativeKwolek.physics.controls.length === 0,
    "native Kwolek exposes interactive controls",
  );
}
const kwolekPdf = Bun.file(new URL(`../public/patents/pdfs/${KWOLEK_ID}.pdf`, import.meta.url));
assert(await kwolekPdf.exists(), "the preserved Kwolek facsimile is missing");
if ((await kwolekPdf.exists()) && nativeKwolek) {
  same(
    nativeKwolek.pinnedPdfSha256,
    await sha256(kwolekPdf),
    "native Kwolek pinned-PDF digest drifted",
  );
}

const publicRoot = new URL("../public/patents", import.meta.url).pathname;
const assetGlob = new Bun.Glob("**/*.{png,txt}");
const sourceAssets = [...assetGlob.scanSync({ cwd: publicRoot, onlyFiles: true })]
  .map((path) => `patents/${path}`)
  .sort();
const expectedBundledSourceAssets = sourceAssets.filter(
  (path) => !sourceBoundedRecords.some((record) => path.includes(record.id)),
);
const manifest = (await Bun.file(
  new URL("./Resources/patent-assets.json", import.meta.url),
).json()) as string[];
const manifestSet = new Set(manifest);
same(manifest, expectedBundledSourceAssets, "bundled non-PDF asset manifest drifted");
assert(
  !manifest.some((path) => path.toLowerCase().endsWith(".pdf")),
  "a PDF was bundled into the app",
);
for (const record of records) {
  const sourcePatent = allPatents.find((patent) => patent.id === record.id);
  const sourceBounded = isSourceBoundPDFOnly(record);
  const editionAssets = sourceBounded ? [] : referencedEditionAssets(sourcePatent?.archivalEdition);
  const expectedWithheld = editionAssets.filter((path) => !manifestSet.has(path));
  const expectedBundled = sourceBounded
    ? []
    : [
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
    assert(
      manifest.includes(path),
      `${record.id}: linked asset is absent from the bundle manifest: ${path}`,
    );
  }
  for (const path of record.withheldAssets ?? []) {
    assert(
      !manifest.includes(path),
      `${record.id}: an available asset is incorrectly marked withheld: ${path}`,
    );
    assert(
      record.archivalEdition?.completeFacsimileReviewed !== true,
      `${record.id}: an approved edition references a missing source asset: ${path}`,
    );
  }
  if (sourceBounded) {
    assert(
      !manifest.some((path) => path.includes(record.id)),
      `${record.id}: source-bound public assets leaked into the native bundle`,
    );
  } else if (!record.archivalEdition) {
    const sourceTextPath = record.originalTextAsset?.url?.replace(/^\//, "");
    const hasCompleteBundledSourceReader =
      typeof sourceTextPath === "string" &&
      sourceTextPath.endsWith(".txt") &&
      record.bundledAssets.includes(sourceTextPath);
    assert(
      hasCompleteBundledSourceReader ||
        record.archivalPublication?.reasonCode === "FABRICATION_OR_RECONSTRUCTION_QUARANTINE",
      `${record.id}: record without an archival edition has neither a complete bundled source reader nor an explicit reconstruction quarantine`,
    );
    if (typeof sourceTextPath === "string" && manifestSet.has(sourceTextPath)) {
      const transcription = await Bun.file(
        new URL(`../public/${sourceTextPath}`, import.meta.url),
      ).text();
      // A machine text layer is page-marked `--- SOURCE PDF PAGE n OF N ---`;
      // a human-reviewed ledger uses `--- REVIEWED TRANSCRIPTION PAGE n OF N ---`.
      // The native reader pages either convention, so the parity gate counts
      // whichever marker the bundled ledger actually carries.
      const pageMarkers = Math.max(
        transcription.match(/--- SOURCE PDF PAGE /g)?.length ?? 0,
        transcription.match(/--- REVIEWED TRANSCRIPTION PAGE /g)?.length ?? 0,
      );
      assert(
        pageMarkers === record.originalTextAsset?.pageCount,
        `${record.id}: bundled source reader exposes ${pageMarkers} pages, expected ${record.originalTextAsset?.pageCount}`,
      );
    }
  }
}

const visualDispatcher = await Bun.file(
  new URL("../src/components/patents/visuals/index.tsx", import.meta.url),
).text();
for (const record of records) {
  if (isSourceBoundPDFOnly(record)) {
    assert(
      visualDispatcher.includes(`case "${record.id}":`) &&
        visualDispatcher.includes("<SourceVisualUnavailable"),
      `${record.id}: source-bound visual refusal no longer exists`,
    );
  } else {
    assert(
      visualDispatcher.includes(`<${record.sourceVisualization.spatialComponent}`),
      `${record.id}: spatial component no longer exists`,
    );
    assert(
      visualDispatcher.includes(`<${record.sourceVisualization.vectorComponent}`),
      `${record.id}: vector component no longer exists`,
    );
  }
}

const swiftGlob = new Bun.Glob("Sources/**/*.swift");
const swiftSources = [
  ...swiftGlob.scanSync({ cwd: new URL(".", import.meta.url).pathname, onlyFiles: true }),
];
let urlSessionFiles = 0;
for (const path of swiftSources) {
  const source = await Bun.file(new URL(path, new URL(".", import.meta.url))).text();
  assert(!/\b(?:import WebKit|WKWebView)\b/.test(source), `${path}: WebKit is forbidden`);
  if (path !== "Sources/PatentDetailView.swift") {
    assert(
      !/(^|[^A-Za-z0-9_])Link\s*\(/m.test(source),
      `${path}: direct external Link is forbidden`,
    );
  }
  if (source.includes("URLSession")) {
    urlSessionFiles += 1;
    assert(path === "Sources/PatentPDFReader.swift", `${path}: unexpected network access`);
  }
  if (path !== "Sources/PatentDetailView.swift") {
    assert(
      !source.includes(".monospaced"),
      `${path}: compiled Patent UI reintroduced monospaced typography`,
    );
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
  pdfReaderSource.includes("activeRequestToken") &&
    pdfReaderSource.includes(".task(id: patent.id)"),
  "native PDF reader can publish stale state after switching patents",
);

const figureResolverSource = await Bun.file(
  new URL("./Sources/PatentFigureAtlasView.swift", import.meta.url),
).text();
assert(
  figureResolverSource.includes(
    "guard !hasWithheldReviewedCrop(token: token, in: patent) else { return nil }",
  ),
  "native figure resolver can bypass a withheld reviewed crop through a bundled alias",
);
assert(
  figureResolverSource.includes("static func markerText(for callout:") &&
    figureResolverSource.includes("static func displayTitle(for callout:"),
  "native figure callouts do not normalize the source corpus' two historical field conventions",
);

// Source plates remain valuable archival evidence, but they cannot satisfy
// spatial parity. Every authored web model must export to a local native asset.
// Haber keeps a no-drawing boundary; Kwolek keeps a stricter facsimile-only
// boundary with no native model, source plate, or quantitative instrument.
type NativeVisualizationEntry = {
  id: string;
  // Older checked-in model entries predate the explicit kind field. The
  // manifest-only updater must retain those byte-for-byte while it replaces
  // only a newly source-bounded entry.
  kind?: "model" | "no-drawing" | "source-bound-pdf-only";
  asset: string | null;
  builder: string;
  spatialComponent?: string;
  vectorComponent?: string;
  meshCount: number;
  namedNodeCount: number;
  sourceBoundary?: string;
};
const nativeVisualizations = (await Bun.file(
  new URL("./Resources/native-visualizations.json", import.meta.url),
).json()) as NativeVisualizationEntry[];
const nativeVisualById = new Map(nativeVisualizations.map((entry) => [entry.id, entry]));
assert(
  nativeVisualizations.length === records.length,
  `native visualization count ${nativeVisualizations.length} != ${records.length}`,
);
assert(
  nativeVisualById.size === nativeVisualizations.length,
  "native visualization ids are not unique",
);
for (const record of records) {
  const visual = nativeVisualById.get(record.id);
  assert(visual !== undefined, `${record.id}: no native spatial exhibit is registered`);
  if (!visual) continue;
  if (isSourceBoundPDFOnly(record)) {
    assert(
      visual.kind === "source-bound-pdf-only",
      `${record.id}: native manifest does not declare the PDF-only boundary`,
    );
    assert(visual.asset === null, `${record.id}: source-bound route ships a USDZ asset`);
    assert(
      visual.builder === "source-bound:pdf-only",
      `${record.id}: source-bound builder drifted`,
    );
    assert(
      visual.meshCount === 0 && visual.namedNodeCount === 0,
      `${record.id}: source-bound route exposes model geometry`,
    );
    assert(
      visual.spatialComponent === undefined && visual.vectorComponent === undefined,
      `${record.id}: source-bound manifest leaks legacy component names`,
    );
    assert(
      visual.sourceBoundary?.includes("pinned facsimile"),
      `${record.id}: native source boundary explanation is missing`,
    );
    continue;
  }
  same(
    visual.spatialComponent,
    record.sourceVisualization.spatialComponent,
    `${record.id}: native spatial source drifted`,
  );
  same(
    visual.vectorComponent,
    record.sourceVisualization.vectorComponent,
    `${record.id}: native vector source drifted`,
  );
  if (record.id === "us-971501-haber-ammonia") {
    assert(
      (visual.kind ?? "no-drawing") === "no-drawing",
      `${record.id}: no-drawing manifest kind drifted`,
    );
    assert(
      visual.asset === null,
      `${record.id}: no-drawing boundary must not ship invented apparatus geometry`,
    );
    assert(
      visual.sourceBoundary?.includes("no apparatus drawing"),
      `${record.id}: source boundary explanation is missing`,
    );
  } else {
    assert((visual.kind ?? "model") === "model", `${record.id}: native manifest kind is not model`);
    assert(
      visual.asset === `NativeModels/${record.id}.usdz`,
      `${record.id}: native model path is not deterministic`,
    );
    assert(visual.meshCount > 0, `${record.id}: native model contains no meshes`);
    assert(
      visual.namedNodeCount > 0,
      `${record.id}: native model contains no named articulation nodes`,
    );
    if (visual.asset) {
      const asset = Bun.file(new URL(`./Resources/${visual.asset}`, import.meta.url));
      assert(await asset.exists(), `${record.id}: native model asset is absent`);
      assert(asset.size > 1_000, `${record.id}: native model asset is implausibly small`);
      assert(
        generatedProject.includes(`${record.id}.usdz in Resources`),
        `${record.id}: native model exists but the generated Xcode project does not bundle it`,
      );
    }
  }
}
const nativeVisualizationSource = await Bun.file(
  new URL("./Sources/PatentVisualizationView.swift", import.meta.url),
).text();
assert(
  nativeVisualizationSource.includes("NativePatentSceneView") &&
    nativeVisualizationSource.includes("NativeNoDrawingSourceBoundaryExhibit") &&
    nativeVisualizationSource.includes("NativePDFOnlySourceBoundaryExhibit") &&
    nativeVisualizationSource.includes("if isSourceBoundPDFOnly"),
  "native workstation does not route models, no-drawing, and PDF-only boundaries explicitly",
);
const nativeDocumentSource = await Bun.file(
  new URL("./Sources/NativeDocumentKit.swift", import.meta.url),
).text();
assert(
  nativeDocumentSource.includes("else if patent.originalTextAsset != nil") &&
    nativeDocumentSource.includes("PDFOnlySourceReader"),
  "native document reader can mistake an absent source-bound transcript for a bundled edition",
);
const workstationSource = await Bun.file(
  new URL("./Sources/PatentWorkstationView.swift", import.meta.url),
).text();
assert(
  workstationSource.includes("Review PDF-only state") &&
    workstationSource.includes("Checked catalogue excerpt") &&
    workstationSource.includes("No reviewed transcription or archival edition"),
  "native workstation does not label the source-bound Kwolek record honestly",
);
const nativeModelExporterSource = await Bun.file(
  new URL("./export-native-models.ts", import.meta.url),
).text();
assert(
  nativeModelExporterSource.includes('includes("--manifest-only")') &&
    nativeModelExporterSource.includes("nativeModelDigestsBefore") &&
    nativeModelExporterSource.includes("existingManifest") &&
    nativeModelExporterSource.includes("sourceBoundManifestEntry") &&
    nativeModelExporterSource.includes(
      "Manifest-only export altered a preserved native USDZ asset",
    ) &&
    nativeModelExporterSource.includes("if (manifestOnly) {") &&
    nativeModelExporterSource.includes("} else {\n  for (const [index, record]"),
  "native model exporter lacks the byte-preserving manifest-only mode",
);
const iosReadme = await Bun.file(new URL("./README.md", import.meta.url)).text();
assert(
  iosReadme.includes("bun export-native-models.ts --manifest-only"),
  "iOS documentation omits the scoped native visualization manifest export",
);
if (requireVisualParity) {
  for (const record of records) {
    assert(
      nativeVisualById.has(record.id),
      `${record.id}: native spatial visualization is not implemented`,
    );
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
    callouts:
      sum.callouts +
      patent.drawings.reduce(
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
    `${totals.callouts} callouts, ${records.length - sourceBoundedRecords.length} source visualization pairs, ` +
    `${sourceBoundedRecords.length} PDF-only source-bound record, ` +
    `${manifest.length} bundled non-PDF assets, ${totals.withheldAssets} explicitly gated source crops, ` +
    `one first-party PDF network boundary. Native spatial parity: ` +
    `${nativeVisualizations.filter((entry) => entry.asset !== null).length} authored USDZ models plus ` +
    `${nativeVisualizations.filter((entry) => entry.kind === "no-drawing").length} explicit no-drawing boundary and ` +
    `${nativeVisualizations.filter((entry) => entry.kind === "source-bound-pdf-only").length} PDF-only boundary; ` +
    `no source plate is credited as a 3D model.`,
);
