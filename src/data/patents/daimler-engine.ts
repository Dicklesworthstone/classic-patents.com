import { daimlerMarineEngineArchivalEdition } from "@/data/editions/us-361931-daimler-engine";
import type { Patent } from "@/types/patent";

/**
 * Claims are authored once in the archival edition. The catalogue record
 * reads those exact nodes so the legal text cannot drift between projections.
 */
function manualClaimText(number: number): string {
  const block = daimlerMarineEngineArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Daimler manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

/**
 * US 361,931 is a marine-engine installation patent. Its pinned six-page
 * facsimile does not describe a motor carriage; the record is deliberately
 * limited to what that primary source presents.
 */
export const daimlerEnginePatent: Patent = {
  id: "us-361931-daimler-engine",
  patentNumber: "US 361,931",
  title: "Explosive-Gas Marine Engine",
  shortTitle: "Marine Propulsion Engine",
  subtitle:
    "A friction-coupled, reversible screw-propeller installation for a gas or petroleum motor",
  inventors: ["Gottlieb Daimler"],
  inventorLocation: "Cannstatt, Würtemberg, Germany",
  grantDate: "1887-04-26",
  filingDate: "1886-11-09",
  era: "Gilded Age & Grid (1870–1900)",
  category: "consumer",
  categoryLabel: "Marine Propulsion & Internal-Combustion Engines",
  summary:
    "Granted on April 26, 1887, US 361,931 describes Gottlieb Daimler's installation of a gas or petroleum motor in a boat or vessel. The specification couples an in-line motor shaft to a longitudinally movable propeller shaft, uses friction contact for forward motion and a reversing arrangement for backward motion, and also sets out steering, thrust-bearing starting, water cooling, and gas-reservoir arrangements. It is not a motor-carriage patent.",
  heroQuote:
    "My invention relates to apparatus for effecting the propulsion of a boat or vessel by a gas or petroleum motor instead of by a steam-engine.",
  originalPdfUrl: "/patents/pdfs/us-361931-daimler-engine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US361931A/en",
  usptoClassification:
    "B63H 23/30 (marine-propulsion power transmission characterized by clutches)",
  originalTextAsset: {
    url: "/patents/transcripts/us-361931-daimler-engine-reviewed.txt",
    pageCount: 6,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (codex-hotel)",
    reviewedAt: "2026-08-17",
    sourcePdfSha256: "1c20cb38fad97fe6658cd711d7009dcb70da74af4cf22aec380882e055407159",
  },
  originalText: `UNITED STATES PATENT OFFICE.
GOTTLIEB DAIMLER, OF CANNSTADT, WÜRTEMBERG, GERMANY.

EXPLOSIVE-GAS MARINE ENGINE.

SPECIFICATION forming part of Letters Patent No. 361,931, dated April 26, 1887.
Application filed November 9, 1886. Serial No. 218,411. (No model.)

My invention relates to apparatus for effecting the propulsion of a boat or vessel by a gas or petroleum motor instead of by a steam-engine, whereby a maximum of speed is obtained with a minimum extent of immersion of the vessel.`,
  archivalEdition: daimlerMarineEngineArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "The patent addresses a marine installation, not a road vehicle. Daimler proposes replacing a vessel's steam engine, coal, water, and associated ballast with a gas or petroleum motor, then solving the installation problems that follow: engaging a screw propeller gradually, reversing it, taking propeller thrust, steering from the same station, cooling the cylinder, and storing combustible gas aboard.",
    coreMechanism:
      "The motor shaft and propeller shaft are in line. For forward motion, the operator moves the propeller shaft toward the motor until two half-couplings make frictional contact; propeller thrust is intended to maintain that contact. For reverse, the shaft moves back, separating the forward coupling while levers press intermediate friction disks against a reversing disk. The patent therefore changes propeller direction through a mechanical coupling arrangement while the motor is described as running continuously in one direction.",
    mechanicalBreakdown: [
      {
        title: "Movable propeller shaft and forward coupling",
        summary:
          "The propeller shaft slides longitudinally so its half-coupling can engage the half-coupling fixed to the motor shaft.",
        technicalDetails:
          "The source calls for a propeller shaft in line with the motor shaft and capable of longitudinal motion in its bearings. Pushing it forward produces frictional engagement for starting ahead; the propeller's thrust is said to maintain contact. The source permits either conical or flat coupling faces and specifies gradual engagement through spring and control hardware.",
        archaicTerm: "half-coupling",
        modernEquivalent: "One mating member of a friction clutch",
      },
      {
        title: "Reverse mechanism",
        summary:
          "Drawing the shaft back releases the ahead coupling and presses intermediate disks against a reversing disk.",
        technicalDetails:
          "Elbow levers transmit the shaft's longitudinal movement to the intermediate disks. Their pressure makes the screw rotate in the contrary direction for astern propulsion. The specification also discloses an alternative with bevel wheels kept in mesh, but does not claim a vehicle differential.",
        archaicTerm: "friction-disks",
        modernEquivalent: "Friction clutch plates",
      },
      {
        title: "Combined operating station",
        summary:
          "The control hardware groups propulsion engagement and steering at the steersman's seat.",
        technicalDetails:
          "A screw spindle, hand wheel or crank, lever, collars, and spring control forward motion of the propeller shaft. A rudder shaft is operated by levers, and the patent says the spindle may pass through or sit beside that steering shaft so the controls are together at seat p. This is a positional arrangement, not an automobile steering system.",
        archaicTerm: "screw-spindle",
        modernEquivalent: "Threaded control screw",
      },
      {
        title: "Thrust bearing and starting crank",
        summary:
          "A bearing at the motor's front takes propeller thrust and temporarily turns the motor for starting.",
        technicalDetails:
          "The bearing contains a sliding pin that can engage a stud on the motor shaft. Turning its crank starts the engine; once started, the inclined pin is pushed out of gear so the bearing and crank remain stationary. The arrangement keeps propeller axial load and starting action in the described bearing assembly.",
        archaicTerm: "thrust-bearing",
        modernEquivalent: "Axial-load bearing",
      },
      {
        title: "Cooling and gas storage",
        summary:
          "The specification uses surrounding water for cylinder cooling and describes vessel spaces as gas reservoirs.",
        technicalDetails:
          "Cooling water may be driven through a cylinder jacket by the vessel's forward motion through siphon-like piping, by a centrifugal pump, or by both. For combustible gas, high-pressure holders feed a low-pressure bag-like reservoir; the source says lined hull spaces and holders can also serve as floats. These are named arrangements and conditions of the marine installation, not claims about a gasoline road engine.",
        archaicTerm: "gas-holder",
        modernEquivalent: "Pressurized gas storage vessel",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Frictional torque transmission",
        formula: "T \\leq \\mu N r",
        explanation:
          "The forward and reverse arrangements depend on normal force pressing friction surfaces together. Increasing that force raises the torque that can be transmitted before slip, subject to the friction coefficient μ and effective radius r. The source's spring, lever, and spindle provide the engagement force; it gives no numerical coefficient, force, or speed.",
      },
      {
        principle: "Propeller thrust as an axial load",
        formula: "F_T = \\dot{m}(v_{\\text{wake}} - v_{\\text{inlet}})",
        explanation:
          "A propeller accelerates water and experiences an opposing axial thrust. The patent uses that thrust mechanically: in ahead motion it is stated to maintain the required coupling contact, while a thrust bearing receives the load. The formula is a modern momentum-accounting explanation, not a formula printed in the 1887 patent.",
      },
      {
        principle: "Water-jacket heat removal",
        formula: "\\dot Q = \\dot m c_p (T_{\\text{out}}-T_{\\text{in}})",
        explanation:
          "Water circulated through the cylinder jacket removes heat in proportion to its mass flow, heat capacity, and temperature rise. The facsimile proposes flow caused by forward motion, a centrifugal pump, or their combination; it does not state temperatures or flow rates.",
      },
    ],
    whyItMattersToday:
      "The record preserves a distinct 1887 marine-propulsion design problem: joining an internal-combustion motor to a screw propeller while providing controlled ahead and astern motion, steering, axial-load support, cooling, and onboard fuel-gas storage. Its ten claims make those combinations legible without converting the document into a patent for a motor carriage.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 covers the specified vessel propulsion combination: an in-line gas or petroleum motor, a propeller shaft with one clutch member, an engine shaft with the other member for ahead motion, and gearing for astern motion.",
      keyInnovations: [
        "In-line motor and propeller shafts",
        "Forward friction coupling",
        "Astern gearing",
      ],
      legalSignificance:
        "This is a combination claim; its scope is limited to the stated vessel, shaft, coupling, and reverse-gearing arrangement.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 covers an in-line gas or petroleum motor and a propeller shaft that slides longitudinally in its bearings. That axial movement engages or disengages the shaft's friction-clutch half with the matching half on the engine shaft, defining the claimed ahead-drive control relationship.",
      keyInnovations: [
        "Longitudinally movable propeller shaft",
        "Engageable friction clutch",
        "In-line shaft arrangement",
      ],
      legalSignificance:
        "The legal work is done by the specified movement-and-coupling relationship, not by a generic propeller alone.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 requires the gas or petroleum motor, its friction-coupled propeller shaft, and bearings that allow longitudinal sliding. Its distinct legal result is that propeller thrust, once the coupling is engaged, maintains the frictional contact while the propeller is moving.",
      keyInnovations: [
        "Thrust-maintained coupling contact",
        "Sliding shaft bearings",
        "Friction-coupled propulsion",
      ],
      legalSignificance:
        "This claim narrows the claimed result to a propeller-shaft arrangement where thrust performs the stated contact-maintaining role.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 covers the reverse train specifically: disks c, e' and e², plus levers f' and f² connected to the sliding propeller shaft. Those parts reverse propeller rotation, and reverse propeller pull is arranged to create the frictional contact needed between the named disks.",
      keyInnovations: [
        "Reversing disk",
        "Intermediate friction disks",
        "Lever-actuated reverse contact",
      ],
      legalSignificance:
        "It claims the particular disk-and-lever reverse mechanism, including its stated thrust/pull effect.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "Claim 5 combines a vessel motor, its friction-coupled propeller shaft, and thrust-bearing q, which receives the propeller's axial load. It also requires starting means comprising crank-handle r and sliding pin r², the temporary engagement that turns the engine during starting.",
      keyInnovations: ["Propeller thrust bearing", "Crank-handle starting", "Sliding starting pin"],
      legalSignificance:
        "Its scope is the expressly named bearing-and-starting combination in the propulsion installation.",
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualClaimText(6),
      plainEnglish:
        "Claim 6 claims the combined control arrangement for steering and shifting propulsion. It names rudder, vertical shaft o', levers o² and o³, chain n or equivalent screw-spindle k, and connecting devices that let one grouped mechanism turn the rudder while moving the longitudinally sliding propeller shaft.",
      keyInnovations: ["Rudder linkage", "Shared control station", "Propeller-shaft shifting"],
      legalSignificance:
        "The claim is limited to the enumerated combination that both steers and shifts the propeller shaft.",
    },
    {
      number: 7,
      isIndependent: true,
      originalText: manualClaimText(7),
      plainEnglish:
        "Claim 7 covers a motor-cylinder water jacket supplied by fore and aft pipes s' and s². The pipes communicate with the surrounding water and are arranged for siphon-like action, so vessel motion can circulate outside water through the jacket to cool the cylinder.",
      keyInnovations: [
        "Cylinder water jacket",
        "Fore-and-aft cooling pipes",
        "Siphon-like circulation",
      ],
      legalSignificance:
        "This is a cooling-system combination claim, not a claim to every water-cooled engine.",
    },
    {
      number: 8,
      isIndependent: true,
      originalText: manualClaimText(8),
      plainEnglish:
        "Claim 8 retains the water jacket and fore-and-aft siphon-like pipes communicating with outside water, then adds centrifugal pump u. The pump is the claimed active circulation element, distinguishing this combination from claim 7's outside-water flow arrangement without that named pump.",
      keyInnovations: ["Cylinder water jacket", "Centrifugal pump", "External-water circulation"],
      legalSignificance: "The claim requires the stated jacket, pipe, and pump combination.",
    },
    {
      number: 9,
      isIndependent: true,
      originalText: manualClaimText(9),
      plainEnglish:
        "Claim 9 adds branch pipe v and its three-way cock to the jacket, fore-and-aft pipes, siphon-like outside-water communication, and centrifugal pump u. The cock selects whether circulating cooling water comes from the surrounding water or from the vessel's bilge.",
      keyInnovations: ["Three-way cock", "Bilge-water branch", "Pumped cooling circuit"],
      legalSignificance:
        "Its added legal limitation is the branch and three-way selection feature within the specified cooling system.",
    },
    {
      number: 10,
      isIndependent: true,
      originalText: manualClaimText(10),
      plainEnglish:
        "Claim 10 joins the complete gas-propelled vessel installation: a longitudinally sliding screw-propeller shaft, friction coupling to the engine shaft, and shifting means for varying speed, stopping, and reversing. It also requires a low-pressure combustible-gas reservoir replenished by high-pressure holders through reducing cocks or valves.",
      keyInnovations: [
        "Sliding reversible propeller shaft",
        "Low-pressure gas reservoir",
        "High-pressure holders with reducing valves",
      ],
      legalSignificance:
        "This is the broadest printed installation combination: propulsion control plus the specified two-pressure gas-supply arrangement.",
    },
  ],
  drawings: [
    {
      figureNumber: "Figs. 1–6",
      title: "Explosive-Gas Marine Engine installation and details",
      caption:
        "The three drawing sheets show a vessel with its motor, propeller, steering and cooling arrangements, the thrust-bearing details, and high-pressure gas-holder sections. All labels and views are from the US 361,931 facsimile.",
      svgType: "generic",
      callouts: [
        {
          id: "de-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Motor-engine",
          description: "The gas or petroleum motor-engine identified as A in the specification.",
          x: 53,
          y: 48,
        },
        {
          id: "de-2",
          figureRef: "Fig. 1",
          label: "d",
          element: "Screw-propeller",
          description: "The screw-propeller fixed at the outer end of propeller shaft b.",
          x: 25,
          y: 48,
        },
        {
          id: "de-3",
          figureRef: "Fig. 2",
          label: "m",
          element: "Rudder",
          description:
            "The rudder connected to the steering mechanism described in the specification.",
          x: 50,
          y: 77,
        },
        {
          id: "de-4",
          figureRef: "Fig. 4",
          label: "q",
          element: "Thrust-bearing",
          description:
            "The bearing that receives propeller thrust and carries the starting arrangement.",
          x: 28,
          y: 72,
        },
        {
          id: "de-5",
          figureRef: "Fig. 5",
          label: "w²",
          element: "High-pressure gas-holder",
          description: "A sectional view of a high-pressure gas-holder.",
          x: 50,
          y: 45,
        },
        {
          id: "de-6",
          figureRef: "Fig. 6",
          label: "w²",
          element: "Gas-holder section",
          description: "A transverse section of the Fig. 5 high-pressure gas-holder.",
          x: 62,
          y: 67,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification identifies the marine burden it addresses: a steam engine requires coal, water, and metal ballast, increasing a vessel's immersion and consuming capacity that could carry a load.",
    priorArtLimitations: [
      "The patent contrasts its gas or petroleum motor installation with a steam engine and its stated coal, water, and ballast burden.",
      "The source says the propeller installation needs controlled starting, stopping, reversing, steering, thrust support, cylinder cooling, and, when gas is used, onboard storage.",
    ],
    breakthroughInsight:
      "The source's central installation move is a longitudinally movable propeller shaft: friction contact carries the vessel ahead, a reversing disk arrangement carries it astern, and the controls can be located together at the steersman's seat.",
    patentWars: [],
    civilizationalImpact:
      "US 361,931 documents an 1886–87 attempt to make a gas or petroleum motor serve a complete marine-propulsion system. Its claims preserve specific mechanical and cooling combinations for a vessel, rather than a generic story of road transport.",
    funFact:
      "The signed specification names Wilhelm Maybach and Herman Keppler as its two witnesses; the three drawing sheets instead bear the lithographic witnesses George B. Ailes and Robert Garrett.",
    sideNotes: [
      "The specification records French, Belgian, Italian, German, and British patent activity, with the dates and numbers printed in its heading and opening paragraph.",
      "It refers to Daimler's US Patent No. 349,983, dated September 28, 1886, for the gas or petroleum motor employed by preference.",
    ],
  },
  tags: [
    "Gottlieb Daimler",
    "Marine propulsion",
    "Screw propeller",
    "Friction coupling",
    "Gas motor",
    "Water cooling",
    "1887",
  ],
  stats: { totalClaims: 10, independentClaims: 10 },
};
