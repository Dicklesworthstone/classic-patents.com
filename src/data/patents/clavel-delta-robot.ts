import type { Patent, PatentClaim } from "@/types/patent";
import { clavelDeltaRobotArchivalEdition } from "../editions/clavelDeltaRobotEdition";

const PATENT_ID = "us-4976582-clavel-delta-robot";
const PDF_SHA256 = "e11516fed15c0937ee14decea63ff25557b848fb40ab381b29413737a145448e";

/** Resolve every literal claim from the hand-reviewed archival edition. */
export function clavelDeltaRobotClaimText(number: number): string {
  const block = clavelDeltaRobotArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Clavel Delta archival edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

function decodedClaim(
  number: number,
  isIndependent: boolean,
  plainEnglish: string,
  keyInnovations: string[],
  dependsOn?: number[],
  legalSignificance?: string,
): PatentClaim {
  return {
    number,
    isIndependent,
    ...(dependsOn ? { dependsOn } : {}),
    originalText: clavelDeltaRobotClaimText(number),
    plainEnglish,
    keyInnovations,
    ...(legalSignificance ? { legalSignificance } : {}),
  };
}

export const clavelDeltaRobotPatent: Patent = {
  id: PATENT_ID,
  patentNumber: "US 4,976,582",
  title: "Device for the movement and positioning of an element in space",
  shortTitle: "Clavel Delta Parallel Robot",
  subtitle: "Fixed-base actuators, spatial parallelograms, and orientation-preserving translation",
  inventors: ["Reymond Clavel"],
  inventorLocation: "Ecublens, Switzerland",
  grantDate: "1990-12-11",
  filingDate: "1989-09-06",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Parallel Robotics & Industrial Automation",
  summary:
    "US 4,976,582 claims a positioning device in which at least three base-supported actuators drive articulated linking members to a movable member while its inclination and orientation remain fixed. The illustrated form uses three rotary control arms and paired parallel bars, arranged as spatial parallelograms, to translate a platform and a working member. Other claims cover translating inputs, single-bar/cardanic variants, alternative joints, and a separately rotated working member; the grant is not a blanket claim to every later parallel robot.",
  heroQuote:
    "The inclination and the orientation in space of the movable element remain unchanged, whatever the motions of the three control arms may be.",
  originalPdfUrl: "/patents/pdfs/us-4976582-clavel-delta-robot.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4976582A/en",
  usptoClassification:
    "Int. Cl.5 B25J 9/12; U.S. Cl. 414/729; 901/23; 901/28; 248/179; 108/20; 108/138; 74/479 (printed)",
  originalTextAsset: {
    url: "/patents/transcripts/us-4976582-clavel-delta-robot-reviewed.txt",
    pageCount: 11,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    sourcePdfSha256: PDF_SHA256,
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "United States Patent",
        sourceRelationship: "Grant masthead, bibliographic record, and abstract",
      },
      {
        page: 2,
        exactSourceText: "U.S. Patent Dec. 11, 1990 Sheet 1 of 4 4,976,582",
        sourceRelationship: "Fig. 1 drawing sheet",
      },
      {
        page: 3,
        exactSourceText: "U.S. Patent Dec. 11, 1990 Sheet 2 of 4 4,976,582",
        sourceRelationship: "Fig. 2 drawing sheet",
      },
      {
        page: 4,
        exactSourceText: "U.S. Patent Dec. 11, 1990 Sheet 3 of 4 4,976,582",
        sourceRelationship: "Figs. 3 and 4 drawing sheet",
      },
      {
        page: 5,
        exactSourceText: "U.S. Patent Dec. 11, 1990 Sheet 4 of 4 4,976,582",
        sourceRelationship: "Fig. 5 drawing sheet",
      },
      {
        page: 6,
        exactSourceText: "BACKGROUND OF THE INVENTION",
        sourceRelationship: "Opening specification page",
      },
      {
        page: 7,
        exactSourceText: "DESCRIPTION OF THE DRAWINGS",
        sourceRelationship: "Specification continuation, embodiments, and opening claim",
      },
      {
        page: 8,
        exactSourceText: "2. A device according to claim 1",
        sourceRelationship: "Claims 2 through opening of claim 17",
      },
      {
        page: 9,
        exactSourceText: "18. A device for the movement",
        sourceRelationship: "Claims 18 through 25",
      },
      {
        page: 10,
        exactSourceText: "CERTIFICATE OF CORRECTION",
        sourceRelationship: "Certificate of Correction, page 1 of 2",
      },
      {
        page: 11,
        exactSourceText: "Fourth Day of August, 1992",
        sourceRelationship: "Certificate of Correction, page 2 of 2",
      },
    ],
  },
  archivalEdition: clavelDeltaRobotArchivalEdition,
  originalText:
    "This application is a continuation of application Ser. No. 07/096,113, filed Aug. 13, 1987, now abandoned.\n\nThe invention is concerned with a device for the movement and positioning of an element in space.\n\nThe majority of devices of the above type which are known, such, for example, as the main known industrial robots, include a carrier member which supports a wrist, the carrier member having three axes known as the main axes, intended for defining three degrees of freedom which may be rotations and/or translations, so as to position the wrist in space, the orientation of the said wrist being in turn controlled by one to three axes known as the secondary axes, in accordance with one to three supplementary degrees of freedom which are necessarily rotations.\n\nIn these devices, the configuration of the carrier member of which may be of cartesian type having cylindrical coordinates or spherical coordinates or of SCARA (Selective Compliance Assembly Robot) type or having angular coordinates, the control of the degrees of freedom is effected in series.",
  plainEnglishExplanation: {
    overview:
      "Clavel attacks a familiar factory-robot trade: a serial arm can position a wrist with successive joints, but each downstream axis can put motors or transmission mass on a moving structure. The issued patent instead connects three base-side actuators in parallel to one movable member. Its illustrated paired bars make three deformable spatial parallelograms, so the platform translates while staying parallel with itself. This is a geometric mechanism claim, not a measured performance specification: the grant never supplies link dimensions, motor constants, payload, stiffness, servo gains, trajectory data, or cycle-time measurements.",
    coreMechanism:
      "Each illustrated rotary actuator turns one control arm. At the arm tip, two parallel lower bars run to the movable member through articulated joints. For an idealized display leg i, the two bars preserve their separation vector, $\\mathbf{r}_{i,a}-\\mathbf{r}_{i,b}=\\mathbf{d}_i$, while their endpoints articulate. Three such constraints make platform translation depend jointly on the three arm positions and preserve its attitude in the pictured paired-bar form. The live exhibit solves only a normalized, deterministic topology that makes those paired links and the attitude invariant inspectable. It refuses metres, newtons, watts, speed, payload, accuracy, or a claim of a FrankenSim/WASM dynamics step because the patent does not publish the necessary parameters.",
    mechanicalBreakdown: [
      {
        title: "Fixed base and three actuator inputs",
        summary:
          "The first embodiment places three rotary actuator assemblies on one base member, with their fixed portions remaining on that base.",
        technicalDetails:
          "Figure 1 identifies base 1, fixed actuator portions 3, rotary axes 2, and control arms 4. The source says the axes are coplanar and the arm axis is perpendicular to its corresponding rotary axis. A normalized input $q_i$ can move the illustrated arm, but the grant gives neither a physical arm length nor an actuator torque, speed, encoder, or controller law. The model therefore distinguishes topology from performance.",
        archaicTerm: "fixed portion",
        modernEquivalent: "base-mounted actuator housing or stator-side structure",
      },
      {
        title: "Control arms and paired linking bars",
        summary:
          "Each control arm carries a pair of parallel bars from its outer end to the movable member.",
        technicalDetails:
          "In the illustrated form, 5a and 5b run from arm end 16 through articulated groups 6a/6b and 7a/7b. The pair is structurally important: both bars are drawn and their parallel relation is the source-backed constraint. It is not acceptable to render one decorative rod and call it a Delta mechanism. The visual deliberately draws the two bars for each of three legs and tests their equal normalized separation.",
        archaicTerm: "linking bars",
        modernEquivalent: "paired lower links forming a parallelogram linkage",
      },
      {
        title: "Movable member and attitude constraint",
        summary:
          "The central movable member is translated by all three legs while the source states that its inclination and orientation remain unchanged.",
        technicalDetails:
          "The claim language requires linking means and two degrees of freedom at each stated end, then fixes platform orientation over actuator motion. A useful normalized closure check is $\\mathbf{p}+\\mathbf{a}_i=\\mathbf{e}_i+\\mathbf{u}_{i,a}+\\mathbf{l}_{i,a}=\\mathbf{e}_i+\\mathbf{u}_{i,b}+\\mathbf{l}_{i,b}$ for each leg. It checks a display construction; it does not recover the historic workspace or prove stiffness.",
        archaicTerm: "movable member",
        modernEquivalent: "moving platform or end-effector carrier",
      },
      {
        title: "Working member and supplementary motor",
        summary:
          "A tool, gripper, sucker, or syringe can sit on the movable member, with a separately rotated longitudinal tool axis.",
        technicalDetails:
          "The embodiment names working member 9 and axis 10. Figure 1 places supplementary motor 11 on the base and transmits rotation through a rod system such as telescopic arm 14; Figure 2 permits the motor on the movable member. The mechanism separates tool-axis rotation from the platform-attitude constraint. No gear ratio, motor rating, tool torque, or actual rotation range is printed, so the live control is labeled normalized.",
        archaicTerm: "working member",
        modernEquivalent: "end effector or tool interface",
      },
      {
        title: "Rotary, translating, and joint alternatives",
        summary: "The claims preserve more than the familiar Figure 1 rotary paired-bar layout.",
        technicalDetails:
          "Claim 4 and Figure 5 describe members translating on straight guides, Claims 5–7 and 22–23 describe single-bar/cardanic alternatives, and Figures 1–2 contrast cardan with ball-and-socket articulations. These variations matter to legal scope. The exhibit's live Claim 2 probe remains intentionally narrow: it illustrates the paired, parallel-bar topology of the canonical first form rather than silently treating every disclosed alternative as the same mechanism.",
        archaicTerm: "articulation of cardan type",
        modernEquivalent: "universal-joint-style articulation",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Closed-chain position constraints",
        formula:
          "$\\mathbf{p}+\\mathbf{a}_i=\\mathbf{e}_i+\\mathbf{u}_{i,j}+\\mathbf{l}_{i,j}\\quad(i=1,2,3;\\;j=a,b)$",
        explanation:
          "For each display leg, the platform attachment point equals the arm-tip route through either of the paired lower links. Those simultaneous equalities express closed-chain geometry. The source gives the topology but no numerical lengths, so every vector in the exhibit is a normalized drawing coordinate rather than an SI measurement.",
      },
      {
        principle: "Parallelogram attitude invariant",
        formula: "$\\mathbf{l}_{i,a}-\\mathbf{l}_{i,b}=\\mathbf{d}_i=\\text{constant}$",
        explanation:
          "The paired bars retain a fixed separation vector while the joints articulate. In the illustrated construction, three such parallelogram constraints make the movable member remain parallel with itself. This is a kinematic statement about ideal linkage geometry, not a numerical stiffness, compliance, backlash, or accuracy prediction.",
      },
      {
        principle: "Three coordinated positioning inputs",
        formula: "$\\mathbf{p}_{\\mathrm{display}}=f(q_1,q_2,q_3;\\text{paired-bar topology})$",
        explanation:
          "The source describes three actuator moving portions acting in parallel, so the platform pose is a function of all three inputs under loop closure. It does not disclose f as a calibrated machine model, inverse-kinematics controller, trajectory planner, or numerical workspace. The demonstrator exposes the dependency without inventing those omitted quantities.",
      },
      {
        principle: "Separate tool-axis degree of freedom",
        formula: "$q=[q_1,q_2,q_3,\\phi_{tool}]^T$",
        explanation:
          "The patent's supplementary motor can rotate working member 9 about longitudinal axis 10 separately from the three platform-positioning inputs. The coordinate list distinguishes this source-described extra rotation from platform tilt; it is not a claim of a source-provided four-axis controller or a specified angular range.",
      },
    ],
    whyItMattersToday:
      "The patent makes the actuator-placement and closed-chain trade visually legible: three input arms can carry a platform without serially stacking all main drive mass on the moving structure. That topology became central to later high-speed pick-and-place Delta robots. EPFL's historical account identifies Clavel's team with the 1985 invention and later packaging commercialization, while the International Federation of Robotics documents an early packaging deployment. Those later applications are historical context, not numbers silently projected back into the 1990 grant or a claim that this patent alone covers all later parallel robots.",
  },
  claims: [
    decodedClaim(
      1,
      true,
      "Claim 1 is the broadest issued orientation-preserving positioning combination. It requires a base, a movable member, at least three one-degree-of-freedom actuator moving portions, and at least three articulated linking means. The legal limit is not merely three motors: the mechanism must fix the movable member's inclination and orientation over those input motions while supplying only the stated two degrees of freedom at each link end. It therefore targets a constrained parallel mechanism, not every serial robot or arbitrary parallel linkage.",
      [
        "Fixed base member",
        "Three single-degree actuator portions",
        "Articulated linking means",
        "Platform attitude constraint",
      ],
      undefined,
      "Principal independent claim for the general base-actuator / orientation-preserving parallel-linkage architecture.",
    ),
    decodedClaim(
      2,
      false,
      "Claim 2 narrows claim 1 to a linking means made of two parallel bars. Each bar is articulated at its actuator-side end and at its movable-member-side end. This is the most direct claim expression of the visible paired lower links: their relationship is a legal structural limitation, not a decorative drawing convention. The claim does not require the Figure 1 rotary input by itself, because the type of actuator motion is added in later dependent claims.",
      [
        "Two parallel linking bars",
        "Paired actuator-side articulations",
        "Paired platform-side articulations",
      ],
      [1],
      "The live claim probe uses this dependent paired-bar form because it makes the source's orientation-preserving geometry inspectable.",
    ),
    decodedClaim(
      3,
      false,
      "Claim 3 adds a rotary version to the paired-bar machine of claim 2. Each actuator's moving portion must rotate about an axis associated with its fixed portion. It captures the Figure 1 class in which control arms 4 turn about base-supported axes 2 before carrying the lower paired bars. It does not claim every rotary arm or every platform mechanism; the inherited paired-bar and orientation constraints remain necessary.",
      ["Rotary actuator moving portions", "Base-supported rotation axes", "Paired-bar linkage"],
      [2],
    ),
    decodedClaim(
      4,
      false,
      "Claim 4 provides the translating-input counterpart to claim 2. The moving portion translates relative to the fixed portion and is constrained against rotation about the direction of travel. That limitation matches the straight-guide alternative later shown in Figure 5. It preserves the two-parallel-bar linkage from claim 2, so it is not a generic linear slide claim: the translation must feed the stated orientation-preserving parallel mechanism.",
      [
        "Linear translating actuator portions",
        "Anti-rotation guide constraint",
        "Paired-bar linkage",
      ],
      [2],
    ),
    decodedClaim(
      5,
      false,
      "Claim 5 supplies an alternative to the paired-bar link in claim 1: a single bar articulated at both ends by cardan-type joints. Its legal work is to reserve a different linkage-and-joint topology while retaining the overarching orientation-preserving machine of claim 1. The source's first embodiment remains the paired-bar form, so the exhibit does not substitute this single bar for the visible two-link parallelogram when it tests Claim 2.",
      ["Single linking bar", "First cardan-type articulation", "Second cardan-type articulation"],
      [1],
    ),
    decodedClaim(
      6,
      false,
      "Claim 6 combines the claim 5 single-cardanic-bar alternative with rotary actuator moving portions. The printed 1990 form lacks the word 'the' before 'fixed portion'; the separately preserved 1992 Certificate of Correction supplies that word. The claim still requires the inherited single-bar/cardanic arrangement and a rotation axis on the actuator's fixed portion. It is a particular alternative architecture, not a claim to all universal-jointed rotary arms.",
      ["Single cardanic bar", "Rotary actuator portion", "Corrected fixed-portion phrase"],
      [5],
    ),
    decodedClaim(
      7,
      false,
      "Claim 7 pairs the claim 5 single-bar/cardanic form with a translating moving portion that is restrained from rotation. The printed claim trails off after 'about'; the 1992 Certificate of Correction officially adds 'an axis defined by the motion of translation.' The combined limitation is a translating, anti-rotating actuator input plus the inherited two-cardanic single bar, not an unrestricted linear robot stage.",
      ["Single cardanic bar", "Translating actuator portion", "Translation-axis anti-rotation"],
      [5],
    ),
    decodedClaim(
      8,
      false,
      "Claim 8 adds a working member that rotates about its own longitudinal axis and a supplementary motor mounted on the base. It can depend on any of the listed rotary or translating paired-bar or single-bar forms. The legal addition is the combination of the positioning architecture with a base-mounted tool-axis drive. It does not establish a torque, speed, transmission ratio, tool style, or claim an entire modern fourth-axis robot controller.",
      ["Rotatable working member", "Longitudinal tool axis", "Base-mounted supplementary motor"],
      [3, 4, 6, 7],
    ),
    decodedClaim(
      9,
      false,
      "Claim 9 is the movable-member-motor counterpart of claim 8. The working member still rotates about its longitudinal axis, but the supplementary motor is mounted on the movable member instead of the base. The scope makes the motor location consequential; it does not erase the inherited parallel positioning topology or claim any tool motor attached to any robot. It is useful evidence that the source expressly preserved both drive-placement alternatives.",
      ["Rotatable working member", "Longitudinal tool axis", "Movable-member supplementary motor"],
      [3, 4, 6, 7],
    ),
    decodedClaim(
      10,
      false,
      "Claim 10 narrows one of the rotary paired-bar forms by requiring a cardan-type articulation between the linking means and its actuator moving portion. It is a joint-selection claim: the source's Figure 1 uses double cardan arrangements at the arm ends. The claim does not make cardan joints synonymous with any universal joint in an unrelated machine, because it inherits the claimed rotary actuator and parallel-linkage context.",
      ["Cardan-type actuator-side articulation", "Rotary paired-bar form"],
      [3, 4],
    ),
    decodedClaim(
      11,
      false,
      "Claim 11 selects a ball-and-socket articulation at the actuator-side end of the linking means. It describes the Figure 2-type joint substitution within the listed parent forms, rather than a new high-level robot category. The legal purpose is to hold the alternative joint choice alongside the same positioning architecture. It does not supply a ball size, angular travel, preload, lubricant, or contact-force specification.",
      ["Ball-and-socket actuator-side articulation", "Alternative joint topology"],
      [3, 4],
    ),
    decodedClaim(
      12,
      false,
      "Claim 12 makes the cardan-type joint selection at the movable-member end of the linking means rather than the actuator end. That location matters because each end connects to a different member in the closed chain. It inherits the listed parent forms and thus has no independent claim to a cardan joint in isolation. The source gives its topology, not a universal-joint angle limit, friction model, stiffness, or fatigue result.",
      ["Cardan-type platform-side articulation", "Movable-member connection"],
      [3, 4],
    ),
    decodedClaim(
      13,
      false,
      "Claim 13 is the platform-side ball-and-socket alternative to claim 12. Its limitation is the place and type of articulation between linking means and movable member, retaining the preceding paired-bar / rotary-or-translating architecture. The legal scope does not cover all ball joints or every industrial robot end connection. It reserves a concrete joint substitution shown by the source alongside the broader spatial-linkage concept.",
      ["Ball-and-socket platform-side articulation", "Movable-member connection"],
      [3, 4],
    ),
    decodedClaim(
      14,
      true,
      "Claim 14 is an independent rotary paired-bar form. It specifies at least three base-fixed actuator portions, moving portions rotating about their axes, and at least three linking means, with at least one consisting of two parallel bars. The actuator-side connection is cardan-type, and the platform-side articulation supplies two and only two degrees of freedom. It is narrower than claim 1 because it makes the rotary input, paired bars, and a specified joint topology explicit.",
      [
        "Rotary base actuators",
        "Two parallel bars",
        "Cardan actuator-side joint",
        "Two-degree platform articulation",
      ],
      undefined,
      "Independent claim identifying one concrete rotary, paired-bar, cardan-joint embodiment.",
    ),
    decodedClaim(
      15,
      true,
      "Claim 15 independently reverses the connection order of claim 14's cardan form: the paired-bar linking means is cardan-mounted first to the movable member, while its other end connects to the actuator moving portion with the stated degrees of freedom. The 1992 certificate removes a stray comma after 'of' in the printed claim. The legal contribution is the endpoint/joint arrangement, not a generic assertion that two bars always preserve orientation.",
      [
        "Rotary base actuators",
        "Platform-side cardan joint",
        "Paired bars",
        "Actuator-side two-degree articulation",
      ],
      undefined,
      "Independent counterpart that locates the specified cardan articulation at the movable-member end.",
    ),
    decodedClaim(
      16,
      true,
      "Claim 16 is an independent rotary paired-bar form using a ball-and-socket articulation at the actuator-side end and a two-degree-of-freedom articulation at the movable-member end. It claims a specific alternative joint arrangement while retaining the base, rotary moving portions, three linking means, and at least one paired-bar group. It does not equate every spherical joint with this architecture or promise a particular angular range, service life, or stiffness.",
      ["Rotary base actuators", "Actuator-side ball-and-socket joint", "Paired-bar linkage"],
    ),
    decodedClaim(
      17,
      true,
      "Claim 17 independently places the ball-and-socket articulation at the movable-member end and uses the two-degree-of-freedom articulation at the actuator-side end. It preserves the same rotary, base-fixed, paired-bar foundation as neighboring claims while changing the endpoint connection pattern. The claim is not a broad claim to ball-and-socket robot joints; the complete linked positioning device and its stated topology remain required.",
      ["Rotary base actuators", "Platform-side ball-and-socket joint", "Paired-bar linkage"],
    ),
    decodedClaim(
      18,
      true,
      "Claim 18 independently uses universal-joint articulation at the actuator-side end of a paired-bar linking means, then requires the platform-side connection to provide two and only two degrees of freedom. It anchors that joint choice in a rotary, base-supported three-actuator device. The legal scope is a full combination claim; it does not claim all universal joints or every device with two parallel rods and a platform.",
      [
        "Rotary base actuators",
        "Universal actuator-side joint",
        "Paired bars",
        "Platform two-degree articulation",
      ],
    ),
    decodedClaim(
      19,
      true,
      "Claim 19 is the reversed-endpoint universal-joint counterpart to claim 18. Here the universal joint is at the movable member, and the actuator-side connection has the stated two-degree freedom. The rest of the independent combination still requires rotary base actuator portions, at least three linking means, and at least one pair of parallel bars. It separates joint placement as a legal limitation rather than treating it as an incidental drawing detail.",
      [
        "Rotary base actuators",
        "Platform-side universal joint",
        "Paired bars",
        "Actuator two-degree articulation",
      ],
    ),
    decodedClaim(
      20,
      true,
      "Claim 20 independently requires both bars of a paired linking means to have universal-joint articulations at the actuator moving portion, while both other ends connect to the movable member with the printed degrees-of-freedom limitation. The issued text contains the wording 'two and only degrees of freedom'; this record preserves that historical printing rather than silently repairing it. The claim still turns on the full rotary parallel-linkage combination, not a lone universal joint.",
      ["Dual universal actuator-side joints", "Both paired bars", "Rotary parallel linkage"],
    ),
    decodedClaim(
      21,
      true,
      "Claim 21 independently reverses claim 20's joint placement: both paired bars use universal joints at the movable member, while their other ends connect to the actuator moving portion with the stated two-and-only-two-degree freedom. It is a full architectural combination with three rotary base actuator portions and paired bars. The scope is not a general right to place universal joints at a platform; every other recited linkage element remains part of the claim.",
      ["Dual universal platform-side joints", "Both paired bars", "Rotary parallel linkage"],
    ),
    decodedClaim(
      22,
      true,
      "Claim 22 independently covers a rotary device with at least one single-bar linking means. The bar uses a cardan-type articulation at an end of the actuator moving portion and a platform articulation that provides two and only two degrees of freedom. This distinguishes the single-bar/cardanic alternative from the iconic paired-bar embodiment. It does not claim all single links or all gimballed structures, because the base, rotary actuator, and three-linking-means combination remains explicit.",
      ["Single cardan-linked bar", "Rotary base actuator", "Platform two-degree articulation"],
    ),
    decodedClaim(
      23,
      true,
      "Claim 23 is the independent reverse-endpoint version of the single-bar/cardanic form. The cardan-type articulation is at the movable member, while the actuator-side end has the two-and-only-two-degree connection. It preserves the same base-fixed, rotary, multi-linking-means positioning device as claim 22. This is a claim to a particular articulated parallel architecture, not a generic claim to a single bar between a motor and a tool.",
      [
        "Single platform-side cardan bar",
        "Rotary base actuator",
        "Actuator two-degree articulation",
      ],
    ),
    decodedClaim(
      24,
      false,
      "Claim 24 adds the base-mounted supplementary motor and longitudinally rotatable working member to any one of independent claims 14 through 23. Its legal work is to combine a selected concrete rotary linkage form with a tool-axis drive whose motor stays on the base. The claim does not establish a particular telescopic-arm construction, motor power, tool torque, angular rate, or a universal fourth-axis capability for unrelated robots.",
      ["Base-mounted supplementary motor", "Longitudinally rotatable working member"],
      [14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    ),
    decodedClaim(
      25,
      false,
      "Claim 25 adds the movable-member-mounted supplementary motor and longitudinally rotatable working member to any one of independent claims 14 through 23. It is the complementary motor-location form to claim 24, preserving the same concrete underlying rotary linkage options. The scope does not claim every motorized gripper or platform tool; the selected independent mechanical combination and longitudinal working-member rotation are both required.",
      ["Movable-member supplementary motor", "Longitudinally rotatable working member"],
      [14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    ),
  ],
  drawings: [
    {
      figureNumber: "1",
      title: "Rotary-actuator paired-bar Delta embodiment",
      caption:
        "Source Figure 1: base 1 carries three fixed actuator portions 3 and rotary axes 2; control arms 4 drive paired bars 5a/5b through cardan articulations to movable member 8 and working member 9.",
      svgType: "clavel-delta-robot",
      callouts: [
        {
          id: "base",
          figureRef: "Fig. 1",
          label: "Base member",
          element: "1",
          description: "Fixed support carrying the rotary actuator assemblies.",
          x: 47,
          y: 35,
        },
        {
          id: "rotary-axis",
          figureRef: "Fig. 1",
          label: "Rotary axis",
          element: "2",
          description: "One coplanar axis that turns a control arm.",
          x: 66,
          y: 31,
        },
        {
          id: "control-arm",
          figureRef: "Fig. 1",
          label: "Control arm",
          element: "4",
          description: "Rigid moving arm driven from a base-side rotary actuator.",
          x: 72,
          y: 48,
        },
        {
          id: "paired-bars",
          figureRef: "Fig. 1",
          label: "Parallel linking bars",
          element: "5a, 5b",
          description: "One visible pair of lower links forming a deformable parallelogram.",
          x: 62,
          y: 66,
        },
        {
          id: "movable-member",
          figureRef: "Fig. 1",
          label: "Movable member",
          element: "8",
          description: "Central platform whose orientation is constrained by the linked legs.",
          x: 46,
          y: 70,
        },
        {
          id: "working-member",
          figureRef: "Fig. 1",
          label: "Working member",
          element: "9",
          description: "Tool, gripper, sucker, or syringe carried below the movable member.",
          x: 45,
          y: 87,
        },
      ],
    },
    {
      figureNumber: "2",
      title: "Ball-and-socket joint alternative",
      caption:
        "Source Figure 2: the illustrated paired-bar architecture with the 26a/26b and 27a/27b ball-and-socket alternatives replacing the Figure 1 cardan joints.",
      svgType: "clavel-delta-ball-joint",
      callouts: [
        {
          id: "actuator-side-balls",
          figureRef: "Fig. 2",
          label: "Actuator-side ball joints",
          element: "26a, 26b",
          description: "Ball-and-socket alternative at a control-arm end.",
          x: 69,
          y: 59,
        },
        {
          id: "platform-side-balls",
          figureRef: "Fig. 2",
          label: "Platform-side ball joints",
          element: "27a, 27b",
          description: "Ball-and-socket alternative at a movable-member end.",
          x: 46,
          y: 67,
        },
      ],
    },
    {
      figureNumber: "3–4",
      title: "Single-bar/cardanic embodiment",
      caption:
        "Source Figures 3 and 4: third embodiment in which the pairs of lower bars are replaced by single bars 25 with cardan-type articulations 36 and 37.",
      svgType: "clavel-delta-single-bar",
      callouts: [
        {
          id: "single-bar",
          figureRef: "Fig. 3",
          label: "Single linking bar",
          element: "25",
          description: "Alternative to the paired parallel bars in the first embodiment.",
          x: 53,
          y: 57,
        },
        {
          id: "cardan-joints",
          figureRef: "Fig. 4",
          label: "Cardan articulations",
          element: "36, 37",
          description: "The source-labelled cardan-type joints at the bar's ends.",
          x: 58,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "5",
      title: "Straight-guide translating-actuator embodiment",
      caption:
        "Source Figure 5: fourth embodiment in which the rotary control arms are replaced by members 24 moving on straight guides.",
      svgType: "clavel-delta-linear",
      callouts: [
        {
          id: "straight-guide",
          figureRef: "Fig. 5",
          label: "Straight-guide moving member",
          element: "24",
          description: "Translating actuator alternative to the rotary control arms.",
          x: 67,
          y: 45,
        },
        {
          id: "translated-platform",
          figureRef: "Fig. 5",
          label: "Movable member",
          element: "8",
          description: "Platform linked to the translating inputs.",
          x: 48,
          y: 72,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The patent describes the need to transfer light pieces rapidly while avoiding the serial arrangement in which downstream drive or transmission mass can be carried by upstream axes.",
    priorArtLimitations: [
      "The specification describes conventional serial industrial-robot axes as referenced in sequence, with motors or complicated transmissions located at successive axes.",
      "It says a six-axis parallel arrangement similar to a flight simulator can keep motors fixed but reaches only a restricted working volume.",
      "It distinguishes the cited Pollard paint-gun mechanism and an extensible-member French application from its own fixed-support, orientation-preserving arrangement.",
    ],
    breakthroughInsight:
      "Use three base-supported actuator inputs and linked spatial parallelograms to translate one movable member while preserving its inclination and orientation; then treat tool-axis rotation as a separate transmission problem.",
    patentWars: [],
    civilizationalImpact:
      "This grant gives a particularly clear primary-source account of the geometry that came to define the Delta parallel-robot family. It ties the fixed-base-actuator and orientation-preserving-linkage idea to rapid handling and packing applications, making it a useful museum record for the parallel-kinematics design trade rather than a generic history of all robots.",
    aftermath:
      "EPFL identifies Clavel's team with the 1985 Delta invention and says the concept was licensed to Demaurex in 1987 for packaging. The International Federation of Robotics records an early packaging installation sold to Roland in 1992. Those are later adoption facts, kept distinct from the patent's unquantified technical assertions.",
    sideNotes: [
      "The grant's title is descriptive; “Delta robot” is the later common name for this parallel-robot family, not the title printed on the patent.",
      "The facsimile includes an official 4 August 1992 Certificate of Correction. It corrects specification typographical errors and textual issues in claims 6, 7, and 15; the archival edition preserves both the original printed claims and the correction.",
      "No patent conflict is asserted here: the reviewed source packet supports an honest empty patent-wars record rather than an invented dispute narrative.",
    ],
  },
  tags: [
    "robotics",
    "parallel kinematics",
    "Delta robot",
    "industrial automation",
    "packaging",
    "spatial parallelogram",
  ],
  stats: { totalClaims: 25, independentClaims: 11 },
};
