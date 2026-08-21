# Provenance Receipt: Henry Cort — Manufacture of Iron (GB 1420)

## 1. Source Identity

- **Catalogue ID**: `gb-1420-cort-puddling-rolling`
- **Patent Title (as indexed by the British Patent Office)**: *Shingling, welding, and manufacturing iron and steel into bars, plates, rods, etc.; by the use of fire and machinery*
- **Short Title**: Henry Cort's dry-puddling process
- **Inventor**: Henry Cort (1740–1800), of Fontley, Parish of Titchfield, County of Southampton (Hampshire), England
- **Patent sealing date**: February 13, 1784 (A.D. 1784, 24 George III, No. 1420)
- **Specification enrolment date**: June 12, 1784 (the sealing and enrolment dates are not interchangeable)
- **Filing date**: Not established from the checked primary-facing sources
- **Primary record locator**: The National Archives, Chancery specification records (C 54/C 73 finding aids); no digital facsimile was located in this pass
- **Secondary printed witness**: [British Patent Office, *Patents for Inventions: A.D. 1620–1866*, p. 21](https://books.google.com/books?id=jV0WAAAAYAAJ&pg=PA21)
- **Local reconstruction path**: `public/patents/pdfs/gb-1420-cort-puddling-rolling.pdf` (research reconstruction, not a facsimile)
- **Reconstruction review date**: 2026-08-21
- **Rights Basis**: The historical patent and the 1854 Patent Office abridgment are public-domain government records; this does not make the local reconstruction an original source.
- **Pinned reconstruction SHA-256 Digest**: `b213e2bb7da843a3397d38f9be1126696512eed62fae9680147761566e40286f`
- **PDF Page Count**: 2 (synthetic reconstruction; not the page count of the enrolled specification)

## 2. Facsimile Map

| PDF Page | Historical Content | Quality & Review Notes |
| :--- | :--- | :--- |
| Page 1 | Modern reconstruction page carrying an editorial paraphrase of the furnace process. | Not evidence of the enrolled specification; no facsimile review credit. |
| Page 2 | Modern reconstruction page carrying an editorial paraphrase of rolling and a fabricated claim/drawing section. | Rejected: the 1854 Patent Office abridgment records no drawings and no numbered claims. |

## 3. Editorial and Preservation Boundaries

- **Visitor-facing archival edition**: withheld; the current TypeScript file is a research draft only
- **Comparison ledger**: `public/patents/transcripts/gb-1420-cort-puddling-rolling-reviewed.txt` (retained evidence, not accepted as a reviewed transcription)
- **Figure crops**: none accepted. The existing PNG is retained as rejected reconstruction evidence and must not be presented as a source preview.
- **Formal claims**: no separately enumerated claims in the checked Patent Office abridgment; the four numbered claims previously staged here were editorial inventions and have been removed from the canonical record.
- **Physics kernel**: `src/physics/cortKernel.ts` (`stepCortPuddlingRolling`), an explicitly editorial process model, not a measurement of GB 1420
- **3D/2D visuals**: editorial teaching instruments only; neither is an archival drawing

## 4. Root Source-Identity Hold (2026-08-21)

The pinned PDF is not a historical Great Seal or Chancery facsimile. `pdfinfo` identifies `Typst 0.14.2` as its creator and gives creation and modification time `2026-08-19 21:47:26`; both A4 pages are modern typesetting, and page 2 embeds modern color reconstructions. The staged ledger repeats that reconstruction and invents claims and drawings. The checked Patent Office abridgment says `[Printed, 3d. No Drawings.]` after the GB 1420 description, so the old Fig. 1/2/3 references cannot be retained. The canonical record therefore remains unbound (`archivalEdition` and `originalTextAsset` absent) until a genuine primary facsimile or an independently accepted archival witness is obtained and reviewed by a cloud Luna worker. No local OCR, rendering, or crop generation is evidence for release.
