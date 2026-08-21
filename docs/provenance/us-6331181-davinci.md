# US 6,331,181 — Surgical Robotic Tools, Data Architecture, and Use

## Source identity

- Catalogue id: `us-6331181-davinci`
- Granted title: `SURGICAL ROBOTIC TOOLS, DATA ARCHITECTURE, AND USE`
- Inventors as printed: Michael J. Tierney, Thomas G. Cooper, Chris A. Julian, Stephen J. Blumenkranz, Gary S. Guthart, and Robert G. Younge, all of California, United States.
- Assignee as printed: Intuitive Surgical, Inc., Mountain View, California, United States.
- Patent number: US 6,331,181 B1
- Grant date: December 18, 2001
- Application number: 09/418,726
- Filing date: October 15, 1999
- Related provisional: 60/111,713, filed December 8, 1998
- Primary public record: [Google Patents US6331181B1](https://patents.google.com/patent/US6331181B1/en)
- Pinned facsimile: `public/patents/pdfs/us-6331181-davinci.pdf`
- Retrieved and source-reconciled: 2026-08-21
- Rights basis: United States patent record and drawings; the historical United States patent text and government-issued facsimile are public-domain material in the United States.
- SHA-256: `ff8eef36d94ec5ec3ec01038b7145030caf617ea018fcde9f00df6380beb3d91`
- PDF page count: 34

## Facsimile map

The pinned PDF is a 34-page scan. The map below records the source matter used
for the reviewed ledger and continuous edition. Page numbers are PDF pages,
not an inferred reconstruction from running patent-page numerals.

| PDF pages | Source matter checked |
| --- | --- |
| 1 | Patent masthead, inventors, assignee, application and filing data, classification, references, abstract, and the printed statement “28 Claims, 22 Drawing Sheets.” |
| 2 | Continuation of cited U.S. patent documents and foreign patent documents. |
| 3–24 | Drawing sheets 1–22: FIG. 1; FIG. 2; FIGS. 2A–2C; FIGS. 3–3A; FIG. 4 and FIGS. 4A–4B; FIGS. 5A–5H; FIG. 6; FIGS. 7A–7L; FIG. 8 and FIGS. 8A–8B; FIGS. 9–15. |
| 25–32 | Printed specification pages 1–16: cross-references, field, background, summary, drawing descriptions, system/tool embodiments, interfaces, memory, engagement sensors, adapters, wiring, and software/state behavior. |
| 33 | Printed claims 1–16, beginning “What is claimed is:”. The reviewed ledger removes scan furniture and preserves “calendar” as one word. |
| 34 | Printed claims 17–28, completing the four independent claim families (1, 6, 17, and 19). |

The source figure descriptions are not a generic “Da Vinci system” summary.
FIG. 1 depicts a robotic procedure and tool change; FIG. 2 depicts the arm
cart; FIGS. 2A–2C depict the manipulator's remote-center linkage; later sheets
cover tools, interfaces, adapters, wiring, software, engagement logic, and
compatibility verification. The three currently served individual previews
are preserved at:

- `public/patents/figures/us-6331181-davinci/fig-1-source-crop-v1.png` (FIG. 1)
- `public/patents/figures/us-6331181-davinci/fig-2-source-crop-v1.png` (FIG. 2)
- `public/patents/figures/us-6331181-davinci/fig-3-source-crop-v1.png` (FIG. 2A; legacy filename retained)

Individual upright isolated previews for the remaining printed figures are
not asserted by this receipt. Their source sheets remain preserved as
`sheet-1-03.png`, `sheet-2-04.png`, and `sheet-3-05.png`; a later cloud visual
review must create and independently accept the remaining figure-crop set.

## Editorial and preservation boundaries

- The public source face is the authored React edition in `src/data/editions/daVinciEdition.ts`.
- The page-complete research ledger is `public/patents/transcripts/us-6331181-davinci-reviewed.txt`; it has one marker for each of the 34 PDF pages and splits the claims between PDF pages 33 and 34.
- The canonical record is `src/data/patents/davinci.ts`. Its claim text is read dynamically from the edition's claim blocks, never duplicated in a record-local literal map.
- Figure previews are source crops only. The procedural 2D/3D instruments are explanatory renderings and are not archival citations.
- Cloud textual sources and the PDF text layer were comparison aids. No local OCR, local PDF rendering, or raw machine transcription is the published source face.
- The grant prints 28 claims: independent claims 1, 6, 17, and 19; dependent claims retain their printed dependencies.
- This receipt does not constitute independent acceptance, runtime proof, deployment proof, or a claim that the unserved figure-crop set is complete.
