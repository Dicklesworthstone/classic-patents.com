# US 247,804 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-247804-delaval-separator`
- Local immutable facsimile: `public/patents/pdfs/us-247804-delaval-separator.pdf`
- Stable public record: https://patents.google.com/patent/US247804A/en
- Retrieved for source review: 2026-08-18
- SHA-256: `aa9e284bf20a53467a36a3ae648c7ce5bc4b9599837af32281e04b316b5ef187`
- PDF pages: 3
- Rights basis: United States Patent No. 247,804 was granted in 1881. Its
  historic text and drawings are public-domain material in the United States.

## Direct facsimile review

The pinned document has three source sheets. Page 1 is the drawing sheet with
its title, two printed figure labels, witness names, and inventor signature.
Page 2 contains the masthead and specification through the beginning of the
operational account. Page 3 completes that account, prints the four claims,
and repeats the execution names. Every sheet was rendered and visually read.
The PDF text layer was comparison evidence only.

| PDF locator | Source material | Editorial treatment |
| --- | --- | --- |
| p. 1 | Fig. 1 perspective; Fig. 2 vertical section; source labels, witness names, signature | Direct visual review; complete unmodified source sheet retained for each cited figure |
| p. 2 | Masthead, foreign patent notices, specification and construction through the beginning of operation | Direct visual review and manual transcription |
| p. 3 | Completion of operation, four claims, signature, witnesses | Direct visual review and manual transcription |

## Source observations and corrections

The source names the inventor **Gustaf De Laval**, gives a filing date of July
31, 1879, calls the invention **Centrifugal Creamer**, and contains **four**
printed claims. It says that the chamber rotates rapidly but gives no rate,
G-force, pressure, density, throughput, percentage recovery, gear ratio, or
commercial performance figure.

The earlier public record instead named Carl Gustaf Patrik De Laval, gave a
different filing date, added a 6,000 to 7,000 RPM range, 4,000 G, density and
pressure figures, disc-stack geometry, a worm gearbox, a method claim, a
second dependent claim, and extensive historical/legal results not present in
this three-sheet facsimile. Those statements do not appear in the published
source edition.

The source's prose says that Figure 1 is the vertical section and Figure 2 the
smaller perspective. The printed drawing labels visibly identify the smaller
perspective as Fig. 1 and the vertical section as Fig. 2. The edition preserves
the prose exactly, uses previews keyed to the printed labels, and tells the
visitor about this internal discrepancy rather than silently renumbering it.

The description prints the curved outlet as `X`; claim 4 prints the same
reference in lower case as `x`. The edition preserves the case at each printed
location rather than normalizing the reference letter.

## Published edition, ledger, and figure crops

`delavalSeparatorArchivalEdition` in
`src/data/editions/delavalSeparatorEdition.ts` is a manually authored typed
React/TypeScript edition. It is continuous reading content, not OCR cleanup,
HTML, Markdown, a PDF text dump, or scan-page reconstruction.

`public/patents/transcripts/us-247804-delaval-separator-reviewed.txt` is the
separate source ledger. Its page markers establish ordered review coverage but
are never shown in the visitor reader. The older source-text layer remains
research evidence only.

| Source figure label | Active local source sheet |
| --- | --- |
| Fig. 1 (perspective) | `public/patents/figures/us-247804-delaval-separator/drawing-sheet-source-v1.png` |
| Fig. 2 (vertical section) | `public/patents/figures/us-247804-delaval-separator/drawing-sheet-source-v1.png` |

The active source sheet is a direct, unmodified 300-DPI rendering of pinned PDF
page 1. It adds no reconstructed linework, labels, or historical claims.

## Source-sheet acceptance (2026-09-03)

The legacy Fig. 1 and Fig. 2 crops are preserved in
`public/patents/figures/us-247804-delaval-separator/`, but direct visual review
showed that each includes material from the other labelled view. They are not
used as evidence for an isolated-figure boundary.

The active asset is the complete first source sheet:

- Path: `public/patents/figures/us-247804-delaval-separator/drawing-sheet-source-v1.png`
- Source locator: pinned PDF page 1, full raster rectangle `(x=0, y=0, width=2320, height=3408)`
- Raster dimensions: `2320 x 3408` pixels (upright, 300 DPI rendering)
- SHA-256: `33ae416685348135a7a286d9ceb16dc4ccf3fc3d1056afb878f2dec5a69a94d6`

A separately rendered 300-DPI page-1 comparison yielded zero differing pixels
(ImageMagick absolute error metric `AE=0`). The complete sheet visibly retains
both source-labelled views, the printed patent furniture, witnesses, and
signatures. All four active Fig. 1/Fig. 2 citations use that same full-sheet
asset and explicit page-1 source rectangle. This evidentiary repair does not
alter or gate the complete patent-text reader.

## Review boundary

The pinned local PDF, its digest, and direct visual comparison are the edition
authority. Passing tests and software gates prove only the stated relationships;
they do not replace independent editorial acceptance against the facsimile and
the deployed Wright-quality reference.
