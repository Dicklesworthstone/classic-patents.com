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
| p. 1 | Drawing sheet with Figs. 1-3 | Direct visual review; the active preview retains the complete upright source sheet |
| p. 2 | Masthead, complete specification, one claim, signature, witnesses | Direct visual and text-layer comparison; continuous manual transcription |

## Superseded cloud figure-crop research plan

The authoritative cloud facsimile used for this review is the official Google
Patents image derived from the public patent record:

- Drawing-sheet image: <https://patentimages.storage.googleapis.com/2c/55/5c/a19dadfbcdf4e7/US157124-drawings-page-1.png>
- Source image dimensions: `2320 x 3408` pixels, portrait, upright (`0°` rotation).
- Review result: the narrow legacy previews were held as sideways or otherwise
  insufficiently bounded source-face evidence. Existing files are preserved
  byte-for-byte; the active evidence is now the complete first drawing sheet.

The following are bounded source coordinates in that upright cloud image. The
coordinates intentionally exclude the drawing-sheet masthead, the neighboring
figure, signatures, and the printer footer while retaining each figure label,
its complete linework, and all printed reference letters visible within that
figure. These are a cloud-worker crop contract only; no replacement crop was
generated on this host.

| Versioned output | Source rectangle `(x, y, width, height)` | Rotation | Included source content and labels |
| --- | ---: | ---: | --- |
| `fig-1-source-crop-v1.png` | `(430, 900, 720, 1900)` | `0°` | Fig. I fence section with `A`, `B`, `C`, `D`, `b`, and `c`; excludes the Fig. II/III neighbors and signatures |
| `fig-2-source-crop-v1.png` | `(1500, 1780, 520, 520)` | `0°` | Fig. II sectional detail with its printed `D`, `a`, `z`, `E`, and `s` labels; excludes Fig. III |
| `fig-3-source-crop-v1.png` | `(1360, 700, 700, 900)` | `0°` | Fig. III perspective detail with its printed `D`, `a`, `z`, `E`, and `s` labels; excludes the masthead, Fig. II, signatures, and footer |

This candidate crop plan remains preservation evidence only. It does not
authorize the old assets or replace the direct local source-sheet review below.

## Source-sheet acceptance (2026-09-03)

The pinned drawing sheet (PDF p. 1) was rendered directly at 300 DPI for
source-pixel inspection only; no OCR, text extraction, masking, compositing,
reconstruction, rotation, or selective redrawing was used. It contains all
three complete printed figures and the genuine drawing-sheet furniture. The
active preview is therefore the complete, upright sheet rather than a claimed
isolated crop.

| Active asset | Pinned PDF page / source rectangle | Output pixels / SHA-256 | Accepted coverage |
| --- | --- | --- | --- |
| `public/patents/figures/us-157124-glidden-barbed-wire/source-sheet-1-v1.png` | p. 1; `x=0, y=0, width=2320, height=3408` | 2320×3408; `4002c9b8311556cb861bc5f2eaaf63a404ce01c1b0cac77d76a8a684169d0083` | Complete Sheet 1, including Figs. 1–3 and its original title, signature, witness, and printer furniture. |

The active asset was compared with a fresh 300-DPI render of pinned PDF p. 1:
both are 2320×3408 pixels and the absolute pixel error is zero. All six
authored Figure 1/Fig. 2/Fig. 3 citations bind to that one source sheet. Exact
page, source-raster, and source-rectangle records are in
`src/data/editions/figureOccurrenceSourceLocators.ts`; the byte digest,
dimensions, reviewer, and occurrence count are pinned in
`src/data/editions/archivalFigureAcceptance.ts`. This internal evidence repair
does not alter the legal text or the visitor's source-reader delivery.

## Corrected source facts

The former public record mistakenly presented a two-claim specification and
inserted unsourced gauge, coating, pitch, stress, temperature, and material
claims. The pinned facsimile has one claim. It claims a transverse spur-wire
bent around one strand of a twisted fence wire and clamped in place by the
other strand. The specification also describes, but does not put in that
single printed claim, a through-post twisting key used to restore tension.

The facsimile calls the place `De Kalb`, uses `wire-fences`, and identifies the
two long strands as `a` and `z`. The registered title, inventor, grant date,
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
| Fig. 1 | `public/patents/figures/us-157124-glidden-barbed-wire/source-sheet-1-v1.png` (complete Sheet 1) |
| Fig. 2 | `public/patents/figures/us-157124-glidden-barbed-wire/source-sheet-1-v1.png` (complete Sheet 1) |
| Fig. 3 | `public/patents/figures/us-157124-glidden-barbed-wire/source-sheet-1-v1.png` (complete Sheet 1) |

The preserved local crop files remain research selections from the pinned
drawing sheet. They add no reconstructed linework, labels, or historical
claims, but they are no longer the active archival previews.

## Review boundary

Google Patents was used as a secondary identity and date cross-check. The
pinned local PDF, its digest, and direct visual comparison are the authority
for this edition. Passing source-ledger, focused-test, or build checks proves
only the stated software and textual relationships. It does not replace a
separate editorial review against the primary facsimile and the deployed
Wright-quality reference.
