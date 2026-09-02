import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/curatedSpecification";

const SHA256 = "bcda272e161a0b973db9d64090f8102447e9aa35914a9a73e70a38736b7934db";

const FIGURES = {
  1: {
    src: "/patents/figures/us-6302230-kamen-segway/fig-1-source-crop-v1.png",
    alt: "Figure 1 from US 6,302,230: side view of a personal vehicle lacking a stable static position for supporting a subject in a standing position.",
    width: 2200,
    height: 1600,
  },
  2: {
    src: "/patents/figures/us-6302230-kamen-segway/fig-2-source-crop-v1.png",
    alt: "Figure 2 from US 6,302,230: perspective view of a further personal vehicle lacking a stable static position.",
    width: 2200,
    height: 1600,
  },
  3: {
    src: "/patents/figures/us-6302230-kamen-segway/fig-3-source-crop-v1.png",
    alt: "Figure 3 from US 6,302,230: control strategy for achieving balance using wheel torque.",
    width: 2200,
    height: 1600,
  },
  4: {
    src: "/patents/figures/us-6302230-kamen-segway/fig-4-source-crop-v1.png",
    alt: "Figure 4 from US 6,302,230: operation of joystick control of the wheels of the personal vehicle.",
    width: 2200,
    height: 1600,
  },
  5: {
    src: "/patents/figures/us-6302230-kamen-segway/fig-5-source-crop-v1.png",
    alt: "Figure 5 from US 6,302,230: block diagram showing sensors, power, and control.",
    width: 2200,
    height: 1600,
  },
  6: {
    src: "/patents/figures/us-6302230-kamen-segway/fig-6-source-crop-v1.png",
    alt: "Figure 6 from US 6,302,230: block diagram providing detail of a driver interface assembly.",
    width: 2200,
    height: 1600,
  },
  7: {
    src: "/patents/figures/us-6302230-kamen-segway/fig-7-source-crop-v1.png",
    alt: "Figure 7 from US 6,302,230: schematic of wheel motor control during balancing and normal locomotion.",
    width: 2200,
    height: 1600,
  },
  8: {
    src: "/patents/figures/us-6302230-kamen-segway/fig-8-source-crop-v1.png",
    alt: "Figure 8 from US 6,302,230: balancing vehicle with a single wheel central to the support platform.",
    width: 2200,
    height: 1600,
  },
  9: {
    src: "/patents/figures/us-6302230-kamen-segway/fig-9-source-crop-v1.png",
    alt: "Figure 9 from US 6,302,230: balancing vehicle with a single wheel and handle.",
    width: 2200,
    height: 1600,
  },
  10: {
    src: "/patents/figures/us-6302230-kamen-segway/fig-10-source-crop-v1.png",
    alt: "Figure 10 from US 6,302,230: balancing vehicle with two coaxial wheels central to the support platform.",
    width: 2200,
    height: 1600,
  },
  11: {
    src: "/patents/figures/us-6302230-kamen-segway/fig-11-source-crop-v1.png",
    alt: "Figure 11 from US 6,302,230: balancing vehicle with a single wheel and no handle.",
    width: 2200,
    height: 1600,
  },
  12: {
    src: "/patents/figures/us-6302230-kamen-segway/fig-12-source-crop-v1.png",
    alt: "Figure 12 from US 6,302,230: alternate embodiment of a balancing vehicle with a single wheel.",
    width: 2200,
    height: 1600,
  },
} as const;

