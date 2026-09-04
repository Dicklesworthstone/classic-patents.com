import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const PATENT_ID = "us-3728480-baer-odyssey";
const SOURCE_SHA256 = "620a5c6c5563115c9ec3fa34f64c646b4f32cb9f587eda6bef78a9516439a0cc";
const SOURCE_FIGURE_DIRECTORY = `/patents/figures/${PATENT_ID}`;

type SourceSheet = {
  readonly fileName: string;
  readonly pdfPage: number;
};

/**
 * Full, unmodified 300-DPI renders of the pinned drawing sheets. The old
 * figure crops remain in the asset directory as preservation material, but
 * references in the public source face use these complete sheets so a visitor
 * can inspect the cited figure in its original drawing context.
 */
const sourceSheetsByFigure: Readonly<Record<number, readonly SourceSheet[]>> = {
  1: [{ fileName: "source-sheet-pdf-02-v1.png", pdfPage: 2 }],
  2: [{ fileName: "source-sheet-pdf-04-v1.png", pdfPage: 4 }],
  3: [{ fileName: "source-sheet-pdf-05-v1.png", pdfPage: 5 }],
  4: [{ fileName: "source-sheet-pdf-04-v1.png", pdfPage: 4 }],
  5: [
    { fileName: "source-sheet-pdf-06-v1.png", pdfPage: 6 },
    { fileName: "source-sheet-pdf-07-v1.png", pdfPage: 7 },
    { fileName: "source-sheet-pdf-08-v1.png", pdfPage: 8 },
  ],
  7: [{ fileName: "source-sheet-pdf-11-v1.png", pdfPage: 11 }],
  8: [{ fileName: "source-sheet-pdf-11-v1.png", pdfPage: 11 }],
  9: [{ fileName: "source-sheet-pdf-12-v1.png", pdfPage: 12 }],
  10: [{ fileName: "source-sheet-pdf-12-v1.png", pdfPage: 12 }],
};

const sourceSheetsByReferenceText: Readonly<Record<string, readonly SourceSheet[]>> = {
  "FIG. 1C": [{ fileName: "source-sheet-pdf-03-v1.png", pdfPage: 3 }],
  "FIGS. 1D and 1E": [{ fileName: "source-sheet-pdf-03-v1.png", pdfPage: 3 }],
};

function sheetsForFigure(figureNumber: number, sourceText: string): readonly SourceSheet[] {
  const sheets = sourceSheetsByReferenceText[sourceText] ?? sourceSheetsByFigure[figureNumber];
  if (!sheets) {
    throw new Error(`No pinned source sheet is mapped for ${sourceText}.`);
  }
  return sheets;
}

