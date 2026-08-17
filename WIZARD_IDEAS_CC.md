# WIZARD_IDEAS_CC.md

Improvement ideas for **Classic Patents**, derived solely from an independent read of
`AGENTS.md`, `README.md`, `COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md`, and a full trace of
`src/`, `scripts/`, `public/`, and `artifacts/`.

**Author:** Claude Code (`cc` pane, `duel_fresh_eyes` batch)
**Method:** static study only — no sources, data, config, or artifacts were modified.
**Caveat on line numbers:** a concurrent NTM swarm was editing the repo during this study
(`src/components/patents/PatentCard.tsx` changed mid-session; the patent set grew from 12 to 18
data files). Line references are accurate as of the read; the *patterns* they illustrate are
stable and were re-verified against the moving tree. Counts below were re-measured last.

---

## Part 1 — 30 Candidate Ideas

### A. Correctness

**1. Make `verify-data.ts` actually fail on the errors it finds.**
`scripts/verify-data.ts:100-102` prints `✓ ... Passed all verification gates` *unconditionally*
at the end of each loop iteration — including for patents that just logged `❌` and incremented
`errorCount`. Every run emits a green checkmark per patent regardless of outcome.

**2. Stop the verifier from crashing on the condition it exists to detect.**
Same log line calls `fs.statSync(localPdfPath)` with no guard. When a PDF is genuinely missing —
the exact failure mode check #4 (`verify-data.ts:49`) is designed to catch — the run throws
`ENOENT`, is swallowed by `main().catch` (`:114`), and aborts before auditing remaining patents.
A single missing PDF blinds the entire sweep.

**3. Repair `download-patents.ts`, which cannot download.**
`scripts/download-patents.ts:34` calls `fetch(patent.originalPdfUrl)`, but every
`originalPdfUrl` is a site-relative path (`/patents/pdfs/us-821393-wright-flyer.pdf`, verified
across all data files). `fetch()` cannot parse a relative URL outside a document context; it
throws, is caught at `:42`, and downgrades to a warning. The script only appears to work because
`:27` short-circuits on already-cached files. Use `googlePatentsUrl`-derived absolute sources.

**4. Remove the silently-wrong `default:` arm in the visual dispatcher.**
`src/components/patents/visuals/index.tsx:95-96` returns `<WrightFlyer3D/>` for any unrecognized
`patentId`. With the swarm adding patents faster than sims, the first un-simulated patent will
render a Wright Flyer on, say, the Kevlar page — presented as that patent's simulation. Render an
honest "simulation in development" panel instead.

**5. Guard the two clipboard calls.**
`PatentHeader.tsx:19` and `ArchaicGlossaryModal.tsx:123` call `navigator.clipboard.writeText(...)`
without `await`, `try/catch`, or a feature check, then set `copied = true` unconditionally. On
insecure origins or unsupported browsers the user sees "Copied!" while nothing was copied, plus an
unhandled promise rejection.

**6. Fix the `stopContinuousTone` race in the sound engine.**
`src/utils/soundEngine.ts:74-89` ramps gain down and nulls the oscillator inside a 100 ms
`setTimeout`. If `playContinuousTone` is called within that window (rapid toggling of the Bell or
Tesla audio switch), the pending timeout stops the *newly started* oscillator, leaving a silent
sim whose UI shows audio as "on".

**7. Release Web Audio nodes.**
The same class never `disconnect()`s `gainNode`, never nulls it, and never closes the
`AudioContext`. Long sessions accumulate orphaned nodes on the audio graph.

**8. Add WebGL capability detection and context-loss handling.**
None of the three Three.js components handle `webglcontextlost` or a failed context acquisition;
visitors without WebGL get a silent empty box where the flagship simulation should be.

**9. Make `searchPatents` honor its own placeholder.**
`EraFilterBar.tsx:38` advertises search "by inventor, title, **claim keyword**, patent number",
but `src/data/patents/index.ts:43-56` never inspects `claims[]`, `originalText`, or
`plainEnglishExplanation`. Claim-keyword searches silently return nothing.

