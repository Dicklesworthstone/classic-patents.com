# Codex Cross-Scores on CC and AGY Finalists

## Method and evidence boundary

I scored each rival finalist independently on a 0–1000 scale across usefulness, practicality, accretiveness, robustness, reliability, performance, intuitiveness, user benefit, ergonomics, and compellingness. The **overall** is a weighted judgment, not a false-precision average: usefulness, practicality, reliability, and accretiveness weigh most heavily for this archival museum. Scores are based on my completed study snapshot; CC explicitly observed a moving shared tree, so its later counts/line numbers are treated as helpful leads rather than independently current facts.

Scale: **900–1000** exceptional, strongly supported, and urgent; **750–899** very good, but with a material prerequisite or narrower claim; **600–749** good follow-on; **400–599** worthwhile only after prerequisites; **<400** reject/defer.

## Cross-rival convergence and duplicates

| Convergent theme | CC | AGY | Codex assessment |
|---|---|---|---|
| Archive/data validation | F1, F2 | F1, F4 | Strong consensus. Separate factual coverage disclosure from the eventual runtime-schema choice. |
| WebGL delivery/lifecycle | F3 | F2 | Strong consensus. CC identifies the more urgent lifecycle defect; dynamic loading complements, not replaces it. |
| Accessibility | F5 | candidates 7, 20, 22 | Strongly supported by the studied mobile navigation, dialog, animation, and simulation-control surfaces. |
| Pedagogical linkage | F4 (math); callout candidate | F3 | Both aim at the diptych, but only source-linked anchors should precede automated split-scroll. |
| CI | implicit in F1; broader candidate set | F4 | Good execution mechanism, but it cannot make an insufficient verification script authoritative. |

The primary duplicate clusters are: **CC F1 ↔ AGY F1** (data invariants), **CC F3 ↔ AGY F2** (simulation performance), and **CC F5 ↔ AGY accessibility candidates**. CC F2 is complementary to, rather than a duplicate of, validation: it corrects present public claims even before full transcription work exists.

---

## CC finalists

| CC finalist | Useful | Practical | Accretive | Robust | Reliable | Performance | Intuitive | User benefit | Ergonomics | Compelling | Overall |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| F1 — Make the data-integrity gate real | 980 | 970 | 950 | 960 | 980 | 820 | 890 | 950 | 930 | 940 | **965** |
| F2 — Disclose transcription coverage | 1000 | 990 | 980 | 980 | 990 | 800 | 980 | 1000 | 990 | 995 | **990** |
| F3 — Rebuild Three.js scenes once | 950 | 820 | 940 | 900 | 900 | 990 | 900 | 930 | 890 | **925** |
| F4 — Render the mathematics | 920 | 850 | 900 | 840 | 900 | 800 | 970 | 960 | 930 | 920 | **900** |
| F5 — Establish an accessibility floor | 990 | 930 | 970 | 920 | 960 | 880 | 980 | 1000 | 960 | 980 | **965** |

### CC F1 — Make the data-integrity gate real — **965/1000**

**Verdict.** Excellent P0. Its concrete repairs are better than a generic “add validation” proposal because they first make the current verifier report truthfully and complete a whole sweep after an asset failure.

**Supported premise.** My study independently saw a hand-written verifier that only checks minimal conditions and then logs a per-record success path; it does not validate coverage, source provenance, claim references, stats relationships, or drawing semantics. The rival's `fs.statSync` failure-mode concern is technically credible from the studied control flow.

**Caveat / unsupported premise.** CC's moving-tree counts and exact line references need re-check before implementation. Its suggested `basename(originalPdfUrl) === id + ".pdf"` is a useful convention, not archival truth; a future canonical filename might reasonably differ. Do not encode that as an immutable historical invariant.

**Dependencies and risks.** It depends only on deciding which invariants express the editorial contract. A properly fixed gate will expose existing red data; that is success, but it requires a triage policy so “known excerpt” is not incorrectly treated as corruption. It should feed CI, not be mistaken for CI itself.

### CC F2 — Disclose transcription coverage — **990/1000**

**Verdict.** The **single strongest rival idea**. It is unusually high-leverage because it makes current visitor-facing assertions honest with a small, reversible change, while full archival reconstruction remains a larger program.

**Supported premise.** My snapshot independently found `originalText` and `claims` stored as selectively authored data, while UI labels use “verbatim,” “verified,” and “full” language. The registry/stats pattern makes it plausible that source totals and decoded subsets differ. The full PDF viewer already provides a source-preserving route.

**Caveat / unsupported premise.** Do not determine coverage by searching for a literal ellipsis: historical source text can contain ellipses, and newly added data may be complete. Coverage must be a reviewed per-record field, ideally backed by page/claim locators. The proposal's line/count claims must be revalidated against the current records.

