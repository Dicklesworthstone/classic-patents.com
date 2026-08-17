import type { Patent } from "@/types/patent";

export const einsteinRefrigeratorPatent: Patent = {
  id: "us-1781541-einstein-refrigerator",
  patentNumber: "US 1,781,541",
  title: "Refrigeration",
  shortTitle: "Einstein & Szilárd's Absorption Refrigerator",
  subtitle: "Zero-Moving-Parts Hermetic Closed Loop & Dalton's Partial Pressure Evaporation",
  inventors: ["Albert Einstein", "Leo Szilard"],
  inventorLocation: "Berlin, Germany",
  grantDate: "1930-11-11",
  filingDate: "1927-12-16",
  era: "Industrial & Mass Production (1910–1940)",
  category: "consumer",
  categoryLabel: "Thermodynamics & Consumer Technology",
  summary:
    "Albert Einstein and Leo Szilard's revolutionary absorption refrigerator: a hermetically welded cooling circuit operating at uniform internal pressure with zero moving mechanical parts, zero rotating shaft seals, and zero noise, driven by a continuous heat source utilizing Dalton's Law of Partial Pressures.",
  heroQuote:
    "An entire family in Berlin died in their sleep when the toxic chemical seal in their refrigerator compressor ruptured... Leo and I resolved that no family should ever die from a refrigerator.",
  originalPdfUrl: "/patents/pdfs/us-1781541-einstein-refrigerator.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1781541A/en",
  usptoClassification:
    "F25B 15/00 (Absorption refrigeration machines; Non-mechanical hermetic cycles)",
  originalText: `UNITED STATES PATENT OFFICE
1,781,541
Patented Nov. 11, 1930

REFRIGERATION
Albert Einstein, Berlin, and Leo Szilard, Berlin-Wilmersdorf, Germany, assignors to Electrolux Servel Corporation, New York, N.Y., a corporation of Delaware
Application filed December 16, 1927, Serial No. 240,436, and in Germany December 16, 1926
10 Claims. (Cl. 62-119.5)

SPECIFICATION

TO ALL WHOM IT MAY CONCERN:
Be it known that we, ALBERT EINSTEIN, residing at Berlin, Germany, and LEO SZILARD, residing at Berlin-Wilmersdorf, Germany, citizens of Switzerland and Hungary respectively, have invented certain new and useful improvements in REFRIGERATION, of which the following is a specification:

OBJECT OF THE INVENTION
The present invention relates to refrigeration apparatus and more particularly to apparatus of the absorption type wherein cooling is produced without the necessity of mechanical compressors, pumps, valves, or rotating stuffing box seals.

In domestic mechanical refrigerators of the compressor type, the wear of moving parts and the degradation of shaft packings frequently leads to the escape of irritating or toxic refrigerant vapors into the living quarters. It is an object of the present invention to provide a refrigerator which is entirely sealed, hermetically welded, devoid of moving parts, and which operates silently and reliably over an indefinite lifespan.

OPERATION OF THE UNIFORM PRESSURE CYCLE
According to our invention, the entire internal apparatus is maintained under a substantially uniform total pressure throughout all vessels and connecting conduits, for example at a pressure of ten atmospheres.

The apparatus utilizes three working media:
1. A refrigerant liquid having a relatively low boiling point under reduced partial pressure (such as butane, ethyl chloride, or propane);
2. An auxiliary gas which is inert with respect to the refrigerant but highly soluble in an absorption liquid (such as ammonia gas);
3. An absorption liquid possessing high affinity for the auxiliary gas and low affinity for the refrigerant (such as water).

Heat applied to the generator expels ammonia gas from the aqueous solution. The gaseous ammonia flows into the evaporator, where it encounters liquid butane. By Dalton's law of partial pressures, the presence of the ammonia reduces the partial vapor pressure of the butane from 10 atmospheres down to 1 or 2 atmospheres, causing the butane to evaporate vigorously at low temperature (-10° C.) and extract heat from the cooling chamber.

The resulting mixture of butane and ammonia vapors flows to the absorber, where water absorbs the ammonia gas, liberating the butane vapor. The butane vapor flows to an air-cooled condenser, liquefies, and returns to the evaporator, while the ammonia-water solution is returned to the generator by thermosiphon lifting action.

WE CLAIM:
1. An apparatus for refrigeration comprising an evaporator, an absorber, a generator, and a condenser connected in a closed hermetic circuit maintaining a substantially uniform total internal pressure, said circuit containing a volatile liquid refrigerant, an auxiliary evaporating gas, and an absorption liquid, said auxiliary gas being adapted to reduce the partial pressure of the refrigerant in the evaporator causing evaporation thereof at low temperature, and said absorption liquid being adapted to dissolve said auxiliary gas in the absorber to permit separation and recycling.
2. An apparatus as set forth in claim 1, wherein said refrigerant is butane, said auxiliary gas is ammonia, and said absorption liquid is water.`,
  plainEnglishExplanation: {
    overview:
      "In the 1920s, refrigerators frequently killed people when rotating compressor shaft seals wore out and leaked lethal toxic gases (methyl chloride and sulfur dioxide). Albert Einstein and his former student Leo Szilard spent five years designing a completely hermetic refrigerator with no moving parts, no motor, and no seals.",
    coreMechanism:
      "The entire closed system is kept at a uniform constant pressure (10 atmospheres). Heat applied to a boiler drives off ammonia gas into an evaporator containing liquid butane. By Dalton's Law of Partial Pressures, the presence of the ammonia gas drastically drops the butane's partial pressure, causing the butane to flash-evaporate at sub-zero temperatures (-10°C) and produce refrigeration without any mechanical compressor.",
    mechanicalBreakdown: [
      {
        title: "Uniform-Pressure Hermetic Chamber",
        summary: "Welded steel tubes holding three fluids at equalized 10 atm pressure.",
        technicalDetails:
          "Because the pressure is identical everywhere in the system, no high-pressure/low-pressure throttle valves or rotary compressor seals are required, eliminating the primary source of mechanical failure and chemical leakage.",
        archaicTerm: "Closed hermetic circuit maintaining uniform total internal pressure",
        modernEquivalent: "Hermetically sealed absorption refrigeration loop",
      },
      {
        title: "Thermosiphon Bubble Pump Boiler",
        summary: "A thermal heat source (gas flame or electric heater) driving fluid circulation.",
        technicalDetails:
          "Heat boils the ammonia-water solution in the generator. Rising vapor bubbles act as miniature pistons (airlift pump), lifting the liquid solution upward against gravity without any electric motor.",
        archaicTerm: "Thermosiphon lifting generator",
        modernEquivalent: "Bubble pump / Thermosiphon heat pipe",
      },
      {
        title: "Dalton Partial Pressure Evaporator",
        summary: "Mixing volatile butane with auxiliary ammonia gas to force evaporation.",
        technicalDetails:
          "Total pressure is constant: $P_{total} = P_{butane} + P_{ammonia} = 10\\text{ atm}$. Injecting ammonia gas lowers $P_{butane}$ below its saturation point at -10°C, absorbing latent heat $\\Delta H_{vap}$ from the refrigerator cabinet.",
        archaicTerm: "Evaporation under reduced partial pressure",
        modernEquivalent: "Dalton absorption evaporator",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Dalton's Law of Partial Pressures in Evaporation",
        formula:
          "P_{total} = P_{butane} + P_{ammonia} = \\text{const.} \\implies P_{butane} = P_{total} - P_{ammonia} \\ll P_{sat}(T_{cold})",
        explanation:
          "The partial pressure of a gas is proportional to its mole fraction. Lowering the partial pressure of butane induces rapid boiling at sub-freezing temperatures without pulling a mechanical vacuum.",
      },
      {
        principle: "Thermosiphon Buoyancy Convection",
        formula: "\\Delta P_{buoyancy} = (\\rho_{liquid} - \\rho_{vapor}) g \\cdot h",
        explanation:
          "Density differences between boiling vapor bubbles and liquid columns create a continuous upward driving pressure that circulates refrigerant passively.",
      },
    ],
    whyItMattersToday:
      "Einstein and Szilard's zero-moving-parts absorption cycle is used today in recreational vehicle (RV) refrigerators, remote solar-thermal cooling stations, and hermetic molten-metal cooling systems in advanced nuclear reactors.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "1. An apparatus for refrigeration comprising an evaporator, an absorber, a generator, and a condenser connected in a closed hermetic circuit maintaining a substantially uniform total internal pressure, said circuit containing a volatile liquid refrigerant, an auxiliary evaporating gas, and an absorption liquid, said auxiliary gas being adapted to reduce the partial pressure of the refrigerant in the evaporator causing evaporation thereof at low temperature, and said absorption liquid being adapted to dissolve said auxiliary gas in the absorber to permit separation and recycling.",
      plainEnglish:
        "Covers the constant-pressure, three-fluid absorption refrigeration cycle with no moving parts using refrigerant evaporation into an auxiliary gas and selective absorption in a solvent liquid.",
      keyInnovations: [
        "Uniform constant-pressure closed refrigeration loop",
        "Dalton partial pressure evaporative cooling without compressor seals",
        "Zero-moving-parts thermosiphon circulation",
      ],
      legalSignificance:
        "The master patent claim for hermetic non-mechanical absorption cooling systems.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "2. An apparatus as set forth in claim 1, wherein said refrigerant is butane, said auxiliary gas is ammonia, and said absorption liquid is water.",
      plainEnglish: "Specifies the butane/ammonia/water fluid mixture triad.",
      keyInnovations: ["Butane, ammonia, and water working triad"],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Overall Closed Circuit Schematic",
      caption: "Schematic diagram of generator, condenser, evaporator, and absorber loop.",
      svgType: "einstein-refrigerator",
      callouts: [
        {
          id: "c1",
          figureRef: "Fig. 1",
          label: "Generator / Boiler",
          element: "10",
          description: "Heated ammonia-water boiling vessel",
          x: 75,
          y: 65,
        },
        {
          id: "c2",
          figureRef: "Fig. 1",
          label: "Evaporator Chamber",
          element: "18",
          description: "Sub-zero butane evaporation cooling box",
          x: 25,
          y: 30,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Bubble Pump Generator Detail",
      caption: "Thermosiphon bubble pump lifting conduit.",
      svgType: "einstein-refrigerator",
      callouts: [
        {
          id: "c3",
          figureRef: "Fig. 2",
          label: "Bubble Lift Pipe",
          element: "24",
          description: "Thermal vapor bubble lift column",
          x: 50,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Mechanical refrigerators in the 1920s relied on reciprocating motor compressors driven through rotating crankshaft seals. Shaft seals inevitably wore down over time, leaking lethal pressurized toxic refrigerant gases (sulfur dioxide, methyl chloride) into residential homes while causing loud motor vibrations and frequent mechanical breakdown.",
    priorArtLimitations: [
      "Rotating compressor shaft seals inevitably leaked toxic chemical refrigerants",
      "Compressor motor vibrations produced loud humming in domestic kitchens",
      "Refrigerators required frequent mechanical servicing and valve replacements",
    ],
    breakthroughInsight:
      "Einstein and Szilard realized that mechanical compressors could be eliminated entirely by keeping the entire closed system at a constant uniform total pressure (e.g. 10 atmospheres). By introducing a third inert gas (ammonia gas) into the evaporator alongside the liquid refrigerant (butane), Dalton's Law of Partial Pressures causes the local partial pressure of the butane to plummet, forcing it to boil and vaporize rapidly at sub-zero temperatures without requiring a mechanical vacuum pump.",
    patentWars: [
      {
        rivalName: "Electrolux / Platen-Munters",
        rivalClaim:
          "Swedish inventors Baltzar von Platen and Carl Munters had patented a continuous absorption cycle using water, ammonia, and hydrogen",
        conflictDetails:
          "Electrolux had acquired the Platen-Munters patent. When Einstein and Szilard patented their butane/ammonia/water variation with an electromagnetic liquid metal pump in 1928–1930, Electrolux bought the Einstein-Szilard patent portfolio for $750 to protect its market dominance.",
        resolution:
          "Einstein and Szilard received patent royalties, and the patent became a classic thermodynamic benchmark.",
        legalOutcome:
          "Prevented competing American appliance firms from designing non-mechanical refrigerators.",
      },
    ],
    civilizationalImpact:
      "Demonstrated that theoretical physics principles (Dalton's law, thermodynamics) could eliminate mechanical failure modes, inspiring modern hermetic cooling technologies and spacecraft thermal management.",
    funFact:
      "Albert Einstein used his earnings from the Electrolux refrigerator patent royalties to support impoverished physics students and refugees fleeing Nazi Germany in the early 1930s.",
  },
  tags: ["consumer", "thermodynamics", "einstein", "physics"],
  stats: {
    totalClaims: 10,
    independentClaims: 1,
    patentWarYears: "1926–1930 (Electrolux Patent Purchase)",
    impactScore: 98,
  },
};
