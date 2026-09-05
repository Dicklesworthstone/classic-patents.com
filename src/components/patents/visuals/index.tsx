"use client";

import { Activity, Sparkles } from "lucide-react";
// 3D WebGL Physics Simulators
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { patentVisualAvailability } from "@/data/patentVisualAvailability";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { planPhoneFocusClearance } from "./phoneFocusClearance";
import { SourceVisualUnavailable } from "./SourceVisualUnavailable";

// 2D Vector Schematics & Dynamic Simulators

const ThreeLoading = () => (
  <div className="w-full min-h-[420px] rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/90 dark:bg-ink-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3 shadow-patent">
    <div className="w-8 h-8 rounded-full border-2 border-amber-600 dark:border-amber-400 border-t-transparent animate-spin" />
    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300 tracking-wider">
      INITIALIZING THREE.JS WEBGL SIMULATION...
    </span>
  </div>
);

// Neutral fallback for lazy 2D sims: no WebGL wording, same footprint.
const SimLoading = () => (
  <div className="w-full min-h-[420px] rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/90 dark:bg-ink-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3 shadow-patent">
    <div className="w-8 h-8 rounded-full border-2 border-amber-600 dark:border-amber-400 border-t-transparent animate-spin" />
    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300 tracking-wider">
      LOADING INTERACTIVE SIMULATION...
    </span>
  </div>
);

