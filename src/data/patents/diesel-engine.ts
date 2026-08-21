import { dieselManualClaimText } from "@/data/editions/dieselEngineEdition";
import type { Patent } from "@/types/patent";

export const dieselEnginePatent: Patent = {
  id: "us-542846-diesel-engine",
  patentNumber: "US 542,846",
  title: "Method of and Apparatus for Converting Heat into Work",
  shortTitle: "Diesel Controlled-Combustion Heat Motor",
  subtitle: "Pre-combustion Air Compression, Gradual Fuel Admission, and Cut-off Expansion",
  inventors: ["Rudolf Diesel"],
  inventorLocation: "Berlin, Germany",
  grantDate: "1895-07-16",
  filingDate: "1892-08-26",
  era: "Gilded Age & Grid (1870–1900)",
  category: "materials",
  categoryLabel: "Heat Engines & Combustion",
  summary:
    "US 542,846 claims a process and machines for converting fuel heat into work: mechanically compress air before combustion, then admit fuel gradually while the working gases expand. Diesel describes solid, liquid, and gaseous fuels, single- and double-acting engines, air reservoirs, and a governed cut-off rather than a spark-ignition engine.",
  heroQuote:
    "The method forming my present invention differs from all those previously described, and is illustrated by the theoretical diagram shown in Fig. 2.",
  originalPdfUrl: "/patents/pdfs/us-542846-diesel-engine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US542846A/en",
  usptoClassification: "F02B 1/12 (internal-combustion engines using compression ignition)",
  originalText: `UNITED STATES PATENT OFFICE.\nRUDOLF DIESEL, OF BERLIN, GERMANY.\n\nMETHOD OF AND APPARATUS FOR CONVERTING HEAT INTO WORK.\n\nSPECIFICATION forming part of Letters Patent No. 542,846, dated July 16, 1895. Application filed August 26, 1892, serial No. 444,246.\n\n[Curated source excerpt only. The archival edition and reviewed ledger remain withheld while the foreign-patent line, figure semantics, and source wording receive independent facsimile review.]`,
  plainEnglishExplanation: {
    overview:
      "The patent's stated departure is a controlled-combustion process: compress air before fuel is admitted, introduce the fuel gradually during expansion, and stop admission at cut-off before further expansion. This source face does not treat the 1895 specification as a description of a later production diesel engine.",
    coreMechanism:
      "Diesel describes air compressed before combustion to the required subsequent-combustion temperature, then fuel introduced gradually while the gases expand. His Figure 2 gives illustrative initial pressures for stated temperatures; the patent's legal process is controlled admission and expansion, not a fixed pressure, ratio, injector geometry, or efficiency figure.",
    mechanicalBreakdown: [
      {
        title: "Single-acting cylinder and plunger",
        summary: "The coal-fuel example names a cylinder C and plunger P for the compression and working strokes.",
        technicalDetails:
          "The source names cylinder C, plunger P, connecting-rod b, crank c, shaft d, and plunger guides a. It does not give a bore, stroke, fabrication specification, wall thickness, or stress rating for this construction.",
        archaicTerm: "Working-cylinder with plunger",
        modernEquivalent: "Reciprocating working cylinder",
      },
      {
        title: "Gradual fuel-admission device",
        summary: "The liquid-fuel form uses a nozzle and needle to admit fuel gradually during the prescribed part of the stroke.",
        technicalDetails:
          "The source says that a feed-pump keeps liquid fuel in the nozzle and that distributing gear opens needle n near the highest compression. It does not establish an auxiliary atomization system, fuel-dispersion measurement, pressure value, or timing measurement.",
        archaicTerm: "Fuel-admission valve and nozzle",
        modernEquivalent: "Metered fuel-admission valve",
      },
      {
        title: "Governor-controlled fuel cut-off",
        summary: "Mechanical governor regulating the duration of fuel admission.",
        technicalDetails:
          "The source attributes fuel regulation to governor E and describes an adjustable piece moved by rod St that changes the period of fuel admission. It specifies neither a modern cut-off ratio nor a fixed pressure-control target.",
        archaicTerm: "Regulating valve-gear and centrifugal governor",
        modernEquivalent: "Variable fuel injection metering governor",
      },
      {
        title: "Admission and exhaust valve train",
        summary: "The described valves admit air, admit fuel, and exhaust gases in the several constructions.",
        technicalDetails:
          "The source describes valve A, hopper valve k, fuel plug D, and later valve W, operated by cams, levers, rods, and springs. It does not specify a later valve-train architecture or a scavenging performance.",
        archaicTerm: "Air-admission and exhaust valves",
        modernEquivalent: "Cam-operated admission and exhaust valves",
      },
      {
        title: "Central air-pump and reservoir",
        summary: "Preparatory air compression and a reservoir in the two-cylinder arrangement.",
        technicalDetails:
          "The two-cylinder form uses the lower part of central cylinder B as an air pump and reservoir L for preparatory compression and starting. The source gives no pump diameter, receiver volume, fabrication specification, or pressure rating.",
        archaicTerm: "Air-compressing pump driven by the engine",
        modernEquivalent: "Preparatory compressor and receiver",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Compression and expansion described in the specification",
        formula: "pV = nRT",
        explanation:
          "The document describes air compression before fuel admission, expansion during gradual combustion, a cut-off, and further expansion without transfer of heat. It supplies no dimensional or measured state data from which to calculate a numerical cycle.",
      },
    ],
    whyItMattersToday:
      "The patent is an early source for compression-before-admission and cut-off-controlled combustion. Connections to later engines require separately cited historical and technical evidence rather than unprinted performance claims.",
  },
  historicalContext: {
    problemStatement:
      "The specification criticizes combustion left uncontrolled after ignition: it says the resulting temperature complicates lubrication and maintenance, while hot exhaust carries away heat.",
    priorArtLimitations: [
      "Ordinary gas-engine cycles compressed an air-and-gas mixture before a rapid pressure and temperature rise.",
      "The specification says combustion was left to itself after ignition rather than regulated against the existing volume.",
      "The document discusses solid, liquid, and gaseous fuels rather than a single later fuel system.",
    ],
    breakthroughInsight:
      "The key insight stated here is to obtain the highest pressure and temperature by mechanical compression before combustion, then regulate fuel admission during expansion and stop it at cut-off.",
    patentWars: [],
    civilizationalImpact:
      "The patent records a controlled-combustion process and several example constructions. Later industrial history is outside this held source face and is not asserted here.",
  },
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Ordinary gas-engine theoretical diagram",
      caption: "The source identifies Fig. 1 as the ordinary gas-engine cycle diagram.",
      svgType: "diesel",
      callouts: [
        {
          id: "de-diagram",
          figureRef: "Fig. 1",
          label: "1",
          element: "Ordinary cycle",
          description: "The printed figure is the ordinary gas-engine theoretical cycle.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Diesel theoretical cycle diagram",
      caption: "The source identifies Fig. 2 as a theoretical diagram of the cycle according to the invention.",
      svgType: "diesel",
      callouts: [
        {
          id: "de-cylinder",
          figureRef: "Fig. 2",
          label: "2–3",
          element: "Gradual combustion path",
          description: "The printed cycle shows fuel admission during expansion to cut-off.",
          x: 50,
          y: 40,
        },
        {
          id: "de-piston",
          figureRef: "Fig. 2",
          label: "3–4",
          element: "Post-cut-off expansion",
          description: "The printed cycle continues expansion after fuel admission ceases.",
          x: 50,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Cooled-compression theoretical cycle diagram",
      caption: "The source identifies Fig. 3 as the variant with cooling during the first part of compression.",
      svgType: "diesel",
      callouts: [
        {
          id: "de-cooled-path",
          figureRef: "Fig. 3",
          label: "2′",
          element: "Cooled compression path",
          description: "The printed cycle includes the water-cooled first compression portion.",
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
        "A process for converting fuel heat into work by first compressing air or air with neutral gas or vapor until the required combustion temperature is reached, then gradually admitting fuel while the gases expand against resistance, stopping admission at a prescribed cut-off, and continuing expansion without heat transfer.",
      keyInnovations: [
        "Pre-combustion air compression",
        "Gradual fuel admission",
        "Cut-off followed by expansion",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: dieselManualClaimText(2),
      plainEnglish:
        "An internal combustion engine with a cylinder and piston, a valved suction inlet for air or neutral gas, a valved fuel feed that discharges gradually, and operating means that opens the feed at the working stroke and closes it at a predetermined part of that stroke.",
      keyInnovations: [
        "Valved suction inlet",
        "Gradual fuel feed",
        "Regulated cut-off valve",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: dieselManualClaimText(3),
      plainEnglish:
        "An internal combustion engine combining a combustion cylinder with gradual fuel admission to cut-off, an air compressor, a connected reservoir, and an expansion chamber for the exhaust gases.",
      keyInnovations: [
        "Combustion-cylinder cut-off",
        "Air compressor and reservoir",
        "Exhaust expansion chamber",
      ],
    },
  ],
  tags: ["Internal Combustion", "Thermodynamics", "Compression Ignition", "Heavy Machinery"],
  stats: {
    totalClaims: 3,
    independentClaims: 3,
  },
};
