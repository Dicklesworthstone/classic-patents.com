import { COLOR_STYLES } from "@/components/ui/colorPalette";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import type {
  ColorizedEquation,
  ColorVariant,
  EquationVariable,
  SentenceFragment,
} from "@/types/equation";
import type { ScientificPrinciple } from "@/types/patent";

export const ALL_COLORIZED_EQUATIONS: Record<string, ColorizedEquation[]> = {
  // 1. Wright Flyer (US 821,393)
  "us-821393-wright-flyer": [
    {
      id: "wright-lift-circulation",
      patentId: "us-821393-wright-flyer",
      title: "Aerodynamic Lift & Differential Circulation",
      category: "Aerodynamics & 6-DoF Flight",
      rawLatex: "L = \\frac{1}{2} \\rho V^2 S C_L(\\alpha)",
      colorizedLatex:
        "\\textcolor{#059669}{L} = \\frac{1}{2} \\textcolor{#0d9488}{\\rho} \\textcolor{#2563eb}{V^2} \\textcolor{#d97706}{S} \\textcolor{#9333ea}{C_L(\\alpha)}",
      plainEnglishSentence: [
        { text: "Gross aerodynamic upward lift " },
        { text: "force", variableId: "lift_force" },
        { text: " scales directly with ambient " },
        { text: "atmospheric air density", variableId: "air_density" },
        { text: ", flight " },
        { text: "velocity squared", variableId: "flight_vel" },
        { text: ", total " },
        { text: "wing surface area", variableId: "wing_area" },
        { text: ", and the " },
        { text: "angle-of-attack dependent lift coefficient", variableId: "cl_alpha" },
        { text: "." },
      ],
      variables: [
        {
          id: "lift_force",
          symbol: "L",
          name: "Total Aerodynamic Lift Force",
          color: "emerald",
          role: "Net vertical aerodynamic force supporting the gross weight of the biplane in equilibrium",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Lift is produced by the downward deflection of airflow across the upper and lower surfaces of the cambered fabric wings. Warping increases lift on one wing while decreasing it on the opposite wing to bank the aircraft.",
          telemetryKey: "airspeed",
          telemetryMetricLabel: "Gross Lift",
        },
        {
          id: "air_density",
          symbol: "\\rho",
          name: "Atmospheric Air Density",
          color: "teal",
          role: "Mass of air per unit volume at the flight altitude ($1.225\\text{ kg/m}^3$ at standard sea level)",
          unit: "kg/m^3",
          dimension: "[M L^-3]",
          explanation:
            "The Wrights chose Kitty Hawk, North Carolina for its dense sea-level coastal air and reliable headwinds, maximizing lift per unit wing area.",
        },
        {
          id: "flight_vel",
          symbol: "V^2",
          name: "True Airspeed (Squared)",
          color: "sapphire",
          role: "Relative airspeed of oncoming air squared ($V \\approx 13.4\\text{ m/s} \\approx 30\\text{ mph}$)",
          unit: "(m/s)^2",
          dimension: "[L^2 T^-2]",
          explanation:
            "Because dynamic pressure scales quadratically with airspeed ($q = \\frac{1}{2}\\rho V^2$), doubling forward speed quadruples available lift force.",
          telemetryKey: "airspeed",
        },
        {
          id: "wing_area",
          symbol: "S",
          name: "Gross Wing Planform Area",
          color: "amber",
          role: "Combined planform area of both upper and lower biplane wings ($S = 510\\text{ sq ft} \\approx 47.38\\text{ m}^2$)",
          unit: "Square meters (m^2)",
          dimension: "[L^2]",
          explanation:
            "The biplane configuration doubled effective lifting surface area within a compact, structurally stiff 40-foot wingspan.",
        },
        {
          id: "cl_alpha",
          symbol: "C_L(\\alpha)",
          name: "Section Lift Coefficient",
          color: "amethyst",
          role: "Non-dimensional lift coefficient governed by local camber and angle of attack $\\alpha$",
          unit: "Dimensionless slope",
          dimension: "[1]",
          explanation:
            "Warping twists the flexible wooden wing tips to change $\\alpha$ differentially (+3° on one side, -3° on the other), creating roll control torque.",
          telemetryKey: "wingWarp",
        },
      ],
      pedagogicalNote:
        "The Wright brothers discovered in their 1901 wind tunnel experiments that prior published lift coefficients (the Smeaton coefficient) were over-estimated by 30%, which had caused Lilienthal and Chanute gliders to fall short of calculated performance.",
      claimRef: 1,
      historicalSignificance:
        "Claim 1 protects the mechanism that varies the angle of incidence between opposite lateral margins to generate differential lift.",
    },
    {
      id: "wright-induced-drag",
      patentId: "us-821393-wright-flyer",
      title: "Prandtl Induced Drag & Wing Warping Differential",
      category: "Aerodynamics & 6-DoF Flight",
      rawLatex: "C_{D_i} = \\frac{C_L^2}{\\pi \\cdot \\text{AR} \\cdot e}",
      colorizedLatex:
        "\\textcolor{#dc2626}{C_{D_i}} = \\frac{\\textcolor{#059669}{C_L^2}}{\\textcolor{#d97706}{\\pi} \\cdot \\textcolor{#2563eb}{\\text{AR}} \\cdot \\textcolor{#9333ea}{e}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "induced aerodynamic drag penalty", variableId: "c_di" },
        { text: " grows with the square of the " },
        { text: "lift coefficient", variableId: "cl" },
        { text: ", constrained by the " },
        { text: "geometric aspect ratio", variableId: "ar" },
        { text: " and the " },
        { text: "spanwise efficiency factor", variableId: "e" },
        { text: "." },
      ],
      variables: [
        {
          id: "c_di",
          symbol: "C_{D_i}",
          name: "Induced Drag Coefficient",
          color: "crimson",
          role: "Aerodynamic resistance created as a direct physical byproduct of generating lift at the wingtips",
          unit: "Dimensionless ratio",
          dimension: "[1]",
          explanation:
            "When the Wright brothers twisted their wing margins to increase lift on one side, that wing inevitably suffered higher induced drag, creating adverse yaw that pulled the nose in the opposite direction of the roll. Countering this required coupling the movable vertical rear rudder.",
          telemetryKey: "wingWarp",
          telemetryMetricLabel: "Induced Drag",
        },
        {
          id: "cl",
          symbol: "C_L^2",
          name: "Lift Coefficient (Squared)",
          color: "emerald",
          role: "Non-dimensional measure of gross upward aerodynamic lift force generated per unit wing area",
          unit: "Dimensionless ratio",
          dimension: "[1]",
          explanation:
            "Lift is generated by pressure differences between the upper and lower wing cambers. Induced drag scales quadratically ($C_L^2$), meaning high-lift maneuvers or steep angles of attack generate massive drag vortices.",
          telemetryKey: "airspeed",
          telemetryMetricLabel: "Gross Lift Force",
        },
        {
          id: "ar",
          symbol: "\\text{AR}",
          name: "Wing Aspect Ratio",
          color: "sapphire",
          role: "Ratio of total wingspan squared to gross wing area ($b^2 / S = 40.33^2 / 510 \\approx 6.4$)",
          unit: "Dimensionless ratio (6.4)",
          dimension: "[1]",
          explanation:
            "A higher aspect ratio yields longer, narrower wings which reduce wingtip vortex leakage. The Wright 1903 Flyer utilized a biplane aspect ratio of approximately 6.4.",
        },
        {
          id: "e",
          symbol: "e",
          name: "Oswald Span Efficiency",
          color: "amethyst",
          role: "Aerodynamic efficiency factor describing how close lift distribution is to an ideal ellipse ($e \\approx 0.85$)",
          unit: "Efficiency fraction",
          dimension: "[1]",
          explanation:
            "The biplane wing gap and strut-wire interference slightly distorted the ideal elliptic lift distribution, yielding an Oswald efficiency of approximately 0.85.",
        },
      ],
      pedagogicalNote:
        "The fundamental breakthrough in the Wright Flyer was discovering that roll control cannot exist independently of yaw control. Twisting one wing upward increases $C_L$, which by this exact equation multiplies $C_{D_i}$, pulling the machine into a spin unless the vertical rudder is deflected simultaneously.",
      claimRef: 1,
      historicalSignificance:
        "Claim 1 of US 821,393 protected this exact coupled relationship, forming the cornerstone of modern three-axis flight control.",
    },
    {
      id: "wright-coordinated-turn",
      patentId: "us-821393-wright-flyer",
      title: "3-Axis Coordinated Turn Flight Dynamics",
      category: "Aerodynamics & 6-DoF Flight",
      rawLatex:
        "R_{\\text{turn}} = \\frac{V^2}{g \\cdot \\tan(\\phi)}, \\quad \\dot{\\psi} = \\frac{g \\tan(\\phi)}{V}",
      colorizedLatex:
        "\\textcolor{#2563eb}{R_{\\text{turn}}} = \\frac{\\textcolor{#059669}{V^2}}{\\textcolor{#d97706}{g} \\cdot \\textcolor{#9333ea}{\\tan(\\phi)}}, \\quad \\textcolor{#ea580c}{\\dot{\\psi}} = \\frac{\\textcolor{#d97706}{g} \\textcolor{#9333ea}{\\tan(\\phi)}}{\\textcolor{#059669}{V}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "horizontal radius of a coordinated turn", variableId: "r_turn" },
        { text: " decreases with the " },
        { text: "tangent of bank angle", variableId: "tan_phi" },
        { text: ", while the steady " },
        { text: "heading yaw rate", variableId: "psi_dot" },
        { text: " balances " },
        { text: "gravitational acceleration", variableId: "grav" },
        { text: " against " },
        { text: "forward airspeed", variableId: "turn_vel" },
        { text: "." },
      ],
      variables: [
        {
          id: "r_turn",
          symbol: "R_{\\text{turn}}",
          name: "Turn Curvature Radius",
          color: "sapphire",
          role: "Instantaneous horizontal turning radius of the flight trajectory",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation:
            "Banking tilts the lift vector inward, providing the centripetal force needed to turn the aircraft along an arc without slipping sideways.",
        },
        {
          id: "turn_vel",
          symbol: "V^2",
          name: "Forward Velocity (Squared)",
          color: "emerald",
          role: "Flight speed governing centripetal turning inertia",
          unit: "(m/s)^2",
          dimension: "[L^2 T^-2]",
          explanation:
            "Faster flight speeds widen the turning radius quadratically for any fixed bank angle.",
          telemetryKey: "airspeed",
        },
        {
          id: "grav",
          symbol: "g",
          name: "Gravitational Field Strength",
          color: "amber",
          role: "Standard acceleration due to Earth's gravity ($9.80665\\text{ m/s}^2$)",
          unit: "m/s^2",
          dimension: "[L T^-2]",
          explanation:
            "Gravity pulls downward while the vertical component of tilted lift ($L \\cos \\phi$) balances gross weight to maintain level altitude in the turn.",
        },
        {
          id: "tan_phi",
          symbol: "\\tan(\\phi)",
          name: "Bank Angle Tangent",
          color: "amethyst",
          role: "Tangent of the lateral roll bank angle $\\phi$",
          unit: "Dimensionless ratio",
          dimension: "[1]",
          explanation:
            "Steeper bank angles increase centripetal force ($L \\sin \\phi$), tightening the turn radius and increasing the turn rate.",
          telemetryKey: "wingWarp",
        },
        {
          id: "psi_dot",
          symbol: "\\dot{\\psi}",
          name: "Turn Rate (Heading Velocity)",
          color: "coral",
          role: "Angular velocity of heading change around the vertical yaw axis",
          unit: "Radians per second (rad/s)",
          dimension: "[T^-1]",
          explanation:
            "In a coordinated turn, the rudder deflects just enough to keep the aircraft aligned with the curved flight path, eliminating sideslip.",
          telemetryKey: "rudderDeflection",
        },
      ],
      pedagogicalNote:
        "Earlier aviators attempted flat turns using only a vertical rudder like a marine boat, which caused dangerous outward skidding and wing stalls. The Wrights proved that banking with differential lift is essential for turning an aircraft in three dimensions.",
      claimRef: 1,
      historicalSignificance:
        "Established the universal doctrine of 3-axis flight control that remains standard on all modern fixed-wing aircraft today.",
    },
    {
      id: "wright-lifting-line",
      patentId: "us-821393-wright-flyer",
      title: "Prandtl Lifting-Line Spanwise Circulation Distribution",
      category: "Aerodynamics & 6-DoF Flight",
      rawLatex:
        "\\Gamma(y) = \\Gamma_0 \\sqrt{1 - \\left(\\frac{2y}{b}\\right)^2} + \\Delta \\Gamma_{\\text{warp}} \\sin\\left(\\frac{\\pi y}{b}\\right)",
      colorizedLatex:
        "\\textcolor{#9333ea}{\\Gamma(y)} = \\textcolor{#2563eb}{\\Gamma_0} \\sqrt{1 - \\left(\\frac{2\\textcolor{#d97706}{y}}{\\textcolor{#0891b2}{b}}\\right)^2} + \\textcolor{#dc2626}{\\Delta \\Gamma_{\\text{warp}}} \\sin\\left(\\frac{\\pi \\textcolor{#d97706}{y}}{\\textcolor{#0891b2}{b}}\\right)",
      plainEnglishSentence: [
        { text: "The " },
        { text: "spanwise circulation distribution", variableId: "gamma_y" },
        { text: " superimposes the " },
        { text: "midspan peak circulation", variableId: "gamma_0" },
        { text: " across " },
        { text: "wingspan", variableId: "span_b" },
        { text: " with an antisymmetric " },
        { text: "warping circulation perturbation", variableId: "delta_gamma" },
        { text: " at lateral station " },
        { text: "spanwise coordinate", variableId: "span_y" },
        { text: "." },
      ],
      variables: [
        {
          id: "gamma_y",
          symbol: "\\Gamma(y)",
          name: "Spanwise Bound Circulation",
          color: "amethyst",
          role: "Local vortex circulation along the wing span producing sectional lift via the Kutta-Joukowski theorem ($L' = \\rho V \\Gamma$)",
          unit: "m^2/s",
          dimension: "[L^2 T^-1]",
          explanation:
            "Circulation represents the fluid rotation around the airfoil section. Warping twists the wings to shift circulation asymmetrically across the span.",
        },
        {
          id: "gamma_0",
          symbol: "\\Gamma_0",
          name: "Root Circulation Amplitude",
          color: "sapphire",
          role: "Maximum bound vortex circulation at the center wing root",
          unit: "m^2/s",
          dimension: "[L^2 T^-1]",
          explanation:
            "In unwarped level flight, the circulation profile approaches an ellipse, which produces minimum induced drag.",
        },
        {
          id: "span_y",
          symbol: "y",
          name: "Spanwise Station Coordinate",
          color: "amber",
          role: "Lateral position along the wingspan from centerline ($ -b/2 \\le y \\le b/2 $)",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation:
            "Coordinate measuring distance from the fuselage center to the outer flexible wingtips.",
        },
        {
          id: "span_b",
          symbol: "b",
          name: "Total Wingspan",
          color: "cyan",
          role: "Tip-to-tip span length of the biplane wing structure ($b = 40.33\\text{ ft} \\approx 12.29\\text{ m}$)",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation:
            "A wider span distributes vortex shedding over a broader air mass, reducing downwash velocity.",
        },
        {
          id: "delta_gamma",
          symbol: "\\Delta \\Gamma_{\\text{warp}}",
          name: "Helical Warping Circulation Delta",
          color: "crimson",
          role: "Antisymmetric circulation increment induced by twisting outer wing margins",
          unit: "m^2/s",
          dimension: "[L^2 T^-1]",
          explanation:
            "Twisting increases angle of attack on one wingtip (+$\\Delta \\Gamma$) and reduces it on the other (-$\\Delta \\Gamma$), creating the rolling torque that tilts the aircraft.",
          telemetryKey: "wingWarp",
        },
      ],
      pedagogicalNote:
        "Ludwig Prandtl later formulated modern lifting-line theory (1918) explaining mathematically what the Wrights had discovered empirically: that twisting a wing produces an antisymmetric circulation perturbation whose downwash distribution governs both roll and yaw.",
      claimRef: 1,
      historicalSignificance:
        "The mathematical foundation for all subsequent 20th-century aeroelastic wing warping and aileron roll control.",
    },
    {
      id: "wright-canard-pitch",
      patentId: "us-821393-wright-flyer",
      title: "Canard Longitudinal Static Stability & Pitch Equilibrium",
      category: "Aerodynamics & 6-DoF Flight",
      rawLatex:
        "C_{m} = C_{m0} + \\left(\\frac{x_{\\text{cg}} - x_{\\text{ac}}}{c}\\right) C_L - V_{\\text{canard}} C_{L,\\text{canard}}(\\delta_e)",
      colorizedLatex:
        "\\textcolor{#9333ea}{C_{m}} = \\textcolor{#d97706}{C_{m0}} + \\left(\\frac{\\textcolor{#dc2626}{x_{\\text{cg}} - x_{\\text{ac}}}}{\\textcolor{#0d9488}{c}}\\right) \\textcolor{#059669}{C_L} - \\textcolor{#2563eb}{V_{\\text{canard}}} \\textcolor{#ea580c}{C_{L,\\text{canard}}(\\delta_e)}",
      plainEnglishSentence: [
        { text: "Net " },
        { text: "pitching moment coefficient", variableId: "c_m" },
        { text: " balances the " },
        { text: "zero-lift wing camber moment", variableId: "c_m0" },
        { text: ", the " },
        { text: "center-of-gravity static margin", variableId: "static_margin" },
        { text: " across " },
        { text: "mean aerodynamic chord", variableId: "mean_chord" },
        { text: ", total " },
        { text: "wing lift", variableId: "gross_cl" },
        { text: ", and " },
        { text: "forward canard elevator control lift", variableId: "canard_cl" },
        { text: " scaled by " },
        { text: "canard volume ratio", variableId: "v_canard" },
        { text: "." },
      ],
      variables: [
        {
          id: "c_m",
          symbol: "C_{m}",
          name: "Total Pitching Moment Coefficient",
          color: "amethyst",
          role: "Net non-dimensional rotational torque around the lateral pitch axis ($Y$-axis)",
          unit: "Dimensionless ratio",
          dimension: "[1]",
          explanation:
            "In trimmed level flight, $C_m = 0$, meaning the aircraft maintains a constant angle of attack without pilot intervention.",
        },
        {
          id: "c_m0",
          symbol: "C_{m0}",
          name: "Zero-Lift Pitch Moment",
          color: "amber",
          role: "Inherent pitching moment of the cambered wing airfoils at zero lift",
          unit: "Dimensionless ratio",
          dimension: "[1]",
          explanation:
            "Cambered airfoils naturally produce a nose-down pitching moment that must be counteracted by a stabilizing horizontal surface.",
        },
        {
          id: "static_margin",
          symbol: "x_{\\text{cg}} - x_{\\text{ac}}",
          name: "Static Margin (CG-AC Offset)",
          color: "crimson",
          role: "Distance from center of gravity to wing aerodynamic center ($x_{\\text{cg}} - x_{\\text{ac}}$)",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation:
            "Locating the center of gravity slightly forward of the aerodynamic center provides positive pitch stability, causing the nose to drop if airspeed drops.",
        },
        {
          id: "mean_chord",
          symbol: "c",
          name: "Mean Aerodynamic Chord",
          color: "teal",
          role: "Average chord length of the biplane wings ($c \\approx 6.5\\text{ ft} = 1.98\\text{ m}$)",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation:
            "Reference length used to non-dimensionalize pitching moments and static margins.",
        },
        {
          id: "gross_cl",
          symbol: "C_L",
          name: "Main Wing Lift Coefficient",
          color: "emerald",
          role: "Gross non-dimensional upward lift coefficient produced by the main biplane wings",
          unit: "Dimensionless ratio",
          dimension: "[1]",
          explanation:
            "Higher wing lift creates a restorative pitch-up moment through the static margin arm.",
          telemetryKey: "airspeed",
        },
        {
          id: "v_canard",
          symbol: "V_{\\text{canard}}",
          name: "Canard Volume Ratio",
          color: "sapphire",
          role: "Volumetric leverage ratio of forward canard surface area and moment arm ($S_c l_c / S c$)",
          unit: "Dimensionless fraction",
          dimension: "[1]",
          explanation:
            "Measures the pitch control leverage of placing the horizontal elevator ahead of the wings on forward outriggers.",
        },
        {
          id: "canard_cl",
          symbol: "C_{L,\\text{canard}}(\\delta_e)",
          name: "Canard Elevator Lift Coefficient",
          color: "coral",
          role: "Lift coefficient generated by deflecting the forward canard elevator surface by angle $\\delta_e$",
          unit: "Dimensionless ratio",
          dimension: "[1]",
          explanation:
            "Moving the left hand lever rotated the forward canard, directly changing pitch trim and climb/glide angle.",
          telemetryKey: "canardDeflection",
        },
      ],
      pedagogicalNote:
        "The Wrights placed the horizontal elevator in front (a canard) rather than behind the wings. When pulling up to climb, a canard creates positive upward lift rather than the downward force produced by a conventional aft tail, maximizing total aircraft lifting efficiency.",
      claimRef: 2,
      historicalSignificance:
        "Claim 2 of US 821,393 explicitly claimed the adjustable forward horizontal rudder for controlling the vertical angle of flight.",
    },
  ],

  // 2. Tesla Induction Motor (US 381,968)
  "us-381968-tesla-motor": [
    {
      id: "tesla-stator-bfield",
      patentId: "us-381968-tesla-motor",
      title: "Rotating Stator Magnetic Flux Vector",
      category: "Electromagnetics & Induction",
      rawLatex:
        "\\vec{B}(t) = B_0 \\left( \\cos(\\omega t)\\,\\hat{i} + \\sin(\\omega t)\\,\\hat{j} \\right)",
      colorizedLatex:
        "\\textcolor{#9333ea}{\\vec{B}(t)} = \\textcolor{#0891b2}{B_0} \\left( \\textcolor{#059669}{\\cos(\\omega t)}\\,\\hat{i} + \\textcolor{#d97706}{\\sin(\\omega t)}\\,\\hat{j} \\right)",
      plainEnglishSentence: [
        { text: "The " },
        {
          text: "resultant rotating magnetic field vector",
          variableId: "b_vec",
        },
        { text: " maintains constant " },
        { text: "peak flux amplitude", variableId: "b_0" },
        { text: " through the sum of " },
        { text: "in-phase horizontal coil flux", variableId: "b_x" },
        { text: " and " },
        { text: "quadrature vertical coil flux", variableId: "b_y" },
        { text: "." },
      ],
      variables: [
        {
          id: "b_vec",
          symbol: "\\vec{B}(t)",
          name: "Resultant Rotating Magnetic Field",
          color: "amethyst",
          role: "Total electromagnetic stator vector that sweeps continuously in space without mechanical brushes",
          unit: "Tesla (T)",
          dimension: "[M T^-2 I^-1]",
          explanation:
            "By superimposing two out-of-phase AC magnetic fields, Tesla created a constant-magnitude vector that rotates in space at the electrical line frequency, dragging the rotor along via Faraday induction.",
          telemetryMetricLabel: "Stator Field (B)",
        },
        {
          id: "b_0",
          symbol: "B_0",
          name: "Peak Magnetic Field Strength",
          color: "cyan",
          role: "Maximum magnetic flux density produced by stator electromagnet pole windings",
          unit: "Tesla (T)",
          dimension: "[M T^-2 I^-1]",
          explanation:
            "Determined by the number of coil turns, core magnetic permeability, and excitation current ($B_0 = \\mu N I / g$).",
        },
        {
          id: "b_x",
          symbol: "\\cos(\\omega t)",
          name: "Phase-A Horizontal Flux",
          color: "emerald",
          role: "Sinusoidal magnetic flux generated across the primary stator pole pair",
          unit: "Normalized sinusoid [-1, 1]",
          dimension: "[1]",
          explanation:
            "Phase A is energized by AC current $I_A(t) = I_0 \\cos(\\omega t)$, generating a pulsating horizontal field along the x-axis.",
          telemetryKey: "freqHz",
        },
        {
          id: "b_y",
          symbol: "\\sin(\\omega t)",
          name: "Phase-B Quadrature Flux",
          color: "amber",
          role: "90-degree phase-shifted magnetic flux along the orthogonal vertical pole pair",
          unit: "Normalized sinusoid [-1, 1]",
          dimension: "[1]",
          explanation:
            "Phase B is energized 90 degrees out of phase ($I_B(t) = I_0 \\sin(\\omega t)$). The trigonometric identity $\\cos^2(\\omega t) + \\sin^2(\\omega t) = 1$ ensures constant field magnitude and smooth, vibration-free rotation.",
        },
      ],
      pedagogicalNote:
        "Before Tesla, electric motors required mechanical commutators with sparking carbon brushes that wore out rapidly and could not run on AC power. Tesla proved that multi-phase AC currents synthesize a continuous rotating spatial vector with zero physical contact.",
      claimRef: 1,
      historicalSignificance:
        "The polyphase AC motor made long-distance alternating current transmission commercially viable and powers over 90% of all industrial motors worldwide today.",
    },
  ],

  // 3. Edison Light Bulb (US 223,898)
  "us-223898-edison-lightbulb": [
    {
      id: "edison-blackbody-radiation",
      patentId: "us-223898-edison-lightbulb",
      title: "Stefan-Boltzmann Thermal Radiation & High Resistance Law",
      category: "Thermodynamics & Vacuum Physics",
      rawLatex:
        "P_{\\text{rad}} = \\varepsilon \\cdot \\sigma \\cdot A \\cdot T^4 \\quad \\text{and} \\quad P = \\frac{V^2}{R}",
      colorizedLatex:
        "\\textcolor{#ea580c}{P_{\\text{rad}}} = \\textcolor{#0891b2}{\\varepsilon} \\cdot \\textcolor{#d97706}{\\sigma} \\cdot \\textcolor{#9333ea}{A} \\cdot \\textcolor{#dc2626}{T^4} \\quad \\text{and} \\quad P = \\frac{\\textcolor{#2563eb}{V^2}}{\\textcolor{#059669}{R}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "radiant optical power", variableId: "p_rad" },
        { text: " emitted by the filament scales with " },
        { text: "material emissivity", variableId: "epsilon" },
        { text: ", " },
        { text: "filament surface area", variableId: "area" },
        { text: ", and the " },
        { text: "fourth power of absolute temperature", variableId: "t4" },
        { text: "; parallel distribution requires " },
        { text: "high filament resistance", variableId: "res" },
        { text: " to avoid melting " },
        { text: "mains voltage feeder wires", variableId: "voltage" },
        { text: "." },
      ],
      variables: [
        {
          id: "p_rad",
          symbol: "P_{\\text{rad}}",
          name: "Radiant Thermal Power",
          color: "coral",
          role: "Total electromagnetic radiation emitted per second across the blackbody spectrum",
          unit: "Watts (W)",
          dimension: "[M L^2 T^-3]",
          explanation:
            "At 2,200 Kelvin, a carbon filament glows with warm incandescent luminescence, converting electrical input power into visible photons and infrared heat.",
          telemetryMetricLabel: "Radiant Power",
        },
        {
          id: "epsilon",
          symbol: "\\varepsilon",
          name: "Filament Emissivity",
          color: "cyan",
          role: "Surface radiative efficiency compared to a theoretical ideal blackbody (0.82 for carbonized cotton/bamboo)",
          unit: "Dimensionless fraction",
          dimension: "[1]",
          explanation:
            "Carbonized organic fibers possess high emissivity (approx 0.82), producing rich blackbody emission without early reflective dissipation.",
        },
        {
          id: "area",
          symbol: "A",
          name: "Filament Surface Area",
          color: "amethyst",
          role: "Exposed cylindrical surface area of the slender carbon thread",
          unit: "Square meters (m^2)",
          dimension: "[L^2]",
          explanation:
            "By making the filament microscopic in cross-section (a hair-like thread) with minimal surface area, heat loss is minimized and resistance maximized.",
        },
        {
          id: "t4",
          symbol: "T^4",
          name: "Absolute Temperature (4th Power)",
          color: "crimson",
          role: "Filament thermodynamic core temperature in Kelvin raised to the fourth power",
          unit: "Kelvin^4 (K^4)",
          dimension: "[\\Theta^4]",
          explanation:
            "Doubling filament temperature multiplies radiated light by 16 ($2^4$). To prevent rapid carbon sublimation at 2,200 K, Edison evacuated the globe to one-millionth of an atmosphere (high vacuum).",
          telemetryMetricLabel: "Color Temp",
        },
        {
          id: "voltage",
          symbol: "V^2",
          name: "Supply Line Voltage",
          color: "sapphire",
          role: "Central electrical station parallel distribution potential (110 Volts DC)",
          unit: "Volts (V)",
          dimension: "[M L^2 T^-3 I^-1]",
          explanation:
            "Edison selected 110 Volts as the optimal standard balancing insulation safety against copper wire mass.",
          telemetryKey: "voltage",
        },
        {
          id: "res",
          symbol: "R",
          name: "High Filament Resistance",
          color: "emerald",
          role: "Electrical resistance of carbonized thread filament (100 Ohms vs 1 Ohm for arc lamps)",
          unit: "Ohms (\\Omega)",
          dimension: "[M L^2 T^-3 I^-2]",
          explanation:
            "Edison's core insight was that low-resistance arc lights required enormous copper conductors ($I = V/R$). High resistance ($100\\ \\Omega$) slashed current, allowing hundreds of lamps to run in parallel on thin copper lines.",
          telemetryMetricLabel: "Hot Resistance",
        },
      ],
      pedagogicalNote:
        "Every other inventor attempted to make low-resistance electric lamps ($1\\ \\Omega$), which caused copper transmission lines to melt. Edison understood the $P = I^2 R = V^2 / R$ tradeoff and engineered high-resistance filaments in a sealed vacuum globe.",
      claimRef: 1,
      historicalSignificance:
        "US 223,898 laid the mathematical and commercial foundation for the global electric utility grid.",
    },
  ],

  // 4. Alexander Graham Bell Telephone (US 174,465)
  "us-174465-bell-telephone": [
    {
      id: "bell-undulating-current",
      patentId: "us-174465-bell-telephone",
      title: "Variable-Resistance Undulating Acoustic Speech Current",
      category: "Acoustic & Telecommunications",
      rawLatex: "i(t) = \\frac{V_0}{R_0 + \\Delta R \\cdot \\sin(\\omega_{\\text{sound}} t)}",
      colorizedLatex:
        "\\textcolor{#2563eb}{i(t)} = \\frac{\\textcolor{#d97706}{V_0}}{\\textcolor{#059669}{R_0} + \\textcolor{#dc2626}{\\Delta R} \\cdot \\textcolor{#9333ea}{\\sin(\\omega_{\\text{sound}} t)}}",
      plainEnglishSentence: [
        { text: "The " },
        {
          text: "continuous undulating speech current",
          variableId: "i_t",
        },
        { text: " is generated by applying a " },
        { text: "constant battery voltage", variableId: "v_0" },
        { text: " across a " },
        { text: "baseline circuit resistance", variableId: "r_0" },
        { text: " modulated by " },
        {
          text: "acoustic diaphragm immersion depth",
          variableId: "delta_r",
        },
        { text: " vibrating at " },
        { text: "human vocal sound frequencies", variableId: "omega" },
        { text: "." },
      ],
      variables: [
        {
          id: "i_t",
          symbol: "i(t)",
          name: "Undulating Analog Signal Current",
          color: "sapphire",
          role: "Continuous electrical current waveform mirroring the pressure variations of speech in air",
          unit: "Amperes (A)",
          dimension: "[I]",
          explanation:
            "Prior telegraphs sent discrete, binary on-off pulses. Bell's breakthrough was continuous electrical undulation that mapped directly to vocal timbre and vowel formants.",
          telemetryMetricLabel: "Speech Current",
        },
        {
          id: "v_0",
          symbol: "V_0",
          name: "DC Bias Voltage",
          color: "amber",
          role: "Direct-current potential supplied by chemical battery cells",
          unit: "Volts (V)",
          dimension: "[M L^2 T^-3 I^-1]",
          explanation:
            "Provides the steady baseline current carrier that is modulated by diaphragm movement.",
        },
        {
          id: "r_0",
          symbol: "R_0",
          name: "Static Circuit Resistance",
          color: "emerald",
          role: "Sum of transmission line loop resistance and unperturbed transducer liquid resistance",
          unit: "Ohms (\\Omega)",
          dimension: "[M L^2 T^-3 I^-2]",
          explanation:
            "The baseline resistance of the wire circuit when no sound waves are impinging on the diaphragm.",
        },
        {
          id: "delta_r",
          symbol: "\\Delta R",
          name: "Acoustic Resistance Modulation",
          color: "crimson",
          role: "Dynamic change in electrical resistance caused by diaphragm vibration dipping a platinum needle into acidulated water",
          unit: "Ohms (\\Omega)",
          dimension: "[M L^2 T^-3 I^-2]",
          explanation:
            "As vocal sound waves hit the parchment diaphragm, the needle moves deeper or shallower into conducting fluid, linearly modulating electrical resistance.",
          telemetryKey: "needleDepth",
        },
        {
          id: "omega",
          symbol: "\\omega_{\\text{sound}}",
          name: "Acoustic Frequency",
          color: "amethyst",
          role: "Vocal tract formant frequency (300 Hz to 3,400 Hz)",
          unit: "Radians per second (rad/s)",
          dimension: "[T^-1]",
          explanation: "The fundamental frequencies of human speech transmitted over the line.",
          telemetryKey: "audioFreq",
        },
      ],
      pedagogicalNote:
        "Telegraphy treated electricity as a binary switch. Bell realized that speech is an analog continuum: by varying resistance continuously with acoustic air pressure, the receiving electromagnet reproduces identical vibrations in the listener's ear.",
      claimRef: 5,
      historicalSignificance:
        "Claim 5 of US 174,465 is widely considered the single most valuable patent claim in human history, establishing the global telecommunications industry.",
    },
  ],

  // 5. Philo Farnsworth Electronic Television (US 1,773,980)
  "us-1773980-farnsworth-tv": [
    {
      id: "farnsworth-lorentz-deflection",
      patentId: "us-1773980-farnsworth-tv",
      title: "Relativistic Lorentz Magnetic Beam Steering & Anode Scanning",
      category: "Optoelectronics & Video Systems",
      rawLatex:
        "\\vec{F} = q \\left( \\vec{E} + \\vec{v} \\times \\vec{B} \\right) \\quad \\text{and} \\quad v_e = \\sqrt{\\frac{2 q V_a}{m_e}}",
      colorizedLatex:
        "\\textcolor{#9333ea}{\\vec{F}} = \\textcolor{#0891b2}{q} \\left( \\textcolor{#d97706}{\\vec{E}} + \\textcolor{#2563eb}{\\vec{v}} \\times \\textcolor{#059669}{\\vec{B}} \\right) \\quad \\text{and} \\quad \\textcolor{#2563eb}{v_e} = \\sqrt{\\frac{2 \\textcolor{#0891b2}{q} \\textcolor{#dc2626}{V_a}}{\\textcolor{#ea580c}{m_e}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "Lorentz deflection force", variableId: "force" },
        { text: " steers the " },
        { text: "photoelectron beam charge", variableId: "charge" },
        { text: " under the " },
        { text: "accelerating anode electric field", variableId: "e_field" },
        { text: " and " },
        { text: "magnetic deflection coils", variableId: "b_field" },
        { text: ", accelerating electrons to " },
        { text: "sweep velocities", variableId: "vel" },
        { text: " proportional to " },
        { text: "anode potential", variableId: "va" },
        { text: " over " },
        { text: "electron rest mass", variableId: "me" },
        { text: "." },
      ],
      variables: [
        {
          id: "force",
          symbol: "\\vec{F}",
          name: "Lorentz Steering Force",
          color: "amethyst",
          role: "Dynamic electromagnetic force vector deflecting the electron image across the dissecting aperture",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Replaces heavy mechanical spinning Nipkow discs with inertia-free electromagnetic coil steering.",
        },
        {
          id: "charge",
          symbol: "q",
          name: "Elementary Electron Charge",
          color: "cyan",
          role: "Fundamental electric charge (-1.602 x 10^-19 Coulombs)",
          unit: "Coulombs (C)",
          dimension: "[I T]",
          explanation:
            "Photoelectrons emitted from the cesium-oxide photocathode when struck by incident light photons.",
        },
        {
          id: "e_field",
          symbol: "\\vec{E}",
          name: "Anode Accelerating Field",
          color: "amber",
          role: "High-voltage axial electrostatic field pulling electrons toward the target aperture",
          unit: "Volts / meter (V/m)",
          dimension: "[M L T^-3 I^-1]",
          explanation: "Prevents space-charge cloud dispersion and maintains crisp optical focus.",
        },
        {
          id: "b_field",
          symbol: "\\vec{B}",
          name: "Magnetic Deflection Sweep",
          color: "emerald",
          role: "Horizontal and vertical magnetic deflection field (sawtooth wave generator)",
          unit: "Tesla (T)",
          dimension: "[M T^-2 I^-1]",
          explanation:
            "Sweeps the electron image line-by-line across a microscopic aperture at radio frequencies.",
        },
        {
          id: "vel",
          symbol: "v_e",
          name: "Electron Drift Velocity",
          color: "sapphire",
          role: "Velocity of accelerated electrons traveling down the tube (approx 15,000 km/s)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation: "Determines electron transit time down the image dissector tube.",
        },
        {
          id: "va",
          symbol: "V_a",
          name: "Anode Acceleration Potential",
          color: "crimson",
          role: "Positive accelerating anode voltage (600 to 1,200 Volts DC)",
          unit: "Volts (V)",
          dimension: "[M L^2 T^-3 I^-1]",
          explanation: "Provides kinetic energy to the photoelectrons.",
        },
        {
          id: "me",
          symbol: "m_e",
          name: "Electron Rest Mass",
          color: "coral",
          role: "Physical electron mass (9.109 x 10^-31 kg)",
          unit: "Kilograms (kg)",
          dimension: "[M]",
          explanation:
            "Extremely low mass allows high scanline frequencies with zero mechanical lag.",
        },
      ],
      pedagogicalNote:
        "Farnsworth conceived the idea of all-electronic television as a 14-year-old farm boy while plowing a potato field in straight, parallel lines. He realized electrons could scan an optical image line-by-line using magnetic deflection coils.",
      claimRef: 1,
      historicalSignificance:
        "US 1773980 proved all-electronic television broadcasting, defeating RCA in landmark patent priority litigation.",
    },
  ],

  // 6. Albert Einstein & Leo Szilard Refrigerator (US 1,781,541)
  "us-1781541-einstein-refrigerator": [
    {
      id: "einstein-dalton-cooling",
      patentId: "us-1781541-einstein-refrigerator",
      title: "Dalton Ternary Partial Pressure Refrigeration & Thermosiphon Circulation",
      category: "Thermodynamics & Fluid Transport",
      rawLatex:
        "P_{\\text{total}} = P_{\\text{NH}_3} + P_{\\text{butane}} + P_{\\text{H}_2\\text{O}} \\quad \\text{and} \\quad \\text{COP} = \\frac{\\dot{Q}_{\\text{evap}}}{\\dot{Q}_{\\text{gen}}}",
      colorizedLatex:
        "\\textcolor{#2563eb}{P_{\\text{total}}} = \\textcolor{#059669}{P_{\\text{NH}_3}} + \\textcolor{#0891b2}{P_{\\text{butane}}} + \\textcolor{#d97706}{P_{\\text{H}_2\\text{O}}} \\quad \\text{and} \\quad \\textcolor{#9333ea}{\\text{COP}} = \\frac{\\textcolor{#059669}{\\dot{Q}_{\\text{evap}}}}{\\textcolor{#dc2626}{\\dot{Q}_{\\text{gen}}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "total uniform chamber pressure", variableId: "p_total" },
        { text: " is the sum of " },
        { text: "ammonia vapor pressure", variableId: "p_nh3" },
        { text: ", " },
        {
          text: "butane refrigerant partial pressure",
          variableId: "p_butane",
        },
        { text: ", and " },
        { text: "water absorption partial pressure", variableId: "p_h2o" },
        { text: "; cooling efficiency " },
        { text: "Coefficient of Performance", variableId: "cop" },
        { text: " ratios " },
        { text: "evaporator cooling heat extracted", variableId: "q_evap" },
        { text: " against " },
        { text: "generator thermal heat input", variableId: "q_gen" },
        { text: "." },
      ],
      variables: [
        {
          id: "p_total",
          symbol: "P_{\\text{total}}",
          name: "Total System Pressure",
          color: "sapphire",
          role: "Uniform static pressure throughout the hermetically sealed steel vessel (approx 10 atm)",
          unit: "Atmospheres (atm)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Because the entire system operates at a single constant pressure, no mechanical compressor or dynamic shaft seals are needed, eliminating toxic gas leaks.",
          telemetryMetricLabel: "Chamber Pressure",
        },
        {
          id: "p_nh3",
          symbol: "P_{\\text{NH}_3}",
          name: "Ammonia Partial Pressure",
          color: "emerald",
          role: "Inert carrier gas partial pressure balancing the evaporator mixture",
          unit: "Atmospheres (atm)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Ammonia gas sweeps across the liquid butane surface, lowering butane's effective partial pressure.",
        },
        {
          id: "p_butane",
          symbol: "P_{\\text{butane}}",
          name: "Butane Refrigerant Partial Pressure",
          color: "cyan",
          role: "Local vapor pressure of evaporating liquid hydrocarbon refrigerant",
          unit: "Atmospheres (atm)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "By Dalton's law of partial pressures, introducing ammonia lowers the butane partial pressure, causing it to boil and evaporate vigorously at sub-zero temperatures (-15 C), absorbing heat.",
          telemetryKey: "butaneFraction",
        },
        {
          id: "p_h2o",
          symbol: "P_{\\text{H}_2\\text{O}}",
          name: "Water Vapor Partial Pressure",
          color: "amber",
          role: "Liquid water absorbent vapor pressure in the condenser loop",
          unit: "Atmospheres (atm)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Water readily absorbs ammonia gas in the absorber vessel while remaining immiscible with butane.",
        },
        {
          id: "cop",
          symbol: "\\text{COP}",
          name: "Coefficient of Performance",
          color: "amethyst",
          role: "Dimensionless thermodynamic thermal efficiency metric of the absorption cycle",
          unit: "Dimensionless ratio [0.3 to 0.7]",
          dimension: "[1]",
          explanation:
            "Measures cooling refrigeration delivered per Joule of heat supplied to the boiler.",
          telemetryMetricLabel: "Refrig COP",
        },
        {
          id: "q_evap",
          symbol: "\\dot{Q}_{\\text{evap}}",
          name: "Cooling Power Extracted",
          color: "emerald",
          role: "Refrigeration cooling capacity produced in the evaporator chamber",
          unit: "Watts (W)",
          dimension: "[M L^2 T^-3]",
          explanation: "Thermal heat absorbed from inside the refrigerator cabinet.",
          telemetryMetricLabel: "Cooling Power",
        },
        {
          id: "q_gen",
          symbol: "\\dot{Q}_{\\text{gen}}",
          name: "Thermal Heat Input",
          color: "crimson",
          role: "Thermal energy provided by a simple gas burner or electric heating element",
          unit: "Watts (W)",
          dimension: "[M L^2 T^-3]",
          explanation:
            "Boils the ammonia out of the water solution to sustain continuous thermosiphon circulation.",
          telemetryKey: "heatInput",
        },
      ],
      pedagogicalNote:
        "Einstein and Szilard invented this refrigerator after reading about a Berlin family killed by toxic sulfur dioxide leaking from a mechanical compressor seal. Their invention has zero moving parts, zero mechanical seals, and runs silently on thermal heat.",
      claimRef: 1,
      historicalSignificance:
        "US 1781541 patented the single-pressure absorption cycle, which powers modern off-grid propane/solar refrigerators and industrial waste-heat chillers.",
    },
  ],

  // 7. John Bardeen & Walter Brattain Point-Contact Transistor (US 2,569,347)
  "us-2569347-bardeen-transistor": [
    {
      id: "bardeen-point-contact-gain",
      patentId: "us-2569347-bardeen-transistor",
      title: "Point-Contact Minority Hole Injection & Dynamic Current Amplification",
      category: "Solid-State Semiconductor Physics",
      rawLatex:
        "\\alpha = \\frac{\\partial I_c}{\\partial I_e} \\ge 1 \\quad \\text{and} \\quad \\Delta V_{\\text{out}} = \\alpha \\cdot \\frac{R_L}{R_{\\text{in}}} \\cdot \\Delta V_{\\text{in}}",
      colorizedLatex:
        "\\textcolor{#9333ea}{\\alpha} = \\frac{\\partial \\textcolor{#dc2626}{I_c}}{\\partial \\textcolor{#059669}{I_e}} \\ge 1 \\quad \\text{and} \\quad \\textcolor{#2563eb}{\\Delta V_{\\text{out}}} = \\textcolor{#9333ea}{\\alpha} \\cdot \\frac{\\textcolor{#d97706}{R_L}}{\\textcolor{#ea580c}{R_{\\text{in}}}} \\cdot \\textcolor{#0891b2}{\\Delta V_{\\text{in}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "current amplification factor (alpha)", variableId: "alpha" },
        { text: " measures the change in " },
        { text: "collector output current", variableId: "ic" },
        { text: " induced by " },
        { text: "emitter hole injection current", variableId: "ie" },
        { text: ", producing massive " },
        { text: "output voltage gain", variableId: "vout" },
        { text: " by transferring current from a " },
        { text: "low input resistance emitter", variableId: "rin" },
        { text: " to a " },
        {
          text: "high output load resistance collector",
          variableId: "rl",
        },
        { text: "." },
      ],
      variables: [
        {
          id: "alpha",
          symbol: "\\alpha",
          name: "Current Gain Factor",
          color: "amethyst",
          role: "Differential current transfer ratio ($\\partial I_c / \\partial I_e \\approx 1.5\\text{--}3.0$ in point-contact Ge)",
          unit: "Dimensionless gain ratio",
          dimension: "[1]",
          explanation:
            "In point-contact transistors, holes injected from the gold foil emitter create an electron-trapping space charge that pulls multiple electrons from the base into the collector, yielding alpha > 1.",
          telemetryMetricLabel: "Current Gain (Alpha)",
        },
        {
          id: "ic",
          symbol: "I_c",
          name: "Collector Current",
          color: "crimson",
          role: "Reverse-biased collector terminal current flowing through N-type germanium crystal",
          unit: "Milliamperes (mA)",
          dimension: "[I]",
          explanation:
            "Collected hole flow modulated by the emitter point contact placed 50 micrometers away.",
          telemetryMetricLabel: "Collector Current",
        },
        {
          id: "ie",
          symbol: "I_e",
          name: "Emitter Injection Current",
          color: "emerald",
          role: "Forward-biased gold contact point injecting minority hole carriers into the germanium surface inversion layer",
          unit: "Milliamperes (mA)",
          dimension: "[I]",
          explanation: "Injects positive hole carriers into the germanium lattice.",
          telemetryKey: "emitterCurrentMa",
        },
        {
          id: "vout",
          symbol: "\\Delta V_{\\text{out}}",
          name: "Amplified Output Voltage",
          color: "sapphire",
          role: "Output signal voltage swing across the high-impedance collector load",
          unit: "Volts (V)",
          dimension: "[M L^2 T^-3 I^-1]",
          explanation: "Signals are amplified over 100x in voltage.",
        },
        {
          id: "rin",
          symbol: "R_{\\text{in}}",
          name: "Input Emitter Resistance",
          color: "coral",
          role: "Forward-biased low dynamic resistance (approx 200 to 500 Ohms)",
          unit: "Ohms (\\Omega)",
          dimension: "[M L^2 T^-3 I^-2]",
          explanation:
            "Low impedance allows easy current injection from input microphones or sensors.",
        },
        {
          id: "rl",
          symbol: "R_L",
          name: "Collector Load Resistance",
          color: "amber",
          role: "Reverse-biased high output resistance (approx 20,000 to 100,000 Ohms)",
          unit: "Ohms (\\Omega)",
          dimension: "[M L^2 T^-3 I^-2]",
          explanation:
            "The term 'transistor' was coined as a portmanteau of 'transfer resistor'—transferring current from low to high resistance.",
        },
      ],
      pedagogicalNote:
        "Bardeen and Brattain discovered that pressing two gold-leaf contacts onto a germanium crystal just 0.002 inches apart allowed holes injected by the emitter to control the reverse current of the collector, creating the world's first solid-state amplifier.",
      claimRef: 1,
      historicalSignificance:
        "US 2569347 replaced bulky, fragile, power-hungry vacuum tubes and launched the semiconductor revolution.",
    },
  ],

  // 8. Hedy Lamarr & George Antheil Spread Spectrum (US 2,292,387)
  "us-2292387-lamarr-frequency-hopping": [
    {
      id: "lamarr-spread-spectrum-gain",
      patentId: "us-2292387-lamarr-frequency-hopping",
      title: "Frequency-Hopping Processing Gain & Anti-Jamming SNR Ratio",
      category: "RF Spread Spectrum & Cyber Warfare",
      rawLatex:
        "G_p = 10 \\log_{10}\\left( \\frac{\\text{BW}_{\\text{spread}}}{\\text{BW}_{\\text{channel}}} \\right) = 10 \\log_{10}(88) \\approx 19.44\\text{ dB}",
      colorizedLatex:
        "\\textcolor{#059669}{G_p} = 10 \\log_{10}\\left( \\frac{\\textcolor{#2563eb}{\\text{BW}_{\\text{spread}}}}{\\textcolor{#d97706}{\\text{BW}_{\\text{channel}}}} \\right) = 10 \\log_{10}(\\textcolor{#9333ea}{88}) \\approx \\textcolor{#059669}{19.44\\text{ dB}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "anti-jamming processing gain", variableId: "gp" },
        { text: " equals ten times the logarithm of " },
        {
          text: "total spread-spectrum RF bandwidth",
          variableId: "bw_spread",
        },
        { text: " over " },
        { text: "single-channel bandwidth", variableId: "bw_channel" },
        { text: ", hopping synchronously across " },
        {
          text: "88 piano-roll synchronized radio frequencies",
          variableId: "num_channels",
        },
        { text: " to render enemy jamming signals harmless." },
      ],
      variables: [
        {
          id: "gp",
          symbol: "G_p",
          name: "Spread Spectrum Processing Gain",
          color: "emerald",
          role: "Signal-to-noise ratio advantage (19.44 dB) gained over enemy jamming transmitters",
          unit: "Decibels (dB)",
          dimension: "[1]",
          explanation:
            "Because the torpedo receiver and transmitter hop across 88 frequencies in exact synchrony, an enemy jammer must dilute its broadcast power across all 88 channels, reducing jamming effectiveness by almost 100-fold.",
          telemetryMetricLabel: "Processing Gain",
        },
        {
          id: "bw_spread",
          symbol: "\\text{BW}_{\\text{spread}}",
          name: "Total Spread Bandwidth",
          color: "sapphire",
          role: "Entire radio frequency band spanned by the 88 carrier slots",
          unit: "Megahertz (MHz)",
          dimension: "[T^-1]",
          explanation:
            "The wide frequency territory across which the carrier pseudo-randomly hops.",
        },
        {
          id: "bw_channel",
          symbol: "\\text{BW}_{\\text{channel}}",
          name: "Instantaneous Channel Bandwidth",
          color: "amber",
          role: "Narrow bandwidth needed to transmit steering telemetry for a single time hop",
          unit: "Kilohertz (kHz)",
          dimension: "[T^-1]",
          explanation: "The narrow transmission slot occupied at any individual millisecond.",
        },
        {
          id: "num_channels",
          symbol: "88",
          name: "88 Piano-Roll Frequencies",
          color: "amethyst",
          role: "Number of discrete radio frequency channels derived from standard 88-key player piano rolls",
          unit: "Channels (88)",
          dimension: "[1]",
          explanation:
            "Antheil and Lamarr used slotted paper player-piano rolls running on synchronized clockwork motors inside the torpedo and the naval vessel to step through 88 secret carrier frequencies.",
          telemetryKey: "channelIndex",
        },
      ],
      pedagogicalNote:
        "Hollywood actress Hedy Lamarr and avant-garde composer George Antheil realized that radio-controlled torpedoes were easily jammed by enemy broadcasts on the control frequency. By synchronizing transmitter and receiver to hop together across 88 frequencies like a player piano roll, they invented spread spectrum.",
      claimRef: 1,
      historicalSignificance:
        "US 2292387 is the foundational patent for Wi-Fi, Bluetooth, GPS, and CDMA cellular networks.",
    },
  ],

  // 9. Douglas Engelbart Computer Mouse (US 3,541,541)
  "us-3541541-engelbart-mouse": [
    {
      id: "engelbart-coordinate-resolver",
      patentId: "us-3541541-engelbart-mouse",
      title: "Orthogonal Dual-Wheel Coordinate Resolver Kinematics",
      category: "Human-Computer Interaction",
      rawLatex:
        "\\begin{bmatrix} \\Delta X \\\\ \\Delta Y \\end{bmatrix} = r_{\\text{wheel}} \\begin{bmatrix} \\Delta \\theta_X \\\\ \\Delta \\theta_Y \\end{bmatrix} \\quad \\text{and} \\quad V_{\\text{pot}} = V_{\\text{ref}} \\cdot \\frac{\\theta_X}{\\theta_{\\text{max}}}",
      colorizedLatex:
        "\\begin{bmatrix} \\textcolor{#2563eb}{\\Delta X} \\\\ \\textcolor{#059669}{\\Delta Y} \\end{bmatrix} = \\textcolor{#d97706}{r_{\\text{wheel}}} \\begin{bmatrix} \\textcolor{#2563eb}{\\Delta \\theta_X} \\\\ \\textcolor{#059669}{\\Delta \\theta_Y} \\end{bmatrix} \\quad \\text{and} \\quad \\textcolor{#9333ea}{V_{\\text{pot}}} = \\textcolor{#dc2626}{V_{\\text{ref}}} \\cdot \\frac{\\textcolor{#2563eb}{\\theta_X}}{\\textcolor{#ea580c}{\\theta_{\\text{max}}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "horizontal X cursor displacement", variableId: "dx" },
        { text: " and " },
        { text: "vertical Y cursor displacement", variableId: "dy" },
        { text: " are resolved by " },
        { text: "wheel radius", variableId: "r_wheel" },
        { text: " multiplying " },
        { text: "orthogonal wheel rotations", variableId: "dtheta" },
        { text: ", producing " },
        { text: "analog position voltages", variableId: "vpot" },
        { text: " proportional to " },
        { text: "reference supply voltage", variableId: "vref" },
        { text: "." },
      ],
      variables: [
        {
          id: "dx",
          symbol: "\\Delta X",
          name: "Horizontal X Screen Displacement",
          color: "sapphire",
          role: "Planar X-axis cursor translation on the display screen",
          unit: "Millimeters / Pixels",
          dimension: "[L]",
          explanation:
            "Driven by the primary knife-edge wheel aligned along the longitudinal axis.",
          telemetryMetricLabel: "X Position",
        },
        {
          id: "dy",
          symbol: "\\Delta Y",
          name: "Vertical Y Screen Displacement",
          color: "emerald",
          role: "Planar Y-axis cursor translation on the display screen",
          unit: "Millimeters / Pixels",
          dimension: "[L]",
          explanation:
            "Driven by the secondary knife-edge wheel mounted perpendicular at 90 degrees.",
          telemetryMetricLabel: "Y Position",
        },
        {
          id: "r_wheel",
          symbol: "r_{\\text{wheel}}",
          name: "Tracking Wheel Radius",
          color: "amber",
          role: "Radius of precision steel tracking wheels (approx 9.5 mm)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation: "Relates wheel angular rotation to linear physical table travel.",
        },
        {
          id: "dtheta",
          symbol: "\\Delta \\theta",
          name: "Potentiometer Angular Rotation",
          color: "sapphire",
          role: "Angular shaft rotation angle measured by internal rotary potentiometers / optical encoders",
          unit: "Radians / Degrees",
          dimension: "[1]",
          explanation: "Directly rotates wiper contacts across precision carbon tracks.",
        },
        {
          id: "vpot",
          symbol: "V_{\\text{pot}}",
          name: "Analog Potentiometer Output Voltage",
          color: "amethyst",
          role: "Continuous DC voltage signal sent to the analog-to-digital converter",
          unit: "Volts (V)",
          dimension: "[M L^2 T^-3 I^-1]",
          explanation:
            "Converted by the computer interface into display beam deflection coordinates.",
        },
        {
          id: "vref",
          symbol: "V_{\\text{ref}}",
          name: "Reference Bus Voltage",
          color: "crimson",
          role: "Constant DC supply voltage across potentiometer terminals (+5.0 V)",
          unit: "Volts (V)",
          dimension: "[M L^2 T^-3 I^-1]",
          explanation:
            "Provides the stable baseline potential for ratiometric position conversion.",
        },
      ],
      claimRef: 1,
      historicalSignificance:
        "US 3541541 introduced the computer mouse, graphic cursor pointing, and the foundation for all modern Graphical User Interfaces (GUIs).",
      pedagogicalNote:
        "The knife-edge wheels act as mechanical vector projection operators. As the mouse glides freely across a 2D plane, one wheel only rolls under X-axis movement and drags along Y; the other rolls under Y and drags along X. This pure mechanical decoupling cleanly isolates the planar vector components into independent rotational analog voltages without complex trigonometry.",
    },
  ],

  // 10. Willard Boyle & George Smith Charge-Coupled Device (US 3,858,232)
  "us-3858232-boyle-smith-ccd": [
    {
      id: "ccd-potential-well-transfer",
      patentId: "us-3858232-boyle-smith-ccd",
      title: "3-Phase MOS Potential Well Charge Transfer & Storage Capacity",
      category: "Digital Imaging & Image Sensors",
      rawLatex:
        "Q_{\\text{max}} = C_{\\text{ox}} \\cdot A \\cdot (V_G - V_{\\text{th}}) \\quad \\text{and} \\quad Q_{\\text{out}} = Q_0 \\cdot (\\text{CTE})^N",
      colorizedLatex:
        "\\textcolor{#0891b2}{Q_{\\text{max}}} = \\textcolor{#2563eb}{C_{\\text{ox}}} \\cdot \\textcolor{#9333ea}{A} \\cdot (\\textcolor{#d97706}{V_G} - \\textcolor{#ea580c}{V_{\\text{th}}}) \\quad \\text{and} \\quad \\textcolor{#059669}{Q_{\\text{out}}} = \\textcolor{#0891b2}{Q_0} \\cdot (\\textcolor{#059669}{\\text{CTE}})^{\\textcolor{#dc2626}{N}}",
      plainEnglishSentence: [
        { text: "The " },
        {
          text: "maximum photoelectron packet charge",
          variableId: "qmax",
        },
        { text: " stored in a pixel well equals " },
        { text: "oxide gate capacitance", variableId: "cox" },
        { text: " times " },
        { text: "pixel electrode area", variableId: "area" },
        { text: " times " },
        { text: "applied gate voltage above threshold", variableId: "vg" },
        { text: ", transferred along the sensor with " },
        {
          text: "ultra-high Charge Transfer Efficiency",
          variableId: "cte",
        },
        { text: " across " },
        {
          text: "thousands of bucket-brigade shift stages",
          variableId: "num_shifts",
        },
        { text: "." },
      ],
      variables: [
        {
          id: "qmax",
          symbol: "Q_{\\text{max}}",
          name: "Pixel Full-Well Capacity",
          color: "cyan",
          role: "Maximum charge packet stored in deep depletion potential well (approx 100,000 electrons)",
          unit: "Coulombs (C) / Electrons",
          dimension: "[I T]",
          explanation:
            "Incident photons generate electron-hole pairs via the photoelectric effect, accumulating photoelectrons in potential wells under positive gate electrodes.",
          telemetryMetricLabel: "Well Depth",
        },
        {
          id: "cox",
          symbol: "C_{\\text{ox}}",
          name: "Gate Oxide Capacitance",
          color: "sapphire",
          role: "Capacitance per unit area of thin silicon dioxide insulating layer (\\varepsilon_{ox} / t_{ox})",
          unit: "Farads / m^2 (F/m^2)",
          dimension: "[M^-1 L^-4 T^4 I^2]",
          explanation:
            "Thin thermal oxide isolates metal electrodes from the underlying silicon substrate.",
        },
        {
          id: "area",
          symbol: "A",
          name: "Pixel Photosensitive Area",
          color: "amethyst",
          role: "Physical surface area of individual pixel sensing site",
          unit: "Square micrometers (\\mu m^2)",
          dimension: "[L^2]",
          explanation: "Determines light collection efficiency and sensor spatial resolution.",
        },
        {
          id: "vg",
          symbol: "V_G - V_{\\text{th}}",
          name: "Effective Gate Overdrive Voltage",
          color: "amber",
          role: "Positive bias applied to clock electrode creating an electrostatic potential well (approx 10 V)",
          unit: "Volts (V)",
          dimension: "[M L^2 T^-3 I^-1]",
          explanation:
            "Repels majority holes and creates a deep potential well for minority photoelectrons.",
          telemetryKey: "clockPhase",
        },
        {
          id: "cte",
          symbol: "\\text{CTE}",
          name: "Charge Transfer Efficiency",
          color: "emerald",
          role: "Fraction of charge packet successfully shifted to next electrode (\\ge 0.99999)",
          unit: "Efficiency fraction (> 0.99999)",
          dimension: "[1]",
          explanation:
            "By clocking three gate phases (\\phi_1, \\phi_2, \\phi_3) in sequence, potential wells shift laterally, moving charge packets across the chip like a bucket brigade without smear.",
          telemetryMetricLabel: "Transfer Eff",
        },
        {
          id: "num_shifts",
          symbol: "N",
          name: "Number of Shift Transfers",
          color: "crimson",
          role: "Total sequential electrode shifts from corner pixel to on-chip amplifier (up to 4,000 stages)",
          unit: "Transfer stages",
          dimension: "[1]",
          explanation:
            "If CTE were only 0.99, an image would lose over 60% of its contrast after 100 transfers. Boyle and Smith's 3-phase design achieved CTE > 0.99999.",
        },
      ],
      pedagogicalNote:
        "Boyle and Smith invented the Charge-Coupled Device in under an hour during a Bell Labs brainstorming session on silicon memory. They created a semiconductor electronic eye where light is converted into charge packets and shifted out like water buckets in a bucket brigade.",
      claimRef: 1,
      historicalSignificance:
        "US 3923554 eliminated photographic chemical film, enabling digital cameras, smartphones, astronomy (Hubble Space Telescope), and medical endoscopy.",
    },
  ],

  // 11. Enrico Fermi & Leo Szilard Neutronic Reactor (US 2,708,656)
  "us-2708656-fermi-reactor": [
    {
      id: "fermi-point-kinetics",
      patentId: "us-2708656-fermi-reactor",
      title: "6-Group Delayed Neutron Criticality & Prompt Kinetics",
      category: "Nuclear Physics & Criticality",
      rawLatex:
        "\\frac{dn}{dt} = \\frac{\\rho - \\beta}{\\Lambda} n + \\sum_{i=1}^6 \\lambda_i C_i \\quad \\text{and} \\quad k_{\\text{eff}} = \\frac{1}{1 - \\rho}",
      colorizedLatex:
        "\\frac{d\\textcolor{#9333ea}{n}}{dt} = \\frac{\\textcolor{#dc2626}{\\rho} - \\textcolor{#0891b2}{\\beta}}{\\textcolor{#ea580c}{\\Lambda}} \\textcolor{#9333ea}{n} + \\sum_{i=1}^6 \\textcolor{#d97706}{\\lambda_i} \\textcolor{#059669}{C_i} \\quad \\text{and} \\quad \\textcolor{#dc2626}{k_{\\text{eff}}} = \\frac{1}{1 - \\rho}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "rate of neutron flux growth", variableId: "n_flux" },
        { text: " depends on " },
        { text: "total reactivity excess", variableId: "rho" },
        { text: " offset by the " },
        { text: "delayed neutron fraction", variableId: "beta" },
        { text: " over " },
        {
          text: "prompt neutron generation lifetime",
          variableId: "lambda_gen",
        },
        { text: ", stabilized by " },
        { text: "6 delayed precursor decay groups", variableId: "ci" },
        { text: " with " },
        { text: "characteristic decay constants", variableId: "decay_k" },
        { text: "." },
      ],
      variables: [
        {
          id: "n_flux",
          symbol: "n(t)",
          name: "Thermal Neutron Population",
          color: "amethyst",
          role: "Total density of thermalized neutrons driving U-235 fission cascades in the graphite matrix",
          unit: "Neutrons / cm^3",
          dimension: "[L^-3]",
          explanation:
            "Directly proportional to the thermal power output of the reactor core ($P = n \\cdot v_{\\text{th}} \\cdot \\Sigma_f \\cdot E_{\\text{fiss}}$).",
          telemetryMetricLabel: "Neutron Flux",
        },
        {
          id: "rho",
          symbol: "\\rho",
          name: "Reactivity Index",
          color: "crimson",
          role: "Fractional departure from exact criticality: \\rho = (k_{eff} - 1) / k_{eff}",
          unit: "Dimensionless / Dollars ($)",
          dimension: "[1]",
          explanation:
            "When cadmium control rods are withdrawn, reactivity rises. If $\\rho < \\beta$, the reactor is delayed critical (safe and slowly controllable). If $\\rho \\ge \\beta$, the core goes prompt critical.",
          telemetryKey: "cadmiumPosition",
          telemetryMetricLabel: "Reactivity",
        },
        {
          id: "beta",
          symbol: "\\beta",
          name: "Delayed Neutron Fraction",
          color: "cyan",
          role: "Fraction of fission neutrons emitted after precursor radioactive decay (0.0065 = 0.65% for U-235)",
          unit: "Fraction (0.0065)",
          dimension: "[1]",
          explanation:
            "Without delayed neutrons, reactors would experience power excursions on a microsecond timescale, making human or mechanical control impossible.",
        },
        {
          id: "lambda_gen",
          symbol: "\\Lambda",
          name: "Prompt Generation Time",
          color: "coral",
          role: "Average time from neutron birth in fission to thermalization in graphite and absorption (approx 1 millisecond)",
          unit: "Seconds (s)",
          dimension: "[T]",
          explanation:
            "Thermalization in heavy graphite blocks slows fast 2 MeV fission neutrons down to 0.025 eV thermal speeds.",
        },
        {
          id: "ci",
          symbol: "C_i",
          name: "Delayed Precursor Concentration",
          color: "emerald",
          role: "Concentration of radioactive fission product isotopes (e.g. Br-87, I-137) that emit delayed neutrons",
          unit: "Precursors / cm^3",
          dimension: "[L^-3]",
          explanation:
            "These six isotopic groups emit neutrons over half-lives ranging from 0.2 seconds to 55 seconds, slowing the reactor time constant down to human manageable speeds.",
        },
        {
          id: "decay_k",
          symbol: "\\lambda_i",
          name: "Precursor Decay Constant",
          color: "amber",
          role: "Radioactive decay rate constants (\\lambda_i = \\ln 2 / T_{1/2}) for the 6 delayed isotope families",
          unit: "1 / Seconds (s^-1)",
          dimension: "[T^-1]",
          explanation:
            "Controls the gradual release of delayed neutrons after control rods are repositioned.",
        },
      ],
      pedagogicalNote:
        "Fermi and Szilard realized that high-purity graphite could thermalize fast neutrons without capturing them, and that delayed neutron emissions give human operators and cadmium safety rods seconds (rather than microseconds) to control chain reactions.",
      claimRef: 1,
      historicalSignificance:
        "US 2708656 is the master patent for nuclear energy, establishing the principles of all nuclear reactors and carbon-free power generation worldwide.",
    },
  ],

  // 12. Robert Noyce Monolithic Silicon Integrated Circuit (US 2,981,877)
  "us-2981877-noyce-ic": [
    {
      id: "noyce-pn-depletion",
      patentId: "us-2981877-noyce-ic",
      title: "Planar PN Junction Depletion Capacitance & Lead Interconnect Resistance",
      category: "Semiconductors & Microelectronics",
      rawLatex:
        "C_j = \\frac{\\varepsilon_s A}{W_{\\text{dep}}} \\quad \\text{and} \\quad R_{\\text{lead}} = \\rho_{\\text{Al}} \\frac{L}{W \\cdot t}",
      colorizedLatex:
        "\\textcolor{#059669}{C_j} = \\frac{\\textcolor{#0891b2}{\\varepsilon_s} \\textcolor{#9333ea}{A}}{\\textcolor{#d97706}{W_{\\text{dep}}}} \\quad \\text{and} \\quad \\textcolor{#dc2626}{R_{\\text{lead}}} = \\textcolor{#ea580c}{\\rho_{\\text{Al}}} \\frac{\\textcolor{#2563eb}{L}}{\\textcolor{#059669}{W} \\cdot \\textcolor{#9333ea}{t}}",
      plainEnglishSentence: [
        { text: "The " },
        {
          text: "junction isolation capacitance",
          variableId: "c_j",
        },
        { text: " scales with " },
        {
          text: "silicon dielectric permittivity",
          variableId: "eps",
        },
        { text: " and " },
        { text: "junction cross-sectional area", variableId: "area" },
        { text: " over " },
        { text: "depletion barrier width", variableId: "w_dep" },
        { text: "; monolithic planar leads maintain " },
        {
          text: "low parasitic interconnect resistance",
          variableId: "r_lead",
        },
        { text: " through " },
        {
          text: "deposited aluminum resistivity",
          variableId: "rho_al",
        },
        { text: " across " },
        { text: "planar track dimensions", variableId: "geom" },
        { text: "." },
      ],
      variables: [
        {
          id: "c_j",
          symbol: "C_j",
          name: "Depletion Barrier Capacitance",
          color: "emerald",
          role: "Parasitic capacitance across the reverse-biased PN isolation junction",
          unit: "Farads (F) / Picofarads (pF)",
          dimension: "[M^-1 L^-2 T^4 I^2]",
          explanation:
            "In a monolithic IC, components are electrically isolated inside the silicon wafer by reverse-biased PN junctions, creating a dielectric barrier with intrinsic capacitance.",
          telemetryMetricLabel: "Depletion Cap",
        },
        {
          id: "eps",
          symbol: "\\varepsilon_s",
          name: "Silicon Permittivity",
          color: "cyan",
          role: "Material dielectric constant of silicon ($\\varepsilon_r \\approx 11.7$)",
          unit: "Farads per meter (F/m)",
          dimension: "[M^-1 L^-3 T^4 I^2]",
          explanation:
            "The physical constant determining electric field displacement inside the semiconductor lattice.",
        },
        {
          id: "area",
          symbol: "A",
          name: "Junction Surface Area",
          color: "amethyst",
          role: "Photolithographically defined planar area of the diffused diode or transistor base",
          unit: "Square micrometers (\\mu m^2)",
          dimension: "[L^2]",
          explanation:
            "Planar processing allows microscopic feature sizing, minimizing junction capacitance to allow gigahertz switching speeds.",
        },
        {
          id: "w_dep",
          symbol: "W_{\\text{dep}}",
          name: "Depletion Layer Width",
          color: "amber",
          role: "Space-charge region width devoid of mobile majority carriers",
          unit: "Micrometers (\\mu m)",
          dimension: "[L]",
          explanation:
            "Widened by reverse bias voltage, preventing cross-talk current leakage between adjacent components on the same monolithic chip.",
        },
        {
          id: "r_lead",
          symbol: "R_{\\text{lead}}",
          name: "Planar Lead Resistance",
          color: "crimson",
          role: "Parasitic resistance of vapor-deposited aluminum interconnect tracks",
          unit: "Ohms (\\Omega)",
          dimension: "[M L^2 T^-3 I^-2]",
          explanation:
            "Noyce's breakthrough was evaporating aluminum directly onto the insulating silicon dioxide layer, eliminating hand-soldered wires entirely.",
          telemetryMetricLabel: "Lead Resistance",
        },
        {
          id: "rho_al",
          symbol: "\\rho_{\\text{Al}}",
          name: "Aluminum Resistivity",
          color: "coral",
          role: "Bulk electrical resistivity of thin-film aluminum (2.65 x 10^-8 Ohm-meters)",
          unit: "Ohm-meters (\\Omega \\cdot m)",
          dimension: "[M L^3 T^-3 I^-2]",
          explanation:
            "Thin-film aluminum adheres firmly to silicon dioxide (SiO2) and provides near-ideal ohmic contact to silicon.",
        },
        {
          id: "geom",
          symbol: "L / (W \\cdot t)",
          name: "Interconnect Aspect Ratio",
          color: "sapphire",
          role: "Geometric length, width, and film thickness of the printed metal wire track",
          unit: "Inverse meters (1/m)",
          dimension: "[L^-1]",
          explanation: "Short, wide planar tracks keep RC interconnect delays negligible.",
        },
      ],
      pedagogicalNote:
        "Prior to Noyce, the 'tyranny of numbers' meant that complex computers required hand-soldering millions of discrete wires, causing constant connection failures. Noyce used silicon dioxide as a built-in insulator and deposited metal leads directly on top, creating the first true microchip.",
      claimRef: 1,
      historicalSignificance:
        "US 2981877 birthed Silicon Valley and the entire modern computer age (microprocessors, RAM, and GPUs).",
    },
  ],

  // 13. Percy Spencer Microwave Oven (US 2,495,429)
  "us-2495429-spencer-microwave": [
    {
      id: "spencer-dielectric-heating",
      patentId: "us-2495429-spencer-microwave",
      title: "Dielectric Volumetric Heating Rate & Microwave Resonance",
      category: "Applied Electromagnetics",
      rawLatex:
        "\\dot{q} = 2\\pi f \\cdot \\varepsilon_0 \\cdot \\varepsilon'' \\cdot |\\vec{E}|^2",
      colorizedLatex:
        "\\textcolor{#dc2626}{\\dot{q}} = \\textcolor{#d97706}{2\\pi f} \\cdot \\textcolor{#2563eb}{\\varepsilon_0} \\cdot \\textcolor{#0891b2}{\\varepsilon''} \\cdot \\textcolor{#9333ea}{|\\vec{E}|^2}",
      plainEnglishSentence: [
        { text: "The " },
        {
          text: "volumetric thermal dissipation rate",
          variableId: "q_dot",
        },
        { text: " generated inside food scales with the " },
        { text: "microwave oscillation frequency", variableId: "freq" },
        { text: ", " },
        { text: "vacuum permittivity", variableId: "eps_0" },
        { text: ", the " },
        {
          text: "dielectric loss factor of water",
          variableId: "eps_double_prime",
        },
        { text: ", and the " },
        {
          text: "square of cavity electric field intensity",
          variableId: "e_field",
        },
        { text: "." },
      ],
      variables: [
        {
          id: "q_dot",
          symbol: "\\dot{q}",
          name: "Volumetric Heating Density",
          color: "crimson",
          role: "Heat energy absorbed per cubic meter per second throughout the depth of the food product",
          unit: "Watts / m^3",
          dimension: "[M L^-1 T^-3]",
          explanation:
            "Unlike conventional ovens that heat from the outside in via slow surface conduction, microwave radiation penetrates centimeters into foodstuffs, generating heat volumetrically throughout the interior.",
          telemetryMetricLabel: "Thermal Heating",
        },
        {
          id: "freq",
          symbol: "2\\pi f",
          name: "Angular Microwave Frequency",
          color: "amber",
          role: "2.45 GHz radio frequency generated by the multi-cavity magnetron oscillator",
          unit: "Radians / second (2\\pi \\times 2.45 \\times 10^9 rad/s)",
          dimension: "[T^-1]",
          explanation:
            "At 2.45 GHz, polar water molecules attempt to re-orient 2.45 billion times per second, generating molecular friction.",
          telemetryKey: "frequencyGhz",
        },
        {
          id: "eps_0",
          symbol: "\\varepsilon_0",
          name: "Permittivity of Free Space",
          color: "sapphire",
          role: "Fundamental physical constant (8.854 x 10^-12 F/m)",
          unit: "Farads per meter (F/m)",
          dimension: "[M^-1 L^-3 T^4 I^2]",
          explanation:
            "Determines electromagnetic wave propagation across the metallic resonant cavity.",
        },
        {
          id: "eps_double_prime",
          symbol: "\\varepsilon''",
          name: "Dielectric Loss Factor (Water)",
          color: "cyan",
          role: "Imaginary component of complex permittivity representing electrical dissipation into heat (approx 12.0 for liquid water at 20 C)",
          unit: "Dimensionless loss factor",
          dimension: "[1]",
          explanation:
            "Polar H2O molecules lag slightly behind the alternating electric field, dissipating electromagnetic energy into kinetic thermal vibration.",
          telemetryKey: "waterContentPct",
        },
        {
          id: "e_field",
          symbol: "|\\vec{E}|^2",
          name: "Electric Field Intensity Squared",
          color: "amethyst",
          role: "Magnitude squared of standing microwave electric field inside the metallic oven chamber",
          unit: "Volts^2 / meter^2 (V^2/m^2)",
          dimension: "[M^2 L^2 T^-6 I^-2]",
          explanation:
            "Resonant cavity standing waves create high local electric field peaks, which is why modern microwaves incorporate rotating turntables or mode stirrers.",
          telemetryMetricLabel: "Cavity E-Field",
        },
      ],
      pedagogicalNote:
        "Percy Spencer discovered radar microwave cooking when a cavity magnetron melted a peanut-butter candy bar in his pocket. He immediately tested popcorn kernels and an egg, patenting the waveguide and metallic enclosure that became the modern microwave oven.",
      claimRef: 1,
      historicalSignificance:
        "US 2495429 transformed global food preparation, commercial kitchens, and domestic cooking.",
    },
  ],

  // 14. Stephanie Kwolek Kevlar Aramid Fibers (US 3,671,542)
  "us-3671542-kwolek-kevlar": [
    {
      id: "kwolek-aramid-tensile",
      patentId: "us-3671542-kwolek-kevlar",
      title: "Liquid-Crystalline Nematic Chain Alignment & Extreme Tensile Modulus",
      category: "Materials Science & Polymers",
      rawLatex:
        "\\sigma = E_{\\text{aramid}} \\cdot \\varepsilon \\quad \\text{and} \\quad S = \\frac{1}{2} \\langle 3\\cos^2\\theta - 1 \\rangle",
      colorizedLatex:
        "\\textcolor{#059669}{\\sigma} = \\textcolor{#2563eb}{E_{\\text{aramid}}} \\cdot \\textcolor{#9333ea}{\\varepsilon} \\quad \\text{and} \\quad \\textcolor{#d97706}{S} = \\frac{1}{2} \\langle 3\\textcolor{#0891b2}{\\cos^2\\theta} - 1 \\rangle",
      plainEnglishSentence: [
        { text: "The " },
        { text: "extreme tensile stress", variableId: "sigma" },
        { text: " supported by Kevlar filaments equals its " },
        {
          text: "ultra-high elastic modulus (130 GPa)",
          variableId: "e_mod",
        },
        { text: " multiplied by " },
        { text: "elastic strain", variableId: "strain" },
        { text: ", made possible by an " },
        {
          text: "ordered nematic orientation factor",
          variableId: "order_s",
        },
        { text: " aligning " },
        {
          text: "aromatic polymer chains parallel to the fiber axis",
          variableId: "angle_theta",
        },
        { text: "." },
      ],
      variables: [
        {
          id: "sigma",
          symbol: "\\sigma",
          name: "Tensile Stress",
          color: "emerald",
          role: "Internal tensile load supported per unit cross-sectional area (up to 3,600 MPa)",
          unit: "Megapascals (MPa)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Kevlar filaments withstand over 3,600 MPa of tensile stress—over 5 times stronger than structural steel on an equal-weight basis.",
          telemetryMetricLabel: "Tensile Stress",
        },
        {
          id: "e_mod",
          symbol: "E_{\\text{aramid}}",
          name: "Young's Elastic Modulus",
          color: "sapphire",
          role: "Stiffness of poly(p-phenylene terephthalamide) rigid-rod backbone (130 GPa)",
          unit: "Gigapascals (GPa)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "The combination of benzene aromatic rings, trans-amide linkages, and dense hydrogen bonding prevents molecular chain folding.",
        },
        {
          id: "strain",
          symbol: "\\varepsilon",
          name: "Tensile Elongation Strain",
          color: "amethyst",
          role: "Fractional elongation of the aramid filament under ballistic load (\\Delta L / L_0)",
          unit: "Percentage (%)",
          dimension: "[1]",
          explanation:
            "Kevlar absorbs massive kinetic energy by stretching elastically up to 3.5% elongation before rupture, dissipating projectile shockwaves.",
          telemetryKey: "appliedStrainPct",
        },
        {
          id: "order_s",
          symbol: "S",
          name: "Nematic Order Parameter",
          color: "amber",
          role: "Measure of parallel molecular alignment (S = 0 for random isotropic liquids; S -> 1 for perfect crystalline alignment)",
          unit: "Alignment index [0 to 1]",
          dimension: "[1]",
          explanation:
            "Stephanie Kwolek discovered that spinning from a cloudy, liquid-crystalline dope aligns the polymer rods perfectly parallel along the spinneret flow lines ($S > 0.9$).",
          telemetryKey: "crystallinityPct",
          telemetryMetricLabel: "Chain Alignment",
        },
        {
          id: "angle_theta",
          symbol: "\\cos^2\\theta",
          name: "Polymer Chain Orientation Angle",
          color: "cyan",
          role: "Angle between individual aromatic molecular chains and the fiber tensile axis",
          unit: "Angle in degrees / radians",
          dimension: "[1]",
          explanation:
            "When $\\theta \\to 0$, external loads directly pull against covalent carbon-carbon bonds and aromatic rings rather than weak inter-chain tangles.",
        },
      ],
      pedagogicalNote:
        "Before Kwolek, synthetic fibers like nylon had folded, flexible polymer chains that slipped under load. Kwolek synthesized rigid aromatic PPTA rods that spontaneously aligned into liquid crystals, yielding fibers that revolutionized body armor, aerospace composites, and undersea cables.",
      claimRef: 1,
      historicalSignificance:
        "US 3671542 established modern liquid-crystal polymer chemistry and has saved thousands of lives through Kevlar ballistic vests.",
    },
  ],

  // 15. Steve Wozniak Apple II (US 4,136,359)
  "us-4136359-wozniak-apple": [
    {
      id: "wozniak-two-phase-bus",
      patentId: "us-4136359-wozniak-apple",
      title: "Two-Phase Non-Conflicting Time-Multiplexed DRAM Arbitration",
      category: "Computer Architecture & Digital Logic",
      rawLatex:
        "t_{\\text{access}} = \\frac{1}{2 f_{\\text{clk}}} - t_{\\text{prop}} \\quad \\text{where} \\quad \\phi_1 = \\text{Video Display}, \\quad \\phi_2 = \\text{6502 CPU}",
      colorizedLatex:
        "\\textcolor{#2563eb}{t_{\\text{access}}} = \\frac{1}{\\textcolor{#d97706}{2 f_{\\text{clk}}}} - \\textcolor{#dc2626}{t_{\\text{prop}}} \\quad \\text{where} \\quad \\textcolor{#059669}{\\phi_1} = \\text{Video}, \\quad \\textcolor{#9333ea}{\\phi_2} = \\text{6502 CPU}",
      plainEnglishSentence: [
        { text: "The " },
        {
          text: "available memory access window",
          variableId: "t_access",
        },
        { text: " equals half the period of the " },
        { text: "master 1.023 MHz clock", variableId: "f_clk" },
        { text: " minus " },
        {
          text: "logic gate propagation delay",
          variableId: "t_prop",
        },
        { text: ", interleaved seamlessly so the " },
        {
          text: "video scanner reads DRAM in phase 1",
          variableId: "phi_1",
        },
        { text: " while the " },
        {
          text: "6502 microprocessor accesses memory in phase 2",
          variableId: "phi_2",
        },
        { text: "." },
      ],
      variables: [
        {
          id: "t_access",
          symbol: "t_{\\text{access}}",
          name: "Memory Access Window",
          color: "sapphire",
          role: "Time duration allocated per cycle for DRAM read/write (approx 488 nanoseconds)",
          unit: "Nanoseconds (ns)",
          dimension: "[T]",
          explanation:
            "Because dynamic RAM access completes in under 400 ns, both the CPU and the video display hardware can complete a full read cycle within a single 978 ns clock period.",
          telemetryMetricLabel: "Access Window",
        },
        {
          id: "f_clk",
          symbol: "f_{\\text{clk}}",
          name: "Master Clock Frequency",
          color: "amber",
          role: "1.022727 MHz system clock derived from 14.31818 MHz crystal oscillator divider (14.31818 / 14)",
          unit: "Megahertz (MHz)",
          dimension: "[T^-1]",
          explanation:
            "Dividing the 14.31818 MHz master crystal by 14 produces the exact 1.023 MHz 6502 clock and 4x NTSC color subcarrier.",
          telemetryKey: "clockFreqMhz",
        },
        {
          id: "t_prop",
          symbol: "t_{\\text{prop}}",
          name: "Propagation Delay Budget",
          color: "crimson",
          role: "Signal propagation time across TTL address multiplexers (approx 45 ns)",
          unit: "Nanoseconds (ns)",
          dimension: "[T]",
          explanation:
            "Low-delay 74S-series multiplexers switch address lines between the video counter and the CPU address bus in under 45 ns.",
        },
        {
          id: "phi_1",
          symbol: "\\phi_1",
          name: "Phase 1: Video Scanline Fetch",
          color: "emerald",
          role: "Low half of clock cycle dedicated to reading display pixels for cathode ray CRT beam rasterization",
          unit: "Phase window (489 ns)",
          dimension: "[T]",
          explanation:
            "The video generator fetches character and graphics bytes from DRAM without CPU wait states, eliminating screen flickering or video snow.",
        },
        {
          id: "phi_2",
          symbol: "\\phi_2",
          name: "Phase 2: CPU Read/Write",
          color: "amethyst",
          role: "High half of clock cycle dedicated exclusively to 6502 CPU instruction fetches and data transfers",
          unit: "Phase window (489 ns)",
          dimension: "[T]",
          explanation:
            "The 6502 microprocessor runs at 100% full speed with zero wait states, never stalling for video refreshing.",
        },
      ],
      pedagogicalNote:
        "Prior microcomputers like the Altair or TRS-80 required separate, expensive dual-ported RAM or caused annoying screen flicker when the CPU accessed video memory. Wozniak realized that 6502 CPUs only use the bus during phase 2 of the clock, using simple TTL multiplexers to interleave video fetches into phase 1 with zero extra parts.",
      claimRef: 1,
      historicalSignificance:
        "US 4136359 made the Apple II the first practical, affordable personal computer with full color graphics, launching the PC revolution.",
    },
  ],

  // 16. Robert Goddard Liquid-Fuel Rocket (US 1,102,653)
  "us-1102653-goddard-rocket": [
    {
      id: "goddard-rocket-equation",
      patentId: "us-1102653-goddard-rocket",
      title: "Tsiolkovsky Velocity Increment & Supersonic de Laval Nozzle Expansion",
      category: "Aerospace & Supersonic Propulsion",
      rawLatex:
        "\\Delta v = I_{\\text{sp}} \\cdot g_0 \\cdot \\ln\\left(\\frac{m_0}{m_f}\\right) \\quad \\text{and} \\quad v_e = \\sqrt{\\frac{2\\gamma}{\\gamma - 1} R T_c \\left[ 1 - \\left(\\frac{p_e}{p_c}\\right)^{\\frac{\\gamma-1}{\\gamma}} \\right]}",
      colorizedLatex:
        "\\textcolor{#2563eb}{\\Delta v} = \\textcolor{#059669}{I_{\\text{sp}}} \\cdot \\textcolor{#d97706}{g_0} \\cdot \\ln\\left(\\frac{\\textcolor{#0891b2}{m_0}}{\\textcolor{#ea580c}{m_f}}\\right) \\quad \\text{and} \\quad \\textcolor{#dc2626}{v_e} = \\sqrt{\\frac{2\\gamma}{\\gamma - 1} R \\textcolor{#dc2626}{T_c} \\left[ 1 - \\left(\\frac{\\textcolor{#9333ea}{p_e}}{\\textcolor{#0891b2}{p_c}}\\right)^{\\frac{\\gamma-1}{\\gamma}} \\right]}",
      plainEnglishSentence: [
        { text: "The " },
        {
          text: "total rocket velocity increment",
          variableId: "delta_v",
        },
        { text: " equals the " },
        { text: "specific impulse", variableId: "isp" },
        { text: " times " },
        { text: "standard gravity", variableId: "g0" },
        { text: " times the natural log of " },
        { text: "initial wet mass", variableId: "m0" },
        { text: " over " },
        { text: "burnout dry mass", variableId: "mf" },
        { text: ", propelled by " },
        {
          text: "supersonic exhaust velocity",
          variableId: "ve",
        },
        { text: " expanding from " },
        {
          text: "combustion chamber temperature and pressure",
          variableId: "tc",
        },
        { text: " down to " },
        { text: "ambient exit pressure", variableId: "pe" },
        { text: "." },
      ],
      variables: [
        {
          id: "delta_v",
          symbol: "\\Delta v",
          name: "Velocity Increment",
          color: "sapphire",
          role: "Total kinetic velocity change achieved by rocket propellant combustion",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation: "Determines orbital capability and altitude ceiling for spaceflight.",
          telemetryMetricLabel: "Velocity Gain",
        },
        {
          id: "isp",
          symbol: "I_{\\text{sp}}",
          name: "Specific Impulse",
          color: "emerald",
          role: "Thrust generated per unit weight flow rate of liquid propellant (approx 210 seconds for gasoline + LOX)",
          unit: "Seconds (s)",
          dimension: "[T]",
          explanation:
            "Goddard replaced inefficient black powder (Isp approx 50 s) with high-energy liquid propellants (liquid oxygen and gasoline), multiplying propulsion efficiency over 4x.",
          telemetryKey: "chamberPressure",
        },
        {
          id: "g0",
          symbol: "g_0",
          name: "Standard Earth Gravity",
          color: "amber",
          role: "Standard gravitational acceleration at sea level (9.80665 m/s^2)",
          unit: "m/s^2",
          dimension: "[L T^-2]",
          explanation:
            "Standard gravitational conversion constant relating mass flow rate to propellant weight.",
        },
        {
          id: "m0",
          symbol: "m_0",
          name: "Initial Wet Mass",
          color: "cyan",
          role: "Gross mass of rocket including full liquid fuel and oxidizer tanks",
          unit: "Kilograms (kg)",
          dimension: "[M]",
          explanation: "Includes rocket airframe, gyroscopes, and full propellant load.",
        },
        {
          id: "mf",
          symbol: "m_f",
          name: "Burnout Dry Mass",
          color: "coral",
          role: "Remaining structural mass after all propellants have been expended",
          unit: "Kilograms (kg)",
          dimension: "[M]",
          explanation:
            "Goddard pioneered lightweight aluminum alloy construction and multi-staging to minimize burnout mass.",
        },
        {
          id: "ve",
          symbol: "v_e",
          name: "Supersonic Exhaust Velocity",
          color: "crimson",
          role: "Gas velocity emerging from de Laval convergent-divergent nozzle (over 2,000 m/s)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "By shaping the nozzle as a de Laval bell (converging to Mach 1 at the throat, diverging supersonically to Mach 3+ at the exit), Goddard converted combustion heat into supersonic kinetic thrust.",
          telemetryMetricLabel: "Thrust Force",
        },
        {
          id: "tc",
          symbol: "T_c, p_c",
          name: "Combustion Chamber Conditions",
          color: "rose",
          role: "Combustion temperature (2,800 K) and pressure (25 atm) inside the cooled chamber",
          unit: "Kelvin (K) & Atmospheres",
          dimension: "[\\Theta] & [M L^-1 T^-2]",
          explanation: "High chamber pressure forces rapid supersonic expansion across the nozzle.",
        },
        {
          id: "pe",
          symbol: "p_e",
          name: "Nozzle Exit Pressure",
          color: "amethyst",
          role: "Static pressure of exhaust gas as it leaves the nozzle rim",
          unit: "Atmospheres (atm)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Optimal expansion occurs when exit pressure matches external atmospheric pressure.",
        },
      ],
      pedagogicalNote:
        "The New York Times famously ridiculed Goddard in 1920, falsely claiming a rocket could not fly in the vacuum of space without air to 'push against.' Goddard proved that thrust is an internal momentum reaction ($F = \\dot{m} v_e$) requiring zero external atmosphere.",
      claimRef: 1,
      historicalSignificance:
        "US 1155986 proved liquid propulsion, multi-stage rocketry, and supersonic de Laval expansion, laying the foundation for Apollo 11 and modern space exploration.",
    },
  ],

  // The source-facing formula treatment is intentionally deferred with the
  // complete manual edition. The prior LC-tank panel described another Tesla
  // design and must not be displayed for US 593,138.
  "us-593138-tesla-coil": [],

  // 18. Guglielmo Marconi Wireless Telegraphy (US 586,193)
  "us-586193-marconi-radio": [
    {
      id: "marconi-radiation-monopole",
      patentId: "us-586193-marconi-radio",
      title: "Grounded Quarter-Wave Monopole Radiation & Elevated Capacity",
      category: "Wireless Radio & Electromagnetics",
      rawLatex:
        "f_{\\text{res}} = \\frac{1}{2\\pi \\sqrt{L C}} \\quad \\text{and} \\quad P_{\\text{rad}} = 80 \\pi^2 \\left(\\frac{h}{\\lambda}\\right)^2 I_0^2",
      colorizedLatex:
        "\\textcolor{#d97706}{f_{\\text{res}}} = \\frac{1}{2\\pi \\sqrt{\\textcolor{#ea580c}{L} \\textcolor{#0891b2}{C}}} \\quad \\text{and} \\quad \\textcolor{#059669}{P_{\\text{rad}}} = 80 \\pi^2 \\left(\\frac{\\textcolor{#2563eb}{h}}{\\textcolor{#9333ea}{\\lambda}}\\right)^2 \\textcolor{#dc2626}{I_0^2}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "transmission resonant frequency", variableId: "f_res" },
        { text: " is determined by " },
        { text: "aerial mast inductance", variableId: "l_ant" },
        { text: " and " },
        { text: "elevated capacity plate capacitance", variableId: "c_ant" },
        { text: ", radiating " },
        { text: "electromagnetic RF power", variableId: "p_rad" },
        { text: " scaling with " },
        { text: "mast physical height", variableId: "h_eff" },
        { text: " over " },
        { text: "operating wavelength", variableId: "lambda_wave" },
        { text: " and the " },
        { text: "square of spark antenna current", variableId: "i_spark" },
        { text: "." },
      ],
      variables: [
        {
          id: "f_res",
          symbol: "f_{\\text{res}}",
          name: "Antenna Resonant Frequency",
          color: "amber",
          role: "Center radio frequency of electromagnetic Hertzian waves radiated into the ether",
          unit: "Kilohertz (kHz) / Megahertz (MHz)",
          dimension: "[T^-1]",
          explanation: "Determined by the length of the vertical wire and loading coils.",
          telemetryKey: "sparkRateHz",
        },
        {
          id: "l_ant",
          symbol: "L",
          name: "Antenna & Lead Inductance",
          color: "coral",
          role: "Self-inductance of tall vertical copper aerial wire and tuning inductance",
          unit: "Microhenries (\\mu H)",
          dimension: "[M L^2 T^-2 I^-2]",
          explanation: "Increases as aerial mast height is raised.",
        },
        {
          id: "c_ant",
          symbol: "C",
          name: "Elevated Plate Capacitance",
          color: "cyan",
          role: "Capacitance formed between the elevated metal plate and the grounded earth plate",
          unit: "Picofarads (pF)",
          dimension: "[M^-1 L^-2 T^4 I^2]",
          explanation:
            "Marconi suspended large metal sheets or copper nets at the top of wooden masts to increase antenna capacitance.",
        },
        {
          id: "p_rad",
          symbol: "P_{\\text{rad}}",
          name: "Radiated RF Power",
          color: "emerald",
          role: "True electromagnetic wave power radiated through space to distant receiving coherers",
          unit: "Watts (W)",
          dimension: "[M L^2 T^-3]",
          explanation:
            "Radiation resistance scales with (h/\\lambda)^2, proving why tall masts drastically increased transmission range from hundreds of yards to transatlantic distances.",
          telemetryMetricLabel: "Radiated Power",
        },
        {
          id: "h_eff",
          symbol: "h",
          name: "Effective Mast Height",
          color: "sapphire",
          role: "Physical vertical height of elevated antenna wire above ground level",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation: "Doubling mast height quadruples radiation resistance and radiated power.",
        },
        {
          id: "lambda_wave",
          symbol: "\\lambda",
          name: "Radio Wavelength",
          color: "amethyst",
          role: "Wavelength in space (\\lambda = c / f)",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation: "Longer wavelengths (ground waves) follow the curvature of the Earth.",
        },
        {
          id: "i_spark",
          symbol: "I_0^2",
          name: "Peak Antenna Current Squared",
          color: "crimson",
          role: "Oscillating RF current driven into the aerial by induction coil spark discharge",
          unit: "Amperes^2 (A^2)",
          dimension: "[I^2]",
          explanation: "Supplied by Righi multi-sphere spark gaps in oil.",
        },
      ],
      pedagogicalNote:
        "Heinrich Hertz used small laboratory dipole loops that only transmitted a few meters. Marconi connected one side of the spark gap to a tall elevated wire and the other to an earth plate in the ground, inventing the grounded monopole antenna that allowed radio signals to travel across oceans.",
      claimRef: 1,
      historicalSignificance:
        "US 586193 launched commercial wireless communications, ship-to-shore safety (saving Titanic survivors), and global broadcasting.",
    },
  ],

  // 19. Rudolf Diesel Internal Combustion Engine (US 542,846)
  "us-542846-diesel-engine": [
    {
      id: "diesel-compression-ignition",
      patentId: "us-542846-diesel-engine",
      title: "Isentropic Compression Autoignition Temperature & Diesel Cycle Efficiency",
      category: "Thermodynamics & Heat Engines",
      rawLatex:
        "T_2 = T_1 \\cdot r^{\\gamma - 1} \\quad \\text{and} \\quad \\eta_{\\text{diesel}} = 1 - \\frac{1}{r^{\\gamma-1}} \\left[ \\frac{r_c^\\gamma - 1}{\\gamma (r_c - 1)} \\right]",
      colorizedLatex:
        "\\textcolor{#dc2626}{T_2} = \\textcolor{#2563eb}{T_1} \\cdot \\textcolor{#059669}{r}^{\\textcolor{#d97706}{\\gamma - 1}} \\quad \\text{and} \\quad \\textcolor{#9333ea}{\\eta_{\\text{diesel}}} = 1 - \\frac{1}{\\textcolor{#059669}{r}^{\\textcolor{#d97706}{\\gamma-1}}} \\left[ \\frac{\\textcolor{#ea580c}{r_c}^\\gamma - 1}{\\gamma (\\textcolor{#ea580c}{r_c} - 1)} \\right]",
      plainEnglishSentence: [
        { text: "The " },
        { text: "combustion chamber autoignition temperature", variableId: "t2" },
        { text: " is generated from " },
        { text: "intake ambient temperature", variableId: "t1" },
        { text: " by an " },
        { text: "extreme 16:1 compression ratio", variableId: "r_comp" },
        { text: " governed by the " },
        { text: "air specific heat ratio (gamma = 1.4)", variableId: "gamma" },
        { text: ", producing " },
        { text: "record thermal efficiency", variableId: "eta" },
        { text: " determined by " },
        { text: "fuel injection cut-off duration", variableId: "rc" },
        { text: "." },
      ],
      variables: [
        {
          id: "t2",
          symbol: "T_2",
          name: "Top-Dead-Center Air Temperature",
          color: "crimson",
          role: "Extreme compressed air temperature reaching 700 to 900 C (973 to 1173 K) prior to fuel injection",
          unit: "Kelvin (K) / Celsius (C)",
          dimension: "[\\Theta]",
          explanation:
            "Far exceeds the self-ignition temperature of heavy petroleum oil (approx 250 C), so injected fuel instantly atomizes and ignites spontaneously without spark plugs or hot tubes.",
          telemetryMetricLabel: "Chamber Temp",
        },
        {
          id: "t1",
          symbol: "T_1",
          name: "Ambient Intake Temperature",
          color: "sapphire",
          role: "Atmospheric air temperature drawn into cylinder during intake stroke (approx 293 K)",
          unit: "Kelvin (K)",
          dimension: "[\\Theta]",
          explanation:
            "Pure air only is compressed—unlike gasoline engines that compress a fuel-air mixture susceptible to premature knocking/detonation.",
        },
        {
          id: "r_comp",
          symbol: "r",
          name: "Volumetric Compression Ratio",
          color: "emerald",
          role: "Ratio of bottom-dead-center volume to top-dead-center clearance volume (14:1 to 22:1)",
          unit: "Compression ratio (16.0)",
          dimension: "[1]",
          explanation:
            "By compressing pure air alone, Diesel could push compression ratios to 16:1 or higher (compared to 4:1 in 19th-century Otto gasoline engines), doubling thermal efficiency.",
          telemetryKey: "compressionRatio",
        },
        {
          id: "gamma",
          symbol: "\\gamma",
          name: "Specific Heat Ratio (Air)",
          color: "amber",
          role: "Adiabatic index of diatomic air (c_p / c_v = 1.40)",
          unit: "Dimensionless ratio (1.40)",
          dimension: "[1]",
          explanation: "Governs isentropic temperature rise during rapid piston compression.",
        },
        {
          id: "eta",
          symbol: "\\eta_{\\text{diesel}}",
          name: "Brake Thermal Efficiency",
          color: "amethyst",
          role: "Fraction of fuel chemical enthalpy converted into shaft mechanical work (35% to 55%)",
          unit: "Efficiency percentage (%)",
          dimension: "[1]",
          explanation:
            "The Diesel engine became the most thermally efficient heat engine in human history, far surpassing steam engines (10%) and early gasoline engines (20%).",
          telemetryMetricLabel: "Thermal Eff",
        },
        {
          id: "rc",
          symbol: "r_c",
          name: "Fuel Injection Cut-Off Ratio",
          color: "coral",
          role: "Ratio of cylinder volume after fuel injection stops to clearance volume (approx 1.5 to 2.5)",
          unit: "Volume ratio [1.5 - 2.5]",
          dimension: "[1]",
          explanation:
            "Fuel is injected at constant pressure during the initial portion of the power stroke.",
          telemetryKey: "fuelInjectionMg",
        },
      ],
      pedagogicalNote:
        "Rudolf Diesel sought to build an engine that approached the theoretical maximum efficiency of Sadi Carnot's cycle. By compressing pure air until it became red-hot and gradually spraying in heavy oil, he eliminated spark plugs and created the prime mover for global maritime, rail, and freight transport.",
      claimRef: 1,
      historicalSignificance:
        "US 542846 created the high-efficiency compression-ignition engine that powers modern container ships, locomotives, electrical backup grids, and heavy trucking.",
    },
  ],

  // 20. Lester Pelton Split-Bucket Impulse Water Wheel (US 233,692)
  "us-233692-pelton-water-wheel": [
    {
      id: "pelton-impulse-momentum",
      patentId: "us-233692-pelton-water-wheel",
      title: "Euler Double-Cup Splitter Bucket Momentum Reversal & Peak Impulse Work",
      category: "Hydrodynamics & Turbomachinery",
      rawLatex:
        "F_{\\text{bucket}} = \\dot{m} (v_{\\text{jet}} - u)(1 - \\cos\\beta) \\quad \\text{and} \\quad P_{\\text{max}} = \\dot{m} u (v_{\\text{jet}} - u) \\quad (u = \\frac{1}{2} v_{\\text{jet}})",
      colorizedLatex:
        "\\textcolor{#059669}{F_{\\text{bucket}}} = \\textcolor{#0891b2}{\\dot{m}} (\\textcolor{#2563eb}{v_{\\text{jet}}} - \\textcolor{#d97706}{u})(1 - \\textcolor{#9333ea}{\\cos\\beta}) \\quad \\text{and} \\quad \\textcolor{#ea580c}{P_{\\text{max}}} = \\textcolor{#0891b2}{\\dot{m}} \\textcolor{#d97706}{u} (\\textcolor{#2563eb}{v_{\\text{jet}}} - \\textcolor{#d97706}{u})",
      plainEnglishSentence: [
        { text: "The " },
        { text: "impulse thrust force", variableId: "f_bucket" },
        { text: " extracted from the " },
        { text: "high-pressure water mass flow rate", variableId: "m_dot" },
        { text: " equals relative speed between the " },
        { text: "Torricelli jet velocity", variableId: "v_jet" },
        { text: " and " },
        { text: "wheel bucket velocity", variableId: "u_wheel" },
        { text: " multiplied by the " },
        {
          text: "165-degree splitter bucket momentum reversal factor",
          variableId: "beta_angle",
        },
        { text: ", achieving " },
        { text: "peak hydraulic power extraction", variableId: "p_max" },
        { text: " when bucket speed is exactly half the water jet speed." },
      ],
      variables: [
        {
          id: "f_bucket",
          symbol: "F_{\\text{bucket}}",
          name: "Impulse Thrust Force",
          color: "emerald",
          role: "Mechanical force exerted on the rotating runner buckets by the deflected water jet",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "By curving the cup to reverse the water direction nearly 180 degrees ($\\beta \\approx 165^\\circ$), $\\cos(165^\\circ) \\approx -0.966$, so $(1 - \\cos\\beta) \\approx 1.966$—doubling the force compared to a flat paddle (1.0).",
          telemetryMetricLabel: "Bucket Force",
        },
        {
          id: "m_dot",
          symbol: "\\dot{m}",
          name: "Water Mass Flow Rate",
          color: "cyan",
          role: "Mass of water ejected by the nozzle needle per second ($\\rho \\cdot A_{\\text{nozzle}} \\cdot v_{\\text{jet}}$)",
          unit: "Kilograms / second (kg/s)",
          dimension: "[M T^-1]",
          explanation: "Regulated by an adjustable spear needle in the nozzle.",
        },
        {
          id: "v_jet",
          symbol: "v_{\\text{jet}}",
          name: "Torricelli High-Head Jet Velocity",
          color: "sapphire",
          role: "Velocity of high-pressure water jet issuing from nozzle: $v = \\sqrt{2 g H}$",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "From mountain reservoirs with 300 to 1,000 meters of hydraulic head, jet velocities exceed 100 m/s (over 220 mph).",
          telemetryKey: "headPressureMeters",
        },
        {
          id: "u_wheel",
          symbol: "u",
          name: "Bucket Peripheral Velocity",
          color: "amber",
          role: "Linear tangential speed of the bucket pitch circle ($u = \\omega \\cdot r$)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Peak kinetic energy transfer occurs when $u = 0.5 v_{\\text{jet}}$, causing discharged water to drop dead with zero remaining kinetic energy.",
          telemetryKey: "wheelRpm",
        },
        {
          id: "beta_angle",
          symbol: "1 - \\cos\\beta",
          name: "Momentum Reversal Factor",
          color: "amethyst",
          role: "Geometric fluid turning factor of Pelton's split double-cup (approx 1.96)",
          unit: "Deflection multiplier [1.0 to 2.0]",
          dimension: "[1]",
          explanation:
            "Pelton's central splitter ridge cleanly divides the jet into two equal halves, curving them smoothly backwards into side discharge chutes without striking subsequent buckets.",
        },
        {
          id: "p_max",
          symbol: "P_{\\text{max}}",
          name: "Maximum Shaft Output Power",
          color: "coral",
          role: "Rotational mechanical power delivered to mining mills and hydroelectric dynamos",
          unit: "Kilowatts (kW) / Horsepower",
          dimension: "[M L^2 T^-3]",
          explanation:
            "Achieved over 88% hydraulic efficiency in 1880, revolutionizing high-head hydroelectric generation.",
        },
      ],
      pedagogicalNote:
        "Lester Pelton watched a water jet hit a flat paddle in a California gold mine and noticed it merely deflected sideways. When an accidental misalignment caused the jet to hit a curved bucket rim and shoot backwards, the wheel spun twice as fast. Pelton patented the central splitter double-cup that extracts nearly 100% of water kinetic energy.",
      claimRef: 1,
      historicalSignificance:
        "US 233692 is the premier impulse water turbine, driving high-head hydroelectric dams in mountainous regions worldwide.",
    },
  ],

  // 21. Willis Carrier Air Conditioner (US 808,897)
  "us-808897-carrier-air-conditioner": [
    {
      id: "carrier-psychrometric-enthalpy",
      patentId: "us-808897-carrier-air-conditioner",
      title: "Psychrometric Dew-Point Control & Constant Enthalpy Air Conditioning",
      category: "Thermodynamics & Psychrometrics",
      rawLatex:
        "h = c_{pa} T + W (h_{fg0} + c_{pv} T) \\quad \\text{and} \\quad W = 0.622 \\frac{\\phi P_{\\text{sat}}(T)}{P - \\phi P_{\\text{sat}}(T)}",
      colorizedLatex:
        "\\textcolor{#9333ea}{h} = \\textcolor{#2563eb}{c_{pa}} \\textcolor{#dc2626}{T} + \\textcolor{#059669}{W} (\\textcolor{#d97706}{h_{fg0}} + \\textcolor{#0891b2}{c_{pv}} \\textcolor{#dc2626}{T}) \\quad \\text{and} \\quad \\textcolor{#059669}{W} = 0.622 \\frac{\\textcolor{#ea580c}{\\phi} \\textcolor{#0891b2}{P_{\\text{sat}}}}{\\textcolor{#2563eb}{P} - \\textcolor{#ea580c}{\\phi} \\textcolor{#0891b2}{P_{\\text{sat}}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "total moist air mixture enthalpy", variableId: "h_enthalpy" },
        { text: " combines dry air sensible heat with " },
        { text: "specific humidity ratio", variableId: "w_humidity" },
        { text: " latent vaporization heat, controlled by lowering air to its " },
        { text: "exact dew-point temperature", variableId: "t_dry" },
        { text: " via cold water sprays to fix " },
        { text: "relative humidity percentage", variableId: "phi_rh" },
        { text: " against " },
        { text: "saturation vapor pressure", variableId: "p_sat" },
        { text: " and " },
        { text: "total barometric pressure", variableId: "p_baro" },
        { text: "." },
      ],
      variables: [
        {
          id: "h_enthalpy",
          symbol: "h",
          name: "Moist Air Specific Enthalpy",
          color: "amethyst",
          role: "Total thermal energy content (sensible + latent) per kilogram of dry air",
          unit: "Kilojoules / kg (kJ/kg)",
          dimension: "[L^2 T^-2]",
          explanation:
            "Air conditioning controls both sensible temperature (thermometer degrees) and latent enthalpy (moisture vapor content).",
          telemetryMetricLabel: "Air Enthalpy",
        },
        {
          id: "t_dry",
          symbol: "T",
          name: "Dry-Bulb Air Temperature",
          color: "crimson",
          role: "True thermodynamic temperature measured by a shielded thermometer (C / K)",
          unit: "Degrees Celsius (C)",
          dimension: "[\\Theta]",
          explanation: "Sensible heat content of the air stream.",
          telemetryKey: "sprayTempC",
        },
        {
          id: "w_humidity",
          symbol: "W",
          name: "Absolute Humidity Ratio",
          color: "emerald",
          role: "Mass of water vapor per unit mass of dry air (kg water / kg dry air)",
          unit: "Grams H2O / kg dry air",
          dimension: "[1]",
          explanation:
            "Carrier realized that spraying air with cold water paradoxically dehumidifies it by cooling it below its dew point, condensing excess water vapor out into the basin.",
          telemetryMetricLabel: "Moisture Ratio",
        },
        {
          id: "phi_rh",
          symbol: "\\phi",
          name: "Relative Humidity",
          color: "coral",
          role: "Ratio of actual water vapor partial pressure to saturation pressure at current temperature (0 to 100%)",
          unit: "Percentage (%)",
          dimension: "[1]",
          explanation:
            "Maintains exact 55% relative humidity in printing plants and textile mills to prevent paper and yarn distortion.",
          telemetryKey: "airflowCfm",
        },
        {
          id: "p_sat",
          symbol: "P_{\\text{sat}}",
          name: "Saturation Vapor Pressure",
          color: "cyan",
          role: "Thermodynamic equilibrium vapor pressure of water at temperature T (Clausius-Clapeyron equation)",
          unit: "Kilopascals (kPa)",
          dimension: "[M L^-1 T^-2]",
          explanation: "Exponentially drops as air is cooled, forcing moisture condensation.",
        },
        {
          id: "p_baro",
          symbol: "P",
          name: "Barometric Atmospheric Pressure",
          color: "sapphire",
          role: "Standard ambient atmospheric pressure (101.325 kPa / 1 atm)",
          unit: "Kilopascals (kPa)",
          dimension: "[M L^-1 T^-2]",
          explanation: "Total pressure of the nitrogen-oxygen-vapor atmospheric mixture.",
        },
      ],
      pedagogicalNote:
        "Willis Carrier conceived 'Apparatus for Treating Air' while standing on a foggy train platform in Pittsburgh. He realized that if he saturated air with a fine spray of cold water at a controlled temperature, he could fix its dew-point, establishing absolute control over both temperature and humidity.",
      claimRef: 1,
      historicalSignificance:
        "US 808897 established modern psychrometrics, air conditioning, and climate control for semiconductors, pharmaceuticals, skyscrapers, and modern cities.",
    },
  ],

  // 22. Carl von Linde Air Liquefaction (US 727,650)
  "us-727650-linde-air-liquefaction": [
    {
      id: "linde-joule-thomson-liquefaction",
      patentId: "us-727650-linde-air-liquefaction",
      title: "Joule-Thomson Cryogenic Liquefaction & Counter-Current Heat Exchanger",
      category: "Cryogenics & Low-Temperature Physics",
      rawLatex:
        "\\mu_{\\text{JT}} = \\left(\\frac{\\partial T}{\\partial P}\\right)_H = \\frac{1}{C_p}\\left[ T\\left(\\frac{\\partial V}{\\partial T}\\right)_P - V \\right] > 0",
      colorizedLatex:
        "\\textcolor{#059669}{\\mu_{\\text{JT}}} = \\left(\\frac{\\partial \\textcolor{#dc2626}{T}}{\\partial \\textcolor{#2563eb}{P}}\\right)_H = \\frac{1}{\\textcolor{#ea580c}{C_p}}\\left[ \\textcolor{#dc2626}{T}\\left(\\frac{\\partial \\textcolor{#0891b2}{V}}{\\partial \\textcolor{#dc2626}{T}}\\right)_P - \\textcolor{#0891b2}{V} \\right] > 0",
      plainEnglishSentence: [
        { text: "The " },
        { text: "positive Joule-Thomson cooling coefficient", variableId: "mu_jt" },
        { text: " produces a drop in " },
        { text: "cryogenic air temperature", variableId: "temp" },
        { text: " as " },
        { text: "high compressor pressure (200 bar)", variableId: "press" },
        {
          text: " expands isenthalpically through a throttle valve, accumulated continuously via a counter-current heat exchanger to liquefy air at -193 C.",
        },
      ],
      variables: [
        {
          id: "mu_jt",
          symbol: "\\mu_{\\text{JT}}",
          name: "Joule-Thomson Inversion Coefficient",
          color: "emerald",
          role: "Temperature drop per unit pressure drop during throttling expansion ($\\approx +0.25\\text{ K/bar}$ for air below 40 °C)",
          unit: "Kelvin / bar (K/bar)",
          dimension: "[M^-1 L T^2 \\Theta]",
          explanation:
            "For real gases below their inversion temperature, expanding through a porous plug or throttling valve forces molecules to overcome attractive van der Waals intermolecular forces, converting internal thermal kinetic energy into potential energy and dropping gas temperature.",
          telemetryMetricLabel: "JT Coefficient",
        },
        {
          id: "temp",
          symbol: "T",
          name: "Cryogenic Gas Stream Temperature",
          color: "crimson",
          role: "Temperature of compressed air flowing down the inner counter-current tube",
          unit: "Kelvin (K) / Celsius (C)",
          dimension: "[\\Theta]",
          explanation:
            "Progressively cools from 293 K down to 78 K (-195 C) as chilled exhaust gas cools the incoming high-pressure stream.",
        },
        {
          id: "press",
          symbol: "P",
          name: "Inlet Compression Pressure",
          color: "sapphire",
          role: "High-pressure air from multistage compressors (200 atmospheres / 20 MPa)",
          unit: "Bar / Atmospheres",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Compressing to 200 bar and removing compression heat with cooling water prepares the air for throttling expansion.",
          telemetryKey: "inletBar",
        },
        {
          id: "cp_heat",
          symbol: "C_p",
          name: "Isobaric Specific Heat Capacity",
          color: "coral",
          role: "Heat capacity of dense real air at cryogenic temperatures and high pressure",
          unit: "Joules / (kg \\cdot K)",
          dimension: "[L^2 T^-2 \\Theta^-1]",
          explanation: "Relates enthalpy changes to temperature drops during throttling.",
        },
        {
          id: "vol",
          symbol: "V",
          name: "Molar Real-Gas Volume",
          color: "cyan",
          role: "Specific volume of compressed air deviating from ideal gas law",
          unit: "m^3 / mol",
          dimension: "[L^3 N^-1]",
          explanation:
            "For an ideal gas, T (dV/dT)_P - V = 0 and mu_JT = 0. Real molecular attraction makes this term positive, producing cooling.",
        },
      ],
      pedagogicalNote:
        "Carl von Linde recognized that while a single expansion from 200 bar to 1 bar only drops air temperature by about 50 C, feeding the cooled expanded gas backwards through a concentric jacket around the incoming high-pressure line regenerates the cold. Within hours, the temperature drops below -193 C and liquid air cascades from the valve.",
      claimRef: 1,
      historicalSignificance:
        "US 727650 established industrial cryogenics, enabling pure liquid oxygen and nitrogen for steelmaking, rocketry, medicine, and semiconductor manufacturing.",
    },
  ],

  // 23. George Westinghouse Automatic Air Brake (US 124,404)
  "us-124404-westinghouse-air-brake": [
    {
      id: "westinghouse-triple-valve-balance",
      patentId: "us-124404-westinghouse-air-brake",
      title: "Fail-Safe Pneumatic Triple-Valve Differential Pressure & Reservoir Equilibrium",
      category: "Pneumatics & Railroad Safety Mechanics",
      rawLatex:
        "F_{\\text{piston}} = A_{\\text{triple}} \\cdot (P_{\\text{aux}} - P_{\\text{pipe}}) - F_{\\text{spring}}",
      colorizedLatex:
        "\\textcolor{#059669}{F_{\\text{piston}}} = \\textcolor{#9333ea}{A_{\\text{triple}}} \\cdot (\\textcolor{#2563eb}{P_{\\text{aux}}} - \\textcolor{#dc2626}{P_{\\text{pipe}}}) - \\textcolor{#ea580c}{F_{\\text{spring}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "triple-valve actuating force", variableId: "f_piston" },
        { text: " driving the brake shoes equals the " },
        { text: "valve piston area", variableId: "a_triple" },
        { text: " multiplied by the differential between " },
        { text: "auxiliary car reservoir pressure (70 psi)", variableId: "p_aux" },
        { text: " and " },
        { text: "trainline brake pipe pressure", variableId: "p_pipe" },
        { text: " minus " },
        { text: "slide valve return spring resistance", variableId: "f_spring" },
        {
          text: ", guaranteeing that any rupture or line parting instantly triggers emergency braking.",
        },
      ],
      variables: [
        {
          id: "f_piston",
          symbol: "F_{\\text{piston}}",
          name: "Triple-Valve Slide Actuation Force",
          color: "emerald",
          role: "Net pneumatic force shifting the brass slide valve to admit air into the brake cylinder",
          unit: "Newtons (N) / Pounds-force",
          dimension: "[M L T^-2]",
          explanation:
            "When trainline pressure drops, the higher pressure in the auxiliary car tank pushes the piston, opening the port from the tank to the brake cylinder.",
          telemetryMetricLabel: "Brake Clamping Force",
        },
        {
          id: "a_triple",
          symbol: "A_{\\text{triple}}",
          name: "Triple-Valve Piston Area",
          color: "amethyst",
          role: "Effective surface area of the sensitive brass differential piston",
          unit: "Square inches / cm^2",
          dimension: "[L^2]",
          explanation: "Converts small pressure changes into powerful mechanical valve movement.",
        },
        {
          id: "p_aux",
          symbol: "P_{\\text{aux}}",
          name: "Auxiliary Tank Reservoir Pressure",
          color: "sapphire",
          role: "Air storage pressure stored in individual tank under each rail car (approx 70 psi / 4.8 bar)",
          unit: "PSI / Bar",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Each car carries its own dedicated air supply, charged continuously while running.",
          telemetryKey: "auxReservoirPsi",
        },
        {
          id: "p_pipe",
          symbol: "P_{\\text{pipe}}",
          name: "Trainline Brake Pipe Pressure",
          color: "crimson",
          role: "Continuous pneumatic pipe running length of train connected by rubber gladhand hoses",
          unit: "PSI / Bar",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "The engineer vents pipe pressure to apply brakes. If a hose ruptures or cars uncouple, pressure drops to 0 instantly, causing all cars to brake automatically.",
          telemetryKey: "trainlinePsi",
        },
        {
          id: "f_spring",
          symbol: "F_{\\text{spring}}",
          name: "Graduating Spring Resistance",
          color: "coral",
          role: "Precision internal spring providing tactile graduated braking control",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Allows the engineer to make smooth partial service applications without locking wheels.",
        },
      ],
      pedagogicalNote:
        "Early railroad brakes required manual brakemen running atop moving boxcars in blizzards to turn hand wheels, causing horrific collisions. Westinghouse's stroke of genius was the automatic triple valve: pressure keeps the brakes OFF, so any leak, disconnection, or engineer command immediately slams the brakes ON.",
      claimRef: 1,
      historicalSignificance:
        "US 124404 eliminated train derailments and runaway wrecks, allowing heavy freight trains to travel at high speeds across North America and the world.",
    },
  ],

  // 24. Charles Parsons Multi-Stage Reaction Steam Turbine (US 608,969)
  "us-608969-parsons-turbine": [
    {
      id: "parsons-reaction-stage-enthalpy",
      patentId: "us-608969-parsons-turbine",
      title: "Multi-Stage Reaction Steam Expansion & Annular Blade Velocity Ratio",
      category: "Thermodynamics & Turbomachinery",
      rawLatex:
        "\\Delta h_{\\text{stage}} = \\frac{\\Delta h_{\\text{total}}}{N_{\\text{stages}}} \\quad \\text{and} \\quad u_{\\text{blade}} = \\sqrt{2 \\cdot \\Delta h_{\\text{stage}} \\cdot \\eta_{\\text{blade}}}",
      colorizedLatex:
        "\\textcolor{#059669}{\\Delta h_{\\text{stage}}} = \\frac{\\textcolor{#2563eb}{\\Delta h_{\\text{total}}}}{\\textcolor{#dc2626}{N_{\\text{stages}}}} \\quad \\text{and} \\quad \\textcolor{#d97706}{u_{\\text{blade}}} = \\sqrt{2 \\cdot \\textcolor{#059669}{\\Delta h_{\\text{stage}}} \\cdot \\textcolor{#9333ea}{\\eta_{\\text{blade}}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "isentropic enthalpy drop per reaction blade stage", variableId: "dh_stage" },
        { text: " equals " },
        { text: "total boiler-to-condenser expansion enthalpy", variableId: "dh_total" },
        { text: " divided across " },
        { text: "dozens of expanding reaction blade rows (N = 60+)", variableId: "n_stages" },
        { text: ", reducing " },
        { text: "blade peripheral velocity", variableId: "u_blade" },
        { text: " to manageable speeds matching " },
        { text: "internal hydrodynamic reaction efficiency", variableId: "eta_blade" },
        { text: " for direct alternator coupling." },
      ],
      variables: [
        {
          id: "dh_stage",
          symbol: "\\Delta h_{\\text{stage}}",
          name: "Per-Stage Enthalpy Drop",
          color: "emerald",
          role: "Modest pressure and enthalpy drop across each alternating fixed-stator and moving-rotor blade row",
          unit: "Kilojoules / kg (kJ/kg)",
          dimension: "[L^2 T^-2]",
          explanation:
            "Dividing a 1,000 kJ/kg total enthalpy drop across 50 stages yields only 20 kJ/kg per stage, keeping steam velocities well below sonic speeds.",
          telemetryMetricLabel: "Stage Enthalpy Drop",
        },
        {
          id: "dh_total",
          symbol: "\\Delta h_{\\text{total}}",
          name: "Total Steam Expansion Enthalpy",
          color: "sapphire",
          role: "Gross thermal energy available from high-pressure superheated boiler steam to vacuum condenser",
          unit: "Kilojoules / kg (kJ/kg)",
          dimension: "[L^2 T^-2]",
          explanation: "From 15 bar steam down to 0.05 bar condenser vacuum.",
          telemetryKey: "boilerPressureBar",
        },
        {
          id: "n_stages",
          symbol: "N_{\\text{stages}}",
          name: "Number of Expanding Blade Stages",
          color: "crimson",
          role: "Total count of annular ring blade rows progressively widening along the shaft (40 to 100 rows)",
          unit: "Stages (count)",
          dimension: "[1]",
          explanation:
            "As steam expands and specific volume increases, Parsons widened the annular drum diameter and blade lengths to maintain constant axial steam velocity.",
          telemetryMetricLabel: "Blade Stage Count",
        },
        {
          id: "u_blade",
          symbol: "u_{\\text{blade}}",
          name: "Runner Blade Tip Velocity",
          color: "amber",
          role: "Tangential tip velocity of turbine rotor blades (100 to 200 m/s)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Single-stage turbines (like de Laval's) required centrifugal blade speeds of 40,000 RPM which tore steel wheels apart. Parsons multi-staging brought shaft speeds down to 1,500 - 3,000 RPM for direct coupling to electrical dynamos.",
          telemetryKey: "shaftRpm",
        },
        {
          id: "eta_blade",
          symbol: "\\eta_{\\text{blade}}",
          name: "Reaction Blade Stage Efficiency",
          color: "amethyst",
          role: "50% degree of reaction steam foil blade profile efficiency ($\\approx 85\\text{--}90\\%$)",
          unit: "Efficiency percentage (%)",
          dimension: "[1]",
          explanation:
            "Steam expands equally in both stationary nozzles and moving blades, creating smooth fluid-foil reaction thrust without shockwaves.",
        },
      ],
      pedagogicalNote:
        "Gustaf de Laval expanded steam in a single nozzle, producing a supersonic jet that spun his turbine at 40,000 RPM—far too fast for direct mechanical drive. Charles Parsons divided the expansion into dozens of small pressure drops across alternating rings of blades, inventing the modern multi-stage steam turbine that generates over 80% of the world's electricity.",
      claimRef: 1,
      historicalSignificance:
        "US 608969 revolutionized naval propulsion (Turbinia) and electrical power stations, driving steam turbines in coal, gas, and nuclear power plants worldwide today.",
    },
  ],

  // 25. Samuel Colt Revolver (US X9430)
  "us-x9430-colt-revolver": [
    {
      id: "colt-revolver-indexing-kinematics",
      patentId: "us-x9430-colt-revolver",
      title: "Revolver Cylinder Indexing Kinematics & Pawl Torque Transmission",
      category: "Mechanical Engineering & Firearm Mechanisms",
      rawLatex:
        "\\Delta \\theta = \\frac{2\\pi}{N_{\\text{chambers}}} \\quad \\text{and} \\quad \\tau_{\\text{index}} = F_{\\text{hammer}} \\cdot r_{\\text{hand}} \\cdot \\cos\\theta",
      colorizedLatex:
        "\\textcolor{#2563eb}{\\Delta \\theta} = \\frac{2\\pi}{\\textcolor{#dc2626}{N_{\\text{chambers}}}} \\quad \\text{and} \\quad \\textcolor{#059669}{\\tau_{\\text{index}}} = \\textcolor{#d97706}{F_{\\text{hammer}}} \\cdot \\textcolor{#0891b2}{r_{\\text{hand}}} \\cdot \\cos\\textcolor{#9333ea}{\\theta}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "angular indexing step", variableId: "dtheta" },
        { text: " equals a full circle divided by " },
        { text: "cylinder chamber count", variableId: "n_chambers" },
        { text: ", generating " },
        { text: "rotational indexing torque", variableId: "tau_index" },
        { text: " from " },
        { text: "cocking hammer force", variableId: "f_hammer" },
        { text: " through " },
        { text: "pawl lever arm radius", variableId: "r_hand" },
        { text: " at " },
        { text: "pawl ratchet contact angle", variableId: "theta" },
        { text: "." },
      ],
      variables: [
        {
          id: "dtheta",
          symbol: "\\Delta \\theta",
          name: "Angular Indexing Step",
          color: "sapphire",
          role: "Discrete angular rotation step required to bring next chamber into axial bore alignment ($60^\\circ$ for 6-chamber)",
          unit: "Degrees / Radians",
          dimension: "[1]",
          explanation:
            "Advancing one ratchet tooth advances the cylinder by exactly 1/Nth of a turn, locking it in battery alignment with the fixed barrel.",
          telemetryMetricLabel: "Indexing Step",
        },
        {
          id: "n_chambers",
          symbol: "N_{\\text{chambers}}",
          name: "Cylinder Chamber Count",
          color: "crimson",
          role: "Number of bored rotating chambers machined circumferentially around the cylinder (5 to 6 chambers)",
          unit: "Chambers (count)",
          dimension: "[1]",
          explanation:
            "Machined from solid forged steel to withstand detonation pressure in individual rotating chambers.",
        },
        {
          id: "tau_index",
          symbol: "\\tau_{\\text{index}}",
          name: "Cylinder Indexing Torque",
          color: "emerald",
          role: "Rotational turning moment overcoming cylinder inertia and friction detent springs",
          unit: "Newton-meters (N·m)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "Transmitted by the spring-loaded hand pawl engaging ratchet teeth cut into the rear face of the cylinder arbor.",
        },
        {
          id: "f_hammer",
          symbol: "F_{\\text{hammer}}",
          name: "Hammer Cocking Force",
          color: "amber",
          role: "Thumb force applied to the hammer spur during single-action cocking (approx 15 to 25 N)",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Manually drawing back the hammer simultaneously compresses the heavy mainspring and lifts the internal hand pawl.",
          telemetryKey: "cockingForce",
        },
        {
          id: "r_hand",
          symbol: "r_{\\text{hand}}",
          name: "Hand Pawl Pivot Radius",
          color: "cyan",
          role: "Effective radial distance from hammer pivot fulcrum to hand pawl articulation pin",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Geometric moment arm converting angular hammer stroke into vertical pawl thrust.",
        },
        {
          id: "theta",
          symbol: "\\theta",
          name: "Pawl Tangential Contact Angle",
          color: "amethyst",
          role: "Pressure angle between hand pawl tip and ratchet tooth flank ($15^\\circ$ to $30^\\circ$)",
          unit: "Degrees",
          dimension: "[1]",
          explanation:
            "Maintains positive camming engagement to prevent pawl slip under rapid cocking cycles.",
        },
      ],
      pedagogicalNote:
        "Before Colt's 1836 patent, multi-shot firearms required manually turning individual barrels by hand or carrying multiple bulky lock mechanisms. Colt synchronized cylinder rotation, mechanical locking, and hammer cocking into a single thumb stroke.",
      claimRef: 1,
      historicalSignificance:
        "US X9430 created the first practical revolving repeating firearm, transforming small arms manufacturing and pioneering interchangeable parts production at the Colt Hartford Armory.",
    },
  ],

  // 26. Samuel Morse Electro-Magnetic Telegraph (US 1,647)
  "us-1647-morse-telegraph": [
    {
      id: "morse-telegraph-relay-attenuation",
      patentId: "us-1647-morse-telegraph",
      title: "Distributed Transmission Line Current & Solenoid Armature Magnetic Pull",
      category: "Telecommunications & Electromagnetic Signaling",
      rawLatex:
        "I_{\\text{line}}(t) = \\frac{V_{\\text{batt}}}{R_{\\text{line}} + R_{\\text{relay}}} \\left(1 - e^{-t / \\tau}\\right) \\quad \\text{and} \\quad F_{\\text{armature}} = \\frac{(N \\cdot I)^2 \\mu_0 A}{2 g^2}",
      colorizedLatex:
        "\\textcolor{#059669}{I_{\\text{line}}(t)} = \\frac{\\textcolor{#dc2626}{V_{\\text{batt}}}}{\\textcolor{#2563eb}{R_{\\text{line}}} + \\textcolor{#0891b2}{R_{\\text{relay}}}} \\left(1 - e^{-t / \\textcolor{#d97706}{\\tau}}\\right) \\quad \\text{and} \\quad \\textcolor{#ea580c}{F_{\\text{armature}}} = \\frac{(\\textcolor{#9333ea}{N} \\cdot \\textcolor{#059669}{I})^2 \\mu_0 \\textcolor{#0d9488}{A}}{2 \\textcolor{#e11d48}{g^2}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "signal line current", variableId: "i_line" },
        { text: " rises toward steady state from " },
        { text: "battery supply voltage", variableId: "v_batt" },
        { text: " across " },
        { text: "transmission line resistance", variableId: "r_line" },
        { text: " and " },
        { text: "relay coil resistance", variableId: "r_relay" },
        { text: " governed by " },
        { text: "inductive-capacitive time constant", variableId: "tau" },
        { text: ", producing " },
        { text: "electromagnetic armature pull", variableId: "f_arm" },
        { text: " proportional to " },
        { text: "coil turn count squared", variableId: "turns" },
        { text: ", " },
        { text: "core pole area", variableId: "area" },
        { text: ", and inverse " },
        { text: "magnetic air gap squared", variableId: "gap" },
        { text: "." },
      ],
      variables: [
        {
          id: "i_line",
          symbol: "I_{\\text{line}}",
          name: "Signal Line Current",
          color: "emerald",
          role: "Dynamic electric current flowing through the long-distance telegraph circuit",
          unit: "Milliamperes (mA)",
          dimension: "[I]",
          explanation:
            "Weakened by line resistance over dozens of miles, requiring sensitive low-current relay armatures to detect.",
          telemetryMetricLabel: "Line Current",
        },
        {
          id: "v_batt",
          symbol: "V_{\\text{batt}}",
          name: "Battery Supply Potential",
          color: "crimson",
          role: "DC potential generated by chemical Grove or Daniell cells (approx 50 to 100 V)",
          unit: "Volts (V)",
          dimension: "[M L^2 T^-3 I^-1]",
          explanation:
            "Provides the driving EMF to push current through hundreds of miles of iron wire.",
          telemetryKey: "batteryVolts",
        },
        {
          id: "r_line",
          symbol: "R_{\\text{line}}",
          name: "Iron Wire Line Resistance",
          color: "sapphire",
          role: "Distributed series resistance of the outdoor galvanized iron telegraph wire (approx 10 to 20 ohms/mile)",
          unit: "Ohms (Ω)",
          dimension: "[M L^2 T^-3 I^-2]",
          explanation:
            "Longer lines increase total resistance, attenuating signal current below direct register thresholds.",
        },
        {
          id: "r_relay",
          symbol: "R_{\\text{relay}}",
          name: "Relay Electromagnet Resistance",
          color: "cyan",
          role: "Internal DC resistance of the fine copper wire wound onto the relay electromagnet bobbins",
          unit: "Ohms (Ω)",
          dimension: "[M L^2 T^-3 I^-2]",
          explanation:
            "Wound with thousands of turns of fine insulated wire to maximize magnetizing force with minimal current.",
        },
        {
          id: "tau",
          symbol: "\\tau",
          name: "RL/RC Line Time Constant",
          color: "amber",
          role: "Inductive-capacitive rise time constant ($L/R$ or $RC$) of the transmission line",
          unit: "Milliseconds (ms)",
          dimension: "[T]",
          explanation:
            "Limits maximum signaling rate and pulse sharpness across long transatlantic cables and overland lines.",
        },
        {
          id: "f_arm",
          symbol: "F_{\\text{armature}}",
          name: "Armature Mechanical Pull",
          color: "coral",
          role: "Electromagnetic attractive force pulling the soft iron armature lever against its return spring",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Closes the local contact switch, energizing a fresh local battery circuit to stamp paper tape or click a sounder.",
        },
        {
          id: "turns",
          symbol: "N",
          name: "Solenoid Coil Turn Count",
          color: "amethyst",
          role: "Number of wire turns wound on soft iron horseshoe bobbins (1,000 to 5,000 turns)",
          unit: "Turns (count)",
          dimension: "[1]",
          explanation:
            "Multiplying turns compensates for weak milliampere line currents by maintaining high ampere-turns ($N \\cdot I$).",
        },
        {
          id: "area",
          symbol: "A",
          name: "Electromagnet Pole Face Area",
          color: "teal",
          role: "Cross-sectional surface area of the cylindrical soft iron core poles",
          unit: "Square meters (m^2)",
          dimension: "[L^2]",
          explanation: "Focuses magnetic flux density directly across the working air gap.",
        },
        {
          id: "gap",
          symbol: "g",
          name: "Magnetic Working Air Gap",
          color: "rose",
          role: "Physical spacing between soft iron core faces and the pivoted armature (approx 0.5 to 1.5 mm)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Force drops quadratically with distance ($1/g^2$), requiring precision adjustable stop screws.",
        },
      ],
      pedagogicalNote:
        "Before Morse's relay invention, electrical signals could only travel a few miles before wire resistance weakened current to zero. Morse invented the electromechanical relay repeater: a weak distant current trips a delicate armature that switches a fresh local battery into the next link, allowing signals to span continents.",
      claimRef: 1,
      historicalSignificance:
        "US 1647 established the world's first practical telecommunications network and digital information code, inaugurating the electronic communications era and the legal foundations of patentable machines.",
    },
  ],

  // 27. Nikolaus Otto Four-Stroke Gas Engine (US 194,047)
  "us-194047-otto-engine": [
    {
      id: "otto-four-stroke-thermal-efficiency",
      patentId: "us-194047-otto-engine",
      title: "Four-Stroke Otto Cycle Efficiency & Indicated Mean Effective Power",
      category: "Thermodynamics & Internal Combustion",
      rawLatex:
        "\\eta_{\\text{Otto}} = 1 - \\frac{1}{r_c^{\\gamma - 1}} \\quad \\text{and} \\quad P_{\\text{indicated}} = \\frac{\\text{IMEP} \\cdot V_d \\cdot N_{\\text{rpm}}}{120}",
      colorizedLatex:
        "\\textcolor{#059669}{\\eta_{\\text{Otto}}} = 1 - \\frac{1}{\\textcolor{#2563eb}{r_c}^{\\textcolor{#d97706}{\\gamma - 1}}} \\quad \\text{and} \\quad \\textcolor{#dc2626}{P_{\\text{indicated}}} = \\frac{\\textcolor{#0891b2}{\\text{IMEP}} \\cdot \\textcolor{#9333ea}{V_d} \\cdot \\textcolor{#ea580c}{N_{\\text{rpm}}}}{120}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "Otto thermodynamic cycle efficiency", variableId: "eta_otto" },
        { text: " scales with " },
        { text: "pre-ignition compression ratio", variableId: "r_c" },
        { text: " governed by " },
        { text: "air specific heat ratio", variableId: "gamma" },
        { text: ", delivering " },
        { text: "indicated mechanical power", variableId: "p_ind" },
        { text: " proportional to " },
        { text: "indicated mean effective pressure", variableId: "imep" },
        { text: ", " },
        { text: "swept displacement volume", variableId: "v_d" },
        { text: ", and " },
        { text: "crankshaft RPM", variableId: "n_rpm" },
        { text: " across two revolutions per power stroke." },
      ],
      variables: [
        {
          id: "eta_otto",
          symbol: "\\eta_{\\text{Otto}}",
          name: "Ideal Otto Thermal Efficiency",
          color: "emerald",
          role: "Theoretical upper bound of thermal conversion efficiency for a 4-stroke spark ignition gas cycle",
          unit: "Efficiency percentage (%)",
          dimension: "[1]",
          explanation:
            "Otto proved that pre-compressing the air-fuel mixture prior to ignition dramatically multiplies thermodynamic efficiency compared to non-compression Lenoir atmospheric engines.",
          telemetryMetricLabel: "Otto Efficiency",
        },
        {
          id: "r_c",
          symbol: "r_c",
          name: "Volumetric Compression Ratio",
          color: "sapphire",
          role: "Ratio of cylinder maximum volume at BDC to clearance volume at TDC ($r_c = 4.5\\text{ to }6.0$)",
          unit: "Compression ratio (r:1)",
          dimension: "[1]",
          explanation:
            "Pre-compressing charge gas raises mixture density and accelerates deflagration velocity, quadrupling work output.",
          telemetryKey: "compressionRatio",
        },
        {
          id: "gamma",
          symbol: "\\gamma",
          name: "Specific Heat Ratio (Air)",
          color: "amber",
          role: "Ratio of constant pressure to constant volume specific heats ($C_p / C_v \\approx 1.40$ for diatomic air)",
          unit: "Dimensionless ratio (1.40)",
          dimension: "[1]",
          explanation:
            "Governs isentropic temperature and pressure rise during the rapid mechanical compression stroke.",
        },
        {
          id: "p_ind",
          symbol: "P_{\\text{indicated}}",
          name: "Indicated Power Output",
          color: "crimson",
          role: "Gross mechanical shaft power developed in cylinder combustion chamber before mechanical friction losses",
          unit: "Kilowatts (kW) / Horsepower (HP)",
          dimension: "[M L^2 T^-3]",
          explanation:
            "Calculated with a 120 divisor because a four-stroke engine executes one power stroke for every two complete crank revolutions ($720^\\circ$).",
          telemetryMetricLabel: "Indicated Power",
        },
        {
          id: "imep",
          symbol: "\\text{IMEP}",
          name: "Indicated Mean Effective Pressure",
          color: "cyan",
          role: "Average effective combustion pressure acting on piston crown throughout power stroke (4 to 8 bar)",
          unit: "Bar / Pascals",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Determined from the enclosed area of the indicator $P\\text{--}V$ card diagram.",
        },
        {
          id: "v_d",
          symbol: "V_d",
          name: "Swept Cylinder Displacement",
          color: "amethyst",
          role: "Swept cylinder volume displaced by piston stroke ($V_d = \\frac{\\pi}{4} D^2 \\cdot S$)",
          unit: "Liters / Cubic meters",
          dimension: "[L^3]",
          explanation: "Product of bore cross-sectional area and crankshaft stroke length.",
        },
        {
          id: "n_rpm",
          symbol: "N_{\\text{rpm}}",
          name: "Crankshaft Rotational Speed",
          color: "coral",
          role: "Rotational velocity of the engine output shaft and inertial flywheels (150 to 300 RPM)",
          unit: "Revolutions per minute (RPM)",
          dimension: "[T^-1]",
          explanation:
            "Stabilized across the three non-power strokes by dual heavy cast-iron flywheels.",
          telemetryKey: "engineRpm",
        },
      ],
      pedagogicalNote:
        "Earlier gas engines (like Lenoir's) ignited gas at atmospheric pressure, achieving under 5% thermal efficiency and consuming exorbitant fuel. Nikolaus Otto invented the four-stroke cycle: Intake, Compression, Power, and Exhaust. Pre-compressing the mixture prior to ignition jumped efficiency to over 20%, creating the modern internal combustion engine.",
      claimRef: 1,
      historicalSignificance:
        "US 194047 established the universal four-stroke 'Otto cycle' that powers billions of automobiles, motorcycles, aircraft, and generators across human history.",
    },
  ],

  // 28. Thomas Edison Phonograph (US 200,521)
  "us-200521-edison-phonograph": [
    {
      id: "edison-acoustic-indentation-groove",
      patentId: "us-200521-edison-phonograph",
      title: "Acoustic Diaphragm Pressure Coupling & Continuous Helical Tracking Velocity",
      category: "Acoustics & Sound Recording",
      rawLatex:
        "F_{\\text{stylus}} = P_{\\text{acoustic}} \\cdot A_{\\text{diaphragm}} \\quad \\text{and} \\quad v_{\\text{surface}} = 2\\pi r_{\\text{cylinder}} \\cdot \\frac{N_{\\text{rpm}}}{60}",
      colorizedLatex:
        "\\textcolor{#059669}{F_{\\text{stylus}}} = \\textcolor{#dc2626}{P_{\\text{acoustic}}} \\cdot \\textcolor{#2563eb}{A_{\\text{diaphragm}}} \\quad \\text{and} \\quad \\textcolor{#d97706}{v_{\\text{surface}}} = 2\\pi \\textcolor{#0891b2}{r_{\\text{cylinder}}} \\cdot \\frac{\\textcolor{#9333ea}{N_{\\text{rpm}}}}{60}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "stylus mechanical indentation force", variableId: "f_stylus" },
        { text: " equals " },
        { text: "acoustic wave sound pressure", variableId: "p_ac" },
        { text: " across " },
        { text: "flexible diaphragm surface area", variableId: "a_diaph" },
        { text: ", recording undulating marks at " },
        { text: "tangential surface speed", variableId: "v_surf" },
        { text: " governed by " },
        { text: "cylinder mandrel radius", variableId: "r_cyl" },
        { text: " and " },
        { text: "hand-crank rotational RPM", variableId: "n_rpm" },
        { text: "." },
      ],
      variables: [
        {
          id: "f_stylus",
          symbol: "F_{\\text{stylus}}",
          name: "Stylus Indentation Force",
          color: "emerald",
          role: "Dynamic mechanical force exerted by the steel point into the yielding tinfoil surface",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Vibrations of the mica diaphragm push the stylus into the foil, indenting depth variations proportional to instantaneous sound wave amplitude.",
          telemetryMetricLabel: "Stylus Force",
        },
        {
          id: "p_ac",
          symbol: "P_{\\text{acoustic}}",
          name: "Acoustic Wave Sound Pressure",
          color: "crimson",
          role: "Alternating atmospheric air pressure variations generated by human speech into the speaking funnel",
          unit: "Pascals (Pa)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Speech sound waves funnel into the speaking tube, exerting pressure fluctuations against the diaphragm.",
        },
        {
          id: "a_diaph",
          symbol: "A_{\\text{diaphragm}}",
          name: "Acoustic Diaphragm Area",
          color: "sapphire",
          role: "Surface area of the circular clamped mica diaphragm disc (approx 40 to 50 mm diameter)",
          unit: "Square meters (m^2)",
          dimension: "[L^2]",
          explanation:
            "Acts as a mechanical transformer, collecting low-pressure acoustic energy over a broad disc and concentrating it onto a sharp point.",
        },
        {
          id: "v_surf",
          symbol: "v_{\\text{surface}}",
          name: "Tangential Surface Velocity",
          color: "amber",
          role: "Linear circumferential speed of the rotating tinfoil cylinder surface relative to the fixed stylus (approx 0.15 to 0.25 m/s)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Determines temporal frequency resolution: higher surface speed spreads sound waveform cycles over greater groove distance.",
          telemetryKey: "surfaceSpeed",
        },
        {
          id: "r_cyl",
          symbol: "r_{\\text{cylinder}}",
          name: "Mandrel Cylinder Radius",
          color: "cyan",
          role: "Outer radius of the spiral-grooved brass mandrel cylinder ($r \\approx 25.4\\text{ mm} \\approx 1.0\\text{ inch}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Machined with 10 spiral grooves per inch matching the shaft lead screw pitch.",
        },
        {
          id: "n_rpm",
          symbol: "N_{\\text{rpm}}",
          name: "Mandrel Rotational Speed",
          color: "amethyst",
          role: "Rotational cranking speed of the cylinder arbor (60 to 80 RPM)",
          unit: "Revolutions per minute (RPM)",
          dimension: "[T^-1]",
          explanation:
            "Maintained steady by a hand crank or flywheel to preserve audio playback pitch and tempo.",
          telemetryKey: "crankRpm",
        },
      ],
      pedagogicalNote:
        "Thomas Edison was testing an automatic telegraph repeater when he noticed the paper tape made humming sounds as it whirred beneath a steel reed. He immediately sketched a grooved cylinder wrapped in tinfoil, spoke 'Mary had a little lamb' into the diaphragm, and successfully played back the first recorded human voice in history.",
      claimRef: 1,
      historicalSignificance:
        "US 200521 introduced sound recording and reproduction to humanity, creating the music recording industry, magnetic audio, optical discs, and speech synthesis.",
    },
  ],

  // 29. Joseph Glidden Barbed Wire (US 157,124)
  "us-157124-glidden-barbed-wire": [
    {
      id: "glidden-torsional-interlock-friction",
      patentId: "us-157124-glidden-barbed-wire",
      title: "Dual-Strand Torsional Friction Interlock & Tensile Breaking Load",
      category: "Materials Science & Mechanical Metallurgy",
      rawLatex:
        "\\tau_{\\text{lock}} = 2\\pi \\mu F_{\\text{tension}} r_{\\text{strand}} \\quad \\text{and} \\quad F_{\\text{break}} = 2 \\cdot \\sigma_{\\text{yield}} \\cdot A_{\\text{wire}}",
      colorizedLatex:
        "\\textcolor{#059669}{\\tau_{\\text{lock}}} = 2\\pi \\textcolor{#dc2626}{\\mu} \\textcolor{#2563eb}{F_{\\text{tension}}} \\textcolor{#0891b2}{r_{\\text{strand}}} \\quad \\text{and} \\quad \\textcolor{#ea580c}{F_{\\text{break}}} = 2 \\cdot \\textcolor{#9333ea}{\\sigma_{\\text{yield}}} \\cdot \\textcolor{#d97706}{A_{\\text{wire}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "torsional locking resistance against barb rotation", variableId: "tau_lock" },
        { text: " scales with " },
        { text: "friction coefficient", variableId: "mu" },
        { text: ", " },
        { text: "span tensile preload force", variableId: "f_tension" },
        { text: ", and " },
        { text: "wire strand radius", variableId: "r_strand" },
        { text: ", while " },
        { text: "fence breaking strength", variableId: "f_break" },
        { text: " doubles through dual-strand " },
        { text: "steel yield stress", variableId: "sigma_yield" },
        { text: " across " },
        { text: "wire cross-sectional area", variableId: "a_wire" },
        { text: "." },
      ],
      variables: [
        {
          id: "tau_lock",
          symbol: "\\tau_{\\text{lock}}",
          name: "Barb Torsional Locking Torque",
          color: "emerald",
          role: "Torsional resistance holding short spur wire firmly perpendicular to prevent slipping or rotation",
          unit: "Newton-meters (N·m)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "Twisting the secondary strand around the carrier creates normal clamping force, locking the coiled barb into its permanent radial orientation.",
          telemetryMetricLabel: "Locking Torque",
        },
        {
          id: "mu",
          symbol: "\\mu",
          name: "Inter-Strand Friction Coefficient",
          color: "crimson",
          role: "Static coefficient of friction between galvanized carbon steel wire surfaces ($\\mu \\approx 0.35$)",
          unit: "Dimensionless friction factor",
          dimension: "[1]",
          explanation:
            "Frictional contact between coiled barb wire and twisted long strands prevents longitudinal sliding along the fence line.",
        },
        {
          id: "f_tension",
          symbol: "F_{\\text{tension}}",
          name: "Fence Line Tensile Preload",
          color: "sapphire",
          role: "Longitudinal tension applied between fence posts by the twisting key (1,000 to 1,800 N)",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Tightening the wire keeps spans taut across 10-meter post spacings through seasonal temperature variations.",
          telemetryKey: "fenceTensionN",
        },
        {
          id: "r_strand",
          symbol: "r_{\\text{strand}}",
          name: "Wire Strand Radius",
          color: "cyan",
          role: "Radius of standard 12-gauge carbon steel fence wire ($r \\approx 1.25\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Geometric radius defining the moment arm of inter-strand torsional clamping contact.",
        },
        {
          id: "f_break",
          symbol: "F_{\\text{break}}",
          name: "Ultimate Breaking Strength",
          color: "coral",
          role: "Maximum tensile load before wire fracture under livestock impact (over 4,000 N / 900 lbf)",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Dual twisted strands share cattle impact loads equally, preventing fence failure.",
        },
        {
          id: "sigma_yield",
          symbol: "\\sigma_{\\text{yield}}",
          name: "Steel Yield Tensile Strength",
          color: "amethyst",
          role: "Tensile yield point of cold-drawn carbon fence wire ($\\approx 450\\text{ to }550\\text{ MPa}$)",
          unit: "Megapascals (MPa)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Cold drawing during manufacture aligns steel grain structure, tripling tensile strength over soft iron.",
        },
        {
          id: "a_wire",
          symbol: "A_{\\text{wire}}",
          name: "Single Strand Cross-Sectional Area",
          color: "amber",
          role: "Cross-sectional area of individual 12-gauge wire ($A = \\pi r^2 \\approx 4.9\\text{ mm}^2$)",
          unit: "Square millimeters (mm^2)",
          dimension: "[L^2]",
          explanation:
            "Two parallel strands provide a combined structural cross section of nearly 10 mm².",
        },
      ],
      pedagogicalNote:
        "Earlier barbed wire attempts wrapped barbs around a single wire, but the barbs slipped along the line or rotated when cattle leaned against them. Joseph Glidden bent the barb around one strand and twisted a second strand tightly around it, locking the barbs permanently in place without soldering or welding.",
      claimRef: 1,
      historicalSignificance:
        "US 157124 enclosed the Great Plains, transformed American agriculture and ranching, and established modern high-tensile wire manufacturing.",
    },
  ],

  // 30. Elias Howe Sewing Machine (US 4,750)
  "us-4750-howe-sewing-machine": [
    {
      id: "howe-lockstitch-capstan-tension",
      patentId: "us-4750-howe-sewing-machine",
      title: "Two-Thread Lockstitch Capstan Friction Equilibrium & Seam Throughput",
      category: "Precision Mechanics & Textile Automation",
      rawLatex:
        "T_{\\text{upper}} \\cdot e^{\\mu \\pi} = T_{\\text{lower}} \\cdot e^{\\mu \\pi} \\quad \\text{and} \\quad v_{\\text{seam}} = \\frac{\\text{SPM}}{60} \\cdot p_{\\text{pitch}}",
      colorizedLatex:
        "\\textcolor{#2563eb}{T_{\\text{upper}}} \\cdot e^{\\textcolor{#dc2626}{\\mu} \\pi} = \\textcolor{#059669}{T_{\\text{lower}}} \\cdot e^{\\textcolor{#dc2626}{\\mu} \\pi} \\quad \\text{and} \\quad \\textcolor{#d97706}{v_{\\text{seam}}} = \\frac{\\textcolor{#9333ea}{\\text{SPM}}}{60} \\cdot \\textcolor{#ea580c}{p_{\\text{pitch}}}",
      plainEnglishSentence: [
        { text: "The two-thread lockstitch knot is centered at fabric equilibrium by balancing " },
        { text: "upper needle thread tension", variableId: "t_upper" },
        { text: " and " },
        { text: "lower shuttle thread tension", variableId: "t_lower" },
        { text: " over " },
        { text: "fabric capstan friction coefficient", variableId: "mu" },
        { text: ", delivering " },
        { text: "continuous linear seam throughput", variableId: "v_seam" },
        { text: " determined by " },
        { text: "sewing cadence SPM", variableId: "spm" },
        { text: " and " },
        { text: "stitch feed pitch", variableId: "p_pitch" },
        { text: "." },
      ],
      variables: [
        {
          id: "t_upper",
          symbol: "T_{\\text{upper}}",
          name: "Upper Needle Thread Tension",
          color: "sapphire",
          role: "Tensile force applied to top spool thread by the dynamic take-up lever (approx 1.5 to 3.0 N)",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Cinched tight as the needle ascends, pulling the interloop knot into the center of the cloth thickness.",
          telemetryMetricLabel: "Upper Tension",
        },
        {
          id: "t_lower",
          symbol: "T_{\\text{lower}}",
          name: "Lower Shuttle Bobbin Tension",
          color: "emerald",
          role: "Restraining friction tension on bobbin thread passing through the shuttle body (approx 1.5 to 3.0 N)",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Regulated by a small leaf spring on the shuttle casing to match upper tension exactly.",
          telemetryMetricLabel: "Shuttle Tension",
        },
        {
          id: "mu",
          symbol: "\\mu",
          name: "Capstan Thread-Fabric Friction",
          color: "crimson",
          role: "Friction coefficient of thread wrapping around fabric fibers ($\\mu \\approx 0.20\\text{ to }0.35$)",
          unit: "Dimensionless friction factor",
          dimension: "[1]",
          explanation:
            "Locks the interlocked knot stationary once drawn into the fabric, preventing unraveling if adjacent stitches are cut.",
        },
        {
          id: "v_seam",
          symbol: "v_{\\text{seam}}",
          name: "Linear Seam Throughput Velocity",
          color: "amber",
          role: "Finished linear sewing speed along the fabric joint (over 0.0125 m/s = 75 cm/min)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Produced finished garments 10 to 14 times faster than experienced hand seamstresses.",
          telemetryKey: "sewingSpeedMpm",
        },
        {
          id: "spm",
          symbol: "\\text{SPM}",
          name: "Crankshaft Sewing Cadence",
          color: "amethyst",
          role: "Reciprocating cycles executed per minute by curved needle arm and shuttle (250 to 350 SPM)",
          unit: "Stitches per minute (SPM)",
          dimension: "[T^-1]",
          explanation:
            "Driven smoothly by a hand wheel or foot treadle via internal harmonic face cams.",
          telemetryKey: "stitchesPerMin",
        },
        {
          id: "p_pitch",
          symbol: "p_{\\text{pitch}}",
          name: "Stitch Feed Pitch Spacing",
          color: "coral",
          role: "Linear advance distance of the fabric baster plate per needle cycle (2.0 to 3.5 mm)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Set by the ratchet feed mechanism advancing the fabric toothed plate between stitches.",
        },
      ],
      pedagogicalNote:
        "Previous inventors tried to replicate hand sewing by pushing an entire needle all the way through cloth, which required constantly unthreading and rethreading. Howe placed the eye at the needle tip, passed a loop of thread through the cloth, and shot a shuttle with a second bobbin thread through that loop, inventing the two-thread lockstitch.",
      claimRef: 1,
      historicalSignificance:
        "US 4750 mechanized the global garment industry and created the modern 'Sewing Machine Combination' (1856), the first patent pool in commercial history.",
    },
  ],

  // 31. Richard Gatling Revolving Battery Gun (US 36,836)
  "us-36836-gatling-gun": [
    {
      id: "gatling-rotary-firing-cadence",
      patentId: "us-36836-gatling-gun",
      title: "Multi-Barrel Rotary Firing Cadence & Cam Bolt Acceleration",
      category: "Mechanical Engineering & Armament Mechanisms",
      rawLatex:
        "\\text{Cadence}_{\\text{RPM}} = N_{\\text{barrels}} \\cdot \\left(\\frac{\\omega_{\\text{crank}}}{2\\pi}\\right) \\cdot 60 \\quad \\text{and} \\quad a_{\\text{bolt}}(\\theta) = \\omega^2 \\frac{d^2 z}{d\\theta^2}",
      colorizedLatex:
        "\\textcolor{#059669}{\\text{Cadence}_{\\text{RPM}}} = \\textcolor{#dc2626}{N_{\\text{barrels}}} \\cdot \\left(\\frac{\\textcolor{#2563eb}{\\omega_{\\text{crank}}}}{2\\pi}\\right) \\cdot 60 \\quad \\text{and} \\quad \\textcolor{#d97706}{a_{\\text{bolt}}(\\theta)} = \\textcolor{#2563eb}{\\omega}^2 \\frac{d^2 \\textcolor{#9333ea}{z}}{d\\textcolor{#ea580c}{\\theta}^2}",
      plainEnglishSentence: [
        { text: "The sustained " },
        { text: "rotary firing cadence RPM", variableId: "cadence" },
        { text: " multiplies " },
        { text: "barrel cluster count", variableId: "n_barrels" },
        { text: " by " },
        { text: "hand-crank angular rotational frequency", variableId: "omega_crank" },
        { text: ", while " },
        { text: "reciprocating bolt axial acceleration", variableId: "a_bolt" },
        { text: " along the stationary cylindrical cam is governed by " },
        { text: "cam track axial displacement", variableId: "z" },
        { text: " over " },
        { text: "cluster angular rotation angle", variableId: "theta" },
        { text: "." },
      ],
      variables: [
        {
          id: "cadence",
          symbol: "\\text{Cadence}_{\\text{RPM}}",
          name: "Continuous Firing Cadence",
          color: "emerald",
          role: "Total cyclic rate of automatic fire sustained by the rotating barrel cluster (200 to 600 rounds/min)",
          unit: "Rounds per minute (RPM)",
          dimension: "[T^-1]",
          explanation:
            "Dividing fire across multiple rotating barrels multiplies rate of fire without overheating any single barrel.",
          telemetryMetricLabel: "Cadence RPM",
        },
        {
          id: "n_barrels",
          symbol: "N_{\\text{barrels}}",
          name: "Rotating Barrel Count",
          color: "crimson",
          role: "Number of rifled steel barrels mounted circumferentially around the central drive shaft (6 barrels)",
          unit: "Barrels (count)",
          dimension: "[1]",
          explanation:
            "Each barrel possesses its own independent reciprocating breech lock, cartridge carrier slot, and striker.",
        },
        {
          id: "omega_crank",
          symbol: "\\omega_{\\text{crank}}",
          name: "Drive Crank Angular Speed",
          color: "sapphire",
          role: "Manual rotation speed of the side operating crank ($1.0\\text{ to }2.0\\text{ rev/s} \\approx 2\\pi\\text{ to }4\\pi\\text{ rad/s}$)",
          unit: "Radians / second (rad/s)",
          dimension: "[T^-1]",
          explanation:
            "Step-up bevel gears (3:1 ratio) accelerate barrel cluster rotation for effortless rapid operation.",
          telemetryKey: "crankRpm",
        },
        {
          id: "a_bolt",
          symbol: "a_{\\text{bolt}}(\\theta)",
          name: "Bolt Axial Acceleration",
          color: "amber",
          role: "Linear acceleration of the breech bolt sliding forward and backward inside the rotor housing",
          unit: "Meters / second squared (m/s^2)",
          dimension: "[L T^-2]",
          explanation:
            "Contoured cycloidal cam ramps smoothly load, lock, and extract cartridges without binding or shock loads.",
        },
        {
          id: "z",
          symbol: "z(\\theta)",
          name: "Cam Track Axial Profile",
          color: "amethyst",
          role: "Helical spiral cam groove machined inside the stationary outer casing guide sleeve",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Guides bolt lugs through the 5 pipelined stages: gravity feed, chambering, locking/firing, extraction, and ejection.",
        },
        {
          id: "theta",
          symbol: "\\theta",
          name: "Rotor Cluster Rotation Angle",
          color: "coral",
          role: "Continuous angular position of the main central drive shaft ($0^\\circ\\text{ to }360^\\circ$)",
          unit: "Degrees / Radians",
          dimension: "[1]",
          explanation:
            "Firing occurs deterministically at the $180^\\circ$ lowest vertical position, directing recoil downward.",
        },
      ],
      pedagogicalNote:
        "Richard Gatling created the mechanical grandfather of modern computing pipelining. In a single revolution of the barrel cluster, each of the 6 barrels simultaneously executes a different stage of the firing cycle: Barrel 1 is feeding, Barrel 2 is chambering, Barrel 3 is cocking, Barrel 4 is firing, Barrel 5 is extracting, and Barrel 6 is ejecting.",
      claimRef: 1,
      historicalSignificance:
        "US 36836 introduced multi-barrel rotary automatic fire, directly originating the modern M61 Vulcan, GAU-8 Avenger, and Phalanx CIWS rotary cannons.",
    },
  ],

  // 32. Hiram Maxim Automatic Machine Gun (US 319,596)
  "us-319596-maxim-machine-gun": [
    {
      id: "maxim-recoil-momentum-toggle",
      patentId: "us-319596-maxim-machine-gun",
      title: "Short-Recoil Linear Momentum Conservation & Collinear Toggle Locking",
      category: "Mechanical Engineering & Automatic Armaments",
      rawLatex:
        "m_{\\text{recoil}} v_{\\text{recoil}} = m_{\\text{bullet}} v_{\\text{muzzle}} + m_{\\text{gas}} v_{\\text{gas}} \\quad \\text{and} \\quad F_{\\text{lock}} = \\frac{F_{\\text{transverse}}}{\\tan\\theta} \\to \\infty",
      colorizedLatex:
        "\\textcolor{#2563eb}{m_{\\text{recoil}}} \\textcolor{#059669}{v_{\\text{recoil}}} = \\textcolor{#dc2626}{m_{\\text{bullet}}} \\textcolor{#d97706}{v_{\\text{muzzle}}} + \\textcolor{#0891b2}{m_{\\text{gas}}} \\textcolor{#9333ea}{v_{\\text{gas}}} \\quad \\text{and} \\quad \\textcolor{#ea580c}{F_{\\text{lock}}} = \\frac{\\textcolor{#0d9488}{F_{\\text{transverse}}}}{\\tan\\textcolor{#e11d48}{\\theta}} \\to \\infty",
      plainEnglishSentence: [
        { text: "Total rearward " },
        { text: "moving recoil mass", variableId: "m_rec" },
        { text: " momentum at " },
        { text: "recoil barrel velocity", variableId: "v_rec" },
        { text: " balances forward " },
        { text: "bullet mass", variableId: "m_bullet" },
        { text: " at " },
        { text: "muzzle exit velocity", variableId: "v_muzzle" },
        { text: " plus " },
        { text: "propellant gas mass", variableId: "m_gas" },
        { text: " at " },
        { text: "gas velocity", variableId: "v_gas" },
        { text: ", while " },
        { text: "axial breech lock strength", variableId: "f_lock" },
        { text: " safely contains chamber pressure with " },
        { text: "transverse cam force", variableId: "f_trans" },
        { text: " until the " },
        { text: "toggle joint angle", variableId: "theta" },
        { text: " breaks collinear alignment." },
      ],
      variables: [
        {
          id: "m_rec",
          symbol: "m_{\\text{recoil}}",
          name: "Moving Recoil Group Mass",
          color: "sapphire",
          role: "Combined mass of the rifled barrel, barrel extension, and breech frame (approx $3.2\\text{ kg}$)",
          unit: "Kilograms (kg)",
          dimension: "[M]",
          explanation:
            "Recoils rearward $19\\text{ mm}$ upon discharge, transferring kinetic energy to the crank and fusee spring.",
          telemetryMetricLabel: "Recoil Mass",
        },
        {
          id: "v_rec",
          symbol: "v_{\\text{recoil}}",
          name: "Rearward Barrel Velocity",
          color: "emerald",
          role: "Instantaneous backward speed of the barrel group during recoil ($v \\approx 2.5\\text{ m/s}$)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Drives the external crank arm against the hydraulic buffer and spiral fusee spring.",
          telemetryKey: "recoilVelocityMps",
        },
        {
          id: "m_bullet",
          symbol: "m_{\\text{bullet}}",
          name: "Lead Bullet Mass",
          color: "crimson",
          role: "Mass of standard military .450 or .303 projectile ($0.014\\text{ kg} = 215\\text{ grains}$)",
          unit: "Kilograms (kg)",
          dimension: "[M]",
          explanation:
            "Accelerated down the rifled barrel by expanding cordite/black powder propellant gases.",
        },
        {
          id: "v_muzzle",
          symbol: "v_{\\text{muzzle}}",
          name: "Bullet Muzzle Velocity",
          color: "amber",
          role: "Velocity of the projectile exiting the muzzle crown ($v \\approx 620\\text{ to }740\\text{ m/s}$)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Provides the primary forward momentum component generating rearward recoil reaction impulse.",
        },
        {
          id: "m_gas",
          symbol: "m_{\\text{gas}}",
          name: "Propellant Powder Gas Mass",
          color: "cyan",
          role: "Mass of ignited chemical gunpowder charge ($\\approx 0.0045\\text{ kg}$)",
          unit: "Kilograms (kg)",
          dimension: "[M]",
          explanation:
            "High-pressure gas expanding through the muzzle booster cone exerts supplementary rocket thrust.",
        },
        {
          id: "v_gas",
          symbol: "v_{\\text{gas}}",
          name: "Propellant Gas Ejection Speed",
          color: "amethyst",
          role: "Effective sonic exhaust speed of expanding combustion gases exiting the muzzle ($\\approx 1,100\\text{ m/s}$)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation: "Captured by the muzzle booster hood to accelerate recoil cycling rate.",
        },
        {
          id: "f_lock",
          symbol: "F_{\\text{lock}}",
          name: "Axial Breech Locking Strength",
          color: "coral",
          role: "Theoretical axial compressive resistance of the collinear toggle joint (over $20\\text{ kN}$)",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Because the toggle links are in straight $180^\\circ$ alignment at battery, combustion pressure cannot force the breech open until the frame recoils into the unlocking cam.",
        },
        {
          id: "f_trans",
          symbol: "F_{\\text{transverse}}",
          name: "Cam Trip Unlocking Force",
          color: "teal",
          role: "Perpendicular force applied by the curved frame ramp to trip the toggle elbow out of dead center",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Trips the toggle joint after the bullet has safely cleared the muzzle and chamber pressure has dropped to atmospheric.",
        },
        {
          id: "theta",
          symbol: "\\theta",
          name: "Toggle Articulation Angle",
          color: "rose",
          role: "Angle between toggle arms and horizontal bore axis ($\\theta = 0^\\circ$ locked, $\\theta = 60^\\circ$ open)",
          unit: "Degrees",
          dimension: "[1]",
          explanation:
            "As $\\theta \\to 0^\\circ$, mechanical advantage approaches infinity, allowing a light steel link to hold heavy chamber pressure.",
        },
      ],
      pedagogicalNote:
        "Before Hiram Maxim's 1884 patent, machine guns required manual hand cranking (Gatling, Gardner, Nordenfelt). Maxim realized that every bullet produces a violent recoil kick that bruised soldiers' shoulders. He engineered a mechanism that captures that wasted recoil kick to automatically unlock, extract, eject, feed a canvas belt, and fire—creating the first fully automatic weapon in history.",
      claimRef: 1,
      historicalSignificance:
        "US 319596 created the world's first fully automatic firearm, reshaping 20th-century warfare and establishing recoil-operated automatic loading principles used across modern weaponry.",
    },
  ],

  // 33. Eli Whitney Cotton Gin (US X72)
  "us-x72-whitney-cotton-gin": [
    {
      id: "whitney-fiber-extraction-shear",
      patentId: "us-x72-whitney-cotton-gin",
      title: "Saw Tooth Fiber Separation Tensile Threshold & Clearer Brush Velocity",
      category: "Agricultural Machinery & Mechanical Processing",
      rawLatex:
        "F_{\\text{tooth}} > \\tau_{\\text{bond}} \\cdot A_{\\text{contact}} \\quad \\text{and} \\quad \\omega_{\\text{brush}} = \\omega_{\\text{saw}} \\cdot \\text{Ratio}_{\\text{gear}} \\cdot \\left(\\frac{r_{\\text{saw}}}{r_{\\text{brush}}}\\right)",
      colorizedLatex:
        "\\textcolor{#059669}{F_{\\text{tooth}}} > \\textcolor{#dc2626}{\\tau_{\\text{bond}}} \\cdot \\textcolor{#2563eb}{A_{\\text{contact}}} \\quad \\text{and} \\quad \\textcolor{#d97706}{\\omega_{\\text{brush}}} = \\textcolor{#0891b2}{\\omega_{\\text{saw}}} \\cdot \\textcolor{#9333ea}{\\text{Ratio}_{\\text{gear}}} \\cdot \\left(\\frac{\\textcolor{#ea580c}{r_{\\text{saw}}}}{\\textcolor{#0d9488}{r_{\\text{brush}}}}\\right)",
      plainEnglishSentence: [
        { text: "The wire " },
        { text: "tooth pulling tensile force", variableId: "f_tooth" },
        { text: " separates cotton lint when it exceeds " },
        { text: "seed epidermal bond shear strength", variableId: "tau_bond" },
        { text: " across " },
        { text: "fiber lock contact area", variableId: "a_contact" },
        { text: ", while " },
        { text: "counter-rotating clearer brush speed", variableId: "omega_brush" },
        { text: " is accelerated from " },
        { text: "saw cylinder speed", variableId: "omega_saw" },
        { text: " by " },
        { text: "step-up gear ratio", variableId: "ratio_gear" },
        { text: " and " },
        { text: "saw radius", variableId: "r_saw" },
        { text: " over " },
        { text: "brush cylinder radius", variableId: "r_brush" },
        { text: "." },
      ],
      variables: [
        {
          id: "f_tooth",
          symbol: "F_{\\text{tooth}}",
          name: "Wire Tooth Tensile Pull Force",
          color: "emerald",
          role: "Tensile drawing force applied by the forward-hooked steel wire tooth to snag and drag cotton lint fibers",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Because cotton fiber tensile strength exceeds seed coat adhesion, fibers are cleanly plucked through the grate slots without snapping.",
          telemetryMetricLabel: "Tooth Pull Force",
        },
        {
          id: "tau_bond",
          symbol: "\\tau_{\\text{bond}}",
          name: "Seed-to-Fiber Bond Shear Strength",
          color: "crimson",
          role: "Interfacial adhesion bond shear strength anchoring chalazal fiber roots to the cottonseed coat",
          unit: "Megapascals (MPa)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Green-seed upland cotton adheres tightly to seeds, resisting separation until mechanical shear pulls it free.",
        },
        {
          id: "a_contact",
          symbol: "A_{\\text{contact}}",
          name: "Fiber Lock Contact Surface Area",
          color: "sapphire",
          role: "Microscopic interfacial surface area of the engaged fiber tuft at the tooth throat",
          unit: "Square millimeters (mm^2)",
          dimension: "[L^2]",
          explanation:
            "Multiple fibers bundle into a lock that wraps over the tooth hook as it passes the grate slot.",
        },
        {
          id: "omega_brush",
          symbol: "\\omega_{\\text{brush}}",
          name: "Clearer Brush Angular Velocity",
          color: "amber",
          role: "Rotational speed of the counter-rotating bristle clearer cylinder ($320\\text{ to }480\\text{ RPM}$)",
          unit: "Revolutions per minute (RPM)",
          dimension: "[T^-1]",
          explanation:
            "Spins 4 times faster than the saw cylinder in the contrary direction, sweeping lint off teeth and generating an air draft.",
          telemetryKey: "brushRpm",
        },
        {
          id: "omega_saw",
          symbol: "\\omega_{\\text{saw}}",
          name: "Saw Cylinder Rotational Speed",
          color: "cyan",
          role: "Operating speed of the main toothed cylinder ($80\\text{ to }120\\text{ RPM}$)",
          unit: "Revolutions per minute (RPM)",
          dimension: "[T^-1]",
          explanation:
            "Turned by manual crank or water wheel to draw fibers through the stationary slotted breastwork.",
          telemetryKey: "cylinderRpm",
        },
        {
          id: "ratio_gear",
          symbol: "\\text{Ratio}_{\\text{gear}}",
          name: "Step-Up Spur Gear Ratio",
          color: "amethyst",
          role: "Speed-increasing spur geartrain ratio connecting the saw arbor to the clearer arbor ($i = 4.0$)",
          unit: "Gear ratio (4:1)",
          dimension: "[1]",
          explanation:
            "Accelerates the horsehair bristles to create high relative tangential velocity against the tooth backs.",
        },
        {
          id: "r_saw",
          symbol: "r_{\\text{saw}}",
          name: "Saw Cylinder Outer Radius",
          color: "coral",
          role: "Radius of the wooden toothed roller cylinder ($r \\approx 100\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Carries annular rows of wire teeth matching the spacing of the breastwork rib slots.",
        },
        {
          id: "r_brush",
          symbol: "r_{\\text{brush}}",
          name: "Clearer Brush Cylinder Radius",
          color: "teal",
          role: "Outer tip radius of the horsehair clearer brush cylinder ($r \\approx 75\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Intersects the saw perimeter with tight clearance to flick fibers free without jamming.",
        },
      ],
      pedagogicalNote:
        "Before Eli Whitney's 1794 patent, separating short-staple green-seed cotton from its sticky seeds required a full day of arduous manual labor to produce a single pound of clean lint. Whitney combined a toothed cylinder, narrow slotted breastwork ribs that blocked seeds, and a 4x-faster clearer brush—allowing one worker to clean 50 pounds of cotton per day.",
      claimRef: 1,
      historicalSignificance:
        "US X72 mechanized cotton processing, caused a 50-fold surge in American agricultural exports, and fundamentally transformed the economic history of the United States.",
    },
  ],

  // 34. Elisha Graves Otis Safety Elevator (US 31,128)
  "us-31128-otis-elevator": [
    {
      id: "otis-safety-leaf-spring-arrest",
      patentId: "us-31128-otis-elevator",
      title: "Hoisting Cable Rupture Spring Decompression & Cam Pawl Arrest Kinetics",
      category: "Structural Safety & Vertical Transportation",
      rawLatex:
        "F_{\\text{pawl}} = k_{\\text{leaf}} \\cdot \\Delta y_{\\text{cable}} \\quad \\text{and} \\quad t_{\\text{snap}} = \\frac{\\pi}{2} \\sqrt{\\frac{m_{\\text{pawl}}}{k_{\\text{leaf}}}} < 0.040\\text{ s}",
      colorizedLatex:
        "\\textcolor{#059669}{F_{\\text{pawl}}} = \\textcolor{#dc2626}{k_{\\text{leaf}}} \\cdot \\textcolor{#2563eb}{\\Delta y_{\\text{cable}}} \\quad \\text{and} \\quad \\textcolor{#d97706}{t_{\\text{snap}}} = \\frac{\\pi}{2} \\sqrt{\\frac{\\textcolor{#0891b2}{m_{\\text{pawl}}}}{\\textcolor{#dc2626}{k_{\\text{leaf}}}}} < 0.040\\text{ s}",
      plainEnglishSentence: [
        { text: "If the hoisting cable snaps, loss of cable tension releases " },
        { text: "transverse pawl thrust force", variableId: "f_pawl" },
        { text: " from " },
        { text: "heavy leaf spring stiffness", variableId: "k_leaf" },
        { text: " across " },
        { text: "cable rupture vertical displacement", variableId: "dy_cable" },
        { text: ", snapping the safety catches into ratchet racks within a " },
        { text: "mechanical arrest snap time", variableId: "t_snap" },
        { text: " governed by " },
        { text: "safety catch inertial mass", variableId: "m_pawl" },
        { text: " in under 40 milliseconds." },
      ],
      variables: [
        {
          id: "f_pawl",
          symbol: "F_{\\text{pawl}}",
          name: "Lateral Safety Pawl Thrust Force",
          color: "emerald",
          role: "Dynamic horizontal force driving the forged iron pawl teeth into the hoistway vertical ratchet racks (over $2.4\\text{ kN}$)",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Released instantly by the heavy wagon-type leaf spring when hoisting rope tension drops to zero.",
          telemetryMetricLabel: "Pawl Thrust Force",
        },
        {
          id: "k_leaf",
          symbol: "k_{\\text{leaf}}",
          name: "Transverse Leaf Spring Stiffness",
          color: "crimson",
          role: "Spring rate of the laminated oil-tempered steel leaf spring ($k \\approx 80\\text{ kN/m}$)",
          unit: "Newtons / meter (N/m)",
          dimension: "[M T^-2]",
          explanation:
            "Pre-loaded in bowed deflection by the weight of the hoisted elevator car during normal travel.",
          telemetryKey: "springDeflectionMm",
        },
        {
          id: "dy_cable",
          symbol: "\\Delta y_{\\text{cable}}",
          name: "Cable Rupture Vertical Release Travel",
          color: "sapphire",
          role: "Vertical upward snap deflection of the spring center as tension relaxes ($\\Delta y \\approx 30\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Transmitted via dual vertical tie-rods to the bellcrank rocker arms pivoting the pawls outward.",
        },
        {
          id: "t_snap",
          symbol: "t_{\\text{snap}}",
          name: "Mechanical Arrest Snap Time",
          color: "amber",
          role: "Total time required for pawls to engage the nearest ratchet tooth root ($t < 40\\text{ ms}$)",
          unit: "Milliseconds (ms)",
          dimension: "[T]",
          explanation:
            "Because engagement occurs in under 40 milliseconds, the car drops less than 1 cm, eliminating dangerous impact shock loads.",
        },
        {
          id: "m_pawl",
          symbol: "m_{\\text{pawl}}",
          name: "Pivoted Safety Pawl Inertial Mass",
          color: "cyan",
          role: "Effective mass of the forged iron safety pawls and bellcrank rocker linkages ($\\approx 3.5\\text{ kg}$)",
          unit: "Kilograms (kg)",
          dimension: "[M]",
          explanation:
            "Low linkage inertia ensures near-instantaneous mechanical acceleration under spring release.",
        },
      ],
      pedagogicalNote:
        "Before Elisha Otis, elevators were terrifying death traps because if the hoisting rope frayed and snapped, the cab plummeted in free fall. At the 1854 New York Crystal Palace exhibition, Otis stood on an elevated platform, ordered the suspension rope slashed with an axe, and safely remained suspended in midair as his spring catches locked into the guide racks.",
      claimRef: 1,
      historicalSignificance:
        "US 31128 made passenger elevators safe for human transport, enabling high-density multi-story architecture and creating the modern skyscraper metropolis.",
    },
  ],

  // 35. Elihu Thomson Electric Resistance Welding (US 347,140)
  "us-347140-thomson-welding": [
    {
      id: "thomson-resistance-weld-joule-heat",
      patentId: "us-347140-thomson-welding",
      title: "Contact Interface Joule Heating & Low-Voltage High-Current Transformer Step-Down",
      category: "Electrical Engineering & Industrial Metallurgy",
      rawLatex:
        "\\dot{Q}_{\\text{weld}} = I_{\\text{sec}}^2 \\cdot R_{\\text{interface}} \\cdot t_{\\text{pulse}} \\quad \\text{and} \\quad I_{\\text{sec}} = I_{\\text{pri}} \\cdot \\left(\\frac{N_{\\text{pri}}}{N_{\\text{sec}}}\\right)",
      colorizedLatex:
        "\\textcolor{#059669}{\\dot{Q}_{\\text{weld}}} = \\textcolor{#dc2626}{I_{\\text{sec}}^2} \\cdot \\textcolor{#2563eb}{R_{\\text{interface}}} \\cdot \\textcolor{#d97706}{t_{\\text{pulse}}} \\quad \\text{and} \\quad \\textcolor{#dc2626}{I_{\\text{sec}}} = \\textcolor{#0891b2}{I_{\\text{pri}}} \\cdot \\left(\\frac{\\textcolor{#9333ea}{N_{\\text{pri}}}}{\\textcolor{#ea580c}{N_{\\text{sec}}}}\\right)",
      plainEnglishSentence: [
        { text: "Localized " },
        { text: "weld interface thermal fusion energy", variableId: "q_weld" },
        { text: " is generated by " },
        { text: "heavy secondary weld current squared", variableId: "i_sec" },
        { text: " across " },
        { text: "asperity contact interface resistance", variableId: "r_inter" },
        { text: " over " },
        { text: "weld pulse duration", variableId: "t_pulse" },
        { text: ", with the step-down transformer multiplying " },
        { text: "primary line current", variableId: "i_pri" },
        { text: " by " },
        { text: "primary coil winding turns", variableId: "n_pri" },
        { text: " over " },
        { text: "single secondary loop turns", variableId: "n_sec" },
        { text: "." },
      ],
      variables: [
        {
          id: "q_weld",
          symbol: "\\dot{Q}_{\\text{weld}}",
          name: "Interface Thermal Fusion Energy",
          color: "emerald",
          role: "Total Joule thermal heat concentrated at the abutted metal junction (approx $15\\text{ to }40\\text{ kJ}$)",
          unit: "Joules (J) / Kilowatts (kW)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "Raises the abutted metal faces to incandescent plastic forging temperatures ($>1,200^\\circ\\text{C}$) in 1 to 2 seconds.",
          telemetryMetricLabel: "Thermal Weld Energy",
        },
        {
          id: "i_sec",
          symbol: "I_{\\text{sec}}",
          name: "Heavy Secondary Welding Current",
          color: "crimson",
          role: "High-magnitude alternating current flowing through the joint loop ($2,000\\text{ to }10,000\\text{ A}$ at $1.5\\text{ V}$)",
          unit: "Amperes (A)",
          dimension: "[I]",
          explanation:
            "Because heating scales with $I^2$, stepping current up into thousands of amperes generates intense localized fusion in seconds.",
          telemetryKey: "weldCurrentAmps",
        },
        {
          id: "r_inter",
          symbol: "R_{\\text{interface}}",
          name: "Asperity Contact Interface Resistance",
          color: "sapphire",
          role: "Electrical contact resistance across microscopic surface peaks ($R \\approx 0.5\\text{ to }2.0\\text{ m}\\Omega$)",
          unit: "Milliohms (mΩ)",
          dimension: "[M L^2 T^-3 I^-2]",
          explanation:
            "Constriction of current through micro-contact peaks funnels current density past $10^5\\text{ A/cm}^2$, concentrating heat at the seam.",
        },
        {
          id: "t_pulse",
          symbol: "t_{\\text{pulse}}",
          name: "Weld Current Pulse Duration",
          color: "amber",
          role: "Conduction time during which primary AC current is applied ($0.5\\text{ to }2.0\\text{ s}$)",
          unit: "Seconds (s)",
          dimension: "[T]",
          explanation:
            "Terminated automatically by the jaw displacement cutoff switch once plastic upset deformation is achieved.",
          telemetryKey: "weldTimeSec",
        },
        {
          id: "i_pri",
          symbol: "I_{\\text{pri}}",
          name: "Primary Supply Current",
          color: "cyan",
          role: "Alternating current drawn from standard line voltage mains ($15\\text{ to }40\\text{ A}$ at $220\\text{ V}$)",
          unit: "Amperes (A)",
          dimension: "[I]",
          explanation: "Drives the primary winding of the laminated silicon-steel transformer.",
        },
        {
          id: "n_pri",
          symbol: "N_{\\text{pri}}",
          name: "Primary Coil Turn Count",
          color: "amethyst",
          role: "Number of wire turns wound on the primary transformer bobbin ($N_{\\text{pri}} \\approx 200\\text{ turns}$)",
          unit: "Turns (count)",
          dimension: "[1]",
          explanation: "Sets the high-to-low transformer transformation ratio.",
        },
        {
          id: "n_sec",
          symbol: "N_{\\text{sec}}",
          name: "Secondary Loop Turn Count",
          color: "coral",
          role: "Single massive solid copper cast bar forming one complete secondary circuit turn ($N_{\\text{sec}} = 1\\text{ turn}$)",
          unit: "Turns (count = 1)",
          dimension: "[1]",
          explanation:
            "Eliminates internal resistance in the secondary, ensuring all voltage drop occurs at the workpiece weld joint.",
        },
      ],
      pedagogicalNote:
        "Before Elihu Thomson's 1886 patent, joining metal required forge heating in a blacksmith fire or brazing with flux. Thomson passed thousands of amperes of low-voltage electricity through the joint itself; because contact resistance is highest where the metals touch, intense heat concentrated right at the seam, fusing the metals together under mechanical pressure in seconds.",
      claimRef: 1,
      historicalSignificance:
        "US 347140 invented electric resistance welding (butt, spot, and seam welding), which is used today to assemble every modern automobile unibody chassis, airplane frame, and battery tab in the world.",
    },
  ],

  // 36. Cyrus McCormick Grain Reaper (US X8277)
  "us-x8277-mccormick-reaper": [
    {
      id: "mccormick-reaper-sickle-kinematics",
      patentId: "us-x8277-mccormick-reaper",
      title: "Reciprocating Sickle Cutting Dynamics & Grain Reel Intake Cadence",
      category: "Agricultural Machinery & Harvester Kinematics",
      rawLatex:
        "v_{\\text{blade}}(t) = \\omega_{\\text{pitman}} r_{\\text{crank}} \\sin(\\omega t) \\quad \\text{and} \\quad \\dot{A}_{\\text{reap}} = v_{\\text{draft}} \\cdot w_{\\text{cutterbar}}",
      colorizedLatex:
        "\\textcolor{#059669}{v_{\\text{blade}}(t)} = \\textcolor{#2563eb}{\\omega_{\\text{pitman}}} \\textcolor{#d97706}{r_{\\text{crank}}} \\sin(\\textcolor{#2563eb}{\\omega} t) \\quad \\text{and} \\quad \\textcolor{#dc2626}{\\dot{A}_{\\text{reap}}} = \\textcolor{#0891b2}{v_{\\text{draft}}} \\cdot \\textcolor{#9333ea}{w_{\\text{cutterbar}}}",
      plainEnglishSentence: [
        { text: "The reciprocating " },
        { text: "sickle blade cutting velocity", variableId: "v_blade" },
        { text: " follows sinusoidal " },
        { text: "pitman crank angular speed", variableId: "omega_pit" },
        { text: " and " },
        { text: "crank throw radius", variableId: "r_crank" },
        { text: ", delivering continuous " },
        { text: "acreage harvesting rate", variableId: "a_reap" },
        { text: " proportional to " },
        { text: "horse team draft speed", variableId: "v_draft" },
        { text: " across " },
        { text: "cutterbar cutting width", variableId: "w_bar" },
        { text: "." },
      ],
      variables: [
        {
          id: "v_blade",
          symbol: "v_{\\text{blade}}(t)",
          name: "Instantaneous Sickle Blade Speed",
          color: "emerald",
          role: "Harmonic reciprocating linear velocity of the serrated steel cutter bar sliding through stationary guard fingers",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Shears standing grain stalks cleanly against guard finger ledger edges without mashing or knocking grain heads loose.",
          telemetryMetricLabel: "Sickle Velocity",
        },
        {
          id: "omega_pit",
          symbol: "\\omega_{\\text{pitman}}",
          name: "Pitman Crank Angular Velocity",
          color: "sapphire",
          role: "Rotational speed of the sickle-driving pitman crank shaft, geared 10:1 from the main ground traction wheel",
          unit: "Radians / second (rad/s)",
          dimension: "[T^-1]",
          explanation:
            "Converts ground wheel forward rolling into rapid reciprocating lateral cutting motion.",
          telemetryKey: "crankRpm",
        },
        {
          id: "r_crank",
          symbol: "r_{\\text{crank}}",
          name: "Pitman Crank Throw Radius",
          color: "amber",
          role: "Eccentric crank throw radius ($r \\approx 38\\text{ mm} \\approx 1.5\\text{ inches}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Produces a 76 mm total stroke length, carrying each serrated blade section across two adjacent guard fingers.",
        },
        {
          id: "a_reap",
          symbol: "\\dot{A}_{\\text{reap}}",
          name: "Harvesting Area Coverage Rate",
          color: "crimson",
          role: "Continuous land area reaped per unit time (over 10 to 12 acres per working day)",
          unit: "Acres / hour / (m^2/s)",
          dimension: "[L^2 T^-1]",
          explanation:
            "Multiplied harvesting productivity five-fold over manual cradling and scythe reaping.",
          telemetryMetricLabel: "Harvest Rate",
        },
        {
          id: "v_draft",
          symbol: "v_{\\text{draft}}",
          name: "Team Horse Draft Velocity",
          color: "cyan",
          role: "Forward walking speed of the horse team ($v \\approx 1.1\\text{ to }1.4\\text{ m/s} \\approx 2.5\\text{ to }3.0\\text{ mph}$)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Provides the tractive motive force turning the ribbed cast-iron ground drive wheel.",
          telemetryKey: "groundSpeedMps",
        },
        {
          id: "w_bar",
          symbol: "w_{\\text{cutterbar}}",
          name: "Cutterbar Cutting Width",
          color: "amethyst",
          role: "Transverse span of the finger cutterbar ($w \\approx 1.5\\text{ to }1.8\\text{ m} \\approx 5\\text{ to }6\\text{ feet}$)",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation: "Cuts a wide swath of standing grain in a single continuous pass.",
        },
      ],
      pedagogicalNote:
        "Before Cyrus McCormick's 1834 patent, harvesting grain was the great bottleneck of agriculture: wheat had to be hand-cut with sickles and scythes within a narrow 10-day window before stalks rotted or shed grain. McCormick combined a reciprocating serrated sickle, guard fingers that held stalks upright, and a revolving reel that swept cut grain onto a collection deck—allowing one machine to do the work of five men.",
      claimRef: 1,
      historicalSignificance:
        "US X8277 revolutionized global agriculture, prevented worldwide famine, enabled the settlement of the American Midwest, and founded the International Harvester empire.",
    },
  ],

  // 37. Thomas Davenport Electric Motor (US 132)
  "us-132-davenport-electric-motor": [
    {
      id: "davenport-motor-electromagnetic-torque",
      patentId: "us-132-davenport-electric-motor",
      title: "Electromagnetic Commutator Polarity Switching & Rotary Armature Torque",
      category: "Electrical Engineering & Motive Power",
      rawLatex:
        "\\tau_{\\text{motor}} = 2 \\cdot N_{\\text{poles}} \\cdot B_{\\text{stator}} \\cdot I_{\\text{armature}} \\cdot A_{\\text{coil}} \\cdot |\\sin\\theta| \\quad \\text{and} \\quad P_{\\text{shaft}} = \\tau \\cdot \\omega",
      colorizedLatex:
        "\\textcolor{#059669}{\\tau_{\\text{motor}}} = 2 \\cdot \\textcolor{#dc2626}{N_{\\text{poles}}} \\cdot \\textcolor{#2563eb}{B_{\\text{stator}}} \\cdot \\textcolor{#0891b2}{I_{\\text{armature}}} \\cdot \\textcolor{#d97706}{A_{\\text{coil}}} \\cdot |\\sin\\textcolor{#9333ea}{\\theta}| \\quad \\text{and} \\quad \\textcolor{#ea580c}{P_{\\text{shaft}}} = \\textcolor{#059669}{\\tau} \\cdot \\textcolor{#0d9488}{\\omega}",
      plainEnglishSentence: [
        { text: "The rotary " },
        { text: "electromagnetic turning torque", variableId: "tau_mot" },
        { text: " scales with " },
        { text: "rotor pole count", variableId: "n_poles" },
        { text: ", " },
        { text: "stator magnetic flux density", variableId: "b_stat" },
        { text: ", " },
        { text: "commutated armature coil current", variableId: "i_arm" },
        { text: ", and " },
        { text: "armature coil area", variableId: "a_coil" },
        { text: " across " },
        { text: "rotor shaft rotation angle", variableId: "theta" },
        { text: ", delivering " },
        { text: "mechanical shaft power", variableId: "p_shaft" },
        { text: " at " },
        { text: "armature angular velocity", variableId: "omega" },
        { text: "." },
      ],
      variables: [
        {
          id: "tau_mot",
          symbol: "\\tau_{\\text{motor}}",
          name: "Electromagnetic Motor Torque",
          color: "emerald",
          role: "Rotational turning moment developed on the central drive spindle ($0.5\\text{ to }1.8\\text{ N·m}$)",
          unit: "Newton-meters (N·m)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "Produced by continuous magnetic attraction and repulsion between the revolving electromagnets and the fixed curved stator poles.",
          telemetryMetricLabel: "Motor Torque",
        },
        {
          id: "n_poles",
          symbol: "N_{\\text{poles}}",
          name: "Rotor Armature Pole Count",
          color: "crimson",
          role: "Number of salient wire-wound soft iron electromagnet cross-arms mounted on the spindle ($N = 2\\text{ to }4$)",
          unit: "Poles (count)",
          dimension: "[1]",
          explanation:
            "Four cross-arms produce balanced, four-quadrant rotary torque with minimal dead-center cogging.",
        },
        {
          id: "b_stat",
          symbol: "B_{\\text{stator}}",
          name: "Stator Magnetic Flux Density",
          color: "sapphire",
          role: "Fixed radial magnetic field generated by the outer semicircular permanent/battery magnets ($B \\approx 0.3\\text{ to }0.6\\text{ T}$)",
          unit: "Tesla (T)",
          dimension: "[M T^-2 I^-1]",
          explanation:
            "Establishes the stationary magnetic field through which the rotor pole shoes sweep.",
          telemetryKey: "statorFluxTesla",
        },
        {
          id: "i_arm",
          symbol: "I_{\\text{armature}}",
          name: "Commutated Armature Current",
          color: "cyan",
          role: "DC electric current supplied from primary chemical battery cells through commutator segment plates ($2\\text{ to }5\\text{ A}$)",
          unit: "Amperes (A)",
          dimension: "[I]",
          explanation:
            "Inverted twice per revolution by the split copper commutator ring to keep torque positive.",
          telemetryKey: "armatureCurrentAmps",
        },
        {
          id: "a_coil",
          symbol: "A_{\\text{coil}}",
          name: "Electromagnet Coil Area",
          color: "amber",
          role: "Enclosed cross-sectional area of wire wound onto the soft iron core arms ($A \\approx 20\\text{ to }40\\text{ cm}^2$)",
          unit: "Square meters (m^2)",
          dimension: "[L^2]",
          explanation:
            "Maximizes magnetic dipole moment $\\vec{m} = N I A$ within the compact wooden frame.",
        },
        {
          id: "theta",
          symbol: "\\theta",
          name: "Rotor Angular Position Angle",
          color: "amethyst",
          role: "Angular orientation of the rotor arms relative to the stator magnetic neutral plane ($0^\\circ\\text{ to }360^\\circ$)",
          unit: "Degrees / Radians",
          dimension: "[1]",
          explanation:
            "Torque peaks when poles are perpendicular to the stator axis ($|\\sin\\theta| = 1$).",
        },
        {
          id: "p_shaft",
          symbol: "P_{\\text{shaft}}",
          name: "Mechanical Shaft Power Output",
          color: "coral",
          role: "Useful mechanical rotary power delivered to driving pulleys or model locomotives (approx $15\\text{ to }45\\text{ Watts}$)",
          unit: "Watts (W)",
          dimension: "[M L^2 T^-3]",
          explanation:
            "First practical demonstration of commercial mechanical work produced purely by electricity.",
          telemetryMetricLabel: "Shaft Power",
        },
        {
          id: "omega",
          symbol: "\\omega",
          name: "Armature Rotational Velocity",
          color: "teal",
          role: "Rotational speed of the output spindle ($100\\text{ to }300\\text{ RPM} \\approx 10\\text{ to }31\\text{ rad/s}$)",
          unit: "Radians / second (rad/s)",
          dimension: "[T^-1]",
          explanation:
            "Self-regulated by back-EMF opposing the chemical battery voltage as speed increases.",
          telemetryKey: "motorRpm",
        },
      ],
      pedagogicalNote:
        "Thomas Davenport, a blacksmith from Brandon, Vermont, sold his wife's wedding dress to buy an electromagnet from Joseph Henry. He realized that if he split the copper contact ring so that current flipped polarity every half-turn, magnetic repulsion would spin the shaft continuously. In 1837, he received US Patent 132—the first patent for an electric motor in history.",
      claimRef: 1,
      historicalSignificance:
        "US 132 proved that electricity could produce continuous rotary mechanical motion, establishing the electrical machine industry that powers all modern vehicles, appliances, and industrial drives.",
    },
  ],

  // 38. John Ericsson Screw Propeller (US 588)
  "us-588-ericsson-propeller": [
    {
      id: "ericsson-propeller-hydrodynamic-thrust",
      patentId: "us-588-ericsson-propeller",
      title: "Hydrodynamic Screw Thrust & Axial Momentum Velocity Slip",
      category: "Marine Engineering & Fluid Dynamics",
      rawLatex:
        "T_{\\text{thrust}} = \\rho_{\\text{water}} \\cdot A_{\\text{disc}} \\cdot v_{\\text{ship}} (p_{\\text{pitch}} \\cdot n_{\\text{shaft}} - v_{\\text{ship}}) \\quad \\text{and} \\quad s_{\\text{slip}} = 1 - \\frac{v_{\\text{ship}}}{p_{\\text{pitch}} \\cdot n_{\\text{shaft}}}",
      colorizedLatex:
        "\\textcolor{#059669}{T_{\\text{thrust}}} = \\textcolor{#0891b2}{\\rho_{\\text{water}}} \\cdot \\textcolor{#2563eb}{A_{\\text{disc}}} \\cdot \\textcolor{#d97706}{v_{\\text{ship}}} (\\textcolor{#dc2626}{p_{\\text{pitch}}} \\cdot \\textcolor{#9333ea}{n_{\\text{shaft}}} - \\textcolor{#d97706}{v_{\\text{ship}}}) \\quad \\text{and} \\quad \\textcolor{#ea580c}{s_{\\text{slip}}} = 1 - \\frac{\\textcolor{#d97706}{v_{\\text{ship}}}}{\\textcolor{#dc2626}{p_{\\text{pitch}}} \\cdot \\textcolor{#9333ea}{n_{\\text{shaft}}}}",
      plainEnglishSentence: [
        { text: "Net axial " },
        { text: "forward propeller thrust", variableId: "t_thrust" },
        { text: " equals " },
        { text: "seawater density", variableId: "rho_w" },
        { text: " across " },
        { text: "propeller sweep disc area", variableId: "a_disc" },
        { text: " and " },
        { text: "ship cruising velocity", variableId: "v_ship" },
        { text: " times axial jet excess from " },
        { text: "blade geometric pitch", variableId: "p_pitch" },
        { text: " and " },
        { text: "shaft rotational speed", variableId: "n_shaft" },
        { text: ", governed by " },
        { text: "hydrodynamic slip fraction", variableId: "s_slip" },
        { text: "." },
      ],
      variables: [
        {
          id: "t_thrust",
          symbol: "T_{\\text{thrust}}",
          name: "Axial Propeller Forward Thrust",
          color: "emerald",
          role: "Net longitudinal propulsive force pushing the ship hull through water ($10\\text{ to }50\\text{ kN}$)",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Generated by accelerating a mass flow of water rearward through the submerged rotating propeller disk.",
          telemetryMetricLabel: "Propeller Thrust",
        },
        {
          id: "rho_w",
          symbol: "\\rho_{\\text{water}}",
          name: "Seawater Fluid Density",
          color: "cyan",
          role: "Mass density of ocean saltwater ($1,025\\text{ kg/m}^3$ at $15^\\circ\\text{C}$)",
          unit: "kg/m^3",
          dimension: "[M L^-3]",
          explanation:
            "800 times denser than air, providing high mass momentum transfer per unit propeller area.",
        },
        {
          id: "a_disc",
          symbol: "A_{\\text{disc}}",
          name: "Propeller Disk Swept Area",
          color: "sapphire",
          role: "Circular frontal area swept by the rotating propeller blades ($A = \\frac{\\pi}{4} D^2 \\approx 1.5\\text{ to }4.0\\text{ m}^2$)",
          unit: "Square meters (m^2)",
          dimension: "[L^2]",
          explanation:
            "Defines the hydrodynamic streamtube cross section accelerated by the propeller.",
        },
        {
          id: "v_ship",
          symbol: "v_{\\text{ship}}",
          name: "Ship Forward Cruising Velocity",
          color: "amber",
          role: "Advance speed of the vessel through undisturbed water ($4.0\\text{ to }6.5\\text{ m/s} \\approx 8\\text{ to }12.5\\text{ knots}$)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Forward speed attained when thrust matches total hull hydrodynamic skin friction and wave-making drag.",
          telemetryKey: "vesselSpeedKnots",
        },
        {
          id: "p_pitch",
          symbol: "p_{\\text{pitch}}",
          name: "Geometric Blade Helical Pitch",
          color: "crimson",
          role: "Theoretical axial distance the propeller would advance in one revolution through a solid medium ($1.5\\text{ to }2.5\\text{ m}$)",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation:
            "Determined by the inclination angle of the short spiral blades attached to the outer metallic hoop.",
        },
        {
          id: "n_shaft",
          symbol: "n_{\\text{shaft}}",
          name: "Propeller Shaft Rotational Speed",
          color: "amethyst",
          role: "Rotational cranking speed of the engine drive shaft ($40\\text{ to }90\\text{ RPM} \\approx 0.67\\text{ to }1.5\\text{ rev/s}$)",
          unit: "Revolutions / second (rev/s)",
          dimension: "[T^-1]",
          explanation: "Direct-driven or geared from the ship's reciprocating steam cylinders.",
          telemetryKey: "propellerRpm",
        },
        {
          id: "s_slip",
          symbol: "s_{\\text{slip}}",
          name: "Hydrodynamic Apparent Slip Fraction",
          color: "coral",
          role: "Non-dimensional fraction representing the difference between theoretical pitch speed and actual hull speed ($s \\approx 0.15\\text{ to }0.25$)",
          unit: "Dimensionless slip (0 to 1)",
          dimension: "[1]",
          explanation:
            "Necessary to maintain positive angle of attack and generate hydrodynamic lift on blade sections.",
        },
      ],
      pedagogicalNote:
        "In the 1830s, steamships relied on vulnerable paddle wheels that churned water inefficiently, broke in heavy seas, and were easily destroyed by enemy cannon fire in naval battles. John Ericsson completely submerged a helical screw propeller below the waterline at the ship's stern, dramatically multiplying propulsive efficiency and revolutionizing naval combat.",
      claimRef: 1,
      historicalSignificance:
        "US 588 made oceanic steam navigation practical, ended the era of side-paddle steamers, and directly led to Ericsson's design of the revolutionary ironclad USS Monitor.",
    },
  ],

  // 39. Alfred Nobel Dynamite (US 78,317)
  "us-78317-nobel-dynamite": [
    {
      id: "nobel-dynamite-detonation-kinetics",
      patentId: "us-78317-nobel-dynamite",
      title: "Nitroglycerin Kieselguhr Capillary Adsorption & Supersonic Detonation Wave Pressure",
      category: "Chemical Engineering & Energetic Materials",
      rawLatex:
        "D_{\\text{det}} = \\sqrt{\\gamma \\cdot \\frac{R T_{\\text{det}}}{M_{\\text{gas}}}} \\approx 6,800\\text{ m/s} \\quad \\text{and} \\quad P_{\\text{CJ}} = \\frac{\\rho_0 D_{\\text{det}}^2}{\\gamma + 1}",
      colorizedLatex:
        "\\textcolor{#059669}{D_{\\text{det}}} = \\sqrt{\\textcolor{#dc2626}{\\gamma} \\cdot \\frac{R \\textcolor{#2563eb}{T_{\\text{det}}}}{\\textcolor{#0891b2}{M_{\\text{gas}}}}} \\approx 6,800\\text{ m/s} \\quad \\text{and} \\quad \\textcolor{#ea580c}{P_{\\text{CJ}}} = \\frac{\\textcolor{#d97706}{\\rho_0} \\textcolor{#059669}{D_{\\text{det}}^2}}{\\textcolor{#dc2626}{\\gamma} + 1}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "supersonic detonation wave velocity", variableId: "d_det" },
        { text: " in the absorbed mineral matrix scales with " },
        { text: "adiabatic gas expansion exponent", variableId: "gamma" },
        { text: ", " },
        { text: "peak detonation reaction temperature", variableId: "t_det" },
        { text: ", and inverse " },
        { text: "product gas molar mass", variableId: "m_gas" },
        { text: ", generating " },
        { text: "Chapman-Jouguet shock detonation pressure", variableId: "p_cj" },
        { text: " proportional to " },
        { text: "dynamite bulk cartridge density", variableId: "rho_0" },
        { text: "." },
      ],
      variables: [
        {
          id: "d_det",
          symbol: "D_{\\text{det}}",
          name: "Supersonic Detonation Velocity",
          color: "emerald",
          role: "Speed of the self-propagating supersonic shockwave traveling through the dynamite cartridge ($6,500\\text{ to }7,000\\text{ m/s}$)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Travels over 20 times faster than the speed of sound in air, shattering hard granite and quartz rock through shock brisance.",
          telemetryMetricLabel: "Detonation Velocity",
        },
        {
          id: "gamma",
          symbol: "\\gamma",
          name: "Adiabatic Product Gas Exponent",
          color: "crimson",
          role: "Effective specific heat ratio of high-density detonation plasma gases ($\\gamma \\approx 1.25\\text{ to }1.35$)",
          unit: "Dimensionless ratio",
          dimension: "[1]",
          explanation:
            "Governs the extreme thermodynamic expansion ratio of gaseous products ($\text{CO}_2, \text{H}_2\text{O}, \text{N}_2$).",
        },
        {
          id: "t_det",
          symbol: "T_{\\text{det}}",
          name: "Detonation Reaction Temperature",
          color: "sapphire",
          role: "Peak instantaneous temperature developed inside the Chapman-Jouguet reaction plane ($3,000\\text{ to }3,500\\text{ K}$)",
          unit: "Kelvin (K)",
          dimension: "[\\Theta]",
          explanation:
            "Exothermic cleavage of nitroglycerin nitrate ester bonds ($-\\text{O}-\\text{NO}_2$) releases $6.3\\text{ MJ/kg}$ of chemical enthalpy.",
        },
        {
          id: "m_gas",
          symbol: "M_{\\text{gas}}",
          name: "Product Gas Mean Molar Mass",
          color: "cyan",
          role: "Average molecular weight of the incandescent exhaust gases ($M \\approx 28.5\\text{ g/mol}$)",
          unit: "kg/mol",
          dimension: "[M N^-1]",
          explanation:
            "Light product molecules accelerate acoustic shock velocity according to ideal gas kinetic theory.",
        },
        {
          id: "p_cj",
          symbol: "P_{\\text{CJ}}",
          name: "Chapman-Jouguet Shock Pressure",
          color: "coral",
          role: "Peak shockwave pressure developed immediately behind the detonation front (over $10\\text{ GPa} \\approx 100,000\\text{ atm}$)",
          unit: "Gigapascals (GPa) / Atmospheres",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Generates pulverized rock crushing zones inside mining bore-holes, shattering stubborn iron, copper, and gold ores.",
        },
        {
          id: "rho_0",
          symbol: "\\rho_0",
          name: "Dynamite Bulk Cartridge Density",
          color: "amber",
          role: "Density of the packed 75:25 nitroglycerin-kieselguhr paste ($1,500\\text{ to }1,600\\text{ kg/m}^3$)",
          unit: "kg/m^3",
          dimension: "[M L^-3]",
          explanation:
            "Higher density increases detonation pressure quadratically ($P \\propto \\rho_0 D^2$), maximizing rock-fracturing power.",
          telemetryKey: "densityKgM3",
        },
      ],
      pedagogicalNote:
        "Liquid nitroglycerin was so wildly unstable that a minor jolt during horse-drawn wagon transport frequently blew entire mining crews and factories to pieces. Alfred Nobel discovered that absorbing liquid nitroglycerin into porous diatomaceous silica earth (kieselguhr, 75% liquid to 25% earth) created a safe, moldable putty that could be dropped or burned without detonating—only exploding when triggered by his mercury fulminate blasting cap.",
      claimRef: 1,
      historicalSignificance:
        "US 78317 made high-energy blasting safe, enabling the construction of transcontinental railroads, the Panama Canal, Alpine tunnels, and modern mining infrastructure worldwide.",
    },
  ],

  // 40. George Corliss Steam Engine (US 6,162)
  "us-6162-corliss-steam-engine": [
    {
      id: "corliss-engine-expansion-work",
      patentId: "us-6162-corliss-steam-engine",
      title: "Variable Expansion Cut-Off Indicator Work & Centrifugal Governor Trip Leverage",
      category: "Thermodynamics & Steam Engineering",
      rawLatex:
        "W_{\\text{indicated}} = P_1 V_{\\text{cutoff}} \\left(1 + \\ln\\left(\\frac{V_2}{V_{\\text{cutoff}}}\\right)\\right) - P_{\\text{back}} V_2 \\quad \\text{and} \\quad \\theta_{\\text{trip}} \\propto \\omega_{\\text{governor}}^2",
      colorizedLatex:
        "\\textcolor{#059669}{W_{\\text{indicated}}} = \\textcolor{#2563eb}{P_1} \\textcolor{#d97706}{V_{\\text{cutoff}}} \\left(1 + \\ln\\left(\\frac{\\textcolor{#0891b2}{V_2}}{\\textcolor{#d97706}{V_{\\text{cutoff}}}}\\right)\\right) - \\textcolor{#dc2626}{P_{\\text{back}}} \\textcolor{#0891b2}{V_2} \\quad \\text{and} \\quad \\textcolor{#9333ea}{\\theta_{\\text{trip}}} \\propto \\textcolor{#ea580c}{\\omega_{\\text{governor}}^2}",
      plainEnglishSentence: [
        { text: "Net " },
        { text: "indicated mechanical work", variableId: "w_ind" },
        { text: " per stroke scales with " },
        { text: "boiler admission steam pressure", variableId: "p_1" },
        { text: " and " },
        { text: "cutoff volume", variableId: "v_cut" },
        { text: " times logarithmic expansion over " },
        { text: "cylinder displacement volume", variableId: "v_2" },
        { text: " minus " },
        { text: "exhaust backpressure", variableId: "p_back" },
        { text: ", with " },
        { text: "wristplate catch trip angle", variableId: "theta_trip" },
        { text: " modulated by " },
        { text: "governor spin speed", variableId: "omega_gov" },
        { text: "." },
      ],
      variables: [
        {
          id: "w_ind",
          symbol: "W_{\\text{indicated}}",
          name: "Indicated Expansion Work per Stroke",
          color: "emerald",
          role: "Net thermodynamic mechanical boundary work performed on the piston face ($10\\text{ to }150\\text{ kJ/stroke}$)",
          unit: "Joules (J) / Kilojoules",
          dimension: "[M L^2 T^-2]",
          explanation:
            "Integrates cylinder pressure across the full piston travel stroke on the steam indicator card diagram.",
          telemetryMetricLabel: "Indicated Work",
        },
        {
          id: "p_1",
          symbol: "P_1",
          name: "Boiler Admission Steam Pressure",
          color: "sapphire",
          role: "Full unthrottled boiler saturation pressure admitted during initial stroke fraction ($0.6\\text{ to }1.0\\text{ MPa} \\approx 90\\text{ to }150\\text{ psi}$)",
          unit: "Megapascals (MPa)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Admitted at full boiler pressure without throttling valves, preventing thermodynamic throttling entropy losses.",
          telemetryKey: "boilerPressureMpa",
        },
        {
          id: "v_cut",
          symbol: "V_{\\text{cutoff}}",
          name: "Cylinder Volume at Valve Cutoff Point",
          color: "amber",
          role: "Volume displaced before the intake rotary valve slams shut ($15\\%\\text{ to }35\\%$ of total cylinder volume)",
          unit: "Cubic meters (m^3)",
          dimension: "[L^3]",
          explanation:
            "Disengaged by the trip cam and closed in under $15\\text{ milliseconds}$ by the pneumatic vacuum dashpot.",
        },
        {
          id: "v_2",
          symbol: "V_2",
          name: "Total Stroke Displacement Volume",
          color: "cyan",
          role: "Maximum volume inside cylinder at bottom dead center piston stroke ($0.1\\text{ to }1.2\\text{ m}^3$)",
          unit: "Cubic meters (m^3)",
          dimension: "[L^3]",
          explanation:
            "High expansion ratio $V_2 / V_{\\text{cutoff}} \\approx 3\\text{ to }6$ extracts maximum thermal enthalpy from steam.",
        },
        {
          id: "p_back",
          symbol: "P_{\\text{back}}",
          name: "Exhaust Backpressure",
          color: "crimson",
          role: "Pressure resisting the return stroke from condenser vacuum ($10\\text{ to }20\\text{ kPa}$) or atmosphere ($101\\text{ kPa}$)",
          unit: "Kilopascals (kPa)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Isolated exhaust valves at bottom corners minimize backpressure resistance and cold iron recondensation.",
        },
        {
          id: "theta_trip",
          symbol: "\\theta_{\\text{trip}}",
          name: "Wristplate Catch Trip Release Angle",
          color: "amethyst",
          role: "Angular trigger point where the rotating hook catches hit the disengagement cams ($10^\\circ\\text{ to }45^\\circ$)",
          unit: "Degrees",
          dimension: "[1]",
          explanation:
            "Mechanically linked to the flyball governor collar to dynamically vary cutoff point with factory load.",
        },
        {
          id: "omega_gov",
          symbol: "\\omega_{\\text{governor}}",
          name: "Centrifugal Flyball Governor Speed",
          color: "coral",
          role: "Rotational angular speed of the revolving Watt flyball governor ($60\\text{ to }120\\text{ RPM}$)",
          unit: "Radians / second (rad/s)",
          dimension: "[T^-1]",
          explanation:
            "Maintains engine output speed steady within $1\\%$ despite sudden factory machinery load changes.",
          telemetryKey: "governorRpm",
        },
      ],
      pedagogicalNote:
        "Earlier steam engines regulated speed by throttling boiler steam through a choke valve, wasting vast amounts of energy and burning extra coal. George Corliss invented four independent rotary valves linked to a central oscillating wristplate and a centrifugal flyball governor. When the engine reached target speed, spring-loaded catches tripped and snapped the intake valves shut in milliseconds, letting the steam expand freely and cutting coal consumption by over 30%.",
      claimRef: 1,
      historicalSignificance:
        "US 6162 transformed American factory production; the 1,400-horsepower Centennial Corliss Engine powered the entire 1876 World's Fair, standing as the supreme mechanical triumph of the Industrial Revolution.",
    },
  ],

  // 41. Christopher Sholes Typewriter (US 79,265)
  "us-79265-sholes-typewriter": [
    {
      id: "sholes-typewriter-escapement-kinematics",
      patentId: "us-79265-sholes-typewriter",
      title: "Radial Typebar Striking Kinematics & Escapement Ratchet Pitch",
      category: "Precision Mechanics & Office Automation",
      rawLatex:
        "\\omega_{\\text{bar}} = \\frac{v_{\\text{key}}}{L_{\\text{key}}} \\cdot \\text{MA}_{\\text{linkage}} \\quad \\text{and} \\quad \\Delta x_{\\text{platen}} = p_{\\text{ratchet}} = \\frac{1}{\\text{CPI}}",
      colorizedLatex:
        "\\textcolor{#059669}{\\omega_{\\text{bar}}} = \\frac{\\textcolor{#2563eb}{v_{\\text{key}}}}{\\textcolor{#d97706}{L_{\\text{key}}}} \\cdot \\textcolor{#dc2626}{\\text{MA}_{\\text{linkage}}} \\quad \\text{and} \\quad \\textcolor{#0891b2}{\\Delta x_{\\text{platen}}} = \\textcolor{#9333ea}{p_{\\text{ratchet}}} = \\frac{1}{\\textcolor{#ea580c}{\\text{CPI}}}",
      plainEnglishSentence: [
        { text: "Radial " },
        { text: "typebar striking angular velocity", variableId: "omega_bar" },
        { text: " scales with " },
        { text: "key depression velocity", variableId: "v_key" },
        { text: " over " },
        { text: "key lever length", variableId: "l_key" },
        { text: " times " },
        { text: "wire linkage mechanical advantage", variableId: "ma_link" },
        { text: ", while carriage " },
        { text: "platen step displacement", variableId: "dx_plat" },
        { text: " equals " },
        { text: "escapement ratchet pitch", variableId: "p_ratchet" },
        { text: " set by standard " },
        { text: "characters-per-inch density", variableId: "cpi" },
        { text: "." },
      ],
      variables: [
        {
          id: "omega_bar",
          symbol: "\\omega_{\\text{bar}}",
          name: "Typebar Striking Angular Velocity",
          color: "emerald",
          role: "Rotational angular speed of the pivoted radial typebar swinging upward to impact the platen ($15\\text{ to }30\\text{ rad/s}$)",
          unit: "Radians / second (rad/s)",
          dimension: "[T^-1]",
          explanation:
            "Drives the raised steel letter punch through the inked ribbon onto paper with crisp, uniform typographic density.",
          telemetryMetricLabel: "Typebar Velocity",
        },
        {
          id: "v_key",
          symbol: "v_{\\text{key}}",
          name: "Fingertip Key Depression Speed",
          color: "sapphire",
          role: "Downward striking speed applied by the typist's finger ($0.3\\text{ to }0.8\\text{ m/s}$)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Transmitted directly from the keytop button to the pivoted wooden/steel key lever arm.",
          telemetryKey: "keyStrokeSpeedMps",
        },
        {
          id: "l_key",
          symbol: "L_{\\text{key}}",
          name: "Key Lever Pivot Fulcrum Length",
          color: "amber",
          role: "Distance from the front key button to the fulcrum beam pivot axis ($180\\text{ to }220\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Provides ergonomic lever travel ($10\\text{ to }15\\text{ mm}$ keystroke) for touch typing comfort.",
        },
        {
          id: "ma_link",
          symbol: "\\text{MA}_{\\text{linkage}}",
          name: "Wire Linkage Mechanical Ratio",
          color: "crimson",
          role: "Effective mechanical velocity step-up ratio through the intermediate connecting link wire ($\\approx 3.5\\text{ to }4.2$)",
          unit: "Dimensionless ratio",
          dimension: "[1]",
          explanation:
            "Multiplies small key lever strokes into wide $90^\\circ$ radial typebar swings.",
        },
        {
          id: "dx_plat",
          symbol: "\\Delta x_{\\text{platen}}",
          name: "Paper Carriage Step Advance",
          color: "cyan",
          role: "Lateral displacement of the paper-holding platen carriage per character typed ($2.54\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Released by the bifurcated escapement fork during the key return stroke under constant spring tension.",
        },
        {
          id: "p_ratchet",
          symbol: "p_{\\text{ratchet}}",
          name: "Escapement Ratchet Pitch",
          color: "amethyst",
          role: "Linear tooth pitch spacing machined onto the longitudinal carriage ratchet bar ($2.54\\text{ mm} = 0.10\\text{ inches}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Guarantees perfectly uniform typographical letter spacing across the full line width.",
        },
        {
          id: "cpi",
          symbol: "\\text{CPI}",
          name: "Characters Per Inch Density",
          color: "coral",
          role: "Standard typographic character frequency ($10\\text{ CPI} = \\text{Pica font}$)",
          unit: "Characters / inch",
          dimension: "[L^-1]",
          explanation:
            "Universal standard format adopted across business correspondence, legal contracts, and publishing.",
        },
      ],
      pedagogicalNote:
        "Christopher Sholes, Carlos Glidden, and Samuel Soulé designed a machine where typebars arranged in a circular basket pivoted upward to strike a common center point beneath a rubber platen. To prevent typebars from clashing when adjacent letters were struck in rapid sequence, Sholes tested common letter digraph frequencies in English and developed the QWERTY keyboard layout, combined with an escapement ratchet that advanced the paper carriage by exactly one character pitch per keystroke.",
      claimRef: 2,
      historicalSignificance:
        "US 79265 created the modern typewriter, established the universal QWERTY layout used on billions of keyboards and smartphones today, and opened clerical work and corporate offices to millions of women worldwide.",
    },
  ],

  // 42. Zénobe Gramme Ring Dynamo (US 120,057)
  "us-120057-gramme-dynamo": [
    {
      id: "gramme-dynamo-continuous-emf",
      patentId: "us-120057-gramme-dynamo",
      title: "Continuous Ring Armature Faraday Induction & Commutated Direct Current",
      category: "Electrical Power & Magnetic Induction",
      rawLatex:
        "\\mathcal{E}_{\\text{DC}} = 2 \\cdot N_{\\text{turns}} \\cdot \\Phi_{\\text{pole}} \\cdot \\left(\\frac{n_{\\text{rpm}}}{60}\\right) \\quad \\text{and} \\quad V_{\\text{ripple}} \\approx \\frac{\\pi^2}{2 N_{\\text{segments}}^2}",
      colorizedLatex:
        "\\textcolor{#059669}{\\mathcal{E}_{\\text{DC}}} = 2 \\cdot \\textcolor{#dc2626}{N_{\\text{turns}}} \\cdot \\textcolor{#2563eb}{\\Phi_{\\text{pole}}} \\cdot \\left(\\frac{\\textcolor{#0891b2}{n_{\\text{rpm}}}}{60}\\right) \\quad \\text{and} \\quad \\textcolor{#ea580c}{V_{\\text{ripple}}} \\approx \\frac{\\pi^2}{2 \\textcolor{#9333ea}{N_{\\text{segments}}^2}}",
      plainEnglishSentence: [
        { text: "Generated continuous " },
        { text: "direct-current electromotive force", variableId: "emf_dc" },
        { text: " scales with " },
        { text: "series armature turns", variableId: "n_turns" },
        { text: ", " },
        { text: "stator pole magnetic flux", variableId: "phi_pole" },
        { text: ", and " },
        { text: "armature shaft rotational speed", variableId: "n_rpm" },
        { text: ", while " },
        { text: "peak-to-peak output voltage ripple", variableId: "v_rip" },
        { text: " is suppressed by " },
        { text: "commutator segment count", variableId: "n_seg" },
        { text: "." },
      ],
      variables: [
        {
          id: "emf_dc",
          symbol: "\\mathcal{E}_{\\text{DC}}",
          name: "Continuous Generated DC Voltage",
          color: "emerald",
          role: "Steady-state direct-current voltage delivered across positive and negative collector brushes ($50\\text{ to }110\\text{ V}$)",
          unit: "Volts (V)",
          dimension: "[M L^2 T^-3 I^-1]",
          explanation:
            "Sums the individual Faraday voltages induced in all active coil bobbins across two parallel rotor branches.",
          telemetryMetricLabel: "Generated DC Voltage",
        },
        {
          id: "n_turns",
          symbol: "N_{\\text{turns}}",
          name: "Series Armature Winding Turns",
          color: "crimson",
          role: "Total effective active copper wire turns connected in series per semicircular branch ($N \\approx 500\\text{ to }1,200$)",
          unit: "Turns (count)",
          dimension: "[1]",
          explanation:
            "Wound continuously around the soft-iron toroidal wire ring core without sharp internal magnetic discontinuities.",
        },
        {
          id: "phi_pole",
          symbol: "\\Phi_{\\text{pole}}",
          name: "Stator Field Magnetic Flux",
          color: "sapphire",
          role: "Total magnetic flux entering the ring from each curved iron pole shoe ($15\\text{ to }30\\text{ mWb}$)",
          unit: "Webers (Wb) / Tesla-m^2",
          dimension: "[M L^2 T^-2 I^-1]",
          explanation:
            "Generated by self-excited stator electromagnet coils embracing the toroidal armature envelope.",
          telemetryKey: "poleFluxMilliWebers",
        },
        {
          id: "n_rpm",
          symbol: "n_{\\text{rpm}}",
          name: "Armature Rotational Drive Speed",
          color: "cyan",
          role: "Mechanical drive speed of the armature shaft driven by a steam engine or water turbine ($800\\text{ to }1,500\\text{ RPM}$)",
          unit: "Revolutions / minute (RPM)",
          dimension: "[T^-1]",
          explanation: "Induced voltage scales linearly with rotational drive speed.",
          telemetryKey: "dynamoRpm",
        },
        {
          id: "v_rip",
          symbol: "V_{\\text{ripple}}",
          name: "Fractional Voltage Ripple Amplitude",
          color: "coral",
          role: "Peak-to-peak AC ripple fraction superimposed on the DC output baseline ($< 0.5\\%$ for 32 sectors)",
          unit: "Dimensionless ripple fraction (0 to 1)",
          dimension: "[1]",
          explanation:
            "Provides smooth, steady, flicker-free current ideal for powering carbon arc lamps and industrial electroplating.",
        },
        {
          id: "n_seg",
          symbol: "N_{\\text{segments}}",
          name: "Commutator Copper Sector Count",
          color: "amethyst",
          role: "Number of radial copper commutator bars connected to junction taps ($N = 32\\text{ to }64$)",
          unit: "Bars / segments (count)",
          dimension: "[1]",
          explanation:
            "Multiplies commutation frequency and suppresses output voltage ripple quadratically ($V_{\\text{ripple}} \\propto 1/N^2$).",
        },
      ],
      pedagogicalNote:
        "Prior to Zénobe Gramme's 1871 patent, electric dynamos produced jerky, violent alternating pulses that caused severe contact sparking and flickered wildly. Gramme wound insulated copper wire in a continuous, endless toroidal ring around an iron wire core, taking taps off every section to a radial multi-bar commutator. Because some coils were always crossing peak magnetic flux lines, the machine produced the first smooth, continuous direct current in history.",
      claimRef: 1,
      historicalSignificance:
        "US 120057 launched the commercial electric power industry, powered the first citywide arc lighting grids in Paris and London, and demonstrated the electrical transmission of industrial motive power over long-distance transmission wires.",
    },
  ],

  // 43. Gustaf de Laval Centrifugal Cream Separator (US 247,804)
  "us-247804-delaval-separator": [
    {
      id: "delaval-separator-stokes-centrifugal",
      patentId: "us-247804-delaval-separator",
      title: "Centrifugal Stokes Buoyant Separation Velocity & Fluid Hydrostatic Stratification",
      category: "Fluid Mechanics & Centrifugal Separation",
      rawLatex:
        "v_{\\text{sep}} = \\frac{2 r_{\\text{globule}}^2 (\\rho_{\\text{serum}} - \\rho_{\\text{fat}}) \\omega^2 R_{\\text{bowl}}}{9 \\eta_{\\text{milk}}} \\quad \\text{and} \\quad G_{\\text{centrif}} = \\frac{\\omega^2 R_{\\text{bowl}}}{g}",
      colorizedLatex:
        "\\textcolor{#059669}{v_{\\text{sep}}} = \\frac{2 \\textcolor{#dc2626}{r_{\\text{globule}}^2} (\\textcolor{#2563eb}{\\rho_{\\text{serum}}} - \\textcolor{#d97706}{\\rho_{\\text{fat}}}) \\textcolor{#0891b2}{\\omega^2} \\textcolor{#9333ea}{R_{\\text{bowl}}}}{9 \\textcolor{#ea580c}{\\eta_{\\text{milk}}}} \\quad \\text{and} \\quad \\textcolor{#059669}{G_{\\text{centrif}}} = \\frac{\\textcolor{#0891b2}{\\omega^2} \\textcolor{#9333ea}{R_{\\text{bowl}}}}{g}",
      plainEnglishSentence: [
        { text: "Inward radial " },
        { text: "cream separation migration velocity", variableId: "v_sep" },
        { text: " scales with " },
        { text: "fat globule radius squared", variableId: "r_glob" },
        { text: ", density difference between " },
        { text: "skim serum density", variableId: "rho_serum" },
        { text: " and " },
        { text: "butterfat density", variableId: "rho_fat" },
        { text: ", " },
        { text: "bowl angular spin speed squared", variableId: "omega" },
        { text: ", and " },
        { text: "outer bowl radius", variableId: "r_bowl" },
        { text: " over " },
        { text: "milk dynamic viscosity", variableId: "eta_milk" },
        { text: ", generating " },
        { text: "centrifugal G-force acceleration", variableId: "g_centrif" },
        { text: "." },
      ],
      variables: [
        {
          id: "v_sep",
          symbol: "v_{\\text{sep}}",
          name: "Inward Cream Separation Velocity",
          color: "emerald",
          role: "Radial terminal buoyant migration speed of butterfat globules moving inward toward the bowl axis ($1.5\\text{ to }4.0\\text{ mm/s}$)",
          unit: "Millimeters / second (mm/s)",
          dimension: "[L T^-1]",
          explanation:
            "Accelerated 4,000 times faster than gravity, separating whole milk into thick cream and skim milk in under 3 seconds.",
          telemetryMetricLabel: "Separation Velocity",
        },
        {
          id: "r_glob",
          symbol: "r_{\\text{globule}}",
          name: "Butterfat Globule Radius",
          color: "crimson",
          role: "Mean radius of microscopic suspended butterfat emulsion lipid droplets ($r \\approx 1.5\\text{ to }5.0\\;\\mu\\text{m}$)",
          unit: "Microns (μm)",
          dimension: "[L]",
          explanation:
            "Separation rate increases with the square of globule radius according to Stokes drag law.",
        },
        {
          id: "rho_serum",
          symbol: "\\rho_{\\text{serum}}",
          name: "Skim Milk Aqueous Serum Density",
          color: "sapphire",
          role: "Mass density of the dense water-lactose-casein phase ($1,035\\text{ kg/m}^3$ at $35^\\circ\\text{C}$)",
          unit: "kg/m^3",
          dimension: "[M L^-3]",
          explanation:
            "Forced radially outward against the bowl perimeter by extreme centrifugal pressure.",
        },
        {
          id: "rho_fat",
          symbol: "\\rho_{\\text{fat}}",
          name: "Butterfat Core Density",
          color: "amber",
          role: "Mass density of the lighter triglyceride lipid core ($920\\text{ kg/m}^3$ at $35^\\circ\\text{C}$)",
          unit: "kg/m^3",
          dimension: "[M L^-3]",
          explanation:
            "Lower density creates buoyant displacement that drives fat globules inward toward the central overflow neck.",
        },
        {
          id: "omega",
          symbol: "\\omega",
          name: "Bowl Rotational Angular Speed",
          color: "cyan",
          role: "Rotational velocity of the forged steel centrifuge bowl ($650\\text{ to }750\\text{ rad/s} \\approx 6,200\\text{ to }7,200\\text{ RPM}$)",
          unit: "Radians / second (rad/s)",
          dimension: "[T^-1]",
          explanation:
            "Step-up gearing drives the flexible supercritical spindle well above resonance frequency.",
          telemetryKey: "bowlRpm",
        },
        {
          id: "r_bowl",
          symbol: "R_{\\text{bowl}}",
          name: "Centrifuge Bowl Outer Radius",
          color: "amethyst",
          role: "Maximum internal radius of the hollow rotor bowl ($120\\text{ to }150\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Sets the maximum radial acceleration and fluid hydrostatic pressure envelope.",
        },
        {
          id: "eta_milk",
          symbol: "\\eta_{\\text{milk}}",
          name: "Milk Dynamic Viscosity",
          color: "coral",
          role: "Fluid dynamic shear viscosity of whole milk at operating temperature ($1.5\\text{ to }2.0\\text{ mPa·s}$ at $35^\\circ\\text{C}$)",
          unit: "Millipascal-seconds (mPa·s)",
          dimension: "[M L^-1 T^-1]",
          explanation:
            "Warming raw milk to $35^\\circ\\text{C}$ halves viscosity, doubling cream separation throughput.",
        },
        {
          id: "g_centrif",
          symbol: "G_{\\text{centrif}}",
          name: "Centrifugal G-Force Multiplier",
          color: "emerald",
          role: "Effective radial centrifugal acceleration expressed in multiples of Earth gravity ($> 4,000\\text{ Gs}$)",
          unit: "G-forces (dimensionless)",
          dimension: "[1]",
          explanation:
            "Replaces slow 24-hour gravity creaming pans with instant continuous industrial skimming.",
          telemetryMetricLabel: "Centrifugal G-Force",
        },
      ],
      pedagogicalNote:
        "Before Gustaf de Laval's 1881 patent, separating cream from milk required setting shallow pans on cellar shelves for 24 to 36 hours while gravity slowly floated fat to the top—during which milk frequently soured. De Laval spun milk in a precision-balanced forged steel bowl at over 6,000 RPM, creating 4,000 Gs of centrifugal force that separated dense skim milk from buoyant cream in 3 seconds, continuously discharging each through separate concentric spouts.",
      claimRef: 1,
      historicalSignificance:
        "US 247804 industrialized the dairy industry worldwide, gave birth to modern continuous industrial centrifuges, and led de Laval to invent the convergent-divergent supersonic steam turbine nozzle.",
    },
  ],

  // 44. Charles Goodyear Vulcanized Rubber (US 3,633)
  "us-3633-goodyear-rubber": [
    {
      id: "goodyear-rubber-vulcanization-elasticity",
      patentId: "us-3633-goodyear-rubber",
      title: "Sulfur Polysulfide Cross-Linking & Entropic Rubber Elasticity Modulus",
      category: "Materials Science & Polymer Chemistry",
      rawLatex:
        "\\sigma_{\\text{stress}} = N_{\\text{crosslink}} k_B T \\left(\\lambda - \\frac{1}{\\lambda^2}\\right) \\quad \\text{and} \\quad G_{\\text{shear}} = N_{\\text{crosslink}} k_B T",
      colorizedLatex:
        "\\textcolor{#059669}{\\sigma_{\\text{stress}}} = \\textcolor{#dc2626}{N_{\\text{crosslink}}} k_B \\textcolor{#2563eb}{T} \\left(\\textcolor{#0891b2}{\\lambda} - \\frac{1}{\\textcolor{#0891b2}{\\lambda^2}}\\right) \\quad \\text{and} \\quad \\textcolor{#ea580c}{G_{\\text{shear}}} = \\textcolor{#dc2626}{N_{\\text{crosslink}}} k_B \\textcolor{#2563eb}{T}",
      plainEnglishSentence: [
        { text: "Uniaxial tensile " },
        { text: "restorative elastic stress", variableId: "sigma_stress" },
        { text: " in vulcanized rubber scales with " },
        { text: "sulfur crosslink network density", variableId: "n_cross" },
        { text: ", absolute " },
        { text: "operating temperature", variableId: "temp_k" },
        { text: ", and " },
        { text: "uniaxial extension ratio", variableId: "lambda_ext" },
        { text: ", establishing " },
        { text: "elastic shear modulus", variableId: "g_shear" },
        { text: " proportional to crosslink junction density." },
      ],
      variables: [
        {
          id: "sigma_stress",
          symbol: "\\sigma_{\\text{stress}}",
          name: "Uniaxial Tensile Restorative Stress",
          color: "emerald",
          role: "Tensile stress opposing deformation in cross-linked polyisoprene elastomer ($2.0\\text{ to }15\\text{ MPa}$)",
          unit: "Megapascals (MPa)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Restores the deformed elastomer back to its original resting dimensions upon release of load without permanent viscous drift.",
          telemetryMetricLabel: "Elastic Stress",
        },
        {
          id: "n_cross",
          symbol: "N_{\\text{crosslink}}",
          name: "Cross-Link Junction Network Density",
          color: "crimson",
          role: "Number of covalent polysulfide chemical bridges formed per unit volume ($10^{25}\\text{ to }10^{26}\\text{ m}^{-3}$)",
          unit: "Junctions / m^3",
          dimension: "[L^-3]",
          explanation:
            "Formed by heating raw gum rubber with sulfur ($S_8$) and white lead catalyst at $130^\\circ\\text{C}\\text{ to }150^\\circ\\text{C}$.",
          telemetryKey: "crosslinkDensity",
        },
        {
          id: "temp_k",
          symbol: "T",
          name: "Absolute Operating Temperature",
          color: "sapphire",
          role: "Thermodynamic temperature of the vulcanized rubber material ($250\\text{ to }370\\text{ K} \\approx -23^\\circ\\text{C}\\text{ to }+97^\\circ\\text{C}$)",
          unit: "Kelvin (K)",
          dimension: "[\\Theta]",
          explanation:
            "Unlike metals, rubber elasticity increases with temperature because restorative force is driven by conformational entropy ($S$).",
          telemetryKey: "temperatureKelvin",
        },
        {
          id: "lambda_ext",
          symbol: "\\lambda",
          name: "Tensile Stretch Extension Ratio",
          color: "cyan",
          role: "Ratio of deformed elongated length to original unconstrained gauge length ($\\lambda = L / L_0 \\approx 1.0\\text{ to }6.0$)",
          unit: "Dimensionless stretch ratio",
          dimension: "[1]",
          explanation:
            "Aligns coiled polymer chains in parallel, reducing conformational entropy until crystallization occurs at high extensions.",
        },
        {
          id: "g_shear",
          symbol: "G_{\\text{shear}}",
          name: "Elastomeric Shear Modulus",
          color: "coral",
          role: "Fundamental resistance of the cross-linked network to shear strain deformation ($0.5\\text{ to }2.5\\text{ MPa}$)",
          unit: "Megapascals (MPa)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Preserves mechanical elasticity across extreme winter freezes and summer heat waves without melting into sticky resin.",
        },
      ],
      pedagogicalNote:
        "Before Charles Goodyear's 1844 patent, natural rubber goods were a commercial disaster: they turned rock-hard and brittle in freezing winter temperatures and melted into a foul-smelling, sticky sludge in summer heat. Goodyear discovered that heating natural latex gum with sulfur and white lead formed permanent covalent sulfur bridges across the polyisoprene chains, inventing vulcanized rubber that stays tough, flexible, and waterproof across all weather conditions.",
      claimRef: 1,
      historicalSignificance:
        "US 3633 founded the global polymer and elastomer industry, enabling waterproof apparel, industrial belts, electrical cable insulation, and the two billion vehicle tires produced annually worldwide.",
    },
  ],

  // 45. Abraham Lincoln Vessel Buoyancy Chamber (US 6,469)
  "us-6469-lincoln-buoy": [
    {
      id: "lincoln-buoy-hydrostatic-lift",
      patentId: "us-6469-lincoln-buoy",
      title: "Hydrostatic Buoyant Lift Displacement & Shallow-Water Draft Reduction",
      category: "Marine Engineering & Fluid Statics",
      rawLatex:
        "F_{\\text{buoyant}} = \\rho_{\\text{water}} g \\Delta V_{\\text{chambers}} \\quad \\text{and} \\quad \\Delta d_{\\text{draft}} = \\frac{\\Delta V_{\\text{chambers}}}{A_{\\text{waterplane}}}",
      colorizedLatex:
        "\\textcolor{#059669}{F_{\\text{buoyant}}} = \\textcolor{#0891b2}{\\rho_{\\text{water}}} g \\textcolor{#2563eb}{\\Delta V_{\\text{chambers}}} \\quad \\text{and} \\quad \\textcolor{#ea580c}{\\Delta d_{\\text{draft}}} = \\frac{\\textcolor{#2563eb}{\\Delta V_{\\text{chambers}}}}{\\textcolor{#9333ea}{A_{\\text{waterplane}}}}",
      plainEnglishSentence: [
        { text: "Total upward " },
        { text: "hydrostatic buoyant lift force", variableId: "f_buoy" },
        { text: " equals " },
        { text: "river water density", variableId: "rho_w" },
        { text: " times gravity times " },
        { text: "expanded bellows volume", variableId: "dv_chamb" },
        { text: ", producing a direct " },
        { text: "vessel draft clearance reduction", variableId: "dd_draft" },
        { text: " across " },
        { text: "hull waterplane float area", variableId: "a_plane" },
        { text: "." },
      ],
      variables: [
        {
          id: "f_buoy",
          symbol: "F_{\\text{buoyant}}",
          name: "Hydrostatic Upward Buoyant Lift",
          color: "emerald",
          role: "Net upward Archimedean buoyant force generated by submerged inflated side chambers ($200\\text{ to }800\\text{ kN}$)",
          unit: "Kilonewtons (kN)",
          dimension: "[M L T^-2]",
          explanation:
            "Lifts the grounded steamboat hull upward off shallow sandbars, snags, and rocky river shoals.",
          telemetryMetricLabel: "Buoyant Lift",
        },
        {
          id: "rho_w",
          symbol: "\\rho_{\\text{water}}",
          name: "Freshwater River Density",
          color: "cyan",
          role: "Mass density of river water ($1,000\\text{ kg/m}^3$ at $20^\\circ\\text{C}$)",
          unit: "kg/m^3",
          dimension: "[M L^-3]",
          explanation:
            "Provides 1 metric ton of upward lift for every cubic meter of air expanded beneath the waterline.",
        },
        {
          id: "dv_chamb",
          symbol: "\\Delta V_{\\text{chambers}}",
          name: "Expanded Bellows Displaced Volume",
          color: "sapphire",
          role: "Total volume of water displaced by extending the waterproof gutta-percha or canvas bellows downward ($30\\text{ to }80\\text{ m}^3$)",
          unit: "Cubic meters (m^3)",
          dimension: "[L^3]",
          explanation:
            "Expanded and forced downward into the water by rotating central shaft C linked to vertical sliding spars D.",
          telemetryKey: "displacedVolumeM3",
        },
        {
          id: "dd_draft",
          symbol: "\\Delta d_{\\text{draft}}",
          name: "Vessel Draft Clearance Reduction",
          color: "coral",
          role: "Vertical upward lift distance of the steamboat keel ($0.3\\text{ to }0.9\\text{ meters} \\approx 1\\text{ to }3\\text{ feet}$)",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation:
            "Reduces vessel draft enough to float over shallow sandbars without offloading cargo or passengers.",
          telemetryMetricLabel: "Draft Reduction",
        },
        {
          id: "a_plane",
          symbol: "A_{\\text{waterplane}}",
          name: "Hull Waterplane Float Area",
          color: "amethyst",
          role: "Horizontal cross-sectional waterplane area of the riverboat hull ($80\\text{ to }120\\text{ m}^2$)",
          unit: "Square meters (m^2)",
          dimension: "[L^2]",
          explanation:
            "Governs the hydrostatic draft reduction per unit volume of expanded buoyancy chambers.",
        },
      ],
      pedagogicalNote:
        "In 1848, after his riverboat ran aground on a shallow sandbar on the Sangamon River in Illinois, Congressman Abraham Lincoln whittled an 18-inch wooden scale model of an adjustable buoyancy system. By wrapping ropes around a central capstan shaft, vertical spars forced waterproof rubberized bellows downward into the river along the hull, expanding them with air to displace water and lift the vessel over shoals.",
      claimRef: 1,
      historicalSignificance:
        "US 6469 makes Abraham Lincoln the only President of the United States ever to hold a patent. The original carved patent model is preserved in the Smithsonian Institution in Washington, D.C.",
    },
  ],

  // 46. John Wesley Hyatt Celluloid Plastic (US 105,338)
  "us-105338-hyatt-celluloid": [
    {
      id: "hyatt-celluloid-plasticized-compounding",
      patentId: "us-105338-hyatt-celluloid",
      title: "Camphor-Plasticized Nitrocellulose Solid Solution & Thermoplastic Melt Compounding",
      category: "Polymer Chemistry & Plastics Engineering",
      rawLatex:
        "\\eta(T) = \\eta_0 \\exp\\left(\\frac{E_a}{R T}\\right) \\cdot (1 - w_{\\text{camphor}})^n \\quad \\text{and} \\quad T_g = \\frac{w_{\\text{NC}} T_{g,\\text{NC}} + k w_{\\text{camphor}} T_{g,\\text{camphor}}}{w_{\\text{NC}} + k w_{\\text{camphor}}}",
      colorizedLatex:
        "\\textcolor{#059669}{\\eta(T)} = \\eta_0 \\exp\\left(\\frac{\\textcolor{#dc2626}{E_a}}{R \\textcolor{#2563eb}{T}}\\right) \\cdot (1 - \\textcolor{#d97706}{w_{\\text{camphor}}})^n \\quad \\text{and} \\quad \\textcolor{#ea580c}{T_g} = \\frac{\\textcolor{#0891b2}{w_{\\text{NC}}} \\textcolor{#9333ea}{T_{g,\\text{NC}}} + k \\textcolor{#d97706}{w_{\\text{camphor}}} T_{g,\\text{camphor}}}{\\textcolor{#0891b2}{w_{\\text{NC}}} + k \\textcolor{#d97706}{w_{\\text{camphor}}}}",
      plainEnglishSentence: [
        { text: "Apparent thermoplastic " },
        { text: "melt compounding viscosity", variableId: "eta_melt" },
        { text: " drops with " },
        { text: "viscous activation energy barrier", variableId: "e_a" },
        { text: ", elevated " },
        { text: "molding temperature", variableId: "temp_k" },
        { text: ", and " },
        { text: "camphor plasticizer fraction", variableId: "w_camph" },
        { text: ", shifting " },
        { text: "glass transition temperature", variableId: "t_g" },
        { text: " of " },
        { text: "pyroxylin pulp fraction", variableId: "w_nc" },
        { text: " below " },
        { text: "unplasticized glass transition temperature", variableId: "tg_nc" },
        { text: "." },
      ],
      variables: [
        {
          id: "eta_melt",
          symbol: "\\eta(T)",
          name: "Thermoplastic Melt Viscosity",
          color: "emerald",
          role: "Apparent shear viscosity of the consolidated pyroxylin-camphor solid solution during compression molding ($10^3\\text{ to }10^5\\text{ Pa·s}$)",
          unit: "Pascal-seconds (Pa·s)",
          dimension: "[M L^-1 T^-1]",
          explanation:
            "Enables dense, bubble-free hydraulic consolidation into billiard balls, combs, buttons, and photographic film bases.",
          telemetryMetricLabel: "Melt Viscosity",
        },
        {
          id: "e_a",
          symbol: "E_a",
          name: "Viscous Flow Activation Energy",
          color: "crimson",
          role: "Thermal energy barrier required to mobilize nitrocellulose polymer chains ($60\\text{ to }90\\text{ kJ/mol}$)",
          unit: "kJ/mol",
          dimension: "[M L^2 T^-2 N^-1]",
          explanation:
            "Substantially lowered by the intercalation of small camphor molecules between bulky nitrate ester groups.",
        },
        {
          id: "temp_k",
          symbol: "T",
          name: "Hydraulic Mold Temperature",
          color: "sapphire",
          role: "Processing temperature applied to the closed compression die ($340\\text{ to }400\\text{ K} \\approx 65^\\circ\\text{C}\\text{ to }125^\\circ\\text{C}$)",
          unit: "Kelvin (K)",
          dimension: "[\\Theta]",
          explanation:
            "Melts and liquefies the comminuted solid camphor so it acts as an active molecular solvent inside the mold.",
          telemetryKey: "moldTemperatureC",
        },
        {
          id: "w_camph",
          symbol: "w_{\\text{camphor}}",
          name: "Camphor Plasticizer Weight Fraction",
          color: "amber",
          role: "Mass fraction of finely comminuted natural camphor gum blended into the wet pulp ($20\\%\\text{ to }35\\%$)",
          unit: "Weight percent (%)",
          dimension: "[1]",
          explanation:
            "Serves as the world's first synthetic polymer solid plasticizer, preventing nitrocellulose brittleness.",
          telemetryKey: "camphorFraction",
        },
        {
          id: "t_g",
          symbol: "T_g",
          name: "Consolidated Glass Transition Point",
          color: "coral",
          role: "Effective glass transition temperature of the cooled celluloid plastic ($75^\\circ\\text{C}\\text{ to }90^\\circ\\text{C}$)",
          unit: "Degrees Celsius (°C)",
          dimension: "[\\Theta]",
          explanation:
            "Provides high mechanical rigidity at room temperature while allowing thermoforming in hot water.",
        },
        {
          id: "w_nc",
          symbol: "w_{\\text{NC}}",
          name: "Pyroxylin Nitrocellulose Fraction",
          color: "cyan",
          role: "Mass fraction of wet-ground nitrated cellulose cotton pulp ($65\\%\\text{ to }80\\%$)",
          unit: "Weight percent (%)",
          dimension: "[1]",
          explanation:
            "Provides high tensile strength, polishable surface luster, and elastic resilience.",
        },
        {
          id: "tg_nc",
          symbol: "T_{g,\\text{NC}}",
          name: "Raw Nitrocellulose Glass Transition",
          color: "amethyst",
          role: "Glass transition temperature of pure unplasticized pyroxylin cotton ($175^\\circ\\text{C}$)",
          unit: "Degrees Celsius (°C)",
          dimension: "[\\Theta]",
          explanation:
            "Normally decomposes explosively before reaching thermal melt flow without camphor plasticizer.",
        },
      ],
      pedagogicalNote:
        "In the 1860s, natural elephant ivory was becoming scarce, threatening the game of billiards. John Wesley Hyatt invented Celluloid—the world's first synthetic commercial thermoplastic. By wet-grinding explosive pyroxylin (nitrocellulose) cotton with powdered camphor and heating the mixture under hydraulic pressure, Hyatt created a moldable, shatter-resistant plastic that replaced ivory and later became the flexible base for Thomas Edison's motion picture film.",
      claimRef: 2,
      historicalSignificance:
        "US 105338 launched the global plastics industry, ended the slaughter of elephants for ivory billiard balls and piano keys, and provided the flexible celluloid film strip that created Hollywood cinema.",
    },
  ],

  // 47. Louis Pasteur Fermentation & Microbial Control (US 135,245)
  "us-135245-pasteur-fermentation": [
    {
      id: "pasteur-fermentation-glycolysis-kinetics",
      patentId: "us-135245-pasteur-fermentation",
      title: "Anaerobic Glycolytic Fermentation Stoichiometry & Thermal Spoilage Inactivation",
      category: "Biochemical Engineering & Microbiology",
      rawLatex:
        "\\text{C}_6\\text{H}_{12}\\text{O}_6 \\xrightarrow{\\text{yeast}} 2\\,\\text{C}_2\\text{H}_5\\text{OH} + 2\\,\\text{CO}_2 + 2\\,\\text{ATP} \\quad \\text{and} \\quad \\ln\\left(\\frac{N(t)}{N_0}\\right) = -k_{\\text{thermal}}(T) \\cdot t",
      colorizedLatex:
        "\\textcolor{#059669}{\\text{C}_6\\text{H}_{12}\\text{O}_6} \\xrightarrow{\\text{yeast}} 2\\,\\textcolor{#2563eb}{\\text{C}_2\\text{H}_5\\text{OH}} + 2\\,\\textcolor{#d97706}{\\text{CO}_2} + 2\\,\\textcolor{#dc2626}{\\text{ATP}} \\quad \\text{and} \\quad \\ln\\left(\\frac{\\textcolor{#0891b2}{N(t)}}{\\textcolor{#9333ea}{N_0}}\\right) = -\\textcolor{#ea580c}{k_{\\text{thermal}}(T)} \\cdot t",
      plainEnglishSentence: [
        { text: "Anaerobic conversion of " },
        { text: "glucose carbohydrate substrate", variableId: "c_glucose" },
        { text: " yields " },
        { text: "ethanol alcohol", variableId: "c_ethanol" },
        { text: ", " },
        { text: "carbonic acid gas", variableId: "c_co2" },
        { text: ", and " },
        { text: "adenosine triphosphate energy", variableId: "c_atp" },
        { text: ", while " },
        { text: "surviving contaminant microbe count", variableId: "n_contam" },
        { text: " drops exponentially from " },
        { text: "initial wild bacterial count", variableId: "n_zero" },
        { text: " with " },
        { text: "thermal inactivation rate constant", variableId: "k_therm" },
        { text: "." },
      ],
      variables: [
        {
          id: "c_glucose",
          symbol: "\\text{C}_6\\text{H}_{12}\\text{O}_6",
          name: "Glucose Wort Carbohydrate Substrate",
          color: "emerald",
          role: "Hexose sugar substrate extracted from malted barley mash ($10\\%\\text{ to }16\\%\\text{ w/v}$ in unfermented wort)",
          unit: "Moles / Liter (M)",
          dimension: "[N L^-3]",
          explanation:
            "Metabolized anaerobically by pure Saccharomyces yeast cultures inside sealed oxygen-free fermentation casks.",
        },
        {
          id: "c_ethanol",
          symbol: "\\text{C}_2\\text{H}_5\\text{OH}",
          name: "Ethyl Alcohol Fermentation Product",
          color: "sapphire",
          role: "Ethanol yield produced during anaerobic carbohydrate fermentation ($4\\%\\text{ to }8\\%\\text{ ABV}$)",
          unit: "Moles / Liter (ABV %)",
          dimension: "[N L^-3]",
          explanation:
            "Primary alcoholic fermentation product, synthesized at high metabolic efficiency when air is expelled.",
          telemetryMetricLabel: "Ethanol Yield",
        },
        {
          id: "c_co2",
          symbol: "\\text{CO}_2",
          name: "Carbonic Acid Carbon Dioxide Gas",
          color: "amber",
          role: "Carbon dioxide gas generated during anaerobic fermentation or introduced from generator M M ($1.5\\text{ to }2.5\\text{ volumes}$)",
          unit: "Gas volume / liquid volume",
          dimension: "[1]",
          explanation:
            "Heavier than air, $\\text{CO}_2$ blankets the wort surface and displaces atmospheric oxygen through vents.",
        },
        {
          id: "c_atp",
          symbol: "\\text{ATP}",
          name: "Cellular Biochemical Energy Yield",
          color: "crimson",
          role: "Adenosine triphosphate synthesized to sustain yeast metabolic reproduction ($2\\text{ mol ATP / mol glucose}$)",
          unit: "Moles ATP",
          dimension: "[N]",
          explanation:
            "Provides the biochemical driving force for rapid pure-culture yeast reproduction under anaerobic conditions.",
        },
        {
          id: "n_contam",
          symbol: "N(t)",
          name: "Surviving Contaminant Microbe Count",
          color: "cyan",
          role: "Viable count of wild spoilage Acetobacter, lactic bacteria, and wild molds remaining per milliliter ($< 1\\text{ CFU/mL}$)",
          unit: "Colony forming units / mL (CFU/mL)",
          dimension: "[L^-3]",
          explanation:
            "Suppressed below detection thresholds by eliminating oxygen exposure and applying controlled thermal cooling.",
        },
        {
          id: "n_zero",
          symbol: "N_0",
          name: "Initial Wild Bacterial Inoculum",
          color: "amethyst",
          role: "Baseline concentration of airborne bacterial and fungal contaminants present in open unpasteurized wort ($10^4\\text{ to }10^6\\text{ CFU/mL}$)",
          unit: "CFU / mL",
          dimension: "[L^-3]",
          explanation:
            "Responsible for souring, cloudiness, and beer spoilage in traditional open-air cooling vats.",
        },
        {
          id: "k_therm",
          symbol: "k_{\\text{thermal}}(T)",
          name: "Thermal Inactivation Rate Constant",
          color: "coral",
          role: "First-order microbial death rate constant during hot-wort holding and controlled water-spray cooling ($0.1\\text{ to }1.5\\text{ s}^{-1}$ at $55^\\circ\\text{C}\\text{ to }65^\\circ\\text{C}$)",
          unit: "Inverse seconds (s^-1)",
          dimension: "[T^-1]",
          explanation:
            "Denatures microbial enzymes and sterilizes the liquid without scorching or degrading delicate volatile aromatic hops.",
          telemetryKey: "pasteurizationTempC",
        },
      ],
      pedagogicalNote:
        "Before Louis Pasteur's 1873 patent, brewing beer and wine was plagued by unpredictable souring and spoilage caused by airborne microbes, which brewers blamed on spontaneous generation. Pasteur proved that fermentation was caused by living yeast cells, showed that oxygen allowed wild bacteria to ruin the batch (the Pasteur Effect), and invented the closed-vessel carbon-dioxide expulsion and external water-spray cooling process that laid the foundation for modern industrial biotechnology and food pasteurization.",
      claimRef: 1,
      historicalSignificance:
        "US 135245 proved the Germ Theory of Disease in an industrial setting, created modern aseptic industrial bioprocessing, and protected global food and beverage supplies from bacterial contamination.",
    },
  ],

  // 48. Ottmar Mergenthaler Linotype (US 313,224)
  "us-313224-mergenthaler-linotype": [
    {
      id: "mergenthaler-linotype-slug-solidification",
      patentId: "us-313224-mergenthaler-linotype",
      title: "Matrix Gravity Chute Terminal Kinematics & Molten Type-Metal Mold Freezing",
      category: "Printing Technology & Metallurgy",
      rawLatex:
        "v_{\\text{matrix}} = \\sqrt{\\frac{2 g h_{\\text{magazine}}}{1 + \\mu \\cot\\theta}} \\quad \\text{and} \\quad t_{\\text{freeze}} = \\frac{\\rho_{\\text{slug}} V_{\\text{slug}} \\left[c_p (T_{\\text{cast}} - T_{\\text{solid}}) + L_f\\right]}{h_{\\text{mold}} A_{\\text{mold}} (T_{\\text{solid}} - T_{\\text{water}})}",
      colorizedLatex:
        "\\textcolor{#059669}{v_{\\text{matrix}}} = \\sqrt{\\frac{2 g \\textcolor{#2563eb}{h_{\\text{magazine}}}}{1 + \\textcolor{#d97706}{\\mu} \\cot\\textcolor{#9333ea}{\\theta}}} \\quad \\text{and} \\quad \\textcolor{#dc2626}{t_{\\text{freeze}}} = \\frac{\\textcolor{#0891b2}{\\rho_{\\text{slug}}} V_{\\text{slug}} \\left[c_p (\\textcolor{#ea580c}{T_{\\text{cast}}} - T_{\\text{solid}}) + L_f\\right]}{\\textcolor{#059669}{h_{\\text{mold}}} A_{\\text{mold}} (T_{\\text{solid}} - T_{\\text{water}})}",
      plainEnglishSentence: [
        { text: "Brass character matrix " },
        { text: "gravity chute delivery speed", variableId: "v_mat" },
        { text: " scales with " },
        { text: "magazine fall height", variableId: "h_mag" },
        { text: " over " },
        { text: "channel friction", variableId: "mu_fric" },
        { text: " and " },
        { text: "chute convergence angle", variableId: "theta" },
        { text: ", while " },
        { text: "slug mold freeze time", variableId: "t_freeze" },
        { text: " depends on " },
        { text: "type-metal alloy density", variableId: "rho_slug" },
        { text: ", " },
        { text: "pot casting temperature", variableId: "t_cast" },
        { text: ", and " },
        { text: "mold water-jacket heat transfer", variableId: "h_mold" },
        { text: "." },
      ],
      variables: [
        {
          id: "v_mat",
          symbol: "v_{\\text{matrix}}",
          name: "Matrix Chute Delivery Velocity",
          color: "emerald",
          role: "Terminal sliding velocity of brass letter matrices descending down converging chutes into the assembler elevator ($1.2\\text{ to }2.0\\text{ m/s}$)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Ensures smooth, jam-free grouping of matrices at operator typing speeds exceeding 300 characters per minute.",
          telemetryMetricLabel: "Matrix Velocity",
        },
        {
          id: "h_mag",
          symbol: "h_{\\text{magazine}}",
          name: "Vertical Magazine Fall Height",
          color: "sapphire",
          role: "Elevation drop from the top escapement mouth to the assembler star-wheel ($450\\text{ to }600\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Provides gravitational potential energy converted into downward kinetic delivery velocity.",
        },
        {
          id: "mu_fric",
          symbol: "\\mu",
          name: "Brass-on-Steel Kinetic Friction",
          color: "amber",
          role: "Sliding friction coefficient of polished brass matrices sliding through grooved brass/steel channels ($\\mu \\approx 0.12\\text{ to }0.18$)",
          unit: "Dimensionless friction coefficient",
          dimension: "[1]",
          explanation:
            "Minimized by precision machining and graphite dry lubrication to prevent matrix pileups.",
        },
        {
          id: "theta",
          symbol: "\\theta",
          name: "Chute Guide Convergence Angle",
          color: "amethyst",
          role: "Inclination angle of the front converging delivery chute relative to horizontal ($60^\\circ\\text{ to }75^\\circ$)",
          unit: "Degrees",
          dimension: "[1]",
          explanation:
            "Channels matrices from 90 magazine lanes into a single tight assembler elevator column.",
        },
        {
          id: "t_freeze",
          symbol: "t_{\\text{freeze}}",
          name: "Slug Solidification Duration",
          color: "crimson",
          role: "Duration required for molten alloy inside the water-cooled mold disc to solidify into a rigid printing slug ($0.8\\text{ to }1.5\\text{ s}$)",
          unit: "Seconds (s)",
          dimension: "[T]",
          explanation:
            "Rapid crystallization allows the mold disc to rotate immediately and eject the finished lead line slug.",
          telemetryMetricLabel: "Solidification Time",
        },
        {
          id: "rho_slug",
          symbol: "\\rho_{\\text{slug}}",
          name: "Type-Metal Alloy Density",
          color: "cyan",
          role: "Mass density of the ternary Linotype alloy ($84\\%\\text{ Pb}, 12\\%\\text{ Sb}, 4\\%\\text{ Sn} \\approx 10,400\\text{ kg/m}^3$)",
          unit: "kg/m^3",
          dimension: "[M L^-3]",
          explanation:
            "Antimony expands upon freezing, perfectly offsetting lead contraction to cast razor-sharp letter edges.",
        },
        {
          id: "t_cast",
          symbol: "T_{\\text{cast}}",
          name: "Molten Alloy Casting Temperature",
          color: "coral",
          role: "Temperature maintained inside the gas-heated crucible melting pot ($240^\\circ\\text{C}\\text{ to }260^\\circ\\text{C}$)",
          unit: "Degrees Celsius (°C)",
          dimension: "[\\Theta]",
          explanation:
            "Keeps alloy fully molten without overheating or causing excessive thermal dross oxidation.",
          telemetryKey: "metalTemperatureC",
        },
        {
          id: "h_mold",
          symbol: "h_{\\text{mold}}",
          name: "Mold Water-Cooled Heat Transfer",
          color: "emerald",
          role: "Overall convective heat transfer coefficient across the steel mold disc casting pocket ($800\\text{ to }1,500\\text{ W/(m}^2\\cdot\\text{K)}$)",
          unit: "W/(m^2·K)",
          dimension: "[M T^-3 \\Theta^-1]",
          explanation:
            "Extracts latent heat of fusion ($L_f \\approx 26\\text{ kJ/kg}$) rapidly into circulating cooling air/water.",
        },
      ],
      pedagogicalNote:
        "Before Ottmar Mergenthaler's 1885 patent, every letter of every newspaper and book on Earth had to be picked by hand from a type case, set upside-down in a composing stick, and laboriously sorted back into boxes after printing. Mergenthaler built a machine where striking a keyboard dropped brass letter molds (matrices) into a line, justified them with expanding space wedges, pumped molten lead alloy against them to cast a solid 'line-o'-type' slug in seconds, and automatically sorted matrices back into overhead channels using a 7-bit binary keyway distributor.",
      claimRef: 1,
      historicalSignificance:
        "US 313224 transformed global journalism and literature, enabling 60-page daily newspapers, mass paperback books, and universal public literacy, while pioneering early mechanical binary sorting combinatorics.",
    },
  ],

  // 49. Gottlieb Daimler Marine Engine (US 361,931)
  "us-361931-daimler-engine": [
    {
      id: "daimler-engine-propulsion-power",
      patentId: "us-361931-daimler-engine",
      title: "Marine Propeller Shaft Brake Power & Reversible Friction Cone Clutch Torque",
      category: "Marine Engineering & Internal Combustion Engines",
      rawLatex:
        "P_{\\text{brake}} = \\frac{2\\pi N_{\\text{rpm}} \\tau_{\\text{shaft}}}{60} \\quad \\text{and} \\quad \\tau_{\\text{clutch}} \\le \\mu_{\\text{cone}} F_{\\text{axial}} r_{\\text{mean}} \\csc\\alpha",
      colorizedLatex:
        "\\textcolor{#059669}{P_{\\text{brake}}} = \\frac{2\\pi \\textcolor{#2563eb}{N_{\\text{rpm}}} \\textcolor{#d97706}{\\tau_{\\text{shaft}}}}{60} \\quad \\text{and} \\quad \\textcolor{#dc2626}{\\tau_{\\text{clutch}}} \\le \\textcolor{#0891b2}{\\mu_{\\text{cone}}} \\textcolor{#ea580c}{F_{\\text{axial}}} \\textcolor{#9333ea}{r_{\\text{mean}}} \\csc\\textcolor{#059669}{\\alpha}",
      plainEnglishSentence: [
        { text: "Marine propeller " },
        { text: "delivered brake horsepower", variableId: "p_brake" },
        { text: " scales with " },
        { text: "crankshaft rotational speed", variableId: "n_rpm" },
        { text: " and " },
        { text: "engine shaft torque", variableId: "tau_shaft" },
        { text: ", while " },
        { text: "maximum clutch friction torque", variableId: "tau_clutch" },
        { text: " is multiplied by " },
        { text: "cone friction coefficient", variableId: "mu_cone" },
        { text: ", " },
        { text: "spring axial engagement force", variableId: "f_axial" },
        { text: ", " },
        { text: "mean clutch radius", variableId: "r_mean" },
        { text: ", and " },
        { text: "tapered cone angle", variableId: "alpha" },
        { text: "." },
      ],
      variables: [
        {
          id: "p_brake",
          symbol: "P_{\\text{brake}}",
          name: "Propeller Brake Power Output",
          color: "emerald",
          role: "Net continuous mechanical power transmitted to the marine propeller shaft ($1.5\\text{ to }4.0\\text{ HP} \\approx 1.1\\text{ to }3.0\\text{ kW}$)",
          unit: "Watts (W) / Horsepower",
          dimension: "[M L^2 T^-3]",
          explanation:
            "Drives the boat propeller directly through water without heavy steam boilers or coal bunkers.",
          telemetryMetricLabel: "Brake Power",
        },
        {
          id: "n_rpm",
          symbol: "N_{\\text{rpm}}",
          name: "Engine Crankshaft Speed",
          color: "sapphire",
          role: "Rotational operating speed of the four-stroke vertical gasoline engine ($600\\text{ to }900\\text{ RPM}$)",
          unit: "Revolutions / minute (RPM)",
          dimension: "[T^-1]",
          explanation:
            "Over three times faster than contemporary heavy stationary gas engines, yielding high power-to-weight ratio.",
          telemetryKey: "engineRpm",
        },
        {
          id: "tau_shaft",
          symbol: "\\tau_{\\text{shaft}}",
          name: "Crankshaft Delivered Torque",
          color: "amber",
          role: "Mean turning moment produced by four-stroke combustion expanding on the piston crown ($15\\text{ to }35\\text{ N·m}$)",
          unit: "Newton-meters (N·m)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "Smoothed by dual counter-rotating internal disc flywheels enclosed inside the sealed crankcase.",
        },
        {
          id: "tau_clutch",
          symbol: "\\tau_{\\text{clutch}}",
          name: "Transmissible Clutch Friction Torque",
          color: "crimson",
          role: "Maximum torque transmissible before clutch slipping occurs ($25\\text{ to }50\\text{ N·m}$)",
          unit: "Newton-meters (N·m)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "Must exceed engine peak torque pulsations to ensure positive forward propeller engagement.",
        },
        {
          id: "mu_cone",
          symbol: "\\mu_{\\text{cone}}",
          name: "Cone Clutch Friction Coefficient",
          color: "cyan",
          role: "Coefficient of static friction between the leather lining and cast-iron conical cup ($\\mu \\approx 0.25\\text{ to }0.35$)",
          unit: "Dimensionless friction",
          dimension: "[1]",
          explanation:
            "Provides smooth gradual engagement when maneuvering without stalling the engine.",
        },
        {
          id: "f_axial",
          symbol: "F_{\\text{axial}}",
          name: "Clutch Spring Axial Thrust",
          color: "coral",
          role: "Longitudinal engagement force exerted by the central helical clutch spring ($300\\text{ to }600\\text{ N}$)",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Assisted by forward propeller water thrust pushing the propeller shaft forward into firm clutch contact.",
        },
        {
          id: "r_mean",
          symbol: "r_{\\text{mean}}",
          name: "Mean Friction Cone Radius",
          color: "amethyst",
          role: "Effective radius of the conical friction contact surfaces ($90\\text{ to }120\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Leverage arm through which normal friction forces transmit rotary engine torque.",
        },
        {
          id: "alpha",
          symbol: "\\alpha",
          name: "Tapered Cone Face Wedge Angle",
          color: "emerald",
          role: "Semi-included cone taper angle relative to shaft centerline ($12^\\circ\\text{ to }15^\\circ$)",
          unit: "Degrees",
          dimension: "[1]",
          explanation:
            "Wedge action multiplies effective normal clamping force by $\\csc\\alpha \\approx 3.8\\text{ to }4.8$, preventing clutch slip with modest spring force.",
        },
      ],
      pedagogicalNote:
        "In 1886, Gottlieb Daimler installed his revolutionary high-speed, lightweight internal-combustion engine into a 4.5-meter boat on the River Neckar in Germany. To make it practical on water, US Patent 361,931 combined an in-line engine and propeller shaft with an enclosed dual-flywheel crankcase, a forward-and-reverse friction cone clutch, a thrust bearing that absorbed propeller push, and water-jacket cooling drawn directly from the surrounding river.",
      claimRef: 1,
      historicalSignificance:
        "US 361931 proved that lightweight gasoline engines could replace heavy steam boilers for vehicle and marine propulsion, directly enabling the motorboat and laying the engineering foundation for the modern automobile (Daimler-Benz / Mercedes-Benz).",
    },
  ],

  // 50. George Eastman Kodak Camera (US 388,850)
  "us-388850-eastman-kodak": [
    {
      id: "eastman-kodak-shutter-optics",
      patentId: "us-388850-eastman-kodak",
      title: "Rotating Barrel Shutter Exposure Duration & Continuous Roll-Film Capacity",
      category: "Optics, Photography & Precision Mechanisms",
      rawLatex:
        "t_{\\text{exposure}} = \\frac{w_{\\text{slit}}}{\\omega_{\\text{shutter}} R_{\\text{barrel}}} \\quad \\text{and} \\quad N_{\\text{exposures}} = \\frac{L_{\\text{film}}}{w_{\\text{frame}} + s_{\\text{margin}}}",
      colorizedLatex:
        "\\textcolor{#059669}{t_{\\text{exposure}}} = \\frac{\\textcolor{#2563eb}{w_{\\text{slit}}}}{\\textcolor{#d97706}{\\omega_{\\text{shutter}}} \\textcolor{#dc2626}{R_{\\text{barrel}}}} \\quad \\text{and} \\quad \\textcolor{#ea580c}{N_{\\text{exposures}}} = \\frac{\\textcolor{#0891b2}{L_{\\text{film}}}}{\\textcolor{#9333ea}{w_{\\text{frame}}} + s_{\\text{margin}}}",
      plainEnglishSentence: [
        { text: "Instantaneous photographic " },
        { text: "exposure duration", variableId: "t_exp" },
        { text: " scales with " },
        { text: "shutter aperture slit width", variableId: "w_slit" },
        { text: " over " },
        { text: "shutter rotation angular speed", variableId: "omega_shut" },
        { text: " and " },
        { text: "barrel radius", variableId: "r_barrel" },
        { text: ", while " },
        { text: "total roll-film exposure capacity", variableId: "n_exp" },
        { text: " equals " },
        { text: "continuous film strip length", variableId: "l_film" },
        { text: " divided by " },
        { text: "circular frame format width", variableId: "w_frame" },
        { text: " plus margin spacing." },
      ],
      variables: [
        {
          id: "t_exp",
          symbol: "t_{\\text{exposure}}",
          name: "Instantaneous Exposure Duration",
          color: "emerald",
          role: "Time duration during which the rotating barrel aperture admits light through the lens ($1/25\\text{ to }1/50\\text{ second} \\approx 20\\text{ to }40\\text{ ms}$)",
          unit: "Seconds (s) / Milliseconds",
          dimension: "[T]",
          explanation:
            "Fast enough to freeze walking pedestrians and outdoor action without blurring from handheld camera shake.",
          telemetryMetricLabel: "Exposure Time",
        },
        {
          id: "w_slit",
          symbol: "w_{\\text{slit}}",
          name: "Shutter Aperture Window Slit Width",
          color: "sapphire",
          role: "Arc width of the optical aperture cut into the cylindrical rotating brass barrel ($12\\text{ to }18\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Determines the optical window width sweeping across the fixed photographic doublet lens.",
        },
        {
          id: "omega_shut",
          symbol: "\\omega_{\\text{shutter}}",
          name: "Shutter Barrel Rotational Speed",
          color: "amber",
          role: "Angular velocity imparted to the barrel by the flat spiral torsion clockwork spring ($25\\text{ to }45\\text{ rad/s}$)",
          unit: "Radians / second (rad/s)",
          dimension: "[T^-1]",
          explanation:
            "Cocked by pulling an external top cord and released by a spring-loaded thumb trigger button.",
          telemetryKey: "shutterRpm",
        },
        {
          id: "r_barrel",
          symbol: "R_{\\text{barrel}}",
          name: "Rotating Shutter Cylinder Radius",
          color: "crimson",
          role: "Outer radius of the cylindrical barrel enclosing the photographic lens ($22\\text{ to }28\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Compact cylindrical geometry encloses the lens completely within the front camera compartment.",
        },
        {
          id: "n_exp",
          symbol: "N_{\\text{exposures}}",
          name: "Total Roll-Film Exposure Count",
          color: "coral",
          role: "Total number of circular photographic images captured on one pre-loaded factory spool ($N = 100\\text{ frames}$)",
          unit: "Exposures (count)",
          dimension: "[1]",
          explanation:
            "Enabled amateur photographers to shoot 100 pictures before sending the entire camera back to Kodak for factory development.",
          telemetryMetricLabel: "Film Capacity",
        },
        {
          id: "l_film",
          symbol: "L_{\\text{film}}",
          name: "Continuous Roll-Film Strip Length",
          color: "cyan",
          role: "Total length of paper-backed stripping gelatin silver-bromide film on the supply spool ($6.5\\text{ to }7.0\\text{ meters}$)",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation:
            "Flexible paper/nitrocellulose roll format replaced dozens of pounds of fragile, heavy glass plates.",
          telemetryKey: "filmLengthMeters",
        },
        {
          id: "w_frame",
          symbol: "w_{\\text{frame}}",
          name: "Circular Frame Image Diameter",
          color: "amethyst",
          role: "Diameter of the circular image exposed onto the film through the camera mask ($63.5\\text{ mm} = 2.5\\text{ inches}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Circular aperture eliminated lens corner aberrations, producing iconic round 1888 Kodak snapshots.",
        },
      ],
      pedagogicalNote:
        "Before George Eastman's 1888 patent, photography was an arduous craft: photographers carried tripods, darkroom tents, toxic chemicals, and fragile glass plates that had to be coated and developed wet on the spot. Eastman built a lightweight handheld wooden box camera pre-loaded with a 100-exposure flexible roll-film spool, a fixed-focus hyperfocal doublet lens, and a cylindrical rotating barrel shutter. His famous slogan summarized the revolution: 'You press the button, we do the rest.'",
      claimRef: 1,
      historicalSignificance:
        "US 388850 democratized photography worldwide, invented amateur consumer snapshots, established the Eastman Kodak Company, and supplied the flexible roll film that allowed Thomas Edison to invent motion picture cinema.",
    },
  ],

  // 51. Herman Hollerith Tabulating System (US 395,781)
  "us-395781-hollerith-tabulating": [
    {
      id: "hollerith-tabulating-solenoid-cadence",
      patentId: "us-395781-hollerith-tabulating",
      title: "Electromechanical Contact Pin Solenoid Force & Clock-Dial Register Cadence",
      category: "Computing Machinery & Information Processing",
      rawLatex:
        "F_{\\text{solenoid}} = \\frac{(N I)^2 \\mu_0 A_{\\text{core}}}{2 g^2} \\quad \\text{and} \\quad \\text{Cadence}_{\\text{cards}} = \\frac{60}{t_{\\text{press}} + t_{\\text{sort}}}",
      colorizedLatex:
        "\\textcolor{#059669}{F_{\\text{solenoid}}} = \\frac{(\\textcolor{#2563eb}{N} \\textcolor{#d97706}{I})^2 \\mu_0 \\textcolor{#dc2626}{A_{\\text{core}}}}{2 \\textcolor{#9333ea}{g^2}} \\quad \\text{and} \\quad \\textcolor{#ea580c}{\\text{Cadence}_{\\text{cards}}} = \\frac{60}{\\textcolor{#0891b2}{t_{\\text{press}}} + \\textcolor{#059669}{t_{\\text{sort}}}}",
      plainEnglishSentence: [
        { text: "Electromechanical register " },
        { text: "counter solenoid pulling force", variableId: "f_sol" },
        { text: " scales with " },
        { text: "coil turns", variableId: "n_turns" },
        { text: " and " },
        { text: "12V contact pulse current", variableId: "i_curr" },
        { text: " squared times " },
        { text: "iron core area", variableId: "a_core" },
        { text: " over " },
        { text: "armature gap clearance", variableId: "g_gap" },
        { text: ", driving " },
        { text: "continuous card tabulation cadence", variableId: "cad_cards" },
        { text: " from " },
        { text: "press dwell time", variableId: "t_press" },
        { text: " and " },
        { text: "sorting box deposit time", variableId: "t_sort" },
        { text: "." },
      ],
      variables: [
        {
          id: "f_sol",
          symbol: "F_{\\text{solenoid}}",
          name: "Counter Solenoid Magnetic Force",
          color: "emerald",
          role: "Electromagnetic pulling force developed on the ratchet pawl armature ($2.5\\text{ to }6.0\\text{ N}$)",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "Advances the clock-dial pointer by one tooth division every time a punch hole closes the 12-Volt circuit.",
          telemetryMetricLabel: "Solenoid Force",
        },
        {
          id: "n_turns",
          symbol: "N",
          name: "Solenoid Coil Winding Turns",
          color: "sapphire",
          role: "Number of insulated copper wire turns wound on the soft-iron electromagnet core ($400\\text{ to }800\\text{ turns}$)",
          unit: "Turns (count)",
          dimension: "[1]",
          explanation:
            "Multiplies magnetic flux density for rapid armature pull-in speeds ($t_{\\text{pull}} < 12\\text{ ms}$).",
        },
        {
          id: "i_curr",
          symbol: "I",
          name: "12V Circuit Pulse Current",
          color: "amber",
          role: "Electric current conducted from wet-cell chemical batteries through mercury cup contacts ($0.8\\text{ to }1.5\\text{ A}$ at $12\\text{ V}$)",
          unit: "Amperes (A)",
          dimension: "[I]",
          explanation:
            "Liquid mercury-wetted contacts eliminate mechanical contact bounce and oxide resistance.",
          telemetryKey: "circuitCurrentAmps",
        },
        {
          id: "a_core",
          symbol: "A_{\\text{core}}",
          name: "Iron Solenoid Core Area",
          color: "crimson",
          role: "Cross-sectional area of the soft-iron magnetic pole face ($1.2\\text{ to }2.0\\text{ cm}^2$)",
          unit: "Square meters (m^2)",
          dimension: "[L^2]",
          explanation:
            "Carries magnetic flux to actuate the clockwork gear register pointer without magnetic saturation.",
        },
        {
          id: "g_gap",
          symbol: "g",
          name: "Armature Air Gap Clearance",
          color: "amethyst",
          role: "Resting mechanical gap between the solenoid pole face and the pivoting iron armature ($1.5\\text{ to }3.0\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Force increases quadratically ($F \\propto 1/g^2$) as the armature closes toward the pole face.",
        },
        {
          id: "cad_cards",
          symbol: "\\text{Cadence}_{\\text{cards}}",
          name: "Tabulation Throughput Cadence",
          color: "coral",
          role: "Sustained rate of punched demographic census cards tabulated per minute ($50\\text{ to }80\\text{ cards/min}$)",
          unit: "Cards / minute (CPM)",
          dimension: "[T^-1]",
          explanation:
            "Processed the entire 1890 US Census of 62.9 million citizens in months rather than a full decade.",
          telemetryMetricLabel: "Tabulation Cadence",
        },
        {
          id: "t_press",
          symbol: "t_{\\text{press}}",
          name: "Press Actuation Dwell Time",
          color: "cyan",
          role: "Duration the operator holds the pin-board press down to register hole circuits ($0.35\\text{ to }0.50\\text{ s}$)",
          unit: "Seconds (s)",
          dimension: "[T]",
          explanation:
            "Sensing pins dip into mercury cups below punched holes while unpunched card stock insulates the remaining circuits.",
          telemetryKey: "pressDwellSec",
        },
        {
          id: "t_sort",
          symbol: "t_{\\text{sort}}",
          name: "Sorting Box Bin Deposit Time",
          color: "emerald",
          role: "Time for operator to drop the card into the compartment that automatically popped open ($0.40\\text{ to }0.60\\text{ s}$)",
          unit: "Seconds (s)",
          dimension: "[T]",
          explanation:
            "Relay Boolean combinatorial logic trips the solenoid latch of the designated demographic compartment.",
        },
      ],
      pedagogicalNote:
        "By 1888, the US Census was expanding so fast that hand-counting the 1890 Census was projected to take over a decade, meaning results would be obsolete before completion. Herman Hollerith encoded each citizen's demographic data as punched holes on paper cards. Lowering a press dipped spring-loaded brass pins through the holes into liquid mercury pools, completing electrical circuits that stepped clock-dial counters and popped open sorting bin doors—completing the 62.9-million-person count in months.",
      claimRef: 1,
      historicalSignificance:
        "US 395781 launched the automated data processing industry; Hollerith founded the Tabulating Machine Company in 1896, which later became **IBM (International Business Machines)**.",
    },
  ],

  // 52. Jesse Reno Escalator (US 470,918)
  "us-470918-reno-escalator": [
    {
      id: "reno-escalator-throughput-safety",
      patentId: "us-470918-reno-escalator",
      title: "Continuous Inclined Cleated Treadway Conveyance & Comb-Plate Transition Safety",
      category: "Mechanical Engineering & Public Transit Architecture",
      rawLatex:
        "\\dot{N}_{\\text{passenger}} = \\frac{v_{\\text{belt}} \\cdot w_{\\text{step}}}{L_{\\text{pass}}} \\quad \\text{and} \\quad \\tau_{\\text{motor}} = \\frac{R_{\\text{sprocket}}}{\\eta_{\\text{gear}}} \\sum m_i g (\\sin\\theta + \\mu \\cos\\theta)",
      colorizedLatex:
        "\\textcolor{#059669}{\\dot{N}_{\\text{passenger}}} = \\frac{\\textcolor{#2563eb}{v_{\\text{belt}}} \\cdot \\textcolor{#d97706}{w_{\\text{step}}}}{\\textcolor{#dc2626}{L_{\\text{pass}}}} \\quad \\text{and} \\quad \\textcolor{#ea580c}{\\tau_{\\text{motor}}} = \\frac{\\textcolor{#0891b2}{R_{\\text{sprocket}}}}{\\eta_{\\text{gear}}} \\sum m_i g (\\sin\\textcolor{#9333ea}{\\theta} + \\textcolor{#059669}{\\mu} \\cos\\textcolor{#9333ea}{\\theta})",
      plainEnglishSentence: [
        { text: "Continuous inclined " },
        { text: "passenger transit throughput", variableId: "n_pass" },
        { text: " scales with " },
        { text: "treadway linear velocity", variableId: "v_belt" },
        { text: " and " },
        { text: "step cleat width", variableId: "w_step" },
        { text: " over " },
        { text: "passenger safety spacing", variableId: "l_pass" },
        { text: ", while " },
        { text: "drive machine torque", variableId: "tau_mot" },
        { text: " balances " },
        { text: "drive sprocket radius", variableId: "r_sprock" },
        { text: " across " },
        { text: "incline angle", variableId: "theta" },
        { text: " and " },
        { text: "rolling friction", variableId: "mu_fric" },
        { text: "." },
      ],
      variables: [
        {
          id: "n_pass",
          symbol: "\\dot{N}_{\\text{passenger}}",
          name: "Continuous Passenger Transit Capacity",
          color: "emerald",
          role: "Theoretical continuous transit flow capacity ($4,000\\text{ to }7,200\\text{ persons/hour}$)",
          unit: "Passengers / hour",
          dimension: "[T^-1]",
          explanation:
            "Over 20 times higher passenger volume than a bank of vertical elevators occupying the same building volume.",
          telemetryMetricLabel: "Passenger Capacity",
        },
        {
          id: "v_belt",
          symbol: "v_{\\text{belt}}",
          name: "Treadway Linear Conveyance Velocity",
          color: "sapphire",
          role: "Steady-state linear traveling speed of the continuous cleated tread deck ($0.40\\text{ to }0.55\\text{ m/s}$)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Synchronized in 1:1 speed ratio with the moving handrails to ensure passenger comfort and balance.",
          telemetryKey: "escalatorSpeedMps",
        },
        {
          id: "w_step",
          symbol: "w_{\\text{step}}",
          name: "Transverse Step Cleat Width",
          color: "amber",
          role: "Usable width of the ridged ash-wood step cleats ($0.9\\text{ to }1.2\\text{ m} \\approx 3\\text{ to }4\\text{ feet}$)",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation: "Allows two passengers to ride abreast comfortably side by side.",
        },
        {
          id: "l_pass",
          symbol: "L_{\\text{pass}}",
          name: "Longitudinal Passenger Spacing",
          color: "crimson",
          role: "Average center-to-center longitudinal distance between successive riding passengers ($0.50\\text{ m}$)",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation: "Determined by natural human walking and standing spatial envelope.",
        },
        {
          id: "tau_mot",
          symbol: "\\tau_{\\text{motor}}",
          name: "Main Drive Machine Shaft Torque",
          color: "coral",
          role: "Mechanical driving torque delivered by the electric drive motor ($350\\text{ to }800\\text{ N·m}$)",
          unit: "Newton-meters (N·m)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "Elevates full live passenger load smoothly against gravity up floor-to-floor heights.",
          telemetryMetricLabel: "Motor Torque",
        },
        {
          id: "r_sprock",
          symbol: "R_{\\text{sprocket}}",
          name: "Drive Head Sprocket Pitch Radius",
          color: "cyan",
          role: "Effective pitch radius of the cast-steel head drive sprockets ($190\\text{ mm}$)",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "Pulls twin heavy-duty link roller chains around the upper landing turnaround.",
        },
        {
          id: "theta",
          symbol: "\\theta",
          name: "Incline Angle of Escalator Truss",
          color: "amethyst",
          role: "Slope angle of the structural Pratt truss relative to floor horizontal ($25^\\circ\\text{ to }30^\\circ$)",
          unit: "Degrees",
          dimension: "[1]",
          explanation:
            "Standard architectural angle balancing vertical ascent speed with passenger balance security.",
        },
        {
          id: "mu_fric",
          symbol: "\\mu",
          name: "Track Roller Rolling Resistance",
          color: "emerald",
          role: "Coefficient of rolling friction of the hardened steel chain rollers along the guide tracks ($\\mu \\approx 0.02\\text{ to }0.04$)",
          unit: "Dimensionless friction",
          dimension: "[1]",
          explanation: "Kept low by enclosed oil-bath lubrication and ground trackways.",
        },
      ],
      pedagogicalNote:
        "In 1892, Jesse Reno patented the first working escalator: the 'Inclined Elevator.' Rather than stepped stairs that flattened, Reno used an endless belt of wooden cleats traveling up a 25-degree incline at a comfortable walking pace. To prevent riders from getting clothing or footwear crushed where the belt disappeared beneath the floor, Reno invented the stationary comb-plate: steel teeth that nested into the grooved cleats, gently lifting riders' feet onto the upper landing.",
      claimRef: 1,
      historicalSignificance:
        "US 470918 created the modern escalator; Reno installed the first operational unit at Coney Island in 1896 (carrying 75,000 riders in two weeks), and his comb-plate safety geometry remains mandatory on every escalator worldwide today.",
    },
  ],

  // 53. Nikola Tesla Teleautomaton Radio-Controlled Boat (US 613,809)
  "us-613809-tesla-teleautomaton": [
    {
      id: "tesla-teleautomaton-coherer-tuning",
      patentId: "us-613809-tesla-teleautomaton",
      title: "Coherer RF Demodulation Resonance & Multi-Channel Stepper State Machine",
      category: "Wireless Communications & Robotics",
      rawLatex:
        "f_0 = \\frac{1}{2\\pi \\sqrt{L_{\\text{tank}} C_{\\text{tank}}}} \\quad \\text{and} \\quad R_{\\text{cohered}} \\approx \\frac{R_0}{1 + \\beta |E_{\\text{RF}}|^2}",
      colorizedLatex:
        "\\textcolor{#059669}{f_0} = \\frac{1}{2\\pi \\sqrt{\\textcolor{#2563eb}{L_{\\text{tank}}} \\textcolor{#d97706}{C_{\\text{tank}}}}} \\quad \\text{and} \\quad \\textcolor{#ea580c}{R_{\\text{cohered}}} \\approx \\frac{\\textcolor{#dc2626}{R_0}}{1 + \\beta |\\textcolor{#0891b2}{E_{\\text{RF}}}|^2}",
      plainEnglishSentence: [
        { text: "Tuned radio " },
        { text: "carrier resonant frequency", variableId: "f_0" },
        { text: " is determined by " },
        { text: "tank inductor inductance", variableId: "l_tank" },
        { text: " and " },
        { text: "tank capacitor capacitance", variableId: "c_tank" },
        { text: ", where incident " },
        { text: "radio wave field strength", variableId: "e_rf" },
        { text: " triggers " },
        { text: "coherer conduction resistance", variableId: "r_coh" },
        { text: " to drop from " },
        { text: "uncohered open-circuit resistance", variableId: "r_0" },
        { text: "." },
      ],
      variables: [
        {
          id: "f_0",
          symbol: "f_0",
          name: "Tuned Radio Carrier Frequency",
          color: "emerald",
          role: "Resonant carrier frequency of the spark-gap transmitter and vessel antenna ($2.0\\text{ to }5.0\\text{ MHz}$)",
          unit: "Megahertz (MHz)",
          dimension: "[T^-1]",
          explanation:
            "First historical implementation of tuned multi-frequency selective wireless remote control.",
          telemetryMetricLabel: "Carrier Frequency",
        },
        {
          id: "l_tank",
          symbol: "L_{\\text{tank}}",
          name: "Receiver Tank Inductance",
          color: "sapphire",
          role: "Inductance of the adjustable air-core receiver tuning inductor coil ($15\\text{ to }50\\;\\mu\\text{H}$)",
          unit: "Microhenries (μH)",
          dimension: "[M L^2 T^-2 I^-2]",
          explanation: "Forms a high-Q resonant circuit matching the transmitter spark frequency.",
        },
        {
          id: "c_tank",
          symbol: "C_{\\text{tank}}",
          name: "Receiver Tank Capacitance",
          color: "amber",
          role: "Capacitance of the tuned Leyden jar / mica receiving capacitor ($200\\text{ to }800\\text{ pF}$)",
          unit: "Picofarads (pF)",
          dimension: "[M^-1 L^-2 T^4 I^2]",
          explanation:
            "Adjusted to selectively discriminate against unauthorized signals and radio interference.",
        },
        {
          id: "r_coh",
          symbol: "R_{\\text{cohered}}",
          name: "Active Cohered Tube Resistance",
          color: "coral",
          role: "Electrical resistance of the coherer during RF signal reception ($20\\text{ to }50\\;\\Omega$)",
          unit: "Ohms (Ω)",
          dimension: "[M L^2 T^-3 I^-2]",
          explanation:
            "Microscopic spark breakdown welds metallic filings, closing the relay circuit that steps the logic drum.",
          telemetryMetricLabel: "Coherer Resistance",
        },
        {
          id: "r_0",
          symbol: "R_0",
          name: "Uncohered Resting Resistance",
          color: "crimson",
          role: "Resting electrical resistance across oxide-coated metallic filings before radio wave arrival ($> 100\\text{ k}\\Omega$)",
          unit: "Kilohms (kΩ)",
          dimension: "[M L^2 T^-3 I^-2]",
          explanation:
            "Acts as an open circuit; reset after each pulse by a motorized mechanical decoherer tapper.",
        },
        {
          id: "e_rf",
          symbol: "E_{\\text{RF}}",
          name: "Radio Wave Electric Field Strength",
          color: "cyan",
          role: "Incident high-frequency radio electromagnetic field intercepted by the vertical mast antenna ($> 10\\text{ V/m}$)",
          unit: "Volts / meter (V/m)",
          dimension: "[M L T^-3 I^-1]",
          explanation:
            "Radiated across the arena by Tesla's high-voltage spark oscillator transmitter.",
          telemetryKey: "signalFieldStrength",
        },
      ],
      pedagogicalNote:
        "At Madison Square Garden in 1898, Nikola Tesla astounded the public with a 6-foot iron boat that moved through a large indoor water basin with no wires attached. Spectators claimed it was telepathy or a trained monkey inside. In reality, Tesla transmitted tuned radio wave pulses that triggered a sensitive coherer tube, which stepped a rotary electromechanical logic cylinder to control rudder servos, incandescent signal lamps, and electric motor speed.",
      claimRef: 1,
      historicalSignificance:
        "US 613809 is the foundational patent for all wireless robotics, radio-controlled vehicles, drone warfare, guided missiles, remote telemetry, and spacecraft automation.",
    },
  ],

  // 54. Ferdinand von Zeppelin Rigid Airship (US 621,195)
  "us-621195-zeppelin-airship": [
    {
      id: "zeppelin-airship-buoyant-aerodynamics",
      patentId: "us-621195-zeppelin-airship",
      title: "Multi-Cell Hydrogen Aerostatic Gross Lift & Rigid Aluminum Truss Hull Aerodynamics",
      category: "Aeronautics & Structural Space-Frames",
      rawLatex:
        "L_{\\text{gross}} = (\\rho_{\\text{air}} - \\rho_{\\text{H}_2}) g \\sum_{i=1}^{N_{\\text{cells}}} V_i \\quad \\text{and} \\quad T_{\\text{thrust}} = \\frac{1}{2} \\rho_{\\text{air}} v_{\\text{airship}}^2 C_D A_{\\text{hull}}",
      colorizedLatex:
        "\\textcolor{#059669}{L_{\\text{gross}}} = (\\textcolor{#2563eb}{\\rho_{\\text{air}}} - \\textcolor{#d97706}{\\rho_{\\text{H}_2}}) g \\sum_{i=1}^{\\textcolor{#dc2626}{N_{\\text{cells}}}} \\textcolor{#0891b2}{V_i} \\quad \\text{and} \\quad \\textcolor{#ea580c}{T_{\\text{thrust}}} = \\frac{1}{2} \\textcolor{#2563eb}{\\rho_{\\text{air}}} \\textcolor{#9333ea}{v_{\\text{airship}}^2} \\textcolor{#059669}{C_D} \\textcolor{#d97706}{A_{\\text{hull}}}",
      plainEnglishSentence: [
        { text: "Total aerostatic " },
        { text: "gross buoyant lift", variableId: "l_gross" },
        { text: " equals difference between " },
        { text: "ambient air density", variableId: "rho_air" },
        { text: " and " },
        { text: "hydrogen gas density", variableId: "rho_h2" },
        { text: " across " },
        { text: "subdivided gas cells", variableId: "n_cells" },
        { text: " of " },
        { text: "individual cell volume", variableId: "v_cell" },
        { text: ", while " },
        { text: "forward propeller thrust", variableId: "t_thrust" },
        { text: " balances aerodynamic drag at " },
        { text: "cruising flight airspeed", variableId: "v_air" },
        { text: " with " },
        { text: "hull drag coefficient", variableId: "c_d" },
        { text: " and " },
        { text: "hull frontal area", variableId: "a_hull" },
        { text: "." },
      ],
      variables: [
        {
          id: "l_gross",
          symbol: "L_{\\text{gross}}",
          name: "Total Aerostatic Gross Buoyant Lift",
          color: "emerald",
          role: "Total upward aerostatic lift force generated by displaced atmospheric air ($120\\text{ to }250\\text{ kN} \\approx 12\\text{ to }25\\text{ metric tons}$)",
          unit: "Kilonewtons (kN)",
          dimension: "[M L T^-2]",
          explanation:
            "Suspends the entire 128-meter aluminum space-frame hull, two Daimler engines, crew, passengers, and fuel in buoyant equilibrium.",
          telemetryMetricLabel: "Gross Lift",
        },
        {
          id: "rho_air",
          symbol: "\\rho_{\\text{air}}",
          name: "Ambient Atmospheric Air Density",
          color: "sapphire",
          role: "Density of dry sea-level air ($1.225\\text{ kg/m}^3$ at standard temperature and pressure)",
          unit: "kg/m^3",
          dimension: "[M L^-3]",
          explanation:
            "Decreases with altitude, setting the maximum static flight ceiling (pressure height).",
        },
        {
          id: "rho_h2",
          symbol: "\\rho_{\\text{H}_2}",
          name: "Contained Hydrogen Lifting Gas Density",
          color: "amber",
          role: "Mass density of pure gaseous diatomic hydrogen ($0.089\\text{ kg/m}^3$ at STP)",
          unit: "kg/m^3",
          dimension: "[M L^-3]",
          explanation:
            "Lightest gas in the universe, providing $1.136\\text{ kg}$ of buoyant lift per cubic meter at sea level.",
        },
        {
          id: "n_cells",
          symbol: "N_{\\text{cells}}",
          name: "Independent Subdivided Gas Cells",
          color: "crimson",
          role: "Number of separate rubberized cotton gasbags installed within internal transverse frame bays ($N = 17\\text{ cells}$)",
          unit: "Cells (count)",
          dimension: "[1]",
          explanation:
            "Prevents total lift loss if a single gasbag punctures, mirroring naval watertight bulkheads.",
        },
        {
          id: "v_cell",
          symbol: "V_i",
          name: "Individual Gas Cell Volume",
          color: "cyan",
          role: "Internal volume of each cylindrical hydrogen gasbag ($600\\text{ to }800\\text{ m}^3$)",
          unit: "Cubic meters (m^3)",
          dimension: "[L^3]",
          explanation: "Total gas capacity of $11,300\\text{ m}^3$ inside the LZ-1 rigid envelope.",
          telemetryKey: "gasVolumeM3",
        },
        {
          id: "t_thrust",
          symbol: "T_{\\text{thrust}}",
          name: "Total Engine Propeller Thrust",
          color: "coral",
          role: "Combined forward propulsive thrust from four outrigger aluminum propellers ($2.4\\text{ to }5.0\\text{ kN}$)",
          unit: "Kilonewtons (kN)",
          dimension: "[M L T^-2]",
          explanation:
            "Driven by twin 16-horsepower Daimler internal combustion engines housed in suspended gondolas.",
          telemetryMetricLabel: "Forward Thrust",
        },
        {
          id: "v_air",
          symbol: "v_{\\text{airship}}",
          name: "Forward Flight Airspeed",
          color: "amethyst",
          role: "True airspeed of the dirigible through surrounding atmosphere ($25\\text{ to }35\\text{ km/h} \\approx 7\\text{ to }10\\text{ m/s}$)",
          unit: "Meters / second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Maintains steerageway across aerodynamic rudders independent of prevailing wind currents.",
          telemetryKey: "airspeedKmh",
        },
        {
          id: "c_d",
          symbol: "C_D",
          name: "Streamlined Hull Drag Coefficient",
          color: "emerald",
          role: "Total aerodynamic drag coefficient of the cylindrical hull with conical bow and stern ($C_D \\approx 0.025\\text{ to }0.040$)",
          unit: "Dimensionless drag coefficient",
          dimension: "[1]",
          explanation:
            "Low drag profile allows modest engine power to propel a 128-meter vessel at cruising speed.",
        },
        {
          id: "a_hull",
          symbol: "A_{\\text{hull}}",
          name: "Hull Frontal Cross-Sectional Area",
          color: "amber",
          role: "Maximum circular frontal cross section of the 11.7-meter diameter hull ($A_{\\text{hull}} \\approx 107\\text{ m}^2$)",
          unit: "Square meters (m^2)",
          dimension: "[L^2]",
          explanation: "Governs aerodynamic form drag opposing forward travel.",
        },
      ],
      pedagogicalNote:
        "Prior to Count Ferdinand von Zeppelin's 1899 patent, non-rigid balloons (blimps) collapsed or buckled under high speeds and could not maintain shape when gas was vented. Zeppelin enclosed multiple independent hydrogen gasbags inside a rigid, lightweight aluminum and wire lattice truss hull covered by a taut doped-fabric skin. Even if multiple gas cells ruptured, the rigid outer framework preserved aerodynamic stability and kept engines, rudders, and passenger cars firmly aligned.",
      claimRef: 1,
      historicalSignificance:
        "US 621195 created the rigid airship (Zeppelin), founded the world's first commercial airline (DELAG in 1909), achieved the first non-stop passenger round-the-world flights, and pioneered lightweight metal space-frame structures used in modern aerospace fuselages.",
    },
  ],
};

/**
 * Universal fallback builder that constructs a valid ColorizedEquation from
 * a patent's PATENT_PHYSICS_REGISTRY definition or scientific principles.
 */
function _buildGeneratedColorizedEquation(patentId: string): ColorizedEquation[] {
  const reg = PATENT_PHYSICS_REGISTRY[patentId];
  if (!reg) return [];

  const rawLatex = reg.governingEquation || "F = m \\cdot a";

  // Build variables from registry controls
  const variables = reg.controls.map((c, idx) => {
    const colors: Array<
      "crimson" | "sapphire" | "emerald" | "amber" | "amethyst" | "cyan" | "coral" | "rose" | "teal"
    > = ["sapphire", "emerald", "amber", "crimson", "amethyst", "cyan", "coral", "rose", "teal"];
    const color = colors[idx % colors.length];
    return {
      id: c.id,
      symbol: c.id.toUpperCase(),
      name: c.label,
      color,
      role: `Parameter controlling ${c.label.toLowerCase()} in the physical simulation`,
      unit: c.unit || "SI Units",
      explanation: `Adjusting ${c.label} modulates real-time physical telemetry states and governing forces in the simulated mechanism.`,
      telemetryKey: c.id,
      formatValue: (v: number) => `${v.toFixed(2)} ${c.unit}`,
    };
  });

  const fragments = [
    { text: "The governing physical relationship for " },
    {
      text: reg.equationName || "this mechanism",
      variableId: variables[0]?.id,
    },
    { text: " describes how " },
    ...(variables[1]
      ? [
          {
            text: variables[1].name.toLowerCase(),
            variableId: variables[1].id,
          },
          { text: " and " },
        ]
      : []),
    ...(variables[2]
      ? [
          {
            text: variables[2].name.toLowerCase(),
            variableId: variables[2].id,
          },
          { text: " govern " },
        ]
      : []),
    {
      text: "system equilibrium and energy transfer according to first principles.",
    },
  ];

  return [
    {
      id: `${patentId}-governing-equation`,
      patentId,
      title: reg.equationName || "Physical Governing Law & Equation",
      category: reg.domainTitle || "Applied Physics & Mechanics",
      rawLatex,
      colorizedLatex: rawLatex,
      plainEnglishSentence: fragments,
      variables:
        variables.length > 0
          ? variables
          : [
              {
                id: "var_primary",
                symbol: "X",
                name: "Equilibrium State",
                color: "sapphire",
                role: "Physical state equilibrium",
                unit: "SI Units",
                explanation: "Dynamic physical equilibrium governing the mechanism.",
              },
            ],
      pedagogicalNote:
        reg.pedagogicalInsight ||
        "This equation models the direct mechanical and physical forces documented in the original patent specification.",
    },
  ];
}

function formatSymbolForDisplay(sym: string): string {
  const greekMap: Record<string, string> = {
    "\\alpha": "Alpha (α)",
    "\\beta": "Beta (β)",
    "\\gamma": "Gamma (γ)",
    "\\delta": "Delta (δ)",
    "\\epsilon": "Epsilon (ε)",
    "\\varepsilon": "Epsilon (ε)",
    "\\zeta": "Zeta (ζ)",
    "\\eta": "Eta (η)",
    "\\theta": "Theta (θ)",
    "\\vartheta": "Theta (θ)",
    "\\iota": "Iota (ι)",
    "\\kappa": "Kappa (κ)",
    "\\lambda": "Lambda (λ)",
    "\\mu": "Mu (μ)",
    "\\nu": "Nu (ν)",
    "\\xi": "Xi (ξ)",
    "\\pi": "Pi (π)",
    "\\rho": "Rho (ρ)",
    "\\sigma": "Sigma (σ)",
    "\\tau": "Tau (τ)",
    "\\upsilon": "Upsilon (υ)",
    "\\phi": "Phi (φ)",
    "\\varphi": "Phi (φ)",
    "\\chi": "Chi (χ)",
    "\\psi": "Psi (ψ)",
    "\\omega": "Omega (ω)",
    "\\Gamma": "Gamma (Γ)",
    "\\Delta": "Delta (Δ)",
    "\\Theta": "Theta (Θ)",
    "\\Lambda": "Lambda (Λ)",
    "\\Xi": "Xi (Ξ)",
    "\\Pi": "Pi (Π)",
    "\\Sigma": "Sigma (Σ)",
    "\\Phi": "Phi (Φ)",
    "\\Psi": "Psi (Ψ)",
    "\\Omega": "Omega (Ω)",
    "\\hbar": "h-bar (ℏ)",
  };
  const base = sym.replace(/[_^].*$/, "");
  if (greekMap[sym]) return greekMap[sym];
  if (greekMap[base]) {
    const sub = sym.replace(/^[^_^]+/, "").replace(/[{}\\]/g, "");
    return `${greekMap[base]} ${sub ? `(${sub})` : "term"}`;
  }
  const clean = sym
    .replace(/^\\vec\{([a-zA-Z0-9_]+)\}/, "$1 Vector")
    .replace(/^\\(?:text|mathrm|mathbf|mathit|mathsf)\{/, "")
    .replace(/\}$/, "")
    .replace(/\\_/g, " ")
    .replace(/[{}]/g, "");
  return `Parameter (${clean})`;
}

function cleanNameForSentence(name: string): string {
  if (name.includes(" / ")) {
    return name.split(" / ")[0].toLowerCase();
  }
  return name.toLowerCase();
}

/**
 * Intelligently converts any ScientificPrinciple with a LaTeX formula into a full-fledged ColorizedEquation.
 * Uses domain-aware context detection (optics, computing, aerodynamics, thermodynamics, electromagnetics, materials)
 * to assign rigorous SI units, physical dimensions, mechanism roles, and natural language explanations.
 */
function _convertScientificPrincipleToColorizedEquation(
  principle: ScientificPrinciple,
  patentId: string,
  index: number,
  category = "Applied Physics & Mechanics",
): ColorizedEquation | null {
  const formula = principle.formula?.trim();
  if (!formula) return null;

  const eqId = `${patentId}-principle-${index + 1}-${principle.principle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;

  // Palette of semantic colors
  const colorSequence: ColorVariant[] = [
    "emerald",
    "sapphire",
    "amber",
    "crimson",
    "amethyst",
    "cyan",
    "coral",
    "teal",
    "rose",
  ];

  // Exclude mathematical operators, common formatting macros, and dimensionless syntax keywords
  const mathBlacklist = new Set([
    "\\frac",
    "\\sqrt",
    "\\cdot",
    "\\times",
    "\\quad",
    "\\qquad",
    "\\left",
    "\\right",
    "\\cos",
    "\\sin",
    "\\tan",
    "\\exp",
    "\\ln",
    "\\log",
    "\\int",
    "\\sum",
    "\\partial",
    "\\approx",
    "\\le",
    "\\ge",
    "\\ne",
    "\\pm",
    "\\mp",
    "\\to",
    "\\infty",
    "\\Delta",
    "\\nabla",
    "\\text",
    "\\hat",
    "\\dot",
    "\\ddot",
    "\\dddot",
    "\\bar",
    "\\tilde",
    "\\vec",
    "\\circ",
    "\\implies",
    "\\overline",
    "\\mathcal",
    "\\begin",
    "\\end",
    "\\cases",
    "\\xrightarrow",
    "\\mathbf",
    "\\mathrm",
    "\\mathit",
    "\\mathsf",
    "\\mathtt",
    "\\boldsymbol",
    "and",
    "or",
    "min",
    "max",
    "vs",
    "\\pi",
    "\\langle",
    "\\rangle",
    "\\propto",
    "\\gg",
    "\\ll",
    "\\sim",
    "\\equiv",
    "\\perp",
    "\\in",
    "\\subset",
    "\\leq",
    "\\geq",
    "\\prod",
    "\\coprod",
    "\\oint",
    "\\cosh",
    "\\sinh",
    "\\tanh",
    "\\forall",
    "\\exists",
  ]);

  // Robust LaTeX Math Token Extraction
  const tokenRegex =
    /\\(?:text|mathrm|mathbf|mathit|mathsf|mathtt)\{[^{}]*\}|\\vec\{[a-zA-Z]+\}(?:\([a-zA-Z0-9_+-]+\))?(?:_(?:\{[^{}]*\}|[a-zA-Z0-9]+))?|\\[a-zA-Z]+(?:_(?:\{[^{}]*\}|[a-zA-Z0-9]+))?(?:\^(?:\{[^{}]*\}|[a-zA-Z0-9]+))?|[a-zA-Z](?:_(?:\{[^{}]*\}|[a-zA-Z0-9]+))?(?:\^(?:\{[^{}]*\}|[a-zA-Z0-9]+))?/g;

  const rawTokens: string[] = [];
  const seenSymbols = new Set<string>();
  let match: RegExpExecArray | null = tokenRegex.exec(formula);

  while (match !== null) {
    const sym = match[0];
    if (sym.startsWith("\\text{") || sym.startsWith("\\mathrm{") || sym.startsWith("\\mathbf{")) {
      const inner = sym
        .replace(/^\\(?:text|mathrm|mathbf|mathit)\{/, "")
        .replace(/\}$/, "")
        .trim();
      if (["AR", "EV", "COP", "CTE", "MTTF", "ID", "IP", "MT", "CPI"].includes(inner)) {
        if (!seenSymbols.has(sym)) {
          seenSymbols.add(sym);
          rawTokens.push(sym);
        }
      }
    } else {
      const baseCmd = sym.replace(/[_^].*$/, "");
      if (
        !mathBlacklist.has(sym) &&
        !mathBlacklist.has(baseCmd) &&
        sym !== "d" &&
        sym !== "dt" &&
        sym !== "dx" &&
        sym !== "dy"
      ) {
        if (!seenSymbols.has(sym)) {
          seenSymbols.add(sym);
          rawTokens.push(sym);
        }
      }
    }
    match = tokenRegex.exec(formula);
  }

  // Fallback if no variable tokens found
  if (rawTokens.length === 0) {
    rawTokens.push("X", "Y");
  }

  // Topic Context Detection
  const pLower = `${principle.principle} ${principle.explanation} ${patentId}`.toLowerCase();
  const isOptics =
    category === "optics" ||
    pLower.includes("camera") ||
    pLower.includes("lens") ||
    pLower.includes("photograph") ||
    pLower.includes("hyperfocal") ||
    pLower.includes("sensitometry") ||
    pLower.includes("exposure") ||
    pLower.includes("emulsion") ||
    pLower.includes("shutter") ||
    pLower.includes("focal length") ||
    pLower.includes("f-number");

  const isComputing =
    category === "computing" ||
    pLower.includes("processor") ||
    pLower.includes("memory") ||
    pLower.includes("dram") ||
    pLower.includes("pixel") ||
    pLower.includes("display") ||
    pLower.includes("ccd") ||
    pLower.includes("mouse") ||
    pLower.includes("fitts") ||
    pLower.includes("ntsc") ||
    pLower.includes("transistor") ||
    pLower.includes("integrated circuit") ||
    pLower.includes("multiplex");

  const isAero =
    category === "aviation" ||
    category === "aerospace" ||
    pLower.includes("wing") ||
    pLower.includes("lift") ||
    pLower.includes("drag") ||
    pLower.includes("airfoil") ||
    pLower.includes("rudder") ||
    pLower.includes("yaw") ||
    pLower.includes("pitch") ||
    pLower.includes("roll") ||
    pLower.includes("rocket") ||
    pLower.includes("circulation") ||
    pLower.includes("aspect ratio") ||
    pLower.includes("warp");

  const isThermal =
    pLower.includes("thermodynamic") ||
    pLower.includes("refrigerat") ||
    pLower.includes("carnot") ||
    pLower.includes("entropy") ||
    pLower.includes("enthalpy") ||
    pLower.includes("joule-thomson") ||
    pLower.includes("cooling") ||
    pLower.includes("steam") ||
    pLower.includes("boiler") ||
    pLower.includes("diesel") ||
    pLower.includes("stefan-boltzmann") ||
    pLower.includes("heat transfer");

  const isMaterials =
    category === "materials" ||
    pLower.includes("tensile") ||
    pLower.includes("polymer") ||
    pLower.includes("elastic") ||
    pLower.includes("stress") ||
    pLower.includes("strain") ||
    pLower.includes("kevlar") ||
    pLower.includes("rubber") ||
    pLower.includes("vulcaniz") ||
    pLower.includes("dynamite") ||
    pLower.includes("celluloid");

  // Create variables with domain-accurate dictionary
  const variables: EquationVariable[] = rawTokens.slice(0, 6).map((sym, i) => {
    const color = colorSequence[i % colorSequence.length];
    const safeId = `var_${i}_${sym.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`.replace(
      /_+/g,
      "_",
    );

    let name = `Parameter (${sym})`;
    let unit = "SI Units";
    let dimension = "[1]";
    let role = `Governing physical parameter in ${principle.principle}`;
    let telemetryKey: string | undefined;
    let telemetryMetricLabel: string | undefined;

    // 0a. CARRIER AIR CONDITIONING / PSYCHROMETRICS
    if (
      patentId.includes("carrier") ||
      pLower.includes("psychrometric") ||
      pLower.includes("dew-point")
    ) {
      if (sym === "c_{pa}" || sym === "c_p") {
        name = "Specific Heat of Dry Air";
        unit = "kJ/(kg·K) [1.006 kJ/(kg·K)]";
        dimension = "[L^2 T^-2 \\Theta^-1]";
        role = "Thermal energy required to raise dry air temperature by one degree";
      } else if (sym === "h_{fg0}") {
        name = "Latent Heat of Water Vaporization at 0°C";
        unit = "kJ/kg [2501 kJ/kg]";
        dimension = "[L^2 T^-2]";
        role = "Enthalpy required to evaporate water into air at freezing baseline";
      } else if (sym === "c_{pw}" || sym === "c_{pv}") {
        name = "Specific Heat of Water Vapor";
        unit = "kJ/(kg·K) [1.86 kJ/(kg·K)]";
        dimension = "[L^2 T^-2 \\Theta^-1]";
        role = "Heat capacity of superheated moisture vapor carried in air mixture";
      } else if (sym === "W") {
        name = "Absolute Humidity Moisture Ratio";
        unit = "kg H2O / kg dry air";
        dimension = "[1]";
        role = "Mass of dissolved water vapor per kilogram of dry atmospheric air";
      } else if (sym === "Q") {
        name = "Enthalpy Extraction Rate";
        unit = "Kilowatts (kW)";
        dimension = "[M L^2 T^-3]";
        role = "Total cooling capacity extracted from the airstream by chilled spray";
      } else if (sym === "H" || sym === "h") {
        name = "Moist Air Enthalpy";
        unit = "Kilojoules / kg (kJ/kg)";
        dimension = "[L^2 T^-2]";
        role = "Combined sensible heat and latent moisture energy of air";
      }
    }

    // 0b. FARNSWORTH IMAGE DISSECTOR & TV
    else if (
      patentId.includes("farnsworth") ||
      pLower.includes("dissector") ||
      pLower.includes("kell") ||
      pLower.includes("raster")
    ) {
      if (sym === "J_e") {
        name = "Photoelectric Current Density";
        unit = "Amperes per square meter (A/m²)";
        dimension = "[I L^-2]";
        role = "Electron flux emitted from cesium oxide photocathode under incident scene light";
      } else if (sym === "x" || sym === "y") {
        name = "Photocathode Coordinate";
        unit = "Millimeters (mm)";
        dimension = "[L]";
        role = "Spatial position on continuous photoemissive surface scanned across aperture";
      } else if (sym === "q") {
        name = "Elementary Electron Charge";
        unit = "Coulombs (1.602 × 10^-19 C)";
        dimension = "[I T]";
        role = "Charge of individual photoelectrons focused into scanning beam";
      } else if (sym === "V_a") {
        name = "Anode Accelerating Voltage";
        unit = "Volts (V) [~1000 V]";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "High positive potential accelerating photoelectrons toward the target aperture";
      } else if (sym === "\\vec{F}" || sym === "F") {
        name = "Lorentz Magnetic Deflection Force";
        unit = "Newtons (N)";
        dimension = "[M L T^-2]";
        role =
          "Dynamic magnetic force deflecting electron image across horizontal and vertical axes";
      } else if (sym === "\\vec{E}" || sym === "E") {
        name = "Electrostatic Accelerating Field";
        unit = "Volts per meter (V/m)";
        dimension = "[M L T^-3 I^-1]";
        role = "Axial electrostatic field gradient preserving electron image fidelity";
      } else if (sym === "\\vec{v}" || sym === "v") {
        name = "Electron Drift Velocity Vector";
        unit = "Meters per second (m/s)";
        dimension = "[L T^-1]";
        role = "Velocity of emitted photoelectrons traveling down the vacuum tube";
      } else if (sym === "K_{Kell}" || sym === "K") {
        name = "Kell Spatial Resolution Factor";
        unit = "Dimensionless coefficient (~0.7)";
        dimension = "[1]";
        role = "Empirical reduction factor accounting for discrete scan line sampling artifacts";
      } else if (sym === "N_{lines}^2" || sym === "N_{lines}" || sym === "N") {
        name = "Active Raster Scan Line Count";
        unit = "Scan lines (e.g. 525 lines)";
        dimension = "[1]";
        role = "Number of horizontal scan lines composing each complete video frame";
      }
    }

    // 0c. EINSTEIN-SZILARD ABSORPTION REFRIGERATOR
    else if (
      patentId.includes("einstein") ||
      pLower.includes("butane") ||
      pLower.includes("thermosiphon")
    ) {
      if (sym === "y_{butane}" || sym === "y") {
        name = "Butane Vapor Mole Fraction";
        unit = "Mole fraction [0-1]";
        dimension = "[1]";
        role = "Fractional concentration of butane vapor in the pressurized ammonia-butane cycle";
      } else if (sym === "H_{vap}") {
        name = "Enthalpy of Vaporization";
        unit = "Kilojoules per mole (kJ/mol)";
        dimension = "[M L^2 T^-2 N^-1]";
        role = "Latent heat absorbed by butane evaporating into lower-pressure ammonia vapor";
      } else if (sym === "z") {
        name = "Thermosiphon Bubble Elevation";
        unit = "Meters (m)";
        dimension = "[L]";
        role =
          "Height to which vapor bubbles lift liquid refrigerant without mechanical moving parts";
      } else if (sym === "\\vec{F}" || sym === "F") {
        name = "Electromagnetic Pumping Force";
        unit = "Newtons (N)";
        dimension = "[M L T^-2]";
        role = "Inductive Lorentz force pumping liquid metal without seals or moving pistons";
      } else if (sym === "\\vec{J}" || sym === "J") {
        name = "Induced Eddy Current Density";
        unit = "Amperes per square meter (A/m²)";
        dimension = "[I L^-2]";
        role = "Eddy current induced in liquid metal by rotating magnetic field";
      } else if (sym === "\\vec{E}" || sym === "E") {
        name = "Induced Electrostatic Field";
        unit = "Volts per meter (V/m)";
        dimension = "[M L T^-3 I^-1]";
        role = "Electric field generated across the conductive fluid conduit";
      } else if (sym === "\\vec{v}" || sym === "v") {
        name = "Fluid Flow Velocity Vector";
        unit = "Meters per second (m/s)";
        dimension = "[L T^-1]";
        role = "Speed of liquid metal circulated through the heat exchange loop";
      } else if (sym === "C" || sym === "n" || sym === "o") {
        name = "Carnot Absorption Efficiency Ratio";
        unit = "Dimensionless ratio";
        dimension = "[1]";
        role =
          "Theoretical maximum COP governed by generator, evaporator, and condenser temperatures";
      }
    }

    // 0d. KWOLEK LIQUID-CRYSTAL ARAMID POLYMER
    else if (
      patentId.includes("kwolek") ||
      pLower.includes("flory") ||
      pLower.includes("lyotropic") ||
      pLower.includes("aramid")
    ) {
      if (sym === "x") {
        name = "Polymer Chain Axial Aspect Ratio";
        unit = "Length-to-diameter ratio ($L/d > 100$)";
        dimension = "[1]";
        role =
          "Molecular aspect ratio of rigid rod-like PPTA chains driving nematic liquid-crystal alignment";
      } else if (sym === "c") {
        name = "Longitudinal Acoustic Shock Velocity";
        unit = "Meters per second (m/s) [~10,000 m/s]";
        dimension = "[L T^-1]";
        role = "Speed of stress wave propagation along aligned covalently bonded aromatic chains";
      } else if (sym === "E" || sym === "E_{coh}" || sym === "E_{H-bond}") {
        name = "Covalent / Hydrogen Bond Energy";
        unit = "Kilojoules per mole (kJ/mol)";
        dimension = "[M L^2 T^-2 N^-1]";
        role =
          "Inter-chain hydrogen bonding energy providing high transverse ballistic shear strength";
      } else if (sym === "H_{vap}") {
        name = "Enthalpy of Polymer Vaporization";
        unit = "Kilojoules per mole (kJ/mol)";
        dimension = "[M L^2 T^-2 N^-1]";
        role = "Thermal energy required to overcome intermolecular cohesive lattice forces";
      } else if (sym === "V_m") {
        name = "Molar Volume of Repeating Unit";
        unit = "Cubic centimeters per mole (cm³/mol)";
        dimension = "[L^3 N^-1]";
        role = "Volume occupied by one mole of polymer repeat units";
      }
    }

    // 0e. PARSONS STEAM TURBINE
    else if (
      patentId.includes("parsons") ||
      pLower.includes("turbine") ||
      pLower.includes("isentropic")
    ) {
      if (sym === "u") {
        name = "Turbine Blade Peripheral Velocity";
        unit = "Meters per second (m/s)";
        dimension = "[L T^-1]";
        role = "Rotational tangential velocity of moving blade ring stages";
      } else if (sym === "x") {
        name = "Steam Quality / Dryness Fraction";
        unit = "Mass fraction [0-1]";
        dimension = "[1]";
        role = "Ratio of vapor mass to total mixture mass expanding through compound stages";
      } else if (sym === "C_{u1}" || sym === "C_{u2}") {
        name = "Steam Tangential Swirl Velocity";
        unit = "Meters per second (m/s)";
        dimension = "[L T^-1]";
        role = "Tangential component of steam absolute velocity entering vs exiting blading";
      }
    }

    // 0f. TESLA TELEAUTOMATON / RADIO REMOTE CONTROL
    else if (
      patentId.includes("teleautomaton") ||
      patentId.includes("613809") ||
      pLower.includes("coherer") ||
      pLower.includes("teleautomaton")
    ) {
      if (sym === "C") {
        name = "Tuning Antenna Capacitance";
        unit = "Farads (F)";
        dimension = "[M^-1 L^-2 T^4 I^2]";
        role = "Adjustable capacitance setting resonant reception frequency of the receiver";
      } else if (sym === "E" || sym === "E_{\\theta}" || sym === "E_\\theta") {
        name = "Radiated RF Electric Field";
        unit = "Volts per meter (V/m)";
        dimension = "[M L T^-3 I^-1]";
        role = "Electromagnetic field strength radiated by transmitting antenna to trigger coherer";
      } else if (sym === "S_{n+1}" || sym === "S_n") {
        name = "Stepping Relay Sequencer State";
        unit = "Discrete state index [1-4]";
        dimension = "[1]";
        role = "Internal rotary switch position advancing boat propulsion and rudder motors";
      } else if (sym === "X" || sym === "Y_n") {
        name = "Command Pulse / Actuator State";
        unit = "Binary logic state [0/1]";
        dimension = "[1]";
        role = "Radio pulse input signal selecting rudder port/starboard or propeller throttle";
      }
    }

    // 0g. ZEPPELIN RIGID AIRSHIP
    else if (
      patentId.includes("zeppelin") ||
      pLower.includes("airship") ||
      pLower.includes("aerostatic")
    ) {
      if (sym === "y") {
        name = "Distance from Neutral Bending Axis";
        unit = "Meters (m)";
        dimension = "[L]";
        role = "Distance from the transverse hull centroid to outer duralumin longitudinal girder";
      } else if (sym === "z") {
        name = "Barometric Pressure Altitude";
        unit = "Meters (m)";
        dimension = "[L]";
        role = "Flight elevation governing atmospheric air density and hydrogen gas cell expansion";
      } else if (sym.includes("e^{-M") || sym.includes("e^-M")) {
        name = "Barometric Density Decay Factor";
        unit = "Dimensionless exponent";
        dimension = "[1]";
        role = "Exponential decrease in air pressure and buoyant lifting force with altitude";
      } else if (sym === "V_0") {
        name = "Initial Gas Cell Volume at Sea Level";
        unit = "Cubic meters (m³)";
        dimension = "[L^3]";
        role = "Unexpanded baseline volume of lift gas at standard atmospheric pressure";
      }
    }

    // 0h. LINDE AIR LIQUEFACTION & CRYOGENICS
    else if (
      patentId.includes("linde") ||
      pLower.includes("liquefaction") ||
      pLower.includes("cryogenic")
    ) {
      if (sym === "H") {
        name = "Cryogenic Fluid Enthalpy";
        unit = "Kilojoules per kilogram (kJ/kg)";
        dimension = "[L^2 T^-2]";
        role = "Total thermal enthalpy conserved across Joule-Thomson expansion valve";
      } else if (sym === "C_p") {
        name = "Isobaric Heat Capacity of Compressed Air";
        unit = "kJ/(kg·K)";
        dimension = "[L^2 T^-2 \\Theta^-1]";
        role = "Specific heat governing temperature drop during regenerative heat exchange";
      } else if (sym === "U") {
        name = "Overall Heat Transfer Coefficient";
        unit = "Watts per square meter-kelvin (W/(m²·K))";
        dimension = "[M T^-3 \\Theta^-1]";
        role =
          "Counter-current heat exchanger thermal conductance between high and low pressure air";
      } else if (sym === "y" || sym === "x") {
        name = "Vapor / Liquid Nitrogen Mole Fraction";
        unit = "Mole fraction [0-1]";
        dimension = "[1]";
        role =
          "Relative volatility equilibrium ratio during low-temperature fractional distillation";
      } else if (sym === "q") {
        name = "Radiation Heat Inleak Rate";
        unit = "Watts (W)";
        dimension = "[M L^2 T^-3]";
        role = "Parasitic ambient heat entering cryogenic vessel through vacuum jacket insulation";
      }
    }

    // 0i. LAMARR FREQUENCY HOPPING SPREAD SPECTRUM
    else if (
      patentId.includes("lamarr") ||
      pLower.includes("frequency-hopping") ||
      pLower.includes("anti-jam") ||
      pLower.includes("spread-spectrum")
    ) {
      if (sym === "C") {
        name = "Shannon Channel Capacity";
        unit = "Bits per second (bps)";
        dimension = "[T^-1]";
        role = "Theoretical maximum error-free information transmission rate across noisy channel";
      } else if (sym === "N" && pLower.includes("shannon")) {
        name = "Channel Gaussian Noise Power";
        unit = "Watts (W)";
        dimension = "[M L^2 T^-3]";
        role = "Background thermal noise across the transmission band";
      } else if (sym === "G_p" || sym === "G") {
        name = "Anti-Jam Processing Gain";
        unit = "Decibels (dB) / Ratio";
        dimension = "[1]";
        role =
          "Signal-to-interference ratio improvement achieved by frequency-hopping spectrum expansion";
      } else if (sym === "W_{ss}" || sym === "W") {
        name = "Spread-Spectrum RF Bandwidth";
        unit = "Megahertz (MHz)";
        dimension = "[T^-1]";
        role = "Total frequency bandwidth across which carrier hops pseudo-randomly";
      } else if (sym === "N_{channels}" || sym === "N_{total}" || sym === "N") {
        name = "Total Frequency Hopping Channels";
        unit = "Carrier bins [88 channels]";
        dimension = "[1]";
        role =
          "Total discrete radio frequency slots synchronized across transmitting and receiving rolls";
      } else if (sym === "N_{jam\\_channels}" || sym.includes("jam")) {
        name = "Jammer Blocked Channels";
        unit = "Active jam bins";
        dimension = "[1]";
        role = "Number of simultaneous frequency bins blocked by hostile narrowband interference";
      } else if (sym === "x" || sym === "c") {
        name = "Pseudo-Random Code Sequence";
        unit = "Binary code symbols [±1]";
        dimension = "[1]";
        role =
          "Orthogonal pseudo-random sequence governing transmitter and receiver carrier shifts";
      }
    }

    // 0j. SPENCER MICROWAVE CAVITY MAGNETRON
    else if (
      patentId.includes("spencer") ||
      pLower.includes("microwave") ||
      pLower.includes("magnetron") ||
      pLower.includes("choke")
    ) {
      if (sym === "\\vec{E}" || sym === "E" || sym === "E_0") {
        name = "Microwave Electric Field Vector";
        unit = "Volts per meter (V/m)";
        dimension = "[M L T^-3 I^-1]";
        role =
          "High-frequency 2.45 GHz alternating microwave field driving water dipole oscillation";
      } else if (sym === "r_a" || sym === "r_c" || sym === "r_c^2") {
        name = "Magnetron Anode / Cathode Radius";
        unit = "Millimeters (mm)";
        dimension = "[L]";
        role = "Cylindrical resonant cavity geometry determining electron cyclotron cutoff orbits";
      } else if (sym === "V_a") {
        name = "Magnetron Anode Accelerating Voltage";
        unit = "Kilovolts (kV) [~4 kV]";
        dimension = "[M L^2 T^-3 I^-1]";
        role =
          "High DC potential accelerating electrons radially from cathode toward resonant anode blocks";
      } else if (sym === "c_p") {
        name = "Specific Heat Capacity";
        unit = "Joules per (kg·K) (J/(kg·K))";
        dimension = "[L^2 T^-2 \\Theta^-1]";
        role = "Thermal energy required to raise target food matter temperature by one kelvin";
      } else if (sym === "Z_{in}" || sym === "Z_0" || sym === "Z_L") {
        name = "Characteristic Transmission Impedance";
        unit = "Ohms (Ω) [50 Ω / 377 Ω]";
        dimension = "[M L^2 T^-3 I^-2]";
        role = "Wave transmission line impedance and quarter-wave choke matching boundary";
      } else if (sym === "j") {
        name = "Imaginary Phase Unit (j = √-1)";
        unit = "Complex phase operator";
        dimension = "[1]";
        role =
          "90-degree reactive impedance phase rotation in electromagnetic transmission line equations";
      }
    }

    // 0k. BARDEEN POINT-CONTACT TRANSISTOR
    else if (
      patentId.includes("bardeen") ||
      pLower.includes("point-contact") ||
      pLower.includes("transistor")
    ) {
      if (sym === "\\vec{E}" || sym === "E") {
        name = "Minority Carrier Drift Electric Field";
        unit = "Volts per centimeter (V/cm)";
        dimension = "[M L T^-3 I^-1]";
        role =
          "Electrostatic field gradient accelerating injected hole packet through bulk germanium";
      } else if (sym === "V_C") {
        name = "Collector Reverse Bias Voltage";
        unit = "Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Reverse bias extracting injected minority holes across the point-contact collector";
      } else if (sym === "Q_{ss}") {
        name = "Surface State Trapped Charge Density";
        unit = "Coulombs per square centimeter (C/cm²)";
        dimension = "[I T L^-2]";
        role =
          "Charge trapped in localized quantum surface levels screening bulk germanium from external fields";
      } else if (sym === "q") {
        name = "Elementary Electric Charge";
        unit = "Coulombs (1.602 × 10^-19 C)";
        dimension = "[I T]";
        role = "Fundamental quantum of charge carried by conduction electrons and holes";
      } else if (sym === "D_{it}") {
        name = "Interface Trap Energy Density";
        unit = "States per cm²-eV (states/(cm²·eV))";
        dimension = "[M^-1 L^-4 T^2 I^-1]";
        role = "Density of localized electronic states across the semiconductor bandgap";
      } else if (sym === "E_F" || sym === "E_0") {
        name = "Fermi Energy Level / Neutral Energy";
        unit = "Electron-volts (eV)";
        dimension = "[M L^2 T^-2]";
        role = "Thermodynamic electrochemical potential of charge carriers in the crystal";
      } else if (sym === "D_p" || sym === "D_n") {
        name = "Minority Carrier Diffusion Coefficient";
        unit = "Square centimeters per second (cm²/s)";
        dimension = "[L^2 T^-1]";
        role =
          "Brownian spatial diffusion rate of minority hole packets through the base semiconductor";
      }
    }

    // 0l. FERMI NUCLEAR CRITICAL REACTOR
    else if (
      patentId.includes("fermi") ||
      pLower.includes("reactor") ||
      pLower.includes("fission") ||
      pLower.includes("moderation")
    ) {
      if (sym === "N" || sym === "N_0") {
        name = "Elastic Collision Thermalization Count";
        unit = "Collisions [~115 collisions]";
        dimension = "[1]";
        role =
          "Number of graphite collisions required to slow 2 MeV fast neutrons to 0.025 eV thermal speed";
      } else if (sym === "E_0" || sym === "E_{th}") {
        name = "Prompt Fission / Thermal Neutron Energy";
        unit = "MeV / eV ($2\\text{ MeV} \\to 0.025\\text{ eV}$)";
        dimension = "[M L^2 T^-2]";
        role =
          "Initial fast fission neutron energy vs room-temperature thermal neutron equilibrium";
      } else if (sym === "N_U") {
        name = "Uranium Atomic Number Density";
        unit = "Atoms per cubic centimeter (atoms/cm³)";
        dimension = "[L^-3]";
        role = "Concentration of heavy uranium fuel nuclei within the lumped lattice geometry";
      } else if (sym === "H") {
        name = "Active Core Critical Height";
        unit = "Meters (m)";
        dimension = "[L]";
        role = "Vertical dimension of the CP-1 uranium-graphite critical pile geometry";
      }
    }

    // 0m. NOYCE PLANAR INTEGRATED CIRCUIT
    else if (
      patentId.includes("noyce") ||
      pLower.includes("planar") ||
      pLower.includes("deal-grove") ||
      pLower.includes("electromigration")
    ) {
      if (sym === "x_{ox}" || sym === "x_{ox}^2") {
        name = "Thermal Silicon Dioxide Thickness";
        unit = "Nanometers (nm)";
        dimension = "[L]";
        role =
          "Passivating and insulating thermal oxide dielectric barrier protecting silicon junctions";
      } else if (sym === "J_{FN}" || sym === "J") {
        name = "Current Density / Tunneling Current";
        unit = "Amperes per square centimeter (A/cm²)";
        dimension = "[I L^-2]";
        role = "High-field quantum mechanical Fowler-Nordheim field emission tunneling density";
      } else if (sym === "C_1") {
        name = "Fowler-Nordheim Tunneling Coefficient";
        unit = "Amperes per volt squared (A/V²)";
        dimension = "[M^-1 L^-4 T^3 I^3]";
        role =
          "Quantum mechanical tunneling rate coefficient across thin silicon dioxide dielectric";
      } else if (sym === "E_{ox}" || sym === "E_{ox}^2" || sym === "E_{bd}" || sym === "E_0") {
        name = "Oxide Electric Field / Breakdown Field";
        unit = "Megavolts per centimeter (MV/cm)";
        dimension = "[M L T^-3 I^-1]";
        role = "Electrostatic field gradient across insulating silicon dioxide layer";
      }
    }

    // 0n. ENGELBART COMPUTER MOUSE
    else if (
      patentId.includes("engelbart") ||
      pLower.includes("mouse") ||
      pLower.includes("potentiometer") ||
      pLower.includes("fitts")
    ) {
      if (sym.includes("vec{v}") || sym.includes("v_{hand}")) {
        name = "Hand Movement Velocity Vector";
        unit = "Meters per second (m/s)";
        dimension = "[L T^-1]";
        role = "Spatial translation speed and heading of the mouse chassis across the work surface";
      } else if (sym === "j") {
        name = "Cartesian Y-Axis Unit Vector (ĵ)";
        unit = "Dimensionless unit vector";
        dimension = "[1]";
        role = "Orthogonal vertical direction vector of mouse chassis travel across desk surface";
      } else if (sym === "x" || sym === "y") {
        name = "Cartesian Coordinate Displacement";
        unit = "Millimeters (mm)";
        dimension = "[L]";
        role = "Displacement along individual orthogonal tracking wheel axes";
      } else if (sym === "D") {
        name = "Target Acquisition Travel Distance";
        unit = "Pixels / Millimeters (mm)";
        dimension = "[L]";
        role = "Distance required to reach the on-screen target in Fitts's Law";
      } else if (sym === "W") {
        name = "Target Element Screen Width";
        unit = "Pixels / Millimeters (mm)";
        dimension = "[L]";
        role = "Spatial target width determining selection difficulty in Fitts's Law";
      } else if (sym === "V_x" || sym === "V_y" || sym === "V_{ref}") {
        name = "Potentiometer Divider / Reference Voltage";
        unit = "Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Analog DC voltage proportional to tracking wheel rotation angle";
      } else if (sym === "X_{screen}" || sym === "Y_{screen}") {
        name = "Screen CRT Cursor Coordinate";
        unit = "Pixels";
        dimension = "[1]";
        role = "Quantized cursor coordinate mapped from encoder voltage ADC readings";
      } else if (sym === "\\text{CPI}" || sym === "CPI") {
        name = "Counts Per Inch Resolution";
        unit = "Pulses / inch";
        dimension = "[L^-1]";
        role = "Encoder pulse frequency per inch of physical desktop travel";
      }
    }

    // 0o. BOYLE-SMITH CHARGE-COUPLED DEVICE (CCD)
    else if (
      patentId.includes("boyle") ||
      patentId.includes("ccd") ||
      pLower.includes("charge-coupled") ||
      pLower.includes("potential well")
    ) {
      if (sym === "n_e") {
        name = "Photoelectron Packet Count";
        unit = "Electrons (e⁻)";
        dimension = "[1]";
        role = "Number of photo-generated electrons collected within the MOS potential well";
      } else if (sym === "V_G" || sym === "V_0" || sym === "V_0^2") {
        name = "MOS Gate / Surface Potential";
        unit = "Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Clocked gate electrode voltage creating surface potential well depth";
      } else if (sym === "N") {
        name = "Shift Register Clocked Transfer Stages";
        unit = "Transfer steps";
        dimension = "[1]";
        role = "Number of 3-phase MOS gate transfers required to clock charge to output amplifier";
      } else if (sym.includes("e^{-N") || sym.includes("e^-N")) {
        name = "Cumulative Charge Packet Survival Ratio";
        unit = "Dimensionless fraction";
        dimension = "[1]";
        role =
          "Fraction of original photoelectron packet surviving N consecutive bucket-brigade shifts";
      } else if (sym === "S_{out}" || sym === "S_{in}") {
        name = "Output / Input Charge Signal Packet";
        unit = "Electrons / Volts";
        dimension = "[1]";
        role = "Signal charge packet magnitude before vs after CCD shift registers";
      } else if (sym === "\\text{CTE}" || sym === "CTE" || sym === "\\epsilon") {
        name = "Charge Transfer Efficiency / Inefficiency";
        unit = "Dimensionless fraction [0-1]";
        dimension = "[1]";
        role = "Fractional charge packet conservation efficiency per transfer gate step";
      } else if (sym === "V_{out}") {
        name = "Floating Diffusion Sense Output Voltage";
        unit = "Microvolts per electron (μV/e⁻)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Charge-to-voltage conversion amplitude on sensing node";
      } else if (sym === "C_{FD}") {
        name = "Floating Diffusion Node Capacitance";
        unit = "Femtofarads (fF) [~10 fF]";
        dimension = "[M^-1 L^-2 T^4 I^2]";
        role =
          "Microscopic node capacitance converting charge packets into readable voltage signals";
      } else if (sym === "J_{dark}") {
        name = "Thermal Dark Current Generation Rate";
        unit = "Amperes per square meter (A/m²)";
        dimension = "[I L^-2]";
        role = "Thermal noise electron accumulation in unilluminated pixel wells";
      } else if (sym === "W_{dep}") {
        name = "Silicon Depletion Layer Width";
        unit = "Micrometers (μm)";
        dimension = "[L]";
        role = "Thickness of carrier-depleted silicon collecting photon charges";
      } else if (sym === "s_0") {
        name = "Surface Recombination Velocity";
        unit = "Centimeters per second (cm/s)";
        dimension = "[L T^-1]";
        role = "Rate of non-radiative electron recombination at dielectric boundary";
      } else if (sym === "q") {
        name = "Elementary Electric Charge";
        unit = "Coulombs (1.602 × 10^-19 C)";
        dimension = "[I T]";
        role = "Fundamental electron charge quantum converted to output voltage";
      } else if (sym === "A_V") {
        name = "Voltage Amplification Gain";
        unit = "Dimensionless ratio";
        dimension = "[1]";
        role = "On-chip source-follower output buffer amplifier voltage gain";
      }
    }

    // 0p. HOLLERITH ELECTRIC TABULATING SYSTEM
    else if (
      patentId.includes("hollerith") ||
      pLower.includes("tabulating") ||
      pLower.includes("punched card")
    ) {
      if (sym === "H") {
        name = "Information Entropy Tabulation Capacity";
        unit = "Bits per punched card";
        dimension = "[1]";
        role = "Information content density encoded across the 240-position hole matrix";
      } else if (sym === "p_i" || sym === "p") {
        name = "Hole Punch Occurrence Probability";
        unit = "Probability fraction [0-1]";
        dimension = "[1]";
        role = "Statistical distribution of demographic categories in census returns";
      }
    }

    // 0q. RENO INCLINED ELEVATOR / ESCALATOR
    else if (
      patentId.includes("reno") ||
      pLower.includes("escalator") ||
      pLower.includes("inclined")
    ) {
      if (sym === "N") {
        name = "Continuous Passenger Throughput Capacity";
        unit = "Passengers per hour (pph)";
        dimension = "[T^-1]";
        role = "Rate of passenger transport up the continuous 25-degree incline";
      } else if (sym === "w") {
        name = "Moving Treadway Cleat Width";
        unit = "Meters (m)";
        dimension = "[L]";
        role = "Transverse width of the ridged continuous rubber/wood treadway belt";
      } else if (sym === "y") {
        name = "Comb-Plate Ingress Meshing Depth";
        unit = "Millimeters (mm)";
        dimension = "[L]";
        role = "Vertical engagement depth between stationary comb prongs and moving belt grooves";
      } else if (sym === "v^2" || sym === "v") {
        name = "Linear Belt Speed";
        unit = "Meters per second (m/s)";
        dimension = "[L T^-1]";
        role = "Velocity of the inclined treadway moving passengers smoothly";
      } else if (sym.includes("e^{\\mu") || sym.includes("e^\\mu")) {
        name = "Capstan Drive Belt Friction Factor";
        unit = "Dimensionless multiplier";
        dimension = "[1]";
        role = "Euler-Eytelwein friction amplification driving handrail belt synchronization";
      }
    }

    // 0r. TESLA HIGH FREQUENCY COIL TRANSFORMER
    else if (
      patentId.includes("tesla-coil") ||
      patentId.includes("593138") ||
      pLower.includes("tesla coil")
    ) {
      if (sym === "C_p" || sym === "C_s" || sym === "C_{top}") {
        name = "Primary / Secondary / Topload Capacitance";
        unit = "Picofarads (pF) / Microfarads (μF)";
        dimension = "[M^-1 L^-2 T^4 I^2]";
        role = "Resonant tank circuit and spherical terminal electrostatic capacitance";
      } else if (sym === "V_{sec}" || sym === "V_{pri}" || sym === "V_{top}" || sym === "V_B") {
        name = "High-Frequency Resonant / Breakdown Voltage";
        unit = "Kilovolts (kV) / Megavolts (MV)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Stepped-up RF potential ionizing ambient air into high-voltage streamers";
      } else if (sym === "Q") {
        name = "Resonant Circuit Quality Factor (Q)";
        unit = "Dimensionless multiplier";
        dimension = "[1]";
        role = "Ratio of energy stored to energy dissipated per cycle ($Q = \\omega L / R$)";
      } else if (sym === "t_{transfer}") {
        name = "Beat-Envelope Energy Transfer Period";
        unit = "Microseconds (μs)";
        dimension = "[T]";
        role = "Time required for loose magnetic coupling to pump total energy into secondary";
      }
    }

    // 0s. DIESEL INTERNAL COMBUSTION ENGINE
    else if (patentId.includes("diesel") || pLower.includes("diesel")) {
      if (sym.includes("r^{\\gamma") || sym.includes("r^\\gamma") || sym === "r_c" || sym === "r") {
        name = "Compression / Cutoff Volume Ratio";
        unit = "Dimensionless ratio ($r \\approx 18:1$)";
        dimension = "[1]";
        role =
          "Extreme compression ratio achieving 600°C auto-ignition temperature of injected fuel";
      } else if (sym === "d_{32}" || sym === "D") {
        name = "Sauter Mean Droplet Diameter";
        unit = "Micrometers (μm) [~20 μm]";
        dimension = "[L]";
        role = "Fuel atomization droplet size governing high-pressure combustion surface area";
      } else if (sym === "d^2" || sym === "d_0^2") {
        name = "Droplet Evaporation Surface Term";
        unit = "Square micrometers (μm²)";
        dimension = "[L^2]";
        role = "D-squared law governing fuel droplet vaporization rate in hot compressed air";
      }
    }

    // 0t. MARCONI WIRELESS TELEGRAPHY
    else if (
      patentId.includes("marconi") ||
      pLower.includes("marconi") ||
      pLower.includes("poynting") ||
      pLower.includes("monopole")
    ) {
      if (sym === "\\vec{S}" || sym === "S") {
        name = "Poynting Radiated Power Flux Vector";
        unit = "Watts per square meter (W/m²)";
        dimension = "[M T^-3]";
        role =
          "Directional electromagnetic radiation power density emitted toward distant receiver";
      } else if (sym === "\\vec{E}" || sym === "E" || sym === "E_{total}" || sym === "E_0") {
        name = "RF Radiated Electric Field Strength";
        unit = "Volts per meter (V/m)";
        dimension = "[M L T^-3 I^-1]";
        role = "High-frequency signal wave amplitude inducing antenna voltage at receiver";
      } else if (sym === "D_{max}" || sym === "D") {
        name = "Maximum Telegraphic Reception Range";
        unit = "Kilometers (km) / Nautical Miles";
        dimension = "[L]";
        role = "Greatest distance at which coherer detects signals over curved ocean surface";
      } else if (sym === "h_{aerial}^2" || sym === "h_{aerial}" || sym === "h") {
        name = "Aerial Mast Height";
        unit = "Meters (m)";
        dimension = "[L]";
        role = "Vertical antenna height scaling transmission range by square-law relation";
      } else if (sym === "J" || sym === "e^2" || sym === "h^2") {
        name = "Quantum Coherer Tunneling Current";
        unit = "Amperes per square meter (A/m²)";
        dimension = "[I L^-2]";
        role =
          "Micro-spark breakdown across metallic filings converting RF waves into DC telegraph clicks";
      }
    }

    // 0u. PELTON IMPULSE WATER TURBINE
    else if (patentId.includes("pelton") || pLower.includes("pelton")) {
      if (sym === "u") {
        name = "Runner Bucket Peripheral Speed";
        unit = "Meters per second (m/s)";
        dimension = "[L T^-1]";
        role =
          "Tangential speed of the split-cup buckets operating at half water jet speed ($u = 0.5 v$)";
      } else if (sym === "C_v") {
        name = "Nozzle Discharge Velocity Coefficient";
        unit = "Dimensionless ratio (~0.98)";
        dimension = "[1]";
        role = "Frictional efficiency factor of the contracted needle nozzle jet";
      } else if (sym === "H" || sym === "H^{5/4}") {
        name = "Effective Hydraulic Water Head";
        unit = "Meters (m)";
        dimension = "[L]";
        role = "Hydrostatic elevation head supplying high-pressure water column to the penstock";
      } else if (sym === "N_s" || sym === "N") {
        name = "Runner Rotational / Specific Speed";
        unit = "Revolutions per minute (RPM) / Non-dimensional";
        dimension = "[T^-1]";
        role = "Rotational speed matched to impulse turbine hydraulic operating regime";
      }
    }

    // 0v. EDISON PHONOGRAPH & SOUND RECORDING
    else if (
      patentId.includes("phonograph") ||
      pLower.includes("phonograph") ||
      pLower.includes("stylus")
    ) {
      if (sym === "D") {
        name = "Tinfoil Mandrel Cylinder Diameter";
        unit = "Millimeters (mm) [~100 mm]";
        dimension = "[L]";
        role = "Outer diameter of the grooved recording cylinder";
      } else if (sym === "n") {
        name = "Mandrel Rotational Speed";
        unit = "Revolutions per minute (RPM) [~60 RPM]";
        dimension = "[T^-1]";
        role = "Crank-driven angular velocity determining linear recording track speed";
      }
    }

    // 0w. EDISON INCANDESCENT ELECTRIC LAMP
    else if (
      patentId.includes("lightbulb") ||
      patentId.includes("223898") ||
      pLower.includes("filament") ||
      pLower.includes("blackbody")
    ) {
      if (sym === "I^2" || sym === "I") {
        name = "Conduction Current / Joule Power Term";
        unit = "Amperes squared (A²) / Amperes (A)";
        dimension = "[I^2]";
        role = "Current squared driving resistive heating dissipation in carbonized thread";
      } else if (sym === "E" || sym === "u") {
        name = "Radiant Emittance / Blackbody Energy Density";
        unit = "Watts per square meter (W/m²) / Joules per m³";
        dimension = "[M T^-3]";
        role = "Total visible and infrared radiation emitted across blackbody spectrum";
      } else if (sym === "d^2" || sym === "d") {
        name = "Gas Molecule Collision Diameter";
        unit = "Nanometers (nm)";
        dimension = "[L]";
        role = "Molecular cross-section determining mean free path in high vacuum bulb";
      }
    }

    // 0x. DE LAVAL CENTRIFUGAL CREAM SEPARATOR
    else if (
      patentId.includes("delaval") ||
      pLower.includes("centrifug") ||
      pLower.includes("cream")
    ) {
      if (sym === "r^2" || sym === "r") {
        name = "Centrifuge Bowl Radius";
        unit = "Meters (m)";
        dimension = "[L]";
        role = "Radial distance from spinning vertical axis creating centrifugal g-force field";
      }
    }

    // 0y. MERGENTHALER LINOTYPE TYPESETTING
    else if (
      patentId.includes("linotype") ||
      pLower.includes("matrix") ||
      pLower.includes("typesetting")
    ) {
      if (sym === "b_i" || sym === "b") {
        name = "Matrix Tooth Keyway Binary Notch";
        unit = "Binary notch bit [0/1]";
        dimension = "[1]";
        role = "Triangular notch combination releasing brass matrix into correct magazine channel";
      }
    }

    // 0z. MAXIM AUTOMATIC RECOIL MACHINE GUN
    else if (
      patentId.includes("maxim") ||
      pLower.includes("machine gun") ||
      pLower.includes("fusee")
    ) {
      if (sym === "x_0" || sym === "r_0") {
        name = "Fusee Cam Initial Deflection / Lever Arm";
        unit = "Millimeters (mm)";
        dimension = "[L]";
        role = "Volute cam profile converting spring tension into constant restoring torque";
      } else if (sym === "x") {
        name = "Barrel Recoil Stroke Displacement";
        unit = "Millimeters (mm) [~19 mm]";
        dimension = "[L]";
        role = "Rearward travel of barrel and breech block unlocking toggle mechanism";
      }
    }

    // 0aa. THOMSON RESISTANCE ELECTRIC WELDING
    else if (
      patentId.includes("welding") ||
      patentId.includes("347140") ||
      pLower.includes("welding")
    ) {
      if (sym === "q" || sym === "Q") {
        name = "Joule Heat Generation / Diffusion Activation Energy";
        unit = "Joules (J) / Kilojoules per mole (kJ/mol)";
        dimension = "[M L^2 T^-2]";
        role =
          "Thermal energy generated at high-resistance contact interface forging plastic union";
      } else if (sym === "I^2") {
        name = "Welding Heavy Secondary Current Squared";
        unit = "Amperes squared (A²) [~10^8 A²]";
        dimension = "[I^2]";
        role = "High current squared driving rapid localized interface melting";
      } else if (sym === "D" || sym === "D_0") {
        name = "Solid-State Atomic Diffusion Coefficient";
        unit = "Square meters per second (m²/s)";
        dimension = "[L^2 T^-1]";
        role = "Rate of metallic atom migration across plastic contact boundary";
      } else if (sym === "x") {
        name = "Diffusion Joint Penetration Depth";
        unit = "Millimeters (mm)";
        dimension = "[L]";
        role = "Thickness of solid-state metallurgical bond zone";
      } else if (sym === "N_s" || sym === "N_p") {
        name = "Step-Down Transformer Secondary / Primary Turns";
        unit = "Turn count (e.g. 1 turn secondary)";
        dimension = "[1]";
        role = "Single-turn heavy copper secondary delivering thousands of amperes";
      }
    }

    // 0ab. TESLA POLYPHASE AC INDUCTION MOTOR
    else if (
      patentId.includes("tesla-motor") ||
      patentId.includes("381968") ||
      pLower.includes("induction motor")
    ) {
      if (sym === "j") {
        name = "Quadrature Spatial / Phase Operator";
        unit = "90-degree phase operator";
        dimension = "[1]";
        role = "Orthogonal spatial stator orientation matching temporal 90-degree AC phase shift";
      } else if (sym === "E") {
        name = "Induced Rotor Electromotive Force";
        unit = "Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Faraday EMF induced in short-circuited rotor windings by rotating magnetic flux";
      } else if (sym === "o" || sym === "N") {
        name = "Stator Phase Turns per Pole";
        unit = "Coil turns";
        dimension = "[1]";
        role = "Number of winding turns per magnetic pole pair";
      } else if (sym === "s_{crit}") {
        name = "Critical Breakdown Slip Fraction";
        unit = "Dimensionless fraction [0-1]";
        dimension = "[1]";
        role = "Rotor slip at which motor delivers peak breakdown stall torque";
      } else if (sym === "V_{th}^2" || sym === "V_{th}") {
        name = "Thevenin Equivalent Stator Terminal Voltage";
        unit = "Volts squared (V²) / Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Stator phase voltage driving magnetization and rotor current loops";
      } else if (sym === "n_s") {
        name = "Synchronous Stator Field Rotational Speed";
        unit = "Revolutions per minute (RPM) [e.g. 1800 RPM]";
        dimension = "[T^-1]";
        role = "Speed of rotating magnetic field ($n_s = 120 f / P$)";
      } else if (sym === "d_{lam}^2" || sym === "d_{lam}") {
        name = "Silicon Steel Core Lamination Thickness";
        unit = "Millimeters (mm) [~0.5 mm]";
        dimension = "[L]";
        role = "Thin insulated core sheets suppressing parasitic eddy current heat losses";
      } else if (sym === "f^2" || sym === "f") {
        name = "AC Power Grid Supply Frequency";
        unit = "Hertz (Hz) [60 Hz]";
        dimension = "[T^-1]";
        role = "Line frequency driving alternating polyphase excitation";
      } else if (sym === "D_{iron}") {
        name = "Ferromagnetic Iron Core Density";
        unit = "Kilograms per cubic meter (kg/m³)";
        dimension = "[M L^-3]";
        role = "Soft silicon iron core mass density governing magnetic saturation flux";
      }
    }

    // 0ac. OTTO FOUR-STROKE CYCLE ENGINE
    else if (
      patentId.includes("otto") ||
      patentId.includes("194047") ||
      pLower.includes("otto cycle")
    ) {
      if (sym === "C_d") {
        name = "Poppet Intake Valve Discharge Coefficient";
        unit = "Dimensionless ratio (~0.6)";
        dimension = "[1]";
        role = "Flow efficiency of mushroom poppet valve admitting fresh charge";
      }
    }

    // 0ad. DAIMLER HIGH-SPEED GASOLINE ENGINE
    else if (patentId.includes("daimler") || patentId.includes("361931")) {
      if (sym === "N") {
        name = "Normal Friction Clutch Clamping Force";
        unit = "Newtons (N)";
        dimension = "[M L T^-2]";
        role = "Spring thrust pressing friction cone surfaces into positive drive engagement";
      } else if (sym === "Q") {
        name = "Water Jacket Heat Extraction Rate";
        unit = "Kilowatts (kW)";
        dimension = "[M L^2 T^-3]";
        role = "Thermal energy conducted through cylinder wall into circulating cooling water";
      } else if (sym === "c_p") {
        name = "Specific Heat Capacity of Coolant Water";
        unit = "kJ/(kg·K) [4.186 kJ/(kg·K)]";
        dimension = "[L^2 T^-2 \\Theta^-1]";
        role = "Thermal heat absorption capacity preventing cylinder seizure";
      }
    }

    // 1. OPTICS / CAMERAS / IMAGING
    else if (isOptics) {
      if (sym === "H") {
        name = "Hyperfocal Distance";
        unit = "Meters (m)";
        dimension = "[L]";
        role = "Distance beyond which all objects appear acceptably sharp without focusing";
      } else if (sym === "D" || sym.startsWith("D_") || sym === "D_{\\text{near}}") {
        if (pLower.includes("density") || pLower.includes("hurter")) {
          name = "Optical Density (Film Blackening)";
          unit = "Dimensionless logarithmic opacity";
          dimension = "[1]";
          role = "Logarithmic opacity of processed silver image ($D = \\log_{10}(I_0/I)$)";
        } else {
          name = "Near Focus Boundary Distance";
          unit = "Meters (m)";
          dimension = "[L]";
          role = "Closest subject distance in acceptable focus ($D_{\\text{near}} = H / 2$)";
        }
      } else if (sym === "f" || sym === "f^2") {
        name = "Lens Focal Length";
        unit = "Millimeters (mm) / Meters (m)";
        dimension = "[L]";
        role = "Effective focal length of the optical doublet ($57\\text{ mm}$)";
      } else if (sym === "N" || sym === "N^2") {
        name = "F-Number (Relative Aperture)";
        unit = "Dimensionless ratio ($f/9$)";
        dimension = "[1]";
        role = "Ratio of focal length to entrance pupil diameter ($N = f/D$)";
      } else if (sym === "c") {
        name = "Circle of Confusion Limit";
        unit = "Millimeters (mm)";
        dimension = "[L]";
        role = "Maximum permissible blur spot diameter on negative emulsion ($0.03\\text{ mm}$)";
      } else if (sym === "\\text{EV}" || sym === "EV") {
        name = "Exposure Value (EV)";
        unit = "Log2 Exposure Steps";
        dimension = "[1]";
        role = "Logarithmic measure combining shutter speed and relative aperture";
      } else if (sym === "\\gamma") {
        name = "Emulsion Contrast (Gamma)";
        unit = "Dimensionless slope";
        dimension = "[1]";
        role = "Slope of the linear region of the Hurter & Driffield sensitometry curve";
      } else if (sym === "E" || sym.startsWith("E_") || sym.startsWith("E(")) {
        name = "Radiant Exposure / Lens Illuminance";
        unit = "Lux-seconds (lx·s) / Lux (lx)";
        dimension = "[M T^-3]";
        role = "Light energy per unit area incident upon the photographic emulsion";
      } else if (sym === "\\Phi_0" || sym === "\\Phi") {
        name = "Incident Luminous Flux";
        unit = "Lumens (lm)";
        dimension = "[J]";
        role = "Total visible optical flux entering the camera lens aperture";
      } else if (sym === "\\tau" || sym.startsWith("\\tau_")) {
        name = "Lens Optical Transmittance";
        unit = "Dimensionless fraction [0-1]";
        dimension = "[1]";
        role = "Percentage of light transmitted through glass elements without internal absorption";
      } else if (sym === "m") {
        name = "Optical Magnification Ratio";
        unit = "Dimensionless ratio";
        dimension = "[1]";
        role = "Ratio of image size on film to physical object size";
      } else if (sym === "I_0" || sym === "I" || sym.startsWith("I_")) {
        name = "Incident / Transmitted Light Intensity";
        unit = "Candela (cd) / Lumens (lm)";
        dimension = "[J]";
        role = "Luminous flux before vs after traversing the developed negative";
      } else if (sym === "i") {
        name = "Emulsion Inertia Threshold";
        unit = "Lux-seconds (lx·s)";
        dimension = "[M T^-3]";
        role =
          "Minimum exposure required to overcome threshold sensitivity and initiate silver blackening";
      } else if (sym === "\\theta") {
        name = "Off-Axis Field Angle";
        unit = "Degrees (°) / Radians";
        dimension = "[1]";
        role = "Angular deviation from the optical axis causing cosine-fourth vignetting";
      } else if (sym === "t") {
        name = "Shutter Exposure Duration";
        unit = "Seconds (s) [e.g. 1/20 s]";
        dimension = "[T]";
        role = "Duration during which the rotary shutter aperture uncovers the film";
      }
    }

    // 2. COMPUTING / DIGITAL HARDWARE / INTERFACES
    else if (isComputing) {
      if (sym === "T_{cycle}") {
        name = "Master Bus Cycle Period";
        unit = "Nanoseconds (ns)";
        dimension = "[T]";
        role =
          "Total duration of one interleaved non-overlapping memory access cycle ($978.6\\text{ ns}$)";
      } else if (sym.startsWith("t_{\\Phi") || sym.startsWith("t_\\Phi")) {
        name = "Clock Phase Duration";
        unit = "Nanoseconds (ns)";
        dimension = "[T]";
        role = "Dedicated time slot for Video display fetch vs CPU bus access ($489.3\\text{ ns}$)";
      } else if (sym === "f_{CPU}") {
        name = "CPU Clock Frequency";
        unit = "Megahertz (MHz)";
        dimension = "[T^-1]";
        role = "Operational clock rate of the 6502 microprocessor ($1.023\\text{ MHz}$)";
      } else if (sym === "f_{sc}") {
        name = "NTSC Color Subcarrier Frequency";
        unit = "Megahertz (MHz)";
        dimension = "[T^-1]";
        role =
          "Standard NTSC chrominance subcarrier ($3.579545\\text{ MHz} = 14.31818\\text{ MHz} / 4$)";
      } else if (sym === "f_{dot}") {
        name = "High-Resolution Dot Clock Rate";
        unit = "Megahertz (MHz)";
        dimension = "[T^-1]";
        role = "Pixel shift clock frequency ($7.159\\text{ MHz} = 2 f_{sc}$)";
      } else if (sym === "t_{pixel}") {
        name = "Pixel Latency Duration";
        unit = "Nanoseconds (ns)";
        dimension = "[T]";
        role = "Time duration per single horizontal screen dot ($139.7\\text{ ns}$)";
      } else if (sym === "V_{video}") {
        name = "Composite Video Voltage";
        unit = "Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Instantaneous analog composite NTSC video signal waveform";
      } else if (sym === "Y") {
        name = "Luminance Component";
        unit = "Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Monochrome brightness baseband signal ($Y = 0.30R + 0.59G + 0.11B$)";
      } else if (sym === "I" || sym === "Q") {
        name = "In-Phase / Quadrature Chrominance";
        unit = "Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Orthogonal color modulation vectors encoding hue and saturation";
      } else if (sym === "R_{leak}") {
        name = "DRAM Storage Cell Leakage Resistance";
        unit = "Gigaohms (GΩ)";
        dimension = "[M L^2 T^-3 I^-2]";
        role = "Sub-threshold dielectric resistance of the dynamic storage capacitor";
      } else if (sym === "C_{cell}") {
        name = "DRAM Storage Cell Capacitance";
        unit = "Femtofarads (fF)";
        dimension = "[M^-1 L^-2 T^4 I^2]";
        role = "Capacitance of the 4116 1-T DRAM storage node ($~40\\text{ fF}$)";
      } else if (sym === "t_{refresh}") {
        name = "DRAM Row Refresh Period";
        unit = "Milliseconds (ms)";
        dimension = "[T]";
        role =
          "Time required for video raster addressing to refresh all 64 DRAM row addresses ($4.07\\text{ ms}$)";
      } else if (sym === "t_{hold}") {
        name = "Maximum DRAM Retention Limit";
        unit = "Milliseconds (ms)";
        dimension = "[T]";
        role = "Maximum duration capacitor holds logic 1 before discharge ($> 4\\text{ ms}$)";
      } else if (sym === "MT" || sym === "\\text{MT}") {
        name = "Target Acquisition Movement Time";
        unit = "Seconds (s)";
        dimension = "[T]";
        role =
          "Human-motor positioning time predicted by Fitts's Law ($MT = a + b \\cdot \\text{ID}$)";
      } else if (sym === "\\text{ID}" || sym === "ID") {
        name = "Fitts's Index of Difficulty";
        unit = "Bits";
        dimension = "[1]";
        role =
          "Information-theoretic difficulty of acquiring screen target of width W at distance D";
      } else if (sym === "W") {
        name = "Screen Target Width";
        unit = "Pixels / Millimeters (mm)";
        dimension = "[L]";
        role = "Spatial tolerance width of the on-screen clickable element";
      } else if (sym === "D") {
        name = "Target Travel Distance";
        unit = "Pixels / Millimeters (mm)";
        dimension = "[L]";
        role = "Cursor displacement distance to reach on-screen target";
      } else if (sym === "\\text{CPI}" || sym === "CPI") {
        name = "Counts Per Inch (CPI Resolution)";
        unit = "Pulses / inch";
        dimension = "[L^-1]";
        role = "Encoder pulse frequency per unit physical mouse travel";
      } else if (sym === "\\tau_{shoulder}") {
        name = "Static Shoulder Muscle Torque";
        unit = "Newton-meters (N·m)";
        dimension = "[M L^2 T^-2]";
        role = "Gravitational deltoid reaction torque eliminated by tabletop arm support";
      } else if (sym === "n_e") {
        name = "Photoelectron Packet Count";
        unit = "Electrons";
        dimension = "[1]";
        role = "Number of free electrons generated by photon absorption in pixel";
      } else if (sym === "P_{opt}") {
        name = "Incident Optical Power";
        unit = "Watts (W)";
        dimension = "[M L^2 T^-3]";
        role = "Optical radiant power falling on the pixel active area";
      } else if (sym === "\\eta_{QE}") {
        name = "Quantum Efficiency";
        unit = "Dimensionless fraction [0-1]";
        dimension = "[1]";
        role = "Fraction of incident photons that liberate a conduction electron";
      } else if (sym === "T_{int}") {
        name = "Pixel Integration Time";
        unit = "Milliseconds (ms)";
        dimension = "[T]";
        role = "Time interval during which charges accumulate in the potential well";
      } else if (sym === "Q_{pixel}") {
        name = "Accumulated Pixel Charge";
        unit = "Coulombs (C)";
        dimension = "[I T]";
        role = "Total stored packet charge ($Q = q \\cdot n_e$)";
      } else if (sym === "\\psi_s") {
        name = "Surface Depletion Potential Well Depth";
        unit = "Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Electrostatic potential well depth trapping minority electrons";
      } else if (sym === "S_{out}" || sym === "S_{in}") {
        name = "Output / Input Charge Signal";
        unit = "Electrons / Volts";
        dimension = "[1]";
        role = "Charge packet size before vs after transfer across CCD shift registers";
      } else if (sym === "\\epsilon" || sym === "\\text{CTE}") {
        name = "Charge Transfer Inefficiency / Efficiency";
        unit = "Fraction per transfer";
        dimension = "[1]";
        role = "Fraction of charge lost per CCD transfer step (CTE = 1 - $\\epsilon$)";
      } else if (sym === "J_{dark}") {
        name = "Thermal Dark Current Density";
        unit = "Amperes per square meter (A/m²)";
        dimension = "[I L^-2]";
        role = "Spurious thermal electron-hole generation rate in silicon depletion zone";
      } else if (
        sym === "C" &&
        (pLower.includes("shannon") || pLower.includes("bandwidth") || pLower.includes("channel"))
      ) {
        name = "Shannon Channel Capacity";
        unit = "Bits per second (bps)";
        dimension = "[T^-1]";
        role = "Theoretical maximum error-free information transmission rate across noisy channel";
      } else if (sym === "G_p" || sym === "G") {
        name = "Anti-Jam Processing Gain";
        unit = "Decibels (dB) / Dimensionless Ratio";
        dimension = "[1]";
        role =
          "Signal-to-interference ratio improvement achieved by frequency-hopping spectrum expansion";
      } else if (sym === "W_{ss}" || sym === "W") {
        name = "Spread-Spectrum RF Bandwidth";
        unit = "Megahertz (MHz)";
        dimension = "[T^-1]";
        role = "Total frequency bandwidth across which carrier hops pseudo-randomly";
      } else if (
        sym === "N_{channels}" ||
        sym === "N_{total}" ||
        (sym === "N" && pLower.includes("channel"))
      ) {
        name = "Total Frequency Hopping Channels";
        unit = "Carrier bins [88 channels]";
        dimension = "[1]";
        role =
          "Total discrete radio frequency slots synchronized across transmitting and receiving rolls";
      } else if (sym === "N_{jam\\_channels}" || sym.includes("jam")) {
        name = "Jammer Blocked Channels";
        unit = "Active jam bins";
        dimension = "[1]";
        role = "Number of simultaneous frequency bins blocked by hostile narrowband interference";
      } else if (sym === "x" || sym === "c") {
        name = "Pseudo-Random Code Sequence";
        unit = "Binary code symbols [±1]";
        dimension = "[1]";
        role =
          "Orthogonal pseudo-random sequence governing transmitter and receiver carrier shifts";
      } else if (sym === "\\vec{v}_{hand}" || sym === "v_{hand}") {
        name = "Hand Movement Velocity Vector";
        unit = "Meters per second (m/s)";
        dimension = "[L T^-1]";
        role = "Spatial translation speed and heading of the mouse chassis across the work surface";
      } else if (sym === "V_x" || sym === "V_y" || sym === "V_{ref}") {
        name = "Potentiometer Divider / Reference Voltage";
        unit = "Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Analog DC voltage proportional to orthogonal knife-edge wheel rotation angle";
      } else if (sym === "X_{screen}" || sym === "Y_{screen}") {
        name = "Screen CRT Cursor Coordinate";
        unit = "Pixels";
        dimension = "[1]";
        role = "Quantized on-screen display coordinate driven by mouse encoder integration";
      } else if (sym === "V_G" || sym === "V_0" || sym === "V_0^2") {
        name = "MOS Gate Depletion Potential";
        unit = "Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Clocked gate electrode potential creating electrostatic surface potential well";
      } else if (sym === "V_{out}") {
        name = "Floating Diffusion Sense Output Voltage";
        unit = "Microvolts per electron (μV/e⁻)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Charge-to-voltage conversion amplitude on output sensing node";
      } else if (sym === "C_{FD}") {
        name = "Floating Diffusion Node Capacitance";
        unit = "Femtofarads (fF) [~10 fF]";
        dimension = "[M^-1 L^-2 T^4 I^2]";
        role =
          "Microscopic node capacitance converting charge packets into readable voltage signals";
      } else if (sym === "W_{dep}") {
        name = "Silicon Depletion Layer Width";
        unit = "Micrometers (μm)";
        dimension = "[L]";
        role = "Thickness of carrier-depleted semiconductor region collecting photoelectrons";
      } else if (sym === "s_0") {
        name = "Surface Recombination Velocity";
        unit = "Centimeters per second (cm/s)";
        dimension = "[L T^-1]";
        role = "Rate of non-radiative electron-hole recombination at silicon-dielectric interface";
      } else if (sym === "V_c" || sym === "V_{dd}") {
        name = "DRAM Storage Cell / Supply Rail Voltage";
        unit = "Volts (V) [+5V / +12V]";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Stored logic potential on MOS storage capacitor vs main power supply voltage";
      } else if (sym === "n" && pLower.includes("apple")) {
        name = "NTSC Color Subcarrier Phase Tap Index";
        unit = "Clock phase index [0-3]";
        dimension = "[1]";
        role = "Quarter-cycle delay index generating four distinct composite color tint hues";
      }
    }

    // 3. AERODYNAMICS / FLIGHT DYNAMICS / PROPULSION
    else if (isAero) {
      if (sym === "L" || sym.startsWith("L_")) {
        name = "Aerodynamic Lift Force";
        unit = "Newtons (N)";
        dimension = "[M L T^-2]";
        role = "Upward aerodynamic reaction force perpendicular to relative wind";
        telemetryKey = "airspeed";
        telemetryMetricLabel = "Gross Lift";
      } else if (sym === "D" || sym === "C_{Di}" || sym.startsWith("D_")) {
        name = "Aerodynamic Drag / Induced Drag";
        unit = "Newtons (N) / Dimensionless";
        dimension = "[M L T^-2]";
        role = "Aerodynamic resistance opposing forward motion through airmass";
        telemetryKey = "wingWarp";
        telemetryMetricLabel = "Induced Drag";
      } else if (sym === "C_L" || sym === "C_L^2") {
        name = "Lift Coefficient";
        unit = "Dimensionless ratio";
        dimension = "[1]";
        role = "Non-dimensional lift force generated per unit wing area and dynamic pressure";
        telemetryKey = "wingWarp";
      } else if (sym === "\\text{AR}" || sym === "AR") {
        name = "Wing Aspect Ratio";
        unit = "Dimensionless ratio ($b^2/S$)";
        dimension = "[1]";
        role = "Wingspan squared divided by total wing planform area";
      } else if (sym === "e") {
        name = "Oswald Span Efficiency Factor";
        unit = "Dimensionless factor [0.7 - 1.0]";
        dimension = "[1]";
        role = "Efficiency correction for non-elliptical spanwise lift distribution";
      } else if (sym === "\\rho") {
        name = "Air Mass Density";
        unit = "kg/m³ ($1.225\\text{ kg/m}^3$)";
        dimension = "[M L^-3]";
        role = "Mass of ambient atmospheric fluid per unit volume";
      } else if (sym === "V" || sym === "V^2") {
        name = "True Airspeed";
        unit = "Meters per second (m/s)";
        dimension = "[L T^-1]";
        role = "Velocity of the aircraft relative to surrounding airmass";
        telemetryKey = "airspeed";
      } else if (sym === "\\alpha") {
        name = "Angle of Attack (AoA)";
        unit = "Degrees (°) / Radians";
        dimension = "[1]";
        role = "Angle between wing chord line and oncoming relative airflow vector";
        telemetryKey = "wingWarp";
      } else if (sym === "\\phi") {
        name = "Bank Roll Angle";
        unit = "Degrees (°) / Radians";
        dimension = "[1]";
        role = "Aircraft roll attitude angle during coordinated banking turn";
      } else if (sym === "\\dot{psi}" || sym === "\\psi") {
        name = "Turn Rate / Yaw Heading";
        unit = "Degrees per second (°/s) / Radians";
        dimension = "[T^-1]";
        role = "Rate of heading angular rotation around vertical axis";
        telemetryKey = "rudderAngle";
      } else if (sym === "\\Gamma" || sym === "\\Gamma_0") {
        name = "Vortex Circulation / Peak Circulation";
        unit = "m²/s";
        dimension = "[L^2 T^-1]";
        role = "Bound vortex line integral generating aerodynamic circulation";
      } else if (sym === "b") {
        name = "Total Wingspan";
        unit = "Meters (m)";
        dimension = "[L]";
        role = "Tip-to-tip spanwise transverse length of the biplane wings";
      } else if (sym === "C_m" || sym === "C_{m0}") {
        name = "Pitching Moment Coefficient";
        unit = "Dimensionless ratio";
        dimension = "[1]";
        role = "Aerodynamic torque around the lateral pitch axis normalized by mean chord";
      } else if (sym === "\\delta_e") {
        name = "Canard Pitch Deflection Angle";
        unit = "Degrees (°)";
        dimension = "[1]";
        role = "Angular pitch trim deflection of the forward horizontal canard surface";
      }
    }

    // 4. THERMODYNAMICS / HEAT ENGINES / COOLING
    else if (isThermal) {
      if (sym === "P" || sym.startsWith("P_")) {
        name = "Thermodynamic Pressure";
        unit = "Pascals (Pa) / Atmospheres";
        dimension = "[M L^-1 T^-2]";
        role = "Hydrostatic / vapor pressure exerted by the working fluid";
        telemetryKey = "pressure";
      } else if (sym === "T" || sym.startsWith("T_") || sym === "T^4") {
        name = "Absolute Temperature";
        unit = "Kelvin (K)";
        dimension = "[\\Theta]";
        role = "Core thermodynamic thermal energy level of the cycle";
        telemetryKey = "tempK";
      } else if (sym === "Q" || sym.startsWith("Q_")) {
        name = "Thermal Heat Energy";
        unit = "Joules (J) / Kilowatts (kW)";
        dimension = "[M L^2 T^-2]";
        role = "Heat added to or rejected from the thermodynamic cycle";
      } else if (sym === "W" || sym.startsWith("W_")) {
        name = "Mechanical Work Output";
        unit = "Joules (J)";
        dimension = "[M L^2 T^-2]";
        role = "Useful mechanical energy extracted by expansion against pistons/turbines";
      } else if (sym === "\\eta" || sym.startsWith("\\eta_")) {
        name = "Thermal Conversion Efficiency";
        unit = "Dimensionless ratio [0-1]";
        dimension = "[1]";
        role = "Ratio of useful work produced to total heat consumed";
      } else if (sym === "\\mu_{JT}") {
        name = "Joule-Thomson Expansion Coefficient";
        unit = "Kelvin per Pascal (K/Pa)";
        dimension = "[M^-1 L T^2 \\Theta]";
        role = "Rate of temperature drop per unit pressure reduction across throttle valve";
      } else if (sym === "\\text{COP}" || sym === "COP") {
        name = "Coefficient of Performance (COP)";
        unit = "Dimensionless ratio";
        dimension = "[1]";
        role = "Ratio of useful refrigeration cooling capacity to compressor electrical work";
      }
    }

    // 5. MATERIALS SCIENCE / CHEMISTRY / POLYMERS
    else if (isMaterials) {
      if (sym.startsWith("\\sigma")) {
        name = "Tensile / Shear Stress";
        unit = "Gigapascals (GPa) / Pascals (Pa)";
        dimension = "[M L^-1 T^-2]";
        role = "Internal force per unit cross-sectional area resisting external elongation";
      } else if (sym.startsWith("\\varepsilon") || sym === "\\epsilon") {
        name = "Mechanical / Elongational Strain";
        unit = "Dimensionless fraction / s^-1";
        dimension = "[1]";
        role = "Deformation extension normalized by initial gage length";
      } else if (sym === "E" || sym.startsWith("E_")) {
        name = "Young's Elastic Modulus";
        unit = "Gigapascals (GPa) / Pascals (Pa)";
        dimension = "[M L^-1 T^-2]";
        role = "Intrinsic axial stiffness of primary covalent polymer bonds";
      } else if (sym === "c") {
        name = "Longitudinal Acoustic Shock Velocity";
        unit = "Meters per second (m/s)";
        dimension = "[L T^-1]";
        role = "Speed of stress wave propagation through the crystalline polymer lattice";
      } else if (sym === "F_b") {
        name = "Archimedean Buoyant Force";
        unit = "Newtons (N)";
        dimension = "[M L T^-2]";
        role = "Upward hydrostatic force equal to the weight of displaced water volume";
      } else if (sym === "H_{vap}") {
        name = "Enthalpy of Polymer Vaporization";
        unit = "Kilojoules per mole (kJ/mol)";
        dimension = "[M L^2 T^-2 N^-1]";
        role = "Thermal energy required to overcome intermolecular cohesive lattice forces";
      } else if (sym === "V_m") {
        name = "Molar Volume of Repeating Unit";
        unit = "Cubic centimeters per mole (cm³/mol)";
        dimension = "[L^3 N^-1]";
        role = "Volume occupied by one mole of polymer repeat units";
      }
    }

    // 6. NUCLEAR REACTOR PHYSICS & CRITICALITY
    else if (
      pLower.includes("reactor") ||
      pLower.includes("fermi") ||
      pLower.includes("fission") ||
      pLower.includes("neutron") ||
      pLower.includes("moderator") ||
      pLower.includes("buckling")
    ) {
      if (sym === "\\eta") {
        name = "Fuel Reproduction Factor";
        unit = "Fast neutrons per thermal absorption";
        dimension = "[1]";
        role = "Thermal fission neutron yield of natural uranium fuel lumps";
      } else if (sym === "\\epsilon") {
        name = "Fast Fission Factor";
        unit = "Dimensionless multiplier ($approx 1.03$)";
        dimension = "[1]";
        role = "Fractional increase in total fission neutrons from fast fission of U-238";
      } else if (sym === "\\xi") {
        name = "Average Logarithmic Energy Decrement";
        unit = "Dimensionless decrement per collision";
        dimension = "[1]";
        role =
          "Mean fractional neutron energy reduction per elastic collision with carbon graphite moderator";
      } else if (sym === "E_0" || sym === "E_{th}") {
        name = "Fission / Thermal Neutron Energy";
        unit = "MeV / eV ($2\\text{ MeV} \\to 0.025\\text{ eV}$)";
        dimension = "[M L^2 T^-2]";
        role = "Prompt fission kinetic energy vs room-temperature thermal energy";
      } else if (sym === "n") {
        name = "Core Neutron Population Density";
        unit = "Neutrons per cubic centimeter (n/cm³)";
        dimension = "[L^-3]";
        role = "Instantaneous thermal neutron density governing reactor power output";
      } else if (sym === "\\beta") {
        name = "Delayed Neutron Fraction";
        unit = "Dimensionless fraction ($\beta approx 0.0065$)";
        dimension = "[1]";
        role = "Fraction of fission neutrons emitted via delayed precursor radioactive decay";
      } else if (sym === "\\Lambda") {
        name = "Prompt Neutron Generation Time";
        unit = "Milliseconds (ms)";
        dimension = "[T]";
        role =
          "Mean elapsed time between thermal neutron absorption and subsequent fission emission";
      } else if (sym.startsWith("\\lambda")) {
        name = "Precursor Radioactive Decay Constant";
        unit = "Inverse seconds (s^-1)";
        dimension = "[T^-1]";
        role = "Decay rate of the delayed neutron fission product precursor group";
      } else if (sym === "N_U") {
        name = "Uranium Atomic Number Density";
        unit = "Atoms per cubic centimeter (atoms/cm³)";
        dimension = "[L^-3]";
        role = "Concentration of heavy fertile and fissile uranium nuclei in fuel lumps";
      } else if (sym.startsWith("\\Sigma")) {
        name = "Macroscopic Scattering Cross Section";
        unit = "Inverse centimeters (cm^-1)";
        dimension = "[L^-1]";
        role =
          "Probability per unit travel distance that a fast neutron collides elastically with graphite";
      } else if (sym === "B^2" || sym.startsWith("B_")) {
        name = "Core Geometric Buckling Factor";
        unit = "Inverse square meters (m^-2)";
        dimension = "[L^-2]";
        role =
          "Spatial curvature of the neutron flux eigenmode determining leakage loss from core geometry";
      } else if (sym === "N" || sym === "N_0") {
        name = "Elastic Collision Thermalization Count";
        unit = "Collisions [~115 collisions]";
        dimension = "[1]";
        role =
          "Number of graphite collisions required to slow 2 MeV fast neutrons to 0.025 eV thermal speed";
      } else if (sym === "H") {
        name = "Active Core Critical Height";
        unit = "Meters (m)";
        dimension = "[L]";
        role = "Vertical dimension of the CP-1 uranium-graphite critical pile geometry";
      }
    }

    // 7. MICROWAVE & CAVITY MAGNETRON PHYSICS
    else if (
      pLower.includes("microwave") ||
      pLower.includes("magnetron") ||
      pLower.includes("spencer") ||
      pLower.includes("cavity") ||
      pLower.includes("dielectric") ||
      pLower.includes("waveguide") ||
      pLower.includes("impedance")
    ) {
      if (sym === "\\vec{E}" || sym === "E" || sym === "E_0") {
        name = "Microwave Electric Field Vector";
        unit = "Volts per meter (V/m)";
        dimension = "[M L T^-3 I^-1]";
        role =
          "High-frequency alternating microwave electric field driving water dipole oscillation";
      } else if (sym === "r_a" || sym === "r_c" || sym === "r_c^2") {
        name = "Magnetron Anode / Cathode Radius";
        unit = "Millimeters (mm)";
        dimension = "[L]";
        role = "Cylindrical resonant cavity geometry determining electron cyclotron cutoff orbits";
      } else if (sym === "V_a") {
        name = "Magnetron Anode Accelerating High Voltage";
        unit = "Kilovolts (kV) [~4 kV]";
        dimension = "[M L^2 T^-3 I^-1]";
        role =
          "High DC potential accelerating electrons radially from cathode toward resonant anode blocks";
      } else if (sym === "c_p") {
        name = "Specific Heat Capacity";
        unit = "Joules per kilogram-kelvin (J/(kg·K))";
        dimension = "[L^2 T^-2 \\Theta^-1]";
        role =
          "Thermal energy required to raise target organic food matter temperature by one kelvin";
      } else if (sym === "Z_{in}" || sym === "Z_0" || sym === "Z_L") {
        name = "Characteristic / Input Impedance";
        unit = "Ohms (Ω) [50 Ω / 377 Ω]";
        dimension = "[M L^2 T^-3 I^-2]";
        role = "Wave transmission line impedance and quarter-wave choke matching boundary";
      } else if (sym === "j") {
        name = "Imaginary Phase Unit (j = √-1)";
        unit = "Complex phase operator";
        dimension = "[1]";
        role =
          "90-degree reactive impedance phase rotation in electromagnetic transmission line equations";
      }
    }

    // 8. SEMICONDUCTOR & SOLID-STATE PHYSICS
    if (
      pLower.includes("transistor") ||
      pLower.includes("semiconductor") ||
      pLower.includes("germanium") ||
      pLower.includes("silicon") ||
      pLower.includes("depletion") ||
      pLower.includes("carrier") ||
      pLower.includes("electromigration") ||
      pLower.includes("metallization") ||
      pLower.includes("interconnect")
    ) {
      if (sym === "p_0" || sym === "n_0" || sym === "n_i") {
        name = "Equilibrium Carrier Concentration";
        unit = "Carriers per cubic centimeter (cm^-3)";
        dimension = "[L^-3]";
        role = "Intrinsic vs equilibrium charge carrier density in bulk semiconductor crystal";
      } else if (sym.startsWith("\\mu_") || sym === "\\mu_p" || sym === "\\mu_n") {
        name = "Carrier Drift Mobility";
        unit = "cm²/(V·s)";
        dimension = "[M^-1 T^2 I]";
        role = "Drift velocity acquired per unit applied electrostatic field gradient";
      } else if (sym === "A_V") {
        name = "Voltage Amplification Gain";
        unit = "Dimensionless ratio";
        dimension = "[1]";
        role = "Ratio of output collector voltage swing to input emitter signal voltage";
      } else if (sym === "\\alpha") {
        name = "Common-Base Current Gain";
        unit = "Dimensionless fraction ($approx 0.98 - 0.99$)";
        dimension = "[1]";
        role = "Fraction of injected emitter carriers successfully collected at the collector";
      } else if (sym === "V_C") {
        name = "Collector Reverse Bias Voltage";
        unit = "Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Reverse bias potential extracting injected minority holes across collector contact";
      } else if (sym === "Q_{ss}") {
        name = "Surface State Trapped Charge Density";
        unit = "Coulombs per square centimeter (C/cm²)";
        dimension = "[I T L^-2]";
        role =
          "Electrostatic charge trapped in localized quantum surface levels screening bulk germanium";
      } else if (sym === "q") {
        name = "Elementary Electric Charge";
        unit = "Coulombs (1.602 × 10^-19 C)";
        dimension = "[I T]";
        role = "Fundamental charge quantum of conduction electrons and holes";
      } else if (sym === "D_{it}") {
        name = "Interface Trap Energy Density";
        unit = "States per cm²-eV (states/(cm²·eV))";
        dimension = "[M^-1 L^-4 T^2 I^-1]";
        role = "Density of localized electronic states across the semiconductor bandgap";
      } else if (sym === "E_F" || sym === "E_0") {
        name = "Fermi Energy Level / Neutral Energy";
        unit = "Electron-volts (eV)";
        dimension = "[M L^2 T^-2]";
        role = "Thermodynamic electrochemical potential of charge carriers in the crystal";
      } else if (sym === "D_p" || sym === "D_n") {
        name = "Minority Carrier Diffusion Coefficient";
        unit = "Square centimeters per second (cm²/s)";
        dimension = "[L^2 T^-1]";
        role =
          "Brownian spatial diffusion rate of minority hole packets through the base semiconductor";
      } else if (sym === "C_1") {
        name = "Fowler-Nordheim Pre-Exponential Factor";
        unit = "Amperes per volt squared (A/V²)";
        dimension = "[M^-1 L^-4 T^3 I^3]";
        role =
          "Quantum mechanical tunneling rate coefficient across thin silicon dioxide dielectric";
      } else if (sym === "J^n") {
        name = "Electromigration Current Density Scaling";
        unit = "(A/cm²)^n";
        dimension = "[I^n L^-2n]";
        role =
          "Power-law atomic flux divergence driving vacancy coalescence in aluminum interconnects";
      } else if (sym === "t_{transit}") {
        name = "Base Minority Carrier Transit Time";
        unit = "Picoseconds (ps) / Nanoseconds (ns)";
        dimension = "[T]";
        role =
          "Time required for injected minority carriers to diffuse across the thin base region";
      } else if (sym === "\\tau_{RC}") {
        name = "RC Interconnect Propagation Delay";
        unit = "Picoseconds (ps)";
        dimension = "[T]";
        role = "Distributed Elmore charging delay across on-chip aluminum interconnection lines";
      } else if (sym === "C_{wire}") {
        name = "Interconnect Parasitic Capacitance";
        unit = "Femtofarads per micrometer (fF/μm)";
        dimension = "[M^-1 L^-3 T^4 I^2]";
        role = "Capacitive coupling between evaporated aluminum traces and silicon substrate";
      } else if (sym === "x_{ox}" || sym === "x_{ox}^2") {
        name = "Thermal Silicon Dioxide Thickness";
        unit = "Nanometers (nm)";
        dimension = "[L]";
        role = "Passivating and insulating thermal oxide dielectric barrier";
      } else if (sym === "J_{FN}" || sym === "J") {
        name = "Current Density / Tunneling Current";
        unit = "Amperes per square centimeter (A/cm²)";
        dimension = "[I L^-2]";
        role = "High-field quantum mechanical Fowler-Nordheim field emission tunneling density";
      } else if (sym === "E_{ox}" || sym === "E_{ox}^2" || sym === "E_{bd}") {
        name = "Oxide Electric Field / Breakdown Field";
        unit = "Megavolts per centimeter (MV/cm)";
        dimension = "[M L T^-3 I^-1]";
        role = "Electrostatic field gradient across insulating silicon dioxide layer";
      } else if (sym === "\\text{MTTF}" || sym === "MTTF") {
        name = "Mean Time To Failure (MTTF)";
        unit = "Hours / Years";
        dimension = "[T]";
        role =
          "Expected operational lifetime before electromigration creates metal void open-circuits";
      } else if (sym === "E_a") {
        name = "Electromigration Activation Energy";
        unit = "Electron-volts (eV) [~0.7 eV]";
        dimension = "[M L^2 T^-2]";
        role = "Thermal energy barrier required for aluminum grain boundary vacancy diffusion";
      }
    }

    // 6. DEFAULT GENERAL PHYSICAL DICTIONARY
    if (name.startsWith("Parameter (")) {
      if (/^L$/i.test(sym) || /^L_/.test(sym)) {
        name = "Inductance / Length / Lift";
        unit = "Henries (H) / Meters (m) / Newtons (N)";
        dimension = "[M L^2 T^-2 I^-2]";
        role = "Circuit inductance, characteristic length, or dynamic force";
      } else if (/^V$/i.test(sym) || /^V\^2/.test(sym) || /^v$/i.test(sym) || /^v_/.test(sym)) {
        name = "Electric Potential / Flow Velocity";
        unit = "Volts (V) / Meters per second (m/s)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Electrical potential difference or fluid flow speed";
        telemetryKey = "voltage";
      } else if (/^I$/i.test(sym) || /^I_/.test(sym) || /^i$/i.test(sym)) {
        name = "Electric Current";
        unit = "Amperes (A)";
        dimension = "[I]";
        role = "Rate of electric charge carrier flow through the conductor cross-section";
        telemetryKey = "current";
      } else if (/^R$/i.test(sym) || /^R_/.test(sym)) {
        name = "Electrical Resistance / Gas Constant";
        unit = "Ohms (Ω) / J/(mol·K)";
        dimension = "[M L^2 T^-3 I^-2]";
        role = "Opposition to electrical charge flow or thermodynamic gas constant";
      } else if (/^P$/i.test(sym) || /^P_/.test(sym) || /^p$/i.test(sym)) {
        name = "Power Output / Fluid Pressure";
        unit = "Watts (W) / Pascals (Pa)";
        dimension = "[M L^2 T^-3]";
        role = "Rate of energy transfer or thermodynamic hydrostatic pressure";
        telemetryKey = "pressure";
      } else if (/^T$/i.test(sym) || /^T_/.test(sym) || /^T\^4/.test(sym)) {
        name = "Absolute Temperature / Thrust";
        unit = "Kelvin (K) / Newtons (N)";
        dimension = "[\\Theta]";
        role = "Thermodynamic temperature or mechanical reaction thrust";
        telemetryKey = "tempK";
      } else if (/^F$/i.test(sym) || /^F_/.test(sym)) {
        name = "Mechanical Force Vector";
        unit = "Newtons (N)";
        dimension = "[M L T^-2]";
        role = "Net dynamic vector force acting upon the mechanism";
        telemetryKey = "thrust";
      } else if (/^B$/i.test(sym) || /^B_/.test(sym) || /\\vec\{B\}/.test(sym)) {
        name = "Magnetic Flux Density";
        unit = "Tesla (T)";
        dimension = "[M T^-2 I^-1]";
        role = "Strength and spatial orientation of the magnetic field vector";
        telemetryMetricLabel = "Stator Field (B)";
      } else if (/\\omega/.test(sym) || /^f$/i.test(sym) || /^f_/.test(sym)) {
        name = "Oscillation Frequency / Angular Velocity";
        unit = "Radians per second (rad/s) / Hertz (Hz)";
        dimension = "[T^-1]";
        role = "Rotational speed, AC line frequency, or modulation rate";
        telemetryKey = "freqHz";
      } else if (/\\rho/.test(sym)) {
        name = "Fluid Density / Specific Resistivity";
        unit = "kg/m³ / Ω·m";
        dimension = "[M L^-3]";
        role = "Mass per unit volume of the working medium or material resistance";
      } else if (/\\sigma/.test(sym)) {
        name = "Electrical Conductivity / Stefan-Boltzmann Constant";
        unit = "Siemens per meter (S/m) / W/(m²·K⁴)";
        dimension = "[M^-1 L^-3 T^3 I^2]";
        role = "Charge conduction efficiency or radiative blackbody constant";
      } else if (/^k$/i.test(sym) || /^k_/.test(sym)) {
        name = "Spring Constant / Thermal Conductivity";
        unit = "N/m / W/(m·K)";
        dimension = "[M T^-2]";
        role = "Mechanical stiffness, thermal conduction rate, or nuclear multiplication";
      } else if (/^m$/i.test(sym) || /^M$/i.test(sym) || /^m_/.test(sym)) {
        name = "Inertial Mass / Molecular Weight";
        unit = "Kilograms (kg) / g/mol";
        dimension = "[M]";
        role = "Mass of moving bodies or chemical quantity";
      } else if (/^a$/i.test(sym) || /^g$/i.test(sym)) {
        name = "Linear / Gravitational Acceleration";
        unit = "Meters per second squared (m/s²)";
        dimension = "[L T^-2]";
        role = "Rate of change of velocity or local gravitational acceleration field";
      } else if (/^t$/i.test(sym) || /^\\Delta t/.test(sym)) {
        name = "Time Duration";
        unit = "Seconds (s)";
        dimension = "[T]";
        role = "Elapsed operational time interval";
      } else if (/^S$/i.test(sym) || /^A$/i.test(sym)) {
        name = "Surface Area / Planform Area";
        unit = "Square meters (m²)";
        dimension = "[L^2]";
        role = "Total geometric contact, lifting, or radiative surface area";
      } else if (sym === "h" || sym === "\\hbar") {
        name = "Planck's Quantum Action Constant";
        unit = "Joule-seconds (J·s)";
        dimension = "[M L^2 T^-1]";
        role =
          "Fundamental quantum of electromagnetic action ($6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$)";
      } else if (sym === "j" || sym === "i") {
        name = "Imaginary Phase Unit (j = √-1)";
        unit = "Complex phase operator";
        dimension = "[1]";
        role = "90-degree phase shift operator in AC circuit analysis and vector rotation";
      } else if (/^Q$/i.test(sym) || /^Q_/.test(sym) || /^q$/i.test(sym) || /^q_/.test(sym)) {
        name = "Thermal Heat / Electric Charge / Flow Rate";
        unit = "Joules (J) / Watts (W) / Coulombs (C)";
        dimension = "[M L^2 T^-2]";
        role = "Heat energy transferred, electric charge quantity, or volumetric flow rate";
      } else if (
        /^C_p$/i.test(sym) ||
        /^c_p$/i.test(sym) ||
        /^C_v$/i.test(sym) ||
        /^c_v$/i.test(sym)
      ) {
        name = "Specific Heat Capacity";
        unit = "Joules per kilogram-kelvin (J/(kg·K))";
        dimension = "[L^2 T^-2 \\Theta^-1]";
        role = "Thermal energy required to raise unit mass temperature by one kelvin";
      } else if (/^U$/i.test(sym) || /^U_/.test(sym)) {
        name = "Overall Heat Transfer Coefficient";
        unit = "Watts per square meter-kelvin (W/(m²·K))";
        dimension = "[M T^-3 \\Theta^-1]";
        role = "Overall thermal conductance across boundary walls or heat exchanger tubes";
      } else if (/^W$/i.test(sym) || /^W_/.test(sym) || /^w$/i.test(sym) || /^w_/.test(sym)) {
        name = "Mechanical Work / Width / Spatial Span";
        unit = "Joules (J) / Meters (m)";
        dimension = "[M L^2 T^-2]";
        role = "Mechanical work done by expanding fluid or transverse spatial dimension";
      } else if (/^E$/i.test(sym) || /^E_/.test(sym)) {
        name = "Electromotive Force / Energy / Electric Field";
        unit = "Volts (V) / Joules (J) / (V/m)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Electrical potential, kinetic/potential energy, or electrostatic field strength";
      } else if (
        /^D$/i.test(sym) ||
        /^D_/.test(sym) ||
        /^d$/i.test(sym) ||
        /^d_/.test(sym) ||
        /^d\^/.test(sym)
      ) {
        name = "Characteristic Diameter / Diffusion / Displacement";
        unit = "Meters (m) / (m²/s)";
        dimension = "[L]";
        role = "Geometric diameter, atomic diffusion rate, or displacement distance";
      } else if (/^N$/i.test(sym) || /^N_/.test(sym) || /^n$/.test(sym) || /^n_/.test(sym)) {
        name = "Quantity Count / Rotational Speed / Winding Turns";
        unit = "Count [1] / RPM / Turns";
        dimension = "[1]";
        role = "Discrete component count, shaft rotational speed, or coil turn count";
      } else if (/^c$/i.test(sym) || /^c_/.test(sym)) {
        name = "Wave Propagation Speed / Sound Velocity";
        unit = "Meters per second (m/s)";
        dimension = "[L T^-1]";
        role = "Speed of acoustic, elastic, or electromagnetic wave propagation";
      } else if (/^[xyz]$/i.test(sym) || /^[xyz]_/i.test(sym) || /^[xyz]\^/i.test(sym)) {
        name = "Spatial Coordinate / Displacement / Mole Fraction";
        unit = "Meters (m) / Dimensionless fraction";
        dimension = "[L]";
        role = "Cartesian spatial position coordinate, displacement, or species mole fraction";
      } else if (sym.includes("r^{\\gamma") || sym.includes("r^\\gamma")) {
        name = "Adiabatic Temperature Expansion Factor";
        unit = "Dimensionless ratio";
        dimension = "[1]";
        role = "Isentropic expansion temperature factor governing cycle thermal efficiency";
      } else if (sym.includes("e^{-") || sym.includes("e^-")) {
        name = "Exponential Decay / Attenuation Factor";
        unit = "Dimensionless fraction";
        dimension = "[1]";
        role = "Exponential spatial or temporal attenuation of energy across media";
      } else if (sym === "I^2") {
        name = "Conduction Current Squared (I²)";
        unit = "Amperes squared (A²)";
        dimension = "[I^2]";
        role = "Current squared driving Joule resistive heating dissipation";
      } else if (sym === "e^2" || sym === "h^2") {
        name = "Fundamental Physical Constant Squared";
        unit = "Physical units squared";
        dimension = "[1]";
        role = "Square of elementary charge or Planck's constant in quantum equations";
      } else if (sym.startsWith("b_") || sym.startsWith("b_{")) {
        name = "Binary Notch / Punch Cell Code";
        unit = "Binary logic state [0/1]";
        dimension = "[1]";
        role = "Encoded discrete binary data bit in punched card or matrix sorting logic";
      } else if (sym.startsWith("X_") || sym.startsWith("Y_") || sym === "X" || sym === "Y") {
        name = "Logic Input / Output Signal State";
        unit = "Binary logic state [0/1]";
        dimension = "[1]";
        role = "Discrete input or output logic state in relay or switching networks";
      } else if (sym.startsWith("A_") || sym.startsWith("A_{")) {
        name = "Harmonic Fourier Amplitude Coefficient";
        unit = "Dimensionless amplitude";
        dimension = "[1]";
        role = "Peak amplitude of individual acoustic or electromagnetic Fourier harmonics";
      } else if (sym === "\\vec{L}" || sym === "L_{vec}") {
        name = "Total Angular Momentum Vector";
        unit = "Kilogram meter-squared per second (kg·m²/s)";
        dimension = "[M L^2 T^-1]";
        role = "Gyroscopic angular momentum stabilizing spinning gun barrels or rotors";
      } else if (sym === "\\vec{m}" || sym === "m_{vec}") {
        name = "Magnetic Dipole Moment Vector";
        unit = "Ampere square meters (A·m²)";
        dimension = "[I L^2]";
        role = "Rotor magnetic dipole vector reacting with stator field to generate motor torque";
      } else if (sym === "J") {
        name = "Hydrodynamic Advance Ratio / Current Density";
        unit = "Dimensionless ratio / A/m²";
        dimension = "[1]";
        role = "Propeller axial advance per revolution or electrical current density";
      } else if (sym === "C_T") {
        name = "Propeller Hydrodynamic Thrust Coefficient";
        unit = "Dimensionless coefficient";
        dimension = "[1]";
        role = "Dimensionless propeller thrust force normalized by water density and disc area";
      } else if (sym === "H" || sym.startsWith("H^")) {
        name = "Information Entropy / Hydraulic Water Head";
        unit = "Bits / card / Meters (m)";
        dimension = "[1]";
        role = "Information content density or hydrostatic elevation head";
      } else if (sym === "t_{dash}" || sym === "t_{dot}") {
        name = "Morse Code Element Duration (Dash / Dot)";
        unit = "Milliseconds (ms)";
        dimension = "[T]";
        role =
          "Standard temporal duration of telegraphic pulse units ($t_{\\text{dash}} = 3 t_{\\text{dot}}$)";
      } else if (sym === "g^2" || sym === "g") {
        name = "Electromagnetic Air Gap Length";
        unit = "Millimeters squared (mm²) / Meters (m)";
        dimension = "[L^2]";
        role = "Physical air gap clearance separating solenoid armature from iron core";
      } else if (sym === "V_{rx}" || sym === "V_0" || sym === "V_{th}^2" || sym === "V_{sec}") {
        name = "Electric Potential Signal / Source Voltage";
        unit = "Volts (V)";
        dimension = "[M L^2 T^-3 I^-1]";
        role = "Received telegraph pulse voltage or stepped-up resonant potential";
      } else if (sym === "V_1" || sym === "V_{displaced}" || sym === "V_d") {
        name = "Volumetric Capacity / Displaced Fluid Volume";
        unit = "Cubic meters (m³) / Liters";
        dimension = "[L^3]";
        role = "Volume of displaced buoyant water or cylinder displacement capacity";
      } else if (sym === "C_{10}" || sym === "C_{01}") {
        name = "Mooney-Rivlin Hyperelastic Rubber Constants";
        unit = "Megapascals (MPa)";
        dimension = "[M L^-1 T^-2]";
        role = "Empirical strain energy density parameters governing vulcanized rubber elasticity";
      } else if (sym === "h_{retract}" || sym === "a_{max}") {
        name = "Needle Retraction Stroke / Cam Peak Acceleration";
        unit = "Millimeters (mm) / m/s²";
        dimension = "[L]";
        role = "Vertical needle eye retraction stroke forming open thread loop for shuttle passage";
      } else if (sym === "p_{pitch}" || sym === "p_{stitch}") {
        name = "Lockstitch Seam Pitch Spacing";
        unit = "Millimeters per stitch (mm)";
        dimension = "[L]";
        role = "Linear spacing between adjacent needle penetrations along cloth seam";
      } else if (sym === "C_d") {
        name = "Orifice Flow Discharge Coefficient";
        unit = "Dimensionless ratio (~0.6)";
        dimension = "[1]";
        role = "Flow contraction and friction factor through pneumatic valves and ports";
      } else if (sym === "\\text{COP}" || sym === "COP") {
        name = "Coefficient of Performance (COP)";
        unit = "Dimensionless ratio";
        dimension = "[1]";
        role = "Ratio of useful cooling capacity to thermal input energy";
      } else if (sym === "B^2") {
        name = "Core Geometric Buckling Factor";
        unit = "Inverse square meters (m^-2)";
        dimension = "[L^-2]";
        role = "Spatial curvature of neutron flux governing criticality leakage boundary";
      } else if (sym === "J_{dark}" || sym === "s_0") {
        name = "Thermal Dark Current / Surface Recombination Velocity";
        unit = "Amperes per m² (A/m²) / cm/s";
        dimension = "[I L^-2]";
        role = "Thermal noise electron accumulation or interface carrier recombination speed";
      } else if (sym === "o" || sym === "u") {
        name = "Mass Fraction / Speed Ratio";
        unit = "Dimensionless ratio";
        dimension = "[1]";
        role = "Chemical ingredient percentage by weight or relative velocity ratio";
      } else {
        name = formatSymbolForDisplay(sym);
      }
    }

    return {
      id: safeId,
      symbol: sym,
      name,
      color,
      role,
      unit,
      dimension,
      explanation: `Governs ${cleanNameForSentence(name)} within ${principle.principle.toLowerCase()}: ${principle.explanation.slice(0, 180)}...`,
      telemetryKey,
      telemetryMetricLabel,
    };
  });

  // Construct colorized LaTeX safely token by token
  const varMap = new Map<string, EquationVariable>();
  for (const v of variables) {
    varMap.set(v.symbol, v);
  }

  const colorizerRegex =
    /(\\(?:text|mathrm|mathbf|mathit|mathsf|mathtt)\{[^{}]*\}|\\vec\{[a-zA-Z]+\}(?:\([a-zA-Z0-9_+-]+\))?(?:_(?:\{[^{}]*\}|[a-zA-Z0-9]+))?|\\[a-zA-Z]+(?:_(?:\{[^{}]*\}|[a-zA-Z0-9]+))?(?:\^(?:\{[^{}]*\}|[a-zA-Z0-9]+))?|[a-zA-Z](?:_(?:\{[^{}]*\}|[a-zA-Z0-9]+))?(?:\^(?:\{[^{}]*\}|[a-zA-Z0-9]+))?|[0-9]+(?:\.[0-9]+)?|[{}()=+\-*/,[\]^_\s]|.)/g;

  let colorized = "";
  let cMatch: RegExpExecArray | null = colorizerRegex.exec(formula);
  while (cMatch !== null) {
    const token = cMatch[0];
    const v = varMap.get(token);
    if (v && !mathBlacklist.has(token)) {
      const hex = COLOR_STYLES[v.color].hexLight;
      colorized += `{\\textcolor{${hex}}{${token}}}`;
    } else {
      colorized += token;
    }
    cMatch = colorizerRegex.exec(formula);
  }

  // Construct Plain English sentence fragments linking each variable
  const sentenceFragments: SentenceFragment[] = [
    { text: "In the physical operation of this mechanism, " },
    {
      text: cleanNameForSentence(variables[0]?.name || "the primary state"),
      variableId: variables[0]?.id,
    },
    ...(variables[1]
      ? [
          { text: " is determined by the action of " },
          {
            text: cleanNameForSentence(variables[1].name),
            variableId: variables[1].id,
          },
        ]
      : []),
    ...(variables[2]
      ? [
          { text: " scaled by " },
          {
            text: cleanNameForSentence(variables[2].name),
            variableId: variables[2].id,
          },
        ]
      : []),
    ...(variables[3]
      ? [
          { text: " and constrained by " },
          {
            text: cleanNameForSentence(variables[3].name),
            variableId: variables[3].id,
          },
        ]
      : []),
    { text: ". " },
    { text: principle.explanation },
  ];

  return {
    id: eqId,
    patentId,
    title: principle.principle,
    category,
    rawLatex: formula,
    colorizedLatex: colorized,
    plainEnglishSentence: sentenceFragments,
    variables,
    pedagogicalNote: principle.explanation,
  };
}

/**
 * Retrieves only equations that have been deliberately authored for this
 * patent.  A formula in `scientificPrinciples` is useful on its own, but it
 * is not sufficient evidence for a variable-by-variable decoder: variable
 * names, units, physical roles, and claim links must be reviewed together.
 *
 * Do not add a heuristic fallback here.  The detail page has a faithful,
 * non-interactive rendering path for authored scientific-principle formulas.
 */
export function getColorizedEquationsForPatent(patentId: string): ColorizedEquation[] {
  return ALL_COLORIZED_EQUATIONS[patentId] || [];
}
