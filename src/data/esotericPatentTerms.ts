/**
 * esotericPatentTerms.ts
 *
 * Comprehensive Historical & Engineering Glossary for 19th and 20th Century
 * Patent Terminology across all 54 Classic Patents.
 *
 * Provides dictionary lookups with historical meaning, modern engineering equivalent,
 * and contextual explanations when users hover/tap on archaic legal & technical terms.
 */

export interface EsotericTermDefinition {
  term: string;
  category:
    | "legal"
    | "mechanics"
    | "materials"
    | "electrical"
    | "acoustics"
    | "thermodynamics"
    | "aerospace"
    | "semiconductor"
    | "computing"
    | "chemistry"
    | "nuclear"
    | "optics";
  historicalDefinition: string;
  modernEquivalent: string;
  exampleContext?: string;
}

export const ESOTERIC_PATENT_GLOSSARY: Record<string, EsotericTermDefinition> = {
  // Legal & Archival Preamble
  "letters patent": {
    term: "Letters Patent",
    category: "legal",
    historicalDefinition:
      "An open document ('litterae patentes') issued by a sovereign or government under public seal, granting an inventor exclusive legal monopoly rights to manufacture, use, and vend an invention.",
    modernEquivalent: "Granted Patent Document / Certificate",
  },
  specification: {
    term: "Specification",
    category: "legal",
    historicalDefinition:
      "The comprehensive written description of an invention and the manner of constructing and operating it, in terms sufficiently clear to enable any person skilled in the art to replicate it.",
    modernEquivalent: "Patent Detailed Description & Embodiments",
  },
  "prior art": {
    term: "Prior Art",
    category: "legal",
    historicalDefinition:
      "All public knowledge, published literature, pre-existing machines, and earlier patents existing before the date of an inventor's claimed invention.",
    modernEquivalent: "Pre-existing Technical State of the Art",
  },
  "letters-patent": {
    term: "Letters Patent",
    category: "legal",
    historicalDefinition:
      "Open letters patent issued by the government conferring statutory monopoly rights upon an inventor.",
    modernEquivalent: "Granted Patent",
  },

  // Acoustics & Phonograph
  "yielding material": {
    term: "Yielding Material",
    category: "materials",
    historicalDefinition:
      "A ductile substance (such as annealed tinfoil, thin sheet-lead, or wax) that deforms plastically under mechanical stylus pressure without elastic recovery.",
    modernEquivalent: "Plastic Recording Medium / Master Substrate",
  },
  tinfoil: {
    term: "Tinfoil",
    category: "materials",
    historicalDefinition:
      "High-purity annealed tin rolled into thin foils (~0.05 mm thick), prized in the 19th century for its malleability and complete lack of springback compared to aluminum.",
    modernEquivalent: "Malleable Metal Foil Substrate",
  },
  "lead-screw": {
    term: "Lead-Screw",
    category: "mechanics",
    historicalDefinition:
      "A precision screw-threaded shaft used to convert rotary motion into continuous linear axial advance at an exact pitch (e.g. 10 threads per inch).",
    modernEquivalent: "Precision Linear Feed Screw / Acme Drive Shaft",
  },
  diaphragm: {
    term: "Diaphragm",
    category: "acoustics",
    historicalDefinition:
      "A thin, flexible circular membrane of mica, parchment, glass, or steel clamped at its perimeter to convert air vibrations into mechanical displacement.",
    modernEquivalent: "Acoustic Transducer Membrane / Microphone Diaphragm",
  },
  stylus: {
    term: "Stylus",
    category: "mechanics",
    historicalDefinition:
      "A rigid, finely rounded steel or sapphire needle point fastened directly to the center of an acoustic diaphragm to emboss vibrations into a moving substrate.",
    modernEquivalent: "Cutting / Recording Stylus",
  },
  tracer: {
    term: "Tracer",
    category: "acoustics",
    historicalDefinition:
      "A lightweight spring-mounted tracking needle adapted to follow micro-indentations in a recorded groove and vibrate a reproducing diaphragm.",
    modernEquivalent: "Playback Pickup Stylus / Phonograph Needle",
  },
  mandrel: {
    term: "Mandrel",
    category: "mechanics",
    historicalDefinition:
      "A cylindrical core or tapered spindle upon which a recording cylinder or workpiece is mounted and turned on a lathe or phonograph.",
    modernEquivalent: "Cylinder Core / Drive Spindle",
  },
  embossing: {
    term: "Embossing",
    category: "mechanics",
    historicalDefinition:
      "Deforming or pressing relief patterns (hills and valleys) into a material without cutting away swarf or removing material.",
    modernEquivalent: "Direct Plastic Micro-Indentation",
  },
  "sound-box": {
    term: "Sound-Box",
    category: "acoustics",
    historicalDefinition:
      "The acoustic chamber enclosing the diaphragm and stylus assembly that couples air vibrations into the horn.",
    modernEquivalent: "Acoustic Pickup Head / Phono Cartridge Chamber",
  },

  // Steam Engines & Valve Gears
  "wrist plate": {
    term: "Wrist Plate",
    category: "mechanics",
    historicalDefinition:
      "A central oscillating circular disc on a Corliss steam engine that distributes harmonic motion from a single eccentric to 4 separate reach rods and rotary valves.",
    modernEquivalent: "Rotary Multi-Valve Linkage Distributor",
  },
  dashpot: {
    term: "Dashpot",
    category: "mechanics",
    historicalDefinition:
      "A pneumatic or hydraulic damping cylinder using vacuum suction and an air cushion to rapidly snap a steam valve shut the instant its latch is tripped by the governor.",
    modernEquivalent: "Pneumatic Deceleration Cushion / Air Spring Damper",
  },
  "flyball governor": {
    term: "Flyball Governor",
    category: "mechanics",
    historicalDefinition:
      "A centrifugal mechanical speed regulator consisting of spinning weighted balls that rise with increasing engine speed to adjust the steam cutoff point.",
    modernEquivalent: "Centrifugal Speed Governor / Closed-Loop Feedback Regulator",
  },
  crosshead: {
    term: "Crosshead",
    category: "mechanics",
    historicalDefinition:
      "A sliding block mechanism in a reciprocating engine that connects the piston rod to the connecting rod, absorbing lateral thrust forces.",
    modernEquivalent: "Linear Slider-Crank Crosshead Guide",
  },
  "slide-valve": {
    term: "Slide-Valve",
    category: "mechanics",
    historicalDefinition:
      "A flat reciprocating sliding block that alternately covers and uncovers steam intake and exhaust ports in an engine cylinder.",
    modernEquivalent: "Spool Valve / Ported Slide Regulator",
  },

  // Electricity & Electromagnetism
  "undulating current": {
    term: "Undulating Current",
    category: "electrical",
    historicalDefinition:
      "Alexander Graham Bell's terminology for a continuous electrical current whose instantaneous amplitude varies continuously and proportionally with acoustic sound waves, distinct from pulsed telegraph current.",
    modernEquivalent: "Continuous Analog AC Audio Signal",
  },
  "rotary magnetic field": {
    term: "Rotary Magnetic Field",
    category: "electrical",
    historicalDefinition:
      "Nikola Tesla's breakthrough polyphase stator phenomenon where time-shifted AC currents through spatial stator coils generate a rotating magnetic vortex without mechanical commutators.",
    modernEquivalent: "Rotating Stator Magnetic Flux Vector",
  },
  "induction coil": {
    term: "Induction Coil (Ruhmkorff Coil)",
    category: "electrical",
    historicalDefinition:
      "A high-voltage step-up transformer with an interrupter switch used in the 19th century to produce thousand-volt sparks from low-voltage DC batteries.",
    modernEquivalent: "High-Voltage Pulse Step-Up Transformer",
  },
  commutator: {
    term: "Commutator",
    category: "electrical",
    historicalDefinition:
      "A split-ring rotary electrical switch on DC motors/generators that reverses current direction between the rotor and external circuit every half-turn.",
    modernEquivalent: "Mechanical Rotary Current Inverter",
  },
  interrupter: {
    term: "Interrupter",
    category: "electrical",
    historicalDefinition:
      "A mechanical vibrating contact breaker (often magnetic or electrolytic) that rapidly pulses DC current to drive an induction coil.",
    modernEquivalent: "Electronic Switching Oscillator / Chopper Circuit",
  },
  galvanometer: {
    term: "Galvanometer",
    category: "electrical",
    historicalDefinition:
      "An electromechanical instrument used in the 19th century to detect and measure tiny electric currents via magnetic needle deflection.",
    modernEquivalent: "Precision Micro-Ammeter / Current Sensor",
  },
  "carbon filament": {
    term: "Carbon Filament",
    category: "electrical",
    historicalDefinition:
      "Thomas Edison's carbonized bamboo thread mounted on platinum lead-in wires inside a high-vacuum glass bulb ($10^{-6}\\text{ atm}$), glowing incandescents for hundreds of hours.",
    modernEquivalent: "Incandescent Tungsten / Carbon Emitter Wire",
  },
  coherer: {
    term: "Coherer",
    category: "electrical",
    historicalDefinition:
      "An early radio wave detector consisting of a glass tube filled with loose metallic filings that cling together and conduct electricity when exposed to RF electromagnetic waves.",
    modernEquivalent: "RF Spark Detector / Solid-State RF Demodulator",
  },
  sparkover: {
    term: "Sparkover / Flashover",
    category: "electrical",
    historicalDefinition:
      "An unintended electrical arc breakdown through air between high-voltage electrodes when dielectric breakdown voltage is exceeded.",
    modernEquivalent: "Dielectric Arc Breakdown",
  },
  teleautomaton: {
    term: "Teleautomaton",
    category: "electrical",
    historicalDefinition:
      "Nikola Tesla's 1898 patent for the world's first radio remote-controlled robotic vessel, steered via wireless electromagnetic pulse sequences.",
    modernEquivalent: "Wireless Radio Remote-Controlled Robot",
  },

  // Aviation & Aerodynamics
  "wing warping": {
    term: "Wing Warping",
    category: "aerospace",
    historicalDefinition:
      "The Wright brothers' patented aerodynamic lateral control system that helically twists the flexible biplane wing tips in opposite directions to generate differential lift and roll.",
    modernEquivalent: "Aileron Differential Roll Control",
  },
  aeroplane: {
    term: "Aeroplane (Historical)",
    category: "aerospace",
    historicalDefinition:
      "In 19th and early 20th century terminology, the flat or cambered lifting wing surface itself (the 'plane'), rather than the complete flying machine.",
    modernEquivalent: "Lifting Wing Airfoil",
  },
  canard: {
    term: "Canard (Forward Rudder)",
    category: "aerospace",
    historicalDefinition:
      "An aerodynamic horizontal control surface positioned forward of the main wings for longitudinal pitch control and stall recovery.",
    modernEquivalent: "Forward Pitch Elevon / Canard Foreplane",
  },
  empennage: {
    term: "Empennage",
    category: "aerospace",
    historicalDefinition:
      "The tail assembly of an aircraft or airship, comprising vertical stabilizers, rudders, and elevators for aerodynamic directional stability.",
    modernEquivalent: "Aircraft Tail Section / Tailplane",
  },
  ballonet: {
    term: "Ballonet",
    category: "aerospace",
    historicalDefinition:
      "An internal air bladder inside an airship's gas envelope that expands or contracts to regulate internal gas pressure and compensate for atmospheric altitude changes.",
    modernEquivalent: "Airship Pressure-Compensating Air Cell",
  },

  // Firearms, Weaving & Typewriters
  cascabel: {
    term: "Cascabel",
    category: "mechanics",
    historicalDefinition:
      "The rounded projection or knob at the rear breech of an artillery cannon or Gatling gun used for aiming elevation and handling.",
    modernEquivalent: "Breech Knob / Elevating Lug",
  },
  felloe: {
    term: "Felloe (Felly)",
    category: "mechanics",
    historicalDefinition:
      "The curved wooden outer rim segments of a spoked artillery wheel into which the outer ends of the spokes are mortised and bound by an iron tire.",
    modernEquivalent: "Wooden Wheel Rim Segment",
  },
  lockwork: {
    term: "Lockwork",
    category: "mechanics",
    historicalDefinition:
      "The internal firing mechanism of a firearm (hammer, sear, trigger, cylinder hand, and mainspring) that cocks and discharges the weapon.",
    modernEquivalent: "Firearm Trigger & Firing Group Assembly",
  },
  lockstitch: {
    term: "Lockstitch",
    category: "mechanics",
    historicalDefinition:
      "Elias Howe's sewing stitch formed by interlocking two distinct threads: one pushed through the cloth by an eye-pointed needle and the other carried in a reciprocating shuttle.",
    modernEquivalent: "Dual-Thread Interlocking Lockstitch",
  },
  "eye-pointed needle": {
    term: "Eye-Pointed Needle",
    category: "mechanics",
    historicalDefinition:
      "A needle having the eye at the pointed piercing tip rather than at the shank, allowing the needle to push a loop of thread through cloth without passing the entire needle through.",
    modernEquivalent: "Sewing Machine Needle with Eye at Point",
  },
  typebar: {
    term: "Type-Bar",
    category: "mechanics",
    historicalDefinition:
      "A pivoted steel lever in a typewriter carrying a relief typeface letter at its tip, swung upward by key leverage to strike ink ribbon against the platen roller.",
    modernEquivalent: "Type Impact Lever",
  },
  platen: {
    term: "Platen",
    category: "mechanics",
    historicalDefinition:
      "The cylindrical rubber or wooden roller on a typewriter that supports the paper and advances it line by line under typing strikes.",
    modernEquivalent: "Typewriter Paper Roller Drum",
  },

  // Semiconductor, Nuclear & Computing
  "point-contact": {
    term: "Point-Contact Transistor",
    category: "semiconductor",
    historicalDefinition:
      "John Bardeen and Walter Brattain's 1947 breakthrough configuration using two gold foil contacts spaced 50 microns apart on a germanium crystal to achieve amplification.",
    modernEquivalent: "Point-Contact Bipolar Junction Transistor",
  },
  "planar process": {
    term: "Planar Process",
    category: "semiconductor",
    historicalDefinition:
      "Robert Noyce's microfabrication method forming p-n junctions, silicon dioxide insulating layers, and evaporated aluminum interconnects flat on a single silicon wafer.",
    modernEquivalent: "Monolithic Integrated Circuit Photolithography",
  },
  "cadmium rods": {
    term: "Cadmium Control Rods",
    category: "nuclear",
    historicalDefinition:
      "Rods with high thermal neutron capture cross-section inserted into Enrico Fermi's nuclear pile (CP-1) to absorb neutrons and regulate the fission chain reaction.",
    modernEquivalent: "Neutron Absorber Control Rods",
  },
  "frequency hopping": {
    term: "Frequency Hopping",
    category: "computing",
    historicalDefinition:
      "Hedy Lamarr and George Antheil's patented secret communication system synchronizing transmitter and torpedo receiver across 88 radio frequencies via slotted piano rolls.",
    modernEquivalent: "Frequency-Hopping Spread Spectrum (FHSS / Bluetooth / Wi-Fi)",
  },
  dissector: {
    term: "Image Dissector",
    category: "optics",
    historicalDefinition:
      "Philo Farnsworth's all-electronic television camera tube that emitted photoelectrons from a photocathode and scanned the electron image past an aperture anode using magnetic deflection coils.",
    modernEquivalent: "Electronic Video Camera Tube Sensor",
  },
};
