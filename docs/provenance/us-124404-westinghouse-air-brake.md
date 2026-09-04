# US 124,404 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-124404-westinghouse-air-brake`
- Local immutable facsimile: `public/patents/pdfs/us-124404-westinghouse-air-brake.pdf`
- Stable public record: https://patents.google.com/patent/US124404A/en
- Retrieved for source review: 2026-08-18
- SHA-256: `4071920f448fd1c3c5d8b5d593963e629adc0b3ae91212aae23cfad3d95ed665`
- PDF pages: 4
- Rights basis: United States Patent No. 124,404 was granted in 1872. Its
  historical patent text and drawings are public-domain material in the United
  States. This receipt makes no claim to rights in a third-party scan
  presentation or metadata.

## Direct facsimile review

The pinned document contains one drawing sheet followed by three specification
sheets. The source title is *Improvement in Steam-Power Air-Brakes and
Signals*. It identifies George Westinghouse, Jr. as being of `Pittsburg`,
Pennsylvania. It has no filing or application date, so the catalogue's
`filingDate` is deliberately `null` rather than a substituted date.

| PDF locator | Source material | Editorial treatment |
| --- | --- | --- |
| p. 1 | Drawing sheet, Figs. 1-6, execution names | Direct visual review; one unmodified complete source sheet for every active figure reference |
| p. 2 | Masthead, problem statement, five listed functions, paired-pipe and receiver construction | Direct visual and text-layer comparison |
| p. 3 | Pipe routing, automatic trip cocks, derailment/coupling triggers, signalling gauges | Direct visual and text-layer comparison |
| p. 4 | Signalling operation, all five claims, execution, witnesses | Direct visual and text-layer comparison |

## Corrected source facts

The previous record attached a later triple-valve automatic-brake story to US
124,404. The pinned patent has no triple valve and does not contain the prior
record's two claims, 70-psi operating figure, three-state valve account, or
later freight-brake narrative. It has five printed claims covering a car
receiver, selected pipe routing, cock d-prime, accident-operated cock e, and a
two-pipe signalling apparatus.

The source's description labels C as brake-cylinder and D as air-receiver. The
fourth printed claim reverses those letters in the phrase `auxiliary reservoir,
C, to a brake-cylinder, D`. The published transcription preserves that printed
claim rather than silently harmonizing it with the description; its claim
decoder explicitly reports the discrepancy.

## Published edition, ledger, and figure crops

`westinghouseAirBrakeArchivalEdition` is an explicit manual React/TypeScript
edition. It is a continuous reading document, not a page reconstruction or a
renderer for OCR, PDF text, Markdown, or HTML. Each source paragraph has a
separate technical companion; figure citations are explicit source-crop nodes.

`public/patents/transcripts/us-124404-westinghouse-air-brake-reviewed.txt` is
the page-marked source ledger for review only. The visitor-facing source reader
does not display those markers. The older source-text layer remains research
evidence and is not a public complete-source edition.

### Direct source-sheet acceptance (2026-09-04)

Direct 300 DPI visual review confirms PDF page 1 contains all six printed
figures, their labels and source lettering, the patent identity, and execution
furniture. The active edition uses the complete, unmodified page render:
`public/patents/figures/us-124404-westinghouse-air-brake/source-sheet-1-v1.png`
(2320 × 3408 pixels; SHA-256
`7417d1ebd75e021b68f610b49d6f7af4e4ca0cf118dade6e6ca292892bb59c90`).
All 22 active figure-reference occurrences use its full `(0, 0, 2320, 3408)`
source rectangle on PDF page 1. The older isolated crops remain preserved
comparison artifacts; no historical content was reconstructed.

## Review boundary

Google Patents was used only as a secondary identity check. The pinned local
PDF, digest, and direct visual comparison are the authority. Software and
ledger checks prove the stated relationships, not independent editorial or
deployed-route acceptance. This bead remains open for that second review.