**10. Define `animate-fade-in` or drop it.**
`ArchaicGlossaryModal.tsx:130` applies `animate-fade-in`; `tailwind.config.ts:70-73` defines only
`pulse-slow` and `spin-slow`. The class is inert — the modal hard-cuts in.

### B. Historical & Data Integrity

**11. Disclose transcription coverage instead of implying completeness.**
`originalText` ends in a literal `...` in at least six data files (edison, spencer, farnsworth,
bell, kwolek, noyce) while the UI labels that same string
"Verbatim Historical Specification" (`DualProjectionViewer.tsx:206`),
"USPTO Verified Historical Record" (`:326`), and — on `/about` — "Exact, complete transcription".

**12. Reconcile `stats.totalClaims` with the claims actually decoded.**
Measured across the current 18 data files: Farnsworth declares `totalClaims: 24` with **1** claim
authored; Noyce 16 vs 1; Marconi 16 vs 2; Kwolek 14 vs 1; Lamarr 12 vs 2; Morse 8 vs 3; Spencer 7
vs 1; Bell 5 vs 1. `independentClaims` diverges similarly. This is defensible *editorially*
(original scope vs. decoded subset) but nothing in `src/types/patent.ts:108-113` says so and
nothing in the UI conveys it — `ClaimsDecoder.tsx:21` renders "(N Numbered Claims)" from
`claims.length` while the stats block asserts a different N.

**13. Regenerate the missing OCR artifacts.**
`artifacts/ocr_transcripts/` holds 8 markdown files against 18 patents — Morse, Goodyear, Marconi,
Lamarr and the six newest have none. The directory is a stale snapshot presented as the pipeline's
output.

**14. Rename the "OCR pipeline" to what it is.**
`scripts/ocr-patents.ts` probes for `focr`, prints its version (`:27`), then serializes the
already-hardcoded `patent.originalText` back out to markdown (`:43-73`). It never reads a PDF and
never invokes OCR. Transcripts are derived *from* the data, not the reverse. (HEAD `6d400d6`
already walks back OCR claims in metadata copy; the script name and log banner still assert it.)

**15. Validate `dependsOn` referential integrity.**
`PatentClaim.dependsOn?: number[]` is rendered directly into user-facing text
(`ClaimsDecoder.tsx:46`, `:67`) with no check that the referenced claim numbers exist.

**16. Validate date ordering.**
`verify-data.ts:27-30` checks `YYYY-MM-DD` shape but never that `filingDate <= grantDate`, nor
that grant dates fall in plausible USPTO ranges for the asserted patent number.

**17. Validate `originalPdfUrl` ↔ `id` correspondence.**
Nothing enforces that `us-821393-wright-flyer` points at `us-821393-wright-flyer.pdf`; a
copy-paste slip would silently serve the wrong patent's facsimile under the right title.

**18. Add a `sourceUrl` / retrieval-date provenance field.**
A museum asserting archival fidelity should record where each PDF came from and when, per patent.

**19. Fix the stale timeline range.**
`src/app/timeline/page.tsx:6` and `:20` both say "1876–1972"; the collection now starts at Morse
(1840) and Goodyear (1844).

**20. Correct the patent number typo in the canonical plan.**
`COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md:90` reads `US 8,21,393`. AGENTS.md designates this
document the single source of truth.

### C. Pedagogy

**21. Render the mathematics.**
Formulas are shown to users as raw LaTeX source. `wright-flyer.ts:81` sets
`formula: "L = \\frac{1}{2} \\rho V^2 S C_L(\\alpha)"`, rendered verbatim into a styled `<div>` at
`DualProjectionViewer.tsx:298`. Measured across data files: ~21 `formula:` fields containing
backslash macros and **99** inline `$…$` spans inside `technicalDetails`/`explanation`. Prose in
`TeslaMotor3D.tsx` likewise renders `$\omega = 2\pi f$` literally. The project's stated promise is
to "explain the exact equations… without dumbing down"; the equations are currently unreadable.

