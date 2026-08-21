# US 347,140 — source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-347140-thomson-welding`
- Immutable local source: `public/patents/pdfs/us-347140-thomson-welding.pdf`
- Stable public record: https://patents.google.com/patent/US347140A/en
- Retrieved for this edition: 2026-08-18
- SHA-256: `80e7bbf735c52f3ace482277f39b130c0b6a62ee8eb9290389175939ba48356c`
- PDF pages: 5
- Rights basis: US Patent No. 347,140 was granted in 1886. The historic US
  patent text and drawings are public-domain material in the United States.
  This receipt does not claim rights in a third-party scan's layout or metadata.

## Direct facsimile review

| Material | Exact PDF locator | Editorial treatment |
| --- | --- | --- |
| Figs. 1–9, drawing-sheet masthead, signatures | PDF p. 1 | Local source-faithful sheet crop and explicit references. |
| Figs. 10–18, drawing-sheet masthead, signatures | PDF p. 2 | Local source-faithful sheet crop and explicit references. |
| Patent-office masthead, application data, preamble, purpose, complete figure account, beginning clamp description | PDF p. 3 | Ordered typed source paragraphs and paragraph companions. |
| Continuation of clamp description; Figs. 2–17; work-piece variants and transformer description | PDF p. 4 | Ordered typed source paragraphs and explicit source references. |
| Fig. 18, alternate power/pressure text, Claims 1–8, execution, inventor, witnesses | PDF p. 5 | Exact typed claim/signature nodes and paragraph companions. |

The source gives **Application filed March 29, 1886, Serial No. 197,077**.
It prints eight claims and eighteen numbered figures across two sheets. The
small italic face of the printed `1` in the sheet labels can resemble a `2` or
`7` at reduced scale; the specification's figure list and the high-resolution
source review reconcile the labels as Figs. 10–18.

## Editorial boundary and review ledger

`thomsonWeldingArchivalEdition` in
`src/data/editions/thomsonWeldingEdition.ts` is a continuous, typed reading
edition manually compared with all five source pages. It is not produced from
OCR, a PDF text layer, Markdown, HTML, or a formatter. The displayed reader
has no reconstructed scan-page boundaries.

`public/patents/transcripts/us-347140-thomson-welding-reviewed.txt` is the
separate page-by-page review ledger. Its five markers exist for audit only;
they are not part of the visitor's continuous original-text view. The retained
source text layer and OCR artifacts remain research evidence rather than the
public edition's authority.

## Figures, claims, and corrections

The local previews are full, unaltered source-sheet crops:

- `public/patents/figures/us-347140-thomson-welding/fig-1-source-crop-v1.png`
  contains Figs. 1–9.
- `public/patents/figures/us-347140-thomson-welding/fig-2-source-crop-v1.png`
  contains Figs. 10–18.

Every printed figure reference in the narrative is an authored semantic
reference to its appropriate source sheet. Claims 1–8 are explicit typed
nodes; they cover current-through-contact welding, simultaneous pressure,
clamps and springs, removable dies, the primary/secondary arrangement, and
the guided-and-clamped process.

The former catalogue record said the application was filed April 14, 1886 and
used a short invented source excerpt. The facsimile instead gives March 29,
1886 and a substantially longer specification; the manual edition supersedes
that public source path without discarding the old research asset.

## Independent-review boundary

The author completed a direct visual pass across all five source pages. Root
must still perform a second independent facsimile and live-render review before
accepting or closing the Bead. Focused tests establish structure and pinned
assets, not independent archival acceptance or deployment.

## Source-crop audit and repair ledger (2026-08-21)

The source authority for this audit is the pinned five-page PDF above, with the
two drawing sheets on PDF pages 1 and 2. The official public primary record is
the Google Patents US347140A page and its linked drawing-sheet images. Every
printed figure occurrence in the edition is an authored semantic reference;
no occurrence is inferred from prose or from a crop filename.

