"use client";

import { Activity, Sparkles } from "lucide-react";
// 3D WebGL Physics Simulators
import dynamic from "next/dynamic";
import { useState } from "react";
// 2D Vector Schematics & Dynamic Simulators
import { BardeenTransistorSim } from "./BardeenTransistorSim";
import { BellTelephoneSim } from "./BellTelephoneSim";
import { BoyleSmithCcdSim } from "./BoyleSmithCcdSim";
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
import { GoddardRocketSourceVisual } from "./GoddardRocketSourceVisual";
import { GoodyearRubberSim } from "./GoodyearRubberSim";
import { GrammeDynamoSim } from "./GrammeDynamoSim";
import { HollerithTabulatingSim } from "./HollerithTabulatingSim";
import { HoweSewingMachineSim } from "./HoweSewingMachineSim";
import { HyattCelluloidSim } from "./HyattCelluloidSim";
import { LamarrFrequencyHoppingSim } from "./LamarrFrequencyHoppingSim";
import { LincolnBuoySim } from "./LincolnBuoySim";
import { LindeAirLiquefactionSim } from "./LindeAirLiquefactionSim";
import { MaximMachineGunSim } from "./MaximMachineGunSim";
import { McCormickReaperSim } from "./McCormickReaperSim";
import { MergenthalerLinotypeSim } from "./MergenthalerLinotypeSim";
import { MorseTelegraphSim } from "./MorseTelegraphSim";
import { NobelDynamiteSim } from "./NobelDynamiteSim";
import { NoycePlanarSourceVisual } from "./NoycePlanarSourceVisual";
import { OtisElevatorSim } from "./OtisElevatorSim";
import { OttoEngineSim } from "./OttoEngineSim";
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

const ThreeLoading = () => (
  <div className="w-full min-h-[420px] rounded-2xl border border-parchment-300 dark:border-ink-800 bg-[#090d16] flex flex-col items-center justify-center p-6 text-center space-y-3">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
    <span className="font-mono text-xs text-amber-500 tracking-wider">
      INITIALIZING THREE.JS WEBGL SIMULATION...
    </span>
  </div>
);

