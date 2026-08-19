import {
  hollerithTabulatingArchivalEdition,
  hollerithTabulatingClaims,
  hollerithTabulatingClaimText,
} from "@/data/editions/hollerithTabulatingEdition";
import type { Patent } from "@/types/patent";

// Retained research material for a later generalized punched-card-tabulator
// narrative. It is deliberately non-exported: the public US 395,781 record
// below preserves source-bound wording at the printed card, contact, circuit,
// counter, and sorting-box boundary.
const _legacyUnpublishedHollerithTabulatingPatent: Patent = {
  id: "us-395781-hollerith-tabulating",
  patentNumber: "US 395,781",
  title: "Art of Compiling Statistics",
  shortTitle: "Hollerith Electro-Mechanical Punched-Card Tabulator",
  subtitle:
    "Binary Punched-Card Matrix Logic, Mercury-Cup Contact Solenoids, and Automated Sorting Sorters",
  inventors: ["Herman Hollerith"],
  inventorLocation: "Washington, District of Columbia",
  grantDate: "1889-01-08",
  filingDate: "1887-06-08",
  era: "Gilded Age & Grid (1870–1900)",
  category: "computing",
  categoryLabel: "Electro-Mechanical Data Processing",
  summary:
    "The direct ancestor of modern digital electronic computing and the founding technology of IBM: on January 8, 1889, Herman Hollerith was granted US Patent No. 395,781 for the punched-card electro-mechanical tabulating system. Facing an existential crisis in the 1890 US Census (which threatened to take more than a decade to tally by hand), Hollerith mechanized demographic data processing. Standardized manila cards ($3.25 \\times 7.375\\text{ in}$) were punched with 288 grid positions. An operator lowered a press with spring-loaded metal pins onto each card; where a hole was punched, the pin dipped into a cup of mercury, closing a 12V electrical circuit that energized an electromagnetic solenoid ($F_{\\text{mag}} = \\frac{(NI)^2 \\mu_0 A}{2 g^2}$) to advance a clock dial counter and open the lid of a sorted filing bin, tallying 62,979,766 citizens in just months.",
  heroQuote:
    "Be it known that I, Herman Hollerith, of Washington, in the District of Columbia, have invented certain new and useful Improvements in the Art of Compiling Statistics, of which the following is a specification...",
  originalPdfUrl: "/patents/pdfs/us-395781-hollerith-tabulating.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US395781A/en",
  usptoClassification: "G06K 7/04 (Punched-card reading / Electro-mechanical tabulators)",
  archivalEdition: hollerithTabulatingArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-395781-hollerith-tabulating-reviewed.txt",
    pageCount: 17,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "39d7c9879f8386f63f609bd43c0a73c96dbe50943d5d17044733c254b8d5a780",
  },
  originalText: `UNITED STATES PATENT OFFICE.
HERMAN HOLLERITH, OF WASHINGTON, DISTRICT OF COLUMBIA.

ART OF COMPILING STATISTICS.

SPECIFICATION forming part of Letters Patent No. 395,781, dated January 8, 1889.
Application filed June 8, 1887. Serial No. 240,660. (No model.)

To all whom it may concern:
Be it known that I, HERMAN HOLLERITH, of Washington, in the District of Columbia, have invented certain new and useful Improvements in the Art of Compiling Statistics; and I do hereby declare that the following is a full, clear, and exact description of the invention.

The object of my invention is to facilitate the compilation of statistical information of various kinds, such as demographic censuses, railway freight accounting, insurance mortality tables, and demographic surveys, by recording individual statistical data upon sheets or cards by means of holes punched at predetermined positions, and then compiling said statistics by the aid of electro-mechanical tabulating apparatus controlled by the punched cards.

My invention consists:
First, in the method of compiling statistics which consists in recording separate statistical items upon non-conducting cards by perforations located at predetermined index positions, placing said cards in an apparatus provided with electrical contact-points corresponding to the index positions, and actuating one or more electro-mechanical counters by the electric circuits completed through said perforations.
Second, in a press or circuit-closing apparatus having a series of spring-actuated contact-pins and an opposing bed containing corresponding mercury cups or metal contacts, between which the punched card is positioned.
Third, in an array of electromagnetic dial counters whose index pointers are advanced by ratchet pawls energized whenever an electric circuit is closed through a corresponding hole in the card.
Fourth, in a sorting box containing separate compartments whose covers are opened automatically by electro-magnets energized by specific circuit combinations, whereby the cards can be classified simultaneously with the counting of the data.`,
  plainEnglishExplanation: {
    overview:
      "By 1880, the United States population was expanding so rapidly that the Tenth Census took eight full years to count by hand on ledger paper sheets. With the 1890 Census approaching, government statisticians warned that the population count would not be finished before the 1900 Census was due, threatening constitutional congressional reapportionment. 29-year-old engineer Herman Hollerith solved this crisis by inventing the punched card data processing system, creating the world's first automated information processing industry.",
    coreMechanism:
      "A census worker punches a citizen's data onto a 24-column cardboard card (representing age, sex, race, marital status, birthplace, occupation, and literacy) using a pantograph punch. To tabulate, the operator places the card on the bed of a reading press and pulls down the handle. The press carries an array of 288 spring-loaded brass pins aligned over a grid of small cups filled with mercury. Where the card is solid, the cardboard insulates the pin. Where a hole is punched, the pin passes through the card into the mercury, completing a 12-volt circuit from a battery bank. Current flows through wire relays to an array of electromagnetic clock dials, energizing a solenoid coil ($F_{\\text{mag}} = \\frac{(NI)^2 \\mu_0 A}{2 g^2}$). The solenoid armature pulls an escapement pawl that advances the dial hand by one integer count. Simultaneously, the circuit trips a latch in an adjacent wooden sorting box, popping open the spring-loaded lid of a specific sorting bin (e.g. 'Native-Born Farmer'). The operator drops the card into the open bin and presses the lid closed, processing up to 80 cards per minute.",
    mechanicalBreakdown: [
      {
        title: "Spring-Pin & Mercury-Cup Sensing Press",
        summary: "Plunging pin grid sensing punched holes through non-conducting card stock.",
        technicalDetails:
          "The press contains 288 spring-loaded brass contact pins ($1.5\\text{ mm}$ diameter) opposed to hard-rubber cell blocks containing mercury pools. Total press stroke is $25\\text{ mm}$, closing circuits with contact resistance $R_{\\text{contact}} < 0.1\\,\\Omega$.",
        archaicTerm: "Circuit-closing press and mercury cups",
        modernEquivalent: "Electro-mechanical punched-card contact array",
      },
      {
        title: "Electromagnetic Step-and-Dial Register Array",
        summary: "Solenoid-driven escapement counters recording aggregate statistics.",
        technicalDetails:
          "Each dial unit contains a 100-toothed ratchet wheel driven by a rocking armature. A 40-dial cabinet simultaneously records 40 separate demographic combinations in parallel, with intermediate carries to auxiliary dials.",
        archaicTerm: "Electro-magnetic register dial",
        modernEquivalent: "Parallel solenoid decimal accumulator register",
      },
      {
        title: "Relay Matrix Combinatorial Logic Sorter",
        summary: "Multi-relay Boolean AND/OR circuits triggering sorting bins.",
        technicalDetails:
          "Interposing multi-pole telegraph relays in series or parallel evaluated compound Boolean conditions (e.g. $\\text{Male} \\land \\text{Age } [20\\text{--}30] \\land \\text{Foreign Born}$). The output energized a 24-compartment sorting box latch solenoid.",
        archaicTerm: "Sorting-box and selective circuit controller",
        modernEquivalent: "Hardware Boolean logic demultiplexer and sorting gate",
      },
      {
        title: "Keyboard Pantograph Card Punch",
        summary: "Mechanical template punch encoding human records into binary holes.",
        technicalDetails:
          "A mechanical pantograph stylus moves over a printed demographic template sheet, driving a hardened steel die punch through manila card stock with high positional accuracy ($0.05\\text{ mm}$ registration).",
        archaicTerm: "Pantograph punching apparatus",
        modernEquivalent: "Manual keypunch card encoder",
      },
      {
        title: "Spring-Loaded Sorting Box Compartment Latch Matrix",
        summary: "Multi-compartment sorter with electromagnetic trigger latches.",
        technicalDetails:
          "A 24-compartment wooden sorting bin with hinged spring-loaded lids ($k = 0.12\\text{ N}\\cdot\\text{m}$). Each lid is held shut by an armature catch. When a specific demographic relay logic circuit fires, its solenoid retracts the catch ($t_{\\text{release}} < 8\\text{ ms}$), causing the designated bin lid to fly open automatically, directing the human operator where to file the card.",
        archaicTerm: "Sorting-box having a series of compartments with lids",
        modernEquivalent: "Electromagnetic card sorter / Automated bin selector",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Electromagnetic Solenoid Actuation Dynamics",
        formula: "F_{\\text{mag}} = \\frac{(N I)^2 \\mu_0 A}{2 g^2}, \\quad \\tau = \\frac{L}{R}",
        explanation:
          "The force exerted on the ratchet pawl is proportional to the square of the ampere-turns $(NI)^2$ and inversely proportional to the square of the air gap $g$. An inductive time constant $\\tau = L/R \\approx 12\\text{ ms}$ allowed rapid reading cycles up to 80 cards per minute.",
      },
      {
        principle: "Liquid Metal Low-Resistance Ohmic Contact Physics",
        formula:
          "R_{\\text{contact}} = \\frac{\\rho_{\\text{Hg}}}{A_{\\text{contact}}} \\approx 0.04\\,\\Omega",
        explanation:
          "Liquid elemental mercury (resistivity $\\rho = 9.61 \\times 10^{-7}\\ \\Omega\\cdot\\text{m}$) conforms perfectly to brass pin surfaces, preventing contact chatter, oxidation arcing, and mechanical bounce during rapid cycling.",
      },
      {
        principle: "Boolean Relay Logic Network Synthesis",
        formula: "Y = \\sum_{i} \\prod_{j} X_{ij} \\quad (\\text{Disjunctive Normal Form})",
        explanation:
          "Series contact wiring implemented Boolean logical AND (conjunction), while parallel contact wiring implemented Boolean logical OR (disjunction), laying the exact foundation for digital logic gates and relay computers.",
      },
    ],
    whyItMattersToday:
      "Hollerith's punched card tabulator founded the modern information processing industry. In 1896, Hollerith incorporated the Tabulating Machine Company, which merged in 1911 to become CTR (Computing-Tabulating-Recording Company), renamed by Thomas J. Watson in 1924 as **IBM (International Business Machines)**. The 80-column punched card format remained the primary input/output medium for electronic computers until the late 1970s.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[0],
      plainEnglish:
        "The foundational method claim: preparing separate individual record cards, punching index-points according to a fixed distribution plan to represent individual characteristics, and successively applying the cards to circuit-controlling devices to designate statistical items.",
      keyInnovations: [
        "Separate unit-record punched cards",
        "Standardized index-point distribution plan",
        "Successive electro-mechanical circuit interrogation",
      ],
      legalSignificance:
        "Established the legal foundation for unit-record data processing and automated census tabulation.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[1],
      plainEnglish:
        "The batch grouping method: punching characteristic index-points for each individual or item, subdividing the cards into distinct demographic groups, and submitting each group to circuit-controlling devices.",
      keyInnovations: [
        "Hierarchical batch subdivision",
        "Group-wise statistical compilation",
        "Segmented electrical interrogation",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[2],
      plainEnglish:
        "Standard coordinate grid method: establishing index-points in fixed relative spatial positions against a physical standard, dividing cards into series, and successively tabulating through matching circuit-controlling contacts.",
      keyInnovations: [
        "Fixed standard spatial coordinate grid",
        "Mechanical registration against datum standards",
        "Systematic series compilation",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[3],
      plainEnglish:
        "Permanent record tablet counting: creating a permanent record by punching index points relative to a standard, separating cards into divisions, and electrically counting single items or multi-point combinations.",
      keyInnovations: [
        "Permanent punched record tablet",
        "Multi-point combinatorial counting",
        "Electrically enumerated statistical items",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[4],
      plainEnglish:
        "Space apportionment schema: dividing card surface into separate coordinate spaces, assigning specific statistical categories to spaces, punching individual items into assigned spaces, and successively interrogating the cards.",
      keyInnovations: [
        "Field-apportioned demographic layout",
        "Unitary individual record mapping",
        "Successive electro-mechanical readout",
      ],
    },
    {
      number: 6,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[5],
      plainEnglish:
        "Integrated sorting and classification method: punching individual data into assigned spaces, feeding cards successively to an apparatus that determines their division from punched holes, and automatically depositing each card into its corresponding sorting receptacle.",
      keyInnovations: [
        "Automated physical sorting",
        "Hole-directed record routing",
        "Concurrent classification and deposition",
      ],
    },
    {
      number: 7,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[6],
      plainEnglish:
        "Basic system combination: the combination of electrical circuits, operating electromagnets, contact pins controlling those circuits, and separate record cards bearing circuit-controlling index points.",
      keyInnovations: [
        "Punched card and electrical contact pin interface",
        "Electromagnetic actuator circuits",
        "Unit record circuit control",
      ],
    },
    {
      number: 8,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[7],
      plainEnglish:
        "Cooperative tabulating system: record cards with index points, circuit-controlling apparatus matching the index points, electromagnets connected to the contact devices, and operating electromagnets forming the system.",
      keyInnovations: [
        "Matching contact pin grid",
        "Electromagnetic register coupling",
        "Integrated electrical compiling network",
      ],
    },
    {
      number: 9,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[8],
      plainEnglish:
        "Combinatorial logic counting: cards with index points, circuit controllers with contacts matching the index points, and circuit connections configured to actuate an operating electromagnet upon specific combinations of two or more holes.",
      keyInnovations: [
        "Multi-variable Boolean AND logic",
        "Combinatorial circuit closure",
        "Conjunctive demographic cross-tabulation",
      ],
    },
    {
      number: 10,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[9],
      plainEnglish:
        "Counting and sorting apparatus: cards with index points, circuit-controlling devices, operating counting magnets, and a sorting box with compartments and release magnets actuated by the circuits.",
      keyInnovations: [
        "Concurrent counting and physical sorting",
        "Electromagnetically unlatched sorting bins",
        "Dual-function tabulating workstation",
      ],
    },
    {
      number: 11,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[10],
      plainEnglish:
        "Relay logic matrix: circuit-controlling apparatus, operating circuits, and a system of relays connected between circuits so that two or more circuits together control an operating magnet for compound items.",
      keyInnovations: [
        "Intermediate electromagnetic relay logic",
        "Multi-circuit compound switching",
        "Hardware Boolean evaluation",
      ],
    },
    {
      number: 12,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[11],
      plainEnglish:
        "Intermediate relay network: circuit controllers, circuits, and relays where an operating magnet is energized through a relay controlled by a secondary circuit, enabling flexible cross-tabulation.",
      keyInnovations: [
        "Secondary circuit relay control",
        "Cascaded logic switching",
        "Isolated actuator driving",
      ],
    },
    {
      number: 13,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[12],
      plainEnglish:
        "Single-circuit combined counter and sorter: record card, circuit controllers, and an operating counter magnet and sorting box release magnet both wired into the same circuit for simultaneous actuation.",
      keyInnovations: [
        "Single-circuit dual actuation",
        "Synchronous tally and bin release",
        "Direct parallel loop wiring",
      ],
    },
    {
      number: 14,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[13],
      plainEnglish:
        "Selective multi-circuit sorter: record cards, circuit controllers, and a sorting box with release magnets connected to multiple circuits to sort cards according to designated demographic groups.",
      keyInnovations: [
        "Multi-category sorting routing",
        "Group-selective solenoid release",
        "Classified card sorting matrix",
      ],
    },
    {
      number: 15,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[14],
      plainEnglish:
        "Dial counter with visual index: record cards, circuit controller, operating magnets, and counting dials with movable hands or indices advanced by the magnetic armatures.",
      keyInnovations: [
        "Clock dial register readout",
        "Armature escapement pawl drive",
        "Visual decimal accumulator dial",
      ],
    },
    {
      number: 16,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[15],
      plainEnglish:
        "Primary and secondary multi-dial registers: cards, circuit controller, operating magnets, and a counter with primary dials for units/tens and secondary dials for hundreds/thousands advanced by the primary mechanism.",
      keyInnovations: [
        "Multi-stage decimal carry mechanism",
        "Cascaded odometer-style dial registers",
        "High-capacity demographic accumulation",
      ],
    },
    {
      number: 17,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[16],
      plainEnglish:
        "Interchangeable switchboard tabulator: record cards, circuit controller, operating counters, sorting box, and a flexible switchboard for routing circuits to different counters and sorting bins.",
      keyInnovations: [
        "Configurable plugboard/switchboard routing",
        "Reprogrammable tabulating circuits",
        "Modular sensor-to-register interconnect",
      ],
      legalSignificance:
        "Protected the physical patch panel/plugboard mechanism that became standard across all punch-card computing equipment for over 70 years.",
    },
    {
      number: 18,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[17],
      plainEnglish:
        "Closed-circuit sensing press: perforated cards, circuit system with operating magnets, and a press with a stationary bed and reciprocating platen carrying spring-loaded contact pins that close circuits through card holes.",
      keyInnovations: [
        "Reciprocating platen contact press",
        "Spring-loaded pin array",
        "Liquid/solid stationary contact bed",
      ],
    },
    {
      number: 19,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[18],
      plainEnglish:
        "Card alignment safety interlock: cards with index points, bed plate with contacts, reciprocating platen with spring pins, card positioning gauges, and a safety ground pin at the card margin that prevents circuit closure until the card is properly aligned.",
      keyInnovations: [
        "Card alignment edge gauge",
        "Margin ground interlock pin",
        "False-reading misfeed prevention",
      ],
    },
    {
      number: 20,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[19],
      plainEnglish:
        "Common ground return bus: record cards, platen contact points, bed contacts, and a series of conductors connecting bed contacts to a common ground bus co-operating with a platen return pin to complete all active circuits.",
      keyInnovations: [
        "Common ground return path",
        "Single-bus circuit completion",
        "Simplified parallel wiring architecture",
      ],
    },
    {
      number: 21,
      isIndependent: true,
      originalText: hollerithTabulatingClaims[20],
      plainEnglish:
        "The complete integrated statistical compilation system: record cards with index points, sensing press apparatus, reconfigurable switchboard, electromagnetic dial counters, and solenoid sorting box cabinets interconnected by a circuit network for concurrent counting and sorting.",
      keyInnovations: [
        "Complete integrated tabulating workstation",
        "End-to-end punched card computing system",
        "Synchronous multi-dial counting and 24-bin sorting",
      ],
      legalSignificance:
        "The master omnibus system claim protecting the complete electro-mechanical computing architecture commercialized by Hollerith and the Tabulating Machine Company (IBM).",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Hollerith Tabulating Press, Dial Cabinet & Sorting Box",
      caption:
        "Perspective view of the complete Hollerith tabulating apparatus showing the reading press with contact pins, 40-dial counter cabinet, battery bank, and sorting box.",
      svgType: "hollerith-tabulating",
      callouts: [
        {
          id: "ht-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Sensing Pin Reading Press",
          description:
            "Press with 288 spring pins plunging through punched holes into mercury cups.",
          x: 35,
          y: 62,
        },
        {
          id: "ht-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "40-Dial Counter Cabinet",
          description:
            "Array of electromagnetic clock counters accumulating census demographic data.",
          x: 65,
          y: 35,
        },
        {
          id: "ht-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Mercury Cup Rubber Bed",
          description:
            "Liquid mercury contact array providing low electrical resistance connection.",
          x: 38,
          y: 72,
        },
        {
          id: "ht-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Solenoid Sorting Box",
          description:
            "24-compartment sorting cabinet with spring-loaded lids popped by relay circuits.",
          x: 82,
          y: 68,
        },
        {
          id: "ht-5",
          figureRef: "Fig. 1",
          label: "E",
          element: "12V Chemical Battery Bank",
          description: "DC power source driving parallel solenoid register circuits.",
          x: 20,
          y: 80,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "When the 1880 US Census results took until 1888 to compile by hand on paper ledger sheets, Census Superintendent Francis Walker and statistical chief John Shaw Billings realized that with mass immigration, the 1890 Census would exceed 60 million people and would collapse before completion. Billings remarked to his young assistant Herman Hollerith over tea: 'There ought to be some mechanical way of doing this job, something on the principle of the Jacquard loom, whereby holes in a card regulate the pattern.' Hollerith seized upon the idea.",
    priorArtLimitations: [
      "Manual 'tally sheet' paper systems had high human transcription error rates (>5%) and took years to verify.",
      "The Jacquard loom used punched cards only for mechanical linkage shifting, not electrical circuit completion.",
      "Charles Babbage's mechanical Analytical Engine was never completed due to precision machining limitations.",
    ],
    breakthroughInsight:
      "Hollerith's genius was to combine punched cards with **electricity and electromagnetism**. Instead of using mechanical rods to push against holes, he used electrical circuits completed through the holes, enabling instantaneous parallel actuation of dozens of counters and sorting gates at the speed of current flow.",
    patentWars: [
      {
        rivalName: "James Powers and the Powers Accounting Machine Company",
        rivalClaim:
          "James Powers developed an all-mechanical pin-box punched card machine in 1907 for the 1910 Census, claiming it avoided Hollerith's mercury electrical patents.",
        conflictDetails:
          "Hollerith's company and Powers competed intensely for government census contracts in the US, Russia, Canada, and Great Britain.",
        resolution:
          "Powers captured a segment of mechanical accounting, but Hollerith's electrical circuits proved vastly superior for high-speed cross-tabulation and sorting.",
        legalOutcome:
          "Powers Accounting eventually merged into Remington Rand (later Sperry Rand / UNIVAC), setting up the epic mid-20th-century rivalry between IBM and UNIVAC.",
      },
    ],
    civilizationalImpact:
      "Using Hollerith's machines, the entire population count of the 1890 US Census (62,979,766 people) was announced in just six weeks, and the complete demographic cross-tabulations were completed in less than two years—saving the US government over $5,000,000 in clerical labor. Hollerith's systems were immediately adopted by rail networks (New York Central), health departments, insurance giants (Prudential), and the 1897 Russian Imperial Census.",
    funFact:
      "Hollerith chose the exact physical dimensions of his 1890 punched card ($3.25 \\times 7.375\\text{ inches}$) because that was the exact size of the US dollar bill at the time! This allowed him to purchase standard, off-the-shelf wooden bank teller drawers and boxes to store the census cards.",
    aftermath:
      "Hollerith retired a multimillionaire after selling his shares in the Tabulating Machine Company in 1911. He lived on a farm on the Potomac River in Maryland breeding cattle until his death in 1929 at age 69.",
    sideNotes: [
      "Punched card machines earned the popular nickname 'Hollerith machines' across Europe and the Soviet Union for over 80 years.",
      "In the 1890 Census, clerks called the cards 'punch-photos' because railroad conductors at the time punched train tickets with physical descriptions of passengers (e.g. hair color, nose shape) to prevent ticket theft, inspiring Hollerith's card layout.",
    ],
  },
  tags: [
    "Herman Hollerith",
    "Punched Card",
    "Tabulating Machine",
    "Census",
    "IBM",
    "Computing History",
    "Electro-Mechanical Logic",
    "Gilded Age",
  ],
  stats: {
    totalClaims: 21,
    independentClaims: 21,
    patentWarYears: "1889–1911",
    impactScore: 100,
  },
};

/**
 * Source-bounded catalog record for the 1889 grant. Literal claim text is
 * resolved from the complete manual edition so the catalogue cannot drift
 * from its visitor-facing archival source face.
 */
const hollerithTabulatingSourceBoundedClaims =
  _legacyUnpublishedHollerithTabulatingPatent.claims.map((claim) => ({
    ...claim,
    originalText: hollerithTabulatingClaimText(claim.number),
  }));

export const hollerithTabulatingPatent: Patent = {
  id: "us-395781-hollerith-tabulating",
  patentNumber: "US 395,781",
  title: "Art of Compiling Statistics",
  shortTitle: "Record-Card Statistical Compiler",
  subtitle: "Index-points, circuit-controlling contacts, counters, and sorting boxes",
  inventors: ["Herman Hollerith"],
  inventorLocation: "New York, New York",
  grantDate: "1889-01-08",
  filingDate: "1887-06-08",
  era: "Gilded Age & Grid (1870–1900)",
  category: "computing",
  categoryLabel: "Statistical Machinery & Electrical Circuits",
  summary:
    "US 395,781 describes an art and apparatus for compiling statistics from separate record-cards. Circuit-controlling index-points on each card cooperate with contact devices; the resulting circuits actuate electro-magnets for counters, indicators, and sorting boxes. The specification also describes cards prepared for Baltimore mortality statistics as one practical illustration.",
  heroQuote:
    "The combination, to form a system for compiling statistical matters, as hereinbefore described, of a series of separate cards, each card bearing a series of index-points representing the items or characteristics of one individual or subject.",
  originalPdfUrl: "/patents/pdfs/us-395781-hollerith-tabulating.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US395781A/en",
  usptoClassification:
    "Statistical card-processing apparatus; source classification review pending",
  archivalEdition: hollerithTabulatingArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-395781-hollerith-tabulating-reviewed.txt",
    pageCount: 17,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-19",
    sourcePdfSha256: hollerithTabulatingArchivalEdition.sourcePdfSha256,
  },
  originalText: `UNITED STATES PATENT OFFICE.
HERMAN HOLLERITH, OF NEW YORK, N. Y.

ART OF COMPILING STATISTICS.

SPECIFICATION forming part of Letters Patent No. 395,781, dated January 8, 1889.
Application filed June 8, 1887. Serial No. 240,029. (No model.)

To all whom it may concern:
Be it known that I, HERMAN HOLLERITH, of New York, in the county of New York and State of New York, have invented certain new and useful Improvements in the Art and System of Compiling Statistics.

Briefly stated, the method and apparatus comprise a record carrying circuit-actuating index-points; a template index for locating the record; circuit-making and circuit-breaking points; electric circuits controlled by those points; and mechanical registering devices actuated by electro-magnets included in those circuits.

[Curated source excerpt only. The complete seventeen-page manual source face is available in Original Patent Text.]`,
  plainEnglishExplanation: {
    overview:
      "The grant describes a way to turn a record for one individual or subject into a card whose marked index-points can control electrical circuits. The apparatus then uses those circuits to count selected items, operate indicators, and sort cards into groups. Its scope is broader than one census form; the Baltimore mortality card is presented as an example, not as a fixed format for every use.",
    coreMechanism:
      "A separate card carries index-points arranged to a predetermined plan. The card is placed between contact devices. When an index-point registers with its corresponding contact, it changes a circuit condition. That circuit energizes an electro-magnet which can operate a counter or a relay controlling a counter circuit. The specification also describes sorting boxes: an indicator or lid identifies the receptacle for a card whose selected points designate a group. The source does not specify card dimensions, pin count, supply voltage, coil turns, current, material composition, contact resistance, processing rate, or a modern digital-data model.",
    mechanicalBreakdown: [
      {
        title: "Separate Record-Cards and Index-Points",
        summary:
          "Each card represents an individual or subject, with index-points at predetermined locations for the items to be compiled.",
        technicalDetails:
          "The specification prefers a separate strip, card, or tablet rather than the continuous web used in the inventor's earlier work. It says the cards may be paper or another poorly conducting substance and can be marked to show the location for each index-point. The printed example concerns mortality statistics in Baltimore, but the grant says the system is not limited to that application.",
        archaicTerm: "index-points",
        modernEquivalent: "recorded card positions that control circuit contacts",
      },
      {
        title: "Contact Press and Circuit Control",
        summary:
          "A card is supported between plates or platens whose contact devices cooperate with the card's index-points.",
        technicalDetails:
          "The source describes yielding pins carried by a reciprocating platen and corresponding mercury cups in a bed-plate. Claim 19 adds gauges that locate the card and an edge pin that prevents the circuits from closing until the card is properly placed. The document gives the component relation, not an electrical calibration or a measured reading speed.",
        archaicTerm: "circuit-controlling devices",
        modernEquivalent: "card-position electrical contacts",
      },
      {
        title: "Registers, Relays, and Sorting Boxes",
        summary:
          "Electro-magnets operate counters, indicators, and receptacle lids according to the selected circuit paths.",
        technicalDetails:
          "The specification distinguishes direct circuits from relay circuits for combinations of items. It describes a sorting cabinet in which an electro-magnet releases a lid or indicator for the appropriate box. Claims 15 through 21 cover different combinations of cards, contacts, circuits, operating magnets, mechanical counters, sorting boxes, and switch-board connections.",
        archaicTerm: "operating electro-magnets",
        modernEquivalent: "electromagnetic actuators for counters and sorting indicators",
      },
    ],
    scientificPrinciples: [],
    whyItMattersToday:
      "The grant gives a primary-source account of card records being used to control circuits for counting and classification. Its legal claims distinguish record preparation, contact arrangements, circuit combinations, counters, and sorting apparatus. Assertions about later corporate history, census performance, standard card dimensions, or digital-computing lineage need separate historical sources and are not treated here as measurements in this patent.",
  },
  claims: hollerithTabulatingSourceBoundedClaims,
  drawings: [],
  historicalContext: {
    problemStatement:
      "The specification's problem is compiling statistical items recorded for many individuals or subjects and then separating and counting records according to selected items or combinations of items.",
    priorArtLimitations: [
      "The grant contrasts its separate cards with a continuous strip or web used in the inventor's prior applications.",
      "It says the changes arise from practical use and are intended to simplify, enlarge, and improve the method and apparatus.",
    ],
    breakthroughInsight:
      "A complete record on a separate card can be brought to matching circuit-controlling devices, allowing electro-magnets to operate counters and sorting indicators according to the card's designated index-points.",
    patentWars: [],
    civilizationalImpact:
      "US 395,781 is a source record of a late-nineteenth-century statistical system that joins independently handled record-cards, electrical contact control, mechanical registration, and physical classification. Broader claims about later adoption or industry history require separate, cited research.",
    aftermath:
      "The grant issued on January 8, 1889 with twenty-one printed claims and seventeen figures. Its complete manual source edition preserves the source text, claim sequence, and local figure previews as distinct archival artifacts.",
    sideNotes: [
      "The specification's illustrated card records month, sex, civil condition, race, age, occupation, birth-place, residence, and cause of death for a Baltimore mortality example.",
      "Claims 18 through 20 specifically describe the yielding pins, mercury cups, card-locating gauges, and common return contact.",
    ],
  },
  tags: ["Herman Hollerith", "Record cards", "Statistics", "Electrical contacts"],
  stats: {
    totalClaims: 21,
    independentClaims: 21,
  },
};