function _figure(number: number, sourceText = `FIG. ${number}`): CuratedSpecificationInline {
  const sheets = sheetsForFigure(number, sourceText);
  return {
    kind: "reference",
    text: sourceText,
    href: `#fig-${number}`,
    referenceType: "figure",
    label: `Pinned source crop for Fig. ${number}`,
    figurePreviews: sheets.map((sheet) => ({
      src: `${SOURCE_FIGURE_DIRECTORY}/${sheet.fileName}`,
      alt: `${sourceText} on pinned US 3,728,480 PDF page ${sheet.pdfPage}.`,
      width: 2320,
      height: 3408,
    })),
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
    | "Video Game & Cathode Ray Electronics"
    | "Raster Timing & Modulator Dynamics",
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

export const baerOdysseyArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: SOURCE_SHA256,
  preparedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent (19)",
        "Baer",
        "54) TELEVISION GAMING AND TRAINING",
        "APPARATUS",
        "75 Inventor: Ralph H. Baer, Manchester, N.H.",
        "73 Assignee: Sanders Associates, Inc., Nashua,",
        "N.H.",
        "22 Filed: Mar. 22, 1971",
        "(21) Appl. No.: 126,966",
        "Related U.S. Application Data",
        "63 Continuation of Ser. No. 697,798, Jan. 15, 1968,",
        "abandoned.",
        "52 U.S. Cl..................... 178/6.8, 178/6, 178/DIG. 1",
        "(51 int.C. ............................................... H04n 7/18",
      ],
    },
    { kind: "heading", level: 2, text: "ABSTRACT" },
    p(
      "The present invention pertains to an apparatus and method, in conjunction with standard monochrome and color television receivers, for the generation, display, manipulation, and use of symbols or geometric figures upon the screen of the television receivers for the purpose of training simulation, for playing games, and for engaging in other activities by one or more participants. The invention comprises in one embodiment a control unit, connecting means and in some applications a television screen overlay mask utilized in conjunction with a standard television receiver. The control unit includes the control means, switches and electronic circuitry for the generation, manipulation and control of video signals which are to be displayed on the television screen. The connecting means couples the video signals to the receiver antenna terminals thereby using existing electronic circuits within the receiver to process and display the signals. An overlay mask which may be removably attached to the television screen may determine the nature of the game to be played or the training simulated. Control units are provided for each of the participants. Alternatively, games, training simulations and other activities may be carried out in conjunction with background and other pictorial information originated in the television receiver by commercial TV, closed-circuit TV or a CATV station.",
    ),
    { kind: "heading", level: 2, text: "BACKGROUND OF THE INVENTION" },
    p("This is a continuation of application Ser. No. 697,798 filed Jan. 15, 1968 now abandoned."),
    p(
      "The invention relates to an apparatus and method by means of which standard television receivers can be utilized as active rather than passive instruments. This is accomplished by certain embodiments having participants manipulate controls of a control unit connected to the television receiver to cause a symbol, such as a rectangle, bar, 'dot' or a pair of dots to be displayed upon the television screen by means of which the participants can play a variety of games, participate in simulated training programs, as well as carry out other activities. By way of example, modified versions of the well-known game of checkers may be played by two participants by placing an appropriate mask representing the checker board upon the screen of the television receiver. For a simulated training program, 'dots' displayed on the TV screen could represent ships which would be maneuvered by operating manipulating controls.",
    ),
    p(
      "Heretofore, color and monochrome television receivers have been used by the home and other viewers only as passive devices; i.e., the television receiver is used only as a display means for programming originating at a studio. The viewer is limited to selecting the presentations available for viewing and is not a participant to the extent that he can control or influence the nature of, or add to the presentation displayed on the receiver screen. A standard receiver is employed with auxiliary equipment to provide an active form of home entertainment. Since most homes are equipped with television receivers, the only expense required to provide added family enjoyment is the expense of a control unit of one type or another.",
    ),
    p(
      "It is, therefore the primary object of the present invention to provide an apparatus and methods for displaying video signals upon the screen of a television receiver, where some or all of the video signals are both generated and controlled by the viewer.",
    ),
    p(
      "It is a further object of the present invention to provide a device whereby an individual may pit his alertness, skill, manual dexterity and visual acuity on automatically controlled video displays.",
    ),
    p(
      "It is still another object of the present invention to provide an apparatus which will also provide visual indication of the results of the games played and the simulated training programs.",
    ),
    p(
      "It is yet a further object of the present invention to provide an apparatus which will generate 'dots' or other geometric figures such as squares, rectangles, bars, stripes, etc. Which may be controlled by one or more participants for playing various types of games and for training simulation by the display and utilization of the 'dots.'",
    ),
    p(
      "It is still another object of the present invention to allow the use of a standard TV set for gaming or other activities without the need for any kind of internal electrical connection to the TV set for the introduction of video and/or chroma signals, connections being required to be made only to the externally accessible antenna terminals.",
    ),
    p(
      "It is still another object of the present invention to provide for interrogating a standard TV receiver through an optical photosensor in a manner allowing the identification of a suitably time-or frequency-coded message, not interpretable by the unaided eye, such message having been originated in the TV viewers equipment by a cooperative commercial TV, closed circuit TV or CATV station.",
    ),
    p(
      "It is still a further object of the present invention to provide apparatus for decoding messages on a TV screen.",
    ),
    { kind: "heading", level: 2, text: "SUMMARY OF THE INVENTION" },
    p(
      "In accordance with one embodiment of the present invention a television gaming apparatus is provided for generating video signals in accordance with the standardized television format, which signals may be controlled by an individual operator by means of a joystick or other manually operative means. The television gaming apparatus comprises a control box having enclosed therein all the necessary electronic circuits to produce video signals which are compatible with standard television receivers, both monochrome and color.",
    ),
    p(
      "The control box has video signal control means mounted thereon for easy access and connecting means are provided for coupling the video signals generated within the control box to the television receiver. There is also provided suitable overlay masks which are adapted to be removably secured upon the television screen. These masks permit playing of games and training simulation which are adaptable to display upon a television screen.",
    ),
    p(
      "By way of illustration, the television gaming apparatus can be used for electronic target shooting by providing a gun having a photo-electric cell which is activated when a trigger is depressed. Thus, when the gun is aimed at a 'dot' displayed on the television screen, which 'dot' serves as the target, and the trigger is depressed, a hit will be indicated directly on the television screen by a visual display when the photoelectric cell is in alignment with the 'dot.' The 'dot' which serves as the target may be either fixed or moveable and can be swept across the screen in a predetermined or random fashion, at either a fixed or variable rate, either manually or automatically.",
    ),
    p(
      "From the above illustrations it will be apparent to those skilled in the art, that the present invention exhibits a great latitude of versatility.",
    ),
    { kind: "heading", level: 2, text: "BRIEF DESCRIPTION OF THE DRAWINGS" },
    p(
      "The aforementioned and other objects, features and advantages of the present invention will become more apparent from the following detailed description thereof when considered in conjunction with the drawings wherein:",
    ),
    paragraph([
      _figure(1, "FIG. 1"),
      _text(
        " is a pictorial view illustrating the principal components of one embodiment of the invention;",
      ),
    ]),
    paragraph([
      _figure(1, "FIG. 1A"),
      _text(
        " is a sketch illustrating the manner in which the components of the embodiment of FIG. 1 are connected;",
      ),
    ]),
    paragraph([
      _figure(1, "FIG. 1B"),
      _text(
        " is a pictorial view illustrating an alternate embodiment for the control unit of FIG. 1;",
      ),
    ]),
    paragraph([
      _figure(1, "FIG. 1C"),
      _text(" is a sketch showing a \"light-gun' containing a photocell and electronic circuits."),
    ]),
    paragraph([
      _figure(1, "FIGS. 1D and 1E"),
      _text(
        " are sketches illustrating the manner in which the components of the embodiment of FIG. 1 may be connected when used with a cooperative TV. station.",
      ),
    ]),
    paragraph([
      _figure(2, "FIG. 2"),
      _text(
        " is a sketch illustrating a TV screen and overlay mask as employed in the embodiment of FIG. 1;",
      ),
    ]),
    paragraph([_figure(3, "FIG. 3"), _text(" is a block diagram of the control unit of FIG. 1;")]),
    paragraph([
      _figure(4, "FIG. 4"),
      _text(" is a schematic illustrating the electronics for a target shooting game;"),
    ]),
    paragraph([_figure(5, "FIGS. 5A-5G"), _text(" are schematics of the blocks of FIG. 3;")]),
    paragraph([
      _figure(7, "FIG. 7"),
      _text(
        " is a schematic illustrating the method of extracting horizontal and vertical synchronization pulses from a TV receiver without making internal connections, when using a signal broadcast by a cooperative TV station;",
      ),
    ]),
    paragraph([
      _figure(8, "FIG. 8"),
      _text(
        " is a sketch illustrating apparatus for modulating a received TV signal by a video and/or chroma signal generated by the control unit of FIG. 1;",
      ),
    ]),
    paragraph([
      _figure(9, "FIG. 9"),
      _text(
        " is a sketch illustrating the TV screen of a receiver employed in a coded information mode; and",
      ),
    ]),
    paragraph([
      _figure(10, "FIG. 10"),
      _text(
        " is a schematic of a decoder used to decode the information present on the TV screen of FIG. 9.",
      ),
    ]),
    { kind: "heading", level: 2, text: "DESCRIPTION OF PREFERRED EMBODIMENTS" },
    p(
      "The principal components of one embodiment of a television gaming system configured according to the invention are illustrated in FIG. 1 which is a pictorial view showing a television receiver 10, a control unit 14 and means 12 for connecting control unit 14 to receiver 10. The television receiver 10 employed can be any of the standard commercially available models that are generally used for home entertainment. Either a monochrome or color television set may be used with the present invention since the basic principles of the invention apply to both types. The connection means 12 is in this embodiment a shielded cable, for example, shielded twin lead and is attached to the antenna terminals of receiver 10 in conventional fashion (see FIG. 1A).",
    ),
    p(
      "Rather than provide a separate control unit, the control unit could be built into the television receiver as a constituent part thereof and the receiver sold as both an active and passive home entertainment system.",
    ),
    p(
      "A typical sequence of steps to play a game using the present invention would be as follows: 1. Attach connection means 12 to TV set 10 at antenna terminals 19 if not already attached; 2. turn TV set on; 3. select the proper channel on the set for the control unit being used; 4. apply power to the control unit; 5. attach a mask on the face of the TV screen, if required for the game to be played; 6. begin the game.",
    ),
    { kind: "heading", level: 2, text: "CLAIMS" },
    {
      kind: "claim",
      number: 1,
      inlines: [
        _text(
          "In combination with a standard television receiver,\n" +
            "apparatus for generating \"dots' upon the screen of the\n" +
            "receiver to be manipulated by a participant, compris\n" +
            "1ng:\n" +
            "a control unit for generating signals representing the\n" +
            "\"dots' to be displayed, said control unit further in\n" +
            "cluding means for generating synchronizing signal\n" +
            "to synchronize the television raster scan of said\n" +
            "receiver and means for manipulating the position\n" +
            "of the \"dots' on the screen of said receiver; and\n" +
            "means for directly coupling the generated signals\n" +
            'only to said television receiver whereby said "-\n' +
            "dots' are displayed only upon the screen of said\n" +
            "receiver being viewed by the participant.",
        ),
      ],
    },
  ],
};

