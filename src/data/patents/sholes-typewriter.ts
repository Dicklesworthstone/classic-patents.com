import type { Patent } from "@/types/patent";

export const sholesTypewriterPatent: Patent = {
  id: "us-79265-sholes-typewriter",
  patentNumber: "US 79,265",
  title: "Type-Writing Machine",
  shortTitle: "Sholes & Glidden Typewriter & QWERTY Mechanism",
  subtitle: "Radial Typebar Basket, Escapement Carriage Stepping, and Inked Ribbon Platen Impact",
  inventors: ["Christopher Latham Sholes", "Carlos Glidden", "Samuel W. Soule"],
  inventorLocation: "Milwaukee, Milwaukee County, Wisconsin",
  grantDate: "1868-06-23",
  filingDate: "1867-10-11",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "consumer",
  categoryLabel: "Mechanical Information Systems & Ergonomics",
  summary:
    "The 1868 foundational patent of text processing and mechanical keyboard communication: Christopher Latham Sholes, Carlos Glidden, and Samuel Soule's typewriter combining a circular basket of pivoted typebars converging upward to strike a central ink-ribbon platen, advanced one character pitch per keypress by an escapement wheel, establishing the ancestor of all computer keyboards.",
  heroQuote:
    "The keys are arranged in rows upon levers... when depressed, they actuate the type-bars through connecting wires, causing the type to strike upward against the inked ribbon and paper, while the carriage moves forward one space for each letter.",
  originalPdfUrl: "/patents/pdfs/us-79265-sholes-typewriter.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US79265/en",
  usptoClassification: "B41J 1/28 (Typewriters; Typebar mechanisms; Keyboard layouts)",
  originalTextAsset: {
    url: "/patents/source-text/us-79265-sholes-typewriter.txt",
    pageCount: 6,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
C. LATHAM SHOLES, CARLOS GLIDDEN, AND SAMUEL W. SOULE, OF MILWAUKEE, WISCONSIN.

TYPE-WRITING MACHINE.

Specification forming part of Letters Patent No. 79,265, dated June 23, 1868.

To all whom it may concern:
Be it known that we, C. LATHAM SHOLES, CARLOS GLIDDEN, and SAMUEL W. SOULE, of the city and county of Milwaukee, in the State of Wisconsin, have invented a new and useful Machine for Writing with Type, of which the following is a specification:

The nature of our invention consists in:
1. An arrangement of type-bars in a circular ring or basket, each type-bar pivoted at its outer end and having a steel letter, numeral, or mark of punctuation at its free inner end, all said type-bars converging to strike upward against a single common printing point on a central platen.
2. A series of key-levers arranged in rows in front of the machine, connected by pull-wires to the type-bars, so that depressing any key instantly throws the corresponding type-bar upward against the ribbon.
3. An inked ribbon interposed between the type and the paper, moved automatically by a spooling ratchet at each keystroke to present a fresh inking surface.
4. A paper carriage mounted on guide rails above the circular type-ring, propelled laterally by a spring barrel and governed by an escapement wheel and vibratory pawls operated by a universal spacer bar beneath the key-levers.

When any key is depressed by the operator's finger, the key-lever pulls upon its connecting wire, causing the corresponding type-bar to swing upward in an arc and strike the underside of the paper against the inked ribbon at the center point. Simultaneously, the key-lever depresses the universal bar, which rocks the escapement pawls, releasing the escapement wheel by one tooth and allowing the spring barrel to advance the paper carriage exactly one letter space for the next character.

I claim as our invention:
1. The arrangement of the type-bars in a circular ring or basket to strike at a common central printing point, substantially as described.
2. The combination of the key-levers with the type-bars, the universal spacer bar, and the escapement mechanism for feeding the paper carriage step-by-step at each stroke of a key.
3. The automatic inking ribbon mechanism arranged to advance between the type and paper simultaneously with the letter spacing.`,
  plainEnglishExplanation: {
    overview:
      "In the 1860s, all business, legal, and government documents were laboriously hand-written with steel dip pens at 20 words per minute. Christopher Latham Sholes and his partners invented the first commercially practical mechanical typewriter. By arranging typebars in a circular basket converging on a central strike point, and linking each key to an escapement carriage step, the typewriter quadrupled writing speed and created the universal keyboard interface used on computers and smartphones today.",
    coreMechanism:
      "Depressing a key lever pulls a vertical wire link that swings a pivoted steel typebar upward through a circular basket to strike a single focal printing point on the underside of a rubber platen cylinder. The type face strikes an inked fabric ribbon, transferring a sharp imprint onto the paper. Simultaneously, a crossbar beneath all key levers (the universal spacer bar) pivots an escapement rocker arm, allowing an escapement wheel under spring tension to advance the horizontal paper carriage by exactly one character pitch ($2.54\\text{ mm}$). To prevent typebars from colliding when typing fast, Sholes redesigned the key arrangement into the famous QWERTY layout, separating frequently paired letter hammers.",
    mechanicalBreakdown: [
      {
        title: "Radial Typebar Basket & Convergent Pivot Ring",
        summary: "Circular ring of pivoted typebars converging on a single strike point.",
        technicalDetails:
          "Forty steel typebars arranged radially around a cast-iron ring ($R = 15\\text{ cm}$). Each typebar swings through an upward arc of $90^\\circ$ to strike the exact focal origin $(0, 0, 0)$ with a kinetic impact velocity of $v_{\\text{strike}} = 3\\text{ to }5\\text{ m/s}$.",
        archaicTerm: "Type-bars arranged in a circular ring or basket",
        modernEquivalent: "Radial typebar basket / Type segment",
      },
      {
        title: "Universal Space Bar & Escapement Stepping Gear",
        summary: "Spring barrel and pallet pawls advancing carriage one pitch per keystroke.",
        technicalDetails:
          "A helical spring drum exerts a constant lateral pull force ($F_{\\text{pull}} = 8\\text{ N}$) on the paper carriage. Each key stroke oscillates a double-pallet escapement pawl, stepping a 15-tooth escapement wheel by one tooth pitch ($p = 2.54\\text{ mm}$), ensuring uniform monospace character spacing.",
        archaicTerm: "Universal spacer bar and escapement mechanism",
        modernEquivalent: "Escapement wheel & rocker pallet feed mechanism",
      },
      {
        title: "Continuous Inked Fabric Ribbon Drive",
        summary: "Woven silk ribbon moving automatically between reversing spools.",
        technicalDetails:
          "An oil-inked silk ribbon wound between two spools. A ratchet pawl geared to the universal spacer bar indexes the ribbon spool forward by $0.5\\text{ mm}$ with every keypress, ensuring that consecutive typebars never strike the exact same spot and preventing ribbon perforation.",
        archaicTerm: "Inked ribbon mechanism moving by spooling ratchet",
        modernEquivalent: "Typewriter ribbon transport / Ribbon vibrator & spool drive",
      },
      {
        title: "Cylindrical Hard-Rubber Platen & Feed Rollers",
        summary:
          "Rotatable anvil cylinder backing the paper sheet and providing line feed indexing.",
        technicalDetails:
          "A vulcanized hard rubber cylindrical roller ($D = 45\\text{ mm}$) serves as the rigid printing anvil. Spring-loaded feed rollers grip the paper sheet against the platen with $12\\text{ N}$ normal force, while a ratchet wheel on the platen axis allows instantaneous line spacing advancement ($h_{\\text{line}} = 4.2\\text{ mm}$) upon carriage return.",
        archaicTerm: "Cylinder platen and paper feeding rollers",
        modernEquivalent: "Platen roller & line-feed detent ratchet",
      },
      {
        title: "Piano-Wire Pull Links & Cantilever Keylevers",
        summary:
          "Parallel four-bar wire linkage transmitting key depression into radial typebar snap.",
        technicalDetails:
          "Individual forged spring-steel piano wires link the midpoint of each $25\\text{ cm}$ wooden keylever to the crank horn of its corresponding typebar. Pivot friction is minimized by hardened steel knife-edge bearings, yielding a clean, snappy key return in under $20\\text{ ms}$ under the tension of coiled return springs.",
        archaicTerm: "Wire connections linking key levers to type levers",
        modernEquivalent: "Typebar pull wires & fulcrum keylever assembly",
      },
    ],
    scientificPrinciples: [
      {
        principle: "4-Bar Key Lever Mechanical Advantage",
        formula:
          "F_{\\text{strike}} = F_{\\text{finger}} \\cdot \\left(\\frac{L_1}{L_2}\\right) \\cdot \\left(\\frac{R_{\\text{typebar}}}{r_{\\text{crank}}}\\right), \\quad v_{\\text{strike}} = \\dot{\\theta}_{\\text{key}} \\cdot \\text{ratio}",
        explanation:
          "The mechanical linkage compounds finger velocity by a factor of 6 to 8, converting a gentle keypress ($1.5\\text{ N}$) into a sharp, high-velocity typebar impact ($12\\text{ N}$) for crisp ink transfer.",
      },
      {
        principle: "Escapement Pitch Discretization & Spring Dynamics",
        formula:
          "m_{\\text{carriage}} \\ddot{x} + c \\dot{x} = F_{\\text{spring}}, \\quad \\Delta x = \\frac{2\\pi r_{\\text{pinion}}}{N_{\\text{escapement teeth}}} = 2.54\\text{ mm}",
        explanation:
          "The escapement converts continuous spring potential energy into discrete, high-speed lateral spatial stepping coordinated with the typebar dwell time ($t_{\\text{dwell}} < 15\\text{ ms}$).",
      },
      {
        principle: "Digraph Collision Envelope & QWERTY Geometric Separation",
        formula:
          "t_{\\text{flight}} = \\int_0^{\\pi/2} \\frac{d\\theta}{\\omega(\\theta)}, \\quad |\\theta_A - \\theta_B| > \\theta_{\\text{interference threshold}}",
        explanation:
          "If two adjacent typebars are actuated within $\\Delta t < t_{\\text{return}}$, their mechanical flight envelopes intersect and they jam at the guide slot. The QWERTY layout geometrically separates common English digraphs (TH, ER, IN, ON) around opposite sides of the circular basket.",
      },
      {
        principle: "Hertzian Impact Contact Pressure & Ink Transfer",
        formula:
          "P_{\\text{contact}} = \\frac{F_{\\text{strike}}}{A_{\\text{face}}} = \\frac{12\\text{ N}}{0.6\\text{ mm}^2} = 20\\text{ MPa} > P_{\\text{ink yield}}",
        explanation:
          "The impact of the steel character face produces peak localized contact pressures exceeding $20\\text{ MPa}$, forcing oily pigment from the woven silk ribbon matrix directly into the cellulose fibers of the paper sheet.",
      },
    ],
    whyItMattersToday:
      "The Sholes & Glidden typewriter established the universal QWERTY keyboard layout used across billions of computer keyboards, laptops, and smartphone touchscreens worldwide. It sparked the office automation revolution, created the modern administrative workforce, and brought millions of women into the corporate economy.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The arrangement of the type-bars in a circular ring or basket to strike at a common central printing point, substantially as described.",
      plainEnglish:
        "Master pioneer claim covering the circular arrangement of pivoted typebars converging upward to strike a single common printing point on a central platen.",
      keyInnovations: [
        "Radial circular typebar basket",
        "Single-point focal strike convergence",
        "Under-strike platen geometry",
      ],
      legalSignificance:
        "The foundational structural claim for modern mechanical typewriters, establishing the radial type segment architecture.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination of the key-levers with the type-bars, the universal spacer bar, and the escapement mechanism for feeding the paper carriage step-by-step at each stroke of a key.",
      plainEnglish:
        "Specifies the combination of keyboard levers, typebars, universal space bar, and escapement gear that automatically steps the paper carriage by one character width per keypress.",
      keyInnovations: [
        "Universal spacer bar linkage",
        "Key-actuated escapement carriage stepping",
        "Monospace character feed synchronization",
      ],
      legalSignificance:
        "Protected the mechanical timing synchronization between character impact and letter spacing.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The automatic inking ribbon mechanism arranged to advance between the type and paper simultaneously with the letter spacing.",
      plainEnglish:
        "Covers the automatic advancing ribbon transport mechanism that feeds fresh inked ribbon across the printing point with each character typed.",
      keyInnovations: [
        "Automatic advancing fabric ink ribbon",
        "Continuous ribbon spool transport",
      ],
      legalSignificance:
        "Secured the clean ribbon inking system that replaced messy carbon paper and dipping inkwells.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Plan and Sectional View of Sholes Typewriter Mechanism",
      caption:
        "Cutaway drawing showing circular typebar basket, key lever bank, pull-wires, central platen carriage, and escapement rack.",
      svgType: "sholes-typewriter",
      callouts: [
        {
          id: "st-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Radial Typebar Basket",
          description: "Circular cast-iron ring supporting pivoted converging typebars.",
          x: 50,
          y: 40,
        },
        {
          id: "st-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Keyboard Levers & Universal Bar",
          description: "Four-bank keyboard levers actuating typebar pull-wires.",
          x: 50,
          y: 80,
        },
        {
          id: "st-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Paper Carriage & Platen Roller",
          description: "Horizontal roller advancing along rails via spring barrel.",
          x: 50,
          y: 20,
        },
        {
          id: "st-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Escapement Wheel & Pallet Pawls",
          description: "Stepping mechanism releasing carriage by 2.54 mm per keypress.",
          x: 25,
          y: 25,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the mid-19th century, rapid telegraphy and expanding transcontinental railroad commerce created a paper documentation crisis: court stenographers, merchants, and telegraph operators could not keep pace with voice dictation or electric wire messages using dip pens.",
    priorArtLimitations: [
      "Burt's 1829 'Typographer' used a rotating index dial that required turning a pointer by hand, typing slower than a pen.",
      "Early writing machines used flat printing plates or piano-key levers that were massive, fragile, and jammed constantly.",
      "No mechanism existed that combined high-speed radial typebars with automatic escapement letter spacing and an inked ribbon.",
    ],
    breakthroughInsight:
      "While working on a page-numbering machine in a Milwaukee machine shop in 1867, Sholes and Soule realized that numbers could be replaced with the letters of the alphabet, and Glidden suggested turning it into a complete typing instrument.",
    patentWars: [
      {
        rivalName: "E. Remington & Sons and Rival Keyboards",
        rivalClaim:
          "Early critics claimed the QWERTY layout was unnatural compared to alphabetical arrangements.",
        conflictDetails:
          "In 1873, Sholes and his financial promoter James Densmore brought the machine to gunmaker E. Remington & Sons in Ilion, New York. Remington's master gunsmiths Jefferson Clough and William Jenne retooled the design into the 'Sholes & Glidden Type-Writer' (Remington No. 1), enclosed in a sewing-machine-style case.",
        resolution:
          "Remington patented the famous Remington No. 2 in 1878 with a shift-key for upper and lower case letters. Sholes's QWERTY arrangement became so universally entrenched that typists trained exclusively on it, making it the unshakeable worldwide standard.",
        legalOutcome:
          "The Sholes patents were licensed exclusively to Remington, establishing Remington as the premier typewriter company in the world.",
      },
    ],
    civilizationalImpact:
      "The typewriter transformed commercial communication and opened professional white-collar corporate careers for millions of women as typists and stenographers. Author Mark Twain purchased a Remington in 1874 and submitted the manuscript for Life on the Mississippi in 1883 as the first typed book manuscript in history.",
    funFact:
      "Christopher Latham Sholes was an unassuming Milwaukee newspaper editor and state senator who sold his patent rights to James Densmore for just $12,000. Late in life, Sholes stated: 'I do feel that I have done something for the women who have always had to work so hard. This will enable them more easily to earn a living.'",
    aftermath:
      "Sholes continued inventing improved typewriter mechanisms until his death in Milwaukee in 1890 at age 71. In 1919, the National Shorthand Reporters Association dedicated a monument to Sholes in Forest Home Cemetery in Milwaukee, commemorating him as 'The Father of the Typewriter'.",
  },
  tags: [
    "Christopher Sholes",
    "Typewriter",
    "QWERTY",
    "Escapement",
    "Office Automation",
    "Keyboard Interface",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1868–1878",
    impactScore: 100,
  },
};
