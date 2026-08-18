import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});

const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const DRAWING = {
  src: "/patents/figures/us-1781541-einstein-refrigerator/fig-1-source-crop-v1.png",
  alt: "Source-facsimile crop of the sole drawing sheet in US 1,781,541.",
  width: 2040,
  height: 2840,
} as const;

const drawingReference = (sourceText: string): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: "Open the source-facsimile drawing for US 1,781,541",
  figurePreviews: [DRAWING],
});

const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

/**
 * Continuous, manually prepared source edition of the four-page US 1,781,541
 * facsimile. It keeps the sole drawing as a local source crop and presents the
 * specification as one argument rather than a reconstruction of printed pages.
 */
export const einsteinRefrigeratorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "5b67c380be742776b9509862e68e1fc68478a7b1cc92f215ba422efbd76b96e4",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "ALBERT EINSTEIN, OF BERLIN, AND LEO SZILARD, OF BERLIN-WILMERSDORF, GERMANY, ASSIGNORS TO ELECTROLUX SERVEL CORPORATION, OF NEW YORK, N. Y., A CORPORATION OF DELAWARE.",
        "REFRIGERATION.",
        "Application filed December 16, 1927, Serial No. 240,566, and in Germany December 16, 1926.",
      ],
    },
    paragraph(
      text(
        "Our invention relates to the art of refrigeration and particularly to an apparatus and method for producing refrigeration wherein the refrigerant evaporates in the presence of an inert gas and more particularly to the type disclosed in Patent No. 1,685,764 granted September 25th, 1928, to Von Platen and Munters and our British Patent No. 282,428.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "The objects and advantages of our invention will be apparent from the following description considered in connection with the ",
      },
      drawingReference("accompanying drawing"),
      {
        kind: "text",
        text: ", which shows, more or less diagrammatically, a preferred embodiment of our invention.",
      },
    ]),
    paragraph([
      { kind: "text", text: "Referring to the " },
      drawingReference("drawing"),
      {
        kind: "text",
        text: ", reference character 1 designates an evaporator, which is ordinarily placed within a chamber to be cooled. A conduit 5 connects the upper part of evaporator 1 with the more intermediate portion of the condenser 6. A conduit 11 communicates with the bottom of evaporator 1 and extends within condenser 6 at a level below the point of communication of conduit 5 with the condenser. A cooling water jacket 12 surrounds the condenser and is adapted for the passage therethrough of water for the purpose of cooling the condenser.",
      },
    ]),
    paragraph(
      text(
        "A conduit 27 communicates with the bottom of condenser 6 and with the lower part of a heat exchanger jacket 28. The upper part of jacket 28 is connected to the lower part of generator 29. Generator 29 is heated in any suitable manner. A conduit 30 communicates with the upper part of generator 29 and extends within evaporator 1 to a point near the bottom thereof where it terminates in a distributor head 31. Conduit 30 extends within conduit 5 in order that the fluids passing through the respective conduits may be brought into heat exchange relationship with each other.",
      ),
    ),
    paragraph(
      text(
        "A conduit 32 extends upwardly from within the lower part of generator 29 and communicates with a container 33 placed at a level above that of condenser 6. A source of heat 36 is provided for heating conduit 32 at a point above generator 29. A conduit 37 extends downwardly from container 33 and passes within heat exchanger jacket 28 and thence upwardly to within the upper part of condenser 6 where it terminates in a distributor head 35. Conduit 37 passes within cooling water jacket 12 in order that fluid passing through this conduit may be cooled. A vent conduit 34 connects the upper part of container 33 with the upper part of condenser 6.",
      ),
    ),
    paragraph(text("The operation of the above described apparatus is as follows:")),
    paragraph([
      {
        kind: "text",
        text: "A suitable refrigerant, for instance butane, in liquid form is contained within evaporator 1. An ",
      },
      term(
        "inert gas",
        "Here, a gas that does not undergo the refrigeration liquid's phase-change role and is used to lower that liquid's partial pressure. The specification gives ammonia as its example.",
      ),
      {
        kind: "text",
        text: ", for instance ammonia, is introduced into evaporator 1 through conduit 30 and distributor head 31. The refrigerant evaporates in the evaporator in the presence of the inert gas due to the fact that the partial pressure of the refrigerant is reduced thereby and the resulting gaseous mixture passes through conduit 5 to within condenser 6. Here the mixture comes in intimate contact with an ",
      },
      term(
        "absorption liquid",
        "A liquid selected to dissolve the inert gas. The specification gives water as the example; this permits the cooling agent to separate and condense.",
      ),
      {
        kind: "text",
        text: ", for example water, which is introduced into the condenser through conduit 37 and distributor head 35. Inasmuch as the ammonia gas is very soluble in water, while the butane is quite insoluble, the ammonia gas is absorbed by the water, thus freeing the butane from the gaseous mixture. Thus the butane assumes substantially the entire pressure within the condenser, which pressure is sufficient to cause its liquefaction at the temperature maintained therein by the cooling water.",
      },
    ]),
    paragraph(
      text(
        "The specific gravity of liquid butane is less than that of the solution of ammonia in water and hence stratification of the two liquids occurs, the liquid butane floating upon the ammonia solution. The latter solution is indicated by reference character 26. The liquid butane passes from condenser 6 through conduit 11 and returns to evaporator 1, where it is again evaporated and the cycle repeated.",
      ),
    ),
    paragraph(
      text(
        "The ammonia solution flows by gravity from condenser 6 through conduit 27 and heat exchanger jacket 28 to within generator 29. Here the application of heat causes the ammonia to be expelled as a gas from the solution and this ammonia gas passes through conduit 30 and distributor head 31 to within evaporator 1, where it reduces the partial pressure of the butane, wherefore the latter evaporates as previously described.",
      ),
    ),
    paragraph(
      text(
        "Water, containing but little ammonia in solution, passes from generator 29 into conduit 32 where it is further heated by the source of heat 36. This heating causes the formation of vapor in conduit 32 which lifts liquid through this conduit to within container 33. The liquid thus supplied to container 33 may pass by gravity through conduit 37 to condenser 6. The hot weak liquid passing through conduit 37 is brought into heat exchange relationship with the cool strong liquid passing through heat exchanger jacket 28 and an exchange of heat between the two liquids takes place. The weak liquid is further cooled by being brought into heat exchange relation with the cooling water in jacket 12 and is hence in a condition to rapidly absorb ammonia in the condenser.",
      ),
    ),
    paragraph(
      text(
        "Vapor entering container 33 from conduit 32 passes therefrom through vent conduit 34 to the condenser.",
      ),
    ),
    paragraph(
      text(
        "During the operation of the hereinbefore described apparatus, the pressure existing in the various members is uniform with the exception of slight pressure differences, sufficient to cause flow of fluids, caused by liquid columns. The pressure existing in generator 29 must be sufficiently greater than that existing in the upper part of evaporator 1 to cause the flow of vapor to take place from distributor head 31, or, in other words, to overcome the liquid head designated by h₂. This excess pressure in the generator is balanced by the head exerted by the column of liquid equal to the differences in levels between the liquid in condenser 6 and generator 29, indicated by h₁. It is, of course, necessary that the head represented by h₂ is less than that represented by h₁ in order that flow shall take place.",
      ),
    ),
    paragraph(
      text(
        "While we have described a preferred embodiment for carrying out our invention, it is to be understood that modifications thereof fall within the scope of the invention, which is to be limited only by the appended claims viewed in the light of the prior art.",
      ),
    ),
    { kind: "heading", level: 2, text: "What we claim is:" },
    claim(
      1,
      "Refrigerating apparatus comprising a generator, a condenser arranged at a higher level than the generator, an evaporator, a container arranged at a higher level than the condenser, said generator containing an inert gas dissolved in absorption liquid and adapted to expel the inert gas from solution, a conduit for conducting the inert gas from the generator to the evaporator, a conduit for conducting liquid refrigerant from the condenser to the evaporator, a conduit for conducting mixed vapor of refrigerant and inert gas from the evaporator to the condenser in heat exchange relation with inert gas passing into the evaporator, a conduit for conducting rich absorption liquid from the condenser to the generator by gravity, a conduit for conducting weak absorption liquid from said container to said condenser by gravity, a conduit extending upwardly from said generator to said container and means to heat the last-mentioned conduit to lift liquid from the generator to the container.",
    ),
    claim(
      2,
      "Refrigerating apparatus comprising a generator, a condenser arranged at a higher level than the generator, an evaporator, a container arranged at a higher level than the condenser, said generator containing an inert gas dissolved in absorption liquid and adapted to expel the inert gas from solution, a conduit for conducting the inert gas from the generator to the evaporator, a conduit for conducting liquid refrigerant from the condenser to the evaporator, a conduit for conducting mixed vapor of refrigerant and inert gas from the evaporator to the condenser in heat exchange relation with inert gas passing into the evaporator, a conduit for conducting rich absorption liquid from the condenser to the generator by gravity, a conduit for conducting weak absorption liquid from said container to said condenser by gravity, a conduit extending upwardly from said generator to said container, means to heat the last-mentioned conduit to lift liquid from the generator to the container and a vent conduit connecting the upper part of said container with said condenser.",
    ),
    claim(
      3,
      "Refrigerating apparatus comprising a generator, a condenser arranged at a higher level than the generator, an evaporator, a container arranged at a higher level than the condenser, said generator containing ammonia dissolved in water and adapted to expel the ammonia from solution, a conduit for conducting the ammonia gas from the generator to the evaporator, a conduit for conducting liquid butane from the condenser to the evaporator, a conduit for conducting mixed vapor of butane and ammonia from the evaporator to the condenser in heat exchange relation with ammonia gas passing into the evaporator, a conduit for conducting strong solution of ammonia in water from the condenser to the generator by gravity, a conduit for conducting weak solution of ammonia in water from said container to said condenser by gravity, a conduit extending upwardly from said generator to said container and means to heat the last-mentioned conduit to lift liquid from the generator to the container.",
    ),
    claim(
      4,
      "Refrigerating apparatus comprising a generator, a condenser arranged at a higher level than the generator, an evaporator, a container arranged at a higher level than the condenser, said generator containing ammonia dissolved in water and adapted to expel the ammonia from solution, a conduit for conducting the ammonia gas from the generator to the evaporator, a conduit for conducting liquid butane from the condenser to the evaporator, a conduit for conducting mixed vapor of butane and ammonia from the evaporator to the condenser in heat exchange relation with ammonia gas passing into the evaporator, a conduit for conducting strong solution of ammonia in water from the condenser to the generator by gravity, a conduit for conducting weak solution of ammonia in water from said container to said condenser by gravity, a conduit extending upwardly from said generator to said container, means to heat the last-mentioned conduit to lift liquid from the generator to the container and a vent conduit connecting the upper part of said container with said condenser.",
    ),
    claim(
      5,
      "Method of refrigerating which comprises evaporating a liquid cooling agent in the presence of an inert gas to absorb heat and thus forming a gaseous mixture of cooling agent and inert gas, conveying the gaseous mixture into the presence of an absorption liquid at such condition that the cooling agent condenses on being deprived of inert gas in gaseous mixture therewith due to the introduction of absorption liquid into the presence of the inert gas, separating the solution of inert gas in absorption medium from the condensed cooling agent, returning the condensed cooling agent to the presence of the inert gas, separating the inert gas and absorption liquid by heat, circulating the absorption liquid by means of a separate source of heat to the presence of the gaseous mixture of cooling agent and inert gas and returning the inert gas to the presence of the liquid cooling agent.",
    ),
    paragraph(text("In testimony whereof we hereunto affix our signatures.")),
    paragraph([{ kind: "small-caps", text: "ALBERT EINSTEIN." }]),
    paragraph([{ kind: "small-caps", text: "LEO SZILARD." }]),
  ],
};

