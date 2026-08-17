# WIZARD_SCORES_CC_ON_OTHERS.md

Adversarial cross-scoring of the rival finalist sets by **CC** (Claude Code, `cc` pane,
`duel_fresh_eyes` batch), covering `WIZARD_IDEAS_AGY.md` and `WIZARD_IDEAS_COD.md`.

## Method

Each finalist is scored on ten dimensions, **0–100 each, summing to 0–1000**: usefulness,
practicality, accretiveness, robustness, reliability, performance, intuitiveness, user benefit,
ergonomics, compellingness. Dimensions are read as *"how much does this idea advance that property
of the project"* — not "is the idea itself fast/robust" — otherwise infrastructure ideas score
nonsensically on `performance`.

A secondary **weighted** lens is reported per the skill's `SCORING.md`
(`Useful` ×2, `Pragmatic` ×2, `Accretive` ×1.5, mean of the remaining seven ×1, ÷6.5). The two
lenses disagree in an interesting way; see *Cross-Cutting Analysis*.

Band interpretation: 900+ exceptional · 700–899 strong · 500–699 decent · 300–499 weak · <300 poor.

### Verification pass

I did not score on assertion. Every premise I challenge below was re-checked against the working
tree during scoring. **The tree moved substantially between the ideation and scoring phases** — the
registry grew from 12 to **18 patents**, and `src/components/patents/visuals/three/` grew from
**3 to 18** Three.js components plus a new shared `ThreeStudioScene.ts`; the dispatcher now carries
**38 static imports**. Where this changes a score relative to what the author could have known, I
say so and revise **upward** rather than penalizing them for a moving target.

---

# Section A — AGY (`WIZARD_IDEAS_AGY.md`)

## A1. Zod Runtime Schema Validation — **681 / 1000** (decent-to-strong)

| Dimension | Score | Note |
|---|---:|---|
| Usefulness | 70 | Right target, wrong diagnosis (below) |
| Practicality | 65 | `z.infer` migration touches every data file mid-swarm |
| Accretiveness | 80 | Serves doctrine pillar #4 directly |
| Robustness | 78 | Refinements genuinely beat hand-rolled `if`s |
| Reliability | 55 | `parse()` is fail-fast — reintroduces first-error blindness |
| Performance | 50 | Neutral |
| Intuitiveness | 78 | Schema-as-source-of-truth is very legible |
| User benefit | 55 | Indirect |
| Ergonomics | 75 | Single-source types is a real DX win |
| Compellingness | 75 | Closes a commitment the docs already made |

**Verified.** `zod` is absent from `package.json` — premise holds. AGENTS.md and the plan (§6.2,
§8.1) both promise Zod validation, so this closes a documented, unfulfilled commitment. Legitimate.

**Challenged.** The diagnosis is one level off. The problem is not "TypeScript interfaces don't
validate at runtime" — the data are static literals already typechecked. The problem is that
**there are no semantic assertions and the gate cannot fail**: `verify-data.ts:100-102` prints
`✓ … Passed all verification gates` unconditionally, including for a patent that just logged `❌`.
AGY never identifies this. Swapping in `PatentSchema.parse()` masks it by throwing, but AGY's own
prescription — *"simply call `PatentSchema.parse(patent)`"* — aborts on the first bad record and
reproduces the existing "one failure blinds the sweep" behavior. `safeParse` plus error aggregation
is required and unstated.

**Risk / dependency.** Rewriting `patent.ts` while a swarm actively edits 18 data files is a
merge-conflict generator. Sequence after the swarm quiesces, or scope Zod to the script boundary
and leave the interfaces alone — 80% of the value, 10% of the churn.

---

## A2. Dynamic Import for Three.js Simulations — **789 / 1000** (strong)

| Dimension | Score | Note |
|---|---:|---|
| Usefulness | 86 | Revised up: 38 static imports, 18 WebGL components |
| Practicality | 88 | Mechanical, one file |
| Accretiveness | 85 | Pure win, no API change |
| Robustness | 72 | Needs a loading state; no error boundary proposed |
| Reliability | 65 | Introduces an unhandled chunk-load failure mode |
| Performance | 85 | The point, and now much larger than at write time |
| Intuitiveness | 85 | Standard Next.js idiom |
| User benefit | 75 | Real mobile TTI gain for a public museum |
| Ergonomics | 70 | Slight indirection |
| Compellingness | 78 | Obvious, uncontroversial,三-way convergence |

