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
| 1 | Drawing sheet, Figs. 1–5; witness signatures; inventor assignment signature | `public/patents/figures/us-1102653-goddard-rocket/sheet-1-1.png`, a full 2320 × 3408 direct raster of this pinned page. Every active figure reference opens this complete sheet. |
| 2 | Masthead; purpose; energy-conversion discussion; Figs. 1–5 description; primary combustion chamber 10, tapered tube 11, disks 12; initial spin charges 15–20 | transcript page 2; manual-edition blocks 2–14 |
| 3 | Launch frame 21–23; firing tube 24 and auxiliary rocket 25–28; auxiliary spin restoration 29–32; camera/gyroscope 33–45; alternative arrangements and operating sequence | transcript page 3; manual-edition blocks 15–22 |
| 4 | Completion of operating sequence, closing scope language, claims 1–8, signature and witnesses | transcript page 4; manual-edition blocks 23–35 |

Figure captions are transcribed in the source edition's drawing-description paragraph (block 10): Fig. 1 is the longitudinal partly sectional whole apparatus; Fig. 2 is the enlarged head section; Figs. 3 and 4 are the indicated transverse sections; Fig. 5 is the reduced-scale firing framework. Every inline figure reference points to the same complete, unaltered page-1 source sheet, not to a reconstructed diagram or a selectively framed crop.

## 2026-09-04 direct source-sheet figure review

Direct visual review at the source's native 300 DPI confirms that PDF page 1 contains the complete drawing sheet: Figs. 1–5, their shared leaders and labels, the firing framework, witnesses, and inventor signature. The old individual crops are preserved for historical auditability but are no longer public-source evidence. They were fragile because figure edges and shared leaders make a narrow crop easy to misframe. The active edition instead binds each of its eleven authored figure-reference occurrences to one unaltered full-page raster. Its dimensions and SHA-256 are pinned by `goddardRocketEdition.test.ts`.

| Active figure-reference occurrences | Direct source-sheet asset | Source PDF page | PNG dimensions | SHA-256 |
| --- | --- | --- | --- | --- |
| `Figs. 1 through 5`, `Figure 1`, `Fig. 2` (twice), `Figs. 3 and 4`, `Fig. 5` (twice), `Fig. 1` (twice), `Fig. 3` (twice) | `public/patents/figures/us-1102653-goddard-rocket/sheet-1-1.png` | 1 | 2320 × 3408 | `65f586e211296f66aacd648922ce102b0804d280de2d4a4e4f31237b3774c0ed` |

The reviewed ledger and manual edition remain distinct comparison layers. The canonical record binds both as its source-reading materials; strict archival-audit disposition is editorial metadata and must never remove a visitor's access to the full patent text.

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
