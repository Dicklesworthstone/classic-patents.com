import { bellTelephoneArchivalEdition } from "@/data/editions/bellTelephoneEdition";
import type { Patent } from "@/types/patent";

export const bellTelephonePatent: Patent = {
  id: "us-174465-bell-telephone",
  patentNumber: "US 174,465",
  title: "Improvement in Telegraphy",
  shortTitle: "Bell Telephone",
  subtitle: "Acoustic-to-Electric Transduction via Continuous Undulating Electrical Currents",
  inventors: ["Alexander Graham Bell"],
  inventorLocation: "Salem, Massachusetts",
  grantDate: "1876-03-07",
  filingDate: "1876-02-14",
  era: "Telecommunications Dawn (1870–1880)",
  category: "telecom",
  categoryLabel: "Telecommunications & Acoustics",
  summary:
    "Filed on February 14, 1876 and granted on March 7, US 174,465 describes harmonic telegraphy and the use of undulatory electrical currents. Bell connects a sound-driven membrane and armature to an electromagnetic receiver so that a current varying with the sound can set a distant armature in corresponding motion.",
  heroQuote:
    "Be it known that I, Alexander Graham Bell, of Salem, Massachusetts, have invented certain new and useful Improvements in Telegraphy, of which the following is a specification...",
  originalPdfUrl: "/patents/pdfs/us-174465-bell-telephone.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US174465A/en",
  usptoClassification: "H04M 1/00 (Telephonic systems; Transmitters)",
  originalTextAsset: {
    url: "/patents/transcripts/us-174465-bell-telephone-reviewed.txt",
    pageCount: 6,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "cb1a0fa7bd871937575e240adf904fa3ea8f462b3bfceb4e7cbbb0811909a8e9",
  },
  // This is a short catalogue excerpt only. The complete public source face is
  // the explicit archival edition below, never a formatter applied to this field.
  originalText: `UNITED STATES PATENT OFFICE.
ALEXANDER GRAHAM BELL, OF SALEM, MASSACHUSETTS.

IMPROVEMENT IN TELEGRAPHY.

Specification forming part of Letters Patent No. 174,465, dated March 7, 1876; application filed February 14, 1876.

To all whom it may concern:
Be it known that I, ALEXANDER GRAHAM BELL, of Salem, Massachusetts, have invented certain new and useful Improvements in Telegraphy, of which the following is a specification:

My present invention consists in the employment of a vibratory or undulatory current of electricity in contradistinction to a merely intermittent or pulsatory current, and of a method of, and apparatus for, producing electrical undulations upon the line-wire.

The method of, and apparatus for, transmitting vocal or other sounds telegraphically, as herein described, by causing electrical undulations, similar in form to the vibrations of the air accompanying the said vocal or other sounds, substantially as set forth.`,
  archivalEdition: bellTelephoneArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "Bell begins with harmonic telegraphy, where several tuned instruments share a wire and each receiver answers only the rate of vibration to which it is tuned. He argues that abrupt make-and-break signals become unhelpful as more instruments share the line. The specification instead treats a useful signal as an electrical variation that changes gradually with the vibrating body. That framework can carry pitch, loudness, and a compound waveform rather than only the on-or-off timing of a Morse key.",
    coreMechanism:
      "In Figure 7, sound moves membrane a inside cone A. The membrane carries spring armature c near electromagnet b, so its motion induces a varying current in the closed circuit. At the distant electromagnet f, the current makes armature h copy c's motion. Bell says a similar sound then proceeds from receiver I. The same specification also claims other ways to make a continuous current vary, including changing circuit resistance or battery power; those alternatives are not a claim that the depicted Figure 7 apparatus is a liquid transmitter.",
    mechanicalBreakdown: [
      {
        title: "Tuned harmonic-telegraph instruments",
        summary:
          "Several vibrating transmitters and receivers can share a circuit when each receiver has a distinct natural rate of vibration.",
        technicalDetails:
          "Figures 5 and 6 use spring armatures as mechanically resonant elements. A receiver in unison with a transmitter answers to its vibration, while another receiver with a different pitch stays quiet. Bell uses that selectivity to explain multiple telegraphic signals on one wire before applying the same vocabulary to voice.",
        archaicTerm: "In unison",
        modernEquivalent: "Matched mechanical resonance",
      },
      {
        title: "Inductive transmitter and receiver",
        summary:
          "A moving armature changes the magnetic relationship at one electromagnet; a matching armature responds at another.",
        technicalDetails:
          "In Figure 5, armature c is clamped to the uncovered leg of electromagnet A and projects above the covered leg. When c vibrates, the induced electrical variation traverses the circuit. At instrument I, electromagnet f drives armature h only when its resonance agrees with c. The patent does not specify a modern loudspeaker force law or measured acoustic fidelity.",
        archaicTerm: "Body capable of inductive action",
        modernEquivalent: "A moving conductor or magnetic body that changes magnetic flux",
      },
      {
        title: "Undulatory current and waveform sum",
        summary:
          "Bell contrasts gradual changes in an unbroken circuit with abrupt pulses caused by opening and closing it.",
        technicalDetails:
          "Figure 4 gives Bell's graphical account. The curve's height represents electrical intensity, its sign follows direction of vibration, and its horizontal spacing represents oscillation duration. The A+B curve is the algebraical sum of two sinusoidal curves. Bell's point is that simultaneous variations make a compound shape rather than erase one another.",
        archaicTerm: "Undulatory current",
        modernEquivalent: "Continuously varying electrical signal",
      },
      {
        title: "Voice-driven membrane in Figure 7",
        summary:
          "A cone directs sound to a stretched membrane; the membrane moves a nearby armature and the remote armature follows.",
        technicalDetails:
          "The voice mechanism is shown in Figure 7, not Figure 6. Cone A concentrates sound-vibrations on membrane a. The membrane drives armature c near electromagnet b, creating the circuit variation that reaches f. Armature h then copies c's motion, and the receiver's cone I radiates a similar sound. This is the apparatus tied most directly to Claim 5's wording about electrical undulations similar in form to air vibrations.",
        archaicTerm: "Sound-vibrations",
        modernEquivalent: "Time-varying acoustic pressure and membrane motion",
      },
      {
        title: "Resistance and battery-power alternatives",
        summary:
          "Claim 4 expressly reaches gradual changes in circuit resistance or battery power, in addition to electromagnetic induction.",
        technicalDetails:
          "Bell gives mercury or another liquid as an example of a resistance that changes when a conductor is immersed more or less deeply. He separately says that the reciprocal motion of battery elements can vary battery power. Those passages establish claimed methods of producing undulations; the drawing does not identify them as the specific voice transmitter in Figure 7.",
        archaicTerm: "Voltaic circuit",
        modernEquivalent: "Battery-powered electrical circuit",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Electromagnetic induction",
        formula: "emf = -N dΦ/dt",
        explanation:
          "A changing magnetic flux Φ through a coil produces an electromotive force. Bell's moving armature and magnet examples rely on the same causal idea: motion changes the magnetic condition and therefore creates a current variation. The formula is a modern compact statement, not printed notation from the patent.",
      },
      {
        principle: "Superposition of waveforms",
        formula: "combined trace = A + B",
        explanation:
          "Bell explicitly calls the A+B curve in Figure 4 the algebraical sum of two sinusoidal curves. He uses this to argue that two undulatory variations can coexist on one circuit with a recognizable compound shape.",
      },
      {
        principle: "Resistance-controlled current",
        formula: "I = V/R",
        explanation:
          "With a fixed battery voltage V, changing resistance R changes current I. Bell invokes this relation qualitatively when he describes a conductor entering mercury or another liquid more or less deeply. That example belongs to the broad resistance method in Claim 4, not to a made-up component list for Figure 7.",
      },
    ],
    whyItMattersToday:
      "The patent records a crucial shift from timing-only telegraph signals to electrical variations treated as shapes that can preserve pitch, loudness, and combinations. Its five claims were later tested in the nineteenth-century Telephone Cases. The page distinguishes those legal claims and the source's actual apparatus from later microphone, network, and electronics developments.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A system of telegraphy in which the receiver is set in vibration by the employment of undulatory currents of electricity, substantially as set forth.",
      plainEnglish:
        "Claims a telegraphy system in which an undulatory electrical current sets the receiving instrument in vibration. The claim names the receiver result, not a single detailed transmitter structure.",
      keyInnovations: [
        "Undulatory current signaling",
        "Vibratory receiver actuation",
        "Continuous wave telecommunication",
      ],
      legalSignificance:
        "The claim states the receiver-side system in unusually general terms and was one of the claims examined in the later Bell telephone litigation.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The combination, substantially as set forth, of a permanent magnet or other body capable of inductive action, with a closed circuit, so that the vibration of the one shall occasion electrical undulations in the other, or in itself, and this I claim, whether the permanent magnet be set in vibration in the neighborhood of the conducting-wire forming the circuit, or whether the conducting-wire be set in vibration in the neighborhood of the permanent magnet, or whether the conducting-wire and the permanent magnet both simultaneously be set in vibration in each other's neighborhood.",
      plainEnglish:
        "Claims the combination of a permanent magnet or other inductive body with a closed circuit when moving one relative to the other produces electrical undulations. It expressly covers moving the magnet, the wire, or both.",
      keyInnovations: [
        "Electromagnetic voice induction",
        "Closed-circuit transducer",
        "Vibration-to-current conversion",
      ],
      legalSignificance:
        "The claim ties the broad induction method to a closed-circuit combination and expressly lists the alternative relative motions discussed in the specification.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "The method of producing undulations in a continuous voltaic current by the vibration or motion of bodies capable of inductive action, or by the vibration or motion of the conducting-wire itself, in the neighborhood of such bodies, as set forth.",
      plainEnglish:
        "Claims the method of producing undulations in a continuous battery current by moving an inductive body or the conductor itself near such a body.",
      keyInnovations: [
        "Continuous voltaic current modulation",
        "Inductive waveform synthesis",
        "Analog signaling method",
      ],
      legalSignificance:
        "This is the method claim for the inductive examples that precede Figure 5, rather than a claim limited to the illustrated armature shape.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "The method of producing undulations in a continuous voltaic circuit by gradually increasing and diminishing the resistance of the circuit, or by gradually increasing and diminishing the power of the battery, as set forth.",
      plainEnglish:
        "Claims a second way to form an undulatory battery current: gradually vary either the circuit resistance or the battery's power, while retaining a continuous circuit.",
      keyInnovations: [
        "Variable resistance modulation",
        "Continuous uninterrupted current",
        "Closed-circuit analog voice encoding",
      ],
      legalSignificance:
        "The legal text reaches gradual resistance and power changes as alternatives. It should not be read as a claim that the printed Figure 7 is a liquid transmitter.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText:
        "The method of, and apparatus for, transmitting vocal or other sounds telegraphically, as herein described, by causing electrical undulations, similar in form to the vibrations of the air accompanying the said vocal or other sounds, substantially as set forth.",
      plainEnglish:
        "Claims the method and apparatus for sending vocal or other sounds by causing electrical undulations similar in form to the sound-caused air vibrations. It links the legal scope to the source's shape-correspondence account.",
      keyInnovations: [
        "Acoustic-to-electric analog parity",
        "Continuous voice waveform transmission",
        "The foundational claim of telephony",
      ],
      legalSignificance:
        "Claim 5 was among the claims at issue in the Supreme Court's 1888 Telephone Cases. The page does not treat that case as a blanket description of every later telephone technology.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 5",
      title: "Paired harmonic-telegraph instruments",
      caption:
        "Two electromagnetic instruments, A and I, joined by circuit e and battery g. Bell uses the figure to explain a transmitting armature c and a matching receiving armature h.",
      svgType: "bell-phone",
      callouts: [
        {
          id: "bp-5",
          figureRef: "Fig. 5",
          label: "h",
          element: "Receiving armature",
          description:
            "The armature at instrument I. Bell says it vibrates when its pitch is in unison with transmitting armature c.",
          x: 40,
          y: 40,
        },
        {
          id: "bp-6",
          figureRef: "Fig. 5",
          label: "b",
          element: "Leg of electromagnet A",
          description:
            "The printed leg label. Bell describes a coil on one leg and the spring armature c clamped to the uncovered leg d.",
          x: 60,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 6",
      title: "Three tuned groups on one telegraphic circuit",
      caption:
        "Three groups of harmonic-telegraph instruments, marked A, B, and C with primed counterparts, are connected to one circuit. The drawing illustrates pitch-selective response, not a liquid transmitter.",
      svgType: "bell-phone",
      callouts: [
        {
          id: "bp-1",
          figureRef: "Fig. 6",
          label: "A¹",
          element: "First A-group instrument",
          description:
            "One of the instruments that responds when the A group is set in vibration, according to Bell's accompanying text.",
          x: 20,
          y: 35,
        },
        {
          id: "bp-2",
          figureRef: "Fig. 6",
          label: "B¹",
          element: "First B-group instrument",
          description:
            "One of the differently tuned B instruments. Bell uses it to distinguish a group that responds to B rather than A.",
          x: 35,
          y: 45,
        },
        {
          id: "bp-3",
          figureRef: "Fig. 6",
          label: "C¹",
          element: "First C-group instrument",
          description:
            "One of the C instruments shown in the third group on the shared telegraphic circuit.",
          x: 48,
          y: 60,
        },
        {
          id: "bp-4",
          figureRef: "Fig. 6",
          label: "g",
          element: "Circuit connection label",
          description:
            "The printed figure label on the shared circuit, retained as a source callout without assigning it an invented component name.",
          x: 82,
          y: 45,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1870s, Western Union was the world's largest monopoly, earning vast fortunes from Morse telegraphy. However, telegraph wires were limited to sending one dot-and-dash message per line at a time. Inventors raced to create 'harmonic telegraphs' using tuned metal reeds to send multiple Morse channels simultaneously. While working on harmonic telegraphy, Bell realized that a far greater prize was possible: transmitting the actual human voice over electrical wires.",
    priorArtLimitations: [
      "Morse telegraphs were binary make-and-break circuits with no continuous amplitude or frequency modulation.",
      "Johann Philipp Reis (1861) built a 'Telephon' with a make-and-break diaphragm switch; it could transmit musical pitches but destroyed speech consonants and timbre.",
      "Elisha Gray's harmonic telegraph used vibrating reeds to interrupt current, which was incapable of continuous speech reproduction.",
    ],
    breakthroughInsight:
      "Bell realized that speech is an intricate superposition of complex harmonic air-pressure waves. To transmit speech electrically without distortion, the electrical circuit must remain unbroken and closed, carrying a continuous 'undulating' current whose amplitude and frequency vary smoothly in exact proportion to the acoustic pressure of speech.",
    patentWars: [
      {
        rivalName: "Elisha Gray, Thomas Edison, and Western Union",
        rivalClaim:
          "On the morning of February 14, 1876, Bell's attorney filed his patent application. Just hours later, rival inventor Elisha Gray filed a patent caveat for a liquid transmitter. Western Union acquired Gray's caveat and Thomas Edison's carbon microphone patent, launching the American Speaking Telephone Company to destroy Bell's startup.",
        conflictDetails:
          "Bell's company sued Western Union for patent infringement. In 1879, Western Union realized Bell's master patent was unbreakable and surrendered, selling all telephone patents and infrastructure to Bell in exchange for 20% of telephone royalties for 17 years. Over the next decade, over 600 separate legal challenges were brought against Bell's patent, culminating in *The Telephone Cases* (126 U.S. 1, 1888) before the US Supreme Court.",
        resolution:
          "The Supreme Court affirmed Bell's priority across all claims by a decisive majority, confirming US Patent No. 174,465 as the foundational legal title to the telephone.",
        legalOutcome:
          "Bell's patent was upheld as completely valid in the most extensive patent litigation in world history. The Bell Telephone Company evolved into the American Telephone and Telegraph Company (AT&T).",
      },
    ],
    civilizationalImpact:
      "The telephone fundamentally reorganized human civilization, collapsing geographical distance and enabling instantaneous real-time voice communication across cities and continents. It birthed the modern telecommunications industry, transoceanic cables, global communication networks, and the corporate research model pioneered by Bell Labs.",
    funFact:
      "On March 10, 1876—three days after this patent was granted—Bell uttered the famous first words over his liquid transmitter: 'Mr. Watson, come here, I want to see you.' Watson heard every syllable clearly in the next room, dropped his receiver, and ran into Bell's laboratory shouting, 'I hear you! I hear the words!'",
    aftermath:
      "Bell became enormously wealthy from telephone royalties but quickly grew weary of commercial litigation. He turned over corporate management to Gardiner Greene Hubbard, retired from AT&T, and dedicated the remainder of his life to scientific research—inventing the photophone (transmitting sound on light beams), metal detectors, hydrofoil speedboats, and tetrahedral aviation kites.",
    sideNotes: [
      "Bell's deep interest in acoustics arose from his family heritage: his father Alexander Melville Bell invented 'Visible Speech' for the deaf, and his mother Eliza and wife Mabel were both profoundly deaf.",
      "In 1877, Thomas Edison invented the carbon-button microphone, which dramatically amplified voice signals and became the standard telephone transmitter for the next 100 years, operating on the variable-resistance principle Bell patented in Claim 4.",
    ],
  },
  tags: [
    "Alexander Graham Bell",
    "Telephone",
    "Telecommunications",
    "Acoustics",
    "Electromagnetism",
    "Analog Signals",
    "19th Century",
    "Supreme Court",
  ],
  stats: {
    totalClaims: 5,
    independentClaims: 5,
    patentWarYears: "1876–1888",
    impactScore: 100,
  },
};
