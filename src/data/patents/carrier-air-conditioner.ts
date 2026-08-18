import { carrierAirConditionerArchivalEdition } from "@/data/editions/carrierAirConditionerEdition";
import type { Patent } from "@/types/patent";

/**
 * Retained only as a migration witness. Its public successor below corrects
 * the pre-existing conflation of US 808,897 with Carrier's other air-control
 * work; the registry imports `carrierAirConditionerPatent`, not this record.
 */
export const legacyCarrierAirConditionerPatent: Patent = {
  id: "us-808897-carrier-air-conditioner",
  patentNumber: "US 808,897",
  title: "Apparatus for Treating Air",
  shortTitle: "Carrier Psychrometric Dew-Point Air Conditioning System",
  subtitle:
    "Chilled Spray Dew-Point Dehumidification, Thermodynamic Psychrometrics, and Simultaneous Temperature-Humidity Control",
  inventors: ["Willis H. Carrier"],
  inventorLocation: "Buffalo, New York",
  grantDate: "1906-01-02",
  filingDate: "1902-09-16",
  era: "Progressive Era (1900–1920)",
  category: "consumer",
  categoryLabel: "Psychrometrics & Environmental HVAC",
  summary:
    "The birth of modern air conditioning: on January 2, 1906, American engineer Willis Haviland Carrier received US Patent No. 808,897 for the apparatus for treating air. In 1902, the Sackett-Wilhelms Lithographing Company in Brooklyn was crippled during summer humidity: paper sheets expanded and contracted with shifting moisture, misaligning four-color ink prints and ruining thousands of magazine runs. Standing on a foggy Pittsburgh railway platform in the autumn of 1902, Carrier made a counterintuitive breakthrough: air can be dried by spraying it with cold water. By atomizing water chilled below the intake air's dew point ($T_{\\text{spray}} < T_{\\text{dew}}$), water vapor condensed out of the air stream into the droplets. Carrier formulated the exact psychrometric enthalpy equations ($h = c_{pa} T + W(h_{fg0} + c_{pw}T)$) that enabled precise, simultaneous control of indoor temperature, humidity, air cleanliness, and circulation.",
  heroQuote:
    "Be it known that I, Willis H. Carrier, a citizen of the United States, residing at Buffalo, in the County of Erie and State of New York, have invented certain new and useful Improvements in Apparatus for Treating Air, of which the following is a specification...",
  originalPdfUrl: "/patents/pdfs/us-808897-carrier-air-conditioner.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US808897A/en",
  usptoClassification: "F24F 3/14 (Air conditioning / Dehumidification by liquid contact)",
  originalTextAsset: {
    url: "/patents/source-text/us-808897-carrier-air-conditioner.txt",
    pageCount: 4,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
WILLIS H. CARRIER, OF BUFFALO, NEW YORK.

APPARATUS FOR TREATING AIR.

SPECIFICATION forming part of Letters Patent No. 808,897, dated January 2, 1906.
Application filed September 16, 1902. Serial No. 123,618. (No model.)

To all whom it may concern:
Be it known that I, WILLIS H. CARRIER, a citizen of the United States, residing at Buffalo, in the County of Erie and State of New York, have invented certain new and useful Improvements in Apparatus for Treating Air; and I do hereby declare that the following is a full, clear, and exact description of the invention.

This invention relates to apparatus for treating atmospheric air for heating, cooling, humidifying, or dehumidifying the same, and for freeing it from dust, smoke, and other impurities, in order to condition the air for use in buildings, industrial workshops, and textile mills.

The primary object of the invention is to provide means whereby the moisture content or humidity of the air may be accurately regulated and controlled at any desired degree, irrespective of external weather conditions.

The invention consists, fundamentally:
First, in a casing or chamber through which the air to be treated is caused to flow by a fan or blower.
Second, in a series of atomizing spray-nozzles arranged across the path of the air within said chamber, through which water under pressure is discharged in a dense, finely divided atomized spray or mist, in intimate contact with the passing air.
Third, in means for regulating the temperature of the spray-water so that when the air is to be dehumidified the water is maintained at a temperature below the dew-point of the entering air, whereby moisture is condensed from the air and collected in the water.
Fourth, in a series of baffle-plates or eliminators located in the chamber beyond the spray-nozzles, having zigzag surfaces for intercepting all suspended water droplets from the air stream while allowing the conditioned air to pass onward without entrained liquid.

I claim as my invention:

1. The method of regulating the humidity of air, which consists in causing the air to pass through a finely divided spray of water maintained at a predetermined temperature to bring the air to a substantially saturated condition at a predetermined dew-point temperature, and then separating the entrained water particles from the air.

2. In an apparatus for treating air, the combination with a casing through which the air flows, of spray-nozzles arranged to discharge an atomized liquid into the air stream, means for regulating the temperature of the liquid discharged by the nozzles, and eliminator-plates located beyond the nozzles for intercepting liquid particles suspended in the air.

3. The method of dehumidifying air, which consists in causing the air to pass through an atomized spray of water maintained at a temperature below the dew-point of the entering air, whereby moisture is condensed from the air by direct liquid contact, and removing the entrained liquid from the air stream.`,
  plainEnglishExplanation: {
    overview:
      "Before Willis Carrier, summer heat and humidity shut down textile mills, warped printing paper, spoiled pharmaceuticals, and made southern cities nearly unlivable in July and August. Early cooling attempts blew air across blocks of frozen lake ice, which cooled the air slightly but left it at 100% relative humidity, creating a swampy, moldy indoor atmosphere. Carrier realized that human comfort and industrial manufacturing required controlling **both temperature and humidity simultaneously**. His apparatus invented the fundamental technology of modern heating, ventilation, and air conditioning (HVAC).",
    coreMechanism:
      "A centrifugal blower draws warm, humid outdoor air ($T_{\\text{db}} = 35^\\circ\\text{C}$, $\\text{RH} = 75\\%$, dew point $T_{\\text{dew}} = 29.8^\\circ\\text{C}$) into an insulated sheet-metal plenum chamber. The air passes through a dense curtain of atomized chilled water sprayed at $P_{\\text{water}} = 2.5\\text{ bar}$ through centrifugal atomizing nozzles. The water is chilled by an external mechanical ammonia refrigeration machine to $T_{\\text{spray}} = 8^\\circ\\text{C}$ (well below the air's dew point). As the air stream flows through the spray mist, direct contact heat transfer drops the air temperature to $T = 8^\\circ\\text{C}$. Because the air's saturated vapor pressure at $8^\\circ\\text{C}$ ($P_{\\text{sat}} = 10.7\\text{ mbar}$) is far lower than the vapor pressure of the incoming humid air ($P_v = 42.2\\text{ mbar}$), excess water vapor instantly condenses out of the gas phase onto the cold spray droplets, stripping up to $15\\text{ grams of water}$ per kilogram of dry air. The saturated, dehumidified air then passes through a series of zigzag galvanized baffle eliminator plates with bent lip edges, which trap and drain all airborne liquid droplets through inertial impaction without dropping air pressure. Finally, the dry air passes through a steam heating coil that raises its dry-bulb temperature to a comfortable $22^\\circ\\text{C}$, dropping its relative humidity to an ideal $42\\%$, before being distributed through ducts into the building.",
    mechanicalBreakdown: [
      {
        title: "Centrifugal Atomizing Spray Nozzle Bank",
        summary: "Whirlpool spray nozzles creating high-surface-area water mist.",
        technicalDetails:
          "Brass nozzles with tangential swirl chambers atomizing water into micro-droplets ($d_{32} \\approx 100\\,\\mu\\text{m}$), generating over $500\\text{ m}^2$ of interfacial liquid contact area per cubic meter of airflow for rapid psychrometric equilibrium.",
        archaicTerm: "Atomizing spray-nozzles and water-distributing pipes",
        modernEquivalent: "Air washer atomizing spray header",
      },
      {
        title: "Zigzag Inertial Droplet Eliminator Baffles",
        summary: "Corrugated sheet-metal plates extracting entrained water droplets.",
        technicalDetails:
          "Series of parallel galvanized iron plates with $30^\\circ$ zigzag bends and hooked trailing edges. Centrifugal inertia forces water droplets ($>10\\,\\mu\\text{m}$) to collide with wet baffle walls and drain into a collection sump with $<50\\text{ Pa}$ air pressure drop.",
        archaicTerm: "Baffle-plates or eliminators with hooked surfaces",
        modernEquivalent: "Inertial mist eliminator vanes",
      },
      {
        title: "Dew-Point Thermostatic Water Temperature Regulator",
        summary: "Pneumatic thermostat controlling chilled spray water mixing valves.",
        technicalDetails:
          "A compressed-air thermostatic bulb situated at the eliminator exit measures saturated air temperature, automatically modulating a 3-way mixing valve between refrigerated chilled water and recirculated sump water to lock dew point within $\\pm 0.3^\\circ\\text{C}$.",
        archaicTerm: "Automatic temperature-regulating valve and thermostat",
        modernEquivalent: "Dew-point psychrometric modulation controller",
      },
      {
        title: "Tempering & Reheat Steam Fin Coils",
        summary: "Finned copper/iron radiator coils adjusting final room dry-bulb temperature.",
        technicalDetails:
          "Steam finned coils reheating the dehumidified saturated air from $8^\\circ\\text{C}$ to room supply temperature ($20\\text{--}24^\\circ\\text{C}$), providing independent sensible temperature control while preserving low absolute humidity.",
        archaicTerm: "Tempering-coils and radiator pipes",
        modernEquivalent: "Sensible reheat heating coil",
      },
      {
        title: "Centrifugal Air Handling Blower Fan & Variable Plenum",
        summary: "Forward-curved multi-blade squirrel-cage fan delivering constant volume airflow.",
        technicalDetails:
          "A double-inlet centrifugal fan ($D = 1.2\\text{ m}$) powered by an electric motor. It pulls airflow through the spray and baffle bank ($Q = 150\\text{ m}^3/\\text{min}$) against $350\\text{ Pa}$ static pressure, maintaining uniform velocity distribution ($v_{\\text{face}} = 2.5\\text{ m/s}$) across the spray cross-section.",
        archaicTerm: "Centrifugal fan or blower drawing the air",
        modernEquivalent: "Centrifugal air handling unit (AHU) supply fan",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Psychrometric Moist Air Enthalpy Equation",
        formula:
          "h = c_{pa} T + W \\left(h_{fg0} + c_{pw} T\\right), \\quad c_{pa} = 1.006\\text{ kJ/(kg}\\cdot\\text{K)}, \\quad h_{fg0} = 2501\\text{ kJ/kg}",
        explanation:
          "Carrier developed the foundational thermodynamic equation of psychrometrics, defining total moist air enthalpy $h$ as the sum of sensible heat in the dry air plus latent heat of vaporization stored in the humidity ratio $W = m_{\\text{vapor}} / m_{\\text{dry air}}$.",
      },
      {
        principle: "Dew-Point Moisture Condensation Law",
        formula:
          "\\text{RH} = \\frac{P_v}{P_{\\text{sat}}(T)} \\times 100\\%, \\quad \\text{Condensation Rate: } \\dot{m}_{\\text{cond}} = \\dot{m}_{\\text{air}} \\left(W_{\\text{in}} - W_{\\text{dew}}(T_{\\text{spray}})\\right)",
        explanation:
          "When warm air is brought into contact with water at a temperature below the air's dew point ($T_{\\text{water}} < T_{\\text{dew}}$), water vapor must condense into the liquid phase until the air's vapor pressure matches the saturation pressure at the water temperature.",
      },
      {
        principle: "Sensible vs Latent Heat Extraction Ratio",
        formula:
          "\\text{SHR} = \\frac{\\dot{Q}_{\\text{sensible}}}{\\dot{Q}_{\\text{total}}} = \\frac{\\dot{m} c_{pa} (T_{\\text{in}} - T_{\\text{out}})}{\\dot{m} (h_{\\text{in}} - h_{\\text{out}})}",
        explanation:
          "Carrier's apparatus simultaneously extracts sensible heat (dropping dry-bulb temperature) and latent heat (condensing humidity), allowing independent adjustment of the Sensible Heat Ratio to match building occupancy loads.",
      },
      {
        principle: "Clausius-Clapeyron Vapor Pressure Saturation Curve",
        formula:
          "\\ln\\left(\\frac{P_{\\text{sat}}(T)}{P_0}\\right) = -\\frac{\\Delta H_{\\text{vap}}}{R} \\left(\\frac{1}{T} - \\frac{1}{T_0}\\right) \\implies P_{\\text{sat}}(8^\\circ\\text{C}) = 10.72\\text{ mbar}",
        explanation:
          "Chilling the air to $8^\\circ\\text{C}$ slashes the water-holding capacity of air by $75\\%$ compared to $35^\\circ\\text{C}$ ($P_{\\text{sat}} = 56.2\\text{ mbar}$), forcing liquid phase separation by pure chemical thermodynamics.",
      },
      {
        principle: "Inertial Mist Impaction Stokes Number",
        formula:
          "\\text{Stk} = \\frac{\\rho_{\\text{water}} d_{\\text{droplet}}^2 v_{\\text{air}}}{18 \\mu_{\\text{air}} L_{\\text{baffle}}} > 1.0",
        explanation:
          "The zigzag baffle plates turn the airflow abruptly; water droplets with $\\text{Stk} > 1$ cannot negotiate the aerodynamic streamlines and impact the wet baffle surfaces by momentum inertia, capturing $>99\\%$ of liquid carryover.",
      },
    ],
    whyItMattersToday:
      "Willis Carrier's invention made modern civilization possible in hot climates. Air conditioning transformed the American Sun Belt (enabling the rise of cities like Phoenix, Houston, Miami, Las Vegas, and Atlanta) and global tropical economies across Singapore, Dubai, and Hong Kong. Air conditioning is mandatory for the operation of modern **data centers, semiconductor fabrication cleanrooms, pharmaceutical laboratories, and high-rise glass architecture**.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "An apparatus for treating air, comprising an air-chamber, means for forcing a current of air through said chamber, spray-nozzles arranged in the chamber for discharging atomized water across the path of the air, means for maintaining the temperature of the spray-water below the dew-point of the entering air, whereby moisture is condensed from the air, and eliminators situated beyond the spray-nozzles for intercepting suspended water droplets from the air current, substantially as described.",
      plainEnglish:
        "The master air conditioning apparatus claim: forcing air through a spray chamber of atomized water maintained below the air's dew point to condense moisture from the air, followed by baffle eliminators that strip suspended droplets from the conditioned air stream.",
      keyInnovations: [
        "Chilled spray dew-point dehumidification",
        "Atomized water-air contact chamber",
        "Inertial baffle droplet elimination",
      ],
      legalSignificance:
        "The foundational patent claim of modern air conditioning, establishing Carrier's priority in simultaneous temperature and humidity control.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In an apparatus for treating air, the combination, with the spray-chamber and eliminators, of a heating-coil located beyond the eliminators for raising the temperature of the dehumidified air, whereby the relative humidity of the air discharged from the apparatus is controlled.",
      plainEnglish:
        "The reheat humidity control claim: placing a heating coil after the eliminators to reheat the dehumidified air, controlling both absolute moisture and final relative humidity.",
      keyInnovations: [
        "Post-dehumidification sensible reheat",
        "Independent relative humidity regulation",
        "Dual psychrometric conditioning stage",
      ],
      legalSignificance:
        "Protected the two-stage cooling-and-reheat method used in all commercial comfort and cleanroom HVAC systems.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In an apparatus for treating air, the combination, with the spray-nozzles, of an automatic thermostatic regulator responsive to the temperature of the saturated air leaving the eliminators for regulating the temperature of the water supplied to the spray-nozzles, whereby a predetermined dew-point is automatically maintained.",
      plainEnglish:
        "The automatic dew-point regulator claim: a thermostat sensing the saturated air temperature after the eliminators to automatically regulate the spray water temperature and maintain a fixed dew point.",
      keyInnovations: [
        "Automatic dew-point feedback control",
        "Thermostatic water temperature modulation",
        "Closed-loop environmental stability",
      ],
      legalSignificance:
        "Protected automatic closed-loop psychrometric control in air conditioning systems.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Carrier Psychrometric Air Washer Section & Nozzle Chamber",
      caption:
        "Longitudinal cutaway section of Willis Carrier's air treating apparatus showing the intake plenum, atomizing chilled water spray header, zigzag droplet eliminator plates, and reheat heating coils.",
      svgType: "carrier-air-conditioner",
      callouts: [
        {
          id: "ca-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Humid Air Intake Plenum",
          description:
            "Centrifugal fan intake drawing warm humid air into insulated washer casing.",
          x: 22,
          y: 50,
        },
        {
          id: "ca-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Atomizing Chilled Water Spray Header",
          description: "Nozzle bank spraying 8°C chilled water mist below intake air dew point.",
          x: 42,
          y: 45,
        },
        {
          id: "ca-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Zigzag Inertial Droplet Eliminator",
          description: "Baffle plates trapping entrained liquid droplets by inertial impact.",
          x: 60,
          y: 45,
        },
        {
          id: "ca-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Sensible Reheat Steam Fin Coils",
          description: "Steam coils reheating dehumidified air from 8°C to comfortable 22°C.",
          x: 75,
          y: 45,
        },
        {
          id: "ca-5",
          figureRef: "Fig. 1",
          label: "E",
          element: "Chilled Water Sump & Pump Return",
          description: "Recirculation sump draining condensed moisture to refrigeration chiller.",
          x: 50,
          y: 78,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the summer of 1902, the Sackett-Wilhelms Lithographing and Publishing Company in Brooklyn, New York, faced financial ruin. High summer humidity caused paper sheets to expand, buckle, and absorb moisture from the air. When color lithograph prints were run through four successive printing presses for yellow, red, blue, and black inks, the paper shifted by fractions of an inch, blurring the artwork of *Judge* magazine into an unreadable smear. Sackett-Wilhelms hired 25-year-old Cornell engineering graduate Willis Carrier to fix the problem.",
    priorArtLimitations: [
      "Blowing air over ice blocks added humidity rather than removing it, causing paper to swell even worse.",
      "Chemical desiccant systems (calcium chloride) were corrosive, foul-smelling, and could not be regulated continuously.",
      "No mathematical formulas existed linking temperature, vapor pressure, and humidity in moving air streams.",
    ],
    breakthroughInsight:
      "While waiting for a train in the fog at the Pittsburgh railway station in late autumn 1902, Carrier watched the cold fog condense and realized: **fog is air that has been cooled to its dew point, forcing moisture out**. If you spray air with chilled water droplets colder than the air's dew point, the spray will simultaneously cool the air and condense out its humidity. Carrier had discovered that you can dry air by washing it with cold water.",
    patentWars: [
      {
        rivalName: "Stuart W. Cramer (Textile Mill Humidity Systems)",
        rivalClaim:
          "North Carolina mill engineer Stuart Cramer patented atomizing humidifiers in 1906 and coined the phrase 'air conditioning' (analogous to 'yarn conditioning' in textile spinning).",
        conflictDetails:
          "Carrier and Cramer debated the distinction between simple humidification (adding moisture) and true psychrometric air conditioning (simultaneous heating, cooling, humidification, and dehumidification).",
        resolution:
          "Carrier recognized Cramer's term 'air conditioning' and adopted it, while Carrier's master patent US 808,897 remained the sole patent covering true dehumidification and dew-point regulation.",
        legalOutcome:
          "Carrier founded the Carrier Engineering Corporation in 1915, dominating industrial and commercial air conditioning across the globe.",
      },
    ],
    civilizationalImpact:
      "In 1911, Carrier presented his legendary 'Rational Psychrometric Formulae' to the American Society of Mechanical Engineers (ASME), providing the mathematical equations still used by HVAC engineers today. In the 1920s, Carrier installed air conditioning in the Rivoli Theatre in Times Square, the US Senate and House of Representatives chambers, and the White House. Air conditioning triggered the post-WWII economic explosion of the American South and enabled the modern digital computing age.",
    funFact:
      "The first movie theaters to install Carrier air conditioning in the 1920s saw ticket sales explode during July and August, creating the cultural phenomenon of the summer 'Hollywood Blockbuster,' because millions of ordinary Americans bought movie tickets primarily to escape the summer heat in an air-conditioned palace.",
    aftermath:
      "Willis Carrier was awarded the Frank P. Brown Medal in 1942 and was inducted into the National Inventors Hall of Fame. He died in New York City in 1950 at age 73, having transformed the geography and architecture of human civilization.",
    sideNotes: [
      "Before Carrier air conditioning, the US Congress routinely adjourned and shut down entirely during summer months because the Capitol building in Washington, D.C. became unlivable in 95°F heat and humidity.",
      "The world's first air-conditioned private home was built in Minneapolis in 1914 for mansion owner Charles Gates, featuring an enormous 7-foot-high Carrier air conditioning unit in the basement.",
    ],
  },
  tags: [
    "Willis Carrier",
    "Air Conditioning",
    "Psychrometrics",
    "Dew Point",
    "HVAC",
    "Thermodynamics",
    "Carrier Corporation",
    "Progressive Era",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1902–1915",
    impactScore: 100,
  },
};

function manualClaimText(number: number): string {
  const block = carrierAirConditionerArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Carrier manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const carrierAirConditionerPatent: Patent = {
  id: "us-808897-carrier-air-conditioner",
  patentNumber: "US 808,897",
  title: "Apparatus for Treating Air",
  shortTitle: "Wet-Plate Air Purifier",
  subtitle: "A sprayed-air washer with sinuous separator plates for particle and droplet removal",
  inventors: ["Willis H. Carrier"],
  inventorLocation: "Buffalo, New York",
  grantDate: "1906-01-02",
  filingDate: "1904-09-16",
  era: "Progressive Era (1900–1920)",
  category: "consumer",
  categoryLabel: "Air Treatment & Environmental Engineering",
  summary:
    "US 808,897 claims an air-purifying apparatus in which a fine spray wets suspended material and an upright, zigzag plate separator removes liquid and the material captured by it. It is not the 1902 Carrier humidity-control patent often credited as the origin of modern air conditioning: this 1904 filing is specifically about the construction and action of the separator plates.",
  heroQuote: "The two portions of the separator-plates perform distinct functions.",
  originalPdfUrl: "/patents/pdfs/us-808897-carrier-air-conditioner.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US808897A/en",
  usptoClassification: "Air-purifying apparatus",
  originalTextAsset: {
    url: "/patents/transcripts/us-808897-carrier-air-conditioner-reviewed.txt",
    pageCount: 4,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "b8cfbb69e27934862236ecabf03396e67d04a4b4011c98083f1205cd76f0291e",
  },
  archivalEdition: carrierAirConditionerArchivalEdition,
  originalText:
    "This grant describes an air conduit, a fine spray, and a two-stage plate separator. Its five claims protect the geometry of the upright sinuous plates and their gutters, not an automatic dew-point-control system.",
  plainEnglishExplanation: {
    overview:
      "Carrier washes an air stream with a fine liquid spray, then sends that wet stream through repeated turns between shaped upright plates. Dirt is thrown into the wet film; the plate geometry then removes free droplets while keeping the pressure loss modest.",
    coreMechanism:
      "A fan K moves air through casing M. Spray device H makes a fine liquid spray. The front plate faces i remain wet and collect suspended matter as the air turns through them. Rear flanges b and c form gutters that interrupt liquid travel across the later bends, separating free droplets before the air leaves the apparatus.",
    mechanicalBreakdown: [
      {
        title: "Spray device H",
        summary:
          "A supply pipe and whirling nozzles distribute treating liquid through the incoming air.",
        technicalDetails:
          "The specification permits water or another treating liquid. Its shown nozzles h impart circular motion to the issuing liquid to make a fine spray; it does not state a refrigeration temperature, pump pressure, or automatic humidity controller.",
        archaicTerm: "Atomized spray",
        modernEquivalent: "Fine-droplet air washer spray",
      },
      {
        title: "Sinuous separator plates",
        summary: "Upright plates make the air follow a sequence of oblique turns.",
        technicalDetails:
          "The turns bring the stream into contact with wetted faces. Inertia and the curved path drive suspended solid material toward the liquid film, which carries it down to trap J and filter or sieve L.",
        archaicTerm: "Separator plates or elements",
        modernEquivalent: "Wet baffle or mist-eliminator plates",
      },
      {
        title: "Rear flanges and gutters",
        summary:
          "The plate's rear section limits liquid flow across successive faces to remove droplets from air.",
        technicalDetails:
          "Projections b and c obstruct liquid motion at the bends, while gutter a collects liquid at the rear edge. The claim language makes the unobstructed wet front and obstructed rear a deliberate two-stage arrangement.",
        archaicTerm: "Flanges or lips",
        modernEquivalent: "Droplet-separation gutters",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Inertial impaction in a turning flow",
        explanation:
          "The document says that particles are thrown against the wet film by their inertia and by centrifugal force from the sinuous air path. In modern terms, a particle cannot follow every abrupt streamline turn as readily as the carrier gas, so it contacts the wetted surface.",
      },
      {
        principle: "Gravity drainage and liquid-film capture",
        explanation:
          "The front plate surfaces intentionally remain wet. Captured material is washed downward by that film into basin or trap J, while the rear plate geometry seeks to separate free liquid from the outgoing air.",
      },
    ],
    whyItMattersToday:
      "The patent records a practical early air-washer and mist-separator problem: create wet contact for particle capture, then prevent liquid carryover. Its complete source also matters because it distinguishes this plate-separator grant from Carrier's separate humidity-control work.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 covers the complete separator assembly inside an air conduit. Each upright plate must have successive oblique faces that make a continuous sinuous surface; its front portion remains unobstructed so liquid can spread from face to face, while the succeeding portion has projections that stop liquid from continuing along the conduit and help remove it from the air. The plates must be spaced to make the matching continuous sinuous air passages.",
      keyInnovations: [
        "Two-zone plate surface with unobstructed wet front portion",
        "Projected rear portion that interrupts lengthwise liquid flow",
        "Spaced plates forming continuous sinuous conduit passages",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 claims the air-moistening combination with the separator. It requires moistening means, an air conduit, and spaced upright plates whose upright bends produce oblique faces and sinuous passages. It then specifies smooth, unobstructed front plate surfaces and surface projections in the succeeding plate portions that obstruct liquid travel lengthwise of the conduit. Unlike Claim 1, this wording expressly includes the means that wet the incoming air.",
      keyInnovations: [
        "Air-moistening means coupled to the separator",
        "Smooth unobstructed front plate surfaces",
        "Succeeding plate-surface projections that block conduitwise liquid flow",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 narrows the moistening-air apparatus to the bend-and-gutter arrangement. The spaced upright plates must have upright bends that define continuous sinuous air passages, and some of those bends must carry projecting flanges. Those flanges form upright gutters, making the drainage and droplet-separation feature itself part of the claimed combination.",
      keyInnovations: [
        "Upright bends defining continuous sinuous air passages",
        "Projecting flanges mounted on selected bends",
        "Upright gutters formed by the flanges",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 states a shorter combination claim for the moistening means, conduit, and separator. Its plate limitation is a continuous zigzig surface on spaced upright plates, with projections that form gutters at the salient portions of those surfaces. It does not restate the full front-versus-rear distribution language of Claim 1; the protected detail here is the continuously folded surface and gutter placement at its projecting turns.",
      keyInnovations: [
        "Continuous zigzig plate surfaces",
        "Gutters located at salient surface portions",
        "Compact moistening-air separator combination",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "Claim 5 is directed to one separator plate rather than the whole air-treatment apparatus. The plate is made from separate angled sections. The front part of the rear section must project past the rear part of the adjacent front section, so their overlap creates a gutter at the junction. That overlap geometry is the claimed article-level construction.",
      keyInnovations: [
        "Separate angled separator-plate sections",
        "Rear-section front edge projecting beyond the adjacent section",
        "Junction gutter created by overlapping section geometry",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Air-treatment apparatus",
      caption:
        "Part elevation and part vertical section of the air-treatment apparatus described in US 808,897.",
      svgType: "carrier-air-conditioner",
      callouts: [],
    },
    {
      figureNumber: "Fig. 2",
      title: "Separating device in horizontal section",
      caption: "Enlarged fragmentary horizontal section through the separating device.",
      svgType: "carrier-air-conditioner",
      callouts: [],
    },
    {
      figureNumber: "Fig. 3",
      title: "Separating-device diagram",
      caption: "Diagram of the separating device.",
      svgType: "carrier-air-conditioner",
      callouts: [],
    },
    {
      figureNumber: "Fig. 4",
      title: "Separator plate or element",
      caption: "Perspective view of one separator plate or element.",
      svgType: "carrier-air-conditioner",
      callouts: [],
    },
    {
      figureNumber: "Fig. 5",
      title: "Spray nozzle in section",
      caption: "Enlarged section of one detached spray nozzle.",
      svgType: "carrier-air-conditioner",
      callouts: [],
    },
    {
      figureNumber: "Fig. 6",
      title: "Spray nozzle in a second plane",
      caption: "Enlarged section in a different plane of the detached spray nozzle.",
      svgType: "carrier-air-conditioner",
      callouts: [],
    },
  ],
  historicalContext: {
    problemStatement:
      "An air washer needs to expose suspended material to liquid, then remove the liquid and captured material without allowing the air to bypass the separator path.",
    priorArtLimitations: [
      "A simple spray can leave liquid droplets entrained in the outgoing air.",
      "A plate that drains liquid too early loses wet contact area; a plate that retains too much liquid can leave carryover.",
    ],
    breakthroughInsight:
      "Carrier divides the plate into a wet, unobstructed front contact zone and a rear zone with projections and gutters, so the same sinuous path can first capture material and then separate liquid.",
    patentWars: [],
    civilizationalImpact:
      "The document is an early industrial treatment of air washing and mist separation. It should not be used as evidence for technical features absent from its source, including a specified chilled-water dew-point system.",
    aftermath:
      "The printed grant identifies Buffalo Forge Company as assignee. This edition limits its historical claims to what the primary facsimile and its masthead establish.",
  },
  tags: ["Willis H. Carrier", "air washer", "air purification", "mist elimination"],
  stats: {
    totalClaims: 5,
    independentClaims: 5,
  },
};
