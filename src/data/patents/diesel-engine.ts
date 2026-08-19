import {
  dieselEngineArchivalEdition,
  dieselManualClaimText,
} from "@/data/editions/dieselEngineEdition";
import type { Patent } from "@/types/patent";

// Retained research material for a later-engine interpretation. It is
// deliberately non-exported: US 542,846 must not present later Diesel-cycle
// dimensions, rates, materials, efficiency, or history as statements of the
// 1895 grant while its full source edition is under independent repair.
const _legacyUnpublishedDieselEnginePatent: Patent = {
  id: "us-542846-diesel-engine",
  patentNumber: "US 542,846",
  title: "Method of and Apparatus for Converting Heat into Work",
  shortTitle: "Diesel Controlled-Combustion Heat Motor",
  subtitle:
    "Adiabatic Compression Self-Ignition, Constant-Pressure Expansion, and Extreme Thermal Efficiency",
  inventors: ["Rudolf Diesel"],
  inventorLocation: "Berlin, Germany",
  grantDate: "1895-07-16",
  filingDate: "1892-08-26",
  era: "Gilded Age & Grid (1870–1900)",
  category: "materials",
  categoryLabel: "High-Pressure Thermodynamics",
  summary:
    "US 542,846 claims a process and machines for converting fuel heat into work: mechanically compress air before combustion, then admit fuel gradually while the working gases expand. Diesel describes solid, liquid, and gaseous fuels, single- and double-acting engines, air reservoirs, and a governed cut-off rather than a spark-ignition engine.",
  heroQuote:
    "The method forming my present invention differs from all those previously described, and is illustrated by the theoretical diagram shown in Fig. 2.",
  originalPdfUrl: "/patents/pdfs/us-542846-diesel-engine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US542846A/en",
  usptoClassification: "F02B 1/12 (internal-combustion engines using compression ignition)",
  originalTextAsset: {
    url: "/patents/transcripts/us-542846-diesel-engine-reviewed.txt",
    pageCount: 10,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: dieselEngineArchivalEdition.sourcePdfSha256,
  },
  archivalEdition: dieselEngineArchivalEdition,
  originalText: `UNITED STATES PATENT OFFICE.\nRUDOLF DIESEL, OF BERLIN, GERMANY.\n\nMETHOD OF AND APPARATUS FOR CONVERTING HEAT INTO WORK.\n\nSPECIFICATION forming part of Letters Patent No. 542,846, dated July 16, 1895. Application filed August 26, 1892, serial No. 444,246.\n\nMy invention has reference to improvements in the methods of and apparatus for converting heat into work. The method forming my present invention differs from all those previously described: pure atmospheric air is compressed before ignition or combustion, then finely-divided fuel is gradually introduced while the gases expand.`,
  plainEnglishExplanation: {
    overview:
      "The patent's stated departure is a controlled-combustion process: compress air before fuel is admitted, introduce the fuel gradually during expansion, and stop admission at cut-off before further expansion. This source face does not treat the 1895 specification as a description of a later production diesel engine.",
    coreMechanism:
      "Diesel describes air compressed before combustion to the required subsequent-combustion temperature, then fuel introduced gradually while the gases expand. His Figure 2 gives illustrative initial pressures for stated temperatures; the patent's legal process is controlled admission and expansion, not a fixed pressure, ratio, injector geometry, or efficiency figure.",
    mechanicalBreakdown: [
      {
        title: "Extreme High-Pressure Compression Cylinder",
        summary: "A single-acting cylinder and plunger for the coal-fuel example.",
        technicalDetails:
          "The source names cylinder C, high-pressure plunger P, connecting-rod b, crank c, shaft d, and plunger guides a. It does not give a bore, stroke, alloy, wall thickness, or stress rating for this construction.",
        archaicTerm: "Working-cylinder with high-compression piston",
        modernEquivalent: "High-compression heavy-duty cylinder block",
      },
      {
        title: "Air-Blast High-Pressure Fuel Injection Nozzle",
        summary: "A nozzle and needle that gradually admit liquid fuel in the liquid-fuel form.",
        technicalDetails:
          "The source says a feed-pump maintains liquid fuel in the nozzle above cylinder-compression pressure and that the distributing gear opens needle n near the highest compression. It supplies no blast-air pressure, droplet diameter, or time value.",
        archaicTerm: "Compressed-air fuel-injecting valve and nozzle",
        modernEquivalent: "High-pressure fuel injection valve / Common-rail injector",
      },
      {
        title: "Progressive Cam-Governed Injection Cutoff",
        summary: "Mechanical governor regulating fuel cutoff ratio under varying load.",
        technicalDetails:
          "The source attributes fuel regulation to governor E and describes an adjustable piece moved by rod St that changes the period of fuel admission. It specifies neither a modern cut-off ratio nor a fixed pressure-control target.",
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
        summary: "Preparatory air compression and a reservoir in the two-cylinder arrangement.",
        technicalDetails:
          "The two-cylinder form uses the lower part of central cylinder B as an air pump and reservoir L for preparatory compression and starting. The source gives no pump diameter, receiver volume, construction material, or pressure rating.",
        archaicTerm: "Air-compressing pump driven by the engine",
        modernEquivalent: "Auxiliary multi-stage blast injection compressor / Common rail pump",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Adiabatic Compression Heating Law",
        formula:
          "T_2 = T_1 \\cdot \\left(\\frac{V_1}{V_2}\\right)^{\\gamma - 1} = T_1 \\cdot r^{\\gamma - 1}",
        explanation:
          "The specification's operative point is qualitative and conditional: compress air to the temperature at which the subsequently admitted fuel will ignite ($T_2 > T_{\\text{autoignition}}$). Compressing air ($\\gamma \\approx 1.4$) at $r = 14\\text{ to }22$ raises ambient intake air ($300\\text{ K}$) to over $850\\text{ K}$ ($580^\\circ\\text{C}$), well exceeding the self-ignition threshold without spark plugs.",
      },
      {
        principle: "Diesel Cycle Ideal Thermal Efficiency",
        formula:
          "\\eta_{\\text{th}} = 1 - \\frac{1}{r^{\\gamma - 1}} \\left[ \\frac{r_c^\\gamma - 1}{\\gamma(r_c - 1)} \\right]",
        explanation:
          "The patent contrasts a controlled heat-and-expansion path with an uncontrolled explosive rise. The air-standard efficiency depends on the compression ratio $r$ and cut-off ratio $r_c = V_3 / V_2$, showing that earlier fuel shut-off maximizes thermodynamic work recovery.",
      },
      {
        principle: "Fuel Droplet Atomization & Sauter Mean Diameter",
        formula:
          "D_{32} = \\frac{\\sum d_i^3}{\\sum d_i^2} \\propto \\frac{\\sigma_{\\text{fuel}}^{0.5} \\mu_{\\text{fuel}}^{0.2}}{\\rho_{\\text{air}}^{0.2} \\Delta P_{\\text{inj}}^{0.4}}",
        explanation:
          "The source describes a liquid jet and nozzle with a needle valve opened by distributing gear for gradual admission. High-pressure blast air injection shears the fuel stream into fine micro-droplets ($D_{32} \\approx 10 - 50\\text{ }\\mu\\text{m}$), maximizing reactive surface area.",
      },
      {
        principle: "Carnot Thermodynamic Theoretical Upper Bound",
        formula: "\\eta_{\\text{Carnot}} = 1 - \\frac{T_{\\text{cold}}}{T_{\\text{hot}}}",
        explanation:
          "Rudolf Diesel originally sought to realize the isothermal combustion of the Carnot cycle by extreme pre-compression ($T_{\\text{hot}} > 1000\\text{ K}$), establishing the theoretical upper bound for all heat engines.",
      },
      {
        principle: "Droplet Evaporation & D-Squared Combustion Law",
        formula: "d^2(t) = d_0^2 - K t, \\quad K = \\frac{8 k_g}{\\rho_l c_{p,g}} \\ln(1 + B)",
        explanation:
          "The patent requires gradual fuel admission into compressed air while the gases expand. Under Spalding's $d^2$-law of droplet combustion, the surface area decreases linearly over time, ensuring progressive isobaric heat release.",
      },
    ],
    whyItMattersToday:
      "The patent is an early source for compression-before-admission and cut-off-controlled combustion. Its connection to later engines should be described with separately cited historical and technical evidence rather than unsupported global market or efficiency figures.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: dieselManualClaimText(1),
      plainEnglish:
        "Claim 1 is a process claim. It requires compression of air, or air diluted with neutral gas or vapor, until its temperature exceeds the proposed fuel's ignition point. Fuel must then enter gradually during expansion against enough load to avoid an essential pressure or temperature rise; admission ends and the gases continue to expand without heat transfer.",
      keyInnovations: [
        "Pure air high-pressure compression",
        "Compression-ignition without spark plugs",
        "Gradual constant-pressure combustion",
      ],
      legalSignificance:
        "This is the grant's broad process claim, bounded by staged admission and controlled expansion rather than an assertion about every later diesel engine.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: dieselManualClaimText(2),
      plainEnglish:
        "Claim 2 is a separate apparatus combination. It calls for a cylinder and piston, a valved air or neutral-gas inlet, a fuel feed that discharges fuel gradually, and valve gear that opens that feed at the working stroke's beginning and closes it at a predetermined portion of that stroke.",
      keyInnovations: [
        "Valved suction inlet",
        "Gradual fuel feed",
        "Working-stroke cut-off valve gear",
      ],
      legalSignificance:
        "The claim secures the timed, gradual-feed valve arrangement described in the specification, not the later common-rail system attributed to the legacy record.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: dieselManualClaimText(3),
      plainEnglish:
        "Claim 3 is another apparatus claim. It combines a combustion cylinder with gradual admission up to cut-off, an air compressor, a reservoir connected both to compressor and cylinder, and an expansion chamber for exhaust gas. Each named vessel has a distinct thermodynamic job in the described arrangement.",
      keyInnovations: ["Air compressor", "Compressed-air reservoir", "Exhaust expansion chamber"],
      legalSignificance:
        "The claim is limited to the specified compressor, reservoir, cylinder, cut-off, and exhaust-expansion combination.",
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
          "This record makes no court or later-performance claim without a separately reviewed historical source; the 1895 facsimile itself supplies no litigation finding.",
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
    independentClaims: 3,
  },
};

