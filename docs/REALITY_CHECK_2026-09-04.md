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
| V03 | Complete reviewed ledger and accepted continuous edition per record; AGENTS §3a | PARTIAL | 85 accepted, 18 nonaccepted in the later snapshot; 99 ledger assets do not imply 99 completed reviews | No active bead |
| V04 | Read existing source material without an empty text face; current README | WORKING in sampled editions and transcript fallback | Inventory: 92 edition readers, 11 transcript readers, zero facsimile-only readers | Previously closed reader work |
| V05 | Every printed claim, edition-derived text and dependencies; AGENTS §3 | PARTIAL | Strong parity contracts on accepted records; a held record's typed claim array is not full-facsimile proof | No active bead |
| V06 | Every paragraph has a rigorous parallel reading; AGENTS §3a | PARTIAL | Authored maps and contracts exist; remaining editions need complete mapped readings | No active bead |
| V07 | Every figure occurrence resolves to an accepted source crop/locator; AGENTS §3a | PARTIAL | 384 unaccepted occurrences in the later snapshot; zero records have attestations lacking locators; nine lack both | No active bead |
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

`src/physics/energyLedger.ts:870` computes `supplyDefect = abs(netPower * 0.015)`. This is not the residual between stored-energy change and integrated input minus loss. The default branch invents 250 J of storage and 150/148 W flows for an unsupported ID. `PortHamiltonianEnergyStrip.tsx` displays a green shield and `ΔH≈0` regardless of `isConservative`.

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
## Concrete bridge and task register

The graph contains **125 new issues: five epics, 60 implementation/restoration scopes and 60 companion acceptance tasks**. Every issue embeds its context, source evidence, affected files, implementation steps, success criteria and preservation rules. The existing blocked `classic-patentscom-va0` remains the real-device owner. No old issue was reopened, deleted or rewritten to manufacture a new status.

The five workstreams are:

- **Archive**: `classic-patentscom-8vu`.
- **Physics**: `classic-patentscom-2y5`.
- **Experience**: `classic-patentscom-fov`.
- **Delivery**: `classic-patentscom-zqi`.
- **Governance**: `classic-patentscom-xpi`.

### Remaining source packets and newly landed work

This table retains all 21 records present when the restoration backlog was generated. Three later promotions are marked explicitly. Each companion checks full facsimile coverage, claims, figure occurrences and the real visitor journey; it cannot pass solely from a status flag.

| Record | Captured reason / later state | Restoration or landed-work verification | Independent acceptance |
|---|---|---|---|
| `gb-1306-watt-rotary-engine` | AUDIT_RECONSTRUCTION_QUARANTINE | `classic-patentscom-8vu.1` | `classic-patentscom-8vu.2` |
| `gb-1420-cort-puddling-rolling` | AUDIT_FACSIMILE_REVIEW_PENDING | `classic-patentscom-8vu.3` | `classic-patentscom-8vu.4` |
| `gb-913-watt-separate-condenser` | AUDIT_PRIMARY_FACSIMILE_PENDING | `classic-patentscom-8vu.5` | `classic-patentscom-8vu.6` |
| `gb-931-arkwright-water-frame` | FABRICATION_OR_RECONSTRUCTION_QUARANTINE | `classic-patentscom-8vu.7` | `classic-patentscom-8vu.8` |
| `us-2543181-land-polaroid` | AUDIT_FULL_SPECIFICATION_PENDING | `classic-patentscom-8vu.9` | `classic-patentscom-8vu.10` |
| `us-2708656-fermi-reactor` | AUDIT_FULL_SPECIFICATION_PENDING | `classic-patentscom-8vu.11` | `classic-patentscom-8vu.12` |
| `us-313224-mergenthaler-linotype` | AUDIT_FULL_SPECIFICATION_PENDING | `classic-patentscom-8vu.13` | `classic-patentscom-8vu.14` |
| `us-3237-rillieux-evaporator` | AUDIT_FACSIMILE_REVIEW_PENDING | `classic-patentscom-8vu.15` | `classic-patentscom-8vu.16` |
| `us-3313014-lemelson-automatic-production` | Accepted during audit; verify landed work | `classic-patentscom-8vu.17` | `classic-patentscom-8vu.18` |
| `us-347140-thomson-welding` | AUDIT_FACSIMILE_REVIEW_PENDING | `classic-patentscom-8vu.19` | `classic-patentscom-8vu.20` |
| `us-3671542-kwolek-kevlar` | AUDIT_PRIMARY_FACSIMILE_PENDING | `classic-patentscom-8vu.21` | `classic-patentscom-8vu.22` |
| `us-4068536-stackhouse-manipulator` | FABRICATION_OR_RECONSTRUCTION_QUARANTINE | `classic-patentscom-8vu.23` | `classic-patentscom-8vu.24` |
| `us-4512709-milacron-robot-toolchanger` | Accepted during audit; verify landed work | `classic-patentscom-8vu.25` | `classic-patentscom-8vu.26` |
| `us-542846-diesel-engine` | AUDIT_FACSIMILE_REVIEW_PENDING | `classic-patentscom-8vu.27` | `classic-patentscom-8vu.28` |
| `us-6120588-eink` | AUDIT_FACSIMILE_REVIEW_PENDING | `classic-patentscom-8vu.29` | `classic-patentscom-8vu.30` |
| `us-613809-tesla-teleautomaton` | AUDIT_FACSIMILE_REVIEW_PENDING | `classic-patentscom-8vu.31` | `classic-patentscom-8vu.32` |
| `us-6331181-davinci` | AUDIT_FULL_SPECIFICATION_PENDING | `classic-patentscom-8vu.33` | `classic-patentscom-8vu.34` |
| `us-706737-fessenden-wireless` | AUDIT_FACSIMILE_REVIEW_PENDING | `classic-patentscom-8vu.35` | `classic-patentscom-8vu.36` |
| `us-7479949-multitouch` | AUDIT_FULL_SPECIFICATION_PENDING | `classic-patentscom-8vu.37` | `classic-patentscom-8vu.38` |
| `us-x1-hopkins-potash` | AUDIT_FACSIMILE_REVIEW_PENDING | `classic-patentscom-8vu.39` | `classic-patentscom-8vu.40` |
| `us-x72-whitney-cotton-gin` | Accepted during audit; verify landed work | `classic-patentscom-8vu.41` | `classic-patentscom-8vu.42` |

### Engineering, delivery and policy register

