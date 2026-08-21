import {
  fessendenWirelessArchivalEdition,
  manualFessendenClaimText,
} from "@/data/editions/fessendenWirelessEdition";
import type { Patent } from "@/types/patent";

const fessendenClaimDecoders: Record<
  number,
  { plainEnglish: string; keyInnovations: string[]; legalSignificance?: string }
> = {
  1: {
    plainEnglish:
      "Claims a transmitting conductor whose capacitance is large and substantially uniform across its radiating portion. The legal work is the distributed-capacity aerial geometry, not an asserted continuous-wave receiver or a later detector.",
    keyInnovations: ["Distributed aerial capacity", "Radiating portion"],
  },
  2: {
    plainEnglish:
      "Claims a sending conductor whose capacitance is adjusted to make its radiated electromagnetic waves low in frequency. It protects the specified electrical adjustment, rather than a generic claim to all wireless signaling.",
    keyInnovations: ["Low-frequency radiation", "Adjusted capacitance"],
  },
  3: {
    plainEnglish:
      "Claims a sending conductor with both capacitance and inductance adjusted so that its waves have low frequency. The protected relationship is the jointly tuned electrical constants of the conductor.",
    keyInnovations: ["Capacitance-inductance tuning", "Low-frequency waves"],
  },
  4: {
    plainEnglish:
      "Claims a transmission system using an alternating-voltage source and series sending conductor whose radiating portion is a large fraction of the quarter-wave length in its surrounding medium. It ties physical radiator length to the source-driven wave.",
    keyInnovations: ["Quarter-wave proportion", "Series sending conductor"],
  },
  5: {
    plainEnglish:
      "Claims a source-and-conductor transmission system in which the radiating portion forms a large fraction of the whole sending conductor. It distinguishes the radiating element from the entire series circuit.",
    keyInnovations: ["Radiating-length fraction", "Whole sending conductor"],
  },
  6: {
    plainEnglish:
      "Claims a system with a low-frequency impulse source and a series conductor proportioned to radiate electromagnetic waves and tuned to that source. The legal combination is source, tuned conductor, and radiation function.",
    keyInnovations: ["Low-frequency impulses", "Source tuning"],
  },
  7: {
    plainEnglish:
      "Claims the combination of an alternating-current dynamo and series conductor that forms a sending conductor tuned to the dynamo and adapted to radiate electromagnetic waves. The dynamo is an explicit claimed component.",
    keyInnovations: ["Alternating-current dynamo", "Dynamo-tuned conductor"],
  },
  8: {
    plainEnglish:
      "Claims a low-frequency sending conductor with an alternating-current dynamo connected between its radiating portion and ground, adjusted to approximately the conductor's natural period. The source and ground connection are both limiting elements.",
    keyInnovations: ["Grounded dynamo connection", "Natural-period adjustment"],
  },
  9: {
    plainEnglish:
      "Claims a sending conductor formed by a grounded-pole alternating-current dynamo and a series conductor, proportioned for low-frequency radiation. It treats the dynamo and conductor together as the sending conductor.",
    keyInnovations: ["Grounded dynamo pole", "Composite sending conductor"],
  },
  10: {
    plainEnglish:
      "Claims a low-frequency sending conductor combined with an alternating-voltage source connected to the radiating portion and ground, with source periodicity matching the connected system's natural period.",
    keyInnovations: ["Voltage-generator periodicity", "System natural period"],
  },
  11: {
    plainEnglish:
      "Claims a sending conductor formed from a continuously alternating-voltage source and series conductor, with one source pole grounded and the combination proportioned for low-frequency radiation.",
    keyInnovations: ["Continuous alternating voltage", "Grounded source pole"],
  },
  12: {
    plainEnglish:
      "Claims a signaling system combining a low-frequency radiating conductor with a receiver that uses a constant or independently varying magnetic field and responds to currents produced by the waves.",
    keyInnovations: ["Magnetic-field receiver", "Wave-produced currents"],
  },
  13: {
    plainEnglish:
      "Claims a short sending conductor whose operating frequency equals its natural period and whose radiating portion is a large fraction of its total length. It makes the electrical length constraint explicit.",
    keyInnovations: ["Short electrical conductor", "Natural-period frequency"],
  },
  14: {
    plainEnglish:
      "Claims a sending conductor with a natural vibration period much lower than that of an ether-wave four times its length, allowing a relatively large radiating portion of the total conductor.",
    keyInnovations: ["Low natural period", "Large radiating fraction"],
  },
  15: {
    plainEnglish:
      "Claims a sending conductor tuned to a selected low frequency through large capacitance and small inductance. It is a concise claim to that particular tuning choice.",
    keyInnovations: ["Large capacity", "Small inductance"],
  },
  16: {
    plainEnglish:
      "Claims a sending conductor having small inductance and tuned to a desired low frequency by a suitably proportioned large capacitance. The claim specifies the capacitance proportion as well as the tuning objective.",
    keyInnovations: ["Proportioned capacitance", "Small inductance"],
  },
  17: {
    plainEnglish:
      "Claims a low-resistance sending conductor with small self-induction and great capacity for the stated purpose. The three electrical properties are jointly required.",
    keyInnovations: ["Low resistance", "Great capacity", "Small self-induction"],
  },
  18: {
    plainEnglish:
      "Claims the same low-resistance, low-self-induction, high-capacity conductor when correlated to sustain persistent low-frequency oscillation relative to an ether-wave four times its conductor length.",
    keyInnovations: ["Persistent oscillation", "Correlated electrical constants"],
  },
  19: {
    plainEnglish:
      "Claims a transmission system whose radiating conductor and alternating-energy source are coordinated and relatively adjusted to radiate a substantially continuous electromagnetic stream.",
    keyInnovations: ["Coordinated source and radiator", "Continuous stream"],
  },
  20: {
    plainEnglish:
      "Claims a similar source-and-radiator system specifically adjusted to generate and radiate a substantially continuous electromagnetic stream. The verb generate adds a stated function to the coordinated apparatus.",
    keyInnovations: ["Generation of continuous waves", "Radiating conductor"],
  },
  21: {
    plainEnglish:
      "Claims a source-and-radiating-conductor system coordinated to radiate a substantially continuous electromagnetic stream of substantially uniform strength. The uniform-strength limitation is printed in the claim itself.",
    keyInnovations: ["Uniform-strength waves", "Coordinated apparatus"],
  },
};

