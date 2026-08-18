import type { Patent } from "@/types/patent";

export const ottoEnginePatent: Patent = {
  id: "us-194047-otto-engine",
  patentNumber: "US 194,047",
  title: "Improvement in Gas-Motor Engines",
  shortTitle: "Otto Four-Stroke Internal Combustion Cycle",
  subtitle:
    "Intake, Compression, Power, and Exhaust Four-Stroke Cycle with Pre-Ignition Charge Compression",
  inventors: ["Nikolaus August Otto"],
  inventorLocation: "Deutz, Kingdom of Prussia, German Empire",
  grantDate: "1877-08-14",
  filingDate: "1877-03-24",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "consumer",
  categoryLabel: "Thermodynamics & Internal Combustion",
  summary:
    "The 1877 internal combustion milestone that founded the automotive age: Nikolaus August Otto's 'Silent Otto' engine introducing the four-stroke cycle (Intake, Compression, Power, Exhaust). By compressing the gaseous fuel-air charge prior to ignition across four distinct piston strokes and two crankshaft revolutions, Otto quadrupled thermal efficiency and created the modern piston powerplant.",
  heroQuote:
    "The first outstroke introduces the combustible mixture; the first instroke compresses it; the second outstroke is the working stroke, produced by ignition and expansion; and the second instroke expels the burned products...",
  originalPdfUrl: "/patents/pdfs/us-194047-otto-engine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US194047/en",
  usptoClassification: "F02B 75/02 (Four-stroke engines; Otto thermodynamic cycle)",
  originalTextAsset: {
    url: "/patents/transcripts/us-194047-otto-engine.txt",
    pageCount: 8,
    kind: "reviewed-transcription",
  },
  originalText: `UNITED STATES PATENT OFFICE.
NICOLAUS AUGUST OTTO, OF DEUTZ, GERMANY, ASSIGNOR TO THE GAS-MOTOREN-FABRIK DEUTZ.

IMPROVEMENT IN GAS-MOTOR ENGINES.

Specification forming part of Letters Patent No. 194,047, dated August 14, 1877.
Application filed March 24, 1877.

To all whom it may concern:
Be it known that I, NICOLAUS AUGUST OTTO, residing at Deutz, in the Empire of Germany, have invented an Improved Gas-Motor Engine, of which the following is a specification:

In gas-engines heretofore constructed, such as the 'Lenoir' engine, the combustible mixture was drawn in during the first half of the working stroke and ignited without previous compression, resulting in great shock, small expansion, and excessive consumption of gas.

The nature of my invention consists in operating an engine by means of an explosive gaseous charge which is subjected to a four-stroke cycle accomplished during two complete revolutions of the crankshaft, as follows:

FIRST STROKE (Outward): The piston moves outward, drawing in a charge of air and combustible gas through a slide valve.
SECOND STROKE (Inward): The intake valve closes, and the returning piston compresses the gaseous charge into a clearance space or combustion chamber at the end of the cylinder.
THIRD STROKE (Outward - Working Stroke): The compressed charge is ignited by a flame port in the slide valve, rapidly burning and expanding with high pressure and temperature, forcing the piston outward to do mechanical work on the crankshaft.
FOURTH STROKE (Inward): The exhaust valve is held open, and the returning piston expels the burned gases from the cylinder into the exhaust pipe.

The four distinct operations are governed by a half-speed shaft geared to the crankshaft by a two-to-one gear ratio ($2:1$), driving the slide valve and exhaust cam.

By compressing the charge into the clearance space before ignition, the combustion is made gradual, the peak expansion pressure is doubled, and the heat of combustion is converted into mechanical work with far greater thermodynamic efficiency than has ever before been attained.

I claim as my invention:
1. The method of operating a gas-motor engine by drawing in a combustible charge during one stroke, compressing said charge in the cylinder during the return stroke, igniting and expanding the compressed charge during the next stroke to perform work, and expelling the combustion products during the fourth stroke, substantially as described.
2. The combination with the cylinder and piston of a half-speed camshaft geared in a two-to-one ratio to the crankshaft for governing the intake, ignition, and exhaust in synchronization with the four-stroke cycle.`,
  plainEnglishExplanation: {
    overview:
      "In the 1860s, early gas engines (like the Lenoir engine) operated without compression: the piston sucked in gas for half a stroke, ignited it at atmospheric pressure, and pushed out the rest of the stroke, yielding a pathetic thermal efficiency of barely $4\\%$. German engineer Nikolaus August Otto revolutionized thermodynamics by realizing that compressing the fuel-air mixture *before* ignition stores mechanical energy that drastically multiplies combustion temperature, pressure, and power. His 1877 patent defined the four-stroke 'Otto Cycle' that powers billions of cars, trucks, motorcycles, and airplanes today.",
    coreMechanism:
      "The engine executes four distinct piston strokes across two full rotations of the crankshaft ($720^\\circ$): (1) **Intake Stroke** ($0^\\circ\\text{--}180^\\circ$): Piston moves down, sucking in stoichiometric fuel-air mixture through an intake valve; (2) **Compression Stroke** ($180^\\circ\\text{--}360^\\circ$): Valves close, piston moves up, compressing the mixture into a compact combustion chamber ($r = 4:1\\text{ to }10:1$); (3) **Power Stroke** ($360^\\circ\\text{--}540^\\circ$): Spark or flame ignites the dense compressed charge, driving in-cylinder pressure to $>30\\text{ bar}$ and pushing the piston down with high force; (4) **Exhaust Stroke** ($540^\\circ\\text{--}720^\\circ$): Exhaust valve opens, piston moves up, sweeping spent combustion gases out the tailpipe. A half-speed camshaft geared at a $2:1$ ratio synchronizes the valve events.",
    mechanicalBreakdown: [
      {
        title: "2:1 Geared Half-Speed Camshaft / Slide-Valve Drive",
        summary: "Precision side-shaft rotating at half crankshaft speed.",
        technicalDetails:
          "Geared to the crankshaft by helical or bevel gears in an exact $2:1$ ratio ($\\omega_{\\text{cam}} = \\frac{1}{2} \\omega_{\\text{crank}}$). The camshaft carries the intake slide-valve eccentric and the exhaust cam lobe, ensuring valve events occur once every two crank revolutions ($720^\\circ$).",
        archaicTerm: "Half-speed shaft geared in a two-to-one ratio",
        modernEquivalent: "Overhead camshaft (OHC) / 2:1 timing gear & cam profile",
      },
      {
        title: "Closed-Chamber Pre-Ignition Compression Space",
        summary: "Clearance volume at cylinder head concentrating fuel-air charge.",
        technicalDetails:
          "Clearance volume $V_c$ dimensioned to achieve a compression ratio $r = \\frac{V_d + V_c}{V_c} = 4.5\\text{ to }6.0$. Pre-compressing the gas to $P_{\\text{comp}} = P_0 \\cdot r^\\gamma \\approx 7\\text{ to }10\\text{ bar}$ raises charge density and accelerates chemical flame front propagation ($S_L \\propto P^{0.2} T^{1.8}$).",
        archaicTerm: "Clearance space or combustion chamber at the end",
        modernEquivalent: "Cylinder head combustion chamber / Clearance volume",
      },
      {
        title: "Slide-Valve Flame Ignition Port & Gas Injector",
        summary: "Reciprocating slide valve transferring burning flame pocket into chamber.",
        technicalDetails:
          "A cast-iron slide valve plate reciprocating across the cylinder head. A small internal pocket carries a burning town-gas pilot flame into direct communication with the pressurized combustion chamber at top dead center ($360^\\circ$), initiating rapid deflagration without electrical spark plugs.",
        archaicTerm: "Slide valve with flame ignition port",
        modernEquivalent: "Electric spark plug / Electronic ignition system",
      },
      {
        title: "Dual Cast-Iron Inertial Flywheels",
        summary:
          "Twin high-inertia spoked wheels storing kinetic energy across three non-power strokes.",
        technicalDetails:
          "Two counter-balanced spoked cast-iron flywheels ($D = 1.4\\text{ m}, M = 220\\text{ kg}$ each) mounted on the crankshaft ends. The flywheel system stores $E_k = \\frac{1}{2} I \\omega^2 \\approx 18\\text{ kJ}$ of kinetic energy, driving the piston smoothly through the three non-power strokes (exhaust, intake, compression) with a coefficient of speed fluctuation $\\delta = \\frac{\\omega_{\\text{max}} - \\omega_{\\text{min}}}{\\omega_{\\text{mean}}} < 0.025$.",
        archaicTerm: "Heavy fly-wheels on the crank-shaft",
        modernEquivalent: "Engine flywheel & torsional harmonic damper",
      },
      {
        title: "Poppet Exhaust Valve & Cam-Driven Rocker Arm",
        summary: "Spring-loaded conical poppet valve sealing against combustion pressure.",
        technicalDetails:
          "A mushroom-shaped forged steel poppet valve located in the cylinder bottom head. Combustion pressure ($P > 30\\text{ bar}$) pushes the valve tighter against its $45^\\circ$ conical iron seat; at $520^\\circ$ crank angle, the half-speed cam lobe trips a pushrod rocker lever to unseat the valve against a $450\\text{ N}$ coil spring, exhausting spent gases before bottom dead center.",
        archaicTerm: "Exhaust poppet valve operated by a lever from the side-shaft",
        modernEquivalent: "Mushroom exhaust poppet valve & cam-rocker train",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Ideal Otto Cycle Thermodynamic Efficiency",
        formula:
          "\\eta_{\\text{Otto}} = 1 - \\frac{1}{r^{\\gamma - 1}}, \\quad r = \\frac{V_{\\text{max}}}{V_{\\text{min}}}, \\quad \\gamma = \\frac{C_p}{C_v} \\approx 1.40",
        explanation:
          "Thermodynamic thermal efficiency depends exclusively on the compression ratio $r$; raising $r$ from 1.0 (Lenoir) to 5.0 (Otto) jumps thermal efficiency from $0\\%$ to $47.5\\%$, quadrupling work output per unit of fuel.",
      },
      {
        principle: "Isentropic Compression & Combustion Temperature Rise",
        formula:
          "T_2 = T_1 \\cdot r^{\\gamma - 1}, \\quad P_3 = P_2 \\cdot \\left(\\frac{T_3}{T_2}\\right) = P_1 r^\\gamma \\left(1 + \\frac{q_{\\text{in}}}{C_v T_2}\\right)",
        explanation:
          "Pre-compression elevates the baseline temperature $T_2$ before combustion, allowing the isochoric heat addition $q_{\\text{in}}$ to reach peak combustion pressures $P_3 > 30\\text{ bar}$ that deliver massive expansion work.",
      },
      {
        principle: "Kinematics of 4-Stroke Piston Motion & Indicated Power",
        formula:
          "P_{\\text{indicated}} = \\frac{\\text{IMEP} \\cdot V_{\\text{displacement}} \\cdot N_{\\text{rpm}}}{120}",
        explanation:
          "Because a four-stroke engine produces one power stroke for every two revolutions, indicated power is calculated with a divisor of 120, delivering smooth, balanced high-speed power.",
      },
      {
        principle: "Volumetric Efficiency & Gas Exchange Dynamics",
        formula:
          "\\eta_v = \\frac{\\dot{m}_{\\text{charge}}}{\\rho_{\\text{inlet}} V_d \\left(\\frac{N_{\\text{rpm}}}{120}\\right)} = \\frac{1}{V_d} \\int_{\\text{intake}} C_d A_{\\text{valve}}(t) v(t) \\, dt",
        explanation:
          "Optimizing intake valve opening area and slide valve port timing maximizes the mass of fresh combustible charge ingested into the cylinder per cycle, directly dictating brake mean effective pressure (BMEP).",
      },
    ],
    whyItMattersToday:
      "Nikolaus Otto's four-stroke cycle is the mechanical heart of modern global civilization. Virtually every gasoline car, truck, lawnmower, generator, and propeller-driven aircraft in existence operates on the four strokes (Intake, Compression, Power, Exhaust) patented by Otto in 1877. It made compact, high-power gasoline engines possible, enabling Gottlieb Daimler and Karl Benz to create the automobile.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The method of operating a gas-motor engine by drawing in a combustible charge during one stroke, compressing said charge in the cylinder during the return stroke, igniting and expanding the compressed charge during the next stroke to perform work, and expelling the combustion products during the fourth stroke, substantially as described.",
      plainEnglish:
        "Master pioneer claim: the four-stroke internal combustion cycle consisting of (1) intake stroke, (2) compression stroke, (3) power/expansion stroke, and (4) exhaust stroke across two crankshaft revolutions.",
      keyInnovations: [
        "Four-stroke internal combustion thermodynamic cycle",
        "Pre-ignition charge compression in cylinder",
        "Two-revolution four-stroke operating sequence",
      ],
      legalSignificance:
        "One of the most consequential claims in engineering history, defining the standard four-stroke internal combustion cycle worldwide.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination with the cylinder and piston of a half-speed camshaft geared in a two-to-one ratio to the crankshaft for governing the intake, ignition, and exhaust in synchronization with the four-stroke cycle.",
      plainEnglish:
        "Specifies the 2:1 geared half-speed camshaft that synchronizes intake, ignition, and exhaust valve timing with the two-revolution four-stroke cycle.",
      keyInnovations: [
        "Two-to-one (2:1) half-speed camshaft gear drive",
        "Mechanical 4-stroke valve synchronization",
      ],
      legalSignificance:
        "Protected the universal camshaft timing geometry used in four-stroke internal combustion engines.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Sectional Elevation of Otto Four-Stroke Gas Engine",
      caption:
        "Cutaway drawing showing horizontal cylinder, piston, 2:1 side camshaft, slide-valve flame igniter, exhaust valve, and heavy flywheel.",
      svgType: "otto-engine",
      callouts: [
        {
          id: "oe-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Combustion Cylinder & Piston",
          description: "Water-cooled cylinder executing four distinct cycle strokes.",
          x: 50,
          y: 50,
        },
        {
          id: "oe-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "2:1 Geared Half-Speed Camshaft",
          description: "Side shaft spinning at half engine RPM to control valve timing.",
          x: 40,
          y: 75,
        },
        {
          id: "oe-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Flame Ignition Slide-Valve",
          description: "Reciprocating slide plate introducing pilot flame at top dead center.",
          x: 20,
          y: 40,
        },
        {
          id: "oe-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Crankshaft & Massive Flywheel",
          description: "Main shaft carrying flywheel energy through non-power strokes.",
          x: 80,
          y: 55,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1860s and 1870s, steam engines were bulky, dangerous, and required licensed boilermen, making them impractical for small workshops. Existing Lenoir atmospheric gas engines consumed immense amounts of expensive coal gas (over 3 cubic meters per horsepower-hour) with violent, vibrating operation that shook foundations.",
    priorArtLimitations: [
      "Lenoir's 1860 engine ignited uncompressed gas at atmospheric pressure, losing most heat to water jackets.",
      "Otto and Langen's earlier 1867 'free-piston' atmospheric engine was extremely noisy, rattling violently on a tall vertical rack.",
      "French engineer Alphonse Beau de Rochas published a theoretical pamphlet in 1862 describing a four-stroke cycle but never built a working engine.",
    ],
    breakthroughInsight:
      "In 1876, Otto built a prototype engine that compressed the gas mixture prior to ignition. The prototype ran so smoothly and quietly compared to existing engines that it was christened the 'Silent Otto,' producing 3 horsepower while consuming one-quarter the fuel of any existing engine.",
    patentWars: [
      {
        rivalName: "Alphonse Beau de Rochas and Christian Reithmann",
        rivalClaim:
          "In 1884, rival German manufacturers discovered Beau de Rochas's obscure 1862 theoretical pamphlet, challenging Otto's German patent (DRP 532).",
        conflictDetails:
          "German courts invalidated Otto's broad German patent claim in 1886 on the grounds that Beau de Rochas had theoretically described the four-stroke cycle in 1862, even though Beau de Rochas never built a working machine.",
        resolution:
          "While Otto lost his broad monopoly in Germany, his US Patent 194,047 and British patents remained completely valid. The opening of the German market catalyzed a dramatic explosion of German automotive innovation by Gottlieb Daimler, Wilhelm Maybach, and Karl Benz (all former engineers at Otto's Deutz factory!).",
        legalOutcome:
          "Established the legal precedent distinguishing purely theoretical descriptions from operative, functioning physical reductions to practice.",
      },
    ],
    civilizationalImpact:
      "The Otto engine transformed human civilization. Gasmotoren-Fabrik Deutz sold over 30,000 engines across the world. Otto's former technical director, Gottlieb Daimler, and chief engineer, Wilhelm Maybach, adapted the Otto four-stroke cycle into lightweight high-speed gasoline engines for automobiles, motorcycles, and zeppelins.",
    funFact:
      "Nikolaus Otto was a traveling grocery salesman in Cologne who taught himself thermodynamics after reading about Lenoir's early gas engine in a newspaper. Together with industrialist Eugen Langen, Otto founded Gasmotoren-Fabrik Deutz in 1872—the world's very first internal combustion engine company, which exists today as the engine manufacturer DEUTZ AG!",
    aftermath:
      "Otto was awarded an honorary doctorate by the University of Würzburg in 1882. He died in Cologne in 1891 at age 58. The Society of German Engineers (VDI) officially named the four-stroke internal combustion cycle the 'Otto-Motor' in his honor.",
  },
  tags: [
    "Nikolaus Otto",
    "Internal Combustion Engine",
    "Otto Cycle",
    "Thermodynamics",
    "Four-Stroke",
    "Automobile Foundation",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 1,
    patentWarYears: "1877–1886",
    impactScore: 100,
  },
};
