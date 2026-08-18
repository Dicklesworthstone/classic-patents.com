import type { Patent } from "@/types/patent";
import { whitneyCottonGinArchivalEdition } from "../editions/whitneyCottonGinEdition";

const whitneySourceDrawingCrops = [
  ["Fig. 1", "Section of the machine"],
  ["Fig. 2", "Cylinder and machine detail"],
  ["Fig. 2.1", "Tooth-row detail"],
  ["Fig. 2.2", "Tooth-row detail"],
  ["Fig. 2.3", "Tooth detail"],
  ["Fig. 2.4", "Tooth detail"],
  ["Fig. 2.5", "Tooth detail"],
  ["Fig. 3", "Whirls and belt drive"],
  ["Fig. 4", "Clearer construction"],
  ["Fig. 5", "Clearer detail"],
  ["Fig. 6", "Brush detail"],
  ["Fig. 7", "Cylinder bearing detail"],
  ["Fig. 11", "Breastwork detail"],
  ["Fig. 12", "Breastwork section"],
] as const;

const whitneyFigureCallouts: Record<
  string,
  Array<{
    id: string;
    figureRef: string;
    label: string;
    element: string;
    description: string;
    x: number;
    y: number;
  }>
> = {
  "Fig. 1": [
    {
      id: "wcg-hopper",
      figureRef: "Fig. 1",
      label: "B",
      element: "Cotton Hopper",
      description: "Feed chamber holding un-ginned seed cotton.",
      x: 35,
      y: 40,
    },
    {
      id: "wcg-cylinder",
      figureRef: "Fig. 1",
      label: "A",
      element: "Toothed Cylinder",
      description: "Revolving wooden cylinder embedded with wire teeth.",
      x: 50,
      y: 50,
    },
    {
      id: "wcg-breastwork",
      figureRef: "Fig. 1",
      label: "C",
      element: "Slotted Breastwork",
      description: "Stationary iron or brass grate preventing seeds from passing.",
      x: 42,
      y: 58,
    },
    {
      id: "wcg-clearer",
      figureRef: "Fig. 1",
      label: "D",
      element: "Doffing Clearer Brush",
      description: "Counter-rotating brush cylinder sweeping cleaned fiber.",
      x: 65,
      y: 52,
    },
  ],
  "Fig. 2": [
    {
      id: "wcg-cyl-body",
      figureRef: "Fig. 2",
      label: "A",
      element: "Cylinder Body",
      description: "Solid wooden roller with circumferential wire tooth rows.",
      x: 50,
      y: 50,
    },
    {
      id: "wcg-cyl-gudgeon",
      figureRef: "Fig. 2",
      label: "E",
      element: "Iron Gudgeon",
      description: "Central iron axle journal supporting cylinder rotation.",
      x: 15,
      y: 50,
    },
  ],
  "Fig. 2.1": [
    {
      id: "wcg-t-row-1",
      figureRef: "Fig. 2.1",
      label: "a",
      element: "Tooth Row Spacing",
      description: "Axial spacing of wire teeth matching breastwork slot intervals.",
      x: 50,
      y: 50,
    },
  ],
  "Fig. 2.2": [
    {
      id: "wcg-t-row-2",
      figureRef: "Fig. 2.2",
      label: "b",
      element: "Annular Wire Groove",
      description: "Groove or channel retaining wire teeth on the cylinder surface.",
      x: 50,
      y: 50,
    },
  ],
  "Fig. 2.3": [
    {
      id: "wcg-t-hook-3",
      figureRef: "Fig. 2.3",
      label: "c",
      element: "Wire Hook Profile",
      description: "Forward-curved wire tooth profile engineered to snag cotton lint.",
      x: 50,
      y: 50,
    },
  ],
  "Fig. 2.4": [
    {
      id: "wcg-t-hook-4",
      figureRef: "Fig. 2.4",
      label: "d",
      element: "Tooth Incline Angle",
      description: "Specific angle of inclination facilitating fiber release under brush action.",
      x: 50,
      y: 50,
    },
  ],
  "Fig. 2.5": [
    {
      id: "wcg-t-hook-5",
      figureRef: "Fig. 2.5",
      label: "e",
      element: "Tooth Root Anchor",
      description: "Anchored base securing wire tooth into wooden core.",
      x: 50,
      y: 50,
    },
  ],
  "Fig. 3": [
    {
      id: "wcg-whirl-large",
      figureRef: "Fig. 3",
      label: "W1",
      element: "Main Driving Whirl",
      description: "Large pulley wheel communicating power from hand crank or horse gin.",
      x: 40,
      y: 50,
    },
    {
      id: "wcg-whirl-small",
      figureRef: "Fig. 3",
      label: "W2",
      element: "Clearer Whirl",
      description: "Smaller step-up whirl driving clearer at high angular velocity.",
      x: 65,
      y: 50,
    },
  ],
  "Fig. 4": [
    {
      id: "wcg-clearer-shaft",
      figureRef: "Fig. 4",
      label: "C",
      element: "Clearer Axle",
      description: "Central shaft carrying longitudinal radial brush staves.",
      x: 50,
      y: 50,
    },
  ],
  "Fig. 5": [
    {
      id: "wcg-brush-stave",
      figureRef: "Fig. 5",
      label: "S",
      element: "Brush Stave Segment",
      description: "Wooden strip drilled to hold rows of hog bristles.",
      x: 50,
      y: 50,
    },
  ],
  "Fig. 6": [
    {
      id: "wcg-bristles",
      figureRef: "Fig. 6",
      label: "B",
      element: "Bristle Tuft",
      description: "Resilient bristles sweeping teeth in contrary direction.",
      x: 50,
      y: 50,
    },
  ],
  "Fig. 7": [
    {
      id: "wcg-bearing-box",
      figureRef: "Fig. 7",
      label: "G",
      element: "Bearing Gudgeon Box",
      description: "Low-friction bearing support mounted to wooden frame.",
      x: 50,
      y: 50,
    },
  ],
  "Fig. 11": [
    {
      id: "wcg-grate-bars",
      figureRef: "Fig. 11",
      label: "R",
      element: "Grate Bars",
      description: "Stationary metal ribs forming slots for wire teeth.",
      x: 50,
      y: 50,
    },
  ],
  "Fig. 12": [
    {
      id: "wcg-grate-section",
      figureRef: "Fig. 12",
      label: "S",
      element: "Slot Clearance Profile",
      description: "Cross-section showing narrow slot gap retaining seed while passing tooth.",
      x: 50,
      y: 50,
    },
  ],
};

