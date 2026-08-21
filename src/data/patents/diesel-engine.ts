import {
  dieselEngineArchivalEdition,
  dieselManualClaimText,
} from "@/data/editions/dieselEngineEdition";
import type { Patent } from "@/types/patent";


// Retained research material for a later-engine interpretation. It is
// deliberately non-exported: US 542,846 must not present later Diesel-cycle
// dimensions, rates, materials, efficiency, or history as statements of the
// 1895 grant while its full source edition is under independent repair.
export const dieselEnginePatent: Patent = {
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
  historicalContext: {
    problemStatement:
      "19th-century steam and spark-ignition gas engines operated with thermal efficiencies under 15%, wasting over 85% of fuel heat to ambient cooling jackets and exhaust.",
    priorArtLimitations: [
      "Steam engines required massive boilers and had low thermal efficiency (5-10%)",
      "Otto gas engines suffered pre-ignition knock limiting compression ratio to ~4:1",
      "High fuel consumption and reliance on volatile gasoline fuels",
    ],
    breakthroughInsight:
      "Rudolf Diesel recognized that compressing pure atmospheric air past the auto-ignition threshold allowed the use of heavy crude oils without spark plugs, achieving unprecedented thermodynamic efficiency.",
    patentWars: [
      {
        rivalName: "Herbert Akroyd Stuart / Hornsby-Akroyd Oil Engine",
        rivalClaim: "Hot-bulb vaporizing compression oil engine (British Patent 7,146 / 1890)",
        conflictDetails:
          "Akroyd Stuart developed a low-compression engine with an uncooled vaporizer bulb; Diesel developed a high-pressure pure compression-ignition cycle.",
        resolution:
          "Diesel was recognized globally for establishing high-pressure compression ignition and variable cut-off combustion.",
        legalOutcome:
          "Diesel secured worldwide patent rights, licensing manufacturing to MAN, Sulzer, and American industrialists.",
      },
    ],
    civilizationalImpact:
      "The Diesel engine revolutionized global shipping, railway transport, heavy industry, and electric power generation, becoming the dominant prime mover of modern commerce.",
  },
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Pressure-Volume Thermodynamic Indicator Diagram",
      caption: "Theoretical P-V indicator diagram showing adiabatic compression and constant-pressure expansion.",
      svgType: "diesel",
      callouts: [
        {
          id: "de-diagram",
          figureRef: "Fig. 1",
          label: "1",
          element: "Thermodynamic Indicator Loop",
          description: "Theoretical indicator curve showing high-pressure compression ignition.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Vertical Section of Diesel Engine Cylinder",
      caption: "Vertical sectional view through cylinder, piston, and valved cylinder head.",
      svgType: "diesel",
      callouts: [
        {
          id: "de-cylinder",
          figureRef: "Fig. 2",
          label: "C",
          element: "Combustion Cylinder",
          description: "Heavy cast working cylinder withstanding peak compression pressures.",
          x: 50,
          y: 40,
        },
        {
          id: "de-piston",
          figureRef: "Fig. 2",
          label: "P",
          element: "Compression Piston",
          description: "Long trunk piston compressing atmospheric air into clearance space.",
          x: 50,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Fuel Injection Nozzle & Atomizer",
      caption: "Sectional detail of fuel nozzle with needle valve and compressed-air atomizing port.",
      svgType: "diesel",
      callouts: [
        {
          id: "de-nozzle",
          figureRef: "Fig. 3",
          label: "D",
          element: "Fuel Injection Nozzle",
          description: "High-pressure nozzle atomizing fuel into incandescent compressed air.",
          x: 50,
          y: 50,
        },
      ],
    },
  ],
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: dieselManualClaimText(1),
      plainEnglish:
        "A thermodynamic process for converting fuel energy directly into mechanical work by first compressing pure atmospheric air past the spontaneous ignition temperature of the fuel, gradually injecting the fuel during the power stroke to maintain controlled isobaric expansion without excessive pressure spikes, and then expanding the burning gases to ambient exhaust.",
      keyInnovations: [
        "Compression ignition process",
        "High-pressure adiabatic compression",
        "Controlled isobaric combustion",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: dieselManualClaimText(2),
      plainEnglish:
        "An internal combustion engine apparatus comprising a working cylinder and piston, a valved air intake, and a variable-timed fuel feed mechanism operatively linked to the engine drive shaft to open at top dead center and cut off fuel delivery at a predetermined fraction of the stroke.",
      keyInnovations: [
        "Compression ignition apparatus",
        "High-pressure injector nozzle",
        "Regulated cut-off valve",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: dieselManualClaimText(3),
      plainEnglish:
        "A compound internal combustion engine system combining a main combustion cylinder with cut-off control, an independent auxiliary air compressor, an intermediate high-pressure storage reservoir, and an expansion cylinder to extract residual enthalpy from the exhaust gases.",
      keyInnovations: [
        "Multi-stage compound expansion",
        "Independent air charging pump",
        "Exhaust expansion recovery",
      ],
    },
  ],
  tags: ["Internal Combustion", "Thermodynamics", "Compression Ignition", "Heavy Machinery"],
  stats: {
    totalClaims: 3,
    independentClaims: 3,
  },
};
