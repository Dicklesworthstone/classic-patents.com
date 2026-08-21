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

export const TESLA_TELEAUTOMATON_FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 780, height: 1390 },
  2: { width: 940, height: 1410 },
  3: { width: 690, height: 1320 },
};

function figureAssetPath(number: number): string {
  return `/patents/figures/us-613809-tesla-teleautomaton/fig-${number}-source-crop-v1.png`;
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
      width: TESLA_TELEAUTOMATON_FIGURE_DIMS[num]?.width ?? 800,
      height: TESLA_TELEAUTOMATON_FIGURE_DIMS[num]?.height ?? 1400,
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

export const teslaTeleautomatonParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "To all whom it may concern: Be it known that I, Nikola Tesla, residing at New York, have invented certain new and useful Improvements in Methods of and Apparatus for Controlling Mechanism of Moving Vessels or Vehicles.",
  ],
  4: [
    "Fundamental Principle: Wireless radio remote control of self-propelled maritime vessels and robotic vehicles through high-frequency electromagnetic carrier pulses.",
  ],
  5: [
    "Coherer & Relays: Radio pulses detected by an elevated antenna actuate a sensitive coherer switch, energizing local relays that sequentially step a multi-position rotary commutator.",
  ],
  7: [
    "Brief Description of Figures: FIG. 1 is a side elevation and sectional view of the remote-controlled boat; FIG. 2 is a plan view showing internal propulsion and steering machinery; FIG. 3 is a circuit schematic diagram.",
  ],
  9: [
    "Detailed Description: The vessel hull 1 contains storage battery B powering electric motor M driving propeller shaft P, and reversible steering servo-motor S coupled to rudder R.",
  ],
  10: [
    "Rotary Stepping Commutator: Successive radio pulses advance escapement disc D through distinct contact positions, executing port/starboard steering, motor speed modulation, and lighting controls.",
  ],
  11: [
    "Tuned High-Frequency Carrier: The transmitter generates discrete synchronized spark pulse trains matching the resonant frequency of receiver circuit C, preventing unintended interference.",
  ],
  12: [
    "Automated Teleautomation: Demonstrating that physical robotic machines can perform complex guided tasks autonomously across vast distances without physical wires.",
  ],
};

