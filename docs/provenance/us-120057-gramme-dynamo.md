# Provenance receipt: US 120,057

- **Patent:** US 120,057, *Improvement in Magneto-Electric Machines*.
- **Inventors exactly as printed:** Zenobe Theophile Gramme and Eardley Louis
  Charles d’Ivernois, of Paris, France.
- **Grant date exactly as printed:** October 17, 1871.
- **Pinned primary source:**
  [`public/patents/pdfs/us-120057-gramme-dynamo.pdf`](../../public/patents/pdfs/us-120057-gramme-dynamo.pdf)
- **Stable public record:**
  [Google Patents US120057A](https://patents.google.com/patent/US120057A/en),
  retrieved 2026-08-17.
- **Source identity:** nine-page United States Patent Office facsimile: four
  drawing sheets followed by five specification pages.
- **SHA-256:**
  `b7ffe0d2354ea69f50616261005f1265fcbab643824f0293b91fc3d2b6523895`.
- **Rights basis:** United States patent issued in 1871. The historic patent
  document is public-domain material in the United States; this receipt does
  not assert rights in third-party scan presentation or editorial text.

## Human review record

The complete primary PDF was visually reviewed on 2026-08-17 before preparing
`src/data/editions/grammeDynamoEdition.ts`. On 2026-08-21, the four official
Google Patents primary-record page images were re-read in the cloud to repair
the drawing-sheet ledger matter. Its text is an explicitly authored reading
edition, not an OCR, HTML, or Markdown import. The reviewed ledger keeps the
four drawing-sheet title/figure inventories as pages 1–4 and the five
specification pages as pages 5–9; the former public `source-text` and
transcript assets are preserved as legacy assets and are not the reviewed
canonical text.

The edition contains 25 occurrence-specific figure-reference nodes in the
specification prose, covering every printed citation from Fig. 1 through
Fig. 14, plus five grouped links in the four drawing-sheet descriptions. The
focused edition test checks that all fourteen figure numbers have a matching
authored preview and that no citation remains in a plain text inline. Pages
5–9 are the literal, continuously reflowed specification and claims. Pages
1–4 necessarily include short editorial inventory sentences describing labels
visible in the drawing pixels; those sentences are sheet metadata, not
invented specification prose, and the pinned facsimile remains authoritative.

| PDF locator | Reviewed content | Published treatment |
| --- | --- | --- |
| p. 1 | Literal heading `4 Sheets—Sheet 1`; `Z. TH. GRAMME & E. L. Ch. D’IVERNOIS`; `MAGNETO-ELECTRIC MACHINES`; patent number/date; printed FIG. 1–6 labels and visible reference letters; lower-edge printer matter | Figure-sheet block with the same visible heading, labels, and reference-letter inventory; existing versioned upright crops remain preserved; Fig. 1–6 references |
| p. 2 | Literal heading, `MAGNETO ELECTRIC MACHINES`, patent number/date, printed FIG. 7–9 labels, visible reference letters, and formal inventor/witness lines `Z. TH. GRAMME`, `E. L. Ch. D’IVERNOIS`, `WITNESSES: A. G. BRADE. AUGUSTE MEDARD.` | Figure-sheet block with the same source wording; Fig. 8 keeps `fig-8-source-crop-v3.png`; Fig. 7 and Fig. 9 remain blocked on preserved legacy assets pending isolated upright replacements |
| p. 3 | Literal heading, `MAGNETO ELECTRIC MACHINES`, patent number/date, printed FIG. 10–13 labels, visible reference letters, and formal inventor/witness lines | Figure-sheet block with the same source wording; existing versioned upright crops remain preserved; Fig. 10–13 references |
| p. 4 | Literal heading, `MAGNETO ELECTRIC MACHINES`, patent number/date, printed FIG. 14 label and visible reference letters including `A²`; no witness/inventor-signature/attorney line visible | Figure-sheet block with the same source wording; upright apparatus crop `fig-14-source-crop-v5.png` and separate label crop remain bound |
| p. 5 | Masthead, co-inventors, introduction, endless-bobbin principle | Manual edition masthead and opening paragraphs |
| p. 6 | Figs. 1–6 constructions and continuous-current explanation | Manual edition blocks with Figs. 1–6 references |
| p. 7 | Figs. 7–13 constructions | Manual edition blocks with Figs. 7–13 references |
| p. 8 | Fig. 14, alternate-current arrangement, coupling, modifications | Manual edition blocks with Figs. 14 and 11 references |
| p. 9 | Later modifications; claim preamble; claims 1–3; signatures; witnesses | Manual edition claim nodes 1–3 and closing paragraphs |

## Claims and terminology

Every printed claim appears exactly once as a typed claim node and in the
canonical patent record. Claim 1 is the endless ring/cylinder/bobbin claim;
claim 2 is the alternate-current arrangement; claim 3 is the described and
illustrated apparatus combination. Inline glossary annotations are confined to
the exact printed terms “circuit-breakers, pole-changers, or commutators” and
“endless bobbin”; they do not alter the historical wording.

## Source-sheet acceptance (2026-09-04)

Every page of the pinned nine-page facsimile was visually reviewed. PDF pages
1–4 are the four drawing sheets; pages 5–9 carry the masthead,
specification, claim preamble, three claims, signatures, and witness lines.
The active edition has 31 authored figure-reference nodes: 16 cite drawing
sheet 1, seven cite drawing sheet 2, six cite drawing sheet 3, and two cite
drawing sheet 4. Each now opens the complete, intact sheet containing its
printed figure rather than an asserted individual-crop boundary.

The four active assets predate this acceptance but were independently checked
against fresh `pdftoppm -png -r 180` renders of the pinned PDF. Each is
1392 × 2045 pixels and each comparison returned absolute error count zero;
the source-sheet bytes listed below are therefore the direct visual evidence
for the active references.

| PDF page / sheet | Printed figures visually checked | Active asset | SHA-256 |
| --- | --- | --- | --- |
| 1 / Sheet 1 | Figs. 1–6 | `drawing-sheet-1.png` | `a7c2380f83a93fcdebba8c39ada3833984d845aad829898b1ac22f4d9c304bd2` |
| 2 / Sheet 2 | Figs. 7–9 | `drawing-sheet-2.png` | `9f047812267a5e0f7d02f4e43f66b21936bd408e9fe29321fadea91050750e27` |
| 3 / Sheet 3 | Figs. 10–13 | `drawing-sheet-3.png` | `9c58685c61fbaa91e460b7542cde68d37b39a1dd0d61cf14e2a0517478dc72ea` |
| 4 / Sheet 4 | Fig. 14 | `drawing-sheet-4.png` | `d2a63bed87918eeb58eb9b2447a034fc5cc959bba92c9edd149a8efc04021512` |

The individual `fig-*.png` and versioned `fig-*-source-crop-*.png` files are
preserved unchanged as earlier review lineage. They are no longer active
evidence. In particular, Sheets 1–3 contain adjoining or overlapping
figures, and Sheet 4 is printed in a rotated orientation; a complete source
sheet retains the original context without inventing a crop boundary or a
rotation claim.

No current reader binding relies on an individual source-crop acceptance.
Future editorial crops may be added only as additional source-derived previews
after their own evidence review; they must not replace or weaken the direct
full-sheet bindings recorded here.

## Secondary checks and boundaries

- Google Patents confirms the publication number, grant date, title, and
  primary PDF identity. Its generated text was not used as the published
  transcription.
- The filing date is supported by *Gramme Electrical Co. v. Arnoux &
  Hochhausen Electric Co.*, 17 F. 838 (C.C.S.D.N.Y. 1883), which reports that
  the United States application, specification, drawings, and model were filed
  August 17, 1870. The same report discusses the patent’s term in relation to
  an Austrian patent; the record’s historical-context note is limited to that
  reported term question and outcome.
- No modern efficiency, ripple, commutator-bar count, dimensions, or
  performance value is represented as if printed in US 120,057.
