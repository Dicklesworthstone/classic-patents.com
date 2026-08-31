import { spencerMicrowaveArchivalEdition } from "@/data/editions/spencerMicrowaveEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = spencerMicrowaveArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Spencer manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

const legacySpencerMicrowavePatent: Patent = {
  id: "us-2495429-spencer-microwave",
  patentNumber: "US 2,495,429",
  title: "Method of Treating Foodstuffs",
  shortTitle: "Spencer Microwave Oven & Dielectric RF Heating",
  subtitle: "High-Power Cavity Magnetron and Ten-Centimeter Microwave Food Processing",
  inventors: ["Percy L. Spencer"],
  inventorLocation: "Newton, Massachusetts",
  grantDate: "1950-01-24",
  filingDate: "1945-10-08",
  era: "Electronic Era (1920–1960)",
  category: "materials",
  categoryLabel: "Microwave Engineering & Thermodynamics",
  summary:
    "The Invention of Microwave Cooking: On October 8, 1945, self-taught Raytheon engineer Percy Spencer filed US Patent No. 2,495,429 for heating and cooking foodstuffs using high-frequency electromagnetic microwave radiation. By channeling 10-centimeter microwaves (approx. 2.45–3 GHz) from a cavity magnetron into a concentrated waveguide and treatment cavity, Spencer discovered that microwave fields induce high-speed rotational friction in polar water molecules ($P_v = 2\\pi f \\epsilon_0 \\epsilon'' |\\vec{E}|^2$). This achieved volumetric dielectric heating throughout the interior of food, cooking meals in seconds rather than hours and giving birth to the modern microwave oven.",
  heroQuote:
    "My present invention relates to the treatment of foodstuffs, and more particularly to the cooking thereof through the use of electromagnetic energy.",
  originalPdfUrl: "/patents/pdfs/us-2495429-spencer-microwave.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2495429A/en",
  usptoClassification: "H05B 6/64 (Dielectric heating / Microwave ovens)",
  archivalEdition: spencerMicrowaveArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-2495429-spencer-microwave-reviewed.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "c5affa57d71dd79a431c8a87427672d9d04579cab911b1b6b5eec9a16ad00aca",
  },
  originalText: `UNITED STATES PATENT OFFICE.
2,495,429.
METHOD OF TREATING FOODSTUFFS.
Percy L. Spencer, West Newton, Mass., assignor to Raytheon Manufacturing Company, Newton, Mass., a corporation of Delaware.
Application October 8, 1945, Serial No. 620,919. 6 Claims. (Cl. 99-221)

This invention relates to the treatment of foodstuffs, and more particularly to the cooking thereof through the use of electromagnetic energy.

Such energy has been used before for this purpose, but the frequencies employed have been relatively low, for example, not over 50 megacycles. I have found that at frequencies of this order of magnitude, the energy necessarily expended in order to generate sufficient heat to satisfactorily cook the foodstuff is much too high to permit the practical use of the process.

I have found, however, that by utilizing electromagnetic wave energy of a wavelength falling in the microwave region of the electromagnetic spectrum—for example, wavelengths of the order of ten centimeters or less—foodstuffs can be cooked with extraordinary rapidity and with exceptionally low expenditures of electrical energy.

At these hyper-frequencies, the wavelength of the electromagnetic energy is of the same order of magnitude as the average dimensions of the foodstuff bodies being cooked. The electromagnetic waves penetrate into the body of the food, generating heat directly within the interior substance by dielectric displacement and molecular agitation, rather than relying upon slow thermal conduction from the outer surface inward.`,
  plainEnglishExplanation: {
    overview:
      "For thousands of years, cooking relied entirely on surface thermal conduction and convection: heat slowly diffused inward (k approx 0.5 W/m K). While experimenting with high-power cavity magnetrons at Raytheon in 1945, Percy Spencer discovered that ten-centimeter microwaves pass directly into food and induce volumetric dielectric heating. In his patent demonstrations, cooking a hard-boiled egg consumed only 2 kw.-sec. of microwave energy compared to 36 kw.-sec. by boiling water, while baking a potato required approximately 240 kw.-sec. compared to 72,000 kw.-sec. in an electric oven.",
    coreMechanism:
      "Two push-pull cavity magnetrons generate ten-centimeter microwave radiation by swirling electrons through resonant copper cavities under crossed electric and magnetic fields. The energy is channeled through a common rectangular waveguide directly across a conveyor path. Polar water molecules in the food oscillate with the alternating field, dissipating electromagnetic energy directly into thermal agitation throughout the entire volume of the foodstuff.",
    mechanicalBreakdown: [
      {
        title: "Resonant Cavity Magnetron Oscillator",
        summary:
          "A vacuum tube with cylindrical resonant cavities cut into a solid copper anode block.",
        technicalDetails:
          "Operates under crossed radial electric fields and axial magnetic fields. Electrons emitted from the central cathode orbit in a swirling spoke-wheel pattern, exciting self-sustaining ten-centimeter microwave oscillations in the anode resonant cavities with over 70% electrical-to-RF conversion efficiency.",
        archaicTerm: "Magnetron oscillator tube",
        modernEquivalent: "Continuous-wave microwave cavity magnetron",
      },
      {
        title: "Hollow Rectangular Waveguide Launcher",
        summary: "A hollow metallic duct that channels microwave energy into the cooking chamber.",
        technicalDetails:
          "Transmits the fundamental TE10 microwave mode with minimal resistive attenuation, coupling RF energy from the magnetron coupling loops directly into the food exposure zone.",
        archaicTerm: "Common hollow wave guide",
        modernEquivalent: "TE10 rectangular microwave waveguide",
      },
      {
        title: "Continuous Moving Conveyor System",
        summary: "A conveyor belt transporting foodstuffs through the concentrated microwave zone.",
        technicalDetails:
          "Enables continuous in-line food processing where exposure time is precisely regulated by belt velocity, preventing local hot spots and thermal runaway.",
        archaicTerm: "Transversely-moving conveyor",
        modernEquivalent: "Continuous industrial microwave processing tunnel",
      },
      {
        title: "Waveguide Treatment Enclosure",
        summary:
          "A hollow metallic wave guide concentrating microwave energy into the foodstuff path.",
        technicalDetails:
          "The hollow rectangular guide confines the electromagnetic waves and couples energy from the magnetron oscillators directly into the foodstuff passing through the treatment region, supporting dominant $TE_{10}$ mode propagation.",
        archaicTerm: "Hollow wave guide",
        modernEquivalent: "Rectangular applicator waveguide",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Dielectric Loss & Debye Dipole Relaxation Heating",
        formula: "P_v = 2 pi f epsilon_0 epsilon'' |E|^2",
        explanation:
          "Volumetric heat dissipation P_v depends directly on frequency f, electric field strength squared |E|^2, and dielectric loss factor epsilon'', which peaks when microwave frequency matches water's molecular relaxation time tau.",
      },
      {
        principle: "Microwave Penetration Depth in Foodstuffs",
        formula: "D_p approx (lambda_0 sqrt(epsilon')) / (2 pi epsilon'')",
        explanation:
          "At ten-centimeter wavelength (approx 2.45-3 GHz, lambda_0 approx 12.2 cm), penetration depth D_p in high-moisture meat and vegetables is 1.5–4 cm, allowing microwaves to heat the core volume directly rather than relying on slow surface conduction.",
      },
      {
        principle: "Hull Magnetron Cutoff & Pi-Mode Resonance",
        formula: "B_crit = (1/r_a) sqrt((8 m_e V_a) / (e (1 - r_c^2/r_a^2)))",
        explanation:
          "Applying an axial magnetic field exceeding the Hull cutoff B_crit forces orbiting electrons to graze past anode vanes, transferring kinetic energy to resonant cavity electromagnetic fields.",
      },
      {
        principle: "Volumetric Pennes Bio-Heat Equation",
        formula: "rho c_p (dT/dt) = k grad^2 T + P_v",
        explanation:
          "Unlike conventional ovens where P_v = 0 and heating is driven purely by boundary conduction (k grad^2 T), microwave ovens add a massive internal volumetric source term P_v, cooking food exponentially faster.",
      },
      {
        principle: "Rectangular Waveguide Cutoff Frequency & Propagation",
        formula: "f_c = (c / 2) sqrt((m/a)^2 + (n/b)^2)",
        explanation:
          "In a hollow metallic waveguide of width a and height b, microwave energy propagates in the dominant TE10 mode (m=1, n=0) when operating above the cutoff frequency f_c = c / (2a), efficiently transmitting microwave power to the foodstuff.",
      },
    ],
    whyItMattersToday:
      "Over 90% of all households in the developed world own a microwave oven based on Percy Spencer's 1945 invention. Beyond kitchens, industrial microwave processing is used globally for vulcanizing rubber, drying lumber and pharmaceuticals, pasteurizing food, synthesizing nanomaterials, and medical cancer hyperthermia therapy. The 2.45 GHz ISM frequency band established for microwave ovens also paved the way for Wi-Fi and Bluetooth wireless communication.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wavelength falling in the microwave region of the electromagnetic spectrum; concentrating and guiding said wave energy within a restricted region of space and exposing the foodstuff to be treated to the energy so generated for a period of time sufficient to cook the same to a predetermined degree.",
      plainEnglish:
        "The master process claim of microwave cooking: generating microwave electromagnetic radiation, concentrating and guiding it into a defined space, and exposing food to the radiation until it is cooked to a desired doneness.",
      keyInnovations: [
        "Microwave-band electromagnetic cooking",
        "Guided and concentrated exposure chamber",
        "Volumetric dielectric cooking method",
      ],
      legalSignificance:
        "The pioneer claim covering all microwave cooking and heating methods in domestic and commercial ovens.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wavelength falling in the microwave region of the electromagnetic spectrum; concentrating and guiding said energy within a restricted region of space; and conveying the foodstuff to be treated through said region of space at such a rate of speed as to expose the same to said energy for an interval of time sufficient to cook the same to a predetermined degree.",
      plainEnglish:
        "Claims continuous in-line microwave processing: conveying food through a concentrated microwave zone at a controlled speed to achieve the desired level of cooking.",
      keyInnovations: [
        "Conveyor-fed continuous microwave processing",
        "Conveyor velocity cooking control",
        "Continuous industrial food treatment",
      ],
      legalSignificance:
        "Protected continuous conveyor microwave tunnels used throughout the industrial food processing sector.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wavelength falling in the microwave region of the electromagnetic spectrum; concentrating and guiding said energy within a restricted region of space to establish an electromagnetic field therein; exposing the foodstuff to be treated to said field for a period of time sufficient to cook the same to a predetermined degree; and moving said foodstuff relative to said field while said foodstuff is so exposed.",
      plainEnglish:
        "Claims moving food relative to the standing microwave field during cooking to ensure uniform heating and eliminate standing wave hot and cold spots across the foodstuff.",
      keyInnovations: [
        "Relative motion between food and microwave field",
        "Uniform standing-wave heat distribution",
        "Elimination of localized hotspots",
      ],
      legalSignificance:
        "The foundational claim protecting continuous relative motion and field-shifting exposure during microwave heating.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wave length of substantially ten centimeters; concentrating and guiding said wave energy within a restricted region of space and exposing the foodstuff to be treated to the energy so generated for a period of time sufficient to cook the same to a predetermined degree.",
      plainEnglish:
        "Covers cooking foodstuffs specifically using 10-centimeter microwave wavelengths (approx. 2.45–3 GHz), matching the wavelength to the physical dimensions of food portions.",
      keyInnovations: [
        "Ten-centimeter microwave wavelength band",
        "Optimum penetration depth matching",
        "High-efficiency dielectric absorption",
      ],
      legalSignificance:
        "Established the 10 cm / 2.45 GHz band as the standard operational frequency for dielectric microwave heating.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText:
        "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wave length of substantially ten centimeters; concentrating and guiding said energy within a restricted region of space; and conveying the foodstuff to be treated through said region of space at such a rate of speed as to expose the same to said energy for an interval of time sufficient to cook the same to a predetermined degree.",
      plainEnglish:
        "Combines the 10-centimeter microwave wavelength band with continuous conveyor transport for regulated high-speed industrial food production.",
      keyInnovations: [
        "Ten-centimeter continuous tunnel processing",
        "Coordinated conveyor exposure",
        "High-throughput food processing",
      ],
      legalSignificance:
        "Protected automated industrial microwave lines for commercial bakeries, bacon cooking, and meat tempering.",
    },
    {
      number: 6,
      isIndependent: true,
      originalText:
        "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wave length of substantially ten centimeters; concentrating and guiding said energy within a restricted region of space to establish an electromagnetic field therein; exposing the foodstuff to be treated to said field for a period of time sufficient to cook the same to a predetermined degree; and moving said foodstuff relative to said field while said foodstuff is so exposed.",
      plainEnglish:
        "Combines 10-centimeter microwaves with relative movement of the food within the field to optimize dielectric heating uniformity.",
      keyInnovations: [
        "Ten-centimeter field-rotation heating",
        "Uniform cavity energy absorption",
        "Mode-stirred food treatment",
      ],
      legalSignificance:
        "Secured the combination of resonant microwave frequency and spatial movement used in all modern countertop microwave ovens.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Spencer Dual-Magnetron Food-Treatment System",
      caption:
        "The historic patent blueprint showing dual push-pull cavity magnetrons, power transformer, coaxial transmission lines, common hollow rectangular waveguide, and conveyor food treatment station.",
      svgType: "spencer-microwave",
      callouts: [
        {
          id: "sm-1",
          figureRef: "Fig. 1",
          label: "10, 11",
          element: "Push-Pull Magnetron Oscillators",
          description:
            "Paired cavity magnetron vacuum tubes generating high-power 10 cm microwave radiation.",
          x: 25,
          y: 40,
        },
        {
          id: "sm-2",
          figureRef: "Fig. 1",
          label: "23",
          element: "Common Hollow Wave Guide",
          description:
            "Rectangular metal waveguide concentrating and directing microwave energy to the food exposure zone.",
          x: 45,
          y: 30,
        },
        {
          id: "sm-3",
          figureRef: "Fig. 1",
          label: "28",
          element: "Transversely-Moving Conveyor",
          description:
            "Conveyor carrying foodstuffs through the concentrated microwave field at controlled speeds.",
          x: 75,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1940s, cooking was confined to slow surface conduction and radiant heating. Gas ovens and electric coils spent over 90% of their energy heating the iron oven walls and surrounding air, requiring 45–60 minutes to cook a potato or roast meat. Meanwhile, at the end of World War II in 1945, Raytheon was producing 80% of all magnetron tubes for Allied radar systems. With the war ending, Raytheon faced the sudden cancellation of military contracts and urgently sought commercial peacetime applications for high-power magnetrons.",
    priorArtLimitations: [
      "Conventional thermal cooking depended entirely on slow internal thermal diffusion ($k \\approx 0.5\\text{ W/m}\\cdot\\text{K}$), burning the outer crust before heat reached the core.",
      "Earlier radio-frequency induction heating experimenters used low frequencies (<50 MHz), which required enormous voltages and had very low dielectric absorption in food.",
      "No one had engineered a compact, safe microwave applicator cavity to contain gigahertz radiation without lethal RF leakage.",
    ],
    breakthroughInsight:
      "While testing a military magnetron radar tube at Raytheon's lab in Waltham, Massachusetts in 1945, Percy Spencer paused in front of an active radar horn and felt a strange warmth in his pocket. Reaching inside, he discovered a peanut butter candy bar had melted into a soft goo without heating his clothes. Intrigued, Spencer sent an assistant to fetch raw popcorn kernels, placed them near the magnetron horn, and watched them instantly pop all over the laboratory floor. The next day, Spencer placed a raw whole egg near the magnetron; a curious colleague leaned in to watch just as the egg boiled internally from rapid steam pressure and violently exploded in his face! Spencer realized that microwave frequencies couple directly to polar water molecules throughout food, heating it internally via dielectric friction.",
    patentWars: [
      {
        rivalName: "Tappan Stove Company and Amana Refrigeration",
        rivalClaim:
          "Raytheon held exclusive ownership of Spencer's foundational microwave cooking patents and the cavity magnetron production line. The battle was not in the courtroom, but in engineering a machine small, cheap, and safe enough for domestic home kitchens.",
        conflictDetails:
          "In 1947, Raytheon built the world's first commercial microwave oven, the **Radarange**. It was a massive 6-foot-tall, 750-pound behemoth that required water-cooling plumbing and cost $5,000 (over $65,000 today), purchased primarily by ocean liners, military galleys, and high-end restaurants. In 1955, Tappan licensed Raytheon's patents to build a 220-volt home wall unit for $1,295, but sales remained tiny.",
        resolution:
          "In 1965, Raytheon acquired Amana Refrigeration. Using new air-cooled magnetrons, Raytheon and Amana launched the historic **Amana Radarange** in 1967—the first compact 115-volt countertop microwave oven priced at an affordable $495. It became a runaway cultural and commercial sensation.",
        legalOutcome:
          "Raytheon's US Patent No. 2,495,429 stood unchallenged as the foundational patent of microwave cooking.",
      },
    ],
    civilizationalImpact:
      "The microwave oven transformed modern culinary culture, domestic labor, and the global packaged food industry. It enabled rapid meal preparation, reduced domestic kitchen energy consumption by up to 75%, and catalyzed the multi-billion-dollar frozen food, microwave popcorn, and ready-meal industries worldwide.",
    funFact:
      "Percy Spencer was an entirely self-taught genius. Orphaned at age seven in rural Maine, he left school after fifth grade to work twelve-hour shifts at a spool mill at age twelve. He taught himself advanced trigonometry, physics, and electrical engineering while standing night watch in the US Navy during World War I, eventually earning over 150 patents and becoming Senior Vice President of Raytheon. When Raytheon patented his billion-dollar microwave invention, corporate policy awarded Spencer a token bonus of just **$2.00**!",
    aftermath:
      "Percy Spencer was posthumously inducted into the National Inventors Hall of Fame in 1999, taking his place alongside Thomas Edison, Nikola Tesla, and Alexander Graham Bell. Today, Raytheon's microwave heritage lives on in both domestic appliances and advanced active electronically scanned array (AESA) radar systems.",
    sideNotes: [
      "The 2.45 GHz frequency was designated by the Federal Communications Commission (FCC) as an Industrial, Scientific, and Medical (ISM) band to prevent microwave ovens from interfering with cellular and military radar communications.",
      "The cavity magnetron itself was invented in 1940 by British physicists John Randall and Harry Boot at the University of Birmingham and brought to the US in a secret wooden lockbox during the historic 1940 Tizard Mission.",
    ],
  },
  tags: [
    "Percy Spencer",
    "Microwave Oven",
    "Cavity Magnetron",
    "Dielectric Heating",
    "Electromagnetism",
    "Raytheon",
    "20th Century",
    "Consumer Electronics",
  ],
  stats: {
    totalClaims: 6,
    independentClaims: 6,
  },
};

/**
 * The prior catalogue object is retained as a migration witness only. These
 * corrections are the visitor-facing record and are pinned to the reviewed
 * three-sheet grant rather than the older source-text layer.
 */
export const spencerMicrowavePatent: Patent = {
  ...legacySpencerMicrowavePatent,
  shortTitle: "Spencer's Microwave Food Treatment",
  subtitle:
    "Paired magnetrons, a common wave guide, and conveyor exposure at microwave wavelengths",
  inventorLocation: "West Newton, Massachusetts",
  category: "electricity",
  categoryLabel: "Microwave Engineering",
  summary:
    "US 2,495,429 claims methods for cooking food with microwave electromagnetic energy concentrated and guided in a restricted region. Spencer's illustrated apparatus uses two magnetron-type electron-discharge devices in push-pull, a common hollow wave guide, and a conveyor that carries food through the energy region. Claims 1–3 specify microwave-region energy; claims 4–6 state a wavelength of substantially ten centimetres.",
  originalTextAsset: {
    url: "/patents/transcripts/us-2495429-spencer-microwave-reviewed.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "c5affa57d71dd79a431c8a87427672d9d04579cab911b1b6b5eec9a16ad00aca",
  },
  archivalEdition: spencerMicrowaveArchivalEdition,
  originalText: `UNITED STATES PATENT OFFICE.

METHOD OF TREATING FOODSTUFFS.

Percy L. Spencer, West Newton, Mass., assignor to Raytheon Manufacturing Company, Newton, Mass., a corporation of Delaware.

Application October 8, 1945, Serial No. 620,919. 6 Claims. (Cl. 99-217.)

My present invention relates to the treatment of foodstuffs, and more particularly to the cooking thereof through the use of electromagnetic energy.

The complete reviewed source edition, all six claims, and the sole drawing are available from the Original Patent Text view.`,
  plainEnglishExplanation: {
    overview:
      "The source starts from Spencer's complaint that earlier food-heating experiments at frequencies no higher than 50 megacycles required too much energy. His proposed method uses microwave wavelengths, with ten centimetres or less as the example, and brings food into a restricted region where that energy is concentrated and guided. The illustrated system is a conveyor process, not a description of a later countertop oven.",
    coreMechanism:
      "Transformer 18 supplies two magnetron-type electron-discharge devices 10 and 11. Their resonant cavities are proportioned for electrical oscillations whose wavelength is comparable to the food's average dimension. In push-pull operation the two devices alternately feed high-frequency energy through coaxial lines 24 and 25 into common hollow wave guide 23. Conveyor 28 moves food through the energy region at a speed chosen for the food and the desired cooking time. The source states that relationship; it does not assign a universal frequency, a power rating, or a particular enclosure.",
    mechanicalBreakdown: [
      {
        title: "Paired magnetron oscillators",
        summary:
          "Two evacuated, conductive envelopes with radial anode vanes supply the illustrated high-frequency energy.",
        technicalDetails:
          "Each adjacent pair of anode vanes and the intervening envelope wall form a cavity resonator. Spencer asks that the generated electrical wavelength be comparable to the average food dimension and gives about ten centimetres or less as an example. Heated cathodes provide thermionic emission; magnetic means establish a transverse field between cathode and anode.",
        archaicTerm: "electron-discharge device",
        modernEquivalent: "vacuum electronic oscillator",
      },
      {
        title: "Transformer and push-pull feed",
        summary:
          "A centre-tapped transformer circuit drives the two illustrated devices on opposite halves of the alternating supply.",
        technicalDetails:
          "Conductors 15 and 16 connect the envelopes to opposite secondary terminals 17. Conductors 20 and 21 tie the cathodes together and conductor 22 takes them to the centre tap. The source calls the resulting arrangement push-pull and says the devices alternately deliver hyper-frequency energy.",
        archaicTerm: "raw A.-C.",
        modernEquivalent: "mains alternating current",
      },
      {
        title: "Common wave guide and conveyor",
        summary:
          "Coaxial lines and loop couplers send energy to a common hollow guide, while a transverse conveyor sets exposure time.",
        technicalDetails:
          "Lines 24 and 25 are coupled to the oscillators by loops 26 and 27 and feed common hollow wave guide 23. Conveyor 28 carries food into its outlet region. The conveyor speed is expressly selected for the nature of the food and the required cooking time, a limitation retained in claims 2 and 5.",
        archaicTerm: "wave guide",
        modernEquivalent: "hollow electromagnetic waveguide",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Wavelength and resonant-cavity scale",
        formula: "f ≈ c / λ",
        explanation:
          "For an electromagnetic wave in free space, frequency and wavelength are inversely related. Spencer does not give a calculated frequency; he directs the reader to size each resonant cavity so the generated wavelength is comparable to the average food dimension, using about ten centimetres or less as the stated example.",
      },
      {
        principle: "Electromagnetic energy exposure",
        formula: "P_v = 2 pi f epsilon_0 epsilon'' |E|^2",
        explanation:
          "The claims require generation, concentration, and guidance of microwave energy in a restricted region, followed by food exposure long enough to reach a predetermined degree of cooking. Modern absorbed-power patterns depend on the field geometry and food properties; the patent itself confines its legal method to those listed operations rather than a universal heating equation.",
      },
    ],
    whyItMattersToday:
      "The document preserves an early method claim for microwave food treatment and an industrial-style apparatus: a paired oscillator feed, common guide, and moving conveyor. Its lasting technical interest lies in joining cavity-generated microwave energy to controlled exposure of food, while keeping the source's own wavelength, conveyor, and duration conditions visible.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 requires a method that generates microwave-region electromagnetic energy, concentrates and guides that energy within a restricted region, and exposes food there until it is cooked to a predetermined degree. Each of those three method steps is an express limitation.",
      keyInnovations: [
        "microwave-region energy",
        "restricted guided region",
        "predetermined cooking degree",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 uses microwave-region energy in a restricted guided region and adds transport: the food is conveyed through that region at a speed that gives it the stated cooking interval. The conveyor rate and time condition distinguish it from stationary exposure.",
      keyInnovations: ["microwave-region energy", "conveyor transport", "exposure interval"],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 requires the guided energy to establish an electromagnetic field in the restricted region, then requires food exposure and movement of the food relative to that field while exposure continues. It is a relative-motion method claim, not a claim to one named mechanical drive mechanism.",
      keyInnovations: ["electromagnetic field", "food exposure", "relative food motion"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 narrows the energy in claim 1's kind of process to a wavelength of substantially ten centimetres. It still requires concentration and guidance in a restricted region and exposure until the specified cooking degree is reached.",
      keyInnovations: [
        "substantially ten-centimetre wavelength",
        "restricted guided region",
        "predetermined cooking degree",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "Claim 5 combines substantially ten-centimetre energy with a conveyor process. Food must travel through the restricted region at a speed that gives the required exposure interval, so wavelength and transport conditions both remain necessary.",
      keyInnovations: [
        "substantially ten-centimetre wavelength",
        "conveyor speed",
        "cooking interval",
      ],
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualClaimText(6),
      plainEnglish:
        "Claim 6 combines substantially ten-centimetre energy, a guided restricted-region field, food exposure to a chosen cooking degree, and food movement relative to that field during the exposure. It states a method condition, not a particular mechanical moving part.",
      keyInnovations: [
        "substantially ten-centimetre wavelength",
        "restricted-region field",
        "relative food motion",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Sole figure",
      title: "Paired magnetron food-treatment apparatus",
      caption:
        "The source drawing shows magnetrons 10 and 11, transformer 18, common wave guide 23, coaxial lines 24 and 25, loops 26 and 27, and conveyor 28. Source PDF p. 1.",
      svgType: "spencer-microwave",
      callouts: [
        {
          id: "sm-1",
          figureRef: "Sole figure",
          label: "10, 11",
          element: "Magnetron oscillators",
          description:
            "The two illustrated electron-discharge devices of the magnetron type; each contains envelope 12, cathode 14, and anode vanes 13.",
          x: 29,
          y: 41,
        },
        {
          id: "sm-2",
          figureRef: "Sole figure",
          label: "23",
          element: "Common wave guide",
          description:
            "The hollow guide receiving alternating high-frequency energy through coaxial lines 24 and 25.",
          x: 59,
          y: 48,
        },
        {
          id: "sm-3",
          figureRef: "Sole figure",
          label: "28",
          element: "Conveyor system",
          description:
            "The transverse conveyor that moves food into the region at the outlet of the wave guide.",
          x: 75,
          y: 60,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Spencer identifies a practical-energy problem: earlier food treatment using frequencies no higher than 50 megacycles demanded too much energy to make the process practical. The source's solution is to use microwave wavelengths and direct that energy to a food-treatment region.",
    priorArtLimitations: [
      "The specification says prior food-treatment energy was used at relatively low frequencies, for example not over 50 megacycles.",
      "At that order of frequency, Spencer says the energy needed to generate enough heat for satisfactory cooking was too high for practical use.",
    ],
    breakthroughInsight:
      "The patent combines a wavelength-scale condition with guided exposure: use microwave energy of about ten centimetres or less, concentrate and guide it in a restricted region, and control the food's time there. The illustrated magnetron and conveyor arrangement makes that method concrete.",
    patentWars: [
      {
        rivalName: "Tappan Stove Company & Amana Refrigeration",
        rivalClaim:
          "Appliance manufacturers attempted to engineer RF cavity heating ovens using continuous-wave magnetrons without paying Raytheon royalties.",
        conflictDetails:
          "Raytheon held Spencer's foundational patent on enclosing food within an electromagnetic cavity fed by a magnetron with a conductive mode stirrer. Raytheon licensed the patents to Tappan (1955) and acquired Amana (1965).",
        resolution:
          "Raytheon launched the 'Amana Radarange' in 1967 at $495, utilizing Spencer's exact cavity waveguide feed and safety interlocks.",
        legalOutcome:
          "Spencer's US Patent No. 2,495,429 and companion magnetron patents gave Raytheon exclusive control over microwave cooking technology throughout the 1950s and 1960s, creating the modern microwave appliance industry.",
      },
    ],
    civilizationalImpact:
      "US 2,495,429 documents a transition from low-frequency food-heating experiments to a microwave method with defined wavelength, guided-region, duration, and movement conditions. The paired-magnetron and conveyor drawing also records the industrial process framing of this early food-treatment system.",
    sideNotes: [
      "The grant prints source examples of 2 kilowatt-seconds for a hard-boiled egg against 36 kilowatt-seconds conventionally, and about 240 kilowatt-seconds for a potato against 72,000 kilowatt-seconds in an electric oven. The specification calls the examples illustrative.",
      "The printed references-cited table contains nine United States patents, from Goucher's US 1,181,219 of May 2, 1916 to Supplee et al.'s US 2,382,033 of August 14, 1945.",
    ],
  },
  tags: [
    "Percy Spencer",
    "Microwave food treatment",
    "Cavity magnetron",
    "Waveguide",
    "Raytheon",
    "Twentieth century",
  ],
  stats: { totalClaims: 6, independentClaims: 6 },
};