| Scope | Priority / complexity | Implementation | Acceptance | Prerequisites to implementation |
|---|---|---|---|---|
| Replace synthetic energy certification with kernel-owned balance evidence | P1 / L | `classic-patentscom-2y5.1` | `classic-patentscom-2y5.2` | Ready independently |
| Derive each displayed sensitivity from the current admitted model | P1 / M | `classic-patentscom-2y5.3` | `classic-patentscom-2y5.4` | Ready independently |
| Keep full archival records out of search and navigation client bundles | P1 / L | `classic-patentscom-fov.1` | `classic-patentscom-fov.2` | Ready independently |
| Establish a repeatable full-suite run without module-mock leakage | P1 / M | `classic-patentscom-zqi.1` | `classic-patentscom-zqi.2` | Ready independently |
| Make browser acceptance use deployed identity and source-bounded capabilities | P1 / M | `classic-patentscom-zqi.3` | `classic-patentscom-zqi.4` | Ready independently |
| Regenerate native content atomically and restore current full-catalogue parity | P1 / L | `classic-patentscom-zqi.5` | `classic-patentscom-zqi.6` | Ready independently |
| Replace local OCR entry point with bounded cloud Luna execution | P1 / L | `classic-patentscom-xpi.1` | `classic-patentscom-xpi.2` | Ready independently |
| Enforce the prohibition on any src/pages directory | P1 / S | `classic-patentscom-xpi.3` | `classic-patentscom-xpi.4` | Ready independently |
| Reconcile current architecture and roadmap promises without erasing ambition | P1 / M | `classic-patentscom-xpi.5` | `classic-patentscom-xpi.6` | Ready independently |
| Restore a reproducible br and bv workflow over the complete issue history | P1 / M | `classic-patentscom-xpi.7` | `classic-patentscom-xpi.8` | Ready independently |
| Unify per-output source, units, owner and refusal evidence across all 103 records | P1 / L | `classic-patentscom-2y5.5` | `classic-patentscom-2y5.6` | Ready independently |
| Complete claim-to-source-to-mechanism links without invented failure modes | P1 / L | `classic-patentscom-2y5.7` | `classic-patentscom-2y5.8` | Ready independently |
| Verify editorial and historical claims across the full catalogue against cited evidence | P2 / XL | `classic-patentscom-8vu.43` | `classic-patentscom-8vu.44` | Ready independently |
| Implement visitor control recording, checkpoints and deterministic replay | P2 / L | `classic-patentscom-2y5.9` | `classic-patentscom-2y5.10` | `classic-patentscom-2y5.6` |
| Implement capability-probed buffer transport for admitted field and body samples | P2 / L | `classic-patentscom-2y5.11` | `classic-patentscom-2y5.12` | `classic-patentscom-2y5.6` |
| Drive flagship scalar and vector displays from actual model samples | P2 / XL | `classic-patentscom-2y5.13` | `classic-patentscom-2y5.14` | `classic-patentscom-2y5.12` |
| Complete deterministic sampled audio transducers and lifecycle proof | P2 / L | `classic-patentscom-2y5.15` | `classic-patentscom-2y5.16` | `classic-patentscom-2y5.6` |
| Build two bounded coupled teaching laboratories with genuine shared port state | P2 / XL | `classic-patentscom-2y5.17` | `classic-patentscom-2y5.18` | `classic-patentscom-2y5.2`, `classic-patentscom-2y5.10`, `classic-patentscom-2y5.6` |
| Split selected visual and physics modules and prove bounded scene lifecycle | P1 / L | `classic-patentscom-fov.3` | `classic-patentscom-fov.4` | `classic-patentscom-fov.2` |
| Complete full-catalogue accessible and failure-mode browser acceptance | P1 / XL | `classic-patentscom-fov.5` | `classic-patentscom-fov.6` | `classic-patentscom-zqi.4` |
| Gate local releases on complete tests and matching browser/native artifacts | P1 / L | `classic-patentscom-zqi.7` | `classic-patentscom-zqi.8` | `classic-patentscom-zqi.2`, `classic-patentscom-zqi.4`, `classic-patentscom-zqi.6` |
| Prove dimensions, admissibility, conditioning and conservation of admitted models | P1 / L | `classic-patentscom-2y5.19` | `classic-patentscom-2y5.20` | `classic-patentscom-2y5.6` |
| Tie completion to fulfilled scope and a final integrated acceptance run | P1 / L | `classic-patentscom-xpi.9` | `classic-patentscom-xpi.10` | Ready independently |
| Complete admitted generic runtime ownership: aviation batch 1 | P2 / L | `classic-patentscom-2y5.21` | `classic-patentscom-2y5.22` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: computing batch 1 | P2 / L | `classic-patentscom-2y5.23` | `classic-patentscom-2y5.24` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: computing batch 2 | P2 / L | `classic-patentscom-2y5.25` | `classic-patentscom-2y5.26` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: computing batch 3 | P2 / L | `classic-patentscom-2y5.27` | `classic-patentscom-2y5.28` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: computing batch 4 | P2 / L | `classic-patentscom-2y5.29` | `classic-patentscom-2y5.30` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: consumer batch 1 | P2 / L | `classic-patentscom-2y5.31` | `classic-patentscom-2y5.32` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: consumer batch 2 | P2 / L | `classic-patentscom-2y5.33` | `classic-patentscom-2y5.34` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: consumer batch 3 | P2 / L | `classic-patentscom-2y5.35` | `classic-patentscom-2y5.36` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: electricity batch 1 | P2 / L | `classic-patentscom-2y5.37` | `classic-patentscom-2y5.38` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: electricity batch 2 | P2 / L | `classic-patentscom-2y5.39` | `classic-patentscom-2y5.40` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: materials batch 1 | P2 / L | `classic-patentscom-2y5.41` | `classic-patentscom-2y5.42` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: materials batch 2 | P2 / L | `classic-patentscom-2y5.43` | `classic-patentscom-2y5.44` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: materials batch 3 | P2 / L | `classic-patentscom-2y5.45` | `classic-patentscom-2y5.46` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: optics batch 1 | P2 / L | `classic-patentscom-2y5.47` | `classic-patentscom-2y5.48` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: telecom batch 1 | P2 / L | `classic-patentscom-2y5.49` | `classic-patentscom-2y5.50` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |
| Complete admitted generic runtime ownership: telecom batch 2 | P2 / L | `classic-patentscom-2y5.51` | `classic-patentscom-2y5.52` | `classic-patentscom-2y5.6`, `classic-patentscom-2y5.20` |

### Scope, target and proof for each engineering work item

Complexity is relative: S is a narrow change; M spans a few seams; L crosses runtime/content/UI boundaries; XL is a substantial corpus or coupled-system effort. These are scope estimates, not promised dates. All source restoration tasks additionally contain their exact unresolved inventory findings and evidence locators.

#### `classic-patentscom-2y5.1` — Replace synthetic energy certification with kernel-owned balance evidence

**Current state / why:** The live Wright 3D strip displays a green ΔH≈0 while energyLedger computes abs(netPower*0.015), ignores the canonical airspeed control and supplies invented default energies. At 28 and 40 mph the shared lift changes from 2046.94 to 4177.43 N but its ledger remains 46942.82 J and 0.672 W.

**Goals:** V10, V14. **Files/seams:** `src/physics/energyLedger.ts`, `src/physics/energyChannels.ts`, `src/physics/types.ts`, `src/components/patents/visuals/PortHamiltonianEnergyStrip.tsx`, `src/components/patents/visuals/three/WrightFlyer3D.tsx`.

**Implementation:**

1. Inventory every active strip caller and its admitted energy terms; distinguish dormant branches.
2. Have the actual accepted step supply stored energy and input/dissipation ports when the model defines them; consume that same receipt across faces.
3. Measure r=H[n+1]-H[n]-integral(Pin-Pdiss)dt in joules; display a documented tolerance and, if useful, r/dt separately in watts. Handle static/steady states explicitly.
4. Replace default invented values and all-zero refusal masquerading as conservation with a typed unavailable reason. Remove unconditional green certification; preserve legitimate instruments.

**Target and acceptance:**

- Changing canonical Wright airspeed affects admitted kinetic-energy data or produces an explicit unsupported-energy result.
- An intentionally unbalanced analytic fixture fails while lossless, dissipative, and driven fixtures pass appropriate residual bounds.
- Unit tests pin SI dimensions, varying dt, invalid inputs, refusal/last-valid behavior; browser checks compare 2D/3D/badge/strip tick and provenance.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.3` — Derive each displayed sensitivity from the current admitted model

**Current state / why:** Edison sensitivity returns 2V/100 even at hotResistanceOhm=200; at 110 V it reports 2.2 instead of 1.1 W/V. Crump uses fixed reference viscosity in a temperature derivative. Fixed Clavel/Segway derivatives also need domain checks. Some existing branches correctly use the kernel and must be preserved.

**Goals:** V10, V15. **Files/seams:** `src/physics/sensitivityKernel.ts`, `src/physics/catalogKernels.ts`, `src/physics/crumpFdmKernel.ts`, `src/components/patents/visuals/`.

**Implementation:**

1. Classify every reachable sensitivity as analytic, numeric, discrete effect, or unavailable.
2. Bind controls, units, output identity and admissible domain to the same step used by the instrument.
3. Use the actual current resistance/viscosity/geometry; discrete source topology gets a finite change with units rather than a fabricated derivative.
4. Keep AD as an implementation option, not a label until an AD path actually runs.

**Target and acceptance:**

- Edison 110 V/200 Ω gives 1.1 W/V with a documented numeric tolerance.
- Compare each continuous branch against scale-aware central differences away from discontinuities; one-sided checks or explicit refusal at boundaries.
- Cross-face browser check changes a nondefault control and verifies derivative, output and explanatory units refer to the same admitted model.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-fov.1` — Keep full archival records out of search and navigation client bundles

**Current state / why:** An isolated fresh build reports home 1.64 MB, detail 2.03 MB and timeline 1.70 MB first-load JS. Client search, era filter, timeline and lineage import the full data/patents graph. README advertises 198 kB.

**Goals:** V01, V22. **Files/seams:** `src/components/layout/PatentSearchPalette.tsx`, `src/components/layout/EraFilterBar.tsx`, `src/components/timeline/PatentTimeline.tsx`, `src/components/patents/PatentLineageView.tsx`, `src/data/patents/index.ts`.

**Implementation:**

1. Measure actual route chunks and attribute the complete catalogue payload before editing.
2. Generate a compact typed catalogue/search projection with exactly the searchable/filterable/navigation fields needed; keep full editions on server/per-record boundaries.
3. Preserve query semantics, keyboard results, era/category filtering, chronology, lineage, all 103 records, and static routes.
4. Record pre/post gzip/brotli, parse time and build-reported route sizes on the same source snapshot. Restore the 198 kB claim only if its measurement definition is met; otherwise document a precise tested budget.

**Target and acceptance:**

- Bundle-content checks show unselected full specifications are absent from home/search/navigation initial chunks.
- All search/filter/navigation contract tests pass and browser search opens Wright, a British record and a robotics record at 320 px.
- Fresh production size evidence demonstrates reduction without dropping catalogue content or moving it into an equally eager request.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-zqi.1` — Establish a repeatable full-suite run without module-mock leakage

**Current state / why:** Initial combined run: 2809 pass/9 fail. Chips 8/8, audio 3/3 and inventory 4/4 pass alone. A peer removed Whitney visual module mocks during the audit. Verify the repaired state before adding code; do not duplicate a peer fix.

**Goals:** V23. **Files/seams:** `src/components/patents/visuals/three/whitneyCottonGinVisual.test.ts`, `src/components/patents/visuals/StudioKernelChips.test.tsx`, `src/hooks/usePatentAudio.test.tsx`, `src/data/editions/archivalAuditInventory.test.ts`, `package.json`.

**Implementation:**

1. Reproduce on a stable source snapshot; identify process-global mocks and test ordering that affect other files.
2. Use isolated subprocess boundaries or injectable dependencies for necessary framework substitutes; keep real kernel and catalogue assertions.
3. Inventory tests which remove temporary fixtures and supply a repository-policy-compliant way to execute required checks without deleting files.
4. Avoid weakening counts/assertions to accommodate changing source during a run; capture the same source identity.

**Target and acceptance:**

- The full documented command passes in a clean process; a minimal order-reversal run for affected suites also passes.
- Logs contain full test count, failing names if any, source hash, tool versions and exclusions.
- An intentionally leaking fixture is detected by the isolation contract; no production kernel is replaced with a fake to obtain green tests.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-zqi.3` — Make browser acceptance use deployed identity and source-bounded capabilities

