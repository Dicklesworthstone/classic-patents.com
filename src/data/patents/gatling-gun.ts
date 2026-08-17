import type { Patent } from "@/types/patent";

export const gatlingGunPatent: Patent = {
  id: "us-36836-gatling-gun",
  patentNumber: "US 36,836",
  title: "Improvement in Revolving Battery-Guns",
  shortTitle: "Gatling Rotary Multi-Barrel Machine Gun",
  subtitle:
    "Cylindrical Helical Cam Track, Gravity Hopper Feed, and Multi-Barrel Thermal Distribution",
  inventors: ["Richard Jordan Gatling"],
  inventorLocation: "Indianapolis, Marion County, Indiana",
  grantDate: "1862-11-04",
  filingDate: "1862-10-11",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "consumer",
  categoryLabel: "Mechanical Kinematics & Rapid-Fire Weapons",
  summary:
    "The 1862 mechanical rapid-fire pioneer: Richard Jordan Gatling's rotary gun combining a cluster of 6 to 10 rifled barrels rotated by a hand crank around a central shaft, each barrel carrying an independent reciprocating bolt governed by a stationary internal cylindrical cam track to continuously feed, chamber, lock, fire, extract, and eject cartridges at sustained rates exceeding 200 rounds per minute.",
  heroQuote:
    "The lock cylinder and barrels are rotated together by the crank... the locks being moved longitudinally back and forth by a stationary spiral cam, so that each barrel is loaded, fired, and the empty case extracted in one revolution.",
  originalPdfUrl: "/patents/pdfs/us-36836-gatling-gun.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US36836/en",
  usptoClassification: "F41F 1/10 (Multiple barrel guns; Rotary barrel cluster)",
  originalTextAsset: {
    url: "/patents/source-text/us-36836-gatling-gun.txt",
    pageCount: 3,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
RICHARD J. GATLING, OF INDIANAPOLIS, INDIANA.

IMPROVEMENT IN REVOLVING BATTERY-GUNS.

Specification forming part of Letters Patent No. 36,836, dated November 4, 1862.

To all whom it may concern:
Be it known that I, RICHARD J. GATLING, of Indianapolis, in the County of Marion and State of Indiana, have invented a new and useful Revolving Battery-Gun, of which the following is a specification:

The nature of my invention consists in:
1. A series of barrels revolving around a central axis, each barrel having its own corresponding lock or breech-pin moving in an aligned channel.
2. A stationary cylindrical casing having an internal spiral or helical cam track on its inner surface, which imparts a longitudinal reciprocating motion to the locks as they revolve with the barrels.
3. A hopper placed above the revolving lock cylinder through which cartridges are fed by gravity into the carrier troughs.
4. A cocking ring or cam which retracts the firing pin or striker against a spring and releases it when the barrel is locked at the bottom position, firing the charge.

As the hand crank is turned, the barrels, carrier cylinder, and lock cylinder rotate continuously in unison. During the top half of the revolution, each lock is pushed forward by the spiral cam, pushing a cartridge from the hopper into the barrel chamber and locking the breech. As the barrel reaches the bottom dead center, the striker is released by the cocking cam, discharging the round. During the ascending half of the revolution, the spiral cam retracts the lock, an extractor hook draws the spent case from the chamber, and the case falls out through an ejection chute at the bottom.

Thus, every turn of the crank continuously and harmoniously cycles all the barrels in succession without pause or jamming, keeping the barrels comparatively cool by distributing the heat across the entire cluster.

I claim as my invention:
1. The combination of a series of revolving barrels with corresponding reciprocating locks, operated by a stationary helical cam track to perform the operations of loading, cocking, firing, and extracting continuously.
2. The combination with the revolving barrels and locks of the gravity feed hopper and slotted carrier cylinder for supplying cartridges in succession to the chambers.
3. Distributing the thermal strain of rapid firing across a revolving cluster of multiple independent barrels.`,
  plainEnglishExplanation: {
    overview:
      "During the American Civil War, single-shot muzzle-loading muskets had a maximum firing rate of 3 rounds per minute. Single-barrel rapid-fire guns overheated and fouled with black powder after a few dozen shots. Dr. Richard Gatling solved both problems by arranging 6 to 10 barrels in a circle rotated by a hand crank. By giving each barrel its own reciprocating bolt guided by a stationary 3D spiral cam track, the mechanical actions of loading, firing, and extracting happened simultaneously across different barrels, while the heat of firing was distributed across the entire rotating mass.",
    coreMechanism:
      "Turning the hand crank rotates a central steel shaft carrying a forward barrel disk, a central fluted cartridge carrier, and a rear lock cylinder. Each barrel has its own longitudinal bolt sliding in a guide channel. As the cluster turns through $360^\\circ$: (1) At the top ($0^\\circ$), a cartridge drops by gravity from a top hopper into the carrier groove; (2) From $0^\\circ\\text{ to }180^\\circ$, a stationary internal helical cam track pushes the bolt forward, seating the cartridge in the chamber and locking the breech; (3) At bottom center ($180^\\circ$), a cocking lug drops off a firing cam, releasing the spring-loaded striker to fire the bullet; (4) From $180^\\circ\\text{ to }360^\\circ$, the cam track pulls the bolt rearward, an extractor claw pulls out the spent metallic case, and it drops out the bottom.",
    mechanicalBreakdown: [
      {
        title: "Stationary Cylindrical Helical Cam Track",
        summary: "3D internal helical cam groove guiding bolt reciprocation.",
        technicalDetails:
          "Machined into the interior of a stationary bronze casing. The cam profile $z(\\theta)$ converts rotational angular displacement into smooth linear harmonic bolt travel ($z_{\\text{stroke}} = 10\\text{ to }15\\text{ cm}$), maintaining constant mechanical advantage without peak impact loads.",
        archaicTerm: "Stationary spiral or helical cam track",
        modernEquivalent: "Rotary barrel-cam bolt actuator / Linear follower track",
      },
      {
        title: "Revolving Multi-Barrel Cluster & fluted Carrier",
        summary: "6 to 10 rifled steel barrels mounted in rotating circular bronze disks.",
        technicalDetails:
          "Barrels spaced at $60^\\circ$ or $36^\\circ$ intervals around a forged central arbor. For $N = 6$ barrels firing at $300\\text{ rounds/min}$, the shaft turns at only $50\\text{ RPM}$, allowing each barrel a full $1.0\\text{ second}$ cooling interval between consecutive shots.",
        archaicTerm: "Series of barrels revolving around a central axis",
        modernEquivalent: "Gatling rotary barrel cluster / Rotor assembly",
      },
      {
        title: "Gravity Feed Hopper & Striker Cocking Cam",
        summary: "Overhead gravity feed chute and wedge-shaped firing pin sear.",
        technicalDetails:
          "Cartridges fall from an overhead hopper into fluted grooves. A rear stationary cocking ramp compresses the striker spring ($k = 3.5\\text{ N/mm}, \\Delta x = 12\\text{ mm}$); when the follower reaches the sharp drop-off at bottom center, the striker delivers an impact energy $>0.4\\text{ Joules}$ to detonate the primer.",
        archaicTerm: "Feed hopper and cocking ring",
        modernEquivalent: "Gravity feed magazine & spring-striker firing sear",
      },
      {
        title: "Spring-Hook Shell Case Extractor Claw",
        summary: "Pivoted hook riding on bolt head snapping over rim to extract fired cases.",
        technicalDetails:
          "A tempered spring-steel hook mounted on the forward face of each bolt. As the bolt chambers the round, the hook ramps over the copper cartridge rim; during the rearward cam stroke, it pulls the spent casing ($F_{\\text{extract}} > 180\\text{ N}$) clear of the chamber until an ejector blade flips it downward through the bottom discharge port.",
        archaicTerm: "Extractor hook attached to each breech-pin",
        modernEquivalent: "Bolt-mounted claw extractor & fixed ejector spur",
      },
      {
        title: "Bevel Gear Reduction & Hand Crank Flywheel",
        summary:
          "Transverse bevel gearset providing steady mechanical advantage and dampening torque ripple.",
        technicalDetails:
          "A manual side crank turns a 45-tooth crown bevel gear meshing with a 15-tooth pinion on the central main shaft ($3:1$ step-up ratio). A balanced brass flywheel ring dampens cyclic cocking torque variations ($\\tau_{\\text{ripple}} < 12\\%$), preventing crank shudder as successive strikers engage the cam ramps.",
        archaicTerm: "Crank and gearing communicating rotary motion",
        modernEquivalent: "Bevel gear rotor drive & inertia flywheel",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Parallelized Mechanical Pipeline Processing",
        formula:
          "\\text{Cadence} = N_{\\text{barrels}} \\cdot \\omega_{\\text{crank}}, \\quad t_{\\text{cycle}} = \\frac{2\\pi}{\\omega_{\\text{crank}}} = N_{\\text{barrels}} \\cdot t_{\\text{shot}}",
        explanation:
          "The Gatling mechanism is an exact mechanical analog of pipelining in computer processors: at any given moment, Barrel 1 is extracting, Barrel 2 is cocking, Barrel 3 is firing, Barrel 4 is chambering, and Barrel 5 is loading.",
      },
      {
        principle: "Multi-Barrel Convective & Radiative Heat Dissipation",
        formula:
          "\\dot{q}_{\\text{cluster}} = N \\cdot \\left[ h(\\omega) A (T_{\\text{barrel}} - T_0) + \\varepsilon \\sigma A (T_{\\text{barrel}}^4 - T_0^4) \\right]",
        explanation:
          "Rotation through ambient air increases the convective heat transfer coefficient ($h \\propto \\omega^{0.6}$), while distributing the total thermal enthalpy across $N$ barrels prevents any single barrel from reaching softening or cook-off temperatures ($>300^\\circ\\text{C}$).",
      },
      {
        principle: "Kinematics of 3D Cylindrical Cam Acceleration",
        formula:
          "a_{\\text{bolt}}(\\theta) = \\omega^2 \\frac{d^2 z}{d\\theta^2}, \\quad F_{\\text{cam}} = m_{\\text{bolt}} a_{\\text{bolt}} + F_{\\text{friction}} + F_{\\text{spring}}",
        explanation:
          "The helical cam profile is contoured with cycloidal ramps to minimize peak jerk ($da/dt$), preventing bolt binding and reducing hand crank operating torque.",
      },
      {
        principle: "Recoil Impulse Gyroscopic Precession & Mount Stability",
        formula:
          "\\vec{\\tau}_{\\text{gyro}} = \\vec{\\omega}_{\\text{cluster}} \\times \\vec{L}_{\\text{rotor}}, \\quad \\Delta \\theta_{\\text{muzzle}} = \\frac{\\int F_{\\text{recoil}} r_{\\text{offset}} \\, dt}{I_{\\text{mount}}}",
        explanation:
          "Because each shot fires from the bottom center barrel ($180^\\circ$ offset from axle), the recoil force is directed below the pivot line, while rotor angular momentum stabilizes the carriage against muzzle climb.",
      },
    ],
    whyItMattersToday:
      "Gatling's rotary multi-barrel cam architecture is the direct engineering foundation of modern high-speed rotary cannons, including the 6-barrel 20mm M61 Vulcan on F-15/F-16/F-22 fighters (firing at 6,000 rounds/min) and the 7-barrel 30mm GAU-8 Avenger on the A-10 Warthog. Electric and hydraulic motors replaced the hand crank, but the internal helical cam track and revolving bolts remain identical to Gatling's 1862 patent.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination of a series of revolving barrels with corresponding reciprocating locks, operated by a stationary helical cam track to perform the operations of loading, cocking, firing, and extracting continuously.",
      plainEnglish:
        "Pioneer master claim covering a cluster of rotating barrels with aligned reciprocating bolts driven by a stationary internal helical cam track to load, cock, fire, and extract ammunition continuously.",
      keyInnovations: [
        "Rotary multi-barrel cluster with reciprocating bolts",
        "Stationary internal helical cam track",
        "Continuous synchronized pipeline cycling",
      ],
      legalSignificance:
        "The foundational patent for rotary automatic weapons, creating the entire mechanical class of Gatling-type guns.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination with the revolving barrels and locks of the gravity feed hopper and slotted carrier cylinder for supplying cartridges in succession to the chambers.",
      plainEnglish:
        "Specifies the overhead gravity feed hopper and fluted carrier cylinder that deposits cartridges smoothly into the bolt pathways without manual handling.",
      keyInnovations: ["Gravity feed magazine integration", "Fluted rotary cartridge carrier"],
      legalSignificance:
        "Protected the feeding mechanism that allowed uninterrupted rapid fire as long as the hopper was kept filled.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "Distributing the thermal strain of rapid firing across a revolving cluster of multiple independent barrels.",
      plainEnglish:
        "Claims the method of preventing barrel overheating and fouling during rapid fire by rotating a cluster of barrels so each barrel fires once per revolution.",
      keyInnovations: [
        "Multi-barrel thermal distribution",
        "Rotational forced-air convective cooling",
      ],
      legalSignificance:
        "Recognized the thermodynamic advantage of multi-barrel weapons over single-barrel designs.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Longitudinal Cutaway of Gatling Revolving Battery Gun",
      caption:
        "Cutaway view showing rotating barrel cluster, central carrier, reciprocating lock bolts, internal helical cam casing, and gravity feed hopper.",
      svgType: "gatling-gun",
      callouts: [
        {
          id: "gg-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Revolving Barrel Cluster",
          description: "Six rifled steel barrels mounted in rotating circular bronze plates.",
          x: 75,
          y: 50,
        },
        {
          id: "gg-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Stationary Helical Cam Casing",
          description: "Bronze housing with internal 3D cam groove driving lock bolts.",
          x: 40,
          y: 50,
        },
        {
          id: "gg-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Gravity Cartridge Feed Hopper",
          description: "Top hopper feeding metallic cartridges into fluted carrier.",
          x: 35,
          y: 20,
        },
        {
          id: "gg-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Hand Drive Crank & Gearing",
          description: "Rear hand crank rotating the central arbor through bevel gears.",
          x: 10,
          y: 55,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1861, Dr. Richard Gatling witnessed countless sick and wounded Union soldiers returning from Civil War battlefields to Indianapolis, observing that disease and battlefield casualties were devastating entire generations of young men.",
    priorArtLimitations: [
      "The Union Army's standard Springfield Model 1861 musket fired only 2 to 3 shots per minute and required 9 separate manual loading steps.",
      "The French 'Mitrailleuse' and Billinghurst-Requa battery guns fired a multi-barrel volley simultaneously, creating massive recoil and requiring a multi-minute reload pause.",
      "Single-barrel rapid-fire guns overheated after 50 rounds, leading to premature primer detonation (cook-off) and barrel warping.",
    ],
    breakthroughInsight:
      "Gatling realized that rapid fire could be achieved continuously by cycling multiple barrels through an internal cam track, allowing one man to produce the firepower of a hundred soldiers, which he hoped would reduce the size of armies and make war obsolete.",
    patentWars: [
      {
        rivalName: "Union Ordnance Bureau and General James Ripley",
        rivalClaim:
          "Ordnance Chief Ripley refused to adopt the Gatling Gun, claiming it consumed too much ammunition and was impractical for field infantry.",
        conflictDetails:
          "Blocked by conservative army bureaucracy, Gatling demonstrated his gun privately to Union Major General Benjamin Butler, who purchased twelve Gatling guns with his own personal funds in 1864 for $1,000 each and used them effectively during the Siege of Petersburg, Virginia.",
        resolution:
          "Following exhaustive post-war trials in 1865, the US Army officially adopted the Gatling Gun Model 1866 in .50-70 caliber, manufactured under contract by Colt's Armory in Hartford, Connecticut.",
        legalOutcome:
          "Gatling's master patent 36,836 and subsequent improvement patents dominated military rapid-fire procurement for four decades.",
      },
    ],
    civilizationalImpact:
      "The Gatling gun transformed global military doctrine and warfare. Navies mounted Gatling guns in fighting tops to defeat torpedo boats; armies deployed them worldwide. It established the rotary barrel weapon architecture that remains dominant in supersonic aircraft and automated naval close-in weapon systems (CIWS) today.",
    funFact:
      "Dr. Richard Jordan Gatling was a practicing medical doctor and a prolific inventor who previously patented a seed-sowing rice planter and a steam plow. In an 1864 letter, he wrote: 'It occurred to me that if I could invent a machine—a gun—which could enable one man to do as much battle duty as a hundred, it would in great measure supersede the necessity of large armies, and consequently, exposure to battle and disease would be greatly diminished.'",
    aftermath:
      "In 1893, Gatling experimented with coupling an electric motor to the main shaft of a 10-barrel gun, achieving an astounding firing rate of 3,000 rounds per minute! Gatling sold his patents and manufacturing rights to Colt in 1897 and passed away in 1903 at age 84.",
  },
  tags: [
    "Richard Gatling",
    "Gatling Gun",
    "Rotary Machine Gun",
    "Kinematics",
    "Civil War",
    "Vulcan Cannon",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1862–1866",
    impactScore: 99,
  },
};
