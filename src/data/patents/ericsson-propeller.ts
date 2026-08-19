import type { Patent } from "@/types/patent";
import { ericssonPropellerArchivalEdition } from "../editions/ericssonPropellerEdition";

export const ericssonPropellerPatent: Patent = {
  id: "us-588-ericsson-propeller",
  patentNumber: "US 588",
  title: "Screw-Propeller for Vessels",
  shortTitle: "Ericsson Submerged Screw Propeller",
  subtitle: "Contra-Rotating Spiral Plates and a Removable Submerged Stern Installation",
  inventors: ["John Ericsson"],
  inventorLocation: "London, England",
  grantDate: "1838-02-01",
  // Neither the reviewed grant nor the primary public record supplies a filing date.
  filingDate: null,
  era: "Early Industrial Navigation (1830–1850)",
  category: "aviation",
  categoryLabel: "Marine Propulsion & Hydrodynamics",
  summary:
    "John Ericsson's specification describes two submerged broad hoops carrying short spiral plates. Concentric shafts and unequal gearing drive the hoops in contrary directions; the third claim covers a removable upright-stem installation with a protected gear casing.",
  heroQuote:
    "This invention which I name as above consists in two thin broad metallic hoops or short cylinders supported by spiral arms or spokes and made to revolve in contrary directions.",
  originalPdfUrl: "/patents/pdfs/us-588-ericsson-propeller.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US588/en",
  usptoClassification: "B63H 1/14 (Marine propellers; Screw propellers)",
  originalTextAsset: {
    url: "/patents/transcripts/us-588-ericsson-propeller-reviewed.txt",
    pageCount: 5,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "40582250d44f6558cf9a438801e312a469ccb83b6755ebc813943fba54c3ea9a",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "Sheet 1, 2 Sheets.",
        sourceRelationship: "Printed drawing sheet 1 of 2, containing Figs. 1 and 2.",
      },
      {
        page: 2,
        exactSourceText: "Sheet 2, 2 Sheets.",
        sourceRelationship: "Printed drawing sheet 2 of 2, containing Figs. 3 through 6.",
      },
      {
        page: 3,
        exactSourceText: "UNITED STATES PATENT OFFICE.",
        sourceRelationship: "Patent-office masthead and the first physical specification page.",
      },
      {
        page: 4,
        exactSourceText: "steam engine the cylinder of which may be",
        sourceRelationship:
          "Second physical specification page, continuing the sentence split after “a” at the foot of PDF page 3.",
      },
      {
        page: 5,
        isBlank: true,
        sourceRelationship:
          "Visually reviewed trailing PDF page with no printed content; it is retained in the immutable facsimile and ledger as an explicit blank-page receipt.",
      },
    ],
  },
  originalText:
    "Be it known that I, JOHN ERICSSON, a subject of the Kingdom of Sweden, residing at London, England, have invented a new and useful Propeller for the Purpose of Propelling Steamboats Effectually Notwithstanding Any Variations in Their Draft of Water. The complete, manually prepared edition is available in the Original Patent Text face.",
  archivalEdition: ericssonPropellerArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "This 1838 specification addresses effective steamboat propulsion despite changes in draft. Ericsson's particular arrangement is not a single conventional screw: two broad, fully submerged hoops carry short spiral plates. Concentric shafts and unequal gearing make the hoops turn in opposite directions at unequal speeds, while a second arrangement makes the propeller removable from the stern.",
    coreMechanism:
      "A steam engine can drive cranks l and m, which turn crank shafts L and M in the same direction. The unequal cog wheels H and I then make shaft b turn opposite shaft a and at a lower speed. Hoops A and B therefore turn their opposed spiral plate series in contrary directions and at unequal velocities. The source gives construction and motion, not a measured thrust, speed, efficiency, blade-section, or material-performance calculation; any modern fluid-mechanics model must remain a reader aid rather than a value claimed by the grant.",
    mechanicalBreakdown: [
      {
        title: "Hoops and Spiral Plates",
        summary: "Two broad hoops carry riveted plates formed as pieces of a spiral surface.",
        technicalDetails:
          "Figure 2 gives the construction rule: the spiral advances along its model cylinder by three cylinder diameters in one turn. Cutting the developed spiral between the named lines produces plates 9 through 13 for one hoop; winding in the contrary direction produces plates 1 through 5 for the other. The grant calls them spiral planes or plates, not hydrofoils, and gives no section coefficients or predicted thrust.",
        archaicTerm: "Spiral planes or plates",
        modernEquivalent: "Helically pitched propeller blades",
      },
      {
        title: "Concentric Shafts and Unequal Gearing",
        summary:
          "A hollow b shaft contains the a shaft; unequal cog wheels establish the opposed motion.",
        technicalDetails:
          "The hoop A is on axis a and hoop B on hollow axis b. Ericsson specifies H and I as meshing cog wheels, with I about one fifth larger than H; he then states that b turns contrary to a and at a less speed. The claim separately calls for a greater speed for the outer series when it moves in the current produced by the other series. The specification does not quantify wake recovery, torque cancellation, or net yaw.",
        archaicTerm: "Cog wheels",
        modernEquivalent: "Meshing gear train",
      },
      {
        title: "Stern Penetration and Support",
        summary:
          "Bearings, stays, framing, and stuffing boxes support the shafts and keep water outside the hull.",
        technicalDetails:
          "Stay E is bolted to the stern and carries brass bearing e for shaft a. Shaft b works through stuffing box F and is supported by framing G and plumber block g; stuffing box C at the stern post prevents water from entering around b while allowing it to turn. The source names no packing material, thrust load, bearing alloy beyond e, or structural load rating.",
        archaicTerm: "Stuffing box and plumber block",
        modernEquivalent: "Shaft seal and pedestal bearing",
      },
      {
        title: "Removable Upright Stem",
        summary:
          "The second installation suspends or lifts the propeller by a hollow upright stem, stays, keys, and a hoisting eye.",
        technicalDetails:
          "In drawing No. 2, hollow stem A carries the axle system. Bracket K, stay L, fork M, and keys k and m locate it at the stern. Removing keys m, k, and x and pushing down the sliding coupling box detaches the stem, upright shaft, and propeller; tackle at eye n can then lift the apparatus. This removable installation is part of claim 3.",
        archaicTerm: "Hoisting tackle",
        modernEquivalent: "Block-and-tackle lifting gear",
      },
      {
        title: "Underwater Gear Casing",
        summary:
          "A three-part pointed drum encloses the conical gears while leaving clearance for opposed motion.",
        technicalDetails:
          "Figure 6 uses conical cog wheels b, c, and e to turn axles B and C in contrary directions from upright shaft E. A light-metal drum P P P has a fixed central portion and pointed end caps fixed to the propeller spokes. Ericsson specifies slits and about one eighth of an inch between its three parts so the two propellers can move freely; claim 3 calls this a drum or conical casing that protects the bevel wheels and diminishes water resistance.",
        archaicTerm: "Conical cog wheels",
        modernEquivalent: "Bevel gears",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Helical Development Stated in the Specification",
        formula: "P = 3D",
        explanation:
          "Here P is the axial advance in one turn and D is the model cylinder diameter. Ericsson says the plate's spiral has not gone once around until it has advanced a distance equal to three diameters. This is a geometric construction statement, not a measured vessel speed or an efficiency result.",
      },
      {
        principle: "Opposed Rotation Through a Gear Train",
        formula: "\\omega_b \\text{ is opposite in direction to } \\omega_a",
        explanation:
          "The source derives the direction relation from crank shafts L and M, then unequal cog wheels H and I. It says b moves at a lower speed than a, so the plate-carrying hoops turn in contrary directions and at unequal velocities. It supplies no revolutions per minute or gear-tooth count from which a numerical ratio could be calculated.",
      },
      {
        principle: "Whole-Surface Immersion",
        formula: "A_{\\text{active}} = \\sum A_{\\text{plates}} \\quad (h_{\\text{immersion}} > D)",
        explanation:
          "Claim 1 ties the hoop-and-spoke construction to entire immersion, saying that this lets the whole surface of all spiral plates be employed at one time. That is the source's stated physical rationale. It does not provide depth, cavitation criteria, density, or a quantified propulsive efficiency.",
      },
    ],
    whyItMattersToday:
      "The grant is useful today because it makes a specific early screw-propeller proposal inspectable at the level of plate geometry, concentric shafts, gears, seals, and a removable stern installation. It should not be treated as proof that this one patent alone established later marine-propulsion practice; the pinned source does not document adoption, performance trials, or later litigation.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The metallic hoops or cylinders and the spiral arms or spokes hereinbefore described together with the entire immersion of the propeller by which means I am enabled to employ the whole surface of all the spiral plates at one time and whereby the beneficial result of a great propelling force will be obtained by a propeller of much less dimensions than heretofore.",
      plainEnglish:
        "Claims the hoop-and-spoke construction together with complete immersion, so all of the short spiral plates can work in water at once and a smaller propeller can produce substantial thrust.",
      keyInnovations: ["Metallic hoop", "Spiral spoke", "Complete immersion"],
      legalSignificance:
        "The claim is limited to Ericsson's stated immersed hoop-and-spoke arrangement, not every use of oblique spiral planes.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "And I also claim as my invention the giving a greater speed to the outer series of spiral plates which move in the current produced by the motion of the other series and by which greater speed the beneficial result of saving of power and increased propelling force will be obtained.",
      plainEnglish:
        "Claims making the outer series faster, where it runs in the water current made by the other series, to save power and increase propelling force.",
      keyInnovations: ["Outer spiral series", "Higher speed", "Current from inner series"],
      legalSignificance:
        "This is separately phrased and does not incorporate claim 1 by reference.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "And I further claim as my invention the application of the propeller as described in drawing No. 2—that is to say: 1stly, I claim the upright hollow stem with its arms or branches for carrying the propeller by means of which stem the propeller may be either suspended and immersed under the water when required to be used, or on other occasions lifted out of the water so as not to interfere with the sailing of the vessel; 2ndly, I claim the drum or conical casing for protecting the bevel wheels and for diminishing the resistance in passing through the water; 3rdly, I claim the attaching the propeller to or detaching it from the engine or other power employed on board the vessel by means of a coupling box at the upper end of the upright shaft of the bevel wheels.",
      plainEnglish:
        "Claims the Figure 4–6 installation as three features: a hollow upright stem that can lower or raise the propeller, a fairing around the bevel gears, and a coupling box that connects or disconnects the propeller from shipboard power.",
      keyInnovations: ["Upright hollow stem", "Conical gear casing", "Sliding coupling box"],
      legalSignificance:
        "This claim is the patent's expressly enumerated removable-installation combination.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Stern Elevation of Ericsson Screw Propeller System",
      caption:
        "Sectional drawing showing concentric propeller shafts, forward and aft helical blade hubs, and submerged rudder integration.",
      svgType: "ericsson-propeller",
      callouts: [
        {
          id: "ep-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Forward Helical Propeller Wheel",
          description: "Submerged drum with right-hand helical spiral hydrofoil blades.",
          x: 40,
          y: 60,
        },
        {
          id: "ep-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Aft Counter-Rotating Propeller Wheel",
          description: "Submerged drum with left-hand helical blades spinning in reverse.",
          x: 60,
          y: 60,
        },
        {
          id: "ep-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Concentric Drive Shafts & Sternpost",
          description: "Hollow outer shaft and solid inner shaft passing below waterline.",
          x: 25,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Ericsson frames the problem as propelling steamboats effectively despite variations in their draft of water. The specification's answer is a fully submerged two-hoop propeller, rather than an assertion about all contemporary vessels.",
    priorArtLimitations: [
      "Ericsson expressly says that using oblique spiral planes in water, and moving them in contrary directions for steam-boat propulsion, was not new.",
      "His claims therefore do not attempt to cover those ideas alone; they identify the immersed hoop-and-spoke construction, the speed relation, and the removable drawing No. 2 installation.",
    ],
    breakthroughInsight:
      "The document combines two oppositely angled, fully immersed spiral-plate series with concentric shafts that turn contrary at unequal speed. It then adds a separate removable upright-stem installation with protected underwater gears.",
    patentWars: [],
    civilizationalImpact:
      "US 588 is a source record for one early American screw-propeller design. It is valuable because its claims, drawings, and mechanisms can be studied without replacing their limited historical evidence with broad claims about worldwide adoption.",
    aftermath:
      "The pinned grant does not establish a later lawsuit, commercial deployment, or a causal line to a named later vessel. Those claims are omitted pending separately cited historical research.",
  },
  tags: [
    "John Ericsson",
    "Screw Propeller",
    "Marine Propulsion",
    "Hydrodynamics",
    "USS Monitor",
    "Naval Architecture",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 3,
  },
};
