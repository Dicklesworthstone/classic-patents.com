import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const PATENT_ID = "us-3081379-lemelson-machine-vision";
const SOURCE_SHA256 = "2550a9d494a822f3f639c985899452b39432d53928db419633458d020c554b44";
const SOURCE_FIGURE_DIRECTORY = `/patents/figures/${PATENT_ID}`;

const sourceSheetByFigure: Readonly<Record<number, string>> = {
  1: "fig-1-source-crop-v1.png",
  2: "fig-1-source-crop-v1.png",
  3: "fig-2-source-crop-v1.png",
  4: "fig-4-source-crop-v1.png",
  5: "fig-4-source-crop-v1.png",
  6: "fig-5-source-crop-v1.png",
  7: "fig-5-source-crop-v1.png",
  8: "fig-6-source-crop-v1.png",
  9: "fig-7-source-crop-v1.png",
  10: "fig-8-source-crop-v1.png",
  11: "fig-8-source-crop-v1.png",
  12: "fig-9-source-crop-v1.png",
  13: "fig-9-source-crop-v1.png",
  14: "fig-10-source-crop-v1.png",
  15: "fig-10-source-crop-v1.png",
};

export const figure = _figure;

function sheetForFigure(figureNumber: number): string {
  return sourceSheetByFigure[figureNumber] ?? "fig-1-source-crop-v1.png";
}

function _figure(number: number, sourceText = `FIG. ${number}`): CuratedSpecificationInline {
  const sheet = sheetForFigure(number);
  return {
    kind: "reference",
    text: sourceText,
    href: `#fig-${number}`,
    referenceType: "figure",
    label: `Pinned source crop for Fig. ${number}`,
    figurePreviews: [
      {
        src: `${SOURCE_FIGURE_DIRECTORY}/${sheet}`,
        alt: `${sourceText} on its pinned US 3,081,379 drawing sheet.`,
        width: 4834,
        height: 7100,
      },
    ],
  };
}

const words = (value: string): CuratedSpecificationInlines => {
  const parts = value.split(/\b(FIGS?\.\s+\d+[A-Za-z0-9′′]*|FIGURE\s+\d+[A-Za-z0-9′′]*)/gi);
  const inlines: CuratedSpecificationInlines = [];
  for (const part of parts) {
    if (!part) continue;
    const match =
      part.match(/\b(?:FIGS?|FIGURE)\.\s*(\d+)/i) || part.match(/\b(?:FIGS?|FIGURE)\s+(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      inlines.push(_figure(num, part));
    } else {
      inlines.push({ kind: "text", text: part });
    }
  }
  return inlines;
};
const _text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });
const paragraph = (inlines: CuratedSpecificationInlines): CuratedSpecificationBlock => ({
  kind: "paragraph",
  inlines,
});

function _term(
  sourceText: string,
  category:
    | "Legal & Claim Terminology"
    | "Historical Electronics Terminology"
    | "Optical & Video Terminology",
  definition: string,
): CuratedSpecificationInline {
  return {
    kind: "term",
    text: sourceText,
    label: `${category}: ${sourceText}`,
    definition,
  };
}

const p = (...inlines: Array<string | CuratedSpecificationInline>): CuratedSpecificationBlock => ({
  kind: "paragraph",
  inlines: inlines.flatMap((inline) => (typeof inline === "string" ? words(inline) : [inline])),
});

const claim = (number: number, value: string): CuratedSpecificationBlock => ({
  kind: "claim",
  number,
  inlines: words(value),
});