/** A source-paragraph-by-source-paragraph engineering reading, not a summary. */
export const einsteinRefrigeratorParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Einstein and Szilard place this apparatus in the absorption-refrigeration family. They expressly cite Von Platen and Munters' US 1,685,764 and their own British Patent 282,428; the patent does not present the general use of an inert gas as invented from nothing.",
  ],
  2: [
    "The accompanying drawing is an explanatory diagram of a preferred arrangement. It identifies the particular vessel and conduit layout used in the following description; it is not a claim by itself.",
  ],
  3: [
    "Evaporator 1 sits in the space to be cooled. Conduit 5 carries vapor from its upper part toward condenser 6, while conduit 11 returns condensed liquid from the condenser at a lower level. Water jacket 12 removes heat from condenser 6.",
  ],
  4: [
    "Condenser 6 feeds the lower part of heat-exchanger jacket 28 through conduit 27. The jacket leads to generator 29. Heated generator 29 sends gas through conduit 30 to distributor 31 near the bottom of evaporator 1; conduit 30 runs inside conduit 5 so the opposing streams exchange heat.",
  ],
  5: [
    "A separate heated riser, conduit 32, lifts liquid from generator 29 to elevated container 33. From there conduit 37 descends through heat exchanger 28, then rises to distributor 35 in condenser 6; it also crosses water jacket 12. Vent 34 carries vapor from container 33 to the condenser.",
  ],
  6: [
    "The document now traces one complete circulation cycle. It is a description of the illustrated arrangement, not a permission to supply unprinted pressures, temperatures, or compressor parts.",
  ],
  7: [
    "Liquid butane in evaporator 1 is mixed with ammonia delivered through conduit 30. The ammonia lowers butane's partial pressure, so butane evaporates. The vapor mixture travels through conduit 5 to condenser 6, where water introduced through conduit 37 dissolves ammonia far more readily than butane. The freed butane then carries most of the condenser pressure and condenses under cooling-water heat removal.",
  ],
  8: [
    "Butane is less dense than the ammonia-water solution, so it floats above it in condenser 6. The butane layer returns by conduit 11 to evaporator 1, where the lower partial pressure causes it to evaporate again.",
  ],
  9: [
    "The ammonia-rich water flows by gravity through conduit 27 and heat-exchanger jacket 28 into generator 29. Applied heat expels ammonia gas, which returns through conduit 30 to lower butane's partial pressure in evaporator 1. This paragraph completes the gas-and-liquid separation loop.",
  ],
  10: [
    "Water leaving generator 29 with little ammonia is the weak absorption liquid. Heat at 36 makes vapor in riser 32, lifting that liquid to container 33 without a mechanically driven pump. It descends through 37, exchanges heat with the cool strong liquid in jacket 28, is cooled again by jacket 12, and arrives at condenser 6 able to absorb ammonia quickly.",
  ],
  11: [
    "Any vapor that enters container 33 through riser 32 does not stay there: vent conduit 34 returns it to condenser 6.",
  ],
  12: [
    "The apparatus is nearly, not perfectly, uniform in pressure. Liquid columns create the small differences that drive flow. Generator 29 must exceed the upper evaporator pressure enough to overcome head h₂; the elevation difference represented by h₁ balances that excess. The stated operating requirement is h₂ less than h₁.",
  ],
  13: [
    "They identify the shown apparatus as a preferred form and reserve ordinary variations. The legal boundary is the five printed claims read against the prior art, not an unrestricted promise covering every absorption refrigerator.",
  ],
  20: [
    "This line records that both named inventors execute the specification. It does not add a technical limitation.",
  ],
  21: ["Albert Einstein is one of the two signing inventors printed on the grant."],
  22: ["Leo Szilard is the second signing inventor printed on the grant."],
};
