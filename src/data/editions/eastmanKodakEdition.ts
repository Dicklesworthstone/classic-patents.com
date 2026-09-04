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

const figureSourceSheets = {
  1: 1,
  2: 1,
  3: 1,
  4: 2,
  5: 2,
  6: 2,
  7: 2,
  8: 2,
  9: 3,
  10: 3,
  11: 2,
} as const;

const figure = (number: keyof typeof figureSourceSheets): CuratedSpecificationInline => {
  const sourceSheet = figureSourceSheets[number];

  return {
    kind: "reference",
    text: `Fig. ${number}`,
    href: `#fig-${number}`,
    referenceType: "figure",
    label: `Open complete source drawing sheet ${sourceSheet} for Fig. ${number} from US 388,850`,
    figurePreviews: [
      {
        src: `/patents/figures/us-388850-eastman-kodak/source-sheet-${sourceSheet}-v1.png`,
        alt: `Complete unmodified source drawing sheet ${sourceSheet} from George Eastman's US 388,850 Camera patent, including Fig. ${number}.`,
        width: 2560,
        height: 3300,
      },
    ],
  };
};

/**
 * Continuous, hand-authored reading of the complete 1888 grant. Page furniture
 * is retained in the reviewed ledger and provenance map, not in this source face.
 */
