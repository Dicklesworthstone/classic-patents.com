import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];

const FIGURES = {
  1: {
    src: "/patents/figures/us-588-ericsson-propeller-fig-1-preview.png",
    alt: "Figure 1, first sheet of US 588: longitudinal stern section and spiral-plate geometry.",
    width: 299,
    height: 720,
  },
  2: {
    src: "/patents/figures/us-588-ericsson-propeller-fig-1-preview.png",
    alt: "Figure 2 on the first sheet of US 588: cylinder and helical development diagram.",
    width: 299,
    height: 720,
  },
  3: {
    src: "/patents/figures/us-588-ericsson-propeller-fig-2-preview.png",
    alt: "Figure 3 on the second sheet of US 588: end view of a hoop and its spiral plates.",
    width: 584,
    height: 720,
  },
  4: {
    src: "/patents/figures/us-588-ericsson-propeller-fig-2-preview.png",
    alt: "Figure 4 on the second sheet of US 588: longitudinal vessel-stern installation.",
    width: 584,
    height: 720,
  },
  5: {
    src: "/patents/figures/us-588-ericsson-propeller-fig-2-preview.png",
    alt: "Figure 5 on the second sheet of US 588: plan of the stern installation.",
    width: 584,
    height: 720,
  },
  6: {
    src: "/patents/figures/us-588-ericsson-propeller-fig-2-preview.png",
    alt: "Figure 6 on the second sheet of US 588: propeller gearing section.",
    width: 584,
    height: 720,
  },
} as const;

const figure = (
  value: string,
  numbers: readonly (keyof typeof FIGURES)[],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: value,
  href: "#",
  referenceType: "figure",
  label: `Open the primary facsimile preview for ${value}`,
  figurePreviews: numbers.map((number) => FIGURES[number]),
});

