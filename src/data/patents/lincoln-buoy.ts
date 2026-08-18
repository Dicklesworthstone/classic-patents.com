import type { Patent } from "@/types/patent";

export const lincolnBuoyPatent: Patent = {
  id: "us-6281-lincoln-buoy",
  patentNumber: "US 6,281",
  title: "Buoying Vessels Over Shoals",
  shortTitle: "Lincoln's Riverboat Buoyancy System",
  subtitle:
    "Expandable Buoyant Chambers for Navigating Shallow River Sandbars, Shoals, and Mudflats",
  inventors: ["Abraham Lincoln"],
  inventorLocation: "Springfield, Illinois",
  grantDate: "1849-05-22",
  filingDate: "1849-03-10",
  era: "Industrial Dawn (1840–1870)",
  category: "materials",
  categoryLabel: "Marine & Hydraulic Engineering",
  summary:
    "The Only Presidential Patent: In 1849, future President Abraham Lincoln patented a mechanical steamboat buoyancy system using vulcanized rubber bellows mounted beneath the guards. Driven by a central steam-powered windlass, the bellows expanded into the water to instantly increase displaced volume, lifting the hull over sandbars without offloading cargo.",
  heroQuote:
    "The nature of my invention consists in providing adjustable buoyant chambers with steam boats or other vessels... whereby they may be expanded and filled with air whenever the vessel reaches shallow water or grounds upon a bar, thereby displacing a large amount of water and buoying the vessel upward so that her draft is materially lessened.",
  originalPdfUrl: "/patents/pdfs/us-6281-lincoln-buoy.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6281A/en",
  usptoClassification: "B63B 43/14 (Marine vessels; buoyancy tanks)",
  originalTextAsset: {
    url: "/patents/transcripts/us-6281-lincoln-buoy.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
  },
  originalText: `UNITED STATES PATENT OFFICE.
ABRAHAM LINCOLN, OF SPRINGFIELD, ILLINOIS.

BUOYING VESSELS OVER SHOALS.

Specification of Letters Patent No. 6,281, dated May 22, 1849.

To all whom it may concern:
Be it known that I, ABRAHAM LINCOLN, of Springfield, in the County of Sangamon, in the State of Illinois, have invented a new and improved manner of Combining Buoyant Chambers with Steam Boats or other Vessels, for the purpose of enabling them to pass over bars, or through shallow water, without discharging their cargoes; and I do hereby declare that the following is a full and exact description thereof.

The nature of my invention consists in providing adjustable buoyant chambers with steam boats or other vessels, in such a manner that they may be expanded and filled with air whenever the vessel reaches shallow water or grounds upon a bar, thereby displacing a large amount of water and buoying the vessel upward so that her draft is materially lessened.

Attached to the sides of the vessel, below the guards, are expandable chambers or bellows made of vulcanized india-rubber cloth, or other suitable waterproof fabric. These chambers are provided with sliding uprights and cross-pieces, connected by ropes or chains passing over pulleys to a central windlass or shaft on the deck.

When the vessel is in deep water, the buoyant chambers are collapsed against the hull, occupying very little space and offering no impediment to the vessel's progress. Upon approaching a shoal, shallow water, or sandbar, the central shaft is rotated by the vessel's steam power or by hand, causing the ropes to draw the lower movable parts of the chambers downward and outward, expanding the bellows and filling them with air.

The additional displacement thus created exerts a powerful upward buoyant lift, raising the vessel several inches or feet in the water, and enabling her to glide safely across the shoal. Once deep water is regained, the chambers are deflated and restored to their contracted position against the hull.`,
  plainEnglishExplanation: {
    overview:
      "During his early life as a frontier flatboat pilot on the Mississippi and Sangamon rivers, Abraham Lincoln repeatedly experienced the frustration of grounding on river sandbars and mudflats. In 1848, while traveling home from Congress aboard the Great Lakes steamer Globe, the ship stranded on a sandbar, forcing the crew to jam empty barrels under the hull. Lincoln conceived an automated, permanent engineering solution: expandable rubber bellows mounted beneath the steamboat's side guards. Powered by the ship's steam engine via a central windlass, the crew could lower and expand the bellows in minutes, displacing water to lift the vessel over the obstruction without offloading passengers or heavy freight.",
    coreMechanism:
      "Waterproof bellows constructed from Goodyear vulcanized rubberized canvas are mounted under the hull overhangs (guards) on both port and starboard sides. A central deck-mounted windlass shaft, geared to the ship's steam engine, spools ropes over gunwale pulleys to pull rigid vertical sliding uprights downward. As the bellows plunge into the water and expand, they displace additional water volume ($\\Delta V$), generating an immediate upward buoyant force ($F_B = \\rho g \\Delta V$) that decreases the ship's draft by several inches or feet.",
    mechanicalBreakdown: [
      {
        title: "Vulcanized Rubberized Air Bellows",
        summary: "Foldable waterproof bellows mounted beneath the side guards.",
        technicalDetails:
          "Constructed of multi-ply vulcanized india-rubber canvas. In deep water, atmospheric air is vented and the bellows fold flush against the hull ($<6\\text{ inches}$ profile) to minimize hydrodynamic drag.",
        archaicTerm: "Air-chambers of india-rubber cloth",
        modernEquivalent: "Pneumatic marine buoyancy sponsons",
      },
      {
        title: "Central Steam-Driven Windlass Shaft",
        summary: "A longitudinal deck shaft rotated by the ship's steam engine or hand capstan.",
        technicalDetails:
          "Winds ropes over synchronized grooved pulleys, exerting equal downward force on port and starboard sliding uprights to prevent asymmetrical listing.",
        archaicTerm: "Central shaft, ropes, and pulleys",
        modernEquivalent: "Synchronized mechanical windlass and drive train",
      },
      {
        title: "Vertical Sliding Upright Guides",
        summary: "Rigid wooden and iron sliding upright posts guiding the lower bellows plate.",
        technicalDetails:
          "Transfers upward hydrostatic buoyant forces directly into the main transverse rib framing of the vessel without warping hull planking.",
        archaicTerm: "Sliding uprights and cross-pieces",
        modernEquivalent: "Vertical structural load-bearing guide struts",
      },
      {
        title: "Air Intake and Exhaust Flap Valves",
        summary: "One-way check valves supplying ambient air as the chambers expand.",
        technicalDetails:
          "Allows free atmospheric air intake during mechanical downward expansion, locking air inside against external hydrostatic water pressure.",
        archaicTerm: "Air vents and stopcocks",
        modernEquivalent: "Pneumatic intake check valves and exhaust dump vents",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Archimedes' Buoyancy Principle & Variable Displacement",
        formula:
          "F_B = \\rho_{fresh} \\cdot g \\cdot \\left(V_{hull} + 2 \\cdot V_{bellows}\\right) = M_{ship} g",
        explanation:
          "The total upward buoyant force equals the weight of displaced water. Expanding the bellows increases displaced volume by $\\Delta V$, causing the vessel to float higher in the water.",
      },
      {
        principle: "Hydrostatic Draft Reduction Equation",
        formula:
          "\\Delta T = \\frac{2 \\cdot V_{bellows}}{A_{waterplane}} = \\frac{2 \\cdot L_b W_b H_b}{C_{wp} L_{ship} B_{ship}}",
        explanation:
          "Draft reduction ($\\Delta T$) is directly proportional to total expanded bellows volume and inversely proportional to the hull's waterplane area, easily raising a 200-foot packet boat by 1 to 2 feet.",
      },
      {
        principle: "Transverse Hydrostatic Stability & Metacentric Height (GM)",
        formula:
          "GM = KB + BM - KG, \\quad BM = \\frac{I_{transverse}}{\\nabla} = \\frac{\\int y^2 \\, dA}{V_{displaced}}",
        explanation:
          "Because the bellows expand outward on the extreme port and starboard guards, they increase the second moment of waterplane area ($I_{transverse} \\propto B^3$), dramatically increasing metacentric height ($GM$) and preventing capsizing.",
      },
      {
        principle: "Hydrostatic Pressure on Flexible Submerged Membranes",
        formula:
          "P(z) = P_{atm} + \\rho_{water} g z, \\quad \\sigma_{tensile} = \\frac{P(z) \\cdot r_{fold}}{t_{fabric}}",
        explanation:
          "At a shallow river depth of 6 feet ($z \\approx 1.8\\text{ m}$), hydrostatic pressure is $1.18\\text{ bar}$ ($17.7\\text{ psi}$), requiring multi-ply vulcanized fabric to resist hydrostatic tearing.",
      },
      {
        principle: "Mechanical Advantage of Windlass Rigging",
        formula:
          "MA = \\frac{F_{buoyant}}{F_{engine}} = \\frac{2 \\pi R_{drum}}{p_{lead}} \\cdot N_{pulleys}",
        explanation:
          "Compound pulley blocks and geared steam windlass shafts multiply engine torque, overcoming water resistance to force the buoyant chambers downward into the river.",
      },
    ],
    whyItMattersToday:
      "Lincoln's patent is an iconic milestone in American history: it remains the only patent ever granted to a President of the United States. Today, modern marine salvage operations use inflatable salvage pontoons, and military hovercraft use flexible rubberized air skirts derived from the same pneumatic displacement principles.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "What I claim as my invention and desire to secure by letters patent is the combination of expandable buoyant chambers placed at the sides of a vessel, with the vertical sliding uprights and ropes and pulleys, or their equivalents, for the purpose of expanding said buoyant chambers, and thereby buoying the vessel over shoals, shallow water, and other obstructions, substantially as herein set forth.",
      plainEnglish:
        "The master patent claim covering expandable air chambers positioned along the sides of a boat, combined with sliding vertical uprights and a pulley-and-rope rigging system to mechanically expand the chambers and lift the boat over shallow sandbars.",
      keyInnovations: [
        "Side-mounted expandable buoyant chambers",
        "Synchronized vertical sliding expansion rigging",
        "In-situ variable draft control for river navigation",
      ],
      legalSignificance:
        "The sole patent granted to an American President, drafted and prosecuted before the USPTO by Lincoln himself in 1849.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination of the expandable buoyant chambers with a central longitudinal shaft driven by the power of the vessel, for simultaneously operating all the sliding uprights and expanding the chambers equally on both sides of the vessel.",
      plainEnglish:
        "A steamboat buoyancy apparatus where a single central drive shaft powered by the ship's engine synchronously operates all sliding uprights on both port and starboard sides.",
      keyInnovations: [
        "Central steam-powered drive shaft",
        "Symmetric bilateral bellows deployment",
        "Transverse roll stability preservation",
      ],
      legalSignificance:
        "Protected the mechanical drive train ensuring balanced, non-capsizing buoyant deployment across the hull.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Elevation View of Steamboat with Expandable Buoyant Chambers",
      caption:
        "Side elevation blueprint showing the vulcanized rubber bellows collapsed and expanded beneath the hull guards, connected to the deck windlass.",
      svgType: "lincoln-buoy",
      callouts: [
        {
          id: "lb-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Expandable Rubber Bellows",
          description:
            "Waterproof vulcanized india-rubber chamber shown in expanded displacement state.",
          x: 42,
          y: 62,
        },
        {
          id: "lb-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Central Pulley Drive Shaft",
          description: "Longitudinal deck shaft geared to steam engine for spooling rigging ropes.",
          x: 50,
          y: 35,
        },
        {
          id: "lb-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Sliding Upright Guides",
          description: "Vertical posts guiding the bottom frame downward into the water.",
          x: 42,
          y: 50,
        },
        {
          id: "lb-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Steamboat Hull & Paddlewheel",
          description: "Shallow-draft river packet hull with overhanging side guards.",
          x: 75,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Transverse Cross Section Showing Bellows Rigging",
      caption:
        "Cross-sectional detail illustrating how ropes from the central windlass pass over gunwale pulleys to pull the lower bellows floor downward.",
      svgType: "lincoln-buoy",
      callouts: [
        {
          id: "lb-5",
          figureRef: "Fig. 2",
          label: "E",
          element: "Gunwale Pulley Block",
          description:
            "Overhanging pulley redirecting horizontal cable tension into vertical pull.",
          x: 25,
          y: 40,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1830s and 1840s, western river commerce on the Ohio, Mississippi, and Sangamon rivers was constantly paralyzed by seasonal low water. When steamboats ran aground on submerged sandbars or mudflats, passengers and crew were stranded for days, and heavy freight had to be laboriously unloaded onto flatboats or 'grasshoppered' over bars using wooden spars, capstans, and block-and-tackle.",
    priorArtLimitations: [
      "Manually offloading cargo onto lighters was slow, expensive, and ruined perishable goods.",
      "'Sparring' or 'grasshopping' a steamboat used heavy wooden stilts driven into the riverbed, risking hull fracture and boiler explosions under excessive winch strain.",
      "Fixed shallow-draft hulls had restricted freight capacity and rolled dangerously in choppy open water.",
    ],
    breakthroughInsight:
      "Lincoln recognized that instead of removing weight from the boat, one could mechanically increase the boat's submerged volume. By using Charles Goodyear's newly invented vulcanized rubber to build collapsible bellows under the guards, a steamboat could dynamically expand its displacement, reduce its draft by 1–2 feet on demand, float over the shoal, and deflate the bellows to resume high-speed steaming.",
    patentWars: [
      {
        rivalName: "No Courtroom Rival (The Frontier River Obstacle)",
        rivalClaim:
          "Traditional riverboat captains were skeptical of newfangled mechanical apparatuses, preferring brute-force sparring and lightering.",
        conflictDetails:
          "Lincoln filed US Patent No. 6,281 with no interference proceedings. While in Washington, D.C. as a Congressman, Lincoln visited the Patent Office and worked with Springfield craftsman Walter Davis to whittle a detailed wooden demonstration model of the boat with working miniature bellows.",
        resolution:
          "Patent No. 6,281 was granted on May 22, 1849. Although riverboats never adopted the system due to the heavy weight and durability limits of 1840s vulcanized rubber cloth, the patent stands as an enduring testament to Lincoln's mechanical genius.",
        legalOutcome:
          "Abraham Lincoln remains the only President of the United States to ever hold a registered US patent.",
      },
    ],
    civilizationalImpact:
      "While Lincoln's patent was never commercialized during his lifetime, his mechanical ingenuity shaped his leadership during the Civil War. He took intense personal interest in naval technology, directly championing John Ericsson's ironclad USS Monitor and personally testing breech-loading rifles and balloons on the White House grounds.",
    funFact:
      "Lincoln hand-whittled the 18-inch wooden patent model himself, using a jackknife and pine wood. That original whittled model is now permanently preserved in the Smithsonian Institution's National Museum of American History in Washington, D.C.",
    aftermath:
      "Lincoln famously delivered his 'Second Lecture on Discoveries and Inventions' in 1859, declaring that the patent system was one of the three greatest achievements in human history, alongside the discovery of America and the invention of printing: 'The patent system secured to the inventor, for a limited time, the exclusive use of his invention; and thereby added the fuel of interest to the fire of genius, in the discovery and production of new and useful things.'",
    sideNotes: [
      "In 1831, 22-year-old Lincoln was steering a flatboat loaded with cargo down the Sangamon River when it stranded on a mill dam at New Salem, Illinois. Lincoln famously drilled a hole in the overhanging bow to drain the trapped water, jacked the boat over the dam, and plugged the hole, demonstrating his early intuitive mastery of fluid displacement.",
      "The inscription above the entrance of the United States Patent and Trademark Office in Alexandria, Virginia, bears Lincoln's famous quote: 'The Patent System Added the Fuel of Interest to the Fire of Genius.'",
    ],
  },
  tags: [
    "Abraham Lincoln",
    "Presidential Patent",
    "Marine Engineering",
    "Buoyancy",
    "Steamboat",
    "Mississippi River",
    "19th Century",
    "Fluid Dynamics",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 1,
    patentWarYears: "1849",
    impactScore: 98,
  },
};
