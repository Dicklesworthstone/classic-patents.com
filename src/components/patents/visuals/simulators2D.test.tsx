import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { BardeenTransistorSim } from "./BardeenTransistorSim";
import { BellTelephoneSim } from "./BellTelephoneSim";
import { BoyleSmithCcdSim } from "./BoyleSmithCcdSim";
import { CarrierAirConditionerSim } from "./CarrierAirConditionerSim";
import { ColtRevolverSim } from "./ColtRevolverSim";
import { CorlissEngineSim } from "./CorlissEngineSim";
import { DaimlerEngineSim } from "./DaimlerEngineSim";
import { DavenportMotorSim } from "./DavenportMotorSim";
import { DeLavalSeparatorSim } from "./DeLavalSeparatorSim";
import { DieselEngineSim } from "./DieselEngineSim";
import { EastmanKodakSim } from "./EastmanKodakSim";
import { EdisonBulbSim } from "./EdisonBulbSim";
import { EdisonPhonographSim } from "./EdisonPhonographSim";
import { EinsteinRefrigeratorSim } from "./EinsteinRefrigeratorSim";
import { EngelbartMouseSim } from "./EngelbartMouseSim";
import { EricssonPropellerSim } from "./EricssonPropellerSim";
import { FarnsworthTVSim } from "./FarnsworthTVSim";
import { FermiReactorSim } from "./FermiReactorSim";
import { GatlingGunSim } from "./GatlingGunSim";
import { GliddenBarbedWireSim } from "./GliddenBarbedWireSim";
import { GoddardRocketSim } from "./GoddardRocketSim";
import { GoddardRocketSourceVisual } from "./GoddardRocketSourceVisual";
import { GoodyearRubberSim } from "./GoodyearRubberSim";
import { GrammeDynamoSim } from "./GrammeDynamoSim";
import { HollerithTabulatingSim } from "./HollerithTabulatingSim";
import { HoweSewingMachineSim } from "./HoweSewingMachineSim";
import { HyattCelluloidSim } from "./HyattCelluloidSim";
import { KwolekKevlarSim } from "./KwolekKevlarSim";
import { LamarrFrequencyHoppingSim } from "./LamarrFrequencyHoppingSim";
import { LincolnBuoySim } from "./LincolnBuoySim";
import { LindeAirLiquefactionSim } from "./LindeAirLiquefactionSim";
import { MarconiRadioSim } from "./MarconiRadioSim";
import { MaximMachineGunSim } from "./MaximMachineGunSim";
import { McCormickReaperSim } from "./McCormickReaperSim";
import { MergenthalerLinotypeSim } from "./MergenthalerLinotypeSim";
import { MorseTelegraphSim } from "./MorseTelegraphSim";
import { NobelDynamiteSim } from "./NobelDynamiteSim";
import { NoycePlanarICSim } from "./NoycePlanarICSim";
import { NoycePlanarSourceVisual } from "./NoycePlanarSourceVisual";
import { OtisElevatorSim } from "./OtisElevatorSim";
import { OttoEngineSim } from "./OttoEngineSim";
import { ParsonsTurbineSim } from "./ParsonsTurbineSim";
import { PasteurFermentationSim } from "./PasteurFermentationSim";
import { PeltonWheelSim } from "./PeltonWheelSim";
import { RenoEscalatorSim } from "./RenoEscalatorSim";
import { SholesTypewriterSim } from "./SholesTypewriterSim";
import { SourceVisualUnavailable } from "./SourceVisualUnavailable";
import { SpencerMicrowaveSim } from "./SpencerMicrowaveSim";
import { TeslaCoilSim } from "./TeslaCoilSim";
import { TeslaMotorSim } from "./TeslaMotorSim";
import { TeslaTeleautomatonSim } from "./TeslaTeleautomatonSim";
import { ThomsonWeldingSim } from "./ThomsonWeldingSim";
import { WestinghouseAirBrakeSim } from "./WestinghouseAirBrakeSim";
import { WhitneyCottonGinSim } from "./WhitneyCottonGinSim";
import { WozniakAppleSim } from "./WozniakAppleSim";
import { WrightFlyerSim } from "./WrightFlyerSim";
import { ZeppelinAirshipSim } from "./ZeppelinAirshipSim";

