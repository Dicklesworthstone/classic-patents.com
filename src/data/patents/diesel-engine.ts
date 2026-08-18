import type { Patent } from "@/types/patent";

export const dieselEnginePatent: Patent = {
  id: "us-542846-diesel-engine",
  patentNumber: "US 542,846",
  title: "Internal-Combustion Engine",
  shortTitle: "Diesel High-Compression Ignition Engine",
  subtitle:
    "Adiabatic Compression Self-Ignition, Constant-Pressure Expansion, and Extreme Thermal Efficiency",
  inventors: ["Rudolf Diesel"],
  inventorLocation: "Berlin, Germany",
  grantDate: "1895-07-16",
  filingDate: "1895-03-14",
  era: "Gilded Age & Grid (1870–1900)",
  category: "materials",
  categoryLabel: "High-Pressure Thermodynamics",
  summary:
    "Shattering all existing thermodynamic thermal efficiency records: on July 16, 1895, German engineer Rudolf Diesel received US Patent No. 542,846 for the compression-ignition internal combustion engine. Before Diesel, steam engines wasted over 88% of fuel energy (thermal efficiency $\\eta \\approx 10\\text{--}12\\%$) and Otto gasoline engines were limited to low compression ratios ($r \\approx 4:1$) to avoid violent premature spark knocking. Diesel compressed ambient air to extreme pressure (>35 bar, $r = 18:1$), heating the air adiabatically to over $650^\\circ\\text{C}$ ($T_2 = T_1 r^{\\gamma-1}$) well above fuel auto-ignition temperature. Liquid fuel injected under high-pressure blast air ignited instantly upon entry, burning at near-constant pressure without spark plugs and achieving unprecedented thermal efficiencies exceeding 40%.",
  heroQuote:
    "Be it known that I, Rudolf Diesel, of Berlin, Germany, have invented certain new and useful Improvements in Internal-Combustion Engines, of which the following is a specification...",
  originalPdfUrl: "/patents/pdfs/us-542846-diesel-engine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US542846A/en",
  usptoClassification: "F02B 1/12 (Compression-ignition engines / High-pressure injection)",
  originalTextAsset: {
    url: "/patents/transcripts/us-542846-diesel-engine.txt",
    pageCount: 10,
    kind: "reviewed-transcription",
  },
  originalText: `UNITED STATES PATENT OFFICE.
RUDOLF DIESEL, OF BERLIN, GERMANY.

INTERNAL-COMBUSTION ENGINE.

SPECIFICATION forming part of Letters Patent No. 542,846, dated July 16, 1895.
Application filed March 14, 1895. Serial No. 541,757. (No model.) Patented in Germany February 28, 1892, No. 67,207.

To all whom it may concern:
Be it known that I, RUDOLF DIESEL, a subject of the King of Bavaria, residing at Berlin, in the Kingdom of Prussia, German Empire, have invented certain new and useful Improvements in Internal-Combustion Engines; and I do hereby declare that the following is a full, clear, and exact description of the invention.

The object of my invention is to increase the thermal efficiency of internal-combustion engines and approach more closely than has hitherto been possible the theoretical maximum efficiency of the Carnot cycle.

In existing internal-combustion engines, a mixture of combustible gas or vapor and air is compressed within the cylinder and then ignited by a spark, flame, or hot tube, causing an instantaneous explosion with a sudden, violent rise in temperature and pressure. In such engines, the compression is strictly limited to prevent premature ignition or knocking, and large quantities of heat are lost to the water-cooled cylinder walls.

According to my present invention:
First, pure air is drawn into the working cylinder and compressed by the working piston to a degree far exceeding that used in ordinary engines—namely, to a pressure of from thirty to ninety atmospheres—whereby the temperature of the air is raised by the work of compression alone to a degree far above the ignition point of the fuel to be used.
Second, into this highly compressed and red-hot air, finely divided liquid or pulverized solid fuel is gradually injected during a portion of the forward stroke of the piston, so that the fuel burns instantly and progressively upon its entry into the cylinder without an explosive rise in pressure.
Third, the rate of fuel injection is so regulated in proportion to the piston displacement that the combustion takes place at substantially constant pressure or constant temperature.
Fourth, after fuel injection ceases, the hot gases expand further down to near atmospheric pressure, converting their heat energy into useful mechanical work before being exhausted.`,
  plainEnglishExplanation: {
    overview:
      "While studying thermodynamics under Carl von Linde at the Munich Polytechnic, Rudolf Diesel learned that the most efficient steam engines converted barely 10% of heat energy into work, wasting 90% up the smokestack. Inspired by Nicolas Léonard Sadi Carnot's 1824 treatise on maximum theoretical heat engine efficiency, Diesel spent fifteen years developing an engine that compressed pure air so intensely that the air itself ignited the fuel, doubling thermodynamic efficiency and creating the most fuel-efficient internal combustion engine in human history.",
    coreMechanism:
      "On the intake stroke, the heavy cast-steel cylinder draws in pure ambient air at $P_1 = 1\\text{ bar}, T_1 = 300\\text{ K}$. On the upward compression stroke, the piston forces the air into a tight combustion bowl at an extreme compression ratio ($r = V_1 / V_2 = 18:1$). By adiabatic gas compression ($T_2 = T_1 r^{\\gamma-1}, \\gamma = 1.4$), the air pressure surges to $P_2 \\approx 40\\text{ bar}$ ($580\\text{ psi}$) and temperature reaches $T_2 \\approx 953\\text{ K}$ ($680^\\circ\\text{C}$), glowing red-hot. At top dead center, an air-blast injector pumps liquid heavy petroleum/peanut oil atomized under $P_{\\text{blast}} = 65\\text{ bar}$ through a multi-hole nozzle. Because the air temperature exceeds the fuel auto-ignition threshold ($T_{\\text{auto}} \\approx 210^\\circ\\text{C}$), the droplets ignite spontaneously as they enter. The fuel burns progressively over $10\\%\\text{ to } 15\\%$ of the expansion stroke, sustaining a nearly constant combustion pressure ($P \\approx 45\\text{ bar}$) while the piston descends. The burning gases then expand adiabatically down to $P_4 \\approx 2.5\\text{ bar}$, delivering maximum mechanical torque to the crankshaft with a thermal brake efficiency exceeding $42\\%$.",
    mechanicalBreakdown: [
      {
        title: "Extreme High-Pressure Compression Cylinder",
        summary: "Heavy-walled cast-iron cylinder achieving 40 bar compression ratio.",
        technicalDetails:
          "Machined from high-tensile alloy cast iron with a $250\\text{ mm}$ bore and $400\\text{ mm}$ stroke. Designed to withstand peak internal hoop stresses exceeding $\\sigma_{\\text{hoop}} = \\frac{P_{\\text{peak}} r}{t} \\approx 120\\text{ MPa}$.",
        archaicTerm: "Working-cylinder with high-compression piston",
        modernEquivalent: "High-compression heavy-duty cylinder block",
      },
      {
        title: "Air-Blast High-Pressure Fuel Injection Nozzle",
        summary: "Compressed-air atomizer injecting liquid fuel against 40 bar cylinder pressure.",
        technicalDetails:
          "An auxiliary multi-stage compressor provides air at $P_{\\text{blast}} = 65\\text{ to } 80\\text{ bar}$. A cam-actuated needle valve atomizes fuel into micro-droplets ($d_{32} < 25\\,\\mu\\text{m}$) to ensure rapid, complete combustion within $12\\text{ milliseconds}$.",
        archaicTerm: "Compressed-air fuel-injecting valve and nozzle",
        modernEquivalent: "High-pressure fuel injection valve / Common-rail injector",
      },
      {
        title: "Progressive Cam-Governed Injection Cutoff",
        summary: "Mechanical governor regulating fuel cutoff ratio under varying load.",
        technicalDetails:
          "A flyball centrifugal governor varies the duration of the fuel needle valve opening (cutoff ratio $r_c = V_3 / V_2$ from $1.2$ at idle to $2.2$ at full load), maintaining constant maximum cycle pressure across load variations.",
        archaicTerm: "Regulating valve-gear and centrifugal governor",
        modernEquivalent: "Variable fuel injection metering governor",
      },
      {
        title: "Scavenging & Exhaust Valve Train",
        summary: "Overhead poppet valves expelling combustion gases with full expansion.",
        technicalDetails:
          "Dual overhead poppet valves with heavy valve springs and rocker arms driven by a half-speed camshaft, providing complete cylinder scavenging and clean air intake without residual exhaust mixing.",
        archaicTerm: "Air-admission and exhaust puppet-valves",
        modernEquivalent: "Overhead camshaft poppet valvetrain",
      },
      {
        title: "Multi-Stage Auxiliary Blast Air Compressor",
        summary: "Crankshaft-driven two-stage reciprocating pump generating 80 bar injection air.",
        technicalDetails:
          "A two-stage reciprocating air pump with interstage cooling water jackets ($D_1 = 80\\text{ mm}, D_2 = 35\\text{ mm}$). Powered by an eccentric link from the main connecting rod, it supplies dry compressed air to an external forged steel receiver flask ($V = 30\\text{ L}, P = 80\\text{ bar}$) for blast-air fuel injection and cold pneumatic starting.",
        archaicTerm: "Air-compressing pump driven by the engine",
        modernEquivalent: "Auxiliary multi-stage blast injection compressor / Common rail pump",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Adiabatic Compression Heating Law",
        formula:
          "T_2 = T_1 \\cdot r^{\\gamma - 1} = 300\\text{ K} \\cdot (18)^{0.40} \\approx 953.3\\text{ K} \\implies 680.2^\\circ\\text{C}",
        explanation:
          "Compressing gas without heat loss elevates its temperature according to the isentropic relation. At $r = 18$, the cylinder temperature easily exceeds the $210^\\circ\\text{C}$ auto-ignition temperature of heavy hydrocarbons, guaranteeing reliable self-ignition without electrical ignition systems.",
      },
      {
        principle: "Diesel Cycle Ideal Thermal Efficiency",
        formula:
          "\\eta_{\\text{Diesel}} = 1 - \\frac{1}{r^{\\gamma - 1}} \\left[\\frac{r_c^\\gamma - 1}{\\gamma (r_c - 1)}\\right], \\quad \\eta_{\\text{Diesel}} \\approx 1 - \\frac{1}{(18)^{0.4}} \\left[\\frac{1.6^{1.4} - 1}{1.4 (1.6 - 1)}\\right] \\approx 62.8\\% \\text{ (ideal)}, \\quad 42\\% \\text{ (brake)}",
        explanation:
          "The Diesel cycle achieves the highest thermal efficiency of any practical internal combustion cycle by combining extreme compression ratio $r$ with constant-pressure heat addition ($r_c = V_3 / V_2$).",
      },
      {
        principle: "Fuel Droplet Atomization & Sauter Mean Diameter",
        formula:
          "d_{32} \\propto \\left(\\frac{\\sigma_{\\text{fuel}}}{\\rho_{\\text{gas}} v_{\\text{rel}}^2}\\right)^{0.5} \\cdot \\left(\\frac{\\mu_{\\text{fuel}}}{\\sqrt{\\sigma_{\\text{fuel}} \\rho_{\\text{fuel}} D_{\\text{orifice}}}}\\right)^{0.1}",
        explanation:
          "High blast-air velocity through the injection orifice creates intense aerodynamic shear, shattering viscous liquid fuel into a fine aerosol with enormous specific surface area ($A/V = 6 / d_{32}$), enabling rapid droplet evaporation and smokeless combustion.",
      },
      {
        principle: "Carnot Thermodynamic Theoretical Upper Bound",
        formula:
          "\\eta_{\\text{Carnot}} = 1 - \\frac{T_L}{T_H} = 1 - \\frac{300\\text{ K}}{2100\\text{ K}} \\approx 85.7\\%",
        explanation:
          "Diesel's core intellectual thesis was to approach Carnot theoretical efficiency as closely as physical materials allow by maximizing the combustion peak temperature $T_H$ through extreme pre-compression.",
      },
      {
        principle: "Droplet Evaporation & D-Squared Combustion Law",
        formula:
          "d^2(t) = d_0^2 - K t, \\quad K = \\frac{8 k_{\\text{gas}}}{\\rho_{\\text{fuel}} C_{p,\\text{gas}}} \\ln(1 + B_q)",
        explanation:
          "Micro-droplets evaporating in the $950\\text{ K}$ cylinder air undergo steady quasi-steady regression, where the burning rate constant $K$ governs the transition from diffusive evaporation to turbulent deflagration.",
      },
    ],
    whyItMattersToday:
      "Rudolf Diesel's engine powers modern global trade and industrial civilization. Today, diesel engines propel over 90% of global maritime freight shipping, long-haul freight rail, heavy highway trucking, agricultural tractors, mining machinery, and emergency hospital backup power grids. Modern common-rail direct-injection diesel engines achieve brake thermal efficiencies approaching 50%, remaining the most fuel-efficient internal combustion powertrains ever built.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The method of operating internal-combustion engines, which consists in compressing pure air in the cylinder by the working piston to a pressure and temperature above the ignition-point of the fuel to be used, then injecting fuel gradually into said compressed and heated air, whereby the fuel ignites and burns spontaneously upon entry without explosive rise of pressure, and then allowing the resulting gases to expand against the piston, substantially as described.",
      plainEnglish:
        "The historic master process claim of the diesel engine: compressing air to a temperature above the fuel's auto-ignition point, then gradually injecting fuel to self-ignite and burn at constant pressure without spark plugs.",
      keyInnovations: [
        "Pure air high-pressure compression",
        "Compression-ignition without spark plugs",
        "Gradual constant-pressure combustion",
      ],
      legalSignificance:
        "The master patent claim covering all compression-ignition internal combustion engines worldwide, upheld across international patent courts.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In an internal-combustion engine, the combination, with a working cylinder and piston adapted to compress air to a pressure of thirty atmospheres or more, of a fuel-injection nozzle communicating with the cylinder, and an air-pump delivering air under a pressure higher than the cylinder compression to inject fuel into the heated air in the cylinder.",
      plainEnglish:
        "The air-blast fuel injection apparatus claim: combining a high-compression cylinder (30+ bar) with a high-pressure air pump that blasts fuel into the red-hot compressed air.",
      keyInnovations: [
        "Blast-air fuel atomization",
        "Over-pressure fuel injection",
        "High-density combustion chamber delivery",
      ],
      legalSignificance:
        "Protected the high-pressure fuel injection delivery system that made early diesel engines functional before the development of modern hydraulic pumps.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In an internal-combustion engine, the combination, with the fuel-injection valve, of a governor adapted to vary the duration of fuel injection according to the load on the engine, whereby combustion is maintained at substantially constant pressure regardless of load.",
      plainEnglish:
        "The governor-controlled fuel cutoff claim: a governor that adjusts the duration of fuel injection to maintain constant combustion pressure across varying engine loads.",
      keyInnovations: [
        "Variable fuel cutoff timing",
        "Load-governed constant-pressure expansion",
        "High part-load thermal efficiency",
      ],
      legalSignificance:
        "Protected variable-load engine governing in compression-ignition machinery.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Diesel High-Compression Engine Section & P-V Diagram",
      caption:
        "Vertical cross-section of Rudolf Diesel's compression-ignition engine showing the high-compression piston, air-blast fuel injector, camshaft valvetrain, and characteristic constant-pressure P-V indicator diagram.",
      svgType: "diesel-engine",
      callouts: [
        {
          id: "de-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "High-Compression Working Cylinder",
          description:
            "Heavy cast-iron cylinder compressing air to 40 bar at 18:1 compression ratio.",
          x: 48,
          y: 45,
        },
        {
          id: "de-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Air-Blast Fuel Injector Nozzle",
          description:
            "Nozzle injecting atomized oil under 65 bar air blast to self-ignite at 680°C.",
          x: 48,
          y: 28,
        },
        {
          id: "de-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Auxiliary High-Pressure Air Pump",
          description: "Multi-stage compressor generating blast air for fuel atomization.",
          x: 75,
          y: 55,
        },
        {
          id: "de-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Heavy Forged Steel Crankshaft",
          description: "High-rigidity crankshaft absorbing 45 bar peak combustion cylinder loads.",
          x: 48,
          y: 78,
        },
        {
          id: "de-5",
          figureRef: "Fig. 1",
          label: "E",
          element: "Centrifugal Fuel Cutoff Governor",
          description: "Flyball governor regulating injection duration to control engine load.",
          x: 25,
          y: 62,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1880s, the industrial world ran on coal-fired steam engines that consumed vast trainloads of fuel while converting less than 10% of heat into useful work. Steam engines required huge boilers that frequently exploded, killing hundreds of workers annually. Meanwhile, Nikolaus Otto's gasoline engines could not exceed a 4:1 compression ratio without destroying themselves from violent pre-ignition spark knocking. Rudolf Diesel set out to build the 'Rational Heat Motor'—an engine whose efficiency would approach the theoretical limits of thermodynamics.",
    priorArtLimitations: [
      "Steam engines had miserable thermal efficiencies (7% to 12%) and required massive water boilers.",
      "Otto spark-ignition gasoline engines knocked and exploded violently if compressed above 5 atmospheres.",
      "Gasoline was expensive and dangerous to store compared to heavy residual crude oils.",
    ],
    breakthroughInsight:
      "Diesel realized that pre-ignition knocking only occurs when fuel and air are compressed *together*. If you compress **pure air alone**, you can compress it to 40 atmospheres without any possibility of knocking. When liquid fuel is subsequently sprayed into this ultra-hot air, it ignites gently and progressively as fast as it enters, converting extreme heat directly into mechanical expansion without violent pressure spikes.",
    patentWars: [
      {
        rivalName: "Herbert Akroyd-Stuart (Hornsby-Akroyd Oil Engine)",
        rivalClaim:
          "British inventor Herbert Akroyd-Stuart patented a low-compression hot-bulb oil engine in 1890, claiming prior invention of heavy-oil internal combustion.",
        conflictDetails:
          "Akroyd-Stuart's engine used a low compression ratio (under 4:1) and relied on an uncooled external 'hot-bulb' vaporizing chamber to ignite fuel, running with low thermal efficiency (15%).",
        resolution:
          "Courts recognized that Diesel's true high-compression self-ignition ($r > 14:1$, $\\eta > 40\\%$) was a distinct and vastly superior thermodynamic breakthrough.",
        legalOutcome:
          "Diesel's patents were licensed worldwide by Krupp, Maschinenfabrik Augsburg (MAN), Sulzer Brothers, and American brewer Adolphus Busch (founding Busch-Sulzer Diesel).",
      },
    ],
    civilizationalImpact:
      "On February 17, 1894, Rudolf Diesel's prototype engine at MAN in Augsburg ran under its own power for the first time, achieving an efficiency of 26% (more than double the best steam engine in the world). By 1912, the Danish motor ship *MS Selandia* became the world's first ocean-going diesel cargo vessel, rendering coal-fired steamships obsolete. Diesel engines made modern transoceanic supply chains and global container shipping possible.",
    funFact:
      "At the 1900 Paris World's Fair, Rudolf Diesel operated his engine on **100% pure peanut oil** (the world's first biodiesel), declaring to the press: 'The engine can be fed with vegetable oils and would help considerably in the development of agriculture in the countries which use it.'",
    aftermath:
      "On the night of September 29, 1913, while crossing the English Channel aboard the steamship *SS Dresden* to attend the opening of a new diesel plant in London, 55-year-old Rudolf Diesel mysteriously vanished into the sea. His body was found by the Dutch coast guard days later, sparking decades of unresolved conspiracy theories.",
    sideNotes: [
      "During early testing in 1893, Diesel's experimental single-cylinder engine exploded under 80 atmospheres of pressure, sending steel shrapnel through the workshop and nearly blinding Diesel.",
      "The marine diesel engine built today—such as the Wärtsilä-Sulzer RTA96-C—is a 14-cylinder, two-stroke giant standing 13.5 meters high, weighing 2,300 tons, and generating 107,000 horsepower at an astonishing 50% thermal brake efficiency.",
    ],
  },
  tags: [
    "Rudolf Diesel",
    "Diesel Engine",
    "Compression Ignition",
    "Thermodynamics",
    "Carnot Cycle",
    "High Pressure",
    "MAN",
    "Maritime Propulsion",
    "Gilded Age",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1892–1912",
    impactScore: 100,
  },
};
