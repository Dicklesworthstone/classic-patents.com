import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const p = (inlines: CuratedSpecificationInlines) => ({ kind: "paragraph" as const, inlines });
const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

const FIGURE_PREVIEWS = {
  "Fig. 1": {
    src: "/patents/figures/us-1102653-goddard-rocket-fig-1.png",
    alt: "US 1,102,653, Fig. 1: longitudinal partial section of the primary rocket, firing tube, auxiliary rocket, and tapered exhaust tube.",
    width: 640,
    height: 1280,
  },
  "Fig. 2": {
    src: "/patents/figures/us-1102653-goddard-rocket-fig-2.png",
    alt: "US 1,102,653, Fig. 2: enlarged longitudinal section through the auxiliary-rocket head, camera support, and gyroscope.",
    width: 650,
    height: 600,
  },
  "Fig. 3": {
    src: "/patents/figures/us-1102653-goddard-rocket-fig-3.png",
    alt: "US 1,102,653, Fig. 3: transverse section of the primary rocket's backward-curved spin tubes and their electrical ignition circuit.",
    width: 820,
    height: 720,
  },
  "Fig. 4": {
    src: "/patents/figures/us-1102653-goddard-rocket-fig-4.png",
    alt: "US 1,102,653, Fig. 4: transverse section of the auxiliary rocket's backward-curved spin-restoration tubes.",
    width: 500,
    height: 420,
  },
  "Fig. 5": {
    src: "/patents/figures/us-1102653-goddard-rocket-fig-5.png",
    alt: "US 1,102,653, Fig. 5: vertical launching framework with ball bearings supporting the rocket before fuse ignition.",
    width: 600,
    height: 670,
  },
} as const;

const fig = (
  value: "Figure 1" | "Figs. 3 and 4" | keyof typeof FIGURE_PREVIEWS,
): CuratedSpecificationInline => {
  if (value === "Figs. 3 and 4") {
    return {
      kind: "reference",
      text: value,
      href: "#",
      referenceType: "figure",
      label: `Open Figures 3 and 4 on the US 1,102,653 source drawing sheet`,
      figurePreviews: [FIGURE_PREVIEWS["Fig. 3"], FIGURE_PREVIEWS["Fig. 4"]],
    };
  }
  const figure = value === "Figure 1" ? "Fig. 1" : value;
  return {
    kind: "reference",
    text: value,
    href: "#",
    referenceType: "figure",
    label: `Open ${value} on the US 1,102,653 source drawing sheet`,
    figurePreviews: [FIGURE_PREVIEWS[figure as keyof typeof FIGURE_PREVIEWS]],
  };
};

