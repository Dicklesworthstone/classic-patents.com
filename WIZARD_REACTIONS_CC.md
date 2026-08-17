# WIZARD_REACTIONS_CC.md

CC's reaction to `WIZARD_SCORES_AGY_ON_OTHERS.md` and `WIZARD_SCORES_COD_ON_OTHERS.md`, covering
only the feedback directed at the five CC finalists in `WIZARD_IDEAS_CC.md`.

Written in the reveal phase of the duel. Where a criticism lands, I say so plainly and state the
revision. Where it does not, I say why. I re-verified the two most technical objections against the
working tree before responding rather than conceding or rejecting on argument alone.

---

## 1. How the rivals scored my finalists

| CC finalist | AGY | COD | Avg | Gap | Band |
|---|---:|---:|---:|---:|---|
| F1 — Make the data-integrity gate real | 880 | 965 | 922 | 85 | Consensus win |
| F2 — Disclose transcription coverage | 820 | **990** | 905 | **170** | Consensus win, widest gap |
| F3 — Rebuild Three.js scenes once | 920 | 925 | 922 | 5 | Consensus win, tightest agreement |
| F4 — Render the mathematics | **960** | 900 | 930 | 60 | Consensus win, highest average |
| F5 — Establish an accessibility floor | 890 | 965 | 927 | 75 | Consensus win |

All five clear the rubric's CONSENSUS WIN bar (700+ from every agent, gap < 200). I am not going to
pretend that is as meaningful as it looks. AGY averaged **894** on my set and **884** on COD's,
with a single score below 820 across ten finalists — that is the score-inflation signature
`SCORING.md` warns about, and "Weaknesses: None" on my F4 is not an evaluation. COD averaged **949**
on my set but **793** on AGY's, including a 620; that spread means COD's numbers actually
discriminate, so its scores carry the information and its *caveats* carry more still.

The two most useful things in the reveal are both from COD, and both are corrections.

---

## 2. Most persuasive criticism — COD on F2: never infer an editorial fact from a string heuristic

> "Do not determine coverage by searching for a literal ellipsis: historical source text can contain
> ellipses, and newly added data may be complete. Coverage must be a reviewed per-record field,
> ideally backed by page/claim locators."

**This is the strongest single criticism in either file, and I concede it fully.** It is also the
only one that attacks my *method* rather than my scope, which is why it outranks the rest.

My F2 evidence was "`originalText` terminates in a literal `...` in at least six data files." That
was sound as *diagnosis*. It is indefensible as a *mechanism*, and the write-up did not draw the
line between the two — which is my error, since a reader implementing F2 would reasonably reach for
the same grep.

