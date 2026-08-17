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
    "Morse's 1840 system: a single wire, a code of dots and dashes, an electromagnet that marks paper (later just clicks), and a relay that rebuilds the pulse before the line resistance kills it. Wheatstone needed five needles and five wires; Morse needed one pair and a trained ear.",
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
      "Variable-length codes for frequent letters (E is a single dot) are still how compression starts. O'Reilly v. Morse (1854) is the case first-year patent courses use when they teach that you cannot claim electromagnetism itself.",
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
      "In 1825 Morse, painting in Washington, learned by letter that his wife Lucretia had died in New Haven and been buried before he could start home. News moved at horse or packet speed. Chappe's optical towers were faster in clear French weather and useless at night or in fog.",
    priorArtLimitations: [
      "Semaphore arms need line-of-sight and daylight.",
      "Wheatstone and Cooke's five-needle British telegraph needed a wire per needle.",
      "Steinheil and Gauss–Weber laboratory needles did not yet make a cheap American line.",
    ],
    breakthroughInsight:
      "On the packet Sully in 1832, chemist Charles Jackson talked about Faraday. Morse, a painter, not an electrician, jumped to a practical picture: break a circuit in a pattern, mark paper at the other end. Alfred Vail later rebuilt the apparatus and the code. Joseph Henry's intensity magnet and relay made the long line possible. The patent issued in Morse's name; the shop was a trio.",
    patentWars: [
      {
        rivalName: "Henry O'Reilly",
        rivalClaim:
          "O'Reilly's lines used Morse gear and then argued the patent claimed a force of nature.",
        conflictDetails:
          "O'Reilly v. Morse, 56 U.S. 62 (1854), struck Claim 8, which tried to cover every use of electromagnetism for writing at a distance. The Court kept the specific register, the code, and the relayed circuit.",
        resolution:
          "Morse kept a working monopoly on the American recording telegraph. He did not keep a monopoly on electricity.",
        legalOutcome:
          "The ancestor of every modern 'abstract idea' opinion. You may claim a machine. You may not claim a law of nature.",
      },
    ],
    civilizationalImpact:
      "Single-track railroads could be dispatched without collisions. Prices in New York and Chicago began to move on the same afternoon. The 1866 Atlantic cable carried the same code.",
    funFact:
      "24 May 1844, Supreme Court chamber to the B&O depot in Baltimore: 'What hath God wrought!' Annie Ellsworth chose the Numbers 23:23 line. Congress had funded the 40-mile wire with $30,000 after years of Morse lobbying.",
    aftermath:
      "Morse spent the 1850s in court and on portrait commissions. He died rich enough, in 1872, and still angry at Vail and Henry's public credit. Historians now split the invention the way the shop actually split the work.",
    sideNotes: [
      "The original Morse code and the later International Morse used at sea are not the same table. American Morse lingered on US landlines into the 20th century.",
      "Vail's family money built the first instruments. The 1840 patent does not name him.",
      "Henry refused to fight Morse in court. He did tell every reporter that the relay was his.",
    ],
  },
};