**Current state / why:** Live Wright/Tesla pass. Kwolek fails because the harness demands Interactive 3D Simulator instead of Visual Model in Preparation. Crump expects local source-sheet assets not referenced by its older deployed page. Eight failed events represent four actual failures plus duplicate evidence events.

**Goals:** V04, V09, V21, V23. **Files/seams:** `scripts/e2e-patent-vertical-slices.ts`, `scripts/patent-e2e-contract.ts`, `scripts/deployment-verification.ts`, `docs/PATENT_E2E_HARNESS.md`.

**Implementation:**

1. Validate a deployed source/artifact identity or obtain expected assets from the same build being tested; fail mismatch before interpreting content.
2. Use stable semantic face identifiers and explicit source-bounded capability metadata, not display-title selectors.
3. For an unavailable model, verify the explanatory state, complete text/PDF access and absence of unsupported control results.
4. Report failed actions separately from evidence-capture events; preserve traces, screenshots and diagnostics.

**Target and acceptance:**

- Wright, Tesla, Kwolek and Crump complete desktop/320 px flows against a matching build.
- Deliberate asset 404 fails; old-source/new-expectation mismatch reports identity drift without claiming a broken public link.
- Model-hold copy can change without selector breakage; an incorrectly enabled unsupported model fails the test.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-zqi.5` — Regenerate native content atomically and restore current full-catalogue parity

**Current state / why:** bun ios/check-native-parity.ts --require-visual-parity currently reports 136 differences. Closed predecessor classic-patentscom-vwu has a valid receipt at a61851d8, not the present changing source. Source state, models, asset manifests and content must be one coherent export.

**Goals:** V24. **Files/seams:** `ios/export-patents.ts`, `ios/export-native-models.ts`, `ios/check-native-parity.ts`, `ios/Resources/`, `ios/Sources/`, `scripts/dsr-apple-quality.sh`.

**Implementation:**

1. Capture a stable web source identity and inventory deltas before regenerating resources.
2. Preserve existing USDZ and source evidence; use byte-preserving manifest-only mode when geometry is unchanged.
3. Update exported content, equations, publication status and bundled assets together; keep first-party PDF download/hash boundary and offline read behavior.
4. Run existing native parity and DSR checks against that exact export and retain evidence.

**Target and acceptance:**

- Full 103-record native parity, including visual parity, passes against the same source snapshot.
- Offline catalogue/search/edition/figure reads work; PDF network access remains explicit and digest-checked.
- Current Catalyst tests and iPhone UI journeys pass; real hardware limitations are explicitly distinguished from simulator proof.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-xpi.1` — Replace local OCR entry point with bounded cloud Luna execution

**Current state / why:** package pipeline:ocr invokes scripts/ocr-patents.ts, which invokes local focr and local rendering. AGENTS permanently requires all OCR on cloud GPT-5.6 Luna workers, including small batches. No OCR has been executed by this audit.

**Goals:** V25. **Files/seams:** `scripts/ocr-patents.ts`, `package.json`, `scripts/download-patents.ts`, `docs/`.

**Implementation:**

1. Make local OCR execution impossible through the supported entry point; do not invoke focr even for availability/version checks.
2. Submit explicit PDF digest and bounded page ranges to cloud Luna workers with limited concurrency, durable checkpoints and resumable job identity.
3. Preserve all existing PDFs/drafts; keep machine output outside reviewed publication bindings.
4. If cloud transport is unavailable, return a specific blocker and leave existing partial work intact.

**Target and acceptance:**

- Tests with a command-capture boundary prove no local OCR process starts on success, failure, retry or missing-cloud paths.
- A bounded real cloud job, when transport is available, resumes without duplicating or losing page output.
- No machine draft becomes reviewed merely from successful completion; review remains a distinct acceptance step.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-xpi.3` — Enforce the prohibition on any src/pages directory

**Current state / why:** verify-data currently detects route-like files but allows an empty src/pages or .keep-only directory, contrary to the explicit repository invariant. The audit did not create this directory.

**Goals:** V26. **Files/seams:** `scripts/verify-data.ts`, `scripts/`.

**Implementation:**

1. Reject directory existence before scanning file contents.
2. Exercise the checker using an injected filesystem view or safe fixture path, never by creating src/pages in this repository.
3. Preserve existing error aggregation and normal App Router metadata/static-route checks.

**Target and acceptance:**

- Empty, .keep-only, declarations-only and legacy-route directory cases all fail with the architectural error.
- The actual src/app-only repository passes the gate and production metadata route checks.
- Tests do not delete files and do not create forbidden paths.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-xpi.5` — Reconcile current architecture and roadmap promises without erasing ambition

**Current state / why:** README, comprehensive plan and WASM TODOs disagree on counts, source boundaries, AD, energy, fields and completed work. Old deep TODO uses wrong IDs and historical models later rejected. README table and 198 kB diagram still overstate portions of current behavior.

**Goals:** V08, V11, V14, V15, V18, V20, V22, V27. **Files/seams:** `README.md`, `COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md`, `docs/DEEP_FRANKENSIM_WASM_INTEGRATION_PLAN.md`, `docs/FRANKENSIM_DEEP_WASM_INTEGRATION_TODO.md`, `docs/FRANKENSIM_WASM_INTEGRATION_TODO.md`, `docs/FRANKENSIM_VISUAL_WEAVE_WORKLIST.md`.

**Implementation:**

1. Separate current delivered behavior, active targets and superseded historical notes; preserve old artifacts.
2. Generate factual catalogue/acceptance/runtime counts from typed inventories on one snapshot.
3. Correct stale IDs and obsolete physics descriptions using current provenance; do not reintroduce rejected Kwolek ballistics or unsupported Spencer tube performance.
4. Keep replay, stronger field ownership and coupled labs as clearly tracked goals; update payload claims only with scoped measurements.

**Target and acceptance:**

- Every current numeric count and capability claim maps to an executable inventory/test or dated measurement.
- No checked item implies AD, conserved energy or WASM ownership merely from a helper/component name.
- Documentation links, catalogue IDs and source-boundary statements agree; historical notes are clearly dated/superseded.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-xpi.7` — Restore a reproducible br and bv workflow over the complete issue history

**Current state / why:** Installed br 0.5.6 fails runtime-schema repair and JSONL import. SQLite integrity is okay but DB has 140 rows vs 144 JSONL records, making default bv stale. Scratch official br 0.5.10 --no-db succeeds and is used for this recovery plan.

**Goals:** V28. **Files/seams:** `.beads/`, `AGENTS.md`.

**Implementation:**

1. Preserve backups and all DB-only/JSONL-only records before any migration; inspect plan/receipt of additive reconciliation.
2. Use a supported verified br release through the project workflow, not direct JSONL/SQL mutation.
3. Reconcile to a complete store without tombstoning/replacing unrelated records, then verify list/show/ready/update/deps/sync round trips.
4. Make bv read that same current issue set and document version/mode until the installed binary is repaired.

**Target and acceptance:**

- All original 144 IDs and all new recovery IDs remain accounted for with descriptions/dependencies preserved.
- br ready and bv triage agree on current records and no stale database silently hides work.
- A backed-up round trip of a disposable task record preserves multiline body and dependencies without any file deletion.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.5` — Unify per-output source, units, owner and refusal evidence across all 103 records

**Current state / why:** A generic module being loaded is weaker than owning the public state. Only Otto, Kamen transporter and Roomba have provesSharedBusSource descriptors in the captured manifest. Other dedicated boundaries can step legitimately without that flag; audit each actual output rather than blindly flipping booleans.

**Goals:** V10, V11, V12, V13, V19. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/types.ts`, `src/physics/useFrankenSimPhysics.ts`, `src/physics/telemetryData.ts`, `src/physics/energyChannels.ts`.

**Implementation:**

1. For every catalogue ID enumerate active controls, outputs, canonical units, source/scenario origin, governing function, fallback, domain/refusal and the module that actually computed the last accepted result.
2. Derive cold/loading/WASM/fallback/refused/unavailable states from runtime receipts. A module loaded without stepping cannot promote the label; a stepped adjunct cannot promote unrelated host outputs.
3. Permit one envelope to contain explicitly qualified outputs from different owners; forbid mixed ticks, stale incompatible states and borrowed digests.
4. Record exact generic-crate export availability, then promote law ownership in the bounded family batches. Preserve good source topology where the source provides no quantitative law.

**Target and acceptance:**

- All 103 IDs have a complete field-level inventory and no unnamed owner/units/origin.
- Negative tests cover loaded-but-unstepped, failed-step, stale-tick, mixed-owner and forged-provenance outputs.
- Browser unload/reload/WASM-disabled paths display truthful provenance and last valid state without destroying the reader or substituting another patent.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.7` — Complete claim-to-source-to-mechanism links without invented failure modes

