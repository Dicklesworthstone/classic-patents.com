/**
 * bell-photophone.ts
 *
 * Canonical Patent Record for Alexander Graham Bell's Photophone (US Patent 235,199).
 */

import {
  bellPhotophoneArchivalEdition,
  manualPhotophoneClaimText,
} from "@/data/editions/bellPhotophoneEdition";
import type { Patent } from "@/types/patent";

export const bellPhotophonePatent: Patent = {
  id: "us-235199-bell-photophone",
  patentNumber: "US 235,199",
  title: "Apparatus for Signaling and Communicating, called Photophone",
  shortTitle: "Bell & Tainter Photophone Optical Wireless Communication",
  subtitle:
    "Voice-Modulated Radiant Beam, Free-Space Optical Transmission, Parabolic Reflector Collector, and Stacked Cylindrical Selenium Photocell",
  inventors: ["Alexander Graham Bell"],
  inventorLocation: "Washington, District of Columbia",
  grantDate: "1880-12-07",
  filingDate: "1880-08-28",
  era: "Electrification & Early Modern (1870–1920)",
  category: "telecom",
  categoryLabel: "Optical Communications & Telecommunications",
  summary:
    "Alexander Graham Bell's 1880 Photophone patent claims methods and apparatus for signaling by varying radiant energy and applying the resulting beam to sensitive bodies. The specification describes sound-driven shutters and reflectors, direct acoustic receivers, and selenium cells whose resistance changes with the received rays, allowing a telephone circuit to reproduce the imposed variations.",
  heroQuote:
    "My invention consists in a method of utilizing radiant energy and of applying it by suitable apparatus to produce audible signals and to produce electric signals.",
  originalPdfUrl: "/patents/pdfs/us-235199-bell-photophone.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US235199A/en",
  usptoClassification: "398/118",
  archivalEdition: bellPhotophoneArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-235199-bell-photophone-reviewed.txt",
    pageCount: 13,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (manual facsimile review)",
    reviewedAt: "2026-08-21",
    sourcePdfSha256: "924fc983c2b53e84e122b7fb84014b5d37cf2461eae4132ea235211364f25e85",
  },
  originalText:
    "Be it known that I, ALEXANDER GRAHAM BELL, of Washington, District of Columbia, have invented an Improved Apparatus for Signaling and Communicating, called “Photophone,” of which the following description, in connection with the accompanying drawings, is a specification. My invention consists in a method of utilizing radiant energy and of applying it by suitable apparatus to produce audible signals and to produce electric signals.",

  plainEnglishExplanation: {
    overview:
      "The specification addresses signaling without treating the beam as a binary telegraph pulse. Bell varies radiant energy in accordance with a sound or other signal, sends that changing beam through an optical path, and uses either a directly responding diaphragm or a sensitive electrical body such as selenium at the receiver.",
    coreMechanism:
      "The source gives two linked paths. In the optical path, a heliostat, lenses, screens, gratings, or a voice-moved reflector vary the amount or direction of the rays. At the receiver, hard rubber or another body can emit sound directly, while selenium forms part of a battery circuit whose resistance changes with illumination and thereby varies a telephonic receiver. The patent does not specify modern carrier equations or numerical component dimensions.",
    mechanicalBreakdown: [
      {
        title: "Voice-Actuated Flexible Mirror Diaphragm Transmitter",
        summary:
          "A microscopic thin silvered glass or mica diaphragm mounted over a speaking tube that modulates beam divergence via acoustic pressure.",
        technicalDetails:
          "The specification describes a thin silvered glass or metal reflector that takes up the voice's vibrational motion. As each part departs from its normal plane, reflected rays are diverted toward or away from the receiver, so the delivered radiant energy follows the sound without requiring a numerical deflection or divergence claim.",
        archaicTerm: "thin flexible mirror diaphragm c",
        modernEquivalent: "Acousto-Optic Reflective Membrane Modulator",
      },
      {
        title: "Collimating Lens & Heliostat Beam Condenser",
        summary:
          "An optical train consisting of a movable plane mirror and twin convex lenses that capture, condense, and project a parallel light beam.",
        technicalDetails:
          "The drawings and specification use a heliostat or plane mirror, a condensing lens, optional heat screen, and further lenses or reflectors to focus, redirect, and restore the beam's useful parallelism. Their job is optical routing and concentration, not a claimed numerical aperture or power rating.",
        archaicTerm: "mirror a and condensing-lens b",
        modernEquivalent: "Free-Space Optical Collimator & Transmitter Telescope",
      },
      {
        title: "Parabolic Optical Flux Concentrator Mirror",
        summary:
          "A large silvered parabolic reflector that collects the spreading optical beam and focuses it onto the central detector axis.",
        technicalDetails:
          "The receiver's parabolic mirror collects the incoming beam and concentrates it at its focus, where Bell places the selenium cell. A finder or sight through the supporting tube aligns the axis; the source supplies no numerical aperture, reflectivity, range, or gain limit for this description.",
        archaicTerm: "parabolic reflector C",
        modernEquivalent: "Parabolic Optical Receiver Concentrator",
      },
      {
        title: "Stacked Cylindrical Multi-Disc Selenium Photocell",
        summary:
          "An innovative cylindrical photodetector comprising interleaved brass conductor disks, mica washers, and crystalline selenium.",
        technicalDetails:
          "Bell reduces selenium's high-resistance path by arranging conducting plates or disks with thin insulation and filling the short exposed channels between them with selenium. The described spiral, strip, box-and-disk, and cylindrical cells expose useful selenium area while preserving separate electrical terminals; modern material constants are not stated.",
        archaicTerm: "cylindrical multi-disc selenium cell S",
        modernEquivalent: "Interdigital Semiconductor Photodetector Array",
      },
      {
        title: "Direct Photoacoustic Spectrophone Receiver",
        summary:
          "A non-electric optical receiver that converts modulated radiant heat directly into sound waves via cyclic thermal expansion of an absorbing medium.",
        technicalDetails:
          "Bell reports direct sound from hard rubber and other absorbing bodies when a concentrated beam is rapidly interrupted or varied. The receiver can be a plate, diaphragm, or resonant tube listened to directly; the patent does not quantify temperature rise, sound pressure, or a modern photoacoustic model.",
        archaicTerm: "spectrophone / hearing chamber",
        modernEquivalent: "Photoacoustic Cell & Gas-Microphone Detector",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Beam Divergence Modulation & Free-Space Optical Propagation",
        explanation:
          "Optical irradiance reaching the distant receiver follows inverse-square geometric spreading and Beer-Lambert atmospheric attenuation. Modulating mirror curvature dynamically changes the spot diameter at the receiver, converting membrane displacement into radiant flux fluctuations.",
        formula:
          "E_{\\text{recv}}(t) = \\frac{P_0 [1 + m \\sin(2\\pi f t)] \\cdot e^{-\\alpha d}}{\\frac{\\pi}{4} [D_0 + 2 d \\tan(\\theta_{\\text{div}}/2)]^2}",
      },
      {
        principle: "Selenium Photoconductivity Power Law & Carrier Kinetics",
        explanation:
          "Incident photon energy excites valence electrons into the conduction band of gray hexagonal crystalline selenium. Due to bimolecular carrier recombination kinetics, the electrical conductivity increases sublinearly with optical power, causing large dynamic resistance swings that modulate circuit loop current.",
        formula:
          "R_{\\text{se}}(t) = \\frac{R_{\\text{dark}}}{1 + \\beta \\sqrt{P_{\\text{cell}}(t)}} \\quad \\text{and} \\quad \\Delta I(t) = -\\frac{V_{\\text{bat}} \\cdot \\Delta R_{\\text{se}}(t)}{(R_{\\text{se}} + R_{\\text{phone}})^2}",
      },
      {
        principle: "Photoacoustic Thermal Expansion & Acoustic Wave Generation",
        explanation:
          "Non-radiative de-excitation of absorbed radiant energy in solid absorbers produces localized periodic thermal heating $\\Delta T(t)$, which drives volumetric acoustic pressure fluctuations in the adjacent gas column according to the Rosencwaig-Gersho photoacoustic theory.",
        formula:
          "\\Delta P_{\\text{acoustic}}(t) = \\frac{\\gamma - 1}{V_0} \\int \\dot{Q}_{\\text{thermal}}(t) dt \\propto \\frac{\\alpha_{\\text{opt}} I_0}{\\rho C_p \\sqrt{f}}",
      },
    ],
    whyItMattersToday:
      "The Photophone is the direct technological ancestor of both free-space laser communications and modern fiber-optic telecommunications. Bell's realization that light could serve as an information carrier, his development of interdigital semiconductor photodetectors, and his discovery of the photoacoustic effect laid the scientific groundwork for modern optoelectronics, infrared spectroscopy, and the global optical fiber networks carrying petabits of data per second today.",
  },

  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(1),
      plainEnglish:
        "Claims the fundamental method of wireless optical signaling by controlling the active strength of a light beam according to the signal and receiving it on a variable-resistance photosensitive substance in an electric circuit to actuate receiving instruments.",
      keyInnovations: [
        "Wireless optical signaling method",
        "Photoconductive resistance modulation",
      ],
      legalSignificance:
        "The master method claim for wireless optical communication using light rays and photoconductive receivers.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(2),
      plainEnglish:
        "Covers transmitting or reproducing sound by giving a radiant beam an undulating or intermittent pattern that follows the desired sound waves, then using a receiver that responds to that pattern by producing corresponding air vibrations or sound; it does not require a particular selenium cell.",
      keyInnovations: [
        "Voice acoustic modulation of optical beam",
        "Telephonic reproduction via photoconductive receiver",
      ],
      legalSignificance:
        "The fundamental claim for wireless optical speech transmission (the Photophone method).",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(3),
      plainEnglish:
        "Covers the method of transmitting articulate or other sound by making the radiant energy between a photophonic transmitter and receiver vary undulatorily in a form similar to the accompanying sound-waves. The claim does not require Bell's flexible reflector, a particular shutter, or a selenium receiver.",
      keyInnovations: ["Sound-shaped undulatory radiant-energy variation"],
      legalSignificance:
        "Claims the waveform-similar radiant-energy variation itself, leaving the transmitter and receiver implementations open rather than requiring the reflector embodiment.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(4),
      plainEnglish:
        "The method of producing sounds of any desired pitch, amplitude, and quality by exposing a body sensitive to radiant energy to rays whose effective energy is caused to vary in accordance with the vibrational form of the sound-waves.",
      keyInnovations: ["Arbitrary pitch, amplitude, and acoustic waveform optical transmission"],
      legalSignificance:
        "Protects full-fidelity acoustic waveform reproduction over optical beams.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(5),
      plainEnglish:
        "The method of transmitting articulate and other sounds by causing the sound-waves to produce similar variations in the beam of rays proceeding from a photophonic transmitter to a photophonic receiver.",
      keyInnovations: ["Articulate voice transmission via proportional optical variations"],
      legalSignificance: "Covers articulate human speech transmission over modulated light.",
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(6),
      plainEnglish:
        "Covers an apparatus combination: one controller changes the character of a beam from a radiant body, and a sensitive receiving apparatus is operated by those changes to give corresponding signals. The legal combination is defined functionally rather than by a named optical component.",
      keyInnovations: ["Complete optical transmitter and receiver signaling combination"],
      legalSignificance: "Foundational master apparatus claim for optical signaling links.",
    },
    {
      number: 7,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(7),
      plainEnglish:
        "Covers the apparatus arrangement that transmits articulate or other sound by imposing on the radiant energy between photophonic transmitter and receiver undulatory variations similar in form to the sound waves. It claims the end-to-end apparatus relationship, not a single shutter or cell geometry.",
      keyInnovations: ["Undulatory radiant speech transmission apparatus"],
      legalSignificance: "Protects end-to-end voice-modulated photophonic hardware.",
    },
    {
      number: 8,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(8),
      plainEnglish:
        "Covers a photophonic receiver used with a transmitter whose radiant-energy source itself is varied or controlled, such as a voice-operated lamp or manometric flame. This is source modulation, distinct from placing a moving screen or reflector in the beam path.",
      keyInnovations: ["Direct source modulation photophonic transmitter"],
      legalSignificance: "Covers direct modulation of the illuminant (e.g. manometric flames).",
    },
    {
      number: 9,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(9),
      plainEnglish:
        "Covers a distant-station sound apparatus in which transmitter motion changes how much radiant energy reaches the remote receiver. The protected causal step is mechanical movement of the transmitting apparatus producing the delivered-energy variation, rather than a particular mirror, grating, or detector.",
      keyInnovations: ["Mechanical motion beam-intensity modulation"],
      legalSignificance: "Covers modulating radiant flux via mechanical diaphragm displacements.",
    },
    {
      number: 10,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(10),
      plainEnglish:
        "Covers the receiving instrument itself when a varying beam from a radiant source makes it produce corresponding dynamic effects, such as direct sound, or corresponding electrical effects. The claim leaves the sensitive material and the chosen output instrument open.",
      keyInnovations: ["Universal dynamic/electric radiant energy receiver"],
      legalSignificance: "Broad master claim for radiant energy photodetectors.",
    },
    {
      number: 11,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(11),
      plainEnglish:
        "Covers sound-actuated control applied during the beam's travel from source to receiver, expressly distinguishing an in-path screen, grating, reflector, or equivalent from control of the radiant source itself. The controller gives the beam sound-shaped undulation or effective-strength variation.",
      keyInnovations: ["Extracavity / in-flight beam modulation"],
      legalSignificance:
        "Foundational claim distinguishing in-flight beam modulation from source modulation.",
    },
    {
      number: 12,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(12),
      plainEnglish:
        "Covers a photophonic transmitter made from cooperating movable and fixed portions whose relative position controls the amount of radiant energy passing through or from the transmitter. Slidable gratings and opposed shutter parts are examples, but the claim is not limited to their shape.",
      keyInnovations: ["Slotted shutter / grating variable aperture modulator"],
      legalSignificance: "Protects variable optical slit and shutter modulators.",
    },
    {
      number: 13,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(13),
      plainEnglish:
        "Covers the combination of a moving transmitter part with electrically operated mechanism that supplies its motion. An electromagnet or electrically controlled vibrator may drive a grating, shutter, or other beam controller; the claim adds the electrical actuator to the movable photophonic part.",
      keyInnovations: ["Electrically actuated optical beam modulator"],
      legalSignificance: "Covers electromagnetic relay and electro-acoustic modulators.",
    },
    {
      number: 14,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(14),
      plainEnglish:
        "Covers producing a varying photophonic beam from a constant radiant source by controlling how much energy is allowed to pass in the desired direction. The source remains steady while an intervening controller supplies the signal-shaped variation.",
      keyInnovations: ["Constant-source external optical modulation method"],
      legalSignificance: "Protects continuous-wave constant-power source modulation.",
    },
    {
      number: 15,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(15),
      plainEnglish:
        "Covers a beam controller with a vibrating medium and associated means that vary the amount of energy proceeding from a constant source in a selected direction according to that medium's vibrations. It reaches vibrating shutters, gratings, reflectors, and equivalent directional controllers.",
      keyInnovations: ["Vibratory medium directional radiant energy modulator"],
      legalSignificance:
        "Protects acoustic vibrating membranes controlling directional beam energy.",
    },
    {
      number: 16,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(16),
      plainEnglish:
        "Covers a transmitter that gives a radiant beam undulatory or effective-strength variation together with a receiver sensitive to that beam and capable of emitting sound under its influence. This is the direct photoacoustic path and does not require an intervening electrical circuit.",
      keyInnovations: ["Direct photoacoustic receiver link"],
      legalSignificance: "Master claim for non-electric photoacoustic communication systems.",
    },
    {
      number: 17,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(17),
      plainEnglish:
        "Covers the electrical Photophone system: a transmitter controls a beam from a radiant body; a receiver contains a circuit device whose electrical condition follows the beam's strength or character; and telephonic instruments are connected in that circuit to reproduce the sound.",
      keyInnovations: ["Optoelectronic telephonic speech transmission system"],
      legalSignificance: "Master system claim for optoelectronic telephonic communications.",
    },
    {
      number: 18,
      isIndependent: true,
      originalText: manualPhotophoneClaimText(18),
      plainEnglish:
        "Covers the selenium-cell structure: selenium forms part of an electric circuit; at least two conducting strips are separated by insulating material that leaves an exposed intervening space; and selenium occupies that space to complete the electrical path between the conductors.",
      keyInnovations: ["Interdigital multi-strip high-surface-area selenium cell structure"],
      legalSignificance: "Master structural claim for interdigital semiconductor photodetectors.",
    },
  ],

  drawings: [
    {
      figureNumber: "Figure 1",
      title: "Complete Photophonic Optical Wireless Communication System",
      caption:
        "Overall schematic showing heliostat mirror, condensing lens, flexible mirror transmitter, parabolic collector, selenium cell, battery, and telephone receiver.",
      svgType: "bell-photophone-system",
      callouts: [
        {
          id: "callout-heliostat",
          figureRef: "Fig. 1",
          label: "A",
          element: "A",
          description: "Heliostat mirror directing sunlight into optical path.",
          x: 15,
          y: 35,
        },
        {
          id: "callout-transmitter-mirror",
          figureRef: "Fig. 1",
          label: "M",
          element: "M",
          description:
            "Microscopic silvered glass or mica diaphragm modulated by vocal speech pressure.",
          x: 32,
          y: 45,
        },
        {
          id: "callout-parabolic-mirror",
          figureRef: "Fig. 1",
          label: "R",
          element: "R",
          description:
            "Parabolic optical collector focusing incoming modulated light onto selenium cell.",
          x: 70,
          y: 45,
        },
        {
          id: "callout-selenium-cell",
          figureRef: "Fig. 1",
          label: "F",
          element: "F",
          description: "Cylindrical multi-disc selenium photoconductive cell.",
          x: 82,
          y: 45,
        },
      ],
    },
  ],

  historicalContext: {
    problemStatement:
      "In 1880, wire-based telephony required extensive physical copper and iron wire networks across rugged terrain, rivers, and urban centers, while wireless communication across open space had never been achieved.",
    priorArtLimitations: [
      "Telegraphy and telephony required continuous physical metallic wires",
      "Optical signaling (heliographs, lanterns) was limited to slow manual Morse code",
      "No mechanism existed to modulate light with articulate continuous human speech",
    ],
    breakthroughInsight:
      "A microscopic thin mirror flexing under acoustic sound pressure dynamically modulates the divergence and intensity of a reflected light beam, which can be gathered at a distance by a parabolic reflector and converted directly into electrical sound waves by a photoconductive selenium crystal.",
    patentWars: [],
    civilizationalImpact:
      "The Photophone demonstrated the principle of transmitting voice via light beams, establishing the scientific foundation for modern fiber-optic telecommunications and free-space laser links.",
  },

  stats: {
    totalClaims: 18,
    independentClaims: 18,
  },
};
