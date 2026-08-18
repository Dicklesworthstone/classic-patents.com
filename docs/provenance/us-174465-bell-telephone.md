# US 174,465 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-174465-bell-telephone`
- Local immutable facsimile: `public/patents/pdfs/us-174465-bell-telephone.pdf`
- Stable public record: https://patents.google.com/patent/US174465A/en
- Retrieved for source review: 2026-08-18
- SHA-256: `cb1a0fa7bd871937575e240adf904fa3ea8f462b3bfceb4e7cbbb0811909a8e9`
- PDF pages: 6
- Rights basis: United States Patent No. 174,465 was granted in 1876. Its
  historical patent text and drawings are public-domain material in the United
  States. This receipt makes no claim to rights in a third-party scan
  presentation or metadata.

## Direct facsimile review

The pinned document is a six-page United States Patent Office facsimile. The
first two pages are two printed drawing sheets. PDF pages 3 through 6 contain
the two-column specification, all five claims, execution, and witnesses. The
granted title is *Improvement in Telegraphy*; the source develops harmonic
telegraphy and undulatory electrical currents before applying the apparatus in
Fig. 7 to vocal or musical sound.

| PDF locator | Source material | Editorial treatment |
| --- | --- | --- |
| p. 1 | Fig. 1 through Fig. 5, inventor and witness signatures | Direct visual review; local crops for Figs. 1-5 are selected from this source sheet |
| p. 2 | Fig. 6 and Fig. 7, inventor and witness signatures | Direct visual review; local crops for Figs. 6-7 are selected from this source sheet |
| p. 3 | Masthead, opening, earlier harmonic-telegraph work, intermittent versus undulatory current, induction | Direct visual and text-layer comparison |
| p. 4 | 4:5 example, Figs. 1-4 waveform discussion, induction, resistance and battery examples | Direct visual and text-layer comparison |
| p. 5 | Fig. 5 transmitter/receiver, Fig. 6 harmonic groups, Fig. 7 voice apparatus, terminology, claim introduction | Direct visual and text-layer comparison |
| p. 6 | Claims 1-5, execution, ALEX. GRAHAM BELL signature, THOMAS E. BARRY and P. D. RICHARDS witnesses | Direct visual and text-layer comparison |

## Corrected source facts

The former public excerpt incorrectly described a liquid transmitter as the
illustrated telephone apparatus and reduced the specification to an invented
modern account. In the source, Fig. 6 is a three-group harmonic-telegraph
arrangement. Fig. 7 is the sound-driven membrane and electromagnetic armature
arrangement. The mercury discussion occurs only as an example of a different
way to vary a continuous circuit's resistance. It is not a figure caption or a
component inventory for Fig. 7.

The source has five independent claims. Claim 1 ends “substantially as set
forth,” not “substantially as described.” Claim 2 names three relative-motion
arrangements for an inductive body and a conducting wire; Claims 3 and 4 cover
inductive and resistance/power methods; Claim 5 covers the stated
sound-corresponding electrical undulations. The canonical record and manual
edition retain that printed sequence and wording.

## Published edition, ledger, and figure crops

`bellTelephoneArchivalEdition` in
`src/data/editions/bellTelephoneEdition.ts` is an explicit, manually authored
React/TypeScript edition. It is a continuous reader's document and performs no
OCR cleanup, HTML interpretation, text parsing, or scan-page reconstruction.
Each source paragraph has an authored technical companion reading, each claim
uses the canonical claim decoder, and every printed figure reference is an
explicit local preview node.

`public/patents/transcripts/us-174465-bell-telephone-reviewed.txt` is the
separate audit ledger. It contains six source-page markers solely for review;
the visitor-facing edition does not display them. The legacy source text layer
at `public/patents/transcripts/us-174465-bell-telephone.txt` remains research
evidence and is not a public complete-source edition.

| Source figure | Local selected crop |
| --- | --- |
| Fig. 1 | `public/patents/figures/us-174465-bell-telephone/fig-1-source-crop.png` |
| Fig. 2 | `public/patents/figures/us-174465-bell-telephone/fig-2-source-crop.png` |
| Fig. 3 | `public/patents/figures/us-174465-bell-telephone/fig-3-source-crop.png` |
| Fig. 4 | `public/patents/figures/us-174465-bell-telephone/fig-4-source-crop.png` |
| Fig. 5 | `public/patents/figures/us-174465-bell-telephone/fig-5-source-crop.png` |
| Fig. 6 | `public/patents/figures/us-174465-bell-telephone/fig-6-source-crop.png` |
| Fig. 7 | `public/patents/figures/us-174465-bell-telephone/fig-7-source-crop.png` |

The local crop files are unmodified selections from the pinned drawing sheets.
They add no reconstructed lines, labels, or source claims. They aid figure
references but never replace the complete source PDF.

## Review boundary

Google Patents was used as a secondary identity and date cross-check. The
pinned local PDF, its digest, and direct visual comparison are the authority
for this edition. A passed source ledger, focused test, or build proves only
that the edition has the stated software and textual relationships. It does not
replace independent editorial review against the primary facsimile and the
deployed Wright-quality reference.