const figure = (
  label: string,
  numbers: readonly (keyof typeof FIGURES)[],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Preview ${label} from US 6,302,230 source facsimile`,
  figurePreviews: numbers.map((n) => FIGURES[n]),
});

const claim = (number: number, inlines: CuratedSpecificationInlines) => ({
  kind: "claim" as const,
  number,
  inlines,
});

export const kamenSegwayArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: SHA256,
  preparedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,

  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent [19]",
        "Kamen et al.",
        "[11] Patent Number: US 6,302,230 B1",
        "[45] Date of Patent: Oct. 16, 2001",
        "PERSONAL MOBILITY VEHICLES AND METHODS",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Figures 1–12",
      title: "Personal Mobility Vehicles, Inverted Pendulum Balancing Dynamics, and Balancing Margin Monitoring",
      description: [
        {
          kind: "text",
          text: "Drawings illustrating the personal transporter chassis, user platform, dual coaxial wheels, control loop block diagram, inverted pendulum mechanics, and balancing margin monitor.",
        },
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "TECHNICAL FIELD",
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The present invention pertains to vehicles and methods for transporting individuals, and more particularly to balancing vehicles and methods for transporting individuals over ground having a surface that may be irregular.",
        },
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND ART",
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "A wide range of vehicles and methods are known for transporting human subjects. Typically, such vehicles rely upon static stability, being designed so as to be stable under all foreseen conditions of placement of their ground contacting members. Thus, for example, the gravity vector acting on the center of gravity of an automobile passes between the points of ground contact of the automobile's wheels, the suspension keeping all wheels on the ground at all times, and the automobile is thus stable. Another example of a statically stable vehicle is the stair-climbing vehicle described in U.S. Pat. No. 4,790,548 (Decelles et al.).",
        },
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "In another embodiment, there is provide a vehicle for carrying a payload including a user. The vehicle of this embodiment includes: a. a ground-contacting module including two substantially coaxial wheels; b. a platform supporting the user in a standing position substantially astride both wheels; and c. a motorized drive arrangement, coupled to the ground contacting module; the drive arrangement, ground contacting module and payload constituting a system; the motorized drive arrangement causing, when powered, automatically balanced operation of the system.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Alternatively, the ",
        },
        {
          kind: "term",
          text: "balancing margin",
          definition:
            "The difference between the maximum available motor acceleration / power output and the current velocity / power demand of the vehicle.",
        },
        {
          kind: "text",
          text: " between a specified maximum power output and the current power output of the motors may be monitored. In response to the balancing margin falling below a specified limit, an alarm may be generated to warn the user to reduce the speed of the vehicle. The alarm may be audible, visual, or, alternatively the alarm may be tactile or may be provided by ",
        },
        {
          kind: "term",
          text: "ripple modulation",
          definition:
            "Periodic torque modulation of the motor drives, providing a rumbling ride / physical vibration that is readily perceived through the platform by the user.",
        },
        {
          kind: "text",
          text: " of the motor drives, providing a rumbling ride that is readily perceived by the user.",
        },
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWINGS",
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The invention will be more readily understood by reference to the following description, taken with the accompanying drawings, in which: ",
        },
        figure("FIG. 1", [1]),
        {
          kind: "text",
          text: " is a side view of a personal vehicle lacking a stable static position, in accordance with a preferred embodiment of the present invention, for supporting or conveying a subject who remains in a standing position thereon; ",
        },
        figure("FIG. 2", [2]),
        {
          kind: "text",
          text: " is a perspective view of a further personal vehicle lacking a stable static position, in accordance with an alternate embodiment of the present invention; ",
        },
        figure("FIG. 3", [3]),
        {
          kind: "text",
          text: " illustrates the control strategy for a simplified version of FIG. 1 to achieve balance using wheel torque; ",
        },
        figure("FIG. 4", [4]),
        {
          kind: "text",
          text: " illustrates diagrammatically the operation of joystick control of the wheels of the embodiment of FIG. 1; ",
        },
        figure("FIG. 5", [5]),
        {
          kind: "text",
          text: " is a block diagram showing generally the nature of sensors, power and control with the embodiment of FIG. 1; ",
        },
        figure("FIG. 6", [6]),
        {
          kind: "text",
          text: " is a block diagram providing detail of a driver interface assembly; and ",
        },
        figure("FIG. 7", [7]),
        {
          kind: "text",
          text: " is a schematic of the wheel motor control during balancing and normal locomotion, in accordance with an embodiment of the present invention.",
        },
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF SPECIFIC EMBODIMENTS",
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "An alternative to operation of a statically stable vehicle is that ",
        },
        {
          kind: "term",
          text: "dynamic stability",
          definition:
            "Continuous active balance of an unpowered statically unstable inverted-pendulum system maintained by closed-loop motorized wheel acceleration beneath the center of gravity.",
        },
        {
          kind: "text",
          text: " may be maintained by action of the user, as in the case of a bicycle or motorcycle or scooter, or, in accordance with embodiments of the present invention, by a control loop, as in the case of the human transporter described in U.S. Pat. No. 5,701,965. The invention may be implemented in a wide range of embodiments. A characteristic of many of these embodiments is the use of a pair of laterally disposed ground-contacting members to suspend the subject over the surface with respect to which the subject is being transported. The ground or other surface, such as a floor, over which a vehicle in accordance with the invention is employed may be referred to generally herein as the 'ground.' The ground-contacting members are typically motor-driven. In many embodiments, the configuration in which the subject is suspended during locomotion lacks inherent stability at least a portion of the time with respect to a vertical in the fore-aft plane but is relatively stable with respect to a vertical in the lateral plane.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "In various embodiments of the invention, fore-aft stability may be achieved by providing a control loop, in which one or more motors are included, for operation of a motorized drive in connection with the ground-contacting members. As described below, a pair of ground-contacting members may, for example, be driven by separate motorized drives to provide steering as well as locomotion. In accordance with embodiments of the present invention, a motorized drive arrangement operates the ground-contacting members to cause automatically balanced operation of the vehicle, maintaining balance by continuously driving the wheels beneath the center of gravity.",
        },
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "What is claimed is:",
    },
    claim(1, [
      {
        kind: "text",
        text: "1. A vehicle for carrying a payload including a user, the vehicle comprising: a. a platform which supports the user; b. a ground-contacting module, to which the platform is mounted, which propels the user in desired motion over an underlying surface; c. a motorized drive arrangement, coupled to the ground-contacting module, the drive arrangement, ground-contacting module and payload comprising a system being unstable with respect to tipping when the motorized drive is not powered; the motorized drive arrangement causing, when powered, automatically balanced operation of the system wherein the vehicle has a present velocity and a maximum operating velocity, determined by a requirement of acceleration to maintain balance and, in operation, has a balancing margin determined by the difference between the maximum operating velocity and the present velocity of the vehicle; d. a balancing margin monitor, coupled to the ground-contacting module, for generating a signal characterizing the balancing margin; and e. an alarm, coupled to the balancing margin monitor, for receiving the signal characterizing the balancing margin and for warning when the balancing margin falls below a specified limit.",
      },
    ]),
    claim(2, [
      {
        kind: "text",
        text: "2. A device according to claim 1, wherein the alarm includes ripple modulation of the power output of the motorized drive arrangement.",
      },
    ]),
    claim(3, [
      {
        kind: "text",
        text: "3. A device according to claim 1, wherein the alarm is audible.",
      },
    ]),
    claim(4, [
      {
        kind: "text",
        text: "4. A device according to claim 1, wherein the ground-contacting module includes a plurality of laterally disposed ground-contacting members.",
      },
    ]),
    claim(5, [
      {
        kind: "text",
        text: "5. A method for using a vehicle to carry a payload including a user, the method comprising: a) supporting the user on a platform, the platform mounted to a ground-contacting module, for propelling the vehicle in desired motion over an underlying surface; b) operating a motorized drive arrangement to provide automatically balanced operation of the vehicle, the vehicle being unstable with respect to tipping when the motorized drive is not powered, the vehicle having a present velocity and a maximum operating velocity, determined to maintain acceleration potential to ensure balance, and, in operation, has a balancing margin determined by the difference between the maximum operating velocity and the present velocity of the vehicle; c) monitoring the balancing margin; d) generating a signal characterizing the balancing margin; and e) generating an alarm based on the signal to warn when the balancing margin falls below a specified limit.",
      },
    ]),
    claim(6, [
      {
        kind: "text",
        text: "6. A method according to claim 5, wherein the step of generating the alarm includes modulating the power output of the motorized drive arrangement in a ripple fashion.",
      },
    ]),
    claim(7, [
      {
        kind: "text",
        text: "7. A method according to claim 5, wherein the step of generating the alarm includes producing an audible warning.",
      },
    ]),
  ],
};

export const kamenSegwayParallelReadings: Record<number, string[]> = {
  3: [
    "Dean Kamen defines the field and governing physical principle: a personal mobility vehicle operating as an active inverted pendulum, dynamically stabilized in the fore-aft plane by motorized wheel drive control.",
  ],
  5: [
    "Kamen contrasts human walking with prior static multi-wheel vehicles. Humans naturally fall forward and step to catch themselves. Prior motorized vehicles required static stability or lacked safe balancing margin management.",
  ],
  7: [
    "The core vehicle architecture: a platform supporting a human rider mounted to a ground-contacting drive module. Unpowered, the system is unstable and falls over; powered, closed-loop feedback maintains dynamic balance.",
  ],
  8: [
    "The balancing margin monitor: an onboard estimator calculating the reserve motor acceleration headroom needed to prevent overturn. When reserve falls below limit, the system activates tactile ripple vibration and speed pushback.",
  ],
  10: [
    "The drawing summary outlines the complete design: side and perspective views of the vehicle, wheel torque balance strategies, joystick steering, sensor fusion, and driver interface assemblies.",
  ],
  12: [
    "Figures 1A, 1B, and 2 detail the physical transporter configuration: a foot platform on two coaxial laterally disposed wheels with an upright handlebar mast, creating an ultra-compact zero-turning-radius footprint.",
  ],
  13: [
    "The control loop architecture: solid-state gyroscopes and accelerometers measure pitch lean θ, commanding motor torque proportional to rider displacement to restore equilibrium.",
  ],
};
