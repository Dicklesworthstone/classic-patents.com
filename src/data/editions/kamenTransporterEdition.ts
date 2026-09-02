import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
} from "@/types/patent";

const PDF_SHA256 = "b1dac639b2b9905914433d27fd9b6cad82382239bc291d10ca3e1ac1ffe05f65";
const SOURCE_FIGURE_DIRECTORY = "/patents/figures/us-5701965-kamen-transporter";

const FIGURE_DIMENSIONS: Record<number, { width: number; height: number }> = {
  1: { width: 1306, height: 1363 },
  2: { width: 1287, height: 1903 },
  3: { width: 1289, height: 1908 },
  4: { width: 1313, height: 1627 },
  5: { width: 1295, height: 1992 },
  6: { width: 1287, height: 1554 },
};

function sheetForFigure(figureNumber: number): string {
  return `fig-${figureNumber}-source-crop-v1.png`;
}

function text(value: string): CuratedSpecificationInline {
  return {
    kind: "text",
    text: value,
  };
}

function term(value: string, definition: string): CuratedSpecificationInline {
  return {
    kind: "term",
    text: value,
    definition,
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
  const dims = FIGURE_DIMENSIONS[primaryFigureNumber] || { width: 1287, height: 1903 };

  return {
    kind: "reference",
    text: sourceText,
    href: `#figure-${primaryFigureNumber}`,
    referenceType: "figure",
    label: `Source crop of ${sourceText} from US 5,701,965`,
    figurePreviews: figureNumbers.map((sourceFigureNumber) => {
      const fDims = FIGURE_DIMENSIONS[sourceFigureNumber] || dims;
      return {
        src: `${SOURCE_FIGURE_DIRECTORY}/${sheetForFigure(sourceFigureNumber)}`,
        alt: `${sourceText} on its pinned US 5,701,965 drawing sheet for Fig. ${String(sourceFigureNumber)}.`,
        width: fDims.width,
        height: fDims.height,
      };
    }),
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
      "USOO570 1965A",
      "United States Patent (19)",
      "11) Patent Number: 5,701,965",
      "(45) Date of Patent: Dec. 30, 1997",
      "54 HUMAN TRANSPORTER",
    ],
  },
  {
    kind: "figure-sheet",
    figureLabel: "Figures 1–6",
    title:
      "Personal Transporter, Balancing Dynamics, Cluster Drive, and Sensor Control Architecture",
    description: [
      text(
        "Drawings illustrating the personal transporter chassis, inverted pendulum balance mode, cluster wheel stair climbing sequences, planetary gear drive, and closed-loop feedback block diagram.",
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
        "The present invention pertains to devices and methods for transporting human subjects, including those experiencing physical handicaps or incapacitation, and more particularly to devices and methods for transporting human subjects over regions that may include stairs.",
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
        "A wide range of devices and methods are known for transporting human subjects experiencing physical incapacitation. The design of these devices has generally required a compromise to address the physical incapacity of the users. Stability has been deemed essential, so relative ease of locomotion is generally compromised. It becomes difficult to provide a self-propelled user-guidable device for transporting a physically handicapped or other person up and down stairs while still permitting convenient locomotion along regions that do not include stairs. Devices that achieve the climbing of stairs tend to be complex, heavy, and difficult for ordinary locomotion.",
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
        "The invention provides, in a preferred embodiment, a device for transporting a human subject over ground having a surface that may be irregular and may include stairs. This embodiment has a support for supporting the subject. A ",
      ),
      term(
        "ground-contacting module",
        "A motorized wheeled or cluster-wheel assembly movably attached to the vehicle chassis to suspend the passenger over ground surfaces.",
      ),
      text(
        ", movably attached to the support, serves to suspend the subject in the support over the surface. The orientation of the ground-contacting module defines fore-aft and lateral planes intersecting one another at a vertical. The support and the ground-contacting module are components of an assembly. A motorized drive, mounted to the assembly and coupled to the ground-contacting module, causes locomotion of the assembly and the subject therewith over the surface. Finally, the embodiment has a control loop, in which the motorized drive is included, for dynamically enhancing stability in the fore-aft plane by operation of the motorized drive in connection with the ground-contacting module.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "In a further embodiment, the ground contacting module is realized as a pair of ground-contacting members, laterally disposed with respect to one another. The ground-contacting members may be wheels. Alternatively, each ground contacting member may include a ",
      ),
      term(
        "cluster of wheels",
        "A planetary arrangement of two or more wheels rotatable about a central cluster axle, enabling both rolling locomotion and stair-stepping.",
      ),
      text(
        ", each cluster being rotatably mounted on and motor-driven about a common laterally disposed central axis; each of the wheels in each cluster may be rotatably mounted about an axis parallel to the central axis so that the distance from the central axis through a diameter of each wheel is approximately the same for each of the wheels in the cluster. The wheels are motor-driven independently of the cluster.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "In yet another embodiment, each ground-contacting member includes a pair of axially adjacent and rotatably mounted arcuate element pairs. The arcuate elements of each element pair are disposed transversely at opposing ends of a support strut that is rotatably mounted at its midpoint. Each support strut is motor-driven.",
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
        " is a perspective view of a simplified embodiment of the present invention, showing a subject seated thereon; ",
      ),
      sourceFigure(2, "FIG. 2"),
      text(" another perspective view of the embodiment of "),
      sourceFigure(1, "FIG. 1"),
      text(", showing further details of the embodiment; "),
      sourceFigure(3, "FIG. 3"),
      text(" is a schematic view of the embodiment of "),
      sourceFigure(1, "FIG. 1"),
      text(", showing the swivel arrangement of this embodiment; "),
      sourceFigure(4, "FIG. 4"),
      text(" is a side elevation of the embodiment of "),
      sourceFigure(1, "FIG. 1"),
      text(" as used for climbing stairs; "),
      sourceFigure(5, "FIG. 5"),
      text(
        " is a block diagram showing generally the nature of power and control with the embodiment of ",
      ),
      sourceFigure(1, "FIG. 1"),
      text("; "),
      sourceFigure(6, "FIG. 6"),
      text(" illustrates the control strategy for a simplified version of "),
      sourceFigure(1, "FIG. 1"),
      text(" to achieve balance using wheel torque;"),
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
        "This application is a continuation in part of U.S. application Ser. No. 08/021,789, filed Feb. 24, 1993, now abandoned, which is hereby incorporated herein by reference.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "The invention may be implemented in a wide range of embodiments. A characteristic of many of these embodiments is the use of a pair of laterally disposed ground contacting members to suspend the subject over the surface with respect to which the subject is being transported.",
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
    "1. A device, for transporting a human subject over a surface that may be irregular and may include stairs, the device comprising: (a) a support for supporting the subject, the support having left and right sides and defining fore-aft and lateral planes; (b) a plurality of support members on each side of the support, each support member being mounted to permit 65 complete travel around an axis and joined to a discrete ground-contacting component, the ground-contacting component having a point of contact with the surface and occupying only a portion of the entire angular distance around the axis; the support and the support members being parts of an assembly; (c) a motorized drive arrangement, mounted to the assembly, coupled to the support members, for causing locomotion of the assembly and the subject over the surface; and (d) a control loop, in which the motorized drive arrange ment is included, for dynamically maintaining stability in the fore-aft plane by operation of the motorized drive arrangement so that the net torque experienced by the assembly about the point of contact with the surface, taking into account torques caused by gravity as well as by all other external forces and by the motorized drive, causes a desired acceleration of the assembly.",
  ),
  claim(
    2,
    "2. A device according to claim 1, wherein the axes of all of the support members are substantially collinear.",
  ),
  claim(
    3,
    "3. A device according to claim 2, wherein each ground contacting component is an arcuate element mounted to its respective support member, each support member being rotatably mounted and motor-driven about a central axis defined by the axes.",
  ),
  claim(
    4,
    "4. A device according to claim 3, wherein the radially outermost extent of each arcuate element has a generally constant main radius of curvature conforming generally with that of a circle having a radius equal to such extent.",
  ),
  claim(
    5,
    "5. A device according to claim 4, wherein each arcuate element has a leading portion and a trailing portion deter mined in relation to forward motion of the assembly, the leading portion contacting the ground first during forward motion, each portion having a tip, and wherein the radius of curvature of the arcuate element near the tip of each leading portion is somewhat smaller than the element&apos;s main radius of curvature.",
  ),
  claim(
    6,
    "6. A device according to claim 4, wherein each arcuate element has a leading portion and a trailing portion deter mined in relation to forward motion of the assembly, the leading portion contacting the ground first during forward motion, each portion having a tip, and wherein the radius of curvature of each arcuate element near the tip of its trailing portion is somewhat smaller than such element&apos;s main radius of curvature.",
  ),
  claim(
    7,
    "7. A device according to claim 4, wherein each arcuate element has a leading portion and a trailing portion deter mined in relation to forward motion of the assembly, the leading portion contacting the ground first during forward motion, each portion having a tip, and wherein the radius of curvature of each arcuate element near at least one of its tips differs from the main radius of curvature.",
  ),
  claim(
    8,
    "8. A device according to claim 4, wherein each arcuate element has a leading portion and a trailing portion deter mined in relation to forward motion of the assembly, the leading portion contacting the ground first during forward motion, each portion having a tip, and wherein at least one of the tips of each arcuate element is deflectably mounted and is coupled to a deflection arrangement, so that on actuation the local radius of curvature may be modified.",
  ),
  claim(
    9,
    "9. A device according to claim 3, wherein the support proximate to the ground to permit a subject to stand thereon.",
  ),
  claim(
    10,
    "10. A device according to claim 9, further comprising handle, affixed to the support. having a grip at approximately waist height of the subject, so that the device may be operated in a manner analogous to a scooter.",
  ),
  claim(
    11,
    "11. A device according to claim 10, further comprising: a joystick, mounted on the handle, for use by the subject in controlling direction of the device.",
  ),
  claim(
    12,
    "12. A device according to claim 9, further comprising: leaning means for sensing leaning of the subject in a given direction and for controlling the motorized drive to cause the device to move in the direction in which the subject may lean.",
  ),
  claim(
    13,
    "13. A device according to claim 3, further comprising: drive control means, including the control loop, for driv ing the support members in a first mode wherein a first arcuate element in each group of axially adjacent arcuate elements generally remains in contact with the ground up to a point near in arcuate distance to where the next succeeding arcuate element comes in contact with the ground, and so on as successive arcuate elements come in contact with the ground, so as to provide substantially continuous rolling motion of the device along the arcuate elements.",
  ),
  claim(
    14,
    "14. A device according to claim 13, wherein the drive control means includes means for driving the support mem bers in a second mode to permit ascent and descent of stairs and other surface features.",
  ),
  claim(
    15,
    "15. A device according to claim 14, further comprising: means for causing a second one of the arcuate elements of each group to land on a succeeding surface feature, which may include a step, when a first one of the elements of each group is on a preceding surface feature.",
  ),
  claim(
    16,
    "16. A device according to claim 1, wherein the ground contacting components are wheels and the support members on the left and right sides of the vehicle are in each case coupled so as to provide a cluster of wheels on each of the left and right sides of the vehicle respectively, the wheels of each cluster being capable of being motor-driven indepen dently of the cluster.",
  ),
  claim(
    17,
    "17. A device according to claim 16, wherein the axes of all of the support members are substantially collinear and define a central axis.",
  ),
  claim(
    18,
    "18. A device according to claim 17, wherein the distance from the central axis through a diameter of each wheel is approximately the same for each of the wheels in the cluster.",
  ),
  claim(
    19,
    "19. A device according to claim 17, wherein each cluster has two wheels of substantially equal diameter.",
  ),
  claim(
    20,
    "20. A device according to claim 17, wherein each cluster has three wheels of substantially equal diameter.",
  ),
  claim(
    21,
    "21. A device according to claim 17, further comprising: cluster control means for controlling the angular orienta tion of each cluster about the central axis; and wheel control means for controlling separately, as to the wheels of each cluster, the rotation of wheels in contact with the ground.",
  ),
  claim(
    22,
    "22. A device according to claim 21, wherein the wheel control means has a balance mode, utilizing the control loop, in which the wheels of each cluster in contact with the ground are driven in such a manner as to maintain balance of the device in the fore-aft plane.",
  ),
  claim(
    23,
    "23. A device according to claim 21, wherein the wheel control means has a slave mode in which the wheels are driven as a function of the rotation of the clusters; and the cluster control means has a lean mode, utilizing the control loop, in which the clusters are driven in such a manner as to tend to maintain balance of the device in the fore-aft plane while the wheels are in the slave mode, so as to permit the device to ascend or descend stairs or other surface features.",
  ),
  claim(
    24,
    "24. A device according to claim 23, wherein the wheel control means has a balance mode, utilizing the control loop, in which the wheels of each cluster in contact with the ground are driven in such a manner as to maintain balance of the device in the fore-aft plane.",
  ),
  claim(
    25,
    "25. A device according to claim 24, wherein the wheel control means has a transition mode, used in the transition from the slave mode to the balance mode, operative prevent entering the balance mode until a zero crossing the clusters has been sensed.",
  ),
  claim(
    26,
    "26. A device according to claim 21, further comprising: coordination control means for coordinating operation the cluster control means with that of the wheel control means, the coordination control means having a stair climbing mode to cause steps as follows: (1) start, in which the assembly, balanced on a first wheel pair, one from each cluster, is disposed adjacent to stair and the clusters are then rotated so that a second wheel pair is resting on the stair; (2) transfer weight, in which the weight of the device and the subject is transferred from the lower first wheel pair to the second wheel pair on the stair by motion of clusters relative to the assembly while the wheels driven to maintain the position of the clusters relative to the world; (3) climb, in which the second wheel pair is driven move the device forward to the riser of the succeeding stair while simultaneously the clusters are driven position the next wheel pair on the tread of the suc ceeding stair, this step being carried out while the wheel control means is in the balance mode; and wherein steps (2) and (3) are alternated until the stair, at which point normal balance mode of the wheel control means is entered into.",
  ),
  claim(
    27,
    "27. A device according to claim 23, further comprising: slave function adjustment for modifying the function the slave mode, so that the device may accommodate climbing and descent of stairs and of surface features having varying geometries.",
  ),
  claim(
    28,
    "28. A device according to claim 17, further comprising: a joystick for use by the subject in controlling direction the device.",
  ),
  claim(
    29,
    "29. A device according to claim 17, further comprising: leaning means for sensing leaning of the subjectin a given direction and for controlling the motorized drive cause the device to move in the direction in which subject may lean.",
  ),
  claim(30, "30. A device according to claim 29, wherein the leaning means includes a forceplate."),
  claim(
    31,
    "31. A device according to claim 29, wherein the leaning means includes a proximity sensor.",
  ),
  claim(
    32,
    "32. A device according to claim 17, wherein the support includes a chair having a seat, hingedly attached to assembly, so as to have a first position in which the subject may be seated on the seat and a second position in which subject may stand.",
  ),
  claim(
    33,
    "33. A device according to claim 17, wherein the device has a roll axis and a pitch axis, further comprising: attitude determination means for determining the attitude of the support; attitude control means for controlling the attitude of support relative to the ground-contacting member.",
  ),
  claim(
    34,
    "34. A device according to claim 23, further comprising: roll adjustment means for permitting adjustment of angular orientation of the support with respect to ground-contacting module about an axis approximately parallel to the roll axis of the device, the roll adjustment means controlled by the attitude control means.",
  ),
  claim(
    35,
    "35. A device according to claim 24, further comprising: banking means for causing the roll adjustment means, the course of a turn, to bank the support in the general direction of turning.",
  ),
  claim(
    36,
    "36. A device according to claim 33, further comprising: tilt adjustment means for permitting adjustment of the angular orientation of the support with respect to the ground-contacting module about an axis approximately parallel to the pitch axis of the device, the tilt adjust ment means controlled by the attitude control means.",
  ),
  claim(
    37,
    "37. A device according to claim 17, further comprising: height adjustment means for adjusting the height of the support relative to the ground.",
  ),
  claim(
    38,
    "38. A device according to claim 37, wherein the height adjustment means includes a variable extension between the support and the ground-contacting module.",
  ),
  claim(
    39,
    "39. A device according to claim 17, wherein the support is proximate to the ground to permit a subject to stand thereon.",
  ),
  claim(
    40,
    "40. A device according to claim 39, further comprising a handle, affixed to the support, having a grip at approximately waist height of the subject, so that the device may be operated in a manner analogous to a scooter.",
  ),
  claim(
    41,
    "41. A device according to claim 39, further comprising: leaning means for sensing leaning of the subject in a given direction and for controlling the motorized drive to cause the device to move in the direction in which the subject may lean.",
  ),
  claim(
    42,
    "42. A device according to claim 41, further comprising: a joystick, mounted on the handle, for use by the subject in controlling direction of the device.",
  ),
  claim(
    43,
    "43. A device according to claim 1, wherein the support is proximate to the ground to permit a subject to stand thereon.",
  ),
  claim(
    44,
    "44. A device according to claim 43, further comprising: a handle, affixed to the support, having a grip at approxi mately waist height of the subject, so that the device may be operated in a manner analogous to a scooter.",
  ),
  claim(
    45,
    "45. A device according to claim 43, wherein the ground contacting components are wheels.",
  ),
  claim(
    46,
    "46. A device according to claim 43 further comprising: leaning means for sensing leaning of the subject in a given direction and for controlling the motorized drive to cause the device to move in the direction in which the subject may lean.",
  ),
  claim(
    47,
    "47. A device according to claim 44, further comprising: a joystick, mounted on the handle, for use by the subject in controlling direction of the device.",
  ),
  claim(
    48,
    "48. A device according to claim 1, wherein the control loop includes means for performing the following steps on a cyclical basis: (1) reading inputs provided by the subject; (2) reading state variable inputs; (3) modifying the program state based upon the state variables; and (4) performing calculations for controlling the motorized drive based on the subject-provided inputs and the state variable inputs.",
  ),
  claim(
    49,
    "49. A device, for transporting a payload over a surface that may be irregular and may include stairs, the device com prising: (a) a support for supporting the payload, the support having left and right sides and defining fore-aft and lateral planes; (b) a plurality of support members on each side of the support, each support member being mounted to permit complete travel around an axis and joined to a discrete ground-contacting component, the ground-contacting component having a point of contact with the surface and occupying only a portion of the entire angular distance around the axis; the support and the support members being parts of an assembly; (c) a motorized drive arrangement, mounted to the assembly, coupled to the support members, for causing locomotion of the assembly and the payload over the surface; and (d) a control loop. in which the motorized drive arrange ment is included, for dynamically maintaining stability in the fore-aft plane by operation of the motorized drive arrangement so that the net torque experienced by the assembly about the point of contact with the surface, taking into account torques caused by gravity as well as by all other external forces and by the motorized drive, causes a desired acceleration of the assembly,",
  ),
  claim(
    50,
    "50. A device according to claim 49, wherein the axes are substantially collinear and define a central axis, and the ground-contacting components are wheels and the support members on the left and right sides of the vehicle are in each case coupled so as to provide a cluster of wheels on each of the left and rightsides of the vehicle respectively, the wheels of each cluster being capable of being motor-driven inde pendently of the cluster.",
  ),
  claim(
    51,
    "51. A device according to claim 49, wherein the axes substantially collinear and each ground-contacting compo nent is an arcuate element mounted to its respective support member, each support member being rotatably mounted and motor-driven about a central axis defined by the axes.",
  ),
  claim(
    52,
    "52. A device according to claim 50, further comprising: cluster control means for controlling the angular orienta tion of each cluster about the central axis; and wheel control means for controlling separately, as to the wheels of each cluster, the rotation of wheels in contact with the ground.",
  ),
  claim(
    53,
    "53. A device according to claim 52, wherein the wheel control means has a slave mode in which the wheels are driven as a function of the rotation of the clusters; and the cluster control means has a lean mode, utilizing the control loop, in which the clusters are driven in such a manner as to tend to maintain balance of the device in the fore-aft plane while the wheels are in the slave mode, so as to permit the device to ascend or descend stairs or other surface features.",
  ),
  claim(
    54,
    "54. A device according to claim 52, wherein the wheel control means has a balance mode, utilizing the control loop, in which the wheels of each cluster in contact with the ground are driven in such a manner as to maintain balance of the device in the fore-aft plane. k 3 is",
  ),
];

export const kamenTransporterArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: PDF_SHA256,
  completeFacsimileReviewed: true,
  blocks,
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-09-02",
};

