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
| p. 18 | Masthead, assignee, August 30, 1884 application date, purpose, matrix/casting groups, bar selection, alignment, and casting cycle | Cloud-authoritative US313224A comparison plus manual source-led transcription; ledger and continuous edition now cover this page |
| pp. 19-25 | Overlap cycle, correction, Figs. 1-51 descriptions, principal parts, matrix-bar geometry, lower-case recesses, bar connections, stop-pin frame, adjusting-pin escapement, inactive bars, spacing/justification, and indicator | Bounded cloud-only continuation slice manually reconciled into the ledger and continuous edition; every printed figure citation is authored as a typed reference (local crops remain staged only where already present) |
| pp. 26-30 | Continuation of the specification: remaining casting, pump, drive, operating cycle, and modifications | Explicit continuation boundary: not changed by this slice and remains an independent source-completion gap |
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

### Bounded page-18-to-25 continuation (2026-08-21)

Pages 18 through 25 were authored from the pinned facsimile using the
authoritative Google Patents US313224A text as a cloud comparison source. The
local PDF text layer was used only to locate columns and compare spelling; it
was not promoted as the transcription authority, and no local OCR or rendering
was run. The reviewed ledger retains the exact page markers and page-local
content. The React edition is continuous: its first authored source reading
now runs from the masthead through the final indicator paragraph on PDF page
25, with typed figure references for the cited Figs. 1 through 51 and authored
term definitions for the source's period vocabulary.

The exact continuation boundary is the final indicator paragraph on page 25.
The next source sentence begins on PDF page 26 and is deliberately not
represented by this bounded edit. Pages 26-30 remain an independent
specification-completion gap; claims 1-70 and the prior drawing WIP are
preserved but do not establish complete source acceptance.

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

### Root re-hold (2026-08-20)

A later concurrent change attached the WIP edition and a 35-marker ledger to
the public record. Marker count did not establish completeness: drawing pages
repeat one generic inventory, and specification pages 14–30 repeat the same
short mechanism summary instead of transcribing their printed columns. The
canonical record is unbound again. The 70 checked claims and other WIP source
artifacts remain preserved, but publication requires literal page content,
continuous source blocks, complete figure-reference previews, and independent
facsimile acceptance.
