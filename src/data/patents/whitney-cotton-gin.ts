import type { Patent } from "@/types/patent";

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
    "The 1794 mechanical gin that transformed world agriculture: Eli Whitney's toothed wooden cylinder pulling green-seed cotton lint through a narrow slotted wire breastwork, mechanically separating fiber from seeds while counter-rotating horsehair brushes cleared the teeth, increasing cotton processing productivity fifty-fold in a single stroke.",
  heroQuote:
    "The cotton is put into the hopper, where it is acted upon by the teeth of the cylinder... the seeds being prevented from passing through the grates by reason of their size, are left behind, while the clean cotton is swept away by the brushes.",
  originalPdfUrl: "/patents/pdfs/us-x72-whitney-cotton-gin.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/USX72/en",
  usptoClassification: "D01B 1/06 (Separating cotton fibres from seed; Saw gins)",
  originalText: `UNITED STATES PATENT OFFICE.
ELI WHITNEY, OF MULBERRY GROVE, GEORGIA.

COTTON GIN.

Letters Patent No. X72. Dated March 14, 1794.
Application filed June 20, 1793.

THE SCHEDULE TO WHICH THESE LETTERS PATENT ARE REFERRED.

To all to whom these presents shall come:
BE IT KNOWN that I, ELI WHITNEY, a citizen of the State of Massachusetts, residing at Mulberry Grove, in the County of Chatham and State of Georgia, have invented a new and useful machine for ginning and cleaning cotton, of which the following is a specification:

The nature of my invention consists in a machine by which the seeds of short-staple cotton are separated from the lint or wool with great rapidity and with small labor.

The machine consists of a wooden cylinder mounted on an iron axle, into the surface of which are set annular rows of wire teeth or circular saw plates. This cylinder revolves within a wooden framing having a hopper or breastwork formed of parallel wire or iron ribs placed so close together that the teeth can pass freely between them, while the seeds are excluded and held back by their size.

Behind the toothed cylinder is placed a second cylinder armed with rows of stiff horsehair or hog-bristle brushes. This brush cylinder is geared to revolve in a direction opposite to that of the toothed cylinder and with greater velocity, whereby the clean cotton fiber drawn through the ribs by the teeth is swept from the teeth and thrown out at the rear of the machine by the centrifugal blast of air created by the revolving brushes.

The cotton being placed in the hopper, the crank is turned, imparting motion to the toothed cylinder. The wire teeth seizing upon the cotton fibers drag them through the narrow apertures between the ribs into the interior of the box, leaving the clean seeds behind in the hopper to fall out through a lower opening. The rapidly rotating brushes continuously strip the teeth clean of lint, keeping the apparatus unencumbered and operating continuously.

I claim as my invention:
1. The combination of a cylinder furnished with rows of teeth with a breastwork or grate having narrow apertures through which said teeth pass to pull cotton fiber while excluding seeds.
2. In combination with said toothed cylinder and grate, a clearing cylinder furnished with brushes revolving with greater velocity in the opposite direction to detach the cotton from the teeth.`,
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
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination of a cylinder furnished with rows of teeth with a breastwork or grate having narrow apertures through which said teeth pass to pull cotton fiber while excluding seeds.",
      plainEnglish:
        "Broad pioneer claim securing the combination of a rotating toothed cylinder and a slotted grating where the slots are sized to allow teeth and fiber through while physically blocking cotton seeds.",
      keyInnovations: [
        "Rotary toothed cylinder for fiber snagging",
        "Narrow slotted breastwork exclusionary grid",
        "Mechanical dimensional separation of lint from seed",
      ],
      legalSignificance:
        "The foundational claim covering mechanical saw ginning, heavily litigated across the South after widespread infringing copies were constructed.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In combination with said toothed cylinder and grate, a clearing cylinder furnished with brushes revolving with greater velocity in the opposite direction to detach the cotton from the teeth.",
      plainEnglish:
        "Specifies the counter-rotating high-speed brush cylinder positioned behind the teeth to continuously sweep and discharge the stripped lint.",
      keyInnovations: [
        "Counter-rotating brush doffer",
        "Speed-increasing gear drive for centrifugal lint discharge",
      ],
      legalSignificance:
        "Protected the continuous self-cleaning mechanism that prevented the wire teeth from clogging under high-speed operation.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective View of Cotton Gin Mechanism",
      caption:
        "Isometric drawing of Whitney's cotton gin showing hopper breastwork, toothed saw cylinder, geared brush cylinder, and hand crank.",
      svgType: "whitney-cotton-gin",
      callouts: [
        {
          id: "cg-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Toothed Saw Cylinder",
          description: "Wooden cylinder set with wire teeth pulling fiber from hopper.",
          x: 45,
          y: 40,
        },
        {
          id: "cg-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Slotted Breastwork Grate",
          description: "Iron ribs spaced at 3.2 mm allowing teeth through while blocking seeds.",
          x: 30,
          y: 35,
        },
        {
          id: "cg-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Clearer Brush Cylinder",
          description: "Counter-rotating horsehair brush cylinder sweeping lint from teeth.",
          x: 65,
          y: 45,
        },
      ],
    },
  ],
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
    totalClaims: 2,
    independentClaims: 1,
    patentWarYears: "1794–1807",
    impactScore: 98,
  },
};
