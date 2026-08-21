import {
  maimanRubyLaserArchivalEdition,
  manualMaimanClaimText,
} from "@/data/editions/maimanRubyLaserEdition";
import type { Patent, PatentClaim } from "@/types/patent";

const claims: PatentClaim[] = [
  {
    number: 1,
    isIndependent: true,
    originalText: manualMaimanClaimText(1),
    plainEnglish:
      "Claim 1 defines the foundational laser apparatus: a ruby crystal exhibiting three distinct quantum energy levels (ground state, discrete upper metastable state, and higher broadband absorption band), an optical broadband pumping source coupled to the crystal to excite ions into the absorption band from which they decay non-radiatively into the metastable state to establish a population inversion over the ground state, an interferometer tuned to the emission frequency forming an optical cavity that recirculates light repeatedly through the crystal to generate a coherent stimulated beam, and coupling means for extracting the monochromatic beam.",
    keyInnovations: [
      "Solid-state chromium-doped ruby crystal three-level quantum active medium",
      "Broadband xenon optical pumping exciting atoms into high absorption bands",
      "Radiationless transition to a discrete upper state creating population inversion (N2 > N1)",
      "Resonant optical path repeatedly reflecting the transition frequency through the ruby",
      "Output coupling aperture/partial reflector for extracting the collimated coherent laser beam",
    ],
    legalSignificance:
      "The primary apparatus claim covering solid-state optically-pumped three-level lasers, protecting the fundamental combination of crystal, optical pump, population inversion, and resonant cavity that established the modern laser industry.",
  },
  {
    number: 2,
    isIndependent: true,
    originalText: manualMaimanClaimText(2),
    plainEnglish:
      "Claim 2 protects the complete ruby laser system comprising a three-level ruby crystal with ground state, discrete second level, and broad third absorption region, broadband optical pumping means directly coupled to the ruby to excite ground-state atoms into the third region for non-radiative transfer into the second level to establish population inversion, and light-resonating means coupled to and forming a regenerative optical feedback path through the ruby to stimulate radiant transitions from the second level back to ground, emitting a coherent monochromatic beam corresponding to that exact energy difference.",
    keyInnovations: [
      "Directly coupled broadband optical pumping source driving three-level atomic excitation",
      "Radiationless phonon energy transition populating the metastable state",
      "Regenerative optical feedback path through the crystal sustaining stimulated emission avalanche",
      "Stimulated emission transitions producing coherent monochromatic deep-red light",
    ],
    legalSignificance:
      "The system-level claim protecting direct optical coupling and regenerative optical feedback in solid-state laser oscillators, serving as a cornerstone patent for pulsed high-power solid-state lasers.",
  },
];