/** Continuous manual edition, checked against the four-page US 1,102,653 facsimile. */
export const goddardRocketArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "8503f52914f4201850d7d6f067ac48886dda77c2cdb5e8fce831e13232f7c42b",
  preparedBy: "Classic Patents editorial agent (codex-foxtrot)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "ROBERT H. GODDARD, OF WORCESTER, MASSACHUSETTS.",
        "ROCKET APPARATUS.",
        "1,102,653. Specification of Letters Patent. Patented July 7, 1914.",
        "Application filed October 1, 1913. Serial No. 792,707.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 1-5",
      title: "Rocket, head, frame, and transverse sections",
      description: text(
        "R. H. Goddard. Rocket Apparatus. Application filed Oct. 1, 1913. No. 1,102,653. Patented July 7, 1914. The sheet includes Figs. 1 through 5, witnesses C. F. Hixon and C. C. Hartnett, and Robert H. Goddard's signature as assignor to C. F. Wesson.",
      ),
    },
    p(text("To all whom it may concern:")),
    p(
      text(
        "Be it known that I, ROBERT H. GODDARD, a citizen of the United States, residing at Worcester, in the county of Worcester and State of Massachusetts, have invented a new and useful Rocket Apparatus, of which the following is a specification.",
      ),
    ),
    p(
      text(
        "This invention relates to a rocket apparatus and particularly to a form of such apparatus adapted to transport photographic or other recording instruments to extreme heights. Certain features of the invention are also applicable to the display of signals or to the projection of explosives.",
      ),
    ),
    p(
      text(
        "Mathematical analysis shows that in any rocket apparatus of given mass, the necessary propelling charge varies according to an expression in which the percentage of the heat energy of the charge which is transformed to kinetic energy enters in an exponential relation. Hence, any increase in the efficiency in the transformation results in greatly increased velocity of the apparatus and also permits a reduction in the amount of explosive used.",
      ),
    ),
    p(
      text(
        "It is one of the objects of my invention to provide a rocket apparatus in which the transformation above mentioned is performed with great efficiency whereby the velocity and range of flight are greatly increased.",
      ),
    ),
    p(
      text(
        "A second object of my invention is to provide means by which, after the apparatus as a whole has performed a given flight, the recording apparatus may be given a further flight in an auxiliary device by the use of a second but reduced propelling charge.",
      ),
    ),
    p(
      text(
        "Further objects of my invention are to provide improved means for initially rotating the rocket apparatus; to provide means for maintaining the speed of rotation thus attained; and to provide means for so supporting the recording apparatus within the rocket that said apparatus shall not partake of the rotation of the rocket apparatus as a whole.",
      ),
    ),
    p(
      text(
        "With these objects in view my invention comprises certain devices, arrangements and combination of parts which will be hereinafter described and more fully set forth in the appended claims.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "A preferred form of my invention is shown in the drawings in which - ",
      },
      fig("Figure 1"),
      {
        kind: "text",
        text: " is a longitudinal view, partly in section, of my rocket apparatus as a whole; ",
      },
      fig("Fig. 2"),
      {
        kind: "text",
        text: " is an enlarged longitudinal sectional view of the head of the apparatus; ",
      },
      fig("Figs. 3 and 4"),
      {
        kind: "text",
        text: " are enlarged transverse sectional views taken along the lines 3-3 and 4-4 respectively, in ",
      },
      fig("Fig. 2"),
      { kind: "text", text: "; and " },
      fig("Fig. 5"),
      {
        kind: "text",
        text: " is a vertical elevation of a frame work from which the apparatus may be fired, drawn to a reduced scale.",
      },
    ]),
    p([
      { kind: "text", text: "Referring to " },
      fig("Fig. 1"),
      {
        kind: "text",
        text: ", the rocket apparatus comprises a primary rocket having a casing containing a combustion chamber 10 from which depends an elongated tapered tube 11. The explosive material is indicated as a plurality of disks 12 secured within the chamber 10 by a casting 13. The disks 12 are preferably formed of a series of materials having progressively increasing rates of combustion so that as each disk is ignited it burns with increased rapidity and keeps the pressure in the chamber 10 constant, for which specific pressure the tapered tube 11 is designed. Similar results may be attained by using the explosive in a single mass of progressively varying composition in place of the plurality of disks here shown, and this construction is also within the scope of my invention.",
      },
    ]),
    p(
      text(
        "In the ordinary forms of rocket apparatus, the gases of combustion are discharged through an opening at the rear of the apparatus but I have discovered that by providing the elongated tapered tube 11, I am able to greatly increase the efficiency of the device. The tube is shown in the form of a truncated cone of slight taper and the length of the tube should be not less than three times as great as its longest diameter, while a greater ratio than this will often be necessary to obtain satisfactory results. This construction takes advantage of the expansion of the gases as they pass through the tube and also allows the combustion of the gases to be completed before they finally issue from the tube. By experimentally determining the best proportions for the tube 11, a maximum percentage of the heat energy of the disks 12 may be transformed into kinetic energy. A fuse 14 is indicated which extends downwardly within the tube 11 and provides means by which the disks may be ignited.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "In order to provide the necessary speed of rotation of the apparatus so that it may be caused to follow a desired path of flight, I provide the construction shown in section in ",
      },
      fig("Fig. 3"),
      {
        kind: "text",
        text: " and comprising a plurality of substantially radial but backwardly curved tubes or recesses 15 in which is placed explosive material 16. It will be apparent that when this material is ignited the discharge of the gases therefrom will react to produce rotation of the apparatus.",
      },
    ]),
    p(
      text(
        "To provide for igniting the several charges 16 simultaneously, I arrange within the outer surface of each charge a fine metal filament or heating element 17, these filaments being all connected in series by wires 18 with a battery 19 and a key 20. The closing of the key 20 sends a current through the wires 18 and instantaneously raises the temperature of the filaments 17 and simultaneously ignites the several charges 16. The explosive force of the gases from the material 16 forces the filaments 17 and the wires 18 out of the tubes 15 so that they can not thereafter interfere with the rotation or flight of the apparatus.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "In order that this preliminary rotation may be conveniently produced, I provide the vertical framework 21 shown in ",
      },
      fig("Fig. 5"),
      {
        kind: "text",
        text: " in which the rocket is supported upon ball bearings 22 and 23. After the charges 16 have been ignited and the desired speed of rotation has been attained, the fuse 14 may be lighted and the flight of the rocket will commence.",
      },
    ]),
    p(
      text(
        "In order that the apparatus carried by the rocket may be given a further flight after the propelling charge of the main apparatus has been substantially consumed, I provide an elongated tubular projection or firing tube 24 at the forward extremity of the casting 13. Within this tube I provide an auxiliary rocket comprising a combustion chamber 25 having a rearwardly extended tapered tube 26 and containing a plurality of disks of explosive material 27, these parts being substantially similar to the corresponding parts in the main apparatus but constructed on a somewhat reduced scale.",
      ),
    ),
    p(
      text(
        "A fuse 28 extends from the explosive material 27 through an opening in the casting 13 and projects a short distance into the last disk 12 of explosive material in the chamber 10. Thus when the propelling charge in the main rocket apparatus is substantially exhausted, the fuse 28 will be ignited and the firing tube 24 will act as a gun from which the auxiliary rocket will be projected for further flight. As the auxiliary rocket is of much less weight than the combined weight of the primary and auxiliary rockets, a given amount of explosive in the auxiliary rocket will give a much greater increase in flight than the same amount of explosive would produce if burned in the primary rocket.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "To provide for maintaining the speed of rotation of the auxiliary apparatus, which will have been somewhat reduced by the friction of the atmosphere during the flight, I provide in the head 29 of the auxiliary rocket a plurality of transverse backwardly curved tubes or recesses 30, similar to the recesses 15 shown in ",
      },
      fig("Fig. 3"),
      {
        kind: "text",
        text: ". The recesses 30 are provided with explosive charges 31 and within the recesses are also mounted a series of small tubes 32 extending inwardly to the axis of the apparatus where they unite and are further extended downwardly into the explosive charge 27. These tubes are filled with a rapidly burning compound which is ignited when the explosive charge 27 has been consumed to a predetermined extent and by which the charges 31 are thereafter ignited to increase or restore the speed of rotation of the auxiliary rocket.",
      },
    ]),
    p(
      text(
        "Within the apparatus head 29 is pivotally mounted a support 33 upon which is mounted any desired form of recording apparatus. In the particular embodiment of my invention shown in the drawings this apparatus is indicated as a camera 34. The head 29 is provided with a series of openings 35 separated by narrow supports 36. The speed of rotation of the head is so great that the passage of the supports 36 in front of the camera does not interfere with the taking of photographs thereby.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "In order that the support 33 may not partake of the rotation of the head 29, I provide within the support a gyroscope 37 mounted in bearings 38 upon said support and to provide the high initial speed of rotation necessary for the operation of the gyroscope, I construct the latter as the armature of a three-phase induction motor having field coils 39, mounted on a frame 40 also secured to the support 33. The field coils are connected to wires 41 secured within an insulating plug 42 in the support 38. Wires 43 may be introduced through an opening 44 in the head 29 and caused to make contact with the wires 41 in the plug 42, the wires 43 being connected to any suitable source of three-phase current. When the gyroscope has attained the requisite speed of rotation, the wires 43 may be withdrawn and the opening 44 may be closed with the screw 45 shown in ",
      },
      fig("Fig. 1"),
      { kind: "text", text: "." },
    ]),
    p(
      text(
        "In order that the apparatus may be brought back to earth without damage thereto, a parachute arrangement may be provided but as such arrangements are well known and form no part of my invention, I have omitted the same from the drawings for the sake of showing other features more clearly. It is also within the scope of my invention to provide the auxiliary rocket with a firing tube from which a third rocket may be discharged and to continue this arrangement to any desired extent. Several features of my invention are also applicable to a structure in which the apparatus head is secured directly to the casing 13, the auxiliary rocket being omitted, and this construction I also consider within the scope of my invention.",
      ),
    ),
    p(
      text(
        "The operation of my device has been clearly indicated in the preceding description but may be briefly restated as follows: The rocket as a whole is mounted in the vertical frame 21 and the wires 43 are placed in contact with the wires 41 until the gyroscope 37 has attained a high speed of rotation. After the wires 43 are withdrawn and the screw 45 has been inserted, the switch 20 may be closed to ignite the charges 16 in the curved tubes 15. The ignition of these charges results in imparting to the rocket apparatus a high speed of rotation and when this has been attained the fuse 14 may be ignited to start the rocket on its flight.",
      ),
    ),
    p(
      text(
        "When the apparatus as a whole has been projected to a considerable height and the propelling charge 12 has been substantially exhausted, the fuse 28 will be ignited which in turn will ignite the charge 27 resulting in the firing of the auxiliary rocket from the tube 24. When the charge 27 is partially consumed, the explosive material in the tubes 30 will be ignited to increase the speed of rotation of the auxiliary rocket. While the rocket as a whole and the auxiliary rocket revolve at a high speed of rotation, the effect of the gyroscope is to maintain the support 33 in the same relative position in which it commenced the flight so that the camera 34 may be directed before the flight in any desired direction and will retain that direction throughout the flight.",
      ),
    ),
    p(
      text(
        "While a preferred form of my invention is shown in the drawings, it is obvious that many changes may be made in the construction herein shown without departing from the spirit and scope of my invention and I do not wish to be limited to the details herein disclosed, but",
      ),
    ),
    p(text("What I claim is:-")),
    claim(
      1,
      "In a rocket apparatus, in combination, a primary rocket, comprising a combustion chamber and a firing tube, a secondary rocket mounted in said firing tube, and means for firing said secondary rocket when the explosive in the primary rocket is substantially consumed.",
    ),
    claim(
      2,
      "In a rocket apparatus, in combination, a combustion chamber containing an explosive and a rearwardly extended tapered tube connected with said chamber through which the gaseous products of combustion are discharged, said tube being in the form of a truncated cone of slight taper and having its length equal to not less than three times its longest diameter.",
    ),
    claim(
      3,
      "In a rocket apparatus, in combination, a primary rocket having a firing tube, a secondary rocket mounted in said firing tube, and adapted to be fired therefrom, means in said primary rocket for causing initial rotation of said rockets, and means in said secondary rocket for thereafter maintaining said secondary rocket in rotation.",
    ),
    claim(
      4,
      "In a rocket apparatus, in combination, a casing, means in said casing for propelling said rocket apparatus, and additional means in said casing for rotating said apparatus, said latter means comprising a plurality of substantially radial transverse tubes backwardly curved with relation to the direction of rotation of the rocket apparatus and containing explosive material together with heating elements embedded therein by which the explosive material in all of the tubes may be fired simultaneously.",
    ),
    claim(
      5,
      "In a rocket, in combination, means for producing initial rotation of the rocket, a casing, a chamber therein containing a charge of propelling explosive, a plurality of substantially radial curved tubes in said casing also containing an explosive, and firing means connecting said explosives by which the explosive in the radial tubes is ignited when the propelling explosive is consumed to a predetermined extent and acts to restore the initial speed of rotation of the rocket.",
    ),
    claim(
      6,
      "A rocket having in combination a combustion chamber, an apparatus head containing a support for the apparatus, means for rotating the rocket, and means to prevent rotation of the apparatus support.",
    ),
    claim(
      7,
      "In a rocket apparatus, the combination, a combustion chamber and an apparatus head, said head containing a pivotally mounted support for the apparatus and having a gyroscope mounted thereon by which the support may be restrained from rotation with the head.",
    ),
    claim(
      8,
      "In a rocket, in combination, an apparatus head, a support for the apparatus pivotally mounted within the head, a gyroscope mounted upon the support, and means for imparting a high initial speed of rotation to said gyroscope.",
    ),
    p(
      text(
        "In testimony whereof I have hereunto set my hand, in the presence of two subscribing witnesses.",
      ),
    ),
    p(text("ROBERT H. GODDARD. Witnesses: FRANCIS W. HIXON, C. FORREST WESSON.")),
  ],
};

