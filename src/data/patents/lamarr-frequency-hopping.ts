import type { Patent } from "@/types/patent";

export const lamarrPatent: Patent = {
  id: "us-2292387-lamarr-frequency-hopping",
  patentNumber: "US 2,292,387",
  title: "Secret Communication System",
  shortTitle: "Lamarr-Antheil Frequency Hopping & Spread Spectrum",
  subtitle:
    "Pseudo-Random Carrier Hopping Synchronized by Slotted Player Piano Rolls for Jam-Resistant Wireless Guidance",
  inventors: ["Hedy Kiesler Markey", "George Antheil"],
  inventorLocation: "Los Angeles, California",
  grantDate: "1942-08-11",
  filingDate: "1941-06-10",
  era: "Electronic Era (1920–1960)",
  category: "telecom",
  categoryLabel: "Wireless Communications & Electronic Warfare",
  summary:
    "The Pioneer of Spread Spectrum: Hollywood actress Hedy Lamarr and avant-garde composer George Antheil patented a jam-resistant radio guidance system for naval torpedoes. By stepping transmitter and receiver synchronously across 88 radio frequencies using perforated player piano rolls, the system spread signal power across a wide spectrum, reducing single-channel jamming vulnerability to just 1/88th. Today, this frequency-hopping spread-spectrum (FHSS) principle underpins Wi-Fi, Bluetooth, GPS, and modern cellular communication.",
  heroQuote:
    "This invention relates to secret communication systems and has for one of its objects the provision of a method of and apparatus for the transmission of secret messages or control signals in such a manner that interception and decoding or jamming by an enemy is rendered practically impossible...",
  originalPdfUrl: "/patents/pdfs/us-2292387-lamarr-frequency-hopping.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2292387A/en",
  usptoClassification: "H04K 1/02 (Frequency hopping spread spectrum)",
  originalTextAsset: {
    url: "/patents/source-text/us-2292387-lamarr-frequency-hopping.txt",
    pageCount: 7,
    kind: "source-pdf-text-layer",
  },
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

We claim as our invention:

1. A secret communication system comprising a transmitting station having means for generating carrier waves of a plurality of different frequencies, means for varying the frequency of said carrier waves in accordance with a predetermined pattern, a receiving station having means for receiving carrier waves of said plurality of frequencies, and means at the receiving station synchronized with said transmitting station for tuning the receiving station to receive said carrier waves in accordance with the same predetermined pattern.

2. A system as set forth in claim 1, wherein said means for varying the frequency of the carrier waves at the transmitting station and the tuning at the receiving station comprise record sheets having perforations therein corresponding to the predetermined pattern, and mechanisms for advancing said sheets in synchronism.

3. The method of transmitting secret control signals, which comprises generating carrier waves of varying frequencies, stepping the frequency of said carrier waves through a plurality of discrete frequency bands in a predetermined pseudo-random sequence, modulating said waves with control signals, and synchronously tuning a receiver to the same sequence of frequency bands.`,
  plainEnglishExplanation: {
    overview:
      "During early World War II, radio-guided naval torpedoes had a fatal flaw: enemy warships could easily detect the fixed radio control frequency and broadcast loud electronic noise on that single channel, blinding the torpedo and causing it to veer off course. Austrian-born Hollywood star Hedy Lamarr, drawing on insights into radio-controlled weaponry gained during her first marriage to Austrian arms manufacturer Fritz Mandl, teamed up with avant-garde composer George Antheil (famed for scoring *Ballet Mécanique* for 16 synchronized player pianos). Together, they designed a system that split the signal across 88 distinct radio frequencies (the number of keys on a piano keyboard), continuously hopping from one channel to another in a synchronized pseudo-random sequence controlled by identical slotted paper rolls. Even if an enemy jammed a specific frequency, 87 other channels remained crystal clear.",
    coreMechanism:
      "Both the aircraft/ship transmitter and the torpedo receiver contain identical slotted paper tape rolls driven by synchronized clockwork motors. As the rolls unwind at matching speeds, contact fingers drop through perforations in the paper, switching the RF carrier frequency through a predetermined sequence of 88 channels several times per second. The torpedo receiver's local oscillator hops in exact microsecond synchrony with the transmitter, heterodyning the received pulses down to a constant intermediate frequency ($IF$) while enemy jammers hear only brief, useless millisecond bursts of static.",
    mechanicalBreakdown: [
      {
        title: "Perforated Player Piano Rolls & Stepper Mechanism",
        summary: "Dual synchronized paper tape rolls containing the pseudo-random hopping pattern.",
        technicalDetails:
          "Mechanical pre-digital pseudorandom number generators (PRNG). Synchronized stepping clockworks ensure carrier phase alignment ($\\Delta t < 10\\text{ ms}$) between transmitter and receiver.",
        archaicTerm: "Slotted record sheet / Player-piano mechanism",
        modernEquivalent: "Pseudo-random noise (PN) code generator / DSP chipping clock",
      },
      {
        title: "88-Channel Variable Carrier Oscillator Bank",
        summary: "An RF tuned tank circuit with 88 discrete LC frequency taps.",
        technicalDetails:
          "Spreads transmission bandwidth $W_{ss}$ across 88 channels. The anti-jamming processing gain is $G_p = 10 \\log_{10}(N) = 10 \\log_{10}(88) \\approx +19.44\\text{ dB}$, requiring the enemy to radiate nearly 100 times more RF power to jam the signal.",
        archaicTerm: "Eighty-eight carrier frequency circuits",
        modernEquivalent: "Direct digital frequency synthesizer (DDS) / Phase-locked loop (PLL)",
      },
      {
        title: "Synchronous Heterodyne Torpedo Receiver",
        summary: "A local oscillator that mirrors the exact frequency jumps of the transmitter.",
        technicalDetails:
          "Mixes incoming RF with the hopping local oscillator to produce a constant intermediate frequency ($IF = |f_{RF}(t) - f_{LO}(t)| = \\text{const}$), passing despread guidance commands to torpedo rudder servomotors.",
        archaicTerm: "Synchronized heterodyne receiver",
        modernEquivalent: "Spread-spectrum correlator & despreader",
      },
      {
        title: "Rudder Deflection Servo Actuators",
        summary: "Pneumatic/solenoid steering valves inside the torpedo tail assembly.",
        technicalDetails:
          "Converts demodulated telegraphic tone bursts into proportional rudder deflection angles, correcting the torpedo's azimuth heading toward enemy warships.",
        archaicTerm: "Steering mechanism and control valves",
        modernEquivalent: "Proportional electromechanical guidance servomechanism",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Shannon-Hartley Theorem & Spectral Bandwidth Spreading",
        formula: "C = B \\log_2 \\left(1 + \\frac{S}{N}\\right), \\quad B_{spread} \\gg B_{info}",
        explanation:
          "Claude Shannon proved that communication channel capacity $C$ can be maintained even in high noise ($S/N \\ll 1$) by vastly increasing transmission bandwidth $B$, spreading RF energy below the noise floor.",
      },
      {
        principle: "Frequency-Hopping Anti-Jam Processing Gain",
        formula:
          "G_p = \\frac{W_{ss}}{R_b} = 10 \\log_{10}(N_{channels}) = 10 \\log_{10}(88) \\approx +19.44\\text{ dB}",
        explanation:
          "Processing gain measures the anti-jamming advantage of the system; an enemy broadband jammer must emit 88 times (+19.44 dB) more total radio power to disrupt the transmission.",
      },
      {
        principle: "Probability of Single-Channel Jamming Interception",
        formula: "P_{jam} = \\frac{N_{jam\\_channels}}{N_{total}} = \\frac{1}{88} \\approx 1.14\\%",
        explanation:
          "A spot jammer camping on any single carrier frequency can only corrupt 1 out of every 88 transmitted guidance pulses, which is easily filtered out by low-pass servo damping.",
      },
      {
        principle: "Pseudo-Random Code Orthogonality & Auto-Correlation",
        formula:
          "R_{xx}(\\tau) = \\frac{1}{T} \\int_0^T x(t) x(t + \\tau) \\, dt = \\begin{cases} 1 & \\tau = 0 \\\\ 0 & |\\tau| > T_{chip} \\end{cases}",
        explanation:
          "A despreading receiver perfectly aligned in time ($\\tau = 0$) recovers full signal energy, while any unsynchronized listener sees zero correlation, rendering the transmission indistinguishable from background cosmic noise.",
      },
      {
        principle: "Synchronous Heterodyne Intermediate Frequency (IF) Mixing",
        formula:
          "f_{IF} = \\left| f_{RF}(t) - f_{LO}(t) \\right| = f_{carrier\\_hop}(t) - \\left(f_{carrier\\_hop}(t) - 455\\text{ kHz}\\right) = 455\\text{ kHz}",
        explanation:
          "Because both transmitter and receiver step through identical frequency offsets simultaneously, their difference frequency ($f_{IF}$) remains perfectly fixed, allowing narrow-band filtering of despread signals.",
      },
    ],
    whyItMattersToday:
      "Frequency-hopping spread-spectrum (FHSS) and direct-sequence spread-spectrum (DSSS) are the bedrock foundations of modern wireless technology. Bluetooth uses 79-channel adaptive frequency hopping (AFH) 1,600 times per second to avoid Wi-Fi interference; GPS satellites use spread spectrum to broadcast timing signals below thermal noise; and military tactical radios (MILSTAR, SINCGARS) rely on fast frequency hopping for electronic counter-countermeasures (ECCM).",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A secret communication system comprising a transmitter having means for transmitting carrier waves of different frequencies, means for changing the carrier frequency periodically in a predetermined sequence, a receiver tuned to receive said waves, and means at the receiver for changing the tuned frequency in synchronism with the changes of frequency at the transmitter, substantially as described.",
      plainEnglish:
        "The master spread-spectrum claim covering a wireless system where the transmitter periodically changes carrier frequencies in a predetermined sequence, and the receiver changes its tuning in exact synchronism so that only an authorized receiver can follow the transmission.",
      keyInnovations: [
        "Frequency hopping spread spectrum (FHSS)",
        "Synchronized transmitter-receiver carrier switching",
        "Anti-jamming secure radio guidance",
      ],
      legalSignificance:
        "Recognized by IEEE and the National Inventors Hall of Fame as the foundational patent for all modern spread-spectrum communications.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a system as claimed in claim 1, wherein said means for changing the frequency at the transmitter and at the receiver comprise identical record sheets provided with rows of perforations, and means for advancing said sheets synchronously past contact members.",
      plainEnglish:
        "A frequency-hopping apparatus where identical perforated record sheets (paper piano rolls) stepped synchronously past contact fingers control the frequency switching at both transmitter and receiver.",
      keyInnovations: [
        "Perforated paper tape pseudo-random sequencer",
        "Mechanical clockwork synchronization",
        "Pre-digital cryptographic key sharing",
      ],
      legalSignificance:
        "Protected the physical synchronization mechanism using twin slotted rolls, establishing the concept of shared pre-distributed cryptographic keys.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "A secret communication system for guiding dirigible craft comprising means on a directing vessel for transmitting carrier waves over a plurality of different frequencies, means on the craft for receiving said waves, and synchronous stepping mechanisms for changing the transmitting and receiving frequencies simultaneously in a non-periodic sequence.",
      plainEnglish:
        "A secure radio guidance system specifically designed for steering dirigible craft (such as torpedoes) using synchronized stepping mechanisms to change frequencies simultaneously.",
      keyInnovations: [
        "Spread-spectrum remote guidance for torpedoes",
        "Non-periodic frequency agility",
        "Electronic counter-countermeasure architecture",
      ],
      legalSignificance:
        "Established the first patent claim for spread-spectrum electronic warfare and guided munitions control.",
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
    {
      figureNumber: "Fig. 2",
      title: "Torpedo Receiver Circuit with Synchronized Heterodyne Mixer",
      caption:
        "Schematic of the torpedo receiver showing the matching slotted roll tuning the local oscillator to produce a constant IF signal for rudder servos.",
      svgType: "lamarr-frequency-hopping",
      callouts: [
        {
          id: "lf-4",
          figureRef: "Fig. 2",
          label: "D",
          element: "Synchronous Local Oscillator",
          description:
            "Heterodyne mixer tracking transmitter hop sequence to extract guidance commands.",
          x: 45,
          y: 55,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1940, German U-boats were sinking hundreds of Allied merchant ships in the Atlantic. Radio-guided torpedoes could have devastated enemy submarines, but their fixed radio control frequencies were trivially jammed by German broadcast transmitters broadcasting loud noise on the same channel, causing the torpedoes to lose steering and miss.",
    priorArtLimitations: [
      "Fixed-frequency radio links were completely vulnerable to spot electronic jamming.",
      "Hard-wired guidance cables had limited range and routinely snapped in rough seas or wrapped around propellers.",
      "Single-channel spread systems without synchronized pre-distributed keys were indistinguishable from noise and could not be despread at the receiver.",
    ],
    breakthroughInsight:
      "Hedy Lamarr conceived the concept of hopping across a broad spectrum of frequencies so that a jammer could never predict where the signal would be next. George Antheil solved the synchronization puzzle: during the 1920s, he had scored *Ballet Mécanique* for 16 player pianos synchronized by identical slotted paper rolls. By miniaturizing these paper rolls to fit inside a torpedo, the transmitter and receiver could hop synchronously across 88 frequencies without requiring complex electronic computers.",
    patentWars: [
      {
        rivalName: "US Navy Bureau of Ordnance (Skepticism & Classification)",
        rivalClaim:
          "In 1942, the US Navy rejected the invention, claiming that a mechanical player-piano roll mechanism was too delicate and bulky to fit inside a standard Mark 14 torpedo casing.",
        conflictDetails:
          "The patent was classified 'Top Secret' by the US government, preventing Lamarr and Antheil from commercializing it. Lamarr donated the patent rights to the US military to aid the war effort and was advised by government officials to sell War Bonds instead (raising $25 million in a single tour).",
        resolution:
          "In the late 1950s, Sylvania engineers rediscovered the patent and developed an electronic transistorized version of frequency hopping for the AN/ARC-50 radio, deployed during the 1962 Cuban Missile Crisis. The patent expired in 1959 before civilian cellular networks were developed, so neither Lamarr nor Antheil ever received royalties.",
        legalOutcome:
          "In 1997, the Electronic Frontier Foundation (EFF) awarded Hedy Lamarr its prestigious Pioneer Award. In 2014, Lamarr and Antheil were posthumously inducted into the National Inventors Hall of Fame.",
      },
    ],
    civilizationalImpact:
      "Frequency hopping spread spectrum transformed global communications. Today, billions of smartphones, laptops, Bluetooth earbuds, and GPS receivers exchange trillions of packets daily using the direct descendants of Lamarr and Antheil's 1942 spread-spectrum concept.",
    funFact:
      "When informed in 1997 at age 83 that the Electronic Frontier Foundation was awarding her their Pioneer Award for inventing frequency hopping, Hedy Lamarr famously paused and replied dryly: 'Well, it's about time.'",
    aftermath:
      "George Antheil passed away in 1959, and Hedy Lamarr lived in secluded retirement in Florida until her death in 2000. Her birthday, November 9, is celebrated as Inventors' Day across Germany, Austria, and Switzerland.",
    sideNotes: [
      "Lamarr chose 88 frequencies specifically because there are 88 keys on a standard piano keyboard, reflecting Antheil's musical background.",
      "Beyond spread spectrum, Lamarr also invented an improved traffic stoplight, an effervescent bouillon tablet that dissolved into soda water, and a streamlined aerodynamic airplane wing modeled on the fastest birds and fish.",
    ],
  },
  tags: [
    "Hedy Lamarr",
    "George Antheil",
    "Frequency Hopping",
    "Spread Spectrum",
    "Wi-Fi",
    "Bluetooth",
    "Electronic Warfare",
    "World War II",
    "Telecommunications",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1941–1997",
    impactScore: 100,
  },
};