/**
 * Source-bounded catalog record for the 1895 grant. The ten-page manuscript
 * and its current ledger failed independent facsimile acceptance, so do not
 * attach an `archivalEdition` or `originalTextAsset` until a fresh literal
 * transcription, figures, and paragraph companions pass review.
 */
export const dieselEnginePatent: Patent = {
  id: "us-542846-diesel-engine",
  patentNumber: "US 542,846",
  title: "Method of and Apparatus for Converting Heat into Work",
  shortTitle: "Controlled-Combustion Heat-Engine Process",
  subtitle: "Compression before gradual fuel admission and continued expansion",
  inventors: ["Rudolf Diesel"],
  inventorLocation: "Berlin, Germany",
  grantDate: "1895-07-16",
  filingDate: "1892-08-26",
  era: "Gilded Age & Grid (1870–1900)",
  category: "materials",
  categoryLabel: "Heat-Engine Process & Apparatus",
  summary:
    "US 542,846 claims a process and apparatus for converting fuel heat into work. Its first claim compresses air, or air mixed with neutral gas or vapor, to a temperature above the fuel's ignition point; fuel is then introduced gradually during expansion, admission stops, and expansion continues without heat transfer. The grant also claims timed gradual fuel feed and a compressor-reservoir-expansion-chamber arrangement.",
  heroQuote:
    "The herein described process for converting the heat energy of fuel into work, consisting in first compressing air, or a mixture of air and neutral gas or vapor, to a degree producing a temperature above the igniting point of the fuel to be consumed, then gradually introducing the fuel for combustion into the compressed air while expanding.",
  originalPdfUrl: "/patents/pdfs/us-542846-diesel-engine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US542846A/en",
  usptoClassification: "Heat-engine process and apparatus; source classification review pending",
  originalText: `UNITED STATES PATENT OFFICE.
RUDOLF DIESEL, OF BERLIN, GERMANY.

METHOD OF AND APPARATUS FOR CONVERTING HEAT INTO WORK.

SPECIFICATION forming part of Letters Patent No. 542,846, dated July 16, 1895.
Application filed August 26, 1892, serial No. 444,246. (No model.)

To all whom it may concern:
Be it known that I, RUDOLF DIESEL, a subject of the King of Bavaria, residing at Berlin, in the Kingdom of Prussia, German Empire, have invented a new and useful Process for Obtaining Motive Power by the Combustion of Fuel of Any Kind, of which the following is a specification.

My invention has reference to improvements in the methods of and apparatus for converting heat into work.

[Curated source excerpt only. The complete ten-page manual source face remains withheld until its literal ledger, figures, annotations, and paragraph companions pass independent facsimile acceptance.]`,
  plainEnglishExplanation: {
    overview:
      "The grant addresses how a heat engine should add fuel after air has first been compressed. Its legal process is not a description of a later standard diesel engine: it specifies a sequence of compression, gradual fuel admission during expansion, cut-off, and further expansion.",
    coreMechanism:
      "Claim 1 begins by compressing air, or air mixed with neutral gas or vapor, until the resulting temperature exceeds the proposed fuel's ignition point. Fuel then enters gradually as the gases expand against a resistance chosen to avoid an essential rise of temperature and pressure. Admission ends, and the gases expand further without heat transfer. Claims 2 and 3 add respectively timed feed-valve gear and a particular compressor, reservoir, and expansion-chamber combination. The source does not provide a modern engine's fixed compression ratio, injection pressure, geometry, shaft speed, efficiency, material specification, or performance curve.",
    mechanicalBreakdown: [
      {
        title: "Compression Before Fuel Admission",
        summary:
          "The process claim calls for air, or air mixed with neutral gas or vapor, to be compressed before fuel is gradually introduced.",
        technicalDetails:
          "The required condition is qualitative and fuel-specific: compression must produce a temperature above the ignition point of the fuel to be consumed. The grant does not state one universal compression ratio, cylinder dimension, or pressure value.",
        archaicTerm: "neutral gas or vapor",
        modernEquivalent: "a non-fuel gas or vapor present with the compressed air",
      },
      {
        title: "Timed Gradual Fuel Feed",
        summary:
          "Claim 2 combines a cylinder and piston with a valved air inlet, a gradual fuel feed, and operating means that open and close the feed during the working stroke.",
        technicalDetails:
          "The claim requires feed-valve timing, not a stated nozzle geometry, droplet size, air-blast pressure, rail pressure, or electronically controlled injector. Its legal limit is the gradual admission and cut-off arrangement described in the grant.",
        archaicTerm: "valved fuel feed",
        modernEquivalent: "timed fuel-admission valve",
      },
      {
        title: "Compressor, Reservoir, and Expansion Chamber",
        summary:
          "Claim 3 names a combustion cylinder with cut-off, an air compressor, a reservoir connected to both compressor and cylinder, and an exhaust-gas expansion chamber.",
        technicalDetails:
          "These are a claimed apparatus combination. The document does not provide a receiver volume, compressor size, exhaust-flow rate, construction material, or power output for the arrangement.",
        archaicTerm: "reservoir",
        modernEquivalent: "compressed-gas storage vessel",
      },
    ],
    scientificPrinciples: [],
    whyItMattersToday:
      "The grant is a primary source for a particular controlled-combustion process and several apparatus combinations. Broader claims about later diesel-engine hardware, performance, industry, or historical disputes require separate cited research and are not presented here as facts established by US 542,846.",
  },
  claims: _legacyUnpublishedDieselEnginePatent.claims,
  drawings: [],
  historicalContext: {
    problemStatement:
      "The specification contrasts its controlled fuel-admission process with engine cycles in which combustion after ignition is left to itself, producing a marked increase of pressure and temperature.",
    priorArtLimitations: [
      "The specification says earlier combustion was left uncontrolled after ignition.",
      "It identifies high combustion temperature and hot exhaust as disadvantages of the earlier described cycle.",
    ],
    breakthroughInsight:
      "The claimed sequence separates prior compression from gradual fuel admission during expansion, then requires cut-off and further expansion without heat transfer.",
    patentWars: [],
    civilizationalImpact:
      "US 542,846 records a late-nineteenth-century heat-engine process and three claims. The source facsimile alone does not establish later performance figures, manufacturing details, market adoption, or litigation history.",
    aftermath:
      "The grant issued on July 16, 1895. Its full ten-page source edition remains withheld while the literal transcription, figure references, and non-lossy companion readings are repaired and independently reviewed.",
    sideNotes: [
      "The pinned facsimile contains theoretical cycle diagrams in Figs. 1 through 3 and apparatus drawings in Figs. 4 through 10.",
      "Claim 1 is a process claim; Claims 2 and 3 are apparatus-combination claims.",
    ],
  },
  tags: ["Rudolf Diesel", "Heat engines", "Combustion", "Patent source review"],
  stats: {
    totalClaims: 3,
    independentClaims: 3,
  },
};