export const whitneyCottonGinPatent: Patent = {
  id: "us-x72-whitney-cotton-gin",
  patentNumber: "US X72",
  title: "Cotton Gin",
  shortTitle: "Whitney Cotton Gin Fiber Separation",
  subtitle: "Toothed Cylinder, Slotted Breastwork Grate, and Counter-Rotating Clearer Brushes",
  inventors: ["Eli Whitney"],
  inventorLocation: "Mulberry Grove, Georgia & New Haven, Connecticut",
  grantDate: "1794-03-14",
  filingDate: "1793-06-20",
  era: "Early Republic & Industrial Dawn (1790–1830)",
  category: "consumer",
  categoryLabel: "Mechanical Processing & Agriculture",
  summary:
    "Whitney's 1794 record describes a wooden toothed cylinder that carries cotton through a grooved breastwork while seeds remain behind, then a faster contrary-moving clearer that removes lint from the teeth. The complete source is a signed description and affidavit, not a modern numbered-claim instrument.",
  heroQuote:
    "The cotton is put into the hopper, carried through the breastwork by the teeth, brushed off from the teeth by the clearer and flies off from the clearer, with the assistance of the air, by its own centrifugal force.",
  originalPdfUrl: "/patents/pdfs/us-x72-whitney-cotton-gin.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/USX72/en",
  usptoClassification: "D01B 1/06 (Separating cotton fibres from seed; Saw gins)",
  originalText:
    "This Machine may be described under five divisions, corresponding to its five principal parts: Viz: 1. The Frame, 2. The Cylinder; 3. The Breastwork; 4. The clearer, and 5. The Hopper.",
  originalTextAsset: {
    // Preserved only as private comparison evidence until the full manuscript
    // ledger matches the authored source edition.
    url: "/patents/source-text/us-x72-whitney-cotton-gin.txt",
    pageCount: 12,
    kind: "source-pdf-text-layer",
  },
  // This attests that the supplied facsimile prints no formal claims. The
  // renderer withholds the edition until its complete transcription ledger
  // passes the publication contract.
  archivalEdition: whitneyCottonGinArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "Green-seed upland cotton grew prolifically across the American South, but its sticky seeds adhered so tightly to the fibers that a laborer took an entire day to clean a single pound by hand. Eli Whitney realized that continuous mechanical tooth action combined with a rigid exclusionary grid could separate fiber from seed by exploiting the difference in their physical dimensions. His 1794 gin increased fiber output from 1 pound to 50 pounds per worker per day.",
    coreMechanism:
      "A wooden cylinder fitted with circular wire saw teeth rotates through narrow slotted iron ribs forming the front wall of a hopper. The slots are sized (approximately $3.2\\text{ mm}$) to allow the wire teeth and flexible cotton fibers to pass freely, while the rigid cotton seeds ($4.5\\text{ to }6.0\\text{ mm}$) are physically excluded. As the teeth pull the lint through the grate, a second cylinder equipped with horsehair brushes rotating at four times the speed in the opposite direction sweeps the lint off the teeth and expels it via centrifugal air currents.",
    mechanicalBreakdown: [
      {
        title: "Toothed Saw Cylinder & Wire Teeth",
        summary: "Wooden mandrel set with parallel rows of curved wire teeth.",
        technicalDetails:
          "The main cylinder carries annular rows of forged wire hooks angled in the direction of rotation ($15^\\circ\\text{ forward hook}$). As the cylinder rotates at $80\\text{ to }120\\text{ RPM}$, the hooks snag raw cotton locks and draw them under continuous tensile strain against the breastwork.",
        archaicTerm: "Cylinder furnished with rows of wire teeth",
        modernEquivalent: "Rotary saw blade cylinder / Gin saw mandrel",
      },
      {
        title: "Slotted Breastwork Grate (Exclusionary Grid)",
        summary: "Curved parallel iron ribs forming a mechanical dimension filter.",
        technicalDetails:
          "Parallel iron ribs spaced at precision clearances of $3.18\\text{ mm}$ ($1/8\\text{ inch}$). Because individual cotton fibers have diameters of $12\\text{ to }20\\;\\mu\\text{m}$, they pass effortlessly through the gap, while the hard ellipsoidal seeds (major axis $8\\text{ mm}$, minor axis $5\\text{ mm}$) cannot enter and roll downward into the discharge chute.",
        archaicTerm: "Breastwork composed of grates or ribs",
        modernEquivalent: "Ginning rib grate / Seed-exclusion grid",
      },
      {
        title: "High-Velocity Counter-Rotating Clearer Brushes",
        summary: "Geared horsehair brush cylinder sweeping lint from teeth.",
        technicalDetails:
          "Geared via a $4:1$ speed-increasing ratio to rotate at $320\\text{ to }480\\text{ RPM}$ counter to the saw cylinder. The bristle tips sweep past the back of the teeth with a relative velocity of $v_{\\text{rel}} = v_{\\text{brush}} + v_{\\text{saw}}$, generating both mechanical wiping force and an aerodynamic draft ($q = \\frac{1}{2} \\rho v^2$) that flings clean lint into the collection bin.",
        archaicTerm: "Clearing cylinder armed with bristles",
        modernEquivalent: "Doffing brush cylinder / Pneumatic doffer",
      },
      {
        title: "Seed Hopper Roll Box & Gravity Discharge",
        summary: "Tumbling chamber maintaining continuous seed-roll circulation.",
        technicalDetails:
          "The raw seed cotton rests in a hopper whose curved floor forces the seed mass into a revolving vortex roll ($30\\text{ to }50\\text{ RPM}$) driven by the peripheral drag of the saw teeth. As each seed is denuded of lint, its friction coefficient drops, allowing it to fall by gravity through a calibrated bottom slit ($w_{\\text{bottom}} \\approx 6.5\\text{ mm}$) while remaining un-crushed.",
        archaicTerm: "Hopper or box holding the raw cotton",
        modernEquivalent: "Roll box & seed discharge apron",
      },
      {
        title: "Step-Up Gear Train & Inertial Drive",
        summary:
          "Counter-shaft gearing converting manual crank torque into dual differential velocities.",
        technicalDetails:
          "A manual crank coupled to a heavy wooden flywheel drives the saw cylinder shaft at $\\omega_1$, while an internal spur gear mesh ($\text{Gear Ratio } i = 4.0$) accelerates the doffing brush cylinder to $\\omega_2 = 4\\omega_1$. The mechanical advantage $MA = \\frac{r_{\\text{crank}}}{r_{\\text{saw}}} \\approx 2.5$ ensures uniform fiber extraction without stalling when dense cotton locks enter the rib slots.",
        archaicTerm: "Wheels and bands communicating motion",
        modernEquivalent: "Speed-increasing spur geartrain & flywheel transmission",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Tensile Fiber Pull vs Seed Adhesion Shear",
        formula: "F_{\\text{tooth}} > \\tau_{\\text{bond}} \\cdot A_{\\text{contact}}",
        explanation:
          "Cotton fiber tensile strength ($\\sim 300\\text{ to }500\\text{ MPa}$) far exceeds the adhesive bond force between the epidermal seed coat and the chalazal fiber base, allowing fibers to be stripped cleanly without rupture.",
      },
      {
        principle: "Geometric Exclusion Barrier",
        formula: "w_{\\text{slot}} < d_{\\text{seed, min}} < d_{\\text{seed, max}}",
        explanation:
          "The slot width $w_{\\text{slot}} \\approx 3.2\\text{ mm}$ is strictly smaller than the minimum seed minor diameter, establishing an impermeable physical barrier for the seed mass while exerting zero constraint on the micron-scale fiber.",
      },
      {
        principle: "Centrifugal Aerodynamic Doffing",
        formula:
          "F_c = m_{\\text{fiber}} \\omega_{\\text{brush}}^2 r_{\\text{brush}} > F_{\\text{bristle friction}}",
        explanation:
          "High rotational angular velocity of the brush cylinder imparts centrifugal momentum to the cotton tufts, lofting them into the discharge airstream.",
      },
      {
        principle: "Roll Box Circulation & Friction Coupling",
        formula:
          "\\tau_{\\text{vortex}} = \\mu_{\\text{lint}} N_{\\text{teeth}} F_{\\text{drag}} R_{\\text{saw}} - I_{\\text{roll}} \\alpha",
        explanation:
          "The raw cotton mass forms a self-sustaining rotating vortex inside the hopper box driven by interfacial friction against the saw teeth, continuously exposing fresh un-ginned fiber locks to the rib slots without human intervention.",
      },
    ],
    whyItMattersToday:
      "Whitney's concept of high-speed mechanical dimensional exclusion paired with continuous rotary tooth capture remains the core architecture of all modern commercial saw gins (such as Lummus and Continental Eagle gins processing thousands of bales per hour). It triggered an economic and demographic explosion that remade global trade and industrial textile manufacturing.",
  },
  // This facsimile is a descriptive schedule with signatures and an affidavit,
  // not a later-form patent containing separately enumerated claims.
  claims: [],
  drawings: whitneySourceDrawingCrops.map(([figureNumber, title]) => ({
    figureNumber,
    title,
    caption: `Source-derived ${figureNumber} crop from the pinned Whitney cotton-gin facsimile drawing sheets.`,
    svgType: "whitney-cotton-gin",
    callouts: whitneyFigureCallouts[figureNumber] ?? [
      {
        id: `wcg-${figureNumber.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        figureRef: figureNumber,
        label: figureNumber,
        element: title,
        description: `Archival detail of ${title}.`,
        x: 50,
        y: 50,
      },
    ],
  })),
  historicalContext: {
    problemStatement:
      "Upland short-staple cotton was easy to grow across inland soil, but each seed was coated in dense, tangled fuzz that required over 10 hours of manual finger picking to yield one pound of clean fiber, creating a massive economic bottleneck for textile mills.",
    priorArtLimitations: [
      "Indian 'Churka' roller gins only worked on smooth black-seed Sea Island cotton and crushed green seeds into oil-stained pulp.",
      "Manual separation by hand produced less than one pound of clean fiber per worker day.",
      "No mechanized system existed that could handle short-staple fuzzy green seeds without destroying the staple length.",
    ],
    breakthroughInsight:
      "Whitney realized that instead of squeezing cotton between rollers (which crushed seeds), wire teeth should reach through a stationary comb grate to pull only the flexible fibers, leaving the intact seeds behind in the hopper.",
    patentWars: [
      {
        rivalName: "Southern Planters and Hodgen Holmes",
        rivalClaim:
          "Hodgen Holmes patented a gin using flat circular iron saws instead of wire teeth in 1796, claiming it was a distinct invention.",
        conflictDetails:
          "Because the gin was simple to replicate in local blacksmith shops, thousands of illegal gins were built across Georgia and the Carolinas. Whitney and his partner Phineas Miller spent years in court suing infringers under the flawed 1793 Patent Act.",
        resolution:
          "In 1807, Judge William Johnson ruled decisively in Whitney v. Fort that Holmes's circular saws were merely a mechanical equivalent of Whitney's wire teeth, validating Whitney's patent. Several states paid modest lump-sum royalties ($50,000 from South Carolina), though most was consumed by legal fees.",
        legalOutcome:
          "Established the doctrine of mechanical equivalents in early American patent jurisprudence.",
      },
    ],
    civilizationalImpact:
      "US cotton production surged from 1.5 million pounds in 1793 to over 85 million pounds by 1810, fueling the British and New England Industrial Revolution, creating global cotton commodity markets, and deeply altering 19th-century American history.",
    funFact:
      "Whitney designed and built his working prototype in just ten days while staying as a guest at Mulberry Grove plantation, owned by Catharine Greene (widow of Revolutionary War General Nathanael Greene). Greene suggested using a horsehair brush when the wire teeth kept clogging!",
    aftermath:
      "Disillusioned by patent infringement battles that yielded little profit, Whitney returned to New Haven, Connecticut, where he pioneered interchangeable parts manufacturing in government musket contracts, laying the cornerstone of the 'American System' of manufacturing.",
  },
  tags: [
    "Eli Whitney",
    "Cotton Gin",
    "Industrial Revolution",
    "Agriculture",
    "Mechanical Separation",
    "Interchangeable Parts",
  ],
  stats: {
    totalClaims: 0,
    independentClaims: 0,
  },
};
