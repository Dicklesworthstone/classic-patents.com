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
| p. 1 | Fig. 1 perspective; Fig. 2 vertical section; source labels, witness names, signature | Direct visual review; direct local crops for each labelled figure |
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

| Source figure label | Local selected crop |
| --- | --- |
| Fig. 1 (perspective) | `public/patents/figures/us-247804-delaval-separator/fig-1-source-crop-v2.png` |
| Fig. 2 (vertical section) | `public/patents/figures/us-247804-delaval-separator/fig-2-source-crop-v2.png` |

The selected crops are direct, unmodified selections from the pinned drawing
sheet. They add no reconstructed linework, labels, or historical claims.

## Review boundary

The pinned local PDF, its digest, and direct visual comparison are the edition
authority. Passing tests and software gates prove only the stated relationships;
they do not replace independent editorial acceptance against the facsimile and
the deployed Wright-quality reference.
