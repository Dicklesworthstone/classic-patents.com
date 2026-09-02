import { gatlingGunArchivalEdition } from "@/data/editions/gatlingGunEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = gatlingGunArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`US 36,836 is missing claim ${number} in its archival edition.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

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
    url: "/patents/transcripts/us-36836-gatling-gun-reviewed.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "1eb10666b48d84d2e2be3e09168c6f4f224e531428f7f7c39fdf70ff60d0683f",
  },
  originalText:
    "The complete source-checked specification, all five claims, drawing-sheet descriptions, signature, and witnesses are presented in the manually prepared Original Patent Text edition.",
  plainEnglishExplanation: {
    overview:
      "During the American Civil War, single-shot muzzle-loading muskets had a maximum firing rate of 3 rounds per minute. Single-barrel rapid-fire guns overheated and fouled with black powder after a few dozen shots. Dr. Richard Gatling solved both problems by arranging 6 to 10 barrels in a circle rotated by a hand crank. By giving each barrel its own reciprocating bolt guided by a stationary 3D spiral cam track, the mechanical actions of loading, firing, and extracting happened simultaneously across different barrels, while the heat of firing was distributed across the entire rotating mass.",
    coreMechanism:
      "Turning the hand crank rotates a central steel shaft carrying a forward barrel disk, a central fluted cartridge carrier, and a rear lock cylinder. Each barrel has its own longitudinal bolt sliding in a guide channel. As the cluster turns through $360^\\circ$: (1) At the top ($0^\\circ$), a cartridge drops by gravity from a top hopper into the carrier groove; (2) From $0^\\circ\\text{ to }180^\\circ$, a stationary internal helical cam track pushes the bolt forward, seating the cartridge in the chamber and locking the breech; (3) At bottom center ($180^\\circ$), a cocking lug drops off a firing cam, releasing the spring-loaded striker to fire the bullet; (4) From $180^\\circ\\text{ to }360^\\circ$, the cam track pulls the bolt rearward, an extractor claw pulls out the spent metallic case, and it drops out the bottom.",
    mechanicalBreakdown: [
      {
        title: "Revolving Multi-Barrel Cluster E & Circular Plates F, G",
        summary:
          "Parallel group of rifled gun barrels fixed between forward and rear circular bronze plates on the main shaft.",
        technicalDetails:
          "Mounting multiple barrels (typically 6) in circular plates $F$ and $G$ locked to central shaft $N$ distributes firing heat across multiple thermal masses. Each barrel fires only once per full $360^\\circ$ rotation, giving a cooling interval $t_{\\text{cool}} = 60 / \\text{RPM}$.",
        archaicTerm: "Circular plate F and barrels E",
        modernEquivalent: "Rotary barrel cluster and rotor carrier plates",
      },
      {
        title: "Fluted Cartridge Carrier C & Gravity Hopper H",
        summary:
          "Grooved rotating cylinder positioned under the top hopper to accept loose cartridges without human handling.",
        technicalDetails:
          "Carrier cylinder $C$ contains semicircular longitudinal troughs matching the barrel caliber. As the carrier rotates beneath feed hopper $H$, gravity drops one cartridge into each empty groove at top dead center ($0^\\circ$).",
        archaicTerm: "Grooved carrier C and reservoir H",
        modernEquivalent: "Rotary feed rotor and gravity feed chute",
      },
      {
        title: "Revolving Lock Cylinder D & Reciprocating Bolts",
        summary:
          "Cylinder carrying independent spring-loaded firing bolts aligned with each individual barrel.",
        technicalDetails:
          "Lock cylinder $D$ contains as many longitudinal bolt chambers as barrels. Each bolt carries a firing pin, mainspring, extractor hook, and an external cam follower lug that rides in the stationary spiral cam groove.",
        archaicTerm: "Lock-cylinder or breech D with lock-hammers b",
        modernEquivalent: "Bolt carrier cylinder and reciprocating bolt assemblies",
      },
      {
        title: "Stationary Cocking Ring P & Spiral Cam Track",
        summary:
          "Fixed rear cam housing converting rotary shaft motion into longitudinal forward-and-back bolt translation.",
        technicalDetails:
          "Stationary ring $P$ with rear inclined planes drives the bolt forward over $180^\\circ$, compresses the firing spring, drops the striker at the bottom, and pulls the bolt rearward over the remaining $180^\\circ$ to extract the case.",
        archaicTerm: "Stationary ring P with inclined planes",
        modernEquivalent: "Stationary internal barrel cam track",
      },
      {
        title: "Main Drive Shaft N, Pinion L, & Hand Crank S",
        summary:
          "Manual gear drive multiplying operator hand torque into smooth high-speed continuous cluster rotation.",
        technicalDetails:
          "Hand crank $S$ turns transverse shaft $M$ and pinion $L$, which meshes with large crown gear $K$ on main shaft $N$, providing mechanical advantage and smooth continuous rotation without jerky ratchet indexing.",
        archaicTerm: "Crank S, shaft M, pinion L, and cog-wheel K",
        modernEquivalent: "Geared manual drive train and main rotor shaft",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Rotary Kinematic Multiplexing & Cyclic Timing",
        formula:
          "\\text{ROF} = N_{\\text{barrels}} \\cdot \\text{RPM}_{\\text{crank}} \\cdot \\frac{Z_K}{Z_L}, \\quad \\Delta t_{\\text{cycle}} = \\frac{60}{\\text{ROF}}",
        explanation:
          "Spreading the discrete mechanical operations (feed, chamber, lock, fire, extract, eject) across $N$ angular sectors allows continuous uniform cranking rather than stop-and-start reciprocating stroke cycles.",
      },
      {
        principle: "Cycloidal Cam Profile & Acceleration Control",
        formula:
          "a_{\\text{bolt}}(\\theta) = \\omega^2 \\frac{d^2 z}{d\\theta^2}, \\quad F_{\\text{cam}} = m_{\\text{bolt}} a_{\\text{bolt}} + F_{\\text{friction}} + F_{\\text{spring}}",
        explanation:
          "The helical cam profile is contoured with cycloidal ramps to minimize peak jerk ($da/dt$), preventing bolt binding and reducing hand crank operating torque.",
      },
      {
        principle: "Multi-Barrel Convective & Radiative Heat Dissipation",
        formula:
          "\\dot{q}_{\\text{cluster}} = N \\cdot \\left[ h(\\omega) A (T_{\\text{barrel}} - T_0) + \\varepsilon \\sigma A (T_{\\text{barrel}}^4 - T_0^4) \\right]",
        explanation:
          "Rotation through ambient air increases the convective heat transfer coefficient ($h \\propto \\omega^{0.6}$), while distributing the total thermal enthalpy across $N$ barrels prevents any single barrel from reaching softening or cook-off temperatures ($>300^\\circ\\text{C}$).",
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
  archivalEdition: gatlingGunArchivalEdition,
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claims the combined rotating assembly, not a barrel alone: the breech, grooved carrier, circular plate, and barrels must be fixed to one main shaft, with their locks, grooves, and bores parallel to the rotation axis so the parts turn together.",
      keyInnovations: [
        "Common main shaft",
        "Rotating lock-cylinder",
        "Grooved cartridge carrier",
        "Parallel barrel and lock axes",
      ],
      legalSignificance:
        "The first claim fixes the coordinated, co-rotating architecture that the specification describes.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claims the one-lock-per-barrel arrangement, with every lock revolving at the same time as the breech and barrel group and working in the described sequence.",
      keyInnovations: ["One lock per barrel", "Simultaneous lock rotation"],
      legalSignificance:
        "This is a separate claim to the numerical and kinematic relationship between barrels and locks.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claims the fixed ring whose two sloping rear surfaces cock and then reposition each rotating hammer in relation to the lock-cylinder.",
      keyInnovations: ["Stationary cocking ring", "Inclined hammer-cocking planes"],
      legalSignificance:
        "It isolates the triggerless cocking and firing control surface from the broader rotating assembly.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claims the lock tubes as an assembly: their flanged breech-pins, springs, hammers, and mainsprings work with the rotating breech, divider disk, and its projecting swell to seat the cartridge-chamber and energize the hammer.",
      keyInnovations: ["Lock tubes", "Flanged breech-pins", "Disk swell", "Hammer mainsprings"],
      legalSignificance:
        "This claim identifies the pressure-sealing and hammer-driving parts inside the rotating breech.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "Claims the internal divider disk together with the outer casing, whose forward and rear portions shield the rotating locks and gears from damage.",
      keyInnovations: ["Divider disk", "Protective outer casing", "Lock and gear shielding"],
      legalSignificance:
        "This is the specific protective enclosure claim, separate from the firing and feeding claims.",
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
    totalClaims: 5,
    independentClaims: 5,
  },
};
