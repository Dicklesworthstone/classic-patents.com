# US 223,898 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-223898-edison-lightbulb`
- Local immutable facsimile: `public/patents/pdfs/us-223898-edison-lightbulb.pdf`
- Stable public record: https://patents.google.com/patent/US223898A/en
- Retrieved for source review: 2026-08-18
- SHA-256: `70c46d7c8624b1e471dffd1175b0f34e70b4b05b6a9adede43c198fe71abc054`
- PDF pages: 4
- Rights basis: United States Patent No. 223,898 was granted in 1880. Its
  historical text and drawings are public-domain material in the United States.
  This receipt makes no claim to rights in a third-party scan presentation or
  metadata.

## Direct facsimile review

The pinned document has four source pages. Page 1 is the printed drawing sheet.
Pages 2 and 3 hold the Patent Office masthead, complete specification, all four
printed claims, execution, and witnesses. Page 4 holds an attached December
1882 certificate, its March 1883 cancellation, and a second visible impression
of the December certificate. Every sheet was rendered and visually read before
publication. The source PDF has a poor text layer and an explicit “BEST
AVAILABLE COPY” mark on the specification pages; Poppler and Google Patents
text were comparison aids only and were not treated as the edition's authority.

| PDF locator | Source material | Editorial treatment |
| --- | --- | --- |
| p. 1 | Figs. 1-3: lamp section, plastic stock, carbonized spiral | Direct visual review; one direct local crop for each printed figure |
| p. 2 | Masthead; introductory specification; high-resistance, vacuum, prior-practice, material, and contact text | Direct visual review and manual transcription |
| p. 3 | Manufacturing sequence, drawing description, all four claims, execution, signature, witnesses | Direct visual review and manual transcription |
| p. 4 | December 1882 term-limitation certificate; March 1883 cancellation; duplicate visible certificate impression | Direct visual review and manual transcription |

## Corrected source facts

The prior public record added material not supported by this facsimile: a
specific Sprengel-pump process, bamboo, a 2,200 K operating temperature,
10^-6 Torr, a 95 percent current reduction, a first-commercial-system claim,
and an invented fourth claim about a carbon-and-coal-tar compound. It also
reduced a source method to a different claim. Those assertions are not carried
forward in the public record.

The source instead makes four concrete claims: a high-resistance carbon
filament secured to metallic wires; carbon filaments with an all-glass exhausted
receiver and conductors passing through glass; a coiled carbon filament or
strip with a limited exposed radiating surface; and the specified method of
securing *platina* contact wires and carbonizing the whole in a closed chamber.
Its text uses `platina`, not a modernized spelling, and reports source values
of one-millionth of an atmosphere, 100 to 500 ohms, 2,000 ohms, and
three-sixteenths of an inch. Those are preserved as source statements, not
upgraded into general engineering guarantees.

The document separately records execution on November 1, 1879, filing on
November 4, 1879, and grant on January 27, 1880. The post-grant sheet says the
United States patent was administratively limited under section 4887 of the
Revised Statutes to the shortest-running named foreign patent, then says that
certificate was canceled on March 15, 1883. Neither record changes the four
printed technical claims in this edition.

## Published edition, ledger, and figure crops

`edisonLightbulbArchivalEdition` in
`src/data/editions/edisonLightbulbEdition.ts` is an explicit, manually authored
React/TypeScript edition. It is a continuous reading document and does not
parse OCR, treat a transcript as markup, infer figure references, or make
scan-page numbers part of the visitor experience.

`public/patents/transcripts/us-223898-edison-lightbulb-reviewed.txt` is the
separate page-marked review ledger. Its markers prove ordered source-page
coverage to the test suite but are not rendered into the visitor's reading
experience. The older source-text layer remains research evidence, not the
public complete-source edition.

| Source figure | Local selected crop |
| --- | --- |
| Fig. 1 | `public/patents/figures/us-223898-edison-lightbulb/fig-1-source-crop-v4.png` |
| Fig. 2 | `public/patents/figures/us-223898-edison-lightbulb/fig-2-source-crop-v6.png` |
| Fig. 3 | `public/patents/figures/us-223898-edison-lightbulb/fig-3-source-crop-v3.png` |

The selected crop files are unmodified selections from the pinned drawing
sheet. They add no reconstructed linework, labels, or historical claims.

## Review boundary

The pinned local PDF, its digest, and direct visual comparison are the authority
for this edition. A passing source-ledger, focused-test, or build check proves
the stated software and textual relationships; it does not replace a fresh,
independent editorial review against the primary facsimile and the deployed
Wright-quality reference.
