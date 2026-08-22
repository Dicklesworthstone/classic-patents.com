import type { Patent } from "@/types/patent";
import {
  arkwrightWaterFrameArchivalEdition,
  manualArkwrightClaimText,
} from "../editions/arkwrightWaterFrameEdition";

const arkwrightFigureCallouts = {
  "1": [
    {
      id: "aw-drum-a",
      figureRef: "Fig. 1",
      label: "Great Wheel / Drum (A)",
      element: "A",
      description: "Great wooden driving drum transmitting mechanical water power to the frame.",
      x: 49,
      y: 88,
    },
    {
      id: "aw-shaft-b",
      figureRef: "Fig. 1",
      label: "Driving Shaft & Clutch (B)",
      element: "B",
      description:
        "Horizontal iron driving shaft with individual spindle whorl bands and disengaging levers.",
      x: 21,
      y: 78,
    },
    {
      id: "aw-rollers-c",
      figureRef: "Fig. 1",
      label: "Differential Drawing Rollers (C)",
      element: "C",
      description:
        "Accelerating pairs of leather-covered top rollers and fluted brass/iron lower cylinders.",
      x: 35,
      y: 19,
    },
    {
      id: "aw-weights-d",
      figureRef: "Fig. 1",
      label: "Weighted Levers (D)",
      element: "D",
      description:
        "Suspended lead weights pressing upper leather rollers for slip-free fiber traction.",
      x: 27,
      y: 32,
    },
    {
      id: "aw-flyers-e",
      figureRef: "Fig. 1",
      label: "High-Speed Steel Flyers (E)",
      element: "E",
      description:
        "U-shaped steel flyers with guide eyes rotating at 3500+ RPM to impart true helical twist.",
      x: 20,
      y: 46,
    },
    {
      id: "aw-bobbins-f",
      figureRef: "Fig. 1",
      label: "Drag-Retarded Bobbins (F)",
      element: "F",
      description:
        "Friction-retarded bobbins collecting spun yarn under steady differential winding tension.",
      x: 29,
      y: 57,
    },
    {
      id: "aw-cam-g",
      figureRef: "Fig. 1",
      label: "Heart-Cam Traverse Motion (G)",
      element: "G",
      description:
        "Cardioid builder cam oscillating the bobbin rail for uniform cylindrical yarn distribution.",
      x: 87,
      y: 66,
    },
  ],
};

/**
 * The PDF's source face is deliberately withheld from the catalogue while a
 * fresh reviewer reconciles the three-page pinned document, ledger, and
 * authored edition. The claim lookup remains dynamic so this record does not
 * introduce a second copy of legal-text strings.
 */