const BaerOdysseyPhysicsRuntimeOwner = dynamic(
  () =>
    import("./PatentPhysicsRuntimeOwner").then((module) => module.BaerOdysseyPhysicsRuntimeOwner),
  { ssr: false },
);
const BoyleSmithCcdPhysicsRuntimeOwner = dynamic(
  () =>
    import("./PatentPhysicsRuntimeOwner").then((module) => module.BoyleSmithCcdPhysicsRuntimeOwner),
  { ssr: false },
);
const KamenInjectionPhysicsRuntimeOwner = dynamic(
  () =>
    import("./PatentPhysicsRuntimeOwner").then(
      (module) => module.KamenInjectionPhysicsRuntimeOwner,
    ),
  { ssr: false },
);
const MetcalfeEthernetPhysicsRuntimeOwner = dynamic(
  () =>
    import("./PatentPhysicsRuntimeOwner").then(
      (module) => module.MetcalfeEthernetPhysicsRuntimeOwner,
    ),
  { ssr: false },
);
const FarnsworthTvPhysicsRuntimeOwner = dynamic(
  () =>
    import("./PatentPhysicsRuntimeOwner").then((module) => module.FarnsworthTvPhysicsRuntimeOwner),
  { ssr: false },
);
const EInkPhysicsRuntimeOwner = dynamic(
  () => import("./PatentPhysicsRuntimeOwner").then((module) => module.EInkPhysicsRuntimeOwner),
  { ssr: false },
);
const LamarrPhysicsRuntimeOwner = dynamic(
  () => import("./PatentPhysicsRuntimeOwner").then((module) => module.LamarrPhysicsRuntimeOwner),
  { ssr: false },
);
const MarconiPhysicsRuntimeOwner = dynamic(
  () => import("./PatentPhysicsRuntimeOwner").then((module) => module.MarconiPhysicsRuntimeOwner),
  { ssr: false },
);
const WattRotaryPhysicsRuntimeOwner = dynamic(
  () =>
    import("./PatentPhysicsRuntimeOwner").then((module) => module.WattRotaryPhysicsRuntimeOwner),
  { ssr: false },
);
const ArkwrightPhysicsRuntimeOwner = dynamic(
  () => import("./PatentPhysicsRuntimeOwner").then((module) => module.ArkwrightPhysicsRuntimeOwner),
  { ssr: false },
);
const CortPhysicsRuntimeOwner = dynamic(
  () => import("./PatentPhysicsRuntimeOwner").then((module) => module.CortPhysicsRuntimeOwner),
  { ssr: false },
);
const HopkinsPhysicsRuntimeOwner = dynamic(
  () => import("./PatentPhysicsRuntimeOwner").then((module) => module.HopkinsPhysicsRuntimeOwner),
  { ssr: false },
);
const WhitneyPhysicsRuntimeOwner = dynamic(
  () => import("./PatentPhysicsRuntimeOwner").then((module) => module.WhitneyPhysicsRuntimeOwner),
  { ssr: false },
);
const McCormickPhysicsRuntimeOwner = dynamic(
  () => import("./PatentPhysicsRuntimeOwner").then((module) => module.McCormickPhysicsRuntimeOwner),
  { ssr: false },
);
const ColtPhysicsRuntimeOwner = dynamic(
  () => import("./PatentPhysicsRuntimeOwner").then((module) => module.ColtPhysicsRuntimeOwner),
  { ssr: false },
);
// 2D sims are lazy: the dispatcher defaults to the 3D face, so each page only
// downloads the vector-diagram code when the visitor actually toggles it.
const AmfVersatranSim = dynamic(() => import("./AMFVersatranSim").then((m) => m.AmfVersatranSim), {
  ssr: false,
  loading: SimLoading,
});
const ArkwrightWaterFrameSim = dynamic(
  () => import("./ArkwrightWaterFrameSim").then((m) => m.ArkwrightWaterFrameSim),
  { ssr: false, loading: SimLoading },
);
const BaekelandBakeliteSim = dynamic(
  () => import("./BaekelandBakeliteSim").then((m) => m.BaekelandBakeliteSim),
  { ssr: false, loading: SimLoading },
);
const BaerOdysseySim = dynamic(() => import("./BaerOdysseySim").then((m) => m.BaerOdysseySim), {
  ssr: false,
  loading: SimLoading,
});
const BardeenTransistorSim = dynamic(
  () => import("./BardeenTransistorSim").then((m) => m.BardeenTransistorSim),
  { ssr: false, loading: SimLoading },
);
const BellPhotophoneSim = dynamic(
  () => import("./BellPhotophoneSim").then((m) => m.BellPhotophoneSim),
  { ssr: false, loading: SimLoading },
);
const BellTelephoneSim = dynamic(
  () => import("./BellTelephoneSim").then((m) => m.BellTelephoneSim),
  { ssr: false, loading: SimLoading },
);
const BoyleSmithCcdSim = dynamic(
  () => import("./BoyleSmithCcdSourceSim").then((m) => m.BoyleSmithCcdSourceSim),
  { ssr: false, loading: SimLoading },
);
const CarlsonElectrophotographySim = dynamic(
  () => import("./CarlsonElectrophotographySim").then((m) => m.CarlsonElectrophotographySim),
  { ssr: false, loading: SimLoading },
);
const CarrierAirConditionerSim = dynamic(
  () => import("./CarrierAirConditionerSim").then((m) => m.CarrierAirConditionerSim),
  { ssr: false, loading: SimLoading },
);
const ClavelDeltaRobotSim = dynamic(
  () => import("./ClavelDeltaRobotSim").then((m) => m.ClavelDeltaRobotSim),
  { ssr: false, loading: SimLoading },
);
const ColtRevolverSim = dynamic(() => import("./ColtRevolverSim").then((m) => m.ColtRevolverSim), {
  ssr: false,
  loading: SimLoading,
});
const CorlissEngineSim = dynamic(
  () => import("./CorlissEngineSim").then((m) => m.CorlissEngineSim),
  { ssr: false, loading: SimLoading },
);
const CortPuddlingRollingSim = dynamic(
  () => import("./CortPuddlingRollingSim").then((m) => m.CortPuddlingRollingSim),
  { ssr: false, loading: SimLoading },
);
const CrumpFdmSim = dynamic(() => import("./CrumpFdmSim").then((m) => m.CrumpFdmSim), {
  ssr: false,
  loading: SimLoading,
});
const DaimlerEngineSim = dynamic(
  () => import("./DaimlerEngineSim").then((m) => m.DaimlerEngineSim),
  { ssr: false, loading: SimLoading },
);
const DaVinciInterfaceSim = dynamic(
  () => import("./DaVinciInterfaceSim").then((m) => m.DaVinciInterfaceSim),
  {
    ssr: false,
    loading: SimLoading,
  },
);
const DavenportMotorSim = dynamic(
  () => import("./DavenportMotorSim").then((m) => m.DavenportMotorSim),
  { ssr: false, loading: SimLoading },
);
const DeLavalSeparatorSim = dynamic(
  () => import("./DeLavalSeparatorSim").then((m) => m.DeLavalSeparatorSim),
  { ssr: false, loading: SimLoading },
);
const DevolProgrammedTransferSim = dynamic(
  () => import("./DevolProgrammedTransferSim").then((m) => m.DevolProgrammedTransferSim),
  { ssr: false, loading: SimLoading },
);
const DieselEngineSim = dynamic(() => import("./DieselEngineSim").then((m) => m.DieselEngineSim), {
  ssr: false,
  loading: SimLoading,
});
const EastmanKodakSim = dynamic(() => import("./EastmanKodakSim").then((m) => m.EastmanKodakSim), {
  ssr: false,
  loading: SimLoading,
});
const EdisonBulbSim = dynamic(() => import("./EdisonBulbSim").then((m) => m.EdisonBulbSim), {
  ssr: false,
  loading: SimLoading,
});
const EdisonIndicatorSim = dynamic(() => import("./EdisonIndicatorSim").then((m) => m.default), {
  ssr: false,
  loading: SimLoading,
});
const EdisonPhonographSim = dynamic(
  () => import("./EdisonPhonographSim").then((m) => m.EdisonPhonographSim),
  { ssr: false, loading: SimLoading },
);
const EInkSim = dynamic(() => import("./EInkSim").then((m) => m.EInkSim), {
  ssr: false,
  loading: SimLoading,
});
const EinsteinRefrigeratorSim = dynamic(
  () => import("./EinsteinRefrigeratorSim").then((m) => m.EinsteinRefrigeratorSim),
  { ssr: false, loading: SimLoading },
);
const EngelbartMouseSim = dynamic(
  () => import("./EngelbartMouseSim").then((m) => m.EngelbartMouseSim),
  { ssr: false, loading: SimLoading },
);
const EricssonPropellerSim = dynamic(
  () => import("./EricssonPropellerSim").then((m) => m.EricssonPropellerSim),
  { ssr: false, loading: SimLoading },
);
const FarnsworthTVSim = dynamic(() => import("./FarnsworthTVSim").then((m) => m.FarnsworthTVSim), {
  ssr: false,
  loading: SimLoading,
});
const FermiReactorSim = dynamic(() => import("./FermiReactorSim").then((m) => m.FermiReactorSim), {
  ssr: false,
  loading: SimLoading,
});
const FessendenWirelessSim = dynamic(
  () => import("./FessendenWirelessSim").then((m) => m.FessendenWirelessSim),
  { ssr: false, loading: SimLoading },
);
const GatlingGunSim = dynamic(() => import("./GatlingGunSim").then((m) => m.GatlingGunSim), {
  ssr: false,
  loading: SimLoading,
});
const GliddenBarbedWireSim = dynamic(
  () => import("./GliddenBarbedWireSim").then((m) => m.GliddenBarbedWireSim),
  { ssr: false, loading: SimLoading },
);
const GoddardRocketSim = dynamic(
  () => import("./Goddard1914ApparatusSim").then((m) => m.GoddardRocketSim),
  { ssr: false, loading: SimLoading },
);
const GoodyearRubberSim = dynamic(
  () => import("./GoodyearRubberSim").then((m) => m.GoodyearRubberSim),
  { ssr: false, loading: SimLoading },
);
const GoertzElectronicMasterSlaveManipulatorSim = dynamic(
  () =>
    import("./GoertzElectronicMasterSlaveManipulatorSim").then(
      (m) => m.GoertzElectronicMasterSlaveManipulatorSim,
    ),
  { ssr: false, loading: SimLoading },
);
const GrammeDynamoSim = dynamic(() => import("./GrammeDynamoSim").then((m) => m.GrammeDynamoSim), {
  ssr: false,
  loading: SimLoading,
});
const HaberAmmoniaSim = dynamic(() => import("./HaberAmmoniaSim").then((m) => m.HaberAmmoniaSim), {
  ssr: false,
  loading: SimLoading,
});
const HallAluminiumSim = dynamic(
  () => import("./HallAluminiumSim").then((m) => m.HallAluminiumSim),
  { ssr: false, loading: SimLoading },
);
const HewittMercuryLampSim = dynamic(
  () => import("./HewittMercuryLampSim").then((m) => m.HewittMercuryLampSim),
  { ssr: false, loading: SimLoading },
);
const HollerithTabulatingSim = dynamic(
  () => import("./HollerithTabulatingSim").then((m) => m.HollerithTabulatingSim),
  { ssr: false, loading: SimLoading },
);
const HopkinsPotashSim = dynamic(
  () => import("./HopkinsPotashSim").then((m) => m.HopkinsPotashSim),
  { ssr: false, loading: SimLoading },
);
const HoweSewingMachineSim = dynamic(
  () => import("./HoweSewingMachineSim").then((m) => m.HoweSewingMachineSim),
  { ssr: false, loading: SimLoading },
);
const HullStereolithographySim = dynamic(
  () => import("./HullStereolithographySim").then((m) => m.HullStereolithographySim),
  { ssr: false, loading: SimLoading },
);
const HyattCelluloidSim = dynamic(
  () => import("./HyattCelluloidSim").then((m) => m.HyattCelluloidSim),
  { ssr: false, loading: SimLoading },
);
const KilbyIntegratedCircuitSim = dynamic(
  () => import("./KilbyIntegratedCircuitSim").then((m) => m.KilbyIntegratedCircuitSim),
  { ssr: false, loading: SimLoading },
);
const KamenTransporterSim = dynamic(
  () => import("./KamenTransporterSim").then((m) => m.KamenTransporterSim),
  { ssr: false, loading: SimLoading },
);
const KamenSegwaySim = dynamic(() => import("./KamenSegwaySim").then((m) => m.KamenSegwaySim), {
  ssr: false,
  loading: SimLoading,
});
const KamenMedicationInjectionSim = dynamic(
  () =>
    import("./KamenMedicationInjectionSourceSim").then(
      (module) => module.KamenMedicationInjectionSourceSim,
    ),
  { ssr: false, loading: SimLoading },
);
const LamarrFrequencyHoppingSim = dynamic(
  () => import("./LamarrFrequencyHoppingSim").then((m) => m.LamarrFrequencyHoppingSim),
  { ssr: false, loading: SimLoading },
);
const LandPolaroidSim = dynamic(() => import("./LandPolaroidSim").then((m) => m.LandPolaroidSim), {
  ssr: false,
  loading: SimLoading,
});
const LincolnBuoySim = dynamic(() => import("./LincolnBuoySim").then((m) => m.LincolnBuoySim), {
  ssr: false,
  loading: SimLoading,
});
const LindeAirLiquefactionSim = dynamic(
  () => import("./LindeAirLiquefactionSim").then((m) => m.LindeAirLiquefactionSim),
  { ssr: false, loading: SimLoading },
);
const MaimanRubyLaserSim = dynamic(
  () => import("./MaimanRubyLaserSim").then((m) => m.MaimanRubyLaserSim),
  { ssr: false, loading: SimLoading },
);
const MakinoScaraSim = dynamic(() => import("./MakinoScaraSim").then((m) => m.MakinoScaraSim), {
  ssr: false,
  loading: SimLoading,
});
const MilacronRobotToolchangerSim = dynamic(
  () => import("./MilacronRobotToolchangerSim").then((m) => m.MilacronRobotToolchangerSim),
  { ssr: false, loading: SimLoading },
);
const RobotEndEffectorSim = dynamic(
  () => import("./RobotEndEffectorSim").then((m) => m.RobotEndEffectorSim),
  { ssr: false, loading: SimLoading },
);
const MarconiRadioSim = dynamic(() => import("./MarconiRadioSim").then((m) => m.MarconiRadioSim), {
  ssr: false,
  loading: SimLoading,
});
const MaximMachineGunSim = dynamic(
  () => import("./MaximMachineGunSim").then((m) => m.MaximMachineGunSim),
  { ssr: false, loading: SimLoading },
);
const McCormickReaperSim = dynamic(
  () => import("./McCormickReaperSim").then((m) => m.McCormickReaperSim),
  { ssr: false, loading: SimLoading },
);
const MergenthalerLinotypeSim = dynamic(
  () => import("./MergenthalerLinotypeSim").then((m) => m.MergenthalerLinotypeSim),
  { ssr: false, loading: SimLoading },
);
const MestralVelcroSim = dynamic(
  () => import("./MestralVelcroSim").then((m) => m.MestralVelcroSim),
  { ssr: false, loading: SimLoading },
);
const MetcalfeEthernetSim = dynamic(
  () => import("./MetcalfeEthernetSim").then((m) => m.MetcalfeEthernetSim),
  { ssr: false, loading: SimLoading },
);
const MorseTelegraphSim = dynamic(
  () => import("./MorseTelegraphSim").then((m) => m.MorseTelegraphSim),
  { ssr: false, loading: SimLoading },
);
const MultiTouchSim = dynamic(() => import("./MultiTouchSim").then((m) => m.MultiTouchSim), {
  ssr: false,
  loading: SimLoading,
});
const NobelDynamiteSim = dynamic(
  () => import("./NobelDynamiteSim").then((m) => m.NobelDynamiteSim),
  { ssr: false, loading: SimLoading },
);
const NoycePlanarICSim = dynamic(
  () => import("./NoycePlanarICSim").then((m) => m.NoycePlanarICSim),
  { ssr: false, loading: SimLoading },
);
const OtisHoistingApparatusSim = dynamic(
  () => import("./OtisHoistingApparatusSim").then((module) => module.OtisHoistingApparatusSim),
  { ssr: false, loading: SimLoading },
);
const OttoEngineSim = dynamic(() => import("./OttoEngineSim").then((m) => m.OttoEngineSim), {
  ssr: false,
  loading: SimLoading,
});
const PageRankSim = dynamic(() => import("./PageRankSim").then((m) => m.PageRankSim), {
  ssr: false,
  loading: SimLoading,
});
const ParsonsTurbineSim = dynamic(
  () => import("./ParsonsTurbineSim").then((m) => m.ParsonsTurbineSim),
  { ssr: false, loading: SimLoading },
);
const PasteurFermentationSim = dynamic(
  () => import("./PasteurFermentationSim").then((m) => m.PasteurFermentationSim),
  { ssr: false, loading: SimLoading },
);
const PeltonWheelSim = dynamic(() => import("./PeltonWheelSim").then((m) => m.PeltonWheelSim), {
  ssr: false,
  loading: SimLoading,
});
const RenoEscalatorSim = dynamic(
  () => import("./RenoEscalatorSim").then((m) => m.RenoEscalatorSim),
  { ssr: false, loading: SimLoading },
);
const RillieuxEvaporatorSim = dynamic(
  () => import("./RillieuxEvaporatorSim").then((m) => m.RillieuxEvaporatorSim),
  { ssr: false, loading: SimLoading },
);
const RoombaSim = dynamic(() => import("./RoombaSim").then((m) => m.RoombaSim), {
  ssr: false,
  loading: SimLoading,
});
const SholesTypewriterSim = dynamic(
  () => import("./SholesTypewriterSim").then((m) => m.SholesTypewriterSim),
  { ssr: false, loading: SimLoading },
);
const SikorskyHelicopterSim = dynamic(
  () => import("./SikorskyHelicopterSim").then((m) => m.SikorskyHelicopterSim),
  { ssr: false, loading: SimLoading },
);
const SpencerMicrowaveSim = dynamic(
  () => import("./SpencerMicrowaveSim").then((m) => m.SpencerMicrowaveSim),
  { ssr: false, loading: SimLoading },
);
const StackhouseManipulatorSim = dynamic(
  () => import("./StackhouseSourceBoundedSim").then((m) => m.StackhouseSourceBoundedSim),
  { ssr: false, loading: SimLoading },
);
const SalisburyRobotHandSim = dynamic(
  () => import("./SalisburyRobotHandSim").then((m) => m.SalisburyRobotHandSim),
  { ssr: false, loading: SimLoading },
);
const SundbackZipperSim = dynamic(
  () => import("./SundbackZipperSim").then((m) => m.SundbackZipperSim),
  { ssr: false, loading: SimLoading },
);
const TeslaCoilSim = dynamic(() => import("./TeslaCoilSim").then((m) => m.TeslaCoilSim), {
  ssr: false,
  loading: SimLoading,
});
const TeslaMotorSim = dynamic(() => import("./TeslaMotorSim").then((m) => m.TeslaMotorSim), {
  ssr: false,
  loading: SimLoading,
});
const TeslaTeleautomatonSim = dynamic(
  () => import("./TeslaTeleautomatonSim").then((m) => m.TeslaTeleautomatonSim),
  { ssr: false, loading: SimLoading },
);
const ThomsonWeldingSim = dynamic(
  () => import("./ThomsonWeldingSim").then((m) => m.ThomsonWeldingSim),
  { ssr: false, loading: SimLoading },
);
const TownesLaserSim = dynamic(() => import("./TownesLaserSim").then((m) => m.TownesLaserSim), {
  ssr: false,
  loading: SimLoading,
});
const LemelsonAutomaticWarehousingSim = dynamic(
  () => import("./LemelsonAutomaticWarehousingSim").then((m) => m.LemelsonAutomaticWarehousingSim),
  { ssr: false, loading: SimLoading },
);
const LemelsonAutomaticProductionSim = dynamic(
  () => import("./LemelsonAutomaticProductionSim").then((m) => m.LemelsonAutomaticProductionSim),
  { ssr: false, loading: SimLoading },
);
const LemelsonAdjustableManipulatorSim = dynamic(
  () =>
    import("./LemelsonAdjustableManipulatorSim").then((m) => m.LemelsonAdjustableManipulatorSim),
  { ssr: false, loading: SimLoading },
);
const LemelsonMachineVisionSim = dynamic(
  () => import("./LemelsonMachineVisionSim").then((m) => m.LemelsonMachineVisionSim),
  { ssr: false, loading: SimLoading },
);
const WatsonRemoteCenterComplianceSim = dynamic(
  () => import("./WatsonRemoteCenterComplianceSim").then((m) => m.WatsonRemoteCenterComplianceSim),
  { ssr: false, loading: SimLoading },
);
const WattRotaryEngineSim = dynamic(
  () => import("./WattRotaryEngineSim").then((m) => m.WattRotaryEngineSim),
  { ssr: false, loading: SimLoading },
);
const WattSeparateCondenserSim = dynamic(
  () => import("./WattSeparateCondenserSim").then((m) => m.WattSeparateCondenserSim),
  { ssr: false, loading: SimLoading },
);
const WestinghouseAirBrakeSim = dynamic(
  () => import("./WestinghouseAirBrakeSim").then((m) => m.WestinghouseAirBrakeSim),
  { ssr: false, loading: SimLoading },
);
const WhitneyCottonGinSim = dynamic(
  () => import("./WhitneyCottonGinSim").then((m) => m.WhitneyCottonGinSim),
  { ssr: false, loading: SimLoading },
);
const WozniakAppleSim = dynamic(() => import("./WozniakAppleSim").then((m) => m.WozniakAppleSim), {
  ssr: false,
  loading: SimLoading,
});
const WrightFlyerSim = dynamic(() => import("./WrightFlyerSim").then((m) => m.WrightFlyerSim), {
  ssr: false,
  loading: SimLoading,
});
const YaleLockSim = dynamic(() => import("./YaleLockSim").then((m) => m.YaleLockSim), {
  ssr: false,
  loading: SimLoading,
});
const ZeppelinAirshipSim = dynamic(
  () => import("./ZeppelinAirshipSim").then((m) => m.ZeppelinAirshipSim),
  { ssr: false, loading: SimLoading },
);

