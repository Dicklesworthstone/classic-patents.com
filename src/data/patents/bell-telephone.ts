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
    "Bell's 14 February 1876 filing (granted 7 March, three days before the famous Watson sentence) covers a closed circuit whose current follows the air-pressure wave of speech. Make-and-break telegraph contacts destroy that wave; an undulating current keeps it.",
  heroQuote:
    "Be it known that I, Alexander Graham Bell, of Salem, Massachusetts, have invented certain new and useful Improvements in Telegraphy, of which the following is a specification...",
  originalPdfUrl: "/patents/pdfs/us-174465-bell-telephone.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US174465A/en",
  usptoClassification: "H04M 1/00 (Telephonic systems; Transmitters)",
  originalTextAsset: {
    url: "/patents/transcripts/us-174465-bell-telephone.txt",
    pageCount: 6,
  },
  originalText: `UNITED STATES PATENT OFFICE.
ALEXANDER GRAHAM BELL, OF SALEM, MASSACHUSETTS.

IMPROVEMENT IN TELEGRAPHY.

Specification forming part of Letters Patent No. 174,465, dated March 7, 1876; application filed February 14, 1876.

To all whom it may concern:
Be it known that I, ALEXANDER GRAHAM BELL, of Salem, Massachusetts, have invented certain new and useful Improvements in Telegraphy, of which the following is a specification:

In Letters Patent granted to me April 6, 1875, No. 161,739, I have described a method of, and apparatus for, transmitting two or more telegraphic signals simultaneously along a single wire by the employment of transmitting-instruments, each of which occasions a succession of electrical impulses differing in rate from the others; and of receiving-instruments, each tuned to a pitch at which it will be put in vibration to produce its fundamental tone by one only of the transmitting-instruments.

My present invention consists in the method of, and apparatus for, transmitting vocal or other sounds telegraphically, as hereinafter set forth, by causing electrical undulations, similar in form to the vibrations of the air accompanying the said vocal or other sounds.

In illustration of my method of creating a continuous undulating current of electricity, I shall show and describe several forms of apparatus, although it will be understood that the method is not confined to the specific apparatus herein illustrated.

One such method consists in causing an armature to vibrate in front of the poles of an electro-magnet in a closed circuit, thereby inducing undulating currents in the coils of the magnet corresponding in frequency and amplitude to the acoustic vibrations of the armature.

Another method consists in causing a conducting wire or needle attached to a vibrating membrane to dip into a conducting liquid of variable resistance (such as acidulated water), whereby the vibration of the membrane causes the electrical resistance of the circuit to vary continuously without interrupting the current, generating undulating electrical currents that correspond in waveform to the acoustic pressure of the spoken words.

At the receiving station, these undulating currents pass through the coils of an electro-magnet having an armature or membrane placed in proximity to its pole. The varying magnetic attraction of the electro-magnet causes the receiving membrane to vibrate in exact synchrony with the transmitter, reproducing the original vocal sounds to the human ear.

Referring to the drawings:
Figure 1 illustrates a battery and intermittent contact circuit producing pulsatory currents.
Figure 2 represents an undulating current consisting of continuous sinusoidal waves.
Figure 3 represents a compound undulating current resulting from simultaneous multiple frequencies.
Figure 4 represents the waveform produced by human speech.
Figure 5 illustrates an electromagnetic transmitting and receiving instrument.
Figure 6 illustrates a variable-resistance liquid transmitter and membrane receiver connected in circuit.
Figure 7 is a diagram showing the telephonic circuit including battery, transmitter, line wire, and receiver.`,
  plainEnglishExplanation: {
    overview:
      "In 1875 a telegraph was a switch: circuit open or closed. Philipp Reis and others tried to send speech by letting a vibrating reed make and break that switch. Vowels are stacks of harmonics ($f_1, f_2, f_3, \\ldots$); chopping the current into clicks throws those harmonics away. Bell kept the circuit closed and let the current rise and fall with the air-pressure wave.",
    coreMechanism:
      "When a speaker speaks into a mouthpiece, the acoustic sound pressure waves strike a flexible metallic or parchment diaphragm. The diaphragm is coupled to a small wire needle immersed in an electrically conductive liquid (acidified water) or an electromagnet. As the diaphragm vibrates back and forth with sound waves, the electrical resistance of the circuit modulates continuously in direct proportion to the diaphragm's position ($R(t) = R_0 + \\Delta R \\sin(\\omega t)$). By Ohm's Law ($I(t) = V / R(t)$), this generates a continuous undulating analog current that travels down the wire and causes an electromagnet in the receiver to vibrate an identical iron diaphragm, faithfully reconstructing the audible human voice.",
    mechanicalBreakdown: [
      {
        title: "Acoustic Diaphragm & Variable Resistance Needle",
        summary:
          "A taut diaphragm that moves a conducting rod in and out of a conductive liquid cup.",
        technicalDetails:
          "The liquid transmitter utilized a platinum needle dipped into a cup of diluted sulfuric acid. Deep immersion lowered electrical resistance; shallow immersion raised it ($R \\propto 1/A_{submerged}$). This transduced mechanical acoustic pressure $P(t)$ into a continuous electrical resistance function $R(t)$ without breaking contact.",
        archaicTerm: "Liquid transmitter of variable resistance",
        modernEquivalent: "Variable resistance acoustic microphone / transducer",
      },
      {
        title: "Electromagnetic Membrane Receiver",
        summary: "A permanent magnet with an iron-wound coil placed close to an iron diaphragm.",
        technicalDetails:
          "At the receiving end, the undulating current $I(t)$ passed through an electromagnet coil, producing a dynamic magnetic force $F(t) = \\frac{B(t)^2 A}{2\\mu_0}$ on a thin soft-iron membrane. The membrane vibrated in exact acoustic synchrony with the original voice wave.",
        archaicTerm: "Electro-magnet with armature diaphragm",
        modernEquivalent: "Electromagnetic speaker / headphone driver",
      },
      {
        title: "Continuous Undulating Electrical Current",
        summary: "An unbroken analog electrical wave representing multi-frequency sound.",
        technicalDetails:
          "Unlike binary pulsed currents (on/off make-and-break), an undulating current varies smoothly in amplitude and frequency: $I(t) = I_{DC} + \\sum A_k \\sin(\\omega_k t + \\phi_k)$, preserving timbre, consonants, and vowels.",
        archaicTerm: "Electrical undulations similar in form to vibrations of air",
        modernEquivalent: "Analog audio signal transmission",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Acoustic Pressure to Electrical Resistance Transduction",
        formula:
          "R(t) = R_0 - k \\cdot x(t), \\quad I(t) = \\frac{V_{battery}}{R(t)} \\approx I_0 + \\frac{V_{battery} k}{R_0^2} x(t)",
        explanation:
          "Small diaphragm displacements x(t) linearly modulate the electrical resistance and line current, creating an analog electrical replica of speech.",
      },
      {
        principle: "Fourier Theorem & Acoustic Wave Synthesis",
        formula: "p(t) = \\sum_{n=1}^{\\infty} P_n \\sin(n \\omega_0 t + \\theta_n)",
        explanation:
          "Human speech is a superposition of fundamental pitch and resonant vocal tract formants; only a continuous undulating current can transmit multiple Fourier components simultaneously.",
      },
      {
        principle: "Electromagnetic Acoustic Transduction",
        formula:
          "F(t) = \\frac{(B_0 + \\Delta B(t))^2 A}{2\\mu_0} \\approx F_0 + \\frac{B_0 A \\mu_0 N}{\\mu_0 g} I(t)",
        explanation:
          "The receiver's permanent magnet bias B₀ linearizes the electromagnetic attraction force, preventing octave doubling of the reproduced voice.",
      },
    ],
    whyItMattersToday:
      "A microphone still maps air pressure onto a continuous electrical quantity. Codecs and VoIP quantize that quantity; they do not return to Reis's click. The 1876 fight was about keeping the circuit closed while the diaphragm moved.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A system of telegraphy in which the receiver is set in vibration by the employment of undulatory currents of electricity, substantially as described.",
      plainEnglish:
        "Covers any telegraphic or communications system where a receiving diaphragm or armature is vibrated using continuous undulatory electric currents.",
      keyInnovations: [
        "Undulatory current signaling",
        "Vibratory receiver actuation",
        "Continuous wave telecommunication",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The combination, substantially as set forth, of a permanent magnet or other body capable of inductive action, with a closed circuit, so that the vibration of the one shall occasion electrical undulations in the other, or in itself, and this I claim, whether the permanent magnet be set in vibration in the neighborhood of the conducting-wire forming the circuit, or whether the conducting-wire be set in vibration in the neighborhood of the permanent magnet, or whether the conducting-wire and the permanent magnet both simultaneously be set in vibration in each other's neighborhood.",
      plainEnglish:
        "Claims a vibrating magnet or other inductive body coupled to a closed circuit so its motion creates electrical undulations.",
      keyInnovations: [
        "Magnetically induced signal",
        "Closed-circuit transducer",
        "Vibration-to-current conversion",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "The method of producing undulations in a continuous voltaic current by the vibration or motion of bodies capable of inductive action, or by the vibration or motion of the conducting-wire itself, in the neighborhood of such bodies, as set forth.",
      plainEnglish:
        "Claims producing an analog electrical wave by moving an inductive object or conductor near the other.",
      keyInnovations: [
        "Continuous voltaic current",
        "Inductive modulation",
        "Analog waveform generation",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "The method of producing undulations in a continuous voltaic circuit by gradually increasing and diminishing the resistance of the circuit, or by gradually increasing and diminishing the power of the battery, as set forth.",
      plainEnglish:
        "Claims smooth resistance or battery-power modulation rather than abrupt make-and-break signaling.",
      keyInnovations: [
        "Variable circuit resistance",
        "Continuous modulation",
        "Closed-circuit signaling",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText:
        "The method of, and apparatus for, transmitting vocal or other sounds telegraphically, as herein described, by causing electrical undulations, similar in form to the vibrations of the air accompanying the said vocal or other sounds, substantially as set forth.",
      plainEnglish:
        "The historic master claim 5: the method and apparatus for transmitting human voice by causing electrical waves in a wire that mirror the exact physical waveform of sound in air.",
      keyInnovations: [
        "Acoustic-to-electric analog conversion",
        "Waveform parity between sound and current",
        "The foundational claim of telephony",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 6",
      title: "Variable Resistance Liquid Transmitter & Receiver Circuit",
      caption:
        "Diagrammatic view of Bell's telephonic circuit showing speaking cone, diaphragm, needle in acidulated liquid cup, battery, and electromagnetic receiver.",
      svgType: "bell-phone",
      callouts: [
        {
          id: "bp-1",
          figureRef: "Fig. 6",
          label: "A",
          element: "Acoustic Speaking Horn",
          description:
            "Cone that concentrates sound pressure waves onto the transmitting diaphragm.",
          x: 20,
          y: 35,
        },
        {
          id: "bp-2",
          figureRef: "Fig. 6",
          label: "B",
          element: "Transmitting Diaphragm",
          description: "Stretched membrane vibrating with voice sound waves.",
          x: 35,
          y: 45,
        },
        {
          id: "bp-3",
          figureRef: "Fig. 6",
          label: "C",
          element: "Conducting Needle in Liquid Cup",
          description:
            "Platinum needle moving in acidulated water to vary circuit resistance continuously.",
          x: 48,
          y: 60,
        },
        {
          id: "bp-4",
          figureRef: "Fig. 6",
          label: "E",
          element: "Electromagnetic Receiver",
          description:
            "Iron-core electromagnet vibrating an iron diaphragm to reproduce voice sounds.",
          x: 82,
          y: 45,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Western Union's 1870s prize was more messages per wire, not a household voice service. Harmonic telegraphs (Bell's own earlier work, Gray's, La Cour's) tried to send several Morse channels as tuned reeds. Speech was the harder version of the same problem: many frequencies at once, on one pair.",
    priorArtLimitations: [
      "Morse keys and sounders are binary. They have no amplitude channel.",
      "Reis's 1861 'Telephon' could carry a pitch; the contact opened on each cycle, so consonants died.",
      "A vibrating-reed transmitter that breaks the circuit at acoustic frequency is a buzzer, not a microphone.",
    ],
    breakthroughInsight:
      "Keep the circuit closed. Let resistance or induced voltage follow the diaphragm. The liquid transmitter in the patent (a needle in dilute acid) is that idea in wet form; the later carbon-button microphone is the same idea in packed granules.",
    patentWars: [
      {
        rivalName: "Elisha Gray and Western Union",
        rivalClaim:
          "Gray filed a caveat for a liquid transmitter on 14 February 1876, hours after Bell's application. Western Union later bought Gray's and Edison's acoustic patents and ran a rival network.",
        conflictDetails:
          "The caveat-versus-application timing has been picked over for 150 years, including charges (never proved in court) that examiner Zenas Wilber showed Gray's drawing to Bell. The Telephone Cases, 126 U.S. 1 (1888), reviewed a pile of interferences and upheld 174,465. More than 600 challenges were filed against Bell's patents in the life of the monopoly.",
        resolution:
          "Western Union exited the telephone business in 1879 (the Gould settlement) and stayed in telegraphy. Bell's company became AT&T.",
        legalOutcome:
          "The Supreme Court kept 174,465. Historians still argue about Gray's caveat; the legal title is not in doubt.",
      },
    ],
    civilizationalImpact:
      "Once a pair of wires could carry a voice, cities grew switchboards, then long lines, then a regulated monopoly. The social fact (you can talk to a person who is not in the room) is older than the digital network that now carries it.",
    funFact:
      "The sentence 'Mr. Watson, come here, I want to see you' is 10 March 1876, three days after the grant, on the liquid transmitter. The instrument in the patent drawings is not the polished wooden box of later publicity photographs.",
    aftermath:
      "Bell sold most of his telephone stock early and spent later decades on tetrahedral kites, hydrofoils, and the National Geographic Society. The money and the litigation stayed with the company that bore his name.",
    sideNotes: [
      "Gardiner Hubbard, Bell's future father-in-law, was the business engine of the filing. Mabel Hubbard Bell, deaf from childhood scarlet fever, is why Bell was in visible speech and ear phonetics in the first place.",
      "Edison's 1877 carbon-button transmitter made the telephone commercially loud enough. Bell's patent is the undulating-current claim; Edison's is the practical microphone. The 1879 settlement split those roles.",
      "The US filing date, Valentine's Day 1876, is a coincidence that every popular account mentions and that the Supreme Court did not care about. Priority was decided on the written claims, not the calendar romance.",
    ],
  },
};