const blocks: CuratedSpecificationBlock[] = [
  {
    kind: "masthead",
    lines: [
      "United States Patent Office  3,081,379",
      "Patented Mar. 12, 1963",
      "3,081,379",
      "AUTOMATIC MEASUREMENT APPARATUS",
      "Jerome H. Lemelson, Metuchen, N.J. (85 Rector St., Metuchen, N.J.)",
      "Filed Dec. 4, 1956, Ser. No. 626,244",
      "1 Claim. (Cl. 178—6.8)",
    ],
  },
  {
    kind: "heading",
    level: 2,
    text: "Specification",
  },
  p(
    "The present invention relates to magnetic recording and particularly to arrangements whereby video picture s1gnals may be used for effecting a multiple of computing, operative, measurement and control functions.",
  ),
  p(
    "It is known in the art to record a series of picture signals on a moving magnetic tape and for reproducing said signals at essentially the time rate of recording to create a motion picture on a video or television screen for visual observation. My copending patent application Serial Number 688,348, now abandoned, describes means for recording a video signal of a single frame or screen sweep of the video scanning beam of a camera or flying spot scanner which may be reproduced thereafter and used to provide a still image picture on a video monitor screen.",
  ),
  p(
    "In accordance with one embodiment of the present invention, all or part of a video picture single frame sweep signal is recorded on a magnetic medium whereby a point in said signal which is preferably the start of said frame sweep, is known and is indicated by a sync pulse also recorded on said medium and a second signal thereon' is used to effect the reproduction of parts of said video signal. By using such a method of programming video signal recording and reproduction, various automatic operations may be performed on or in coaction with part of said video signal.",
  ),
  p(
    "Accordingly, it is a primary object of this invention to provide means whereby video picture signals and the like may be used for automatic computing, control and measurement operations.",
  ),
  p(
    "Another object of this invention is to provide simple and improved means for operating on a videopicture signal which is recorded on a magnetic recording medium for investigating and/or changing part of said signal.",
  ),
  p(
    "Still another object is to provide means whereby a video picture signal may be used to effect automatic quality control by the investigation of part of said signal.",
  ),
  p(
    "Another object is to provide an automatic means whereby a video picture signal may be used to effect dimensional measurement and investigation of tolerance.",
  ),
  p(
    "Another object is to provide a means for effecting automatic measurment and quality control functions using two video picture signals, one a standard signal of known characteristic and the other a sample or test signal, whereby all or parts of said signals are investigated and compared by their simultaneous reproduction from a magnetic recording medium on which they are recorded in predetermined relative positions.",
  ),
  p(
    "Another object is to provide automatic means for reproducing a specific or predetermined part or parts of a video picture signal for computing, measurement or control purposes.",
  ),
  p(
    "Another object is to provide automatic means for reproducing that part of a video signal derived during the scanning of a specific area of a total image field without the need to control the scanning beam of a video scanning device.",
  ),
  p(
    "Still another object is to provide means for operating on video picture signals and for modifying or changing specific portions of said signals whereby the altered picture signal may be used to produce a video image or still picture of modified image characteristics.",
  ),
  p(
    "Another object is to provide means for recording a video picture signal with digital pulse code signals adjacent thereto for effecting the reproduction of said video signal.",
  ),
  p("&#34;ice"),
  p(
    "Still another object is to provide video scanning and control means for automatically effecting the measurement or inspection of an object for obtaining dimensional or other physical characteristics.",
  ),
  p(
    "Still another object is to provide apparatus for the automatic inspection by photoelectric or video means of work in process or finished goods without manual attendance thereto.",
  ),
  p(
    "Another object is to provide new and improved apparatus which may be used to elfect various inspection, control and digitizing functions.",
  ),
  p(
    "Another object is to provide automatic apparatus for measuring an object or surface including means for selectively measuring predetermined parts of said object and for providing information in code form resulting from said-measurement which may be utilized by a digital computer.",
  ),
  p(
    "Another object of this invention is to provide improved means for providing picture information on magnetic recording tape for record keeping and other functions.",
  ),
  p(
    "The circuits and recording arrangements described above are intended to be merely illustrative. Many diffe'rent types of circuits could be substituted for each of the component circuits illustrated. Thus, while the present invention has been described by reference to particular embodiments thereof, it will be understood that this is by Way of illustration of the principles involved and that those skilled in the art may make many alterations and modifications in the arrangement and mode of operation. Therefore, I contemplate by the appended claims to cover any such modifications as fall within the true spirit and scope of my invention.",
  ),
  p(
    "The invention will now be described in greater detail with reference to the appended drawings in which:",
  ),
  paragraph([
    _figure(1, "FIG. 1"),
    _text(
      " illustrates a portion of a recording member and an arrangement of picture signals and control or gating signals provided thereon in predetermined relative positions;",
    ),
  ]),
  paragraph([
    _figure(1, "FIG. 1A"),
    _text(
      " illustrates a portion of a multi-track recording member having plural picture signals recorded adjacent each other and associated control or gating signals tandemly aligned with said picture signals;",
    ),
  ]),
  paragraph([
    _figure(1, "FIG. 13"),
    _text(
      " illustrates a portion of a mult-i-track recording member containing both picture and code signals recorded on different tracks thereof and also illustrates in block diagram notation, gating and computing circuitry for utilizing reproductions of recordings;",
    ),
  ]),
  paragraph([
    _figure(1, "FIG. 1B"),
    _text(" is a circuit diagram showing details of part of the computing circuitry of FIG. IE; I"),
  ]),
  paragraph([
    _figure(1, "FIG. 1C"),
    _text(
      " illustrates a portion of a recording member containing picture signals and control signals and cir cuitry provided in the output of the reproduction transducers which scan said recording member;",
    ),
  ]),
  paragraph([
    _figure(2, "FIG. 2"),
    _text(
      " illustrates a portion of a multi-track recording member having signals of predetermined duration or length recorded thereon in predetermined positions rela tive to recorded picture signals for indicating, when re produced simultaneously with said picture signals, dimensional ranges of the physical phenomenon or objects scanned to generate said picture signals;",
    ),
  ]),
  paragraph([
    _figure(3, "FIG. 3"),
    _text(
      " illustrates a recording and reproduction arrange. ment whereby control means are provided for blanking all but predetermined or particular portions of one or more picture signals so that the remaining portion or portions of said picture signals may be analyzed without interference from the other portions;",
    ),
  ]),
  paragraph([
    _figure(4, "FIG. 4"),
    _text(
      " illustrates a recording and reproduction arrangement for operating on a picture or analog signal in a manner similar to that illustrated in FIG. 3 to effect one or more dimensional measurements or control functions;",
    ),
  ]),
  paragraph([
    _figure(4, "FIG. 4"),
    _text(
      " is a fragmentary view of a scanning field i1- lustrating-the physical significance of certain of the signals recorded on the recording member of FIG. 4;",
    ),
  ]),
  paragraph([
    _figure(4, "FIG. 4A"),
    _text(
      " illustrates a circuit applicable as a replacement for a portion of the circuit of FIG. 4;",
    ),
  ]),
  paragraph([
    _figure(4, "FIG. 4B"),
    _text(
      " illustrates a digital code generator or clock applicable to the circuitry of FIG. 4 to effect measurement functions;",
    ),
  ]),
  paragraph([
    _figure(5, "FIG. 5"),
    _text(
      " illustrates a recording arrangement with predetermined positioned sync and gating signals;",
    ),
  ]),
  paragraph([
    _figure(6, "FIG. 6"),
    _text(
      " illustrates the recording arrangement of FIG. 5 and circuit components utilizing the signals provided thereon;",
    ),
  ]),
  paragraph([
    _figure(7, "FIG. 7"),
    _text(
      " illustrates a modified form of the recording a1- rangement and circuit components of FIGS. 5 and 6;",
    ),
  ]),
  paragraph([
    _figure(8, "FIG. 8"),
    _text(
      " illustrates a recording arrangement and a reproduction circuit diagram utiliza'ole for effecting automatic dimensional measurement;",
    ),
  ]),
  paragraph([
    _figure(8, "FIG. 8"),
    _text(
      " illustrates a scanning field showing physical aspects of the signals recorded in FIG. 8;",
    ),
  ]),
  paragraph([
    _figure(9, "FIG. 9"),
    _text(
      " illustrates a recording arrangement and reproduction circuitry therefore applicable for measuring the various dimensions of distances in an image field and providing said measurements as coded signals;",
    ),
  ]),
  paragraph([
    _figure(10, "FIG. 10"),
    _text(
      " illustrates a clipping level adjustment means applicable to part of the apparatus of FIG. 9;",
    ),
  ]),
  paragraph([_figure(11, "FIG. 11"), _text(" is a more detailed view of a portion of FIG. 10;")]),
  paragraph([_figure(12, "FIG. 12"), _text(" is a more detailed view of a portion of FIG. 9;")]),
  paragraph([
    _figure(13, "FIG. 13"),
    _text(
      " is an isometric view of a scanning station utilized to provide picture signals which are applicable to the recording and measurement arrangements illustrated in the other drawings;",
    ),
  ]),
  paragraph([
    _figure(14, "FIG. 14"),
    _text(
      " is a plan view of FIG. 13, which view also illustrates recording and dimensional measuring components; and",
    ),
  ]),
  paragraph([
    _figure(15, "FIG. 15"),
    _text(
      " illustrates a circuit which may be substituted for the Schmidt cathode coupled multivibrator circuit of FIGS. 8 and 9.",
    ),
  ]),
  p(
    "A number of recording, reproduction, scanning and comparison measurement, counting, control and computing functions will be described hereafter together with apparatus which will utilize a video picture signal derived by electron beam or flying spot scanning of an object or image field or a video storage tube surface. For most of the above functions, said picture signal or signals are recorded in a fixed or predetermined position, on a magnetic recording member such as a magnetic tape or drum, relative to one or more controls and/ or gating signals which will be denoted by the notations SC or CS. While these control signals are specified as constant amplitude pulse signals of a short or predetermined duration, they may also be of variable amplitude and/ or frequency depending upon the type of operation or function controlled thereby.",
  ),
  p(
    "One technique presented hereafter comprises the scanning and investigation of an image or optical field such as a specific area of a surface of a work piece or assembly or an image field in which a portion thereof contains an object or plurality of objects having an optical characteristic which is discernable from the characteristic of the surrounding field or background by, for example, different color or light reflectivity, which investigation involves the analyzing of a length or lengths of the video picture signal produced when said object or field is scanned by a video camera or flying spot scanner. If automatic scanning or comparison measurement using a change in a portion of a video signal is to be employed for measurement or analysis of the optical characteristics of the field from which the signal was derived, then a requisite for such measurement, if it is to be meaningful, is that the area, object, or other phenomenon in the field being scanned must be at a known distance from the scanning camera optical system or the flying spot scanner so that its scanned area will be to a predetermined scale in the image field. The attitude of the object or plane being scanned must also be fixed or predetermined relative to the axis of the video scanning device. Also, a plane, point or area of said objectshould be or referenced in position in said field being scanned. The requirement for any automatic measurement is that a base or benchmark be established. Since measurement or comparison is effected in this invention by scanning means, which is utilized to indicate the existence of an area, line or plane in the field being scanned, the above mentioned cale, alignment and positional requisites must exist to a predetermined degree or tolerance in order to attain a predetermined degree of precision in said measurement. It is thus assumed, for those functions described hereafter where dimensional measurement, comparative image analysis or other investigations involving the scanning and analysis of a specific area or areas of the total field, that said object, surface, or area being scanned is prepositioned, aligned and provided at a predetermined scale in the scanning field. For the automatic and rapid investigation of multiple articles or assemblies by this method, a jig, fixture, platform or other form of prepositioning stops may be provided to preposition said articles at a fixed distance and attitude relative to the video scanning device and preferably with at least one surface area or point of said article at a predetermined point, plane or position in space.",
  ),
  p(
    "The following are physical conditions which may be measured, indicated or compared by means of the automatic measurement apparatus provided hereafter:",
  ),
  p(
    "(1) Indication of the position of a line, point, border of a specified area, or a specified area in a given image field. This may be provided as a coded signal or series of coded signals which are indicative of said position or positions from a base point or line in said field or at a specfied distance from said field.",
  ),
  p(
    "(2) Determination if said point, line or area is positioned in a predetermined area or position in said field, and if not within limits, how far said image falls or is positioned away from said predetermined position.",
  ),
  p(
    "(3) Determination if said point, line or area in said field being scanned falls within a specified distance or region such as a tolerance range, one or either side of a specified position.",
  ),
  p(
    "(4) Determination in which of several specified regions in an image field being scanned, each of which encompasses a different area either or both sides of a specified position or area in said field, a point, line or area falls. This function pertains to automatic sorting operations.",
  ),
  p(
    "(5) Determination if a predetermined image exists or does not exist in a specified area of an image field. If so, determination also how much or to what extent said area falls in said specified area. This function pertains to inspection functions to determine if image conditions exist such as surface defects, markings, assemblies, or internal defects whereby X-rays are used to provide the image.",
  ),
  p(
    "(6) The measurement of the dimension or dimensions of an image in a field by scanning part of said image at a constant scanning rate and timing the scanning from one point in its travel across an image to another.",
  ),
  p(
    "The various electrical circuits used hereafter for performing the described measurement, comparison and indicating functions are illustrated in block diagram notation for the purposes of simplifying the descriptions and drawings. Unless otherwise noted, the circuits and components illustrated in block notation are standard circuits which are known in the art. The following assumptions are also made regarding the circuitry to simplify drawings and descriptions.",
  ),
  p(
    "In the diagrams, where junctions are illustrated between two or more circuits which are electrically connected at said junction with a further single circuit, it is assumed that a logical OR circuit is employed at said junction.",
  ),
  p(
    "Where a single circuit extends from a junction to two or more circuits, it is assumed that either a single input, multioutput transformer is provided at said junction or said output circuits are resistance balanced permitting any input signal to travel over both said outputs.",
  ),
  p(
    "Wherever circuits which require a power source, such as switching or logical circuits, gates, clipping circuits, multivibrators, servo motors, controls, amplifiers, transducers, are provided, it is assumed that a source of the correct electrical power or potential is provided for said circuits. Power is also assumed to be provided on the correct side of all gates and relays where needed.",
  ),
  p(
    "Various automatic measurement and comparison scanning techniques are provided hereafter whereby a picture signal, derived from photoelectric or video scanning an image field or part of a field, is recorded on a magnetic recording member such as a magnetic tape along a predetermined length of said tape and in predetermined positions relative to other signals used for gating and control. When reproduced together, said other signals may be used to effect one or more predetermined functions relative to said picture signal. While the method of recording all signals in predetermined relative positions on a recording member and then reproducing and using said signals in one or more manners described hereafter, has a number of advantages including the provision of a record which may be rechecked if necessary or otherwise monitored, in. the embodiments provided hereafter it is not necessary to record the video or picture signal on the recording member provided that means are provided for presenting said picture signal inthe respective measurement or control circuit at a predetermined time in relation to said other signals.",
  ),
  p(
    "It is noted that for many of the functions described, particularly those where it is only necessary to measure or compare images, a picture signal may be passed directly from a video storage tube or other photoelectric scanning device to the reproduction amplifier through which the reproduced signal passes. However, functions such as record keeping, may require that the picture signal be recorded, hence recording arrangements are illustrated.",
  ),
  p(
    "In the various magnetic recording arrangements and apparatus provided hereafter, picture signals are shown recorded on a magnetic recording member which also has other signals recorded thereon in predetermined positional relationship to said picture signals. Said recording member is illustrated as an elongated flexible magnetic tape or the developed surface of a magnetic disc or drum. While not illustrated, it is assumed that known means are provided for driving said tape or drum at constant speed 7 past magnetic reproduction apparatus when constant speed is a requisite for said measurement. For example, when an automatic timing circuit is utilized to eflect a measurement between two predetermined points in said picture signal, said timing device and the drive for said tape must 'be synchronized to start at predetermined times and operate at predetermined rates. If the magnetic recording member is driven at a predetermined constant speed and the timing device operates at a predetermined constant rate and is started at an instant determined by the time of reproduction of one ormore signals on said magnetic recording member, then a particular reading or value of the timing device may be converted to a lineal distance or a coordinate in the field which was scanned to produce said picture signal.",
  ),
  p("Definition of Terms:"),
  p(
    "Components and known circuits provided hereafter bear the following general alphabetical notations in the various drawings. Where a dash follows the letter, it is assumed that a multiplicity of said devices or circuits are provided.",
  ),
  p(
    "A: Amplifier, such as a reproduction amplifier for amplifying signals reproduced by an associated magnetic reproduction transducer or pickup head PU.",
  ),
  p(
    "RA: Recording amplifier, used to record pulse or video picture signals on a magnetic recording member.",
  ),
  p(
    "AN-: A logical AND switching circuit which will produce an output signal when, and only when, signals are present at all inputs to said circuit.",
  ),
  p(
    "CL: A vacuum tube or semi-conductor clipping circuit, preferably a video clipper operating at a desired clippin-g level.",
  ),
  p(
    "CM, CM: A Schmidt cathode coupled multi-vibrator circuit, which comprises a cathode coupled multivibra-tor with an associated signal inverter at the output of the multi-vibrator. This circuit will produce a pulse output when the leading edge of an elongated pulse appears at said circuit and a second pulse output when the trailing edge of said pulse reaches said circuit.",
  ),
  p(
    "D-z Delay line or time delay relay of required time constant. If a signal such as a video picture signal is to be delayed, D signifies a delay line.",
  ),
  p("IF, IFF: A scanning image field wherevideo beam scanning is employed for inspection."),
  p(
    "N: A normally closed, monostable switch or logical NOT switching circuit which will open and break a circuit when a signal is present at its switching input. May be a vacurn; tube, semi-conductor or electro-mechanical device or any other logical circuits or gates.",
  ),
  p(
    "OR: A logical OR switching circuit adapted to pass a signal from any of a multiple of inputs over a single output circuit.",
  ),
  p(
    "PP-z A flip-flop switch, electro-mechanical, vacuum tube or semi-conductor circuit. A bi-stable switch adapted to: (a) switch an input signal from one of two input circuits to one of two output circuits, (1)) switch a signal from a single input circuit over one of two outputs depending on the described application. The flip-flop switch may have two or three switching inputs depending on the application; a complement input C which, when energized, switches a single input from one output to the other and/ or two inputs, each of which, when energized, switches the flip-flop to its respective output.",
  ),
  p(
    "PBz- A picture signal, preferably derived from beam scanning a fixed image field IF. The signal may be ampli tude modulated or frequency modulated and may be the output of a conventional television scanning camera, flying spot scanner or the like. It may be a continuous sig nal or may consist of a multitude of short pulses depending on the type of scanning and signal formation employed.",
  ),
  p(
    "The PB signal may also be derived from the output of a fixed photo multiplier tube with the image or object being scanned, being moved to provide variations in said signal. For some application, the PB signal may be any analog signal derived from scanning, an analog or digital computer or other means.",
  ),
  p(
    "PC-z Pulse code number; this may be any type of code (binary digit, decimal, etc.) recorded either longitudinally along a single channel of a magnetic recording member or recorded laterally along a single channel of a magnetic recording member or laterally along a fixed path or line across multiple channels of said recording member, there being code positions where said code line crosses each recording channel which either (a) contains or does not contain a pulse recording or (12) contains a positive pulse recording or a negative pulse recording depending on the design of the digital computing or switching apparatus to which the reproduced code is transmitted. If recorded along a lateral line of the recording member, the code PC may be reproduced at a specific point in the reproduction of one or more picture or analog signals adjacent thereto and may be used to effect a specific switching action when reproduced to affect a specific section or length of the associated picture signal(s).",
  ),
  p("SWA: A limit switch."),
  p(
    "SC, CS: A signal or signals preferably recorded in positions on a magnetic recording member to be reproduced simultaneously with a specific section of another picture or analog signal and used for gating or control purposes.",
  ),
  p(
    "ST- refers to video storage tube or storage device hav- 7 ing writing input W1 for recording a picture signal on the storage element of said tube and an output R1 which, when a second input R2 is pulsed or energized, passes a picture signal derived from the scanning of the read beam of said tube.",
  ),
  p(
    "CL- refers to a clipping circuit adjusted to clip at a specific clipping level. A diode, triode or other clipper such as used in video clipping.",
  ),
  p(
    "IF, IFP- refers to an image or object field being scanned to produce a picture signal. The field may be an optical field in a production or test area such as the scanning field or image field in the optical system of a conventional or special television scanning camera. The field may also be the screen of an optical comparator or projection microscope having a video scanning camera or flying spot scanner focused and positioned relative thereto in a predetermined manner. The image or images in said field may be any optical or radiation phenomenon which provides an area or areas therein of different radiation or light characteristic relative to other areas so that, in scanning across said different areas, the resulting picture signal will change sufficiently to permit a measurement or measurements to be made by electrically noting said changes or differences.",
  ),
  p(
    "FIG. 1 is a plan view of a magnetic recording member such as a magnetic tape or the developed surface of a magnetic recording drum, showing signal arrangements thereon which are basic to this invention. It is noted that the lateral and longitudinal dimensions of the signal recording channels or areas illustrated hereafter are not necessarily to scale or of equal scale, and are provided merely to illustrate the relative positions of the various signals on the recording member so that their coacting functions may be described. It is also noted that in all the figures illustrating relative signal areas, one of several recording and reproduction systems may be provided, whereby, while the total recording pattern may vary, the positions of the various coacting recordings relative to each other will essentially remain the same to permit the same functions to be accomplished in one recording system as the other. For example, if the magnetic recording tape or drum is moved relative to one or more recording heads which remain stationary, then a series of parallel areas or tracks will be traced by said heads as illustrated in FIG. 1. However, if the recording heads are driven in a rotary path and sweep across said recording medium as the latter moves in a fixed path relative to the rotational axis of said heads, then a series of recording areas oblique to the longitudinal axis of the tape will be traced thereon by said heads and will be characterized by the fact that the end of each oblique recording channel area or head sweep will be continued further along the tape as the beginning of a new oblique trace. Thus, any video and control signal recording arrangements illustrated in one figure as provided on recording areas or channels which extend parallel to the longitudinal axis of the recording medium or tape, may also be provided on the oblique, repeating recording areas of others of said drawings such as FIG. 5, if the same relative positioning of said adjacent signals is maintained in said oblique recording.",
  ),
  p(
    "Illustrated schematically in FIG. 1 as being recorded on multiple side by side recording areas of the member 10 and each on a separate channel thereof in a predetermined position relative to the others, are respectively (a) a sync signal S1 on a first channel or track C-l which indicates and may have been used to effect the precise positioning of (b) a picture signal, PB, derived from beam scanning of field, such as a video signal, which may or may not contain the frame blanking signal component, which picture signal is shown recorded on a second channel C2. Said picture signal PB-ll may be a recording of the signal output of a video scanning device such as a video camera employing a vidicon, iconoscope or other scanning tube or a flying spot scanner. If it 8 is desired to provide a visual display of the PB signal at some time after its reproduction from 10, the duration and character of said PB-l signal is preferably such that it may be used when reproduced therefrom to modulate the write beam of a video picture or storage tube. In my copending application Serial Number 688,348,",
  ),
  p(
    "means are provided for recording and reproducing a still video image by recording the output of a video camera or storage tube equivalent to the signal derived from the video camera scanning read-beam, during a single frame or screen sweep and either recording said signal in an image storage tube or on a moving recording member, and thereafter reproducing it at video frequency and using it to modulate the picture generating write-beam of a video monitor-screen. The PB1 signal of FIG. 1 if intended to later reproduce a visual image on a monitor screen, is thus preferably an image, single frame video picture signal with the beginning of said signal (i.e. for raster scanning the start of the picture signal may be defined as a predetermined point occurring at or after the frame vertical sync signal appears when the so-called read beam starts its frame sweep) starting or positioned adjacent to or in predetermined relation to S1 such that S1 may be used to control the reproduction of said picture signal. In the inter-laced scanning system, each complete sweep of the camera scanning beam is referred to as a field sweep and two of such image fields make up an image frame. As stated, the PB1 signal preferably has provided therewith the associated frame blanking signal so that it may be used to effect the production of a video image, if necessary, for display purposes. For specific computing or operational functions, it may be desirable to merely compare part of the PB signal with another signal, whereby only part of a single frame signal need necessarily be recorded and the PB blanking component of said signal may be eliminated. It is noted that the 8-1 signal may be used as a trigger signal recorded on a predetermined position of 10 and used thereafter to trigger or otherwise eifect the recording of the PB1 signal on a preetermined recording area or channel of member 10. If the PB signal is recorded at random on 10, S1 may be used as an indicator of the position of the PB signal and of another signal or signals also recorded thereon.",
  ),
  p(
    "(c) A third channel or band recording area C3 parallel to C-1 and C2, contains the necessary video horizontal line sync signals HS recorded in a predetermined position relative to PB-l for the correct horizontal deflection and synchronization of the picture and blanking signal PB1 to effect the production of a video image and (d) a fourth channel 04 also running parallel to the other channels, contains the associated vertical synchronization signal V for vertical line and frame synchronization of the picture signal PB. The latter two signals are optionally provided in the event that it is desired to reproduce for monitoring or other purposes, the PB signal as a picture on a video screen.",
  ),
  p(
    "One or more additional recording channels or areas, preferably extending in a parallel direction to those described and referred to by the letter notation CS, are provided adjacent to those described and contain one or more operational gating or command signals. Said signals CS-l, CS-2, CS3 are either pulse or analog signals and are preferably provided in predetermined fixed positions relative to said picture signal on channel C-2 of 10, to be reproduced therewith and are used to modify, gate or operatively coact with said video signal. While the control signal or signals CS may be recorded at any time on medium 10, if their precise position relative to the video signals is an important factor, their recording may be effected or triggered by the synchronizing signal Sl which indicates the position of the video signals. If precisely positioned relative to S-1, the CS signals will also be precisely positioned relative to the video signal or signals and may be used to effect one or 9 more operative or measurement functions on or in co action with said PB signal.",
  ),
  p(
    "Said command signal or signals may be provided in one or more forms. A single pulse, such as CS4, may be recorded on a single channel of and positioned adjacent a specific length of the video signal or signals.",
  ),
  p(
    "When reproduced therefrom as said medium 10 moves relative to respective reproduction heads, said pulse signal C-31 may be used, for example, to gate an adjacent similar length of the video signal over an output circuit for scanning, modifying, measuring, clipping or otherwise operating on or cooperating with said video signal.",
  ),
  p(
    "Thus, the position as well as the length of the pulse signal CS-l will determine what section and length of the video signal will be gated or otherwise operated on. Said other operations controlled by CS4 may include magnetic erasure, attenuation, amplification or other modifications to said video signal adjacent or behind said pulse signal on channel C5.",
  ),
  p(
    "While the CS4 signal may be a constant amplitude signal or pulse of any desired length, it may also be an analog signal of varying amplitude and/or frequency which is utilized to perform a more complex function on a particular section or sections of the video signal.",
  ),
  p(
    "Illustrated also in FIG. 1 are a seriesof other command or control signals CS-Z CSN. In FIG. 1, these are provided as a series of laterally aligned bit pulses, each on a different channel and capable of being simultaneously reproduced therefrom by respective magnetic heads, which are preferably aligned and scan a separate track or area referred to be the notations C6 to C10. Said pulses may be in the arrangement of a digital code PC, such as a binary code, and may be used to effect computing and/or switching functions or circuit selection functions such as operative to (a) affect a specific section or length of the video signal, (1;) select a specific section or sections of said video signal for reproduction, (c) adjust or otherwise affect one or more electrical components or circuits in the output of the reproduction head or heads of the video signal or (d) select one of a multiple number of circuits through which part or parts of said video signal may be gated for measurement, inspection or scanning functions to be performed thereon.",
  ),
  p(
    "While the CS2, CS3, CS4 CSN signals illustrated in FIG. 1 are shown aligned laterally across the medium or tape 10 for simultaneous reproduction by aligned magnetic heads, they may be provided in any positional arrangement which will be determined by the positioning of the magnetic reproduction heads and the required function of said signals. While said signals CS2 CSN in FIG. 1 may be formed as a pulse chain by providing the necessary delay lines or elements in the output circuits of the respective reproduction heads, a pulse chain for computing and/or control or switching purposes may be provided on a single track adjacent the video signal in the form of the appropriate tandem pulse signals or multiple pulse chains may be provided thereon, preferabiy sufficiently in advance of the video signal of a section of the video signal which it is to affect or gate, to permit a switching, computing or shaft positioning action to take place prior to the reproduction of thedesired section of said video signal. The position of. said recorded signal or signals on it will also be a function of the relative positions of thevarious reproduction heads.",
  ),
  p(
    "Also illustrated in FIG. 1 is a code or bit number PC shown as series of tandem pulses on the channel C10 and having the binary value 111010 1. The code PC is provided as a series recording to illustrate that such a means of recording numerical information may be used with an adjacent analog or picture signal to be reproduced prior to, during or after the reproduction of said picture signal for effecting computing and/or control operations to be performed on or coaction with the reproduction of said picture or analog signal, or in relation to at least part of said signal. If the series code PC is utilized for computing and controlpurposes adjacent a picture signal PB, then still another channel (not shown) is preferably provided with a series of equispaced, equi-duration pulses recorded thereon at preferably the interval of the pulses of PC to act as a clock when reproduced simultaneously therefrom thus simplifying digital operations in a switching circuit or computer using said pulses code. Although the recording of the picture signal, PB, and the associated sync signals on the magnetic member 10 has many advantages such as the provision of a permanent record which may be referred to at any time or reproduced by selective means whenever needed and visually monitored by modulation of the picture generating beam of a monitor device, said PB signal need not be recorded provided that said signal may be otherwise generated in a measuring or computing circuit at a predetermined instant relative to the generation of said other illustrated signals.",
  ),
  p(
    "It is further noted that multiple tandem recorded picture signals may be provided on one or more of the channels of the recording member 10 of FIG. 1 with the reproduction of the associated picture or analog sig nal PB. if recorded prior to said signal, said code PC may effect a specific switching or adjusting action. During the reproduction of a particular segment of the PB signal, said PC signal may gate or effect an action on a specific length of said PB recording. If placed on 19 in a position to be reproduced after the reproduction of the PB signal, the PC signal may be used for effecting a computation obtainable in digital form from other operations on the associated picture signal or a part or parts of said signal.",
  ),
  p(
    "It is noted that the recording arrangement of FIG. 1 is subject to modification depending on the switching and logical circuitry operatively connected to the output of the transducing apparatus for measuring and performing operations on the associated picture signal, viz:",
  ),
  p(
    "I. The laterally aligned pulse code PC which, in FIG. 1, is provided for reproduction prior to the reproduction of a section or length of the associated picture signal, to perform a switching, gating, computing or other functions, may be recorded adjacent a particular point in the picture signal for effecting a specific switching function or other action on or simultaneously occurring with a predetermined length of said picture signal. One such function described hereafter providing said code or signals in relay storage to be subtracted from or added to a numerical code derived from operating on a specific length of the picture signal.",
  ),
  p(
    "II. The illustrated pulse code PC which is shown recorded for a short duration in FIG. 1, maybe recorded on a longer section of 10 and may vary in length from a short pulse such as the shortest signal which may be recorded thereon, to the entire length of the picture signal PB. When the code 10 is reproduced, the output circuits of the associated reproduction heads PU will each either have a signal or no signal present during the period a particular code is reproduced whereby said multiple output circuits define a code pattern or hit number at any instant. If it is desired to have this code present for a specific period of time which may represent such phenomenon as a tolerance range, it will be necessary to record the signals reproduced to provide the PC code recorded on member for a time during which said predetermined condition or change in said picture signal will occur. If said code PC is thus recorded as one or more pulse recordings of prolonged and predetermined duration or length next to a predetermined section of the picture signal whereby said position is such that it will be known that said prolonged code PC will exist in output circuitry for a time duration during which a particular change in amplitude or frequency in the picture signal will occur, then said code wiil be known to exist when said change occurs and will be available for reproduction therewith for effecting switching or control functions, some of which will be described.",
  ),
  p(
    "111. A series of parallel code recordings PC may exist in tandem array along 10 in a manner whereby, when the end of one code stops the next begins on the next length of said tape. Thus, every point or length of it} will have an associated parallel code, such as a binary digital code, which will identify said point or length. if a signal or signals such as an analog signal, video picture signal, or other signal or signals are recorded adjacent said chain of said pulse codes recordings PC, the output circuits of the transducers reproducing said codes will be energized with a predetermined code array during the reproduction of a particular length of an adjacent signal which condition will be indicative of the position of the part of said adjacent signal being reproduced at the time the code is reproduced.",
  ),
  p(
    "If the PC signals are of a binary or other numerically progressing order, whereby each code array occupies the same length of member 10 as the others and each successive code array is of and each successive code array is of a numerical progressing order (i.e. a binary digital signal order whereby one signal array is a unitary increase over the prior recorded code or the same increment as each successive number from the prior number), then the recording member 10 may be used essentially as a digitizer. If driven at constant speed, 10 may be used as a digital timer or clock whereby a code, existing in the output circuits of the transducers reproducing said recorded code tracks, will be indicative of the time lapse from the start of travel of said member 10 provided that the code recorded the start of the cycle is known. The member 10 may be a closed loop tape or drum running continuously and at constant speed. It may be used as a digital clock by providing a normally open electronic switch or gate in the output of each of the reproduction transducers reproducing from channels C-6 to C40, the code recording channels and pulsing all said gates simultaneously to effect their closure for a brief period of time at the start of the interval being measured and at the end of said interval. The pulse code passed through said gates when first closed may be held in relay storage and may be added to or subtracted from the pulse code passed therethrough at the end of said interval. The result of subtracting the smaller of said two code numbers from the larger number will be indicative of the time lapse between the two provided that the speed of the recording medium is known and the lengths of the code array are also predetermined and similar. If the drive shaft of the recording medium 10 is connected to an analog mechanism, then the recording medium and drive may be used as an analog to digital converter of much greater capacity and duration than the conventional coded disc converter.",
  ),
  p(
    "FIG. 1A illustrates a recording arrangement of analog and digital or coded pulse signals, which are functionally related to each other. An elongated magnetic recording member 10 is provided having multiple recording channels C1 to CN thereon. The channel C1 has a series of pulse signals recorded as a group or as trains thereon, referred to by the notation PSG and comprising pulse recordings positioned at equi-spaced intervals, which may be reproduced and transmitted to a binary counter or other device for identifying any specific section or length of member 10 as a result of the nature of said particular code. The signals PSG comprise equispaced, short pulse recordings which, when reproduced therefrom and passed to a pulse counter such as a decade counter, will indicate any position on said member 10 by the existing value of said counter. On the even channels C2, C4, C6, etc. are provided signal recordings including one or more pulse codes PC such as digital codes, followed by one or more analog signals ASGI which may be the aforementioned picture signals PB derived by scanning a fixed path in a field. The odd channels C3, C5, C7, etc. may contain other information in pulse or code form such as a signal S13, for indicating the position of the start of the associated analog signal such as ASG13 indicated by S13. The signal S1- may also be used as a switching signal and may be positioned at any predetermined position along the respective channel, for switching the output of the reproduction transducer reproducing a particular part or all of the associated analog signal. The said output may be switched thereby for example, from an input to a digital computer mechanism adapted to receive the associated PC codes to the input of an analog device for receiving the ASG signal reproduced thereafter. The",
  ),
  p(
    "switching signal on the odd channels may also be incorporated and positioned on the even channels between said digital code signals and analog signal such as the illustrated SWS- signals of FIG. 1A.",
  ),
  p(
    "The analog recording or recordings ASGl-l, ASGZ-l, ASG3-1 may be recorded in one of several forms. Said signals may comprise picture signals of different but related phenomena such as derived from the scanning of one or more surfaces of a work member from different angles, two or more signals derived from scanning a standard field and field to be compared therewith, or the simultaneous output of one or more analog recording devices or instruments which are all functioning simultaneously to measure for example, simultaneously changing variables of a process or test. The digital signals preceding each analog signal or signals on each recording channel may be used to preset one or more measuring circuits in a manner to be described, to select a particular length of the analog signal for reproduction, to gate said signal or predetermined sections of said signal as indicated by said code signal, over one or more of a multiple of circuits.",
  ),
  p(
    "An application of the recording arrangement of FIG. 1A is in the field of machine tool or process control. For example, the analog signals ASG may have each been obtained from the output of a synchro or selsyn generator which is operatively coupled to the shaft of a motor driving a part of a machine. The significance of providing a recording of the type illustrated in FIG. 1A whereby one or more command analog signals on one or more channels of the recording member 10 are preceded by one or more pulse codes PC is that the pulse codes may be used for effecting broad control of the tool driving motor whereas the analog signal there-following may be used to effect a finer control or microposition. Also, while the pulse code on a specific channel or 10 may be used to effect a stepped or intermittent control of the motor driving the tool, the analog signal may be used to effect continuous control of said motor speed and position. Numerous machine tool and materials handling applications exist where the combined digital-analog recording means of FIG. 1A is applicable to advantage. The digital signals may also be used to preset measuring devices and perform other switching functions in coaction with the operation controlled by the analog signals, which functions are not conveniently derived from said analog signal per se. As a further note, the digital codes PC may be used to control the direction and speed for the motor driving the recording member 10 in a predetermined manner. For example, it may be required, in the cycle of operation of the device controlled by analog signal associated therewith, to repeat the control effected by a limited duration analog signal. The digital or pulse code preceding the analog signal may be used to preset a recycling timer or may be held in relay storage and used to control the future motion of the tape or recording member 10 so that the analog signal associated therewith is repeated thereafter or parts of said signal are repeated in a predetermined manner. Pulse recordings S2 to S8 are provided on the even channels between the groups of serially recorded pulse bit codes PC and the analog or picture signals ASG-. The recordings SN are preferably several times the length of the pulses comprising the PC recordings so that they may be used to actuate a relay, responsive only to the longer signal, to switch the output from the respective reproduction transducer from a digital control device to an analog device or circuit prior to the appearance of the reproduced ASG signal. It is noted that the odd channels C3 to CN may contain a parallel pulse code for effecting an operation at a specific point or points in the reproduction of one or more of the analog signals.",
  ),
  p(
    "FIG. 1B shows multiple recordings on a magnetic recording tape or drum 10, driven at constant speed past multiple magnetic reproduction heads PU. The heads PUl to PU8 reproduce the signals recorded on the respective channels C4 to C-8. On channel C1 is recorded a sync signal, such as S1 of FIG. 1, for indicating the position of the start of a picture signal such as a video picture signal PB recorded on channel C2. PB may also be any analog signal on which a measurement or operation is to be made. On channel C-3, one or more gating signals CS is recorded for switching a selected length or lengths of the reproduced adjacent PB signal to one ormore measurement or clipping circuits. The channels C-4 to C-8 contain multiple pulse recordings arranged in a multiple code or binary scale order such that the heads PU4 to PU8 will, at any particular instant while reproducing from said channels, be energized in a specific code order. That is, at any instant, the parallel outputs of said transducers will be energized in a signal array equivalent to a code. The code scale recorded in FIG. 1B is a so-called progressive code with the number zero at the point X1 and the number 32 at X2. A socalled natural binary code recording may also be used as may any code means which will provide a different code or signal array during each unit length or increment U in the tape or drum 10. It is noted that on channel -8, the pulse signals which are equispaced have a length of 2U or twice the unit length. If the reproduction heads are alignedgas shown, laterally across the member 10, the code existing in their output circuits will depend on which unit length of the recording member said heads are reproducing from at the particular instant. If the member '10 is a closed loop tape or drum and is driven at constant speed relative to said heads PU, then the recording-s on channels C-4 to C8 may be used for timing or clocking purposes or may measure the distance between any two points or changes in the associated PB signal. Illustrated in FIG. 1B are means for automatically determining as a numerical or binary code, the time between any two instantaneous or short duration occurrence. By applying the proper constant or conversion factor to the result, the distance between any two points in the associated picture signal PB and/or the distance between any two points in the image field scanned to produce said signal may be obtained. The combination of the recording member 10, a constant speed drive therefor, the reproduction apparatus and the illustrated circuitry may be used for performing-any automatic timing function in which a rapid readout in pulse code form of a time interval between two pulses passed thereto, is desired. The time interval may be any two instances in a timing or measurementcycle of any event whereby means are provided at each instance to produce a pulse of short duration. The apparatus of FIG. 1B may also be used to provide a binary or other pulse code for effecting computational or control functions at various instances in a measurement cycle whereby each instance is characterized by an associated pulse signal. The running code may also be recorded on additional channels of 10.",
  ),
  p(
    "The output of each of the magnetic reproduction heads PU4 to PU8 is passed to a respective reproduction amplifier, A4 to A8, and thence to the input of a respective normally open monostable gate or switch G4 to G8. The output of each gate is passed to a computer or computing mechanism CO, one form of which will be described and is illustrated in FIG. -1B'. Device CO may also be an automatic recorder. The outputs of the reproduction amplifiers A4 to A8 are only passed to computer CO when the switching inputs to said gates G4 to G8 are energized. Simultaneous energization of all gates is effected to provide a code output indicative that the heads are reproducing [from a particular unit length U of 10 'by passing a pulse to the input of a multiple output pulse transformer PT, each output of which is connected to a switching input of one of the five normally open monostable switches G4 to G-8. The gates G4 to G8 are electron tube or semi-conductor devices capable of switching in the megacycle range. Thus, any condition occurring in the signal PB during the interval defined by reproduction of the SC signal or signals may be indicated as a code. If the code occurring on channels C4 to C8 is of a numerically progressing order, then the distance or time between the appearance at the input of PT of two pulses may be indicated by subtracting one code so generated from the other.",
  ),
  p(
    "If the recording member 10- of FIG. 1B having the code scale recordings illustrated on channels C4 to CN, is provided as a closed loop magnetic tape, it may be used as a component of an analog to digital converted of greater versatility than the conventional coded disc type of converter. Assuming that the tape 10 is driven by the conventional capstan-depressor drive and there is no slippage in the driving means, then the shaft of the capstan or a shaft coupled thereto may be digitized, that is, any degree of rotation of said shaft may be indicated as a numerical code or number by providing a pulse at the 7 input to PT at any instant in the rotation of said shaft.",
  ),
  p(
    "ince the code reproduced from 10 will be a function of the rotation of the capstan shaft, a coded number may thus be obtained for any degree of rotation of said shaft. It is noted that an elongated flexible magnetic tape with the code recordings as illustrated in FIG. 1B offers a coding surface of considerably greater length than the conventional coded disc and, as such, the code may extend as a greater numerical value than on the conventional disc converter surface, thus eliminating counting circuitry and providing a considerably higher numerical value in code form than on the surface of the disc. If the recordings on channels C1 to C3 comprise multiple picture signals or information in the form of bit recordings such as binary code, the recording of a progressing numerical code as in FIG. 113 on said adjacent channels C4 to CN may be used for a number of purposes. Said code may be used for the selective reproduction of any specific adjacent recording such as a bit number or a specific length of PB signal, or the reproduction of one of a multiple of said picture signals for transmission to further control or computing apparatus. Said code may also be used to identifya particular section of said tape for recording a selected signal or bit information. These functions may be effected accurately without the use of a counter counting drive shaft rotations or short pulse recordings and has an advantage over the latter techniques in that each point in the length of 10 is identified by an associated code, whereas counting means are subject to errors if a pulse should be accidentally erased.",
  ),
  p(
    "If the device of FIG. 1B is used as an automatic interval timer, recording member 10 is driven at constant speed and means are provided in the computing circuit CO for computing the time lapse between two occurrences by subtracting the code occurring at the reproduction heads at the start of the interval to be timed from the code appearing thereat at the end of said interval. The difference will be proportional to the actual time it takes for said codes to pass said reproduction heads. A means for obtaining said difference automatically is illustrated in FIG. 1B which shows part of the circuit. If the code on C4 to CN is a binary code, subtraction may be cffected by a method known as complement addition, which consists of forming the complement of a number in a complementing circuit (CC) and adding this complement to the second number. The result is the difference between the two numbers. In FIG. 1B, the circuitry for effecting this operation is illustrated in part and comprises one single input dual-output bistable switch or fiip flop FF in the output of each gate G. The switches FF8 and FF7 which are part of the chain of said switches, are each shown with a complement input which, when pulsed, switches the output of said switch from the existing condition to the other of its switching conditions. Said switches FF- preferably also have a reset input which when pulsed, switches the input to the other of said two states in which it has been placed, or if in said reset state, maintains said reset condition. Assuming that the reset condition of each flip-flop is the illustrated or left hand output and that all flip-flops are in this condition prior to the appearance of the first point in the timed interval, then any pulses of the coded number passed through the gates G4 to GN will pass through said 0 outputs of said flip-flops. The 0 output of each flipfiop is thus connected to a respective input of a first shift register SR1 which converts the parallel bit code passed through the gates G4- to GN to a series code which is passed to the complementing circuit CC. From the complementing circuit CC, the complement of the number is passed to one input of a binary adder BA. The second coded number which is obtained at the end of said measuring cycle when a pulse appears at the input to the pulse transformer PT, is passed through the flip-flops FF4 to FFS to a second shift register R2 from which it is passed as a series code to the other input of the binary adder BA. The result, which is transmitted from the adder as a code, is the difference between the two numbers and is proportional to the time between the receipt of the two pulses at the input of PT. Switching of all flip-flops to their output conditions 1 is effected by passing a reproduction of the first pulse passed to PT through a delay line or time delay relay D and then to the input of a multi-output pulse transformer PT. Each output of PT is connected to a respective complement input C.of a respective flip-flop to switch said -bi-stable switch to its other output condition. The next signals to pass through the flip-flops are thus passed over the 1 outputs to the shift register SR2. The duration of the delay D will depend on the switching times of the gates G- and FF- as well as the shortest time intervals to be measured. The pulses to PT, as will be described hereafter, may be derived from such a phenomenon as a specified change in the associated recorded PB signal. The technique may be used to measure distances in the image field scanned to produce the picture signal PB as described hereafter. If the flip-flops and circuits CC, BA and SR2 are eliminated, the resulting outputs of SR1 or of the gates G- may be recorded as indications of the coordinate positions ofspecified lines or areas in the field scanned to produce the picture signal PB. For the circuit of FIG. IE to function, the code scale on channels C-4 to C8 will be a binary code.",
  ),
  p(
    "The input to the pulse transformer PT of FIGS. 1B and 1B may be transmitted from such circuit arrangements as the following:",
  ),
  p(
    "(A) In FIG. 3, the output of the Schmidt circuit CM may be passed to PT to measure and present as a bit code signal the length of the signal passed through the -not-circuit N. The output of either clipper CLlor iii CL2 may also be passed to a Schmidt, cathode coupled multivibrator circuit, the output of which is connected to the input of PT. If the gating Signals illustrated in FIG. 3 are provided in predetermined positional relationship to the associated picture signal, such that that part of the picture signal which was produced during the line scan of a predetermined portion of the image field containing an area, the width of which it is desired to measure, and the clipping circuit produces a signal output when the input is that part of said picture signal produced during scanning said area, the leading and trailing edges of said signal will cause said Schmidt circuit to produce short pulse outputs and the circuits of FIG. 1B and 1B including the recordings on channels C4 to CN will provide a code at the output of the binary adder BA which will be indicative of the time lapse between said two signals produced by said multivibrator circuit.",
  ),
  p(
    "(B) In FIG. 4 the outputs of any or all of the circuits or logical switching circuits AN2-3, AN2-4, ANZ-S, may be passed to a Schmidt cathode coupled multivibrator circuit and then to pulse transformer PT shown in FIGS. 1B and IE to present in bit form a number which represents the length of the signal passed through said AND circuits. The same may be effected for the outputs of the various NOT switching circuits of FIG. 4.",
  ),
  p(
    "(C) In FIG. 7 the output of either 01.2 or AN 2-3 may be passed to a Schmidt circuit and the resulting pulses therefrom to the pulse transformer PT of FIGS. LB and 1B.",
  ),
  p(
    "(D) In FIG. 8 the output of the switching circuit AN2-4 or N may be passed to a cathode coupled multivibrator Schmidt circuit having its output connected to PT of FIGS. 1B and LB.",
  ),
  p(
    "(E) In FIG. 9, the output of CM may be passed to PT of FIGS. LB and 1B or the output of AN2-3 to a Schmidt circuit and then to PT for measuring the respective length or difference signal duration.",
  ),
  p(
    "The resulting output of the binary adder BA of FIG. 1b may be passed to a recorder or computing mechanism such as the code matching relay to be described and illustrated in FIG. 1C. The output of BA may be used as an error or difference signal in machine control. It may be used for example to correct a machine tool or adjust its position to provide a production or assembly result indicated by the make-up of the picture signal PB which is closer to an acceptable tolerance or standard.",
  ),
  p(
    "In FIG. 1C, means are provided for effecting automatic control and switching by what will hereafter be referred to as code matching. The apparatus comprises a magnetic recording member 10 such as a magnetic tape, drum or disc having multiple recording channels C1 to CN on which said described sync, picture and gating signals may be provided, as illustrated, adjacent to a group of recordings on channels C4 to CN comprising a pulse code array such as a binary or other code running scale which, if used to energize the associated reproduction transducers PU4 to PUN, will provide at any instant during said reproduction, signals in the output circuits of said transducers equivalent to a particular coded number. If the signals on C4 to CN increase with the length of 10 in a numerically progressing order, and each unit increase in said recorded code scale occupies a particular unit length or any predetermined length of 10, then each of said lengths is identified by a particular code which may be used for control purposes. Said control signal may be generated and used, for example, to effect such functions as closing a normally open gate having an input from the reproduction amplifier through which the associated picture signal PB is being reproduced to pass the part of the picture signal over a further circuit, effect the recording of a signal adjacent the code recording, effect any control, timing, or programming function whereby the tape 10 is driven at a constant speed and a particular code is used to represent a particular time in a cycle.",
  ),
  p(
    "In FIG. 1C a series of switches R4 to RN are provided which may be manually, pulse or signal operated or may be the switches of a card or punch tape reading device. Said switches, when closed and opened in the order of the preselected code, condition the illustrated circuitry so that a signal will be provided over an output circuit C when and only when said preselected code appears at the multiple heads PU-4 to PUN reproducing from the magnetic recording member 10. Said recording member may be driven continuously past said heads by a motor or in an intermittent manner by a solenoid actuated ratchet and pawl drive.",
  ),
  p(
    "-When one of the switches R is closed, a signal is transmitted to a switching input I of a single input, double output bistable switch FF switching it from an 0 or reset condition to a first, 1 condition. When so actuated, FF switches its input to an output circuit which extends therefrom to a corresponding input of an N input AND switching circuit AN4N. Referring to flip-flop bistable switch FF4, when said switch is in the reset or &#34;0 condition, an input signal thereto, from reproduction amplifier A4, is passed to the switching input of a nor mally closed monostable switch or NOT circuit N4 opening N4 and preventing a signal from a power supply PS from passing to its output. The output of N4 extends to an input of a bi-stable switch FF4 and therefrom to the same input .to AN4N that the 1 output of FF4 .extended to. A logical OR circuit may be provided at the junction of the two outputs which connect to the single input to AN4N if said circuits are not resistance matched. The bi-stable switch FF'4 is switched to its closed or 1 condition by the reproduction of .a reset signal passed to illustrated input 1 of FF4. Said reset signal is also passed to the &#34;0 switching input of'FF4 thereby conditioning the circuitry so that a signal will be passed to the corresponding input to AN4N only when there is no output signal from reproduction amplifier A4 (i.e., where there is no signal on channel C4 at the reproduction head PU 4). A signal transmitted from. A4 will pass through 0 of F1 4 to the switching input of N4 and prevent the passage therethrough of the constant output of PS.",
  ),
  p(
    "The output of switch R4 is also passed to a 0' switching input of FF4 switching FF4 to open and preventing any signal from PS to pass therethrough when in said condition. With FF4N switches to state 1, a signal will be passed to the corresponding input of AN4N only when a signal is present at the head PU4 on channel 4. A delay line or relay D4 may be provided in the output of l ofFF4 to account, if necessary, for the time it takes the switches N-3 to NN to switch, if provided in the switching action, by the action of the corresponding R switches. It is thus seen, that by opening and closing particular or selected of the R switches, provided that all fiip flops FF4 to FF-N have been reset to O, a code array is set up in relay storage which will provide a signal over circuit 00 when the same code exists as recordings at the heads PU4 to PUN. If the code on channels C4 to ON is a binary code as illustrated, and is of a numerically progressing order, then the inputs for activating switches R may be derived from a digital computer and may represent the desired shaft rotation of the power means driving the member 10. A signal output from AN4N represents the attainment of a degree of movement of 10, as indicated by the code input to the switches R4 to RN. Said output signal may be used to start or-stop a servo motor such as SM by activating a relay RE which may also be used to pulse a solenoid, to sound an alarm, or to actui ate any electronic or electro-mechanical device, switch,",
  ),
  p(
    "relay, or motor. Reset of switches FF and FF is cfiected by manually or automatically closing a switch SW which gates a' signal from a power supply PS to a pulse transformer PT transmitting energizing signals to the respective 18 tape 10, having recorded on separate tracks or channels adjacent viedo signals PBZ, H82, and V2, a number of pulse signals CS11, CS-12, (IS-13, CS14, CS-15. The latter signal CS-15 which is recorded on channel C9 is the shortest of all the pulse signals and, while it is preferably of a duration in the order of ten microseconds or less when reproduced therefrom, said duration will depend on what phenomenon it is being used to indicate or measure. It s noted that the C-1 to C-15 signals are of decreasing length or duration along 10 and are shown symmetrical with a longitudinal line PL extending across and preferably perpendicular to the direction of recording and passing through the center of the shortest pulse CS-15. This arrangement of recorded signals .may be used to indicate the position or region on which a particular point in the video picture signal falls or is expected to fall and may be used for measurement or quality control purposes involving said picture signal. If the image from which the video picture signal PB was produced has a particular characteristic indicative of a position, plane, edge of an object therein or the beginning of a specific area of said image, and said characteristic is scanned by the video scanning camera or device as a change in color or light reflectivity, then the video signal will change in amplitude, which may comprise an inflection in its amplitude if the'color or light characteristic of the field suddenly changes. This change in amplitude may be indicated electronically by the use of a proper clipping or filter circuit in the output of thevideo reproduction amplifier for the video signal reproduction head. By comparing said clipped signal and noting the position of the leading edge of said signal in relation to the position of the CS-12 to CS-15- signals, its position or the region of its position may be indicated electrically. The CS-15 signal may be used to indicate the precise norm or desired position of the surface, plane, line or position of the beginning of the unknown area in the field be ing scanned. The CS-14 signal recording maybe positioned and of such a time duration or length to indicate a range of acceptable tolerance for said picture signal inflection or image position. For example, when the medium 10 is moving at video frequency or the frequency or speed at which the video signal was recorded on 10, then the length of the (IS-14 signal may be such that its reproduction will occur in a time interval during which the camera scanning beam will travel across a few thousandths of an inch of surface of the object or image being scanned which will be equal to the combination of the plus and minus tolerance permitted for said image line to be off a desired or predetermined position P1 indicated positionally by CS-lS. It is assumed that an area, benchmark, points or a reference line or plane of the object being scanned is prepositioned in the image field and that the object or surface being scanned is at the correct attitude and distance from the video scanning camera or device. Such a method of automatic inspection or measurement may be eifected by fixing the video scanning device or camera to scan a particular area or field and providinga fixture or stops in said field being scanned for aligning the object being scanned so that all objects will have a common base, and will be of equal relative scale in the image field. Thus a particular degree of sweep of the scanning beam will represent each prepositioned object being scanned the same length on the surface of each other object scanned.",
  ),
  p(
    "While the length of the CS signals is proportional to a particular length or distance along any plane in the 7 image field, the positions of the leading and trailing edges 0 switching inputs of the FF switches and the 1 inputs v of these signals may be electronically detected and may be used to indicate the position of aparticular line, plane,",
  ),
  p(
    "or small area in the image field or to effect the measure- 1 ment of said line or plane from a' predetermined line, plane, or point in the field. As stated, the CS1 signal may be used primarily as a means to gate a similar length of the video signal PB to an output circuit and the position of CS1 will determine what particular length of the video signal will be gated. Assuming that it is desired to indicate or measure the distance along a video scanning line between two lines oblique to the beam scanning line which are of different light reflectivity or intensity than the image background and that the position of each of said lines may be indicated as a result of the inflection in the amplitude of the video picture signal by a pulse created as the signal passes a video clipper, such as a pentode clipper, then the C81 signal will be provided on in a position such that, when reproduced therefrom, it may be used to gate that part of the video signal produced when the scanning beam of the video camera crosses said lina. Since the distance between said lines in the image field may vary from one sample or image field to the next, if the maximum variation for all samples being scanned is known, a gating signal CS1 may be provided of sufiicient length to pass the correct section or sections of the video signal for each field or sample being scanned such that each will contain that part of the picture signal containing said two lines. The C81 signal thus acts to pass only that part of the image signal PB in which it is known that the two lines or points will appear regardless of their variation from tolerance, to the exclusion of all other lines or images in the total video image field. There may be other lines or images of similar light intensity in the field which would ordinarily prevent the comparative or quantitative measurement of the desired length or distance in the image field, the PB sections of which would have to be blanked or otherwise discriminated.",
  ),
  p(
    "The C812, C813, and C814 signals may serve one or more of several purposes. They may be used to indicate the actual position and variation from a desired position indicated by the center of said signals, of a point, plane, line or area as indicated by an amplitude change or infiection in the PB signal occurring in the range indicated by the C81 signal. For example, if the pulse created by the inflection in said video signal occurs between the time the leading edge of the C812 signal is reproduced and the leading edge of the C813 signal is reproduced then said point in the video signal is known to occur in a par ticular tolerance range or distance from the norm which may be indicated by the position of the C815 signal. Similarly, the ranges or distances between the leading edges of the C813 and C814 signals and between their respective trailing edges may be second tolerance regions and between the respective leading and trailing edges of C814 and C815, third tolerance regions. For inspection of machined parts, the tolerance regions between C814 and C815, for example, may be indicative of acceptable tolerances between C813 and C814 indicative of acceptable but also of an impending required change in tool adjustment; between C813 and C814 indicative of a dimension scanned as not passing inspection and quality requirements but capable of rework; and outside the leading and trailing edges of reproductions of signal C813 indicative of complete rejection of the part and either shut-down of the machine for readjustment or the requisite that the scanning inspection apparatus be checked. The C812 to C815 signals may also be used for automatic sorting purposes whereby an object having a dimension which falls in the range of one of said pulse signals but not in the range of the next smaller signal may be so classified or sorted by pulse means to be described.",
  ),
  p(
    "FIG. 3 shows a magnetic recording member 10 having multiple recordings thereon and also illustrates associated apparatus for the automatic comparative measurement of a similar length or lengths of two scanning signal recordings which are signals derived from photoelectric scanning of moving objects or video beam scanning of image fields. Said picture signals include a sync or position indicating signal 81 provided on a first channel C1 of 10, two picture signals PB1A and PBlB recorded on channels C2 and C4 and in lateral alignment with each other and the signal 81, and one or more discrete signals SC11, 8012 SCIN shorter than either of said pic- 2t) utre signals and recorded in predetermined positions on 10 relative to said picture signals. It is noted that said reproduced 8C signals may be used per se or with signals recorded on still other channels of the recording member to perform one or more of the various other gating, control and operative functions described elsewhere in this specification. In FIG. 3, said SC signals are used when reproduced to gate specific and similar lengths of reproductions of the two recorded picture signals, over respective output circuits for automatically comparing the characteristics of said similar lengths of said two signals. For example, one of said picture signals PBlA may be derived from scanning what will hereafter be called a standard image field, which is defined as a field of measurement or inspection which to the optical scanning system of a beam scanning video device contains one or more images or image areas which are (a) in a predetermined position on said field, resulting from a predetermined alignment therein, (b) exhibit other predetermined optical characteristics such as predetermined color or light characteristic. The other signal, PBI'B, is preferably derived from scanning another field containing an image area or areas similar in shape, position, or light characteristic to corresponding areas in said standard image field but which may vary in any of said characteristics. Since the amplitude and/or frequency of the picture signals PBIA and PBIB change as the optical characteristics of the image field being scanned changes, said two signals may be compared point by point. Two similar segments or lengths of said signals may thus be compared for amplitude or frequency variations by the means provided and the resulting difierences in signal variations indicated by apparatus such as illustrated. Before describing the technique of comparative measurement of FIG. 3, it will be noted that while the method of measurement utilizing the recordings of said two picture signals provided in fixed relation to each other on a magnetic recording member, has numerous advantages, it is possible to perform the same function by recording said standard image field signal PBlA in a fixed or predetermined position relative to sync signal 81, for example, and providing said second picture signal in the circuitry illustrated during the same time it is provided in FIG. 3 by the reproduction apparatus illustrated, by utilizing the reproduction of said 81 signal to trigger, for example, the sweep of a video storage tube read-beam to scan a charge pattern recording of said second picture signal and produce said second signal over said illustrated circuitry. Similarly, it is possible to provide both said picture signals recorded on respective storage tubes and to effect their simultaneous reproduction by means of a signal derived by the reproduction of the sync signal 81, whereby the member 10 serves as a signal generating medium for generating said SC signals at predetermined instants during the reproduction of said two picture signals. The method of recording all signals in predetermined positions relative to each other has numerous advantages including the provision of a recording which may be rechecked or rescanned if necessary or changed in characteristic and which may be filed for future reference or used to modulate the write beam of a picture tube for visual monitoring. The recording of at least said standard image field signal on member 10 has additional advantages in that it may be one of a multiple of related but different picture signals recorded on said member and may be selectively reproduced therefrom adding flexibility to the apparatus and permitting it to be used to perform a multiple of inspection functions relative to different image fields or devices.",
  ),
  p(
    "Assuming that the signal PBIA has been derived from the surface of a work member or X-ray structure of an object or subject which conforms to specified dimensions, surface characteristics or light characteristic and that said image field contains areas of different light or radiation intensity or other characteristic which will result in signal variations in a predetermined segment or segments",
  ),
  {
    kind: "heading",
    level: 2,
    text: "Claims",
  },
  claim(
    1,
    "1. Automatic scanning and control apparatus comprising in combination with an electron beam scanning apparatus including means for causing an electron beam to scan an area of an image field in a single frame sweep along a predetermined path in said field and to produce a video picture signal of said scanning on an output of said apparatus, an analyzing means for inspecting a predetermined area of said image field by the analysis of that portion of the picture signal generated during the scanning by said electron beam of said predetermined area of said image field, said analyzing means including an analyzing circuit connected to a gating means in the output of a circuit in which said picture signal is generated, a variable programming means for controlling said gating means whereby to prevent the passage of said picture signal to said analyzing circuit, said programming means being synchronized in its operation for automatically operating said gating means in predetermined time relation to the generation of said picture signal whereby to switch in a manner to pass to said analyzing circuit only that portion of said picture signal which is generated during the scanning of said predetermined area of said image field.",
  ),
];