const BardeenTransistor3D = dynamic(
  () => import("./three/BardeenTransistor3D").then((mod) => mod.BardeenTransistor3D),
  { ssr: false, loading: ThreeLoading },
);
const BellTelephone3D = dynamic(
  () => import("./three/BellTelephone3D").then((mod) => mod.BellTelephone3D),
  { ssr: false, loading: ThreeLoading },
);
const BoyleSmithCcd3D = dynamic(
  () => import("./three/BoyleSmithCcd3D").then((mod) => mod.BoyleSmithCcd3D),
  { ssr: false, loading: ThreeLoading },
);
const ColtRevolver3D = dynamic(
  () => import("./three/ColtRevolver3D").then((mod) => mod.ColtRevolver3D),
  { ssr: false, loading: ThreeLoading },
);
const CorlissSteamEngine3D = dynamic(
  () => import("./three/CorlissSteamEngine3D").then((mod) => mod.CorlissSteamEngine3D),
  { ssr: false, loading: ThreeLoading },
);
const DaimlerEngine3D = dynamic(
  () => import("./three/DaimlerEngine3D").then((mod) => mod.DaimlerEngine3D),
  { ssr: false, loading: ThreeLoading },
);
const DavenportElectricMotor3D = dynamic(
  () => import("./three/DavenportElectricMotor3D").then((mod) => mod.DavenportElectricMotor3D),
  { ssr: false, loading: ThreeLoading },
);
const DeLavalSeparator3D = dynamic(
  () => import("./three/DeLavalSeparator3D").then((mod) => mod.DeLavalSeparator3D),
  { ssr: false, loading: ThreeLoading },
);
const DieselEngine3D = dynamic(
  () => import("./three/DieselEngine3D").then((mod) => mod.DieselEngine3D),
  { ssr: false, loading: ThreeLoading },
);
const EastmanKodak3D = dynamic(
  () => import("./three/EastmanKodak3D").then((mod) => mod.EastmanKodak3D),
  { ssr: false, loading: ThreeLoading },
);
const EdisonBulb3D = dynamic(() => import("./three/EdisonBulb3D").then((mod) => mod.EdisonBulb3D), {
  ssr: false,
  loading: ThreeLoading,
});
const EdisonPhonograph3D = dynamic(
  () => import("./three/EdisonPhonograph3D").then((mod) => mod.EdisonPhonograph3D),
  { ssr: false, loading: ThreeLoading },
);
const EinsteinRefrigerator3D = dynamic(
  () => import("./three/EinsteinRefrigerator3D").then((mod) => mod.EinsteinRefrigerator3D),
  { ssr: false, loading: ThreeLoading },
);
const EngelbartMouse3D = dynamic(
  () => import("./three/EngelbartMouse3D").then((mod) => mod.EngelbartMouse3D),
  { ssr: false, loading: ThreeLoading },
);
const EricssonPropeller3D = dynamic(
  () => import("./three/EricssonPropeller3D").then((mod) => mod.EricssonPropeller3D),
  { ssr: false, loading: ThreeLoading },
);
const FarnsworthTV3D = dynamic(
  () => import("./three/FarnsworthTV3D").then((mod) => mod.FarnsworthTV3D),
  { ssr: false, loading: ThreeLoading },
);
const FermiReactor3D = dynamic(
  () => import("./three/FermiReactor3D").then((mod) => mod.FermiReactor3D),
  { ssr: false, loading: ThreeLoading },
);
const GatlingGun3D = dynamic(() => import("./three/GatlingGun3D").then((mod) => mod.GatlingGun3D), {
  ssr: false,
  loading: ThreeLoading,
});
const GliddenBarbedWire3D = dynamic(
  () => import("./three/GliddenBarbedWire3D").then((mod) => mod.GliddenBarbedWire3D),
  { ssr: false, loading: ThreeLoading },
);
const GoodyearRubber3D = dynamic(
  () => import("./three/GoodyearRubber3D").then((mod) => mod.GoodyearRubber3D),
  { ssr: false, loading: ThreeLoading },
);
const GrammeDynamo3D = dynamic(
  () => import("./three/GrammeDynamo3D").then((mod) => mod.GrammeDynamo3D),
  { ssr: false, loading: ThreeLoading },
);
const HollerithTabulating3D = dynamic(
  () => import("./three/HollerithTabulating3D").then((mod) => mod.HollerithTabulating3D),
  { ssr: false, loading: ThreeLoading },
);
const HoweSewingMachine3D = dynamic(
  () => import("./three/HoweSewingMachine3D").then((mod) => mod.HoweSewingMachine3D),
  { ssr: false, loading: ThreeLoading },
);
const HyattCelluloid3D = dynamic(
  () => import("./three/HyattCelluloid3D").then((mod) => mod.HyattCelluloid3D),
  { ssr: false, loading: ThreeLoading },
);
const LamarrFrequencyHopping3D = dynamic(
  () => import("./three/LamarrFrequencyHopping3D").then((mod) => mod.LamarrFrequencyHopping3D),
  { ssr: false, loading: ThreeLoading },
);
const LincolnBuoy3D = dynamic(
  () => import("./three/LincolnBuoy3D").then((mod) => mod.LincolnBuoy3D),
  { ssr: false, loading: ThreeLoading },
);
const LindeAirLiquefaction3D = dynamic(
  () => import("./three/LindeAirLiquefaction3D").then((mod) => mod.LindeAirLiquefaction3D),
  { ssr: false, loading: ThreeLoading },
);
const _MarconiRadio3D = dynamic(
  () => import("./three/MarconiRadio3D").then((mod) => mod.MarconiRadio3D),
  { ssr: false, loading: ThreeLoading },
);
const MaximMachineGun3D = dynamic(
  () => import("./three/MaximMachineGun3D").then((mod) => mod.MaximMachineGun3D),
  { ssr: false, loading: ThreeLoading },
);
const McCormickReaper3D = dynamic(
  () => import("./three/McCormickReaper3D").then((mod) => mod.McCormickReaper3D),
  { ssr: false, loading: ThreeLoading },
);
const MergenthalerLinotype3D = dynamic(
  () => import("./three/MergenthalerLinotype3D").then((mod) => mod.MergenthalerLinotype3D),
  { ssr: false, loading: ThreeLoading },
);
const MorseTelegraph3D = dynamic(
  () => import("./three/MorseTelegraph3D").then((mod) => mod.MorseTelegraph3D),
  { ssr: false, loading: ThreeLoading },
);
const NobelDynamite3D = dynamic(
  () => import("./three/NobelDynamite3D").then((mod) => mod.NobelDynamite3D),
  { ssr: false, loading: ThreeLoading },
);
const OtisElevator3D = dynamic(
  () => import("./three/OtisElevator3D").then((mod) => mod.OtisElevator3D),
  { ssr: false, loading: ThreeLoading },
);
const OttoEngine3D = dynamic(() => import("./three/OttoEngine3D").then((mod) => mod.OttoEngine3D), {
  ssr: false,
  loading: ThreeLoading,
});
const PasteurFermentation3D = dynamic(
  () => import("./three/PasteurFermentation3D").then((mod) => mod.PasteurFermentation3D),
  { ssr: false, loading: ThreeLoading },
);
const PeltonWheel3D = dynamic(
  () => import("./three/PeltonWheel3D").then((mod) => mod.PeltonWheel3D),
  { ssr: false, loading: ThreeLoading },
);
const RenoEscalator3D = dynamic(
  () => import("./three/RenoEscalator3D").then((mod) => mod.RenoEscalator3D),
  { ssr: false, loading: ThreeLoading },
);
const SholesTypewriter3D = dynamic(
  () => import("./three/SholesTypewriter3D").then((mod) => mod.SholesTypewriter3D),
  { ssr: false, loading: ThreeLoading },
);
const SpencerMicrowave3D = dynamic(
  () => import("./three/SpencerMicrowave3D").then((mod) => mod.SpencerMicrowave3D),
  { ssr: false, loading: ThreeLoading },
);
const TeslaCoil3D = dynamic(() => import("./three/TeslaCoil3D").then((mod) => mod.TeslaCoil3D), {
  ssr: false,
  loading: ThreeLoading,
});
const TeslaMotor3D = dynamic(() => import("./three/TeslaMotor3D").then((mod) => mod.TeslaMotor3D), {
  ssr: false,
  loading: ThreeLoading,
});
const TeslaTeleautomaton3D = dynamic(
  () => import("./three/TeslaTeleautomaton3D").then((mod) => mod.TeslaTeleautomaton3D),
  { ssr: false, loading: ThreeLoading },
);
const ThomsonWelding3D = dynamic(
  () => import("./three/ThomsonWelding3D").then((mod) => mod.ThomsonWelding3D),
  { ssr: false, loading: ThreeLoading },
);
const WestinghouseAirBrake3D = dynamic(
  () => import("./three/WestinghouseAirBrake3D").then((mod) => mod.WestinghouseAirBrake3D),
  { ssr: false, loading: ThreeLoading },
);
const WhitneyCottonGin3D = dynamic(
  () => import("./three/WhitneyCottonGin3D").then((mod) => mod.WhitneyCottonGin3D),
  { ssr: false, loading: ThreeLoading },
);
const WozniakApple3D = dynamic(
  () => import("./three/WozniakApple3D").then((mod) => mod.WozniakApple3D),
  { ssr: false, loading: ThreeLoading },
);
const WrightFlyer3D = dynamic(
  () => import("./three/WrightFlyer3D").then((mod) => mod.WrightFlyer3D),
  { ssr: false, loading: ThreeLoading },
);
const ZeppelinAirship3D = dynamic(
  () => import("./three/ZeppelinAirship3D").then((mod) => mod.ZeppelinAirship3D),
  { ssr: false, loading: ThreeLoading },
);

