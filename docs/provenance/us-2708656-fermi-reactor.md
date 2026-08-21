# Provenance receipt — US 2,708,656, *Neutronic Reactor*

## Pinned source

- **Local immutable facsimile:** `public/patents/pdfs/us-2708656-fermi-reactor.pdf`
- **Public record:** [Google Patents, US2708656A](https://patents.google.com/patent/US2708656A/en)
- **Retrieved / reviewed:** 2026-08-18
- **Rights basis:** United States patent, issued 1955-05-17; public-domain United States Government publication.
- **SHA-256:** `e32bdaa34dda164d2ab62273c182c437464f5a2b88e480beabba0fa2aae60ef3`
- **Physical PDF pages:** 58

The pinned file is the sole authority for this edition. OCR and the PDF text
layer are comparison aids only. They are not a public source edition and did
not supply any published archival block.

## Facsimile map

| PDF pages | Content | Editorial treatment |
| --- | --- | --- |
| 1–27 | Patent drawing sheets, numbered `27 Sheets—Sheet 1` through `27 Sheets—Sheet 27`; Figures 1–42 | Locally preserved as 220-DPI source-sheet PNGs under `public/patents/figures/us-2708656-fermi-reactor/`. The figure inventory in `src/data/editions/fermiReactorEdition.ts` maps every printed figure to its source sheet. |
| 28 | Patent specification columns 1–2, masthead, inventors, assignment, filing date, eight-claim notice, opening discussion | Requires manual typed transcription. |
| 29–57 | Specification columns 3–60, including figure list at columns 14–16, eight claims at columns 58–60, cited references | Claims have been manually checked and corrected in the typed canonical record. The remaining specification is not yet a publishable archival edition. |
| 58 | Certificate of Correction, signed July 26, 1955 | Must be included in the completed archival edition as formal post-grant matter. |

## Claim evidence

The printed masthead at PDF page 28 states **“8 Claims. (Cl. 204—193)”**.
The complete claims appear in PDF page 56, right column (claims 1–4), PDF page
57, left column (continuation of claim 4 and claims 5–7), and PDF page 57,
right column (claim 8). All eight claims are independent: none incorporates a
prior numbered claim.

## Figure evidence

The printed figure inventory occupies specification columns 14–16 (PDF pages
34–35). It names Figs. 1–42 and describes their subject matter. The local
source-sheet renders preserve the original labels and reference numerals. They
are not reconstructed diagrams and contain no invented callouts.

## Corrections and integrity notes

- The former canonical `originalText` was not a transcription. It said **37
  claims**, supplied three invented claims, and assigned incorrect Fig. 1 and
  Fig. 2 captions. It has been replaced with an honest withheld-status notice;
  the public archival face remains gated.
- The current raw asset remains explicitly `source-pdf-text-layer`, rather
  than `reviewed-transcription`. It must not be relabeled or served as the
  complete specification.
- The certificate of correction identifies corrections in specification
  columns 4, 5, 6, 19, 23, 25, 34, 38, 45, 48, 51, and 53. A complete manual
  edition must reconcile those locations against both the printed grant and
  this certificate before publication.

## Remaining publication gate

No `archivalEdition` has been attached. Publication requires a continuous
typed React edition of all formal matter, specification paragraphs, equations,
tables, figures, claims, cited matter, and certificate of correction; an
explicit non-lossy plain-English companion for each source paragraph and
claim; locally cropped figure previews connected to every authored figure
reference; and a 58-marker reviewed-transcription ledger with a second
page-by-page facsimile check.

### Root re-hold (2026-08-20)

A later concurrent change attached `fermiReactorArchivalEdition` and relabeled
`us-2708656-fermi-reactor-reviewed.txt` as a reviewed transcription. Direct
inspection rejects that state: drawing-sheet entries repeat one generic summary
for all 27 sheets, specification pages 28–56 are one-line topic summaries, and
the edition compresses the printed specification into a small editorial
overview. The canonical record is therefore unbound again. The WIP edition,
claims, source-sheet inventory, and summary ledger remain preserved for future
manual authoring, but none is publication evidence.
