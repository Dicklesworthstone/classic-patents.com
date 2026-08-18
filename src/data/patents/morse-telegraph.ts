import type { Patent } from "@/types/patent";
import { morseTelegraphArchivalEdition } from "../editions/morseTelegraphEdition";

/** Keep the catalogue decoder tied to the published hand-authored legal node. */
function manualClaimText(number: number): string {
  const block = morseTelegraphArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Morse manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

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
    "US 1,647, granted June 20, 1840, describes Morse's American Electro-Magnetic Telegraph as a linked system: metallic conductors, mechanical type for numerical and letter signs, straight or circular port-rules, a signal lever that interrupts the circuit, a register that marks a moving surface, a numbered vocabulary, and methods for laying the line. The pinned nine-page facsimile is the 1840 specification, including three drawing sheets and nine printed claims.",
  heroQuote:
    'I denominate said invention the "American Electro-Magnetic Telegraph," of which the following is a full and exact description, to wit:',
  originalPdfUrl: "/patents/pdfs/us-1647-morse-telegraph.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1647A/en",
  usptoClassification: "H04L 15/00 (Telegraph signaling)",
  originalTextAsset: {
    url: "/patents/transcripts/us-1647-morse-telegraph-reviewed.txt",
    pageCount: 9,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "07a534f54894e6130980052a77c565492e53d6cd527c092b47016e8cc243ed93",
  },
  archivalEdition: morseTelegraphArchivalEdition,
  originalText: `UNITED STATES PATENT OFFICE.
SAMUEL F. B. MORSE, OF NEW YORK, N. Y.

IMPROVEMENT IN THE MODE OF COMMUNICATING INFORMATION BY SIGNALS BY THE APPLICATION OF ELECTRO-MAGNETISM.

No. 1,647. Specification forming part of Letters Patent No. 1,647, dated June 20, 1840.

To all whom it may concern:
Be it known that I, the undersigned, SAMUEL F. B. MORSE, of the city, county, and State of New York, have invented a new and useful machine and system of signs for transmitting intelligence between distant points by the means of a new application and effect of electro-magnetism in producing sounds and signs, or either, and also for recording permanently by the same means, and application, and effect of electro-magnetism, any signs thus produced and representing intelligence, transmitted as before named between distant points; and I denominate said invention the "American Electro-Magnetic Telegraph," of which the following is a full and exact description, to wit:`,
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
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 covers the stated combination of the type-rule, straight and circular port-rules, two signal levers, register lever, alarm lever and hammer, with the electro-magnet armatures that operate those levers. The legal unit is this particular coordinated machine, not electromagnetism in the abstract.",
      keyInnovations: ["Type-rule", "Port-rules", "Electromagnet armatures"],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 adds the recording cylinder, its rollers, and the clockwork train to the mechanism already described. It claims the particular arrangement that carries a recording material and coordinates its motion with the marking apparatus.",
      keyInnovations: ["Recording cylinder", "Rollers", "Train-wheels"],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 claims the specified type and sign system when used with metallic conductors, electromagnetism, and the described mechanism to communicate between distant points. It is limited by that combined system; the printed claim does not say that every code or every electric message is claimed.",
      keyInnovations: ["Sign system", "Metallic conductors", "Telegraph mechanism"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 concerns the mechanical process that opens and closes a galvanic current in a metallic-conductor circuit. In the specification, the teeth and lever control the immersion contacts, turning the circuit on and off to form the selected signs.",
      keyInnovations: ["Circuit interruption", "Signal lever", "Mercury contacts"],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "Claim 5 addresses carrying and connecting current through any desired number of metallic-conductor circuits from a known generator. The specification supplies the concrete relay arrangement: one circuit's magnet moves a forked wire into a fresh circuit's contacts.",
      keyInnovations: ["Successive circuits", "Fresh battery", "Relay connection"],
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualClaimText(6),
      plainEnglish:
        "Claim 6 states the use of electro-magnets in one or more metallic circuits to move the stated levers and machinery, so signs and sounds can communicate intelligence at distant and simultaneous points. The scope remains anchored to the described machine and its moving levers.",
      keyInnovations: ["Electromagnets", "Lever motion", "Simultaneous points"],
    },
    {
      number: 7,
      isIndependent: true,
      originalText: manualClaimText(7),
      plainEnglish:
        "Claim 7 covers permanently marking transmitted signs by the specified application of electro-magnetism or galvanism. The register turns magnetic attraction into a pen or other marker's contact with a moving recording surface.",
      keyInnovations: ["Permanent record", "Register lever", "Marking instrument"],
    },
    {
      number: 8,
      isIndependent: true,
      originalText: manualClaimText(8),
      plainEnglish:
        "Claim 8 is the printed combination of electro-magnets in metallic circuits with magnet armatures for transmitting intelligence by signs or sounds to distant and simultaneous points. It is a machine-combination claim, not the later, much broader claim frequently associated with Morse litigation.",
      keyInnovations: ["Magnet armatures", "Signs and sounds", "Multiple destinations"],
    },
    {
      number: 9,
      isIndependent: true,
      originalText: manualClaimText(9),
      plainEnglish:
        "Claim 9 joins the mechanism, the system of type and signs, and the numbered dictionary or vocabulary. The vocabulary lets an operator designate whole words through numerical signs; the claim is to their mutual adaptation within this telegraph system.",
      keyInnovations: ["Dictionary vocabulary", "Numbered words", "Type and signs"],
    },
  ],
  drawings: [
    {
      figureNumber: "Example 10, Fig. 1",
      title: "Register, perspective view",
      caption:
        "Sheet 3 of 3, Example 10, Fig. 1: the register in perspective. The source specification identifies lever A, its armature and magnet, the marking instrument, cylinder, rollers, and clockwork in the accompanying Example 10 figures.",
      svgType: "morse-telegraph",
      callouts: [
        {
          id: "mt-1",
          figureRef: "Example 10, Fig. 1",
          label: "A",
          element: "Register lever",
          description:
            "The source calls A the register lever. Its armature faces an electro-magnet; the other end carries a pencil, pen, printing wheel, or other marking instrument.",
          x: 60,
          y: 36,
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
    totalClaims: 9,
    independentClaims: 9,
    patentWarYears: "1848–1854",
  },
};
