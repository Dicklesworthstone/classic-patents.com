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

The project solves a major historical and educational deficit: original patents represent humanity's greatest technical leaps, yet they are trapped in degraded scanned PDFs and impenetrable 19th/20th-century legal prose. Classic Patents extracts them with ultra-high fidelity OCR (`focr`), transcribes the full specifications and claims, reconstructs original diagrams into modern interactive SVG/Canvas simulations, and provides a synchronous **"Plain English" engineering breakdown** that explains the genuine physics, mechanics, and chemistry without dumbing anything down.

The single source of truth is [`COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md`](./COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md). Read it before modifying schemas, adding new patent entries, or restructuring visual components.

---

## Product Shape & Tech Stack

The web application is built with:

1. **Web Frontend**: Next.js 15 (App Router, React 19, TypeScript).
2. **Styling & Aesthetics**: Tailwind CSS with custom thematic extensions (Parchment vintage archival mode, Blueprint dark engineering mode, High-contrast clean mode). Google Fonts (Playfair Display, EB Garamond, Inter, JetBrains Mono).
3. **Interactive Visual & Simulation Engine**: React Three Fiber / Three.js 3D WebGL modules backed by **FrankenSim** (`~/projects/frankensim`) computational physics compiled to WebAssembly. Simulations leverage Lie-group time integration (`fs-time`, `fs-mbd`), discrete de Rham electromagnetics (`fs-flux`), lattice particle kinetics (`fs-lattice`), thermal transport (`fs-conduction`), and continuum elasticity (`fs-truss`, `fs-solid`) with Blake3 state digests and typed refusal boundaries.
4. **Data & Pipeline**: TypeScript data schemas (`src/data/patents/`), automated downloading (`scripts/download-patents.ts`), and OCR extraction scripts integrating `focr` (`scripts/ocr-patents.ts`).
5. **Hosting & Deployment**: Vercel (CLI-managed, prebuilt deploy workflow, zero build credit burn).
6. **Code Quality**: Biome (`biome check`, `biome format --write`), TypeScript (`tsc --noEmit`), UBS (`ubs --diff`, `ubs --staged`).

---

## The Classic Patents Engineering Doctrine

1. **Dual-Projection Parity (Diptych)**: Every patent page has two synchronized projections:
   - **Original Specification Face**: Exact historical text, claims, formal legal preamble, and digitized facsimile drawings.
   - **Plain English Engineering Face**: Lucid, rigorous, step-by-step mechanical/electrical/chemical breakdown, annotated claim decoders, historical context, and patent dispute analysis.
2. **Never Dumb Down**: Plain English does not mean childish oversimplification. Explain the exact equations, aerodynamics, vector math, vacuum physics, and semiconductor chemistry in intuitive, elegant terms.
3. **Interactive Visuals are Pedagogical Instruments**: Visuals are not decorative stock art. Every diagram must illustrate real mechanics (e.g. dragging the rudder adjusts aerodynamic yaw while wing warping twists the wing tips).
4. **Audited Physics Simulation (FrankenSim WASM)**: Interactive 3D and 2D components reflect genuine physical laws (aerodynamic induced drag, Maxwell vector flux, point-contact hole diffusion, 6-group delayed neutron kinetics, and Stefan-Boltzmann radiation). The presentation layer consumes typed SI telemetry from the simulation core (see [`docs/FRANKENSIM_WASM_INTEGRATION_TODO.md`](./docs/FRANKENSIM_WASM_INTEGRATION_TODO.md)).
5. **Data Integrity & Determinism**: All patent transcripts are validated against typed Zod/TypeScript schemas. No phantom claims or hallucinated patent dates.
6. **Aesthetics & Typography**: Museum-quality presentation. Pristine typography, balanced whitespace, beautiful dark/parchment/blueprint themes, and responsive design down to 320px mobile screens.

---

## How to Add a New Patent to the Library

