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
  shortTitle: "De Mestral Hook-Pile Fastening Fabric",
  subtitle: "Artificial Raised Pile, Heated Lancet Formation, and 90° Hook-to-Hook Engagement",
  inventors: ["George de Mestral"],
  inventorLocation: "Prangins, Vaud, Switzerland",
  grantDate: "1955-09-13",
  filingDate: "1952-10-15",
  era: "Information & Digital Age (1950–Present)",
  category: "consumer",
  categoryLabel: "Fasteners & Biomimetic Materials",
  summary:
    "George de Mestral's 1955 grant claims a velvet-type fabric whose artificial raised pile terminates in material-engaging hooks, plus the method of forming auxiliary synthetic warp loops over a carrier, heating them, and cutting near their outer ends. Its Figure 2 fastening embodiment faces two pieces of the same hook fabric together after turning one piece 90 degrees.",
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
      "The grant moves the engaging feature into a woven raised pile. Auxiliary artificial warp threads form loops over transverse bars; heat is applied while the thread is on the bar; and a guided cut near the loop's outer end leaves a hook-shaped pile strand beside a straight strand. For the illustrated fastener, two pieces of that same hook-bearing fabric face one another after one is turned through 90 degrees. This is hook-to-hook engagement in the source, not the later familiar pairing of a hook face with a closed-loop face.",
    coreMechanism:
      "Foundation weft 1 and warp 2 bind auxiliary synthetic warp 3. That auxiliary warp rises around bar 5 as loop 6. The specification permits heating the carrier so the thread assumes and retains the carrier-imparted form; knife 8 runs in groove 7 and cuts near an outer end, leaving hooked strand 9 with engaging end 4 and straight strand 10. In Figure 2, pressure brings two 90-degree-crossed hook piles into contact; traction separates them. The grant gives no strand diameter, modulus, hook density, tape width, force-displacement curve, measured peel force, or thermal-response curve, so the interactive exhibit refuses those quantities rather than backfilling modern test values.",
    mechanicalBreakdown: [
      {
        title: "Synthetic Polyamide (Nylon) Monofilament Loop Yarn",
        summary:
          "Artificial pile yarn chosen so the bar-formed shape can be retained after heating and cutting.",
        technicalDetails:
          "The specification names synthetic thermoplastic materials and discusses synthetic polymeric amides such as nylon. It does not print a grade, draw ratio, diameter, elastic modulus, tensile strength, or fatigue-life result for the illustrated pile.",
        archaicTerm: "synthetic polymeric amide / artificial material",
        modernEquivalent: "drawn nylon-6,6 thermoplastic monofilament",
      },
      {
        title: "Electrically Heated Lancet Bar (Carrier Wire 5)",
        summary:
          "Transverse metallic lancet bar that forms the raised pile loops and applies controlled thermal heat setting.",
        technicalDetails:
          "Metal bar 5 supports loop 6 during weaving and may be heated so the thread retains the imparted form. The grant describes electrical heating and a steam-heated tubular alternative, but gives neither a setting temperature nor a hook-radius dimension.",
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
          "A circular display strand has the exact geometric second moment $I = \\pi d^4/64$. A real curved-hook contact solve would additionally require the actual diameter, curved geometry, modulus, opposing-hook contact law, friction, and release criterion. None is printed in this grant, so the exhibit stops at geometry.",
        archaicTerm: "pile threads showing material-engaging means bent downwardly",
        modernEquivalent: "elastic micro-hook fastening element",
      },
      {
        title: "Dual-Layer Ground Foundation Weave",
        summary:
          "Tightly interlaced warp and weft matrix anchoring the roots of the hook and loop filaments.",
        technicalDetails:
          "Foundation weft 1 and warp 2 interlace around and bind auxiliary pile warp 3. Figure 1 establishes that attachment path; the grant does not publish weave dimensions, yarn tension, root pullout force, or repeated-peel durability.",
        archaicTerm: "foundation structure constituted by a weft and a warp",
        modernEquivalent: "high-density woven ground backing cloth",
      },
      {
        title: "90° Cross-Interlocking Hook Fastening Array",
        summary:
          "Dual hook-bearing fabric tapes superposed at right angles to create dense multi-directional engagement.",
        technicalDetails:
          "The specification directs the reader to superpose two pieces of the Figure 1 fabric, turn one piece 90 degrees, and face their pile surfaces so hooks 4 on strands 9 engage the other piece's hooks. Figure 2 establishes this crossed topology but no hook density or directional capacity.",
        archaicTerm: "superposed pieces having a 90° angular displacement",
        modernEquivalent: "biaxial self-engaging hook array / dual-lock fastener",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Carrier-Constrained Thermal Shape Setting",
        explanation:
          "Heating occurs while the artificial pile thread is constrained around carrier 5, before knife 8 cuts the loop. The source claims that sequence and retained form qualitatively; a temperature-response or crystallization model would require material-grade and process data the grant does not supply.",
        formula:
          "\\text{form loop} \\rightarrow \\text{heat on carrier} \\rightarrow \\text{cut near end}",
      },
      {
        principle: "Circular Filament Section Geometry",
        explanation:
          "For the reader-selected circular display strand, the second moment of area follows exactly from diameter. This shows why diameter strongly changes bending geometry without pretending that the patent supplied the modulus, straight-beam boundary, or contact force required for a physical spring-rate result.",
        formula: "I = \\frac{\\pi d^4}{64}",
      },
      {
        principle: "Orthogonal Hook-Pile Interengagement",
        explanation:
          "Turning one of two identical hook fabrics through 90 degrees makes the two hook orientations cross when their pile surfaces face. The source says pressure fastens and traction separates them; it does not provide a Kendall peel specimen, adhesion energy, or measured anisotropy ratio.",
        formula: "\\theta_{\\text{face}} = 90^\\circ",
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
      "The claimed move is a manufacturing and textile-topology combination: artificial auxiliary pile is formed around a carrier, heat-set before cutting, terminated in hooks, and—in the Figure 2 fastening embodiment—mated to a second, orthogonally oriented piece of the same hook fabric.",
    patentWars: [],
    civilizationalImpact:
      "George de Mestral's Velcro patent created the entire modern category of biomimetic hook-and-loop fasteners. It became an essential component of modern space exploration, military gear, pediatric and adaptive apparel, surgical devices, and automotive manufacturing, processing billions of fastening cycles daily across the globe.",
    funFact:
      "The grant proposes the same material-engaging raised pile not only for garment and curtain fasteners but also for scouring or cleaning surfaces.",
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