**Current state / why:** Claim decoders, spec clauses and runtime probes exist, but the doctrine requires all independent claims to have an appropriate probe and every source paragraph to have an explanation. Old plans infer stall, burnout and faults from toggles without adequate source/model conditions.

**Goals:** V05, V06, V07, V09, V16, V21. **Files/seams:** `src/data/editions/parallelReadings.ts`, `src/physics/specClauses.ts`, `src/physics/claimConstraints.ts`, `src/physics/weaveSurfaces.ts`, `src/components/patents/ClaimsDecoder.tsx`, `src/components/patents/DualProjectionViewer.tsx`.

**Implementation:**

1. Inventory every independent claim and relevant paragraph across all 103 records against edition identity; record deliberate nonphysical/legal-only claims with an explanatory probe rather than forced dynamics.
2. Map source clause/figure occurrence to a named model predicate or finite change, the emitted output, explanatory text and keyboard action.
3. Provide explicit reveal-corresponding-source/explanation actions with stable IDs and URL/back behavior; keep synchronization user-controlled and reduced-motion safe.
4. A prior-art inversion may illustrate only outcomes supported by the admitted model; distinguish an educational intervention from a historical assertion.

**Target and acceptance:**

- Every independent claim is mapped or has a documented nonphysical explanation; every accepted edition paragraph has its correct reading.
- Automated contract detects wrong claim IDs and stale block mappings; browser tests toggle representative probes and compare matching source/diagram/output on one tick.
- No forced auto-scroll steals focus; all links and controls work in 320 px, keyboard-only, reduced-motion and unavailable-WebGL states.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

Additional prerequisites to companion proof: `classic-patentscom-2y5.6`.

#### `classic-patentscom-8vu.43` — Verify editorial and historical claims across the full catalogue against cited evidence

**Current state / why:** Strict acceptance establishes a structured source edition, not automatic correctness of all Plain English equations, historical anecdotes, priority disputes or legal outcomes. Several current roadmap examples still confuse later machines with the selected grant.

**Goals:** V02, V05, V08, V16. **Files/seams:** `src/data/patents/`, `docs/provenance/`, `src/data/colorizedEquations.ts`, `src/data/editions/`.

**Implementation:**

1. Build a per-record assertion checklist for identity/hero quotations, claim decoders, named prior art, court outcomes, aftermath, physical constants and scientific interpretation.
2. Trace historical/legal assertions to primary or authoritative evidence and physical assertions to the exact admitted model and declared units/assumptions. Research current external sources only as needed with the prescribed HTTP user agent.
3. Correct unsupported assertions while preserving explanatory depth; an honest empty patentWars is preferable to an invented fight.
4. Cover accepted records as well as held ones; strict edition acceptance must not exempt editorial copy from review.

**Target and acceptance:**

- All 103 records have assertion-level evidence for substantive historical/legal claims and quoted text.
- Equations, interpretations and model regimes agree; no later embodiment is attributed to the selected patent without explicit separation.
- Per-record content regressions and browser rendering checks retain claim text, accessible mathematics and readable explanations.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.9` — Implement visitor control recording, checkpoints and deterministic replay

**Current state / why:** The active bus has lastFrame and deterministic host ticks but no general visitor control history/scrubber. AGENTS promises repeatable Wright warp and Lamarr hop sequences. Host FNV-1a and WASM Blake3 must not be conflated.

**Goals:** V10, V12, V18. **Files/seams:** `src/physics/useFrankenSimPhysics.ts`, `src/physics/usePatentPhysics.ts`, `src/physics/tickScheduler.ts`, `src/components/patents/visuals/`, `src/physics/types.ts`.

**Implementation:**

1. Define a bounded versioned tape of canonical control events at simulation ticks, initial conditions, seeded stochastic state and exact model/artifact identity.
2. Implement deterministic checkpoint/restore and replay from the same accepted kernel path; reject incompatible model versions instead of silently resuming.
3. Add accessible record, pause, rewind and scrub controls with explanatory Wright and Lamarr examples; examples are authored teaching sequences, not historical flight records.
4. Compute Blake3 over canonical accepted state where supported; retain explicit host digest type elsewhere. Define float serialization/quantization policy and do not promise cross-platform bit equality without evidence.

**Target and acceptance:**

- Record, reload same compatible state, scrub backward/forward and obtain the same canonical state digest on the specified runtime.
- Changed seed/model/artifact invalidates comparison; refusal resumes from the last legal checkpoint without inventing state.
- Bounded memory, long-pause/catch-up and route teardown tests pass; keyboard and 320 px replay operate without loss of normal controls.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

Additional prerequisites to companion proof: `classic-patentscom-2y5.12`.

#### `classic-patentscom-2y5.11` — Implement capability-probed buffer transport for admitted field and body samples

**Current state / why:** Current host-fed bus works but the specified shared-ring/transferable compatibility path is not present in its active implementation. A transport abstraction alone cannot count as a solver.

**Goals:** V10, V12, V13, V19. **Files/seams:** `src/physics/useFrankenSimPhysics.ts`, `src/physics/transport.ts`, `src/physics/tickScheduler.ts`, `src/physics/fieldTextures.ts`, `src/components/patents/visuals/three/ThreeStudioScene.ts`.

**Implementation:**

1. Probe actual cross-origin isolation, SharedArrayBuffer and worker capabilities; keep the portable transfer path first-class.
2. Use versioned bounded buffers with ownership/lease semantics, tick and shape metadata, and bounded backpressure/catch-up.
3. Drain each accepted field/pose buffer once per tick into renderer resources; handle WASM memory growth, detached buffers, context loss and worker failure.
4. Describe actual compatibility mode in concise product language; do not require isolation to read or operate the exhibit. Preserve legacy files unless separately authorized to remove them.

**Target and acceptance:**

- Forced nonisolated mode and supported shared-memory mode produce equivalent accepted states on the tested platform.
- No stale view survives memory growth; buffer counts plateau under sustained stepping; transfers cannot replay a released lease.
- Worker failure shows last valid pose and an honest fallback/refusal while text, controls and route navigation remain usable.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.13` — Drive flagship scalar and vector displays from actual model samples

**Current state / why:** The deep roadmap promises sampled electromagnetic, thermal, semiconductor, neutron and airflow fields. Moving constants into TS helpers or feeding a generic demonstration array does not establish source-specific field ownership.

**Goals:** V11, V12, V13. **Files/seams:** `src/physics/fieldTextures.ts`, `src/physics/coverageManifest.ts`, `src/components/patents/visuals/three/`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. For Wright airflow, Tesla motor/coil, Edison radiation/thermal, Noyce/CCD carrier fields and Fermi flux, inventory which admitted model can actually emit spatial samples.
2. Compose generic fs-airflow/fs-flux/fs-conduction/fs-lattice or the appropriate existing owner; inspect available exports before adding narrow browser exports.
3. Label the domain and declared material/boundary inputs; do not infer a spatial flux from a lumped reactor or radiative power equation without an additional explicit model.
4. Render the same buffer through 2D and 3D; retain topology and explanatory views if the stronger field solve remains blocked. Do not call steam flow in a separator a justified de Laval turbine model.

**Target and acceptance:**

- Each listed flagship field is either an actual admitted sampled model with source/scenario provenance or remains an explicitly tracked blocker; no canned tape is credited as completion.
- Grid/buffer size, finite values, integral/conservation checks and boundary conditions pass against analytic cases.
- Changing a physical input changes the sampled field and both renderers consistently; context-loss, reduced-motion and transfer-mode browser paths pass.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

Additional prerequisites to companion proof: `classic-patentscom-2y5.20`.

#### `classic-patentscom-2y5.15` — Complete deterministic sampled audio transducers and lifecycle proof

**Current state / why:** Existing Web Audio tones and mute cleanup are real. The deep roadmap additionally promises procedural waveform streaming; unused popcorn randomness is not a live bug. The work must start by tracing active call sites.

**Goals:** V17, V18. **Files/seams:** `src/utils/soundEngine.ts`, `src/hooks/usePatentAudio.ts`, `src/components/layout/AudioCleanupProvider.tsx`, `src/components/patents/visuals/`.

**Implementation:**

1. For Bell, Morse, Marconi, Tesla coil and Lamarr, trace current/voltage/hop/spark events to audio output and declare any audible frequency/time scaling.
2. Where a signal reconstruction is admitted, stream deterministic samples with bounded buffering; use seeded event generation for stochastic illustrative models.
3. Keep default mute, remute on mount, user-gesture startup, immediate stop on mute/hide/unmount and stale-promise protection.
4. Do not add forbidden historical carbon/magnetron/propeller parameters just because an old roadmap requested a sound; qualify modern sonification explicitly.

**Target and acceptance:**

