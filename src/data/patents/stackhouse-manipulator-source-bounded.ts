import type { Patent } from "@/types/patent";

/**
 * Source-bounded catalogue shell for US 4,068,536.
 *
 * The retained research edition and ledger were found to contain reconstructed
 * prose and claims that do not match the pinned facsimile. They remain on disk
 * for audit history, but the public record carries no reviewed-ledger claim and
 * exposes no claim decoders or source drawings until a clean facsimile review
 * replaces them.
 */
export const stackhouseManipulatorPatent: Patent = {
  id: "us-4068536-stackhouse-manipulator",
  patentNumber: "US 4,068,536",
  title: "Manipulator",
  shortTitle: "Stackhouse Intersecting-Axis Robot Wrist",
  subtitle: "Concentric drive shafts, oblique roll axes, and a common orientation point",
  inventors: ["Theodore Hahn Stackhouse"],
  inventorLocation: "Cincinnati, Ohio",
  grantDate: "1978-01-17",
  filingDate: "1976-12-23",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Industrial Robotics & Manipulator Kinematics",
  summary:
    "Stackhouse's grant describes a remotely operable robot wrist built from serial drive shafts, including two independently rotatable concentric-shaft sets on oblique axes and a third shaft. In the preferred arrangement the three axes intersect at one point, allowing the terminal axis to sweep a continuous spherical sector while hydraulic motors remain back at the elbow.",
  heroQuote:
    "The invention's unique organizational and positional arrangement of drive members permits three serially connected rotary shafts with axes intersecting at a single point to undergo continuous “rolls”.",
  originalPdfUrl: "/patents/pdfs/us-4068536-stackhouse-manipulator.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4068536A/en",
  usptoClassification: "Int. Cl. F16H 1/14; U.S. Cl. 74/417 (printed)",
  originalText: `BACKGROUND OF THE INVENTION

This invention relates to mechanical manipulators and will be disclosed in connection with an improved remotely operable articulated cantilevered wrist manipulator. Mechanical manipulators are of ancient origin and have been utilized in a wide variety of applications including handling of explosives or other dangerous materials and performing work tasks in unsafe or undesirable working areas, as for example radioactive or underwater environments. More recently, and particularly since the embarkment of computer controlled industrial equipment, manipulators have been increasingly used to perform unsafe and undesirable tasks previously performed by humans with resultant cost savings and increased production efficiency.

Most recently, computer controlled industrial robots have been applied to manufacturing operations such as spot welding, spray painting, and assembly operations. The flexibility of a robot is largely dependent upon the positioning and orientation of the end-effector attached to the end of that robot arm. This flexibility is enhanced by improving either the orientational capabilities of the robot arm or increasing the range of movement of the end-effector.`,
  plainEnglishExplanation: {
    overview:
      "The patent addresses wrist orientation at the end of an industrial robot arm. Rather than putting a separate drive package at each distal joint, the preferred embodiment places three hydraulic motors at the elbow and transmits their rotations through three concentric forearm shafts, bevel gears, a second oblique shaft set, and a terminal shaft carrying the end effector.",
    coreMechanism:
      "Outer forearm shaft 15 turns the split wrist housing about axis A–A′. Intermediate forearm shaft 16 drives bevel gears 17 and 18 to rotate housing shaft 14a about oblique axis B–B′. Inner forearm shafts 19/20 drive bevel gears 21/22, shaft 23, and bevel gears 24/25 to rotate terminal shaft 26 about axis C–C′. In the illustrated arrangement A–A′, B–B′, and C–C′ meet at point P. The grant states that both fixed oblique angles are greater than 45 degrees, so the generated spherical sector is greater than a hemisphere; it does not print exact angles, link dimensions, gear ratios, loads, speeds, or efficiencies.",
    mechanicalBreakdown: [
      {
        title: "Three concentric forearm shafts",
        summary:
          "Shafts 15, 16, and 19 rotate independently about the forearm axis and carry three motor inputs into the wrist.",
        technicalDetails:
          "Figure 4 places hydraulic motors 9a, 9b, and 9c at the elbow and connects them through spur gears to shafts 15, 16, and 19. The source specifies topology but no reusable torque, speed, inertia, or power values.",
        archaicTerm: "intermost forearm shaft",
        modernEquivalent: "innermost coaxial drive shaft",
      },
      {
        title: "First oblique transmission",
        summary:
          "Bevel gears 17 and 18 convert rotation about forearm axis A–A′ into rotation about oblique axis B–B′.",
        technicalDetails:
          "Housing portion 14a is both a housing and a rotatable shaft. It is supported about B–B′ while the complete housing also moves with outer shaft 15 about A–A′, producing the source-described planetary motion.",
        archaicTerm: "drivingly engaged",
        modernEquivalent: "meshed torque-transmitting connection",
      },
      {
        title: "Second oblique transmission and tool shaft",
        summary:
          "Shaft 23 and bevel gears 24/25 carry the innermost input to terminal shaft 26 about axis C–C′.",
        technicalDetails:
          "The terminal mounting surface 14c and end effector 11 turn with shaft 26. Because shaft 23 sits inside the rotating housing, its axis and the terminal axis move with the upstream wrist members instead of floating independently.",
      },
      {
        title: "Common intersection point",
        summary:
          "The preferred A–A′, B–B′, and C–C′ axes pass through point P, making the terminal direction a spherical-orientation problem.",
        technicalDetails:
          "The specification explicitly allows small deviations from exact coincidence, while warning that they create small orientation ‘holes.’ The exhibit therefore includes an exact-intersection/source-contrast control but does not claim singularity-free motion or a constant Jacobian determinant.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Serial rotation composition",
        formula:
          "\\mathbf{R}_{tool}=\\mathbf{R}_{A}(q_A)\\,\\mathbf{R}_{B}(q_B)\\,\\mathbf{R}_{C}(q_C)",
        explanation:
          "Successive shaft rotations compose in order because each downstream axis moves with the upstream housing. This is a modern kinematic teaching notation, not an equation printed in the grant.",
      },
      {
        principle: "Intersecting-axis spherical geometry",
        formula: "A\\! -\\! A',\\;B\\! -\\! B',\\;C\\! -\\! C'\\rightarrow P",
        explanation:
          "When the three axes intersect at P, changing tool orientation does not require moving that geometric wrist center. The patent describes a spherical sector and says the illustrated fixed angles produce more than hemispherical directional coverage.",
      },
      {
        principle: "Ideal power continuity",
        formula:
          "\\boldsymbol{\\tau}_{in}^{T}\\dot{\\mathbf{q}}_{in}=\\boldsymbol{\\tau}_{out}^{T}\\boldsymbol{\\omega}_{out}+P_{loss}",
        explanation:
          "A real bevel-gear and bearing train must conserve input power apart from losses. Because the source supplies no torques, rates, ratios, or efficiencies, the public model refuses numerical power telemetry.",
      },
    ],
    whyItMattersToday:
      "The grant is a concrete early industrial-robot wrist architecture: actuators remain proximal while nested shafts and intersecting axes orient a distal tool. That topology still helps explain why robot designers care about wrist-center geometry, moving mass, internal transmissions, and the difference between orientation coverage and quantitative dynamic performance.",
  },
  claims: [],
  drawings: [],
  historicalContext: {
    problemStatement:
      "How can a programmable industrial robot orient an end effector over a broad continuous sector while keeping the distal wrist compact and driving it from motors mounted farther back on the arm?",
    priorArtLimitations: [
      "The specification divides prior robots into link-and-pivot, extending-link, and serial rotary-shaft designs, and seeks greater orientational and positional range from the latter architecture.",
      "The source says mechanical interference in prior serial-drive arrangements interrupted continuous roll and left holes in the available spatial orientation.",
    ],
    breakthroughInsight:
      "Stackhouse arranged serial rotary shafts so the preferred three axes meet at a point and used nested shafts plus bevel gears to transmit three elbow-mounted hydraulic motor inputs through the moving wrist.",
    patentWars: [],
    civilizationalImpact:
      "The patent documents the transition from dedicated machinery toward reprogrammable industrial manipulators and preserves a mechanically explicit solution to broad end-effector orientation.",
  },
  tags: ["robotics", "robot arm", "spherical wrist", "concentric shafts", "bevel gears"],
  stats: { totalClaims: 0, independentClaims: 0 },
};
