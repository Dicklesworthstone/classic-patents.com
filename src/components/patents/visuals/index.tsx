"use client";

import { Box, Layers } from "lucide-react";
import { useState } from "react";

// 2D Vector Schematics & Dynamic Simulators
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
import { OtisElevatorSim } from "./OtisElevatorSim";
import { OttoEngineSim } from "./OttoEngineSim";
import { ParsonsTurbineSim } from "./ParsonsTurbineSim";
import { PasteurFermentationSim } from "./PasteurFermentationSim";
import { PeltonWheelSim } from "./PeltonWheelSim";
import { RenoEscalatorSim } from "./RenoEscalatorSim";
import { SholesTypewriterSim } from "./SholesTypewriterSim";
import { SpencerMicrowaveSim } from "./SpencerMicrowaveSim";
import { TeslaCoilSim } from "./TeslaCoilSim";
import { TeslaMotorSim } from "./TeslaMotorSim";
import { TeslaTeleautomatonSim } from "./TeslaTeleautomatonSim";
import { ThomsonWeldingSim } from "./ThomsonWeldingSim";
// 3D WebGL Physics Simulators
import { BardeenTransistor3D } from "./three/BardeenTransistor3D";
import { BellTelephone3D } from "./three/BellTelephone3D";
import { BoyleSmithCcd3D } from "./three/BoyleSmithCcd3D";
import { CarrierAirConditioner3D } from "./three/CarrierAirConditioner3D";
import { ColtRevolver3D } from "./three/ColtRevolver3D";
import { CorlissSteamEngine3D } from "./three/CorlissSteamEngine3D";
import { DaimlerEngine3D } from "./three/DaimlerEngine3D";
import { DavenportElectricMotor3D } from "./three/DavenportElectricMotor3D";
import { DeLavalSeparator3D } from "./three/DeLavalSeparator3D";
import { DieselEngine3D } from "./three/DieselEngine3D";
import { EastmanKodak3D } from "./three/EastmanKodak3D";
import { EdisonBulb3D } from "./three/EdisonBulb3D";
import { EdisonPhonograph3D } from "./three/EdisonPhonograph3D";
import { EinsteinRefrigerator3D } from "./three/EinsteinRefrigerator3D";
import { EngelbartMouse3D } from "./three/EngelbartMouse3D";
import { EricssonPropeller3D } from "./three/EricssonPropeller3D";
import { FarnsworthTV3D } from "./three/FarnsworthTV3D";
import { FermiReactor3D } from "./three/FermiReactor3D";
import { GatlingGun3D } from "./three/GatlingGun3D";
import { GliddenBarbedWire3D } from "./three/GliddenBarbedWire3D";
import { GoddardRocket3D } from "./three/GoddardRocket3D";
import { GoodyearRubber3D } from "./three/GoodyearRubber3D";
import { GrammeDynamo3D } from "./three/GrammeDynamo3D";
import { HollerithTabulating3D } from "./three/HollerithTabulating3D";
import { HoweSewingMachine3D } from "./three/HoweSewingMachine3D";
import { HyattCelluloid3D } from "./three/HyattCelluloid3D";
import { KwolekKevlar3D } from "./three/KwolekKevlar3D";
import { LamarrFrequencyHopping3D } from "./three/LamarrFrequencyHopping3D";
import { LincolnBuoy3D } from "./three/LincolnBuoy3D";
import { LindeAirLiquefaction3D } from "./three/LindeAirLiquefaction3D";
import { MarconiRadio3D } from "./three/MarconiRadio3D";
import { MaximMachineGun3D } from "./three/MaximMachineGun3D";
import { McCormickReaper3D } from "./three/McCormickReaper3D";
import { MergenthalerLinotype3D } from "./three/MergenthalerLinotype3D";
import { MorseTelegraph3D } from "./three/MorseTelegraph3D";
import { NobelDynamite3D } from "./three/NobelDynamite3D";
import { NoycePlanarIC3D } from "./three/NoycePlanarIC3D";
import { OtisElevator3D } from "./three/OtisElevator3D";
import { OttoEngine3D } from "./three/OttoEngine3D";
import { ParsonsTurbine3D } from "./three/ParsonsTurbine3D";
import { PasteurFermentation3D } from "./three/PasteurFermentation3D";
import { PeltonWheel3D } from "./three/PeltonWheel3D";
import { RenoEscalator3D } from "./three/RenoEscalator3D";
import { SholesTypewriter3D } from "./three/SholesTypewriter3D";
import { SpencerMicrowave3D } from "./three/SpencerMicrowave3D";
import { TeslaCoil3D } from "./three/TeslaCoil3D";
import { TeslaMotor3D } from "./three/TeslaMotor3D";
import { TeslaTeleautomaton3D } from "./three/TeslaTeleautomaton3D";
import { ThomsonWelding3D } from "./three/ThomsonWelding3D";
import { WestinghouseAirBrake3D } from "./three/WestinghouseAirBrake3D";
import { WhitneyCottonGin3D } from "./three/WhitneyCottonGin3D";
import { WozniakApple3D } from "./three/WozniakApple3D";
import { WrightFlyer3D } from "./three/WrightFlyer3D";
import { ZeppelinAirship3D } from "./three/ZeppelinAirship3D";
import { WestinghouseAirBrakeSim } from "./WestinghouseAirBrakeSim";
import { WhitneyCottonGinSim } from "./WhitneyCottonGinSim";
import { WozniakAppleSim } from "./WozniakAppleSim";
import { WrightFlyerSim } from "./WrightFlyerSim";
import { ZeppelinAirshipSim } from "./ZeppelinAirshipSim";

