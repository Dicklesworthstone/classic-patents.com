# Provenance Receipt: US 4,098,001 (Paul C. Watson — Remote Center Compliance System)

## Source Identity
- **Catalogue ID**: `us-4098001-watson-rcc`
- **Patent Number**: `US 4,098,001`
- **Granted Title**: `Remote Center Compliance System`
- **Inventors as Printed**: `Paul C. Watson, Arlington, Mass.`
- **Assignee**: `The Charles Stark Draper Laboratory, Inc., Cambridge, Mass.`
- **Grant Date**: `1978-07-04`
- **Filing Date**: `1976-10-13` (Application Serial No. `732,286`)
- **Primary Public-Record URL**: `https://patents.google.com/patent/US4098001A/en`
- **Local Pinned PDF**: `public/patents/pdfs/us-4098001-watson-rcc.pdf`
- **Source SHA-256**: `67ca409f96f1456b603f198653a1a5d9c411c25dab5737ac2824b7fdaff2093b`
- **Page Count**: 8 pages (1 Title/Abstract sheet, 3 Drawing sheets [15 numbered figures], 4 Specification/Claims sheets [Columns 1–8, 2 Claims])
- **Rights Basis**: Historical United States patent document; text, claims, and figures are public-domain official government records.

## Facsimile Map
| PDF Page | Sheet Label | Description / Content Checked |
|---|---|---|
| Page 1 | Title Page | Grant masthead, inventor and assignee, application No. 732,286, abstract, classifications (Int. Cl. G01B 5/25; U.S. Cl. 33/169 C, 33/185 R, 33/189), “2 Claims, 15 Drawing Figures,” and the front-page sectional Fig. 1. |
| Page 2 | Sheet 1 of 3 | Figs. 1, 2, 3, 4, 4A, and 5; remote center 50, the plate/ring architecture, and insertion diagrams. |
| Page 3 | Sheet 2 of 3 | Figs. 5A, 6, 7, 8, and 9; the compliant condition, alternate architecture, anti-twist bellows, bearing, and flexure arrangements. |
| Page 4 | Sheet 3 of 3 | Figs. 10, 11, 11A, and 12; concatenated mechanisms, a flexure hub, and the alternative conical structure. |
| Page 5 | Specification pp. 1–2 | Field, background, summary, figure list through Fig. 8, and opening preferred embodiment. |
| Page 6 | Specification pp. 3–4 | Fig. 9/10 notices, rotational and translational elements, Fig. 1 anatomy, remote-center geometry, and insertion/rotation behavior. |
| Page 7 | Specification pp. 5–6 | Alternate embodiments, Fig. 7 anti-twist bellows, bearing/spring alternatives, Fig. 10 concatenation, and the start of claim 1. |
| Page 8 | Specification pp. 7–8 | The remainder of claim 1 and claim 2, including the torque-resistant means. |

## Editorial & Preservation Boundaries
- **Public Source Face**: Hand-authored continuous archival edition at `src/data/editions/watsonRccEdition.ts`.
- **Reviewed Comparison Ledger**: `public/patents/transcripts/us-4098001-watson-rcc-reviewed.txt`.
- **Figure Crops**: All 15 printed figure labels are represented under `public/patents/figures/us-4098001-watson-rcc/` (`fig-1` through `fig-12`, including `fig-4a`, `fig-5a`, and `fig-11a`).
- **Claim Count**: Exactly 2 printed claims (Claim 1 independent, Claim 2 dependent).
- **Source-bounded exhibit kernel**: `src/physics/watsonRemoteCenterComplianceKernel.ts` reports normalized connected geometry and explicitly refuses SI contact dynamics because the grant supplies no dimensions, material, stiffness, load, clearance, friction, mass, or timing inputs. The older `watsonRccKernel.ts` is not a published physics path.