interface PatentVisualDispatcherProps {
  patentId: string;
}

export function PatentVisualDispatcher({ patentId }: PatentVisualDispatcherProps) {
  const [renderMode, setRenderMode] = useState<"3d-physics" | "vector-diagram">("3d-physics");
  // These grants have verified source-drawing guides, not computational 2D/3D pairs.
  // Do not offer a mode switch whose former path invented unprinted performance data.
  const hasVerifiedVisual = ![
    "us-608969-parsons-turbine",
    "us-1102653-goddard-rocket",
    "us-2981877-noyce-ic",
    "us-586193-marconi-radio",
    "us-808897-carrier-air-conditioner",
    "us-3671542-kwolek-kevlar",
    "us-3858232-boyle-smith-ccd",
  ].includes(patentId);

  return (
    <div className="space-y-4">
      {/* 3D vs 2D Toggle Switcher */}
      <div className="flex justify-end">
        {hasVerifiedVisual && (
          <div className="flex items-center gap-1 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs sm:text-sm font-sans shadow-sm">
            <button
              type="button"
              onClick={() => setRenderMode("3d-physics")}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg transition-colors ${
                renderMode === "3d-physics"
                  ? "bg-amber-600 text-white font-bold shadow-xs"
                  : "text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Physics Simulation</span>
            </button>
            <button
              type="button"
              onClick={() => setRenderMode("vector-diagram")}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg transition-colors ${
                renderMode === "vector-diagram"
                  ? "bg-amber-600 text-white font-bold shadow-xs"
                  : "text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>2D Technical Diagram</span>
            </button>
          </div>
        )}
      </div>

      {/* Render Selected Visual Module */}
      {(() => {
        switch (patentId) {
          case "us-x72-whitney-cotton-gin":
            return renderMode === "3d-physics" ? <WhitneyCottonGin3D /> : <WhitneyCottonGinSim />;
          case "us-x8277-mccormick-reaper":
            return renderMode === "3d-physics" ? <McCormickReaper3D /> : <McCormickReaperSim />;
          case "us-x9430-colt-revolver":
            return renderMode === "3d-physics" ? <ColtRevolver3D /> : <ColtRevolverSim />;
          case "us-132-davenport-electric-motor":
            return renderMode === "3d-physics" ? (
              <DavenportElectricMotor3D />
            ) : (
              <DavenportMotorSim />
            );
          case "us-588-ericsson-propeller":
            return renderMode === "3d-physics" ? <EricssonPropeller3D /> : <EricssonPropellerSim />;
          case "us-1647-morse-telegraph":
            return renderMode === "3d-physics" ? <MorseTelegraph3D /> : <MorseTelegraphSim />;
          case "us-3633-goodyear-rubber":
            return renderMode === "3d-physics" ? <GoodyearRubber3D /> : <GoodyearRubberSim />;
          case "us-4750-howe-sewing-machine":
            return renderMode === "3d-physics" ? <HoweSewingMachine3D /> : <HoweSewingMachineSim />;
          case "us-6162-corliss-steam-engine":
            return renderMode === "3d-physics" ? <CorlissSteamEngine3D /> : <CorlissEngineSim />;
          case "us-6469-lincoln-buoy":
            return renderMode === "3d-physics" ? <LincolnBuoy3D /> : <LincolnBuoySim />;
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
          case "us-174465-bell-telephone":
            return renderMode === "3d-physics" ? <BellTelephone3D /> : <BellTelephoneSim />;
          case "us-194047-otto-engine":
            return renderMode === "3d-physics" ? <OttoEngine3D /> : <OttoEngineSim />;
          case "us-200521-edison-phonograph":
            return renderMode === "3d-physics" ? <EdisonPhonograph3D /> : <EdisonPhonographSim />;
          case "us-223898-edison-lightbulb":
            return renderMode === "3d-physics" ? <EdisonBulb3D /> : <EdisonBulbSim />;
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
          case "us-381968-tesla-motor":
            return renderMode === "3d-physics" ? <TeslaMotor3D /> : <TeslaMotorSim />;
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
          case "us-593138-tesla-coil":
            return renderMode === "3d-physics" ? <TeslaCoil3D /> : <TeslaCoilSim />;
          case "us-542846-diesel-engine":
            return renderMode === "3d-physics" ? <DieselEngine3D /> : <DieselEngineSim />;
          case "us-586193-marconi-radio":
            return (
              <SourceVisualUnavailable
                detail="US 586,193 concerns high-frequency signalling, metallic-powder receiver contacts, local circuits, and trembler reset. The inherited radio model adds unreviewed antenna dimensions, power, range, and modern monopole claims, so it is withheld until a source-specific instrument is independently accepted."
                title="Spark-signal receiver visual under source review"
              />
            );
          case "us-608969-parsons-turbine":
            return (
              <SourceVisualUnavailable
                detail="The pinned US 608,969 grant is a Marine Steam-Turbine arrangement involving screw shafts and a reversing turbine. The inherited axial reaction-turbine model describes a different Parsons patent and is withheld until a source-specific visual is authored."
                title="Marine steam-turbine visual under source review"
              />
            );
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
            return (
              <SourceVisualUnavailable
                detail="US 808,897 is an air washer with a spray H and wet, sinuous separator plates. The inherited chilled-dew-point air-conditioning model describes a different Carrier project and is withheld until a source-specific visual is authored."
                title="Air-washer and separator visual under source review"
              />
            );
          case "us-821393-wright-flyer":
            return renderMode === "3d-physics" ? <WrightFlyer3D /> : <WrightFlyerSim />;
          case "us-1102653-goddard-rocket":
            return <GoddardRocketSourceVisual />;
          case "us-1773980-farnsworth-tv":
            return renderMode === "3d-physics" ? <FarnsworthTV3D /> : <FarnsworthTVSim />;
          case "us-1781541-einstein-refrigerator":
            return renderMode === "3d-physics" ? (
              <EinsteinRefrigerator3D />
            ) : (
              <EinsteinRefrigeratorSim />
            );
          case "us-2292387-lamarr-frequency-hopping":
            return renderMode === "3d-physics" ? (
              <LamarrFrequencyHopping3D />
            ) : (
              <LamarrFrequencyHoppingSim />
            );
          case "us-2495429-spencer-microwave":
            return renderMode === "3d-physics" ? <SpencerMicrowave3D /> : <SpencerMicrowaveSim />;
          case "us-2524035-bardeen-transistor":
            return renderMode === "3d-physics" ? <BardeenTransistor3D /> : <BardeenTransistorSim />;
          case "us-2708656-fermi-reactor":
            return renderMode === "3d-physics" ? <FermiReactor3D /> : <FermiReactorSim />;
          case "us-2981877-noyce-ic":
            return <NoycePlanarSourceVisual />;
          case "us-3541541-engelbart-mouse":
            return renderMode === "3d-physics" ? <EngelbartMouse3D /> : <EngelbartMouseSim />;
          case "us-3671542-kwolek-kevlar":
            return (
              <SourceVisualUnavailable
                detail="The inherited material visual has not yet been reconciled with the pinned US 3,671,542 facsimile and its still-withheld manual source edition. It is not shown as evidence for this patent."
                title="Source-specific material visual in preparation"
              />
            );
          case "us-3923554-boyle-smith-ccd":
            return renderMode === "3d-physics" ? <BoyleSmithCcd3D /> : <BoyleSmithCcdSim />;
          case "us-3858232-boyle-smith-ccd":
            return (
              <SourceVisualUnavailable
                detail="The pinned US 3,858,232 facsimile is titled Information Storage Devices. The inherited CCD model is not a source-specific treatment of that patent and is withheld until the manual edition and a matching visual are complete."
                title="Information-storage visual in preparation"
              />
            );
          case "us-4136359-wozniak-apple":
            return renderMode === "3d-physics" ? <WozniakApple3D /> : <WozniakAppleSim />;

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
