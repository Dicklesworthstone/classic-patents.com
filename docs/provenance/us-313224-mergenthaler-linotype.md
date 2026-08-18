# US 313,224 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-313224-mergenthaler-linotype`
- Local immutable facsimile: `public/patents/pdfs/us-313224-mergenthaler-linotype.pdf`
- Stable public record: https://patents.google.com/patent/US313224A/en
- Retrieved for source review: 2026-08-18
- SHA-256: `d85530ab4302e8be7e4c0ac280d438756f1dd21dabc844f2c5b2e76861d7444a`
- PDF pages: 35
- Rights basis: United States Patent No. 313,224 was granted in 1885. Its
  historic text and drawings are public-domain material in the United States.

## Direct facsimile review

The pinned document has seventeen drawing sheets followed by eighteen
specification and claim pages. Every page was rendered and read visually. The
PDF text layer was used only as comparison evidence; it is visibly unreliable
for this source and is not the transcription authority.

| PDF locator | Source material | Editorial treatment |
| --- | --- | --- |
| pp. 1-17 | The 17 drawing sheets; printed title; figure labels 1 through 51; drawing-sheet signatures | Direct visual review; figure crop work is still in progress and is not yet visitor-facing |
| p. 18 | Masthead, assignee, application date, purpose, overview of the matrix and casting mechanisms | Direct visual review and manual transcription in progress |
| pp. 19-30 | Figure descriptions, matrix bars, selection, stop and adjusting mechanisms, spacing, indication, alarm, casting, pump, drive, operation, and modifications | Direct visual review and manual transcription in progress |
| pp. 31-35 | Claims 1-70, execution, signature, and witness names | Direct visual review; every claim manually transcribed and source-pinned in `mergenthalerLinotypeClaims` |

## Source observations and corrections

The source calls the invention **Machine for Producing Printing-Bars**. It
identifies **Ottmar Mergenthaler, of Baltimore, Maryland, assignor to the
National Typographic Company, of West Virginia**, and visibly prints an
application date of **August 30, 1884**. It contains **70 numbered claims**.

Its central mechanism is not the familiar later commercial Linotype presented
as a generic keyboard, binary distributor, and wedge-spaceband story. The
claimed apparatus uses independently movable, alternately tapered **matrix
bars** carrying intaglio characters and blank spacing surfaces; finger keys,
adjusting pins, and stop pins select the positions of those bars. It then
aligns and clamps the temporary matrix against a sectional mold and uses a
melting pot and force pump to form the printing bar. The source expressly
describes an overlapping cycle: while one bar is being cast, character
selection for another may proceed.

The legacy catalogue record instead asserted a July 14, 1884 filing date,
three claims, a 90-key keyboard, brass matrices, two-part steel wedge
spacebands, binary tooth sorting, a fixed alloy composition, a specific
temperature, fixed speeds and cycle times, water cooling, and extensive later
history. These assertions have not been carried into the source-led work. The
pinned facsimile does not support using them as its complete primary-source
edition.

## Published-edition boundary

The public record has **not** yet been switched to this edition. The complete
continuous transcription, the semantic React source blocks, the companion
plain-English readings, and direct local crops for all figure references must
be complete before it may replace the current source face. The claim
transcription is deliberately staged in
`src/data/editions/mergenthalerLinotypeEdition.ts`, where a focused test pins
both the PDF digest and the exact 1-70 sequence.

That boundary prevents an in-progress draft from presenting partial source
coverage as a complete historical edition.