- Offline audio render of a fixed tape has reproducible samples/envelope/spectrum within declared tolerance.
- Changing an admitted input changes the expected waveform; unsupported inputs produce no fabricated acoustic claim.
- Real browser mute, route switch, suspended/resumed context and reduced-motion/no-audio fallback tests show no lingering sound or node accumulation.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.17` — Build two bounded coupled teaching laboratories with genuine shared port state

**Current state / why:** coupleGraph currently provides within-patent host gains, not the roadmap multi-patent solver. Two teaching compositions are wanted: rotary drive/spinning/sewing and generator/transformer/lamp. Historical interoperability is not established by juxtaposition.

**Goals:** V14, V18, V20. **Files/seams:** `src/physics/coupleGraph.ts`, `src/physics/energyLedger.ts`, `src/physics/types.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/fs-couple/`.

**Implementation:**

1. Declare each component, port dimensions, direction/sign convention and source versus modern illustrative parameters. Reuse accepted kernel owners.
2. For mechanical and electrical pilot chains, solve coupled state/constraints and energy transfer with bounded steps and documented refusal.
3. Provide an accessible lab UI that shows cause, propagated response and the evidence boundary; label the assembly as an educational composition when historically unproven.
4. Run one shared replay clock; never combine independently timed HUD numbers and call that coupling.

**Target and acceptance:**

- Disconnected components stop transmitting power/state; reconnection has physically defined transition behavior.
- Port units and signs validate; injected energy errors are detected; conservation/passivity checks use measured residuals.
- Both pilot labs replay deterministically and work with keyboard/320 px/text-only access; missing source/model support stays an open blocker.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-fov.3` — Split selected visual and physics modules and prove bounded scene lifecycle

**Current state / why:** Dynamic 3D imports already exist, but detail first-load remains 2.03 MB and other shared client imports may retain unselected kernels/2D modules. Old scene-rebuild defects are not assumed to persist universally.

**Goals:** V09, V21, V22. **Files/seams:** `src/components/patents/visuals/index.tsx`, `src/components/patents/DualProjectionViewer.tsx`, `src/components/patents/visuals/three/ThreeStudioScene.ts`, `src/physics/telemetryData.ts`, `next.config.mjs`.

**Implementation:**

1. After compact catalogue projection, attribute remaining route weight with actual chunks and network traces.
2. Lazy-load selected visual/kernel data at user-relevant boundaries without delaying source text or accessible controls unnecessarily.
3. Measure canvas creation, disposal, listener/resource counts and camera preservation through control changes, face switching and repeated navigation.
4. Keep existing static KaTeX choice unless measured LCP evidence justifies revisiting it; do not use pagination or reduced content as an unapproved shortcut.

**Target and acceptance:**

- Unselected patent visual/kernel modules are not eagerly loaded by a source-only journey.
- No slider changes recreate a scene; contexts/listeners/buffers plateau and camera remains stable under repeated journeys.
- Retained traces compare LCP/INP/transfer/parse and frame pacing on the same environment, with software rendering separated from real GPU results.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-fov.5` — Complete full-catalogue accessible and failure-mode browser acceptance

**Current state / why:** Wright/Tesla desktop/320 px passed, but that does not prove 103 routes, all views, reduced motion, WebGL loss, slow assets or screen-reader behavior. Existing blocked classic-patentscom-va0 owns real-device Safari/GPU evidence and remains the hardware follow-up.

**Goals:** V01, V04, V09, V21. **Files/seams:** `scripts/e2e-patent-vertical-slices.ts`, `src/components/patents/`, `src/components/layout/`, `docs/PATENT_E2E_HARNESS.md`.

**Implementation:**

1. Run all 103 records against a matching local production artifact in both widths with named controls, focus behavior, URL/back state and complete source delivery.
2. Add no-WebGL, rejected-WASM, reduced-motion, keyboard-only, asset timeout and context-loss cases across each distinct mechanism/runtime family.
3. Audit actual semantic accessibility and accessible math output, not raw attribute counts; fix confirmed failures with retained before/after evidence.
4. Keep real-device Safari and real-GPU acceptance linked to va0 rather than duplicating or falsely passing it with SwiftShader.

**Target and acceptance:**

- Full-catalogue automated matrix passes with no swallowed or unclassified failures.
- Representative keyboard/screen-reader/reduced-motion routes remain pedagogically useful when graphics fail.
- Performance evidence states hardware/rendering mode; the real-device requirement remains separately visible until actually satisfied.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-zqi.7` — Gate local releases on complete tests and matching browser/native artifacts

**Current state / why:** The existing verified prebuilt workflow correctly locks, validates an isolated deployment and source-reader sweep before aliases. Its selected tests leave unrelated physics/component regressions outside the release gate, and native resources drift independently.

**Goals:** V23, V24, V27. **Files/seams:** `scripts/verified-production-deploy.ts`, `scripts/deployment-verification.ts`, `scripts/dsr-apple-quality.sh`, `package.json`, `docs/PATENT_E2E_HARNESS.md`.

**Implementation:**

1. Run the canonical full suite, publication, type, lint and build gates against one stable source and dependency identity before preparing a release.
2. Keep all-catalogue source-reader coverage and add representative interaction/refusal journeys covering distinct owner families and source-bounded records.
3. Verify asset manifests and browser expectations come from the tested build. Validate native export parity when shipping native artifacts.
4. Retain the exclusive prebuilt workflow and alias-after-verification order; rehearse locally without promotion. Do not add GitHub Actions or cloud builds contrary to project policy.

**Target and acceptance:**

- A physics test failure outside the old selected list blocks release preparation.
- Stale source/assets, wrong model hash, incomplete build and failed browser refusal case block promotion.
- A same-source local rehearsal succeeds with retained receipts; actual deployment remains a separately authorized action.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.19` — Prove dimensions, admissibility, conditioning and conservation of admitted models

**Current state / why:** Sophisticated mathematical labels are insufficient when model inputs are unknown, a derivative crosses a discrete regime or a balance is synthetic. Rigorous numerical contracts should improve the instruments rather than manufacture certainty.

**Goals:** V10, V11, V12, V14, V15, V20. **Files/seams:** `src/physics/types.ts`, `src/physics/energyLedger.ts`, `src/physics/sensitivityKernel.ts`, `src/physics/claimConstraints.ts`, `src/physics/`, `~/projects/frankensim/crates/fs-ivl/`, `~/projects/frankensim/crates/fs-regime/`.

**Implementation:**

1. Introduce dimension-checked input/output/port contracts, preserving normalized topology as dimensionless rather than pretending it is SI.
2. Use explicit parameter intervals and regime predicates to distinguish source uncertainty, scenario ranges and numerical error. Refuse a scalar answer when the interval crosses an unsupported regime.
3. For continuous sensitivities, select perturbations by input/output scale and test conditioning; for constraints test rank/closure and singular configurations.
4. For energetic systems validate discrete power balance/passivity, analytic solutions and timestep convergence; correct model/solver errors before loosening tolerances.
5. Use metamorphic laws such as unit conversion, symmetry, scaling and zero-input limits; seeded fuzzing explores valid and invalid domains without requiring a historical number for every parameter.

**Target and acceptance:**

- Every admitted numerical family has analytic or independently derived reference cases plus convergence/metamorphic/refusal tests.
- Deliberate unit mismatch, energy injection, missing parameter, singularity and non-finite output are caught.
- Intervals/uncertainty remain honest and readable; no undocumented Monte Carlo number or arbitrary precision is presented as historical truth.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-xpi.9` — Tie completion to fulfilled scope and a final integrated acceptance run

**Current state / why:** Pre-audit JSONL had 142 closed issues and no open implementation work, while Kwolek, Fermi and GB 1306 full recovery scopes remained incomplete. Their closing reasons prove containment, not full restoration. This is a completion-accounting defect rather than evidence that all prior work was worthless.

**Goals:** V02, V03, V07, V11, V21, V23, V24, V27, V28. **Files/seams:** `.beads/`, `scripts/verify-data.ts`, `src/data/editions/archivalAuditInventory.server.ts`, `src/physics/coverageManifest.ts`, `docs/`.

**Implementation:**

1. For every recovery issue, distinguish containment/availability, implementation and independent acceptance; move genuinely unfinished scope to linked open tasks rather than quietly dropping it.
2. Make live inventory findings and owner/proof gaps point to currently actionable tasks; detect closed-only ownership and orphaned findings without putting process metadata in visitor flows.
3. Produce the final integrated matrix from the same source: archive acceptance, claim/figure/reading parity, numerical/refusal checks, full tests/types/lint/build, browser access/performance and native parity.
4. Document remaining external source/cloud/device blockers precisely. A release/epic cannot be called fully complete while mandatory evidence is still blocked.
5. Build completion accounting independently now; its final companion acceptance waits for all other scoped proof tasks and the existing real-device va0 requirement. Epics organize work and do not count as prerequisite implementations.

**Target and acceptance:**

- Every unresolved structured finding has active responsibility; every completed recovery scope has evidence satisfying its actual acceptance criteria.
- Final integrated verification succeeds for all intended capabilities or reports explicit unresolved rows without a fabricated completion percentage.
- br/bv graph is acyclic, companion proof tasks exist, all original issue history is preserved and no pointless dependency blocks unrelated useful work.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

