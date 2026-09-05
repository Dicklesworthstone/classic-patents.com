# Provenance Receipt — US 3,237 (Norbert Rillieux — Multiple-Effect Evaporator)

## Source Identity

- **Catalogue ID**: `us-3237-rillieux-evaporator`
- **Patent Number**: US 3,237
- **Granted Title**: Improvement in Sugar-Works
- **Inventors as Printed**: Norbert Rillieux, of New Orleans, Louisiana, Assignor to Saml. V. Merrick and John H. Towne
- **Grant Date**: August 26, 1843
- **Filing Date**: 1843 (exact primary day unstated in early pre-1860 grant masthead)
- **Primary Public Record URL**: `https://patents.google.com/patent/US3237A/en`
- **Local Source PDF**: `public/patents/pdfs/us-3237-rillieux-evaporator.pdf`
- **PDF SHA-256 Digest**: `10d9a2c3909f1a7d7086c063925f96feed8aa362e1b39a64275a869853dc1d7a`
- **PDF Page Count**: 11 pages
- **Retrieval Date**: August 19, 2026
- **Full-Facsimile Review Date**: 2026-09-04 drawing-sheet visual audit. This establishes the source-sheet evidence below and confirms that the short edition is not yet a page-complete transcription; it does not accept the specification/claims transcription.
- **Rights Basis**: Public domain United States Government patent grant (1843).

---

## Facsimile Map

| PDF Page | Physical Content | Verification Notes |
| :--- | :--- | :--- |
| **Page 1** | Drawing sheet 1 of 6 | Printed header: “Sheet 1—6 Sheets.” Several numbered views of the evaporating-pans and connected apparatus. |
| **Page 2** | Drawing sheet 2 of 6 | Printed header: “Sheet 2—6 Sheets.” Additional vessel, condenser, and sectional views. |
| **Page 3** | Drawing sheet 3 of 6 | Printed header: “Sheet 3—6 Sheets.” Engine, vessel, and connected-apparatus views. |
| **Page 4** | Drawing sheet 4 of 6 | Printed header: “Sheet 4—6 Sheets.” Column, vessel, and sectional views. |
| **Page 5** | Drawing sheet 5 of 6 | Printed header: “Sheet 5—6 Sheets.” Additional apparatus and sectional views. |
| **Page 6** | Drawing sheet 6 of 6 | Printed header: “Sheet 6—6 Sheets.” Remaining mechanism and sectional views. |
| **Page 7** | Specification masthead and opening description | Four improvements: engine/steam-valve arrangement, vacuum-pan combination, an outer casing for a Champenoise column, and a differential thermometer regulator. |
| **Page 8** | Specification, continuation | Detailed construction and operation of the first and second improvements, including steam and evaporator connections. |
| **Page 9** | Specification, continuation | Continuation of the second and third improvements, including vessels, condenser, columns, and conduits. |
| **Page 10** | Specification, continuation | The fourth improvement's differential-thermometer construction and its regulating action. |
| **Page 11** | Specification conclusion, claims, signature | Printed claims 1–5, N. Rillieux's signature, and two witnesses. |

---

## Editorial & Preservation Boundaries

**Current editorial state: HOLD.** The pinned PDF and digest are preserved. Direct
visual inspection now accepts the six complete drawing sheets listed below, but it also
establishes that the existing ledger contains raw recognition errors and that the
visitor-facing React edition is a short editorial reconstruction rather than the
page-complete specification. The remaining full-specification repair is an internal
publication task only: it must never remove the visitor's access to the best available
complete source text or the pinned facsimile.

