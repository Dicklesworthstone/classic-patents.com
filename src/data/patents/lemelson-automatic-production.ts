import { lemelsonAutomaticProductionArchivalEdition } from "@/data/editions/lemelsonAutomaticProductionEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = lemelsonAutomaticProductionArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Lemelson automatic-production manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

const claimDecoder = (
  number: number,
  plainEnglish: string,
  keyInnovations: string[],
  options: Pick<
    (typeof lemelsonAutomaticProductionPatent)["claims"][number],
    "dependsOn" | "isIndependent" | "legalSignificance"
  >,
) => ({ number, originalText: manualClaimText(number), plainEnglish, keyInnovations, ...options });

export const lemelsonAutomaticProductionPatent: Patent = {
  id: "us-3313014-lemelson-automatic-production",
  patentNumber: "US 3,313,014",
  title: "Automatic Production Apparatus and Method",
  shortTitle: "Lemelson Carrier-Programmed Production Line",
  subtitle:
    "Carrier-Mounted Program Control, Marker Feedback, Station Coupling, and Workpiece Prepositioning",
  inventors: ["Jerome H. Lemelson"],
  inventorLocation: "Metuchen, New Jersey",
  grantDate: "1967-04-11",
  filingDate: "1965-04-08",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Industrial Automation & Programmable Production",
  summary:
    "Jerome H. Lemelson's 1967 grant claims an automatic production line in which an individually carried workpiece can be routed to a selected station, positioned and secured there, coupled to the station's controls, operated under a carrier-mounted program, then released for the next station. Its legal center is the coordinated relationship among carrier, guideway, marker sensing, program record, securing means, and machine tool, not a claim to factory automation in the abstract.",
  heroQuote:
    "It is, accordingly, a primary object of this invention to provide an automatic production apparatus including a transfer system which is flexible and capable of performing a plurality of different operations on a work piece in a cycle which may be varied without changes in machine set-up.",
  originalPdfUrl: "/patents/pdfs/us-3313014-lemelson-automatic-production.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3313014A/en",
  usptoClassification: "Cl. 29-33",
  archivalEdition: lemelsonAutomaticProductionArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-3313014-lemelson-automatic-production-reviewed.txt",
    pageCount: 15,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "6554714ab50e6e0e194081b6cb67c02d689a218418710be059998502ef329548",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "6 Sheets-Sheet 1",
        sourceRelationship: "printed drawing sheet 1 of 6",
      },
      {
        page: 2,
        exactSourceText: "6 Sheets-Sheet 2",
        sourceRelationship: "printed drawing sheet 2 of 6",
      },
      {
        page: 3,
        exactSourceText: "6 Sheets-Sheet 3",
        sourceRelationship: "printed drawing sheet 3 of 6",
      },
      {
        page: 4,
        exactSourceText: "6 Sheets-Sheet 4",
        sourceRelationship: "printed drawing sheet 4 of 6",
      },
      {
        page: 5,
        exactSourceText: "6 Sheets-Sheet 5",
        sourceRelationship: "printed drawing sheet 5 of 6",
      },
      {
        page: 6,
        exactSourceText: "6 Sheets-Sheet 6",
        sourceRelationship: "printed drawing sheet 6 of 6",
      },
      {
        page: 7,
        exactSourceText: "United States Patent Office",
        sourceRelationship: "printed specification masthead and opening",
      },
      {
        page: 8,
        exactSourceText: "FIG. 14 is an end view",
        sourceRelationship: "printed specification page 3",
      },
      {
        page: 9,
        exactSourceText: "The fixture for supporting the work piece W",
        sourceRelationship: "printed specification page 5",
      },
      {
        page: 10,
        exactSourceText: "Various automatic production setups",
        sourceRelationship: "printed specification page 7",
      },
      {
        page: 11,
        exactSourceText: "FIG. 13 also shows coupling means 85",
        sourceRelationship: "printed specification page 9",
      },
      {
        page: 12,
        exactSourceText: "FIGS. 14 and 15 illustrate conveying apparatus",
        sourceRelationship: "printed specification page 11",
      },
      {
        page: 13,
        exactSourceText: "3. Apparatus in accordance with claim 2",
        sourceRelationship: "printed claims page 13–14",
      },
      {
        page: 14,
        exactSourceText: "12. An automatic production system comprising",
        sourceRelationship: "printed claims page 15–16",
      },
      {
        page: 15,
        exactSourceText: "17. An automatic production apparatus comprising",
        sourceRelationship: "printed claims page 17–18 and examiner line",
      },
    ],
  },
  originalText:
    "This invention relates to automatic production apparatus and is a continuation-in-part of my copending application Ser. No. 152,702 for Automatic Production Systems, filed on Oct. 17, 1961, which was a division of application Ser. No. 449,874 filed on July 28, 1954, now abandoned. In the art of fabricating products automatically by use of a plurality of machines operative to perform various operations on said products or components thereof, continuous flight or belt conveyors have been employed for the transfer of articles or assemblies between machines. U.S. Patent 2,139,403 provides a machine transfer apparatus employing different lengths of helical screw drives operative to effect the transfer of work holding fixtures between machine tools. However, such systems are relatively inflexible and are designed to perform a particular machining operation relative to a particular work piece and repeat said operation in the same manner on each work piece fed to the transfer line.",
  plainEnglishExplanation: {
    overview:
      "The bottleneck was not merely moving a part down a line. A conventional transfer line repeats one set-up against one workpiece; changing hole locations, finish, inspection, or assembly could require idling or rebuilding the line. Lemelson placed a programmable controller with each work carrier. Marker sensing identifies a station, the carrier stops and locks, its controller couples to the station's machine controls, and the sequence later releases the carrier. That architecture lets the same physical route support different programmed operations without treating every carrier as identical.",
    coreMechanism:
      "The source's causal chain is discrete and mechanical: a carrier travels along guideway 21 under Mx; a station marker triggers controller 47; the carrier is retained; My and Mz preposition the platform; contacts 86 and 87 couple the portable program to machine MT; the machine cycle runs; then the controller reverses the positioning motions and restarts Mx. The grant supplies no travel distance, mass, speed, tool force, electrical rating, or timing. The shared kernel therefore represents $q=[x,y,z,\\theta]$ as normalized pose coordinates and evaluates the claim-linked state $ready=markerMatched\\land locked\\land coupled$, rather than inventing SI performance numbers.",
    mechanicalBreakdown: [
      {
        title: "Guideway, carriage, and horizontal servo Mx",
        summary: "An overhead or floor guide carries work from one selected station to another.",
        technicalDetails:
          "The source names track 21, carriage 22, wheels 24, a friction-drive wheel 25, and reversible motor Mx. The motion coordinate is represented as $x\\in[0,1]$ because the grant specifies the topology but no physical rail length, velocity, acceleration, or motor torque.",
        archaicTerm: "guide means",
        modernEquivalent: "A guided transport axis or rail-based material-handling path",
      },
      {
        title: "Column, lift Mz, and platform reach My",
        summary: "The work carrier can lift and reach to preposition a workpiece at a machine.",
        technicalDetails:
          "Column 23, collar 38, worm 42, and Mz form a vertical axis; platform 35, rack 39', pinion 39, and My form a reach axis. The visual uses normalized $y$ and $z$ poses, preserving the claimed ordering of axes without asserting unprinted stroke lengths or loads.",
        archaicTerm: "prepositioning",
        modernEquivalent: "Alignment of a part fixture relative to a process station",
      },
      {
        title: "Marker sensing and predetermining control",
        summary:
          "A position event advances the program from travel to the selected station sequence.",
        technicalDetails:
          "The source gives limit switches, pins, photoelectric sensing, and counters as alternatives. The relevant relation is logical, not dimensional: $markerMatched=1$ permits the selected station cycle. No claim here establishes encoder resolution, position error, or a feedback update rate.",
        archaicTerm: "predetermining controller",
        modernEquivalent: "Preset event counter or sequence controller",
      },
      {
        title: "Station securing and control coupling",
        summary:
          "A carrier is retained and its portable program connects to the fixed tool only after positioning.",
        technicalDetails:
          "The source names clamp or magnet devices and contact pairs 86 and 87. The live claim probe evaluates $ready=markerMatched\\land locked\\land coupled$; an uncoupled carrier never asserts a station command in the shared model.",
        archaicTerm: "coupling means",
        modernEquivalent:
          "Physical or electrical interface between a mobile fixture and a station controller",
      },
      {
        title: "Release and departure",
        summary:
          "A completed station sequence unlocks and sends the work carrier onward or bypasses a station.",
        technicalDetails:
          "Claims 7, 13, 14, 19, and 20 connect machine completion to release and renewed conveyance. The model visibly opens the lock before travel state resumes, but it does not simulate cutting forces, work quality, pneumatic pressure, or a machine process time that the grant never prints.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Serial kinematic coordinate decomposition",
        formula: "$q=[x,y,z,\\theta]$",
        explanation:
          "The drawing separates guideway travel, vertical movement, platform reach, and rotation. The equation describes the arrangement of configuration coordinates only; the source does not provide the link lengths or inertial values needed to turn it into a physical robot dynamics calculation.",
      },
      {
        principle: "Discrete-event interlock",
        formula: "$ready=markerMatched\\land locked\\land coupled$",
        explanation:
          "A station command is permitted only after the selected station is detected, the carrier is retained, and the controller is coupled to the machine. This is a direct engineering reading of the marker, securing, and contact relationships in the grant, not a modern safety certification claim.",
      },
      {
        principle: "State-machine production sequence",
        formula:
          "$travel\\rightarrow locate\\rightarrow lock\\rightarrow couple\\rightarrow operate\\rightarrow release\\rightarrow travel$",
        explanation:
          "The described Fig. 13 sequence issues Mx, My, Mz, clamp, coupling, and release commands in order. It makes the production mechanism teachable as a causal state transition rather than an animated conveyor decoration.",
      },
    ],
    whyItMattersToday:
      "The technical inheritance is the coupling of routing, fixture alignment, station authorization, and program selection. Modern flexible manufacturing systems distribute different work instructions to different parts and stations by electronic means, but this grant's contribution is much narrower and more mechanical: a carrier-bound record and controller, a sensed station, a physical machine interface, and an ordered release-and-transfer sequence. Claims 1, 7, 13, 19, and 20 make that combination readable without claiming that this document alone created later factory automation.",
  },
  claims: [
    claimDecoder(
      1,
      "Claim 1 protects a complete line in which individual work carriers travel past tools, sense a station, are power-secured in alignment, and read a carrier-held record that both stops the carrier and commands selected machines. It joins physical transport, retention, sensing, reading, and machine operation into one system claim.",
      [
        "Carrier-held record",
        "Station sensing",
        "Power-driven securing means",
        "Selected-tool control",
      ],
      {
        isIndependent: true,
        legalSignificance:
          "This is the broadest issued combination of per-carrier program records with guided transfer, station sensing, retention, and machine control.",
      },
    ),
    claimDecoder(
      2,
      "Claim 2 focuses on the programming arrangement: a multi-circuit controller chooses a tool, sequences control signals, and activates when scanning identifies arrival at a station. Its legal work is to bind selection and operation of a machine to the arriving work unit rather than merely to continuous conveyor motion.",
      ["Multi-circuit program controller", "Tool identification", "Scanning activation"],
      { isIndependent: true },
    ),
    claimDecoder(
      3,
      "Claim 3 narrows Claim 2 to machines with variable operating elements. It covers using the carrier's program controller to alter those elements for different work pieces, so that the same line can execute different operations without requiring a different physical transfer line.",
      ["Variable machine elements", "Program-to-machine coupling"],
      { isIndependent: false, dependsOn: [2] },
    ),
    claimDecoder(
      4,
      "Claim 4 narrows the controller to a recording member, reading means, and a coupling from its variable-control output to a selected tool. It makes the recording and its connection to an arriving machine part of the protected industrial-control combination.",
      ["Recording member", "Reading means", "Variable control output"],
      { isIndependent: false, dependsOn: [2] },
    ),
    claimDecoder(
      5,
      "Claim 5 adds one carrier per work unit, station retention, carrier presence sensing, and a response that reads the controller record. It connects the physical event of arrival to the act of retrieving the programmed machine instructions.",
      ["Carrier-per-work-unit", "Presence sensing", "Record reading trigger"],
      { isIndependent: false, dependsOn: [2] },
    ),
    claimDecoder(
      6,
      "Claim 6 claims an overhead trackway with individual carriers, location-identifying means, a scanner, feedback signals, and controls that first position the carrier, then operate a station tool, then send the carrier onward. It is a route, sense, operate, and depart sequence expressed as an apparatus.",
      ["Overhead trackway", "Location scanner", "Feedback signals", "Sequential station control"],
      { isIndependent: true },
    ),
    claimDecoder(
      7,
      "Claim 7 protects the general work-holder, conveying system, multi-circuit controller, selective positioning, machine coupling, operating command, uncoupling, and departure chain. It makes the transition from a coupled working state back to travel an explicit legal element.",
      ["Selective positioning", "Program-to-machine coupling", "Uncoupling and departure"],
      {
        isIndependent: true,
        legalSignificance:
          "This independent claim most directly maps to the live coupling probe: without coupling, the model refuses the station-operation state and retains the travel-only path.",
      },
    ),
    claimDecoder(
      8,
      "Claim 8 narrows Claim 7 to a radiation-based coupling: a source on the carrier is modulated after coupling and a receiver on the machine uses that signal to vary the machine. It protects one optical communication option, not every possible station interface.",
      ["Modulated radiation coupling", "Machine receiver"],
      { isIndependent: false, dependsOn: [7] },
    ),
    claimDecoder(
      9,
      "Claim 9 narrows Claim 7 to mechanically meeting electrical contactors. First contacts move with the work holder and second contacts at the machine engage them after positioning, connecting the portable program controller with the machine controls.",
      ["Electrical contactors", "Position-triggered connection"],
      { isIndependent: false, dependsOn: [7] },
    ),
    claimDecoder(
      10,
      "Claim 10 claims a self-propelled carrier, its guideway, a carrier-mounted predetermining controller, station identifiers, a scanner, feedback, and a subsequent local work-positioning action. It emphasizes carrier navigation followed by a finer positioning action at the selected machine.",
      [
        "Self-propelled carrier",
        "Predetermining controller",
        "Station markers",
        "Secondary positioning",
      ],
      { isIndependent: true },
    ),
    claimDecoder(
      11,
      "Claim 11 adds a pair of coupling means and requires their automatic connection after arrival before the controller commands a variable operation. It makes the physical controller-to-station interface a condition for the work-station action.",
      ["First and second coupling means", "Automatic connection", "Variable station operation"],
      { isIndependent: false, dependsOn: [10] },
    ),
    claimDecoder(
      12,
      "Claim 12 recites a production line with servo-powered machines, carriers, carrier controls, station retention, relay sensing, and a variable program device on every carrier. It claims the coordinated per-carrier control of both stopping and selected-station operation.",
      ["Per-carrier program device", "Relay sensing", "Power-driven retention"],
      { isIndependent: true },
    ),
    claimDecoder(
      13,
      "Claim 13 claims a movable work support, guide, powered station device, locking means, and a controller that locks during the operation then releases for departure. It frames alignment and retention as a required part of performing the station operation.",
      ["Movable work support", "Lock during operation", "Programmed release"],
      { isIndependent: true },
    ),
    claimDecoder(
      14,
      "Claim 14 similarly claims carrier, guide, tool, securing means, switch, synchronization with tool completion, release, and departure. Its legal work is to connect the tool's completion state to unlocking and renewed carrier motion.",
      ["Carrier securing means", "Completion-synchronized release", "Guideway departure"],
      { isIndependent: true },
    ),
    claimDecoder(
      15,
      "Claim 15 claims a moving carrier with a control element that a station actuates as the carrier reaches it, stopping the carrier at a selected station. It protects an event-triggered stop arrangement, not a numerical location-accuracy specification.",
      ["Carrier-mounted control element", "Station actuator", "Selected-station stop"],
      { isIndependent: true },
    ),
    claimDecoder(
      16,
      "Claim 16 claims changeable record means mounted on each carrier, reading triggered after a carrier is prepositioned, and transmission of the resulting signals to a selected device. It makes a carrier-held program record part of an industrial machine-control combination.",
      ["Changeable record means", "Preposition-triggered reading", "Selected-device signals"],
      { isIndependent: true },
    ),
    claimDecoder(
      17,
      "Claim 17 claims two aligned tracks and carrier alignment means that engage the second track opposite a machine tool. The point is precise relative location of carrier-held work at a tool, not a claim to tool cutting force or tolerance.",
      ["Two-track alignment", "Carrier alignment means", "Tool-relative positioning"],
      { isIndependent: true },
    ),
    claimDecoder(
      18,
      "Claim 18 claims self-propelled carriers, work stations with variable means, and a multi-circuit programmable controller carried by each carrier that both positions the carrier and controls variable station operations after alignment.",
      ["Self-propelled carriers", "Carrier-borne controller", "Variable station means"],
      { isIndependent: true },
    ),
    claimDecoder(
      19,
      "Claim 19 claims conveying, machine operation, locating and securing work, three separate power functions, and a pre-programmed controller that selectively actuates travel, securing, and machine operation. It is the compact power-sequence formulation of the patent's central cycle.",
      ["First, second, and third power means", "Pre-programmed sequence", "Work securing"],
      {
        isIndependent: true,
        legalSignificance:
          "This is the clearest independent power-sequence claim and supplies the state-machine structure used by the shared topological kernel.",
      },
    ),
    claimDecoder(
      20,
      "Claim 20 narrows Claim 19 by requiring the controller to release the work securing means after the machine terminates its operation and then restart the conveyance. It protects the release-before-departure portion of the claimed sequence.",
      ["Post-operation release", "Conveyance restart"],
      { isIndependent: false, dependsOn: [19] },
    ),
    claimDecoder(
      21,
      "Claim 21 narrows Claim 19 with a pallet that is guided into operative relation with a machine, located there, and held by station securing means. It binds the general sequence to a palletized work-holding embodiment.",
      ["Pallet means", "Pallet locating means", "Station securing means"],
      { isIndependent: false, dependsOn: [19] },
    ),
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Automatic production line and carrier",
      caption:
        "Drawing sheet 1's plan view establishes the overhead guideway 21, the traveling carrier arrangement, and adjacent work stations.",
      svgType: "lemelson-automatic-production",
      callouts: [
        {
          id: "track-21",
          figureRef: "Fig. 1",
          label: "Guideway",
          element: "21",
          description: "The source track along which the carrier is guided between stations.",
          x: 52,
          y: 13,
        },
        {
          id: "carriage-22",
          figureRef: "Fig. 1",
          label: "Carriage",
          element: "22",
          description: "Overhead traveling carriage supporting the lower handling assembly.",
          x: 11,
          y: 26,
        },
        {
          id: "column-23",
          figureRef: "Fig. 1",
          label: "Vertical column",
          element: "23",
          description: "Column that carries the vertically movable work-support assembly.",
          x: 24,
          y: 59,
        },
        {
          id: "platform-35",
          figureRef: "Fig. 1",
          label: "Platform",
          element: "35",
          description: "Work-support platform moved and positioned relative to a station.",
          x: 33,
          y: 90,
        },
      ],
    },
    {
      figureNumber: "Fig. 13",
      title: "Program controller and station coupling",
      caption:
        "Drawing sheet 5 shows the program controller 47, the Mx/My/Mz control paths, and contacts 86 and 87 joining a carrier to machine MT.",
      svgType: "lemelson-automatic-production",
      callouts: [
        {
          id: "controller-47",
          figureRef: "Fig. 13",
          label: "Program controller",
          element: "47",
          description:
            "Carrier-borne sequence controller represented at the left side of the schematic.",
          x: 10,
          y: 56,
        },
        {
          id: "carrier-drive-mx",
          figureRef: "Fig. 13",
          label: "Carrier drive",
          element: "Mx",
          description: "Control path for horizontal carrier travel.",
          x: 46,
          y: 57,
        },
        {
          id: "contacts-86-87",
          figureRef: "Fig. 13",
          label: "Coupling contacts",
          element: "86, 87",
          description: "The carrier-to-machine electrical interface in the source control diagram.",
          x: 65,
          y: 36,
        },
        {
          id: "machine-mt",
          figureRef: "Fig. 13",
          label: "Machine tool",
          element: "MT",
          description:
            "Selected station machine whose controls receive the coupled programme output.",
          x: 82,
          y: 51,
        },
      ],
    },
    {
      figureNumber: "Fig. 14",
      title: "Flight-conveyor work carrier",
      caption:
        "Drawing sheet 6 shows carrier 100, photoelectric housing 68, marker 70, actuator 103, coupling 84/87, and the branch conveyor leading to MT.",
      svgType: "lemelson-automatic-production",
      callouts: [
        {
          id: "carrier-100",
          figureRef: "Fig. 14",
          label: "Work carrier",
          element: "100",
          description:
            "Carrier that holds the work and the described control, clamp, and coupling components.",
          x: 45,
          y: 28,
        },
        {
          id: "scanner-68",
          figureRef: "Fig. 14",
          label: "Photoelectric scanner",
          element: "68",
          description: "Scanner that reads the marker associated with a selected path or station.",
          x: 21,
          y: 47,
        },
        {
          id: "marker-70",
          figureRef: "Fig. 14",
          label: "Reflective marker",
          element: "70",
          description: "Track-side marker sensed by the photoelectric arrangement.",
          x: 7,
          y: 66,
        },
        {
          id: "station-mt",
          figureRef: "Fig. 14",
          label: "Machine station",
          element: "MT",
          description: "Fixed tool station reached by the carrier and branch conveyor.",
          x: 90,
          y: 78,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The grant identifies a production-line problem that was costly in a machine-tool world: continuous conveyors and fixed transfer machinery repeated one machining set-up. Changing product shape, hole pattern, finish, inspection, or assembly could leave the line idle for reconfiguration. Lemelson's claimed answer was a carrier that brought its own program record to a selected, sensed, and mechanically coupled station.",
    priorArtLimitations: [
      "US 2,139,403, cited in the specification, used helical screw drives to transfer work-holding fixtures between machine tools; Lemelson described such systems as relatively inflexible for changed operations.",
      "Continuous flight and belt conveyors moved assemblies between machines but did not by themselves supply the carrier-level record, station selection, securing, and coupling chain recited in the claims.",
      "A fixed single-operation transfer line could require a changed tool setup or rebuilding when a product revision altered operations, making downtime a stated economic constraint in the specification.",
    ],
    breakthroughInsight:
      "The inventive combination is not an unspecified automated factory. It is a distributed production-line interface: a guided carrier holds work and a record, sensing identifies a station, securing and prepositioning establish geometry, contacts or an optical link couple the record to a machine, and the same controller releases the carrier for the next operation.",
    patentWars: [],
    aftermath:
      "The grant expired after its statutory term. The museum record does not assert a patent war, a licensing result, or a measured industrial deployment because this primary source alone does not establish those claims.",
    sideNotes: [
      "The grant expressly reaches both an overhead monorail carrier and later flight-conveyor variants, showing that Lemelson treated the control and station-coupling relationship as more fundamental than one rail geometry.",
      "Fig. 13 labels a tape or card reader as possible controller hardware, while Claims 8 and 9 describe optical and electrical-contact coupling alternatives.",
    ],
    civilizationalImpact:
      "The document is useful historically because it makes flexible production concrete: position a particular part, authorize a particular station, provide that station's command sequence, then unlock and route onward. Its modern relevance is architectural rather than a claim of direct lineage or universal priority: it makes the mechanical interface between part routing and programmable machine control visible.",
  },
  tags: [
    "Jerome Lemelson",
    "industrial automation",
    "material handling",
    "machine tools",
    "programmable control",
    "production lines",
  ],
  stats: { totalClaims: 21, independentClaims: 13 },
};
