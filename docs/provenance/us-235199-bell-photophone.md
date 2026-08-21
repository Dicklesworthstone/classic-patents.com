# Provenance Receipt — US 235,199 (Alexander Graham Bell — Photophone)

## Source Identity

- **Catalogue ID**: `us-235199-bell-photophone`
- **Patent Number**: US 235,199
- **Granted Title**: Apparatus for Signaling and Communicating, called Photophone
- **Inventors as Printed**: Alexander Graham Bell, of Washington, District of Columbia, Assignor to American Bell Telephone Company, of Boston, Massachusetts
- **Grant Date**: December 7, 1880
- **Filing Date**: August 28, 1880
- **Primary Public Record URL**: `https://patents.google.com/patent/US235199A/en`
- **Local Source PDF**: `public/patents/pdfs/us-235199-bell-photophone.pdf`
- **PDF SHA-256 Digest**: `924fc983c2b53e84e122b7fb84014b5d37cf2461eae4132ea235211364f25e85`
- **PDF Page Count**: 13 pages
- **Retrieval Date**: August 19, 2026
- **Full-Facsimile Review Status**: Withheld. On August 21, 2026, the 13 pages were re-inspected against the pinned PDF and the existing ledger/edition were confirmed not to be a literal, page-complete transcription.
- **Rights Basis**: Public domain United States Government patent grant (1880).

---

## Facsimile Map

| PDF Page | Physical Content | Verification Notes |
| :--- | :--- | :--- |
| **Page 1** | Drawing Sheet 1 (Figs. 1–6) | Full system schematic (Fig. 1), transmitter beam path (Fig. 2), tone siren wheel (Fig. 3), and screen-grating details (Figs. 4–6). |
| **Page 2** | Drawing Sheet 2 (Figs. 3–17) | Additional transmitter and grating views (Figs. 3–9), parabolic receiver (Fig. 10), and selenium-cell constructions (Figs. 11–17). |
| **Page 3** | Drawing Sheet 3 (Figs. 10 and 18–24) | Repeated system view (Fig. 10), alternate selenium-cell assemblies (Figs. 18–19), and construction details (Figs. 20–24). |
| **Page 4** | Specification Masthead & Column 1–2 | Preamble, statement of invention, discovery of photo-acoustic effect across substances, transmitter principles, and description of Figures 1–3. |
| **Page 5** | Specification Page 2 (Cols 1–2) | Beam modulation physics, mirror diaphragms of mica/glass/metal, acoustic beam focus, and slotted grating shutter mechanics. |
| **Page 6** | Specification Page 3 (Cols 1–2) | Slotted grid shutters, Venetian blind slats, optical ray interference, and voice diaphragm coupling. |
| **Page 7** | Specification Page 4 (Cols 1–2) | Polarization modulation, liquid crystal/liquid cell refraction, and variable absorption filters. |
| **Page 8** | Specification Page 5 (Cols 1–2) | Articulate speech transmission via modulated radiant beams, parabolic collection geometry, and receiver dynamics. |
| **Page 9** | Specification Page 6 (Cols 1–2) | Selenium crystalline annealing, dark resistance vs illuminated resistance, and cylindrical stacked disk cell construction. |
| **Page 10** | Specification Page 7 (Cols 1–2) | Interdigital flat cells, type-metal casting methods, and multi-disc low-resistance high-surface-area cell architecture. |
| **Page 11** | Specification Page 8 (Cols 1–2) | Direct photo-acoustic sound generation in substances without electricity (spectrophone/photoacoustic effect), hard rubber discs, and lampblack absorbers. |
| **Page 12** | Specification Page 9 & Claims 1–15 | Acoustical variable-resistance telephone theory, Claims 1–15. |
| **Page 13** | Specification Page 10 & Claims 16–18 | Claims 16–18, inventor signature of Alexander Graham Bell, and witness attestations of Jos. P. Livermore and Arthur Reynolds. |

---

## Editorial & Preservation Boundaries

### Root figure-QA hold (2026-08-20)

The public source face remains withheld pending a complete literal source-text repair. Direct review corrected the drawing inventory: page 1 prints Figs. 1–6; page 2 prints Figs. 3–17; page 3 repeats Fig. 10 and prints Figs. 18–24. The edition points Figs. 16–17 to one clean, upright source crop because those two views touch on the sheet, and Figs. 18–24 to individually reviewed upright crops. Earlier clipped, sideways, and misnumbered assets remain preserved as evidence and are not used by the edition. The reviewed ledger still contains extensive OCR corruption in the specification body, and the present edition contains editorial paraphrase rather than the complete literal prose. Neither is publication-ready. The current edition type cannot express an interim review state, so the enforceable fail-closed boundary is that the catalogue record intentionally remains unbound from both source artifacts.

- **Visitor Source Face**: `src/data/editions/bellPhotophoneEdition.ts`
- **Reviewed Ledger**: `public/patents/transcripts/us-235199-bell-photophone-reviewed.txt`
- **Crop Directory**: `public/patents/figures/us-235199-bell-photophone/` (source-derived previews covering Figs. 1–24; superseded revisions are preserved)
- **Printed Claims**: Exactly 18 claims printed in the Letters Patent.
- **Physics Kernel**: `src/physics/bellPhotophoneKernel.ts` (Optical irradiance $I_0$, voice diaphragm beam divergence modulation $\Omega(t)$, inverse-square beam transmission, parabolic collector flux concentration, selenium photoconductive resistance $R_{\text{se}}(E)$, and telephonic acoustic diaphragm velocity).
