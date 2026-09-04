# Classic Patents reality check, 4 September 2026

This is the assessment and bridge plan produced by applying `reality-check-for-project` through its documentation, code, behavioral verification, bead creation, ambition, refinement, and graph-validation phases. It does not certify historical text by counting passing tests.

## Verdict

Classic Patents is a substantial working museum, with a much stronger archival and simulation foundation than its early planning documents describe. It is **not finished against its own engineering doctrine**. The principal gaps are incomplete archival acceptance, scientific readouts that bypass the authoritative kernel, incomplete WASM ownership and replay, a large initial JavaScript payload, and release/native verification that does not yet establish the whole promised experience.

Completing the previous unfinished backlog would not close these gaps. The pre-audit JSONL contained 144 records: 142 closed, one blocked, one tombstone, and **zero open or in-progress issues**. The one blocked issue, `classic-patentscom-va0`, concerns real-device verification and deferred UI work. Several closed recovery issues explicitly required complete archival restoration, but their closing evidence demonstrates the protective hold and selected tests instead. Those are valuable intermediate results, not completion of the original scope.

Do not respond by hiding readable patent text, restoring speculative historical physics, or making every exhibit a placeholder. The useful product already exists. Preserve its readers, controls, models, source assets, and explanations while making each stronger claim independently demonstrable.

## Evidence boundary

The baseline checkout was `b627671e4cc4796161ffefdf6dd052cbe01f46f3` on `main`, with extensive pre-existing edits and other agents actively changing the tree. Strict accepted-edition coverage rose from 80 to 81 and then **82 of 103** during this investigation. The initial per-record backlog used the 82-record snapshot. A later complete inventory at `726e6a4d` has **85 accepted / 18 nonaccepted**, 384 unaccepted figure occurrences, zero records with attested figures lacking locators, and nine lacking both. The issue refinement distinguishes these later completions from work still outstanding. Counts are not assertions about a later commit or deployment.

Three states were examined separately:

1. **Working source:** direct reads, typed inventory, numeric probes, TypeScript AST scan, unit/component tests, lint, typecheck, and native parity.
2. **A fresh production build:** an isolated copy under the conversation scratch directory, with its own `.next`, so the build did not change peers' generated files or server artifacts. Next generated 334 static pages successfully.
3. **The public deployment:** real Chromium journeys at desktop and 320 px for Wright, Tesla, Kwolek, and Crump. This deployment is not assumed to equal the dirty checkout. No deployment was performed.

Read in full: `AGENTS.md`, `README.md`, `COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md`, the deep integration plan, both WASM TODO documents, the visual weave worklist, the E2E harness guide, `ios/README.md`, the dueling-wizards report, all three idea documents, and their score/reaction documents. Older wizard critiques describe an 18-record site and are historical design evidence, not current defect reports. The skill and all five references were read. Keyword, AST, and runtime investigations were used together; a suspicious comment alone was not counted as a live defect.

All generated investigation programs and bulky evidence remain in the conversation scratch directory. No files were deleted, no local OCR engine was invoked, and no peer implementation was changed by this assessment.

## What is already real

The App Router catalogue has 103 records, explicit visual dispatch, pinned local PDF paths, static detail routes, adjacent navigation, search, timeline, metadata, and social images. The source reader actually delivers continuous authored editions or available complete local transcripts. The stronger publication evaluator checks PDF bytes, ledger evidence, claim parity, figure acceptances, and review state. Source availability and strict editorial acceptance are deliberately separate.

The live Wright and Tesla journeys passed at desktop and 320 px: navigation and URL restoration, source text and PDF delivery, figure interaction, claim navigation, 2D/3D dispatch, shared control changes, equation feedback, theme switching, and the harness's responsive/runtime checks. These are observed successes, not inferences from filenames. Screenshots also showed a coherent, readable 320 px home page and Kwolek header with no horizontal overflow in the measured viewport.