**22. Wire callout pins to the specification text.**
The plan (§4.1) promises "Clicking any callout highlights the corresponding reference numeral in
the legal text." `InteractiveDiagramViewer.tsx` only populates a sidebar inspector; the two faces
of the diptych never cross-reference.

**23. Replace the generic schematic with real figures.**
`InteractiveDiagramViewer.tsx:96-103` draws one stylized wireframe — ellipse, cross-lines, rect,
circle — for **every** patent, with authored callout pins (`x`/`y` percentages tuned to real
figures) floating over it. A Kevlar polymer callout lands on the same ellipse as a Wright Flyer
wing callout.

**24. Consume `svgType` or delete it.**
`PatentDrawing.svgType` (`src/types/patent.ts:33-41`) is populated in every data file and read by
no component. The union has 8 members for 18 patents, so late additions borrow unrelated values
to typecheck: Goodyear→`kwolek-kevlar`, Morse→`bell-phone`, Marconi and Lamarr→`spencer-microwave`.

**25. Surface `whyItMattersToday`.**
`PlainEnglishExplanation.whyItMattersToday` is authored for every patent and rendered nowhere in
`DualProjectionViewer.tsx` — the "so what" payload is written and then dropped.

### D. Accessibility

**26. Give mobile users navigation.**
`Header.tsx:30` is `hidden md:flex` and the `_mobileMenuOpen` state at `:9` is dead (underscore-
prefixed to silence Biome). Below 768 px there is no nav at all — no catalog, timeline, or about
link. AGENTS.md requires responsive design down to 320 px.

**27. Label the 74 range inputs.**
`grep` finds **74** `type="range"` inputs and **1** `htmlFor` in the entire `src/` tree, plus
**0** `aria-label` attributes anywhere. Every simulation control is unlabeled to a screen reader.

**28. Make the glossary modal a real dialog.**
`ArchaicGlossaryModal.tsx` has no `role="dialog"`, no `aria-modal`, no focus trap, no Escape
handler, and no backdrop-click close. Keyboard users cannot dismiss it.

**29. Honor `prefers-reduced-motion`.**
Zero occurrences in `src/`. The header compass spins perpetually (`Header.tsx:17`), a `Wind` icon
pulses (`WrightFlyer3D.tsx:459`), and 200-particle vortex systems animate continuously.

### E. Performance & Maintainability

**30. Code-split Three.js and the simulation suite; untrack `tsconfig.tsbuildinfo`.**
`visuals/index.tsx` statically imports all 15 simulations plus `three`, and is pulled in
unconditionally by `DualProjectionViewer`; no `next/dynamic` exists anywhere in `src/`, so every
one of the prerendered patent pages ships the entire suite. Separately, `tsconfig.tsbuildinfo` is
one of the 101 git-tracked files (`incremental: true` in `tsconfig.json:15`), so every
`bun run typecheck` dirties the working tree — actively harmful with concurrent agents, and
visible in commit `6d400d6`, which carries it as a payload change. Also absent: `metadataBase`,
`sitemap.ts`, `robots.ts`.

---

## Part 2 — Winnowing

Ideas were ranked on: **(a)** does it fix something that is *actively misreporting or misleading*,
**(b)** diff size relative to benefit, **(c)** does the benefit compound as the swarm adds patents,
**(d)** does it defend a pillar the project's own doctrine names.

**Cut as low-yield or cosmetic:** #10, #19, #20, #25 (real, but one-line copy/config fixes —
batch them opportunistically).
**Cut as premature:** #7, #8, #18 (correct, but no evidence of user-visible harm yet).
**Cut as too large for the leverage:** #22, #23 (reconstructing 18 authentic figure sets is a
content program, not a change — though #24's dead-field cleanup should ride along with whatever
lands there).
**Cut as subsumed:** #2, #15, #16, #17 all fold into finalist **F1**; #12 folds into **F2**;
#13, #14 fold into **F2**'s honesty framing.
**Strongest near-miss:** #30's code-splitting. It is genuinely valuable and I would take it sixth
— it lost only because shipping a large bundle degrades an experience that *works*, whereas the
five below fix things that are wrong, unusable, or untrue.

