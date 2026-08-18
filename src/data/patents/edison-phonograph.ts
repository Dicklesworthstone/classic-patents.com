import { edisonPhonographArchivalEdition } from "@/data/editions/edisonPhonographEdition";
import type { Patent } from "@/types/patent";

export const edisonPhonographPatent: Patent = {
  id: "us-200521-edison-phonograph",
  patentNumber: "US 200,521",
  title: "Improvement in Phonograph or Speaking Machines",
  shortTitle: "Tinfoil Phonograph",
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
    "Edison describes a diaphragm that marks a yielding surface as sound moves it, then a second point and diaphragm that recover motion from those marks. His illustrated form uses a ten-groove-per-inch cylinder and threaded shaft, but the specification also describes plate, strip, thread-trace, and ink-trace alternatives.",
  heroQuote:
    "The object of this invention is to record in permanent characters the human voice and other sounds, from which characters such sounds may be reproduced and rendered audible again at a future time.",
  originalPdfUrl: "/patents/pdfs/us-200521-edison-phonograph.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US200521/en",
  usptoClassification: "G11B 3/00 (Mechanical recording or reproducing; Cylinder phonographs)",
  originalTextAsset: {
    url: "/patents/transcripts/us-200521-edison-phonograph-reviewed.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "6ed4354f12dc944b49ac2a2a3dd8d0aaa3f263d0c5f2017b2237a37ffde00ccd",
  },
  // The complete historical text is the explicitly authored archival edition below.
  // This short field remains only for compact catalogue contexts; it is not a
  // substitute for the complete, reviewed three-page specification and claims.
  originalText: `To all whom it may concern:

Be it known that I, THOMAS A. EDISON, of Menlo Park, in the county of Middlesex and State of New Jersey, have invented an Improvement in Phonograph or Speaking Machines, of which the following is a specification:

The object of this invention is to record in permanent characters the human voice and other sounds, from which characters such sounds may be reproduced and rendered audible again at a future time.

The invention consists in arranging a plate, diaphragm, or other flexible body capable of being vibrated by the human voice or other sounds, in conjunction with a material capable of registering the movements of such vibrating body by embossing or indenting or altering such material, in such a manner that such register-marks will be sufficient to cause a second vibrating plate or body to be set in motion by them, and thus reproduce the motions of the first vibrating body.`,
  archivalEdition: edisonPhonographArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "Edison treats sound as a sequence of mechanical movements that can be transferred twice: first from a voice-driven diaphragm to a yielding surface, then from the marks on that surface to a second diaphragm. The specification illustrates a tinfoil cylinder but also preserves alternatives using a spiral plate, a moving strip, a thread trace, and an ink trace.",
    coreMechanism:
      "A person speaks into tube B. Its diaphragm G moves an indenting point against foil on cylinder A. The cylinder's ten-groove-per-inch helix and the matching ten-thread-per-inch shaft make the recording point meet a fresh track as the cylinder turns and travels toward support O. For replay, a finer point on spring D follows the marks and transfers its motion to the lighter diaphragm F in tube C. The patent does not state the diaphragm material, cylinder material or size, turn rate, stylus dimensions, voltage, or audio bandwidth, so this record does not invent those values.",
    mechanicalBreakdown: [
      {
        title: "Speaking diaphragm and indenting point",
        summary:
          "Tube B carries a diaphragm with a hard point at its center; speech moves that point against the recording material.",
        technicalDetails:
          "The source supplies a causal chain, not dimensions: pressure changes in the speaking tube move the diaphragm; the central point makes an indentation in a yielding surface. Edison allows the tube to approach or recede from the cylinder so the operator can set the contact.",
        archaicTerm: "Diaphragm or elastic plate with indenting-point",
        modernEquivalent: "Acoustic recording transducer & cutting stylus",
      },
      {
        title: "Helical cylinder and threaded shaft",
        summary:
          "Cylinder A has ten helical grooves per inch and moves endwise while rotating because shaft X and bearing P have matching ten-thread-per-inch threads.",
        technicalDetails:
          "The ten grooves per inch and ten threads per inch are printed values. Their matched pitch means that one rotation advances the cylinder by one groove spacing, keeping the point opposite the next helical track. The source says clock-work at M or another power source turns L; it does not identify a hand crank, flywheel, cylinder material, or speed.",
        archaicTerm: "Grooved cylinder mounted on a screw-threaded shaft",
        modernEquivalent: "Precision phonograph cylinder mandrel & lead screw",
      },
      {
        title: "Yielding recording material",
        summary:
          "Metallic foil is Edison's preferred material on cylinder A, but paper and other yielding materials are also expressly allowed.",
        technicalDetails:
          "The material must retain marks that correspond to the diaphragm's motion and later yield that motion to a point. Edison also proposes soft paper saturated or coated with paraffine and carrying a metal-foil surface. The patent gives no composition, thickness, purity, adhesive, or measured deformation depth.",
        archaicTerm: "Yielding material such as tinfoil or sheet-lead",
        modernEquivalent: "Analog recording substrate (wax / lacquer master)",
      },
      {
        title: "Speaking tube and reproducing tube",
        summary:
          "Tube B records through diaphragm G; tube C reproduces through the lighter diaphragm F and spring D.",
        technicalDetails:
          "Edison allows any mouthpiece character provided openings re-enforce hissing consonants. He says the reproducing diaphragm may be lighter and more sensitive, though this is not necessary. No horn profile, material, gain, or frequency range is specified.",
        archaicTerm: "Speaking-tube or mouth-piece",
        modernEquivalent: "Acoustic impedance matching horn",
      },
      {
        title: "Tracer, thread trace, and ink trace",
        summary:
          "Spring D follows foil marks, while Figs. 3 and 4 show alternatives that encode diaphragm motion as a side-to-side thread trace or a varying ink trace.",
        technicalDetails:
          "The thread device shifts a thread laterally across paper. The ink device varies pen pressure, so ink quantity changes with diaphragm movement. Edison says a lever can read the ink marks through friction or thickness and move a second diaphragm. Those alternatives matter because the source does not limit the invention to foil indentations.",
        archaicTerm: "Light spring tracer and reproducing diaphragm",
        modernEquivalent: "Phonograph pickup cartridge & loudspeaker driver",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Pressure-driven diaphragm motion",
        formula: "Force on a diaphragm is pressure difference multiplied by diaphragm area.",
        explanation:
          "Sound pressure on a flexible diaphragm creates motion at its center. Edison uses that motion to move a recording point; the patent does not quantify the pressure, area, displacement, or force.",
      },
      {
        principle: "Coupled rotation and axial advance",
        formula: "One matched lead-screw turn advances the cylinder by one helical-groove spacing.",
        explanation:
          "The printed ten-groove-per-inch and ten-thread-per-inch values synchronize the circumferential recording motion with endwise travel. The cylinder therefore presents a continuous helical path rather than repeatedly overwriting one circular line.",
      },
      {
        principle: "Marks as a mechanical motion record",
        formula:
          "A later point follows the varying marks and transfers that motion to another diaphragm.",
        explanation:
          "The source calls for marks that correspond to sound vibrations and are suitable for reproduction. It explains the playback path mechanically rather than supplying a material stress calculation.",
      },
    ],
    whyItMattersToday:
      "The specification is an early articulation of a general storage principle: convert a time-varying physical signal into durable marks, then convert those marks back into motion. Its cylinder form and its thread and ink alternatives make the document useful for reading the continuity between mechanical recording, later analogue media, and modern transducers without treating later formats as if they were printed in 1878.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The method herein specified of reproducing the human voice or other sounds by causing the sound-vibrations to be recorded, substantially as specified, and obtaining motion from that record, substantially as set forth, for the reproduction of the sound-vibrations.",
      plainEnglish:
        "Claim 1 covers the stated sequence, not a particular foil cylinder: make a record of sound vibrations, take motion from that record, and use the recovered motion to reproduce sound vibrations.",
      keyInnovations: [
        "Recorded sound-vibration pattern",
        "Motion recovered from the record",
        "Mechanical reproduction of sound vibrations",
      ],
      legalSignificance:
        "The claim states a broad method sequence, but this record does not treat it as a judicial holding or as proof that Edison was the sole inventor of every form of sound recording.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The combination, with a diaphragm exposed to sound-vibrations, of a moving surface of yielding material—such as metallic foil—upon which marks are made corresponding to the sound-vibrations, and of a character adapted to use in the reproduction of the sound, substantially as set forth.",
      plainEnglish:
        "Claim 2 is an apparatus combination: a sound-driven diaphragm works with a moving yielding surface, such as metallic foil, whose marks both follow the sound vibrations and can later be used to reproduce them.",
      keyInnovations: [
        "Sound-driven diaphragm",
        "Moving yielding recording surface",
        "Marks usable for reproduction",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "The combination, with a surface having marks thereon corresponding to sound-vibrations, of a point receiving motion from such marks, and a diaphragm connected to said point, and responding to the motion of the point, substantially as set forth.",
      plainEnglish:
        "Claim 3 covers the reproducing side: a point follows a marked surface, and its movement drives a connected diaphragm.",
      keyInnovations: [
        "Recorded sound marks",
        "Motion-following point",
        "Diaphragm driven by recovered motion",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "In an instrument for making a record of sound-vibrations, the combination, with the diaphragm and point, of a cylinder having a helical groove and means for revolving the cylinder and communicating an end movement corresponding to the inclination of the helical groove, substantially as set forth.",
      plainEnglish:
        "Claim 4 is the illustrated cylinder arrangement: the diaphragm and point work with a helically grooved cylinder whose drive both turns it and advances it endwise according to the helical groove.",
      keyInnovations: [
        "Helically grooved cylinder",
        "Coupled rotation and endwise movement",
        "Diaphragm and point recording assembly",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Vertical Cross-Section of Cylinder Phonograph Mechanism",
      caption:
        "The source's vertical section shows cylinder A, the speaking tube B, reproducing tube C, diaphragm G, and the support and shaft arrangement.",
      svgType: "edison-phonograph-fig1",
      callouts: [
        {
          id: "callout-cyl",
          figureRef: "Fig. 1",
          label: "Grooved Cylinder",
          element: "A",
          description:
            "Cylinder with a helical indenting groove, specified as ten grooves to the inch.",
          x: 48,
          y: 42,
        },
        {
          id: "callout-leadscrew",
          figureRef: "Fig. 1",
          label: "Threaded Shaft",
          element: "X",
          description:
            "Shaft whose thread is specified as ten threads to the inch and which advances the cylinder endwise.",
          x: 32,
          y: 65,
        },
        {
          id: "callout-mouthpiece",
          figureRef: "Fig. 1",
          label: "Speaking Tube",
          element: "B",
          description: "Mouthpiece focusing acoustic voice vibrations onto diaphragm G.",
          x: 62,
          y: 28,
        },
        {
          id: "callout-reproducer",
          figureRef: "Fig. 1",
          label: "Reproducer & Tracer",
          element: "C",
          description: "Lightweight reproducing diaphragm and spring tracer needle D.",
          x: 75,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Plan Overhead View of Phonograph and Driving Train",
      caption:
        "Fig. 2 illustrates the plan view of the slotted tube L, clock-work drive M, and pillar bearings P and O.",
      svgType: "edison-phonograph-fig2",
      callouts: [
        {
          id: "callout-slot-tube",
          figureRef: "Fig. 2",
          label: "Slotted Drive Tube",
          element: "L",
          description:
            "Slotted tube rotated by clock-work or another source of power, allowing shaft X to slide endwise.",
          x: 25,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Thread-and-paper recording variant",
      caption:
        "The source's Fig. 3 shows the thread, pressure-rollers, and adjacent fork or eye used for the stated sinuous paper trace.",
      svgType: "edison-phonograph-fig3",
      callouts: [
        {
          id: "callout-thread",
          figureRef: "Fig. 3",
          label: "Thread and pressure-rollers",
          element: "t",
          description:
            "A thread passes with paper beneath pressure-rollers; the adjacent fork or eye shifts it laterally with diaphragm motion.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Ink-trace recording variant",
      caption:
        "The source's Fig. 4 shows the inking-pen variant, in which diaphragm motion changes the pressure at pen u on advancing paper.",
      svgType: "edison-phonograph-fig4",
      callouts: [
        {
          id: "callout-inking-pen",
          figureRef: "Fig. 4",
          label: "Inking-pen",
          element: "u",
          description:
            "The pen rests on moving paper and deposits more or less ink according to diaphragm movement.",
          x: 48,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification frames the engineering problem directly: preserve human voice and other sounds as durable marks, then use those marks to make sound audible again at a later time.",
    priorArtLimitations: [
      "Édouard-Léon Scott de Martinville's 1857 phonautograph traced sound waves for visual study, but its records were not intended for playback. The Library of Congress describes that limitation; the source is recorded in this patent's provenance receipt.",
    ],
    breakthroughInsight:
      "The document keeps recording and reproduction in one mechanical chain: a sound-driven diaphragm marks a yielding moving surface, and a second point and diaphragm recover motion from those marks. It also expressly tests that idea against several media and geometries instead of limiting it to the illustrated foil cylinder.",
    patentWars: [],
    civilizationalImpact:
      "US 200,521 is a compact early statement of mechanical signal storage: transform an acoustic time series into a physical trace, preserve it, and use the trace to recover motion. Its plate, strip, thread, and ink alternatives make that principle broader than the cylinder pictured in Figs. 1 and 2.",
    funFact:
      "The printed specification itself proposes making multiple copies from a tinfoil record by a plaster-of-Paris stereotyping process when musical compositions are wanted for numerous machines.",
    aftermath:
      "The granted document is dated February 19, 1878; its signed execution is dated December 15, 1877.",
    sideNotes: [
      "The specification expressly declines to claim an earlier magnet-and-paper apparatus described in application No. 128, filed March 26, 1877.",
      "It cites application No. 143, filed August 28, 1877, for devices intended to re-enforce hissing consonants.",
    ],
  },
  tags: [
    "Acoustics",
    "Audio Recording",
    "Phonograph",
    "Tinfoil",
    "Lead Screw",
    "Diaphragm",
    "Thomas Edison",
    "Menlo Park",
  ],
  stats: {
    totalClaims: 4,
    independentClaims: 4,
    impactScore: 99,
  },
};
