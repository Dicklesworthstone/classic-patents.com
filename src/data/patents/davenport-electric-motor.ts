import type { Patent } from "@/types/patent";
import { davenportElectricMotorArchivalEdition } from "../editions/davenportElectricMotorEdition";

function manualClaimText(number: number): string {
  const block = davenportElectricMotorArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Davenport manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const davenportElectricMotorPatent: Patent = {
  id: "us-132-davenport-electric-motor",
  patentNumber: "US 132",
  title: "Improvement in Propelling Machinery by Magnetism and Electro-Magnetism",
  shortTitle: "Davenport Contact-Plate Electric Motor",
  subtitle: "Revolving Galvanic Magnets, Fixed Copper Contact Plates, and Stationary Field Magnets",
  inventors: ["Thomas Davenport"],
  inventorLocation: "Brandon, Rutland County, Vermont",
  grantDate: "1837-02-25",
  filingDate: null,
  era: "Early Republic & Industrial Dawn (1790–1839)",
  category: "electricity",
  categoryLabel: "Electromagnetic Machinery & Motors",
  summary:
    "Davenport's sole claim applies magnetic and electro-magnetic power to move machinery. The specification describes rotating, silk-insulated electromagnets whose conductors make position-dependent contact with fixed copper plates, causing their poles to change as they pass stationary field magnets.",
  heroQuote: manualClaimText(1),
  originalPdfUrl: "/patents/pdfs/us-132-davenport-electric-motor.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US132/en",
  usptoClassification: "H02K 23/00 (DC commutator motors; Commutation)",
  originalTextAsset: {
    url: "/patents/transcripts/us-132-davenport-electric-motor-reviewed.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (StormyCreek)",
    reviewedAt: "2026-08-17",
    sourcePdfSha256: "9147fc5c9d6565aa765198b42e900c90c5c0fe550b9162fe62727f86a5071960",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "T. DAVENPORT. Electric Motor. No. 132. Patented Feb. 25, 1837.",
        sourceRelationship:
          "The first facsimile page is the drawing sheet, headed with the inventor, title, patent number, and patent date.",
      },
      {
        page: 2,
        exactSourceText: "UNITED STATES PATENT OFFICE.",
        sourceRelationship:
          "The second facsimile page begins the two-column specification with its formal masthead.",
      },
      {
        page: 3,
        exactSourceText:
          "that before attracted them; and in this manner the operation is continued",
        sourceRelationship:
          "The third facsimile page continues the polarity-change sentence and contains the claim, signature, and witnesses.",
      },
    ],
  },
  originalText: `UNITED STATES PATENT OFFICE.
THOS. DAVENPORT, OF BRANDON, VERMONT.

IMPROVEMENT IN PROPELLING MACHINERY BY MAGNETISM AND ELECTRO-MAGNETISM.

Specification forming part of Letters Patent No. 132, dated February 25, 1837.

To all whom it may concern:
Be it known that I, THOMAS DAVENPORT, of the town of Brandon, in the county of Rutland, State of Vermont, have made a discovery, being an Application of Magnetism and Electro-Magnetism to Propelling Machinery, which is described as follows, reference being had to the annexed drawings of the same, making part of this specification.

The machine for applying the power of magnetism and electro-magnetism is described as follows:

The frame A may be made of a circular or any other figure, divided into two or more platforms, B and C, upon which the apparatus rests, of a size and strength adapted for the purpose intended.`,
  archivalEdition: davenportElectricMotorArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "The specification treats continuous motion as a sequencing problem. Battery conductors meet separated copper plates around the shaft; because the coil wires travel with the rotor, their contacts and therefore their magnetic poles change as they pass the stationary magnets. The source does not set numerical power, speed, air-gap, or efficiency values.",
    coreMechanism:
      "Davenport places galvanic magnets M, N, O, and P on a wooden wheel attached to vertical shaft R. Their copper wires contact detached copper plates K and L on the lower platform, while stationary artificial magnets S and T face the shaft from the upper platform. In the stated starting condition, battery connections make one rotating magnet north and another south; the stationary poles attract them through a quarter-circle. After the arms pass the pole centers, the moving wires reach different contact plates, changing the rotating poles so that the same stationary poles repel them. Repetition produces rotary shaft motion.",
    mechanicalBreakdown: [
      {
        title: "Platforms and supporting frame",
        summary:
          "Frame A may be circular or another shape and is divided into two or more supporting platforms B and C.",
        technicalDetails:
          "The source gives the frame's role as structural support but deliberately permits its form to vary. It identifies upper and lower platforms instead of specifying a modern chassis material, dimension, or air gap.",
        archaicTerm: "frame A",
        modernEquivalent: "Machine frame and support platforms",
      },
      {
        title: "Galvanic battery and fixed contact plates",
        summary:
          "Alternating copper and zinc plates in diluted acid supply conductors to detached copper plates around the shaft.",
        technicalDetails:
          "The patent places K and L on the lower platform, detached from the shaft and from each other. The moving coil wires touch different plates as the shaft turns; the source describes that contact sequence, not a rotating split-cylinder commutator, brush material, or contact force.",
        archaicTerm: "galvanic battery",
        modernEquivalent: "Wet-cell electrical source",
      },
      {
        title: "Revolving galvanic magnets",
        summary:
          "Soft-iron arms M through P, wound with silk-insulated copper wire Q, rotate with shaft R.",
        technicalDetails:
          "The arms may be straight bars, horseshoes, or another form. Their wires run beside the shaft to the contact plates, and wheel V fixes the magnets to the shaft. That arrangement makes the rotating field responsive to rotor position without asserting a modern winding count or magnetic-flux value.",
        archaicTerm: "galvanic magnets",
        modernEquivalent: "Current-excited rotating electromagnets",
      },
      {
        title: "Artificial magnets",
        summary: "Stationary field magnets S and T face the shaft from the upper platform.",
        technicalDetails:
          "Davenport permits ordinary steel magnets or stationary galvanic magnets, with a number and strength chosen for the apparatus. Their poles point toward the shaft; the specification's crucial distinction is that they remain fixed while the galvanic magnets rotate.",
        archaicTerm: "artificial magnets",
        modernEquivalent: "Stationary field magnets",
      },
      {
        title: "Position-dependent pole change",
        summary:
          "Changing contact plates changes the rotating magnets' poles after they pass the stationary pole centers.",
        technicalDetails:
          "In the source's illustrative state, magnet 2 becomes north from the copper-side battery path and magnet 4 becomes south from the zinc-side path. Attraction carries them past poles 5 and 6; their wires then touch different plates and the former attraction becomes repulsion. This describes a contact-controlled reversal, not a specified switch timing or rotation rate.",
        archaicTerm: "quiescent state",
        modernEquivalent: "Initial rest condition",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Magnetic torque",
        formula: "τ = m × B",
        explanation:
          "This is a modern reading aid: a current-excited rotor magnetic moment experiences torque in a stationary magnetic field. The patent supplies the contact and pole sequence, not numerical magnetic moments or field measurements.",
      },
      {
        principle: "Current direction controls polarity",
        formula: "reversing coil current reverses the electromagnet's poles",
        explanation:
          "Davenport states this operation in words: contact with a copper-side or zinc-side conductor changes a galvanic magnet's north or south polarity. The separated contact plates provide a mechanical way to change that connection as the rotor moves.",
      },
      {
        principle: "Attraction followed by repulsion",
        formula: "contact change → pole change → continued shaft torque",
        explanation:
          "The document explicitly uses this cycle to avoid stopping at the stationary poles: once momentum carries the arms past a pole center, the new contact state makes the former attracting pole repel the arm instead.",
      },
    ],
    whyItMattersToday:
      "The facsimile gives a compact, inspectable account of a position-dependent contact system that changes rotating electromagnet poles to sustain shaft motion. It is most useful as an early primary-source example of the control problem behind continuous electromagnetic rotation, rather than as evidence for any particular modern motor design or performance figure.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Davenport claims the use of magnetic and electromagnetically generated force to drive machinery by the stated rotating arrangement, and also arrangements materially the same in principle. The claim does not separately enumerate a commutator or a fixed number of poles; those limits are supplied by the described mechanism.",
      keyInnovations: [
        "Magnetic motive power",
        "Continuous rotary shaft motion",
        "Galvanic electromagnet switching arrangement",
      ],
      legalSignificance:
        "The claim's actual broad language is preserved in the edition. It is historically important as an early United States electric-motor claim, but it must not be recast as a modern claim set with invented dependent claims.",
    },
  ],
  drawings: [
    {
      figureNumber: "Unnumbered drawing sheet",
      title: "Three source views of Davenport's electromagnetic machine",
      caption:
        "The grant prints three unnumbered views: a perspective apparatus view, a rotor-and-field plan, and a lower contact-plate plan. The letters below follow the source rather than imposing a modern figure number.",
      svgType: "davenport-electric-motor",
      callouts: [
        {
          id: "dm-1",
          figureRef: "Unnumbered drawing sheet",
          label: "A",
          element: "Frame",
          description: "The supporting frame identified as A in the specification.",
          x: 50,
          y: 20,
        },
        {
          id: "dm-2",
          figureRef: "Unnumbered drawing sheet",
          label: "B, C",
          element: "Supporting platforms",
          description: "The two platforms on which the apparatus rests.",
          x: 50,
          y: 65,
        },
        {
          id: "dm-3",
          figureRef: "Unnumbered drawing sheet",
          label: "D–I",
          element: "Battery and conductors",
          description:
            "Battery D, copper and zinc plates E and F, acid vessel G, and conductors H and I.",
          x: 18,
          y: 58,
        },
        {
          id: "dm-4",
          figureRef: "Unnumbered drawing sheet",
          label: "K, L",
          element: "Detached copper contact plates",
          description:
            "Separate copper plates around the shaft that the moving magnet wires contact.",
          x: 50,
          y: 80,
        },
        {
          id: "dm-5",
          figureRef: "Unnumbered drawing sheet",
          label: "M–P, Q",
          element: "Revolving galvanic magnets and wire",
          description:
            "Soft-iron rotating arms M through P wound with silk-insulated copper wire Q.",
          x: 50,
          y: 45,
        },
        {
          id: "dm-6",
          figureRef: "Unnumbered drawing sheet",
          label: "R, V",
          element: "Shaft and wooden wheel",
          description: "Vertical shaft R and the horizontal wooden wheel V fixed to it.",
          x: 50,
          y: 55,
        },
        {
          id: "dm-7",
          figureRef: "Unnumbered drawing sheet",
          label: "S, T",
          element: "Stationary artificial magnets",
          description: "The fixed field magnets arranged with their poles toward the shaft.",
          x: 50,
          y: 30,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification addresses how magnetic and electro-magnetic power can produce continuing rotary motion to propel machinery.",
    priorArtLimitations: [
      "The facsimile does not provide a comparative prior-art survey or numerical performance limits.",
      "It instead distinguishes stationary artificial magnets from the revolving galvanic magnets and describes the contact sequence that changes the latter's poles.",
    ],
    breakthroughInsight:
      "The mechanism makes the electrical connection position-dependent: after the rotating arms pass the field-pole centers, their wires reach different fixed copper plates and the source says the former attraction becomes repulsion.",
    patentWars: [],
    civilizationalImpact:
      "US 132 preserves a detailed nineteenth-century explanation of an electromagnetic rotary-motion mechanism, including the battery, contact plates, rotating coils, fixed field magnets, and the exact attraction-to-repulsion sequence.",
    aftermath:
      "The pinned facsimile records the specification, claim, signature, and witnesses; it does not establish later commercial outcomes, litigation, or historical superlatives.",
    sideNotes: [
      "The first PDF page is an unnumbered drawing sheet; the specification spans the two remaining pages.",
      "The grant prints one unnumbered claim, represented as reader anchor Claim 1 without changing its wording.",
    ],
  },
  tags: [
    "Thomas Davenport",
    "Electric Motor",
    "DC Motor",
    "Commutator",
    "Electromagnetism",
    "Industrial Electrification",
  ],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
  },
};