export function baerOdysseyClaimText(claimNumber: number): string {
  const claimBlock = baerOdysseyArchivalEdition.blocks.find(
    (block): block is Extract<CuratedSpecificationBlock, { kind: "claim" }> =>
      block.kind === "claim" && block.number === claimNumber,
  );
  if (!claimBlock) {
    throw new Error(`Claim ${claimNumber} not found in baerOdysseyArchivalEdition`);
  }
  return claimBlock.inlines.map((inline) => inline.text).join("");
}

export const baerOdysseyParallelReadings: Record<number, string[]> = {
  2: [
    "Field of invention: establishes an apparatus and method for generating, manipulating, and displaying interactive symbols upon standard monochrome and color television receivers.",
  ],
  4: [
    "Cross-reference to prior applications: establishes continuation priority dating back to Serial No. 697,798 filed January 15, 1968.",
  ],
  5: [
    "Interactive television concept: defines creating active training, gaming, and simulation instruments using standard broadcast television cathode ray tubes.",
  ],
  6: [
    "Prior art limitation: notes that existing home television receivers functioned strictly as passive broadcast displays with zero participant interaction.",
  ],
  7: [
    "Primary object: provides self-contained electronics to generate broadcast-standard video signals for home receivers.",
  ],
  8: [
    "Object: allows one or more participants to manipulate on-screen symbols via hand-held control joysticks or knobs.",
  ],
  9: [
    "Object: generates controllable dots, geometric figures, and lines with variable spatial position.",
  ],
  10: [
    "Object: incorporates optical light guns for target shooting with automatic electronic hit detection.",
  ],
  11: ["Object: enables cooperative operation with commercial broadcast transmissions."],
  12: [
    "Object: utilizes removable color plastic overlay masks on the CRT face to provide game graphics.",
  ],
  13: [
    "Object: provides broad compatibility across all standard monochrome and color television models without internal set wiring changes.",
  ],
  15: [
    "Summary of the gaming console: details the self-contained electronic circuitry producing broadcast-compatible video signals manipulated via joysticks.",
  ],
  16: [
    "Console controls & overlay masks: describes accessible player controls, antenna coupling, and removable transparent screen masks.",
  ],
  17: [
    "Target shooting embodiment: describes a light gun with a photoelectric cell for shooting at displayed dot targets with immediate visual hit feedback.",
  ],
  18: [
    "Versatility statement: emphasizes the wide applicability of the interactive television gaming principles.",
  ],
  20: ["Drawing introduction: formal introduction to Figures 1 through 10."],
  21: ["FIG. 1: pictorial perspective of television receiver, console, and player controls."],
  22: ["FIG. 1A: schematic diagram showing antenna twin-lead connection."],
  23: ["FIG. 1B: master console paired with detached remote player controller boxes."],
  24: ["FIG. 1C: optical light gun containing a photocell and electronic pulse circuitry."],
  25: ["FIGS. 1D & 1E: connection diagrams for cooperative broadcast television operation."],
  26: ["FIG. 2: television screen with attached gaming overlay mask."],
  27: [
    "FIG. 3: block diagram of the master control unit showing sync generators and dot positioners.",
  ],
  28: ["FIG. 4: circuit schematic for target shooting hit detection and target extinction."],
  29: [
    "FIGS. 5A-5G: transistor schematics of sync oscillators, pulse shapers, unblanking gates, and RF modulators.",
  ],
  30: ["FIG. 7: external magnetic pickup loop for non-invasive broadcast sync extraction."],
  31: ["FIG. 8: RF antenna modulation coupler apparatus."],
  32: ["FIG. 9: television screen displaying optically encoded data raster patterns."],
  33: ["FIG. 10: photodetector decoding circuit for reading on-screen data patterns."],
  35: [
    "Preferred embodiment: describes television receiver 10, connecting lead 12, and master control unit 14.",
  ],
  36: [
    "Integrated TV embodiment: describes integrating the gaming circuits directly into television chassis manufacture.",
  ],
  37: [
    "Gameplay operational sequence: outlines step-by-step connection, channel selection, mask placement, and play initiation.",
  ],
};
