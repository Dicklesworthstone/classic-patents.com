# US 6,162 — Corliss steam-engine valve gear: source receipt

- Catalogue id: `us-6162-corliss-steam-engine`
- Local immutable facsimile: `public/patents/pdfs/us-6162-corliss-steam-engine.pdf`
- Primary public record: [Google Patents, US6162A](https://patents.google.com/patent/US6162A/en)
- Retrieved and directly compared: 2026-08-17
- SHA-256: `22a03c717ed383165143af5aa3b85c8dac0705eaa4cdadcf93130ba28ef76ff5`
- PDF page count: 8
- Filing date: Not documented by the reviewed grant or the cited primary
  public record. The catalogue records this as `null`; it does not reuse the
  10 March 1849 grant date as a fabricated filing date.
- Rights basis: United States patent specification issued in 1849. The local
  facsimile is preserved as the source record; this receipt makes no separate
  legal clearance finding for any third-party scan presentation.

## Facsimile map

| PDF pages | Material checked | Edition treatment |
| --- | --- | --- |
| 1 | Drawing sheet 1: Fig. 1, side elevation | `FIG. 1` sheet record and locally derived Figure 1 crop |
| 2 | Drawing sheet 2: Fig. 2, longitudinal vertical section | `FIG. 2` sheet record and locally derived Figure 2 crop |
| 3 | Drawing sheet 3: Figs. 3, 6, and 7 | individual sheet record and Figure 3, 6, and 7 crops |
| 4 | Drawing sheet 4: Figs. 4, 5, 8, and 9 | source sheet checked; figure-specific crops remain withheld pending fresh visual crop review |
| 5 | Masthead, reissue notice, opening, figure key, frame and valve-motion description | authored masthead and continuous paragraphs |
| 6 | Continuation of frame construction; exhaust and admission valve linkage | continuous paragraphs |
| 7 | Catch, weighted closing lever, air-cylinder cushion, governor cams, claim 1 opening | continuous paragraphs and Claim 1 node |
| 8 | Claim 1 conclusion, Claim 2, Corliss signature, witnesses, `[FIRST PRINTED 1913.]` | Claim 1 and Claim 2 nodes; execution notice |

## Editorial boundary

The public archival face is `src/data/editions/corlissSteamEngineEdition.ts`:
an explicit typed node sequence prepared from direct visual comparison of all
eight PDF pages. `public/patents/source-text/us-6162-corliss-steam-engine.txt`
is retained only as a non-authoritative OCR comparison artifact. It was not
used as public edition input or as completeness proof.

The figure-preview bindings are not yet accepted as source-faithful. A fresh
visual audit found that the retained previews for Figures 4, 5, 8, and 9 are
byte-identical copies of the full Sheet 4 image, the retained Figure 2 preview
includes masthead material, and the earlier Figure 3/7 mapping conflicts with
the printed sheet labels. These assets remain preserved; no source PDF is
changed or discarded. The Corliss record must remain under editorial hold until
new, upright, figure-specific crops are made from the pinned facsimile and
every authored reference is rebound to the verified crop.

`public/patents/transcripts/us-6162-corliss-steam-engine-reviewed.txt` is the
reviewed eight-page ledger. It preserves each drawing-sheet header and every
printed text-page continuation solely for auditability; the visitor-facing
React edition deliberately omits scan-page divisions.

The published data record names its curated excerpt as an excerpt and attaches
the complete manual edition. The specification has two printed claims, not the
three synthetic claims that preceded this receipt.