export const maimanRubyLaserPatent: Patent = {
  id: "us-3353115-maiman-ruby-laser",
  patentNumber: "US 3,353,115",
  title: "Ruby Laser Systems",
  shortTitle: "Maiman Ruby Laser & Solid-State Optical Maser",
  subtitle:
    "Synthetic Ruby, Optical Pumping, Three-Level Population Inversion, and Coherent Stimulated Emission",
  inventors: ["Theodore H. Maiman"],
  inventorLocation: "Pacific Palisades, California",
  grantDate: "1967-11-14",
  filingDate: "1961-04-13",
  era: "Mid-Century Computing & Space (1940–1970)",
  category: "optics",
  categoryLabel: "Quantum Electronics & Coherent Optics",
  summary:
    "United States Patent 3,353,115 describes laser systems using a solid-state negative-temperature medium. In one example, a ruby rod is placed coaxially in a helical gas-filled flash tube. Broadband light pumps the active material from a ground level into a broad higher region, from which a radiationless transition feeds a discrete upper level. When the upper-state population exceeds the ground-state population, repeated reflections through the active material stimulate coherent monochromatic light, which is coupled out as a beam.",
  heroQuote:
    "A laser system in which the active laser substance is solid state and which provides coherent monochromatic amplification and generation of electromagnetic wave energy in the optical or visible spectrum.",
  originalPdfUrl: "/patents/pdfs/us-3353115-maiman-ruby-laser.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3353115A/en",
  usptoClassification: "331/94.5",
  archivalEdition: maimanRubyLaserArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-3353115-maiman-ruby-laser-reviewed.txt",
    pageCount: 10,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6 Luna)",
    reviewedAt: "2026-08-21",
    sourcePdfSha256: maimanRubyLaserArchivalEdition.sourcePdfSha256,
  },
  originalText:
    "This invention relates to solid-state optical masers or lasers and more particularly to such devices which use a ruby crystal as the active laser material. In the past, devices operating on the principles of stimulated emission of radiation were primarily confined to the microwave region of the spectrum and were commonly known as masers. In accordance with the present invention, a practical, high-power solid-state optical maser is provided comprising a synthetic ruby element having optical reflecting faces at its ends forming an optical resonant cavity, directly coupled to a high-intensity helical flash tube.",
  drawings: [
    {
      figureNumber: "Figure 1",
      title: "Energy-Level Diagram",
      caption:
        "Energy-level diagram showing a ground level, a broad higher energy region, and a discrete intermediate level used to explain optical pumping and stimulated emission.",
      svgType: "maiman-laser-head",
      callouts: [
        {
          id: "callout-region-3",
          figureRef: "Fig. 1",
          label: "3",
          element: "3",
          description: "Broad higher energy region.",
          x: 48,
          y: 46,
        },
        {
          id: "callout-level-2",
          figureRef: "Fig. 1",
          label: "2",
          element: "2",
          description: "Discrete intermediate energy level.",
          x: 78,
          y: 35,
        },
        {
          id: "callout-level-1",
          figureRef: "Fig. 1",
          label: "1",
          element: "1",
          description: "Ground energy level.",
          x: 42,
          y: 52,
        },
      ],
    },
    {
      figureNumber: "Figure 2",
      title: "Optical Pumping Schematic",
      caption:
        "Schematic of a light pump illuminating a ruby rod, with repeated reflections establishing a standing wave and a coherent output beam.",
      svgType: "maiman-energy-levels",
      callouts: [
        {
          id: "callout-ground-state",
          figureRef: "Fig. 2",
          label: "1",
          element: "1",
          description: "Ruby rod ground-state level reference.",
          x: 50,
          y: 88,
        },
        {
          id: "callout-metastable-level",
          figureRef: "Fig. 2",
          label: "2",
          element: "2",
          description: "Ruby rod intermediate-level reference.",
          x: 75,
          y: 56,
        },
        {
          id: "callout-pump-bands",
          figureRef: "Fig. 2",
          label: "3",
          element: "3",
          description: "Broad higher energy region reference.",
          x: 35,
          y: 22,
        },
      ],
    },
    {
      figureNumber: "Figure 4",
      title: "Polished Ruby Cylinder with Silvered End Mirrors",
      caption:
        "Detailed geometry of the precision-polished cylindrical ruby crystal rod, showing the mutually parallel, optically flat Fabry-Perot end facets with opaque and partially transmitting silver coatings.",
      svgType: "maiman-ruby-rod",
      callouts: [
        {
          id: "callout-rear-mirror",
          figureRef: "Fig. 4",
          label: "m1",
          element: "m1",
          description: "Reflective end face.",
          x: 18,
          y: 52,
        },
        {
          id: "callout-output-mirror",
          figureRef: "Fig. 4",
          label: "m2",
          element: "m2",
          description: "Output coupler / partially transmitting aperture (R2 ~ 92%).",
          x: 82,
          y: 48,
        },
      ],
    },
  ],
  plainEnglishExplanation: {
    overview:
      "The specification addresses the difficulty of extending stimulated-emission techniques from microwave masers into optical frequencies. Maiman's disclosed move is to use a solid-state negative-temperature medium, such as a ruby rod, with broadband optical pumping and repeated optical feedback through the active material.",
    coreMechanism:
      "When the optical pump fires, broadband light excites atoms in the ruby from the ground level into a broad higher energy region. A radiationless transition feeds a discrete upper level. When the upper-state population exceeds the ground-state population, light traveling along the rod is reflected repeatedly between the end faces, stimulating coherent emission that exits through the coupling opening as a monochromatic beam.",
    mechanicalBreakdown: [
      {
        title: "Synthetic Pink Ruby Crystal Rod",
        summary:
          "A ruby element prepared as a solid-state active laser medium, with end faces arranged to support repeated optical reflections.",
        technicalDetails:
          "The solid active material supplies discrete energy levels. Broadband pump energy reaches a higher region, a radiationless transition feeds a discrete upper level, and stimulated emission returns atoms toward the ground level.",
        archaicTerm: "synthetic ruby rod",
        modernEquivalent: "solid-state gain medium (Cr3+:Al2O3 crystal)",
      },
      {
        title: "Helical Xenon Flash Tube & Reflector Housing",
        summary:
          "A quartz glass tube coiled helically around the ruby rod, filled with low-pressure xenon gas and triggered by high-voltage pulse discharge.",
        technicalDetails:
          "The gas-filled flash tube supplies high-intensity broadband light. The specification describes reflective housings, direct coupling, and fluorescent conversion as ways to improve the fraction of pump light reaching the active material.",
        archaicTerm: "helical gas-filled flash tube",
        modernEquivalent: "optical flashlamp pumping engine",
      },
      {
        title: "Fabry-Perot Optical Resonant Cavity",
        summary:
          "Mutually parallel, optically flat end mirrors coated directly onto the polished ends of the ruby cylinder.",
        technicalDetails:
          "Reflective end faces form an optical resonating path through the active material. A coupling opening or partially transmitting end permits the coherent beam to leave the resonator.",
        archaicTerm: "interferometer reflecting ends",
        modernEquivalent: "monolithic Fabry-Perot optical cavity resonator",
      },
      {
        title: "Colidar Laser Radar Ranging System",
        summary:
          "The first optical radar instrument, combining the pulsed ruby laser transmitter with a photoelectric receiver and oscilloscope time-of-flight display.",
        technicalDetails:
          "The colidar sends a laser beam toward a target and uses a photoelectric receiver and oscillograph traces to compare the transmitted and received pulse times. The specification identifies the time difference as an indication of range.",
        archaicTerm: "Colidar (Coherent Light Detection and Ranging)",
        modernEquivalent: "optical radar or lidar ranging system",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Three-Level Population Inversion Threshold Condition",
        formula:
          "\\Delta N_{\\text{th}} = N_2 - N_1 = \\frac{\\gamma_{\\text{cav}}}{\\sigma_{21}} = \\frac{1}{\\sigma_{21} L} \\left[ \\alpha L + \\frac{1}{2} \\ln\\left(\\frac{1}{R_1 R_2}\\right) \\right]",
        explanation:
          "Because the lower laser level is the atomic ground state, more than half of the total chromium ions in the crystal ($N_2 > N_{\\text{total}} / 2$) must be pumped into the metastable state before net optical gain overcomes ground-state reabsorption.",
      },
      {
        principle: "Einstein Stimulated Emission Rate & Optical Gain",
        formula:
          "g(\\nu) = \\sigma_{21}(\\nu) (N_2 - N_1) = \\frac{\\lambda^2 A_{21}}{8 \\pi n^2 \\tau_{\\text{sp}}} g_L(\\nu) (N_2 - N_1)",
        explanation:
          "An incident photon whose frequency matches the atomic transition stimulates an excited electron to drop to ground, releasing a clone photon with identical energy, frequency, wavevector, phase, and polarization state.",
      },
      {
        principle: "Fabry-Perot Longitudinal Cavity Mode Spacing",
        formula:
          "\\Delta \\nu = \\frac{c}{2 n L} \\quad \\text{and} \\quad \\lambda_m = \\frac{2 n L}{m}",
        explanation:
          "Standing optical waves are supported inside the crystal cavity where the round-trip phase shift is an exact integer multiple of $2\\pi$, selecting ultra-narrow discrete spectral lines from the broader fluorescence curve.",
      },
    ],
    whyItMattersToday:
      "Maiman's ruby laser transformed human technology by turning theoretical quantum mechanics into a practical tool. Today, solid-state and semiconductor lasers drive the internet, barcode scanners, laser eye surgery (LASIK), precision manufacturing and welding, semiconductor lithography, and gravitational wave observatories.",
  },
  claims,
  historicalContext: {
    problemStatement:
      "The patent identifies a gap between microwave masers and optical frequencies: wavelength-scale microwave cavities cannot be meaningfully reproduced at optical dimensions, while large optical cavities support many modes and demand impractical pump power.",
    priorArtLimitations: [
      "Microwave maser cavities depend on dimensions of the order of a wavelength, a construction that does not transfer usefully to optical frequencies",
      "Large optical cavities support many modes, degrade coherence, and require impractically large pumping power",
      "The patent's gaseous-state examples require critical vapor pressure, temperature, purity, and reflective parallel end plates",
    ],
    breakthroughInsight:
      "The disclosed architecture combines a solid-state active medium, broadband optical pumping, radiationless transfer into a discrete upper level, and an optical feedback path that repeatedly traverses the material.",
    patentWars: [],
    civilizationalImpact:
      "Maiman's creation of the first laser inaugurated the multi-hundred-billion-dollar photonics industry, fundamentally enabling fiber-optic global telecommunications, precision laser surgery, satellite laser ranging, and quantum optics.",
    funFact:
      "Physical Review Letters famously rejected Maiman's paper announcing the world's first working laser because the editor mistakenly thought optical masers were 'just more maser work'; Maiman then published it in Nature in August 1960 in a historic 300-word paper.",
  },
  stats: {
    totalClaims: 2,
    independentClaims: 2,
  },
};