Additional prerequisites to companion proof: `classic-patentscom-2y5.2`, `classic-patentscom-2y5.4`, `classic-patentscom-fov.2`, `classic-patentscom-zqi.2`, `classic-patentscom-zqi.4`, `classic-patentscom-zqi.6`, `classic-patentscom-xpi.2`, `classic-patentscom-xpi.4`, `classic-patentscom-xpi.6`, `classic-patentscom-xpi.8`, `classic-patentscom-8vu.2`, `classic-patentscom-8vu.4`, `classic-patentscom-8vu.6`, `classic-patentscom-8vu.8`, `classic-patentscom-8vu.10`, `classic-patentscom-8vu.12`, `classic-patentscom-8vu.14`, `classic-patentscom-8vu.16`, `classic-patentscom-8vu.18`, `classic-patentscom-8vu.20`, `classic-patentscom-8vu.22`, `classic-patentscom-8vu.24`, `classic-patentscom-8vu.26`, `classic-patentscom-8vu.28`, `classic-patentscom-8vu.30`, `classic-patentscom-8vu.32`, `classic-patentscom-8vu.34`, `classic-patentscom-8vu.36`, `classic-patentscom-8vu.38`, `classic-patentscom-8vu.40`, `classic-patentscom-8vu.42`, `classic-patentscom-2y5.6`, `classic-patentscom-2y5.8`, `classic-patentscom-8vu.44`, `classic-patentscom-2y5.10`, `classic-patentscom-2y5.12`, `classic-patentscom-2y5.14`, `classic-patentscom-2y5.16`, `classic-patentscom-2y5.18`, `classic-patentscom-fov.4`, `classic-patentscom-fov.6`, `classic-patentscom-zqi.8`, `classic-patentscom-2y5.20`, `classic-patentscom-2y5.22`, `classic-patentscom-2y5.24`, `classic-patentscom-2y5.26`, `classic-patentscom-2y5.28`, `classic-patentscom-2y5.30`, `classic-patentscom-2y5.32`, `classic-patentscom-2y5.34`, `classic-patentscom-2y5.36`, `classic-patentscom-2y5.38`, `classic-patentscom-2y5.40`, `classic-patentscom-2y5.42`, `classic-patentscom-2y5.44`, `classic-patentscom-2y5.46`, `classic-patentscom-2y5.48`, `classic-patentscom-2y5.50`, `classic-patentscom-2y5.52`, `classic-patentscom-va0`.

