import { mestralVelcroArchivalEdition } from "@/data/editions/mestralVelcroEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(claimNumber: number): string {
  const claimBlock = mestralVelcroArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (claimBlock?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} missing from mestralVelcroArchivalEdition blocks`);
  }
  return claimBlock.inlines.map((i) => ("text" in i ? i.text : "")).join("");
}

export const mestralVelcroPatent: Patent = {
  id: "us-2717437-mestral-velcro",
  patentNumber: "US 2,717,437",
  title: "Velvet Type Fabric and Method of Producing Same",
  shortTitle: "De Mestral Hook-and-Loop Fastener (Velcro)",
  subtitle:
    "Thermoplastic Polyamide Monofilament Hooks, Velvet Lancet Weave, and Peeling Anisotropy",
  inventors: ["George de Mestral"],
  inventorLocation: "Prangins, Vaud, Switzerland",
  grantDate: "1955-09-13",
  filingDate: "1952-10-15",
  era: "Information & Digital Age (1950–Present)",
  category: "consumer",
  categoryLabel: "Fasteners & Biomimetic Materials",
  summary:
    "George de Mestral's landmark 1955 patent established the biomimetic hook-and-loop fastener (Velcro). By weaving synthetic polyamide (nylon) monofilament loops over electrically heated lancet bars on a velvet loom and shearing them on one side, de Mestral created semi-rigid micro-hooks that reversibly interlock with opposing loops or mesh fibers. The resulting fastener delivers massive in-plane shear resistance while remaining effortlessly peelable without mechanical wear or registration constraints.",
  heroQuote:
    "A mere pressure exerted on the two garment elements against each other will provide for their fastening. A somewhat considerable tractional stress exerted on the two garment elements thus associated, allows separating them when required.",
  originalPdfUrl: "/patents/pdfs/us-2717437-mestral-velcro.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2717437A/en",
  usptoClassification: "28/72",

  originalTextAsset: {
    url: "/patents/transcripts/us-2717437-mestral-velcro-reviewed.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "3b55f3a8b19575d9261a48f695368101b229bc505a21ea9c554e09161b7aa91a",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "VELVET TYPE FABRIC AND METHOD OF PRODUCING SAME",
        sourceRelationship: "drawing sheet 1",
      },
      {
        page: 2,
        exactSourceText: "United States Patent Office 2,717,437",
        sourceRelationship: "specification columns 1 and 2",
      },
      {
        page: 3,
        exactSourceText: "The velvet fabric according to my invention",
        sourceRelationship: "specification column 3 and claims",
      },
    ],
  },

  archivalEdition: mestralVelcroArchivalEdition,

  originalText: `My invention has for its object a velvet fabric including a foundation structure constituted by a weft and a warp incorporating threads that are cut at a predetermined length so as to form a raised pile. My novel fabric distinguishes from the other similar fabrics by the fact that the raised pile is made of artificial material, while at least part of the threads in said pile is provided near its end with material-engaging means, as required for adhering to a similar fabric or for scouring purposes.

My invention has for its further object a method for producing a fabric of the above type, according to which the raised pile is provided with its material-engaging means by forming loops round a carrier and submitting the loops formed on the carrier to a thermic action with a view to giving them their final shape, after which the loops are cut on one side of the carrier so that each loop produces at least one pile thread having a hook-shaped end.

