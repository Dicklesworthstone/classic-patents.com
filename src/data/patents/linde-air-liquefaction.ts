import {
  lindeAirLiquefactionArchivalEdition,
  manualClaimText,
} from "@/data/editions/lindeAirLiquefactionEdition";
import type { Patent } from "@/types/patent";

export const lindeAirLiquefactionPatent: Patent = {
  id: "us-727650-linde-air-liquefaction",
  patentNumber: "US 727,650",
  title:
    "Process of Producing Low Temperatures, the Liquefaction of Gases, and the Separation of the Constituents of Gaseous Mixtures",
  shortTitle: "Linde Regenerative Air Liquefaction and Separation",
  subtitle: "Pressure-Drop Cooling, Counter-Current Heat Exchange, and Fractional Distillation",
  inventors: ["Carl Linde"],
  inventorLocation: "Munich, Germany",
  grantDate: "1903-05-12",
  filingDate: "1895-07-09",
  era: "Gilded Age & Grid (1870–1900)",
  category: "materials",
  categoryLabel: "Cryogenic Thermodynamics & Gas Separation",
  summary:
    "Filed July 9, 1895 and granted May 12, 1903, US 727,650 covers Carl Linde’s process for producing low temperatures, liquefying gases, and separating the constituents of gaseous mixtures. The specification uses a compressor, a cooler, a long insulated counter-current apparatus, and a regulated pressure drop to keep returning low-pressure gas in thermal exchange with incoming high-pressure gas. It gives 75 atmospheres high pressure, 25 atmospheres low pressure, and cooling to about 10 degrees centigrade or less as an effective air-liquefaction example, then describes fractionating the liquid so nitrogen and oxygen may be taken off through further heat-exchange paths.",
  heroQuote:
    "My invention relates to improvements in processes for producing very low temperatures, especially for the purpose of liquefying gases or mixtures of the same, such as atmospheric air, and also in separating the constituents of gaseous mixtures.",
  originalPdfUrl: "/patents/pdfs/us-727650-linde-air-liquefaction.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US727650A/en",
  usptoClassification: "F25J 1/00 (Processes or apparatus for liquefying or solidifying gases)",
  archivalEdition: lindeAirLiquefactionArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-727650-linde-air-liquefaction-reviewed.txt",
    pageCount: 5,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "6d5423307d5718474ea8dd5891c52bccc6c7df2103a9ed4b9c7298d27f29c776",
  },
  originalText: `UNITED STATES PATENT OFFICE.
CARL LINDE, OF MUNICH, GERMANY, ASSIGNOR OF ONE-THIRD TO CHARLES F. BRUSH, OF CLEVELAND, OHIO.

PROCESS OF PRODUCING LOW TEMPERATURES, THE LIQUEFACTION OF GASES, AND THE SEPARATION OF THE CONSTITUENTS OF GASEOUS MIXTURES.

SPECIFICATION forming part of Letters Patent No. 727,650, dated May 12, 1903.
Application filed July 9, 1895. Serial No. 595,371. (No specimens.)

To all whom it may concern:
Be it known that I, CARL LINDE, professor, a subject of the King of Bavaria, residing at Munich, in the Kingdom of Bavaria, German Empire, have invented new and useful Improvements in Processes of Producing Low Temperatures, the Liquefaction of Gases, and the Separation of the Constituents of Gaseous Mixtures, of which the following is a specification.

My invention relates to improvements in processes for producing very low temperatures, especially for the purpose of liquefying gases or mixtures of the same, such as atmospheric air, and also in separating the constituents of gaseous mixtures. The method of separating the components of atmospheric air is based upon a fact well known to physicists—that oxygen, although having a boiling-point higher than nitrogen, can only be liquefied simultaneously with the nitrogen or part of it, but that the nitrogen is first evaporated on volatilizing the liquefied mixture, so that the mixture will become richer in oxygen the longer the volatilization is continued.

The liquefaction of gases, such as atmospheric air, has hitherto been carried out by producing successive liquefaction and volatilization of liquids of gradually-increasing volatility, such as carbonic acid, nitrous oxid, ethylene, and the like. This method, however, has not proved capable of practical application for the purpose of attaining such low temperatures as that required for liquefying atmospheric air.`,
  plainEnglishExplanation: {
    overview:
      "The specification identifies a practical limitation of an earlier cascade method: successive liquefaction and volatilization of carbonic acid, nitrous oxid, ethylene, and similar fluids had not attained temperatures low enough to liquefy atmospheric air in practical use. Linde’s move is a forced circulation between high- and low-pressure spaces. Gas cooled by a pressure drop returns through a long conducting path beside the incoming high-pressure gas, so each circulation begins colder than the last. The document then extends that cold circuit into a separation arrangement in which nitrogen is evaporated from liquid air and the remaining liquid becomes richer in oxygen.",
    coreMechanism:
      "Compressor C raises the incoming air from $p′$ to $p²$ and cooler K brings it from $t²$ to $t³$. The high-pressure stream travels down the inner channel of G′, two long coiled pipes arranged concentrically; the low-pressure return stream travels in the outer annular channel in the opposite direction. At the cold end, nozzle N and regulating valve R′ discharge the stream into vessel V′ at lower pressure. The patent reports 75 atmospheres in the high-pressure space, 25 atmospheres in the low-pressure space, and $t³$ of about $10^\\circ\\text{C}$ or less as effective operating conditions. The pressure-drop stream first falls to $t⁴$, then, after returning through G′ and absorbing heat from the incoming stream, falls further to $t⁵$. Repetition lowers V′ to or below the critical point so liquid air collects there. The optional V², S, G², and G³ branch evaporates nitrogen and can deliver oxygen in gaseous form or retain it as liquid.",
    mechanicalBreakdown: [
      {
        title: "Compressors C and P",
        summary:
          "C establishes the working high pressure; P supplies fresh outside air to maintain the circuit’s pressure.",
        technicalDetails:
          "The specification says C receives air at $p′$ and compresses it to $p²$, raising the temperature from $t′$ to $t²$. P feeds the suction of C with outside air. In Linde’s reported air-liquefaction example, the system maintains $75$ atmospheres on the high side and $25$ atmospheres on the low side.",
        archaicTerm: "compressor",
        modernEquivalent: "Gas compressor supplying a recirculating pressure loop",
      },
      {
        title: "Cooler K and Counter-Current Apparatus G′",
        summary:
          "A cooler removes heat after compression; a long two-pipe exchanger lets the returning low-pressure gas cool the incoming high-pressure stream.",
        technicalDetails:
          "K is a coil cooled by cold brine or liquid ammonia and lowers the compressed stream to $t³$. G′ has two coiled pipes, one inside the other, giving a central and outer annular channel. The source recommends about $100\\text{ m}$ of pipe and non-conducting material such as sheep’s wool. Opposite-direction streams exchange heat through the conducting inner coil.",
        archaicTerm: "counter-current apparatus",
        modernEquivalent: "Concentric-tube regenerative heat exchanger",
      },
      {
        title: "Nozzle N, Regulating Valve R′, and Vessel V′",
        summary:
          "The regulated discharge creates the low-pressure cold end in which liquid air can collect.",
        technicalDetails:
          "N projects into closed vessel V′ from the lower end of G′’s inner pipe, and R′ regulates the difference between the high- and low-pressure spaces. The returning low-pressure path runs from V′ through G′’s annular channel to C’s suction. In the source’s sequence, repeated discharge first reaches $t⁴$, then $t⁵$, and eventually produces liquid air at the bottom of V′.",
        archaicTerm: "regulating-valve",
        modernEquivalent: "Pressure-control valve at a regenerative expansion stage",
      },
      {
        title: "Separating Vessel V², Coil S, and Apparatus G²/G³",
        summary:
          "The optional separation branch uses the liquefied air to release nitrogen and recover oxygen in gaseous or liquid form.",
        technicalDetails:
          "V² is connected to V′ through regulating valve R². Incoming air runs through G², coil S, and G³. In V², heat taken from the coil evaporates nitrogen, which leaves by G². Liquid oxygen can pass through G³ and leave as gas; when G³ is omitted, the source says it can be drawn as liquid through valve n.",
        archaicTerm: "evaporating vessel",
        modernEquivalent: "Evaporation and fractionation vessel",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Printed Joule-Thomson Pressure-Drop Relation",
        formula: "T - T′ = (p² - p′²)(289) / 4T²",
        explanation:
          "Linde attributes the pressure-drop observation to Joule and Thomson. He defines $p²$ as the higher pressure, $p′$ as the lower pressure in atmospheres, and $T$ and $T′$ as absolute temperatures. The specification’s examples for a 50-atmosphere difference range from 13 degrees centigrade at $T=283°$ to 40.70 degrees at $T=160°$.",
      },
      {
        principle: "Counter-Current Regenerative Enthalpy Exchange",
        formula:
          "\\dot{Q}_{\\text{exchange}} = U A \\Delta T_{\\text{LMTD}} = \\dot{m}_{\\text{in}} h_{\\text{in}}(P_{\\text{high}}, T) - \\dot{m}_{\\text{return}} h_{\\text{return}}(P_{\\text{low}}, T)",
        explanation:
          "The two streams in G′ travel in opposite directions on opposite sides of a conducting inner coil. The returning low-pressure stream absorbs heat from the incoming high-pressure stream. That regenerative exchange is what lets successive pressure drops lower the cold-end temperature from $t³$ to $t⁴$ and then $t⁵$.",
      },
      {
        principle: "Fractional Separation of Liquid Air",
        formula: "Q = mL",
        explanation:
          "The specification describes liquid air becoming richer in oxygen as nitrogen first evaporates. In V², the incoming-air coil supplies the heat that evaporates nitrogen, while the oxygen-bearing liquid follows a separate path. $Q=mL$ is the modern heat-balance shorthand for the phase-change duty; the patent does not state numerical latent heats or product purity.",
      },
    ],
    whyItMattersToday:
      "The grant makes the engineering chain visible: a pressure-drop cooling effect becomes useful only when a counter-current return stream recovers heat, and the resulting liquid can be separated by using phase change as another heat-exchange stage. Its claims cover both the basic regenerative refrigeration arrangement and more specific routes for separating air or another mixed gas into constituents. The facsimile itself does not establish later production volumes, market position, or modern application claims.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Refrigerate a gas by compressing, cooling, expanding through a valve into lower pressure, and using the cold expanded gas to absorb heat from compressed gas about to be expanded.",
      keyInnovations: [
        "compression-cooling-expansion",
        "counter-current absorption",
        "closed refrigeration",
      ],
      legalSignificance:
        "The fundamental process claim establishing the Linde counter-current regenerative cycle for air liquefaction.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Refrigerate and liquefy gas by expanding it through a valve into lower pressure and using the expanded gas to cool incoming compressed gas until critical temperature is reached and liquefaction occurs.",
      keyInnovations: ["progressive cooling", "critical temperature", "liquefaction threshold"],
      legalSignificance:
        "Protected the progressive regenerative liquefaction regime down to the gas's critical temperature.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Liquefy air by causing compressed and cooled air to condense by continuous expansion of itself around the outside of the conduit through which it passes.",
      keyInnovations: ["concentric conduit", "self-expansion", "temperature of liquid air"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "For a gaseous mixture, repeatedly expand and regenerate cold, then use the resulting liquid to release the more volatile component by heat absorption.",
      keyInnovations: ["gaseous mixture", "volatile component", "regenerative fractionation"],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "Apply the regenerative liquefaction sequence to air and use liberated nitrogen as an additional cold stream for incoming air.",
      keyInnovations: ["air liquefaction", "nitrogen evaporation", "heat absorption"],
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualClaimText(6),
      plainEnglish:
        "Continue the air sequence through liquid formation, nitrogen liberation, and oxygen-rich liquid, using each stage to cool the next incoming air.",
      keyInnovations: ["nitrogen", "oxygen", "cascade cooling"],
    },
    {
      number: 7,
      isIndependent: true,
      originalText: manualClaimText(7),
      plainEnglish:
        "Separate gaseous nitrogen, liquid oxygen, and gaseous oxygen in successive heat-exchange stages after air liquefies.",
      keyInnovations: ["nitrogen gas", "liquid oxygen", "gaseous oxygen"],
    },
    {
      number: 8,
      isIndependent: true,
      originalText: manualClaimText(8),
      plainEnglish:
        "Make an oxygen-rich and oxygen-poor fraction by liquefying air and fractionally distilling it with heat taken from compressed air awaiting liquefaction.",
      keyInnovations: ["fractional distillation", "oxygen-rich fraction", "heat integration"],
    },
    {
      number: 9,
      isIndependent: true,
      originalText: manualClaimText(9),
      plainEnglish:
        "The two-fraction air process additionally uses distilled nitrogen to cool compressed air that will be liquefied.",
      keyInnovations: ["distilled nitrogen", "compressed-air cooling", "air separation"],
    },
    {
      number: 10,
      isIndependent: true,
      originalText: manualClaimText(10),
      plainEnglish:
        "The two-fraction air process additionally uses distilled oxygen to cool compressed air that will be liquefied.",
      keyInnovations: ["distilled oxygen", "compressed-air cooling", "air separation"],
    },
    {
      number: 11,
      isIndependent: true,
      originalText: manualClaimText(11),
      plainEnglish:
        "Fractionally distill a liquefied mixed gas using heat from a similar stream previously cooled while condensing at higher pressure.",
      keyInnovations: [
        "liquefied mixed gas",
        "fractional distillation",
        "higher-pressure condensation",
      ],
    },
    {
      number: 12,
      isIndependent: true,
      originalText: manualClaimText(12),
      plainEnglish:
        "Separate any mixed gas by liquefying it and fractionally distilling it with heat derived from previously cooled gas condensing at higher pressure.",
      keyInnovations: ["mixed gas", "liquefaction", "fractional distillation"],
    },
    {
      number: 13,
      isIndependent: true,
      originalText: manualClaimText(13),
      plainEnglish:
        "The prior separation process also uses the liquid gas obtained to wholly or partly maintain the liquid supply.",
      keyInnovations: ["liquid supply", "recycle", "higher-pressure condensation"],
    },
    {
      number: 14,
      isIndependent: true,
      originalText: manualClaimText(14),
      plainEnglish:
        "Separate a mixed gas by liquefaction and fractional distillation, then use the distillation products to cool gas about to be liquefied.",
      keyInnovations: ["distillation products", "product cooling", "gas separation"],
    },
  ],
  drawings: [
    {
      figureNumber: "Sole diagrammatic drawing",
      title: "Apparatus for producing low temperatures and separating gaseous mixtures",
      caption:
        "The sole source drawing is an apparatus diagram bearing the lettered components used in the specification: compressors C and P, refrigerator K, counter-current apparatus G′, closed vessel V′, nozzle N, regulating valves, separating vessel V², coil S, and counter-current apparatus G² and G³.",
      svgType: "linde-air-liquefaction",
      callouts: [
        {
          id: "ll-1",
          figureRef: "Sole diagrammatic drawing",
          label: "C",
          element: "Compressor",
          description:
            "C receives air at p′ and compresses it to p² before the stream enters cooler K.",
          x: 25,
          y: 32,
        },
        {
          id: "ll-2",
          figureRef: "Sole diagrammatic drawing",
          label: "K",
          element: "Refrigerator",
          description:
            "K cools the compressed air with a coil cooled by cold brine or liquid ammonia.",
          x: 31,
          y: 69,
        },
        {
          id: "ll-3",
          figureRef: "Sole diagrammatic drawing",
          label: "G′",
          element: "Counter-current apparatus",
          description:
            "Two coiled pipes, one within the other, carry high- and low-pressure streams in opposite directions.",
          x: 56,
          y: 62,
        },
        {
          id: "ll-4",
          figureRef: "Sole diagrammatic drawing",
          label: "V′",
          element: "Closed vessel",
          description:
            "V′ receives the regulated discharge from nozzle N and collects liquid air once the cold end reaches the required condition.",
          x: 72,
          y: 51,
        },
        {
          id: "ll-5",
          figureRef: "Sole diagrammatic drawing",
          label: "V²",
          element: "Evaporating vessel",
          description:
            "V², with coil S and apparatus G² and G³, provides the optional nitrogen and oxygen separation path described in the specification.",
          x: 58,
          y: 22,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Linde states that the earlier method of successive liquefaction and volatilization of progressively more volatile liquids had not proved practically capable of reaching the temperatures needed to liquefy atmospheric air. His stated task is both to produce very low temperatures and to separate the constituents of gaseous mixtures.",
    priorArtLimitations: [
      "The specification identifies successive liquefaction and volatilization of liquids of gradually increasing volatility as the earlier route.",
      "It names carbonic acid, nitrous oxid, and ethylene as examples of those earlier working fluids.",
      "The source says that route had not proved capable of practical application at the temperature required to liquefy atmospheric air.",
    ],
    breakthroughInsight:
      "The specification turns the temperature decrease obtained by discharging high-pressure air through a valve into a regenerative loop. Low-pressure air returns beside the incoming high-pressure stream in G′, so the next pressure drop begins from a lower temperature. Once liquid air forms, the same heat-exchange logic can separate nitrogen and oxygen through V², S, G², and G³.",
    patentWars: [],
    civilizationalImpact:
      "The primary source documents a linked industrial problem: generate progressively lower temperatures, liquefy a gas mixture, and use fractional evaporation and heat exchange to obtain nitrogen and oxygen streams. It therefore preserves an early engineering account of regenerative refrigeration coupled to gas-mixture separation, while leaving later commercial and scientific consequences to separately sourced historical research.",
  },
  tags: [
    "Carl Linde",
    "Linde Process",
    "Air Liquefaction",
    "Cryogenics",
    "Joule-Thomson Effect",
    "Thermodynamics",
    "Liquid Oxygen",
    "Industrial Gases",
    "Gilded Age",
  ],
  stats: {
    totalClaims: 14,
    independentClaims: 14,
  },
};
