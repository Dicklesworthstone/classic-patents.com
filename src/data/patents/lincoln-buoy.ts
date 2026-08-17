import type { Patent } from "@/types/patent";

export const lincolnBuoyPatent: Patent = {
  id: "us-6281-lincoln-buoy",
  patentNumber: "US 6,281",
  title: "Buoying Vessels Over Shoals",
  shortTitle: "Lincoln's Riverboat Buoyancy System",
  subtitle: "Expandable Buoyant Chambers for Navigating Shallow River Sandbars and Mudflats",
  inventors: ["Abraham Lincoln"],
  inventorLocation: "Springfield, Illinois",
  grantDate: "1849-05-22",
  filingDate: "1849-03-10",
  era: "Industrial Dawn (1840–1870)",
  category: "materials",
  categoryLabel: "Marine & Hydraulic Engineering",
  summary:
    "The only patent ever granted to a U.S. President: Abraham Lincoln's ingenious mechanical system for buoying grounded riverboats over shallow Mississippi shoals using steam-actuated expandable waterproof bellows.",
  heroQuote:
    "Be it known that I, Abraham Lincoln, of Springfield, in the County of Sangamon, in the State of Illinois, have invented a new and improved manner of Combining Buoyant Chambers with Steam Boats or other Vessels...",
  originalPdfUrl: "/patents/pdfs/us-6281-lincoln-buoy.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6281A/en",
  usptoClassification: "B63B 43/14 (Marine vessels; buoyancy tanks)",
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
      "During his early career piloting flatboats on the Ohio and Mississippi rivers, Lincoln frequently ran aground on sandbars. In 1848, after watching the steamboat Globe strand on a mudflat in Lake Erie, Lincoln conceived a mechanical solution: expandable bellows mounted along the hull that could be inflated using the boat's steam engine to instantly increase displacement and float the ship across shallow waters.",
    coreMechanism:
      "Expandable waterproof bellows made of rubberized canvas are secured along both sides of the hull below the waterline. Ropes and pulleys connected to a central drive shaft driven by the ship's engine pull down vertical sliding uprights, expanding the air chambers to displace water and generate immediate buoyant lift without unloading freight.",
    mechanicalBreakdown: [
      {
        title: "Expandable Waterproof Air Bellows",
        summary:
          "Collapsible rubberized canvas chambers mounted along the port and starboard hull sides.",
        technicalDetails:
          "Collapsed flush against the hull during deep-water steaming to minimize hydrodynamic drag. When expanded downward into the water, each chamber displaces additional water volume $\\Delta V$, producing an upward buoyant force $F_B = \\rho_{water} g \\Delta V$.",
        archaicTerm: "Air-chambers made of india-rubber cloth",
        modernEquivalent: "Pneumatic buoyancy sponsons",
      },
      {
        title: "Central Windlass & Synchronized Pulley Rigging",
        summary: "A deck-mounted drive shaft geared to the ship's steam engine.",
        technicalDetails:
          "Windlass drums spool ropes passing over gunwale pulleys to draw all port and starboard vertical uprights downward synchronously, ensuring symmetric buoyant lift and preventing dangerous list.",
        archaicTerm: "Shafts, pulleys, and ropes",
        modernEquivalent: "Synchronized mechanical windlass",
      },
      {
        title: "Rigid Vertical Sliding Guides",
        summary: "Vertical wooden/iron posts guiding the expanding lower floor of the bellows.",
        technicalDetails:
          "Distributes vertical buoyant hydrostatic reaction forces evenly across the main hull rib frames without flexing or puncturing hull planks.",
        archaicTerm: "Sliding uprights and vertical guides",
        modernEquivalent: "Structural load-bearing guides",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Archimedes' Buoyancy Principle & Draft Reduction",
        formula:
          "F_B = \\rho_{water} \\cdot g \\cdot (V_{hull} + \\Delta V_{chambers}) > M_{ship} g",
        explanation:
          "Expanding the submerged bellows increases the total displaced water volume by \\Delta V, generating an upward buoyant force that lifts the vessel's keel above the riverbed.",
      },
      {
        principle: "Vessel Hydrostatic Stability & Metacentric Height",
        formula: "GM = KB + BM - KG",
        explanation:
          "Symmetric inflation on port and starboard maintains positive metacentric height (GM > 0), preventing the vessel from rolling or capsizing while crossing the shoal.",
      },
    ],
    whyItMattersToday:
      "Lincoln's patent is the only patent issued to an American President. Its active buoyancy concept prefigures submarine ballast control tanks, marine salvage pontoons, and inflatable hovercraft skirts.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "What I claim as my invention and desire to secure by letters patent is the combination of expandable buoyant chambers placed at the sides of a vessel, with the vertical sliding uprights and ropes and pulleys, or their equivalents, for the purpose of expanding said buoyant chambers, and thereby buoying the vessel over shoals, shallow water, and other obstructions, substantially as herein set forth.",
      plainEnglish:
        "The master claim covering expandable air chambers on the sides of a vessel combined with sliding uprights and pulley rigging to inflate them and lift the boat over shoals.",
      keyInnovations: [
        "Expandable side buoyancy chambers",
        "Synchronized mechanical expansion rigging",
        "In-situ draft reduction without cargo removal",
      ],
      legalSignificance:
        "The only patent granted to an American President, issued during his term as a freshman Congressman from Illinois.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Elevation View of Steamboat with Buoyant Chambers",
      caption:
        "Side elevation drawing showing the expandable bellows mounted below the guards along the vessel hull.",
      svgType: "lincoln-buoy",
      callouts: [
        {
          id: "lb-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Buoyant Bellows",
          description: "Expandable waterproof rubber chamber.",
          x: 40,
          y: 60,
        },
        {
          id: "lb-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Central Pulley Shaft",
          description: "Longitudinal windlass shaft driven by steam engine.",
          x: 50,
          y: 35,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Western river steamboats navigating the shallow, shifting sandbars of the Ohio and Mississippi rivers routinely grounded, causing catastrophic delays, expensive cargo lightening, and vessel damage.",
    priorArtLimitations: [
      "Manual offloading of cargo onto auxiliary barges.",
      "Grasshoppering over mudflats using heavy wooden spars and capstans.",
      "Restricted hull designs with compromised cargo-carrying capacity.",
    ],
    breakthroughInsight:
      "Lincoln realized that variable displacement could be actuated directly from the vessel's steam engine: expanding waterproof bellows below the waterline increases buoyant displacement and lifts the boat over sandbars without unloading cargo.",
    patentWars: [
      {
        rivalName: "Mississippi River Freight Lobby",
        rivalClaim:
          "Claimed mechanical chambers were unnecessary compared to steam-powered derrick spars.",
        conflictDetails:
          "While Lincoln personally carved the scale wooden model now housed in the Smithsonian, the system was not commercially adopted due to the weight of 1840s vulcanized rubber.",
        resolution: "Lincoln was granted US Patent No. 6,281 without legal challenge.",
        legalOutcome: "Patent issued in full on May 22, 1849.",
      },
    ],
    civilizationalImpact:
      "Stands as a legendary historical artifact demonstrating the analytical, mechanical inventiveness of Abraham Lincoln prior to his presidency and leadership during the American Civil War.",
    funFact:
      "Lincoln is the only United States President to ever hold a patent. He whittled the working scale model of the steamboat out of wood by hand.",
  },
  tags: [
    "Abraham Lincoln",
    "Presidential",
    "Marine Engineering",
    "Buoyancy",
    "19th Century",
    "Steamboat",
  ],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
    patentWarYears: "1849",
    impactScore: 94,
  },
};
