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
| p. 1 | Fig. 1 through Fig. 5, inventor and witness signatures | Direct visual review; the complete source sheet is the active evidence for Figs. 1-5 |
| p. 2 | Fig. 6 and Fig. 7, inventor and witness signatures | Direct visual review; the complete source sheet is the active evidence for Figs. 6-7 |
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

## Published edition, ledger, and source sheets

`bellTelephoneArchivalEdition` in
`src/data/editions/bellTelephoneEdition.ts` is an explicit, manually authored
React/TypeScript edition. It is a continuous reader's document and performs no
OCR cleanup, HTML interpretation, text parsing, or scan-page reconstruction.
Each source paragraph has an authored technical companion reading, each claim
uses the canonical claim decoder, and every printed figure reference is an
explicit local source-sheet node.

`public/patents/transcripts/us-174465-bell-telephone-reviewed.txt` is the
separate audit ledger. It contains six source-page markers solely for review;
the visitor-facing edition does not display them. The legacy source text layer
at `public/patents/transcripts/us-174465-bell-telephone.txt` remains research
evidence and is not a public complete-source edition.

| Source drawing sheet | Active local evidence |
| --- | --- |
| PDF p. 1: Figs. 1-5 | `public/patents/figures/us-174465-bell-telephone/source-sheet-1-v1.png` |
| PDF p. 2: Figs. 6-7 | `public/patents/figures/us-174465-bell-telephone/source-sheet-2-v1.png` |

Both active assets are unmodified 300 DPI renders of their entire pinned
drawing sheets. They add no reconstructed lines, labels, or source claims. The
older isolated crops remain preserved comparison artifacts; neither form of
preview replaces the complete source PDF.

### Complete source-sheet acceptance (2026-09-04)

Direct visual review confirms that PDF page 1 contains all five printed
waveform and apparatus figures (Figs. 1-5), while PDF page 2 contains the two
remaining apparatus diagrams (Figs. 6-7). Both sheets retain their title
furniture, figure labels, source lettering, inventor signatures, and witness
signatures. The active source-sheet assets are 2320 × 3408 pixels: page 1 has
SHA-256 `45d1b67692b9ae812b48c261fa60a103a6b3e2e736b65506f4b521de21bb695f`
and page 2 has SHA-256
`656aa9872a2cb51d71b30c5ef87a3e731f5510aee9e3ae82cb8d472aa653d465`.
All 24 active figure-reference occurrences use the full source-sheet rectangle
on their respective PDF pages; no source content was reconstructed.

## Review boundary

Google Patents was used as a secondary identity and date cross-check. The
pinned local PDF, its digest, and direct visual comparison are the authority
for this edition. A passed source ledger, focused test, or build proves only
that the edition has the stated software and textual relationships. It does not
replace independent editorial review against the primary facsimile and the
deployed Wright-quality reference.
