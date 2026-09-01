import type { Patent } from "@/types/patent";

/**
 * The PDF's source face is deliberately withheld from the catalogue. It is a
 * modern reconstruction, so no legal claim, source drawing, filing date, or
 * purported quotation is derived from it.
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
  filingDate: null,
  era: "Pre-Industrial & Early Industrial (Pre-1800)",
  category: "materials",
  categoryLabel: "Textile Machinery & Automation",
  summary:
    "British Patent No. 931, granted to Richard Arkwright in 1769, is the foundational milestone of mechanical textile manufacturing and the catalyst of the modern factory system. By passing loose cotton roving through successive pairs of rollers rotating with differential, accelerating velocities, the Water Frame mechanically drafted and parallelized cotton fibers before imparting intense helical twist with 3,500+ RPM flyers. Unlike Hargreaves' Spinning Jenny, which produced fragile weft thread suitable only for cross-filling, Arkwright's machine produced 'Water Twist'—a dense, hard-spun cotton warp yarn strong enough to replace expensive linen in commercial looms, enabling the production of 100% pure cotton cloth at industrial scale.",
  heroQuote: "An Engine for the Making of Cotton and Other Yarn",
  originalPdfUrl: "/patents/pdfs/gb-931-arkwright-water-frame.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/GB176900931A/en",
  usptoClassification: "D01H 1/04 (Spinning machines with drawing rollers and revolving flyers)",
  stats: {
    totalClaims: 0,
    independentClaims: 0,
  },
  originalText:
    "Primary-source transcription unavailable. The pinned PDF is a modern research reconstruction and is not published as historical patent text.",
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
  // No claim or drawing nodes may escape from the modern reconstruction.
  // A primary historical facsimile must be pinned and reviewed before either
  // array is populated.
  claims: [],
  drawings: [],
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
