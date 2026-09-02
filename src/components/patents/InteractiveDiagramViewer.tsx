"use client";

import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Layers,
  MapPin,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  bardeenSchematicDie,
  coltSchematicTrigger,
  corlissSchematicValve,
  davenportSchematicArmature,
  delavalSchematicDiscY,
  edisonSchematicGlowFill,
  edisonSchematicGlowOpacity,
  edisonSchematicGrooveX,
  edisonSchematicTerminal,
  einsteinSchematicVessel,
  engelbartSchematicWheel,
  gatlingSchematicBarrelY,
  gliddenSchematicSpurX,
  goodyearSchematicCrosslink,
  goodyearSchematicLink,
  goodyearSchematicStrand,
  grammeSchematicBrush,
  grammeSchematicJunction,
  hollerithSchematicDialX,
  hollerithSchematicPinX,
  hyattSchematicMold,
  hyattSchematicRam,
  kevlarSchematicBond,
  kevlarSchematicLattice,
  lincolnSchematicChamber,
  mccormickSchematicReelArm,
  mccormickSchematicSickleX,
  morseSchematicInstrument,
  nobelSchematicKieselguhr,
  stepBardeenTransistor,
  stepBellTelephone,
  stepColtRevolver,
  stepCorlissEngine,
  stepDavenportMotor,
  stepDeLavalSeparator,
  stepEdisonBulb,
  stepEdisonPhonograph,
  stepEinsteinRefrigerator,
  stepEngelbartMouse,
  stepEricssonPropeller,
  stepGatlingGun,
  stepGliddenBarbedWire,
  stepGoodyearRubber,
  stepGrammeDynamo,
  stepHollerithTabulating,
  stepHyattCelluloid,
  stepKevlarContinuum,
  stepLincolnBuoy,
  stepMarconiRadio,
  stepMaximMachineGun,
  stepMcCormickReaper,
  stepMorseTelegraph,
  stepNobelDynamite,
  stepOttoEngine,
  stepThomsonWelding,
  stepWhitneyCottonGin,
  stepWozniakApple,
  stepZeppelinAirship,
  thomsonSchematicJawX,
  whitneySchematicRay,
  wozniakSchematicChip,
  zeppelinSchematicCell,
  zeppelinSchematicGondola,
} from "@/physics/catalogKernels";
import { stepDevolProgrammedTransfer } from "@/physics/devolProgrammedTransferKernel";
import { FrankenSimEngine, lamarrSchematicHop, lamarrSchematicStaffY } from "@/physics/engine";
import { fermiSchematicSlug, stepFermiKinetics } from "@/physics/fermiKinetics";
import { stepGoertzMasterSlaveTopology } from "@/physics/goertzElectronicMasterSlaveManipulatorKernel";
import { stepKamenInjectionMechanism } from "@/physics/kamenInjectionKernel";
import { stepLemelsonManipulatorTopology } from "@/physics/lemelsonAdjustableManipulatorKernel";
import { stepLemelsonAutomaticProductionTopology } from "@/physics/lemelsonAutomaticProductionKernel";
import { stepLemelsonWarehouseTopology } from "@/physics/lemelsonWarehouseKernel";
import {
  ccdSchematicGateX,
  mergenthalerSchematicChuteX,
  renoSchematicCleat,
  sholesSchematicTypebar,
  stepCcdWells,
  stepHoweSewingMachine,
  stepMergenthalerLinotype,
  stepRenoEscalator,
  stepSholesTypewriter,
} from "@/physics/machineKernels";
import { stepMakinoScaraTopology } from "@/physics/makinoScaraKernel";
import { stepMilacronRobotToolchanger } from "@/physics/milacronRobotToolchangerKernel";
import { readOtisTopologyControls, stepOtis1861Topology } from "@/physics/otisKernel";
import { stepParsonsMarine } from "@/physics/parsonsMarineKernel";
import { stepRobotEndEffector } from "@/physics/robotEndEffectorKernel";
import { readSalisburyRobotHandControls } from "@/physics/salisburyRobotHandKernel";
import { stepStackhouseSourceTopology } from "@/physics/stackhouseSourceKernel";
import {
  stepTeslaMotorFig9,
  teslaBAt,
  teslaFig4Strobe,
  teslaSchematicPoleRect,
  teslaSchematicStrobeOpacity,
} from "@/physics/teslaKernel";
import {
  TESLA_TRANSFORMER_SCHEMATIC,
  teslaTransformerSecondaryPath,
  teslaTransformerSecondaryTerminals,
} from "@/physics/teslaTransformerKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { stepWatsonRemoteCenterComplianceTopology } from "@/physics/watsonRemoteCenterComplianceKernel";
import { materialProbe, whitneySamples } from "@/physics/weaveSurfaces";
import { wrightSchematicPose, wrightWarpFromPointerNx } from "@/physics/wrightKernel";
import type { PatentDrawing } from "@/types/patent";

const SCHEMATIC_VIEW_W = 400;
const SCHEMATIC_VIEW_H = 300;
const SCHEMATIC_CALLOUT_SPACE = 100;
const SCHEMATIC_RETICLE_INNER_R = 18;
const SCHEMATIC_RETICLE_OUTER_R = 28;
const SCHEMATIC_RETICLE_HAIR = 36;
const DEFAULT_SCHEMATIC_CX = 200;
const DEFAULT_SCHEMATIC_CY = 150;
const DEFAULT_SCHEMATIC_RX = 140;
const DEFAULT_SCHEMATIC_RY = 70;
const DEFAULT_SCHEMATIC_LINE_X0 = 60;
const DEFAULT_SCHEMATIC_LINE_X1 = 340;
const DEFAULT_SCHEMATIC_LINE_Y0 = 80;
const DEFAULT_SCHEMATIC_LINE_Y1 = 220;
const DEFAULT_SCHEMATIC_RECT_X = 140;
const DEFAULT_SCHEMATIC_RECT_Y = 105;
const DEFAULT_SCHEMATIC_RECT_W = 120;
const DEFAULT_SCHEMATIC_RECT_H = 90;
const DEFAULT_SCHEMATIC_HUB_R = 28;

const NOYCE_FIGURE_SOURCE_CROPS: Readonly<Record<string, string>> = {
  "Fig. 1": "/patents/figures/us-2981877-noyce-ic/fig-1-source-crop-v1.png",
  "Fig. 2": "/patents/figures/us-2981877-noyce-ic/fig-2-source-crop-v1.png",
  "Fig. 3": "/patents/figures/us-2981877-noyce-ic/fig-3-source-crop-v1.png",
  "Fig. 4": "/patents/figures/us-2981877-noyce-ic/fig-4-source-crop-v1.png",
  "Fig. 5": "/patents/figures/us-2981877-noyce-ic/fig-5-source-crop-v1.png",
  "Fig. 6": "/patents/figures/us-2981877-noyce-ic/fig-6-source-crop-v1.png",
  "Fig. 7": "/patents/figures/us-2981877-noyce-ic/fig-7-source-crop-v1.png",
};

function noyceFigureSourceCrop(figureNumber: string): string | null {
  return NOYCE_FIGURE_SOURCE_CROPS[figureNumber] ?? null;
}

/** Map 0–100 callout space onto the 400×300 schematic viewBox. */
function schematicCalloutSvg(xPct: number, yPct: number) {
  return {
    x: (xPct / SCHEMATIC_CALLOUT_SPACE) * SCHEMATIC_VIEW_W,
    y: (yPct / SCHEMATIC_CALLOUT_SPACE) * SCHEMATIC_VIEW_H,
  };
}

interface InteractiveDiagramViewerProps {
  drawings: PatentDrawing[];
  patentNumber: string;
  patentId?: string;
}

const SCHEMATIC_HINTS: Array<[RegExp, string]> = [
  [/versatran|3212649|3,212,649/, "amf-versatran"],
  [/salisbury|4921293|4,921,293/, "salisbury-robot-hand"],
  [/milacron|4512709|4,512,709/, "milacron-robot-toolchanger"],
  [/segway|6302230|6,302,230/, "kamen-segway"],
  [/devol|programmed[- ]transfer|2988.?237/, "devol-programmed-transfer"],
  [/wright|821.?393/, "wright-flyer"],
  [/tesla[- ]coil|533.?367|593.?138/, "tesla-coil"],
  [/tesla|381.?968/, "tesla-motor"],
  [/edison|223.?898/, "edison-bulb"],
  [/farnsworth|1773980|1,773,980/, "farnsworth-tv"],
  [/spencer|microwave|2495429|2,495,429/, "spencer-microwave"],
  [/noyce|2981877|2,981,877/, "noyce-ic"],
  [/kwolek|kevlar|3671542|3,671,542/, "kwolek-kevlar"],
  [/bell|174465|174,465/, "bell-phone"],
  [/lincoln|buoy|6281|6469|6,469/, "lincoln-buoy"],
  [/howe|sewing|4750|4,750/, "howe-sewing"],
  [/goddard|rocket|1155986|1,155,986|1102653|1,102,653/, "goddard-rocket"],
  [/bardeen|transistor|2569347|2,569,347|2524191/, "bardeen-transistor"],
  [/boyle|ccd|3923554|3,923,554|3858232|3,858,232|3792322/, "boyle-smith-ccd"],
  [/morse|telegraph|1647|1,647/, "morse-telegraph"],
  [/goodyear|rubber|3633|3,633/, "goodyear-rubber"],
  [/lamarr|hopping|2292387|2,292,387/, "lamarr-frequency-hopping"],
  [/marconi|586193|586,193/, "marconi-radio"],
  [/engelbart|mouse|3541541|3,541,541/, "engelbart-mouse"],
  [/fermi|reactor|2708656|2,708,656/, "fermi-reactor"],
  [/wozniak|apple|4136359|4,136,359/, "wozniak-apple"],
  [/einstein|refrigerator|1781541|1,781,541/, "einstein-refrigerator"],
  [/colt|revolver|138|x9430|9430/, "colt-revolver"],
  [/otis|elevator|31128|31,128/, "otis-elevator"],
  [/watt.*rotary|sun.*planet|1306/, "watt-rotary-engine"],
  [/watt|separate[- ]condenser|913/, "watt-separate-condenser"],
  [/arkwright|water[- ]frame|931/, "arkwright-water-frame"],
  [/cort|puddling|rolling|1420/, "cort-puddling-rolling"],
  [/whitney|cotton[- ]gin|x72/, "whitney-cotton-gin"],
  [/mccormick|reaper|x8277|4895|4,895/, "mccormick-reaper"],
  [/davenport|132/, "davenport-motor"],
  [/ericsson|propeller|588/, "ericsson-propeller"],
  [/corliss|steam|6162|6,162/, "corliss-engine"],
  [/gatling|battery|36836|36,836/, "gatling-gun"],
  [/nobel|dynamite|78317|78,317/, "nobel-dynamite"],
  [/sholes|typewriter|79265|79,265/, "sholes-typewriter"],
  [/hyatt|celluloid|105338|105,338/, "hyatt-celluloid"],
  [/gramme|dynamo|120057|120,057/, "gramme-dynamo"],
  [/westinghouse|air[- ]brake|124404|124,404/, "westinghouse-air-brake"],
  [/pasteur-fermentation-fig-2/, "pasteur-fermentation-fig-2"],
  [/pasteur|fermentation|135245|135,245/, "pasteur-fermentation"],
  [/glidden|barbed[- ]wire|157124|157,124/, "glidden-barbed-wire"],
  [/otto|194047|194,047/, "otto-engine"],
  [/phonograph|200521|200,521/, "edison-phonograph"],
  [/pelton|water[- ]wheel|233692|233,692/, "pelton-water-wheel"],
  [/delaval|247804|247,804/, "delaval-separator"],
  [/mergenthaler|linotype|313224|313,224/, "mergenthaler-linotype"],
  [/maxim|machine[- ]gun|319596|319,596/, "maxim-machine-gun"],
  [/thomson|welding|347140|347,140/, "thomson-welding"],
  [/daimler|361931|361,931/, "daimler-engine"],
  [/eastman|kodak|388850|388,850/, "eastman-kodak"],
  [/hollerith|tabulating|395781|395,781/, "hollerith-tabulating"],
  [/reno|escalator|470918|470,918/, "reno-escalator"],
  [/diesel|542846|542,846/, "diesel-engine"],
  [/marine steam[- ]turbine|608969|608,969/, "parsons-turbine"],
  [/teleautomaton|613809|613,809/, "tesla-teleautomaton"],
  [/zeppelin|airship|621195|621,195/, "zeppelin-airship"],
  [/de[- ]?forest|audion|879532|879,532/, "de-forest-audion"],
  [/hewitt|mercury[- ]lamp|682690|682,690/, "hewitt-mercury-lamp"],
  [/fessenden|wireless|706737|706,737/, "fessenden-wireless"],
  [/linde|liquefaction|727650|727,650/, "linde-air-liquefaction"],
  [/carrier|condition|808897|808,897/, "carrier-air-conditioner"],
];

/**
 * Every dedicated case label rendered by _renderHistoricalSchematic. An
 * authored svgType that names one of these kinds must always win: routing by
 * substring over patent numbers and figure labels once sent Daimler to the
 * Arkwright diagram (/931/), Carrier to DeLaval (/separator/), Edison
 * Phonograph to the bulb (/edison/), and Kilby to Colt (/138/).
 */
const SCHEMATIC_SWITCH_ARM_IS_KIND: Record<string, true> = {
  "arkwright-water-frame": true,
  "baekeland-bakelite": true,
  "bardeen-transistor": true,
  "bell-phone": true,
  "boyle-smith-ccd": true,
  "carlson-electrophotography": true,
  "carlson-electrophotography-charging": true,
  "carlson-electrophotography-rotary": true,
  "carrier-air-conditioner": true,
  "colt-revolver": true,
  "corliss-engine": true,
  "cort-puddling-rolling": true,
  "daimler-engine": true,
  "davenport-motor": true,
  "devol-programmed-transfer": true,
  "de-forest-audion": true,
  "delaval-separator": true,
  "diesel-engine": true,
  "eastman-kodak": true,
  "edison-bulb": true,
  "edison-phonograph": true,
  "einstein-refrigerator": true,
  "engelbart-mouse": true,
  "ericsson-propeller": true,
  "farnsworth-tv": true,
  "fermi-reactor": true,
  "fessenden-wireless": true,
  "gatling-gun": true,
  "glidden-barbed-wire": true,
  "goddard-rocket": true,
  "goertz-master-slave": true,
  "goodyear-rubber": true,
  "gramme-dynamo": true,
  "haber-ammonia": true,
  "hewitt-mercury-lamp": true,
  "hollerith-tabulating": true,
  "howe-sewing": true,
  "hyatt-celluloid": true,
  "hull-stereolithography": true,
  "kilby-ic-components": true,
  "kilby-ic-multivibrator": true,
  "kilby-ic-transistor": true,
  "kamen-injection-device": true,
  "kamen-segway": true,
  "kwolek-kevlar": true,
  "lamarr-frequency-hopping": true,
  "lincoln-buoy": true,
  "makino-scara": true,
  "robot-end-effector": true,
  "salisbury-robot-hand": true,
  "linde-air-liquefaction": true,
  "lemelson-automatic-production": true,
  "lemelson-adjustable-manipulator": true,
  "lemelson-adjustable-manipulator-side": true,
  "lemelson-adjustable-manipulator-control": true,
  "marconi-radio": true,
  "maxim-machine-gun": true,
  "mccormick-reaper": true,
  "mergenthaler-linotype": true,
  "mestral-velcro": true,
  "milacron-robot-toolchanger": true,
  "morse-telegraph": true,
  "nobel-dynamite": true,
  "noyce-ic": true,
  "otis-elevator": true,
  "otto-engine": true,
  "parsons-turbine": true,
  "pasteur-fermentation": true,
  "pasteur-fermentation-fig-2": true,
  "pelton-water-wheel": true,
  "polaroid-film-stack": true,
  "polaroid-roller-spread": true,
  "reno-escalator": true,
  "sholes-typewriter": true,
  "spencer-microwave": true,
  "stackhouse-manipulator": true,
  "sundback-zipper": true,
  "tesla-coil": true,
  "tesla-motor": true,
  "tesla-teleautomaton": true,
  "thomson-welding": true,
  "townes-laser-cavity": true,
  "townes-laser-energy": true,
  "townes-laser-system": true,
  "watt-rotary-engine": true,
  "watt-separate-condenser": true,
  "westinghouse-air-brake": true,
  "whitney-cotton-gin": true,
  "watson-remote-center-compliance": true,
  "wozniak-apple": true,
  "wright-flyer": true,
  "zeppelin-airship": true,
};

function resolveSchematicKind(
  svgType: string,
  _figureNumber: string,
  _patentNumber: string,
  _patentId?: string,
): string {
  const t = svgType.toLowerCase();
  if (t === "generic") return "generic";
  if (t === "wright-fig1" || t === "wright-fig2") return "wright-flyer";
  // Authored identity wins outright.
  if (SCHEMATIC_SWITCH_ARM_IS_KIND[t]) return t;
  // Family variants ("carlson-electrophotography-transfer",
  // "edison-phonograph-fig2") route to their longest known arm prefix.
  const segments = t.split("-");
  for (let len = segments.length - 1; len >= 2; len--) {
    const candidate = segments.slice(0, len).join("-");
    if (SCHEMATIC_SWITCH_ARM_IS_KIND[candidate]) return candidate;
  }
  // Last resort: name hints against the svgType alone. Formatted patent
  // numbers and figure labels stay out of the haystack — their bare digits
  // are cross-record hijacks, not identities.
  for (const [pattern, kind] of SCHEMATIC_HINTS) {
    if (pattern.test(t)) return kind;
  }
  return "generic";
}

/**
 * Renders authentic historical blueprint vector schematics matching the patent's figure type.
 */
