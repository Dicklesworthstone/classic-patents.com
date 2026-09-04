import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const text = (value: string) => ({ kind: "text" as const, text: value });
const p = (value: string | CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines: typeof value === "string" ? [text(value)] : value,
});
const mouseFigureAssets: Readonly<
  Record<number, { width: number; height: number; version: "v1" | "v2" | "v4" }>
> = {
  1: { width: 1550, height: 850, version: "v2" },
  2: { width: 1900, height: 640, version: "v4" },
  3: { width: 2000, height: 1050, version: "v2" },
  4: { width: 1550, height: 650, version: "v2" },
  5: { width: 1550, height: 700, version: "v2" },
  6: { width: 1550, height: 980, version: "v2" },
  7: { width: 1300, height: 1450, version: "v1" },
};

const figure = (
  value: string,
  figureNumber: number,
  options: {
    previewFigures?: readonly number[];
    label?: string;
  } = {},
) => {
  const previewFigures = options.previewFigures ?? [figureNumber];
  const previews = previewFigures.map((previewFigure) => {
    const asset = mouseFigureAssets[previewFigure];
    if (!asset) throw new Error(`US 3,541,541 is missing Figure ${previewFigure} crop metadata.`);

    const erratumContext =
      figureNumber === 5 && previewFigure === 6
        ? " (shown with FIG. 5 because the source sentence assigns disc 100 to FIG. 5 although disc 100 is drawn in FIG. 6)"
        : "";
    return {
      src: `/patents/figures/us-3541541-engelbart-mouse/fig-${previewFigure}-source-crop-${asset.version}.png`,
      alt: `US 3,541,541 source drawing FIG. ${previewFigure}${erratumContext}`,
      width: asset.width,
      height: asset.height,
    };
  });

  return {
    kind: "reference" as const,
    text: value,
    href: `#figure-${figureNumber}`,
    referenceType: "figure" as const,
    label: options.label ?? `Source drawing ${value}`,
    figurePreviews: previews,
  };
};
const term = (value: string, definition: string) => ({
  kind: "term" as const,
  text: value,
  definition,
  label: "Patent vocabulary",
});

/**
 * A hand-authored continuous edition, checked against every page of the
 * pinned grant. The helpers only make the explicitly supplied nodes concise;
 * they do not parse or infer source text, references, or annotations.
 */
