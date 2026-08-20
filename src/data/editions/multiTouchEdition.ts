import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

export const multiTouchClaims = [
  {
    number: 1,
    text: "A computer-implemented method, comprising: at a computing device with a touch screen display, detecting one or more finger contacts on the touch screen display; applying one or more heuristics to the one or more finger contacts to determine a command for the device; and processing the command.",
  },
] as const;

export const multiTouchArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "0000000000000000000000000000000000000000000000000000000000000000",
  preparedBy: "Classic Patents editorial agent",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent",
        "Jobs et al.",
        "[15] 7,479,949",
        "[45] Jan. 20, 2009",
        "[54] TOUCH SCREEN DEVICE, METHOD, AND GRAPHICAL USER INTERFACE FOR DETERMINING COMMANDS BY APPLYING HEURISTICS",
        "[75] Inventors: Steven P. Jobs, Scott Forstall, Greg Christie, J. Peter Hoddie, Imran Chaudhri",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "Touch Screen Device, Method, and Graphical User Interface",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "A computer-implemented method for use in conjunction with a computing device with a touch screen display comprises: detecting one or more finger contacts with the touch screen display, applying one or more heuristics to the one or more finger contacts to determine a command for the device, and processing the command.",
      ),
    },
    {
      kind: "claim",
      number: 1,
      inlines: literal(multiTouchClaims[0].text),
    },
  ],
};

export const multiTouchEdition = multiTouchArchivalEdition;

export const multiTouchParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "A computer-implemented method detecting one or more finger contacts with a touch screen display, applying touch heuristics to determine device commands, and processing the resulting commands.",
  ],
};
