import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

export const daVinciParallelReadings: Record<string, string> = {
  "davinci-abstract":
    "A robotic surgical telepresence system maps macroscopic surgeon hand movements to miniature internal instruments with variable motion scaling and digital tremor elimination.",
  "davinci-p1":
    "Minimally invasive laparoscopic surgery traditionally restricts surgeon dexterity to straight, unarticulated shafts with inverted fulcrum movements.",
  "davinci-p2":
    "The EndoWrist articulated mechanism restores full 7-DOF wrist articulation inside the patient, while computer processing filters 6-10 Hz physiological hand tremors.",
  "davinci-claim1":
    "A master-slave robotic surgical telemanipulator comprising a master controller, an articulated slave tool with an internal wrist assembly, and a controller applying motion scaling and filtering to drive the surgical end effector.",
};

export const daVinciArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "8e74b1cd92e48270a6c429074826b1c676451e041d8b671e2049e7b29a8f2764",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent",
        "Tierney et al.",
        "Patent No.: US 6,331,181 B1",
        "Date of Patent: Dec. 18, 2001",
        "SURGICAL ROBOTIC TOOLS, DATA ARCHITECTURE, AND USE",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "ABSTRACT",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Robotic surgical tool systems and methods provide master-slave telemanipulation with highly articulated end-effectors, digital motion scaling, and physiological tremor cancellation for precision endoscopic surgery.",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND OF THE INVENTION",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Conventional manual endoscopic techniques require surgeons to work through narrow trocar ports with rigid tools, creating an inverted fulcrum effect and eliminating natural wrist dexterity. Fine micro-suturing inside confined anatomical spaces remains difficult due to normal physiological hand tremor.",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The present invention provides a multi-jointed surgical robotic tool (EndoWrist) that replicates natural human wrist motion at the micro-scale inside the patient. An electronic master-slave control architecture scales macroscopic hand movements down to millimeter precision and digitally filters unwanted high-frequency tremors.",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: literal(
        "A surgical robotic system comprising: a master control input device configured to receive surgeon hand movements; an articulated robotic slave manipulator holding an instrument shaft insertable through a minimally invasive incision; a multi-axis wrist mechanism disposed at the distal end of the instrument shaft; and a computer controller operatively connecting the master input device to the slave manipulator, the controller programmed to apply motion scaling and tremor filtration to drive the slave end-effector in real time.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Inventors: Michael D. Tierney, J. Kenneth Salisbury, Robert G. Younge. Assignee: Intuitive Surgical, Inc., Sunnyvale, CA.",
      ),
    },
  ],
};
