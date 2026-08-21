import type { Patent } from "@/types/patent";
import { einkArchivalEdition } from "../editions/eInkEdition";

export const eInkPatent: Patent = {
  id: "us-6120588-eink",
  patentNumber: "US 6,120,588",
  title: "Electronically Addressable Display with Visually Contrastive Particles and Fluid",
  shortTitle: "E-Ink Microencapsulated Electronic Paper",
  subtitle: "Stokes-Einstein Electrophoretic Drift & Zero-Power Bistable Microcapsules",
  inventors: ["Joseph M. Jacobson", "Barrett Comiskey", "Jonathan D. Albert"],
  inventorLocation: "Cambridge, Massachusetts",
  grantDate: "2000-09-19",
  filingDate: "1998-08-27",
  era: "Internet & Modern Computing (1990–Present)",
  category: "materials",
  categoryLabel: "Optoelectronics & Electronic Paper",
  summary:
    "The Invention of Electronic Paper: Originating from the MIT Media Lab and commercialized by E Ink Corporation, US Patent 6,120,588 solved the long-standing challenge of paper-like digital displays. By encapsulating charged white titanium dioxide particles and black carbon particles in microscopic fluid-filled polymeric shells, E-Ink enabled paper-like reflective reading with zero steady-state power consumption.",
  heroQuote:
    "Charged pigment particles suspended in microcapsules migrate electrophoretically under an applied electric field to alter the optical reflectance of electronic paper.",
  originalPdfUrl: "/patents/pdfs/us-6120588-eink.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6120588A/en",
  usptoClassification: "G02F 1/167 (Electrophoretic displays; Electronic ink)",
  archivalEdition: einkArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-6120588-eink-reviewed.txt",
    pageCount: 26,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Antigravity)",
    reviewedAt: "2026-08-20",
    sourcePdfSha256: "574678473ca13e7daaeb661cfd96808fffb6c16d06d86872923fec52a08ab324",
  },
  originalText: `UNITED STATES PATENT
Jacobson et al.
Patent No.: US 6,120,588
Date of Patent: Sep. 19, 2000

ELECTRONICALLY ADDRESSABLE DISPLAY WITH VISUALLY CONTRASTIVE PARTICLES AND FLUID
Inventors: Joseph M. Jacobson, Barrett Comiskey, Jonathan D. Albert
Assignee: E Ink Corporation, Cambridge, MA

ABSTRACT
An electronically addressable display includes a microencapsulated electrophoretic display medium having a dielectric fluid and visually contrastive particles suspended therein. The particles translate under applied electrostatic fields to produce bistable reflective imagery without continuous power consumption.

BACKGROUND OF THE INVENTION
Traditional electronic displays require active emissive illumination or continuous polarizers that suffer from high power drain, narrow viewing angles, and eye fatigue under ambient illumination.

SUMMARY OF THE INVENTION
The present invention provides an electrophoretic display encapsulated in microscopic polymeric shells. Positively charged titanium dioxide white particles and negatively charged carbon black particles are suspended in a low-viscosity dyed or clear fluid, enabling zero-power image retention once particles are positioned at the viewing electrode.

CLAIMS
1. An electrically addressable ink comprising a microcapsule, said microcapsule containing a dielectric fluid, a first particle, and a second particle, wherein said first particle and said second particle are suspended in said dielectric fluid and wherein said first particle has an electrical charge which is opposite in polarity to the electrical charge of said second particle, such that upon application of a first electric field, said first particle and said second particle translate within said microcapsule in opposite directions.`,
  plainEnglishExplanation: {
    overview:
      "E-Ink creates high-contrast electronic paper that reflects ambient light naturally like real ink on paper, using zero battery power to hold a static image.",
    coreMechanism:
      "Millions of microscopic capsules contain charged white and black pigment particles in clear fluid. Applying an electric field drives opposite charges toward or away from the viewing surface.",
    mechanicalBreakdown: [
      {
        title: "Polymeric Microencapsulation",
        summary: "50-micron diameter spherical polymer shells suspend the colloidal fluid.",
        technicalDetails:
          "Prevents particle settling, clustering, and fluid migration, allowing flexible printed display manufacturing.",
      },
      {
        title: "Active Matrix Addressing",
        summary:
          "Top transparent ITO glass electrode paired with bottom pixel transistor electrodes.",
        technicalDetails:
          "Applying +15V or -15V pulses switches pixels between reflective white state and absorptive black state.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Electrophoresis & Stokes-Einstein Particle Mobility",
        formula: "v = \\mu_e E = \\frac{\\epsilon_r \\epsilon_0 \\zeta}{\\eta} E",
        explanation:
          "Electrophoretic drift velocity v depends on solvent permittivity, zeta potential zeta, viscosity eta, and applied field E, providing ~100ms optical switching.",
      },
    ],
    whyItMattersToday:
      "E-Ink enabled the modern e-reader revolution (Amazon Kindle, Kobo) and created the ultra-low-power electronic paper industry.",
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
      "Joseph Jacobson and MIT Media Lab researchers realized that encapsulating electrophoretic fluids in micro-droplets prevented agglomeration and allowed printing on flexible substrates.",
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
      "E-Ink liberated digital reading from power cords and glowing screens, making hundreds of thousands of books portable in sunlight-readable e-readers.",
  },
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Microcapsule Cross-Sectional Diagram",
      caption: "Cross-section showing dual charged pigment particles in dielectric carrier fluid.",
      svgType: "eink",
      callouts: [
        {
          id: "ei-capsule",
          figureRef: "Fig. 1",
          label: "10",
          element: "Polymer Microcapsule Shell",
          description: "Transparent spherical micro-shell containing electrophoretic fluid.",
          x: 50,
          y: 50,
        },
        {
          id: "ei-white-particle",
          figureRef: "Fig. 1",
          label: "16",
          element: "Positively Charged TiO2 Particle",
          description: "White light-scattering nanoparticle.",
          x: 40,
          y: 30,
        },
        {
          id: "ei-black-particle",
          figureRef: "Fig. 1",
          label: "18",
          element: "Negatively Charged Carbon Particle",
          description: "Black light-absorbing nanoparticle.",
          x: 60,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Dual-Particle Optical State Transitions",
      caption:
        "Diagram showing white and black optical states under positive and negative electric fields.",
      svgType: "eink",
      callouts: [
        {
          id: "ei-white-state",
          figureRef: "Fig. 2",
          label: "White",
          element: "Reflective White State",
          description: "White particles drawn to top viewing electrode.",
          x: 30,
          y: 50,
        },
        {
          id: "ei-dark-state",
          figureRef: "Fig. 2",
          label: "Dark",
          element: "Absorptive Dark State",
          description: "Black particles drawn to top viewing electrode.",
          x: 70,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Active-Matrix Display Backplane",
      caption:
        "Schematic diagram of thin-film transistor array driving individual microencapsulated pixels.",
      svgType: "eink",
      callouts: [
        {
          id: "ei-tft",
          figureRef: "Fig. 3",
          label: "22",
          element: "TFT Backplane Substrate",
          description: "Thin-film transistor array applying independent voltage to each pixel.",
          x: 50,
          y: 80,
        },
      ],
    },
  ],
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "An electrically addressable ink comprising a microcapsule, said microcapsule comprising: a first particle having a first charge; and a second particle having a second charge; wherein applying an electric field having a first polarity to said microcapsule effects a perceived optical property change by causing one of said first and second particles to migrate in a direction responsive to said field.",
      plainEnglish:
        "An electrically addressable ink comprising a microcapsule, dielectric fluid, and oppositely charged first and second particles.",
      keyInnovations: [
        "Microencapsulated electrophoretic ink",
        "Dual-particle colloidal system",
        "Opposing charge mobility",
      ],
    },
    {
      number: 2,
      isIndependent: false,
      originalText:
        "The ink of claim 1 wherein both said first and said second particles move in response to said electric field.",
      plainEnglish: "Both first and second particles are suspended within the microcapsule.",
      keyInnovations: ["Colloidal dual suspension", "Enclosed carrier fluid"],
    },
    {
      number: 3,
      isIndependent: false,
      originalText: "The ink of claim 1 wherein said first particle has a color.",
      plainEnglish: "First particle has a distinct optical color.",
      keyInnovations: ["Color contrast pigment", "Chromatic particle tuning"],
    },
    {
      number: 4,
      isIndependent: false,
      originalText: "The ink of claim 1 wherein said first particle comprises a dye.",
      plainEnglish: "First particle comprises a dye.",
      keyInnovations: ["Dye-based pigment particle", "Organic dye encapsulation"],
    },
    {
      number: 5,
      isIndependent: false,
      originalText:
        "The ink of claim 1 wherein the first particle further comprises a dye indicator system.",
      plainEnglish: "First particle comprises a retroreflective material.",
      keyInnovations: ["Retroreflective optical elements", "High-luminance reflective response"],
    },
    {
      number: 6,
      isIndependent: false,
      originalText:
        "The ink of claim 1 wherein said microcapsule further comprises a material such that said first and second particles are substantially immobile in the absence of an electric field.",
      plainEnglish: "Microcapsule further contains a dyed suspending fluid.",
      keyInnovations: ["Contrast-dyed carrier liquid", "Single-particle absorption"],
    },
    {
      number: 7,
      isIndependent: false,
      originalText:
        "The ink of claim 1 wherein said second particle comprises a substance capable of reacting with said first particle, whereupon the application of a first electric field causes said first particle to be maintained separate from said substance such that said ink is maintained in a first color state; and whereupon application of a second electric field said first particle and said substance react to form a com- pound having a second color state.",
      plainEnglish: "Second particle comprises a substrate with a dyed coating.",
      keyInnovations: ["Coated core-shell particles", "Surface-modified pigments"],
    },
    {
      number: 8,
      isIndependent: false,
      originalText:
        "The ink of claim 7 wherein said first particle and said substance react to form a compound having a color state when at least one of said first and second electric fields is zero. 6,120,588 13",
      plainEnglish: "First and second particles have visually contrastive optical properties.",
      keyInnovations: ["High-contrast complementary pigments", "Black/white optical switching"],
    },
    {
      number: 9,
      isIndependent: false,
      originalText:
        "The ink of claim 1 wherein said first particle comprises a ring structure coupled to a first head having a first charge, and said second particle comprises a substance coupled to a second head having a second charge; wherein application of an electric field causes said ring structure and said substance to become separated from each other, effecting a first color state.",
      plainEnglish: "First particle comprises a reflective particle.",
      keyInnovations: ["Titanium dioxide white scatterer", "Lambertian reflectance"],
    },
    {
      number: 10,
      isIndependent: false,
      originalText:
        "The ink of claim 9 wherein application of a second electric field brings said ring structure and said substance into contact to effect a second color state.",
      plainEnglish:
        "Application of a second electric field reverses the translation direction of particles.",
      keyInnovations: ["Reversible polarity switching", "Bipolar field electrophoresis"],
    },
    {
      number: 11,
      isIndependent: true,
      originalText:
        "A microencapsulated ink system, comprising: a microcapsule comprising: a photoconductive semiconductor particle; and a dye indicator particle; wherein the application of an electric field to said micro- capsule causes said photoconductive semiconductor particle to generate free charge, causing the dye indi- cator to effect a first color state.",
      plainEnglish:
        "A microencapsulated ink system comprising microcapsules containing charged particles and a binder.",
      keyInnovations: ["Coatable ink binder emulsion", "Printable electronic paper"],
    },
    {
      number: 12,
      isIndependent: true,
      originalText:
        "An electrically addressable ink comprising a microcapsule, said microcapsule comprising: a hairpin-shaped molecule having a first portion and a second portion, said hair-pin shaped molecule compris- ing: a first moiety having a first charge attached to said first portion of said hairpin-shaped molecule; and a second moiety having a second charge attached to said second portion of said hairpin-shaped molecule, said second moiety capable of reacting with said first moiety, said second charge being opposite to said first charge; the reaction between said first moiety and said second moiety defining a closed state of said hairpin-shaped molecule effecting a first color state; and the separation of said first moiety from said second moiety defining an open state of said hairpin-shaped molecule, effecting a second color state. 10 15 20 25 30 14",
      plainEnglish:
        "An electrically addressable ink comprising a microcapsule and a hairpin-shaped molecule.",
      keyInnovations: ["Molecular conformational switching", "Nanoscale electrophoretic dipole"],
    },
    {
      number: 13,
      isIndependent: false,
      originalText:
        "The ink of claim 12 wherein said hairpin-shaped molecule transitions between open and closed states upon application of an electric field.",
      plainEnglish:
        "Hairpin-shaped molecule translates within the capsule under an electric field.",
      keyInnovations: ["Electric-field molecular transport", "Macromolecular orientation"],
    },
    {
      number: 14,
      isIndependent: false,
      originalText:
        "The ink of claim 13 wherein said hairpin-shaped molecule transitions between open and closed states upon application of an alternating field having a frequency reso- nant with the vibrational mode of the first and second moieties.",
      plainEnglish:
        "Hairpin-shaped molecule translation alters the visual state of the microcapsule.",
      keyInnovations: ["Bistable molecular optical states", "Conformational contrast switching"],
    },
    {
      number: 15,
      isIndependent: true,
      originalText:
        "An electronically addressable ink comprising a microcapsule, said microcapsule comprising: a polymer molecule having a first non-linear shape in the presence of a first electric field, said polymer molecule comprising: a first moiety attached to a first location; and a second moiety attached to a second location; wherein the application of a second electric field causes said polymer molecule to assume a linear shape, sepa- rating said first and second moities to effect a first color state.",
      plainEnglish:
        "An electronically addressable ink with particles capable of displaying multiple distinct colors.",
      keyInnovations: ["Multi-chromatic particle electrophoresis", "Full-color electronic paper"],
    },
    {
      number: 16,
      isIndependent: false,
      originalText:
        "The ink of claim 15, wherein the application of a third electric field causes causing the polymer molecule to assume a second non-linear shape, causing said first and second moieties to react to effect a second color state.",
      plainEnglish: "Application of a third electric field displays a third optical color state.",
      keyInnovations: ["Multi-threshold voltage addressing", "Three-state optical switching"],
    },
    {
      number: 17,
      isIndependent: false,
      originalText:
        "The ink of claim 16, wherein said first and third electric fields are the same field.",
      plainEnglish:
        "First and third electric fields have opposite polarities and distinct magnitudes.",
      keyInnovations: ["Magnitude-and-polarity tiered driving", "Tri-level voltage control"],
    },
    {
      number: 18,
      isIndependent: true,
      originalText:
        "An electrically addressable medium comprising a microcapsule, said microcapsule further comprising a non- colored dye solvent complex, said dye solvent complex being stable when no electric field is applied and wherein applying an electric field causes said dye solvent complex to separate into a dye complex and a solvent complex, effecting a first color state.",
      plainEnglish:
        "An electrically addressable medium comprising microcapsules disposed on a substrate.",
      keyInnovations: ["Printed electronic paper substrate", "Roll-to-roll coated display medium"],
    },
  ],
};
