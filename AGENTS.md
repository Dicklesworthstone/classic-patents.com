# AGENTS.md — Classic Patents

Guidelines for AI coding agents working in this repository.

---

## RULE 0 — THE FUNDAMENTAL OVERRIDE PREROGATIVE

If I tell you to do something, even if it goes against what follows below, YOU MUST LISTEN TO ME. I AM IN CHARGE, NOT YOU.

---

## RULE NUMBER 1: NO FILE DELETION

**YOU ARE NEVER ALLOWED TO DELETE A FILE WITHOUT EXPRESS PERMISSION.** Even a new file that you yourself created, such as a test code file. You have a horrible track record of deleting critically important files or otherwise throwing away tons of expensive work. As a result, you have permanently lost any and all rights to determine that a file or folder should be deleted.

**YOU MUST ALWAYS ASK AND RECEIVE CLEAR, WRITTEN PERMISSION BEFORE EVER DELETING A FILE OR FOLDER OF ANY KIND.**

---

## RULE NUMBER 2: ZERO TOLERANCE FOR LEGACY PAGES ROUTER (`src/pages`) OR ROGUE ROOT FILES

**UNDER NO CIRCUMSTANCES IS ANY AGENT EVER PERMITTED TO CREATE A `src/pages` DIRECTORY, RECREATE LEGACY PAGES-ROUTER FILES (`_error.tsx`, `_app.tsx`, `_document.tsx`, `index.tsx` under `src/pages`), OR SCATTER UNAPPROVED ROOT SCRATCH FILES IN THIS REPOSITORY.**

**VIOLATION OF THIS RULE CARRIES IMMEDIATE INSTANCE TERMINATION AND PERMANENT BANISHMENT FROM THIS PROJECT FOREVER WITH ZERO EXCEPTIONS.**

1. **Pure Next.js 15 App Router Architecture Only**: This repository operates strictly and exclusively under Next.js 15 App Router (`src/app/`). Next.js activates legacy Pages Router dual-resolution when `src/pages` exists (even if empty or containing a single `.keep` file), which completely corrupts production static page data collection, route manifests, OpenGraph metadata routes, and pre-rendering.
2. **Never Create `src/pages` For Any Reason**: Error boundaries belong in `src/app/error.tsx` and `src/app/global-error.tsx`. 404 handlers belong in `src/app/not-found.tsx`. All routes live exclusively in `src/app/`.
3. **No Rogue Root Scratch Files**: Do not generate temporary Python, JavaScript, or Shell scripts in the repository root or source tree. Use the designated `<appDataDir>/brain/<conversation-id>/scratch/` directory or proper typed test fixtures.
4. **Permanent Enforcement Gate**: `scripts/verify-data.ts` enforces this invariant on every single build gate and pipeline run. Any violation will instantly abort with an architectural violation error.

---

## Irreversible Git & Filesystem Actions — DO NOT EVER BREAK GLASS

1. **Absolutely forbidden commands:** `git reset --hard`, `git clean -fd`, `rm -rf`, or any command that can delete or overwrite code/data must never be run unless the user explicitly provides the exact command and states, in the same message, that they understand and want the irreversible consequences.
2. **No guessing:** If there is any uncertainty about what a command might delete or overwrite, stop immediately and ask the user for specific approval. "I think it's safe" is never acceptable.
3. **Safer alternatives first:** When cleanup or rollbacks are needed, request permission to use non-destructive options (`git status`, `git diff`, `git stash`, copying to backups) before ever considering a destructive command.
4. **Mandatory explicit plan:** Even after explicit user authorization, restate the command verbatim, list exactly what will be affected, and wait for a confirmation that your understanding is correct. Only then may you execute it.
5. **Document the confirmation:** When running any approved destructive command, record (in the session notes / final response) the exact user text that authorized it, the command actually run, and the execution time.

---

## Branch Policy

- Primary branch is `main`.
- Work happens on `main`. Do not create feature branches unless the user explicitly asks for one.
- Do not reference `master` in docs or scripts.

---

## Project Mission

**Classic Patents** (`classic-patents.com`) is a digital museum, educational instrument, and open-source archive dedicated to the most consequential technical patents in human history.

The project solves a major historical and educational deficit: original patents represent humanity's greatest technical leaps, yet they are trapped in degraded scanned PDFs and impenetrable 19th/20th-century legal prose. Classic Patents transcribes the full specifications and claims against the pinned facsimile, reconstructs original diagrams into modern interactive SVG/Canvas simulations, and provides a synchronous **"Plain English" engineering breakdown** that explains the genuine physics, mechanics, and chemistry without dumbing anything down.

The single source of truth is [`COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md`](./COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md). Read it before modifying schemas, adding new patent entries, or restructuring visual components.

---

## Product Shape & Tech Stack

The web application is built with:

1. **Web Frontend**: Next.js 15 (App Router, React 19, TypeScript).
2. **Styling & Aesthetics**: Tailwind CSS with custom thematic extensions (Parchment vintage archival mode, Blueprint dark engineering mode, High-contrast clean mode). Google Fonts (Playfair Display, EB Garamond, Inter, JetBrains Mono).
3. **Interactive Visual & Simulation Engine**: React Three Fiber / Three.js 3D WebGL modules backed by **FrankenSim** (`~/projects/frankensim`) computational physics compiled to WebAssembly. Bind the generic crates that own the law (`fs-time`, `fs-mbd`, `fs-flux`, `fs-lattice`, `fs-conduction`, `fs-truss`, `fs-solid`, and others in `~/projects/frankensim/crates`). Wright happens to have an extra packaged flyer module; that is not the expected shape of every new patent. Blake3 state digests and typed refusal boundaries still apply.
4. **Data & Pipeline**: TypeScript data schemas (`src/data/patents/`), automated downloading (`scripts/download-patents.ts`), and optional local transcription helpers. Agents may transcribe with any tool, including built-in model vision. The published ledger is a human-reviewed artifact, not a raw OCR dump.
5. **Hosting & Deployment**: Vercel (CLI-managed, prebuilt deploy workflow, zero build credit burn).
6. **Code Quality**: Biome (`biome check`, `biome format --write`), TypeScript (`tsc --noEmit`), UBS (`ubs --diff`, `ubs --staged`).

---

## The Classic Patents Engineering Doctrine

1. **Dual-Projection Parity (Diptych)**: Every patent page has two synchronized projections:
   - **Original Specification Face**: The hand-authored archival edition of the exact historical text (masthead, claims, figure-sheet crops, term annotations), plus the pinned facsimile. Not OCR, not a PDF text layer, not scan-page banners.
   - **Plain English Engineering Face**: Lucid, rigorous, step-by-step mechanical/electrical/chemical breakdown, annotated claim decoders, paragraph-level parallel readings, historical context, and patent dispute analysis.