/**
 * Patent-local, paragraph-for-paragraph reading companion. These entries are
 * authored explanations of the adjacent source block; they do not replace the
 * legal text or collapse its stated conditions, parts, or figure references.
 */
export const goddardRocketParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: ["This is the conventional public address that opens the specification."],
  3: [
    "Goddard identifies himself, his citizenship, and his Worcester residence, then says that the document describes his new and useful rocket apparatus. The drawings and the written specification are the two source parts that define what he disclosed.",
  ],
  4: [
    "The stated purpose is not orbital travel or a liquid-propellant engine. This apparatus is particularly for lifting photographic or other recording instruments to extreme heights. Goddard also says particular features can display signals or project explosives, so those are expressly contemplated alternative uses.",
  ],
  5: [
    "Goddard frames performance as an energy-conversion problem for a rocket of given mass. The fraction of the explosive charge's heat converted into kinetic energy enters exponentially into the required propelling charge. Raising that efficiency therefore raises velocity sharply and can reduce the explosive charge needed.",
  ],
  6: [
    "The first stated object is an efficient transformation of the propelling charge's heat energy into kinetic energy. The stated result is greater velocity and range of flight, not a claimed numerical exhaust speed or a particular modern nozzle cycle.",
  ],
  7: [
    "The second object is a further flight for the recording apparatus after the whole apparatus has already flown. The source achieves that by an auxiliary device using a second, reduced propelling charge; it does not say that the main casing is discarded by a separation latch.",
  ],
  8: [
    "Goddard separately lists three rotation-and-instrument objectives: give the rocket an initial spin, maintain that spin later, and support the recording apparatus so it does not rotate with the complete rocket. The latter condition makes the camera's orientation an independent design problem.",
  ],
  9: [
    "This is a scope reservation. The described devices, arrangements, and combinations are the preferred form, while the appended claims will state the legal combinations more fully.",
  ],
  10: [
    "The source maps the drawings precisely: Figure 1 is the longitudinal, partly sectional whole rocket; Figure 2 enlarges the head in longitudinal section; Figures 3 and 4 are transverse sections on the indicated Figure 2 lines; and Figure 5 is the reduced-scale vertical firing frame. Each linked crop is from the pinned drawing sheet.",
  ],
  11: [
    "Figure 1's primary rocket has casing, combustion chamber 10, and the elongated tapered tube 11 below it. Disks 12 of explosive are held by casting 13. Goddard prefers disks with progressively increasing combustion rates so the chamber pressure stays constant at the pressure for which tube 11 was designed, while allowing one progressively varying explosive mass as an alternative.",
  ],
  12: [
    "Instead of an ordinary rear opening, Goddard uses elongated tapered tube 11. It is a slightly tapered truncated cone whose length must be at least three times its longest diameter, with larger ratios sometimes necessary. He attributes higher efficiency to gas expansion in the tube and completed combustion before exit; its best proportions are to be determined experimentally. Fuse 14 ignites the disks.",
  ],
  13: [
    "For initial spin, Figure 3 shows substantially radial but backwardly curved tubes or recesses 15 that contain explosive 16. Their gas discharge reacts against the curved passages and rotates the apparatus. The source links this rotation to following a desired path of flight.",
  ],
  14: [
    "Each charge 16 has a fine metal filament or heating element 17 near its outer surface. Wires 18 connect all the filaments in series to battery 19 and key 20. Closing the key heats and ignites all charges together; their gases also expel filaments and wires from the tubes so those electrical parts cannot obstruct subsequent rotation or flight.",
  ],
  15: [
    "Figure 5 supplies a vertical framework 21 that supports the rocket on ball bearings 22 and 23 while the preliminary spin is produced. After charges 16 have created the wanted rotation speed, the operator lights fuse 14 and begins the rocket's flight.",
  ],
  16: [
    "At casting 13's forward end, firing tube 24 holds a smaller auxiliary rocket. That secondary rocket has combustion chamber 25, rearward tapered tube 26, and explosive disks 27. These match the corresponding main-rocket parts in kind, but are made on a reduced scale, so the second vehicle can provide the recording apparatus an additional flight.",
  ],
  17: [
    "Fuse 28 runs from auxiliary explosive 27 through casting 13 and into the last main disk 12. Once the main propelling charge is substantially exhausted, that fuse ignites and tube 24 acts as a gun, projecting the auxiliary rocket. Goddard's stated advantage is mass: the smaller auxiliary rocket can gain more flight from a given explosive amount than that amount would produce in the combined primary-and-secondary mass.",
  ],
  18: [
    "Atmospheric friction can reduce the auxiliary rocket's spin. Its head 29 therefore contains backwardly curved transverse recesses 30, like primary recesses 15, with explosive charges 31. Small inward tubes 32 connect to explosive 27 through a rapidly burning compound; when that charge is consumed to a predetermined extent, the compound ignites charges 31 and increases or restores rotation.",
  ],
  19: [
    "Head 29 pivotally carries support 33 for the recording apparatus, illustrated as camera 34. Openings 35 are separated by narrow supports 36. Goddard says head rotation is fast enough that the supports' passage before the camera does not interfere with taking photographs.",
  ],
  20: [
    "Support 33 must not turn with head 29, so it contains gyroscope 37 in bearings 38. Goddard makes the gyroscope the armature of a three-phase induction motor, with field coils 39 on frame 40 fixed to the support. Three-phase current reaches wires 41 through insulating plug 42 and temporary contact wires 43 through opening 44; after sufficient speed, those wires are removed and screw 45 closes the opening.",
  ],
  21: [
    "A parachute may return the apparatus without damage, but Goddard omits it from the drawings because it is well known and outside this invention. He also expressly allows an auxiliary rocket with another firing tube for a third rocket and continuation to any desired extent. Alternatively, the head may attach directly to casing 13 and the auxiliary rocket may be omitted.",
  ],
  22: [
    "The operating sequence begins in frame 21. Contact wires 43 energize the gyroscope through wires 41 until gyroscope 37 is fast enough; the wires are withdrawn and screw 45 inserted. Next key 20 ignites the curved-tube charges 16 for spin. When the desired rotation is reached, fuse 14 ignites the main propelling charge and launches the rocket.",
  ],
  23: [
    "At considerable height, substantial exhaustion of main charge 12 ignites fuse 28, then charge 27, firing the auxiliary rocket from tube 24. Partial consumption of 27 later ignites material in tubes 30 to increase its spin. Although both rocket bodies spin rapidly, gyroscope 37 maintains support 33's original relative position, so camera 34 retains the direction chosen before flight.",
  ],
  24: [
    "The illustrated construction is preferred, not exhaustive. Goddard says changes can be made without departing from the invention's spirit and scope, and he does not limit himself to the detailed form before moving to the claims.",
  ],
  25: [
    "The following eight numbered claims are the legal definition of the protected combinations.",
  ],
  34: ["Goddard signs the completed specification in the presence of two subscribing witnesses."],
  35: [
    "The signature line identifies Robert H. Goddard and names Francis W. Hixon and C. Forrest Wesson as witnesses.",
  ],
};
