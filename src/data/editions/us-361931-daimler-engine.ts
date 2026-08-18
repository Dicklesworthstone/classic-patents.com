import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];

const FIGURE_SHEETS = {
  1: {
    src: "/patents/figures/us-361931-daimler-engine-fig-1.png",
    alt: "Sheet 1 of the US 361,931 facsimile: Figure 1, a longitudinal vessel section with the marine engine and screw propeller.",
    width: 1238,
    height: 1818,
  },
  2: {
    src: "/patents/figures/us-361931-daimler-engine-fig-2.png",
    alt: "Sheet 2 of the US 361,931 facsimile: Figure 2 and detail Figures 4, 4a, 4b, 5, and 6.",
    width: 1238,
    height: 1818,
  },
  3: {
    src: "/patents/figures/us-361931-daimler-engine-fig-3.png",
    alt: "Sheet 3 of the US 361,931 facsimile: Figure 3, the plan of the vessel installation.",
    width: 1238,
    height: 1818,
  },
} as const;

const figure = (
  label: string,
  sheets: readonly (keyof typeof FIGURE_SHEETS)[],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Preview ${label} from the US 361,931 source facsimile`,
  figurePreviews: sheets.map((sheet) => FIGURE_SHEETS[sheet]),
});

/**
 * A direct, continuous manual edition of US 361,931. The first three pages
 * are its three drawing sheets; the last three are the two-page specification
 * and claim sheet. The edition follows source order, without presenting a
 * car, differential, or vehicle claim absent from the pinned facsimile.
 */
export const daimlerMarineEngineArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "1c20cb38fad97fe6658cd711d7009dcb70da74af4cf22aec380882e055407159",
  preparedBy: "Classic Patents editorial agent (codex-hotel)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "GOTTLIEB DAIMLER, OF CANNSTADT, WÜRTEMBERG, GERMANY.",
        "EXPLOSIVE-GAS MARINE ENGINE.",
        "No. 361,931. Specification forming part of Letters Patent, dated April 26, 1887.",
        "Application filed November 9, 1886. Serial No. 218,411. (No model.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 1",
      title: "Longitudinal section of vessel installation",
      description: text(
        "G. DAIMLER. EXPLOSIVE GAS MARINE ENGINE. No. 361,931. Patented Apr. 26, 1887. 3 Sheets—Sheet 1. Fig. 1.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 2, 4, 4a, 4b, 5, AND 6",
      title: "Cross-section, thrust-bearing, and gas-holder details",
      description: text(
        "G. DAIMLER. EXPLOSIVE GAS MARINE ENGINE. No. 361,931. Patented Apr. 26, 1887. 3 Sheets—Sheet 2. Figs. 2, 4, 4a, 4b, 5, and 6.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 3",
      title: "Plan of vessel installation",
      description: text(
        "G. DAIMLER. EXPLOSIVE GAS MARINE ENGINE. No. 361,931. Patented Apr. 26, 1887. 3 Sheets—Sheet 3. Fig. 3.",
      ),
    },
    { kind: "paragraph", inlines: text("To all whom it may concern:") },
    {
      kind: "paragraph",
      inlines: text(
        "Be it known that I, GOTTLIEB DAIMLER, a citizen of Würtemberg, residing at Cannstadt, in the Kingdom of Würtemberg and Empire of Germany, have invented a new and useful Apparatus for Effecting Marine Propulsion by Gas or Petroleum Motor-Engines, (for which I have obtained a patent in France, dated October 26, 1886, No. 179,236; in Belgium, dated December 15, 1886, No. 75,352; in Italy, dated November 23, 1886, No. 20,721; in Germany, dated March 1, 1887, No. 39,367, and have made application for patent in Great Britain, dated November 1, 1886, No. 14,043,) of which the following is a specification.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "My invention relates to apparatus for effecting the propulsion of a boat or vessel by a gas or petroleum motor instead of by a steam-engine, whereby a maximum of speed is obtained with a minimum extent of immersion of the vessel, inasmuch as the load of coals, water, and metal ballast required with the latter is greatly diminished, so that the capacity and power of the vessel are utilized to a much greater extent in the transport of loads.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "As the motor I employ, by preference, the gas or petroleum motor-engine described in the specification to my United States Patent No. 349,983, dated September 28, 1886. The motor-engine is so arranged as to drive the screw-propeller through a ",
        },
        {
          kind: "term",
          text: "friction-coupling",
          definition:
            "A coupling that transmits torque through pressed friction surfaces rather than a positive tooth engagement.",
          label: "Mechanism",
        },
        {
          kind: "text",
          text: " for the forward motion, and through friction or toothed gearing for the backward motion, in such manner that the motion of the screw-propeller produces automatically the required frictional contact of the coupling or of the gearing.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The improvements consist, furthermore, in arranging the propeller-shaft, with its propeller and half-coupling, to slide longitudinally somewhat for the above purpose, and in combining together the apparatus for stopping, starting, and reversing the screw-propeller, and for the steering of the vessel, so as to effect these operations at one and the same point; also, in the provision of a ",
        },
        {
          kind: "term",
          text: "thrust-bearing",
          definition:
            "A bearing arranged to receive axial force along a shaft, here the force from the propeller.",
          label: "Mechanism",
        },
        {
          kind: "text",
          text: " at the motor-engine for taking the thrust of the screw, in combination with the starting-gear; also, in effecting the cooling of the motor-cylinder by means of the water in which the vessel is running, this being made to circulate round the cylinder either by a siphon arrangement operating in combination with the motion of the vessel or by a centrifugal pump driven by the motor, and, lastly, in utilizing the waste-spaces of the vessel as gas-reservoirs, either at atmospheric or higher pressure, and in arranging these in such manner as to make the ship more or less unsinkable.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "On the accompanying drawings, " },
        figure("Figure 1", [1]),
        {
          kind: "text",
          text: " shows a part longitudinal section of a vessel with gas or petroleum motor-engine constructed according to my invention. ",
        },
        figure("Fig. 2", [2]),
        { kind: "text", text: " shows a cross-section. " },
        figure("Fig. 3", [3]),
        { kind: "text", text: " shows a plan; " },
        figure("Figs. 4, 4a, 4b", [2]),
        { kind: "text", text: ", detail views of the thrust-bearing for the propeller; " },
        figure("Fig. 5", [2]),
        {
          kind: "text",
          text: ", a broken longitudinal sectional view showing one of the high-pressure gas-holders, and ",
        },
        figure("Fig. 6", [2]),
        { kind: "text", text: " a transverse sectional view of " },
        figure("Fig. 5", [2]),
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "A is the motor-engine. a is the half-coupling fixed on the motor-shaft; a², that fixed on the propeller-shaft b, which is in line with the motor-shaft and can shift longitudinally somewhat in its bearings. In addition to the coupling a² it carries the reversing-disk c, and at its outer end the screw-propeller d, all being fixed thereon. The half-coupling a² acts with its projecting flange as friction-disk for reversing.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text("The motor-engine is driven continuously in one and the same direction."),
    },
    {
      kind: "paragraph",
      inlines: text(
        "For the forward propulsion of the vessel the propeller-shaft is in the first instance pressed by hand or otherwise toward the motor, so that the half-couplings a a² are in sufficient frictional contact to effect the starting of the screw, whereupon the thrust of the latter itself maintains the required contact. The coupling a a² may be either conical or flat.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "For the backward motion of the vessel the propeller-shaft is drawn backward, so as to disconnect the coupling a a², while the intermediate friction-disks, e' e², are at the same time pressed by elbow-levers f' f² against the disks a² c, in consequence of which the screw will be rotated in the contrary direction, so as to propel the ship backward. The elbow-levers f' f² have their fulcra at g' g², and transmit by their connection with the boss of the disk c the longitudinal motion of the propeller-shaft to the disks e' e² by pressing on the projecting centers e³ e⁴ thereof. In order to transmit such pressure equally to the two disks e' e², a cross-head, h' h², pivoted at h³, is employed.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "The disks e' e² rotate free in their bearings e⁵ e⁶, and when not acted on by the levers f' f² they are pushed outward by helical springs e⁷ e⁸, so as to be out of contact with the disks a² c. In place of the disks a² e' c may also be used bevel-wheels always kept in gear, in which case the wheel taking the place of c would be loose on the propeller-shaft and formed with a coupling similar to a'. A bearing behind the latter would then take the pull of the reversed propeller-shaft, and this pull would effect the frictional contact of the coupling of c for running backward.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "For pressing the propeller-shaft forward toward the motor-engine, a helical spring, i', is provided, which always tends to move the shaft forward, so as to keep the coupling a a² slightly in contact. In order to prevent the coupling a a² from being brought too rapidly into forcible contact by the thrust of the propeller, so as to insure a gradual starting, as also a gradual stopping and reversing, a screw-spindle, k', with hand wheel or crank k², elbow-lever l, and fixed collar i², are provided. The collar i² serves as abutment for the spring i' and is loose on the shaft. In place of the spring i' and collar i², a second fixed collar may be fixed on the shaft in front of the lever l, so that the forward motion of the shaft is also effected by this. The lever may also be arranged either straight or as an elbow-lever to be acted upon directly by hand or foot, instead of through a screw-spindle.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "By the above-described arrangement, wherein the propeller-shaft is connected to the engine-shaft by a frictional coupling controlled by the spindle k' and lever l, it will be seen that without altering the speed of the engine the speed of the propeller, and consequently the motion of the vessel, can be increased or decreased at will or entirely stopped by simply causing the frictional coupling to be brought in contact with greater or less force.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "For steering the vessel the rudder m is connected by a chain or other mechanism with the shaft o', which is turned in one direction or the other, by means of the levers o² o³, by the steersman sitting on the seat p. The spindle k' is either carried through the steering-shaft o', as shown, or it is arranged at the side thereof, so as to have the whole controlling mechanism arranged conveniently together at the seat p.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The thrust of the propeller is taken by the thrust-bearing q on the front side of the motor-engine. This bearing is shown to an enlarged scale at ",
        },
        figure("Figs. 4, 4a, and 4b", [2]),
        {
          kind: "text",
          text: ". It is provided with a crank-handle, r', by means of which the engine can be started. For this purpose the bearing has a sliding pin, r², which can be pushed inward, so as to gear with a stud, r³, on the motor-shaft, so that the rotation of the bearing will also cause the shaft to be rotated, so as to start the engine. The pin r² being formed with an incline, it will be pushed out of gear by the pressure of the stud when the engine is started, as shown at ",
        },
        figure("Fig. 4a", [2]),
        {
          kind: "text",
          text: ", so that the bearing q and its crank-handle r' will then remain stationary.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "The cooling of the motor-cylinder is effected by a current of water passing through the pipe s' from the bows of the vessel to the jacket of the cylinder, and thence through the pipe s² to the stern, the current being produced on the forward motion of the vessel by the forcing action at the trumpet-mouthed forward end of s' and by the exhaust action at the rear end of s². For starting the siphon-like action, the pipes and water-jacket are in the first instance filled with water through a funnel, t, with cock t', the supply-pipe s' being provided with a stop-valve, s³. According to another arrangement, the water is drawn up from the outside by a centrifugal pump, u, and, after circulating through the jacket, flows back to the outside again. The two arrangements may be combined, as shown on the drawings.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "For discharging bilge-water, the pipe s' has a funnel-opening, v, provided with a three-way stop-cock, so that the circulating water can either be drawn from the bilge or from the external water. In place of a centrifugal pump an air-fan for cooling the cylinder by means of air-currents may be used.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "When using combustible gas for working the motor-engine, high-pressure gas-holders w² are provided on the vessel in suitable places—such as under the seats—while other parts of the vessel—as, for instance, spaces w' in the hold under the deck—may themselves be formed into reservoirs of gas at atmospheric pressure, for which purposes these spaces are lined with a gas-tight fabric, which may be made as a bag, so as to expand against the under side of the deck when charged with gas, as indicated on the drawings. These gas-holders or reservoirs are charged, respectively, with gas at high pressure and at atmospheric pressure at the end station. The motor-engine draws in the gas from the bag-like reservoir w', and this is replenished from the high-pressure reservoir w² through a cock, x, that is opened and closed either by hand or automatically by a tappet connected to the rising and falling bag y. The several high-pressure gas-holders are all connected either directly to the low-pressure reservoir or they are connected with each other by means of pipes provided with stop-cocks. They also serve as floats for rendering the vessel entirely or partially unsinkable.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "When using petroleum for working the motor-engine, I employ, by preference, the petroleum apparatus described in my before-mentioned prior patent.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "Having thus described the nature of my invention and the best means I know for carrying the same into practical effect, I claim—",
      ),
    },
    {
      kind: "claim",
      number: 1,
      inlines: text(
        "The combination, with the propeller and propeller-shaft of a vessel and with part of a friction-coupling on said shaft, of a gas or petroleum motor-engine having its shaft arranged in line with the propeller-shaft and provided with part of a friction-coupling for effecting the forward motion of the vessel and gearing between the propeller-shaft and the part of the friction-coupling on the engine for effecting the backward motion of the vessel, substantially as described.",
      ),
    },
    {
      kind: "claim",
      number: 2,
      inlines: text(
        "The combination, with the propeller-shaft having a longitudinal movement in its bearings and provided with part of a friction-clutch, of a gas or petroleum motor-engine having its shaft arranged in line with the propeller-shaft and provided with part of a friction-coupling which engages and disengages the part of the friction-coupling by the longitudinal movement of said propeller-shaft, substantially as described.",
      ),
    },
    {
      kind: "claim",
      number: 3,
      inlines: text(
        "In combination with a gas or petroleum motor-engine, a propeller-shaft connected to the engine-shaft by a friction-coupling and capable of sliding longitudinally in its bearings, so that the thrust of the propeller when in motion will maintain the frictional contact of the coupling.",
      ),
    },
    {
      kind: "claim",
      number: 4,
      inlines: text(
        "In combination with the frictional coupling connecting the engine-shaft with the sliding propeller-shaft, the friction-disks c e' e² and the levers f' f², connected to the propeller-shaft, constituting mechanism for reversing the motion of the propeller, the pull of the latter when reversed being made to effect the required frictional contact between the disks e' e² and c for this purpose.",
      ),
    },
    {
      kind: "claim",
      number: 5,
      inlines: text(
        "The combination, with a motor-engine, the propeller-shaft of a vessel, and a friction-coupling connecting the engine and propeller-shaft, of a thrust-bearing, q, for taking the thrust of the propeller, and means for starting the engine, comprising the crank-handle r and sliding pin r², substantially as described.",
      ),
    },
    {
      kind: "claim",
      number: 6,
      inlines: text(
        "The combination, with the rudder and the longitudinally-movable propeller-shaft, of the vertical shaft o', levers o² o³, chain n, or equivalent screw-spindle k, and devices connecting said spindle with the propeller-shaft for steering the vessel and shifting the propeller-shaft, substantially as described.",
      ),
    },
    {
      kind: "claim",
      number: 7,
      inlines: text(
        "The combination, with the water-jacket of the motor-cylinder, of fore and aft pipes, s' s², arranged with siphon-like action and communicating with the outer water for effecting the cooling of the cylinder by means of the outer water, substantially as described.",
      ),
    },
    {
      kind: "claim",
      number: 8,
      inlines: text(
        "The combination, with the water-jacket of the motor-cylinder, of fore and aft pipes, s' s², arranged with siphon-like action and communicating with the outer water for cooling the cylinder, and a centrifugal pump, u, for effecting the circulation of the water, substantially as described.",
      ),
    },
    {
      kind: "claim",
      number: 9,
      inlines: text(
        "The combination, with the water-jacket of the motor-cylinder, of fore and aft pipes, s' s², arranged with siphon-like action and communicating with the outer water, a centrifugal pump, u, for effecting the circulation of the water, and the branch pipe v, having a three-way cock for enabling the circulating water to be taken either from the outer water or from the bilge, substantially as described.",
      ),
    },
    {
      kind: "claim",
      number: 10,
      inlines: text(
        "In a vessel propelled by a gas motor-engine, the combination, with the gas motor-engine, of a screw-propeller whose shaft is capable of sliding longitudinally and is geared to the engine-shaft by a friction-coupling, means for longitudinally shifting the propeller-shaft for varying the speed, stopping, and reversing, a low-pressure gas-reservoir for supplying the gas motor-engine with combustible gas, and one or more high-pressure gas-holders that supply the low-pressure reservoir through reducing cocks or valves, substantially as herein described.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "In testimony whereof I have signed my name to this specification, in the presence of two subscribing witnesses, this 23d day of October, A. D. 1886.",
      ),
    },
    { kind: "paragraph", inlines: [{ kind: "small-caps", text: "GOTTLIEB DAIMLER." }] },
    { kind: "paragraph", inlines: text("Witnesses: WILHELM MAYBACH. HERMAN KEPPLER.") },
  ],
};

/**
 * Patent-local, block-addressed Plain English companions for every authored
 * source paragraph. The record stays local until the shared reading registry
 * is intentionally extended by its owner.
 */
export const DAIMLER_MARINE_ENGINE_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> =
  {
    4: [
      "This is the formal opening addressed to the public. It introduces the inventor's description and does not itself define a claim.",
    ],
    5: [
      "Daimler identifies himself as a Würtemberg citizen at Cannstadt and names the subject precisely: an apparatus for marine propulsion using a gas or petroleum motor-engine. The paragraph also records the French, Belgian, Italian, German, and British patent activity printed in the source; it does not say that this United States patent is a carriage patent.",
    ],
    6: [
      "The stated comparison is with a steam-driven boat. Daimler says coal, water, and metal ballast for a steam installation make a vessel sit deeper in the water and take up carrying capacity. His stated object is greater speed with less immersion and more capacity for loads, subject to the patent's particular apparatus rather than an assertion about every internal-combustion boat.",
    ],
    7: [
      "Daimler says he prefers the gas or petroleum motor described in his earlier US 349,983. In this marine installation, a friction coupling drives the screw forward, while friction or toothed gearing supplies backward motion. He says screw motion automatically supplies the required frictional contact. That describes a propeller transmission, not a road-wheel gearbox or differential.",
    ],
    8: [
      "The claimed installation has several linked jobs. The propeller shaft, propeller, and half-coupling can slide a little along the shaft axis. Stopping, starting, reversing, and steering are grouped at one operating point. A thrust bearing at the motor takes the screw's axial force and also works with the starting gear.",
      "Daimler then describes cylinder cooling by surrounding water, either through a siphon-like circulation associated with vessel motion or a motor-driven centrifugal pump. If combustible gas is used, unused vessel spaces may store gas at atmospheric or higher pressure and the gas holders may also give flotation. Each stated feature has a marine condition and is not evidence for the fabricated automobile material removed from this record.",
    ],
    9: [
      "The drawing key is explicit. Figure 1 is a longitudinal vessel section; Figure 2 a cross-section; Figure 3 a plan; Figures 4, 4a, and 4b enlarge the thrust bearing; Figure 5 sections a high-pressure gas holder; Figure 6 is Figure 5's transverse section. These are three sheets of one marine installation.",
    ],
    10: [
      "A is the motor. Half-coupling a is fixed to its shaft; half-coupling a² is fixed to propeller shaft b, which lies in line with the motor shaft and slides in its bearings. The propeller shaft also carries reverse disk c and screw propeller d. The projecting flange of a² acts as a friction disk for reversing. Those named parts establish the ahead/astern transmission geometry.",
    ],
    11: [
      "The motor is described as continuously turning in one direction. Directional change happens downstream in the propeller-shaft coupling and reverse-disk system, not by reversing the motor itself.",
    ],
    12: [
      "To go ahead, the operator first presses the propeller shaft toward the motor. That brings a and a² into enough frictional contact to start the screw. Once turning, propeller thrust is intended to keep the coupling engaged. The source expressly permits either conical or flat coupling faces, so it does not limit this passage to one face shape.",
    ],
    13: [
      "To go astern, the shaft is drawn back, disconnecting a from a². At the same time levers f' and f² press intermediate disks e' and e² against a² and c. The resulting friction makes the screw rotate the opposite way. The levers pivot at g' and g² and use the disk-c boss to transmit longitudinal shaft movement to the disks.",
      "The cross-head h' h², pivoted at h³, equalizes the pressure delivered to both intermediate disks. It is a load-sharing condition for reverse engagement, not an unrelated steering mechanism.",
    ],
    14: [
      "The intermediate disks rotate freely in their bearings and springs hold them away from a² and c until the levers act. Daimler also permits permanently meshed bevel wheels instead of the shown disk arrangement. In that alternative, a loose wheel and a bearing take the pull of the reversed shaft, and that pull produces the reverse frictional contact. The paragraph preserves both disclosed mechanisms and their condition of operation.",
    ],
    15: [
      "Spring i' urges the propeller shaft forward and keeps a and a² slightly touching. A spindle k', hand wheel or crank k², lever l, and collar i² prevent sudden forced contact from propeller thrust. They allow gradual starting, stopping, and reversing. The source also permits a second collar or a straight/elbow lever operated by hand or foot instead of a screw spindle.",
    ],
    16: [
      "The spindle and lever vary the force pressing the friction coupling together. The motor speed need not change: more or less coupling force changes propeller speed and therefore vessel motion, and releasing it can stop the propeller. The claim is about this specific friction-controlled propeller arrangement, not a general variable-speed engine.",
    ],
    17: [
      "Rudder m connects by chain or another mechanism to steering shaft o'. The steersman uses levers o² and o³ at seat p. Spindle k' may pass through the steering shaft or run beside it, placing steering and propeller-shaft control together at that seat. The conjunction of controls is an express physical layout.",
    ],
    18: [
      "Thrust bearing q at the motor's front receives the propeller's axial load. Figures 4, 4a, and 4b enlarge it. Crank handle r' turns the engine through sliding pin r² and stud r³. Once the engine starts, the inclined pin is pushed out of gear by stud pressure, leaving the bearing and crank still. The starting device is therefore temporary engagement, not a continuously driven crank.",
    ],
    19: [
      "Pipe s' brings water from the bow to the cylinder jacket; s² returns it toward the stern. In forward motion, the trumpet-shaped forward opening forces water in and the rear opening exhausts it, establishing the stated siphon-like flow. Funnel t and cock t' initially fill the jacket and pipes, while stop valve s³ controls supply.",
      "Daimler separately discloses centrifugal pump u, which draws outside water up, circulates it through the jacket, and returns it outside. He says the passive and pumped systems may be combined. The source provides no numerical temperature, flow, or power rating.",
    ],
    20: [
      "A funnel opening and three-way stop-cock let the circulating system draw either bilge water or outside water. As an alternative to a centrifugal pump, the source permits an air fan that cools the cylinder with air currents. This preserves the explicit alternatives rather than collapsing them into a single cooling claim.",
    ],
    21: [
      "For combustible gas, high-pressure holders w² can go under seats. Spaces w' under the deck can serve as atmospheric-pressure reservoirs if lined with gas-tight fabric that expands like a bag. The holders/reservoirs are charged at their stated pressures at an end station.",
      "The motor draws from bag-like w'. High-pressure w² replenishes it through cock x, operated by hand or automatically by a tappet following bag y. High-pressure holders may connect to the low-pressure reservoir directly or through stop-cock pipes; the source also says they can act as floats. These are precise storage and flotation effects, not a claim that every boat fuel tank is buoyant.",
    ],
    22: [
      "If petroleum rather than combustible gas is used, Daimler says he prefers the petroleum apparatus in the prior patent already mentioned. This document does not reproduce a petroleum apparatus description or make it a motor-carriage system.",
    ],
    23: [
      "The specification ends its descriptive portion and introduces ten numbered legal claims. The claims select particular combinations from the preceding explanation; they do not make every descriptive detail independently protected.",
    ],
    34: [
      "Daimler signs the specification on October 23, 1886 in the presence of two subscribing witnesses. This is an execution statement, not an eleventh claim or an additional operating condition.",
    ],
    35: [
      "Gottlieb Daimler is the named inventor signing the specification. The signature formalizes the document and does not identify a vehicle inventor or add a vehicle claim.",
    ],
    36: [
      "Wilhelm Maybach and Herman Keppler are the two witnesses printed below the signature. They are witnesses to execution in this patent document, not co-inventors listed in the patent's inventor field.",
    ],
  };
