import { hullStereolithographyArchivalEdition } from "@/data/editions/hullStereolithographyEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = hullStereolithographyArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Hull Stereolithography manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const hullStereolithographyPatent: Patent = {
  id: "us-4575330-hull-stereolithography",
  patentNumber: "US 4,575,330",
  title: "Apparatus for Production of Three-Dimensional Objects by Stereolithography",
  shortTitle: "Chuck Hull 3D Printing / Stereolithography (SLA)",
  subtitle:
    "Ultraviolet Photopolymer Cross-Linking, Galvanometer Laser Vector Scanning, and Layer-by-Layer Additive Build Platform",
  inventors: ["Charles W. Hull"],
  inventorLocation: "Arcadia, California",
  grantDate: "1986-03-11",
  filingDate: "1984-08-08",
  era: "Computing & Digital (1970–Present)",
  category: "computing",
  categoryLabel: "Additive Manufacturing & 3D Printing",
  summary:
    "Charles W. (Chuck) Hull's landmark 1986 patent launched the entire modern 3D printing and additive manufacturing industry: an apparatus that generates solid three-dimensional plastic parts directly from computer slice data by scanning a focused ultraviolet laser spot across a vat of liquid photopolymer resin to cure successive laminar cross-sections upon an elevator build platform.",
  heroQuote:
    "Stereolithography provides an automated bridge between computer-aided design (CAD) and physical component manufacturing, replacing weeks of manual machining with direct additive fabrication in hours.",
  originalPdfUrl: "/patents/pdfs/us-4575330-hull-stereolithography.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4575330A/en",
  usptoClassification: "425/174.4",

  originalTextAsset: {
    url: "/patents/transcripts/us-4575330-hull-stereolithography-reviewed.txt",
    pageCount: 16,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "5dc2211b18f88883ee92394917154d57d102b73c26a4744332cbf0d89b1db1c7",
  },

  archivalEdition: hullStereolithographyArchivalEdition,

  originalText: `This invention relates generally to improvements in methods and apparatus for forming three-dimensional objects from a fluid medium and, more particularly, to a new and improved system for stereolithography involving the application of synergistic stimulation, such as ultraviolet light, to a fluid medium to successively solidify thin cross-sectional laminae of the object, each lamina being integrated with the previous lamina to build up the desired three-dimensional object in a step-wise laminar fashion.

It is common practice in the production of more desirable products to design, build and test various prototypes before finalizing manufacturing specifications. However, the production of such prototypes has traditionally been extremely slow, tedious and expensive, requiring skilled craftsmen to machine, cast or fabricate models by hand over weeks or months. Prior attempts to generate solid objects from photopolymer resins (such as Swainson U.S. Pat. Nos. 4,041,476 and 4,238,840) required the simultaneous intersection of two laser beams deep within a transparent body, suffering from severe positioning instability, long exposure times, and poor spatial resolution.`,

  plainEnglishExplanation: {
    overview:
      "Before Chuck Hull invented stereolithography in 1983–1984, fabricating a physical prototype of a new mechanical part took weeks or months of expensive tooling, manual clay/wood sculpting, or subtractive CNC machining. Hull conceived the revolutionary concept of additive manufacturing: building a part layer-by-layer from a liquid vat. In stereolithography (SLA), a computer slices a 3D digital CAD model into hundreds of thin horizontal cross-sections (typically 0.05–0.25 mm thick). A computer-directed ultraviolet (UV) laser beam traces each slice pattern across the surface of a vat containing liquid photopolymer resin. Where the UV light strikes the resin, photosensitive monomers undergo rapid cross-linking into a rigid solid acrylic or epoxy plastic. An elevator platform beneath the surface then drops by one layer thickness, allowing unreacted liquid resin to recoat the top surface before the laser draws the subsequent layer, chemically bonding it to the layer beneath.",
    coreMechanism:
      "The stereolithography apparatus comprises four integrated subsystems: (1) a vat holding liquid acrylic/epoxy photopolymer; (2) an elevator platform submerged in the vat and actuated by a precision z-axis lead screw; (3) a continuous-wave UV laser (e.g. HeCd at 325 nm or solid-state at 355 nm) directed by orthogonal X-Y galvanometer mirrors; and (4) a computer control unit that parses sliced CAD vector boundaries. Laser exposure E(x,y) follows a Gaussian irradiance profile modulated by scan velocity v_s. According to the Beer-Lambert photopolymerization law, curing depth C_d = D_p * ln(E_max / E_c), where D_p is resin penetration depth and E_c is critical exposure threshold. Regulating laser scan speed ensures that C_d exceeds the elevator slice step delta_z, creating parabolic cross-sectional cure profiles with strong interlaminar molecular bonding.",
    mechanicalBreakdown: [
      {
        title: "UV Laser & Galvanometer Optical Scanning Engine",
        summary:
          "High-speed dual-axis optical galvanometer mirrors deflecting a focused UV laser beam across the liquid resin surface.",
        technicalDetails:
          "A continuous-wave ultraviolet laser beam (spot diameter 2w_0 = 0.20–0.25 mm) passes through an acousto-optic shutter and beam expander before reflecting off two high-bandwidth moving-magnet galvanometer mirrors (X and Y axes). The scanning mirrors deflect the beam across the vat surface at linear velocities up to 5.0 m/s with sub-micron repeatability, controlled via closed-loop PID servo boards receiving vector coordinate lists from the sliced CAD slice compiler.",
        archaicTerm:
          "reaction means for selectively applying synergistic stimulation in a prescribed pattern",
        modernEquivalent: "galvanometer laser optical scanning engine",
      },
      {
        title: "Submerged Elevator Build Platform",
        summary:
          "Precision z-axis stepper/servo elevator translating the perforated build plate downward into the resin vat.",
        technicalDetails:
          "An anodized perforated aluminium platform is suspended inside the resin vat on a precision ground ball screw with anti-backlash nut. After a layer is cured, the elevator descends by delta_z (typically 50 to 150 um). A motorized recoater blade sweeps across the surface to level viscous resin, establishing a flat, uniform fluid meniscus across the build area within seconds.",
        archaicTerm:
          "translational means for moving said object as it is formed away from said designated surface",
        modernEquivalent: "z-axis elevator build platform and recoater blade",
      },
      {
        title: "Photopolymer Resin Vat & Chemistry",
        summary:
          "Liquid resin formulation containing liquid acrylate/epoxy oligomers, cross-linking monomers, and UV photoinitiators.",
        technicalDetails:
          "The vat holds a fluid medium with optical penetration depth D_p = 0.12–0.18 mm and critical exposure threshold E_c = 8.5–12.0 mJ/cm^2. Under actinic UV irradiation (lambda = 325–355 nm), photoinitiators generate free radicals or cations that trigger cascade chain-growth polymerization, transforming the liquid into a cross-linked polymer network in milliseconds while unexposed resin remains fluid.",
        archaicTerm:
          "fluid medium capable of altering its physical state in response to synergistic stimulation",
        modernEquivalent: "UV-curable photopolymer resin vat",
      },
      {
        title: "Bottom-Up Immiscible Fluid Interface",
        summary:
          "Alternative inverted stereolithography apparatus exposing through an optically clear vat bottom.",
        technicalDetails:
          "In the bottom-up configuration (FIG. 4 & 5), UV radiation enters through a transparent glass/quartz container base. An immiscible, dense non-reactive liquid layer (such as fluorocarbon fluid or heavy water) provides an inert boundary that prevents the curing plastic from adhering to the container window, allowing the elevator to pull the newly solidified part upward out of the vat.",
        archaicTerm:
          "container wherein exposure is through the bottom and a second non-reactive medium",
        modernEquivalent:
          "inverted bottom-up vat photopolymerization with non-stick release interface",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Beer-Lambert Law of Photopolymerization Curing Depth",
        formula:
          "C_d = D_p \\ln\\left( \\frac{E_{\\text{max}}}{E_c} \\right) \\quad \\text{with} \\quad E_{\\text{max}} = \\sqrt{\\frac{2}{\\pi}} \\frac{P_L}{w_0 v_s}",
        explanation:
          "Actinic UV radiant energy decays exponentially with resin depth z according to the Beer-Lambert absorption law: E(z) = E_max * exp(-z / D_p). A gelled polymer network forms only where exposure exceeds the critical threshold E_c. The resulting cure depth C_d must be tuned via laser power P_L and scan speed v_s to exceed layer thickness delta_z by 20–40% to guarantee interlaminar adhesion.",
      },
      {
        principle: "Gaussian Laser Beam Radiant Exposure Distribution",
        formula:
          "E(x,y) = \\sqrt{\\frac{2}{\\pi}} \\frac{P_L}{w_0 v_s} \\exp\\left( -\\frac{2 y^2}{w_0^2} \\right)",
        explanation:
          "A fundamental TEM_00 laser beam possesses a Gaussian intensity profile with beam radius w_0. Moving the beam in the x-direction at constant velocity v_s integrates radiant exposure along y, yielding a parabolic cured line cross-section with width L_w = w_0 * sqrt(2 * ln(E_max / E_c)).",
      },
      {
        principle: "Interlaminar Chemical Cross-Linking & Gel Point Conversion",
        formula:
          "W_{\\text{interlayer}} = \\int_0^{C_d - \\Delta z} G_{\\text{shear}}(\\alpha_{\\text{conversion}}) \\, dz \\quad \\text{where} \\quad \\alpha \\ge \\alpha_{\\text{gel}} \\approx 0.55",
        explanation:
          "Polymer cross-link density grows monotonically with radiant dose above the gel point alpha_gel. Overcuring each layer past its step depth delta_z allows reactive acrylate/epoxy functional groups to bridge across the layer interface, chemically integrating successive laminae into a monolithic solid part.",
      },
    ],
    whyItMattersToday:
      "Chuck Hull's invention of stereolithography created the $30+ billion global additive manufacturing and 3D printing industry. Hull co-founded 3D Systems, created the universal STL (.stl) file format used by all 3D printers, and established the layer-by-layer paradigm that underlies subsequent technologies including SLS (Selective Laser Sintering), FDM (Fused Deposition Modeling), and metal SLM (Selective Laser Melting). SLA is used in aerospace manufacturing, medical prosthetics, dental aligners (Invisalign), automotive prototyping, hearing aids, and micro-fluidics.",
  },

  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "A foundational system for producing a 3D object from a curable fluid medium by drawing successive cross-sectional laminae at a 2D interface and translating the growing object away from the interface in stepwise fashion to build up the object.",
      keyInnovations: [
        "Layer-by-layer cross-sectional lamina drawing at a 2D interface",
        "Stepwise translation of growing part away from interface",
        "Extracting 3D solid object from 2D fluid surface",
      ],
      legalSignificance:
        "The broadest independent apparatus claim protecting the fundamental additive manufacturing architecture: slicing a 3D object into 2D layers and building it up stepwise from a fluid surface.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "A stereolithography system with a vat holding curable liquid, a reaction source applying synergistic stimulation in a prescribed pattern to only a thin surface layer, and an elevator translating the object to expose fresh liquid for subsequent layers.",
      keyInnovations: [
        "Liquid photopolymer container with designated surface",
        "Patterned synergistic stimulation restricted to thin surface layer",
        "Translational elevator refreshing working surface layer-by-layer",
      ],
      legalSignificance:
        "The primary apparatus claim specifying the container, surface reaction mechanism, and elevator build platform of modern stereolithography.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(3),
      plainEnglish:
        "The system of claim 2 wherein the reaction means is a source of impinging radiation.",
      keyInnovations: ["Impinging radiation energy source"],
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(4),
      plainEnglish:
        "The system of claim 2 wherein the reaction means is a focused beam of impinging radiation.",
      keyInnovations: ["Focused radiation beam"],
    },
    {
      number: 5,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(5),
      plainEnglish: "The system of claim 2 wherein the reaction means is an electron beam.",
      keyInnovations: ["Electron beam stimulation"],
    },
    {
      number: 6,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(6),
      plainEnglish:
        "The system of claim 2 wherein the reaction means is a beam of high energy particles.",
      keyInnovations: ["High energy particle beam"],
    },
    {
      number: 7,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(7),
      plainEnglish: "The system of claim 2 wherein the reaction means is a beam of light.",
      keyInnovations: ["Optical light beam"],
    },
    {
      number: 8,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(8),
      plainEnglish: "The system of claim 2 wherein the reaction means uses X-rays.",
      keyInnovations: ["X-ray photocurable reaction means"],
    },
    {
      number: 9,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(9),
      plainEnglish:
        "The system of claim 2 wherein the reaction means is a focused beam of ultraviolet light.",
      keyInnovations: ["Ultraviolet (UV) laser beam"],
      legalSignificance:
        "Protects the standard commercial stereolithography configuration using focused UV laser beams.",
    },
    {
      number: 10,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(10),
      plainEnglish:
        "The system of claim 2 wherein the reaction means is a jet of reactive chemical that induces solidification.",
      keyInnovations: ["Chemical jet reaction mechanism"],
    },
    {
      number: 11,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(11),
      plainEnglish:
        "The system of claim 2 using a patterned mask overlying the surface for selectively applying a solidification chemical.",
      keyInnovations: ["Patterned chemical mask"],
    },
    {
      number: 12,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(12),
      plainEnglish:
        "The system of claim 2 using a patterned mask overlying the surface for selectively exposing the resin to synergistic stimulation.",
      keyInnovations: ["Photomask exposure system"],
    },
    {
      number: 13,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(13),
      plainEnglish:
        "The system of claim 2 using a patterned mask overlying the surface for selectively exposing the resin to radiation.",
      keyInnovations: ["Radiation exposure mask"],
    },
    {
      number: 14,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(14),
      plainEnglish:
        "The system of claim 2 wherein the elevator translates the object downward into the liquid medium as layers are formed.",
      keyInnovations: ["Top-down dipping elevator mechanism"],
      legalSignificance: "Protects the classic top-down SLA dipping elevator motion.",
    },
    {
      number: 15,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(15),
      plainEnglish:
        "The system of claim 2 wherein the elevator translates the object upward and out of the fluid medium as layers are formed.",
      keyInnovations: ["Bottom-up pulling elevator mechanism"],
      legalSignificance:
        "Protects the bottom-up inverted pull-up SLA configuration used in modern desktop 3D printers (e.g. Formlabs).",
    },
    {
      number: 16,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(16),
      plainEnglish:
        "The system of claim 2 wherein exposure occurs through a second non-reactive medium.",
      keyInnovations: ["Non-reactive optical buffer medium"],
    },
    {
      number: 17,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(17),
      plainEnglish:
        "The system of claim 2 wherein exposure is directed through the bottom of the container through an adjacent non-reactive medium.",
      keyInnovations: ["Bottom-window exposure through non-reactive medium"],
    },
    {
      number: 18,
      isIndependent: false,
      dependsOn: [17],
      originalText: manualClaimText(18),
      plainEnglish:
        "The system of claim 17 wherein the second non-reactive medium is heavy water (deuterium oxide).",
      keyInnovations: ["Heavy water immiscible interface layer"],
    },
    {
      number: 19,
      isIndependent: false,
      dependsOn: [17],
      originalText: manualClaimText(19),
      plainEnglish:
        "The system of claim 17 wherein the second non-reactive medium is ethylene glycol.",
      keyInnovations: ["Ethylene glycol interface layer"],
    },
    {
      number: 20,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(20),
      plainEnglish:
        "The system of claim 2 further adding rotational articulation to alter the orientation of the object relative to the build surface.",
      keyInnovations: ["Multi-axis rotational build platform"],
    },
    {
      number: 21,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(21),
      plainEnglish:
        "The system of claim 2 wherein the level of the fluid medium locating the designated surface is variable.",
      keyInnovations: ["Variable resin liquid level control"],
    },
    {
      number: 22,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(22),
      plainEnglish:
        "The system of claim 2 wherein the level of the fluid medium locating the designated surface is maintained constant.",
      keyInnovations: ["Constant resin liquid level regulation"],
    },
    {
      number: 23,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(23),
      plainEnglish:
        "The system of claim 2 wherein the translational means has multiple degrees of freedom of movement.",
      keyInnovations: ["Multi-DOF translational build mechanism"],
    },
    {
      number: 24,
      isIndependent: false,
      dependsOn: [4],
      originalText: manualClaimText(24),
      plainEnglish:
        "The system of claim 4 wherein precise optical focus of the radiation beam upon the designated surface is maintained.",
      keyInnovations: ["Dynamic beam focal length control"],
    },
    {
      number: 25,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(25),
      plainEnglish:
        "The system of claim 2 wherein the pattern is formed by radiation emanating from the face of a cathode ray tube (CRT).",
      keyInnovations: ["CRT faceplate direct exposure"],
    },
    {
      number: 26,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(26),
      plainEnglish:
        "The system of claim 2 wherein the pattern is formed by light directly emanating from a phosphor image.",
      keyInnovations: ["Phosphor image optical exposure"],
    },
    {
      number: 27,
      isIndependent: true,
      originalText: manualClaimText(27),
      plainEnglish:
        "A system for directly producing a 3D object designed by a computer by deriving graphic cross-sections from the computer, drawing the cross-sections at a 2D interface, and moving the cross-sections stepwise to extract the object automatically.",
      keyInnovations: [
        "Direct CAD digital-to-physical manufacturing pipeline",
        "Deriving graphic slice cross-sections from computer model",
        "Automated extraction of 3D object from 2D interface",
      ],
      legalSignificance:
        "Foundational independent claim protecting direct CAD-to-solid additive manufacturing without intermediate tooling.",
    },
    {
      number: 28,
      isIndependent: true,
      originalText: manualClaimText(28),
      plainEnglish:
        "An improved system for producing a 3D object from a fluid medium by irradiating a designated surface to provide integrated, successive surface laminae that together define the 3D object.",
      keyInnovations: [
        "Surface irradiation of fluid medium",
        "Integrated successive surface laminae formation",
      ],
      legalSignificance:
        "Broad independent system claim covering surface radiation curing of integrated laminae.",
    },
    {
      number: 29,
      isIndependent: true,
      originalText: manualClaimText(29),
      plainEnglish:
        "An improved system comprising a fluid medium, a radiation source impinging radiation in a selected pattern to provide a thin solid cross-sectional lamina only at the surface, and means for combining successive adjacent laminae into a 3D object.",
      keyInnovations: [
        "Patterned radiation restricted to surface layer",
        "Thin solid cross-sectional lamina generation",
        "Combining successive laminae into monolithic object",
      ],
      legalSignificance:
        "Broad independent claim protecting patterned surface radiation curing and layer combination.",
    },
    {
      number: 30,
      isIndependent: false,
      dependsOn: [29],
      originalText: manualClaimText(30),
      plainEnglish:
        "The system of claim 29 wherein the radiation source includes a beam of impinging radiation.",
      keyInnovations: ["Impinging radiation beam"],
    },
    {
      number: 31,
      isIndependent: false,
      dependsOn: [29],
      originalText: manualClaimText(31),
      plainEnglish:
        "The system of claim 29 wherein the radiation source includes an electron beam.",
      keyInnovations: ["Electron beam radiation source"],
    },
    {
      number: 32,
      isIndependent: false,
      dependsOn: [29],
      originalText: manualClaimText(32),
      plainEnglish:
        "The system of claim 29 wherein the radiation source includes a beam of high energy particles.",
      keyInnovations: ["High energy particle beam source"],
    },
    {
      number: 33,
      isIndependent: false,
      dependsOn: [29],
      originalText: manualClaimText(33),
      plainEnglish: "The system of claim 29 wherein the radiation source includes a beam of light.",
      keyInnovations: ["Light beam radiation source"],
    },
    {
      number: 34,
      isIndependent: false,
      dependsOn: [29],
      originalText: manualClaimText(34),
      plainEnglish:
        "The system of claim 29 wherein the radiation source includes a beam of ultraviolet light.",
      keyInnovations: ["Ultraviolet laser beam source"],
    },
    {
      number: 35,
      isIndependent: false,
      dependsOn: [29],
      originalText: manualClaimText(35),
      plainEnglish: "The system of claim 29 wherein the radiation source includes X-rays.",
      keyInnovations: ["X-ray radiation source"],
    },
    {
      number: 36,
      isIndependent: false,
      dependsOn: [29],
      originalText: manualClaimText(36),
      plainEnglish:
        "The system of claim 29 using a patterned mask for selectively exposing the surface to synergistic stimulation.",
      keyInnovations: ["Patterned mask for synergistic stimulation"],
    },
    {
      number: 37,
      isIndependent: false,
      dependsOn: [29],
      originalText: manualClaimText(37),
      plainEnglish:
        "The system of claim 29 using a patterned mask selectively exposing the surface to radiation.",
      keyInnovations: ["Patterned radiation mask"],
    },
    {
      number: 38,
      isIndependent: false,
      dependsOn: [29],
      originalText: manualClaimText(38),
      plainEnglish:
        "The system of claim 29 wherein exposure to radiation is through a second non-reactive medium.",
      keyInnovations: ["Non-reactive optical buffer layer"],
    },
    {
      number: 39,
      isIndependent: false,
      dependsOn: [29],
      originalText: manualClaimText(39),
      plainEnglish:
        "The system of claim 29 wherein exposure is through the bottom of the container and an adjacent second non-reactive medium.",
      keyInnovations: ["Bottom-up radiation exposure through container base"],
    },
    {
      number: 40,
      isIndependent: false,
      dependsOn: [39],
      originalText: manualClaimText(40),
      plainEnglish: "The system of claim 39 wherein the second non-reactive medium is heavy water.",
      keyInnovations: ["Heavy water release medium"],
    },
    {
      number: 41,
      isIndependent: false,
      dependsOn: [39],
      originalText: manualClaimText(41),
      plainEnglish:
        "The system of claim 39 wherein the second non-reactive medium is ethylene glycol.",
      keyInnovations: ["Ethylene glycol release medium"],
    },
    {
      number: 42,
      isIndependent: false,
      dependsOn: [39],
      originalText: manualClaimText(42),
      plainEnglish:
        "The system of claim 39 wherein the liquid level locating the designated surface is maintained constant.",
      keyInnovations: ["Constant fluid level maintenance"],
    },
    {
      number: 43,
      isIndependent: false,
      dependsOn: [39],
      originalText: manualClaimText(43),
      plainEnglish:
        "The system of claim 39 wherein the translational means has multiple degrees of freedom of movement.",
      keyInnovations: ["Multi-DOF translational movement"],
    },
    {
      number: 44,
      isIndependent: false,
      dependsOn: [39],
      originalText: manualClaimText(44),
      plainEnglish:
        "The system of claim 39 wherein precise focus of the prescribed radiation upon the designated surface is maintained.",
      keyInnovations: ["Optical focus maintenance on designated surface"],
    },
    {
      number: 45,
      isIndependent: false,
      dependsOn: [39],
      originalText: manualClaimText(45),
      plainEnglish:
        "The system of claim 39 wherein the selected pattern is formed by radiation emanating from the face of a cathode ray tube.",
      keyInnovations: ["Cathode ray tube bottom pattern exposure"],
    },
    {
      number: 46,
      isIndependent: false,
      dependsOn: [39],
      originalText: manualClaimText(46),
      plainEnglish:
        "The system of claim 39 wherein the pattern is formed by light directly emanating from a phosphor image.",
      keyInnovations: ["Phosphor image bottom exposure"],
    },
    {
      number: 47,
      isIndependent: false,
      dependsOn: [39],
      originalText: manualClaimText(47),
      plainEnglish:
        "The system of claim 39 further including programmed control means for varying the pattern of impinging radiation upon the designated surface.",
      keyInnovations: ["Programmed radiation pattern controller"],
      legalSignificance:
        "Protects programmable computerized beam modulation for dynamic cross-sectional slicing.",
    },
  ],

  drawings: [
    {
      figureNumber: "1",
      title: "Elevation View of Basic Stereolithography System",
      caption:
        "Elevation view of the basic stereolithography apparatus showing container 21 holding curable liquid 22, movable UV source 26, scanning spot 27, elevator platform 29, and vertical shaft 30.",
      svgType: "hull-stereolithography",
      callouts: [
        {
          id: "callout-1-vat",
          figureRef: "Fig. 1",
          label: "Resin Vat",
          element: "21",
          description: "Container holding curable liquid photopolymer.",
          x: 50,
          y: 70,
        },
        {
          id: "callout-1-source",
          figureRef: "Fig. 1",
          label: "UV Source",
          element: "26",
          description: "Movable ultraviolet radiation source.",
          x: 45,
          y: 20,
        },
        {
          id: "callout-1-elevator",
          figureRef: "Fig. 1",
          label: "Elevator Platform",
          element: "29",
          description: "Submerged platform supporting the growing 3D object.",
          x: 50,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "2",
      title: "Perspective View of 3D Part Extraction",
      caption:
        "Perspective view showing a completed three-dimensional solid plastic object 30 being elevated and extracted from the liquid photopolymer vat 21.",
      svgType: "hull-stereolithography",
      callouts: [
        {
          id: "callout-2-part",
          figureRef: "Fig. 2",
          label: "Solid 3D Object",
          element: "30",
          description: "Monolithic solid plastic object built from laminated cross-sections.",
          x: 50,
          y: 40,
        },
      ],
    },
    {
      figureNumber: "3",
      title: "Computer-Controlled Commercial SLA Apparatus",
      caption:
        "Schematic perspective view of a commercial stereolithography system showing UV laser 26, shutter 27a, beam expander 27b, dual galvanometer scanning mirrors 24 and 25, beam sensor 28b, and host computer 28.",
      svgType: "hull-stereolithography",
      callouts: [
        {
          id: "callout-3-laser",
          figureRef: "Fig. 3",
          label: "UV Laser",
          element: "26",
          description: "Continuous-wave helium-cadmium ultraviolet laser.",
          x: 25,
          y: 15,
        },
        {
          id: "callout-3-galvo",
          figureRef: "Fig. 3",
          label: "X-Y Galvanometer Mirrors",
          element: "24, 25",
          description: "High-speed moving-magnet optical deflection mirrors.",
          x: 65,
          y: 25,
        },
        {
          id: "callout-3-computer",
          figureRef: "Fig. 3",
          label: "CAD/CAM Controller",
          element: "28",
          description: "Computer control system executing sliced CAD slice vectors.",
          x: 80,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "4",
      title: "Bottom-Exposure Inverted Stereolithography",
      caption:
        "Elevation view of an inverted bottom-exposure stereolithography system exposing through transparent container bottom 21a with non-reactive immiscible fluid layer 22b.",
      svgType: "hull-stereolithography",
      callouts: [
        {
          id: "callout-4-window",
          figureRef: "Fig. 4",
          label: "Transparent Base",
          element: "21a",
          description: "Optically clear container floor transmitting UV radiation.",
          x: 50,
          y: 85,
        },
      ],
    },
    {
      figureNumber: "5",
      title: "Immiscible Liquid Optical Interface Detail",
      caption:
        "Enlarged cross-sectional view of the two-phase liquid boundary showing photopolymer 22 resting upon dense immiscible release liquid 22b.",
      svgType: "hull-stereolithography",
      callouts: [
        {
          id: "callout-5-layer",
          figureRef: "Fig. 5",
          label: "Immiscible Liquid Layer",
          element: "22b",
          description: "Heavy water or fluorocarbon fluid preventing adhesion to window.",
          x: 50,
          y: 60,
        },
      ],
    },
    {
      figureNumber: "6",
      title: "Cathode Ray Tube (CRT) Faceplate Exposure",
      caption:
        "Elevation view of a stereolithography system using direct optical exposure from a high-resolution CRT or phosphor screen.",
      svgType: "hull-stereolithography",
      callouts: [
        {
          id: "callout-6-crt",
          figureRef: "Fig. 6",
          label: "CRT Faceplate",
          element: "40",
          description: "Cathode ray tube projecting dynamic cross-sectional phosphor image.",
          x: 50,
          y: 25,
        },
      ],
    },
    {
      figureNumber: "7",
      title: "Multi-Axis Articulated Platform",
      caption:
        "Elevation view of a multi-degree-of-freedom rotational platform for angling build parts during stereolithographic fabrication.",
      svgType: "hull-stereolithography",
      callouts: [
        {
          id: "callout-7-tilt",
          figureRef: "Fig. 7",
          label: "Rotational Gimbal",
          element: "45",
          description: "Multi-axis tilt mechanism adjusting part orientation.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "8",
      title: "Chemical Reactive Jet Solidification",
      caption:
        "Elevation view of a stereolithography system utilizing a reactive chemical droplet jet to induce localized polymer solidification.",
      svgType: "hull-stereolithography",
      callouts: [
        {
          id: "callout-8-jet",
          figureRef: "Fig. 8",
          label: "Chemical Jet",
          element: "50",
          description: "Dispensing nozzle depositing catalyst reagent onto fluid medium.",
          x: 50,
          y: 30,
        },
      ],
    },
  ],

  historicalContext: {
    problemStatement:
      "In the early 1980s, product design cycles were severely constrained by the physical delay of building test prototypes. Translating a 2D engineering drawing or 3D CAD model into a physical plastic part required weeks or months of manual pattern making, skilled wood/metal machining, or expensive injection mold tooling ($20,000–$100,000 per mold). Designers could not afford to iterate rapidly, resulting in compromised designs and costly manufacturing retooling when prototype flaws were discovered late in development.",
    priorArtLimitations: [
      "Subtractive CNC machining: limited to cutting external toolpaths; impossible to machine complex enclosed internal cavities, conformal channels, or undercut features in a single operation.",
      "Manual pattern-making: highly labor-intensive, requiring master mold makers and taking 6 to 16 weeks per design revision.",
      "Swainson dual-beam intersection (US 4,041,476): attempted two-photon polymer curing deep inside a resin block; suffered from extreme laser power instability, thermal blooming, and uncontrolled bulk gelation.",
      "Magat radiation grafting (US 2,708,617): demonstrated radiation-induced polymerization in bulk fluids, but lacked spatial scanning control, layer slicing, and geometric build platforms.",
    ],
    breakthroughInsight:
      "Chuck Hull realized that fabricating complex 3D solid parts does not require complex 3D tooling or unstable intersecting lasers in 3D space. Instead, any 3D object can be decomposed into an ordered stack of 2D laminar slices. By projecting a moving ultraviolet beam onto the 2D surface meniscus of a liquid photopolymer vat, polymerizing a thin slice, and indexing a submerged elevator downward by the slice thickness, each layer self-adheres to the previous layer. This elegant reduction from 3D space to sequential 2D surface printing established the foundational architecture of the modern 3D printing industry.",
    patentWars: [
      {
        rivalName: "Dr. Hideo Kodama / Nagoya Municipal Industrial Research Institute",
        rivalClaim:
          "In 1981, Dr. Hideo Kodama in Japan published the first technical paper describing a layer-by-layer photopolymer curing device and filed a Japanese patent application.",
        conflictDetails:
          "Due to institutional budget constraints, Dr. Kodama failed to file a full patent examination request within the statutory one-year deadline, causing his Japanese application to lapse and enter the public domain without issuing a patent.",
        resolution:
          "Hull independently conceived stereolithography in 1983 while working at UVP, Inc., built a working prototype (curing a small tea cup), and filed US Patent 638,905 on August 8, 1984.",
        legalOutcome:
          "US Patent 4,575,330 was granted to Hull on March 11, 1986. Following reexamination in 1989 (B1 Certificate 1177th), all 47 claims were reconfirmed as fully valid, cementing 3D Systems' absolute patent dominance throughout the 1990s.",
      },
      {
        rivalName: "EOS GmbH (Electro Optical Systems, Germany)",
        rivalClaim:
          "EOS developed laser stereolithography systems (STEREOS) in Europe, triggering transatlantic patent infringement litigation with 3D Systems.",
        conflictDetails:
          "3D Systems sued EOS in US and European courts for infringing Hull's stereolithography patent portfolio.",
        resolution:
          "In 1997, 3D Systems and EOS settled through a comprehensive cross-licensing agreement: EOS focused primarily on Selective Laser Sintering (SLS) and Direct Metal Laser Sintering (DMLS), while 3D Systems maintained leadership in SLA stereolithography.",
        legalOutcome:
          "Established 3D Systems and EOS as the two dominant global titans of industrial additive manufacturing.",
      },
    ],
    civilizationalImpact:
      "Chuck Hull's patent launched the global additive manufacturing revolution ($30+ billion market in 2026). It made rapid prototyping ubiquitous across aerospace (Boeing, SpaceX), automotive (Ford, Ferrari), medical (patient-specific surgical guides, Invisalign dental aligners, prosthetic limbs), consumer electronics (Apple, Sony), and industrial design. Hull's STL file format (.stl) remains the universal digital standard for 3D model exchange across all additive manufacturing software worldwide.",
    aftermath:
      "Chuck Hull co-founded 3D Systems in Valencia, California in 1986, serving as Chief Technology Officer and Executive Vice President. In 2014, Hull was inducted into the National Inventors Hall of Fame and received the European Inventor Award. 3D Systems grew into a multibillion-dollar global manufacturer of production 3D printers, software, and materials.",
    funFact:
      "The very first object Chuck Hull ever 3D-printed in his lab on March 9, 1983, was a small, blue eye-wash cup. That original printed plastic cup is now preserved in the collection of the Smithsonian National Museum of American History.",
    sideNotes: [
      "Hull coined the term 'stereolithography' from the Greek 'stereo' (solid) and 'lithography' (writing on stone).",
      "The original prototype apparatus used a high-voltage UV lamp mounted on a modified flatbed drafting pen plotter whose pen carriage was replaced with a focused optical lens tube.",
    ],
  },

  tags: [
    "3D printing",
    "stereolithography",
    "additive manufacturing",
    "Chuck Hull",
    "3D Systems",
    "SLA",
    "photopolymer",
    "UV laser",
    "rapid prototyping",
  ],

  stats: {
    totalClaims: 47,
    independentClaims: 5,
  },
};
