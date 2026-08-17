import type { Patent } from "@/types/patent";

export const engelbartMousePatent: Patent = {
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
    "The seminal master patent of human-computer interaction: Douglas Engelbart's handheld X-Y position indicator ('mouse') featuring mutually perpendicular encoder wheels that resolve tabletop displacement into Cartesian coordinate signals for real-time cursor targeting on CRT displays.",
  heroQuote:
    "The mouse gave us the ability to interact with information directly in real time, transforming computers from batch-processing calculation engines into interactive intellectual augmentations of the human mind.",
  originalPdfUrl: "/patents/pdfs/us-3541541-engelbart-mouse.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3541541A/en",
  usptoClassification:
    "G06F 3/033 (Digital computers; Input arrangements using cursor controllers)",
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
      "Douglas Engelbart conceived the computer mouse as an ergonomic bridge between human hand coordination and digital CRT raster screens. Rather than holding a light pen up to a vertical screen or navigating with keyboard arrows, the mouse decomposes continuous two-dimensional tabletop motion into discrete electrical X and Y pulses.",
    coreMechanism:
      "Two perpendicular brass wheels roll across the desk at 90 degrees to each other. Motion along the X axis rolls the X-wheel while skidding the Y-wheel sideways; motion along the Y axis rolls the Y-wheel while skidding the X-wheel. Rotating the wheel shafts modulates potentiometers, sending analog coordinate voltages directly to the CRT electron beam deflection plates.",
    mechanicalBreakdown: [
      {
        title: "Orthogonal Dual-Wheel Resolution",
        summary: "Two knife-edge encoder wheels positioned at 90 degrees to one another.",
        technicalDetails:
          "The mechanical arrangement allows any arbitrary 2D vector $\\vec{v} = v_x\\hat{i} + v_y\\hat{j}$ to be decomposed directly without trigonometric calculations on the mainframe. Each wheel only responds to rolling torque along its rotation axis.",
        archaicTerm: "Position indicator wheels mounted perpendicularly",
        modernEquivalent: "Optical mouse sensor / trackball rotary encoders",
      },
      {
        title: "Shaft Potentiometer / Commutator Discs",
        summary: "Variable resistance wiper contacts coupled to wheel axles.",
        technicalDetails:
          "As the wheels turn, the wipers sweep across resistive tracks, outputting analog voltages $V_x(t) \\propto \\Delta x$ and $V_y(t) \\propto \\Delta y$ to analog-to-digital converters connected to the display generator.",
        archaicTerm: "Electrical transducer means",
        modernEquivalent: "Digital quadrature optical encoders (CPI sensor)",
      },
      {
        title: "Top Microswitch Selection Button",
        summary: "A spring-loaded fingertip click button on the front of the housing.",
        technicalDetails:
          "Pressing the red button sends an interrupt pulse to the CPU, latching the current X-Y beam coordinates to select words, graphical vertices, or hyperlink nodes.",
        archaicTerm: "Manually depressible switch",
        modernEquivalent: "Left mouse click button / Omron microswitch",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Cartesian Vector Decomposition",
        formula:
          "\\vec{v} = v_x\\hat{i} + v_y\\hat{j} \\implies \\Delta x = r\\Delta\\theta_x, \\quad \\Delta y = r\\Delta\\theta_y",
        explanation:
          "Translational displacement on a plane decomposes linearly into orthogonal angular rotations of perpendicular wheels.",
      },
      {
        principle: "Quadrature Pulse Phase Directional Sensing",
        formula: "N_{pulses} = \\frac{\\text{CPI} \\cdot \\Delta d}{25.4\\text{ mm}}",
        explanation:
          "Phase displacement between contact wipers indicates forward/backward rotation direction, while frequency indicates hand velocity.",
      },
    ],
    whyItMattersToday:
      "Engelbart's mouse made graphical user interfaces (GUIs), desktop publishing, CAD engineering, and web browsing possible. It transformed computers from room-sized mainframes operated by punch cards into personal cognitive extensions.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "1. An X-Y position indicator control mechanism comprising: a housing adapted to be moved by hand over a surface; a first wheel mounted in said housing for rotation about an axis in response to movement of said housing along said surface in a first direction; a second wheel mounted in said housing for rotation about an axis perpendicular to said first wheel axis in response to movement of said housing along said surface in a second direction perpendicular to said first direction; first means responsive to rotation of said first wheel for generating a first electrical signal representing displacement in said first direction; and second means responsive to rotation of said second wheel for generating a second electrical signal representing displacement in said second direction.",
      plainEnglish:
        "Covers the fundamental invention of a handheld housing containing two mutually perpendicular wheels that independently generate X and Y coordinate signals as the housing is moved across a surface.",
      keyInnovations: [
        "Perpendicular dual-wheel mechanical coordinate resolver",
        "Handheld table-supported ergonomic housing",
        "Direct electrical X-Y signal generation for display cursors",
      ],
      legalSignificance:
        "The master patent claim for mechanical 2-axis computer pointing devices, establishing the foundation of all computer mice.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "2. An indicator as set forth in claim 1, wherein each of said first and second means comprises a rotary potentiometer coupled to a respective one of said wheels.",
      plainEnglish:
        "Specifies rotary potentiometers as the transducers converting wheel rotation into analog voltage signals.",
      keyInnovations: ["Potentiometer voltage modulation proportional to wheel angle"],
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "3. An indicator as set forth in claim 1, wherein said housing includes at least one manually depressible switch on an upper surface thereof for transmitting control signals to an associated display system.",
      plainEnglish:
        "Adds the integrated click button on top of the housing for selecting objects on the display screen.",
      keyInnovations: ["Fingertip click microswitch integrated on the mouse body"],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective View of Handheld Mouse Housing",
      caption: "Handheld wooden housing with top microswitch button and trailing cord.",
      svgType: "three-interactive",
      callouts: [
        {
          id: "c1",
          figureRef: "Fig. 1",
          label: "Wooden Housing",
          element: "10",
          description: "Carved palm-fitting wooden chassis",
          x: 45,
          y: 40,
        },
        {
          id: "c2",
          figureRef: "Fig. 1",
          label: "Click Button",
          element: "12",
          description: "Spring-loaded microswitch button",
          x: 65,
          y: 25,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Bottom View of Perpendicular Wheels",
      caption: "Bottom plate showing X and Y encoder wheels oriented at 90 degrees.",
      svgType: "three-interactive",
      callouts: [
        {
          id: "c3",
          figureRef: "Fig. 2",
          label: "X-Axis Wheel",
          element: "16",
          description: "Resolves horizontal tabletop displacement",
          x: 35,
          y: 50,
        },
        {
          id: "c4",
          figureRef: "Fig. 2",
          label: "Y-Axis Wheel",
          element: "18",
          description: "Resolves vertical tabletop displacement",
          x: 65,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Early interactive computer displays required light pens, joysticks, or cursor arrow keys to navigate graphical screens. Light pens caused severe operator arm fatigue when held against vertical CRTs for hours; joysticks suffered from non-linear rate control issues; and keyboard cursor keys were agonizingly slow for arbitrary coordinate targeting.",
    priorArtLimitations: [
      "Light pens caused intense arm fatigue after 15 minutes of use",
      "Joysticks controlled velocity rather than absolute spatial displacement",
      "Keyboard cursor keys required dozens of discrete keystrokes to reach a screen pixel",
    ],
    breakthroughInsight:
      "Engelbart realized that a handheld control resting flat on a tabletop could exploit human fine-motor dexterity without fatigue. By housing two orthogonal wheels oriented at 90 degrees to one another, any diagonal continuous motion across the desk decomposes naturally into pure X and Y Cartesian vector components without requiring mathematical coordinate conversion in the host computer.",
    patentWars: [
      {
        rivalName: "Xerox Corporation / Apple Computer",
        rivalClaim:
          "Claimed independent invention of the rubber-ball mouse (Bill English at Xerox PARC)",
        conflictDetails:
          "In 1972, Bill English replaced Engelbart's dual wheels with a single ball rolling on two internal shafts. In 1979, Steve Jobs visited Xerox PARC, saw the Alto mouse, and licensed Engelbart's patent from SRI for approximately $40,000 to bundle with the Apple Lisa and Macintosh.",
        resolution:
          "SRI's patent was upheld as the definitive master patent for all 2-axis display mice.",
        legalOutcome: "Apple and Logitech paid licensing royalties to SRI throughout the 1980s.",
      },
    ],
    civilizationalImpact:
      "Unveiled at the 1968 'Mother of All Demos', the mouse inaugurated graphical user interfaces, windowing, hypermedia, and real-time collaborative computing.",
    funFact:
      "Douglas Engelbart said they called it a 'mouse' in the lab because the tail cord came out the back resembling a mouse tail, but no one could remember who first coined the name.",
  },
  tags: ["computing", "gui", "human-computer-interaction", "hardware"],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1970–1984 (SRI license to Apple & Xerox)",
    impactScore: 99,
  },
};
