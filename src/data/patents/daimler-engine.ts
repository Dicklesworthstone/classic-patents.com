import { daimlerMarineEngineArchivalEdition } from "@/data/editions/us-361931-daimler-engine";
import type { Patent } from "@/types/patent";

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
    url: "/patents/transcripts/us-361931-daimler-engine.txt",
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
      originalText:
        "The combination, with the propeller and propeller-shaft of a vessel and with part of a friction-coupling on said shaft, of a gas or petroleum motor-engine having its shaft arranged in line with the propeller-shaft and provided with part of a friction-coupling for effecting the forward motion of the vessel and gearing between the propeller-shaft and the part of the friction-coupling on the engine for effecting the backward motion of the vessel, substantially as described.",
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
      originalText:
        "The combination, with the propeller-shaft having a longitudinal movement in its bearings and provided with part of a friction-clutch, of a gas or petroleum motor-engine having its shaft arranged in line with the propeller-shaft and provided with part of a friction-coupling which engages and disengages the part of the friction-coupling by the longitudinal movement of said propeller-shaft, substantially as described.",
      plainEnglish:
        "Claim 2 focuses on the longitudinally movable propeller shaft and its use to engage and disengage the two friction-coupling parts.",
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
      originalText:
        "In combination with a gas or petroleum motor-engine, a propeller-shaft connected to the engine-shaft by a friction-coupling and capable of sliding longitudinally in its bearings, so that the thrust of the propeller when in motion will maintain the frictional contact of the coupling.",
      plainEnglish:
        "Claim 3 states that propeller thrust maintains frictional clutch contact after the sliding shaft has engaged it.",
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
      originalText:
        "In combination with the frictional coupling connecting the engine-shaft with the sliding propeller-shaft, the friction-disks c e' e² and the levers f' f², connected to the propeller-shaft, constituting mechanism for reversing the motion of the propeller, the pull of the latter when reversed being made to effect the required frictional contact between the disks e' e² and c for this purpose.",
      plainEnglish:
        "Claim 4 covers the named reversing disks and levers, with reverse propeller pull maintaining their frictional contact.",
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
      originalText:
        "The combination, with a motor-engine, the propeller-shaft of a vessel, and a friction-coupling connecting the engine and propeller-shaft, of a thrust-bearing, q, for taking the thrust of the propeller, and means for starting the engine, comprising the crank-handle r and sliding pin r², substantially as described.",
      plainEnglish:
        "Claim 5 combines a propeller-thrust bearing with the crank handle and sliding pin used to start the motor.",
      keyInnovations: ["Propeller thrust bearing", "Crank-handle starting", "Sliding starting pin"],
      legalSignificance:
        "Its scope is the expressly named bearing-and-starting combination in the propulsion installation.",
    },
    {
      number: 6,
      isIndependent: true,
      originalText:
        "The combination, with the rudder and the longitudinally-movable propeller-shaft, of the vertical shaft o', levers o² o³, chain n, or equivalent screw-spindle k, and devices connecting said spindle with the propeller-shaft for steering the vessel and shifting the propeller-shaft, substantially as described.",
      plainEnglish:
        "Claim 6 covers a grouped steering and shaft-shifting control using the listed rudder, shaft, lever, chain, spindle, and connecting devices.",
      keyInnovations: ["Rudder linkage", "Shared control station", "Propeller-shaft shifting"],
      legalSignificance:
        "The claim is limited to the enumerated combination that both steers and shifts the propeller shaft.",
    },
    {
      number: 7,
      isIndependent: true,
      originalText:
        "The combination, with the water-jacket of the motor-cylinder, of fore and aft pipes, s' s², arranged with siphon-like action and communicating with the outer water for effecting the cooling of the cylinder by means of the outer water, substantially as described.",
      plainEnglish:
        "Claim 7 covers the cylinder water jacket and fore-and-aft siphon-like pipes that use outside water for cooling.",
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
      originalText:
        "The combination, with the water-jacket of the motor-cylinder, of fore and aft pipes, s' s², arranged with siphon-like action and communicating with the outer water for cooling the cylinder, and a centrifugal pump, u, for effecting the circulation of the water, substantially as described.",
      plainEnglish:
        "Claim 8 adds centrifugal-pump circulation to the jacket and siphon-like external-water pipes.",
      keyInnovations: ["Cylinder water jacket", "Centrifugal pump", "External-water circulation"],
      legalSignificance: "The claim requires the stated jacket, pipe, and pump combination.",
    },
    {
      number: 9,
      isIndependent: true,
      originalText:
        "The combination, with the water-jacket of the motor-cylinder, of fore and aft pipes, s' s², arranged with siphon-like action and communicating with the outer water, a centrifugal pump, u, for effecting the circulation of the water, and the branch pipe v, having a three-way cock for enabling the circulating water to be taken either from the outer water or from the bilge, substantially as described.",
      plainEnglish:
        "Claim 9 adds a branched pipe and three-way cock so cooling water may be drawn from outside water or the bilge.",
      keyInnovations: ["Three-way cock", "Bilge-water branch", "Pumped cooling circuit"],
      legalSignificance:
        "Its added legal limitation is the branch and three-way selection feature within the specified cooling system.",
    },
    {
      number: 10,
      isIndependent: true,
      originalText:
        "In a vessel propelled by a gas motor-engine, the combination, with the gas motor-engine, of a screw-propeller whose shaft is capable of sliding longitudinally and is geared to the engine-shaft by a friction-coupling, means for longitudinally shifting the propeller-shaft for varying the speed, stopping, and reversing, a low-pressure gas-reservoir for supplying the gas motor-engine with combustible gas, and one or more high-pressure gas-holders that supply the low-pressure reservoir through reducing cocks or valves, substantially as herein described.",
      plainEnglish:
        "Claim 10 joins the sliding, friction-coupled propeller drive to a low-pressure gas reservoir supplied from one or more high-pressure holders through reducing valves.",
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
