import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const PATENT_ID = "us-2988237-devol-programmed-transfer";

const sourcePdfPageForFigure = (number: number): 1 | 2 | 3 =>
  number <= 3 ? 1 : number <= 8 ? 2 : 3;

const sourceSheet = (number: number) => {
  const sourcePdfPage = sourcePdfPageForFigure(number);
  const figureRange =
    sourcePdfPage === 1
      ? "Figs. 1 through 3"
      : sourcePdfPage === 2
        ? "Figs. 4 through 8"
        : "Figs. 9 through 11";
  return {
    src: `/patents/figures/${PATENT_ID}/source-sheet-${sourcePdfPage}-v1.png`,
    alt: `Complete source drawing sheet containing ${figureRange}, highlighting Fig. ${number}, from US 2,988,237.`,
    width: 2320,
    height: 3408,
  };
};

const p = (
  ...inlines: readonly (string | CuratedSpecificationInline)[]
): { kind: "paragraph"; inlines: CuratedSpecificationInlines } => ({
  kind: "paragraph",
  inlines: inlines.map((inline) =>
    typeof inline === "string" ? { kind: "text", text: inline } : inline,
  ),
});

const figure = (number: number, text = `FIG. ${number}`): CuratedSpecificationInline => {
  return {
    kind: "reference",
    text,
    href: `#figure-${number}`,
    referenceType: "figure",
    label: `Complete source drawing sheet for ${text} from US 2,988,237`,
    figurePreviews: [sourceSheet(number)],
  };
};

const figures = (numbers: readonly number[], text: string): CuratedSpecificationInline => ({
  kind: "reference",
  text,
  href: `#figure-${numbers[0]}`,
  referenceType: "figure",
  label: `Complete source drawing sheets for ${text} from US 2,988,237`,
  figurePreviews: numbers.map(sourceSheet),
});

const figureRange = (first: number, last: number, text: string): CuratedSpecificationInline =>
  figures(
    Array.from({ length: last - first + 1 }, (_, index) => first + index),
    text,
  );

const term = (text: string, label: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  label,
  definition,
});

const claim = (number: number, text: string) => ({
  kind: "claim" as const,
  number,
  inlines: [{ kind: "text" as const, text }],
});