const ArkwrightWaterFrame3D = dynamic(
  () => import("./three/ArkwrightWaterFrame3D").then((mod) => mod.ArkwrightWaterFrame3D),
  { ssr: false, loading: ThreeLoading },
);
const DeForestAudion3D = dynamic(
  () => import("./three/DeForestAudion3D").then((m) => m.DeForestAudion3D),
  { ssr: false, loading: ThreeLoading },
);
const DeForestAudionSim = dynamic(
  () => import("./DeForestAudionSim").then((m) => m.DeForestAudionSim),
  { ssr: false, loading: SimLoading },
);
const FessendenWireless3D = dynamic(
  () => import("./three/FessendenWireless3D").then((m) => m.FessendenWireless3D),
  { ssr: false, loading: ThreeLoading },
);
const HewittMercuryLamp3D = dynamic(() => import("./three/HewittMercuryLamp3D"), {
  ssr: false,
  loading: ThreeLoading,
});
const HaberAmmonia3D = dynamic(() => import("./three/HaberAmmonia3D"), {
  ssr: false,
  loading: ThreeLoading,
});
const BaekelandBakelite3D = dynamic(
  () => import("./three/BaekelandBakelite3D").then((m) => m.BaekelandBakelite3D),
  { ssr: false, loading: ThreeLoading },
);
const BaerOdyssey3D = dynamic(
  () => import("./three/BaerOdyssey3D").then((mod) => mod.BaerOdyssey3D),
  { ssr: false, loading: ThreeLoading },
);
const BardeenTransistor3D = dynamic(
  () => import("./three/BardeenTransistor3D").then((mod) => mod.BardeenTransistor3D),
  { ssr: false, loading: ThreeLoading },
);
const BellTelephone3D = dynamic(
  () => import("./three/BellTelephone3D").then((mod) => mod.BellTelephone3D),
  { ssr: false, loading: ThreeLoading },
);
const BellPhotophone3D = dynamic(
  () => import("./three/BellPhotophone3D").then((mod) => mod.BellPhotophone3D || mod.default),
  { ssr: false, loading: ThreeLoading },
);
const BoyleSmithCcd3D = dynamic(
  () => import("./three/BoyleSmithCcdSource3D").then((mod) => mod.BoyleSmithCcdSource3D),
  { ssr: false, loading: ThreeLoading },
);
const CarlsonElectrophotography3D = dynamic(
  () =>
    import("./three/CarlsonElectrophotography3D").then((mod) => mod.CarlsonElectrophotography3D),
  { ssr: false, loading: ThreeLoading },
);
const CarrierAirConditioner3D = dynamic(
  () => import("./three/CarrierAirConditioner3D").then((mod) => mod.CarrierAirConditioner3D),
  { ssr: false, loading: ThreeLoading },
);
const ClavelDeltaRobot3D = dynamic(
  () => import("./three/ClavelDeltaRobot3D").then((mod) => mod.ClavelDeltaRobot3D),
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
const CortPuddlingRolling3D = dynamic(
  () => import("./three/CortPuddlingRolling3D").then((mod) => mod.CortPuddlingRolling3D),
  { ssr: false, loading: ThreeLoading },
);
const CrumpFdm3D = dynamic(() => import("./three/CrumpFdm3D").then((mod) => mod.CrumpFdm3D), {
  ssr: false,
  loading: ThreeLoading,
});
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
const EdisonIndicator3D = dynamic(() => import("./three/EdisonIndicator3D"), {
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
const GoddardRocket3D = dynamic(
  () => import("./three/Goddard1914Apparatus3D").then((mod) => mod.GoddardRocket3D),
  { ssr: false, loading: ThreeLoading },
);
const GoodyearRubber3D = dynamic(
  () => import("./three/GoodyearRubber3D").then((mod) => mod.GoodyearRubber3D),
  { ssr: false, loading: ThreeLoading },
);
const GoertzElectronicMasterSlaveManipulator3D = dynamic(
  () =>
    import("./three/GoertzElectronicMasterSlaveManipulator3D").then(
      (mod) => mod.GoertzElectronicMasterSlaveManipulator3D,
    ),
  { ssr: false, loading: ThreeLoading },
);
const GrammeDynamo3D = dynamic(
  () => import("./three/GrammeDynamo3D").then((mod) => mod.GrammeDynamo3D),
  { ssr: false, loading: ThreeLoading },
);
const HallAluminium3D = dynamic(() => import("./three/HallAluminium3D"), {
  ssr: false,
  loading: ThreeLoading,
});
const HollerithTabulating3D = dynamic(
  () => import("./three/HollerithTabulating3D").then((mod) => mod.HollerithTabulating3D),
  { ssr: false, loading: ThreeLoading },
);
const HopkinsPotash3D = dynamic(
  () => import("./three/HopkinsPotash3D").then((mod) => mod.HopkinsPotash3D),
  { ssr: false, loading: ThreeLoading },
);
const HoweSewingMachine3D = dynamic(
  () => import("./three/HoweSewingMachine3D").then((mod) => mod.HoweSewingMachine3D),
  { ssr: false, loading: ThreeLoading },
);
const HullStereolithography3D = dynamic(
  () => import("./three/HullStereolithography3D").then((mod) => mod.HullStereolithography3D),
  { ssr: false, loading: ThreeLoading },
);
const HyattCelluloid3D = dynamic(
  () => import("./three/HyattCelluloid3D").then((mod) => mod.HyattCelluloid3D),
  { ssr: false, loading: ThreeLoading },
);
const KamenTransporter3D = dynamic(() => import("./three/KamenTransporter3D"), {
  ssr: false,
  loading: ThreeLoading,
});
const KamenSegway3D = dynamic(() => import("./three/KamenSegway3D").then((m) => m.KamenSegway3D), {
  ssr: false,
  loading: ThreeLoading,
});
const KamenMedicationInjection3D = dynamic(
  () => import("./three/KamenMedicationInjection3D").then((m) => m.KamenMedicationInjection3D),
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
const MarconiRadio3D = dynamic(
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
const MestralVelcro3D = dynamic(() => import("./three/MestralVelcro3D"), {
  ssr: false,
  loading: ThreeLoading,
});
const MetcalfeEthernet3D = dynamic(
  () => import("./three/MetcalfeEthernet3D").then((m) => m.MetcalfeEthernet3D),
  { ssr: false, loading: ThreeLoading },
);
const SikorskyHelicopter3D = dynamic(
  () => import("./three/SikorskyHelicopter3D").then((m) => m.SikorskyHelicopter3D),
  { ssr: false, loading: ThreeLoading },
);
const MorseTelegraph3D = dynamic(
  () => import("./three/MorseTelegraph3D").then((mod) => mod.MorseTelegraph3D),
  { ssr: false, loading: ThreeLoading },
);
const RillieuxEvaporator3D = dynamic(
  () => import("./three/RillieuxEvaporator3D").then((mod) => mod.RillieuxEvaporator3D),
  { ssr: false, loading: ThreeLoading },
);
const NobelDynamite3D = dynamic(
  () => import("./three/NobelDynamite3D").then((mod) => mod.NobelDynamite3D),
  { ssr: false, loading: ThreeLoading },
);
const NoycePlanarIC3D = dynamic(
  () => import("./three/NoyceSourceLead3D").then((mod) => mod.NoycePlanarIC3D),
  { ssr: false, loading: ThreeLoading },
);
const OtisHoistingApparatus3D = dynamic(
  () => import("./three/OtisHoistingApparatus3D").then((module) => module.OtisHoistingApparatus3D),
  { ssr: false, loading: ThreeLoading },
);
const OttoEngine3D = dynamic(() => import("./three/OttoEngine3D").then((mod) => mod.OttoEngine3D), {
  ssr: false,
  loading: ThreeLoading,
});
const ParsonsTurbine3D = dynamic(
  () => import("./three/ParsonsTurbine3D").then((mod) => mod.ParsonsTurbine3D),
  { ssr: false, loading: ThreeLoading },
);
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
const SundbackZipper3D = dynamic(() => import("./three/SundbackZipper3D"), {
  ssr: false,
  loading: ThreeLoading,
});
const SalisburyRobotHand3D = dynamic(() => import("./three/SalisburyRobotHand3D"), {
  ssr: false,
  loading: ThreeLoading,
});
const StackhouseManipulator3D = dynamic(() => import("./three/StackhouseSourceBounded3D"), {
  ssr: false,
  loading: ThreeLoading,
});
const MakinoScara3D = dynamic(() => import("./three/MakinoScara3D").then((m) => m.MakinoScara3D), {
  ssr: false,
  loading: ThreeLoading,
});
const MilacronRobotToolchanger3D = dynamic(
  () => import("./three/MilacronRobotToolchanger3D").then((m) => m.MilacronRobotToolchanger3D),
  { ssr: false, loading: ThreeLoading },
);
const RobotEndEffector3D = dynamic(
  () => import("./three/RobotEndEffector3D").then((m) => m.RobotEndEffector3D),
  { ssr: false, loading: ThreeLoading },
);
const DevolProgrammedTransfer3D = dynamic(
  () => import("./three/DevolProgrammedTransfer3D").then((m) => m.DevolProgrammedTransfer3D),
  { ssr: false, loading: ThreeLoading },
);
const AmfVersatran3D = dynamic(
  () => import("./three/AMFVersatran3D").then((m) => m.AmfVersatran3D),
  { ssr: false, loading: ThreeLoading },
);
const MaimanRubyLaser3D = dynamic(
  () => import("./three/MaimanRubyLaser3D").then((m) => m.MaimanRubyLaser3D),
  { ssr: false, loading: ThreeLoading },
);
const TownesLaser3D = dynamic(
  () => import("./three/TownesMaserSystem3D").then((mod) => mod.TownesLaser3D),
  { ssr: false, loading: ThreeLoading },
);
const LandPolaroid3D = dynamic(
  () => import("./three/LandPolaroid3D").then((mod) => mod.LandPolaroid3D),
  { ssr: false, loading: ThreeLoading },
);
const KilbyIntegratedCircuit3D = dynamic(
  () => import("./three/KilbySourceCircuit3D").then((mod) => mod.KilbyIntegratedCircuit3D),
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
const LemelsonAutomaticWarehousing3D = dynamic(
  () =>
    import("./three/LemelsonAutomaticWarehousing3D").then(
      (mod) => mod.LemelsonAutomaticWarehousing3D,
    ),
  { ssr: false, loading: ThreeLoading },
);
const LemelsonAutomaticProduction3D = dynamic(
  () =>
    import("./three/LemelsonAutomaticProduction3D").then(
      (mod) => mod.LemelsonAutomaticProduction3D,
    ),
  { ssr: false, loading: ThreeLoading },
);
const LemelsonAdjustableManipulator3D = dynamic(
  () =>
    import("./three/LemelsonAdjustableManipulator3D").then(
      (mod) => mod.LemelsonAdjustableManipulator3D,
    ),
  { ssr: false, loading: ThreeLoading },
);
const LemelsonMachineVision3D = dynamic(
  () => import("./three/LemelsonMachineVision3D").then((mod) => mod.LemelsonMachineVision3D),
  { ssr: false, loading: ThreeLoading },
);
const WatsonRemoteCenterCompliance3D = dynamic(
  () =>
    import("./three/WatsonRemoteCenterCompliance3D").then(
      (mod) => mod.WatsonRemoteCenterCompliance3D,
    ),
  { ssr: false, loading: ThreeLoading },
);
const WattRotaryEngine3D = dynamic(
  () => import("./three/WattRotaryEngine3D").then((mod) => mod.WattRotaryEngine3D),
  { ssr: false, loading: ThreeLoading },
);
const WattSeparateCondenser3D = dynamic(
  () => import("./three/WattSeparateCondenser3D").then((mod) => mod.WattSeparateCondenser3D),
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
const YaleLock3D = dynamic(
  () => import("./three/YaleLock3D").then((mod) => mod.YaleLock3D || mod.default),
  {
    ssr: false,
    loading: ThreeLoading,
  },
);
const PageRank3D = dynamic(() => import("./three/PageRank3D").then((mod) => mod.PageRank3D), {
  ssr: false,
  loading: ThreeLoading,
});
const Roomba3D = dynamic(() => import("./three/Roomba3D").then((mod) => mod.Roomba3D), {
  ssr: false,
  loading: ThreeLoading,
});
const DaVinciInterface3D = dynamic(
  () => import("./three/DaVinciInterface3D").then((mod) => mod.DaVinciInterface3D),
  {
    ssr: false,
    loading: ThreeLoading,
  },
);
const EInk3D = dynamic(() => import("./three/EInk3D").then((mod) => mod.EInk3D), {
  ssr: false,
  loading: ThreeLoading,
});
const MultiTouch3D = dynamic(() => import("./three/MultiTouch3D").then((mod) => mod.MultiTouch3D), {
  ssr: false,
  loading: ThreeLoading,
});

interface PatentVisualDispatcherProps {
  patentId: string;
}

// Visitor's last 3D/2D choice per patent. Face switches remount this
// dispatcher; without the map every switch reset to 3D and tore down +
// recreated a WebGL context (GPU churn, and a visitor preferring the 2D
// diagram had to re-select it on every face change).
const renderModeMemory = new Map<string, "3d-physics" | "vector-diagram">();

const PHONE_FOCUS_MEDIA_QUERY = "(max-width: 639px)";

export function PatentVisualDispatcher({ patentId }: PatentVisualDispatcherProps) {
  // This is deliberately read-only instrumentation. The visual modules and the
  // telemetry badge own their own subscriptions, while the dispatcher makes
  // the shared transport tick observable to browser acceptance tests without
  // inventing a second control path.
  const { tick: physicsTick, lastChange } = usePatentPhysics(patentId);
  const sourceVisualHold = patentVisualAvailability(patentId) === "source-hold";
  const [renderMode, setRenderMode] = useState<"3d-physics" | "vector-diagram">(
    () => renderModeMemory.get(patentId) ?? "3d-physics",
  );
  const dispatcherRef = useRef<HTMLDivElement>(null);
  const phoneFocusFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Listen at `document` rather than placing a focus handler on a static
    // layout element. React target handlers (including Colt's deliberate
    // click-preserving rAF) run first; this dispatcher-scoped listener then
    // makes the final measured correction on the same frame.
    const keepFocusedPhoneControlClear = (event: FocusEvent) => {
      const control = event.target;
      const dispatcher = dispatcherRef.current;
      if (
        !(control instanceof HTMLElement) ||
        !dispatcher?.contains(control) ||
        !control.matches("button, input, select, textarea") ||
        !window.matchMedia(PHONE_FOCUS_MEDIA_QUERY).matches
      ) {
        return;
      }

      if (phoneFocusFrameRef.current !== null) {
        window.cancelAnimationFrame(phoneFocusFrameRef.current);
      }
      phoneFocusFrameRef.current = window.requestAnimationFrame(() => {
        phoneFocusFrameRef.current = null;
        if (document.activeElement !== control || !control.isConnected) return;

        const canvas = dispatcher.querySelector("canvas");
        const stickyHeader = document.querySelector("header.sticky");
        if (!(canvas instanceof HTMLCanvasElement) || !(stickyHeader instanceof HTMLElement))
          return;

        const canvasRect = canvas.getBoundingClientRect();
        const headerRect = stickyHeader.getBoundingClientRect();
        const controlRect = control.getBoundingClientRect();
        if (
          headerRect.bottom <= 0 ||
          headerRect.top >= window.innerHeight ||
          canvasRect.width <= 0 ||
          canvasRect.height <= 0 ||
          controlRect.width <= 0 ||
          controlRect.height <= 0
        ) {
          return;
        }

        const plan = planPhoneFocusClearance(
          canvasRect,
          headerRect,
          controlRect,
          window.innerHeight,
        );
        if (!plan || Math.abs(plan.scrollTopDelta) < 0.5) return;

        const maximumScrollTop = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const boundedDelta = Math.min(
          maximumScrollTop - window.scrollY,
          Math.max(-window.scrollY, plan.scrollTopDelta),
        );
        // Do not knowingly trade the canvas/header overlap for a hidden
        // active control when the page cannot physically scroll far enough.
        if (Math.abs(boundedDelta - plan.scrollTopDelta) >= 0.5) return;

        window.scrollBy({ top: boundedDelta, behavior: "instant" });
      });
    };

    document.addEventListener("focusin", keepFocusedPhoneControlClear);
    return () => {
      document.removeEventListener("focusin", keepFocusedPhoneControlClear);
      if (phoneFocusFrameRef.current !== null) {
        window.cancelAnimationFrame(phoneFocusFrameRef.current);
      }
    };
  }, []);

  const switchRenderMode = (mode: "3d-physics" | "vector-diagram") => {
    renderModeMemory.set(patentId, mode);
    setRenderMode(mode);
  };

  return (
    <div
      ref={dispatcherRef}
      className="space-y-4"
      data-testid="patent-visual-dispatcher"
      data-visual-availability={sourceVisualHold ? "source-hold" : "interactive"}
      data-patent-id={patentId}
      data-render-mode={renderMode}
      data-physics-tick={physicsTick}
      data-physics-last-change={lastChange?.id ?? ""}
    >
      {/* 3D vs 2D Toggle Switcher. A source-held record has no modes to choose. */}
      {!sourceVisualHold && (
        <div className="flex justify-end">
          <div className="flex items-center gap-1 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs sm:text-sm font-sans shadow-sm">
            <button
              type="button"
              onClick={() => switchRenderMode("3d-physics")}
              aria-pressed={renderMode === "3d-physics"}
              className={`flex min-h-11 items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg transition-colors ${
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
              onClick={() => switchRenderMode("vector-diagram")}
              aria-pressed={renderMode === "vector-diagram"}
              className={`flex min-h-11 items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg transition-colors ${
                renderMode === "vector-diagram"
                  ? "bg-amber-600 text-white font-bold shadow-xs"
                  : "text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>2D Technical Diagram</span>
            </button>
          </div>
        </div>
      )}

      {/* Render Selected Visual Module */}
      <div data-testid="patent-visual-surface" data-render-mode={renderMode}>
        {(() => {
          switch (patentId) {
            case "gb-913-watt-separate-condenser":
              return renderMode === "3d-physics" ? (
                <WattSeparateCondenser3D />
              ) : (
                <WattSeparateCondenserSim />
              );
            case "gb-931-arkwright-water-frame":
              return (
                <>
                  <ArkwrightPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? (
                    <ArkwrightWaterFrame3D />
                  ) : (
                    <ArkwrightWaterFrameSim />
                  )}
                </>
              );
            case "gb-1306-watt-rotary-engine":
              return (
                <>
                  <WattRotaryPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? <WattRotaryEngine3D /> : <WattRotaryEngineSim />}
                </>
              );
            case "gb-1420-cort-puddling-rolling":
              return (
                <>
                  <CortPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? (
                    <CortPuddlingRolling3D />
                  ) : (
                    <CortPuddlingRollingSim />
                  )}
                </>
              );
            case "us-x1-hopkins-potash":
              return (
                <>
                  <HopkinsPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? <HopkinsPotash3D /> : <HopkinsPotashSim />}
                </>
              );
            case "us-x72-whitney-cotton-gin":
              return (
                <>
                  <WhitneyPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? <WhitneyCottonGin3D /> : <WhitneyCottonGinSim />}
                </>
              );
            case "us-x8277-mccormick-reaper":
              return (
                <>
                  <McCormickPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? <McCormickReaper3D /> : <McCormickReaperSim />}
                </>
              );
            case "us-x9430-colt-revolver":
              return (
                <>
                  <ColtPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? <ColtRevolver3D /> : <ColtRevolverSim />}
                </>
              );
            case "us-132-davenport-electric-motor":
              return renderMode === "3d-physics" ? (
                <DavenportElectricMotor3D />
              ) : (
                <DavenportMotorSim />
              );
            case "us-588-ericsson-propeller":
              return renderMode === "3d-physics" ? (
                <EricssonPropeller3D />
              ) : (
                <EricssonPropellerSim />
              );
            case "us-1647-morse-telegraph":
              return renderMode === "3d-physics" ? <MorseTelegraph3D /> : <MorseTelegraphSim />;
            case "us-3237-rillieux-evaporator":
              return renderMode === "3d-physics" ? (
                <RillieuxEvaporator3D />
              ) : (
                <RillieuxEvaporatorSim />
              );
            case "us-3633-goodyear-rubber":
              return renderMode === "3d-physics" ? <GoodyearRubber3D /> : <GoodyearRubberSim />;
            case "us-4750-howe-sewing-machine":
              return renderMode === "3d-physics" ? (
                <HoweSewingMachine3D />
              ) : (
                <HoweSewingMachineSim />
              );
            case "us-6162-corliss-steam-engine":
              return renderMode === "3d-physics" ? <CorlissSteamEngine3D /> : <CorlissEngineSim />;
            case "us-6469-lincoln-buoy":
              return renderMode === "3d-physics" ? <LincolnBuoy3D /> : <LincolnBuoySim />;
            case "us-31128-otis-elevator":
              return renderMode === "3d-physics" ? (
                <OtisHoistingApparatus3D />
              ) : (
                <OtisHoistingApparatusSim />
              );
            case "us-36836-gatling-gun":
              return renderMode === "3d-physics" ? <GatlingGun3D /> : <GatlingGunSim />;
            case "us-48475-yale-lock":
              return renderMode === "3d-physics" ? <YaleLock3D /> : <YaleLockSim />;
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
              return renderMode === "3d-physics" ? (
                <GliddenBarbedWire3D />
              ) : (
                <GliddenBarbedWireSim />
              );
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
            case "us-235199-bell-photophone":
              return renderMode === "3d-physics" ? <BellPhotophone3D /> : <BellPhotophoneSim />;
            case "us-247804-delaval-separator":
              return renderMode === "3d-physics" ? <DeLavalSeparator3D /> : <DeLavalSeparatorSim />;
            case "us-307031-edison-indicator":
              return renderMode === "3d-physics" ? <EdisonIndicator3D /> : <EdisonIndicatorSim />;
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
            case "us-400766-hall-aluminium":
              return renderMode === "3d-physics" ? <HallAluminium3D /> : <HallAluminiumSim />;
            case "us-470918-reno-escalator":
              return renderMode === "3d-physics" ? <RenoEscalator3D /> : <RenoEscalatorSim />;
            case "us-593138-tesla-coil":
              return renderMode === "3d-physics" ? <TeslaCoil3D /> : <TeslaCoilSim />;
            case "us-542846-diesel-engine":
              return renderMode === "3d-physics" ? <DieselEngine3D /> : <DieselEngineSim />;
            case "us-586193-marconi-radio":
              return (
                <>
                  <MarconiPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? <MarconiRadio3D /> : <MarconiRadioSim />}
                </>
              );
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
            case "us-682690-hewitt-mercury-lamp":
              return renderMode === "3d-physics" ? (
                <HewittMercuryLamp3D />
              ) : (
                <HewittMercuryLampSim />
              );
            case "us-706737-fessenden-wireless":
              return renderMode === "3d-physics" ? (
                <FessendenWireless3D />
              ) : (
                <FessendenWirelessSim />
              );
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
            case "us-821393-wright-flyer":
              return renderMode === "3d-physics" ? <WrightFlyer3D /> : <WrightFlyerSim />;
            case "us-879532-de-forest-audion":
              return renderMode === "3d-physics" ? <DeForestAudion3D /> : <DeForestAudionSim />;
            case "us-942699-baekeland-bakelite":
              return renderMode === "3d-physics" ? (
                <BaekelandBakelite3D />
              ) : (
                <BaekelandBakeliteSim />
              );
            case "us-971501-haber-ammonia":
              return renderMode === "3d-physics" ? <HaberAmmonia3D /> : <HaberAmmoniaSim />;
            case "us-1102653-goddard-rocket":
              return renderMode === "3d-physics" ? <GoddardRocket3D /> : <GoddardRocketSim />;
            case "us-1219881-sundback-zipper":
              return renderMode === "3d-physics" ? (
                <SundbackZipper3D patentId={patentId} />
              ) : (
                <SundbackZipperSim patentId={patentId} />
              );
            case "us-1773980-farnsworth-tv":
              return (
                <>
                  <FarnsworthTvPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? <FarnsworthTV3D /> : <FarnsworthTVSim />}
                </>
              );
            case "us-1781541-einstein-refrigerator":
              return renderMode === "3d-physics" ? (
                <EinsteinRefrigerator3D />
              ) : (
                <EinsteinRefrigeratorSim />
              );
            case "us-2292387-lamarr-frequency-hopping":
              return (
                <>
                  <LamarrPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? (
                    <LamarrFrequencyHopping3D />
                  ) : (
                    <LamarrFrequencyHoppingSim />
                  )}
                </>
              );
            case "us-2297691-carlson-electrophotography":
              return renderMode === "3d-physics" ? (
                <CarlsonElectrophotography3D />
              ) : (
                <CarlsonElectrophotographySim />
              );
            case "us-2495429-spencer-microwave":
              return renderMode === "3d-physics" ? <SpencerMicrowave3D /> : <SpencerMicrowaveSim />;
            case "us-2524035-bardeen-transistor":
              return renderMode === "3d-physics" ? (
                <BardeenTransistor3D />
              ) : (
                <BardeenTransistorSim />
              );
            case "us-2708656-fermi-reactor":
              return renderMode === "3d-physics" ? <FermiReactor3D /> : <FermiReactorSim />;
            case "us-2717437-mestral-velcro":
              return renderMode === "3d-physics" ? (
                <MestralVelcro3D patentId={patentId} />
              ) : (
                <MestralVelcroSim />
              );
            case "us-2846084-goertz-electronic-master-slave-manipulator":
              return renderMode === "3d-physics" ? (
                <GoertzElectronicMasterSlaveManipulator3D />
              ) : (
                <GoertzElectronicMasterSlaveManipulatorSim />
              );
            case "us-3353115-maiman-ruby-laser":
              return renderMode === "3d-physics" ? <MaimanRubyLaser3D /> : <MaimanRubyLaserSim />;
            case "us-2929922-townes-laser":
              return renderMode === "3d-physics" ? <TownesLaser3D /> : <TownesLaserSim />;
            case "us-2543181-land-polaroid":
              return renderMode === "3d-physics" ? <LandPolaroid3D /> : <LandPolaroidSim />;
            case "us-3138743-kilby-integrated-circuit":
              return renderMode === "3d-physics" ? (
                <KilbyIntegratedCircuit3D />
              ) : (
                <KilbyIntegratedCircuitSim />
              );

            case "us-2981877-noyce-ic":
              return renderMode === "3d-physics" ? <NoycePlanarIC3D /> : <NoycePlanarICSim />;
            case "us-3081379-lemelson-machine-vision":
              return renderMode === "3d-physics" ? (
                <LemelsonMachineVision3D />
              ) : (
                <LemelsonMachineVisionSim />
              );
            case "us-3119501-lemelson-automatic-warehousing":
              return renderMode === "3d-physics" ? (
                <LemelsonAutomaticWarehousing3D />
              ) : (
                <LemelsonAutomaticWarehousingSim />
              );
            case "us-3260375-lemelson-adjustable-manipulator":
              return renderMode === "3d-physics" ? (
                <LemelsonAdjustableManipulator3D />
              ) : (
                <LemelsonAdjustableManipulatorSim />
              );
            case "us-3313014-lemelson-automatic-production":
              return renderMode === "3d-physics" ? (
                <LemelsonAutomaticProduction3D />
              ) : (
                <LemelsonAutomaticProductionSim />
              );
            case "us-3541541-engelbart-mouse":
              return renderMode === "3d-physics" ? <EngelbartMouse3D /> : <EngelbartMouseSim />;
            case "us-3671542-kwolek-kevlar":
              return (
                <SourceVisualUnavailable
                  title="US 3,671,542 visual model in preparation"
                  detail="The complete page-marked transcript is readable on the Original Patent Text face, but manual source acceptance currently covers only the front sheet, nine checked drawing sheets, and two printed composition claims. The remaining specification, examples, tables, and correction certificates still need reconciliation before they can support a visual model. The inherited polymer, tensile, and ballistic scene remains unavailable because it would present later material behavior as a model of this grant."
                />
              );
            case "us-3728480-baer-odyssey":
              return (
                <>
                  <BaerOdysseyPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? <BaerOdyssey3D /> : <BaerOdysseySim />}
                </>
              );
            case "us-3923554-boyle-smith-ccd":
            case "us-3858232-boyle-smith-ccd":
              return (
                <>
                  <BoyleSmithCcdPhysicsRuntimeOwner patentId="us-3858232-boyle-smith-ccd" />
                  {renderMode === "3d-physics" ? <BoyleSmithCcd3D /> : <BoyleSmithCcdSim />}
                </>
              );
            case "us-4098001-watson-remote-center-compliance":
            case "us-4098001-watson-rcc":
              return renderMode === "3d-physics" ? (
                <WatsonRemoteCenterCompliance3D />
              ) : (
                <WatsonRemoteCenterComplianceSim />
              );
            case "us-3858581-kamen-medication-injection-device":
              return (
                <>
                  <KamenInjectionPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? (
                    <KamenMedicationInjection3D />
                  ) : (
                    <KamenMedicationInjectionSim />
                  )}
                </>
              );
            case "us-4068536-stackhouse-manipulator":
              return renderMode === "3d-physics" ? (
                <StackhouseManipulator3D />
              ) : (
                <StackhouseManipulatorSim />
              );
            case "us-4063220-metcalfe-ethernet":
              return (
                <>
                  <MetcalfeEthernetPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? <MetcalfeEthernet3D /> : <MetcalfeEthernetSim />}
                </>
              );
            case "us-2318259-sikorsky-helicopter":
              return renderMode === "3d-physics" ? (
                <SikorskyHelicopter3D />
              ) : (
                <SikorskyHelicopterSim />
              );
            case "us-4136359-wozniak-apple":
              return renderMode === "3d-physics" ? <WozniakApple3D /> : <WozniakAppleSim />;
            case "us-2988237-devol-programmed-transfer":
              return renderMode === "3d-physics" ? (
                <DevolProgrammedTransfer3D />
              ) : (
                <DevolProgrammedTransferSim />
              );
            case "us-3212649-amf-versatran":
              return renderMode === "3d-physics" ? <AmfVersatran3D /> : <AmfVersatranSim />;
            case "us-4341502-makino-scara":
              return renderMode === "3d-physics" ? <MakinoScara3D /> : <MakinoScaraSim />;
            case "us-4512709-milacron-robot-toolchanger":
              return renderMode === "3d-physics" ? (
                <MilacronRobotToolchanger3D />
              ) : (
                <MilacronRobotToolchangerSim />
              );
            case "us-4575330-hull-stereolithography":
              return renderMode === "3d-physics" ? (
                <HullStereolithography3D />
              ) : (
                <HullStereolithographySim />
              );
            case "us-4765668-robot-end-effector":
              return renderMode === "3d-physics" ? <RobotEndEffector3D /> : <RobotEndEffectorSim />;
            case "us-4921293-salisbury-robot-hand":
              return renderMode === "3d-physics" ? (
                <SalisburyRobotHand3D patentId={patentId} />
              ) : (
                <SalisburyRobotHandSim patentId={patentId} />
              );
            case "us-4976582-clavel-delta-robot":
              return renderMode === "3d-physics" ? <ClavelDeltaRobot3D /> : <ClavelDeltaRobotSim />;
            case "us-5121329-crump-fdm":
              return renderMode === "3d-physics" ? (
                <CrumpFdm3D patentId={patentId} />
              ) : (
                <CrumpFdmSim />
              );
            case "us-5701965-kamen-transporter":
              return renderMode === "3d-physics" ? (
                <KamenTransporter3D patentId={patentId} />
              ) : (
                <KamenTransporterSim patentId={patentId} />
              );
            case "us-6302230-kamen-segway":
              return renderMode === "3d-physics" ? (
                <KamenSegway3D patentId={patentId} />
              ) : (
                <KamenSegwaySim patentId={patentId} />
              );
            case "us-6120588-eink":
              return (
                <>
                  <EInkPhysicsRuntimeOwner patentId={patentId} />
                  {renderMode === "3d-physics" ? <EInk3D /> : <EInkSim />}
                </>
              );
            case "us-6285999-pagerank":
              return renderMode === "3d-physics" ? <PageRank3D /> : <PageRankSim />;
            case "us-6331181-davinci":
              return renderMode === "3d-physics" ? <DaVinciInterface3D /> : <DaVinciInterfaceSim />;
            case "us-6594844-roomba":
              return renderMode === "3d-physics" ? <Roomba3D /> : <RoombaSim />;
            case "us-7479949-multitouch":
              return renderMode === "3d-physics" ? <MultiTouch3D /> : <MultiTouchSim />;

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
    </div>
  );
}
