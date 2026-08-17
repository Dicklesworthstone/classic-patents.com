import type { Patent } from "@/types/patent";

export const marconiRadioPatent: Patent = {
  id: "us-586193-marconi-radio",
  patentNumber: "US 586,193",
  title: "Transmitting Electrical Impulses and Signals, and an Apparatus Therefor",
  shortTitle: "Marconi Wireless Radio Telegraphy",
  subtitle: "Elevated Monopole Antenna, Earth Grounding, and Tuned RF Spark Transmission",
  inventors: ["Guglielmo Marconi"],
  inventorLocation: "London, England",
  grantDate: "1897-07-13",
  filingDate: "1896-12-07",
  era: "Electrification & Early Modern (1870–1920)",
  category: "telecom",
  categoryLabel: "Telecommunications & RF Electromagnetism",
  summary:
    "The world's first patent for wireless communication: Guglielmo Marconi's breakthrough system combining an elevated aerial antenna, an Earth ground plate, an optimized Righi spark gap, and an automated decohering receiver to transmit electromagnetic Morse signals across long distances without wires.",
  heroQuote:
    "Be it known that I, Guglielmo Marconi, of London, England, have invented certain new and useful Improvements in Transmitting Electrical Impulses and Signals, and in Apparatus therefor...",
  originalPdfUrl: "/patents/pdfs/us-586193-marconi-radio.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US586193A/en",
  usptoClassification: "H04B 1/02 (Radio transmitters)",
  originalText: `UNITED STATES PATENT OFFICE.
GUGLIELMO MARCONI, OF LONDON, ENGLAND.

TRANSMITTING ELECTRICAL IMPULSES AND SIGNALS, AND AN APPARATUS THEREFOR.

SPECIFICATION forming part of Letters Patent No. 586,193, dated July 13, 1897.
Application filed December 7, 1896. Serial No. 614,838. (No model.) Patented in England June 2, 1896, No. 12,039.

To all whom it may concern:
Be it known that I, GUGLIELMO MARCONI, a subject of the King of Italy, residing at London, England, have invented certain new and useful Improvements in Transmitting Electrical Impulses and Signals, and in Apparatus therefor, of which the following is a specification.

This invention relates to the transmission of electrical signals through space by means of electromagnetic oscillations of high frequency, without the use of connecting wires.

According to this invention, electrical signals, messages, or impulses are transmitted by producing oscillations of high frequency in a transmitter, which oscillations are radiated into space and act upon a distant receiver tuned or adapted to respond to the said oscillations.

At the transmitting station I employ an induction coil or high-voltage transformer, the secondary terminals of which are connected to a spark gap consisting of four brass spheres immersed in vaseline oil (the Righi spark gap). One of the outer spark-gap spheres is connected to an elevated aerial conductor or plate mounted high upon a mast, while the other outer sphere is connected to an earth ground plate buried in the soil.

When the transmitting key is depressed, high-frequency oscillatory electric sparks discharge across the gap, generating high-frequency electromagnetic waves that are launched from the elevated aerial into the ether, traveling through the atmosphere and ground.

At the receiving station I employ an elevated aerial conductor and earth ground plate connected to the terminals of an improved sensitive detector or coherer. The coherer consists of a small glass tube exhausted of air, containing two silver plugs separated by a narrow gap filled with a fine mixture of nickel and silver filings.

Under normal conditions the metallic filings offer high electrical resistance. When the electromagnetic waves from the transmitter strike the receiving aerial, high-frequency oscillatory currents are induced, causing the filings in the coherer to cohere or cling together, instantly dropping their electrical resistance from thousands of ohms to a few ohms.

This sudden decrease in resistance allows current from a local battery to flow through a relay, which actuates a Morse sounder or paper tape register to record the signal, and simultaneously triggers an electromechanical tapper or trembler that lightly taps the glass tube of the coherer, shaking the filings apart (decohering them) so that the tube is restored to its high-resistance state ready to receive the next dot or dash.

Referring to the drawings:
Figure 1 is a diagrammatic view of the complete transmitting apparatus with elevated aerial and earth ground.
Figure 2 is a diagrammatic view of the receiving station showing aerial, coherer, relay, Morse sounder, and automatic decohering tapper.
Figure 3 is a detailed sectional view of the Righi spark gap.
Figure 4 is a longitudinal sectional view of the evacuated sensitive tube (coherer).`,
  plainEnglishExplanation: {
    overview:
      "Heinrich Hertz proved the existence of electromagnetic radio waves in 1887, but scientists across Europe considered Hertzian waves a laboratory curiosity limited to a few yards. Twenty-one-year-old Guglielmo Marconi made the critical engineering breakthroughs that turned electromagnetic radiation into a global communication network: he added an elevated aerial antenna to launch waves into the air, grounded the base in the Earth to create a quarter-wave monopole, and designed an automated decohering receiver to print Morse code signals sent through thin air.",
    coreMechanism:
      "High voltage from an induction coil discharges across a spark gap connected between an elevated wire antenna and an Earth ground plate. The rapid discharge excites resonant radio-frequency oscillations ($100\\text{ kHz to }1\\text{ MHz}$) in the antenna, radiating toroidal electromagnetic waves ($E \\times B$) into the ether. At the receiving antenna, the incoming radio waves induce microvolt currents that cause conductive metal filings in a glass coherer to fuse together, completing a circuit to ring a telegraph bell or print Morse code.",
    mechanicalBreakdown: [
      {
        title: "Elevated Monopole Aerial & Grounding",
        summary:
          "A vertical wire hoisted high on a mast with the lower terminal grounded in the Earth.",
        technicalDetails:
          "Formed an asymmetric quarter-wave monopole antenna ($\\lambda / 4$). Earth ground acts as an electrical mirror, creating a virtual dipole that doubles the effective radiating aperture and increases radiated power ($P_{rad} \\propto (h/\\lambda)^2$).",
        archaicTerm: "Elevated conductor / Earth connection",
        modernEquivalent: "Grounded vertical monopole antenna",
      },
      {
        title: "Evacuated Nickel-Silver Filings Coherer",
        summary: "A vacuum glass tube with silver electrodes separated by metal dust.",
        technicalDetails:
          "High-frequency radio currents cause micro-welding between adjacent metal particles via quantum tunneling and field emission, dropping resistance from $100\\,\\text{k}\\Omega$ to $500\\,\\Omega$.",
        archaicTerm: "Sensitive tube / Coherer",
        modernEquivalent: "RF threshold detector / Demodulator",
      },
      {
        title: "Electromechanical Decohering Tapper",
        summary: "A vibrating hammer that taps the glass tube after each signal.",
        technicalDetails:
          "Mechanically dislodges the cohered metal filings, restoring high resistance within milliseconds so the receiver can detect the next incoming Morse dot or dash.",
        archaicTerm: "Decohering tapper / Trembler",
        modernEquivalent: "Automated reset circuit / Quencher",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Maxwell-Hertz Electromagnetic Wave Radiation",
        formula:
          "\\vec{S} = \\frac{1}{\\mu_0} (\\vec{E} \\times \\vec{B}), \\quad P_{rad} = \\frac{2}{3} \\frac{\\mu_0 q^2 \\omega^4}{4\\pi c}",
        explanation:
          "Accelerating electrons in the elevated aerial radiate transverse electromagnetic waves propagating at the speed of light (c = 300,000 km/s).",
      },
      {
        principle: "Antenna Radiation Resistance & Height Scaling",
        formula: "R_{rad} = 40 \\pi^2 \\left(\\frac{h}{\\lambda}\\right)^2, \\quad D \\propto h^2",
        explanation:
          "Marconi's empirical law: doubling antenna height h quadruples transmission distance D by increasing radiation resistance and lowering ground absorption.",
      },
    ],
    whyItMattersToday:
      "Marconi's patent was the foundation of all wireless technology—AM/FM radio, television broadcasting, radar, cellular networks, Wi-Fi, GPS navigation, and satellite communications.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination of a transmitter capable of producing electrical oscillations of high frequency, an elevated conductor connected thereto, an earth connection, a distant receiver containing a sensitive tube, and an elevated conductor and earth connection connected to said receiver, substantially as described.",
      plainEnglish:
        "The master system claim covering wireless telegraphy using elevated antennas and earth ground connections at both the transmitter and receiver.",
      keyInnovations: [
        "Elevated aerial antenna",
        "Earth grounding system",
        "Complete wireless transmission architecture",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "In an apparatus for transmitting electrical impulses, the combination, with a spark-gap, of an elevated aerial conductor connected to one terminal and an earth plate connected to the other terminal, substantially as described.",
      plainEnglish: "Covers the quarter-wave monopole transmitting antenna architecture.",
      keyInnovations: [
        "Monopole transmitter geometry",
        "Earth-mirrored radiation",
        "High-frequency spark excitation",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Marconi Aerial Wireless Transmitter",
      caption:
        "Schematic diagram showing high-voltage induction coil, Morse key, Righi spark gap, elevated aerial mast, and buried Earth ground plate.",
      svgType: "marconi-radio",
      callouts: [
        {
          id: "mr-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Elevated Monopole Aerial",
          description:
            "Vertical wire antenna suspended from mast to radiate electromagnetic waves.",
          x: 75,
          y: 20,
        },
        {
          id: "mr-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Righi 4-Sphere Spark Gap",
          description: "Brass spheres discharging high-frequency oscillatory electric sparks.",
          x: 40,
          y: 65,
        },
        {
          id: "mr-3",
          figureRef: "Fig. 1",
          label: "E",
          element: "Buried Earth Ground Plate",
          description: "Copper plate in moist soil creating electrical ground plane mirror.",
          x: 75,
          y: 85,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Once a ship dropped below the horizon it was mute. Hertz had shown sparks make waves; Lodge and Righi had tabletop range. Nobody had a coastal station that a liner could raise in weather.",
    priorArtLimitations: [
      "Hertzian dipoles radiated a few yards.",
      "No elevated aerial plus earth return, so little radiated power.",
      "Untuned spark systems splattered across the band and jammed each other.",
    ],
    breakthroughInsight:
      "At Pontecchio in 1895 Marconi put one terminal on a high wire and the other in the soil. Range jumped from garden to hill. The earth is the other half of the monopole; that is the cheap trick in US 586,193.",
    patentWars: [
      {
        rivalName: "Oliver Lodge, and later Tesla",
        rivalClaim:
          "Lodge had shown syntony (tuning). Tesla's 1897 US 645,576 covered resonant coupled circuits. Both said Marconi's system used their oscillators.",
        conflictDetails:
          "Marconi Wireless Tel. Co. v. United States, 320 U.S. 1 (1943), decided during a wartime government-contract fight, credited Tesla, Stone, and Lodge with key tuning ideas and knocked out some Marconi claims. It did not un-build the Marconi stations.",
        resolution:
          "Marconi shared the 1909 Nobel with Karl Ferdinand Braun. The company, not the 1943 opinion, had already wired the shipping lanes.",
        legalOutcome:
          "A split credit: Marconi for the working long-range system, others for tuning. Popular histories that crown a single inventor are doing PR.",
      },
    ],
    civilizationalImpact:
      "Titanic's 1912 distress traffic (705 people off in boats) is the example every textbook uses. The quieter fact is scheduled ship news and storm warnings, day after day.",
    funFact:
      "12 December 1901, Poldhu to Signal Hill, Newfoundland: Marconi reported the Morse letter S, three dots, across the Atlantic. Skeptics still argue about atmospheric noise versus a real signal. He bet the company on it either way.",
    aftermath:
      "Marconi became an Italian senator and, later, a fascist-era public figure. The wireless firm was absorbed into what became part of GEC/Marconi. The 1943 Supreme Court case is still cited more by Tesla fans than by radio engineers.",
    sideNotes: [
      "Braun's crystal detector and tuned circuits are why the Nobel was shared.",
      "The 1901 transatlantic test used a kite-supported aerial at St. John's and a huge spark at Poldhu. It was not a pocket set.",
    ],
  },
};
