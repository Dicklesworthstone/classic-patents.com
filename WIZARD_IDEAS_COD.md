# Classic Patents — 30 Improvement Ideas, Winnowed to Five

## Evidence boundary

This planning memo relies only on the independent study snapshot completed before this request. File pointers are evidence observed in that snapshot, not a claim that the concurrently shared worktree is unchanged. The highest-value work is to make the museum's archival authority demonstrable, then preserve it with automated verification and expose it accessibly.

## 30 concrete candidates

| # | Area | Improvement |
|---:|---|---|
| 1 | Integrity | Add a per-patent provenance manifest: canonical source URL, retrieval date, SHA-256, page count, public path, and review status. |
| 2 | Integrity | Make the download script fetch a canonical remote source and write through one declared archive path, never a browser-relative URL. |
| 3 | Integrity | Make OCR actually invoke a pinned `focr` command and retain raw page output, normalized text, and tool/model version. |
| 4 | Integrity | Add page, figure, and claim source locators plus `machine`/`human-checked`/`primary-source-verified` status. |
| 5 | Correctness | Parse every record through a runtime schema and enforce IDs, dates, claim numbering, asset paths, stats, and nonempty alternatives. |
| 6 | Correctness | Check full-document coverage and expected pages/claims rather than accepting nonempty transcript strings. |
| 7 | Transparency | Put a compact provenance legend in each header: original evidence, normalized transcription, and editorial analysis. |
| 8 | Maintainability | Generate archive indexes, artifact paths, and validation inputs from the manifest instead of separate hand-maintained inventories. |
| 9 | Pedagogy | Replace the generic schematic with patent-specific source-aligned vector/raster drawings keyed by `svgType`. |
| 10 | Pedagogy | Link every callout to an exact figure crop plus source-text and Plain English anchors. |
| 11 | Pedagogy | Synchronize source text, claims, callouts, and Plain English highlights in split view. |
| 12 | Pedagogy | Add an explicit “model assumptions and omissions” panel to every simulator. |
| 13 | Accessibility | Give each diagram/simulator an equivalent textual relationship table and mechanism narrative. |
| 14 | Accessibility | Add keyboard pin navigation, visible focus, correct dialog focus management, and an Escape/return-focus contract. |
| 15 | Accessibility | Respect reduced motion, pause nonessential animation, and provide a genuine high-contrast mode. |
| 16 | Responsive UX | Implement the mobile navigation suggested by the existing header state, or remove that state and expose routes another way. |
| 17 | Responsive UX | Persist theme before paint and either expose the declared light mode or remove its unsupported type. |
| 18 | Performance | Dynamically import only the selected simulation instead of statically importing the entire visual catalog. |
| 19 | Performance | Construct Three.js scenes once; update controls through refs in the animation loop. |
| 20 | Performance | Pause WebGL off-screen/when hidden and cap DPR according to device and reduced-motion preferences. |
| 21 | Reliability | Use a shared Three.js disposer for geometries, materials, textures, renderers, and all listeners. |
| 22 | Correctness | Replace randomized historical simulation behavior with a documented deterministic model, or label it illustrative. |
| 23 | Maintainability | Replace the dispatcher switch/fallback with a typed visual manifest containing modes, fallback, and accessibility metadata. |
| 24 | Verification | Add data-domain unit tests for registry uniqueness, provenance, asset hashes, claim/stats consistency, and coverage. |
| 25 | Verification | Add Playwright paths for catalog controls, generated routes, view modes, PDFs, dialogs, keyboard use, and non-WebGL fallbacks. |
| 26 | Verification | Add deterministic simulator tests that assert causal control-to-telemetry behavior and resource cleanup. |
| 27 | Verification | Put typecheck, Biome, data validation, tests, and production build in CI. |
| 28 | Maintainability | Split archival editorial data from presentation choices and derive repeated totals and catalog metadata. |
| 29 | Reliability | Handle Clipboard/Web Audio failures, stop shared audio on unmount, and show enhancement failures clearly. |
| 30 | Discoverability | Add source-aware timeline/taxonomy filtering with shareable query parameters and recovery links for zero results. |

## Winnowing method

