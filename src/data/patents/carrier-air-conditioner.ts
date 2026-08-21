import { carrierAirConditionerArchivalEdition } from "@/data/editions/carrierAirConditionerEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = carrierAirConditionerArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Carrier manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const carrierAirConditionerPatent: Patent = {
  id: "us-808897-carrier-air-conditioner",
  patentNumber: "US 808,897",
  title: "Apparatus for Treating Air",
  shortTitle: "Wet-Plate Air Purifier",
  subtitle: "A sprayed-air washer with sinuous separator plates for particle and droplet removal",
  inventors: ["Willis H. Carrier"],
  inventorLocation: "Buffalo, New York",
  grantDate: "1906-01-02",
  filingDate: "1904-09-16",
  era: "Progressive Era (1900–1920)",
  category: "consumer",
  categoryLabel: "Air Treatment & Environmental Engineering",
  summary:
    "US 808,897 claims an air-purifying apparatus in which a fine spray wets suspended material and an upright, zigzag plate separator removes liquid and the material captured by it. This 1904 filing is specifically about the construction and action of the separator plates, rather than a later Carrier environmental-control system.",
  heroQuote: "The two portions of the separator-plates perform distinct functions.",
  originalPdfUrl: "/patents/pdfs/us-808897-carrier-air-conditioner.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US808897A/en",
  usptoClassification: "Air-purifying apparatus",
  originalTextAsset: {
    url: "/patents/transcripts/us-808897-carrier-air-conditioner-reviewed.txt",
    pageCount: 4,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "b8cfbb69e27934862236ecabf03396e67d04a4b4011c98083f1205cd76f0291e",
  },
  archivalEdition: carrierAirConditionerArchivalEdition,
  originalText:
    "This grant describes an air conduit, a fine spray, and a two-stage plate separator. Its five claims protect the geometry of the upright sinuous plates and their gutters, not an automatic thermal-control system.",
  plainEnglishExplanation: {
    overview:
      "Carrier washes an air stream with a fine liquid spray, then sends that wet stream through repeated turns between shaped upright plates. Dirt is thrown into the wet film; the plate geometry then removes free droplets while keeping the pressure loss modest.",
    coreMechanism:
      "A fan K moves air through casing M. Spray device H makes a fine liquid spray. The front plate faces i remain wet and collect suspended matter as the air turns through them. Rear flanges b and c form gutters that interrupt liquid travel across the later bends, separating free droplets before the air leaves the apparatus.",
    mechanicalBreakdown: [
      {
        title: "Spray device H",
        summary:
          "A supply pipe and whirling nozzles distribute treating liquid through the incoming air.",
        technicalDetails:
          "The specification permits water or another treating liquid. Its shown nozzles h impart circular motion to the issuing liquid to make a fine spray; it does not state a refrigeration temperature, pump pressure, or automatic environmental controller.",
        archaicTerm: "Atomized spray",
        modernEquivalent: "Fine-droplet air washer spray",
      },
      {
        title: "Sinuous separator plates",
        summary: "Upright plates make the air follow a sequence of oblique turns.",
        technicalDetails:
          "The turns bring the stream into contact with wetted faces. Inertia and the curved path drive suspended solid material toward the liquid film, which carries it down to trap J and filter or sieve L.",
        archaicTerm: "Separator plates or elements",
        modernEquivalent: "Wet baffle or mist-eliminator plates",
      },
      {
        title: "Rear flanges and gutters",
        summary:
          "The plate's rear section limits liquid flow across successive faces to remove droplets from air.",
        technicalDetails:
          "Projections b and c obstruct liquid motion at the bends, while gutter a collects liquid at the rear edge. The claim language makes the unobstructed wet front and obstructed rear a deliberate two-stage arrangement.",
        archaicTerm: "Flanges or lips",
        modernEquivalent: "Droplet-separation gutters",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Inertial impaction in a turning flow",
        formula:
          "\\text{Stk} = \\frac{\\rho_p d_p^2 u_0}{18 \\mu D} \\quad \\text{and} \\quad \\eta_{\\text{impaction}} = f(\\text{Stk})",
        explanation:
          "The document says that particles are thrown against the wet film by their inertia and by centrifugal force from the sinuous air path. In modern terms, a particle cannot follow every abrupt streamline turn as readily as the carrier gas, so it contacts the wetted surface.",
      },
      {
        principle: "Gravity drainage and liquid-film capture",
        formula:
          "q_{\\text{film}} = \\frac{\\rho g \\delta^3}{3 \\mu} \\quad \\text{and} \\quad \\Delta P_{\\text{loss}} = \\zeta \\frac{\\rho v^2}{2}",
        explanation:
          "The front plate surfaces intentionally remain wet. Captured material is washed downward by that film into basin or trap J, while the rear plate geometry seeks to separate free liquid from the outgoing air.",
      },
    ],
    whyItMattersToday:
      "The patent records a practical early air-washer and mist-separator problem: create wet contact for particle capture, then prevent liquid carryover. Its complete source also matters because it distinguishes this plate-separator grant from Carrier's other air-treatment work.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 covers the complete separator assembly inside an air conduit. Each upright plate must have successive oblique faces that make a continuous sinuous surface; its front portion remains unobstructed so liquid can spread from face to face, while the succeeding portion has projections that stop liquid from continuing along the conduit and help remove it from the air. The plates must be spaced to make the matching continuous sinuous air passages.",
      keyInnovations: [
        "Two-zone plate surface with unobstructed wet front portion",
        "Projected rear portion that interrupts lengthwise liquid flow",
        "Spaced plates forming continuous sinuous conduit passages",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 claims the air-moistening combination with the separator. It requires moistening means, an air conduit, and spaced upright plates whose upright bends produce oblique faces and sinuous passages. It then specifies smooth, unobstructed front plate surfaces and surface projections in the succeeding plate portions that obstruct liquid travel lengthwise of the conduit. Unlike Claim 1, this wording expressly includes the means that wet the incoming air.",
      keyInnovations: [
        "Air-moistening means coupled to the separator",
        "Smooth unobstructed front plate surfaces",
        "Succeeding plate-surface projections that block conduitwise liquid flow",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 narrows the moistening-air apparatus to the bend-and-gutter arrangement. The spaced upright plates must have upright bends that define continuous sinuous air passages, and some of those bends must carry projecting flanges. Those flanges form upright gutters, making the drainage and droplet-separation feature itself part of the claimed combination.",
      keyInnovations: [
        "Upright bends defining continuous sinuous air passages",
        "Projecting flanges mounted on selected bends",
        "Upright gutters formed by the flanges",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 states a shorter combination claim for the moistening means, conduit, and separator. Its plate limitation is a continuous zigzig surface on spaced upright plates, with projections that form gutters at the salient portions of those surfaces. It does not restate the full front-versus-rear distribution language of Claim 1; the protected detail here is the continuously folded surface and gutter placement at its projecting turns.",
      keyInnovations: [
        "Continuous zigzig plate surfaces",
        "Gutters located at salient surface portions",
        "Compact moistening-air separator combination",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "Claim 5 is directed to one separator plate rather than the whole air-treatment apparatus. The plate is made from separate angled sections. The front part of the rear section must project past the rear part of the adjacent front section, so their overlap creates a gutter at the junction. That overlap geometry is the claimed article-level construction.",
      keyInnovations: [
        "Separate angled separator-plate sections",
        "Rear-section front edge projecting beyond the adjacent section",
        "Junction gutter created by overlapping section geometry",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Complete air-treatment apparatus",
      caption:
        "Part elevation and part vertical section of the air-treatment apparatus described in US 808,897.",
      svgType: "carrier-air-apparatus",
      callouts: [
        {
          id: "c-m",
          figureRef: "Fig. 1",
          label: "m",
          element: "Air trunk, conduit, or casing",
          description: "Enclosure housing spray nozzles and separator plates.",
          x: 50,
          y: 35,
        },
        {
          id: "c-h",
          figureRef: "Fig. 1",
          label: "h",
          element: "Spray nozzle",
          description: "Water header distributing atomized spray across incoming air.",
          x: 25,
          y: 40,
        },
        {
          id: "c-i",
          figureRef: "Fig. 1",
          label: "i",
          element: "Oblique front plate faces",
          description: "Wetted faces receiving particles carried into the sinuous path.",
          x: 60,
          y: 40,
        },
        {
          id: "c-k",
          figureRef: "Fig. 1",
          label: "k",
          element: "Fan or other propelling device",
          description: "The source-named device causing the air current through casing m.",
          x: 85,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Separating device, horizontal section",
      caption: "Enlarged fragmentary horizontal section through the separating device.",
      svgType: "carrier-separator-horizontal",
      callouts: [
        {
          id: "c-pass",
          figureRef: "Fig. 2",
          label: "j",
          element: "Simple upright bend",
          description: "Continuous turning channels between adjacent wetted plates.",
          x: 50,
          y: 45,
        },
        {
          id: "c-gut",
          figureRef: "Fig. 2",
          label: "b",
          element: "Projecting flange and gutter",
          description:
            "Flange b, with corresponding flange c, arrests liquid film travel across successive faces.",
          x: 70,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Separating-device diagram",
      caption: "Diagram of the separating device.",
      svgType: "carrier-separator-diagram",
      callouts: [
        {
          id: "c-flow",
          figureRef: "Fig. 3",
          label: "f",
          element: "Rear oblique face",
          description:
            "Rear face f, with face g, carries the projecting flanges that obstruct liquid flow.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Separator plate or element",
      caption: "Perspective view of one separator plate or element.",
      svgType: "carrier-separator-plate",
      callouts: [
        {
          id: "c-plate",
          figureRef: "Fig. 4",
          label: "a",
          element: "Rear gutter or recess",
          description: "Gutter or recess formed at the upright rear edge of the last section.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 5",
      title: "Spray nozzle in section",
      caption: "Enlarged section of one detached spray nozzle.",
      svgType: "carrier-spray-nozzle",
      callouts: [
        {
          id: "c-noz",
          figureRef: "Fig. 5",
          label: "h",
          element: "Whirling spray nozzle",
          description: "Atomizing nozzle imparting circular motion to liquid.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 6",
      title: "Spray nozzle in a second plane",
      caption: "Enlarged section in a different plane of the detached spray nozzle.",
      svgType: "carrier-spray-nozzle-alt",
      callouts: [
        {
          id: "c-noz2",
          figureRef: "Fig. 6",
          label: "h",
          element: "Spray nozzle in second section plane",
          description: "The same source-named spray nozzle h shown in a different plane.",
          x: 50,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "An air washer needs to expose suspended material to liquid, then remove the liquid and captured material without allowing the air to bypass the separator path.",
    priorArtLimitations: [
      "A simple spray can leave liquid droplets entrained in the outgoing air.",
      "A plate that drains liquid too early loses wet contact area; a plate that retains too much liquid can leave carryover.",
    ],
    breakthroughInsight:
      "Carrier divides the plate into a wet, unobstructed front contact zone and a rear zone with projections and gutters, so the same sinuous path can first capture material and then separate liquid.",
    patentWars: [],
    civilizationalImpact:
      "The document is an early industrial treatment of air washing and mist separation. It should not be used as evidence for thermal or moisture-control features absent from its source.",
    aftermath:
      "The printed grant identifies Buffalo Forge Company as assignee. This edition limits its historical claims to what the primary facsimile and its masthead establish.",
  },
  tags: ["Willis H. Carrier", "air washer", "air purification", "mist elimination"],
  stats: {
    totalClaims: 5,
    independentClaims: 5,
  },
};