The shared physics bus is real. `useFrankenSimPhysics.ts` pumps registered owners, publishes snapshots, admits provenance after successful stepping, handles mount/cleanup races, and stops pumping idle transports. `usePatentPhysics` shares catalogue-keyed controls. All 103 records have default typed host telemetry; the captured verifier reported 55 ticking owners and 48 snapshot publishers. Static topology exhibits can legitimately publish snapshots. Fourteen shipped WASM packages have execution tests, with twelve active dedicated refusal boundaries. The coverage manifest distinguishes three patent-specific surfaces, 35 generic consumers, and 65 host-only records. This is meaningful progress; “generic consumer” still does not mean its entire public state is WASM-owned.

The verified deployment entry point is substantial: an exclusive lock, clean/source-identity checks, local prebuilt artifacts, a deployment without public aliases, critical live journeys, and a full-catalogue source-reader sweep before promotion. It must remain the release path.

## Vision checklist

`WORKING` below means the specified scoped behavior was executed successfully; `PARTIAL` means some required coverage remains; `UNPROVEN` means the promise exceeds this evidence. No percentage of these heterogeneous goals is a meaningful completion score. “No active bead” refers to the backlog before this assessment.

| # | Concrete promise and measuring document | Status | Current evidence / remaining gap | Previous active coverage |
|---|---|---|---|---|
| V01 | 103 discoverable, correctly routed records; README catalogue | WORKING for registry/static output; sampled live | Registry, dispatcher tests, static build, live exemplars | None needed for the observed slice |
| V02 | Authentic primary facsimile, digest, and provenance per grant; AGENTS §§1–2 | PARTIAL | Files exist for all; GB 1306 reconstruction and other source holds cannot be authenticated by file existence | No active bead |
| V03 | Complete reviewed ledger and accepted continuous edition per record; AGENTS §3a | PARTIAL | 82 accepted, 21 nonaccepted; 99 ledger assets do not imply 99 completed reviews | No active bead |
| V04 | Read existing source material without an empty text face; current README | WORKING in sampled editions and transcript fallback | Inventory: 92 edition readers, 11 transcript readers, zero facsimile-only readers | Previously closed reader work |
| V05 | Every printed claim, edition-derived text and dependencies; AGENTS §3 | PARTIAL | Strong parity contracts on accepted records; a held record's typed claim array is not full-facsimile proof | No active bead |
| V06 | Every paragraph has a rigorous parallel reading; AGENTS §3a | PARTIAL | Authored maps and contracts exist; remaining editions need complete mapped readings | No active bead |
| V07 | Every figure occurrence resolves to an accepted source crop/locator; AGENTS §3a | PARTIAL | 462 unaccepted occurrences; 2 records have attestations lacking locators; 10 lack both | No active bead |
| V08 | Accurate mechanism, equations, historical context and disputes; AGENTS §5a | PARTIAL / corpus-wide UNPROVEN | Substantial content; source checks cannot prove all editorial history, legal outcomes or modern interpretations | No active bead |
| V09 | Purpose-built 2D/3D models and honest unavailable states; AGENTS §5 | PARTIAL | Explicit routes and working exemplars; Kwolek deliberately has no admitted visual model | No active bead |
| V10 | One authoritative control/state path across faces; AGENTS §5b | PARTIAL | Real bus and verified examples; auxiliary energy/sensitivity paths still rederive values | No active bead |
| V11 | Generic FrankenSim modules own admitted laws; AGENTS §5b | PARTIAL | 38 WASM surfaces, 65 host-only; surface consumption and shared-bus ownership are distinct | No active bead |
| V12 | Typed refusal preserves the last legal pose and states why; AGENTS §5b | PARTIAL | Twelve dedicated boundaries plus host validation; catalogue-wide behavioral proof remains | No active bead |
| V13 | WASM field/body samples drive the rendered state; deep plan phase 1 | PARTIAL | Real narrow owners coexist with adjunct samples and host-generated geometry | No active bead |
| V14 | Energy balance is physically measured and source-qualified; deep plan phase 3 | WRONG_APPROACH in universal strip | Fixed-percent discrepancy and unconditional green balance; numeric Wright counterexample below | No active bead |
| V15 | Sensitivity is of the current admitted kernel; deep plan phase 2 | PARTIAL / WRONG_APPROACH in some branches | Handwritten/finite-difference implementation, not generic AD; Edison ignores resistance control | No active bead |
| V16 | Each independent claim has a meaningful live probe; AGENTS §5b | PARTIAL | Good exemplars and spec weave; no full source-to-control-to-state behavioral proof for all claims | No active bead |
| V17 | Sound is a muted-by-default state transducer; AGENTS §5b | PARTIAL / waveform fidelity UNPROVEN | Mute/lifecycle fixes and state-driven tones exist; a tone mapping is not proof of reconstructed signal fidelity | No active bead |
| V18 | Visitors record/scrub controls and reproduce digests; AGENTS §5b | NOT_STARTED as general visitor feature | Active bus stores latest frame, not a visitor replay history; deterministic kernel tests are a foundation | No active bead |
| V19 | Capability-probed portable transport with honest mode reporting; AGENTS §5b | PARTIAL | Host transport works without isolation; shared-ring/transferable capability path not found in active bus | No active bead |
| V20 | Genuine cross-patent coupled lab; deep plan phase 6 | NOT_STARTED as a coupled solver | `coupleGraph.ts` exposes host gain relationships within a patent; no multipatent state solve | No active bead |
| V21 | Polished keyboard/touch/320 px/reduced-motion/failure access; AGENTS §5 | PARTIAL / full fleet UNPROVEN | Working mobile shell and flagship journeys; real-device and full-route proof still missing | `va0`, partly |
| V22 | Initial JavaScript around README's 198 kB claim | NOT MET in fresh build | Home 1.64 MB, patent detail 2.03 MB, timeline 1.70 MB (Next report) | `va0` does not address full-catalogue imports |
| V23 | Build, types, lint, tests and release all agree; AGENTS landing rule | PARTIAL | Build/types pass; initial broad suite and lint fail; release runs selected tests, not the full suite | No active bead |
| V24 | Native offline catalogue remains in parity; iOS README | REGRESSED relative to recorded previous receipt | Current full native parity: 136 differences; no fresh device release certified | No active bead |
| V25 | OCR runs only on cloud Luna workers; AGENTS §6 | WRONG_APPROACH in entry point | `pipeline:ocr` invokes local `focr` and local rendering; not executed in this audit | No active bead |
| V26 | `src/pages` cannot exist, including empty; AGENTS rule 2 | PARTIAL enforcement | Verifier checks route-like files, not directory existence | No active bead |
| V27 | Roadmap and completion records describe current truth | PARTIAL | Conflicting dates/counts/checked boxes; recovery scopes closed after containment | No active bead |
| V28 | Reproducible contributor task workflow; AGENTS beads section | REGRESSED in installed tooling | Installed br 0.5.6 cannot open/repair repository; verified scratch br 0.5.10 JSONL mode works | No active bead |

