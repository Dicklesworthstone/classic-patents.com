# Provenance Receipt — US 3,353,115 (Theodore H. Maiman — Ruby Laser System)

## 1. Source Identity

- **Catalogue ID**: `us-3353115-maiman-ruby-laser`
- **Patent Number**: `US 3,353,115`
- **Granted Title**: `RUBY LASER SYSTEM`
- **Inventor**: Theodore H. Maiman, Pacific Palisades, California
- **Assignee**: Hughes Aircraft Company, Culver City, California
- **Filing Date**: April 13, 1961 (Application Serial No. 102,698)
- **Grant Date**: November 14, 1967
- **Primary Public Record URL**: `https://patents.google.com/patent/US3353115A/en`
- **Pinned Local PDF**: `public/patents/pdfs/us-3353115-maiman-ruby-laser.pdf`
- **Local PDF Size**: 956,769 bytes
- **Local PDF SHA-256**: `3222cc08d6662719dba7566e07f96f3d1687dda40d6fe213ac9993ceb1ba03e6`
- **Total Facsimile Pages**: 10 pages (Sheets 1–5 of drawings: Figs 1–18; Columns 1–10 of text).
- **Rights Basis**: Public domain United States patent specification and official drawings.

---

## 2. Facsimile Map

| PDF Page | Facsimile Content | Audit Notes |
| :--- | :--- | :--- |
| **Page 1** | Drawing Sheet 1: FIGS. 1–3 | Energy-level diagram (FIG. 1); ruby rod, light pump, and output beam (FIG. 2); sunlight/lens/mirror optical pump (FIG. 3). |
| **Page 2** | Drawing Sheet 2: FIGS. 4–7 | Helical flash-tube pump (FIG. 4); hollow gas-filled pump (FIG. 5); fluorescein-separated flash tube (FIG. 6); its energy-level diagram (FIG. 7). |
| **Page 3** | Drawing Sheet 3: FIGS. 8–11 | Hollow-cylinder laser/coolant (FIG. 8); refrigerated rod (FIG. 9); uncoated segment rays (FIG. 10); coated segment rays (FIG. 11). |
| **Page 4** | Drawing Sheet 4: FIGS. 12–15 | High-index coolant (FIG. 12); prism/interferometer path (FIG. 13); and two plate interferometers (FIGS. 14–15). |
| **Page 5** | Drawing Sheet 5: FIGS. 16–18 | Parabolic pump reflectors (FIG. 16); elliptical pump reflector (FIG. 17); Colidar transmitter, receiver, and target (FIG. 18). |
| **Page 6** | Specification Column 1 & 2 | Heading, abstract, historical background, prior art microwave masers, optical maser challenge, summary of invention, drawing descriptions. |
| **Page 7** | Specification Column 3 & 4 | Detailed quantum mechanics of Cr3+ ions in sapphire lattice ($\text{Al}_2\text{O}_3$), nonradiative relaxation kinetics, 694.3 nm emission, threshold equation. |
| **Page 8** | Specification Column 5 & 6 | Helical xenon flashtube optical coupling, silvered Fabry-Perot end facets, transmission aperture, coherent beam generation mechanics. |
| **Page 9** | Specification Column 7 & 8 | Resonator variants, prism retroreflectors, mode discrimination, Colidar laser radar architecture and timing synchronization. |
| **Page 10** | Specification Column 9 & 10 | Summary of optical amplification, Claims 1 & 2, references cited, signatures. |

---

## 3. Preservation & Editorial Boundaries

1. **Facsimile Layer**: Pinned immutable PDF (`public/patents/pdfs/us-3353115-maiman-ruby-laser.pdf`) with SHA-256 `3222cc08d6662719dba7566e07f96f3d1687dda40d6fe213ac9993ceb1ba03e6`.
2. **Page-marked transcription candidate**: `public/patents/transcripts/us-3353115-maiman-ruby-laser-reviewed.txt` is preserved for comparison, but is not accepted as a reviewed ledger. Its drawing-sheet summaries conflict with the pinned facsimile.
3. **Held archival-edition candidate**: `src/data/editions/maimanRubyLaserEdition.ts` retains its typed blocks and dynamic claim lookup for repair work, but is not a published source face.
4. **Editorial & Engineering Face**: Complete mathematical and physical breakdown in `src/data/patents/maiman-ruby-laser.ts`, 2D simulator `MaimanRubyLaserSim.tsx`, and 3D WebGL studio `MaimanRubyLaser3D.tsx`.

## 4. Root Figure-QC Hold (2026-08-20)