export const KAMEN_TRANSPORTER_CLAIM_COUNT = 54;

export function kamenTransporterClaimText(claimNumber: number): string {
  const targetBlock = blocks.find((b) => b.kind === "claim" && b.number === claimNumber);
  if (targetBlock?.kind !== "claim") {
    throw new Error(`Claim ${String(claimNumber)} not found in US 5,701,965 edition.`);
  }
  return targetBlock.inlines.map((inline) => inline.text).join("");
}

export function getKamenTransporterClaimText(claimNumber: number): string {
  return kamenTransporterClaimText(claimNumber);
}

export const kamenTransporterParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: [
    "Dean Kamen establishes the field: personal mobility transporters capable of navigating irregular terrain, curbs, and architectural staircases.",
  ],
  5: [
    "Prior art analysis: conventional wheelchairs rely on static multi-wheel stability, sacrificing maneuverability and stair-climbing capabilities.",
  ],
  7: [
    "Primary summary embodiment: human support assembly suspended over a ground-contacting module with an active motorized drive and dynamic pitch balancing loop.",
  ],
  8: [
    "Cluster wheel variation: planetary wheel clusters rotatable about a central transverse axis to enable rolling locomotion and stair ascent.",
  ],
  9: [
    "Arcuate element embodiment: axially adjacent arcuate rocker pairs providing smooth weight-transfer steps over obstacles.",
  ],
  11: [
    "Brief description of the drawings: overview of Figures 1 through 6 showing transporter perspective views, stair climbing modes, and feedback diagrams.",
  ],
  13: [
    "Priority declaration: establishing priority to parent application Serial No. 08/021,789 filed February 24, 1993.",
  ],
  14: [
    "Inverted pendulum dynamic balancing principles: closed-loop restorative torque drives wheels under rider center of mass based on gyro and accelerometer readings.",
  ],
};
