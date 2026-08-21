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

## Figure-crop receipt

Each `public/patents/figures/us-120057-gramme-dynamo/fig-*.png` image is a
local derivative of its corresponding pinned drawing sheet, made only to give
the reader a legible preview of the precise printed figure at a source-text
reference. No labels, linework, or explanatory overlays were added. The
edition maps every source citation to one or more of these crops and rejects
an unregistered citation at module construction time. The original four
drawing sheets remain preserved in the facsimile PDF; the crop is a reader
aid, not a replacement source.

The following versioned files are hash-pinned crop candidates currently bound
by the edition. Their byte digests and dimensions are asserted in
`grammeDynamoEdition.test.ts` so a future replacement cannot silently drift.
Hash pinning proves byte identity only; it is not visual acceptance. At this
handoff, the only independently accepted upright figure treatment is Fig. 14
(`fig-14-source-crop-v5.png`) and its separate label crop. The other versioned
files remain live review candidates so every authored citation has a real
preview while the publication gate stays closed:

| Figure | Asset | Pixels | SHA-256 |
| --- | --- | ---: | --- |
| Fig. 1 | `fig-1-source-crop-v3.png` | 315 × 435 | `833c51a8bd14b98018483346bfa0c6410605760b53abfe9c3fee3f3d2c165ac9` |
| Fig. 2 | `fig-2-source-crop-v3.png` | 225 × 450 | `3ea81d59b9d4a959dc9b1f53bd6abc3de4654860920cebfdde2572be3a44773e` |
| Fig. 5 | `fig-5-source-crop-v3.png` | 1220 × 385 | `a21bf1960c8007c94d494026c7dd752de4d911877e9a0de249ea1dbeb2874b3c` |
| Fig. 8 | `fig-8-source-crop-v3.png` | 945 × 440 | `07c45fc62e6e4747ea3cfff29c517fcfdf27c861b0965006c0fec3e4f3b47c1a` |
| Fig. 10 | `fig-10-source-crop-v3.png` | 320 × 600 | `c447d92e8c711e3c607dd114859faebc6408ec871a5a0eb3603c4e6fd63a695d` |
| Fig. 11 | `fig-11-source-crop-v3.png` | 450 × 450 | `7866ed1c0d216575176f617b1b3645b9d469ae55e04af510bbae7ad4f82b45e7` |

Figure 1, Figure 7, Figure 8, Figure 9, and Figure 10 remain blocked from
publication pending isolated, upright derivatives. Figure 7 and Figure 9
overlap physically on drawing sheet 2. The legacy
`fig-7-source-crop.png` retains an upper Figure 9 fragment and witness matter,
while legacy `fig-9.png` is only a header/strip. `fig-8-source-crop-v3.png`
also retains upper Figure 9 material. Figure 10's current versioned crop has
neighboring-sheet contamination. Those assets remain preserved as repair
evidence, but are not acceptable final source crops; the printed citations
stay blocked until the following cloud-visual source-pixel plans are executed
and independently reviewed. The edition's reference nodes are
occurrence-specific and include these candidates only to prevent a citation
from becoming an unlinked text fragment during repair.

## Pending cloud-visual crop plans (no files generated)

The four drawing-sheet derivatives are 1392 × 2045 source-pixel rasters. The
coordinates below are inclusive source rectangles `(x, y, width, height)` in
that native raster, with no local resampling or rotation. A crop whose printed
label or apparatus crosses a boundary is split into multiple previews rather
than padded with a neighboring figure, witness block, or signature. These are
plans only; the current host load prevented generation and visual acceptance.

| Figure | PDF page | Exact vNext source-pixel plan | Required preview split and retained matter |
| --- | ---: | --- | --- |
| Fig. 1 | 1 | `(54, 448, 338, 566)` | `fig-1-main-source-crop-v4.png`: apparatus plus FIG. 1 label; trim the right neighbor fragment. `fig-1-label-source-crop-v1.png`: `(54, 408, 210, 86)` for the printed label only. |
| Fig. 7 | 2 | `(82, 666, 1090, 905)` | `fig-7-main-source-crop-v1.png`: apparatus and FIG. 7 label, excluding the upper Fig. 9 fragment. `fig-7-formal-lines-source-crop-v1.png`: `(78, 1640, 880, 210)` for the printed `WITNESSES` and inventor lines when the main apparatus crop cannot include them without contamination. |
| Fig. 8 | 2 | `(274, 1270, 956, 470)` | `fig-8-main-source-crop-v4.png`: horizontal section and FIG. 8 label. `fig-8-label-source-crop-v1.png`: `(274, 1228, 220, 86)`; do not include upper Fig. 9. |
| Fig. 9 | 2 | `(610, 206, 706, 682)` | `fig-9-main-source-crop-v1.png`: complete modification, including FIG. 9 label and the cylinder/armature detail. `fig-9-label-source-crop-v1.png`: `(610, 164, 210, 86)`; `fig-9-lower-detail-source-crop-v1.png`: `(610, 802, 706, 170)` only if the lower continuation cannot be isolated in the main crop. |
| Fig. 10 | 3 | `(72, 350, 442, 820)` | `fig-10-main-source-crop-v4.png`: complete vertical projection and FIG. 10 label; remove the neighboring mark at the current crop edge. `fig-10-label-source-crop-v1.png`: `(72, 308, 220, 86)`. |

Figure 14's current `fig-14-source-crop-v5.png` remains the accepted
candidate: it is upright, clockwise-correct relative to the primary page,
contains the complete printed `FIG. 14.` label, and excludes the witness
block. The separate `fig-14-label-source-crop-v4.png` remains available for
the tiny-label preview. No existing crop is overwritten or deleted by this
plan.

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
