/**
 * Hand-authored, paragraph-level companion readings for published archival
 * editions. These are editorial translations, not OCR cleanup or generated
 * summaries. Each entry retains the material mechanism, conditions, and
 * limitations of its matching source block. Keys are explicit block positions
 * in the edition file.
 */
export type ArchivalParallelReading = readonly string[];

export const ARCHIVAL_PARALLEL_READINGS: Readonly<
  Record<string, Readonly<Record<number, ArchivalParallelReading>>>
> = {
  "us-821393-wright-flyer": {
    4: [
      "This is the standard public notice at the start of a United States patent. It addresses any reader who may need to know what the inventors claim to have made.",
    ],
    5: [
      "Orville and Wilbur Wright identify themselves as United States citizens living in Dayton, Montgomery County, Ohio. They say they have made a new and useful improvement in flying machines.",
      "The rest of the document is the legal specification: a description detailed enough to explain the apparatus and the boundaries of the invention claimed at the end.",
    ],
    6: [
      "The patent concerns a machine supported by aerodynamic force. One or more wing surfaces move edgewise through the air at a small angle, so the air exerts an upward reaction on them.",
      "The forward motion can come from mechanical power, such as an engine and propellers, or from gravity while a machine glides downward and forward. The control system is intended to work in either case.",
    ],
    7: [
      "The Wrights list four design jobs: preserve or restore lateral balance, guide the machine vertically, guide it horizontally, and build the structure with low weight, adequate strength, and practical construction.",
      "“Lateral balance” means preventing one side of the aircraft from falling while the other rises. Vertical guidance concerns pitch and climb or descent; horizontal guidance concerns the direction of travel.",
    ],
    8: [
      "They will first describe the physical features they consider new. After the description, the numbered claims will define the legal combinations for which they seek protection.",
    ],
    9: [
      "Figure 1 gives a perspective view of one form of the apparatus. Figure 2 gives a plan view, partly cut in horizontal section and partly broken away so internal relationships can be seen.",
      "Figure 3 is a side elevation. Figures 4 and 5 enlarge one flexible joint used between an upright standard and an aeroplane. The figure links open the corresponding primary facsimile, rather than a reconstructed drawing.",
    ],
    10: [
      "A flying machine of this kind stays aloft because moving air presses against the underside of one or more aeroplanes presented at a small angle of incidence. Relative airflow can come from a headwind while the craft travels, from a combined forward-and-downward glide from altitude, or from engine-driven forward motion.",
      "In each case the wing can support the machine, but the conditions are variable. Wind pressure, changes of speed, and other disturbances can move the machine away from the attitude and path that produce the desired result.",
      "Their main object is a mechanism that remedies those shifts. The following construction explains how the airframe and controls supply that correction.",
    ],
    11: [
      "The illustrated machine has two parallel aeroplanes, numbered 1 and 2, one above the other. The Wrights prefer that biplane arrangement, although they say the invention can also be used with one aeroplane. Each wing is much wider from side to side than from front to rear.",
      "Letters a, b, c, and d name the four corners of the upper wing; e, f, g, and h name the matching corners of the lower wing. The text then identifies the front, side, and rear edges by those letter pairs. Those names matter because the cable system moves particular corners and margins rather than moving a generic wing surface.",
    ],
    12: [
      "Before describing the control action, the Wrights describe how the two aeroplanes are made and how they are joined. The construction must permit controlled twisting while keeping the two wing surfaces connected.",
    ],
    13: [
      "Each aeroplane has two transverse spars, numbered 3, that run across the machine. Bows 4 connect their ends from front to rear. A series of parallel ribs 5 connects the front and rear spars and extends somewhat beyond the rear spar. The Wrights prefer wood because it combines strength, lightness, and flexibility.",
      "Fabric forms the supporting surface over that framework. Before attaching it, they cut the cloth on the bias and make it into one piece roughly the size and shape of the aeroplane. Its threads then run diagonally across the transverse spars and longitudinal ribs, as shown at 6 in Figure 2. The diagonal threads act as the diagonal members of a truss with the spars and ribs.",
      "A hem at the rear edge contains wire 7. The wire connects to the rear spar ends and to the rearward ends of the ribs, creating a rearward flexible flap. The resulting surface resists lateral and longitudinal loads yet can bend or twist as the control method requires.",
    ],
    14: [
      "With two aeroplanes, upright standards 8 connect their edges. The standards are substantially rigid wood members of equal length, equally spaced along the front and rear edges. Hinged or universal joints at their upper and lower ends connect them to the aeroplanes, so the wings can twist while the standards keep their separation.",
      "Figures 4 and 5 show one possible joint. Each end of a standard has an eye 9 that engages hook 10 on bracket-plate 11, which is fastened to spar 3. Diagonal stay-wires 12 run from each standard end to the opposite ends of neighboring standards. A second hook 13 receives one wire, while hook 10 carries the other; the bent hook and pin 14 retain the wires and eye in position.",
      "These crossed wires form a truss that gives the whole machine transverse stiffness and strength. The jointed connections still allow the aeroplanes to bend or twist in the next operation.",
    ],
    15: [
      "Rope 15 runs lengthwise near the front of the machine, above the lower aeroplane. It passes below pulleys or guides 16 at lower front corners e and f, then runs upward and rearward to upper rear corners c and d, where its ends attach at 17.",
      "A laterally movable cradle 18 attaches to the middle of that rope. The intended pilot lies face down on the lower aeroplane with the head forward, so body movement shifts the cradle toward either side and pulls the rope lengthwise in one direction or the other. The Wrights describe the cradle as a convenient operator, while allowing that rope 15 could be manipulated by another suitable means.",
    ],
    16: [
      "Rope 19 is the second flexible connection. It runs crosswise along the rear edge of the central part of the lower aeroplane, passes below guides 20 at lower rear corners g and h, and then goes diagonally upward to upper front corners a and b, where its ends attach at 21.",
      "The first rope therefore connects lower front corners to upper rear corners. The second connects lower rear corners to upper front corners. Together they transmit a sideways movement of the cradle through both wing surfaces.",
    ],
    17: [
      "Assume cradle 18 moves right in Figures 1 and 2. The rope-15 segment that passes under guide e and attaches at d becomes taut; the other half pays out slack. That tension pulls upper rear corner d downward and lower front corner e upward.",
      "Because standard 8 between e and a is rigid, e carries a upward. The standard between d and h carries h downward with d. Raising a pulls the attached end of rope 19 upward through guide h; that pull brings upper front corner b downward and, through its standard, brings lower rear corner g upward.",
      "The result is an opposite inclination at the two sides. Margins a-d and e-h rise at the front and fall at the rear, while b-c and f-g receive the reverse, downward-and-forward inclination. The dotted lines in Figure 1 show these positions. Moving the cradle in the other direction reverses every inclination.",
    ],
    18: [
      "The described cable geometry twists each aeroplane around a line that crosses the wing near the middle of its side margins. It gives the surface a helicoidal warp: its angle changes gradually from the central longitudinal line toward each side, rather than kinking at one point.",
      "The Wrights prefer that continuous surface because each side gains or loses incidence gradually from the center outward. They expressly say the invention is broader than this exact construction. Any arrangement that changes the angular relation of the two lateral margins in opposite directions can fall within the principle.",
      "They also distinguish angles relative to the wing's normal plane from heights relative to a horizontal plane. In flight the aeroplanes normally slope downward from front to rear, so a margin moved below its normal plane need not end below horizontal. Equal and opposite movement of both sides is preferred, but the invention also covers moving one side without an equal opposite movement on the other.",
    ],
    19: [
      "Wind pressure and other causes can make the machine roll, with one side sinking and the other rising about the longitudinal axis. The operator uses the cable arrangement to restore lateral balance.",
      "If the side left of an observer in Figures 1 and 2 begins to fall, moving cradle 18 right sets margins a-d and e-h at a larger angle of incidence than the opposite margins. The higher-incidence side meets the resisting air at a greater angle and tends to lift upward, restoring balance. Moving the cradle the other way corrects a fall on the other side.",
      "The same aerodynamic effect applies to a machine with one aeroplane. The paired biplane structure is an illustrated form, not a requirement for the balancing principle.",
    ],
    20: [
      "The rear vertical rudder, or tail 22, turns about a vertical axis. It sits at the rear of arms 23 whose forward ends pivot on the rear margins of the upper and lower aeroplanes. The arms are preferably V-shaped, with widely spaced front pivots 24, and can swing upward at their rear ends as Figure 3 shows. A stop limits their downward movement.",
      "Vertical pivots 25 support the rudder. One carries pulley 26, around which tiller-rope 27 passes. The rope ends attach to opposite sides of rope 19, so shifting cradle 18 also turns the rudder to one side of the line of flight.",
      "A warped side at greater incidence gains lift but also meets more forward resistance. It lags; the lower-resistance side advances, producing a yaw that can turn the craft about a vertical axis and eventually leave one wing below the other. The linked rudder faces the lower-resistance side and retards that faster side, keeping the nose aligned with the path and the body balanced. The upward-swinging arms let the rudder yield if it reaches the ground first, reducing breakage.",
    ],
    21: [
      "Struts 28 project forward horizontally from the lower aeroplane. Struts 29 project downward and forward from the upper aeroplane and join 28 at their front ends, which turn upward at 30. Together they form truss-skids ahead of the frame to prevent a forward rollover on landing.",
      "The upper part of the machine has inertia after the lower part stops against the ground. Struts 29 brace it against continuing forward motion, which otherwise would put a violent load on rope 19 because that rope connects upper and lower portions through its guides. The same struts carry the front horizontal rudder described next.",
    ],
    22: [
      "Front rudder 31 is a horizontal, flexible control surface. Three stiff crosspieces 32, 33, and 34, joined by flexible longitudinal ribs 35, make its frame; fabric covers it. Crosspiece 32 attaches to struts 29 near the center of pressure, slightly ahead of the midpoint between the front and rear edges, and forms the pivot axis of a balanced rudder.",
      "Springs 36 connect the front edge to upturned strut ends 30 and resist upward or downward movement at that edge. The pilot moves the rear edge through roller 37, bands 38, forward roller 39, arms 40, and links 41. In its neutral position the rudder is roughly parallel to aeroplanes 1 and 2.",
      "Raising or lowering the rear edge bends ribs 35 while the springs restrain the front. The surface becomes concave above or below its normal plane: incidence is small at the front and increases rapidly toward the rear. That curvature makes the surface more effective than a flat plane of equal area. Changing pressure on its upper and lower surfaces turns the main frame about its transverse axis, letting the pilot direct the craft upward or downward and maintain longitudinal balance.",
    ],
    23: [
      "The Wrights put the horizontal rudder in front of the aeroplanes at a negative angle and use no horizontal tail. In ordinary flight that front surface has little pressure on it. If speed falls far below normal, it becomes a useful lifting surface even without a control movement.",
      "They say this lift counteracts the rearward shift of the center of pressure on the main aeroplanes, a shift that could pitch a machine downward and forward into the ground. They acknowledge earlier forward horizontal rudders used with both a supporting surface and a rear horizontal rudder, but say those arrangements did not achieve this particular protective effect.",
    ],
    24: [
      "For this specification and its claims, “aeroplane” means the supporting surface or surfaces that sustain the machine in air. It can be any suitable normally flat supporting surface; the term does not require a complete powered aircraft.",
      "The preferred cloth-covered surfaces may curve somewhat under air resistance. That incidental curvature does not take them outside the definition.",
    ],
    25: [
      "The Wrights reserve the right to vary the construction details shown in the drawings. Their biplane may twist along its full length, but they say the principle needs only the movable lateral portions. If only those portions move, only the standards supporting those portions need flexible end connections.",
    ],
    26: [
      "The description is complete. What follows are the numbered claims, the part of the patent that states the combinations the Wrights ask the government to protect.",
    ],
    45: [
      "Orville Wright and Wilbur Wright sign the completed specification. Their signatures adopt the description and claims as the inventors' statement to the Patent Office.",
    ],
    46: [
      "Charles E. Taylor and E. Earle Forrer are listed as witnesses to the signing. Their names document execution of the instrument; they do not identify additional inventors or technical features.",
    ],
  },
};

export function archivalParallelReadingsFor(
  patentId: string,
): Readonly<Record<number, ArchivalParallelReading>> {
  const reading = ARCHIVAL_PARALLEL_READINGS[patentId];
  if (!reading) {
    throw new Error(`No hand-authored archival parallel reading is published for ${patentId}.`);
  }
  return reading;
}
