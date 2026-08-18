import type { Patent } from "@/types/patent";
import { mccormickReaperArchivalEdition } from "@/data/editions/mccormickReaperEdition";

export const mccormickReaperPatent: Patent = {
  id: "us-x8277-mccormick-reaper",
  patentNumber: "US X8277",
  title: "Improvement in Machines for Reaping Small Grain",
  shortTitle: "McCormick Reaper",
  subtitle: "Crank-driven cutters, gathering reel, platform, and crop divider",
  inventors: ["Cyrus Hall McCormick"],
  inventorLocation: "Steeles Tavern, Rockbridge County, Virginia",
  grantDate: "1834-06-21",
  filingDate: "1834-06-19",
  era: "Early Industrial America (1831–1860)",
  category: "consumer",
  categoryLabel: "Agricultural Machinery & Kinematics",
  summary:
    "US X8277 describes Cyrus H. McCormick's horse-drawn machine for reaping small grain. Its specification sets out a platform, a ground-wheel gear train and cranks, cutter bars, an adjustable belt-driven reel, a divider, and the draft arrangement; it was patented June 21, 1834.",
  heroQuote:
    "This reel, by the motion given by the strap as the horses advance, bears the stalks as they are projected inward ... upon the cutter, and when separated lands them on the platform.",
  originalPdfUrl: "/patents/pdfs/us-x8277-mccormick-reaper.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/USX8277/en",
  usptoClassification: "A01D 34/02 (Mowers; Harvesting machines; Cutters)",
  originalTextAsset: {
    url: "/patents/transcripts/us-x8277-mccormick-reaper.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (PurpleSummit)",
    reviewedAt: "2026-08-17",
    sourcePdfSha256: "24712ca3e966994d72716ccca6df6ef9a1fb3751b30fe34bfeb549ab6ba7f400",
  },
  originalText:
    "Be it known that I, CYRUS H. McCORMICK, of Rockbridge county and State of Virginia, have invented a new and useful Improvement in Reaping all Kinds of Small Grain, and I do hereby declare that the following is a full and exact description of the construction and operation of the said machine as invented or improved by me.",
  archivalEdition: mccormickReaperArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "Since the dawn of agriculture, harvesting grain was strictly limited by the human arm swinging a sickle or cradle scythe. Because ripe wheat spoils or shatters within a brief 10-day window, farm size and world food supply were constrained by how much grain could be cut by hand. Cyrus McCormick combined a fast-reciprocating serrated knife, stationary spear fingers, a rotating reel, and a side-delivery table into a continuous horse-drawn machine that harvested grain ten times faster than human labor.",
    coreMechanism:
      "As horses pull the machine across a wheat field, the large main ground wheel drives a gear train and pitman crank that oscillates a serrated steel blade back and forth at over $600\\text{ strokes per minute}$. The blade slides inside stationary iron fingers that pinch each wheat stalk against the scissor-like cutting edge, preventing it from bending or flattening. Simultaneously, an overhead wooden reel sweeps the standing stalks inward against the cutter bar, causing the cut wheat to fall backwards onto a wooden platform where it is raked into bundles (gavels) for binding.",
    mechanicalBreakdown: [
      {
        title: "Reciprocating Serrated Sickle Bar",
        summary: "High-speed oscillating blade with triangular serrated teeth.",
        technicalDetails:
          "Driven by a pitman slider-crank from the main ground wheel at a stroke frequency of $f = \\frac{N_{\\text{teeth}} \\cdot v_{\\text{ground}}}{2 \\pi r_{\\text{wheel}} \\cdot r_{\\text{pitman}}} \\approx 10\\text{ Hz}$. The triangular serrations grip tough wheat straw and exert clean double-shear cutting action.",
        archaicTerm: "Straight cutting blade with serrated teeth",
        modernEquivalent: "Reciprocating cutter bar / Sickle section knife",
      },
      {
        title: "Stationary Slotted Guard Fingers",
        summary: "Spear-shaped iron teeth providing an anvil support for each stalk.",
        technicalDetails:
          "Projecting forward $10\\text{ cm}$ ahead of the knife, each guard finger has a horizontal slot through which the sickle passes. The finger acts as a stationary counter-blade, supporting the stalk in cantilever shear ($V = \\tau A$) so it cannot deflect away from the blade.",
        archaicTerm: "Spear-shaped fingers or guards",
        modernEquivalent: "Sickle guard fingers / Rock guards",
      },
      {
        title: "Revolving Gathering Reel",
        summary: "Rotating radial paddle vanes sweeping stalks into the cutter.",
        technicalDetails:
          "Geared from the main axle to rotate with a tangential velocity slightly exceeding the forward ground velocity ($v_{\\text{reel, tip}} \\approx 1.25 \\cdot v_{\\text{ground}}$). The vanes gently capture leaning or tangled grain, hold it against the knife during severance, and push it evenly onto the deck.",
        archaicTerm: "Revolving reel with radial vanes",
        modernEquivalent: "Pickup reel / Bat reel",
      },
      {
        title: "Grain Divider & Offset Draft Tongue",
        summary: "Wedge-shaped divider and offset horse hitch.",
        technicalDetails:
          "The wedge-shaped divider splits the swath of wheat being harvested from the uncut crop without snagging. The draft tongue places the horses in the previously cleared stubble on the left, keeping them from trampling uncut grain.",
        archaicTerm: "Grain divider and offset shaft",
        modernEquivalent: "Crop divider snout and offset drawbar",
      },
      {
        title: "Catch Platform & Manual Gavel Rake Deck",
        summary: "Smooth pine deck supporting severed grain until raked into binding sheaves.",
        technicalDetails:
          "A planar pine platform ($2.2\\text{ m} \\times 1.2\\text{ m}$) directly behind the cutter bar catches falling stalks horizontally. A low rear lip prevents stalks from spilling into the stubble while allowing a standing operator with a hand rake to sweep accumulated bunches (gavels of $15\\text{ to }20\\text{ kg}$) sideways onto the ground in discrete piles for hand tying.",
        archaicTerm: "Platform to receive the cut grain",
        modernEquivalent: "Header draper table / Combine cutterbar platform",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Double-Shear Mechanics in Stalk Cutting",
        formula:
          "\\tau_{\\text{shear}} = \\frac{F_{\\text{knife}}}{2 A_{\\text{stalk}}} < \\tau_{\\text{ultimate}}",
        explanation:
          "The scissor action between the moving sickle section and the stationary guard ledger plate cuts the stalk in pure shear rather than bending, requiring less than 15% of the cutting energy of a dull impact blade.",
      },
      {
        principle: "Kinematics of the Ground-Wheel Pitman Crank",
        formula:
          "v_{\\text{blade}}(t) = r \\omega \\left[\\sin(\\omega t) + \\frac{r}{2L} \\sin(2\\omega t)\\right]",
        explanation:
          "Ground wheel rotation directly drives the pitman crank, automatically matching the cutting stroke rate to the forward walking speed of the horses.",
      },
      {
        principle: "Cycloidal Trajectory of the Reel Vane",
        formula:
          "x(t) = v_{\\text{ground}} t + R \\sin(\\omega_{\\text{reel}} t), \\quad y(t) = R \\cos(\\omega_{\\text{reel}} t)",
        explanation:
          "The tip of each reel bat traces a curtate cycloid curve through the air, entering the standing grain from above and pulling it gently backward onto the deck.",
      },
      {
        principle: "Ground-Wheel Traction & Soil Slip-Limit Torque",
        formula:
          "\\tau_{\\text{avail}} = \\mu_{\\text{soil}} W_{\\text{machine}} R_{\\text{wheel}} > \\tau_{\\text{cutter}} + \\tau_{\\text{reel}} + \\tau_{\\text{friction}}",
        explanation:
          "The cast-iron master drive wheel is equipped with radial cleats that grip the soil, delivering sufficient non-slip torque to drive both the high-speed reciprocating sickle and the overhead reel without stalling.",
      },
    ],
    whyItMattersToday:
      "McCormick's synchronized combination of sickle bar, guard fingers, reel, divider, and platform forms the harvesting header of every modern combine harvester operating across the world's grain belts today. It transformed the American Midwest into the breadbasket of the world and freed millions of farm workers for the industrial revolution.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "My claim is for the arrangement of the several parts so as to constitute the above-described machine, and I particularly claim the method of cutting by means of a vibrating blade operated by a crank having the edge either smooth or with teeth, either with stationary wires or pieces above and below, and projecting before it, for the purpose of staying or supporting the grain whilst cutting; or using a double crank, and another blade or vibrating bar, as before described, having projections before the blade or cutter on the upper side, both working in contrary directions, thereby lessening the friction and liability to wear, by dividing the motion necessary for one between the two, and improving the principle of cutting by gathering and holding the grain to the cutter, the projections standing at a proper angle to said cutter; also the method of securing them.",
      plainEnglish:
        "This first, unnumbered claim reaches the claimed machine arrangement and the cutting system: a crank-driven moving blade with either a smooth or toothed edge, supports placed above and below and ahead of it, and the alternative of two oppositely moving cutting elements. The described function is to keep grain in position while cutting while dividing motion to reduce friction and wear.",
      keyInnovations: [
        "Crank-driven vibrating cutter",
        "Stationary or moving grain-supporting projections",
        "Oppositely moving cutter-bar alternative",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "I also claim the method of gathering and bringing the grain back to the cutter, and delivering it on the apron or platform by means of a reel, as described above, movable to any height required to suit the grain, and the platform to hold the grain until a sufficient quantity shall have been collected for a sheaf, more or less; likewise the mode of changing the machine for cutting either high or low, as described above; also the method of dividing and keeping separate the grain to be cut from that to be left standing, and the method of attaching the tongue, when behind, to the breast of the horse, to enable him to guide the machine with accuracy.",
      plainEnglish:
        "This second, unnumbered claim covers the gathering and delivery system: an adjustable-height reel sends grain to the cutter and platform, which holds it until a sheaf can be raked away. It also names the cutter-height adjustment, the divider separating cut from standing grain, and the behind-the-horse tongue attachment used to guide the machine.",
      keyInnovations: [
        "Height-adjustable gathering reel",
        "Temporary sheaf platform",
        "Divider and draft-guidance arrangement",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Unnumbered drawing sheet",
      title: "McCormick Reaper",
      caption:
        "The single source drawing shows the reaper's platform, tongue, cross-bar, divider, reel, and cutter in perspective. Letter names follow the period drawing key rather than a modern reconstruction.",
      svgType: "mccormick-reaper",
      callouts: [
        {
          id: "mr-1",
          figureRef: "Unnumbered drawing sheet",
          label: "A",
          element: "Platform",
          description: "The receiving surface on which cut grain is held until a raker removes a sheaf.",
          x: 62,
          y: 70,
        },
        {
          id: "mr-2",
          figureRef: "Unnumbered drawing sheet",
          label: "B",
          element: "Tongue",
          description: "The long draft member connected to the team and suspended by a pole and chain.",
          x: 53,
          y: 86,
        },
        {
          id: "mr-3",
          figureRef: "Unnumbered drawing sheet",
          label: "D",
          element: "Cross-bar",
          description: "The cross-bar at the tongue's draft end to which the single-trees attach.",
          x: 50,
          y: 89,
        },
        {
          id: "mr-4",
          figureRef: "Unnumbered drawing sheet",
          label: "L",
          element: "Divider",
          description: "The forward projecting part that separates the grain to be cut from standing grain.",
          x: 26,
          y: 49,
        },
        {
          id: "mr-5",
          figureRef: "Unnumbered drawing sheet",
          label: "W",
          element: "Reel",
          description: "The belt-driven gathering reel carrying stalks inward to the cutter and platform.",
          x: 57,
          y: 25,
        },
        {
          id: "mr-6",
          figureRef: "Unnumbered drawing sheet",
          label: "T",
          element: "Cutter",
          description: "The crank-driven cutting apparatus at the front edge of the platform.",
          x: 72,
          y: 42,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "For thousands of years, grain harvesting was the ultimate bottleneck in agriculture: wheat ripens simultaneously across hundreds of acres and must be cut within 10 to 14 days before grains shatter onto the ground. Using hand sickles, a farmer could cut barely one acre per day, capping the possible size of family farms and keeping humanity constantly vulnerable to famine.",
    priorArtLimitations: [
      "Hand scythes and cradles required intense physical labor and could not harvest more than 1.5 to 2 acres per worker per day.",
      "Obed Hussey's 1833 machine lacked a gathering reel and jammed constantly in tangled or lodged grain.",
      "Earlier English rotary reap-hooks knocked grain heads off the stalks before cutting them.",
    ],
    breakthroughInsight:
      "McCormick recognized that a reaper required a complete system of seven coordinated mechanisms working together: cutting in shear (sickle + guard fingers), gathering (reel), separating (divider), supporting (platform), powering (ground wheel), and avoiding crop damage (offset draft).",
    patentWars: [
      {
        rivalName: "Obed Hussey and John H. Manny",
        rivalClaim:
          "Hussey patented a cutter bar in 1833; Manny manufactured reapers claiming the guard finger and sickle combination was in the public domain.",
        conflictDetails:
          "McCormick sued Manny in the famous 1855 patent trial McCormick v. Manny in Cincinnati. Manny hired future President Abraham Lincoln and Edwin M. Stanton as defense counsel. Stanton famously insulted Lincoln and took over the defense, convincing the court that Manny's machine did not infringe McCormick's expired 1834 claims.",
        resolution:
          "McCormick lost the specific suit in the Supreme Court, but his superior manufacturing factory in Chicago, deferred payment credit, and money-back guarantees allowed McCormick Harvesting Machine Company to dominate the market worldwide.",
        legalOutcome:
          "Narrowed the scope of agricultural patent reissues and stimulated massive competitive innovation in farm machinery.",
      },
    ],
    civilizationalImpact:
      "During the American Civil War, Secretary of War Edwin Stanton stated: 'The reaper is to the North what the gunboat is to the South. It releases our young men to the battlefront while keeping our armies and Europe fed.' It turned the American Great Plains into the world's breadbasket and laid the foundation for International Harvester.",
    funFact:
      "McCormick first demonstrated his reaper in 1831 at age 22 in a field of oats at John Ruff's farm near Steeles Tavern, Virginia. The field was rough and hilly, and the machine rattled violently, but by afternoon it had cleanly harvested 6 acres!",
    aftermath:
      "McCormick moved west to the muddy frontier town of Chicago in 1847, building a massive lakeside factory that produced over 50,000 reapers per year. After the Great Chicago Fire of 1871 destroyed the works, McCormick rebuilt an even larger facility that merged in 1902 to become International Harvester.",
  },
  tags: [
    "Cyrus McCormick",
    "Mechanical Reaper",
    "Agriculture",
    "Kinematics",
    "Industrial Revolution",
    "International Harvester",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 2,
  },
};
