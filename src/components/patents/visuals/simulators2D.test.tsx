import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ArkwrightWaterFrameSim } from "./ArkwrightWaterFrameSim";
import { BaekelandBakeliteSim } from "./BaekelandBakeliteSim";
import { BardeenTransistorSim } from "./BardeenTransistorSim";
import { BellPhotophoneSim } from "./BellPhotophoneSim";
import { BellTelephoneSim } from "./BellTelephoneSim";
import { BoyleSmithCcdSim } from "./BoyleSmithCcdSim";
import { CarlsonElectrophotographySim } from "./CarlsonElectrophotographySim";
import { CarrierAirConditionerSim } from "./CarrierAirConditionerSim";
import { ColtRevolverSim } from "./ColtRevolverSim";
import { CorlissEngineSim } from "./CorlissEngineSim";
import { CortPuddlingRollingSim } from "./CortPuddlingRollingSim";
import { DaimlerEngineSim } from "./DaimlerEngineSim";
import { DaVinciSim } from "./DaVinciSim";
import { DavenportMotorSim } from "./DavenportMotorSim";
import { DeLavalSeparatorSim } from "./DeLavalSeparatorSim";
import { DieselEngineSim } from "./DieselEngineSim";
import { EastmanKodakSim } from "./EastmanKodakSim";
import { EdisonBulbSim } from "./EdisonBulbSim";
import EdisonIndicatorSim from "./EdisonIndicatorSim";
import { EdisonPhonographSim } from "./EdisonPhonographSim";
import { EInkSim } from "./EInkSim";
import { EinsteinRefrigeratorSim } from "./EinsteinRefrigeratorSim";
import { EngelbartMouseSim } from "./EngelbartMouseSim";
import { EricssonPropellerSim } from "./EricssonPropellerSim";
import { FarnsworthTVSim } from "./FarnsworthTVSim";
import { FermiReactorSim } from "./FermiReactorSim";
import { FessendenWirelessSim } from "./FessendenWirelessSim";
import { GatlingGunSim } from "./GatlingGunSim";
import { GliddenBarbedWireSim } from "./GliddenBarbedWireSim";
import { GoddardRocketSim } from "./GoddardRocketSim";
import { GoddardRocketSourceVisual } from "./GoddardRocketSourceVisual";
import { GoodyearRubberSim } from "./GoodyearRubberSim";
import { GrammeDynamoSim } from "./GrammeDynamoSim";
import { HaberAmmoniaSim } from "./HaberAmmoniaSim";
import { HallAluminiumSim } from "./HallAluminiumSim";
import { HewittMercuryLampSim } from "./HewittMercuryLampSim";
import { HollerithTabulatingSim } from "./HollerithTabulatingSim";
import { HopkinsPotashSim } from "./HopkinsPotashSim";
import { HoweSewingMachineSim } from "./HoweSewingMachineSim";
import { HyattCelluloidSim } from "./HyattCelluloidSim";
import { KilbyIntegratedCircuitSim } from "./KilbyIntegratedCircuitSim";
import { KwolekKevlarSim } from "./KwolekKevlarSim";
import { LamarrFrequencyHoppingSim } from "./LamarrFrequencyHoppingSim";
import { LandPolaroidSim } from "./LandPolaroidSim";
import { LincolnBuoySim } from "./LincolnBuoySim";
import { LindeAirLiquefactionSim } from "./LindeAirLiquefactionSim";
import { MaimanRubyLaserSim } from "./MaimanRubyLaserSim";
import { MarconiRadioSim } from "./MarconiRadioSim";
import { MaximMachineGunSim } from "./MaximMachineGunSim";
import { McCormickReaperSim } from "./McCormickReaperSim";
import { MergenthalerLinotypeSim } from "./MergenthalerLinotypeSim";
import { MorseTelegraphSim } from "./MorseTelegraphSim";
import { MultiTouchSim } from "./MultiTouchSim";
import { NobelDynamiteSim } from "./NobelDynamiteSim";
import { NoycePlanarICSim } from "./NoycePlanarICSim";
import { NoycePlanarSourceVisual } from "./NoycePlanarSourceVisual";
import { OtisElevatorSim } from "./OtisElevatorSim";
import { OttoEngineSim } from "./OttoEngineSim";
import { PageRankSim } from "./PageRankSim";
import { ParsonsTurbineSim } from "./ParsonsTurbineSim";
import { PasteurFermentationSim } from "./PasteurFermentationSim";
import { PeltonWheelSim } from "./PeltonWheelSim";
import { RenoEscalatorSim } from "./RenoEscalatorSim";
import { RillieuxEvaporatorSim } from "./RillieuxEvaporatorSim";
import { RoombaSim } from "./RoombaSim";
import { SholesTypewriterSim } from "./SholesTypewriterSim";
import { SourceVisualUnavailable } from "./SourceVisualUnavailable";
import { SpencerMicrowaveSim } from "./SpencerMicrowaveSim";
import { TeslaCoilSim } from "./TeslaCoilSim";
import { TeslaMotorSim } from "./TeslaMotorSim";
import { TeslaTeleautomatonSim } from "./TeslaTeleautomatonSim";
import { ThomsonWeldingSim } from "./ThomsonWeldingSim";
import { TownesLaserSim } from "./TownesLaserSim";
import { WattRotaryEngineSim } from "./WattRotaryEngineSim";
import { WattSeparateCondenserSim } from "./WattSeparateCondenserSim";
import { WestinghouseAirBrakeSim } from "./WestinghouseAirBrakeSim";
import { WhitneyCottonGinSim } from "./WhitneyCottonGinSim";
import { WozniakAppleSim } from "./WozniakAppleSim";
import { WrightFlyerSim } from "./WrightFlyerSim";
import { YaleLockSim } from "./YaleLockSim";
import { ZeppelinAirshipSim } from "./ZeppelinAirshipSim";

