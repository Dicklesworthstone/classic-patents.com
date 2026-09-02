import type { Patent, PatentClaim } from "@/types/patent";
import {
  robotEndEffectorArchivalEdition,
  robotEndEffectorClaimText,
} from "../editions/robotEndEffectorEdition";

const patentId = "us-4765668-robot-end-effector";

function decodedClaim(
  number: number,
  isIndependent: boolean,
  explanation: string,
  innovations: string[],
  dependsOn?: number[],
  legalSignificance?: string,
): PatentClaim {
  return {
    number,
    isIndependent,
    ...(dependsOn ? { dependsOn } : {}),
    originalText: robotEndEffectorClaimText(number),
    plainEnglish: `${explanation} Its legal boundary is the stated mechanical combination, not the general idea of a robot hand, a ball screw, a parallel gripper, or interchangeable tooling. The grant supplies the preferred embodiment's topology and several prototype values, but not a general workpiece shape, friction coefficient, payload, contact-pressure law, or robot-arm geometry.`,
    keyInnovations: innovations,
    ...(legalSignificance ? { legalSignificance } : {}),
  };
}

export const robotEndEffectorPatent: Patent = {
  id: patentId,
  patentNumber: "US 4,765,668",
  title: "Robot End Effector",
  shortTitle: "Slocum–Jurgens Double-Handed Robot End Effector",
  subtitle: "Opposed-Thread Ball Screws, Interchangeable Fingers, and Symmetric Machine Tending",
  inventors: ["Alexander H. Slocum", "Peter A. Jurgens"],
  inventorLocation: "McLean, Virginia; Kirkland, Washington",
  grantDate: "1988-08-23",
  filingDate: "1987-06-26",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Industrial Robotics & Machine Tending",
  summary:
    "US 4,765,668 claims a robot-mounted end effector with opposed left- and right-hand ball-screw threads that move paired hands symmetrically about a fixed midpoint. Its principal forms add a second, opposite-side hand pair, enclosed motors and gears, removable dovetail-mounted fingers, a transverse connector axis, and rotation about the frame's longitudinal axis. The preferred embodiment describes a double-handed gripper for tending machine tools, including a 5 mm screw lead, 43 mm/s maximum hand travel, 0.05 mm reported repeatability, and a typical 6-inch jaw opening.",
  heroQuote:
    "The linearity of the ball screw and the symmetrical mounting of the hands ensure that the gripping center-point of the fingers is repeatable and remains fixed with respect to gripper 10.",
  originalPdfUrl: "/patents/pdfs/us-4765668-robot-end-effector.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4765668A/en",
  usptoClassification: "B25J 15/08; U.S. 294/88; 294/864; 294/119.1; 414/736; 901/37; 901/39",
  archivalEdition: robotEndEffectorArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-4765668-robot-end-effector-reviewed.txt",
    pageCount: 10,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (JadeHeron)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "654ed8b094309e39412debba71117f177602c1557ade8d9865f834a1d9e84485",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "ROBOT END EFFECTOR",
        sourceRelationship: "Printed masthead, abstract, classifications, and cited references.",
      },
      {
        page: 2,
        exactSourceText: "Sheet 1 of 4",
        sourceRelationship: "Printed drawing sheet containing Figures 1 and 6.",
      },
      {
        page: 3,
        exactSourceText: "Sheet 2 of 4",
        sourceRelationship: "Printed drawing sheet containing Figure 2.",
      },
      {
        page: 4,
        exactSourceText: "Sheet 3 of 4",
        sourceRelationship: "Printed drawing sheet containing Figure 3.",
      },
      {
        page: 5,
        exactSourceText: "Sheet 4 of 4",
        sourceRelationship: "Printed drawing sheet containing Figures 4 and 5.",
      },
      {
        page: 6,
        exactSourceText: "FIELD OF THE INVENTION",
        sourceRelationship: "Opening specification, background, and summary.",
      },
      {
        page: 7,
        exactSourceText: "BRIEF DESCRIPTION OF THE DRAWINGS",
        sourceRelationship: "Drawing list and preferred embodiment through gear train values.",
      },
      {
        page: 8,
        exactSourceText: "Fingers 22 and 23 can be easily and removably inserted",
        sourceRelationship:
          "Hands, finger-change mechanism, connector, and repeatability description.",
      },
      {
        page: 9,
        exactSourceText: "We claim:",
        sourceRelationship: "End of specification and claims 1 through 12.",
      },
      {
        page: 10,
        exactSourceText: "13. The robot end effector or gripper",
        sourceRelationship: "Claims 13 through 20 and printed end matter.",
      },
    ],
  },
  originalText: `ROBOT END EFFECTOR

The present invention relates to manipulating devices, and in particular relates to an end effector or gripper attachable to a robot for mechanically grasping and orienting objects.

According to the present invention, a robot end effector or gripper comprises a manipulator having a frame and a left and right hand threaded ball screw mounted on the frame and rotatable by a motor. A pair of hands are threadingly engaged by the ball screw such that upon rotation of the ball screw in one direction the hands are moved relatively apart and upon rotation of the ball screw in the other direction, the hands are moved relatively toward one another. A pair of gripper fingers are removably mounted on the hands.

In a particular embodiment, the end effector is elongate and symmetrical about its longitudinal axis, the pair of hands being mounted on one side of the axis and a further pair of hands being mounted on a second ball screw located on the other side of the axis.`,
  plainEnglishExplanation: {
    overview:
      "The practical problem is not simply to close a pair of jaws. A machine-tending robot may need to extract a finished part, present the other side, load a blank, use a different contact shape for another tool, and put each object back on the same center line. Slocum and Jurgens answer with an elongated double hand. On either side of its symmetric frame, a left/right-hand ball screw moves two hands by equal and opposite amounts. Removable dovetail fingers turn the hand into an exchangeable interface, while the connector supplies source-described rotation and transverse translation. The legal scope is the claimed combination of those organs, not all robotic grippers.",
    coreMechanism:
      'For one opposed-thread screw with lead $\\ell=0.005\\ \\mathrm{m/rev}$, a screw rotation $\\theta$ moves one hand by $x=\\ell\\theta/(2\\pi)$ and the opposed hand by $-x$. Their relative opening is therefore $g=2x=\\ell\\theta/\\pi$ while their midpoint remains fixed in the ideal kinematics. The preferred embodiment reports a 5 mm lead, a 43 mm/s maximum travel along the screw, a typical 0.1524 m jaw opening, and repeatability no worse than 0.00005 m over its grip-force range. It also prints a maximum gripping-force pair with inconsistent SI/imperial values—"2000 N (1555 lbs.)"—so the exhibit preserves the explicit 2,000 N value as a labeled source datum and never silently converts or reconciles the conflicting parenthesis. Contact pressure, payload capacity, and pressure-to-force transfer are not printed and are refused rather than fabricated.',
    mechanicalBreakdown: [
      {
        title: "Opposed-Thread Ball Screw",
        summary:
          "A right-hand and left-hand portion on one screw drive two nuts in equal and opposite longitudinal directions around an unthreaded center section.",
        technicalDetails:
          "With screw lead $\\ell$, one hand has displacement $x=\\ell\\theta/(2\\pi)$ and the pair's gap changes by $g=\\ell\\theta/\\pi$. The cancellation in the mean position, $(x+(-x))/2=0$, is why symmetric thread and hand placement can hold the gripping midpoint. The source supplies $\\ell=5\\ \\mathrm{mm/rev}$ for one prototype; it does not give backlash, stiffness, acceleration, or a contact model.",
        archaicTerm: "left and right hand threaded ball screw",
        modernEquivalent: "dual-opposed recirculating-ball linear actuator",
      },
      {
        title: "Double-Handed Symmetric Frame",
        summary:
          "Upper and lower cylindrical members, joined by a central web, carry a pair of independently driven hand sets on opposite transverse sides.",
        technicalDetails:
          "Claim 3 adds the second ball screw, second pair of hands, and second pair of removable fingers. In the specification, symmetry lets one workpiece be removed while another is already available on the opposite hand. The patent gives the structural layout but no source-verified overall length, mass, robot payload, or center-of-mass position, so the 3D model's proportions are explicitly illustrative.",
        archaicTerm: "upper and lower cylinders",
        modernEquivalent: "parallel tubular structural rails around a central web",
      },
      {
        title: "Motor, Spur Gears, and Eight-Count Encoder",
        summary:
          "Each motor turns a screw through a two-spur gear train; eight pegs and an inductive switch provide a coarse rotational count.",
        technicalDetails:
          "The printed prototype gives 35.6 mm and 48.3 mm pitch diameters, so its ideal screw-to-motor angular-speed ratio is $35.6/48.3$. Eight pegs give eight counts per motor-gear revolution. The source reports a separate maximum travel figure, but its motor-speed and travel figures do not establish a single verified dynamic operating point; the visual shows deterministic kinematics and labels source data instead of pretending to solve a pneumatic drive model.",
        archaicTerm: "inductive proximity switch",
        modernEquivalent: "non-contact magnetic/inductive rotational encoder sensor",
      },
      {
        title: "Dovetail Finger Change",
        summary:
          "A projecting dovetail tenon, hand channel, fixed bosses, and spring-loaded detent make each grasping finger a slide-in mechanical tool interface.",
        technicalDetails:
          "The bosses locate the inserted finger, the detent retains it, and the tapered dovetail centers it under load. The source describes changing fingers by closing into an auxiliary fixture, then opening to leave them behind. This defines a process and retention geometry, not a claim that any arbitrary object will be securely held without knowing finger shape, material, coefficient of friction, or object mass.",
        archaicTerm: "tenon",
        modernEquivalent: "projecting dovetail slide key",
      },
      {
        title: "Rotation and Transverse Connector",
        summary:
          "The robot connector may rotate the frame about its long axis and a double piston assembly may move it transversely, with a linear transducer for position feedback.",
        technicalDetails:
          "Claims 16 and 17 separately protect transverse reciprocation and at least partial axial rotation. The connector's actual robot-side form, stroke, bore, supply pressure, bearing preload, and sensor resolution are not supplied. The teaching visual therefore lets the visitor select source-described axial rotation but does not claim a historical 6-DOF arm or calculate unprinted piston force.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Screw lead kinematics",
        formula: "$x=\\ell\\theta/(2\\pi),\\qquad g=\\ell\\theta/\\pi$",
        explanation:
          "A screw lead ℓ is linear travel per revolution. Opposite thread hands translate in opposite directions, doubling jaw-gap change while keeping an ideal midpoint stationary. The live exhibit uses the disclosed 5 mm prototype lead.",
      },
      {
        principle: "Ideal screw force / torque relation",
        formula: "$F=2\\pi\\eta T/\\ell$",
        explanation:
          "For an idealized screw, torque T and efficiency η determine axial force F for lead ℓ. The patent reports up to 90% screw efficiency, but it does not provide the full torque at the screw under the quoted grip measurement, contact geometry, or loss chain, so the exhibit does not promote this relation into an asserted historical grip-force calculation.",
      },
      {
        principle: "Symmetric-midpoint error",
        formula: "$m=(x_L+x_R)/2$",
        explanation:
          "If equal-and-opposite hand displacements are x and −x, their midpoint m remains at zero. Backlash, unequal compliance, and unequal loading would perturb that ideal; the grant reports a repeatability result but does not provide enough measurements for a stiffness or error-budget model.",
      },
      {
        principle: "Eight-count encoder quantization",
        formula: "$\\Delta\\theta=2\\pi/8$",
        explanation:
          "Eight pegs sensed by one inductive switch correspond to eight count positions per sensed gear revolution. The source does not describe interpolation, control bandwidth, or whether this count alone supplied final position accuracy.",
      },
    ],
    whyItMattersToday:
      "Industrial end effectors remain where a robot's abstract motion becomes a physical commitment to a workpiece. This grant is a lucid museum object because it separates the jobs that are often blurred together: symmetric width adjustment, exchangeable contact tooling, simultaneous handling on opposite sides, axial rotation, and transverse positioning. Modern grippers may use different drives, sensors, safety systems, and software, but an engineer can still trace why a fixed midpoint and a fast finger-change interface matter in a machine-tending cell.",
  },
  claims: [
    decodedClaim(
      1,
      true,
      "Claim 1 defines the core single-sided hand: an elongate frame, a motor-driven ball screw with left- and right-hand portions, two guided hands that move symmetrically around the screw midpoint, two grasping fingers, and removable mounting for each finger. The symmetrical pairing and automatic finger mount/dismount provision do the central legal work.",
      ["Opposed-thread ball screw", "Symmetric paired hands", "Automatically exchangeable fingers"],
      undefined,
      "Principal independent claim for the symmetric ball-screw hand and removable-finger combination.",
    ),
    decodedClaim(
      2,
      false,
      "Claim 2 narrows claim 1 to the long-and-short-axis rectangular frame and hands that extend transversely while moving longitudinally. It protects the particular spatial arrangement that keeps the tool thin in one direction and gives the fingers transverse reach.",
      ["Rectangular symmetric frame", "Transverse hand extension"],
      [1],
    ),
    decodedClaim(
      3,
      false,
      "Claim 3 adds the opposite-side second screw, second pair of hands, and second pair of removable fingers. Its additional legal work is the double-handed architecture, not merely supplying more optional fingers to a conventional one-sided gripper.",
      [
        "Second opposed-thread screw",
        "Opposite-side double hand",
        "Second exchangeable finger pair",
      ],
      [1],
    ),
    decodedClaim(
      4,
      false,
      "Claim 4 limits the claim 1 frame to an integral upper cylinder, lower cylinder, and central web. The claim covers the specific three-member frame organization that carries the hand and drive components.",
      ["Upper cylinder", "Central web", "Lower cylinder"],
      [1],
    ),
    decodedClaim(
      5,
      false,
      "Claim 5 further requires the central web's longitudinal bore. In the described embodiment that bore reduces material and can route electrical wires or pipes; this dependent claim is structural rather than a broad claim to all cable routing.",
      ["Longitudinal web bore", "Utility routing passage"],
      [4],
    ),
    decodedClaim(
      6,
      false,
      "Claim 6 puts the motor inside one of the upper or lower cylinders. It narrows the frame concept to an enclosed drive placement, without claiming every motor that happens to be near a robot gripper.",
      ["In-cylinder motor", "Enclosed rotary actuator"],
      [4],
    ),
    decodedClaim(
      7,
      false,
      "Claim 7 adds a motor shaft extending out of the cylinder and a gear train between that shaft and the ball screw end. It covers the stated rotary power path from enclosed motor to screw.",
      ["External motor shaft", "Ball-screw gear train"],
      [6],
    ),
    decodedClaim(
      8,
      false,
      "Claim 8 narrows the gear train to meshing first and second spur gears and adds co-operating means that report rotation of one gear. The source's eight pegs and inductive switch are the preferred encoder example, but the claim language sets the legal combination.",
      ["Meshing spur gears", "Gear-rotation signal", "Encoder sensing pair"],
      [7],
    ),
    decodedClaim(
      9,
      false,
      "Claim 9 is an alternative dependent route from claim 1: a motor-driven shaft and a gear train connect it to the ball-screw end. It preserves a shorter formulation of the drive transmission without importing all the enclosure details of claims 4 through 8.",
      ["Motor-driven shaft", "Screw-end gear train"],
      [1],
    ),
    decodedClaim(
      10,
      false,
      "Claim 10 makes claim 9's gear train a first spur gear on the shaft and a meshing second spur gear on the ball-screw end. It identifies the two-gear mechanical reduction or increase rather than a generic torque transmission.",
      ["Two-spur-gear train", "Screw-end driven gear"],
      [9],
    ),
    decodedClaim(
      11,
      true,
      "Claim 11 is a second independent formulation that combines the symmetric hands and removable fingers with a driven shaft, meshing spur gears, and a pair of rotation-signal means. It protects a complete mechanically driven, sensed single-hand package.",
      ["Symmetric screw hand", "Meshing gear drive", "Rotation indication"],
      undefined,
      "Independent claim that integrates the drive and rotation-sensing arrangement with the symmetric hand.",
    ),
    decodedClaim(
      12,
      false,
      "Claim 12 narrows claim 1 by selecting a pneumatically driven motor. It does not claim pneumatic gripping in the abstract; it relies on the full parent hand, screw, and removable-finger arrangement.",
      ["Pneumatic rotary motor", "Parent gripper architecture"],
      [1],
    ),
    decodedClaim(
      13,
      false,
      "Claim 13 specifies the physical finger slide: a hand extends transversely, an outward stop is present, and a rail and channel on opposite components permit disengagement only inward. This prevents the removable-finger idea from becoming an unlimited claim to every detachable jaw.",
      ["Finger stop", "Rail-and-channel slide", "Inward-only removal"],
      [1],
    ),
    decodedClaim(
      14,
      false,
      "Claim 14 further sets claim 13's rail and channel to a dovetail shape. The tapered geometry is the added legal limitation that supplies alignment and resistance to transverse withdrawal.",
      ["Dovetail rail", "Dovetail channel"],
      [13],
    ),
    decodedClaim(
      15,
      false,
      "Claim 15 adds a releasably engageable catch that retains the finger on the hand. The specification's spring-loaded detent illustrates that retention role, but the claim is defined by its stated catch requirement.",
      ["Releasable finger catch", "Retention mechanism"],
      [13],
    ),
    decodedClaim(
      16,
      false,
      "Claim 16 adds means to reciprocally move the whole frame in a transverse direction. It claims another end-effector axis in combination with the parent gripper, not every transverse robot slide.",
      ["Transverse frame translation", "Reciprocal motion axis"],
      [1],
    ),
    decodedClaim(
      17,
      false,
      "Claim 17 adds mounting that permits at least partial rotation about the frame's longitudinal axis. That makes the source-described part-turning operation a distinct limitation alongside the symmetric gripping mechanism.",
      ["Longitudinal-axis rotation", "Rotatable robot connector"],
      [1],
    ),
    decodedClaim(
      18,
      true,
      "Claim 18 is a third independent frame-and-hand formulation: an elongate web with cylinders on either side, hands sliding around one cylinder while engaging the web, and selected reciprocal sliding that brings them together or apart. It protects the guided structural arrangement even without reciting the full removable-finger language of claim 1.",
      ["Web-and-cylinder frame", "Guided cylindrical hand slide", "Reciprocal hand motion"],
      undefined,
      "Independent claim focused on the frame/hand guide topology.",
    ),
    decodedClaim(
      19,
      false,
      "Claim 19 narrows claim 18 to a motor inside one cylinder and a coplanar elongated screw on the side opposite the web, operatively connected to the hands. It ties the source's internal drive layout to the guided hand structure.",
      ["Coplanar motor and screw", "Cylinder-mounted drive", "Operative hand connection"],
      [18],
    ),
    decodedClaim(
      20,
      false,
      "Claim 20 adds the further opposite-side pair of hands and the further motor and connection means in the other cylinder. It is the dependent claim that states the two independently driven hand sets occupy opposite transverse sides of one frame.",
      ["Further hand pair", "Further cylinder motor", "Opposite transverse hand sets"],
      [19],
    ),
  ],
  drawings: [
    {
      figureNumber: "1",
      title: "Double-handed gear-end assembly",
      caption:
        "Source Figure 1: frame 12, opposing upper/lower hand pairs, removable fingers, gears 66 and 68, pegs 72, switch 74, and connector-side features.",
      svgType: "robot-end-effector",
      callouts: [
        {
          id: "frame",
          figureRef: "Fig. 1",
          label: "Symmetric frame",
          element: "12",
          description: "Elongated frame with upper/lower cylinders and central web.",
          x: 49,
          y: 56,
        },
        {
          id: "hands",
          figureRef: "Fig. 1",
          label: "Hands",
          element: "14, 16, 18, 20",
          description: "Two guided pairs that move along their screws.",
          x: 49,
          y: 54,
        },
        {
          id: "fingers",
          figureRef: "Fig. 1",
          label: "Removable fingers",
          element: "22–25",
          description: "Exchangeable grasping interfaces on the four hands.",
          x: 50,
          y: 26,
        },
        {
          id: "gears",
          figureRef: "Fig. 1",
          label: "Gear train",
          element: "62",
          description: "Spur-gear drive between motor shaft and ball screw.",
          x: 83,
          y: 55,
        },
        {
          id: "encoder",
          figureRef: "Fig. 1",
          label: "Eight-count encoder",
          element: "72, 74",
          description: "Pegs sensed by an inductive proximity switch.",
          x: 88,
          y: 60,
        },
      ],
    },
    {
      figureNumber: "2–6",
      title: "Connector, cross section, and finger interface",
      caption:
        "Source Figures 2–6: robot-side connector and transverse axis, ball-screw cross section, gear-end and connector-end elevation, and hand top plan with dovetail channel.",
      svgType: "robot-end-effector",
      callouts: [
        {
          id: "ballscrew",
          figureRef: "Fig. 3",
          label: "Opposed-thread ball screw",
          element: "40, 56, 58, 60",
          description:
            "Right/center/left thread arrangement that symmetrically moves each hand pair.",
          x: 55,
          y: 56,
        },
        {
          id: "motor",
          figureRef: "Fig. 3",
          label: "Air motor",
          element: "34",
          description: "Preferred rotary actuator inside the upper cylinder.",
          x: 49,
          y: 58,
        },
        {
          id: "dovetail",
          figureRef: "Fig. 4",
          label: "Dovetail finger mount",
          element: "92, 108",
          description: "Tapered channel and tenon for removable fingers.",
          x: 22,
          y: 35,
        },
        {
          id: "transverse",
          figureRef: "Fig. 5",
          label: "Transverse mechanism",
          element: "134",
          description: "Double piston-and-cylinder connector mechanism.",
          x: 47,
          y: 57,
        },
        {
          id: "detent",
          figureRef: "Fig. 6",
          label: "Detent cavity",
          element: "98, 99",
          description: "Retention location for the spring-loaded finger detent.",
          x: 50,
          y: 56,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Machine-tool tending demands repeatable grasping, part turning, and rapid change of the contact geometry without replacing a complete end effector or leaving the cell idle for a lengthy adjustment.",
    priorArtLimitations: [
      "The specification says ordinary parallel-jaw grippers can be mechanically and electrically simple, but cannot reorient a gripped part and require a known presentation orientation.",
      "The source says different part shapes often require different hands, with adjustment work disabling the robot, while very flexible accurate manipulators can become mechanically/electrically complex and lose grip-force-to-weight advantage.",
    ],
    breakthroughInsight:
      "Use opposed screw threads to hold a symmetric gripping midpoint, duplicate that mechanism on the other side of a narrow structural frame, and make the fingers—not the whole hand—the exchangeable machine-tending interface.",
    patentWars: [],
    civilizationalImpact:
      "The grant makes industrial end-effector design inspectable at the level that matters in a workcell: a machine needs not only a robot arm but a repeatable way to meet varied parts, transfer them, turn them, and exchange contact tooling. This record does not claim that this particular design dominated the market; it preserves the document's concrete design response to that engineering problem.",
    aftermath:
      "No priority contest or infringement dispute is asserted for this record. The archival account stays with the published grant, its continuation statement, its twenty printed claims, and the preferred machine-tending embodiment rather than inferring later commercial use from a citation list.",
    sideNotes: [
      "The preferred-embodiment sentence prints “2000 N (1555 lbs.)”; those quantities are not equivalent. The source face preserves the text, and the model does not use the parenthetical conversion as an independent performance fact.",
      "The grant identifies the original assignee as the United States of America represented by the Secretary of Commerce, not a private robot manufacturer.",
    ],
  },
  tags: [
    "robotics",
    "end effector",
    "parallel gripper",
    "machine tending",
    "ball screw",
    "interchangeable tooling",
  ],
  stats: { totalClaims: 20, independentClaims: 3 },
};
