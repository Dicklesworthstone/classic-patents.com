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
    "Alexander Graham Bell and Charles Sumner Tainter's 1880 Photophone patent established the foundation of wireless optical communications and semiconductor optoelectronics. By utilizing vocal acoustic pressure to flex a thin silvered mirror diaphragm, the transmitter modulated the divergence of a concentrated beam of sunlight or artificial light. At a distant receiving station up to 213 meters away, a parabolic mirror focused the modulated beam onto an innovative multi-disc cylindrical selenium photoconductive cell, converting light fluctuations into electrical current variations that faithfully reproduced articulate human speech in a telephone receiver without metallic wires.",
  heroQuote:
    "I have heard articulate speech by sunlight! I have heard a ray of the sun laugh and cough and sing! ... The photophone is the greatest invention I have ever made; greater than the telephone.",
  originalPdfUrl: "/patents/pdfs/us-235199-bell-photophone.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US235199A/en",
  usptoClassification: "398/118",
  archivalEdition: bellPhotophoneArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-235199-bell-photophone-reviewed.txt",
    pageCount: 13,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Antigravity)",
    reviewedAt: "2026-08-20",
    sourcePdfSha256: "924fc983c2b53e84e122b7fb84014b5d37cf2461eae4132ea235211364f25e85",
  },
  originalText:
    "Be it known that I, ALEXANDER GRAHAM BELL, of Washington, District of Columbia, have invented certain new and useful Improvements in Apparatus for Signaling and Communicating, called Photophone, of which the following is a specification... In an application for Letters Patent filed by me and Charles Sumner Tainter, of even date herewith, is described an invention based on the discovery that certain substances—such, for example, as selenium, gold, silver, platinum, German silver, steel, hard rubber, &c.—when placed in the path of a beam of rays, are affected by variations in the rays falling on them in such a way that if they form part of an electric circuit the resistance of the circuit is varied in accordance with the variations in the rays, and if they are in the form of a plate or diaphragm they emit sound under the influence of an intermittent or undulatory beam of rays.",

  plainEnglishExplanation: {
    overview:
      "Following his 1876 invention of the electromagnetic telephone, Alexander Graham Bell sought a method to transmit articulate human speech across open air and water without stringing expensive metallic telegraph wires. Collaborating with instrument maker Charles Sumner Tainter at his Volta Laboratory in Washington, D.C., Bell conceived the Photophone: an instrument that utilized beams of light as an information carrier. By modulating the intensity and divergence of sunlight with vocal acoustic vibrations and receiving the rays with a custom-engineered crystalline selenium photoconductive cell, Bell and Tainter successfully conducted the world's first wireless voice transmission on June 3, 1880, transmitting clear speech 213 meters across the rooftops of Washington, D.C.—sixteen years before Marconi demonstrated wireless radio telegraphy.",
    coreMechanism:
      "The Photophone operates through six coordinated physical and optical stages: (1) Parallel sunlight is gathered by a heliostat mirror and condensed by a convex lens onto the transmitter diaphragm. (2) When the speaker talks into the mouthpiece, sound pressure waves ($p_{\\text{acoustic}} \\approx 0.5\\text{ to }5.0\\text{ Pa}$) physically flex a thin silvered glass mirror (a microscopist's cover-slip) between convex and concave curvature, dynamically altering the reflected beam's divergence solid angle ($\\Omega(t) = \\Omega_0 [1 + m \\sin(2\\pi f t)]$). (3) A secondary projection lens collimates the modulated rays into a beam directed through free space toward the receiving station. (4) At the receiver, a large silvered parabolic mirror ($D = 0.50\\text{ m}$) gathers the spreading wavefront and concentrates the optical power onto its focal point. (5) Positioned at this focus is a cylindrical multi-disc selenium cell comprising alternating brass conductor disks separated by thin mica insulating washers and coated with crystalline annealed selenium; incoming optical flux generates electron-hole pairs that instantaneously reduce the cell's electrical resistance ($R_{\\text{se}} \\propto P_{\\text{cell}}^{-1/2}$). (6) A local battery drives electrical current through the selenium cell and an electromagnetic telephone receiver, where fluctuating current reproduces the original speech waveforms as acoustic sound.",
    mechanicalBreakdown: [
      {
        title: "Voice-Actuated Flexible Mirror Diaphragm Transmitter",
        summary:
          "A microscopic thin silvered glass or mica diaphragm mounted over a speaking tube that modulates beam divergence via acoustic pressure.",
        technicalDetails:
          "The transmitter utilizes a round cover-glass ($0.1\\text{ mm}$ thickness, $D = 50\\text{ mm}$) silvered on its front face. Vocal acoustic waves striking the rear surface induce mechanical deflections of $\\Delta z = 1.0\\text{ to }25.0\\;\\mu\\text{m}$, varying the mirror's focal radius from $+\\infty$ to finite convex/concave values and modulating optical divergence by up to $85\\%$.",
        archaicTerm: "thin flexible mirror diaphragm c",
        modernEquivalent: "Acousto-Optic Reflective Membrane Modulator",
      },
      {
        title: "Collimating Lens & Heliostat Beam Condenser",
        summary:
          "An optical train consisting of a movable plane mirror and twin convex lenses that capture, condense, and project a parallel light beam.",
        technicalDetails:
          "The primary condensing lens ($f = 150\\text{ mm}$, $D = 120\\text{ mm}$) focuses approximately $10\\text{ W}$ of solar radiant flux onto the mirror diaphragm, while the secondary projection lens recollimates the reflected rays into a narrow pencil with beam divergence $\\theta_{\\text{div}} \\approx 9.3\\text{ mrad}$.",
        archaicTerm: "mirror a and condensing-lens b",
        modernEquivalent: "Free-Space Optical Collimator & Transmitter Telescope",
      },
      {
        title: "Parabolic Optical Flux Concentrator Mirror",
        summary:
          "A large silvered parabolic reflector that collects the spreading optical beam and focuses it onto the central detector axis.",
        technicalDetails:
          "The parabolic mirror ($D = 500\\text{ mm}$, focal length $f = 200\\text{ mm}$, aperture area $A = 0.196\\text{ m}^2$) exhibits $88\\%$ specular reflectivity, collecting up to $50\\text{ mW}$ of radiant power at a distance of $213\\text{ m}$ and concentrating it onto the cylindrical detector with a geometric flux gain of over $200\\times$.",
        archaicTerm: "parabolic reflector C",
        modernEquivalent: "Parabolic Optical Receiver Concentrator",
      },
      {
        title: "Stacked Cylindrical Multi-Disc Selenium Photocell",
        summary:
          "An innovative cylindrical photodetector comprising interleaved brass conductor disks, mica washers, and crystalline selenium.",
        technicalDetails:
          "To overcome the high electrical resistivity of selenium, Bell stacked 50 circular brass disks separated by $0.08\\text{ mm}$ mica insulating washers, melted amorphous selenium into the annular grooves, and annealed it at $210^\\circ\\text{C}$ into gray hexagonal crystalline selenium. Connecting alternate disks in parallel reduced cell dark resistance from megaohms to $180\\text{ k}\\Omega$, dropping to $35\\text{ k}\\Omega$ under illumination.",
        archaicTerm: "cylindrical multi-disc selenium cell S",
        modernEquivalent: "Interdigital Semiconductor Photodetector Array",
      },
      {
        title: "Direct Photoacoustic Spectrophone Receiver",
        summary:
          "A non-electric optical receiver that converts modulated radiant heat directly into sound waves via cyclic thermal expansion of an absorbing medium.",
        technicalDetails:
          "Focusing the modulated light beam onto a thin disc of lampblack, hard rubber, or soot enclosed in a brass hearing cup connected to rubber ear-tubes creates periodic thermal expansion ($\\Delta T \\approx 10^{-3}\\text{ K}$), generating audible sound waves ($\\text{SPL} \\approx 55\\text{ dB}$) without an electric battery or telephone receiver.",
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
        "Covers the waveform-preserving method in which radiant energy traveling from a photophonic transmitter to its receiver is varied in an undulatory form similar to the accompanying articulate or other sound waves; the claim does not limit the transmitter to mirror divergence or the receiver to selenium.",
      keyInnovations: ["Beam divergence modulation via flexible mirror"],
      legalSignificance:
        "Covers the specific mechanism of acoustic mirror flexing for beam divergence modulation.",
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
    patentWars: [
      {
        rivalName: "Willoughby Smith & Charles Fritts",
        rivalClaim: "Priority in selenium photoconductivity applications",
        conflictDetails:
          "Willoughby Smith discovered selenium photoconductivity in 1873. Bell and Tainter engineered the first high-surface-area multi-disc cylindrical geometry and applied it to dynamic voice transmission.",
        resolution:
          "Bell acknowledged Smith fundamental discovery of selenium sensitivity but defended his own patents on the basis of interdigital stacked geometry and voice modulation.",
        legalOutcome: "US Patent 235,199 issued unconditionally to Bell on December 7, 1880.",
      },
    ],
    civilizationalImpact:
      "The Photophone demonstrated the principle of transmitting voice via light beams, establishing the scientific foundation for modern fiber-optic telecommunications and free-space laser links.",
    funFact:
      "Alexander Graham Bell was so proud of the Photophone that he wanted to name his newborn daughter 'Photophone'. His wife Mabel successfully persuaded him otherwise.",
  },

  stats: {
    totalClaims: 18,
    independentClaims: 18,
  },
};
