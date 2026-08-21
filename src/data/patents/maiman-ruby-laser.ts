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
          description: "High-reflector silvered end face (R1 ~ 99.9%).",
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
      "Before Theodore Maiman's breakthrough on May 16, 1960, the scientific consensus—led by prominent physicists including Arthur Schawlow—believed that ruby was unsuitable for a laser because its fluorescence quantum efficiency was erroneously reported to be under 1% and achieving three-level population inversion would require impossibly intense continuous light. Maiman rigorously remeasured synthetic ruby at Hughes Research Laboratories, discovered its quantum efficiency was actually near 75%, and realized that instead of weak continuous lamps, a high-power photographic xenon flash tube discharging stored electrical energy in a millisecond burst could easily pump more than 50% of the ground-state chromium ions into the metastable state, achieving the world's very first working laser.",
    coreMechanism:
      "When the xenon flash lamp fires, intense green (560 nm) and violet (410 nm) photons penetrate the ruby cylinder, exciting ground-state Cr3+ ions from the 4A2 state to the broad 4F2 and 4F1 pump bands. Within less than 100 picoseconds, these excited ions decay non-radiatively by dissipating lattice phonons into the sapphire crystal host, dropping into the metastable 2E doublet state. Because the spontaneous radiative lifetime of the 2E state is remarkably long (~3.0 to 4.3 ms), the population of excited ions (N2) rapidly accumulates. Once the flash energy exceeds the threshold (E_pump > E_th), N2 exceeds the depleted ground-state population N1, creating a population inversion (N2 > N1). Spontaneously emitted 694.3 nm photons traveling parallel to the rod axis bounce repeatedly between the silvered Fabry-Perot end mirrors, stimulating an exponential cascade of coherent identical photons that escapes through the partially silvered mirror as a blinding pulse of monochromatic, collimated laser radiation.",
    mechanicalBreakdown: [
      {
        title: "Synthetic Pink Ruby Crystal Rod",
        summary:
          "Single-crystal corundum (aluminum oxide, Al2O3) doped with ~0.05% Cr2O3 by weight, ground into a precision cylinder with optically flat, parallel end facets.",
        technicalDetails:
          "The crystal lattice provides strong electrostatic crystal-field splitting (10Dq ≈ 18,000 cm^-1), creating broad green (4F2) and violet (4F1) absorption bands while shielding the 2E metastable doublet from fast non-radiative decay, resulting in a narrow R1 fluorescence transition line at $\\lambda = 694.3\\text{ nm}$ with an exceptionally high stimulated emission cross section ($\\sigma_{21} \\approx 2.5 \\times 10^{-20}\\text{ cm}^2$).",
        archaicTerm: "synthetic ruby rod",
        modernEquivalent: "solid-state gain medium (Cr3+:Al2O3 crystal)",
      },
      {
        title: "Helical Xenon Flash Tube & Reflector Housing",
        summary:
          "A quartz glass tube coiled helically around the ruby rod, filled with low-pressure xenon gas and triggered by high-voltage pulse discharge.",
        technicalDetails:
          "Discharging a capacitor bank (e.g. 100 µF charged to 1000–2000 V, delivering 50–200 Joules in ~1 ms) creates an intense xenon arc plasma with an effective blackbody radiation temperature of 7,000–10,000 K, radiating high spectral radiance precisely matched to the green (560 nm) and violet (410 nm) absorption bands of ruby.",
        archaicTerm: "helical gas-filled flash tube",
        modernEquivalent: "optical flashlamp pumping engine",
      },
      {
        title: "Fabry-Perot Optical Resonant Cavity",
        summary:
          "Mutually parallel, optically flat end mirrors coated directly onto the polished ends of the ruby cylinder.",
        technicalDetails:
          "One end face is fully coated with an opaque silver layer ($R_1 \\ge 99.9\\%$) while the output face has a partial transmission silver film ($R_2 \\approx 90\\%\\text{--}98\\%$) or pinhole aperture, forming an axial Fabry-Perot resonator where the round-trip gain $G = R_1 R_2 e^{2(\\sigma_{21} \\Delta N - \\alpha) L} \\ge 1$ establishes self-sustaining laser oscillation in low-order transverse electromagnetic modes.",
        archaicTerm: "interferometer reflecting ends",
        modernEquivalent: "monolithic Fabry-Perot optical cavity resonator",
      },
      {
        title: "Colidar Laser Radar Ranging System",
        summary:
          "The first optical radar instrument, combining the pulsed ruby laser transmitter with a photoelectric receiver and oscilloscope time-of-flight display.",
        technicalDetails:
          "Transmits 10-nanosecond to 1-microsecond pulses of coherent 694.3 nm light with sub-milliradian beam divergence ($\\theta \\approx 1.22 \\lambda / D$), achieving target distance measurement via $R = c \\cdot \\Delta t / 2$ with centimeter-level precision and total immunity to radio-frequency electronic countermeasures.",
        archaicTerm: "Colidar (Coherent Light Detection and Ranging)",
        modernEquivalent: "LIDAR (Light Detection and Ranging)",
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
      "In the late 1950s, building an optical maser was considered an intractable engineering challenge because theoretical calculations suggested that ruby had a fluorescence quantum efficiency below 1%, leading leading researchers to dismiss it as an impossible laser medium.",
    priorArtLimitations: [
      "Microwave masers operated only at centimeter radio wavelengths and required cryogenic cooling",
      "Arthur Schawlow's published calculations claimed ruby could not lase due to low quantum efficiency",
      "Continuous optical lamps lacked the spectral power density to pump 50% of ground-state atoms into inversion",
    ],
    breakthroughInsight:
      "Theodore Maiman discovered that ruby's quantum efficiency was actually ~75% and realized that using a pulsed photographic xenon flash tube could deliver hundreds of Joules of green/violet optical pumping in a single millisecond, easily exceeding the three-level inversion threshold.",
    patentWars: [
      {
        rivalName: "Arthur Schawlow & Charles Townes (Bell Telephone Laboratories)",
        rivalClaim: "US Patent 2,929,922 claiming optical masers with open Fabry-Pérot cavities",
        conflictDetails:
          "Townes and Schawlow filed their seminal optical maser patent in 1958 based on potassium vapor and theoretical solid states. When Maiman built the first working laser in May 1960, Bell Labs claimed priority based on Townes' earlier patent.",
        resolution:
          "Maiman's patent US 3,353,115 was granted in 1967 specifically protecting three-level ruby laser systems, establishing independent patent rights for Hughes Aircraft Company.",
        legalOutcome:
          "Maiman is universally recognized by the global scientific and engineering community as the inventor and builder of the world's first functioning laser.",
      },
    ],
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