export const eastmanKodakArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "49c9e9ff048771cb4fcc97b811af7f666c9925bb01b3b46d1588f95c63c0cfe1",
  preparedBy: "PurpleDog, manual facsimile review",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "GEORGE EASTMAN, OF ROCHESTER, NEW YORK.",
        "CAMERA.",
        "Specification forming part of Letters Patent No. 388,850, dated September 4, 1888.",
        "Application filed March 30, 1888. Serial No. 268,964. (No model.)",
      ],
    },
    p([{ kind: "emphasis", text: "To all whom it may concern:" }]),
    p(
      text(
        "Be it known that I, GEORGE EASTMAN, of Rochester, in the county of Monroe and State of New York, have invented certain new and useful Improvements in Cameras; and I do hereby declare the following to be a full, clear, and exact description of the same, reference being had to the accompanying drawings, forming a part of this specification, and to the figures and letters of reference marked thereon.",
      ),
    ),
    p([
      {
        kind: "text",
        text: 'This invention relates more particularly to improvements in that class of photographic apparatus known as "',
      },
      {
        kind: "term",
        text: "detective cameras",
        definition:
          "A late-nineteenth-century name for a small portable camera intended to be used discreetly or without the elaborate apparatus of studio photography.",
        label: "Period camera term",
      },
      {
        kind: "text",
        text: ';" and said invention consists in the novel and improved form, construction, and arrangement of parts constituting the case or body, the lens-support and shutter, and the film-holder, together with the various combinations of such instrumentalities as are hereinafter described, and set forth in the claims.',
      },
    ]),
    p([
      {
        kind: "text",
        text: "In the accompanying drawings, wherein I have illustrated one embodiment of my present improvements, ",
      },
      figure(1),
      { kind: "text", text: " is a view in perspective of the complete instrument. " },
      figure(2),
      { kind: "text", text: " is a side and " },
      figure(3),
      {
        kind: "text",
        text: " a top view of the camera, the side and top of the box being removed to disclose the interior arrangement. ",
      },
      figure(4),
      { kind: "text", text: " is a front view with cap or end of box removed. " },
      figure(5),
      { kind: "text", text: " is a view in perspective of the lens-holder and shutter. " },
      figure(6),
      {
        kind: "text",
        text: " is a view in perspective of the lens-holder and shutter, several of the parts being detached. ",
      },
      figure(7),
      { kind: "text", text: ", " },
      figure(8),
      { kind: "text", text: ", " },
      figure(9),
      { kind: "text", text: ", and " },
      figure(10),
      { kind: "text", text: " are views in perspective of the " },
      {
        kind: "term",
        text: "roller-holder",
        definition:
          "The removable rear assembly that carries, guides, tensions, and winds the photographic film inside the camera box.",
        label: "Period mechanism term",
      },
      { kind: "text", text: ", looking from opposite sides. " },
      figure(11),
      {
        kind: "text",
        text: " is a detail view illustrating the manner of mounting and supporting the spool. Similar letters of reference in the several figures indicate the same parts.",
      },
    ]),
    p(
      text(
        "The letter A designates the camera box or case, preferably constructed in the form of a rectangular tube, at or near one end of which is fastened a block, B, recessed for the reception or accommodation of the lens-holder and shutter and perforated, as at b. In this block B, or between it and the end piece or cover, B', is located the lens and shutter mechanism, and in rear of said block is located the roller-holder C, the latter being inserted within and closing the rear end of the box or tube A.",
      ),
    ),
    p(
      text(
        "The roller-holder C is secured to or formed integral with the rear cap plate or cover, C', and the sides of said holder upon which the operating devices are supported is formed to fit snugly within the tube A, the cover C' overlapping or otherwise co-operating with the end of the box A to form a light-tight connection, so that when said roller-holder is inserted and held within the end of the box the sensitized film or plate will be entirely protected from light in rear and at the sides, and will only be exposed to light entering through the perforation b in block or diaphragm B.",
      ),
    ),
    p(
      text(
        "The block or end piece, B, is designed not only to close the front end of case A and protect the sensitized plate or film, but also to receive and encompass the lens-holder and shutter; and to this end said block, whether formed in one, two, or more sections, is provided with a chamber or recess, b', and coincident openings b. In the illustration given the block B is formed in two sections, the rear section or that one permanently secured within the case A being provided with a rectangular or other shaped recess, b', into which the front section enters and fits snugly, the recess or chamber b', for the reception of the lens-support and shutter, being formed in the proximate surfaces of the two sections in the rear of the walls of recess b', so that light will be entirely excluded from the interior of the case and from the chamber b', with the exception of such as may be permitted to enter through openings b.",
      ),
    ),
    p(
      text(
        "To render the exclusion of light more certain, the front section is attached to the cap or cover B', the latter making contact with the front face of the rear section and entering the mouth or front end of case A. The principal object and function of this construction is to furnish a convenient light-tight end piece for the camera-box and a receptacle for the lens and shutter, one which will furnish ample support for the lens and shutter mechanism and permit access to the latter when desired; hence any device or contrivance which, when located in front of the camera box or tube, and whether composed of one, two, or more parts or sections, will furnish a light-tight casing or chamber between the apertures through which light is admitted to the interior of the camera through the lens, will be the equivalent of the block B in its generic relation to the lens-support and shutter mechanism about to be described.",
      ),
    ),
    p(
      text(
        "The lens-support and shutter mechanism employed, although specially adapted for use in connection with this camera, illustrates one of the many forms or embodiments of my invention—that is to say, it illustrates a new type rather than a new species of an old type—its principal distinguishing feature being a lens mounted or held within a chamber, such as b', in front of the exposing-chamber, and a cylindrical case or shutter provided with coincident slots or openings on opposite sides, said case or shutter being rotated or reciprocated intermittently to cause the slots or openings therein to pass across the opposite ends or faces of the lens, the solid opaque portions or body of the shutter standing normally and when at rest across both faces of the lens and between the exposing-aperture and the plate or film within the camera.",
      ),
    ),
    p(
      text(
        "Suitable devices are to be employed for reciprocating or intermittently rotating the cylindrical shutter and for holding it at rest. Referring to the preferred form or embodiment of the principle, as illustrated in the drawings, S represents the cylindrical shutter, L the lens, and L' the lens-support, the latter also constituting the support for the shutter and its actuating mechanism, as will hereinafter appear.",
      ),
    ),
    p(
      text(
        "The lens-support, with its attachments, is located within the recess or chamber b' in block B; and in order that the whole of said mechanism may be readily inserted or removed, and at the same time avoid all danger of possible leakage of light, it is seated and held in position within the chamber b' between the fixed and removable sections of the block B. To this end the lens-support proper, consisting of a frame or plate, l, in which the lens L is detachably secured, is mounted upon or provided with posts l' at opposite ends, these posts being formed or provided at or near their outer extremities with heads l², of cylindrical or other shape, adapted to fit the interior of chamber b' on opposite sides of the opening b.",
      ),
    ),
    p(
      text(
        "For convenience of manufacture and simplicity of construction, the head l² is formed with a collar or socket, l³, in which the post l' of the lens-support is secured by a pin or screw, l⁵, while the head l² at the opposite end is removably attached to its post l' by a screw or pin, l⁶. The head l² is also formed or provided with a cross-piece or shoulder, l⁷, which engages with a shoulder or abutment within the chamber b', such as the shoulder l⁸ on the two sections of block B, the purpose of said shoulder l⁷ and a similar shoulder, l⁷, on the opposite head l² being to sustain the lens-support in position and prevent rotation.",
      ),
    ),
    p(
      text(
        "The shutter consists of a hollow cylinder, S, provided with coincident openings s, and preferably closed at both ends. The lens is supported within this cylinder S, and the latter is mounted to rotate or reciprocate about an axis transverse to the axis of the lens, the openings s moving in a plane intersecting the axis of the lens on opposite faces thereof, to which end said cylinder is journaled at one or, preferably, both ends upon the posts l' of the lens support, so that it has a motion about said posts and around the lens supported between them, and at each half-revolution of the cylinder the openings s will be caused to approach and cross the opening or axis of the lens at opposite ends and from opposite sides or edges.",
      ),
    ),
    p(
      text(
        "It is of course desirable that some competent means be provided for holding and actuating the cylindrical shutter. A mechanism of this character is shown, comprising a motor mechanism for impelling or moving the shutter and a stop and release mechanism. The motor mechanism consists of a ratchet-wheel, 5, rotating loosely upon the pin l', attached to one head of the cylinder S, and connected to the latter by a spring, 7, inclosed within the end of the cylinder S and between it and the wheel 5. A ratchet-and-pawl connection, 8, between the wheel 5 and pin l', permits the said wheel to rotate freely in a direction to wind up the spring 7, but prevents a retrograde movement.",
      ),
    ),
    p(
      text(
        "On the pin l', between the head l² and wheel 5, is mounted a drum or pulley, 9, carrying a spring-pawl, 10, for engaging the teeth on wheel 5 to rotate the latter in a direction to wind up the spring 7, a spring, 11, serving to retract said drum 9. A cord or other flexible connection, 12, is attached at one end to this drum, so that by alternately pulling upon said cord the drum will be reciprocated upon its axis, and through the ratchet-connection the wheel 5 will be rotated to wind up the spring 7, one end of which is secured to the shutter, and hence tends to rotate the latter. This constitutes the motor mechanism, the spring serving to drive or advance the shutter and the drum 9 to wind up the spring, and in the improved structure shown all of said mechanism is mounted upon the lens-support. The winding-cord 12 is passed through a suitable orifice in the block B with a knot or knots, and is manipulated from the outside of the case.",
      ),
    ),
    p(
      text(
        "The devices for controlling the movements of the shutter, also mounted upon the lens-support, comprise a plate, 20, formed upon or secured to one end of the hollow cylindrical shutter, and provided with peripheral shoulders 21 and surface shoulders or abutments 22. Above the plate 20 and mounted upon a transverse pin or pivot is a latch, 23, the lower edge on opposite sides of the pivot being inclined or beveled in the same direction. One end of this latch 23 is held pressed down by a spring, 24, while a push-pin, 25, passing through head l², bears upon the opposite end of the latch. The pin 25 is preferably formed with a collar fitting an enlarged recess in the head l², and is held in place by a collar or thimble, 26, screwed or otherwise detachably secured in the case or box A. A spring, 27, attached to head l² bears against the periphery of the plate 20.",
      ),
    ),
    p(
      text(
        "The operation of the controlling devices, arranged as described, is as follows: The rotation of the shutter, when acted upon by the motor devices, is arrested by one of the abutments, 22, resting in contact with the beveled side of the latch, the latter being held in place by its spring 24. When in this position the opposite end of the latch stands with its beveled edge above the opposite abutment 22, so that when the latch is oscillated by pressure upon the push-pin 25 the abutment on one side will ride down the beveled face of the latch and the shutter be correspondingly advanced before the elevated end of the latch reaches the abutment which is beneath it, so that when the engaging end of the latch passes off from the abutment on that side the other abutment will have passed beyond or cleared the edge of the latch on the opposite side, and the shutter impelled by its motor or spring will be driven forward until the previously-engaged abutment comes in contact with the previously-elevated but now depressed end of the latch.",
      ),
    ),
    p(
      text(
        "The push-pin being released and the latch permitted to resume its first position, the abutment beneath the push-pin, and now held against the vertical face of the latch, is released, and at the same time the beveled face on the opposite end of the latch is interposed in front of the other abutment, a very slight forward movement of the shutter being permitted, when it is again arrested and held until the push-pin is depressed. One edge of the latch is at all times projected in the path traversed by the abutments 22, so that the shutter can, under no circumstances, perform more than a half-revolution. It will thus be observed that each time the push-pin is depressed the shutter is permitted to make a half-revolution about the lens, is arrested at this point, and upon removing the pressure from the push-pin the devices are automatically set in position to repeat the same operations.",
      ),
    ),
    p(
      text(
        "The abutments 22 are so disposed relatively to the openings in the shutter that when the latter is arrested by the latch the solid or opaque portions of the cylinder will stand in front of or across the axis of the lens, and when released, as in passing from one abutment to the next, the lens will be uncovered simultaneously at opposite ends and from opposite edges. The spring 27, bearing upon plate 20, operates as a brake to control or regulate the speed at which the cylindrical shutter revolves, and, in conjunction with the shoulders 21, it acts as a detent or stop for preventing a retrograde movement of the shutter. To provide for holding the shutter at an intermediate point, so that the lens will be wholly exposed, radial grooves 29 are formed in the face of the plate 20 to receive the edges of the latch, so that the shutter can be retained in position with the openings in line with the axis of the lens, and by pressing the push-pin can be at once set for action, as before described.",
      ),
    ),
    p(
      text(
        "It will be observed that as thus constructed and arranged not only is a simple, cheap, compact, and withal effective and accurate shutter and lens-support formed, the whole constituting in effect a complete article distinct from its case, and which is not only complete in itself and can readily be applied with but slight changes and modifications to almost any form of cameras, but when applied and used in the manner indicated—that is to say, when located within a closed chamber at the end of the camera box or case—it can be quickly inserted or removed without the aid of special skill, can be adapted and held in position wholly by the walls of the case or chamber, and when so applied it forms an efficient means for preventing the entrance of light into the exposing-chamber until such time as the shutter is actuated to uncover the aperture in the lens.",
      ),
    ),
    p(
      text(
        "The next, or what may be termed the third, constituent element of my improved instrument comprises a competent means for holding and presenting the plate or film within the camera box or case in position to receive the rays of light passing through the lens. As is obvious, any holder competent to perform the well-understood operation may be employed for this purpose; but I prefer, for obvious reasons, to make use of prepared films, and to this end have devised the following improved form of roll-holder: The operating mechanism of this holder C comprises a supply-spool, c, detachably mounted on supporting pins or journals c', a measuring roller, c², furnished with suitable puncturing-pins or marking devices, guide-rollers c⁴, a platen or support, c⁵, for the film, a winding-roller, c⁶, provided with a detaining or film-attaching device, a tension device, c⁷, applied to the supply-spool, a ratchet or detaining device, c⁸, applied to the winding-spool, and an indicator, c⁹, connected to or actuated by the measuring-roller, all as set forth and described, in whole or in parts, in Patents Nos. 317,019, 317,050, and 316,933, and in my prior application Serial No. 199,329, filed April 19, 1886.",
      ),
    ),
    p(
      text(
        "The improvements herein claimed relate, mainly, to the construction and arrangement of parts whereby the holder is adapted for use in connection with a tubular case such as A, forming a part of the camera proper. The several co-operating elements are mounted and supported wholly upon and between the two side pieces, C³ C³, attached to a base C⁵, which forms or is secured to the cap C' for closing the rear end of the case or box A, the several attaching devices being so arranged and constructed as not to project beyond the outer surfaces of the side pieces, leaving the latter smooth and unobstructed, so that the holder can be fitted and slid within the opening in the rear end of the box A.",
      ),
    ),
    p(
      text(
        "The covering-plate c¹⁰ serves to retain the film and hold the edges down upon the platen. The pins or journals supporting rollers c² c⁴ pass through the side plates, their outer ends being flush with or standing below the outer faces of the side pieces. The rollers c⁴ and one end of the roller c² are preferably supported upon the ends of pins c¹¹ screwed through the side pieces, while the opposite end of roller c² carries a collar bearing against the inner surface of the side piece C³, and is supported upon a stud, c¹², screwed into the end of said roller and passing through a hole in the side piece, the outer end of said stud being formed or provided with a head resting in a countersunk recess and bearing a mark, c⁹, which latter, when brought into proper relation to a fixed point, serves to indicate the quantity of film wound on the roller c⁶.",
      ),
    ),
    p(
      text(
        "The head c¹³, for receiving and supporting one end of the supply-spool, and to which the tension device c⁷ is applied, is held in place and supported upon a detachable pin, c¹⁴, passing through the side piece C³, and provided with a flat head or disk, c¹⁵, countersunk in the outer face of side piece C³, while the opposite end of the spool is supported upon a pin, c¹⁶, resting in a socket or bearing, c¹⁷, secured in position on the inner face of side piece C³. The pin c¹⁶ is also provided with a head or cross-piece, c¹⁸, and a stud, c¹⁹, the former secured in a countersink on the outer face of the side piece, and the latter adapted to be inserted or withdrawn through a notch or way, c²⁰, in the bearing c¹⁷, serving, when inserted, to hold the pin in place by bearing against the inner face of the socket.",
      ),
    ),
    p(
      text(
        "The supports for the winding-spool are constructed substantially the same as those for the supply-spool, with this exception, however, that the pin corresponding to c¹⁴, supporting the head to which the ratchet or detaining devices are applied, is provided with a central screw-threaded aperture or equivalent connecting means for the reception of the winding-key C⁶. The construction described is more especially designed for use when the side pieces are made of wood; but constructed of metal or other material corresponding modifications might be made in the fittings without involving any material change in the invention. The roller-holder as thus constructed is adapted for insertion within any tube or box A of the proper dimensions, and without other fitting than such as will accommodate the winding-key C⁶ and render visible the indicator, and at the same time prevent access of light to the interior of the camera; for, as is well understood, all light except such as is transmitted through the lens must be excluded from the exposing-chamber in rear of the lens.",
      ),
    ),
    { kind: "heading", level: 2, text: "Claims" },
    claim(
      1,
      "The combination, to form a camera such as described, of a tubular case or box closed at one end by a detachable film-holder and at the other by a block or end piece, and a removable shutter and lens-support held within a chamber in said block or end piece.",
    ),
    claim(
      2,
      "In a camera such as described, the combination, with the box or case, of a block or partition closing the front end and forming a chamber with coincident openings, a fixed lens-support, and rotary shutter mechanism connected in fixed relation and supported within said chamber, as and for the purposes set forth.",
    ),
    claim(
      3,
      "In a camera, and in combination with a tubular box or case, a block or diaphragm fixed in position within the front end and provided with an aperture, a cap or end piece provided with an aperture and co-operating with the said block or diaphragm to form a chamber within the box or case, a lens supported within said chamber between the said apertures, and a shutter mounted upon the lens support, substantially as described.",
    ),
    claim(
      4,
      "The combination, in a camera and with the lens, of a shutter surrounding the latter and provided with coincident apertures, substantially as described.",
    ),
    claim(
      5,
      "In a camera, and in combination with the lens, a shutter projected on opposite faces of the lens and provided with coincident apertures, said shutter being operated to simultaneously uncover both faces of the lens from opposite edges thereof, substantially as described.",
    ),
    claim(
      6,
      "In a camera, and in combination with a lens and its support, a shutter provided with coincident apertures or spaces and intermediate covering-plates projected on opposite sides of the lens, and devices for operating said shutter to alternately uncover and cover both faces of the lens simultaneously, as and for the purpose set forth.",
    ),
    claim(
      7,
      "In a camera, and in combination with the lens, a double shutter embracing the lens and mounted upon a pivotal support, about which it is rotated intermittently to uncover both faces of the lens simultaneously, substantially as described.",
    ),
    claim(
      8,
      "In combination with the lens and its fixed support, a shutter embracing the lens and mounted to rotate intermittently about the latter on an axis transverse to the axis of the lens, substantially as described.",
    ),
    claim(
      9,
      "In combination with a lens and its support, a hollow shutter encircling the lens and provided with coincident apertures, said shutter being pivotally mounted upon the lens support, substantially as described.",
    ),
    claim(
      10,
      "The combination, with a lens, of a hollow case or shutter surrounding said lens and provided with coincident apertures, said shutter being pivotally attached to the lens-support, the whole constituting a complete lens and shutter attachment adapted for application to a camera, substantially as described.",
    ),
    claim(
      11,
      "A combined lens-holder and shutter, consisting, essentially, of a lens-support and an intermittently-rotating inclosing case or shutter provided with coincident apertures, said shutter being sustained wholly upon the lens-support, substantially as described.",
    ),
    claim(
      12,
      "In combination with the lens-support and the embracing-shutter provided with coincident apertures and mounted to rotate about the lens, a motor or impelling device connected to the shutter, and devices for releasing and arresting the shutter, substantially as described.",
    ),
    claim(
      13,
      "A pivotal hollow shutter provided with coincident apertures, a motor, and stopping and releasing devices, in combination with a lens fixedly supported within the shutter, substantially as described.",
    ),
    claim(
      14,
      "A lens-support and shutter mechanism connected together and adapted to be inserted within a chamber or recess in the front end of the camera box or tube, said lens and its support being held fixedly in position by the inclosing-walls thereof, substantially as described.",
    ),
    claim(
      15,
      "In combination with a hollow shutter closed at both ends and provided with coincident apertures, a lens supported and held within said hollow shutter, substantially as described.",
    ),
    claim(
      16,
      "In combination with a lens and its support, a shutter surrounding the lens and pivotally mounted upon the support of the latter, a motor device applied to one end and a releasing device on the opposite end of the shutter, substantially as described.",
    ),
    claim(
      17,
      "In combination with the lens-support and the shutter mounted thereon and inclosing the lens, the motor and releasing devices for controlling the movements of the shutter, also mounted upon the lens support, substantially as described.",
    ),
    claim(
      18,
      "In combination with the lens support and the inclosing-shutter mounted thereon and provided with apertures rotating in the plane of the axis of the lens, a chamber formed in the front end of the camera-tube, provided with coincident apertures and adapted to receive and hold the lens and shutter mechanism by engaging the lens support, substantially as described.",
    ),
    claim(
      19,
      "In combination with the lens-support and a shutter mounted thereon and provided with coincident apertures, a wheel, a spring interposed between said wheel and the shutter, a ratchet interposed between said wheel and its support, and a drum connected to said wheel by a ratchet or equivalent device for communicating motion to the wheel to wind up the spring, substantially as described.",
    ),
    claim(
      20,
      "In combination with the lens-support and its encircling shutter pivotally mounted thereon, a motor device comprising ratchet, spring, and winding-drum mounted on the lens-support at one end of the shutter, and a releasing device mounted upon the lens-support and engaging the opposite end of the shutter, substantially as described.",
    ),
    claim(
      21,
      "In combination with a rotary shutter and a motor device applied thereto, abutments secured to said shutter on opposite sides of its axis, and a pivoted latch provided with an inclined or beveled edge co-operating with said abutments, substantially as and for the purpose set forth.",
    ),
    claim(
      22,
      "In combination with the rotary shutter, its motor and releasing devices mounted upon the lens-support and between the heads by which said support is held in place within the camera, substantially as described.",
    ),
    claim(
      23,
      "In combination with the lens-support, provided with posts on opposite sides of the lens and sustaining-heads on said posts, a hollow shutter journaled on said posts and inclosing the lens, a latch for engaging one end of the shutter, and a motor device applied to the opposite end, substantially as described.",
    ),
    claim(
      24,
      "In combination with a pivoted tubular shutter, a motor acting thereon to rotate it continuously in one direction, a pivoted latch for alternately engaging and releasing the shutter, and a tension device, also engaging the shutter to regulate its movements, substantially as described.",
    ),
    claim(
      25,
      "In combination with the rotary shutter mounted upon the lens-support, a cam-plate secured to the shutter and provided with shoulders or abutments co-operating with a latch pivoted in the post of the lens-support and actuated by a pin passing through the head of said support, substantially as described.",
    ),
    claim(
      26,
      "In combination with a rotating shutter, provided with a cam-plate carrying abutments, a latch engaging said abutments, and a spring bearing against the cam-plate and serving both as a brake and stop, substantially as described.",
    ),
    claim(
      27,
      "In a camera such as described, and in combination with the box or case, the apertured block secured within the front end of the box and provided with a transverse groove for the reception of the combined lens-support and shutter, substantially as described.",
    ),
    claim(
      28,
      "In a camera such as described, the combination, with the box or case, of the sectional block secured within the front end, said block being provided with coincident apertures, and a transverse groove or chamber for the reception of a lens-support and shutter mechanism, substantially as described.",
    ),
    claim(
      29,
      "In a camera such as described, and in combination with a box, and a combined lens-support and shutter mechanism located within a chamber in the forward end of the camera-box, a flexible connection extending through the walls of the box and connected to the motor devices of the shutter, and a push-pin connected to the shutter-releasing devices and guided by the lens support, substantially as described.",
    ),
    claim(
      30,
      "An improved detachable lens and shutter device such as hereinbefore described, the same comprising a lens and inclosing-shutter, both mounted upon a single supporting-frame adapted to be inserted within the camera tube or case, substantially as described.",
    ),
    claim(
      31,
      "A detachable lens and shutter device substantially such as herein described, consisting, essentially, of a supporting-frame provided with a transverse aperture for the reception of the lens, a hollow shutter pivotally attached to said frame and surrounding the lens and devices carried by the supporting-frame for actuating the shutter, substantially as described.",
    ),
    claim(
      32,
      "In a camera such as described, and in combination with the tubular box or case, a film carrying and feeding mechanism, substantially such as indicated, for insertion longitudinally of and within the rear end of the said box or case to close the rear end thereof, and consisting, essentially, of the supply-spool, guiding-rolls, platen, and winding-roller, the whole mounted and supported between the outer faces of side pieces, so that no part projects beyond the said outer faces, substantially as described.",
    ),
    claim(
      33,
      "In a roller-holder adapted for insertion within a tubular camera box or case, substantially as described, the combination, with the side pieces, of the removable supports for the spool passed through the side pieces and having their outer edges flush with or below the outer faces of said side pieces, as and for the purpose set forth.",
    ),
    claim(
      34,
      "In a roller-holder such as described, the combination, with the supporting-frame or side pieces fitted to the interior walls of the camera box or case, of the socket c¹⁷ and pin c¹⁶, provided with cross-pieces or head c¹⁸, resting in a countersunk recess in the outer face of the side piece, and a stud, c¹⁹, adapted to enter through a slot or notch in the socket c¹⁷, as and for the purpose specified.",
    ),
    claim(
      35,
      "In a roller-holder such as described, as a means for detachably supporting the film-carrying roller, a head for engaging one end of the roller supported upon a pin passing through one side piece, with its head countersunk in the outer face of the latter, a socket-plate applied to the inner face of the opposite side piece, and a pin for supporting the end of the roller passing through said socket, its head countersunk in the outer face of the side piece, said pin being detachably held in position by the wall of the camera-box, and a stud projecting on the inner side of the socket and adapted to pass through a slot or notch in the latter when the pin is withdrawn.",
    ),
    claim(
      36,
      "The combination, in a camera such as described, and with the tubular box or case thereof provided with sockets or openings for the indicator and winding-key, of a roller-holder provided with closed side pieces sustaining the film holding and carrying mechanism and projected, when in place, within the box or case beyond the sockets or openings therein, an indicator flush with or slightly below the outer face of the side piece and in line with one of the openings in the case or box, and a removable key inserted through the other opening and engaging the winding mechanism below the outer face of the side piece, whereby the roller-holder is adapted to be inserted and withdrawn, and to fit snugly within the camera box or case, and the openings for the indicator and winding-key are closed to prevent the entrance of light, as set forth.",
    ),
    claim(
      37,
      "In a camera such as described, the combination, with the box or case open at the rear end, of a roller-holder adapted for insertion within the rear end of said case or box and fitting snugly against the walls of the latter, and a detachable key passing through said box or case and engaging the film-winding devices, said key serving to lock and hold the roller-holder against longitudinal movement within the case, substantially as described.",
    ),
    claim(
      38,
      "In a camera, and in combination with the lens thereof, a shutter mechanism operating on opposite faces of the lens to simultaneously uncover and cover the front and rear of the lens tube or aperture, substantially as described.",
    ),
    claim(
      39,
      "In combination with the lens and its inclosing case or tube, through which light is conducted to the interior of the camera, a shutter mechanism adapted to interpose and withdraw light-excluding media simultaneously in front and in rear of the lens, to cover and uncover both faces of the lens, substantially as described.",
    ),
    claim(
      40,
      "In a camera such as described, and in combination with the lens, an inclosing casing or tube, shutter mechanism provided with two light-excluding media, the one movable in front and the other in rear of the lens, with devices for actuating said light-excluding media to simultaneously uncover and cover both faces of the lens, substantially as described.",
    ),
    claim(
      41,
      "In a camera such as described, the combination, with the box or case open at both ends, of the lens and diaphragm closing the front end, and the roller-holder fitted to the walls of the case, inserted from the rear end and removably held in position therein, substantially as described.",
    ),
    p([{ kind: "small-caps", text: "GEO. EASTMAN." }]),
    p(text("Witnesses: EDWIN O. SAGO, GEO. W. DEMING.")),
  ],
};

