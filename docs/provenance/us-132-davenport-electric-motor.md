# Provenance receipt: US 132, Thomas Davenport

## Source identity

- Catalogue id: `us-132-davenport-electric-motor`
- Granted title: *Improvement in Propelling Machinery by Magnetism and Electro-Magnetism*
- Inventor: Thomas Davenport, Brandon, Vermont
- Grant date: 1837-02-25
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

## Editorial boundaries

- The typed edition in `src/data/editions/davenportElectricMotorEdition.ts` is the public archival source face. It is explicit authored nodes, not an OCR, PDF text layer, Markdown conversion, or HTML reflow.
- `public/patents/transcripts/us-132-davenport-electric-motor.txt` is a reviewed research transcription. It is retained as a separate source artifact and is not the archival renderer input.
- The only claim in the printed source is unnumbered. The edition assigns it stable reader anchor number 1 without changing its wording; no dependent claim has been inferred.
- The drawing sheet contains no printed `Fig.` labels. Its locally derived preview is therefore identified as a drawing sheet, rather than inventing figure numbers.