function _renderHistoricalSchematic(
  svgType: string,
  figureNumber: string,
  patentNumber: string,
  patentId?: string,
  params?: Record<string, number>,
) {
  const kind = resolveSchematicKind(svgType, figureNumber, patentNumber, patentId);
  switch (kind) {
    case "wright-flyer": {
      const pose = wrightSchematicPose(params);
      const warp = pose.warpPx;
      const rudderAngle = pose.rudderAngle;
      const adverse = pose.adverse;
      const rasterSkew = pose.rasterSkew;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <defs>
            <marker
              id="parsons-schematic-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
            </marker>
          </defs>
          <g
            opacity="0.28"
            transform={`skewX(${rasterSkew})`}
            stroke="#94a3b8"
            strokeDasharray="1 2"
          >
            <rect
              x={pose.schematicRasterX}
              y={pose.schematicRasterY}
              width={pose.schematicRasterW}
              height={pose.schematicRasterH}
              fill="none"
              strokeWidth="1"
            />
            <text x="32" y="42" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              USPTO Fig. 4 raster · live warp
            </text>
          </g>
          {adverse && (
            <g>
              <rect
                x={pose.schematicAdverseX}
                y={pose.schematicAdverseY}
                width={pose.schematicAdverseW}
                height={pose.schematicAdverseH}
                fill="#f43f5e"
                fillOpacity="0.12"
                stroke="#f43f5e"
                strokeDasharray="4 3"
              />
              <text x="258" y="88" fill="#fb7185" fontSize="8" fontFamily="monospace">
                invalid: uncoupled yaw
              </text>
            </g>
          )}
          {/* Upper & Lower Biplane Wings with Dynamic Warping Differential */}
          <path
            d={`M ${pose.schematicWingX0} ${pose.schematicUpperBaseY - warp} Q ${pose.schematicWingMidX} ${pose.schematicUpperQ0} ${pose.schematicWingX1} ${pose.schematicUpperBaseY + warp} Q ${pose.schematicWingMidX} ${pose.schematicUpperQ1} ${pose.schematicWingX0} ${pose.schematicUpperBaseY - warp} Z`}
            fill="#0284c7"
            fillOpacity="0.15"
          />
          <path
            d={`M ${pose.schematicWingX0} ${pose.schematicLowerBaseY - warp} Q ${pose.schematicWingMidX} ${pose.schematicLowerQ0} ${pose.schematicWingX1} ${pose.schematicLowerBaseY + warp} Q ${pose.schematicWingMidX} ${pose.schematicLowerQ1} ${pose.schematicWingX0} ${pose.schematicLowerBaseY - warp} Z`}
            fill="#0284c7"
            fillOpacity="0.15"
          />
          {/* Vertical Struts with Universal Pivots */}
          <line
            x1={pose.schematicStrutXs[0]}
            y1={pose.schematicEdgeStrutY0 - pose.strutDelta}
            x2={pose.schematicStrutXs[0]}
            y2={pose.schematicEdgeStrutY1 - pose.strutDelta}
            strokeWidth="2"
            stroke="#bae6fd"
          />
          <line
            x1={pose.schematicStrutXs[1]}
            y1={pose.schematicInnerStrutY0}
            x2={pose.schematicStrutXs[1]}
            y2={pose.schematicInnerStrutY1}
            strokeWidth="2"
            stroke="#bae6fd"
          />
          <line
            x1={pose.schematicStrutXs[2]}
            y1={pose.schematicInnerStrutY0}
            x2={pose.schematicStrutXs[2]}
            y2={pose.schematicInnerStrutY1}
            strokeWidth="2"
            stroke="#bae6fd"
          />
          <line
            x1={pose.schematicStrutXs[3]}
            y1={pose.schematicEdgeStrutY0 + pose.strutDelta}
            x2={pose.schematicStrutXs[3]}
            y2={pose.schematicEdgeStrutY1 + pose.strutDelta}
            strokeWidth="2"
            stroke="#bae6fd"
          />
          <line
            x1={pose.schematicStrutXs[0]}
            y1={pose.schematicEdgeStrutY0 - pose.strutDelta}
            x2={pose.schematicStrutXs[1]}
            y2={pose.schematicInnerStrutY1}
            strokeDasharray="3 2"
            stroke="#7dd3fc"
          />
          <line
            x1={pose.schematicStrutXs[1]}
            y1={pose.schematicInnerStrutY0}
            x2={pose.schematicStrutXs[0]}
            y2={pose.schematicEdgeStrutY1 - pose.strutDelta}
            strokeDasharray="3 2"
            stroke="#7dd3fc"
          />
          <line
            x1={pose.schematicStrutXs[2]}
            y1={pose.schematicInnerStrutY0}
            x2={pose.schematicStrutXs[3]}
            y2={pose.schematicEdgeStrutY1 + pose.strutDelta}
            strokeDasharray="3 2"
            stroke="#7dd3fc"
          />
          <line
            x1={pose.schematicStrutXs[3]}
            y1={pose.schematicEdgeStrutY0 + pose.strutDelta}
            x2={pose.schematicStrutXs[2]}
            y2={pose.schematicInnerStrutY1}
            strokeDasharray="3 2"
            stroke="#7dd3fc"
          />
          <rect
            x={pose.schematicCanardX}
            y={pose.schematicCanardY}
            width={pose.schematicCanardW}
            height={pose.schematicCanardH}
            rx="3"
            fill="#0369a1"
            fillOpacity="0.3"
            stroke="#38bdf8"
          />
          <line
            x1={pose.schematicCanardBraceX0}
            y1={pose.schematicCanardBraceY0}
            x2={pose.schematicCanardBraceX1}
            y2={pose.schematicCanardBraceY1}
            stroke="#bae6fd"
          />
          <line
            x1={pose.schematicCanardBraceX2}
            y1={pose.schematicCanardBraceY0}
            x2={pose.schematicCanardBraceX3}
            y2={pose.schematicCanardBraceY1}
            stroke="#bae6fd"
          />
          <g
            transform={`rotate(${rudderAngle} ${pose.schematicRudderPivotX} ${pose.schematicRudderPivotY})`}
          >
            <rect
              x={pose.schematicRudderX}
              y={pose.schematicRudderY}
              width={pose.schematicRudderW}
              height={pose.schematicRudderH}
              rx="2"
              fill="#0369a1"
              fillOpacity="0.3"
              stroke="#38bdf8"
            />
            <line
              x1={pose.schematicRudderPostX0}
              y1={pose.schematicRudderPostY0}
              x2={pose.schematicRudderPostX0}
              y2={pose.schematicRudderY}
              stroke="#bae6fd"
              strokeWidth="2"
            />
            <line
              x1={pose.schematicRudderPostX1}
              y1={pose.schematicRudderPostY0}
              x2={pose.schematicRudderPostX1}
              y2={pose.schematicRudderY}
              stroke="#bae6fd"
              strokeWidth="2"
            />
          </g>
          <rect
            x={pose.schematicCradleX}
            y={pose.schematicCradleY}
            width={pose.schematicCradleW}
            height={pose.schematicCradleH}
            rx="3"
            fill="#f59e0b"
            fillOpacity="0.3"
            stroke="#f59e0b"
          />
        </g>
      );
    }
    case "tesla-motor": {
      const freq = params?.frequency ?? 60;
      const apparatus = stepTeslaMotorFig9(freq);
      const omegaT = ((params?.omegaT ?? 0) * Math.PI) / 180;
      const live = teslaBAt(omegaT);
      const strobe = teslaFig4Strobe();
      const whitney = whitneySamples(omegaT);
      const arrow = (bx: number, by: number, len: number, opacity: number, width: number) => {
        const x2 = apparatus.statorCenterX + bx * len;
        const y2 = apparatus.statorCenterY - by * len;
        return (
          <g key={`${bx.toFixed(3)}-${by.toFixed(3)}-${opacity}`} opacity={opacity}>
            <line
              x1={apparatus.statorCenterX}
              y1={apparatus.statorCenterY}
              x2={x2}
              y2={y2}
              stroke="#ef4444"
              strokeWidth={width}
            />
          </g>
        );
      };
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <circle
            cx={apparatus.statorCenterX}
            cy={apparatus.statorCenterY}
            r={apparatus.schematicStatorOuterR}
            strokeWidth="2.5"
            stroke="#60a5fa"
          />
          <circle
            cx={apparatus.statorCenterX}
            cy={apparatus.statorCenterY}
            r={apparatus.schematicStatorInnerR}
            strokeWidth="1.5"
            stroke="#3b82f6"
            fill="#1e3a8a"
            fillOpacity={apparatus.schematicFillOpacity}
          />
          {Array.from({ length: apparatus.schematicPoleCount }, (_, i) => {
            const pole = teslaSchematicPoleRect(i);
            const isVertical = pole.h > pole.w;
            return (
              <rect
                key={i}
                x={pole.x}
                y={pole.y}
                width={pole.w}
                height={pole.h}
                rx="4"
                fill={isVertical ? "#2563eb" : "#d97706"}
                fillOpacity="0.3"
                stroke={isVertical ? "#38bdf8" : "#f59e0b"}
                strokeWidth="2"
              />
            );
          })}
          <circle
            cx={apparatus.statorCenterX}
            cy={apparatus.statorCenterY}
            r={apparatus.schematicRotorR}
            fill="#047857"
            fillOpacity="0.2"
            stroke="#10b981"
            strokeWidth="2"
          />
          <circle
            cx={apparatus.statorCenterX}
            cy={apparatus.statorCenterY}
            r={apparatus.schematicHubR}
            fill="#10b981"
          />
          {strobe.map((s, i) =>
            arrow(
              s.bx,
              s.by,
              apparatus.schematicStrobeLen,
              teslaSchematicStrobeOpacity(
                i,
                apparatus.schematicStrobeOpacityBase,
                apparatus.schematicStrobeOpacityStep,
              ),
              apparatus.schematicStrobeStroke,
            ),
          )}
          {arrow(live.bx, live.by, apparatus.schematicLiveLen, 1, apparatus.schematicLiveStroke)}
          {whitney.map((w, i) => (
            <line
              key={`wh-${i}`}
              x1={apparatus.statorCenterX + w.x * apparatus.schematicWhitneyPos}
              y1={apparatus.statorCenterY - w.y * apparatus.schematicWhitneyPos}
              x2={
                apparatus.statorCenterX +
                w.x * apparatus.schematicWhitneyPos +
                w.bx * apparatus.schematicWhitneyB
              }
              y2={
                apparatus.statorCenterY -
                w.y * apparatus.schematicWhitneyPos -
                w.by * apparatus.schematicWhitneyB
              }
              stroke="#a78bfa"
              strokeWidth="1.2"
              opacity="0.7"
            />
          ))}
        </g>
      );
    }
    case "tesla-coil": {
      const coil = TESLA_TRANSFORMER_SCHEMATIC;
      const secondaryPath = teslaTransformerSecondaryPath();
      const secondaryTerminals = teslaTransformerSecondaryTerminals();
      const commonNodeConnected = (params?.claim1CommonNodeConnected ?? 1) >= 0.5;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={coil.baseX}
            y={coil.baseY}
            width={coil.baseWidth}
            height={coil.baseHeight}
            rx="3"
            fill="#334155"
            stroke="#94a3b8"
          />
          <path
            d={coil.coneSupportPath}
            fill="#1e3a8a"
            fillOpacity="0.18"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <path d={secondaryPath} stroke="#fbbf24" strokeWidth="2.5" />
          <path d={coil.primaryWindingPath} stroke="#f59e0b" strokeWidth="3" />
          <line x1="58" y1="220" x2="82" y2="220" stroke="#f59e0b" strokeWidth="3" />
          <line x1="110" y1="220" x2="330" y2="220" stroke="#f59e0b" strokeWidth="3" />
          {commonNodeConnected ? (
            <line
              x1={secondaryTerminals.low.x}
              y1={secondaryTerminals.low.y}
              x2={coil.commonNodeX}
              y2={coil.commonNodeY}
              stroke="#fbbf24"
              strokeWidth="2"
            />
          ) : (
            <>
              <line
                x1={secondaryTerminals.low.x}
                y1={secondaryTerminals.low.y}
                x2="218"
                y2={coil.commonNodeY}
                stroke="#fbbf24"
                strokeWidth="2"
              />
              <line x1="242" y1="220" x2="330" y2="220" stroke="#fbbf24" strokeWidth="2" />
              <circle cx="218" cy="220" r="4" fill="#be123c" stroke="#fb7185" />
              <circle cx="242" cy="220" r="4" fill="#be123c" stroke="#fb7185" />
              <text x="230" y="211" fill="#fb7185" fontSize="8" textAnchor="middle">
                open
              </text>
            </>
          )}
          <circle cx={coil.commonNodeX} cy={coil.commonNodeY} r="5" fill="#f59e0b" />
          <line
            x1={coil.commonNodeX}
            y1={coil.commonNodeY}
            x2={coil.earthX}
            y2={coil.earthY - 12}
            stroke="#22c55e"
            strokeWidth="2.5"
          />
          <line
            x1={coil.earthX - 14}
            y1={coil.earthY - 12}
            x2={coil.earthX + 14}
            y2={coil.earthY - 12}
            stroke="#22c55e"
          />
          <line
            x1={coil.earthX - 9}
            y1={coil.earthY - 6}
            x2={coil.earthX + 9}
            y2={coil.earthY - 6}
            stroke="#22c55e"
          />
          <line
            x1={coil.earthX - 4}
            y1={coil.earthY}
            x2={coil.earthX + 4}
            y2={coil.earthY}
            stroke="#22c55e"
          />
          <line
            x1={secondaryTerminals.high.x}
            y1={secondaryTerminals.high.y}
            x2={coil.highTerminalX}
            y2={coil.highTerminalY}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <circle
            cx={coil.highTerminalX}
            cy={coil.highTerminalY}
            r={coil.highTerminalRadius}
            fill="#d97706"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <circle cx={coil.primarySourceX} cy="220" r="5" fill="#38bdf8" />
          <text x="205" y="50" fill="#fbbf24" fontSize="10" fontFamily="monospace">
            remote high terminal
          </text>
          <text x="215" y="125" fill="#fbbf24" fontSize="11" fontFamily="monospace">
            B
          </text>
          <text x="292" y="205" fill="#f59e0b" fontSize="11" fontFamily="monospace">
            C
          </text>
          <text x="314" y="214" fill="#22c55e" fontSize="8" fontFamily="monospace">
            common / earth
          </text>
        </g>
      );
    }
    case "edison-bulb": {
      const bulb = stepEdisonBulb({
        voltage: params?.voltage ?? 110,
        hotResistanceOhm: params?.hotResistanceOhm,
      });
      const filamentTemp = bulb.filamentTempK;
      const _glowOpacity = edisonSchematicGlowOpacity(filamentTemp);
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path
            d={bulb.schematicEnvelopeD}
            fill="#fef08a"
            fillOpacity={edisonSchematicGlowFill(filamentTemp)}
            stroke="#eab308"
            strokeWidth="2"
          />
          <path d={bulb.schematicHolderD} fill="#cbd5e1" fillOpacity="0.18" stroke="#94a3b8" />
          <path d={bulb.schematicLeftLeadD} stroke="#dbe4ea" strokeWidth="2" />
          <path d={bulb.schematicRightLeadD} stroke="#dbe4ea" strokeWidth="2" />
          <path d={bulb.schematicExternalLeftLeadD} stroke="#b86132" strokeWidth="2" />
          <path d={bulb.schematicExternalRightLeadD} stroke="#b86132" strokeWidth="2" />
          <path d={bulb.schematicFilamentD} stroke="#f59e0b" strokeWidth="3" fill="none" />
          {bulb.schematicTerminalXs.map((_: number, i: number) => {
            const t = edisonSchematicTerminal(
              i,
              bulb.schematicTerminalXs,
              bulb.schematicTerminalY,
              bulb.schematicTerminalR,
            );
            return <circle key={i} cx={t.cx} cy={t.cy} r={t.r} fill="#d97706" />;
          })}
        </g>
      );
    }
    case "fermi-reactor": {
      const rodWithdrawal = params?.rodWithdrawal ?? 83.5;
      const modPurity = params?.moderatorPurity ?? 99.5;
      const kinetics = stepFermiKinetics(rodWithdrawal, modPurity);
      const rodY = kinetics.schematicRodY;
      const keff = kinetics.kEffective;
      const fuelGlow = keff > 1.002 ? "#ef4444" : keff >= 0.998 ? "#10b981" : "#3b82f6";
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={kinetics.schematicCoreX0}
            y={kinetics.schematicCoreY0}
            width={kinetics.schematicCoreW}
            height={kinetics.schematicCoreH}
            rx="4"
            fill="#1e293b"
            fillOpacity="0.6"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          {kinetics.schematicGridYs.map((y) => (
            <line
              key={`h-${y}`}
              x1={kinetics.schematicCoreX0}
              y1={y}
              x2={kinetics.schematicCoreX1}
              y2={y}
              stroke="#475569"
            />
          ))}
          {kinetics.schematicGridXs.map((x) => (
            <line
              key={`v-${x}`}
              x1={x}
              y1={kinetics.schematicCoreY0}
              x2={x}
              y2={kinetics.schematicCoreY1}
              stroke="#475569"
            />
          ))}
          {/* Uranium fuel slug matrix with dynamic criticality color */}
          {Array.from({ length: kinetics.schematicSlugRows }, (_, row) =>
            Array.from({ length: kinetics.schematicSlugCols }, (_, col) => {
              const slug = fermiSchematicSlug(
                col,
                row,
                kinetics.schematicSlugOriginX,
                kinetics.schematicSlugOriginY,
                kinetics.schematicSlugPitchX,
                kinetics.schematicSlugPitchY,
              );
              return (
                <circle
                  key={`${col}-${row}`}
                  cx={slug.cx}
                  cy={slug.cy}
                  r={kinetics.schematicSlugR}
                  fill={fuelGlow}
                  stroke="#34d399"
                />
              );
            }),
          )}
          {/* Cadmium Control Rod moving dynamically into core */}
          <rect
            x={kinetics.schematicRodX}
            y={rodY}
            width={kinetics.schematicRodW}
            height={kinetics.schematicRodH}
            rx="2"
            fill="#ef4444"
            fillOpacity="0.9"
            stroke="#f87171"
            strokeWidth="1.5"
          />
        </g>
      );
    }
    case "wozniak-apple": {
      const apple = stepWozniakApple({
        crystalFreq: params?.crystalFreq,
        ramCapacityKb: params?.ramCapacityKb,
      });
      const cpu = wozniakSchematicChip("cpu", apple.schematicChipSeats);
      const mux = wozniakSchematicChip("mux", apple.schematicChipSeats);
      const ram = wozniakSchematicChip("ram", apple.schematicChipSeats);
      const video = wozniakSchematicChip("video", apple.schematicChipSeats);
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={cpu.x}
            y={cpu.y}
            width={cpu.w}
            height={cpu.h}
            rx="4"
            fill="#1e3a8a"
            fillOpacity="0.4"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <text
            x={cpu.labelX}
            y={cpu.labelY}
            fill="#93c5fd"
            fontSize="10"
            textAnchor="middle"
            fontWeight="bold"
          >
            MOS 6502
          </text>
          <rect
            x={mux.x}
            y={mux.y}
            width={mux.w}
            height={mux.h}
            rx="4"
            fill="#7c2d12"
            fillOpacity="0.4"
            stroke="#f97316"
            strokeWidth="2"
          />
          <text
            x={mux.labelX}
            y={mux.labelY}
            fill="#fdba74"
            fontSize="10"
            textAnchor="middle"
            fontWeight="bold"
          >
            MUX
          </text>
          <rect
            x={ram.x}
            y={ram.y}
            width={ram.w}
            height={ram.h}
            rx="4"
            fill="#065f46"
            fillOpacity="0.4"
            stroke="#34d399"
            strokeWidth="2"
          />
          <text
            x={ram.labelX}
            y={ram.labelY}
            fill="#6ee7b7"
            fontSize="10"
            textAnchor="middle"
            fontWeight="bold"
          >
            48KB RAM
          </text>
          <rect
            x={video.x}
            y={video.y}
            width={video.w}
            height={video.h}
            rx="4"
            fill="#4c1d95"
            fillOpacity="0.4"
            stroke="#a855f7"
            strokeWidth="2"
          />
          <text
            x={video.labelX}
            y={video.labelY}
            fill="#d8b4fe"
            fontSize="10"
            textAnchor="middle"
            fontWeight="bold"
          >
            Video Gen
          </text>
          <line
            x1={apple.schematicBusCpuMux.x1}
            y1={apple.schematicBusCpuMux.y1}
            x2={apple.schematicBusCpuMux.x2}
            y2={apple.schematicBusCpuMux.y2}
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <line
            x1={apple.schematicBusVideoMux.x1}
            y1={apple.schematicBusVideoMux.y1}
            x2={apple.schematicBusVideoMux.x2}
            y2={apple.schematicBusVideoMux.y2}
            stroke="#a855f7"
            strokeWidth="2"
          />
          <line
            x1={apple.schematicBusMuxRam.x1}
            y1={apple.schematicBusMuxRam.y1}
            x2={apple.schematicBusMuxRam.x2}
            y2={apple.schematicBusMuxRam.y2}
            stroke="#f97316"
            strokeWidth="2"
          />
        </g>
      );
    }
    case "engelbart-mouse": {
      const mouse = stepEngelbartMouse({
        mouseSpeed: params?.mouseSpeed,
        wheelRadius: params?.wheelRadius,
        pulsesPerRev: params?.pulsesPerRev,
      });
      const xWheel = engelbartSchematicWheel("x", {
        x: mouse.schematicXWheelX,
        y: mouse.schematicXWheelY,
        w: mouse.schematicXWheelW,
        h: mouse.schematicXWheelH,
      });
      const yWheel = engelbartSchematicWheel("y", undefined, {
        x: mouse.schematicYWheelX,
        y: mouse.schematicYWheelY,
        w: mouse.schematicYWheelW,
        h: mouse.schematicYWheelH,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path
            d={mouse.schematicBodyD}
            fill="#78350f"
            fillOpacity="0.3"
            stroke="#d97706"
            strokeWidth="2"
          />
          <rect
            x={mouse.schematicButtonX}
            y={mouse.schematicButtonY}
            width={mouse.schematicButtonW}
            height={mouse.schematicButtonH}
            rx="4"
            fill="#ef4444"
            stroke="#f87171"
          />
          <rect
            x={xWheel.x}
            y={xWheel.y}
            width={xWheel.w}
            height={xWheel.h}
            rx="2"
            fill="#d97706"
            stroke="#fbbf24"
          />
          <text x={xWheel.labelX} y={xWheel.labelY} fill="#fef3c7" fontSize="9" textAnchor="middle">
            X-Wheel
          </text>
          <rect
            x={yWheel.x}
            y={yWheel.y}
            width={yWheel.w}
            height={yWheel.h}
            rx="2"
            fill="#d97706"
            stroke="#fbbf24"
          />
          <text x={yWheel.labelX} y={yWheel.labelY} fill="#fef3c7" fontSize="9" textAnchor="middle">
            Y-Wheel
          </text>
        </g>
      );
    }
    case "farnsworth-tv": {
      const tv = FrankenSimEngine.stepFarnsworthTv(1.5, 120, 500);
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={tv.schematicEnvelopeX}
            y={tv.schematicEnvelopeY}
            width={tv.schematicEnvelopeW}
            height={tv.schematicEnvelopeH}
            rx={tv.schematicEnvelopeRx}
            fill="#0f172a"
            fillOpacity="0.5"
            stroke="#7dd3fc"
            strokeWidth="2"
          />
          <circle
            cx={tv.schematicCathodeCx}
            cy={tv.schematicCathodeCy}
            r={tv.schematicCathodeR}
            fill="#0369a1"
            fillOpacity="0.4"
            stroke="#38bdf8"
          />
          <text
            x={tv.schematicCathodeCx}
            y={tv.schematicCathodeCy + tv.schematicCathodeLabelDy}
            fill="#bae6fd"
            fontSize="8"
            textAnchor="middle"
          >
            CsO
          </text>
          <rect
            x={tv.schematicCollectorX}
            y={tv.schematicCollectorY}
            width={tv.schematicCollectorW}
            height={tv.schematicCollectorH}
            rx="3"
            fill="#f59e0b"
            fillOpacity="0.35"
          />
          <line
            x1={tv.schematicCathodeCx + tv.schematicCathodeR}
            y1={tv.schematicCathodeCy}
            x2={tv.schematicCollectorX}
            y2={tv.schematicCathodeCy}
            stroke="#fbbf24"
            strokeDasharray="4 3"
          />
          <rect
            x={tv.schematicDeflectorX}
            y={tv.schematicDeflectorY0}
            width={tv.schematicDeflectorW}
            height={tv.schematicDeflectorH}
            rx="2"
            fill="#d97706"
            fillOpacity="0.4"
          />
          <rect
            x={tv.schematicDeflectorX}
            y={tv.schematicDeflectorY1}
            width={tv.schematicDeflectorW}
            height={tv.schematicDeflectorH}
            rx="2"
            fill="#d97706"
            fillOpacity="0.4"
          />
        </g>
      );
    }
    case "spencer-microwave": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5">
          <rect x="18" y="18" width="364" height="264" rx="8" fill="#0f172a" />
          <g fill="#1e293b" stroke="#cbd5e1">
            <rect x="34" y="62" width="66" height="48" rx="4" />
            <rect x="34" y="190" width="66" height="48" rx="4" />
            <rect x="124" y="95" width="66" height="110" rx="4" />
            <rect x="218" y="120" width="80" height="60" rx="4" />
            <rect x="320" y="98" width="46" height="104" rx="4" />
          </g>
          <g fill="none" stroke="#67e8f9" strokeWidth="2">
            <path d="M100 86 H124 M100 214 H124 M190 116 H218 M190 184 H218 M298 150 H320" />
            <circle cx="218" cy="116" r="5" stroke="#fbbf24" />
            <circle cx="218" cy="184" r="5" stroke="#fbbf24" />
          </g>
          <g fill="#e2e8f0" stroke="none" fontSize="8" textAnchor="middle">
            <text x="67" y="82">
              MAGNETRON 10
            </text>
            <text x="67" y="210">
              MAGNETRON 11
            </text>
            <text x="157" y="143">
              TRANSFORMER 18
            </text>
            <text x="157" y="156">
              LINES 19
            </text>
            <text x="258" y="145">
              WAVE GUIDE 23
            </text>
            <text x="258" y="158">
              24 / 25
            </text>
            <text x="343" y="144">
              CONVEYOR
            </text>
            <text x="343" y="157">
              28
            </text>
          </g>
          <g fill="#fbbf24" stroke="none" fontSize="7">
            <text x="200" y="106">
              26
            </text>
            <text x="200" y="198">
              27
            </text>
          </g>
        </g>
      );
    }
    case "noyce-ic": {
      const sourceCrop = noyceFigureSourceCrop(figureNumber);
      if (!sourceCrop) {
        return (
          <text x="200" y="150" fill="#94a3b8" fontSize="11" textAnchor="middle">
            Source drawing crop unavailable for {figureNumber}
          </text>
        );
      }
      return (
        <g>
          <image
            href={sourceCrop}
            x="16"
            y="42"
            width="368"
            height="238"
            preserveAspectRatio="xMidYMid meet"
          />
          <text x="200" y="286" fill="#94a3b8" fontSize="8" textAnchor="middle">
            Pinned facsimile crop · {figureNumber}
          </text>
        </g>
      );
    }
    case "kwolek-kevlar": {
      const kevlar = stepKevlarContinuum();
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {Array.from({ length: kevlar.schematicLatticeRows }, (_, row) => {
            const rowY = kevlarSchematicLattice(
              row,
              0,
              kevlar.schematicLatticeOriginX,
              kevlar.schematicLatticeOriginY,
              kevlar.schematicLatticePitchX,
              kevlar.schematicLatticePitchY,
            ).cy;
            return (
              <g key={row}>
                <line
                  x1={kevlar.schematicLatticeX1}
                  y1={rowY}
                  x2={kevlar.schematicLatticeX2}
                  y2={rowY}
                  stroke="#f59e0b"
                  strokeWidth="3"
                />
                {Array.from({ length: kevlar.schematicLatticeCols }, (_, col) => {
                  const node = kevlarSchematicLattice(
                    row,
                    col,
                    kevlar.schematicLatticeOriginX,
                    kevlar.schematicLatticeOriginY,
                    kevlar.schematicLatticePitchX,
                    kevlar.schematicLatticePitchY,
                  );
                  return (
                    <circle
                      key={col}
                      cx={node.cx}
                      cy={node.cy}
                      r={kevlar.schematicNodeR}
                      fill={row % 2 === 0 ? "#38bdf8" : "#34d399"}
                    />
                  );
                })}
              </g>
            );
          })}
          {kevlar.schematicBondXs.map((_, i) => {
            const x = kevlarSchematicBond(i, kevlar.schematicBondXs).x;
            return (
              <line
                key={x}
                x1={x}
                y1={kevlar.schematicBondY0}
                x2={x}
                y2={kevlar.schematicBondY1}
                stroke="#67e8f9"
                strokeDasharray="3 3"
              />
            );
          })}
          <text x="200" y="250" fill="#fde68a" fontSize="9" textAnchor="middle">
            Nematic aramid H-bond lattice
          </text>
        </g>
      );
    }
    case "bell-phone": {
      const bell = stepBellTelephone({
        voiceAmplitude: params?.voiceAmplitude,
        airGap: params?.airGap,
        batteryVoltage: params?.batteryVoltage,
        liquidConductivity: params?.liquidConductivity,
        acousticFrequencyHz: params?.acousticFrequencyHz,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <ellipse
            cx={bell.schematicHornCx}
            cy={bell.schematicHornCy}
            rx={bell.schematicHornRx}
            ry={bell.schematicHornRy}
            fill="#334155"
            fillOpacity="0.4"
            stroke="#94a3b8"
          />
          <rect
            x={bell.schematicTransmitterX}
            y={bell.schematicTransmitterY}
            width={bell.schematicTransmitterW}
            height={bell.schematicTransmitterH}
            rx="6"
            fill="#1e293b"
            fillOpacity="0.4"
            stroke="#7dd3fc"
          />
          <rect
            x={bell.schematicAcidX}
            y={bell.schematicAcidY}
            width={bell.schematicAcidW}
            height={bell.schematicAcidH}
            rx="4"
            fill="#0f766e"
            fillOpacity="0.4"
            stroke="#2dd4bf"
          />
          <text x="200" y="163" fill="#99f6e4" fontSize="8" textAnchor="middle">
            H₂SO₄
          </text>
          {bell.schematicElectrodeXs.map((x) => (
            <line
              key={x}
              x1={x}
              y1={bell.schematicElectrodeY0}
              x2={x}
              y2={bell.schematicElectrodeY1}
              stroke="#f59e0b"
            />
          ))}
          <rect
            x={bell.schematicBaseX}
            y={bell.schematicBaseY}
            width={bell.schematicBaseW}
            height={bell.schematicBaseH}
            rx="3"
            fill="#78350f"
            fillOpacity="0.4"
            stroke="#d97706"
          />
        </g>
      );
    }
    case "lincoln-buoy": {
      const lincoln = stepLincolnBuoy({
        inflationPct: params?.inflationPct,
        weightTons: params?.weightTons,
        shoalDepth: params?.shoalDepth,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path
            d={lincoln.schematicHullD}
            fill="#1e3a8a"
            fillOpacity="0.25"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          {lincoln.schematicChamberXs.map((_x, i) => {
            const chamber = lincolnSchematicChamber(
              i,
              lincoln.schematicChamberXs,
              lincoln.schematicChamberY,
            );
            return (
              <rect
                key={i}
                x={chamber.x}
                y={chamber.y}
                width={lincoln.schematicChamberW}
                height={lincoln.schematicChamberH}
                rx="8"
                fill="#0f766e"
                fillOpacity="0.35"
                stroke="#2dd4bf"
              />
            );
          })}
          <line
            x1={lincoln.schematicWaterX1}
            y1={lincoln.schematicWaterY}
            x2={lincoln.schematicWaterX2}
            y2={lincoln.schematicWaterY}
            stroke="#38bdf8"
            strokeDasharray="6 4"
          />
          {lincoln.schematicTieXs.map((x) => (
            <line
              key={x}
              x1={x}
              y1={lincoln.schematicTieY0}
              x2={x}
              y2={lincoln.schematicTieY1}
              stroke="#f59e0b"
            />
          ))}
        </g>
      );
    }
    case "howe-sewing": {
      const howe = stepHoweSewingMachine(300, 65, 3.5);
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={howe.schematicBedX}
            y={howe.schematicBedY}
            width={howe.schematicBedW}
            height={howe.schematicBedH}
            rx="3"
            fill="#334155"
            stroke="#94a3b8"
          />
          <path d={howe.schematicArmD} stroke="#60a5fa" strokeWidth="3" />
          <circle
            cx={howe.schematicShuttleCx}
            cy={howe.schematicShuttleCy}
            r={howe.schematicShuttleR}
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <line
            x1={howe.schematicShuttleCx}
            y1={howe.schematicShuttleCy}
            x2={howe.schematicShuttleCx + howe.schematicShuttleArmDx}
            y2={howe.schematicShuttleCy + howe.schematicShuttleArmDy}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <line
            x1={howe.schematicNeedleX}
            y1={howe.schematicNeedleY0}
            x2={howe.schematicNeedleX}
            y2={howe.schematicNeedleY1}
            stroke="#ef4444"
            strokeWidth="2"
          />
          <circle
            cx={howe.schematicNeedleX}
            cy={howe.schematicNeedleY}
            r={howe.schematicNeedleR}
            fill="#f87171"
          />
          <rect
            x={howe.schematicFeedX}
            y={howe.schematicFeedY}
            width={howe.schematicFeedW}
            height={howe.schematicFeedH}
            rx="2"
            fill="#d97706"
            fillOpacity="0.4"
          />
        </g>
      );
    }
    case "goddard-rocket": {
      const rocket = FrankenSimEngine.stepGoddardRocket(350, 1.8);
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path
            d={`M ${rocket.schematicNoseCx} ${rocket.schematicNoseY0} L ${rocket.schematicNoseCx + rocket.schematicNoseHalfW} ${rocket.schematicNoseY1} L ${rocket.schematicNoseCx - rocket.schematicNoseHalfW} ${rocket.schematicNoseY1} Z`}
            fill="#1e3a8a"
            fillOpacity="0.4"
            stroke="#60a5fa"
          />
          <rect
            x={rocket.schematicChamberX}
            y={rocket.schematicChamberY}
            width={rocket.schematicChamberW}
            height={rocket.schematicChamberH}
            fill="#0f172a"
            fillOpacity="0.4"
            stroke="#38bdf8"
          />
          <rect
            x={rocket.schematicInjectorX}
            y={rocket.schematicInjectorY}
            width={rocket.schematicInjectorW}
            height={rocket.schematicInjectorH}
            fill="#1e293b"
            fillOpacity="0.5"
            stroke="#7dd3fc"
          />
          <path
            d={`M ${rocket.schematicNozzleInnerX0} ${rocket.schematicNozzleY0} L ${rocket.schematicNozzleX0} ${rocket.schematicNozzleY1} L ${rocket.schematicNozzleX1} ${rocket.schematicNozzleY1} L ${rocket.schematicNozzleInnerX1} ${rocket.schematicNozzleY0} Z`}
            fill="#7c2d12"
            fillOpacity="0.4"
            stroke="#f59e0b"
          />
          <path
            d={`M ${rocket.schematicFlameCx - rocket.schematicFlameHalfW} ${rocket.schematicNozzleY1} Q ${rocket.schematicFlameCx} ${rocket.schematicFlameY} ${rocket.schematicFlameCx + rocket.schematicFlameHalfW} ${rocket.schematicNozzleY1}`}
            fill="#ef4444"
            fillOpacity="0.5"
            stroke="#f97316"
          />
        </g>
      );
    }
    case "bardeen-transistor": {
      const ge = stepBardeenTransistor();
      const die = bardeenSchematicDie(
        ge.schematicDieX,
        ge.schematicDieY,
        ge.schematicDieW,
        ge.schematicDieH,
      );
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={die.x}
            y={die.y}
            width={die.w}
            height={die.h}
            rx="4"
            fill="#64748b"
            fillOpacity="0.35"
            stroke="#94a3b8"
          />
          <text x={die.labelX} y={die.labelY} fill="#cbd5e1" fontSize="9" textAnchor="middle">
            n-Ge
          </text>
          <line
            x1={ge.schematicEmitterX1}
            y1={ge.schematicEmitterY1}
            x2={ge.schematicEmitterX2}
            y2={ge.schematicEmitterY2}
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <line
            x1={ge.schematicCollectorX1}
            y1={ge.schematicCollectorY1}
            x2={ge.schematicCollectorX2}
            y2={ge.schematicCollectorY2}
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <circle
            cx={ge.schematicEmitterX2}
            cy={ge.schematicEmitterY2}
            r={ge.schematicContactR}
            fill="#fbbf24"
          />
          <circle
            cx={ge.schematicCollectorX2}
            cy={ge.schematicCollectorY2}
            r={ge.schematicContactR}
            fill="#7dd3fc"
          />
          <text
            x={ge.schematicEmitterLabelX}
            y={ge.schematicEmitterLabelY}
            fill="#fde68a"
            fontSize="9"
            textAnchor="middle"
          >
            E
          </text>
          <text
            x={ge.schematicCollectorLabelX}
            y={ge.schematicCollectorLabelY}
            fill="#bae6fd"
            fontSize="9"
            textAnchor="middle"
          >
            C
          </text>
        </g>
      );
    }
    case "boyle-smith-ccd": {
      const ccd = stepCcdWells(1, 850, 2.5, 8);
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={ccd.schematicSubstrateX}
            y={ccd.schematicSubstrateY}
            width={ccd.schematicSubstrateW}
            height={ccd.schematicSubstrateH}
            fill="#1e3a8a"
            fillOpacity="0.35"
            stroke="#60a5fa"
          />
          <rect
            x={ccd.schematicSubstrateX}
            y={ccd.schematicPolyY}
            width={ccd.schematicSubstrateW}
            height={ccd.schematicPolyH}
            fill="#334155"
            fillOpacity="0.5"
            stroke="#94a3b8"
          />
          {Array.from({ length: ccd.schematicGateCount }, (_, i) => (
            <rect
              key={i}
              x={ccdSchematicGateX(i, ccd.schematicGateOriginX, ccd.schematicGatePitch)}
              y={ccd.schematicGateY}
              width={ccd.schematicGateWidth}
              height={ccd.schematicGateH}
              fill={i % 3 === 0 ? "#f59e0b" : i % 3 === 1 ? "#38bdf8" : "#34d399"}
              fillOpacity="0.35"
              stroke="#e2e8f0"
            />
          ))}
          <path d={ccd.schematicPacketD} stroke="#fde68a" fill="none" />
          <text x="200" y="80" fill="#93c5fd" fontSize="9" textAnchor="middle">
            φ1 · φ2 · φ3 charge packets
          </text>
        </g>
      );
    }
    case "morse-telegraph": {
      const morse = stepMorseTelegraph({
        currentMa: params?.currentMa,
        wireTurns: params?.wireTurns,
        lineVoltageV: params?.lineVoltageV,
        lineLengthMiles: params?.lineLengthMiles,
        wpmSpeed: params?.wpmSpeed,
      });
      const key = morseSchematicInstrument("key", {
        x: morse.schematicKeyX,
        y: morse.schematicKeyY,
        w: morse.schematicKeyW,
        h: morse.schematicKeyH,
      });
      const relay = morseSchematicInstrument("relay", undefined, {
        x: morse.schematicRelayX,
        y: morse.schematicRelayY,
        w: morse.schematicRelayW,
        h: morse.schematicRelayH,
      });
      const sounder = morseSchematicInstrument("sounder", undefined, undefined, {
        x: morse.schematicSounderX,
        y: morse.schematicSounderY,
        w: morse.schematicSounderW,
        h: morse.schematicSounderH,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={key.x}
            y={key.y}
            width={key.w}
            height={key.h}
            rx="3"
            fill="#78350f"
            fillOpacity="0.4"
            stroke="#d97706"
          />
          <line
            x1={morse.schematicLeverX1}
            y1={morse.schematicLeverY1}
            x2={morse.schematicLeverX2}
            y2={morse.schematicLeverY2}
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <rect
            x={relay.x}
            y={relay.y}
            width={relay.w}
            height={relay.h}
            rx="4"
            fill="#1e3a8a"
            fillOpacity="0.35"
            stroke="#60a5fa"
          />
          <text x={relay.labelX} y={relay.labelY} fill="#93c5fd" fontSize="9" textAnchor="middle">
            Relay
          </text>
          <rect
            x={sounder.x}
            y={sounder.y}
            width={sounder.w}
            height={sounder.h}
            rx="4"
            fill="#334155"
            fillOpacity="0.4"
            stroke="#f59e0b"
          />
          <text
            x={sounder.labelX}
            y={sounder.labelY}
            fill="#fde68a"
            fontSize="8"
            textAnchor="middle"
          >
            Sounder
          </text>
          <line
            x1={morse.schematicKeyRelayX1}
            y1={morse.schematicKeyRelayY1}
            x2={morse.schematicKeyRelayX2}
            y2={morse.schematicKeyRelayY2}
            stroke="#38bdf8"
          />
          <line
            x1={morse.schematicRelaySounderX1}
            y1={morse.schematicRelaySounderY1}
            x2={morse.schematicRelaySounderX2}
            y2={morse.schematicRelaySounderY2}
            stroke="#38bdf8"
          />
        </g>
      );
    }
    case "goodyear-rubber": {
      const rubber = stepGoodyearRubber();
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {Array.from({ length: rubber.schematicStrandCount }, (_, i) => {
            const s = goodyearSchematicStrand(i);
            return (
              <path
                key={i}
                d={`M ${s.x} ${s.y0} Q ${s.qx} ${s.qy} ${s.x} ${s.y1}`}
                stroke="#f59e0b"
                strokeWidth="3"
              />
            );
          })}
          {Array.from({ length: rubber.schematicLinkCount }, (_, i) => {
            const link = goodyearSchematicLink(
              i,
              rubber.schematicLinkXs,
              rubber.schematicLinkY0s,
              rubber.schematicLinkY1s,
            );
            return (
              <line
                key={i}
                x1={link.x1}
                y1={link.y1}
                x2={link.x2}
                y2={link.y2}
                stroke="#38bdf8"
                strokeWidth="2"
              />
            );
          })}
          {Array.from({ length: rubber.schematicCrosslinkCount }, (_, i) => {
            const n = goodyearSchematicCrosslink(i);
            return (
              <circle key={i} cx={n.cx} cy={n.cy} r={rubber.schematicCrosslinkR} fill="#34d399" />
            );
          })}
          <text x="200" y="250" fill="#6ee7b7" fontSize="9" textAnchor="middle">
            Sulfur S–S crosslinks
          </text>
        </g>
      );
    }
    case "lamarr-frequency-hopping": {
      const hop = FrankenSimEngine.stepLamarrFrequencyHopping();
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={hop.schematicBoxX}
            y={hop.schematicBoxY}
            width={hop.schematicBoxW}
            height={hop.schematicBoxH}
            rx="4"
            fill="#0f172a"
            fillOpacity="0.45"
            stroke="#64748b"
          />
          {Array.from({ length: hop.schematicStaffCount }, (_, i) => (
            <line
              key={i}
              x1={hop.schematicStaffX1}
              y1={lamarrSchematicStaffY(i, hop.schematicStaffOriginY, hop.schematicStaffPitchY)}
              x2={hop.schematicStaffX2}
              y2={lamarrSchematicStaffY(i, hop.schematicStaffOriginY, hop.schematicStaffPitchY)}
              stroke="#1e293b"
            />
          ))}
          {hop.schematicHopSequence.map((row, i) => {
            const slot = lamarrSchematicHop(
              i,
              row,
              hop.schematicHopOriginX,
              hop.schematicStaffOriginY,
              hop.schematicHopPitchX,
              hop.schematicStaffPitchY,
            );
            return (
              <rect
                key={i}
                x={slot.x}
                y={slot.y}
                width={hop.schematicHopW}
                height={hop.schematicHopH}
                fill="#f59e0b"
                fillOpacity="0.7"
              />
            );
          })}
          <text x="200" y="245" fill="#fde68a" fontSize="9" textAnchor="middle">
            88-slot piano-roll hop sequence
          </text>
        </g>
      );
    }
    case "marconi-radio": {
      const radio = stepMarconiRadio();
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <line
            x1={radio.schematicMastX}
            y1={radio.schematicMastY0}
            x2={radio.schematicMastX}
            y2={radio.schematicMastY1}
            stroke="#94a3b8"
            strokeWidth="3"
          />
          <line
            x1={radio.schematicAerialX1}
            y1={radio.schematicAerialY}
            x2={radio.schematicAerialX2}
            y2={radio.schematicAerialY}
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <line
            x1={radio.schematicMastX}
            y1={radio.schematicMastY1}
            x2={radio.schematicLeadX2}
            y2={radio.schematicMastY1}
            stroke="#38bdf8"
          />
          <circle
            cx={radio.schematicGapX0}
            cy={radio.schematicGapY}
            r={radio.schematicGapR}
            fill="#fbbf24"
          />
          <circle
            cx={radio.schematicGapX1}
            cy={radio.schematicGapY}
            r={radio.schematicGapR}
            fill="#fbbf24"
          />
          <line
            x1={radio.schematicGapX0 + radio.schematicSparkDx}
            y1={radio.schematicGapY}
            x2={radio.schematicGapX1 - radio.schematicSparkDx}
            y2={radio.schematicGapY}
            stroke="#ef4444"
            strokeWidth="2"
          />
          <rect
            x={radio.schematicEarthX}
            y={radio.schematicEarthY}
            width={radio.schematicEarthW}
            height={radio.schematicEarthH}
            fill="#334155"
            stroke="#94a3b8"
          />
          <text x="250" y="224" fill="#cbd5e1" fontSize="8" textAnchor="middle">
            Earth
          </text>
        </g>
      );
    }
    case "einstein-refrigerator": {
      const frige = stepEinsteinRefrigerator({
        heatInput: params?.heatInput,
        totalPressure: params?.totalPressure,
        ammoniaRatio: params?.ammoniaRatio ?? params?.auxiliaryGasRatio,
      });
      const generator = einsteinSchematicVessel(
        "generator",
        frige.schematicVesselLeftX,
        frige.schematicVesselRightX,
        frige.schematicVesselTopY,
        frige.schematicVesselBottomY,
        frige.schematicVesselW,
        frige.schematicVesselH,
      );
      const condenser = einsteinSchematicVessel(
        "condenser",
        frige.schematicVesselLeftX,
        frige.schematicVesselRightX,
        frige.schematicVesselTopY,
        frige.schematicVesselBottomY,
        frige.schematicVesselW,
        frige.schematicVesselH,
      );
      const evaporator = einsteinSchematicVessel(
        "evaporator",
        frige.schematicVesselLeftX,
        frige.schematicVesselRightX,
        frige.schematicVesselTopY,
        frige.schematicVesselBottomY,
        frige.schematicVesselW,
        frige.schematicVesselH,
      );
      const absorber = einsteinSchematicVessel(
        "absorber",
        frige.schematicVesselLeftX,
        frige.schematicVesselRightX,
        frige.schematicVesselTopY,
        frige.schematicVesselBottomY,
        frige.schematicVesselW,
        frige.schematicVesselH,
      );
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={generator.x}
            y={generator.y}
            width={generator.w}
            height={generator.h}
            rx="6"
            fill="#7c2d12"
            fillOpacity="0.35"
            stroke="#f97316"
          />
          <text
            x={generator.labelX}
            y={generator.labelY}
            fill="#fdba74"
            fontSize="9"
            textAnchor="middle"
          >
            Generator
          </text>
          <rect
            x={condenser.x}
            y={condenser.y}
            width={condenser.w}
            height={condenser.h}
            rx="6"
            fill="#1e3a8a"
            fillOpacity="0.35"
            stroke="#60a5fa"
          />
          <text
            x={condenser.labelX}
            y={condenser.labelY}
            fill="#93c5fd"
            fontSize="9"
            textAnchor="middle"
          >
            Condenser
          </text>
          <rect
            x={evaporator.x}
            y={evaporator.y}
            width={evaporator.w}
            height={evaporator.h}
            rx="6"
            fill="#0f766e"
            fillOpacity="0.35"
            stroke="#2dd4bf"
          />
          <text
            x={evaporator.labelX}
            y={evaporator.labelY}
            fill="#99f6e4"
            fontSize="9"
            textAnchor="middle"
          >
            Evaporator
          </text>
          <rect
            x={absorber.x}
            y={absorber.y}
            width={absorber.w}
            height={absorber.h}
            rx="6"
            fill="#4c1d95"
            fillOpacity="0.35"
            stroke="#a855f7"
          />
          <text
            x={absorber.labelX}
            y={absorber.labelY}
            fill="#d8b4fe"
            fontSize="9"
            textAnchor="middle"
          >
            Absorber
          </text>
          <line
            x1={frige.schematicGenCondX1}
            y1={frige.schematicGenCondY}
            x2={frige.schematicGenCondX2}
            y2={frige.schematicGenCondY}
            stroke="#f59e0b"
          />
          <line
            x1={frige.schematicCondEvapX}
            y1={frige.schematicCondEvapY1}
            x2={frige.schematicCondEvapX}
            y2={frige.schematicCondEvapY2}
            stroke="#38bdf8"
          />
          <line
            x1={frige.schematicEvapAbsX1}
            y1={frige.schematicEvapAbsY}
            x2={frige.schematicEvapAbsX2}
            y2={frige.schematicEvapAbsY}
            stroke="#34d399"
          />
          <line
            x1={frige.schematicAbsGenX}
            y1={frige.schematicAbsGenY1}
            x2={frige.schematicAbsGenX}
            y2={frige.schematicAbsGenY2}
            stroke="#a855f7"
          />
        </g>
      );
    }
    case "colt-revolver": {
      const cockDeg = params?.cockingAngle ?? 45;
      const colt = stepColtRevolver({ cockingAngleDeg: cockDeg });
      const rotDeg = colt.indexAngleDeg;
      const isFullCock = colt.isLocked;
      const boltRetractY = colt.schematicBoltRetractY;
      const trigger = coltSchematicTrigger(
        isFullCock,
        colt.schematicTriggerX,
        colt.schematicTriggerW,
        colt.schematicTriggerCockY,
        colt.schematicTriggerRestY,
        colt.schematicTriggerCockH,
        colt.schematicTriggerRestH,
      );
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <line
            x1={colt.schematicArborX1}
            y1={colt.schematicArborY}
            x2={colt.schematicArborX2}
            y2={colt.schematicArborY}
            stroke="#475569"
            strokeWidth="3"
          />
          <line
            x1={colt.schematicArborX1}
            y1={colt.schematicArborY}
            x2={colt.schematicArborX2}
            y2={colt.schematicArborY}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="4,3"
          />
          <rect
            x={colt.schematicBarrelX}
            y={colt.schematicBarrelY}
            width={colt.schematicBarrelW}
            height={colt.schematicBarrelH}
            stroke="#60a5fa"
            strokeWidth="2"
            fill="#1e3a8a"
            fillOpacity="0.25"
            rx="2"
          />
          <line
            x1={colt.schematicBarrelX}
            y1={colt.schematicBoreY}
            x2={colt.schematicBoreX2}
            y2={colt.schematicBoreY}
            stroke="#93c5fd"
            strokeWidth="6"
          />
          <line
            x1={colt.schematicBarrelX}
            y1={colt.schematicBoreY}
            x2={colt.schematicBoreX2}
            y2={colt.schematicBoreY}
            stroke="#0369a1"
            strokeWidth="3"
          />
          <path
            d={colt.schematicLugD}
            stroke="#60a5fa"
            strokeWidth="1.5"
            fill="#1e3a8a"
            fillOpacity="0.3"
          />
          <rect
            x={colt.schematicLugPinX}
            y={colt.schematicLugPinY}
            width={colt.schematicLugPinW}
            height={colt.schematicLugPinH}
            fill="#94a3b8"
            stroke="#cbd5e1"
          />
          <path
            d={colt.schematicFrameD}
            stroke="#38bdf8"
            strokeWidth="2"
            fill="#0369a1"
            fillOpacity="0.2"
          />
          <rect
            x={colt.schematicCylinderX}
            y={colt.schematicCylinderY}
            width={colt.schematicCylinderW}
            height={colt.schematicCylinderH}
            stroke="#f59e0b"
            strokeWidth="2"
            fill="#78350f"
            fillOpacity="0.25"
            rx="4"
          />
          <rect
            x={colt.schematicCylinderX}
            y={colt.schematicTopBoreY}
            width={colt.schematicBoreW}
            height={colt.schematicBoreH}
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          <circle
            cx={colt.schematicBoreMouthX}
            cy={colt.schematicBoreY}
            r={colt.schematicBoreMouthR}
            fill="#94a3b8"
          />
          <rect
            x={colt.schematicCylinderX}
            y={colt.schematicBottomBoreY}
            width={colt.schematicBoreW}
            height={colt.schematicBoreH}
            stroke="#fbbf24"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
          <line
            x1={colt.schematicFlashX}
            y1={colt.schematicFlashY0}
            x2={colt.schematicFlashX}
            y2={colt.schematicFlashY1}
            stroke="#38bdf8"
            strokeWidth="3"
          />
          <g
            transform={`translate(${colt.schematicHammerPivotX}, ${colt.schematicHammerPivotY}) rotate(${-cockDeg})`}
          >
            <path d={colt.schematicHammerD} stroke="#cbd5e1" strokeWidth="2" fill="#334155" />
            <line
              x1={colt.schematicPawlX1}
              y1={colt.schematicPawlY1}
              x2={colt.schematicPawlX2}
              y2={colt.schematicPawlY2}
              stroke="#f59e0b"
              strokeWidth="3"
            />
            <circle cx={colt.schematicPawlX1} cy={colt.schematicPawlY1} r="2.5" fill="#ffffff" />
          </g>
          <circle
            cx={colt.schematicFlashX}
            cy={colt.schematicArborY}
            r={colt.schematicRatchetR}
            stroke="#f59e0b"
            strokeWidth="1.5"
            fill="#334155"
          />
          <rect
            x={colt.schematicBoltX}
            y={colt.schematicBoltY + boltRetractY}
            width={colt.schematicBoltW}
            height={colt.schematicBoltH}
            fill={isFullCock || cockDeg <= 2 ? "#34d399" : "#fbbf24"}
            stroke={isFullCock || cockDeg <= 2 ? "#10b981" : "#d97706"}
          />
          <rect
            x={trigger.x}
            y={trigger.y}
            width={trigger.w}
            height={trigger.h}
            fill={isFullCock ? "#f59e0b" : "#64748b"}
            stroke="#cbd5e1"
          />

          <text x="285" y="60" fill="#93c5fd" fontSize="9" textAnchor="middle">
            Rifled Barrel (Bore Axis)
          </text>
          <text x="168" y="52" fill="#fbbf24" fontSize="9" textAnchor="middle">
            5-Chamber Cylinder (Δθ={rotDeg.toFixed(0)}°)
          </text>
          <text x="50" y="42" fill="#bae6fd" fontSize="9">
            Pawl &amp; Hammer (US X9430)
          </text>
        </g>
      );
    }
    case "otis-elevator": {
      const otis = stepOtis1861Topology(readOtisTopologyControls(params ?? {}));
      const platformY = 166 - otis.platformPositionNormalized * 54;
      const counterY = 166 - otis.counterpoisePositionNormalized * 54;
      const pawlExtension = otis.pawlsFEngaged ? 9 : 2;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* H/I/J/K/L/N and both guided belts remain one drive train. */}
          <circle cx="92" cy="174" r="18" stroke="#94a3b8" strokeWidth="5" />
          <text x="92" y="178" fill="#f8fafc" fontSize="9" textAnchor="middle">
            H
          </text>
          <line x1="32" y1="112" x2="174" y2="112" stroke="#64748b" strokeWidth="5" />
          {[52, 103, 154].map((x, index) => (
            <g key={x}>
              <circle
                cx={x}
                cy="112"
                r="13"
                stroke={index === 1 ? "#f59e0b" : "#64748b"}
                strokeWidth="4"
              />
              <text x={x} y="115" fill="#f8fafc" fontSize="8" textAnchor="middle">
                {["J", "L", "K"][index]}
              </text>
            </g>
          ))}
          <circle cx="103" cy="39" r="22" stroke="#94a3b8" strokeWidth="5" />
          <text x="103" y="43" fill="#f8fafc" fontSize="9" textAnchor="middle">
            N
          </text>
          <path
            d="M 81 39 L 90 112 L 116 112 L 125 39 Z"
            stroke={otis.straightBeltOWorking ? "#22c55e" : "#64748b"}
            strokeWidth="3"
          />
          <path
            d="M 83 31 L 116 121 M 123 31 L 90 121"
            stroke={otis.crossBeltPWorking ? "#22c55e" : "#64748b"}
            strokeWidth="3"
          />
          <text x="20" y="18" fill="#94a3b8" fontSize="8">
            N · O · P · I/J/K/L
          </text>

          {/* S/T/U/V simultaneously controls idle belts and brake Z. */}
          <line
            x1={52 + otis.shipperPositionNormalized * 8}
            y1="78"
            x2={154 + otis.shipperPositionNormalized * 8}
            y2="78"
            stroke="#f59e0b"
            strokeWidth="5"
          />
          <path d="M 75 78 L 42 213" stroke="#d97706" strokeWidth="2.5" />
          <path d="M 378 30 L 378 204 L 42 194" stroke="#d97706" strokeWidth="2" />
          <path d="M 42 194 l -8 -10 M 42 194 l 8 -10" stroke="#fbbf24" strokeWidth="2.5" />
          <path d="M 75 78 L 178 94 L 154 112" stroke="#cbd5e1" strokeWidth="3" />
          <rect
            x="145"
            y={otis.brakeZEngaged ? 94 : 87}
            width="20"
            height="7"
            fill={otis.brakeZEngaged ? "#ef4444" : "#64748b"}
            stroke="none"
          />
          <text x="20" y="224" fill="#f59e0b" fontSize="8">
            S/m/o/p/q/r · T · U/V · W/X/Y/Z
          </text>

          {/* A/B/C frame and D/a/d/E/F/f carriage. */}
          <rect x="226" y="24" width="142" height="12" fill="#6f4b2e" stroke="none" />
          <rect x="232" y="24" width="12" height="185" fill="#6f4b2e" stroke="none" />
          <rect x="350" y="24" width="12" height="185" fill="#6f4b2e" stroke="none" />
          <rect x="220" y="204" width="154" height="16" fill="#6f4b2e" stroke="none" />
          {Array.from({ length: 10 }, (_, index) => 48 + index * 14).map((y) => (
            <g key={y} fill="#94a3b8" stroke="none">
              <path d={`M 244 ${y} l 7 -4 v 8 z`} />
              <path d={`M 350 ${y} l -7 -4 v 8 z`} />
            </g>
          ))}
          <g transform={`translate(0 ${platformY})`}>
            <rect x="257" y="0" width="78" height="11" fill="#8b5e34" stroke="none" />
            <rect x="260" y="-38" width="8" height="38" fill="#64748b" stroke="none" />
            <rect x="324" y="-38" width="8" height="38" fill="#64748b" stroke="none" />
            <line x1="296" y1="-53" x2="296" y2="-22" stroke="#f59e0b" strokeWidth="3" />
            <path
              d="M 264 -22 L 281 -15 L 296 -22 M 328 -22 L 311 -15 L 296 -22"
              stroke="#cbd5e1"
              strokeWidth="3"
            />
            <line
              x1="264"
              y1="-22"
              x2={264 - pawlExtension}
              y2="-18"
              stroke="#f59e0b"
              strokeWidth="4"
            />
            <line
              x1="328"
              y1="-22"
              x2={328 + pawlExtension}
              y2="-18"
              stroke="#f59e0b"
              strokeWidth="4"
            />
          </g>

          {/* G and opposite-wound Q/R remain tethered in every state. */}
          {otis.ropeGTaut ? (
            <path
              d={`M 296 ${platformY - 53} L 296 30 L 268 30 L 92 174`}
              stroke="#d97706"
              strokeWidth="2.5"
            />
          ) : (
            <g stroke="#ef4444" strokeWidth="2.5">
              <path d={`M 296 ${platformY - 53} L 296 30 L 261 54`} />
              <path d="M 92 174 L 268 30 L 253 61" />
            </g>
          )}
          <path d={`M 92 174 L 342 30 L 342 ${counterY}`} stroke="#38bdf8" strokeWidth="2.5" />
          <rect x="333" y={counterY} width="18" height="27" fill="#475569" stroke="#38bdf8" />
          <text x="342" y={counterY + 17} fill="#f8fafc" fontSize="8" textAnchor="middle">
            R
          </text>
          <text
            x="286"
            y="16"
            fill={otis.freeFallCounterfactual ? "#fb7185" : "#34d399"}
            fontSize="8"
            textAnchor="middle"
          >
            {otis.mechanismMode.toUpperCase()} · G/i · Q/l/R
          </text>
        </g>
      );
    }
    case "westinghouse-air-brake": {
      const pipePsi = params?.trainPipePressure ?? 70;
      const wh = FrankenSimEngine.stepWestinghouseAirBrake({ trainPipePressurePsi: pipePsi });
      const isRel = wh.valveState === "RELEASE";
      const cylPsi = wh.brakeCylinderPressurePsi;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <line
            x1={wh.schematicPipeX1}
            y1={wh.schematicPipeY}
            x2={wh.schematicPipeX2}
            y2={wh.schematicPipeY}
            stroke={pipePsi > 40 ? "#10b981" : "#ef4444"}
            strokeWidth="5"
          />
          <text x="200" y="248" fill="#94a3b8" fontSize="8" textAnchor="middle">
            Continuous Train Pipe ({pipePsi} PSI)
          </text>

          <rect
            x={wh.schematicValveX}
            y={wh.schematicValveY}
            width={wh.schematicValveW}
            height={wh.schematicValveH}
            rx="4"
            stroke="#60a5fa"
            fill="#1e3a8a"
            fillOpacity="0.2"
          />
          <rect
            x={wh.schematicPistonX}
            y={isRel ? wh.schematicPistonReleaseY : wh.schematicPistonApplyY}
            width={wh.schematicPistonW}
            height={wh.schematicPistonH}
            fill="#f59e0b"
            stroke="#d97706"
            rx="2"
          />
          <text x="105" y="60" fill="#f59e0b" fontSize="8" textAnchor="middle">
            Triple Valve
          </text>

          <rect
            x={wh.schematicReservoirX}
            y={wh.schematicReservoirY}
            width={wh.schematicReservoirW}
            height={wh.schematicReservoirH}
            rx="25"
            stroke="#3b82f6"
            fill="#1e3a8a"
            fillOpacity="0.3"
            strokeWidth="2"
          />
          <text x="230" y="82" fill="#93c5fd" fontSize="8" textAnchor="middle">
            Aux Reservoir (70 PSI)
          </text>

          <rect
            x={wh.schematicCylinderX}
            y={wh.schematicCylinderY}
            width={wh.schematicCylinderW}
            height={wh.schematicCylinderH}
            rx="3"
            stroke="#f87171"
            fill="#7f1d1d"
            fillOpacity="0.2"
          />
          <rect
            x={wh.schematicPistonBarX + wh.pistonStrokePx}
            y={wh.schematicPistonBarY}
            width={wh.schematicPistonBarW}
            height={wh.schematicPistonBarH}
            fill="#ef4444"
          />
          <line
            x1={wh.schematicRodX1 + wh.pistonStrokePx}
            y1={wh.schematicRodY}
            x2={wh.schematicRodX2}
            y2={wh.schematicRodY}
            stroke="#e2e8f0"
            strokeWidth="4"
          />
          <text x="220" y="190" fill="#f87171" fontSize="8" textAnchor="middle">
            Cylinder ({cylPsi} PSI)
          </text>

          {/* Wheel & Shoe */}
          <circle
            cx={wh.schematicWheelCx}
            cy={wh.schematicWheelCy}
            r={wh.schematicWheelR}
            stroke="#94a3b8"
            strokeWidth="3"
          />
          <path d={wh.schematicShoeD} stroke="#f59e0b" strokeWidth="4" fill="none" />
          <text x="330" y="200" fill="#94a3b8" fontSize="8" textAnchor="middle">
            Rail Wheel
          </text>
        </g>
      );
    }
    case "mergenthaler-linotype": {
      const lino = stepMergenthalerLinotype({
        matrixRatePerMin: params?.matrixRate,
        spacebandWedgeMm: params?.spacebandWedge,
        potTempC: params?.potTemp,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <polygon
            points={lino.schematicMagazinePoints}
            stroke="#60a5fa"
            fill="#1e3a8a"
            fillOpacity="0.2"
          />
          {Array.from({ length: lino.schematicChuteCount }, (_, i) => {
            const x1 = mergenthalerSchematicChuteX(
              i,
              lino.schematicChuteOriginX,
              lino.schematicChutePitchX,
            );
            return (
              <line
                key={i}
                x1={x1}
                y1={lino.schematicChuteY1}
                x2={x1 + lino.schematicChuteDx}
                y2={lino.schematicChuteY2}
                stroke="#38bdf8"
                strokeDasharray="3 3"
              />
            );
          })}
          <rect
            x={lino.schematicAssemblerX}
            y={lino.schematicAssemblerY}
            width={lino.schematicAssemblerW}
            height={lino.schematicAssemblerH}
            rx="3"
            stroke="#fbbf24"
            fill="#78350f"
            fillOpacity="0.25"
          />
          <text x="150" y="162" fill="#fbbf24" fontSize="9" textAnchor="middle">
            Assembled Matrix Line + Spacebands
          </text>
          {/* Casting Mold Disk */}
          <circle
            cx={lino.schematicMoldCx}
            cy={lino.schematicMoldCy}
            r={lino.schematicMoldR}
            stroke="#f87171"
            strokeWidth="2"
          />
          <rect
            x={lino.schematicPumpX}
            y={lino.schematicPumpY}
            width={lino.schematicPumpW}
            height={lino.schematicPumpH}
            fill="#dc2626"
            fillOpacity="0.4"
            stroke="#f87171"
          />
          <text x="280" y="240" fill="#f87171" fontSize="9" textAnchor="middle">
            Casting Mold &amp; Lead Pump
          </text>
          <line
            x1={lino.schematicDistributorX1}
            y1={lino.schematicDistributorY}
            x2={lino.schematicDistributorX2}
            y2={lino.schematicDistributorY}
            stroke="#4ade80"
            strokeWidth="3"
          />
          <text x="200" y="15" fill="#4ade80" fontSize="9" textAnchor="middle">
            7-Bit Binary Distributor Bar
          </text>
        </g>
      );
    }
    case "maxim-machine-gun": {
      const maxim = stepMaximMachineGun({
        firingRateRpm: params?.firingRate ?? params?.fireRateRpm,
        waterJacketLiters: params?.waterLevel,
        recoilStrokeMm: params?.recoilStroke,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={maxim.schematicJacketX}
            y={maxim.schematicJacketY}
            width={maxim.schematicJacketW}
            height={maxim.schematicJacketH}
            rx="4"
            stroke="#60a5fa"
            fill="#0284c7"
            fillOpacity="0.25"
          />
          <line
            x1={maxim.schematicBarrelX1}
            y1={maxim.schematicBarrelY}
            x2={maxim.schematicBarrelX2}
            y2={maxim.schematicBarrelY}
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          <rect
            x={maxim.schematicBreechX}
            y={maxim.schematicBreechY}
            width={maxim.schematicBreechW}
            height={maxim.schematicBreechH}
            rx="3"
            stroke="#94a3b8"
          />
          <line
            x1={maxim.schematicToggleX0}
            y1={maxim.schematicToggleY0}
            x2={maxim.schematicToggleX1}
            y2={maxim.schematicToggleY1}
            stroke="#fbbf24"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1={maxim.schematicToggleX1}
            y1={maxim.schematicToggleY1}
            x2={maxim.schematicToggleX2}
            y2={maxim.schematicToggleY2}
            stroke="#fbbf24"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle
            cx={maxim.schematicToggleCx}
            cy={maxim.schematicToggleCy}
            r={maxim.schematicToggleR}
            fill="#fbbf24"
          />
          <path d={maxim.schematicFuseeD} stroke="#4ade80" strokeWidth="2" strokeDasharray="3 2" />
          <text x="130" y="110" fill="#93c5fd" fontSize="9" textAnchor="middle">
            Water Jacket (4L)
          </text>
          <text x="280" y="70" fill="#fbbf24" fontSize="9" textAnchor="middle">
            Toggle-Lock Linkage
          </text>
        </g>
      );
    }
    case "daimler-engine": {
      const shaftPosition = Math.round(params?.shaftPosition ?? 0);
      const coolingVisible = (params?.coolingPumpEnabled ?? 1) > 0;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect x="35" y="85" width="82" height="100" rx="8" stroke="#94a3b8" />
          <text x="76" y="76" fill="#93c5fd" fontSize="8" textAnchor="middle">
            Motor A
          </text>
          <line x1="117" y1="135" x2="185" y2="135" stroke="#e2e8f0" strokeWidth="5" />
          <circle cx="205" cy="135" r="20" stroke="#fbbf24" />
          <circle cx="255" cy="105" r="18" stroke="#4ade80" />
          <circle cx="255" cy="165" r="18" stroke="#f97316" />
          <line
            x1="225"
            y1="135"
            x2={shaftPosition < 0 ? 245 : shaftPosition > 0 ? 245 : 235}
            y2={shaftPosition < 0 ? 165 : shaftPosition > 0 ? 105 : 135}
            stroke="#f8fafc"
            strokeWidth="4"
          />
          <line x1="273" y1="105" x2="350" y2="135" stroke="#4ade80" strokeWidth="4" />
          <line x1="273" y1="165" x2="350" y2="135" stroke="#f97316" strokeWidth="4" />
          <text x="255" y="78" fill="#4ade80" fontSize="8" textAnchor="middle">
            ahead a / a²
          </text>
          <text x="255" y="198" fill="#f97316" fontSize="8" textAnchor="middle">
            astern e′ / e²
          </text>
          <text x="350" y="125" fill="#93c5fd" fontSize="8" textAnchor="middle">
            propeller shaft c
          </text>
          {coolingVisible && (
            <path d="M 55 205 C 110 245, 250 245, 330 205" stroke="#38bdf8" strokeDasharray="5 3" />
          )}
          <text x="190" y="260" fill="#38bdf8" fontSize="8" textAnchor="middle">
            cooling pump and water pipes
          </text>
        </g>
      );
    }
    case "eastman-kodak": {
      const kodakShutterRaw = params?.shutterSpeed ?? 0.05;
      const kodak = FrankenSimEngine.stepEastmanKodak({
        shutterSpeedSec: kodakShutterRaw > 1 ? 1 / kodakShutterRaw : kodakShutterRaw,
        apertureFNumber: params?.apertureStop,
        subjectDistanceM: params?.subjectDist,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={kodak.schematicBodyX}
            y={kodak.schematicBodyY}
            width={kodak.schematicBodyW}
            height={kodak.schematicBodyH}
            rx="8"
            stroke="#94a3b8"
            fill="#1e293b"
            fillOpacity="0.3"
          />
          {/* Film Supply & Take-Up Spools */}
          <circle
            cx={kodak.schematicSpoolCx}
            cy={kodak.schematicSpoolY0}
            r={kodak.schematicSpoolR}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <circle
            cx={kodak.schematicSpoolCx}
            cy={kodak.schematicSpoolY1}
            r={kodak.schematicSpoolR}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <line
            x1={kodak.schematicSpoolCx + kodak.schematicSpoolR}
            y1={kodak.schematicSpoolY0}
            x2={kodak.schematicSpoolCx + kodak.schematicSpoolR}
            y2={kodak.schematicSpoolY1}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          {/* Cone & Barrel Shutter */}
          <polygon
            points={kodak.schematicConePoints}
            stroke="#60a5fa"
            fill="#0284c7"
            fillOpacity="0.15"
          />
          <circle
            cx={kodak.schematicShutterCx}
            cy={kodak.schematicShutterCy}
            r={kodak.schematicShutterR}
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <rect
            x={kodak.schematicFinderX}
            y={kodak.schematicFinderY}
            width={kodak.schematicFinderW}
            height={kodak.schematicFinderH}
            rx="2"
            fill="#38bdf8"
            fillOpacity="0.4"
          />
          <text x="110" y="145" fill="#fbbf24" fontSize="8" textAnchor="middle">
            100-Exposure Spool
          </text>
          <text x="280" y="175" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Rotary Barrel Shutter
          </text>
        </g>
      );
    }
    case "hollerith-tabulating": {
      const hollerith = stepHollerithTabulating({
        cardsPerMin: params?.cardsPerMin,
        supplyVoltageV: params?.batteryVolts,
        activeRelays: params?.activeRelays,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={hollerith.schematicPressX}
            y={hollerith.schematicPressY}
            width={hollerith.schematicPressW}
            height={hollerith.schematicPressH}
            rx="3"
            fill="#64748b"
            stroke="#94a3b8"
          />
          {Array.from({ length: hollerith.schematicPinCount }, (_, i) => {
            const x = hollerithSchematicPinX(
              i,
              hollerith.schematicPinOriginX,
              hollerith.schematicPinPitchX,
            );
            return (
              <line
                key={i}
                x1={x}
                y1={hollerith.schematicPinY0}
                x2={x}
                y2={hollerith.schematicPinY1}
                stroke="#fbbf24"
                strokeWidth="2"
              />
            );
          })}
          <rect
            x={hollerith.schematicCardX}
            y={hollerith.schematicCardY}
            width={hollerith.schematicCardW}
            height={hollerith.schematicCardH}
            rx="2"
            fill="#d97706"
            stroke="#b45309"
          />
          <rect
            x={hollerith.schematicBedX}
            y={hollerith.schematicBedY}
            width={hollerith.schematicBedW}
            height={hollerith.schematicBedH}
            rx="4"
            fill="#0284c7"
            stroke="#0369a1"
          />
          {Array.from({ length: hollerith.schematicPinCount }, (_, i) => {
            const x = hollerithSchematicPinX(
              i,
              hollerith.schematicPinOriginX,
              hollerith.schematicPinPitchX,
            );
            return (
              <circle
                key={i}
                cx={x}
                cy={hollerith.schematicCupY}
                r={hollerith.schematicCupR}
                fill="#38bdf8"
              />
            );
          })}
          {/* Counter Dials Array */}
          <rect
            x={hollerith.schematicDialBoxX}
            y={hollerith.schematicDialBoxY}
            width={hollerith.schematicDialBoxW}
            height={hollerith.schematicDialBoxH}
            rx="6"
            stroke="#a855f7"
            fill="#581c87"
            fillOpacity="0.2"
          />
          {Array.from({ length: hollerith.schematicDialCount }, (_, i) => (
            <circle
              key={i}
              cx={hollerithSchematicDialX(
                i,
                hollerith.schematicDialOriginX,
                hollerith.schematicDialPitchX,
              )}
              cy={hollerith.schematicDialY}
              r={hollerith.schematicDialR}
              stroke="#c084fc"
            />
          ))}
          <text x="200" y="270" fill="#c084fc" fontSize="9" textAnchor="middle">
            Solenoid Ratchet Dial Accumulators
          </text>
        </g>
      );
    }
    case "reno-escalator": {
      const reno = stepRenoEscalator({
        passengerCount: params?.passengerCount,
        inclineAngleDeg: params?.inclineAngle,
        velocityMps: params?.beltSpeed,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <line
            x1={reno.schematicInclineX1}
            y1={reno.schematicInclineY1}
            x2={reno.schematicInclineX2}
            y2={reno.schematicInclineY2}
            stroke="#64748b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {Array.from({ length: reno.schematicCleatCount }, (_, i) => {
            const { x, y } = renoSchematicCleat(
              i,
              reno.schematicCleatOriginX,
              reno.schematicCleatOriginY,
              reno.schematicCleatPitchX,
              reno.schematicCleatPitchY,
            );
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={reno.schematicCleatW}
                height={reno.schematicCleatH}
                rx="2"
                fill="#d97706"
                stroke="#fbbf24"
              />
            );
          })}
          <polygon points={reno.schematicCombUpper} fill="#fbbf24" stroke="#b45309" />
          <polygon points={reno.schematicCombLower} fill="#fbbf24" stroke="#b45309" />
          <line
            x1={reno.schematicHandrailX1}
            y1={reno.schematicHandrailY1}
            x2={reno.schematicHandrailX2}
            y2={reno.schematicHandrailY2}
            stroke="#38bdf8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="190" y="110" fill="#38bdf8" fontSize="9" textAnchor="middle">
            Synchronous Moving Handrail
          </text>
          <text x="310" y="55" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Comb-Plate Teeth
          </text>
        </g>
      );
    }
    case "diesel-engine": {
      return (
        <g stroke="#fbbf24" strokeWidth="1.5" fill="none">
          <rect x="32" y="38" width="336" height="224" rx="8" stroke="#fbbf24" />
          <text x="200" y="92" fill="#fbbf24" fontSize="12" textAnchor="middle">
            Diesel visual held for source review
          </text>
          <text x="200" y="124" fill="#e2e8f0" fontSize="9" textAnchor="middle">
            The grant's process sequence is retained in the archival candidate.
          </text>
          <text x="200" y="148" fill="#e2e8f0" fontSize="9" textAnchor="middle">
            No measured machine state is published on this schematic.
          </text>
        </g>
      );
    }
    case "tesla-teleautomaton": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Submersible Boat Hull */}
          <path
            d="M 60 160 C 120 120, 280 120, 340 160 C 280 200, 120 200, 60 160 Z"
            stroke="#60a5fa"
            fill="#1e3a8a"
            fillOpacity="0.2"
          />
          {/* Receiving Mast Antenna */}
          <line x1="200" y1="140" x2="200" y2="60" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="200" cy="55" r="5" fill="#fbbf24" />
          {/* Coherer & Decoherer */}
          <rect
            x="150"
            y="150"
            width="40"
            height="15"
            rx="2"
            fill="#38bdf8"
            fillOpacity="0.3"
            stroke="#38bdf8"
          />
          {/* Rotary Commutator Drum */}
          <circle cx="240" cy="160" r="16" stroke="#4ade80" strokeWidth="2" />
          <text x="200" y="45" fill="#fbbf24" fontSize="9" textAnchor="middle">
            RF Antenna (150 kHz Tuning)
          </text>
          <text x="170" y="180" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Coherer
          </text>
          <text x="240" y="190" fill="#4ade80" fontSize="8" textAnchor="middle">
            6-State Drum
          </text>
        </g>
      );
    }
    case "zeppelin-airship": {
      const zep = stepZeppelinAirship({
        gasInflation: params?.gasInflation,
        flightAlt: params?.flightAlt,
        flightSpeedKnots: params?.flightSpeedKnots,
        trimWeight: params?.trimWeight,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <ellipse
            cx={zep.schematicHullCx}
            cy={zep.schematicHullCy}
            rx={zep.schematicHullRx}
            ry={zep.schematicHullRy}
            stroke="#94a3b8"
            fill="#1e293b"
            fillOpacity="0.2"
          />
          {Array.from({ length: zep.schematicCellCount }, (_, i) => (
            <ellipse
              key={i}
              cx={zeppelinSchematicCell(i, zep.schematicCellOriginX, zep.schematicCellPitch).cx}
              cy={zep.schematicCellCy}
              rx={zep.schematicCellRx}
              ry={zep.schematicCellRy}
              stroke="#38bdf8"
              strokeOpacity="0.6"
              strokeDasharray="3 2"
            />
          ))}
          <line
            x1={zep.schematicKeelX1}
            y1={zep.schematicKeelY}
            x2={zep.schematicKeelX2}
            y2={zep.schematicKeelY}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <circle
            cx={zep.schematicTrimX}
            cy={zep.schematicKeelY}
            r={zep.schematicTrimR}
            fill="#fbbf24"
          />
          {zep.schematicGondolaXs.map((_, i) => {
            const g = zeppelinSchematicGondola(i, zep.schematicGondolaXs, zep.schematicGondolaY);
            return (
              <rect
                key={i}
                x={g.x}
                y={g.y}
                width={zep.schematicGondolaW}
                height={zep.schematicGondolaH}
                rx="2"
                fill="#64748b"
              />
            );
          })}
          <text x="200" y="80" fill="#38bdf8" fontSize="9" textAnchor="middle">
            Rigid Duralumin Space-Frame (128m)
          </text>
          <text x="200" y="215" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Sliding Keel Ballast &amp; Twin Engine Cars
          </text>
        </g>
      );
    }
    case "de-forest-audion":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Glass Vacuum Bulb D */}
          <circle
            cx="180"
            cy="140"
            r="70"
            stroke="#38bdf8"
            strokeWidth="2"
            fill="#082f49"
            fillOpacity="0.4"
          />
          <rect
            x="160"
            y="210"
            width="40"
            height="25"
            stroke="#f59e0b"
            fill="#b45309"
            strokeWidth="1.5"
          />
          <text x="115" y="85" fill="#38bdf8" fontSize="10" fontFamily="monospace" stroke="none">
            Bulb D
          </text>

          {/* Heated Filament Cathode F */}
          <path d="M 150 170 L 155 125 L 160 170" stroke="#f59e0b" strokeWidth="2.5" />
          <text x="135" y="195" fill="#facc15" fontSize="9" fontFamily="monospace" stroke="none">
            F (Filament)
          </text>

          {/* Electrostatic Control Grid a */}
          <line
            x1="180"
            y1="110"
            x2="180"
            y2="170"
            stroke="#f43f5e"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <text x="175" y="98" fill="#fb7185" fontSize="9" fontFamily="monospace" stroke="none">
            a (Grid)
          </text>

          {/* Cold Plate Anode b */}
          <rect
            x="205"
            y="110"
            width="6"
            height="60"
            fill="#0284c7"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <text x="215" y="145" fill="#93c5fd" fontSize="9" fontFamily="monospace" stroke="none">
            b (Plate)
          </text>

          {/* Grid Condenser C */}
          <line x1="80" y1="140" x2="120" y2="140" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="120" y1="130" x2="120" y2="150" stroke="#38bdf8" strokeWidth="2" />
          <line x1="128" y1="130" x2="128" y2="150" stroke="#38bdf8" strokeWidth="2" />
          <line x1="128" y1="140" x2="180" y2="140" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="118" y="122" fill="#38bdf8" fontSize="9" fontFamily="monospace" stroke="none">
            Condenser C
          </text>

          {/* Plate Battery B & Telephone Receiver T */}
          <path d="M 211 140 L 280 140 L 280 200 L 210 200" stroke="#38bdf8" strokeWidth="1.5" />
          <rect
            x="265"
            y="160"
            width="30"
            height="20"
            stroke="#38bdf8"
            fill="#0369a1"
            strokeWidth="1.5"
          />
          <text x="270" y="174" fill="#38bdf8" fontSize="9" fontFamily="monospace" stroke="none">
            Tel T
          </text>
        </g>
      );
    case "hewitt-mercury-lamp":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Outer Glass Discharge Envelope (Tilted) */}
          <line
            x1="70"
            y1="180"
            x2="330"
            y2="120"
            stroke="#38bdf8"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.3"
          />
          <line x1="70" y1="180" x2="330" y2="120" stroke="#38bdf8" strokeWidth="2" />

          {/* Liquid Mercury Pool Cathode 1 */}
          <circle cx="70" cy="180" r="14" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="74" cy="178" r="3" fill="#ffffff" />
          <text x="50" y="210" fill="#38bdf8" fontSize="9" fontFamily="monospace" stroke="none">
            1 (Cathode)
          </text>

          {/* Solid Iron Anode 2 */}
          <rect
            x="325"
            y="112"
            width="10"
            height="16"
            fill="#0284c7"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <text x="325" y="102" fill="#38bdf8" fontSize="9" fontFamily="monospace" stroke="none">
            2 (Anode)
          </text>

          {/* Condensing Globe 8 */}
          <circle cx="345" cy="100" r="22" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="325" y="70" fill="#38bdf8" fontSize="9" fontFamily="monospace" stroke="none">
            8 (Condenser)
          </text>

          {/* Plasma Column Streamer */}
          <path
            d="M 82 178 Q 200 150 320 122"
            stroke="#22d3ee"
            strokeWidth="4"
            strokeDasharray="4 2"
          />

          {/* Ballast Inductor Choke */}
          <path
            d="M 70 200 C 70 240 120 240 120 220 C 120 240 170 240 170 220 C 170 240 220 240 220 220"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <text x="130" y="260" fill="#38bdf8" fontSize="9" fontFamily="monospace" stroke="none">
            Ballast Inductor
          </text>

          {/* High-Voltage Starting Transformer T */}
          <rect
            x="250"
            y="210"
            width="50"
            height="35"
            stroke="#38bdf8"
            strokeWidth="1.5"
            fill="#0369a1"
            fillOpacity="0.2"
          />
          <line
            x1="260"
            y1="210"
            x2="260"
            y2="245"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <line
            x1="290"
            y1="210"
            x2="290"
            y2="245"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text x="255" y="232" fill="#38bdf8" fontSize="9" fontFamily="monospace" stroke="none">
            Starter T
          </text>
        </g>
      );
    case "linde-air-liquefaction": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Compressor */}
          <rect
            x="40"
            y="50"
            width="70"
            height="60"
            rx="4"
            stroke="#f87171"
            fill="#7f1d1d"
            fillOpacity="0.3"
          />
          <text x="75" y="85" fill="#f87171" fontSize="10" textAnchor="middle">
            C
          </text>
          <text x="75" y="122" fill="#f87171" fontSize="8" textAnchor="middle">
            compressor
          </text>
          <path d="M 110 80 H 145" stroke="#fbbf24" />
          <text x="128" y="72" fill="#fbbf24" fontSize="9" textAnchor="middle">
            K
          </text>
          <text x="128" y="94" fill="#fbbf24" fontSize="7" textAnchor="middle">
            refrigerator
          </text>
          {/* Counter-Current Column */}
          <rect
            x="160"
            y="30"
            width="80"
            height="170"
            rx="6"
            stroke="#38bdf8"
            fill="#0284c7"
            fillOpacity="0.15"
          />
          <path
            d="M 180 40 L 180 190 M 200 40 L 200 190 M 220 40 L 220 190"
            stroke="#38bdf8"
            strokeDasharray="4 2"
          />
          <text x="235" y="112" fill="#38bdf8" fontSize="9">
            G′
          </text>
          {/* JT Valve & Vacuum Vessel */}
          <polygon points="200,195 190,210 210,210" fill="#fbbf24" stroke="#d97706" />
          <text x="218" y="201" fill="#fbbf24" fontSize="8">
            N / R′
          </text>
          <rect
            x="170"
            y="215"
            width="60"
            height="40"
            rx="4"
            stroke="#38bdf8"
            fill="#0369a1"
            fillOpacity="0.4"
          />
          <text x="200" y="240" fill="#38bdf8" fontSize="9" textAnchor="middle">
            V′
          </text>
          <text x="200" y="20" fill="#38bdf8" fontSize="9" textAnchor="middle">
            G′ counter-current apparatus
          </text>
          <path d="M 230 235 H 285 V 95" stroke="#a78bfa" strokeDasharray="3 2" />
          <text x="286" y="90" fill="#a78bfa" fontSize="9">
            V²
          </text>
          <text x="286" y="105" fill="#a78bfa" fontSize="8">
            S
          </text>
          <text x="286" y="120" fill="#a78bfa" fontSize="8">
            G² / G³
          </text>
        </g>
      );
    }
    case "carrier-air-conditioner": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Carrier source apparatus: spray, wet front, rear gutters, and trap. */}
          <rect
            x="40"
            y="60"
            width="320"
            height="140"
            rx="6"
            stroke="#94a3b8"
            fill="#0f172a"
            fillOpacity="0.3"
          />
          {/* Fine liquid spray h in casing m. */}
          <line x1="120" y1="70" x2="120" y2="190" stroke="#0284c7" strokeWidth="3" />
          {[90, 120, 150, 180].map((y) => (
            <polygon
              key={y}
              points={`120,${y} 150,${y - 12} 150,${y + 12}`}
              fill="#38bdf8"
              fillOpacity="0.4"
            />
          ))}
          {/* Upright sinuous plates with wet front faces and rear projections. */}
          {[190, 205, 220].map((x) => (
            <polyline
              key={x}
              points={`${x},70 ${x + 8},100 ${x},130 ${x + 8},160 ${x},190`}
              stroke="#94a3b8"
              strokeWidth="2"
            />
          ))}
          {[190, 205, 220].map((x) => (
            <path
              key={`gutter-${x}`}
              d={`M ${x + 8} 100 l 14 6 M ${x + 8} 160 l 14 6`}
              stroke="#fbbf24"
            />
          ))}
          <rect x="300" y="175" width="28" height="22" rx="2" fill="#164e63" stroke="#38bdf8" />
          <text x="120" y="50" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Fine spray h
          </text>
          <text x="205" y="50" fill="#94a3b8" fontSize="8" textAnchor="middle">
            Wet faces i / bends j
          </text>
          <text x="295" y="50" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Rear flanges b / c
          </text>
          <text x="315" y="215" fill="#7dd3fc" fontSize="8" textAnchor="middle">
            Trap J / filter L
          </text>
          <text x="200" y="240" fill="#4ade80" fontSize="9" textAnchor="middle">
            Wet air washing and sinuous liquid separation
          </text>
        </g>
      );
    }
    case "whitney-cotton-gin": {
      const gin = stepWhitneyCottonGin({ crankRpm: params?.crankRpm });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Hopper Frame */}
          <polygon
            points={gin.schematicHopperPoints}
            stroke="#94a3b8"
            fill="#1e293b"
            fillOpacity="0.2"
          />
          <path d={gin.schematicGrateD0} stroke="#fbbf24" strokeWidth="3" />
          <path d={gin.schematicGrateD1} stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
          <circle
            cx={gin.schematicSawCx}
            cy={gin.schematicSawCy}
            r={gin.schematicSawR}
            stroke="#38bdf8"
            strokeWidth="2"
            fill="#0369a1"
            fillOpacity="0.2"
          />
          {Array.from({ length: gin.schematicSawToothCount }, (_, i) => {
            const tooth = whitneySchematicRay(
              i * gin.schematicSawToothPitchDeg,
              gin.schematicSawCx,
              gin.schematicSawCy,
              gin.schematicSawInnerR,
              gin.schematicSawOuterR,
              gin.schematicSawTwistRad,
            );
            return (
              <line
                key={i}
                x1={tooth.x1}
                y1={tooth.y1}
                x2={tooth.x2}
                y2={tooth.y2}
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
            );
          })}
          {/* Revolving Clearing Brush */}
          <circle
            cx={gin.schematicBrushCx}
            cy={gin.schematicBrushCy}
            r={gin.schematicBrushR}
            stroke="#4ade80"
            strokeWidth="2"
            fill="#15803d"
            fillOpacity="0.2"
          />
          {Array.from({ length: gin.schematicBrushRayCount }, (_, i) => {
            const bristle = whitneySchematicRay(
              i * gin.schematicBrushRayPitchDeg,
              gin.schematicBrushCx,
              gin.schematicBrushCy,
              gin.schematicBrushInnerR,
              gin.schematicBrushOuterR,
            );
            return (
              <line
                key={i}
                x1={bristle.x1}
                y1={bristle.y1}
                x2={bristle.x2}
                y2={bristle.y2}
                stroke="#4ade80"
                strokeWidth="2"
              />
            );
          })}
          <text x="120" y="30" fill="#94a3b8" fontSize="8" textAnchor="middle">
            Seed Cotton Feed
          </text>
          <text x="175" y="65" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Grate Ribs
          </text>
          <text x="210" y="210" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Saw Cylinder
          </text>
          <text x="300" y="200" fill="#4ade80" fontSize="8" textAnchor="middle">
            Clearing Brush
          </text>
        </g>
      );
    }
    case "mccormick-reaper": {
      const reel = stepMcCormickReaper({ forwardSpeedMph: params?.forwardSpeedMph });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <circle
            cx={reel.schematicBullCx}
            cy={reel.schematicBullCy}
            r={reel.schematicBullR}
            stroke="#94a3b8"
            strokeWidth="3"
          />
          <circle
            cx={reel.schematicBullCx}
            cy={reel.schematicBullCy}
            r={reel.schematicBullHubR}
            fill="#64748b"
          />
          {/* Gathering Reel */}
          <circle
            cx={reel.schematicReelCx}
            cy={reel.schematicReelCy}
            r={reel.schematicReelR}
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          {Array.from({ length: reel.reelArmCount }, (_, i) => {
            const arm = mccormickSchematicReelArm(
              i * reel.schematicReelArmPitchDeg,
              reel.schematicReelCx,
              reel.schematicReelCy,
              reel.schematicReelR,
            );
            return (
              <g key={i}>
                <line
                  x1={reel.schematicReelCx}
                  y1={reel.schematicReelCy}
                  x2={arm.x}
                  y2={arm.y}
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
                <rect
                  x={arm.x - reel.schematicArmOx}
                  y={arm.y - reel.schematicArmOy}
                  width={reel.schematicArmW}
                  height={reel.schematicArmH}
                  fill="#d97706"
                  rx="2"
                />
              </g>
            );
          })}
          {/* Cutting Sickle Bar */}
          <line
            x1={reel.schematicSickleX1}
            y1={reel.schematicSickleY}
            x2={reel.schematicSickleX2}
            y2={reel.schematicSickleY}
            stroke="#ef4444"
            strokeWidth="4"
          />
          {Array.from({ length: reel.schematicSickleCount }, (_, i) => {
            const x = mccormickSchematicSickleX(
              i,
              reel.schematicSickleOriginX,
              reel.schematicSicklePitchX,
            );
            return (
              <polygon
                key={i}
                points={`${x},${reel.schematicSickleY} ${x + reel.schematicSickleTipDx},${reel.schematicSickleY - reel.schematicSickleLift} ${x + reel.schematicSickleMidDx},${reel.schematicSickleY}`}
                fill="#ef4444"
              />
            );
          })}
          {/* Platform */}
          <polygon
            points={reel.schematicPlatformPoints}
            fill="#1e293b"
            fillOpacity="0.4"
            stroke="#64748b"
          />
          <text x="100" y="240" fill="#94a3b8" fontSize="8" textAnchor="middle">
            Bull Wheel Drive
          </text>
          <text x="210" y="40" fill="#fbbf24" fontSize="8" textAnchor="middle">
            4-Vane Gathering Reel
          </text>
          <text x="240" y="225" fill="#ef4444" fontSize="8" textAnchor="middle">
            Reciprocating Sickle
          </text>
        </g>
      );
    }
    case "davenport-motor": {
      const motor = stepDavenportMotor({
        batteryVoltage: params?.batteryVoltage,
        loadTorque: params?.loadTorque,
      });
      const armature = davenportSchematicArmature(
        motor.schematicArmatureX,
        motor.schematicArmatureY,
        motor.schematicArmatureW,
        motor.schematicArmatureH,
      );
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path
            d={motor.schematicNorthD}
            stroke="#38bdf8"
            fill="#0369a1"
            fillOpacity="0.25"
            strokeWidth="2"
          />
          <path
            d={motor.schematicSouthD}
            stroke="#ef4444"
            fill="#b91c1c"
            fillOpacity="0.25"
            strokeWidth="2"
          />
          <text
            x={motor.schematicNorthLabelX}
            y={motor.schematicPoleLabelY}
            fill="#38bdf8"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            N
          </text>
          <text
            x={motor.schematicSouthLabelX}
            y={motor.schematicPoleLabelY}
            fill="#ef4444"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            S
          </text>
          <rect
            x={armature.x}
            y={armature.y}
            width={armature.w}
            height={armature.h}
            rx="4"
            stroke="#fbbf24"
            fill="#78350f"
            fillOpacity="0.3"
            strokeWidth="2"
          />
          <circle
            cx={motor.schematicCenterX}
            cy={motor.schematicCenterY}
            r={motor.schematicCommutatorR}
            stroke="#4ade80"
            fill="#15803d"
            fillOpacity="0.4"
          />
          <line
            x1={motor.schematicLeftBrushX1}
            y1={motor.schematicBrushY}
            x2={motor.schematicLeftBrushX2}
            y2={motor.schematicBrushY}
            stroke="#f59e0b"
            strokeWidth="3"
          />
          <line
            x1={motor.schematicRightBrushX1}
            y1={motor.schematicBrushY}
            x2={motor.schematicRightBrushX2}
            y2={motor.schematicBrushY}
            stroke="#f59e0b"
            strokeWidth="3"
          />
          <text
            x={motor.schematicCenterX}
            y={motor.schematicArmatureLabelY}
            fill="#fbbf24"
            fontSize="8"
            textAnchor="middle"
          >
            Rotating Armature
          </text>
          <text
            x={motor.schematicCenterX}
            y={motor.schematicCommutatorLabelY}
            fill="#4ade80"
            fontSize="8"
            textAnchor="middle"
          >
            Split Commutator
          </text>
        </g>
      );
    }
    case "ericsson-propeller": {
      const screw = stepEricssonPropeller({
        shaftRpm: params?.shaftRpm,
        bladePitchAngleDeg: params?.bladePitchAngleDeg,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path d={screw.schematicSternD} stroke="#64748b" strokeWidth="3" />
          <line
            x1={screw.schematicShaftX1}
            y1={screw.schematicShaftY}
            x2={screw.schematicShaftX2}
            y2={screw.schematicShaftY}
            stroke="#94a3b8"
            strokeWidth="4"
          />
          {/* Forward Helical Screw */}
          <ellipse
            cx={screw.schematicForwardCx}
            cy={screw.schematicForwardCy}
            rx={screw.schematicForwardRx}
            ry={screw.schematicForwardRy}
            stroke="#38bdf8"
            strokeWidth="2"
            fill="#0284c7"
            fillOpacity="0.2"
          />
          <path d={screw.schematicForwardHelixD} stroke="#38bdf8" strokeWidth="3" />
          {/* Aft Contra-Rotating Screw */}
          <ellipse
            cx={screw.schematicAftCx}
            cy={screw.schematicAftCy}
            rx={screw.schematicAftRx}
            ry={screw.schematicAftRy}
            stroke="#4ade80"
            strokeWidth="2"
            fill="#15803d"
            fillOpacity="0.2"
          />
          <path d={screw.schematicAftHelixD} stroke="#4ade80" strokeWidth="3" />
          <text x="210" y="85" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Forward Screw (CW)
          </text>
          <text x="280" y="85" fill="#4ade80" fontSize="8" textAnchor="middle">
            Aft Screw (CCW)
          </text>
          <text x="200" y="235" fill="#94a3b8" fontSize="9" textAnchor="middle">
            Submerged Coaxial Drive
          </text>
        </g>
      );
    }
    case "watt-separate-condenser": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Engine House Wall */}
          <rect
            x="180"
            y="40"
            width="40"
            height="240"
            stroke="#64748b"
            strokeWidth="2"
            fill="#1e293b"
            fillOpacity="0.3"
          />
          {/* Walking Beam */}
          <line x1="50" y1="50" x2="350" y2="50" stroke="#f59e0b" strokeWidth="4" />
          <circle cx="200" cy="50" r="8" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
          {/* Steam Jacket & Cylinder */}
          <rect
            x="70"
            y="90"
            width="70"
            height="90"
            rx="4"
            stroke="#f59e0b"
            strokeWidth="2"
            fill="#78350f"
            fillOpacity="0.2"
          />
          <rect
            x="80"
            y="95"
            width="50"
            height="80"
            stroke="#94a3b8"
            strokeWidth="1.5"
            fill="#0f172a"
          />
          <rect x="82" y="130" width="46" height="12" fill="#64748b" />
          {/* Boiler */}
          <path
            d="M 20 180 L 20 240 L 60 240 L 60 180 Q 40 160 20 180 Z"
            stroke="#b45309"
            strokeWidth="2"
            fill="#78350f"
            fillOpacity="0.3"
          />
          {/* Condenser & Cistern */}
          <rect
            x="75"
            y="200"
            width="90"
            height="60"
            rx="4"
            stroke="#0284c7"
            strokeWidth="2"
            fill="#0369a1"
            fillOpacity="0.2"
          />
          <rect
            x="85"
            y="210"
            width="30"
            height="40"
            stroke="#38bdf8"
            strokeWidth="1.5"
            fill="#0f172a"
          />
          <rect
            x="125"
            y="210"
            width="25"
            height="40"
            stroke="#94a3b8"
            strokeWidth="1.5"
            fill="#0f172a"
          />
          {/* Labels */}
          <text x="105" y="85" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">
            STEAM JACKET (B)
          </text>
          <text x="100" y="268" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
            CONDENSER (E)
          </text>
          <text x="40" y="252" fill="#d97706" fontSize="8" textAnchor="middle">
            BOILER (A)
          </text>
        </g>
      );
    }
    case "arkwright-water-frame": {
      return (
        <g stroke="#f59e0b" strokeWidth="1.5" fill="none">
          {/* Framework Outlines */}
          <rect
            x="30"
            y="20"
            width="340"
            height="260"
            stroke="#94a3b8"
            strokeWidth="2"
            fill="#0f172a"
            fillOpacity="0.3"
          />
          {/* Great Driving Drum (A) */}
          <circle
            cx="280"
            cy="220"
            r="35"
            stroke="#f59e0b"
            strokeWidth="2"
            fill="#78350f"
            fillOpacity="0.3"
          />
          <circle cx="280" cy="220" r="6" fill="#fbbf24" />
          {/* Differential Drawing Rollers (C) */}
          <g transform="translate(120, 70)">
            <rect
              x="-40"
              y="-12"
              width="16"
              height="10"
              rx="2"
              stroke="#38bdf8"
              fill="#0284c7"
              fillOpacity="0.4"
            />
            <rect
              x="-40"
              y="2"
              width="16"
              height="10"
              rx="2"
              stroke="#d97706"
              fill="#b45309"
              fillOpacity="0.4"
            />
            <rect
              x="25"
              y="-12"
              width="16"
              height="10"
              rx="2"
              stroke="#38bdf8"
              fill="#0284c7"
              fillOpacity="0.4"
            />
            <rect
              x="25"
              y="2"
              width="16"
              height="10"
              rx="2"
              stroke="#d97706"
              fill="#b45309"
              fillOpacity="0.4"
            />
            {/* Weight Saddle (D) */}
            <line x1="-32" y1="-8" x2="-32" y2="35" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="-32" cy="38" r="5" fill="#475569" />
          </g>
          {/* Spindle & Flyer (E) */}
          <g transform="translate(120, 150)">
            <line x1="0" y1="-40" x2="0" y2="100" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M 0 -40 C -25 -20, -25 30, -25 45" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 0 -40 C 25 -20, 25 30, 25 45" stroke="#38bdf8" strokeWidth="2" />
            {/* Bobbin (F) */}
            <rect
              x="-12"
              y="10"
              width="24"
              height="30"
              rx="2"
              stroke="#fbbf24"
              fill="#d97706"
              fillOpacity="0.5"
            />
          </g>
          {/* Heart-Cam (G) */}
          <g transform="translate(280, 120)">
            <path
              d="M 0 -15 C 14 -22, 22 -6, 0 20 C -22 -6, -14 -22, 0 -15 Z"
              stroke="#ec4899"
              strokeWidth="2"
              fill="#be185d"
              fillOpacity="0.3"
            />
            <line
              x1="0"
              y1="8"
              x2="-140"
              y2="55"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
          </g>
          {/* Annotations */}
          <text x="120" y="45" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
            DRAFT ROLLERS (C)
          </text>
          <text x="120" y="240" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
            FLYER &amp; BOBBIN (E/F)
          </text>
          <text x="280" y="270" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">
            DRIVING DRUM (A)
          </text>
          <text x="280" y="95" fill="#ec4899" fontSize="8" fontWeight="bold" textAnchor="middle">
            HEART-CAM (G)
          </text>
        </g>
      );
    }
    case "watt-rotary-engine": {
      return (
        <g stroke="#f59e0b" strokeWidth="1.5" fill="none">
          {/* Masonry Pillar & Wall */}
          <rect
            x="30"
            y="160"
            width="80"
            height="150"
            stroke="#78716c"
            strokeWidth="1.5"
            fill="#1c1917"
          />
          <rect
            x="175"
            y="100"
            width="40"
            height="210"
            stroke="#78716c"
            strokeWidth="1.5"
            fill="#292524"
          />

          {/* Steam Cylinder & Piston */}
          <rect
            x="45"
            y="180"
            width="50"
            height="100"
            stroke="#64748b"
            strokeWidth="2"
            fill="#1e293b"
          />
          <rect x="48" y="220" width="44" height="15" fill="#d97706" stroke="#b45309" />
          <line x1="70" y1="220" x2="70" y2="100" stroke="#e2e8f0" strokeWidth="3" />

          {/* Walking Beam */}
          <polygon
            points="65,95 195,85 305,95 305,105 195,115 65,105"
            fill="#44403c"
            stroke="#e7e5e4"
            strokeWidth="1.5"
          />
          <circle cx="195" cy="100" r="7" fill="#f59e0b" />

          {/* Connecting Spear / Rod */}
          <line
            x1="305"
            y1="100"
            x2="340"
            y2="240"
            stroke="#e2e8f0"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Orbit Guideline Circle */}
          <circle cx="310" cy="270" r="50" stroke="#d97706" strokeWidth="1" strokeDasharray="3,3" />

          {/* Sun Gear (Keyed to Flywheel Shaft) */}
          <circle
            cx="310"
            cy="270"
            r="25"
            fill="#b45309"
            fillOpacity="0.4"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <circle cx="310" cy="270" r="8" fill="#1e293b" stroke="#f59e0b" />

          {/* Planet Gear (Bolted to Rod) */}
          <circle
            cx="340"
            cy="240"
            r="25"
            fill="#0284c7"
            fillOpacity="0.4"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <circle cx="340" cy="240" r="6" fill="#1e293b" stroke="#38bdf8" />

          {/* Radius Guide Link */}
          <line
            x1="310"
            y1="270"
            x2="340"
            y2="240"
            stroke="#64748b"
            strokeWidth="2.5"
            strokeDasharray="3,2"
          />

          {/* Flywheel Rim */}
          <circle cx="310" cy="270" r="80" stroke="#64748b" strokeWidth="5" opacity="0.7" />
          <line x1="230" y1="270" x2="390" y2="270" stroke="#475569" strokeWidth="1.5" />
          <line x1="310" y1="190" x2="310" y2="350" stroke="#475569" strokeWidth="1.5" />

          {/* Annotations */}
          <text x="195" y="75" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">
            WALKING BEAM (A)
          </text>
          <text x="70" y="300" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
            CYLINDER (F)
          </text>
          <text x="365" y="170" fill="#e2e8f0" fontSize="8" fontWeight="bold">
            CONNECTING ROD (B)
          </text>
          <text x="370" y="245" fill="#38bdf8" fontSize="8" fontWeight="bold">
            PLANET (C)
          </text>
          <text x="270" y="275" fill="#f59e0b" fontSize="8" fontWeight="bold">
            SUN (D)
          </text>
          <text x="310" y="365" fill="#a8a29e" fontSize="8" fontWeight="bold" textAnchor="middle">
            FLYWHEEL &amp; SHAFT (E)
          </text>
        </g>
      );
    }
    case "cort-puddling-rolling": {
      return (
        <g stroke="#f59e0b" strokeWidth="1.5" fill="none">
          {/* Reverberatory Furnace Brickwork */}
          <rect
            x="25"
            y="70"
            width="170"
            height="180"
            stroke="#78716c"
            strokeWidth="1.5"
            fill="#1c1917"
          />
          {/* Coal Grate (A) */}
          <rect x="35" y="160" width="45" height="70" stroke="#f59e0b" fill="#451a03" />
          <line x1="35" y1="195" x2="80" y2="195" stroke="#f59e0b" strokeDasharray="3,3" />
          <text x="57" y="185" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">
            GRATE (A)
          </text>

          {/* Fire Bridge (B) */}
          <rect x="85" y="150" width="15" height="80" fill="#292524" stroke="#a8a29e" />

          {/* Concave Hearth (C) */}
          <path d="M 105 170 Q 150 215 190 170" stroke="#ea580c" strokeWidth="2.5" fill="#7c2d12" />
          <ellipse cx="148" cy="190" rx="16" ry="8" fill="#f59e0b" stroke="#78350f" />
          <text x="148" y="160" fill="#fed7aa" fontSize="7" fontWeight="bold" textAnchor="middle">
            HEARTH (C)
          </text>

          {/* Arched Roof (D) */}
          <path
            d="M 30 110 Q 110 75 190 110"
            stroke="#f97316"
            strokeWidth="2.5"
            strokeDasharray="4,2"
          />
          <text x="110" y="98" fill="#fdba74" fontSize="7" textAnchor="middle">
            ROOF (D)
          </text>

          {/* Chimney Stack (F) */}
          <rect x="180" y="40" width="25" height="150" fill="#292524" stroke="#78716c" />
          <text x="192" y="32" fill="#a8a29e" fontSize="7" textAnchor="middle">
            STACK (F)
          </text>

          {/* ============================== */}
          {/* Grooved Rolling Mill (Right)   */}
          {/* ============================== */}
          <rect
            x="225"
            y="70"
            width="150"
            height="180"
            stroke="#78716c"
            strokeWidth="1.5"
            fill="#18181b"
          />
          {/* Left & Right Mill Stands (H) */}
          <rect x="235" y="85" width="22" height="150" fill="#3f3f46" stroke="#a1a1aa" />
          <rect x="340" y="85" width="22" height="150" fill="#3f3f46" stroke="#a1a1aa" />

          {/* Rollers (J) */}
          <rect
            x="257"
            y="110"
            width="83"
            height="38"
            rx="4"
            fill="#52525b"
            stroke="#e4e4e7"
            strokeWidth="1.2"
          />
          <rect
            x="257"
            y="162"
            width="83"
            height="38"
            rx="4"
            fill="#52525b"
            stroke="#e4e4e7"
            strokeWidth="1.2"
          />

          {/* Matching Grooves in Rollers */}
          <rect x="268" y="120" width="14" height="28" fill="#18181b" stroke="#71717a" />
          <rect x="268" y="162" width="14" height="28" fill="#18181b" stroke="#71717a" />
          <rect x="290" y="125" width="10" height="23" fill="#18181b" stroke="#71717a" />
          <rect x="290" y="162" width="10" height="23" fill="#18181b" stroke="#71717a" />
          <circle cx="312" cy="148" r="7" fill="#18181b" stroke="#71717a" />
          <circle cx="328" cy="148" r="4.5" fill="#18181b" stroke="#71717a" />

          {/* Hot Wrought Iron Billet Traversing Pass 1 */}
          <rect
            x="264"
            y="142"
            width="22"
            height="26"
            rx="2"
            fill="#ef4444"
            stroke="#b91c1c"
            strokeWidth="1.5"
          />

          {/* Adjustment Screws (K) */}
          <line x1="246" y1="65" x2="246" y2="85" stroke="#e4e4e7" strokeWidth="2.5" />
          <line x1="351" y1="65" x2="351" y2="85" stroke="#e4e4e7" strokeWidth="2.5" />

          <text x="300" y="98" fill="#e4e4e7" fontSize="8" fontWeight="bold" textAnchor="middle">
            GROOVED ROLLS (J)
          </text>
          <text x="300" y="225" fill="#f87171" fontSize="7" fontWeight="bold" textAnchor="middle">
            SQUEEZE PASS (P = 45 MPa)
          </text>
        </g>
      );
    }
    case "corliss-engine": {
      const corliss = stepCorlissEngine({
        steamPressurePsi: params?.steamPressurePsi,
        engineRpm: params?.engineRpm,
        cutoffPct: params?.cutoffPct,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={corliss.schematicCylinderX}
            y={corliss.schematicCylinderY}
            width={corliss.schematicCylinderW}
            height={corliss.schematicCylinderH}
            rx="6"
            stroke="#94a3b8"
            fill="#1e293b"
            fillOpacity="0.2"
          />
          {/* 4 Oscillating Rotary Valves */}
          {Array.from({ length: corliss.schematicValveXs.length }, (_, i) => {
            const valve = corlissSchematicValve(
              i,
              corliss.schematicValveXs,
              corliss.schematicValveYs,
            );
            const isSteam = i < 2;
            return (
              <circle
                key={i}
                cx={valve.cx}
                cy={valve.cy}
                r={corliss.schematicValveR}
                stroke={isSteam ? "#ef4444" : "#38bdf8"}
                fill={isSteam ? "#7f1d1d" : "#0369a1"}
                fillOpacity="0.3"
                strokeWidth="2"
              />
            );
          })}
          {/* Central Wrist-Plate */}
          <circle
            cx={corliss.schematicWristCx}
            cy={corliss.schematicWristCy}
            r={corliss.schematicWristR}
            stroke="#fbbf24"
            strokeWidth="2.5"
            fill="#78350f"
            fillOpacity="0.2"
          />
          <line
            x1={corliss.schematicWristCx}
            y1={corliss.schematicLinkTopY}
            x2={corliss.schematicLinkInnerX}
            y2={corliss.schematicLinkValveTopY}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <line
            x1={corliss.schematicWristCx}
            y1={corliss.schematicLinkTopY}
            x2={corliss.schematicLinkOuterX}
            y2={corliss.schematicLinkValveTopY}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <line
            x1={corliss.schematicWristCx}
            y1={corliss.schematicLinkBotY}
            x2={corliss.schematicLinkInnerX}
            y2={corliss.schematicLinkValveBotY}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <line
            x1={corliss.schematicWristCx}
            y1={corliss.schematicLinkBotY}
            x2={corliss.schematicLinkOuterX}
            y2={corliss.schematicLinkValveBotY}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <text x="200" y="154" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Wrist Plate
          </text>
          <text x="200" y="70" fill="#ef4444" fontSize="8" textAnchor="middle">
            Trip Drop Steam Admission
          </text>
          <text x="200" y="235" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Rotary Exhaust Ports
          </text>
        </g>
      );
    }
    case "gatling-gun": {
      const gatling = stepGatlingGun({
        crankRpm: params?.crankRpm,
        barrelCount: params?.barrelCount,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* 6 Revolving Barrels */}
          {Array.from({ length: gatling.schematicBarrelCount }, (_, i) => {
            const y = gatlingSchematicBarrelY(
              i * gatling.barrelSpacingDeg,
              gatling.schematicBarrelCenterY,
              gatling.schematicBarrelAmpY,
            );
            return (
              <line
                key={i}
                x1={gatling.schematicBarrelX1}
                y1={y}
                x2={gatling.schematicBarrelX2}
                y2={y}
                stroke="#94a3b8"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
          {/* Breech Casing & Cam Track */}
          <rect
            x={gatling.schematicBreechX}
            y={gatling.schematicBreechY}
            width={gatling.schematicBreechW}
            height={gatling.schematicBreechH}
            rx="4"
            stroke="#60a5fa"
            fill="#1e3a8a"
            fillOpacity="0.2"
            strokeWidth="2"
          />
          <path
            d={gatling.schematicCamD}
            stroke="#fbbf24"
            strokeWidth="2.5"
            strokeDasharray="3 3"
          />
          <polygon
            points={gatling.schematicHopperPoints}
            stroke="#4ade80"
            fill="#15803d"
            fillOpacity="0.2"
            strokeWidth="2"
          />
          <line
            x1={gatling.schematicCrankX0}
            y1={gatling.schematicCrankY}
            x2={gatling.schematicCrankX1}
            y2={gatling.schematicCrankY}
            stroke="#f59e0b"
            strokeWidth="3"
          />
          <line
            x1={gatling.schematicCrankX1}
            y1={gatling.schematicCrankY}
            x2={gatling.schematicCrankX1}
            y2={gatling.schematicCrankY1}
            stroke="#f59e0b"
            strokeWidth="3"
          />
          <circle
            cx={gatling.schematicCrankX1}
            cy={gatling.schematicCrankY1}
            r={gatling.schematicCrankR}
            fill="#f59e0b"
          />
          <text x="120" y="42" fill="#4ade80" fontSize="8" textAnchor="middle">
            Gravity Feed Hopper
          </text>
          <text x="125" y="180" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Spiral Cam Track
          </text>
          <text x="265" y="110" fill="#94a3b8" fontSize="8" textAnchor="middle">
            6 Revolving Barrels
          </text>
        </g>
      );
    }
    case "nobel-dynamite": {
      const nobel = stepNobelDynamite({
        ngConcentrationPct: params?.ngConcentrationPct ?? params?.ngConcentration,
        capEnergyJoules: params?.capEnergyJoules,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Cartridge Cylinder */}
          <rect
            x={nobel.schematicCartridgeX}
            y={nobel.schematicCartridgeY}
            width={nobel.schematicCartridgeW}
            height={nobel.schematicCartridgeH}
            rx="8"
            stroke="#f59e0b"
            fill="#78350f"
            fillOpacity="0.3"
            strokeWidth="2"
          />
          {/* Kieselguhr Porous Matrix Pattern */}
          {Array.from({ length: nobel.schematicKieselguhrCols }, (_, col) =>
            Array.from({ length: nobel.schematicKieselguhrRows }, (_, row) => {
              const grain = nobelSchematicKieselguhr(
                col,
                row,
                nobel.schematicKieselguhrOriginX,
                nobel.schematicKieselguhrOriginY,
                nobel.schematicKieselguhrPitchX,
                nobel.schematicKieselguhrPitchY,
              );
              return (
                <circle
                  key={`${col}-${row}`}
                  cx={grain.cx}
                  cy={grain.cy}
                  r={nobel.schematicGrainR}
                  fill="#fbbf24"
                  fillOpacity="0.4"
                  stroke="#d97706"
                />
              );
            }),
          )}
          {/* Blasting Cap */}
          <rect
            x={nobel.schematicCapX}
            y={nobel.schematicCapY}
            width={nobel.schematicCapW}
            height={nobel.schematicCapH}
            rx="3"
            fill="#ef4444"
            stroke="#dc2626"
            strokeWidth="2"
          />
          <path d={nobel.schematicFuseD} stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 2" />
          <text x="175" y="100" fill="#fbbf24" fontSize="9" textAnchor="middle">
            Kieselguhr Matrix (75% NG)
          </text>
          <text x="282" y="175" fill="#ef4444" fontSize="8" textAnchor="middle">
            Fulminate Cap
          </text>
          <text x="345" y="125" fill="#e2e8f0" fontSize="8" textAnchor="middle">
            Safety Fuse
          </text>
        </g>
      );
    }
    case "sholes-typewriter": {
      const sholes = stepSholesTypewriter(40, 0);
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Circular Type Basket */}
          <circle
            cx={sholes.schematicTypebarHubX}
            cy={sholes.schematicTypebarHubY}
            r={sholes.schematicBasketR}
            stroke="#94a3b8"
            strokeWidth="2"
            fill="#1e293b"
            fillOpacity="0.2"
          />
          {/* Radial Typebars Converging to Center */}
          {Array.from({ length: sholes.schematicTypebarCount }, (_, i) => {
            const bar = sholesSchematicTypebar(
              i,
              sholes.schematicTypebarStartDeg,
              sholes.schematicTypebarPitchDeg,
              sholes.schematicTypebarHubX,
              sholes.schematicTypebarHubY,
              sholes.schematicTypebarR,
            );
            return (
              <line
                key={i}
                x1={bar.x}
                y1={bar.y}
                x2={sholes.schematicTypebarHubX}
                y2={sholes.schematicTypebarHubY}
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
            );
          })}
          <circle
            cx={sholes.schematicTypebarHubX}
            cy={sholes.schematicTypebarHubY}
            r={sholes.schematicHubR}
            stroke="#ef4444"
            strokeWidth="2"
            fill="#991b1b"
            fillOpacity="0.4"
          />
          {/* Platen Cylinder */}
          <rect
            x={sholes.schematicPlatenX}
            y={sholes.schematicPlatenY}
            width={sholes.schematicPlatenW}
            height={sholes.schematicPlatenH}
            rx="5"
            stroke="#fbbf24"
            fill="#78350f"
            fillOpacity="0.3"
            strokeWidth="2"
          />
          <text x="200" y="50" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Platen Cylinder
          </text>
          <text x="200" y="195" fill="#ef4444" fontSize="8" textAnchor="middle">
            Striking Center
          </text>
          <text x="200" y="255" fill="#94a3b8" fontSize="9" textAnchor="middle">
            QWERTY Radial Type-Basket
          </text>
        </g>
      );
    }
    case "hyatt-celluloid": {
      const hyatt = stepHyattCelluloid({
        steamTempC: params?.steamTempC ?? params?.tempCelsius,
        hydraulicPressureMpa: params?.hydraulicPressureMpa,
      });
      const ram = hyattSchematicRam(
        hyatt.schematicRamX,
        hyatt.schematicRamY,
        hyatt.schematicRamW,
        hyatt.schematicRamH,
      );
      const mold = hyattSchematicMold(
        hyatt.schematicMoldX,
        hyatt.schematicMoldY,
        hyatt.schematicMoldW,
        hyatt.schematicMoldH,
      );
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={hyatt.schematicJacketX}
            y={hyatt.schematicJacketY}
            width={hyatt.schematicJacketW}
            height={hyatt.schematicJacketH}
            rx="4"
            stroke="#94a3b8"
            fill="#1e293b"
            fillOpacity="0.2"
          />
          <rect
            x={hyatt.schematicCylinderX}
            y={hyatt.schematicCylinderY}
            width={hyatt.schematicCylinderW}
            height={hyatt.schematicCylinderH}
            fill="#f59e0b"
            fillOpacity="0.3"
            stroke="#d97706"
          />
          <rect
            x={ram.x}
            y={ram.y}
            width={ram.w}
            height={ram.h}
            rx="2"
            fill="#64748b"
            stroke="#94a3b8"
          />
          <polygon
            points={`${hyatt.schematicNozzleX0},${hyatt.schematicNozzleY0} ${hyatt.schematicNozzleX1},${hyatt.schematicNozzleMidY0} ${hyatt.schematicNozzleX1},${hyatt.schematicNozzleMidY1} ${hyatt.schematicNozzleX0},${hyatt.schematicNozzleY1}`}
            fill="#38bdf8"
            stroke="#0284c7"
          />
          <rect
            x={mold.x}
            y={mold.y}
            width={mold.w}
            height={mold.h}
            rx="3"
            stroke="#4ade80"
            fill="#15803d"
            fillOpacity="0.2"
          />
          <text
            x={hyatt.schematicJacketLabelX}
            y={hyatt.schematicJacketLabelY}
            fill="#f59e0b"
            fontSize="8"
            textAnchor="middle"
          >
            Steam Heating Jacket (120°C)
          </text>
          <text
            x={hyatt.schematicRamLabelX}
            y={hyatt.schematicRamLabelY}
            fill="#94a3b8"
            fontSize="8"
            textAnchor="middle"
          >
            Hydraulic Ram
          </text>
          <text
            x={hyatt.schematicMoldLabelX}
            y={hyatt.schematicMoldLabelY}
            fill="#4ade80"
            fontSize="8"
            textAnchor="middle"
          >
            Split Mold
          </text>
        </g>
      );
    }
    case "gramme-dynamo": {
      const gramme = stepGrammeDynamo({ shaftRate: params?.shaftRate ?? params?.rotorRpm });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Continuous Ring Armature */}
          <circle
            cx={gramme.schematicCenterX}
            cy={gramme.schematicCenterY}
            r={gramme.schematicRingOuterR}
            stroke="#fbbf24"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx={gramme.schematicCenterX}
            cy={gramme.schematicCenterY}
            r={gramme.schematicRingInnerR}
            stroke="#38bdf8"
            strokeWidth="2"
            fill="#0f172a"
          />
          {/* Commutator segments */}
          {Array.from({ length: gramme.schematicJunctionCount }, (_, i) => {
            const rod = grammeSchematicJunction(
              i * gramme.schematicJunctionPitchDeg,
              gramme.schematicCenterX,
              gramme.schematicCenterY,
              gramme.schematicJunctionInnerR,
              gramme.schematicJunctionOuterR,
            );
            return (
              <line
                key={i}
                x1={rod.x1}
                y1={rod.y1}
                x2={rod.x2}
                y2={rod.y2}
                stroke="#fbbf24"
                strokeWidth="2"
              />
            );
          })}
          <path d={gramme.schematicNorthPoleD} stroke="#38bdf8" strokeWidth="6" fill="none" />
          <path d={gramme.schematicSouthPoleD} stroke="#ef4444" strokeWidth="6" fill="none" />
          <text
            x={gramme.schematicNorthLabelX}
            y={gramme.schematicPoleLabelY}
            fill="#38bdf8"
            fontSize="12"
            fontWeight="bold"
          >
            N
          </text>
          <text
            x={gramme.schematicSouthLabelX}
            y={gramme.schematicPoleLabelY}
            fill="#ef4444"
            fontSize="12"
            fontWeight="bold"
          >
            S
          </text>
          {Array.from({ length: gramme.schematicBrushCount }, (_, i) => {
            const brush = grammeSchematicBrush(
              i,
              gramme.schematicBrushX,
              gramme.schematicBrushY0,
              gramme.schematicBrushY1,
              gramme.schematicBrushW,
              gramme.schematicBrushH,
            );
            return (
              <rect
                key={i}
                x={brush.x}
                y={brush.y}
                width={brush.w}
                height={brush.h}
                fill="#4ade80"
              />
            );
          })}
          <text x="200" y="85" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Continuous Ring Armature
          </text>
          <text x="200" y="235" fill="#4ade80" fontSize="8" textAnchor="middle">
            Smooth DC Commutator Brushes
          </text>
        </g>
      );
    }
    case "pasteur-fermentation":
    case "pasteur-fermentation-fig-2": {
      if (/\b2\b/.test(figureNumber)) {
        return (
          <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
            <path d="M190 45 V78" stroke="#94a3b8" strokeWidth="3" />
            <path d="M168 92 H212 L198 111 H182Z" fill="#94a3b8" fillOpacity="0.28" />
            <path
              d="M120 116 Q190 94 260 116 V226 H120Z"
              fill="#b58a57"
              fillOpacity="0.22"
              stroke="#d6b98c"
              strokeWidth="2"
            />
            <path d="M111 128 H269 M111 226 H269" stroke="#cbd5e1" strokeWidth="7" />
            <text x="96" y="132" fill="#cbd5e1" fontSize="9">
              g
            </text>
            <text x="275" y="132" fill="#cbd5e1" fontSize="9">
              g′
            </text>
            <text x="96" y="232" fill="#cbd5e1" fontSize="9">
              g
            </text>
            <text x="275" y="232" fill="#cbd5e1" fontSize="9">
              g′
            </text>
            <text x="190" y="177" fill="#fde68a" fontSize="14" textAnchor="middle">
              B
            </text>
            <path d="M190 204 V224" stroke="#94a3b8" strokeWidth="4" />
            <circle cx="190" cy="207" r="7" fill="#64748b" fillOpacity="0.35" />
            <text x="204" y="211" fill="#cbd5e1" fontSize="9">
              R
            </text>
            <path d="M132 226 V270 M248 226 V270 M100 270 H286" stroke="#94a3b8" strokeWidth="5" />
            <path
              d="M190 96 V121 M174 118 L190 110 L206 118"
              stroke="#38bdf8"
              strokeDasharray="3 3"
            />
            <text x="190" y="30" fill="#cbd5e1" fontSize="10" textAnchor="middle">
              Fig. 2 · modified removable-top vessel
            </text>
          </g>
        );
      }
      const co2SweepOpacity = 0.12 + Math.min(100, Math.max(0, params?.co2SweepPct ?? 100)) / 130;
      const sprayOpacity = 0.12 + Math.min(100, Math.max(0, params?.sprayCoveragePct ?? 100)) / 130;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path d="M65 46 H340" stroke="#94a3b8" strokeWidth="5" />
          <text x="199" y="37" fill="#cbd5e1" fontSize="10" textAnchor="middle">
            water pipe E
          </text>
          <rect x="18" y="92" width="62" height="50" rx="5" fill="#64748b" fillOpacity="0.28" />
          <text x="49" y="112" fill="#cbd5e1" fontSize="9" textAnchor="middle">
            M M
          </text>
          <text x="49" y="128" fill="#cbd5e1" fontSize="7" textAnchor="middle">
            gas generator
          </text>
          <path d="M80 116 H105 V155" stroke="#60a5fa" strokeWidth="3" />
          <text x="89" y="108" fill="#60a5fa" fontSize="8">
            w
          </text>
          {[135, 225, 315].map((x) => (
            <g key={x}>
              <path
                d={`M${x - 34} 118 Q${x} 91 ${x + 34} 118 V225 H${x - 34}Z`}
                fill="#b58a57"
                fillOpacity="0.22"
                stroke="#d6b98c"
                strokeWidth="2"
              />
              <text x={x} y="176" fill="#fde68a" fontSize="12" textAnchor="middle">
                A
              </text>
              <path d={`M${x} 46 V90`} stroke="#94a3b8" strokeWidth="3" />
              <path d={`M${x - 12} 99 H${x + 12} L${x} 116Z`} fill="#94a3b8" />
              <text x={x + 17} y="103" fill="#cbd5e1" fontSize="8">
                P
              </text>
              {[0, 1, 2, 3, 4].map((drop) => (
                <circle
                  key={drop}
                  cx={x - 16 + drop * 8}
                  cy={127 + drop * 15}
                  r="2"
                  fill="#38bdf8"
                  fillOpacity={sprayOpacity}
                />
              ))}
              <path d={`M${x - 35} 234 Q${x} 244 ${x + 35} 234`} stroke="#94a3b8" />
              <text x={x + 29} y="246" fill="#cbd5e1" fontSize="8">
                g
              </text>
            </g>
          ))}
          {[114, 132, 150, 168].map((x) => (
            <circle key={x} cx={x} cy="196" r="2.5" fill="#60a5fa" fillOpacity={co2SweepOpacity} />
          ))}
          <path d="M101 180 H90 V232 H65" stroke="#60a5fa" strokeWidth="3" />
          <rect x="45" y="226" width="22" height="22" rx="3" fill="#38bdf8" fillOpacity="0.25" />
          <text x="74" y="224" fill="#60a5fa" fontSize="8">
            x
          </text>
          <text x="52" y="241" fill="#cbd5e1" fontSize="8">
            v
          </text>
          <text x="200" y="274" fill="#cbd5e1" fontSize="8" textAnchor="middle">
            Introduce boiling-hot wort → sweep air with CO₂ → spray-cool exterior → add yeast at
            20–22.5 °C
          </text>
        </g>
      );
    }
    case "glidden-barbed-wire": {
      const glidden = stepGliddenBarbedWire({
        wireTensionN: params?.wireTensionN,
        twistsPerFoot: params?.twistsPerFoot,
        animalPushForceN: params?.animalPushForceN,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Twin Twisted Line Wires */}
          <path d={glidden.schematicWireD0} stroke="#94a3b8" strokeWidth="3" />
          <path d={glidden.schematicWireD1} stroke="#64748b" strokeWidth="3" />
          {/* Coiled Wire Spurs Locked on One Strand */}
          {Array.from({ length: glidden.schematicSpurCount }, (_, i) => {
            const x = gliddenSchematicSpurX(
              i,
              glidden.schematicSpurOriginX,
              glidden.schematicSpurPitchX,
            );
            return (
              <g key={i}>
                <ellipse
                  cx={x}
                  cy={glidden.schematicSpurY}
                  rx={glidden.schematicSpurRx}
                  ry={glidden.schematicSpurRy}
                  stroke="#fbbf24"
                  strokeWidth="3"
                  fill="#78350f"
                  fillOpacity="0.4"
                />
                <line
                  x1={x - glidden.schematicBarbDx}
                  y1={glidden.schematicBarbY0}
                  x2={x + glidden.schematicBarbDx}
                  y2={glidden.schematicBarbY1}
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1={x + glidden.schematicBarbDx}
                  y1={glidden.schematicBarbY0}
                  x2={x - glidden.schematicBarbDx}
                  y2={glidden.schematicBarbY1}
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
          <text x="200" y="95" fill="#94a3b8" fontSize="8" textAnchor="middle">
            Dual Twisted Core Strands
          </text>
          <text x="200" y="195" fill="#ef4444" fontSize="8" textAnchor="middle">
            Locked Coiled Spurs (4-Point Barbs)
          </text>
        </g>
      );
    }
    case "otto-engine": {
      const otto = stepOttoEngine({
        engineRpm: params?.engineRpm,
        compressionRatio: params?.compressionRatio,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={otto.schematicCylinderX}
            y={otto.schematicCylinderY}
            width={otto.schematicCylinderW}
            height={otto.schematicCylinderH}
            rx="4"
            stroke="#94a3b8"
            fill="#1e293b"
            fillOpacity="0.2"
          />
          <rect
            x={otto.schematicValveX}
            y={otto.schematicValveY}
            width={otto.schematicValveW}
            height={otto.schematicValveH}
            fill="#f97316"
            stroke="#ea580c"
            rx="2"
          />
          <rect
            x={otto.schematicPistonX}
            y={otto.schematicPistonY}
            width={otto.schematicPistonW}
            height={otto.schematicPistonH}
            rx="3"
            fill="#38bdf8"
            fillOpacity="0.3"
            stroke="#38bdf8"
          />
          <line
            x1={otto.schematicRodX1}
            y1={otto.schematicRodY}
            x2={otto.schematicRodX2}
            y2={otto.schematicRodY}
            stroke="#e2e8f0"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Crank & Flywheel */}
          <circle
            cx={otto.schematicFlywheelCx}
            cy={otto.schematicFlywheelCy}
            r={otto.schematicFlywheelR}
            stroke="#fbbf24"
            strokeWidth="2.5"
          />
          <circle
            cx={otto.schematicFlywheelCx}
            cy={otto.schematicFlywheelCy}
            r={otto.schematicHubR}
            fill="#fbbf24"
          />
          <text x="65" y="80" fill="#f97316" fontSize="8" textAnchor="middle">
            Slide-Valve Igniter
          </text>
          <text x="155" y="135" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Trunk Piston
          </text>
          <text x="280" y="195" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Four-Stroke Flywheel
          </text>
        </g>
      );
    }
    case "edison-phonograph": {
      const phonograph = stepEdisonPhonograph({
        mandrelRpm: params?.mandrelRpm ?? params?.cylinderRpm,
        voiceVolumeDb: params?.voiceVolumeDb,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Threaded Mandrel & Cylinder */}
          <rect
            x={phonograph.schematicMandrelX}
            y={phonograph.schematicGrooveY0}
            width={phonograph.schematicMandrelW}
            height={phonograph.schematicMandrelH}
            rx="4"
            stroke="#fbbf24"
            fill="#78350f"
            fillOpacity="0.3"
            strokeWidth="2"
          />
          {Array.from({ length: phonograph.schematicGrooveCount }, (_, i) => {
            const x = edisonSchematicGrooveX(
              i,
              phonograph.schematicGrooveOriginX,
              phonograph.schematicGroovePitchX,
            );
            return (
              <line
                key={i}
                x1={x}
                y1={phonograph.schematicGrooveY0}
                x2={x}
                y2={phonograph.schematicGrooveY1}
                stroke="#fbbf24"
                strokeDasharray="2 2"
              />
            );
          })}
          <line
            x1={phonograph.schematicLeadX1}
            y1={phonograph.schematicLeadY}
            x2={phonograph.schematicLeadX2}
            y2={phonograph.schematicLeadY}
            stroke="#94a3b8"
            strokeWidth="4"
          />
          <circle
            cx={phonograph.schematicDiaphragmCx}
            cy={phonograph.schematicDiaphragmCy}
            r={phonograph.schematicDiaphragmR}
            stroke="#38bdf8"
            fill="#0369a1"
            fillOpacity="0.4"
          />
          <line
            x1={phonograph.schematicDiaphragmCx}
            y1={phonograph.schematicDiaphragmCy}
            x2={phonograph.schematicDiaphragmCx}
            y2={phonograph.schematicStylusY}
            stroke="#ef4444"
            strokeWidth="2.5"
          />
          <polygon
            points={phonograph.schematicHornPoints}
            stroke="#4ade80"
            fill="#15803d"
            fillOpacity="0.2"
          />
          <text x="190" y="22" fill="#4ade80" fontSize="8" textAnchor="middle">
            Acoustic Horn
          </text>
          <text x="190" y="70" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Diaphragm &amp; Hard Point
          </text>
          <text x="190" y="205" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Grooved Cylinder A (yielding material)
          </text>
        </g>
      );
    }
    case "pelton-water-wheel": {
      const flowVisible = (params?.sourceFlowVisible ?? 1) > 0;
      const claim1Active = (params?.claim1Active ?? 1) > 0;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <circle cx="245" cy="135" r="78" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="245" cy="135" r="13" stroke="#94a3b8" />
          <path
            d="M 224 48 Q 218 78 234 94 Q 245 78 245 58 Q 245 78 256 94 Q 272 78 266 48 Z"
            stroke="#fbbf24"
            fill="#d97706"
            opacity={claim1Active ? 1 : 0.18}
          />
          <line
            x1="245"
            y1="58"
            x2="245"
            y2="91"
            stroke="#f8fafc"
            opacity={claim1Active ? 1 : 0.18}
          />
          <text x="245" y="35" fill="#fbbf24" fontSize="8" textAnchor="middle">
            bucket B: apex d, bottoms c, sides e
          </text>
          <rect x="30" y="118" width="65" height="34" rx="4" stroke="#94a3b8" />
          <text x="62" y="110" fill="#93c5fd" fontSize="8" textAnchor="middle">
            distributing-box G
          </text>
          <polygon points="95,124 130,130 130,140 95,146" fill="#d97706" stroke="#fbbf24" />
          <text x="112" y="165" fill="#fbbf24" fontSize="8" textAnchor="middle">
            nozzle F
          </text>
          {flowVisible && (
            <>
              <line x1="130" y1="135" x2="245" y2="58" stroke="#38bdf8" strokeWidth="4" />
              <path d="M 245 58 Q 205 28 160 18" stroke="#38bdf8" strokeDasharray="4 2" />
              <path d="M 245 58 Q 285 28 330 18" stroke="#38bdf8" strokeDasharray="4 2" />
            </>
          )}
          <text x="245" y="245" fill="#4ade80" fontSize="8" textAnchor="middle">
            source arrangement only; no stated head, speed, angle, or efficiency
          </text>
        </g>
      );
    }
    case "fessenden-wireless": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Ground reference */}
          <line x1="20" y1="260" x2="380" y2="260" stroke="#475569" strokeWidth="2" />
          <line x1="50" y1="260" x2="40" y2="270" stroke="#334155" strokeWidth="1" />
          <line x1="80" y1="260" x2="70" y2="270" stroke="#334155" strokeWidth="1" />
          <line x1="320" y1="260" x2="310" y2="270" stroke="#334155" strokeWidth="1" />
          <line x1="350" y1="260" x2="340" y2="270" stroke="#334155" strokeWidth="1" />

          {/* High-Frequency Alternator (3) */}
          <circle
            cx="65"
            cy="220"
            r="22"
            stroke="#38bdf8"
            strokeWidth="2"
            fill="#1e293b"
            fillOpacity="0.6"
          />
          <path d="M 52 220 Q 58 208 65 220 T 78 220" stroke="#38bdf8" strokeWidth="2" />
          <text
            x="65"
            y="252"
            fill="#94a3b8"
            fontSize="8"
            textAnchor="middle"
            fontFamily="monospace"
          >
            3 (Dynamo)
          </text>

          {/* Series Tuning Loading Inductance (2) */}
          <path
            d="M 65 198 L 65 170 C 65 160 85 160 85 170 C 85 160 105 160 105 170 C 105 160 125 160 125 170 L 140 170 L 140 120"
            stroke="#10b981"
            strokeWidth="2"
          />
          <text
            x="95"
            y="152"
            fill="#10b981"
            fontSize="8"
            textAnchor="middle"
            fontFamily="monospace"
          >
            2 (Inductance)
          </text>

          {/* Cylindrical Cage Radiator (1) */}
          <rect
            x="125"
            y="40"
            width="30"
            height="80"
            rx="3"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            fill="#0f172a"
            fillOpacity="0.5"
          />
          <line x1="130" y1="40" x2="130" y2="120" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="140" y1="40" x2="140" y2="120" stroke="#38bdf8" strokeWidth="2" />
          <line x1="150" y1="40" x2="150" y2="120" stroke="#38bdf8" strokeWidth="1.5" />
          <text
            x="140"
            y="32"
            fill="#38bdf8"
            fontSize="9"
            textAnchor="middle"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            1 (Cage Aerial)
          </text>

          {/* Concentric Continuous Electromagnetic Wavefronts */}
          <path
            d="M 170 50 A 50 50 0 0 1 170 110"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.8"
          />
          <path
            d="M 195 40 A 80 80 0 0 1 195 120"
            stroke="#38bdf8"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M 220 30 A 110 110 0 0 1 220 130"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.4"
          />

          {/* Receiver Aerial (10) */}
          <line x1="270" y1="40" x2="270" y2="160" stroke="#64748b" strokeWidth="2" />
          <ellipse cx="270" cy="40" rx="14" ry="4" stroke="#38bdf8" strokeWidth="1.5" />
          <text
            x="270"
            y="30"
            fill="#94a3b8"
            fontSize="8"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10 (Aerial)
          </text>

          {/* Liquid Barretter / Electrolytic Detector (12) */}
          <rect
            x="290"
            y="170"
            width="24"
            height="30"
            rx="2"
            stroke="#38bdf8"
            strokeWidth="1.5"
            fill="#0284c7"
            fillOpacity="0.2"
          />
          <line x1="302" y1="160" x2="302" y2="185" stroke="#f1f5f9" strokeWidth="1" />
          <circle cx="302" cy="185" r="2" fill="#fbbf24" />
          <text
            x="302"
            y="212"
            fill="#38bdf8"
            fontSize="8"
            textAnchor="middle"
            fontFamily="monospace"
          >
            12 (Barretter)
          </text>

          {/* Telephone Earpiece Receiver (11/16) */}
          <circle cx="350" cy="200" r="14" stroke="#f59e0b" strokeWidth="2" fill="#1e293b" />
          <path d="M 368 190 A 15 15 0 0 1 368 210" stroke="#f59e0b" strokeWidth="1.5" />
          <path
            d="M 374 185 A 22 22 0 0 1 374 215"
            stroke="#f59e0b"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <text
            x="350"
            y="226"
            fill="#f59e0b"
            fontSize="8"
            textAnchor="middle"
            fontFamily="monospace"
          >
            16 (Telephone)
          </text>

          {/* Circuit connection loops */}
          <path d="M 270 160 L 290 185" stroke="#94a3b8" strokeWidth="1" />
          <path d="M 314 185 L 336 200" stroke="#94a3b8" strokeWidth="1" />
          <path d="M 350 214 L 350 260" stroke="#94a3b8" strokeWidth="1" />
        </g>
      );
    }

    case "us-971501-haber-ammonia":
    case "haber-ammonia": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Blueprint Grid / Baseline */}
          <line
            x1="20"
            y1="260"
            x2="380"
            y2="260"
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* 1. Feed Gas Compressor (Left) */}
          <rect
            x="30"
            y="130"
            width="55"
            height="80"
            rx="4"
            stroke="#64748b"
            strokeWidth="1.8"
            fill="#1e293b"
            fillOpacity="0.5"
          />
          <rect
            x="42"
            y="145"
            width="30"
            height="16"
            fill="#334155"
            stroke="#38bdf8"
            strokeWidth="1.2"
          />
          <circle cx="57" cy="185" r="12" stroke="#94a3b8" strokeWidth="1.2" />
          <text
            x="57"
            y="225"
            fill="#94a3b8"
            fontSize="8"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            1. Compressor
          </text>

          {/* 2. Counter-Current Heat Exchanger (Center-Left) */}
          <rect
            x="115"
            y="90"
            width="50"
            height="150"
            rx="6"
            stroke="#94a3b8"
            strokeWidth="1.8"
            fill="#0f172a"
            fillOpacity="0.6"
          />
          <line
            x1="140"
            y1="100"
            x2="140"
            y2="230"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <text
            x="140"
            y="80"
            fill="#f87171"
            fontSize="8"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            2. Heat Exchanger
          </text>

          {/* 3. High-Pressure Synthesis Reactor (Center-Right) */}
          <rect
            x="195"
            y="60"
            width="80"
            height="185"
            rx="12"
            stroke="#cbd5e1"
            strokeWidth="2.5"
            fill="#1e293b"
            fillOpacity="0.7"
          />
          {/* Top & Bottom Heavy Forged Flanges */}
          <rect
            x="190"
            y="65"
            width="90"
            height="10"
            rx="2"
            fill="#475569"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          <rect
            x="190"
            y="230"
            width="90"
            height="10"
            rx="2"
            fill="#475569"
            stroke="#94a3b8"
            strokeWidth="1"
          />

          {/* 4. Solid Osmium Catalyst Bed */}
          <rect
            x="207"
            y="95"
            width="56"
            height="115"
            rx="4"
            stroke="#fbbf24"
            strokeWidth="1.5"
            fill="#78350f"
            fillOpacity="0.6"
          />
          <text
            x="235"
            y="155"
            fill="#fef08a"
            fontSize="8"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            4. Catalyst Bed
          </text>
          <text
            x="235"
            y="50"
            fill="#cbd5e1"
            fontSize="8"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            3. Autoclave Reactor
          </text>

          {/* 5. Chiller Condenser & NH3 Separator (Right) */}
          <rect
            x="305"
            y="100"
            width="60"
            height="140"
            rx="8"
            stroke="#38bdf8"
            strokeWidth="1.8"
            fill="#0c4a6e"
            fillOpacity="0.5"
          />
          {/* Liquid Ammonia Pool */}
          <rect x="309" y="195" width="52" height="40" rx="4" fill="#06b6d4" fillOpacity="0.8" />
          <text
            x="335"
            y="90"
            fill="#38bdf8"
            fontSize="8"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            5. Condenser
          </text>
          <text
            x="335"
            y="218"
            fill="#e0f2fe"
            fontSize="7.5"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            6. Liquid NH₃
          </text>

          {/* High-Pressure Connecting Pipes */}
          {/* 1 -> 2 */}
          <path d="M 85 160 L 115 160" stroke="#38bdf8" strokeWidth="2" />
          {/* 2 -> 3 */}
          <path d="M 165 110 L 195 110" stroke="#f97316" strokeWidth="2" />
          {/* 3 -> 2 */}
          <path d="M 195 220 L 165 220" stroke="#ef4444" strokeWidth="2" />
          {/* 2 -> 5 */}
          <path d="M 140 240 L 140 250 L 335 250 L 335 240" stroke="#38bdf8" strokeWidth="2" />
          {/* 5 -> 1 Recycle Loop */}
          <path
            d="M 335 100 L 335 40 L 57 40 L 57 130"
            stroke="#10b981"
            strokeWidth="1.8"
            strokeDasharray="4 3"
          />
          <text
            x="195"
            y="34"
            fill="#34d399"
            fontSize="8"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            7. Gas Recirculation Loop (N₂ + 3H₂)
          </text>
        </g>
      );
    }

    case "polaroid-film-stack":
    case "polaroid-roller-spread": {
      return (
        <g stroke="#10b981" strokeWidth="1.5" fill="none">
          {/* Outer composite envelope */}
          <rect
            x="40"
            y="60"
            width="320"
            height="180"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="#0f172a"
          />

          {/* Negative Emulsion Sheet (Top) */}
          <rect
            x="60"
            y="80"
            width="280"
            height="32"
            stroke="#38bdf8"
            strokeWidth="2"
            fill="#1e293b"
          />
          <text
            x="200"
            y="100"
            fill="#38bdf8"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
          >
            10. PHOTOSENSITIVE NEGATIVE EMULSION (AgBr)
          </text>

          {/* Metered Viscous Gel Layer (Center) */}
          <rect
            x="70"
            y="120"
            width="260"
            height="16"
            stroke="#10b981"
            strokeWidth="1.5"
            fill="rgba(16, 185, 129, 0.15)"
          />
          <text
            x="200"
            y="131"
            fill="#34d399"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            40. VISCOUS REAGENT SPREAD (25 µm • pH 12.6)
          </text>

          {/* Positive Image-Receiving Sheet (Bottom) */}
          <rect
            x="60"
            y="144"
            width="280"
            height="32"
            stroke="#f59e0b"
            strokeWidth="2"
            fill="#1e293b"
          />
          <text
            x="200"
            y="164"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
          >
            20. IMAGE-RECEIVING POSITIVE SHEET (Ag₂S NUCLEI)
          </text>

          {/* Rupturable Reagent Pod (Left leading edge) */}
          <rect
            x="42"
            y="110"
            width="24"
            height="36"
            stroke="#f59e0b"
            strokeWidth="2"
            fill="#78350f"
          />
          <text
            x="54"
            y="132"
            fill="#fef08a"
            fontSize="7"
            fontFamily="monospace"
            textAnchor="middle"
          >
            30. POD
          </text>

          {/* Pressure Nip Rollers */}
          <circle cx="80" cy="52" r="16" stroke="#cbd5e1" strokeWidth="2" fill="#334155" />
          <circle cx="80" cy="208" r="16" stroke="#cbd5e1" strokeWidth="2" fill="#334155" />
          <text
            x="80"
            y="56"
            fill="#e2e8f0"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            50
          </text>
          <text
            x="80"
            y="212"
            fill="#e2e8f0"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            52
          </text>
        </g>
      );
    }

    case "kilby-ic-components":
    case "kilby-ic-transistor":
    case "kilby-ic-multivibrator": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Header Tab & Ground Substrate */}
          <rect
            x="30"
            y="160"
            width="340"
            height="24"
            stroke="#d4af37"
            strokeWidth="2"
            fill="#1e293b"
          />
          <text
            x="200"
            y="176"
            fill="#fbbf24"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            GOLD-PLATED KOVAR HEADER TAB
          </text>

          {/* Monolithic Germanium/Silicon Die */}
          <rect
            x="50"
            y="100"
            width="300"
            height="55"
            stroke="#0ea5e9"
            strokeWidth="2"
            fill="#0f172a"
          />
          <text
            x="200"
            y="125"
            fill="#38bdf8"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="middle"
          >
            SINGLE-CRYSTAL GERMANIUM WAFER (0.200" × 0.080")
          </text>

          {/* Mesa Transistor T1 */}
          <rect
            x="70"
            y="70"
            width="45"
            height="28"
            stroke="#34d399"
            strokeWidth="1.5"
            fill="#064e3b"
          />
          <circle cx="92" cy="78" r="4" fill="#fbbf24" stroke="#f59e0b" />
          <text
            x="92"
            y="64"
            fill="#34d399"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            T1 (Mesa)
          </text>

          {/* Resistor R1 */}
          <rect
            x="130"
            y="75"
            width="55"
            height="23"
            stroke="#818cf8"
            strokeWidth="1.5"
            fill="#1e1b4b"
          />
          <path d="M 135 86 L 145 86 L 155 86 L 165 86 L 175 86" stroke="#a5b4fc" strokeWidth="2" />
          <text
            x="157"
            y="68"
            fill="#818cf8"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            R1 (Bulk)
          </text>

          {/* P-N Capacitor C1 */}
          <rect
            x="205"
            y="72"
            width="40"
            height="26"
            stroke="#e879f9"
            strokeWidth="1.5"
            fill="#701a75"
          />
          <line
            x1="225"
            y1="72"
            x2="225"
            y2="98"
            stroke="#f5d0fe"
            strokeWidth="2"
            strokeDasharray="2 2"
          />
          <text
            x="225"
            y="64"
            fill="#e879f9"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            C1 (P-N)
          </text>

          {/* Mesa Transistor T2 */}
          <rect
            x="265"
            y="70"
            width="45"
            height="28"
            stroke="#34d399"
            strokeWidth="1.5"
            fill="#064e3b"
          />
          <circle cx="287" cy="78" r="4" fill="#fbbf24" stroke="#f59e0b" />
          <text
            x="287"
            y="64"
            fill="#34d399"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            T2 (Mesa)
          </text>

          {/* Gold Flying Wire Bonds */}
          <path d="M 92 78 Q 110 40 135 86" stroke="#fbbf24" strokeWidth="2" />
          <path d="M 175 86 Q 190 35 225 72" stroke="#fbbf24" strokeWidth="2" />
          <path d="M 225 72 Q 245 40 287 78" stroke="#fbbf24" strokeWidth="2" />

          {/* Terminal Contact Balls */}
          <circle cx="92" cy="78" r="2.5" fill="#f59e0b" />
          <circle cx="135" cy="86" r="2.5" fill="#f59e0b" />
          <circle cx="175" cy="86" r="2.5" fill="#f59e0b" />
          <circle cx="225" cy="72" r="2.5" fill="#f59e0b" />
          <circle cx="287" cy="78" r="2.5" fill="#f59e0b" />

          {/* Header Contact Pins */}
          <line x1="80" y1="184" x2="80" y2="225" stroke="#94a3b8" strokeWidth="3" />
          <line x1="160" y1="184" x2="160" y2="225" stroke="#94a3b8" strokeWidth="3" />
          <line x1="240" y1="184" x2="240" y2="225" stroke="#94a3b8" strokeWidth="3" />
          <line x1="320" y1="184" x2="320" y2="225" stroke="#94a3b8" strokeWidth="3" />
        </g>
      );
    }

    case "townes-laser-system":
    case "townes-laser-cavity":
    case "townes-laser-energy": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Base Rail */}
          <line x1="30" y1="230" x2="370" y2="230" stroke="#475569" strokeWidth="3" />

          {/* High Reflector Mirror 21 */}
          <rect
            x="50"
            y="80"
            width="12"
            height="120"
            stroke="#38bdf8"
            strokeWidth="2"
            fill="#e2e8f0"
          />
          <text
            x="56"
            y="70"
            fill="#94a3b8"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            21: R1
          </text>

          {/* Active Medium Discharge Tube 40 */}
          <rect
            x="75"
            y="105"
            width="170"
            height="70"
            stroke="#64748b"
            strokeWidth="1.5"
            fill="#0f172a"
            fillOpacity="0.8"
          />

          {/* Helical Pumping Flashlamp 41 */}
          <path
            d="M 85 105 Q 95 90 105 105 Q 115 120 125 105 Q 135 90 145 105 Q 155 120 165 105 Q 175 90 185 105 Q 195 120 205 105 Q 215 90 225 105 Q 235 120 240 105"
            stroke="#fbbf24"
            strokeWidth="3"
            fill="none"
          />
          <text
            x="160"
            y="95"
            fill="#facc15"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            41: PUMP FLASHLAMP
          </text>

          {/* Output Coupler Mirror 22 */}
          <rect
            x="255"
            y="80"
            width="12"
            height="120"
            stroke="#38bdf8"
            strokeWidth="2"
            fill="#94a3b8"
            fillOpacity="0.7"
          />
          <text
            x="261"
            y="70"
            fill="#94a3b8"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            22: R2
          </text>

          {/* Intra-Cavity Laser Wave & Extracted Beam 12 */}
          <line x1="62" y1="140" x2="255" y2="140" stroke="#38bdf8" strokeWidth="4" />
          <line x1="267" y1="140" x2="330" y2="140" stroke="#38bdf8" strokeWidth="5" />
          <text
            x="295"
            y="130"
            fill="#38bdf8"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            12: BEAM
          </text>

          {/* Receiver / Detector 13 */}
          <rect
            x="330"
            y="110"
            width="35"
            height="60"
            stroke="#a855f7"
            strokeWidth="2"
            fill="#1e1b4b"
          />
          <circle cx="330" cy="140" r="10" stroke="#d8b4fe" fill="#7e22ce" />
          <text
            x="347"
            y="100"
            fill="#c084fc"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            13: DETECTOR
          </text>

          {/* Open Side Boundaries Annotation */}
          <text
            x="160"
            y="195"
            fill="#64748b"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            20: OPEN SIDES (OFF-AXIS LOSS)
          </text>
        </g>
      );
    }

    case "carlson-electrophotography":
    case "carlson-electrophotography-charging":
    case "carlson-electrophotography-rotary": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Photoconductive Drum 25 */}
          <circle
            cx="180"
            cy="150"
            r="65"
            stroke="#818cf8"
            strokeWidth="3"
            fill="#1e293b"
            fillOpacity="0.6"
          />
          <circle cx="180" cy="150" r="50" stroke="#64748b" strokeWidth="1.5" fill="#0f172a" />
          <text
            x="180"
            y="154"
            fill="#c7d2fe"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
          >
            DRUM 25
          </text>

          {/* Corona Station 26 */}
          <circle cx="125" cy="95" r="7" stroke="#f59e0b" fill="#fbbf24" />
          <line x1="125" y1="95" x2="140" y2="110" stroke="#fde047" strokeDasharray="2 2" />
          <text x="100" y="82" fill="#facc15" fontSize="8" fontFamily="monospace">
            26: CORONA
          </text>

          {/* Optical Exposure Slit 27 */}
          <rect x="160" y="55" width="40" height="14" stroke="#38bdf8" fill="#0284c7" />
          <path
            d="M 165 69 L 175 85 L 185 85 L 195 69 Z"
            fill="#38bdf8"
            fillOpacity="0.3"
            stroke="none"
          />
          <text
            x="180"
            y="48"
            fill="#38bdf8"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            27: OPTICS
          </text>

          {/* Developer Chamber 28 */}
          <rect x="245" y="115" width="35" height="35" stroke="#6366f1" fill="#1e1b4b" />
          <circle cx="262" cy="132" r="8" stroke="#a855f7" />
          <text x="245" y="105" fill="#c084fc" fontSize="8" fontFamily="monospace">
            28: TONER
          </text>

          {/* Paper Web & Transfer Roll 29 */}
          <line x1="100" y1="215" x2="340" y2="215" stroke="#f8fafc" strokeWidth="2.5" />
          <circle cx="180" cy="230" r="14" stroke="#94a3b8" fill="#334155" />
          <text x="140" y="258" fill="#f1f5f9" fontSize="8" fontFamily="monospace">
            29: TRANSFER
          </text>

          {/* Thermal Fuser Rollers */}
          <circle cx="310" cy="202" r="12" stroke="#f87171" fill="#dc2626" />
          <circle cx="310" cy="228" r="12" stroke="#64748b" fill="#334155" />
          <text
            x="310"
            y="255"
            fill="#f87171"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            FUSER (185°C)
          </text>
        </g>
      );
    }

    case "baekeland-bakelite": {
      return (
        <g stroke="#d97706" strokeWidth="1.5" fill="none">
          {/* Autoclave Pressure Vessel Shell */}
          <rect
            x="50"
            y="60"
            width="300"
            height="160"
            rx="20"
            stroke="#94a3b8"
            strokeWidth="2"
            fill="#1e293b"
            fillOpacity="0.4"
          />
          {/* Steam Jacket */}
          <rect
            x="40"
            y="50"
            width="320"
            height="180"
            rx="26"
            stroke="#f97316"
            strokeWidth="1.5"
            strokeDasharray="6 3"
          />
          {/* Compression Mold Platen */}
          <rect
            x="120"
            y="100"
            width="160"
            height="80"
            rx="4"
            stroke="#e2e8f0"
            strokeWidth="2"
            fill="#451a03"
            fillOpacity="0.8"
          />
          <text
            x="200"
            y="145"
            fill="#fef08a"
            fontSize="10"
            fontFamily="sans-serif"
            textAnchor="middle"
            fontWeight="bold"
          >
            Bakelite Molding Cavity
          </text>
          {/* Hydraulic Ram */}
          <line x1="200" y1="20" x2="200" y2="100" stroke="#38bdf8" strokeWidth="6" />
          {/* Pressure Gauge */}
          <circle cx="200" cy="20" r="16" stroke="#38bdf8" strokeWidth="2" fill="#0f172a" />
          <text x="200" y="24" fill="#38bdf8" fontSize="8" textAnchor="middle">
            P &gt; 50 psi
          </text>
          {/* Labels */}
          <text x="200" y="250" fill="#f97316" fontSize="9" textAnchor="middle">
            Steam Jacket (110–140 °C)
          </text>
        </g>
      );
    }
    case "delaval-separator": {
      const delaval = stepDeLavalSeparator({
        bowlRpm: params?.bowlRpm ?? params?.rotorRpm,
        rawMilkFlowLph: params?.rawMilkFlowLph,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Conical Centrifuge Bowl */}
          <polygon
            points={delaval.schematicBowlPoints}
            stroke="#94a3b8"
            fill="#1e293b"
            fillOpacity="0.3"
            strokeWidth="2"
          />
          {/* Conical Disc Stack */}
          {Array.from({ length: delaval.schematicDiscCount }, (_, i) => {
            const y = delavalSchematicDiscY(
              i,
              delaval.schematicDiscOriginY,
              delaval.schematicDiscPitchY,
            );
            return (
              <polyline
                key={i}
                points={`${delaval.schematicDiscX0},${y} ${delaval.schematicDiscCx},${y - delaval.schematicDiscLift} ${delaval.schematicDiscX1},${y}`}
                stroke="#fbbf24"
                strokeWidth="1.5"
              />
            );
          })}
          {/* Flexible Spindle */}
          <line
            x1={delaval.schematicSpindleX}
            y1={delaval.schematicSpindleY0}
            x2={delaval.schematicSpindleX}
            y2={delaval.schematicSpindleY1}
            stroke="#4ade80"
            strokeWidth="3"
          />
          <line
            x1={delaval.schematicCreamX}
            y1={delaval.schematicCreamY0}
            x2={delaval.schematicCreamX}
            y2={delaval.schematicCreamY1}
            stroke="#fef08a"
            strokeWidth="2.5"
          />
          <line
            x1={delaval.schematicSkimX0}
            y1={delaval.schematicSkimY0}
            x2={delaval.schematicSkimX1}
            y2={delaval.schematicSkimY1}
            stroke="#38bdf8"
            strokeWidth="2.5"
          />
          <text x="200" y="40" fill="#fef08a" fontSize="8" textAnchor="middle">
            Cream (Light Core)
          </text>
          <text x="100" y="55" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Skim Milk (Heavy Wall)
          </text>
          <text x="200" y="265" fill="#4ade80" fontSize="8" textAnchor="middle">
            6,000 RPM Flexible Spindle
          </text>
        </g>
      );
    }
    case "thomson-welding": {
      const weld = stepThomsonWelding({
        weldCurrentAmps: params?.weldCurrentAmps ?? params?.currentAmperes,
        clampPressureMpa: params?.clampPressureMpa,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Single-Turn Secondary Bar */}
          <path d={weld.schematicBarD} stroke="#f59e0b" strokeWidth="8" fill="none" />
          <rect
            x={weld.schematicCoreX}
            y={weld.schematicCoreY}
            width={weld.schematicCoreW}
            height={weld.schematicCoreH}
            rx="4"
            stroke="#60a5fa"
            fill="#1e3a8a"
            fillOpacity="0.4"
          />
          {/* Water-Cooled Clamping Jaws */}
          {Array.from({ length: weld.schematicJawCount }, (_, i) => (
            <rect
              key={i}
              x={thomsonSchematicJawX(i, weld.schematicJawOriginX, weld.schematicJawPitchX)}
              y={weld.schematicJawY}
              width={weld.schematicJawW}
              height={weld.schematicJawH}
              rx="3"
              fill="#38bdf8"
              fillOpacity="0.3"
              stroke="#0284c7"
              strokeWidth="2"
            />
          ))}
          {/* Incandescent Weld Interface */}
          <line
            x1={weld.schematicWeldLineX}
            y1={weld.schematicWeldLineY0}
            x2={weld.schematicWeldLineX}
            y2={weld.schematicWeldLineY1}
            stroke="#ef4444"
            strokeWidth="4"
          />
          <circle
            cx={weld.schematicWeldCx}
            cy={weld.schematicWeldCy}
            r={weld.schematicWeldR}
            fill="#f97316"
          />
          {/* Upsetting Force Arrows */}
          <line
            x1={weld.schematicUpsetLeftX1}
            y1={weld.schematicUpsetY}
            x2={weld.schematicUpsetLeftX2}
            y2={weld.schematicUpsetY}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <line
            x1={weld.schematicUpsetRightX1}
            y1={weld.schematicUpsetY}
            x2={weld.schematicUpsetRightX2}
            y2={weld.schematicUpsetY}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <text x="200" y="55" fill="#ef4444" fontSize="8" textAnchor="middle">
            Plastic Fusion Interface (I²Rt)
          </text>
          <text x="200" y="145" fill="#f59e0b" fontSize="8" textAnchor="middle">
            Massive Secondary Transformer Bar
          </text>
        </g>
      );
    }
    case "parsons-turbine": {
      const routeIndex = Math.max(0, Math.min(2, Math.round(params?.routeTopology ?? 0)));
      const routing = ["series", "compound-parallel", "simple-parallel"][routeIndex] as
        | "series"
        | "compound-parallel"
        | "simple-parallel";
      const marine = stepParsonsMarine({
        routing,
        reversing: (params?.reversingTurbineEnabled ?? 0) >= 0.5,
      });
      const nodePositions: Record<string, [number, number]> = {
        boiler: [38, 145],
        A: [108, 90],
        "A′": [108, 200],
        B: [170, 90],
        "B′": [170, 200],
        C: [232, 90],
        "C′": [232, 200],
        D: [294, 90],
        "D′": [294, 200],
        X: [210, 55],
        Y: [270, 235],
        "condenser E": [360, 145],
        "condenser G": [360, 95],
        "condenser H": [360, 195],
      };
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text x="200" y="18" fill="#fbbf24" fontSize="10" textAnchor="middle">
            {marine.routeLabel}
          </text>
          {marine.routeEdges.map(([from, to]) => {
            const [x1, y1] = nodePositions[from] ?? [0, 0];
            const [x2, y2] = nodePositions[to] ?? [0, 0];
            return (
              <path
                key={`${from}-${to}`}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                markerEnd="url(#parsons-schematic-arrow)"
              />
            );
          })}
          {Object.entries(nodePositions).map(([name, [x, y]]) => (
            <g key={name}>
              <circle
                cx={x}
                cy={y}
                r={name === "boiler" || name.startsWith("condenser") ? 15 : 11}
                fill={name === "X" || name === "Y" ? "#581c87" : "#1e293b"}
                stroke={name === "boiler" ? "#fbbf24" : "#94a3b8"}
              />
              <text x={x} y={y + 3} fill="#f8fafc" fontSize="7" textAnchor="middle">
                {name}
              </text>
            </g>
          ))}
          <text
            x="200"
            y="292"
            fill={marine.directionLabel === "astern" ? "#e879f9" : "#4ade80"}
            fontSize="9"
            textAnchor="middle"
          >
            {marine.directionLabel.toUpperCase()} · valves select the topology
          </text>
        </g>
      );
    }
    case "devol-programmed-transfer": {
      const state = stepDevolProgrammedTransfer(params ?? {});
      const maximum = 2 ** state.bitWidth - 1;
      const matchColor = state.coincidence ? "#86efac" : "#fbbf24";
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <defs>
            <marker
              id="devol-schematic-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
            </marker>
          </defs>
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#c7d2fe"
            fontSize="9"
            fontFamily="monospace"
          >
            PROGRAM DRUM 40 · CLAIM 1 CODE COMPARISON
          </text>
          <rect x="36" y="65" width="92" height="74" rx="10" fill="#312e81" stroke="#818cf8" />
          <text x="82" y="90" textAnchor="middle" fill="#e0e7ff" fontSize="9">
            DRUM 40
          </text>
          <text
            x="82"
            y="116"
            textAnchor="middle"
            fill="#c7d2fe"
            fontSize="13"
            fontFamily="monospace"
          >
            {state.recordedCode.map((bit) => (bit ? "1" : "0")).join("")}
          </text>
          <path d="M 130 102 H 167" markerEnd="url(#devol-schematic-arrow)" />
          <rect x="170" y="62" width="76" height="80" rx="10" fill="#0c4a6e" stroke="#38bdf8" />
          <text x="208" y="87" textAnchor="middle" fill="#e0f2fe" fontSize="8">
            MATCH 100
          </text>
          <text
            x="208"
            y="113"
            textAnchor="middle"
            fill={matchColor}
            fontSize="14"
            fontFamily="monospace"
          >
            {state.matchingBits}/{state.bitWidth}
          </text>
          <path d="M 248 102 H 283" markerEnd="url(#devol-schematic-arrow)" />
          <rect x="286" y="59" width="72" height="94" rx="8" fill="#172554" stroke="#67e8f9" />
          <rect x="305" y="88" width="34" height="26" rx="4" fill="#0f172a" stroke="#fbbf24" />
          <path d="M 322 114 V 137 M 310 137 H 334" stroke="#fbbf24" strokeWidth="3" />
          <text x="322" y="48" textAnchor="middle" fill="#e0f2fe" fontSize="8">
            HEAD 10a / 44
          </text>
          <rect x="45" y="202" width="310" height="42" rx="6" fill="#0f172a" stroke="#475569" />
          <text x="60" y="221" fill="#bae6fd" fontSize="8">
            ENCODER 50
          </text>
          {state.sensedCode.map((bit, index) => {
            const x = 144 + index * 30;
            return (
              <g key={index}>
                <rect
                  x={x}
                  y="209"
                  width="20"
                  height="20"
                  rx="3"
                  fill={bit ? "#22d3ee" : "#1e293b"}
                  stroke={state.recordedCode[index] === bit ? "#86efac" : "#fb7185"}
                />
                <text
                  x={x + 10}
                  y="223"
                  textAnchor="middle"
                  fill={bit ? "#082f49" : "#94a3b8"}
                  fontSize="8"
                >
                  {bit ? "1" : "0"}
                </text>
              </g>
            );
          })}
          <text x="200" y="270" textAnchor="middle" fill="#fda4af" fontSize="8">
            {state.traversalMode.replaceAll("-", " ")} · code slots only; no source-backed geometry,
            rate, or load
          </text>
          <text x="200" y="287" textAnchor="middle" fill="#94a3b8" fontSize="7">
            sensed {state.sensedSlot}/{maximum} · {state.programPhase} · gripper{" "}
            {state.gripperState}
          </text>
        </g>
      );
    }
    case "makino-scara": {
      const pose = stepMakinoScaraTopology(params ?? {});
      const toSvg = ([x, y]: readonly [number, number]): readonly [number, number] => [
        200 + x * 92,
        155 - y * 92,
      ];
      const [firstBaseX, firstBaseY] = toSvg(pose.firstBase);
      const [fourthBaseX, fourthBaseY] = toSvg(pose.fourthBase);
      const [firstOuterX, firstOuterY] = toSvg(pose.firstOuterJoint);
      const [fourthOuterX, fourthOuterY] = toSvg(pose.fourthOuterJoint);
      const [toolX, toolY] = toSvg(pose.tool);
      const toolTipX = toolX + Math.cos(pose.toolAttitudeRad) * 33;
      const toolTipY = toolY - Math.sin(pose.toolAttitudeRad) * 33;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#bae6fd"
            fontSize="9"
            fontFamily="monospace"
          >
            CLAIM {pose.independentClaim} · {pose.topology.replace("claim-", "").replace("-", " ")}
          </text>
          <line
            x1="46"
            y1={firstBaseY}
            x2="354"
            y2={firstBaseY}
            stroke="#334155"
            strokeDasharray="4 4"
          />
          <rect
            x={Math.min(firstBaseX, fourthBaseX) - 26}
            y={firstBaseY - 10}
            width={Math.abs(fourthBaseX - firstBaseX) + 52}
            height="20"
            rx="3"
            fill="#172554"
            stroke="#60a5fa"
          />
          <line
            x1={firstBaseX}
            y1={firstBaseY}
            x2={firstOuterX}
            y2={firstOuterY}
            stroke="#67e8f9"
            strokeWidth="5"
          />
          <line
            x1={fourthBaseX}
            y1={fourthBaseY}
            x2={fourthOuterX}
            y2={fourthOuterY}
            stroke="#fbbf24"
            strokeWidth="5"
          />
          <line
            x1={firstOuterX}
            y1={firstOuterY}
            x2={toolX}
            y2={toolY}
            stroke="#bae6fd"
            strokeWidth="4"
          />
          <line
            x1={fourthOuterX}
            y1={fourthOuterY}
            x2={toolX}
            y2={toolY}
            stroke="#bae6fd"
            strokeWidth="4"
          />
          {pose.yLinkHub &&
            (() => {
              const [hubX, hubY] = toSvg(pose.yLinkHub);
              return (
                <g stroke="#d8b4fe" strokeWidth="2" strokeDasharray="5 3">
                  <line x1={firstBaseX} y1={firstBaseY} x2={hubX} y2={hubY} />
                  <line x1={fourthBaseX} y1={fourthBaseY} x2={hubX} y2={hubY} />
                  <line x1={hubX} y1={hubY} x2={toolX} y2={toolY} />
                  <circle cx={hubX} cy={hubY} r="6" fill="#581c87" />
                </g>
              );
            })()}
          {[
            { x: firstBaseX, y: firstBaseY, label: "1", color: "#67e8f9" },
            { x: fourthBaseX, y: fourthBaseY, label: "2", color: "#fbbf24" },
            { x: firstOuterX, y: firstOuterY, label: "4", color: "#67e8f9" },
            { x: fourthOuterX, y: fourthOuterY, label: "5", color: "#fbbf24" },
          ].map((node) => (
            <g key={node.label}>
              <circle
                cx={node.x}
                cy={node.y}
                r="8"
                fill="#0f172a"
                stroke={node.color}
                strokeWidth="2"
              />
              <text x={node.x} y={node.y + 3} textAnchor="middle" fill={node.color} fontSize="8">
                {node.label}
              </text>
            </g>
          ))}
          <rect
            x={toolX - 9}
            y={toolY - 9}
            width="18"
            height="18"
            rx="3"
            fill="#713f12"
            stroke="#fde68a"
            strokeWidth="2"
          />
          <line
            x1={toolX}
            y1={toolY}
            x2={toolTipX}
            y2={toolTipY}
            stroke="#fde68a"
            strokeWidth="2"
          />
          <text x={toolX + 12} y={toolY + 24} fill="#fef3c7" fontSize="8">
            9 tool
          </text>
          <text x="200" y="282" textAnchor="middle" fill="#fda4af" fontSize="8">
            normalized schematic; source gives no dimensional or load telemetry
          </text>
        </g>
      );
    }
    case "salisbury-robot-hand": {
      const state = FrankenSimEngine.stepSalisburyRobotHand(
        readSalisburyRobotHandControls(params ?? {}),
      );
      const sourceFigure = Number.parseInt(figureNumber.match(/\d+/)?.[0] ?? "1", 10);
      const cableColors = ["#38bdf8", "#34d399", "#fbbf24", "#fb7185"];

      if (sourceFigure === 4 || sourceFigure === 5) {
        const isCantilever = sourceFigure === 4;
        return (
          <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
            <text x="200" y="24" textAnchor="middle" fill="#bae6fd" fontSize="9">
              {isCantilever
                ? "FIG. 4 · CANTILEVER TENSION SENSOR"
                : "FIG. 5 · DEFLECTING-MEMBER SENSOR"}
            </text>
            <rect x="55" y="62" width="290" height="180" rx="10" fill="#0f172a" stroke="#475569" />
            <path d="M72 154 H142" stroke="#38bdf8" strokeWidth="4" />
            <path d="M258 154 H328" stroke="#38bdf8" strokeWidth="4" />
            {isCantilever ? (
              <g>
                <path d="M142 154 Q200 82 258 154" stroke="#67e8f9" strokeWidth="4" />
                <path d="M178 198 V116 H221" stroke="#94a3b8" strokeWidth="10" />
                <circle cx="221" cy="116" r="24" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
                <rect x="174" y="168" width="20" height="12" fill="#34d399" stroke="none" />
                <text x="204" y="220" fill="#cbd5e1" fontSize="8" textAnchor="middle">
                  pulley 59 · cantilever 58 · gauges 56
                </text>
              </g>
            ) : (
              <g>
                <rect
                  x="142"
                  y="98"
                  width="116"
                  height="112"
                  rx="8"
                  fill="#1e293b"
                  stroke="#94a3b8"
                />
                <path d="M142 154 H186 Q200 112 214 154 H258" stroke="#67e8f9" strokeWidth="4" />
                <line x1="200" y1="116" x2="200" y2="172" stroke="#fbbf24" strokeWidth="10" />
                <rect x="218" y="134" width="18" height="9" fill="#34d399" stroke="none" />
                <rect x="218" y="166" width="18" height="9" fill="#34d399" stroke="none" />
                <text x="200" y="226" fill="#cbd5e1" fontSize="8" textAnchor="middle">
                  member 64 · strut 54 · gauges 56
                </text>
              </g>
            )}
            <text x="200" y="266" fill="#fda4af" fontSize="8" textAnchor="middle">
              source supplies no calibration curve, range, accuracy, or bandwidth
            </text>
          </g>
        );
      }

      if (sourceFigure === 3 || sourceFigure === 6 || sourceFigure === 7) {
        const radiiMm = state.pulleyRadiiM.map((radius) => radius * 1000);
        return (
          <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
            <text x="200" y="22" textAnchor="middle" fill="#bae6fd" fontSize="9">
              FOUR CONNECTED CABLE ENDS · THREE JOINT AXES
            </text>
            {[0, 1, 2, 3].map((index) => (
              <g key={`salisbury-route-${index}`}>
                <path
                  d={`M28 ${72 + index * 34} C98 ${72 + index * 34}, 112 ${92 + index * 18}, 176 ${100 + index * 18} S276 ${90 + index * 24}, 344 ${112 + index * 18}`}
                  stroke={cableColors[index]}
                  strokeWidth={2 + Math.min(3, state.tendonTensionsN[index] / 16)}
                />
                <text x="14" y={76 + index * 34} fill={cableColors[index]} fontSize="8">
                  T{index + 1}
                </text>
              </g>
            ))}
            <g fill="#1e293b" stroke="#fbbf24" strokeWidth="2">
              {[76, 102, 128, 154].map((y) => (
                <circle key={y} cx="105" cy={y} r="13" />
              ))}
              <circle cx="210" cy="132" r="23" />
              <circle cx="318" cy="166" r="20" />
            </g>
            <g fill="#fde68a" stroke="none" fontSize="8" textAnchor="middle">
              <text x="105" y="210">
                Axis 1 · four contiguous sheaves
              </text>
              <text x="210" y="174">
                Axis 2
              </text>
              <text x="318" y="198">
                Axis 3
              </text>
              <text x="105" y="224">
                R₁/R₂
              </text>
              <text x="210" y="188">
                R₂/R₃
              </text>
              <text x="318" y="212">
                R₂
              </text>
            </g>
            <rect x="46" y="242" width="308" height="38" rx="6" fill="#0f172a" stroke="#475569" />
            <text x="200" y="257" textAnchor="middle" fill="#cbd5e1" fontSize="8">
              τ₁ {state.jointTorquesNm[0].toFixed(3)} · τ₂ {state.jointTorquesNm[1].toFixed(3)} · τ₃{" "}
              {state.jointTorquesNm[2].toFixed(3)} N·m
            </text>
            <text x="200" y="271" textAnchor="middle" fill="#94a3b8" fontSize="7">
              visitor scale R₁/R₂/R₃ = {radiiMm.map((radius) => radius.toFixed(1)).join("/")} mm ·
              no historic dimensions
            </text>
          </g>
        );
      }

      const [axis1Deg, axis2Deg, axis3Deg] = state.displayJointAnglesDeg;
      const renderDigit = (
        key: string,
        baseX: number,
        baseY: number,
        baseRotation: number,
        mirror: number,
      ) => (
        <g
          key={key}
          transform={`translate(${baseX} ${baseY}) rotate(${baseRotation + mirror * axis1Deg})`}
        >
          <circle cx="0" cy="0" r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-34"
            stroke="#94a3b8"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <g transform={`translate(0 -34) rotate(${-axis2Deg})`}>
            <circle cx="0" cy="0" r="7" fill="#0f172a" stroke="#34d399" strokeWidth="2" />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-42"
              stroke="#cbd5e1"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <g transform={`translate(0 -42) rotate(${-axis3Deg})`}>
              <circle cx="0" cy="0" r="6" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-36"
                stroke="#e2e8f0"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <circle cx="0" cy="-41" r="10" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
            </g>
          </g>
        </g>
      );

      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text x="200" y="20" textAnchor="middle" fill="#bae6fd" fontSize="9">
            FIG. 1/2 · CONNECTED ARM, WRIST, PALM, AND THREE DIGITS
          </text>
          <rect
            x="132"
            y="126"
            width="136"
            height="62"
            rx="12"
            fill="#1e293b"
            stroke="#64748b"
            strokeWidth="2"
          />
          <rect x="160" y="184" width="80" height="18" rx="5" fill="#334155" stroke="#94a3b8" />
          <line
            x1="154"
            y1="194"
            x2="246"
            y2="194"
            stroke="#fbbf24"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1="200"
            y1="190"
            x2="200"
            y2="220"
            stroke="#f59e0b"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect
            x="176"
            y="214"
            width="48"
            height="70"
            rx="6"
            fill="#1e293b"
            stroke="#64748b"
            strokeWidth="2"
          />
          <rect
            x="292"
            y="220"
            width="88"
            height="54"
            rx="7"
            fill="#0f172a"
            stroke="#64748b"
            strokeWidth="2"
          />
          <text x="336" y="242" textAnchor="middle" fill="#cbd5e1" fontSize="7">
            REMOTE DRIVE 35
          </text>
          <text x="200" y="240" textAnchor="middle" fill="#cbd5e1" fontSize="7">
            ARM 12
          </text>
          {cableColors.map((color, index) => (
            <path
              key={`salisbury-external-${color}`}
              d={`M292 ${238 + index * 8} C260 ${238 + index * 7}, 246 ${250 - index * 5}, ${224 - index * 6} ${232 - index * 9} S ${225 - index * 4} 188, ${238 - index * 8} 162`}
              stroke={color}
              strokeWidth="2"
            />
          ))}
          {renderDigit("left", 164, 132, -22, 1)}
          {renderDigit("right", 228, 132, 22, -1)}
          {renderDigit("thumb", 262, 168, 112, 1)}
          <text x="200" y="296" textAnchor="middle" fill="#fda4af" fontSize="7">
            normalized pose from printed torque signs · no historic dynamics/contact claim
          </text>
        </g>
      );
    }
    case "robot-end-effector": {
      const state = stepRobotEndEffector(params ?? {});
      const offset = state.perHandOffsetM * 900;
      const leftX = 200 - offset;
      const rightX = 200 + offset;
      const fingerVisible = state.fingerRetainedFraction > 0.03;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#bae6fd"
            fontSize="9"
            fontFamily="monospace"
          >
            CLAIM 1 · OPPOSED-THREAD SYMMETRIC HANDS
          </text>
          <rect x="45" y="102" width="310" height="112" rx="12" fill="#0f172a" stroke="#475569" />
          <rect x="45" y="153" width="310" height="12" rx="4" fill="#334155" stroke="#64748b" />
          <text x="200" y="148" textAnchor="middle" fill="#bae6fd" fontSize="8">
            WEB 28 · FIXED IDEAL MIDPOINT
          </text>
          <line x1="200" y1="67" x2="200" y2="255" stroke="#34d399" strokeDasharray="4 4" />
          {[128, 190].map((y, index) => (
            <g key={y}>
              <line x1="72" y1={y} x2="328" y2={y} stroke="#cbd5e1" strokeWidth="7" />
              {Array.from({ length: 12 }, (_, tooth) => (
                <line
                  key={tooth}
                  x1={92 + tooth * 18}
                  y1={y - 8}
                  x2={103 + tooth * 18}
                  y2={y + 8}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
              ))}
              {[leftX, rightX].map((x, hand) => (
                <g key={`${y}-${x}`} transform={`translate(${x} ${y})`}>
                  <rect
                    x="-14"
                    y="-18"
                    width="28"
                    height="36"
                    rx="4"
                    fill="#0e7490"
                    stroke="#67e8f9"
                  />
                  {fingerVisible && (
                    <path
                      d={
                        hand === 0
                          ? "M -16 -12 L -31 -24 L -31 24 L -16 12"
                          : "M 16 -12 L 31 -24 L 31 24 L 16 12"
                      }
                      stroke="#fbbf24"
                      strokeWidth="5"
                    />
                  )}
                </g>
              ))}
              <text x="54" y={y + 3} fill="#94a3b8" fontSize="7">
                {index === 0 ? "14/16" : "18/20"}
              </text>
            </g>
          ))}
          <line x1={leftX} y1="250" x2={rightX} y2="250" stroke="#fbbf24" />
          <text x="200" y="269" textAnchor="middle" fill="#fde68a" fontSize="9">
            g = {(state.jawOpeningM * 1000).toFixed(1)} mm · 5 mm/rev source lead
          </text>
          <circle cx="370" cy="158" r="22" fill="#92400e" stroke="#fbbf24" strokeWidth="2" />
          {Array.from({ length: 8 }, (_, peg) => {
            const angle = (peg * Math.PI * 2) / 8 + state.encoderCountModulo * (Math.PI / 4);
            return (
              <circle
                key={peg}
                cx={370 + Math.cos(angle) * 17}
                cy={158 + Math.sin(angle) * 17}
                r="2.5"
                fill="#67e8f9"
                stroke="none"
              />
            );
          })}
          <text x="370" y="193" textAnchor="middle" fill="#bae6fd" fontSize="7">
            72 / 74 · 8 count
          </text>
          <text x="200" y="292" textAnchor="middle" fill="#fda4af" fontSize="8">
            force is a source-labelled setpoint; no contact, pressure, payload, or arm model is
            inferred
          </text>
        </g>
      );
    }
    case "kamen-injection-device": {
      const pose = stepKamenInjectionMechanism(params ?? {});
      const plungerX = 132 + pose.plungerPosition * 142;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
          >
            MOTOR / LEAD-SCREW / PULSE-COUNTER TOPOLOGY
          </text>
          <rect x="42" y="112" width="316" height="92" rx="12" fill="#172554" stroke="#64748b" />
          <rect x="52" y="127" width="62" height="62" rx="9" fill="#0f172a" stroke="#22d3ee" />
          <text x="83" y="153" textAnchor="middle" fill="#a5f3fc" fontSize="8">
            MOTOR 24
          </text>
          <text x="83" y="169" textAnchor="middle" fill="#94a3b8" fontSize="7">
            {pose.motorState}
          </text>
          <line x1="114" y1="158" x2="332" y2="158" stroke="#e2e8f0" strokeWidth="8" />
          <line
            x1="114"
            y1="158"
            x2="332"
            y2="158"
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="7 5"
          />
          <text x="165" y="147" fill="#e2e8f0" fontSize="7">
            uniform-pitch lead screw 22
          </text>
          <rect
            x={plungerX - 8}
            y="122"
            width="16"
            height="72"
            rx="3"
            fill="#f59e0b"
            stroke="#fde68a"
          />
          <text x={plungerX} y="218" textAnchor="middle" fill="#fde68a" fontSize="7">
            follower / plunger
          </text>
          <circle cx="262" cy="158" r="11" fill="#0f172a" stroke="#c084fc" />
          <text x="262" y="161" textAnchor="middle" fill="#e9d5ff" fontSize="7">
            80
          </text>
          <rect x="280" y="141" width="34" height="34" rx="5" fill="#0f172a" stroke="#c084fc" />
          <text x="297" y="161" textAnchor="middle" fill="#e9d5ff" fontSize="7">
            84
          </text>
          <path d="M 270 150 L 280 146" stroke="#c084fc" strokeWidth="2" />
          <rect x="277" y="58" width="78" height="45" rx="7" fill="#0f172a" stroke="#a78bfa" />
          <text x="316" y="76" textAnchor="middle" fill="#e9d5ff" fontSize="7">
            COUNTERS
          </text>
          <text x="316" y="90" textAnchor="middle" fill="#c4b5fd" fontSize="7">
            114 / 116
          </text>
          <path d="M 297 141 V 104" stroke="#a78bfa" strokeDasharray="4 3" />
          {pose.reliefPathShown && (
            <path
              d="M 158 193 C 181 237, 243 237, 266 193"
              stroke="#fb7185"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
          )}
          <text x="200" y="254" textAnchor="middle" fill="#94a3b8" fontSize="8">
            selected screw pose {(pose.plungerPosition * 100).toFixed(0)}% · pulse progress{" "}
            {(pose.pulseProgress * 100).toFixed(0)}%
          </text>
          <text x="200" y="278" textAnchor="middle" fill="#fda4af" fontSize="8">
            nonclinical normalized mechanism; dose, flow, pressure, and outcome refused
          </text>
        </g>
      );
    }
    case "watson-remote-center-compliance": {
      const pose = stepWatsonRemoteCenterComplianceTopology(params ?? {});
      const toolX = 200 + pose.translationOffset * 58;
      const toolAngle = (pose.remainingAxisMismatch - 0.22) * 0.42;
      const toolEnd = {
        x: toolX + Math.sin(toolAngle) * 82,
        y: 173 + Math.cos(toolAngle) * 82,
      };
      const remoteCenter = pose.remoteCenterTopology ? toolEnd : { x: toolX, y: 118 };
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
          >
            RADIAL + AXIAL FLEXURE TOPOLOGY · NORMALIZED
          </text>
          <rect x="118" y="42" width="164" height="24" rx="5" fill="#172554" stroke="#38bdf8" />
          <text x="200" y="57" textAnchor="middle" fill="#bae6fd" fontSize="7">
            fixed machine portion 18
          </text>
          <rect
            x={toolX - 61}
            y="95"
            width="122"
            height="14"
            rx="4"
            fill="#1e293b"
            stroke="#e2e8f0"
          />
          <text x={toolX + 67} y="106" fill="#cbd5e1" fontSize="7">
            ring 22
          </text>
          <rect
            x={toolX - 55}
            y="159"
            width="110"
            height="14"
            rx="4"
            fill="#1e293b"
            stroke="#fbbf24"
          />
          <text x={toolX + 61} y="170" fill="#fde68a" fontSize="7">
            plate 20
          </text>
          {[-42, 0, 42].map((offset) => (
            <line
              key={`axial-${offset}`}
              x1={200 + offset}
              y1="66"
              x2={toolX + offset}
              y2="95"
              stroke="#22d3ee"
              strokeWidth="4"
            />
          ))}
          {[-42, 0, 42].map((offset) => (
            <g key={`radial-${offset}`}>
              <line
                x1={remoteCenter.x}
                y1={remoteCenter.y}
                x2={toolX + offset}
                y2="109"
                stroke="#67e8f9"
                strokeDasharray="4 4"
                opacity="0.62"
              />
              <line
                x1={toolX + offset}
                y1="109"
                x2={toolX + offset * 0.78}
                y2="159"
                stroke="#f59e0b"
                strokeWidth="4"
              />
            </g>
          ))}
          <text x="46" y="82" fill="#67e8f9" fontSize="7">
            translational flexures 56 / 58 / 60
          </text>
          <text x="43" y="145" fill="#fcd34d" fontSize="7">
            rotational flexures 24 / 26 / 28
          </text>
          <line
            x1={toolX}
            y1="173"
            x2={toolEnd.x}
            y2={toolEnd.y}
            stroke="#e2e8f0"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <line x1="310" y1="164" x2="310" y2="271" stroke="#94a3b8" strokeDasharray="5 4" />
          <path d="M 283 253 L 296 237 L 324 237 L 337 253" stroke="#7dd3fc" strokeWidth="3" />
          <circle
            cx={remoteCenter.x}
            cy={remoteCenter.y}
            r="6"
            fill={pose.remoteCenterTopology ? "#06b6d4" : "#64748b"}
            stroke="#ecfeff"
          />
          <text x={remoteCenter.x + 9} y={remoteCenter.y - 7} fill="#cffafe" fontSize="7">
            {pose.remoteCenterTopology ? "remote center 50" : "local contrast"}
          </text>
          {pose.antiTwistConstraint && (
            <ellipse cx={toolX} cy="158" rx="22" ry="6" stroke="#c084fc" strokeWidth="3" />
          )}
          <text x="200" y="278" textAnchor="middle" fill="#fda4af" fontSize="8">
            normalized geometry only; SI force, stiffness, clearance, and timing refused
          </text>
        </g>
      );
    }
    case "goertz-master-slave": {
      const pose = stepGoertzMasterSlaveTopology(params ?? {});
      const master = pose.masterChannels;
      const slave = pose.slaveChannels;
      const masterShoulder = { x: 82, y: 187 };
      const masterElbow = {
        x: masterShoulder.x + 47 + (master[0] ?? 0) * 23,
        y: masterShoulder.y - 25 - (master[2] ?? 0) * 20,
      };
      const masterTool = {
        x: masterElbow.x + 28 + (master[4] ?? 0) * 13,
        y: masterElbow.y + 34 + (master[5] ?? 0) * 12,
      };
      const slaveShoulder = { x: 318, y: 187 };
      const slaveElbow = {
        x: slaveShoulder.x - 47 - (slave[0] ?? 0) * 23,
        y: slaveShoulder.y - 25 - (slave[2] ?? 0) * 20,
      };
      const slaveTool = {
        x: slaveElbow.x - 28 - (slave[4] ?? 0) * 13,
        y: slaveElbow.y + 34 + (slave[5] ?? 0) * 12,
      };
      const contactVisible = pose.errorMagnitude > 0.01;
      return (
        <g stroke="#38bdf8" strokeWidth="1.45" fill="none">
          <defs>
            <marker
              id="goertz-schematic-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" stroke="none" />
            </marker>
          </defs>
          <text
            x="200"
            y="22"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
          >
            FIGS. 1 / 15 · MASTER–SLAVE ELECTRONIC CORRESPONDENCE
          </text>
          <line x1="200" y1="32" x2="200" y2="260" stroke="#64748b" strokeDasharray="5 4" />
          <text
            x="94"
            y="39"
            textAnchor="middle"
            fill="#67e8f9"
            fontSize="7"
            fontFamily="monospace"
          >
            MASTER / HANDLE
          </text>
          <text
            x="306"
            y="39"
            textAnchor="middle"
            fill="#c4b5fd"
            fontSize="7"
            fontFamily="monospace"
          >
            SLAVE / GRASPER
          </text>

          {Array.from({ length: 7 }, (_, index) => {
            const y = 54 + index * 13;
            const error = Math.abs(pose.positionErrors[index] ?? 0);
            return (
              <g key={index}>
                <text x="164" y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="6">
                  {index === 0
                    ? "113b"
                    : index === 1 || index === 3
                      ? "roll"
                      : index === 2
                        ? "126"
                        : index === 4
                          ? "171"
                          : index === 5
                            ? "172"
                            : "grip"}
                </text>
                <line x1="171" y1={y} x2="229" y2={y} stroke="#155e75" strokeWidth="3" />
                <line
                  x1="171"
                  y1={y}
                  x2={171 + (1 - error) * 58}
                  y2={y}
                  stroke="#22d3ee"
                  strokeWidth="2"
                />
                <circle cx="171" cy={y} r="2.4" fill="#67e8f9" />
                <circle cx="229" cy={y} r="2.4" fill="#c4b5fd" />
              </g>
            );
          })}
          <text x="200" y="154" textAnchor="middle" fill="#94a3b8" fontSize="6">
            seven duplicate electrical systems 54–60
          </text>

          <rect x="40" y="218" width="86" height="9" rx="2" fill="#0f172a" stroke="#64748b" />
          <rect x="274" y="218" width="86" height="9" rx="2" fill="#0f172a" stroke="#64748b" />
          <text x="83" y="238" textAnchor="middle" fill="#94a3b8" fontSize="6">
            support 50
          </text>
          <text x="317" y="238" textAnchor="middle" fill="#94a3b8" fontSize="6">
            sealed remote side
          </text>

          <line
            x1={masterShoulder.x}
            y1={masterShoulder.y}
            x2={masterElbow.x}
            y2={masterElbow.y}
            stroke="#22d3ee"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <line
            x1={masterElbow.x}
            y1={masterElbow.y}
            x2={masterTool.x}
            y2={masterTool.y}
            stroke="#0ea5e9"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1={masterTool.x}
            y1={masterTool.y}
            x2={masterTool.x + 12}
            y2={masterTool.y + 8}
            stroke="#fbbf24"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx={masterShoulder.x} cy={masterShoulder.y} r="6" fill="#082f49" />
          <circle cx={masterElbow.x} cy={masterElbow.y} r="5" fill="#082f49" />
          <text x="56" y="177" fill="#bae6fd" fontSize="6">
            arm 51
          </text>
          <text x={masterElbow.x + 6} y={masterElbow.y - 8} fill="#bae6fd" fontSize="6">
            arm 52
          </text>
          <text x={masterTool.x - 8} y={masterTool.y + 20} fill="#fde68a" fontSize="6">
            handle 53
          </text>

          <line
            x1={slaveShoulder.x}
            y1={slaveShoulder.y}
            x2={slaveElbow.x}
            y2={slaveElbow.y}
            stroke="#a78bfa"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <line
            x1={slaveElbow.x}
            y1={slaveElbow.y}
            x2={slaveTool.x}
            y2={slaveTool.y}
            stroke="#8b5cf6"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d={`M ${slaveTool.x - 4} ${slaveTool.y + 5 - (slave[6] ?? 0) * 4} L ${slaveTool.x - 18} ${slaveTool.y + 15} L ${slaveTool.x - 4} ${slaveTool.y + 23 + (slave[6] ?? 0) * 4}`}
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={slaveShoulder.x} cy={slaveShoulder.y} r="6" fill="#2e1065" />
          <circle cx={slaveElbow.x} cy={slaveElbow.y} r="5" fill="#2e1065" />
          <text x="325" y="177" fill="#ddd6fe" fontSize="6">
            arm 51
          </text>
          <text x={slaveElbow.x - 31} y={slaveElbow.y - 8} fill="#ddd6fe" fontSize="6">
            arm 52
          </text>
          <text x={slaveTool.x - 34} y={slaveTool.y + 30} fill="#fde68a" fontSize="6">
            grasper 53
          </text>

          <rect x="118" y="257" width="37" height="19" rx="2" fill="#0f172a" stroke="#67e8f9" />
          <text x="136.5" y="266" textAnchor="middle" fill="#bae6fd" fontSize="6">
            209
          </text>
          <text x="136.5" y="273" textAnchor="middle" fill="#94a3b8" fontSize="5">
            synchro
          </text>
          <path d="M 156 266 H 177" stroke="#fbbf24" markerEnd="url(#goertz-schematic-arrow)" />
          <text x="166" y="261" textAnchor="middle" fill="#fde68a" fontSize="6">
            E
          </text>
          <rect x="178" y="257" width="31" height="19" rx="2" fill="#0f172a" stroke="#fbbf24" />
          <text x="193.5" y="269" textAnchor="middle" fill="#fde68a" fontSize="6">
            210
          </text>
          <rect x="212" y="257" width="31" height="19" rx="2" fill="#0f172a" stroke="#38bdf8" />
          <text x="227.5" y="269" textAnchor="middle" fill="#bae6fd" fontSize="6">
            211
          </text>
          <path d="M 244 266 H 265" stroke="#fbbf24" markerEnd="url(#goertz-schematic-arrow)" />
          <rect x="266" y="257" width="35" height="19" rx="2" fill="#0f172a" stroke="#c4b5fd" />
          <text x="283.5" y="266" textAnchor="middle" fill="#ddd6fe" fontSize="6">
            204
          </text>
          <text x="283.5" y="273" textAnchor="middle" fill="#94a3b8" fontSize="5">
            motor
          </text>
          <text x="318" y="266" fill="#94a3b8" fontSize="6">
            205 tachometer
          </text>

          {contactVisible && (
            <g>
              <line
                x1={slaveTool.x - 18}
                y1={slaveTool.y + 14}
                x2={slaveTool.x - 39}
                y2={slaveTool.y + 14}
                stroke="#fb7185"
                strokeWidth="3"
              />
              <text
                x={slaveTool.x - 42}
                y={slaveTool.y + 9}
                textAnchor="end"
                fill="#fda4af"
                fontSize="6"
              >
                remote resistance
              </text>
            </g>
          )}
          {pose.forceReflectionEnabled && contactVisible && (
            <path
              d="M 280 245 C 250 225 151 225 120 245"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="4 3"
              markerEnd="url(#goertz-schematic-arrow)"
            />
          )}
          <text x="200" y="291" textAnchor="middle" fill="#fda4af" fontSize="7">
            Claim {pose.activeClaim} · {pose.state} · normalized topology; SI force and speed
            refused
          </text>
        </g>
      );
    }
    case "lemelson-warehousing": {
      const pose = stepLemelsonWarehouseTopology(params ?? {});
      const carX = 70 + pose.carrierX * 260;
      const liftY = 235 - pose.carrierY * 150;
      const forkEndX = carX + 18 + pose.shuttleZ * 32;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
          >
            SERIAL RAIL / LIFT / FORK · NORMALIZED SOURCE TOPOLOGY
          </text>
          <line x1="52" y1="45" x2="348" y2="45" stroke="#78716c" strokeWidth="3" />
          <text x="54" y="39" fill="#a8a29e" fontSize="7">
            OVERHEAD TRACK 21
          </text>
          {Array.from({ length: 7 }).map((_, column) => {
            const x = 70 + column * (260 / 6);
            return (
              <line
                key={`rack-post-${column}`}
                x1={x}
                y1="66"
                x2={x}
                y2="250"
                stroke="#334155"
                strokeWidth="1"
              />
            );
          })}
          {Array.from({ length: 5 }).map((_, row) => {
            const y = 250 - row * 46;
            return (
              <line
                key={`rack-shelf-${row}`}
                x1="60"
                y1={y}
                x2="340"
                y2={y}
                stroke="#334155"
                strokeWidth="1"
              />
            );
          })}
          <rect
            x={carX - 12}
            y="38"
            width="24"
            height="14"
            fill="#1e293b"
            stroke="#38bdf8"
            rx="2"
          />
          <text x={carX} y="48" fill="#38bdf8" fontSize="7" textAnchor="middle">
            22
          </text>
          <line
            x1={carX}
            y1="52"
            x2={carX}
            y2="250"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <rect
            x={carX - 10}
            y={liftY - 8}
            width="20"
            height="16"
            fill="#0f172a"
            stroke="#fbbf24"
            rx="2"
          />
          <line
            x1={carX + 10}
            y1={liftY}
            x2={forkEndX}
            y2={liftY}
            stroke="#fbbf24"
            strokeWidth="2.5"
          />
          <circle cx={carX - 14} cy={60} r="3" fill="#ef4444" stroke="#fca5a5" />
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
            <rect
              key={fraction}
              x={67 + fraction * 260}
              y="53"
              width="6"
              height="4"
              fill="#0ea5e9"
              stroke="#67e8f9"
            />
          ))}
          <text x={carX + 13} y={liftY - 10} fill="#fde68a" fontSize="7">
            second carriage 25 / fork 27
          </text>
          <rect x="245" y="68" width="112" height="58" rx="4" fill="#0f172a" stroke="#475569" />
          <text x="253" y="82" fill="#94a3b8" fontSize="7">
            rail address: {(pose.carrierX * 100).toFixed(0)}%
          </text>
          <text x="253" y="96" fill="#94a3b8" fontSize="7">
            lift address: {(pose.carrierY * 100).toFixed(0)}%
          </text>
          <text x="253" y="110" fill="#c4b5fd" fontSize="7">
            fork extension: {(pose.shuttleZ * 100).toFixed(0)}%
          </text>
          <text x="253" y="121" fill="#4ade80" fontSize="7">
            {pose.addressState}
          </text>
          <text x="200" y="278" textAnchor="middle" fill="#fda4af" fontSize="8">
            normalized topology only; no source dimensions, speed, payload, or throughput
          </text>
        </g>
      );
    }
    case "lemelson-automatic-production": {
      const state = stepLemelsonAutomaticProductionTopology(params ?? {});
      const carriageX = 62 + state.carrierAddressFraction * 270;
      const liftY = 128 + (1 - state.liftFraction) * 52;
      const reach = 20 + state.reachFraction * 42;
      const flowColor = state.controllerCoupled ? "#34d399" : "#fb7185";
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
          >
            CARRIER / MARKER / COUPLING · SOURCE-BOUNDED TOPOLOGY
          </text>
          <line x1="48" y1="52" x2="352" y2="52" stroke="#94a3b8" strokeWidth="4" />
          <text x="50" y="44" fill="#cbd5e1" fontSize="7">
            guideway 21
          </text>
          {[122, 200, 278].map((x, index) => (
            <g key={x}>
              <line x1={x} y1="57" x2={x} y2="222" stroke="#334155" strokeDasharray="3 3" />
              <circle
                cx={x}
                cy="66"
                r="4"
                fill={state.markerMatched && Math.abs(carriageX - x) < 48 ? "#fbbf24" : "#334155"}
              />
              <rect
                x={x - 24}
                y="202"
                width="48"
                height="37"
                rx="4"
                fill={
                  state.machineCommandAuthorized && Math.abs(carriageX - x) < 48
                    ? "#34d399"
                    : "#172554"
                }
                stroke={flowColor}
              />
              <text x={x} y="226" textAnchor="middle" fill="#bfdbfe" fontSize="7">
                MT {index + 1}
              </text>
            </g>
          ))}
          <g transform={`translate(${carriageX} 0)`}>
            <rect x="-15" y="38" width="30" height="20" rx="3" fill="#0f766e" />
            <text x="0" y="52" textAnchor="middle" fill="#ccfbf1" fontSize="7">
              22 / Mx
            </text>
            <line x1="0" y1="58" x2="0" y2={liftY} stroke="#0f766e" strokeWidth="8" />
            <rect x="-18" y={liftY - 7} width="36" height="14" rx="2" fill="#0e7490" />
            <line x1="18" y1={liftY} x2={18 + reach} y2={liftY} stroke="#7c3aed" strokeWidth="7" />
            <rect
              x={14 + reach}
              y={liftY - 12}
              width="12"
              height="24"
              rx="2"
              fill={state.carrierLocked ? "#f59e0b" : "#64748b"}
            />
            <rect x="-15" y="96" width="30" height="16" rx="2" fill="#1d4ed8" />
            <text x="0" y="107" textAnchor="middle" fill="#dbeafe" fontSize="7">
              47
            </text>
          </g>
          <path
            d={`M${carriageX + reach + 24} ${liftY} V196`}
            stroke={flowColor}
            strokeWidth="3"
            strokeDasharray={state.controllerCoupled ? undefined : "4 3"}
          />
          <text x="50" y="267" fill="#a7f3d0" fontSize="7">
            marker → retain → position → couple → operate → release → travel
          </text>
          <text x="200" y="284" textAnchor="middle" fill="#fda4af" fontSize="7">
            {state.phase}; normalized display only — no dimensions, speed, payload, force, or time
          </text>
        </g>
      );
    }
    case "lemelson-adjustable-manipulator":
    case "lemelson-adjustable-manipulator-side":
    case "lemelson-adjustable-manipulator-control": {
      const state = stepLemelsonManipulatorTopology(params ?? {});
      const carriageX = 200 + state.controls.carriagePosition * 80;
      const mastY = 80 + state.controls.columnElevation * 60;
      const armAngleRad = state.displayPose.pivotRad;
      const wristX =
        carriageX + Math.cos(state.displayPose.azimuthRad) * 45 * Math.cos(armAngleRad);
      const wristY = mastY + Math.sin(armAngleRad) * 25 + 15;
      const jawGap = 4 + state.displayPose.jawOpeningFraction * 8;

      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
          >
            US 3,260,375 · RECONFIGURABLE GANTRY & LIMIT-STOP TOPOLOGY
          </text>
          {/* Overhead Track */}
          <line x1="60" y1="50" x2="340" y2="50" stroke="#94a3b8" strokeWidth="3" />
          <line x1="60" y1="42" x2="340" y2="42" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="65" y="38" fill="#f59e0b" fontSize="6">
            bus 28
          </text>

          {/* Carriage 22 & Motor Mx */}
          <rect
            x={carriageX - 20}
            y="44"
            width="40"
            height="18"
            rx="2"
            fill="#1e293b"
            stroke="#38bdf8"
          />
          <text x={carriageX - 6} y="56" fill="#38bdf8" fontSize="7" fontWeight="bold">
            Mx
          </text>

          {/* Vertical Column 23 & Telescoping Mast 23' */}
          <line x1={carriageX} y1="62" x2={carriageX} y2={mastY} stroke="#64748b" strokeWidth="6" />
          <line x1={carriageX} y1="62" x2={carriageX} y2={mastY} stroke="#38bdf8" strokeWidth="2" />
          {/* Stop block 59' */}
          <rect
            x={carriageX + 4}
            y={70 + state.controls.stop2Elevation * 40}
            width="6"
            height="8"
            rx="1"
            fill="#ef4444"
          />

          {/* Turntable Base 43 & Articulated Arm 35 */}
          <ellipse
            cx={carriageX}
            cy={mastY}
            rx="16"
            ry="5"
            fill="#0f172a"
            stroke="#f59e0b"
            strokeWidth="1"
          />
          <line
            x1={carriageX}
            y1={mastY}
            x2={wristX}
            y2={wristY}
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Gripper Jaws 87a / 87b */}
          <circle cx={wristX} cy={wristY} r="3" fill="#0284c7" />
          <line
            x1={wristX}
            y1={wristY - 2}
            x2={wristX + 12}
            y2={wristY - jawGap}
            stroke="#f43f5e"
            strokeWidth="1.5"
          />
          <line
            x1={wristX}
            y1={wristY + 2}
            x2={wristX + 12}
            y2={wristY + jawGap}
            stroke="#f43f5e"
            strokeWidth="1.5"
          />

          {/* Relay State Display */}
          <text x="60" y="240" fill="#a7f3d0" fontSize="7" fontFamily="monospace">
            Phase: {state.sequencer.phaseName} | Active Motor:{" "}
            {state.sequencer.activeMotor.toUpperCase()}
          </text>
          <text x="60" y="252" fill="#38bdf8" fontSize="7">
            Limit Switches:{" "}
            {state.sequencer.trippedLimitSwitches.length > 0
              ? state.sequencer.trippedLimitSwitches.join(", ")
              : "Scanning"}
          </text>
          <text x="200" y="278" textAnchor="middle" fill="#fda4af" fontSize="7">
            normalized topology only; no source dimensions, speed, motor power, or jaw force
          </text>
        </g>
      );
    }
    case "stackhouse-manipulator": {
      const pose = stepStackhouseSourceTopology(params ?? {});
      const pointP = { x: 180, y: 150 };
      const intermediateEnd = {
        x: pointP.x + Math.cos(pose.alphaABRad) * 88,
        y: pointP.y - Math.sin(pose.alphaABRad) * 88,
      };
      const terminalBaseX = pointP.x + pose.terminalAxisOffset * 70;
      const projectedMagnitude = Math.hypot(pose.toolDirection[0], pose.toolDirection[2]) || 1;
      const toolEndX = terminalBaseX + (pose.toolDirection[2] / projectedMagnitude) * 88;
      const toolEndY = pointP.y - (pose.toolDirection[0] / projectedMagnitude) * 88;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
          >
            THREE SERIAL ROTARY SHAFTS · SOURCE-BOUNDED TOPOLOGY
          </text>
          <rect x="42" y="126" width="138" height="48" rx="7" fill="#1e293b" stroke="#64748b" />
          {[0, 1, 2].map((index) => (
            <line
              key={index}
              x1="52"
              y1={141 + index * 9}
              x2={pointP.x}
              y2={141 + index * 9}
              stroke={["#0369a1", "#0ea5e9", "#7dd3fc"][index]}
              strokeWidth={5 - index}
            />
          ))}
          <text x="48" y="119" fill="#94a3b8" fontSize="7">
            forearm section 6 · concentric shafts 15 / 16 / 19
          </text>
          <line
            x1={pointP.x}
            y1={pointP.y}
            x2={intermediateEnd.x}
            y2={intermediateEnd.y}
            stroke="#2563eb"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <line
            x1={pointP.x}
            y1={pointP.y}
            x2={intermediateEnd.x}
            y2={intermediateEnd.y}
            stroke="#60a5fa"
            strokeWidth="3"
            strokeDasharray="4 2"
          />
          <text x="193" y="87" fill="#60a5fa" fontSize="7">
            housing shaft 14a / shaft 23
          </text>
          {pose.terminalAxisOffset > 0 && (
            <line
              x1={pointP.x}
              y1={pointP.y}
              x2={terminalBaseX}
              y2={pointP.y}
              stroke="#fb923c"
              strokeWidth="8"
            />
          )}
          <line
            x1={terminalBaseX}
            y1={pointP.y}
            x2={toolEndX}
            y2={toolEndY}
            stroke="#a855f7"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <circle cx={toolEndX} cy={toolEndY} r="8" fill="#ec4899" stroke="#be185d" />
          <text x={toolEndX + 9} y={toolEndY - 8} fill="#c084fc" fontSize="7">
            shaft 26 / mounting surface 14c
          </text>
          <circle
            cx={pointP.x}
            cy={pointP.y}
            r="5"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <text x="168" y="169" fill="#ef4444" fontSize="7" fontWeight="bold">
            point P
          </text>
          <text x="248" y="208" fill="#fbbf24" fontSize="7">
            selected obliquities {pose.firstObliqueAngleDeg.toFixed(0)}° /{" "}
            {pose.secondObliqueAngleDeg.toFixed(0)}°; source states only &gt;45°
          </text>
          <text x="200" y="278" textAnchor="middle" fill="#fda4af" fontSize="8">
            normalized pose; SI dynamics and performance refused
          </text>
        </g>
      );
    }
    case "mestral-velcro": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
          >
            VELVET WEAVE & THERMAL HOOK FORMATION (FIG. 1 / FIG. 2)
          </text>
          {/* Foundation Weave Line */}
          <line
            x1="60"
            y1="240"
            x2="340"
            y2="240"
            stroke="#64748b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Weft Picks 1 */}
          {[80, 120, 160, 200, 240, 280, 320].map((wx) => (
            <circle
              key={`mv-weft-${wx}`}
              cx={wx}
              cy="240"
              r="5"
              fill="#475569"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
          ))}
          {/* Lancet Bar 5 */}
          <rect
            x="250"
            y="110"
            width="28"
            height="125"
            rx="4"
            fill="#991b1b"
            stroke="#ef4444"
            strokeWidth="1.5"
          />
          <line x1="268" y1="120" x2="268" y2="225" stroke="#1e293b" strokeWidth="3" />
          <text x="264" y="170" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">
            5
          </text>
          {/* Knife 8 */}
          <polygon
            points="280,95 295,65 305,70 290,100"
            fill="#e2e8f0"
            stroke="#38bdf8"
            strokeWidth="1"
          />
          <text x="310" y="80" fill="#f87171" fontSize="8" fontWeight="bold">
            8
          </text>
          {/* Loop over bar */}
          <path
            d="M 238,240 L 238,125 Q 264,75 290,125 L 290,240"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Cut Hooks 9 and Strands 10 */}
          <line
            x1="110"
            y1="240"
            x2="110"
            y2="170"
            stroke="#78716c"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 95,240 L 95,145 Q 95,115 75,130"
            stroke="#fbbf24"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <text x="70" y="120" fill="#fbbf24" fontSize="8" fontWeight="bold">
            4
          </text>
          <line
            x1="190"
            y1="240"
            x2="190"
            y2="170"
            stroke="#78716c"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 175,240 L 175,145 Q 175,115 155,130"
            stroke="#fbbf24"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <text x="150" y="120" fill="#fbbf24" fontSize="8" fontWeight="bold">
            4
          </text>
        </g>
      );
    }
    case "milacron-robot-toolchanger": {
      const state = stepMilacronRobotToolchanger(params ?? {});
      const slideOffset = state.lockingSlideFraction * 30;
      const toolBaseX = state.toolBasePresent ? 250 : 318;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
          >
            ROBOT TOOLCHANGER ADAPTER & WEDGING CLAMP (FIGS. 2, 3, 6)
          </text>
          {/* Rear Plate 27 & Front Plate 26 */}
          <rect
            x="70"
            y="60"
            width="18"
            height="180"
            rx="3"
            fill="#1e293b"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <text
            x="79"
            y="52"
            fill="#94a3b8"
            fontSize="7"
            textAnchor="middle"
            fontFamily="monospace"
          >
            27
          </text>
          <rect
            x="220"
            y="60"
            width="18"
            height="180"
            rx="3"
            fill="#1e293b"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <text
            x="229"
            y="52"
            fill="#94a3b8"
            fontSize="7"
            textAnchor="middle"
            fontFamily="monospace"
          >
            26
          </text>
          {/* Spacer Blocks 28, 29 */}
          <rect
            x="88"
            y="60"
            width="132"
            height="22"
            fill="#334155"
            stroke="#475569"
            strokeWidth="1"
          />
          <rect
            x="88"
            y="218"
            width="132"
            height="22"
            fill="#334155"
            stroke="#475569"
            strokeWidth="1"
          />
          {/* Pneumatic Cylinder 47 */}
          <rect
            x="98"
            y="125"
            width="65"
            height="50"
            rx="3"
            fill="#0284c7"
            stroke="#38bdf8"
            strokeWidth="1.2"
            opacity="0.6"
          />
          <text
            x="130"
            y="154"
            fill="#e0f2fe"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            47
          </text>
          {/* Piston Rod 46 & Yoke 45 */}
          <rect
            x="163"
            y="145"
            width="22"
            height="10"
            fill="#cbd5e1"
            stroke="#64748b"
            strokeWidth="1"
          />
          <rect
            x="185"
            y="135"
            width="14"
            height="30"
            rx="2"
            fill="#64748b"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          {/* Locking Slide 33 & Wedging Ramps 41 */}
          <rect
            x={222 + slideOffset}
            y="100"
            width="14"
            height="100"
            rx="2"
            fill={state.lockingSlideEngaged ? "#d97706" : "#0e7490"}
            stroke="#fbbf24"
            strokeWidth="1.2"
          />
          <text
            x={229 + slideOffset}
            y="120"
            fill="#fef3c7"
            fontSize="7"
            fontFamily="monospace"
            textAnchor="middle"
          >
            33
          </text>
          {/* Tool Base Plate 18 */}
          <rect
            x={toolBaseX}
            y="60"
            width="18"
            height="180"
            rx="3"
            fill="#334155"
            stroke="#94a3b8"
            strokeWidth="1.5"
            opacity={state.toolBasePresent ? 1 : 0.3}
          />
          <text
            x={toolBaseX + 9}
            y="52"
            fill="#38bdf8"
            fontSize="7"
            textAnchor="middle"
            fontFamily="monospace"
          >
            18
          </text>
          {/* T-Member 35 */}
          <polygon
            points={`215,140 220,135 ${toolBaseX},140 ${toolBaseX},160 220,165 215,160`}
            fill={state.claimFourRampCaptured ? "#f43f5e" : "#e2e8f0"}
            stroke="#f59e0b"
            strokeWidth="1.2"
            opacity={state.toolBasePresent ? 1 : 0.3}
          />
          <text
            x={toolBaseX - 12}
            y="153"
            fill="#1e293b"
            fontSize="7"
            fontFamily="monospace"
            fontWeight="bold"
          >
            35
          </text>
          {/* Cylindrical Pin 43 & Diamond Pin 44 */}
          <circle cx="229" cy="80" r="5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.2" />
          <text x="210" y="83" fill="#38bdf8" fontSize="7" fontFamily="monospace">
            43
          </text>
          <polygon
            points="229,210 234,215 229,220 224,215"
            fill="#f59e0b"
            stroke="#b45309"
            strokeWidth="1.2"
          />
          <text x="210" y="218" fill="#fbbf24" fontSize="7" fontFamily="monospace">
            44
          </text>
          {/* Proximity Switch 58 */}
          <rect
            x="205"
            y="95"
            width="15"
            height="8"
            rx="1"
            fill="#0284c7"
            stroke="#38bdf8"
            strokeWidth="1"
          />
          <circle cx="220" cy="99" r="2" fill="#10b981" />
          <text x="185" y="92" fill="#7dd3fc" fontSize="6" fontFamily="monospace">
            58
          </text>
          {/* Tool Head 19 */}
          <rect
            x="268"
            y="90"
            width="80"
            height="120"
            rx="4"
            fill="#1c1917"
            stroke="#78716c"
            strokeWidth="1.2"
          />
          <text
            x="308"
            y="155"
            fill="#fcd34d"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {state.toolRetained ? "CAPTURED TOOL 19" : "TOOL 19"}
          </text>
        </g>
      );
    }
    case "amf-versatran": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
          >
            AMF VERSATRAN MECHANISM & CONTROL TOPOLOGY (FIGS. 1, 37, 42, 46, 49)
          </text>
          {/* Base Bed Plate 70 & Housing 72 */}
          <rect
            x="80"
            y="240"
            width="240"
            height="20"
            rx="3"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
          />
          <rect
            x="120"
            y="215"
            width="160"
            height="25"
            rx="2"
            fill="#334155"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <text x="140" y="232" fill="#94a3b8" fontSize="8" fontFamily="monospace">
            HOUSING 72 / SPROCKET 80
          </text>
          {/* Vertical Column B */}
          <rect
            x="175"
            y="70"
            width="50"
            height="145"
            rx="3"
            fill="#1e293b"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <text x="185" y="85" fill="#38bdf8" fontSize="8" fontFamily="monospace">
            COL B
          </text>
          {/* Elevation Carriage C & Stroke Doubler 150/154 */}
          <rect
            x="160"
            y="125"
            width="80"
            height="35"
            rx="3"
            fill="#334155"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <circle cx="200" cy="142" r="8" fill="#d97706" stroke="#fef3c7" strokeWidth="1.5" />
          <text x="165" y="118" fill="#f59e0b" fontSize="8" fontFamily="monospace">
            CARRIAGE C (2:1)
          </text>
          {/* Horizontal Arm A and source rack 234 */}
          <rect
            x="210"
            y="132"
            width="130"
            height="20"
            rx="2"
            fill="#475569"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <line
            x1="210"
            y1="150"
            x2="335"
            y2="150"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          <text x="240" y="145" fill="#cbd5e1" fontSize="8" fontFamily="monospace">
            ARM A / RACK 234
          </text>
          {/* Wrist G & Gripper Fingers 324/326 */}
          <circle cx="345" cy="142" r="9" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <path
            d="M 354 135 L 375 132 L 375 137 Z"
            fill="#e2e8f0"
            stroke="#0f172a"
            strokeWidth="1"
          />
          <path
            d="M 354 149 L 375 152 L 375 147 Z"
            fill="#e2e8f0"
            stroke="#0f172a"
            strokeWidth="1"
          />
          <text x="345" y="125" fill="#a855f7" fontSize="8" fontFamily="monospace">
            WRIST G
          </text>
          {/* Separate programming arm H */}
          <line x1="270" y1="132" x2="250" y2="105" stroke="#d97706" strokeWidth="2" />
          <circle cx="250" cy="105" r="4" fill="#b45309" stroke="#fef3c7" />
          <text x="235" y="100" fill="#d97706" fontSize="7" fontFamily="monospace">
            PROGRAMMING ARM H
          </text>
        </g>
      );
    }
    case "kamen-segway": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
          >
            SEGWAY DYNAMIC BALANCING & HEADROOM CONTROL (FIGS. 1–4)
          </text>
          {/* Ground Contact Line */}
          <line
            x1="40"
            y1="260"
            x2="360"
            y2="260"
            stroke="#475569"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          {/* Left & Right Coaxial Wheels 20 */}
          <circle cx="200" cy="225" r="35" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="200" cy="225" r="14" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" />
          <circle cx="200" cy="225" r="4" fill="#fbbf24" />
          <text x="160" y="235" fill="#7dd3fc" fontSize="8" fontFamily="monospace">
            20
          </text>
          {/* Foot Platform / Chassis 12 */}
          <rect
            x="150"
            y="185"
            width="100"
            height="12"
            rx="3"
            fill="#334155"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <text x="260" y="194" fill="#cbd5e1" fontSize="8" fontFamily="monospace">
            12
          </text>
          {/* Vertical Handlebar Mast 16 */}
          <line x1="195" y1="185" x2="185" y2="70" stroke="#94a3b8" strokeWidth="2.5" />
          <rect
            x="170"
            y="65"
            width="30"
            height="6"
            rx="2"
            fill="#d97706"
            stroke="#fbbf24"
            strokeWidth="1.2"
          />
          <text x="155" y="72" fill="#fbbf24" fontSize="8" fontFamily="monospace">
            14
          </text>
          <text x="170" y="125" fill="#94a3b8" fontSize="8" fontFamily="monospace">
            16
          </text>
          {/* Inertial Measurement Cluster 30 & DSP Controller 32 */}
          <rect
            x="175"
            y="165"
            width="50"
            height="18"
            rx="2"
            fill="#0284c7"
            stroke="#38bdf8"
            strokeWidth="1.2"
            opacity="0.8"
          />
          <text
            x="200"
            y="177"
            fill="#f0f9ff"
            fontSize="7"
            fontFamily="monospace"
            textAnchor="middle"
          >
            IMU 30 / DSP 32
          </text>
          {/* Balancing Margin Monitor 34 */}
          <rect
            x="70"
            y="90"
            width="80"
            height="45"
            rx="3"
            fill="#1e1b4b"
            stroke="#818cf8"
            strokeWidth="1.2"
          />
          <text
            x="110"
            y="105"
            fill="#c7d2fe"
            fontSize="7"
            fontFamily="monospace"
            textAnchor="middle"
            fontWeight="bold"
          >
            MARGIN MONITOR 34
          </text>
          <text
            x="110"
            y="120"
            fill="#a5b4fc"
            fontSize="6"
            fontFamily="monospace"
            textAnchor="middle"
          >
            Δv = v_max - |v|
          </text>
          {/* Alarm Transducer 36 (Haptic Ripple + Tone) */}
          <path
            d="M 70 112 Q 50 112 50 140 Q 50 170 150 190"
            stroke="#f43f5e"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            fill="none"
          />
          <circle cx="50" cy="140" r="10" fill="#881337" stroke="#f43f5e" strokeWidth="1.5" />
          <text
            x="50"
            y="143"
            fill="#ffe4e6"
            fontSize="6"
            fontFamily="monospace"
            textAnchor="middle"
            fontWeight="bold"
          >
            ALARM 36
          </text>
          {/* CG and Inverted Pendulum Vector */}
          <circle cx="215" cy="110" r="5" fill="#ef4444" stroke="#fee2e2" strokeWidth="1.2" />
          <text
            x="225"
            y="113"
            fill="#ef4444"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="bold"
          >
            CG
          </text>
          <line
            x1="200"
            y1="225"
            x2="215"
            y2="110"
            stroke="#ef4444"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <text x="210" y="150" fill="#f87171" fontSize="7" fontFamily="monospace">
            θ (lean)
          </text>
        </g>
      );
    }
    case "hull-stereolithography": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <text
            x="200"
            y="24"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="9"
            fontFamily="monospace"
          >
            STEREOLITHOGRAPHY APPARATUS (FIG. 1 / FIG. 3)
          </text>
          {/* Vat Container 21 */}
          <rect
            x="60"
            y="140"
            width="280"
            height="130"
            rx="4"
            stroke="#78716c"
            strokeWidth="2"
            fill="#1c1917"
          />
          {/* Liquid Resin 22 */}
          <rect x="65" y="155" width="270" height="110" fill="#0284c7" opacity="0.4" />
          <line
            x1="65"
            y1="155"
            x2="335"
            y2="155"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <text x="75" y="150" fill="#7dd3fc" fontSize="8" fontFamily="monospace">
            22 RESIN SURFACE
          </text>
          {/* Elevator 29 & Shaft 30 */}
          <rect
            x="195"
            y="195"
            width="10"
            height="85"
            fill="#475569"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          <rect
            x="120"
            y="195"
            width="160"
            height="8"
            rx="2"
            fill="#64748b"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          <text x="130" y="215" fill="#e2e8f0" fontSize="8" fontFamily="monospace">
            29 PLATFORM
          </text>
          {/* Cured Part 30 */}
          <rect
            x="150"
            y="180"
            width="100"
            height="15"
            rx="1"
            fill="#d97706"
            stroke="#fbbf24"
            strokeWidth="1"
          />
          <text x="165" y="191" fill="#fef3c7" fontSize="8" fontFamily="monospace">
            30 CURED PART
          </text>
          {/* UV Laser 26 & Galvo Scanner */}
          <rect
            x="160"
            y="45"
            width="80"
            height="25"
            rx="3"
            fill="#292524"
            stroke="#c084fc"
            strokeWidth="1.5"
          />
          <text x="175" y="61" fill="#d8b4fe" fontSize="8" fontFamily="monospace" fontWeight="bold">
            26 LASER
          </text>
          {/* Laser Beam Spot 27 */}
          <line
            x1="200"
            y1="70"
            x2="200"
            y2="155"
            stroke="#c084fc"
            strokeWidth="1.5"
            strokeDasharray="3 1"
          />
          <circle cx="200" cy="155" r="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
          <text x="210" y="145" fill="#facc15" fontSize="8" fontFamily="monospace">
            27 SPOT
          </text>
        </g>
      );
    }
    default:
      return (
        <g stroke="#64748b" strokeWidth="1.5" fill="none">
          <ellipse
            cx={DEFAULT_SCHEMATIC_CX}
            cy={DEFAULT_SCHEMATIC_CY}
            rx={DEFAULT_SCHEMATIC_RX}
            ry={DEFAULT_SCHEMATIC_RY}
          />
          <line
            x1={DEFAULT_SCHEMATIC_LINE_X0}
            y1={DEFAULT_SCHEMATIC_CY}
            x2={DEFAULT_SCHEMATIC_LINE_X1}
            y2={DEFAULT_SCHEMATIC_CY}
          />
          <line
            x1={DEFAULT_SCHEMATIC_CX}
            y1={DEFAULT_SCHEMATIC_LINE_Y0}
            x2={DEFAULT_SCHEMATIC_CX}
            y2={DEFAULT_SCHEMATIC_LINE_Y1}
          />
          <rect
            x={DEFAULT_SCHEMATIC_RECT_X}
            y={DEFAULT_SCHEMATIC_RECT_Y}
            width={DEFAULT_SCHEMATIC_RECT_W}
            height={DEFAULT_SCHEMATIC_RECT_H}
            rx="6"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <circle
            cx={DEFAULT_SCHEMATIC_CX}
            cy={DEFAULT_SCHEMATIC_CY}
            r={DEFAULT_SCHEMATIC_HUB_R}
            stroke="#f59e0b"
            strokeWidth="2"
          />
        </g>
      );
  }
}

