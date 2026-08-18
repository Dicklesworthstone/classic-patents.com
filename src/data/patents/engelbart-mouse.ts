import { engelbartMouseArchivalEdition } from "@/data/editions/engelbartMouseEdition";
import type { Patent } from "@/types/patent";

/** Preserved legacy draft; it is intentionally not exported or registered. */
const legacyEngelbartMousePatent: Patent = {
  id: "us-3541541-engelbart-mouse",
  patentNumber: "US 3,541,541",
  title: "X-Y Position Indicator for a Display System",
  shortTitle: "Douglas Engelbart's Computer Mouse",
  subtitle: "Orthogonal Dual-Wheel Coordinate Encoding & Direct Handheld Screen Navigation",
  inventors: ["Douglas C. Engelbart"],
  inventorLocation: "Menlo Park, California",
  grantDate: "1970-11-17",
  filingDate: "1967-06-21",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Computing & Human-Computer Interaction",
  summary:
    "The Invention of Interactive Computing and the GUI: On June 21, 1967, computer visionary Douglas C. Engelbart filed US Patent No. 3,541,541 for the first handheld computer mouse at the Stanford Research Institute (SRI). While 1960s computers relied on batch punched cards and clumsy light pens that caused extreme arm fatigue, Engelbart and lead engineer Bill English created a palm-sized wooden block housing two mutually perpendicular brass encoder wheels. As the user moved the device across a desk, the wheels decomposed 2D planar motion into independent X and Y analog voltage coordinates ($MT = a + b \\log_2(2D/W)$), giving birth to the modern graphical user interface (GUI) and interactive desktop computing.",
  heroQuote:
    "The mouse gave us the ability to interact with information directly in real time, transforming computers from batch-processing calculation engines into interactive intellectual augmentations of the human mind.",
  originalPdfUrl: "/patents/pdfs/us-3541541-engelbart-mouse.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3541541A/en",
  usptoClassification:
    "G06F 3/033 (Digital computers; Input arrangements using cursor controllers)",
  originalTextAsset: {
    url: "/patents/source-text/us-3541541-engelbart-mouse.txt",
    pageCount: 7,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE
3,541,541
Patented Nov. 17, 1970

X-Y POSITION INDICATOR FOR A DISPLAY SYSTEM
Douglas C. Engelbart, Menlo Park, Calif., assignor to Stanford Research Institute, Menlo Park, Calif., a corporation of California
Filed June 21, 1967, Ser. No. 647,563
Int. Cl. G06f 3/033
U.S. Cl. 345-163
3 Claims

SPECIFICATION

TO ALL WHOM IT MAY CONCERN:
Be it known that I, DOUGLAS C. ENGELBART, a citizen of the United States, residing at Menlo Park, in the county of San Mateo and State of California, have invented certain new and useful improvements in an X-Y POSITION INDICATOR FOR A DISPLAY SYSTEM, of which the following is a specification:

BACKGROUND OF THE INVENTION
In interactive computer systems employing cathode ray tube displays, it is frequently desirable for a human operator to rapidly and accurately position a cursor or coordinate point on the display screen. Prior techniques for achieving this objective have utilized light pens held against the phosphor screen face, joysticks manipulated by the fingers, or banks of keyboard step buttons.

Light pens suffer from the distinct disadvantage that the operator must maintain his hand and arm in an elevated, unsupported posture, causing rapid muscular fatigue during sustained computer sessions. Joysticks, on the other hand, typically control cursor velocity rather than absolute spatial displacement, making precise millimeter targeting difficult.

SUMMARY OF THE INVENTION
The present invention overcomes these difficulties by providing a compact, handheld control unit—commonly designated as a "mouse"—which rests comfortably on a working surface such as a desk adjacent to the display console. The operator's hand rests naturally on the upper surface of the housing in a supported posture.

Within the housing are mounted two wheels oriented at right angles (90 degrees) to each other. When the housing is translated across the surface, each wheel rolls exclusively in response to motion parallel to its rotation plane, while skidding laterally in response to orthogonal motion. Each wheel drives an associated potentiometer or digital pulse encoder, producing independent X and Y coordinate signals transmitted to the computer display circuitry.

DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS
Referring to FIG. 1, the indicator comprises a carved wooden housing 10 dimensioned to fit comfortably within the palm of an operator's hand. On the top front portion of the housing is disposed a microswitch push-button 12 adapted to be depressed by the operator's index finger to signal selection or entry of a target coordinate.

Referring to FIG. 2, the bottom face of housing 10 reveals first wheel 16 and second wheel 18. Wheel 16 rotates about an axle aligned with the lateral Y-axis, thereby measuring displacement along the longitudinal X-axis. Wheel 18 rotates about an axle aligned with the longitudinal X-axis, thereby measuring displacement along the lateral Y-axis. The lower perimeters of wheels 16 and 18 contact the supporting tabletop through an opening in baseplate 20.

As the device is moved along any arbitrary straight or curved path on the table, the instantaneous displacement vector decomposes into its orthogonal vector components. Wheel 16 rotates by an angle proportional to the X displacement, while wheel 18 rotates by an angle proportional to the Y displacement. Potentiometers 24 and 26, coupled directly to the respective wheel shafts, modulate electrical voltages delivered via flexible multi-conductor cable 28 to the display control unit.

Depressing button 12 closes an electrical circuit, notifying the central data processing apparatus that the displayed cursor location corresponds to a selected alphanumeric character, graphical node, or program execution instruction.

I CLAIM:
1. An X-Y position indicator control mechanism comprising: a housing adapted to be moved by hand over a surface; a first wheel mounted in said housing for rotation about an axis in response to movement of said housing along said surface in a first direction; a second wheel mounted in said housing for rotation about an axis perpendicular to said first wheel axis in response to movement of said housing along said surface in a second direction perpendicular to said first direction; first means responsive to rotation of said first wheel for generating a first electrical signal representing displacement in said first direction; and second means responsive to rotation of said second wheel for generating a second electrical signal representing displacement in said second direction.
2. An indicator as set forth in claim 1, wherein each of said first and second means comprises a rotary potentiometer coupled to a respective one of said wheels.
3. An indicator as set forth in claim 1, wherein said housing includes at least one manually depressible switch on an upper surface thereof for transmitting control signals to an associated display system.`,
  plainEnglishExplanation: {
    overview:
      "In the 1960s, computing was an impersonal batch-processing bureaucracy: users submitted stacks of cardboard punch cards to technicians behind glass and waited hours or days for printed paper results. Douglas Engelbart envisioned computers as dynamic intellectual instruments that could augment human intellect in real time. To interact directly with cathode ray tube (CRT) display screens, operators needed an effortless way to point at text and graphics. Engelbart invented the mouse: a tabletop wooden box with two perpendicular brass wheels that decomposed hand movements into X and Y coordinate voltages, freeing users from holding fatiguing light pens against vertical glass screens.",
    coreMechanism:
      "Two sharp-edged brass wheels are mounted inside a palm-sized wooden housing at an exact 90-degree angle to one another. When the user slides the mouse across a desk, motion parallel to the X-axis causes the X-wheel to roll freely while the Y-wheel skids sideways across the table surface; motion parallel to the Y-axis causes the Y-wheel to roll while the X-wheel skids. As each wheel turns, its axle rotates a precision potentiometer, altering electrical resistance and generating independent $V_x$ and $V_y$ analog voltages. These voltages are converted to digital screen coordinates to instantly position the CRT electron beam cursor, while a top red microswitch button allows the user to click, select text, and trigger hyperlinks.",
    mechanicalBreakdown: [
      {
        title: "Orthogonal Dual-Wheel Coordinate Resolver",
        summary: "Two knife-edge brass encoder wheels positioned at 90 degrees to one another.",
        technicalDetails:
          "Decomposes continuous 2D planar hand velocity vectors $\\vec{v} = v_x\\hat{i} + v_y\\hat{j}$ into independent angular displacements ($\\Delta\\theta_x = \\Delta x / r$, $\\Delta\\theta_y = \\Delta y / r$) via pure mechanical rolling and orthogonal skidding.",
        archaicTerm: "Position indicator wheels mounted perpendicularly",
        modernEquivalent: "Optical mouse sensor / trackball rotary encoders",
      },
      {
        title: "Axial Potentiometric Voltage Transducers",
        summary: "Variable resistance wiper contacts coupled directly to wheel shafts.",
        technicalDetails:
          "Sweep across carbon resistive tracks as the wheels rotate, outputting analog voltages $V_x(t) \\propto \\Delta x$ and $V_y(t) \\propto \\Delta y$ directly to analog-to-digital converters connected to the display generator.",
        archaicTerm: "Electrical transducer means",
        modernEquivalent: "Digital quadrature optical encoders (CPI sensor)",
      },
      {
        title: "Top Microswitch Selection Button",
        summary: "A spring-loaded fingertip click button on the front of the housing.",
        technicalDetails:
          "Pressing the red button sends an electrical interrupt pulse to the CPU, latching the current X-Y beam coordinates to select words, graphical vertices, or hyperlink nodes.",
        archaicTerm: "Manually depressible switch",
        modernEquivalent: "Left mouse click button / Omron microswitch",
      },
      {
        title: "Tabletop Forearm-Supported Wooden Chassis",
        summary: "A carved walnut wood casing shaped to support the human palm.",
        technicalDetails:
          "Provides neutral wrist posture and eliminates gravitational shoulder torque ($\\tau_{shoulder} = 0$), allowing operators to work comfortably for 8+ hours without muscular strain.",
        archaicTerm: "Housing adapted to be moved by hand over a surface",
        modernEquivalent: "Ergonomic contoured mouse housing",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Cartesian Vector Decomposition & Roll-Skid Kinematics",
        formula:
          "\\vec{v}_{hand} = v_x \\hat{i} + v_y \\hat{j} \\implies \\Delta x = r \\Delta\\theta_x, \\quad \\Delta y = r \\Delta\\theta_y",
        explanation:
          "Translational displacement on a plane decomposes linearly into orthogonal angular rotations of perpendicular wheels, eliminating the need for trigonometric calculations on the mainframe.",
      },
      {
        principle: "Fitts's Law of Human-Motor Target Acquisition",
        formula: "MT = a + b \\log_2\\left(\\frac{2D}{W}\\right) = a + b \\cdot \\text{ID}",
        explanation:
          "Movement time $MT$ to acquire a screen target of width $W$ at distance $D$ is minimized by the mouse because direct 1:1 hand displacement achieves the highest Index of Performance ($IP = 1/b$) of any pointing device tested.",
      },
      {
        principle: "Analog Potentiometer Voltage Divider & ADC Quantization",
        formula:
          "V_x(t) = V_{ref} \\left(\\frac{\\theta_x(t)}{\\theta_{max}}\\right), \\quad X_{screen} = \\left\\lfloor \\frac{V_x}{V_{ref}} \\cdot N_{pixels} \\right\\rfloor",
        explanation:
          "Rotary potentiometers generate linear analog voltage ramps proportional to hand displacement, which are digitized to drive electron beam deflection circuitry on the CRT display.",
      },
      {
        principle: "Quadrature Pulse Phase & Velocity Limits",
        formula:
          "f_{pulse} = \\frac{\\text{CPI} \\cdot v}{25.4\\text{ mm/s}}, \\quad v_{max} < \\frac{f_{sample} \\cdot 25.4}{2 \\cdot \\text{CPI}}",
        explanation:
          "90° phase displacement between contact wipers indicates forward/backward rotation direction, while pulse frequency encodes hand velocity without directional ambiguity.",
      },
      {
        principle: "Biomechanical Shoulder Torque & Muscle Fatigue Elimination",
        formula:
          "\\tau_{shoulder} = m_{arm} g L_{arm} \\sin\\theta \\approx 0 \\quad (\\text{tabletop resting arm vs. light pen } \\tau \\approx 15\\text{ N}\\cdot\\text{m})",
        explanation:
          "Resting the forearm on the desk reduces static shoulder muscle contraction to zero, preventing the rapid deltoid fatigue that doomed vertical light pens.",
      },
    ],
    whyItMattersToday:
      "Douglas Engelbart's mouse became the universal input standard for personal computers worldwide. It directly paved the way for the Xerox Alto, Apple Macintosh, Microsoft Windows, and modern desktop computing. Every time you click a hyperlink, drag a window, select text, or use CAD software, you are using the direct-manipulation interaction paradigm Engelbart invented in 1967.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "1. An X-Y position indicator control mechanism comprising: a housing adapted to be moved by hand over a surface; a first wheel mounted in said housing for rotation about an axis in response to movement of said housing along said surface in a first direction; a second wheel mounted in said housing for rotation about an axis perpendicular to said first wheel axis in response to movement of said housing along said surface in a second direction perpendicular to said first direction; first means responsive to rotation of said first wheel for generating a first electrical signal representing displacement in said first direction; and second means responsive to rotation of said second wheel for generating a second electrical signal representing displacement in said second direction.",
      plainEnglish:
        "The master patent claim for the computer mouse: a handheld housing moved over a desk, containing two perpendicular wheels that roll in response to orthogonal movements and independently generate X and Y electrical displacement signals.",
      keyInnovations: [
        "Perpendicular dual-wheel mechanical coordinate resolver",
        "Handheld table-supported ergonomic housing",
        "Direct electrical X-Y signal generation for display cursors",
      ],
      legalSignificance:
        "The pioneer claim covering all dual-axis mechanical coordinate input devices moved by hand across a surface to position a display cursor.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "2. An indicator as set forth in claim 1, wherein each of said first and second means comprises a rotary potentiometer coupled to a respective one of said wheels.",
      plainEnglish:
        "Specifies rotary potentiometers as the electrical transducers converting wheel rotation into analog voltage signals.",
      keyInnovations: ["Potentiometer voltage modulation proportional to wheel angle"],
      legalSignificance:
        "Protected analog potentiometer-based mouse position encoders used in early prototype interactive systems.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "3. An indicator as set forth in claim 1, wherein said housing includes at least one manually depressible switch on an upper surface thereof for transmitting control signals to an associated display system.",
      plainEnglish:
        "Adds the integrated click button on top of the housing for selecting objects, executing commands, and triggering links on the display screen.",
      keyInnovations: ["Fingertip click microswitch integrated on the mouse body"],
      legalSignificance:
        "Secured the foundational integration of a physical click button directly onto the handheld pointer housing.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective View of Handheld Mouse Housing",
      caption:
        "Top perspective view showing the palm-fitting wooden housing, top microswitch click button, and rear trailing connection cord.",
      svgType: "engelbart-mouse",
      callouts: [
        {
          id: "c1",
          figureRef: "Fig. 1",
          label: "10",
          element: "Wooden Housing Chassis",
          description: "Carved palm-fitting walnut wooden chassis supporting the operator's hand.",
          x: 45,
          y: 40,
        },
        {
          id: "c2",
          figureRef: "Fig. 1",
          label: "12",
          element: "Top Click Microswitch",
          description:
            "Spring-loaded index finger button for coordinate selection and link triggering.",
          x: 65,
          y: 25,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Bottom View of Perpendicular Encoder Wheels",
      caption:
        "Bottom plan view revealing the X and Y brass encoder wheels positioned at an exact 90-degree angle to decompose planar movement.",
      svgType: "engelbart-mouse",
      callouts: [
        {
          id: "c3",
          figureRef: "Fig. 2",
          label: "16",
          element: "X-Axis Brass Encoder Wheel",
          description: "Resolves horizontal tabletop displacement into rotational X coordinates.",
          x: 35,
          y: 50,
        },
        {
          id: "c4",
          figureRef: "Fig. 2",
          label: "18",
          element: "Y-Axis Brass Encoder Wheel",
          description: "Resolves vertical tabletop displacement into rotational Y coordinates.",
          x: 65,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1962, interacting with a computer was agonizingly slow and fatiguing. The few experimental graphics systems available required users to hold a heavy 'light pen' against a vertical glass screen. Within 15 minutes, the user's arm experienced severe muscular exhaustion ('Gorilla Arm' syndrome). Joysticks controlled velocity rather than absolute spatial displacement, causing frustrating overshoots, while keyboard arrow keys could only step laboriously one character at a time.",
    priorArtLimitations: [
      "Light pens required holding the arm unsupported in mid-air against vertical phosphor screens, causing rapid physical exhaustion.",
      "Joysticks and trackballs had poor targeting accuracy and lacked intuitive 1:1 spatial mapping to the screen.",
      "Card punch machines and teletype keyboards completely lacked real-time graphical direct manipulation capabilities.",
    ],
    breakthroughInsight:
      "Douglas Engelbart, director of the Augmentation Research Center (ARC) at SRI in Menlo Park, California, realized that the human hand operates with maximum precision when resting comfortably on a flat desk. Working with SRI lead engineer Bill English, Engelbart designed a carved wooden block containing two perpendicular brass wheels at 90 degrees. As the block moved across the desk, one wheel rolled for X displacement while the other skidded, and vice versa. Rigorous human factors testing proved the mouse was vastly faster and more accurate than light pens, joysticks, or knee controllers.",
    patentWars: [
      {
        rivalName: "Xerox Corporation and Apple Computer",
        rivalClaim:
          "In 1971, Bill English moved from SRI to Xerox PARC and invented the ball mouse (replacing the two wheels with a single spherical ball driving internal rollers). Xerox claimed this mechanical improvement was proprietary.",
        conflictDetails:
          "In December 1979, Steve Jobs and Apple engineers visited Xerox PARC and witnessed Engelbart's GUI and mouse in action on the Xerox Alto. Jobs recognized the future of computing and negotiated with SRI to license Engelbart's foundational patent US 3,541,541 for a lump sum of approximately $40,000.",
        resolution:
          "Apple redesigned the mouse with industrial designer Dean Hovey to be reliable, easy to clean, and manufacturable for under $15, shipping it with the historic Apple Lisa in 1983 and the Macintosh in 1984.",
        legalOutcome:
          "SRI received royalties for the foundational patent, but Douglas Engelbart personally never received any royalties because the patent belonged to SRI.",
      },
    ],
    civilizationalImpact:
      "On December 9, 1968, at the Fall Joint Computer Conference in San Francisco, Douglas Engelbart presented **'The Mother of All Demos.'** In a 90-minute live demonstration, Engelbart used his mouse to unveil the world's first interactive computer system (NLS), demonstrating windows, hypertext hyperlinks, video conferencing, collaborative real-time screen sharing, text editing, and graphical user interfaces 15 years before the Apple Macintosh.",
    funFact:
      "Why is it called a 'mouse'? In the ARC lab at SRI, the connecting cable originally exited from the back of the wooden block directly under the user's wrist, resembling a rodent's tail. Engelbart recalled: 'Nobody can remember who started calling it a mouse. In the lab we had to call it something, so we called it a mouse, and the cursor on the screen was a CAT. The name stuck, and we never apologized for it!'",
    aftermath:
      "Douglas Engelbart received the National Medal of Technology in 2000 and the Turing Award-equivalent Lemelson-MIT Prize ($500,000) in 1997. He passed away in 2013 at age 88, remembered as one of the greatest visionary pioneers in the history of human-computer interaction.",
    sideNotes: [
      "Engelbart also invented the five-key chord keyset, which allowed users to type binary character codes with one hand while continuously pointing with the mouse in the other.",
      "The first mouse was hand-carved out of a block of solid walnut by Bill English in 1964.",
    ],
  },
  tags: [
    "Douglas Engelbart",
    "Computer Mouse",
    "Human-Computer Interaction",
    "GUI",
    "Stanford Research Institute",
    "Silicon Valley",
    "Apple Macintosh",
    "Mother of All Demos",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1967–1984",
    impactScore: 100,
  },
};

function manualClaimText(number: number): string {
  const claim = engelbartMouseArchivalEdition.blocks.find(
    (block) => block.kind === "claim" && block.number === number,
  );
  if (claim?.kind !== "claim") throw new Error(`Engelbart edition is missing claim ${number}.`);
  return claim.inlines.map((inline) => inline.text).join("");
}

export const engelbartMousePatent: Patent = {
  id: "us-3541541-engelbart-mouse",
  patentNumber: "US 3,541,541",
  title: "X-Y Position Indicator for a Display System",
  shortTitle: "Engelbart Two-Wheel X-Y Position Indicator",
  subtitle: "Orthogonal wheel transducers for CRT cursor positioning",
  inventors: ["Douglas C. Engelbart"],
  inventorLocation: "Palo Alto, California",
  grantDate: "1970-11-17",
  filingDate: "1967-06-21",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Computing & Human-Computer Interaction",
  summary: "US 3,541,541 describes a hand-moved X-Y position control for a CRT display system. Two perpendicular wheels, a third ball-bearing support, transducers, and a flexible cable let a computer place and hold a cursor while buttons select display operations.",
  heroQuote: "The indicator control remains stationary so long as it is left in place; therefore the cursor 20 remains fixed without any effort of the human operator.",
  originalPdfUrl: "/patents/pdfs/us-3541541-engelbart-mouse.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3541541A/en",
  usptoClassification: "U.S. Cl. 340-324; Int. Cl. H01j 29/70",
  // The complete authored edition and reviewed ledger remain patent-local
  // WIP. They are intentionally not bound to the public record until the
  // ledger achieves full literal parity and root registers its companion map.
  originalText: "This invention relates to visual display systems and, more particularly, to devices for altering the display at selected locations. One subject of the invention is to provide an X-Y position indicating control mechanism for controlling indications of positions on a cathode ray tube (CRT) display, by movement along a surface which can be other than the face of the CRT.",
  plainEnglishExplanation: {
    overview: "Engelbart's patent moves pointing from a vertical CRT surface to a control resting on a desk. The hand moves a housing; two perpendicular wheels report the two components of that movement; the computer places a CRT cursor from those signals.",
    coreMechanism: "For each wheel, translation along its rolling direction produces shaft rotation. The two perpendicular axes separate X and Y displacement; potentiometer voltage, absolute encoder outputs, or signed incremental pulses carry the resulting position information through the cable to the computer.",
    mechanicalBreakdown: [
      { title: "Three-point housing support", summary: "Two rimmed wheels and a ball bearing support the housing.", technicalDetails: "The three contacts keep both wheels on the surface and help suppress jitter while the housing is at rest.", archaicTerm: "position indicator control", modernEquivalent: "desk-supported pointing device" },
      { title: "Orthogonal wheels", summary: "X and Y wheels have perpendicular rotation axes.", technicalDetails: "Each wheel shaft can drive its own transducer, so the computer receives separate signals for the two position components.", archaicTerm: "position wheel", modernEquivalent: "axis encoder wheel" },
      { title: "Digital readout alternatives", summary: "The specification gives shaft-position and incremental encoder circuits.", technicalDetails: "The incremental embodiments create directional pulses which an up-down counter accumulates; they reduce lead count compared with an absolute multi-output disk.", archaicTerm: "transducer means", modernEquivalent: "rotary position encoder" },
    ],
    scientificPrinciples: [
      { principle: "Orthogonal coordinate resolution", formula: "Δx = rθx; Δy = rθy", explanation: "Rolling displacement turns a wheel by angle θ; two perpendicular wheel axes provide separate coordinate measurements." },
      { principle: "Potentiometer voltage division", formula: "Vout = Vref Rwiper/Rtotal", explanation: "Figure 4 reads each wiper voltage relative to ground to infer the corresponding wheel setting." },
      { principle: "Signed pulse counting", formula: "N = Nup - Ndown", explanation: "Figures 6 and 7 use direction-sensitive pulse logic and an up-down counter for a digital position result." },
    ],
    whyItMattersToday: "The grant is an early primary document for desktop pointing in a computer-controlled display system. Its particular implementation is two orthogonal wheels and a cable, not the later optical sensor familiar in modern mice.",
  },
  claims: [1, 2, 3, 4, 5, 6, 7, 8].map((number) => ({
    number,
    isIndependent: number === 1 || number === 5 || number === 8,
    ...(number >= 2 && number <= 4 ? { dependsOn: [number === 2 || number === 4 ? 1 : 2] } : number === 6 || number === 7 ? { dependsOn: [5] } : {}),
    originalText: manualClaimText(number),
    plainEnglish: `Claim ${number} preserves the particular combination and limitations printed in the source edition: it ties the stated X-Y position control, wheel-transducer arrangement, and where applicable its encoder, counter, conductor, or display-system limitation to the legal scope of this claim.`,
    keyInnovations: ["Position wheel", "Digital position signal", "Flexible conductor"],
  })),
  drawings: [1, 2, 3, 4, 5, 6, 7].map((number) => ({ figureNumber: `Fig. ${number}`, title: `Source drawing Fig. ${number}`, caption: `Facsimile crop of Fig. ${number} from US 3,541,541.`, svgType: "engelbart-mouse", callouts: [] })),
  historicalContext: { problemStatement: "The source identifies light-pencil use against a CRT as an obstacle because it occupies one hand and obscures the editing area.", priorArtLimitations: ["A light pencil must be held against the CRT.", "A shaft-position encoder can require a large cable."], breakthroughInsight: "A housing resting on two perpendicular wheels and a ball bearing can report position without holding a detector against the screen.", patentWars: [], civilizationalImpact: "The patent documents a desk-surface pointing control coupled to a computer display, including analog and incremental digital signal paths.", aftermath: "This record makes no broader legal-priority claim beyond the reviewed grant." },
  tags: ["human-computer interaction", "CRT", "position encoder", "computer mouse"],
  stats: { totalClaims: 8, independentClaims: 3 },
};