export const arkwrightWaterFramePatent: Patent = {
  id: "gb-931-arkwright-water-frame",
  patentNumber: "GB 931",
  title: "Manufacture of Yarn: An Engine for Making of Cotton and Other Yarn",
  shortTitle: "Arkwright Water Frame Spinning Machine",
  subtitle:
    "Differential Roller Attenuation, High-Speed Flyer Twisting, and Water-Powered Continuous Bobbin Winding",
  inventors: ["Richard Arkwright"],
  inventorLocation: "Nottingham, England",
  grantDate: "1769-07-15",
  filingDate: "1769-07-15",
  era: "Pre-Industrial & Early Industrial (Pre-1800)",
  category: "materials",
  categoryLabel: "Textile Machinery & Automation",
  summary:
    "British Patent No. 931, granted to Richard Arkwright in 1769, is the foundational milestone of mechanical textile manufacturing and the catalyst of the modern factory system. By passing loose cotton roving through successive pairs of rollers rotating with differential, accelerating velocities, the Water Frame mechanically drafted and parallelized cotton fibers before imparting intense helical twist with 3,500+ RPM flyers. Unlike Hargreaves' Spinning Jenny, which produced fragile weft thread suitable only for cross-filling, Arkwright's machine produced 'Water Twist'—a dense, hard-spun cotton warp yarn strong enough to replace expensive linen in commercial looms, enabling the production of 100% pure cotton cloth at industrial scale.",
  heroQuote:
    "Drawing out and attenuating cotton, wool, or other fibrous substances into a roving or thread of any desired fineness by passing the same successively through two or more pairs of rollers turning with different and accelerating velocities.",
  originalPdfUrl: "/patents/pdfs/gb-931-arkwright-water-frame.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/GB176900931A/en",
  originalTextAsset: {
    url: "/patents/transcripts/gb-931-arkwright-water-frame-reviewed.txt",
    pageCount: 2,
    kind: "reviewed-transcription",
    reviewedBy:
      "Classic Patents editorial agent (embedded text-layer extraction; human review pending)",
    reviewedAt: "2026-08-22",
    sourcePdfSha256: "3254894ae66cb4ddd2612d164e24af76f5efa8ee8ac6b741c8affc70d8fe62fd",
  },
  archivalEdition: arkwrightWaterFrameArchivalEdition,
  usptoClassification: "D01H 1/04 (Spinning machines with drawing rollers and revolving flyers)",
  stats: {
    totalClaims: 4,
    independentClaims: 4,
    patentWarYears: "1781–1785",
    impactScore: 99,
  },
  originalText:
    "TO ALL TO WHOM THESE PRESENTS SHALL COME, I, RICHARD ARKWRIGHT, of Nottingham, in the County of Nottingham, send greeting: WHEREAS His most Excellent Majesty King George the Third, by His Letters Patent under the Great Seal of Great Britain, bearing date at Westminster, the Fifteenth day of July, in the ninth year of His reign, did give and grant unto me... my new Invented Apparatus or Engine for the Making of Weft or Yarn from Cotton, Flax, and Wool...\n\n[Curated source excerpt only. The archival edition and reviewed ledger are withheld while an independent review reconciles the three-page pinned PDF, including the Figure 1 drawing on PDF page 3.]",
  plainEnglishExplanation: {
    overview:
      "Before 1769, textile production was constrained by a critical technological bottleneck: hand spinners on traditional spinning wheels could not produce strong cotton yarn. All European 'cotton' cloth was actually fustian—a hybrid fabric with a strong linen warp (lengthwise threads under high loom tension) and weak cotton weft (crosswise filling). James Hargreaves' 1764 Spinning Jenny multiplied human output but still relied on manual drafting, producing soft, low-twist yarn that snapped under loom tension. Richard Arkwright solved this by inventing continuous mechanical drafting using differential rollers combined with high-speed flyer twisting, creating 'Water Twist'—the world's first industrial cotton yarn strong enough for loom warp.",
    coreMechanism:
      "The Water Frame operates through three coupled mechanical stages: (1) Differential Roller Drafting: Carded cotton roving passes through four successive pairs of cylindrical rollers. Each pair rotates faster than the preceding pair (D = v4 / v1 ≈ 6x). The slow feed pair holds the roving while the accelerating delivery pair pulls and stretches the fibers, sliding them past one another to parallelize and attenuate the roving. (2) Positive Clamping: Upper leather-covered rollers are held down against bottom fluted brass/iron cylinders by suspended lead deadweights, ensuring zero slippage without cutting delicate fibers. (3) Flyer Twisting and Drag Take-Up: The attenuated roving enters the hollow eye of a steel flyer rotating at 3,500+ RPM on a vertical spindle, twisting fibers into compact yarn. The yarn winds onto an internal bobbin retarded by friction drag cords, while a heart-cam slowly oscillates the bobbin rail vertically for uniform spool layering.",
    mechanicalBreakdown: [
      {
        title: "Differential Drawing Rollers (C)",
        summary:
          "Four pairs of accelerating cylindrical rollers that mechanically attenuate and parallelize cotton staple fibers.",
        technicalDetails:
          "The first pair turns slowly at surface speed $v_1$, while the fourth delivery pair turns at $v_4 = 6 \\cdot v_1$. As fibers bridge the gap between pairs spaced slightly farther apart than the staple length ($L_{\\text{nip}} > L_{\\text{staple}}$), the faster rollers draw individual fibers forward, attenuating the linear density from coarse roving ($N_e \\approx 1$) to fine spun yarn ($N_e \\approx 6\\text{ to }16$).",
        archaicTerm: "Cylindrical drawing rollers turning with different degrees of velocity",
        modernEquivalent: "Multi-zone drafting system / 4-over-4 roller drafting apron",
      },
      {
        title: "Leather-Covered & Fluted Pressure Rollers (C & D)",
        summary:
          "Deadweight-loaded composite rollers ensuring positive, non-destructive fiber traction.",
        technicalDetails:
          "Bottom cylinders are fluted iron/brass driven positively by gear trains. Top pressure rollers are solid wood covered with smooth, resilient calf-leather. Suspended lead weights ($3.5\\text{ kg}$) hang from saddles over the upper bearings, creating normal force $N = m \\cdot g \\approx 34.3\\text{ N}$ to prevent fiber slippage during high draft ratios without crushing fiber cell walls.",
        archaicTerm:
          "Top rollers covered with leather and lower rollers of fluted iron or brass with lead weights",
        modernEquivalent: "Cots and fluted drafting cylinders with top-roller weight saddles",
      },
      {
        title: "High-Speed Revolving Flyers (E)",
        summary:
          "U-shaped steel flyers with wire guide eyes rotating at 3,500+ RPM on vertical spindles.",
        technicalDetails:
          "Mounted at the top of vertical steel spindles driven by leather bands from the central driving drum. The roving passes down through the flyer neck, travels down one curved hollow arm, passes through wire pigtail hooks, and emerges onto the bobbin. Each revolution inserts one complete 360° helical twist: $\\text{TPM} = \\frac{\\Omega_{\\text{flyer}}}{v_{\\text{delivery}}} \\approx 350\\text{ to }700\\text{ turns/m}$.",
        archaicTerm:
          "High-speed steel flyers having two curved arms with small wire guide loops or eyes",
        modernEquivalent: "Flyer and spindle twist insertion assembly (roving / ring flyer)",
      },
      {
        title: "Drag-Retarded Bobbins (F)",
        summary:
          "Dead-spindle friction bobbins enabling continuous differential take-up and winding under tension.",
        technicalDetails:
          "Bobbins sit loosely on the spindle shaft beneath the flyer. An adjustable weighted linen drag cord loops over the bobbin flange. As the flyer spins at $\\Omega_{\\text{flyer}}$, yarn tension pulls the bobbin around, but friction retardation causes the bobbin to lag behind by $\\Delta \\Omega = \\frac{v_{\\text{delivery}}}{\\pi \\cdot d_{\\text{bobbin}}}$, winding the newly twisted yarn smoothly onto the spool under continuous tension.",
        archaicTerm:
          "Bobbins loosely fitted upon the spindles beneath the flyers and retarded by friction bands",
        modernEquivalent: "Dead-spindle flyer winding with friction brake band",
      },
      {
        title: "Heart-Cam Traverse Rail Mechanism (G)",
        summary:
          "A cardioid cam providing constant-velocity linear reciprocating lift to the bobbin rail.",
        technicalDetails:
          "Driven by slow worm reduction gearing from the main horizontal shaft. The cardioid profile converts uniform angular rotation into perfectly linear vertical rise and fall ($v_{\\text{traverse}} = \\text{const}$), preventing yarn from bunching at the bobbin edges and building uniform cylindrical cops.",
        archaicTerm: "Heart-wheel or cam driven by slow worm gearing",
        modernEquivalent: "Cardioid builder cam / traverse ring rail motion",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Differential Draft Attenuation & Fiber Parallelization",
        formula:
          "D = \\frac{v_{\\text{delivery}}}{v_{\\text{feed}}} = \\frac{r_4 \\omega_4}{r_1 \\omega_1}, \\quad N_{e,\\text{out}} = N_{e,\\text{in}} \\cdot D",
        explanation:
          "As cotton fibers pass through accelerating roller nips separated by slightly more than the staple fiber length ($L > 28\\text{ mm}$), trailing ends are held while leading ends are pulled. This straightens crimped fibers, aligns them parallel to the strand axis, and reduces linear density (Tex) in direct proportion to the speed ratio $D$.",
      },
      {
        principle: "Helical Twist Insertion & Fiber Cohesion Tenacity",
        formula:
          "TPI = TM \\cdot \\sqrt{N_e} = \\frac{\\text{RPM}_{\\text{flyer}}}{v_{\\text{delivery}} \\cdot 39.37}, \\quad P_{\\text{radial}} = \\frac{2 T \\sin^2\\alpha}{r}",
        explanation:
          "Unspun roving has zero tensile strength because short staple fibers easily slip past one another. Imparting helical twist ($\\alpha$) converts longitudinal yarn tension ($T$) into inward radial clamping pressure ($P_{\\text{radial}}$), multiplying inter-fiber frictional resistance ($F = \\mu N$) via the capstan effect and producing unbreakable 'Water Twist' warp yarn.",
      },
      {
        principle: "Dead-Spindle Differential Take-up Dynamics",
        formula:
          "\\Delta \\omega = \\omega_{\\text{flyer}} - \\omega_{\\text{bobbin}} = \\frac{v_{\\text{delivery}}}{r_{\\text{bobbin}}}, \\quad T_{\\text{wind}} = \\mu \\cdot m_{\\text{drag}} \\cdot g",
        explanation:
          "Because the bobbin is driven exclusively by yarn pull against an external friction brake cord, it automatically synchronizes its rotational slip speed $\\Delta\\omega$ to absorb the exact linear delivery of drawn yarn without stretching or breaking the newly twisted thread.",
      },
      {
        principle: "Constant-Velocity Cardioid Traverse Kinetics",
        formula:
          "r(\\theta) = r_0 \\pm k \\theta \\implies \\frac{dr}{dt} = k \\frac{d\\theta}{dt} = \\text{constant}",
        explanation:
          "A circular eccentric cam produces sinusoidal acceleration, causing yarn to pile up heavily at the bobbin flanges. Arkwright's Archimedean heart-cam maintains strict constant velocity throughout the entire up-and-down stroke, ensuring flat, uniform yarn distribution.",
      },
    ],
    whyItMattersToday:
      "Arkwright's Water Frame was the machine that built the modern world. In 1771, Arkwright erected Cromford Mill in Derbyshire, powered by the Bonsall Brook and River Derwent. Operating 24 hours a day with hundreds of organized workers, Cromford became the blueprint for the industrial factory system. By producing inexpensive, high-strength all-cotton yarn, the Water Frame enabled the British textile industry to surpass Indian hand-spinners, sparking global trade expansion, urban industrialization, and the First Industrial Revolution.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualArkwrightClaimText(1),
      plainEnglish:
        "Protects the fundamental principle of differential roller drafting: drawing out and attenuating fibrous roving by passing it successively through two or more pairs of rollers turning with different, accelerating velocities.",
      keyInnovations: [
        "Multi-stage differential roller drafting",
        "Continuous mechanical fiber attenuation",
        "Elimination of manual human finger drawing",
      ],
      legalSignificance:
        "The primary patent claim of the Industrial Revolution. It established the universal drafting mechanism used in every cotton, wool, and synthetic spinning mill in the world to this day.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualArkwrightClaimText(2),
      plainEnglish:
        "Protects the composite roller structure and pressure system: clamping smooth leather-covered top rollers onto fluted metal cylinders via suspended deadweights to maintain uniform slip-free traction.",
      keyInnovations: [
        "Leather-covered top cots",
        "Fluted iron/brass lower drive cylinders",
        "Suspended deadweight pressure saddles",
      ],
      legalSignificance:
        "Overcame previous failures by Lewis Paul and John Wyatt (1738), whose unweighted smooth rollers allowed roving to slip or snag and tear.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualArkwrightClaimText(3),
      plainEnglish:
        "Protects the continuous twist insertion mechanism: rapidly revolving flyers mounted upon upright spindles that twist the drawn fibers into compact, strong yarn immediately upon exit from the front delivery rollers.",
      keyInnovations: [
        "High-speed vertical spindle flyers (3500+ RPM)",
        "Direct flyer-to-roller twist synchronization",
        "Creation of high-tenacity 'Water Twist' warp yarn",
      ],
      legalSignificance:
        "Transformed fragile roving into warp-grade yarn strong enough to endure the aggressive mechanical shedding and beating of power looms.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualArkwrightClaimText(4),
      plainEnglish:
        "Protects the bobbin take-up and traverse mechanism: winding twisted yarn onto drag-retarded bobbins while an oscillating heart-cam moves the bobbin rail vertically for uniform spool packaging.",
      keyInnovations: [
        "Friction-retarded dead-spindle bobbin take-up",
        "Constant-velocity heart-cam builder motion",
        "Uniform cylindrical cop packaging",
      ],
      legalSignificance:
        "Prevented yarn snarling and uneven bobbin bulges, allowing bobbins to be transferred directly to warping mills and shuttles without manual rewinding.",
    },
  ],
  drawings: [
    {
      figureNumber: "1",
      title: "Water Frame Drawing Sheet (PDF Page 3)",
      caption:
        "The pinned PDF's third page carries the water-frame drawing sheet, with the great driving drum (A), horizontal shaft and clutches (B), differential drafting rollers (C), pressing weights (D), flyers (E), bobbins (F), and heart-cam traverse (G).",
      svgType: "arkwright-water-frame",
      callouts: arkwrightFigureCallouts["1"],
    },
  ],
  historicalContext: {
    problemStatement:
      "The mid-18th century British textile trade was starved for cotton warp yarn. While John Kay's Flying Shuttle (1733) doubled weaver productivity, it created an acute yarn shortage—six hand spinners were required to supply a single loom. Hargreaves' Spinning Jenny (1764) multiplied output but produced weak, fragile thread suitable only for crosswise weft filling.",
    priorArtLimitations: [
      "Traditional single-thread spinning wheels required skilled manual finger drafting and produced inconsistent yarn counts.",
      "Lewis Paul and John Wyatt's 1738 drafting patent failed due to unweighted rollers that slipped and clogged with raw fibers.",
      "Hargreaves' Spinning Jenny lacked continuous mechanical drafting, creating soft yarn that snapped under loom warp tension.",
    ],
    breakthroughInsight:
      "Arkwright realized that combining pairs of accelerating differential-speed rollers (with top leather cots and bottom fluted metal cylinders clamped by lead deadweights) with high-speed spindle flyers could continuously parallelize staple fibers and insert intense helical twist, mechanically producing unbreakable all-cotton warp yarn without human touch.",
    patentWars: [
      {
        rivalName: "Thomas Highs & Lancashire Cotton Spinners Association",
        rivalClaim:
          "Thomas Highs and clockmaker John Kay claimed that Highs had constructed a wooden model of differential rollers in 1767, which Kay allegedly disclosed to Arkwright.",
        conflictDetails:
          "In 1781 and 1785, the Lancashire Spinners Association sued to invalidate Arkwright's patents on grounds of prior invention by Highs and Wyatt.",
        resolution:
          "The Court of King's Bench under Lord Mansfield cancelled Arkwright's broader 1775 carding patent in 1785 due to vague specification drafting, but his foundational 1769 patent had already expired and remained the undisputed engineering model for all factory spinning.",
        legalOutcome:
          "Arkwright retained his massive industrial fortune and Cromford Mill empire, establishing differential roller drafting as the universal foundation of mechanical textile manufacturing.",
      },
    ],
    civilizationalImpact:
      "Arkwright's 1769 Water Frame was the machine that built the factory system. By concentrating machinery, water power, and hundreds of disciplined workers under a single roof at Cromford Mill (1771), Arkwright established modern industrial capitalism and propelled Great Britain into the First Industrial Revolution.",
    funFact:
      "Because 18th-century English law prohibited the weaving of 100% pure cotton calicoes to protect the domestic wool industry, Arkwright lobbied Parliament in 1774 to repeal the Calico Act, proving his 'Water Twist' yarn was superior to imported Indian textiles.",
    aftermath:
      "Arkwright was knighted in 1786 and left an enormous personal fortune of over £500,000 upon his death in 1792.",
  },
  tags: [
    "textiles",
    "spinning",
    "industrial-revolution",
    "water-power",
    "automation",
    "manufacturing",
    "1769",
  ],
};