export function InteractiveDiagramViewer({
  drawings,
  patentNumber,
  patentId,
}: InteractiveDiagramViewerProps) {
  const { params: livePhysicsParams, updateParam } = usePatentPhysics(patentId || "");
  const [activeFigIndex, setActiveFigIndex] = useState<number>(0);
  const [activeCalloutId, setActiveCalloutId] = useState<string | null>(null);
  const [hoveredCalloutId, setHoveredCalloutId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [teslaOmegaDeg, setTeslaOmegaDeg] = useState<number>(0);
  const isTeslaMotorSchematic = Boolean(
    patentId && /381968|tesla-motor/.test(patentId) && !/coil|533367/.test(patentId),
  );

  useEffect(() => {
    if (!isTeslaMotorSchematic) return;
    const apparatus = stepTeslaMotorFig9(livePhysicsParams.frequency ?? 60);
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setTeslaOmegaDeg((prev) => (prev + apparatus.fieldDisplayOmegaDegPerS * dt) % 360);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isTeslaMotorSchematic, livePhysicsParams.frequency]);

  const activeDrawing = drawings[activeFigIndex] || drawings[0];
  const callouts = useMemo(() => activeDrawing?.callouts ?? [], [activeDrawing]);
  const activePin = callouts.find((c) => c.id === activeCalloutId);
  const currentPinIndex = callouts.findIndex((c) => c.id === activeCalloutId);
  const probe =
    activePin && patentId ? materialProbe(patentId, activePin.label, livePhysicsParams) : null;

  const handlePrevPin = useCallback(() => {
    if (callouts.length === 0) return;
    if (currentPinIndex <= 0) {
      setActiveCalloutId(callouts[callouts.length - 1].id);
    } else {
      setActiveCalloutId(callouts[currentPinIndex - 1].id);
    }
  }, [callouts, currentPinIndex]);

  const handleNextPin = useCallback(() => {
    if (callouts.length === 0) return;
    if (currentPinIndex === -1 || currentPinIndex >= callouts.length - 1) {
      setActiveCalloutId(callouts[0].id);
    } else {
      setActiveCalloutId(callouts[currentPinIndex + 1].id);
    }
  }, [callouts, currentPinIndex]);

  // Keyboard navigation for pins. Bound to the viewer container, not window:
  // arrow keys must keep scrolling/caret-navigating the rest of the page.
  // Pins and toolbar buttons inside the viewer are tabbable, so focus lands
  // here the moment a visitor interacts with the schematic.
  useEffect(() => {
    const container = viewerRef.current;
    if (!container) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      if (target instanceof HTMLSelectElement) return;
      if (target?.isContentEditable) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevPin();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextPin();
      } else if (e.key === "Escape") {
        setActiveCalloutId(null);
      }
    };
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevPin, handleNextPin]);

  if (!activeDrawing) return null;

  return (
    <div
      ref={viewerRef}
      className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-5 sm:p-6 shadow-patent space-y-5"
    >
      {/* Header, Figure Switcher & Viewport Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-700 dark:text-amber-500" />
            <h3 className="font-serif text-lg font-bold text-ink-950 dark:text-parchment-100">
              Interactive Schematic Sheet ({activeDrawing.figureNumber})
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">{activeDrawing.caption}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-parchment-200/80 dark:bg-ink-900 rounded-xl p-1 border border-parchment-300 dark:border-ink-800 text-xs">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => (z > 1 ? z - 0.25 : 1))}
              disabled={zoomLevel <= 1}
              className="p-2.5 min-h-11 min-w-11 flex items-center justify-center rounded hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-40 text-ink-700 dark:text-ink-300"
              aria-label="Zoom out schematic"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-bold text-ink-800 dark:text-ink-200">
              {zoomLevel.toFixed(2)}x
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => (z < 1.75 ? z + 0.25 : 1.75))}
              disabled={zoomLevel >= 1.75}
              className="p-2.5 min-h-11 min-w-11 flex items-center justify-center rounded hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-40 text-ink-700 dark:text-ink-300"
              aria-label="Zoom in schematic"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            {zoomLevel !== 1 && (
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="ml-1 p-2.5 min-h-11 min-w-11 flex items-center justify-center rounded hover:bg-parchment-300 dark:hover:bg-ink-800 text-ink-500"
                aria-label="Reset zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Figure tabs if multiple */}
          {drawings.length > 1 && (
            <div className="flex items-center gap-1">
              {drawings.map((draw, idx) => (
                <button
                  key={draw.figureNumber}
                  type="button"
                  onClick={() => {
                    setActiveFigIndex(idx);
                    setActiveCalloutId(null);
                  }}
                  className={`px-3 py-2 min-h-10 inline-flex items-center rounded-lg text-xs font-sans transition-colors border ${
                    activeFigIndex === idx
                      ? "bg-amber-700 text-white font-bold border-amber-800 dark:bg-amber-700 shadow-xs"
                      : "bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-800 hover:bg-parchment-200"
                  }`}
                >
                  {draw.figureNumber}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schematic Container with Interactive Pins & Pin Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drawing Artboard */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#fbf7ee] dark:bg-[#061121] bg-[linear-gradient(to_right,rgba(231,222,200,0.7)_1px,transparent_1px),linear-gradient(to_bottom,rgba(231,222,200,0.7)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(12,35,64,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(12,35,64,0.6)_1px,transparent_1px)] bg-[size:24px_24px] p-4 sm:p-6 border border-parchment-300 dark:border-ink-800 relative min-h-[380px] shadow-inner overflow-auto transition-colors duration-300">
          {/* Schematic SVG Vector Frame */}
          <div
            className="min-w-full w-max flex justify-center"
            style={zoomLevel === 1 ? undefined : { width: `${zoomLevel * 100}%` }}
          >
            <div
              className="relative w-full max-w-2xl aspect-[4/3] flex items-center justify-center transition-[width] duration-300"
              style={zoomLevel === 1 ? undefined : { maxWidth: "none" }}
            >
              <svg
                viewBox={`0 0 ${SCHEMATIC_VIEW_W} ${SCHEMATIC_VIEW_H}`}
                className="w-full h-full select-none"
                onPointerDown={(e) => {
                  if (!patentId?.includes("wright-flyer") && !patentId?.includes("821393")) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const nx = (e.clientX - rect.left) / rect.width;
                  updateParam("wingWarp", wrightWarpFromPointerNx(nx));
                }}
              >
                {/* Outer drawing border */}
                <rect
                  x="10"
                  y="10"
                  width="380"
                  height="280"
                  fill="none"
                  stroke="#78350f"
                  className="dark:stroke-[#0ea5e9]"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  strokeOpacity="0.4"
                  rx="4"
                />
                <text
                  x="200"
                  y="32"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#451a03"
                  className="dark:fill-[#7dd3fc]"
                  fontFamily="serif"
                  fontWeight="bold"
                  letterSpacing="1"
                >
                  {patentNumber} · {activeDrawing.figureNumber.toUpperCase()}
                </text>

                {/* Central authentic mechanical blueprint vectors */}
                {_renderHistoricalSchematic(
                  activeDrawing.svgType,
                  activeDrawing.figureNumber,
                  patentNumber,
                  patentId,
                  isTeslaMotorSchematic
                    ? { ...livePhysicsParams, omegaT: teslaOmegaDeg }
                    : livePhysicsParams,
                )}

                {/* Animated Radar Target Reticle on selected pin */}
                {activePin && (
                  <g className="pointer-events-none transition-opacity duration-300">
                    {(() => {
                      const pin = schematicCalloutSvg(activePin.x, activePin.y);
                      return (
                        <>
                          <circle
                            cx={pin.x}
                            cy={pin.y}
                            r={SCHEMATIC_RETICLE_INNER_R}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            className="animate-spin"
                            style={{
                              transformOrigin: `${pin.x}px ${pin.y}px`,
                              animationDuration: "10s",
                            }}
                          />
                          <circle
                            cx={pin.x}
                            cy={pin.y}
                            r={SCHEMATIC_RETICLE_OUTER_R}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="1"
                            opacity="0.35"
                          />
                          {/* Crosshairs */}
                          <line
                            x1={pin.x - SCHEMATIC_RETICLE_HAIR}
                            y1={pin.y}
                            x2={pin.x + SCHEMATIC_RETICLE_HAIR}
                            y2={pin.y}
                            stroke="#f59e0b"
                            strokeWidth="1"
                            strokeOpacity="0.6"
                          />
                          <line
                            x1={pin.x}
                            y1={pin.y - SCHEMATIC_RETICLE_HAIR}
                            x2={pin.x}
                            y2={pin.y + SCHEMATIC_RETICLE_HAIR}
                            stroke="#f59e0b"
                            strokeWidth="1"
                            strokeOpacity="0.6"
                          />
                        </>
                      );
                    })()}
                  </g>
                )}
              </svg>

              {/* Interactive Numbered Callout Pins */}
              {callouts.map((callout, pinIdx) => {
                const isSelected = callout.id === activeCalloutId;
                const isHovered = callout.id === hoveredCalloutId;
                const pinText = callout.element.length <= 5 ? callout.element : String(pinIdx + 1);
                return (
                  <button
                    key={callout.id}
                    type="button"
                    aria-label={`${callout.label}: ${callout.description}`}
                    onClick={() => setActiveCalloutId(isSelected ? null : callout.id)}
                    onMouseEnter={() => setHoveredCalloutId(callout.id)}
                    onMouseLeave={() => setHoveredCalloutId(null)}
                    style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[36px] max-w-[4rem] h-9 px-2 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 shadow-md truncate ${
                      isSelected
                        ? "bg-amber-500 text-ink-950 ring-4 ring-amber-500/50 scale-125 z-20 shadow-amber-500/30"
                        : isHovered
                          ? "bg-amber-600 text-white scale-110 ring-2 ring-amber-400 z-15"
                          : "bg-ink-900/90 text-amber-300 border border-amber-500/60 hover:scale-110 hover:bg-amber-600 hover:text-white z-10"
                    }`}
                    title={`${callout.label}: ${callout.description}`}
                  >
                    {pinText}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full flex items-center justify-between text-[11px] font-sans text-ink-400 mt-4 pt-3 border-t border-ink-800/80">
            <span className="flex items-center gap-2">
              <span className="hidden sm:inline">
                Click any numbered callout pin or use arrow keys [← / →]
              </span>
              <span className="sm:hidden">Tap any numbered pin</span>
            </span>
            <span className="text-amber-400 font-bold font-mono">
              {callouts.length} Curated Callouts
            </span>
          </div>
        </div>

        {/* Pin Inspector Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Callout Pin Inspector
              </span>
              {callouts.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevPin}
                    className="p-1 rounded-md bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-300 transition-colors"
                    title="Previous Pin (Arrow Left)"
                    aria-label="Previous callout pin"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPin}
                    className="p-1 rounded-md bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-300 transition-colors"
                    title="Next Pin (Arrow Right)"
                    aria-label="Next callout pin"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {activePin ? (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 h-6 rounded-full bg-amber-600 text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                    {activePin.element}
                  </span>
                  <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100">
                    {activePin.label}
                  </span>
                </div>
                <p className="text-xs font-sans text-ink-700 dark:text-ink-300 leading-relaxed">
                  {activePin.description}
                </p>
                {probe && (
                  <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-[11px] font-mono space-y-0.5">
                    <div className="uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Material probe
                    </div>
                    <div>{probe.material}</div>
                    <div className="font-bold">
                      {probe.qty} = {probe.value} {probe.unit}
                    </div>
                    <div className="font-sans text-ink-600 dark:text-ink-400">{probe.note}</div>
                  </div>
                )}
                <div className="p-2.5 rounded-lg bg-parchment-200/60 dark:bg-ink-950 text-[11px] font-sans text-ink-600 dark:text-ink-400 border border-parchment-300 dark:border-ink-800">
                  <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-0.5">
                    Historical Specification Reference:
                  </span>
                  Reference numeral{" "}
                  <span className="font-mono font-bold text-ink-800 dark:text-ink-200">
                    {activePin.element}
                  </span>{" "}
                  designates the {activePin.label.toLowerCase()} in {activeDrawing.figureNumber}.
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCalloutId(null)}
                  className="w-full text-center py-1.5 text-xs text-amber-700 dark:text-amber-400 hover:underline font-sans"
                >
                  Clear Selection (Esc)
                </button>
              </div>
            ) : (
              <div className="text-xs text-ink-500 font-sans py-8 text-center space-y-1.5">
                <MapPin className="w-6 h-6 mx-auto text-amber-600/70 dark:text-amber-400/70 mb-1 animate-bounce" />
                <p className="font-medium text-ink-800 dark:text-ink-200">
                  Select Any Numbered Pin
                </p>
                <p className="text-ink-500 text-[11px]">
                  Click pins on the schematic or select from the list below to inspect historical
                  specifications.
                </p>
              </div>
            )}
          </div>

          {/* Quick list of all callouts */}
          {callouts.length > 0 && (
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {callouts.map((callout) => {
                const isSelected = activeCalloutId === callout.id;
                return (
                  <button
                    key={callout.id}
                    type="button"
                    onClick={() => setActiveCalloutId(isSelected ? null : callout.id)}
                    onMouseEnter={() => setHoveredCalloutId(callout.id)}
                    onMouseLeave={() => setHoveredCalloutId(null)}
                    className={`w-full text-left p-2 rounded-lg text-xs font-sans flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-amber-600 text-white font-bold shadow-xs"
                        : "hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-300"
                    }`}
                  >
                    <span className="truncate">
                      <span className="font-mono font-bold mr-1">[{callout.element}]</span>{" "}
                      {callout.label}
                    </span>
                    <span className="text-[10px] opacity-70 shrink-0 ml-1">
                      {isSelected ? "Active ✓" : "Inspect →"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