- **Visitor Source Face**: The source reader serves the complete local ledger at `public/patents/transcripts/us-3237-rillieux-evaporator-reviewed.txt` while `rillieuxEvaporatorEdition.ts` remains a clearly marked, incomplete draft. The pinned PDF remains available alongside it.
- **Reviewed Ledger**: `public/patents/transcripts/us-3237-rillieux-evaporator-reviewed.txt`
- **Active Figure Assets**: `public/patents/figures/us-3237-rillieux-evaporator/source-sheet-1-v1.png` through `source-sheet-6-v1.png`; each is a lossless 2320 × 3408 300-DPI render of the corresponding pinned-PDF drawing page. Legacy `plate-*-source-crop-v1.png` files remain preserved but are no longer active edition previews.
- **Printed Claims**: Exactly 5 claims printed in the Letters Patent.
- **Physics Kernel**: `src/physics/rillieuxEvaporatorKernel.ts` (Multiple-effect latent heat cascading, saturated vapor pressure $P_{\text{sat}}(T)$, boiling point elevation $\Delta T_{\text{bpe}}$ from Brix sugar concentration, enthalpy of vaporization $h_{fg}$, heat transfer $Q = U A \Delta T$, steam economy ratio $S = \dot{m}_{\text{evap}} / \dot{m}_{\text{steam}}$, and fuel savings).

## Source-Sheet Review — 2026-09-04

The six active source-sheet assets were rendered directly from PDF pages 1–6 at 300
DPI, visually inspected against their source pages, and byte-pinned below. Each active
edition reference is bound to its whole source sheet, not to a reconstructed or
editorially cropped drawing.

| PDF page / printed sheet | Active source-sheet asset | SHA-256 |
| :--- | :--- | :--- |
| 1 / Sheet 1 | `source-sheet-1-v1.png` | `5f18d9afe016bfe9ad8cf6a069f5b3568c1517ba8cabfb98550a0af92a0389a7` |
| 2 / Sheet 2 | `source-sheet-2-v1.png` | `772355903b4520d2854d5f3051d81ef448fa8e699674acbb467a700d272efdce` |
| 3 / Sheet 3 | `source-sheet-3-v1.png` | `423cc209a90b340ff4ce57e9876ba81e8c7a5fe217e62aa92768f89a0788a60d` |
| 4 / Sheet 4 | `source-sheet-4-v1.png` | `ba17565044e955be2cc99e4b45ab83d8ddca83f629869e7b2c803f1b9032687f` |
| 5 / Sheet 5 | `source-sheet-5-v1.png` | `36a035fbd94df854fa994b1d4a88292413ddafae53367739161bde41214b3917` |
| 6 / Sheet 6 | `source-sheet-6-v1.png` | `e87510ffbc30a2384db658ef790c1fc1069fa257e48b9654e910b397e008276a` |

## Drawing-sheet ledger correction — 2026-09-04

Each of PDF pages 1–6 was rendered directly from the pinned facsimile and
visually checked. The ledger no longer substitutes editorial entries such as
`[Drawing Plate 1]`. It now transcribes the printed sheet identity, inventor
name, title, patent number/date, and visible figure labels from each drawing
sheet. These corrections do not pretend that the draft edition is complete or
that all of the raw recognition errors on source pages 7–11 are resolved.
They remove a specific false “reviewed” placeholder while preserving every
visitor's complete-ledger and PDF access.

## Specification-page source audit — 2026-09-05

PDF pages 7–11 were rendered directly from the pinned facsimile at 220 DPI
and visually inspected in full, including both printed columns on each page.
They contain the masthead and four improvement descriptions (p. 7), the first
and second improvement apparatus (p. 8), the continued second and third
improvements (p. 9), the fourth improvement's differential thermometer
(p. 10), and all five printed claims, signature, and witness line (p. 11).
The preserved ledger still contains column-order and recognition errors in
these pages, and the short React draft remains incomplete. Those are now
bounded line-by-line transcription work; they are not evidence that the
source instrument is absent, and they do not alter the reader's full-ledger
and PDF availability.

The page-seven masthead and opening paragraph were reconciled on 2026-09-05
from a direct 300-DPI rendering of the pinned facsimile. The ledger and held
candidate now reproduce the printed August 26, 1843 date, Rillieux/Merrick/
Towne assignment line, and opening description of evaporating and
concentrating saccharine juices and sirups. The old candidate body was a
source-like reconstruction rather than a verified transcription, so it was
removed rather than represented as archival text. The held packet now
contains only the checked opening, printed claims, signature, and witnesses.
The remainder of pages 7–11 is still open line-by-line work; this correction
does not promote the draft or alter complete-ledger/PDF reader delivery.
