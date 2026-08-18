# US 157,124 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-157124-glidden-barbed-wire`
- Local immutable facsimile: `public/patents/pdfs/us-157124-glidden-barbed-wire.pdf`
- Stable public record: https://patents.google.com/patent/US157124A/en
- Retrieved for source review: 2026-08-18
- SHA-256: `19c3874222e125ad1be8df9b1e4e59df4d7ff6452876588666a3c9ddf2cb0cc1`
- PDF pages: 2
- Rights basis: United States Patent No. 157,124 was granted in 1874. Its
  historical patent text and drawings are public-domain material in the United
  States. This receipt makes no claim to rights in a third-party scan
  presentation or metadata.

## Direct facsimile review

The pinned document has two source sheets. Page 1 is the printed drawing sheet
with Figs. 1 through 3. Page 2 contains the Patent Office masthead, full
specification, one printed claim, execution, and witnesses. Direct visual
review is the authority for the published edition; the pre-existing raw text
layer was used only as a secondary comparison aid.

| PDF locator | Source material | Editorial treatment |
| --- | --- | --- |
| p. 1 | Drawing sheet with Figs. 1-3 | Direct visual review; direct local crops selected for each printed figure |
| p. 2 | Masthead, complete specification, one claim, signature, witnesses | Direct visual and text-layer comparison; continuous manual transcription |

## Corrected source facts

The former public record mistakenly presented a two-claim specification and
inserted unsourced gauge, coating, pitch, stress, temperature, and material
claims. The pinned facsimile has one claim. It claims a transverse spur-wire
bent around one strand of a twisted fence wire and clamped in place by the
other strand. The specification also describes, but does not put in that
single printed claim, a through-post twisting key used to restore tension.

The facsimile calls the place `De Kalb`, uses `wire-fences`, and identifies the
two long strands as `a` and `a′`. The registered title, inventor, grant date,
application date, drawing references, and claim wording in the manual edition
preserve those source facts.

## Published edition, ledger, and figure crops

`gliddenBarbedWireArchivalEdition` in
`src/data/editions/gliddenBarbedWireEdition.ts` is an explicit, manually
authored React/TypeScript edition. It is a continuous reading document. It
does not parse OCR, treat transcript text as markup, infer figure references,
or reconstruct source scan pages for the visitor.

`public/patents/transcripts/us-157124-glidden-barbed-wire-reviewed.txt` is the
separate source ledger. Its page markers exist for review only and are not
shown in the reader. The pre-existing source-text layer remains research
evidence, not the public complete-source edition.

| Source figure | Local selected crop |
| --- | --- |
| Fig. 1 | `public/patents/figures/us-157124-glidden-barbed-wire/fig-1-source-crop.png` |
| Fig. 2 | `public/patents/figures/us-157124-glidden-barbed-wire/fig-2-source-crop.png` |
| Fig. 3 | `public/patents/figures/us-157124-glidden-barbed-wire/fig-3-source-crop.png` |

The local crop files are unmodified selections from the pinned drawing sheet.
They add no reconstructed linework, labels, or historical claims.

## Review boundary

Google Patents was used as a secondary identity and date cross-check. The
pinned local PDF, its digest, and direct visual comparison are the authority
for this edition. Passing source-ledger, focused-test, or build checks proves
only the stated software and textual relationships. It does not replace a
separate editorial review against the primary facsimile and the deployed
Wright-quality reference.
