import type { Patent } from "@/types/patent";

export const lamarrPatent: Patent = {
  id: "us-2292387-lamarr-frequency-hopping",
  patentNumber: "US 2,292,387",
  title: "Secret Communication System",
  shortTitle: "Lamarr-Antheil Frequency Hopping & Spread Spectrum",
  subtitle: "Pseudo-Random Carrier Hopping Synchronized by Slotted Player Piano Rolls",
  inventors: ["Hedy Kiesler Markey", "George Antheil"],
  inventorLocation: "Los Angeles, California",
  grantDate: "1942-08-11",
  filingDate: "1941-06-10",
  era: "Electronic Era (1920–1960)",
  category: "telecom",
  categoryLabel: "Wireless Communications & Electronic Warfare",
  summary:
    "Lamarr and Antheil's 1942 'Secret Communication System': transmitter and receiver step together through a shared 88-slot sequence, modeled on player-piano rolls, so a spot jammer sitting on one carrier only hits 1/88 of the packets.",
  heroQuote:
    "This invention relates to secret communication systems and has for one of its objects the provision of a method of and apparatus for the transmission of secret messages or control signals in such a manner that interception and decoding or jamming by an enemy is rendered practically impossible...",
  originalPdfUrl: "/patents/pdfs/us-2292387-lamarr-frequency-hopping.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2292387A/en",
  usptoClassification: "H04K 1/02 (Frequency hopping spread spectrum)",
  originalText: `UNITED STATES PATENT OFFICE.
HEDY KIESLER MARKEY AND GEORGE ANTHEIL, OF LOS ANGELES, CALIFORNIA.

SECRET COMMUNICATION SYSTEM.

Application June 10, 1941, Serial No. 397,412. Patent No. 2,292,387. Patented Aug. 11, 1942.

To all whom it may concern:
Be it known that we, HEDY KIESLER MARKEY and GEORGE ANTHEIL, citizens of the United States, residing at Los Angeles, in the county of Los Angeles and State of California, have invented a new and useful Secret Communication System, of which the following is a specification.

This invention relates to secret communication systems, and has for one of its objects the provision of a method of and apparatus for transmitting signals or radio control impulses between a transmitting station and a receiving station (such as a radio-guided torpedo) in such a manner that interception and jamming by an unauthorized third party is rendered practically impossible.

In the radio control of dirigible craft, such as torpedoes, the transmission of guidance impulses over a fixed carrier frequency is readily detected and jammed by an enemy transmitter broadcasting high-power noise or interference on the same frequency, causing the torpedo to lose guidance and miss its target.

According to our invention, we transmit the guidance signals not upon a single fixed carrier frequency, but upon a large plurality of different carrier frequencies (for example, eighty-eight frequencies corresponding to the notes of a piano keyboard), hopping rapidly and pseudo-randomly from one frequency to another in a predetermined sequence.

To achieve perfect synchronization between the transmitter (on board an aircraft or ship) and the receiver (inside the torpedo), we employ twin identical perforated paper tapes or player-piano rolls driven at identical constant speeds by synchronized clockwork or electric motors.

The perforations in the paper tapes step the carrier oscillator of the transmitter through a rapid sequence of discrete frequencies, while the identical paper roll in the torpedo synchronously tunes the local oscillator of the receiver to the exact same sequence of frequencies.

Should an enemy attempt to jam the signal, only a tiny fraction of the total transmission on any single frequency could be interfered with, while the rapid hopping to dozens of other frequencies ensures that the guidance impulses are received continuously and accurately.

Referring to the drawings:
Figure 1 is a schematic diagram of the radio transmitter system incorporating the frequency-hopping mechanism.
Figure 2 is a schematic diagram of the receiver system installed in the radio-guided torpedo.
Figure 3 is a perspective view of the synchronized slotted paper roll and stepping contact fingers.
Figure 4 is a diagram of the multi-frequency tuned tank circuits and bandpass filters.`,
  plainEnglishExplanation: {
    overview:
      "A radio-guided torpedo on one carrier is easy to jam: park noise on that frequency. Lamarr (who had sat through munitions-industry dinners in Vienna) and Antheil (who had scored Ballet Mécanique for sixteen synchronized player pianos) put a shared 88-slot sequence on both ends. The jammer, lacking the roll, hits only the slot it happens to occupy.",
    coreMechanism:
      "The transmitter and torpedo receiver each contain an identical slotted paper roll (like a player piano music roll). As the rolls unwind at identical speeds, contact fingers drop through perforations in the paper, switching the carrier frequency through a pseudo-random sequence of 88 channels several times per second. The torpedo receiver tunes its local oscillator to the exact same frequency hopping code in real time, locking onto the guidance signals while enemy jammers hear only brief clicks of white noise.",
    mechanicalBreakdown: [
      {
        title: "Perforated Player Piano Rolls & Stepper Mechanism",
        summary: "Dual synchronized paper tape rolls containing the pseudo-random hopping pattern.",
        technicalDetails:
          "Mechanical pre-digital pseudorandom number generators (PRNG). Synchronized stepping clockworks ensure carrier phase alignment ($\\Delta t < 10\\text{ ms}$) between transmitter and receiver.",
        archaicTerm: "Slotted record sheet / Player-piano mechanism",
        modernEquivalent: "Pseudo-random noise (PN) code generator",
      },
      {
        title: "88-Channel Variable Carrier Oscillator",
        summary: "An RF tuned circuit with 88 discrete LC frequency taps.",
        technicalDetails:
          "Spreads transmission bandwidth $W_{ss}$ across 88 channels. The anti-jamming processing gain is $G_p = 10 \\log_{10}(N) = 10 \\log_{10}(88) \\approx +19.4\\text{ dB}$, requiring the enemy to radiate nearly 100 times more RF power to jam the signal.",
        archaicTerm: "Eighty-eight carrier frequency circuits",
        modernEquivalent: "Direct digital frequency synthesizer (DDS)",
      },
      {
        title: "Synchronous Heterodyne Torpedo Receiver",
        summary: "A local oscillator that mirrors the exact frequency jumps of the transmitter.",
        technicalDetails:
          "Mixes incoming RF with the hopping local oscillator to produce a constant intermediate frequency ($IF = f_{RF}(t) - f_{LO}(t) = \\text{const}$), passing despread guidance commands to torpedo rudder servomotors.",
        archaicTerm: "Synchronized heterodyne receiver",
        modernEquivalent: "Spread-spectrum correlator & despreader",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Shannon Channel Capacity & Bandwidth Spreading",
        formula: "C = B \\log_2 \\left(1 + \\frac{S}{N}\\right), \\quad B_{spread} \\gg B_{info}",
        explanation:
          "By spreading a narrow information signal across a wide RF spectrum B, the signal can be transmitted with low power density and received reliably even when noise and jamming exceed signal power (S/N < 1).",
      },
      {
        principle: "Frequency-Hopping Processing Gain",
        formula: "G_p = \\frac{W_{ss}}{R_b} = 10 \\log_{10}(N_{channels}) = +19.4\\text{ dB}",
        explanation:
          "Processing gain represents the jamming immunity provided by spreading the signal across 88 orthogonal channels.",
      },
    ],
    whyItMattersToday:
      "Bluetooth AFH still hops a pre-agreed set. GPS and CDMA spread energy so a narrow jammer is a small slice of the band. The Navy did not field the 1942 piano-roll box; the 1997 EFF Pioneer Award recognized the claim chart, not a wartime production run.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A secret communication system comprising a transmitter having means for transmitting carrier waves of different frequencies, means for changing the carrier frequency periodically in a predetermined sequence, a receiver tuned to receive said waves, and means at the receiver for changing the tuned frequency in synchronism with the changes of frequency at the transmitter, substantially as described.",
      plainEnglish:
        "Transmitter and receiver step through the same predetermined frequency sequence so a listener on one channel sees only a slice of the message."
      keyInnovations: [
        "Frequency hopping spread spectrum",
        "Synchronized transmitter-receiver frequency shifts",
        "Anti-jamming secure wireless communication",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Frequency Hopping Transmitter & Piano Roll Mechanism",
      caption:
        "Schematic diagram showing RF carrier oscillator, 88-note slotted paper tape roll, stepping contact fingers, and antenna coupling.",
      svgType: "lamarr-frequency-hopping",
      callouts: [
        {
          id: "lf-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Perforated Piano Roll",
          description: "Punched paper tape stepping carrier frequencies in pseudo-random sequence.",
          x: 40,
          y: 40,
        },
        {
          id: "lf-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "88-Frequency Tank Circuit",
          description: "Capacitor-inductor bank generating 88 discrete RF channels.",
          x: 65,
          y: 35,
        },
        {
          id: "lf-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Transmitting Aerial",
          description: "Radiating spread-spectrum RF control pulses to torpedo receiver.",
          x: 85,
          y: 25,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "A radio-steered torpedo on one carrier is a gift to a destroyer's jammer: park noise on that frequency and the weapon goes deaf. Wire guidance snapped in a seaway. Lamarr, who had been married to Austrian munitions manufacturer Fritz Mandl, had sat through enough dinner talk about control links to know the failure mode.",
    priorArtLimitations: [
      "Fixed-frequency command links die when the jammer finds the tone.",
      "Wire-guided weapons lose the wire.",
      "A spread signal without a shared hop schedule is just noise at both ends.",
    ],
    breakthroughInsight:
      "Antheil had scored *Ballet Mécanique* for synchronized player pianos. Sixteen pianos only work if they share a roll. Put that roll on the transmitter and the receiver: 88 slots, a punched sequence, a hop the jammer cannot predict without the paper.",
    patentWars: [
      {
        rivalName: "The US Navy (by neglect, not a courtroom)",
        rivalClaim:
          "The Navy classified the idea, called the piano-roll mechanism too bulky for a torpedo, and did not build it in 1942.",
        conflictDetails:
          "Lamarr and Antheil assigned the patent to the government. They were told to sell war bonds instead. The 17-year term ran out before cellular and Wi-Fi existed, so there were no commercial royalties.",
        resolution:
          "Sonobuoy and secure-radio work in the 1950s–60s used hopping with electronics instead of paper. The Cuban Missile Crisis-era story is often overstated; the documented through-line is classified Navy R&D, then public spread-spectrum papers. The EFF Pioneer Award (1997) and the National Inventors Hall of Fame (2014) are the civilian catch-up.",
        legalOutcome:
          "US 2,292,387 issued and expired quietly. Credit arrived 50 years late. They were not the only people to think about hopping; they filed the wartime US patent that popular histories can point to.",
      },
    ],
    civilizationalImpact:
      "A shared hopping sequence is still how a Bluetooth piconet stays out of a microwave oven's way. The Hollywood origin is unusual; the information-theory move is not.",
    funFact:
      "Lamarr kept a drafting table on set. Antheil had been a concert provocateur in 1920s Paris. The patent office classified the pair as Hedy Kiesler Markey and George Antheil; MGM's publicity department was not involved.",
    aftermath:
      "Lamarr's later life was tabloid and difficult. She did not get rich from 2,292,387. Engineers who actually ship hoppers now cite her in the first slide and Shannon in the second.",
    sideNotes: [
      "The 88 keys are a metaphor that became a claim count. A real FHSS system picks the hop set from the band plan, not from a Steinway.",
      "Spread spectrum as a field also runs through Hedy's contemporaries in radar and through Shannon, Price, and Green. Do not flatten that into one actress and one composer.",
    ],
  },
};