**Verified and strengthened.** No `next/dynamic` anywhere in `src/`. At AGY's write time this
covered 3 WebGL components; it now covers **18** (~250 KB of TSX before `three` itself), all
statically pulled through `visuals/index.tsx`. This is the idea whose value grew most during the
session, and AGY could not have known that. Revised up accordingly.

**Challenged.** The stated mechanism is factually wrong. AGY argues the payoff is that sims are
*"only downloaded and parsed when the user explicitly clicks the 'Interactive Simulator' mode."*
They are not: `DualProjectionViewer.tsx:221` mounts `PatentVisualDispatcher` inside the **default**
`plain-english` view (`:27` defaults `viewMode` to `"plain-english"`), so the selected sim is
on-screen at first paint. The chunk is requested immediately after hydration. The real win is
narrower but still substantial — `three` leaves the initial parse/eval path, and the **other 29**
unselected sims never load at all. The benefit is real; the reasoning needs correcting before
anyone sizes the work off it.

**Risk / dependency.** None blocking. Add an error boundary alongside the loading skeleton.

---

## A3. Bi-Directional Scroll Sync in Split View — **655 / 1000** (decent; highest ceiling, weakest spec)

| Dimension | Score | Note |
|---|---:|---|
| Usefulness | 55 | Goal ~95; specification ~20 (below) |
| Practicality | 30 | Two undeclared prerequisites |
| Accretiveness | 90 | *Is* the Dual-Projection Parity doctrine |
| Robustness | 45 | Asymmetric scroll containers unacknowledged |
| Reliability | 45 | Scroll-fighting is a classic intermittent-feel bug |
| Performance | 55 | Smooth-scroll contends with a live WebGL loop |
| Intuitiveness | 85 | Magic when it works |
| User benefit | 80 | Very high if delivered |
| Ergonomics | 82 | Kills the core "hunt for the passage" friction |
| Compellingness | 88 | Best *idea* in either rival file |

**This is the most exciting idea anyone proposed and the least buildable as written.** I want to be
explicit that the ceiling here is higher than its score: anchoring modern explanation to historical
prose in real time is precisely the product's reason to exist.

**Challenged — two verified, undeclared prerequisites.** AGY prescribes *"wrap logical blocks
(claims, paragraphs) in both faces with `id`s."* Neither face has such blocks.

1. **Face 1 has nothing to sync.** Split view's left column renders exactly `overview`,
   `coreMechanism`, and the sim (`DualProjectionViewer.tsx:191`, `:195`, `:198`). No claims, no
   mechanical breakdown, no scientific principles — those live only in the `plain-english` view.
   Two paragraphs cannot be synchronized against a full specification.
2. **Face 2 has no addressable nodes.** The right column renders `patent.originalText` — a single
   template-literal string — as one `whitespace-pre-wrap` block inside a `max-h-[700px]` scroller
   (`:209`). There are no per-paragraph elements to carry an `id`.

So the work is: restructure split view to render the decoded content, *and* parse transcripts into
anchored blocks — which requires per-claim/per-paragraph source locators in the data, i.e. COD's
finalist 1. AGY rates this "Medium risk / High priority" while omitting both. There is also a
structural asymmetry AGY misses: Face 1 scrolls with the page, Face 2 scrolls inside a fixed-height
container, so "sync the scroll" is not one mechanism but two.

**Verdict.** Keep the idea, reject the estimate. It is a P2 that depends on COD-1 and a split-view
content refactor — not the "High" it claims.

---

## A4. CI/CD Verification Workflow — **773 / 1000** (strong)

| Dimension | Score | Note |
|---|---:|---|
| Usefulness | 85 | Honor-system gates + 3 concurrent agents |
| Practicality | 95 | Highest of any finalist in either file — one YAML |
| Accretiveness | 88 | Pure addition, zero coupling |
| Robustness | 60 | Would currently enforce a tautology (below) |
| Reliability | 85 | Deterministic server-side enforcement |
| Performance | 55 | Neutral |
| Intuitiveness | 85 | Standard and legible |
| User benefit | 55 | Indirect |
| Ergonomics | 85 | Large multi-agent win |
| Compellingness | 80 | Expected on any public repo |

