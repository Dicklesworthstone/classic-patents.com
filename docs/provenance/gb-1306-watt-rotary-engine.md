# Provenance Receipt: James Watt Rotary Motion & Sun and Planet Gearing (1781)

## 1. Source Identity
- **Catalogue ID**: `gb-1306-watt-rotary-engine`
- **Granted Title**: *Certain New Methods of Producing a Continued Rotative Motion Around an Axis or Center, and for other Purposes, to be Applied to the Steam or Fire Engines*
- **Short Title**: James Watt Rotary Motion: Sun and Planet Epicyclic Gearing Steam Engine
- **Inventor**: James Watt (1736–1819)
- **Inventor Location**: Birmingham, County of Warwick, England
- **Grant Date**: 1781-10-25 (Enrolled 1782-02-23)
- **Filing Date**: 1781-10-25
- **Primary Public-Record URL**: `https://patents.google.com/patent/GB178101306A/en`
- **Local reconstruction PDF**: `public/patents/pdfs/gb-1306-watt-rotary-engine.pdf`
- **Reconstruction SHA-256**: `339921eba26299f65c60e0d9d283deb09419fed3260ba6dc7208ecd55d2471f1`
- **Reconstruction Page Count**: 2
- **Rights Basis**: Historical British Crown Letters Patent granted under King George III, published in Great Britain prior to 1929, public domain worldwide.

---

## 2. Facsimile Map

| PDF Page | Physical Content Checked | Archival Role |
|---|---|---|
| Page 1 | Chancery enrollment preamble, Royal grant of King George III, recital of specification proviso, general declaration of nature of invention, and complete description of the First Method (The Sun and Planet Wheels). | Specification Preamble & Method 1 |
| Page 2 | Descriptions of Methods 2, 3, 4, and 5 (Internal epicyclic gear, crown-wheel ratchet, double rack and pinion, spiral cam); formal Claims 1–4; annexed Figure Plate (Figs. 1, 2, 3); Testatum execution signed by James Watt; and Chancery enrollment memorandum of February 23, 1782. | Methods 2–5, Claims 1–4, Figure Plate & Chancery Inrollment |

---

## 3. Editorial & Preservation Boundaries
- **Visitor-Facing Source Face**: Hand-authored continuous React archival edition at `src/data/editions/wattRotaryEngineEdition.ts`.
- **Comparison Ledger**: Page-complete human-reviewed transcription at `public/patents/transcripts/gb-1306-watt-rotary-engine-reviewed.txt`.
- **Figure Crops**: Master 2000x2000 px PNG crop at `public/patents/figures/gb-1306-watt-rotary-engine/fig-1-source-crop-v1.png`.
- **Total Printed Claims**: 4 distinct claims, covering Sun & Planet conversion, 2:1 epicyclic speed multiplication, radius link constraint, and alternative rotative mechanisms.
- **Physics Kernel**: SI epicyclic kinematics kernel at `src/physics/wattRotaryKernel.ts` computing planet orbit radius, 2:1 gear ratio multiplication, tangential tooth force, beam oscillation angle, torque smoothing, and line shaft RPM.

## 4. Root Source-Identity Hold (2026-08-20)

The pinned PDF is not a historical Chancery facsimile. `pdfinfo` identifies `Typst 0.14.2` as its creator and gives creation and modification time `2026-08-19 21:59:49`; both A4 pages are visibly modern typesetting, and page 2 embeds a modern color reconstruction. The page table above inventories only what this reconstruction asserts and is not primary-source proof. The canonical record therefore has no `archivalEdition` or `originalTextAsset` binding. The PDF, ledger, edition, and crop remain preserved as research evidence until a genuine primary facsimile is pinned and reviewed.

## 5. Historical printed-witness audit — 2026-09-05

An independently inspected candidate witness is available at
`https://monaco-patents.com/fileadmin/user_upload/website-common/Patent_specifications/UK_1781_-_1306_-Watt_s_Improvement_in_Steam_Engines.pdf`.
It is an eleven-page Google digitisation of a historical printed specification,
not the 1781 parchment letters patent. The printed pages identify themselves as
``A.D. 1781 — No. 1306`` and page 9 identifies the historical printing as
London: George Edward Eyre and William Spottiswoode, Printers to the Queen's
Most Excellent Majesty, 1855. The page 10 drawing plate bears the same 1855
imprint; page 11 is modern source/catalogue matter and is not part of the
historical specification.

The retrieved bytes had SHA-256
`bb31b839f4b4f0ca6222d87ecbeb724d708ca7b37f06a42cf722e2d51a246c60` and
were rendered and visually inspected page by page. The physical map is:

| Candidate PDF page | Checked historical content |
|---|---|
| 1 | Crown-device heading, title, Watt's Chancery preamble. |
| 2–3 | Opening technical description and first method: an obliquely cut wheel with friction wheels and a heavy arch. |
| 4–5 | Second method using an eccentric wheel; third method using a rod and weighted wheel. |
| 6–7 | Fourth method using two phase-offset engines; beginning of fifth method. |
| 8 | Completion of fifth method, including the equal-tooth two-revolutions-per-stroke relation, variations, and directionality. |
| 9 | February 13, 1782 execution, witnesses, Chancery acknowledgement, and 1855 printing imprint. |
| 10 | Historical drawing sheet: Drawings 1–5, including the fifth-method exterior and internal-tooth arrangements. |
| 11 | Modern Google Books source note; excluded from the historical instrument. |

This witness proves that the two-page Typst reconstruction materially changes
the source: the sun-and-planet arrangement is the **fifth** method rather than
the first; the historical specification describes five methods rather than a
modern ``Claims and Summary`` section with four numbered claims; and the
execution/acknowledgement date printed in this witness is February 13, 1782,
not the reconstruction's February 23 date. It also supplies a real historical
drawing plate rather than the reconstruction's color schematic.

This is a strong restoration lead, but it has **not** been promoted to the
pinned source or used to claim complete archival acceptance. It has not yet
been independently matched to the original parchment or accessioned from the
holding archive; nor has its full 1855 text, drawing sheet, and page map been
transcribed and checked into a reviewed ledger. The existing two-page
reconstruction and its reader ledger remain preserved and available to visitors
while that work is done. Nothing in this finding suppresses the source reader
or the pinned PDF.
