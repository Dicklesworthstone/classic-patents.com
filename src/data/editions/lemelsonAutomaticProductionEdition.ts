import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const SOURCE_SHA256 = "6554714ab50e6e0e194081b6cb67c02d689a218418710be059998502ef329548";
const FIGURE_ROOT = "/patents/figures/us-3313014-lemelson-automatic-production";

function paragraph(inlines: CuratedSpecificationInlines) {
  return { kind: "paragraph" as const, inlines };
}

function figure(text: string, sheet: number) {
  return {
    kind: "reference" as const,
    text,
    href: `#${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    referenceType: "figure" as const,
    label: `Open ${text} on source drawing sheet ${sheet} of US 3,313,014`,
    figurePreviews: [
      {
        src: `${FIGURE_ROOT}/sheet-${sheet}-source-crop-v1.png`,
        alt: `Source-facsimile drawing sheet ${sheet} for ${text} in US 3,313,014.`,
        width: 851,
        height: 1250,
      },
    ],
  };
}

function claim(number: number, text: string) {
  return {
    kind: "claim" as const,
    number,
    inlines: [{ kind: "text" as const, text }],
  };
}

function claimText(number: number): string {
  const text = CLAIM_TEXT[number];
  if (!text) {
    throw new Error(`US 3,313,014 manual edition is missing claim ${number}.`);
  }
  return text;
}

const CLAIM_TEXT: Record<number, string> = {
  1: "An automatic production system comprising: (a) a plurality of machine tools defining respective work stations of a production line for performing different operations on work-in-process, (b) servo means for each of said tools operable to power said tools in performing various operations on work-in-process, (c) control means for each of said servo means for controlling the operation of said tools, (d) an automatic conveying system including a plurality of carriers for individual work pieces and guide means for guiding said carriers past said work stations, means for predeterminately positioning work on each of said carriers, (e) power means for moving said carriers along said guide means, (f) control means for said carrier power means, (g) said control means being operative for controlling transfer of individual carriers to selected tools, (h) power driven securing means at each work station operative for retaining carriers in predetermined alignment with each tool, (i) means for sensing the presence of a carrier at a work station, (j) said sensing means being operatively coupled to said control means and said carrier securing means for operating same to effect the prepositioning and retention of a carrier at a work station, and (k) a variable program control device having a record member containing a plurality of first recordings operative for stopping and positioning a carrier at selected work stations and second recordings operative to control the operation of selected machines in said system for performing predetermined operations on work held by said carriers, (l) means for reading said recordings, and (m) control means for said reading means operative in response to the activation of said sensing means for operating said reading means upon arrival of a carrier at each work station.",
  2: "Automatic production apparatus comprising: (a) a plurality of separately operative machine tools arranged to define a production line, (b) conveying means for transferring work units to said tools, (c) means for prepositioning work units carried by said conveying means with respect to selected of said tools, (d) means for both selecting the tools for performing on a work unit carried by said conveying means and controlling the operation of at least certain of said selected tools comprising a multi-circuit program controller having a variable program control means operative for generating a plurality of control signals in predetermined sequence on the plural outputs of said controller, (e) means located at said machine tools for identifying each tool, and (f) scanning means operative to scan said identifying means and activate said program controller when work arrives at respective machine tools along said line so as to effect predetermined operations on said work units.",
  3: "Apparatus in accordance with claim 2, a plurality of said machines having variable elements for operating on work-in-process, power means operative to change said variable elements, control means for said variable element power means, said program control device being operatively coupleable to said latter control means to vary same for different units of work whereby different operations may be performed on different work pieces conveyed to said machines.",
  4: "Apparatus in accordance with claim 2, said multi-circuit program controller having a recording member with recordings reproducible to generate variable control signals to effect variable control of at least one of said machine tools, reading means for said recording member, and means for coupling the output of said program controller on which said variable control signals are generated to a selected machine tool to control same upon arrival of a work unit thereat to predeterminately perform on said work.",
  5: "Apparatus in accordance with claim 2 including a carrier for each work unit, retaining means at said machine tools for prepositioning and retaining said carriers and the work units held thereby, means for sensing the presence of a carrier at each tool and means operative in response to the activation of said sensing means for operating said multi-circuit program controller to read recordings and generate signals for controlling the machine tool.",
  6: "An automatic production system comprising in combination, a plurality of machine tools for performing different operations on work-in-process, a conveying system interconnecting said tools including an overhead trackway extending between tools, individual work carriers moveable along said trackway, respective first servo means for driving said carriers between machine tools, first control means for controlling the operation and stopping of said first servo means for positioning a carrier at predetermined machine tools, means on said trackway for identifying the positions of said machine tools, a scanning means mounted on said carriers for scanning said identifying means, said scanning means generating feedback signals for transmission to said control means each time said scanning means scans an identifying means, second control means operative upon prepositioning a carrier at a work station for controlling the operation of the tool at said station, third control means operative upon completion of said tool operation for activating said servo means to cause said carrier to convey the work held thereby along said overhead trackway to a selected machine tool situated further along said trackway.",
  7: "An automatic production apparatus comprising: (a) means for holding and prepositioning work, (b) machine means for performing various operations on work retained by said holding means, (c) means for conveying said holding means with respect to said machine means, (d) a multi-circuit program controller including means for generating a sequence of control signals, (e) means for moving said holding means and selectively positioning same in operative relationship with said machine means for operatively positioning the work held thereby with respect to said machine means, (f) means for coupling said program controller with said machine means upon operatively positioning said holding means with said machine means and causing said program controller to generate control signals, (g) means for using said signals to control said machine means to execute predetermined operations on work retained by said holding means and, (h) means operative in response to the operation of said program controller for uncoupling said holding means and said machine means and causing said holding means to be moved by said conveying means away from said machine means.",
  8: "Apparatus in accordance with claim 7, said coupling means comprising radiation generating means mounted on said first means, and means including said control signal generating means for modulating said radiation generating means upon establishing coupling between said machine means and said work holding means, and receiving means mounted on said machine means including means detecting the modulated signal and means using said modulated signals to variably control said machine means.",
  9: "Apparatus in accordance with claim 7, including electrically operated controls for said machine means, said coupling means comprising a plurality of electrical contactors movable together and including first contact means mounted on said work holding means and second contact means mounted on said second means located to be engaged with said first contact means when said first means is predeterminately positioned with respect to said machine means for establishing a connection between said controls for said machine means and said program control means.",
  10: "Automatic apparatus comprising: (a) a plurality of production tools defining different work stations for operating on work-in-process, (b) a guideway extending adjacent said work stations and defining therewith a production line, (c) a self-propelled carrier movable along said guideway, and means for holding work-in-process retained by said carrier, (d) power operated means for moving said work-in-process relative said carrier, controls for varying said power operated means, (e) variable program control means mounted on said carrier including a predetermining controller for controlling said power operated means, (f) means for identifying said work stations, (g) scanning means operative to scan said identifying means and generate feedback signals to said predetermining controller, (h) said predetermining controller being operative to stop said carrier at selected work stations, and (i) means operative upon arrival of said carrier at a selected work station for activating said program control means to further control said power operated means in a manner to preposition the work retained by said carrier relative to the machine at said selected work station.",
  11: "Apparatus in accordance with claim 10 including servo operated means at a work station for performing variable operations on work conveyed thereto by said carrier, controls for said servo operated means, first coupling means disposed on said carrier and connected to the output of said variable program control means, second coupling means at said work station connected to said servo operated means, means for automatically connecting said first and second coupling means together upon arrival of a carrier at said work station and means for activating said program control means after connecting said coupling means to predeterminately control said work station servo operated means for performing a selected operation relative to the work held by said carrier.",
  12: "An automatic production system comprising: (a) a plurality of machines defining respective stations of a production line for performing different operations on work-in-process, (b) servo means for each of said machines operative to power said tools in performing various operations on work-in-process, (c) control means for each of said servo means for controlling the operation thereof, (d) an automatic conveying system including a plurality of carriers for work pieces and guide means for guiding said carriers past said work stations, (e) power means for moving said carriers along said guide means, (f) control means for said carrier power means, (g) said control means being operative for controlling transfer of individual carriers to selected tools, (h) power driven securing means at each work station operative for retaining carriers in predetermined alignment with each machine, (i) relay sensing means for sensing the presence of a carrier at a work station, (j) said sensing means being operatively coupled to said control means for said carrier power means and said securing means for operating same to effect the prepositioning and retention of a carrier at a work station, (k) and a variable program control device associated with each carrier and operative in response to signals received from said sensing means to control the carrier power means to stop the carrier at selected work stations and to control the machines at said selected stations to predeterminately operate on work transferred thereto by said carrier.",
  13: "Automatic production apparatus for operating on workpieces comprising a movable support means for work, guide means for said support means, a work station including a powered device operative to perform an operation on work positioned by said movable support means, means for moving and prepositioning said support means with respect to said powered device, locking means operative to secure said work support means at said work station, power means for said locking means, program control means operative for controlling said powered device and said power means for said locking means to lock said support means in position during the operation of said powered device, said program control means being also operative to control said power means for said locking means to release said locking means after said powered device has completed an operation on said work held by said support means for unlocking said support means and means operative upon release of said locking means for moving said support means to convey said work away from said work station.",
  14: "Automatic production apparatus for operating on workpieces comprising in combination with a movable carrier for retaining and prepositioning work in process, means for prepositioning a workpiece on said carrier, guide means for said carrier, a work station including a production tool operative to predeterminedly operate on work positioned by said carrier, means for moving and prepositioning said carrier with respect to said production tool, securing means mounted on said work carrier and operative to secure said carrier at said work station, power means for said securing means, switching means operative upon prepositioning said carrier at said work station for controlling said power means for said securing means to hold and preposition said carrier during the operation of said powered device, means synchronized to the operation of said powered device for releasing said securing means after said powered device has completed an operation on said work held by said carrier for unlocking said carrier and means operative upon release of said securing means for moving said carrier and said work away from said work station.",
  15: "In an automatic production system, a plurality of power operated machines defining a plurality of work stations at least certain of said machines being operative for performing various operations on work-in-process, a plurality of work carrier means movable past said work stations and operative for moving work to selected stations, power means for moving said carrier means, control means for activating said power means to move said carrier means to said selected stations, said control means including a control element mounted to move with the movement of said carrier means, means associated with said station for actuating said control element as said carrier means moves opposite said selected stations, said control element being operative when so activated for deactivating said power means to stop said carrier at said selected stations.",
  16: "In an automatic production apparatus, a plurality of carriers for holding work-in-process, a plurality of power operated devices for performing variable operations on said work, means for moving said carriers and prepositioning work held thereby with respect to selected of said power operated devices, control means for said power operated devices including means for varying the operation of said devices, programming means including changeable record means mounted on each carrier, reading means for said record means operative when activated by said record means to generate a sequence of control signals, means for transmitting signals from said reading means to a selected control means when a carrier is prepositioned with respect to a selected power operated device controlled by said control means, and means operative upon prepositioning a carrier with a selected power operated device for causing said reading means to read the record means on the carrier.",
  17: "An automatic production apparatus comprising: a machine tool; a carrier for holding work-in-process; alignment means associated with said carrier for aligning said carrier with respect to said tool; a first track for supporting and guiding said carrier in movement past said tool; said machine tool operative to perform operations on work held by said carrier; a second track opposite said tool and having way means aligned to receive said carrier alignment means; power means for moving said carrier past said machine tool; said carried alignment means operative to engage said second track upon movement of said carrier opposite said tool to predeterminedly position said carrier and the work held thereby with respect to said tool whereby precise operations may be performed on said work by said tool.",
  18: "An automatic production apparatus comprising: (a) a conveying system for work-in-process including a trackway and a plurality of self-propelled carriers operative to travel said trackway, (b) a plurality of work stations, (c) first servo means mounted on each carrier for driving same along said trackway, (d) means supported by each carrier for receiving and holding work, (e) variable means at each work station for performing operations with respect to said work, and (f) a multi-circuit programmable controller supported by each carrier and operative for controlling said first servo means to position the carrier at selected work stations, (g) said multi-circuit program controller being also operative for predeterminately controlling the means at each work station for variably performing operations with respect to the work upon alignment of a carrier at a selected work station.",
  19: "Automatic production apparatus comprising: (a) conveying means for work-in-process, (b) a machine for performing operations with respect to work fed thereto by said conveying means, (c) means at said machine for predeterminately locating and securing work after it is fed to said machine by said conveying means, (d) first power means for moving said conveying means, (e) second power means for operating said work securing means, (f) third power means for operating said machine to perform on said work, and (g) pre-programmed control means for selectively actuating said first, said second and said third power means such that work is conveyed to said machine and said machine is predeterminately operated to perform on said work.",
  20: "Automatic production apparatus in accordance with claim 19, said pre-programmed control means being also operative to control said second power means after the termination of operation by said machine on said work to cause said securing means to release work held at said machine and to operate said first power means thereafter to remove work from said machine.",
  21: "Automatic production apparatus in accordance with claim 19 including pallet means for holding and predeterminately locating work, said conveying means including means for moving and guiding said pallet means into operative relationship with said machine, and means for predeterminately locating said pallet means at said machine to preposition work held thereby with respect to said machine, said securing means at said machine being operative to hold said pallet means for retaining and locating said work at said machine.",
};

export const lemelsonAutomaticProductionArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: SOURCE_SHA256,
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent Office",
        "3,313,014",
        "AUTOMATIC PRODUCTION APPARATUS AND METHOD",
        "Jerome H. Lemelson, 85 Rector St., Metuchen, N.J. 08841.",
        "Filed Apr. 8, 1965, Ser. No. 465,812",
        "Patented Apr. 11, 1967",
        "21 Claims. (Cl. 29-33.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Sheet 1 of 6",
      title: "Carrier and monorail assembly",
      description: [
        figure("FIG. 1", 1),
        { kind: "text", text: ", " },
        figure("FIG. 2", 1),
        { kind: "text", text: ", and " },
        figure("FIG. 3", 1),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Sheet 2 of 6",
      title: "Bi-rail and mono-rail carrier variants",
      description: [
        figure("FIG. 4", 2),
        { kind: "text", text: ", " },
        figure("FIG. 5", 2),
        { kind: "text", text: ", and " },
        figure("FIG. 6", 2),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Sheet 3 of 6",
      title: "Scanning carrier variants",
      description: [figure("FIG. 7", 3), { kind: "text", text: " and " }, figure("FIG. 8", 3)],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Sheet 4 of 6",
      title: "Work-station alignment",
      description: [
        figure("FIG. 9", 4),
        { kind: "text", text: ", " },
        figure("FIG. 10", 4),
        { kind: "text", text: ", " },
        figure("FIG. 11", 4),
        { kind: "text", text: ", and " },
        figure("FIG. 12", 4),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Sheet 5 of 6",
      title: "Automatic control system",
      description: [figure("FIG. 13", 5)],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Sheet 6 of 6",
      title: "Flight-conveyor carrier variants",
      description: [figure("FIG. 14", 6), { kind: "text", text: " and " }, figure("FIG. 15", 6)],
    },
    paragraph([
      {
        kind: "text",
        text: "This invention relates to automatic production apparatus and is a continuation-in-part of my copending application Ser. No. 152,702 for Automatic Production Systems, filed on Oct. 17, 1961, which was a division of application Ser. No. 449,874 filed on July 28, 1954, now abandoned.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In the art of fabricating products automatically by use of a plurality of machines operative to perform various operations on said products or components thereof, continuous flight or belt conveyors have been employed for the transfer of articles or assemblies between machines. U.S. Patent 2,139,403 provides a machine transfer apparatus employing different lengths of helical screw drives operative to effect the transfer of work holding fixtures between machine tools. However, such systems are relatively inflexible and are designed to perform a particular machining operation relative to a particular work piece and repeat said operation in the same manner on each work piece fed to the transfer line. If changes are required in the operations to be performed, machine tool set-ups must be changed, a function which heretofore required the expenditure of time and manual labor resulting in substantial machine idleness or down-time.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Production requirements are frequently of such a nature as to require changes in the specification of a product either resulting from variations in the requirements of the user, the use of different forms or models of the same product or engineering revisions. For example, it may be desired to change the location, number or size of holes in a portion of a work piece; vary the degree or type of finish; vary the shape; add or remove components from an assembly; inspect different portions of a work piece or form articles in different manners. Using conventional transfer machinery, such product variation requirements are frequently costly and may require rebuilding the machine line. At the least, they will require that the machine line be idle during the changeover procedure with a resulting interruption in production.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "It is, accordingly, a primary object of this invention to provide an automatic production apparatus including a transfer system which is flexible and capable of performing a plurality of different operations on a work piece in a cycle which may be varied without changes in machine set-up.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Another object is to provide an improved automatic production apparatus including a transfer conveyor system and a plurality of production machines disposed adjacent to said transfer conveyor, said conveyor system being operative to transfer different articles to selected of said machines for the performance of different production functions thereon whereby a plurality of different articles may be processed without changes in machine set-up.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Another object is to provide an improved automatic production apparatus including a plurality of production devices and a plurality of carriers for ",
      },
      {
        kind: "term",
        text: "work-in-process",
        definition:
          "Material or a partially completed article moving between operations. Here it is the physical work carried through the production line, rather than a modern software job record or a claim about completed goods.",
      },
      {
        kind: "text",
        text: " which are operative to receive, transfer and preposition work pieces of different shape to selected of said production devices.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Another object is to provide an automatic production apparatus including a work transfer conveying system, a plurality of production devices and machines at which at least certain are variably operative to perform different operations on work-in-process, said apparatus including variable programming means operative to vary the operation of said variable devices upon the positioning of work by said conveying apparatus at said devices.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Another object is to provide an improved automatic production system including a plurality of production machines and a conveying system including a plurality of carriers for transporting work in process to selected of said machines, said system including separate program controllers mounted on each of said carriers and operative to control operation of both the carrier and at least certain of said production machines.",
      },
    ]),
    paragraph([
      { kind: "text", text: "There is shown in " },
      figure("FIGS. 2 and 3", 1),
      {
        kind: "text",
        text: " details of one form of conveyor or carrier for a work piece W applicable to the production system illustrated in ",
      },
      figure("FIG. 1", 1),
      {
        kind: "text",
        text: ". The carrier 22 includes an overhead carriage 22 provided with a plurality of wheels 24 rotationally mounted thereon and operative to travel longitudinally along the overhead monorail track 21 for transferring the work from station to station or machine to machine as described. Supported by and depending downwardly from the carriage 22 is an assembly including a vertical column 23 and a fixture movable up and down the column including a platform 35 on which the work retaining means is mounted.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The carrier is power driven along the overhead track 21 by means of a reversible gear motor Mx mounted on the carriage 22 and operative to rotate through gears 26 a wheel 25 which frictionally engages the bottom surface of the track 21 for moving the carrier therealong. Electrical energy for the various motors associated with the carrier is provided by means of a plurality of wires or slide bars 28, 28' which are insulatedly supported off and parallel to the track 21 and which are slidably engaged by brushes 27 mounted on and projecting from carriage 22.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The carrier illustrated in ",
      },
      figure("FIGS. 2 and 3", 1),
      {
        kind: "text",
        text: " includes means for rotating the article handling components situated beneath the carriage 22. The upper end of column 23 is secured to a large circular gear 34 preferably having as a rotational axis the longitudinal axis of the column. A second reversible gear motor MR is shown secured to the side wall of the carriage 22 and is provided with a small circular gear 33 secured to its output shaft which engages the peripheral teeth of gear 34 for rotating same in either direction depending on the operation of the motor MR. Thus, work held by the fixture retained by column 23 may be rotated through a circular path for prepositioning same relative to a work station or machine.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The fixture for supporting the work piece W includes a collar 38 which is slidably movable up and down the column 23 between predetermined limits thereon. Power operation of collar 38 and the work holding assembly secured thereto is effected by means of a reversible gear motor Mz shown mounted within the column 23 and having a long worm gear 42 secured to its output shaft and supported in bearing at its other end by means of a flanged plate 41' secured to the inside surface of the side wall of column 23. A bushing 43 provided with internal helical teeth is movably mounted on the worm 42 and supports collar 38 on column 23. A plurality of vertically extending slotted holes 45 are provided in column 23 through which extend spokes 44 connected to collar 38 and the helical gear collar 43. Thus, as motor Mz rotates, the helical gear formation on shaft 42 is operative to urge collar 43 longitudinally with respect to shaft 42, the direction of which will depend upon the direction of rotation of said shaft.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The platform 35 is shown movably supported with respect to column 38 on a cylindrical rod or beam 35 supported by 38 and extending outward therefrom. The platform 35 may be locked in a predetermined position along the cylindrical beam 35 or may be advanced and retracted thereon with respect to column 23 by means of a reversible gear motor My mounted on an extension 37 of the platform and having a pinion gear 39 connected to its output shaft which engages the teeth of a rack 39' supported off beam 35 along substantially the length thereof by a plurality of brackets 40.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In one form of the invention, control of movement of the overhead traveling carriages for ",
      },
      {
        kind: "term",
        text: "prepositioning",
        definition:
          "Locating a carrier and its retained work in the intended geometrical relation to a station before an operation. The word covers movement, stopping, alignment, and retention rather than merely arriving nearby.",
      },
      {
        kind: "text",
        text: " the work held thereby with respect to the various production devices of the system is effected by generating feedback pulses with movement of said carriage along its track and utilizing same to uncount one or more predetermining counters or otherwise affect cycle controllers. In ",
      },
      figure("FIG. 5", 2),
      {
        kind: "text",
        text: " a plurality of limit switches 59 and 65 are shown secured to the carriage. The actuator arm 60 of switch 59 becomes engaged by pins 61 secured at selected locations along the I-beam. A signal generated by the switch may brake or stop the servo motors to preposition the work with respect to a production device.",
      },
    ]),
    paragraph([
      figure("FIG. 13", 5),
      {
        kind: "text",
        text: " shows one form of automatic control system applicable to the apparatus. The system uses a cycle controller 47 such as a tape or card reader, or a ",
      },
      {
        kind: "term",
        text: "multi-circuit timer",
        definition:
          "A source-era controller with several output circuits that can issue an ordered sequence of commands. The grant describes records, card or tape readers, timers, contacts, and relays, not a particular modern computer architecture.",
      },
      {
        kind: "text",
        text: " driven by a constant-speed motor 125 and having output circuits 46. The outputs become energized during a production cycle to activate motor controls, preposition the carrier and work relative to one or more machines, and in some arrangements control the apparatus at selected work stations.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In a described cycle, switch 59 on the approaching carrier is activated by marker pin 61 and sends a signal to start controller 47. Outputs then stop the carrier drive, activate a clamp such as solenoid 65, advance platform 35 with motor My to a limit switch 89, and raise or lower the platform with motor Mz to switch 88. The tape or card reader may then control clamp 36. Device 73 may retain the work-handling platform against the machine bed by clamping, magnetic attraction, or suction means.",
      },
    ]),
    paragraph([
      figure("FIG. 13", 5),
      {
        kind: "text",
        text: " also shows coupling means 85 between the controller supported by the work transfer conveyor and the production device MT. Coupling devices 86 on platform 35 electrically meet terminals 87 secured to the machine tool or its platform. The terminals lead to forward, reverse and stop controls F, S and R of the production device so that signals from the carrier-mounted program controller may control its operation.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Upon termination of an operational cycle, controller 47 stops motor 125 after signals have reversed or deactivated the positioning, clamping, and production-machine servos. The cycle precedes this by reversing either or both of My and Mz and energizing forward Mx to carry the work to a next tool or station. At the next switch or sensing device 59, controller 47 may begin a new control cycle or bypass the station by maintaining the forward drive control without activating the other servos.",
      },
    ]),
    paragraph([
      figure("FIGS. 14 and 15", 6),
      {
        kind: "text",
        text: " illustrate conveying apparatus for work-in-process. Carrier 100 travels along a flight conveyor 107 past machine tools and may be transferred to selected tools on a branch roller conveyor 109. The carrier has side walls 101a and 101b, end walls 101c and 101d, bottom wall 102, and a partition between a work-holding section and a section for clamping, computing, detecting, and coupling devices. Clamps C1, C2 and C3 retain work.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Photoelectric housing 68 on carrier wall 101a scans reflective markers 70 along conveyor side wall 108. Its relay signals the computing device in housing 47 to transfer the carrier to selected tools. In the ",
      },
      figure("FIG. 14", 6),
      {
        kind: "text",
        text: " version each carrier has a power supply and its lineal actuator 103 can deflect the carrier. In the ",
      },
      figure("FIG. 15", 6),
      {
        kind: "text",
        text: " version a lineal actuator transfers carrier 100 from main conveyor 107 to branch conveyor 109 in response to scanning of markers or codes; the source describes pneumatic or hydraulic operation for that version.",
      },
    ]),
    { kind: "heading", level: 2, text: "I claim:" },
    ...Array.from({ length: 21 }, (_, index) => claim(index + 1, claimText(index + 1))),
  ],
};

export const lemelsonAutomaticProductionParallelReadings: Record<number, readonly string[]> = {
  7: [
    "The grant identifies itself as a continuation-in-part and gives a filing history. That history establishes the legal lineage; it does not itself measure how a carrier or a production machine performed.",
  ],
  8: [
    "Lemelson names rigid, repetitive transfer lines as the practical bottleneck. The response is a carrier that can be routed and reprogrammed for different work, not a claim that every automated factory was newly invented.",
  ],
  9: [
    "The source describes why a changed product often meant changing tools or rebuilding the line. Its examples range from hole location to finishing and inspection, making product variation the stated engineering problem.",
  ],
  10: [
    "The primary object is flexible sequencing without a new machine set-up. The claim language later turns that aim into carriers, positioning, sensors, records, controllers, securing means, and machines.",
  ],
  11: [
    "This object adds a transfer conveyor and selected production machines. A carrier can serve different stations, but the grant does not provide a speed, payload, accuracy, or throughput number for that motion.",
  ],
  12: [
    "The period phrase work-in-process means the physical partially completed article. The carrier and stations are the patent's material system, rather than an abstract scheduling or inventory service.",
  ],
  13: [
    "The patent makes programming consequential only after work is positioned at a device. It therefore connects a routing decision to a machine command, rather than treating the programme as detached from the carrier.",
  ],
  14: [
    "The controller is mounted on a carrier and can affect both travel and a selected machine. That distributed arrangement is central to the claims, but it should not be relabeled as a modern networked control system.",
  ],
  15: [
    "Figures 2 and 3 make the carrier spatial: overhead travel, a hanging column, a platform, and retained work. The Three.js model follows those named relations but declares its display proportions because the grant supplies no construction dimensions.",
  ],
  16: [
    "Motor Mx moves the carrier along the overhead guide while brushes collect power and control connections from slide bars. The legal relevance is controlled transport on a guide, not a stated electrical rating or traction-force model.",
  ],
  17: [
    "The circular gear and reversible motor rotate the lower handling assembly. This provides another positioning degree of freedom, but the source gives neither an angular speed nor a mass or inertia for an SI rotation simulation.",
  ],
  18: [
    "Motor Mz and the worm move the collar vertically. The simulation preserves the ordered relation between rail, lift, reach, locking, and coupling while refusing a fabricated lift distance, load, or motor torque.",
  ],
  19: [
    "Motor My advances and retracts platform 35 along its beam. Together with Mx and Mz, it forms a source-described coordinate topology; the source gives no numerical travel range, so the public controls are deliberately normalized.",
  ],
  20: [
    "Marker events and predetermining counters supply the actual feedback idea. Each recognized marker changes a controller state, which is why the visual exposes a marker-match and station-lock probe instead of inventing position accuracy.",
  ],
  21: [
    "Figure 13 is a sequence diagram: a marker starts the cycle, the carrier locks, the platform reaches the station, then the lift and clamp operate. The live claim probe makes the cycle fail safely when station coupling is absent.",
  ],
  22: [
    "The carrier's contacts meet station contacts only after positioning. The source thereby teaches an interface between portable programme and fixed machine controls, not a generic claim to any signal protocol.",
  ],
  23: [
    "After an operation, the controller reverses positioning motions and restarts carrier travel. That release-and-departure transition is the visible outcome of the Claim 7 and Claim 20 probe in the interactive model.",
  ],
  24: [
    "The later carrier uses a flight conveyor and branch conveyor to bring a work-holding carrier to selected tools. It is a second material-handling embodiment of the same programme, sensing, coupling, and prepositioning architecture.",
  ],
  25: [
    "The photoelectric version reads reflective markers and can direct a carrier to a branch. The source names a pneumatic or hydraulic actuator in one version but provides no pressure, flow, stroke, or timing values, so none are fabricated here.",
  ],
  26: [
    "The carrier-mounted contacts and station clamp complete the second embodiment: a sensed and selected carrier reaches a tool, mechanically locates, couples its programme, and is held while the tool begins. This is the same source-bounded control topology presented in a different conveyor form.",
  ],
};
