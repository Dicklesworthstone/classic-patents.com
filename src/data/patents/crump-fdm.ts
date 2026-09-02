import { crumpFdmArchivalEdition } from "@/data/editions/crumpFdmEdition";
import type { Patent } from "@/types/patent";

const EXPECTED_PDF_SHA256 = "a61b0395a405393ced9160aaa6a3e04624cb69f277eb6f64a070a3c3a0a51708";

function manualClaimText(number: number): string {
  const block = crumpFdmArchivalEdition.blocks.find(
    (b): b is Extract<(typeof crumpFdmArchivalEdition.blocks)[number], { kind: "claim" }> =>
      b.kind === "claim" && b.number === number,
  );
  if (!block) {
    throw new Error(`US 5,121,329 has no manual claim #${number} in crumpFdmArchivalEdition`);
  }
  return block.inlines.map((i) => i.text).join("");
}

export const crumpFdmPatent: Patent = {
  id: "us-5121329-crump-fdm",
  patentNumber: "US 5,121,329",
  title: "Apparatus and Method for Creating Three-Dimensional Objects",
  shortTitle: "Fused Deposition Modeling (FDM 3D Printing)",
  subtitle: "Filament Pinch-Drive Extrusion, Heated Liquefier, and Planar Shear Layering",
  inventors: ["S. Scott Crump"],
  inventorLocation: "Minnetonka, Minnesota",
  grantDate: "1992-06-09",
  filingDate: "1989-10-30",
  era: "Computing & Digital (1970–Present)",
  category: "materials",
  categoryLabel: "Additive Manufacturing & Robotics",
  summary:
    "S. Scott Crump's foundational patent for Fused Deposition Modeling (FDM)—the technology behind modern desktop and industrial thermoplastic 3D printers. The system utilizes motorized pinch rollers to feed a solid filament into a heated liquefier chamber under positive pressure, extruding a metered bead through a calibrated nozzle tip whose planar bottom face irons and flattens each road against the substrate or previous layer in coordinated 3-axis Cartesian motion.",
  heroQuote:
    "A solid flexible strand or filament is drawn from a supply reel by motor-driven pinch feed rollers and driven into a heated liquefier under positive pressure, discharging a flowable bead that is flattened by the planar nozzle face to build up dense three-dimensional articles layer by layer.",
  originalPdfUrl: "/patents/pdfs/us-5121329-crump-fdm.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US5121329A/en",
  usptoClassification: "G06F 15/46; 364/468; 264/25; 425/174",
  stats: {
    totalClaims: 44,
    independentClaims: 7,
  },
  originalTextAsset: {
    url: "/patents/transcripts/us-5121329-crump-fdm-reviewed.txt",
    pageCount: 15,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: EXPECTED_PDF_SHA256,
  },
  archivalEdition: crumpFdmArchivalEdition,
  originalText:
    "Apparatus incorporating a movable dispensing head provided with a supply of material which solidifies at a predetermined temperature, and a base member, which are moved relative to each other along X, Y, and Z axes in a predetermined pattern to create three-dimensional objects by building up material discharged from the dispensing head onto the base member at a controlled rate.",
  drawings: [
    {
      figureNumber: "1",
      title: "Perspective View of 3-Axis FDM Apparatus",
      caption:
        "Perspective view of the overall computer-driven 3-axis FDM apparatus showing the heated dispensing head, Cartesian gantry, Z-axis platform, filament spool, and computerized motion controller.",
      svgType: "crump-fdm",
      callouts: [
        {
          id: "callout-1-head",
          figureRef: "Fig. 1",
          label: "Dispensing Head",
          element: "10",
          description: "Movable heated dispensing head with liquefier and nozzle.",
          x: 45,
          y: 35,
        },
        {
          id: "callout-1-strand",
          figureRef: "Fig. 1",
          label: "Feedstock Filament",
          element: "12",
          description: "Continuous flexible thermoplastic strand.",
          x: 50,
          y: 20,
        },
        {
          id: "callout-1-spool",
          figureRef: "Fig. 1",
          label: "Supply Spool",
          element: "14",
          description: "Reel holding coil of solid filament feedstock.",
          x: 50,
          y: 10,
        },
        {
          id: "callout-1-base",
          figureRef: "Fig. 1",
          label: "Base Platform",
          element: "18",
          description: "Receiving substrate on Z elevator bed.",
          x: 50,
          y: 75,
        },
      ],
    },
    {
      figureNumber: "2",
      title: "Side Elevation of Dispensing Head & Pinch Drive",
      caption:
        "Side elevation view of the movable dispensing head illustrating the motor drive, gear train, and serrated pinch feed rollers advancing solid filament into the liquefier block.",
      svgType: "crump-fdm",
      callouts: [
        {
          id: "callout-2-rollers",
          figureRef: "Fig. 2",
          label: "Pinch Feed Rollers",
          element: "28",
          description: "Counter-rotating motorized rollers gripping solid filament.",
          x: 50,
          y: 40,
        },
        {
          id: "callout-2-liquefier",
          figureRef: "Fig. 2",
          label: "Liquefier Block",
          element: "20",
          description: "Heated flow passage melting solid filament into fluid.",
          x: 50,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "3",
      title: "Cross-Section of Liquefier & Planar Ironing Nozzle",
      caption:
        "Enlarged vertical cross-section of the heated liquefier flow passage, electric resistance heaters, and discharge nozzle tip showing the planar shearing action creating a flattened road bead.",
      svgType: "crump-fdm",
      callouts: [
        {
          id: "callout-3-tip",
          figureRef: "Fig. 3",
          label: "Nozzle Orifice Tip",
          element: "22",
          description: "Calibrated discharge orifice with flat planar shearing land.",
          x: 50,
          y: 85,
        },
        {
          id: "callout-3-heater",
          figureRef: "Fig. 3",
          label: "Electric Resistance Heater",
          element: "24",
          description: "Heating element maintaining liquefier above solidification temperature.",
          x: 65,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "4",
      title: "Sequential Layer-by-Layer Buildup",
      caption:
        "Enlarged cross-sectional view showing sequential layer-by-layer buildup of solidifying thermoplastic roads on the receiving base member substrate.",
      svgType: "crump-fdm",
      callouts: [
        {
          id: "callout-4-road",
          figureRef: "Fig. 4",
          label: "Flattened Road Bead",
          element: "40",
          description: "Solidified thermoplastic bead with rectangular cross-section.",
          x: 50,
          y: 60,
        },
      ],
    },
    {
      figureNumber: "5",
      title: "Perimeter Contour & Raster Infill Toolpaths",
      caption:
        "Top plan view of a layer cross-section showing perimeter contour outline toolpaths and interior back-and-forth raster vector hatching passes.",
      svgType: "crump-fdm",
      callouts: [
        {
          id: "callout-5-infill",
          figureRef: "Fig. 5",
          label: "Raster Vector Passes",
          element: "46",
          description: "Dense back-and-forth infill paths welding to outer wall.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "6",
      title: "Multi-Bead Monolithic Structure",
      caption:
        "Perspective view of multi-bead overlapping solid structure demonstrating dense cohesive fusion between adjacent roads and laminated layers.",
      svgType: "crump-fdm",
      callouts: [
        {
          id: "callout-6-fusion",
          figureRef: "Fig. 6",
          label: "Interlayer Fusion Zone",
          element: "48",
          description: "Thermally welded boundary between successive laminae.",
          x: 50,
          y: 50,
        },
      ],
    },
  ],
  plainEnglishExplanation: {
    overview:
      "Before S. Scott Crump's invention in 1989, rapid prototyping relied almost exclusively on liquid photopolymer stereolithography (SLA) or powder bed laser sintering (SLS). Both required massive, toxic chemical vats or high-power laser optics in industrial laboratories. Crump conceived Fused Deposition Modeling (FDM) while attempting to make a toy frog for his daughter using a glue gun loaded with a mixture of polyethylene and candle wax. He automated the process by drawing solid thermoplastic filament from a spool, gripping it with motorized pinch rollers, forcing it into a heated liquefier tube under positive pressure, and extruding a continuous ribbon through a calibrated nozzle tip onto a 3-axis table. FDM eliminated laser optics and hazardous chemical baths, launching the worldwide desktop 3D printing revolution.",
    coreMechanism:
      "The physics of FDM rests on using the unmelted solid filament itself as a mechanical piston pump to drive molten polymer through a capillary nozzle. Motorized serrated pinch rollers grip the solid filament with normal force F_pinch, advancing it into the heated liquefier block where electric resistance heaters elevate its temperature above its melting point or glass transition temperature Tg (e.g. 220–250 °C for ABS). Inside the nozzle capillary of diameter d_nozzle, the viscous melt undergoes Poiseuille flow with non-Newtonian shear thinning. As the nozzle moves along a toolpath at velocity v_head in close proximity to the preceding layer (gap distance = layer height h), the flat planar land of the nozzle tip exerts a shearing and ironing force that squashes the cylindrical bead into a flattened rectangular road (aspect ratio w/h ≈ 1.5–2.5). Thermal energy diffuses rapidly into the cooler previous layer (cooling time constant τ ≈ 50–200 ms), cooling the bead below Tg to lock in dimensional accuracy while maintaining interface temperature T_interface > Tg long enough for polymer chains to interdiffuse and thermally weld across the layer boundary.",
    mechanicalBreakdown: [
      {
        title: "Motorized Pinch-Roller Filament Drive",
        summary:
          "Pairs of counter-rotating serrated drive rollers engage the solid flexible filament, converting motor torque into axial thrust that forces the feedstock into the heated liquefier.",
        technicalDetails:
          "The solid filament acts as its own cylindrical piston. To prevent filament buckling or roller slip (grinding), the drive thrust {\text{drive}} = Delta P cdot A_{\text{filament}}$ must remain below the traction limit {\text{traction}} = mu N_{\text{pinch}}$ (where $mu approx 0.35$ and {\text{pinch}} approx 40\text{--}60\text{ N}$). Motor step frequency is proportionally linked to toolhead velocity so volumetric throughput  = A_{\text{road}} v_{\text{head}}$ matches commanded motion precisely.",
        archaicTerm: "flexible strand pinch rollers 28",
        modernEquivalent: "direct-drive dual-gear extruder / stepper motor feed mechanism",
      },
      {
        title: "Heated Liquefier Chamber & Capillary Nozzle",
        summary:
          "A thermal block containing electrical resistance strip heaters and thermocouple feedback that melts solid feedstock into a pressurized liquid state.",
        technicalDetails:
          "Within the liquefier of land length $, the polymer melt flows under pressure gradient $Delta P = \frac{8 mu L Q}{pi R_{\text{nozzle}}^4}$. Melt viscosity follows the Arrhenius relation $mu(T) = mu_0 expleft(\frac{E_a}{R}left(\frac{1}{T} - \frac{1}{T_0}\right)\right)$, dropping steeply with temperature. Closed-loop temperature regulation within $pm 1\text{ }^circ\text{C}$ prevents thermal degradation while keeping feed force within safe operating bounds.",
        archaicTerm: "temperature-controlled flow passage 20",
        modernEquivalent: "hotend heater block, cartridge heater, thermistor, and brass nozzle",
      },
      {
        title: "Planar Shearing & Ironing Nozzle Land",
        summary:
          "A discharge orifice tip surrounded by a flat horizontal bottom face that shears, flattens, and compresses extruded beads against preceding layers.",
        technicalDetails:
          "By maintaining a calibrated vertical clearance $ equal to the programmed slice thickness (zsh.10\text{--}0.30\text{ mm}$), the nozzle bottom face prevents volumetric bulging and enforces uniform layer thickness. The shearing action spreads the molten strand sideways into a road of width  = d_{\text{nozzle}} + (1 - pi/4)h$, eliminating accumulative Z-axis tolerance buildup across hundreds of laminated layers.",
        archaicTerm: "substantially planar bottom tip surface",
        modernEquivalent: "flat nozzle land / ironing surface",
      },
      {
        title: "Computer-Controlled 3-Axis Cartesian Motion Gantry",
        summary:
          "A multi-axis mechanical coordinate system driving relative X-Y-Z motion between the dispensing head and the build substrate from sliced CAD vector data.",
        technicalDetails:
          "Slicing algorithms decompose 3D CAD boundary representation (B-rep/STL) models into planar horizontal layers. Toolpath generation algorithms create closed contour loops defining outer walls followed by parallel raster infill vectors. Stepper motor pulses drive lead screws or timing belts in X and Y during layer deposition, then step the Z-axis table downward by increment $Delta z = h$ before starting the next slice.",
        archaicTerm: "mechanical X-Y-Z rectangular coordinate drive",
        modernEquivalent: "CoreXY / Cartesian 3D printer gantry & G-code motion controller",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Poiseuille Viscous Capillary Flow & Non-Newtonian Shear Thinning",
        formula:
          "Delta P = \frac{8 mu L Q}{pi R_{\text{nozzle}}^4} = \frac{8 mu L (w cdot h cdot v_{\text{head}})}{pi R_{\text{nozzle}}^4}",
        explanation:
          "The pressure required to force molten thermoplastic through the nozzle orifice scales with melt viscosity mu, capillary length L, and volumetric flow rate Q, and inversely with the fourth power of nozzle radius R_{\text{nozzle}}. Thermoplastics exhibit pseudoplastic (shear-thinning) rheology, where apparent viscosity drops at high shear rates dot{gamma} = \frac{4Q}{pi R^3}, facilitating high-speed extrusion.",
      },
      {
        principle: "Transient Thermal Conduction & Cooling Solidification",
        formula:
          "\tau = \frac{h^2}{pi^2 alpha} = \frac{\rho c_p h^2}{pi^2 k}, quad T(t) = T_{\text{ambient}} + (T_{\text{nozzle}} - T_{\text{ambient}}) exp(-t/\tau)",
        explanation:
          "A deposited thermoplastic road cools rapidly via one-dimensional thermal conduction into the substrate and previous layer. With layer height h approx 0.2\text{ mm} and polymer thermal diffusivity alpha approx 8.2 \times 10^{-8}\text{ m}^2/\text{s}, the characteristic cooling time constant \tau is approximately 50\text{--}100\text{ ms}, freezing the material rapidly into structural rigidity.",
      },
      {
        principle: "Polymer Chain Interdiffusion & Interlayer Thermal Fusion Welding",
        formula:
          "T_{\text{interface}} = \frac{k_{\text{melt}} T_{\text{nozzle}} + k_{\text{sub}} T_{\text{substrate}}}{k_{\text{melt}} + k_{\text{sub}}} > T_g",
        explanation:
          "For adjacent roads and successive layers to form a monolithic, high-strength part, the interface temperature at initial contact must exceed the polymer's glass transition temperature T_g. In this rubbery molten regime, polymer molecular chains diffuse across the interface via reptation dynamics, eliminating the physical boundary and achieving isotropic mechanical strength.",
      },
    ],
    whyItMattersToday:
      "S. Scott Crump's invention of FDM created the most accessible and ubiquitous 3D printing technology in the world. By replacing toxic resin vats and complex lasers with safe, solid spools of engineering thermoplastics (ABS, PLA, PETG, Nylon, PEEK), FDM democratized rapid prototyping for millions of schools, labs, and factories worldwide. When the core patents expired in 2009, the RepRap open-source movement ignited a manufacturing revolution that continues to reshape aerospace tooling, medical prosthetics, and local distributed fabrication.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Foundational independent apparatus claim for FDM 3D printing: a movable dispensing head with a heated liquefier flow passage, calibrated discharge orifice tip, solidifiable material supply, receiving base member in close proximity, 3-axis X-Y-Z Cartesian motion mechanism, and volumetric extrusion metering.",
      keyInnovations: [
        "Filament Extrusion Head",
        "Heated Liquefier Chamber",
        "3-Axis Coordinate Motion",
        "Volumetric Extrusion Metering",
      ],
      legalSignificance:
        "Broadest apparatus claim establishing exclusive patent rights over extrusion-based additive manufacturing systems.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(2),
      plainEnglish:
        "Specifies that the dispensing head includes heating means controlled to heat solid material into a fluid state above its solidification temperature.",
      keyInnovations: ["Dispensing Head Heating Assembly"],
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(3),
      plainEnglish:
        "Defines precision closed-loop temperature control maintaining liquefier melt temperature within plus or minus one degree Celsius of setpoint.",
      keyInnovations: ["Closed-Loop Thermal Regulation (\u00b11 \u00b0C)"],
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(4),
      plainEnglish:
        "Specifies that solid material is supplied in a solid state and mechanically advanced into the heated head by motorized feed drive means.",
      keyInnovations: ["Solid Feedstock Mechanical Drive"],
    },
    {
      number: 5,
      isIndependent: false,
      dependsOn: [4],
      originalText: manualClaimText(5),
      plainEnglish:
        "Specifies that the solid feedstock is configured as an elongated cylindrical rod engaged by the mechanical drive.",
      keyInnovations: ["Elongated Cylindrical Rod Feedstock"],
    },
    {
      number: 6,
      isIndependent: false,
      dependsOn: [5],
      originalText: manualClaimText(6),
      plainEnglish:
        "Defines feedstock dimensional bounds between 0.040 and 0.250 inches (1.0 to 6.35 mm) in diameter.",
      keyInnovations: ["Calibrated Rod Feedstock Diameter (1.0\u20136.35 mm)"],
    },
    {
      number: 7,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(7),
      plainEnglish:
        "Specifies feedstock in the form of a continuous flexible strand or filament drawn from a supply source.",
      keyInnovations: ["Continuous Flexible Filament Feedstock"],
      legalSignificance:
        "The defining patent claim covering spool-fed continuous filament 3D printing.",
    },
    {
      number: 8,
      isIndependent: false,
      dependsOn: [7],
      originalText: manualClaimText(8),
      plainEnglish:
        "Includes a supply reel holding a continuous coil of flexible filament and a motor-driven advancement mechanism.",
      keyInnovations: ["Filament Supply Spool & Drive Motor"],
    },
    {
      number: 9,
      isIndependent: false,
      dependsOn: [7],
      originalText: manualClaimText(9),
      plainEnglish:
        "Specifies that the continuous flexible strand comprises a thermoplastic polymer resin.",
      keyInnovations: ["Thermoplastic Polymer Filament Feedstock"],
    },
    {
      number: 10,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(10),
      plainEnglish:
        "Specifies that the base member is supported on translational guide ways for Z-axis vertical movement.",
      keyInnovations: ["Translational Base Member Guide Ways"],
    },
    {
      number: 11,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(11),
      plainEnglish:
        "Includes a computer-aided design (CAD) system and controller parsing sliced volumetric slice data into multi-axis drive commands.",
      keyInnovations: ["CAD Slicing Computer & Motion Controller"],
    },
    {
      number: 12,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(12),
      plainEnglish:
        "Specifies that the solidifiable build material comprises a thermoplastic resin.",
      keyInnovations: ["Thermoplastic Resin Build Material"],
    },
    {
      number: 13,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(13),
      plainEnglish: "Specifies that the solidifiable build material comprises a wax composition.",
      keyInnovations: ["Wax Build Material Composition"],
    },
    {
      number: 14,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(14),
      plainEnglish:
        "Specifies that the solidifiable build material comprises a low-melting metal alloy.",
      keyInnovations: ["Low-Melting Metal Alloy Material"],
    },
    {
      number: 15,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(15),
      plainEnglish:
        "Specifies a receiving substrate having a sand particle coating to enhance initial layer adhesion.",
      keyInnovations: ["Sand Particle Coated Substrate"],
    },
    {
      number: 16,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(16),
      plainEnglish:
        "Specifies an open matrix substrate positioned on the base member to receive and interlock with the first layer.",
      keyInnovations: ["Open Matrix Substrate Interlock"],
    },
    {
      number: 17,
      isIndependent: false,
      dependsOn: [16],
      originalText: manualClaimText(17),
      plainEnglish: "Specifies that the open matrix substrate comprises a fine wire mesh screen.",
      keyInnovations: ["Fine Wire Mesh Substrate Screen"],
    },
    {
      number: 18,
      isIndependent: false,
      dependsOn: [17],
      originalText: manualClaimText(18),
      plainEnglish:
        "Specifies that the wire mesh screen is embedded with sand particles to increase mechanical grip.",
      keyInnovations: ["Sand-Embedded Wire Mesh Screen"],
    },
    {
      number: 19,
      isIndependent: false,
      dependsOn: [17],
      originalText: manualClaimText(19),
      plainEnglish:
        "Specifies that the open matrix substrate is electrically conductive to facilitate resistive heating.",
      keyInnovations: ["Electrically Conductive Heated Substrate"],
    },
    {
      number: 20,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(20),
      plainEnglish:
        "Specifies build material containing embedded ferromagnetic particles responsive to magnetic holding fields.",
      keyInnovations: ["Ferromagnetic Particle Filled Material"],
    },
    {
      number: 21,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(21),
      plainEnglish:
        "Includes a plurality of dispensing heads for multi-material or support deposition.",
      keyInnovations: ["Plurality of Dispensing Heads / Multi-Material"],
    },
    {
      number: 22,
      isIndependent: true,
      originalText: manualClaimText(22),
      plainEnglish:
        "Independent claim for an extrusion head wherein the flow passage comprises a plurality of discharge outlets.",
      keyInnovations: ["Multi-Orifice Dispensing Manifold"],
    },
    {
      number: 23,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(23),
      plainEnglish:
        "Specifies that the size of the dispensing nozzle outlet is dynamically variable during deposition.",
      keyInnovations: ["Dynamically Variable Nozzle Orifice"],
    },
    {
      number: 24,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(24),
      plainEnglish:
        "Specifies a receiving substrate provided with a plurality of vacuum holes to anchor the build part.",
      keyInnovations: ["Vacuum Platen Part Hold-Down Substrate"],
    },
    {
      number: 25,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(25),
      plainEnglish:
        "Specifies a nozzle tip with a planar bottom face positioned parallel to the substrate for ironing extruded beads.",
      keyInnovations: ["Planar Bottom Face Nozzle Tip"],
    },
    {
      number: 26,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(26),
      plainEnglish:
        "Specifies build material containing solid reinforcement filler particles entrapped in a polymer binder.",
      keyInnovations: ["Particle-Reinforced Polymer Composite"],
    },
    {
      number: 27,
      isIndependent: true,
      originalText: manualClaimText(27),
      plainEnglish:
        "Independent method claim: introducing material into a dispensing head, heating above solidification point, dispensing in close proximity to a base, creating coordinated relative X-Y motion to form a layer, stepping the Z-axis, and building successive layers after each layer solidifies.",
      keyInnovations: [
        "Layer-by-Layer FDM Deposition Method",
        "Z-Axis Stepping",
        "Thermal Solidification Laminating",
      ],
      legalSignificance:
        "Foundational method claim establishing the operational sequence of FDM 3D printing.",
    },
    {
      number: 28,
      isIndependent: false,
      dependsOn: [27],
      originalText: manualClaimText(28),
      plainEnglish:
        "Specifies moving the dispensing head in X and Y while moving the base member vertically along the Z-axis.",
      keyInnovations: ["X-Y Head & Z-Axis Base Coordinated Kinematics"],
    },
    {
      number: 29,
      isIndependent: false,
      dependsOn: [27],
      originalText: manualClaimText(29),
      plainEnglish:
        "Specifies maintaining the base stationary while translating the dispensing head in all three X, Y, and Z axes.",
      keyInnovations: ["Full 3-Axis Cartesian Head Translation"],
    },
    {
      number: 30,
      isIndependent: false,
      dependsOn: [27],
      originalText: manualClaimText(30),
      plainEnglish:
        "Specifies introducing build material into the head in solid form and heating it to a fluid state inside the head.",
      keyInnovations: ["In-Head Thermal Melting Process"],
    },
    {
      number: 31,
      isIndependent: false,
      dependsOn: [30],
      originalText: manualClaimText(31),
      plainEnglish:
        "Specifies introducing solid material as a continuous flexible filament strand drawn from a spool.",
      keyInnovations: ["Continuous Flexible Filament Feeding Process"],
    },
    {
      number: 32,
      isIndependent: false,
      dependsOn: [27],
      originalText: manualClaimText(32),
      plainEnglish:
        "Specifies depositing material onto an open matrix screen substrate on the base member.",
      keyInnovations: ["Open Matrix Screen Deposition Process"],
    },
    {
      number: 33,
      isIndependent: false,
      dependsOn: [27],
      originalText: manualClaimText(33),
      plainEnglish:
        "Specifies heating an electrically conductive substrate during deposition to control cooling rate.",
      keyInnovations: ["Conductive Substrate Heated Bed Process"],
    },
    {
      number: 34,
      isIndependent: false,
      dependsOn: [27],
      originalText: manualClaimText(34),
      plainEnglish:
        "Specifies build material selected from thermoplastic resins, waxes, and metals.",
      keyInnovations: ["Thermoplastic, Wax, and Metal Material Palette"],
    },
    {
      number: 35,
      isIndependent: false,
      dependsOn: [27],
      originalText: manualClaimText(35),
      plainEnglish:
        "Specifies controlling volumetric flow rate in real-time coordination with toolhead travel speed.",
      keyInnovations: ["Coordinated Flow-Velocity Volumetric Metering"],
    },
    {
      number: 36,
      isIndependent: true,
      originalText: manualClaimText(36),
      plainEnglish:
        "Independent process claim: generating CAD vector slice signals and dispensing solidifiable material in free space to form upstanding interconnected wireframe segments.",
      keyInnovations: ["Direct CAD Vector Slicing Control", "Free-Space Wireframe Extrusion"],
    },
    {
      number: 37,
      isIndependent: false,
      dependsOn: [36],
      originalText: manualClaimText(37),
      plainEnglish:
        "Specifies dispensing upstanding segments in sequence and allowing each segment to solidify before connecting the next segment.",
      keyInnovations: ["Sequential Free-Space Segment Solidification"],
    },
    {
      number: 38,
      isIndependent: false,
      dependsOn: [36],
      originalText: manualClaimText(38),
      plainEnglish:
        "Specifies using thermally solidifiable material that hardens rapidly upon ambient cooling in free air.",
      keyInnovations: ["Rapid Air-Cooling Free-Space Polymer"],
    },
    {
      number: 39,
      isIndependent: true,
      originalText: manualClaimText(39),
      plainEnglish:
        "Independent process claim: dispensing fluid material through a nozzle tip having a flat planar bottom face maintained parallel to the substrate, providing a shearing and flattening action on the top surface of each road to eliminate accumulative Z-axis height errors.",
      keyInnovations: [
        "Planar Shearing & Ironing Nozzle Action",
        "Accumulative Z-Error Elimination",
        "Controlled Gap Height Road Flattening",
      ],
      legalSignificance:
        "Critical process claim protecting planar nozzle land flattening for layer thickness uniformity.",
    },
    {
      number: 40,
      isIndependent: false,
      dependsOn: [39],
      originalText: manualClaimText(40),
      plainEnglish:
        "Specifies build material consisting of a multiple-component composite blend of polymers.",
      keyInnovations: ["Multi-Component Polymer Blend Composition"],
    },
    {
      number: 41,
      isIndependent: false,
      dependsOn: [39],
      originalText: manualClaimText(41),
      plainEnglish: "Specifies an open matrix wire mesh substrate for initial road anchoring.",
      keyInnovations: ["Planar Sheared Open Matrix Mesh Deposition"],
    },
    {
      number: 42,
      isIndependent: false,
      dependsOn: [41],
      originalText: manualClaimText(42),
      plainEnglish: "Specifies wire mesh screen coated with adhesive sand particles.",
      keyInnovations: ["Sand-Coated Wire Mesh Base Layer"],
    },
    {
      number: 43,
      isIndependent: true,
      originalText: manualClaimText(43),
      plainEnglish:
        "Independent apparatus claim for making 3D objects with an open matrix substrate on the base member to receive initial fluid discharge and firmly anchor the part against warping.",
      keyInnovations: ["Open Matrix Part-Anchoring Base Apparatus", "Anti-Warping Substrate Lock"],
    },
    {
      number: 44,
      isIndependent: true,
      originalText: manualClaimText(44),
      plainEnglish:
        "Independent apparatus claim detailing a dual-zone heated dispensing head with a first main heater adjacent to the supply chamber and a second nozzle heater adjacent to the orifice passage to prevent tip freezing.",
      keyInnovations: [
        "Dual-Zone Liquefier & Tip Heating Assembly",
        "Anti-Freezing Orifice Thermal Control",
      ],
      legalSignificance:
        "Protects dual-zone hotend thermal management preventing cold nozzle tip clogging.",
    },
  ],
  historicalContext: {
    problemStatement:
      "Before Fused Deposition Modeling (FDM), creating physical 3D prototypes required expensive CNC subtractive machining, silicone casting, or hazardous liquid resin vats with high-power ultraviolet lasers (SLA). Industrial design teams needed a clean, automated, office-friendly additive manufacturing process using safe, inexpensive thermoplastic materials.",
    priorArtLimitations: [
      "Liquid photopolymer stereolithography (US 4,575,330) required toxic acrylic/epoxy chemical baths, UV lasers, and messy post-processing washing solvents.",
      "Powder bed laser sintering required high-power CO2 lasers, inert gas atmospheres, and hazardous fine polymer powders.",
      "Direct extrusion systems lacked precise volumetric metering, causing severe nozzle jamming, uncontrolled stringing, or uneven layer height accumulation.",
    ],
    breakthroughInsight:
      "Scott Crump conceived FDM while making a toy frog for his daughter using a mixture of polyethylene and candle wax in a glue gun. He realized that a solid thermoplastic filament could act as its own positive-displacement piston pump when driven into a heated liquefier chamber by motorized pinch rollers. Furthermore, maintaining the flat planar land of the nozzle tip parallel to the substrate at a calibrated gap clearance continuously shears and irons each deposited bead into a flat road, eliminating accumulative Z-axis height errors across hundreds of layers.",
    patentWars: [
      {
        rivalName: "Desktop 3D Printing Open-Source Movement (RepRap / MakerBot)",
        rivalClaim:
          "In 2005, Dr. Adrian Bowyer founded the open-source RepRap project to create self-replicating 3D printers using thermoplastic extrusion.",
        conflictDetails:
          "For twenty years, Stratasys held exclusive patent rights over filament pinch-drive extrusion, preventing commercialization of low-cost desktop 3D printers.",
        resolution:
          "When Crump's foundational patent US 5,121,329 expired in 2009, MakerBot, Ultimaker, and Prusa Research launched an explosion of affordable desktop 3D printers worldwide.",
        legalOutcome:
          "The expiration of US 5,121,329 democratized 3D printing across millions of homes, schools, and maker spaces, transforming additive manufacturing into a multi-billion dollar global industry.",
      },
    ],
    civilizationalImpact:
      "Crump's FDM technology is the single most widely deployed 3D printing process in human history. It revolutionized industrial rapid prototyping, dental alignment, aerospace tooling (Boeing, NASA), personalized prosthetics, and local distributed manufacturing.",
    aftermath:
      "Scott and Lisa Crump founded Stratasys, Inc. in 1989. Stratasys became a global additive manufacturing leader with thousands of employees and merged with Objet Ltd. in 2012. Scott Crump was inducted into the National Inventors Hall of Fame in 2015.",
    funFact:
      "Scott Crump's very first FDM prototype was built in his kitchen in 1988 using a manual hot glue gun loaded with a mixture of polyethylene wax and paraffin to make a toy frog for his young daughter.",
    sideNotes: [
      "Stratasys coined and trademarked the term 'Fused Deposition Modeling' (FDM); the open-source community adopted the generic term 'Fused Filament Fabrication' (FFF).",
      "Modern industrial FDM printers use high-temperature thermoplastics including ULTEM 9085 and PEEK for flight-ready aerospace parts.",
    ],
  },
  tags: [
    "3D printing",
    "Fused Deposition Modeling",
    "FDM",
    "FFF",
    "Scott Crump",
    "Stratasys",
    "extrusion",
    "thermoplastic",
    "additive manufacturing",
    "rapid prototyping",
  ],
};

export default crumpFdmPatent;
