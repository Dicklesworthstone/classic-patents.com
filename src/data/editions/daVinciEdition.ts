import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const term = (
  surfaceText: string,
  key: string,
  definition: string,
): CuratedSpecificationInline => ({
  kind: "term",
  text: surfaceText,
  label: key,
  definition,
});

/**
 * The selected body below is retained as research material, but it is not a
 * page-complete archival transcription. The active held packet contains only
 * the visually checked front-page identity/abstract and the printed claims.
 * Until the full edition is rebuilt, the reader independently serves the
 * complete reviewed ledger and pinned facsimile.
 */
const HELD_SOURCE_BOUND_BLOCK_INDEXES = new Set([
  0, 1, 2, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48,
]);

export const DAVINCI_FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 1856, height: 2385 },
  2: { width: 1856, height: 2385 },
  3: { width: 1856, height: 2385 },
};

const DAVINCI_SOURCE_SHEET_DIMS = { width: 928, height: 1364 } as const;

const SOURCE_SHEETS_BY_LEGACY_PREVIEW: Readonly<Record<number, readonly number[]>> = {
  1: [1],
  2: [2],
  3: [3, 4],
};

function figureAssetPath(number: number): string {
  return `/patents/figures/us-6331181-davinci/fig-${number}-source-crop-v1.png`;
}

function makePreview(
  surfaceText: string,
  figureNumbers: readonly [number, ...number[]],
  altText: string,
): CuratedSpecificationInline {
  return {
    kind: "reference",
    text: surfaceText,
    href: `#figure-${figureNumbers[0]}`,
    referenceType: "figure",
    label: altText,
    figurePreviews: [
      ...figureNumbers.flatMap((num) =>
        (SOURCE_SHEETS_BY_LEGACY_PREVIEW[num] ?? []).map((sheetNumber) => ({
          src: `/patents/figures/us-6331181-davinci/sheet-${sheetNumber}-source-crop-v1.png`,
          alt: `${surfaceText}: ${altText} (complete source drawing sheet ${sheetNumber} of 22)`,
          ...DAVINCI_SOURCE_SHEET_DIMS,
        })),
      ),
      ...figureNumbers.map((num) => ({
        src: figureAssetPath(num),
        alt: `${surfaceText}: ${altText} (supplemental close crop)`,
        width: DAVINCI_FIGURE_DIMS[num]?.width ?? 1200,
        height: DAVINCI_FIGURE_DIMS[num]?.height ?? 1600,
      })),
    ],
  };
}

