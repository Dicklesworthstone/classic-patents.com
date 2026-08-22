import type { Patent } from "@/types/patent";
import { manualClaimText } from "../editions/eInkEdition";

import { einkArchivalEdition } from "../editions/eInkEdition";
export const eInkPatent: Patent = {
  id: "us-6120588-eink",
  patentNumber: "US 6,120,588",
  title: "Electronically Addressable Microencapsulated Ink and Display Thereof",
  shortTitle: "Jacobson Electronically Addressable Microencapsulated Ink",
  subtitle: "Electrophoretic Contrast Media, Printed Electronic Inks, and Addressable Displays",
  inventors: ["Joseph M. Jacobson"],
  inventorLocation: "Cambridge, Massachusetts",
  grantDate: "2000-09-19",
  filingDate: "1997-09-23",
  era: "Internet & Modern Computing (1990–Present)",
  category: "materials",
  categoryLabel: "Optoelectronics & Electronic Paper",
  summary:
    "US Patent 6,120,588 describes electronically active ink systems and printing systems for laying down electronically addressable contrast media, conductors, insulators, resistors, semiconductive, magnetic, spin, piezoelectric, optoelectronic, thermoelectric, and radio-frequency materials in patterned structures.",
  heroQuote:
    "We describe a system of electronically active inks which may include electronically addressable contrast media, conductors, insulators, resistors, semiconductive materials, magnetic materials, spin materials, piezoelectric materials, optoelectronic, thermoelectric or radio frequency materials.",
  originalPdfUrl: "/patents/pdfs/us-6120588-eink.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6120588A/en",
  archivalEdition: einkArchivalEdition,
  usptoClassification:
    "U.S. Cl. 106/31.16; 106/31.32; 106/31.64; 106/31.92; 264/6, 10, 12, 7; 425/6, 130, 174.8 E; 427/7",
  // Withheld: the current authored edition is a bounded draft and does not
  // yet cover all 16 drawing sheets and every specification paragraph.
  originalTextAsset: {
    url: "/patents/transcripts/us-6120588-eink-reviewed.txt",
    pageCount: 26,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents source-audit hold (not publication acceptance)",
    reviewedAt: "2026-08-21",
    sourcePdfSha256: "574678473ca13e7daaeb661cfd96808fffb6c16d06d86872923fec52a08ab324",
  },
  originalText: `UNITED STATES PATENT
Jacobson et al.
Patent No.: US 6,120,588
Date of Patent: Sep. 19, 2000

ELECTRONICALLY ADDRESSABLE MICROENCAPSULATED INK AND DISPLAY THEREOF
Inventor: Joseph M. Jacobson, Cambridge, Mass.
Assignee: E Ink Corporation, Cambridge, Mass.

ABSTRACT
We describe a system of electronically active inks which may include electronically addressable contrast media, conductors, insulators, resistors, semiconductive materials, magnetic materials, spin materials, piezoelectric materials, optoelectronic, thermoelectric or radio frequency materials. We further describe a printing system capable of laying down said materials in a definite pattern. Such a system may be used for instance to: print a flat panel display complete with onboard drive logic; print a working logic circuit onto any of a large class of substrates; print an electrostatic or piezoelectric motor with onboard logic and feedback or print a working radio transmitter or receiver.

BACKGROUND OF THE INVENTION
The patent begins with prior-art electronically addressable contrast media and extends the concept to electronically active inks and printed functional structures. The specification distinguishes several physical mechanisms, including electrophoretic migration, dielectrophoretic movement, frequency-dependent dielectric response, and printed semiconductor or conductor systems.

CLAIMS
1. An electrically addressable ink comprising a microcapsule, said microcapsule containing a dielectric fluid, a first particle, and a second particle, wherein said first particle and said second particle are suspended in said dielectric fluid and wherein said first particle has an electrical charge which is opposite in polarity to the electrical charge of said second particle, such that upon application of a first electric field, said first particle and said second particle translate within said microcapsule in opposite directions.`,
  plainEnglishExplanation: {
    overview:
      "The grant is broader than the later E Ink product story: it describes electronically addressable contrast media together with printable conductors, semiconductors, logic, sensors, actuators, and radio-frequency structures.",
    coreMechanism:
      "The specification gives several source embodiments. In the electrophoretic embodiment, oppositely charged particles in a microcapsule migrate toward opposite electrodes under an applied field; other embodiments use dielectrophoresis, frequency-dependent dielectric response, chemical color change, or printed functional inks.",
    mechanicalBreakdown: [
      {
        title: "Polymeric Microencapsulation",
        summary: "Microencapsulation forms a shell around an electronically active internal phase.",
        technicalDetails:
          "The source discusses optical clarity, dielectric strength, impermeability, pressure resistance, and several encapsulation routes; it does not limit the invention to a single capsule size or pigment chemistry.",
      },
      {
        title: "Active Matrix Addressing",
        summary:
          "Electrodes address the encapsulated contrast medium from the top, bottom, or in-plane.",
        technicalDetails:
          "The source labels top and bottom electrodes 100 and 110 for one embodiment and in-plane electrodes 270 and 280 for another; it does not prescribe the later product’s TFT stack or drive voltage.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Electrophoretic particle migration",
        formula: "v_d = \\mu_e E",
        explanation:
          "The grant establishes directional particle migration under an applied electric field; the displayed kernel uses a bounded illustrative mobility and does not claim that the patent reports a measured mobility, switching time, reflectance, or contrast ratio.",
      },
    ],
    whyItMattersToday:
      "The grant’s broader printing-system vision connects addressable contrast media with printed electronics, but later commercial products and their performance are historical context rather than limitations proved by this patent.",
  },
  historicalContext: {
    problemStatement:
      "For decades, engineers sought an electronic screen with the readability, wide viewing angles, and zero-power bistability of printed ink on paper.",
    priorArtLimitations: [
      "Early electrophoretic cells clustered and settled after days",
      "Liquid crystal displays consumed heavy backlight power",
      "Severe eye strain under emissive LCD reading",
    ],
    breakthroughInsight:
      "Jacobson’s claimed move was to treat electronically functional matter as an ink and pair it with patterning methods, including encapsulated contrast media and printed conductors, semiconductors, logic, and actuators.",
    patentWars: [
      {
        rivalName: "Xerox Gyricon / Nick Sheridon",
        rivalClaim: "Rotating bichromal sphere twisting ball display (US Patent 4,126,854)",
        conflictDetails:
          "Xerox developed twisting bichromal beads; E-Ink developed translating sub-micron colloidal particles in liquid microcapsules.",
        resolution:
          "E-Ink achieved much higher optical contrast and resolution, becoming the global commercial standard.",
        legalOutcome:
          "E Ink Corporation commercialized the technology and acquired competing display patents across the 2000s.",
      },
    ],
    civilizationalImpact:
      "The patent supplied a foundational vocabulary for printable electronic structures and addressable contrast media; later electronic-paper products are downstream implementations, not a substitute for the grant’s much wider disclosure.",
  },
  // Withheld until the 16 printed drawing sheets have cloud-reviewed,
  // upright, isolated source crops and exact callout coordinates.
  drawings: [],
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 covers an electrically addressable microcapsule containing two particles with respective charges, where a field of a stated polarity changes the perceived optical property by moving at least one particle in the field-responsive direction.",
      keyInnovations: [
        "Electrically addressable microcapsule",
        "Charged particles",
        "Field-responsive optical change",
      ],
    },
    {
      number: 2,
      isIndependent: false,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 narrows claim 1 by requiring that both charged particles move in response to the applied electric field, rather than leaving movement of only one particle within the capsule sufficient.",
      keyInnovations: ["Two-particle field response", "Capsule-contained contrast medium"],
    },
    {
      number: 3,
      isIndependent: false,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 narrows the charged-particle system by requiring that the first particle itself has a color, making its movement capable of changing the capsule’s perceived optical state.",
      keyInnovations: ["Colored first particle", "Perceived optical property"],
    },
    {
      number: 4,
      isIndependent: false,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 narrows the first colored particle to one that comprises a dye, covering a dye-bearing particle rather than every possible colored particle material.",
      keyInnovations: ["Dye-bearing particle", "Chemical optical material"],
    },
    {
      number: 5,
      isIndependent: false,
      originalText: manualClaimText(5),
      plainEnglish:
        "Claim 5 narrows the first particle to one that further comprises a dye-indicator system, so the optical change can arise from the indicator chemistry associated with that particle.",
      keyInnovations: ["Dye-indicator system", "Particle-associated color response"],
    },
    {
      number: 6,
      isIndependent: false,
      originalText: manualClaimText(6),
      plainEnglish:
        "Claim 6 adds a material in the microcapsule that keeps both particles substantially immobile when no electric field is applied, supplying the claimed field-off stability.",
      keyInnovations: ["Field-off immobilization", "Bistable material state"],
    },
    {
      number: 7,
      isIndependent: false,
      originalText: manualClaimText(7),
      plainEnglish:
        "Claim 7 covers a second particle or substance that can react with the first particle: one field keeps them separate in a first color state, and another field permits reaction into a compound with a second color state.",
      keyInnovations: ["Reactive particle pair", "Field-separated color chemistry"],
    },
    {
      number: 8,
      isIndependent: false,
      originalText: manualClaimText(8),
      plainEnglish:
        "Claim 8 narrows claim 7 so the reacting first particle and substance produce a colored compound when at least one of the first and second electric fields is zero.",
      keyInnovations: ["Zero-field color compound", "Reactive contrast medium"],
    },
    {
      number: 9,
      isIndependent: false,
      originalText: manualClaimText(9),
      plainEnglish:
        "Claim 9 claims a first particle with a charged head coupled to a ring structure and a second charged head coupled to another substance; an electric field separates the ring and substance to produce a first color state.",
      keyInnovations: ["Charged ring structure", "Field-separated reactive substance"],
    },
    {
      number: 10,
      isIndependent: false,
      originalText: manualClaimText(10),
      plainEnglish:
        "Claim 10 adds reversible operation to claim 9: a second electric field brings the ring structure and substance back into contact to produce a second color state.",
      keyInnovations: ["Reversible field addressing", "Second optical color state"],
    },
    {
      number: 11,
      isIndependent: true,
      originalText: manualClaimText(11),
      plainEnglish:
        "Claim 11 independently covers a microencapsulated ink system containing a photoconductive semiconductor particle and a dye-indicator particle, where an applied field causes generated free charge and a first color state.",
      keyInnovations: ["Photoconductive semiconductor particle", "Dye-indicator particle"],
    },
    {
      number: 12,
      isIndependent: true,
      originalText: manualClaimText(12),
      plainEnglish:
        "Claim 12 independently covers a capsule containing a charged hairpin molecule whose oppositely charged moieties can react in a closed conformation for one color and separate in an open conformation for another.",
      keyInnovations: ["Charged hairpin molecule", "Open/closed color states"],
    },
    {
      number: 13,
      isIndependent: false,
      originalText: manualClaimText(13),
      plainEnglish:
        "Claim 13 narrows the molecular embodiment by requiring that the hairpin transition between its open and closed states when an electric field is applied.",
      keyInnovations: ["Electric-field conformational transition", "Hairpin state addressing"],
    },
    {
      number: 14,
      isIndependent: false,
      originalText: manualClaimText(14),
      plainEnglish:
        "Claim 14 further requires an alternating field whose frequency is resonant with a vibrational mode of the two moieties, defining the claimed field-driven conformational transition.",
      keyInnovations: ["Resonant alternating field", "Moiety vibrational mode"],
    },
    {
      number: 15,
      isIndependent: true,
      originalText: manualClaimText(15),
      plainEnglish:
        "Claim 15 independently covers a capsule containing a polymer molecule that has one nonlinear shape in a first field and becomes linear in a second field, separating two moieties to produce a first color state.",
      keyInnovations: ["Nonlinear polymer molecule", "Field-dependent molecular shape"],
    },
    {
      number: 16,
      isIndependent: false,
      originalText: manualClaimText(16),
      plainEnglish:
        "Claim 16 adds a third-field operation: the polymer assumes a second nonlinear shape and causes the first and second moieties to react, producing a second color state.",
      keyInnovations: ["Third-field polymer state", "Reactive moieties"],
    },
    {
      number: 17,
      isIndependent: false,
      originalText: manualClaimText(17),
      plainEnglish:
        "Claim 17 narrows claim 16 by requiring that the first and third electric fields are the same field, tying the two nonlinear-state operations to one shared field condition.",
      keyInnovations: ["Shared first/third field", "Dependent polymer operation"],
    },
    {
      number: 18,
      isIndependent: true,
      originalText: manualClaimText(18),
      plainEnglish:
        "Claim 18 independently covers a capsule containing a non-colored dye-solvent complex that is stable with no field and separates into dye and solvent complexes under an applied field to produce a first color state.",
      keyInnovations: ["Non-colored dye-solvent complex", "Field-induced dissociation"],
    },
  ],
};