| Figure | Source page | Candidate preview / binding state | Audit result |
| ---: | ---: | --- | --- |
| 1 | 1 | **UNBOUND** (`figure-1-source-crop-v5.png` preserved) | **REJECTED by root:** lower `S` spring label touches/clips the bottom boundary and a stray lower fragment remains. Planned v6 main/lower split; v4 also failed right-edge isolation. |
| 2 | 1 | `figure-2-source-crop-v5.png` | New 450×1050 candidate restores label breathing room and the complete clamp; pending root acceptance. |
| 3 | 1 | **UNBOUND** (`figure-3-source-crop-v5.png` preserved) | **REJECTED by root:** clipped foreign fragment at bottom center. Planned v6 main/lower split; v4 also failed for top-edge S/Z material. |
| 4 | 1 | `figure-4-source-crop-v2.png` | Existing crop independently checked as isolated and complete. |
| 5 | 1 | **UNBOUND** (`figure-5-source-crop-v5.png` preserved) | **REJECTED by root:** clipped Fig. 6 caption/edge remains. Planned shared `figure-5-6-source-crop-v6-group.png` under explicit group semantics. |
| 6 | 1 | **UNBOUND** (`figure-6-source-crop-v5.png` preserved) | **REJECTED by root:** clipped Fig. 5 caption/edge remains. Planned shared `figure-5-6-source-crop-v6-group.png`; v4 label framing also failed. |
| 7 | 1 | `figure-7-source-crop-v1.png` | Existing crop independently checked as isolated and complete. |
| 8 | 1 | **UNBOUND** (`figure-8-source-crop-v5.png` preserved) | **REJECTED by root:** likely upper arc/vertical fragment from neighboring Fig. 9 remains; planned source-aware v6 recrop. Old v2 also retained neighbor/signature matter. |
| 9 | 1 | **UNBOUND** (`figure-9-source-crop-v5.png` preserved) | **REJECTED by root:** v4 failed left/right/bottom isolation and label framing; v5 has a clean label/body but its diagonal conductors continue beyond the bottom boundary. Planned v6 main plus lower-continuation preview. |
| 10 | 2 | `figure-10-source-crop-v2.png` | Existing crop independently checked as isolated and complete. |
| 11 | 2 | `figure-11-source-crop-v4.png` | Removed lower Fig. 16/signature matter; full flanged-head and bar drawing retained. |
| 12 | 2 | `figure-12-source-crop-v5.png` | New 360×220 candidate is visually isolated and complete; pending root acceptance. |
| 13 | 2 | `figure-13-source-crop-v5.png` | New candidate is visually isolated with the complete ring, joint, clamps, and printed label; v4 is rejected for a bottom neighbor. |
| 14 | 2 | `figure-14-source-crop-v4.png` | Appears isolated and complete on local visual review; pending root acceptance. |
| 15 | 2 | `figure-15-source-crop-v5.png` | New 520×360 candidate removes Fig. 14/Fig. 16 matter and restores full right-side work-piece; pending root acceptance. v4 is rejected for upper-right/lower neighbors. |
| 16 | 2 | `figure-16-source-crop-v1.png` | Existing crop independently checked as isolated and complete. |
| 17 | 2 | `figure-17-source-crop-v1.png` | Existing crop independently checked as isolated and complete. |
| 18 | 2 | `figure-18-source-crop-v1.png` | Existing crop independently checked as isolated and complete. |

All old, v3, and v4 files are preserved. v4 files rejected by root are not
accepted as source previews. The v5 files are candidate repairs and remain
held pending root's independent visual acceptance. The edition now fails
closed for the six root-rejected numbers (1, 3, 5, 6, 8, and 9): their files
remain on disk but their authored references expose no preview until a
source-aware replacement or explicit split is accepted. No ledger, registry,
or publication mapping was changed to relabel a source figure.

The canonical Thomson patent record is intentionally unbound from this
incomplete edition while those replacements are pending; this prevents the
withheld preview state from entering `allPatents` as a publishable record.