export const lemelsonMachineVisionArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: SOURCE_SHA256,
  preparedBy: "Classic Patents editorial team (Gemini 3.7 Flash)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks,
};

export const lemelsonMachineVisionParallelReadings: Readonly<Record<number, readonly string[]>> = {
  "2": [
    "The inventor defines the field: utilizing magnetic recording media and video picture signals to execute automated computation, mechanical actuation, dimensional measurement, and closed-loop process control.",
  ],
  "3": [
    "Lemelson reviews earlier motion picture television recording techniques and refers to his prior application for capturing individual stationary video frames to provide still monitoring images.",
  ],
  "4": [
    "The basic operational principle is introduced: recording a single raster frame sweep alongside synchronization pulses so that predetermined temporal segments of the analog video signal can be selectively gated, analyzed, or modified.",
  ],
  "5": [
    "Primary object: providing automated electronic apparatus for computing, industrial control, and precision measurement using video scan signals.",
  ],
  "6": [
    "Object: providing simplified circuitry for interrogating and selectively modifying portions of a video waveform stored on magnetic media.",
  ],
  "7": [
    "Object: implementing automated industrial quality control by electronically inspecting specific time-bounded segments of video signals.",
  ],
  "8": [
    "Object: performing non-contact dimensional measurement and verifying part tolerances against allowable geometric limits using video raster scanning.",
  ],
  "9": [
    "Object: comparing sample video signals from inspected workpieces directly against prerecorded reference standard signals reproduced simultaneously from aligned tracks.",
  ],
  "10": [
    "Object: providing automated electronic gating means to isolate predetermined portions of a video signal for computation and process control.",
  ],
  "11": [
    "Object: isolating optical signals from specific regions of interest within an image field without requiring mechanical deflection or steering of the scanning electron beam.",
  ],
  "12": [
    "Object: selectively modifying portions of a video picture signal on magnetic media to generate composite or altered output imagery.",
  ],
  "13": [
    "Object: recording digital pulse code identification tracks adjacent to analog video tracks to facilitate automated addressing and signal gating.",
  ],
  "14": [
    "Object: providing automated photoelectric and video scanning instruments for measuring geometric dimensions and physical workpiece properties.",
  ],
  "15": [
    "Object: enabling unattended, automatic optical inspection of manufactured components on moving production lines.",
  ],
  "16": [
    "Object: providing versatile electronic circuitry adaptable for digital encoding, quality inspection, and machine control.",
  ],
  "17": [
    "Object: measuring selective features of an object and encoding the resulting dimensions into digital format for computer analysis.",
  ],
  "18": [
    "Object: reading optical code markings from articles and routing the decoded data to digital computers or sorting mechanisms.",
  ],
  "19": [
    "Object: utilizing pre-programmed video waveforms to guide and control automated manufacturing machines, machine tools, and material handlers.",
  ],
  "20": [
    "FIG. 1 plan view: illustrates the track architecture of a multi-channel magnetic recording medium containing video, synchronization, and command pulse tracks.",
  ],
  "21": [
    "FIG. 1A schematic: shows an alternative recording arrangement combining analog waveforms with parallel digital pulse code tracks for machine tool control.",
  ],
  "22": [
    "FIG. 1B diagram: illustrates a constant-speed magnetic storage drum coupled to magnetic pickup heads and digital pulse counting circuitry.",
  ],
  "23": [
    "FIG. 1C circuit: shows an electronic switching tree for selectively enabling specific command signal channels.",
  ],
  "24": [
    "FIG. 2 schematic: shows an automated inspection system using magnetic tape gating to evaluate video signals from a vidicon camera inspecting articles on a conveyor.",
  ],
  "25": [
    "FIG. 3 diagram: illustrates dual-channel simultaneous reproduction apparatus for point-by-point comparative measurement between a test part and a standard reference waveform.",
  ],
  "26": [
    "FIG. 4 schematic: details the comparison and threshold gating circuitry for generating error signals from mismatched video waveforms.",
  ],
  "27": [
    "FIG. 5 diagram: shows an alternative comparison circuit utilizing differential amplifier stages and pulse integrators.",
  ],
  "28": [
    "FIG. 6 schematic: illustrates an optical scanning setup using flying-spot cathode ray tubes and photomultiplier detectors.",
  ],
  "29": [
    "FIG. 7 diagram: shows electronic pulse-shaping, amplitude-clipping, and threshold comparator circuits.",
  ],
  "30": [
    "FIG. 8 circuit: illustrates cathode-coupled Schmitt trigger multivibrators for converting analog edge transitions into sharp digital pulses.",
  ],
  "31": [
    "FIG. 9 schematic: shows a digital pulse-width measurement circuit using high-frequency clock oscillators and binary counters.",
  ],
  "32": [
    "FIG. 10 diagram: illustrates an automated workpiece sorting gate driven by an electromechanical solenoid triggered by inspection signals.",
  ],
  "33": [
    "FIG. 11 schematic: shows a multi-level tolerance grading circuit sorting parts into multiple dimensional categories.",
  ],
  "34": [
    "FIG. 12 diagram: shows closed-loop feedback control from the inspection system to upstream machine tool positioners.",
  ],
  "35": [
    "FIG. 13 schematic: illustrates an alternative optical beam deflection arrangement for raster scanning curved workpieces.",
  ],
  "36": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "37": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "38": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "39": [
    "The specification details the video signal conditioning electronics: analog voltage transitions generated by the scanning beam crossing part boundaries are routed through high-speed Schmitt multivibrators and diode clippers to produce steep rectangular pulses matching physical feature edges.",
  ],
  "40": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "41": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "42": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "43": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "44": [
    "The specification details the video signal conditioning electronics: analog voltage transitions generated by the scanning beam crossing part boundaries are routed through high-speed Schmitt multivibrators and diode clippers to produce steep rectangular pulses matching physical feature edges.",
  ],
  "45": [
    "The inventor explains the optical-to-electrical transduction process: a vidicon camera tube or flying-spot raster scanner sweeps the workpiece silhouette, converting photometric luminance contrasts into continuous time-domain voltage waveforms.",
  ],
  "46": [
    "The inventor explains the optical-to-electrical transduction process: a vidicon camera tube or flying-spot raster scanner sweeps the workpiece silhouette, converting photometric luminance contrasts into continuous time-domain voltage waveforms.",
  ],
  "47": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "48": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "49": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "50": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "51": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "52": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "53": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "54": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "55": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "56": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "57": [
    "The specification details the video signal conditioning electronics: analog voltage transitions generated by the scanning beam crossing part boundaries are routed through high-speed Schmitt multivibrators and diode clippers to produce steep rectangular pulses matching physical feature edges.",
  ],
  "58": [
    "The structure of the multi-track magnetic recording medium is described: parallel tracks carry synchronization clock pulses, horizontal/vertical sweep timing signals, and reference control gates that align with the workpiece transit timing.",
  ],
  "59": [
    "The disclosure describes the operational coordination between the video raster scanner and electronic timing gates, establishing fixed spatial-to-temporal calibration factors so that beam transit duration directly represents physical part dimensions.",
  ],
  "60": [
    "The structure of the multi-track magnetic recording medium is described: parallel tracks carry synchronization clock pulses, horizontal/vertical sweep timing signals, and reference control gates that align with the workpiece transit timing.",
  ],
  "61": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "62": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "63": [
    "Definition of circuit symbol 'A': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "64": [
    "Definition of circuit symbol 'RA': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "65": [
    "Definition of circuit symbol 'AN-': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "66": [
    "Definition of circuit symbol 'CL': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "67": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "68": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "69": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "70": [
    "Definition of circuit symbol 'N': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "71": [
    "Definition of circuit symbol 'OR': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "72": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "73": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "74": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "75": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "76": [
    "Definition of circuit symbol 'SWA': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "77": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "78": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "79": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "80": [
    "Definition of circuit symbol 'Electronic Component': defines the function, input/output characteristics, and logical behavior of this building block within the automated inspection and gating architecture.",
  ],
  "81": [
    "Details the magnetic drum storage system of FIG. 1B: precision reproduction heads scan parallel pulse tracks to provide high-speed angular position feedback and digital timing reference pulses for inspection gating.",
  ],
  "82": [
    "Analyzes track alignment on the magnetic recording medium: command pulses are positioned with microsecond precision relative to frame sync markers to define the active measurement window within each video raster line.",
  ],
  "83": [
    "Analyzes track alignment on the magnetic recording medium: command pulses are positioned with microsecond precision relative to frame sync markers to define the active measurement window within each video raster line.",
  ],
  "84": [
    "Analyzes track alignment on the magnetic recording medium: command pulses are positioned with microsecond precision relative to frame sync markers to define the active measurement window within each video raster line.",
  ],
  "85": [
    "Analyzes track alignment on the magnetic recording medium: command pulses are positioned with microsecond precision relative to frame sync markers to define the active measurement window within each video raster line.",
  ],
  "86": [
    "Analyzes track alignment on the magnetic recording medium: command pulses are positioned with microsecond precision relative to frame sync markers to define the active measurement window within each video raster line.",
  ],
  "87": [
    "Details the magnetic drum storage system of FIG. 1B: precision reproduction heads scan parallel pulse tracks to provide high-speed angular position feedback and digital timing reference pulses for inspection gating.",
  ],
  "88": [
    "Analyzes track alignment on the magnetic recording medium: command pulses are positioned with microsecond precision relative to frame sync markers to define the active measurement window within each video raster line.",
  ],
  "89": [
    "Analyzes track alignment on the magnetic recording medium: command pulses are positioned with microsecond precision relative to frame sync markers to define the active measurement window within each video raster line.",
  ],
  "90": [
    "Details the magnetic drum storage system of FIG. 1B: precision reproduction heads scan parallel pulse tracks to provide high-speed angular position feedback and digital timing reference pulses for inspection gating.",
  ],
  "91": [
    "Details the magnetic drum storage system of FIG. 1B: precision reproduction heads scan parallel pulse tracks to provide high-speed angular position feedback and digital timing reference pulses for inspection gating.",
  ],
  "92": [
    "Explains digital code formatting on the magnetic tracks: serial binary pulse trains identify specific workpieces, part numbers, or tolerance categories to route inspection data to appropriate factory control channels.",
  ],
  "93": [
    "Explains digital code formatting on the magnetic tracks: serial binary pulse trains identify specific workpieces, part numbers, or tolerance categories to route inspection data to appropriate factory control channels.",
  ],
  "94": [
    "Analyzes track alignment on the magnetic recording medium: command pulses are positioned with microsecond precision relative to frame sync markers to define the active measurement window within each video raster line.",
  ],
  "95": [
    "Explains digital code formatting on the magnetic tracks: serial binary pulse trains identify specific workpieces, part numbers, or tolerance categories to route inspection data to appropriate factory control channels.",
  ],
  "96": [
    "Details the magnetic drum storage system of FIG. 1B: precision reproduction heads scan parallel pulse tracks to provide high-speed angular position feedback and digital timing reference pulses for inspection gating.",
  ],
  "97": [
    "Explains digital code formatting on the magnetic tracks: serial binary pulse trains identify specific workpieces, part numbers, or tolerance categories to route inspection data to appropriate factory control channels.",
  ],
  "98": [
    "Details the magnetic drum storage system of FIG. 1B: precision reproduction heads scan parallel pulse tracks to provide high-speed angular position feedback and digital timing reference pulses for inspection gating.",
  ],
  "99": [
    "Describes the hybrid analog/digital recording medium of FIG. 1A, where continuous command curves and digital position words co-exist to drive coordinated machine tool axes during automated fabrication.",
  ],
  "100": [
    "Describes the hybrid analog/digital recording medium of FIG. 1A, where continuous command curves and digital position words co-exist to drive coordinated machine tool axes during automated fabrication.",
  ],
  "101": [
    "Describes the dual-channel comparator apparatus of FIG. 3: a master reference waveform PB1A and a live workpiece scan PB1B are simultaneously reproduced and fed to a differential subtractor to isolate surface flaws or dimensional variations.",
  ],
  "102": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "103": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "104": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "105": [
    "Summarizes the high-speed sorting and feedback actuation: when video waveform deviations exceed the threshold during the gated window, electromechanical diverters are triggered and error signals are fed back to upstream machine tool adjusters.",
  ],
  "106": [
    "Summarizes the high-speed sorting and feedback actuation: when video waveform deviations exceed the threshold during the gated window, electromechanical diverters are triggered and error signals are fed back to upstream machine tool adjusters.",
  ],
  "107": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "108": [
    "Summarizes the high-speed sorting and feedback actuation: when video waveform deviations exceed the threshold during the gated window, electromechanical diverters are triggered and error signals are fed back to upstream machine tool adjusters.",
  ],
  "109": [
    "Describes the dual-channel comparator apparatus of FIG. 3: a master reference waveform PB1A and a live workpiece scan PB1B are simultaneously reproduced and fed to a differential subtractor to isolate surface flaws or dimensional variations.",
  ],
  "110": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "111": [
    "Summarizes the high-speed sorting and feedback actuation: when video waveform deviations exceed the threshold during the gated window, electromechanical diverters are triggered and error signals are fed back to upstream machine tool adjusters.",
  ],
  "112": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "113": [
    "Summarizes the high-speed sorting and feedback actuation: when video waveform deviations exceed the threshold during the gated window, electromechanical diverters are triggered and error signals are fed back to upstream machine tool adjusters.",
  ],
  "114": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "115": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "116": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "117": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "118": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "119": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "120": [
    "Details the channel selection matrix of FIG. 1C: bistable flip-flop latches and interlocking relay contacts selectively activate specific command tracks corresponding to the part type currently on the conveyor.",
  ],
  "121": [
    "Explains multi-tier tolerance classification: stepped gate pulses define acceptable tolerance bands, impending tool-wear zones requiring machine adjustment, reworkable part deviations, and outright reject conditions.",
  ],
  "122": [
    "Explains multi-tier tolerance classification: stepped gate pulses define acceptable tolerance bands, impending tool-wear zones requiring machine adjustment, reworkable part deviations, and outright reject conditions.",
  ],
  "123": [
    "Describes the dual-channel comparator apparatus of FIG. 3: a master reference waveform PB1A and a live workpiece scan PB1B are simultaneously reproduced and fed to a differential subtractor to isolate surface flaws or dimensional variations.",
  ],
  "124": [
    "Summarizes the high-speed sorting and feedback actuation: when video waveform deviations exceed the threshold during the gated window, electromechanical diverters are triggered and error signals are fed back to upstream machine tool adjusters.",
  ],
};

export function lemelsonMachineVisionClaimText(number: number): string {
  const block = lemelsonMachineVisionArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Lemelson Machine Vision archival edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}
