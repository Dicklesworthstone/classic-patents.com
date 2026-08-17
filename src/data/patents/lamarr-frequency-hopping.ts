import type { Patent } from "@/types/patent";

export const lamarrFrequencyHoppingPatent: Patent = {
  id: "us-2292387-lamarr-frequency-hopping",
  patentNumber: "US 2,292,387",
  title: "Secret Communication System",
  shortTitle: "Lamarr–Antheil Frequency-Hopping Spread Spectrum",
  subtitle: "Slotted Paper Roll Carrier Hopping & Jam-Resistant Wireless Torpedo Guidance",
  inventors: ["Hedy Kiesler Markey (Hedy Lamarr)", "George Antheil"],
  inventorLocation: "Los Angeles, CA & Manhattan, NY",
  grantDate: "1942-08-11",
  filingDate: "1941-06-10",
  era: "World War II & Digital Wireless (1940-1960)",
  category: "telecom",
  categoryLabel: "Spread Spectrum & Wireless",
  summary:
    "Hollywood icon Hedy Lamarr and avant-garde composer George Antheil's pioneering patent for Frequency-Hopping Spread Spectrum (FHSS). To prevent Axis radio jamming of Allied radio-guided torpedoes, they designed an 88-frequency carrier hopping system synchronized by matching piano rolls, providing the physical and algorithmic foundation for Wi-Fi, Bluetooth, GPS, and CDMA cellular communications.",
  heroQuote:
    "This invention relates broadly to secret communication systems and is particularly adapted to the radio control of dirigible craft, such as torpedoes... it aims to provide a method of secret communication which is reliable and which cannot be discovered or jammed by an enemy.",
  originalPdfUrl: "/patents/pdfs/us-2292387-lamarr-frequency-hopping.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2292387A/en",
  usptoClassification: "H04K 1/02; H04B 1/713",
  originalText: `TO ALL WHOM IT MAY CONCERN:
Be it known that we, HEDY KIESLER MARKEY, a citizen of the United States, residing at Los Angeles, California, and GEORGE ANTHEIL, a citizen of the United States, residing at Manhattan, New York, have invented certain new and useful Improvements in Secret Communication Systems, of which the following is a specification.

This invention relates broadly to secret communication systems and is particularly adapted to the radio control of dirigible craft, such as torpedoes. Radio control of torpedoes has the disadvantage that the carrier frequency employed is liable to be discovered and jammed by an enemy transmitting an interfering signal on the same frequency.

In the system of the present invention, transmission is effected on a multiplicity of different carrier frequencies, the carrier being shifted from one frequency to another at intervals in accordance with a predetermined code. In the preferred embodiment, eighty-eight different frequencies are employed, corresponding to the eighty-eight keys of a piano, the shifting of frequencies being controlled by slotted paper tape records similar to player-piano rolls driven by matched, synchronized clockwork motors at both transmitter and receiver.`,
  plainEnglishExplanation: {
    overview:
      "During World War II, radio-controlled torpedoes were easily defeated: enemy ships simply scanned the radio dial, found the control frequency, and broadcast static to jam the steering signals, causing the torpedo to veer off course. Hedy Lamarr realized that if the transmitter and receiver simultaneously jumped between dozens of different radio frequencies in a secret pseudo-random sequence, an enemy jammer trying to broadcast on a single frequency would only disrupt a tiny fraction of a second before the signal hopped away.",
    coreMechanism:
      "Both the transmitter on the aircraft/ship and the receiver inside the torpedo contain identical perforated paper tape rolls (like player piano rolls) advancing at identical speed via synchronized clockwork escapements. As perforations pass electrical contact fingers, different tuning capacitors and inductors are switched in and out of the RF oscillator tank, hopping carrier transmission across 88 distinct frequencies.",
    mechanicalBreakdown: [
      {
        title: "Perforated Piano-Roll Synchronizer & Code Generator",
        summary:
          "Generating identical, deterministic pseudo-random frequency hopping sequences at both transmitter and receiver.",
        technicalDetails:
          "Antheil (an avant-garde composer famous for synchronizing 16 player pianos in his 'Ballet Mécanique') adapted 88-key player piano rolls. Punched holes in the moving paper roll selectively engage 88 electrical contact wipers, switching tuned LC resonant circuits to hop between 88 discrete RF channels.",
        archaicTerm: "Slotted paper record driven by clockwork mechanism",
        modernEquivalent:
          "Pseudo-random noise (PN) sequence code generator / Linear-Feedback Shift Register (LFSR)",
      },
      {
        title: "Spread Spectrum Anti-Jamming & Low Probability of Intercept (LPI)",
        summary:
          "Spreading signal energy across a wide bandwidth to defeat narrowband electronic countermeasures.",
        technicalDetails:
          "Instead of concentrating RF power in a single vulnerable channel $Delta f$, the signal hops across a total spread bandwidth $B gg Delta f$. An adversary jamming with power $P_J$ across the band suffers a Processing Gain advantage $G_p = 10 log_{10}(B / Delta f) approx 19.4 \text{ dB}$ (for 88 channels), rendering jamming ineffective.",
        archaicTerm: "Transmitting on a multiplicity of carrier frequencies",
        modernEquivalent: "Direct-Sequence & Frequency-Hopping Spread Spectrum (FHSS)",
      },
      {
        title: "Synchronous Clockwork Phase Alignment",
        summary:
          "Precision mechanical escapements keeping transmitter and receiver in exact microsecond phase lock.",
        technicalDetails:
          "Both clockwork rolls are triggered simultaneously at torpedo launch. Matching tuning forks or deadbeat clockwork escapements maintain uniform velocity, ensuring the receiver's local oscillator frequency tracks the transmitter's frequency hops in real-time.",
        archaicTerm: "Synchronized motors and escapements",
        modernEquivalent: "Phase-Locked Loop (PLL) & Code Tracking Loop (Delay-Locked Loop)",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Shannon Channel Capacity & Processing Gain",
        formula: "C = B · log_2(1 + S / (N + J)) quad \text{and} quad G_p = B_{ss} / B_{info}",
        explanation:
          "Spreading signal bandwidth $B_{ss}$ reduces power spectral density below ambient noise, defeating narrowband jamming power J without loss of information capacity C.",
      },
      {
        principle: "Tuned LC Resonant Tank Frequency Hopping",
        formula: "f_k = 1 / (2π √(L · C_k)) quad \text{for } k in {1, 2, dots, 88}",
        explanation:
          "Switching distinct capacitance values $C_k$ into the oscillator tank shifts the carrier frequency in discrete steps across the RF spectrum.",
      },
    ],
    whyItMattersToday:
      "Lamarr and Antheil's frequency-hopping spread spectrum concept is the foundational architecture underlying Bluetooth frequency hopping (1,600 hops/sec across 79 channels), Wi-Fi (802.11 DSSS/OFDM), GPS satellite navigation, and CDMA cellular 3G/4G/5G networks.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A secret communication system comprising a transmitter having means for generating and transmitting carrier waves of a multiplicity of different frequencies, means for changing the transmitted carrier from one frequency to another at intervals in accordance with a predetermined code, and a receiver having means for changing its tuning from one frequency to another in synchronism with the changes in the transmitter.",
      plainEnglish:
        "The master broad claim of a secure wireless communication system where a transmitter shifts carrier frequencies across multiple channels according to a predetermined code, and a receiver shifts its tuning in lockstep synchrony.",
      keyInnovations: [
        "Frequency-hopping transmitter",
        "Synchronous frequency-hopping receiver",
        "Pre-programmed code sequence",
      ],
      legalSignificance:
        "The foundational patent claim for Frequency-Hopping Spread Spectrum (FHSS) technology.",
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a secret communication system, the combination of a movable record containing a multiplicity of coding slots, contact fingers engaging said slots to selectively complete circuit paths to tuning elements, and clockwork means for advancing said record uniformly.",
      plainEnglish:
        "Using a moving perforated tape with contact fingers to switch tuning capacitors/inductors and mechanically generate the frequency-hopping sequence.",
      keyInnovations: [
        "Punched paper roll coder",
        "Capacitive tuning selector",
        "Clockwork motor drive",
      ],
      legalSignificance:
        "Protected the mechanical implementation of pseudo-random code execution using player piano technology.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title:
        "Complete Frequency-Hopping Transmitter, Slotted Paper Roll, and Torpedo Receiver Circuit",
      caption:
        "Showing 88-frequency tuned capacitor array, perforated paper roll, and RF antenna output.",
      svgType: "spencer-microwave",
      callouts: [
        {
          id: "piano-roll",
          figureRef: "Fig. 1",
          label: "Slotted Paper Coding Roll",
          element: "10",
          description:
            "Moving perforated paper roll determining the pseudo-random carrier hopping sequence.",
          x: 35,
          y: 45,
        },
        {
          id: "tuning-array",
          figureRef: "Fig. 1",
          label: "88-Channel Tuning Capacitor Bank",
          element: "22",
          description:
            "Array of variable capacitors switched in sequence to shift carrier frequency across 88 channels.",
          x: 65,
          y: 35,
        },
        {
          id: "torpedo-motor",
          figureRef: "Fig. 1",
          label: "Torpedo Steering Servo Actuator",
          element: "38",
          description: "Rudder control servo guided by demodulated jam-proof radio commands.",
          x: 75,
          y: 75,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1940, German U-boats were sinking hundreds of Allied merchant ships in the Atlantic. Allied radio-controlled guidance systems could not be deployed because naval commanders feared Axis radio jamming would turn weapons against their own ships.",
    priorArtLimitations: [
      "Standard radio guidance transmitted on a single fixed carrier frequency, vulnerable to simple broadband or spot jamming.",
      "Analog frequency-modulation systems could still be tracked and overpowered by higher-power enemy transmitters.",
      "Electronic digital computers did not yet exist to generate complex encryption keys.",
    ],
    breakthroughInsight:
      "Lamarr realized that instead of defending a single radio frequency, the signal should constantly jump between 88 frequencies in a pseudo-random pattern. Antheil realized that player piano rolls could act as compact, shock-resistant mechanical ROM chips inside the torpedo and the bomber.",
    patentWars: [
      {
        rivalName: "US Navy & Sylvania Electronic Systems",
        rivalClaim:
          "The US Navy initially classified the patent as top secret, shelved the mechanical piano roll design as too bulky for torpedoes, and gave Lamarr no royalties.",
        conflictDetails:
          "During the 1950s and the 1962 Cuban Missile Crisis, military contractors (Sylvania) transitioned Lamarr's frequency hopping from mechanical rolls to electronic transistors for secure naval communications (project Sonobuoy).",
        resolution:
          "By the 1980s when the patent had expired, the military declassified spread spectrum, and commercial engineers adopted it for cellular and Wi-Fi networks.",
        legalOutcome:
          "In 1997, the Electronic Frontier Foundation (EFF) awarded Hedy Lamarr the Pioneer Award, and in 2014 she was posthumously inducted into the National Inventors Hall of Fame.",
      },
    ],
    civilizationalImpact:
      "Spread spectrum is the backbone of all modern wireless communications: Wi-Fi, Bluetooth, GPS, and 4G/5G mobile networks. Over 10 billion active devices transmit using descendants of Lamarr's frequency-hopping architecture every single day.",
    funFact:
      "Hedy Lamarr was born Hedwig Eva Maria Kiesler in Vienna. She had no formal engineering degree, but maintained an invention drafting table in her Hollywood trailer between takes on MGM film sets. When Howard Hughes sought to build faster airplanes, Lamarr studied fish and bird anatomy books to design a swept-wing aerodynamic profile that Hughes adopted.",
  },
  tags: [
    "Wi-Fi",
    "Bluetooth",
    "Spread Spectrum",
    "Frequency Hopping",
    "Hedy Lamarr",
    "Telecommunications",
    "GPS",
  ],
  stats: {
    totalClaims: 12,
    independentClaims: 3,
    patentWarYears: "1941–1997 (56 Years)",
    impactScore: 100,
  },
};