## Findings that change the plan

### 1. Acceptance is unfinished, even though reading is available

The backlog-creation inventory had 82 accepted records and 21 remaining; the later 85/18 snapshot is recorded above. Primary reasons: eight facsimile-review holds, five incomplete specifications, three reconstructions, three figure-acceptance holds, and two primary-facsimile holds. These categories are primary causes, not mutually exclusive descriptions of all work.

The reader intentionally serves existing source text. Keep this policy. Finishing a transcript or edition must mean checking every relevant page of the pinned facsimile, with cloud-only OCR if a machine draft is needed. Changing a status flag, increasing a coverage constant, passing a containment test, or serving an inherited transcript does not perform that review.

The per-record bridge inventory below is generated from the captured structured audit, including its unresolved findings and predecessor issue IDs. Each record receives its own restoration issue and acceptance issue. Acquisition failures remain explicit external blockers; they must not be “solved” by treating reconstructions as primary sources.

### 2. The energy strip can certify a calculation it never performed

`src/physics/energyLedger.ts:871` computes `supplyDefect = abs(netPower * 0.015)`. This is not the residual between stored-energy change and integrated input minus loss. The default branch invents 250 J of storage and 150/148 W flows for an unsupported ID. `PortHamiltonianEnergyStrip.tsx` displays a green shield and `ΔH≈0` regardless of `isConservative`.