function makeSourceSheetPreview(
  surfaceText: string,
  sheetNumbers: readonly [number, ...number[]],
  altText: string,
): CuratedSpecificationInline {
  return {
    kind: "reference",
    text: surfaceText,
    href: `#davinci-source-sheet-${sheetNumbers[0]}`,
    referenceType: "figure",
    label: altText,
    figurePreviews: sheetNumbers.map((sheetNumber) => ({
      src: `/patents/figures/us-6331181-davinci/sheet-${sheetNumber}-source-crop-v1.png`,
      alt: `${surfaceText}: ${altText} (source drawing sheet ${sheetNumber} of 22)`,
      ...DAVINCI_SOURCE_SHEET_DIMS,
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

export const davinciParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "The abstract describes a memory mounted on the robotic tool. It verifies compatibility, identifies the tool type, and carries calibration offsets or tool-life information to the manipulator.",
  ],
};

export const davinciArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "ff8eef36d94ec5ec3ec01038b7145030caf617ea018fcde9f00df6380beb3d91",
  preparedBy: "Classic Patents source-audit draft",
  preparedAt: "2026-08-20",
  // Claims and figure-sheet mappings are source-bound, but the selected body
  // paragraphs do not yet constitute the complete 16-page specification.
  completeFacsimileReviewed: false,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent",
        "Tierney et al.",
        "Patent No.: US 6,331,181 B1",
        "Date of Patent: Dec. 18, 2001",
        "SURGICAL ROBOTIC TOOLS, DATA",
        "ARCHITECTURE, AND USE",
        "Inventors: Michael J. Tierney, Pleasanton; Thomas G. Cooper, Menlo Park; Chris A. Julian, Los Gatos; Stephen J. Blumenkranz, Redwood City; Gary S. Guthart, Foster City; Robert G. Younge, Portola Valley, all of CA (US)",
        "Assignee: Intuitive Surgical, Inc., Mountain View, CA (US)",
        "Appl. No.: 09/418,726",
        "Filed: Oct. 15, 1999",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "ABSTRACT",
    },
    p(
      "Robotic surgical tools, systems, and methods for preparing for and performing robotic surgery include a memory mounted on the tool. The memory can perform a number of functions when the tool is loaded on the tool manipulator: first, the memory can provide a signal verifying that the tool is compatible with that particular robotic system. Secondly, the tool memory may identify the tool-type to the robotic system so that the robotic system can reconfigure its programming. Thirdly, the memory of the tool may indicate tool-specific information, including measured calibration offsets indicating misalignment of the tool drive system, tool life data, or the like. This information may be stored in a read only memory (ROM), or in a nonvolatile memory which can be written to only a single time. The invention further provides improved engagement structures for coupling robotic surgical tools with manipulator structures.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "FIELD OF THE INVENTION",
    },
    p(
      "This invention relates generally to robotically assisted surgery, and more particularly to surgical tools having improved mechanical and/or data-interface capabilities to enhance the safety, accuracy, and speed of minimally invasive and other robotically enhanced surgical procedures.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND OF THE INVENTION",
    },
    p(
      "A surgeon typically operates a master controller to remotely control surgical instruments at the surgical site. The controller may be across the operating room, in another room, or in another building, and may use joysticks, exoskeletal gloves, or master manipulators coupled by a servo mechanism to a slave supporting the tool.",
    ),
    p(
      "The specification identifies practical challenges: a procedure may use many different instruments, the number of independent manipulators may be limited by space and cost, and several instruments may be introduced through the same trocar sleeve. The invention addresses these tool-change and compatibility problems.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    p(
      "The invention provides improved robotic surgical devices, systems, and methods for preparing for and performing robotic surgery. The robotic tools often use a memory structure mounted on a tool, manipulator arm, or movable support structure.",
    ),
    p(
      "The memory can verify compatibility when a tool is loaded, identify whether it is a scalpel, needle grasper, jaws, scissors, clip applier, electrocautery blade, or another tool type, and provide measured calibration offsets or tool-life information. The information may be stored in one-time programmable EPROM, Flash EPROM, EEPROM, battery-backed SRAM, or another serial or random-access technology.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWING FIGURES",
    },
    p(
      "The invention is described in detail with reference to the accompanying drawings:\n",
      makePreview(
        "FIG. 1",
        [1],
        "Perspective view of the master-slave robotic surgical workstation and patient cart",
      ),
      " is a perspective view of a robotic surgical workstation and patient cart;\n",
      makePreview("FIG. 2", [2], "Perspective view of the robotic surgical arm cart system"),
      " is a perspective view of a robotic surgical arm cart system; ",
      makePreview("FIGS. 2A-C", [3], "Manipulator linkage and remote-center construction"),
      " show a manipulator and its remote-center linkage; ",
      makeSourceSheetPreview("FIGS. 3 and 3A", [5, 6], "Exemplary robotic-arm cart structures"),
      " show exemplary cart structures; ",
      makeSourceSheetPreview("FIG. 4", [7], "Exemplary detachable surgical tool"),
      " shows an exemplary tool; ",
      makeSourceSheetPreview("FIGS. 4A-B", [7, 8], "Alternative tool-drive systems"),
      " show alternative drive systems; ",
      makeSourceSheetPreview("FIGS. 5A-H", [9, 10], "Alternative surgical end effectors"),
      " show different end-effectors; ",
      makeSourceSheetPreview("FIG. 6", [11], "Mechanical and electrical tool interface"),
      " shows the tool interface; ",
      makeSourceSheetPreview(
        "FIGS. 7A-E and 7G-L",
        [11, 12, 13],
        "Adapters, holders, driven elements, and electrical contacts",
      ),
      " show adapters, holders, drives, and contacts; ",
      makeSourceSheetPreview("FIG. 8", [14], "Tool-interface wiring schematic"),
      " shows wiring; ",
      makeSourceSheetPreview(
        "FIGS. 8A-B",
        [15],
        "Master console view (FIG. 8A is present; FIG. 8B is cited by the specification but absent from the pinned drawing sheets)",
      ),
      " identify the cited master-console material; ",
      makeSourceSheetPreview("FIGS. 9-10", [16, 17], "Tool-change signal path and software flow"),
      " show tool-change signal and software paths; ",
      makeSourceSheetPreview(
        "FIGS. 11-13",
        [18, 19, 20],
        "Tool-engagement sensing and operating-state logic",
      ),
      " show engagement state logic; ",
      makeSourceSheetPreview("FIGS. 14A-C", [21], "Sterile-adapter and tool mounting sequence"),
      " show mounting; and ",
      makeSourceSheetPreview("FIG. 15", [22], "Tool-compatibility verification algorithm"),
      " shows compatibility verification.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS",
    },
    p(
      "Referring to ",
      makePreview("FIG. 1", [1], "Robotic surgical procedure and tool-change view"),
      ", robotic surgery generally involves multiple robotic arms supporting articulated or non-articulated surgical tools and an image-capture device such as an endoscope. In the illustrated embodiment a master controller 150 directs a slave cart 50 beside patient body P, with shafts entering an internal site through openings O.",
    ),
    p(
      "The master controllers are manual input devices that preferably move with six degrees of freedom and may include an actuated handle. The slave cart supports tools through manually articulatable set-up joints and a robotic manipulator. The patent does not state a 1,000 Hz sample rate, a fixed motion-scaling ratio, or an 8 Hz tremor filter in this grant.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 2A", [3], "Robotic manipulator linkage and remote center"),
      ", linkage 62 uses rigid links and rotational joints in a parallelogram arrangement. Pitch and yaw axes intersect at ",
      term(
        "remote center",
        "Remote center of rotation",
        "The fixed point at which the manipulator's pitch and yaw axes intersect and around which the tool shaft pivots during minimally invasive positioning.",
      ),
      " 64, aligned with tool shaft 66. Insertion along axis 64c leaves the remote center fixed relative to manipulator base 68.",
    ),
    p(
      "Motors 70 drive the linkage, rotate tool 54 about shaft axis 66, articulate a distal wrist, and actuate an end effector. Flexible members may transfer motion from the drive components to the tool, while cannula 72 supports rotation and axial movement in endoscopic procedures.",
    ),
    p(
      "The broader system uses a tool interface with driven elements and tool-drive systems coupled to distal degrees of motion. Calibration offsets can record the difference between nominal and measured relative positions, and a memory coupled to the interface can transmit those offsets to the processor.",
    ),
    p(
      "The specification also describes tool-type data, tool-life and cumulative-use data, engagement sensors, sterile adapters, and an optional magnet that actuates circuitry in a holder. These examples support safe tool exchange; they do not establish a commercial product specification beyond the words of this grant.",
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
          text: "A robotic surgical tool for use in a robotic surgical system having a processor which directs movement of a tool holder, the tool comprising: a probe having a proximal end and a distal end; a surgical end effector disposed adjacent the distal end of the probe; an interface disposed adjacent the proximal end of the probe, the interface releasably coupleable with the tool holder; and circuitry mounted on the probe, the circuitry defining a signal for transmitting to the processor so as to indicate compatibility of the tool with the system; wherein the signal comprises an identifier signal included in a table accessible to the processor for comparison with the signal, the table comprising a plurality of compatible tool identification signals.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 1, wherein the signal indicates tool calibration offsets of the tool.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 1, wherein the end effector has a strength, and wherein the signal indicates the strength of the end effector to the processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 1, wherein the signal indicates a range of motion of the end effectors.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 1, wherein the end effectors are coupled to the probe with a wrist, wherein the signal indicates a wrist axis geometry.",
        },
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        {
          kind: "text",
          text: "A robotic surgical tool for use in a robotic surgical system having a processor which directs movement of a tool holder, the tool comprising: a probe having a proximal end and a distal end; a surgical end effector disposed adjacent the distal end of the probe; an interface disposed adjacent the proximal end of the probe, the interface releasably coupleable with the tool holder; and circuitry mounted on the probe, the circuitry defining a signal for transmitting to the processor so as to indicate compatibility of the tool with the system; wherein the signal comprises an arbitrary compatibility data string.",
        },
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the signal indicates a range of motion of the end effectors.",
        },
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the end effectors are coupled to the probe with a wrist, wherein the signal indicates a wrist axis geometry.",
        },
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the signal indicates tool calibration offsets of the tool.",
        },
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the signal indicates a tool-type of the tool.",
        },
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, further comprising at least one joint disposed between the interface and end effector, the joint defining a joint axis geometry, wherein the signal indicates the joint geometry of the tool to the processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the probe comprises an elongate shaft suitable for distal insertion via a minimally invasive aperture to an internal surgical site of a patient body.",
        },
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the end effector has a strength, and wherein the signal indicates the strength of the end effector to the processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the signal further indicates at least one of tool life and cumulative tool use by a measurement selected from the group consisting of calendar date, clock time, number of surgical procedures, number of times the tool has been coupled to the system, and number of end effector actuations.",
        },
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the end effector comprises an image capture device to define a field of view.",
        },
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, further comprising a wrist joint coupling the end effector to the probe for varying an orientation of the end effector within an internal surgical site.",
        },
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        {
          kind: "text",
          text: "A robotic surgical component for use in a robotic surgical system having a processor and a component holder, the component comprising: a component body having an interface mountable to the component holder, the body supporting a surgical end effector; a drive system coupled to the body, the drive system moving the end effector in response to commands from the processor; and circuitry mounted on the body, the circuitry defining a signal for transmitting to the processor, the signal comprising at least one member selected from the group consisting of compatibility of the component with the system, a component-type of the component, coupling of the component to the system, and calibration of the component; wherein the component comprises a tool including a shaft having a proximal end and a distal end, the end effector disposed adjacent the distal end of the shaft, with a plurality of degrees of motion relative to the proximal end of the shaft, and wherein the interface comprises a plurality of driven elements, and further comprising a tool drive system coupling the driven elements to the degrees of motion of the end effector, the tool drive system having one or more calibration offsets between a nominal position of the end effector relative to the driven elements and a measured position of the end effector relative to the driven elements; wherein the circuitry comprises a memory storing data indicating the offsets, the memory coupled to the interface so as to transmit the offsets to the processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        {
          kind: "text",
          text: "The component of claim 17, wherein the component body comprises an elongate shaft for distal insertion via a minimally invasive aperture to an internal surgical site of a patient body.",
        },
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        {
          kind: "text",
          text: "A robotic surgical tool for use with a robotic manipulator having a tool holder, the tool holder having magnetically actuatable circuitry, the tool comprising: a probe having a proximal end and a distal end; a surgical end effector adjacent the distal end of the probe; an interface adjacent the proximal end of the probe, the interface releasably coupleable with the holder, the interface comprising a magnet positioned so as to actuate the circuitry of the holder.",
        },
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 19, wherein the circuitry defines a signal for transmitting to a processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 20, wherein the signal comprises an unique tool identifier.",
        },
      ],
    },
    {
      kind: "claim",
      number: 22,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 20, wherein the signal comprises tool calibration offsets of the tool.",
        },
      ],
    },
    {
      kind: "claim",
      number: 23,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 20, wherein the signal indicates at least one of tool life and cumulative tool use by a measurement selected from the group consisting of calendar date, clock time, number of surgical procedures, number of times the tool has been coupled to the system, and number of end effector actuations.",
        },
      ],
    },
    {
      kind: "claim",
      number: 24,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 19, wherein the robotic manipulator comprises a drive system coupled to the probe, the drive system moving the end effector in response to commands from a processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 25,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 19, further comprising a wrist joint coupling the end effector to the probe for varying an orientation of the end effector within an internal surgical site.",
        },
      ],
    },
    {
      kind: "claim",
      number: 26,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 19, wherein the end effector comprises an image capture device to define a field of view.",
        },
      ],
    },
    {
      kind: "claim",
      number: 27,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 20, further comprising at least one joint disposed between the interface and end effector, the joint defining a joint axis geometry, wherein the signal indicates the joint geometry of the tool to the processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 28,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 19, wherein the end effectors are coupled to the probe with a wrist, wherein the signal indicates a wrist axis geometry.",
        },
      ],
    },
  ].filter((_block, blockIndex) => HELD_SOURCE_BOUND_BLOCK_INDEXES.has(blockIndex)),
};

export const davinciEdition = davinciArchivalEdition;

export function davinciClaimText(number: number): string {
  const claim = davinciArchivalEdition.blocks.find(
    (b): b is Extract<typeof b, { kind: "claim" }> => b.kind === "claim" && b.number === number,
  );
  if (!claim) throw new Error(`US 6,331,181 claim ${number} not found in edition`);
  return claim.inlines.map((i) => i.text).join("");
}