const claimTexts: Readonly<Record<number, string>> = {
  1: "Apparatus having automatic control means, including a mechanical output device and power operating means therefor, position representing means coupled to said mechanical output device for conjoint operation therewith, said position representing means including an assembly of separate sensing units each having its own individual output and combinational code means sensed by and relatively movable with respect to said sensing units through a series of positions corresponding to positions of said device, said combinational code means including a uniquely identifying combination of control portions of different kinds opposite the respective sensing units in each said position such that the combination of control portions at each said position is different from the combinations of control portions in all the others of said series of positions, a program-controller having a series of recorded combinational code position symbols duplicating selected combinations in said series of positions, said program-controller having as many positional code position elements for sensing said combinational code position symbols as there are sensing units in said position representing means, a series of individual coincidence detectors each having a respective direct signal coupling to a corresponding one of said sensing units and a corresponding one of said sensing elements, said power operating means having control means responsive to said coincidence detectors jointly.",
  2: "Apparatus in accordance with claim 1 wherein said last-mentioned control means includes portions providing different control at different positions of said mechanical output device in its approach toward any particular selected position, and wherein said control means for said power operating means includes rate control means controlled by progressive approach of said individual coincidence detectors toward complete coincidence.",
  3: "Apparatus in accordance with claim 1 including adjustable mechanical coupling means between said mechanical output device and said position representing means and a control connection from said series of coincidence detectors arranged to change the adjustment of said coupling means from an advance-sensing adjustment to a true-position sensing adjustment in response to detected coincidence.",
  4: "Apparatus in accordance with claim 1 wherein said power operating means for said output device has rate control adjustment means, and wherein said series of coincidence detectors has plural control connections to said rate-control adjustment means to effect progressive rate reduction as the number of such detectors that sense coincidence increases.",
  5: "Apparatus in accordance with claim 1 wherein said program-controller is provided with a number of recording elements equal to said sensing elements, and including switching means for selectively coupling said sensing units to said recording elements, respectively, when operating said mechanical output device through a series of positions to be repeated later automatically, for recording a sequence of corresponding position symbols in said program controller, said switching means also being selectively operable for rendering said coincidence detectors effective for comparing signals of said sensing units with those of said sensing elements.",
  6: "An article handling machine, including a transfer head, a program controller having storage means for position symbols, position-representing means coupled to said transfer head for conjoint operation therewith, said position-representing means including an assembly of separate sensing elements and a combinational code member opposite said sensing elements, said code member and said sensing elements being relatively movable so as to expose a series of positions along said code member to said sensing elements, said code member at each position including a combination of control portions of different kinds opposite different ones of said sensing elements, and the combination of control portions at each position being uniquely different from the combination of control portions at all other positions along said control member, and recording devices coupled to said sensing elements and operable to record a sequence of combinational responses of said sensing elements, respectively, in said program controller sequentially, corresponding to a sequence of selective positions of said transfer head, said transfer head additionally having an article gripper, control means for said article gripper, and means to record in said program controller control-representing symbols for said gripper control means.",
  7: "Automatically programmed apparatus including a movable mechanical output device and power actuating means therefor, position representing means including a pattern portion and a sensing portion, one of said portions being coordinately coupled to said output device for corresponding movements therewith and the other of said portions being relatively fixed, said sensing portion having a series of sensing units, said pattern portion having a series of control pattern elements of two different kinds opposite said sensing units respectively in each represented position of said mechanical output device, and the combination of different kinds of control elements in each position being unique, combinational code control means producing a distinctive code output for each of a sequence of positions to be assumed by said mechanical output device including a series of control code elements having respective output means corresponding to said sensing units, and a series of coincidence detectors each having input coupling from a related one of said sensing units and from a related one of said control code elements, each said coincidence detector being of a form that is either balanced or unbalanced and responds in one way to matching control from its said sensing unit and its said control code element both when said sensing unit responds to one kind of control pattern element and when said sensing element responds to the other kind of said control pattern element, each said coincidence detector being unbalanced and responding to its said sensing unit and its said control code element differently than aforesaid in instances of mismatched input, said coincidence detectors having output control coupling means to said power actuating means.",
  8: "An article handling machine, including an article transfer head, a program controller, power means for moving the article transfer head, position representing means operable coordinately with said transfer head, said position representing means including sensing means and control means having different identifying portions corresponding to the different positions that may be assumed by said transfer head, said sensing means and said control means being relatively movable for successive sensing of said control portions, drive means for operating said position representing means with said sensing means and said control means in an anticipation-sensing relationship, and means controlled by the response of the sensing means during anticipation-sensing for changing the relationship between said sensing means and said control means to true-position sensing relationship.",
  9: "Automatic programmed apparatus, including a program-controller having a sequence of control slots sequentially in effect and having a series of parallel-output sensing elements in sensing relation to one slot at a time, each sensing element having either of two output conditions in dependence on the sensed control slot and said sensing elements collectively producing combinational output uniquely representing a destination instruction in each slot of the program-controller, a mechanical output device and power actuating means therefor, position representing means coupled to said mechanical output device to effect coordinate motions therewith, said position representing means including parallel-output sensing units each having either of two output conditions, a series of coincidence detectors individually having respective parallel-input coupling to one of said sensing elements and to one of said sensing units and each being of a form having one response to like input of either of two kinds both from the coupled sensing element and the coupled sensing unit and having a different response to unlike input from the coupled sensing element and the coupled sensing unit, and said coincidence detectors having output coupling means in control relation to said actuating means.",
  10: "Automatic programmed apparatus in accordance with claim 9, wherein said program-controller includes a series of recording elements in recording relationship to one control slot at a time, and switching means selectively operable to couple said sensing units to said recording elements or to said coincidence detectors.",
  11: "Automatic programmed apparatus in accordance with claim 9 including additionally a series of recording elements for a slot of said program-controller and a series of recording elements for said position representing means, a source of combinational codes, and switching means rendering one of said series of recording elements operative to record a sequence of codes from said source of codes in different positions of said position representing means to identify positions to which said mechanical output device is caused to move, and rendering the other of said series of recording elements operative to record the same sequence of codes in respective slots of said program-controller.",
  12: "An article handling machine, including an article transfer head, a program-controller including means for storing a sequence of position representing symbols each including a series of bits of two types and read-out means for selecting one of said symbols including a number of sensing elements equal to the number of bits in a position representing symbol, power means for moving the transfer head, position representing means including a series of position-representing symbols each having a series of bits equal in number to the number of bits of said position representing symbols and including an equal number of sensing units, a mechanical connection between the transfer head and said sensing units, causing conjoint operation thereof, and means including a series of coincidence detectors each coupled to a respective one of said sensing units and each coupled to a respective one of said sensing elements and responsive thereto in one manner in case of match and in a different manner in case of mismatch, said last-named means being in control relation to said power means.",
  13: "Article transfer apparatus including a selectively positionable article seizing device, combinational control means producing a distinctive code output for various positions to be assumed by said device, said control means comprising a magnetic program controller having storage means for a sequence of combinational codes and read-out means for selecting one of said codes, feed-back means for indicating correspondence between a selected code produced by said control means and the position of said selectively positionable device, said feed-back means including means operated by said device for producing a combinational code representing its position, code comparison means producing a distinctive response upon coincidence of the control code and the feed-back code, said program-controller including control means for operating said article seizing device in timed relation to the selective positioning thereof.",
  14: "The method of transporting articles between a first place and a second place, one of said places having a predetermined article arrangement, including the steps of operating an article-transfer head between each different position of said arrangement of articles at said one place and the other place in sequence, recording control combinational codes representing each distinctive position of the transfer head in said sequence of operations, recording coordinated control indicia corresponding to the seizing and release operations of said article holder, and thereafter utilizing the control codes in controlling the operations of said transfer head and of the article holder thereon.",
  15: "Apparatus for evidencing the position of a movable member both when at rest and when in motion, including a series of magnetically biased and alternating-current excited magnetic detectors, and a combinational code member having magnetically different portions opposite the detectors so as to present unique code patterns varying from point to point along the member in a direction across the series of detectors, means moving the detecting means concurrently and coordinately with the movable member, and means indicating arrival of the member to such position.",
  16: "Programmed apparatus, including a member movable in sequence to cycle to certain positions, a position representing means including a sensing portion having magnetic recording and detecting elements, and a portion bearing magnetic recordings in the form of combinational codes at previously determined positions, one of said portions being movable in relation to the other portion and movable concurrently and coordinately with said member, a program device having a succession of magnetically recorded combinational codes, coincidence detecting means for comparing the program code and the position representing code, and means for operating said member to the sequence of positions corresponding to the program codes.",
  17: "Program apparatus in accordance with claim 16, including an article holder carried by said movable member, and program-controlled means for operating said holder to seize and release articles between program-controlled transfer strokes of said movable member.",
  18: "Apparatus in accordance with claim 16, additionally including magnetic recording means adjacent said program device, and a source of different arbitrary codes arranged to be optionally operable for energizing said magnetic recording and detecting elements to record different codes on said magnetic-recording bearing portion of said position representing means at different positions corresponding to positions in which said movable member is deliberately placed, said source of arbitrary codes also being arranged for concurrently energizing said magnetic recording means for concurrently recording said different codes successively in said program device.",
  19: "Automatically controlled apparatus, including a mechanical output device, a master controller having read-out means for producing a selected position-representing symbol, power means for moving the mechanical output device, position-representing means coupled to said mechanical output device for movement therewith and including an adjustment effective for position-anticipating sensing and an adjustment for true position sensing, and means responsive to sensed anticipation to adjust the position representing means to true position sensing.",
  20: "Apparatus in accordance with claim 19, wherein said master controller includes means for storing a sequence of position representing symbols and read-out means for producing a selected position-representing symbol.",
  21: "Apparatus in accordance with claim 19, wherein said mechanical output device supports an article gripper and wherein said master controller has means coordinated with said symbol producing means for separately producing gripper-control symbols.",
  22: "Apparatus for evidencing the position of a movable member both when at rest and when in motion, including a series of magnetically biased and alternating-current excited magnetic detectors, and a combinational code member having magnetically different portions opposite the detectors so as to present unique code patterns varying from point to point along the member in a direction across the series of detectors, and means moving the detecting means concurrently and coordinately with the movable member.",
  23: "Apparatus having automatic control means, including a mechanical output device, a program-controller having storage means for position symbols, position representing means coupled to said mechanical output device for conjoint operation therewith, said position representing means including an assembly of mutually independent sensing elements and a combinational code member opposite said sensing elements, said code member and said sensing elements being relatively movable so as to expose a series of positions along said code member to said sensing elements, said code member at each position including a combination of control portions of different kinds opposite different ones of said sensing elements and the combination of control portions at each position being uniquely different from the combination of control portions at all other positions along said control member, and recording devices coupled to said sensing elements and operable to record a sequence of combinational responses of said sensing elements, respectively, in said program controller sequentially, corresponding to a sequence of selected positions of said mechanical output device.",
  24: "Transfer apparatus including a mechanical output element movable through a range of positions, a series of magnetically biased and alternating-current excited magnetic detectors having respective mutually independent output windings, a combinational code member opposite said detectors, said code member and said detectors being relatively movable through a series of sensing positions, so as to present different positions along said code member to said series of detectors for sensing, said code member including control portions opposite certain of said detectors that are magnetically different from control portions opposite others of said detectors in any given sensing position, and the combination of magnetically different control portions of said code member in any sensing position being uniquely different from the combination of control portions in the other sensing positions, means for relatively adjusting said detectors and said code member through said series of sensing positions, and a coupling between said adjusting means and said mechanical output element enforcing coordinate operation thereof.",
  25: "Article transfer means, including an article carrier movable through a range of positions, a series of magnetically biased and alternating-current excited magnetic detectors, a combinational code member having magnetically different portions opposite the detectors so as to present unique code patterns varying from point to point along the member in a direction across the series of detectors, means for adjusting the detectors and the combinational code member in relation to each other, a coupling between said adjusting means and said article carrier for coordinate operation thereof, a magnetic storage program controller and means for recording thereon a series of position-representing combinational codes, readout means for selecting said combinational codes individually and successively, and coincidence detection means for comparing the selected codes of the read-out means, respectively, with the output of said detectors for controlling the article carrier in accordance with previously recorded position-representing codes in the program controller.",
  26: "Apparatus having automatic control means, including a mechanical output device, a program-controller having magnetic storage means for position symbols, position representing means coupled to said mechanical output device for conjoint operation therewith, said position representing means including an assembly of mutually independent periodically excited magnetic sensing elements and a combinational code member opposite said sensing elements, said code member and said sensing elements being relatively movable so as to expose a series of positions along said code member to said sensing elements, said code member at each position including a combination of control portions of different kinds having contrasting magnetic characteristics opposite different ones of said sensing elements and the combination of control portions at each position being uniquely different from the combination of control portions at all other positions along said control member, and magnetic recording devices coupled to said sensing elements and operable to record a sequence of combinational responses of said sensing elements, respectively, in said magnetic program controller sequentially, corresponding to a sequence of selected positions of said mechanical output device.",
  27: "Automatic article transfer apparatus including an article transfer head having article seizing means, a carrier for said article transfer head movable in a predetermined stroke, a support for said carrier movable in a different stroke, a base movably supporting said support, respective power devices for actuating each of said article seizing means, said transfer-head carrier and said support, and program control means including a sequence of selective control indicia and sensing means therefor in control relation to each of said power devices respectively for automatically operating said article transfer head through selected portions of said strokes in a predetermined sequence of motions and for actuating said seizing means to seize and release articles in predetermined coordination with said sequence of motions.",
  28: "Apparatus for evidencing the position of a movable mechanical output member movable through a range of positions, a magnetizable recording medium, a series of magnetic devices opposite said magnetizable medium, said devices including magnetic recording and magnetic field sensing means, said medium and said magnetic devices being movable relative to each other, one of them being relatively fixed and the other being coupled to and movable coordinately with said movable mechanical output member, energizing means for causing said recording means to record control areas uniquely different at different locations along said magnetic recording medium, whereby the subsequent positioning of said mechanical output element at said locations will be uniquely evidenced by the output of said sensing means.",
};

