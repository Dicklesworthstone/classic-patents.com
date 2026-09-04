# US 588 — John Ericsson, “Screw-Propeller for Vessels”

## Facsimile receipt

- **Pinned local facsimile:** `public/patents/pdfs/us-588-ericsson-propeller.pdf`
- **Primary public record:** <https://patents.google.com/patent/US588/en>
- **Retrieved / reviewed:** 2026-08-17
- **Rights basis:** United States Patent No. 588 was granted on 1 February 1838. Its patent specification and drawings are public-domain United States government records.
- **SHA-256:** `40582250d44f6558cf9a438801e312a469ccb83b6755ebc813943fba54c3ea9a`
- **PDF pages:** 5
- **Filing date:** Not documented by the reviewed grant or the cited primary
  public record. The catalogue records this as `null`; it does not reuse the
  1 February 1838 grant date as a fabricated filing date.
- **Editorial method:** direct visual reading of the pinned five-page PDF. The published continuous edition is explicit typed nodes in `src/data/editions/ericssonPropellerEdition.ts`; no OCR or PDF text layer is its source.

## Page-level locators

| Material | PDF locator | Use in edition |
| --- | --- | --- |
| Drawing sheet 1, Figures 1–2 | PDF p. 1, “Sheet 1, 2 Sheets” | Figure-sheet record; explicit Figure 1 and Figure 2 references; reviewed-transcription ledger page 1 |
| Drawing sheet 2, Figures 3–6 | PDF p. 2, “Sheet 2, 2 Sheets” | Figure-sheet record; explicit Figure 3–6 references; reviewed-transcription ledger page 2 |
| Masthead and first physical specification page | PDF p. 3, ending after `piston rod or beam of a` | Masthead, first construction paragraphs, and the first half of a sentence that continues onto PDF p. 4; reviewed-transcription ledger page 3 |
| Second physical specification page | PDF p. 4, beginning `steam engine the cylinder of which may be` | Remainder of the specification, motion recommendation, disclaimer, claims 1–3, J. Ericsson signature, and Curley and Marquette witnesses; reviewed-transcription ledger page 4 |
| Blank trailing source page | PDF p. 5, no printed content | Explicit blank-page receipt only; no source prose is reassigned to this page |

## Editorial boundary

`public/patents/transcripts/us-588-ericsson-propeller-reviewed.txt` is the accountable five-page review ledger for the continuous edition. It is pinned in the catalogue as a `reviewed-transcription`, names its reviewer and review date, and carries the source PDF digest above. It records page coverage without imposing source-sheet breaks on the visitor-facing React edition.

The source PDF's trailing fifth page is blank. Its ledger section therefore contains only the explicit `[BLANK FACSIMILE PAGE: no printed content]` receipt. It does not move the tail of PDF p. 4 onto a fictitious content-bearing fifth page.

The local `public/patents/source-text/us-588-ericsson-propeller.txt` is retained as a legacy comparison artifact and is not used by the manually prepared Original Patent Text face. It is neither a source for the edition nor evidence of completeness.

## Complete source-sheet acceptance (2026-09-04)

Direct 300 DPI visual review confirms that PDF page 1 contains Figs. 1 and 2,
and PDF page 2 contains Figs. 3 through 6. Each complete sheet retains its
source title, patent number, figure labels, lettering, signatures, and the
surrounding geometry needed to interpret every cited figure. The active
visitor-facing evidence is the unmodified complete-sheet render:
`source-sheet-1-v1.png` (2320 × 3408; SHA-256
`1ca319ff08021d4edefd66eaf07e71a9bf7f945e27f89ee6b508c979d8c91437`) and
`source-sheet-2-v1.png` (2320 × 3408; SHA-256
`2d16789f1d9dde794ce5f845d6bbfd94d7ed65ea75c1f81b63ed1fb75ad168f6`). All
21 active figure-reference occurrences resolve to their complete source
sheet. The former isolated crops and source-review renders remain preserved
comparison artifacts; no historical content was reconstructed.
