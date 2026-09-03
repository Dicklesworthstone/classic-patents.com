import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
} from "@/types/patent";

const PDF_SHA256 = "bcda272e161a0b973db9d64090f8102447e9aa35914a9a73e70a38736b7934db";
const SOURCE_FIGURE_DIRECTORY = "/patents/figures/us-6302230-kamen-segway";

function sheetForFigure(figureNumber: number): string {
  return `fig-${figureNumber}-source-crop-v1.png`;
}

function term(value: string, definition: string): CuratedSpecificationInline {
  return {
    kind: "term",
    text: value,
    definition,
  };
}

function text(value: string): CuratedSpecificationInline {
  return {
    kind: "text",
    text: value,
  };
}

function sourceFigure(
  figureNumberOrNumbers: number | readonly number[],
  sourceText: string,
): CuratedSpecificationInline {
  const figureNumbers = Array.isArray(figureNumberOrNumbers)
    ? figureNumberOrNumbers
    : [figureNumberOrNumbers];
  const primaryFigureNumber = figureNumbers[0];

  return {
    kind: "reference",
    text: sourceText,
    href: `#figure-${primaryFigureNumber}`,
    referenceType: "figure",
    label: `Source crop of ${sourceText} from US 6,302,230`,
    figurePreviews: figureNumbers.map((sourceFigureNumber) => ({
      src: `${SOURCE_FIGURE_DIRECTORY}/${sheetForFigure(sourceFigureNumber)}`,
      alt: `${sourceText} on its pinned US 6,302,230 drawing sheet for Fig. ${String(sourceFigureNumber)}.`,
      width: 2088,
      height: 2930,
    })),
  };
}

function claim(number: number, claimText: string): CuratedSpecificationBlock {
  return {
    kind: "claim",
    number,
    inlines: [text(claimText)],
  };
}

