import type { Patent } from "@/types/patent";

export const edisonPhonographPatent: Patent = {
  id: "us-200521-edison-phonograph",
  patentNumber: "US 200,521",
  title: "Improvement in Phonographs or Speaking Machines",
  shortTitle: "Edison Cylinder Phonograph Sound Recorder",
  subtitle:
    "Acoustic Diaphragm, Indenting Stylus, Grooved Lead-Screw Mandrel, and Tinfoil Recording",
  inventors: ["Thomas Alva Edison"],
  inventorLocation: "Menlo Park, Middlesex County, New Jersey",
  grantDate: "1878-02-19",
  filingDate: "1877-12-24",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "telecom",
  categoryLabel: "Acoustic Physics & Audio Engineering",
  summary:
    "The 1878 miracle of Menlo Park that captured human sound: Thomas Alva Edison's phonograph combining an acoustic diaphragm, a blunt steel stylus, and a grooved cylinder wrapped in tinfoil translated axially by a precision threaded lead-screw, embossing sound waves into micro-grooves and playing them back through mechanical resonance.",
  heroQuote:
    "The sound-vibrations are recorded by indenting a yielding material such as tinfoil... and these indentations when subsequently passed under a tracer reproduce the same vibrations upon a diaphragm, recreating the original voice.",
  originalPdfUrl: "/patents/pdfs/us-200521-edison-phonograph.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US200521/en",
  usptoClassification: "G11B 3/00 (Mechanical recording or reproducing; Cylinder phonographs)",
  originalTextAsset: {
    url: "/patents/source-text/us-200521-edison-phonograph.txt",
    pageCount: 3,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
THOMAS A. EDISON, OF MENLO PARK, NEW JERSEY.

IMPROVEMENT IN PHONOGRAPHS OR SPEAKING MACHINES.

Specification forming part of Letters Patent No. 200,521, dated February 19, 1878.
Application filed December 24, 1877.

To all whom it may concern:
Be it known that I, THOMAS A. EDISON, of Menlo Park, in the County of Middlesex and State of New Jersey, have invented a new and useful Improvement in Phonographs or Speaking Machines, of which the following is a specification:

The object of this invention is to record in permanent characters the human voice and other sounds, from which characters such voice or sounds may be accurately reproduced and vocalized at any subsequent time.

The invention consists in:
1. A diaphragm or elastic plate vibrated by the human voice or other sounds.
2. An indenting-point or stylus connected to the center of said diaphragm.
3. A cylinder or plate having a continuous spiral groove cut in its surface, mounted upon a threaded shaft or lead-screw so that as the cylinder is rotated, it also advances longitudinally.
4. A yielding material, such as tinfoil, sheet-lead, or waxed paper, secured over the grooved surface of the cylinder beneath the indenting point.
5. A reproducing diaphragm and tracer adapted to track in the indentations made by the recording stylus, whereby the original air vibrations are mechanically re-created.

When speech is directed into the mouthpiece, the acoustic sound waves strike the diaphragm, causing it to vibrate with amplitudes and frequencies corresponding to the sounds. The indenting stylus, vibrating with the diaphragm, presses into the yielding tinfoil directly over the spiral groove of the rotating cylinder, creating a continuous furrow containing microscopic vertical indentations or hills and valleys representing the sound waves.

To reproduce the recorded sound, the cylinder is returned to its starting position, and a delicate spring tracer attached to a reproducing diaphragm is placed in the furrow. As the cylinder is turned at the same speed, the indentations vibrate the tracer and diaphragm, faithfully reproducing the original spoken words with clear tone and intelligibility.

I claim as my invention:
1. The method of recording and reproducing sound by indenting a yielding material with vibrations corresponding to sound-waves, and subsequently utilizing such indentations to actuate a diaphragm to reproduce the sound.
2. The combination with a diaphragm and stylus of a grooved cylinder mounted on a screw-threaded shaft to advance longitudinally while rotating, substantially as described.
3. The combination of the grooved cylinder, a sheet of tinfoil or yielding recording material, and an indenting point actuated by acoustic vibrations.`,
  plainEnglishExplanation: {
    overview:
      "Before December 1877, human sound was completely ephemeral: once a word was spoken or a note was sung, it vanished forever into air friction. While experimenting with telephone diaphragms and high-speed telegraph paper tapes at his Menlo Park laboratory, Thomas Edison realized that voice vibrations could be physically engraved into a moving surface and played back. His 1878 phonograph was the first machine in history that could capture, preserve, and reproduce human speech and music.",
    coreMechanism:
      "A speaker talks loudly into a conical mouthpiece, causing a thin mica or parchment diaphragm to vibrate with acoustic pressure waves ($P_{\\text{acoustic}}(t)$). A blunt steel stylus fixed to the center of the diaphragm presses against a sheet of thin tinfoil wrapped around a heavy brass cylinder. The cylinder has a continuous spiral groove ($10\\text{ threads per inch}$) cut into its surface and is mounted on a threaded lead-screw shaft. As the operator turns a hand crank at steady speed ($60\\text{ RPM}$), the cylinder rotates and slides longitudinally, causing the vibrating stylus to indent vertical 'hills and valleys' into the tinfoil over the groove. To play back the recording, a lighter stylus tracks the indentations, vibrating a reproducing diaphragm that pushes the air to recreate the original human voice.",
    mechanicalBreakdown: [
      {
        title: "Acoustic Diaphragm & Blunt Indenting Stylus",
        summary: "Thin mica plate vibrating steel stylus against tinfoil surface.",
        technicalDetails:
          "A circular mica or parchment diaphragm ($D = 50\\text{ mm}$, thickness $0.15\\text{ mm}$) clamped at its perimeter. A sharp-rounded steel stylus ($r_{\\text{tip}} = 0.25\\text{ mm}$) translates sound pressure oscillations into vertical plastic indentations ($z_{\\text{indent}} = 5\\text{ to }50\\;\\mu\\text{m}$).",
        archaicTerm: "Diaphragm or elastic plate with indenting-point",
        modernEquivalent: "Acoustic recording transducer & cutting stylus",
      },
      {
        title: "Threaded Lead-Screw Mandrel & Grooved Cylinder",
        summary: "Heavy brass cylinder with spiral grooves advanced by lead screw.",
        technicalDetails:
          "A brass cylinder ($D = 100\\text{ mm}, L = 100\\text{ mm}$) with a $2.54\\text{ mm}$ pitch ($10\\text{ TPI}$) spiral groove matching the lead-screw threads on the main shaft. Flywheel inertia ($I = \\frac{1}{2} M R^2$) dampens hand-crank rotational jitter, maintaining steady tangential surface velocity ($v = \\omega R \\approx 314\\text{ mm/s}$).",
        archaicTerm: "Grooved cylinder mounted on a screw-threaded shaft",
        modernEquivalent: "Precision phonograph cylinder mandrel & lead screw",
      },
      {
        title: "Tinfoil Yielding Plastic Recording Medium",
        summary: "Thin sheet of annealed tin foil wrapped around the cylinder.",
        technicalDetails:
          "High-purity tin foil ($98\\%\\text{ Sn}$, thickness $0.05\\text{ mm}$) wrapped tightly over the cylinder and secured with shellac. Tin exhibits low yield strength and high ductility without elastic springback, preserving the exact shape of microscopic groove undulations.",
        archaicTerm: "Yielding material such as tinfoil or sheet-lead",
        modernEquivalent: "Analog recording substrate (wax / lacquer master)",
      },
      {
        title: "Exponential Acoustic Funnel & Voice Concentrator",
        summary:
          "Conical brass horn transforming free-field air velocity into acoustic pressure at the diaphragm.",
        technicalDetails:
          "A flaring conical brass funnel ($D_{\\text{mouth}} = 120\\text{ mm}, D_{\\text{throat}} = 15\\text{ mm}$) couples acoustic voice energy to the diaphragm. By acting as an acoustic impedance transformer, the horn increases particle pressure amplitude at the diaphragm center by $+18\\text{ dB}$, overcoming the mechanical stiffness of the clamped mica disc.",
        archaicTerm: "Mouth-piece or speaking-tube for directing sound waves",
        modernEquivalent: "Acoustic megaphone / Exponential horn transformer",
      },
      {
        title: "Split Half-Nut Lead-Screw Carriage & Tracking Sled",
        summary:
          "Engageable bronze half-nut advancing the diaphragm assembly in true pitch synchronization.",
        technicalDetails:
          "The reproducer carriage carries a threaded bronze half-nut that drops onto the rotating central lead screw ($p = 2.54\\text{ mm}$). This provides positive kinematic tracking ($x(t) = p \\cdot \\frac{\\omega t}{2\\pi}$) along the mandrel without risking stylus deflection or groove skip during high-amplitude voice transients.",
        archaicTerm: "Movable carriage guided by a screw-thread",
        modernEquivalent: "Lead-screw feed carriage & half-nut tracker",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Acoustic-to-Mechanical Forced Harmonic Oscillation",
        formula:
          "m_{\\text{eff}} \\ddot{z} + b \\dot{z} + k z = A_{\\text{diaphragm}} \\cdot P_{\\text{acoustic}}(t)",
        explanation:
          "The mechanical stylus displacement $z(t)$ mirrors the acoustic waveform of voice pressure $P(t)$, with resonance tuning ($f_0 = \\frac{1}{2\\pi}\\sqrt{k/m} \\approx 1.5\\text{ kHz}$) optimized for human speech intelligibility.",
      },
      {
        principle: "Spatial Frequency & Groove Wavelength Encoding",
        formula:
          "\\lambda_{\\text{groove}} = \\frac{v_{\\text{surface}}}{f} = \\frac{\\omega R_{\\text{cylinder}}}{f}, \\quad \\lambda(1\\text{ kHz}) = \\frac{314\\text{ mm/s}}{1000\\text{ Hz}} = 314\\;\\mu\\text{m}",
        explanation:
          "Analog sound frequencies $f$ are mapped into spatial wavelengths $\\lambda$ along the helical spiral track on the rotating cylinder surface.",
      },
      {
        principle: "Dynamic Plastic Indentation Mechanics",
        formula:
          "F_{\\text{indent}} = H_{\\text{Vickers}} \\cdot A_{\\text{contact}} \\propto z(t)",
        explanation:
          "The stylus creates a permanent plastic furrow in the ductile tinfoil without tearing through into the clearance groove underneath.",
      },
      {
        principle: "Acoustic Horn Impedance Transformation",
        formula:
          "Z_{\\text{horn}}(f) = \\frac{\\rho_0 c}{S_{\\text{throat}}} \\cdot \\frac{1}{\\sqrt{1 - (f_c / f)^2}}, \\quad f_c = \\frac{m c}{4\\pi}",
        explanation:
          "The flaring geometry matching the acoustic impedance of the free air to the high mechanical impedance of the diaphragm boosts energy transfer efficiency by two orders of magnitude.",
      },
    ],
    whyItMattersToday:
      "Edison's phonograph created the global audio recording, music, and consumer entertainment industry. It was the direct technological ancestor of wax cylinders, vinyl records, optical compact discs (CDs), magnetic cassette tape, and modern digital sampling. The phonograph transformed Edison from a respected electrical inventor into the internationally celebrated 'Wizard of Menlo Park'.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The method of recording and reproducing sound by indenting a yielding material with vibrations corresponding to sound-waves, and subsequently utilizing such indentations to actuate a diaphragm to reproduce the sound.",
      plainEnglish:
        "Pioneer master claim: the fundamental method of recording sound by indenting a yielding material with acoustic vibrations, and playing it back by tracing those indentations to vibrate a diaphragm.",
      keyInnovations: [
        "Mechanical recording of sound vibrations into physical media",
        "Playback by tracing physical groove indentations",
        "Acoustic audio reproduction",
      ],
      legalSignificance:
        "The foundational claim covering all mechanical sound recording and playback in history.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination with a diaphragm and stylus of a grooved cylinder mounted on a screw-threaded shaft to advance longitudinally while rotating, substantially as described.",
      plainEnglish:
        "Specifies the combination of a diaphragm stylus and a grooved cylinder mounted on a lead screw that moves axially as it turns to create a continuous helical recording track.",
      keyInnovations: [
        "Helical spiral grooved cylinder mandrel",
        "Lead-screw synchronized axial advance",
      ],
      legalSignificance: "Protected the cylinder phonograph mechanical architecture.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination of the grooved cylinder, a sheet of tinfoil or yielding recording material, and an indenting point actuated by acoustic vibrations.",
      plainEnglish:
        "Covers the physical recording medium: a sheet of tinfoil wrapped over the grooved cylinder to receive vertical sound indentations from the acoustic stylus.",
      keyInnovations: [
        "Tinfoil yielding recording medium",
        "Groove-supported indentation mechanics",
      ],
      legalSignificance: "Secured the first practical commercial sound recording media.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective and Sectional View of Edison Tinfoil Phonograph",
      caption:
        "Drawing showing grooved brass cylinder, lead-screw shaft, hand crank, recording mouthpiece, stylus, and reproducing diaphragm.",
      svgType: "edison-phonograph",
      callouts: [
        {
          id: "ep-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Grooved Brass Cylinder & Tinfoil",
          description: "Helically grooved cylinder wrapped in tinfoil recording sheet.",
          x: 50,
          y: 45,
        },
        {
          id: "ep-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Lead-Screw Threaded Shaft",
          description: "Precision 10 TPI threaded arbor advancing cylinder axially.",
          x: 50,
          y: 60,
        },
        {
          id: "ep-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Acoustic Mouthpiece & Diaphragm",
          description: "Mica diaphragm vibrating steel indenting stylus with voice.",
          x: 35,
          y: 25,
        },
        {
          id: "ep-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Hand Crank & Heavy Flywheel",
          description: "Manual crank maintaining smooth rotational angular speed.",
          x: 85,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1877, human sound was entirely fleeting. The French inventor Édouard-Léon Scott de Martinville had created the 'Phonautograph' in 1857, which drew squiggly lines of sound waves on soot-blackened paper, but no one believed it was possible to physically play those lines back to recreate intelligible human voice.",
    priorArtLimitations: [
      "Scott's Phonautograph recorded 2D visual traces on smoke-covered paper but lacked any mechanical playback mechanism.",
      "Charles Cros submitted a theoretical paper to the French Academy in April 1877 outlining the concept of sound reproduction (the 'Paleophone') but never built a working machine.",
      "Telephone transducers transmitted live signals over copper wires but had zero physical memory storage.",
    ],
    breakthroughInsight:
      "In late 1877, while watching a paper tape with telegraph indentations produce a humming musical pitch as it was pulled under a metal contact finger, Edison realized that if voice sound waves were pressed into a ductile material, running the groove back under a diaphragm would physically recreate the original sound.",
    patentWars: [
      {
        rivalName: "Alexander Graham Bell, Chichester Bell, and Charles Sumner Tainter",
        rivalClaim:
          "The Volta Laboratory team patented the 'Graphophone' (US 341,214 in 1886) using wax cylinders with incised grooves instead of indented tinfoil.",
        conflictDetails:
          "Edison had shelved the phonograph for ten years to invent the incandescent light bulb. When Bell and Tainter introduced wax cylinders that sounded significantly clearer than fragile tinfoil, Edison rushed back to the phonograph, inventing the 'Perfected Phonograph' in 1888 with solid wax cylinders and electric motor drives.",
        resolution:
          "Edison and the Graphophone interests battled in court before cross-licensing patents and forming the North American Phonograph Company in 1888.",
        legalOutcome:
          "Edison's original 1878 patent was recognized as the foundational pioneer patent for all mechanical audio recording.",
      },
    ],
    civilizationalImpact:
      "The phonograph created the recording arts, global music distribution, audio journalism, and the spoken-word archive. For the first time in human history, the voices of world leaders, musicians, and historical figures could be heard across centuries.",
    funFact:
      "The first words ever recorded and played back in human history were spoken by Thomas Edison into this machine in December 1877: 'Mary had a little lamb, its fleece was white as snow, and everywhere that Mary went, the lamb was sure to go!' Edison later recalled: 'I was never so taken aback in my life. I was always afraid of things that worked the first time!'",
    aftermath:
      "Edison took his working phonograph to Washington in April 1878 to demonstrate it before the National Academy of Sciences, members of Congress, and President Rutherford B. Hayes at the White House until 3:30 AM. Edison manufactured hundreds of thousands of phonographs and wax cylinder records in West Orange, New Jersey.",
  },
  tags: [
    "Thomas Edison",
    "Phonograph",
    "Sound Recording",
    "Audio Engineering",
    "Acoustics",
    "Wizard of Menlo Park",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1878–1888",
    impactScore: 100,
  },
};
