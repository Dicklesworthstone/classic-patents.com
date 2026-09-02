import type { Patent } from "@/types/patent";

import { zeppelinAirshipArchivalEdition } from "../editions/zeppelinAirshipEdition";

function manualClaimText(number: number): string {
  const block = zeppelinAirshipArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Zeppelin manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const zeppelinAirshipPatent: Patent = {
  id: "us-621195-zeppelin-airship",
  patentNumber: "US 621,195",
  title: "Navigable Balloon",
  shortTitle: "Zeppelin Navigable Balloon Compartments and Trim",
  subtitle: "Rigid Compartments, Maneuvering Gas Bags, and Running-Weight Control",
  inventors: ["Ferdinand Graf Zeppelin"],
  inventorLocation: "Stuttgart, Germany",
  grantDate: "1899-03-14",
  filingDate: "1897-12-29",
  era: "Gilded Age & Grid (1870–1900)",
  category: "aviation",
  categoryLabel: "Aerostatics & Navigable Balloons",
  summary:
    "Granted March 14, 1899, this specification describes a navigable balloon with separately arranged motors, a rigid compartmented framework, main and auxiliary gas bags, propellers, rudders, a movable running weight, and arrangements for coupling balloons into a train. The printed application date is December 29, 1897.",
  heroQuote:
    "This invention relates to a navigable balloon which is characterized essentially in that it is provided with a number of motors arranged separately from each other.",
  originalPdfUrl: "/patents/pdfs/us-621195-zeppelin-airship.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US621195A/en",
  originalTextAsset: {
    url: "/patents/transcripts/us-621195-zeppelin-airship-reviewed.txt",
    pageCount: 7,
    kind: "reviewed-transcription",
    reviewedBy:
      "Classic Patents editorial agent (embedded text-layer extraction; human review pending)",
    reviewedAt: "2026-08-22",
    sourcePdfSha256: "179d9d9b857e4bda8c35a4d9e8ee29d1e2fea5aa90705b0ddbe7d8cc6bb8d429",
  },
  archivalEdition: zeppelinAirshipArchivalEdition,
  usptoClassification:
    "Navigable balloons (historic specification; no classification printed on facsimile)",
  originalText: `UNITED STATES PATENT OFFICE.
FERDINAND GRAF VON ZEPPELIN, OF STUTTGART, GERMANY.

NAVIGABLE BALLOON.

SPECIFICATION forming part of Letters Patent No. 621,195, dated March 14, 1899.
Application filed December 29, 1897. Serial No. 664,295. (No model.)

To all whom it may concern:
Be it known that I, FERDINAND GRAF ZEPPELIN, general-lieutenant z. d. general à la suite of His Majesty the King of Württemberg, of Stuttgart, Germany, have invented certain new and useful Improvements in and Relating to Navigable Balloons; and I do hereby declare the following to be a full, clear, and exact description of the invention, such as will enable others skilled in the art to which it appertains to make and use the same.

This invention relates to a navigable balloon which is characterized essentially in that it is provided with a number of motors arranged separately from each other. In this manner it is possible to give the balloon or buoyant part of the apparatus, which receives the gas and is preferably cylindrical with rounded ends, a smaller diameter in proportion to the driving power developed by the motors and to correspondingly reduce the air resistance.`,
  plainEnglishExplanation: {
    overview:
      "The specification solves several operating problems inside a long buoyant hull: preserving lifting gas while vehicle weight changes, reaching all parts of the craft, steering it, changing its inclination, and joining a powered balloon to load-carrying balloons. Its stated means are compartmented gas bags, auxiliary maneuvering bags, a rigid gangway, paired air-screws, rudders, and movable weight or trailing-rope arrangements.",
    coreMechanism:
      "The source describes chambers inside a rigid tube, each receiving folded gas bags. Auxiliary maneuvering bags are filled before the main bags; releasing their gas creates room for the main bags to expand without admitting air. Beneath the hull, a running weight on ropes, drums, and fusees changes the craft’s inclination. The same document offers adjustable towing or trailing ropes and a train of powered and load-carrying balloons.",
    mechanicalBreakdown: [
      {
        title: "Compartmented framework and outer casing",
        summary:
          "Tubes, wire ropes, wire gauze, partitions, stays, rings, and an outer casing make the rigid form described in the specification.",
        technicalDetails:
          "The source identifies tubes r, wire ropes s, wire gauze or netting d, partition-walls a, vertical stays v, circumferential rings u, and diagonal stays w. It says silk or similar material is stretched over the framework; it does not state an alloy, dimensions, or structural load figures.",
        archaicTerm: "framework or skeleton",
        modernEquivalent: "structural frame",
      },
      {
        title: "Main and maneuvering gas bags",
        summary:
          "Separate chambers hold main gas bags plus auxiliary bags used to preserve the main gas quantity as carried weight changes.",
        technicalDetails:
          "The specification says the bags are introduced folded into separate rigid chambers, then filled. It describes safety and outlet valves, and says maneuvering bags are filled before connected main bags. It does not name the gas, bag material, or a number of cells.",
        archaicTerm: "maneuvering bags or containers",
        modernEquivalent: "auxiliary gas-volume bags",
      },
      {
        title: "Free volume for gas expansion",
        summary:
          "The main bags do not occupy all chamber volume, leaving room for expansion at altitude or when heated.",
        technicalDetails:
          "The source says the outer casing continuously maintains the cylindrical form and that filling stops with enough free space for expansion at great altitude and when heated. It does not specify fabric treatment, drag coefficient, or solar-reflection material.",
        archaicTerm: "outer shell or casing",
        modernEquivalent: "outer envelope",
      },
      {
        title: "Gangway and movable running weight",
        summary:
          "A gangway reaches the craft’s parts, while a suspended running weight can alter inclination.",
        technicalDetails:
          "A traveler supports the upper pulley block and moves on a wire rope between limits. Two drums with fusees keep rope tension as the running weight moves; the source presents this as a way to hold horizontal or inclined position. It gives no weight value or rail.",
        archaicTerm: "running-weight",
        modernEquivalent: "movable suspended trim mass",
      },
      {
        title: "Cars, air-screws, and rudders",
        summary:
          "Cars carry people and driving equipment; each driving mechanism operates two air-screws, while two rudders steer laterally.",
        technicalDetails:
          "The cars receive the aeronaut or controller, fuel or other material, passengers, and cargo. The air-screws are on both sides at about the center-of-resistance height; the source gives no engine maker, power, propeller diameter, or speed.",
        archaicTerm: "air-screws",
        modernEquivalent: "propellers",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Gas volume and lifting capacity",
        formula: "No numerical formula is printed in the specification.",
        explanation:
          "The source requires a gas charge sufficient to lift the craft while leaving room for expansion; it does not identify the lifting gas or quantify lift.",
      },
      {
        principle: "Rigid compartment structure",
        formula: "No stress equation or material strength is printed in the specification.",
        explanation:
          "The patent identifies tubes, ropes, mesh, partition-walls, rings, and stays as the parts that stiffen the framework and form gas-bag chambers.",
      },
      {
        principle: "Altitude and heating expansion allowance",
        formula: "No pressure law or pressure threshold is printed in the specification.",
        explanation:
          "The document says free space is left so gas can expand as the balloon rises to great altitudes or becomes heated, and it names safety and outlet valves without specifying their design.",
      },
      {
        principle: "Mass compensation during travel",
        formula: "No thermal or buoyancy equation is printed in the specification.",
        explanation:
          "The stated method uses maneuvering bags to avoid admitting air as consumed fuel reduces carried weight, and separately proposes transferring liquids or cargo among balloons of a train.",
      },
      {
        principle: "Suspended-weight trim",
        formula: "No moment equation or numerical trim condition is printed in the specification.",
        explanation:
          "The patent says the weight’s tendency to remain vertically below the traveler pulls the appropriate rope as the balloon’s end rises, while the fusee arrangement maintains slight tension in the ropes.",
      },
    ],
    whyItMattersToday:
      "This patent lays out early engineering choices for a rigid compartmented airship: internal gas-bag cells, auxiliary volume management, a gangway and cars, and a movable trim weight. The historical document is preserved here as printed, without modern aerodynamic coefficients or alloy assertions.",
  },
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Elevation View of the Navigable Balloon and Cars",
      caption:
        "Side elevation showing rigid compartmented framework, internal gas bags, suspended cars, and running-weight trim.",
      svgType: "zeppelin-airship",
      callouts: [
        {
          id: "z-r",
          figureRef: "Fig. 1",
          label: "r",
          element: "Longitudinal frame tubes",
          description: "Rigid frame longitudinal tubes maintaining cylindrical hull shape.",
          x: 45,
          y: 35,
        },
        {
          id: "z-a",
          figureRef: "Fig. 1",
          label: "a",
          element: "Transverse partition walls",
          description: "Partition walls dividing hull into independent chambers.",
          x: 30,
          y: 40,
        },
        {
          id: "z-k",
          figureRef: "Fig. 1",
          label: "k",
          element: "Suspended engine and crew cars",
          description: "Cars carrying crew and propulsion machinery.",
          x: 35,
          y: 75,
        },
        {
          id: "zeppelin-fig-1-l",
          figureRef: "Fig. 1",
          label: "l",
          element: "Lateral air-screws",
          description: "Lateral air-screws and propulsion propellers.",
          x: 38,
          y: 65,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Late 19th-century ballooning was entirely dependent on wind direction. Early non-rigid dirigibles (blimps) could not carry sufficient fuel or cargo because they relied on internal gas pressure to maintain aerodynamic shape, limiting their size and speed.",
    breakthroughInsight:
      "A rigid metallic framework covered with fabric can maintain a streamlined aerodynamic shape independent of internal gas pressure, allowing the hull to be scaled up massively to lift heavy propulsion machinery and large payloads while retaining structural integrity.",
    priorArtLimitations: [
      "Non-rigid balloons deformed at high speeds",
      "Gas envelopes could not support heavy engine mountings",
      "Thermal expansion caused dangerous pressure fluctuations in single-bag designs",
    ],
    patentWars: [],
    civilizationalImpact:
      "Zeppelin's rigid airship framework proved that large-scale controlled aerial navigation was possible. His designs led directly to the first commercial airlines (DELAG) and proved that humanity could build structures capable of crossing oceans in the air.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "In a balloon, the combination of a framework divided into separate compartments, each containing an independent gas-bag.",
      keyInnovations: [
        "Rigid compartmentalized framework",
        "Independent internal gas-bags",
        "Structural outer envelope",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "The combination of a balloon with a running-weight suspended beneath to adjust longitudinal inclination.",
      keyInnovations: [
        "Movable longitudinal running-weight",
        "Pitch trim adjustment",
        "Dynamic flight inclination",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "The combination of a balloon with a weight suspended beneath and adjustable towing or trailing ropes.",
      keyInnovations: ["Suspended stabilizing weight", "Trailing rope trim control"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish: "An air-craft comprising a series of balloons coupled together in a train.",
      keyInnovations: [
        "Articulated airship train",
        "Multi-hull tandem dirigible",
        "Flexible inter-car coupling",
      ],
    },
  ],
  stats: {
    totalClaims: 4,
    independentClaims: 4,
  },
};