#### `classic-patentscom-2y5.21` — Complete admitted generic runtime ownership: aviation batch 1

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-621195-zeppelin-airship: FrankenSimEngine.stepZeppelinAirship; current surface fs-wasm; controls trimWeight, gasInflation, flightAlt, flightSpeedKnots
- us-2318259-sikorsky-helicopter: stepSikorskyHelicopterSi (deterministic TypeScript scenario; historical SI dynamics refused); current surface host-only; controls collectivePitchDeg, cyclicPitchForwardDeg, cyclicRollRightDeg, tailRotorPedalPercent, engineThrottlePercent, engineRunning

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.23` — Complete admitted generic runtime ownership: computing batch 1

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-395781-hollerith-tabulating: FrankenSimEngine.stepHollerithTabulating; current surface fs-wasm; controls cardsPerMin, batteryVolts, activeRelays
- us-2524035-bardeen-transistor: Source-bounded TypeScript Table I reader; quantitative carrier transport refused; current surface host-only; controls operatingSample, pointSpacingMils, claim1Active
- us-2846084-goertz-electronic-master-slave-manipulator: stepGoertzMasterSlaveTopology (deterministic TypeScript source-bound topology; no FrankenSim WASM module stepped); current surface host-only; controls horizontalArmPivot, horizontalArmRoll, verticalArmPivot, verticalArmRoll, toolAxis171, toolAxis172, gripperClosure, contactResistance, forceReflectionEnabled, tachometerDampingEnabled, limiterEnabled
- us-2981877-noyce-ic: Source-Bounded TypeScript Topology Step (Electrical Performance Refused); current surface fs-wasm; controls oxideThicknessUm, leadStripWidthFraction
- us-2988237-devol-programmed-transfer: stepDevolProgrammedTransfer (source-bounded TypeScript code-state); current surface host-only; controls recordedSlot, sensedSlot, bitWidth, anticipationEnabled, recordingMode, gripperClosed
- us-3081379-lemelson-machine-vision: stepLemelsonMachineVisionTopology (deterministic TypeScript source-bounded signal topology; no calibrated beam velocity, optical responsivity, solenoid force, or response model); current surface host-only; controls scanPathEnabled, synchronizedGateEnabled, analyzingCircuitEnabled, inspectionSignalPresent, referenceSignalMatches
- us-3119501-lemelson-automatic-warehousing: stepLemelsonWarehouseTopology (normalized host topology; quantitative SI model refused); current surface host-only; controls railAddressFraction, levelAddressFraction, shuttleExtensionFraction, automaticAddressing
- us-3138743-kilby-integrated-circuit: Source-Bounded TypeScript Topology Step (Electrical Performance Refused); current surface host-only; controls sectionRevealFraction, wireArchFraction, claim1ConductiveMeansPresent

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.25` — Complete admitted generic runtime ownership: computing batch 2

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-3212649-amf-versatran: stepAmfVersatranTopology (source-bounded TypeScript topology; no FrankenSim/WASM module); current surface host-only; controls columnRotation, carriageLift, armTravel, wristRotation, wristSwing, gripperOperation, teachReplayMode, resolverPhaseOffset, claim1TopologyEnabled, claim8RecordPlaybackEnabled, claim12PinionGripperEnabled
- us-3260375-lemelson-adjustable-manipulator: stepLemelsonManipulatorTopology (source-bounded TypeScript topology); current surface host-only; controls carriagePosition, columnElevation, columnAzimuth, wristPivot, jawClosure, cyclePhase, stop1Azimuth, stop2Azimuth, stop1Elevation, stop2Elevation
- us-3313014-lemelson-automatic-production: stepLemelsonAutomaticProductionTopology (deterministic TypeScript source-bounded topology; no FrankenSim WASM module stepped); current surface host-only; controls carrierAddressFraction, liftFraction, reachFraction, stationDetected, stationCoupled, cycleProgress
- us-3541541-engelbart-mouse: HostKernel.stepEngelbartMouse (compiled rolling-contact WASM unavailable); current surface host-only; controls mouseSpeed, wheelRadius, pulsesPerRev
- us-3728480-baer-odyssey: HostKernel.stepBaerOdysseySi (source circuit topology and fixed-step SCR latch; compiled digital-circuit WASM unavailable); current surface host-only; controls player1PotX, player1PotY, player2PotX, player2PotY, englishControl, ballSpeedMultiplier, rfChannel, chromaPhaseDeg
- us-3858232-boyle-smith-ccd: HostKernel.stepBoyleSmithCcdSource (source topology and fixed-step sequence; compiled lattice/carrier WASM unavailable); current surface host-only; controls pulseWidthToStepRatio, clockStepRateHz, pulseDepthNormalized, running
- us-4068536-stackhouse-manipulator: stepStackhouseSourceTopology (typed browser mirror of fs-mbd revolute-joint forward kinematics; no Stackhouse WASM export; SI dynamics refused); current surface host-only; controls forearmRollDeg, intermediateRollDeg, toolRollDeg, firstObliqueAngleDeg, secondObliqueAngleDeg, singleIntersection
- us-4098001-watson-rcc: stepWatsonRemoteCenterComplianceTopology (source-topology browser pose; fs-solid::Rod owner identified; material, load, and contact inputs absent, so no WASM/SI solve); current surface host-only; controls lateralContactFraction, axisMismatchFraction, remoteCenterTopology, antiTwistConstraint

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.27` — Complete admitted generic runtime ownership: computing batch 3

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-4136359-wozniak-apple: FrankenSimEngine.stepWozniakApple; current surface fs-wasm; controls crystalFreq, ramCapacityKb
- us-4341502-makino-scara: fs-mbd::JointModel::revolute law owner identified; generic revolute-joint composition identified; closed-chain SI dynamics refused; stepMakinoScaraTopology supplies exact normalized closure; current surface host-only; controls firstLinkAngleDeg, fourthLinkAngleDeg, toolAttitudeDeg, topologyVariant
- us-4512709-milacron-robot-toolchanger: stepMilacronRobotToolchanger · fs-mbd::JointModel::prismatic / fs-contact::normal_patch / fs-tribo::partial_slip owners identified; SI solve refused; current surface host-only; controls toolBasePresent, registrationFraction, lockingSlideFraction, claimFourTMember
- us-4575330-hull-stereolithography: FrankenSimEngine.stepHullStereolithography (source topology; unparameterized owners refused); current surface host-only; controls shutterRequestedOpen, scanXFraction, scanZFraction, recoatExcursionFraction, displayLaminaCount
- us-4765668-robot-end-effector: stepRobotEndEffector · fs-mbd::JointModel::helical typed mirror; fs-mbd::JointModel::revolute / fs-mbd::JointModel::prismatic owners identified; fs-contact::normal_patch solve refused; current surface host-only; controls jawOpeningFraction, gripForceSetpointN, frameRotationDeg, fingerChangeFraction, transverseOffsetFraction
- us-4976582-clavel-delta-robot: stepClavelDeltaRobotTopology (source-bounded TypeScript normalized closed-chain topology; generic fs-mbd lacks holonomic loop constraints; no FrankenSim/WASM module); current surface host-only; controls armOneInput, armTwoInput, armThreeInput, toolAxisInput, claim1TopologyEnabled, claim2PairedBarsEnabled, claim8BaseMotorEnabled
- us-6285999-pagerank: stepPageRank; current surface host-only; controls dampingFactor
- us-6331181-davinci: resolveDaVinciInterfaceTopology (source-bounded TypeScript topology; quantitative mechanics refused); current surface host-only; controls compatibilitySignalPresent, calibrationRecordAvailable, engagementSignalPresent

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.29` — Complete admitted generic runtime ownership: computing batch 4

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-7479949-multitouch: stepMultiTouch; current surface host-only; controls fingerSeparationMm, fingerCount

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.31` — Complete admitted generic runtime ownership: consumer batch 1

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-x72-whitney-cotton-gin: Source-bounded host kinematics; fs-lbm may shape lint display, but no multibody WASM composition is available.; current surface fs-wasm; controls crankRpm
- us-x8277-mccormick-reaper: Host no-slip estimate from dimensions printed in US X8277; no WASM kernel is loaded.; current surface host-only; controls forwardSpeedMph
- us-x9430-colt-revolver: stepColtLockwork source-bounded host topology; current surface fs-wasm; controls cockingTravelPct, chamberIndex
- us-588-ericsson-propeller: FrankenSimEngine.stepEricssonPropeller (illustrative display motion only); current surface fs-wasm; controls shaftRpm, bladePitchAngleDeg
- us-6162-corliss-steam-engine: FrankenSimEngine.stepCorlissEngine; current surface fs-wasm; controls steamPressurePsi, engineRpm, cutoffPct
- us-36836-gatling-gun: FrankenSimEngine.stepGatlingGun; current surface fs-wasm; controls crankRpm, barrelCount
- us-48475-yale-lock: FrankenSimEngine.stepYaleLock; current surface host-only; controls keyInsertion, appliedTorqueNm
- us-79265-sholes-typewriter: Source-constrained TypeScript display cycle; no measured rate or pitch; current surface fs-wasm; controls typingSpeedWpm

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.33` — Complete admitted generic runtime ownership: consumer batch 2

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-124404-westinghouse-air-brake: FrankenSimEngine.stepWestinghouseAirBrake; current surface host-only; controls trainPipePressure, reservoirPipePressure, selectingCockPosition, accidentTrip, signalPulsePressure
- us-135245-pasteur-fermentation: Source-bounded TypeScript reader state; no quantitative process model; current surface host-only; controls co2SweepPct, sprayCoveragePct, wortTempC
- us-247804-delaval-separator: FrankenSimEngine.stepDeLavalSeparator; current surface fs-wasm; controls bowlRpm, rawMilkFlowLph
- us-313224-mergenthaler-linotype: FrankenSimEngine.stepMergenthalerLinotype; current surface host-only; controls matrixRate, spacebandWedge, potTemp, lineLengthPicas
- us-319596-maxim-machine-gun: FrankenSimEngine.stepMaximMachineGun; current surface fs-wasm; controls cyclePhase, gasImpulsePct
- us-470918-reno-escalator: TypeScript host kinematic readout (no Reno WASM step); current surface host-only; controls inclineAngle, beltSpeed
- us-808897-carrier-air-conditioner: FrankenSimEngine.stepCarrierAirConditioner; current surface host-only; controls airflowCfm, sprayRatePct, separatorFaces
- us-1219881-sundback-zipper: FrankenSimEngine.stepSundbackZipper; current surface host-only; controls sliderPositionPct, pullForceN, lateralTensionN, flexAngleDeg, toothDensityTpi, staggerAligned

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.35` — Complete admitted generic runtime ownership: consumer batch 3

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-1781541-einstein-refrigerator: stepEinsteinRefrigerator (declared illustrative scenario); current surface fs-wasm; controls heatInput, totalPressure, ammoniaRatio
- us-2543181-land-polaroid: Fickian Diffusion Transfer Reversal & Competitive Redox Kinetics; current surface host-only; controls developmentTimeSec, exposureFraction, reagentViscosityCp, rollerGapUm, alkaliPh, claim1Active
- us-2717437-mestral-velcro: stepMestralVelcroSi (typed host source-topology/refusal; no FrankenSim WASM module stepped); current surface host-only; controls filamentDiameterMm, hookLengthMm, hookDensityPerCm2, peelAngleDeg, peelProgress
- us-3858581-kamen-medication-injection-device: stepKamenInjectionMechanism (typed browser mirror of fs-mbd helical-joint topology; no Kamen WASM export; quantitative delivery refused); current surface host-only; controls selectedPulseCount, displayTurnsPerSecond, offIntervalDisplaySeconds, clutchEngaged, running
- us-6302230-kamen-segway: TypeScript modern illustrative Kamen Segway kernel; current surface host-only; controls riderPitchDeg, steeringInput, riderMassKg, groundFrictionCoeff, speedLimitMS

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.37` — Complete admitted generic runtime ownership: electricity batch 1

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-132-davenport-electric-motor: FrankenSimEngine.stepDavenportMotor; current surface host-only; controls batteryVoltage, loadTorque
- us-120057-gramme-dynamo: Normalized source-faithful collection model; not a measured or WASM electrical rating; current surface fs-wasm; controls shaftRate
- us-233692-pelton-water-wheel: Source-bounded TypeScript apparatus state; no quantitative turbine model; current surface host-only; controls sourceFlowVisible, claim1Active
- us-307031-edison-indicator: Source-bounded TypeScript circuit state; no quantitative emission model; current surface host-only; controls plateBiasPolarity
- us-381968-tesla-motor: FrankenSimEngine.stepTeslaMotorFig9; current surface fs-wasm; controls frequency, acHum
- us-608969-parsons-turbine: stepParsonsMarine; current surface fs-wasm; controls routing, reversing, throttle
- us-682690-hewitt-mercury-lamp: Cathode-Spot Electron Emission & Nottingham Negative Resistance Arc Dynamics; current surface host-only; controls mainsVoltageV, ballastResistanceOhms, tubeLengthCm, tubeDiameterMm
- us-2495429-spencer-microwave: stepSpencerMicrowaveSource (source topology + exact c = lambda f reference); current surface host-only; controls rfPowerSetting

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.39` — Complete admitted generic runtime ownership: electricity batch 2

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-2708656-fermi-reactor: stepFermiKinetics (host source reader plus normalized absorber lens; quantitative neutronics refused); current surface fs-wasm; controls rodWithdrawal, moderatorPurity, claim1Active

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.41` — Complete admitted generic runtime ownership: materials batch 1

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- gb-913-watt-separate-condenser: stepWattCondenser; current surface host-only; controls boilerPressurePsi, condenserTempC, cylinderBoreInches, pistonStrokeFeet, strokesPerMinute, hasSeparateCondenser
- gb-931-arkwright-water-frame: stepArkwrightWaterFrame; current surface host-only; controls waterWheelRpm, totalDraftRatio, rollerClampingWeightKg, stapleLengthMm, inputRovingCountNe
- gb-1306-watt-rotary-engine: stepWattRotaryEngine (source-bounded TypeScript closed linkage; fs-mbd holonomic gear constraints unavailable); current surface host-only; controls strokeRateSpm, boilerPressureKpa, gearRatioNpOverNs, flywheelMassKg
- gb-1420-cort-puddling-rolling: stepCortPuddlingRolling; current surface host-only; controls furnaceTemperatureCelsius, initialCarbonPercent, rabbleStirringRpm, puddlingDurationMinutes, rollerPassCount
- us-x1-hopkins-potash: stepHopkinsPotash; current surface host-only; controls roastTempC, roastTimeHours, ashBatchKg, waterTempC
- us-3237-rillieux-evaporator: FrankenSimEngine.stepRillieuxEvaporator; current surface host-only; controls juiceFeedRateKgPerH, initialBrixDeg, targetBrixDeg, numberOfEffects
- us-3633-goodyear-rubber: FrankenSimEngine.stepGoodyearRubber; current surface fs-wasm; controls vulcanTemp, sulfurPct, specimenTempC, appliedTensileStretch
- us-6469-lincoln-buoy: FrankenSimEngine.stepLincolnBuoy; current surface fs-wasm; controls inflationPct, weightTons, shoalDepth

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.43` — Complete admitted generic runtime ownership: materials batch 2

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-78317-nobel-dynamite: FrankenSimEngine.stepNobelDynamite; current surface fs-wasm; controls ngConcentrationPct, capEnergyJoules
- us-105338-hyatt-celluloid: FrankenSimEngine.stepHyattCelluloid; current surface fs-wasm; controls steamTempC, hydraulicPressureMpa
- us-157124-glidden-barbed-wire: FrankenSimEngine.stepGliddenBarbedWire; current surface fs-wasm; controls wireTensionN, twistsPerFoot, animalPushForceN
- us-347140-thomson-welding: FrankenSimEngine.stepThomsonWelding; current surface fs-wasm; controls weldCurrentAmps, clampPressureMpa
- us-400766-hall-aluminium: FrankenSimEngine.stepHallAluminium; current surface host-only; controls currentAmperes, bathTemperatureCelsius, aluminaConcentrationPct
- us-542846-diesel-engine: FrankenSimEngine.stepDieselEngine; current surface host-only; controls compRatio, blastAirPressure, cutoffRatio, engineRpm
- us-727650-linde-air-liquefaction: FrankenSimEngine.stepLindeAirLiquefaction; current surface host-only; controls inletPressureAtm, coolerOutletC
- us-942699-baekeland-bakelite: Phenol-Formaldehyde Thermal Polycondensation Kinetics (Modern Illustrative Scenario); current surface host-only; controls curingTempC, autoclavePressurePsi, catalystPct, curingTimeMin

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.45` — Complete admitted generic runtime ownership: materials batch 3

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-971501-haber-ammonia: Le Chatelier High-Pressure Equilibrium & Catalytic Chemical Kinetics; current surface host-only; controls pressureAtm, temperatureCelsius, feedFlowRateMolesPerSec, catalystActivity
- us-2297691-carlson-electrophotography: Corona Townsend Avalanche Charging & Photoconductive Carrier Drift Discharge; current surface host-only; controls coronaVoltageKv, exposureLuxSec, layerThicknessUm, fuserTemperatureC
- us-3671542-kwolek-kevlar: Source-bound claim reading; quantitative processing and material-performance model withheld; current surface host-only; controls none
- us-6120588-eink: stepEInk; current surface host-only; controls electrodeVoltageVolts, fluidViscosityCp

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.47` — Complete admitted generic runtime ownership: optics batch 1

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-388850-eastman-kodak: FrankenSimEngine.stepEastmanKodak; current surface fs-wasm; controls shutterSpeed, apertureStop, subjectDist
- us-2929922-townes-laser: Source-Bounded TypeScript Topology Step (Quantitative Optical Output Refused); current surface host-only; controls pumpExcitationPct, cavityLengthCm, chamberDiameterCm, endReflectivityPct, modeApertureOpenPct, modulationFieldPct
- us-3353115-maiman-ruby-laser: Xenon Flash Optical Pumping, Metastable Phonon Relaxation & Coherent Resonator Feedback; current surface host-only; controls pumpEnergyJoules, flashDurationMs, rodLengthCm, outputMirrorReflectivity, crystalTemperatureKelvin

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.49` — Complete admitted generic runtime ownership: telecom batch 1

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-1647-morse-telegraph: FrankenSimEngine.stepMorseTelegraph; current surface host-only; controls currentMa, wireTurns, lineVoltageV, lineLengthMiles, wpmSpeed
- us-174465-bell-telephone: FrankenSimEngine.stepBellTelephone; current surface fs-wasm; controls voiceAmplitude, acousticFrequencyHz, airGap, batteryVoltage, liquidConductivity
- us-200521-edison-phonograph: stepEdisonPhonograph (illustrative display motion only; source-bounded TypeScript helper; no FrankenSim/WASM rate step); current surface host-only; controls mandrelRpm, voiceVolumeDb
- us-235199-bell-photophone: FrankenSimEngine.stepBellPhotophone; current surface host-only; controls transmissionDistanceM, voiceSplDb, solarIrradianceWPerM2, collectorDiameterM
- us-586193-marconi-radio: createMarconiTransportUpdater (source-bounded fixed-step causal tape; quantitative RF link budget withheld); current surface host-only; controls sparkVoltage, aerialHeight, sparkGapMm
- us-613809-tesla-teleautomaton: FrankenSimEngine.stepTeslaTeleautomaton; current surface host-only; controls pulseCount, rfFrequency, rudderAngle, propellerThrottlePct
- us-706737-fessenden-wireless: Continuous High-Frequency Alternator & Liquid Barretter RF Demodulator; current surface host-only; controls carrierFrequencyKhz, audioModulationPct, antennaTuningUh, transmissionDistanceKm
- us-879532-de-forest-audion: Richardson-Dushman Thermionic Emission & Child-Langmuir Space-Charge Triode Load Line; current surface host-only; controls plateVoltageV, gridBiasVoltageV, filamentCurrentA, gridSignalAmplitudeMv, loadResistanceKOhms

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

