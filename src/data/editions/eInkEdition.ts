import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

export const eInkParallelReadings: Record<string, string> = {
  "eink-abstract":
    "An electrophoretic display utilizes microcapsules containing charged pigment particles suspended in a dielectric fluid, driven by an electric field to reflect or absorb ambient light.",
  "eink-p1":
    "Emissive displays such as CRTs and back-lit LCDs consume high continuous power and suffer from poor readability in direct sunlight.",
  "eink-p2":
    "By applying an electrostatic potential across microencapsulated electrophoretic cells, positively charged white particles and negatively charged black particles migrate reversibly to create bistable electronic paper.",
  "eink-claim1":
    "An electrophoretic display medium comprising a plurality of microcapsules containing a dielectric fluid and a plurality of visually contrastive charged particles responsive to an addressing electric field.",
};

export const eInkArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "7a26f3cb899c45a278912efc012845dc71892e345b1287950c4a89d71b3e9451",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent",
        "Jacobson et al.",
        "Patent No.: US 6,120,588",
        "Date of Patent: Sep. 19, 2000",
        "ELECTRONICALLY ADDRESSABLE DISPLAY WITH VISUALLY CONTRASTIVE PARTICLES AND FLUID",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "ABSTRACT",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "An electronically addressable display includes a microencapsulated electrophoretic display medium having a dielectric fluid and visually contrastive particles suspended therein. The particles translate under applied electrostatic fields to produce bistable reflective imagery without continuous power consumption.",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND OF THE INVENTION",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Traditional electronic displays require active emissive illumination or continuous polarizers that suffer from high power drain, narrow viewing angles, and eye fatigue under ambient illumination.",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The present invention provides an electrophoretic display encapsulated in microscopic polymeric shells. Positively charged titanium dioxide white particles and negatively charged carbon black particles are suspended in a low-viscosity dyed or clear fluid, enabling zero-power image retention once particles are positioned at the viewing electrode.",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: literal(
        "An electrophoretic display comprising: a plurality of microscopic capsules each containing a dielectric fluid and a plurality of charged pigment particles having electrophoretic mobility; a first electrode disposed adjacent a viewing surface of the capsules; and a second electrode disposed opposite the first electrode, wherein application of an electric potential difference between the first and second electrodes causes the charged particles to migrate electrophoretically to alter the optical reflectance of the viewing surface.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Inventors: Joseph M. Jacobson, Barrett Comiskey, Paul Drzaic. Assignee: E Ink Corporation, Cambridge, MA.",
      ),
    },
  ],
};