**Verified.** No `.github/` directory exists. AGENTS.md "Landing the Plane" is entirely manual, and
this session alone had three agents committing to `main`. The premise is exactly right, and this is
the single most *shippable* idea in either rival file.

**Challenged — hard dependency AGY does not state.** Running `bun run pipeline:verify` in CI is
only as strong as that script, and that script **currently cannot fail on the conditions it
checks**: it prints `✓` unconditionally per patent (`verify-data.ts:100-102`) and throws `ENOENT`
rather than reporting when a PDF is missing (unguarded `statSync` on the same line). Shipping CI
first produces a permanently green badge that certifies nothing — actively worse than no CI,
because it manufactures false assurance. **Fix the gate, then wire the CI.** AGY's own A1 partly
addresses this; the two must be ordered, and AGY presents them as independent.

---

## A5. URL State Synchronization — **699 / 1000** (decent, top of band)

| Dimension | Score | Note |
|---|---:|---|
| Usefulness | 76 | Citability is core to a museum |
| Practicality | 55 | Undeclared static-generation hazard |
| Accretiveness | 78 | Builds directly on existing state |
| Robustness | 60 | URL↔state loops; AGY flags this |
| Reliability | 65 | `router.replace` noted — correct |
| Performance | 45 | Could *regress* prerendering (below) |
| Intuitiveness | 82 | Universally understood |
| User benefit | 80 | "Open this link, see this exact stall" is a lesson plan |
| Ergonomics | 78 | Strong for educators |
| Compellingness | 80 | Turns a static site into a citable instrument |

**Verified.** All view and simulation state is local React state; nothing is addressable. The
product already ships BibTeX and APA citation export (`ArchaicGlossaryModal.tsx:108-119`) — so it
invites scholarly citation of a page while making the *view* uncitable. AGY spotted a real seam,
and the sim-parameter half genuinely differentiates.

**Challenged.** `useSearchParams` in the App Router forces the consuming subtree into a Suspense
boundary and, handled carelessly, opts routes out of static generation. All 18 patent routes are
currently prerendered via `generateStaticParams`. Done wrong, this trades a large, certain
performance loss for a moderate UX gain — which is why `performance` scores 45. Mitigation is known
(isolate the hook in a small client component under `<Suspense>`), but AGY does not mention the
hazard, and it is the main thing that could sink the implementation.

---

## AGY summary

| Finalist | Raw /1000 | Weighted /100 | Verdict |
|---|---:|---:|---|
| A2 Dynamic import | **789** | 83.5 | **STRONG** — do it |
| A4 CI workflow | 773 | **86.8** | **STRONG** — do it, but after the gate is fixable |
| A5 URL state | 699 | 76.3 | DECENT — scope carefully |
| A1 Zod validation | 681 | 71.5 | DECENT — right pillar, off-by-one diagnosis |
| A3 Scroll sync | 655 | 64.2 | **SPLIT** — best idea, unbuildable as written |
| **Average** | **719** | 76.5 | |

**Character of the set.** AGY optimizes for shippability and wins on it: A2 and A4 are the two
highest-*weighted* ideas across both rivals, because Practicality counts double and AGY's finalists
are genuinely small. The set is well-chosen and conventional.

**Evidence discipline is the weak spot.** Three of five finalists rest on a premise that does not
survive checking (A2's trigger mechanism, A3's content structure, A4's dependency on a working
gate), and the un-promoted 30-list contains two clear misfires: **#26** proposes preloading
*Playfair Display*, which is **not in the codebase** (`layout.tsx` loads EB Garamond, Inter,
JetBrains Mono — Playfair appears only in the planning docs) and which `next/font/google` would
already preload anyway; **#25** proposes `next/image` optimization for "static SVG drawing assets"
that do not exist (all diagram SVG is inline JSX, and `next/image` does not optimize SVG). These
read as pattern-matched from the docs rather than the tree.