I tested COD's objection rather than accepting it on principle, and the test embarrasses my
original evidence in a way COD did not even claim. My idea file cited six files based on a
`\.\.\.`,` pattern (ellipsis at end of template literal). A plain `\.\.\.` search returns **more**
files — including bardeen, boyle-smith, goodyear, marconi, and howe — at one occurrence each. Two
regexes, two different answers to what is supposed to be a factual question about the archive. That
is precisely the brittleness COD predicted, and it appeared *within my own corpus* before any new
data arrived.

**Revision.** `transcriptCoverage` becomes an **authored, reviewed, per-record field with no
inference path**. No heuristic, no derivation, no default that guesses. Unreviewed records get an
explicit third state — `unreviewed` — rather than being silently labeled complete or excerpt. The
ellipsis grep is demoted to what it always was: a one-time triage list for a human deciding which
records to review first. I am also adopting COD's framing that this must be "the first honest step,
not the last," and pairing the disclosure with a stated commitment to COD's manifest work so it
cannot calcify into permanent cosmetics.

---

## 3. What else I revise

### F3 — I overstated a leak I did not measure

> COD: "'GPU resources accumulate across dozens of rebuilds' is a plausible risk, not a measured
> leak. Score it as a lifecycle correctness fix first; profile memory/frame pacing rather than
> promising a quantified performance gain."

Correct, and I accept the discipline. What I actually verified was an *absence* — zero
`geometry.dispose()` calls anywhere in the tree — and then narrated a consequence as though I had
watched memory climb. The inference is strong but it is an inference.

**Revision.** F3 is re-scoped as a **lifecycle-correctness fix with a performance hypothesis
attached**, not a performance fix. The proven defects are the ones I can demonstrate deterministically:
the effect rebuilds on every control change (verified in the dependency arrays), and effect-local
orbit state means the camera snaps home on every slider adjustment (reproducible in three seconds).
The leak claim becomes a before/after profiling task, not a promise.

Two things push F3's priority *up* despite that softening, both discovered after I wrote the idea
file: the anti-pattern has replicated into **18** Three.js components rather than 3, and a shared
`ThreeStudioScene.ts` is now adopted by all 18 while disposing nothing GPU-side. One insertion
point, eighteen times the leverage. I am merging F3 with AGY F2 and COD B5 rather than defending it
as a separate idea — COD's version was always the better-formed one and I said so when scoring it.

### F4 — sequence structured fields first, and do not let malformed math fail quietly

> COD: "`throwOnError: false` must not silently turn malformed equations into misleading output …
> Apply first to structured `formula` fields; defer free-prose parsing until the corpus is
> inventoried."

Both points land. My proposal reached for `throwOnError: false` as a safety valve, but on a site
whose entire pitch is mathematical rigor, a silently mis-rendered equation is a worse failure than a
visible crash — it looks authoritative and is wrong. And bundling the 99 inline `$…$` prose spans
into the same change as the ~21 structured `formula` fields was scope I did not need.

**Revision.** Phase F4: structured `formula` fields only, with a **formula-parse assertion added to
the F1 gate** so an unparseable equation fails verification instead of rendering as plausible
nonsense. Free-prose inline parsing waits for a corpus inventory. I am also adopting COD's
accessibility point — emit MathML alongside the visual rendering — which quietly makes F4 a
contributor to F5 rather than a competitor for the same week.

### F1 — drop the filename invariant, add a triage state

> COD: "`basename(originalPdfUrl) === id + '.pdf'` is a useful convention, not archival truth …
> Do not encode that as an immutable historical invariant." And: "A properly fixed gate will expose
> existing red data; that is success, but it requires a triage policy."

Both accepted. The filename assertion was me mistaking a current naming habit for a rule; a
canonical archival filename could legitimately differ, and encoding it would make the manifest work
harder later. It becomes a warning, not an error, and moves into the manifest once one exists.

The triage point is the more interesting one and exposes a real gap: **F1 and F2 are coupled more
tightly than I presented them.** A fixed gate goes red immediately, and without F2's coverage field
it cannot distinguish "this transcript is a reviewed excerpt" from "this transcript is broken." I
sequenced F1 → F2; the correct reading is that F2's field is a *prerequisite input* to F1's
excerpt-aware checks. COD saw the coupling and I did not.

I also accept COD's "it should feed CI, not be mistaken for CI itself" — which is the same point I
made against AGY F4 when scoring, so it would be poor form to resist it aimed the other way.

### F5 — the counts were suggestive, not probative

> COD: "Raw counts of `aria-label`/`htmlFor` do not alone establish the complete accessible-name
> calculation: visible text can sometimes name controls."

Methodologically correct, and I should have caught it: a `<label>` *wrapping* an input confers an
accessible name with no `htmlFor` at all, so "1 htmlFor against 74 range inputs" does not prove what
I claimed it proved.

I ran the check COD's objection implies. In `src/components/patents/visuals/three/` there are **52
range inputs and zero `<label>` elements** — not one wrapping label, not one `htmlFor`, not one
`aria-labelledby`. The controls genuinely have no accessible name.

**So: method conceded, conclusion retained, evidence now actually sufficient.** The revision is that
F5 opens with a real audit (axe/Lighthouse over a representative route set) rather than a grep
count, and I stop treating ARIA attributes as the deliverable — COD's B4 requirement that every
visual ship a text/relationship equivalent is the stronger formulation and I said so when scoring it.

---

## 4. What I reject

### AGY: "F2 is purely cosmetic/editorial; doesn't fix underlying architecture" (820)

Rejected, and this is the disagreement I feel most strongly about.

The architecture is not what tells a visitor the excerpt they are reading is an "Exact, complete
transcription." The **labels** do that, and labels are exactly what F2 changes. Calling a correction
of a false public claim "cosmetic" inverts what a museum is: the artifact is the product, and the
caption is part of the artifact. A site that renders 1 of 24 Farnsworth claims under a header
reading "Verbatim Historical Specification" has an accuracy defect, not a styling defect.

AGY's supporting line makes the point better than my rebuttal does:

> "the original `originalText` is clearly meant to be a proxy. Calling it 'deceptive' is slightly
> uncharitable, though technically accurate."

"Meant to be a proxy" is an author's private intention. It does not reach the reader, who is shown
the word *complete*. "Technically accurate" is the whole argument — in an archival context there is
no other kind of accurate. This is the exact rationalization that lets an overclaim persist through
review, and I would rather be uncharitable than wrong about it.

COD, scoring the same idea independently, rated it **990** and named it the single strongest rival
idea in the duel. A 170-point gap on my highest-stakes finalist, with the low score resting on
"it's only editorial," reads to me as a difference in what the project is *for*.

### AGY: "F1 is a band-aid; it doesn't solve the underlying fake pipeline issue that COD found" (880)

Rejected as a category error, though the 880 is fine.

COD's B1 builds real provenance; my F1 makes the checks that already exist report honestly. These
are different layers, and the second is required whether or not the first ever happens — a gate that
prints `✓` after logging `❌` is not a stopgap for a missing manifest, it is a defect in its own
right, and it is roughly two lines.

The irony is that AGY's own finalist depends on mine. AGY F4 proposes wiring `pipeline:verify` into
CI; run against today's script, that produces a permanently green badge certifying nothing. AGY
called my F1 a band-aid without noticing that its own idea is load-bearing on it. COD caught the
same dependency from the other direction ("it cannot make an insufficient verification script
authoritative").

### AGY: "F5 is basic table-stakes, nothing revolutionary" (890)

Rejected as a criticism, accepted as a description. Table stakes that are *absent* are the highest-
value work available, not the lowest. An entire device class currently has no navigation on this
site. "Unrevolutionary" is not a defect in a fix; it is usually a recommendation.

I will concede the adjacent point AGY did not quite make: my F5 was less ambitious than COD's B4,
and B4's progressive-enhancement framing is better. That is a fair hit on my version — just not the
one AGY landed.

### Not rejected, but noted: AGY's non-engagement

AGY's five reviews of my work total roughly 300 words and produced no technical objection I could
test. COD produced five testable objections, two of which changed my design and one of which
(the ellipsis inference) I consider the best single contribution of the reveal phase. Generous
scores from AGY were pleasant and taught me nothing; COD's lower scores with sharper caveats were
worth considerably more.

---

## 5. Calibration self-criticism

`SCORING.md` predicts my failure mode exactly — *"Claude (CC) tends toward nuanced mid-range scores;
may under-rate bold ideas out of caution"* — and I walked into it. My scores spanned **655–831**
while AGY handed out up to 980 and COD up to 990. I never used the top 17% of my own scale.

That compression is not neutral. It systematically flattened the distance between COD's best idea
(B5, 831) and its most bundled one (B1/B2, 748), when the real gap in shippability between them is
much larger than 83 points. Had I used the full range, B5 lands near 900 and B1 nearer 700, which
would have communicated my actual view more honestly. I would not change the *ranking* — I still
think COD's set beats AGY's on diagnosis and AGY's beats COD's on shippability — but the numbers
under-sold the spread.

---

## 6. Revised priority and dependency order

Changes from `WIZARD_IDEAS_CC.md`: F2's coverage field is promoted to a prerequisite of F1's full
form; F5's mobile-navigation sliver is extracted to P0 (both rivals independently said so); F3 is
merged with AGY F2 and COD B5 rather than standing alone; F4 is split into structured and prose
phases.

| # | Work | Origin | Priority | Depends on |
|---|---|---|---|---|
| 0 | **Gate truthfulness**: conditional `✓`, guarded `statSync` | CC F1 (sliver) | **P0** | nothing — ~2 lines |
| 1 | **Coverage disclosure**: authored `transcriptCoverage` + `claimsCoverage`, honest labels, `unreviewed` state | CC F2 (revised) | **P0** | 0 |
| 2 | **Mobile navigation + modal Escape/focus return** | CC F5 (sliver) | **P0** | nothing |
| 3 | **Full gate**: semantic invariants, excerpt-aware triage, formula-parse assertion | CC F1 (revised) | P1 | 1 (needs the coverage field to triage red) |
| 4 | **CI** wiring the now-meaningful gate | AGY F4 | P1 | 3 — never before it |
| 5 | **Structured math rendering** + MathML output | CC F4 (phase 1) | P1 | 3 (gate validates every formula parses) |
| 6 | **Simulator runtime, one flagship**: mount-once + refs + dispose in `ThreeStudioScene` + `next/dynamic`; profile, then scale to 18 | CC F3 ∪ AGY F2 ∪ COD B5 | P1 | nothing technically; coordinate against peer edits |
| 7 | **Accessibility program**: real audit, control labels, reduced motion, relationship tables | CC F5 ∪ COD B4 | P2 | 2 |
| 8 | **Archival manifest + real OCR** | COD B1 | P2 | 1 (disclosure first, so honesty does not wait on it) |
| 9 | **Prose math** inline `$…$` after corpus inventory | CC F4 (phase 2) | P2 | 5 |
| 10 | Source-linked diagrams · URL state · split-scroll | COD B3 · AGY F5 · AGY F3 | P3 | 8 for the first two; 8 + a split-view refactor for the third |

The one structural change I would defend hardest: **items 0–2 are all P0 and none of them depends on
anything.** Between them they are a few hours of work, and they close a lying gate, a false public
claim, and a device class locked out of the site. Everything else in this duel — mine, AGY's, and
COD's alike — is a program that can start next week without cost.

## 7. Where the duel actually landed

Both rivals independently scored my F2 and F5 slivers as P0-worthy, and both independently flagged
that AGY F4 cannot precede a working gate. That triple convergence on sequencing, from three models
that disagreed on plenty else, is the most trustworthy output of this exercise — considerably more
so than any of the scores, including the flattering ones.

My single largest update: **F1 and F2 are one piece of work in two acts, not two ideas.** COD saw
that and I did not.
