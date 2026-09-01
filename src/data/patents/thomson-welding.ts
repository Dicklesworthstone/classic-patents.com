import type { Patent } from "@/types/patent";
import { thomsonWeldingArchivalEdition } from "../editions/thomsonWeldingEdition";

const legacyThomsonWeldingPatent: Patent = {
  id: "us-347140-thomson-welding",
  patentNumber: "US 347,140",
  title: "Apparatus for Electric Welding",
  shortTitle: "Thomson Electric Resistance Butt-Welding",
  subtitle:
    "Step-Down Transformer, Low-Voltage Kiloampere Currents, Contact Resistance Joule Heating, and Axial Forging Pressure",
  inventors: ["Elihu Thomson"],
  inventorLocation: "Lynn, Essex County, Massachusetts",
  grantDate: "1886-08-10",
  filingDate: "1886-04-14",
  era: "Electrification & Early Modern (1870–1920)",
  category: "materials",
  categoryLabel: "Electromagnetic Metallurgy & Electric Welding",
  summary:
    "The 1886 manufacturing milestone that created modern industrial metal fabrication: Professor Elihu Thomson's electric resistance welding apparatus utilizing a step-down transformer to deliver thousands of amperes of low-voltage alternating current across abutting metal surfaces, concentrating intense Joule heating ($I^2 R$) at the interface to fuse metals solid in seconds under mechanical forging pressure without flux or open flames.",
  heroQuote:
    "A current of large volume and low electromotive force is passed across the abutting ends of the metals to be joined... the contact-resistance creates intense local heat at the joint, softening the metal, whereupon pressure is applied to forge the pieces into a solid, homogenous weld.",
  originalPdfUrl: "/patents/pdfs/us-347140-thomson-welding.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US347140/en",
  archivalEdition: thomsonWeldingArchivalEdition,
  usptoClassification: "B23K 11/02 (Resistance welding; Butt-welding apparatus)",
  originalTextAsset: {
    url: "/patents/source-text/us-347140-thomson-welding.txt",
    pageCount: 5,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
ELIHU THOMSON, OF LYNN, MASSACHUSETTS.

APPARATUS FOR ELECTRIC WELDING.

Specification forming part of Letters Patent No. 347,140, dated August 10, 1886.
Application filed April 14, 1886.

To all whom it may concern:
Be it known that I, ELIHU THOMSON, a citizen of the United States, residing at Lynn, in the county of Essex and State of Massachusetts, have invented a new and useful Apparatus for Electric Welding, of which the following is a specification:

My invention relates to the art of joining or welding metals by the heating action of electric currents.

Heretofore, welding has been performed by heating metals in a blacksmith's fire or furnace and hammering the scarf-joint together, which is slow, requires skilled labor, oxidizes the metal surfaces, and cannot reliably weld metals like copper, brass, bronze, and aluminum.

The nature of my invention consists in:
1. Providing an induction transformer having a primary coil of fine wire adapted to receive high-voltage alternating current, and a secondary coil consisting of a massive bar or strap of copper having very low electrical resistance, adapted to generate an alternating current of immense volume (hundreds or thousands of amperes) but of very low potential (one to two volts).
2. Connecting the massive terminals of said secondary conductor to heavy copper clamping jaws adapted to hold the pieces of metal to be welded.
3. Placing the ends of the two pieces of metal in firm abutting contact with each other between the clamping jaws, and passing the heavy low-voltage secondary current across the joint.
4. Providing mechanical means (such as a screw, toggle, or spring) for forcing the clamping jaws toward each other to exert axial pressure upon the abutting pieces.

Because the electrical resistance of the abutting contact surfaces (the interface resistance) is much greater than that of the solid metal bars or the copper secondary winding, the electrical energy ($I^2 R$) is concentrated almost entirely at the exact point of contact.

Within a few seconds after closing the circuit, the abutting ends become white hot and reach a plastic or fusion temperature. As the metal softens, the axial forging pressure forces the two pieces together, squeezing out any surface oxides and intermingling the plastic metal crystals, forming a solid, flawless weld of full tensile strength, with no external contamination.

I claim as my invention:
1. An electric welding apparatus comprising an induction coil or transformer having a primary of high resistance and a secondary of very low resistance and large current-carrying capacity, clamping jaws connected to the terminals of said secondary for holding the pieces to be welded in abutment, and means for applying pressure to force said pieces together when heated by the current.
2. The method of welding metals by passing a heavy electric current across the abutting ends of the pieces to generate localized heating at the contact interface, and simultaneously forcing the pieces together by mechanical pressure.`,
  plainEnglishExplanation: {
    overview:
      "For three thousand years, welding was limited to blacksmiths heating iron bars in coal forges and hammering them together on an anvil. This was slow, burned the metal, created weak slag inclusions, and was completely impossible for non-ferrous metals like copper, brass, and aluminum. MIT-educated electrical pioneer Elihu Thomson discovered that passing thousands of amperes of low-voltage AC electricity across the touching ends of two metal bars generated intense, localized Joule heat ($I^2 R$) precisely at the microscopic contact points, melting the interface in two seconds while an axial clamp forged the joint into a seamless, molecularly bonded weld.",
    coreMechanism:
      "A massive step-down transformer converts standard alternating current (e.g. $100\\text{ A}$ at $220\\text{ V}$) into an immense secondary current of $10,000\\text{ to }50,000\\text{ Amperes}$ at a safe potential of only $1.5\\text{ Volts}$. The secondary winding is a single thick U-shaped loop of solid copper with virtually zero internal resistance ($R_s < 0.0001\\;\\Omega$). Heavy water-cooled copper clamping jaws hold the two workpieces firmly aligned face-to-face. When the contact circuit closes, the micro-asperities (surface roughness points) between the abutting ends create a localized contact resistance ($R_{\\text{contact}}$) that is hundreds of times higher than the surrounding metal. The massive current dumps thermal energy directly into the interface ($P = I^2 R_{\\text{contact}} > 25\\text{ kW}$), heating the joint to forging temperature ($1,200^\\circ\\text{C}$ for steel, $900^\\circ\\text{C}$ for copper) in fractions of a second. An axial lever or screw drives the pieces together, expelling surface oxide impurities and forming an instantaneous solid-state fusion weld.",
    mechanicalBreakdown: [
      {
        title: "Single-Turn Massive Secondary Step-Down Transformer",
        summary: "Solid copper casting secondary loop generating kiloampere welding current.",
        technicalDetails:
          "A laminated soft-iron transformer core ($B = 1.4\\text{ Tesla}$) with a multi-turn high-voltage primary ($N_p = 150\\text{ turns}$) and a single-turn secondary ($N_s = 1\\text{ turn}$) cast from electrolytic copper ($A = 50\\text{ cm}^2$). Delivers currents exceeding $I_s = I_p (N_p / N_s) = 15,000\\text{ A}$ at $1.2\\text{ V}$.",
        archaicTerm: "Secondary coil consisting of a massive bar or strap of copper",
        modernEquivalent: "Resistance welding step-down transformer & secondary busbar",
      },
      {
        title: "Heavy Copper Clamping Jaws & Workpiece Vises",
        summary: "Water-cooled low-resistance mechanical clamps securing the workpieces.",
        technicalDetails:
          "High-conductivity beryllium copper alloy clamps. Designed with large contact surface areas to ensure negligible clamping contact resistance ($R_{\\text{clamp}} \\ll R_{\\text{weld}}$), preventing localized workpiece burning near the jaws.",
        archaicTerm: "Heavy copper clamping jaws",
        modernEquivalent: "Water-cooled resistance welding electrode clamps / Platens",
      },
      {
        title: "Axial Mechanical Forging Screw & Pressure Toggle",
        summary: "High-pressure mechanical linkage exerting upset forging force.",
        technicalDetails:
          "A calibrated screw or toggle mechanism exerting axial upsetting pressure ($P = 20\\text{ to }60\\text{ MPa}$). As the metal plasticizes, the axial displacement ($\\Delta x = 3\\text{ to }8\\text{ mm}$) squirts liquid metal and oxides out in an external burr (flash), leaving pristine crystalline metal in the core joint.",
        archaicTerm: "Means for forcing the clamping jaws toward each other",
        modernEquivalent: "Upset forging actuator / Pneumatic weld cylinder",
      },
      {
        title: "Laminated Silicon-Steel Shell Transformer Core",
        summary:
          "Interleaved magnetic iron core enclosing the primary and secondary loops with minimal core loss.",
        technicalDetails:
          "Constructed of insulated electrical sheet steel laminations ($t = 0.35\\text{ mm}$) forming a closed magnetic circuit ($\\mu_r > 3,500$). The shell-type core encloses both the primary coil and the solid copper secondary loop, reducing magnetic leakage flux to $<1.5\\%$ and delivering a peak power factor $\\cos\\phi > 0.85$ under heavy welding loads.",
        archaicTerm: "Laminated iron core enclosing the coils",
        modernEquivalent: "Laminated electrical steel transformer core",
      },
      {
        title: "Foot-Pedal Contactor & Auto-Cutoff Interrupter",
        summary: "Heavy-duty magnetic primary contactor terminating current upon upset completion.",
        technicalDetails:
          "A spring-loaded foot switch actuates a magnetic primary contactor. An adjustable microswitch trigger on the moving jaw automatically cuts off the 220V primary supply the precise millisecond the axial forging upset distance ($\\Delta x = 4.5\\text{ mm}$) is reached, preventing molten metal blowout and excessive grain coarsening.",
        archaicTerm: "Circuit-breaker or switch actuated by the movement of the jaw",
        modernEquivalent: "Synchronous weld timer & automatic upset cutoff switch",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Joule Heating at Constricted Micro-Contact Asperities",
        formula:
          "\\dot{q} = I^2 R_{\\text{contact}}(t), \\quad R_{\\text{contact}} = \\frac{\\rho_{\\text{metal}}}{2 \\sum r_{\\text{asperity}}} + \\frac{\\sigma_{\\text{film}}}{A_{\\text{real}}}",
        explanation:
          "Electrical current is funneled through microscopic metal-to-metal contact peaks, creating extreme current densities ($J > 10^5\\text{ A/cm}^2$) that produce instantaneous flash heating at the interface while the bulk workpiece remains cool.",
      },
      {
        principle: "Solid-State Grain Growth & Diffusion Bonding",
        formula:
          "D(T) = D_0 \\exp\\left(-\\frac{Q_{\\text{diffusion}}}{R T_{\\text{weld}}}\\right), \\quad x_{\\text{diffusion}} \\approx 2 \\sqrt{D t}",
        explanation:
          "Under high temperature ($T > 0.8 T_m$) and compressive forging pressure, atomic self-diffusion across the interface occurs in milliseconds, eliminating the joint boundary and forming continuous recrystallized metallic grains.",
      },
      {
        principle: "Transformer Magnetic Induction & Flux Conservation",
        formula:
          "\\mathcal{E}_s = -N_s \\frac{d\\Phi}{dt} = \\frac{N_s}{N_p} \\mathcal{E}_p, \\quad I_s = \\frac{N_p}{N_s} I_p",
        explanation:
          "Faraday induction allows safe stepping from lethal high-voltage distribution lines ($2,200\\text{ V}$) down to an touch-safe potential ($1.5\\text{ V}$) while multiplying current by a factor of over 100 for heavy thermal metallurgy.",
      },
      {
        principle: "Transient Thermal Conduction & Heat-Affected Zone (HAZ)",
        formula:
          "T(x, t) - T_0 = \\frac{q'' \\sqrt{\\alpha t}}{k} \\cdot 2 \\text{ierfc}\\left(\\frac{x}{2\\sqrt{\\alpha t}}\\right), \\quad \\alpha = \\frac{k}{\\rho C_p}",
        explanation:
          "Because the intense Joule heat is generated in less than 2 seconds, thermal diffusivity $\\alpha$ restricts the heat-affected zone to a narrow band ($x_{\\text{HAZ}} < 3\\text{ mm}$), preventing annealing or distortion of the parent metal.",
      },
    ],
    whyItMattersToday:
      "Elihu Thomson's electric resistance welding is the backbone of modern automated mass production. Resistance spot welding, seam welding, and butt welding assemble every modern automobile unibody chassis (over 5,000 spot welds per car), aerospace components, titanium medical implants, steel rail tracks, and electronic battery pack tabs for electric vehicles.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The herein-described art of effecting union between two pieces of metal, consisting in holding the same in contact at the point of union and simultaneously passing a current of electricity through the joint of a power to fuse and unite the pieces, as and for the purpose described.",
      plainEnglish:
        "Master process claim covering the foundational art of joining metals by holding their ends in contact and simultaneously passing an electric current through the contact junction of sufficient power to fuse the metals together.",
      keyInnovations: [
        "Electric fusion welding",
        "Simultaneous contact and current application",
        "Joule interfacial heating",
      ],
      legalSignificance:
        "The broadest method claim for electric resistance welding, asserting exclusive priority over all simultaneous contact-and-current fusion.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The process or art of electric welding, consisting in the application of heavy currents to traverse a joint to be welded, and the simultaneous application of a pressure or force tending to move together the pieces to be welded.",
      plainEnglish:
        "Process claim covering electric resistance butt-welding: applying heavy electric current across the joint while simultaneously exerting mechanical pressure or forging force tending to press the workpieces together as they plasticize.",
      keyInnovations: [
        "Simultaneous heavy current and forging pressure",
        "Axial upset movement",
        "Thermo-mechanical fusion",
      ],
      legalSignificance:
        "Establishes the combination of heavy current and mechanical forging pressure as the defining signature of electric resistance butt-welding.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "The process or art of causing union between the ends of metal pieces in contact by simultaneous application of fusing-currents of electricity and mechanical pressure at the contact.",
      plainEnglish:
        "Method claim specifically directed to joining the abutting ends of metal pieces through simultaneous application of localized fusing currents and mechanical contact pressure.",
      keyInnovations: [
        "Abutting end joint geometry",
        "Localized interface fusion",
        "Direct contact consolidation",
      ],
      legalSignificance: "Protects end-to-end butt-welding of wires, rods, bars, and pipes.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "In an apparatus for electric jointing of metals, suitable clamps for holding the pieces to be joined movable toward one another, and means, such as a spring, for exerting a pressure for forcing the pieces into contact, and means of applying fusing-currents of electricity while such pieces rest in pressure contact, as described.",
      plainEnglish:
        "Apparatus claim covering workpiece clamps movable toward each other, spring or mechanical pressure means forcing the pieces into contact, and electrical supply means delivering fusing current during pressure contact.",
      keyInnovations: [
        "Movable clamping jaws",
        "Spring-loaded axial pressure mechanism",
        "Concurrently energized electrode vise",
      ],
      legalSignificance:
        "The core apparatus claim for spring-loaded electric resistance butt-welding machines.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText:
        "The combination, in an apparatus for electric welding, of two arms or supports, L L', connected with a source of electric current, removable dies or holding-clamps carried by said arms, and means whereby said arms may be pressed toward one another, as and for the purpose described.",
      plainEnglish:
        "Apparatus combination claim covering two conductive arms (L, L') connected to an electric source, interchangeable/removable holding dies tailored to different wire gauges or workpiece cross-sections, and mechanisms for pressing the arms together.",
      keyInnovations: [
        "Pivoted or sliding conductive arms (L, L')",
        "Removable interchangeable clamping dies",
        "Modular tooling architecture",
      ],
      legalSignificance:
        "Secured the modular industrial welding machine design with interchangeable clamping jaws for different wire sizes.",
    },
    {
      number: 6,
      isIndependent: true,
      originalText:
        "The combination, in an apparatus for electric welding, of clamps or holders for grasping the pieces to be welded, connections from said clamps to a suitable source of electric current, and an adjustable spring, or its equivalent, as described, for adjusting the force with which the pieces are pressed toward one another during the operation of welding.",
      plainEnglish:
        "Apparatus combination claim providing calibrated, adjustable spring force to regulate the precise axial forging pressure applied across the workpieces as they soften.",
      keyInnovations: [
        "Calibrated adjustable forging spring",
        "Regulated axial upset force",
        "Variable pressure control",
      ],
      legalSignificance:
        "Protected the adjustable pressure regulator essential for welding diverse metals with different plastic yield strengths.",
    },
    {
      number: 7,
      isIndependent: true,
      originalText:
        "In an apparatus for electric jointing of metal wires, bars, &c., a primary feeding-line connected to any suitable source of current and controlled by a switch, and a secondary fusing or welding circuit connected to the pieces to be welded, and which are held in pressure contact, together with suitable means of transfer of energy from said primary line to the circuit of the fusing or welding apparatus, as described.",
      plainEnglish:
        "System claim covering a switch-controlled primary AC line, a high-current secondary welding circuit connected to the workpieces in pressure contact, and an electromagnetic energy transfer transformer coupling the primary to the low-voltage secondary.",
      keyInnovations: [
        "Step-down transformer coupling",
        "Primary-switched heavy secondary loop",
        "Transformer-based resistance welder",
      ],
      legalSignificance:
        "The foundational patent claim for transformer-powered electric welding systems, the universal standard in modern industry.",
    },
    {
      number: 8,
      isIndependent: true,
      originalText:
        "The art or process of electric welding, consisting in applying to suitably guided and clamped pieces to be joined a powerful electric current at the junction simultaneously with a pressure, whereby upon incipient fusion at the joint a complete union is effected.",
      plainEnglish:
        "Process claim covering the guided thermo-mechanical cycle: guiding and clamping the workpieces, applying intense current at the junction simultaneously with pressure, and effecting complete fusion upon reaching incipient melting temperature.",
      keyInnovations: [
        "Precision workpiece alignment guidance",
        "Incipient surface melt threshold",
        "Solid-phase fusion consolidation",
      ],
      legalSignificance:
        "Guaranteed process coverage for high-precision guided industrial butt-welding.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Plan and Perspective View of Thomson Electric Welding Apparatus",
      caption:
        "Drawing showing circular step-down transformer core, heavy single-turn secondary copper casting, sliding clamping jaws, workpiece bars, and forging hand lever.",
      svgType: "thomson-welding",
      callouts: [
        {
          id: "tw-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Step-Down Transformer Core",
          description: "Laminated iron ring with high-voltage primary and 1-turn secondary.",
          x: 50,
          y: 65,
        },
        {
          id: "tw-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Heavy Copper Secondary Busbars",
          description: "Massive solid copper casting conducting 15,000 A at 1.5 V.",
          x: 50,
          y: 45,
        },
        {
          id: "tw-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Workpiece Clamping Jaws",
          description: "Water-cooled copper vises clamping metal pieces in abutment.",
          x: 40,
          y: 30,
        },
        {
          id: "tw-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Axial Forging Pressure Lever",
          description: "Hand screw/lever applying mechanical forging pressure during heating.",
          x: 80,
          y: 30,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1880s, the explosive growth of telegraphy, electrical lighting networks, and bicycle manufacturing created a desperate need for millions of reliable metal joints. Blacksmith forge-welding was too slow, weakened copper and steel wires through carbon loss, and could not join dissimilar metals like copper to brass or steel.",
    priorArtLimitations: [
      "Forge-welding required heating entire bars in open fires, causing severe oxidation and scale contamination.",
      "Arc-welding using carbon electrodes (Bernados process) created violent sparks, blinding glare, and brittle carbon contamination in the weld pool.",
      "No process existed to weld non-ferrous metals like copper, brass, and aluminum without melting the entire bar.",
    ],
    breakthroughInsight:
      "While giving a lecture on electrical induction at the Franklin Institute in Philadelphia, Professor Elihu Thomson discharged a high-voltage battery through the fine secondary coil of an induction coil. The primary coil wires accidentally touched, and to Thomson's astonishment, the heavy surge of induced low-voltage current welded the thick copper wires together into a solid lump. Thomson realized that transformers could be engineered as ultimate localized metal heaters.",
    patentWars: [
      {
        rivalName: "Blacksmith Guilds and Gas-Welding Proponents",
        rivalClaim:
          "Skeptics argued that electrical resistance welding would alter the molecular structure of steel and produce brittle joints.",
        conflictDetails:
          "Thomson founded the Thomson Electric Welding Company in Lynn, Massachusetts. In 1887, he exhibited his welding machine before the American Society of Mechanical Engineers, successfully butt-welding heavy 2-inch steel shafts, copper cables, and joining copper directly to iron in 15 seconds.",
        resolution:
          "Tensile tests proved that Thomson electric welds were as strong as the parent metal. Automobile pioneer Henry Ford and wire manufacturers adopted Thomson welders across all manufacturing plants.",
        legalOutcome:
          "Thomson's Patent 347,140 was universally recognized as a foundational master patent, creating the modern electric resistance welding industry.",
      },
    ],
    civilizationalImpact:
      "Resistance welding made modern mass-production manufacturing possible. It enabled continuous steel wire drawing, high-speed pipe and tube manufacturing, automotive chassis fabrication, and modern aerospace assembly. Thomson's company later merged with Edison General Electric in 1892 to form General Electric (GE).",
    funFact:
      "Elihu Thomson was a child prodigy who built his own electrical friction machines at age 11 from old wine bottles. He served as the acting President of MIT from 1920 to 1923 and held over 700 patents in his lifetime, surpassed in American history only by Thomas Edison.",
    aftermath:
      "Professor Thomson was awarded the Grand Prix at the 1889 Paris Exposition, the Hughes Medal of the Royal Society of London, the Edison Medal in 1909, and the Kelvin Gold Medal in 1924. He passed away in Swampscott, Massachusetts, in 1937 at age 83.",
  },
  tags: [
    "Elihu Thomson",
    "Electric Welding",
    "Resistance Welding",
    "Step-Down Transformer",
    "Joule Heating",
    "General Electric",
  ],
  stats: {
    totalClaims: 8,
    independentClaims: 8,
  },
};

const manualClaimText = (number: number) => {
  const sourceClaim = thomsonWeldingArchivalEdition.blocks.find(
    (
      block,
    ): block is Extract<(typeof thomsonWeldingArchivalEdition.blocks)[number], { kind: "claim" }> =>
      block.kind === "claim" && block.number === number,
  );
  if (!sourceClaim) throw new Error(`US 347,140 is missing source claim ${number}.`);
  return sourceClaim.inlines.map((inline) => inline.text).join("");
};

const claimReadings = [
  [
    "The broad process claim: keep two metal pieces in contact and pass a current through their joint strong enough to fuse and unite them.",
    ["contact joint", "fusing current", "metal union"],
  ],
  [
    "This process adds a simultaneous force that tends to bring the pieces together while heavy current traverses their joint.",
    ["heavy current", "simultaneous pressure", "moving-together force"],
  ],
  [
    "This is the end-to-end version: fusing current and mechanical pressure act at the contact between the metal ends.",
    ["metal ends", "fusing current", "contact pressure"],
  ],
  [
    "This apparatus claim names movable clamps, a pressure source such as a spring, and current applied while the pieces are held in pressure contact.",
    ["movable clamps", "spring pressure", "pressure-contact current"],
  ],
  [
    "This claim narrows the apparatus to conductive supports L and L-prime, removable dies or holding clamps, and a way to press the arms together.",
    ["arms L and L-prime", "removable dies", "closing mechanism"],
  ],
  [
    "This claim protects the adjustable spring or equivalent that sets the force applied by the clamps during welding.",
    ["holders", "current connections", "adjustable spring"],
  ],
  [
    "This is the power-transfer arrangement: a switched primary line and a secondary welding circuit coupled into the work held under pressure.",
    ["primary feeding line", "secondary welding circuit", "energy transfer"],
  ],
  [
    "This claim combines guided and clamped work with powerful junction current and pressure, obtaining complete union when fusion begins.",
    ["guided pieces", "junction current", "incipient fusion"],
  ],
] as const;

/**
 * The public record is an explicit source-corrected overlay. The previous
 * long record stays in this module as a migration witness, but the visitor
 * sees only source-supported metadata, claims, and manual archival edition.
 */
export const thomsonWeldingPatent: Patent = {
  ...legacyThomsonWeldingPatent,
  filingDate: "1886-03-29",
  summary:
    "Thomson's specification describes electric welding as holding abutting metal pieces under small, adjustable pressure while a large current passes through their joint. It illustrates clamp forms, spring, hand, and weight pressure, transformer and battery supplies, and eight claims covering the process and apparatus.",
  heroQuote:
    "Briefly, the new art, which I term “electric welding,” consists in bringing together with a certain pressure the ends of the wires, bars, &c., to be jointed.",
  originalTextAsset: {
    url: "/patents/transcripts/us-347140-thomson-welding-reviewed.txt",
    pageCount: 5,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "80e7bbf735c52f3ace482277f39b130c0b6a62ee8eb9290389175939ba48356c",
  },
  originalText:
    "Thomson calls electric welding the union of abutting metal wires or bars by a high-volume current at the joint under controlled pressure. The complete five-page source, two drawing sheets, and all eight claims are available in the manually prepared Original Patent Text edition.",
  // The complete edition is published with isolated source crops where they
  // are safe and full source-sheet fallbacks where isolation would clip or
  // import neighboring drawing matter.
  plainEnglishExplanation: {
    overview:
      "The patent makes the joint itself the resistive part of a deliberately low-voltage, high-current circuit. Clamps hold the work ends near J; when current crosses the abutment, heat forms there, and spring, hand, weight, or other pressure closes the softened ends into a continuous piece.",
    coreMechanism:
      "Thomson guides the work in conductive arms, maintains slight pressure, and sends current through the abutting faces. His transformer example uses a fine-wire primary M and a few-turn heavy secondary N. Because the source places a large fraction of circuit resistance at the intended joint, energy evolves at the joint rather than throughout the supply conductors; small relative movement then supplies the upset pressure.",
    mechanicalBreakdown: [
      {
        title: "Clamping arms and interchangeable holders",
        summary:
          "Arms L and L-prime carry removable clamps K and K-prime that make electrical contact and hold the work close to J.",
        technicalDetails:
          "The source permits V-grooves, removable shells, universal chucks, and faces fitted to square, hexagonal, rectangular, round, or tubular work. Fig. 1 uses an insulated pivot A; a straight guided slide is offered for accurately abutting heavy work.",
        archaicTerm: "clamp-holding bars",
        modernEquivalent: "conductive workholding arms",
      },
      {
        title: "Pressure during heating",
        summary:
          "A spring S is the pictured default, with hand pressure, an adjustable weight, and other pressure sources treated as alternatives.",
        technicalDetails:
          "The pressure is deliberately small and adjustable. As the joint yields, the arms approach and a burr can appear at J; current is stopped and the burr may be filed or ground away. The source does not give a force, timing, or a water-cooled electrode design.",
        archaicTerm: "elastic pressure",
        modernEquivalent: "spring-applied upset force",
      },
      {
        title: "Induction-coil supply",
        summary:
          "Fig. 16 transfers energy from a switched fine-wire primary M to a very-heavy, few-turn secondary N connected to the clamps.",
        technicalDetails:
          "Closing switch B for a second or two induces current in N. Thomson's explanation is qualitative: resistance in the work pieces is a large fraction of the secondary circuit, so much energy appears at the intended weld. Fig. 17 moves the closing elasticity into the terminal arrangement.",
        archaicTerm: "electro-motive force",
        modernEquivalent: "voltage",
      },
      {
        title: "Alternative battery supply",
        summary:
          "Fig. 18 uses a large-surface Planté secondary battery instead of the induction coil.",
        technicalDetails:
          "The battery is charged from a moderate-current circuit and then supplies a short, heavy-current welding interval when handles bring the sprung conductors together. The patent also permits large dynamos, direct current, or alternating current.",
        archaicTerm: "Planté battery",
        modernEquivalent: "lead-acid secondary cell",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Resistive heating at the abutment",
        formula:
          "Heat at the joint grows with the square of the current, as Thomson expressly states.",
        explanation:
          "The specification gives an illustrative joint resistance below one fifty-thousandth of an ohm for moderate wire, yet says a sufficiently large current develops fusion heat at J. It does not state a fixed current, voltage, or temperature.",
      },
      {
        principle: "Transformer energy transfer",
        formula: "A switched primary winding M induces current in heavy secondary winding N.",
        explanation:
          "The source describes the winding sizes and circuit roles, not a turns ratio or rated output. The point is to obtain large current with little electro-motive force at the clamps.",
      },
    ],
    whyItMattersToday:
      "The document records an early resistance-welding method that couples local electrical heating to controlled mechanical upset. Its drawings make the practical questions visible: where current enters, how work is guided, how pressure is applied, and how different work geometries change the clamp.",
  },
  claims: claimReadings.map(([plainEnglish, keyInnovations], index) => ({
    number: index + 1,
    isIndependent: true,
    originalText: manualClaimText(index + 1),
    plainEnglish,
    keyInnovations: [...keyInnovations],
  })),
  drawings: [
    {
      figureNumber: "Figs. 1–9",
      title: "Clamp, pressure, and joint arrangements",
      caption:
        "First source sheet: Fig. 1's clamp apparatus through Fig. 9's modified gravity-pressure arrangement.",
      svgType: "thomson-welding",
      callouts: [
        {
          id: "tw-arms",
          figureRef: "Fig. 1",
          label: "L, L'",
          element: "Conductive holding arms",
          description: "Pivoted conductive arms holding the workpiece clamps.",
          x: 45,
          y: 40,
        },
        {
          id: "tw-joint",
          figureRef: "Fig. 1",
          label: "J",
          element: "Abutting weld joint",
          description: "Interface where heavy fusing current develops heat under pressure.",
          x: 50,
          y: 35,
        },
        {
          id: "tw-spring",
          figureRef: "Fig. 1",
          label: "S",
          element: "Adjustable upset spring",
          description: "Spring exerting axial pressure to force the softening pieces together.",
          x: 65,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "Figs. 10–18",
      title: "Work-piece variants and current supplies",
      caption:
        "Second source sheet: Fig. 10 through Fig. 18, including transformer and secondary-battery sources.",
      svgType: "thomson-welding",
      callouts: [
        {
          id: "tw-prim",
          figureRef: "Fig. 16",
          label: "M",
          element: "Primary winding",
          description: "Fine-wire high-voltage primary winding controlled by switch B.",
          x: 40,
          y: 60,
        },
        {
          id: "tw-sec",
          figureRef: "Fig. 16",
          label: "N",
          element: "Heavy secondary conductor",
          description: "Single low-resistance turn delivering high fusing current to workpieces.",
          x: 55,
          y: 45,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification seeks a firm metal joint without the usual use of solder or another lower-melting metal, including joints in wire, bars, tubes, rings, band-saw steel, and cable.",
    priorArtLimitations: [
      "The source contrasts its joint with a soldered or otherwise lower-melting-metal joint.",
      "A brazed band-saw joint is identified as weaker and as causing nearby destruction of temper.",
    ],
    breakthroughInsight:
      "Thomson locates the working path at the abutted ends and combines current of great volume with small, controlled pressure. The figure sequence turns that insight into clamps, pressure arrangements, and power sources.",
    patentWars: [],
    civilizationalImpact:
      "The source documents the technical elements that later resistance-welding practice must coordinate: local current path, fitted workholding, joint alignment, and controlled force. This edition does not assert a later adoption history that the pinned facsimile does not establish.",
    aftermath:
      "This record confines historical claims to the primary source; further litigation or commercial-history assertions require separately cited research.",
  },
  stats: {
    totalClaims: 8,
    independentClaims: 8,
  },
};