**Dependencies and risks.** Requires a small data-model/UI policy: `complete` versus `excerpt`, decoded versus original claim count, and a no-claim state for unreviewed material. The risk is cosmetic disclosure without later provenance work; sequence it with a manifest/validation roadmap so it is the first honest step, not the last.

### CC F3 — Rebuild Three.js scenes once, not on every slider tick — **925/1000**

**Verdict.** Very strong P1 and the more immediate simulator fix than code splitting alone. It restores the causal, inspectable control behavior the visual engine promises.

**Supported premise.** My study independently traced Wright and Tesla effects that construct `WebGLRenderer`, scene contents, listeners, and animation loops while depending on live control state/derived values. The effect-local orbit state means recreation can reset the camera, and cleanup limited to renderer disposal does not comprehensively dispose scene resources.

**Caveat / unsupported premise.** “GPU resources accumulate across dozens of rebuilds” is a plausible risk, not a measured leak. Score it as a lifecycle correctness fix first; profile memory/frame pacing rather than promising a quantified performance gain. A ref-only split can also introduce stale values.

**Dependencies and risks.** Needs a reusable disposal policy, a mount-once/update-per-frame architecture, and behavioral tests for every control. Convert one small flagship first and verify camera persistence, listener count, teardown, and telemetry before broad migration. It complements AGY F2's dynamic loading.

### CC F4 — Render the mathematics — **900/1000**

**Verdict.** High-value P1 pedagogy, and the best non-overlapping finalist. The museum explicitly promises mathematically rigorous explanation; literal TeX is a presentation failure of its strongest material.

**Supported premise.** I saw `ScientificPrinciple.formula` strings such as TeX commands rendered directly by the viewer, and inline dollar-delimited expressions in technical data. No rendering layer was present in the study snapshot.

**Caveat / unsupported premise.** The precise macro/inline-expression counts were not independently remeasured. KaTeX is sensible but is not the only solution, and `throwOnError: false` must not silently turn malformed equations into misleading output. Some formula text might be intentionally plaintext.

**Dependencies and risks.** Requires a safe rendering component, a bounded inline parser, accessibility output (MathML/semantic labels where available), CSS/font loading, and tests for malformed formula/error presentation. Apply first to structured `formula` fields; defer free-prose parsing until the corpus is inventoried.

### CC F5 — Establish an accessibility floor — **965/1000**

**Verdict.** Excellent P1, with mobile navigation and modal escape/focus behavior worthy of P0 treatment. It is an access requirement for a public educational instrument, not embellishment.

**Supported premise.** My study saw desktop navigation hidden below `md` alongside unused mobile-menu state; diagram/simulator interactions are highly visual/pointer-centric; the glossary is custom overlay code; and animation is continuous. The source snapshot lacked the progressive enhancement described by CC.

**Caveat / unsupported premise.** Raw counts of `aria-label`/`htmlFor` do not alone establish the complete accessible-name calculation: visible text can sometimes name controls. They do, however, justify an accessibility audit, and the modal/mobile defects are direct.

**Dependencies and risks.** Needs shared dialog and control-label primitives, keyboard E2E checks, reduced-motion behavior inside Three.js as well as CSS, and textual fallbacks. Avoid treating ARIA attributes as the whole program; relationship tables and non-WebGL telemetry are necessary.

---

## AGY finalists

| AGY finalist | Useful | Practical | Accretive | Robust | Reliable | Performance | Intuitive | User benefit | Ergonomics | Compelling | Overall |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| F1 — Zod runtime schema validation | 870 | 730 | 860 | 880 | 890 | 800 | 820 | 850 | 830 | 820 | **845** |
| F2 — Dynamic import for Three.js | 900 | 900 | 900 | 850 | 880 | 970 | 860 | 910 | 900 | 880 | **900** |
| F3 — Bi-directional split-scroll | 660 | 480 | 700 | 520 | 500 | 480 | 830 | 700 | 690 | 780 | **620** |
| F4 — CI/CD verification workflow | 900 | 880 | 890 | 860 | 930 | 790 | 800 | 870 | 880 | 820 | **865** |
| F5 — URL state for modes/simulations | 720 | 670 | 760 | 650 | 680 | 760 | 850 | 790 | 830 | 790 | **735** |

### AGY F1 — Zod runtime schema validation — **845/1000**

**Verdict.** Good foundation, but overspecified. The value is runtime parsing plus refinements; “replace TypeScript interfaces” and a package choice are implementation options, not the goal.

**Supported premise.** The data shape is TypeScript-only and the verifier is manual. Claim dependency, callout bounds, unique identity, and coverage/provenance checks need a structural contract.

