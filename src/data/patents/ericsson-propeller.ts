import type { Patent } from "@/types/patent";
import { ericssonPropellerArchivalEdition } from "../editions/ericssonPropellerEdition";

export const ericssonPropellerPatent: Patent = {
  id: "us-588-ericsson-propeller",
  patentNumber: "US 588",
  title: "Screw-Propeller for Vessels",
  shortTitle: "Ericsson Submerged Screw Propeller",
  subtitle: "Contra-Rotating Helical Spiral Blades, Hydrofoil Camber, and Submerged Shaft Thrust",
  inventors: ["John Ericsson"],
  inventorLocation: "London, England",
  grantDate: "1838-02-01",
  filingDate: "1838-02-01",
  era: "Early Industrial Navigation (1830–1850)",
  category: "aviation",
  categoryLabel: "Marine Propulsion & Hydrodynamics",
  summary:
    "John Ericsson's specification describes two submerged broad hoops carrying short spiral plates. Concentric shafts and unequal gearing drive the hoops in contrary directions; the third claim covers a removable upright-stem installation with a protected gear casing.",
  heroQuote:
    "This invention which I name as above consists in two thin broad metallic hoops or short cylinders supported by spiral arms or spokes and made to revolve in contrary directions.",
  originalPdfUrl: "/patents/pdfs/us-588-ericsson-propeller.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US588/en",
  usptoClassification: "B63H 1/14 (Marine propellers; Screw propellers)",
  originalTextAsset: {
    url: "/patents/source-text/us-588-ericsson-propeller.txt",
    pageCount: 5,
    kind: "source-pdf-text-layer",
  },
  originalText:
    "Be it known that I, JOHN ERICSSON, a subject of the Kingdom of Sweden, residing at London, England, have invented a new and useful Propeller for the Purpose of Propelling Steamboats Effectually Notwithstanding Any Variations in Their Draft of Water. The complete, manually prepared edition is available in the Original Patent Text face.",
  archivalEdition: ericssonPropellerArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "In the early 19th century, steam navigation was chained to giant paddle wheels mounted on the sides of ships. Paddle wheels were mechanically vulnerable in heavy storms, became useless when the ship rolled and lifted one wheel out of the water, and presented massive, unarmored targets for naval cannon fire. Swedish-American engineer John Ericsson replaced paddle wheels with submerged helical screw blades rotating on an axial shaft below the waterline, establishing modern marine propulsion.",
    coreMechanism:
      "A steam engine drives an axial propeller shaft passing through a watertight stuffing box in the stern below the waterline. The shaft turns a hub fitted with curved helical blades shaped like sections of a giant screw thread. As the blades slice obliquely through the water, their cambered hydrofoil cross-section accelerates a cylindrical column of water backwards ($\\Delta \\dot{m} v$). By Newton's third law, the water exerts an equal and opposite forward reaction force (thrust $T$) transmitted through a heavy thrust bearing into the vessel's hull, driving the ship forward with high hydrodynamic efficiency.",
    mechanicalBreakdown: [
      {
        title: "Helical Screw Hydrofoil Blades",
        summary: "Curved metallic blades with true geometric helical pitch.",
        technicalDetails:
          "Blades designed with constant or progressive axial pitch $P_{\\text{pitch}}$ (axial advance per $360^\\circ$ revolution: $P = 2\\pi r \\tan\\phi$). The cross-sections act as submerged hydrofoils, generating dynamic lift $L$ perpendicular to the relative inflow velocity vector $v_{\\text{inflow}}$.",
        archaicTerm: "Segments of a spiral screw or helical blades",
        modernEquivalent: "Marine propeller blades / Hydrofoil screw sections",
      },
      {
        title: "Concentric Shaft Contra-Rotating Drive",
        summary: "Inner and outer concentric shafts spinning in opposite directions.",
        technicalDetails:
          "To eliminate rotational swirl and torque steer in early short-diameter screws, Ericsson geared two counter-rotating wheels. The aft propeller recovered kinetic energy from the rotational wake of the forward propeller, ensuring zero net yaw moment on the rudder.",
        archaicTerm: "Two concentric shafts driving wheels in contrary directions",
        modernEquivalent: "Contra-rotating propeller shafting (CRP)",
      },
      {
        title: "Submerged Stern Tube & Thrust Bearing",
        summary: "Watertight stuffing box and axial thrust collar on hull frame.",
        technicalDetails:
          "The shaft passes through a lignum-vitae water-lubricated bearing and hemp packing gland in the sternpost. A multi-collar thrust bearing transmits forward axial thrust ($T > 50\\text{ kN}$) directly to the keel structural stringers.",
        archaicTerm: "Water-tight stuffing box and thrust pillow block",
        modernEquivalent: "Stern tube bearing & Kingsbury/Mitchell thrust block",
      },
      {
        title: "Blade Camber, Skew, and Hub Boss Streamlining",
        summary: "Hydrodynamically faired root sections minimizing turbulent eddy shedding.",
        technicalDetails:
          "The blade roots transition smoothly into a tapered ellipsoidal hub boss ($d_{\\text{hub}}/D_{\\text{prop}} \\approx 0.20$), preventing flow separation at the inner radii. Backwards rake angles ($\theta_{\\text{rake}} \\approx 6^\\circ\\text{ to }10^\\circ$) increase clearance between the blade tips and the ship's stern frame, suppressing propeller-induced hull pressure pulses.",
        archaicTerm: "Boss or central nave of the propeller wheel",
        modernEquivalent: "Streamlined hub fairing & raked blade geometry",
      },
      {
        title: "Bevel Reversing Geartrain & Disengaging Clutch",
        summary: "Mechanical transmission linking reciprocating steam pistons to dual shafts.",
        technicalDetails:
          "A pair of heavy cast-iron bevel gears with crowned teeth links the primary engine crank to the outer sleeve shaft and inner core shaft. The gear assembly maintains precise $1:1$ counter-rotational synchronization while absorbing peak torque pulsations ($\\tau_{\\text{peak}} / \\tau_{\\text{mean}} \\approx 1.4$) from single-expansion steam cylinders.",
        archaicTerm: "Bevel gear wheels and reversing clutch mechanism",
        modernEquivalent: "Marine planetary reduction gearbox & synchronizer",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Blade Element Momentum Hydrodynamic Thrust",
        formula:
          "T = \\int_{r_{\\text{hub}}}^{R} \\left[\\frac{1}{2} \\rho v_{\\text{rel}}^2 c(r) (C_L \\cos\\phi - C_D \\sin\\phi)\\right] B \\, dr",
        explanation:
          "Total axial thrust is the integral of hydrodynamic lift and drag produced by $B$ blade elements operating at local angle of attack $\\alpha(r) = \\phi(r) - \\beta(r)$ in water of density $\\rho = 1025\\text{ kg/m}^3$.",
      },
      {
        principle: "Propeller Advance Ratio & Hydrodynamic Slip",
        formula:
          "J = \\frac{v_{\\text{ship}}}{n D}, \\quad s = 1 - \\frac{v_{\\text{ship}}}{n P_{\\text{pitch}}}",
        explanation:
          "The advance ratio $J$ and slip fraction $s$ define the operating regime on the $K_T\\text{--}K_Q$ open-water propeller diagram, determining peak hydrodynamic efficiency $\\eta_0 = \\frac{J}{2\\pi} \\frac{K_T}{K_Q}$.",
      },
      {
        principle: "Hydrodynamic Cavitation Threshold",
        formula:
          "\\sigma = \\frac{P_{\\text{ambient}} + \\rho g h - P_{\\text{vapor}}}{\\frac{1}{2} \\rho v_{\\text{tip}}^2} > \\sigma_{\\text{critical}}",
        explanation:
          "Submerging the propeller at depth $h$ below the waterline increases hydrostatic pressure, preventing blade suction pressure from dropping below water vapor pressure ($P_{\\text{vap}} \\approx 2.3\\text{ kPa}$ at $20^\\circ\\text{C}$), suppressing cavitation.",
      },
      {
        principle: "Froude-Rankine Actuator Disk Ideal Efficiency",
        formula:
          "\\eta_{\\text{ideal}} = \\frac{2}{1 + \\sqrt{1 + C_T}}, \\quad C_T = \\frac{T}{\\frac{1}{2} \\rho v_{\\text{ship}}^2 A_{\\text{disk}}}",
        explanation:
          "Actuator disk momentum theory sets the theoretical upper limit on propeller efficiency by modeling the acceleration of the slipstream jet column through disk area $A_{\\text{disk}} = \\frac{\\pi}{4} D^2$.",
      },
    ],
    whyItMattersToday:
      "Ericsson's submerged screw propeller replaced paddle wheels worldwide and made modern ocean shipping, container fleets, and armored naval warships possible. Ericsson later designed the USS Monitor (1862), whose submerged screw propeller and revolving armored turret revolutionized naval warfare forever.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The metallic hoops or cylinders and the spiral arms or spokes hereinbefore described together with the entire immersion of the propeller by which means I am enabled to employ the whole surface of all the spiral plates at one time and whereby the beneficial result of a great propelling force will be obtained by a propeller of much less dimensions than heretofore.",
      plainEnglish:
        "Claims the hoop-and-spoke construction together with complete immersion, so all of the short spiral plates can work in water at once and a smaller propeller can produce substantial thrust.",
      keyInnovations: ["Metallic hoop", "Spiral spoke", "Complete immersion"],
      legalSignificance:
        "The claim is limited to Ericsson's stated immersed hoop-and-spoke arrangement, not every use of oblique spiral planes.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "And I also claim as my invention the giving a greater speed to the outer series of spiral plates which move in the current produced by the motion of the other series and by which greater speed the beneficial result of saving of power and increased propelling force will be obtained.",
      plainEnglish:
        "Claims making the outer series faster, where it runs in the water current made by the other series, to save power and increase propelling force.",
      keyInnovations: ["Outer spiral series", "Higher speed", "Current from inner series"],
      legalSignificance:
        "This is separately phrased and does not incorporate claim 1 by reference.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "And I further claim as my invention the application of the propeller as described in drawing No. 2—that is to say: 1stly, I claim the upright hollow stem with its arms or branches for carrying the propeller by means of which stem the propeller may be either suspended and immersed under the water when required to be used, or on other occasions lifted out of the water so as not to interfere with the sailing of the vessel; 2ndly, I claim the drum or conical casing for protecting the bevel wheels and for diminishing the resistance in passing through the water; 3rdly, I claim the attaching the propeller to or detaching it from the engine or other power employed on board the vessel by means of a coupling box at the upper end of the upright shaft of the bevel wheels.",
      plainEnglish:
        "Claims the Figure 4–6 installation as three features: a hollow upright stem that can lower or raise the propeller, a fairing around the bevel gears, and a coupling box that connects or disconnects the propeller from shipboard power.",
      keyInnovations: ["Upright hollow stem", "Conical gear casing", "Sliding coupling box"],
      legalSignificance:
        "This claim is the patent's expressly enumerated removable-installation combination.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Stern Elevation of Ericsson Screw Propeller System",
      caption:
        "Sectional drawing showing concentric propeller shafts, forward and aft helical blade hubs, and submerged rudder integration.",
      svgType: "ericsson-propeller",
      callouts: [
        {
          id: "ep-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Forward Helical Propeller Wheel",
          description: "Submerged drum with right-hand helical spiral hydrofoil blades.",
          x: 40,
          y: 60,
        },
        {
          id: "ep-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Aft Counter-Rotating Propeller Wheel",
          description: "Submerged drum with left-hand helical blades spinning in reverse.",
          x: 60,
          y: 60,
        },
        {
          id: "ep-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Concentric Drive Shafts & Sternpost",
          description: "Hollow outer shaft and solid inner shaft passing below waterline.",
          x: 25,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1836, side-paddle steamers could not function as warships because a single enemy artillery shell into the massive paddle boxes would immobilize the vessel, and paddle wheels could not be submerged deep enough to avoid heavy rolling in mid-Atlantic swells.",
    priorArtLimitations: [
      "Archimedean water screws were long, full-turn helical augers that choked with weeds and suffered massive skin-friction drag.",
      "Francis Pettit Smith's 1836 British screw was an oversized two-turn wood spiral that broke in half during trials.",
      "The British Admiralty rejected Ericsson's 1837 prototype (the Francis B. Ogden) on the false theoretical belief that steering from the stern would be impossible with a screw propeller!",
    ],
    breakthroughInsight:
      "Ericsson shortened the screw into short, high-aspect-ratio multi-bladed helical segments, calculating that a short diameter blade spinning at higher rotational speed produced vastly superior hydrodynamic thrust with minimal frictional drag.",
    patentWars: [
      {
        rivalName: "Francis Pettit Smith and the British Admiralty",
        rivalClaim:
          "Smith patented a full-length Archimedean screw in Great Britain in 1836 and claimed priority over all screw-propelled vessels.",
        conflictDetails:
          "Discouraged by British Admiralty stubbornness, Ericsson was persuaded by American Navy Captain Robert F. Stockton to move to the United States in 1839. In America, Ericsson designed the USS Princeton (1843), the US Navy's first screw-propelled steam warship, featuring engines located completely below the waterline.",
        resolution:
          "The overwhelming success of the USS Princeton proved Ericsson's design decisively. The British Admiralty and world navies converted entirely to submerged screw propulsion, and Smith's long screw was abandoned in favor of Ericsson's short-bladed geometry.",
        legalOutcome:
          "Ericsson's US Patent 588 was recognized as the foundational design for all modern marine propellers.",
      },
    ],
    civilizationalImpact:
      "Screw propulsion enabled the creation of transoceanic steamship lines (Cunard, White Star), global maritime commerce, and modern armored navies. In 1862, Ericsson designed and built the ironclad USS Monitor in just 100 days, whose submerged propeller and revolving turret defeated the CSS Virginia at the Battle of Hampton Roads.",
    funFact:
      "In 1837, Ericsson demonstrated his 45-foot screw boat, the Francis B. Ogden, on the River Thames by towing the British Admiralty's ceremonial barge at 10 knots. Despite the flawless demonstration, the British Surveyor of the Navy, Sir William Symonds, declared: 'Even if the propeller has the power of propelling a vessel, it would be useless, because it would be impossible to steer!'",
    aftermath:
      "Ericsson became a national hero in the United States. Following his death in New York in 1889 at age 85, the US Navy transported his body back to Sweden aboard the armored cruiser USS Baltimore with full international military honors.",
  },
  tags: [
    "John Ericsson",
    "Screw Propeller",
    "Marine Propulsion",
    "Hydrodynamics",
    "USS Monitor",
    "Naval Architecture",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 3,
    patentWarYears: "1837–1844",
    impactScore: 99,
  },
};