The Wright 3D component mounts this strip. Its shared control is `airspeed` in mph; the ledger instead reads `airspeedKts` with a 28-knot default and independent mass/drag/power constants. Direct calls using the actual control demonstrate the mismatch:

| Wright control | Shared step speed | Shared step lift | Strip stored energy | Strip discrepancy |
|---|---:|---:|---:|---:|
| 28 mph | 12.51712 m/s | 2,046.94 N | 46,942.82 J | 0.672 W |
| 40 mph | 17.88160 m/s | 4,177.43 N | 46,942.82 J | 0.672 W |

The strip's digest is identical too. Correctly labelling its hash “host” does not correct the underlying physical claim. This is a priority-one scientific integrity defect. The separate guarded `energyChannels.ts` work is useful and should be reused rather than bypassed.

### 3. Some sensitivities describe a different model

`sensitivityKernel.ts` honestly says it is not automatic differentiation, and some branches differentiate the real shared step. Others return unrelated constants. Edison computes `2V/100` even when the live kernel accepts `hotResistanceOhm`. At 110 V and 200 Ω, the correct fixed-resistance derivative of `V²/R` is 1.1 W/V; the helper still returns 2.2 W/V. The lamp step itself responds correctly, producing 60.5 W.

Crump has a real declared Arrhenius host viscosity scenario; do not falsely call it absent. Its sensitivity uses a fixed 280 Pa·s rather than the current temperature-dependent viscosity. Clavel and Segway also contain fixed dimensional derivatives that require checking against their current normalized/source-bounded controls before they can be presented as live sensitivities. Discrete topology switches should have finite effects, not invented calculus.

### 4. Ownership, replay and sophisticated labels remain different things

`useFrankenSimPhysics.ts` is a working transport, with a canonicalized 32-bit FNV-1a host digest and a latest-frame slot. `src/physics/transport.ts` is a separate legacy scaffold whose scheduled callback does nothing; it was not found on the active product path. Do not conflate these two files or delete the scaffold during an audit.

A general visitor control tape, checkpoint restore, scrub UI, and replayed Blake3 state identity were not found. Likewise the host `coupleGraph.ts` relationship display is not a multi-exhibit coupled dynamics solver. The deep-plan ambitions remain useful but require genuine state ownership, bounded models and reproducible evidence first.

The AST pass parsed 1,274 TypeScript files and found 32 empty function bodies, 13 module-mock calls, and two `Math.random` calls. These are leads, not 47 defects. The two random calls are in the unused `playPopcornPop` method, with no production caller found. Existing live audio transducers should be tested on actual output and mute/route lifecycle; dormant sound code is not proof of a live nondeterminism bug.

### 5. Delivery weight contradicts the public performance claim

Fresh Next 15.5.23 production output reports 1.64 MB first-load JS for `/`, 2.03 MB for `/patents/[id]`, and 1.70 MB for `/timeline`. The shared framework portion is 106 kB. These are build-reported route sizes, not measured phone transfer or LCP. They are nevertheless incompatible with an unqualified 198 kB initial-payload claim.

`PatentSearchPalette.tsx`, `EraFilterBar.tsx`, `PatentTimeline.tsx`, and `PatentLineageView.tsx` import the full `@/data/patents` graph across client boundaries. Start by producing a compact search/navigation projection and inspect actual route chunks for full legal text. Retain searchable fields and all 103 results. Then split selected visual/kernel bundles and measure response serialization separately. Do not remove scholarly content or change catalogue pagination merely to lower a number.

