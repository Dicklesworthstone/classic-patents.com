import { mccormickReaperArchivalEdition } from "@/data/editions/mccormickReaperEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = mccormickReaperArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`McCormick manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

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
    url: "/patents/transcripts/us-x8277-mccormick-reaper-reviewed.txt",
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
      "McCormick's specification treats reaping as a coordinated mechanical problem: bring standing grain to a cutter, keep it supported while it is cut, carry the severed stalks onto a platform, keep the cut swath apart from standing grain, and transmit the ground wheel's motion through gears, cranks, and a belt. It describes a horse-drawn machine rather than asserting a particular yield or speed of work.",
    coreMechanism:
      "As the horses advance, the ground wheel turns a 30-tooth gear on its axle. The printed 30:9 and 27:9 gear engagements turn the double crank, while a belt from a roughly 13-inch pulley drives the reel's roughly 12-inch pulley. The lower cutter is a grooved or toothed steel blade; the source also describes an upper sliding plate with longer teeth and an alternative fixed upper support. The reel guides stalks to the cutter and the platform receives them until a worker rakes them away. The source does not give a measured cutter cadence, power, or field capacity.",
    mechanicalBreakdown: [
      {
        title: "Reciprocating Serrated Sickle Bar",
        summary: "Crank-driven moving blade with a smooth or toothed cutting edge.",
        technicalDetails:
          "The lower cutter is connected near the crank by a joint and wooden pin. McCormick says its grooved or toothed lower edge moves through part of a circle. A second upper plate may slide in the opposite direction with longer teeth, or those upper teeth may be fixed. The facsimile supplies gear tooth counts but not the blade's stroke length, force, or a measured cutting frequency.",
        archaicTerm: "Straight cutting blade with serrated teeth",
        modernEquivalent: "Reciprocating cutter bar / Sickle section knife",
      },
      {
        title: "Stationary Slotted Guard Fingers",
        summary: "Upper teeth or supports that hold stalks at the cutter.",
        technicalDetails:
          "The source describes upper teeth about one and a half inches long and about the same distance apart. They may move contrary to the lower cutter or be fixed and bent over its edge. Their stated job is to gather stalks and force them across the lower teeth. It does not specify modern guard geometry, a slot size, or a material stress value.",
        archaicTerm: "Spear-shaped fingers or guards",
        modernEquivalent: "Sickle guard fingers / Rock guards",
      },
      {
        title: "Revolving Gathering Reel",
        summary: "Rotating radial paddle vanes sweeping stalks into the cutter.",
        technicalDetails:
          "The reel axle moves vertically in grooved posts by an adjusting pin. Its approximately twelve-inch pulley is belt-driven from the approximately thirteen-inch wheel on the ground-wheel axle. The source says the cross-arms project about three feet and carry a thin band about six inches wide. It describes the reel bearing stalks to the cutter and then laying severed grain on the platform; it does not state a reel-to-ground-speed target.",
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
          "The specification begins with a wooden platform about six feet wide and four or five feet long. It says the reel lands separated stalks on that platform and a hand with a rake discharges them from its right end when enough has accumulated. It does not identify a wood species, a rear-lip geometry, or a mass for a gavel.",
        archaicTerm: "Platform to receive the cut grain",
        modernEquivalent: "Header draper table / Combine cutterbar platform",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Double-Shear Mechanics in Stalk Cutting",
        formula: "\\tau = \\frac{F}{A}",
        explanation:
          "Shear stress is force divided by the cut area. The source's engineering point is mechanical support: its upper teeth gather and hold stalks at the lower cutter. The patent gives no force measurement or energy comparison, so this relation explains the category of loading without assigning a historical performance value.",
      },
      {
        principle: "Kinematics of the Ground-Wheel Pitman Crank",
        formula:
          "n_{\\mathrm{crank}} = n_{\\mathrm{wheel}}\\left(\\frac{30}{9}\\right)\\left(\\frac{27}{9}\\right)",
        explanation:
          "For a no-slip reading of the stated gear train, the two printed tooth ratios multiply the ground-wheel speed by ten at the crank. This is a source-dimension estimate, not a claim that the historical machine held that speed under crop load.",
      },
      {
        principle: "Cycloidal Trajectory of the Reel Vane",
        formula: "n_{\\mathrm{reel}} = n_{\\mathrm{wheel}}\\left(\\frac{13}{12}\\right)",
        explanation:
          "The thirteen-inch pulley on the ground-wheel axle and the approximately twelve-inch reel pulley establish the indicated no-slip speed ratio. The visible reel model uses that ratio to show the order of operations, not to recover a surveyed vane trajectory from the patent drawing.",
      },
      {
        principle: "Ground-Wheel Traction & Soil Slip-Limit Torque",
        formula: "v = n_{\\mathrm{wheel}}\\pi d",
        explanation:
          "The source states a ground wheel about two feet in diameter with teeth on its circumference to hold the ground. The equation relates forward speed, wheel speed, and diameter under a no-slip assumption. It does not establish soil friction, torque, or a stall threshold.",
      },
    ],
    whyItMattersToday:
      "The specification shows why a reaper is a system rather than a single blade: draft, crop division, cutting support, reel, platform, and motion transmission have to work together. Modern harvesters use very different machinery, but the problem decomposition remains recognizable. This page does not use the patent alone to quantify its economic or labor effects.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
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
      originalText: manualClaimText(2),
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
          description:
            "The receiving surface on which cut grain is held until a raker removes a sheaf.",
          x: 62,
          y: 70,
        },
        {
          id: "mr-2",
          figureRef: "Unnumbered drawing sheet",
          label: "B",
          element: "Tongue",
          description:
            "The long draft member connected to the team and suspended by a pole and chain.",
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
          description:
            "The forward projecting part that separates the grain to be cut from standing grain.",
          x: 26,
          y: 49,
        },
        {
          id: "mr-5",
          figureRef: "Unnumbered drawing sheet",
          label: "W",
          element: "Reel",
          description:
            "The belt-driven gathering reel carrying stalks inward to the cutter and platform.",
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
      "The specification's practical problem is keeping a horse-drawn cutting machine coordinated with standing grain: the stalks must be divided, brought to the cutter, supported during cutting, and deposited where a worker can rake them away. Its proposed solution makes the ground wheel transmit motion to both the crank-driven cutter and the belt-driven reel.",
    priorArtLimitations: [
      "A cutter alone would not solve the handling problem described here: McCormick specifies a divider, a reel, a platform, and an arrangement that keeps grain to be cut apart from grain left standing.",
      "The source explicitly gives alternatives for the upper cutter support, which shows that the inventor was addressing both the cutting action and the way stalks were held at the blade.",
      "The facsimile provides no comparative trials of rival machines or quantified failure rates, so this record does not infer them from the patent alone.",
    ],
    breakthroughInsight:
      "The patent joins a divider, platform, crank-driven cutter, adjustable reel, draft arrangement, and gear-and-belt transmission into one working sequence. Its detailed dimensions and tooth counts make the machinery's dependency chain inspectable rather than treating the reaper as a single invention-shaped object.",
    patentWars: [
      {
        rivalName: "John H. Manny and his partners",
        rivalClaim:
          "The later litigation concerned McCormick's 1845 and 1847 reaper improvements, including the divider, reel support, and raker's-seat/reel arrangements; it did not determine the scope of the 1834 X8277 specification shown here.",
        conflictDetails:
          "McCormick filed a bill against Manny in the United States Circuit Court for the Northern District of Illinois in 1854. The record reports a hearing in Cincinnati in September 1855 before Circuit Judge John McLean and District Judge Thomas Drummond; Edwin M. Stanton and George Harding argued for the defendants.",
        resolution:
          "The Circuit Court dismissed McCormick's bill. The Supreme Court later affirmed the dismissal and assessed costs against McCormick in 1858.",
        legalOutcome:
          "The court treated Manny's arrangements as materially different and found relevant features had appeared before McCormick's later patents. It is an infringement decision about those later improvements, not evidence that the 1834 patent was void or that every reaper feature was free for use.",
      },
    ],
    civilizationalImpact:
      "The Smithsonian's McCormick reaper collection record describes a path from the 1834 machine to a Chicago factory opened in 1847, where standardized parts and manufacturing process were developed. That institutional history supports treating the reaper as both a mechanical system and a manufactured product, without assigning the patent a single-cause role in agricultural or labor history.",
    funFact:
      "The Smithsonian collection record identifies its 1834 reaper model as a model shown at London's 1851 Crystal Palace Exhibition, where it received the Council Medal.",
    aftermath:
      "The Smithsonian record says McCormick opened a factory outside Chicago in 1847 and that the McCormick Harvesting Machine Company's advertising helped it sell more than 50,000 reapers per year by the mid-1880s. This record does not attach that later figure to the 1834 patent's output or claim scope.",
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