2. **Never Dumb Down**: Plain English does not mean childish oversimplification. Explain the exact equations, aerodynamics, vector math, vacuum physics, and semiconductor chemistry in intuitive, elegant terms.
3. **Interactive Visuals are Pedagogical Instruments**: Visuals are not decorative stock art. Every diagram must illustrate real mechanics (e.g. dragging the Wright warp twists the wing tips, the linked rudder cancels adverse yaw, and the badge's induced-drag newtons change on the same frame). See §5 / §5c.
4. **Audited Physics Simulation (FrankenSim WASM)**: Interactive 3D and 2D components reflect genuine physical laws (aerodynamic induced drag, Maxwell vector flux, point-contact hole diffusion, 6-group delayed neutron kinetics, and Stefan-Boltzmann radiation). The presentation layer consumes typed SI telemetry from one shared kernel on `usePatentPhysics(<catalogue-id>)`. Never label a HUD WASM unless a module stepped. See §5b and [`docs/FRANKENSIM_WASM_INTEGRATION_TODO.md`](./docs/FRANKENSIM_WASM_INTEGRATION_TODO.md).
5. **Data Integrity & Determinism**: All patent transcripts and archival editions are validated against typed Zod/TypeScript schemas and the reviewed-ledger publication contract. No phantom claims, hallucinated patent dates, or SHA-256 mismatches between PDF, ledger, and edition.
6. **Aesthetics & Typography**: Museum-quality presentation. Pristine typography, balanced whitespace, beautiful dark/parchment/blueprint themes, and responsive design down to 320px mobile screens.

---

## How to Add a New Patent to the Library

Adding a patent is an archival, educational, and product change, not a new
card in a list. Do not publish a partial or speculative record. Filling the
TypeScript `Patent` type is not enough.

The Wright brothers' *Flying-Machine* grant is the reference implementation
for the whole vertical slice: identity, provenance, pinned facsimile,
reviewed ledger, archival edition, claim decoders, Plain English engineering
face, historical context, colorized equations, one shared physics bus, 2D
simulator, Three.js 3D studio, schematic, telemetry badge, and tests. Its
catalogue id is `us-821393-wright-flyer`. Tesla's *Electro-Magnetic Motor*
(`us-381968-tesla-motor`) is the companion reference for the archival-edition
publication contract (figure-crop directory, term annotations, paragraph-level
parallel readings, and the edition test that pins every block to the ledger).

A new record is unfinished until a visitor can read the legal instrument, the
physics, the fight over priority (or an honest empty `patentWars` array), and
a working model of the claimed mechanism without another round of "make it
not suck."

### The Wright Flyer exemplar (complete artifact map)

Every complete record ships this same shape. Copy the Wright paths, then
replace `us-821393-wright-flyer` / `wright-flyer` / `WrightFlyer` with the
new id and names.

| Layer | Wright path | What it is |
| --- | --- | --- |
| Provenance receipt | `docs/provenance/us-821393-wright-flyer.md` | Source URL, retrieval date, rights basis, SHA-256, page count, PDF-page locators for every quoted passage, claim, and drawing. Written **before** editorial copy. |
| Pinned facsimile | `public/patents/pdfs/us-821393-wright-flyer.pdf` | Immutable source PDF. Filename equals the catalogue id. |
| Reviewed ledger | `public/patents/transcripts/us-821393-wright-flyer-reviewed.txt` | Page-complete human-reviewed transcription. Begins with `--- REVIEWED TRANSCRIPTION PAGE 1 OF N ---`. Research evidence, not the visitor-facing source face. |
| Figure crops | `public/patents/figures/us-821393-wright-flyer-fig-1-preview.png` (Wright, flat) or, for new records, `public/patents/figures/<id>/fig-1-source-crop-v1.png` (Tesla convention) | Editor-chosen crops from the pinned drawing sheets. Edition figure references point here. |
| Canonical record | `src/data/patents/wright-flyer.ts` (`wrightFlyerPatent`) | Identity, excerpt, claim decoders, Plain English, drawings, historical context. Claims' `originalText` is pulled from the edition so the two cannot drift. |
| Archival edition | `src/data/editions/wrightFlyerEdition.ts` (`wrightFlyerArchivalEdition`) | Continuous, hand-authored React source face. Typed blocks, not OCR, not a PDF text layer, not scan-page breaks. |
| Edition test | `src/data/editions/wrightFlyerEdition.test.ts` | Pins SHA-256, all printed claims, ledger markers, and every textual block back to the reviewed transcript. Tesla's `teslaMotorEdition.test.ts` is the fuller contract (figure files on disk, term definitions, parallel readings). |
| Parallel readings | `src/data/editions/parallelReadings.ts` key `us-821393-wright-flyer` | One non-lossy explanation per edition paragraph, keyed by block index. New records export the map from the edition file and register it here. |
| Physics kernel | `src/physics/wrightKernel.ts` | Shared SI step. 2D, 3D, schematic, and badge all call `readWrightControls` + `stepWrightFlyerSi`. Wright also has a packaged `fs-flyer` WASM module; new patents compose generic FrankenSim crates instead of waiting for a packaged equivalent (see §5b). |
| Physics registry | `src/physics/telemetryData.ts` key `us-821393-wright-flyer` | SI controls, governing equation, `engineMethod`, `computeMetrics` that call the shared step. |
| Spec-clause weave | `src/physics/specClauses.ts` | Kernel predicates that light exact phrases on the spec face (warp, adverse yaw, rudder linkage). |
| Colorized equations | `src/data/colorizedEquations.ts` key `us-821393-wright-flyer` | Dual-coded equations whose variables bind to live telemetry. |
| 2D visual | `src/components/patents/visuals/WrightFlyerSim.tsx` | Orthographic pedagogical instrument on the shared bus. |
| 3D visual | `src/components/patents/visuals/three/WrightFlyer3D.tsx` | Three.js studio via `createThreeStudioScene`. |
| 3D model | `src/components/patents/visuals/three/wrightFlyerAirframe.ts` | Procedural airframe from the drawings, not a decorative GLTF. |
| Dispatcher | `src/components/patents/visuals/index.tsx` `case "us-821393-wright-flyer":` | Explicit id case. The default is the Wright Flyer; a new record must never reach that fallback. |
| Schematic | `svgType: "wright-flyer"` plus `SCHEMATIC_HINTS` / `renderHistoricalSchematic` | Original-drawing viewer. Callouts match facsimile letters/numbers. |
| Registry | `src/data/patents/index.ts` `allPatents` (chronological) | Search, home counts, timeline, adjacent nav, static routes, metadata, OG images. |

Four layers stay separate. A later reviewer must reproduce each one without
guessing:

1. **Facsimile** — the pinned PDF.
2. **Reviewed ledger** — page-marked transcription used as comparison evidence.
3. **Archival edition** — the continuous visitor-facing source face.
4. **Editorial explanation** — Plain English, claim decoders, historical
   context, visuals. Never treat layer 4 as a substitute for layers 1–3.

Do not ship CSV exports, QR codes, downloadable "receipts," invented impact
scores, or other theater metrics. The museum argument is the facsimile, the
claims, the SI kernel, and the working model.

### 1. Scope and source research

1. Read `COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md` before selecting or
   restructuring a record. Confirm that the patent fits the museum's curated
   mission and that its mechanism can be explained rigorously.
2. Establish a research packet from primary or otherwise authoritative sources:
   the patent facsimile, grant and filing dates, inventor spelling/location,
   title, classification, claims, figures, and a stable public record URL. Keep
   the sources available for review; never invent a claim, date, figure label,
   legal outcome, or quotation to fill a gap.
3. Write the plain-English material from the real mechanism. Preserve the
   distinction between the legal scope (the claims), the historic document
   (the specification and drawings), and modern engineering interpretation.
   Plain English must retain the relevant physics, units, equations, limits,
   and uncertainty rather than offering a superficial analogy.
4. Create a provenance receipt at `docs/provenance/<id>.md` **before**
   authoring editorial copy. Use Wright's receipt as the template
   (`docs/provenance/us-821393-wright-flyer.md`). Required sections:

   - **Source identity**: catalogue id, granted title, inventors as printed,
     grant date, filing date, primary public-record URL, local PDF path,
     retrieval and full-facsimile review date, rights basis (typically a
     United States patent whose historical text and drawings are public-domain
     United States Government material), lowercase SHA-256 of the pinned PDF,
     PDF page count.
   - **Facsimile map**: a table of every PDF page with what was checked
     (drawing sheet / masthead / claims range / signatures). Wright's ten-page
     map is the model. These locators stay in the receipt; they do not appear
     on the visitor-facing edition.
   - **Editorial and preservation boundaries**: which file is the public
     source face, which file is the reviewed ledger, where figure crops live,
     how many printed claims exist, and an explicit statement that machine
     drafts and PDF text-layer files are research evidence only.

5. Choose a stable, URL-safe id in this format:
   `us-<unpunctuated-number>-<short-kebab-title>`. Pre-1836 X-patents keep
   the historical `X` (`us-x9430-colt-revolver`). The Wright record uses
   `us-821393-wright-flyer`; its PDF is `us-821393-wright-flyer.pdf`; its
   public route is `/patents/us-821393-wright-flyer`. Check
   `src/data/patents/` and `allPatents` first so the id, patent number, and
   title do not collide. The id, PDF filename, transcript filename, figure
   directory, provenance filename, and route must all match. Do not change a
   published id without an explicit redirect (`LegacyPatentRedirect`) and
   written approval; home-page links and `generateStaticParams` will 404.

### 2. Add the immutable source asset

1. Put the reviewed source PDF at
   `public/patents/pdfs/<id>.pdf`. The filename must exactly match the chosen
   id; for the exemplar it is
   `public/patents/pdfs/us-821393-wright-flyer.pdf`.
2. Set `originalPdfUrl` in the data record to exactly
   `/patents/pdfs/<id>.pdf`. Do not point this field at an unpinned remote URL:
   the detail page embeds this local facsimile and the download pipeline copies
   it into its working cache.
3. Inspect the PDF before registering it: it must be the intended patent,
   readable, complete, and large enough to be a genuine document, not a
   placeholder, an HTML error page, or a different member of the patent family.
   Use `pdfinfo public/patents/pdfs/<id>.pdf` and review representative pages.
   Compute the digest and pin it in three places (they must match):

   ```bash
   shasum -a 256 public/patents/pdfs/<id>.pdf
   ```

   Wright's digest is
   `678bea5d81cb4e90a15c998bc932d2cf01bc87cfc3fcc53f0ecbdbdc70097966`.
   It appears on `originalTextAsset.sourcePdfSha256`,
   `archivalEdition.sourcePdfSha256`, and the provenance receipt.
4. Do not modify or discard an existing source PDF merely because a
   transcription looks surprising. Preserve the original and diagnose the
   reading or the source provenance instead. Changing a pinned PDF without
   updating every digest will fail the edition test and the publication
   contract.

### 3. Author the typed canonical record

1. Create `src/data/patents/<short-name>.ts`, import `Patent` from
   `@/types/patent`, and export a named `Patent` constant. Use
   `wrightFlyerPatent` as the structural example; the canonical interface is
   `src/types/patent.ts`.
2. Complete every required `Patent` field. Wright's identity block is the
   format:

   - `id`: `us-821393-wright-flyer`
   - `patentNumber`: historical punctuation (`US 821,393`)
   - `title`: the granted title (`Flying-Machine`)
   - `shortTitle`: names the mechanism, not a slogan
     (`Wright Flyer 3-Axis Aerodynamic Flight Control`)
   - `subtitle`: names the physical principle
     (`Differential Wing Warping, Coordinated Rudder, and Aerodynamic Pitch Control`)
   - `inventors` / `inventorLocation`: as printed
   - `grantDate` / `filingDate`: real `YYYY-MM-DD`. `filingDate` may be
     `null` only when the reviewed primary record does not document one.
   - `era`: reuse an existing catalogue era string when the patent fits
     (`Electrification & Early Modern (1870–1920)` for Wright). Do not invent
     a one-off era label.
   - `category` / `categoryLabel`: `category` is one of
     `aviation | aerospace | electricity | telecom | computing | consumer | materials | optics`.
     Aviation is not "consumer." Wright is `aviation` /
     `Aeronautics & Aerodynamics`.
   - `summary`: one tight paragraph of what the patent actually claimed and
     when it was filed/granted.
   - `heroQuote`: a sentence from the specification or an attributable
     primary source, never invented color.
   - `originalPdfUrl`, `googlePatentsUrl`, `usptoClassification`
   - `originalTextAsset`: reviewed transcription (see §3a)
   - `archivalEdition`: the manual React edition (see §3a)
   - `originalText`: a curated on-page excerpt of the opening specification,
     not the complete grant and not labeled "verbatim complete"
   - `plainEnglishExplanation`, `claims`, `drawings`, `historicalContext`
   - `tags` only when researched
   - `stats.totalClaims` / `stats.independentClaims` must equal the typed
     `claims` array. Do not invent `patentWarYears` or `impactScore`.

3. Treat `originalText` as a faithful excerpt of the facsimile opening, not a
   summary and not a second complete transcription. Wright keeps the
   preamble through the cradle description on the record; the complete
   specification lives in the archival edition. Tesla's record goes further
   and keeps `originalText` short enough that it does not contain
   "What I claim". Preserve legal wording, figure references, and paragraph
   meaning. A machine draft (OCR, PDF text layer, or model vision) can
   accelerate this work, but it is never authoritative on its own. Every
   line that reaches the ledger or the edition must be checked against the
   facsimile and cleaned to the Wright standard in §6.
4. Do not represent an excerpt, a trailing ellipsis, or a curated claim subset
   as a complete or "verbatim" specification. Completeness is the archival
   edition plus the reviewed ledger, not the length of `originalText`. If the
   product deliberately supports partial editorial coverage in the future, add
   an explicit reviewed coverage state and visitor-facing disclosure first;
   never infer completeness from the text or from `stats`.
5. Include every claim that the grant prints. Wright has eighteen independent
   claims; all eighteen are present. Claim numbers must be unique; at least
   one must be independent unless the facsimile genuinely has no formal
   claims (then set `archivalEdition.claimStatus` with evidence, and do not
   invent claims to satisfy the type). Every `dependsOn` value must name an
   included claim. Each claim needs:

   - exact `originalText` pulled from the edition (using a helper like Wright's `manualClaimText` function). **NEVER HARDCODE OR DUPLICATE CLAIM TEXT IN THE PATENT RECORD FILE (e.g. do not create a `MANUALLY_REVIEWED_CLAIM_TEXT` map).** The canonical source of truth for all literal patent text is the archival edition. Reconstructing or hardcoding string literals in the patent data file creates a second, drift-prone transcription and violates the strict single-source-of-truth architecture. You MUST dynamically look up the claim from the edition's `blocks` array at runtime, and never write tests that forbid `manualClaimText`.
   - a `plainEnglish` decoder that names the physical part and the legal work
     it does (Tesla's test requires more than 30 words)
   - `keyInnovations` as concrete nouns (`Differential wing warping`, not
     "innovation")
   - `legalSignificance` when the claim was the one that mattered in court
     or in later practice (Wright Claim 1 and Claim 7)

6. Populate `plainEnglishExplanation` fully. Wright is the depth bar:

   - `overview`: the prior-art failure and the inventor's actual move
     (Lilienthal/Langley treated flight as power or inherent stability; the
     Wrights treated it as a control problem).
   - `coreMechanism`: the causal chain in SI units
     (warp → ΔCL → induced drag → adverse yaw → coupled rudder). Analogies
     are allowed only after the mechanism is stated.
   - `mechanicalBreakdown`: one card per claimed organ. Wright has five
     (warp, rudder, canard, flexible truss, hip cradle). Each card has a
     summary, technical details that include the governing relation in
     readable prose plus `$...$` TeX, and `archaicTerm` /
     `modernEquivalent` when the specification uses a period word
     (`aeroplane`, `superposed flexible aeroplanes`, `horizontal rudder`).
   - `scientificPrinciples`: real named laws with `formula` and an
     explanation a working engineer can check. Wright has lift, induced
     drag, coordinated-turn kinematics, Prandtl lifting-line, and canard
     static stability. HUD copy uses `HudText` / `TextWithLatex` /
     `ColorizedEquation`; never leave raw `$LaTeX$` visible.
   - `whyItMattersToday`: specific (which later machine, grid, process, or
     doctrine inherited this). Wright points at coordinated flight in a
     Cessna / 787 / F-22 and Claim 1's aileron equivalents, not a TED-talk
     coda.

7. Populate `drawings` from actual patent figures. `figureNumber`, labels, and
   callouts must correspond to the facsimile; callout coordinates are
   percentages in the inclusive 0–100 drawing space. Wright Fig. 1 callouts
   `1`, `2`, `3`, `6`, `9` match the printed element numbers. Give each
   drawing a unique `svgType` (Wright uses `wright-flyer`). Populate
   `historicalContext` as specified in §5a. Do not claim a patent war where
   the record does not support one (Tesla's wars array is `[]` and the
   edition test asserts that).

### 3a. Archival edition, reviewed ledger, figures, and parallel readings

This is the visitor-facing source face. Wright's edition is
`src/data/editions/wrightFlyerEdition.ts`. Tesla's edition plus
`teslaMotorEdition.test.ts` is the publication-contract reference.

**Edition file.** Export a `CuratedSpecificationEdition`:

```ts
export const wrightFlyerArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "<lowercase 64-hex of the pinned PDF>",
  preparedBy: "Classic Patents editorial agent (<model>)",
  preparedAt: "YYYY-MM-DD",
  completeFacsimileReviewed: true,
  blocks: [ /* masthead, figure-sheets, paragraphs, claims */ ],
};
```

`validateCuratedSpecificationEdition` requires: exactly one masthead,
at least one paragraph, at least one claim (or an explicit
`claimStatus: { kind: "no-formal-claims-in-facsimile", evidence }`),
a real ISO `preparedAt`, a lowercase SHA-256, and
`completeFacsimileReviewed: true`. Use `drawingStatus` only when the
facsimile genuinely has no drawing sheets.

**Block kinds** (`src/types/patent.ts`): `masthead`, `heading`, `paragraph`,
`claim`, `figure-sheet`, `table`, `equation`. Inline kinds: `text`,
`reference` (figure / claim / section, authored at the occurrence, never
inferred at render time), `term` (historical word plus a modern definition),
`emphasis`, `small-caps`.

**Figure references.** Each printed figure citation is an authored
`reference` with local `figurePreviews`. New records put crops in
`public/patents/figures/<id>/` (Tesla:
`/patents/figures/us-381968-tesla-motor/fig-9-source-crop-v1.png`). Wright's
older flat filenames remain valid for that record only. Crops come from the
pinned drawing sheets; do not style a generated caption or a reconstructed
SVG as an archival citation. Tesla's test requires every figure reference
to have at least one preview whose file exists on disk.

**Term annotations.** Mark the specification's period words as `term`
inlines. Tesla annotates `independent circuits`, `lines of force`,
`commutator`, `annulus`, each with a definition longer than 80 characters.
Wright annotates `angle of incidence`. Definitions are authored for that
exact occurrence.

**Claims in the edition.** Every printed claim is a `{ kind: "claim", number,
inlines }` block. The catalogue record reads those nodes:

```ts
function manualClaimText(number: number): string {
  const block = wrightFlyerArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Wright manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}
```

The edition test asserts `patent.claims[].originalText` equals those joined
inlines. Do not retype the legal text in the record.

**Continuous reading.** The public edition does not impose scan-page breaks.
Wright's test forbids `--- REVIEWED TRANSCRIPTION PAGE`, `3 SHEETS—SHEET`,
and `Drawing sheet` in the edition JSON. Page locators belong in the
provenance receipt and the reviewed ledger.

**Reviewed ledger.** Ship
`public/patents/transcripts/<id>-reviewed.txt` and point
`originalTextAsset` at it:

```ts
originalTextAsset: {
  url: "/patents/transcripts/us-821393-wright-flyer-reviewed.txt",
  pageCount: 10,
  kind: "reviewed-transcription",
  reviewedBy: "Classic Patents editorial agent (<model>)",
  reviewedAt: "YYYY-MM-DD",
  sourcePdfSha256: "<same digest as the edition>",
},
```

The file must start with `--- REVIEWED TRANSCRIPTION PAGE 1 OF N ---` and
contain the complete ordered marker sequence
(`validateReviewedTranscription` in
`src/data/patents/sourceTextValidation.ts`). A manual edition without this
ledger fails `manualEditionPublicationContract.test.ts`.
`src/data/patents/sourceTextAssets.ts` is a different thing: machine-extracted
PDF text layers. Do not treat a text layer as a reviewed transcription.

**Parallel readings.** Hand-author a
`Record<number, readonly string[]>` keyed by edition **block index**, one
non-lossy explanation per paragraph. Export it from the edition file (Tesla)
and register it in `src/data/editions/parallelReadings.ts`. Tesla's test
requires every paragraph index to have a reading whose joined text is longer
than 40 characters. These are editorial translations of the matching source
block, not OCR cleanup and not generated summaries.

**Edition test.** Add `src/data/editions/<name>Edition.test.ts`. Minimum
Wright contract:

- `validateCuratedSpecificationEdition` returns `{ valid: true, errors: [] }`
- edition SHA-256 equals the bytes of `originalPdfUrl`
- every printed claim number is present
- `originalTextAsset` is a reviewed transcription with reviewer, date, digest
- the ledger validates and contains every masthead / paragraph / claim string
- the edition JSON contains no ledger page markers

Add Tesla's extras for a new complete record: claim `originalText` sync,
`plainEnglish` length, figure files on disk, term annotations, parallel
readings covering every paragraph, and an honest empty `patentWars` when
there was no fight.

### 4. Register the record and understand what is automatic

1. Import the new constant in `src/data/patents/index.ts` and add it once to
   `allPatents`, in chronological order. This single registry drives search,
   home-page catalogue counts, the timeline, adjacent-record navigation,
   static detail-route generation, metadata, and per-patent Open Graph/Twitter
   images.
2. Add it to `getFeaturedPatents()` only after an intentional editorial choice;
   being in the library does not make a patent featured.
3. The detail page is not hand-authored per patent. It resolves the registry id
   through `src/app/patents/[id]/page.tsx`, then renders `PatentHeader` and
   `DualProjectionViewer`. Verify the generated path and metadata rather than
   creating a duplicate route. Do not create a per-patent page under
   `src/app/` or anything under `src/pages/`.
4. Register the other catalogue keys that are not automatic:

   - `src/data/editions/parallelReadings.ts` — parallel-reading map
   - `src/data/colorizedEquations.ts` — `ALL_COLORIZED_EQUATIONS[<id>]`
   - `src/physics/telemetryData.ts` — `PATENT_PHYSICS_REGISTRY[<id>]`
   - `src/components/patents/visuals/index.tsx` — explicit `case "<id>":`
     (`dispatcher.test.ts` fails if this is missing)
   - `src/physics/paramAliases.ts` — only if a face uses a private slider
     name that must canonicalize to a registry control id
   - `src/physics/specClauses.ts` / `src/physics/energyChannels.ts` /
     `src/physics/weaveSurfaces.ts` — when the spec has a testable phrase,
     an energy path, or a leftover weave the badge/HUD should show

5. Update the README catalogue and the comprehensive plan only when the new
   record changes their documented curated set, roadmap, or coverage claims.
   Keep those documents consistent with the registry; do not silently claim a
   patent is complete while its PDF, data, or visual is missing.

### 5. Build the pedagogical visual, not decorative art

Every published patent needs a real visual treatment. The Wright Flyer has a
2D `WrightFlyerSim.tsx`, a 3D `three/WrightFlyer3D.tsx`, a procedural
airframe `three/wrightFlyerAirframe.ts`, and an explicit dispatcher case.
Its controls model the patented roll / yaw / pitch relationship: hip-cradle
warp, Claim 18 rudder linkage (`WRIGHT_COUPLING = 0.45`), and the canard.

1. Build a domain-appropriate 2D SVG/Canvas simulator in
   `src/components/patents/visuals/` and, where the mechanism is spatial, a
   3D Three.js module in `src/components/patents/visuals/three/` via
   `createThreeStudioScene`. Expose real, explainable controls, SI state,
   safety bounds, and cause-and-effect feedback. Do not use a generic
   illustration in place of a mechanism. Extract the mesh/kinematics into
   a `*Model.ts` / `*Airframe.ts` file (Wright: `wrightFlyerAirframe.ts`;
   later machines: `ottoEngineModel.ts`) so the visual can be tested
   without mounting WebGL.
2. Add the 2D import, a `dynamic(..., { ssr: false, loading: ThreeLoading })`
   3D import, and an explicit `case "<id>":` to
   `src/components/patents/visuals/index.tsx`. The default currently renders
   the Wright Flyer, so relying on it would silently show the wrong invention.
   A new record must never reach that fallback. Provide an honest loading,
   error/unavailable, and text-only explanatory state instead of substituting
   another patent's simulator.
3. Give the original-drawing viewer a correct `svgType` and extend
   `SCHEMATIC_HINTS`/`renderHistoricalSchematic` in
   `src/components/patents/InteractiveDiagramViewer.tsx` when a bespoke
   schematic is needed. Keep its parts, labels, and callouts faithful to the
   source figure and cite the source PDF page in the provenance receipt.
   Otherwise use the deliberate generic rendering rather than misidentifying a
   drawing, and never style a generated caption or synthesized overlay as an
   archival citation.
4. Bind 2D, 3D, schematic, `PhysicsTelemetryBadge`, and any audio to
   `usePatentPhysics("<id>")` and the shared kernel (see §5b). Wright's 2D
   and 3D both call `readWrightControls` + `stepWrightFlyerSi`. Do not keep
   a private `useState` copy of the same slider.
5. Test both the 3D and 2D paths (when both exist), initial loading, controls,
   theme changes, keyboard/touch operation, narrow 320px viewports, and the
   explanatory connection between the visual and the record's claims. Every
   new visual must give controls accessible names, a keyboard-operable textual
   relationship/telemetry fallback, visible focus, and a reduced-motion path.
   Add a `*Visual.test.ts` (see `ottoEngineVisual.test.ts` or
   `wrightFlyerEdition.test.ts` companions) that asserts: no GLTF/GLB unless
   the asset is itself a reviewed primary; kinematics come from the shared
   step; no `Math.random` in the frame loop.

### 5a. Patent completeness bar (Wright / Tesla / Edison quality)

A new record is unfinished until it matches the depth of the best existing
entries (`wright-flyer.ts`, `tesla-motor.ts`, `edison-lightbulb.ts`,
`fermi-reactor.ts`, `noyce-ic.ts`). Filling the TypeScript type is not enough.
The visitor must be able to read the legal instrument, the physics, the fight
over priority, and a working model of the claimed mechanism without another
round of "make it not suck."

**Identity and catalog**

- `id` is `us-<digits>-<kebab>` (or `us-x<digits>-<kebab>` for X-patents) and
  matches the PDF filename, reviewed-transcript filename, figure directory,
  provenance filename, and route. `patentNumber` keeps historical punctuation
  (`US 821,393`).
- `title` is the granted title. `shortTitle` names the mechanism, not a slogan.
  `subtitle` names the physical principle. `era` and `category` match the
  museum taxonomy; aviation is not "consumer."
- `heroQuote` is a sentence from the specification or an attributable primary
  source, never invented color. `summary` is one tight paragraph of what the
  patent actually claimed and when it was filed/granted.
- `stats.totalClaims` / `independentClaims` must equal the typed `claims`
  array. Do not invent `patentWarYears` or `impactScore`.

**Specification, edition, and claims**

- A complete record has all three of: pinned PDF, reviewed ledger
  (`kind: "reviewed-transcription"`, `reviewedBy`, `reviewedAt`,
  `sourcePdfSha256`, page markers), and `archivalEdition` with
  `completeFacsimileReviewed: true`. `originalText` may remain a curated
  on-page excerpt; never label an excerpt "verbatim complete."
- Every numbered claim in the grant is present in both the edition and the
  record. Each claim has exact `originalText` (from the edition helper), a
  `plainEnglish` decoder that names the physical part and the legal work it
  does, `keyInnovations` as concrete nouns, and `legalSignificance` when the
  claim was the one that mattered in court or in later practice.
- Independent vs dependent is historically correct. `dependsOn` points at
  included claim numbers only.
- Figure citations in the edition have local facsimile crops on disk.
- Period words are authored `term` annotations. Every edition paragraph has
  a parallel reading.

**Plain English engineering face**

- `overview` states the prior-art failure and the inventor's actual move.
- `coreMechanism` is the causal chain in SI units (warp → ΔCL → induced drag
  → adverse yaw → coupled rudder). Analogies are allowed only after the
  mechanism is stated.
- `mechanicalBreakdown` is one card per claimed organ. Each card has a
  summary, technical details that include the governing relation in readable
  prose plus `$...$` TeX, and `archaicTerm` / `modernEquivalent` when the
  specification uses a period word (`aeroplane`, `undulating current`,
  `letters patent`).
- `scientificPrinciples` are real named laws with `formula` and an
  explanation that a working engineer can check. Mirror them in
  `ALL_COLORIZED_EQUATIONS[<id>]` with `rawLatex`, `colorizedLatex`, a
  `plainEnglishSentence` of fragments, and `variables` whose
  `telemetryKey` / `telemetryMetricLabel` bind to the live registry.
  HUD copy uses `HudText` / `TextWithLatex` / `ColorizedEquation`; never
  leave raw `$LaTeX$` visible.
- `whyItMattersToday` is specific (which later machine, grid, process, or
  doctrine inherited this) and is not a TED-talk coda.

**Historical context**

Wright's `historicalContext` is the depth bar:

- `problemStatement` is the bottleneck in the inventors' world, not a
  Wikipedia lede. Wright names Lilienthal's 1896 stall, Pilcher's 1899
  death, and Langley's two Potomac dumps, with dates.
- `priorArtLimitations` are named failures of named prior machines
  (rigid wings, pendulum tails, unlinked yaw, Langley's catapult, Maxim/Ader
  "more power").
- `breakthroughInsight` is the one idea that made the rest possible
  (buzzards / Huffman Prairie / hip cradle tied to the rudder after the
  1901 glider yawed the wrong way).
- `patentWars` only when the record supports them: `rivalName`,
  `rivalClaim`, `conflictDetails`, `resolution`, `legalOutcome`. Wright
  documents Curtiss, Judge Hazel, Claim 1, the 1917 Manufacturers Aircraft
  Association pool. Empty array if there was no fight.
- `aftermath` is money, later suits, later use, expiration, or eclipse
  (Orville sells in 1915; Smithsonian / Langley fight; Flyer in London
  until 1942).
- `sideNotes` are dated anecdotes that do not fit the cards (1901 wind
  tunnel, 1904–1905 split rudder, Charlie Taylor's engine).
- `civilizationalImpact` is causal, not civic poetry. `funFact` is
  attributable or omitted (Toulmin rewrote the claims around control, not
  the engine; the patent does not mention a motor).

**Visitor-facing prose (de-slopify)**

- No em dashes, no "seminal / pivotal / groundbreaking / it's not X, it's Y,"
  no "unlock the future," no listicles of vibes.
- Prefer the inventors' nouns. Prefer dates, units, case names, and figure
  numbers. Never dumb down; never inflate.
- Apply the same standard to HUD strings, parallel readings, term
  definitions, and schematic captions.

**Visuals and dual projection**

- Unique 2D pedagogical instrument and, when the mechanism is spatial, a 3D
  Three.js instrument built with `createThreeStudioScene`. Explicit
  dispatcher case. Unique `svgType` plus `SCHEMATIC_HINTS` so the schematic
  is not another patent's drawing.
- Callouts match facsimile figure letters/numbers; coordinates are 0–100.
- 2D and 3D share one physics bus (see §5b). Mute defaults to silent; the
  global audio singleton remutes on mount.
- Controls have accessible names, SI readouts, and a reduced-motion path.
- At least one independent claim is a live probe (Wright: toggle Claim 18
  coupling and watch adverse yaw appear).

### 5b. FrankenSim binding (how visuals stay honest)

The TypeScript `FrankenSimEngine` in `src/physics/engine.ts` is a **host
fallback**: closed-form SI toys for when WASM is not loaded. It is not
FrankenSim. The real engine is `~/projects/frankensim` compiled to WASM
(generic crates plus, for this one patent, a packaged flyer module).
Blake3 digests and typed refusal still apply.

**Wright has a packaged module. Most patents will not.** FrankenSim
happens to ship a Wright-specific stack (`fs-flyer`, `fs-flyer-wasm`,
and the host-pumped app `~/projects/frankensim/apps/wright-flyer`).
That app is the **transport** reference: capability probe, leased-ring
or transferable fallback, host-fed clock, bounded catch-up, no
`std::time` on wasm32. It is not a requirement that every new patent
wait for a ready-made `fs-<patent>` crate, a `*-wasm` package, or a
dedicated `apps/` demo. Do not skip WASM, or collapse to a decorative
CSS rotate, because no one has wrapped Otto or Tesla or Fermi as a
single productized module.

**Compose the generic crates that already own the law.** Look at the
claimed mechanism, then bind the FrankenSim modules that compute that
kind of physics. Typical mappings (compose more than one when the
claim couples domains):

- Rigid machines, cams, cranks, governors, linkages, rotors:
  `fs-time` + `fs-mbd` (+ `fs-constraint` / `fs-contact` when joints
  or impacts matter). Howe shuttle, Otto crank, Pelton runner, Otis
  drum, Westinghouse triple-valve.
- Guy-wires, frames, trusses: `fs-truss` (Wright stay-wires are the
  teaching case even though the flyer also has a packaged aero kernel).
- Electromagnetic fields, flux, LC, solenoids, rotating B:
  `fs-flux` and, when the drawing is a complex, `fs-feec`. Tesla motor
  and coil, Bell, Morse, Marconi.
- Heat, radiation, phase change, absorption cycles:
  `fs-conduction`, `fs-convection`. Edison filament, Einstein–Szilard,
  Spencer cavity loss, Carrier, Linde.
- Continuum solids, fibers, rupture: `fs-solid`. Kwolek, Goodyear
  when treated as a deforming body.
- Lattice / kinetic / reaction-diffusion / hole injection / neutrons:
  `fs-lattice`. Fermi 6-group kinetics, Bardeen injection, Goodyear
  cross-link count.
- Airflow over a shape: `fs-airflow`, `fs-lbm`, `fs-airfoil`. Do not
  invent pretty vortices the crate will not stand behind.
- Materials as named cards, not magic numbers: `fs-matdb`.
- Intervals, regimes, probes: `fs-ivl`, `fs-regime`, `fs-probe`.

A patent-specific crate is allowed only when the generic modules
cannot express the claimed law, and even then it should sit **on top
of** those generics the way `fs-flyer` sits on `fs-time` + `fs-mbd`.
Until a WASM instance of those crates is actually wired and stepping,
keep an honest TypeScript host fallback that calls the same SI step
the faces already use. Name the target crates in the registry from
day one. Absence of a packaged demo is not a reason to give up.

Do not label a HUD "WASM Core" / `aero (wasm)` / `kernel (wasm)` unless a
WASM instance actually stepped the state on this tick. A closed-form
TypeScript evaluation must say so (`ts-lie-fallback`, `host SI`, or the
actual function name). Wright's 3D reads `flyerKernelSource()` /
`flyerAeroSource()` after `ensureFlyerWasm()` and displays whatever those
helpers return. That honesty rule is the same for a composed
`fs-flux` + `fs-mbd` Tesla step as it is for the flyer module.

**One bus, catalog patent id.** For every patent, sliders on the 2D sim,
sliders on the 3D sim, schematic callouts, `PhysicsTelemetryBadge`, weave
surfaces, and any audio tone read and write the same catalogue `patentId`
parameter map (`usePatentPhysics("us-821393-wright-flyer")`, never a
substring or a private store) and the same latest telemetry envelope.
Dragging the Wright warp on the 3D HUD must move the 2D wing tips,
highlight Fig. 4's warped margins, change induced-drag newtons in the
badge, and light the spec-clause weave on the same frame.

If a 3D HUD uses a private slider name (`fireRateRpm` vs registry
`firingRate`), register a param alias in `src/physics/paramAliases.ts`
so both faces store and read one number. Do not keep two live values.

**Kernel owns the law; React owns presentation.** Put the SI step in a
dedicated kernel module (Wright: `src/physics/wrightKernel.ts`; catalog
machines: `src/physics/catalogKernels.ts` / `machineKernels.ts`). The
rAF / `TickScheduler` pumps `step(dt, controls) → telemetry`. React does
not re-derive lift, slip, k_eff, Stefan–Boltzmann, or display ω in the
component. If the HUD prints a number, the kernel emitted it.

Leftover presentation constants belong on the step too:

- Shaft / crank / runner / propeller rates go through `rpmToOmega` or a
  named `omegaRadPerS` / `omegaDegPerS` field.
- When real SI is too fast to watch (Tesla field, De Laval bowl, Parsons
  rotor, Bell acoustic), emit a named `*DisplayOmega*` /
  `*DisplaySpeed*` / `*DisplayMs` field. A presentation clock may exist
  only when it integrates that kernel rate. Do not invent a second
  formula in the mesh loop.
- Printed-spec mesh counts (Gramme 36 coils, Hollerith 40 dials) are
  mount-time constants. Do not remount WebGL when they have not changed.

**Host-fed time.** Prefer `TickScheduler` (Wright transport) or
`THREE.Clock.getDelta()` / `performance.now()` when the kernel needs a
real dt. Do not fake `dt = 1/60` and then multiply by `renderedSteps` as
if that were physics. Do not put a live kernel object, a `useRef`
`.current`, or a freshly allocated controls object in a WebGL setup
effect's dependency list; that remounts the canvas every frame
(`[live.current]` is a known footgun). Sync live numbers through
`useLiveSimParams` (stable ref, layout-effect write).

**2D is an orthographic reduction of the same bodies/fields as 3D**, not
a second formula. Dual kernels are a defect: if 2D uses `1/(2f)` and 3D
uses `0.8/f` and the badge uses `1/(3f)`, pick the governing relation
and put it on the shared step.

**Engine wrappers must spread catalog fields.** If
`FrankenSimEngine.stepWrightFlyer` (or the named `engineMethod`) exists,
it must call and return the same fields as the kernel the faces use. Do
not advertise a method the engine does not implement.

**Claim-linked probes.** At least one independent claim is a live switch
or readout: enable/disable Wright hip-cradle coupling (`coupled`) and
watch `adverseYawDominant` appear; open Tesla's 2-phase vs 3-phase
circuits and watch the B-vector locus become a circle; withdraw Fermi's
cadmium rods and watch the kernel refuse past a documented k_eff bound.
The visual argues the claim. Decorative particles that ignore the claim
are a failed visual. Wright also weaves spec phrases
(`specClausesFor`) so a live warp lights "twisted or warped in opposite
directions" on the source face.

**Field and body samples, not stickers.** Where the domain is a field
(Tesla flux, Farnsworth raster, Spencer cavity, Noyce depletion,
Kwolek nematic), WASM writes a flat f32 buffer once per tick and the
renderer drains it once into a `DataTexture`, SVG path, or line
segments. Where the domain is a machine (Howe shuttle, Engelbart
wheels, Lincoln bellows, Wright airframe), WASM writes joint angles /
rigid poses and the mesh follows. Do not keyframe a lookalike motion
and print a formula beside it.

**Refusal is a museum label.** When the kernel refuses (stall, Hull
cutoff, supercritical pile, ruptured aramid, vacuum loss), freeze the
illegal step, show the reason and Blake3 digest, and keep the last
legal pose. Do not silently clamp and keep animating.

**Sound is a transducer.** Bell, Morse, Marconi, Tesla coil, Spencer,
and Lamarr tones come from the latest current / voltage / hop / spark
sample. They are not canned one-shots. Default muted; remute on mount.

**Deterministic replay.** Control history is a tape. A visitor can
scrub "the same Kitty Hawk warp sequence" or "the same 88-key hop
roll" and get the same digest. That is the point of Blake3 and
host-fed time. Do not call `Math.random` in a frame loop; Wright's
streamlines use a deterministic hash of particle index.

**Capability honesty.** Probe `crossOriginIsolated` / SharedArrayBuffer
the way `apps/wright-flyer` does. Isolated tabs may use shared-memory
transport; everyone else gets transferable buffers and a visible
"compatibility mode" line. Never require COOP/COEP to render the page.
Never invent theater (CSV export, QR codes, downloadable receipts,
fake impact scores) as a substitute for a missing kernel.

**New-patent physics checklist**

1. Write a dedicated SI step (Wright: `stepWrightFlyerSi`) with typed
   controls and a typed state. Register `PATENT_PHYSICS_REGISTRY[id]`
   with SI controls, one governing equation, an `engineMethod` that
   actually exists on `FrankenSimEngine`, and `computeMetrics` that
   call that same step (WASM if present, TS fallback otherwise).
2. Bind 2D, 3D, schematic, badge, spec-clause weave, and audio to
   `usePatentPhysics(id)`. No private `useState` copies of the same
   slider. Add param aliases if a face needs a local name.
3. Map each independent claim to a probe, constraint, or readout.
   Wright's `coupled` control is labeled "Claim 18 rudder linkage".
4. Name **and try to bind** the generic FrankenSim crates that own
   the law (`fs-mbd`, `fs-flux`, `fs-conduction`, …), even while only
   the TS fallback is stepping. Do not wait for a packaged
   `fs-<this-patent>` module. Compose what exists in
   `~/projects/frankensim/crates`. Write a patent-specific crate only
   when those generics cannot express the claim.
5. Emit leftover SI the HUD will print: ω, display ω, cycle periods,
   currents, temperatures. Prefer `rpmToOmega` for rotating machines.
6. Document the refusal boundary (what the kernel will not pretend to
   simulate).
7. Keep the bus id identical to the catalogue id. Substring matching
   (`includes("wright")`) is a defect.

See [`docs/FRANKENSIM_WASM_INTEGRATION_TODO.md`](./docs/FRANKENSIM_WASM_INTEGRATION_TODO.md)
for the per-patent crate map and
[`docs/FRANKENSIM_VISUAL_WEAVE_WORKLIST.md`](./docs/FRANKENSIM_VISUAL_WEAVE_WORKLIST.md)
for the visual-weaving backlog.

### 5c. Three.js craftsmanship (Wright airframe quality)

A spatial patent is unfinished until the 3D face is a studio model of
the claimed machine, not a hero render.

- **Three.js only**, through `createThreeStudioScene`
  (`src/components/patents/visuals/three/ThreeStudioScene.ts`). Do not
  introduce a second renderer, a CSS-only fake 3D, or a stock GLTF
  downloaded from a marketplace.
- **Model from the drawings.** `buildWrightFlyerAirframe` encodes span,
  gap, canard, twin rudders, and the hip cradle from US 821,393 / the
  1903 machine. Later machines follow the same pattern
  (`ottoEngineModel.ts`, `peltonWheelModel.ts`): procedural parts named
  after the specification, updated by `update*Kinematics(state)` from
  the shared step. Photograph and plan references belong in comments
  or the provenance receipt, not as unlicensed binary assets.
- **HUD is a museum label.** Use `StudioKernelChips` (or the Wright
  equivalent) to show kernel source (`wasm` vs `ts-lie-fallback`), the
  live SI readouts, and the claim probe. Colorized equations bind to
  the same telemetry keys.
- **Camera and cutaway.** When internals matter (Otto slide valve,
  Corliss wrist-plate, Fermi pile), give named camera presets and a
  cutaway mode. Wright exposes streamlines and force vectors that
  scale from `liftNewtons` / `totalDragNewtons` / `netYawNm`.
- **Do not remount the canvas** to change a slider. `useLiveSimParams`
  holds the live numbers; the rAF loop reads the ref. Printed-spec
  constants stay out of the setup dependency list.
- **Reduced motion** pauses auto-fly / spin and still shows the posed
  machine at the current controls. Mute is silent by default.

### 6. Transcribe against the facsimile (tool-agnostic, Wright quality)

There is no required OCR engine. Use whatever can read the pinned PDF:
the existing `focr` pipeline, another OCR tool, the PDF text layer, the
harness or model's built-in vision, or typing from the facsimile. The
method is not the product. The reviewed ledger and the archival edition
are.

A machine draft is a research aid. It is **not** the visitor-facing
source face, **not** a substitute for the archival edition, and **not**
automatically served. Do not promote a raw OCR run, a vision dump, or a
PDF text layer to `kind: "reviewed-transcription"`.

1. Confirm the local PDF is the intended grant (`pdfinfo`, representative
   pages, SHA-256). `bun run pipeline:download` can copy it into
   `artifacts/raw_pdfs/<id>.pdf` if you want a working cache; it does not
   replace an existing cached file.
2. Produce a complete page-by-page reading of every sheet, including
   drawing-sheet titles, witness and inventor lines, and every printed
   claim. Then **revise that draft against the facsimile**, page by page,
   before any line enters the reviewed ledger, the archival edition,
   `originalText`, or claim data.
3. Write `public/patents/transcripts/<id>-reviewed.txt` with the ordered
   marker sequence
   `--- REVIEWED TRANSCRIPTION PAGE k OF N ---`
   (`validateReviewedTranscription`). Pin the same SHA-256 on the asset
   and the edition. The Wright ledger
   (`public/patents/transcripts/us-821393-wright-flyer-reviewed.txt`) is
   the quality exemplar.
4. Quality-control to that exemplar. The published text must read as a
   careful human transcription of the grant, not as OCR output. Forbidden
   leftovers include:

   - Mid-word hyphens from line wrapping (`aero- planes`, `inven- tion`,
     `equilib- rium`). Rejoin the word unless the facsimile itself
     hyphenates it.
   - Broken line endings that split a sentence into one-word lines, or
     that glue two paragraphs together.
   - Garbled long-s / worn type (`fi`/`fl` ligatures read as nonsense,
     `rn` as `m`, `cl` as `d`).
   - Invented, dropped, or reordered words, claim numbers, figure labels,
     inventor names, or dates.
   - Modernized spelling or punctuation the grant does not use, and the
     opposite: leftover machine tokens, confidence marks, or page-banner
     junk inside a paragraph.
   - Scan-page furniture copied into the archival edition
     (`3 SHEETS—SHEET 1`, `--- REVIEWED TRANSCRIPTION PAGE`, running
     headers). Those locators stay in the ledger and the provenance
     receipt; the visitor-facing edition is continuous prose.

5. After cleanup, re-read the ledger and the edition against the PDF
   once more. If a line would look wrong next to Wright's transcript,
   it is not done. Record the transcription method and the review date
   in the provenance receipt; do not treat the method as evidence of
   correctness.

### 7. Verify the complete vertical slice

Run these checks after the record, assets, and visuals are in place:

```bash
bun run pipeline:verify
bun run typecheck
bun run lint
bun run format
bun run build
ubs --diff
ubs --staged
```

Also run the new edition and visual tests (Wright / Tesla as the pattern):

```bash
bun test src/data/editions/<name>Edition.test.ts
bun test src/data/editions/manualEditionPublicationContract.test.ts
bun test src/components/patents/visuals/dispatcher.test.ts
bun test src/components/patents/visuals/three/<name>Visual.test.ts
```

Exercise the shared kernel from the command line when the numbers matter
(Wright: `stepWrightFlyerSi` lift / induced drag / `coupledRudderDeg`;
Tesla: `ns = 120f/P`; Fermi: `k_eff` refusal). A bun-exec of the step
function is cheaper than a guess.

Manually verify the new `/patents/<id>` page the way a visitor would:

- The route 200s. The correct local PDF loads. Metadata is specific.
- The archival edition is the source face: continuous, with figure-crop
  previews, term annotations, and every printed claim. Scan-page banners
  do not appear.
- Parallel readings exist for every paragraph. Claim decoders match the
  edition text.
- The visual is this patent's visual, not the Wright fallback. 2D and 3D
  share sliders. Toggling the claim probe changes the SI readout on the
  same frame. The badge does not say WASM unless a module stepped.
- Catalogue, timeline, and adjacent-record nav find the new id.
- Keyboard, 320px, reduced-motion, and mute-default all work.

If visual code changed, run the relevant visual/E2E audit too. Fix
failures at the source; never weaken the gate, delete artifacts, or
suppress evidence merely to obtain a green result. A green typecheck or
build establishes only software integrity; record the separate editorial
acceptance result for source provenance, transcript/claim coverage,
figure fidelity, accessible controls, and the actual 320px/keyboard
behavior.

Do not "fix" a stale `generateStaticParams` 404 by deleting `.next`
without written permission. Restart the existing `next dev` or wait for
a clean rebuild. Do not start a second `next dev` while one is already
bound.

### 8. Coordinate and land safely

In a shared session, create/update the Beads task, reserve the exact paths via
Agent Mail before editing, preserve others' changes, and release the
reservation once complete. Do not create a branch unless explicitly asked.
Do not edit peer WIP (if another agent holds Carrier, Linde, Tesla
Teleautomaton, or any other in-progress record, leave those files alone,
including live-ref patterns you disagree with). Never revert or clobber
unrecognized working-tree changes.

Before deployment, ensure the checks above are green. Deploy only with the
verified local prebuilt Vercel workflow and only when deployment is within the
requested scope:

```bash
bun scripts/verified-production-deploy.ts
```

Never call `vercel deploy --prebuilt --prod` directly. The verified entry point
takes an exclusive local deployment lock, refuses a dirty worktree or any other
active build, runs the quality gates, checks that `vercel build` created a full
Build Output API artifact, deploys with `--skip-domain`, exercises the Wright
detail page and its complete source-text endpoint on that isolated deployment,
and only then aliases both `classic-patents.com` and
`www.classic-patents.com`, plus `classic-patents.vercel.app`. A failed check
leaves the existing public aliases unchanged. The shared `.next` and
`.vercel/output` directories make concurrent builds and direct prebuilt deploys
unsafe.

Report the source provenance, files added/changed, transcription method and
review boundary, verification results, editorial acceptance, and any
remaining review or deployment step.
Never delete PDFs, transcripts, caches, `.next`, or source modules as part of
this workflow without the user's explicit written permission.

### Definition of done (Wright-quality new patent)

A new record is ready to publish only when all of the following are true:

1. Provenance receipt exists and lists SHA-256, page count, rights basis, and
   a facsimile-page map.
2. Pinned PDF, reviewed ledger (`-reviewed.txt` with page markers), archival
   edition, and `originalTextAsset` share one SHA-256. The ledger has been
   revised against the facsimile to Wright quality: no mid-word OCR
   hyphens, no broken line endings, no garbled type, no dropped claims.
3. Edition validates, contains every printed claim (or an attested absence),
   local figure crops, term annotations, and parallel readings for every
   paragraph. The edition test pins those facts.
4. Catalogue record identity, excerpt, claim decoders, Plain English, drawings,
   and historical context meet §5a. Claims' `originalText` is read from the
   edition. `stats` match the claim array. `patentWars` is documented or `[]`.
5. Colorized equations exist for the scientific principles and bind to live
   telemetry.
6. `PATENT_PHYSICS_REGISTRY[id]` calls a real shared step. 2D, 3D, schematic,
   and badge share `usePatentPhysics(id)`. At least one independent claim is
   a live probe. The registry names the generic FrankenSim crates that
   should own the law and the visual binds them when a WASM build exists;
   it does not stall for a packaged per-patent module. HUD does not say
   WASM unless a module stepped.
7. Unique 2D visual, Three.js 3D (when spatial) via `createThreeStudioScene`
   and a procedural `*Model.ts`, explicit dispatcher case, unique `svgType`.
8. `dispatcher.test.ts`, the edition test, the publication-contract test, and
   the visual test pass. `/patents/<id>` was exercised in the browser at
   desktop and 320px.

---

## Vercel Deployment Standards

Vercel CLI is installed and authenticated as `dicklesworthstone`.

```bash
# Runs the local quality gates, creates a fresh prebuilt artifact, validates an
# isolated production deployment, then promotes both public hostnames.
bun scripts/verified-production-deploy.ts
```

**Rule**: Always use the verified `--prebuilt` workflow to avoid burning cloud
build minutes and to prevent a stale `.vercel/output` directory from becoming
live. Do not run a direct Vercel build or deploy while another build is active.
`vercel.json` has `{"git": {"deploymentEnabled": false}}`.

---

## Beads Issue Tracking

Use `br` (beads_rust) for task tracking and backlog management. **`br` never runs git.** After changes, sync and stage manually.

```bash
br ready
br list --status=open
br show <id>
br create --title="..." --type=task|bug|feature|epic --priority=2
br update <id> --status=in_progress
br close <id> [--reason "..."]
br dep add <issue> <depends-on>
br sync --flush-only
git add .beads/
```

---

## MCP Agent Mail — Multi-Agent Coordination

In multi-agent sessions:
- Register agent: `ensure_project` → `register_agent`
- Reserve paths before editing: `file_reservation_paths(..., exclusive=true, reason="br-###")`
- Thread communication via `macro_start_session`, `macro_prepare_thread`
- Never revert or clobber unrecognized working tree changes from peer agents.

---

## Code Quality & Verification

After substantial code changes:

```bash
# Typecheck
bun run typecheck

# Lint & Format
bun run lint
bun run format

# Build verification
bun run build

# Bug scanner
ubs --diff
ubs --staged
```

---

## Session Completion ("Landing the Plane")

Before finishing a work session, you MUST:
1. Ensure all TypeScript types pass (`bun run typecheck`).
2. Verify Next.js production build succeeds (`bun run build`).
3. Run Biome lint & format (`bun run lint`).
4. Update beads (`br sync --flush-only` and `git add .beads/`).
5. Summarize changes, verification results, and next actions.
