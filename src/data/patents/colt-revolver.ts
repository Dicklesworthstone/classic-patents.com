import type { Patent } from "@/types/patent";

export const coltRevolverPatent: Patent = {
  id: "us-138-colt-revolver",
  patentNumber: "US 138",
  title: "Revolving Gun",
  shortTitle: "Colt Rotating Cylinder Firearm Mechanism",
  subtitle: "Pawl and Ratchet Cylinder Indexing, Sear Lockup, and Isolated Percussion Nipples",
  inventors: ["Samuel Colt"],
  inventorLocation: "Hartford, Connecticut & Paterson, New Jersey",
  grantDate: "1836-02-25",
  filingDate: "1836-01-09",
  era: "Early Republic & Industrial Dawn (1790–1830)",
  category: "consumer",
  categoryLabel: "Mechanical Indexing & Ballistics",
  summary:
    "The 1836 firearm breakthrough that created the repeating handgun: Samuel Colt's single-action revolver integrating a mechanical link between the cocking hammer and cylinder pawl, automatically rotating the six-chambered cylinder by exactly 60 degrees while lifting a spring bolt into a locking recess to align each chamber bore with the barrel in a single fluid motion.",
  heroQuote:
    "By drawing back the hammer to cock the lock, the cylinder is revolved through the space of one chamber and held immovably in line with the barrel by the locking bolt during discharge...",
  originalPdfUrl: "/patents/pdfs/us-138-colt-revolver.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US138/en",
  usptoClassification: "F41C 3/14 (Revolvers; Revolving cylinder mechanisms)",
  originalTextAsset: {
    url: "/patents/source-text/us-138-colt-revolver.txt",
    pageCount: 2,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
SAMUEL COLT, OF HARTFORD, CONNECTICUT.

IMPROVEMENT IN FIRE-ARMS.

Specification forming part of Letters Patent No. 138, dated February 25, 1836.

To all whom it may concern:
Be it known that I, SAMUEL COLT, of the city of Hartford, in the State of Connecticut, have invented certain new and useful Improvements in Fire-Arms, of which the following is a specification:

The principle of my invention consists in combining a revolving cylinder containing a plurality of chambers with the cocking and firing mechanism in such manner that the simple action of drawing back the hammer to full cock rotates the cylinder through the space of one chamber, firmly locks it in axial alignment with the stationary barrel, and holds it immovably during discharge, while isolating the percussion nipples from lateral chain-fire.

The construction of the apparatus comprises:
1. A revolving cylinder mounted upon a central arbor or pin, having five or six chambers drilled longitudinally through it. At the rear face of the cylinder is formed a ratchet having a number of teeth corresponding to the number of chambers.
2. A hand or pawl pivoted to the breast of the hammer, which, as the hammer is drawn back by the thumb, rises and engages the ratchet teeth, rotating the cylinder through sixty degrees.
3. A spring bolt or locking lever engaging notches in the periphery of the cylinder. As the hammer begins its cocking movement, a cam on the hammer withdraws the locking bolt from the notch; as full cock is reached, the bolt snaps back into the next notch, locking the cylinder rigidly in line with the barrel.
4. Partitions or recoil shields separating each percussion nipple from its neighbors, preventing the flash of one cap from communicating laterally to adjacent charges.

When the trigger is pulled, the hammer falls upon the aligned nipple, detonating the percussion cap and discharging the bullet through the barrel, without disturbing the locked position of the cylinder.

I claim as my invention:
1. The combination of the rotating cylinder with the cock or hammer, so connected by a pawl and ratchet that cocking the hammer rotates the cylinder to bring a fresh chamber into alignment with the barrel.
2. The combination with said cylinder and hammer of the locking bolt operated by the motion of the hammer to unlock and re-lock the cylinder at each cocking operation.
3. The protective partitions between the percussion nipples to prevent accidental communication of fire between the chambers.`,
  plainEnglishExplanation: {
    overview:
      "Before Samuel Colt, repeating firearms were dangerous, bulky 'pepperbox' guns that rotated multiple heavy barrels by hand or were prone to catastrophic 'chain-fires' (where one shot ignited all neighboring chambers simultaneously). Colt invented a compact mechanism that linked the single thumb cocking of the hammer to a pawl and ratchet, automatically indexing a lightweight multi-chambered cylinder into precision alignment with a single rifled barrel while locking it rigidly against firing recoil.",
    coreMechanism:
      "Drawing the hammer back with the thumb performs three synchronized mechanical operations simultaneously: (1) A cam on the lower hammer body pushes the cylinder locking bolt downward out of its cylinder notch; (2) A pivoted vertical hand (pawl) on the hammer face pushes upward against a ratchet tooth on the cylinder arbor, rotating the cylinder exactly $60^\\circ$; (3) At full cock, the sear drops into the hammer notch, and the spring bolt snaps upward into the next cylinder perimeter recess, locking the chamber in alignment ($<0.05\\text{ mm}$ concentricity) with the barrel bore. Deep steel partitions between the percussion caps physically shield adjacent nipples from spark flashback.",
    mechanicalBreakdown: [
      {
        title: "Pawl & Ratchet Cylinder Indexer",
        summary: "Pivoted vertical hand on hammer rotating cylinder by exactly 60 degrees.",
        technicalDetails:
          "The hand is pinned to the hammer below the main pivot axis. During the $45^\\circ$ hammer cocking arc, the hand travels upward along an involute curve, imparting angular momentum to the ratchet ($\\Delta \\theta = \\frac{2\\pi}{N_{\\text{chambers}}} = 60^\\circ$).",
        archaicTerm: "Hand or pawl engaging the ratchet on the arbor",
        modernEquivalent: "Cylinder hand / Indexing pawl",
      },
      {
        title: "Cylinder Locking Bolt & Cam",
        summary: "Spring-loaded bolt snapping into cylinder perimeter recesses.",
        technicalDetails:
          "A split spring bolt rests in a deep notch on the cylinder outer circumference. The hammer carries a bevel cam that lifts the bolt during the initial $10^\\circ$ of cocking travel, then lets it snap back into the next notch as the chamber hits true center, resisting recoil torques exceeding $150\\text{ N}\\cdot\\text{m}$.",
        archaicTerm: "Spring bolt engaging notches in the periphery",
        modernEquivalent: "Cylinder stop bolt / Cylinder bolt detent",
      },
      {
        title: "Recoil Shield & Flash-Isolating Nipple Partitions",
        summary: "Milled steel walls isolating percussion caps against chain fire.",
        technicalDetails:
          "Each percussion nipple is recessed within a milled cavity bounded by $3\\text{ mm}$ thick steel partition walls. When the hammer ignites the mercury fulminate cap, expanding combustion gas is baffled backwards against the frame recoil shield rather than flashing sideways into neighboring chambers.",
        archaicTerm: "Partitions separating the nipples",
        modernEquivalent: "Recoil shield / Flash-barrier cylinder partitions",
      },
      {
        title: "Central Center-Pin Arbor & Transverse Barrel Wedge",
        summary:
          "Rigid longitudinal axle absorbing axial recoil tension and enabling modular takedown.",
        technicalDetails:
          "A solid hardened-steel central arbor pin ($d = 9.5\\text{ mm}$) threads into the frame and passes completely through the cylinder axis. A tapered transverse steel wedge through the forward arbor extension clamps the barrel assembly rigidly against the lower frame lugs, withstanding axial tensile thrust forces ($F_{\\text{thrust}} > 8.5\\text{ kN}$) without stretching.",
        archaicTerm: "Center pin and key or wedge securing the barrel",
        modernEquivalent: "Cylinder arbor shaft & barrel clamping wedge",
      },
      {
        title: "Sear Notches, Half-Cock Safety, & Laminated Mainspring",
        summary:
          "Three-position tumbler lock delivering crisp trigger release and fall-safe loading.",
        technicalDetails:
          "The lower hammer hub features two EDM-style precision ground notches: a deep half-cock safety notch that captures the sear nose and locks the trigger while freeing the cylinder for hand rotation during loading, and a full-cock notch engaging at $4.2\\text{ N}$ trigger pull. A heavy V-shaped leaf mainspring stores $12.5\\text{ J}$ of strain energy, accelerating the hammer into the percussion nipple in $<8.0\\text{ ms}$.",
        archaicTerm: "Tumbler notches and main-spring for cocking and releasing",
        modernEquivalent: "Sear-tumbler fire control group & leaf mainspring",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Internal Ballistic Hoop Stress",
        formula:
          "\\sigma_{\\text{hoop}} = \\frac{P_{\\text{combustion}} \\cdot r_{\\text{inner}}}{t_{\\text{wall}}} < \\sigma_{\\text{yield}}",
        explanation:
          "Peak black powder combustion pressures ($70\\text{ to }120\\text{ MPa}$) generate extreme tensile hoop stresses in the cylinder walls, requiring forged carbon steel with thickness $t \\ge 3.5\\text{ mm}$ to prevent chamber rupture.",
      },
      {
        principle: "Kinematic Angular Discretization (Index Geneva Analogy)",
        formula:
          "\\theta_{\\text{step}} = \\frac{360^\\circ}{N} = 60^\\circ, \\quad \\omega(t) = \\dot{\\theta}_{\\text{hammer}}(t) \\cdot \\frac{r_{\\text{pawl}}}{r_{\\text{ratchet}}}",
        explanation:
          "The continuous angular rotation of the thumb hammer is converted into a discrete $60^\\circ$ stepwise rotation of the cylinder via pawl-ratchet geometry.",
      },
      {
        principle: "Gas Expansion Pressure & Barrel Sealing",
        formula:
          "v_{\\text{muzzle}} = \\sqrt{\\frac{2}{m_{\\text{bullet}}} \\int_{x_0}^{x_1} P(x) A_{\\text{bore}} \\, dx}",
        explanation:
          "Expanding propellant gases accelerate the conical lead bullet through the barrel; minimizing the cylinder-to-barrel gap ($<0.15\\text{ mm}$) prevents gas pressure blow-by and maintains high muzzle velocity.",
      },
      {
        principle: "Recoil Momentum Conservation & Arbor Tensile Shear",
        formula:
          "m_{\\text{bullet}} v_{\\text{bullet}} + m_{\\text{gas}} v_{\\text{gas}} = M_{\\text{gun}} V_{\\text{recoil}}, \\quad \\sigma_{\\text{arbor}} = \\frac{F_{\\text{thrust}}}{\\frac{\\pi}{4} d_{\\text{arbor}}^2}",
        explanation:
          "Conservation of linear momentum governs firearm recoil dynamics, while the central arbor pin bears the entire forward gas separation impulse without yielding or shearing the barrel locking wedge.",
      },
    ],
    whyItMattersToday:
      "Colt's single-action pawl, ratchet, and cylinder stop architecture became the universal blueprint for all revolving cylinder firearms (from the 1873 Colt Single Action Army 'Peacemaker' to modern Smith & Wesson and Ruger revolvers). Beyond firearms, Colt pioneered precision assembly line mass production with drop-forged interchangeable parts in Hartford, Connecticut, establishing the cornerstone of American industrial manufacturing.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination of the rotating cylinder with the cock or hammer, so connected by a pawl and ratchet that cocking the hammer rotates the cylinder to bring a fresh chamber into alignment with the barrel.",
      plainEnglish:
        "Master claim securing the mechanical linkage between the cocking hammer and a pawl/ratchet that automatically indexes the cylinder by one chamber when the hammer is cocked.",
      keyInnovations: [
        "Single-action hammer-to-cylinder pawl linkage",
        "Automatic cylinder rotation on cocking",
        "Multi-chambered single-barrel repeating firearm",
      ],
      legalSignificance:
        "The foundational claim of the modern revolver, granting Colt a lucrative monopoly on repeating handguns until the patent expired in the 1850s.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination with said cylinder and hammer of the locking bolt operated by the motion of the hammer to unlock and re-lock the cylinder at each cocking operation.",
      plainEnglish:
        "Specifies the spring bolt mechanism that unlocks the cylinder as cocking begins and locks it rigidly into alignment as full cock is reached.",
      keyInnovations: [
        "Hammer-actuated cylinder stop bolt",
        "Positive chamber-to-bore alignment locking",
      ],
      legalSignificance:
        "Protected the critical alignment and safety catch mechanism that prevented misaligned firing.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The protective partitions between the percussion nipples to prevent accidental communication of fire between the chambers.",
      plainEnglish:
        "Covers the recessed steel partition walls separating the percussion nipples to prevent sparks from causing multiple chambers to ignite simultaneously.",
      keyInnovations: [
        "Flash-isolating percussion nipple partitions",
        "Anti-chain-fire safety geometry",
      ],
      legalSignificance:
        "Addressed the primary lethal safety hazard of early revolving multi-chamber weapons.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Longitudinal Section of Colt Paterson Revolver Lockwork",
      caption:
        "Cutaway view showing hammer, mainspring, pawl (hand), cylinder ratchet, locking bolt, and multi-chambered cylinder.",
      svgType: "colt-revolver",
      callouts: [
        {
          id: "cr-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Cocking Hammer & Cam",
          description: "Thumb-cocked hammer driving pawl and tripping cylinder stop bolt.",
          x: 20,
          y: 40,
        },
        {
          id: "cr-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Cylinder Hand / Pawl",
          description: "Vertical lever rotating ratchet teeth on cylinder arbor by 60 degrees.",
          x: 35,
          y: 50,
        },
        {
          id: "cr-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Revolving 6-Chamber Cylinder",
          description: "Forged steel cylinder with bored chambers and locking notches.",
          x: 55,
          y: 45,
        },
        {
          id: "cr-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Cylinder Stop Locking Bolt",
          description: "Spring bolt engaging perimeter notches to align chamber with barrel.",
          x: 50,
          y: 75,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1830s, military and civilian firearms were single-shot muzzleloaders or bulky multi-barrel 'pepperbox' pistols. Reloading a single-shot pistol under combat conditions took 20 to 30 seconds; pepperbox pistols were heavy, unbalanced, and frequently suffered catastrophic chain fires, blowing the shooter's hand off.",
    priorArtLimitations: [
      "Elisha Collier's 1818 flintlock revolver required the cylinder to be rotated and locked by hand before each shot.",
      "Multi-barrel pepperbox guns were front-heavy, inaccurate, and lacked a stationary rifled barrel.",
      "No single-action mechanism existed that automatically indexed and locked the cylinder via the cocking stroke of the hammer.",
    ],
    breakthroughInsight:
      "Legend has it that while serving as a 16-year-old sailor aboard the ship Corvo bound for Calcutta in 1830, Colt observed the ship's capstan and steering wheel ratchet mechanism. He whittled a wooden model of a revolver where the cocking hammer rotated and locked a revolving cylinder in a single motion.",
    patentWars: [
      {
        rivalName: "Edwin Wesson and the Massachusetts Arms Company",
        rivalClaim:
          "Manufactured revolvers in 1849 claiming their lockwork and cylinder bevel gears did not infringe Colt's pawl-and-ratchet patent.",
        conflictDetails:
          "Colt sued the Massachusetts Arms Company in 1851 in Boston federal court (Colt v. Massachusetts Arms Co.). Colt hired famous orator Edward N. Dickerson, who used enlarged working brass models and dynamic demonstrations to convince the jury.",
        resolution:
          "The jury found Massachusetts Arms guilty of infringement after just two hours of deliberation. The court issued an injunction and awarded Colt damages, solidifying his absolute monopoly until 1857.",
        legalOutcome:
          "Affirmed the broad scope of Colt's combination claims covering automatic hammer-actuated cylinder indexing.",
      },
    ],
    civilizationalImpact:
      "During the Mexican-American War and Texas Ranger operations under Captain Samuel Walker, Colt's revolvers proved decisively superior, leading to government contracts and the famous Colt Walker and 1851 Navy revolvers. Colt built the Colt Armory in Hartford, pioneering mass production with interchangeable parts, division of labor, and modern industrial capitalism.",
    funFact:
      "To fund his early patent applications and prototypes, young Samuel Colt traveled across American towns from 1832 to 1835 billing himself as the 'Celebrated Dr. Coult of New York, London, and Calcutta,' administering laughing gas (nitrous oxide) to curious townspeople for 25 cents per show!",
    aftermath:
      "When Colt's patent expired in 1857, Smith & Wesson had already patented Rollin White's bored-through cylinder for metallic cartridges (US 12,648). Colt's company was forced to wait out White's patent before introducing the legendary Colt Single Action Army 'Peacemaker' in 1873.",
  },
  tags: [
    "Samuel Colt",
    "Revolver",
    "Firearms",
    "Kinematic Indexing",
    "Mass Production",
    "American System",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1836–1857",
    impactScore: 97,
  },
};
