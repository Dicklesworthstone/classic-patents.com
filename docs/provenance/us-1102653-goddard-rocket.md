# Provenance receipt: US 1,102,653 — Rocket Apparatus

## Identity and immutable facsimile

- Canonical record id: `us-1102653-goddard-rocket`
- Grant: **US 1,102,653**, “Rocket Apparatus,” Robert H. Goddard of Worcester, Massachusetts.
- Application filed: 1913-10-01; patent granted: 1914-07-07; serial no. 792,707.
- Reviewed local facsimile: [`public/patents/pdfs/us-1102653-goddard-rocket.pdf`](../../public/patents/pdfs/us-1102653-goddard-rocket.pdf)
- Public source URL: <https://patentimages.storage.googleapis.com/pdfs/US1102653.pdf>
- Retrieval/review date: 2026-08-17.
- Rights basis: United States patent publication, issued in 1914; public-domain government publication in the United States.
- SHA-256: `8503f52914f4201850d7d6f067ac48886dda77c2cdb5e8fce831e13232f7c42b`
- PDF page count: 4 (`pdfinfo` reviewed).

The served PDF is the local file above. The pre-existing, wrong US 1,155,986 Zemlo Paper Box PDF and its related artifacts were retained untouched and are not a source for this record.

## Layer separation

- **Facsimile:** the pinned four-page PDF, including drawing sheet and three printed specification pages.
- **Reviewed transcript:** [`public/patents/transcripts/us-1102653-goddard-rocket.txt`](../../public/patents/transcripts/us-1102653-goddard-rocket.txt), hand-reviewed against the facsimile, with four ordered `REVIEWED TRANSCRIPTION` ledger markers.
- **Manual source edition:** `src/data/editions/goddardRocketEdition.ts`; explicitly typed React source nodes, not an OCR, PDF text layer, HTML conversion, or Markdown conversion.
- **Editorial engineering reading:** `src/data/patents/goddard-rocket.ts`, kept separate from the exact specification and claims.

No OCR output was used as published text for this record.

## Page and figure ledger

| Facsimile page | Content | Published local crop / locator |
| --- | --- | --- |
| 1 | Drawing sheet, Figs. 1–5; witnesses C. F. Hixon and C. C. Hartnett; inventor signature | Versioned, isolated source crops listed below; the legacy flat previews are preserved but are not linked by the repaired edition. |
| 2 | Masthead; purpose; energy-conversion discussion; Figs. 1–5 description; primary combustion chamber 10, tapered tube 11, disks 12; initial spin charges 15–20 | transcript page 2; manual-edition blocks 2–14 |
| 3 | Launch frame 21–23; firing tube 24 and auxiliary rocket 25–28; auxiliary spin restoration 29–32; camera/gyroscope 33–45; alternative arrangements and operating sequence | transcript page 3; manual-edition blocks 15–22 |
| 4 | Completion of operating sequence, closing scope language, claims 1–8, signature and witnesses | transcript page 4; manual-edition blocks 23–35 |

Figure captions are transcribed in the source edition's drawing-description paragraph (block 10): Fig. 1 is the longitudinal partly sectional whole apparatus; Fig. 2 is the enlarged head section; Figs. 3 and 4 are the indicated transverse sections; Fig. 5 is the reduced-scale firing framework. Every inline figure reference points to a crop made from facsimile page 1, not to a reconstructed diagram.

## 2026-08-20 figure-crop repair and publication hold

Independent visual QC rejected the retained v3/v4 individual crops: Fig. 1 v4 clipped the drawing at the left, top, and bottom; Figs. 3–5 v3 clipped labels, leaders, or apparatus. The first v5 grouped crop also clipped Fig. 5's support struts and bottom context; v6 preserved that context but was too broad for a visitor preview. Those files remain preserved but are no longer referenced. A 300 dpi render of pinned PDF page 1 supplies the v5 Fig. 2 crop and the target-specific v7 assets. Figs. 1, 2, 4, and 5 use their narrowest complete unaltered rectangles. Fig. 3 uses the narrowest honest adjacency group because its leaders physically interleave with the surrounding section views; the group retains those neighboring source edges rather than clipping or redrawing them. The Fig. 5 crop is centered to keep witnesses and inventor-signature material outside its frame. Coordinates below are pixel coordinates in the 2320 × 3408 page-1 render; dimensions and SHA-256 values are pinned by `goddardRocketEdition.test.ts`.