/** A continuous, manually transcribed reading edition checked against all five PDF sheets. */
export const ericssonPropellerArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "40582250d44f6558cf9a438801e312a469ccb83b6755ebc813943fba54c3ea9a",
  preparedBy: "Classic Patents editorial agent (TurquoiseCoast)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "JOHN ERICSSON, OF LONDON, ENGLAND.",
        "PROPELLING STEAM VESSELS.",
        "Specification of Letters Patent No. 588, dated February 1, 1838.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1, 2 SHEETS",
      title: "Figures 1 and 2",
      description: text(
        "J. Ericsson. Screw Propeller. No. 588. Patented Feb. 1, 1838. Figure 1 is the longitudinal stern section; Figure 2 develops the spiral plate form on a cylinder.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2, 2 SHEETS",
      title: "Figures 3 through 6",
      description: text(
        "J. Ericsson. Screw Propeller. No. 588. Patented Feb. 1, 1838. Figures 3, 4, 5, and 6 show the end view, stern installation, plan, and gearing section.",
      ),
    },
    { kind: "paragraph", inlines: [{ kind: "emphasis", text: "To all whom it may concern:" }] },
    {
      kind: "paragraph",
      inlines: text(
        "Be it known that I, JOHN ERICSSON, a subject of the Kingdom of Sweden, residing at London, England, have invented a new and useful Propeller for the Purpose of Propelling Steamboats Effectually Notwithstanding Any Variations in Their Draft of Water, and that the following is a full and exact description of the construction and operation of the said propeller as invented by me.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "This invention which I name as above consists in two thin broad metallic hoops or short cylinders supported by spiral arms or spokes and made to revolve in contrary directions but at different velocities from each other around a common center, such hoops or cylinders being also placed entirely under the water at the stern of a boat and furnished each with a series of short spiral planes or plates; the plates of each series standing at an angle, the exact converse of the angle given to those of the other series and kept revolving by the power of a steam engine whereby a steam boat may be propelled effectually notwithstanding any variation in the draft of water.",
        },
      ],
    },
    { kind: "heading", level: 2, text: "Description of the drawing No. 1 hereto attached." },
    {
      kind: "paragraph",
      inlines: [
        figure("Figure 1", [1]),
        {
          kind: "text",
          text: " represents a longitudinal section of the stern of a steam boat with my improved propeller attached. A and B are two cylinders or broad hoops of wrought iron supported by spiral arms or spokes which will be explained hereafter. The hoop A is attached to the axis a, a, a and the hoop B to the axis b, b, b, which latter axis is made hollow in order to admit the former to pass through and work within it and both these axes pass directly through the center of the stern post into the body of the vessel. 1, 2, 3, 4, 5 and 9, 10, 11, 12, 13 are thin metallic plates attached by rivets to the hoops A and B; the face of each plate being twisted so as to form a portion of a spiral plane or thread, the exact form of which will be determined and may be obtained by forming a cylinder and coiling a thread or blade spirally around it on the principle exhibited by the diagram represented in ",
        },
        figure("Fig. 2", [2]),
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "In " },
        figure("Fig. 2", [2]),
        {
          kind: "text",
          text: ", A A A represent a cylinder of equal diameter with the hoops A and B in Fig. 1. a, a, a, a, a, a, a, a, are eight thin spiral planes or plates of the same width as the plates 1, 2, 3, 4, 5 and 9, 10, 11, 12 and 13 in Fig. 1, and coiled around the said cylinder A A A spirally like the thread of a screw, the coils being placed at equal distances from each other and each having such a fall or inclination that it will not have passed once around the cylinder until it has advanced along it a distance equal to three times its diameter. Now if the said cylinder A A A with its spiral plates or threads be cut off through the lines D, E and F G, the portions of the spiral plates between the said lines and which are here numbered 9, 10, 11, 12 and 13 show the exact forms and positions which the plates represented in ",
        },
        figure("Fig. 1", [1]),
        {
          kind: "text",
          text: " by corresponding numbers should be made to assume, while the forms and positions of the plates 1, 2, 3, 4 and 5 will be determined in a similar manner by running the coils in a contrary direction around the same cylinder.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Having thus explained the manner in which the forms and positions of the spiral plates on the hoops A and B ought to be determined I will now continue the description of ",
        },
        figure("Fig. 1", [1]),
        {
          kind: "text",
          text: ". c, c, c, c, c, c, c, c, are narrow hoops of wrought iron passing around and riveted at the parts marked D in Fig. 3 to the spiral plates in order to secure them more firmly in their places. E E E is a strong wrought iron stay, better seen in Fig. 3, firmly bolted to the stern of the vessel. e, e, is a brass bearing fixed in the said stay E which bearing carries the outer and enlarged end of the shaft a, a, a, the other end of the shaft being carried by and working through a stuffing box F attached to the shaft b, b, b, which shaft is supported by a strong cast iron framing G and plumber block g. C is a stuffing box fixed to the stern post to prevent the water from entering the vessel around the shaft b, b, b, which should work freely through the stern post.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "H and I are two broad cog wheels working together, I being about one fifth larger than H and attached to the shaft b, b, b, and H being attached to a crank shaft L L. M M is another crank shaft attached to the shaft a a a by the coupling box N. l and m are cranks on the shafts L and M supported by cast iron frames P P and plumber blocks or bearings p p p p. Q and R are also cranks on the shafts M M and L L fixed at right angles to the cranks l and m. q and r are crank pins and S a coupling link by which the cranks Q and R are coupled together. T is a connecting rod and U is a coupling link attached to the cranks l and m. This connecting rod is to be connected in the ordinary manner to the piston rod or beam of a steam engine the cylinder of which may be placed either vertically or horizontally across the vessel. Another connecting rod connected to another engine may be attached to the crank pin q in a similar manner by which a more regular power will be communicated to the cranks and shafts m M and L L.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "It is evident that if motion be communicated to the cranks l and m the shafts L and M must be turned around in one and the same direction and that therefore the shaft b, b, b, by means of the unequal cog wheels I and H will move in a contrary direction to the shaft a, a, a, and at a less speed and at the same time the broad hoops A and B with their spiral plates will move in contrary directions and at unequal velocities; it should be stated that when the cylinder A and its plates 1, 2, 3, 4 and 5 as viewed from the vessel revolve to the left the vessel will be propelled forward and when moved to the right the vessel will be backed. W W is the rudder divided into two parts held together by two strong wrought iron stays V fixed one on each side having wide loops or bends at v to admit of the free motion of the rudder.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        figure("Fig. 3", [3]),
        {
          kind: "text",
          text: " represents an end view of the broad hoops A with its spiral plates. e e e e are cross stays to give additional strength to the stay E E. X X X are the 3 wrought iron spiral arms or spokes to the hoop A before alluded to and constructed in manner here shown in order to prevent the resistance which would otherwise be presented by them to the progress of the vessel. These arms all meet in the center where they are welded to a boss Y which is afterward bored to receive the shaft a, a, a, upon which it is firmly keyed by the keys z z z. D D D D D D D D are the angle pieces which join the several pieces C C C C C C C C of the narrow hoop that supports the spiral plates on the broad hoop. J represents the ordinary water line.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "And I, the said JOHN ERICSSON, do hereby declare that the application of my propeller represented in the annexed drawing No. 2 and hereafter described will be highly useful either for ships of war or merchant vessels.",
      ),
    },
    { kind: "heading", level: 2, text: "Description of the drawing No. 2." },
    {
      kind: "paragraph",
      inlines: [
        figure("Fig. 4", [4]),
        { kind: "text", text: " represents a longitudinal section and " },
        figure("Fig. 5", [5]),
        {
          kind: "text",
          text: " the plan of the stern of a vessel with my propeller attached and ",
        },
        figure("Fig. 6", [6]),
        {
          kind: "text",
          text: " is a section showing the manner in which the requisite contrary movement is obtained in the said application of my propeller. In order the more clearly to describe the said application I will first describe this last mentioned Fig. 6, but previous to doing I have to state that similar letters of reference will be used to denote similar parts in all the figures.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "A is a hollow stem of wrought iron, to which are welded collars d d and broad flat branches or arm a a. B is an axle or shaft of steel on which a hollow axle C of wrought iron is made to work, both these axles B and C are supported by the flat arms a a which arms have eyes or bearings at D D in which the respective axles work. E is an axle or upright shaft of wrought iron working through the hollow stem A. F is a crank attached to the said upright shaft by a sliding coupling box f and key x. b, c, e are conical cog wheels working together and firmly fixed on their respective axles B, C, E by which it becomes evident that if motion be given to the upright shaft the axles B and C will move in contrary directions.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "G, H, are two thin broad hoops of wrought iron, G being firmly fixed on the axle B and H fixed on the hollow axle C. Each hoop is provided with a series of spiral planes as described in the foregoing description of my improved propeller applicable to steam navigation. g, g and h, h are the spiral spokes also before described but which spokes in addition to their twisting or spiral form are here curved or bent outward in order to give room for the flat arms a a of the hollow stem. In order to protect the conical wheels as well as diminishing the friction which they would produce in passing through the water a drum P P P of slight metal divided into three parts and pointed toward the ends, is made to inclose all the gear work under water, the central part of which drum, being fixed to the arms a a and the pointed ends or caps fixed to the spokes of the propellers slits being made for that purpose and a space of about one eighth of an inch left between the three parts in order to admit of a free and contrary movement of the propellers.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "Having thus described Fig. 6, representing the section of my propeller as applied to ships of war or merchant vessels, I will now proceed to describe Fig. 4, showing the manner in which it is attached. K is a bracket of iron, better seen at K K, it is firmly fixed to the stern for the purpose of carrying the propeller, by means of the hollow stem A and its collars d d, the hollow stem being kept in its place by the key k which is secured to the bracket K by a slight chain. L is a stay of wrought iron, to keep the hollow stem A firmly in an upright position, and to receive and communicate the force of the propellers for which purpose it is attached to the stern post by hinges on each side of the rudder; its form will be better seen at L L, the rudder being made to work between l, l and the fork M fitted to receive the hollow stem A, which is kept in by a key m this being secured to the stay by a slight chain as shown in the drawing. N is a ring or collar around the upper part of the hollow stem A, having a strong loop or eye at n. It is evident that by driving out the keys m k and x and pushing down the sliding coupling box f the hollow stem with the upright shaft and propeller will become quite detached, and may thus be lifted out of the water or taken on board simply by applying a hoisting tackle at n. The stay L should whenever the propeller is taken on board be lifted up and kept suspended by the hooked rope at R in the position shown by the dotted lines n r.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "I have now to state that the most advantageous mode of giving motion to the propeller is that of applying a steam engine to the crank F, and I would recommend an engine so arranged as represented in ",
        },
        figure("Fig. 5", [5]),
        {
          kind: "text",
          text: ", S S being two high pressure steam cylinders placed horizontally and nearly at right angles, their power to be communicated by the forked connecting rods s s to the crank F. In cases where the application of steam engines would be objectionable manual force may be applied by means of long winches similar to those used for working ordinary chain pumps or by means of a capstan made to give motion to the conical cog wheel T, marked in red lines, see Fig. 4, such cog wheel to work in or give motion to another conical cog wheel V fixed on the upright shaft F.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Now whereas the use of spiral planes acting obliquely against the water and moving in contrary directions for propelling steam boats is not new, I do not claim as my invention the use of such spiral planes or their contrary motion; but I claim as my invention:",
        },
      ],
    },
    {
      kind: "claim",
      number: 1,
      inlines: text(
        "The metallic hoops or cylinders and the spiral arms or spokes hereinbefore described together with the entire immersion of the propeller by which means I am enabled to employ the whole surface of all the spiral plates at one time and whereby the beneficial result of a great propelling force will be obtained by a propeller of much less dimensions than heretofore.",
      ),
    },
    {
      kind: "claim",
      number: 2,
      inlines: text(
        "And I also claim as my invention the giving a greater speed to the outer series of spiral plates which move in the current produced by the motion of the other series and by which greater speed the beneficial result of saving of power and increased propelling force will be obtained.",
      ),
    },
    {
      kind: "claim",
      number: 3,
      inlines: text(
        "And I further claim as my invention the application of the propeller as described in drawing No. 2—that is to say: 1stly, I claim the upright hollow stem with its arms or branches for carrying the propeller by means of which stem the propeller may be either suspended and immersed under the water when required to be used, or on other occasions lifted out of the water so as not to interfere with the sailing of the vessel; 2ndly, I claim the drum or conical casing for protecting the bevel wheels and for diminishing the resistance in passing through the water; 3rdly, I claim the attaching the propeller to or detaching it from the engine or other power employed on board the vessel by means of a coupling box at the upper end of the upright shaft of the bevel wheels.",
      ),
    },
    { kind: "paragraph", inlines: [{ kind: "small-caps", text: "J. ERICSSON." }] },
    { kind: "paragraph", inlines: text("Witnesses: JAMES M. CURLEY. JOSEPH MARQUETTE.") },
  ],
};