### 6. Verification must distinguish product faults, harness faults and drift

The first broad run produced **2,809 passes and nine failures** across 408 files. Three isolated reruns passed: chips 8/8, audio 3/3, inventory 4/4. The initial visual-test module mocks leaked into later tests; peers removed those mocks during the investigation. The inventory count also moved during the run. A fresh run is required before calling this a remaining code defect. Passing isolated tests alone does not establish order-independent suite health.

The live four-record/eight-viewport run logged 141 passed actions and eight failed events. Four actual action failures each produced a second failure-evidence event:

- Kwolek desktop/phone: the harness insists on the title `Interactive 3D Simulator`, but the deployed button is correctly named `Visual Model in Preparation`. This is a harness defect, not a reason to re-enable the unsupported model.
- Crump desktop/phone: the harness expects local `source-sheet-1-v1.png`, which returns 404 live. The deployed source reader references older `fig-*-source-crop-v1.png` assets instead. This proves source/deployment manifest mismatch; it does **not** by itself prove the deployed reader contains the missing URL.

The native parity check reports 136 differences in content, publication state, physics, and asset manifests against current source. An earlier closed native issue records a successful receipt at another commit. That receipt does not establish current parity.

`pipeline:verify` passes while reporting archival warnings. This is intentional availability policy, not proof all archival work is complete. Next also explicitly skips type and lint validation; separate commands matter. Initial lint reported ten errors and three warnings in peer-modified source/configuration. The verified deployment script runs selected publication tests plus types/lint/build and a source-reader sweep, leaving other physics/component regressions outside its selected-test gate.

### 7. Repository policies need executable boundaries

`scripts/ocr-patents.ts` is now a real OCR program, unlike the obsolete wizard critique: it invokes local `focr`, renders PDFs locally and runs batches. Its package entry point contradicts the absolute cloud-Luna-only policy. Replace the entry point with bounded cloud submission/resume and a local execution refusal. Do not test the refusal by starting an OCR engine.

The Pages Router check rejects route-like files under `src/pages`; it does not reject the directory when empty or containing only `.keep`. No such directory was created during this audit. Verify the invariant using injected directory listings or fixtures outside the repository source tree.

The installed br failed both normal storage repair and its old JSONL importer. SQLite integrity itself was `ok`, but the DB had 140 rows and JSONL 144, so default bv initially read a stale graph. A full `.beads` backup was retained. Official br 0.5.10 was downloaded to scratch and its archive SHA-256 checked; its `--no-db` mode reads the JSONL successfully. All issue mutations for this plan use that br binary. No direct SQL/JSONL editing is used as a repair.

## Bridge strategy and sequencing

First restore trustworthy measurement: fix the energy/sensitivity consumers, isolate the test suite, make browser tests understand source-bounded states and deployment identity, and enforce cloud-only OCR. These do not depend on all archival recovery being finished.

In parallel workstreams, finish each unresolved source packet and move catalogue data out of client bundles. Archive work is per-record: primary witness, complete ledger, edition, exact claims, figure occurrences, terminology, parallel readings, editorial mechanism and appropriate visual boundary. A record may retain a useful source-bounded exhibit while research proceeds. Never force missing dimensions into a fake SI simulation.

Next make runtime ownership explicit per output, then complete generic law bindings, real field/body delivery, replay and claim probes. Distinguish source-disclosed values, normalized topology, declared modern scenarios, and refused results. Modern scenarios can teach real physics without claiming historic dimensions or performance.

Finally complete native parity, real-device/accessibility evidence and a same-source release rehearsal. New claims of completion require both implementation and a companion acceptance task. The detailed issue register below records scope, files, tests, dependencies and the reason each item serves the museum. This is a programme of archival and engineering work, not a plausible one-session patch; no calendar estimate is claimed without source-recovery and device evidence.

## Phase record and issue register

Phase 1 documentation/code/behavior investigation and Phase 2 bridge strategy are complete. Initial issue generation, three in-place ambition rounds, five refinement passes, and final graph evidence are recorded here as they are performed.

