# Provenance Receipt: US 5,701,965 (Dean Kamen — Human Transporter)

## Source Identity
- **Catalogue ID**: `us-5701965-kamen-transporter`
- **Patent Number**: `US 5,701,965`
- **Granted Title**: `Human Transporter`
- **Inventors as Printed**: `Dean L. Kamen, Robert R. Ambrogi, Robert J. Duggan, Richard K. Heinzmann, Brian R. Key, Andrzej Skoskiewicz, Phyllis K. Kristal`
- **Assignee**: `Deka Products Limited Partnership, Manchester, N.H.`
- **Grant Date**: `1997-12-30`
- **Filing Date**: `1994-05-27` (Application Serial No. `08/250,693`)
- **Primary Public-Record URL**: `https://patents.google.com/patent/US5701965A/en`
- **Local Pinned PDF**: `public/patents/pdfs/us-5701965-kamen-transporter.pdf`
- **Source SHA-256**: `b1dac639b2b9905914433d27fd9b6cad82382239bc291d10ca3e1ac1ffe05f65`
- **Page Count**: 48 pages (Pages 1–2 bibliographic data & cited references; Pages 3–36 drawing sheets 1–34; Pages 37–48 specification columns 1–24, 54 Claims).
- **Rights Basis**: Historical United States patent document; text, claims, and figures are public-domain official government records.

---

## Facsimile Map

| PDF Page | Sheet Label | Description / Content Checked |
|---|---|---|
| **1** | Title Page | Grant masthead, inventors, assignee, abstract, classification, 54 claims indicator, foreign references, Vos MIT dynamic unicycle citations. |
| **2** | Page 2 | References cited continuation. |
| **3** | Sheet 1 of 34 (FIG. 1) | Perspective view of simplified human transporter in seated four-wheel configuration. |
| **4** | Sheet 2 of 34 (FIG. 2) | Perspective view showing dynamic two-wheel balance mode at standing height. |
| **5** | Sheet 3 of 34 (FIG. 3) | Schematic view showing swivel arrangement and four-wheel support. |
| **6** | Sheet 4 of 34 (FIG. 4) | Side elevation of the transporter ascending stairs. |
| **7** | Sheet 5 of 34 (FIG. 5) | Block diagram of power and closed-loop control system. |
| **8** | Sheet 6 of 34 (FIG. 6) | Control strategy block diagram for dynamic wheel-torque balancing. |
| **9–36** | Sheets 7–34 (FIGS. 7–45) | Detailed diagrams for cluster mechanics, joystick control, microcontroller architecture, sensor filtering, and stair climbing kinematics. |
| **37** | Col. 1–2 | Title, Technical Field, Background Art, Summary of the Invention, Brief Description of Drawings (FIGS. 1–37). |
| **38** | Col. 3–4 | Brief Description of Drawings (FIGS. 38–45), Detailed Description of Specific Embodiments opening. |
| **39** | Col. 5–6 | Detailed Description: ground-contacting members, dynamic balance, and cluster rotation. |
| **40** | Col. 7–8 | Detailed Description: two-wheel balancing mode, sensor fusion, rate gyroscopes, and accelerometers. |
| **41** | Col. 9–10 | Detailed Description: stair climbing state machine, riser alignment, and weight transfer. |
| **42** | Col. 11–12 | Detailed Description: microcontroller architecture, peripheral bus communications, and motor drives. |
| **43** | Col. 13–14 | Detailed Description: mathematical coordinate transformations, angle variables, and kinematic parameters. |
| **44** | Col. 15–16 | Detailed Description: pitch rate compensation, differentiator loops, and cluster torque feedback. |
| **45** | Col. 17–18 | Detailed Description: reset angle sequence, analog/digital hybrid control, and opening of claims. |
| **46** | Col. 19–20 | Claims 1 through 20 (Independent Claim 1: inverted-pendulum personal mobility transporter). |
| **47** | Col. 21–22 | Claims 21 through 48 (Cluster control, coordination modes, joystick/lean transducers). |
| **48** | Col. 23–24 | Claims 49 through 54 (Independent Claim 49: payload transporter; closing signatures). |

---

## Editorial & Preservation Boundaries

- **Public Source Face**: Hand-authored continuous archival edition at `src/data/editions/kamenTransporterEdition.ts`.
- **Reviewed Comparison Ledger**: `public/patents/transcripts/us-5701965-kamen-transporter-reviewed.txt`.
- **Figure Crops**: Stored under `public/patents/figures/us-5701965-kamen-transporter/` (`fig-1-source-crop-v1.png` to `fig-6-source-crop-v1.png`).
- **Claim Count**: Exactly 54 printed claims as printed in the official patent grant (Independent Claims 1, 49; 52 dependent claims).
- **Physical SI Kernel**: `src/physics/kamenTransporterKernel.ts` (inverted pendulum pitch stabilization $\tau = K_p \theta + K_d \dot{\theta} + K_i \int \theta dt$, cluster planetary gear ratio, dynamic center-of-gravity elevation).

---

## Figure Crop Review and Preservation Boundary

1. **Facsimile-crop basis**: Drawing crops are isolated directly from the pinned facsimile raster (`1440 x 2040` pixels).
2. **Crop Registry**:
   - `fig-1-source-crop-v1.png`: PDF Page 3 (Sheet 1 of 34, FIG. 1), pixel box `[x: 63, y: 43, w: 1306, h: 1363]`, SHA-256 `c0320ac3f49889e2de341c809290862b6eb870f26c144cbe91b8ac6c9a0ece31`.
   - `fig-2-source-crop-v1.png`: PDF Page 4 (Sheet 2 of 34, FIG. 2), pixel box `[x: 65, y: 28, w: 1287, h: 1903]`, SHA-256 `97a861973a47a8a32c3f857c55f81433e6214172cf0eb9b049bcd2c3fff941f1`.
   - `fig-3-source-crop-v1.png`: PDF Page 5 (Sheet 3 of 34, FIG. 3), pixel box `[x: 63, y: 28, w: 1289, h: 1908]`, SHA-256 `13b7d8a8cd1d6e08d560969f0315b6298ccc3fc6f7f3de33bc069c3fd8d2f4e9`.
   - `fig-4-source-crop-v1.png`: PDF Page 6 (Sheet 4 of 34, FIG. 4), pixel box `[x: 39, y: 26, w: 1313, h: 1627]`, SHA-256 `14d5e6c123e38e9be8e60348a3a9bb01e360d055f626e54364d4207d3c3c3dcc`.
   - `fig-5-source-crop-v1.png`: PDF Page 7 (Sheet 5 of 34, FIG. 5), pixel box `[x: 63, y: 26, w: 1295, h: 1992]`, SHA-256 `80e3f1c62115e9bc8a3933129368738ba448e3fb92e4049e3561f36c2c8af088`.
   - `fig-6-source-crop-v1.png`: PDF Page 8 (Sheet 6 of 34, FIG. 6), pixel box `[x: 63, y: 26, w: 1287, h: 1554]`, SHA-256 `6249b25a76cf598950da4bb32fa90cc618e7a78c301f838a12d49637161d8c1a`.
3. **Acceptance Status**: Evaluated as `accepted` with 11 edition occurrences bound to verified source locators under `FIGURE_OCCURRENCE_SOURCE_LOCATORS`.
