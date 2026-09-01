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
- **Page Count**: 48 pages (1 Title/Abstract sheet, 23 Drawing sheets [34 figures], 24 Specification/Claims sheets [Columns 1–44, 54 Claims])
- **Rights Basis**: Historical United States patent document; text, claims, and figures are public-domain official government records.

## Facsimile Map
| PDF Page | Sheet Label | Description / Content Checked |
|---|---|---|
| Page 1 | Title Page | Grant masthead, inventors, assignee, abstract, classification (US 180/7.1, 180/8.2, 180/65.1), 54 claims indicator, foreign and US references, Vos MIT dynamic unicycle citations. |
| Pages 2–24 | Sheets 1–23 | FIGS. 1 through 32 (FIG. 1 4-wheel mode; FIG. 2 2-wheel balance mode; FIG. 3 stair-climbing sequence; FIG. 4 cluster drive; FIG. 5 inverted pendulum control loop; FIG. 6 pitch rate gyro sensor; FIGS. 7–32 control state machines and stair kinematics). |
| Pages 25–48 | Columns 1–44 | Full specification: Technical Field, Background, Summary of the Invention, Detailed Description of Preferred Embodiments, Dynamic Balancing Control Algorithms, Inverted Pendulum equations, and Claims 1 through 54. |

## Editorial & Preservation Boundaries
- **Public Source Face**: Hand-authored continuous archival edition at `src/data/editions/kamenTransporterEdition.ts`.
- **Reviewed Comparison Ledger**: `public/patents/transcripts/us-5701965-kamen-transporter-reviewed.txt`.
- **Figure Crops**: Stored under `public/patents/figures/us-5701965-kamen-transporter/` (`fig-1` to `fig-6`).
- **Claim Count**: Exactly 54 claims as printed in the official patent grant.
- **Physical SI Kernel**: `src/physics/kamenTransporterKernel.ts` (inverted pendulum pitch stabilization $\tau = K_p \theta + K_d \dot{\theta} + K_i \int \theta dt$, cluster planetary gear ratio, dynamic center-of-gravity elevation).
