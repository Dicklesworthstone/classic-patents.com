import type { Patent } from "@/types/patent";

export const bardeenTransistorPatent: Patent = {
  id: "us-2569347-bardeen-transistor",
  patentNumber: "US 2,569,347",
  title: "Three-Electrode Circuit Element Utilizing Semiconductive Materials",
  shortTitle: "Bardeen & Brattain's Point-Contact Transistor",
  subtitle:
    "The Solid-State Semiconductor Amplifier that Replaced Vacuum Tubes and Founded Modern Microelectronics",
  inventors: ["John Bardeen", "Walter H. Brattain"],
  inventorLocation: "Murray Hill, New Jersey",
  grantDate: "1951-10-03",
  filingDate: "1948-06-17",
  era: "Semiconductor Revolution (1950–1975)",
  category: "computing",
  categoryLabel: "Solid-State Physics & Semiconductors",
  summary:
    "The Genesis of Modern Computing: John Bardeen and Walter Brattain's December 1947 point-contact germanium transistor at Bell Labs achieved solid-state electrical amplification without glowing filaments or vacuum bottles. By injecting minority carrier holes into an n-type crystal lattice, they demonstrated transistor action, winning the 1956 Nobel Prize in Physics.",
  heroQuote:
    "When the emitter contact is biased in the forward (low resistance) direction and the collector contact is biased in the reverse (high resistance) direction, a signal voltage applied to the emitter causes an emission of carriers into the semiconductor which flow to the collector, causing corresponding and amplified changes in the collector current.",
  originalPdfUrl: "/patents/pdfs/us-2569347-bardeen-transistor.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2569347A/en",
  usptoClassification: "H01L 29/00 (Semiconductor devices; transistors)",
  originalText: `UNITED STATES PATENT OFFICE.
JOHN BARDEEN AND WALTER H. BRATTAIN, OF SUMMIT AND MORRISTOWN, NEW JERSEY, ASSIGNORS TO BELL TELEPHONE LABORATORIES, INCORPORATED, OF NEW YORK, N. Y., A CORPORATION OF NEW YORK.

THREE-ELECTRODE CIRCUIT ELEMENT UTILIZING SEMICONDUCTIVE MATERIALS.

Application June 17, 1948, Serial No. 33,466.
Patent No. 2,569,347. Patented Oct. 3, 1951.

To all whom it may concern:
Be it known that we, JOHN BARDEEN and WALTER H. BRATTAIN, citizens of the United States, residing at Summit and Morristown, in the County of Morris and State of New Jersey, have invented certain new and useful Improvements in Three-Electrode Circuit Elements Utilizing Semiconductive Materials, of which the following is a specification, reference being had to the accompanying drawings.

This invention relates to novel circuit elements and methods utilizing semiconductive materials for the amplification and control of electric currents and signals.

Prior to our invention, the amplification of electrical signals was accomplished almost entirely by thermionic vacuum tubes. Such tubes require power to heat a cathode filament, produce substantial excess heat, occupy significant volume, and have a strictly limited operating life due to filament deterioration and vacuum degradation.

In accordance with our invention, electrical amplification is accomplished by a solid-state device comprising a block of semiconductive material, such as high-purity n-type germanium, having a base electrode making a low-resistance ohmic connection therewith, and two rectifying point contacts, termed the emitter and collector, bearing against a surface of the block and spaced apart by a very small distance, on the order of a few thousandths of an inch (0.002 to 0.005 inch).

When the emitter contact is biased in the forward (low resistance) direction and the collector contact is biased in the reverse (high resistance) direction, a signal voltage applied to the emitter causes an injection of minority carrier holes into an inversion layer at the semiconductor surface. These carriers drift rapidly under the influence of electric fields to the collector, modulating the collector current and generating substantial voltage and power gain across a high-resistance external load.`,
  plainEnglishExplanation: {
    overview:
      "Before December 1947, every computer, telephone repeater, and radio amplifier relied on glass vacuum tubes. Tubes were hot, fragile, power-hungry, and burned out constantly (ENIAC required technicians to replace burnt-out tubes every few hours). At Bell Labs, John Bardeen and Walter Brattain made one of the most consequential discoveries in human history: by placing two gold-foil contact points spaced just 50 microns apart on a crystal of n-type germanium, they proved that a microscopic electrical signal at the input pin could control and amplify a large electrical current inside a solid crystal at room temperature with zero warmup time.",
    coreMechanism:
      "A block of n-type germanium crystal is fitted with a wide metal baseplate (base). Two phosphor-bronze or gold-leaf needle points (emitter and collector) make pressure contact with the crystal surface less than 0.005 inches apart. Forward-biasing the emitter injects positive charge carriers (minority 'holes') into the crystal. These holes drift rapidly across the microscopic gap into the strong electric field of the reverse-biased collector, transferring current from a low input resistance ($R_{in} \\approx 100\\ \\Omega$) to a high output resistance ($R_{load} \\approx 10,000\\ \\Omega$), producing massive power gain ($G_{power} = \\alpha^2 \\cdot R_{load} / R_{in} > 100$).",
    mechanicalBreakdown: [
      {
        title: "Germanium Crystal Semiconductor Body",
        summary: "High-purity n-type germanium single crystal with controlled donor doping.",
        technicalDetails:
          "Conducts electrons in the bulk and supports a natural p-type surface inversion layer formed by quantum surface states ($E_g = 0.67\\text{ eV}, \\mu_n = 3,900\\text{ cm}^2/\\text{V}\\cdot\\text{s}$).",
        archaicTerm: "Block of semiconductive material",
        modernEquivalent: "Semiconductor crystal substrate / base",
      },
      {
        title: "Emitter Point Contact",
        summary: "A sharp gold-foil electrode biased in the low-resistance forward direction.",
        technicalDetails:
          "Injects minority carrier holes ($p$) directly into the crystal with high emitter injection efficiency ($\\gamma = I_{pE} / I_E > 0.9$).",
        archaicTerm: "First point electrode / Emitter",
        modernEquivalent: "BJT / Transistor emitter terminal",
      },
      {
        title: "Collector Point Contact",
        summary: "A second sharp gold electrode biased at high reverse voltage (-40 V).",
        technicalDetails:
          "Collects injected holes with current multiplication ($\\alpha = \\Delta I_C / \\Delta I_E \\approx 1.0 - 2.5$) due to carrier collision ionization in the high-field point contact barrier.",
        archaicTerm: "Second point electrode / Collector",
        modernEquivalent: "Transistor collector terminal",
      },
      {
        title: "Polystyrene Contact Wedge & Spring Jig",
        summary:
          "A precision-slit plastic wedge holding the emitter and collector points 50 microns apart.",
        technicalDetails:
          "Brattain carefully sliced a triangular polystyrene wedge with a razor blade and cemented gold foil across the point, then slit the tip with a single micro-stroke to establish the 0.002-inch emitter-collector contact gap.",
        archaicTerm: "Insulating support wedge",
        modernEquivalent: "Micron-scale photolithographic gate/collector spacing",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Minority Carrier Hole Injection & Transistor Action",
        formula:
          "\\alpha = \\left(\\frac{\\partial I_C}{\\partial I_E}\\right)_{V_C} = \\gamma \\cdot \\beta^* \\cdot \\alpha^*, \\quad G_{power} = \\alpha^2 \\cdot \\frac{R_{load}}{R_{in}}",
        explanation:
          "Forward bias lowers the emitter potential barrier, injecting minority holes into the n-type crystal. These holes drift to the collector, modulating the collector current with power gain exceeding 100 (20 dB).",
      },
      {
        principle: "Bardeen Quantum Surface State Trapping",
        formula: "Q_{ss} = -q \\cdot D_{it} (E_F - E_0)",
        explanation:
          "Bardeen explained why earlier field-effect attempts failed: high densities of quantum energy states at the crystal surface trapped electric field lines, shielding the interior and creating a natural p-type surface conduction inversion layer.",
      },
      {
        principle: "Ambipolar Drift-Diffusion Transport Equation",
        formula:
          "\\frac{\\partial p}{\\partial t} = D_p \\nabla^2 p - \\mu_p \\vec{E} \\cdot \\nabla p - \\frac{p - p_0}{\\tau_p}",
        explanation:
          "Injected holes move from emitter to collector via combined thermal diffusion ($-D_p \\nabla p$) and electrostatic field drift ($\\mu_p \\vec{E}$), arriving before recombining with bulk electrons ($\\tau_p \\approx 10-50\\ \\mu\\text{s}$).",
      },
      {
        principle: "Resistance Transformation (Trans-Resistance / Transistor)",
        formula:
          "A_V = \\alpha \\cdot \\frac{R_{load}}{R_{in}} \\approx 1.0 \\cdot \\frac{10,000\\ \\Omega}{200\\ \\Omega} = 50",
        explanation:
          "Because the input is forward-biased (low impedance) and the output is reverse-biased (high impedance), identical current flow creates enormous voltage and power magnification.",
      },
      {
        principle: "Haynes-Shockley Carrier Drift Velocity",
        formula:
          "v_d = \\mu_p \\cdot |\\vec{E}|, \\quad t_{transit} = \\frac{d}{\\mu_p |\\vec{E}|} < 10^{-8}\\text{ s}",
        explanation:
          "With contact spacing $d \\approx 50\\ \\mu\\text{m}$ and high collector electric fields, hole transit time drops below 10 nanoseconds, allowing high-frequency radio amplification.",
      },
    ],
    whyItMattersToday:
      "Bardeen and Brattain's point-contact transistor proved that solid semiconductor crystals could amplify signals. Every microchip, microprocessor, RAM memory cell, AI neural accelerator, smartphone, and satellite in the modern world is a direct descendant of this 1947 breakthrough.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A circuit element which comprises a block of semiconductive material, a base electrode making low-resistance contact with said block, and two point electrodes making rectifier contact with a surface of said block, said point electrodes being spaced apart by a distance of the order of a few mils.",
      plainEnglish:
        "The master patent claim covering a three-terminal solid-state amplifying circuit element comprising a semiconductor crystal block, an ohmic base electrode, and two rectifying point contacts (emitter and collector) spaced a few thousandths of an inch apart on the crystal surface.",
      keyInnovations: [
        "Three-terminal solid-state electrical amplifier",
        "Minority carrier hole injection mechanism",
        "Sub-millimeter point-contact electrode spacing",
      ],
      legalSignificance:
        "The foundational patent claim of the entire solid-state electronics industry, establishing the legal definition of a transistor.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "A circuit element in accordance with claim 1 wherein one of said point contacts is biased in the forward direction and the other of said point contacts is biased in the reverse direction relative to said base electrode.",
      plainEnglish:
        "A transistor circuit configuration where the emitter point contact is forward-biased for carrier emission and the collector point contact is reverse-biased for high-impedance carrier collection.",
      keyInnovations: [
        "Asymmetric forward/reverse junction biasing",
        "Impedance transformation across solid-state crystal",
        "Power and voltage amplification",
      ],
      legalSignificance:
        "Protected the fundamental operational biasing method required for bipolar transistor action.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "A circuit element in accordance with claim 1 wherein the semiconductive material is germanium of the n-type having a surface layer of p-type conductivity.",
      plainEnglish:
        "A transistor device where the semiconductor is n-type germanium featuring a surface inversion layer of p-type hole conductivity.",
      keyInnovations: [
        "Germanium semiconductor substrate",
        "Surface inversion layer quantum transport",
        "Surface-state mediated carrier diffusion",
      ],
      legalSignificance:
        "Protected the physical material system and surface-state physics that made the first functional transistors work.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective View of Point-Contact Transistor Assembly",
      caption:
        "Patent blueprint showing the n-type germanium crystal block, copper baseplate electrode, and the insulating plastic wedge supporting the closely spaced emitter and collector gold point contacts.",
      svgType: "bardeen-transistor",
      callouts: [
        {
          id: "bt-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Germanium Crystal Block",
          description: "High-purity n-type single crystal germanium slab.",
          x: 50,
          y: 65,
        },
        {
          id: "bt-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Emitter Contact Point",
          description: "Forward-biased gold contact injecting positive minority holes.",
          x: 44,
          y: 35,
        },
        {
          id: "bt-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Collector Contact Point",
          description: "Reverse-biased gold contact collecting modulated hole current.",
          x: 56,
          y: 35,
        },
        {
          id: "bt-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Ohmic Baseplate Connection",
          description: "Low-resistance solder contact grounding the bulk semiconductor.",
          x: 50,
          y: 88,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Schematic Amplifier Circuit Diagram",
      caption:
        "Electrical schematic illustrating input signal coupling into the low-impedance forward-biased emitter and output load coupling from the high-impedance reverse-biased collector.",
      svgType: "bardeen-transistor",
      callouts: [
        {
          id: "bt-5",
          figureRef: "Fig. 2",
          label: "E",
          element: "Input Signal Source",
          description: "Microphone or audio source modulating emitter-base current.",
          x: 20,
          y: 50,
        },
        {
          id: "bt-6",
          figureRef: "Fig. 2",
          label: "F",
          element: "Output Load Resistor",
          description: "High-resistance load producing amplified audio voltage swings.",
          x: 80,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1940s, the American telephone network and early computing projects were crippled by vacuum tube unreliability. Vacuum tubes drew massive electrical power to boil electrons off hot cathode filaments, generated room-filling waste heat, and failed randomly every few hours, preventing the construction of scalable digital computers and cross-continental automated telephone switching networks.",
    priorArtLimitations: [
      "Thermionic triode and pentode vacuum tubes required 6.3V filament heaters and high B+ anode voltages (>150 V).",
      "Germanium and galena cat's-whisker crystal rectifiers (Braun, 1874) could detect radio signals, but could not produce power gain or signal amplification.",
      "Julius Edgar Lilienfeld filed paper patents for a field-effect amplifier in the 1920s, but could never build a working device because uncharacterized quantum surface states neutralized all applied electric fields.",
    ],
    breakthroughInsight:
      "John Bardeen deduced that previous attempts failed because electrons became trapped in 'surface states' at the semiconductor boundary. Walter Brattain experimentally verified this using liquid electrolyte droplets, leading them to slice a gold-foil-wrapped plastic wedge with a razor blade on December 16, 1947. When they pressed the two points 50 microns apart onto germanium, forward current through one point modulated the other: minority carrier hole injection had achieved solid-state amplification.",
    patentWars: [
      {
        rivalName: "William Shockley (Co-Manager & Rival at Bell Labs)",
        rivalClaim:
          "Shockley was furious that his subordinates Bardeen and Brattain had made the breakthrough using minority carrier injection rather than his theoretical field-effect design, and demanded his name be on the primary patent application.",
        conflictDetails:
          "Bell Labs patent attorneys discovered that Julius Lilienfeld's 1925 patents had already described field-effect principles in broad terms, so Shockley could not patent the general concept. Furthermore, only Bardeen and Brattain had physically invented and built the working point-contact device. Shockley was excluded from US Patent 2,524,035 and US 2,569,347. In response, Shockley locked himself in a Chicago hotel room for four weeks and furiously derived the physics of the bipolar junction transistor (BJT sandwich), patenting US 2,569,347 / US 2,502,488.",
        resolution:
          "In 1956, John Bardeen, Walter H. Brattain, and William Shockley were jointly awarded the Nobel Prize in Physics 'for their researches on semiconductors and their discovery of the transistor effect.'",
        legalOutcome:
          "Bell Labs adopted an unprecedented open-licensing policy in 1952, holding a famous symposium where they licensed transistor fabrication rights for $25,000 to dozens of companies—including Western Electric, Texas Instruments, and a tiny startup in Tokyo called Tokyo Tsushin Kogyo (later renamed Sony).",
      },
    ],
    civilizationalImpact:
      "The invention of the transistor is widely regarded as the most consequential technological achievement of the 20th century. It replaced vacuum tubes, enabled portable radios, spurred the creation of Silicon Valley, and made possible the entire digital computing universe.",
    funFact:
      "On December 23, 1947, when Brattain and Bardeen demonstrated their working prototype to Bell Labs executives, they wired it as an audio oscillator. When they plugged in headphones, executives could hear Brattain's voice loud and clear, with zero filament glow or warmup delay.",
    aftermath:
      "Bardeen left Bell Labs in 1951 to become a professor at the University of Illinois, where he co-invented BCS Theory (the quantum theory of superconductivity), becoming the only person in history to win two Nobel Prizes in Physics (1956 and 1972). Shockley founded Shockley Semiconductor in Mountain View, California, where his brilliant young hires (the 'Traitorous Eight,' led by Robert Noyce and Gordon Moore) left to found Fairchild Semiconductor and Intel.",
    sideNotes: [
      "The word 'transistor' was coined by Bell Labs engineer John R. Pierce, combining 'transconductance' (or 'transfer') and 'varistor.'",
      "While point-contact transistors were fragile and soon replaced by Shockley's junction transistors and Noyce's planar silicon chips, they were the proof-of-concept that transformed the physics of the world.",
    ],
  },
  tags: [
    "John Bardeen",
    "Walter Brattain",
    "Transistor",
    "Semiconductors",
    "Germanium",
    "Bell Labs",
    "Nobel Prize",
    "Microelectronics",
    "Silicon Valley",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1948–1956",
    impactScore: 100,
  },
};