describe("2D Dynamic Vector Simulators & Source Visuals", () => {
  const activeSims = [
    { name: "Wright Flyer", comp: WrightFlyerSim },
    { name: "Whitney Cotton Gin", comp: WhitneyCottonGinSim },
    { name: "McCormick Reaper", comp: McCormickReaperSim },
    { name: "Colt Revolver", comp: ColtRevolverSim },
    { name: "Davenport Motor", comp: DavenportMotorSim },
    { name: "Ericsson Propeller", comp: EricssonPropellerSim },
    { name: "Morse Telegraph", comp: MorseTelegraphSim },
    { name: "Goodyear Rubber", comp: GoodyearRubberSim },
    { name: "Howe Sewing Machine", comp: HoweSewingMachineSim },
    { name: "Corliss Engine", comp: CorlissEngineSim },
    { name: "Lincoln Buoy", comp: LincolnBuoySim },
    { name: "Otis Elevator", comp: OtisElevatorSim },
    { name: "Gatling Gun", comp: GatlingGunSim },
    { name: "Nobel Dynamite", comp: NobelDynamiteSim },
    { name: "Sholes Typewriter", comp: SholesTypewriterSim },
    { name: "Hyatt Celluloid", comp: HyattCelluloidSim },
    { name: "Gramme Dynamo", comp: GrammeDynamoSim },
    { name: "Westinghouse Air Brake", comp: WestinghouseAirBrakeSim },
    { name: "Pasteur Fermentation", comp: PasteurFermentationSim },
    { name: "Glidden Barbed Wire", comp: GliddenBarbedWireSim },
    { name: "Bell Telephone", comp: BellTelephoneSim },
    { name: "Otto Engine", comp: OttoEngineSim },
    { name: "Edison Phonograph", comp: EdisonPhonographSim },
    { name: "Edison Bulb", comp: EdisonBulbSim },
    { name: "Pelton Wheel", comp: PeltonWheelSim },
    { name: "DeLaval Separator", comp: DeLavalSeparatorSim },
    { name: "Mergenthaler Linotype", comp: MergenthalerLinotypeSim },
    { name: "Maxim Machine Gun", comp: MaximMachineGunSim },
    { name: "Thomson Welding", comp: ThomsonWeldingSim },
    { name: "Daimler Engine", comp: DaimlerEngineSim },
    { name: "Tesla Motor", comp: TeslaMotorSim },
    { name: "Eastman Kodak", comp: EastmanKodakSim },
    { name: "Hollerith Tabulating", comp: HollerithTabulatingSim },
    { name: "Reno Escalator", comp: RenoEscalatorSim },
    { name: "Diesel Engine", comp: DieselEngineSim },
    { name: "Marconi Radio", comp: MarconiRadioSim },
    { name: "Parsons Turbine", comp: ParsonsTurbineSim },
    { name: "Tesla Coil", comp: TeslaCoilSim },
    { name: "Tesla Teleautomaton", comp: TeslaTeleautomatonSim },
    { name: "Zeppelin Airship", comp: ZeppelinAirshipSim },
    { name: "Linde Air Liquefaction", comp: LindeAirLiquefactionSim },
    { name: "Carrier Air Conditioner", comp: CarrierAirConditionerSim },
    { name: "Goddard Rocket", comp: GoddardRocketSim },
    { name: "Farnsworth TV", comp: FarnsworthTVSim },
    { name: "Einstein Refrigerator", comp: EinsteinRefrigeratorSim },
    { name: "Lamarr Frequency Hopping", comp: LamarrFrequencyHoppingSim },
    { name: "Spencer Microwave", comp: SpencerMicrowaveSim },
    { name: "Bardeen Transistor", comp: BardeenTransistorSim },
    { name: "Fermi Reactor", comp: FermiReactorSim },
    { name: "Noyce Planar IC", comp: NoycePlanarICSim },
    { name: "Engelbart Mouse", comp: EngelbartMouseSim },
    { name: "Kwolek Kevlar", comp: KwolekKevlarSim },
    { name: "Boyle Smith CCD", comp: BoyleSmithCcdSim },
    { name: "Wozniak Apple", comp: WozniakAppleSim },
  ];

  for (const { name, comp } of activeSims) {
    test(`renders 2D simulator for ${name} in SSR mode`, () => {
      const html = renderToStaticMarkup(React.createElement(comp));
      expect(typeof html).toBe("string");
      expect(html.length).toBeGreaterThan(0);
      expect(html).toContain("<svg");
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
