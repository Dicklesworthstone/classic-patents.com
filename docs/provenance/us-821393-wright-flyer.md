# Provenance receipt: US 821,393, Orville Wright and Wilbur Wright

## Source identity

- Catalogue id: `us-821393-wright-flyer`
- Granted title: *Flying-Machine*
- Inventors as printed: Orville Wright and Wilbur Wright, of Dayton, Ohio
- Grant date: 1906-05-22
- Filing date: 1903-03-23
- Primary public record: https://patents.google.com/patent/US821393A/en
- Local immutable facsimile: `public/patents/pdfs/us-821393-wright-flyer.pdf`
- Retrieval and full-facsimile review date: 2026-08-18
- Rights basis: a United States patent granted in 1906; its historical text and
  drawings are public-domain United States Government material.
- SHA-256: `678bea5d81cb4e90a15c998bc932d2cf01bc87cfc3fcc53f0ecbdbdc70097966`
- PDF page count: 10

## Facsimile map and comparison record

The pinned ten-page PDF was visually reviewed at 300 DPI. The public source
face is deliberately continuous, so it does not impose these scan-page breaks
on a reader. They are retained here to make the editorial comparison
reproducible.

| Facsimile locator | Content checked |
| --- | --- |
| PDF p. 1 | Drawing sheet 1 of 3: `FIG. 1`, the perspective view; Patent No. 821,393; the 23 March 1903 application line; the 22 May 1906 grant line; witness names William H. Bauer and Ernie Huller; inventors Orville and Wilbur Wright; H. A. Toulmin, attorney. |
| PDF p. 2 | Drawing sheet 2 of 3: `FIG. 2`, the plan view, with the same patent, application, grant, witness, inventor, and attorney matter. |
| PDF p. 3 | Drawing sheet 3 of 3: `FIGS. 3, 4, and 5`, respectively the side elevation and two flexible-joint details, with the same printed identification and signature matter. |
| PDF p. 4 | Patent Office masthead and formal preamble; the statement of the apparatus and its control objective; the figure list; the opening account of the aeroplane frame and fabric. |
| PDF p. 5 | Completion of the cloth construction; standards, flexible joints, stay-wires, ropes, and cradle; opening account of warping the lateral margins. |
| PDF p. 6 | Completion of the wing-warping description; lateral balance; the vertical rear rudder, its supports, and its connection to the cradle. |
| PDF p. 7 | Completion of the vertical-rudder account; forward struts and skids; the front horizontal rudder; its flexible ribs, springs, rollers, and links. |
| PDF p. 8 | Completion of the front-rudder account; the definition of `aeroplane`; the non-limitation paragraph; claims 1 through 3. |
| PDF p. 9 | Claims 3 through 11. |
| PDF p. 10 | Claims 11 through 18; Orville Wright and Wilbur Wright signature lines; witnesses Chas. E. Taylor and E. Earle Forrer. |

## Editorial and preservation boundaries

- `src/data/editions/wrightFlyerEdition.ts` is the complete visitor-facing
  source face. Its prose, claims, glossary annotations, and figure references
  are individually authored typed React nodes. It does not render OCR, a PDF
  text layer, generated HTML, or a page-by-page scan transcription.
- Each figure reference in the edition points to a local crop in
  `public/patents/figures/` taken from the pinned drawing sheets. `Fig. 1`
  and `Fig. 2` use their respective sheets; `Figs. 3, 4, and 5` use sheet 3.
- The legacy source-text asset is retained as research evidence only. It is
  not a reviewed transcription and must never be used as a substitute for the
  authored edition or promoted merely because it has page markers.
- `public/patents/transcripts/us-821393-wright-flyer-reviewed.txt` is the
  review ledger for this edition. It records all ten facsimile pages, while
  the visitor-facing React edition deliberately remains continuous.
- The source contains eighteen printed claims. The manual edition preserves
  the ordered set, including the final two rope-and-rudder combinations; no
  claim is compressed into a summary or silently omitted.

