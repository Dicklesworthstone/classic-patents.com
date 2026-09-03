import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});

const term = (value: string, definition: string, label?: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
  label,
});

const FIGURES = {
  1: {
    src: "/patents/figures/us-5121329-crump-fdm/fig-1-source-crop-v1.png",
    alt: "Figure 1 from US 5,121,329: perspective view of overall computer-driven 3-axis FDM apparatus with heated head, X-Y gantry, Z elevator table, filament spool, and controller.",
    width: 2020,
    height: 1550,
  },
  2: {
    src: "/patents/figures/us-5121329-crump-fdm/fig-2-source-crop-v1.png",
    alt: "Figure 2 from US 5,121,329: side elevation of movable dispensing head, motor drive, and filament pinch rollers.",
    width: 1050,
    height: 1450,
  },
  3: {
    src: "/patents/figures/us-5121329-crump-fdm/fig-3-source-crop-v1.png",
    alt: "Figure 3 from US 5,121,329: vertical cross-section of heated liquefier flow passage and discharge nozzle tip creating flattened bead.",
    width: 1000,
    height: 1450,
  },
  4: {
    src: "/patents/figures/us-5121329-crump-fdm/fig-4-source-crop-v1.png",
    alt: "Figure 4 from US 5,121,329: enlarged view showing sequential layer-by-layer buildup of solidifying thermoplastic roads on substrate.",
    width: 2050,
    height: 1000,
  },
  5: {
    src: "/patents/figures/us-5121329-crump-fdm/fig-5-source-crop-v1.png",
    alt: "Figure 5 from US 5,121,329: top plan view showing raster filling and contour outline toolpaths.",
    width: 1050,
    height: 900,
  },
  6: {
    src: "/patents/figures/us-5121329-crump-fdm/fig-6-source-crop-v1.png",
    alt: "Figure 6 from US 5,121,329: perspective view of multi-bead overlapping solid structure.",
    width: 1000,
    height: 900,
  },
  7: {
    src: "/patents/figures/us-5121329-crump-fdm/fig-7-source-crop-v1.png",
    alt: "Figure 7 from US 5,121,329: plan view of multi-orifice manifold.",
    width: 1050,
    height: 1100,
  },
  8: {
    src: "/patents/figures/us-5121329-crump-fdm/fig-8-source-crop-v1.png",
    alt: "Figure 8 from US 5,121,329: sectional elevation of multi-orifice manifold.",
    width: 1000,
    height: 1100,
  },
  9: {
    src: "/patents/figures/us-5121329-crump-fdm/fig-9-source-crop-v1.png",
    alt: "Figure 9 from US 5,121,329: alternative embodiment with pressurized fluid supply tank and flexible conduit.",
    width: 1050,
    height: 1500,
  },
  10: {
    src: "/patents/figures/us-5121329-crump-fdm/fig-10-source-crop-v1.png",
    alt: "Figure 10 from US 5,121,329: alternative embodiment with ultrasonic vibratory fluidizing transducer.",
    width: 1000,
    height: 1500,
  },
  11: {
    src: "/patents/figures/us-5121329-crump-fdm/fig-11-source-crop-v1.png",
    alt: "Figure 11 from US 5,121,329: flow chart of computer CAD slicing and CAM toolpath command generation.",
    width: 1050,
    height: 1500,
  },
  12: {
    src: "/patents/figures/us-5121329-crump-fdm/fig-12-source-crop-v1.png",
    alt: "Figure 12 from US 5,121,329: perspective view of free-space wireframe strand object.",
    width: 1000,
    height: 1500,
  },
} as const;

const figure = (
  number: keyof typeof FIGURES,
  label = `FIG. ${number}`,
): CuratedSpecificationInline => {
  const meta = FIGURES[number];
  return {
    kind: "reference",
    referenceType: "figure",
    text: label,
    href: `#figure-${number}`,
    label: `Figure ${number} of US 5,121,329`,
    figurePreviews: [
      {
        src: meta.src,
        alt: meta.alt,
        width: meta.width,
        height: meta.height,
      },
    ],
  };
};

