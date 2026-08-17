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
    "The genesis of spread-spectrum wireless communication: Hollywood actress Hedy Lamarr and avant-garde composer George Antheil co-invented frequency hopping to steer radio-guided torpedoes without Axis enemy jamming, establishing the foundation for modern Wi-Fi, Bluetooth, GPS, and cellular CDMA networks.",
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
      "During World War II, Allied radio-guided torpedoes were easily jammed by Nazi warships broadcasting interference on the torpedo's fixed radio channel, causing the weapon to veer off course. Austrian-born Hollywood star Hedy Lamarr and avant-garde composer George Antheil (who had composed a symphony for 16 synchronized player pianos) realized that if the radio signal 'hopped' randomly across 88 different frequencies—like fingers jumping across piano keys—an enemy could never jam it without knowing the secret synchronized sequence.",
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
      "Lamarr and Antheil's spread-spectrum patent is the foundational intellectual ancestor of all modern wireless protocols—Wi-Fi (802.11), Bluetooth frequency hopping (AFH), military anti-jamming tactical communications (SINCGARS), GPS satellite ranging, and 3G/4G CDMA cell phones.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A secret communication system comprising a transmitter having means for transmitting carrier waves of different frequencies, means for changing the carrier frequency periodically in a predetermined sequence, a receiver tuned to receive said waves, and means at the receiver for changing the tuned frequency in synchronism with the changes of frequency at the transmitter, substantially as described.",
      plainEnglish:
        "The master patent claim covering Frequency Hopping Spread Spectrum (FHSS): transmitting over different frequencies changed in a predetermined sequence, and synchronously changing the receiver's tuned frequency.",
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
      "In 1940, Nazi U-boats were sinking hundreds of Allied supply ships in the Atlantic. Early Allied radio-guided torpedoes were vulnerable to simple radio jamming by German destroyers.",
    priorArtLimitations: [
      "Fixed-frequency radio controls could be jammed by broadcasting noise on the same channel.",
      "Direct wire-guided torpedoes snapped their cables in heavy ocean swells.",
    ],
    breakthroughInsight:
      "While playing piano duets in Hollywood, Lamarr and Antheil realized that if both players change notes in unison according to a shared score, a radio signal could jump between frequencies without the enemy knowing where it was going next.",
    patentWars: [
      {
        rivalName: "United States Navy & National Inventors Council",
        rivalClaim:
          "The U.S. Navy initially classified the patent Top Secret, filed it away as 'too bulky' for torpedoes, and did not adopt it until the 1962 Cuban Missile Crisis (using transistors instead of paper rolls).",
        conflictDetails:
          "Neither Lamarr nor Antheil ever received a dime in royalties during the 17-year patent lifespan, as the patent expired before commercial cellular and Wi-Fi deployment.",
        resolution:
          "In 1997, the Electronic Frontier Foundation (EFF) awarded Hedy Lamarr their Pioneer Award. In 2014, Lamarr and Antheil were posthumously inducted into the National Inventors Hall of Fame.",
        legalOutcome:
          "Universally acknowledged as the co-inventors of spread-spectrum communication.",
      },
    ],
    civilizationalImpact:
      "Underpins billions of mobile phones, Wi-Fi routers, Bluetooth headsets, GPS satellites, and secure military defense networks around the world.",
    funFact:
      "Hedy Lamarr was not only a glamorous Hollywood actress starring alongside Clark Gable and Spencer Tracy, but she also maintained an invention drafting table in her trailer on movie sets.",
  },
};
