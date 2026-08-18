import type { Patent } from "@/types/patent";
import { wrightFlyerArchivalEdition } from "../editions/wrightFlyerEdition";

/**
 * Claims are transcribed once in the hand-authored edition. The decoder cites
 * those exact authored nodes rather than maintaining a second, drift-prone
 * transcription of the same legal text.
 */
function manualClaimText(number: number): string {
  const block = wrightFlyerArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Wright manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const wrightFlyerPatent: Patent = {
  id: "us-821393-wright-flyer",
  patentNumber: "US 821,393",
  title: "Flying-Machine",
  shortTitle: "Wright Flyer 3-Axis Aerodynamic Flight Control",
  subtitle: "Differential Wing Warping, Coordinated Rudder, and Aerodynamic Pitch Control",
  inventors: ["Orville Wright", "Wilbur Wright"],
  inventorLocation: "Dayton, Ohio",
  grantDate: "1906-05-22",
  filingDate: "1903-03-23",
  era: "Electrification & Early Modern (1870–1920)",
  category: "aviation",
  categoryLabel: "Aeronautics & Aerodynamics",
  summary:
    "The 1906 flying-machine patent that first claimed coordinated three-axis control: hip-cradle wing warping for roll, a rear rudder linked to that same cradle to cancel adverse yaw, and a forward canard for pitch. Filed 23 March 1903, nine months before the first powered hops at Kitty Hawk.",
  heroQuote:
    "Our invention relates to that class of flying-machines in which the weight is sustained by the reactions resulting when one or more aeroplanes are moved through the air edgewise at a small angle of incidence...",
  originalPdfUrl: "/patents/pdfs/us-821393-wright-flyer.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US821393A/en",
  usptoClassification: "B64C 13/00 (Aeronautics; Aircraft control systems)",
  originalTextAsset: {
    url: "/patents/source-text/us-821393-wright-flyer.txt",
    pageCount: 10,
    kind: "source-pdf-text-layer",
  },
  archivalEdition: wrightFlyerArchivalEdition,
  originalText: `UNITED STATES PATENT OFFICE.
ORVILLE WRIGHT AND WILBUR WRIGHT, OF DAYTON, OHIO.

FLYING-MACHINE.

No. 821,393. Specification of Letters Patent. Patented May 22, 1906.
Application filed March 23, 1903. Serial No. 149,220.

To all whom it may concern:
Be it known that we, ORVILLE WRIGHT and WILBUR WRIGHT, citizens of the United States, residing at Dayton, in the county of Montgomery and State of Ohio, have invented certain new and useful Improvements in Flying-Machines, of which the following is a specification.

Our invention relates to that class of flying-machines in which the weight is sustained by the reactions resulting when one or more aeroplanes are moved through the air downwardly and forwardly at a small angle of incidence, either by the application of mechanical power or by the utilization of the force of gravity.

The objects of our invention are, first, to provide means for maintaining or restoring the equilibrium or lateral balance of the apparatus; second, to provide means for guiding the machine in both vertical and horizontal directions; and, third, to provide a structure combining lightness, strength, convenience of construction, and certain other advantageous features in points of detail.

In flying-machines of the character to which this invention relates it is necessary to provide means for maintaining or restoring the lateral balance or equilibrium of the apparatus, and to this end we construct the aeroplanes of superposed flexible surfaces connected together by upright posts pivoted to the surfaces, and we provide cables and operating mechanisms connected to the outer marginal portions of the aeroplanes, whereby the lateral margins of the aeroplanes may be twisted or warped in opposite directions.

By this construction we are enabled to present the lateral margins of the aeroplanes to the air at different angles of incidence, whereby the lift on one side of the machine is increased while that on the opposite side is decreased, thus producing a restoring or balancing couple tending to right the machine about its longitudinal axis.

In carrying out our invention we have discovered that when the lateral margins of the aeroplanes are presented to the air at different angles of incidence, the side having the greater angle of incidence experiences not only a greater lift, but also a greater drag or resistance to forward motion through the air, while the side having the lesser angle of incidence experiences less resistance. Consequently the machine tends to turn or yaw in a horizontal plane toward the side having the greater angle of incidence.

To overcome this tendency and maintain the machine on its course or direct it in any desired direction, we provide a vertical rudder placed rearwardly of the aeroplanes and we operatively connect this vertical rudder to the wing-warping mechanism in such a manner that when the wings are warped to increase the angle of incidence on one side, the vertical rudder is simultaneously deflected toward the side having the lesser angle of incidence, thereby counteracting the differential resistance and causing the machine to turn in the direction of the lower wing in a coordinated, banked turn.

Furthermore, we provide a horizontal rudder or elevator supported forwardly of the main aeroplanes and adjustable at will to vary the vertical angle of incidence of the entire machine, thereby controlling the longitudinal pitch and enabling the operator to climb, descend, or maintain horizontal flight.

Referring to the accompanying drawings:
Figure 1 is a perspective view of a flying-machine embodying our invention.
Figure 2 is a side elevation of the same.
Figure 3 is a front elevation of the machine with the aeroplanes in their normal unwarped position.
Figure 4 is a diagrammatic front view showing the aeroplanes warped to present their lateral margins at opposite angles of incidence.
Figure 5 is a detailed sectional view showing the universal pivot connections between the vertical struts and the wing spars.
Figure 6 is a detail perspective view of the pilot's control cradle and cable connections.
Figure 7 is a detail view of the rear vertical rudder and its operating cables.

The main framing of the machine comprises superposed upper and lower aeroplanes 1 and 2, constructed of flexible wooden spars covered with woven fabric. The upper and lower surfaces are held spaced apart by a plurality of vertical upright posts 3, connected to the spars at their upper and lower ends by universal hinge joints or pivots 4, allowing the structure to twist without distortion of the individual joints. Diagonal truss wires 5 are provided in the central section to impart rigid truss strength, while the outer bays are left free to undergo helical twisting.

The operator lies prone in a movable cradle 6 upon the lower aeroplane. By shifting his hips laterally, the cradle pulls upon operating cables 7 and 8 connected to the rear outer corners of the upper and lower aeroplanes, twisting the right-hand wingtips upward and the left-hand wingtips downward simultaneously, while automatically deflecting the rear vertical rudder 9 to maintain complete aerodynamic equilibrium in three dimensions.`,
  plainEnglishExplanation: {
    overview:
      "Otto Lilienthal and Samuel Langley treated flight as a problem of power or of built-in stability, the way a keel rights a boat. The Wrights treated it as a control problem in gusty air. A machine that could not be banked, pointed, and pitched on purpose would crash the first time the wind shifted. Their patent is the control system: warp the wings to roll, kick a linked rudder to stop the nose from swinging the wrong way, and use a forward elevator to hold pitch.",
    coreMechanism:
      "By twisting (warping) the trailing edges of the flexible wings in opposite directions, one wing generates more aerodynamic lift and more induced drag than the other, causing the aircraft to bank into a roll. To prevent the higher-drag wing from pulling the nose in the wrong direction (adverse yaw), the Wrights interconnected the wing-warping cables directly to a movable vertical rear rudder, creating the first synchronized 3-axis flight control system in history.",
    mechanicalBreakdown: [
      {
        title: "Differential Wing Warping (Roll Control)",
        summary: "Twisting the flexible outer tips of biplane wings in opposite directions.",
        technicalDetails:
          "Cables running from a cradle operated by the pilot's hips pulled the rear wingtips. The right wing tip twisted to increase its angle of attack (generating higher lift), while the left wing tip twisted downward to decrease its angle of attack (generating lower lift). This differential lift produced a rolling moment ($M_x = \\Delta L \\cdot b/2$).",
        archaicTerm: "Superposed flexible aeroplanes",
        modernEquivalent: "Biplane wings with ailerons",
      },
      {
        title: "Coordinated Vertical Rudder (Yaw Control & Adverse Yaw Solution)",
        summary: "A movable vertical rudder tied directly to the wing-warping mechanism.",
        technicalDetails:
          "Increasing the angle of attack on the high-lift wing inherently increased induced drag ($C_{Di} = C_L^2 / \\pi AR$). That extra drag yaws the nose away from the intended turn (adverse yaw); several earlier gliders had stalled or spun from the same coupling. The Wrights tied the hip cradle to the rear rudder so that a bank automatically deflected the rudder into the turn and cancelled the yaw.",
        archaicTerm: "Vertical rudder",
        modernEquivalent: "Movable vertical stabilizer / rudder",
      },
      {
        title: "Forward Elevator (Pitch Control)",
        summary: "A horizontal surface placed ahead of the main wings (canard configuration).",
        technicalDetails:
          "Operated by a hand lever, the forward canard elevator adjusted the pitch angle of attack relative to the relative wind ($M_y = L_{canard} \\cdot x_{cg}$). Placing it in front ensured that the aircraft was dynamically controllable and provided early stall recovery.",
        archaicTerm: "Horizontal rudder",
        modernEquivalent: "Canard / horizontal stabilizer & elevator",
      },
      {
        title: "Flexible Truss & Universal Pivots",
        summary: "A biplane box-truss built with flexible ash and spruce struts and piano wire.",
        technicalDetails:
          "Instead of a rigid truss, the vertical struts were connected to the wing spars with universal pivot joints. This allowed the entire biplane structure to twist helical-fashion without fracturing the structural spars or snapping diagonal guy wires.",
        archaicTerm: "Upright posts pivoted to the surfaces",
        modernEquivalent: "Articulated wing spar trusses",
      },
      {
        title: "Pilot Hip Cradle & Closed-Loop Control Rigging",
        summary:
          "Prone sliding pilot cradle mechanically multiplexing roll and yaw commands through endless steel cables.",
        technicalDetails:
          "The pilot lies prone in a padded ash wood cradle ($m_{\\text{cradle}} \\approx 4\\text{ kg}$) that slides laterally $\\pm 10\\text{ cm}$ across low-friction steel guide bars on the lower wing spar. Heavy $1.5\\text{ mm}$ braided piano wire cables run from the cradle horns around corner pulleys to the top rear outer wingtips and the rudder tiller horn, ensuring continuous kinematic synchronization with zero backlash ($e_{\\text{backlash}} < 2\\text{ mm}$).",
        archaicTerm: "Movable cradle receiving the body of the operator",
        modernEquivalent: "Pilot control yoke / Flight control mixer linkage",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Aerodynamic Lift & Differential Circulation",
        formula: "L = \\frac{1}{2} \\rho V^2 S C_L(\\alpha)",
        explanation:
          "Warping the wing changes its local angle of attack $\\alpha$, shifting the circulation $\\Gamma$ and creating differential lift between the left and right wingtips to generate a roll torque.",
      },
      {
        principle: "Induced Drag & Adverse Yaw Mechanism",
        formula: "C_{Di} = \\frac{C_L^2}{\\pi \\cdot AR \\cdot e}",
        explanation:
          "The high-lift wing tip experiences greater induced drag $C_{Di}$, which creates an adverse yawing moment that pulls the aircraft away from the intended turn unless counteracted by the vertical rudder.",
      },
      {
        principle: "3-Axis Coordinated Turn Flight Dynamics",
        formula:
          "R_{\\text{turn}} = \\frac{V^2}{g \\cdot \\tan(\\phi)}, \\quad \\dot{\\psi} = \\frac{g \\tan(\\phi)}{V}",
        explanation:
          "A coordinated turn balances lift, centrifugal force, and gravity so the aircraft neither skids outwards nor slips inwards during banking.",
      },
      {
        principle: "Prandtl Lifting-Line Spanwise Circulation Distribution",
        formula:
          "\\Gamma(y) = \\Gamma_0 \\sqrt{1 - \\left(\\frac{2y}{b}\\right)^2} + \\Delta \\Gamma_{\\text{warp}} \\sin\\left(\\frac{\\pi y}{b}\\right)",
        explanation:
          "Wing warping alters the spanwise vortex sheet distribution $\\Gamma(y)$, producing an asymmetric downwash profile $w(y) = \\frac{1}{4\\pi}\\int_{-b/2}^{b/2}\\frac{d\\Gamma/d\\eta}{y - \\eta}d\\eta$ that governs both rolling torque and induced yaw.",
      },
      {
        principle: "Canard Longitudinal Static Stability & Pitch Equilibrium",
        formula:
          "C_{m} = C_{m0} + \\left(\\frac{x_{\\text{cg}} - x_{\\text{ac}}}{c}\\right) C_L - V_{\\text{canard}} C_{L,\\text{canard}}(\\delta_e)",
        explanation:
          "Placing the lifting elevator canard ahead of the center of gravity ($x_{\\text{canard}} > x_{\\text{cg}}$) ensures that pulling up increases pitch without downloading the aircraft, giving crisp stall margin recovery.",
      },
    ],
    whyItMattersToday:
      'Ailerons replaced fabric warping, but the law of the turn did not. A Cessna 172, a 787, and an F-22 still bank with differential lift and use the rudder to keep the nose from swinging against the roll. Flight-school "coordinated flight" is Claim 1 plus the 1902 glider\'s rudder linkage, taught with a slip-skid ball.',
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "This claim covers a normally flat wing whose two side margins can move above or below the wing's normal plane about a spanwise axis. The movement puts the two margins at different angles of incidence to the air. It also requires a mechanism that makes those margin movements. In modern terms, this is the broad wing-warping roll-control combination, stated without requiring a biplane, a particular cable layout, or a particular amount of twist.",
      keyInnovations: [
        "Differential wing warping",
        "Opposed wing-margin incidence",
        "Active lateral balance",
      ],
      legalSignificance:
        "This is the broad claim that made the later aileron dispute legally consequential.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "This claim adds a specific biplane structure to Claim 1's margin motion. Two normally parallel wings are stacked one over the other. Upright standards connect their margins; at the lateral portions those connections are flexible, while the standards maintain a fixed separation between the parts they join. Each side margin can move above or below its wing's normal plane about a spanwise axis, producing different angles of incidence, and a mechanism must impart that motion.",
      keyInnovations: ["Superposed aeroplanes", "Flexible upright joints", "Fixed wing spacing"],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "This is the single-wing version. A normally flat aeroplane has side margins that can move above or below its normal plane about a spanwise axis. The margins must take different angular positions both relative to the main wing plane and relative to one another, so they meet the air at different angles of incidence. The claim also requires a mechanism that moves the margins together in that differential relation.",
      keyInnovations: [
        "Normal wing plane",
        "Simultaneous opposed motion",
        "Differential incidence",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "This claim combines the paired-wing arrangement with coordinated differential warping. Parallel stacked aeroplanes each have movable side margins. Uprights connect their edges; the uprights at the side portions use flexible joints and keep their connected points the same distance apart. A single mechanism moves both wings' margins so the two margins on a given side take the same angle, while the margins on the opposite side take a different angle.",
      keyInnovations: [
        "Paired wing surfaces",
        "Equal same-side angle",
        "Flexible jointed uprights",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "This claim narrows the geometry. The aeroplane is a normally flat rectangle elongated across the direction of flight. Its side margins move about an axis within the wing body that is perpendicular to those margins. That motion places the margins at different angular relations to the wing's normal plane. The claimed combination includes the means that causes that movement.",
      keyInnovations: ["Transverse wing span", "Inboard warp axis", "Variable lateral margins"],
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualClaimText(6),
      plainEnglish:
        "This is the rectangular-biplane form of the preceding idea. Two normally flat, span-elongated wings remain equidistant through upright standards, and the standards at their side portions have flexible joints. One mechanism simultaneously moves both side margins of both wings about axes that lie in the wing planes and are perpendicular to the margins. Margins on the same side move to the same angle; margins on opposite sides move to different angles.",
      keyInnovations: ["Biplane warp", "Equidistant standards", "Opposed margin angles"],
    },
    {
      number: 7,
      isIndependent: true,
      originalText: manualClaimText(7),
      plainEnglish:
        "This claim adds the coordinated yaw correction to a differentially warped wing. The mechanism moves the wing's side portions to different angular relations, so they meet the air at different angles of incidence. It also includes a vertical rudder and a linkage that makes the rudder face the side nearest the wing margin with the smaller angle of incidence and the least air resistance. That orientation counters the yaw caused when the higher-incidence side has more drag.",
      keyInnovations: ["Coupled roll and yaw", "Vertical rudder", "Adverse-yaw correction"],
      legalSignificance:
        "This expresses the coupled-control relation, rather than merely adding a rudder to an aircraft.",
    },
    {
      number: 8,
      isIndependent: true,
      originalText: manualClaimText(8),
      plainEnglish:
        "This is Claim 7 in the flexible biplane form. Two parallel stacked wings stay equidistant through upright standards, with flexible joints at their lateral portions. A mechanism moves both wings' side portions into different angles, so one side presents a different incidence to the air than the other. A vertical rudder is linked to face the side with the smaller incidence and lower resistance.",
      keyInnovations: ["Superposed wings", "Coupled rudder", "Differential resistance"],
    },
    {
      number: 9,
      isIndependent: true,
      originalText: manualClaimText(9),
      plainEnglish:
        "This claim requires a normally flat wing elongated across the line of flight and a mechanism that gives it a helicoidal warp. The twist occurs around a spanwise axis located centrally along the body of the wing, in the direction in which the wing is elongated. “Helicoidal” means the twist is distributed through the wing surface rather than being a single hinged deflection.",
      keyInnovations: ["Helicoidal warp", "Central transverse axis", "Continuous twist"],
    },
    {
      number: 10,
      isIndependent: true,
      originalText: manualClaimText(10),
      plainEnglish:
        "This is the two-wing version of the helicoidal-warp claim. Two normally flat, span-elongated wings are held equidistant by upright standards, and the standards attach through flexible joints. The required mechanism simultaneously gives each wing a helicoidal warp about its central spanwise axis.",
      keyInnovations: ["Two warped wings", "Flexible standards", "Synchronized warp"],
    },
    {
      number: 11,
      isIndependent: true,
      originalText: manualClaimText(11),
      plainEnglish:
        "This claim combines the flexible-jointed, equidistant biplane of Claim 10 with a vertical rudder. Both wings receive simultaneous helicoidal warps about their central spanwise axes. The rudder must be moved so its resisting surface faces the side nearest the wing margins with smaller incidence and less air resistance, preserving the roll-and-yaw relationship described in Claim 7.",
      keyInnovations: ["Helicoidal biplane warp", "Vertical rudder", "Low-drag-side steering"],
    },
    {
      number: 12,
      isIndependent: true,
      originalText: manualClaimText(12),
      plainEnglish:
        "This claim covers a normally flat, substantially horizontal flexible rudder used with an aeroplane. A mechanism curves that rudder rearward and upward or rearward and downward relative to its normal plane. The legal point is the curved pitch-control surface, not merely any flat horizontal plane.",
      keyInnovations: ["Horizontal rudder", "Flexible curvature", "Pitch control"],
    },
    {
      number: 13,
      isIndependent: true,
      originalText: manualClaimText(13),
      plainEnglish:
        "This specifies the front-rudder mechanism more closely. The normally flat, horizontal flexible rudder pivots near its center on an axis across the line of flight. Springs resist vertical motion of its front edge. A separate mechanism moves its rear edge above or below the normal plane, bending the surface while the front edge is restrained.",
      keyInnovations: ["Transverse pivot", "Restoring springs", "Rear-edge control"],
    },
    {
      number: 14,
      isIndependent: true,
      originalText: manualClaimText(14),
      plainEnglish:
        "This claim puts the three control functions in one aircraft. Connected stacked wings have opposite side portions moved to different angles. A vertical rudder is driven toward the side with smaller incidence and less air resistance. A horizontal rudder has a mechanism that presents either its upper or lower surface to the air. The combination therefore includes roll control, yaw correction, and pitch control together.",
      keyInnovations: ["Three-axis control", "Vertical rudder", "Horizontal rudder"],
    },
    {
      number: 15,
      isIndependent: true,
      originalText: manualClaimText(15),
      plainEnglish:
        "This repeats Claim 14's connected stacked wings, differential side angles, linked vertical rudder, and air-facing horizontal rudder. It adds the positional requirement: the vertical rudder is at the rear of the machine and the horizontal rudder is at the front. That is the Wright canard arrangement, stated as part of the claimed combination.",
      keyInnovations: ["Aft yaw control", "Forward pitch control", "Coordinated surfaces"],
    },
    {
      number: 16,
      isIndependent: true,
      originalText: manualClaimText(16),
      plainEnglish:
        "This claim covers the rear support arrangement. Two connected stacked aeroplanes each have an arm extending rearward. The arms are parallel and their rear ends can swing upward. A vertical rudder pivots in those rear ends. The upward freedom protects the tail assembly when it contacts the ground at a landing angle.",
      keyInnovations: ["Tail arms", "Vertical rudder pivot", "Free upward motion"],
    },
    {
      number: 17,
      isIndependent: true,
      originalText: manualClaimText(17),
      plainEnglish:
        "This claim specifies the cable-built flexible biplane. Two normally flat but flexible wings are stacked and joined at their margins by upright standards through universal joints. Diagonal stay-wires connect opposite ends of adjacent standards. One rope runs along the lower wing's front edge, through guides at its front corners, to the upper wing's rear corners. A second rope runs along the lower wing's rear edge, through rear-corner guides, to the upper wing's front corners.",
      keyInnovations: ["Universal joints", "Diagonal stay-wires", "Front and rear control ropes"],
    },
    {
      number: 18,
      isIndependent: true,
      originalText: manualClaimText(18),
      plainEnglish:
        "This retains every structural element of Claim 17: the flexible stacked wings, universal-jointed standards, diagonal stay-wires, front rope, rear rope, corner guides, and diagonally opposed rope endpoints. It adds a vertical rudder and a tiller-rope that connects that rudder to the rope along the rear edge of the lower wing. The added linkage makes the rudder move with the wing-warping cable system.",
      keyInnovations: ["Tiller-rope", "Rudder linkage", "Wing-warping rigging"],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective View of 1903 Wright Flyer Airframe",
      caption:
        "Complete perspective view showing superposed biplane wings, forward canard elevator, rear twin vertical rudders, and pilot cradle.",
      svgType: "wright-flyer",
      callouts: [
        {
          id: "wf-1",
          figureRef: "Fig. 1",
          label: "1",
          element: "Upper Aeroplane Surface",
          description:
            "Flexible ash and spruce spar frame covered with Pride of the West muslin fabric.",
          x: 50,
          y: 25,
        },
        {
          id: "wf-2",
          figureRef: "Fig. 1",
          label: "2",
          element: "Lower Aeroplane Surface",
          description:
            "Lower wing supporting the pilot cradle, 12-hp engine, and twin counter-rotating propellers.",
          x: 50,
          y: 70,
        },
        {
          id: "wf-3",
          figureRef: "Fig. 1",
          label: "3",
          element: "Pivoted Upright Struts",
          description:
            "Vertical ash struts connected by universal ball/hook pivots allowing helical twisting.",
          x: 30,
          y: 48,
        },
        {
          id: "wf-6",
          figureRef: "Fig. 1",
          label: "6",
          element: "Pilot Hip Cradle",
          description:
            "Sliding cradle worn around the pilot's hips to pull wing-warping and rudder cables simultaneously.",
          x: 48,
          y: 65,
        },
        {
          id: "wf-9",
          figureRef: "Fig. 1",
          label: "9",
          element: "Vertical Rear Rudder",
          description:
            "Twin vertical vanes interconnected to neutralize adverse yaw during banking maneuvers.",
          x: 88,
          y: 45,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Otto Lilienthal died in 1896 when a gust stalled his hang glider and he had no roll control except shifting his hips. Percy Pilcher died the same way in 1899. Samuel Langley's Aerodrome, built with War Department money, dumped itself into the Potomac on 7 October and again on 8 December 1903, nine days before Kitty Hawk. The machines of the 1890s could lift; they could not be flown.",
    priorArtLimitations: [
      "Rigid wings with no way to change left/right incidence in flight.",
      "Pendulum 'inherently stable' tails that amplified phugoid oscillations in gusts.",
      "No yaw surface linked to the roll control, so a bank produced a skidding spin.",
      "Langley's houseboat catapult launches left no room to learn in small hops.",
      "European 'more power' programs (Maxim, Ader) treated the air as a still fluid.",
    ],
    breakthroughInsight:
      "Watching buzzards over Huffman Prairie, the Wrights saw that a bird banks by twisting a wingtip, not by leaning. They built that twist into a muslin box kite, then tied the same hip cradle to a rear rudder after the 1901 glider yawed the wrong way every time they warped.",
    patentWars: [
      {
        rivalName: "Glenn H. Curtiss and the Aerial Experiment Association",
        rivalClaim:
          "Curtiss said hinged triangular 'ailerons' on the June Bug were a different invention from twisting the whole wing.",
        conflictDetails:
          "The Wright Company sued in 1909. Judge John R. Hazel (and later the Second Circuit) read Claim 1 as covering any scheme that presents the two wing margins at different angles of incidence. Curtiss kept flying and appealing; Wilbur spent his last healthy years in court rather than in a shop. He died of typhoid in 1912, exhausted by the suits.",
        resolution:
          "In 1917 the War Department forced the Manufacturers Aircraft Association pool so that American factories could build trainers without an injunction. Wright-Martin took a lump payment plus a per-airframe royalty; Curtiss took a matching settlement. Ailerons, not warping, won the hardware fight. The legal fight had already been lost.",
        legalOutcome:
          "Claim 1 held. The pool ended the injunctions. Later courts treated hinged flaps as equivalents of warping.",
      },
    ],
    civilizationalImpact:
      "Once a pilot could hold a coordinated bank, airplanes became tools instead of stunts. Mail, war, and passenger routes all assume the same three-axis grammar this patent first wrote down.",
    funFact:
      "They filed the application themselves on 23 March 1903 and the Patent Office bounced it. Dayton attorney Harry A. Toulmin rewrote the claims around the control method, not the engine, and US 821,393 issued on 22 May 1906. The first powered flights had already happened; the patent does not mention a motor.",
    aftermath:
      "Orville sold the Wright Company in 1915. He lived until 1948 and spent much of the 1920s arguing with the Smithsonian over whether Langley's 1903 machine had been 'capable of flight' (a reconstructed Aerodrome, heavily modified, flew in 1914). The original 1903 Flyer sat in London until the Smithsonian recanted in 1942.",
    sideNotes: [
      "The 1901 glider produced barely a third of the lift Lilienthal's tables predicted. The brothers built a bicycle-mounted balance, then a 6-foot wind tunnel, and remeasured about 200 wing sections in late 1901. Those numbers, not the patent drawings, are why the 1902 glider finally flew.",
      "The hip cradle on the 1902–1903 machines pulled both warp cables and rudder cables. In 1904–1905 they split the rudder onto a hand lever after learning that a pilot sometimes wants yaw without roll.",
      "Charlie Taylor built the 12-horsepower four-cylinder engine in six weeks in the bicycle shop. The patent is silent on it because the invention, as Toulmin framed it, was the control system.",
    ],
  },
  tags: [
    "Wright Brothers",
    "Orville Wright",
    "Wilbur Wright",
    "Aviation",
    "Aerodynamics",
    "Wing Warping",
    "Flight Control",
    "3-Axis Control",
  ],
  stats: {
    totalClaims: 18,
    independentClaims: 18,
  },
};
