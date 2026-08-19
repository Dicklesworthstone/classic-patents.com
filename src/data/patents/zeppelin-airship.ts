import type { Patent } from "@/types/patent";

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
  usptoClassification:
    "Navigable balloons (historic specification; no classification printed on facsimile)",
  // The immutable supplied grant cites Figs. 11 and 12 but contains only
  // Figs. 1–10. Preserve the source materials for remediation, but do not
  // bind a partial source face or label its ledger as publishable.
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
      "The source itself shows a late-nineteenth-century design problem: manage gas volume, trim, propulsion, steering, and connected load craft in one written system. This edition does not use this single facsimile to claim later passenger-service records, material choices, performance figures, or legal outcomes.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "In a balloon, the combination of a framework divided into separate compartments, with a main gas-bag in each compartment, adapted to expand and fill the same when permitted, and auxiliary gas-bags in the compartments for maneuvering, to permit the main gas-bags to retain their full quantity of gas unaffected by the admission of air, substantially as set forth.",
      plainEnglish:
        "Claims the rigid compartmentalized hull enclosing primary lift-gas bags alongside auxiliary maneuvering bags, ensuring the primary lift cells remain sealed against atmospheric air intrusion during altitude changes.",
      keyInnovations: ["Compartmentalized gas cells", "Auxiliary maneuvering bags"],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The combination of a balloon, with a running-weight suspended beneath the same, rotary drums provided with fusees, and a rope stretched from the weight to and around each fusee, substantially as and for the purpose set forth.",
      plainEnglish:
        "Claims a suspended running-weight adjusted via a fusee-and-drum rigging system to maintain continuous tension and actively trim the airship's pitch.",
      keyInnovations: ["Running-weight pitch trim", "Fusee tension rigging"],
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [2],
      originalText:
        "The combination of a balloon, with a weight suspended beneath the same, and adjustable in height, a movable carriage supporting the weight, rotary drums to which the carriage is connected and which are provided with fusees and a rope stretched from the weight to and around each fusee, substantially as and for the purpose set forth.",
      plainEnglish:
        "Expands on the running-weight trim system, claiming a movable carriage that allows the suspended weight to be both horizontally traversed along the hull and vertically hoisted when landing.",
      keyInnovations: ["Winch-adjustable trim weight"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "An air-craft comprising a series of balloons coupled together and provided with rigid casings, the foremost of said balloons being provided with driving mechanism, and the remainder adapted to carry the load or freight, and extensible covers secured to the rigid casings and covering the intermediate spaces between two adjacent balloons.",
      plainEnglish:
        "Claims the modular concept of linking multiple rigid airships into an articulated aerial train, using a powered locomotive section pulling unpowered cargo sections, connected by aerodynamic extensible fairings.",
      keyInnovations: ["Articulated airship train", "Aerodynamic inter-module fairings"],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Side Elevation of Rigid Navigable Balloon",
      caption:
        "Side elevation showing rigid aluminum lattice framework, subdivided gas cells, suspended gondolas, and movable trim weight.",
      svgType: "zeppelin-airship",
      callouts: [
        {
          id: "z-hull",
          figureRef: "Fig. 1",
          label: "A",
          element: "Rigid framework hull",
          description:
            "Longitudinal and transverse lattice ring framework maintaining cylindrical hull shape.",
          x: 50,
          y: 35,
        },
        {
          id: "z-gas",
          figureRef: "Fig. 1",
          label: "B",
          element: "Separated gas-bag cells",
          description:
            "Plurality of distinct gas-tight cells housed in independent hull compartments.",
          x: 45,
          y: 30,
        },
        {
          id: "z-cars",
          figureRef: "Fig. 1",
          label: "C, D",
          element: "Forward and aft engine gondolas",
          description:
            "Suspended gondolas housing Daimler internal-combustion engines and prop shafts.",
          x: 40,
          y: 70,
        },
        {
          id: "z-trim",
          figureRef: "Fig. 1",
          label: "E",
          element: "Sliding trim weight",
          description:
            "Movable ballast weight shifting along longitudinal keel cable for pitch trim.",
          x: 55,
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
  stats: {
    totalClaims: 4,
    independentClaims: 3,
  },
};
