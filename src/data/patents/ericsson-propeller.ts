import type { Patent } from "@/types/patent";

export const ericssonPropellerPatent: Patent = {
  id: "us-588-ericsson-propeller",
  patentNumber: "US 588",
  title: "Screw-Propeller for Vessels",
  shortTitle: "Ericsson Submerged Screw Propeller",
  subtitle: "Contra-Rotating Helical Spiral Blades, Hydrofoil Camber, and Submerged Shaft Thrust",
  inventors: ["John Ericsson"],
  inventorLocation: "London, Great Britain & New York, New York",
  grantDate: "1838-02-01",
  filingDate: "1837-12-14",
  era: "Early Republic & Industrial Dawn (1790–1830)",
  category: "aviation",
  categoryLabel: "Marine Propulsion & Hydrodynamics",
  summary:
    "The 1838 marine propulsion revolution: John Ericsson's submerged contra-rotating helical screw propeller mounted on an axial shaft below the waterline, replacing vulnerable, inefficient paddle wheels with a continuous hydrodynamic axial thrust drive that protected warship propulsion from cannon fire and operated unaffected by rolling seas.",
  heroQuote:
    "The propeller consists of two or more metallic cylinders or hubs, armed with helical spiral blades revolving in opposite directions below the water-line, whereby an oblique reaction is produced against the water to propel the vessel.",
  originalPdfUrl: "/patents/pdfs/us-588-ericsson-propeller.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US588/en",
  usptoClassification: "B63H 1/14 (Marine propellers; Screw propellers)",
  originalText: `UNITED STATES PATENT OFFICE.
JOHN ERICSSON, OF LONDON, GREAT BRITAIN.

IMPROVEMENT IN SCREW-PROPELLERS FOR VESSELS.

Specification forming part of Letters Patent No. 588, dated February 1, 1838.

To all whom it may concern:
Be it known that I, JOHN ERICSSON, engineer, of London, in the Kingdom of Great Britain, have invented a new and improved mode of Propelling Vessels by the application of submerged spiral or screw blades, of which the following is a specification:

My invention consists in applying one, two, or more metallic wheels or cylinders to a shaft or shafts passing out through the stern of a vessel below the water-line, said wheels being armed with segments of a spiral screw or helical blades placed at an angle to the axis of the shaft.

The construction of the apparatus comprises:
1. An outer shaft hollowed to receive a central inner shaft passing through it, mounted in water-tight stuffing boxes in the sternpost.
2. Two concentric wheel drums or hubs, the forward drum keyed to the outer shaft and the aft drum keyed to the inner shaft.
3. A series of helical spiral blades or segments of a screw secured to the peripheries of said drums, the spirals on the forward wheel being of opposite pitch to those on the aft wheel.
4. Gearing or direct connecting rods from the steam engine so arranged that the inner and outer shafts are driven with equal velocities in opposite directions.

By this arrangement, as the two wheels revolve in contrary directions beneath the water, the helical blades act obliquely upon the surrounding fluid, producing a continuous axial thrust that propels the vessel forward. The contrary rotation of the two wheels neutralizes the rotational swirl imparted to the water, preventing the stern from yawing to either side and converting nearly the entire power of the engine into direct forward propulsion.

Furthermore, because the entire propeller is placed beneath the water-line and behind the stern, it is completely protected from the shot of enemy artillery in naval warfare and remains fully submerged and effective regardless of how the vessel rolls, pitches, or changes its draft in heavy seas.

I claim as my invention:
1. The arrangement of two wheels armed with spiral or helical blades revolving in contrary directions on concentric shafts below the water-line for propelling vessels.
2. The combination of submerged helical screw blades with an axial shaft and thrust bearing for transmitting the axial reaction of the water directly to the hull of the vessel.`,
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
    ],
    whyItMattersToday:
      "Ericsson's submerged screw propeller replaced paddle wheels worldwide and made modern ocean shipping, container fleets, and armored naval warships possible. Ericsson later designed the USS Monitor (1862), whose submerged screw propeller and revolving armored turret revolutionized naval warfare forever.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The arrangement of two wheels armed with spiral or helical blades revolving in contrary directions on concentric shafts below the water-line for propelling vessels.",
      plainEnglish:
        "Master claim covering submerged contra-rotating helical screw propellers on concentric shafts mounted below the waterline to propel watercraft.",
      keyInnovations: [
        "Submerged screw propeller propulsion below waterline",
        "Concentric contra-rotating shaft architecture",
        "Elimination of rotational wake swirl",
      ],
      legalSignificance:
        "The foundational US patent establishing the practical screw propeller for commercial and naval shipping.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination of submerged helical screw blades with an axial shaft and thrust bearing for transmitting the axial reaction of the water directly to the hull of the vessel.",
      plainEnglish:
        "Covers the mechanical transmission of axial thrust from submerged helical blades through an axial shaft and thrust bearing into the vessel's hull structure.",
      keyInnovations: [
        "Axial propeller thrust transmission to ship hull",
        "Watertight stern tube stuffing box integration",
      ],
      legalSignificance:
        "Protected the direct mechanical integration of screw propellers with ship keels and steam engine drives.",
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
    totalClaims: 2,
    independentClaims: 1,
    patentWarYears: "1837–1844",
    impactScore: 99,
  },
};
