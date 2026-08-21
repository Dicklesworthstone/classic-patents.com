# Provenance receipt: US 132, Thomas Davenport

## Source identity

- Catalogue id: `us-132-davenport-electric-motor`
- Granted title: *Improvement in Propelling Machinery by Magnetism and Electro-Magnetism*
- Inventor: Thomas Davenport, Brandon, Vermont
- Grant date: 1837-02-25
- Filing date: not printed in the reviewed facsimile; canonical value is `null`
- Primary public record: https://patents.google.com/patent/US132A/en
- Local immutable facsimile: `public/patents/pdfs/us-132-davenport-electric-motor.pdf`
- Retrieval and review date: 2026-08-17
- Rights basis: United States patent issued in 1837. The published patent text and drawings are public-domain United States Government material.
- SHA-256: `9147fc5c9d6565aa765198b42e900c90c5c0fe550b9162fe62727f86a5071960`
- PDF page count: 3

## Facsimile map and comparison record

The served PDF was visually inspected sheet by sheet at 220 DPI and again at
500 DPI before this edition was authored. The source is a three-page scan: its
first sheet is the drawing sheet, its second sheet begins the two-column
specification, and its third sheet finishes the specification, claim, signature,
and witness lines. The public continuous edition deliberately omits source-page
breaks while preserving the printed sequence.

| Facsimile locator | Content checked |
| --- | --- |
| PDF p. 1 | Header `T. DAVENPORT. Electric Motor. No. 132. Patented Feb. 25, 1837`; drawing sheet with frames A, B, C; battery D through I; plates K and L; magnets M through T; shaft R; wheel V; inventor signature and witnesses. |
| PDF p. 2, left column | Office masthead, inventor/location/title metadata, formal opening, frame, battery, and galvanic-magnet description. |
| PDF p. 2, right column | Artificial magnets, quiescent arrangement, copper plates/conductors, beginning of the motion sequence. |
| PDF p. 3, left column | Completion of the polarity-change and rotary-motion explanation; claim preamble and first line of the only claim. |
| PDF p. 3, right column | Completion of the single broad claim, `THOMAS DAVENPORT.` signature, and witnesses `W. W. AYRES` and `CHAS. A. COOK`. |

## Drawing-preview crop receipt

The drawing sheet does not assign `Fig.` numbers to its three views. The
specification refers collectively to the “annexed drawings,” so that authored
reference opens three previews in the printed top-to-bottom order. On
2026-08-21, root visual review rejected the earlier full-sheet hover because it
made the apparatus unnecessarily small and included the sheet masthead and
signature blocks. The old `drawing-sheet-preview.png` remains preserved as
comparison evidence but is no longer served by the edition.

The accepted previews below are unmasked source-pixel rectangles cut from that
1702 x 2500 pinned-sheet render. They are already upright: all printed letters
read in their normal orientation. Each excludes the sheet masthead, inventor
signature, witness signatures, and the other two apparatus views.

| Source view | Source rectangle `(left, top, width, height)` | Served asset | PNG dimensions | SHA-256 |
| --- | --- | --- | --- | --- |
| Upper perspective apparatus | `(430, 470, 1080, 560)` | `drawing-view-1-source-crop-v2.png` | `1080 x 560` | `c1e0f4d53c41e80b1e0b9ddd69007f3e92fded589313d7cf9d64aadcffceb86e` |
| Middle rotor plan | `(445, 1070, 730, 500)` | `drawing-view-2-source-crop-v2.png` | `730 x 500` | `ec1cb8b8f44380320e08ab84eb7f94dd09b4dd637e18400a4469c55a6063e2be` |
| Lower commutator/plate plan | `(440, 1540, 630, 500)` | `drawing-view-3-source-crop-v2.png` | `630 x 500` | `a2bccbe0bcca8234fd10b67636552128d1d4cd2f9812d325a0bc72cb759bc7d9` |

The lower source view is printed immediately between the witness and inventor
signature blocks. Its accepted rectangle retains the complete circular plate,
shaft connection, contact assembly, and visible lettered callouts while ending
before either signature block; it does not erase or reconstruct source pixels.
The ledger transcribes the printed drawing-sheet masthead and reference-character
set. It identifies the inventor's handwritten signature, but does not guess at
the two witness signatures, which are not confidently legible in the supplied
scan; that legibility boundary is stated explicitly under the page-1 marker.

## Editorial boundaries

- The typed edition in `src/data/editions/davenportElectricMotorEdition.ts` is the public archival source face. It is explicit authored nodes, not an OCR, PDF text layer, Markdown conversion, or HTML reflow.
- `public/patents/transcripts/us-132-davenport-electric-motor.txt` is a reviewed research transcription. It is retained as a separate source artifact and is not the archival renderer input.
- The only claim in the printed source is unnumbered. The edition assigns it stable reader anchor number 1 without changing its wording; no dependent claim has been inferred.
- The drawing sheet contains no printed `Fig.` labels. Its locally derived preview is therefore identified as a drawing sheet, rather than inventing figure numbers.
- The canonical drawing metadata uses the unnumbered-sheet identity and the
  source's A through V part designations. An earlier catalogue draft mislabeled
  the sheet `Fig. 1`, assigned A/B/C to modern stator/rotor/commutator parts,
  supplied a filing date not printed by this source, and carried unsupported
  patent-war and impact-score metrics. Those claims were removed during the
  2026-08-21 root source review.