/**
 * Patent-local, hand-authored paragraph companions. These keys are the exact
 * zero-based block positions in ericssonPropellerArchivalEdition, intentionally
 * kept beside the source nodes until the shared publication registry is assigned.
 */
export const ericssonPropellerParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: [
    "This formal address opens the public specification. It tells any interested reader that the following text is Ericsson's statement of the invention and the claims that follow it.",
  ],
  4: [
    "Ericsson identifies himself as a Swedish subject living in London, England. He says the object is a new propeller that can propel steamboats even as their draft changes, and he promises both construction and operating detail rather than merely naming a result.",
  ],
  5: [
    "The machine has two broad metal hoops, or short cylinders, carried by spiral spokes on one common center. They turn in opposite directions and at unequal speeds. Each hoop has a series of short spiral plates set at the reverse angle of the plates on the other hoop.",
    "Both assemblies sit wholly below the water at the stern. Steam power turns them so that, despite a change in the vessel's draft, the plates remain usable as propelling surfaces. This paragraph states the physical arrangement; it does not claim every earlier use of oblique spiral planes.",
  ],
  7: [
    "Figure 1 is the longitudinal stern section. Hoops A and B are wrought-iron cylinders driven on concentric axes: the b shaft is hollow so the a shaft can pass and work inside it, and both pass through the stern post into the vessel.",
    "Plates 1 through 5 and 9 through 13 are riveted to those hoops. Ericsson asks the reader to obtain their shape by wrapping a thread or blade around a cylinder, then uses Figure 2 to make that geometric construction explicit.",
  ],
  8: [
    "Figure 2 is a development rule for the blades, not a second vessel arrangement. A cylinder equal in diameter to the Figure 1 hoops receives eight equally spaced spiral plates. One turn advances three cylinder diameters, so the pitch is fixed by the printed geometry.",
    "Cutting that model at lines D, E, and F G gives the exact plate pieces numbered 9–13 for one hoop. Running the spiral in the contrary direction gives the forms and positions of plates 1–5 for the other hoop. The two series therefore have opposed spiral senses by construction.",
  ],
  9: [
    "The narrow hoops c reinforce the spiral plates at the D locations shown in Figure 3. Stay E is bolted to the vessel stern and carries brass bearing e for the enlarged outer end of shaft a; the other end works through stuffing box F on shaft b.",
    "Shaft b is supported by cast-iron framing G and plumber block g. Stuffing box C is fixed to the stern post so water cannot enter around b while allowing that shaft to turn freely. These details identify a load path and a watertight penetration, not a modern generic stern tube.",
  ],
  10: [
    "Cog wheels H and I mesh, with I about one fifth larger. I drives shaft b and H is on crank shaft L L; shaft a receives motion through coupling box N from crank shaft M M. Cranks, pins, coupling link S, connecting rod T, and link U transmit a steam engine's reciprocating motion to both shafts.",
    "A second engine may connect at crank pin q for steadier power. The described gear ratio and linkage are important because the following paragraph derives opposite shaft rotation and unequal speed from them, rather than assuming a generic contra-rotating propeller.",
  ],
  11: [
    "Driving cranks l and m turns L and M in the same direction. Unequal gears I and H make shaft b rotate opposite shaft a and more slowly, so the two plate-carrying hoops turn oppositely at unequal velocities. Ericsson specifies the indicated direction: leftward rotation of cylinder A and plates 1–5 drives the vessel forward; rightward rotation backs it.",
    "The split rudder W W is held by stays V with loops at v. The loops leave it free to move, so the stern control surface can operate beside the submerged machinery.",
  ],
  12: [
    "Figure 3 is the end view of hoop A and its plates. Cross stays e reinforce stay E. Three spiral arms X meet at boss Y, which is bored for shaft a and keyed to it; the arms are shaped to reduce the resistance they otherwise present to the vessel's progress.",
    "Angle pieces D join the segments of the narrow hoop C that supports the spiral plates. J marks the ordinary water line. Ericsson then says the drawing No. 2 installation is useful for either warships or merchant vessels, a statement of proposed use rather than a claim by itself.",
  ],
  13: [
    "Ericsson expressly declares that the second drawing's application of the propeller would be useful to ships of war and merchant vessels. It bridges from the shaft-and-hoop machine in drawing No. 1 to the removable installation in drawing No. 2.",
  ],
  15: [
    "Drawing No. 2 contains the deployment hardware. Figure 4 is the longitudinal stern section, Figure 5 the stern plan, and Figure 6 the section that explains how contrary motion is produced. The same reference letters intentionally name like parts throughout those three figures.",
  ],
  16: [
    "In Figure 6, hollow wrought-iron stem A has collars d d and flat branches a a. Steel axle B works within hollow wrought-iron axle C; the branch bearings D D support both. Upright shaft E passes through the hollow stem, and crank F attaches through sliding coupling box f and key x.",
    "Conical gears b, c, and e are fixed on axles B, C, and E. Turning the upright shaft therefore turns B and C in contrary directions. This is the Figure 6 version of the opposed-drive condition, with the components and their coupling stated explicitly.",
  ],
  17: [
    "Hoops G and H are fixed respectively to axle B and hollow axle C, each with spiral planes. Their spiral spokes g and h bend outward to clear stem A's flat branches. That clearance is a physical constraint on the installation, not decoration in the drawing.",
    "A three-part, pointed, light-metal drum P P P encloses the underwater gear. Its center fixes to the branches and its end caps fix to the propeller spokes; slits and about one eighth of an inch between the three parts let the propellers move freely in contrary directions while the casing protects the bevel wheels and reduces water resistance.",
  ],
  18: [
    "Figure 4 shows the attachment at the stern. Bracket K carries hollow stem A through collars d d, retained by chained key k. Hinged stay L both holds the stem upright and receives or communicates the propellers' force at the stern post, while the rudder works between l, l and fork M receives the hollow stem.",
    "Ring N supplies a hoisting eye. Removing keys m, k, and x and pushing down coupling box f detaches the stem, upright shaft, and propeller, so tackle at n can lift the apparatus from the water or aboard. When it is aboard, stay L is lifted and suspended at R in the dotted-line position. These are the removal conditions later claimed in claim 3.",
  ],
  19: [
    "Ericsson recommends a steam engine on crank F, illustrated in Figure 5 as two high-pressure cylinders S S placed nearly at right angles and connected by forked rods s s. He also permits manual force where steam engines are objectionable: long winches, chain-pump-like gear, or a capstan can turn conical wheel T in Figure 4, which drives conical wheel V on upright shaft F.",
    "The paragraph identifies alternative power sources but leaves the opposed bevel-gear and removable-stem mechanism intact. It does not enlarge the later claims to every engine or capstan arrangement.",
  ],
  20: [
    "Ericsson narrows the legal premise before claiming. He admits that oblique spiral planes and their contrary motion for steamboat propulsion were not new, and expressly disclaims claiming those ideas alone. The three numbered claims therefore seek the specific immersed hoop-and-spoke construction, speed relation, and drawing No. 2 installation.",
  ],
  24: [
    "J. Ericsson signs the completed specification after the three claims. The signature adopts the described construction and the stated claim limitations as his patent instrument.",
  ],
  25: [
    "James M. Curley and Joseph Marquette are printed as witnesses. They witness execution of the document; the source does not present them as co-inventors or as authors of any claim.",
  ],
};
