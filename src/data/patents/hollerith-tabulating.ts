import type { Patent } from "@/types/patent";

export const hollerithTabulatingPatent: Patent = {
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
  originalTextAsset: {
    url: "/patents/transcripts/us-395781-hollerith-tabulating.txt",
    pageCount: 17,
    kind: "reviewed-transcription",
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
        principle: "Discrete Binary Matrix Data Encoding",
        formula:
          "S_{\\text{card}} = \\sum_{r=1}^{M} \\sum_{c=1}^{N} b_{r,c} \\cdot 2^{(r-1)N + c}, \\quad b_{r,c} \\in \\{0, 1\\}",
        explanation:
          "Hollerith treated each physical card coordinate $(r, c)$ as a discrete binary bit cell (perforated = 1, solid = 0), establishing the physical punch card as the universal non-volatile digital data storage standard for 90 years.",
      },
      {
        principle: "Combinatorial Boolean Relay Logic",
        formula:
          "Y_{\\text{bin}} = \\prod_{i \\in \\text{AND}} X_i \\cdot \\sum_{j \\in \\text{OR}} X_j",
        explanation:
          "Wiring electromagnetic relays in series performed hardware logical AND operations, while parallel paths performed logical OR, allowing multi-attribute cross-tabulation without software computation.",
      },
      {
        principle: "Information Entropy & Tabulation Bandwidth",
        formula:
          "H_{\\text{census}} = -\\sum_{i=1}^K p_i \\log_2(p_i), \\quad C = \\frac{\\text{Bits}}{\\text{Card}} \\cdot f_{\\text{read}} \\approx 288 \\times 1.33 = 384\\text{ bps}",
        explanation:
          "Hollerith's system increased demographic data tabulation bandwidth by a factor of 100 over manual tally sheets, completing the 1890 Census of 62.9 million citizens in months rather than an entire decade.",
      },
      {
        principle: "Mercury-Wetted Micro-Contact Interface Conduction",
        formula:
          "R_{\\text{contact}} = \\frac{\\rho_{\\text{brass}} + \\rho_{\\text{Hg}}}{4 a} \\ll R_{\\text{dry contact}}",
        explanation:
          "Dipping brass pins into liquid mercury pools created liquid-metal meniscus wetting that eliminated dry-contact bounce, oxide film resistance, and contact degradation across hundreds of thousands of daily actuations.",
      },
    ],
    whyItMattersToday:
      "Hollerith's tabulating machine established the digital data processing industry. In 1896, Hollerith founded the Tabulating Machine Company, which merged in 1911 to become the Computing-Tabulating-Recording Company (CTR), renamed in 1924 as **International Business Machines (IBM)**. The punched card format remained the dominant primary input medium for mainframe computers until the arrival of magnetic tape and floppy disks in the 1970s.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The herein-described method of compiling statistics, which consists in recording separate statistical items upon non-conducting cards by perforations located at predetermined positions, placing said cards in an apparatus provided with electrical contact-points corresponding to the predetermined positions, and actuating one or more electro-mechanical counters by the electric circuits completed through said perforations.",
      plainEnglish:
        "The master data processing claim: recording information as holes in non-conducting cards and reading them with electrical contact points that close circuits to actuate electro-mechanical counters.",
      keyInnovations: [
        "Punched card digital data encoding",
        "Circuit completion through punched apertures",
        "Automated electro-mechanical counting",
      ],
      legalSignificance:
        "The master foundational patent of automated data processing, establishing the patent eligibility of electro-mechanical statistical compilation.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a statistical tabulating apparatus, the combination, with a press having a series of spring-actuated contact-pins and an opposing bed containing mercury-cups, of one or more electromagnetic counters connected in circuit with said pins and cups.",
      plainEnglish:
        "The sensing press apparatus claim: a press with spring-loaded pins opposed to mercury cups connected to electromagnetic dial registers.",
      keyInnovations: [
        "Spring-loaded pin sensing matrix",
        "Mercury-cup liquid electrical contacts",
        "Parallel multi-circuit actuation",
      ],
      legalSignificance:
        "Protected the physical card-reading press mechanism used across government census bureaus and rail freight offices worldwide.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a statistical compiling system, the combination, with the circuit-closing press and counters, of a sorting-box having separate compartments provided with lids, and electro-magnets in circuit with the press for releasing the lids of said compartments according to the perforations in the card.",
      plainEnglish:
        "The automated card sorting claim: a sorting cabinet whose compartment lids are popped open by solenoids based on specific punch combinations in the card.",
      keyInnovations: [
        "Solenoid-triggered sorting compartments",
        "Concurrent tabulating and physical filing",
        "Hardware-directed record classification",
      ],
      legalSignificance:
        "Protected the automated sorting and batch categorization of punched cards during data compilation.",
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
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1889–1911",
    impactScore: 100,
  },
};