**Unsupported premise.** A schema alone cannot guarantee “no phantom claims” or historically valid dates; it validates supplied data, not source truth. Zod is not currently a dependency and is not necessary for the first repairs. `PatentSchema.parse` cannot replace I/O, hash, coverage, or cross-record checks without custom refinement and an external manifest.

**Dependencies and risks.** First define coverage/provenance semantics and cross-record invariants; then choose Zod or a small custom validator. Strict parsing will initially fail existing data, so use report/strict modes and preserve useful editorial subsets.

### AGY F2 — Dynamic import for Three.js simulations — **900/1000**

**Verdict.** Strong, practical performance work and a real complement to CC F3. It should load visual code only when the visitor requests the interactive mode.

**Supported premise.** The studied client dispatcher statically imported all simulation modules, including Three.js components, before choosing a patent. That broadens the initial dependency graph even when the simulator tab is never selected.

**Unsupported premise.** “Massive” TTI improvement is unmeasured; static imports may be split by the framework in ways that need bundle inspection. Dynamically importing only the 3D visual still leaves all 2D simulations in the dispatcher. `ssr: false` is appropriate only at a client-safe dynamic boundary, not a universal remedy.

**Dependencies and risks.** Requires a typed visual manifest, named loading/error/accessibility fallback, bundle measurement, and graceful WebGL failure handling. Coordinate with CC F3 so per-control scene rebuilds do not remain the dominant interactive cost.

### AGY F3 — Synchronous bi-directional scroll — **620/1000**

**Verdict.** A potentially delightful P3 follow-on, but premature and dangerously automatic in the current content model.

**Supported premise.** The split-view sides are not synchronized, and true diptych linkage would improve pedagogy.

**Unsupported premise.** The source/Plain English faces do not yet have reliable one-to-one block anchors, complete transcript coverage, or source-linked callouts. `IntersectionObserver`-driven auto-scroll assumes a mapping that current data does not encode and can fight a reader's intentional scroll, loop, or cause motion discomfort.

**Dependencies and risks.** First build reviewed source locators and explicit user-triggered cross-links (CC F2 plus diagram work). Then prototype a one-way “reveal corresponding source” action; only adopt bidirectional synchronization after usability/reduced-motion testing.

### AGY F4 — CI/CD data verification workflow — **865/1000**

**Verdict.** Valuable P1 delivery discipline, but it must run meaningful contracts, not merely institutionalize the current weak verifier.

**Supported premise.** The project documents local typecheck, lint, data verification, and build commands, with no studied CI workflow. Shared concurrent changes make an automated gate worthwhile.

**Unsupported premise.** A GitHub Actions workflow is not “un-bypassable” without branch protection, and it cannot provide “zero regressions” with no test suite. Whether Actions minutes are free is external/policy-dependent and irrelevant to technical merit.

**Dependencies and risks.** Build/fix CC F1's verifier, add domain and E2E tests, then enforce them. Use Bun lockfile-aware setup and cache discipline. Keep deployment policy separate: `vercel.json` disables Git deployments, so CI should report/review quality, not assume it deploys.

### AGY F5 — URL state synchronization — **735/1000**

**Verdict.** Good P2/P3 product capability, especially for citation and teaching links, but not one of the first five fixes.

**Supported premise.** `DualProjectionViewer` stores its view mode locally, and simulator controls are local component state. A stable citation to a view or pedagogical preset would be useful.

**Unsupported premise.** Encoding arbitrary live simulation state in the URL is not automatically shareable or stable: it needs versioned schema/defaults, numeric bounds, coercion rules, and an accessibility-safe back/forward contract. `router.replace` alone does not avoid all state synchronization loops or preserve shareable history semantics.

**Dependencies and risks.** First establish a typed visual manifest and deterministic preset model. Start with a validated `view` parameter and named presets, not every slider. Add URL parsing tests, canonicalization, and privacy/length limits before parameter-level synchronization.

## Recommended rival-derived sequence

1. **CC F2**: disclose excerpt/completeness and decoded-claim coverage now.
2. **CC F1**, expanded with manifest/schema work: make validation truthful and exhaustive.
3. **CC F5**: restore mobile/keyboard/dialog/reduced-motion access, including text alternatives.
4. **CC F4**: render structured mathematics accessibly.
5. **CC F3 + AGY F2**: migrate one simulation to mount-once lifecycle and on-demand delivery, then measure before scaling.

AGY F4 belongs around steps 2–3 once tests exist; AGY F5 follows deterministic visual presets; AGY F3 follows reviewed source anchors. No rival proposal warrants rejection outright, but AGY F3 is the only finalist that should be deliberately deferred rather than merely sequenced.