Adding a patent is an archival, educational, and product change—not just a new
card in a list. The Wright brothers' *Flying-Machine* patent is the reference
implementation: [`src/data/patents/wright-flyer.ts`](./src/data/patents/wright-flyer.ts),
`public/patents/pdfs/us-821393-wright-flyer.pdf`, its registered id
`us-821393-wright-flyer`, and its matching 2D/3D visual modules. Follow every
applicable step below. Do not publish a partial or speculative record.

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
4. Create a provenance receipt at `docs/provenance/<id>.md` before authoring
   editorial copy. It must retain the source URL and retrieval date,
   public-domain/rights basis, SHA-256, page count, and exact PDF page locators
   for every quoted specification passage, claim, and drawing. Keep the raw
   facsimile, raw OCR, normalized transcription, and editorial explanation as
   separate layers; a later reviewer must be able to reproduce each layer
   without guessing.
5. Choose a stable, URL-safe id in this format:
   `us-<unpunctuated-number>-<short-kebab-title>`. For example, the Wright
   record uses `us-821393-wright-flyer`, its file is
   `us-821393-wright-flyer.pdf`, and its public route is
   `/patents/us-821393-wright-flyer`. Check `src/data/patents/` and
   `allPatents` first so the id, patent number, and title do not collide.

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
   readable, complete, and large enough to be a genuine document—not a
   placeholder, an HTML error page, or a different member of the patent family.
   Use `pdfinfo public/patents/pdfs/<id>.pdf` and review representative pages.
4. Do not modify or discard an existing source PDF merely because an OCR result
   looks surprising. Preserve the original and diagnose the pipeline or source
   provenance instead.

### 3. Author the typed canonical record

1. Create `src/data/patents/<short-name>.ts`, import `Patent` from
   `@/types/patent`, and export a named `Patent` constant. Use
   `wrightFlyerPatent` as the structural example; the canonical interface is
   `src/types/patent.ts`.
2. Complete every required `Patent` field, including identity, inventor data,
   `grantDate` and `filingDate` as real `YYYY-MM-DD` dates, era/category,
   descriptive metadata, the local PDF URL, external archival link,
   classification, original specification text, claims, drawings, engineering
   explanation, and historical context. Optional `tags` and `stats` are useful
   only when researched.
3. Treat `originalText` as a transcription of the facsimile, not a summary.
   Preserve legal wording, figure references, and paragraph meaning. A
   reviewed OCR draft can accelerate this work, but it is never authoritative
   on its own.
4. Do not represent an excerpt, a trailing ellipsis, or a curated claim subset
   as a complete or "verbatim" specification. For a complete library record,
   transcribe and review the full presented specification and every claim. If
   the product deliberately supports partial editorial coverage in the future,
   add an explicit reviewed coverage state and visitor-facing disclosure first;
   never infer completeness from the text or from `stats`.
5. Include every claim that the page presents. Claim numbers must be unique;
   at least one must be independent; and every `dependsOn` value must name an
   included claim. Each claim needs both exact `originalText` and a precise
   `plainEnglish` decoder with concrete `keyInnovations`.
6. Populate `plainEnglishExplanation` fully: overview, core mechanism,
   stepwise mechanical breakdown, scientific principles/equations where
   relevant, and present-day significance. The Wright Flyer exemplifies the
   expected depth: wing warping produces differential lift and induced drag,
   the coupled rudder counters adverse yaw, and the canard supplies pitch
   control.
   Keep a readable prose formulation with every equation; do not make a
   visitor's only explanation raw TeX. Any math-rendering work must provide an
   accessible text/MathML equivalent and a visible fallback for malformed
   formula input.
7. Populate `drawings` from actual patent figures. `figureNumber`, labels, and
   callouts must correspond to the facsimile; callout coordinates are
   percentages in the inclusive 0–100 drawing space. Populate
   `historicalContext` with the problem, prior-art limits, breakthrough,
   documented patent disputes (when applicable), impact, and an attributable
   fun fact. Do not claim a patent war where the record does not support one.

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
   creating a duplicate route.
4. Update the README catalogue and the comprehensive plan only when the new
   record changes their documented curated set, roadmap, or coverage claims.
   Keep those documents consistent with the registry; do not silently claim a
   patent is complete while its PDF, data, or visual is missing.

### 5. Build the pedagogical visual, not decorative art

Every published patent needs a real visual treatment. The Wright Flyer has a
2D `WrightFlyerSim.tsx`, a 3D `three/WrightFlyer3D.tsx`, and an explicit
dispatcher case; its controls model the patented roll/yaw/pitch relationship.

