import type { Patent } from "@/types/patent";
import { corlissSteamEngineArchivalEdition } from "../editions/corlissSteamEngineEdition";

/** Keep catalogue claim decoders tied to the single authored source face. */
function manualClaimText(number: number): string {
  const block = corlissSteamEngineArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Corliss manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const corlissSteamEnginePatent: Patent = {
  id: "us-6162-corliss-steam-engine",
  patentNumber: "US 6,162",
  title: "Improvement in Cut-Off and Working Valves of Steam-Engines",
  shortTitle: "Governor-Controlled Slide-Valve Gear",
  subtitle: "Differential Rock-Shaft Motion and Governor-Released Expansion Cut-Off",
  inventors: ["George Henry Corliss"],
  inventorLocation: "Providence, Providence County, Rhode Island",
  grantDate: "1849-03-10",
  // Neither the reviewed grant nor the primary public record supplies a filing date.
  filingDate: null,
  era: "Industrial Dawn (1840–1870)",
  category: "consumer",
  categoryLabel: "Thermodynamics & Steam Power",
  summary:
    "US 6,162 describes a tension-braced beam-engine frame, a rock shaft whose arms give unequal travel to paired slide valves, and a centrifugal governor that releases the steam-valve catches earlier as speed rises. The local facsimile is dated March 10, 1849 and records reissue No. 200 on May 13, 1851.",
  heroQuote:
    "The third part of my invention relates to the method of regulating the cut off, of the steam in the main slide valves.",
  originalPdfUrl: "/patents/pdfs/us-6162-corliss-steam-engine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6162A/en",
  usptoClassification:
    "Historical U.S. patent; no contemporary classification is printed on the local facsimile.",
  originalTextAsset: {
    url: "/patents/transcripts/us-6162-corliss-steam-engine-reviewed.txt",
    pageCount: 8,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "22a03c717ed383165143af5aa3b85c8dac0705eaa4cdadcf93130ba28ef76ff5",
  },
  originalText: `UNITED STATES PATENT OFFICE.
GEO. H. CORLISS, OF PROVIDENCE, RHODE ISLAND.

CUT-OFF AND WORKING THE VALVES OF STEAM-ENGINES.

Specification forming part of Letters Patent No. 6,162, dated March 10, 1849; Reissued May 13, 1851, No. 200.

To all whom it may concern:
Be it known that I, GEORGE H. CORLISS, of the city and county of Providence and State of Rhode Island, have invented certain new and useful Improvements in Steam-Engines; and that the following is a full, clear, and exact description of the principle or character which distinguishes them from all other things before known and of the manner of making, constructing, and using the same, reference being had to the accompanying drawings, making part of this specification, in which—`,
  archivalEdition: corlissSteamEngineArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "Corliss presents three linked engineering problems in a beam engine: a frame that yields under changing loads, paired slide valves that waste motion while one remains closed under steam pressure, and a cut-off that must respond to engine speed. His proposed answers are a tension-braced frame, phase-offset arms on one rock shaft, and governor-controlled catches that release the steam valves so the charge can expand after admission.",
    coreMechanism:
      "The specification describes paired steam and exhaust slide valves, each driven from a common rock shaft by a separate arm or crank wrist. The wrists are phased so the valve that is opening or closing receives the greatest longitudinal motion while the valve that remains closed moves near its dead point, reducing the work needed to move a pressure-loaded valve. For cut-off, a centrifugal governor raises a sliding rod carrying cams; those cams meet projections on the valve rods sooner at higher speed, release catches, and allow weights to close the steam valves so the trapped steam expands for the rest of the stroke. A small air cylinder and piston cushions the closing motion.",
    mechanicalBreakdown: [
      {
        title: "Tension-braced beam-engine frame",
        summary:
          "Diagonal tension braces stiffen the frame carrying the beam and crank-shaft bearings.",
        technicalDetails:
          "The bed, horizontal beams, vertical standards, working-beam shaft, and crank-shaft boxes are tied together by diagonal rods tightened with nuts. Corliss's stated load path puts the upward-stroke forces through one set of braces and the return-stroke support through the standards and beams held in tension, reducing frame working and the resulting shaft damage.",
        archaicTerm: "working or yielding of the frame",
        modernEquivalent: "preloaded braced machine frame",
      },
      {
        title: "Differential rock-shaft valve motion",
        summary: "Separate rock-shaft arms give different useful travel to the paired valves.",
        technicalDetails:
          "The two crank wrists are set about a quarter-circle apart. During equal rock-shaft rotation, one connecting rod is in the high-motion part of its arc while the other is near the dead point. In modern kinematic terms, the design deliberately makes the two valve displacements unequal without changing the rock shaft's angular range.",
        archaicTerm: "rock shaft / crank wrist",
        modernEquivalent: "phase-offset common actuator",
      },
      {
        title: "Governor-released steam cut-off",
        summary:
          "Centrifugal motion shifts cams that release the steam-valve catches earlier or later.",
        technicalDetails:
          "A rack and catch temporarily transmit rock-shaft motion to each steam valve. A projection on the valve rod meets a governor-controlled cam and releases that catch. Because the governor raises the cam rod when the engine runs too fast, release occurs earlier and the admission interval is shortened; when the governor is down, the cams clear the rods and the valves can take a full stroke.",
        archaicTerm: "cut off / catch",
        modernEquivalent: "variable-expansion trip mechanism",
      },
      {
        title: "Air-cylinder closing cushion",
        summary: "A small air cylinder and piston cushion the released valve's closing motion.",
        technicalDetails:
          "When the catch is released, a weighted lever closes the steam valve. Near the end of that travel, the air cylinder attached to the valve rods embraces a piston fixed to the frame; compressing the air supplies the buffer that prevents slamming and the resulting breakage.",
        archaicTerm: "air cylinder and piston for checking the motions",
        modernEquivalent: "pneumatic end-of-stroke damper",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Thermodynamic Adiabatic Expansion Work",
        formula:
          "W_{\\text{expansion}} = \\int_{V_1}^{V_2} P(V) \\, dV = \\frac{P_1 V_1 - P_2 V_2}{\\gamma - 1}, \\quad P V^\\gamma = \\text{const}",
        explanation:
          "Cutting off steam admission early at $V_1$ allows the high-pressure steam to expand adiabatically to $V_2$, extracting additional mechanical boundary work from internal molecular heat energy without consuming additional boiler fuel.",
      },
      {
        principle: "Flyball Centrifugal Governor Dynamic Equilibrium",
        formula:
          "\\omega_{\\text{governor}}^2 r = g \\tan\\theta \\implies h = \\frac{g}{\\omega^2}",
        explanation:
          "The height $h$ of the rotating flyball governor varies inversely with the square of engine speed $\\omega$, mechanically translating speed changes into linear displacement that shifts the cutoff tripping cam.",
      },
      {
        principle: "Rankine Cycle Thermal Efficiency Maximization",
        formula:
          "\\eta = \\frac{W_{\\text{net}}}{Q_{\\text{in}}} = 1 - \\frac{h_{\\text{exhaust}} - h_{\\text{condensate}}}{h_{\\text{boiler}} - h_{\\text{feedwater}}}",
        explanation:
          "The source's cut-off arrangement admits steam and then closes the valve so the trapped charge can continue the stroke by expansion. The formula is a modern engineering description of the boundary work; the patent does not claim a measured efficiency increase or a particular percentage.",
      },
      {
        principle: "Preload and frame stiffness",
        formula: "F = E A \\varepsilon",
        explanation:
          "The diagonal rods are tightened before the engine is loaded. This modern relation explains why a tensile member's force rises with its stiffness, area, and imposed strain; the source describes the preload and load path but does not give material constants or measured deflection.",
      },
    ],
    whyItMattersToday:
      "Corliss's source-grounded contribution is a mechanical pattern still recognizable in later valve gear: use a common actuator with deliberately phased linkages, then let a speed-sensitive trip change the admission interval rather than merely choking the inlet. The historical record for this catalogue entry should be read alongside the facsimile and provenance receipt; this page does not turn later Corliss engines or modern valve-timing systems into claims of the 1849 grant.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 covers the differential-motion arrangement: separate arms on one rock shaft operate opposite-end slide valves, but the closed valve receives less travel while it stays shut. The opening or closing valve receives more travel even though both arms swing through the same range, reducing force spent moving a pressure-loaded closed valve while keeping port events rapid.",
      keyInnovations: [
        "Separate rock-shaft arms",
        "Differential valve travel",
        "Rapid induction and eduction",
      ],
      legalSignificance:
        "The claim is limited to the stated relation between the separate rock-shaft arms and the slide valves; it is not a blanket claim to every steam-engine governor.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 covers speed regulation by combining the centrifugal governor with the catches that release the admission valves, using movable cams or stops. When speed changes, the governor changes when the catch releases, thereby changing the point of steam cut-off.",
      keyInnovations: ["Centrifugal regulator", "Valve-release catches", "Movable cams or stops"],
      legalSignificance:
        "This is a separate method claim. Its legal work is the governor-to-catch-to-movable-cam connection, not merely the use of a governor near a steam engine.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Side elevation of the improved beam engine",
      caption:
        "The source identifies Fig. 1 as a side elevation of an engine on Corliss's improved plan. The figure-sheet crop, rather than a reconstructed diagram, is the authority for its lettered parts.",
      svgType: "corliss-steam-engine",
      callouts: [],
    },
  ],
  historicalContext: {
    problemStatement:
      "Corliss frames the problem as mechanical: a beam-engine frame that works or yields under changing forces can contribute to shaft breakage, while paired slide valves impose frictional work even when one valve is closed under steam pressure.",
    priorArtLimitations: [
      "The specification says the paired valves move over the same extent of surface, even though one must remain closed while the other opens or closes.",
      "The source describes earlier cam devices as noisy and liable to derangement, without asserting that every prior device had the same construction.",
      "A governor-controlled cam can alter the point at which a catch releases the steam valve, but the patent does not quantify a particular speed or cut-off percentage.",
    ],
    breakthroughInsight:
      "The invention combines a preloaded frame, phase-offset rock-shaft arms, and a governor-controlled catch release. The claim language is narrower than a general claim to rotary valves, a vacuum dashpot, or every form of steam-engine speed control.",
    patentWars: [],
    civilizationalImpact:
      "The source records an attempt to make stationary beam engines more durable and economical to operate by controlling frame strain, valve travel, and steam admission. Broader claims about later Corliss installations belong in separately sourced historical context, not in this patent's literal source face.",
    aftermath:
      "The local facsimile also records the 1851 reissue number and the later `[FIRST PRINTED 1913.]` notice. No additional legal outcome is asserted here without a separately reviewed primary source.",
  },
  tags: [
    "George Corliss",
    "Steam Engine",
    "Thermodynamics",
    "Centennial Engine",
    "Industrial Revolution",
    "Variable Valve Timing",
  ],
  stats: {
    totalClaims: 2,
    independentClaims: 2,
  },
};