interface PatentVisualDispatcherProps {
  patentId: string;
}

export function PatentVisualDispatcher({ patentId }: PatentVisualDispatcherProps) {
  const [renderMode, setRenderMode] = useState<"3d-physics" | "vector-diagram">("3d-physics");

  return (
    <div className="space-y-4">
      {/* 3D vs 2D Toggle Switcher */}
      <div className="flex justify-end">
        <div className="flex items-center gap-1 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs sm:text-sm font-sans shadow-sm">
          <button
            type="button"
            onClick={() => setRenderMode("3d-physics")}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg transition-colors ${
              renderMode === "3d-physics"
                ? "bg-amber-700 text-white font-bold shadow dark:bg-amber-600"
                : "text-ink-700 dark:text-parchment-300 hover:text-ink-950 font-medium"
            }`}
          >
            <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>3D Engine</span>
          </button>
          <button
            type="button"
            onClick={() => setRenderMode("vector-diagram")}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg transition-colors ${
              renderMode === "vector-diagram"
                ? "bg-amber-700 text-white font-bold shadow dark:bg-amber-600"
                : "text-ink-700 dark:text-parchment-300 hover:text-ink-950 font-medium"
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>2D Schematic</span>
          </button>
        </div>
      </div>

      {/* Render Specific Dynamic Simulation */}
      {(() => {
        switch (patentId) {
          // Pre-1920 New Additions
          case "us-x72-whitney-cotton-gin":
            return renderMode === "3d-physics" ? <WhitneyCottonGin3D /> : <WhitneyCottonGinSim />;
          case "us-x8277-mccormick-reaper":
          case "us-4895-mccormick-reaper":
            return renderMode === "3d-physics" ? <McCormickReaper3D /> : <McCormickReaperSim />;
          case "us-138-colt-revolver":
            return renderMode === "3d-physics" ? <ColtRevolver3D /> : <ColtRevolverSim />;
          case "us-132-davenport-electric-motor":
            return renderMode === "3d-physics" ? (
              <DavenportElectricMotor3D />
            ) : (
              <DavenportMotorSim />
            );
          case "us-588-ericsson-propeller":
            return renderMode === "3d-physics" ? <EricssonPropeller3D /> : <EricssonPropellerSim />;
          case "us-6162-corliss-steam-engine":
            return renderMode === "3d-physics" ? <CorlissSteamEngine3D /> : <CorlissEngineSim />;
          case "us-31128-otis-elevator":
            return renderMode === "3d-physics" ? <OtisElevator3D /> : <OtisElevatorSim />;
          case "us-36836-gatling-gun":
            return renderMode === "3d-physics" ? <GatlingGun3D /> : <GatlingGunSim />;
          case "us-78317-nobel-dynamite":
            return renderMode === "3d-physics" ? <NobelDynamite3D /> : <NobelDynamiteSim />;
          case "us-79265-sholes-typewriter":
            return renderMode === "3d-physics" ? <SholesTypewriter3D /> : <SholesTypewriterSim />;
          case "us-105338-hyatt-celluloid":
            return renderMode === "3d-physics" ? <HyattCelluloid3D /> : <HyattCelluloidSim />;
          case "us-120057-gramme-dynamo":
            return renderMode === "3d-physics" ? <GrammeDynamo3D /> : <GrammeDynamoSim />;
          case "us-124404-westinghouse-air-brake":
            return renderMode === "3d-physics" ? (
              <WestinghouseAirBrake3D />
            ) : (
              <WestinghouseAirBrakeSim />
            );
          case "us-135245-pasteur-fermentation":
            return renderMode === "3d-physics" ? (
              <PasteurFermentation3D />
            ) : (
              <PasteurFermentationSim />
            );
          case "us-157124-glidden-barbed-wire":
            return renderMode === "3d-physics" ? <GliddenBarbedWire3D /> : <GliddenBarbedWireSim />;
          case "us-194047-otto-engine":
            return renderMode === "3d-physics" ? <OttoEngine3D /> : <OttoEngineSim />;
          case "us-200521-edison-phonograph":
            return renderMode === "3d-physics" ? <EdisonPhonograph3D /> : <EdisonPhonographSim />;
          case "us-233692-pelton-water-wheel":
            return renderMode === "3d-physics" ? <PeltonWheel3D /> : <PeltonWheelSim />;
          case "us-247804-delaval-separator":
            return renderMode === "3d-physics" ? <DeLavalSeparator3D /> : <DeLavalSeparatorSim />;
          case "us-313224-mergenthaler-linotype":
            return renderMode === "3d-physics" ? (
              <MergenthalerLinotype3D />
            ) : (
              <MergenthalerLinotypeSim />
            );
          case "us-319596-maxim-machine-gun":
            return renderMode === "3d-physics" ? <MaximMachineGun3D /> : <MaximMachineGunSim />;
          case "us-347140-thomson-welding":
            return renderMode === "3d-physics" ? <ThomsonWelding3D /> : <ThomsonWeldingSim />;
          case "us-361931-daimler-engine":
            return renderMode === "3d-physics" ? <DaimlerEngine3D /> : <DaimlerEngineSim />;
          case "us-388850-eastman-kodak":
            return renderMode === "3d-physics" ? <EastmanKodak3D /> : <EastmanKodakSim />;
          case "us-395781-hollerith-tabulating":
            return renderMode === "3d-physics" ? (
              <HollerithTabulating3D />
            ) : (
              <HollerithTabulatingSim />
            );
          case "us-470918-reno-escalator":
            return renderMode === "3d-physics" ? <RenoEscalator3D /> : <RenoEscalatorSim />;
          case "us-542846-diesel-engine":
            return renderMode === "3d-physics" ? <DieselEngine3D /> : <DieselEngineSim />;
          case "us-608969-parsons-turbine":
            return renderMode === "3d-physics" ? <ParsonsTurbine3D /> : <ParsonsTurbineSim />;
          case "us-613809-tesla-teleautomaton":
            return renderMode === "3d-physics" ? (
              <TeslaTeleautomaton3D />
            ) : (
              <TeslaTeleautomatonSim />
            );
          case "us-621195-zeppelin-airship":
            return renderMode === "3d-physics" ? <ZeppelinAirship3D /> : <ZeppelinAirshipSim />;
          case "us-727650-linde-air-liquefaction":
            return renderMode === "3d-physics" ? (
              <LindeAirLiquefaction3D />
            ) : (
              <LindeAirLiquefactionSim />
            );
          case "us-808897-carrier-air-conditioner":
            return renderMode === "3d-physics" ? (
              <CarrierAirConditioner3D />
            ) : (
              <CarrierAirConditionerSim />
            );

          // 20th Century Pioneers
          case "us-821393-wright-flyer":
            return renderMode === "3d-physics" ? <WrightFlyer3D /> : <WrightFlyerSim />;
          case "us-381968-tesla-motor":
            return renderMode === "3d-physics" ? <TeslaMotor3D /> : <TeslaMotorSim />;
          case "us-1773980-farnsworth-tv":
            return renderMode === "3d-physics" ? <FarnsworthTV3D /> : <FarnsworthTVSim />;
          case "us-2495429-spencer-microwave":
            return renderMode === "3d-physics" ? <SpencerMicrowave3D /> : <SpencerMicrowaveSim />;
          case "us-2981877-noyce-ic":
            return renderMode === "3d-physics" ? <NoycePlanarIC3D /> : <NoycePlanarICSim />;
          case "us-3671542-kwolek-kevlar":
          case "us-3819786-kwolek-kevlar":
            return renderMode === "3d-physics" ? <KwolekKevlar3D /> : <KwolekKevlarSim />;
          case "us-223898-edison-lightbulb":
            return renderMode === "3d-physics" ? <EdisonBulb3D /> : <EdisonBulbSim />;
          case "us-174465-bell-telephone":
            return renderMode === "3d-physics" ? <BellTelephone3D /> : <BellTelephoneSim />;
          case "us-6281-lincoln-buoy":
            return renderMode === "3d-physics" ? <LincolnBuoy3D /> : <LincolnBuoySim />;
          case "us-4750-howe-sewing-machine":
            return renderMode === "3d-physics" ? <HoweSewingMachine3D /> : <HoweSewingMachineSim />;
          case "us-533367-tesla-coil":
          case "us-593138-tesla-coil":
            return renderMode === "3d-physics" ? <TeslaCoil3D /> : <TeslaCoilSim />;
          case "us-1155986-goddard-rocket":
          case "us-1102653-goddard-rocket":
            return renderMode === "3d-physics" ? <GoddardRocket3D /> : <GoddardRocketSim />;
          case "us-2569347-bardeen-transistor":
          case "us-2524191-bardeen-transistor":
            return renderMode === "3d-physics" ? <BardeenTransistor3D /> : <BardeenTransistorSim />;
          case "us-3923554-boyle-smith-ccd":
          case "us-3792322-boyle-smith-ccd":
            return renderMode === "3d-physics" ? <BoyleSmithCcd3D /> : <BoyleSmithCcdSim />;
          case "us-586193-marconi-radio":
            return renderMode === "3d-physics" ? <MarconiRadio3D /> : <MarconiRadioSim />;
          case "us-1647-morse-telegraph":
            return renderMode === "3d-physics" ? <MorseTelegraph3D /> : <MorseTelegraphSim />;
          case "us-3633-goodyear-rubber":
            return renderMode === "3d-physics" ? <GoodyearRubber3D /> : <GoodyearRubberSim />;
          case "us-2292387-lamarr-frequency-hopping":
            return renderMode === "3d-physics" ? (
              <LamarrFrequencyHopping3D />
            ) : (
              <LamarrFrequencyHoppingSim />
            );
          case "us-3541541-engelbart-mouse":
            return renderMode === "3d-physics" ? <EngelbartMouse3D /> : <EngelbartMouseSim />;
          case "us-2708656-fermi-reactor":
            return renderMode === "3d-physics" ? <FermiReactor3D /> : <FermiReactorSim />;
          case "us-4136359-wozniak-apple":
            return renderMode === "3d-physics" ? <WozniakApple3D /> : <WozniakAppleSim />;
          case "us-1781541-einstein-refrigerator":
            return renderMode === "3d-physics" ? (
              <EinsteinRefrigerator3D />
            ) : (
              <EinsteinRefrigeratorSim />
            );

          default:
            return (
              <div className="w-full min-h-[240px] rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100 dark:bg-ink-900 flex items-center justify-center p-6 text-center">
                <p className="font-sans text-sm text-ink-600 dark:text-ink-300">
                  No interactive physics module is registered for this patent yet.
                </p>
              </div>
            );
        }
      })()}
    </div>
  );
}
