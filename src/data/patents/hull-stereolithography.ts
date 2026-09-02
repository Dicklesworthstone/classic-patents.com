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
  subtitle: "Programmed Surface Curing and Layer-by-Layer Formation of a Three-Dimensional Object",
  inventors: ["Charles W. Hull"],
  inventorLocation: "Arcadia, California",
  grantDate: "1986-03-11",
  filingDate: "1984-08-08",
  era: "Computing & Digital (1970–Present)",
  category: "computing",
  categoryLabel: "Additive Manufacturing & 3D Printing",
  summary:
    "Charles W. Hull's 1986 grant describes a system that forms a three-dimensional object by creating and integrating successive cross-sectional laminae at the surface of a curable fluid medium. Its preferred embodiment uses a computer-programmed ultraviolet spot and an elevator platform; the claims also reach other prescribed forms of stimulation and object-support arrangements.",
  heroQuote:
    '"Stereolithography" is a method and apparatus for making solid objects by successively "printing" thin layers of a curable material, e.g., a UV curable material, one on top of the other.',
  originalPdfUrl: "/patents/pdfs/us-4575330-hull-stereolithography.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4575330A/en",
  usptoClassification: "425/174.4",

  originalTextAsset: {
    url: "/patents/transcripts/us-4575330-hull-stereolithography-reviewed.txt",
    pageCount: 16,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    sourcePdfSha256: "5dc2211b18f88883ee92394917154d57d102b73c26a4744332cbf0d89b1db1c7",
    pageAnchors: [
    {
        "page": 1,
        "exactSourceText": "United States Patent [19]",
        "sourceRelationship": "Title page and abstract"
    },
    {
        "page": 2,
        "exactSourceText": "U.S. Patent Mar. 11, 1986 — Sheet 1 of 4 — 4,575,330",
        "sourceRelationship": "Drawing sheet 1 of 4 (FIGS. 1 and 2 flowcharts)"
    },
    {
        "page": 3,
        "exactSourceText": "U.S. Patent Mar. 11, 1986 — Sheet 2 of 4 — 4,575,330",
        "sourceRelationship": "Drawing sheet 2 of 4 (FIG. 3 stereolithography system)"
    },
    {
        "page": 4,
        "exactSourceText": "U.S. Patent Mar. 11, 1986 — Sheet 3 of 4 — 4,575,330",
        "sourceRelationship": "Drawing sheet 3 of 4 (FIGS. 4 and 5 bottom-up and mask systems)"
    },
    {
        "page": 5,
        "exactSourceText": "U.S. Patent Mar. 11, 1986 — Sheet 4 of 4 — 4,575,330",
        "sourceRelationship": "Drawing sheet 4 of 4 (FIGS. 6, 7, and 8 CRT and multi-axis platform)"
    },
    {
        "page": 6,
        "exactSourceText": "APPARATUS FOR PRODUCTION OF THREE-DIMENSIONAL OBJECTS BY STEREOLITHOGRAPHY",
        "sourceRelationship": "Specification columns 1–2 (Background of the invention)"
    },
    {
        "page": 7,
        "exactSourceText": "SUMMARY OF THE INVENTION (continued)",
        "sourceRelationship": "Specification columns 3–4 (Summary of the invention and Brief Description of Drawings)"
    },
    {
        "page": 8,
        "exactSourceText": "DESCRIPTION OF THE PREFERRED EMBODIMENT",
        "sourceRelationship": "Specification columns 5–6 (Detailed Description: lithography and CAD/CAM)"
    },
    {
        "page": 9,
        "exactSourceText": "A presently preferred embodiment of the stereolithographic system is shown in elevational cross-section in FIG. 3. A container 21 is filled with a UV curable liquid 22 or the like, to provide a designated working surface 23. A programmable source of ultraviolet light 26 or the like produces a spot of ultraviolet light 27 in the plane of surface 23. The spot 27 is movable across the surface 23 by the motion of mirrors or other optical or mechanical elements (not shown) that are a part of light source 26. The position of the spot 27 on surface 23 is controlled by a computer or other programming device 28. A movable elevator platform 29 inside container 21 can be moved up and down selectively, the position of the platform being controlled by the computer 28. As the device operates, it produces a three-dimensional object 30 by step-wise buildup of integrated laminae such as 30a, 30b, 30c.",
        "sourceRelationship": "Specification columns 7–8 (Detailed Description: curable liquid properties and light source)"
    },
    {
        "page": 10,
        "exactSourceText": "The elevator platform 29 for the embodiment of FIG. 3 is a platform attached to an analog plotter (not shown). This plotter is driven the H-P 3497A Data Acquisition/Control Unit with its internal digital to analog converter, under program control of the computer 28.",
        "sourceRelationship": "Specification columns 9–10 (Detailed Description: elevator platform and computer control)"
    },
    {
        "page": 11,
        "exactSourceText": "The UV light source 26 in FIG. 4 focuses the spot 27 at the interface between the liquid 22 and the non-miscible intermediate liquid layer 32, the UV radiation passing through a suitable UV transparent window 33, of quartz or the like, supported at the bottom of the container 21. The curable liquid 22 is provided in a very thin layer over the non-miscible layer 32 and thereby has the advantage of limiting layer thickness directly, rather than relying solely upon adsorption and the like to limit the depth of curing, since ideally an ultrathin lamina is to be provided. Hence, the region of formation will be more sharply defined and some surfaces will be formed smoother with the system of FIG. 4 than with that of FIG. 3. In addition, a smaller volume of UV curable liquid 22 is required, and the substitution of one curable material for another is easier.",
        "sourceRelationship": "Specification columns 11–12 (Commercial embodiments and Claims 1–10)"
    },
    {
        "page": 12,
        "exactSourceText": "11. A system as set forth in claim 2, wherein said reaction means includes: a patterned mask overlying said designated surface for selectively applying a chemical to induce solidification of said fluid medium.",
        "sourceRelationship": "Specification columns 13–14 (Claims 11–38)"
    },
    {
        "page": 13,
        "exactSourceText": "27. A system for directly producing a three-dimensional object as it is designed by a computer, comprising: deriving graphic image output from said computer, said graphic image defining successive adjacent cross-sections of the three-dimensional object designed by said computer; means for drawing upon and forming successive cross-sections, corresponding to said computer designed cross-sections of said object, at a two-dimensional interface; and means for moving said cross-sections as they are formed and building up said object in a stepwise fashion, whereby the three-dimensional object designed by said computer is automatically extracted from a substantially two-dimensional surface.",
        "sourceRelationship": "Specification columns 15–16 (Claims 39–47)"
    },
    {
        "page": 14,
        "exactSourceText": "REEXAMINATION CERTIFICATE",
        "sourceRelationship": "Reexamination Certificate B1 4,575,330 title page"
    },
    {
        "page": 15,
        "exactSourceText": "B1 4.575,330",
        "sourceRelationship": "Reexamination Columns 1–2 (Amended Claims 1, 2, 27, 28)"
    },
    {
        "page": 16,
        "exactSourceText": "B1",
        "sourceRelationship": "Reexamination Columns 3–4 (Amended Claim 29 and Added Claims 46, 47)"
    }
],
  },

  archivalEdition: hullStereolithographyArchivalEdition,

  originalText: `This invention relates generally to improvements in apparatus for forming three-dimensional objects from a fluid medium and, more particularly, to stereolithography involving the application of lithographic techniques to production of three-dimensional objects, whereby such objects can be formed rapidly, reliably, accurately and economically.

It is common practice in the production of plastic parts and the like to first design such a part and then painstakingly produce a prototype of the part, all involving considerable time, effort and expense. The design is then reviewed and, oftentimes, the laborious process is again and again repeated until the design has been optimized. After design optimization, the next step is production. Most production plastic parts are injection molded.`,

  plainEnglishExplanation: {
    overview:
      "Hull identifies the practical problem as the slow, tooling-heavy loop between a plastic-part design, its prototype, and production. The grant's move is not a particular modern printer: it is to make a cross-section at a selected fluid surface, join it to the prior cross-section, and repeat. The preferred working apparatus uses a programmed ultraviolet spot and an elevator platform. The grant says a computer can prepare and deliver the commands; it also claims other forms of stimulation, including particle bombardment and chemical application. Modern SLA machines often use different optics and mechanics, so those later implementations must not be read back into the 1986 preferred embodiment.",
    coreMechanism:
      "In the printed Figure 3 embodiment, container 21 holds UV-curable liquid 22 and defines working surface 23. Computer 28 controls the position of ultraviolet spot 27 from source 26 and moves elevator platform 29. The source draws one solid pattern at the surface; the platform moves the growing object away so fresh liquid occupies that surface; the next pattern adheres to the prior solid layer. Hull's working source is a 350-watt mercury short-arc lamp coupled to a 1 mm ultraviolet-transmitting fiber-optic bundle, shutter, lens tube, and H-P digital plotter. The patent says that a UV laser might ultimately be a better source—it does not describe a laser or galvanometer scanner as its working embodiment.",
    mechanicalBreakdown: [
      {
        title: "Programmed Ultraviolet Spot Source",
        summary:
          "The printed working source is a mercury short-arc lamp, fiber-optic bundle, shutter, lens tube, and plotter that moves a focused ultraviolet spot.",
        technicalDetails:
          "Hull specifies a 350 W mercury short-arc lamp focused into a 1 mm ultraviolet-transmitting fiber-optic bundle. A water-cooled bundle end, electronically controlled shutter blade, and quartz lens tube produce a spot somewhat less than 1 mm in diameter, with about $1 \\mathrm{W/cm^2}$ long-wave UV intensity. An H-P Model 9872 digital plotter moves the lens tube; an H-P 3497A unit controls the shutter. The source is intentionally programmed on and off while the spot moves across working surface 23.",
        archaicTerm:
          "reaction means for selectively applying synergistic stimulation in a prescribed pattern",
        modernEquivalent: "programmed ultraviolet exposure head",
      },
      {
        title: "Submerged Elevator Build Platform",
        summary:
          "A platform supports the forming object and is moved away from the working surface between laminae.",
        technicalDetails:
          "After a layer forms, Hull moves the object beyond the next-layer level to let liquid flow into the momentary void, then returns it to the correct level for the next layer. The printed requirements are programmed, sufficiently precise motion and enough force to carry the forming object; manual fine adjustment is useful during setup and removal. The Figure 3 platform is attached to an analog plotter driven by the H-P 3497A unit. The grant does not specify a ball screw, perforated plate, recoater blade, or a numerical layer thickness.",
        archaicTerm:
          "translational means for moving said object as it is formed away from said designated surface",
        modernEquivalent: "z-axis build platform",
      },
      {
        title: "Photopolymer Resin Vat & Chemistry",
        summary:
          "The curable fluid must form a thin cohesive layer, adhere to adjacent layers, and remain practical to handle and clean.",
        technicalDetails:
          "Hull lists six properties: curing fast enough for practical formation time; adhesion between layers; low enough viscosity to flow after elevator movement; UV absorption for a reasonably thin film; liquid-state solubility with solid-state insolubility in a cleaning solvent; and low toxicity/irritation. The working-material example is Potting Compound 363, a modified acrylate made by Locktite Corporation. The grant does not print penetration-depth, threshold-dose, wavelength, or millisecond-cure values.",
        archaicTerm:
          "fluid medium capable of altering its physical state in response to synergistic stimulation",
        modernEquivalent: "UV-curable photopolymer resin vat",
      },
      {
        title: "Bottom-Up Immiscible Fluid Interface",
        summary:
          "An alternative arrangement forms the object at the interface above a heavier ultraviolet-transparent, non-miscible liquid.",
        technicalDetails:
          "In Figure 4, curable liquid 22 floats on heavier UV-transparent liquid 32 that is non-miscible and non-wetting with it. Hull gives ethylene glycol and heavy water as examples. The source focuses at their interface through a quartz (or similar) window 33 at the container bottom, and object 30 is pulled up from liquid 22. The thin upper layer directly limits layer thickness. Figure 5 is a different alternative: a collimated broad UV source and apertured mask form constant-shape cross-sections until a new mask is substituted.",
        archaicTerm:
          "container wherein exposure is through the bottom and a second non-reactive medium",
        modernEquivalent:
          "inverted bottom-up vat photopolymerization with non-stick release interface",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Optical attenuation in a curable fluid (modern engineering interpretation)",
        formula: "E(z) = E_0 e^{-z/D_p}",
        explanation:
          "This is a modern explanatory model, not an equation printed in the grant. It says radiant exposure E decreases with depth z in an absorbing fluid, with D_p as a material penetration scale. Hull's source-level observation is narrower: the liquid should absorb UV so the cured film is reasonably thin. The record does not assert a particular D_p, threshold, or layer-overcure margin.",
      },
      {
        principle: "Dose and motion at the working surface (modern engineering interpretation)",
        formula: "H = \\int_0^t I(t)\\,dt",
        explanation:
          "Here H is radiant exposure and I is irradiance over time. Hull's preferred system must make a spot small and intense enough for practical detail, then move it in a programmed pattern. The integral describes why shutter timing, source intensity, spot size, and motion all affect the cured pattern; it does not imply the unprinted laser-beam profile or numerical scanning performance formerly shown here.",
      },
      {
        principle: "Layer continuity by adhesion",
        formula: "z_{n+1} = z_n + \\Delta z",
        explanation:
          "The discrete layer index n emphasizes the patent's essential sequence: form one lamina, move the object, and form an adjacent lamina that adheres to the prior one. The grant requires the fluid to be adhesive, but it does not state a gel-conversion fraction, an interlayer-strength integral, or a particular numerical step size.",
      },
    ],
    whyItMattersToday:
      "The durable idea is the explicit engineering chain from a computer-defined cross-section, to a patterned change at a material surface, to a joined stack of layers. That chain is recognizable across later additive-manufacturing families, even when their energy source, feedstock, motion system, and post-processing differ. The distinction matters: this grant describes a curable fluid and surface formation; it should not be treated as a literal specification for every later 3D-printing process.",
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
