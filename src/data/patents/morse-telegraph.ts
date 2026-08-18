import type { Patent } from "@/types/patent";

export const morseTelegraphPatent: Patent = {
  id: "us-1647-morse-telegraph",
  patentNumber: "US 1,647",
  title:
    "Improvement in the Mode of Communicating Information by Signals by the Application of Electro-Magnetism",
  shortTitle: "Morse Electro-Magnetic Telegraph",
  subtitle: "Binary Pulse Signaling, Variable-Duration Code, and Electro-Magnetic Relay Repeaters",
  inventors: ["Samuel F. B. Morse"],
  inventorLocation: "New York, New York",
  grantDate: "1840-06-20",
  filingDate: "1838-04-07",
  era: "Industrial Dawn (1840–1870)",
  category: "telecom",
  categoryLabel: "Telecommunications & Information Theory",
  summary:
    "The Invention of the Victorian Internet: On June 20, 1840, Samuel F. B. Morse received US Patent No. 1,647 for the electro-magnetic telegraph. Transforming telecommunications from optical flags and multi-wire European schemes to a single iron wire, Morse introduced three foundational innovations: a binary temporal pulse modulation scheme (Morse Code), an electromechanical strip-chart register driven by an electromagnet armature, and the world's first electromechanical relay repeater. The relay regenerated attenuated signals using fresh local batteries ($V_{rx} = V_0 e^{-\\alpha x}$), enabling instant communication across thousands of miles. The Supreme Court's 1854 *O'Reilly v. Morse* ruling on this patent remains the bedrock precedent for modern patent eligibility.",
  heroQuote:
    "Be it known that I, Samuel F. B. Morse, have invented a new method of transmitting intelligence between distant points by means of electro-magnetic circuits and a system of signs composed of dots and lines...",
  originalPdfUrl: "/patents/pdfs/us-1647-morse-telegraph.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1647A/en",
  usptoClassification: "H04L 15/00 (Telegraph signaling)",
  originalTextAsset: {
    url: "/patents/transcripts/us-1647-morse-telegraph.txt",
    pageCount: 9,
    kind: "reviewed-transcription",
  },
  originalText: `UNITED STATES PATENT OFFICE.
SAMUEL F. B. MORSE, OF NEW YORK, N. Y.

IMPROVEMENT IN THE MODE OF COMMUNICATING INFORMATION BY SIGNALS BY THE APPLICATION OF ELECTRO-MAGNETISM.

Letters Patent No. 1,647, dated June 20, 1840; Reissued January 15, 1846, No. 79; Reissued June 13, 1848, No. 117.

To all whom it may concern:
Be it known that I, SAMUEL F. B. MORSE, have invented a new and useful Machine and System of Signs for transmitting intelligence between distant points by means of Electro-Magnetism, of which the following is a full and exact description.

The nature of my invention consists in:
First, in a system of signs consisting of dots, lines, and spaces representing letters, numerals, and punctuation, adapted to be transmitted over electric conductors by closing and breaking a circuit for varying durations of time.

Second, in an apparatus consisting of an electro-magnet whose armature carries a pencil, pen, or steel marking-point, which is caused to mark upon a moving strip of paper whenever the circuit is closed, producing dots and lines corresponding in length to the duration of the current closure.

Third, in a transmitting apparatus or key by which the operator can open and close the circuit with great facility and precision.

Fourth, in the combination of a local receiving electro-magnet and battery circuit with a main line circuit, forming a Relay or Repeater, whereby the weak signal received over a long line closes a local battery circuit capable of recording the signal or repeating it over a subsequent length of wire, thereby enabling intelligence to be transmitted over unlimited distances.

Referring to the drawings:
Figure 1 is a side elevation of the recording register, showing the clockwork train for advancing the paper strip, and the electro-magnet and armature lever.
Figure 2 is a perspective view of the transmitting port-rule and key.
Figure 3 is a diagram of the relay circuit connecting the main line to the local sounder.
Figure 4 illustrates the dictionary of signs composed of dots and lines.`,
  plainEnglishExplanation: {
    overview:
      "Before Morse, long-distance communication moved at the speed of a galloping horse or a steam train. Optical semaphore towers were fast in clear daylight but completely blind at night, during rain, or in fog. Competing European electrical telegraphs (like Cooke and Wheatstone in England) required five separate wires and needle pointers to indicate single letters. Samuel Morse, partnered with machinist Alfred Vail and physicist Joseph Henry, reduced the entire system to a single wire pair, invented variable-duration binary encoding (Morse Code), and built electromechanical relays that re-energized fading electric signals across continent-spanning distances.",
    coreMechanism:
      "A telegraph operator presses a spring-loaded brass sending key, closing an electrical circuit powered by chemical batteries. Tapping the key briefly sends a 1-unit pulse (a 'dot'); holding it down sends a 3-unit pulse (a 'dash'). At the receiving station, this current energizes a horseshoe electromagnet, which magnetically pulls down an iron armature bar carrying a steel stylus. The stylus embosses visible dots and dashes onto a strip of paper tape driven at a constant speed by a clockwork gear train. For long-distance lines where electrical resistance weakens the current, a sensitive electromagnetic relay switch trips a local battery, regenerating a pristine full-voltage signal for the next leg of the journey.",
    mechanicalBreakdown: [
      {
        title: "Spring-Loaded Brass Sending Key",
        summary:
          "A pivoting lever with platinum contact points for making and breaking the circuit.",
        technicalDetails:
          "Enables high-speed manual keying ($20\\text{--}35\\text{ WPM}$). Contact bounce is dampened by an adjustable leaf spring and trunnion backstop screw.",
        archaicTerm: "Circuit-closer / Finger key",
        modernEquivalent: "Momentary tactile telegraph switch / Manual CW key",
      },
      {
        title: "Clockwork-Driven Paper Register & Embossing Sounder",
        summary:
          "A spring-wound mechanical clockwork mechanism pulling paper tape beneath an electromagnet stylus.",
        technicalDetails:
          "The paper tape moves at a constant speed $v$. A current pulse of duration $\\Delta t$ creates an embossed line of physical length $L = v \\cdot \\Delta t$, producing visible dots ($L_0$) and dashes ($3L_0$).",
        archaicTerm: "Register with clockwork paper-movement",
        modernEquivalent: "Analog strip-chart paper recorder / Line printer",
      },
      {
        title: "Electromagnetic Relay & Local Circuit Repeater",
        summary:
          "A sensitive low-current electromagnet that acts as an automated switch for a fresh local battery.",
        technicalDetails:
          "Long copper/iron telegraph lines suffer resistance attenuation ($V_{received} = V_0 e^{-\\alpha x}$). The relay uses tiny milliwatt currents to trip a local contact, switching a fresh 100V local battery into the next transmission link, enabling continent-wide networking.",
        archaicTerm: "Receiving-magnet / Relay",
        modernEquivalent: "Electromechanical relay / Digital signal repeater / Regeneration buffer",
      },
      {
        title: "Acoustic Brass Sounder (Audio Telegraphy)",
        summary: "An anvil-and-stop armature producing distinct tactile audio clicks.",
        technicalDetails:
          "Trained telegraph operators quickly learned to read messages by ear from the rhythmic sharp clicks of the iron armature striking its brass anvil stops, making paper tape obsolete for routine dispatch.",
        archaicTerm: "Acoustic receiving sounder",
        modernEquivalent: "Audio telemetry transducer / Auditory buzzer",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Variable-Duration Information Entropy Coding",
        formula:
          "H(X) = -\\sum_{i} P(x_i) \\log_2 P(x_i), \\quad t_{dash} = 3 t_{dot}, \\quad t_{char\\_space} = 3 t_{dot}",
        explanation:
          "Morse and Alfred Vail counted type sorts in a Morristown printing office to assign the shortest symbol (single dot) to the most frequent letter ('E') and longer symbols to rare letters ('Q', 'Z'), anticipating modern Huffman entropy compression by more than a century.",
      },
      {
        principle: "Electromagnet Solenoid Armature Force",
        formula: "F = \\frac{(N \\cdot I)^2 \\mu_0 A}{2 g^2}",
        explanation:
          "The mechanical pull exerted on the recording stylus armature scales with the square of ampere-turns ($N \\cdot I$), requiring sufficient coil windings ($N$) to pull down the steel stylus against the return spring even with weak line current.",
      },
      {
        principle: "RL Circuit Inductive Time Constant & Baud Rate",
        formula: "\\tau = \\frac{L}{R}, \\quad I(t) = \\frac{V}{R}\\left(1 - e^{-t/\\tau}\\right)",
        explanation:
          "The self-inductance ($L$) of long telegraph lines and electromagnet coils limits the rise time of current pulses, setting the upper physical speed limit (in words per minute) of manual keying.",
      },
      {
        principle: "Ohmic Line Attenuation & Relay Repeaters",
        formula: "V_{rx} = V_0 \\cdot e^{-\\alpha x}, \\quad \\alpha = \\sqrt{R \\cdot G}",
        explanation:
          "Signal voltage decays exponentially along long iron wire lines due to series resistance ($R$) and insulator conductance leakage ($G$). Morse's relay detects weak micro-currents to trigger a fresh 100V local battery, resetting attenuation to zero across indefinite continental distances.",
      },
      {
        principle: "Telegrapher's Equation & Pulse Dispersion",
        formula:
          "\\frac{\\partial^2 V}{\\partial x^2} = R C \\frac{\\partial V}{\\partial t} + L C \\frac{\\partial^2 V}{\\partial t^2}, \\quad v = \\frac{1}{\\sqrt{LC}}, \\quad Z_0 = \\sqrt{\\frac{R + j\\omega L}{G + j\\omega C}}",
        explanation:
          "Lord Kelvin and Oliver Heaviside mathematically modeled pulse propagation and dispersion along transatlantic telegraph submarine cables, laying the theoretical foundation for all high-frequency transmission line theory and microwave engineering.",
      },
    ],
    whyItMattersToday:
      "Every modern digital telecommunications network, binary packet protocol (TCP/IP), compression algorithm (Huffman/Shannon), and electromechanical relay traces its foundational lineage to Morse's 1840 patent. Furthermore, the Supreme Court's landmark 1854 *O'Reilly v. Morse* ruling remains the foundational legal precedent prohibiting patents on abstract natural principles.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "First, the application of the motive power of the electric or galvanic current, which I call electro-magnetism, for generating or producing motion at a distance, to print characters or mark signs upon a moving surface, substantially as described.",
      plainEnglish:
        "The master apparatus claim covering the use of electromagnetism to move a physical recording armature and mark signs or characters upon a moving recording surface.",
      keyInnovations: [
        "Electromechanical distant recording",
        "Magnetic armature stylus actuation",
        "Continuous paper tape marking",
      ],
      legalSignificance:
        "Upheld by the Supreme Court in *O'Reilly v. Morse* (1854) as a valid patent on a specific mechanical system for recording distant signals.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "Second, the system of signs consisting of dots and lines and spaces, combined to form words and numerals, substantially as described.",
      plainEnglish:
        "The foundational claim covering the Morse Code alphabet, numerals, and punctuation system composed of variable-duration dots, dashes, and spaces.",
      keyInnovations: [
        "Binary temporal pulse modulation",
        "Variable-length character encoding",
        "Frequency-weighted communication alphabet",
      ],
      legalSignificance:
        "Recognized as the legal cornerstone of discrete telecommunication codes, preceding modern binary digital computing by over a century.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "Third, the combination of a circuit-closer or key with the conductor and galvanic battery, for the purpose of breaking and closing the circuit in conformity with the system of signs, substantially as set forth.",
      plainEnglish:
        "A transmitting assembly combining a manual finger key, electrical conductor, and battery to easily make and break circuit pulses.",
      keyInnovations: [
        "Tactile finger key mechanism",
        "Spring-returned contact lever",
        "Instantaneous pulse transmission",
      ],
      legalSignificance:
        "Protected the ubiquitous manual telegraph key used worldwide for landline and maritime communications.",
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "Fourth, the combination of a main line circuit with a local receiving magnet and local battery circuit, forming a Relay or Repeater, whereby the closing of the main circuit closes a local battery circuit to actuate a sounder or register, substantially as described.",
      plainEnglish:
        "The electromechanical relay repeater: using a weak long-distance current to trip a sensitive magnetic switch, which activates a powerful local battery to record the message or retransmit it across the next line segment.",
      keyInnovations: [
        "Electromechanical signal amplification",
        "Automated circuit relaying",
        "Overcoming line resistance attenuation",
      ],
      legalSignificance:
        "The technological breakthrough that enabled transcontinental and transatlantic telegraphy without signal loss.",
    },
    {
      number: 5,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "Fifth, the recording register consisting of a clockwork mechanism for advancing paper tape at a uniform velocity beneath an electro-magnetically driven marking stylus.",
      plainEnglish:
        "The physical strip-chart recording instrument using clockwork gear trains to advance paper tape at constant speed beneath an embossing stylus.",
      keyInnovations: [
        "Uniform clockwork tape transport",
        "Embossed permanent paper record",
        "Constant-velocity time-to-distance conversion",
      ],
      legalSignificance:
        "Provided the permanent, non-volatile physical paper audit trail demanded by early commercial banking and railroad dispatchers.",
    },
    {
      number: 8,
      isIndependent: true,
      originalText:
        "Eighth, I do not propose to limit myself to the specific machinery or parts of machinery described in the foregoing specification and claims; the essence of my invention being the use of the motive power of the electric or galvanic current, which I call electro-magnetism, however developed, for making or printing intelligible characters, signs, or letters at any distances, being a new application of that power of which I claim to be the first inventor or discoverer.",
      plainEnglish:
        "The infamous 'Claim 8' attempting to patent the general use of electromagnetism for transmitting intelligence over any distance by any mechanical means whatsoever.",
      keyInnovations: [
        "Universal claim to electromagnetic communication",
        "Broad abstraction beyond specific machinery",
      ],
      legalSignificance:
        "Struck down by the U.S. Supreme Court in *O'Reilly v. Morse* (1854) as an impermissible attempt to patent an abstract law of nature, establishing Section 101 patent eligibility doctrine cited in modern software cases (*Alice*, *Mayo*).",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Morse Telegraph Register & Sounder",
      caption:
        "Elevation drawing showing clockwork weight drive, paper tape spool, horseshoe electromagnet, and embossing lever.",
      svgType: "morse-telegraph",
      callouts: [
        {
          id: "mt-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Horseshoe Electromagnet",
          description: "Dual insulated copper wire coils creating magnetic flux from line current.",
          x: 40,
          y: 45,
        },
        {
          id: "mt-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Pivoted Armature Lever",
          description: "Iron bar carrying steel embossing stylus against moving paper tape.",
          x: 55,
          y: 35,
        },
        {
          id: "mt-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Clockwork Paper Feed Rollers",
          description: "Spring-driven gears drawing paper tape from continuous spool.",
          x: 75,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1825, while Samuel F. B. Morse was in Washington, D.C. painting a portrait of the Marquis de Lafayette, a horse messenger delivered a letter from his father: *'Your dear wife is convalescent.'* The next day, a second letter arrived: *'Your wife is dead.'* By the time Morse returned home to New Haven, Connecticut, his beloved 25-year-old wife Lucretia had already been buried. Grief-stricken and outraged that news moved at the speed of horses, Morse dedicated his life to creating instantaneous electromagnetic telecommunications.",
    priorArtLimitations: [
      "Chappe optical semaphores were useless at night, during fog, rain, or snow.",
      "Cooke and Wheatstone's British 5-needle telegraph required 5 expensive copper lines and could not record messages.",
      "Early electrical experiments lost current over a few hundred feet due to wire resistance.",
    ],
    breakthroughInsight:
      "While sailing home from Europe aboard the packet ship *Sully* in 1832, Morse heard chemist Charles Jackson describe Michael Faraday's experiments with electromagnets. Morse realized that electric pulses could travel instantaneously along wires to actuate an electromagnet and write a code. Collaborating with brilliant machinist **Alfred Vail** (who engineered the key, register, and letter-frequency coding) and Princeton physicist **Joseph Henry** (who invented the high-intensity electromagnet and the relay repeater), Morse built the practical telegraph network.",
    patentWars: [
      {
        rivalName: "Henry O'Reilly and Western Telegraph Competitors",
        rivalClaim:
          "Telegraph entrepreneur Henry O'Reilly argued that Morse's Claim 8 was invalid because Morse could not patent the natural force of electromagnetism itself.",
        conflictDetails:
          "In the historic landmark case **O'Reilly v. Morse (56 U.S. 62, 1854)**, the United States Supreme Court ruled that while Morse's specific electromechanical machinery, telegraph key, relay repeater, and Morse Code were fully patentable, **Claim 8**—which claimed all use of electromagnetism for writing at a distance—was invalid.",
        resolution:
          "Chief Justice Roger Taney delivered the landmark majority opinion: *'He claims the exclusive right to every improvement where the motive power is the electric or galvanic current... This he cannot lawfully do. He who discovers a hitherto unknown law of nature cannot patent that law.'*",
        legalOutcome:
          "The *O'Reilly v. Morse* ruling established the fundamental doctrine of **Patent Eligibility (35 U.S.C. § 101)** that governs intellectual property today, prohibiting patents on laws of nature, natural phenomena, and abstract ideas (cited in *Diamond v. Diehr*, *Mayo v. Prometheus*, and *Alice Corp. v. CLS Bank*).",
      },
    ],
    civilizationalImpact:
      "On **May 24, 1844**, sitting in the Old Supreme Court Chamber in the U.S. Capitol in Washington, D.C., Samuel Morse tapped out the historic first formal telegraph message over a 44-mile line to the B&O Railroad Depot in Baltimore: **'WHAT HATH GOD WROUGHT'** (Numbers 23:23). Within two decades, over 100,000 miles of telegraph wire crisscrossed the United States, coordinating continental railroads, synchronizing stock markets, transmitting Civil War battlefield intelligence, and uniting the globe through the 1866 Transatlantic Cable.",
    funFact:
      "The phrase *'What hath God wrought'* was chosen not by Morse, but by Annie Ellsworth, the young daughter of U.S. Patent Commissioner Henry Ellsworth, who had been the first to bring Morse the news that Congress had approved a $30,000 grant to build the Washington-to-Baltimore telegraph line.",
    aftermath:
      "Morse became wealthy and internationally celebrated, though he engaged in bitter public disputes with Joseph Henry and Alfred Vail over their rightful credit for the relay and code. Morse used his telegraph fortune to become a major philanthropist, co-founding Vassar College and funding universities, churches, and artists before dying in New York City in 1872 at age 80.",
    sideNotes: [
      "The familiar SOS distress signal (· · · — — — · · ·) was adopted in 1905 because of its unmistakable rhythmic symmetry in Morse code, famously transmitted by the RMS *Titanic* in 1912.",
      "Before inventing the telegraph, Samuel Morse was one of America's finest portrait painters, elected as the first President of the National Academy of Design.",
    ],
  },
  tags: [
    "Samuel Morse",
    "Alfred Vail",
    "Joseph Henry",
    "Telegraph",
    "Morse Code",
    "Information Theory",
    "O'Reilly v. Morse",
    "Supreme Court",
    "19th Century",
  ],
  stats: {
    totalClaims: 6,
    independentClaims: 3,
    patentWarYears: "1848–1854",
    impactScore: 100,
  },
};
