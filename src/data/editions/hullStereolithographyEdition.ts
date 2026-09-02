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
    src: "/patents/figures/us-4575330-hull-stereolithography/fig-1-source-crop-v1.png",
    alt: "Figure 1 from US 4,575,330: flow chart calling for individual solid laminae representing cross-sections of the object, then their combination into a three-dimensional object.",
    width: 1985,
    height: 1490,
  },
  2: {
    src: "/patents/figures/us-4575330-hull-stereolithography/fig-2-source-crop-v1.png",
    alt: "Figure 2 from US 4,575,330: flow chart for containing a curable fluid, applying patterned stimulation at its surface, superimposing adjacent laminae, and producing an object.",
    width: 1990,
    height: 1488,
  },
  3: {
    src: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
    alt: "Figure 3 from US 4,575,330: combined block diagram, schematic, and elevational section of the preferred stereolithography system with a container, working surface, light source, computer, and elevator platform.",
    width: 2055,
    height: 2932,
  },
  4: {
    src: "/patents/figures/us-4575330-hull-stereolithography/fig-4-source-crop-v1.png",
    alt: "Figure 4 from US 4,575,330: elevation view of an alternative stereolithography system using bottom-exposure through a transparent container base.",
    width: 1985,
    height: 1682,
  },
  5: {
    src: "/patents/figures/us-4575330-hull-stereolithography/fig-5-source-crop-v1.png",
    alt: "Figure 5 from US 4,575,330: elevational section of a third embodiment using a collimated broad ultraviolet source and an apertured mask.",
    width: 1990,
    height: 1287,
  },
  6: {
    src: "/patents/figures/us-4575330-hull-stereolithography/fig-6-source-crop-v1.png",
    alt: "Figure 6 from US 4,575,330: elevation view of a stereolithography system utilizing a cathode ray tube (CRT) faceplate exposure source.",
    width: 1020,
    height: 1490,
  },
  7: {
    src: "/patents/figures/us-4575330-hull-stereolithography/fig-7-source-crop-v1.png",
    alt: "Figure 7 from US 4,575,330: partial elevational section of the Figure 3 system with an adjustable elevator platform in its conventional position.",
    width: 991,
    height: 1489,
  },
  8: {
    src: "/patents/figures/us-4575330-hull-stereolithography/fig-8-source-crop-v1.png",
    alt: "Figure 8 from US 4,575,330: partial elevational section of the Figure 3 system with the adjustable elevator platform rotated so a supplementary structure can be formed at one side of the object.",
    width: 1975,
    height: 1489,
  },
} as const;