describe("2D Dynamic Vector Simulators & Source Visuals", () => {
  const activeSims = [
    { name: "Arkwright Water Frame", comp: ArkwrightWaterFrameSim },
    { name: "Baekeland Bakelite", comp: BaekelandBakeliteSim },
    { name: "Bardeen Transistor", comp: BardeenTransistorSim },
    { name: "Bell Photophone", comp: BellPhotophoneSim },
    { name: "Bell Telephone", comp: BellTelephoneSim },
    { name: "Boyle Smith Ccd", comp: BoyleSmithCcdSim },
    { name: "Carlson Electrophotography", comp: CarlsonElectrophotographySim },
    { name: "Carrier Air Conditioner", comp: CarrierAirConditionerSim },
    { name: "Colt Revolver", comp: ColtRevolverSim },
    { name: "Corliss Engine", comp: CorlissEngineSim },
    { name: "Cort Puddling Rolling", comp: CortPuddlingRollingSim },
    { name: "Daimler Engine", comp: DaimlerEngineSim },
    { name: "Da Vinci", comp: DaVinciSim },
    { name: "Davenport Motor", comp: DavenportMotorSim },
    { name: "De Laval Separator", comp: DeLavalSeparatorSim },
    { name: "Diesel Engine", comp: DieselEngineSim },
    { name: "Eastman Kodak", comp: EastmanKodakSim },
    { name: "Edison Bulb", comp: EdisonBulbSim },
    { name: "Edison Indicator", comp: EdisonIndicatorSim },
    { name: "Edison Phonograph", comp: EdisonPhonographSim },
    { name: "E Ink", comp: EInkSim },
    { name: "Einstein Refrigerator", comp: EinsteinRefrigeratorSim },
    { name: "Engelbart Mouse", comp: EngelbartMouseSim },
    { name: "Ericsson Propeller", comp: EricssonPropellerSim },
    { name: "Farnsworth T V", comp: FarnsworthTVSim },
    { name: "Fermi Reactor", comp: FermiReactorSim },
    { name: "Fessenden Wireless", comp: FessendenWirelessSim },
    { name: "Gatling Gun", comp: GatlingGunSim },
    { name: "Glidden Barbed Wire", comp: GliddenBarbedWireSim },
    { name: "Goddard Rocket", comp: GoddardRocketSim },
    { name: "Goodyear Rubber", comp: GoodyearRubberSim },
    { name: "Gramme Dynamo", comp: GrammeDynamoSim },
    { name: "Haber Ammonia", comp: HaberAmmoniaSim },
    { name: "Hall Aluminium", comp: HallAluminiumSim },
    { name: "Hewitt Mercury Lamp", comp: HewittMercuryLampSim },
    { name: "Hollerith Tabulating", comp: HollerithTabulatingSim },
    { name: "Hopkins Potash", comp: HopkinsPotashSim },
    { name: "Howe Sewing Machine", comp: HoweSewingMachineSim },
    { name: "Hyatt Celluloid", comp: HyattCelluloidSim },
    { name: "Kilby Integrated Circuit", comp: KilbyIntegratedCircuitSim },
    { name: "Kwolek Kevlar", comp: KwolekKevlarSim },
    { name: "Lamarr Frequency Hopping", comp: LamarrFrequencyHoppingSim },
    { name: "Land Polaroid", comp: LandPolaroidSim },
    { name: "Lincoln Buoy", comp: LincolnBuoySim },
    { name: "Linde Air Liquefaction", comp: LindeAirLiquefactionSim },
    { name: "Maiman Ruby Laser", comp: MaimanRubyLaserSim },
    { name: "Marconi Radio", comp: MarconiRadioSim },
    { name: "Maxim Machine Gun", comp: MaximMachineGunSim },
    { name: "Mc Cormick Reaper", comp: McCormickReaperSim },
    { name: "Mergenthaler Linotype", comp: MergenthalerLinotypeSim },
    { name: "Morse Telegraph", comp: MorseTelegraphSim },
    { name: "Multi Touch", comp: MultiTouchSim },
    { name: "Nobel Dynamite", comp: NobelDynamiteSim },
    { name: "Noyce Planar I C", comp: NoycePlanarICSim },
    { name: "Otis Elevator", comp: OtisElevatorSim },
    { name: "Otto Engine", comp: OttoEngineSim },
    { name: "Page Rank", comp: PageRankSim },
    { name: "Parsons Turbine", comp: ParsonsTurbineSim },
    { name: "Pasteur Fermentation", comp: PasteurFermentationSim },
    { name: "Pelton Wheel", comp: PeltonWheelSim },
    { name: "Reno Escalator", comp: RenoEscalatorSim },
    { name: "Rillieux Evaporator", comp: RillieuxEvaporatorSim },
    { name: "Roomba", comp: RoombaSim },
    { name: "Sholes Typewriter", comp: SholesTypewriterSim },
    { name: "Spencer Microwave", comp: SpencerMicrowaveSim },
    { name: "Tesla Coil", comp: TeslaCoilSim },
    { name: "Tesla Motor", comp: TeslaMotorSim },
    { name: "Tesla Teleautomaton", comp: TeslaTeleautomatonSim },
    { name: "Thomson Welding", comp: ThomsonWeldingSim },
    { name: "Townes Laser", comp: TownesLaserSim },
    { name: "Watt Rotary Engine", comp: WattRotaryEngineSim },
    { name: "Watt Separate Condenser", comp: WattSeparateCondenserSim },
    { name: "Westinghouse Air Brake", comp: WestinghouseAirBrakeSim },
    { name: "Whitney Cotton Gin", comp: WhitneyCottonGinSim },
    { name: "Wozniak Apple", comp: WozniakAppleSim },
    { name: "Wright Flyer", comp: WrightFlyerSim },
    { name: "Yale Lock", comp: YaleLockSim },
    { name: "Zeppelin Airship", comp: ZeppelinAirshipSim },
  ];

  for (const { name, comp } of activeSims) {
    test(`renders 2D simulator for ${name} in SSR mode`, () => {
      const html = renderToStaticMarkup(React.createElement(comp));
      expect(typeof html).toBe("string");
      expect(html.length).toBeGreaterThan(0);
      expect(html.includes("<svg") || html.includes("<canvas") || html.includes("<div")).toBe(true);
    });
  }

  test("renders source visuals gracefully in SSR mode", () => {
    const goddardHtml = renderToStaticMarkup(<GoddardRocketSourceVisual />);
    expect(goddardHtml.length).toBeGreaterThan(0);

    const noyceHtml = renderToStaticMarkup(<NoycePlanarSourceVisual />);
    expect(noyceHtml.length).toBeGreaterThan(0);
  });

  test("renders SourceVisualUnavailable placeholder gracefully", () => {
    const html = renderToStaticMarkup(
      <SourceVisualUnavailable
        title="Sample Withheld Instrument"
        detail="Detailed evidence statement for withheld status."
      />,
    );
    expect(html).toContain("Sample Withheld Instrument");
    expect(html).toContain("Detailed evidence statement for withheld status.");
  });
});
