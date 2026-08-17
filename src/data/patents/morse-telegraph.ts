import type { Patent } from "@/types/patent";

export const morseTelegraphPatent: Patent = {
  id: "us-1647-morse-telegraph",
  patentNumber: "US 1,647",
  title:
    "Improvement in the Mode of Communicating Information by Signals by the Application of Electro-Magnetism",
  shortTitle: "Morse Electric Telegraph & Code",
  subtitle: "Electromagnetic Relay Amplifiers & Variable-Length Binary Prefix Coding",
  inventors: ["Samuel F. B. Morse"],
  inventorLocation: "New York, NY",
  grantDate: "1840-06-20",
  filingDate: "1838-04-07",
  era: "First Telecommunications Revolution (1830-1850)",
  category: "telecom",
  categoryLabel: "Telegraphy & Information",
  summary:
    "Samuel F. B. Morse's historic master patent that inaugurated the digital telecommunications age. Morse invented an electromagnetic recording armature, the regenerative relay amplifier to overcome line resistance over hundreds of miles, and variable-length binary dot-dash prefix coding.",
  heroQuote:
    "The nature of my invention consists in a new method of transmitting signs and information to any distance by the application of electro-magnetism, producing sounds, marks, or signs on paper at a distant station.",
  originalPdfUrl: "/patents/pdfs/us-1647-morse-telegraph.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1647A/en",
  usptoClassification: "H04L 13/00; H04L 25/20",
  originalText: `TO ALL WHOM IT MAY CONCERN:
Be it known that I, SAMUEL F. B. MORSE, of the city of New York, have invented a new method of transmitting intelligence between distant points by means of electro-magnetism, for which I have obtained Letters Patent of the United States.

The nature of my invention consists:
First, in the application of the power of an electro-magnet to record signs at any distance on paper by means of a stylus or marking-lever.
Second, in a system of signs consisting of dots, spaces, and lines of different lengths, representing the alphabetical characters and numerals.
Third, in a novel instrument called a 'Relay' or local circuit repeater, whereby the feeble current of a long line is made to open and close the circuit of a fresh local battery, thereby repeating the signal across unlimited distances.
Fourth, in a receiving apparatus moved by clock-work mechanism to draw paper tape uniformly under the recording stylus.`,
  plainEnglishExplanation: {
    overview:
      "Before Morse, information could travel no faster than a galloping horse or a line-of-sight visual semaphore. Morse created the world's first global digital telecommunications network. He solved the severe physics problem of electrical wire resistance using electromagnetic relay repeaters, and invented the first optimal compression code (Morse Code, assigning shorter dot-dash sequences to high-frequency letters like 'E' and 'T').",
    coreMechanism:
      "A manual contact key pulses DC current through long iron wires. At distant stations, an electromagnet pulls down an iron armature against a spring. For long distances, the weak armature acts as an automatic switch (relay) to close a fresh local battery circuit, indefinitely cascading the signal across continents.",
    mechanicalBreakdown: [
      {
        title: "The Regenerative Electromagnetic Relay (Active Amplifier)",
        summary:
          "The fundamental active electronic switch that conquered signal attenuation across hundreds of miles.",
        technicalDetails:
          "Ohm's Law ($I = V/R$) meant that after 20–30 miles of telegraph wire, the electrical current dropped too low to drive a heavy mechanical inking pen. Morse and Leonard Gale inserted a delicate electromagnet whose light needle merely touched two electrical contacts, triggering a fresh local battery to re-transmit the pulse at full power to the next section.",
        archaicTerm: "Combined circuit repeater / Relay magnet",
        modernEquivalent: "Active digital signal repeater / Transistor switch",
      },
      {
        title: "Variable-Length Binary Prefix Coding (Morse Code)",
        summary:
          "The earliest statistical information-theoretic compression algorithm (predating Claude Shannon by 110 years).",
        technicalDetails:
          "Morse visited local print shops to count the quantities of each letter in typesetters' cases. Finding 'E' was the most frequent, he assigned it a single dot (·). 'T' got a single dash (-). Rare letters like 'Q' (--·-) and 'Z' (--··) received longer symbols, minimizing total channel transmission time.",
        archaicTerm: "Alphabetical signs of dots and lines",
        modernEquivalent: "Huffman variable-length binary prefix entropy coding",
      },
      {
        title: "The Clockwork Paper-Tape Register & Embossing Stylus",
        summary:
          "A spring-wound mechanical mechanism recording permanent physical records on moving paper tape.",
        technicalDetails:
          "A clockwork gear train pulled a continuous strip of paper tape under a steel stylus at constant velocity. When the electromagnet energized, the lever pressed the stylus into the paper, mechanically embossing dots and dashes for asynchronous decoding.",
        archaicTerm: "Register moved by clock-work mechanism",
        modernEquivalent: "Digital strip-chart data logger / Teletype printer",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Electromagnetic Induction & Solenoid Force",
        formula: "F ∝ (N · I)² / (2 μ₀ A)",
        explanation:
          "Current flowing through N turns of insulated copper wire around a soft iron core creates a concentrated magnetic field pulling the spring-loaded mechanical armature down.",
      },
      {
        principle: "Channel Time Optimization / Statistical Entropy",
        formula: "L = ∑ P(x_i) · length(x_i)",
        explanation:
          "Minimizing average message transmission latency by weighting character code lengths inversely proportional to letter frequencies in the English language.",
      },
    ],
    whyItMattersToday:
      "Morse created the concept of digital encoding, electrical relays (the conceptual ancestor of the computer logic gate), and active repeaters that today power the global fiber-optic Internet.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The application of electro-magnets in producing sounds or signs by the movement of an armature, for the purpose of communicating intelligence at a distance, substantially as set forth.",
      plainEnglish:
        "The master broad claim of using an electromagnet and movable armature to generate sounds or recorded signs for long-distance communication.",
      keyInnovations: [
        "Electromagnetic telegraph armature",
        "Remote signal actuator",
        "Paper tape stylus",
      ],
      legalSignificance:
        "One of the broadest patent claims ever granted in the US, giving Morse dominance over the emerging American telegraph network.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The system of signs consisting of dots and lines, arranged as described, representing letters and figures for communicating intelligence.",
      plainEnglish:
        "The formal legal protection for Morse Code: representing alphanumeric language through distinct combinations of dots, dashes, and timed spaces.",
      keyInnovations: ["Dot and dash alphabet", "Variable-length encoding", "Timed spacing rules"],
      legalSignificance:
        "The first patent covering a software/data-encoding alphabet protocol in human history.",
    },
    {
      number: 8,
      isIndependent: true,
      originalText:
        "I do not claim the use of the abstract power of electro-magnetism, but I claim the exclusive right to use electro-magnetism however developed for marking or printing characters, signs, or letters at any distances.",
      plainEnglish:
        "Morse's infamous Claim 8, attempting to claim ANY use of electromagnetism for transmitting printing characters at a distance.",
      keyInnovations: ["Universal electro-magnetic printing"],
      legalSignificance:
        "In the landmark 1854 Supreme Court case O'Reilly v. Morse (56 U.S. 62), the Court struck down Claim 8 as unconstitutionally broad, creating the modern doctrine that abstract ideas and natural laws cannot be patented.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Morse Electromagnetic Sounder & Clockwork Paper Tape Register",
      caption:
        "Showing electromagnet, fulcrum lever, spring return, inking stylus, and relay contact points.",
      svgType: "bell-phone",
      callouts: [
        {
          id: "electromagnet",
          figureRef: "Fig. 1",
          label: "Electromagnet Coils",
          element: "M",
          description:
            "Dual copper solenoids generating magnetic force upon receiving electrical current pulse.",
          x: 45,
          y: 40,
        },
        {
          id: "armature",
          figureRef: "Fig. 1",
          label: "Soft Iron Armature",
          element: "A",
          description:
            "Pivoting iron lever attracted by electromagnet to press stylus against moving paper.",
          x: 55,
          y: 35,
        },
        {
          id: "relay-contacts",
          figureRef: "Fig. 1",
          label: "Relay Circuit Contacts",
          element: "C",
          description:
            "Tungsten/platinum contacts closing local secondary battery circuit for regenerative signal repeat.",
          x: 75,
          y: 60,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1830s, sending a letter from Washington to Baltimore took days. Long-distance communication was limited by human physical travel or line-of-sight smoke/semaphore signals blinded by fog.",
    priorArtLimitations: [
      "William Fothergill Cooke & Charles Wheatstone (UK) used 5 needle galvanometers requiring 5 separate wires, making long-distance installation prohibitively expensive.",
      "Early single-wire systems suffered from signal extinction after 15 miles due to wire resistance ($R = \rho L/A$).",
      "No system had an automated recording mechanism to preserve messages when the operator was absent.",
    ],
    breakthroughInsight:
      "Morse combined a single-wire circuit with the regenerative electromagnetic relay amplifier and designed an asymmetrical variable-length binary alphabet (Morse code) that reduced mechanical complexity to a single wire and sounder.",
    patentWars: [
      {
        rivalName: "Henry O'Reilly & Alexander Bain",
        rivalClaim:
          "O'Reilly installed competing telegraph lines using Alexander Bain's chemical electrochemical recording telegraph, claiming Morse's patent was an illegal monopoly over the basic physics of electromagnetism.",
        conflictDetails:
          "Led to the historic Supreme Court case O'Reilly v. Morse, 56 U.S. (15 How.) 62 (1854), argued by future Chief Justice Salmon P. Chase.",
        resolution:
          "The Supreme Court upheld Claims 1–7 (Morse's specific mechanical instruments and code), but struck down Claim 8 (claiming all electro-magnetic communication in the abstract).",
        legalOutcome:
          "Established Section 101 patent eligibility doctrine: you can patent a specific machine or process applying a force of nature, but you cannot patent the abstract force of nature itself.",
      },
    ],
    civilizationalImpact:
      "Connected the world instantaneously for the first time. It unified national markets, enabled real-time news reporting (birth of the Associated Press), synchronized transcontinental railroads, and created the technical foundation for the global digital network.",
    funFact:
      "Morse was a renowned portrait painter (founder of the National Academy of Design) before turning to invention at age 41, inspired after a tragic incident where his wife died while he was painting in Washington and the horseback messenger arrived days too late.",
  },
  tags: ["Telegraph", "Morse Code", "Telecommunications", "Digital", "Relay", "Information Theory"],
  stats: {
    totalClaims: 8,
    independentClaims: 2,
    patentWarYears: "1840–1854 (14 Years)",
    impactScore: 100,
  },
};