## Wright source-crop audit and repair ledger (2026-08-21)

The pinned source is the ten-page PDF above, SHA-256
`678bea5d81cb4e90a15c998bc932d2cf01bc87cfc3fcc53f0ecbdbdc70097966`. Existing
source raster artifacts are the prior `artifacts/ocr_raster_cache/us-821393-wright-flyer/page-{1..10}.png`
assets; no local OCR or fresh PDF rendering was used. The five currently
served previews were visually compared with the drawing sheets before repair:

| Figure | Served asset (dimensions; SHA-256) | Audit finding | New-path plan |
| ---: | --- | --- | --- |
| 1 | `fig-1-preview.png` (2160×1800; `067380991840ea0e08e3e733c4fa6df31691f040a80b8bfb37f8e207b408240d`) | Page-edge witness/signature furniture remains; source figure is sideways relative to a left-to-right printed label. | `fig-1-preview-v2.png`; rotate source pixels upright and isolate the full airframe, label, leaders, and numerals. |
| 2 | `fig-2-preview.png` (2150×1680; `e782ce3b293c0eeec3b4927117b8cc0ff786099f9da7f881f21ab7097e93cec2`) | Page-edge furniture remains; source figure is sideways relative to a left-to-right printed label. | `fig-2-preview-v2.png`; source-aware upright crop. |
| 3 | `fig-3-preview.png` (1780×890; `cc868bea22fc3115f9107112ff34b41cd5846adb770cf48da1913693fe3b376c`) | A clipped neighboring drawing is visible at the lower edge. | `fig-3-preview-v2.png`; tighten the sheet-3 rectangle and rotate upright. |
| 4 | `fig-4-preview.png` (670×760; `1781d550c4ca4760860fa411076a8920451ac939db91f6c4c0d08a87c8840a6c`) | Target is clipped and neighboring drawing fragments remain. | `fig-4-preview-v2.png`; use an isolated sheet-3 rectangle, preserving the complete detail and label. |
| 5 | `fig-5-preview.png` (1010×850; `b452722d00c65203ae2eb07ca6c59926274a91c13b1ea5820131f2d88e5e7d98`) | Target is clipped and sideways; neighboring sheet matter is present. | `fig-5-preview-v2.png`; rotate source pixels upright and retain the complete joint detail, leaders, and numerals. |

All five old assets remain preserved. New v2 paths are leased but not yet
generated because the mandatory host-load gate is currently holding local crop
generation. The edition/test/provenance leases are IDs 21760–21762 and the
new preview leases are IDs 21763–21767. No edition mapping has changed yet;
the temporary Wright QA hold remains in force until root independently accepts
the visually rechecked v2 previews.

### v2 generation attempts held for rejection

The following v2 bytes were generated from the existing raster artifacts only
after fresh 1-minute load checks below 10. They remain preserved candidates and
are not mapped by the edition:

| Figure | Source rectangle and operation | Candidate bytes | Independent visual result |
| ---: | --- | --- | --- |
| 1 | p1 raster `x=500..1810, y=700..2720`, clockwise 90-degree rotation | `fig-1-preview-v2.png`, 2020x1310, SHA-256 `96adc53a8038768ef36a86c074232b6cfc403433d8e2304d353e453b118f6f07` | REJECTED: upright label, but left target edge is clipped and a witness/signature sliver remains at the far left. |
| 2 | p2 raster `x=100..1960, y=700..2700`, clockwise 90-degree rotation | `fig-2-preview-v2.png`, 2000x1860, SHA-256 `159a34f7d092eee2a21758bdc38f25ffce57c5205cbd04ad0072d5cb944b8f6f` | REJECTED: upright label, but left target edge and lower front-rudder continuation are clipped. |
| 3 | p3 raster `x=380..1120, y=700..2560`, clockwise 90-degree rotation | `fig-3-preview-v2.png`, 1860x740, SHA-256 `d2ebd5dcd1d1fba04a1f0f9d253b4fc4293bf06a3f2b1926c48168d5db9735ce` | REJECTED: upright label, but the left/front target continuation is clipped at the crop edge. |
| 4 | p3 raster `x=1100..1920, y=1730..2580`, clockwise 90-degree rotation | `fig-4-preview-v2.png`, 850x820, SHA-256 `9269a97fd020f8acc364c208eb9337c6aacf6ca5ff9e98de317ad577722af350` | REJECTED: complete central joint is visible, but clipped neighboring matter remains at the top and right edges. |
| 5 | p3 raster `x=1100..1930, y=700..1700`, clockwise 90-degree rotation | `fig-5-preview-v2.png`, 1000x830, SHA-256 `9035f13cd42d41afbece85de6bf0557aed95117b00115b1fe12162edb046bdc0` | REJECTED: target and printed label are clipped at the left/top edges; neighboring marks remain. |