| Figure reference | Versioned source crop | Render rectangle (x, y, width, height) | PNG dimensions | SHA-256 |
| --- | --- | --- | --- | --- |
| Fig. 1 | `public/patents/figures/us-1102653-goddard-rocket-fig-1-source-crop-v8.png` | `(1180, 650, 720, 2160)` | 720 × 2160 | `77d43e7f37d6f89037510a44fbbd7c9b449ad999c3f7a1bb739177bda3b491ee` |
| Fig. 2 | `public/patents/figures/us-1102653-goddard-rocket-fig-2-source-crop-v5.png` | `(150, 670, 1050, 920)` | 1050 × 920 | `18292325c5c392c25b0afd75cbad453b63b352ce2dffc6e32f20a7383d2ebbf6` |
| Fig. 3 | `public/patents/figures/us-1102653-goddard-rocket-fig-3-source-crop-v8.png` | `(650, 1640, 650, 640)` | 650 × 640 | `e759f032d871373a9f9d24baf268ed41a50802e5e93a8b4f3e1f560f163e2e06` |
| Fig. 4 | `public/patents/figures/us-1102653-goddard-rocket-fig-4-source-crop-v7.png` | `(100, 1640, 620, 620)` | 620 × 620 | `918e9bf70957b76b2e774b5e1c7582987c7938c582a117adf2abe2e51ecd5b95` |
| Fig. 5 | `public/patents/figures/us-1102653-goddard-rocket-fig-5-source-crop-v8.png` | `(560, 2250, 740, 850)` | 740 × 850 | `1c83557e8cedfe583fb5c7cdaa43721f4fd1e03adcc83454fec9669b866e08a9` |

The retained ledger and manual edition are local comparison evidence only during this repair. The canonical record deliberately does not bind `originalTextAsset` or `archivalEdition`; publication remains withheld for an independent reviewer to inspect the facsimile, crops, mappings, and evidence closure.

## Claim ledger

All eight printed claims occur on facsimile page 4, transcript page 4, and manual-edition blocks 26–33. Their canonical `originalText` fields are derived directly from those typed manual claim nodes.

| Claim | Exact source locator | Subject retained in decoder |
| --- | --- | --- |
| 1 | PDF p. 4, manual block 26 | primary chamber and firing tube; secondary rocket; firing after primary explosive is substantially consumed |
| 2 | PDF p. 4, manual block 27 | explosive chamber; rearward tapered truncated-cone tube; at least three longest diameters |
| 3 | PDF p. 4, manual block 28 | primary firing tube; secondary rocket; initial and maintained rotation |
| 4 | PDF p. 4, manual block 29 | backward-curved radial transverse tubes; explosive; embedded heating elements; simultaneous firing |
| 5 | PDF p. 4, manual block 30 | initial rotation; propelling explosive; curved tube explosive; predetermined-consumption firing; restored spin |
| 6 | PDF p. 4, manual block 31 | combustion chamber; apparatus head/support; rocket rotation; prevention of support rotation |
| 7 | PDF p. 4, manual block 32 | pivoted support and gyroscope restraining rotation with the head |
| 8 | PDF p. 4, manual block 33 | head; pivoted support; gyroscope; high initial rotational speed |

## Review observations and boundaries

The source describes solid explosive disks and an elongated tapered tube. It does **not** describe liquid oxygen, gasoline, pumps, regenerative cooling, a converging-diverging de Laval nozzle, a numerical Mach value, or separation latches that drop an exhausted stage. The auxiliary rocket is fired from tube 24 after the main propelling charge is substantially consumed. Those distinctions are preserved in the canonical explanation and all eight claim decoders.

The source calls its form “preferred” and expressly allows an optional parachute, possible third and later rockets, and an alternative in which the head is directly attached to casing 13 with the auxiliary rocket omitted. Those alternative arrangements are retained in the transcript, edition, and parallel reading.