<!-- REALITY_CHECK_GENERATED_REGISTER -->

### Initial Phase 3a instruction (verbatim)

```
OK so please take ALL of that and elaborate on it and use it to create a comprehensive and granular
set of beads for all this with tasks, subtasks, and dependency structure overlaid, with detailed
comments so that the whole thing is totally self-contained and self-documenting (including relevant
background, reasoning/justification, considerations, etc.-- anything we'd want our "future self" to
know about the goals and intentions and thought process and how it serves the over-arching goals of
the project.) The beads should be so detailed that we never need to consult back to the original
markdown plan document. Remember to ONLY use the `br` tool to create and modify the beads and add
the dependencies.
```

The initial bridge is being materialized through br as per-record restoration and acceptance tasks, plus numerical, performance, verification, native, OCR, architecture and documentation work.

### Ambition round 1

Round 1 changed the unit of proof from “a patent has a WASM surface” to “this output came from this accepted owner at this tick.” It added full claim/paragraph linkage and editorial review beyond structural edition acceptance. It explicitly preserves nonphysical claim explanations, normalized topology and declared modern scenarios. Removing a questionable label is an immediate correction, not completion of the promised engineering instrument.

### Ambition round 2

Round 2 added the missing end-to-end mechanisms: bounded replay/checkpoints, capability-aware field transport, real field sampling, signal-based audio, two actual coupled labs, selected-module loading, full-catalogue failure/access testing and stronger same-source release gates. Dependencies now follow owner evidence → buffer/replay contracts → advanced instruments. Reading, compact search and immediate numerical corrections remain independently deliverable.

### Ambition round 3

Round 3 replaced blanket “more advanced physics” with concrete mathematical obligations: dimensional contracts, interval/regime admission, conditioned derivatives, constraint closure, measured discrete energy/passivity residuals, analytic references, convergence and metamorphic tests. It also expanded generic-runtime completion into explicitly listed catalogue cohorts of at most eight records, each with a companion proof task. A final integrated completion task prevents closed containment issues from standing in for restoration. These methods earn their place by catching the observed energy/sensitivity/ownership defects; no esoteric technique is required just for appearance.

### Regenerated Phase 3a instruction (verbatim)

```
OK so please take ALL of that and elaborate on it and use it to create a comprehensive and granular
set of beads for all this with tasks, subtasks, and dependency structure overlaid, with detailed
comments so that the whole thing is totally self-contained and self-documenting (including relevant
background, reasoning/justification, considerations, etc.-- anything we'd want our "future self" to
know about the goals and intentions and thought process and how it serves the over-arching goals of
the project.) The beads should be so detailed that we never need to consult back to the original
markdown plan document. Remember to ONLY use the `br` tool to create and modify the beads and add
the dependencies.
```

The expanded plan has 60 implementation/restoration scopes, each with a companion acceptance task, grouped in five epics. The generic-runtime cohorts enumerate their exact catalogue IDs and current owners.

### Later verification and concurrent progress

The second broad run had **2,814 passes / seven failures / 2,821 tests**. The earlier chip/audio failures are gone after peer edits. The remaining failures concern README coverage, publication approval/reader expectations and hold-inventory counts as peers promote records. The later data gate reports 85 accepted editions but fails because its expected gap list still includes Whitney. These failures are recorded, not waived. A passing old gate must not be cited as current release readiness.

The latest independent typecheck passed. The latest lint passed with two size warnings (the native catalogue JSON and the vendored PDF worker are above Biome's configured file-size limit). The successful isolated build remains a distinct earlier source snapshot. No claim is made that these separate checks form a green release receipt for the later checkout.

Three records in the initial backlog became accepted during the session: Lemelson automatic production, Milacron's robot tool changer and Whitney cotton gin. Their restoration tasks are refined to verify the newly landed work and repair only an evidenced regression, while their independent acceptance tasks remain explicit. No new transcription is requested merely because an earlier inventory was red.
