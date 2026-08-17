import type { Patent } from "@/types/patent";

export const teslaCoilPatent: Patent = {
  id: "us-533367-tesla-coil",
  patentNumber: "US 533,367",
  title: "Electrical Transformer",
  shortTitle: "Tesla's High-Frequency Resonant Transformer",
  subtitle: "Air-Core Tuned Resonant Induction Coils for High-Voltage and Radio-Frequency Physics",
  inventors: ["Nikola Tesla"],
  inventorLocation: "New York, N.Y.",
  grantDate: "1895-02-06",
  filingDate: "1894-01-18",
  era: "Electrification Era (1880–1900)",
  category: "electricity",
  categoryLabel: "High-Frequency Electromagnetics",
  summary:
    "Tesla's air-core transformer: two loosely coupled LC circuits tuned to the same $f_0$. Voltage piles up on the secondary until the air breaks down. No iron, so no hysteresis at spark frequencies.",
  heroQuote:
    "Be it known that I, Nikola Tesla, a citizen of the United States, residing at New York, in the County and State of New York, have invented certain new and useful Improvements in Electrical Transformers...",
  originalPdfUrl: "/patents/pdfs/us-533367-tesla-coil.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US533367A/en",
  usptoClassification: "H01F 38/00 (Transformers; resonant coils)",
  originalText: `UNITED STATES PATENT OFFICE.
NIKOLA TESLA, OF NEW YORK, N. Y.

ELECTRICAL TRANSFORMER.

SPECIFICATION forming part of Letters Patent No. 533,367, dated February 6, 1895.
Application filed January 18, 1894. Serial No. 497,291. (No model.)

To all whom it may concern:
Be it known that I, NIKOLA TESLA, a citizen of the United States, residing at New York, in the County and State of New York, have invented certain new and useful Improvements in Electrical Transformers, of which the following is a specification.

My invention relates to transformers and coils used for the production of currents of very high potential and high frequency. In the transformation of currents of ordinary frequency, iron cores are commonly employed; but when currents of extremely high frequency are used, such as are produced by disruptive discharge from condensers, the presence of iron is not only unnecessary but detrimental, owing to hysteresis and eddy current losses.

I have found that by properly proportioning the self-induction and capacity of the primary and secondary circuits, so that the period of oscillation of the secondary is identical with or an exact multiple of that of the primary, extraordinarily high potentials may be obtained with high efficiency.

In order to prevent electrical breakdown between the turns of the secondary, where the potential difference is greatest, I wind the secondary coil upon a conical or tapered insulating spool, so that the turns at the top of the coil, which are at the highest potential, are widely separated from the primary and from adjacent turns.`,
  plainEnglishExplanation: {
    overview:
      "Traditional iron-core transformers cannot handle high frequencies; iron heats up rapidly and wastes vast amounts of power in magnetic hysteresis. Tesla discarded the iron core and created a dual tuned resonant transformer. By matching the electrical resonant frequency of the primary capacitor discharge to the natural quarter-wave frequency of the secondary winding, electrical potential builds dramatically without arcing.",
    coreMechanism:
      "A primary tank capacitor discharges across a spark gap into a heavy copper primary coil, producing intense high-frequency magnetic pulses. The magnetic field induces a standing wave along an air-core conical secondary coil tuned to identical LC resonance, multiplying voltage up to millions of volts at the elevated top terminal.",
    mechanicalBreakdown: [
      {
        title: "Air-Core Primary & Secondary Coils",
        summary: "Concentric coils wound with zero ferromagnetic iron core.",
        technicalDetails:
          "Eliminates iron hysteresis power loss ($P_{hyst} = \\eta f B^{1.6}$) and eddy-current damping at radio frequencies.",
        archaicTerm: "Coils without iron cores",
        modernEquivalent: "Air-core resonant transformer",
      },
      {
        title: "Disruptive Spark Gap & Primary Capacitor",
        summary: "A high-voltage capacitor discharging across an air spark gap.",
        technicalDetails:
          "Generates damped high-frequency current oscillations ($f = 1/2\\pi\\sqrt{L_p C_p}$) driving the primary coil.",
        archaicTerm: "Disruptive discharge apparatus",
        modernEquivalent: "LC tank oscillator spark circuit",
      },
      {
        title: "Conical Secondary High-Voltage Spool",
        summary: "A secondary winding wound on a conical insulator.",
        technicalDetails:
          "Separates turns where the potential gradient is highest, preventing internal dielectric arcing and insulation puncture.",
        archaicTerm: "Conical or tapered spool",
        modernEquivalent: "Graded dielectric resonant winding",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Dual Resonant LC Frequency Matching",
        formula: "f_0 = \\frac{1}{2\\pi \\sqrt{L_p C_p}} = \\frac{1}{2\\pi \\sqrt{L_s C_s}}",
        explanation:
          "Maximum energy transfer occurs when both primary and secondary circuits share the exact same natural electrical resonant frequency.",
      },
      {
        principle: "Quarter-Wave Potential Magnification",
        formula: "V_{sec} = V_{pri} \\cdot \\sqrt{\\frac{L_s}{L_p}} \\cdot Q",
        explanation:
          "High secondary inductance and high quality factor Q step up input voltages into million-volt potentials.",
      },
    ],
    whyItMattersToday:
      "A Qi pad, an RF matching network, and a Tesla-coil show are the same coupled-resonator page. The show is louder.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The improvement in the method of electrical transformation consisting in passing high-frequency currents through a primary coil of low resistance and self-induction and inducing thereby currents in a secondary coil having a greater number of convolutions and adjusted to be in resonance with the primary circuit, substantially as set forth.",
      plainEnglish:
        "The master claim covering high-frequency resonant electrical transformation using a low-inductance primary tuned in resonance with a high-turn secondary.",
      keyInnovations: [
        "Air-core resonant transformer",
        "Tuned LC primary-secondary resonance",
        "Conical winding preventing voltage breakdown",
      ],
      legalSignificance:
        "Foundational patent in Tesla's high-frequency portfolio that defined resonant inductive coupling.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Cross Section of Conical Resonant Transformer",
      caption:
        "Cross-sectional blueprint showing the outer primary coil and the concentric conical secondary winding.",
      svgType: "tesla-coil",
      callouts: [
        {
          id: "tc-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Primary Coils",
          description: "Heavy copper primary winding.",
          x: 35,
          y: 65,
        },
        {
          id: "tc-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Conical Secondary",
          description: "Fine wire secondary winding on conical frame.",
          x: 50,
          y: 40,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "An iron-core transformer at spark frequencies cooks itself: hysteresis and eddy currents scale the wrong way with $f$. Ruhmkorff coils could make a spark for a lecture hall, not a tuned RF tank.",
    priorArtLimitations: [
      "Gaulard–Gibbs closed iron cores, built for lighting frequencies.",
      "Ruhmkorff coils with a hammer interrupter and no designed secondary resonance.",
      "Power grids at 25–60 Hz, useless as RF sources.",
    ],
    breakthroughInsight:
      "Throw the iron out. Couple two LC circuits loosely and tune them to the same $f_0 = 1/(2\\pi\\sqrt{LC})$. Energy sloshes into the secondary until the voltage is limited by corona, not by core loss.",
    patentWars: [
      {
        rivalName: "Marconi's four-circuit tuner",
        rivalClaim: "Marconi's US 763,772 treated tuned coupled circuits as his radio system.",
        conflictDetails:
          "Marconi Wireless v. United States, 320 U.S. 1 (1943), found Tesla (and Lodge, and Stone) had already taught the resonant coupling. Some Marconi claims fell. Radio as a business did not change hands.",
        resolution:
          "Tesla's coil patents are prior art for RF transformers. They are not, by themselves, a complete radio system.",
        legalOutcome:
          "Credit split. Tesla fans over-read 1943; radio engineers still start from the coupled-circuit chapter.",
      },
    ],
    civilizationalImpact:
      "Every tuned RF stage, from a crystal set to a klystron cavity, is two resonators talking. Tesla's coil is the theatrical version of that page.",
    funFact:
      "The 1899 Colorado Springs photographs of 130-foot discharges are real experiments and also publicity. He did light bulbs at a distance; he did not replace the grid.",
    aftermath:
      "Wardenclyffe failed for money, not for a missing equation. Tesla died in 1943, months before the Supreme Court opinion that his advocates treat as vindication.",
    sideNotes: [
      "US 533,367 (1895) is the coil. US 645,576 (1900) is the more important radio-tuning companion.",
      "Medical 'violet ray' wands and later neon-sign transformers are domesticated cousins, not cosmic power stations.",
    ],
  },
  tags: [
    "Nikola Tesla",
    "Tesla Coil",
    "Resonance",
    "High Voltage",
    "Electromagnetics",
    "Wireless Power",
  ],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
    patentWarYears: "1894–1943",
    impactScore: 99,
  },
};