#### `classic-patentscom-2y5.51` — Complete admitted generic runtime ownership: telecom batch 2

**Current state / why:** Bounded catalogue cohort from the runtime inventory. Each entry needs actual owner evidence, not a counter increment.
- us-1773980-farnsworth-tv: createFarnsworthTvTransportUpdater → FrankenSimEngine.stepFarnsworthTv; current surface fs-wasm; controls anodeVoltage, coilCurrent, lightIntensityLux, horizontalFreqKhz, verticalFreqHz, scanLines
- us-2292387-lamarr-frequency-hopping: stepLamarrFrequencyHopping (source-controlled Lamarr record model); current surface host-only; controls recordPosition, commandTone
- us-4063220-metcalfe-ethernet: stepMetcalfeEthernetSi (coaxial wave delay, analog collision voltage, BEB timer); current surface host-only; controls cableLengthMeters, dataRateMbps, stationCount, offeredLoad, packetSizeBytes, triggerCollision

**Goals:** V09, V10, V11, V12, V13, V16. **Files/seams:** `src/physics/coverageManifest.ts`, `src/physics/telemetryData.ts`, `src/physics/catalogKernels.ts`, `src/physics/machineKernels.ts`, `src/components/patents/visuals/`, `~/projects/frankensim/crates/`.

**Implementation:**

1. Recheck each listed ID against current source/provenance and the field-level owner contract; preserve newly completed peer integrations.
2. For admitted rigid/constraint, electromagnetic, thermal, continuum or lattice laws, compose the existing generic FrankenSim owners and expose narrow browser exports where missing. Do not wait for patent-named packages.
3. Bind canonical controls to one stepped result and drain its relevant fields into 2D, 3D, schematic, badge, claim probes and audio. Adjunct demonstration samples cannot promote host physics.
4. Where no quantitative law is supported, retain the source-topology exhibit and document what an explicit modern scenario would require. If stronger required modeling is blocked, leave that scope open with exact source/crate blockers rather than silently declaring it complete.
5. Pin artifact digests, typed refusal, last legal pose, default/modern scenario boundaries and real ownership after load/step. No arithmetic duplication in presentation.

**Target and acceptance:**

- Every listed ID has an implemented admitted generic owner for its supported physical laws or an explicit unresolved blocker; no unsupported numbers are introduced to achieve coverage.
- Direct WASM execution agrees with the admitted host/reference model at default, boundary and nondefault controls within justified tolerances.
- For every listed ID, browser control changes produce matching 2D/3D/schematic/badge outputs and provenance, including WASM-unavailable and refused cases.
- Keep implementation completion distinct from companion acceptance; neither an unavailable external witness nor a changing peer snapshot is evidence of success.

<!-- REALITY_CHECK_REGISTER_END -->

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

### Phase 5 frozen refinement instruction (verbatim, applied in every pass)

```
Check over each bead super carefully-- are you sure it makes sense? Is it optimal? Could we change
anything to make the system work better for users? If so, revise the beads. It's a lot easier and
faster to operate in "plan space" before we start implementing these things! DO NOT OVERSIMPLIFY
THINGS! DO NOT LOSE ANY FEATURES OR FUNCTIONALITY! Also make sure that as part of the beads we
include comprehensive unit tests and e2e test scripts with great, detailed logging so we can be
sure that everything is working perfectly after implementation. Make sure to ONLY use the `br` cli
tool for all changes, and you can and should also use the `bv` tool to help diagnose potential
problems with the beads.
```

### Refinement pass 1

Completeness and current-state pass: every V01–V28 gap has an implementation/acceptance route. Re-scoped newly accepted us-3313014-lemelson-automatic-production, us-4512709-milacron-robot-toolchanger, us-x72-whitney-cotton-gin to verification of landed work, preserving the initial findings as historical evidence. Added an explicit separation of implementation, external blockers and acceptance to all scopes.

### Refinement pass 2

Dependency pass: removed unnecessary infrastructure waits from source-link authoring and completion-accounting implementation. Their final proof still waits for the required owner evidence. Final integrated acceptance now depends on every scoped companion proof plus the existing real-device issue va0. Added numerical validation to field proof and transport compatibility to replay proof. No global archive or device prerequisite blocks independent useful implementation.

### Refinement pass 3

Proof pass: strengthened all numerical tasks with actual step/source/tick/units evidence and both WASM/fallback paths; strengthened archive tasks with full-page accounting rather than substring checks. Added explicit route/performance measurement definitions and source-stability detection during native export. All 60 implementation scopes retain separate acceptance tasks; no assertion of physical correctness rests on a grep, count, screenshot or helper name.

### Refinement pass 4

Operational and scope pass: incorporated the verified br round-trip behavior and explicit JSONL path for bv, avoiding stale SQLite triage. Added a peer-progress check to every task. Clarified that release proof is a local rehearsal and cannot accidentally publish the site. Rechecked archival recovery versus reader availability, source-bounded modeling, no-deletion/OCR rules, hardware blockers and the absence of blanket cloud/GitHub Actions requirements.

### Focused follow-up evidence

The three newly promoted edition suites passed **23 tests / zero failures**. Their later inventory rows all have `ACCEPTED` and zero findings. This validates the decision to re-scope their new restoration issues to verification of landed work; it does not replace the companion's independent full-facsimile review.

Crump's actual deployed `fig-1-source-crop-v1.png` returned **HTTP 200 / image/png**. The failed harness URL is a local newer `source-sheet-1-v1.png` expectation. The reported failure is therefore deployment-expectation drift, not evidence that this particular deployed crop is broken.
