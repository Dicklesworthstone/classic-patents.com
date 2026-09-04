# Provenance receipt: US 2,495,429 — Method of Treating Foodstuffs

## Pinned facsimile

- Catalogue id: `us-2495429-spencer-microwave`
- Grant: **US 2,495,429**, “Method of Treating Foodstuffs,” Percy L. Spencer of West Newton, Massachusetts, assigned to Raytheon Manufacturing Company of Newton, Massachusetts.
- Application filed: 1945-10-08; patent granted: 1950-01-24; serial no. 620,919.
- Local immutable facsimile: [`public/patents/pdfs/us-2495429-spencer-microwave.pdf`](../../public/patents/pdfs/us-2495429-spencer-microwave.pdf)
- Stable public record: <https://patents.google.com/patent/US2495429A/en>
- Retrieval and direct review date: 2026-08-18.
- SHA-256: `c5affa57d71dd79a431c8a87427672d9d04579cab911b1b6b5eec9a16ad00aca`
- PDF pages: 3 (`pdfinfo` reviewed).
- Rights basis: United States patent publication granted in 1950. Its historical text and drawings are public-domain material in the United States. This receipt makes no claim to third-party scan presentation or metadata.

## Facsimile review and layer separation

Every pinned sheet was rendered and visually read. Page 1 is the sole drawing
sheet. Page 2 holds the Patent Office masthead and the beginning of the full
specification. Page 3 completes the specification, prints all six claims,
contains Spencer's signature, and prints the references-cited table.

- **Facsimile:** the immutable three-page PDF above is the authority.
- **Reviewed transcription ledger:** [`public/patents/transcripts/us-2495429-spencer-microwave-reviewed.txt`](../../public/patents/transcripts/us-2495429-spencer-microwave-reviewed.txt), with three ordered review markers. It preserves page locators for review and is not the visitor-facing renderer.
- **Manual source edition:** `src/data/editions/spencerMicrowaveEdition.ts`. Each paragraph, source term, figure occurrence, claim, and table cell is an explicit typed node. It does not parse OCR, HTML, Markdown, or a PDF text layer at runtime.
- **Editorial explanation:** `src/data/patents/spencer-microwave.ts` is a separate modern engineering reading. Claim decoders retain the legal conditions of the printed claims.

The pre-existing deterministic source-text layer remains research evidence. It
was not made visible as a complete edition and was not used as published text.

## Page, drawing, and claim ledger

| PDF locator | Source material | Published editorial locator |
| --- | --- | --- |
| p. 1 | Sole schematic: magnetrons 10 and 11; transformer 18; wave guide 23; coaxial lines 24 and 25; loops 26 and 27; conveyor 28 | `public/patents/figures/us-2495429-spencer-microwave/drawing-sheet-source-v1.png`; inline preview in source-edition block 6 |
| p. 2 | Masthead; opening; prior 50-megacycle comparison; ten-centimetre condition; objectives; drawing description; magnetrons, cavities, cathodes, magnetic field, transformer circuit, push-pull wave-guide feed; conveyor | transcript page 2; source-edition blocks 0 and 2–12 |
| p. 3 | Energy examples; closing paragraphs; claims 1–6; signature; references-cited table | transcript page 3; source-edition blocks 13–25 |

All six printed claims occur on facsimile page 3, reviewed-transcript page 3,
and manual source-edition blocks 17–22. Canonical claim `originalText` fields
are read directly from those typed claim nodes.

| Claim | Exact source locator | Limitation retained in decoder |
| --- | --- | --- |
| 1 | PDF p. 3, block 17 | microwave-region energy; restricted guided region; exposure until a predetermined cooking degree |
| 2 | PDF p. 3, block 18 | claim 1's energy and guided region plus conveyor speed and exposure interval |
| 3 | PDF p. 3, block 19 | electromagnetic field and relative motion of food during exposure |
| 4 | PDF p. 3, block 20 | substantially ten-centimetre energy plus guided-region exposure |
| 5 | PDF p. 3, block 21 | substantially ten-centimetre energy plus conveyor rate and interval |
| 6 | PDF p. 3, block 22 | substantially ten-centimetre field plus movement relative to that field |

## Editorial correction boundary

The source does not begin with a “To all whom it may concern” or “Be it known”
preamble. It does not describe a household oven cavity, a door seal, a
quarter-wave choke, an assigned 2.45 GHz operating frequency, a stated
electrical-to-RF efficiency, a stated penetration depth, or a turntable. It
does describe two magnetron-type devices in push-pull, a common hollow wave
guide, and a transversely moving conveyor.

The published edition retains the source terms “megacycles,” “wave lengths,”
“electron-discharge devices,” “cavity resonator,” “thermionic emission,”
“push-pull operation,” and “wave guide.” Each modern definition is an
explicitly authored annotation and is not presented as historical wording.
The preserved local figure crop is an unmodified crop from the pinned drawing
sheet, with no reconstructed linework or labels.

## Source-sheet acceptance (2026-09-03)

The prior `fig-1-source-crop-v1.png` remains preserved as a historical local
asset, but it no longer supplies the active figure evidence. Its original
extraction rectangle was not documented in a repeatable source-pixel receipt.
The active preview is therefore the complete, unmodified first source sheet:

- Asset: `public/patents/figures/us-2495429-spencer-microwave/drawing-sheet-source-v1.png`
- Source: PDF page 1, freshly rendered at 300 DPI; 2320 by 3408 pixels.
- Asset SHA-256: `ab3aef1cd0afe66a2fa7f728bfedd51f0caaa7d1c80da36932e0a897841bd826`.
- Source-PDF SHA-256: `c5affa57d71dd79a431c8a87427672d9d04579cab911b1b6b5eec9a16ad00aca`.
- Verification: a separately fresh 300-DPI render compared to the active
  asset with ImageMagick absolute error `AE = 0`.

The source page was visually checked for the complete single schematic: both
magnetron oscillators, transformer, common wave guide, coaxial paths, coupling
loops, conveyor, drawing header, and inventor signature are present and
legible. The evidence rectangle is intentionally the full page (`x=0`,
`y=0`, `width=2320`, `height=3408`), with no masking, reconstruction,
compositing, or OCR. This narrow archival-evidence repair does not change the
source-reader selection or gate access to the complete patent text.
