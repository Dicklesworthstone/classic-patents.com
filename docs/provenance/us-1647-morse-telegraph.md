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

The independently reviewable text ledger is
`public/patents/transcripts/us-1647-morse-telegraph-reviewed.txt`. It has one
explicit marker for each of the nine pinned PDF pages. Pages 1 through 3 retain
the original drawing-sheet titles and defer the graphical examples to the
immutable facsimile; pages 4 through 9 contain the checked transcription of the
specification, every claim, execution, and witnesses. The page markers belong
only to this review artifact: the visitor-facing edition remains continuous and
does not present the PDF's pagination as reading structure.

The PDF was rendered and visually inspected from the first drawing-sheet notice
through the ninth-page signature and claims. Figure references in the manual
edition are deliberate source nodes and point to locally rendered complete
source sheets from the corresponding PDF pages. No remote figure, OCR, HTML,
or parser-derived reference is used in the published edition.

## Preserved legacy figure-crop receipt

The individually framed local crops below remain preserved as earlier editorial
aids. They are not deleted or overwritten, but the current public edition no
longer uses them as a substitute for the complete primary source sheet.

| Source material | Local crop group | Source sheet |
| --- | --- | --- |
| Examples 1-6: numerical and letter signs, type, and circular type details | `us-1647-morse-telegraph-fig-ex1.png` through `us-1647-morse-telegraph-fig-ex6-fig3.png` | PDF p. 1 |
| Examples 7-9: type-rule, straight and circular port-rules, feeder, and levers | `us-1647-morse-telegraph-fig-ex7.png` through `us-1647-morse-telegraph-fig-ex9-fig4.png` | PDF p. 2 |
| Example 10: register and alarm-bell details | `us-1647-morse-telegraph-fig-ex10-fig1.png` through `us-1647-morse-telegraph-fig-ex10-fig5.png` | PDF p. 3 |

The edition's retained `FIGURE_PREVIEWS` table binds each exact printed
reference string to its original drawing sheet and throws during construction
if that association is absent. The active preview selected at that occurrence
is recorded in the source-sheet acceptance below.

## Complete source-sheet acceptance (2026-09-04)

An independent direct visual review rendered the three drawing sheets from the
pinned PDF at 300 DPI. Each active citation now opens the complete, unmodified
source sheet containing that cited example or figure. This avoids treating a
conveniently framed derivative crop as a primary-source stand-in while leaving
the older crops intact for preservation. The pages visibly contain Examples
1–6 (page 1), Examples 7–9 with the straight and circular port-rules (page 2),
and Example 10's register with Figs. 1–5 (page 3).

- Reviewer: `Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review`
- Review date: `2026-09-04`
- Acceptance basis: `independent-figure-review`
- Pinned source PDF SHA-256: `07a534f54894e6130980052a77c565492e53d6cd527c092b47016e8cc243ed93`
- Active figure-reference occurrences accepted: `55`

| Pinned PDF page | Active immutable asset | Raster dimensions | SHA-256 |
| --- | --- | --- | --- |
| 1 | `/patents/figures/us-1647-morse-telegraph/source-sheet-1-v1.png` | 2320 × 3408 | `7b8d588e37946b44a183e405cb4c2636084063bf7bb4d587c7c81b85043e664d` |
| 2 | `/patents/figures/us-1647-morse-telegraph/source-sheet-2-v1.png` | 2320 × 3408 | `963b3cbd6c7d73a12cd819b4e88d8e0a3705ed1fc80e744eae06ed5a2adaa351` |
| 3 | `/patents/figures/us-1647-morse-telegraph/source-sheet-3-v1.png` | 2320 × 3408 | `b00e83560fdb7a650f65b376e928c8b89bf3d03ccc091fc8f01af109e799b832` |

Every locator uses the full rendered source rectangle: `x=0, y=0, width=2320,
height=3408` (normalized rectangle `x=0, y=0, width=1, height=1`). In the
following occurrence ledger, `bN/iM` means
`edition-block-N-group-0-inline-M` in `morseTelegraphArchivalEdition`; these
are active authored figure-reference nodes, not inferred prose matches.

| Pinned PDF page | Active occurrence locators |
| --- | --- |
| 1 | `b8/i1, b9/i1, b10/i1, b11/i1, b13/i1, b14/i1, b15/i1, b16/i1, b17/i1, b17/i3, b17/i5, b18/i1, b18/i3, b19/i1, b19/i3, b19/i5, b23/i3, b24/i3, b24/i5, b27/i11` |
| 2 | `b20/i1, b21/i1, b22/i1, b22/i3, b23/i1, b23/i5, b23/i7, b23/i9, b23/i11, b23/i13, b23/i15, b24/i1, b24/i7, b24/i9, b25/i1, b25/i3, b26/i1, b27/i1, b27/i3, b27/i5, b27/i7, b27/i9, b32/i1` |
| 3 | `b28/i1, b28/i3, b29/i1, b29/i3, b30/i1, b30/i3, b30/i5, b31/i3, b31/i5, b31/i7, b31/i9, b31/i11` |
