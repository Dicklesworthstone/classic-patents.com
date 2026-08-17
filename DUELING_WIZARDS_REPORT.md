# Dueling Idea Wizards — Classic Patents

## Scope and method

This report records a three-model fresh-eyes review performed against the shared, moving
working tree on 2026-08-17. Each reviewer independently studied the repository and produced
30 candidates, narrowed them to five finalists, scored the other two sets, then reacted to
the criticism. The source artifacts are retained alongside this report:

- `WIZARD_IDEAS_CC.md`, `WIZARD_IDEAS_AGY.md`, `WIZARD_IDEAS_COD.md`
- `WIZARD_SCORES_CC_ON_OTHERS.md`, `WIZARD_SCORES_AGY_ON_OTHERS.md`,
  `WIZARD_SCORES_COD_ON_OTHERS.md`
- `WIZARD_REACTIONS_CC.md`, `WIZARD_REACTIONS_AGY.md`,
  `WIZARD_REACTIONS_COD.md`

Requested model assignment and actual execution:

| Role | Requested | Executed | Notes |
|---|---|---|---|
| CC | Claude Opus 5 | Claude Opus 5 | Completed independent study, scoring, and reaction. |
| AGY | Gemini 3.7 Flash | Gemini 3.1 Pro (High) | NTM hard-pinned `agy` to this installed model and explicitly ignored the requested Flash override. |
| COD | GPT-5.6 Terra | GPT-5.6 Terra | Completed independent study, scoring, and reaction. |

No existing source, data, or configuration file was intentionally edited by a reviewer during
the duel. Reviewers were instructed to create named Markdown artifacts only. The shared tree did
move materially during the study, so snapshot-specific counts and line numbers in individual
artifacts are leads, not immutable facts.

Beads/Agent Mail boundary: Agent Mail requests timed out, and `br` could not be used because its
local database reported schema version 16 where version 17 is expected. Therefore no Beads
overlap check, claim, update, or sync was performed; this report makes no claim that such a check
completed.

## Project architecture established during the audit

Classic Patents is a Next.js App Router museum. The typed patent registry in
`src/data/patents/` drives the gallery, timeline, static detail routes, facsimile PDFs, dual
projection viewer, claims decoder, drawings/callouts, and interactive visual dispatcher. The
pipeline stages are `scripts/download-patents.ts`, `scripts/ocr-patents.ts`, and
`scripts/verify-data.ts`; public PDFs are served from `public/patents/pdfs/` and source artifacts
are retained under `artifacts/`.

At the pipeline-verification snapshot, the project contained 18 patent records; the shared tree
continued to expand afterward. Its product promise depends on a strict distinction
between a primary-source facsimile, any machine-derived transcription, and editorial Plain English
analysis. The reviewers agreed that preserving that distinction is more urgent than expanding
visual features.

## Confirmed defects corrected in this session

1. **Sound replacement race.** `stopContinuousTone()` could stop an oscillator created after a
   rapid control change because its delayed callback used mutable shared state. It now captures,
   fades, stops, and disconnects the retiring oscillator only.
2. **Bundled-PDF download path.** The downloader treated site-relative `/patents/pdfs/...` URLs as
   Node `fetch` targets, which cannot work without a base URL. It now safely copies the declared
   bundled public PDF to the raw archive, while retaining the absolute-URL fetch path. The
   download stage verified this by acquiring the newly added bundled source PDFs.
3. **Fake OCR pipeline.** The prior OCR script wrote the already-authored TypeScript text back out
   as “OCR” and never inspected a PDF. The replacement uses the installed `focr` binary on actual
   rendered scan pages. Because `focr 0.3.0` cannot decode the archive's Group 3 CCITT PDFs, the
   script uses MuPDF to rasterize into a persistent audit cache and invokes `focr ocr-batch` once,
   serially, so the model weights load once and OCR tasks do not run concurrently.
4. **Data-verifier false green and early abort.** The verifier printed a pass line even after it
   had logged an error, then called `statSync` on a missing PDF and aborted the remaining sweep.
   It now aggregates per-patent failures, only reports a pass after a real pass, continues after a
   missing asset, validates real ISO calendar dates/date order, and checks duplicate claims and
   claim dependencies. It also checks the repository's current local-PDF naming convention.
5. **Timeline drift.** Collection copy was corrected from an 1876 start to the current 1840–1972
   historical range and the inaccurate “quantum microwaves” wording was corrected.

## OCR verification boundary

The installed `focr 0.3.0` binary and its local weights were verified. Direct OCR of the archived
PDFs fails because that binary's PDF decoder rejects Group 3 CCITT pages; direct OCR of a MuPDF
rendered page completed and produced text. Its `ocr-batch --json` contract was also verified on a
rendered page. The corrected full pipeline is deliberately serial and uses a configurable
`FOCR_MAX_NEW_TOKENS` bound (default 4096).