1. Build a domain-appropriate 2D SVG/Canvas simulator in
   `src/components/patents/visuals/` and, where the mechanism benefits from it,
   a 3D module in `src/components/patents/visuals/three/`. Expose real,
   explainable controls, state, units, safety bounds, and cause-and-effect
   feedback. Do not use a generic illustration in place of a mechanism.
2. Add lazy imports and an explicit `<id>` case to
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
4. Test both the 3D and 2D paths (when both exist), initial loading, controls,
   theme changes, keyboard/touch operation, narrow 320px viewports, and the
   explanatory connection between the visual and the record's claims. Every
   new visual must give controls accessible names, a keyboard-operable textual
   relationship/telemetry fallback, visible focus, and a reduced-motion path.

### 6. Acquire and review OCR artifacts

The repository already has local `focr` weights. Do not pull weights during a
normal patent addition and do not run competing OCR jobs.

1. Run `bun run pipeline:download`. For a local `originalPdfUrl`, it copies
   `public/patents/pdfs/<id>.pdf` to `artifacts/raw_pdfs/<id>.pdf`; it does not
   replace a cached file. Confirm the cached file matches the intended source.
2. Run `bun run pipeline:ocr` only when machine capacity permits. It renders
   each registered PDF as 300-DPI grayscale PNGs in
   `artifacts/ocr_raster_cache/<id>/`, reusing complete cached renders, then
   runs serial, bounded `focr ocr-batch` chunks. The default is eight pages per
   chunk (`OCR_PAGES_PER_BATCH`), so a completed chunk is durable even if a
   later one is interrupted; do not run chunks concurrently.
3. Every invocation creates (or resumes with `OCR_RUN_ID`) a separate ignored
   `artifacts/ocr_runs/<run-id>/` directory. It contains per-page Markdown
   checkpoints, partial assembled transcripts, and `progress.json` with the
   completed/failed count, observed pages/hour, and an ETA. It deliberately
   never overwrites the curated, tracked `artifacts/ocr_transcripts/` files.
   Use `OCR_PAGE_LIMIT` for a small quality pilot before a full run when the
   model or source scans are uncertain.
4. Keep OCR serial and low impact. Launch the driver with a low CPU priority;
   its one active child inherits that priority. On macOS, `ionice` is
   unavailable; use supported scheduling controls only if they do not starve
   the process. The installed `focr` batch JSON format delivers a chunk only
   at the end, which is why chunk size is the durability/throughput tradeoff.
5. Review checkpointed output page-by-page against the PDF before copying any
   text into `originalText` or claim data. OCR output carries an explicit
   non-authoritative header and is a research artifact, not content that the
   site automatically serves.

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

Also manually verify the new `/patents/<id>` page: the correct PDF loads, the
source and plain-English projections agree, every claim and callout is usable,
the visual is the new patent's visual rather than the Wright fallback, metadata
is specific to the patent, and the catalogue/timeline can find the record. If
visual code changed, run the relevant visual/E2E audit too. Fix failures at the
source; never weaken the gate, delete artifacts, or suppress evidence merely to
obtain a green result. A green typecheck or build establishes only software
integrity; record the separate editorial acceptance result for source
provenance, transcript/claim coverage, figure fidelity, accessible controls,
and the actual 320px/keyboard behavior.

### 8. Coordinate and land safely

In a shared session, create/update the Beads task, reserve the exact paths via
Agent Mail before editing, preserve others' changes, and release the
reservation once complete. Do not create a branch unless explicitly asked.
Before deployment, ensure the checks above are green. Deploy only with the
local prebuilt Vercel workflow and only when deployment is within the requested
scope:

```bash
vercel pull --yes
vercel build --prod
vercel deploy --prebuilt --prod
```

Report the source provenance, files added/changed, OCR boundary, verification
results, and any remaining review or deployment step. Never delete PDFs,
transcripts, caches, or source modules as part of this workflow without the
user's explicit written permission.

---

## Vercel Deployment Standards

Vercel CLI is installed and authenticated as `dicklesworthstone`.

```bash
# Pull settings + env
vercel pull --yes

# Build locally (saves Vercel build credits)
vercel build --prod

# Deploy prebuilt artifact
vercel deploy --prebuilt --prod
```

**Rule**: Always use the `--prebuilt` workflow to avoid burning cloud build minutes. `vercel.json` has `{"git": {"deploymentEnabled": false}}`.

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