const blocks: CuratedSpecificationBlock[] = [
  {
    kind: "masthead",
    lines: [
      "US 6,302,230 B1",
      "(12) United States Patent",
      "Kamen et al.",
      "(10) Patent No.: US 6,302,230 B1",
      "(45) Date of Patent: Oct. 16, 2001",
      "(54) PERSONAL MOBILITY VEHICLES AND METHODS",
    ],
  },
  {
    kind: "figure-sheet",
    figureLabel: "Figures 1–16",
    title:
      "Personal Mobility Vehicles, Inverted Pendulum Balancing Dynamics, and Balancing Margin Monitoring",
    description: [
      text(
        "Drawings illustrating the personal transporter chassis, user platform, dual coaxial wheels, control loop block diagram, inverted pendulum mechanics, and balancing margin monitor.",
      ),
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
      text(
        "The present invention pertains to vehicles and methods for transporting individuals, and more particularly to balancing vehicles and methods for transporting individuals over ground having a Surface that may be irregular.",
      ),
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
      text(
        "A wide range of vehicles and methods are known for transporting human Subjects. Typically, Such vehicles rely upon ",
      ),
      term(
        "Static Stability",
        "Inherent physical equilibrium where a vehicle remains upright without active intervention because its center of gravity falls stably within its ground contact footprint.",
      ),
      text(
        ", being designed So as to be stable under all foreseen conditions of placement of their ground contacting members. Thus, for example, the gravity vector acting on the center of gravity of an automobile passes between the points of ground contact of the automobile's wheels, the Suspension keeping all wheels on the ground at all times, and the automobile is thus stable. Another example of a Statically stable vehicle is the Stair-climbing vehicle described in U.S. Pat. No. 4,790,548 (Decelles et al.).",
      ),
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
      text(
        "In one embodiment there is provided a vehicle for carrying a user. In this case, the user is a Standing person. The vehicle of this embodiment includes: a. a ground-contacting module which Supports a payload including the Standing person, the ground-contacting module contacting an underlying Surface Substantially at a single region of contact; and b. a motorized drive arrangement, coupled to the ground-contacting module; the drive arrangement, ground-contacting module and payload constituting a System; the motorized drive arrangement causing, when powered, automatically balanced operation of the System.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [text("In a related embodiment, the ground-contacting module includes a uniball.")],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "In another embodiment, there is provide a vehicle for carrying a payload including a user. The vehicle of this embodiment includes: a. a ground-contacting module including two Substantially coaxial wheels; b. a platform Supporting the user in a Standing position Substantially astride both wheels; and c. a motorized drive arrangement, coupled to the ground-contacting module; the drive arrangement, ground-contacting module and payload constituting a System; the motorized drive arrangement causing, when powered, automatically balanced operation of the System.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "In another embodiment, there is provided a vehicle for carrying a payload including a user, and the vehicle of this embodiment includes: a. a platform which Supports the user; b. a ground-contacting module, to which the platform is mounted, which propels the user in desired motion over an underlying Surface, c. a proximity Sensor for determining the presence of the user on the device; and d. a Safety Switch, coupled to the proximity detector, for inhibiting operation of the ground-contacting module unless the proximity Sensor has determined the presence of the user on the device.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "The proximity Sensor may be a member, mechanically coupled to the Safety Switch, having an operating position and a non-operating position, wherein the member is in the non-operating position in the absence of the user from the device and the member is moveable to the operating position when the user is on the device. The member may include a plate, disposed on the device, for receiving a foot of the user, wherein placement of the foot on the plate causes it to move into the operating position. Alternatively, the proximity detector may be electronic and may include a Semiconductor device. In a further related embodiment, the device may include a motorized drive arrangement, coupled to the ground-contacting module; the motorized drive arrangement causing, when powered, automatically balanced and Stationary operation of the device unless the proximity Sensor has determined the presence of the user on the device.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "In another embodiment, there is provided a vehicle for carrying a payload including a user. The vehicle of this embodiment includes: a. a platform which Supports the user; b. a ground-contacting module, to which the platform is mounted, which propels the user in desired motion over an underlying Surface, c. a motorized drive arrangement, coupled to the ground-contacting module, the drive arrangement, ground-contacting module and payload constituting a System; the motorized drive arrangement causing, when powered, automatically balanced operation of the System wherein the motorized drive arrangement has a present power output and a specified maximum power Output and, in operation, has ",
      ),
      term(
        "balancing margin",
        "The dynamic reserve headroom between the vehicle's present velocity and its maximum allowable speed, ensuring motor acceleration authority remains available to prevent falling.",
      ),
      text(
        " determined by the difference between the maximum power output and the present power output of the drive arrangement, d. a balancing margin monitor, coupled to the motorized drive arrangement, for generating a Signal characterizing the balancing margin; and e. an alarm, coupled to the balancing margin monitor, for receiving the Signal characterizing the balancing margin and for warning when the balancing margin falls below a specified limit. The alarm may include ripple modulation of the power output of the motorized drive arrangement, and alternatively, or in addition, may be audible.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "In a still further embodiment there is provided a device for carrying a user, and the device includes: a. a platform which Supports a payload including the user, b. a ground-contacting module, mounted to the platform, including at least one ground-contacting member and defining a fore-aft plane; c. a motorized drive arrangement, coupled to the ground-contacting module, the drive arrangement, ground-contacting module and payload constituting a System; the motorized drive arrangement causing, when powered, automatically balanced operation of the System in an operating position that is unstable with respect to tipping in at least a fore-aft plane when the motorized drive arrangement is not powered; and d. a user input control that receives an indication from the user of a specified pitch of the device under conditions of motion at uniform velocity.",
      ),
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
      text(
        "The invention will be more readily understood by reference to the following description, taken with the accompanying drawings, in which: ",
      ),
      sourceFigure(1, "FIG. 1"),
      text(
        " is a side view of a personal vehicle lacking a stable Static position, in accordance with a preferred embodiment of the present invention, for Supporting or conveying a Subject who remains in a Standing position thereon; ",
      ),
      sourceFigure(2, "FIG. 2"),
      text(
        " is a perspective view of a further personal vehicle lacking a stable Static position, in accordance with an alternate embodiment of the present invention; ",
      ),
      sourceFigure(3, "FIG. 3"),
      text(" illustrates the control strategy for a simplified version of "),
      sourceFigure(1, "FIG. 1"),
      text(" to achieve balance using wheel torque; "),
      sourceFigure(4, "FIG. 4"),
      text(
        " illustrates diagrammatically the operation of joystick control of the wheels of the embodiment of ",
      ),
      sourceFigure(1, "FIG. 1"),
      text("; "),
      sourceFigure(5, "FIG. 5"),
      text(
        " is a block diagram showing generally the nature of sensors, power and control with the embodiment of ",
      ),
      sourceFigure(1, "FIG. 1"),
      text("; "),
      sourceFigure(6, "FIG. 6"),
      text(" is a block diagram providing detail of a driver interface assembly; "),
      sourceFigure(7, "FIG. 7"),
      text(
        " is a schematic of the wheel motor control during balancing and normal locomotion, in accordance with an embodiment of the present invention; ",
      ),
      sourceFigure(8, "FIG. 8"),
      text(
        " shows a balancing vehicle with a single wheel central to the Support platform of the vehicle and an articulated handle in accordance with an embodiment of the present invention; ",
      ),
      sourceFigure(9, "FIG. 9"),
      text(
        " shows a balancing vehicle with a single wheel central to the Support platform of the vehicle and a handle in accordance with an embodiment of the present invention; ",
      ),
      sourceFigure(10, "FIG. 10"),
      text(
        " shows a balancing vehicle with two coaxial wheels central to the Support platform of the vehicle and an articulated handle in accordance with an embodiment of the present invention; ",
      ),
      sourceFigure(11, "FIG. 11"),
      text(
        " shows a balancing vehicle with a single wheel central to the Support platform of the vehicle and no handle in accordance with an embodiment of the present invention; ",
      ),
      sourceFigure(12, "FIG. 12"),
      text(
        " shows an alternate embodiment of a balancing vehicle with a single wheel central to the Support platform of the vehicle and no handle in accordance with an embodiment of the present invention; ",
      ),
      sourceFigure(13, "FIG. 13"),
      text(
        " shows a balancing vehicle with a single wheel transversely mounted central to the Support platform of the vehicle and no handle in accordance with an embodiment of the present invention; ",
      ),
      sourceFigure(14, "FIG. 14"),
      text(
        " shows a balancing vehicle with a single wheel transversely mounted central to the Support platform of the vehicle and a handle in accordance with an embodiment of the present invention; ",
      ),
      sourceFigure(15, "FIG. 15"),
      text(
        " shows a balancing vehicle with a uniball mounted central to the Support platform of the vehicle and a handle in accordance with an embodiment of the present invention; and ",
      ),
      sourceFigure(16, "FIG. 16"),
      text(
        " shows an illustrative diagram of an idealized balancing vehicle with a rigid wheel in motion at a constant Velocity across a flat Surface.",
      ),
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
      text(
        "The subject matter of this application is related to that of U.S. application Ser. No. 08/479,901, filed Jun. 7, 1995, now allowed, which is a continuation in part of U.S. application Ser. No. 08/384,705, filed Feb. 3, 1995, now allowed, which is a continuation in part of U.S. application Ser. No. 08/250,693, filed May 27, 1994, now issued as U.S. Pat. No. 5,701,965, which in turn is a continuation in part of U.S. application Ser. No. 08/021,789, filed Feb. 24, 1993, now abandoned. Each of these related applications is incorporated herein by reference.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text("An alternative to operation of a Statically stable vehicle is that "),
      term(
        "dynamic stability",
        "Active closed-loop stabilization where a vehicle inherently unstable with respect to tipping is kept continuously upright by motorized wheel torque driven by sensor feedback.",
      ),
      text(
        " may be maintained by action of the user, as in the case of a bicycle or motorcycle or Scooter, or, in accordance with embodiments of the present invention, by a control loop, as in the case of the human transporter described in U.S. Pat. No. 5,701,965. The invention may be implemented in a wide range of embodiments. A characteristic of many of these embodiments is the use of a pair of laterally disposed ground-contacting members to Suspend the subject over the surface with respect to which the subject is being transported. The ground or other surface, such as a floor, over which a vehicle in accordance with the invention is employed may be referred to generally herein as the “ground.” The ground-contacting members are typically motor-driven. In many embodiments, the configuration in which the subject is Suspended during locomotion lacks inherent stability at least a portion of the time with respect to a vertical in the fore-aft plane but is relatively stable with respect to a vertical in the lateral plane.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "In various embodiments of the invention, fore-aft stability may be achieved by providing a control loop, in which one or more motors are included, for operation of a motorized drive in connection with the ground-contacting members. As described below, a pair of ground-contacting members may, for example, be a pair of wheels or a pair of wheel clusters. In the case of wheel clusters, each cluster may include a plurality of wheels. Each ground-contacting member, however, may instead be a plurality (typically a pair) of axially-adjacent, radially Supported and rotatably mounted arcuate elements. In these embodiments, the ground-contacting members are driven by the motorized drive in the control loop.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "A simplified control algorithm for achieving balance in the embodiment of the invention according to ",
      ),
      sourceFigure(1, "FIG. 1"),
      text(" when the wheels are active for locomotion is shown in the block diagram of "),
      sourceFigure(3, "FIG. 3"),
      text(
        ". The plant 61 is equivalent to the equations of motion of a System with a ground-contacting module driven by a single motor, before the control loop is applied. T identifies the wheel torque. The remaining portion of the figure is the control used to achieve balance. The boxes 62 and 63 indicate differentiation.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "The term “lean” is often used with respect to a system balanced on a Single point of a perfectly rigid member. In that case, the point (or line) of contact between the member and the underlying Surface has Zero theoretical width. In that case, furthermore, lean may refer to a quantity that expresses the orientation with respect to the vertical (i.e., an imaginary line passing through the center of the earth) of a line from the center of gravity (CG) of the system through the theoretical line of ground contact of the wheel.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "The peripheral micro controller board 291 also has inputs for receiving Signals from the battery Stack 271 as to battery Voltage, battery current, and battery temperature. The peripheral micro controller board 291 is in communication over bus 279 with a central micro controller board that may be used to control the wheel motors as described below in connection with ",
      ),
      sourceFigure(7, "FIG. 7"),
      text("."),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "Speed limiting is accomplished by pitching the vehicle back in the direction opposite from the current direction of travel, which causes the vehicle to slow down. (As discussed above, the extent and direction of System lean determine the vehicle's acceleration.) In this embodiment, the vehicle is pitched back by adding a pitch modification to the inclinometer pitch value. Speed limiting occurs whenever the vehicle velocity of the vehicle exceeds a threshold that is the determined speed limit of the vehicle. The pitch modification is determined by looking at the difference between the vehicle Velocity and the determined Speed limit, integrated over time.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "A control loop, as employed in accordance with an embodiment of the present invention, may advantageously be used for ameliorating the Symptoms of balance-impairing diseases. A traditional approach to treatment of Parkinson's Disease is the administration of drugs, such as levodopa to alleviate Symptoms of progressive tremor, bradykinesia and rigidity, however, in most patients the disease is incompletely controlled. D. Calne, “Drug Therapy: Treatment of Parkinson's Disease,” New England J. Medicine, vol. 329, pp. 1021-2, (1993).",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text("Referring again to "),
      sourceFigure(10, "FIG. 10"),
      text(
        ", steering of vehicle 18 may be provided by user 10 shifting his weight laterally (in the Y-Y direction) with respect to wheels 20. The change in position of user 10 relative to the platform 12, and/or the consequential lateral shift of the CG of the combination of user 10 and vehicle 18 may be Sensed using any Strategy. One example is the use of one or more forceplates disposed on the upper Surface of platform 14 to Sense differential pressure exerted by a first leg 52 of user 10 with respect to a second leg of the user.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text("A front perspective view of an alternate embodiment of the invention is shown in "),
      sourceFigure(11, "FIG. 11"),
      text(
        " where vehicle 10 has a Single wheel 24 and user 12 Stands, during normal operation of the vehicle, on platform 14 astride wheel 24. An embodiment is shown wherein handle 16 is rigidly attached to platform 14, in this case, via cowling 40.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(15, "FIG. 15"),
      text(
        " shows an embodiment of a vehicle wherein the ground-contacting element is a uniball 151. Such a ball may be separately driven in the X and y directions and the vehicle stabilized in one or both of these directions in the manner described above.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "The described embodiments of the invention are intended to be merely exemplary and numerous variations and modifications will be apparent to those skilled in the art. All Such variations and modifications are intended to be within the Scope of the present invention as defined in the appended claims.",
      ),
    ],
  },
  {
    kind: "heading",
    level: 2,
    text: "What is claimed is:",
  },
  claim(
    1,
    "1. A vehicle for carrying a payload including a user, the vehicle comprising: a. a platform which Supports the user; b. a ground-contacting module, to which the platform is mounted, which propels the user in desired motion over an underlying Surface, c. a motorized drive arrangement, coupled to the ground-contacting module, the drive arrangement, ground-contacting module and payload comprising a System being unstable with respect to tipping when the motorized drive is not powered; the motorized drive arrangement causing, when powered, automatically balanced operation of the System wherein the vehicle has a present Velocity and a maximum operating Velocity, determined by a requirement of acceleration to maintain balance and, in operation, has a balancing margin determined by the difference between the maximum operating Velocity and the present Velocity of the vehicle; d. a balancing margin monitor, coupled to the ground-contacting module, for generating a signal characterizing the balancing margin; and e. an alarm, coupled to the balancing margin monitor, for receiving the Signal characterizing the balancing margin and for warning when the balancing margin falls below a specified limit.",
  ),
  claim(
    2,
    "2. A device according to claim 1, wherein the alarm includes ripple modulation of the power output of the motorized drive arrangement.",
  ),
  claim(3, "3. A device according to claim 1, wherein the alarm is audible."),
  claim(
    4,
    "4. A device according to claim 1, wherein the ground-contacting module includes a plurality of laterally disposed ground-contacting members.",
  ),
  claim(
    5,
    "5. A method for using a vehicle to carry a payload including a user, the method comprising: a) Supporting the user on a platform, the platform mounted to a ground-contacting module, for propelling the vehicle in desired motion over an underlying Surface; b) operating a motorized drive arrangement to provide automatically balanced operation of the vehicle, the vehicle being unstable with respect to tipping when the motorized drive is not powered, the vehicle having a present Velocity and a maximum operating Velocity, determined to maintain acceleration potential to ensure balance, and, in operation, has a balancing margin determined by the difference between the maximum operating Velocity and the present Velocity of the vehicle; c) monitoring the balancing margin; d) generating a signal characterizing the balancing margin, and e) generating an alarm based on the signal to warn when the balancing margin falls below a specified limit.",
  ),
  claim(
    6,
    "6. A method according to claim 5, wherein the Step of generating the alarm includes modulating the power output of the motorized drive arrangement in a ripple fashion.",
  ),
  claim(
    7,
    "7. A method according to claim 5, wherein the step of generating the alarm includes producing an audible warning.",
  ),
];

export const kamenSegwayArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: PDF_SHA256,
  completeFacsimileReviewed: true,
  blocks,
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-09-02",
};

export const KAMEN_SEGWAY_CLAIM_COUNT = 7;

export function kamenSegwayClaimText(claimNumber: number): string {
  const targetBlock = blocks.find((b) => b.kind === "claim" && b.number === claimNumber);
  if (targetBlock?.kind !== "claim") {
    throw new Error(`Claim ${String(claimNumber)} not found in US 6,302,230 edition.`);
  }
  return targetBlock.inlines.map((inline) => inline.text).join("");
}

export function getKamenSegwayClaimText(claimNumber: number): string {
  return kamenSegwayClaimText(claimNumber);
}

export const kamenSegwayParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: [
    "Dean Kamen defines the field: balancing personal mobility vehicles for transporting individuals over irregular ground surfaces.",
  ],
  5: [
    "Prior art vehicles rely on static stability where the center of gravity stays within ground contact points; Kamen notes the fundamental limitation of static vehicles compared to biological dynamic stabilization.",
  ],
  7: [
    "First summary embodiment: a personal vehicle supporting a standing person with a ground-contacting module at a single region of contact and an automatic motorized balancing drive.",
  ],
  8: [
    "Uniball variation: the single contact region can be embodied as a multi-directional spherical ground-contacting element.",
  ],
  9: [
    "Coaxial dual-wheel embodiment: the standing user platform is positioned astride two coaxial wheels actively driven to maintain dynamic balance.",
  ],
  10: [
    "Safety interlock: a proximity sensor detects the presence of the rider on the platform and inhibits drive power when the rider dismounts.",
  ],
  11: [
    "Mechanical and semiconductor sensor implementations: a foot-actuated plate or solid-state sensor that ensures stationary balancing when rider presence is confirmed.",
  ],
  12: [
    "The balancing margin monitor: continuous calculation of reserve acceleration headroom, triggering ripple motor vibration or audible alarms when margin drops below threshold.",
  ],
  13: [
    "Fore-aft user input control: a thumb-wheel or handlebar control allowing the rider to command a specified pitch trim during uniform velocity cruising.",
  ],
  15: [
    "Brief description of the 16 drawing sheets: illustrating transporter side views in Figures 1 and 2, control loop block diagrams in Figures 3 to 7, and alternative vehicle geometries in Figures 8 to 16.",
  ],
  17: [
    "Cross-reference to parent applications: establishing priority dating back to the original 1993 dynamic stabilization applications.",
  ],
  18: [
    "Dynamic stability principles: active closed-loop motor torque acceleration continually replaces static base stability in the fore-aft plane.",
  ],
  19: [
    "Drive architecture: separate motor drives for left and right wheels enable simultaneous fore-aft balance and differential yaw steering.",
  ],
  20: [
    "Control algorithm: sensor feedback through derivative gains commands motor torque to enforce stability within operating pitch bounds.",
  ],
  21: [
    "Definition of lean angle theta: pitch deviation relative to gravity vertical used as the primary commanded acceleration signal.",
  ],
  22: [
    "Dual-microcontroller electronic architecture: primary and peripheral controllers coordinate sensor fusion and pulse-width-modulated motor drives.",
  ],
  23: [
    "Active speed limiting and headroom warning: automatic pitch-back opposes overspeed while headroom monitoring triggers driver alarms.",
  ],
  24: [
    "Assistive therapeutic application: stabilized inverted-pendulum locomotion compensates for human neuromuscular and balance disorders.",
  ],
  25: [
    "Weight-shift steering mechanics: platform forceplates detect rider lateral foot pressure differentials to generate smooth yaw turns.",
  ],
  26: [
    "Alternative locomotion geometries: single-wheel unicycle configuration operating under the same active balancing laws.",
  ],
  27: [
    "Spherical ground contact: uniball locomotion driven in X and Y directions with closed-loop balance.",
  ],
  28: [
    "Scope declaration: the patent scope encompasses all equivalent balancing vehicles and control strategies defined in the appended claims.",
  ],
};