Candidates were hard-cut if they were chiefly cosmetic, speculative content expansion, or subsumed by a stronger foundation. The survivors were scored 1–5 using the idea-wizard rubric. `Useful` and `Pragmatic` count 2x, `Accretive` 1.5x, and the mean of robustness, reliability, performance, intuitiveness, user benefit, ergonomics, and compellingness counts 1x. Score = `(2U + 2P + 1.5A + other) / 6.5`.

| Rank | Finalist | U | P | A | Other | Score | Reason it survives |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | Evidence-backed archival truth chain | 5 | 4 | 5 | 4.7 | 4.65 | Protects the differentiator and enables all factual QA. |
| 2 | Enforced verification ladder and CI | 5 | 4 | 5 | 4.5 | 4.62 | Makes correctness durable for every future patent and visual. |
| 3 | Faithful, source-linked diagrams | 5 | 3 | 5 | 4.3 | 4.38 | Repairs the core pedagogical surface promised by the product. |
| 4 | Accessible progressive enhancement | 5 | 4 | 5 | 4.0 | 4.35 | Makes the museum genuinely usable without pointer, motion, or WebGL access. |
| 5 | On-demand, stable simulator runtime | 4 | 4 | 5 | 4.2 | 4.26 | Keeps the flagship experience fast as the visual collection grows. |

The recommended dependency order is **1 → 2 → 3/4 → 5**: make the evidence traceable, enforce it, expose it clearly to every visitor, then optimize the expensive enhancement layer.

## Finalists

### 1. Evidence-backed archival truth chain

**Problem/evidence.** The studied OCR script detects and reports `focr`, but writes the already-authored `patent.originalText` to a Markdown artifact rather than OCRing a PDF (`scripts/ocr-patents.ts:15-52`). The downloader writes to `artifacts/raw_pdfs` while consuming a browser-relative `originalPdfUrl` (`scripts/download-patents.ts:15-41`); the runtime/verification asset lives under `public/patents/pdfs` (`scripts/verify-data.ts:43-59`). The study found 12 public PDFs but only 8 OCR transcript artifacts. That gap is critical because the product asserts verified archival transcripts.

**Minimal implementation direction.** Add an archive manifest per patent with canonical remote URL, retrieval metadata, SHA-256, page count, public serving path, and provenance/review status. Have download use that remote URL and one declared final path. Have OCR consume the manifest, invoke a pinned command, retain raw per-page output, and produce normalized text with page/claim locators. Keep editorial Plain English material separate from source-derived data.

**Expected benefit.** Each displayed archival claim becomes independently traceable and reproducible; future source refreshes and human review have an auditable basis.

**Risk.** Medium–high: scan quality and manual verification make migration real editorial work. Pilot an early and late patent, retain current data during transition, and visibly mark unreviewed entries.

**Priority.** **P0 — first.**

### 2. Enforced verification ladder and CI release gate

**Problem/evidence.** The studied verification script checks nonempty identity fields, date format, one independent claim, and a local PDF above 1 KB (`scripts/verify-data.ts:18-109`). It has no runtime schema, no source coverage or hash check, and no relationship checks such as rendered claims versus `stats`. The source inventory found no test files or test runner; `package.json` offers typecheck/lint/build/data verify but no unit or end-to-end test command. The study also observed records that render selected claims while advertising a larger total, exactly the sort of mismatch a relational validation gate should make explicit.

**Minimal implementation direction.** Parse the archive manifest and `Patent` records through a runtime schema. Add domain-unit tests for identity, hashes, paths, page/claim locations, coverage, and statistics. Add Playwright checks for every generated route, catalog controls, view switching, PDF availability, dialogs, keyboard paths, and visual fallbacks. Make CI run these contracts plus `tsc`, Biome, data validation, and production build. Use fixture-backed OCR tests in CI; reserve full OCR regeneration for a deliberate maintainer workflow.

**Expected benefit.** Broken sources, shortened transcripts, route errors, mismatched metadata, and key accessibility regressions fail before release. It is the main maintainability multiplier for a growing archive.

**Risk.** Medium: fixtures and browser setup add initial cost. Prefer semantic contract tests and deterministic telemetry over brittle pixel snapshots.

**Priority.** **P0 — directly after finalist 1's pilot.**

### 3. Faithful, source-linked diagrams