These rejected candidates are retained for audit and must not be overwritten;
new source rectangles require new versioned paths with durable leases. Figs. 3,
4, and 5 have not yet been generated. The edition remains on the old served
paths and the Wright QA hold remains active.

### v3 generation attempts held for rejection

The first v3 replacements were also generated only under fresh sub-10 load
checks and remain unmapped pending new source-aware rectangles:

| Figure | Source rectangle and operation | Candidate bytes | Independent visual result |
| ---: | --- | --- | --- |
| 1 | p1 raster `x=450..1850, y=650..2750`, clockwise 90-degree rotation | `fig-1-preview-v3.png`, 2100x1400, SHA-256 `3ad72c4fd417a5b46e8fe03aab193441fa8b7b1340090b0e19364c87787d64e0` | REJECTED: target is upright but witness/signature matter remains at left and sheet identification matter remains at right. |
| 2 | p2 raster `x=50..2000, y=650..2750`, clockwise 90-degree rotation | `fig-2-preview-v3.png`, 2100x1950, SHA-256 `2c49b410fd6d43b14b185433ecd7a7df1187f13626e69405d08f248392384ece` | REJECTED: target is upright and largely complete, but `3 SHEETS—SHEET 2` remains at right edge; retain and recrop to a new version. |
| 3 | p3 raster `x=250..1150, y=650..2600`, clockwise 90-degree rotation | `fig-3-preview-v3.png`, 1950x900, SHA-256 `03bd089a96b3973e0ff4641cf59a9fbc97a8d08c61efaed27f41e56a873501e3` | REJECTED: target is upright and complete, but a clipped neighboring Fig. 4 label/mark remains at the bottom edge. |
| 4 | p3 raster `x=1080..1950, y=1700..2600`, clockwise 90-degree rotation | `fig-4-preview-v3.png`, 900x870, SHA-256 `f7a78fc2d6fdcbbf973db8c46de8744d47bf00d37091fdcd92d88615b6655a16` | REJECTED: target and label are complete, but neighboring labels/marks remain at top and right edges. |
| 5 | p3 raster `x=1050..1950, y=650..1800`, clockwise 90-degree rotation | `fig-5-preview-v3.png`, 1150x900, SHA-256 `151292d09a7dc2662349d0c1818322a57d97722b8ca99c51fa81cc46dbd83648` | REJECTED: target and label are complete, but upper reference marks and `3 SHEETS—SHEET 3` remain at the right edge. |

The first v4 trims were also held rather than mapped: Fig2 `fig-2-preview-v4.png`
(1980x1950, SHA-256 `a27836e60aad9f37a56f7f830545a014856f8b236d846ff985760670e00d9c83`)
still clips the plan-view right edge; Fig3 `fig-3-preview-v4.png` (1950x900,
SHA-256 `accdf75a470212bdb94abd26a76d6a1220bb5d8b7691b4ff3c87934182b16f7c`)
still retains a clipped neighboring label at the bottom. Both remain preserved.