export const devolProgrammedTransferParallelReadings: Readonly<Record<number, readonly string[]>> =
  {
    2: [
      "The opening fixes the subject at automatic machinery and materials handling, but preserves related method aspects. It is not a claim to every robot or warehouse process; the later claims specify particular coded feedback and transfer combinations.",
    ],
    3: [
      "The stated comparison is between manual control and cam control. Devol describes their practical flexibility and specialization limits before proposing a program controller that can store a sequence rather than a fixed mechanical cam contour.",
    ],
    4: [
      "The word Unimation appears in the specification as a characterization of universal automation. In this record it is historical wording, not permission to add measurements from later commercial machines to the 1954 filing.",
    ],
    5: [
      "The transfer head can be jaws, a suction gripper, or another comparable tool. The source connects each stroke and the seize or release command to program tracks; it does not choose a proprietary end effector or specify its forces.",
    ],
    7: [
      "The feedback idea is simple but consequential: moving the output also moves a position representation, and the controller compares that representation with the requested code until it matches. The code can select a stop or direct the next motion.",
    ],
    8: [
      "One-sixteenth inch is a printed illustrative increment, not an asserted universal resolution. The engineering point is that distinct locations can be represented by distinct combinations, and the coding can be ranked numerically or chosen arbitrarily.",
    ],
    9: [
      "The anticipator allows a high-traverse phase to give way before the final target. The grant says this avoids overtravel by reducing rate in advance; it does not state a stopping distance, hydraulic pressure, mass, velocity, or deceleration law.",
    ],
    10: [
      "The record mode teaches a reversible workflow: an operator moves the machine through the desired positions, while position codes are written into magnetic storage for later automatic replay. It is program capture, not a numerical-trajectory controller.",
    ],
    12: [
      "The drawing paragraph connects each source sheet to a distinct mechanism: the pallet transfer apparatus, encoder strips, control drum, anticipator, deformable recording medium, and two detector circuits. The local crops preserve those actual figures.",
    ],
    13: [
      "Figures 1 and 2 are an illustrative warehouse transfer arrangement. Wheels and tracks move the apparatus by pallets while the conveyor receives selected cartons. The apparatus is explanatory context, not a claim that all warehouse robots use this chassis.",
    ],
    14: [
      "The patent identifies a horizontal telescoping arm and a vertical elevator, then explicitly says other motions are contemplated. The review therefore shows the named figure organs without inferring a fixed Cartesian robot geometry for the visual.",
    ],
    15: [
      "The encoder moves mechanically with the transfer head. Its code elements are ordered by numerical rank, and each unit distance moves the sensing head from one element to the next. The displayed slots remain logical states except for the source's illustrative increment.",
    ],
    16: [
      "Direct coupling keeps the encoder state tied to the head during both replay and manual recording. The text contrasts this with long geared paths whose looseness or ratios can undermine the reverse-recording operation; it supplies no gear tolerance or speed number.",
    ],
    17: [
      "The Figure 5 anticipator makes an early comparison first, then returns to a centered sensing relationship for the true stop. This is why the simulation distinguishes anticipated slow travel from a true-position hold without inventing physical rates.",
    ],
    18: [
      "The program drum stores groups of magnetic areas called slots. Separate tracks can encode independent motions and functions such as a clamp, direction, rate, or anticipation. The word slot is historical hardware vocabulary rather than an abstract software array.",
    ],
    19: [
      "A recording channel lets an operator place the apparatus at critical positions and write corresponding codes for later replay. The source presents this as a way to program the drum from the machine itself, with function data recorded alongside position data.",
    ],
    20: [
      "The deformable metal sheet is an alternative recording form. Contacts read its bands, selective rods set them, and a reset bar restores their state. It shows the grant's concern with erasable program storage without converting it into a modern digital medium.",
    ],
  };