Independent review rejected all five visitor-reachable preview files. The current assets are broad drawing-sheet regions: they include neighboring numbered figures, sheet headings, and signatures, and some paths do not show the numbered figure their filename claims. The canonical record therefore has no `archivalEdition` or `originalTextAsset` binding. The PDF, ledger, edition, and every existing crop remain preserved as comparison evidence pending a complete source-pixel recrop, exact occurrence-to-figure remapping, and independent acceptance.

Full facsimile review also found a deeper literal-source failure: Sheet 1 prints
FIG. 1 as an energy-level diagram and FIG. 2 as an optical-pumping schematic,
while the candidate ledger assigns unrelated descriptions to those figures. The
candidate edition's prose likewise cannot be accepted merely because its
figure-preview paths exist. The hold remains mandatory until a future editor
reconstructs the source face against all ten PDF pages.

## 5. Source-pixel figure-crop lineage (2026-08-21)

The held edition has five authored figure occurrences. Each points to a
versioned PNG rendered from the pinned PDF at 300 dpi, then cropped to the
printed figure and its reference numerals. Earlier assets are preserved. These
preview repairs do not lift the publication hold.

| Authored occurrence | PDF drawing page | Source-pixel crop | Dimensions | SHA-256 |
| :--- | :--- | :--- | :--- | :--- |
| `FIG. 1` | Page 1, Sheet 1 | `fig-1-source-crop-v2.png` | 1600 x 1100 | `798c14e708b1a4a339ddc742fba6b8766eb7f8b0040dca2d06942ac7a8439545` |
| `FIG. 2` | Page 1, Sheet 1 | `fig-2-source-crop-v2.png` | 1700 x 620 | `1ea50cb6c6d21b53f110c1c1e402a4323cb22530e1adddd73ed95268c0c55a6f` |
| `FIG. 4` | Page 2, Sheet 2 | `fig-4-source-crop-v2.png` | 1600 x 520 | `c057f56dbc137a3235b77bd674c60178da14f304ce0634b884ef08ba77ea6538` |
| `FIG. 7` — apparatus | Page 2, Sheet 2 | `fig-7-apparatus-source-crop-v4.png` | 1120 x 700 | `bb30cbd9d1907a49880c8f1ab3d9d501302874eb3d43685ff60007adc641c976` |
| `FIG. 7` — printed label | Page 2, Sheet 2 | `fig-7-label-source-crop-v4.png` | 300 x 300 | `265e8d7121970512588fb134897a2b9f922178e09d70dc663df10a771edd393e` |
| `FIG. 7` — upper-right labels | Page 2, Sheet 2 | `fig-7-right-labels-source-crop-v4.png` | 550 x 480 | `34a83a0bb1ae8b9fd9e9edd755e1e2722289fc5dfabef89bc4243faa9726ba99` |
| `FIG. 7` — lower-right ruby path | Page 2, Sheet 2 | `fig-7-right-path-source-crop-v4.png` | 380 x 450 | `75ac1b3f49cde5ec416ac8ae870d39491e3f9eb06e2759322c17b6831eeee3e9` |
| `FIG. 18` — transmitter/receiver apparatus | Page 5, Sheet 5 | `fig-18-apparatus-source-crop-v4.png` | 1150 x 1200 | `1f396c6a3e80db1b17ca0bbdbc75dc3de16cca4da7309fac94f834b9ed7ef6a5` |
| `FIG. 18` — output beam and target 212 | Page 5, Sheet 5 | `fig-18-output-source-crop-v4.png` | 900 x 600 | `c7ac6eabd4e14368a0be7818051e4e1104d10782d51ea271e6bd2663a56547e6` |

The full source drawing inventory is Figs. 1–3 on Sheet 1, Figs. 4–7 on
Sheet 2, Figs. 8–11 on Sheet 3, Figs. 12–15 on Sheet 4, and Figs. 16–18 on
Sheet 5. The present held edition has no authored preview occurrences for the
remaining figures. A future literal edition must add them at the specific
source citations rather than infer links during rendering.

On the source sheets, the FIG. 7 label overlaps the signature horizontally and
the FIG. 18 apparatus, output/target detail, and label are spatially separated.
Each FIG. 7 and FIG. 18 authored occurrence therefore carries multiple honest
rectangular source-pixel previews: four signature-free FIG. 7 views (main
apparatus, printed label, upper-right energy labels, and lower-right ruby path)
and two FIG. 18 views (apparatus plus output/target detail with the printed
FIG. 18 label). No pixels were masked, composited, or reconstructed. The
previous v2/v3 assets and an unused broad FIG. 7 v4 candidate remain preserved
but are not referenced. Root visual acceptance remains required before any
publication binding is restored.
