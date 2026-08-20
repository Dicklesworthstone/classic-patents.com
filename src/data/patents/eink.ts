import { eInkArchivalEdition } from "@/data/editions/eInkEdition";
import type { Patent } from "@/types/patent";

export const eInkPatent: Patent = {
  id: "us-6120588-eink",
  patentNumber: "US 6,120,588",
  title: "Electronically Addressable Display with Visually Contrastive Particles and Fluid",
  shortTitle: "E-Ink Microencapsulated Electronic Paper",
  subtitle: "Stokes-Einstein Electrophoretic Drift & Zero-Power Bistable Microcapsules",
  inventors: ["Joseph M. Jacobson", "Barrett Comiskey", "Paul Drzaic"],
  inventorLocation: "Cambridge, Massachusetts",
  grantDate: "2000-09-19",
  filingDate: "1998-04-10",
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
  archivalEdition: eInkArchivalEdition,
  originalText: `UNITED STATES PATENT
Jacobson et al.
Patent No.: US 6,120,588
Date of Patent: Sep. 19, 2000

ELECTRONICALLY ADDRESSABLE DISPLAY WITH VISUALLY CONTRASTIVE PARTICLES AND FLUID
Inventors: Joseph M. Jacobson, Barrett Comiskey, Paul Drzaic
Assignee: E Ink Corporation, Cambridge, MA

ABSTRACT
An electronically addressable display includes a microencapsulated electrophoretic display medium having a dielectric fluid and visually contrastive particles suspended therein. The particles translate under applied electrostatic fields to produce bistable reflective imagery without continuous power consumption.

BACKGROUND OF THE INVENTION
Traditional electronic displays require active emissive illumination or continuous polarizers that suffer from high power drain, narrow viewing angles, and eye fatigue under ambient illumination.

SUMMARY OF THE INVENTION
The present invention provides an electrophoretic display encapsulated in microscopic polymeric shells. Positively charged titanium dioxide white particles and negatively charged carbon black particles are suspended in a low-viscosity dyed or clear fluid, enabling zero-power image retention once particles are positioned at the viewing electrode.

CLAIMS
1. An electrophoretic display comprising: a plurality of microscopic capsules each containing a dielectric fluid and a plurality of charged pigment particles having electrophoretic mobility; a first electrode disposed adjacent a viewing surface of the capsules; and a second electrode disposed opposite the first electrode, wherein application of an electric potential difference between the first and second electrodes causes the charged particles to migrate electrophoretically to alter the optical reflectance of the viewing surface.`,
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
        principle: "Stokes-Einstein Electrophoretic Drift Mobility",
        formula: "v = \\mu_e E = \\frac{q}{6 \\pi \\eta r_p} \\cdot \\frac{V}{d}",
        explanation:
          "Charged colloidal particles translate through viscous dielectric fluid at steady-state terminal velocity where electrostatic force balances hydrodynamic Stokes drag.",
      },
    ],
    whyItMattersToday:
      "E-Ink enabled the Amazon Kindle and modern e-readers, allowing millions of books to be read in direct sunlight on a single battery charge lasting weeks.",
  },
  historicalContext: {
    problemStatement:
      "Early electrophoretic displays invented in the 1970s failed because particles settled to the bottom or clumped together under gravity after a few hundred cycles.",
    priorArtLimitations: [
      "Severe particle agglomeration",
      "Hydrodynamic convection instability",
      "Required heavy continuous battery backlights",
    ],
    breakthroughInsight:
      "Encapsulating the particle suspension in microscopic polymer droplets isolates fluid cells and permanently prevents lateral particle agglomeration.",
    patentWars: [
      {
        rivalName: "Gyricon Media (Xerox PARC)",
        rivalClaim: "Bichromal rotating bead 'electronic reusable paper' (US Patent 4,126,854)",
        conflictDetails:
          "Xerox PARC developed rotating two-tone spherical beads; E Ink developed translational microencapsulated electrophoretic particles.",
        resolution:
          "E-Ink proved vastly superior in resolution, contrast ratio, and manufacturing yield; Xerox shuttered Gyricon in 2005.",
        legalOutcome:
          "E-Ink Corporation achieved monopoly over commercial electrophoretic e-paper displays worldwide.",
      },
    ],
    civilizationalImpact:
      "Created the digital reading revolution and bistable signage, transforming how humanity reads long-form literature digitally.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "An electrophoretic display comprising: a plurality of microscopic capsules each containing a dielectric fluid and a plurality of charged pigment particles having electrophoretic mobility; a first electrode disposed adjacent a viewing surface of the capsules; and a second electrode disposed opposite the first electrode, wherein application of an electric potential difference between the first and second electrodes causes the charged particles to migrate electrophoretically to alter the optical reflectance of the viewing surface.",
      plainEnglish:
        "An electronic screen made of tiny liquid capsules with charged black and white particles that move to form text when given an electric pulse.",
      keyInnovations: [
        "Polymeric microencapsulation of electrophoretic suspensions",
        "Bistable dual-pigment Stokes-Einstein drift mobility",
        "High-contrast ambient reflective electronic paper",
      ],
    },
  ],
  drawings: [],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
  },
  tags: ["display", "materials", "e-ink", "kindle", "mit media lab"],
};