---

## Part 3 — The Five Finalists

### F1 — Make the data-integrity gate real

**Problem / evidence.** The project's only automated guardrail does not guard. `verify-data.ts:100-102`
prints `✓ … Passed all verification gates` unconditionally at the end of every loop iteration,
including for a patent that just logged `❌` — so a failing patent reports both failure and success
in the same run. Worse, that same line calls `fs.statSync()` unguarded, so the missing-PDF case
that check #4 exists to catch instead throws `ENOENT`, unwinds to `main().catch` (`:114`), and
aborts the sweep before the remaining patents are audited. Coverage is also thinner than
`COMPREHENSIVE_PLAN` §8.1 claims: `drawings` is never validated, `dependsOn` targets are never
resolved, `filingDate <= grantDate` is never asserted, and `originalPdfUrl` is never checked
against `id`. This is the doctrine's own pillar #4 ("Data Integrity & Determinism… no phantom
claims"), and with a swarm adding patents it is the difference between drift caught in seconds and
drift shipped.

**Minimal implementation direction.** In `scripts/verify-data.ts`: track a per-patent
`patentErrors` counter, move the `✓` log behind `if (patentErrors === 0)`, and reuse the `stats`
value already read at `:53` instead of re-`statSync`-ing. Then add four cheap assertions inside
the existing loop — `dependsOn` resolves to an existing claim number, `filingDate <= grantDate`,
`basename(originalPdfUrl) === id + ".pdf"`, and `drawings.length > 0` with every callout's `x`/`y`
in `[0,100]`. No new dependency; the plan's mention of Zod is not required to get the value.

**Expected benefit.** The gate stops emitting false green, stops going blind on first failure, and
starts catching the four most likely copy-paste faults for a fast-growing hand-authored dataset.
Every subsequent patent addition is verified rather than assumed.

**Risk.** Low, and mostly *desirable*: a correct gate will likely fail on first run against the
current tree (see F2). Treat the first red run as inventory, not regression. Contained to one
script that ships nothing to users.

**Priority.** **P0.** Do this first — it is the instrument every other data fix is measured with.

---

### F2 — Disclose transcription coverage instead of implying completeness

**Problem / evidence.** The site's central claim is archival fidelity, and the UI states it in the
strongest available terms: "Verbatim Historical Specification"
(`DualProjectionViewer.tsx:206`), "USPTO Verified Historical Record" (`:326`), and on `/about`,
"Exact, complete transcription of the historical legal text." What sits behind those labels is an
excerpt. `originalText` terminates in a literal `...` in at least six data files (edison, spencer,
farnsworth, bell, kwolek, noyce). And the claims are a curated subset whose size the data itself
records: Farnsworth `stats.totalClaims: 24` against **1** authored claim; Noyce 16 vs 1; Marconi 16
vs 2; Kwolek 14 vs 1; Lamarr 12 vs 2; Morse 8 vs 3 — while `ClaimsDecoder.tsx:21` simultaneously
announces "(N Numbered Claims)" from `claims.length`. Selecting and excerpting is entirely
legitimate editorial practice; presenting the result as complete is what a museum cannot do. The
embedded full PDF already makes the honest version costless — the primary source is *right there*.

**Minimal implementation direction.** Add two optional fields to `Patent` in
`src/types/patent.ts`: `transcriptCoverage: "complete" | "excerpt"` and
`claimsCoverage: { decoded: number; inOriginal: number }` (the latter is already implicit in
`stats`). Default honestly. Then change three labels: "Verbatim Historical Specification" →
"Historical Specification (Excerpt)" when flagged; add one line under the transcript — *"Excerpt of
the full specification. Complete original: [Full Original PDF]"* linking to the existing
`pdf-facsimile` view mode; and render "Decoding 3 of 18 numbered claims" in the `ClaimsDecoder`
header. Add the corresponding assertion to F1's gate so the flag cannot go stale.

