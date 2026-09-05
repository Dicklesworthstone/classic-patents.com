import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

export const MULTI_TOUCH_FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 2048, height: 2310 },
  2: { width: 2048, height: 2310 },
  3: { width: 2048, height: 2310 },
};

function figureAssetPath(number: number): string {
  return `/patents/figures/us-7479949-multitouch/fig-${number}-source-crop-v1.png`;
}

function makePreview(
  surfaceText: string,
  figureNumbers: number[],
  altText: string,
): CuratedSpecificationInline {
  return {
    kind: "reference",
    text: surfaceText,
    href: `#figure-${figureNumbers[0]}`,
    referenceType: "figure",
    label: altText,
    figurePreviews: figureNumbers.map((num) => ({
      src: figureAssetPath(num),
      alt: `Figure ${num}: ${altText}`,
      width: MULTI_TOUCH_FIGURE_DIMS[num]?.width ?? 2048,
      height: MULTI_TOUCH_FIGURE_DIMS[num]?.height ?? 2310,
    })),
  };
}

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

const HELD_SOURCE_BOUND_BLOCK_INDEXES = new Set<number>([
  0,
  1,
  14,
  ...Array.from({ length: 20 }, (_, index) => index + 15),
]);

/** Companion prose preserved with the unbound research reconstruction. */
export const multiTouchResearchParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "To all whom it may concern: Be it known that Steve Jobs, Scott Forstall, Greg Christie, J. Peter Hoddie, Imran Chaudhri, Bas Ording, Francisco Ryan Tolmasky, Kimon Tsinteris, Chris Blumenberg, and Patrick Lee Coffman have invented Touch Screen Device, Method, and Graphical User Interface for Determining Commands by Applying Heuristics.",
  ],
  4: [
    "Fundamental Principle: A multi-touch capacitive touch screen interface applies contextual geometric heuristics to disambiguate user finger gestures (scrolling, panning, zooming, paging) without requiring mechanical stylus inputs.",
  ],
  5: [
    "Gesture Disambiguation Heuristics: By analyzing initial contact vector angles, velocity profiles, and finger counts, the device discriminates between 1D axis-locked scrolling and 2D free panning.",
  ],
  7: [
    "Brief Description of Figures: FIG. 1 is a block diagram of the portable multi-touch device; FIG. 2 illustrates user interface icons and application launcher; FIG. 3 depicts touch gesture heuristics and inertial scrolling responses.",
  ],
  9: [
    "Detailed Description: The device includes capacitive sensor array 100, application processor 102, and graphics acceleration engine 104 executing gestural UI pipelines.",
  ],
  10: [
    "Inertial Rubber-Banding: When scrolling reaches the edge of a document, the viewport stretches elastomeric rubber-band resistance before snapping back upon finger lift.",
  ],
  11: [
    "Multi-Finger Transform: Two-finger pinch, spread, and rotation gestures dynamically scale and orient viewport content in real time with hardware-accelerated transforms.",
  ],
  12: [
    "Universal Touch Paradigm: Providing an intuitive direct-manipulation interface that established the interaction foundation for modern smartphones and tablet computing.",
  ],
};

