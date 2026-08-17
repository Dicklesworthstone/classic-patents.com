import type { Patent } from "@/types/patent";

export const daimlerEnginePatent: Patent = {
  id: "us-361931-daimler-engine",
  patentNumber: "US 361,931",
  title: "Motor Carriage",
  shortTitle: "Daimler High-Speed Petrol Engine & Motor Carriage",
  subtitle:
    "High-RPM Lightweight Internal Combustion, Hot-Tube Ignition, and Kinematic Bevel Gear Differential",
  inventors: ["Gottlieb Daimler"],
  inventorLocation: "Cannstatt, Germany",
  grantDate: "1887-04-26",
  filingDate: "1886-09-18",
  era: "Gilded Age & Grid (1870–1900)",
  category: "consumer",
  categoryLabel: "Automotive Powertrains & High-Speed ICE",
  summary:
    "The birth of the modern automobile: on April 26, 1887, Gottlieb Daimler received US Patent No. 361,931 for the high-speed internal combustion engine and motor carriage. Before Daimler, gas engines (such as Nikolaus Otto's stationary 4-stroke engine) were massive cast-iron beasts weighing over 300 kilograms per horsepower and limited to 150–200 RPM, making vehicle propulsion impossible. Daimler revolutionized internal combustion by increasing operational speed to 600–900 RPM ($P = \\frac{\\text{BMEP} \\cdot V_d \\cdot N}{120}$). By inventing a platinum hot-tube glow ignition system, an enclosed crankcase with splash lubrication, and a bevel-gear differential drivetrain ($\\omega_{\\text{left}} + \\omega_{\\text{right}} = 2\\omega_{\\text{pinion}}$), Daimler built the high power-to-weight powertrain that launched global automotive transportation.",
  heroQuote:
    "Be it known that I, Gottlieb Daimler, have invented certain new and useful Improvements in Motor Carriages, of which the following is a specification...",
  originalPdfUrl: "/patents/pdfs/us-361931-daimler-engine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US361931A/en",
  usptoClassification: "B62D 61/06 (Motor vehicles / Engine-driven carriages)",
  originalTextAsset: {
    url: "/patents/transcripts/us-361931-daimler-engine.txt",
    pageCount: 6,
  },
  originalText: `UNITED STATES PATENT OFFICE.
GOTTLIEB DAIMLER, OF CANNSTATT, GERMANY.

MOTOR-CARRIAGE.

SPECIFICATION forming part of Letters Patent No. 361,931, dated April 26, 1887.
Application filed September 18, 1886. Serial No. 213,912. (No model.) Patented in Germany October 26, 1886, No. 39,367.

To all whom it may concern:
Be it known that I, GOTTLIEB DAIMLER, a subject of the King of Würtemberg, residing at Cannstatt, in the Kingdom of Würtemberg, German Empire, have invented certain new and useful Improvements in Motor-Carriages; and I do hereby declare that the following is a full, clear, and exact description of the invention.

The object of my invention is to produce a light, compact, and efficient motor-vehicle capable of transporting passengers and goods upon ordinary roads at high speeds without requiring tracks or heavy steam-boilers.

The invention consists essentially:
First, in a high-speed gas or petroleum internal-combustion engine having an enclosed crankcase and an incandescent hot-tube ignition apparatus, whereby the engine can operate continuously at six hundred to nine hundred revolutions per minute.
Second, in the arrangement and mounting of said engine vertically within or upon the frame of a carriage, with the driving-shaft connected by flexible belts, pulleys, and friction clutches to a countershaft.
Third, in a differential gear mechanism transmitting power from said countershaft to the rear driving wheels, whereby the wheels can revolve at different speeds when turning corners while each receiving driving torque from the engine.
Fourth, in a steering mechanism connected to the front carriage axle, controlled by a vertical steering spindle and handle convenient to the driver's seat.`,
  plainEnglishExplanation: {
    overview:
      "In the 1880s, stationary gas engines were giant industrial machines bolted into concrete factory basements. They were heavy, slow, and cooled by running city tap water. Gottlieb Daimler, together with his chief designer Wilhelm Maybach, broke the speed barrier of internal combustion. By inventing an incandescent glow tube that ignited gasoline vapor instantaneously and an enclosed flywheel crankcase that ran at 700 RPM, Daimler reduced engine weight per horsepower from 300 kg/hp down to 40 kg/hp, creating the first practical mobile engine light enough to mount on a horse carriage.",
    coreMechanism:
      "A vertical four-stroke cylinder ($V_d = 462\\text{ cm}^3$) aspirates a vaporized gasoline-air charge through an automatic atmospheric intake valve. As the piston ascends on the compression stroke ($r = 3.5:1$), the fuel-air charge is forced into a platinum-alloy incandescent tube heated from outside by a miniature gasoline blowtorch to $T_{\\text{tube}} \\approx 850^\\circ\\text{C}$. Peak compression pressure forces the mixture past the tube threshold, self-igniting without mechanical valves or electrical spark batteries. The exploding gas expands at $P_{\\text{peak}} \\approx 1.8\\text{ MPa}$, driving the cast-iron piston downward. Dual counter-rotating internal flywheels in an oil-tight aluminum/iron crankcase smooth out torque pulses and drive an output bevel pulley. Power is transmitted through a tensionable leather flat belt to a rear differential axle, where two coaxial half-shafts are linked by bevel spider pinions ($\\omega_{\\text{left}} + \\omega_{\\text{right}} = 2\\omega_{\\text{pinion}}$), allowing the outer wheel to spin faster on curves without tire slip.",
    mechanicalBreakdown: [
      {
        title: "High-RPM Vertical Cylinder & Enclosed Crankcase",
        summary: "Lightweight vertical single-cylinder layout with internal flywheels.",
        technicalDetails:
          "Enclosing dual balanced flywheels inside an oil-tight crankcase protected rotating parts from road dust and enabled continuous splash lubrication, raising continuous operating speed from $180\\text{ RPM}$ to over $750\\text{ RPM}$.",
        archaicTerm: "Vertical petroleum motor with enclosed casing",
        modernEquivalent: "High-speed single-cylinder ICE crankcase",
      },
      {
        title: "Incandescent Glow Hot-Tube Ignition",
        summary: "Closed platinum-nickel tube heated externally by burner flame.",
        technicalDetails:
          "Eliminated erratic 19th-century slide-valve ignition. When cylinder compression reaches peak pressure $P_{\\text{comp}} \\approx 4.5\\text{ bar}$, fresh mixture is driven into the red-hot tube ($850^\\circ\\text{C}$), automatically triggering detonation at Top Dead Center.",
        archaicTerm: "Incandescent ignition tube and heating-lamp",
        modernEquivalent: "Hot-tube ignition / Compression glow point",
      },
      {
        title: "Variable-Tension Belt & Friction Cone Transmission",
        summary: "Clutch-tensioned belt drive providing two forward drive ratios.",
        technicalDetails:
          "A hand lever tightens a leather belt between graduated stepped pulleys, smoothly absorbing engine engagement shock and providing variable slip during vehicle acceleration from a standstill.",
        archaicTerm: "Friction-pulley and belt-shifting mechanism",
        modernEquivalent: "Friction cone clutch & belt transmission",
      },
      {
        title: "Bevel-Gear Rear Differential Axle",
        summary: "Epicyclic bevel gear cluster dividing torque between drive wheels.",
        technicalDetails:
          "The central differential carrier holds two bevel pinions engaging side gears keyed to left and right half-shafts, satisfying the kinematic relationship $\\omega_{\\text{left}} + \\omega_{\\text{right}} = 2\\omega_{\\text{carrier}}$ and preventing axle binding on turns.",
        archaicTerm: "Compensating differential gearing",
        modernEquivalent: "Open bevel-gear differential axle",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Internal Combustion Engine Power Scaling",
        formula:
          "P_{\\text{brake}} = \\frac{\\text{BMEP} \\cdot V_d \\cdot N}{120 \\times 1000} \\text{ (kW)}",
        explanation:
          "Engine power is directly proportional to rotational speed $N$. By elevating engine speed from $150\\text{ RPM}$ to $750\\text{ RPM}$, Daimler extracted 5 times more mechanical power from the exact same cylinder displacement $V_d$, reducing engine mass per horsepower by $80\\%$.",
      },
      {
        principle: "Kinematics of Differential Wheel Gearing",
        formula:
          "\\omega_{\\text{left}} + \\omega_{\\text{right}} = 2\\omega_{\\text{pinion}}, \\quad v_{\\text{outer}} = v_{\\text{vehicle}} \\left(1 + \\frac{W_{\\text{track}}}{2 R_{\\text{turn}}}\\right)",
        explanation:
          "When cornering on a radius $R_{\\text{turn}}$, the outer wheel must travel a longer arc than the inner wheel. The bevel differential automatically splits torque while permitting different rotational velocities, eliminating tire scrubbing and axle fracture.",
      },
      {
        principle: "Hot-Tube Ignition Thermal Kinetics",
        formula:
          "t_{\\text{ignition}} = \\frac{\\ln(T_{\\text{auto}} / T_0)}{k_{\\text{thermal}}}, \\quad T_{\\text{tube}} \\ge 850^\\circ\\text{C} > T_{\\text{auto-gasoline}} (280^\\circ\\text{C})",
        explanation:
          "Ignition timing is governed by the compression wave driving the combustible mixture past the unburned boundary layer into the incandescent hot zone, causing instantaneous thermal detonation at maximum cylinder density.",
      },
    ],
    whyItMattersToday:
      "Daimler's high-speed petrol engine and drivetrain architecture established the fundamental blueprint of the modern motor vehicle: front-mounted or mid-mounted high-RPM liquid-fueled engine, mechanical clutch transmission, and rear differential drive axle. Daimler's company merged with Karl Benz's firm in 1926 to form Mercedes-Benz, the world's oldest continuous automobile manufacturer.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination, with a carriage body and running-gear, of a high-speed gas or petroleum motor mounted thereon, a driving-shaft rotated by said motor, a countershaft connected by belts and friction-clutches with the driving-shaft, and differential gearing connecting said countershaft with the driving-wheels, substantially as and for the purpose set forth.",
      plainEnglish:
        "The master motor carriage system claim covering a road vehicle powered by a high-speed petroleum engine linked via belt friction clutches and a differential gear to drive the road wheels.",
      keyInnovations: [
        "High-RPM petroleum powertrain",
        "Belt-tensioned clutch transmission",
        "Differential axle integration for road vehicles",
      ],
      legalSignificance:
        "The foundational US patent claim for self-propelled internal combustion automobiles with differential road propulsion.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a motor-carriage, the combination, with the motor and the driving-wheels, of a friction-pulley transmission comprising belts of different diameters, and a belt-tightening lever for engaging and disengaging said belts to vary the speed of the carriage relative to the motor.",
      plainEnglish:
        "The variable-speed transmission claim: stepped belt pulleys and a manual tightening lever allowing the driver to change gear ratios and engage/disengage engine power smoothly.",
      keyInnovations: [
        "Multi-ratio stepped pulley drive",
        "Belt-tightener clutch lever",
        "Smooth road vehicle acceleration",
      ],
      legalSignificance:
        "Protected the mechanical transmission interface between high-speed ICE engines and variable-speed road wheels.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a motor-carriage, the combination, with the motor cylinder, of an incandescent ignition-tube extending into the combustion space, and an external burner for maintaining said tube at red heat, whereby ignition of the compressed charge is effected automatically at high speed.",
      plainEnglish:
        "The hot-tube ignition claim: a glowing platinum-alloy tube maintained at red heat by an external burner to reliably ignite fuel charges at 600+ RPM without electric batteries.",
      keyInnovations: [
        "Incandescent glow tube ignition",
        "Battery-free high-speed detonation",
        "Reliable multi-hundred RPM combustion",
      ],
      legalSignificance:
        "Enabled high-speed automotive engine operation before the invention of reliable high-tension electrical spark plugs and magnetos.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Daimler Motor Carriage Side Elevation & Powertrain",
      caption:
        "Side elevation drawing of Daimler's four-wheeled motor carriage showing the vertical high-speed engine, hot-tube ignition, belt transmission pulleys, and differential rear axle.",
      svgType: "daimler-engine",
      callouts: [
        {
          id: "de-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Vertical High-Speed Engine",
          description: "Single-cylinder petrol motor operating at 700 RPM with enclosed crankcase.",
          x: 48,
          y: 52,
        },
        {
          id: "de-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Incandescent Hot-Tube Igniter",
          description: "External burner heating platinum tube to 850°C for compression detonation.",
          x: 44,
          y: 40,
        },
        {
          id: "de-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Belt Tension Clutch Lever",
          description: "Driver control lever shifting tension to select road drive ratios.",
          x: 35,
          y: 42,
        },
        {
          id: "de-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Bevel-Gear Differential Axle",
          description: "Rear differential dividing torque between outer and inner drive wheels.",
          x: 72,
          y: 68,
        },
        {
          id: "de-5",
          figureRef: "Fig. 1",
          label: "E",
          element: "Rack & Pinion Steering Tiller",
          description: "Vertical steering spindle controlling front carriage axle angle.",
          x: 28,
          y: 35,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Throughout the 19th century, inventors tried to build 'horseless carriages' powered by steam boilers or heavy electric lead-acid batteries. Steam carriages required 45 minutes to build boiler pressure, consumed vast quantities of coal and water, and weighed several tons. Electric vehicles could only travel 15 miles before exhausting their heavy batteries. A completely new, lightweight, high-energy-density prime mover was needed to make personal road transport possible.",
    priorArtLimitations: [
      "Otto and Langen atmospheric engines were limited to 80 RPM and weighed over 500 kg per kilowatt.",
      "Early slide-valve flame ignitions blew out at engine speeds above 200 RPM.",
      "Steam tractors destroyed public roads and produced clouds of smoke, sparks, and boiling water.",
    ],
    breakthroughInsight:
      "Daimler and Maybach realized that petroleum gasoline (then considered a dangerous waste byproduct of kerosene refining) possessed extraordinary chemical energy density ($44\\text{ MJ/kg}$). By radically accelerating engine rotational speed to 750 RPM using hot-tube ignition and an enclosed crankcase, they could extract high mechanical power from a tiny, 40-kilogram engine package.",
    patentWars: [
      {
        rivalName:
          "George B. Selden and the Association of Licensed Automobile Manufacturers (ALAM)",
        rivalClaim:
          "Patent attorney George Selden filed a broad US patent application in 1879 claiming all liquid-hydrocarbon road vehicles, attempting to collect a royalty on every automobile built in America.",
        conflictDetails:
          "ALAM used the Selden patent to cartelize the American auto industry and sued Henry Ford in 1903. Ford cited Daimler's prior 1887 patent US 361,931 and European engine publications.",
        resolution:
          "In 1911, the Federal Appeals Court ruled in Ford's favor (*Columbia Motor Car Co. v. C.A. Duerr & Co.*), finding that modern high-speed Otto/Daimler engines did not infringe Selden's slow Brayton-cycle claim.",
        legalOutcome:
          "Daimler's prior art was the key evidence that broke the Selden patent monopoly, establishing open competition in global automobile manufacturing.",
      },
    ],
    civilizationalImpact:
      "In 1885, Daimler mounted his engine onto a wooden bicycle to create the *Reitwagen* (the world's first motorcycle), and in 1886 installed it in a four-seat carriage (the first four-wheeled automobile). Daimler's lightweight petrol engines powered the world's first motorboats, airships, and trucks, inaugurating the 20th-century automotive and aviation age.",
    funFact:
      "Daimler's famous three-pointed star logo, adopted in 1909, symbolized Gottlieb Daimler's personal ambition for his high-speed engine to dominate transportation across 'land, water, and air.'",
    aftermath:
      "Gottlieb Daimler died in Cannstatt in 1900 at age 65. His chief engineer Wilhelm Maybach continued designing world-famous engines, including the 1901 Mercedes 35 hp, regarded as the first truly modern racing automobile.",
    sideNotes: [
      "In 1888, Bertha Benz (wife of Daimler's rival Karl Benz) took her husband's motorwagen on the first long-distance automobile road trip (106 km from Mannheim to Pforzheim), using ligroin solvent purchased from local pharmacies to fuel the journey.",
      "Daimler's early surface carburetor had no throttle butterfly; instead, the engine speed was regulated by a hit-and-miss exhaust valve lifter that skipped exhaust cycles when the engine over-sped.",
    ],
  },
  tags: [
    "Gottlieb Daimler",
    "Wilhelm Maybach",
    "Automobile",
    "Internal Combustion Engine",
    "High-Speed Petrol Engine",
    "Hot-Tube Ignition",
    "Differential Axle",
    "Mercedes-Benz",
    "Gilded Age",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1886–1911",
    impactScore: 100,
  },
};