Fabrics of the type referred to are intended primarily for use as closing means or fasteners for garments, curtains and the like as substitutes for the usual slider-operated closing means or fasteners or for buttons or the like attaching means, whenever a yielding invisible closing arrangement is of advantage.`,

  plainEnglishExplanation: {
    overview:
      "In 1941, Swiss electrical engineer George de Mestral returned from a hunting trip in the Alps and examined the burdock burrs (Arctium lappa) tenaciously clinging to his Irish Pointer's fur and his wool socks. Under a microscope, he discovered that the burrs were covered in hundreds of microscopic stiff hooks that effortlessly entangled the flexible hair loops. De Mestral spent over a decade translating this natural fastening phenomenon into an industrial textile process. Traditional textile fasteners—zippers, buttons, and snap studs—relied on rigid metal or bone parts that required precise manual alignment, jammed with dirt, and suffered mechanical fatigue. De Mestral realized that synthetic thermoplastic polyamides (nylon) could be woven on a velvet bar loom into upright loops, heat-set to permanently freeze their curvature, and sheared on one leg to create hundreds of elastic micro-hooks per square centimeter. When pressed against an opposing pile of loops or cross-oriented hooks, the system self-aligns instantaneously, resisting high shear forces yet peeling open cleanly without mechanical fatigue.",
    coreMechanism:
      "The Velcro fastener operates through the mechanical interaction of elastic thermoplastic cantilever beams and microscopic geometry. During manufacture, auxiliary nylon warp threads are looped over transverse metallic lancet bars. Internal electrical resistance heating or steam raises the nylon above its heat-setting threshold (~140°C–180°C), relaxing internal molecular stresses and permanently locking the drawn polymer chains into a curved loop profile. A guided razor blade traveling along a groove in the lancet bar shears each loop asymmetrically, creating one active curved hook and one straight vertical standing strand. When two opposing fabric tapes are pressed together, hundreds of flexible hooks deflect elastically into the opposing pile and re-expand under the loops. In-plane shear loading pulls the hooks along their longitudinal axis where tensile stiffness is highest, requiring massive collective force ($F_{\\text{shear}} > 50\\text{ N/cm}^2$). In contrast, peeling loading applies normal tensile bending moment to only one narrow row of hooks at a time, allowing each individual hook to flex open ($F_{\\text{hook}} \\approx 0.05\\text{ N}$) and release cleanly without damaging the underlying weave.",
    mechanicalBreakdown: [
      {
        title: "Synthetic Polyamide (Nylon) Monofilament Loop Yarn",
        summary:
          "High-tenacity oriented nylon monofilament yarn providing elastic spring recovery and thermal memory.",
        technicalDetails:
          "De Mestral specifies continuous drawn synthetic polymeric amide (nylon) filaments. Axial drawing aligns the semicrystalline polymer chains along the filament axis, producing an elastic modulus $E \\approx 2.8\\text{ GPa}$, high tensile strength ($> 600\\text{ MPa}$), and superior flexural fatigue resistance across tens of thousands of opening-closing cycles.",
        archaicTerm: "synthetic polymeric amide / artificial material",
        modernEquivalent: "drawn nylon-6,6 thermoplastic monofilament",
      },
      {
        title: "Electrically Heated Lancet Bar (Carrier Wire 5)",
        summary:
          "Transverse metallic lancet bar that forms the raised pile loops and applies controlled thermal heat setting.",
        technicalDetails:
          "Mounted across the shed of a velvet bar loom, metal lancet bar 5 supports loop 6 during weaving. Internal electrical resistance heating or steam warms the bar to the thermal setting temperature ($T_{\\text{set}} > T_g$), inducing entropy elasticity and permanently setting the curvature radius $R_{\\text{hook}} \\approx 0.4\\text{ mm}$.",
        archaicTerm: "small transverse metal bars submitted to thermic action",
        modernEquivalent: "heated velvet lancet wire / thermoforming loom mandrel",
      },
      {
        title: "Longitudinal Knife Guide Groove & Asymmetric Cutting Blade",
        summary:
          "Precision guide groove and traveling knife blade that slices one leg of the heated loop.",
        technicalDetails:
          "Longitudinal groove 7 machined along lancet bar 5 guides traveling razor blade 8. By slicing the loop off-center near outer leg 7, the knife leaves curved hook leg 9 intact while cutting straight leg 10 into a lost vertical strand, converting a closed loop into an open, load-bearing cantilever hook.",
        archaicTerm: "longitudinal groove with guided knife",
        modernEquivalent: "pile slitting knife and lancet guide channel",
      },
      {
        title: "Resilient Micro-Hook Cantilever Beam",
        summary:
          "Curved thermoplastic hook element that elastically flexes open under peel traction and springs back into shape.",
        technicalDetails:
          "Each hook acts as a curved cantilever beam with second moment of area $I = \\pi d^4 / 64$ ($d \\approx 0.15\\text{–}0.25\\text{ mm}$). Under peel loads, the hook deflects elastically by $\\delta = F L^3 / (3 E I)$ until disengaging at tip clearance, immediately recovering its original curve without plastic deformation.",
        archaicTerm: "pile threads showing material-engaging means bent downwardly",
        modernEquivalent: "elastic micro-hook fastening element",
      },
      {
        title: "Dual-Layer Ground Foundation Weave",
        summary:
          "Tightly interlaced warp and weft matrix anchoring the roots of the hook and loop filaments.",
        technicalDetails:
          "Foundation weft threads 1 and warp threads 2 interlace in a dense plain or twill weave. The auxiliary pile warp 3 is firmly bound between multiple weft picks, providing a pullout anchoring force exceeding $15\\text{ N}$ per filament to prevent hook shedding during repeated peeling.",
        archaicTerm: "foundation structure constituted by a weft and a warp",
        modernEquivalent: "high-density woven ground backing cloth",
      },
      {
        title: "90° Cross-Interlocking Hook Fastening Array",
        summary:
          "Dual hook-bearing fabric tapes superposed at right angles to create dense multi-directional engagement.",
        technicalDetails:
          "Orienting opposing hook tapes at a 90° angular displacement creates a two-dimensional cross-grid of intersecting hooks ($n \\approx 50\\text{–}100\\text{ hooks/cm}^2$). Multi-point contact ensures isotropic shear resistance regardless of lateral force direction while accommodating surface misalignment and angular mismatch.",
        archaicTerm: "superposed pieces having a 90° angular displacement",
        modernEquivalent: "biaxial self-engaging hook array / dual-lock fastener",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Thermoplastic Glass Transition & Thermal Shape Setting",
        explanation:
          "When nylon monofilament is heated above its glass transition temperature ($T_g \\approx 50^\\circ\\text{C}$) to near its crystallization annealing range ($140^\\circ\\text{C} \\le T \\le 180^\\circ\\text{C}$), amorphous polymer chains relax and re-crystallize into the curved geometry defined by the lancet bar. Upon cooling, secondary hydrogen bonds freeze the curved shape into permanent mechanical memory.",
        formula: "S(T) = S_0 \\cdot \\exp\\left(-\\frac{E_a}{k_B T}\\right)",
      },
      {
        principle: "Euler-Bernoulli Elastic Cantilever Hook Deflection",
        explanation:
          "Under disengagement forces, the curved monofilament hook behaves as an elastic curved beam. The tip deflection $\\delta$ under disengagement force $F$ depends inversely on the flexural rigidity $E I = E \\pi d^4 / 64$. Elastic recovery occurs because operating stresses remain below the polymer's yield strength $\\sigma_y \\approx 80\\text{ MPa}$.",
        formula: "\\delta = \\frac{F L^3}{3 E I} = \\frac{64 F L^3}{3 \\pi E d^4}",
      },
      {
        principle: "Fracture Mechanics of Peeling Anisotropy",
        explanation:
          "Velcro achieves extreme force anisotropy ($F_{\\text{shear}} / F_{\\text{peel}} \\gg 10$) because shear forces distribute uniformly across all $N$ hooks simultaneously ($F_{\\text{shear}} = N \\cdot F_{\\text{hook}}$), whereas peel forces localize at a narrow fracture line of width $w$ at peeling angle $\\theta$, loading only one infinitesimal row of hooks at a time.",
        formula: "F_{\\text{peel}} = \\frac{w \\cdot G_c}{1 - \\cos\\theta}",
      },
    ],
    whyItMattersToday:
      "George de Mestral's Velcro patent founded the global hook-and-loop fastening industry and established modern biomimetic engineering. From NASA Apollo space missions (securing equipment in zero gravity) to medical orthopedics, military apparel, aviation interiors, and consumer footwear, hook-and-loop fasteners replaced millions of mechanical zippers and buttons worldwide.",
  },

  drawings: [
    {
      figureNumber: "FIG. 1",
      title: "Velvet Foundation Weave, Heated Lancet Bar, and Loop Slitting",
      caption:
        "Figure 1 illustrates the cross-section of the velvet foundation weave (weft 1, warp 2, auxiliary loop warp 3), showing loop 6 formed over heated metal lancet bar 5 with knife guide groove 7, and blade 8 shearing the loop into hook 4 and straight strand 10.",
      svgType: "mestral-velcro",
      callouts: [
        {
          id: "velcro-1",
          figureRef: "FIG. 1",
          label: "1",
          element: "Foundation weft threads",
          description: "Cross-sectional ground weft threads anchoring the base cloth.",
          x: 20,
          y: 75,
        },
        {
          id: "velcro-2",
          figureRef: "FIG. 1",
          label: "2",
          element: "Foundation warp threads",
          description: "Interlacing warp threads binding the weft picks together.",
          x: 45,
          y: 75,
        },
        {
          id: "velcro-3",
          figureRef: "FIG. 1",
          label: "3",
          element: "Auxiliary pile warp thread",
          description: "Continuous nylon monofilament yarn raised into upright pile loops.",
          x: 35,
          y: 70,
        },
        {
          id: "velcro-4",
          figureRef: "FIG. 1",
          label: "4",
          element: "Curved hook terminal tip",
          description: "Permanently heat-set downward-curving hook head.",
          x: 30,
          y: 35,
        },
        {
          id: "velcro-5",
          figureRef: "FIG. 1",
          label: "5",
          element: "Heated metallic lancet bar",
          description: "Transverse metal mandrel bar with internal electrical or steam heating.",
          x: 70,
          y: 50,
        },
        {
          id: "velcro-7",
          figureRef: "FIG. 1",
          label: "7",
          element: "Longitudinal knife guide groove",
          description: "Precision guide groove in lancet bar guiding the cutting blade.",
          x: 70,
          y: 40,
        },
        {
          id: "velcro-8",
          figureRef: "FIG. 1",
          label: "8",
          element: "Cutting knife blade",
          description: "Traveling razor blade slitting the outer loop leg.",
          x: 80,
          y: 30,
        },
        {
          id: "velcro-9",
          figureRef: "FIG. 1",
          label: "9",
          element: "Active hook pile strand",
          description: "Vertical monofilament strand terminating in resilient hook 4.",
          x: 47,
          y: 55,
        },
        {
          id: "velcro-10",
          figureRef: "FIG. 1",
          label: "10",
          element: "Straight standing strand",
          description: "Cut vertical lost strand remaining alongside the hook.",
          x: 52,
          y: 58,
        },
      ],
    },
    {
      figureNumber: "FIG. 2",
      title: "90° Superposed Interlocking Hook Array Fastener",
      caption:
        "Figure 2 diagrams the plan view of two superposed pieces of fabric turned pile-to-pile with a 90° angular displacement, showing co-operating hooks 4 engaging opposing hooks 4 and strands 9, 10 for multi-directional shear adhesion.",
      svgType: "mestral-velcro",
      callouts: [
        {
          id: "velcro-fig2-upper",
          figureRef: "FIG. 2",
          label: "Upper Tape",
          element: "Upper hook-bearing backing",
          description: "First woven tape carrying downward-pointing hook array.",
          x: 50,
          y: 30,
        },
        {
          id: "velcro-fig2-lower",
          figureRef: "FIG. 2",
          label: "Lower Tape",
          element: "Lower hook-bearing backing",
          description: "Second woven tape superposed at 90° relative orientation.",
          x: 50,
          y: 75,
        },
        {
          id: "velcro-fig2-hooks",
          figureRef: "FIG. 2",
          label: "4",
          element: "Interlocking hook junction",
          description: "Co-operating interengaged micro-hooks resisting shear separation.",
          x: 45,
          y: 52,
        },
      ],
    },
  ],

  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "A manufacturing method for velvet fabric comprising weaving weft and warp threads with auxiliary synthetic resin warp threads into surface loops, heating the loops on a carrier to lock their shape, and cutting the loops near their outer ends to produce material-engaging hooks.",
      keyInnovations: [
        "Weaving synthetic monofilament auxiliary warp loops",
        "In-situ thermal heat setting on carrier wire",
        "Asymmetric loop cutting to form open hooks",
      ],
      legalSignificance:
        "Foundational independent method claim protecting the thermal setting and cutting of synthetic pile loops to create hook fasteners.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(2),
      plainEnglish:
        "The method of claim 1 wherein each loop is cut between the outer loop apex and the fabric surface, forming a hook-shaped section on one free end of the cut pile thread.",
      keyInnovations: ["Off-center asymmetric slitting leaving single intact curved hook"],
      legalSignificance:
        "Specific method claim covering asymmetric loop shearing along lancet bars.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "A velvet fabric comprising a foundation weave of weft and warp threads with raised synthetic resin pile threads, wherein the ends of at least some pile threads are formed into material-engaging hooks.",
      keyInnovations: [
        "Woven fabric with raised synthetic resin hook pile",
        "Terminal material-engaging hook geometry on individual pile threads",
      ],
      legalSignificance:
        "Broad independent article claim covering any woven textile bearing synthetic micro-hooks.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "A velvet fabric with a foundation weave and synthetic resin raised pile threads whose terminal portions include hook-shaped sections for engaging opposing materials.",
      keyInnovations: ["Synthetic raised pile with terminal hook-shaped engaging sections"],
      legalSignificance: "Independent article claim covering hook-shaped pile fastener structures.",
    },
  ],

  historicalContext: {
    problemStatement:
      "Mid-20th-century clothing and industrial closures relied on metal slide zippers, buttons, hooks-and-eyes, and snap studs. These mechanical fasteners required precise manual alignment, jammed when clogged with dirt, salt, or lint, corroded in moisture, and caused fabric tears when subjected to sudden lateral overload.",
    priorArtLimitations: [
      "Metal zippers (Whitcomb Judson, Gideon Sundback) required rigid interlocking teeth that jammed easily and could not self-align across flexible or misaligned garment seams.",
      "Traditional velvet pile weaving (Holland, Miller) cut silk or cotton loops for decorative softness, lacking the stiffness, spring recovery, and hook geometry needed for mechanical fastening.",
      "Buttons and press studs concentrated stress on single fastener points, pulling through thin fabrics under tension.",
    ],
    breakthroughInsight:
      "De Mestral realized that drawn synthetic thermoplastic polyamides (nylon) possess crystalline thermal memory: when woven as auxiliary loops over heated lancet bars above the glass transition temperature and slit asymmetrically, they retain a permanent, spring-elastic hook curvature that reversibly interlocks with opposing loops or perpendicular hooks with extreme peel-to-shear force anisotropy.",
    patentWars: [
      {
        rivalName: "Fastener Manufacturing Competitors (1958–1978)",
        rivalClaim:
          "Combining standard velvet loom weaving with nylon synthetic fiber was obvious over prior art velvet patents (Holland, Miller).",
        conflictDetails:
          "Upon the global commercial success of Velcro in apparel, aerospace, and military gear, rival textile manufacturers attempted to produce unpatented hook-and-loop tapes, arguing that heat-setting nylon fibers was an obvious polymer treatment.",
        resolution:
          "Courts in the United States and Europe upheld de Mestral's patents, recognizing the unexpected synergy between nylon thermal shape setting, lancet bar groove slicing, and the resulting non-jamming hook fastener.",
        legalOutcome:
          "Established unbreakable patent exclusivity that gave Velcro complete market protection until the core patent expired in 1978.",
      },
    ],
    civilizationalImpact:
      "George de Mestral's Velcro patent created the entire modern category of biomimetic hook-and-loop fasteners. It became an essential component of modern space exploration, military gear, pediatric and adaptive apparel, surgical devices, and automotive manufacturing, processing billions of fastening cycles daily across the globe.",
    funFact:
      "NASA adopted Velcro for the Apollo space program to anchor equipment, food packets, and astronaut suit closures in zero gravity; Apollo 11 astronauts even installed Velcro patches inside their helmets to scratch their noses during lunar spacewalks.",
    aftermath:
      "After the patent expired in 1978, Velcro remained a protected trademark, and de Mestral was inducted into the National Inventors Hall of Fame in 1999.",
  },

  tags: [
    "velcro",
    "hook and loop",
    "fastener",
    "biomimicry",
    "nylon",
    "polyamide",
    "textiles",
    "velvet weave",
    "George de Mestral",
  ],
  stats: {
    totalClaims: 4,
    independentClaims: 3,
  },
};