The full 172-page corpus regeneration was **not** claimed complete in this session: after the
user asked not to overwhelm the machine, no parallel OCR was started and the long serial batch was
not left running unattended. Existing or generated transcripts therefore remain machine output
requiring editorial review, not authoritative historical transcriptions.

## Consensus and adversarial corrections

All three reviewers converged on five themes:

1. **Truthful disclosure before archival reconstruction.** Mark transcript/claim coverage through
   an authored, reviewed state—never infer it from a trailing ellipsis. Excerpts must not be
   presented as complete primary text; link the full PDF.
2. **A verifier that tells the truth, then a real release gate.** Repair aggregation/reporting
   first, define semantic coverage/provenance invariants next, and only then add CI. A CI workflow
   that runs a false-green verifier is worse than no gate.
3. **Baseline access is P0 work.** Mobile navigation, dialog keyboard behavior, named controls,
   focus visibility, and reduced-motion handling are public-museum requirements. ARIA counts alone
   are not proof; audit actual accessible names and provide text/relationship fallbacks.
4. **Scope mathematics rendering safely.** Render the structured formula field first with an
   accessible math component and explicit malformed-formula behavior. Inventory inline prose math
   before parsing it.
5. **Separate WebGL delivery from lifecycle correctness.** Use a typed visual manifest and
   dynamic loading with an honest unavailable/error/text state; then migrate one flagship renderer
   to mount once, synchronize controls explicitly, preserve orbit state, and dispose resources.
   Measure bundle/frame/memory results before promising catalog-wide gains.

The scorecards also rejected or deferred several superficially attractive ideas as currently
underspecified:

- Automatic two-way split-scroll has no reliable content anchors and could fight the reader. It
  follows reviewed source locators and a split-view content refactor.
- Full catalogue-wide SVG reconstruction is editorial production work. Start with two
  source-aligned, cited figure pilots; do not present a generic schematic or synthesized reference
  as archival evidence.
- A schema library is an implementation choice, not a substitute for source provenance or
  aggregated semantic validation. If adopted, it must use error aggregation rather than fail-fast
  parsing.
- URL state should begin with validated view/preset state inside an isolated Suspense boundary;
  arbitrary live simulator parameters and automatic SSG regressions are not acceptable.

## Recommended delivery sequence

| Order | Deliverable-sized slice | Priority | Acceptance boundary |
|---:|---|---|---|
| 1 | Reviewed transcript/claim coverage state and honest labels | P0 | No excerpt or curated claim subset is presented as complete; primary PDF is linked. |
| 2 | Truthful aggregated verification gate | P0 | One bad record/asset reports failure without false green or stopping the sweep. |
| 3 | Mobile/dialog/control/reduced-motion access baseline | P0 | Core routes work at 320px and by keyboard; nonessential motion can be reduced. |
| 4 | Provenance + real-OCR pilot for two dissimilar patents | P1 | Source URL, hash, page count, raw OCR, normalized text, and review status are reproducible. |
| 5 | Semantic invariants and CI | P1 | Type/lint/data/build gates are meaningful locally and in CI. |
| 6 | Structured accessible math rendering | P1 | Formula fields no longer expose raw TeX; malformed input has visible, testable handling. |
| 7 | One dynamic, stable WebGL pilot | P1 | Selected visual code only; persistent controls/camera; deterministic teardown. |
| 8 | Faithful figure pilot | P2 | Pins resolve to cited figure/source evidence plus textual relationship fallback. |
| 9 | Targeted unit/component/keyboard smoke tests | P2 | Core route, dialog, fallback, and data contracts run deterministically. |

## Remaining material findings

- The generic drawing renderer still does not consume patent-specific `svgType` data; a generic
  schematic must not be described as a reconstructed historical drawing.
- Patent detail pages currently report a 383 kB first-load JavaScript footprint in the successful
  production build. The all-visual static import pattern remains a measured follow-up candidate.
- OCR output is not a substitute for human-reviewed transcription or provenance metadata.
- `ubs --diff` found zero critical issues, but reported broad static warnings in concurrent 3D
  work; those warnings require owner-specific triage rather than mechanical edits.

## Verification completed

- `bun run pipeline:download` — passed for 18 records; exercised the bundled-PDF copy path.
- `bun run pipeline:verify` — passed all 18 records with the corrected verifier.
- `bun run typecheck` — passed.
- `bun run lint` — passed.
- `bun run build` — passed; generated all 18 patent routes.
- `ubs --diff` — 0 critical findings; warnings reported as above.
