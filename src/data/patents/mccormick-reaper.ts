import type { Patent } from "@/types/patent";

export const mccormickReaperPatent: Patent = {
  id: "us-x8277-mccormick-reaper",
  patentNumber: "US X8277",
  title: "Improvement in Machines for Reaping Grain",
  shortTitle: "McCormick Mechanical Grain Reaper",
  subtitle: "Reciprocating Serrated Sickle, Guard Fingers, Revolving Reel, and Grain Platform",
  inventors: ["Cyrus Hall McCormick"],
  inventorLocation: "Steeles Tavern, Rockbridge County, Virginia",
  grantDate: "1834-06-21",
  filingDate: "1834-04-19",
  era: "Early Republic & Industrial Dawn (1790–1830)",
  category: "consumer",
  categoryLabel: "Agricultural Machinery & Kinematics",
  summary:
    "The 1834 pioneer agricultural patent that broke the bottleneck of the world food supply: Cyrus McCormick's horse-drawn reaper combining seven synchronized elements—a reciprocating serrated knife, spear-shaped guard fingers, revolving reel, grain divider, master ground drive wheel, side delivery platform, and draft tongue offset—allowing two operators to harvest 12 acres of grain per day instead of two.",
  heroQuote:
    "The cut grain falls back upon the platform, from which it is raked off in sheaves by a man following the machine... the grain being gathered and pressed against the sickle by the revolving reel.",
  originalPdfUrl: "/patents/pdfs/us-x8277-mccormick-reaper.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/USX8277/en",
  usptoClassification: "A01D 34/02 (Mowers; Harvesting machines; Cutters)",
  originalText: `UNITED STATES PATENT OFFICE.
CYRUS H. McCORMICK, OF ROCKBRIDGE COUNTY, VIRGINIA.

IMPROVEMENT IN MACHINES FOR REAPING GRAIN.

Letters Patent No. X8277. Dated June 21, 1834.
Application filed April 19, 1834.

TO ALL TO WHOM THESE PRESENTS SHALL COME:
Be it known that I, CYRUS H. McCORMICK, of the County of Rockbridge and State of Virginia, have invented a new and useful Improvement in Machines for Reaping all kinds of Small Grain, of which the following is a specification:

My invention consists in the arrangement and combination of the following parts:

1. A main supporting wheel on which the machine rides, having an internal cog-gear or external gearing communicating motion through pinions and a crank to a reciprocating sickle blade.
2. A straight cutting blade or sickle having serrated triangular teeth, moving rapidly back and forth through slotted spear-shaped fingers projecting forward from the front edge of the platform.
3. Said fingers or guards projecting ahead of the knife to support the grain stalks both above and below while the knife cuts them, preventing the stalks from bending away without being severed.
4. A revolving reel driven by a belt from the main axle, having four or six radial vanes that reach forward over the standing grain, pressing it gently backward against the knife and sweeping the cut grain squarely onto the platform.
5. A grain divider projecting forward from the outer end of the platform to separate the swathe to be cut from the standing grain left in the field.
6. A platform behind the knife receiving the severed grain, with sufficient space for a laborer riding on the machine to rake off the grain in neat gavels for binding.

The horse is attached by shafts to one side of the platform so as to walk in the stubble alongside the standing grain without trampling it. As the machine advances, the ground wheel rotates the crank, driving the sickle at high speed through the fingers, shearing the stalks cleanly as the reel sweeps them onto the table.

I claim as my invention:
1. The combination of the reciprocating serrated blade with the slotted stationary fingers projecting ahead of the edge of the platform.
2. The revolving reel arranged to sweep and press the grain stalks against the cutting knife and lay them on the platform.
3. The general arrangement of the platform, ground wheel, divider, and offset draft tongue substantially as described.`,
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
    ],
    whyItMattersToday:
      "McCormick's synchronized combination of sickle bar, guard fingers, reel, divider, and platform forms the harvesting header of every modern combine harvester operating across the world's grain belts today. It transformed the American Midwest into the breadbasket of the world and freed millions of farm workers for the industrial revolution.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination of the reciprocating serrated blade with the slotted stationary fingers projecting ahead of the edge of the platform.",
      plainEnglish:
        "The master claim covering the scissor-like combination of a fast-moving serrated cutting bar sliding through stationary guard fingers that hold grain stalks rigid during the cut.",
      keyInnovations: [
        "Reciprocating serrated sickle bar",
        "Slotted spear-shaped stationary guard fingers",
        "Continuous double-shear crop cutting",
      ],
      legalSignificance:
        "The central mechanical claim of the reaping machine, fiercely defended in court against Obed Hussey and Manny.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The revolving reel arranged to sweep and press the grain stalks against the cutting knife and lay them on the platform.",
      plainEnglish:
        "Covers the overhead revolving reel positioned to gather standing or lodged grain stalks against the cutter bar and sweep them onto the collection deck.",
      keyInnovations: [
        "Revolving gathering reel",
        "Mechanical crop orientation and platform sweep",
      ],
      legalSignificance:
        "Protected the device that allowed the reaper to cut tangled or wind-flattened crops that jammed other machines.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The general arrangement of the platform, ground wheel, divider, and offset draft tongue substantially as described.",
      plainEnglish:
        "Secures the overall layout of ground wheel drive, offset hitch preventing horses from trampling uncut grain, outer divider, and rear platform.",
      keyInnovations: [
        "Offset horse hitch",
        "Swath-separating grain divider",
        "Continuous side-delivery grain platform",
      ],
      legalSignificance:
        "Protected the integrated chassis layout that enabled continuous non-stop field harvesting.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective View of McCormick Virginia Reaper",
      caption:
        "Perspective drawing showing main ground drive wheel, reciprocating sickle bar, slotted guard fingers, overhead revolving reel, and grain platform.",
      svgType: "mccormick-reaper",
      callouts: [
        {
          id: "mr-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Main Ground Drive Wheel",
          description: "Large cleated wheel driving pitman crank and sickle gear train.",
          x: 25,
          y: 60,
        },
        {
          id: "mr-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Reciprocating Sickle & Guard Fingers",
          description: "Serrated blade sliding through stationary spear guard slots.",
          x: 55,
          y: 75,
        },
        {
          id: "mr-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Revolving Gathering Reel",
          description: "Overhead wooden vanes sweeping grain stalks against cutter.",
          x: 50,
          y: 30,
        },
        {
          id: "mr-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Grain Platform & Divider",
          description: "Wooden table receiving severed grain and outer crop divider snout.",
          x: 75,
          y: 65,
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
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1834–1858",
    impactScore: 99,
  },
};