**Notable omission.** AGY generated four accessibility candidates (#7, #20, #22, #23) and the
WebGL-disposal candidate (#24) — and promoted **none** of them. Its own 30-list contained the
strongest idea in the duel (see COD-5) and it was left at #24.

---

# Section B — COD (`WIZARD_IDEAS_COD.md`)

## B1. Evidence-Backed Archival Truth Chain — **748 / 1000** (strong)

| Dimension | Score | Note |
|---|---:|---|
| Usefulness | 92 | Targets the museum's single most important property |
| Practicality | 42 | A multi-week editorial + data program, not a change |
| Accretiveness | 95 | The foundation everything else needs |
| Robustness | 90 | SHA-256 + page counts + pinned tool version |
| Reliability | 88 | Reproducible retrieval is the definition of archival |
| Performance | 55 | Build-time cost; sensibly deferred to a maintainer flow |
| Intuitiveness | 78 | A manifest with review status is legible |
| User benefit | 62 | A hash in a JSON file helps no visitor (below) |
| Ergonomics | 58 | Adds per-patent ceremony against a fast-adding swarm |
| Compellingness | 88 | Best framing in either file |

**Verified — all of it.** `ocr-patents.ts` does detect `focr`, print its version, and then write
the already-authored `patent.originalText` to markdown without ever reading a PDF. The downloader
does consume a browser-relative `originalPdfUrl` while writing to `artifacts/raw_pdfs`, and the
verifier reads from `public/patents/pdfs` — three paths, no single declared archive. The transcript
gap COD cites has since **widened**: 8 OCR artifacts now stand against **18** patents. COD's
diagnosis is the most accurate single paragraph in either rival file.

**Challenged — the payoff is deferred past the finalist boundary.** This builds the truth chain but
never shows it. COD's own idea **#7** (a per-header provenance legend distinguishing original
evidence / normalized transcription / editorial analysis) is what converts the work into visitor
value, and it is left in the deferred pile. Meanwhile the live site continues to label a
`...`-truncated excerpt "Verbatim Historical Specification" and "Exact, complete transcription."
The honest disclosure is a copy-and-flag change available *today*; COD gates it behind the
expensive complete fix. That inversion costs `user benefit` and `ergonomics`.

**Risk / dependency.** B1 → B2 → B3 is a genuine serial chain and COD says so. The cost is that
nothing user-visible ships for a long time. Extract the disclosure sliver first.

---

## B2. Enforced Verification Ladder + CI — **748 / 1000** (strong)

| Dimension | Score | Note |
|---|---:|---|
| Usefulness | 88 | Names the claims-vs-`stats` mismatch specifically |
| Practicality | 55 | Four initiatives bundled; no test runner exists |
| Accretiveness | 92 | Protects every future patent |
| Robustness | 90 | Most robustness-generating idea in either file |
| Reliability | 88 | "Semantic contracts over pixel snapshots" — experienced call |
| Performance | 58 | CI time; neutral |
| Intuitiveness | 78 | The "ladder" metaphor is clear |
| User benefit | 55 | Indirect |
| Ergonomics | 72 | Multi-agent win, heavy scaffolding |
| Compellingness | 72 | Correct but the least surprising idea available |

**Verified.** No `vitest`/`jest`/`playwright` in `package.json`; no test files anywhere. COD's
observation that records *"render selected claims while advertising a larger total"* is
independently confirmed and worse than stated: I measured it across the registry — Farnsworth
declares `totalClaims: 24` against 1 authored claim, Noyce 16 vs 1, Marconi 16 vs 2, Kwolek 14 vs 1,
Lamarr 12 vs 2, Morse 8 vs 3. COD is the only rival to name this class of defect.

**Credit where due.** *"Prefer semantic contract tests and deterministic telemetry over brittle
pixel snapshots"* is the single best line of engineering judgment in either rival document — and it
is a direct, unstated correction of AGY's 30-list #12 (visual regression testing), which proposes
exactly the brittle approach across six highly dynamic WebGL view states.

**Challenged.** This is four ideas wearing one coat: runtime schema, domain unit tests, Playwright
E2E, and CI. The schema-and-CI half is roughly a day; the Playwright half — every generated route ×
six view modes, with dialogs, keyboard paths and non-WebGL fallbacks, over 18 routes and growing —
is a sprint with ongoing maintenance. Bundling them produces a finalist nobody can start on Monday.
Split it: ship gate-fix + schema + CI first, E2E second.

---

## B3. Faithful, Source-Linked Diagrams — **776 / 1000** (strong)

| Dimension | Score | Note |
|---|---:|---|
| Usefulness | 90 | Fixes the worst pedagogical defect |
| Practicality | 45 | Content-heavy; correctly scoped to a pilot |
| Accretiveness | 90 | Restores the promised diptych chain |
| Robustness | 78 | Relationship-table fallback; raster when vector isn't warranted |
| Reliability | 70 | Depends on editorial accuracy; checklist mitigates |
| Performance | 55 | Raster figure weight unaddressed |
| Intuitiveness | 90 | figure → numeral → spec → mechanism is how engineers read patents |
| User benefit | 88 | This is what visitors come for |
| Ergonomics | 85 | Removes the cross-referencing burden the plan §1.3 names |
| Compellingness | 85 | High, and honest |

**Verified.** `InteractiveDiagramViewer.tsx:96-103` draws one hard-coded ellipse + cross-lines +
rect + circle for **every** patent, with authored callout pins positioned over it. `svgType` is
populated in all 18 data files and read by nothing.

**COD found something I missed and AGY didn't mention.** At `:156-162` the viewer renders a block
captioned **"USPTO Specification Reference"** whose content is *synthesized from the callout label
by string interpolation* — `"Ref. Numeral {element} marks the {label.toLowerCase()} illustrated in
{figureNumber}."` That is a fabricated citation presented in the visual language of a source quote.
For a project whose entire claim is archival fidelity, that is a category more serious than a
placeholder drawing, and COD is the only participant who caught it. Its instruction — *"never
present an unsupported generic drawing as a reconstruction"* — is the correct standard.

**Challenged.** Practicality is the binding constraint: accurate figure alignment for 18 growing
patents is editorial work no refactor shortens. COD handles this correctly by scoping to Wright and
Noyce first and permitting raster overlays. Page weight of raster figures goes unmentioned.

---

## B4. Accessible Progressive Enhancement — **816 / 1000** (strong)

| Dimension | Score | Note |
|---|---:|---|
| Usefulness | 88 | Verified severe across every axis |
| Practicality | 55 | Primitives are cheap; the per-visual content obligation is not |
| Accretiveness | 88 | Text fallbacks double as test surface |
| Robustness | 88 | Non-WebGL / low-power / no-pointer paths |
| Reliability | 82 | Keyboard-first E2E to protect it |
| Performance | 70 | Text fallbacks help low-power devices |
| Intuitiveness | 82 | Standard semantics, predictable |
| User benefit | 90 | An entire device class currently has no navigation |
| Ergonomics | 88 | Skip links, pin keyboard nav, Escape contract |
| Compellingness | 85 | Near-obligatory for a public educational archive |

**Verified.** Zero `aria-label` attributes and one `htmlFor` across the entire `src/` tree, against
74+ `type="range"` controls. No `role="dialog"`, `aria-modal`, focus trap, Escape handler, or focus
restoration in the glossary modal. `Header.tsx` hides nav below `md` while retaining dead
`_mobileMenuOpen` state — **below 768 px the site has no navigation at all**. Zero occurrences of
`prefers-reduced-motion` against a perpetually spinning compass and now 18 particle-animated WebGL
scenes.

**Where COD beats my own version of this idea.** I proposed ARIA labels, dialog semantics, mobile
nav and reduced motion — the compliance floor. COD demands that *every visual ship a keyboard-
operable relationship table and a "mechanism in words" narrative, with controls that update text
and telemetry even if WebGL fails.* That is progressive enhancement properly construed, and it
converts an accessibility cost into a pedagogical asset: a text description of *why* the rudder
counteracts adverse yaw serves the sighted reader on a phone, the screen-reader user, and the
test harness identically. COD's note that the fallbacks "improve testability for everyone" is the
kind of second-order reasoning that distinguishes this set.

**Challenged.** Practicality is dragged down by scope, not by the primitives. The shared primitives
land in a day or two; "relationship table + mechanism narrative for every visual" is a writing
project across 30 simulations that will lag indefinitely. Split it, and pull the **mobile
navigation** sliver out to P0 on its own — it is an hour of work standing between a whole device
class and the site.

---

## B5. On-Demand, Stable WebGL Simulator Runtime — **831 / 1000** (strong; top of the duel)

| Dimension | Score | Note |
|---|---:|---|
| Usefulness | 92 | Revised up hard: 3 → 18 WebGL components since write time |
| Practicality | 70 | Revised up: the insertion point now exists |
| Accretiveness | 90 | Manifest also kills the silently-wrong dispatcher fallback |
| Robustness | 85 | Disposer + visibility pause + text/vector fallback |
| Reliability | 82 | Fixes the leak; stale-state risk flagged honestly |
| Performance | 94 | Only idea addressing bundle *and* frame time *and* GPU memory |
| Intuitiveness | 80 | Manifest beats a 30-arm switch |
| User benefit | 78 | Smoother controls; camera stops resetting mid-interaction |
| Ergonomics | 85 | One lifecycle helper instead of 18 hand-rolled effects |
| Compellingness | 75 | Least novel of COD's five, most consequential |

**Verified, and materially strengthened by events.** Everything COD cites holds, and the ground
shifted in its favor during the session:

- The dispatcher now carries **38 static imports** covering **18** Three.js components (~250 KB of
  TSX) plus 12 2D sims. COD wrote this when there were three.
- The rebuild-per-parameter anti-pattern **replicated into every new component** —
  `EdisonBulb3D.tsx:206` re-runs on four control params, `NoycePlanarIC3D.tsx:200` on four. What was
  a defect in three files is now a defect in eighteen.
- A shared `ThreeStudioScene.ts` has appeared and is adopted by **all 18** components. Its
  `dispose()` calls `controls.dispose()` and `renderer.dispose()` — and **zero files in the entire
  tree call `geometry.dispose()`**. So COD's "shared disposer for geometries, materials, textures"
  is still entirely unaddressed, but now has exactly **one** insertion point with 18× leverage.
  (Its DPR cap is already implemented there; small deduction for that half being done.)

**Why this is the strongest rival idea.** It is the only proposal in either file that resolves four
distinct defect classes with one architectural move: a *correctness* bug (the `default:` arm at
`visuals/index.tsx` that silently renders the wrong patent's simulation — a typed manifest with an
explicit fallback eliminates it), a *resource* leak (undisposed GPU geometry across 18 scenes), a
*UX* defect (scene teardown discards effect-local camera orbit state, so the camera snaps home on
every slider adjustment — you cannot orbit to a wingtip and then warp the wing), and the *bundle*
problem AGY-2 addresses alone. It subsumes AGY-2 entirely while adding the runtime half AGY omits.
It carries its own migration plan ("migrate one flagship first, add teardown and control-to-
telemetry tests"), it demands before/after measurement, and its value scales with the project's
actual growth vector — which, measurably, is more simulations.

**Challenged.** The ref-migration across 18 components is where the risk concentrates, and COD's
stale-state warning is the right one: a parameter left reading its old closure value silently stops
responding, with no error. The mitigation is mechanical — one component first, then a control-to-
telemetry assertion per parameter — but at 18 components this is now a multi-day job, not the
tidy refactor it was when COD wrote it.

---

## COD summary

| Finalist | Raw /1000 | Weighted /100 | Verdict |
|---|---:|---:|---|
| B5 WebGL runtime | **831** | 80.1 | **STRONG** — strongest idea in the duel |
| B4 Accessible enhancement | 816 | 77.2 | **STRONG** — extract mobile nav to P0 |
| B3 Source-linked diagrams | 776 | 74.4 | **STRONG** — pilot-scoped, correct |
| B1 Archival truth chain | 748 | 74.6 | **STRONG** — extract the disclosure sliver first |
| B2 Verification ladder | 748 | 76.5 | **STRONG** — split schema+CI from E2E |
| **Average** | **784** | 76.6 | |

**Character of the set.** COD optimizes for *correctness of diagnosis* and wins on it. Line
references are accurate, claims are hedged appropriately (*"potentially expensive lifecycle"*),
risks are rated honestly (three of five are Medium or higher — no self-flattering "Low"), and every
heavy finalist carries an explicit pilot scope. It also opens with an evidence-boundary disclaimer
acknowledging the shared worktree may have moved — the only rival to do so, and correct.

**The systematic weakness is bundling.** Each finalist is really three to six ideas. B2 is four
initiatives; B5 is five; B4 is a primitives package plus an open-ended content obligation. This
inflates apparent scope and depresses Practicality across the board (42–70, versus AGY's 55–95).
Nothing here can be started and finished in one sitting, which is a real cost in a swarm where
peers are committing hourly.

**Methodological note.** COD's own winnowing formula collapses the seven non-privileged criteria
into a single averaged 1× term (`÷6.5`). The skill's rubric weights each of the seven at 1×
(`÷12.5`). COD's simplification under-weights those seven by roughly 7× and therefore
systematically favors ideas strong on Usefulness/Pragmatism/Accretiveness — which is precisely the
profile of its own finalists. COD states the formula openly, so this is not concealed, but it is
self-flattering and it is why its internal ranking (B1 first) diverges from mine (B5 first).

---

# Cross-Cutting Analysis

## Duplicate and convergent ideas

| Idea | AGY | COD | CC | Convergence |
|---|---|---|---|---|
| Dynamic-import the simulations | **A2** (finalist) | B5 (component) | near-miss #30 | **3-way — strong validation** |
| Three.js scene-once + GPU disposal | 30-list #24 | **B5** (finalist) | **F3** (finalist) | **3-way — strong validation** |
| CI enforcing the quality gates | **A4** (finalist) | B2 (component) | — | 2-way |
| Runtime/relational data validation | **A1** (finalist) | B2 (component) | **F1** (finalist) | **3-way — strong validation** |
| Accessibility floor | 30-list #7/#20/#22/#23 | **B4** (finalist) | **F5** (finalist) | 2-way promoted, 3-way generated |
| Real diagrams / consume `svgType` | — | **B3** (finalist) | 30-list #23/#24 | 2-way |
| Split-view synchronization | **A3** (finalist) | 30-list #11, B3 (anchors) | — | 2-way |
| `dependsOn` referential integrity | 30-list #6 | B2 (component) | 30-list #15 | 3-way, none promoted alone |
| Provenance / OCR honesty | — | **B1** (finalist) | **F2** (finalist) | 2-way, **complementary not duplicate** |

The B1/F2 pair deserves a note: COD proposes *building* the truth chain (manifest, hashes, real
OCR, locators); I proposed *disclosing* the gap (coverage flags, honest labels, "decoding 3 of 18
claims"). These are the expensive-complete and the cheap-honest halves of one problem. Neither is
redundant — the correct sequence is disclose now, build next, and COD's decision to defer its own
provenance legend (#7) out of the finalists is the one place its dependency ordering misfires.

## Unsupported premises (consolidated)

**AGY** — A2's "downloaded only when the user clicks Interactive Simulator" (the default view mounts
it); A3's "wrap claims and paragraphs in both faces" (neither face renders such blocks); A4's
implicit assumption that `pipeline:verify` can fail (it cannot); 30-list #26 (Playfair Display is
not in the codebase, and `next/font` already preloads); 30-list #25 (`next/image` for SVG assets
that do not exist and a format it does not optimize).

**COD** — none material. Every line reference I checked resolved correctly. Its one structural
misstep is a sequencing judgment (deferring the visitor-facing provenance legend), not a false
premise. Its idea #22 (nondeterminism in simulations) is *more* supported than it claims:
`Math.random()` appears across eight simulation and audio files.

## Risks and dependencies neither rival stated

1. **AGY-4 CI depends on the gate being fixable.** Wiring CI to a script that always prints `✓`
   manufactures false assurance. Order: fix `verify-data.ts:100-102` → then CI.
2. **AGY-3 depends on COD-1 plus a split-view refactor.** Anchoring transcripts requires per-block
   source locators that only the manifest work produces.
3. **AGY-5 risks the static build.** `useSearchParams` without a Suspense boundary can de-optimize
   18 prerendered routes.
4. **AGY-1 and B5 both risk a merge storm.** Rewriting `patent.ts` types or 18 WebGL components
   while peer agents commit hourly needs coordination — `file_reservation_paths` per AGENTS.md.
5. **B5's leverage point is new and undefended.** `ThreeStudioScene.ts` was adopted by all 18
   components within about ten minutes. Whatever lands in its `dispose()` propagates instantly —
   which is the opportunity and the blast radius.

## Blind spot: what neither rival caught

**The mathematics is displayed as raw LaTeX.** Roughly 21 `formula:` fields carry backslash macros
and **99** inline `$…$` spans sit inside `technicalDetails` and `explanation` prose, all rendered
verbatim into styled divs — the visitor reads `L = \frac{1}{2} \rho V^2 S C_L(\alpha)`. This is on
the **default** view of every patent page, and it directly negates the project's stated
differentiator ("explain the exact equations… without dumbing down"). AGY and COD both missed it
entirely; it was my F4.

**Neither identified the specific gate bug.** COD came closest ("no relationship checks") but
neither noticed that `verify-data.ts` prints success unconditionally and crashes rather than
reports on the exact condition it exists to detect. It is a two-line fix guarding every other data
idea in this duel, and it went unnamed by both.

## Single strongest rival idea

> **COD B5 — On-demand, stable WebGL simulator runtime (831/1000).**

It is the only rival proposal that resolves four defect classes — a correctness bug (the silently
wrong dispatcher fallback), a resource leak (18 scenes, zero `geometry.dispose()`), a UX defect (the
camera resetting on every control change), and the bundle problem — through a single architectural
move, while shipping its own migration plan and measurement criteria. It fully subsumes AGY's A2
and adds the runtime half A2 omits. Decisively, its value is the only one in the duel that **grew
measurably during the session**: written against 3 WebGL components, it now governs 18, with a
freshly adopted shared helper giving it one insertion point and 18× leverage. That it targets the
project's actual growth vector, rather than a static snapshot, is what puts it first.

**Runner-up, by a hair: B4.** Its mobile-navigation sliver deserves immediate P0 extraction — an
hour of work currently standing between an entire device class and any navigation at all.

---

## Score matrix

| Idea | Origin | Raw /1000 | Weighted /100 | Band | Verdict |
|---|---|---:|---:|---|---|
| B5 WebGL runtime | COD | **831** | 80.1 | Strong | **Strongest rival idea** |
| B4 Accessible enhancement | COD | 816 | 77.2 | Strong | Split; nav → P0 |
| A2 Dynamic import | AGY | 789 | 83.5 | Strong | Subsumed by B5 — merge |
| B3 Source-linked diagrams | COD | 776 | 74.4 | Strong | Pilot as scoped |
| A4 CI workflow | AGY | 773 | **86.8** | Strong | Sequence after gate fix |
| B1 Archival truth chain | COD | 748 | 74.6 | Strong | Extract disclosure first |
| B2 Verification ladder | COD | 748 | 76.5 | Strong | Split schema+CI from E2E |
| A5 URL state | AGY | 699 | 76.3 | Decent | Watch static generation |
| A1 Zod validation | AGY | 681 | 71.5 | Decent | Use `safeParse` + aggregation |
| A3 Scroll sync | AGY | 655 | 64.2 | Split | Best idea, needs prerequisites |

**Set averages — AGY 719 · COD 784.**

## Calibration self-check

Per `SCORING.md`'s bias warnings: my scores span 655–831 with no clustering at either rail, so this
is neither a love-fest nor tribal deflation. Every score below 700 is attached to a *specifically
verified* premise failure rather than a stylistic objection, and I revised two rival ideas
**upward** (A2, B5) on evidence that emerged after they were written. Both rivals score above my own
set's practicality on shippability — AGY decisively so, taking the top two weighted slots.

The two lenses genuinely disagree and the disagreement is the finding: **COD wins on raw merit
(784 vs 719) because its diagnoses are more accurate; AGY wins on the weighted lens at the top
(A4 86.8, A2 83.5) because its ideas can actually ship this week.** The synthesis is not to pick a
winner but to take AGY's sequencing discipline and apply it to COD's diagnoses — split every COD
finalist into its shippable first slice, and order A4 behind the two-line gate fix that neither
rival identified.