const fessendenClaims = Array.from({ length: 21 }, (_, index) => {
  const number = index + 1;
  return {
    number,
    isIndependent: true,
    originalText: manualFessendenClaimText(number),
    ...fessendenClaimDecoders[number],
  };
});

export const fessendenWirelessPatent: Patent = {
  id: "us-706737-fessenden-wireless",
  patentNumber: "US 706,737",
  title: "Wireless Telegraphy",
  shortTitle: "Continuous-Wave Radio & Electrolytic Detector",
  subtitle:
    "Uninterrupted Sinusoidal Wave Radiation, Low-Loss Cylindrical Cage Aerials, and Liquid Barretter Demodulation",
  inventors: ["Reginald Aubrey Fessenden"],
  inventorLocation: "Allegheny, Pennsylvania",
  grantDate: "1902-08-12",
  filingDate: "1901-05-29",
  era: "Electrification & Early Modern (1870–1920)",
  category: "telecom",
  categoryLabel: "Telecommunications & Radio Frequency Engineering",
  summary:
    "Reginald A. Fessenden's 1902 grant concerns lower-frequency electromagnetic-wave transmission: increasing a sending conductor's capacity and self-induction, its radiating portion, and the relation of an alternating-voltage source to the conductor's natural period. The printed claims run from distributed capacity through coordinated source-and-radiator systems.",
  heroQuote:
    "The invention described herein relates to certain improvements in transmission of energy by electromagnetic waves, and has for its object the production of more efficient sending or generating conductors.",
  originalPdfUrl: "/patents/pdfs/us-706737-fessenden-wireless.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US706737A/en",
  usptoClassification: "375/295",
  originalTextAsset: {
    url: "/patents/transcripts/us-706737-fessenden-wireless-reviewed.txt",
    pageCount: 7,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Antigravity)",
    reviewedAt: "2026-08-19",
    sourcePdfSha256: "2098ec6d967d3ab7999da0fb96357328fa68bb8e7639c1863ac600547aff8887",
    pageAnchors: [
      {
        page: 1,
        sourceRelationship: "drawing-sheet",
        exactSourceText: "FIG. 1. FIG. 2. FIG. 3. FIG. 4. FIG. 5. Reginald A. Fessenden Inventor.",
      },
      {
        page: 2,
        sourceRelationship: "specification-masthead",
        exactSourceText:
          "UNITED STATES PATENT OFFICE. REGINALD A. FESSENDEN, OF ALLEGHENY, PENNSYLVANIA. WIRELESS TELEGRAPHY. Letters Patent No. 706,737, dated August 12, 1902.",
      },
      {
        page: 3,
        sourceRelationship: "specification-body",
        exactSourceText:
          "cage or cylinder can be connected to ground in any suitable manner, as by the wire 8, in which coils or turns may be formed to adjust the self-induction of the sending-conductor.",
      },
      {
        page: 4,
        sourceRelationship: "specification-body",
        exactSourceText:
          "with a sending-conductor of large capacity uniformly distributed it is possible to get a sine-wave and a low resistance—i. e., conditions necessary and favorable for the production of large resonant voltages from small impressed voltages",
      },
      {
        page: 5,
        sourceRelationship: "specification-body",
        exactSourceText:
          "The receiving instrument consists of a vessel containing a liquid—such as a solution of nitric acid, caustic soda, &c.—in which are immersed two terminals",
      },
      {
        page: 6,
        sourceRelationship: "specification-claims",
        exactSourceText:
          "1. A sending-conductor for electromagnetic waves, having a large capacity distributed with substantial uniformity over its radiating portion, substantially as set forth.",
      },
      {
        page: 7,
        sourceRelationship: "claims-and-signatures",
        exactSourceText:
          "In testimony whereof I have hereunto set my hand. REGINALD A. FESSENDEN. Witnesses: W. B. FEARING, S. C. GRAY.",
      },
    ],
  },
  archivalEdition: fessendenWirelessArchivalEdition,
  originalText:
    "Be it known that I, REGINALD A. FESSENDEN, a citizen of the United States, residing at Allegheny, in the county of Allegheny and State of Pennsylvania, have invented certain new and useful Improvements in Wireless Telegraphy, of which the following is a specification.\n\nThe invention described herein relates to certain improvements in transmission of energy by electromagnetic waves, and has for its object the production of more efficient sending or generating conductors.\n\nIt is a further object of the invention to provide for the production of mechanical movements by the direct interaction of currents induced in the receiving-conductor by electromagnetic waves and constant or varying magnetic fields.",
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Continuous-Wave Transmitting & Receiving System",
      caption:
        "Transmitting system featuring high-frequency alternator dynamo (3), tuning inductance (2), and vertical antenna (1), alongside continuous-wave receiving station with aerial (10) and telephone receiver (11).",
      svgType: "fessenden-wireless",
      callouts: [
        {
          id: "fw-1",
          figureRef: "Fig. 1",
          label: "1",
          element: "Low-Loss Sending Conductor",
          description:
            "Vertical radiating antenna exhibiting low high-frequency resistance and high capacitance.",
          x: 35,
          y: 25,
        },
        {
          id: "fw-2",
          figureRef: "Fig. 1",
          label: "2",
          element: "Series Tuning Inductance",
          description:
            "Variable loading coil adjusting antenna self-induction for sharp resonance.",
          x: 25,
          y: 55,
        },
        {
          id: "fw-3",
          figureRef: "Fig. 1",
          label: "3",
          element: "High-Frequency Alternator Dynamo",
          description:
            "Mechanical continuous-wave generator producing uninterrupted sinusoidal RF current.",
          x: 18,
          y: 75,
        },
        {
          id: "fw-10",
          figureRef: "Fig. 1",
          label: "10",
          element: "Receiving Aerial Conductor",
          description:
            "Elevated aerial conductor collecting continuous electromagnetic wave oscillations.",
          x: 70,
          y: 25,
        },
        {
          id: "fw-11",
          figureRef: "Fig. 1",
          label: "11",
          element: "Telephone Receiver Earpiece",
          description:
            "Electromagnetic acoustic transducer converting demodulated RF variations into audible speech.",
          x: 88,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Liquid Barretter / Electrolytic Detector Receiver",
      caption:
        "Complete continuous-wave signaling circuit showing the Liquid Barretter / Electrolytic Detector (12) with acid cup (13), microscopic Wollaston platinum point (14), polarizing battery (15), and telephone receiver (16).",
      svgType: "fessenden-wireless",
      callouts: [
        {
          id: "fw-12",
          figureRef: "Fig. 2",
          label: "12",
          element: "Liquid Barretter / Electrolytic Detector",
          description: "Ultra-sensitive thermal-electrochemical RF demodulator.",
          x: 75,
          y: 60,
        },
        {
          id: "fw-13",
          figureRef: "Fig. 2",
          label: "13",
          element: "Acid Vessel",
          description: "Glass cup containing dilute nitric acid electrolyte.",
          x: 75,
          y: 75,
        },
        {
          id: "fw-14",
          figureRef: "Fig. 2",
          label: "14",
          element: "Wollaston Platinum Electrode",
          description: "Sub-micron platinum wire tip contacting the acid meniscus.",
          x: 75,
          y: 50,
        },
        {
          id: "fw-15",
          figureRef: "Fig. 2",
          label: "15",
          element: "Local DC Polarizing Battery",
          description: "DC voltage source establishing baseline electrochemical polarization.",
          x: 60,
          y: 70,
        },
        {
          id: "fw-16",
          figureRef: "Fig. 2",
          label: "16",
          element: "Telephone Headset",
          description:
            "Acoustic earpiece responding instantaneously to polarization current shifts.",
          x: 88,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Low-Loss Cylindrical Cage Antenna Elevation",
      caption:
        "Side elevation of low-loss cylindrical cage antenna comprising vertical conductors (4), circular metallic spreader rings (5), insulated supporting mast (7), and base connection (8).",
      svgType: "fessenden-wireless",
      callouts: [
        {
          id: "fw-4",
          figureRef: "Fig. 3",
          label: "4",
          element: "Vertical Radiating Conductors",
          description: "Multiple parallel bronze wires distributed in a cylindrical cage.",
          x: 40,
          y: 40,
        },
        {
          id: "fw-5",
          figureRef: "Fig. 3",
          label: "5",
          element: "Metallic Spreader Rings",
          description: "Circular conductive hoops maintaining uniform cylinder diameter.",
          x: 50,
          y: 20,
        },
        {
          id: "fw-7",
          figureRef: "Fig. 3",
          label: "7",
          element: "Central Insulated Mast",
          description: "Structural wooden/bamboo mast supporting the cage structure.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Cylindrical Cage Antenna Transverse Cross-Section",
      caption:
        "Horizontal transverse section of cylindrical cage antenna showing circumferential radiating wires (4), support ring (5), and insulated hub collar (6).",
      svgType: "fessenden-wireless",
      callouts: [
        {
          id: "fw-4-sec",
          figureRef: "Fig. 4",
          label: "4",
          element: "Perimeter Radiating Wires",
          description: "Conductors uniformly spaced along outer circular boundary.",
          x: 50,
          y: 15,
        },
        {
          id: "fw-5-ring",
          figureRef: "Fig. 4",
          label: "5",
          element: "Circular Spreader Ring",
          description: "Metallic ring preserving geometry.",
          x: 50,
          y: 50,
        },
        {
          id: "fw-6-hub",
          figureRef: "Fig. 4",
          label: "6",
          element: "Insulated Hub Collar",
          description: "Central collar mounted on supporting mast.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 5",
      title: "Continuous Sheet Cylinder Radiator Detail",
      caption:
        "Detail view illustrating tubular radiating cylinder (9) with sliding adjustment sleeve collar (17) for tuning conductor length.",
      svgType: "fessenden-wireless",
      callouts: [
        {
          id: "fw-9-cyl",
          figureRef: "Fig. 5",
          label: "9",
          element: "Continuous Sheet Metal Cylinder",
          description: "Alternative solid-wall tubular radiating conductor.",
          x: 50,
          y: 50,
        },
        {
          id: "fw-17-sleeve",
          figureRef: "Fig. 5",
          label: "17",
          element: "Sliding Adjusting Collar",
          description: "Movable sleeve for mechanical length tuning.",
          x: 50,
          y: 30,
        },
      ],
    },
  ],
  plainEnglishExplanation: {
    overview:
      "Before Reginald Fessenden, all early radio pioneers—including Guglielmo Marconi, Oliver Lodge, and Ferdinand Braun—believed that wireless signals had to be produced by violent high-voltage spark discharges across a spark gap. These spark bursts created brief, jagged, rapidly decaying wave trains (damped waves) with huge silent gaps between pulses. This caused immense broadband radio noise, made frequency filtering nearly impossible, and could only transmit Morse clicks. Fessenden made the radical breakthrough that radio waves should be emitted as a continuous, uninterrupted sinusoidal wave (CW). By generating pure continuous waves and inventing the ultra-responsive liquid electrolytic detector (the barretter), Fessenden unlocked sharp resonant selectivity and made human voice and music transmission possible.",
    coreMechanism:
      "A high-frequency mechanical alternator generates continuous sinusoidal alternating current at radio frequencies. This current is fed through a variable loading inductance into a low-loss cylindrical cage antenna, radiating uninterrupted harmonic electromagnetic waves ($E = E_0 sin(omega t)$). At the receiving station, the continuous wave induces a resonant voltage in a tuned LC circuit. The signal passes through an electrolytic detector consisting of an ultra-fine (0.0001-inch) platinum Wollaston wire contacting dilute nitric acid. High-frequency RF currents instantly heat the microscopic liquid-metal junction, breaking down the electrochemical polarization barrier and modulating the current from a local DC battery through an electromagnetic telephone receiver, reproducing clear audio in real time.",
    mechanicalBreakdown: [
      {
        title: "High-Frequency Continuous-Wave Alternator",
        summary:
          "A high-speed mechanical dynamo with hundreds of alternating magnetic poles on a high-velocity rotor, outputting smooth continuous sinusoidal RF electrical power directly into the antenna without spark gaps.",
        technicalDetails:
          "Operates at rotational speeds up to 10,000 RPM to generate fundamental carrier frequencies from 10 kHz to 100 kHz with harmonic distortion below 2%, delivering continuous RF power $P = I_{	ext{rms}}^2 R_{	ext{rad}}$ without pulse decay.",
        archaicTerm: "Source of continuous alternating current / high-frequency dynamo",
        modernEquivalent:
          "Radio-frequency continuous-wave (CW) carrier transmitter / RF alternator",
      },
      {
        title: "Low-Loss Cylindrical Cage Antenna",
        summary:
          "A vertical multi-wire cage structure suspended around an insulated central mast, providing immense electrostatic capacitance and minimal high-frequency skin-effect resistance.",
        technicalDetails:
          "The parallel conductor cage distributes RF current across a large effective surface area, reducing ohmic losses $R_{	ext{loss}} < 1,Omega$ and maximizing radiation efficiency $eta = rac{R_{	ext{rad}}}{R_{	ext{rad}} + R_{	ext{loss}}} > 85%$.",
        archaicTerm: "Cylindrical cage conductor / low-resistance sending-conductor",
        modernEquivalent: "High-Q cylindrical cage vertical monopole antenna",
      },
      {
        title: "Liquid Barretter / Electrolytic Detector",
        summary:
          "An ultra-sensitive demodulator comprising a microscopic platinum wire point dipping into dilute acid, providing instantaneous continuous conductivity modulation without mechanical coherer tapping.",
        technicalDetails:
          "A 2.5-micron Wollaston wire etched to an exposed point contacts 20% $	ext{HNO}_3$. Incoming RF current dissipates heat in the microscopic contact volume ($V < 10^{-12},	ext{cm}^3$), thermally destroying the electrolytic polarization layer and creating instantaneous linear current response in the audio circuit.",
        archaicTerm: "Thermal receiver / liquid electrolytic detector",
        modernEquivalent: "Point-contact RF demodulator / thermal-electrochemical detector",
      },
      {
        title: "High-Q Resonant Tank Tuning Circuit",
        summary:
          "A series-resonant inductor-capacitor circuit calibrated to match the transmitter's exact carrier frequency, rejecting adjacent transmissions with extreme selectivity.",
        technicalDetails:
          "Because the transmitted wave is continuous rather than damped, circuit Q-factor reaches $Q = rac{omega L}{R} > 150$, providing sharp 3 dB bandwidths $Delta f = f_0 / Q < 600,	ext{Hz}$ and eliminating broadband co-channel interference.",
        archaicTerm: "Tuning coil / adjustable self-induction",
        modernEquivalent: "Variable LC resonant tank tuner",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Thomson-Maxwell Resonant Frequency & Continuous Wave Radiation",
        formula:
          "f_0 = \frac{1}{2pi sqrt{L C}}, quad P_{\text{rad}} = \frac{2}{3} \frac{q^2 a^2}{c^3} = I_{\text{rms}}^2 R_{\text{rad}}",
        explanation:
          "Continuous sinusoidal oscillations in a low-loss LC resonator drive sustained electromagnetic radiation according to Maxwell's equations, avoiding the decaying exponential envelope $e^{-gamma t}$ of damped spark discharges.",
      },
      {
        principle: "Antenna Radiation Efficiency & Quality Factor",
        formula:
          "eta = \frac{R_{\text{rad}}}{R_{\text{rad}} + R_{\text{loss}}}, quad Q = \frac{omega_0 L}{R_{\text{total}}} = \frac{f_0}{Delta f}",
        explanation:
          "By increasing antenna capacitance and reducing ohmic conductor resistance via the multi-wire cage geometry, Fessenden maximized radiation efficiency and achieved extremely high Q-factor for interference-free multi-channel selectivity.",
      },
      {
        principle: "Thermal-Electrochemical Demodulation (Barretter Effect)",
        formula:
          "Delta R = alpha R_0 Delta T = alpha R_0 left(\frac{I_{\text{rf}}^2 R_{\text{junction}}}{C_{\text{thermal}}}\right)",
        explanation:
          "The microscopic volume of electrolyte around the sub-micron platinum wire tip heats instantaneously under micro-watt RF signals, modulating DC circuit resistance linearly and driving the audio telephone diaphragm directly.",
      },
    ],
    whyItMattersToday:
      "Every modern radio receiver, mobile phone, and satellite transceiver is a direct descendant of Fessenden's continuous-wave paradigm, high-Q resonant selectivity, and continuous demodulation architecture.",
  },
  claims: fessendenClaims,
  /*
    {
      number: 1,
      isIndependent: true,
      originalText: manualFessendenClaimText(1),
      plainEnglish:
        "The master independent claim covering the fundamental wireless transmission system comprising an aerial radiating conductor, a source of continuous alternating current, and means for continuously transmitting unbroken electromagnetic waves of uniform amplitude and controlled frequency.",
      keyInnovations: [
        "Uninterrupted continuous electromagnetic wave radiation",
        "Source of continuous alternating current (RF alternator)",
        "Elimination of intermittent decaying spark discharges",
      ],
      legalSignificance:
        "The foundational broad patent claim for continuous-wave (CW) wireless communication, breaking Marconi's monopoly on spark-gap radio.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualFessendenClaimText(2),
      plainEnglish:
        "The apparatus and method for generating in a transmitting aerial conductor continuous alternating currents possessing a pure sinusoidal harmonic waveform.",
      keyInnovations: [
        "Pure sinusoidal alternating current generation",
        "Harmonic wave emission without broadband noise",
      ],
      legalSignificance:
        "Secured exclusive legal rights to sinusoidal radio frequency generation for wireless transmission.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualFessendenClaimText(3),
      plainEnglish:
        "A complete wireless signaling combination comprising a transmitting station with a high-frequency alternator dynamo and low-loss antenna, paired with a receiving station having a tuned resonant circuit and a continuous-response thermal detector.",
      keyInnovations: [
        "End-to-end continuous wave transmitting and receiving architecture",
        "High-frequency alternator dynamo integration",
        "Continuous thermal/electrolytic detector pairing",
      ],
      legalSignificance: "Covered the entire working continuous-wave radio communication system.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualFessendenClaimText(4),
      plainEnglish:
        "A wireless receiving station comprising an aerial conductor, a local circuit with a DC power source and an electromagnetic telephone receiver, and an electrolytic detector responsive to continuous wave oscillations.",
      keyInnovations: [
        "Electrolytic liquid barretter detector in receiving circuit",
        "Direct acoustic telephone receiver actuation without mechanical decoherers",
      ],
      legalSignificance:
        "Established patent protection for the liquid barretter, the most sensitive radio detector in the world until the triode tube.",
    },
    {
      number: 5,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualFessendenClaimText(5),
      plainEnglish:
        "A transmitting aerial conductor constructed as a plurality of vertical parallel wires arranged in a cylindrical cage and supported on metallic rings to provide high electrostatic capacitance and low ohmic resistance.",
      keyInnovations: [
        "Multi-wire cylindrical cage antenna geometry",
        "High capacitance and minimal RF skin-effect resistance",
      ],
      legalSignificance:
        "Protected the low-loss cage antenna design essential for high-power continuous-wave transmission.",
    },
  ], */
  historicalContext: {
    problemStatement:
      "At the turn of the 20th century, all early wireless systems relied entirely on high-voltage spark discharges that created brief, decaying wave-trains separated by long silent intervals, resulting in severe broadband interference and making voice transmission impossible.",
    priorArtLimitations: [
      "Marconi spark gaps produced decaying pulse bursts with extreme spectral splatter",
      "Filings coherers required mechanical tapping to reset and could only register on/off Morse clicks",
      "Sharp multi-channel resonant tuning was physically impossible with damped waveforms",
    ],
    breakthroughInsight:
      "Replacing intermittent damped sparks with continuous, uninterrupted sinusoidal radio-frequency oscillations generated by an alternator dynamo and detected by an instantaneous thermal-electrochemical liquid barretter.",
    patentWars: [
      {
        rivalName: "Marconi Wireless Telegraph Company",
        rivalClaim: "Monopoly over all aerial wireless telegraphic communication",
        conflictDetails:
          "Marconi asserted broad rights over tuned aerial transmission and initially ridiculed continuous wave generation as impractical.",
        resolution:
          "Federal courts repeatedly upheld Fessenden's patents; Marconi was eventually forced to license continuous-wave technology.",
        legalOutcome:
          "Established continuous-wave radio as a distinct, patentable art superior to spark-gap telegraphy.",
      },
      {
        rivalName: "Lee de Forest (American De Forest Wireless)",
        rivalClaim: "Spade Detector patent rights",
        conflictDetails:
          "Lee de Forest copied Fessenden's liquid barretter and sold it commercially as the 'spade detector'.",
        resolution:
          "In 1905–1906, federal courts found de Forest guilty of willful infringement and issued a permanent injunction shutting down his stations.",
        legalOutcome: "Vindicated Fessenden's exclusive priority in electrolytic RF demodulation.",
      },
    ],
    civilizationalImpact:
      "Created the foundation of all modern continuous carrier communications, enabling the world's first audio radio broadcast on Christmas Eve 1906 and paving the way for AM/FM radio, television, mobile telephony, and Wi-Fi.",
    funFact:
      "On Christmas Eve 1906, ship radio operators across the Atlantic expecting Morse clicks were stunned to hear Fessenden speaking, playing 'O Holy Night' on his violin, and reading Luke Chapter 2.",
  },
  stats: {
    totalClaims: 21,
    independentClaims: 21,
  },
};