export const devolProgrammedTransferArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "9b0ea9729cf6d670a21dfed17264d7b78fa343ab1e98467fc0d3255a5cd03790",
  preparedBy: "Classic Patents editorial agent (JadeHeron)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent Office",
        "2,988,237",
        "Patented June 13, 1961",
        "PROGRAMMED ARTICLE TRANSFER",
        "George C. Devol, Jr., Brookside Drive, Greenwich, Conn.",
        "Filed Dec. 10, 1954, Ser. No. 474,574",
        "28 Claims. (Cl. 214-11)",
      ],
    },
    { kind: "heading", level: 2, text: "PROGRAMMED ARTICLE TRANSFER" },
    p(
      "The present invention relates to the automatic operation of machinery, particularly to automatically operable materials handling apparatus, and to automatic control apparatus suitable for such machinery. The invention will also be seen to have certain related method aspects. In view of the main objective, the following disclosure is addressed particularly to the handling of materials. However, certain of the novel features disclosed will be recognized as having more general application.",
    ),
    p(
      "From the earliest years in the mechanical handling of articles there have been but two types of machine control: cam control and manual control. Article handling by manually controlled hydraulic or electric or otherwise powered machines is found for example in cranes for the transport of heavy objects from a first location in a factory to other locations. Instances of cam control are common, as in the transfer of articles from one unit in a system of conveyors to another conveyor unit.",
    ),
    p(
      "Universal automation, or ",
      term(
        "“Unimation,”",
        "Universal automation",
        "Devol's supplied name for the general objective of a programmable article-transfer machine. The quoted word identifies this historical proposal; it does not identify a source-specified robot geometry, payload, pressure, cycle time, or later commercial embodiment.",
      ),
      " is a term that may well characterize the general object of the invention. It makes article transfer machines available to the factory and warehouse for aiding the human operator in a way that can be compared with business machines as an aid to the office.",
    ),
    p(
      "In applying one feature of this invention, for making a universal automatic article transfer machine, the article transfer head (whether it takes the form of jaws, a suction gripper or other comparable article-handling tool) is moved by a mechanical power source through a sequence of strokes whose lengths and directions are determined by a program controller. Where several different motions are involved, as lifting and swinging and twisting, each independent motion is ordinarily controlled by its own track of an organized program control. Usually seizing and releasing operations of the transfer head require no more than a simple on-off control. But whether controlled for proportional closing or for close-and-open operation, this, too, is coordinated with the transfer-operation controls in the program controller.",
    ),
    { kind: "heading", level: 2, text: "POSITION CODE AND FEEDBACK" },
    p(
      "An especially desirable form of program controller combined with the transfer mechanism to be controlled represents a further feature of the invention. According to this concept, the transfer mechanism operates the transfer head (or a sub-carrier of a mechanism that directly carries the transfer head) and at the same time it displaces a ",
      term(
        "position detector or position representing device",
        "Position encoder",
        "The historical expression for a device that changes state with the transfer head and supplies the feedback representation compared against the programmed destination; the source does not state an encoder resolution except its illustrative one-sixteenth-inch example.",
      ),
      "; and the position detector is compared through a feedback loop with the program controller, until the position detector of the transfer head is displaced into coincidence or matching.",
    ),
    p(
      "The code could be entirely arbitrary; but there is special advantage where each combinational code represents the numerical value of its rank in the sequence. Thus, a different member may be assigned to each 1/16 inch displacement of the transfer head; and the first 1/16 position may be represented by the code for “1”; the second 1/16 position may be represented by the code for “2”; and as many coded elements will be used as there are 1/16 inches in the range of motion of the transfer head. This 1/16 inch dimension is naturally only an example of a significant increment.",
    ),
    p(
      "A further feature of the invention resides in promoting fast traverse of the transfer head to the stop position next required by the program controller. Fast traverse is best achieved by providing for speed reduction in advance of the required stopping point. When appropriate programmed rate-control is provided in the controller, the fast traverse rate is easily reduced when the transfer head reaches a first programmed position so that it can be arrested from the reduced travel rate at a later coded position.",
    ),
    p(
      "In a very flexible embodiment of the invention, the transfer-head program codes can be recorded in the very machine that later is to be controlled automatically, and such a system is a further important feature of the invention. In this type of operation, the machine is cycled slowly with the position representing means operating to provide coded control combinations then entered into the program controller, this recording being advantageously in the form of magnetized areas.",
    ),
    { kind: "heading", level: 2, text: "DRAWINGS AND ILLUSTRATIVE APPARATUS" },
    p(
      figure(1),
      " is a somewhat diagrammatic elevation, partly in section, of article transfer apparatus embodying features of the invention, and ",
      figure(2),
      " is a plan view of the apparatus of ",
      figure(1),
      ".\n\n",
      figure(3),
      " is an enlarged fragmentary diagram in perspective of a portion of the apparatus in ",
      figures([1, 2], "FIGS. 1 and 2"),
      ". ",
      figure(4),
      " is a diagram of the control apparatus of the embodiment in ",
      figures([1, 2], "FIGS. 1 and 2"),
      ". ",
      figure(5),
      " is a side view of an anticipator useful as part of the embodiment of ",
      figures([1, 2, 3, 4], "FIGS. 1–4"),
      ", and ",
      figure(6),
      " is a modified form of anticipator.\n\n",
      figureRange(7, 8, "FIGS. 7 and 8"),
      " are enlarged fragmentary cross-section and plan views of a modified form of program recording and controlling apparatus useful in the apparatus of ",
      figures([1, 2, 4], "FIGS. 1, 2 and 4"),
      ". ",
      figureRange(9, 10, "FIGS. 9 and 10"),
      " are wiring diagrams of two illustrative forms of magnetic detector that may be used where such detectors are required in ",
      figures([4, 11], "FIGS. 4 and 11"),
      ".\n\n",
      figure(11),
      " is a diagram of a modification of ",
      figure(4),
      ".",
    ),
    p(
      figures([1, 2], "FIGS. 1 and 2"),
      ", transfer apparatus generally designated 10 is movable on wheels 12 along tracks 14 to travel the length of a line of pallets 16 and a conveyor belt 18. The pallets support cartons 20 in regular patterned arrangement, which cartons are to be loaded selectively on conveyor 18 by apparatus 10 for transport to a delivery point represented by truck 24.",
    ),
    p(
      "Attention may now be given to the nature of transfer apparatus 10. This apparatus includes suitable drive means for operating head 10a to transport items from the pallets to the conveyor, for lowering the head onto one of the articles 20, and for taking hold of the article and transferring it to the conveyor in readiness for the next automatically selected article-transfer operation. Apparatus 10 includes an arm 34 that telescopes into hydraulic actuator 36 for moving head 10a horizontally, and this arm and its actuator are reciprocable vertically on elevator 38 to raise and lower head 10a.",
    ),
    p(
      "Hydraulic actuator 36 operates arm 34 to extent needed in effecting the transfer strokes of head 10a. A sensing head 46 is connected by arm 48 to move coordinately with head 10a, and in this way sensing head 46 moves along position encoder 50. This device consists of a series of combinational code elements (",
      figure(3),
      ") arranged in the order of their numerical rank, and the space occupied by each code element is equal to the unit-distance traveled by head 10a in carrying the sensing head 46 from one code element to the next. The codes picked up from the encoder are compared with the code picked off program drum 40.",
    ),
    p(
      "The sensing head and the transfer head are directly connected to move as a unit, an important feature of the invention where relatively high speed of traverse and precise positioning are required. This has an advantage over geared connections where looseness and retarded motions enter the picture.",
    ),
    p(
      figure(5),
      " is a side view of an “anticipator” mechanism. The purpose of this device is to make possible the anticipation of coincidence or matching of the position code set up by the program controller 40 with the position representation in the position encoder 46, 50. It is desirable to detect approaching coincidence in advance for many reasons, one of which is to control the drive of the head 10a for deceleration so that when ultimately there is true match, the transfer head will stop in exact register and thus avoid troublesome overtravel.",
    ),
    p(
      "Drum 40 is shown as having a magnetic surface provided with axially arranged groups of magnetized and unmagnetized areas, or oppositely polarized magnetized areas can be effectively utilized. Such related axially distributed areas may be termed a ",
      term(
        "“slot,”",
        "Programmed control slot",
        "A related group of magnetic areas at one sequential drum position. The grant assigns groups of tracks to independently controlled motions and functions; it does not specify a drum circumference, rotation rate, or storage density.",
      ),
      ". A group of code areas in each slot extending as a channel or track around the drum is assigned to each position-representing unit 46, 50 corresponding to each independently controllable motion.",
    ),
    p(
      "It has been noted that the use of a magnetic drum enables a vast amount of control data to be stored, and it also enables the apparatus to be operated in reverse for control data recording. Thus the apparatus may be cycled under manual control, and at each critical position the corresponding codes may be entered into drum 40 for subsequent automatic programmed operation. This is accomplished with the aid of a recording channel 138 selectively connected to magnetic devices 40b of appropriate construction by switch 140.",
    ),
    p(
      "In ",
      figureRange(7, 8, "FIGS. 7 and 8"),
      ", a flexible sheet 142 of metal, in the form of a strip or an endless belt, or a cylinder, has paired slots 144 and short bands 146 between the slots that are deformed so as to bulge out of the surface of the base material. The metal sheet is suitably supported for advance past a sensing position represented by a row of contacts 148, a return electrical circuit being obtained at the support, for advance past a row of solenoid pusher rods 150 for selectively pushing certain said bulging bands upward and selectively allowing other bands of the row to remain bulging downward; and past a pusher bar 152 that resets the set bulged bands so that they all project in the direction to be set selectively by individual pushers 150.",
    ),
    { kind: "heading", level: 2, text: "WHAT IS CLAIMED" },
    ...Object.entries(claimTexts).map(([number, text]) => claim(Number(number), text)),
  ],
};

export function devolProgrammedTransferClaimText(number: number): string {
  const block = devolProgrammedTransferArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Devol manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}