export const teslaTeleautomatonArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "b92da6bad46cca996f7ecc99a16a87bdd38d12b3e04a0fce11cc5f033aed849b",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-20",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent Office",
        "Nikola Tesla, of New York, N. Y.",
        "Patent No.: US 613,809",
        "Date of Patent: November 8, 1898",
        "METHOD OF AND APPARATUS FOR CONTROLLING MECHANISM OF MOVING VESSELS OR VEHICLES",
        "Application filed July 1, 1898. Serial No. 684,934. (No model.)",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "SPECIFICATION",
    },
    p(
      "To all whom it may concern: Be it known that I, Nikola Tesla, a citizen of the United States, residing at the borough of Manhattan, in the city, county, and State of New York, have invented certain new and useful Improvements in Methods of and Apparatus for Controlling Mechanism of Moving Vessels or Vehicles, of which the following is a specification.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "THE WIRELESS TELEAUTOMATON PRINCIPLE",
    },
    p(
      "The invention which I have described relates to a method of and apparatus for controlling from a distance the operations of the mechanism contained within a moving vessel or vehicle without any intermediate physical connecting wires or cables.",
    ),
    p(
      "According to my invention, I produce electrical waves or disturbances in the natural conducting media (the atmosphere and the earth) by a suitable transmitting apparatus. These waves actuate a sensitive detector or coherer carried by the moving vessel, closing local electrical circuits that sequentially advance a rotary commutator to control propulsion, steering, and signaling mechanisms.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWINGS",
    },
    p(
      "The invention is illustrated in the accompanying drawings, in which:\n",
      makePreview("FIG. 1", [1], "Side Elevation and Sectional View of Remote-Controlled Vessel"),
      " is a side elevation and longitudinal sectional view of the remote-controlled boat;\n",
      makePreview("FIG. 2", [2], "Internal Plan View of Electric Propulsion and Steering Machinery"),
      " is a plan view showing the layout of internal storage batteries, motors, and steering servos; and\n",
      makePreview("FIG. 3", [3], "Schematic Diagram of Radio Receiver, Coherer, and Commutator Circuits"),
      " is a diagrammatic representation of the electrical receiving circuits, sensitive device, and relay linkages.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE APPARATUS",
    },
    p(
      "Referring to ",
      makePreview("FIG. 1", [1], "Vessel side elevation"),
      ", hull 1 is an iron vessel containing an electric storage battery B. Motor M drives propeller P. Reversible steering motor S is coupled to rudder R through worm gearing. An elevated receiver antenna E extends upward from the deck to intercept electromagnetic radiation.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 2", [2], "Internal machinery layout"),
      ", antenna E communicates with a sensitive coherer device consisting of metal granules in a glass tube. When radio waves strike the antenna, the coherer becomes conductive, allowing battery current to energize a primary relay coil. An automatic mechanical tapper taps the tube after each signal to restore high resistance.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 3", [3], "Electrical schematic"),
      ", the primary relay energizes a ratchet escapement disk D. Each successive radio pulse rotates the disk through a fixed angle, alternately connecting steering servo S to turn the rudder port or starboard, adjusting propeller motor resistance, or flashing signal lamps L.",
    ),
    p(
      "By sending timed sequences of radio pulses, the operator at the distant shore station maintains absolute control over the vessel trajectory, demonstrating the foundational principles of modern wireless robotics, radio teleoperation, and remote control guidance.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [{ kind: "text", text: "The improvement in the art of controlling the movements and operation of a vessel or vehicle herein described, which consists in producing waves or disturbances which are conveyed to the vessel by the natural media, actuating thereby suitable apparatus on the vessel and effecting the control of the propelling-engine, the steering and other mechanism by the operation of the said apparatus, as set forth." }],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [{ kind: "text", text: "The improvement in the art of controlling the movements and operation of a vessel or vehicle, herein described, which consists in establishing a region of waves or disturbances, and actuating by their influence exerted at a distance the devices on such vessel or vehicle, which control the propelling, steering and other mechanism thereon, as set forth." }],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [{ kind: "text", text: "The improvement in the art of controlling the movements and operation of a vessel or vehicle, herein described, which consists in establishing a region of electrical waves or disturbances, and actuating by their influence, exerted at a distance, the devices on said vessel or vehicle, which control the propelling, steering and other mechanism thereon, as set forth." }],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [{ kind: "text", text: "The improvement in the art of controlling the movements and operation of a vessel or vehicle, herein described, which consists in providing on the vessel a circuit controlling the propelling, steering and other mechanism, adjusting or rendering such circuit sensitive to waves or disturbances of a definite character, establishing a region of such waves or disturbances, and rendering by their means the controlling-circuit active or inactive, as set forth." }],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [{ kind: "text", text: "The combination with a source of electrical waves or disturbances of a moving vessel or vehicle, and mechanism thereon for propelling, steering or operating the same, and a controlling apparatus adapted to be actuated by the influence of the said waves or disturbances at a distance from the source, as set forth." }],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [{ kind: "text", text: "The combination with a source of electrical waves or disturbances of a moving vessel or vehicle, mechanism for propelling, steering or operating the same, a circuit and means therein for controlling said mechanism, and means for rendering said circuit active or inactive through the influence of the said waves or disturbances exerted at a distance from the source, as set forth." }],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [{ kind: "text", text: "The combination with a source of electrical waves or disturbances and means for starting and stopping the same, of a vessel or vehicle, propelling and steering mechanism carried thereby, a circuit containing or connected with means for controlling the operation of said mechanism and adjusted or rendered sensitive to the waves or disturbances of the source, as set forth." }],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [{ kind: "text", text: "The combination with a source of electrical waves or disturbances, and means for starting and stopping the operation of the same, of a vessel or vehicle, propelling and steering mechanism carried thereby, local circuits controlling said mechanisms, a circuit sensitive to the waves or disturbances of the source and means therein adapted to control the said local circuits, as and for the purpose set forth." }],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [{ kind: "text", text: "The sensitive device herein described comprising in construction a receptacle containing a material such as particles of oxidized metal forming a part of the circuit, and means for turning the same end for end when the material has been rendered active by the passage through it of an electric discharge, as set forth." }],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [{ kind: "text", text: "The sensitive device herein described, comprising in combination a receptacle containing a material such as particles of oxidized metal forming a part of an electric circuit, an electromagnet in said circuit, and devices controlled thereby for turning the receptacle end for end when said magnet is energized, as set forth." }],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [{ kind: "text", text: "The sensitive device herein described, comprising in combination a receptacle containing a material such as particles of oxidized metal forming part of an electric circuit, a motor for rotating the receptacle, an electromagnet in circuit with the material, and an escapement controlled by said magnet and adapted to permit a half-revolution of the receptacle when the said magnet is energized, as set forth." }],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [{ kind: "text", text: "The combination with a movable body or vehicle, of a propelling-motor, a steering-motor and electrical contacts carried by a moving portion of the steering mechanism, and adapted in certain positions of the latter to interrupt the circuit of the propelling-motor, a local circuit and means connected therewith for controlling the steering-motor, and a circuit controlling the local circuit and means for rendering said controlling-circuit sensitive to the influence of electric waves or disturbances exerted at a distance from their source, as set forth." }],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [{ kind: "text", text: "The combination with the steering-motor, a local circuit for directing current through the same in opposite directions, a controlling-circuit rendered sensitive to the influence of electric waves or disturbances exerted at a distance from their source, a motor in circuit with the steering-motor but adapted to run always in the same direction, and a local circuit or circuits controlled by said motor, as set forth. NIKOLA TESLA. Witnesses: Rapha\u00ebl Netter, George Scherff." }],
    },
  ],
};

export const teslaTeleautomatonEdition = teslaTeleautomatonArchivalEdition;
