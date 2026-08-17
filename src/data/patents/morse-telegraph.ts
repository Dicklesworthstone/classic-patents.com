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
    "The Genesis patent of global telecommunications and information theory. Samuel Morse invented the electro-magnetic telegraph system combining the binary dot-and-dash variable-duration code, the spring-loaded electromagnetic receiver register, and long-distance relay circuits.",
  heroQuote:
    "Be it known that I, Samuel F. B. Morse, have invented a new method of transmitting intelligence between distant points by means of electro-magnetic circuits and a system of signs composed of dots and lines...",
  originalPdfUrl: "/patents/pdfs/us-1647-morse-telegraph.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1647A/en",
  usptoClassification: "H04L 15/00 (Telegraph signaling)",
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
      "Before Morse, optical semaphore towers (flashing flags or mechanical arms) were slow and blinded by fog or darkness. Previous electrical experimenters tried using 26 separate wires—one for every letter of the alphabet—which was hopelessly expensive. Samuel Morse reduced the entire English language to a binary time-duration code (dots and dashes) transmitted over a single iron wire, and invented the electromagnetic relay that refreshed electrical signals over thousands of miles.",
    coreMechanism:
      "A spring-loaded brass key opens and closes an electrical circuit. Tapping the key momentarily sends a short pulse (a 'dot'); holding it down sends a pulse three times as long (a 'dash'). At the receiving end, the electric current energizes a horseshoe electromagnet, which pulls down an iron armature bar with a sharp stylus against a clockwork-driven paper tape ribbon, embossing the message directly onto paper.",
    mechanicalBreakdown: [
      {
        title: "Spring-Loaded Brass Sending Key",
        summary:
          "A pivoting lever with platinum contact points for making and breaking the circuit.",
        technicalDetails:
          "Enables high-speed manual keying ($20\\text{ WPM}$). Contact bounce is dampened by an adjustable leaf spring and backstop screw.",
        archaicTerm: "Circuit-closer / Finger key",
        modernEquivalent: "Momentary tactile telegraph switch",
      },
      {
        title: "Clockwork-Driven Paper Register & Embossing Sounder",
        summary:
          "A spring-wound mechanical clockwork mechanism pulling paper tape beneath an electromagnet stylus.",
        technicalDetails:
          "The paper tape moves at a constant speed $v$. A current pulse of duration $\\Delta t$ creates an embossed line of physical length $L = v \\cdot \\Delta t$, producing visible dots ($L_0$) and dashes ($3L_0$).",
        archaicTerm: "Register with clockwork paper-movement",
        modernEquivalent: "Analog strip-chart paper recorder",
      },
      {
        title: "Electromagnetic Relay & Local Circuit Repeater",
        summary:
          "A sensitive low-current electromagnet that acts as an automated switch for a fresh local battery.",
        technicalDetails:
          "Long copper/iron telegraph lines suffer resistance attenuation ($V_{received} = V_0 e^{-\\alpha x}$). The relay uses tiny milliwatt currents to trip a local contact, switching a fresh 100V local battery into the next transmission link, enabling continent-wide networking.",
        archaicTerm: "Receiving-magnet / Relay",
        modernEquivalent: "Electromechanical relay / Digital signal repeater",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Binary Variable-Duration Information Coding",
        formula:
          "H = -\\sum_{i} p_i \\log_2(p_i), \\quad t_{dash} = 3 t_{dot}, \\quad t_{space} = t_{dot}",
        explanation:
          "Morse assigned the shortest code (single dot) to the most frequent letter ('E') and longer codes to rarer letters ('Q', 'Z'), an early precursor to Huffman entropy coding in modern information theory.",
      },
      {
        principle: "Electromagnetic Armature Pull",
        formula: "F = \\frac{(N I)^2 \\mu_0 A}{2 g^2}",
        explanation:
          "The mechanical attractive force on the sounder armature scales with the square of ampere-turns (NI), pulling the anvil down against the return spring.",
      },
    ],
    whyItMattersToday:
      "Morse created the first digital information network in human history. The concept of encoding symbolic language into binary pulses transmitted over electrical conduits is the direct conceptual ancestor of ASCII, TCP/IP packets, and the Internet.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The application of the motive power of electro-magnetism for generating signs or printing characters at a distance, substantially as described.",
      plainEnglish:
        "Claim covering the use of electromagnetism to move a physical armature and record characters or signs at a distance.",
      keyInnovations: [
        "Electromagnetic mechanical actuation",
        "Distant character recording",
        "Automated electrical writing",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The system of signs consisting of dots and lines and spaces, combined to form words and numerals, substantially as described.",
      plainEnglish: "The foundational claim covering the Morse Code alphabet and numbering system.",
      keyInnovations: [
        "Morse binary code alphabet",
        "Variable length time symbols",
        "Entropy-optimized information coding",
      ],
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
      "Information traveled at the speed of a galloping horse or sailing ship. When Morse's wife Lucretia died suddenly in New Haven in 1825, the letter informing Morse in Washington arrived days after her funeral had already taken place.",
    priorArtLimitations: [
      "Chappe optical semaphore arms were blocked by rain, night, and fog.",
      "Wheatstone-Cooke 5-needle telegraph required multiple expensive wires.",
    ],
    breakthroughInsight:
      "While returning from Europe on the packet ship *Sully* in 1832, Morse heard Dr. Charles Jackson discuss Faraday's discoveries and realized electricity travels instantaneously over wire and can be interrupted into coded symbols.",
    patentWars: [
      {
        rivalName: "Henry O'Reilly & The Telegraph Monopoly",
        rivalClaim:
          "Competitors claimed Morse could not patent the general idea of using electromagnetism to transmit letters.",
        conflictDetails:
          "In the historic Supreme Court case *O'Reilly v. Morse* (56 U.S. 62, 1854), the Court established foundational modern patent jurisprudence, invalidating Morse's overly broad Claim 8 (claiming electromagnetism in the abstract) while upholding all his specific apparatus and code claims.",
        resolution: "Morse received full legal protection for his system and code.",
        legalOutcome:
          "Defined the boundary between abstract natural laws and patentable inventions.",
      },
    ],
    civilizationalImpact:
      "Connected the world instantaneously, synchronizing stock markets, dispatching trains safely on single-track railroads, and creating the first electronic communications revolution.",
    funFact:
      "On May 24, 1844, Morse sent the historic first intercity telegraph message from the Supreme Court chamber in Washington, D.C. to Baltimore: 'What hath God wrought!'",
  },
};
