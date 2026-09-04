# US 319,596 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-319596-maxim-machine-gun`
- Local immutable facsimile: `public/patents/pdfs/us-319596-maxim-machine-gun.pdf`
- Stable public record: https://patents.google.com/patent/US319596A/en
- Retrieved for source review: 2026-08-18
- SHA-256: `ca385c254e2e390451a2eecd28273fee662afd0179451bcbf9f48bf8fde63dcb`
- PDF pages: 5
- Rights basis: United States Patent No. 319,596 was granted in 1885. Its
  historic text and drawings are public-domain material in the United States.

## Direct facsimile review

The pinned document has five source sheets. Pages 1 and 2 are the two
drawing sheets. Pages 3 and 4 contain the masthead and specification; page 5
finishes claim 3, prints claim 4, and carries execution. Every sheet was
rendered and visually read. The PDF text layer was comparison evidence only.

| PDF locator | Source material | Editorial treatment |
| --- | --- | --- |
| pp. 1-2 | Fig. 1 longitudinal section, Fig. 2 plan, Fig. 3 breech-case side view; printed title, signatures, witnesses | Direct visual review; direct local crop for each labelled figure |
| p. 3 | Masthead, foreign-patent notice, divisional relationship, direct muzzle-gas account, drawings, construction through beginning of extractor/sear paragraph | Direct visual review and manual transcription |
| p. 4 | Completion of firing parts, feed wheels, volute spring, operation, introduction and claims 1-3 through their continuing text | Direct visual review and manual transcription |
| p. 5 | Completion of claim 3, claim 4, execution, signature, witnesses | Direct visual review and manual transcription |

## Source observations and corrections

The source calls the invention **Machine-Gun**, identifies **Hiram S. Maxim**
as a United States citizen residing in London, gives a filing date of **March
14, 1885**, and prints **four** claims. The invention is a division of an
earlier application, No. 132,883, and the source describes direct use of gases
issuing from the muzzle.

Specifically, expanding muzzle gases act on shoulders in sliding tubular piece
`l` and its socket `l′`, moving them **forward** along fixed barrel `B`. Links,
rods, levers, crankshaft `e`, and cross-head `d` transmit and reverse that
motion to sliding breech-block `C`; volute spring `k` supplies the return
motion. The source says no muzzle pressure, sleeve travel, firing rate,
calibre, projectile velocity, belt capacity, water jacket, recoil-barrel
stroke, toggle lock, spring constant, or thermal performance value.

The earlier public record called the grant an **Automatic Gun**, gave a filing
date of June 27, 1884, described recoil operation, a short-recoiling barrel,
toggle lock, water jacket, 250-round belt, 600 rounds per minute, quantified
thermal and pressure values, three claims, and later military/legal history.
Those statements are not supported by this five-sheet facsimile and do not
appear in the public source edition.

The execution sentence visibly prints “set may hand”; the edition retains
that source wording rather than changing it to “my hand.” The two drawing
sheets use the heading **MACHINE GUN**, while the specification masthead
prints **MACHINE-GUN**. The editorial record preserves each surface's wording.

## Published edition, ledger, and figure crops

`maximMachineGunArchivalEdition` in
`src/data/editions/maximMachineGunEdition.ts` is a manually authored typed
React/TypeScript edition. It is continuous reading content, not OCR cleanup,
HTML, Markdown, a PDF text dump, or scan-page reconstruction.

`public/patents/transcripts/us-319596-maxim-machine-gun-reviewed.txt` is the
separate source ledger. Its page markers establish ordered review coverage but
are never shown in the visitor reader. The older source-text layer remains
research evidence only.

| Source figure label | Active local source sheet |
| --- | --- |
| Fig. 1, vertical central longitudinal section | `public/patents/figures/us-319596-maxim-machine-gun/source-sheet-1-v1.png` |
| Fig. 2, partly sectional plan | `public/patents/figures/us-319596-maxim-machine-gun/source-sheet-1-v1.png` |
| Fig. 3, breech-case side view | `public/patents/figures/us-319596-maxim-machine-gun/source-sheet-2-v1.png` |

The active source sheets are direct, unmodified 300-DPI renderings of the
pinned drawing sheets. They add no reconstructed linework, labels, or
historical claims.

## Source-sheet acceptance (2026-09-03)

The former Fig. 1, Fig. 2, and Fig. 3 crops remain preserved in
`public/patents/figures/us-319596-maxim-machine-gun/` as research derivatives.
Figures 1 and 2 share the first historical drawing sheet and Fig. 3 is on the
second; the active archival previews therefore retain the complete source-sheet
context rather than asserting isolated crop boundaries.

The active assets are direct renders of the pinned source:

| Asset | Source locator | Raster dimensions | SHA-256 |
| --- | --- | --- | --- |
| `source-sheet-1-v1.png` | PDF page 1; full raster rectangle `(x=0, y=0, width=2320, height=3408)` | `2320 x 3408` pixels | `da088da6e81eb36d878819c392f766edd3733e93e9df78f6fca1258c51bdc048` |
| `source-sheet-2-v1.png` | PDF page 2; full raster rectangle `(x=0, y=0, width=2320, height=3408)` | `2320 x 3408` pixels | `c2c0c2421227d1b1fc246a3331b88f7c47300b82d610c8e83882727fed939b93` |

Independently rendered 300-DPI comparisons yielded zero differing pixels for
both pages (ImageMagick absolute error metric `AE=0`). The sheets retain the
printed figure labels, patent identity, witnesses, inventor/attorney signature
blocks, and all labelled source geometry. All eight active citations use those
two full-sheet assets with explicit page and raster locators. This internal
evidence repair does not alter or gate the complete patent-text reader.

## Review boundary

The pinned local PDF, its digest, and direct visual comparison are the edition
authority. Passing tests and software gates prove only the stated
relationships; they do not replace independent editorial acceptance against
the facsimile and the deployed Wright-quality reference.