**Expected benefit.** The single highest-value change to project credibility. It converts an
overclaim into a demonstrated editorial method, and it *strengthens* the pitch — "we decoded the 3
claims that decided Wright v. Curtiss, and here is the full original" is a better story than an
unqualified "verbatim". It also removes the trap where a future contributor "fixes" the
`stats`/`claims` mismatch by deleting the real numbers.

**Risk.** Low technically; it is a schema addition plus copy. The real risk is scope creep into
finishing all 18 transcripts — resist that. Ship the disclosure now; complete transcripts on
whatever timeline the content work allows.

**Priority.** **P0.** This is what "museum" obligates, and it gets harder to retrofit with every
patent added.

---

### F3 — Rebuild the Three.js scenes once, not on every slider tick

**Problem / evidence.** All three WebGL components list their control parameters in the scene
effect's dependency array — `WrightFlyer3D.tsx:439-451` (eleven deps, including derived physics
values `leftLift`, `rightLift`, `netYawTorque` that change on *every* input), `TeslaMotor3D.tsx:326`,
`FarnsworthTV3D.tsx:271`. Every slider movement therefore tears down and reconstructs the entire
scene: renderer, camera, lights, all geometries and materials, the 200-particle buffer, and the
event listeners. Two consequences follow. First, a pedagogical one: the orbit state
(`sphericalTheta`, `sphericalPhi`, `sphericalRadius`) is effect-local (`:309-311`), so **the
camera snaps back to its default angle every time the user adjusts a control** — you cannot orbit
to a wingtip and then warp the wing, which is precisely the interaction the flagship simulation
exists to teach. Second, a resource one: cleanup calls only `renderer.dispose()` (`:437`, `:324`,
`:269`); geometries, materials, and the `ArrowHelper`s are never disposed, so GPU-side resources
accumulate across dozens of rebuilds per session.

**Minimal implementation direction.** Standard React-Three lifecycle split, no new dependency.
Move the scene construction into a `useEffect(..., [])` that runs once on mount. Mirror the
control state into a `useRef` object (`paramsRef.current = { wingWarpDeg, rudderDeg, ... }`) updated
by a second, trivial effect; the existing `animate()` loop already runs every frame, so have it
read `paramsRef.current` instead of closure variables — the physics math itself needs no change.
In cleanup, traverse the scene disposing `geometry` and `material` before `renderer.dispose()`.

**Expected benefit.** Camera position survives interaction, which materially changes what the
simulation can teach. Slider drags stop allocating; frame pacing smooths out; GPU memory stops
climbing and WebGL context pressure drops. Same visual output, same physics, dramatically better
instrument.

**Risk.** Medium — this is the most invasive finalist, and the ref-mirror pattern is easy to get
subtly wrong (a parameter left reading its stale closure value silently stops responding). Mitigate
by converting one component first (`TeslaMotor3D` is the smallest at 508 lines), verifying every
control still moves the scene, then applying the identical shape to the other two.

**Priority.** **P1** — highest-value user-facing fix, sequenced after the P0 integrity work
because it touches the most code.

---

### F4 — Render the mathematics

**Problem / evidence.** The project's stated differentiator is rigor: "Never Dumb Down… explain the
exact equations." Those equations currently reach the reader as raw LaTeX source.
`wright-flyer.ts:81` authors `formula: "L = \\frac{1}{2} \\rho V^2 S C_L(\\alpha)"`, and
`DualProjectionViewer.tsx:296-300` drops that string into a centered `<div>` — so the visitor reads
literal backslashes and `\frac` where the lift equation should be. Measured over the data files:
~21 `formula:` fields carry backslash macros and **99** inline `$…$` spans appear inside
`technicalDetails` and `explanation` prose (e.g. `$M_x = \Delta L \cdot b/2$` at
`wright-flyer.ts:49`, `$C_{Di} = C_L^2 / \pi AR$` at `:57`). Simulation prose is affected too —
`TeslaMotor3D.tsx` renders `$\omega = 2\pi f$` verbatim. The most rigorous content on the site is
the least legible part of it.

