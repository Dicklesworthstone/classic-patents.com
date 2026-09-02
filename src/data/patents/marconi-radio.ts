import {
  marconiRadioArchivalEdition,
  marconiRadioClaimText,
} from "@/data/editions/marconiRadioEdition";
import type { Patent } from "@/types/patent";

// Preserved legacy research state. It was not transcribed from the pinned PDF
// and is deliberately not exported or used by the catalogue.
const _legacyMarconiRadioResearch: Patent = {
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
    "The Genesis of Wireless Global Telecommunications: On July 13, 1897, Guglielmo Marconi was granted US Patent No. 586,193 for wireless radio telegraphy. While Heinrich Hertz had discovered electromagnetic waves in 1887, they were confined to laboratory tables. Marconi achieved the breakthrough of practical long-distance wireless communication by connecting one spark terminal to an elevated aerial wire and the other to an Earth ground plate. The Earth acted as an electromagnetic ground-plane mirror, creating a quarter-wave monopole antenna that launched ground-wave and sky-wave radio signals across oceans and continents.",
  heroQuote:
    "Be it known that I, Guglielmo Marconi, of London, England, have invented certain new and useful Improvements in Transmitting Electrical Impulses and Signals, and in Apparatus therefor...",
  originalPdfUrl: "/patents/pdfs/us-586193-marconi-radio.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US586193A/en",
  usptoClassification: "H04B 1/02 (Radio transmitters)",
  archivalEdition: marconiRadioArchivalEdition,
  originalTextAsset: {
    url: "/patents/source-text/us-586193-marconi-radio.txt",
    pageCount: 11,
    kind: "source-pdf-text-layer",
  },
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
      "In 1887, German physicist Heinrich Hertz proved James Clerk Maxwell's theory that electromagnetic waves travel through space at the speed of light. However, European physicists viewed radio waves purely as a tabletop laboratory curiosity with a transmission range of only a few meters. In 1895, twenty-one-year-old Italian inventor Guglielmo Marconi made the critical leap: he elevated a wire antenna high above the ground on a mast and buried a metal plate in the earth. Grounding the transmitter turned the Earth into an electrical reflector, creating a monopole antenna that launched long-wavelength radio waves capable of traveling around the curvature of the Earth for thousands of miles.",
    coreMechanism:
      "When the Morse telegraph key is pressed, an induction coil charges the capacitance of the elevated aerial mast to over 50,000 volts relative to the Earth ground plate. When the voltage breaks down the dielectric oil in the Righi spark gap, a violent high-frequency oscillatory discharge erupts. This drives a powerful RF alternating current ($I_0$) up and down the vertical aerial, radiating intense electromagnetic Poynting flux ($\\vec{S} = \\frac{1}{\\mu_0}\\vec{E}\\times\\vec{B}$) into space. At the receiving station, the incoming radio wave induces microvolt oscillations in an identical aerial, triggering quantum electron tunneling across nickel-silver filings in a vacuum coherer tube to drop its resistance from $100\\,\\text{k}\\Omega$ to $500\\,\\Omega$, activating a local Morse register. An electromechanical trembler immediately taps the glass tube to decohere the filings for the next pulse.",
    mechanicalBreakdown: [
      {
        title: "Elevated Monopole Aerial & Grounding System",
        summary:
          "A vertical copper wire hoisted high on a wooden mast with the base grounded in the Earth.",
        technicalDetails:
          "Forms an asymmetric quarter-wave monopole antenna ($\\lambda / 4$). The conducting Earth acts as an electromagnetic ground-plane mirror, creating a virtual dipole image below the surface that doubles radiation resistance ($R_{rad} = 36.5\\,\\Omega$) and maximizes vertically polarized ground-wave propagation.",
        archaicTerm: "Elevated conductor / Earth connection",
        modernEquivalent: "Grounded vertical quarter-wave monopole antenna",
      },
      {
        title: "Righi 4-Sphere Oil-Immersed Spark Gap",
        summary: "Solid brass spheres immersed in vaseline oil to sharpen spark discharge.",
        technicalDetails:
          "The oil dielectric quenches the initial arc rapidly, generating ultra-steep wavefronts ($dV/dt > 10^{11}\\text{ V/s}$) and preventing energy dissipation in useless low-frequency arcs, maximizing RF spark oscillation efficiency.",
        archaicTerm: "Righi spark-gap in oil vessel",
        modernEquivalent: "Quenched spark-gap RF pulse oscillator",
      },
      {
        title: "Evacuated Nickel-Silver Filings Coherer",
        summary: "A vacuum glass tube with silver electrodes separated by metal dust.",
        technicalDetails:
          "High-frequency radio currents cause micro-welding between adjacent metal particles via quantum tunneling and electric field breakdown, dropping resistance from $100\\,\\text{k}\\Omega$ to $500\\,\\Omega$.",
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
        principle: "Poynting Vector & Dipole Radiated RF Power",
        formula:
          "\\vec{S} = \\frac{1}{\\mu_0} (\\vec{E} \\times \\vec{B}), \\quad P_{rad} = \\frac{\\pi \\eta_0}{3} \\left(\\frac{I_0 h}{\\lambda}\\right)^2, \\quad \\eta_0 \\approx 377\\,\\Omega",
        explanation:
          "Accelerating charges in the vertical aerial radiate transverse electromagnetic waves where radiant power $P_{rad}$ scales with the square of effective antenna height divided by wavelength.",
      },
      {
        principle: "Quarter-Wave Monopole Image Theory",
        formula:
          "E_{total}(\\theta) = 2 E_0 \\cos\\left(\\frac{\\pi}{2} \\cos\\theta\\right), \\quad R_{rad}^{monopole} = \\frac{1}{2} R_{rad}^{dipole} \\approx 36.5\\,\\Omega",
        explanation:
          "Buried Earth ground creates a virtual electrical mirror image, doubling electric field intensity in the upper hemisphere and launching ground waves along the sea surface.",
      },
      {
        principle: "Marconi Height-Distance Empirical Scaling Law",
        formula: "D_{max} = k \\cdot h_{aerial}^2 \\implies h = c \\sqrt{D}",
        explanation:
          "Marconi proved empirically that doubling mast height quadrupled transmission range by increasing radiation resistance and elevating the antenna above line-of-sight terrain obstacles.",
      },
      {
        principle: "Spark-Gap RLC Damped Waveform Kinetics",
        formula:
          "I(t) = I_0 e^{-\\frac{R}{2L} t} \\sin(\\omega_d t), \\quad \\omega_d = \\sqrt{\\frac{1}{LC} - \\left(\\frac{R}{2L}\\right)^2}",
        explanation:
          "Spark discharge produces damped sinusoidal wave packets whose resonant frequency $f = 1/(2\\pi\\sqrt{LC})$ is determined by the capacitance and inductance of the elevated mast.",
      },
      {
        principle: "Quantum Tunneling & Coherer Filings Breakdown",
        formula:
          "J = \\frac{e^2 V}{h^2 d} \\exp\\left(-\\frac{4\\pi d}{h} \\sqrt{2m \\Phi}\\right)",
        explanation:
          "Induced RF microvolts exceed the dielectric oxide barrier between loose silver particles, causing microscopic metal bridges to form via field emission and quantum tunneling.",
      },
    ],
    whyItMattersToday:
      "Marconi's patent was the foundation of all wireless telecommunications. Every cell phone, Wi-Fi router, GPS receiver, radar installation, and satellite uplink operates on the fundamental principles of electromagnetic radiation from grounded antennas that Marconi patented in 1897. Marconi's wireless system also revolutionized maritime safety, directly saving over 700 lives during the sinking of the *RMS Titanic* in 1912.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination of a transmitter capable of producing electrical oscillations of high frequency, an elevated conductor connected thereto, an earth connection, a distant receiver containing a sensitive tube, and an elevated conductor and earth connection connected to said receiver, substantially as described.",
      plainEnglish:
        "The historic master system claim covering wireless telegraphy using elevated aerial conductors and earth ground connections at both the transmitting and receiving stations.",
      keyInnovations: [
        "Elevated aerial antenna",
        "Earth grounding system",
        "Complete wireless transmission architecture",
      ],
      legalSignificance:
        "The foundational claim of wireless radio communication, establishing the elevated monopole and earth ground plane as essential components for long-range RF propagation.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "In an apparatus for transmitting electrical impulses, the combination, with a spark-gap, of an elevated aerial conductor connected to one terminal and an earth plate connected to the other terminal, substantially as described.",
      plainEnglish:
        "The master transmitter claim covering an RF spark-gap transmitter connected between an elevated aerial mast and a buried ground plate.",
      keyInnovations: [
        "Monopole transmitter geometry",
        "Earth-mirrored radiation",
        "High-frequency spark excitation",
      ],
      legalSignificance:
        "Protected the quarter-wave vertical monopole transmitter used in all early commercial coastal and shipboard radio stations.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Marconi Aerial Wireless Spark Transmitter",
      caption:
        "Schematic diagram showing high-voltage induction coil, Morse telegraph key, Righi spark gap, elevated aerial mast, and buried Earth ground plate.",
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
    {
      figureNumber: "Fig. 2",
      title: "Marconi Receiving Station with Automated Decoherer",
      caption:
        "Circuit schematic showing receiving aerial, nickel-silver vacuum coherer, local battery, telegraph relay, Morse sounder, and electromagnetic trembler tapper.",
      svgType: "marconi-radio",
      callouts: [
        {
          id: "mr-4",
          figureRef: "Fig. 2",
          label: "j",
          element: "Evacuated Coherer Tube",
          description:
            "Glass vacuum tube with silver plugs and nickel-silver filings detecting RF signals.",
          x: 50,
          y: 45,
        },
        {
          id: "mr-5",
          figureRef: "Fig. 2",
          label: "p",
          element: "Electromechanical Tapper",
          description:
            "Trembler hammer vibrating against coherer tube to decohere filings after each pulse.",
          x: 65,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1890s, when an ocean steamship sailed beyond sight of land, it disappeared into total silence for weeks. Transoceanic cables connected fixed continents, but ships at sea, lighthouses, and moving armies had no way to communicate. Heinrich Hertz had demonstrated spark-generated radio waves in 1887, but prominent physicists (including Oliver Lodge and Augusto Righi) concluded that electromagnetic waves were limited to line-of-sight laboratory distances of less than 100 meters.",
    priorArtLimitations: [
      "Hertzian dipole resonators radiated equally in all directions with very low radiation resistance, limiting range to a single room.",
      "Early detectors were ungrounded and lacked sensitivity to detect microvolt RF pulses.",
      "Untuned spark transmitters lacked elevated aerials, so most electromagnetic energy was absorbed by surrounding ground clutter.",
    ],
    breakthroughInsight:
      "In the summer of 1895 at his family's estate in Pontecchio near Bologna, Italy, Marconi connected a vertical wire hoisted high on a pole to one terminal of the spark gap and buried a metal sheet in the ground connected to the other. Instantly, the transmission distance jumped from 30 feet to over two kilometers, passing through hills and obstacles. Marconi discovered that the Earth acts as an electrical mirror, creating an effective dipole twice the physical antenna length and launching ground waves that cling to the Earth's surface.",
    patentWars: [
      {
        rivalName: "Sir Oliver Lodge and Nikola Tesla",
        rivalClaim:
          "Sir Oliver Lodge patented tuned resonant circuits ('syntony') in Britain in 1897. Nikola Tesla patented tuned four-circuit wireless transmission in the US (US 645,576) in 1897 and claimed priority for radio transmission. Both argued Marconi's later 1900 'four-sevens' tuning patent infringed their prior art.",
        conflictDetails:
          "Marconi founded the Wireless Telegraph and Signal Company (later Marconi Company) and established a dominant global monopoly over ship-to-shore radio communications. In *Marconi Wireless Telegraph Co. of America v. United States* (320 U.S. 1, 1943), the US Supreme Court addressed the validity of Marconi's subsequent 1904 US tuning patent No. 763,772.",
        resolution:
          "The Supreme Court ruled in 1943 that Tesla's 1897 patent anticipated Marconi's later tuning claims. However, Marconi's original foundational 1897 patent (US 586,193) for elevated monopole aerials and grounded transmission was never invalidated and stands as the true pioneer patent of practical wireless communication.",
        legalOutcome:
          "Marconi shared the 1909 Nobel Prize in Physics with German physicist Karl Ferdinand Braun for their development of wireless telegraphy.",
      },
    ],
    civilizationalImpact:
      "Marconi's wireless telegraph ended maritime isolation and gave birth to the electronic telecommunications age. On April 14, 1912, when the *RMS Titanic* struck an iceberg in the North Atlantic, Marconi wireless operators Jack Phillips and Harold Bride transmitted the historic 'CQD' and 'SOS' distress calls. The nearby *RMS Carpathia* heard the wireless calls and raced to the scene, rescuing 705 survivors from freezing lifeboats.",
    funFact:
      "On December 12, 1901, Marconi attempted the unthinkable: transmitting a wireless radio signal across the Atlantic Ocean from Poldhu, Cornwall to Signal Hill, St. John's, Newfoundland—a distance of 2,200 miles (3,500 km). Eminent scientists declared it impossible because the curvature of the Earth would block the waves. But at 12:30 PM, Marconi and his assistant George Kemp heard the faint clicks of the Morse code letter 'S' (...). Unknown to science at the time, the radio waves had bounced off the ionosphere—a conducting layer of the upper atmosphere whose existence Marconi accidentally proved!",
    aftermath:
      "Marconi became an international celebrity and industrial titan. His company built coastal radio stations spanning every ocean. Marconi went on to develop shortwave radio, microwave radar, and directional beam antennas before passing away in Rome in 1937. On the day of his funeral, radio stations worldwide observed two minutes of complete radio silence in tribute to the father of wireless.",
    sideNotes: [
      "The Italian government initially rejected Marconi's offer to develop the wireless telegraph, leading his Irish-Italian mother, Annie Jameson (of the Jameson Irish Whiskey family), to take young Guglielmo to London, where the British Post Office quickly backed his invention.",
      "The vacuum coherer tube was replaced in the early 1900s by Karl Ferdinand Braun's crystal diode detector and John Ambrose Fleming's thermionic vacuum diode (Fleming Valve).",
    ],
  },
  tags: [
    "Guglielmo Marconi",
    "Radio",
    "Wireless",
    "Telecommunications",
    "Electromagnetism",
    "Antenna Theory",
    "Titanic",
    "Nobel Prize",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 2,
    patentWarYears: "1897–1943",
    impactScore: 100,
  },
};

const marconiRadioClaimRecords: Patent["claims"] = [
  {
    number: 1,
    isIndependent: true,
    originalText: marconiRadioClaimText(1),
    plainEnglish:
      "Claim 1 requires the imperfect electrical contact itself, its circuit path, and a circuit-powered shaker. It protects a detector-reset combination; an ordinary switch without the shaker, or a shaker not actuated by that circuit, does not supply every stated element.",
    keyInnovations: ["Imperfect electrical contact", "Circuit-actuated contact shaker"],
  },
  {
    number: 2,
    isIndependent: true,
    originalText: marconiRadioClaimText(2),
    plainEnglish:
      "Claim 2 retains Claim 1's contact, current path, and circuit-actuated shake, and additionally requires metallic plates connected to the contact. The plates are an express electrical part, not a decorative enclosure.",
    keyInnovations: ["Contact-connected metallic plates", "Circuit-actuated contact reset"],
  },
  {
    number: 3,
    isIndependent: true,
    originalText: marconiRadioClaimText(3),
    plainEnglish:
      "Claim 3 adds choking-coils to the plated imperfect contact and routes the circuit through both coils and contact before the circuit-powered shake. Its scope is the filtered contact receiver with reset.",
    keyInnovations: ["Contact choking-coils", "Coil-and-contact circuit path"],
  },
  {
    number: 4,
    isIndependent: true,
    originalText: marconiRadioClaimText(4),
    plainEnglish:
      "Claim 4 substitutes a tube containing metallic powder for the bare imperfect contact. The current through that powder must actuate a mechanism that shakes the powder after conduction.",
    keyInnovations: ["Metallic-powder tube", "Powder-current reset"],
  },
  {
    number: 5,
    isIndependent: true,
    originalText: marconiRadioClaimText(5),
    plainEnglish:
      "Claim 5 is the metallic-powder tube with plates electrically connected to its powder, a powder circuit, and a circuit-actuated powder shaker. The plates and automatic reset are both required limits.",
    keyInnovations: ["Powder-connected metallic plates", "Plated coherer reset"],
  },
  {
    number: 6,
    isIndependent: true,
    originalText: marconiRadioClaimText(6),
    plainEnglish:
      "Claim 6 requires the powder tube, powder-connected plates, choking-coils connected to the powder, a circuit through the coils and powder, and a circuit-actuated shaker. It specifically protects suppression of local-circuit loss around the resettable powder detector.",
    keyInnovations: ["Powder choking-coils", "Coil-protected powder path"],
  },
  {
    number: 7,
    isIndependent: true,
    originalText: marconiRadioClaimText(7),
    plainEnglish:
      "Claim 7 changes the active material to a mixture of metallic powders. The combination still requires its powder circuit and a shaker actuated by that circuit, so a mixture alone is not the claimed receiver.",
    keyInnovations: ["Mixed-metal powder filling", "Mixture-current reset"],
  },
  {
    number: 8,
    isIndependent: true,
    originalText: marconiRadioClaimText(8),
    plainEnglish:
      "Claim 8 is the mixed-metal powder tube with metallic plates connected to the powder, the powder circuit, and its circuit-actuated shaker. It makes the plated version of the mixture detector a separate combination.",
    keyInnovations: ["Plated mixed-powder detector", "Circuit-actuated mixture shaker"],
  },
  {
    number: 9,
    isIndependent: true,
    originalText: marconiRadioClaimText(9),
    plainEnglish:
      "Claim 9 adds choking-coils to Claim 8's plated mixed-powder detector and requires current through both coils and powder before shaking. The coil connections, not merely the presence of coils nearby, delimit the claim.",
    keyInnovations: ["Mixed-powder choking-coils", "Coil-and-mixture circuit"],
  },
  {
    number: 10,
    isIndependent: true,
    originalText: marconiRadioClaimText(10),
    plainEnglish:
      "Claim 10 calls for a tube containing metallic powder mixed with mercury, a circuit through that powder, and a circuit-actuated powder shaker. Mercury is a material condition in this otherwise resettable detector combination.",
    keyInnovations: ["Mercury-treated powder", "Mercury-powder reset"],
  },
  {
    number: 11,
    isIndependent: true,
    originalText: marconiRadioClaimText(11),
    plainEnglish:
      "Claim 11 places metallic plates on the mercury-and-powder detector of Claim 10 and keeps the powder circuit and its automatic shaker. All four portions must be present for this stated combination.",
    keyInnovations: ["Plated mercury-powder tube", "Circuit-powered mercury reset"],
  },
  {
    number: 12,
    isIndependent: true,
    originalText: marconiRadioClaimText(12),
    plainEnglish:
      "Claim 12 adds powder-connected choking-coils and requires a circuit through those coils and the mercury-containing powder before the shake. It is the choked, plated mercury-detector version.",
    keyInnovations: ["Mercury-powder choking-coils", "Choked plated mercury detector"],
  },
  {
    number: 13,
    isIndependent: true,
    originalText: marconiRadioClaimText(13),
    plainEnglish:
      "Claim 13 identifies the detector construction more closely: a tube, metallic plugs in it, metallic powder between the plugs, a circuit through plugs and powder, and a circuit-actuated powder shaker.",
    keyInnovations: ["Plug-bounded powder gap", "Plug-and-powder current path"],
  },
  {
    number: 14,
    isIndependent: true,
    originalText: marconiRadioClaimText(14),
    plainEnglish:
      "Claim 14 adds metallic plates connected to the plugs of Claim 13's tube. The legal combination is plugs, intervening powder, plate connections, the plugs-and-powder circuit, and its automatic shake.",
    keyInnovations: ["Plug-connected metallic plates", "Plated plug-gap coherer"],
  },
  {
    number: 15,
    isIndependent: true,
    originalText: marconiRadioClaimText(15),
    plainEnglish:
      "Claim 15 adds choking-coils connected to the plugs and routes the circuit through coils, plugs, and powder before the shake. It protects the fully connected plug-and-powder detector rather than powder in any vessel.",
    keyInnovations: ["Plug choking-coils", "Coil-plug-powder circuit"],
  },
  {
    number: 16,
    isIndependent: true,
    originalText: marconiRadioClaimText(16),
    plainEnglish:
      "Claim 16 uses a mixture of metallic powders between the tube's plugs, then requires a circuit through plugs and powder and a circuit-actuated shaker. It narrows the material but preserves the same reset sequence.",
    keyInnovations: ["Plug-confined mixed powders", "Mixed-powder plug reset"],
  },
  {
    number: 17,
    isIndependent: true,
    originalText: marconiRadioClaimText(17),
    plainEnglish:
      "Claim 17 adds metallic plates connected to the plugs of the mixed-powder plug detector. The claimed current remains through plugs and powder, followed by a circuit-actuated shake.",
    keyInnovations: ["Plated mixed-powder plugs", "Plate-coupled plug detector"],
  },
  {
    number: 18,
    isIndependent: true,
    originalText: marconiRadioClaimText(18),
    plainEnglish:
      "Claim 18 further adds choking-coils connected to the plugs and specifies the circuit through coils, plugs, and mixed powder. It protects that exact filtered resettable geometry.",
    keyInnovations: ["Choked mixed-powder plugs", "Coil-plug-mixture path"],
  },
  {
    number: 19,
    isIndependent: true,
    originalText: marconiRadioClaimText(19),
    plainEnglish:
      "Claim 19 specifies metallic powder and mercury between metallic plugs in a tube, with a plugs-and-powder circuit and a circuit-actuated shaker. The mercury mixture and plug geometry are cumulative conditions.",
    keyInnovations: ["Mercury mixture between plugs", "Mercury plug-gap reset"],
  },
  {
    number: 20,
    isIndependent: true,
    originalText: marconiRadioClaimText(20),
    plainEnglish:
      "Claim 20 adds metallic plates connected to Claim 19's plugs. It covers the mercury plug detector only with its stated plate connections, plugs-and-powder circuit, and circuit-actuated reset.",
    keyInnovations: ["Plated mercury plug detector", "Plate-connected mercury plugs"],
  },
  {
    number: 21,
    isIndependent: true,
    originalText: marconiRadioClaimText(21),
    plainEnglish:
      "Claim 21 adds choking-coils connected to the mercury detector's plugs and the circuit through coils, plugs, and powder. The shaking means remains actuated by that circuit, completing this most specified non-relay detector form.",
    keyInnovations: ["Choked mercury plug assembly", "Coil-plug-mercury reset"],
  },
  {
    number: 22,
    isIndependent: true,
    originalText: marconiRadioClaimText(22),
    plainEnglish:
      "Claim 22 inserts a relay between the imperfect contact's circuit and the shaking mechanism. The contact circuit actuates the relay, and the relay, not that circuit directly, actuates the reset.",
    keyInnovations: ["Contact-actuated relay", "Relay-driven contact shaker"],
  },
  {
    number: 23,
    isIndependent: true,
    originalText: marconiRadioClaimText(23),
    plainEnglish:
      "Claim 23 adds metallic plates to the relay-reset imperfect contact of Claim 22. The relay must be actuated by the contact circuit, then operate the shaker; the plate connection is an additional limitation.",
    keyInnovations: ["Relay-reset plated contact", "Plate-connected contact relay"],
  },
  {
    number: 24,
    isIndependent: true,
    originalText: marconiRadioClaimText(24),
    plainEnglish:
      "Claim 24 adds choking-coils to the plated contact and requires the relay-driving circuit through coils and contact. It protects the filtered contact receiver with relay-separated mechanical reset.",
    keyInnovations: ["Relay-reset contact choking-coils", "Filtered contact relay loop"],
  },
  {
    number: 25,
    isIndependent: true,
    originalText: marconiRadioClaimText(25),
    plainEnglish:
      "Claim 25 is the basic metallic-powder tube receiver with a relay actuated by the powder circuit and a shaker actuated by that relay. It makes the relay a required causal link in the reset.",
    keyInnovations: ["Powder-current relay", "Relay-actuated powder shaker"],
  },
  {
    number: 26,
    isIndependent: true,
    originalText: marconiRadioClaimText(26),
    plainEnglish:
      "Claim 26 adds metallic plates connected to the powder of Claim 25's tube. The powder circuit must actuate a relay, and the relay must actuate the shaker; neither function is optional.",
    keyInnovations: ["Plated powder relay receiver", "Relay-separated powder reset"],
  },
  {
    number: 27,
    isIndependent: true,
    originalText: marconiRadioClaimText(27),
    plainEnglish:
      "Claim 27 adds powder-connected choking-coils and a circuit through coils and powder to the plated relay receiver. The relay provides the stipulated drive for the powder shaker.",
    keyInnovations: ["Choked powder relay receiver", "Coil-powder relay path"],
  },
  {
    number: 28,
    isIndependent: true,
    originalText: marconiRadioClaimText(28),
    plainEnglish:
      "Claim 28 uses a mixture of metallic powders and requires its circuit to actuate a relay that actuates the shaker. The particular mixture and two-stage actuation distinguish this claim from the direct-reset forms.",
    keyInnovations: ["Mixed-powder relay detector", "Relay-driven mixture shaker"],
  },
  {
    number: 29,
    isIndependent: true,
    originalText: marconiRadioClaimText(29),
    plainEnglish:
      "Claim 29 adds metallic plates connected to the mixed powder in Claim 28. It retains the powder circuit to relay and relay to shaker sequence as legal limits.",
    keyInnovations: ["Plated mixed-powder relay", "Relay-controlled plate detector"],
  },
  {
    number: 30,
    isIndependent: true,
    originalText: marconiRadioClaimText(30),
    plainEnglish:
      "Claim 30 adds choking-coils connected to the plated mixed powder and requires the relay-driving path through coils and powder. The relay then shakes the powder, preserving the source's filtering and reset relationship.",
    keyInnovations: ["Choked mixed-powder relay", "Coil-mixture relay circuit"],
  },
  {
    number: 31,
    isIndependent: true,
    originalText: marconiRadioClaimText(31),
    plainEnglish:
      "Claim 31 moves the relay-reset arrangement to a tube containing metallic powder and mercury. A circuit through that material actuates the relay, which in turn shakes the powder.",
    keyInnovations: ["Mercury-powder relay detector", "Relay-reset mercury filling"],
  },
  {
    number: 32,
    isIndependent: true,
    originalText: marconiRadioClaimText(32),
    plainEnglish:
      "Claim 32 adds metallic plates connected to the mercury-and-powder detector and retains the powder-circuit-to-relay-to-shaker sequence. Both the plate connection and relay intermediate are explicit.",
    keyInnovations: ["Plated mercury-powder relay", "Relay-actuated mercury reset"],
  },
  {
    number: 33,
    isIndependent: true,
    originalText: marconiRadioClaimText(33),
    plainEnglish:
      "Claim 33 adds choking-coils connected to the plated mercury powder, with the circuit through coils and powder actuating the relay. The relay must then actuate the powder shaker.",
    keyInnovations: ["Choked mercury-powder relay", "Coil-mercury relay loop"],
  },
  {
    number: 34,
    isIndependent: true,
    originalText: marconiRadioClaimText(34),
    plainEnglish:
      "Claim 34 requires a tube with metallic plugs and metallic powder between them. The plugs-and-powder circuit actuates a relay, and that relay actuates the powder shaker.",
    keyInnovations: ["Plug-gap relay detector", "Relay-reset plug powder"],
  },
  {
    number: 35,
    isIndependent: true,
    originalText: marconiRadioClaimText(35),
    plainEnglish:
      "Claim 35 adds metallic plates connected to the plugs of the relay-reset plug detector. The current still runs through plugs and powder before it can actuate the relay.",
    keyInnovations: ["Plated plug-gap relay", "Plug-plate relay path"],
  },
  {
    number: 36,
    isIndependent: true,
    originalText: marconiRadioClaimText(36),
    plainEnglish:
      "Claim 36 adds choking-coils connected to the plugs and a relay-driving circuit through coils, plugs, and powder. It protects the fully choked, relay-reset metallic-powder plug assembly.",
    keyInnovations: ["Choked plug-gap relay", "Coil-plug-powder relay"],
  },
  {
    number: 37,
    isIndependent: true,
    originalText: marconiRadioClaimText(37),
    plainEnglish:
      "Claim 37 changes the material between the plugs to a mixture of metallic powders. Its circuit must actuate the relay, and the relay must shake the mixture.",
    keyInnovations: ["Mixed-powder plug relay", "Relay-reset powder mixture"],
  },
  {
    number: 38,
    isIndependent: true,
    originalText: marconiRadioClaimText(38),
    plainEnglish:
      "Claim 38 adds metallic plates connected to the plugs of Claim 37's mixed-powder tube. The stated plug-and-powder circuit and relay-driven shaker remain required.",
    keyInnovations: ["Plated mixed-powder plugs relay", "Plate-connected plug relay"],
  },
  {
    number: 39,
    isIndependent: true,
    originalText: marconiRadioClaimText(39),
    plainEnglish:
      "Claim 39 adds choking-coils connected to the plugged mixed-powder detector and requires a circuit through coils, plugs, and powder to actuate the relay. The relay's shaker resets the detector.",
    keyInnovations: ["Choked mixed-plug relay", "Coil-plug-mixture relay"],
  },
  {
    number: 40,
    isIndependent: true,
    originalText: marconiRadioClaimText(40),
    plainEnglish:
      "Claim 40 specifies mercury with metallic powder between the plugs and makes the plugs-and-powder circuit actuate a relay, which actuates the reset. It is the mercury version of the relay plug detector.",
    keyInnovations: ["Mercury plug-gap relay", "Relay-reset mercury plugs"],
  },
  {
    number: 41,
    isIndependent: true,
    originalText: marconiRadioClaimText(41),
    plainEnglish:
      "Claim 41 adds metallic plates connected to Claim 40's plugs. It preserves the mercury powder, plug-and-powder circuit, relay, and relay-actuated shaker as one cumulative combination.",
    keyInnovations: ["Plated mercury plug relay", "Mercury plug plate coupling"],
  },
  {
    number: 42,
    isIndependent: true,
    originalText: marconiRadioClaimText(42),
    plainEnglish:
      "Claim 42 adds choking-coils connected to the plugs and requires the relay-driving path through coils, plugs, and mercury powder. It is the most specified relay-reset detector in this plug-and-mercury series.",
    keyInnovations: ["Choked mercury plug relay", "Coil-plug-mercury relay"],
  },
  {
    number: 43,
    isIndependent: true,
    originalText: marconiRadioClaimText(43),
    plainEnglish:
      "Claim 43 joins stations: a spark-producer has earth at one end and an insulated conductor at the other; an imperfect contact at the receiver likewise has earth and insulated-conductor ends, with a circuit through the contact. It claims this complete grounded contact link, not an antenna in isolation.",
    keyInnovations: ["Grounded spark-producer", "Grounded imperfect-contact receiver"],
  },
  {
    number: 44,
    isIndependent: true,
    originalText: marconiRadioClaimText(44),
    plainEnglish:
      "Claim 44 is Claim 43's two-station grounded contact system plus a circuit-actuated contact shaker. The reset is added at the receiver without removing the required earth and insulated-conductor arrangement.",
    keyInnovations: ["Grounded contact system reset", "Spark-to-contact automatic shaker"],
  },
  {
    number: 45,
    isIndependent: true,
    originalText: marconiRadioClaimText(45),
    plainEnglish:
      "Claim 45 puts choking-coils on each end of the grounded receiver contact and requires the circuit through both coils and contact. It has the transmitter earth and insulated conductor but does not add a reset means.",
    keyInnovations: ["Dual-ended contact choking-coils", "Grounded choked contact receiver"],
  },
  {
    number: 46,
    isIndependent: true,
    originalText: marconiRadioClaimText(46),
    plainEnglish:
      "Claim 46 adds circuit-actuated shaking to Claim 45's grounded, choked imperfect-contact arrangement. The contact, its two coil connections, both station conductors, and the reset are cumulative limits.",
    keyInnovations: ["Grounded choked contact reset", "Two-station coil-contact shaker"],
  },
  {
    number: 47,
    isIndependent: true,
    originalText: marconiRadioClaimText(47),
    plainEnglish:
      "Claim 47 substitutes a metallic-powder tube for the receiver contact in the grounded spark-producer system. It requires earth at one powder end, an insulated conductor at the other, and a circuit through the powder.",
    keyInnovations: ["Grounded powder-tube receiver", "Spark-to-powder station link"],
  },
  {
    number: 48,
    isIndependent: true,
    originalText: marconiRadioClaimText(48),
    plainEnglish:
      "Claim 48 is the grounded spark-to-powder system of Claim 47 with circuit-actuated powder shaking. The earth and insulated-conductor connections remain stated legal elements.",
    keyInnovations: ["Grounded powder detector reset", "Spark-linked powder shaker"],
  },
  {
    number: 49,
    isIndependent: true,
    originalText: marconiRadioClaimText(49),
    plainEnglish:
      "Claim 49 places choking-coils at each end of the grounded powder receiver and specifies a circuit through coils and powder. It covers the two-station choked powder arrangement without a shake mechanism.",
    keyInnovations: ["Dual-ended powder choking-coils", "Grounded choked powder receiver"],
  },
  {
    number: 50,
    isIndependent: true,
    originalText: marconiRadioClaimText(50),
    plainEnglish:
      "Claim 50 adds a circuit-actuated powder shaker to the grounded, dual-choked powder combination. The coils, earth connection, insulated conductor, powder circuit, and reset work together as the claimed system.",
    keyInnovations: ["Grounded choked powder reset", "Two-station powder shaker"],
  },
  {
    number: 51,
    isIndependent: true,
    originalText: marconiRadioClaimText(51),
    plainEnglish:
      "Claim 51 specifies choking-coils and earth connections through condensers at each end of the receiver powder, plus the powder-and-coil circuit and automatic shaker. The condenser-mediated earth path is the distinguishing added electrical structure.",
    keyInnovations: ["Condenser-coupled earth connections", "Choked powder reset with condensers"],
  },
  {
    number: 52,
    isIndependent: true,
    originalText: marconiRadioClaimText(52),
    plainEnglish:
      "Claim 52 requires an imperfect contact, its circuit, an electric trembler that shakes it, and means preventing the trembler's self-induction from affecting the contact. The isolation of the trembler's inductive disturbance is a separate functional limitation.",
    keyInnovations: ["Self-induction isolation", "Electric trembler contact reset"],
  },
  {
    number: 53,
    isIndependent: true,
    originalText: marconiRadioClaimText(53),
    plainEnglish:
      "Claim 53 generalizes the receiver as a variable-resistance medium altered by received oscillations, with a trembler or shaker and control means that restores normal resistance after each reception. It requires recovery after every received impulse, not just a one-time actuation.",
    keyInnovations: [
      "Oscillation-altered resistance medium",
      "Per-reception resistance restoration",
    ],
  },
  {
    number: 54,
    isIndependent: true,
    originalText: marconiRadioClaimText(54),
    plainEnglish:
      "Claim 54 retains Claim 53's variable-resistance recovery cycle and adds means that make successive received impulses manifest so defined signals can be given out. It claims detection, automatic reset, and readable consecutive signalling together.",
    keyInnovations: ["Consecutive-signal indication", "Controlled variable-resistance recovery"],
  },
  {
    number: 55,
    isIndependent: true,
    originalText: marconiRadioClaimText(55),
    plainEnglish:
      "Claim 55 combines an operator-controlled oscillation transmitter with a responsive receiver whose variable-resistance medium changes on reception, is restored after each reception, and produces a manifest signal. The legal chain runs from intentional transmission through reception, recovery, and output.",
    keyInnovations: [
      "Operator-controlled oscillation transmitter",
      "Receiver output after automatic recovery",
    ],
  },
  {
    number: 56,
    isIndependent: true,
    originalText: marconiRadioClaimText(56),
    plainEnglish:
      "Claim 56 adds a distance-located conductor tuned to respond to the transmitter's oscillations. The variable-resistance medium is in that conductor's circuit, then is restored after each reception and rendered manifest; tuning, response, reset, and output are all stated limits.",
    keyInnovations: ["Tuned remote conductor", "Tuned-circuit variable-resistance recovery"],
  },
];

export const marconiRadioPatent: Patent = {
  id: "us-586193-marconi-radio",
  patentNumber: "US 586,193",
  title: "Transmitting Electrical Signals",
  shortTitle: "Marconi Spark-Oscillation Receiver and Reset Mechanism",
  subtitle:
    "High-Frequency Spark Oscillations, Metallic-Powder Detection, and Automatic Decohering",
  inventors: ["Guglielmo Marconi"],
  inventorLocation: "21 Burlington Road, London, Middlesex, England",
  grantDate: "1897-07-13",
  filingDate: "1896-12-07",
  era: "Electrification & Early Modern (1870–1920)",
  category: "telecom",
  categoryLabel: "Telecommunications & RF Electromagnetism",
  summary:
    "US 586,193 describes a spark-oscillation signalling system with directed reflectors, a metallic-powder circuit-closer, and a trembler that restores the detector after each received impulse. The printed claims concentrate on the receiver's variable-resistance contact, its local circuit, choking coils, automatic reset, and transmitter-receiver combinations using earth and insulated conductors.",
  heroQuote:
    "According to this invention electrical signals, actions, or manifestations are transmitted through the air, earth, or water by means of oscillations of high frequency.",
  originalPdfUrl: "/patents/pdfs/us-586193-marconi-radio.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US586193A/en",
  usptoClassification: "H03B 11/02 (shock-excited oscillations using a spark)",
  archivalEdition: marconiRadioArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-586193-marconi-radio-reviewed.txt",
    pageCount: 11,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "ed185aa2e6974608279d044840f1b9176432cea9eee946a6ada7d020e9c6b352",
  },
  originalText: `To all whom it may concern:

Be it known that I, GUGLIELMO MARCONI, student, a subject of the King of Italy, residing at 21 Burlington Road, London, in the county of Middlesex, England, have invented certain new and useful Improvements in Transmitting Electrical Impulses and Signals and in Apparatus Therefor, of which the following is a specification.

According to this invention electrical signals, actions, or manifestations are transmitted through the air, earth, or water by means of oscillations of high frequency, such as have been called the "Hertz rays" or "Hertz oscillations." Usually all line-wires are dispensed with.`,
  plainEnglishExplanation: {
    overview:
      "The document is not a modern antenna patent. Its central practical problem is how a received high-frequency disturbance can operate an ordinary local telegraph circuit and then reset itself. Marconi uses a loose metallic-powder contact as the switch, a relay or instrument to make the result manifest, and a trembler to break the conductive state after reception.",
    coreMechanism:
      "A Ruhmkorff coil and spark producer make damped high-frequency oscillations. At the receiver, those oscillations alter the resistance of the powder contact. A local battery can then operate a relay or telegraph instrument. The trembler taps or moves the contact so its resistance returns to the normal state before the next impulse.",
    mechanicalBreakdown: [
      {
        title: "Spark oscillator and reflector",
        summary:
          "A high-tension coil excites adjustable metallic balls; a cylindrical parabolic reflector directs the apparatus.",
        technicalDetails:
          "The source specifies an eight-inch spark coil, an e-to-e gap of about one twenty-fifth to one thirtieth inch, and a d-to-e distance of about one and a half inches. It calls for reflector dimensions at least double the emitted wavelength.",
        archaicTerm: "Ruhmkorff coil",
        modernEquivalent: "Interrupted-primary high-voltage induction coil",
      },
      {
        title: "Metallic-powder circuit-closer",
        summary:
          "Loose metal grains in a sealed tube form a resistance that incoming oscillations can alter.",
        technicalDetails:
          "The document specifies hard nickel with about ten per cent hard-silver filings as a preferred mixture. It distinguishes the detector's high-frequency response from the separate local-battery circuit that operates a relay or telegraphic instrument.",
        archaicTerm: "Circuit-closer",
        modernEquivalent: "Coherer-style variable-resistance RF detector",
      },
      {
        title: "Trembler reset",
        summary: "A relay-driven trembler taps the detector and interrupts its conducting state.",
        technicalDetails:
          "The source explicitly says a well-prepared tube continues conducting after the transmitter oscillations cease until it is shaken or tapped. The reset is therefore an essential operating step in many claims, not a decorative accessory.",
        archaicTerm: "Trembler",
        modernEquivalent: "Electromechanical detector reset actuator",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Damped oscillation in a spark-excited circuit",
        formula: "i(t) = I_0 e^{-Rt/(2L)} sin(omega_d t)",
        explanation:
          "A spark excitation produces a decaying oscillation determined by circuit inductance, capacitance, and loss. The patent calls these high-frequency oscillations or Hertz oscillations and uses reflectors to direct them.",
      },
      {
        principle: "Variable-resistance contact",
        formula: "V = I R",
        explanation:
          "The receiver works because the powder contact changes resistance after electrical oscillations arrive. That resistance change allows the separate local-battery circuit to drive a relay, telegraph instrument, or trembler.",
      },
    ],
    whyItMattersToday:
      "The grant records a very early complete signalling chain: a high-frequency source, a receiver responsive to it, a local output circuit, and a reset path. Modern radio receivers use different detector physics, but still require a received signal, a selective or responsive circuit, an output, and recovery for the next symbol.",
  },
  claims: marconiRadioClaimRecords,
  drawings: [
    {
      figureNumber: "Figs. 1 to 3",
      title: "Air-transmission instruments and oscillator details",
      caption:
        "Sheet 1 shows the transmitter, reflector, adjustable oscillator, and rotating contact detail.",
      svgType: "marconi-radio",
      callouts: [
        {
          id: "marconi-a",
          figureRef: "Fig. 1",
          label: "a",
          element: "Battery",
          description: "Battery in the primary circuit of the Ruhmkorff coil.",
          x: 66,
          y: 70,
        },
        {
          id: "marconi-c",
          figureRef: "Fig. 1",
          label: "c",
          element: "Ruhmkorff coil",
          description: "High-tension coil used to produce the desired oscillations.",
          x: 45,
          y: 70,
        },
        {
          id: "marconi-d",
          figureRef: "Fig. 2a",
          label: "d/e",
          element: "Oscillator balls",
          description: "Adjustable metallic balls inside the insulating-tube assembly.",
          x: 49,
          y: 87,
        },
      ],
    },
    {
      figureNumber: "Figs. 4 to 8",
      title: "Receiver, detector, and liquid resistance",
      caption:
        "Sheet 2 shows the local circuit, sensitive tube, plates, choking coils, trembler, and related detector details.",
      svgType: "marconi-radio",
      callouts: [
        {
          id: "marconi-j",
          figureRef: "Fig. 5",
          label: "j",
          element: "Sensitive tube",
          description: "Tube containing the metallic powder or grains used as the circuit-closer.",
          x: 50,
          y: 59,
        },
        {
          id: "marconi-k",
          figureRef: "Fig. 5",
          label: "k/k'",
          element: "Plates and choking coils",
          description: "Tuned plates and small coils connecting the detector to the local circuit.",
          x: 65,
          y: 59,
        },
        {
          id: "marconi-p",
          figureRef: "Fig. 4",
          label: "p",
          element: "Trembler",
          description: "Automatic tapping mechanism that restores the detector contact.",
          x: 56,
          y: 36,
        },
      ],
    },
    {
      figureNumber: "Figs. 9 to 11",
      title: "Long-distance and earth-or-water arrangements",
      caption:
        "Sheet 3 shows alternative transmitting and receiving arrangements with suspended plates and earth connections.",
      svgType: "marconi-radio",
      callouts: [
        {
          id: "marconi-t",
          figureRef: "Fig. 9",
          label: "t/t2",
          element: "Suspended poles and plates",
          description:
            "Poles, rope, and insulated suspended metallic plates used for long-distance work.",
          x: 51,
          y: 30,
        },
        {
          id: "marconi-e",
          figureRef: "Fig. 10",
          label: "E",
          element: "Earth connection",
          description: "Earth connection for the alternative transmitter arrangement.",
          x: 65,
          y: 75,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The source describes the problem as signalling through air, earth, or water without line wires while converting a received high-frequency oscillation into an ordinary telegraphic indication.",
    priorArtLimitations: [
      "A detector contact that remains conducting after reception cannot distinguish subsequent impulses without a reset.",
      "High-frequency energy can be weakened when it dissipates along the local-battery wiring.",
    ],
    breakthroughInsight:
      "The claims repeatedly combine a variable-resistance contact with a local circuit and an automatic mechanical restoration, treating detection and reset as one receiving instrument.",
    patentWars: [
      {
        rivalName: "Nikola Tesla & Oliver Lodge",
        rivalClaim:
          "Nikola Tesla filed foundational US Patent No. 645,576 and No. 649,621 in 1897 for four-tuned circuit wireless transmission, and Oliver Lodge patented resonant syntonic tuning in 1897.",
        conflictDetails:
          "Marconi was initially denied US patents in 1900 because the Patent Office recognized Tesla's priority. Backed by wealthy financial interests, Marconi successfully lobbied the USPTO to reverse its decision in 1904 and grant him US 763,772 based on his 1897 British grant.",
        resolution:
          "During World War I, the US government used wireless patents without paying royalties, prompting Marconi Wireless to sue the United States in the US Court of Claims.",
        legalOutcome:
          "In the landmark US Supreme Court decision Marconi Wireless Telegraph Co. of America v. United States (320 U.S. 1, 1943), the Supreme Court invalidated Marconi's fundamental tuning patent claims, explicitly restoring Nikola Tesla's priority as the legal and technical inventor of radio.",
      },
    ],
    civilizationalImpact:
      "The patent is a primary record of late-nineteenth-century wireless signalling hardware, including a spark source, sensitive contact, relay output, and automatic recovery mechanism.",
    aftermath:
      "The facsimile records the grant on July 13, 1897; it does not itself establish later litigation or a particular communications milestone.",
  },
  tags: ["wireless signalling", "spark oscillator", "coherer", "telegraphy"],
  stats: { totalClaims: 56, independentClaims: 56 },
};