export const multiTouchArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "9b29747e60aad27302671e1be32fda99680c474d4e3a5ce0ffc93201460bfe1c",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-20",
  // This partial editorial draft is preserved as research evidence. The source
  // reader deliberately selects the page-complete reviewed ledger until every
  // source paragraph, claim, and figure citation has been re-authored and
  // checked against the 364-page pinned facsimile.
  completeFacsimileReviewed: false,
  blocks: (
    [
      {
        kind: "masthead",
        lines: [
          "United States Patent",
          "Jobs et al.",
          "Patent No.: US 7,479,949 B2",
          "Date of Patent: *Jan. 20, 2009",
          "TOUCH SCREEN DEVICE, METHOD, AND GRAPHICAL USER INTERFACE FOR DETERMINING COMMANDS BY APPLYING HEURISTICS",
          "Assignee: Apple Inc., Cupertino, CA (US)",
          "Appl. No.: 12/101,832",
          "Filed: Apr. 11, 2008",
        ],
      },
      p("This patent is subject to a terminal disclaimer."),
      {
        kind: "heading",
        level: 2,
        text: "TECHNICAL FIELD",
      },
      p(
        "The disclosed embodiments relate generally to portable electronic devices, and more particularly, to portable devices that determine commands for the device by applying heuristics to touch screen gestures.",
      ),
      {
        kind: "heading",
        level: 2,
        text: "BACKGROUND OF THE INVENTION",
      },
      p(
        "As portable electronic devices become more compact, and the number of functions performed by a given device increases, it has become a significant challenge to design a user interface that allows users to easily interact with a multifunction device without confusing complex button arrays.",
      ),
      p(
        "The present invention provides intuitive multi-touch direct manipulation interfaces where contact gestures are recognized through contextual heuristics, distinguishing scrolling from panning and single-item advancing across disparate software applications.",
      ),
      {
        kind: "heading",
        level: 2,
        text: "BRIEF DESCRIPTION OF THE DRAWINGS",
      },
      p(
        "For a better understanding of the aforementioned embodiments of the invention, reference should be made to the Description of Embodiments below, in conjunction with the following drawings in which like reference numerals refer to corresponding parts throughout the figures:\n",
        makePreview("FIG. 1", [1], "Block Diagram of Multi-Touch Device Architecture"),
        " is a block diagram illustrating a portable multifunction device with a touch-sensitive display;\n",
        makePreview("FIG. 2", [2], "Graphical User Interface Application Launcher Grid"),
        " illustrates a portable multifunction device having a touch screen with an application grid; and\n",
        makePreview("FIG. 3", [3], "Touch Gesture Recognition and Angle Heuristic Parsing"),
        " illustrates touch gesture heuristics and trajectory angles for scrolling and panning commands.",
      ),
      {
        kind: "heading",
        level: 2,
        text: "DETAILED DESCRIPTION OF EMBODIMENTS",
      },
      p(
        "Referring to ",
        makePreview("FIG. 1", [1], "Device architecture diagram"),
        ", device 100 includes memory 102, memory controller 120, one or more processing units (CPU) 122, peripherals interface 118, RF circuitry 108, audio circuitry 110, speaker 111, microphone 113, and touch screen display 112.",
      ),
      p(
        "Referring to ",
        makePreview("FIG. 2", [2], "Touch screen application launcher"),
        ", the user interface displays a plurality of application icons 200 (such as Phone, Mail, Safari Web Browser, and Photos). User touch contacts on the display trigger haptic, visual, and operational responses.",
      ),
      p(
        "Referring to ",
        makePreview("FIG. 3", [3], "Gesture heuristic angles"),
        ", when the user places one or more fingers on the display and moves them, heuristic engine 140 measures the initial angle θ of the contact motion relative to the vertical axis. If θ is within a predetermined threshold angle of pure vertical, a 1D vertical scrolling command is issued; if θ is outside the threshold, a 2D translation (panning) command is executed.",
      ),
      p(
        "In a photo browsing application, horizontal swipe gestures trigger a next-item or previous-item heuristic, animating the transition between photos with smooth inertial deceleration and edge rubber-banding.",
      ),
      {
        kind: "heading",
        level: 2,
        text: "CLAIMS",
      },
      {
        kind: "claim",
        number: 1,
        inlines: [
          {
            kind: "text",
            text: "A computing device, comprising: a touch screen display; one or more processors; memory; and one or more programs, wherein the one or more programs are stored in the memory and configured to be executed by the one or more processors, the one or more programs including: instructions for detecting one or more finger contacts with the touch screen display; instructions for applying one or more heuristics to the one or more finger contacts to determine a command for the device; and instructions for processing the command; wherein the one or more heuristics comprise: a vertical screen scrolling heuristic for determining that the one or more finger contacts correspond to a one-dimensional vertical screen scrolling command rather than a two-dimensional screen translation command based on an angle of initial movement of a finger contact with respect to the touch screen display; a two-dimensional screen translation heuristic for determining that the one or more finger contacts correspond to the two-dimensional screen translation command rather than the one-dimensional vertical screen scrolling command based on the angle of initial movement of the finger contact with respect to the touch screen display; and a next item heuristic for determining that the one or more finger contacts correspond to a command to transition from displaying a respective item in a set of items to displaying a next item in the set of items.",
          },
        ],
      },
      {
        kind: "claim",
        number: 2,
        inlines: [
          {
            kind: "text",
            text: "The computing device of claim 1, wherein the one or more heuristics comprise a heuristic for determining that the one or more finger contacts correspond to a command to transition from displaying the respective item in the set of items to displaying a previous item in the set of items.",
          },
        ],
      },
      {
        kind: "claim",
        number: 3,
        inlines: [
          {
            kind: "text",
            text: "The computing device of claim 1, wherein the one or more heuristics comprise a horizontal screen scrolling heuristic for determining that the one or more finger contacts correspond to a one-dimensional horizontal screen scrolling command rather than the two-dimensional screen translation command based on the angle of initial movement of the finger contact with respect to the touch screen display.",
          },
        ],
      },
      {
        kind: "claim",
        number: 4,
        inlines: [
          {
            kind: "text",
            text: "The computing device of claim 1, wherein, in one heuristic of the one or more heuristics, a contact comprising a finger swipe gesture that initially moves within a predetermined angle of being perfectly vertical with respect to the touch screen display corresponds to the one-dimensional vertical screen scrolling command.",
          },
        ],
      },
      {
        kind: "claim",
        number: 5,
        inlines: [
          {
            kind: "text",
            text: "The computing device of claim 1, wherein, in one heuristic of the one or more heuristics, a contact comprising a moving finger gesture that initially moves within a predefined range of angles corresponds to the two-dimensional screen translation command.",
          },
        ],
      },
      {
        kind: "claim",
        number: 6,
        inlines: [
          {
            kind: "text",
            text: "The computing device of claim 1, wherein, in one heuristic of the one or more heuristics, a contact comprising a finger swipe gesture that initially moves within a predetermined angle of being perfectly horizontal with respect to the touch screen display corresponds to a one-dimensional horizontal screen scrolling command rather than the two-dimensional screen translation command.",
          },
        ],
      },
      {
        kind: "claim",
        number: 7,
        inlines: [
          {
            kind: "text",
            text: "The computing device of claim 1, wherein, in one heuristic of the one or more heuristics, a contact comprising a finger tap gesture corresponds to a command to select a user interface object at the location of the finger tap gesture.",
          },
        ],
      },
      {
        kind: "claim",
        number: 8,
        inlines: [
          {
            kind: "text",
            text: "The computing device of claim 1, wherein, in one heuristic of the one or more heuristics, a contact comprising a two-finger pinch gesture corresponds to a command to zoom in or zoom out on a displayed image or document.",
          },
        ],
      },
      {
        kind: "claim",
        number: 9,
        inlines: [
          {
            kind: "text",
            text: "The computing device of claim 1, including: instructions for, while displaying a web browser application, detecting one or more first finger contacts with the touch screen display; instructions for applying a first set of heuristics for the web browser application to the one or more first finger contacts to determine a first command for the device; and instructions for processing the first command; wherein the first set of heuristics comprises: the vertical screen scrolling heuristic; and the two-dimensional screen translation heuristic; and instructions for, while displaying a photo album application, detecting one or more second finger contacts with the touch screen display; instructions for applying a second set of heuristics for the photo album application to the one or more second finger contacts to determine a second command for the device; and instructions for processing the second command; wherein the second set of heuristics comprises: the next item heuristic, wherein the respective item in the set of items is a respective image in a set of images; and a heuristic for determining that the one or more second finger contacts correspond to a command to transition from displaying the respective image in the set of images to displaying a previous image in the set of images.",
          },
        ],
      },
      {
        kind: "claim",
        number: 10,
        inlines: [
          {
            kind: "text",
            text: "The computing device of claim 9, wherein the first set of heuristics comprises a heuristic for determining that the one or more first finger contacts correspond to a one-dimensional horizontal screen scrolling command rather than the two-dimensional screen translation command based on the angle of initial movement of the finger contact with respect to the touch screen display.",
          },
        ],
      },
      {
        kind: "claim",
        number: 11,
        inlines: [
          {
            kind: "text",
            text: "A computer-implemented method, comprising: at a computing device with a touch screen display, detecting one or more finger contacts with the touch screen display; applying one or more heuristics to the one or more finger contacts to determine a command for the device; and processing the command; wherein the one or more heuristics comprise: a vertical screen scrolling heuristic for determining that the one or more finger contacts correspond to a one-dimensional vertical screen scrolling command rather than a two-dimensional screen translation command based on an angle of initial movement of a finger contact with respect to the touch screen display; a two-dimensional screen translation heuristic for determining that the one or more finger contacts correspond to the two-dimensional screen translation command rather than the one-dimensional vertical screen scrolling command based on the angle of initial movement of the finger contact with respect to the touch screen display; and a next item heuristic for determining that the one or more finger contacts correspond to a command to transition from displaying a respective item in a set of items to displaying a next item in the set of items.",
          },
        ],
      },
      {
        kind: "claim",
        number: 12,
        inlines: [
          {
            kind: "text",
            text: "The computer-implemented method of claim 11, including: while displaying a web browser application, detecting one or more first finger contacts with the touch screen display; applying a first set of heuristics for the web browser application to the one or more first finger contacts to determine a first command for the device; and processing the first command; wherein the first set of heuristics comprises: the vertical screen scrolling heuristic; and the two-dimensional screen translation heuristic; and while displaying a photo album application, detecting one or more second finger contacts with the touch screen display; applying a second set of heuristics for the photo album application to the one or more second finger contacts to determine a second command for the device; and processing the second command; wherein the second set of heuristics comprises: the next item heuristic, wherein the respective item in the set of items is a respective image in a set of images; and a heuristic for determining that the one or more second finger contacts correspond to a command to transition from displaying the respective image in the set of images to displaying a previous image in the set of images.",
          },
        ],
      },
      {
        kind: "claim",
        number: 13,
        inlines: [
          {
            kind: "text",
            text: "The computer-implemented method of claim 12, wherein the first set of heuristics comprises a heuristic for determining that the one or more first finger contacts correspond to a one-dimensional horizontal screen scrolling command rather than the two-dimensional screen translation command based on the angle of initial movement of the finger contact with respect to the touch screen display.",
          },
        ],
      },
      {
        kind: "claim",
        number: 14,
        inlines: [
          {
            kind: "text",
            text: "The computer-implemented method of claim 11, wherein, in one heuristic of the one or more heuristics, a contact comprising a finger swipe gesture that initially moves within a predetermined angle of being perfectly vertical with respect to the touch screen display corresponds to the one-dimensional vertical screen scrolling command.",
          },
        ],
      },
      {
        kind: "claim",
        number: 15,
        inlines: [
          {
            kind: "text",
            text: "The computer-implemented method of claim 11, wherein, in one heuristic of the one or more heuristics, a contact comprising a moving finger gesture that initially moves within a predefined range of angles corresponds to the two-dimensional screen translation command.",
          },
        ],
      },
      {
        kind: "claim",
        number: 16,
        inlines: [
          {
            kind: "text",
            text: "The computer-implemented method of claim 11, wherein, in one heuristic of the one or more heuristics, a contact comprising a finger swipe gesture that initially moves within a predetermined angle of being perfectly horizontal with respect to the touch screen display corresponds to a one-dimensional horizontal screen scrolling command rather than the two-dimensional screen translation command.",
          },
        ],
      },
      {
        kind: "claim",
        number: 17,
        inlines: [
          {
            kind: "text",
            text: "A computer readable storage medium having stored therein instructions, which when executed by a device with a touch screen display, cause the device to: detect one or more finger contacts with the touch screen display; apply one or more heuristics to the one or more finger contacts to determine a command for the device; and process the command; wherein the one or more heuristics comprise: a vertical screen scrolling heuristic for determining that the one or more finger contacts correspond to a one-dimensional vertical screen scrolling command rather than a two-dimensional screen translation command based on an angle of initial movement of a finger contact with respect to the touch screen display; a two-dimensional screen translation heuristic for determining that the one or more finger contacts correspond to the two-dimensional screen translation command rather than the one-dimensional vertical screen scrolling command based on the angle of initial movement of the finger contact with respect to the touch screen display; and a next item heuristic for determining that the one or more finger contacts correspond to a command to transition from displaying a respective item in a set of items to displaying a next item in the set of items.",
          },
        ],
      },
      {
        kind: "claim",
        number: 18,
        inlines: [
          {
            kind: "text",
            text: "The computer readable storage medium of claim 17, wherein the computer readable medium has stored therein instructions, which when executed by a device with a touch screen display, cause the device to: while displaying a web browser application, detect one or more first finger contacts with the touch screen display; apply a first set of heuristics for the web browser application to the one or more first finger contacts to determine a first command for the device; and process the first command; wherein the first set of heuristics comprises: the vertical screen scrolling heuristic; and the two-dimensional screen translation heuristic; and while displaying a photo album application, detect one or more second finger contacts with the touch screen display; apply a second set of heuristics for the photo album application to the one or more second finger contacts to determine a second command for the device; and process the second command; wherein the second set of heuristics comprises: the next item heuristic, wherein the respective item in the set of items is a respective image in a set of images; and a heuristic for determining that the one or more second finger contacts correspond to a command to transition from displaying the respective image in the set of images to displaying a previous image in the set of images.",
          },
        ],
      },
      {
        kind: "claim",
        number: 19,
        inlines: [
          {
            kind: "text",
            text: "The computer readable storage medium of claim 17, wherein, in one heuristic of the one or more heuristics, a contact comprising a finger swipe gesture that initially moves within a predetermined angle of being perfectly vertical with respect to the touch screen display corresponds to the one-dimensional vertical screen scrolling command.",
          },
        ],
      },
      {
        kind: "claim",
        number: 20,
        inlines: [
          {
            kind: "text",
            text: "The computer readable storage medium of claim 17, wherein, in one heuristic of the one or more heuristics, a contact comprising a moving finger gesture that initially moves within a predefined range of angles corresponds to the two-dimensional screen translation command.",
          },
        ],
      },
    ] as CuratedSpecificationBlock[]
  ).filter((_block, blockIndex) => HELD_SOURCE_BOUND_BLOCK_INDEXES.has(blockIndex)),
};

export const multiTouchEdition = multiTouchArchivalEdition;

/** The terminal-disclaimer sentence is the only active source paragraph. */
export const multiTouchParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "The directly checked front page records a terminal disclaimer. It is legal-status matter on the grant, not a claim limitation or a description of the touch interface.",
  ],
};

export function manualMultiTouchClaimText(claimNumber: number): string {
  const claim = multiTouchArchivalEdition.blocks.find(
    (block) => block.kind === "claim" && block.number === claimNumber,
  );
  if (claim?.kind !== "claim") {
    throw new Error(`Multi-Touch source-bound held packet is missing Claim ${claimNumber}.`);
  }
  return claim.inlines
    .map((inline) => inline.text)
    .join("")
    .trim();
}