**Minimal implementation direction.** Add KaTeX (small, no runtime network, CSS-only fonts) and a
`<Math>` component wrapping `katex.renderToString` with `throwOnError: false`. Swap the two block
render sites first — `DualProjectionViewer.tsx:298` and the `scientificPrinciples` grid — which
covers the display equations with a handful of lines. Then add an inline pass that splits prose on
`$…$` and renders the captured spans, covering the 99 inline occurrences without touching the data
files. Data stays exactly as authored; only presentation changes.

**Expected benefit.** Delivers the product's headline promise. The lift equation, induced-drag
relation, `P = V²/R`, and the synchronous-speed formula become readable at a glance, which is the
whole argument for reading this site rather than the Google Patents PDF.

**Risk.** Low–medium. One new dependency (KaTeX ~270 KB with fonts; acceptable, and lighter than
the already-shipped Three.js). Malformed source strings are contained by `throwOnError: false`.
Verify the inline splitter is not confused by a legitimate `$` in currency prose — a quick scan of
the 99 matches during implementation settles it.

**Priority.** **P1.** Visible on the first screen of every patent's Plain English face.

---

### F5 — Establish an accessibility floor

**Problem / evidence.** For a public educational museum, the current baseline is measurably absent
rather than merely imperfect. `grep` over the entire `src/` tree returns **0** `aria-label`
attributes and **1** `htmlFor` against **74** `type="range"` inputs — meaning essentially every
simulation control, the primary interaction the product is built around, is unlabeled to assistive
technology. `ArchaicGlossaryModal.tsx` renders a full-screen overlay with no `role="dialog"`, no
`aria-modal`, no focus trap, no Escape handler, and no backdrop-click dismissal, so a keyboard user
who opens it is stranded. `Header.tsx:30` is `hidden md:flex` with the `_mobileMenuOpen` state at
`:9` left dead, so **below 768 px the site has no navigation whatsoever** — no catalog, timeline,
or about link — against an AGENTS.md requirement of "responsive design down to 320px mobile
screens". And `prefers-reduced-motion` appears zero times despite a perpetually spinning header
compass, pulsing icons, and continuous particle systems.

**Minimal implementation direction.** Four contained changes. (1) Add `aria-label` to each range
input, or wrap the existing visible caption in a `<label htmlFor>` — the label text is already
authored beside every slider, so this is mechanical. (2) In the modal: `role="dialog"`,
`aria-modal="true"`, an Escape `keydown` listener calling the existing `onClose`, and a
backdrop-click handler — the close path already exists, it just needs more entrances. (3) Restore
the mobile menu by wiring the already-declared `_mobileMenuOpen` state to a hamburger button and a
disclosure panel holding the same six links. (4) Add one global
`@media (prefers-reduced-motion: reduce)` block in `globals.css` neutralizing `animate-spin-slow`
/ `animate-pulse`, and gate the particle systems on the same query.

**Expected benefit.** Moves an educational public resource from "unusable with a screen reader and
unnavigable on a phone" to a defensible baseline. Item (3) alone recovers navigation for what is
plausibly the largest share of a museum's casual traffic.

**Risk.** Low. All four are additive and independently shippable; none alters existing visual
design or simulation behavior. Item (1) touches many files but each edit is trivial and
mechanically verifiable.

**Priority.** **P1**, with the mobile-navigation half worth pulling forward to P0 — a whole device
class currently cannot move through the site.

---

## Summary Table

| # | Finalist | Category | Priority | Risk |
|---|---|---|---|---|
| F1 | Make the data-integrity gate real | Verification | **P0** | Low |
| F2 | Disclose transcription coverage | Historical integrity | **P0** | Low |
| F3 | Rebuild Three.js scenes once, not per tick | Performance / pedagogy | P1 | Medium |
| F4 | Render the mathematics | Pedagogy | P1 | Low–medium |
| F5 | Establish an accessibility floor | Accessibility | P1 (nav: P0) | Low |

Suggested order: **F1 → F2 → F5(nav) → F4 → F3 → F5(rest)**. F1 first because it is the
measuring instrument; F2 immediately after because F1's first red run will surface exactly the
coverage gaps F2 is designed to disclose.
