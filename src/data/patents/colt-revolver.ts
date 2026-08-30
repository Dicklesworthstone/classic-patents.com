import { coltRevolverArchivalEdition } from "@/data/editions/coltRevolverEdition";
import type { Patent } from "@/types/patent";

const manualClaimText = (number: number): string => {
  const block = coltRevolverArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`US X9430 is missing its authored claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
};

export const coltRevolverPatent: Patent = {
  id: "us-x9430-colt-revolver",
  patentNumber: "US X9430",
  title: "Improvement in Fire-Arms",
  shortTitle: "Revolving Gun",
  subtitle: "Indexed revolving cylinder, locking key, and percussion-cap protection",
  inventors: ["Samuel Colt"],
  inventorLocation: "Hartford, Connecticut",
  grantDate: "1836-02-25",
  // The pinned specification names the grant date but gives no application date.
  filingDate: null,
  era: "Early Republic & Industrial Dawn (1790–1839)",
  category: "consumer",
  categoryLabel: "Mechanical Indexing & Fire-Arms",
  summary:
    "US X9430 is Samuel Colt's February 25, 1836 specification for a revolving gun. Its text describes a cylinder carried on an arbor, a ratchet and lifter driven by cocking the hammer, a spring-held locking key, separated percussion-cap tubes, and related long-gun lockwork.",
  heroQuote: "The principle of locking and turning the cylinder.",
  originalPdfUrl: "/patents/pdfs/us-x9430-colt-revolver.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/USX9430I1/en",
  usptoClassification: "Historical U.S. patent; revolving fire-arms",
  archivalEdition: coltRevolverArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-x9430-colt-revolver-reviewed.txt",
    pageCount: 7,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "61eed2c1b5ea259a301fb2690a7d3d17e1a59560cfb002dc91c29a50f5841d01",
  },
  originalText:
    "Be it known that I, SAMUEL COLT, of Hartford, in the county of Hartford and State of Connecticut, have invented a new and useful Improvement in Fire-Arms. The complete, source-checked specification, all eight claims, drawing-sheet descriptions, signature, and witnesses are presented in the manually prepared Original Patent Text edition.",
  plainEnglishExplanation: {
    overview:
      "Colt's specification links a repeating gun's parts into one sequence: cocking frees the cylinder, the lifter advances a ratchet, a spring-held key re-enters a ward to lock the next chamber opposite the barrel, and the trigger releases the hammer onto a percussion cap.",
    coreMechanism:
      "The cited mechanism is a discrete indexing chain, not a claim to a particular chamber count. Hammer pin p first lifts the locking key so its end r leaves a cylinder ward. The lifter arm d then pushes a ratchet tooth s through the shackle, advancing one chamber. Once pin p passes the key's upper end t, spring m forces r into the succeeding ward. The trigger-held connecting rod then releases the hammer to strike the cap on the aligned tube.",
    mechanicalBreakdown: [
      {
        title: "Arbor, cylinder, and shackle",
        summary:
          "The arbor carries the revolving cylinder while a shackle mechanically joins the cylinder to its ratchet.",
        technicalDetails:
          "The specification says the arbor is keyed against turning in the shield, while the cylinder turns by the ratchet and shackle. The claim is the shackle's application to connect those two members, not an unstated modern geometry.",
        archaicTerm: "Arbor",
        modernEquivalent: "Cylinder axis or spindle",
      },
      {
        title: "Lifter, ratchet, and locking key",
        summary:
          "Cocking advances one chamber and the spring key locks that chamber at the barrel.",
        technicalDetails:
          "The lifter's arm d acts on a ratchet tooth; the hammer pin p lifts the key before the turn and spring m restores its end r to the next ward. In plain terms, the gun separates unlocking, indexing, and lockup into a causal sequence.",
        archaicTerm: "Lifter or hand",
        modernEquivalent: "Cylinder-indexing pawl",
      },
      {
        title: "Cap tubes, partitions, and shield",
        summary:
          "The rear percussion caps sit on individual tubes with partitions and a shield around them.",
        technicalDetails:
          "Colt expressly says the partitions prevent fire or smoke communicating from one cap to another. His third claim additionally names the shield as protection against moisture and smoke affecting the lockwork.",
        archaicTerm: "Percussion-cap",
        modernEquivalent: "Impact-sensitive primer cap",
      },
      {
        title: "Connecting rod and trigger",
        summary:
          "A rod joins the hammer's cocked catch to the trigger so the trigger can release it.",
        technicalDetails:
          "The rod is pushed forward while cocking and then caught by the trigger. Pulling the trigger draws the rod from the hammer catch; the mainspring drives the hammer forward. Claim 4 names this rod principle directly.",
        archaicTerm: "Connecting-rod",
        modernEquivalent: "Trigger-to-sear linkage",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Discrete angular indexing",
        formula: "Δθ = 2π / N",
        explanation:
          "For a cylinder with N chambers, advancing one ratchet tooth rotates the chamber pattern by one Nth of a revolution. The patent describes that one-chamber advance but does not specify N.",
      },
      {
        principle: "Moment balance about a pivot",
        formula: "τ = r × F",
        explanation:
          "The hammer, key, trigger, and lever work about named fulcrums. A force applied at a distance from a fulcrum creates the turning moment that moves the connected part.",
      },
    ],
    whyItMattersToday:
      "The document is an early primary source for the linked problems of indexing, lockup, cap isolation, and trigger release in a revolving firearm. Its claims are narrower and more varied than a later shorthand description of a generic revolver mechanism.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish: "Claims placing the percussion caps at the cylinder's end.",
      keyInnovations: ["End-mounted percussion caps"],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish: "Claims the separating partition between adjacent caps.",
      keyInnovations: ["Cap partition"],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claims a protective shield over the caps to guard the lockwork from moisture and smoke.",
      keyInnovations: ["Cap shield", "Lockwork protection"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish: "Claims the rod that mechanically connects hammer and trigger.",
      keyInnovations: ["Hammer-to-trigger connecting rod"],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish: "Claims the shackle used to connect the cylinder and its ratchet.",
      keyInnovations: ["Cylinder-to-ratchet shackle"],
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualClaimText(6),
      plainEnglish: "Claims the combined principle of cylinder lockup and rotation.",
      keyInnovations: ["Cylinder locking", "Cylinder turning"],
    },
    {
      number: 7,
      isIndependent: true,
      originalText: manualClaimText(7),
      plainEnglish: "Claims the arbor-and-plate arrangement that unites barrel and cylinder.",
      keyInnovations: ["Arbor", "Barrel-to-cylinder union"],
    },
    {
      number: 8,
      isIndependent: true,
      originalText: manualClaimText(8),
      plainEnglish:
        "Claims the adopter and setting lever used in the long-gun arrangement, which the text distinguishes from the pistol.",
      keyInnovations: ["Adopter", "Setting lever"],
    },
  ],
  drawings: [
    {
      figureNumber: "Division 1",
      title: "Pistol",
      caption: "The complete pistol view described in the specification.",
      svgType: "colt-revolver",
      callouts: [
        {
          id: "x9430-hammer",
          figureRef: "Division 3, Fig. 1",
          label: "a",
          element: "Hammer fulcrum",
          description: "Pivot point of the percussion-cap-striking hammer.",
          x: 34,
          y: 56,
        },
        {
          id: "x9430-lifter",
          figureRef: "Division 3, Fig. 4",
          label: "d",
          element: "Lifter arm",
          description: "Arm that enters the ratchet teeth to advance the cylinder.",
          x: 44,
          y: 58,
        },
        {
          id: "x9430-key",
          figureRef: "Division 3, Fig. 3",
          label: "r",
          element: "Locking-key end",
          description: "Spring-driven end that enters the succeeding cylinder ward.",
          x: 53,
          y: 62,
        },
      ],
    },
    {
      figureNumber: "Division 2",
      title: "Four sectional views",
      caption:
        "The source divides the pistol into four sections to show the arbor, cylinder, lock plate, barrel, and related parts.",
      svgType: "colt-revolver",
      callouts: [
        {
          id: "x9430-sec1",
          figureRef: "Division 2, Section 1",
          label: "Sec. 1",
          element: "Lockwork and Frame",
          description: "Rear frame housing the hammer, springs, and trigger linkage.",
          x: 24,
          y: 52,
        },
        {
          id: "x9430-sec2",
          figureRef: "Division 2, Section 2",
          label: "Sec. 2",
          element: "Chambered Cylinder",
          description: "Rotating multi-chamber cylinder with rear ratchet teeth.",
          x: 48,
          y: 48,
        },
        {
          id: "x9430-sec3",
          figureRef: "Division 2, Section 3",
          label: "Sec. 3",
          element: "Rifled Barrel & Wedge",
          description: "Stationary barrel aligning with the active top chamber.",
          x: 75,
          y: 45,
        },
        {
          id: "x9430-sec4",
          figureRef: "Division 2, Section 4",
          label: "Sec. 4",
          element: "Central Arbor",
          description: "Solid central axis uniting the frame, cylinder, and barrel assembly.",
          x: 50,
          y: 62,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification itself identifies the practical problem: make successive chambered shots while maintaining a locked chamber at the barrel and isolating neighboring percussion caps.",
    priorArtLimitations: [
      "The source does not identify a named prior machine or inventor; this record does not infer one from the facsimile.",
    ],
    breakthroughInsight:
      "Colt assigns separate mechanical work to the hammer pin, lifter, ratchet, locking key, springs, and connecting rod, then describes their order during cocking and discharge.",
    patentWars: [
      {
        rivalName: "Massachusetts Arms Company (Edwin Wesson & Daniel Leavitt)",
        rivalClaim:
          "Mass Arms produced revolvers based on Daniel Leavitt's 1837 patent and Edwin Wesson's 1849 patent, claiming hand-rotated cylinders or bevel gear indexing did not infringe Colt's 1836 patent.",
        conflictDetails:
          "Colt sued Massachusetts Arms in 1851 in the US Circuit Court in Boston (Colt v. Massachusetts Arms Co.), represented by attorney Edward N. Dickerson.",
        resolution:
          "Colt presented mechanical models demonstrating how Mass Arms' lockwork infringed the fundamental mechanism of cocking the hammer to rotate the cylinder and lock it into direct alignment with the barrel.",
        legalOutcome:
          "Justice Levi Woodbury and the Boston jury ruled completely in Colt's favor, issuing a sweeping permanent injunction that shut down Mass Arms revolver production and cemented Colt's monopoly until his patent expired in 1857.",
      },
    ],
    civilizationalImpact:
      "The document preserves an early United States claim set for component-level solutions to repeated percussion-cap firing: cap placement and separation, smoke protection, trigger linkage, cylinder drive and lockup, and the barrel-arbor union.",
    aftermath:
      "This record makes no litigation or manufacturing claim without a separately reviewed historical source.",
  },
  tags: ["Samuel Colt", "Revolving gun", "Percussion fire-arm", "Mechanical indexing"],
  stats: { totalClaims: 8, independentClaims: 8 },
};