export const crumpFdmArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "a61b0395a405393ced9160aaa6a3e04624cb69f277eb6f64a070a3c3a0a51708",
  preparedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent [19]",
        "Crump",
        "[11] Patent Number: 5,121,329",
        "[45] Date of Patent: Jun. 9, 1992",
        "[54] APPARATUS AND METHOD FOR CREATING THREE-DIMENSIONAL OBJECTS",
        "[75] Inventor: S. Scott Crump, Minnetonka, Minn.",
        "[73] Assignee: Stratasys, Inc., Minneapolis, Minn.",
        "[21] Appl. No.: 429,012",
        "[22] Filed: Oct. 30, 1989",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEETS 1–3 OF 3",
      title: "Fused Deposition Modeling Apparatus, Heated Liquefier Head, and Layer Buildup",
      description: [
        {
          text: "5,121,329. Crump. Apparatus and Method for Creating Three-Dimensional Objects. Application Filed Oct. 30, 1989. Patented Jun. 9, 1992. ",
          kind: "text",
        },
        figure(1),
        { kind: "text", text: ", " },
        figure(2),
        { kind: "text", text: ", " },
        figure(3),
        { kind: "text", text: ", " },
        figure(4),
        { kind: "text", text: ", " },
        figure(5),
        { kind: "text", text: ", " },
        figure(6),
        { kind: "text", text: ", " },
        figure(7),
        { kind: "text", text: ", " },
        figure(8),
        { kind: "text", text: ", " },
        figure(9),
        { kind: "text", text: ", " },
        figure(10),
        { kind: "text", text: ", " },
        figure(11),
        { kind: "text", text: ", " },
        figure(12),
      ],
    },
    paragraph([
      { kind: "text", text: "This invention relates to an apparatus and process for forming a " },
      term(
        "three-dimensional article",
        "A solid physical object produced additively layer-by-layer rather than by subtractive machining or molding.",
      ),
      { kind: "text", text: " from a " },
      term(
        "computer-aided design (CAD)",
        "Digital volumetric solid model representation mathematically sliced into planar cross-sectional toolpaths.",
      ),
      {
        kind: "text",
        text: " database. More particularly, the invention is directed to an apparatus and method for creating three-dimensional physical objects of a predetermined shape by sequentially depositing multiple layers of solidifying material on a base member in a desired pattern, as illustrated in ",
      },
      figure(1),
      { kind: "text", text: "." },
    ]),
    paragraph([
      { kind: "text", text: "In the preferred embodiment shown in " },
      figure(1),
      { kind: "text", text: " and " },
      figure(2),
      { kind: "text", text: ", a movable dispensing head 10 incorporates a " },
      term(
        "heated liquefier flow passage",
        "A temperature-controlled heating block that raises solid feedstock filament above its melting or glass transition point into a flowable liquid state.",
      ),
      { kind: "text", text: " 20 terminating in a dispensing outlet comprising a calibrated " },
      term(
        "discharge nozzle tip",
        "Extrusion orifice of predetermined diameter (e.g. 0.005 to 0.050 inches / 0.127 to 1.27 mm) through which fluid thermoplastic is metered under pressure.",
      ),
      {
        kind: "text",
        text: " 22. A solid flexible strand or filament 12 is drawn from supply reel 14 by motor-driven ",
      },
      term(
        "pinch feed rollers",
        "Pair of counter-rotating serrated drive rollers that grip solid filament and act as a positive mechanical piston pump into the liquefier.",
      ),
      { kind: "text", text: " 28 and driven into liquefier 20 under positive pressure." },
    ]),
    paragraph([
      { kind: "text", text: "As depicted in " },
      figure(3),
      { kind: "text", text: " and " },
      figure(4),
      {
        kind: "text",
        text: ", the dispensing head 10 is maintained in close, working proximity to base member 18 or the preceding layer. The planar bottom face of discharge tip 22 provides a continuous shearing and ",
      },
      term(
        "flattening effect",
        "Planar mechanical ironing action of the nozzle tip that squashes extruded cylindrical bead into a flattened rectangular road with high interlayer contact area.",
      ),
      {
        kind: "text",
        text: " on the top surface of the dispensed thermoplastic bead 40, ensuring precise layer thickness control and eliminating accumulative Z-axis height errors.",
      },
    ]),
    paragraph([
      { kind: "text", text: "Referring to " },
      figure(5),
      { kind: "text", text: " and " },
      figure(6),
      {
        kind: "text",
        text: ", each successive planar cross-section is fabricated by depositing a continuous closed perimeter contour bead followed by back-and-forth raster vector infill passes 46. The newly extruded molten bead adheres and thermally welds to the preceding layer upon cooling below its ",
      },
      term(
        "solidification temperature",
        "Glass transition temperature Tg or melting point Tm where thermoplastic freezes into a rigid structural solid.",
      ),
      { kind: "text", text: ", building up solid, dense, high-strength articles." },
    ]),
    paragraph([
      { kind: "text", text: "As shown in " },
      figure(11),
      {
        kind: "text",
        text: ", CAD solid model data is sliced into parallel cross-sectional layers, and machine-level G-code drive signals are computed to actuate X, Y, and Z stepper motors in coordination with filament feed velocity. Free-space wireframe geometries (",
      },
      figure(12),
      { kind: "text", text: ") or multiple-orifice extrusion manifolds (" },
      figure(7),
      { kind: "text", text: " and " },
      figure(8),
      { kind: "text", text: ") may also be utilized within the scope of the invention." },
    ]),
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: 'Apparatus for making three-dimensional physical objects of a predetermined shape by sequentially depos iting multiple layers of solidifying material on a base member in a desired pattern, comprising: a movable head having flow-passage means therein connected to a dispensing outlet at one end thereof, said outlet comprising a tip with a discharge orifice of predetermined size therein; a supply of material which solidifies at a predeter mined temperature, and means for introducing said material in a fluid state into said flow-passage means; a base member disposed in close, working proximity to said dispensing outlet of said dispensing head; and mechanical means for moving said dispensing head and said base member relative to each other in three dimensions along "X," "Y,\u201d and "Z" axes in a rectangular coordinate system in a predetermined sequence and pattern and for displacing said dis pensing head a predetermined incremental distance relative to the base member and thence relative to each successive layer deposited prior to the com mencement of the formation of each successive layer to form multiple layers of said material of predetermined thickness which build up on each other sequentially as they solidify after discharge from said orifice; and means for metering the discharge of said material in a fluid stream from said discharge orifice at a prede termined rate onto said base member to form a 5,121,3 17 three-dimensional object as said dispensing head and base member are moved relative to each other.',
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1 wherein: said means for introducing said material in a fluid state comprises heating means disposed in close proximity to said flow passage means to maintain said material at a temperature above its solidifica tion temperature in said flow passage means and at said discharge orifice.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 2 wherein: O a temperature controller is connected to said heating means and temperature-sensing means is positioned on said dispensing head adjacent to said dispensing outlet, said sensing means being connected to said temperature controller, whereby said temperature 15 controller is operative to closely regulate said heat ing means and thus to accurately control the tem perature of said material.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 2 wherein: said supply of material is in solid form; and further including a material-advance mechanism op eratively associated with said solid material to ad vance said material through said supply chamber towards said flow-passage means, said heating means serving to melt said solid material to a flow 25 able, fluid state.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 4 wherein: said supply of solid material is in the form of a rod, and said material advance mechanism is in the form of fluid under pressure connected to power 30 advance means coupled to said rod. c",
        },
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 5 wherein: said rod is between 0.40 inches and 0.50 inches in diameter.",
        },
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 2 wherein: 35 said material is in the form of a continuous flexible strand; and further including material advance means operatively associated with said strand for the controlled ad vance of said strand of material through said supply chamber toward said flow passage means, said heating means serving to melt said flexible strand to a flowable, fluid state.",
        },
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 7 and further includ ing: 45 a supply reel on which said flexible strand is wound, and said material-advance means comprises means c for engaging said strand and pulling it from said reel.",
        },
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 7 wherein: 50 said flexible strand is a thermoplastic resin.",
        },
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        {
          kind: "text",
          text: 'Apparatus as defined in claim 1 wherein: said base member is supported for translational move ment along "X" and "Y" axes in a horizontal plane; and 55 said mechanical means comprises motor means opera tive to selectively move said base member along said "X\' and \'Y\' axes.',
        },
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        {
          kind: "text",
          text: 'Apparatus as defined in claim 1, and further com prising: a computer-aided design computer programmed to crease a three-dimensional drawing of a desired object or model, and software associated with said computer operative to convert the drawing into c multiple elevation layer data; and 65 a three-dimensional controller electronically linked to said mechanical means and operative to actuate said mechanical means in response to "X," "Y," 329 18 "Z" axis drive signals for each layer received from said computer.',
        },
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1 wherein: said material is a thermoplastic resin.",
        },
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1 wherein: said material is a wax.",
        },
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1 wherein: said material is a metal.",
        },
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1 wherein: a substrate having a sand particle-receiving surface is positioned on said base member, whereby the first layer of said material discharged from said dispens ing outlet is received on and hardens to a solid on said sand particle-receiving surface",
        },
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1 wherein: an open matrix substrate is positioned on said base member, whereby the first material discharged from said dispensing nozzle is received on and hardens to a solid on said open matrix substrate",
        },
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 16 wherein: said open matrix substrate is a fine, wire mesh screen.",
        },
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 17 wherein: said wire mesh screen has sand particles thereon.",
        },
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 17 wherein: said open matrix substrate is electrically conductive.",
        },
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1 wherein: said material includes magnetic particles and said base member has a magnetized surface thereon to attract said particles to said surface.",
        },
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1, and further in cluding: a plurality of dispensing outlets in a fluid-flow com munication with said flow-passage means; and a separate flow-regulating valve in fluid-flow control relation to each of said dispensing outlets.",
        },
      ],
    },
    {
      kind: "claim",
      number: 22,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1 wherein: said flow passage means comprises a plurality of flow passages communicating with a single discharge orifice; and a plurality of separate supply materials supported in input relation to each of said flow passages on said dispensing head.",
        },
      ],
    },
    {
      kind: "claim",
      number: 23,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1 wherein: the size of said dispensing outlet is variably adjust able.",
        },
      ],
    },
    {
      kind: "claim",
      number: 24,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1 and further in cluding: substrate having a plurality of small openings therein positioned on said base member, whereby the first material discharged from said dispensing nozzle is received on and anchored to said substrate as said material hardens to a solid.",
        },
      ],
    },
    {
      kind: "claim",
      number: 25,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1 wherein: said tip has a bottom surface positioned by said me chanical means in contact with the material being discharged as said dispensing head and base mem ber move relative to each other in the course of forming each layer to assist in controlling layer thickness.",
        },
      ],
    },
    {
      kind: "claim",
      number: 26,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 1 wherein: said material has solid particles entrained therein as discharged in said liquid stream.",
        },
      ],
    },
    {
      kind: "claim",
      number: 27,
      inlines: [
        {
          kind: "text",
          text: "A process for making a three-dimensional article comprising: introducing a supply of thermally solidifiable material in a fluid state into a flow passage of a discharge nozzle on a mechanically moveable dispensing head, said nozzle having a dispensing outlet at one 5,121, 19 end thereof in fluid-flow communication with said flow passage; dispensing said material from said dispensing outlet as a continuous, flowable fluid stream at a predeter mined temperature above the temperature at which it solidifies onto a base member positioned in close proximity to said nozzle; simultaneously with the dispensing of said material onto said base member, mechanically generating relative movement of said base member and said O dispensing head with respect to each other in a predetermined pattern to form a first layer of said material on said base member; and displacing said dispensing head a predetermined layer thickness distance from said first layer, and after 15 the portion of said first layer adjacent said nozzle has cooled and solidified, dispensing a second layer of said material in a fluid state onto said first layer from said dispensing outlet while simultaneously moving said base member and said dispensing head 20 relative to each other, whereby said second layer solidifies upon cooling and adheres to said first layer to form a three-dimensional article; and forming multiple layers of said material built up on top of each other in multiple passes by repeated dispensing of said material in a fluid state from said dispensing outlet as said base member and said dispensing head are moved relative to each other, with said dispensing head and said base member being displaced a predetermined distance after 30 each preceding layer is formed, and with the dis pensing of each successive layer being controlled to take place after the material in the preceding layer immediately adjacent to said nozzle has solid ified. 35",
        },
      ],
    },
    {
      kind: "claim",
      number: 28,
      inlines: [
        {
          kind: "text",
          text: "The process of claim 27 wherein: said dispensing head and said base member are dis placed a distance not greater than 0.002 inches after each of said passes to thereby build up very thin multiple layers of said material forming a three-di mensional article.",
        },
      ],
    },
    {
      kind: "claim",
      number: 29,
      inlines: [
        {
          kind: "text",
          text: "The process of claim 27 wherein: said dispensing head and said base member are dis placed a distance between 0.000 inches and 0.125 inches after each of said passes. 45",
        },
      ],
    },
    {
      kind: "claim",
      number: 30,
      inlines: [
        {
          kind: "text",
          text: "The process of claim 27 and further including: introducing said material in a solid state into said dispensing head, and heating said material in said dispensing head to a temperature above its solidifi cation temperature, and controlling the tempera 50 ture of said material within a range of plus or minus one degree centigrade of said temperature.",
        },
      ],
    },
    {
      kind: "claim",
      number: 31,
      inlines: [
        {
          kind: "text",
          text: "The process of claim 30 wherein: said material is introduced into said dispensing head as a flexible strand from a source of supply thereof. 55",
        },
      ],
    },
    {
      kind: "claim",
      number: 32,
      inlines: [
        {
          kind: "text",
          text: "The process of claim 27 wherein: said base member has a substrate thereon which is heat conductive and onto which the material is dispensed, and further including heating said sub strate after said article is formed to facilitate separa tion of the article from the base member.",
        },
      ],
    },
    {
      kind: "claim",
      number: 33,
      inlines: [
        {
          kind: "text",
          text: "The process of claim 27 wherein: said base member has an electrically conductive sub strate thereon onto which said material is dis pensed, and further including passing an electric 65 current through said substrate after the article is formed to generate heat and thereby assist in sepa rating the article from said base member. ,329 20",
        },
      ],
    },
    {
      kind: "claim",
      number: 34,
      inlines: [
        {
          kind: "text",
          text: "The process of claim 27 wherein: said material is selected from the group comprising aluminum, bismuth, pewter, copper, gold, silver, lead, magnesium, nickel, platinum, Steel, titanium. and plutonium.",
        },
      ],
    },
    {
      kind: "claim",
      number: 35,
      inlines: [
        {
          kind: "text",
          text: 'The process of claim 27 and further including: controlling the volumetric rate at which said material is introduced into said discharge nozzle propor tionally in response to the resultant "X," "Y" speed of the dispensing head and base member relative to each other, whereby the flow of material from said dispensing outlet will be at a proper volumetric rate to control material build-up in forming an article.',
        },
      ],
    },
    {
      kind: "claim",
      number: 36,
      inlines: [
        {
          kind: "text",
          text: "A process for making a three-dimensional article comprising: creating a drawing of a three-dimensional article on a computer in a computer-aided design process 0 wherein the drawing comprises a plurality of seg ments defining said article; generating programmed signals corresponding to each of said segments in a predetermined sequence; dispensing a solidifiable material in a fluid state from a dispensing head at predetermined conditions such that said material will solidify substantially instan taneously at ambient conditions into which said material is dispensed; simultaneously with the dispensing of said material, and in response to said programmed signals, me chanically generating relative movement between said head and a base member positioned in close proximity thereto in a predetermined sequence and pattern of multiple movements along a plurality of axes of a rectangular coordinate system such that at least a portion of the dispensed material is depos ited on and anchored to said base member, said material being dispensed in free space as a plurality of upstanding segments sequentially formed so that the last dispensed segment overlies at least a por tion of the preceding segment in contact therewith to thereby form a three-dimensional article of pre determined design anchored to said base member.",
        },
      ],
    },
    {
      kind: "claim",
      number: 37,
      inlines: [
        {
          kind: "text",
          text: "The process of claim 36 wherein: said upstanding segments are each dispensed and formed to be anchored to said base member at spaced-apart locations thereon and to intersect each other to define said article as a wire frame network.",
        },
      ],
    },
    {
      kind: "claim",
      number: 38,
      inlines: [
        {
          kind: "text",
          text: "The process of claim 36 wherein: said material is a thermally solidifiable material; and ultrasonically vibrating said material in said dispens ing head to thereby pressurize said material and lower its solidification temperature; and cooling said material to a temperature just below its ambient solidification temperature prior to dis charge from said dispensing head, whereby said material solidifies instantaneously upon discharge from said nozzle into ambient conditions in the absence of the energy imparted to it by said ultra sonic vibration.",
        },
      ],
    },
    {
      kind: "claim",
      number: 39,
      inlines: [
        {
          kind: "text",
          text: "A process for making a three-dimensional article comprising: dispensing a solidifiable material in a fluid state from a dispensing head having a tip with a discharge orifice therein, said tip having a substantially planar bottom surface, said material being one of which will solidify at ambient conditions; 5,121,3 21 maintaining a predetermined gap distance between said planar bottom surface of said tip and a base member positioned in close proximity thereto, with said material being dispensed onto said base men ber; 5 simultaneously with the dispensing of said material onto said base member, generating relative move ment between said base member and said dispens ing head in the plane of said base member to form o a first layer of said material on said base member; 10 i and m displacing said dispensing head a predetermined dis tance with respect to said first layer, and then dis pensing a second layer of said material in a fluid state onto said first layer form said discharge ori- 15 fice while generating relative movement between said base member and said dispensing head in the plane of said base member, with said planar bottom surface of said tip being maintained substantially parallel to said first layer and to the plane of said 20 base member, whereby said tip planar bottom sur face provides a shearing effect on the top surface of said second layer of material as it is dispensed to thus closely control the absolute location of succes sive layers with respect to the base member and to 25 avoid any accumulative error in layer build-up, and to maintain a smooth layer surface.",
        },
      ],
    },
    {
      kind: "claim",
      number: 40,
      inlines: [
        {
          kind: "text",
          text: "The process of claim 39 wherein: said material is a multiple component composition comprised of material components which react 30 with each other.",
        },
      ],
    },
    {
      kind: "claim",
      number: 41,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 39 wherein: said substrate is a fine, wire mesh screen.",
        },
      ],
    },
    {
      kind: "claim",
      number: 42,
      inlines: [
        {
          kind: "text",
          text: "Apparatus as defined in claim 47 wherein: said wire mesh screen has sand particles thereon. 35",
        },
      ],
    },
    {
      kind: "claim",
      number: 43,
      inlines: [
        {
          kind: "text",
          text: "Apparatus for making three-dimensional, physical objects of a predetermined shape by depositing solidify ing material on a base member in a desired pattern com prising: a dispensing head having means to hold a supply of 40 material and to dispense such material in a fluid state; a base member disposed in close, working proximity to said dispensing head; an open matrix substrate on said base member; 45 means for moving said dispensing head and said base member relative to each other in a predetermined sequence and pattern of movement simultaneously 50 55 65 329 22 with the discharge of fluid material onto said sub strate commencing with the initial discharge of material onto said substrate, whereby the first ma terial dispensed from said dispensing head is re ceive on and hardens to a solid on said open matrix substrate to thereby firmly anchor the article being formed.",
        },
      ],
    },
    {
      kind: "claim",
      number: 44,
      inlines: [
        {
          kind: "text",
          text: 'Apparatus for making three-dimensional physical objects of a predetermined shape by sequentially depos iting multiple layers of solidifying material on a base member in a desired pattern, comprising: a movable dispensing head having flow-passage means therein connected to a dispensing outlet at one end thereof. a supply material which solidifies at a predetermined temperature, and means for introducing said mate rial in a fluid state into said flow-passage means; a base member disposed in close, working proximity to said dispensing outlet of said dispensing head; mechanical means for moving said dispensing head and said base member relative to each other in three dimensions along "X." "Y," and "Z" axes in a rectangular coordinate system in a predetermined sequence and pattern; means for metering the discharge of said material in a fluid state from said dispensing outlet at a predeter mined rate onto said base member to form a three dimensional object as said dispensing head and base member are moved relative to each other; said dispensing head comprising a supply chamber communicating with said flow-passage means and containing a supply of said material upstream of said flow-passage means in the direction of material movement toward said dispensing outlet, and a discharge nozzle having said fluid passage means therein, said dispensing outlet being at the tip of said nozzle; and heating means on said dispensing head controlled to heat said material to a temperature above its solidi fication temperature, said heating means compris ing a first, main heater adjacent to said supply of material in said supply chamber and second heater on said nozzle adjacent to said flow passage means, said second heater serving to maintain said material at a temperature above its solidification point in said flow-passage means and at said dispensing outlet. x: k k k k',
        },
      ],
    },
  ],
};

export const crumpFdmParallelReadings: Record<number, string[]> = {
  2: [
    "General field and scope of FDM additive manufacturing: creating 3D physical objects by sequentially depositing multiple layers of solidifying material on a base member in a desired pattern from CAD data.",
  ],
  3: [
    "Liquefier head and mechanical filament drive architecture: solid flexible filament drawn from a supply reel by motor-driven pinch feed rollers and driven into a heated liquefier flow passage.",
  ],
  4: [
    "Nozzle tip geometry and planar shearing action: calibrated discharge orifice tip maintained in close working proximity to the base member or preceding layer, ironing and flattening the extruded bead to eliminate accumulative Z errors.",
  ],
  5: [
    "Perimeter contour and raster vector infill deposition: perimeter pass defining part shell followed by back-and-forth hatching passes, with thermal fusion welding layers together upon cooling.",
  ],
  6: [
    "Computer CAD slicing and multi-axis Cartesian motion control: digital solid model sliced into planar toolpaths driving coordinated X-Y-Z stepper motors and filament feed rate.",
  ],
};