export const engelbartMouseArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "2a01a32bc3d4c3eec1745dd77fcb92f1404e02844c640c9c10a451ed3b5791e0",
  preparedBy: "Classic Patents editorial agent (gpt-5.6)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE",
        "3,541,541",
        "X-Y POSITION INDICATOR FOR A DISPLAY SYSTEM",
        "Douglas C. Engelbart, Palo Alto, Calif., assignor to Stanford Research Institute, Menlo Park, Calif., a corporation of California",
        "Filed June 21, 1967, Ser. No. 647,872",
        "Int. Cl. H01j 29/70. U.S. Cl. 340-324. 8 Claims.",
        "Patented Nov. 17, 1970.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1 OF 3",
      title: "Display system and two-wheel control housing",
      description: [
        figure("FIG. 1", 1),
        text(", "),
        figure("FIG. 2", 2),
        text(", "),
        figure("FIG. 3", 3),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2 OF 3",
      title: "Analog and incremental encoder circuits",
      description: [
        figure("FIG. 4", 4),
        text(", "),
        figure("FIG. 5", 5),
        text(", "),
        figure("FIG. 6", 6),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 3 OF 3",
      title: "Second incremental encoder circuit",
      description: [figure("FIG. 7", 7)],
    },
    { kind: "heading", level: 2, text: "ABSTRACT OF THE DISCLOSURE" },
    p([
      text(
        "An X-Y position indicator control for movement by the hand over any surface to move a cursor over the display on a cathode ray tube, the indicator control generating signals indicating its position to cause a cursor to be displayed on the tube at the corresponding position. The indicator control mechanism contains X and Y position wheels mounted perpendicular to each other, which rotate according to the X and Y movements of the mechanism, and which operate ",
      ),
      term(
        "rheostats",
        "Variable resistive elements. In the source's analog embodiment, wheel motion changes their electrical state so the computer can infer an X or Y coordinate from the resulting signal.",
      ),
      text(" to send signals along a wire to a computer which controls the CRT display."),
    ]),
    { kind: "heading", level: 2, text: "BACKGROUND OF THE INVENTION" },
    p(
      "This invention relates to visual display systems and, more particularly, to devices for altering the display at selected locations.",
    ),
    p(
      "One of the potentially most promising means for delivering and receiving information to and from digital computers involves the display of computer outputs as visual representations on a cathode ray tube and the alteration of the display by a human operator in order to deliver instructions to the computer. In order for a human operator to readily change the displayed pattern, he must be provided with means for accurately indicating the exact position on the visual display at which he can make alterations. Devices are known which enable accurate position location on the tube display, such as a light pencil detector which is held against the tube while the entire tube is swept by the beam, the instant at which light is detected during the time required to sweep the entire face indicating the detector's position.",
    ),
    p(
      "A disadvantage of the light pencil and other similar devices is that they generally require the human operator to hold the pencil against the CRT with one hand while changes are made. Consequently, the operator does not have both hands free to enter changes, as by typing them in, and cannot move to equipment only a step away from the CRT. Furthermore, the light pencil often covers part of the area of the CRT display where changes are to be entered, which interferes with the process.",
    ),
    { kind: "heading", level: 2, text: "SUMMARY OF THE INVENTION" },
    p(
      "One subject of the invention is to provide an X-Y position indicating control mechanism for controlling indications of positions on a cathode ray tube (CRT) display, by movement along a surface which can be other than the face of the CRT.",
    ),
    p(
      "Another object of the invention is to provide a position indicator control which transmits signals defining its position on a surface, and which is connected by only a cable to the apparatus which acts upon such information.",
    ),
    p(
      "Still another object of the invention is to provide a simple and improved X-Y position locating device.",
    ),
    p(
      "The foregoing and other objects are realized by an X-Y position indicator control mechanism comprising a small housing adapted to be held in the hand and having two wheels and an idler ball bearing for contacting the surface on which it rests. The two wheels are mounted with their axes perpendicular to each other and each wheel is attached to a potentiometer or other means for indicating its rotation. The position indicator control is held by the hand and moved over any surface, such as a desktop (or even may be moved by the feet). As the indicator control is moved, the two wheels rotate and the resistance of the potentiometer changes. Electrical leads connected to the potentiometers trail behind the indicator control and connect to a computer which continuously monitors the indicator control's position. The computer causes the CRT to display a symbol, or cursor, such as a short line on the CRT screen to define a position on the screen about which changes or the like may be made, the cursor position changing in accordance with movement of the X-Y position indicator control. Buttons are provided on the indicator control housing for closing switches to send pulses through additional wires trailing behind the indicator control to signal for a change in the displayed information. For example, one button on the indicator control may be used to cause the erasure of a small area directly above or following the cursor. New material may then be inserted in place of the material erased in accordance with the programming of the computer, as by typing in letters.",
    ),
    p([
      text(
        "While a potentiometer may be connected to each of the two wheels on the indicator control, other devices can be used for generating signals indicating rotation of the wheels. One such device is a ",
      ),
      term(
        "shaft position encoder",
        "A rotary transducer that reports angular position as a set of digital output lines, rather than as the continuously variable resistance of the patent's potentiometer embodiment.",
      ),
      text(
        " which produces a digital output corresponding to the angular position of the wheel. While such an arrangement provides a direct digital output, instead of an analog output which must be digitally converted to be used by the computer control in the CRT display, the output from a shaft encoder necessitates a large cable. Still another means for indicating position of a wheel is an ",
      ),
      term(
        "incremental encoder",
        "A rotary transducer that reports each small angular step as a directional pulse instead of reporting an absolute angle. The companion counter retains the signed total of those steps.",
      ),
      text(" and counter. An "),
      term(
        "incremental encoder",
        "Here the source defines the device operationally: it emits an up pulse for a chosen angular increment in one direction and a down pulse for the corresponding reverse increment.",
      ),
      text(
        " generates an up indicating pulse each time the shaft moves by a certain increment of rotation in one direction and generates a down indicating pulse when the shaft moves in the other direction. These pulses are transmitted to an ",
      ),
      term(
        "up-down counter",
        "A digital counter with separate increment and decrement inputs. Its stored count is the algebraic total of forward and reverse encoder pulses, so it represents a signed position.",
      ),
      text(
        ", which provides a digital output equal to the sums of the up inputs minus the sum of the down inputs.",
      ),
    ]),
    { kind: "heading", level: 2, text: "BRIEF DESCRIPTION OF THE DRAWINGS" },
    p([
      figure("FIG. 1", 1),
      text(" is a pictorial illustration of a display system in accordance with the invention; "),
      figure("FIG. 2", 2),
      text(
        " is a sectional elevation view of the position indicating control mechanism of the invention; ",
      ),
      figure("FIG. 3", 3),
      text(" is a sectional plan view of the mechanism of "),
      figure("FIG. 2", 2),
      text("; "),
      figure("FIG. 4", 4),
      text(
        " is a simplified schematic diagram of an electrical circuit for connection to a position indicating control mechanism of the invention; ",
      ),
      figure("FIG. 5", 5),
      text(
        " is a schematic diagram of another embodiment of an electrical circuit for use in the invention, wherein a shaft encoder is used; ",
      ),
      figure("FIG. 6", 6),
      text(
        " is still another embodiment of an electrical circuit for use in the invention, utilizing an incremental encoder; and ",
      ),
      figure("FIG. 7", 7),
      text(
        " is a schematic diagram of another circuit for use in the invention, which also employs an incremental encoder.",
      ),
    ]),
    { kind: "heading", level: 2, text: "DESCRIPTION OF THE PREFERRED EMBODIMENTS" },
    p([
      figure("FIG. 1", 1),
      text(
        " shows a display system constructed in accordance with the invention, comprising a cathode ray tube display 10 for creating visual patterns on the face 12 of a cathode ray tube, a computer system 14 including a typewriter input apparatus 15 which generates signals that define the patterns displayed by the CRT display system, and an X-Y position indicator control 16. The position indicator control 16 is positioned on the top of the cabinet 17 of the computer, although it can be positioned on any other surface. The indicator control 16 has wheels which support it on the cabinet and which register changes in the position thereon. A wire 18 connects the position indicator control to the computer 14 for transmitting signals indicating the position of the indicator control. The computer 14, which controls the pattern on the CRT face 12, generates signals causing the display of a line or other cursor 20 on the CRT. The position of the cursor 20 is governed by the position of the indicator control 16 determined by the computer 14 in accordance with the signals it receives from the indicator control over the wire 18.",
      ),
    ]),
    p(
      "Three buttons 22 are located on the indicator control 16 for operating switches within the indicator control to allow currents to flow through conductors of the wire 18. The switches may be used to cause changes in particular areas of the display, or for other purposes. For example, one of the buttons may be used to control the delivery of signals which command the computer 14 to operate on the portion of the pattern displayed immediately above the cursor 20, such as a single character, the particular operation being designated by inputs to the typewriter apparatus 15. Another button may be used to command the operations to be performed on the entire line of characters immediately above and to the right of the cursor 20. An operation such as “erase” may be designated by pressing a particular key on the typewriter, to cause the computer to stop the display of characters at those areas. New characters can be inserted into the display by leaving the position indicator control 16 stationary so the cursor does not move and then typing in the new characters on the typewriter 15.",
    ),
    p([
      text(
        "The position indicator control 16 is shown more clearly in the sectional side view of ",
      ),
      figure("FIG. 2", 2),
      text(" and the sectional plan view of "),
      figure("FIG. 3", 3),
      text(
        ". A housing 26 has a bottom wall 28 on which is attached a right angle bracket 30. One arm 32 of the bracket holds three pushbutton switches 34 which close circuits that cause changes in the cathode ray tube display. The pushbuttons 22 are slideably mounted in the housing 26, for movement against the switches 34 to close them.",
      ),
    ]),
    p(
      "Each arm 32 and 36 of the bracket 30 holds a potentiometer, the arm 32 holding an X position potentiometer 38 and the arm 36 holding a Y position potentiometer 40. An X position wheel 42 is fixed to a shaft 44 of the potentiometer 38, while a Y position wheel 46 is fixed to a shaft 48 of the Y position potentiometer 40. Each of the position wheels 42 and 46 project through slots 50 and 52, respectively, formed in the bottom wall 28. A ball bearing support 54 fixed to the underside of the bottom wall 28 serves as a third point of support, in addition to the two wheels 42 and 46, to stably support the indicator control on the cabinet 17 or other surface.",
    ),
    p([
      text(
        "When the position indicator control is moved over the cabinet 17, or any other surface, the X and Y position wheels rotate. Inasmuch as the X and Y position wheels 42 and 46 are mounted on axes that are perpendicular to each other, the X position wheel 42 rotates by an amount equal to the movement in one direction which may be defined as the X direction, while the Y position wheel 46 rotates an amount equal to the movement in a perpendicular or Y direction. As the wheels move, the shafts of their respective potentiometers rotate, and the resistance of the potentiometers enable continuous measurement of the resistance, and therefore of the X and Y positions of the indicator control 16. It may be noted that in most cases ",
      ),
      term(
        "multiturn potentiometers",
        "Potentiometers designed for several shaft revolutions across their full resistance range. That lets a wheel traverse more distance before the signal repeats, while still allowing fine coordinate control.",
      ),
      text(
        " are used to enable monitoring of large movements of the indicator control, or conversely, to enable fine control.",
      ),
    ]),
    p(
      "The position indicator control may be utilized by first placing it on the cabinet 17 and moving it up or down and back or forth to cause corresponding movements in the apparent position of the cursor 20, until the cursor lies in a desired position. The indicator control remains stationary so long as it is left in place; therefore the cursor 20 remains fixed without any effort of the human operator. If it is desired to move the cursor 20, the position indicator control 16 is moved in directions corresponding to the desired movements of the cursor. The resistances of the rheostats, sensed through the conductors contained in the wire 18, continually monitor the position of the indicator control and cause movement of the line cursor 20 accordingly.",
    ),
    p([
      figure("FIG. 4", 4),
      text(
        " is a simplified schematic diagram of the electrical circuit by which the position of the indicator control 16 is monitored. Electrical conductors 62, 64, 66 and 68 represent separate leads contained in the wire 18 connecting the indicator control to the computer. A voltage +V is connected at terminal 70 for sending currents through the two rheostats or potentiometers whose resistances are indicated at 38A and 40A. One side of each potentiometer is connected to lead 64, which is grounded. The wipers 72 and 74 of the potentiometers are connected to leads 68 and 66, respectively, which in turn are connected to terminals Y and X. By noting the voltage at X and Y, relative to ground potential, the resistances of the two potentiometers and therefore the X and Y positions of the indicator control are known.",
      ),
    ]),
    p([
      text(
        "The indications of X and Y position given by the voltages at terminals X and Y are presented in analog form. A digital computer requires digital inputs and therefore, an analog-to-digital converter must be used between the X and Y terminals and the computer inputs. Two types of digital output devices for use with the indicator control are shown in ",
      ),
      figure("FIGS. 5, 6 and 7", 5, { previewFigures: [5, 6, 7] }),
      text("."),
    ]),
    p([
      figure("FIG. 5", 5),
      text(
        " shows a position indication control circuit which provides a digital output. An encoding disc 80 is shown which is used to indicate the X position. The disc 80, which is a simplified illustration of the type of disc which is used in practice, is divided into four rings 82, 84, 86 and 88. The disc 80 is also divided into sixteen sectors, each indicated by a number 0 through 15. Four electrical contacts connected to wires 92, 94, 96 and 98, provide readouts. Each of the sixteen sectors of each of the four rings of the disc 80, can be coated with either conductive material or insulative material. The contacts connected to the four output wires 92 through 98 remain stationary while the disc 80, attached to the X position wheel shaft 99, rotates. Currents flow through the disc and through those wires 92 through 98 which are over a conductive portion of the disc, to indicate position.",
      ),
    ]),
    p([
      text(
        "In order to indicate many positions, the disc 80 is, in practice divided into a large number of rings and sectors, so that a large number of positions can be indicated and small changes of position are registered. A similar scheme is used for the Y position. The advantage of the readout scheme of ",
      ),
      figure("FIG. 6", 6),
      text(
        " is that a digital output is provided which completely defines the position of the indicator at every instant. A major disadvantage is that a large number of wires must be connected to the position indicator control so that a relatively thick cable trails behind it and limits the ease with which it can be moved.",
      ),
    ]),
    p([
      figure("FIG. 6", 6),
      text(
        " illustrates still another position readout means, which possesses the advantage of digital output while requiring a minimum number of leads connecting the position indicator control to the computer. In the readout circuit of ",
      ),
      figure("FIG. 5", 5, {
        previewFigures: [5, 6],
        label:
          "Source wording reads FIG. 5 here; editorial source note: disc 100 belongs to the FIG. 6 incremental-encoder drawing, so both source previews are shown.",
      }),
      text(
        ", a disc 100 is provided which has three rows of electrical contacts, designated 102, 104 and 106. The disc 100 has its axes fixed to the X wheel of the device shown in ",
      ),
      figure("FIGS. 1, 2 and 3", 1, { previewFigures: [1, 2, 3] }),
      text(" in place of the potentiometer. The device of "),
      figure("FIG. 6", 6),
      text(
        " operates by transmitting “up” pulses when the position indicator control moves to the right and “down” pulses when the position indicator control moves to the left. A counter circuit, which is fixed to the computer adds the up pulses and subtracts the down pulses to provide a continuous digital indication of the position of the position indicator control. A similar arrangement is used for the Y position.",
      ),
    ]),
    p([
      text("In the circuit of "),
      figure("FIG. 6", 6),
      text(
        " three sensors 108, 110 and 112 are located adjacent to the rows of contacts 102, 104 and 106, respectively. Whenever the disc 100 rotates and one of the contacts of one of the three rows comes under a sensor, a voltage is delivered over one of the lines 114, 116 or 118, leading to circuitry located at the computer. The contacts on the three rows 102, 104 and 106 are located so that only one contact is under a sensor at any given time.",
      ),
    ]),
    p(
      "The lines 114, 116, and 118 trail behind the position indicator control and lead to flip-flop 120, OR gate 122 and AND gates 124 and 126, as shown. The outputs of the two AND gates 124 and 126 lead to counter 128 to cause it to count up or down. The counter 128 has numerous output lines over which it continuously transmits signals indicating in a digital manner, the position of the position indicator control.",
    ),
    p([
      text("When the disc 100 of "),
      figure("FIG. 6", 6),
      text(
        " rotates and a contact of row 104 comes under readying sensor 110, a signal is transmitted over line 116 to set the RS flip-flop 120. If the disc is rotating in a forward or clockwise direction the next contact of the three rows to come under a sensor is a contact of up row 102. When a contact 102 touches sensor 108, a signal is transmitted over up line 114 to AND gate 124. Inasmuch as the flip-flop 120 has been set, a voltage is being received at input 130 of gate 124, and the additional signal at input 132 of gate 124 causes it to generate a pulse. The pulse from gate 124 enters counter 128 at its up input, causing the counter to count up by one digit. The signal over up line 114 also enters OR gate 122 which leads to delay line 124 which, in turn, leads to the reset input of flip-flop 120. A delay of delay line 124 is very short so that flip-flop 120 is reset an instant after an up pulse is registered by the counter.",
      ),
    ]),
    p(
      "If the disc 100 continues to turn clockwise after an up pulse is registered, then a contact of row 106 comes under down sensor 112 and causes it to deliver a signal over down line 118 to the AND gate 126. The AND gate 126 will not deliver a pulse because its input 134 from the flip-flop 120 has no voltage on it, due to the fact that the flip-flop 120 has been reset. Only after another signal is transmitted over line 116 to again set the flip-flop 120, will a pulse from up line 114 cause the registration of another up count. Down counting occurs in a similar manner when the disc 100 turns in a counter clockwise direction.",
    ),
    p([
      text("The circuit of "),
      figure("FIG. 6", 6),
      text(
        " requires only four leads between the computer and the position indicator control. The four leads are the lines 114, 116, 118, and an additional line (not shown) for connection to a voltage source to provide pulses that flow through the sensors to the other three lines.",
      ),
    ]),
    p([
      figure("FIG. 7", 7),
      text(
        " illustrates another position readout means of the incremental encoder type, similar to that of ",
      ),
      figure("FIG. 6", 6),
      text(". The circuit of "),
      figure("FIG. 7", 7),
      text(
        " utilizes a simpler encoding disc and one fewer lead, although it involves more complex electronics. In the circuit of ",
      ),
      figure("FIG. 7", 7),
      text(
        ", a disc 140 whose axis is connected to a position wheel such as the X position wheel is provided which has a track 142 having spaced conductive segments. A control contact 146 and stepping contact 148 are disposed over the track to make contact with the conductive segments thereof. The contacts are arranged for contacting the segments at angular positions of the disc which overlap. A lead (not shown) connected to the disc 140 conducts currents to the segments of the two tracks.",
      ),
    ]),
    p([
      text("The contact 146 is connected to a "),
      term(
        "Schmidt trigger",
        "The patent's spelling for a Schmitt-trigger-like switching circuit: a regenerative threshold stage that turns an uncertain changing contact signal into a clean on or off logic level.",
      ),
      text(
        " circuit 150 which provides currents to two of four AND gates 152, 154, 156 and 158, at a time. The other contact 148 carries current to a ",
      ),
      term(
        "resolver",
        "In this circuit, the resolver processes the Schmitt trigger's on-off output into a sharp standardized transition before it is differentiated and sent to the two chopper paths.",
      ),
      text(
        " 160 of the Schmidt trigger, on-off type, which provides signals with sharp, standard on-off wavefronts. The output of the resolver is delivered to a differentiator 162 which delivers sharp pulses to an inverter chopper 164 and a normal chopper 166. The outputs of each chopper are delivered to two of the AND gates. The outputs of two of the AND gates deliver pulses to the up input port 168 of an up/down counter 170 while the outputs of two other AND gates are delivered to the down input port 172 of the counter. The counter 170 continuously delivers digital output signals defining the position of disc 140.",
      ),
    ]),
    p(
      "While the position indicator control can be used merely to cause a change in cursor position, and other means such as a typewriter can be used for adding to the pattern, the indicator control can be used in other ways. For example, the position indicator control can be placed on a drawing to be displayed on the CRT, and then the indicator control can be moved to trace the lines of the drawing with the computer causing corresponding lines to be displayed on the CRT. For such uses, the wheels and electrical signal generators of the indicator control should cause cursor movements which very closely correspond to indicator control housing movements.",
    ),
    p([
      text("The particular mechanical construction shown in "),
      figure("FIGS. 2 and 3", 2, { previewFigures: [2, 3] }),
      text(
        " are especially well adapted for maintaining accuracy of output and ease of use. The use of only three points of contact, comprising the two wheels and the ball bearing support, help to assure that both wheels will constantly remain in firm contact with the surface on which the position indicator control rests. The location of the various buttons for indicating areas of the display to be operated on, or for other purposes, on the indicator which is moved by the hand allows a human operator to maintain control over both position of changes and the type of changes on the display with only one hand. The use of an indicator control which rests firmly on a surface enables the operator to accurately maintain position with a minimum of muscle effort, since the indicator control remains stationary unless some force is applied to it. The use of relatively large position wheels having appreciable, even if small, moments of inertia, reduces jittering of the indicator control and promotes smooth movement which is helpful in accurate positioning where the displayed characters are small or where accurate tracing of a pattern is required.",
      ),
    ]),
    p(
      "While particular embodiments of the invention have been illustrated and described, it should be understood that many modifications and variations may be resorted to by those skilled in the art, and the scope of the invention is limited only by a just interpretation of the following claims.",
    ),
    { kind: "heading", level: 2, text: "I claim:" },
    {
      kind: "claim",
      number: 1,
      inlines: [
        text(
          "1. In a display system controlled by a computer whereby the display is alterable in accordance with signals delivered to said computer which indicate positions on said display and changes desired to be made therein, the improvement in a position indicating control apparatus which is movable over a surface to provide position indications corresponding to positions on said display comprising: a housing; a first position wheel rotatably mounted on said housing and having a rim portion extending past the boundaries defined by said housing for supporting said housing on said surface; a second position wheel rotatably mounted on said housing with its axis of rotation oriented perpendicular to the axis of said first wheel, said second position wheel having a rim portion extending past said housing for supporting said housing on said surface; transducer means connected to each of said first and second wheels, for generating digital position indicating signals indicating the degree of rotation of said wheels; and flexible conductor means for connecting said transducer means to said computer, for conducting said position indicating signals to said computer while enabling unrestrained movement of said housing relative to said computer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "2. The improvement in a position indicating control apparatus as defined in claim 1 wherein: said transducer means comprises an incremental encoder connected to said first position wheel and said flexible conductor means for generating first pulses at each predetermined increment of rotation of said first position wheel in a first direction and for generating second pulses at each increment of rotation of said first position wheel in the opposite direction; and including: counter means connected to said flexible conductor means, for generating a digital count indicating the net rotation of said first position wheel.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. The improvement in a position indicating control apparatus as defined in claim 2 wherein said incremental encoder comprises: a disc connected to said first position wheel having track means, said track means having a plurality of spaced conductor segments; a control contact and a stepping contact disposed along said track means, said control and stepping contacts positioned for the electrical connection of only one of said contacts with said segments at first predetermined angular positions of said disc and for the simultaneous electrical connection of both of said contacts with said segments at second predetermined angular positions of said disc; and logic means connected to said control and stepping contacts for generating said first pulses when said stepping contact makes a first direction of transition between electrical connection with one of said segments and lack of electrical connection with one of said segments at the same time that said control contact is in a first predetermined state of electrical connection with one of said segments and for generating said second pulses.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. The improvement of a position indicating control apparatus as defined in claim 1 wherein: said transducer means comprises a shaft position encoder having a plurality of outputs and said conductor means comprises a plurality of conductors connected to said outputs of said encoder, whereby to constantly indicate the position of said position indicating apparatus.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "5. In a display system controlled by a computer whereby the display is alterable in accordance with signals delivered to said computer which indicate positions on said display and changes desired to be made therein, the improvement in a position indicating control apparatus which is movable over a surface to provide position indications corresponding to positions on said display comprising: a housing; a first position wheel rotatably mounted on said housing and having a rim portion extending past the boundaries defined by said housing for supporting said housing on said surface; a second position wheel rotatably mounted on said housing with its axis of rotation oriented perpendicular to the axis of said first wheel, said second position wheel having a rim portion extending past said housing for supporting said housing on said surface; and transducer means connected to each of said first and second wheels, for generating digital position indicating signals indicating the degree of rotation of said wheels.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        text(
          "6. The improvement described in claim 5 including: coupling means for substantially unrestrained coupling of said transducer means to said computer, to couple said position indicating signals to said computer while enabling substantially unrestrained movement of said housing relative to said computer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        text(
          "7. The improvement described in claim 5 including: a flexible conductor for connecting said transducer means to said computer, to carry position indicating signals to said computer while enabling substantially unrestrained movement of said housing relative to said computer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        text(
          "8. A display system for presenting an alterable visual display comprising: cathode ray tube means for providing a visual display; computer means connected to said cathode ray tube means for controlling inputs to said cathode ray tube means to define the visual display thereof, said computer means including means for generating signals defining a cursor for display at variable positions on said cathode ray tube means and means for altering inputs to said tube means to cause a change in the display about the position of said cursor; a position indicator control connected to said computer means, said position indicator control having a housing which contains transducer means for delivering signals for causing movement of said cursor on said cathode ray tube means in response to movement of said housing over a surface; and at least one cathode ray tube display control switch disposed on said position indicator control.",
        ),
      ],
    },
    { kind: "heading", level: 3, text: "References Cited" },
    {
      kind: "table",
      caption: "UNITED STATES PATENTS",
      headers: [[text("Patent")], [text("Date")], [text("Name and classification")]],
      rows: [
        [[text("3,304,434")], [text("2/1967")], [text("Koster — 33-141.5 X")]],
        [[text("3,346,853")], [text("10/1967")], [text("Koster et al. — 340-324 X")]],
        [[text("3,355,730")], [text("11/1967")], [text("Neasham — 178-18 X")]],
      ],
    },
    {
      kind: "table",
      caption: "Examination and cross-reference classification",
      headers: [[text("Role")], [text("Printed entry")]],
      rows: [
        [[text("Primary Examiner")], [text("THOMAS B. HABECKER")]],
        [[text("Assistant Examiner")], [text("D. L. TRAFTON")]],
        [[text("U.S. Cl. X.R.")], [text("33-141.5; 178-18; 345-177, 204, 212, 354")]],
      ],
    },
  ],
};

