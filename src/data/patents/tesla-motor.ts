import { teslaMotorArchivalEdition } from "@/data/editions/teslaMotorEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = teslaMotorArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Tesla manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const teslaMotorPatent: Patent = {
  id: "us-381968-tesla-motor",
  patentNumber: "US 381,968",
  title: "Electro-Magnetic Motor",
  shortTitle: "Tesla Progressive Alternating-Current Motor",
  subtitle: "Progressive magnetic fields from independently timed alternating currents",
  inventors: ["Nikola Tesla"],
  inventorLocation: "New York, New York",
  grantDate: "1888-05-01",
  filingDate: "1887-10-12",
  era: "Electrification & Early Modern (1870–1920)",
  category: "electricity",
  categoryLabel: "Electromagnetism & Power Generation",
  summary:
    "Granted on May 1, 1888, this specification describes motors with two or more independently connected circuits fed by a suitable alternating-current generator. Tesla uses the changing strengths and directions of those currents to shift the motor's magnetic poles progressively around a ring, then gives several motor-generator arrangements that turn a disk or armature without a motor commutator.",
  heroQuote:
    "A motor is employed in which there are two or more independent circuits through which alternate currents are passed at proper intervals, in the manner hereinafter described, for the purpose of effecting a progressive shifting of the magnetism or of the “lines of force” in accordance with the well-known theory, and a consequent action of the motor.",
  originalPdfUrl: "/patents/pdfs/us-381968-tesla-motor.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US381968A/en",
  usptoClassification: "Electro-Magnetic Motor (title printed on the grant)",
  archivalEdition: teslaMotorArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-381968-tesla-motor-reviewed.txt",
    pageCount: 9,
    kind: "reviewed-transcription",
    sourcePdfSha256: "cffd7ff061b05feef92c2d6ef4d767c7b7e8c6b4e0d10cc9be3fbd51841dce12",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
  },
  originalText: `To all whom it may concern:

Be it known that I, NIKOLA TESLA, from Smiljan Lika, border country of Austria-Hungary, residing at New York, N. Y., have invented certain new and useful Improvements in Electro-Magnetic Motors, of which the following is a specification, reference being had to the drawings accompanying and forming a part of the same.

The practical solution of the problem of the electrical conversion and transmission of mechanical energy involves certain requirements which the apparatus and systems heretofore employed have not been capable of fulfilling. Such a solution, primarily, demands a uniformity of speed in the motor irrespective of its load within its normal working limits. On the other hand, it is necessary, to attain a greater economy of conversion than has heretofore existed, to construct cheaper and more reliable and simple apparatus, and, lastly, the apparatus must be capable of easy management, and such that all danger from the use of currents of high tension, which are necessary to an economical transmission, may be avoided.

My present invention is directed to the production and improvement of apparatus capable of more nearly meeting these requirements than those heretofore available, and though I have described various means for the purpose, they involve the same main principles of construction and mode of operation, which may be described as follows: A motor is employed in which there are two or more independent circuits through which alternate currents are passed at proper intervals, in the manner hereinafter described, for the purpose of effecting a progressive shifting of the magnetism or of the “lines of force” in accordance with the well-known theory, and a consequent action of the motor.`,
  plainEnglishExplanation: {
    overview:
      "Tesla's stated problem is a practical transmission-and-conversion system: a motor should hold a substantially uniform speed through normal loads, use simpler and more reliable apparatus, and reduce the danger associated with high-tension transmission. This grant answers with two or more motor circuits that receive alternating currents at proper intervals. Their changing magnetic effects shift the places of greatest attraction around the motor, and a disk or armature follows that shift. The document gives several arrangements, including directly connected motor and generator circuits; it does not specify every later alternating-current motor construction.",
    coreMechanism:
      "For the two-circuit arrangement, one generator coil can be near zero while the other is at a maximum; an eighth turn later both contribute, and the resultant motor-pole direction lies between the two coil axes. In modern vector notation, the teaching shorthand is B_net = B_B + B_B′. Tesla traces that resultant through eight generator positions and says that one generator revolution shifts the motor's poles around the ring once. The free magnetic disk follows the moving position of greatest attraction. Other illustrated arrangements use three circuits, fixed coils, or windings on both field and armature, but retain the same causal chain: timed currents, progressive pole shift, then mechanical rotation.",
    mechanicalBreakdown: [
      {
        title: "Independent motor circuits",
        summary:
          "Two or more separately connected coil paths receive alternating currents at properly chosen intervals.",
        technicalDetails:
          "In the Figure 9 system, four coils C C C′ C′ surround the ring. Diametrically opposite coils cooperate in pairs; their four free ends go to T T T′ T′. The generator's two coils B B′ supply corresponding motor paths through wires L and L′. The source shows the resultant magnetic direction advancing in eighth-turn steps as those two generator currents change.",
        archaicTerm: "independent circuits",
        modernEquivalent: "separately connected phase paths; not necessarily electrically isolated",
      },
      {
        title: "Ring and free armature",
        summary:
          "A magnetic disk or a wound armature turns within a ring or field structure as the field's attractive region moves.",
        technicalDetails:
          "Figure 9 places magnetic disk D inside annular ring R. Tesla says the disk takes the position embracing the greatest possible number of magnetic lines and therefore follows the moving points of greatest attraction. Later figures instead use a wound drum armature, a disk between stationary coils, or a field and armature both supplied with coils. The grant does not specify a single universal rotor construction.",
        archaicTerm: "armature",
        modernEquivalent: "the motor's rotating magnetic element",
      },
      {
        title: "Generator-to-motor correspondence",
        summary:
          "The generator's independently connected coils feed matching motor circuits in the order that produces the progressive shift.",
        technicalDetails:
          "Claims 1 through 4 require a relationship, not merely a motor shape: independently connected induced generator circuits correspond to the motor circuits, and their order makes a generator revolution progressively shift the motor poles. Figure 9 uses collector rings and brushes on the generator. Tesla's stated avoidance is the motor commutator and the usual commutating appliances, not every sliding contact in every illustrated embodiment.",
        archaicTerm: "induced circuits",
        modernEquivalent:
          "generator windings that develop the alternating currents sent to the motor",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Superposition of the magnetic effects",
        formula: "\\mathbf{B}_{\\mathrm{net}} = \\mathbf{B}_{B} + \\mathbf{B}_{B'}",
        explanation:
          "Tesla's sequence diagrams combine the magnetic effects from separate coil pairs. As the relative strengths and directions change, the resultant pole position advances around the ring. The source illustrates positions rather than supplying a modern sinusoidal field equation.",
      },
      {
        principle: "Synchronous relation in the Figure 9 form",
        formula:
          "\\Delta\\theta_{\\mathrm{poles}} = 2\\pi \\quad \\text{per generator revolution in Fig. 9}",
        explanation:
          "Tesla says that one generator-armature revolution moves the attractive region around the ring once. In that construction he reports that the disk motion is synchronous with the generator armature, subject to the arrangement and normal working conditions he describes.",
      },
      {
        principle: "Relative movement of two magnetic patterns",
        formula:
          "\\Delta\\theta_{\\mathrm{relative}} = \\Delta\\theta_{\\mathrm{field}} - \\Delta\\theta_{\\mathrm{armature}}",
        explanation:
          "For Figures 17 and 19, the wiring shifts the field-magnet's high-attraction regions opposite to those on the armature. Tesla states that this arrangement increases the speed of rotation. The grant does not provide a modern torque characteristic.",
      },
    ],
    whyItMattersToday:
      "The patent makes a visitor inspect the engineering move that matters across later polyphase machinery: use multiple timed electrical paths to move a magnetic condition through space, then arrange a rotor or armature to follow it. The source also preserves an important boundary: this particular grant claims motor-generator combinations and expressly says that the method of operating motors was the subject of a separate application.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "This claim covers the combination of a motor with separate or independent circuits on its armature, field-magnet, or both, and an alternating-current generator whose induced circuits connect independently to matching motor circuits. The legal result required is that generator rotation progressively shifts the motor poles.",
      keyInnovations: [
        "Paired motor-generator polyphase circuits",
        "Independent magnetic phase windings",
        "Progressive pole shifting from generator rotation",
      ],
      legalSignificance:
        "This is the broadest claim to the specified motor-generator combination; it requires corresponding independent circuits and the progressive pole shift, rather than claiming every later alternating-current motor.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "This system claim narrows the first combination to a motor with two or more independent magnetizing coils, a generator with corresponding induced coils, and direct circuit connections in the order that passes the generator currents through their corresponding motor coils to move the motor poles progressively.",
      keyInnovations: [
        "Independent alternating-current transmission system",
        "Ordered direct multi-circuit wiring",
        "Ordered correspondence between generator and motor coils",
      ],
      legalSignificance:
        "The claim makes the direct, ordered correspondence of the generator and motor coils an express legal limitation.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "This claim selects a particular motor geometry: an annular field magnet and a cylindrical or equivalent armature, with independent coils on the field, armature, or both. It pairs that motor with a generator having corresponding independent coils and requires the circuit arrangement to shift the motor poles progressively.",
      keyInnovations: [
        "Annular ring stator geometry",
        "Cylindrical or equivalent armature",
        "Progressive pole shifting around an annular field",
      ],
      legalSignificance:
        "This is the claim's geometric version of the motor-generator combination; the annular field and corresponding coils are part of its stated scope.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "This claim lists the concrete parts of a system: a disk inside an annular field magnet, diametrically opposite motor-coil pairs or groups connected to independent terminals, an equal number of generator-coil groups, and circuits that connect the two in the order needed to shift the motor poles progressively.",
      keyInnovations: [
        "Diametrically-opposed stator coil pairs",
        "Equal multi-phase generator coil groups",
        "Ordered circuits producing progressive pole shift",
      ],
      legalSignificance:
        "This is the most concrete claim in the grant, specifying the disk, ring, opposing coil groups, matched generator groups, and ordered circuit connections together.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Initial generator and motor-ring positions",
      caption:
        "The left diagram shows generator armature coil B B′ between field-magnets N S. The adjoining diagram, Fig. 1a, shows the corresponding motor-ring position with ring R and coil pairs C C C′ C′.",
      svgType: "tesla-motor",
      callouts: [
        {
          id: "tm-1",
          figureRef: "Fig. 1",
          label: "B, B′",
          element: "Generator coil positions",
          description:
            "Figure 1 labels the two generator coils B and B′ within the fixed field-magnets N and S.",
          x: 20,
          y: 50,
        },
        {
          id: "tm-2",
          figureRef: "Fig. 1",
          label: "C, C′",
          element: "Motor-ring coil pairs",
          description:
            "Figure 1a labels the four coils C C C′ C′ on ring R; diametrically opposite coils cooperate in pairs.",
          x: 50,
          y: 20,
        },
        {
          id: "tm-3",
          figureRef: "Fig. 1",
          label: "R",
          element: "Motor ring",
          description:
            "The printed R identifies the magnetic ring carrying the motor coils in the paired-position diagrams.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Three-eighth-turn phase position",
      caption:
        "Figures 4 and 4a show the generator and motor-ring conditions after three eighths of a generator-armature revolution.",
      svgType: "tesla-motor",
      callouts: [
        {
          id: "tm-4",
          figureRef: "Fig. 4",
          label: "B, B′; C, C′",
          element: "Corresponding phase diagrams",
          description:
            "The source uses these paired diagrams to show how reversal of one generator-coil current changes the resultant motor-pole position.",
          x: 50,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Tesla says the apparatus then available could not jointly provide uniform motor speed through normal loads, economical conversion, simple reliable construction, easy management, and reduced danger when high-tension currents are used for economical transmission.",
    priorArtLimitations: [
      "The specification says earlier apparatus and systems had not fulfilled the stated transmission-and-conversion requirements.",
      "Tesla treats mechanical commutation and reversal of a considerable direct current as difficult and expensive, especially where many energizing circuits would otherwise be needed.",
      "The Figure 9 discussion retains collector rings and brushes on the generator while seeking to avoid a motor commutator and the usual commutating appliances in the system.",
    ],
    breakthroughInsight:
      "The patent's stated move is to send alternating currents through two or more independent circuits at proper intervals so that the motor's magnetism, or “lines of force,” shifts progressively. The movable disk or armature follows the resulting moving points of greatest attraction.",
    patentWars: [
      {
        rivalName: "Galileo Ferraris & Charles S. Bradley",
        rivalClaim:
          "Italian physicist Galileo Ferraris published a paper on two-phase induction motor rotation in March 1888, two months before Tesla's patent issued in May 1888. Bradley claimed split-phase AC motor priority.",
        conflictDetails:
          "Ferraris constructed laboratory models in Turin but concluded polyphase motors could never exceed 50% efficiency, dismissing commercial application. Westinghouse purchased Tesla's patents for $60,000 plus royalties and aggressively litigated infringers across the United States.",
        resolution:
          "In Westinghouse Electric & Mfg. Co. v. New England Granite Co. (1901) and Westinghouse v. Dayton Fan & Motor Co., federal courts conducted exhaustive priority examinations of laboratory notebooks and patent filings.",
        legalOutcome:
          "Federal courts ruled Ferraris's publication was purely theoretical and abandoned as an unworkable toy, whereas Tesla had reduced the synchronous and induction polyphase machine to practice in 1887 with complete commercial transmission systems, establishing Westinghouse's unassailable patent monopoly.",
      },
    ],
    civilizationalImpact:
      "This grant gives a carefully illustrated historical account of coordinated independent current paths moving a magnetic condition through space. It records two-circuit, three-circuit, stationary-induced-element, and doubly wound variants rather than collapsing them into one generic later motor.",
    funFact:
      "The grant has four drawing sheets and nineteen numbered figures, including paired diagrams 1 through 8 and 1a through 8a that trace successive magnetic positions.",
    aftermath:
      "The document itself limits this application to apparatus and system combinations and says that the method of operating motors was the subject of a separate application. That distinction matters when relating this 1888 source to later alternating-current motor practice.",
    sideNotes: [
      "The filing notice printed on the grant is October 12, 1887, Serial No. 252,132, and carries the parenthetical “No model.”",
      "The patent explicitly defines “independent” as not necessarily electrically isolated, because connections may regulate or modify motor action without producing a new or different action.",
    ],
  },
  tags: [
    "Nikola Tesla",
    "Electro-Magnetic Motor",
    "Alternating Current",
    "Independent Alternating-Current Circuits",
    "Rotating Magnetic Field",
    "Electromagnetism",
    "Motor-Generator Combination",
  ],
  stats: {
    totalClaims: 4,
    independentClaims: 4,
  },
};