**Problem/evidence.** The data model exposes `svgType` and positioned callouts (`src/types/patent.ts:29-43`), but the studied schematic viewer draws one hard-coded ellipse/rectangle/circle frame regardless of patent type (`src/components/patents/InteractiveDiagramViewer.tsx:69-104`). It positions pins on that frame, and its “USPTO Specification Reference” is synthesized from labels instead of resolving source text (`InteractiveDiagramViewer.tsx:143-162`). This undercuts the central promise of reconstructed, educational patent drawings.

**Minimal implementation direction.** Define a `PatentDiagram` keyed by `svgType`: source image/SVG, page/figure identity, intrinsic geometry, callout regions, transcript anchors, concise alt text, and a relationship-table fallback. Start with Wright and Noyce. Selecting a pin should show the exact source excerpt and its Plain English interpretation, both with stable citations. Use raster overlays when accurate vectorization is not yet warranted; never present an unsupported generic drawing as a reconstruction.

**Expected benefit.** The visitor can follow source figure → reference numeral → specification → mechanism, which makes the diptych substantively synchronized and historically credible.

**Risk.** Medium–high: accurate source alignment needs editorial review. Start with a small vertical slice and require an evidence/review checklist before adding diagrams.

**Priority.** **P1 — first major user-facing slice after P0.**

### 4. Accessible progressive enhancement for every mechanism

**Problem/evidence.** The central experience relies on client state, WebGL, animation, and pointer-selected pins. The diagram has visual pin buttons but no observed nonvisual structural equivalent (`InteractiveDiagramViewer.tsx:106-193`); flagship Three.js views use raw canvas with mouse/wheel orbit (`WrightFlyer3D.tsx:305-438`). The header hides navigation below the desktop breakpoint while retaining mobile-menu state (`src/components/layout/Header.tsx:8-12,28-76`), and the studied glossary modal had no observed focus trap, Escape behavior, or focus restoration (`ArchaicGlossaryModal.tsx:95-129`).

**Minimal implementation direction.** Establish shared accessible primitives: landmarks/skip link, working mobile navigation, visible focus, dialog semantics with Escape/focus return, reduced motion, and a genuine high-contrast control. Every visual must ship with a keyboard-operable component/relationship table and “mechanism in words” fallback; its controls must update text/telemetry even if WebGL fails.

**Expected benefit.** The museum stays useful for keyboard, screen-reader, touch, motion-sensitive, low-power, and non-WebGL visitors. The text fallback also improves learning and testability for everyone.

**Risk.** Medium: piecemeal status announcements and dialogs can become noisy. Implement primitives once and protect them with keyboard-first E2E tests.

**Priority.** **P1 — alongside the first faithful diagram slice.**

### 5. On-demand, stable WebGL simulator runtime

**Problem/evidence.** The studied dispatcher statically imports every 2D and 3D visual before selecting one (`src/components/patents/visuals/index.tsx:4-21,54-100`). In the Wright renderer, control state and derived outputs recreate scene, renderer, geometry, and listeners through one effect (`WrightFlyer3D.tsx:67-93,430-451`); Tesla follows the same construction pattern (`TeslaMotor3D.tsx:35-55,317-326`). Slider interaction therefore has a broad and potentially expensive lifecycle.

**Minimal implementation direction.** Use a typed visual manifest with `next/dynamic` entries plus named loading/error/text fallbacks. In each Three.js visual, build the scene and listeners once per mount; keep live controls in refs and apply them during animation. Add one lifecycle helper to dispose GPU resources, cap DPR, and pause on `document.hidden` or off-screen. Measure initial JavaScript, frame time, GPU memory, and teardown before/after the first migration.

**Expected benefit.** Faster initial patent pages, smoother controls, reduced battery/GPU use, and a repeatable visual architecture as more patents arrive.

**Risk.** Medium: ref-driven animation can introduce stale-state or cleanup bugs. Migrate one flagship first, add teardown and control-to-telemetry tests, and retain a text/vector fallback.

**Priority.** **P2 — after P0; elevate to P1 if mobile profiling confirms jank or memory pressure.**

## Deferred but retained

The remaining candidates are not discarded. Ideas 7–8, 11–12, 15–17, 20–23, and 28–30 become cheaper and safer after the five finalists establish traceable evidence, executable contracts, faithful diagram primitives, accessible fallbacks, and scalable delivery. In particular, deterministic historical behavior (#22) should be required whenever a simulation is revised: illustrative randomness must never be implied to be historical reconstruction.
