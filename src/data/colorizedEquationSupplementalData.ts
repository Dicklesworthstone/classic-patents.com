import type { ColorizedEquation } from "@/types/equation";

/**
 * Supplemental, explicitly authored cards kept separate from the primary
 * catalogue so the data remains reviewable without defeating static analysis.
 */
export function applySupplementalColorizedEquations(
  catalogue: Record<string, ColorizedEquation[]>,
): void {
  // The public Fermi route deliberately renders this direct, claim-bounded card
  // instead of the retained non-serving point-kinetics material above.
  catalogue["us-2708656-fermi-reactor"] = [
    {
      id: "fermi-source-claim-one-criticality-contour",
      patentId: "us-2708656-fermi-reactor",
      title: "Claim 1: Graphite-Uranium Lattice Within Fig. 3's k = 1.00 Region",
      category: "Source-Bound Reactor Construction",
      rawLatex:
        "\\text{graphite moderator} + \\text{natural-uranium rods} + \\text{Fig. 3 } k = 1.00 \\text{ contour}",
      colorizedLatex:
        "\\textcolor{#059669}{\\text{graphite moderator}} + \\textcolor{#2563eb}{\\text{natural-uranium rods}} + \\textcolor{#d97706}{\\text{Fig. 3 } k = 1.00 \\text{ contour}}",
      plainEnglishSentence: [
        {
          text: "Claim 1 requires a graphite moderator around natural-uranium fuel rods. Their size and graphite-to-uranium volume ratio must fall in the printed ",
        },
        { text: "Fig. 3 k = 1.00 region", variableId: "criticality_region" },
        { text: ", with enough material for a chain reaction." },
      ],
      variables: [
        {
          id: "criticality_region",
          symbol: "k = 1.00 contour",
          name: "Printed Fig. 3 criticality region",
          color: "amber",
          role: "The figure-defined size and volume-ratio limitation invoked in Claim 1.",
          unit: "Claim 1 figure relation",
          dimension: "source-drawn criticality boundary",
          explanation:
            "Claim 1 refers to the Fig. 3 region marked k = 1.00. The held edition does not license a live point-kinetics, control-rod, power, or temperature calculation from that printed contour.",
        },
      ],
      pedagogicalNote:
        "This card is limited to Claim 1's graphite, natural-uranium rods, and Fig. 3 contour relationship. The 58-page source edition remains under independent review, so the site does not present a delayed-neutron, control-rod, power, temperature, or Chicago Pile-1 performance model as a patent measurement.",
      claimRef: 1,
      historicalSignificance:
        "The card preserves the claim's construction and figure limitation without turning later reactor-engineering models into unreviewed patent measurements.",
    },
  ];

  // The public Engelbart route deliberately renders this direct, source-bounded
  // card instead of the retained non-serving resolution, friction, and voltage
  // performance cards above.
  catalogue["us-3541541-engelbart-mouse"] = [
    {
      id: "engelbart-source-position-signal-chain",
      patentId: "us-3541541-engelbart-mouse",
      title: "Claim 1: Perpendicular Wheels, Transducer Means, and Flexible Conductor",
      category: "Source-Bound Position-Indicator Construction",
      rawLatex:
        "\\text{perpendicular position wheels} \\rightarrow \\text{transducer means} \\rightarrow \\text{flexible conductor} \\rightarrow \\text{computer display}",
      colorizedLatex:
        "\\textcolor{#2563eb}{\\text{perpendicular position wheels}} \\rightarrow \\textcolor{#059669}{\\text{transducer means}} \\rightarrow \\textcolor{#d97706}{\\text{flexible conductor}} \\rightarrow \\textcolor{#9333ea}{\\text{computer display}}",
      plainEnglishSentence: [
        {
          text: "Claim 1 connects two position wheels whose axes are perpendicular to ",
        },
        { text: "transducer means", variableId: "transducer_means" },
        {
          text: ", then carries their position signals through a flexible conductor to the computer controlling the display.",
        },
      ],
      variables: [
        {
          id: "transducer_means",
          symbol: "transducer means",
          name: "Claim 1 position-signal transducers",
          color: "emerald",
          role: "The claim requires transducer means connected to both position wheels to generate digital position-indicating signals.",
          unit: "Claim 1 apparatus relation",
          dimension: "source-defined component relation",
          explanation:
            "The specification illustrates potentiometer, shaft-encoder, and incremental-encoder choices. It does not give a wheel dimension, pulse rate, voltage, resolution, or cursor sampling rate.",
        },
      ],
      pedagogicalNote:
        "This card is limited to Claim 1's apparatus chain. The scholarly source edition remains under independent review, so the site does not present friction, material, voltage, resolution, display-rate, or later-product calculations as measurements in the grant.",
      claimRef: 1,
      historicalSignificance:
        "The card preserves the printed claim relationship without turning a later pointing-device performance model into evidence from US 3,541,541.",
    },
  ];

  // The public Edison card stays with the two printed pitches and the stated
  // mechanical chain. The retained cards above add unprinted material, size,
  // speed, depth, and bandwidth values and are deliberately non-serving.
  catalogue["us-200521-edison-phonograph"] = [
    {
      id: "edison-source-helical-recording-chain",
      patentId: "us-200521-edison-phonograph",
      title: "Printed Helical-Groove and Thread Pitch",
      category: "Source-Bound Mechanical Recording",
      rawLatex:
        "g = 10\\,\\text{grooves/in} \\quad \\text{and} \\quad s = 10\\,\\text{threads/in} \\quad \\rightarrow \\quad \\text{rotating cylinder advances endwise}",
      colorizedLatex:
        "\\textcolor{#059669}{g} = 10\\,\\text{grooves/in} \\quad \\text{and} \\quad \\textcolor{#2563eb}{s} = 10\\,\\text{threads/in} \\quad \\rightarrow \\quad \\textcolor{#d97706}{\\text{rotating cylinder advances endwise}}",
      plainEnglishSentence: [
        { text: "Cylinder A has " },
        { text: "ten helical grooves per inch", variableId: "groove_pitch" },
        { text: ". Shaft X and bearing P have " },
        { text: "ten threads per inch", variableId: "thread_pitch" },
        {
          text: ", so the threaded support advances the rotating cylinder along the helical recording path.",
        },
      ],
      variables: [
        {
          id: "groove_pitch",
          symbol: "g",
          name: "Printed helical-groove pitch",
          color: "emerald",
          role: "Cylinder A's stated ten grooves to the inch.",
          unit: "grooves/in",
          dimension: "printed inverse-length pitch",
          explanation:
            "The source gives this pitch for the illustrated cylinder; it does not state a cylinder diameter or a channel depth.",
        },
        {
          id: "thread_pitch",
          symbol: "s",
          name: "Printed shaft and bearing thread pitch",
          color: "sapphire",
          role: "The ten-threads-per-inch relation stated for shaft X and bearing P.",
          unit: "threads/in",
          dimension: "printed inverse-length pitch",
          explanation:
            "Clock-work M or another power source turns L. The grant gives no hand crank, rotational speed, bandwidth, or recording-depth value.",
        },
      ],
      pedagogicalNote:
        "The source describes sound-driven diaphragm motion marking metallic foil, paper, or another yielding material, then a second point and diaphragm recovering motion from the marks. This card avoids asserting unprinted cylinder alloys, diaphragm compositions, specific diameters, operating rotational speeds, cut depths, or frequency-response measurements.",
      claimRef: 4,
      historicalSignificance:
        "Claim 4 specifies the rotating, helically grooved cylinder and matching endwise movement without turning unprinted dimensions or performance figures into patent measurements.",
    },
  ];

  // The public US 313,224 route is intentionally limited to its printed
  // matrix-bar construction. The retained cards above describe a later
  // commercial Linotype mechanism and are non-serving pending source review.
  catalogue["us-313224-mergenthaler-linotype"] = [
    {
      id: "mergenthaler-source-continuous-matrix-bar",
      patentId: "us-313224-mergenthaler-linotype",
      title: "Claim 1: Continuous Matrix-Bar with Transverse Intaglio Characters",
      category: "Source-Bound Printing-Matrix Construction",
      rawLatex:
        "\\text{continuous matrix-bar} \\rightarrow \\text{intaglio characters read transversely}",
      colorizedLatex:
        "\\textcolor{#2563eb}{\\text{continuous matrix-bar}} \\rightarrow \\textcolor{#059669}{\\text{intaglio characters read transversely}}",
      plainEnglishSentence: [
        { text: "Claim 1 requires a " },
        { text: "continuous matrix-bar", variableId: "continuous_matrix_bar" },
        {
          text: " whose edge carries a series of recessed characters read across the bar, rather than separate matrices joined by a flexible band or cord.",
        },
      ],
      variables: [
        {
          id: "continuous_matrix_bar",
          symbol: "matrix-bar",
          name: "Claim 1 continuous matrix-bar",
          color: "emerald",
          role: "The single bar whose edge bears the transversely read intaglio characters required by Claim 1.",
          unit: "Claim 1 component relation",
          dimension: "source-defined printing-matrix construction",
          explanation:
            "The claim contrasts this continuous bar with a series of matrices united by a flexible band or cord. It supplies no later-machine material, travel rate, temperature, pressure, or production measurement.",
        },
      ],
      pedagogicalNote:
        "This card is limited to Claim 1's continuous matrix-bar and transverse intaglio-character relation. The full 35-page source edition remains under independent review, so the site does not display a later matrix-magazine, binary distributor, alloy, temperature, timing, or casting-performance model as evidence from US 313,224.",
      claimRef: 1,
      historicalSignificance:
        "The card preserves the printed matrix-bar limitation without projecting later commercial Linotype machinery back onto the 1885 grant.",
    },
  ];

  // The public US 395,781 route deliberately states only its printed record-card
  // and circuit relationship. The retained cards above supply non-source numeric
  // electromagnetic and throughput claims and are non-serving pending review.
  catalogue["us-395781-hollerith-tabulating"] = [
    {
      id: "hollerith-source-record-card-circuit-chain",
      patentId: "us-395781-hollerith-tabulating",
      title: "Claim 1: Record-Cards, Index-Points, and Circuit-Controlling Devices",
      category: "Source-Bound Statistical-Compilation Construction",
      rawLatex:
        "\\text{separate record-cards} \\rightarrow \\text{circuit-controlling index-points} \\rightarrow \\text{circuit-controlling devices}",
      colorizedLatex:
        "\\textcolor{#2563eb}{\\text{separate record-cards}} \\rightarrow \\textcolor{#059669}{\\text{circuit-controlling index-points}} \\rightarrow \\textcolor{#d97706}{\\text{circuit-controlling devices}}",
      plainEnglishSentence: [
        { text: "Claim 1 starts with " },
        { text: "separate record-cards", variableId: "record_cards" },
        {
          text: " bearing circuit-controlling index-points at predetermined intervals. The cards are then applied successively to matching devices so the recorded points designate the statistical items to be compiled.",
        },
      ],
      variables: [
        {
          id: "record_cards",
          symbol: "record-cards",
          name: "Claim 1 separate record-cards",
          color: "emerald",
          role: "A card represents one individual or subject and carries the fixed-plan index-points required by Claim 1.",
          unit: "punched card",
          dimension: "dimensionless",
          explanation:
            "The patent specification's fixed-plan record structure that encodes demographic attributes into discrete punched holes.",
        },
      ],
      pedagogicalNote:
        "Hollerith's fundamental invention was the physical record-card with standardized coordinate holes that completed electrical circuits through mercury cups to step mechanical counters.",
      claimRef: 1,
      historicalSignificance:
        "Formed the technological foundation of IBM and the modern data processing industry.",
    },
  ];

  catalogue["gb-913-watt-separate-condenser"] = [
    {
      id: "watt-separate-condensation-thermo",
      patentId: "gb-913-watt-separate-condenser",
      title: "Thermodynamic Heat Loss Elimination via Separate Condensation",
      category: "Thermodynamics & Steam Power Cycles",
      rawLatex: "Q_{\\text{waste}} = m_{\\text{cyl}} c_p (T_{\\text{steam}} - T_{\\text{cond}})",
      colorizedLatex:
        "\\textcolor{#ef4444}{Q_{\\text{waste}}} = \\textcolor{#3b82f6}{m_{\\text{cyl}}} \\textcolor{#10b981}{c_p} (\\textcolor{#f59e0b}{T_{\\text{steam}}} - \\textcolor{#06b6d4}{T_{\\text{cond}}})",
      plainEnglishSentence: [
        { text: "Thermal waste energy " },
        { text: "quenched per cycle", variableId: "q_waste" },
        { text: " scales directly with the iron " },
        { text: "cylinder mass", variableId: "m_cyl" },
        { text: ", the iron's " },
        { text: "specific heat capacity", variableId: "c_p" },
        { text: ", and the temperature difference between entering " },
        { text: "live boiler steam", variableId: "t_steam" },
        { text: " and the " },
        { text: "condenser heat sink", variableId: "t_cond" },
        { text: "." },
      ],
      variables: [
        {
          id: "q_waste",
          symbol: "Q_waste",
          name: "Cyclic Quench Energy Waste",
          color: "crimson",
          role: "Thermal energy lost each stroke reheating the chilled cast-iron cylinder walls",
          unit: "Joules (J)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "Watt discovered that direct in-cylinder water quenching wasted over 75% of boiler coal solely in reheating the heavy metal walls.",
        },
        {
          id: "m_cyl",
          symbol: "m_cyl",
          name: "Cylinder Metal Mass",
          color: "sapphire",
          role: "Thermal mass of the working cylinder subject to temperature cycles",
          unit: "Kilograms (kg)",
          dimension: "[M]",
          explanation:
            "The hundreds of kilograms of iron forming the cylinder body acted as a severe parasitic heat sink.",
        },
        {
          id: "c_p",
          symbol: "c_p",
          name: "Specific Heat of Cast Iron",
          color: "emerald",
          role: "Heat capacity of cast iron (~450 J/kg·K)",
          unit: "J/(kg·K)",
          dimension: "[L^2 T^-2 \\Theta^-1]",
          explanation:
            "Material property determining how much thermal energy is absorbed per degree of reheating.",
        },
        {
          id: "t_steam",
          symbol: "T_steam",
          name: "Live Steam Temperature",
          color: "amber",
          role: "Temperature of boiler steam entering the cylinder",
          unit: "Kelvin (K)",
          dimension: "[\\Theta]",
          explanation: "Saturated steam at low boiler pressure enters at ~373 K (100°C).",
        },
        {
          id: "t_cond",
          symbol: "T_cond",
          name: "Condenser Temperature",
          color: "cyan",
          role: "Temperature of the separate condensation vessel",
          unit: "Kelvin (K)",
          dimension: "[\\Theta]",
          explanation: "The condenser is maintained at ~308 K (35°C) to create a deep vacuum.",
        },
      ],
      pedagogicalNote:
        "By separating the vessel of condensation from the vessel of expansion, Watt maintained T_cyl = T_steam continuously, reducing Q_waste to near zero.",
      claimRef: 1,
      historicalSignificance:
        "The master thermodynamic insight that quadrupled the thermal efficiency of steam engines and catalyzed the Industrial Revolution.",
    },
  ];

  catalogue["gb-931-arkwright-water-frame"] = [
    {
      id: "arkwright-differential-draft-twist",
      patentId: "gb-931-arkwright-water-frame",
      title: "Differential Roller Drafting & Flyer Twist Tenacity Law",
      category: "Textile Mechanics & Continuous Spinning",
      rawLatex:
        "D = \\frac{v_{\\text{delivery}}}{v_{\\text{feed}}} = \\frac{r_4 \\omega_4}{r_1 \\omega_1} \\quad \\text{and} \\quad \\text{TPM} = \\frac{\\Omega_{\\text{flyer}}}{v_{\\text{delivery}}}",
      colorizedLatex:
        "\\textcolor{#0891b2}{D} = \\frac{\\textcolor{#059669}{v_{\\text{delivery}}}}{\\textcolor{#2563eb}{v_{\\text{feed}}}} \\quad \\text{and} \\quad \\textcolor{#d97706}{\\text{TPM}} = \\frac{\\textcolor{#9333ea}{\\Omega_{\\text{flyer}}}}{\\textcolor{#059669}{v_{\\text{delivery}}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "total draft ratio", variableId: "draft_ratio" },
        { text: " equals the velocity ratio between " },
        { text: "front delivery rollers", variableId: "v_delivery" },
        { text: " and " },
        { text: "feed rollers", variableId: "v_feed" },
        { text: ", while the " },
        { text: "imparted twist per meter", variableId: "tpm" },
        { text: " is determined by the ratio of " },
        { text: "flyer rotational velocity", variableId: "omega_flyer" },
        { text: " to yarn delivery throughput." },
      ],
      variables: [
        {
          id: "draft_ratio",
          symbol: "D",
          name: "Differential Draft Ratio",
          color: "cyan",
          role: "Multiplicative attenuation factor stretching cotton roving into thin, parallel staple fibers.",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Arkwright used pairs of differential-speed rollers (D = 4x to 8x) to mechanically replace human finger drawing.",
        },
        {
          id: "v_delivery",
          symbol: "v_delivery",
          name: "Delivery Roller Speed",
          color: "emerald",
          role: "Surface linear velocity of the fastest, final pair of fluted output rollers.",
          unit: "m/s",
          dimension: "L T^-1",
          explanation: "The speed at which attenuated roving emerges into the flyer twist zone.",
        },
        {
          id: "v_feed",
          symbol: "v_feed",
          name: "Feed Roller Speed",
          color: "sapphire",
          role: "Surface linear velocity of the slow intake rollers taking in loose carded roving.",
          unit: "m/s",
          dimension: "L T^-1",
          explanation:
            "Intake speed calibrated to prevent fiber rupture while ensuring positive grip.",
        },
        {
          id: "tpm",
          symbol: "TPM",
          name: "Turns Per Meter",
          color: "amber",
          role: "Helical twist density imparted to the yarn to create inter-fiber frictional cohesion.",
          unit: "turns/m",
          dimension: "L^-1",
          explanation:
            "High twist multiplier binds short cotton fibers into hard, warp-grade yarn ('water twist') capable of withstanding loom tension.",
        },
        {
          id: "omega_flyer",
          symbol: "\\Omega_{\\text{flyer}}",
          name: "Flyer Angular Speed",
          color: "amethyst",
          role: "Rotational velocity of the U-shaped steel flyer revolving on the upright spindle (3000–4000 RPM).",
          unit: "rad/s",
          dimension: "T^-1",
          explanation:
            "Driven continuously by leather bands from the main water-wheel driving drum.",
        },
      ],
      pedagogicalNote:
        "By combining differential roller drafting with high-velocity flyer twisting and dead-spindle bobbin winding, Arkwright created the first fully automatic spinning machine, launching the modern factory system at Cromford Mill in 1771.",
      historicalSignificance:
        "Eliminated the centuries-old textile bottleneck by producing strong, inexpensive all-cotton warp yarn at industrial scale.",
    },
  ];

  catalogue["us-x1-hopkins-potash"] = [
    {
      id: "hopkins-calcination-mass-balance",
      patentId: "us-x1-hopkins-potash",
      title: "Hopkins Thermal Decarbonization & Potash Mass Balance",
      category: "Thermochemical Calcination & Leaching",
      rawLatex:
        "m_{\\text{potash}} = m_{\\text{raw}} \\cdot \\eta_{\\text{calc}} \\cdot \\frac{M_{\\text{K}_2\\text{CO}_3}}{M_{\\text{ash}}}",
      colorizedLatex:
        "\\textcolor{#059669}{m_{\\text{potash}}} = \\textcolor{#2563eb}{m_{\\text{raw}}} \\cdot \\textcolor{#d97706}{\\eta_{\\text{calc}}} \\cdot \\frac{M_{\\text{K}_2\\text{CO}_3}}{M_{\\text{ash}}}",
      plainEnglishSentence: [
        { text: "The yield of refined " },
        { text: "pearl ash (potassium carbonate)", variableId: "potash_yield" },
        { text: " equals the " },
        { text: "raw wood ash charge", variableId: "raw_ash_mass" },
        { text: " multiplied by the " },
        { text: "calcination combustion efficiency", variableId: "calcination_efficiency" },
        {
          text: " and the stoichiometric ratio of K₂CO₃ in the mineralized residue.",
        },
      ],
      variables: [
        {
          id: "potash_yield",
          symbol: "m_potash",
          name: "Refined Pearl Ash Yield",
          color: "emerald",
          role: "Mass of pure crystallized potassium carbonate obtained after leaching and evaporation.",
          unit: "kg",
          dimension: "M",
          explanation:
            "Hopkins' roasting method removed combustible unburned carbons, yielding nearly pure K₂CO₃ pearl ash.",
        },
        {
          id: "raw_ash_mass",
          symbol: "m_raw",
          name: "Raw Wood Ash Charge",
          color: "sapphire",
          role: "Total initial mass of unburned wood ashes fed into the calcining furnace.",
          unit: "kg",
          dimension: "M",
          explanation:
            "Wood ashes from cleared hardwood forests contained 10–25% potash mixed with unburned charcoal and organic tar.",
        },
        {
          id: "calcination_efficiency",
          symbol: "eta_calc",
          name: "Thermal Decarbonization Efficiency",
          color: "amber",
          role: "Fraction of organic carbons completely combusted to CO₂ before aqueous leaching.",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Pre-calcining the ashes in a reverberatory furnace at 600–700 °C burned off tar that otherwise contaminated the lye.",
        },
      ],
      pedagogicalNote:
        "US Patent No. 1 granted to Samuel Hopkins in 1790 improved potash making by burning raw ashes a second time before leaching, converting black salts into white pearl ash.",
      historicalSignificance:
        "First United States patent, signed by President George Washington, Secretary of State Thomas Jefferson, and Attorney General Edmund Randolph.",
    },
  ];

  catalogue["gb-1306-watt-rotary-engine"] = [
    {
      id: "watt-epicyclic-speed",
      patentId: "gb-1306-watt-rotary-engine",
      title: "Epicyclic Planetary Speed Multiplication Law",
      category: "Kinematics & Epicyclic Gearing",
      rawLatex:
        "\\omega_{\\text{shaft}} = \\omega_{\\text{beam}} \\left(1 + \\frac{N_{\\text{planet}}}{N_{\\text{sun}}}\\right) = 2 \\cdot \\omega_{\\text{beam}}",
      colorizedLatex:
        "\\textcolor{#d97706}{\\omega_{\\text{shaft}}} = \\textcolor{#2563eb}{\\omega_{\\text{beam}}} \\left(1 + \\frac{\\textcolor{#059669}{N_{\\text{planet}}}}{\\textcolor{#9333ea}{N_{\\text{sun}}}}\\right) = \\textcolor{#dc2626}{2} \\cdot \\textcolor{#2563eb}{\\omega_{\\text{beam}}}",
      plainEnglishSentence: [
        { text: "The rotational " },
        { text: "shaft velocity", variableId: "omega_shaft" },
        { text: " equals the reciprocating " },
        { text: "beam cycle rate", variableId: "omega_beam" },
        { text: " multiplied by one plus the ratio of " },
        { text: "planet gear teeth", variableId: "n_planet" },
        { text: " to " },
        { text: "sun gear teeth", variableId: "n_sun" },
        { text: ", producing an exact " },
        { text: "2:1 speed multiplication", variableId: "mult" },
        { text: " for identical gears." },
      ],
      variables: [
        {
          id: "omega_shaft",
          symbol: "\\omega_{\\text{shaft}}",
          name: "Driveshaft Angular Velocity",
          color: "amber",
          role: "Rotational speed of the central sun gear, flywheel, and factory line shaft",
          unit: "rad/s (or RPM)",
          dimension: "[T^-1]",
          explanation:
            "The speed of the rotating output shaft. For equal sun and planet gears, the output shaft turns at exactly twice the reciprocating frequency of the steam engine beam.",
          telemetryKey: "strokeRateSpm",
          telemetryMetricLabel: "Driveshaft Speed",
        },
        {
          id: "omega_beam",
          symbol: "\\omega_{\\text{beam}}",
          name: "Engine Beam Cycle Frequency",
          color: "sapphire",
          role: "Reciprocating double-stroke frequency of the great walking beam",
          unit: "rad/s (or double-strokes/min)",
          dimension: "[T^-1]",
          explanation:
            "The fundamental operating frequency of the steam piston and beam, typically 15 to 25 cycles per minute in early industrial beam engines.",
          telemetryKey: "strokeRateSpm",
          telemetryMetricLabel: "Beam Stroke Rate",
        },
        {
          id: "n_planet",
          symbol: "N_{\\text{planet}}",
          name: "Planet Gear Tooth Count",
          color: "emerald",
          role: "Number of teeth on the orbiting spur wheel bolted to the connecting rod ($N_p = 40$)",
          unit: "Dimensionless integer (teeth)",
          dimension: "[1]",
          explanation:
            "The tooth count of the orbiting planet gear. Because the connecting rod restrains the planet from turning freely on its own center, orbiting once around the sun gear forces the sun gear to advance by $N_p$ additional teeth.",
          telemetryKey: "gearRatioNpOverNs",
          telemetryMetricLabel: "Planet / Sun Gear Ratio",
        },
        {
          id: "n_sun",
          symbol: "N_{\\text{sun}}",
          name: "Sun Gear Tooth Count",
          color: "amethyst",
          role: "Number of teeth on the fixed central spur wheel keyed to the driveshaft ($N_s = 40$)",
          unit: "Dimensionless integer (teeth)",
          dimension: "[1]",
          explanation:
            "The tooth count of the central sun gear. When $N_{\\text{planet}} = N_{\\text{sun}}$, the ratio equals 1.0, adding an exact full extra revolution ($1 + 1 = 2$) per orbital cycle.",
          telemetryKey: "gearRatioNpOverNs",
          telemetryMetricLabel: "Planet / Sun Gear Ratio",
        },
        {
          id: "mult",
          symbol: "2",
          name: "Epicyclic Speed Multiplier",
          color: "crimson",
          role: "Overall kinematic velocity ratio $(1 + N_p / N_s) = 2.0$",
          unit: "Dimensionless multiplier (2.0×)",
          dimension: "[1]",
          explanation:
            "The 2:1 velocity boost allowed Watt's engines to operate at moderate, gentle reciprocating beam speeds while driving mill machinery and spinning flywheels at high rotational speeds.",
          telemetryKey: "gearRatioNpOverNs",
          telemetryMetricLabel: "Driveshaft Speed",
        },
      ],
      pedagogicalNote:
        "Unlike a conventional crank which gives exactly 1 revolution per cycle, Watt's fixed planet gear imparts an extra full revolution during its orbit, doubling output shaft speed and halving required flywheel inertia.",
      claimRef: 2,
      historicalSignificance:
        "Claim 2 of GB 1306 protected this 2:1 epicyclic speed doubling, which proved crucial for powering cotton spinning mills and rolling mills across Britain.",
    },
    {
      id: "watt-instantaneous-torque",
      patentId: "gb-1306-watt-rotary-engine",
      title: "Instantaneous Shaft Torque & Epicyclic Tooth Contact Force",
      category: "Dynamics & Mechanical Advantage",
      rawLatex:
        "\\tau_{\\text{shaft}} = \\frac{1}{2} F_{\\text{rod}} \\cdot r_{\\text{sun}} \\cdot \\sin(\\theta)",
      colorizedLatex:
        "\\textcolor{#d97706}{\\tau_{\\text{shaft}}} = \\frac{1}{2} \\textcolor{#dc2626}{F_{\\text{rod}}} \\cdot \\textcolor{#2563eb}{r_{\\text{sun}}} \\cdot \\sin(\\textcolor{#059669}{\\theta})",
      plainEnglishSentence: [
        { text: "The instantaneous " },
        { text: "output torque", variableId: "tau_shaft" },
        { text: " transmitted to the flywheel shaft is proportional to the " },
        { text: "connecting rod thrust", variableId: "f_rod" },
        { text: " multiplied by the " },
        { text: "sun pitch radius", variableId: "r_sun" },
        { text: " and the sine of the " },
        { text: "planet orbit angle", variableId: "theta" },
        { text: "." },
      ],
      variables: [
        {
          id: "tau_shaft",
          symbol: "\\tau_{\\text{shaft}}",
          name: "Instantaneous Output Torque",
          color: "amber",
          role: "Dynamic torsional moment delivered to the main driveshaft",
          unit: "N·m (Newton-meters)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "The rotational driving torque turning the flywheel and line shafts, fluctuating harmonically with orbit angle and smoothed by flywheel inertia.",
          telemetryKey: "boilerPressureKpa",
          telemetryMetricLabel: "Indicated Shaft Power",
        },
        {
          id: "f_rod",
          symbol: "F_{\\text{rod}}",
          name: "Connecting Rod Force",
          color: "crimson",
          role: "Axial force transmitted down the connecting spear from the steam piston and walking beam",
          unit: "N (Newtons)",
          dimension: "[M L T^-2]",
          explanation:
            "The massive push-pull force generated by boiler steam pressure and separate condenser vacuum acting across the cylinder bore ($F \\approx 30\\text{--}50\\text{ kN}$).",
          telemetryKey: "boilerPressureKpa",
          telemetryMetricLabel: "Piston Driving Force",
        },
        {
          id: "r_sun",
          symbol: "r_{\\text{sun}}",
          name: "Sun Gear Pitch Radius",
          color: "sapphire",
          role: "Radius from shaft centerline to the pitch circle tooth contact line ($r_s \\approx 0.45\\text{ m}$)",
          unit: "m (meters)",
          dimension: "[L]",
          explanation:
            "The moment arm through which tangential tooth contact forces create driving torque on the output shaft.",
          telemetryKey: "gearRatioNpOverNs",
          telemetryMetricLabel: "Tooth Contact Force",
        },
        {
          id: "theta",
          symbol: "\\theta",
          name: "Planet Orbital Angle",
          color: "emerald",
          role: "Angle of the planet gear center relative to vertical bottom dead center",
          unit: "radians (or degrees)",
          dimension: "[1]",
          explanation:
            "As the planet orbits around the sun gear from 0° (BDC) to 90° (mid-stroke) to 180° (TDC), torque varies sinusoidally, peaking at horizontal 90° and 270° positions.",
          telemetryKey: "strokeRateSpm",
          telemetryMetricLabel: "Beam Stroke Rate",
        },
      ],
      pedagogicalNote:
        "Because the planet gear center orbits at radius $2 r_s$ while dividing the lever arm across the gear mesh, the resulting mean torque is identical to a crank of radius $r_s$, but delivered at twice the rotational velocity.",
      claimRef: 1,
      historicalSignificance:
        "Claim 1 of GB 1306 established the first commercially practical continuous rotary drive for industrial steam power.",
    },
  ];

  catalogue["gb-1420-cort-puddling-rolling"] = [
    {
      id: "cort-decarb-kinetics",
      patentId: "gb-1420-cort-puddling-rolling",
      title: "Arrhenius Decarburization & Rabble Surface Oxidation Kinetics",
      category: "Chemical Kinetics & Thermodynamics",
      rawLatex:
        "\\frac{d[\\text{C}]}{dt} = -k_0 e^{-\\frac{E_a}{R T}} (1 + \\beta \\omega_{\\text{rabble}}) [\\text{C}]",
      colorizedLatex:
        "\\textcolor{#059669}{\\frac{d[\\text{C}]}{dt}} = -k_0 e^{-\\frac{\\textcolor{#dc2626}{E_a}}{R \\textcolor{#d97706}{T}}} (1 + \\beta \\textcolor{#2563eb}{\\omega_{\\text{rabble}}}) \\textcolor{#9333ea}{[\\text{C}]}",
      plainEnglishSentence: [
        { text: "The instantaneous " },
        { text: "decarburization rate", variableId: "decarb_rate" },
        { text: " increases exponentially with " },
        { text: "furnace temperature", variableId: "temp" },
        { text: " against the reaction " },
        { text: "activation energy", variableId: "act_energy" },
        { text: ", accelerated by " },
        { text: "manual rabble stirring", variableId: "rabble_omega" },
        { text: " proportional to the " },
        { text: "carbon concentration", variableId: "carbon_conc" },
        { text: " in the molten bath." },
      ],
      variables: [
        {
          id: "decarb_rate",
          symbol: "\\frac{d[\\text{C}]}{dt}",
          name: "Decarburization Rate",
          color: "emerald",
          role: "Rate at which carbon is oxidized into CO gas by FeO slag and air draft",
          unit: "% C / min",
          dimension: "[T^-1]",
          explanation:
            "High decarburization rates rapidly raise the melting point of the bath, bringing iron to nature.",
        },
        {
          id: "act_energy",
          symbol: "E_a",
          name: "Decarburization Activation Energy",
          color: "crimson",
          role: "Energy barrier for oxygen diffusion and carbon monoxide bubble nucleation (115 kJ/mol)",
          unit: "kJ/mol",
          dimension: "[M L^2 T^-2 N^-1]",
          explanation: "Overcome by radiant heat from the reverberatory roof.",
        },
        {
          id: "temp",
          symbol: "T",
          name: "Furnace Operating Temperature",
          color: "amber",
          role: "Reverberated gas and hearth bath temperature (1300–1450 °C)",
          unit: "Kelvin (K) / Celsius (°C)",
          dimension: "[Theta]",
          explanation: "Keeps iron fluid until carbon drops below 0.1%, triggering solidification.",
          telemetryKey: "furnaceTemperatureCelsius",
          telemetryMetricLabel: "Furnace Temperature",
        },
        {
          id: "rabble_omega",
          symbol: "\\omega_{\\text{rabble}}",
          name: "Puddler Rabble Stirring Rate",
          color: "sapphire",
          role: "Manual agitation speed exposing fresh molten metal to the oxidizing surface slag",
          unit: "RPM / rad/s",
          dimension: "[T^-1]",
          explanation:
            "Violent stirring breaks up slag crusted on the metal surface and distributes FeO oxidant.",
          telemetryKey: "rabbleStirringRpm",
          telemetryMetricLabel: "Rabble Stirring Rate",
        },
        {
          id: "carbon_conc",
          symbol: "[\\text{C}]",
          name: "Molten Iron Carbon Concentration",
          color: "amethyst",
          role: "Residual dissolved carbon mass fraction in the iron charge (3.8% -> 0.04%)",
          unit: "% C (mass fraction)",
          dimension: "1",
          explanation: "Drops continuously over the 90-minute puddling heat.",
          telemetryKey: "initialCarbonPercent",
          telemetryMetricLabel: "Pig Iron Carbon",
        },
      ],
      pedagogicalNote:
        "Cort's reverberatory furnace oxidized pig iron without charcoal fuel contact, while the puddler's rabble ensured complete decarburization.",
      historicalSignificance:
        "Eliminated Britain's dependence on expensive Swedish and Russian bar iron, fueling the Industrial Revolution.",
    },
    {
      id: "cort-groove-squeeze",
      patentId: "gb-1420-cort-puddling-rolling",
      title: "Hydrostatic Slag Squeeze & Roll Separation Pressure",
      category: "Continuum Mechanics & Plasticity",
      rawLatex:
        "P_{\\text{roll}} = \\sigma_{\\text{flow}}(T) \\left(1 + \\frac{1.2 L_{\\text{bite}}}{2 h}\\right) \\ln\\left(\\frac{A_0}{A_{\\text{final}}}\\right)",
      colorizedLatex:
        "\\textcolor{#059669}{P_{\\text{roll}}} = \\textcolor{#dc2626}{\\sigma_{\\text{flow}}(T)} \\left(1 + \\frac{1.2 \\textcolor{#d97706}{L_{\\text{bite}}}}{2 \\textcolor{#2563eb}{h}}\\right) \\ln\\left(\\textcolor{#9333ea}{\\frac{A_0}{A_{\\text{final}}}}\\right)",
      plainEnglishSentence: [
        { text: "The " },
        { text: "hydrostatic roll pressure", variableId: "roll_press" },
        { text: " scales with the hot iron " },
        { text: "flow stress", variableId: "flow_stress" },
        { text: ", the geometric ratio of " },
        { text: "roll bite contact length", variableId: "contact_len" },
        { text: " to " },
        { text: "billet thickness", variableId: "billet_h" },
        { text: ", and the logarithmic " },
        { text: "area reduction ratio", variableId: "area_reduct" },
        { text: ", violently expelling liquid slag." },
      ],
      variables: [
        {
          id: "roll_press",
          symbol: "P_{\\text{roll}}",
          name: "Hydrostatic Roll Compression Pressure",
          color: "emerald",
          role: "Peak normal compressive stress exerted by the grooved cylinders on the red-hot billet",
          unit: "Megapascals (MPa)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Exceeds the hydraulic expulsion threshold of molten silicate cinder (~30–50 MPa).",
        },
        {
          id: "flow_stress",
          symbol: "\\sigma_{\\text{flow}}",
          name: "Plastic Flow Stress of Hot Wrought Iron",
          color: "crimson",
          role: "Yield resistance of metallic iron crystals at 1100–1200 °C (~40–60 MPa)",
          unit: "Megapascals (MPa)",
          dimension: "[M L^-1 T^-2]",
          explanation:
            "Allows plastic deformation while remaining soft enough to weld internal voids.",
        },
        {
          id: "contact_len",
          symbol: "L_{\\text{bite}}",
          name: "Roll Bite Contact Arc Length",
          color: "amber",
          role: "Projected contact length between roll surface and incoming billet (L = sqrt(R * delta_h))",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation: "Determined by roll radius and draft depth per pass.",
        },
        {
          id: "billet_h",
          symbol: "h",
          name: "Billet Section Thickness",
          color: "sapphire",
          role: "Vertical height of the iron bar inside the matching groove collar",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation: "Decreases progressively from 80 mm down to 20 mm across graduated passes.",
        },
        {
          id: "area_reduct",
          symbol: "\\frac{A_0}{A_{\\text{final}}}",
          name: "Total Cross-Sectional Area Reduction Ratio",
          color: "amethyst",
          role: "Ratio of initial sponge ball area to finished bar cross-section",
          unit: "Dimensionless ratio",
          dimension: "1",
          explanation: "Elongates grain boundaries and slag fibers along the tensile axis.",
          telemetryKey: "rollerPassCount",
          telemetryMetricLabel: "Grooved Roll Passes",
        },
      ],
      pedagogicalNote:
        "Grooved rollers applied continuous 3D compressive force, eliminating forge-hammer cracks and expelling liquid slag in one heat.",
      historicalSignificance:
        "Increased iron rolling speed fifteenfold over tilt hammers, establishing the modern continuous rolling mill.",
    },
  ];

  catalogue["us-307031-edison-indicator"] = [
    {
      id: "edison-indicator-source-circuit-path",
      patentId: "us-307031-edison-indicator",
      title: "Claim 4: Internal Terminal to Positive-Side Circuit Path",
      category: "Source-Bounded Circuit Topology",
      rawLatex:
        "\\text{terminal in vacuous globe} \\longrightarrow \\text{external apparatus} \\longrightarrow \\text{positive side of lamp circuit}",
      colorizedLatex:
        "\\textcolor{#06b6d4}{\\text{terminal in vacuous globe}} \\longrightarrow \\textcolor{#9333ea}{\\text{external apparatus}} \\longrightarrow \\textcolor{#059669}{\\text{positive side of lamp circuit}}",
      plainEnglishSentence: [
        { text: "The claimed circuit places one " },
        { text: "terminal inside the lamp's vacuous globe", variableId: "internal_terminal" },
        { text: ", routes the circuit through " },
        { text: "external indicating or controlled apparatus", variableId: "external_apparatus" },
        { text: ", and connects the other terminal to the " },
        { text: "positive side of the lamp circuit", variableId: "positive_side" },
        {
          text: ". The grant does not state a line voltage, vacuum pressure, filament temperature, current, work function, or sensitivity percentage.",
        },
      ],
      variables: [
        {
          id: "internal_terminal",
          symbol: "T_{\\mathrm{inside}}",
          name: "Internal Circuit Terminal",
          color: "cyan",
          role: "One circuit terminal placed in the vacuous space within the incandescent lamp globe.",
          unit: "source circuit node",
          dimension: "[1]",
          explanation:
            "This is the internal terminal required by the printed claim, not a numerical thermionic-emission parameter.",
        },
        {
          id: "external_apparatus",
          symbol: "A_{\\mathrm{external}}",
          name: "External Electrical Apparatus",
          color: "amethyst",
          role: "The electrically operated or controlled apparatus included in the circuit in the applicable claims.",
          unit: "source circuit element",
          dimension: "[1]",
          explanation:
            "The specification illustrates a galvanometer and regulator relationship, while the claims use broader apparatus language.",
        },
        {
          id: "positive_side",
          symbol: "T_{+}",
          name: "Positive-Side Connection",
          color: "emerald",
          role: "The external terminal connection to the positive side of the incandescent-lamp circuit required by Claim 4.",
          unit: "source circuit node",
          dimension: "[1]",
          explanation:
            "The claim states circuit polarity but supplies no numerical mains voltage or electrode potential.",
        },
      ],
      pedagogicalNote:
        "This card decodes the patented circuit topology. It supplies no later emission-law constants, filament-material assignment, fixed temperature, fixed voltage, current-density value, or diode-performance claim that the facsimile does not print.",
      claimRef: 4,
      historicalSignificance:
        "The grant claims an incandescent lamp with a circuit terminal inside its evacuated globe and an external circuit connection that can operate or control apparatus.",
    },
  ];

  catalogue["_legacy-unpublished-us-307031-edison-indicator"] = [
    {
      id: "edison-indicator-emission",
      patentId: "us-307031-edison-indicator",
      title: "Richardson-Dushman Thermionic Emission Law",
      category: "Thermionic Physics",
      rawLatex: "J = A T^2 e^{-\\frac{\\Phi}{k_B T}}",
      colorizedLatex:
        "\\textcolor{#06b6d4}{J} = \\textcolor{#2563eb}{A} \\textcolor{#d97706}{T^2} e^{-\\frac{\\textcolor{#9333ea}{\\Phi}}{\\textcolor{#2563eb}{k_B} \\textcolor{#d97706}{T}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "thermionic current density", variableId: "current_density" },
        { text: " scales with the square of " },
        { text: "cathode temperature", variableId: "temp" },
        { text: " and exponential thermal escape over the " },
        { text: "carbon work function", variableId: "work_function" },
        { text: "." },
      ],
      variables: [
        {
          id: "current_density",
          symbol: "J",
          name: "Thermionic Current Density",
          color: "cyan",
          role: "Electric current emitted per unit surface area of incandescent carbon filament into the surrounding vacuum.",
          unit: "A/m²",
          dimension: "I L^-2",
          explanation:
            "Edison discovered that heated carbon boils off electrons across an empty vacuum gap, creating a measurable microampere shunt current.",
        },
        {
          id: "richardson_const",
          symbol: "A",
          name: "Richardson Constant",
          color: "sapphire",
          role: "Universal thermionic emission coefficient (A ≈ 1.20 × 10⁶ A/(m²·K²)).",
          unit: "A/(m²·K²)",
          dimension: "I L^-2 Theta^-2",
          explanation:
            "Theoretical quantum coefficient governing free electron density and transmission probability across the metal-vacuum boundary.",
        },
        {
          id: "temp",
          symbol: "T",
          name: "Absolute Filament Temperature",
          color: "amber",
          role: "Absolute thermodynamic temperature of the glowing carbon filament loop (~1900–2200 K).",
          unit: "K",
          dimension: "Theta",
          explanation:
            "Filament temperature is driven by Joule heating from distribution mains voltage (V² / R), linking grid pressure directly to emission.",
        },
        {
          id: "work_function",
          symbol: "\\Phi",
          name: "Material Work Function",
          color: "amethyst",
          role: "Minimum energy barrier required for a conduction electron to escape the carbon surface (Φ ≈ 4.60 eV).",
          unit: "eV",
          dimension: "M L^2 T^-2",
          explanation:
            "The surface potential barrier of carbonized bamboo filament in high vacuum.",
        },
        {
          id: "boltzmann",
          symbol: "k_B",
          name: "Boltzmann Constant",
          color: "sapphire",
          role: "Fundamental thermodynamic constant (8.6173 × 10⁻⁵ eV/K).",
          unit: "eV/K",
          dimension: "M L^2 T^-2 Theta^-1",
          explanation:
            "Relates the thermal kinetic energy distribution of electrons to absolute temperature.",
        },
      ],
      pedagogicalNote:
        "Edison's discovery that current could cross a high vacuum exclusively to a positive electrode became the foundation of all vacuum tube diodes, triodes, and 20th-century electronics.",
      claimRef: 1,
      historicalSignificance:
        "First patented observation and utilization of thermionic electron emission, leading directly to the Fleming valve and De Forest Audion.",
    },
  ];

  catalogue["us-3138743-kilby-integrated-circuit"] = [
    {
      id: "kilby-sheet-resistance",
      patentId: "us-3138743-kilby-integrated-circuit",
      title: "Semiconductor Bulk Sheet Resistance & Geometric Scaling",
      category: "Solid-State Physics & Integrated Circuit Design",
      pedagogicalNote:
        "Bulk semiconductor resistance depends linearly on the aspect ratio L/W, allowing precise resistor values to be shaped directly into the semiconductor crystal substrate without discrete resistors.",
      rawLatex:
        "R = R_{\\text{sheet}} \\cdot \\left(\\frac{L}{W}\\right) = \\frac{\\rho_{\\text{bulk}}}{t} \\cdot \\left(\\frac{L}{W}\\right)",
      colorizedLatex:
        "\\textcolor{#059669}{R} = \\textcolor{#2563eb}{R_{\\text{sheet}}} \\cdot \\left(\\frac{\\textcolor{#9333ea}{L}}{\\textcolor{#d97706}{W}}\\right) = \\frac{\\textcolor{#dc2626}{\\rho_{\\text{bulk}}}}{\\textcolor{#6b7280}{t}} \\cdot \\left(\\frac{\\textcolor{#9333ea}{L}}{\\textcolor{#d97706}{W}}\\right)",
      plainEnglishSentence: [
        { text: "The total " },
        { text: "integrated resistance", variableId: "r_total" },
        { text: " equals " },
        { text: "sheet resistance", variableId: "r_sheet" },
        { text: " multiplied by " },
        { text: "path length", variableId: "length_l" },
        { text: " over " },
        { text: "path width", variableId: "width_w" },
        { text: ", derived from " },
        { text: "bulk resistivity", variableId: "rho_bulk" },
        { text: " and " },
        { text: "layer thickness", variableId: "thick_t" },
        { text: "." },
      ],
      variables: [
        {
          id: "r_total",
          symbol: "R",
          name: "Integrated Bulk Resistance",
          color: "emerald",
          role: "Total electrical resistance of the shaped semiconductor path (Ω).",
          unit: "Ω",
          dimension: "M L^2 T^-3 I^-2",
          explanation:
            "Determines the collector load and base bias resistances in the monolithic solid circuit.",
          telemetryMetricLabel: "Collector Load Resistor",
        },
        {
          id: "r_sheet",
          symbol: "R_{\\text{sheet}}",
          name: "Sheet Resistance",
          color: "sapphire",
          role: "Resistance per square of the diffused/bulk semiconductor layer (Ω/□).",
          unit: "Ω/sq",
          dimension: "M L^2 T^-3 I^-2",
          explanation:
            "A fundamental process parameter determined by dopant profile and layer depth.",
        },
        {
          id: "length_l",
          symbol: "L",
          name: "Resistor Path Length",
          color: "amethyst",
          role: "Physical length of the etched semiconductor resistor mesa (µm).",
          unit: "µm",
          dimension: "L",
          explanation: "Increasing length increases total resistance proportionally.",
        },
        {
          id: "width_w",
          symbol: "W",
          name: "Resistor Path Width",
          color: "amber",
          role: "Physical width of the etched semiconductor resistor mesa (µm).",
          unit: "µm",
          dimension: "L",
          explanation: "Narrower channels concentrate current flow, yielding higher resistance.",
        },
        {
          id: "rho_bulk",
          symbol: "\\rho_{\\text{bulk}}",
          name: "Bulk Semiconductor Resistivity",
          color: "rose",
          role: "Specific electrical resistivity of the doped single crystal (Ω·cm).",
          unit: "Ω*cm",
          dimension: "M L^3 T^-3 I^-2",
          explanation: "Inversely proportional to carrier concentration and electron mobility.",
        },
        {
          id: "thick_t",
          symbol: "t",
          name: "Diffused Layer Thickness",
          color: "teal",
          role: "Vertical thickness of the conducting semiconductor mesa (µm).",
          unit: "µm",
          dimension: "L",
          explanation: "Controlled by wafer lapping or thermal vapor diffusion depth.",
        },
      ],
    },
    {
      id: "kilby-junction-capacitance",
      patentId: "us-3138743-kilby-integrated-circuit",
      title: "P-N Junction Depletion Transition Capacitance",
      category: "Semiconductor Device Physics",
      pedagogicalNote:
        "Reverse-biased p-n junctions create an insulating charge-depleted layer that acts as a dielectric, providing integrated microchip capacitors whose value is dynamically tunable by applied voltage.",
      rawLatex:
        "C_j = A \\cdot \\sqrt{\\frac{q \\varepsilon_s N_d}{2 (V_{\\text{bi}} + V_R)}} = \\frac{\\varepsilon_s A}{W_{\\text{dep}}}",
      colorizedLatex:
        "\\textcolor{#059669}{C_j} = \\textcolor{#2563eb}{A} \\cdot \\sqrt{\\frac{\\textcolor{#9333ea}{q} \\cdot \\textcolor{#d97706}{\\varepsilon_s} \\cdot \\textcolor{#dc2626}{N_d}}{2 (\\textcolor{#16a34a}{V_{\\text{bi}}} + \\textcolor{#6b7280}{V_R})}} = \\frac{\\textcolor{#d97706}{\\varepsilon_s} \\cdot \\textcolor{#2563eb}{A}}{\\textcolor{#7c3aed}{W_{\\text{dep}}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "junction capacitance", variableId: "c_j" },
        { text: " across " },
        { text: "junction area", variableId: "area_a" },
        { text: " depends on " },
        { text: "elementary charge", variableId: "q_charge" },
        { text: ", " },
        { text: "permittivity", variableId: "eps_s" },
        { text: ", and " },
        { text: "doping concentration", variableId: "n_d" },
        { text: ", scaling inversely with " },
        { text: "built-in potential", variableId: "v_bi" },
        { text: " plus " },
        { text: "reverse bias voltage", variableId: "v_r" },
        { text: " and " },
        { text: "depletion layer width", variableId: "w_dep" },
        { text: "." },
      ],
      variables: [
        {
          id: "c_j",
          symbol: "C_j",
          name: "P-N Junction Transition Capacitance",
          color: "emerald",
          role: "Dynamic small-signal capacitance of the reverse-biased junction (pF).",
          unit: "pF",
          dimension: "M^-1 L^-2 T^4 I^2",
          explanation: "Acts as an integrated capacitor for AC coupling and filter networks.",
          telemetryMetricLabel: "P-N Junction Capacitance",
        },
        {
          id: "area_a",
          symbol: "A",
          name: "Junction Surface Area",
          color: "sapphire",
          role: "Cross-sectional planar area of the diffused p-n diode (µm²).",
          unit: "µm^2",
          dimension: "L^2",
          explanation: "Larger junction area increases capacitance proportionally.",
        },
        {
          id: "q_charge",
          symbol: "q",
          name: "Elementary Charge",
          color: "amethyst",
          role: "Fundamental physical constant (1.602 × 10⁻¹⁹ C).",
          unit: "C",
          dimension: "T I",
          explanation: "Charge of a single electron.",
        },
        {
          id: "eps_s",
          symbol: "\\varepsilon_s",
          name: "Semiconductor Permittivity",
          color: "amber",
          role: "Dielectric permittivity of the crystal (F/cm).",
          unit: "F/cm",
          dimension: "M^-1 L^-3 T^4 I^2",
          explanation: "Germanium (16.0 × ε₀) or Silicon (11.7 × ε₀).",
        },
        {
          id: "n_d",
          symbol: "N_d",
          name: "Donor Doping Concentration",
          color: "rose",
          role: "Active donor impurity concentration in the n-region (cm⁻³).",
          unit: "cm^-3",
          dimension: "L^-3",
          explanation: "Controls carrier density and depletion thickness.",
        },
        {
          id: "v_bi",
          symbol: "V_{\\text{bi}}",
          name: "Built-In Barrier Potential",
          color: "emerald",
          role: "Equilibrium contact potential across the junction (V).",
          unit: "V",
          dimension: "M L^2 T^-3 I^-1",
          explanation: "Typically 0.35 V for Germanium and 0.70 V for Silicon.",
        },
        {
          id: "v_r",
          symbol: "V_R",
          name: "Applied Reverse Bias Voltage",
          color: "teal",
          role: "External DC reverse bias voltage applied across the junction (V).",
          unit: "V",
          dimension: "M L^2 T^-3 I^-1",
          explanation: "Higher reverse voltage widens the depletion layer, reducing capacitance.",
        },
        {
          id: "w_dep",
          symbol: "W_{\\text{dep}}",
          name: "Depletion Layer Width",
          color: "amethyst",
          role: "Width of the insulating charge-depleted region (µm).",
          unit: "µm",
          dimension: "L",
          explanation: "Acts as the dielectric gap between conductive p and n regions.",
        },
      ],
    },
  ];

  catalogue["us-2929922-townes-laser"] = [
    {
      id: "townes-threshold-gain",
      patentId: "us-2929922-townes-laser",
      title: "Schawlow-Townes Laser Threshold Gain Criterion",
      category: "Quantum Optics & Laser Resonator Dynamics",
      rawLatex:
        "g_{\\text{th}} = \\alpha_{\\text{loss}} + \\frac{1}{2L} \\ln\\left(\\frac{1}{R_1 R_2}\\right)",
      colorizedLatex:
        "\\textcolor{#059669}{g_{\\text{th}}} = \\textcolor{#2563eb}{\\alpha_{\\text{loss}}} + \\frac{1}{2\\textcolor{#9333ea}{L}} \\ln\\left(\\frac{1}{\\textcolor{#d97706}{R_1} \\cdot \\textcolor{#dc2626}{R_2}}\\right)",
      plainEnglishSentence: [
        { text: "The " },
        { text: "threshold optical gain", variableId: "g_th" },
        { text: " equals " },
        { text: "internal scattering loss", variableId: "alpha_loss" },
        { text: " plus mirror transmission loss per unit " },
        { text: "cavity length", variableId: "cavity_l" },
        { text: " for rear mirror " },
        { text: "reflectivity R1", variableId: "r_1" },
        { text: " and output mirror " },
        { text: "reflectivity R2", variableId: "r_2" },
        { text: "." },
      ],
      variables: [
        {
          id: "g_th",
          symbol: "g_{\\text{th}}",
          name: "Threshold Optical Gain Coefficient",
          color: "emerald",
          role: "Minimum optical gain per centimeter required for self-sustained laser oscillation (cm⁻¹).",
          unit: "cm^-1",
          dimension: "L^-1",
          explanation:
            "Oscillation starts when population inversion generates small-signal gain exceeding this threshold.",
          telemetryMetricLabel: "Threshold Gain",
        },
        {
          id: "alpha_loss",
          symbol: "\\alpha_{\\text{loss}}",
          name: "Internal Resonator Loss",
          color: "sapphire",
          role: "Optical absorption and scattering losses within the laser host medium (cm⁻¹).",
          unit: "cm^-1",
          dimension: "L^-1",
          explanation: "Typically less than 0.005 cm⁻¹ in high-purity optical crystals and vapors.",
          telemetryMetricLabel: "Intracavity Power",
        },
        {
          id: "cavity_l",
          symbol: "L",
          name: "Resonator Cavity Length",
          color: "amethyst",
          role: "Physical separation distance between the parallel planar end mirrors (cm).",
          unit: "cm",
          dimension: "L",
          explanation:
            "Longer cavities reduce the mirror transmission loss per centimeter of gain medium.",
          telemetryMetricLabel: "Resonator Cavity Length",
        },
        {
          id: "r_1",
          symbol: "R_1",
          name: "High Reflector Reflectivity",
          color: "amber",
          role: "Power reflectivity of the rear end mirror.",
          unit: "dimensionless",
          dimension: "1",
          explanation: "Typically >99.8% using multi-layer dielectric optical coatings.",
          telemetryMetricLabel: "Threshold Gain",
        },
        {
          id: "r_2",
          symbol: "R_2",
          name: "Output Coupler Reflectivity",
          color: "crimson",
          role: "Power reflectivity of the front output mirror extracting the laser beam.",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Optimized (typically 90% to 98%) to maximize useful extracted laser beam power.",
          telemetryMetricLabel: "Output Mirror Reflectivity",
        },
      ],
      pedagogicalNote:
        "When the pump power excites enough atoms to satisfy g0 ≥ g_th, coherent optical oscillation begins and laser output power grows linearly with additional pump power.",
      claimRef: 1,
      historicalSignificance:
        "The foundational threshold equation of quantum electronics derived by Schawlow and Townes in 1958.",
    },
    {
      id: "townes-beam-divergence",
      patentId: "us-2929922-townes-laser",
      title: "Diffraction-Limited Laser Beam Divergence",
      category: "Wave Optics & Coherent Spatial Propagation",
      rawLatex: "\\theta_{\\text{div}} = 1.22 \\cdot \\frac{\\lambda}{D}",
      colorizedLatex:
        "\\textcolor{#059669}{\\theta_{\\text{div}}} = 1.22 \\cdot \\frac{\\textcolor{#2563eb}{\\lambda}}{\\textcolor{#d97706}{D}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "beam divergence angle", variableId: "theta_div" },
        { text: " is directly proportional to " },
        { text: "optical wavelength", variableId: "lambda_opt" },
        { text: " and inversely proportional to " },
        { text: "aperture diameter", variableId: "aperture_d" },
        { text: "." },
      ],
      variables: [
        {
          id: "theta_div",
          symbol: "\\theta_{\\text{div}}",
          name: "Full-Angle Beam Divergence",
          color: "emerald",
          role: "Angular spread of the coherent laser beam propagating into far-field space (rad).",
          unit: "mrad",
          dimension: "1",
          explanation:
            "Extremely narrow (typically <1 mrad), allowing lasers to stay tightly focused over astronomical distances.",
          telemetryMetricLabel: "Beam Divergence",
        },
        {
          id: "lambda_opt",
          symbol: "\\lambda",
          name: "Optical Emission Wavelength",
          color: "sapphire",
          role: "Wavelength of the coherent optical radiation generated by stimulated emission (nm).",
          unit: "nm",
          dimension: "L",
          explanation: "Set by the quantum energy transition ΔE = h·c/λ of the active medium.",
          telemetryMetricLabel: "Laser Output Power",
        },
        {
          id: "aperture_d",
          symbol: "D",
          name: "Cavity Aperture Diameter",
          color: "amber",
          role: "Clear diameter of the active gain medium and output mirror aperture (mm).",
          unit: "mm",
          dimension: "L",
          explanation:
            "Larger apertures produce narrower, more parallel diffraction-limited beams.",
          telemetryMetricLabel: "Aperture Diameter",
        },
      ],
      pedagogicalNote:
        "Because the open Fabry-Pérot cavity forces all oscillating light into a single spatial phase, laser beams achieve the fundamental physical limit of directional propagation set by wave mechanics.",
      historicalSignificance:
        "Proved that optical masers could transmit information and power with unprecedented collimation across planetary distances.",
    },
  ];

  catalogue["us-2297691-carlson-electrophotography"] = [
    {
      id: "carlson-photo-induced-discharge",
      patentId: "us-2297691-carlson-electrophotography",
      title: "Photo-Induced Electrostatic Surface Discharge Kinetics",
      category: "Photoconductivity & Electrostatic Field Dynamics",
      rawLatex:
        "V(t) = V_0 \\exp\\left(-\\frac{\\sigma_{\\text{photo}} \\cdot t}{\\epsilon_0 \\epsilon_r}\\right) + V_{\\text{res}}",
      colorizedLatex:
        "\\textcolor{#059669}{V(t)} = \\textcolor{#d97706}{V_0} \\exp\\left(-\\frac{\\textcolor{#2563eb}{\\sigma_{\\text{photo}}} \\cdot \\textcolor{#9333ea}{t}}{\\textcolor{#dc2626}{\\epsilon_0 \\epsilon_r}}\\right) + \\textcolor{#059669}{V_{\\text{res}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "surface potential", variableId: "v_t" },
        { text: " decays from " },
        { text: "initial corona voltage", variableId: "v_0" },
        { text: " exponentially with " },
        { text: "photoconductivity", variableId: "sigma_photo" },
        { text: " and " },
        { text: "exposure duration", variableId: "time_t" },
        { text: " divided by " },
        { text: "layer permittivity", variableId: "permittivity_eps" },
        { text: " down to residual potential." },
      ],
      variables: [
        {
          id: "v_t",
          symbol: "V(t)",
          name: "Instantaneous Surface Potential",
          color: "emerald",
          role: "Electrostatic potential on the photoconductor surface at time t (V).",
          unit: "V",
          dimension: "M L^2 T^-3 I^-1",
          explanation: "Decays rapidly in illuminated areas while persisting in dark image areas.",
          telemetryMetricLabel: "Surface Contrast Potential",
        },
        {
          id: "v_0",
          symbol: "V_0",
          name: "Initial Corona Charge Potential",
          color: "amber",
          role: "Uniform starting voltage deposited by the corona charging wire (V).",
          unit: "V",
          dimension: "M L^2 T^-3 I^-1",
          explanation: "Typically +600 V to +800 V deposited in darkness.",
          telemetryMetricLabel: "Initial Surface Charge",
        },
        {
          id: "sigma_photo",
          symbol: "\\sigma_{\\text{photo}}",
          name: "Light-Induced Photoconductivity",
          color: "sapphire",
          role: "Electrical conductivity generated by absorbed optical photons (S/m).",
          unit: "S/m",
          dimension: "M^-1 L^-3 T^3 I^2",
          explanation: "Increases by up to six orders of magnitude when struck by light.",
          telemetryMetricLabel: "Developed Optical Density",
        },
        {
          id: "time_t",
          symbol: "t",
          name: "Exposure Time",
          color: "amethyst",
          role: "Duration of optical exposure to the document image (s).",
          unit: "s",
          dimension: "T",
          explanation: "Determined by document scan speed and optical lamp intensity.",
          telemetryMetricLabel: "Optical Exposure",
        },
        {
          id: "permittivity_eps",
          symbol: "\\epsilon_0 \\epsilon_r",
          name: "Photoconductor Permittivity",
          color: "crimson",
          role: "Dielectric permittivity of the amorphous selenium/sulfur layer (F/m).",
          unit: "F/m",
          dimension: "M^-1 L^-3 T^4 I^2",
          explanation:
            "Determines the layer capacitance and electrostatic charge storage capacity.",
          telemetryMetricLabel: "Photoreceptor Thickness",
        },
      ],
      pedagogicalNote:
        "Because dark resistivity is extremely high (10^14 Ohm·cm), dark image areas retain their full charge while bright areas discharge to ground in milliseconds.",
      claimRef: 1,
      historicalSignificance:
        "Founded the physical principles of electrophotographic latent imaging and dry copier physics.",
    },
    {
      id: "carlson-toner-adhesion",
      patentId: "us-2297691-carlson-electrophotography",
      title: "Triboelectric Toner Coulomb Attraction Force",
      category: "Electrostatic Particle Dynamics & Xerographic Development",
      rawLatex:
        "F_e = \\frac{q_{\\text{toner}} \\cdot \\sigma_{\\text{latent}}}{\\epsilon_0 \\epsilon_r}",
      colorizedLatex:
        "\\textcolor{#059669}{F_e} = \\frac{\\textcolor{#dc2626}{q_{\\text{toner}}} \\cdot \\textcolor{#d97706}{\\sigma_{\\text{latent}}}}{\\textcolor{#2563eb}{\\epsilon_0 \\epsilon_r}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "Coulomb attraction force", variableId: "force_fe" },
        { text: " equals " },
        { text: "triboelectric toner charge", variableId: "q_toner" },
        { text: " multiplied by " },
        { text: "latent surface charge density", variableId: "sigma_latent" },
        { text: " divided by " },
        { text: "effective permittivity", variableId: "permittivity_eps_dev" },
        { text: "." },
      ],
      variables: [
        {
          id: "force_fe",
          symbol: "F_e",
          name: "Electrostatic Adhesion Force",
          color: "emerald",
          role: "Force pulling dry toner particles onto the charged latent image (N).",
          unit: "N",
          dimension: "M L T^-2",
          explanation:
            "Must exceed gravitational and inertial forces to adhere cleanly to the drum.",
          telemetryMetricLabel: "Toner Mass Density",
        },
        {
          id: "q_toner",
          symbol: "q_{\\text{toner}}",
          name: "Toner Triboelectric Charge",
          color: "crimson",
          role: "Net electric charge acquired by toner particles through friction with carrier beads (C).",
          unit: "C",
          dimension: "I T",
          explanation: "Typically -15 to -25 µC/g for dual-component developer.",
          telemetryMetricLabel: "Developed Optical Density",
        },
        {
          id: "sigma_latent",
          symbol: "\\sigma_{\\text{latent}}",
          name: "Latent Image Charge Density",
          color: "amber",
          role: "Remaining electrostatic surface charge density in unexposed image areas (C/m²).",
          unit: "C/m^2",
          dimension: "L^-2 I T",
          explanation: "Directly proportional to the image contrast voltage (ΔV).",
          telemetryMetricLabel: "Surface Contrast Potential",
        },
        {
          id: "permittivity_eps_dev",
          symbol: "\\epsilon_0 \\epsilon_r",
          name: "Medium Permittivity",
          color: "sapphire",
          role: "Permittivity of the air/development gap (F/m).",
          unit: "F/m",
          dimension: "M^-1 L^-3 T^4 I^2",
          explanation: "Governs electric field flux line concentration at latent image edges.",
          telemetryMetricLabel: "Photoreceptor Thickness",
        },
      ],
      pedagogicalNote:
        "Toner particles only adhere where the electrostatic force exceeds mechanical detachment thresholds, producing crisp text with zero background haze.",
      claimRef: 21,
      historicalSignificance:
        "Established the physical law governing toner development across all laser printers and copiers.",
    },
  ];

  catalogue["us-879532-de-forest-audion"] = [
    {
      id: "de-forest-audion-amplification",
      patentId: "us-879532-de-forest-audion",
      title: "Audion Triode Transconductance & Space-Charge Control",
      category: "Thermionic Grid Control & RF Amplification",
      rawLatex: "I_a = k \\left(V_g + \\frac{V_a}{\\mu}\\right)^{3/2}",
      colorizedLatex:
        "\\textcolor{#059669}{I_a} = k \\left(\\textcolor{#2563eb}{V_g} + \\frac{\\textcolor{#d97706}{V_a}}{\\textcolor{#9333ea}{\\mu}}\\right)^{3/2}",
      plainEnglishSentence: [
        { text: "The anode plate " },
        { text: "thermionic current", variableId: "anode_current" },
        { text: " is governed by electrostatic space-charge modulation from the interposed " },
        { text: "grid control voltage", variableId: "grid_voltage" },
        { text: " and the accelerated " },
        { text: "plate anode voltage", variableId: "plate_voltage" },
        { text: " scaled by the electrostatic " },
        { text: "triode amplification factor", variableId: "amplification_factor" },
        { text: "." },
      ],
      variables: [
        {
          id: "anode_current",
          symbol: "I_a",
          name: "Anode Plate Current",
          color: "emerald",
          role: "Total thermionic electron current collected at the positive anode plate.",
          unit: "mA",
          dimension: "I",
          explanation:
            "The plate current that flows through the telephone receiver or output transformer to drive earphones or loudspeakers.",
        },
        {
          id: "grid_voltage",
          symbol: "V_g",
          name: "Control Grid Bias Voltage",
          color: "sapphire",
          role: "Electrostatic potential applied to the wire grid interposed between filament and plate.",
          unit: "V",
          dimension: "M L^2 T^-3 I^-1",
          explanation:
            "Minute radio frequency voltages from the antenna modulate the grid potential, dynamically controlling the electron stream without drawing significant current.",
        },
        {
          id: "plate_voltage",
          symbol: "V_a",
          name: "Plate Supply Voltage (B-Battery)",
          color: "amber",
          role: "High positive potential accelerating thermionic electrons across the evacuated bulb.",
          unit: "V",
          dimension: "M L^2 T^-3 I^-1",
          explanation:
            "Supplied by local B-batteries (typically 20–90 V) to pull electrons across the vacuum gap.",
        },
        {
          id: "amplification_factor",
          symbol: "\\mu",
          name: "Triode Voltage Amplification Factor",
          color: "amethyst",
          role: "Ratio of grid effectiveness to plate effectiveness in controlling space-charge flow (mu = -dV_a / dV_g).",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Because the grid is much closer to the cathode than the plate, a small change in grid voltage has the same effect as a much larger change in plate voltage, producing voltage amplification.",
        },
      ],
      pedagogicalNote:
        "Lee de Forest's insertion of a perforated control grid between cathode and anode transformed the passive Fleming diode into an active electronic amplifier, creating the technological foundation for radio broadcasting, television, long-distance telephony, radar, and electronic computing.",
      claimRef: 1,
      historicalSignificance:
        "US 879,532 is the master triode patent that enabled the entire electronic century.",
    },
  ];

  catalogue["us-400766-hall-aluminium"] = [
    {
      id: "hall-aluminium-faraday-deposition",
      patentId: "us-400766-hall-aluminium",
      title: "Faraday's Law of Electrolytic Aluminium Smelting & Voltage Balance",
      category: "Electrochemistry & High-Temperature Metallurgy",
      rawLatex:
        "m_{\\text{Al}} = \\frac{I \\cdot t \\cdot M}{z \\cdot F} \\cdot \\eta_{\\text{curr}} \\quad \\text{and} \\quad V_{\\text{cell}} = E_{\\text{rev}} + \\eta_{\\text{anode}} + I R_{\\text{bath}}",
      colorizedLatex:
        "\\textcolor{#059669}{m_{\\text{Al}}} = \\frac{\\textcolor{#2563eb}{I} \\cdot \\textcolor{#d97706}{t} \\cdot \\textcolor{#0d9488}{M}}{\\textcolor{#9333ea}{z} \\cdot \\textcolor{#dc2626}{F}} \\cdot \\textcolor{#10b981}{\\eta_{\\text{curr}}} \\quad \\text{and} \\quad \\textcolor{#f59e0b}{V_{\\text{cell}}} = \\textcolor{#6366f1}{E_{\\text{rev}}} + \\textcolor{#ec4899}{\\eta_{\\text{anode}}} + \\textcolor{#2563eb}{I} \\textcolor{#14b8a6}{R_{\\text{bath}}}",
      plainEnglishSentence: [
        { text: "The total mass of " },
        { text: "liquid aluminium metal deposited", variableId: "m_al" },
        { text: " at the cathode is proportional to the " },
        { text: "electrolytic direct current", variableId: "cell_current" },
        { text: ", total " },
        { text: "electrolysis time", variableId: "time_t" },
        { text: ", and " },
        { text: "molar mass of aluminium", variableId: "molar_mass" },
        { text: ", divided by " },
        { text: "valence electron transfer (z = 3)", variableId: "valence_z" },
        { text: " and " },
        { text: "Faraday's constant", variableId: "faraday_f" },
        { text: ", scaled by the " },
        { text: "cathodic current efficiency", variableId: "curr_eff" },
        { text: ", while the " },
        { text: "total reduction cell voltage", variableId: "v_cell" },
        { text: " balances the " },
        { text: "reversible thermodynamic potential", variableId: "e_rev" },
        { text: ", " },
        { text: "anode overpotential", variableId: "eta_anode" },
        { text: ", and " },
        { text: "Ohmic cryolite bath resistance", variableId: "r_bath" },
        { text: "." },
      ],
      variables: [
        {
          id: "m_al",
          symbol: "m_{\\text{Al}}",
          name: "Mass of Reduced Aluminium Metal",
          color: "emerald",
          role: "Total liquid metallic aluminium electrodeposited at the cathode and tapped from the pot bottom",
          unit: "Kilograms (kg)",
          dimension: "[M]",
          explanation:
            "Continuous electrolysis yields approximately 0.335 kg of pure aluminium per kiloampere-hour.",
          telemetryKey: "currentAmperes",
          telemetryMetricLabel: "Al Production Rate",
        },
        {
          id: "cell_current",
          symbol: "I",
          name: "Electrolytic Cell DC Current",
          color: "sapphire",
          role: "Direct electric current driven through the molten cryolite bath by the generator",
          unit: "Amperes (A)",
          dimension: "[I]",
          explanation:
            "High direct current (100–500 kA in modern smelters; ~2000 A in Hall's initial 1888 pilot pots) drives both reduction and autothermal Joule heating.",
          telemetryKey: "currentAmperes",
          telemetryMetricLabel: "Cell Current",
        },
        {
          id: "time_t",
          symbol: "t",
          name: "Smelting Duration",
          color: "amber",
          role: "Total elapsed time of continuous electrolytic operation",
          unit: "Seconds (s) / Hours (h)",
          dimension: "[T]",
          explanation: "Hall cells operate continuously for months or years without shutdown.",
        },
        {
          id: "molar_mass",
          symbol: "M",
          name: "Aluminium Molar Mass",
          color: "teal",
          role: "Atomic weight of aluminium (26.9815 g/mol)",
          unit: "g/mol / kg/mol",
          dimension: "[M N^-1]",
          explanation: "Standard elemental atomic weight of aluminium.",
        },
        {
          id: "valence_z",
          symbol: "z",
          name: "Aluminium Valence State",
          color: "amethyst",
          role: "Number of electrons required to reduce one Al³⁺ cation to metallic Al (z = 3)",
          unit: "Electrons per atom",
          dimension: "Dimensionless",
          explanation: "Reduction from Al³⁺ in alumina requires three electrons per atom.",
        },
        {
          id: "faraday_f",
          symbol: "F",
          name: "Faraday Constant",
          color: "rose",
          role: "Electric charge per mole of electrons (96,485.33 C/mol)",
          unit: "Coulombs per mole (C/mol)",
          dimension: "[I T N^-1]",
          explanation: "Fundamental constant relating electric charge to chemical quantity.",
        },
        {
          id: "curr_eff",
          symbol: "\\eta_{\\text{curr}}",
          name: "Faradaic Current Efficiency",
          color: "emerald",
          role: "Fraction of electric current producing net aluminium metal (~85–95%)",
          unit: "Dimensionless (ratio / %)",
          dimension: "Dimensionless",
          explanation:
            "Slight losses occur due to back-reaction of dissolved aluminium metal with anode CO₂ gas.",
          telemetryKey: "bathTemperatureCelsius",
          telemetryMetricLabel: "Current Efficiency",
        },
        {
          id: "v_cell",
          symbol: "V_{\\text{cell}}",
          name: "Total Cell Operating Voltage",
          color: "amber",
          role: "Terminal voltage applied across the anode bus and cathode shell (4.0–4.5 V)",
          unit: "Volts (V)",
          dimension: "[M L^2 T^-3 I^-1]",
          explanation:
            "Total electrical potential drop sustaining the electrochemical reaction and thermal Joule balance.",
          telemetryKey: "currentAmperes",
          telemetryMetricLabel: "Cell Voltage",
        },
        {
          id: "e_rev",
          symbol: "E_{\\text{rev}}",
          name: "Reversible Thermodynamic Potential",
          color: "sapphire",
          role: "Theoretical minimum decomposition voltage with carbon anode consumption (1.18 V at 960°C)",
          unit: "Volts (V)",
          dimension: "[M L^2 T^-3 I^-1]",
          explanation:
            "Carbon anode oxidation to CO₂ lowers the required decomposition potential from 2.21 V (inert anode) to 1.18 V.",
        },
        {
          id: "eta_anode",
          symbol: "\\eta_{\\text{anode}}",
          name: "Anode & Cathode Overpotential",
          color: "rose",
          role: "Kinetic activation and concentration polarization voltage drops (~0.5–0.6 V)",
          unit: "Volts (V)",
          dimension: "[M L^2 T^-3 I^-1]",
          explanation:
            "Kinetic barrier for CO₂ bubble nucleation and mass transfer at carbon surfaces.",
        },
        {
          id: "r_bath",
          symbol: "R_{\\text{bath}}",
          name: "Cryolite Electrolyte Ohmic Resistance",
          color: "teal",
          role: "Internal electrical resistance of the molten salt layer between anodes and metal pad",
          unit: "Ohms (Ω)",
          dimension: "[M L^2 T^-3 I^-2]",
          explanation:
            "Ohmic dissipation (I² R_bath) supplies the heat needed to maintain the 960°C operating temperature.",
        },
      ],
      pedagogicalNote:
        "By dissolving alumina in a liquid fluoride solvent at 950°C and using consumable carbon anodes, Hall achieved commercial aluminium electrodeposition at low voltages and high current efficiencies.",
      claimRef: 1,
      historicalSignificance:
        "The master chemical and electrochemical reaction equation that transformed aluminium into the foundational material of modern aviation and industry.",
    },
  ];

  catalogue["us-706737-fessenden-wireless"] = [
    {
      id: "fessenden-thomson-resonance",
      patentId: "us-706737-fessenden-wireless",
      title: "Thomson LC Resonance Frequency & High-Q Tuning",
      category: "Electromagnetism & Resonant Circuits",
      rawLatex: "f_0 = \frac{1}{2pi sqrt{L C}}",
      colorizedLatex:
        "\textcolor{#2563eb}{f_0} = \frac{1}{2pi sqrt{\textcolor{#059669}{L} cdot \textcolor{#d97706}{C}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "fundamental continuous-wave resonant frequency", variableId: "f0" },
        { text: " is determined inversely by the square root of the series tuning " },
        { text: "inductance", variableId: "inductance" },
        { text: " and the antenna system " },
        { text: "capacitance", variableId: "capacitance" },
        { text: "." },
      ],
      variables: [
        {
          id: "f0",
          symbol: "f_0",
          name: "Resonant Carrier Frequency",
          color: "sapphire",
          role: "Natural frequency of oscillation of the low-loss cage antenna and tuning circuit.",
          unit: "Hz",
          dimension: "T^-1",
          explanation:
            "Continuous sinusoidal waves at this frequency radiate with maximum voltage amplitude and minimum damping.",
          telemetryMetricLabel: "Carrier Frequency",
        },
        {
          id: "inductance",
          symbol: "L",
          name: "Series Tuning Inductance",
          color: "emerald",
          role: "Variable inductance coil (2) connected in series with the high-frequency alternator.",
          unit: "H",
          dimension: "M L^2 T^-2 I^-2",
          explanation:
            "Allows precise tuning of the aerial to the alternator's rotational generator frequency.",
          telemetryMetricLabel: "Inductance",
        },
        {
          id: "capacitance",
          symbol: "C",
          name: "Antenna Electrostatic Capacitance",
          color: "amber",
          role: "Total capacitance of the multi-wire cylindrical cage radiator (1) to ground.",
          unit: "F",
          dimension: "M^-1 L^-2 T^4 I^2",
          explanation:
            "Cylindrical cage geometry provides high capacity while keeping high-frequency ohmic resistance minimal.",
          telemetryMetricLabel: "Antenna Capacitance",
        },
      ],
      pedagogicalNote:
        "Unlike spark-gap transmitters that created transient damped bursts, Fessenden's continuous sine waves allowed infinitely sharper resonance and multi-channel operation.",
      claimRef: 1,
      historicalSignificance:
        "Established the foundation of continuous-wave resonant frequency selection in modern radio engineering.",
    },
    {
      id: "fessenden-radiation-efficiency",
      patentId: "us-706737-fessenden-wireless",
      title: "Antenna Radiation Efficiency & Low-Loss Cage Architecture",
      category: "Antenna Theory & Radiated Power",
      rawLatex:
        "eta_{\text{rad}} = \frac{R_{\text{rad}}}{R_{\text{rad}} + R_{\text{loss}}} = \frac{80pi^2 left(\frac{h}{lambda}\right)^2}{80pi^2 left(\frac{h}{lambda}\right)^2 + R_{\text{loss}}}",
      colorizedLatex:
        "\textcolor{#059669}{eta_{\text{rad}}} = \frac{\textcolor{#2563eb}{R_{\text{rad}}}}{\textcolor{#2563eb}{R_{\text{rad}}} + \textcolor{#ef4444}{R_{\text{loss}}}} = \frac{80pi^2 left(\frac{\textcolor{#d97706}{h}}{\textcolor{#9333ea}{lambda}}\right)^2}{80pi^2 left(\frac{\textcolor{#d97706}{h}}{\textcolor{#9333ea}{lambda}}\right)^2 + \textcolor{#ef4444}{R_{\text{loss}}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "antenna radiation efficiency", variableId: "eta_rad" },
        { text: " depends on the ratio of " },
        { text: "radiation resistance", variableId: "r_rad" },
        { text: " to total resistance including " },
        { text: "ohmic loss resistance", variableId: "r_loss" },
        { text: ", scaling with " },
        { text: "antenna physical height", variableId: "h_ant" },
        { text: " over " },
        { text: "electromagnetic wavelength", variableId: "lambda" },
        { text: "." },
      ],
      variables: [
        {
          id: "eta_rad",
          symbol: "eta_{\text{rad}}",
          name: "Antenna Radiation Efficiency",
          color: "emerald",
          role: "Fraction of RF generator power converted into radiating electromagnetic fields.",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "High efficiency requires maximizing radiation resistance while keeping conductor and ground losses minimal.",
          telemetryMetricLabel: "Radiation Efficiency",
        },
        {
          id: "r_rad",
          symbol: "R_{\text{rad}}",
          name: "Radiation Resistance",
          color: "sapphire",
          role: "Equivalent resistance representing power radiated into space by the cage aerial.",
          unit: "Ω",
          dimension: "M L^2 T^-3 I^-2",
          explanation:
            "Scales with the square of the electrical height (h/λ) of the antenna structure.",
          telemetryMetricLabel: "Radiation Resistance",
        },
        {
          id: "r_loss",
          symbol: "R_{\text{loss}}",
          name: "Internal Ohmic & Ground Loss Resistance",
          color: "crimson",
          role: "Conductor skin-effect resistance and ground return dissipation.",
          unit: "Ω",
          dimension: "M L^2 T^-3 I^-2",
          explanation:
            "Fessenden's multi-wire cage and ground grid reduced R_loss drastically compared to single-wire poles.",
          telemetryMetricLabel: "Loss Resistance",
        },
        {
          id: "h_ant",
          symbol: "h",
          name: "Antenna Effective Height",
          color: "amber",
          role: "Physical vertical height of the cylindrical cage radiator above the ground plane.",
          unit: "m",
          dimension: "L",
          explanation:
            "Higher vertical elevation increases radiation resistance and broadens transmission range.",
          telemetryMetricLabel: "Effective Height",
        },
        {
          id: "lambda",
          symbol: "lambda",
          name: "Wavelength",
          color: "amethyst",
          role: "Electromagnetic spatial wavelength corresponding to the continuous carrier frequency.",
          unit: "m",
          dimension: "L",
          explanation: "λ = c / f_0, governing the electrical sizing of the radiating aerial.",
          telemetryMetricLabel: "Carrier Wavelength",
        },
      ],
      pedagogicalNote:
        "By distributing RF currents across multiple parallel wires in a cage, Fessenden minimized high-frequency skin-effect resistance.",
      claimRef: 5,
      historicalSignificance:
        "Introduced modern low-loss cage antenna design principles used in VLF, LF, and broadcasting towers.",
    },
  ];

  catalogue["us-879532-de-forest-audion"] = [
    {
      id: "deforest-triode-plate-current",
      patentId: "us-879532-de-forest-audion",
      title: "Child-Langmuir Triode Space-Charge Law & Grid Control",
      category: "Thermionic Emission & Electrostatic Field Modulation",
      rawLatex: "I_p = G \\left(V_g + \\frac{V_p}{\\mu}\\right)^{3/2}",
      colorizedLatex:
        "\\textcolor{#059669}{I_p} = \\textcolor{#2563eb}{G} \\left(\\textcolor{#dc2626}{V_g} + \\frac{\\textcolor{#d97706}{V_p}}{\\textcolor{#9333ea}{\\mu}}\\right)^{\\textcolor{#ea580c}{3/2}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "plate current", variableId: "i_p" },
        { text: " scales with " },
        { text: "perveance", variableId: "perveance_g" },
        { text: " and the 3/2 power of effective voltage determined by " },
        { text: "grid voltage", variableId: "v_g" },
        { text: " plus " },
        { text: "plate voltage", variableId: "v_p" },
        { text: " divided by the " },
        { text: "amplification factor", variableId: "mu_amp" },
        { text: "." },
      ],
      variables: [
        {
          id: "i_p",
          symbol: "I_p",
          name: "Anode Plate Current",
          color: "emerald",
          role: "Total thermionic electron current flowing to the plate anode (mA).",
          unit: "A",
          dimension: "I",
          explanation: "The amplified output current stream delivered to the local indicator.",
          telemetryMetricLabel: "Plate Current",
        },
        {
          id: "perveance_g",
          symbol: "G",
          name: "Geometric Perveance Constant",
          color: "sapphire",
          role: "Electrode geometry constant determined by filament-plate spacing and area.",
          unit: "A/V^1.5",
          dimension: "M^-1.5 L^-3 T^4.5 I^2.5",
          explanation: "Reflects the physical dimensions and vacuum clearance inside the bulb.",
          telemetryMetricLabel: "Dynamic Transconductance",
        },
        {
          id: "v_g",
          symbol: "V_g",
          name: "Control Grid Electrostatic Potential",
          color: "crimson",
          role: "Voltage applied to the interposed grid wire relative to the cathode (V).",
          unit: "V",
          dimension: "M L^2 T^-3 I^-1",
          explanation:
            "Controls the height of the potential barrier confronting emitted electrons.",
          telemetryMetricLabel: "Grid Bias Voltage",
        },
        {
          id: "v_p",
          symbol: "V_p",
          name: "Anode Plate Potential",
          color: "amber",
          role: "High-voltage DC potential from the local B-battery (V).",
          unit: "V",
          dimension: "M L^2 T^-3 I^-1",
          explanation: "Accelerates electrons across the vacuum gap toward the output plate.",
          telemetryMetricLabel: "B-Battery Plate Voltage",
        },
        {
          id: "mu_amp",
          symbol: "\\mu",
          name: "Triode Amplification Factor",
          color: "amethyst",
          role: "Ratio of plate capacitance to grid capacitance (dimensionless gain).",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Quantifies how many times more effective the grid is than the plate at controlling current.",
          telemetryMetricLabel: "Voltage Amplification Gain",
        },
      ],
      pedagogicalNote:
        "Because the grid is much closer to the filament than the plate, a tiny voltage change on the grid creates a huge change in plate current.",
      claimRef: 1,
      historicalSignificance:
        "First mathematical formulation of active electronic control and amplification.",
    },
    {
      id: "deforest-voltage-gain",
      patentId: "us-879532-de-forest-audion",
      title: "Triode Voltage Gain & Plate Load Impedance",
      category: "Electronic Amplification & Audio Engineering",
      rawLatex: "A_v = \\frac{\\mu \\cdot R_L}{r_p + R_L}",
      colorizedLatex:
        "\\textcolor{#059669}{A_v} = \\frac{\\textcolor{#9333ea}{\\mu} \\cdot \\textcolor{#2563eb}{R_L}}{\\textcolor{#dc2626}{r_p} + \\textcolor{#2563eb}{R_L}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "voltage gain", variableId: "a_v" },
        { text: " equals the " },
        { text: "amplification factor", variableId: "mu_gain" },
        { text: " multiplied by " },
        { text: "load resistance", variableId: "r_load" },
        { text: " divided by total resistance including internal " },
        { text: "dynamic plate resistance", variableId: "r_p" },
        { text: "." },
      ],
      variables: [
        {
          id: "a_v",
          symbol: "A_v",
          name: "Stage Voltage Gain",
          color: "emerald",
          role: "Ratio of output signal voltage to input grid signal voltage.",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Directly determines how much the telephone receiver audio volume increases.",
          telemetryMetricLabel: "Voltage Amplification Gain",
        },
        {
          id: "mu_gain",
          symbol: "\\mu",
          name: "Tube Amplification Constant",
          color: "amethyst",
          role: "Theoretical maximum voltage amplification of the triode.",
          unit: "dimensionless",
          dimension: "1",
          explanation: "Typically μ ≈ 10 to 30 for classic audio triodes.",
          telemetryMetricLabel: "Voltage Amplification Gain",
        },
        {
          id: "r_load",
          symbol: "R_L",
          name: "Output Load Resistance",
          color: "sapphire",
          role: "Resistance of the telephone receiver headset or plate transformer (kΩ).",
          unit: "Ω",
          dimension: "M L^2 T^-3 I^-2",
          explanation: "Converts plate current variations into usable output voltage swing.",
          telemetryMetricLabel: "Plate Load Resistance",
        },
        {
          id: "r_p",
          symbol: "r_p",
          name: "Internal Dynamic Plate Resistance",
          color: "crimson",
          role: "Incremental internal resistance of the vacuum tube discharge path (kΩ).",
          unit: "Ω",
          dimension: "M L^2 T^-3 I^-2",
          explanation: "Inversely proportional to transconductance (rp = μ / gm).",
          telemetryMetricLabel: "Dynamic Transconductance",
        },
      ],
      pedagogicalNote:
        "When load resistance RL is made much larger than plate resistance rp, the voltage gain approaches the theoretical maximum amplification factor μ.",
      claimRef: 4,
      historicalSignificance:
        "Founded the fundamental engineering equations for audio amplifiers, transmitters, and receivers.",
    },
  ];

  catalogue["us-682690-hewitt-mercury-lamp"] = [
    {
      id: "hewitt-positive-column-field",
      patentId: "us-682690-hewitt-mercury-lamp",
      title: "Mercury Plasma Positive Column Gradient & Negative Resistance",
      category: "Plasma Physics & Gas Discharge Conduction",
      rawLatex:
        "E_{\\text{column}} = \\frac{C_0 + C_1 \\sqrt{P_{\\text{Hg}}}}{I_{\\text{arc}}^\\alpha}",
      colorizedLatex:
        "\\textcolor{#059669}{E_{\\text{column}}} = \\frac{\\textcolor{#2563eb}{C_0} + \\textcolor{#d97706}{C_1} \\sqrt{\\textcolor{#9333ea}{P_{\\text{Hg}}}}}{\\textcolor{#dc2626}{I_{\\text{arc}}}^{\\textcolor{#ea580c}{\\alpha}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "plasma electric field gradient", variableId: "e_col" },
        { text: " scales with the square root of " },
        { text: "mercury vapor pressure", variableId: "p_hg" },
        { text: " and drops inversely with " },
        { text: "operating arc current", variableId: "i_arc" },
        { text: " raised to the " },
        { text: "ionization exponent", variableId: "alpha_arc" },
        { text: ", causing negative differential resistance." },
      ],
      variables: [
        {
          id: "e_col",
          symbol: "E_{\\text{column}}",
          name: "Positive Column Electric Field Gradient",
          color: "emerald",
          role: "Potential drop per unit length along the glowing plasma path (V/cm).",
          unit: "V/m",
          dimension: "M L T^-3 I^-1",
          explanation: "Governs the total voltage drop required across the discharge tube.",
          telemetryMetricLabel: "Arc Voltage Drop",
        },
        {
          id: "p_hg",
          symbol: "P_{\\text{Hg}}",
          name: "Equilibrium Mercury Vapor Pressure",
          color: "amethyst",
          role: "Vapor pressure of mercury regulated by the condensing chamber.",
          unit: "Pa",
          dimension: "M L^-1 T^-2",
          explanation:
            "Higher temperature increases vapor density and collision frequency, raising column field.",
          telemetryMetricLabel: "Vapor Pressure",
        },
        {
          id: "i_arc",
          symbol: "I_{\\text{arc}}",
          name: "Discharge Arc Current",
          color: "crimson",
          role: "Total electrical current traversing the ionized positive column (A).",
          unit: "A",
          dimension: "I",
          explanation:
            "Higher current increases plasma electron density, lowering column resistance.",
          telemetryMetricLabel: "Operating Arc Current",
        },
        {
          id: "alpha_arc",
          symbol: "\\alpha",
          name: "Plasma Current Scaling Exponent",
          color: "amber",
          role: "Empirical Ayrton-Nottingham arc exponent (typically α ≈ 0.35 for mercury).",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Reflects the non-linear ionization kinetics of low-pressure mercury plasma.",
          telemetryMetricLabel: "Luminous Efficacy",
        },
      ],
      pedagogicalNote:
        "Because E_column decreases as current rises (negative resistance), a series inductive ballast is essential to prevent electrical short-circuiting.",
      claimRef: 1,
      historicalSignificance:
        "First commercial exploitation of steady-state low-pressure plasma discharge illumination.",
    },
    {
      id: "hewitt-paschen-breakdown",
      patentId: "us-682690-hewitt-mercury-lamp",
      title: "Townsend Avalanche & Paschen Starting Breakdown Voltage",
      category: "High-Voltage Electrostatics & Gas Breakdown",
      rawLatex:
        "V_B = \\frac{B \\cdot p \\cdot d}{\\ln(A \\cdot p \\cdot d) - \\ln(\\ln(1 + 1/\\gamma_{\\text{se}}))}",
      colorizedLatex:
        "\\textcolor{#059669}{V_B} = \\frac{\\textcolor{#2563eb}{B} \\cdot \\textcolor{#9333ea}{p} \\cdot \\textcolor{#d97706}{d}}{\\ln(\\textcolor{#2563eb}{A} \\cdot \\textcolor{#9333ea}{p} \\cdot \\textcolor{#d97706}{d}) - \\ln\\left(\\ln\\left(1 + \\frac{1}{\\textcolor{#dc2626}{\\gamma_{\\text{se}}}}\\right)\\right)}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "breakdown starting voltage", variableId: "v_b" },
        { text: " depends on the product of " },
        { text: "gas pressure", variableId: "p_gas" },
        { text: " and " },
        { text: "electrode gap distance", variableId: "d_gap" },
        { text: ", required to overcome " },
        { text: "secondary electron emission resistance", variableId: "gamma_se" },
        { text: " at the cold cathode." },
      ],
      variables: [
        {
          id: "v_b",
          symbol: "V_B",
          name: "Paschen Breakdown Voltage",
          color: "emerald",
          role: "Minimum transient potential required to ignite self-sustaining plasma (V).",
          unit: "V",
          dimension: "M L^2 T^-3 I^-1",
          explanation:
            "Several thousand volts generated by Hewitt's inductive kick starting circuit.",
          telemetryMetricLabel: "Breakdown Starting Potential",
        },
        {
          id: "p_gas",
          symbol: "p",
          name: "Gas Pressure",
          color: "amethyst",
          role: "Internal rarefied mercury vapor pressure.",
          unit: "Pa",
          dimension: "M L^-1 T^-2",
          explanation: "Maintained in the low-pressure regime by high vacuum evacuation.",
          telemetryMetricLabel: "Vapor Pressure",
        },
        {
          id: "d_gap",
          symbol: "d",
          name: "Inter-Electrode Gap Distance",
          color: "amber",
          role: "Physical length of the discharge tube between liquid cathode and solid anode.",
          unit: "m",
          dimension: "L",
          explanation: "Typically 0.5 to 1.5 meters in Hewitt commercial lamps.",
          telemetryMetricLabel: "Tube Length",
        },
        {
          id: "gamma_se",
          symbol: "\\gamma_{\\text{se}}",
          name: "Secondary Electron Emission Coefficient",
          color: "crimson",
          role: "Probability of secondary electron ejection per incident ion on cold mercury.",
          unit: "dimensionless",
          dimension: "1",
          explanation: "Low value at cold temperatures creates the initial resistance barrier.",
          telemetryMetricLabel: "Breakdown Starting Potential",
        },
      ],
      pedagogicalNote:
        "Hewitt's inductive kick momentarily provides the thousands of volts needed to cross the Paschen breakdown threshold.",
      claimRef: 5,
      historicalSignificance:
        "Defined the two-stage ignition process used in all fluorescent and gas-discharge lamps.",
    },
  ];

  catalogue["us-971501-haber-ammonia"] = [
    {
      id: "haber-le-chatelier-equilibrium",
      patentId: "us-971501-haber-ammonia",
      title: "Le Chatelier Chemical Equilibrium & Pressure Scaling Quotient",
      category: "Chemical Thermodynamics & High-Pressure Equilibria",
      rawLatex:
        "K_p(T) = \\frac{P_{\\text{NH}_3}^2}{P_{\\text{N}_2} P_{\\text{H}_2}^3} = \\frac{y_{\\text{NH}_3}^2}{y_{\\text{N}_2} y_{\\text{H}_2}^3} \\cdot \\frac{1}{P^2}",
      colorizedLatex:
        "\\textcolor{#059669}{K_p(T)} = \\frac{\\textcolor{#2563eb}{P_{\\text{NH}_3}}^2}{\\textcolor{#d97706}{P_{\\text{N}_2}} \\cdot \\textcolor{#9333ea}{P_{\\text{H}_2}}^3} = \\frac{\\textcolor{#2563eb}{y_{\\text{NH}_3}}^2}{\\textcolor{#d97706}{y_{\\text{N}_2}} \\cdot \\textcolor{#9333ea}{y_{\\text{H}_2}}^3} \\cdot \\frac{1}{\\textcolor{#dc2626}{P}^2}",
      plainEnglishSentence: [
        { text: "The thermodynamic " },
        { text: "equilibrium constant", variableId: "kp" },
        { text: " links " },
        { text: "ammonia partial pressure", variableId: "p_nh3" },
        { text: " to reactant " },
        { text: "nitrogen partial pressure", variableId: "p_n2" },
        { text: " and " },
        { text: "hydrogen partial pressure", variableId: "p_h2" },
        { text: ", scaling the product mole fraction with total " },
        { text: "system pressure squared", variableId: "pressure" },
        { text: "." },
      ],
      variables: [
        {
          id: "kp",
          symbol: "K_p(T)",
          name: "Thermodynamic Equilibrium Constant",
          color: "emerald",
          role: "Temperature-dependent chemical equilibrium constant for N2 + 3H2 ⇌ 2NH3.",
          unit: "bar^-2",
          dimension: "M^-2 L^2 T^4",
          explanation:
            "Because synthesis is exothermic (ΔH = -92.4 kJ/mol), Kp decreases with rising temperature according to Van 't Hoff.",
          telemetryMetricLabel: "Equilibrium Constant",
        },
        {
          id: "p_nh3",
          symbol: "P_{\\text{NH}_3}",
          name: "Ammonia Partial Pressure",
          color: "sapphire",
          role: "Partial pressure of synthesized ammonia in the reactor effluent.",
          unit: "Pa",
          dimension: "M L^-1 T^-2",
          explanation: "Scales directly with total hydrostatic compression.",
          telemetryMetricLabel: "Ammonia Yield",
        },
        {
          id: "p_n2",
          symbol: "P_{\\text{N}_2}",
          name: "Nitrogen Partial Pressure",
          color: "amber",
          role: "Partial pressure of unreacted molecular nitrogen feedstock.",
          unit: "Pa",
          dimension: "M L^-1 T^-2",
          explanation: "1/4 of total gas pressure in stoichiometric feed.",
          telemetryMetricLabel: "Feed Pressure",
        },
        {
          id: "p_h2",
          symbol: "P_{\\text{H}_2}",
          name: "Hydrogen Partial Pressure",
          color: "amethyst",
          role: "Partial pressure of unreacted molecular hydrogen feedstock.",
          unit: "Pa",
          dimension: "M L^-1 T^-2",
          explanation: "3/4 of total gas pressure in stoichiometric feed.",
          telemetryMetricLabel: "Feed Pressure",
        },
        {
          id: "pressure",
          symbol: "P",
          name: "Total Hydrostatic System Pressure",
          color: "crimson",
          role: "Super-atmospheric pressure maintained in the synthesis loop (100–200 atm / 10–20 MPa).",
          unit: "Pa",
          dimension: "M L^-1 T^-2",
          explanation:
            "High pressure compresses 4 reactant gas volumes into 2 product volumes, shifting equilibrium toward ammonia.",
          telemetryMetricLabel: "System Pressure",
        },
      ],
      pedagogicalNote:
        "Increasing pressure from 1 atm to 175 atm multiplies ammonia equilibrium yield by over a factor of 100.",
      claimRef: 4,
      historicalSignificance:
        "First successful industrial exploitation of Le Chatelier's principle under extreme super-atmospheric pressure.",
    },
    {
      id: "haber-temkin-pyzhev-kinetics",
      patentId: "us-971501-haber-ammonia",
      title: "Temkin-Pyzhev Heterogeneous Catalytic Reaction Rate",
      category: "Chemical Kinetics & Heterogeneous Catalysis",
      rawLatex:
        "r_{\\text{syn}} = k_1 P_{\\text{N}_2} \\left(\\frac{P_{\\text{H}_2}^3}{P_{\\text{NH}_3}^2}\\right)^\\alpha - k_2 \\left(\\frac{P_{\\text{NH}_3}^2}{P_{\\text{H}_2}^3}\\right)^{1-\\alpha}",
      colorizedLatex:
        "\\textcolor{#059669}{r_{\\text{syn}}} = \\textcolor{#2563eb}{k_1} \\textcolor{#d97706}{P_{\\text{N}_2}} \\left(\\frac{\\textcolor{#9333ea}{P_{\\text{H}_2}}^3}{\\textcolor{#2563eb}{P_{\\text{NH}_3}}^2}\\right)^{\\textcolor{#ea580c}{\\alpha}} - \\textcolor{#dc2626}{k_2} \\left(\\frac{\\textcolor{#2563eb}{P_{\\text{NH}_3}}^2}{\\textcolor{#9333ea}{P_{\\text{H}_2}}^3}\\right)^{1-\\textcolor{#ea580c}{\\alpha}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "catalytic ammonia formation rate", variableId: "r_syn" },
        { text: " is driven by the " },
        { text: "forward rate constant", variableId: "k1" },
        { text: " multiplying " },
        { text: "nitrogen partial pressure", variableId: "p_n2_kin" },
        { text: " and " },
        { text: "hydrogen partial pressure", variableId: "p_h2_kin" },
        { text: ", balanced by the " },
        { text: "reverse decomposition rate constant", variableId: "k2" },
        { text: " with " },
        { text: "surface coverage factor", variableId: "alpha_cov" },
        { text: "." },
      ],
      variables: [
        {
          id: "r_syn",
          symbol: "r_{\\text{syn}}",
          name: "Catalytic Synthesis Reaction Velocity",
          color: "emerald",
          role: "Net rate of ammonia production per unit volume of catalyst bed.",
          unit: "mol/(m^3 s)",
          dimension: "N L^-3 T^-1",
          explanation: "Governs the size and throughput of the industrial converter reactor.",
          telemetryMetricLabel: "Production Rate",
        },
        {
          id: "k1",
          symbol: "k_1",
          name: "Forward Dissociative Adsorption Rate Constant",
          color: "sapphire",
          role: "Arrhenius rate constant for N2 dissociative chemisorption on transition metal.",
          unit: "mol/(m^3 s Pa^2)",
          dimension: "N M^-2 L^-1 T^3",
          explanation: "Solid osmium lowers activation energy from 418 kJ/mol to under 100 kJ/mol.",
          telemetryMetricLabel: "Catalyst Activity",
        },
        {
          id: "p_n2_kin",
          symbol: "P_{\\text{N}_2}",
          name: "Nitrogen Partial Pressure",
          color: "amber",
          role: "Partial pressure driving dissociative nitrogen chemisorption.",
          unit: "Pa",
          dimension: "M L^-1 T^-2",
          explanation: "Rate-determining reactant pressure.",
          telemetryMetricLabel: "Feed Pressure",
        },
        {
          id: "p_h2_kin",
          symbol: "P_{\\text{H}_2}",
          name: "Hydrogen Partial Pressure",
          color: "amethyst",
          role: "Partial pressure promoting rapid surface hydrogenation of adsorbed nitrogen.",
          unit: "Pa",
          dimension: "M L^-1 T^-2",
          explanation:
            "High hydrogen concentration prevents surface poisoning by adsorbed nitrogen.",
          telemetryMetricLabel: "Feed Pressure",
        },
        {
          id: "k2",
          symbol: "k_2",
          name: "Reverse Decomposition Rate Constant",
          color: "crimson",
          role: "Rate constant for catalytic ammonia back-decomposition.",
          unit: "mol/(m^3 s)",
          dimension: "N L^-3 T^-1",
          explanation: "Restrains conversion as ammonia accumulates in the gas stream.",
          telemetryMetricLabel: "Reaction Heat",
        },
        {
          id: "alpha_cov",
          symbol: "\\alpha",
          name: "Surface Charge Transfer Non-Ideality Parameter",
          color: "amber",
          role: "Empirical catalyst surface parameter (typically α ≈ 0.5 for iron/osmium).",
          unit: "dimensionless",
          dimension: "1",
          explanation: "Characterizes the energetic heterogeneity of active catalyst sites.",
          telemetryMetricLabel: "Catalyst Activity",
        },
      ],
      pedagogicalNote:
        "Dissociating the inert N≡N triple bond on the metal catalyst surface is the rate-limiting bottleneck of the entire reaction.",
      claimRef: 1,
      historicalSignificance:
        "Provided the classical mathematical model of industrial heterogeneous gas-solid catalysis.",
    },
  ];

  catalogue["us-942699-baekeland-bakelite"] = [
    {
      id: "bakelite-carothers-gel-point",
      patentId: "us-942699-baekeland-bakelite",
      title: "Carothers Polycondensation Gel Point & Crosslink Threshold",
      category: "Polymer Chemistry & Step-Growth Kinetics",
      rawLatex: "p_c = \\frac{2}{f_{\\text{avg}}}",
      colorizedLatex:
        "\\textcolor{#059669}{p_c} = \\frac{2}{\\textcolor{#2563eb}{f_{\\text{avg}}}}",
      plainEnglishSentence: [
        { text: "The critical fractional " },
        { text: "gel-point conversion threshold", variableId: "gel_conversion" },
        { text: " where an infinite crosslinked network forms is inversely proportional to the " },
        { text: "average monomer functional group valency", variableId: "avg_functionality" },
        { text: "." },
      ],
      variables: [
        {
          id: "gel_conversion",
          symbol: "p_c",
          name: "Critical Gel Point Conversion",
          color: "emerald",
          role: "Fraction of reacted functional groups at which viscosity diverges to infinity and an insoluble infusible 3D gel network forms (p_c ≈ 0.667 for phenol-formaldehyde).",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Below p_c = 66.7%, the resin remains in fusible A-stage or B-stage form; once conversion exceeds p_c, irreversible thermosetting into C-stage Bakelite occurs.",
        },
        {
          id: "avg_functionality",
          symbol: "f_{\\text{avg}}",
          name: "Average Monomer Functionality",
          color: "sapphire",
          role: "Weighted average number of reactive bonding sites per monomer molecule (f = 3 for trifunctional phenol at ortho/ortho/para, and f = 2 for difunctional formaldehyde).",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Because phenol has 3 reactive ring sites and formaldehyde forms 2 bridging connections, f_avg = (3 + 2)/2 = 2.5 in equimolar feedstocks, driving rapid 3D network percolation.",
        },
      ],
      pedagogicalNote:
        "Baekeland halted the reaction before reaching the gel point (p < p_c) to isolate moldable intermediate resole resin, then resumed heating inside molds to cross past p_c into infusible Bakelite.",
      claimRef: 1,
      historicalSignificance:
        "Formulated the theoretical basis for all thermosetting polymers, epoxies, and 3D crosslinked materials.",
    },
    {
      id: "bakelite-vapor-pressure-suppression",
      patentId: "us-942699-baekeland-bakelite",
      title: "Clausius-Clapeyron Vapor Pressure Suppression Equilibrium",
      category: "Thermodynamics & Autoclave Phase Equilibria",
      rawLatex:
        "P_{\\text{autoclave}} > P_{\\text{sat}}(T) = P_0 e^{-\\frac{\\Delta H_{\\text{vap}}}{R T}}",
      colorizedLatex:
        "\\textcolor{#2563eb}{P_{\\text{autoclave}}} > \\textcolor{#ef4444}{P_{\\text{sat}}(T)} = P_0 e^{-\\frac{\\textcolor{#9333ea}{\\Delta H_{\\text{vap}}}}{R \\textcolor{#d97706}{T}}}",
      plainEnglishSentence: [
        { text: "The applied " },
        { text: "autoclave pneumatic pressure", variableId: "p_autoclave" },
        { text: " must exceed the " },
        { text: "saturated vapor pressure", variableId: "p_sat" },
        { text: " of volatile water and formaldehyde at the elevated " },
        { text: "curing temperature", variableId: "temp" },
        { text: " governed by the " },
        { text: "molar enthalpy of vaporization", variableId: "delta_h" },
        { text: " to prevent foaming." },
      ],
      variables: [
        {
          id: "p_autoclave",
          symbol: "P_{\\text{autoclave}}",
          name: "Autoclave Chamber Pressure",
          color: "sapphire",
          role: "Super-atmospheric pressure maintained in the Bakelizer vessel (typically 50–100 psi / 3.5–7 bar).",
          unit: "Pa",
          dimension: "M L^-1 T^-2",
          explanation:
            "External compressed air or steam pressure applied to the mold to suppress boiling of internal condensation moisture.",
        },
        {
          id: "p_sat",
          symbol: "P_{\\text{sat}}",
          name: "Saturated Vapor Pressure",
          color: "crimson",
          role: "Equilibrium vapor pressure of water and unreacted formaldehyde at curing temperature (P_sat ≈ 3.6 bar at 140 °C).",
          unit: "Pa",
          dimension: "M L^-1 T^-2",
          explanation:
            "If autoclave pressure drops below P_sat, boiling steam bubbles nucleate throughout the resin, creating porous, fragile foam.",
        },
        {
          id: "temp",
          symbol: "T",
          name: "Absolute Curing Temperature",
          color: "amber",
          role: "Thermodynamic temperature of the mold and resin charge (110–140 °C / 383–413 K).",
          unit: "K",
          dimension: "Theta",
          explanation:
            "Thermal energy driving condensation kinetics across methylene bridge crosslinks.",
        },
        {
          id: "delta_h",
          symbol: "\\Delta H_{\\text{vap}}",
          name: "Enthalpy of Vaporization of Water",
          color: "amethyst",
          role: "Latent heat of vaporization of water (ΔH_vap ≈ 40.7 kJ/mol).",
          unit: "J/mol",
          dimension: "M L^2 T^-2 N^-1",
          explanation:
            "Thermodynamic energy barrier determining the exponential rise of vapor pressure with temperature.",
        },
      ],
      pedagogicalNote:
        "Baekeland's key apparatus insight was that high pressure does not just mold the resin—it suppresses the physical boiling of byproduct water, guaranteeing void-free density.",
      claimRef: 1,
      historicalSignificance:
        "Established the operational physics for autoclave curing, compression molding, and composite autoclaves used in modern aerospace manufacturing.",
    },
  ];

  catalogue["us-6120588-eink"] = [
    {
      id: "eink-electrophoretic-drift",
      patentId: "us-6120588-eink",
      title: "Stokes-Einstein Electrophoretic Drift Velocity",
      category: "Optoelectronics & Microencapsulated Colloid Dynamics",
      rawLatex: "v = \\frac{q E}{6 \\pi \\eta r_p}",
      colorizedLatex:
        "\\textcolor{#059669}{v} = \\frac{\\textcolor{#2563eb}{q} \\textcolor{#ef4444}{E}}{6 \\pi \\textcolor{#d97706}{\\eta} \\textcolor{#9333ea}{r_p}}",
      plainEnglishSentence: [
        { text: "Electrophoretic drift " },
        { text: "terminal velocity", variableId: "drift_vel" },
        { text: " of charged pigment nanoparticles scales with " },
        { text: "particle surface charge", variableId: "particle_charge" },
        { text: " and applied " },
        { text: "electric field intensity", variableId: "electric_field" },
        { text: ", and is inversely resisted by fluid " },
        { text: "dielectric viscosity", variableId: "fluid_viscosity" },
        { text: " and " },
        { text: "hydrodynamic particle radius", variableId: "particle_radius" },
        { text: "." },
      ],
      variables: [
        {
          id: "drift_vel",
          symbol: "v",
          name: "Electrophoretic Drift Velocity",
          color: "emerald",
          role: "Translational velocity of TiO2 / carbon black particles inside the microcapsule",
          unit: "m/s",
          dimension: "L T^-1",
          explanation:
            "Determines display response latency; switching times of ~100–300 ms result from micrometer-scale particle migration across the 50 μm capsule cavity.",
        },
        {
          id: "particle_charge",
          symbol: "q",
          name: "Net Particle Surface Charge",
          color: "sapphire",
          role: "Electrostatic surface charge established by charging surfactants (e.g. positive for TiO2, negative for carbon)",
          unit: "Coulombs (C)",
          dimension: "I T",
          explanation:
            "Chemical functionalization gives opposite polarity to visually contrastive particles for bidirectional sorting.",
        },
        {
          id: "electric_field",
          symbol: "E",
          name: "Applied Electric Field Intensity",
          color: "crimson",
          role: "Voltage gradient between top ITO electrode and bottom active-matrix pixel electrode (E = V/d ≈ 0.3 V/μm)",
          unit: "V/m",
          dimension: "M L T^-3 I^-1",
          explanation:
            "A 15V switching pulse establishes the electrostatic force driving particles toward the viewing surface.",
        },
        {
          id: "fluid_viscosity",
          symbol: "\\eta",
          name: "Dielectric Carrier Fluid Viscosity",
          color: "amber",
          role: "Dynamic viscosity of the hydrocarbon suspending dielectric fluid (η ≈ 1–2 mPa·s)",
          unit: "Pa·s",
          dimension: "M L^-1 T^-1",
          explanation:
            "Low viscosity enables rapid switching, while matched fluid density prevents gravitational settling.",
        },
        {
          id: "particle_radius",
          symbol: "r_p",
          name: "Hydrodynamic Particle Radius",
          color: "amethyst",
          role: "Mean radius of suspended pigment nanoparticles (r_p ≈ 100–250 nm)",
          unit: "m",
          dimension: "L",
          explanation:
            "Sub-micron particles maximize light scattering (Mie scattering) for paper-like diffuse reflectance.",
        },
      ],
      pedagogicalNote:
        "Because electrophoretic motion ceases the instant the electric field is removed and particles remain held by van der Waals forces, E-Ink exhibits true bistability with zero power consumption in static states.",
      claimRef: 1,
      historicalSignificance:
        "Created the physics foundation for the Amazon Kindle and worldwide electronic paper publishing.",
    },
  ];

  catalogue["us-6285999-pagerank"] = [
    {
      id: "pagerank-markov-eigenvector",
      patentId: "us-6285999-pagerank",
      title: "Stationary Markov Link Transition Eigenvector",
      category: "Information Retrieval & Web Graph Centrality",
      rawLatex: "\\mathbf{r} = d \\mathbf{M} \\mathbf{r} + \\frac{1-d}{N} \\mathbf{1}",
      colorizedLatex:
        "\\textcolor{#059669}{\\mathbf{r}} = \\textcolor{#2563eb}{d} \\textcolor{#ef4444}{\\mathbf{M}} \\textcolor{#059669}{\\mathbf{r}} + \\frac{1-\\textcolor{#2563eb}{d}}{\\textcolor{#d97706}{N}} \\mathbf{1}",
      plainEnglishSentence: [
        { text: "The global " },
        { text: "PageRank vector", variableId: "pagerank_vec" },
        { text: " is the stationary distribution of a random surfer clicking links with " },
        { text: "damping probability", variableId: "damping_factor" },
        { text: " across the " },
        { text: "stochastic hyperlink transition matrix", variableId: "link_matrix" },
        { text: " and teleporting uniformly across " },
        { text: "total database documents", variableId: "total_docs" },
        { text: "." },
      ],
      variables: [
        {
          id: "pagerank_vec",
          symbol: "\\mathbf{r}",
          name: "Stationary PageRank Distribution Vector",
          color: "emerald",
          role: "Probability vector whose i-th component represents the long-term visitation probability of document i",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Documents with higher stationary probability possess higher global authority and rank higher in search results.",
        },
        {
          id: "damping_factor",
          symbol: "d",
          name: "Damping Constant (Transition Probability)",
          color: "sapphire",
          role: "Probability that the surfer follows a hyperlink rather than teleporting (standard d = 0.85)",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Guarantees that the transition matrix is primitive and irreducible, ensuring power iteration converges to a unique positive eigenvector.",
        },
        {
          id: "link_matrix",
          symbol: "\\mathbf{M}",
          name: "Hyperlink Column-Stochastic Transition Matrix",
          color: "crimson",
          role: "Adjacency matrix where M_ij = 1/L(j) if page j links to page i and 0 otherwise",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Encodes the directed topology of the World Wide Web, distributing each document's rank equally among its outbound citations.",
        },
        {
          id: "total_docs",
          symbol: "N",
          name: "Total Database Document Count",
          color: "amber",
          role: "Total number of pages indexed in the linked corpus (billions on the modern web)",
          unit: "count",
          dimension: "1",
          explanation:
            "Normalizes the teleportation distribution so that every document receives a base random jump probability of (1-d)/N.",
        },
      ],
      pedagogicalNote:
        "PageRank converts subjective human hyperlinking choices into an objective mathematical eigenvector, turning link topology into collective intelligence.",
      claimRef: 1,
      historicalSignificance:
        "The foundational search algorithm that powered Google and revolutionized global information retrieval.",
    },
  ];

  catalogue["us-6331181-davinci"] = [
    {
      id: "davinci-calibration-offset",
      patentId: "us-6331181-davinci",
      title: "Tool-Specific Nominal-to-Measured Calibration Offset",
      category: "Robotic Tool Data Interfaces",
      rawLatex: "\\Delta q_{tool} = q_{measured} - q_{nominal}",
      colorizedLatex:
        "\\textcolor{#dc2626}{\\Delta q_{tool}} = \\textcolor{#059669}{q_{measured}} - \\textcolor{#2563eb}{q_{nominal}}",
      plainEnglishSentence: [
        { text: "The tool memory reports the " },
        { text: "measured position", variableId: "measured_position" },
        { text: " minus the " },
        { text: "nominal drive position", variableId: "nominal_position" },
        { text: " so the processor can account for a tool-specific " },
        { text: "calibration offset", variableId: "offset" },
        { text: "." },
      ],
      variables: [
        {
          id: "measured_position",
          symbol: "q_{measured}",
          name: "Measured Relative Position",
          color: "emerald",
          role: "Observed relative position of driven elements and distal end effector",
          unit: "rad or m",
          dimension: "1 or L",
          explanation:
            "The claim distinguishes this measured relationship from nominal assembly geometry.",
        },
        {
          id: "nominal_position",
          symbol: "q_{nominal}",
          name: "Nominal Relative Position",
          color: "sapphire",
          role: "Expected relative position used by a nominal tool model",
          unit: "rad or m",
          dimension: "1 or L",
          explanation:
            "A replacement instrument can differ from this value because of mechanical tolerances or assembly alignment.",
        },
        {
          id: "offset",
          symbol: "\\Delta q_{tool}",
          name: "Stored Tool Calibration Offset",
          color: "crimson",
          role: "Difference between measured and nominal relative positions",
          unit: "rad or m",
          dimension: "1 or L",
          explanation:
            "Claim 17 requires memory storing this offset and coupling that memory to the interface for transmission to the processor.",
        },
      ],
      pedagogicalNote:
        "The equation is a compact engineering reading of claim 17's nominal-versus-measured calibration data. It does not assert a commercial motion scale or tremor-filter specification.",
      claimRef: 17,
      historicalSignificance:
        "Made tool-specific calibration data a claim-level part of a detachable robotic surgical component interface.",
    },
  ];

  catalogue["us-2988237-devol-programmed-transfer"] = [
    {
      id: "devol-code-coincidence",
      patentId: "us-2988237-devol-programmed-transfer",
      title: "Program Code and Encoder Coincidence",
      category: "Source-Bounded Programmed Transfer Control",
      rawLatex: "d_H(c_p,c_s)=0",
      colorizedLatex:
        "\\textcolor{#9333ea}{d_H}(\\textcolor{#0891b2}{c_p},\\textcolor{#059669}{c_s})=\\textcolor{#d97706}{0}",
      plainEnglishSentence: [
        { text: "The program " },
        { text: "code", variableId: "program_code" },
        { text: " and the coupled encoder " },
        { text: "code", variableId: "encoder_code" },
        { text: " reach coincidence when the " },
        { text: "unequal-bit count", variableId: "hamming_distance" },
        { text: " is zero." },
      ],
      variables: [
        {
          id: "program_code",
          symbol: "c_p",
          name: "Selected Program Slot Code",
          color: "cyan",
          role: "Combinational position symbol selected from the program controller",
          unit: "coded position",
          dimension: "[1]",
          explanation:
            "The source stores position-representing symbols in the program controller. This display uses a compact binary teaching code; it does not claim a modern digital storage representation.",
          telemetryKey: "recordedSlot",
        },
        {
          id: "encoder_code",
          symbol: "c_s",
          name: "Mechanically Coupled Encoder Code",
          color: "emerald",
          role: "Code sensed by the position representation that moves with the transfer head",
          unit: "coded position",
          dimension: "[1]",
          explanation:
            "The apparatus couples its sensing head to the transfer head, then compares its code against the selected program code. The source does not provide a general arm-coordinate transform.",
          telemetryKey: "sensedSlot",
        },
        {
          id: "hamming_distance",
          symbol: "d_H",
          name: "Unequal Code Portions",
          color: "amber",
          role: "Modern count of unlike corresponding code channels in the teaching projection",
          unit: "unequal bits",
          dimension: "[1]",
          explanation:
            "This is a modern explanatory notation for the source's individual coincidence detectors. It makes match and mismatch legible without asserting that the grant printed a Hamming-distance equation.",
          telemetryMetricLabel: "Hamming Distance",
        },
      ],
      pedagogicalNote:
        "The equality is a modern logic reading of the grant's coincidence condition. It binds only to discrete source-bounded code state and intentionally carries no fictional distance, speed, force, or timing value.",
      claimRef: 1,
      historicalSignificance:
        "Claim 1 makes the comparison architecture concrete: coupled sensing units, unique position codes, stored symbols, and individually related coincidence detectors.",
    },
    {
      id: "devol-anticipatory-sensing",
      patentId: "us-2988237-devol-programmed-transfer",
      title: "Advance Sensing Before the True Stop",
      category: "Programmed Rate-Control State",
      rawLatex:
        "\\mathrm{advance\\ match}\\rightarrow\\mathrm{slow\\ search}\\rightarrow\\mathrm{true\\ match}",
      colorizedLatex:
        "\\textcolor{#0891b2}{\\mathrm{advance\\ match}}\\rightarrow\\textcolor{#d97706}{\\mathrm{slow\\ search}}\\rightarrow\\textcolor{#059669}{\\mathrm{true\\ match}}",
      plainEnglishSentence: [
        { text: "Claim 8 changes from " },
        { text: "advance sensing", variableId: "advance_sensing" },
        { text: " to " },
        { text: "true-position sensing", variableId: "true_sensing" },
        { text: " after an early match, making the coded " },
        { text: "traversal state", variableId: "traversal_state" },
        { text: " explicit without inventing a braking curve." },
      ],
      variables: [
        {
          id: "advance_sensing",
          symbol: "\\mathrm{advance}",
          name: "Advance-Sensing Relationship",
          color: "cyan",
          role: "The early sensing relationship claimed before the final true-position comparison",
          unit: "control state",
          dimension: "[1]",
          explanation:
            "The grant describes an anticipator that detects approaching coincidence and then returns toward a centered relation for the final comparison. It does not print a physical advance offset.",
          telemetryKey: "anticipationEnabled",
        },
        {
          id: "true_sensing",
          symbol: "\\mathrm{true}",
          name: "True-Position Sensing Relationship",
          color: "emerald",
          role: "The final comparison relationship used to recognize the required programmed position",
          unit: "control state",
          dimension: "[1]",
          explanation:
            "This state is the legal counterpart of the final match. The model represents only its discrete sequence and expressly refuses unprovided rate or stopping-distance computation.",
        },
        {
          id: "traversal_state",
          symbol: "s",
          name: "Coded Traversal State",
          color: "amber",
          role: "Seeking, progressive rate reduction as corresponding channels agree, or true-position hold",
          unit: "coded control",
          dimension: "[1]",
          explanation:
            "The named states communicate the source's causal sequence. They are not measurements of actuator velocity, acceleration, fluid flow, or impact.",
          telemetryMetricLabel: "Traversal State",
        },
      ],
      pedagogicalNote:
        "The sequence comes from the anticipator discussion and Claim 8. It is a state diagram, not a numerical deceleration formula.",
      claimRef: 8,
      historicalSignificance:
        "Claim 8 makes an early sensing relation and a true-position sensing relation part of the article-transfer combination.",
    },
  ];

  catalogue["us-4341502-makino-scara"] = [
    {
      id: "makino-four-link-loop-closure",
      patentId: "us-4341502-makino-scara",
      title: "Four-Link Loop Closure and Tool Configuration",
      category: "Source-Bounded Robot Kinematics",
      rawLatex:
        "\\sum_{i=1}^{4}\\mathbf{r}_i=\\mathbf{0},\\qquad\\mathbf{p}_{tool}=f(\\theta_1,\\theta_2;\\mathcal{T})",
      colorizedLatex:
        "\\sum_{i=1}^{4}\\textcolor{#059669}{\\mathbf{r}_i}=\\mathbf{0},\\qquad\\textcolor{#9333ea}{\\mathbf{p}_{tool}}=f(\\textcolor{#0891b2}{\\theta_1},\\textcolor{#d97706}{\\theta_2};\\textcolor{#0d9488}{\\mathcal{T}})",
      plainEnglishSentence: [
        { text: "A closed four-link chain returns to its start; the normalized " },
        { text: "tool configuration", variableId: "tool_position" },
        { text: " follows the two driven source angles " },
        { text: "θ₁", variableId: "theta_one" },
        { text: " and " },
        { text: "θ₂", variableId: "theta_two" },
        { text: " under the selected claim " },
        { text: "topology", variableId: "topology" },
        { text: "." },
      ],
      variables: [
        {
          id: "tool_position",
          symbol: "\\mathbf{p}_{tool}",
          name: "Assembly-Tool Configuration",
          color: "amethyst",
          role: "Display-only normalized position of the tool joint opposite the base drives",
          unit: "normalized exhibit coordinate",
          dimension: "[1]",
          explanation:
            "The patent names the tool and linkage but prints no link lengths, so this coordinate is intentionally not represented as metres or a physical reach claim.",
          telemetryMetricLabel: "Tool Projection",
        },
        {
          id: "theta_one",
          symbol: "\\theta_1",
          name: "First-Link Drive Angle",
          color: "cyan",
          role: "Angle of the first link driven by the first base motor in the source drawing",
          unit: "degrees",
          dimension: "[1]",
          explanation:
            "Figure 2 identifies θ1 as a rotating angle determined by the first motor; the slider controls a configuration, not a historical operating schedule.",
          telemetryKey: "firstLinkAngleDeg",
        },
        {
          id: "theta_two",
          symbol: "\\theta_2",
          name: "Fourth-Link Drive Angle",
          color: "amber",
          role: "Angle of the fourth link driven by the second base motor in the source drawing",
          unit: "degrees",
          dimension: "[1]",
          explanation:
            "Figure 2 identifies θ2 as the second motor-determined configuration angle; no source controller gain, acceleration, or velocity is inferred.",
          telemetryKey: "fourthLinkAngleDeg",
        },
        {
          id: "topology",
          symbol: "\\mathcal{T}",
          name: "Claim Topology Form",
          color: "teal",
          role: "Concentric, nonconcentric, or Y-shaped claimed linkage construction",
          unit: "claim form",
          dimension: "[1]",
          explanation:
            "The selector maps only to independent claims 1, 3, and 6, keeping the visual tied to the alternative linkage structures actually printed in the grant.",
          telemetryKey: "topologyVariant",
        },
      ],
      pedagogicalNote:
        "This is a topological kinematics relation, not an SI performance equation. US 4,341,502 supplies the closed-chain mechanism and source-named angles, but no numerical geometry, payload, torque, stiffness, clearance, or servo law.",
      claimRef: 1,
      historicalSignificance:
        "Makes the legal core visible: the patent claims specific four-link and Y-link arrangements, not the broad abstract idea of a factory robot arm.",
    },
    {
      id: "makino-independent-tool-attitude",
      patentId: "us-4341502-makino-scara",
      title: "Independent Tool-Attitude Coordinate",
      category: "Belt-Driven Assembly-Tool Orientation",
      rawLatex: "q=[\\theta_1,\\theta_2,\\phi]^T",
      colorizedLatex:
        "q=[\\textcolor{#0891b2}{\\theta_1},\\textcolor{#d97706}{\\theta_2},\\textcolor{#059669}{\\phi}]^T",
      plainEnglishSentence: [
        { text: "The two base angles form planar configuration, while a separate " },
        { text: "tool-attitude coordinate", variableId: "tool_attitude" },
        { text: " represents the third motor and belt arrangement of claims 2 and 5." },
      ],
      variables: [
        {
          id: "tool_attitude",
          symbol: "\\phi",
          name: "Tool Attitude",
          color: "emerald",
          role: "Assembly-tool rotational coordinate transmitted by the source-described third motor and belt devices",
          unit: "degrees",
          dimension: "[1]",
          explanation:
            "The patent says the third motor can rotate the assembly tool independently of horizontal position. It does not print the belt ratio, angle range, or motor performance.",
          telemetryKey: "toolAttitudeDeg",
        },
      ],
      pedagogicalNote:
        "The vector names coordinates rather than simulating an unprinted control law. It separates the position-setting links from the source's optional belt-driven tool rotation.",
      claimRef: 2,
      historicalSignificance:
        "Claims 2 and 5 make independent orientation a concrete linkage-and-belt combination rather than a vague promise of robot dexterity.",
    },
  ];

  catalogue["us-4765668-robot-end-effector"] = [
    {
      id: "robot-end-effector-symmetric-gap",
      patentId: "us-4765668-robot-end-effector",
      title: "Opposed-Thread Screw Gap and Fixed Midpoint",
      category: "Source-Bounded End-Effector Kinematics",
      rawLatex: "g=\\ell\\theta/\\pi,\\qquad x_L=+g/2,\\quad x_R=-g/2,\\quad m=(x_L+x_R)/2=0",
      colorizedLatex:
        "\\textcolor{#9333ea}{g}=\\textcolor{#059669}{\\ell}\\textcolor{#0891b2}{\\theta}/\\pi,\\qquad\\textcolor{#0891b2}{x_L}=+\\textcolor{#9333ea}{g}/2,\\quad\\textcolor{#d97706}{x_R}=-\\textcolor{#9333ea}{g}/2,\\quad\\textcolor{#0d9488}{m}=0",
      plainEnglishSentence: [
        { text: "The live " },
        { text: "jaw gap", variableId: "jaw_gap" },
        { text: " follows the disclosed " },
        { text: "screw lead", variableId: "screw_lead" },
        {
          text: " and screw rotation; left and right hands move equally in opposite directions so the ideal ",
        },
        { text: "midpoint", variableId: "midpoint" },
        { text: " stays fixed." },
      ],
      variables: [
        {
          id: "jaw_gap",
          symbol: "g",
          name: "Jaw Opening",
          color: "amethyst",
          role: "Distance between the opposed fingers in the source-bounded teaching model",
          unit: "mm",
          dimension: "[L]",
          explanation:
            "The preferred embodiment says a jaw opening can typically be 6 inches. The control scales that printed 0.1524 m value; it is not an unqualified capability of every claimed gripper.",
          telemetryMetricLabel: "Jaw Opening",
        },
        {
          id: "screw_lead",
          symbol: "\\ell",
          name: "Ball-Screw Lead",
          color: "emerald",
          role: "Linear travel per screw revolution in the disclosed prototype",
          unit: "m/rev",
          dimension: "[L]",
          explanation:
            "The source prints a 5 mm left/right-hand thread lead in the prototype. It supplies the kinematic conversion only, not backlash, stiffness, or a complete motion controller.",
        },
        {
          id: "midpoint",
          symbol: "m",
          name: "Ideal Gripping Midpoint",
          color: "teal",
          role: "Mean of the equal-and-opposite hand displacements",
          unit: "m",
          dimension: "[L]",
          explanation:
            "The equation explains the source's repeatable center point in ideal kinematics. Real backlash, compliance, and contact loading are not modeled from the grant's incomplete dimensional data.",
        },
      ],
      pedagogicalNote:
        "This is a direct kinematic reading of the printed 5 mm opposed-thread prototype. It intentionally does not treat the reported force or repeatability as a derived contact, payload, stiffness, or pneumatic calculation.",
      claimRef: 1,
      historicalSignificance:
        "Claim 1 makes symmetric hand motion around a screw midpoint and removable fingers the legal core of the gripper combination.",
    },
    {
      id: "robot-end-effector-eight-peg-encoder",
      patentId: "us-4765668-robot-end-effector",
      title: "Eight-Peg Gear Encoder Quantization",
      category: "Source-Bounded Rotation Sensing",
      rawLatex: "\\Delta\\theta_m=2\\pi/8,\\qquad n=8N_m",
      colorizedLatex:
        "\\textcolor{#d97706}{\\Delta\\theta_m}=2\\pi/\\textcolor{#0891b2}{8},\\qquad\\textcolor{#9333ea}{n}=\\textcolor{#0891b2}{8}\\textcolor{#059669}{N_m}",
      plainEnglishSentence: [
        { text: "Eight source-described pegs make the " },
        { text: "motor-gear encoder phase", variableId: "encoder_phase" },
        {
          text: " advance in eighth-turn events; this indicates gear rotation without claiming that it alone created the printed ",
        },
        { text: "repeatability", variableId: "repeatability" },
        { text: "." },
      ],
      variables: [
        {
          id: "encoder_phase",
          symbol: "n\\bmod 8",
          name: "Encoder Peg Phase",
          color: "sapphire",
          role: "Continuous teaching phase of the eight pegs mounted on the motor spur gear",
          unit: "of 8 pegs",
          dimension: "[1]",
          explanation:
            "The specification says the inductive switch senses eight pressed-in pegs to provide an 8-count encoder. It does not state interpolation, controller bandwidth, or a complete feedback chain.",
          telemetryMetricLabel: "Encoder Phase",
        },
        {
          id: "repeatability",
          symbol: "\\delta_r",
          name: "Reported System Repeatability",
          color: "amethyst",
          role: "Source-reported variation over the grip-force range for one design",
          unit: "mm",
          dimension: "[L]",
          explanation:
            "The grant reports no more than 0.05 mm (0.002 in.) over the range of grip forces. It does not assign that result to one sensor, or give test conditions sufficient to derive it.",
          telemetryMetricLabel: "Reported Repeatability",
        },
      ],
      pedagogicalNote:
        "The relation renders the source's eight-pulse encoder count, not a modern high-resolution servo. The reported repeatability remains a printed result rather than an inferred consequence of peg count.",
      claimRef: 8,
      historicalSignificance:
        "Claim 8 brings a spur-gear rotation signal into the mechanically driven end-effector combination.",
    },
  ];

  // The legacy catalogue block above described a generic modern Otto cycle and
  // attached it to the wrong printed claim. This active set follows the reviewed
  // US 194,047 edition: Claim 1 owns the graded charge and Claim 3 owns the
  // four-stroke sequence. Numerical pressure and power remain source-refused.
  catalogue["us-194047-otto-engine"] = [
    {
      id: "otto-graded-charge",
      patentId: "us-194047-otto-engine",
      title: "Claim 1 Spatial Charge Gradient",
      category: "Combustion & Charge Preparation",
      rawLatex: "\\phi(0)>\\phi(x)>\\phi(L),\\qquad \\frac{d\\phi}{dx}<0",
      colorizedLatex:
        "\\textcolor{#059669}{\\phi(0)}>\\textcolor{#2563eb}{\\phi(x)}>\\textcolor{#9333ea}{\\phi(L)},\\qquad \\textcolor{#d97706}{\\frac{d\\phi}{dx}}<0",
      plainEnglishSentence: [
        { text: "The " },
        { text: "combustible-mixture concentration", variableId: "mixture_fraction" },
        { text: " is greatest beside the " },
        { text: "ignition point", variableId: "ignition_end" },
        { text: " and becomes progressively smaller through the separate air charge toward the " },
        { text: "forward end", variableId: "forward_end" },
        { text: "." },
      ],
      variables: [
        {
          id: "mixture_fraction",
          symbol: "\\phi(x)",
          name: "Local Combustible-Mixture Concentration",
          color: "sapphire",
          role: "Qualitative concentration along the compressed cylinder charge",
          unit: "Source gives no numerical fraction",
          dimension: "[1]",
          explanation:
            "Otto describes particle spacing and ordering qualitatively; the model must not invent a stoichiometric profile.",
        },
        {
          id: "ignition_end",
          symbol: "x=0",
          name: "Ignition End",
          color: "emerald",
          role: "Cylinder end where combustible particles are described as close together",
          unit: "Display coordinate",
          dimension: "[L]",
          explanation: "This is the high-concentration end of the source-described ordering.",
        },
        {
          id: "forward_end",
          symbol: "x=L",
          name: "Forward Charge End",
          color: "amethyst",
          role: "Direction in which combustible particles become increasingly dispersed",
          unit: "Display coordinate",
          dimension: "[L]",
          explanation:
            "The patent connects this increasing dispersion to gradual heat development and pressure rise without printing either rate.",
        },
      ],
      pedagogicalNote:
        "This is a qualitative source topology, not a calibrated mixture field. Claim 1 requires the ordering and its gradual-combustion purpose; pressure, flame speed, and efficiency are not numerically reconstructed.",
      claimRef: 1,
      historicalSignificance:
        "It keeps the legal center of US 194,047 on the deliberately graded charge instead of mislabeling Claim 1 as a generic four-stroke monopoly.",
    },
    {
      id: "otto-four-stroke-shaft-timing",
      patentId: "us-194047-otto-engine",
      title: "Claim 3 Four-Stroke Sequence & Source Shaft Ratio",
      category: "Mechanism Kinematics",
      rawLatex:
        "\\theta_K=\\frac{1}{2}\\theta_I,\\qquad 4\\;\\text{strokes}=2\\;\\text{crank revolutions}",
      colorizedLatex:
        "\\textcolor{#059669}{\\theta_K}=\\frac{1}{2}\\textcolor{#2563eb}{\\theta_I},\\qquad \\textcolor{#d97706}{4\\;\\text{strokes}}=\\textcolor{#9333ea}{2\\;\\text{crank revolutions}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "counter-shaft", variableId: "counter_shaft" },
        { text: " makes one revolution while the " },
        { text: "engine shaft", variableId: "engine_shaft" },
        { text: " makes two, coordinating " },
        { text: "four piston strokes", variableId: "stroke_sequence" },
        { text: "." },
      ],
      variables: [
        {
          id: "counter_shaft",
          symbol: "\\theta_K",
          name: "Counter-Shaft K Angle",
          color: "emerald",
          role: "Source-named shaft carrying the slide crank and valve cams",
          unit: "Radians",
          dimension: "[1]",
          explanation: "The procedural model derives this coordinate at exactly half crank angle.",
        },
        {
          id: "engine_shaft",
          symbol: "\\theta_I",
          name: "Engine-Shaft I Angle",
          color: "sapphire",
          role: "Single independent crank coordinate that drives the connected mechanism",
          unit: "Radians",
          dimension: "[1]",
          explanation:
            "The displayed RPM is a declared presentation input because the grant prints no operating speed.",
          telemetryKey: "engineRpm",
        },
        {
          id: "stroke_sequence",
          symbol: "4\\;\\text{strokes}",
          name: "Complete Operating Sequence",
          color: "amber",
          role: "Admission, compression, working expansion, and exhaust",
          unit: "Four piston strokes",
          dimension: "[1]",
          explanation:
            "Claim 3 combines this sequence with the separately introduced air and combustible charges.",
        },
      ],
      pedagogicalNote:
        "The one-to-two shaft ratio is source-fixed and is shared by the 2D and 3D poses. It does not imply a historical RPM, torque, pressure, or power value.",
      claimRef: 3,
      historicalSignificance:
        "This separates the source's actual four-stroke machinery from later ideal-cycle performance equations that require unprinted dimensions and operating data.",
    },
  ];

  catalogue["us-6594844-roomba"] = [
    {
      id: "roomba-finite-optical-region",
      patentId: "us-6594844-roomba",
      title: "Finite Emitter / Detector Intersection & Redirect Condition",
      category: "Optical Obstacle Detection",
      rawLatex:
        "\\mathcal{R}=\\Omega_{e}\\cap\\Omega_{d},\\qquad u_{redirect}=\\mathbf{1}[\\mathcal{S}\\cap\\mathcal{R}=\\varnothing]",
      colorizedLatex:
        "\\textcolor{#059669}{\\mathcal{R}}=\\textcolor{#2563eb}{\\Omega_e}\\cap\\textcolor{#9333ea}{\\Omega_d},\\qquad \\textcolor{#ef4444}{u_{redirect}}=\\mathbf{1}[\\textcolor{#d97706}{\\mathcal{S}}\\cap\\textcolor{#059669}{\\mathcal{R}}=\\varnothing]",
      plainEnglishSentence: [
        { text: "The finite " },
        { text: "test region", variableId: "test_region" },
        { text: " is where the directed " },
        { text: "emitter field", variableId: "emitter_field" },
        { text: " overlaps the " },
        { text: "detector field", variableId: "detector_field" },
        { text: "; the circuit commands a " },
        { text: "redirect", variableId: "redirect" },
        { text: " when the expected " },
        { text: "surface", variableId: "surface" },
        { text: " does not occupy that region." },
      ],
      variables: [
        {
          id: "test_region",
          symbol: "\\mathcal{R}",
          name: "Finite Optical Test Region",
          color: "emerald",
          role: "Geometric intersection of the emitter and detector fields",
          unit: "Region",
          dimension: "L^3",
          explanation:
            "The claim makes this finite overlap region the place where the circuit tests for the expected floor, wall, or obstacle surface.",
        },
        {
          id: "emitter_field",
          symbol: "\\Omega_e",
          name: "Directed Emission Field",
          color: "sapphire",
          role: "Photon field projected from the chassis-mounted emitter",
          unit: "Region",
          dimension: "L^3",
          explanation:
            "The 2D and 3D instruments begin this field at the visible emitter aperture rather than drawing an untethered beam.",
        },
        {
          id: "detector_field",
          symbol: "\\Omega_d",
          name: "Detector Field of View",
          color: "amethyst",
          role: "Directed region observed by the chassis-mounted photon detector",
          unit: "Region",
          dimension: "L^3",
          explanation:
            "The detector field is modeled as a second attached ray that intersects the emitter field at the finite test region.",
        },
        {
          id: "surface",
          symbol: "\\mathcal{S}",
          name: "Expected Surface",
          color: "amber",
          role: "Floor, wall, or obstacle surface tested inside the overlap region",
          unit: "Surface",
          dimension: "L^2",
          explanation:
            "Presence or absence of this surface changes the detector response; no map or coverage estimate is required by the claim.",
        },
        {
          id: "redirect",
          symbol: "u_{redirect}",
          name: "Redirect Command",
          color: "crimson",
          role: "Circuit output that redirects the robot when the expected surface is absent",
          unit: "Boolean",
          dimension: "1",
          explanation:
            "The indicator expresses the claim's logical condition only. The contextual kernel owns the subsequent differential-drive turn rate.",
        },
      ],
      pedagogicalNote:
        "US 6,594,844 claims the optical geometry and its redirect circuit. The surrounding room path is useful context but is not presented as a patented global-coverage law.",
      claimRef: 1,
      historicalSignificance:
        "The grant makes a low-cost finite optical intersection do the obstacle discrimination that more elaborate ranging hardware would otherwise perform.",
    },
  ];

  catalogue["us-7479949-multitouch"] = [
    {
      id: "multitouch-pinch-zoom-scale",
      patentId: "us-7479949-multitouch",
      title: "Pinch-to-Zoom Dynamic Euclidean Affine Scaling Factor",
      category: "Human-Computer Interaction & Touch Screen Heuristics",
      rawLatex:
        "S(t) = \\frac{\\|\\mathbf{p}_2(t) - \\mathbf{p}_1(t)\\|}{\\|\\mathbf{p}_2(0) - \\mathbf{p}_1(0)\\|}",
      colorizedLatex:
        "\\textcolor{#059669}{S(t)} = \\frac{\\textcolor{#ef4444}{\\|\\mathbf{p}_2(t) - \\mathbf{p}_1(t)\\|}}{\\textcolor{#2563eb}{\\|\\mathbf{p}_2(0) - \\mathbf{p}_1(0)\\|}}",
      plainEnglishSentence: [
        { text: "The real-time " },
        { text: "affine zoom magnification scale", variableId: "zoom_scale" },
        { text: " is the ratio of instantaneous " },
        { text: "current dual-finger separation distance", variableId: "current_dist" },
        { text: " to the " },
        { text: "initial touch contact distance", variableId: "initial_dist" },
        { text: "." },
      ],
      variables: [
        {
          id: "zoom_scale",
          symbol: "S(t)",
          name: "Affine Magnification Scale Factor",
          color: "emerald",
          role: "Multiplicative scaling factor applied to the graphical rendering matrix of the displayed document",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Continuous updates at 60 Hz produce smooth, direct-manipulation zooming of web pages, photos, and maps.",
        },
        {
          id: "current_dist",
          symbol: "\\|\\mathbf{p}_2(t) - \\mathbf{p}_1(t)\\|",
          name: "Current Inter-Touch Euclidean Distance",
          color: "crimson",
          role: "Geometric separation distance between two concurrent capacitive contact centroids at time t",
          unit: "m",
          dimension: "L",
          explanation:
            "Calculated from mutual capacitance sensor grid scans using √((x2-x1)² + (y2-y1)²).",
        },
        {
          id: "initial_dist",
          symbol: "\\|\\mathbf{p}_2(0) - \\mathbf{p}_1(0)\\|",
          name: "Initial Gesture Contact Distance",
          color: "sapphire",
          role: "Distance between contact points when the two-finger gesture was first recognized",
          unit: "m",
          dimension: "L",
          explanation:
            "Acts as the baseline reference scale for calculating pinch contraction or spread dilation.",
        },
      ],
      pedagogicalNote:
        "By eliminating modal zoom buttons and replacing them with continuous direct-finger affine scaling, multi-touch made interaction feel physical and elastic.",
      claimRef: 1,
      historicalSignificance:
        "Defined the smartphone user interface revolution that established the iPhone and modern mobile computing.",
    },
  ];

  catalogue["us-3353115-maiman-ruby-laser"] = [
    {
      id: "maiman-three-level-inversion-threshold",
      patentId: "us-3353115-maiman-ruby-laser",
      title: "Three-Level Atomic Population Inversion & Cavity Lasing Threshold",
      category: "Quantum Electronics & Solid-State Laser Physics",
      pedagogicalNote:
        "Because the terminal laser level is the ground state, more than half of all chromium ions must be pumped into the metastable state before stimulated emission overcomes resonant ground-state absorption.",
      rawLatex:
        "\\Delta N_{\\text{th}} = N_2 - N_1 = \\frac{\\gamma_{\\text{cav}}}{\\sigma_{21}} = \\frac{1}{\\sigma_{21} L} \\left[ \\alpha L + \\frac{1}{2} \\ln\\left(\\frac{1}{R_1 R_2}\\right) \\right]",
      colorizedLatex:
        "\\textcolor{#059669}{\\Delta N_{\\text{th}}} = \\textcolor{#2563eb}{N_2} - \\textcolor{#dc2626}{N_1} = \\frac{\\textcolor{#9333ea}{\\gamma_{\\text{cav}}}}{\\textcolor{#d97706}{\\sigma_{21}}} = \\frac{1}{\\textcolor{#d97706}{\\sigma_{21}} \\textcolor{#16a34a}{L}} \\left[ \\textcolor{#6b7280}{\\alpha} \\textcolor{#16a34a}{L} + \\frac{1}{2} \\ln\\left(\\frac{1}{\\textcolor{#ea580c}{R_1} \\textcolor{#0d9488}{R_2}}\\right) \\right]",
      plainEnglishSentence: [
        { text: "The " },
        { text: "threshold population inversion", variableId: "delta_n_th" },
        { text: " is the excess of " },
        { text: "metastable excited ions", variableId: "n2_excited" },
        { text: " over " },
        { text: "ground state ions", variableId: "n1_ground" },
        { text: ", balancing total " },
        { text: "cavity loss rate", variableId: "gamma_cav" },
        { text: " against the " },
        { text: "stimulated emission cross-section", variableId: "sigma_21" },
        { text: " over " },
        { text: "crystal rod length", variableId: "rod_length" },
        { text: " with internal " },
        { text: "crystal loss", variableId: "alpha_loss" },
        { text: " and mirror reflectivities " },
        { text: "high reflector", variableId: "r1_refl" },
        { text: " and " },
        { text: "output coupler", variableId: "r2_refl" },
        { text: "." },
      ],
      variables: [
        {
          id: "delta_n_th",
          symbol: "\\Delta N_{\\text{th}}",
          name: "Threshold Population Inversion Density",
          color: "emerald",
          role: "Minimum net inversion density (N2 - N1) required to initiate self-sustaining laser oscillation (ions/cm^3)",
          unit: "ions/cm^3",
          dimension: "L^-3",
          explanation:
            "For ruby at room temperature, ΔN_th ≈ 10^17 ions/cm^3, requiring N2 > 0.505 N_total.",
          telemetryMetricLabel: "Population Inversion",
        },
        {
          id: "n2_excited",
          symbol: "N_2",
          name: "Metastable 2E Level Population",
          color: "sapphire",
          role: "Volumetric density of trivalent chromium ions in the long-lived 2E upper laser level",
          unit: "ions/cm^3",
          dimension: "L^-3",
          explanation:
            "Populated by rapid non-radiative decay from the broadband green/violet pump bands.",
        },
        {
          id: "n1_ground",
          symbol: "N_1",
          name: "Ground State 4A2 Population",
          color: "crimson",
          role: "Density of unexcited chromium ions remaining in the ground state",
          unit: "ions/cm^3",
          dimension: "L^-3",
          explanation:
            "Must be depleted below 50% of the total ion concentration to overcome self-absorption.",
        },
        {
          id: "gamma_cav",
          symbol: "\\gamma_{\\text{cav}}",
          name: "Total Cavity Loss Coefficient",
          color: "amethyst",
          role: "Combined round-trip optical loss per unit length from internal scattering and mirror transmission",
          unit: "cm^-1",
          dimension: "L^-1",
          explanation:
            "Represents the rate at which photons escape or are absorbed within the Fabry-Pérot cavity.",
        },
        {
          id: "sigma_21",
          symbol: "\\sigma_{21}",
          name: "Stimulated Emission Cross-Section",
          color: "amber",
          role: "Quantum cross-section for 694.3 nm stimulated emission of the Cr3+ R1 transition line ($2.5 \\times 10^{-20}\\text{ cm}^2$ at 300 K)",
          unit: "cm^2",
          dimension: "L^2",
          explanation:
            "Determines the optical gain per unit excited ion density along the crystal axis.",
        },
        {
          id: "rod_length",
          symbol: "L",
          name: "Ruby Rod Physical Length",
          color: "emerald",
          role: "Length of the cylindrical gain crystal along the optical resonator axis (cm)",
          unit: "cm",
          dimension: "L",
          explanation:
            "Longer rods provide higher single-pass optical gain ($G = e^{\\sigma \\Delta N L}$).",
        },
        {
          id: "alpha_loss",
          symbol: "\\alpha",
          name: "Internal Crystal Scattering Loss",
          color: "cyan",
          role: "Residual linear optical scattering and absorption coefficient of the corundum crystal matrix ($0.02\\text{--}0.04\\text{ cm}^{-1}$)",
          unit: "cm^-1",
          dimension: "L^-1",
          explanation:
            "Caused by microscopic lattice defects, lineage boundaries, and non-resonant absorption.",
        },
        {
          id: "r1_refl",
          symbol: "R_1",
          name: "High-Reflector End Mirror Reflectivity",
          color: "coral",
          role: "Power reflectance of the opaque silver or dielectric rear cavity reflector ($R_1 \\ge 0.999$)",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Reflects almost 100% of forward-traveling photons back through the gain medium.",
        },
        {
          id: "r2_refl",
          symbol: "R_2",
          name: "Output Coupler Mirror Reflectivity",
          color: "teal",
          role: "Power reflectance of the partially transmitting front extraction mirror ($R_2 \\approx 0.90\\text{--}0.96$)",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Optimized to maximize laser output pulse energy while maintaining intracavity oscillation.",
        },
      ],
    },
    {
      id: "maiman-pulsed-slope-efficiency",
      patentId: "us-3353115-maiman-ruby-laser",
      title: "Pulsed Optical Pumping Slope Efficiency & Output Energy",
      category: "Optically Pumped Solid-State Lasers",
      pedagogicalNote:
        "Above the electrical threshold energy E_th, the output laser pulse energy scales linearly with excess pump energy with slope efficiency eta_slope determined by pump geometry and output coupling.",
      rawLatex:
        "E_{\\text{out}} = \\eta_{\\text{slope}} (E_{\\text{pump}} - E_{\\text{th}}) \\quad \\text{and} \\quad P_{\\text{peak}} = \\frac{E_{\\text{out}}}{\\tau_{\\text{pulse}}}",
      colorizedLatex:
        "\\textcolor{#059669}{E_{\\text{out}}} = \\textcolor{#2563eb}{\\eta_{\\text{slope}}} (\\textcolor{#d97706}{E_{\\text{pump}}} - \\textcolor{#dc2626}{E_{\\text{th}}}) \\quad \\text{and} \\quad \\textcolor{#9333ea}{P_{\\text{peak}}} = \\frac{\\textcolor{#059669}{E_{\\text{out}}}}{\\textcolor{#6b7280}{\\tau_{\\text{pulse}}}}",
      plainEnglishSentence: [
        { text: "The total " },
        { text: "laser output pulse energy", variableId: "e_out" },
        { text: " is determined by the " },
        { text: "slope efficiency", variableId: "eta_slope" },
        { text: " multiplied by excess " },
        { text: "flash pump energy", variableId: "e_pump" },
        { text: " above the " },
        { text: "threshold energy", variableId: "e_th" },
        { text: ", yielding a instantaneous " },
        { text: "peak optical power", variableId: "p_peak" },
        { text: " over the " },
        { text: "laser pulse duration", variableId: "tau_pulse" },
        { text: "." },
      ],
      variables: [
        {
          id: "e_out",
          symbol: "E_{\\text{out}}",
          name: "Laser Output Pulse Energy",
          color: "emerald",
          role: "Total optical energy emitted in a single monochromatic 694.3 nm laser burst (Joules)",
          unit: "J",
          dimension: "M L^2 T^-2",
          explanation: "Typically 0.1 to 5 Joules in normal relaxation oscillation pulsed mode.",
          telemetryMetricLabel: "Laser Pulse Energy",
        },
        {
          id: "eta_slope",
          symbol: "\\eta_{\\text{slope}}",
          name: "Laser Slope Efficiency",
          color: "sapphire",
          role: "Differential optical conversion efficiency above threshold ($~1.0\\text{--}2.5\\%$)",
          unit: "dimensionless",
          dimension: "1",
          explanation:
            "Product of quantum efficiency (~0.75), pump spectral overlap (~0.20), cavity coupling efficiency (~0.60), and quantum defect (0.75).",
        },
        {
          id: "e_pump",
          symbol: "E_{\\text{pump}}",
          name: "Electrical Flash Lamp Pump Energy",
          color: "amber",
          role: "Total electrical energy discharged from the high-voltage capacitor bank into the xenon tube ($1/2 C V^2$, 50 to 500 Joules)",
          unit: "J",
          dimension: "M L^2 T^-2",
          explanation: "Discharged across 1–2 ms into the helical xenon arc lamp.",
        },
        {
          id: "e_th",
          symbol: "E_{\\text{th}}",
          name: "Lasing Threshold Flash Energy",
          color: "crimson",
          role: "Minimum electrical pump energy required to achieve population inversion (typically 80–120 Joules)",
          unit: "J",
          dimension: "M L^2 T^-2",
          explanation: "Below this energy, only spontaneous red fluorescence is emitted.",
        },
        {
          id: "p_peak",
          symbol: "P_{\\text{peak}}",
          name: "Peak Coherent Optical Power",
          color: "amethyst",
          role: "Instantaneous optical power during the relaxation spiking emission burst (kilowatts to megawatts)",
          unit: "kW",
          dimension: "M L^2 T^-3",
          explanation:
            "Concentrates stored quantum energy into microsecond bursts, reaching tens of kilowatts in free-running mode.",
          telemetryMetricLabel: "Peak Optical Power",
        },
        {
          id: "tau_pulse",
          symbol: "\\tau_{\\text{pulse}}",
          name: "Effective Laser Emission Duration",
          color: "teal",
          role: "Duration of the stimulated emission pulse envelope (typically 200 to 500 microseconds)",
          unit: "us",
          dimension: "T",
          explanation:
            "Consists of hundreds of micro-spikes generated by coupled population-photon relaxation oscillations.",
        },
      ],
    },
  ];

  // US 31,128 supplies a connected mechanism and discrete interlocks, but no
  // historical dimensions, load, spring rate, force, timing, stopping distance,
  // or power. These cards deliberately replace the older invented dynamics.
  catalogue["us-31128-otis-elevator"] = [
    {
      id: "otis-claim-one-hook-lock-topology",
      patentId: "us-31128-otis-elevator",
      title: "Claim 1: Platform-Weight Hook Lock",
      category: "Source-Bound Multibody Topology",
      rawLatex: "\\neg G_{\\text{taut}} \\land C_1 \\Rightarrow f \\hookrightarrow C",
      colorizedLatex:
        "\\neg \\textcolor{#2563eb}{G_{\\text{taut}}} \\land \\textcolor{#d97706}{C_1} \\Rightarrow \\textcolor{#059669}{f} \\hookrightarrow \\textcolor{#9333ea}{C}",
      plainEnglishSentence: [
        { text: "When " },
        { text: "lifting rope G is no longer taut", variableId: "rope_g" },
        { text: " and " },
        { text: "Claim 1's hook geometry is present", variableId: "claim_one" },
        { text: ", platform weight turns " },
        { text: "pawls f", variableId: "pawls_f" },
        { text: " into hook-form " },
        { text: "racks C", variableId: "racks_c" },
        { text: " so their geometry resists separation." },
      ],
      variables: [
        {
          id: "rope_g",
          symbol: "G_{\\text{taut}}",
          name: "Lifting Rope G State",
          color: "sapphire",
          role: "Boolean source state: intact/tension-supporting or broken",
          unit: "state",
          dimension: "[1]",
          explanation:
            "The grant describes the consequence of breaking rope G, not its force, elongation, or failure time.",
          telemetryKey: "ropeGIntegrityPct",
        },
        {
          id: "claim_one",
          symbol: "C_1",
          name: "Claim 1 Geometry",
          color: "amber",
          role: "Hook-form pawls and rack teeth arranged to self-lock under platform weight",
          unit: "predicate",
          dimension: "[1]",
          explanation:
            "Turning this constraint off is an explicit counterfactual, not a statement about the historical machine.",
        },
        {
          id: "pawls_f",
          symbol: "f",
          name: "Hook Pawls f",
          color: "emerald",
          role: "Paired pawls carried by platform D through levers E",
          unit: "component",
          dimension: "[1]",
          explanation: "Their inner ends remain linked through E to eye c on safety bar F.",
        },
        {
          id: "racks_c",
          symbol: "C",
          name: "Fixed Hook Racks C",
          color: "amethyst",
          role: "Hook-form teeth fixed along uprights B",
          unit: "component",
          dimension: "[1]",
          explanation:
            "The claimed interlock depends on complementary hook form, not an unsupported tooth angle or spring force.",
        },
      ],
      pedagogicalNote:
        "Claim 1 is a load-directed geometric lock. The visualization therefore reports a discrete satisfied/refused predicate and does not invent quantitative dynamics.",
      claimRef: 1,
      historicalSignificance:
        "This grant expresses the safety as a claimed hook-rack relationship inside a complete powered hoisting apparatus.",
    },
    {
      id: "otis-claim-three-stop-interlock",
      patentId: "us-31128-otis-elevator",
      title: "Claim 3: Simultaneous Belt Idle and Brake Application",
      category: "Source-Bound Control Interlock",
      rawLatex: "\\text{stop}(T,S) \\Rightarrow (O,P) \\to (J,K) \\land Z \\dashv L",
      colorizedLatex:
        "\\textcolor{#d97706}{\\text{stop}(T,S)} \\Rightarrow \\textcolor{#2563eb}{(O,P) \\to (J,K)} \\land \\textcolor{#dc2626}{Z \\dashv L}",
      plainEnglishSentence: [
        { text: "A " },
        { text: "stop command through rope T and shipper S", variableId: "stop_chain" },
        { text: " moves " },
        { text: "belts O and P onto idle pulleys J and K", variableId: "belt_idle" },
        { text: " while applying " },
        { text: "brake shoe Z to working pulley L", variableId: "brake_z" },
        { text: " in the same connected linkage." },
      ],
      variables: [
        {
          id: "stop_chain",
          symbol: "\\text{stop}(T,S)",
          name: "Stop Command Chain",
          color: "amber",
          role: "Hand rope T moves the belt-shipper slide S",
          unit: "state",
          dimension: "[1]",
          explanation: "Stop rope U and branch V act upon the same hand-rope control path.",
          telemetryKey: "stopRopePulled",
        },
        {
          id: "belt_idle",
          symbol: "(O,P) \\to (J,K)",
          name: "Reversing Belts Idled",
          color: "sapphire",
          role: "Straight belt O and crossed belt P leave working pulley L for idle pulleys",
          unit: "topology",
          dimension: "[1]",
          explanation: "O raises and P lowers; the middle shipper state idles both.",
          telemetryKey: "driveCommand",
        },
        {
          id: "brake_z",
          symbol: "Z \\dashv L",
          name: "Brake Shoe Z on Pulley L",
          color: "crimson",
          role: "Mechanical brake applied with the belt shift",
          unit: "state",
          dimension: "[1]",
          explanation:
            "The patent claims simultaneous application, but gives no braking torque or stopping time.",
        },
      ],
      pedagogicalNote:
        "Claim 3 is valuable because one operator action both removes drive and applies the brake. The model preserves that causal linkage rather than animating an isolated brake shoe.",
      claimRef: 3,
      historicalSignificance:
        "The linked shipper-and-brake arrangement makes powered ascent, descent, and stopping parts of one controlled apparatus.",
    },
    {
      id: "otis-claim-four-opposite-counterpoise",
      patentId: "us-31128-otis-elevator",
      title: "Claim 4: Opposite-Wound Counterpoise",
      category: "Source-Bound Kinematic Constraint",
      rawLatex: "dq_R = -dq_D",
      colorizedLatex: "d\\textcolor{#0891b2}{q_R} = -d\\textcolor{#d97706}{q_D}",
      plainEnglishSentence: [
        { text: "Because counterpoise rope Q is attached to the opposite side of drum H, the " },
        { text: "counterpoise coordinate", variableId: "counterpoise_r" },
        { text: " changes opposite the " },
        { text: "platform coordinate", variableId: "platform_d" },
        { text: " without interfering with safety mechanism E-e-f." },
      ],
      variables: [
        {
          id: "counterpoise_r",
          symbol: "q_R",
          name: "Counterpoise R Coordinate",
          color: "cyan",
          role: "Normalized display coordinate of counterpoise R on rope Q",
          unit: "normalized display coordinate",
          dimension: "[1]",
          explanation:
            "Only opposition of motion is asserted; the source does not provide counterweight mass or travel.",
        },
        {
          id: "platform_d",
          symbol: "q_D",
          name: "Platform D Coordinate",
          color: "amber",
          role: "Normalized display coordinate of the guided platform",
          unit: "normalized display coordinate",
          dimension: "[1]",
          explanation:
            "Platform D remains captured between its grooved uprights a and the fixed guide frame.",
        },
      ],
      pedagogicalNote:
        "The relation is kinematic and dimensionless because the grant describes opposite winding but supplies no drum diameter, rope length, or travel dimension.",
      claimRef: 4,
      historicalSignificance:
        "The opposite winding balances platform motion while preserving the separate hook-rack safety path.",
    },
  ];

  // Preserved for archival comparison only. The public Kamen record below intentionally
  // replaces these uncalibrated illustrative dynamics with source-bounded topology cards.
  catalogue["_legacy-unpublished-us-5701965-kamen-transporter"] = [
    {
      id: "kamen-inverted-pendulum-torque",
      patentId: "us-5701965-kamen-transporter",
      title: "Inverted Pendulum Dynamic Equilibrium & Motor Torque",
      category: "Robotics & Dynamic Stabilization",
      rawLatex:
        "\\tau_{\\text{motor}} = K_p \\theta + K_d \\dot{\\theta} + K_v (v_{\\text{cmd}} - v) \\quad \\text{and} \\quad I \\ddot{\\theta} = m g h \\sin\\theta - \\tau_{\\text{motor}}",
      colorizedLatex:
        "\\textcolor{#9333ea}{\\tau_{\\text{motor}}} = \\textcolor{#0891b2}{K_p} \\textcolor{#dc2626}{\\theta} + \\textcolor{#059669}{K_d} \\textcolor{#d97706}{\\dot{\\theta}} + \\textcolor{#2563eb}{K_v} (\\textcolor{#ea580c}{v_{\\text{cmd}}} - \\textcolor{#4f46e5}{v}) \\quad \\text{and} \\quad \\textcolor{#7c3aed}{I \\ddot{\\theta}} = \\textcolor{#16a34a}{m g h \\sin\\theta} - \\textcolor{#9333ea}{\\tau_{\\text{motor}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "restoring motor torque", variableId: "motor_torque" },
        { text: " is computed from proportional feedback of " },
        { text: "pitch angle deviation", variableId: "pitch_angle" },
        { text: ", derivative damping of " },
        { text: "pitch rate", variableId: "pitch_rate" },
        { text: ", and velocity error between " },
        { text: "command speed", variableId: "v_cmd" },
        { text: " and " },
        { text: "actual speed", variableId: "v_actual" },
        { text: " to counteract " },
        { text: "gravitational overturning moment", variableId: "grav_moment" },
        { text: "." },
      ],
      variables: [
        {
          id: "motor_torque",
          symbol: "\\tau_{\\text{motor}}",
          name: "Restorative Motor Drive Torque",
          color: "amethyst",
          role: "Net torque delivered by wheel servomotors to ground contact patch",
          unit: "Newton-meters (N·m)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "Drives the wheel axles forward or backward underneath the rider center of gravity to maintain vertical balance.",
        },
        {
          id: "pitch_angle",
          symbol: "\\theta",
          name: "Pitch Tilt Angle",
          color: "rose",
          role: "Angular deviation from vertical gravito-inertial plumbline ($0^\\circ = \\text{vertical}$)",
          unit: "Radians (rad) / Degrees (°)",
          dimension: "[1]",
          explanation: "Measured continuously by solid-state accelerometers and gyroscopes.",
        },
        {
          id: "pitch_rate",
          symbol: "\\dot{\\theta}",
          name: "Pitch Angular Velocity",
          color: "amber",
          role: "Rate of change of pitch angle ($d\\theta / dt$)",
          unit: "Radians per second (rad/s)",
          dimension: "[T^-1]",
          explanation:
            "Supplied by vibrating tuning-fork rate gyroscopes to provide derivative damping against oscillations.",
        },
        {
          id: "grav_moment",
          symbol: "m g h \\sin\\theta",
          name: "Gravitational Overturning Moment",
          color: "emerald",
          role: "Destabilizing torque exerted by gravity when center of mass tilts away from vertical",
          unit: "Newton-meters (N·m)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "Increases with rider payload mass and center of gravity height ($h \\approx 0.90\\text{ m}$).",
        },
        {
          id: "v_cmd",
          symbol: "v_{\\text{cmd}}",
          name: "Commanded Forward Velocity",
          color: "coral",
          role: "Target travel speed commanded by rider body pitch lean",
          unit: "Meters per second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Derived directly from rider pitch lean angle offset ($v_{\\text{cmd}} = K_{\\text{lean}} \\theta$).",
        },
        {
          id: "v_actual",
          symbol: "v",
          name: "Actual Ground Velocity",
          color: "amethyst",
          role: "Measured linear velocity of the transporter over ground",
          unit: "Meters per second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Calculated from wheel optical encoder angular velocities ($v = \\omega r$).",
        },
      ],
      pedagogicalNote:
        "Dean Kamen's human transporter replaces passive static stability (wide 4-wheel wheelbases) with active algorithmic stabilization, modeling the passenger as an inverted pendulum and commanding restorative wheel torque to follow user body lean.",
      claimRef: 1,
      historicalSignificance:
        "US 5,701,965 established the legal foundation for the iBOT mobility system, Segway PT, and modern self-balancing robotics.",
    },
    {
      id: "kamen-cluster-stair-kinematics",
      patentId: "us-5701965-kamen-transporter",
      title: "Planetary Cluster Wheel Stair-Climbing Kinematics",
      category: "Robotics & Dynamic Stabilization",
      rawLatex:
        "H_{\\text{step, max}} \\le 2 R_{\\text{cluster}} \\cos\\left(\\frac{\\pi}{N_{\\text{wheels}}}\\right) \\quad \\text{and} \\quad \\tau_{\\text{cluster}} = m_{\\text{total}} g R_{\\text{cluster}} \\cos\\phi",
      colorizedLatex:
        "\\textcolor{#0891b2}{H_{\\text{step, max}}} \\le 2 \\textcolor{#2563eb}{R_{\\text{cluster}}} \\cos\\left(\\frac{\\pi}{\\textcolor{#d97706}{N_{\\text{wheels}}}}\\right) \\quad \\text{and} \\quad \\textcolor{#9333ea}{\\tau_{\\text{cluster}}} = \\textcolor{#16a34a}{m_{\\text{total}} g} \\textcolor{#2563eb}{R_{\\text{cluster}}} \\cos\\textcolor{#dc2626}{\\phi}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "maximum stair step height", variableId: "step_height" },
        { text: " is determined by the " },
        { text: "cluster pitch radius", variableId: "cluster_radius" },
        { text: " and " },
        { text: "number of planetary wheels", variableId: "wheel_count" },
        { text: ", requiring " },
        { text: "cluster lift torque", variableId: "cluster_torque" },
        { text: " to hoist total vehicle mass over the riser at cluster angle " },
        { text: "phi", variableId: "phi_angle" },
        { text: "." },
      ],
      variables: [
        {
          id: "step_height",
          symbol: "H_{\\text{step, max}}",
          name: "Maximum Climbable Riser Height",
          color: "cyan",
          role: "Vertical step clearance that can be surmounted in one cluster rotation cycle",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation:
            "Geometrically bounded by the planetary cluster diameter ($H \\le 0.22\\text{ m}$).",
        },
        {
          id: "cluster_radius",
          symbol: "R_{\\text{cluster}}",
          name: "Planetary Cluster Arm Radius",
          color: "sapphire",
          role: "Distance from central cluster rotation axis to planetary wheel centers ($0.18\\text{ m}$)",
          unit: "Meters (m)",
          dimension: "[L]",
          explanation:
            "Determines step clearance and torque leverage during weight transfer sequence.",
        },
        {
          id: "wheel_count",
          symbol: "N_{\\text{wheels}}",
          name: "Number of Planetary Wheels per Cluster",
          color: "amber",
          role: "Count of ground-contact wheels arranged symmetrically on each cluster carrier ($N = 2$ or $3$)",
          unit: "integer count",
          dimension: "[1]",
          explanation:
            "A 2-wheel cluster requires $180^\\circ$ rotation per step; a 3-wheel cluster requires $120^\\circ$ rotation.",
        },
        {
          id: "phi_angle",
          symbol: "\\phi",
          name: "Cluster Carrier Angular Position",
          color: "crimson",
          role: "Current rotation angle of the planetary carrier arm relative to horizontal ($0^\\circ = \\text{horizontal}$)",
          unit: "Degrees (°)",
          dimension: "[1]",
          explanation: "Modulates gravitational moment arm during stair-climbing rotation cycle.",
        },
        {
          id: "cluster_torque",
          symbol: "\\tau_{\\text{cluster}}",
          name: "Cluster Rotation Motor Torque",
          color: "amethyst",
          role: "Torque applied to rotate cluster carrier about central axle during stair climbing",
          unit: "Newton-meters (N·m)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "Carries total vehicle weight while individual ground wheels drive against step tread.",
        },
      ],
      pedagogicalNote:
        "By rotating planetary multi-wheel cluster arms, the transporter transfers passenger weight smoothly between step edges while maintaining active 2-wheel dynamic balance on the upper tread.",
      claimRef: 16,
      historicalSignificance:
        "Enabled the iBOT mobility system to conquer standard architectural staircases without external ramps or helpers.",
    },
  ];

  catalogue["us-5701965-kamen-transporter"] = [
    {
      id: "kamen-fore-aft-control-topology",
      patentId: "us-5701965-kamen-transporter",
      title: "Claim 1 Fore-Aft Control Topology",
      category: "Source-Bounded Mobility-Control Topology",
      rawLatex:
        "\\mathrm{fore\\! -\\! aft\\ control} = \\mathrm{support} \\land \\mathrm{ground\\! -\\! contacting\\ module} \\land \\mathrm{motorized\\ drive} \\land \\mathrm{control\\ loop}",
      colorizedLatex:
        "\\textcolor{#2563eb}{\\mathrm{fore\\! -\\! aft\\ control}} = \\textcolor{#059669}{\\mathrm{support}} \\land \\textcolor{#0891b2}{\\mathrm{ground\\! -\\! contacting\\ module}} \\land \\textcolor{#d97706}{\\mathrm{motorized\\ drive}} \\land \\textcolor{#9333ea}{\\mathrm{control\\ loop}}",
      plainEnglishSentence: [
        { text: "Claim 1 joins a " },
        { text: "support", variableId: "support" },
        { text: ", " },
        { text: "ground-contacting module", variableId: "ground_contact_module" },
        { text: ", " },
        { text: "motorized drive", variableId: "motorized_drive" },
        { text: ", and a " },
        { text: "fore-aft control loop", variableId: "control_loop" },
        { text: " as one claimed combination." },
      ],
      variables: [
        {
          id: "support",
          symbol: "\\mathrm{support}",
          name: "Subject Support",
          color: "emerald",
          role: "Claim 1 support for the human subject",
          unit: "claim element",
          dimension: "[1]",
          explanation:
            "A structural element in the printed combination, displayed without a mass, height, or center-of-gravity assumption.",
        },
        {
          id: "ground_contact_module",
          symbol: "\\mathrm{ground\\! -\\! contact}",
          name: "Ground-Contacting Module",
          color: "cyan",
          role: "Claim 1 ground-contact relationship",
          unit: "claim element",
          dimension: "[1]",
          explanation:
            "The claim identifies a module coupled to the support arrangement; this card does not assign it a wheel diameter or a geometry.",
        },
        {
          id: "motorized_drive",
          symbol: "\\mathrm{drive}",
          name: "Motorized Drive Arrangement",
          color: "amber",
          role: "Claim 1 locomotion and control-path element",
          unit: "claim element",
          dimension: "[1]",
          explanation:
            "The source identifies a motorized drive arrangement but this public card assigns no torque, power, voltage, speed, or controller parameter.",
        },
        {
          id: "control_loop",
          symbol: "\\mathrm{loop}",
          name: "Fore-Aft Control Loop",
          color: "amethyst",
          role: "Claim 1 fore-aft control relationship",
          unit: "claim element",
          dimension: "[1]",
          explanation:
            "The topological relation makes the claimed loop legible without presenting a gain, a sensor model, or a numerical stability result.",
        },
      ],
      pedagogicalNote:
        "This is a source-topology relation, not an inverted-pendulum equation. It records Claim 1's combination while refusing a public torque, angle, speed, mass, gain, response, or stability-margin calculation.",
      claimRef: 1,
      historicalSignificance:
        "Claim 1 places the support, ground-contacting components, motorized drive, and fore-aft control loop in a single legal combination.",
    },
    {
      id: "kamen-cluster-transfer-climb-topology",
      patentId: "us-5701965-kamen-transporter",
      title: "Claims 21–26 Cluster, Wheel, and Stair-State Topology",
      category: "Source-Bounded Mobility-Control Topology",
      rawLatex:
        "\\mathrm{stair\\ state} = \\mathrm{cluster\\ orientation\\ control} \\land \\mathrm{ground\\! -\\! contact\\ wheel\\ control} \\land \\mathrm{start/transfer/climb}",
      colorizedLatex:
        "\\textcolor{#9333ea}{\\mathrm{stair\\ state}} = \\textcolor{#2563eb}{\\mathrm{cluster\\ orientation\\ control}} \\land \\textcolor{#0891b2}{\\mathrm{ground\\! -\\! contact\\ wheel\\ control}} \\land \\textcolor{#d97706}{\\mathrm{start/transfer/climb}}",
      plainEnglishSentence: [
        { text: "Claims 21 through 26 distinguish " },
        { text: "cluster orientation control", variableId: "cluster_orientation" },
        { text: " from " },
        { text: "ground-contact wheel control", variableId: "wheel_control" },
        { text: " and order a " },
        { text: "start, transfer, and climb sequence", variableId: "stair_sequence" },
        { text: " for the displayed state topology." },
      ],
      variables: [
        {
          id: "cluster_orientation",
          symbol: "\\mathrm{cluster\\ orientation}",
          name: "Cluster Orientation Control",
          color: "sapphire",
          role: "Claim 21 cluster-control relationship",
          unit: "claim element",
          dimension: "[1]",
          explanation:
            "Claim 21 names control of each cluster about a central axis. The adjacent geometry card uses the source's printed dimensions without inventing a gear arrangement.",
        },
        {
          id: "wheel_control",
          symbol: "\\mathrm{wheel\\ control}",
          name: "Ground-Contact Wheel Control",
          color: "cyan",
          role: "Claim 21 wheel-control relationship",
          unit: "claim element",
          dimension: "[1]",
          explanation:
            "The source separates control of wheels in contact with the ground without disclosing a public speed, force, traction, or torque result for this card.",
        },
        {
          id: "stair_sequence",
          symbol: "\\mathrm{start/transfer/climb}",
          name: "Stair-State Sequence",
          color: "amber",
          role: "Claim 26 ordered coordination state",
          unit: "claim sequence",
          dimension: "[1]",
          explanation:
            "Claim 26 prints a start, weight-transfer, and climb ordering. Table 1 supplies nominal stair dimensions, while timing, force, and traversal performance remain undisclosed.",
        },
        {
          id: "balance_mode",
          symbol: "\\mathrm{balance\\ mode}",
          name: "Balance-Mode Relation",
          color: "amethyst",
          role: "Claims 22 and 26 balance-mode condition",
          unit: "claim state",
          dimension: "[1]",
          explanation:
            "The claim names a balance mode for selected steps. The public reader shows that named state without calculating a fall, recovery, or stability boundary.",
        },
      ],
      pedagogicalNote:
        "This claim reading makes the cluster-and-wheel coordination legible. The companion rigid-contact relation uses Table 1 geometry, but assigns no gear train, torque law, friction model, impact response, or modern performance simulation.",
      claimRef: 26,
      historicalSignificance:
        "Claims 21 through 26 separate cluster and wheel control relationships and state the coordination sequence for the stair-use embodiment.",
    },
    {
      id: "kamen-tri-wheel-support-geometry",
      patentId: "us-5701965-kamen-transporter",
      title: "Claim 20 Three-Wheel Carrier & Horizontal Support Gaps",
      category: "Source-Dimensioned Rigid Contact Geometry",
      rawLatex:
        "x_i=x_c+l\\cos(\\phi+2\\pi i/3),\\quad y_i=y_c+l\\sin(\\phi+2\\pi i/3),\\quad g_i=y_i-r-h(x_i)\\ge 0",
      colorizedLatex:
        "\\textcolor{#2563eb}{x_i}=\\textcolor{#059669}{x_c}+\\textcolor{#d97706}{l}\\cos(\\textcolor{#9333ea}{\\phi}+2\\pi i/3),\\quad \\textcolor{#2563eb}{y_i}=\\textcolor{#059669}{y_c}+\\textcolor{#d97706}{l}\\sin(\\textcolor{#9333ea}{\\phi}+2\\pi i/3),\\quad \\textcolor{#dc2626}{g_i}=y_i-\\textcolor{#0891b2}{r}-h(x_i)\\ge 0",
      plainEnglishSentence: [
        { text: "For each of the " },
        { text: "three equal wheel centers", variableId: "wheel_center" },
        { text: ", rotate the printed " },
        { text: "carrier radius", variableId: "cluster_radius" },
        { text: " by 120 degrees about the " },
        { text: "cluster axis", variableId: "cluster_axis" },
        { text: ", then subtract the " },
        { text: "wheel radius", variableId: "wheel_radius" },
        { text: " and local tread height. A valid rigid pose keeps every " },
        { text: "support gap", variableId: "support_gap" },
        { text: " nonnegative and at least one gap at zero." },
      ],
      variables: [
        {
          id: "wheel_center",
          symbol: "(x_i,y_i)",
          name: "Wheel-Center Coordinates",
          color: "sapphire",
          role: "Rigid center of wheel A, B, or C in the patent side-elevation frame",
          unit: "meters (m)",
          dimension: "[L]",
          explanation:
            "The three centers are separated by 120 degrees. The 2D and 3D faces consume the same coordinates from the accepted support receipt.",
        },
        {
          id: "cluster_axis",
          symbol: "(x_c,y_c)",
          name: "Cluster-Axis Position",
          color: "emerald",
          role: "Common carrier axis connected to the chassis and both lateral wheel clusters",
          unit: "meters (m)",
          dimension: "[L]",
          explanation:
            "Figures 39 through 42 determine the discrete teaching pose of this axis relative to the ground and stair treads.",
        },
        {
          id: "cluster_radius",
          symbol: "l",
          name: "Carrier Radius",
          color: "amber",
          role: "Table 1 distance from cluster axis to each wheel center",
          unit: "meters (m)",
          dimension: "[L]",
          explanation: "Table 1 prints l = 5.581 inches, or 0.1417574 meters.",
        },
        {
          id: "wheel_radius",
          symbol: "r",
          name: "Wheel Radius",
          color: "cyan",
          role: "Table 1 outside wheel radius used to locate the rigid rolling surface",
          unit: "meters (m)",
          dimension: "[L]",
          explanation: "Table 1 prints r = 3.81 inches, or 0.096774 meters.",
        },
        {
          id: "support_gap",
          symbol: "g_i",
          name: "Horizontal Support Gap",
          color: "rose",
          role: "Wheel-bottom height above ground or the applicable stair tread",
          unit: "meters (m)",
          dimension: "[L]",
          explanation:
            "A negative value is refused as support penetration. A zero value marks rigid horizontal contact; forces and riser-side contact are outside this boundary.",
        },
      ],
      pedagogicalNote:
        "The source prints r = 3.81 in, l = 5.581 in, adjacent-center distance l′ = 9.667 in, stair rise h = 6.85 in, and tread d = 10.9 in. The relation checks geometric support only; it does not infer normal force, friction, compliance, impact, or motor response.",
      claimRef: 20,
      historicalSignificance:
        "Claim 20 specifies three equal wheels in each cluster, while the later stair-state claims coordinate the carrier and independently controlled ground wheels.",
    },
  ];

  catalogue["us-6302230-kamen-segway"] = [
    {
      id: "kamen-segway-dynamic-balance-margin",
      patentId: "us-6302230-kamen-segway",
      title: "Modern Illustrative Balance Model & Source-Disclosed Margin Relation",
      category: "Robotics & Personal Mechatronics",
      rawLatex:
        "\\tau_{\\text{motor}} = M g L \\sin\\theta + K_v v \\quad \\text{and} \\quad \\text{Margin} = 1 - \\frac{|v|}{v_{\\text{max}}} - \\frac{|\\tau|}{\\tau_{\\text{max}}}",
      colorizedLatex:
        "\\textcolor{#2563eb}{\\tau_{\\text{motor}}} = \\textcolor{#16a34a}{M g L} \\sin\\textcolor{#dc2626}{\\theta} + \\textcolor{#d97706}{K_v v} \\quad \\text{and} \\quad \\textcolor{#0891b2}{\\text{Margin}} = 1 - \\frac{\\textcolor{#9333ea}{|v|}}{\\textcolor{#059669}{v_{\\text{max}}}} - \\frac{\\textcolor{#2563eb}{|\\tau|}}{\\textcolor{#ea580c}{\\tau_{\\text{max}}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "restoring motor torque", variableId: "motor_torque" },
        { text: " balances the " },
        { text: "gravitational overturning moment", variableId: "grav_moment" },
        { text: " generated by " },
        { text: "rider pitch lean", variableId: "pitch_lean" },
        { text: " while preserving a supervisory " },
        { text: "balancing margin", variableId: "margin_ratio" },
        { text: " computed from the difference between " },
        { text: "present velocity", variableId: "current_vel" },
        { text: " and " },
        { text: "maximum operating speed", variableId: "max_vel" },
        { text: "." },
      ],
      variables: [
        {
          id: "motor_torque",
          symbol: "\\tau_{\\text{motor}}",
          name: "Restoring Motor Drive Torque",
          color: "sapphire",
          role: "Modern illustrative net drive torque used to teach wheel acceleration beneath a center of gravity",
          unit: "Newton-meters (N·m)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "A modern illustrative mechanics term. The grant specifies a motorized drive arrangement, not motor topology or torque magnitude.",
        },
        {
          id: "grav_moment",
          symbol: "M g L",
          name: "Gravitational Overturning Coefficient",
          color: "emerald",
          role: "Modern illustrative product of system weight and center-of-mass height",
          unit: "Newton-meters (N·m)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "The modern-model destabilizing moment. The source says the unpowered system is unstable with respect to tipping but prints no mass or geometry.",
        },
        {
          id: "pitch_lean",
          symbol: "\\theta",
          name: "Rider Pitch Lean Angle",
          color: "coral",
          role: "User body lean angle relative to true gravity vertical",
          unit: "Radians (rad) or Degrees (°)",
          dimension: "[1]",
          explanation:
            "A teaching-state variable. The drawings identify pitch and pitch-rate sensing, but the grant does not specify a sensor implementation or measurement accuracy.",
        },
        {
          id: "margin_ratio",
          symbol: "\\text{Margin}",
          name: "Balancing Margin Headroom Ratio",
          color: "cyan",
          role: "Dimensionless ratio characterizing remaining acceleration torque headroom (0.0 to 1.0)",
          unit: "Dimensionless ratio",
          dimension: "[1]",
          explanation:
            "Claim 1 defines margin from maximum and present velocity. This normalized ratio and any threshold are modern illustrative values.",
        },
        {
          id: "current_vel",
          symbol: "v",
          name: "Present Vehicle Velocity",
          color: "amethyst",
          role: "Forward rolling velocity of the transporter",
          unit: "Meters per second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "A modern illustrative state variable rather than a speed performance claim from the grant.",
        },
        {
          id: "max_vel",
          symbol: "v_{\\text{max}}",
          name: "Maximum Allowable Operating Speed",
          color: "emerald",
          role: "Source-named maximum operating velocity represented by a reader-set modern scenario value",
          unit: "Meters per second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "Claim 1 names a maximum operating velocity determined by an acceleration requirement; it does not print a numerical limit or tiltback law.",
        },
      ],
      pedagogicalNote:
        "US 6,302,230 claims a balancing-margin monitor and an alarm, while Claim 2 adds ripple modulation. This equation is a modern illustrative mechanics model; its numerical parameters and control threshold are not asserted to be disclosed by the grant.",
      claimRef: 1,
      historicalSignificance:
        "The claim record identifies a balancing-margin monitor and an alarm in this vehicle combination. This catalogue entry makes no unreviewed assertion about later products or market adoption.",
    },
  ];

  catalogue["us-4098001-watson-remote-center-compliance"] = [
    {
      id: "watson-rcc-remote-center-geometry",
      patentId: "us-4098001-watson-remote-center-compliance",
      title: "Remote-Center Radius Geometry & Small-Rotation Teaching Relation",
      category: "Robotics & Mechanisms",
      rawLatex:
        "\\mathbf{r}_{24},\\mathbf{r}_{26},\\mathbf{r}_{28} \\rightarrow O_{remote}; \\quad \\Delta\\mathbf{x}_{tip} \\approx \\boldsymbol{\\theta} \\times \\mathbf{r}_{tip}",
      colorizedLatex:
        "\\textcolor{#2563eb}{\\mathbf{r}_{24},\\mathbf{r}_{26},\\mathbf{r}_{28}} \\rightarrow \\textcolor{#0891b2}{O_{remote}}; \\quad \\textcolor{#16a34a}{\\Delta\\mathbf{x}_{tip}} \\approx \\textcolor{#d97706}{\\boldsymbol{\\theta}} \\times \\textcolor{#9333ea}{\\mathbf{r}_{tip}}",
      plainEnglishSentence: [
        { text: "The three " },
        { text: "printed radial-element directions", variableId: "radial_vectors" },
        { text: " converge on the " },
        { text: "remote center", variableId: "remote_center" },
        { text: "; for a small illustrative " },
        { text: "rotation", variableId: "rotation" },
        { text: ", the " },
        { text: "tool-tip displacement", variableId: "tip_displacement" },
        { text: " follows from its vector from that center, " },
        { text: "r-tip", variableId: "tip_radius" },
        { text: "." },
      ],
      variables: [
        {
          id: "radial_vectors",
          symbol: "\\mathbf{r}_{24},\\mathbf{r}_{26},\\mathbf{r}_{28}",
          name: "Rotational-Element Radius Directions",
          color: "sapphire",
          role: "Directions of the three numbered elements that the specification places along spherical radii",
          unit: "Direction vectors",
          dimension: "[1]",
          explanation:
            "This is the patent's source geometry. The exhibit visualizes the directions but does not assign unreported lengths or stiffnesses.",
        },
        {
          id: "remote_center",
          symbol: "O_{remote}",
          name: "Remote Center 50",
          color: "cyan",
          role: "Virtual point at, near, or beyond the free end of the operator tool",
          unit: "Geometric point",
          dimension: "[L]",
          explanation:
            "The claimed rotational elements lie along portions of spherical radii emanating from this point.",
          telemetryMetricLabel: "Remote Center",
        },
        {
          id: "tip_displacement",
          symbol: "\\Delta\\mathbf{x}_{tip}",
          name: "Illustrative Tool-Tip Displacement",
          color: "emerald",
          role: "Small-displacement teaching cue for the tool point under a change of orientation",
          unit: "Normalized display displacement",
          dimension: "[L]",
          explanation:
            "The public exhibit keeps this normalized because the grant supplies no dimensions, loads, material properties, or calibrated response.",
          telemetryMetricLabel: "Figure 4 Translation Phase",
        },
        {
          id: "rotation",
          symbol: "\\boldsymbol{\\theta}",
          name: "Small Orientation Change",
          color: "amber",
          role: "Infinitesimal rotation used to explain motion about a virtual point",
          unit: "Radians in the general teaching relation",
          dimension: "[1]",
          explanation:
            "This is a general small-rotation kinematic relation, not a source-backed compliance coefficient or a predicted response rate.",
        },
        {
          id: "tip_radius",
          symbol: "\\mathbf{r}_{tip}",
          name: "Center-to-Tip Vector",
          color: "amethyst",
          role: "Vector from the illustrated virtual center to the point whose motion is being explained",
          unit: "Normalized display length",
          dimension: "[L]",
          explanation:
            "Its displayed length is illustrative; the source locates the remote center relationally but does not prescribe a universal tool length.",
        },
      ],
      pedagogicalNote:
        "The equation separates what the grant actually supplies—the radial elements' convergence on a remote point—from a general small-rotation relation used to explain the geometry. Quantitative force, stiffness, clearance, friction, and success predictions are deliberately refused.",
      claimRef: 1,
      historicalSignificance:
        "US 4,098,001 made a particular passive remote-center and translational-flexure architecture available as a concrete industrial-robotics teaching example.",
    },
  ];
  catalogue["us-4098001-watson-rcc"] = catalogue["us-4098001-watson-remote-center-compliance"].map(
    (eq) => ({
      ...eq,
      patentId: "us-4098001-watson-rcc",
    }),
  );

  catalogue["us-3119501-lemelson-automatic-warehousing"] = [
    {
      id: "lemelson-predetermining-downcount",
      patentId: "us-3119501-lemelson-automatic-warehousing",
      title: "Preset-Count Marker Event Sequence",
      category: "Industrial Automation & Control",
      rawLatex: "c_{next}=c_{now}-1; \\quad c=0 \\Rightarrow \\text{change motor state}",
      colorizedLatex:
        "\\textcolor{#0891b2}{c_{next}}=\\textcolor{#2563eb}{c_{now}}-\\textcolor{#16a34a}{1}; \\quad \\textcolor{#0891b2}{c}=0 \\Rightarrow \\textcolor{#dc2626}{\\text{change motor state}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "remaining count accumulator", variableId: "counter_c" },
        { text: " decrements from the " },
        { text: "preset address count", variableId: "preset_n" },
        { text: " with each " },
        { text: "position-marker event", variableId: "marker_impulse" },
        { text: " until zero changes the " },
        { text: "source-described motor state", variableId: "trip_relay" },
        { text: "." },
      ],
      variables: [
        {
          id: "counter_c",
          symbol: "c",
          name: "Remaining Down-Count",
          color: "cyan",
          role: "State variable of the source-described preset counting relay",
          unit: "Position events",
          dimension: "[1]",
          explanation:
            "The grant describes a counter that uncounts as the scanner sees identifiers, then changes control state at the selected count. It does not state a count frequency or event timing.",
          telemetryMetricLabel: "Addressing State",
        },
        {
          id: "preset_n",
          symbol: "N_{\\text{preset}}",
          name: "Preset Target Address",
          color: "sapphire",
          role: "Selected source-described marker count before motion begins",
          unit: "Position events",
          dimension: "[1]",
          explanation:
            "The source permits local or remote presetting of counters for travel, lift, and transfer. It gives no prescribed bay count, rack dimensions, or mapping to physical distance.",
        },
        {
          id: "marker_impulse",
          symbol: "e_k",
          name: "Position-Marker Event",
          color: "emerald",
          role: "A discrete source-described scanning event associated with a rack or guide marker",
          unit: "Event",
          dimension: "[1]",
          explanation:
            "Claims 1–5 permit marker scanning, including reflective and ambient-light alternatives; Claim 6 describes a limit-switch and protrusion alternative. No sensor rate is supplied.",
        },
        {
          id: "trip_relay",
          symbol: "\\text{state}_{motor}",
          name: "Motor-State Transition",
          color: "crimson",
          role: "Source control change after a preset count has been received",
          unit: "State",
          dimension: "[1]",
          explanation:
            "The specification describes stopping one motion and beginning another in its sequence. It does not provide braking distance, positioning tolerance, velocity, or motor electrical values.",
          telemetryMetricLabel: "Quantitative Performance",
        },
      ],
      pedagogicalNote:
        "The equation is a symbolic reading of the printed preset-count sequence. It intentionally omits numerical warehouse scale, payload, speed, motor, timing, and sensor-performance assumptions absent from the facsimile.",
      claimRef: 1,
      historicalSignificance:
        "The issued claims show a physical warehouse address formed by guide travel, vertical movement, transfer, marker sensing, and a preset count; they do not justify a claim to all later automated storage systems.",
    },
  ];

  catalogue["us-3313014-lemelson-automatic-production"] = [
    {
      id: "lemelson-marker-coupling-release-interlock",
      patentId: "us-3313014-lemelson-automatic-production",
      title: "Marker, Retention, Coupling, and Release Interlock",
      category: "Source-Bounded Industrial Automation",
      rawLatex:
        "m_{recognized}\\land r_{retained}\\land c_{coupled}\\Rightarrow u_{machine};\\quad p_{cycle}\\geq0.8\\Rightarrow u_{release}",
      colorizedLatex:
        "\\textcolor{#f59e0b}{m_{recognized}}\\land\\textcolor{#16a34a}{r_{retained}}\\land\\textcolor{#0891b2}{c_{coupled}}\\Rightarrow\\textcolor{#7c3aed}{u_{machine}};\\quad\\textcolor{#2563eb}{p_{cycle}}\\geq0.8\\Rightarrow\\textcolor{#dc2626}{u_{release}}",
      plainEnglishSentence: [
        { text: "A recognised station " },
        { text: "marker event", variableId: "marker_event" },
        { text: ", retained carrier, and closed " },
        { text: "station coupling", variableId: "station_coupling" },
        { text: " are the source-topology conditions that authorize the displayed " },
        { text: "machine command", variableId: "machine_command" },
        { text: ". At the selected display " },
        { text: "release stage", variableId: "release_stage" },
        { text: ", the sequence releases and departs rather than claiming a measured cycle time." },
      ],
      variables: [
        {
          id: "marker_event",
          symbol: "m_{recognized}",
          name: "Recognised Station Marker",
          color: "amber",
          role: "Claim-linked sensing event that begins the illustrated carrier-to-station sequence",
          unit: "off/on topology state",
          dimension: "[1]",
          explanation:
            "The patent identifies markers, switches, scanners, and relay signals as selection and control events. It provides no sensor precision, latency, or event frequency for a numerical model.",
          telemetryKey: "stationDetected",
        },
        {
          id: "station_coupling",
          symbol: "c_{coupled}",
          name: "Portable-to-Station Controller Coupling",
          color: "cyan",
          role: "Claim 7-style contact/coupling condition between the carrier-mounted controller and a work station",
          unit: "off/on topology state",
          dimension: "[1]",
          explanation:
            "The source describes electrical contacts and alternative coupling arrangements after positioning. The public switch means only the logical connection is present; it does not represent voltage, current, impedance, or signal integrity.",
          telemetryKey: "stationCoupled",
        },
        {
          id: "machine_command",
          symbol: "u_{machine}",
          name: "Authorized Machine Command",
          color: "amethyst",
          role: "Displayed permission for a selected station operation after the named topology conditions hold",
          unit: "source interlock",
          dimension: "[1]",
          explanation:
            "This logical output makes the claim sequence inspectable. It is not a motor-control voltage, a production-rate prediction, or evidence that a particular workpiece operation succeeds.",
          telemetryMetricLabel: "Machine Command",
        },
        {
          id: "release_stage",
          symbol: "p_{cycle}",
          name: "Selected Release-and-Departure Stage",
          color: "sapphire",
          role: "Normalized exhibit cue for the source-described reversal, release, and next-station transition",
          unit: "normalized display state",
          dimension: "[1]",
          explanation:
            "The threshold is a display ordering boundary, not a time, distance, stopping tolerance, or production-cycle measurement supplied by the patent.",
          telemetryKey: "cycleProgress",
        },
      ],
      pedagogicalNote:
        "This is a modern boolean reading of the patent's sequence: sensing leads to positioning and retention, the portable controller couples to the station, then the station may operate; after the cycle, the carrier is released and moves on. The source does not supply an exact Boolean formula, a timing law, or the numbers needed for a performance simulation.",
      historicalSignificance:
        "The issued claims make the carrier, record/controller, sensing event, retaining means, and selected production station legible as one physical control architecture rather than a free-floating automation slogan.",
    },
  ];

  catalogue["us-3858581-kamen-medication-injection-device"] = [
    {
      id: "kamen-rotation-event-count",
      patentId: "us-3858581-kamen-medication-injection-device",
      title: "Lead-Screw Rotation and Pulse-Count Relation (Nonclinical)",
      category: "Mechatronics & Historical Control",
      rawLatex: "N_{pulse}=n_{turns}; \\quad x=n p",
      colorizedLatex:
        "\\textcolor{#0891b2}{N_{pulse}}=\\textcolor{#2563eb}{n_{turns}}; \\quad \\textcolor{#16a34a}{x}=\\textcolor{#2563eb}{n}\\textcolor{#9333ea}{p}",
      plainEnglishSentence: [
        { text: "The source ties a " },
        { text: "pulse count", variableId: "pulse_count" },
        { text: " to lead-screw " },
        { text: "turns", variableId: "turn_count" },
        { text: ", while the screw's symbolic " },
        { text: "pitch", variableId: "pitch" },
        { text: " relates those turns to a displayed follower " },
        { text: "position", variableId: "position" },
        { text: "." },
      ],
      variables: [
        {
          id: "pulse_count",
          symbol: "N_{pulse}",
          name: "Rotation-Event Count",
          color: "cyan",
          role: "Count of striker-triggered electrical events in the Claim 1 mechanism",
          unit: "Events",
          dimension: "[1]",
          explanation:
            "Claim 1 says the radially oriented striker reaches the pulse-emitting switch during each lead-screw rotation. The grant does not give a pulse frequency or a clinical setting.",
          telemetryMetricLabel: "Screw-Turn Counter",
        },
        {
          id: "turn_count",
          symbol: "n_{turns}",
          name: "Lead-Screw Turns",
          color: "sapphire",
          role: "Source-described rotational traverses of the motor-driven screw",
          unit: "Turns",
          dimension: "[1]",
          explanation:
            "The source connects repeated screw turns to repeated striker/switch events, but supplies no rotational speed, motor power, friction value, or precision specification.",
        },
        {
          id: "pitch",
          symbol: "p",
          name: "Uniform Thread Pitch",
          color: "amethyst",
          role: "Constant advance per ideal screw turn in the source description",
          unit: "Unreported",
          dimension: "[L]",
          explanation:
            "The patent calls the threads uniform pitch but does not print a numerical pitch. The museum therefore keeps $p$ symbolic and does not compute a volume, flow, dose, or clinical schedule.",
        },
        {
          id: "position",
          symbol: "x",
          name: "Follower Position",
          color: "emerald",
          role: "Normalized displayed position of the source-described lead-screw follower",
          unit: "Normalized display",
          dimension: "[L]",
          explanation:
            "The interactive exhibit makes the mechanical position relationship visible without converting the 1975 apparatus into a medical-device instruction or prediction.",
          telemetryMetricLabel: "Follower Position",
        },
      ],
      pedagogicalNote:
        "This is a historical kinematic and event-count relation only. The source does not provide any dose, concentration, pressure, patient condition, safe delivery rate, clinical outcome, or medical recommendation.",
      claimRef: 1,
      historicalSignificance:
        "The claim links a familiar mechanical actuator to countable electrical events and motor-state control; its archival value is the mechatronic architecture, not a present-day clinical protocol.",
    },
  ];

  // Withdrawn research equations retained under a non-catalogue key for audit
  // history. The draft assumed exact 45° geometry and undisclosed performance.
  catalogue["_legacy-unpublished-us-4068536-stackhouse-manipulator"] = [
    {
      id: "stackhouse-spherical-orientation",
      patentId: "us-4068536-stackhouse-manipulator",
      title: "3-Roll Intersecting Axis Forward Kinematic Composition",
      category: "Spherical Kinematics",
      rawLatex:
        "\\mathbf{R} = \\mathbf{R}_z(\\theta_1) \\mathbf{R}_y(45^\\circ) \\mathbf{R}_z(\\theta_2) \\mathbf{R}_y(45^\\circ) \\mathbf{R}_z(\\theta_3)",
      colorizedLatex:
        "\\mathbf{R} = \\textcolor{#059669}{\\mathbf{R}_z(\\theta_1)} \\textcolor{#d97706}{\\mathbf{R}_y(45^\\circ)} \\textcolor{#2563eb}{\\mathbf{R}_z(\\theta_2)} \\textcolor{#d97706}{\\mathbf{R}_y(45^\\circ)} \\textcolor{#9333ea}{\\mathbf{R}_z(\\theta_3)}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "total tool orientation matrix", variableId: "total_orientation" },
        { text: " is the sequential product of the " },
        { text: "forearm roll rotation", variableId: "forearm_roll" },
        { text: ", the " },
        { text: "dual 45° oblique joint intersections", variableId: "oblique_tilt" },
        { text: ", the " },
        { text: "intermediate link roll", variableId: "intermediate_roll" },
        { text: ", and the " },
        { text: "terminal tool spin", variableId: "tool_roll" },
        { text: "." },
      ],
      variables: [
        {
          id: "total_orientation",
          symbol: "\\mathbf{R}",
          name: "Total Tool Orientation Matrix",
          color: "amber",
          role: "3x3 special orthogonal matrix SO(3) defining tool attitude relative to forearm base",
          unit: "Dimensionless matrix",
          dimension: "[1]",
          explanation:
            "Relates the local end-effector coordinate system directly to the robot arm forearm.",
        },
        {
          id: "forearm_roll",
          symbol: "\\mathbf{R}_z(\\theta_1)",
          name: "Forearm Roll Rotation",
          color: "emerald",
          role: "Rotation of intermediate housing 28 about forearm longitudinal axis 22 by angle θ₁",
          unit: "Radians (rad)",
          dimension: "[1]",
          explanation: "Sweeps the oblique intermediate roll axis in a 90° conical surface.",
        },
        {
          id: "oblique_tilt",
          symbol: "\\mathbf{R}_y(45^\\circ)",
          name: "45° Oblique Intersecting Joint Angle",
          color: "amber",
          role: "Fixed oblique bevel gear intersection angle canted at exactly α = 45°",
          unit: "Degrees (°)",
          dimension: "[1]",
          explanation:
            "Dual 45° joints add constructively from 0° (collinear) to 90° (perpendicular) pitch bend.",
        },
        {
          id: "intermediate_roll",
          symbol: "\\mathbf{R}_z(\\theta_2)",
          name: "Intermediate Link Roll",
          color: "sapphire",
          role: "Rotation of intermediate shaft 32 within housing 28 by angle θ₂",
          unit: "Radians (rad)",
          dimension: "[1]",
          explanation:
            "Controls the effective pitch deflection angle of the tool flange from 0° to 90°.",
        },
        {
          id: "tool_roll",
          symbol: "\\mathbf{R}_z(\\theta_3)",
          name: "Terminal Tool Spin",
          color: "amethyst",
          role: "Final continuous spin of tool mounting flange 46 about tool axis 44 by angle θ₃",
          unit: "Radians (rad)",
          dimension: "[1]",
          explanation:
            "Provides full continuous rotation for welding torches, paint guns, or milling heads.",
        },
      ],
      pedagogicalNote:
        "Because all three roll axes intersect at a single geometric point, the 3-roll wrist provides pure spherical reorientation without unwanted translation of the tool center point.",
      claimRef: 1,
      historicalSignificance:
        "Stackhouse's 3-roll intersecting formulation eliminated bulky exterior motors and became the industry standard on the Cincinnati Milacron T3 robot.",
    },
    {
      id: "stackhouse-jacobian-determinant",
      patentId: "us-4068536-stackhouse-manipulator",
      title: "Wrist Jacobian Determinant & Singularity Metric",
      category: "Kinematic Dexterity",
      rawLatex:
        "|\\det(\\mathbf{J})| = \\sin(\\alpha_1) \\sin(\\alpha_2) |\\sin(\\theta_2)| = 0.5 |\\sin(\\theta_2)|",
      colorizedLatex:
        "\\textcolor{#059669}{|\\det(\\mathbf{J})|} = \\textcolor{#d97706}{\\sin(\\alpha_1) \\sin(\\alpha_2)} \\textcolor{#2563eb}{|\\sin(\\theta_2)|} = \\textcolor{#9333ea}{0.5 |\\sin(\\theta_2)|}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "wrist Jacobian determinant", variableId: "jacobian_det" },
        { text: " depends on the " },
        { text: "product of oblique joint sines", variableId: "oblique_sines" },
        { text: " and the " },
        { text: "sine of intermediate roll angle", variableId: "intermediate_sine" },
        { text: ", reaching maximum dexterity of " },
        { text: "0.5 at a 90° intermediate bend", variableId: "max_dexterity" },
        { text: "." },
      ],
      variables: [
        {
          id: "jacobian_det",
          symbol: "|\\det(\\mathbf{J})|",
          name: "Jacobian Determinant Magnitude",
          color: "emerald",
          role: "Kinematic dexterity index measuring volume of the velocity ellipsoid",
          unit: "Dimensionless index",
          dimension: "[1]",
          explanation:
            "Measures proximity to kinematic singularities; vanishes only at θ₂ = 0° or 180°.",
        },
        {
          id: "oblique_sines",
          symbol: "\\sin(\\alpha_1) \\sin(\\alpha_2)",
          name: "Oblique Angle Geometric Factor",
          color: "amber",
          role: "Product of joint sine factors: $\\sin(45^\\circ) \\cdot \\sin(45^\\circ) = 0.5$",
          unit: "Ratio",
          dimension: "[1]",
          explanation:
            "Constant geometric scale factor determined by the 45° bevel gear housing angles.",
        },
        {
          id: "intermediate_sine",
          symbol: "|\\sin(\\theta_2)|",
          name: "Intermediate Roll Sine Factor",
          color: "sapphire",
          role: "Modulation factor determined by the intermediate joint rotation θ₂",
          unit: "Dimensionless factor",
          dimension: "[1]",
          explanation:
            "Provides smooth, predictable dexterity across the entire working hemisphere.",
        },
        {
          id: "max_dexterity",
          symbol: "0.5 |\\sin(\\theta_2)|",
          name: "Maximum Wrist Dexterity Index",
          color: "amethyst",
          role: "Peak normalized dexterity value of 0.5 achieved at $\\theta_2 = 90^\\circ$",
          unit: "Peak index",
          dimension: "[1]",
          explanation:
            "At peak dexterity, the wrist generates maximum angular velocity with minimal motor effort.",
        },
      ],
      pedagogicalNote:
        "The 3-roll wrist confines singularities strictly to the outer boundary of the workspace, eliminating internal gimbal lock dead zones that plague conventional roll-pitch-yaw wrists.",
      claimRef: 14,
      historicalSignificance:
        "Enabled high-speed continuous path contouring in automotive manufacturing without controller algorithmic stalls.",
    },
  ];

  catalogue["us-4068536-stackhouse-manipulator"] = [
    {
      id: "stackhouse-source-bounded-axis-composition",
      patentId: "us-4068536-stackhouse-manipulator",
      title: "Selected Intersecting-Axis Display Composition",
      category: "Source-Bounded Mechanism Geometry",
      rawLatex:
        "\\mathbf{R}_{display}=\\mathbf{R}_{z}(q_A)\\,\\mathbf{R}_{y}(\\alpha_{AB})\\,\\mathbf{R}_{z}(q_B)\\,\\mathbf{R}_{y}(-\\alpha_{BC})\\,\\mathbf{R}_{z}(q_C),\\quad \\alpha_{AB},\\alpha_{BC}>45^\\circ",
      colorizedLatex:
        "\\textcolor{#059669}{\\mathbf{R}_{display}}=\\textcolor{#0284c7}{\\mathbf{R}_{z}(q_A)}\\,\\textcolor{#d97706}{\\mathbf{R}_{y}(\\alpha_{AB})}\\,\\textcolor{#2563eb}{\\mathbf{R}_{z}(q_B)}\\,\\textcolor{#d97706}{\\mathbf{R}_{y}(-\\alpha_{BC})}\\,\\textcolor{#9333ea}{\\mathbf{R}_{z}(q_C)},\\quad \\textcolor{#d97706}{\\alpha_{AB},\\alpha_{BC}>45^\\circ}",
      plainEnglishSentence: [
        { text: "The modern teaching " },
        { text: "display orientation", variableId: "display_orientation" },
        { text: " composes the selected rolls about source axes " },
        { text: "A–A′", variableId: "axis_a" },
        { text: ", " },
        { text: "B–B′", variableId: "axis_b" },
        { text: ", and " },
        { text: "C–C′", variableId: "axis_c" },
        { text: " with two selected oblique angles satisfying the printed " },
        { text: ">45° conditions", variableId: "oblique_condition" },
        { text: "." },
      ],
      variables: [
        {
          id: "display_orientation",
          symbol: "\\mathbf{R}_{display}",
          name: "Selected Display Orientation",
          color: "emerald",
          role: "Drawing-space orientation shared by the connected 2D and 3D exhibits",
          unit: "Dimensionless display",
          dimension: "[1]",
          explanation:
            "This is a modern serial-rotation teaching construction, not a motor calibration or equation printed in the grant.",
        },
        {
          id: "axis_a",
          symbol: "\\mathbf{R}_{z}(q_A)",
          name: "Forearm-Axis Roll",
          color: "cyan",
          role: "Selected rotation about the source's forearm axis A–A′",
          unit: "Selected degrees",
          dimension: "[1]",
          explanation:
            "Outer forearm shaft 15 rotates housing 14 about A–A′. No speed or motor-to-joint ratio is inferred.",
        },
        {
          id: "axis_b",
          symbol: "\\mathbf{R}_{z}(q_B)",
          name: "Housing-Shaft Roll",
          color: "sapphire",
          role: "Selected rotation about oblique axis B–B′",
          unit: "Selected degrees",
          dimension: "[1]",
          explanation:
            "Shaft 16 and bevel gears 17/18 rotate housing shaft 14a about B–B′ in the preferred embodiment.",
        },
        {
          id: "axis_c",
          symbol: "\\mathbf{R}_{z}(q_C)",
          name: "Terminal-Shaft Roll",
          color: "amethyst",
          role: "Selected rotation of terminal shaft 26 about C–C′",
          unit: "Selected degrees",
          dimension: "[1]",
          explanation:
            "Shafts 19/20, shaft 23, and bevel gears 21/22 and 24/25 carry the third input to terminal shaft 26.",
        },
        {
          id: "oblique_condition",
          symbol: "\\alpha_{AB},\\alpha_{BC}>45^\\circ",
          name: "Printed Oblique-Angle Conditions",
          color: "amber",
          role: "The only quantitative geometry stated for the illustrated oblique axes",
          unit: "Inequalities",
          dimension: "[1]",
          explanation:
            "The patent says both fixed angles are greater than 45 degrees. It does not print exact values, so the exhibit lets readers choose source-consistent display angles and labels them as selections.",
        },
      ],
      pedagogicalNote:
        "The composition makes the serial topology legible while refusing undisclosed dimensions, gear ratios, hydraulic dynamics, loads, power, precision, Jacobian, and singularity performance. Exact intersection at P is the preferred embodiment; the source also allows small deviations and warns that they create small orientation holes.",
      historicalSignificance:
        "The grant documents a compact remotely driven industrial-robot wrist built from nested shafts, bevel gears, a preferred common orientation point.",
    },
  ];

  catalogue["us-4512709-milacron-robot-toolchanger"] = [
    {
      id: "milacron-admission-and-capture-state",
      patentId: "us-4512709-milacron-robot-toolchanger",
      title: "Admission, Registration, and Claim 4 Capture State",
      category: "Source-Bounded Toolchanger Topology",
      rawLatex:
        "\\mathrm{captured}=\\mathrm{basePresent}\\land\\mathrm{registered}\\land\\mathrm{slideLocked}\\land\\mathrm{TMember}",
      colorizedLatex:
        "\\textcolor{#2563eb}{\\mathrm{captured}}=\\textcolor{#059669}{\\mathrm{basePresent}}\\land\\textcolor{#d97706}{\\mathrm{registered}}\\land\\textcolor{#9333ea}{\\mathrm{slideLocked}}\\land\\textcolor{#dc2626}{\\mathrm{TMember}}",
      plainEnglishSentence: [
        { text: "The exhibit marks the tool as " },
        { text: "captured", variableId: "captured" },
        { text: " only after a " },
        { text: "tool base is present", variableId: "base_present" },
        { text: ", its bushings are " },
        { text: "registered on the locating pair", variableId: "registered" },
        { text: ", the " },
        { text: "locking slide is shifted", variableId: "slide_locked" },
        { text: ", and the Claim 4 " },
        { text: "T-member form is selected", variableId: "t_member" },
        { text: "." },
      ],
      variables: [
        {
          id: "captured",
          symbol: "\\mathrm{captured}",
          name: "Claim 4 Capture State",
          color: "sapphire",
          role: "Boolean source-topology state for the selected T-member/ramp form",
          unit: "true / false",
          dimension: "[1]",
          explanation:
            "This is an authored teaching predicate, not a holding-force, reliability, or performance value.",
          telemetryMetricLabel: "Engagement State",
        },
        {
          id: "base_present",
          symbol: "\\mathrm{basePresent}",
          name: "Common Tool Base Present",
          color: "emerald",
          role: "Whether a source-described common base is at the adapter",
          unit: "true / false",
          dimension: "[1]",
          explanation:
            "The source identifies a common base across tools but does not quantify its mass, dimensions, or approach speed.",
        },
        {
          id: "registered",
          symbol: "\\mathrm{registered}",
          name: "Pin-and-Bushing Registration",
          color: "amber",
          role: "Base seated on the cylindrical and diamond-profile locating pair",
          unit: "true / false",
          dimension: "[1]",
          explanation:
            "The grant states accurate registration before clamping but does not provide a dimensional tolerance or repeatability figure.",
        },
        {
          id: "slide_locked",
          symbol: "\\mathrm{slideLocked}",
          name: "Offset Locking Slide",
          color: "amethyst",
          role: "Aperture shifted away from the central opening in the capture configuration",
          unit: "true / false",
          dimension: "[1]",
          explanation:
            "The normalised slider represents alignment versus capture only; it is not a source-provided actuator stroke.",
        },
        {
          id: "t_member",
          symbol: "\\mathrm{TMember}",
          name: "Claim 4 T-Member Form",
          color: "crimson",
          role: "The source's T-shaped crossbar/stem and bifurcated slide-ramp arrangement",
          unit: "true / false",
          dimension: "[1]",
          explanation:
            "This activates the dependent-claim geometry only; neither ramp angle nor friction is printed or calculated.",
        },
      ],
      pedagogicalNote:
        "The relation is a source-bound state predicate. US 4,512,709 supplies no pressure, bore, ramp angle, friction, actuator stroke, force, load, or timing input from which a wedge-force equation could honestly be evaluated.",
      historicalSignificance:
        "The grant makes a durable industrial interface legible: locate a common base first, then capture its retention member through a controlled release path.",
    },
  ];

  catalogue["us-4575330-hull-stereolithography"] = [
    {
      id: "hull-source-working-surface-sequence",
      patentId: "us-4575330-hull-stereolithography",
      title: "Claim 2: Fixed Working Surface, Supported Translation, and Successive Laminae",
      category: "Source-Bounded Apparatus Sequence",
      rawLatex:
        "q_{\\mathrm{recoat}}=0 \\land s_{\\mathrm{shutter}}=1 \\Rightarrow \\text{spot 27 at surface 23}; \\quad q_{\\mathrm{recoat}}>0 \\Rightarrow s_{\\mathrm{effective}}=0",
      colorizedLatex:
        "\\textcolor{#2563eb}{q_{\\mathrm{recoat}}=0} \\land \\textcolor{#9333ea}{s_{\\mathrm{shutter}}=1} \\Rightarrow \\textcolor{#d97706}{\\text{spot 27 at surface 23}}; \\quad \\textcolor{#2563eb}{q_{\\mathrm{recoat}}>0} \\Rightarrow \\textcolor{#dc2626}{s_{\\mathrm{effective}}=0}",
      plainEnglishSentence: [
        { text: "At the " },
        { text: "next-layer platform position", variableId: "platform_position" },
        { text: ", an open " },
        { text: "electronic shutter", variableId: "shutter" },
        { text: " delivers spot 27 to " },
        { text: "fixed working surface 23", variableId: "working_surface" },
        {
          text: ". During the displayed recoating excursion, the shutter is held closed and object 30 remains on its support.",
        },
      ],
      variables: [
        {
          id: "platform_position",
          symbol: "q_{\\mathrm{recoat}}",
          name: "Normalized Platform-29 Excursion",
          color: "sapphire",
          role: "Reader-controlled display coordinate between the next-layer position and an illustrative recoating over-travel",
          unit: "normalized display coordinate",
          dimension: "[1]",
          explanation:
            "The grant says platform 29 moves beyond the next layer and then returns to the correct level, but prints no stroke, layer thickness, speed, load, or timing value.",
        },
        {
          id: "shutter",
          symbol: "s_{\\mathrm{shutter}}",
          name: "Electronic Shutter State",
          color: "amethyst",
          role: "Turns light through the source-described UV-transmitting fiber bundle on or off",
          unit: "open / closed",
          dimension: "Boolean source state",
          explanation:
            "The electronic shutter is printed in the preferred embodiment. The display guard prevents an open state while the supported stack is below its next-layer working position.",
        },
        {
          id: "working_surface",
          symbol: "\\text{surface 23}",
          name: "Fixed Working Surface",
          color: "amber",
          role: "The substantially planar interface where the programmed spot forms each new cross-section",
          unit: "source-defined interface",
          dimension: "topological surface",
          explanation:
            "The liquid level is maintained so the focal plane remains at surface 23. No cure depth or layer thickness is inferred from that relationship.",
        },
      ],
      pedagogicalNote:
        "This relation is a source-bounded sequencing predicate, not a cure-depth law. The patent prints a preferred lamp, fiber, shutter, spot, and approximate surface irradiance, but no absorption coefficient, critical exposure, scan dwell, reaction kinetics, layer thickness, or motion card from which a Beer–Lambert photopolymer solve could be evaluated.",
      claimRef: 2,
      historicalSignificance:
        "The essential move is surface-by-surface construction on a translated support. The card keeps that claimed relationship visible without substituting later laser-SLA process parameters for Hull's grant.",
    },
  ];
  catalogue["us-4921293-salisbury-robot-hand"] = [
    {
      id: "salisbury-figure-3-torque-map",
      patentId: "us-4921293-salisbury-robot-hand",
      title: "Figure 3 One-Digit Four-Tension / Three-Torque Map",
      category: "Source-Bounded Robotic Cable Transmission",
      rawLatex:
        "\\begin{aligned}\\tau_1&=-T_1R_1+T_2R_2+T_3R_2-T_4R_1\\\\\\tau_2&=T_1R_3+T_2R_2-T_3R_2-T_4R_3\\\\\\tau_3&=T_2R_2-T_3R_2\\end{aligned}",
      colorizedLatex:
        "\\begin{aligned}\\textcolor{#2563eb}{\\tau_1}&=-\\textcolor{#0891b2}{T_1}\\textcolor{#9333ea}{R_1}+\\textcolor{#16a34a}{T_2}\\textcolor{#9333ea}{R_2}+\\textcolor{#e11d48}{T_3}\\textcolor{#9333ea}{R_2}-\\textcolor{#ea580c}{T_4}\\textcolor{#9333ea}{R_1}\\\\\\textcolor{#16a34a}{\\tau_2}&=\\textcolor{#0891b2}{T_1}\\textcolor{#9333ea}{R_3}+\\textcolor{#16a34a}{T_2}\\textcolor{#9333ea}{R_2}-\\textcolor{#e11d48}{T_3}\\textcolor{#9333ea}{R_2}-\\textcolor{#ea580c}{T_4}\\textcolor{#9333ea}{R_3}\\\\\\textcolor{#d97706}{\\tau_3}&=\\textcolor{#16a34a}{T_2}\\textcolor{#9333ea}{R_2}-\\textcolor{#e11d48}{T_3}\\textcolor{#9333ea}{R_2}\\end{aligned}",
      plainEnglishSentence: [
        { text: "The three " },
        { text: "joint torques", variableId: "torque_1" },
        { text: " are the signed sums of " },
        { text: "one digit's four measured cable tensions", variableId: "tension_1" },
        { text: " multiplied by the " },
        { text: "selected pulley radii", variableId: "radii" },
        { text: " in the Figure 3 route." },
      ],
      variables: [
        {
          id: "torque_1",
          symbol: "\\tau_1",
          name: "Axis 1 Source Torque",
          color: "sapphire",
          role: "Signed moment about the first joint axis for the Figure 3 cable route",
          unit: "Newton-metres (N·m)",
          dimension: "[M L² T⁻²]",
          explanation:
            "T₂ and T₃ contribute with one sign, while T₁ and T₄ contribute through R₁ with the opposite sign.",
          telemetryMetricLabel: "Axis 1 source torque",
        },
        {
          id: "torque_2",
          symbol: "\\tau_2",
          name: "Axis 2 Source Torque",
          color: "emerald",
          role: "Signed moment about the second joint axis for the Figure 3 cable route",
          unit: "Newton-metres (N·m)",
          dimension: "[M L² T⁻²]",
          explanation:
            "The second equation combines T₁ and T₄ through R₃ with the opposed T₂ and T₃ terms through R₂.",
          telemetryMetricLabel: "Axis 2 source torque",
        },
        {
          id: "torque_3",
          symbol: "\\tau_3",
          name: "Axis 3 Source Torque",
          color: "amber",
          role: "Signed moment about the third joint axis for the Figure 3 cable route",
          unit: "Newton-metres (N·m)",
          dimension: "[M L² T⁻²]",
          explanation:
            "Only the opposed T₂ and T₃ terms appear in the third equation printed by the grant.",
          telemetryMetricLabel: "Axis 3 source torque",
        },
        {
          id: "tension_1",
          symbol: "T_1",
          name: "Cable-End Tension T₁",
          color: "cyan",
          role: "Visitor-declared tension in the first labelled cable end",
          unit: "Newtons (N)",
          dimension: "[M L T⁻²]",
          explanation:
            "T₁ appears in the first and second source equations; the patent prints no historical operating value.",
          telemetryKey: "tensionT1N",
        },
        {
          id: "tension_2",
          symbol: "T_2",
          name: "Cable-End Tension T₂",
          color: "emerald",
          role: "Visitor-declared tension in the second labelled cable end",
          unit: "Newtons (N)",
          dimension: "[M L T⁻²]",
          explanation:
            "T₂ contributes to all three printed equations; the patent describes strain-based sensing but gives no calibration range.",
          telemetryKey: "tensionT2N",
        },
        {
          id: "tension_3",
          symbol: "T_3",
          name: "Cable-End Tension T₃",
          color: "rose",
          role: "Visitor-declared tension in the third labelled cable end",
          unit: "Newtons (N)",
          dimension: "[M L T⁻²]",
          explanation:
            "T₃ opposes T₂ in the second and third torque expressions for the illustrated route.",
          telemetryKey: "tensionT3N",
        },
        {
          id: "tension_4",
          symbol: "T_4",
          name: "Cable-End Tension T₄",
          color: "coral",
          role: "Visitor-declared tension in the fourth labelled cable end",
          unit: "Newtons (N)",
          dimension: "[M L T⁻²]",
          explanation:
            "T₄ appears in the first and second source equations with the signs printed in the specification.",
          telemetryKey: "tensionT4N",
        },
        {
          id: "radii",
          symbol: "R_1,R_2,R_3",
          name: "Illustrative Pulley Radii",
          color: "amethyst",
          role: "Lever arms selected for the Figure 3 teaching study",
          unit: "Metres (m)",
          dimension: "[L]",
          explanation:
            "The source shows R₃ larger than R₁ and R₁ larger than R₂ for its exploded illustration, but warns that actual routing may use four different radii. The control declares R₂; the exhibit uses R₁=1.2R₂ and R₃=1.4R₂ only as labelled study ratios.",
          telemetryKey: "radiusScaleMm",
        },
      ],
      pedagogicalNote:
        "These are the three equations printed for one digit beside Figure 3, not a generic force-closure or dynamic hand model. The physical hand routes twelve cable ends; the exhibit mirrors this representative four-tension pose across its three connected digit chains. The source does not supply a cable pretension, contact law, motor limit, link inertia, or stability result.",
      claimRef: 1,
      historicalSignificance:
        "The grant makes its preferred cable route unusually inspectable by printing the signed torque contributions directly; it also states that other rigging may use four different radii.",
    },
  ];

  catalogue["us-5121329-crump-fdm"] = [
    {
      id: "crump-fdm-volumetric-flow-rate",
      patentId: "us-5121329-crump-fdm",
      title: "Volumetric Extrusion Flow Rate & Filament Feed Kinematics",
      category: "Extrusion Fluid Dynamics & Kinematics",
      rawLatex:
        "Q = w \\cdot h \\cdot v_{\\text{head}} = \\frac{\\pi D_{\\text{filament}}^2}{4} v_{\\text{feed}}",
      colorizedLatex:
        "\\textcolor{#0891b2}{Q} = \\textcolor{#2563eb}{w} \\cdot \\textcolor{#16a34a}{h} \\cdot \\textcolor{#ea580c}{v_{\\text{head}}} = \\frac{\\pi \\textcolor{#9333ea}{D_{\\text{filament}}^2}}{4} \\textcolor{#d97706}{v_{\\text{feed}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "volumetric extrusion flow rate", variableId: "volumetric_flow" },
        { text: " equals the product of " },
        { text: "flattened road width", variableId: "road_width" },
        { text: ", " },
        { text: "layer height", variableId: "layer_height" },
        { text: ", and " },
        { text: "toolpath velocity", variableId: "head_velocity" },
        { text: ", which must match the " },
        { text: "filament cross-section", variableId: "filament_diam" },
        { text: " multiplied by the " },
        { text: "feed drive speed", variableId: "feed_velocity" },
        { text: "." },
      ],
      variables: [
        {
          id: "volumetric_flow",
          symbol: "Q",
          name: "Volumetric Flow Rate",
          color: "cyan",
          role: "Total rate of molten polymer volume discharged from the nozzle tip",
          unit: "Cubic millimetres per second (mm³/s)",
          dimension: "[L³ T⁻¹]",
          explanation:
            "Enforces conservation of mass between solid feedstock inflow and extruded road bead deposition.",
          telemetryMetricLabel: "Volumetric Flow Rate (Q)",
        },
        {
          id: "road_width",
          symbol: "w",
          name: "Deposited Road Width",
          color: "sapphire",
          role: "Transverse width of the flattened bead pressed onto the substrate",
          unit: "Millimetres (mm)",
          dimension: "[L]",
          explanation: "Determined by nozzle orifice diameter and planar ironing land clearance.",
          telemetryKey: "roadWidthMm",
        },
        {
          id: "layer_height",
          symbol: "h",
          name: "Layer Thickness",
          color: "emerald",
          role: "Vertical distance stepped by the Z-axis table between successive slices",
          unit: "Millimetres (mm)",
          dimension: "[L]",
          explanation: "Controls vertical resolution and characteristic cooling time constant.",
          telemetryKey: "layerHeightMm",
        },
        {
          id: "head_velocity",
          symbol: "v_{\\text{head}}",
          name: "Toolhead Print Velocity",
          color: "coral",
          role: "Linear speed of the dispensing head across the X-Y plane",
          unit: "Millimetres per second (mm/s)",
          dimension: "[L T⁻¹]",
          explanation:
            "Directly determines production speed and shear rate within the nozzle capillary.",
          telemetryKey: "printSpeedMmS",
        },
        {
          id: "filament_diam",
          symbol: "D_{\\text{filament}}",
          name: "Feedstock Filament Diameter",
          color: "amethyst",
          role: "Calibrated diameter of the incoming solid polymer strand",
          unit: "Millimetres (mm)",
          dimension: "[L]",
          explanation: "Specifies the cross-sectional area of the solid piston driving melt flow.",
          telemetryKey: "filamentDiameterMm",
        },
        {
          id: "feed_velocity",
          symbol: "v_{\\text{feed}}",
          name: "Filament Feed Speed",
          color: "amber",
          role: "Linear velocity of solid filament driven into the liquefier by pinch rollers",
          unit: "Millimetres per second (mm/s)",
          dimension: "[L T⁻¹]",
          explanation: "Motorized drive speed synchronized with X-Y toolhead motion.",
          telemetryMetricLabel: "Filament Feed Speed (v_feed)",
        },
      ],
      pedagogicalNote:
        "Conservation of mass requires exact synchronization between filament feed motor pulses and Cartesian gantry toolpath speed to maintain uniform road width without under- or over-extrusion.",
      claimRef: 1,
      historicalSignificance:
        "Crump's Claim 1 established the volumetric metering link between motorized filament feed and relative 3-axis motion.",
    },
  ];

  catalogue["us-2717437-mestral-velcro"] = [
    {
      id: "mestral-circular-section-geometry",
      patentId: "us-2717437-mestral-velcro",
      title: "Illustrative Circular Filament Section",
      category: "Source-Bounded Geometry",
      rawLatex: "I = \\frac{\\pi d^4}{64}",
      colorizedLatex: "\\textcolor{#059669}{I} = \\frac{\\pi \\textcolor{#0d9488}{d^4}}{64}",
      plainEnglishSentence: [
        { text: "For the reader-selected circular display strand, the exact " },
        { text: "second moment of area", variableId: "section_moment" },
        { text: " follows from the illustrative " },
        { text: "filament diameter", variableId: "filament_diameter" },
        {
          text: ". US 2,717,437 supplies neither this diameter nor the modulus and contact data needed to turn the geometry into a force prediction.",
        },
      ],
      variables: [
        {
          id: "section_moment",
          symbol: "I",
          name: "Circular-Section Second Moment",
          color: "emerald",
          role: "Exact geometric area moment for the reader-selected circular display strand",
          unit: "Meters to the fourth power (m^4)",
          dimension: "[L^4]",
          explanation:
            "This is geometry only. A flexural rigidity would additionally require a material modulus that the grant does not print.",
          telemetryKey: "circularSectionSecondMomentM4",
          telemetryMetricLabel: "Circular Section I",
        },
        {
          id: "filament_diameter",
          symbol: "d",
          name: "Illustrative Filament Diameter",
          color: "teal",
          role: "Reader-selected strand diameter used to scale both visual projections",
          unit: "Millimeters (mm)",
          dimension: "[L]",
          explanation:
            "The dimension is an explicitly modern display input, not a value recovered from US 2,717,437.",
        },
      ],
      pedagogicalNote:
        "The d^4 dependence is exact circular-section geometry. The exhibit deliberately stops before EI, spring rate, release force, peel force, or energy because the primary source cannot calibrate them.",
      claimRef: 3,
      historicalSignificance:
        "The source contribution shown here is the woven, heat-set hook-pile topology and its 90-degree hook-to-hook arrangement—not a modern peel-test data set.",
    },
  ];

  catalogue["us-2846084-goertz-electronic-master-slave-manipulator"] = [
    {
      id: "goertz-synchro-position-error",
      patentId: "us-2846084-goertz-electronic-master-slave-manipulator",
      title: "Synchro Position-Error Correspondence",
      category: "Source-Bounded Bilateral Teleoperation",
      rawLatex: "E\\propto q_m-q_s",
      colorizedLatex:
        "\\textcolor{#f59e0b}{E}\\propto\\textcolor{#06b6d4}{q_m}-\\textcolor{#8b5cf6}{q_s}",
      plainEnglishSentence: [
        { text: "The source-described synchro pair makes an " },
        { text: "error signal", variableId: "position_error" },
        { text: " from the difference between the normalized master " },
        { text: "channel position", variableId: "master_position" },
        { text: " and its corresponding slave " },
        { text: "channel position", variableId: "slave_position" },
        { text: "." },
      ],
      variables: [
        {
          id: "position_error",
          symbol: "E",
          name: "Synchro Position-Error Signal",
          color: "amber",
          role: "The source’s directional alternating error signal between corresponding positions",
          unit: "normalized source topology",
          dimension: "[1]",
          explanation:
            "The grant says amplitude is proportional to the difference and phase records the direction of mechanical error. It does not publish a volts-per-degree conversion or loop gain.",
          telemetryMetricLabel: "Largest Channel Mismatch",
        },
        {
          id: "master_position",
          symbol: "q_m",
          name: "Master-Channel Position",
          color: "cyan",
          role: "A normalized configuration of one source-described master movement",
          unit: "normalized channel coordinate",
          dimension: "[1]",
          explanation:
            "The interactive exhibit maps the authored slider to one of the seven named movements. The grant supplies no common coordinate scale or arm geometry in metres.",
          telemetryKey: "horizontalArmPivot",
        },
        {
          id: "slave_position",
          symbol: "q_s",
          name: "Slave-Channel Position",
          color: "amethyst",
          role: "The corresponding normalized remote movement that the servo tends to reproduce",
          unit: "normalized channel coordinate",
          dimension: "[1]",
          explanation:
            "The patent describes corresponding movement, not a measured Cartesian workspace. Remote contact is represented only as an explicitly illustrative normalized mismatch.",
          telemetryKey: "contactResistance",
        },
      ],
      pedagogicalNote:
        "This is a source-level proportionality statement, not a fabricated controller equation. The visitor can vary a named master channel and an illustrative contact state, but the document does not justify numerical voltage, gain, speed, force, or bandwidth output.",
      claimRef: 9,
      historicalSignificance:
        "Claim 9 makes position difference the bridge between remote obstruction and a response on both members of a bilateral master–slave system.",
    },
    {
      id: "goertz-reflected-resistance",
      patentId: "us-2846084-goertz-electronic-master-slave-manipulator",
      title: "Claim 9 Reflected-Resistance Relationship",
      category: "Source-Bounded Bilateral Teleoperation",
      rawLatex: "r_{\\text{display}}\\propto |E|",
      colorizedLatex: "\\textcolor{#059669}{r_{\\text{display}}}\\propto|\\textcolor{#f59e0b}{E}|",
      plainEnglishSentence: [
        { text: "When the remote mechanism meets an illustrative " },
        { text: "contact resistance state", variableId: "remote_contact" },
        { text: ", the rising mismatch produces a normalized " },
        { text: "reflected-resistance display", variableId: "reflected_resistance" },
        { text: " when Claim 9 force reflection is enabled." },
      ],
      variables: [
        {
          id: "reflected_resistance",
          symbol: "r_{\\text{display}}",
          name: "Reflected-Resistance Display",
          color: "emerald",
          role: "Normalized visual indicator of the source-described resistance returning to the master",
          unit: "normalized display relation",
          dimension: "[1]",
          explanation:
            "It is deliberately not labelled newtons or torque. The historical patent says resistance can appear at the master but does not give a force calibration, impedance, or contact model.",
          telemetryMetricLabel: "Reflected Resistance",
        },
        {
          id: "remote_contact",
          symbol: "c",
          name: "Illustrative Remote Contact State",
          color: "coral",
          role: "Visitor-controlled normalized obstruction scenario used to expose the source’s causal chain",
          unit: "illustrative normalized state",
          dimension: "[1]",
          explanation:
            "This control is an educational scenario selector, not a claim that the patent measures material stiffness or predicts contact force.",
          telemetryKey: "contactResistance",
        },
        {
          id: "force_reflection",
          symbol: "\\mathcal{R}_9",
          name: "Claim 9 Bilateral Reflection Path",
          color: "sapphire",
          role: "On/off probe for the issued force-reflection topology",
          unit: "claim probe",
          dimension: "[1]",
          explanation:
            "Claim 9 directs force on both corresponding movable elements in a manner tending toward correspondence. The control reveals that topology without converting it into a modern haptic performance specification.",
          telemetryKey: "forceReflectionEnabled",
        },
      ],
      pedagogicalNote:
        "The equation intentionally uses a display relation rather than a force law. It makes the beaker example legible while preserving the boundary between a historical bilateral-servo claim and an unprovided Newton-for-Newton haptic calibration.",
      claimRef: 9,
      historicalSignificance:
        "The issued language is an early clear statement that remote mechanical resistance can be returned to a human operator through a paired electrical servo arrangement.",
    },
    {
      id: "goertz-tachometer-limiter-path",
      patentId: "us-2846084-goertz-electronic-master-slave-manipulator",
      title: "Relative-Speed Feedback and Limited Error Path",
      category: "Source-Bounded Bilateral Teleoperation",
      rawLatex:
        "V_t\\propto\\dot q_m-\\dot q_s,\\qquad E_{\\text{drive}}=\\operatorname{limit}(E-V_t)",
      colorizedLatex:
        "\\textcolor{#9333ea}{V_t}\\propto\\dot{\\textcolor{#06b6d4}{q_m}}-\\dot{\\textcolor{#8b5cf6}{q_s}},\\qquad\\textcolor{#f59e0b}{E_{\\text{drive}}}=\\operatorname{limit}(\\textcolor{#f59e0b}{E}-\\textcolor{#9333ea}{V_t})",
      plainEnglishSentence: [
        { text: "The source’s tachometer path opposes a " },
        { text: "relative-speed signal", variableId: "tachometer_signal" },
        { text: " against the position error, while its " },
        { text: "signal limiter", variableId: "limiter_path" },
        { text: " bounds abnormal-condition command amplitude." },
      ],
      variables: [
        {
          id: "tachometer_signal",
          symbol: "V_t",
          name: "Relative-Speed Feedback Signal",
          color: "amethyst",
          role: "Source-described tachometer bridge output responsive to a difference in motor speeds",
          unit: "topology state",
          dimension: "[1]",
          explanation:
            "The patent says the path opposes the error-signal path to reduce oscillation. It supplies neither a calibrated velocity measurement nor a frequency-response model.",
          telemetryKey: "tachometerDampingEnabled",
        },
        {
          id: "limiter_path",
          symbol: "\\operatorname{limit}(\\cdot)",
          name: "Abnormal-Condition Signal Limiter",
          color: "amber",
          role: "Claims 10 and 12’s source-described bounded-error refinement",
          unit: "claim probe",
          dimension: "[1]",
          explanation:
            "The host kernel clips only a normalized display command. It never asserts an actual motor voltage, safety certification, or operating speed from an unprovided threshold.",
          telemetryKey: "limiterEnabled",
        },
        {
          id: "drive_error",
          symbol: "E_{\\text{drive}}",
          name: "Limited Correction Display",
          color: "amber",
          role: "Illustrative source-topology correction path after the damping and limiter probes",
          unit: "normalized display relation",
          dimension: "[1]",
          explanation:
            "The notation condenses the stated opposing and limiting relationships. It is not a claim that the patent publishes this exact modern algebraic controller form.",
          telemetryMetricLabel: "Servo State",
        },
      ],
      pedagogicalNote:
        "Claims 10–12 add real control-architecture ideas—limiting and speed-difference opposition—without providing the numbers needed to simulate a physical motor loop. The live system labels those boundaries rather than creating false dynamics.",
      claimRef: 12,
      historicalSignificance:
        "These dependent claims capture a historically early combination of bilateral position correspondence, bounded abnormal-condition response, and relative-speed damping.",
    },
  ];

  catalogue["us-3212649-amf-versatran"] = [
    {
      id: "versatran-resolver-tape-phase-topology",
      patentId: "us-3212649-amf-versatran",
      title: "Resolver–Tape Phase Difference",
      category: "Source-Bounded Feedback Topology",
      rawLatex: "e_i = \\operatorname{wrap}(\\phi_{T,i} - \\phi_{R,i})",
      colorizedLatex:
        "\\textcolor{#059669}{e_i} = \\operatorname{wrap}(\\textcolor{#d97706}{\\phi_{T,i}} - \\textcolor{#2563eb}{\\phi_{R,i}})",
      plainEnglishSentence: [
        { text: "The normalized exhibit " },
        { text: "phase-difference display", variableId: "phase_error" },
        { text: " is the wrapped difference between the tape " },
        { text: "command phase", variableId: "tape_phase" },
        { text: " and resolver " },
        { text: "feedback phase", variableId: "resolver_phase" },
        { text: "." },
      ],
      variables: [
        {
          id: "phase_error",
          symbol: "e_i",
          name: "Normalized Phase Difference",
          color: "emerald",
          role: "Display-only signed comparison between one tape command and its resolver feedback",
          unit: "normalized phase",
          dimension: "[1]",
          explanation:
            "Figure 49 says its output is approximately proportional to phase difference. This exhibit value has no claimed voltage calibration, controller gain, or tracking-accuracy interpretation.",
          telemetryMetricLabel: "Signed Phase Error",
        },
        {
          id: "tape_phase",
          symbol: "\\phi_{T,i}",
          name: "Tape Command Phase",
          color: "amber",
          role: "Normalized command representation from the recorded tape path",
          unit: "normalized phase",
          dimension: "[1]",
          explanation:
            "The grant records resolver-related signals on tape channels and uses them during playback. It does not publish a phase-to-position or tape-speed calibration.",
          telemetryMetricLabel: "Tape Command Phase",
        },
        {
          id: "resolver_phase",
          symbol: "\\phi_{R,i}",
          name: "Resolver Feedback Phase",
          color: "sapphire",
          role: "Normalized representation of the source-described resolver signal",
          unit: "normalized phase",
          dimension: "[1]",
          explanation:
            "Resolvers are described as variable transformers with rotor and stator. The source establishes a comparison path, not a measurement scale in volts, degrees, or metres.",
          telemetryMetricLabel: "Resolver Feedback Phase",
        },
      ],
      pedagogicalNote:
        "This is a normalized exhibit notation for the Figure 49 phase comparison, not a claim that US 3,212,649 prints a modern closed-loop transfer function or the numbers needed for an SI dynamics model.",
      claimRef: 8,
      historicalSignificance:
        "Claims 8 and 9 couple sensing, recording, and repetitive playback to the stated hydraulic machine; the source face makes the feedback relationship inspectable without inflating it into an unprinted performance claim.",
    },
  ];

  catalogue["us-4976582-clavel-delta-robot"] = [
    {
      id: "clavel-delta-paired-bar-attitude-invariant",
      patentId: "us-4976582-clavel-delta-robot",
      title: "Paired-Bar Displacement and Fixed-Attitude Constraint",
      category: "Source-Bounded Parallel-Robot Topology",
      rawLatex:
        "\\mathbf{p}^{*}+\\mathbf{a}_i^{*}=\\mathbf{e}_i^{*}+\\mathbf{l}_{i,j}^{*},\\qquad\\lVert\\mathbf{l}_{i,a}^{*}\\rVert=\\lVert\\mathbf{l}_{i,b}^{*}\\rVert=L^{*},\\qquad\\mathbf{l}_{i,a}^{*}-\\mathbf{l}_{i,b}^{*}=\\mathbf{d}_i^{*}",
      colorizedLatex:
        "\\textcolor{#9333ea}{\\mathbf{p}^{*}}+\\textcolor{#0d9488}{\\mathbf{a}_i^{*}}=\\textcolor{#0891b2}{\\mathbf{e}_i^{*}}+\\textcolor{#059669}{\\mathbf{l}_{i,j}^{*}},\\qquad\\lVert\\textcolor{#059669}{\\mathbf{l}_{i,a}^{*}}\\rVert=\\lVert\\textcolor{#059669}{\\mathbf{l}_{i,b}^{*}}\\rVert=\\textcolor{#7c3aed}{L^{*}},\\qquad\\textcolor{#059669}{\\mathbf{l}_{i,a}^{*}}-\\textcolor{#059669}{\\mathbf{l}_{i,b}^{*}}=\\textcolor{#dc2626}{\\mathbf{d}_i^{*}}",
      plainEnglishSentence: [
        { text: "For each leg, the normalized " },
        { text: "platform attachment", variableId: "platform_center" },
        { text: " can be reached through either of two lower bars with one declared " },
        { text: "rigid normalized length", variableId: "bar_length" },
        { text: ". The " },
        { text: "rigid-link closure residual", variableId: "closure_residual" },
        { text: " and shared " },
        { text: "pair-vector residual", variableId: "pair_residual" },
        {
          text: " remains zero in the source-bounded construction when Claim 2 keeps both parallel bars present.",
        },
      ],
      variables: [
        {
          id: "platform_center",
          symbol: "\\mathbf{p}^{*}",
          name: "Movable-Member Display Center",
          color: "amethyst",
          role: "Normalized display coordinate of movable member 8",
          unit: "normalized exhibit coordinate",
          dimension: "[1]",
          explanation:
            "The asterisk marks a teaching coordinate, not metres. US 4,976,582 names a movable member and its orientation constraint but prints no link dimensions or calibrated workspace from which an SI platform position could be reconstructed.",
          telemetryMetricLabel: "Platform center",
        },
        {
          id: "bar_length",
          symbol: "L^{*}",
          name: "Declared Normalized Lower-Bar Length",
          color: "amethyst",
          role: "One display-only length shared by every lower bar in the closed-chain construction",
          unit: "normalized exhibit length",
          dimension: "[1]",
          explanation:
            "This is an explicitly declared teaching dimension chosen to close the symmetric display pose, not a length printed in US 4,976,582 or a recovered manufacturing dimension.",
          telemetryMetricLabel: "Declared bar length",
        },
        {
          id: "closure_residual",
          symbol: "\\epsilon_{\\mathrm{closure}}^{*}",
          name: "Rigid-Link Closure Residual",
          color: "emerald",
          role: "Largest difference between a displayed lower-bar norm and the declared normalized length",
          unit: "normalized construction residual",
          dimension: "[1]",
          explanation:
            "The kernel intersects three equal-radius normalized spheres before rendering the platform. This residual reports numerical closure of that display construction; it is not a measured machine positioning error.",
          telemetryMetricLabel: "Rigid-link closure residual",
        },
        {
          id: "pair_residual",
          symbol: "\\mathbf{d}_i^{*}",
          name: "Paired-Bar Displacement Difference",
          color: "crimson",
          role: "Difference between the two lower-bar translation vectors for one display leg",
          unit: "normalized construction residual",
          dimension: "[1]",
          explanation:
            "Figure 1 and Claim 2 identify two parallel bars. The kernel constructs both bars with the same endpoint displacement vector, making their idealized parallelogram relation inspectable without assigning stiffness, backlash, or accuracy.",
          telemetryMetricLabel: "Pair-vector residual",
        },
        {
          id: "actuator_input",
          symbol: "q_i^{*}",
          name: "Control-Arm Display Input",
          color: "cyan",
          role: "Unitless input that moves one source-labelled control arm in the exhibit",
          unit: "normalized input",
          dimension: "[1]",
          explanation:
            "The grant shows rotary actuator arms in Figure 1 but gives no historic angular range, servo schedule, or motor data. This control is a bounded visual configuration input only.",
          telemetryKey: "armOneInput",
        },
        {
          id: "paired_bar_claim",
          symbol: "\\mathcal{C}_2",
          name: "Claim 2 Paired-Bar State",
          color: "emerald",
          role: "Whether the live exhibit retains both lower bars per leg",
          unit: "claim probe",
          dimension: "[1]",
          explanation:
            "Turning the Claim 2 probe off deliberately withholds the second bar in every leg. The platform is then not presented as the source-backed paired-bar topology described by the dependent claim.",
          telemetryMetricLabel: "Paired Bars",
        },
      ],
      pedagogicalNote:
        "This equation is a normalized topology statement. It makes the paired-bar displacement and rigid-link closure construction readable without asserting a historical link length, SI machine solution, stiffness, payload, speed, or FrankenSim/WASM dynamics result.",
      claimRef: 2,
      historicalSignificance:
        "Claim 2 makes the two parallel bars a concrete structural limit within Clavel's broader orientation-preserving positioning device; the exhibit keeps that legal distinction visible.",
    },
  ];

  catalogue["us-3081379-lemelson-machine-vision"] = [
    {
      id: "lemelson-vidicon-line-scan-dimension",
      patentId: "us-3081379-lemelson-machine-vision",
      title: "Television Raster Scan & Dimensional Pulse Slicing",
      category: "Optical Electronics & Signal Processing",
      rawLatex:
        "L_{\\text{meas}} = v_{\\text{scan}} \\cdot \\tau_{\\text{pulse}} = \\frac{W_{\\text{target}}}{T_{\\text{active}}} \\cdot \\tau_{\\text{pulse}}",
      colorizedLatex:
        "\\textcolor{#059669}{L_{\\text{meas}}} = \\textcolor{#2563eb}{v_{\\text{scan}}} \\cdot \\textcolor{#d97706}{\\tau_{\\text{pulse}}} = \\frac{\\textcolor{#0891b2}{W_{\\text{target}}}}{\\textcolor{#9333ea}{T_{\\text{active}}}} \\cdot \\textcolor{#d97706}{\\tau_{\\text{pulse}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "measured physical dimension", variableId: "meas_dim" },
        { text: " equals the " },
        { text: "optical beam scanning velocity", variableId: "scan_vel" },
        { text: " multiplied by the " },
        { text: "detected video pulse width duration", variableId: "pulse_width" },
        { text: ", where scan velocity is the ratio of " },
        { text: "target image field width", variableId: "field_width" },
        { text: " to " },
        { text: "active horizontal sweep time", variableId: "active_sweep" },
        { text: "." },
      ],
      variables: [
        {
          id: "meas_dim",
          symbol: "L_{\\text{meas}}",
          name: "Measured Physical Dimension",
          color: "emerald",
          role: "Calculated geometric width of the inspected manufactured article",
          unit: "metres (m)",
          dimension: "[L]",
          explanation:
            "The linear size of the workpiece derived electronically by counting clock cycles or integrating video voltage during beam transit across the part.",
          telemetryKey: "measuredPartWidthMm",
          telemetryMetricLabel: "Measured Width",
        },
        {
          id: "scan_vel",
          symbol: "v_{\\text{scan}}",
          name: "Beam Scanning Velocity",
          color: "sapphire",
          role: "Linear speed of the electron beam spot traversing the optical image plane",
          unit: "metres per second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "The speed at which the deflected cathode ray sweeps across the target area, determined by horizontal deflection frequency.",
          telemetryKey: "scanBeamVelocityMPerS",
          telemetryMetricLabel: "Beam Scan Velocity",
        },
        {
          id: "pulse_width",
          symbol: "\\tau_{\\text{pulse}}",
          name: "Video Pulse Duration",
          color: "amber",
          role: "Time duration during which the sliced video signal exceeds comparator threshold",
          unit: "seconds (s)",
          dimension: "[T]",
          explanation:
            "The temporal width of the electrical pulse generated as the electron beam traverses the reflective or dark boundary of the article.",
          telemetryKey: "pulseWidthUs",
          telemetryMetricLabel: "Detected Pulse Width",
        },
        {
          id: "field_width",
          symbol: "W_{\\text{target}}",
          name: "Target Field Width",
          color: "cyan",
          role: "Total horizontal physical width of the camera optical field of view",
          unit: "metres (m)",
          dimension: "[L]",
          explanation:
            "The physical distance across the conveyor belt covered by the camera objective lens.",
        },
        {
          id: "active_sweep",
          symbol: "T_{\\text{active}}",
          name: "Active Sweep Time",
          color: "amethyst",
          role: "Active forward scan duration excluding horizontal retrace blanking",
          unit: "seconds (s)",
          dimension: "[T]",
          explanation:
            "The forward sweep duration of one horizontal raster line (~53.3 microseconds in NTSC standard).",
        },
      ],
      pedagogicalNote:
        "Lemelson's breakthrough was converting spatial dimensions on a factory conveyor into temporal durations in a video waveform, allowing microsecond electronic circuits to perform precision metrology.",
      claimRef: 1,
      historicalSignificance:
        "Claim 1 defines the synchronization between electron beam sweeping, gating circuits, and waveform analyzing circuits.",
    },
    {
      id: "lemelson-solenoid-rejection-force",
      patentId: "us-3081379-lemelson-machine-vision",
      title: "Electromagnetic Defect Ejection Solenoid Force",
      category: "Electromagnetics & Actuator Dynamics",
      rawLatex: "F_{\\text{mag}} = \\frac{(N \\cdot I)^2 \\mu_0 A_p}{2 g^2}",
      colorizedLatex:
        "\\textcolor{#059669}{F_{\\text{mag}}} = \\frac{(\\textcolor{#2563eb}{N} \\cdot \\textcolor{#d97706}{I})^2 \\textcolor{#0891b2}{\\mu_0} \\textcolor{#9333ea}{A_p}}{2 \\textcolor{#dc2626}{g^2}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "electromagnetic actuation force", variableId: "mag_force" },
        { text: " driving the rejection diverter gate scales with " },
        { text: "coil turn count squared", variableId: "coil_turns" },
        { text: ", " },
        { text: "excitation current squared", variableId: "coil_current" },
        { text: ", " },
        { text: "magnetic permeability of free space", variableId: "permeability" },
        { text: ", " },
        { text: "pole piece surface area", variableId: "pole_area" },
        { text: ", and the inverse square of the " },
        { text: "air gap distance", variableId: "air_gap" },
        { text: "." },
      ],
      variables: [
        {
          id: "mag_force",
          symbol: "F_{\\text{mag}}",
          name: "Magnetic Solenoid Actuation Force",
          color: "emerald",
          role: "Tractive force accelerating the diverter gate across the conveyor",
          unit: "Newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "The mechanical force developed in the solenoid plunger to deflect defective parts into a rejection bin within milliseconds.",
          telemetryKey: "solenoidForceN",
          telemetryMetricLabel: "Reject Solenoid Force",
        },
        {
          id: "coil_turns",
          symbol: "N",
          name: "Solenoid Coil Turns",
          color: "sapphire",
          role: "Number of wire turns wound on the actuator bobbin",
          unit: "dimensionless count",
          dimension: "[1]",
          explanation:
            "The total number of electromagnetic coil turns producing magnetomotive force.",
        },
        {
          id: "coil_current",
          symbol: "I",
          name: "Excitation Current",
          color: "amber",
          role: "Electrical drive current through the solenoid winding",
          unit: "Amperes (A)",
          dimension: "[I]",
          explanation: "Current switched on by the defect trigger relay or thyratron tube.",
        },
        {
          id: "permeability",
          symbol: "\\mu_0",
          name: "Permeability of Free Space",
          color: "cyan",
          role: "Fundamental physical magnetic constant",
          unit: "Henries per metre (H/m)",
          dimension: "[M L T^-2 I^-2]",
          explanation: "Standard physical constant 4*pi*1e-7 H/m.",
        },
        {
          id: "pole_area",
          symbol: "A_p",
          name: "Plunger Pole Cross-Sectional Area",
          color: "amethyst",
          role: "Magnetic flux interface area of the plunger core",
          unit: "square metres (m^2)",
          dimension: "[L^2]",
          explanation: "The working face area where magnetic flux crosses the armature gap.",
        },
        {
          id: "air_gap",
          symbol: "g",
          name: "Armature Air Gap",
          color: "rose",
          role: "Stroke distance between plunger and stationary core",
          unit: "metres (m)",
          dimension: "[L]",
          explanation: "The initial mechanical gap traversed by the plunger when energized.",
        },
      ],
      pedagogicalNote:
        "Rapid defect rejection requires high peak tractive forces to overcome mechanical gate inertia before the moving conveyor carries the part past the diverter station.",
      claimRef: 1,
      historicalSignificance:
        "Lemelson described automated sorting gates actuated by video analysis signals to eliminate human sorting labor.",
    },
  ];

  // The prior SI cards for this record remain above as preserved historical
  // implementation material. The public assignment is deliberately replaced by
  // this reviewed source-bound signal-path card: US 3,081,379 does not provide a
  // calibration packet for the former beam, pickup, or actuator calculations.
  catalogue["us-3081379-lemelson-machine-vision"] = [
    {
      id: "lemelson-source-signal-path",
      patentId: "us-3081379-lemelson-machine-vision",
      title: "Source-Bounded Picture-Signal Path",
      category: "Source-Bounded Video Signal Topology",
      rawLatex: "C = S \\land G \\land A \\land I",
      colorizedLatex:
        "\\textcolor{#059669}{C} = \\textcolor{#2563eb}{S} \\land \\textcolor{#d97706}{G} \\land \\textcolor{#9333ea}{A} \\land \\textcolor{#0891b2}{I}",
      plainEnglishSentence: [
        { text: "The illustrated " },
        { text: "control-path state", variableId: "control_path" },
        { text: " is available only when the " },
        { text: "scan path", variableId: "scan_path" },
        { text: ", " },
        { text: "synchronized gate", variableId: "synchronized_gate" },
        { text: ", " },
        { text: "analyzing circuit", variableId: "analyzing_circuit" },
        { text: ", and " },
        { text: "picture-signal-present state", variableId: "picture_signal" },
        { text: " are all represented." },
      ],
      variables: [
        {
          id: "control_path",
          symbol: "C",
          name: "Control-Path State",
          color: "emerald",
          role: "Normalized display state for the complete Claim 1 signal path",
          unit: "logical state",
          dimension: "[1]",
          explanation:
            "This is not an electrical output, a reject decision, or an actuator command; it only marks that the source-described path is complete.",
          telemetryMetricLabel: "Control output",
        },
        {
          id: "scan_path",
          symbol: "S",
          name: "Scan Path",
          color: "sapphire",
          role: "Claim 1 electron-beam path through the image field",
          unit: "logical state",
          dimension: "[1]",
          explanation:
            "The grant names a predetermined scan path, but it does not establish a rate, image-field scale, or beam-velocity calibration for this exhibit.",
          telemetryMetricLabel: "Scan path",
        },
        {
          id: "synchronized_gate",
          symbol: "G",
          name: "Synchronized Gate",
          color: "amber",
          role: "Programming means operating the picture-signal gate in time relation",
          unit: "logical state",
          dimension: "[1]",
          explanation:
            "The state records whether the selected picture-signal path is enabled, not a gate width, threshold, delay, or voltage level.",
          telemetryMetricLabel: "Synchronized gate",
        },
        {
          id: "analyzing_circuit",
          symbol: "A",
          name: "Analyzing Circuit",
          color: "amethyst",
          role: "Claim 1 circuit receiving the selected picture-signal portion",
          unit: "logical state",
          dimension: "[1]",
          explanation:
            "The source establishes the circuit relationship without providing a calibrated comparator curve, measurement accuracy, or classification threshold.",
          telemetryMetricLabel: "Analyzing circuit",
        },
        {
          id: "picture_signal",
          symbol: "I",
          name: "Picture-Signal-Present State",
          color: "cyan",
          role: "Display-state representation of a source-described picture signal",
          unit: "logical state",
          dimension: "[1]",
          explanation:
            "The visual records presence or withholding only. It does not reconstruct optical amplitude, responsivity, waveform timing, or a physical workpiece measurement.",
          telemetryMetricLabel: "Inspection signal",
        },
      ],
      pedagogicalNote:
        "This is a normalized topology relation. It makes Claim 1's scan-to-gate-to-analysis order visible while refusing unreviewed beam velocity, optical responsivity, signal amplitude, solenoid force, and actuator-response claims.",
      claimRef: 1,
      historicalSignificance:
        "Claim 1 makes the selected portion of a picture signal, rather than the whole field, the input to analysis. The public exhibit keeps that legal structure visible without inventing a calibrated industrial apparatus.",
    },
  ];

  catalogue["us-3260375-lemelson-adjustable-manipulator"] = [
    {
      id: "lemelson-manipulator-serial-kinematics",
      patentId: "us-3260375-lemelson-adjustable-manipulator",
      title: "Normalized Kinematic Topology & Display Pose",
      category: "Source-Bounded Manipulator Topology",
      rawLatex:
        "\\mathbf{p}_{\\text{tool}} = \\mathbf{p}_{\\text{carriage}} + \\mathbf{R}_z(\\theta) \\left[ \\mathbf{d}_{\\text{column}} + \\mathbf{R}_y(\\alpha) \\mathbf{l}_{\\text{arm}} \\right]",
      colorizedLatex:
        "\\textcolor{#059669}{\\mathbf{p}_{\\text{tool}}} = \\textcolor{#2563eb}{\\mathbf{p}_{\\text{carriage}}} + \\textcolor{#d97706}{\\mathbf{R}_z(\\theta)} \\left[ \\textcolor{#0891b2}{\\mathbf{d}_{\\text{column}}} + \\textcolor{#dc2626}{\\mathbf{R}_y(\\alpha)} \\textcolor{#7c3aed}{\\mathbf{l}_{\\text{arm}}} \\right]",
      plainEnglishSentence: [
        { text: "The normalized " },
        { text: "tool-end display pose", variableId: "tool_pos" },
        { text: " equals the " },
        { text: "carriage display coordinate", variableId: "carriage_pos" },
        { text: " plus the column azimuth rotation of the sum of " },
        { text: "column display coordinate", variableId: "col_disp" },
        { text: " and the pitch-rotated " },
        { text: "illustrative arm vector", variableId: "arm_vec" },
        { text: "." },
      ],
      variables: [
        {
          id: "tool_pos",
          symbol: "\\mathbf{p}_{\\text{tool}}",
          name: "Tool-End Display Coordinates",
          color: "emerald",
          role: "Normalized procedural display coordinate of the illustrated end member",
          unit: "normalized display coordinate",
          dimension: "[1]",
          explanation:
            "A procedural display point showing how the selected controls change the illustrated pose; it is not a measured factory coordinate.",
        },
        {
          id: "carriage_pos",
          symbol: "\\mathbf{p}_{\\text{carriage}}",
          name: "Carriage Display Coordinate",
          color: "sapphire",
          role: "Normalized position along the illustrated track relationship",
          unit: "normalized travel",
          dimension: "[1]",
          explanation:
            "A source-bounded display control for the carriage relationship; the grant provides no track length or metre scale.",
        },
        {
          id: "col_disp",
          symbol: "\\mathbf{d}_{\\text{column}}",
          name: "Column Display Coordinate",
          color: "cyan",
          role: "Normalized vertical-member position in the illustrated arrangement",
          unit: "normalized stroke",
          dimension: "[1]",
          explanation:
            "A source-bounded display coordinate; the grant describes chain or belt motion but provides no travel length.",
        },
        {
          id: "arm_vec",
          symbol: "\\mathbf{l}_{\\text{arm}}",
          name: "Illustrative Arm Vector",
          color: "amethyst",
          role: "Procedural visual link joining the displayed pivot and end member",
          unit: "normalized display length",
          dimension: "[1]",
          explanation:
            "The model uses an illustrative length only to make the documented joint topology visible; no arm dimension is inferred from the grant.",
        },
      ],
      pedagogicalNote:
        "This normalized expression makes the pictured guide, vertical member, rotary relation, and pivot relation legible together. It is not a dimensional kinematic calibration or a statement of degrees of freedom beyond the claimed combinations.",
      claimRef: 1,
      historicalSignificance:
        "Claim 1 links a guided carriage, rotational coupling, power means, and selected limit-switch/actuator relationships in one combination.",
    },
    {
      id: "lemelson-limit-switch-trip-condition",
      patentId: "us-3260375-lemelson-adjustable-manipulator",
      title: "Limit-Switch Actuation & Relay Handoff Condition",
      category: "Electromechanical Automation & Relay Logic",
      rawLatex:
        "\\text{Trip}(\\theta) = \\mathbb{I}\\left( |\\theta - \\theta_{\\text{stop}}| < \\epsilon \\right) \\implies S_{\\text{motor}} = \\text{STOP} \\wedge F_{\\text{next}} = \\text{PULSE}",
      colorizedLatex:
        "\\textcolor{#059669}{\\text{Trip}(\\theta)} = \\mathbb{I}\\left( |\\textcolor{#2563eb}{\\theta} - \\textcolor{#d97706}{\\theta_{\\text{stop}}}| < \\textcolor{#0891b2}{\\epsilon} \\right) \\implies \\textcolor{#dc2626}{S_{\\text{motor}}} = \\text{STOP} \\wedge \\textcolor{#7c3aed}{F_{\\text{next}}} = \\text{PULSE}",
      plainEnglishSentence: [
        { text: "When normalized joint " },
        { text: "display position", variableId: "joint_angle" },
        { text: " contacts the " },
        { text: "adjustable limit stop", variableId: "stop_angle" },
        { text: " within the exhibit's normalized event band " },
        { text: "epsilon", variableId: "switch_eps" },
        {
          text: ", the exhibit treats the limit switch as actuated and shows the active control as ",
        },
        { text: "stop", variableId: "motor_stop" },
        { text: " and the next selected control as " },
        { text: "available", variableId: "next_start" },
        { text: "." },
      ],
      variables: [
        {
          id: "joint_angle",
          symbol: "\\theta",
          name: "Normalized Joint Coordinate",
          color: "sapphire",
          role: "Normalized coordinate selected in the source-bounded display",
          unit: "normalized angle",
          dimension: "[1]",
          explanation:
            "A display coordinate for a rotary or other relatively moving member; the source does not furnish a calibrated angular scale.",
        },
        {
          id: "stop_angle",
          symbol: "\\theta_{\\text{stop}}",
          name: "Normalized Stop Setting",
          color: "amber",
          role: "Selected display position for a disclosed actuator/limit-switch relationship",
          unit: "normalized limit position",
          dimension: "[1]",
          explanation:
            "A visual representation of an adjustable actuator position; its adjustment method and scale vary across the described arrangements.",
        },
        {
          id: "switch_eps",
          symbol: "\\epsilon",
          name: "Exhibit Event Band",
          color: "cyan",
          role: "Deterministic tolerance used only to make a discrete display event visible",
          unit: "normalized tolerance",
          dimension: "[1]",
          explanation:
            "The historical document describes an actuator arm but does not give its travel, overtravel, hysteresis, or contact tolerance.",
        },
        {
          id: "motor_stop",
          symbol: "S_{\\text{motor}}",
          name: "Active Motor Stop Relay",
          color: "crimson",
          role: "Displayed stopped-control state",
          unit: "state",
          dimension: "[1]",
          explanation:
            "A state label representing the patent's described control relationship; no switching time or electrical circuit response is inferred.",
        },
        {
          id: "next_start",
          symbol: "F_{\\text{next}}",
          name: "Subsequent Motor Start Pulse",
          color: "amethyst",
          role: "Displayed availability of the next selected control relationship",
          unit: "state",
          dimension: "[1]",
          explanation:
            "A state label used to show the described start/stop sequence without asserting an unprinted relay topology or timing law.",
        },
      ],
      pedagogicalNote:
        "The Boolean expression is a display abstraction of selected switch-actuator events described in the specification and Claims 8 and 15. It does not model contact dynamics, relay wiring, safety interlocks, or collision avoidance.",
      claimRef: 15,
      historicalSignificance:
        "Claim 15 recites selected-position switching that causes one servo means to stop and another to start in a repetitive conveying cycle.",
    },
  ];

  catalogue["us-3728480-baer-odyssey"] = [
    {
      id: "baer-rc-delay-positioning",
      patentId: "us-3728480-baer-odyssey",
      title: "Monostable RC Time-Delay Coordinate Positioning",
      category: "Cathode Ray Timing & Pulse Electronics",
      rawLatex: "\\tau_H = R_X C_H \\ln\\left(\\frac{V_{cc}}{V_{cc} - V_{\\text{th}}}\\right)",
      colorizedLatex:
        "\\textcolor{#059669}{\\tau_H} = \\textcolor{#2563eb}{R_X} \\textcolor{#d97706}{C_H} \\ln\\left(\\frac{\\textcolor{#9333ea}{V_{cc}}}{\\textcolor{#9333ea}{V_{cc}} - \\textcolor{#e11d48}{V_{\\text{th}}}}\\right)",
      plainEnglishSentence: [
        { text: "The " },
        { text: "horizontal spot delay time", variableId: "delay_time" },
        { text: " equals the " },
        { text: "player potentiometer resistance", variableId: "pot_res" },
        { text: " times the " },
        { text: "timing capacitance", variableId: "timing_cap" },
        { text: " scaled by the natural log of " },
        { text: "supply voltage", variableId: "supply_v" },
        { text: " over the difference with " },
        { text: "transistor threshold voltage", variableId: "thresh_v" },
        { text: "." },
      ],
      variables: [
        {
          id: "delay_time",
          symbol: "\\tau_H",
          name: "Horizontal Line Delay Time",
          color: "emerald",
          role: "Pulse delay interval determining horizontal X coordinate on CRT",
          unit: "microseconds (µs)",
          dimension: "[T]",
          explanation:
            "Variable time interval elapsed from the horizontal sync pulse before triggering the dot pulse shaper, spanning 9 µs to 57 µs across the active line.",
          telemetryKey: "p1DelayHMicrosec",
          telemetryMetricLabel: "P1 Horizontal Delay",
        },
        {
          id: "pot_res",
          symbol: "R_X",
          name: "Player Potentiometer Resistance",
          color: "sapphire",
          role: "Manually adjusted participant control resistance",
          unit: "ohms (Ω)",
          dimension: "[M L² T⁻³ I⁻²]",
          explanation:
            "Turning the hand-held controller knob varies resistance, dynamically altering the RC charge rate and shifting the dot across the screen.",
        },
        {
          id: "timing_cap",
          symbol: "C_H",
          name: "Monostable Timing Capacitor",
          color: "amber",
          role: "Fixed timing capacitance in dot generator multivibrator",
          unit: "farads (F)",
          dimension: "[M⁻¹ L⁻² T⁴ I²]",
          explanation:
            "Standard mica/ceramic capacitor in the monostable base circuit charged through the player potentiometer.",
        },
        {
          id: "supply_v",
          symbol: "V_{cc}",
          name: "Collector DC Supply Voltage",
          color: "amethyst",
          role: "Master DC bias rail potential",
          unit: "volts (V)",
          dimension: "[M L² T⁻³ I⁻¹]",
          explanation:
            "Nominal +9V or +12V battery rail powering the discrete bipolar transistor multivibrator stages.",
        },
        {
          id: "thresh_v",
          symbol: "V_{\\text{th}}",
          name: "Base-Emitter Turn-On Threshold",
          color: "rose",
          role: "Transistor conduction threshold voltage",
          unit: "volts (V)",
          dimension: "[M L² T⁻³ I⁻¹]",
          explanation:
            "Forward bias potential (~0.7V for silicon) required to switch the pulse-forming transistor into conduction.",
        },
      ],
      pedagogicalNote:
        "Ralph Baer's breakthrough was realizing that 2D coordinates on a raster-scanned cathode ray tube map 1:1 to microsecond time delays: horizontal position is governed by a 15.75 kHz RC clock and vertical position by a 60 Hz RC clock.",
      claimRef: 1,
      historicalSignificance:
        "Claim 1 covers generating video dots synchronized with television raster scan and manipulating their positions via participant controls.",
    },
    {
      id: "baer-coincidence-gating",
      patentId: "us-3728480-baer-odyssey",
      title: "Diode AND-Gate Spot Collision & Hit Coincidence",
      category: "Digital Logic & Collision Mechanics",
      rawLatex: "V_{\\text{hit}}(t) = V_{\\text{paddle}}(t) \\cdot V_{\\text{ball}}(t)",
      colorizedLatex:
        "\\textcolor{#059669}{V_{\\text{hit}}(t)} = \\textcolor{#2563eb}{V_{\\text{paddle}}(t)} \\cdot \\textcolor{#d97706}{V_{\\text{ball}}(t)}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "coincidence collision voltage pulse", variableId: "v_hit" },
        { text: " is high only when the " },
        { text: "paddle video pulse", variableId: "v_paddle" },
        { text: " and " },
        { text: "ball video pulse", variableId: "v_ball" },
        { text: " simultaneously overlap in time and raster scan space." },
      ],
      variables: [
        {
          id: "v_hit",
          symbol: "V_{\\text{hit}}(t)",
          name: "Coincidence Output Pulse Voltage",
          color: "emerald",
          role: "Output pulse indicating geometric intersection on CRT",
          unit: "volts (V)",
          dimension: "[M L² T⁻³ I⁻¹]",
          explanation:
            "A positive voltage pulse produced when the electron beam paints both paddle and ball in the same microsecond raster interval.",
          telemetryKey: "coincidenceActive",
          telemetryMetricLabel: "Coincidence Active",
        },
        {
          id: "v_paddle",
          symbol: "V_{\\text{paddle}}(t)",
          name: "Paddle Symbol Video Pulse",
          color: "sapphire",
          role: "Luminance pulse from player 1 or 2 dot generator",
          unit: "volts (V)",
          dimension: "[M L² T⁻³ I⁻¹]",
          explanation:
            "Video pulse gated by ANDing the player's horizontal delay pulse and vertical delay pulse.",
        },
        {
          id: "v_ball",
          symbol: "V_{\\text{ball}}(t)",
          name: "Ball / Target Video Pulse",
          color: "amber",
          role: "Luminance pulse from ball generator or light gun target",
          unit: "volts (V)",
          dimension: "[M L² T⁻³ I⁻¹]",
          explanation:
            "Video pulse representing the moving ball dot or light gun target spot on the cathode ray phosphor.",
        },
      ],
      pedagogicalNote:
        "Because the television electron beam scans one pixel at a time, two on-screen objects collide if and only if their video pulses occur at the exact same instant in time. A simple two-diode AND gate performs real-time collision detection with zero computational overhead.",
      historicalSignificance:
        "Coincidence detection allowed the Magnavox Odyssey to execute dynamic interactive gameplay (tennis rallies, target shooting, wall bounces) entirely with analog and RTL discrete circuitry.",
    },
  ];

  catalogue["us-4063220-metcalfe-ethernet"] = [
    {
      id: "metcalfe-wave-propagation",
      patentId: "us-4063220-metcalfe-ethernet",
      title: "Coaxial Cable Electromagnetic Wave Propagation & Delay",
      category: "Electrodynamics & Transmission Lines",
      rawLatex: "v = \\frac{c}{\\sqrt{\\epsilon_r}}, \\quad \\tau_{\\text{prop}} = \\frac{L}{v}",
      colorizedLatex:
        "\\textcolor{#2563eb}{v} = \\frac{\\textcolor{#d97706}{c}}{\\sqrt{\\textcolor{#059669}{\\epsilon_r}}}, \\quad \\textcolor{#dc2626}{\\tau_{\\text{prop}}} = \\frac{\\textcolor{#9333ea}{L}}{\\textcolor{#2563eb}{v}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "signal propagation velocity", variableId: "v_prop" },
        { text: " through the coaxial cable depends on the " },
        { text: "speed of light in vacuum", variableId: "c_light" },
        { text: " divided by the square root of the dielectric " },
        { text: "relative permittivity", variableId: "eps_r" },
        { text: ", producing a total " },
        { text: "one-way cable propagation delay", variableId: "tau_prop" },
        { text: " proportional to " },
        { text: "cable length", variableId: "length_m" },
        { text: "." },
      ],
      variables: [
        {
          id: "v_prop",
          symbol: "v",
          name: "Electromagnetic Propagation Velocity",
          color: "sapphire",
          role: "Wave speed along coaxial transmission line (~0.66c)",
          unit: "meters/second (m/s)",
          dimension: "[L T⁻¹]",
          explanation:
            "The speed at which electrical signals propagate down the coaxial transmission line, reduced by the dielectric material to approximately 200,000 km/s (5 ns per meter).",
          telemetryKey: "propVelocityMps",
          telemetryMetricLabel: "Wave Velocity",
          valueFormat: {
            style: "fixed",
            fractionDigits: 1,
            scale: 1e-6,
            suffix: " ×10⁶ m/s",
          },
        },
        {
          id: "c_light",
          symbol: "c",
          name: "Speed of Light in Vacuum",
          color: "amber",
          role: "Universal fundamental speed of light",
          unit: "meters/second (m/s)",
          dimension: "[L T⁻¹]",
          explanation: "Physical constant equal to 299,792,458 m/s.",
        },
        {
          id: "eps_r",
          symbol: "\\epsilon_r",
          name: "Dielectric Relative Permittivity",
          color: "emerald",
          role: "Dielectric constant of polyethylene insulator",
          unit: "dimensionless",
          dimension: "[1]",
          explanation:
            "Solid or foamed polyethylene dielectric insulation surrounding the central copper conductor (typically 2.25).",
        },
        {
          id: "tau_prop",
          symbol: "\\tau_{\\text{prop}}",
          name: "One-Way Propagation Delay",
          color: "crimson",
          role: "End-to-end signal flight time across the bus",
          unit: "nanoseconds (ns)",
          dimension: "[T]",
          explanation:
            "The time required for an electromagnetic wavefront to travel from one end of the cable segment to the opposite transceiver.",
          telemetryKey: "oneWayPropDelayNs",
          telemetryMetricLabel: "One-Way Cable Delay",
          valueFormat: { style: "fixed", fractionDigits: 1, suffix: " ns" },
        },
        {
          id: "length_m",
          symbol: "L",
          name: "Coaxial Cable Bus Length",
          color: "amethyst",
          role: "Physical end-to-end length of the shared medium",
          unit: "meters (m)",
          dimension: "[L]",
          explanation:
            "Total physical distance along the shared 50-ohm coaxial cable bus between terminal termination resistors.",
        },
      ],
      pedagogicalNote:
        "Because electricity does not propagate instantaneously, a station at one end of a 500-meter cable cannot know another station began transmitting until 2.5 microseconds later. This propagation latency creates the vulnerability window in which collisions can occur.",
      claimRef: 1,
      historicalSignificance:
        "Understanding propagation delay led Metcalfe and Boggs to define the slot time as twice the maximum round-trip propagation time, guaranteeing that any collision anywhere on the cable is detected by all transmitting nodes.",
    },
    {
      id: "metcalfe-exponential-backoff",
      patentId: "us-4063220-metcalfe-ethernet",
      title: "Truncated Binary Exponential Backoff Retransmission Algorithm",
      category: "Distributed Algorithms & Network Protocol Dynamics",
      rawLatex:
        "T_{\\text{backoff}} = r \\cdot T_{\\text{slot}}, \\quad r \\in \\left[0, 2^{\\min(n, 10)} - 1\\right]",
      colorizedLatex:
        "\\textcolor{#059669}{T_{\\text{backoff}}} = \\textcolor{#2563eb}{r} \\cdot \\textcolor{#d97706}{T_{\\text{slot}}}, \\quad \\textcolor{#2563eb}{r} \\in \\left[0, 2^{\\min(\\textcolor{#dc2626}{n}, 10)} - 1\\right]",
      plainEnglishSentence: [
        { text: "The " },
        { text: "randomized backoff retransmission delay", variableId: "t_backoff" },
        { text: " equals a pseudo-random integer " },
        { text: "slot multiplier", variableId: "r_slot" },
        { text: " multiplied by the " },
        { text: "contention slot time", variableId: "t_slot" },
        { text: ", where the random range doubles exponentially with each successive " },
        { text: "collision count", variableId: "col_count" },
        { text: " up to 10 attempts." },
      ],
      variables: [
        {
          id: "t_backoff",
          symbol: "T_{\\text{backoff}}",
          name: "Retransmission Backoff Delay",
          color: "emerald",
          role: "Calculated waiting interval before next transmission attempt",
          unit: "microseconds (µs)",
          dimension: "[T]",
          explanation:
            "The duration a station must remain silent before attempting to retransmit a packet that previously suffered a collision.",
          telemetryKey: "backoffMeanDelayMicrosec",
          telemetryMetricLabel: "Mean Backoff Delay",
          valueFormat: { style: "fixed", fractionDigits: 2, suffix: " µs" },
        },
        {
          id: "r_slot",
          symbol: "r",
          name: "Random Slot Choice Integer",
          color: "sapphire",
          role: "Uniformly distributed pseudo-random integer",
          unit: "integer",
          dimension: "[1]",
          explanation:
            "A random integer selected uniformly from the range [0, 2^k - 1], generated by comparing an asynchronous fast clock to the transmitter bit clock.",
        },
        {
          id: "t_slot",
          symbol: "T_{\\text{slot}}",
          name: "Contention Slot Time",
          color: "amber",
          role: "Fundamental time slot quantum (2τ_prop + 2t_turnaround)",
          unit: "microseconds (µs)",
          dimension: "[T]",
          explanation:
            "The minimum time required to guarantee that all stations on the network detect a collision event (nominal 5.12 µs or 51.2 µs).",
          telemetryKey: "slotTimeMicrosec",
          telemetryMetricLabel: "Slot Time",
          valueFormat: { style: "fixed", fractionDigits: 2, suffix: " µs" },
        },
        {
          id: "col_count",
          symbol: "n",
          name: "Repeated Collision Count",
          color: "crimson",
          role: "Number of consecutive collisions experienced by the current packet",
          unit: "count",
          dimension: "[1]",
          explanation:
            "The integer tally of collisions suffered by a packet, stored in the collision counter and capped at 10 for exponential scaling (and 16 for packet discard).",
        },
      ],
      pedagogicalNote:
        "If two stations pick the same delay after a collision, they will collide again forever. By doubling the delay pool after each collision (1 slot -> 2 -> 4 -> 8 -> ... -> 1024), the probability of repeated collisions rapidly approaches zero, automatically adapting to varying network loads.",
      claimRef: 12,
      historicalSignificance:
        "Binary Exponential Backoff is one of the most celebrated algorithms in computer science history. It enabled decentralized local area networks to achieve over 95% channel throughput under heavy load without needing any central traffic arbiter.",
    },
  ];

  catalogue["us-2318259-sikorsky-helicopter"] = [
    {
      id: "sikorsky-anti-torque-equilibrium",
      patentId: "us-2318259-sikorsky-helicopter",
      title: "Modern Anti-Torque Moment-Balance Lens",
      category: "Rotary-Wing Aerodynamics & Flight Mechanics",
      rawLatex:
        "T_{\\text{tail}} \\cdot L_{\\text{boom}} = Q_{\\text{main}} = \\frac{P_{\\text{main}}}{\\Omega_{\\text{main}}}",
      colorizedLatex:
        "\\textcolor{#059669}{T_{\\text{tail}}} \\cdot \\textcolor{#2563eb}{L_{\\text{boom}}} = \\textcolor{#dc2626}{Q_{\\text{main}}} = \\frac{\\textcolor{#7c3aed}{P_{\\text{main}}}}{\\textcolor{#d97706}{\\Omega_{\\text{main}}}}",
      plainEnglishSentence: [
        { text: "The " },
        { text: "anti-torque lateral thrust", variableId: "t_tail" },
        { text: " generated by the tail rotor multiplied by the " },
        { text: "tail boom moment arm", variableId: "l_boom" },
        { text: " can balance the " },
        { text: "main rotor torque reaction", variableId: "q_main" },
        { text: ", which equals total " },
        { text: "aerodynamic shaft power", variableId: "p_main" },
        { text: " divided by " },
        { text: "rotor angular velocity", variableId: "omega_main" },
        { text: "." },
      ],
      variables: [
        {
          id: "t_tail",
          symbol: "T_{\\text{tail}}",
          name: "Tail Rotor Anti-Torque Thrust",
          color: "emerald",
          role: "Horizontal lateral force generated by auxiliary vertical tail propeller",
          unit: "newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "The lateral aerodynamic force produced by the variable-pitch tail rotor to counteract main rotor reaction torque.",
          telemetryKey: "tailRotorThrustNewtons",
          telemetryMetricLabel: "Tail Rotor Thrust",
          valueFormat: { style: "fixed", fractionDigits: 1, suffix: " N" },
        },
        {
          id: "l_boom",
          symbol: "L_{\\text{boom}}",
          name: "Tail Boom Moment Arm",
          color: "sapphire",
          role: "Perpendicular distance from main rotor mast to tail rotor hub",
          unit: "meters (m)",
          dimension: "[L]",
          explanation:
            "The moment arm separating the main mast from the auxiliary rotor. The live scenario selects 4.8 m; US 2,318,259 prints no boom dimension.",
        },
        {
          id: "q_main",
          symbol: "Q_{\\text{main}}",
          name: "Main Rotor Aerodynamic Torque Reaction",
          color: "crimson",
          role: "Newtonian reactive torque exerted by rotating blades on fuselage",
          unit: "newton-meters (N·m)",
          dimension: "[M L^2 T^-2]",
          explanation:
            "The rotational resistance opposing main rotor spin that tends to spin the aircraft fuselage in the opposite direction.",
          telemetryKey: "mainRotorTorqueNm",
          telemetryMetricLabel: "Main Rotor Torque",
          valueFormat: { style: "fixed", fractionDigits: 1, suffix: " N·m" },
        },
        {
          id: "p_main",
          symbol: "P_{\\text{main}}",
          name: "Main Rotor Aerodynamic Shaft Power",
          color: "amethyst",
          role: "Total mechanical engine power delivered to main rotor shaft",
          unit: "watts (W)",
          dimension: "[M L^2 T^-3]",
          explanation:
            "The sum of induced downwash power and blade profile drag power required to sustain vertical hover.",
          telemetryKey: "mainRotorPowerWatts",
          telemetryMetricLabel: "Main Rotor Power",
          valueFormat: { style: "fixed", fractionDigits: 1, scale: 1e-3, suffix: " kW" },
        },
        {
          id: "omega_main",
          symbol: "\\Omega_{\\text{main}}",
          name: "Main Rotor Angular Velocity",
          color: "amber",
          role: "Rotational speed of main lifting rotor",
          unit: "radians per second (rad/s)",
          dimension: "[T^-1]",
          explanation:
            "The rotational rate of the main rotor hub. The live scenario starts at 260 RPM; US 2,318,259 prints no operating speed.",
          telemetryKey: "rotorAngularVelocityRadPerSec",
          telemetryMetricLabel: "Rotor Angular Velocity",
          valueFormat: { style: "fixed", fractionDigits: 1, suffix: " rad/s" },
        },
      ],
      pedagogicalNote:
        "Newton's third law gives the main-rotor reaction torque, while an orthogonal auxiliary rotor supplies a controllable opposing moment. The grant discloses that topology and pitch control; the live dimensions, speeds, forces, and powers are explicitly modern scenario assumptions.",
      claimRef: 2,
      historicalSignificance:
        "US 2,318,259 claims a direct-lift main rotor combined with an orthogonal variable-pitch auxiliary rotor and describes both manual and vane-responsive directional control.",
    },
    {
      id: "sikorsky-rankine-froude-thrust",
      patentId: "us-2318259-sikorsky-helicopter",
      title: "Modern Rankine-Froude Rotor-Disk Lens",
      category: "Rotor Disk Aerodynamics & Induced Flow",
      rawLatex: "T_{\\text{main}} = 2 \\rho A v_i^2 = C_T \\rho A (\\Omega R)^2",
      colorizedLatex:
        "\\textcolor{#059669}{T_{\\text{main}}} = 2 \\textcolor{#2563eb}{\\rho} \\textcolor{#7c3aed}{A} \\textcolor{#dc2626}{v_i}^2 = \\textcolor{#d97706}{C_T} \\textcolor{#2563eb}{\\rho} \\textcolor{#7c3aed}{A} (\\textcolor{#0891b2}{\\Omega} \\textcolor{#ea580c}{R})^2",
      plainEnglishSentence: [
        { text: "Total " },
        { text: "main rotor vertical thrust", variableId: "t_main" },
        { text: " equals twice the " },
        { text: "air density", variableId: "rho_air" },
        { text: " multiplied by " },
        { text: "rotor disk area", variableId: "a_disk" },
        { text: " and squared " },
        { text: "induced downwash velocity", variableId: "v_induced" },
        { text: ", parameterized by " },
        { text: "thrust coefficient", variableId: "c_t" },
        { text: " and blade tip speed " },
        { text: "Ω", variableId: "omega_r" },
        { text: "·" },
        { text: "R", variableId: "r_radius" },
        { text: "." },
      ],
      variables: [
        {
          id: "t_main",
          symbol: "T_{\\text{main}}",
          name: "Main Rotor Total Aerodynamic Thrust",
          color: "emerald",
          role: "Net vertical sustaining lift force",
          unit: "newtons (N)",
          dimension: "[M L T^-2]",
          explanation:
            "The total upward aerodynamic force generated by accelerating air downward through the rotor disk.",
          telemetryKey: "mainRotorThrustNewtons",
          telemetryMetricLabel: "Main Rotor Thrust",
          valueFormat: { style: "fixed", fractionDigits: 1, suffix: " N" },
        },
        {
          id: "rho_air",
          symbol: "\\rho",
          name: "Ambient Air Density",
          color: "sapphire",
          role: "Atmospheric fluid density at sea level",
          unit: "kg/m³",
          dimension: "[M L^-3]",
          explanation: "Standard atmospheric density (1.225 kg/m³ at sea level).",
        },
        {
          id: "a_disk",
          symbol: "A",
          name: "Rotor Disk Swept Area",
          color: "amethyst",
          role: "Circular swept area of rotating blades (π·R²)",
          unit: "square meters (m²)",
          dimension: "[L^2]",
          explanation:
            "The circular area swept by the blades. The live scenario uses a 4.27 m radius; the grant supplies no rotor diameter.",
        },
        {
          id: "v_induced",
          symbol: "v_i",
          name: "Induced Downwash Flow Velocity",
          color: "crimson",
          role: "Mean vertical velocity of air driven through rotor disk",
          unit: "meters per second (m/s)",
          dimension: "[L T^-1]",
          explanation:
            "The downward airflow velocity induced at the rotor plane required to produce momentum thrust.",
          telemetryKey: "inducedVelocityMs",
          telemetryMetricLabel: "Downwash Velocity",
          valueFormat: { style: "fixed", fractionDigits: 2, suffix: " m/s" },
        },
        {
          id: "c_t",
          symbol: "C_T",
          name: "Dimensionless Thrust Coefficient",
          color: "amber",
          role: "Blade element lift parameter proportional to collective pitch",
          unit: "dimensionless",
          dimension: "[1]",
          explanation:
            "A dimensionless ratio determined by blade chord, airfoil profile, and collective pitch angle.",
        },
        {
          id: "omega_r",
          symbol: "\\Omega",
          name: "Rotor Angular Velocity",
          color: "cyan",
          role: "Rotational rate of main rotor",
          unit: "rad/s",
          dimension: "[T^-1]",
          explanation:
            "Main-rotor rotational speed in the modern teaching scenario; the grant supplies no RPM calibration.",
        },
        {
          id: "r_radius",
          symbol: "R",
          name: "Main Rotor Blade Radius",
          color: "amber",
          role: "Span length from mast center to blade tip",
          unit: "meters (m)",
          dimension: "[L]",
          explanation:
            "Selected 4.27 m radius for the modern teaching scenario, not a dimension printed by US 2,318,259.",
        },
      ],
      pedagogicalNote:
        "A momentum-theory rotor model explains how downward air momentum supports hover and how ground proximity changes induced flow. This is a modern engineering lens around the claimed mechanism, not mathematics or calibration printed in the grant.",
      historicalSignificance:
        "The specification explains collective pitch change and periodic fore/aft and lateral lift variation through its movable pitch-control member; the equation supplies a modern quantitative interpretation of that source-described control system.",
    },
  ];
}
