# US 79,265 - source-provenance receipt

## Pinned facsimile

- Catalogue id: `us-79265-sholes-typewriter`
- Local immutable facsimile: `public/patents/pdfs/us-79265-sholes-typewriter.pdf`
- Stable public record: https://patents.google.com/patent/US79265A/en
- Retrieved for source review: 2026-08-18
- SHA-256: `59e3d127ca09c1468d554cd70cd7621b77e155b42df3194e61f04e69d8750aca`
- PDF pages: 6
- Rights basis: United States Patent No. 79,265 was granted in 1868. Its
  historical patent text and drawings are public-domain material in the United
  States. This receipt makes no claim to rights in a third-party scan
  presentation or metadata.

## Direct facsimile review

The pinned source is a six-page United States Patent Office facsimile. Pages 1
and 2 are drawing sheets; pages 3 through 6 are the two-column specification,
claims, execution, and witnesses. The title printed in the source is
*Improvement in Type-Writing Machines*, not a grant for a particular keyboard
layout.

| PDF locator | Source material | Review result |
| --- | --- | --- |
| p. 1 | Figs. 1, 2, 3, and 9; inventors and witnesses | Direct visual review; figure source sheet retained at `public/patents/figures/us-79265-sholes-typewriter/figures-1-3.png` |
| p. 2 | Figs. 4, 5, 6, 7, and 8; inventors and witnesses | Direct visual review; figure source sheet retained at `public/patents/figures/us-79265-sholes-typewriter/figures-4-8.png` |
| p. 3 | Patent-office masthead, inventors, title, opening specification, disk, type-bars, keys, cushion, and beginning of platen | Direct visual and text-layer comparison |
| p. 4 | Platen, primary and secondary carriage frames, paper holding, line-spacing pins, pawl, cords, and weights | Direct visual and text-layer comparison |
| p. 5 | Key bar, bifurcated lever, ratchet, alternating catches, and carriage advance | Direct visual and text-layer comparison |
| p. 6 | Ribbon feed, crescent alternative, Claims 1-5, execution, and witnesses | Direct visual and text-layer comparison |

The source says an application for the earlier type-writing machine was filed
October 11, 1867. It does **not** print a filing date for US 79,265, so the
canonical record uses `filingDate: null` rather than falsely assigning that
earlier application date to this grant.

## Corrected source facts

The source has five claims, not three. They cover: direct key-levers and their
fingers under the type-bars; the bifurcated lever/ratchet spacing train; the
pin/pawl/spring line-spacing train; paper-holding springs; and the complete
ribbon-feed combination. The canonical record and the published manual edition
contain those five claims verbatim.

The printed source describes a radially slotted disk, a piano-like key-board,
a spherical self-adjusting platen, two paper-carriage motions, and an
inking-ribbon feed. It does not state a named keyboard arrangement, a
character pitch, a key count, type-bar count, impact speed, force, material for
an ink ribbon, or a numerical performance model. Unsupported versions of those
details have been removed from the visitor-facing record.

## Figure-crop preparation

The following unmodified local derivatives select the actual printed figures
from the two pinned drawing sheets for the published authored edition:

| Source figure | Local crop |
| --- | --- |
| Fig. 1 | `public/patents/figures/us-79265-sholes-typewriter-fig-1-tight-source-crop.png` |
| Fig. 2 | `public/patents/figures/us-79265-sholes-typewriter-fig-2-tight-source-crop.png` |
| Fig. 3 | `public/patents/figures/us-79265-sholes-typewriter-fig-3-tight-source-crop.png` |
| Fig. 4 | `public/patents/figures/us-79265-sholes-typewriter-fig-4-tight-source-crop.png` |
| Fig. 5 | `public/patents/figures/us-79265-sholes-typewriter-fig-5-focus-source-crop.png` |
| Fig. 6 | `public/patents/figures/us-79265-sholes-typewriter-fig-6-isolated-source-crop.png` |
| Fig. 7 | `public/patents/figures/us-79265-sholes-typewriter-fig-7-verified-source-crop.png` |
| Fig. 8 | `public/patents/figures/us-79265-sholes-typewriter-fig-8-verified-source-crop.png` |
| Fig. 9 | `public/patents/figures/us-79265-sholes-typewriter-fig-9-tight-source-crop.png` |

No crop is a substitute for the full facsimile, and no crop has a synthetic
overlay. Earlier invalid draft derivatives are preserved as unused artifacts
under the no-deletion rule; the table identifies the only published crops.

## Editorial boundary

`public/patents/source-text/us-79265-sholes-typewriter.txt` and
`public/patents/transcripts/us-79265-sholes-typewriter.txt` remain research
comparison artifacts. They are not a reviewed transcription and are not served
as a complete source edition. The published complete source face is the
manually authored `sholesTypewriterArchivalEdition`; its corresponding reviewed
ledger is `public/patents/transcripts/us-79265-sholes-typewriter-reviewed.txt`.
The ledger retains six explicit source-page markers for audit only. The public
reading surface does not use scan-page breaks, raw OCR, or a text-to-HTML
formatter. Each source paragraph has one authored, non-lossy companion reading,
and every printed figure reference is an explicit React reference to a reviewed
local crop.