const figure = (
  label: string,
  numbers: readonly (keyof typeof FIGURES)[],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Preview ${label} from US 4,575,330 source facsimile`,
  figurePreviews: numbers.map((n) => FIGURES[n]),
});

const claim = (number: number, inlines: CuratedSpecificationInlines) => ({
  kind: "claim" as const,
  number,
  inlines,
});

export const hullStereolithographyParallelReadings: Record<number, string[]> = {
  3: [
    "Hull defines the subject narrowly as an apparatus that uses lithographic techniques to form three-dimensional objects rapidly, reliably, accurately, and economically.",
  ],
  4: [
    "The background identifies prototype iteration and tooling cost as the manufacturing problem: molding favors high volume, while short-run alternatives cost more or yield lower-quality parts.",
  ],
  5: [
    "The earlier systems tried to cure a point deep in a liquid volume by intersecting beams. Hull explains that intensity loss and optical effects make their control and resolution difficult.",
  ],
  6: [
    "This paragraph states the industrial need for a direct, economical path from a design through a prototype to automatic production at larger scale.",
  ],
  7: [
    "Hull says his system answers that need by avoiding the prior art's difficult focusing, alignment, and exposure-control arrangement rather than merely improving it incrementally.",
  ],
  9: [
    "The summary's core causal chain is surface formation of adjacent cross-sectional laminae in a fluid, followed by automatic integration into the three-dimensional object.",
  ],
  10: [
    "Hull connects computer-generated graphics with stereolithography so CAD instructions can drive manufacturing; he expressly includes prototypes, manufacturing, and art as possible uses.",
  ],
  11: [
    "The grant's definition is layerwise: a programmed UV spot forms a solid cross-section, the object moves by one layer thickness, and the next cross-section adheres to the prior one.",
  ],
  12: [
    "The invention is not confined to simple forms because a computer can prepare the programmed commands and send them to the object-forming subsystem.",
  ],
  13: [
    "Hull keeps the stimulation concept broad, listing particle bombardment, chemical application through a mask or ink jet, and radiation other than ultraviolet light.",
  ],
  14: [
    "This is the complete operational sequence: contain a curable fluid, pattern stimulation at its working surface, move the first lamina away, let new liquid enter, and adhere repeated layers.",
  ],
  15: [
    "Hull explains the user-facing advantage: a designer can make and inspect a part directly from the computer, revise the design, and repeat without producing conventional tooling drawings.",
  ],
  16: [
    "The claimed approach is framed as especially useful for short runs because it removes tooling and setup time, while still allowing custom parts and models before costly material choices.",
  ],
  17: [
    "The summary concludes that the apparatus answers a long-standing CAD/CAM need by promising rapid, reliable, accurate, and economical fabrication of plastic parts.",
  ],
  18: [
    "This transition sentence tells the reader that the following detailed description and drawings supply the support for the stated objects and advantages.",
  ],
  20: [
    "The drawing list distinguishes two conceptual flow charts, the preferred system, three alternative exposure arrangements, and an elevator-platform modification with additional freedom.",
  ],
  22: [
    "The detailed description connects liquid-state chemistry, lithography, CAD/CAM, and the Figure 1–2 flow sequence: repeatedly form and integrate thin cross-sections at the fluid's surface.",
  ],
  23: [
    "For the preferred Figure 3 arrangement, the patent identifies a UV-curable liquid, a computer-controlled movable spot, and an elevator platform; it also states the material and cleanup properties required.",
  ],
  24: [
    "The working source is a 350-watt mercury short-arc lamp coupled into a fiber-optic bundle, shutter, lens tube, and plotter—not the later galvanometer-laser configuration often associated with SLA.",
  ],
  25: [
    "This section explains the elevator, H-P control hardware, computer roles, fluid-level control, post-build rinse and flood cure, and the option to select different materials from several containers.",
  ],
  26: [
    "The alternatives cover a lower liquid interface, fixed-mask exposure, CRT exposure, a rotatable platform, commercial safety provisions, other stimulation sources, and the shared two-dimensional-surface principle.",
  ],
};

export const hullStereolithographyArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "5dc2211b18f88883ee92394917154d57d102b73c26a4744332cbf0d89b1db1c7",
  preparedBy: "Classic Patents editorial agent (GPT-5 Codex)",
  preparedAt: "2026-09-02",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent [19]",
        "Hull",
        "[11] Patent Number: 4,575,330",
        "[45] Date of Patent: Mar. 11, 1986",
        "APPARATUS FOR PRODUCTION OF THREE-DIMENSIONAL OBJECTS BY STEREOLITHOGRAPHY",
        "Inventor: Charles W. Hull, Arcadia, Calif.",
        "Assignee: UVP, Inc., San Gabriel, Calif.",
        "Appl. No.: 638,905",
        "Filed: Aug. 8, 1984",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEETS 1–4 OF 4",
      title: "Stereolithography Apparatus, Laser Scanning Systems, and Immiscible Fluid Interfaces",
      description: [
        {
          text: "4,575,330. Hull. Apparatus for Production of Three-Dimensional Objects by Stereolithography. Application Filed Aug. 8, 1984. Patented Mar. 11, 1986. ",
          kind: "text",
        },
        figure("FIG. 1", [1]),
        { kind: "text", text: ", " },
        figure("FIG. 2", [2]),
        { kind: "text", text: ", " },
        figure("FIG. 3", [3]),
        { kind: "text", text: ", " },
        figure("FIG. 4", [4]),
        { kind: "text", text: ", " },
        figure("FIG. 5", [5]),
        { kind: "text", text: ", " },
        figure("FIG. 6", [6]),
        { kind: "text", text: ", " },
        figure("FIG. 7", [7]),
        { kind: "text", text: ", " },
        figure("FIG. 8", [8]),
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND OF THE INVENTION",
    },
    paragraph([
      {
        kind: "text",
        text: "This invention relates generally to improvements in apparatus for forming three-dimensional objects from a fluid medium and, more particularly, to ",
      },
      term(
        "stereolithography",
        "Hull's term for applying lithographic techniques to the production of three-dimensional objects, here by forming and joining curable-material layers.",
      ),
      {
        kind: "text",
        text: " involving the application of lithographic techniques to production of three-dimensional objects, whereby such objects can be formed rapidly, reliably, accurately and economically.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "It is common practice in the production of plastic parts and the like to first design such a part and then painstakingly produce a prototype of the part, all involving considerable time, effort and expense. The design is then reviewed and, oftentimes, the laborious process is again and again repeated until the design has been optimized. After design optimization, the next step is production. Most production plastic parts are injection molded. Since the design time and tooling costs are very high, plastic parts are usually only practical in high volume production. While other processes are available for the production of plastic parts, including direct machine work, vacuum-forming and direct forming, such methods are typically only cost effective for short run production, and the parts produced are usually inferior in quality to molded parts.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In recent years, very sophisticated techniques have been developed for generating three-dimensional objects within a fluid medium which is selectively cured by beams of radiation brought to selective focus at prescribed intersection points within the three-dimensional volume of the fluid medium. Typical of such three-dimensional systems are those described in U.S. Pat. Nos. 4,041,476, 4,078,229, 4,238,840 and 4,288,861. All of these systems rely upon the buildup of synergistic energization at selected points deep within the fluid volume, to the exclusion of all other points in the fluid volume, using a variety of elaborate multibeam techniques. In this regard, the various approaches described in the prior art include the use of a pair of electromagnetic radiation beams directed to intersect at specified coordinates, wherein the various beams may be of the same or differing wavelengths, or where beams are used sequentially to intersect the same points rather than simultaneously, but in all cases only the beam intersection points are stimulated to sufficient energy levels to accomplish the necessary curing process for forming a three-dimensional object within the volume of the fluid medium. Unfortunately, however, such three-dimensional forming systems face a number of problems with regard to resolution and exposure control. The loss of radiation intensity and image forming resolution of the focused spots as the intersections move deeper into the fluid medium create rather obvious complex control situations. Absorption, diffusion, dispersion and defraction all contribute to the difficulties of working deep within the fluid medium on any economical and reliable basis.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Yet there continues to be a long existing need in the design and production arts for the capability of rapidly and reliably moving from the design stage to the prototype stage and to ultimate production, particularly moving directly from computer designs for such plastic parts to virtually immediate prototypes and the facility for large scale production on an economical and automatic basis.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Accordingly, those concerned with the development and production of three-dimensional plastic objects and the like have long recognized the desirability for further improvement in more rapid, reliable, economical and automatic means which would facilitate quickly moving from a design stage to the prototype stage and to production, while avoiding the complicated focusing, alignment and exposure problems of the prior art three dimensional production systems. The present invention clearly fulfills all of these needs.",
      },
    ]),
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    paragraph([
      {
        kind: "text",
        text: "Briefly, and in general terms, the present invention provides a new and improved system for generating a three-dimensional object by forming successive, adjacent, cross-sectional laminae of that object at the surface of a fluid medium capable of altering its physical state in response to appropriate synergistic stimulation, the successive laminae being automatically integrated as they are formed to define the desired three-dimensional object.",
      },
    ]),
    paragraph([
      { kind: "text", text: '"' },
      term(
        "Stereolithography",
        "Hull defines this exact expression as a method and apparatus that successively prints thin layers of a curable material to make a solid object.",
      ),
      {
        kind: "text",
        text: '" is a method and apparatus for making solid objects by successively "printing" thin layers of a curable material, e.g., a UV curable material, one on top of the other. A programmed movable spot beam of UV light shining on a surface or layer of UV curable liquid is used to form a solid cross-section of the object at the surface of the liquid. The object is then moved, in a programmed manner, away from the liquid surface by the thickness of one layer, and the next cross-section is then formed and adhered to the immediately preceding layer defining the object. This process is continued until the entire object is formed.',
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Essentially all types of object forms can be created with the technique of the present invention. Complex forms are more easily created by using the functions of a computer to help generate the programmed commands and to then send the program signals to the stereolithographic object forming subsystem.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Of course, it will be appreciated that other forms of appropriate synergistic stimulation for a curable fluid medium, such as particle bombardment (electron beams and the like), chemical reactions by spraying materials through a mask or by ink jets, or impinging radiation other than ultraviolet light, may be used in the practice of the invention without departing from the spirit and scope of the invention.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "By way of example, in the practice of the present invention, a body of a fluid medium capable of solidification in response to prescribed stimulation is first appropriately contained in any suitable vessel to define a designated working surface of the fluid medium at which successive cross-sectional laminae can be generated. Thereafter, an appropriate form of synergistic stimulation, such as a spot of UV light or the like, is applied as a graphic pattern at the specified working surface of the fluid medium to form thin, solid, individual layers at that surface, each layer representing an adjacent cross-section of the three-dimensional object to be produced. Superposition of successive adjacent layers on each other is automatically accomplished, as they are formed, to integrate the layers and define the desired three-dimensional object. In this regard, as the fluid medium cures and solid material forms as a thin lamina at the working surface, a suitable platform to which the first lamina is secured is moved away from the working surface in a programmed manner by any appropriate actuator, typically all under the control of a micro-computer of the like. In this way, the solid material that was initially formed at the working surface is moved away from that surface and new liquid flows into the working surface position. A portion of this new liquid is, in turn, converted to solid material by the programmed UV light spot to define a new lamina, and this new lamina adhesively connects to the material adjacent to it, i.e., the immediately preceding lamina. This process continues until the entire three-dimensional object has been formed. The formed object is then removed from the container and the apparatus is ready to produce another object, either identical to the first object or an entirely new object generated by a computer or the like.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The stereolithographic apparatus of the present invention has many advantages over currently used apparatus for producing plastic objects. The apparatus of the present invention avoids the need of producing design layouts and drawings, and of producing tooling drawings and tooling. The designer can work directly with the computer and a stereolithographic device, and when he is satisfied with the design as displayed on the output screen of the computer, he can fabricate a part for direct examination. If the design has to be modified, it can be easily done through the computer, and then another part can be made to verify that the change was correct. If the design calls for several parts with interacting design parameters, the method of the invention becomes even more useful because all of the part designs can be quickly changed and made again so that the total assembly can be made and examined, repeatedly if necessary.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "After the design is complete, part production can begin immediately, so that the weeks and months between design and production are avoided. Ultimate production rates and parts costs should be similar to current injection molding costs for short run production, with even lower labor costs than those associated with injection molding. Injection molding is economical only when large numbers of identical parts are required. Stereolithography is useful for short run production because the need for tooling is eliminated and production set-up time is minimal. Likewise, design changes and custom parts are easily provided using the technique. Because of the ease of making parts, stereolithography can allow plastic parts to be used in many places where metal or other material parts are now used. Moreover, it allows plastic models of objects to be quickly and economically provided, prior to the decision to make more expensive metal or other material parts.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Hence, the stereolithographic apparatus of the present invention satisfies a long existing need for a CAD and CAM system capable of rapidly, reliably, accurately and economically designing and fabricating three-dimensional plastic parts and the like.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The above and other objects and advantages of this invention will be apparent from the following more detailed description when taken in conjunction with the accompanying drawings of illustrative embodiments.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In a presently preferred embodiment, by way of example and not necessarily by way of limitation, the present invention harnesses the principles of computer generated graphics in combination with stereolithography, i.e., the application of lithographic techniques to the production of three dimensional objects, to simultaneously execute computer aided design (CAD) and computer aided manufacturing (CAM) in producing three-dimensional objects directly from computer instructions. The invention can be applied for the purposes of sculpturing models and prototypes in a design phase of product development, or as a manufacturing system, or even as a pure art form.",
      },
    ]),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWINGS",
    },
    paragraph([
      figure("FIG. 1", [1]),
      {
        kind: "text",
        text: " and ",
      },
      figure("FIG. 2", [2]),
      {
        kind: "text",
        text: " are flow charts illustrating the basic concepts employed in practicing the method of stereolithography of the present invention; ",
      },
      figure("FIG. 3", [3]),
      {
        kind: "text",
        text: " is a combined block diagram, schematic and elevational sectional view of a presently preferred embodiment of a system for practicing the invention; ",
      },
      figure("FIG. 4", [4]),
      {
        kind: "text",
        text: " is an elevational sectional view of a second embodiment of a stereolithography system for the practice of the invention; ",
      },
      figure("FIG. 5", [5]),
      {
        kind: "text",
        text: " is an elevational sectional view, illustrating a third embodiment of the present invention; ",
      },
      figure("FIG. 6", [6]),
      {
        kind: "text",
        text: " is an elevational sectional view illustrating still another embodiment of the present invention; and ",
      },
      figure("FIG. 7", [7]),
      { kind: "text", text: " and " },
      figure("FIG. 8", [8]),
      {
        kind: "text",
        text: " are partial, elevational sectional views, illustrating a modification of the stereolithographic system of FIG. 3 to incorporate an elevator platform with multiple degrees of freedom.",
      },
    ]),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS",
    },
    paragraph([
      {
        kind: "text",
        text: "Referring now to the drawings, ",
      },
      figure("FIGS. 1 and 2", [1, 2]),
      {
        kind: "text",
        text: " are flow charts illustrating the basic system of the present invention for generating three-dimensional objects by means of stereolithography. Many liquid state chemicals are known which can be induced to change to solid state polymer plastic by irradiation with ultraviolet light (UV) or other forms of synergistic stimulation such as electron beams, visible or invisible light, reactive chemicals applied by ink jet or via a suitable mask. UV curable chemicals are currently used as ink for high speed printing, in processes of coating of paper and other materials, as adhesives, and in other specialty areas.\n\nLithography is the art of reproducing graphic objects, using various techniques. Modern examples include photographic reproduction, xerography, and microlithography, as is used in the production of micro-electronics. Computer generated graphics displayed on a plotter or a cathode ray tube are also forms of lithography, where the image is a picture of a computer coded object.\n\nComputer aided design (CAD) and computer aided manufacturing (CAM) are techniques that apply the abilities of computers to the processes of designing and manufacturing. A typical example of CAD is in the area of electronic printed circuit design, where a computer and plotter draw the design of a printed circuit board, given the design parameters as computer data input. A typical example of CAM is a numerically controlled milling machine, where a computer and a milling machine produce metal parts, given the proper programming instructions. Both CAD and CAM are important and are rapidly growing technologies.\n\nA prime object of the present invention is to harness the principles of computer generated graphics, combined with UV curable plastic and the like, to simultaneously execute CAD and CAM, and to produce three-dimensional objects directly from computer instructions. This invention, referred to as stereolithography, can be used to sculpture models and prototypes in a design phase of product development, or as a manufacturing device, or even as an art form.\n\nReferring now to FIG. 1, the stereolithographic method is broadly outlined. Step 10 in FIG. 1 calls for the generation of individual solid laminae representing cross-sections of a three-dimensional object to be formed. Step 11, which inherently occurs if Step 10 is performed properly, combines the successively formed adjacent laminae to form the desired three-dimensional object which has been programmed into the system for selective curing. Hence, the stereolithographic system of the present invention generates three-dimensional objects by creating a cross-sectional pattern of the object to be formed at a selected surface of a fluid medium, e.g., a UV curable liquid or the like, capable of altering its physical state in response to appropriate synergistic stimulation such as impinging radiation, electron beam or other particle bombardment, or applied chemicals (as by ink jet or spraying over a mask adjacent the fluid surface), successive adjacent laminae, representing corresponding successive adjacent cross-sections of the object, being automatically formed and integrated together to provide a step-wise laminar or thin layer buildup of the object, whereby a three-dimensional object is formed and drawn from a substantially planar or sheet-like surface of the fluid medium during the forming process.\n\nThe aforedescribed technique is more specifically outlined in the flowchart of FIG. 2, wherein Step 12 calls for containing a fluid medium capable of solidification in response to prescribed reactive stimulation. Step 13 calls for application of that stimulation as a graphic pattern at a designated fluid surface to form thin, solid, individual layers at that surface, each layer representing an adjacent cross-section of a three-dimensional object to be produced. It is desirable to make each such layer as thin as possible during the practice of the invention in order to maximize resolution and the accurate reproduction of the three-dimensional object being formed. Hence, the ideal theoretical state would be an object produced only at the designated working surface of the fluid medium to provide an infinite number of laminae, each lamina having a cured depth of approximately only slightly more than zero thickness. Of course, in the practical application of the invention, each lamina will be a thin lamina, but thick enough to be adequately cohesive in forming the cross-section and adhering to the adjacent laminae defining other cross-sections of the object being formed.\n\nStep 14 in FIG. 2 calls for superimposing successive adjacent layers or laminae on each other as they are formed, to integrate the various layers and define the desired three-dimensional object. In the normal practice of the invention, as the fluid medium cures and solid material forms to define one lamina, that lamina is moved away from the working surface of the fluid medium and the next lamina is formed in the new liquid which replaces the previously formed lamina, so that each successive lamina is superimposed and integral with (by virtue of the natural adhesive properties of the cured fluid medium) all of the other cross-sectional laminae. Hence, the process of producing such cross-sectional laminae is repeated over and over again until the entire three-dimensional object has been formed. The object is then removed and the system is ready to produce another object which may be identical to the previous object or may be an entirely new object formed by changing the program controlling the stereolithographic system.\n\nFIGS. 3-8 of the drawings illustrate various apparatus suitable for implementing the stereolithographic methods illustrated and described by the flow charts of FIGS. 1 and 2.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: 'As previously indicated, "Stereolithography" is a method and apparatus for making solid objects by successively "printing" thin layers of a curable material, e.g., a UV curable material, one on top of the other. A programmed movable spot beam of UV light shining on a surface or layer of UV curable liquid is used to form a solid cross-section of the object at the surface of the liquid. The object is then moved, in a programmed manner, away from the liquid surface by the thickness of one layer and the next cross-section is then formed and adhered to the immediately preceding layer defining the object. This process is continued until the entire object is formed.\n\nEssentially all types of object forms can be created with the technique of the present invention. Complex forms are more easily created by using the functions of a computer to help generate the programmed commands and to then send the program signals to the stereolithographic object forming subsystem.\n\nA presently preferred embodiment of the stereolithographic system is shown in elevational cross-section in FIG. 3. A container 21 is filled with a UV curable liquid 22 or the like, to provide a designated working surface 23. A programmable source of ultraviolet light 26 or the like produces a spot of ultraviolet light 27 in the plane of surface 23. The spot 27 is movable across the surface 23 by the motion of mirrors or other optical or mechanical elements (not shown) that are a part of light source 26. The position of the spot 27 on surface 23 is controlled by a computer or other programming device 28. A movable elevator platform 29 inside container 21 can be moved up and down selectively, the position of the platform being controlled by the computer 28. As the device operates, it produces a three-dimensional object 30 by step-wise buildup of integrated laminae such as 30a, 30b, 30c.\n\nThe surface of the UV curable liquid 22 is maintained at a constant level in the container 21, and the spot of UV light 27, or other suitable form of reactive stimulation, of sufficient intensity to cure the liquid and convert it to a solid material is moved across the working surface 23 in a programmed manner. As the liquid 22 cures and solid material forms, the elevator platform 29 that was initially just below surface 23 is moved down from the surface in a programmed manner by any suitable actuator. In this way, the solid material that was initially formed is taken below surface 23 and new liquid 22 flows across the surface 23. A portion of this new liquid is, in turn, converted to solid material by the programmed UV light spot 27, and the new material adhesively connects to the material below it. This process is continued until the entire three-dimensional object 30 is formed. The object 30 is then removed from the container 21, and the apparatus is ready to produce another object. Another object can then be produced, or some new object can be made by changing the program in the computer 28.\n\nThe curable liquid 22, e.g., UV curable liquid, must have several important properties. (A) It must cure fast enough with the available UV light source to allow practical object formation times. (B) It must be adhesive, so that successive layers will adhere to each other. (C) Its viscosity must be low enough so that fresh liquid material will quickly flow across the surface when the elevator moves the object. (D) It should absorb UV so that the film formed will be reasonably thin. (E) It must be reasonably soluble in some solvent in the liquid state, and reasonably insoluble in that same solvent in the solid state, so that the object can be washed free of the UV cure liquid and partially cured liquid after the object has been formed. (F) It should be as non-toxic and non-irritating as possible.\n\nThe cured material must also have desirable properties once it is in the solid state. These properties depend on the application involved, as in the conventional use of other plastic materials. Such parameters as color, texture, strength, electrical properties, flammability, and flexibility are among the properties to be considered. In addition, the cost of the material will be important in many cases.\n\nThe UV curable material used in the presently preferred embodiment of a working stereolithograph (e.g., FIG. 3) is Potting Compound 363, a modified acrylate, made by Locktite Corporation of Newington, CT. A process to make a typical UV curable material is described in U.S. Pat. No. 4,100,141, entitled Stabilized Adhesive and Curing Compositions.',
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: 'The light source 26 produces the spot 27 of UV light small enough to allow the desired object detail to be formed, and intense enough to cure the UV curable liquid being used quickly enough to be practical. The source 26 is arranged so it can be programmed to be turned off and on, and to move, such that the focused spot 27 moves across the surface 23 of the liquid 22. Thus, as the spot 27 moves, it cures the liquid 22 into a solid, and "draws" a solid pattern on the surface in much the same way a chart recorder or plotter uses a pen to draw a pattern on paper.\n\nThe light source 26 for the presently preferred embodiment of a stereolithograph is made using a 350 watt mercury short arc lamp in a housing, with the light output of the housing focused on the end of a 1 mm diameter UV transmitting fiber optic bundle (not shown). The end of the bundle next to the lamp is water cooled, and there is an electronically controlled shutter blade between the lamp and the end of the bundle, which can turn the light through the bundle on and off. The bundle is 1 meter long, and the optical output is fitted into a lens tube that has a quartz to focus the UV to a spot. The light source 26 is capable of producing a spot somewhat less than 1 mm in diameter, with a long wave UV intensity of about 1 watt/cm2.\n\nIn the system of FIG. 3, means may be provided to keep the surface 23 at a constant level and to replenish this material after an object has been removed, so that the focus spot 27 will remain sharply in focus on a fixed focus plane, thus insuring maximum resolution in forming a thin layer along the working surface. In this regard, it is desired to shape the focal point to provide a region of high intensity right at the working surface 23, rapidly diverging to low intensity and thereby limiting the depth of the curing process to provide the thinnest appropriate cross-sectional laminae for the object being formed. This is best accomplished by using a short focal length lens and bringing the source 26 as close as possible to the working surface, so that maximum divergence occurs in the cone of focus entering the fluid medium. The result is substantially enhanced resolution.\n\nAn H-P Model 9872 Digital Plotter (not shown) manufactured by Hewlett-Packard, of Palo Alto, Calif., is used to move the light source 26. The lens tube is attached to the pen carriage of the plotter, and the plotter is driven by a computer 28 using normal graphic commands. The shutter is controlled by an H-P 3497A Data Acquisition/Control Unit, using computer commands.\n\nOther physical forms of the light source 26 or its equivalent are feasible. Scanning could be done with optical scanners, and this would eliminate the fiber optic bundle and the digital plotter. A UV laser might ultimately be a better light source than a short arc lamp. The speed of the stereolithographic process is mainly limited by the intensity of the light source and the response of the UV curable liquid.',
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The elevator platform 29 is used to support and hold the object 30 being formed, and to move it up and down as required. Typically, after a layer is formed, the object 30 is moved beyond the level of the next layer to allow the liquid 22 to flow into the momentary void at surface 23 left where the solid was formed, and then it is moved back to the correct level for the next layer. The requirements for the elevator platform 29 are that it can be moved in a programmed fashion at appropriate speeds, with adequate precision, and that it is powerful enough to handle the weight of the object 30 being formed. In addition, a manual fine adjustment of the elevator platform position is useful during the set-up phase and when the object is being removed.\n\nThe elevator platform 29 for the embodiment of FIG. 3 is a platform attached to an analog plotter (not shown). This plotter is driven the H-P 3497A Data Acquisition/Control Unit with its internal digital to analog converter, under program control of the computer 28.\n\nThe computer 28 in the stereolithographic system of the present invention has two basic functions. The first is to help the operator design the three-dimensional object in a way that it can be made. The second is to translate the design into commands that are appropriate for the other stereolithographic components, and to deliver these commands in a way so that the object is formed. In some applications, the object design will exist, and the only function of the computer will be to deliver the appropriate commands.\n\nIn an ideal situation, the operator will be able to design the object and view it three-dimensionally on the CRT screen of the computer 28. When he is finished with the design, he will instruct the computer 28 to make the object, and the computer will issue the appropriate instructions to the stereolithographic components.\n\nIn a present working embodiment of the invention, the computer 28 is an H-P 9816, using a Basic Operating System. A typical program is shown in Appendix A. In this system, the operator programs using H-P Graphic Language, the command structure for the 3497A, plus the Basic Language commands. The operator also must set the appropriate exposure times and rates for the UV curable material. To operate the system an image of the object is created and a program is written to drive the stereolithograph to make that object.\n\nThe elevator platform 29 can be mechanical, pneumatic, hydraulic, or electrical and may also use optical or electronic feedback to precisely control its position. The elevator platform 29 is typically fabricated of either glass or aluminum, but any material to which the cured plastic material will adhere is suitable.\n\nIn some cases, the computer 28 becomes unnecessary and simpler dedicated programming devices can be used, particularly where only simply shaped objects are to be formed. Alternatively, the computer control system 28 can be simply executing instructions that were generated by another, more complex, computer. This might be the case where several stereolithography units are used to produce objects, and another device is used to initially design the objects to be formed.\n\nA computer controlled pump (not shown) may be used to maintain a constant level of the liquid 22 at the working surface 23. Appropriate level detection system and feedback networks, well known in the art, can be used to drive a fluid pump or a liquid displacement device, such as a solid rod (not shown) which is moved out of the fluid medium as the elevator platform is moved further into the fluid medium, to offset changes in fluid volume and maintain constant fluid level at the surface 23. Alternatively, the source 26 can be moved relative to the sensed level 23 and automatically maintain sharp focus at the working surface 23. All of these alternatives can be readily achieved by conventional software operating in conjunction with the computer control system 28.\n\nAfter the three-dimensional object 30 has been formed, the elevator platform 29 is raised and the object is removed from the platform. Typically, the object is then ultrasonically rinsed in a solvent, such as acetone, that dissolves the liquid state of the uncured fluid medium and not the cured solid state medium. The object 30 is then placed under an intense ultraviolet floodlight, typically a 200 watt per inch UV cure lamp, to complete the curing process.\n\nIn addition, there may be several containers 21 used in the practice of the invention, each container having a different type of curable material that can be automatically selected by the stereolithographic system. In this regard, the various materials might provide plastics of different colors, or have both insulating and conducting material available for the various layers of electronic products.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: 'Referring now more particularly to the remaining drawings, in connection with various alternative embodiments of the invention, like reference numerals throughout the various figures of the drawings denote like or corresponding parts as those previously discussed in connection with the preferred embodiment of the invention shown in FIG. 3.\n\nAs will be apparent from FIG. 4 of the drawings, there is shown an alternate configuration for a stereolithograph wherein the UV curable liquid 22 or the like floats on a heavier UV transparent liquid 32 which is non-miscible and non-wetting with the curable liquid 22. By way of example, ethylene glycol or heavy water are suitable for the intermediate liquid layer 32. In the system of FIG. 4, the three-dimensional object 30 is pulled up from the liquid 22, rather than down and further into the liquid medium, as shown in the system of FIG. 3.\n\nThe UV light source 26 in FIG. 4 focuses the spot 27 at the interface between the liquid 22 and the non-miscible intermediate liquid layer 32, the UV radiation passing through a suitable UV transparent window 33, of quartz or the like, supported at the bottom of the container 21. The curable liquid 22 is provided in a very thin layer over the non-miscible layer 32 and thereby has the advantage of limiting layer thickness directly, rather than relying solely upon adsorption and the like to limit the depth of curing, since ideally an ultrathin lamina is to be provided. Hence, the region of formation will be more sharply defined and some surfaces will be formed smoother with the system of FIG. 4 than with that of FIG. 3. In addition, a smaller volume of UV curable liquid 22 is required, and the substitution of one curable material for another is easier.\n\nThe system of FIG. 5 is similar to that of FIG. 3, but the movable UV light source 26 is eliminated and a collimated, broad UV light source 35 and suitable apertured mask 36 is substituted for the programmed source 26 and focused spot 27. The apertured mask 36 is placed as close as possible to the working surface 23, and collimated light from the UV source 35 passes through the mask 36 to expose the working surface 23, thereby creating successive adjacent laminae, as in the embodiments of FIGS. 3 and 4. However, the use of a fixed mask 36 provides three-dimensional objects with a constant cross-sectional shape. Whenever that cross-sectional shape is to be changed, a new mask 36 for that particular cross-sectional shape must be substituted and properly aligned. Of course, the masks can be automatically changed by providing a web of masks (not shown) which are successively moved into alignment with with the surface 23.\n\nFIG. 6 of the drawings again provides a stereolithographic system configuration similar to that previously described in connection with FIG. 3. However, a cathode ray tube (CRT) 38, fiber optic faceplate 39 and water (or other) release layer 40 are provided as a substitute for the light source 26 and focus spot 27. Hence, the graphic image provided by a computer 28 to the CRT 38 produces the forming image upon the UV emitting phosphor face of the tube where it passes through the fiber optic layer 39 and release layer 40 to the working surface 23 of the fluid medium 22. In all other respects, the system of FIG. 6 forms successive cross-sectional laminae defining the desired three-dimensional object to be formed, in exactly the same way as the embodiments of the invention previously discussed.\n\nFIGS. 7 and 8 illustrate an embodiment of a stereolithographic system wherein the elevator platform 29 has additional degrees of freedom, so that different faces of the object 30 may be exposed for alternate methods of construction. Similarly, the stereolithography process may be utilized as an "add on" process where the elevator platform 29 will be used to pick up and locate another part for supplementary stereolithographic processing. In this regard, the systems shown in FIGS. 7 and 8 are identical to that of FIG. 3 with the exception of the elevator platform 29 which, in the systems of FIGS. 7 and 8 have a second degree of freedom via manual or automatically controlled rotation about a pivot pin or hinge member 42. In this regard, FIG. 7 illustrates an adjustable elevator platform 29a in the conventional position, while FIG. 8 shows the platform 29a rotated 90° so that a supplementary, stereolithographically formed structure 41 can be selectively formed as an addition to one side of the three-dimensional object 30.\n\nA commercial stereolithography system will have additional components and subsystems besides those previously shown in connection with the schematically depicted systems of FIGS. 3-8. For example, the commercial system would also have a frame and housing, and a control panel. It should have means to shield the operator from excess UV and visible light, and it may also have means to allow viewing of the object 30 while it is being formed. Commercial units will provide safety means for controlling ozone and noxious fumes, as well as conventional high voltage safety protection and interlocks. Such commercial units will also have means to effectively shield the sensitive electronics from electronic noise sources.\n\nAs previously mentioned, a number of other possible apparatus may be utilized to practice the stereolithographic method. For example, an electron source, a visible light source, or an x-ray source or other radiation source could be substituted for the UV light source 26, along with appropriate fluid media which are cured in response to these particular forms of reactive stimulation. For example, alphaoctadecylacrylic acid that has been slightly prepolymerized with UV light can be polymerized with an electron beam. Similarly, poly(2,3-dichloro-1-propyl acrylate) can be polymerized with an x-ray beam.\n\nThe stereolithographic method and apparatus has many advantages over currently used methods for producing plastic objects. The method avoids the need of producing design layouts and drawings, and of producing tooling drawings and tooling. The designer can work directly with the computer and a stereolithographic device, and when he is satisfied with the design as displayed on the output screen of the computer, he can fabricate a part for direct examination. If the design has to be modified, it can be easily done through the computer, and then another part can be made to verify that the change was correct. If the design calls for several parts with interacting design parameters, the method becomes even more useful because all of the part designs can be quickly changed and made again so that the total assembly can be made and examined, repeatedly if necessary.\n\nAfter the design is complete, part production can begin immediately, so that the weeks and months between design and production are avoided. Ultimate production rates and parts costs should be similar to current injection molding costs for short run production, with even lower labor costs than those associated with injection molding. Injection molding is economical only when large numbers of identical parts are required. Stereolithography is useful for short run production because the need for tooling is eliminated and production set-up time is minimal. Likewise, design changes and custom parts are easily provided using the technique. Because of the ease of making parts, stereolithography can allow plastic parts to be used in many places where metal or other material parts are now used. Moreover, it allows plastic models of objects to be quickly and economically provided, prior to the decision to make more expensive metal or other material parts.\n\nIt will be apparent from the foregoing that, while a variety of stereolithographic systems have been disclosed for the practice of the present invention, they all have in common the concept of drawing upon a substantially two-dimensional surface and extracting a three-dimensional object from that surface.\n\nThe present invention satisfies a long existing need in the art for a CAD and CAM system capable of rapidly, reliably, accurately and economically designing and fabricating three-dimensional plastic parts and the like.\n\nIt will be apparent from the foregoing that, while particular forms of the invention have been illustrated and described, various modifications can be made without departing from the spirit and scope of the invention. Accordingly, it is not intended that the invention be limited, except as by the appended claims.',
      },
    ]),
    {
      kind: "heading",
      level: 2,
      text: "THE CLAIMS",
    },
    claim(1, [
      {
        kind: "text",
        text: "A system for producing a three-dimensional object from a fluid medium capable of solidification when subjected to prescribed synergistic stimulation, said system comprising: means for drawing upon and forming successive cross-sectional laminae of said object at a two-dimensional interface; and means for moving said cross-sections as they are formed and building up said object in step wise fashion, whereby a three-dimensional object is extracted from a substantially two-dimensional surface.",
      },
    ]),
    claim(2, [
      {
        kind: "text",
        text: "An improved system for producing a three-dimensional object from a fluid medium capable of solidification when subjected to prescribed synergistic stimulation, said system comprising: a body of fluid medium capable of transforming its physical state in response to synergistic stimulation; object support means immersed within said fluid medium for supporting a three-dimensional object to be formed; translational means for selectively moving said object support means progressively away from a designated surface of said fluid medium; and reaction means capable of altering the physical state of said fluid medium and operating in a prescribed pattern upon said designated surface of said fluid medium to provide a thin solid lamina at said surface representing a corresponding cross-sectional lamina of said three-dimensional object to be formed, whereby successive adjacent laminae are provided to form said three-dimensional object on said object support means as said translational means moves said support means away from said designated surface.",
      },
    ]),
    claim(3, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, and further including: programmed control means for varying the graphic pattern of said reaction means operating upon said designated surface of said fluid medium.",
      },
    ]),
    claim(4, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said reaction means includes: a beam of impinging radiation.",
      },
    ]),
    claim(5, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said reaction means includes: an electron beam.",
      },
    ]),
    claim(6, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said reaction means includes: a beam of high energy particles.",
      },
    ]),
    claim(7, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said reaction means includes: a beam of light.",
      },
    ]),
    claim(8, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said reaction means includes: X-rays.",
      },
    ]),
    claim(9, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said reaction means includes: a beam of ultraviolet light.",
      },
    ]),
    claim(10, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said reaction means includes: a jet of a reactive chemical to induce solidification of said fluid medium.",
      },
    ]),
    claim(11, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said reaction means includes: a patterned mask overlying said designated surface for selectively applying a chemical to induce solidification of said fluid medium.",
      },
    ]),
    claim(12, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said reaction means includes: a patterned mask overlying said designated surface for selectively exposing said surface to synergistic stimulation.",
      },
    ]),
    claim(13, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said reaction means includes: a patterned mask overlying said designated surface for selectively exposing said surface to radiation.",
      },
    ]),
    claim(14, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said translational means moves said object as it is formed away from said designated surface and further into said fluid medium.",
      },
    ]),
    claim(15, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said translational means moves said object, as it is formed away from said surface and out of said fluid medium.",
      },
    ]),
    claim(16, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein exposure to said reaction means at said designated surface is through a second non-reactive medium.",
      },
    ]),
    claim(17, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, and further including: a container for said fluid medium, wherein exposure of said designated surface to said reaction means is through the bottom of said container and a second non-reactive medium adjacent said designated surface.",
      },
    ]),
    claim(18, [
      {
        kind: "text",
        text: "A system as set forth in claim 17, wherein said second non-reactive medium is heavy water.",
      },
    ]),
    claim(19, [
      {
        kind: "text",
        text: "A system as set forth in claim 17, wherein said second non-reactive medium is ethylene glycol.",
      },
    ]),
    claim(20, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, and further including: rotational means, supplementing said translational means for altering the orientation of said object relative to said designated surface at which laminae are being formed.",
      },
    ]),
    claim(21, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein the level of said fluid medium locating said designated surface is variable.",
      },
    ]),
    claim(22, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein the level of said fluid medium locating said designated surface is maintained constant.",
      },
    ]),
    claim(23, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said translational means has multiple degrees of freedom of movement.",
      },
    ]),
    claim(24, [
      {
        kind: "text",
        text: "A system as set forth in claim 4, wherein precise focus of said beam of impinging radiation upon said designated surface is maintained.",
      },
    ]),
    claim(25, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said prescribed pattern is formed upon said designated surface by radiation emanating from the face of a cathode ray tube.",
      },
    ]),
    claim(26, [
      {
        kind: "text",
        text: "A system as set forth in claim 2, wherein said prescribed pattern is formed by light directly emanating from a phosphor image.",
      },
    ]),
    claim(27, [
      {
        kind: "text",
        text: "A system for directly producing a three-dimensional object as it is designed by a computer, comprising: deriving graphic image output from said computer, said graphic image defining successive adjacent cross-sections of the three-dimensional object designed by said computer; means for drawing upon and forming successive cross-sections, corresponding to said computer designed cross-sections of said object, at a two-dimensional interface; and means for moving said cross-sections as they are formed and building up said object in a stepwise fashion, whereby the three-dimensional object designed by said computer is automatically extracted from a substantially two-dimensional surface.",
      },
    ]),
    claim(28, [
      {
        kind: "text",
        text: "An improved system for producing a three-dimensional object from a fluid medium capable of altering its physical state when subjected to prescribed radiation, said system comprising: a body of fluid medium capable of altering its physical state; means for forming said three-dimensional object from said fluid medium by irradiating a designated surface of said medium to provide integrated, successive surface laminae at said surface, said laminae together defining said three-dimensional object.",
      },
    ]),
    claim(29, [
      {
        kind: "text",
        text: "An improved system for producing a three-dimensional object from a fluid medium, said system comprising: a body of fluid medium capable of altering its physical state in response to prescribed radiation; a radiation source for impinging said prescribed radiation in a selected pattern upon a designated surface of said fluid medium to provide only at said surface a thin solid lamina representing a cross-sectional lamina of a three-dimensional object to be formed; and means for combining successive adjacent laminae to form said three-dimensional object from said fluid medium.",
      },
    ]),
    claim(30, [
      {
        kind: "text",
        text: "A system as set forth in claim 29, wherein said radiation source includes: a beam of impinging radiation.",
      },
    ]),
    claim(31, [
      {
        kind: "text",
        text: "A system as set forth in claim 29, wherein said radiation source includes: an electron beam.",
      },
    ]),
    claim(32, [
      {
        kind: "text",
        text: "A system as set forth in claim 29, wherein said radiation source includes: a beam of high energy particles.",
      },
    ]),
    claim(33, [
      {
        kind: "text",
        text: "A system as set forth in claim 29, wherein said radiation source includes: a beam of light.",
      },
    ]),
    claim(34, [
      {
        kind: "text",
        text: "A system as set forth in claim 29, wherein said radiation source includes: a beam of ultraviolet light.",
      },
    ]),
    claim(35, [
      {
        kind: "text",
        text: "A system as set forth in claim 29, wherein said radiation source includes: X-rays.",
      },
    ]),
    claim(36, [
      {
        kind: "text",
        text: "A system as set forth in claim 29, wherein said radiation source and pattern includes: a patterned mask overlying said designated surface for selectively exposing said surface to synergistic stimulation.",
      },
    ]),
    claim(37, [
      {
        kind: "text",
        text: "A system as set forth in claim 29, wherein said radiation source and pattern includes: a patterned mask overlying said designated surface selectively exposing said surface to radiation.",
      },
    ]),
    claim(38, [
      {
        kind: "text",
        text: "A system as set forth in claim 29, wherein exposure to said prescribed radiation at said designated surface is through a second non-reactive medium.",
      },
    ]),
    claim(39, [
      {
        kind: "text",
        text: "A system as set forth in claim 29, and further including: a container for said fluid medium, wherein exposure of said designated surface to said prescribed radiation is through the bottom of said container and a second non-reactive medium adjacent said designated surface.",
      },
    ]),
    claim(40, [
      {
        kind: "text",
        text: "A system as set forth in claim 39, wherein said second non-reactive medium is heavy water.",
      },
    ]),
    claim(41, [
      {
        kind: "text",
        text: "A system as set forth in claim 39, wherein said second non-reactive medium is ethylene glycol.",
      },
    ]),
    claim(42, [
      {
        kind: "text",
        text: "A system as set forth in claim 39, wherein the level of said fluid medium locating said designated surface is maintained constant.",
      },
    ]),
    claim(43, [
      {
        kind: "text",
        text: "A system as set forth in claim 39, wherein said translational means has multiple degrees of freedom of movement.",
      },
    ]),
    claim(44, [
      {
        kind: "text",
        text: "A system as set forth in claim 39, wherein precise focus of said prescribed radiation upon said designated surface is maintained.",
      },
    ]),
    claim(45, [
      {
        kind: "text",
        text: "A system as set forth in claim 39, wherein said selected pattern is formed upon said designited surface by radiation emanating from the face of a cathode ray tube.",
      },
    ]),
    claim(46, [
      {
        kind: "text",
        text: "A system as set forth in claim 39, wherein said selected pattern is formed by light directly emanating from a phosphor image.",
      },
    ]),
    claim(47, [
      {
        kind: "text",
        text: "A system as set forth in claim 39, and further including: programmed control means for varying the pattern of said impinging radiation upon said designated surface of said fluid medium.",
      },
    ]),
  ],
};
