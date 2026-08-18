import type { Patent } from "@/types/patent";

export const teslaCoilPatent: Patent = {
  id: "us-533367-tesla-coil",
  patentNumber: "US 533,367",
  title: "Electrical Transformer",
  shortTitle: "Tesla's High-Frequency Resonant Transformer",
  subtitle:
    "Air-Core Tuned Resonant Induction Coils for High-Voltage and Radio-Frequency Electromagnetics",
  inventors: ["Nikola Tesla"],
  inventorLocation: "New York, N.Y.",
  grantDate: "1895-02-06",
  filingDate: "1894-01-18",
  era: "Electrification Era (1880–1900)",
  category: "electricity",
  categoryLabel: "High-Frequency Electromagnetics",
  summary:
    "Tesla's air-core resonant transformer discarded heavy iron cores to achieve extreme radio frequencies. By coupling two loosely coupled LC circuits tuned to the identical natural resonant frequency f_0, energy sloshes coherently into the high-inductance secondary winding, stepping input potentials up to millions of volts with massive ionizing streamer discharges.",
  heroQuote:
    "The presence of iron is not only unnecessary but detrimental, owing to hysteresis and eddy current losses... by properly proportioning the self-induction and capacity of the primary and secondary circuits, so that the period of oscillation of the secondary is identical with that of the primary, extraordinarily high potentials may be obtained.",
  originalPdfUrl: "/patents/pdfs/us-533367-tesla-coil.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US533367A/en",
  usptoClassification: "H01F 38/00 (Transformers; resonant coils)",
  originalText: `UNITED STATES PATENT OFFICE.
NIKOLA TESLA, OF NEW YORK, N. Y.

ELECTRICAL TRANSFORMER.

SPECIFICATION forming part of Letters Patent No. 533,367, dated February 6, 1895.
Application filed January 18, 1894. Serial No. 497,291. (No model.)

To all whom it may concern:
Be it known that I, NIKOLA TESLA, a citizen of the United States, residing at New York, in the County and State of New York, have invented certain new and useful Improvements in Electrical Transformers, of which the following is a specification, reference being had to the drawings accompanying and forming a part of the same.

The present invention relates to transformers or coils employed in systems for the generation and utilization of electrical currents of high potential and high frequency, such as are produced by disruptive discharge from condensers or analogous sources.

In the transformation of electrical currents of ordinary frequencies, such as are utilized for industrial lighting and power distribution, closed or open magnetic circuits of soft iron are universally used to enhance mutual induction between primary and secondary windings. But when currents of very high frequency and rapid rate of change are employed, the presence of an iron core becomes highly disadvantageous, introducing severe power dissipation through magnetic hysteresis and eddy currents, while the high self-induction of iron-cored coils impedes the free oscillation of high-frequency discharges.

To obviate these difficulties, I construct electrical transformers entirely without iron cores, relying upon mutual induction through air or insulating media such as mineral oil. In order to obtain very high potentials with high efficiency and without dielectric breakdown, I construct the primary and secondary circuits with such values of self-induction and capacity that their natural periods of electrical oscillation are identically matched, creating true electrical resonance between the primary disruptive tank circuit and the secondary high-potential resonator.

Furthermore, to withstand the enormous electrostatic stresses developed near the high-potential extremity of the secondary coil without flashover to the primary or between adjacent turns, I wind the secondary winding upon a conical or tapered insulating support. The turns of lowest potential are placed at the wide base adjacent to the primary, while the turns of highest potential converge toward the apex, maximizing spatial clearance and dielectric separation where the potential difference is greatest.`,
  plainEnglishExplanation: {
    overview:
      "Before Nikola Tesla, electrical transformers relied on heavy iron cores to couple primary and secondary coils. While effective at grid frequencies (50–60 Hz), iron cores suffer catastrophic hysteresis heating ($P_{hyst} \\propto f B^{1.6}$) and eddy-current losses at radio frequencies. Tesla revolutionized electromagnetics by removing the iron entirely and inventing the dual-tuned air-core resonant transformer. By matching the electrical resonant frequency of a primary capacitor spark discharge to the quarter-wave resonance of a conical secondary coil, voltage multiplies up to millions of volts, generating radiant high-frequency fields and ionized Townsend plasma streamers.",
    coreMechanism:
      "A primary tank capacitor ($C_p$) is charged to several thousand volts by a mains step-up transformer and rapidly discharged across an air spark gap through a low-inductance primary coil ($L_p$). The resulting damped radio-frequency magnetic pulse oscillates at $f_0 = 1/(2\\pi\\sqrt{L_p C_p})$. This magnetic flux loosely couples ($k \\approx 0.1-0.2$) into an adjacent high-inductance secondary coil ($L_s, C_s$) tuned to the identical natural frequency. Over several successive RF cycles, energy sloshes coherently into the secondary resonator, magnifying the voltage by $\\sqrt{L_s/L_p} \\cdot Q$ until the air at the top toroidal terminal breaks down in spectacular branching lightning streamers.",
    mechanicalBreakdown: [
      {
        title: "Disruptive Spark Gap Interrupter",
        summary: "A high-speed quenching spark gap in series with the primary capacitor.",
        technicalDetails:
          "Acts as a non-linear fast plasma switch. When capacitor voltage reaches the breakdown threshold ($V_{bd}$), avalanche ionization creates an ultra-low-resistance conductive arc in nanoseconds ($dI/dt > 10^9\\text{ A/s}$), initiating damped RF oscillations.",
        archaicTerm: "Disruptive discharge gap",
        modernEquivalent: "Rotary or static high-power spark gap switch",
      },
      {
        title: "Primary LC Tank Oscillator",
        summary: "Heavy copper tubing primary winding paired with high-voltage capacitance.",
        technicalDetails:
          "Low inductance ($L_p \\approx 5-25\\ \\mu\\text{H}$) and low series resistance ($R_p < 0.05\\ \\Omega$) ensure minimal ohmic damping and high surge current ($I_{peak} > 500\\text{ A}$) at frequencies from 50 kHz to 2 MHz.",
        archaicTerm: "Primary coil of low self-induction",
        modernEquivalent: "Primary tuned LC tank oscillator",
      },
      {
        title: "Conical Graded Secondary Resonator",
        summary: "Tapered winding spacing that increases insulation distance as potential climbs.",
        technicalDetails:
          "Winding on a conical bobbin separates high-voltage top turns ($V > 500\\text{ kV}$) from the primary ground and adjacent turns, preventing flashover punctures through air ($E_{breakdown} \\approx 3\\times 10^6\\text{ V/m}$).",
        archaicTerm: "Conical or tapered insulating spool",
        modernEquivalent: "Spatially graded dielectric helical resonator",
      },
      {
        title: "Topload Capacitive Terminal",
        summary: "A smooth metallic sphere or toroid mounted atop the secondary coil.",
        technicalDetails:
          "Provides isotropic capacitance ($C_{top} = 4\\pi \\varepsilon_0 R$) that lowers the secondary resonant frequency, increases stored electrostatic energy ($U = \\frac{1}{2} C V^2$), and suppresses premature corona discharge until peak voltage is achieved.",
        archaicTerm: "Elevated terminal of large radius",
        modernEquivalent: "Toroidal electrostatic topload accumulator",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Dual-Tuned LC Resonant Synchronization",
        formula:
          "f_0 = \\frac{1}{2\\pi \\sqrt{L_p C_p}} = \\frac{1}{2\\pi \\sqrt{L_s (C_s + C_{top})}}",
        explanation:
          "Resonant energy transfer requires exact frequency alignment between the primary tank oscillator and secondary helical resonator. When tuned to identical frequencies, magnetic pulses from the primary pump the secondary in phase, coherently amplifying the wave.",
      },
      {
        principle: "Energy Conservation & Inductive Voltage Step-Up",
        formula:
          "V_{sec} = V_{pri} \\cdot \\sqrt{\\frac{L_s}{L_p}} = V_{pri} \\cdot \\sqrt{\\frac{C_p}{C_s}}",
        explanation:
          "Because the transformer is resonant rather than iron-flux coupled, the voltage ratio is determined by the conservation of stored electrostatic energy ($\\frac{1}{2} C_p V_{pri}^2 = \\frac{1}{2} C_s V_{sec}^2$) rather than the turns ratio alone.",
      },
      {
        principle: "Resonant Quality Factor (Q) & Voltage Magnification",
        formula:
          "Q = \\frac{\\omega_0 L_s}{R_s} = \\frac{1}{R_s}\\sqrt{\\frac{L_s}{C_s}}, \\quad V_{top} = Q \\cdot V_{induced}",
        explanation:
          "High secondary quality factor ($Q > 200$) minimizes internal resistive damping, allowing the voltage at the top terminal to build to hundreds of times the inductively coupled base voltage.",
      },
      {
        principle: "Paschen's Law & Dielectric Ionization Breakdown",
        formula:
          "V_B = \\frac{B \\cdot p \\cdot d}{\\ln(A \\cdot p \\cdot d) - \\ln\\left[\\ln\\left(1 + \\frac{1}{\\gamma_{se}}\\right)\\right]}",
        explanation:
          "When the local electric field at the terminal perimeter exceeds ambient air dielectric breakdown ($E > 30\\text{ kV/cm}$), avalanche electron multiplication ionizes nitrogen and oxygen, creating branching plasma discharge channels.",
      },
      {
        principle: "Loose Inductive Coupling & Beat-Envelope Energy Transfer",
        formula:
          "k = \\frac{M}{\\sqrt{L_p L_s}} \\approx 0.10 - 0.20, \\quad \\Delta t_{transfer} = \\frac{\\pi}{\\omega_0 k}",
        explanation:
          "Loose magnetic coupling ($k < 0.2$) prevents catastrophic primary arc re-ignition while allowing 100% of the primary tank energy to transfer into the secondary over a finite packet of beat cycles.",
      },
    ],
    whyItMattersToday:
      "Every modern radio-frequency transmitter, MRI magnetic resonance scanner, wireless charging pad (Qi inductive resonant standard), and semiconductor plasma etching reactor relies on the principles of coupled-resonator impedance matching and air-core resonant transformers pioneered in Tesla's 1895 patent.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The improvement in the method of electrical transformation consisting in passing high-frequency currents through a primary coil of low resistance and self-induction and inducing thereby currents in a secondary coil having a greater number of convolutions and adjusted to be in resonance with the primary circuit, substantially as set forth.",
      plainEnglish:
        "The foundational method claim establishing high-frequency resonant electrical transformation: passing high-frequency oscillations through a low-inductance primary to induce resonant voltage step-up in a secondary coil tuned to the exact same frequency.",
      keyInnovations: [
        "Air-core ironless transformer architecture",
        "Matched LC primary-secondary resonance",
        "High-voltage standing-wave amplification",
      ],
      legalSignificance:
        "Master claim that defined resonant inductive energy transfer in electrical patent law, later cited as pivotal prior art against Marconi's radio tuning claims.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In an electrical transformer for high frequencies, the combination with a primary coil of a secondary coil wound upon a tapered or conical insulating support, substantially as described.",
      plainEnglish:
        "A resonant transformer apparatus where the secondary coil is wound on a conical or tapered frame so that the high-voltage turns at the top are physically separated and insulated from the base primary turns.",
      keyInnovations: [
        "Conical dielectric geometry",
        "Spatial potential gradient management",
        "Internal arc-over prevention",
      ],
      legalSignificance:
        "Protected the mechanical and geometrical innovations required to prevent high-voltage coil self-destruction under megavolt electrostatic stress.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In an electrical transformer, the combination with a primary circuit comprising a condenser and disruptive discharge device, of an open-core secondary circuit tuned to electrical resonance with said primary circuit, substantially as set forth.",
      plainEnglish:
        "The complete high-frequency oscillator system comprising a primary capacitor, spark gap switch, and ironless secondary coil tuned in harmonic resonance.",
      keyInnovations: [
        "Disruptive spark gap tank integration",
        "Harmonic tuning of primary and secondary circuits",
        "Continuous high-potential RF wave generation",
      ],
      legalSignificance:
        "Broadly covered the complete architecture of spark-gap radio-frequency oscillators and transmitters.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Elevation & Partial Section of Conical Resonant Transformer",
      caption:
        "Patent blueprint showing the heavy primary winding at the wide base and the conical secondary winding tapering toward the high-voltage apex.",
      svgType: "tesla-coil",
      callouts: [
        {
          id: "tc-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Primary Inductor Winding",
          description:
            "Heavy copper ribbon primary winding with minimal turns for low self-induction.",
          x: 25,
          y: 75,
        },
        {
          id: "tc-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Conical Secondary Resonator",
          description:
            "Tapered insulating frame carrying fine wire secondary turns with increasing spacing toward top.",
          x: 50,
          y: 45,
        },
        {
          id: "tc-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Insulating Base Frame",
          description: "Heavy hardwood or ebonite insulating platform supporting the transformer.",
          x: 50,
          y: 88,
        },
        {
          id: "tc-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "High-Potential Apex Terminal",
          description:
            "Top discharge point where standing-wave potential reaches maximum amplitude.",
          x: 50,
          y: 12,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Plan View of Primary and Secondary Coil Arrangement",
      caption:
        "Top-down schematic view illustrating the concentric alignment of the low-turn primary coil around the conical base of the secondary resonator.",
      svgType: "tesla-coil",
      callouts: [
        {
          id: "tc-5",
          figureRef: "Fig. 2",
          label: "E",
          element: "Primary Outer Ring",
          description:
            "Outer circumference primary conductor providing uniform magnetic excitation.",
          x: 50,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1890s, high-voltage generation relied on Ruhmkorff induction coils equipped with vibrating mechanical interrupters. When scientists attempted to increase operating frequency to study Hertzian electromagnetic waves, standard iron-core transformers overheated rapidly from magnetic hysteresis and eddy currents, and insulation punctured under electrostatic spikes.",
    priorArtLimitations: [
      "Closed iron-core transformers (Gaulard-Gibbs, Zipernowsky) suffered catastrophic core losses ($P \\propto f B^{1.6}$) above a few hundred hertz.",
      "Ruhmkorff induction coils had high internal resistance and uncoordinated secondary self-capacitance, preventing true resonant standing-wave formation.",
      "High dielectric stress between tightly wound cylindrical layers caused immediate internal insulation carbonization and fire.",
    ],
    breakthroughInsight:
      "Tesla recognized that mutual induction could occur entirely through air without iron if the primary and secondary were tuned into precise electrical resonance ($f = 1/(2\\pi\\sqrt{LC})$). By grading the secondary coil on a cone, he placed the high-potential apex far from ground, allowing voltages to multiply into millions of volts without breakdown.",
    patentWars: [
      {
        rivalName: "Guglielmo Marconi (Four-Circuit Tuning Patent)",
        rivalClaim:
          "Marconi filed US Patent No. 763,772 in 1900 claiming the fundamental system of tuned coupled radio transmitters and receivers.",
        conflictDetails:
          "Tesla had already patented tuned coupled resonant circuits in US 533,367 (1895) and US 645,576 / 649,621 (1897). The USPTO initially rejected Marconi's application for years citing Tesla's prior art, but reversed its decision in 1904 following heavy commercial pressure.",
        resolution:
          "In 1943, the United States Supreme Court (Marconi Wireless Telegraph Co. of America v. United States, 320 U.S. 1) officially invalidated Marconi's key tuning patent claims, holding that Nikola Tesla, Oliver Lodge, and John Stone Stone had fully anticipated the invention of tuned resonant radio circuits.",
        legalOutcome:
          "Nikola Tesla was formally restored by the Supreme Court as the true pioneer of tuned resonant high-frequency transmission.",
      },
    ],
    civilizationalImpact:
      "Tesla's resonant transformer gave birth to radio communications, spark-gap transmitters, vacuum tube oscillators, neon lighting, particle accelerators, and modern wireless power transfer. The mathematical principles of coupled LC resonance form the backbone of modern RF engineering.",
    funFact:
      "During his 1899 Colorado Springs experiments, Tesla built a 52-foot diameter magnifying transmitter that produced 130-foot artificial lightning bolts, drew so much power that it burned out the dynamo at the El Paso Electric Company, and sent high-frequency ground currents that lit light bulbs wirelessly over a mile away.",
    aftermath:
      "Tesla dreamed of using massive resonant towers (such as Wardenclyffe Tower in Shoreham, New York) to transmit electrical power wirelessly across the globe without wires. While worldwide wireless power proved economically impractical due to inverse-square radiative spreading, his resonant circuits became the universal foundation of all 20th-century wireless communications.",
    sideNotes: [
      "Tesla demonstrated cold corona discharges where high-frequency megavolt currents flowed across his skin and body safely due to the RF 'skin effect' ($d = \\sqrt{2/\\omega \\mu \\sigma}$).",
      "Modern Tesla coils frequently use solid-state IGBT transistors (SSTC / DRSSTC) switching in phase-locked loops, achieving the same resonant magnification with microsecond precision.",
    ],
  },
  tags: [
    "Nikola Tesla",
    "Tesla Coil",
    "Resonant Transformer",
    "High Frequency",
    "Electromagnetics",
    "Wireless Telegraphy",
    "Plasma Physics",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1894–1943",
    impactScore: 99,
  },
};
