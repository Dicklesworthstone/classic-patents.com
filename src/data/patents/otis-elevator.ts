import { otisElevatorArchivalEdition } from "@/data/editions/otisElevatorEdition";
import type { Patent } from "@/types/patent";

/** Source-checked catalogue record for the actual four-claim US 31,128 grant. */
export const otisElevatorPatent: Patent = {
  id: "us-31128-otis-elevator",
  patentNumber: "US 31,128",
  title: "Improvement in Hoisting Apparatus",
  shortTitle: "Otis Hoist Safety Catch and Belt Brake",
  subtitle: "Hook Racks, Spring Pawls, Belt Shipper, and Counterpoise on a Winding Drum",
  inventors: ["Elisha Graves Otis"],
  inventorLocation: "Yonkers, Westchester County, New York",
  grantDate: "1861-01-15",
  filingDate: "1860-08-15",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "consumer",
  categoryLabel: "Hoisting Machinery & Safety Engineering",
  summary:
    "US 31,128 describes a powered hoisting apparatus, not a simple leaf-spring elevator catch. Otis combines a platform lifted by rope G, hook-form racks C and spring-biased pawls f f that lock on rope failure, a hand-operated belt shipper and brake, a lower-travel stop, and a counterpoise rope Q wound on the opposite side of drum H.",
  heroQuote:
    "In case the rope G should break in hoisting the loaded platform D, the pawls f f … will immediately be thrown in connection with the racks C C.",
  originalPdfUrl: "/patents/pdfs/us-31128-otis-elevator.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US31128A/en",
  usptoClassification: "B66B 5/26 (positively acting catch devices for elevators)",
  originalTextAsset: {
    url: "/patents/transcripts/us-31128-otis-elevator.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "CopperLotus, direct PDF comparison",
    reviewedAt: "2026-08-17",
    sourcePdfSha256: "c35eb5c999bc20b015ef0d24a3ffb0f194123d780c8a46fabea7f2d52a355d42",
  },
  archivalEdition: otisElevatorArchivalEdition,
  originalText:
    "Be it known that I, E. G. OTIS, of Yonkers, in the county of Westchester and State of New York, have invented a new and Improved Hoisting Apparatus. The complete source-checked specification, all four claims, figures, signature, and witnesses are presented in the manually prepared Original Patent Text edition.",
  plainEnglishExplanation: {
    overview:
      "Otis builds a hoist in which the normal drive, the hand control, the service brake, the lowest-travel stop, the counterweight, and the broken-rope catch are mechanically coordinated. Its safety claim is specific: when lifting rope G loses its pull, springs drive pawls f f into upward hook teeth C C; platform weight then pulls the hooks together rather than prying the uprights apart.",
    coreMechanism:
      "Drum H winds lifting rope G while an opposite-wound rope Q carries counterpoise R. Shaft I uses belts O and P, idle pulleys J and K, and working pulley L to choose motion. Hand rope T moves slide S through drum r, pinion p, and rack o. At a stop, fork V aligns its branches, moves both belts off their working drive, and presses shoe Z against L. If G breaks, springs e, g, and g put pawls f f into hook racks C C and the load geometry locks them.",
    mechanicalBreakdown: [
      {
        title: "Hook Racks and Safety Pawls",
        summary:
          "Pawls f f pivot on levers E and enter hook-form rack teeth C C when rope G no longer holds the mechanism released.",
        technicalDetails:
          "Springs e, g, and g urge the pawls toward engagement. With the loaded platform falling, the upward-pointing hook teeth make the force draw uprights B B inward, which is the claimed anti-separation condition rather than a generic friction brake.",
        archaicTerm: "pawls in gear with the racks",
        modernEquivalent: "positive mechanical safety catch",
      },
      {
        title: "Belt Shipper and Brake Shoe",
        summary: "Slide S changes belt positions while shoe Z bears on working pulley L.",
        technicalDetails:
          "Rope T turns drum r; pinion p engages rack o to move S. The same linkage shifts belts O and P to idle pulleys and presses Z on L, so stopping power transmission and applying the brake occur together.",
        archaicTerm: "belt-shipper",
        modernEquivalent: "sliding belt selector",
      },
      {
        title: "Forked Stop Rope",
        summary:
          "Rope U and branched end V convert a stop pull into a non-actuating locked position.",
        technicalDetails:
          "When U is pulled down, its two u branches reach one horizontal plane. That geometry lets V actuate T during running but prevents it from moving T after the brake is applied, which is the limitation in claim 2.",
        archaicTerm: "branched end V",
        modernEquivalent: "forked stop linkage",
      },
      {
        title: "Drum Counterpoise",
        summary:
          "Counterweight R is connected by rope Q to drum H rather than directly to platform D.",
        technicalDetails:
          "Q winds on the opposite direction from G. The arrangement offsets platform weight but leaves the platform-side safety mechanism free to lock when G breaks, which is the functional limit in claim 4.",
        archaicTerm: "counterpoise",
        modernEquivalent: "counterweight",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Torque reversal through crossed belts",
        formula: "τ = F × r",
        explanation:
          "Moving cross-belt P between idle and working pulleys reverses the rotation delivered to the winding train. Otis couples that directional selection to the stop and brake linkage instead of treating it as a separate control.",
      },
      {
        principle: "Positive hook engagement under load",
        formula: "W = m g",
        explanation:
          "After G fails, platform weight supplies the load that seats pawls f f in hook racks C C. The patent's key geometric claim is that this force tends to draw the uprights together and therefore resists accidental disengagement.",
      },
    ],
    whyItMattersToday:
      "The grant records an early integrated approach to hoisting safety: a positive rope-failure catch, controlled braking, travel limit, and counterweight are described as interacting mechanisms. It is a direct historical source for the engineering problem that later elevator safety systems continued to address.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "Having the pawls f f and the teeth of the racks C C hook-formed, essentially as shown, so that the weight of the platform will, in case of the breaking of the rope G, cause the pawls and teeth to lock together and prevent the contingency of a separation of the same, as herein set forth.",
      plainEnglish:
        "Claim 1 requires hook-form pawls and racks arranged so a broken lifting rope G lets platform weight lock them together. The legal point is the load-directed geometry that prevents separation, not merely the existence of a spring or a brake.",
      keyInnovations: ["hook-form rack teeth", "pivoted pawls f f", "rope-failure load lock"],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The arrangement of the ropes T, U, and V, combined and operating substantially as and for the purpose set forth.",
      plainEnglish:
        "Claim 2 covers the combined hand rope T, stop rope U, and fork V. Their arrangement both actuates the running control and, once aligned horizontally at the stop, prevents that stop linkage from moving the rope again.",
      keyInnovations: ["hand rope T", "stop rope U", "branched end V"],
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "The arrangement of the slide or belt-shipper S with the shoe or brake Z and rope T, substantially as shown, to admit of the simultaneous application of the brake and the shifting of the belts O P on the idle-pulleys J K, as set forth.",
      plainEnglish:
        "Claim 3 covers the linkage in which rope T moves slide S, shifts belts O and P onto the idle pulleys J and K, and applies brake shoe Z at the same time. It is a claim to coordinated power disengagement and braking.",
      keyInnovations: ["slide S", "brake shoe Z", "simultaneous belt shifting"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "Attaching the rope Q of the counterpoise R to the drum H on the opposite side from the lifting-rope G, substantially as shown, so as to counterpoise the platform D without preventing or interfering with the action of the safety mechanism E e f.",
      plainEnglish:
        "Claim 4 places counterpoise rope Q on the opposite side of drum H from lifting rope G. The arrangement must balance platform D while preserving the operation of safety mechanism E e f.",
      keyInnovations: [
        "counterpoise rope Q",
        "opposite drum winding",
        "unobstructed safety mechanism",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Vertical section of the hoisting apparatus",
      caption: "Source drawing sheet, Figure 1: vertical section taken on line x x of Figure 2.",
      svgType: "otis-elevator",
      callouts: [
        {
          id: "oe-fig1-a",
          figureRef: "Fig. 1",
          label: "A",
          element: "Base or platform",
          description: "Base carrying the hoisting apparatus.",
          x: 73,
          y: 77,
        },
        {
          id: "oe-fig1-h",
          figureRef: "Fig. 1",
          label: "H",
          element: "Winding drum",
          description: "Drum to which lifting rope G and counterpoise rope Q attach.",
          x: 67,
          y: 37,
        },
        {
          id: "oe-fig1-r",
          figureRef: "Fig. 1",
          label: "R",
          element: "Counterpoise",
          description: "Weight on rope Q.",
          x: 78,
          y: 73,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Front view of the hoisting apparatus",
      caption:
        "Source drawing sheet, Figure 2: front view identifying platform D, hook racks C C, levers E E, pawls f f, and the winding and belt gear.",
      svgType: "otis-elevator",
      callouts: [
        {
          id: "oe-fig2-c",
          figureRef: "Fig. 2",
          label: "C",
          element: "Hook racks",
          description: "Upward-inclined hook teeth that receive pawls f f.",
          x: 60,
          y: 25,
        },
        {
          id: "oe-fig2-d",
          figureRef: "Fig. 2",
          label: "D",
          element: "Platform",
          description: "Load-bearing platform between the uprights.",
          x: 52,
          y: 45,
        },
        {
          id: "oe-fig2-f",
          figureRef: "Fig. 2",
          label: "f",
          element: "Pawls",
          description: "Spring-biased safety catches on levers E E.",
          x: 19,
          y: 37,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Detached side view of the stop mechanism",
      caption: "Source drawing sheet, Figure 3: the rope U, fork V, and related stop linkage.",
      svgType: "otis-elevator",
      callouts: [
        {
          id: "oe-fig3-u",
          figureRef: "Fig. 3",
          label: "U",
          element: "Stop rope",
          description: "Rope that moves the forked stop linkage.",
          x: 49,
          y: 56,
        },
        {
          id: "oe-fig3-v",
          figureRef: "Fig. 3",
          label: "V",
          element: "Branched end",
          description: "Forked end whose alignment isolates rope T after stopping.",
          x: 46,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The document identifies two operating risks: stopping a suspended load at a desired point with a brake, and sustaining that load when lifting rope G breaks.",
    priorArtLimitations: [
      "The specification does not name a prior competing machine or a court dispute; it instead states the unsolved stop, brake, and rope-break problem directly.",
      "A direct counterpoise connection to cross-piece d would interfere with the platform safety mechanism, according to the description.",
    ],
    breakthroughInsight:
      "Otis integrates rope-failure pawls, a belt selector, brake shoe, stop linkage, and counterpoise so the normal drive and the safety action are mechanically distinct but coordinated.",
    patentWars: [],
    civilizationalImpact:
      "US 31,128 is primary evidence of a nineteenth-century attempt to make powered vertical hoisting safer through positive engagement rather than operator reaction alone.",
    aftermath:
      "The facsimile establishes the January 15, 1861 grant. This edition makes no further litigation or commercial claim without a separately cited historical source.",
  },
  tags: [
    "Elisha Graves Otis",
    "hoisting apparatus",
    "safety catch",
    "belt shipper",
    "counterpoise",
  ],
  stats: { totalClaims: 4, independentClaims: 4 },
};
