export interface LineageStep {
  patentId: string;
  year: string;
  role: "foundational" | "direct-antecedent" | "breakthrough" | "successor" | "modern-culmination";
  roleLabel: string;
  technicalConcept: string;
}

export interface PatentLineage {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  steps: LineageStep[];
}

export const ALL_PATENT_LINEAGES: PatentLineage[] = [
  {
    id: "motive-power",
    category: "Mechanical & Motive Power",
    title: "The Evolution of Motive Power",
    subtitle: "From External Steam Condensation to Continuous Reaction Turbojets",
    description:
      "A 170-year continuous mechanical lineage spanning external thermal condensation, precision cut-off steam engines, 4-stroke internal combustion, reaction steam turbines, and continuous jet propulsion.",
    steps: [
      {
        patentId: "gb-913-watt-separate-condenser",
        year: "1769",
        role: "foundational",
        roleLabel: "Foundational Origin",
        technicalConcept:
          "Separate external steam condenser eliminating cylinder cyclic quenching.",
      },
      {
        patentId: "us-6162-corliss-steam-engine",
        year: "1849",
        role: "direct-antecedent",
        roleLabel: "Thermal Efficiency Leap",
        technicalConcept:
          "Wrist-plate rotary valves with governor-controlled variable expansion cut-off.",
      },
      {
        patentId: "us-194047-otto-engine",
        year: "1877",
        role: "breakthrough",
        roleLabel: "Four-Stroke Cycle",
        technicalConcept: "Four-stroke compression-ignition Otto cycle internal combustion.",
      },
      {
        patentId: "us-361931-daimler-engine",
        year: "1887",
        role: "successor",
        roleLabel: "High-Speed Petroleum Engine",
        technicalConcept:
          "Lightweight, high-speed single-cylinder gasoline engine with surface carburetor.",
      },
      {
        patentId: "us-542846-diesel-engine",
        year: "1895",
        role: "successor",
        roleLabel: "Compression Ignition",
        technicalConcept:
          "Extreme compression air heating triggering self-ignition of injected liquid fuel.",
      },
      {
        patentId: "us-608969-parsons-turbine",
        year: "1898",
        role: "modern-culmination",
        roleLabel: "Reaction Steam Turbine",
        technicalConcept:
          "Multi-stage axial reaction steam expansion across alternating fixed/moving blades.",
      },
    ],
  },
  {
    id: "telecom-signals",
    category: "Telecommunications & Optics",
    title: "Signal Transmission & Electronic Media",
    subtitle: "From Binary Wire Telegraphy to Packet-Switched Ethernet",
    description:
      "The unbroken electrical signal lineage through binary wire signaling, analog acoustic current modulation, spark wireless, triode amplification, electronic television, and multipoint computer packet networking.",
    steps: [
      {
        patentId: "us-1647-morse-telegraph",
        year: "1840",
        role: "foundational",
        roleLabel: "Binary Telegraph Origin",
        technicalConcept:
          "Electromagnetic sounder, galvanic battery relay, and binary dot-dash dot coding.",
      },
      {
        patentId: "us-174465-bell-telephone",
        year: "1876",
        role: "breakthrough",
        roleLabel: "Acoustic Audio Modulation",
        technicalConcept:
          "Liquid transmitter variable resistance converting sound pressure to undulating current.",
      },
      {
        patentId: "us-235199-bell-photophone",
        year: "1880",
        role: "direct-antecedent",
        roleLabel: "Free-Space Optical Beam",
        technicalConcept:
          "Modulated sunlight beam reflected off voice diaphragm onto photoconductive selenium.",
      },
      {
        patentId: "us-586193-marconi-radio",
        year: "1897",
        role: "direct-antecedent",
        roleLabel: "Syntonic Wireless Telegraphy",
        technicalConcept:
          "Spark gap dipole radiator, elevated aerial wire, and tuned coherer RF reception.",
      },
      {
        patentId: "us-706737-fessenden-wireless",
        year: "1902",
        role: "successor",
        roleLabel: "Continuous-Wave Modulation",
        technicalConcept:
          "High-frequency continuous sine-wave carrier modulated by acoustic speech signals.",
      },
      {
        patentId: "us-879532-de-forest-audion",
        year: "1908",
        role: "breakthrough",
        roleLabel: "Active Triode Amplification",
        technicalConcept:
          "Third perforated control grid modulating cathode-to-anode vacuum electron flow.",
      },
      {
        patentId: "us-1773980-farnsworth-tv",
        year: "1930",
        role: "successor",
        roleLabel: "All-Electronic Video Raster",
        technicalConcept:
          "Continuous photoelectric cathode scanning image dissector without mechanical wheels.",
      },
      {
        patentId: "us-2292387-lamarr-frequency-hopping",
        year: "1942",
        role: "successor",
        roleLabel: "Spread-Spectrum Architecture",
        technicalConcept:
          "Synchronized punched-tape hopping across 88 carrier frequencies to resist jamming.",
      },
      {
        patentId: "us-4063220-metcalfe-ethernet",
        year: "1977",
        role: "modern-culmination",
        roleLabel: "Local Network Packet Grid",
        technicalConcept:
          "Carrier-sense multiple access with collision detection (CSMA/CD) packet broadcasting.",
      },
    ],
  },
  {
    id: "electrification-power",
    category: "Electricity & Magnetism",
    title: "The Polyphase Electric Grid",
    subtitle: "From Direct-Current Motors to Resonant Alternating Power Systems",
    description:
      "The electrical revolution that replaced localized chemical galvanic cells and direct current with universal polyphase induction motors and high-voltage transmission.",
    steps: [
      {
        patentId: "us-132-davenport-electric-motor",
        year: "1837",
        role: "foundational",
        roleLabel: "First Rotary Electric Motor",
        technicalConcept:
          "Commutator-switched electromagnets creating continuous rotary motive torque.",
      },
      {
        patentId: "us-120057-gramme-dynamo",
        year: "1871",
        role: "direct-antecedent",
        roleLabel: "Continuous DC Dynamo",
        technicalConcept:
          "Closed-ring continuous toroidal armature eliminating pulsating current ripple.",
      },
      {
        patentId: "us-223898-edison-lightbulb",
        year: "1880",
        role: "breakthrough",
        roleLabel: "High-Resistance Parallel Grid",
        technicalConcept:
          "High-resistance carbon filament in high vacuum enabling parallel circuit distribution.",
      },
      {
        patentId: "us-381968-tesla-motor",
        year: "1888",
        role: "breakthrough",
        roleLabel: "Rotating Magnetic Field",
        technicalConcept:
          "Independent out-of-phase AC currents inducing rotor torque without brushes or sparks.",
      },
      {
        patentId: "us-593138-tesla-coil",
        year: "1897",
        role: "modern-culmination",
        roleLabel: "Resonant High-Frequency Transformer",
        technicalConcept:
          "Air-core loosely coupled resonant LC circuits generating high-potential oscillations.",
      },
    ],
  },
  {
    id: "computing-microelectronics",
    category: "Computing & Semiconductors",
    title: "The Silicon Microelectronics Revolution",
    subtitle: "From Punched-Card Tabulators to Multi-Touch Human Interfaces",
    description:
      "The digital computation lineage that replaced mechanical gear teeth with point-contact semiconductor switches, monolithic planar circuits, personal computers, and touch glass.",
    steps: [
      {
        patentId: "us-395781-hollerith-tabulating",
        year: "1889",
        role: "foundational",
        roleLabel: "Electromechanical Data Storage",
        technicalConcept:
          "Conductive mercury cup contacts sensing punched holes in structured card records.",
      },
      {
        patentId: "us-2524035-bardeen-transistor",
        year: "1950",
        role: "breakthrough",
        roleLabel: "Solid-State Transistor Origin",
        technicalConcept:
          "Point-contact emitter/collector gold cat-whiskers modulating minority carrier diffusion.",
      },
      {
        patentId: "us-2981877-noyce-ic",
        year: "1961",
        role: "breakthrough",
        roleLabel: "Planar Monolithic Circuit",
        technicalConcept:
          "Oxide passivation, photolithographic isolation, and evaporated aluminium leads on silicon.",
      },
      {
        patentId: "us-3138743-kilby-integrated-circuit",
        year: "1964",
        role: "direct-antecedent",
        roleLabel: "Miniaturized Solid Circuit",
        technicalConcept:
          "Semiconductor wafer containing active transistors and passive resistive components.",
      },
      {
        patentId: "us-3541541-engelbart-mouse",
        year: "1970",
        role: "successor",
        roleLabel: "Interactive Spatial Input",
        technicalConcept:
          "Orthogonal rolling wheels driving potentiometers to translate hand motion to screen cursor.",
      },
      {
        patentId: "us-4136359-wozniak-apple",
        year: "1979",
        role: "successor",
        roleLabel: "Integrated Microcomputer",
        technicalConcept:
          "Shared-RAM timing generator enabling flicker-free color microprocessor video generation.",
      },
      {
        patentId: "us-6285999-pagerank",
        year: "2001",
        role: "successor",
        roleLabel: "Global Information Graph",
        technicalConcept:
          "Eigenvector centrality algorithm weighting web document importance by hyperlink graph.",
      },
      {
        patentId: "us-7479949-multitouch",
        year: "2009",
        role: "modern-culmination",
        roleLabel: "Capacitive Gestural Surface",
        technicalConcept:
          "Mutual capacitance sensor matrix resolving concurrent discrete finger touch trajectories.",
      },
    ],
  },
  {
    id: "robotics-automation",
    category: "Robotics & Kinematics",
    title: "Robotic Manipulation & Kinematic Degrees of Freedom",
    subtitle: "From Nuclear Hot-Cell Teleoperation to Parallel Delta Delta Manipulators",
    description:
      "The kinematics and robotics lineage that transformed remote mechanical linkages into programmable magnetic-drum arms, selective-compliance SCARA robots, and high-speed delta mechanisms.",
    steps: [
      {
        patentId: "us-2846084-goertz-electronic-master-slave-manipulator",
        year: "1958",
        role: "foundational",
        roleLabel: "Bilateral Force-Reflecting Teleoperation",
        technicalConcept:
          "Position-error servomechanisms returning remote contact force feedback to human operator.",
      },
      {
        patentId: "us-2988237-devol-programmed-transfer",
        year: "1961",
        role: "breakthrough",
        roleLabel: "Programmable Robotic Manipulator",
        technicalConcept:
          "Magnetic recording drum storing multi-axis coordinate trajectories for playback.",
      },
      {
        patentId: "us-3081379-lemelson-machine-vision",
        year: "1963",
        role: "direct-antecedent",
        roleLabel: "Automated Visual Inspection",
        technicalConcept:
          "Video scanning raster signal comparison against reference templates for parts inspection.",
      },
      {
        patentId: "us-3212649-amf-versatran",
        year: "1965",
        role: "successor",
        roleLabel: "Continuous Hydraulic Articulation",
        technicalConcept:
          "Hydraulic servo actuation delivering coordinated multi-axis industrial transfer movements.",
      },
      {
        patentId: "us-4068536-stackhouse-manipulator",
        year: "1978",
        role: "successor",
        roleLabel: "6-DOF Anthropomorphic Arm",
        technicalConcept:
          "Electrically actuated revolute joints mimicking the human shoulder, elbow, and 3-axis wrist.",
      },
      {
        patentId: "us-4098001-watson-rcc",
        year: "1978",
        role: "successor",
        roleLabel: "Remote-Center Passive Compliance",
        technicalConcept:
          "Geometric elastic shear pads placing the center of compliance at the tip of the inserted peg.",
      },
      {
        patentId: "us-4341502-makino-scara",
        year: "1982",
        role: "successor",
        roleLabel: "Selective Compliance (SCARA)",
        technicalConcept:
          "Rigid vertical axis combined with compliant horizontal planar articulation for assembly.",
      },
      {
        patentId: "us-4512709-milacron-robot-toolchanger",
        year: "1985",
        role: "successor",
        roleLabel: "Automatic Robotic Tool Changer",
        technicalConcept:
          "Precision kinematic docking interface transferring pneumatic, electrical, and mechanical tools.",
      },
      {
        patentId: "us-4976582-clavel-delta-robot",
        year: "1990",
        role: "modern-culmination",
        roleLabel: "High-Speed Parallel Delta Kinematics",
        technicalConcept:
          "Three closed-loop parallelograms moving a lightweight traveling plate with high acceleration.",
      },
      {
        patentId: "us-6594844-roomba",
        year: "2003",
        role: "modern-culmination",
        roleLabel: "Autonomous Mobile Spatial Navigation",
        technicalConcept:
          "Dual differential drive wheels and sensor-guided state machine traversing unmapped rooms.",
      },
    ],
  },
  {
    id: "materials-chemistry",
    category: "Materials Science & Chemistry",
    title: "Synthetic Polymers & Advanced Molecular Engineering",
    subtitle: "From Sulfur Vulcanization to Liquid-Crystalline Kevlar",
    description:
      "The chemical synthesis lineage that converted natural raw resins into vulcanized elastomers, thermosetting phenolics, and bulletproof liquid-crystalline polyamides.",
    steps: [
      {
        patentId: "us-3633-goodyear-rubber",
        year: "1844",
        role: "foundational",
        roleLabel: "Covalent Polymer Crosslinking",
        technicalConcept:
          "Heat and sulfur treatment establishing disulfide bridges across polyisoprene polymer chains.",
      },
      {
        patentId: "us-105338-hyatt-celluloid",
        year: "1870",
        role: "direct-antecedent",
        roleLabel: "First Synthetic Thermoplastic",
        technicalConcept:
          "Camphor plasticization of cellulose nitrate yielding moldable, shatter-resistant celluloid.",
      },
      {
        patentId: "us-400766-hall-aluminium",
        year: "1889",
        role: "breakthrough",
        roleLabel: "Electrolytic Metal Reduction",
        technicalConcept:
          "Molten cryolite bath dissolving alumina for low-temperature carbon-cathode electrolysis.",
      },
      {
        patentId: "us-942699-baekeland-bakelite",
        year: "1909",
        role: "breakthrough",
        roleLabel: "Fully Synthetic Thermoset Resin",
        technicalConcept:
          "Controlled formaldehyde-phenol condensation producing insoluble, heat-proof polymer networks.",
      },
      {
        patentId: "us-971501-haber-ammonia",
        year: "1910",
        role: "successor",
        roleLabel: "High-Pressure Catalytic Synthesis",
        technicalConcept:
          "Exothermic synthesis of ammonia from atmospheric nitrogen at 200 atm over osmium catalysts.",
      },
      {
        patentId: "us-3671542-kwolek-kevlar",
        year: "1972",
        role: "modern-culmination",
        roleLabel: "Liquid-Crystalline Poly-p-phenylene",
        technicalConcept:
          "Anisotropic liquid-crystal dopes spun into ultra-high modulus poly-p-phenylene terephthalamide fibers.",
      },
    ],
  },
  {
    id: "aerospace-flight",
    category: "Aerospace & Aerodynamics",
    title: "Atmospheric & Exoatmospheric Flight",
    subtitle: "From Rigid Dirigibles to Multi-Stage Rocketry and Rotary Flight",
    description:
      "The aerodynamic and astronautic lineage that conquered the air through rigid structural envelopes, 3-axis aerodynamic flight control, rocket staging, and vertical rotary lift.",
    steps: [
      {
        patentId: "us-621195-zeppelin-airship",
        year: "1899",
        role: "foundational",
        roleLabel: "Rigid Airframe Aerostat",
        technicalConcept:
          "Lightweight aluminum longitudinal girders enclosing multiple independent gas cells.",
      },
      {
        patentId: "us-821393-wright-flyer",
        year: "1906",
        role: "breakthrough",
        roleLabel: "3-Axis Coordinated Aerodynamic Control",
        technicalConcept:
          "Coordinated wing warping, elevator pitch, and vertical rudder yaw counteracting adverse yaw.",
      },
      {
        patentId: "us-1102653-goddard-rocket",
        year: "1914",
        role: "breakthrough",
        roleLabel: "Multi-Stage Liquid Propellant Rocket",
        technicalConcept:
          "Step rocket staging dropping dead structural mass with de Laval supersonic combustion nozzles.",
      },
      {
        patentId: "us-2318259-sikorsky-helicopter",
        year: "1943",
        role: "modern-culmination",
        roleLabel: "Single Main Rotor Helicopter",
        technicalConcept:
          "Swashplate cyclic/collective blade pitch paired with anti-torque vertical tail rotor.",
      },
    ],
  },
];

/**
 * Finds any lineages containing the given patent id.
 */
export function getLineagesForPatent(patentId: string): PatentLineage[] {
  return ALL_PATENT_LINEAGES.filter((lineage) =>
    lineage.steps.some((step) => step.patentId === patentId),
  );
}

/**
 * Finds adjacent lineage steps (predecessor and successor) for a given patent within its primary lineage.
 */
export function getLineageAncestryForPatent(patentId: string): {
  lineage: PatentLineage | null;
  predecessors: LineageStep[];
  currentStep: LineageStep | null;
  successors: LineageStep[];
} {
  const lineage = ALL_PATENT_LINEAGES.find((l) => l.steps.some((s) => s.patentId === patentId));
  if (!lineage) {
    return { lineage: null, predecessors: [], currentStep: null, successors: [] };
  }

  const currentIndex = lineage.steps.findIndex((s) => s.patentId === patentId);
  return {
    lineage,
    predecessors: lineage.steps.slice(0, currentIndex),
    currentStep: lineage.steps[currentIndex],
    successors: lineage.steps.slice(currentIndex + 1),
  };
}
