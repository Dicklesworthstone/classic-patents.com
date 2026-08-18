# US 1,647 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-1647-morse-telegraph`
- Local immutable facsimile: `public/patents/pdfs/us-1647-morse-telegraph.pdf`
- Authoritative public record: https://patents.google.com/patent/US1647A/en
- Retrieved for this edition: 2026-08-17
- SHA-256: `07a534f54894e6130980052a77c565492e53d6cd527c092b47016e8cc243ed93`
- PDF pages: 9
- Rights basis: United States Patent No. 1,647 was granted in 1840. The patent text and drawing sheets are United States Government works and are in the public domain in the United States; this receipt does not assert rights in third-party scan presentation or metadata.

## What the pinned PDF contains

The copy is not a later reissue specification. Its three opening sheets are titled
`S. F. B. Morse. Telegraph Signs.` and carry the patent date June 20, 1840.
The printed specification begins on PDF page 4 and is set in two columns across
PDF pages 4 through 9. Its signature bears the date April 7, 1838.

| Material | Exact PDF locator | Editorial treatment |
| --- | --- | --- |
| Drawing sheet 1: Examples 1-6, numeral and letter signs, witnesses and inventor signature | PDF p. 1, `Sheet 1. 3 Sheets` | Authored figure-sheet node; local preview `us-1647-morse-telegraph-sheet-1-preview.png` |
| Drawing sheet 2: Examples 7-9, straight/circular port-rules, type feeder, levers | PDF p. 2, `Sheet 2. 3 Sheets` | Authored figure-sheet node; local preview `us-1647-morse-telegraph-sheet-2-preview.png` |
| Drawing sheet 3: Example 10 register, Figs. 1-5, witnesses and inventor signature | PDF p. 3, `Sheet 3. 3 Sheets` | Authored figure-sheet node; local preview `us-1647-morse-telegraph-sheet-3-preview.png` |
| Masthead, identity, opening description, Examples 1-4 | PDF p. 4 | Explicit masthead and ordered paragraph nodes |
| Examples 4-6, type and port-rule description | PDF p. 5 | Explicit ordered paragraph and figure-reference nodes |
| Examples 6-9, circular port-rule and signal lever | PDF p. 6 | Explicit ordered paragraph and figure-reference nodes |
| Signal lever and beginning of register | PDF p. 7 | Explicit ordered paragraph and figure-reference nodes |
| Register, electro-magnet, relay method | PDF p. 8 | Explicit ordered paragraph nodes |
| Relay continuation, vocabulary, insulation/laying, Claims 1-9, execution and witnesses | PDF p. 9 | Explicit claim nodes, execution, and witness nodes |

## Editorial boundary

The public Original Patent Text is `morseTelegraphArchivalEdition` in
`src/data/editions/morseTelegraphEdition.ts`. It is a manually authored,
continuous semantic edition pinned to the digest above. The pre-existing
`public/patents/source-text/us-1647-morse-telegraph.txt` is retained only as a
legacy source-PDF text-layer comparison artifact. It is not the public edition,
not a completeness receipt, and not an editorial authority.

The PDF was rendered and visually inspected from the first drawing-sheet notice
through the ninth-page signature and claims. Figure references in the manual
edition are deliberate source nodes and point to locally rendered crops from
the corresponding sheet. No remote figure, OCR, HTML, or parser-derived
reference is used in the published edition.