/** Explicit paragraph-index companions. Indexes are authored against the block list above. */
export const engelbartMouseParallelReadings: Readonly<Record<number, readonly string[]>> = {
  5: [
    "The abstract states the whole arrangement: hand motion over a surface drives perpendicular X and Y wheels; rheostats report those coordinates through a wire so a computer can put a cursor at the corresponding CRT location.",
  ],
  7: [
    "This sets the subject narrowly: visual-display systems and equipment for altering a selected location of their display.",
  ],
  8: [
    "The problem is interactive selection. A CRT presents the computer's output, but an operator needs a way to mark the exact screen location where a change is to be made; a light pencil uses beam-sweep timing to do that.",
  ],
  9: [
    "The cited weakness of the light pencil is operational rather than optical: one hand remains against the screen, leaving neither two hands for typing nor freedom to reach nearby equipment, and the pencil blocks the very area being edited.",
  ],
  11: [
    "The first object relocates pointing from the CRT face to another surface while still controlling a CRT position indication.",
  ],
  12: [
    "The second object limits the physical connection to a cable carrying the position information to the equipment that uses it.",
  ],
  13: [
    "The third object is simply an improved X-Y locator, a stated goal that the following mechanical and electrical alternatives implement.",
  ],
  14: [
    "The summary gives the core mechanism and its claimed use: a hand-held housing rests on two orthogonal wheels and a third ball-bearing support; wheel rotation changes transducer output, which the computer maps to a movable cursor, while buttons carry separate display-change commands.",
  ],
  15: [
    "This paragraph distinguishes the analog potentiometer embodiment from two digital alternatives. A full shaft-position encoder reports absolute angle but needs many conductors; an incremental encoder instead emits directional pulses and a counter accumulates their signed total.",
  ],
  17: [
    "The figure list identifies the scope of the drawings: the system and housing in Figures 1-3, then one analog and three digital readout circuits in Figures 4-7.",
  ],
  19: [
    "Figure 1 places the pointer in a complete working system. The computer receives position signals over wire 18, and uses them to place cursor 20 on the CRT face; this is not merely a standalone two-wheel mechanism.",
  ],
  20: [
    "The three buttons are not described as modern mouse clicks. They close circuits for operations on a character or a line relative to the cursor, while the typewriter supplies the particular command and new text.",
  ],
  21: [
    "Figures 2 and 3 locate the physical parts: housing 26 and bottom wall 28 carry bracket 30, whose arm holds three switches 34. The button caps slide in the housing to actuate those switches.",
  ],
  22: [
    "The two bracket arms hold separate X and Y potentiometers. Their wheel shafts project through distinct bottom slots, and ball support 54 completes a stable three-contact support with wheels 42 and 46.",
  ],
  23: [
    "Perpendicular wheel axes mechanically resolve motion into named X and Y components. Wheel-shaft rotation changes the respective potentiometer resistance, and multiturn potentiometers trade range against fine control.",
  ],
  24: [
    "The intended operation is absolute placement: move the housing until cursor 20 reaches the desired place, then leave the control at rest. The cursor remains fixed because the rheostat readings continue to report the stationary position.",
  ],
  25: [
    "Figure 4 is the analog electrical implementation. +V and ground span both potentiometers; wipers 72 and 74 feed Y and X leads, so voltages measured at the terminals identify the two potentiometer settings.",
  ],
  26: [
    "Because the Figure 4 voltages are analog but the stated computer needs digital inputs, the patent says an analog-to-digital converter is required and then introduces Figures 5-7 as digital alternatives.",
  ],
  27: [
    "Figure 5 encodes absolute X position with conductive or insulating sectors in four concentric rings. Four fixed contacts read the rotating disk's binary-like pattern, but the number of output wires makes the trailing cable thicker.",
  ],
  28: [
    "More rings and sectors increase position resolution, and the same idea can serve Y. The patent calls the complete instantaneous digital position its benefit and the bulky multiwire cable its cost.",
  ],
  29: [
    "Figure 6 reduces the cable count by reporting directional increments. Three sensor rows identify a state, and rightward or leftward movement produces up or down pulses which a computer-side counter adds or subtracts.",
  ],
  30: [
    "Each of the three Figure 6 sensor rows has one active contact at a time. The resulting voltage appears on one of lines 114, 116, or 118 and travels to computer-side logic.",
  ],
  31: [
    "Those three lines feed a flip-flop, OR gate, AND gates, and counter. The gates decide whether a transition is an up or down event; the counter's many outputs continuously give digital position.",
  ],
  32: [
    "The clockwise example first arms the RS flip-flop from middle-row contact 104, then accepts the next upper-row contact 102 as one up count. The delayed reset prevents the following contact from creating an extra count.",
  ],
  33: [
    "After an accepted up pulse, a lower-row contact cannot count because the flip-flop has been reset. Another middle-row signal must re-arm it; reverse rotation applies the corresponding logic for down counts.",
  ],
  34: [
    "The Figure 6 circuit's wire economy is explicit: three sensing lines plus one supply line between the computer and control.",
  ],
  35: [
    "Figure 7 uses another incremental disk. Overlapping control and stepping contacts read conductive segments; it uses one fewer lead than Figure 6 at the price of more electronic processing.",
  ],
  36: [
    "The Figure 7 logic turns contact state and transitions into clean pulses. A Schmitt trigger and resolver establish states, differentiator and paired choppers shape transitions, AND gates route them to the up or down port of counter 170.",
  ],
  37: [
    "The pointer can also trace a physical drawing for CRT reproduction. For that application the wheel and signal relationship must make cursor movement closely follow movement of the housing itself.",
  ],
  38: [
    "The patent credits the three-point support, button placement, stationary resting behavior, and wheel inertia with firm contact, one-hand control, low holding effort, reduced jitter, and smoother fine positioning.",
  ],
  39: [
    "This conventional closing clause says the illustrated embodiments are examples and that claim interpretation, not these exact diagrams, limits scope.",
  ],
};