export const eastmanKodakParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: ["The formal salutation introduces the legal specification that follows."],
  2: [
    "Eastman identifies himself, location, subject, and the drawings as part of the written disclosure.",
  ],
  3: [
    "The invention concerns compact portable cameras, then called detective cameras, and is defined as a coordinated case, shutter, lens support, and film holder rather than a named retail product.",
  ],
  4: [
    "This paragraph supplies the source map: Figures 1 through 11 show the complete camera, its lens-shutter module, and removable film-handling assembly.",
  ],
  5: [
    "A is the tubular camera case. Its front block B contains the lens and shutter, while the removable rear roller-holder C closes the rear of the box.",
  ],
  6: [
    "The rear holder carries the film mechanism and overlaps the case so sensitized film receives light only through the intended front opening.",
  ],
  7: [
    "Block B makes a light-tight front chamber around the lens-support and shutter. The sectional construction lets that module be inserted without creating stray-light paths.",
  ],
  8: [
    "Eastman states the functional boundary of the front block broadly: any front structure that supports the module and excludes stray light between the lens apertures performs this role.",
  ],
  9: [
    "The key shutter idea is a hollow cylinder with aligned openings. When the cylinder turns, its open sectors cross both sides of the lens while opaque portions cover them at rest.",
  ],
  10: [
    "The lens frame holds both lens and shutter, so the assembly can be installed as a single unit inside the front chamber.",
  ],
  11: [
    "The posts and shaped heads locate the lens frame in the chamber, keep it from rotating, and let one end be detached for assembly or service.",
  ],
  12: [
    "The shutter is a hollow cylinder around the lens. Its two aligned openings cross the optical axis together during each half-turn.",
  ],
  13: [
    "A ratchet wheel and spring store energy for the shutter; the ratchet permits winding while resisting reverse rotation.",
  ],
  14: [
    "Pulling the external cord reciprocates a drum, winds the spring through a ratchet, and arms the shutter without opening the light-tight case.",
  ],
  15: [
    "A cam plate, abutments, spring-loaded latch, and push-pin create a repeatable stop-and-release control at the shutter end.",
  ],
  16: [
    "Pressing the push-pin moves the latch from one abutment to the next, letting the spring drive a controlled half-revolution before the latch stops it again.",
  ],
  17: [
    "Releasing the push-pin resets the latch. The geometry prevents more than a half-turn per operation, so the shutter repeats the same exposure cycle.",
  ],
  18: [
    "The stop positions put opaque cylinder material across the optical path. Grooves can hold the shutter open, while the spring also brakes motion and prevents rollback.",
  ],
  19: [
    "Eastman presents the lens and shutter as a removable, self-contained article that becomes light-tight when seated in the camera's front chamber.",
  ],
  20: [
    "The third element is the film holder: supply spool, measuring and guide rollers, platen, winding roller, tension and detaining devices, and an indicator for film advance.",
  ],
  21: [
    "The roller-holder mounts all of its mechanisms between smooth side pieces so it can slide into the rear of the tubular camera body.",
  ],
  22: [
    "The plate and roller supports retain film against the platen, while an external mark on the measuring roller reports how much film has wound onto the take-up roller.",
  ],
  23: [
    "Detachable pins and sockets support the supply spool. Their heads and studs are shaped so the spool can be installed, retained, and removed from the holder.",
  ],
  24: [
    "The winding-spool uses a similar support but adds the external winding key. The described fittings preserve the light barrier while leaving the indicator visible.",
  ],
  25: [
    "The final construction statement explains that the rear holder must fit the tube, expose its indicator and winding key only through controlled openings, and otherwise exclude light.",
  ],
  68: ["The inventor's printed signature closes the legal claims."],
  69: ["Edwin O. Sago and George W. Deming are printed as witnesses to the grant."],
};
