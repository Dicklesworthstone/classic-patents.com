# US 78,317 — Improved Explosive Compound

## Pinned primary facsimile

- Local public asset: `public/patents/pdfs/us-78317-nobel-dynamite.pdf`
- Public record: <https://patents.google.com/patent/US78317A/en>
- Primary-document title: *Improved Explosive Compound*
- Inventor and assignment as printed: Alfred Nobel, of Hamburg, Germany, assignor to Julius Bandmann, of San Francisco, California
- Grant date printed in the facsimile: May 26, 1868
- Filing-date and application-number limitation: neither the reviewed two-page
  grant nor the linked primary public record supplies a U.S. filing date or
  application number. The typed record therefore sets `filingDate` to `null`;
  it does not substitute the grant or execution date.
- Retrieved and visually reviewed: 2026-08-17
- Rights basis: a United States patent grant issued in 1868; the underlying grant text and scans are public-domain historical material.
- SHA-256: `06f67c50087092ed0c6110cef12d6aadc6a087747b876e516cece34288cf8b55`
- PDF page count: 2

## Page-by-page manual review receipt

| PDF page | Reviewed material | Edition treatment |
| --- | --- | --- |
| 1 | Patent-office masthead; Alfred Nobel / Julius Bandmann assignment line; grant date and title; Schedule line; address; identity; porous-earth composition; absorbent-earth selection; chalk and charcoal comparison; mixing and first ratio sentence | Masthead plus continuous authored paragraphs 1–15. Period terms `absorbent capacity`, `silicious earth`, and `infusoria` are explicit authored term nodes. |
| 2 | Completion of ratio range; screening; safety and confinement statements; percussion-cap and fuse discussion; bore-hole and cartridge use; sole claim; Nobel signature; Prohme and Bartelssen witnesses | Continuous authored paragraphs 16–35, one claim node, and execution paragraphs 37–38. `sieve`, `percussion-cap`, `tamping`, and `bore-holes` are explicit authored term nodes. |

## Claims and figures

- The grant contains one unnumbered formal claim, on PDF page 2 after “Having thus described my invention.” Its exact text is: “The composition of matter, made substantially of the ingredients and in the manner and for the purposes set forth.”
- The percussion-cap discussion is specification prose, not a second printed claim. The prior two-claim record was corrected accordingly.
- Page 1 prints “The Schedule referred to in these Letters Patent and making part of the same,” but this immutable two-page PDF contains no schedule or drawing page. The edition therefore contains no figure node, crop, preview, callout, or invented Fig. 1.

## Later legal history (separate from the source text)

- The record's limited patent-war entry is based on *Atlantic Giant Powder Co. v. Dittmar Powder Manufacturing Co.*, 1 F. 328 (C.C.S.D.N.Y. 1880), which discusses reissue No. 5,799 of original US 78,317, competing absorbent mixtures, and the original specification's use of “inexplosive”: <https://law.resource.org/pub/us/case/reporter/F/0001/0001.f.0328.pdf>.
- This later case evidence does not alter the source edition. The public claim decoder remains restricted to the one claim printed on PDF page 2, and the record makes no present legal-scope conclusion.

## Layer boundary

- `public/patents/source-text/us-78317-nobel-dynamite.txt` and the identically named transcript are retained as legacy artifacts without modification. They are not evidence of reviewed text and are not linked from the corrected record.
- The visitor-facing original-specification face is the explicit typed React edition in `src/data/editions/nobelDynamiteEdition.ts`, prepared by direct comparison with the two rendered primary-PDF pages.
- The companion-reading map contains paragraphs only. The sole claim's Plain English decoder is the canonical `Patent.claims[0]` decoder, so no claim key is placed in the paragraph map.
