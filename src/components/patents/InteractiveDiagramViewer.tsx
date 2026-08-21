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
import { useCallback, useEffect, useMemo, useState } from "react";
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
  pasteurSchematicBubbleX,
  pasteurSchematicYeast,
  peltonSchematicBucket,
  spencerSchematicCavity,
  stepBardeenTransistor,
  stepBellTelephone,
  stepColtRevolver,
  stepCorlissEngine,
  stepDaimlerEngine,
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
  stepParsonsTurbine,
  stepPasteurFermentation,
  stepPeltonWheel,
  stepSpencerMicrowave,
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
import { FrankenSimEngine, lamarrSchematicHop, lamarrSchematicStaffY } from "@/physics/engine";
import { fermiSchematicSlug, stepFermiKinetics } from "@/physics/fermiKinetics";
import {
  ccdSchematicGateX,
  mergenthalerSchematicChuteX,
  otisSchematicPawl,
  otisSchematicRailY,
  renoSchematicCleat,
  sholesSchematicTypebar,
  stepCcdWells,
  stepHoweSewingMachine,
  stepMergenthalerLinotype,
  stepOtisElevator,
  stepRenoEscalator,
  stepSholesTypewriter,
} from "@/physics/machineKernels";
import {
  stepTeslaMotorFig9,
  teslaBAt,
  teslaCoilSiUnits,
  teslaFig4Strobe,
  teslaSchematicPoleRect,
  teslaSchematicStrobeOpacity,
} from "@/physics/teslaKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
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
  [/hopkins|potash|x1/, "hopkins-potash"],
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
  [/pasteur|fermentation|135245|135,245/, "pasteur-fermentation"],
  [/glidden|barbed[- ]wire|157124|157,124/, "glidden-barbed-wire"],
  [/otto|194047|194,047/, "otto-engine"],
  [/phonograph|200521|200,521/, "edison-phonograph"],
  [/pelton|water[- ]wheel|233692|233,692/, "pelton-water-wheel"],
  [/delaval|separator|247804|247,804/, "delaval-separator"],
  [/mergenthaler|linotype|313224|313,224/, "mergenthaler-linotype"],
  [/maxim|machine[- ]gun|319596|319,596/, "maxim-machine-gun"],
  [/thomson|welding|347140|347,140/, "thomson-welding"],
  [/daimler|361931|361,931/, "daimler-engine"],
  [/eastman|kodak|388850|388,850/, "eastman-kodak"],
  [/hollerith|tabulating|395781|395,781/, "hollerith-tabulating"],
  [/reno|escalator|470918|470,918/, "reno-escalator"],
  [/diesel|542846|542,846/, "diesel-engine"],
  [/parsons|turbine|608969|608,969|328710|328,710/, "parsons-turbine"],
  [/teleautomaton|613809|613,809/, "tesla-teleautomaton"],
  [/zeppelin|airship|621195|621,195/, "zeppelin-airship"],
  [/de[- ]?forest|audion|879532|879,532/, "de-forest-audion"],
  [/hewitt|mercury[- ]lamp|682690|682,690/, "hewitt-mercury-lamp"],
  [/fessenden|wireless|706737|706,737/, "fessenden-wireless"],
  [/linde|liquefaction|727650|727,650/, "linde-air-liquefaction"],
  [/carrier|condition|808897|808,897/, "carrier-air-conditioner"],
];

function resolveSchematicKind(
  svgType: string,
  figureNumber: string,
  patentNumber: string,
  patentId?: string,
): string {
  const known = new Set(SCHEMATIC_HINTS.map(([, kind]) => kind));
  if (known.has(svgType) || svgType === "wright-fig1" || svgType === "wright-fig2") {
    return svgType.startsWith("wright-fig") ? "wright-flyer" : svgType;
  }
  const hay = `${svgType} ${figureNumber} ${patentNumber} ${patentId ?? ""}`.toLowerCase();
  for (const [pattern, kind] of SCHEMATIC_HINTS) {
    if (pattern.test(hay)) return kind;
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
      const live = teslaBAt(omegaT, 2);
      const strobe = teslaFig4Strobe(2);
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
      const coil = teslaCoilSiUnits(180, 15, 0);
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={coil.schematicBaseX}
            y={coil.schematicBaseY}
            width={coil.schematicBaseW}
            height={coil.schematicBaseH}
            rx="3"
            fill="#334155"
            stroke="#94a3b8"
          />
          <line
            x1={coil.schematicPostX0}
            y1={coil.schematicPostY0}
            x2={coil.schematicPostX0}
            y2={coil.schematicPostY1}
            stroke="#f59e0b"
            strokeWidth="3"
          />
          <line
            x1={coil.schematicPostX1}
            y1={coil.schematicPostY0}
            x2={coil.schematicPostX1}
            y2={coil.schematicPostY1}
            stroke="#f59e0b"
            strokeWidth="3"
          />
          <path
            d={coil.schematicBellD}
            fill="#1e3a8a"
            fillOpacity="0.3"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <ellipse
            cx={coil.schematicToploadCx}
            cy={coil.schematicToploadCy}
            rx={coil.schematicToploadRx}
            ry={coil.schematicToploadRy}
            fill="#d97706"
            fillOpacity="0.4"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <line
            x1={coil.schematicSecondaryX}
            y1={coil.schematicSecondaryY0}
            x2={coil.schematicSecondaryX}
            y2={coil.schematicSecondaryY1}
            stroke="#fbbf24"
            strokeWidth="2.5"
          />
          <circle
            cx={coil.schematicSparkX0}
            cy={coil.schematicSparkY}
            r={coil.schematicSparkR}
            fill="#ef4444"
          />
          <circle
            cx={coil.schematicSparkX1}
            cy={coil.schematicSparkY}
            r={coil.schematicSparkR}
            fill="#ef4444"
          />
          <line
            x1={coil.schematicSparkX0 + coil.schematicSparkDx}
            y1={coil.schematicSparkY}
            x2={coil.schematicSparkX1 - coil.schematicSparkDx}
            y2={coil.schematicSparkY}
            stroke="#f87171"
            strokeDasharray="2 2"
          />
        </g>
      );
    }
    case "edison-bulb": {
      const bulb = stepEdisonBulb({
        voltage: params?.voltage ?? 110,
        filamentLength: params?.filamentLength ?? 22,
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
          <path d={bulb.schematicBaseD} fill="#64748b" stroke="#94a3b8" />
          <line
            x1={bulb.schematicFootX1}
            y1={bulb.schematicFootY}
            x2={bulb.schematicFootX2}
            y2={bulb.schematicFootY}
            stroke="#94a3b8"
          />
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
      const spencer = stepSpencerMicrowave();
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={spencer.schematicOvenX}
            y={spencer.schematicOvenY}
            width={spencer.schematicOvenW}
            height={spencer.schematicOvenH}
            rx="8"
            fill="#0f172a"
            fillOpacity="0.45"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <circle
            cx={spencer.schematicAnodeCx}
            cy={spencer.schematicAnodeCy}
            r={spencer.schematicAnodeR}
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          {Array.from({ length: spencer.schematicCavityCount }, (_, i) => {
            const cav = spencerSchematicCavity(
              i,
              spencer.schematicCavityCount,
              spencer.schematicAnodeCx,
              spencer.schematicAnodeCy,
              spencer.schematicCavityR,
            );
            return (
              <circle
                key={i}
                cx={cav.cx}
                cy={cav.cy}
                r={spencer.schematicCavityDotR}
                fill="#0f172a"
                stroke="#fbbf24"
              />
            );
          })}
          <path
            d={spencer.schematicWaveguideD}
            fill="#7c3aed"
            fillOpacity="0.15"
            stroke="#a78bfa"
          />
          <circle
            cx={spencer.schematicLoadCx}
            cy={spencer.schematicLoadCy}
            r={spencer.schematicLoadR}
            fill="#f59e0b"
            fillOpacity="0.25"
            stroke="#fbbf24"
          />
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
      const howe = stepHoweSewingMachine(300, 120, 3.5);
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
      const tension = params?.cableTension ?? 100;
      const otis = stepOtisElevator({ cableTensionPct: tension });
      const isCut = otis.isSnapped;
      const springBow = otis.schematicSpringBowPx;
      const pawlExt = otis.schematicPawlExtPx;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <line
            x1={otis.schematicRailLeftX}
            y1={otis.schematicRailY0}
            x2={otis.schematicRailLeftX}
            y2={otis.schematicRailY1}
            stroke="#64748b"
            strokeWidth="3"
          />
          <line
            x1={otis.schematicRailRightX}
            y1={otis.schematicRailY0}
            x2={otis.schematicRailRightX}
            y2={otis.schematicRailY1}
            stroke="#64748b"
            strokeWidth="3"
          />
          {Array.from({ length: otis.schematicRailCount }, (_, i) => {
            const y = otisSchematicRailY(i, otis.schematicRailOriginY, otis.schematicRailPitchY);
            return (
              <g key={i}>
                <polygon
                  points={`${otis.schematicRailLeftX},${y} ${otis.schematicRailLeftX + otis.schematicToothIn},${y + otis.schematicToothMid} ${otis.schematicRailLeftX},${y + otis.schematicToothH}`}
                  fill="#94a3b8"
                  stroke="#cbd5e1"
                />
                <polygon
                  points={`${otis.schematicRailRightX},${y} ${otis.schematicRailRightX - otis.schematicToothIn},${y + otis.schematicToothMid} ${otis.schematicRailRightX},${y + otis.schematicToothH}`}
                  fill="#94a3b8"
                  stroke="#cbd5e1"
                />
              </g>
            );
          })}
          {!isCut ? (
            <line
              x1={otis.schematicRopeX}
              y1={otis.schematicRopeY0}
              x2={otis.schematicRopeX}
              y2={otis.schematicRopeAttachY - springBow}
              stroke="#f59e0b"
              strokeWidth="3"
            />
          ) : (
            <path
              d={`M ${otis.schematicRopeX} ${otis.schematicRopeY0} L ${otis.schematicRopeX - otis.schematicCutDx} ${otis.schematicCutY1} L ${otis.schematicRopeX + otis.schematicCutDx} ${otis.schematicCutY2}`}
              stroke="#ef4444"
              strokeWidth="2.5"
            />
          )}
          <rect
            x={otis.schematicFrameX}
            y={otis.schematicFrameY}
            width={otis.schematicFrameW}
            height={otis.schematicFrameH}
            stroke="#60a5fa"
            strokeWidth="2"
            fill="#1e3a8a"
            fillOpacity="0.2"
            rx="3"
          />

          <path
            d={`M ${otis.schematicSpringX0} ${otis.schematicSpringY} Q ${otis.schematicRopeX} ${otis.schematicSpringY - springBow} ${otis.schematicSpringX1} ${otis.schematicSpringY}`}
            stroke="#38bdf8"
            strokeWidth="4"
          />
          {(["left", "right"] as const).map((side) => {
            const pawl = otisSchematicPawl(
              side,
              pawlExt,
              otis.schematicPawlInnerX0,
              otis.schematicPawlInnerX1,
              otis.schematicPawlOuterBase0,
              otis.schematicPawlOuterBase1,
              otis.schematicPawlY0,
              otis.schematicPawlY1,
            );
            return (
              <line
                key={side}
                x1={pawl.x1}
                y1={pawl.y1}
                x2={pawl.x2}
                y2={pawl.y2}
                stroke={isCut ? "#34d399" : "#38bdf8"}
                strokeWidth="3.5"
              />
            );
          })}

          <text x="200" y="70" fill="#fbbf24" fontSize="9" textAnchor="middle">
            {!isCut ? "Hoisting Cable" : "Rope Severed"}
          </text>
          <text x="200" y="140" fill="#93c5fd" fontSize="9" textAnchor="middle">
            Cab Platform
          </text>
          <text
            x="200"
            y="180"
            fill={isCut ? "#34d399" : "#38bdf8"}
            fontSize="9"
            textAnchor="middle"
          >
            {isCut ? "PAWLS LOCKED IN RATCHETS" : "Leaf Spring Bowed Under Tension"}
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
      const daimler = stepDaimlerEngine({
        engineRpm: params?.engineRpm,
        hotTubeTempC: params?.hotTubeTemp,
        differentialSlipAngleDeg: params?.turnAngle,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={daimler.schematicCylinderX}
            y={daimler.schematicCylinderY}
            width={daimler.schematicCylinderW}
            height={daimler.schematicCylinderH}
            rx="4"
            stroke="#94a3b8"
          />
          <rect
            x={daimler.schematicHotTubeX}
            y={daimler.schematicHotTubeY}
            width={daimler.schematicHotTubeW}
            height={daimler.schematicHotTubeH}
            rx="2"
            fill="#f97316"
            stroke="#ea580c"
          />
          <text x="60" y="56" fill="#f97316" fontSize="8" textAnchor="middle">
            Hot Tube
          </text>
          <rect
            x={daimler.schematicPistonX}
            y={daimler.schematicPistonY}
            width={daimler.schematicPistonW}
            height={daimler.schematicPistonH}
            rx="3"
            fill="#38bdf8"
            fillOpacity="0.2"
            stroke="#38bdf8"
          />
          <line
            x1={daimler.schematicRodX}
            y1={daimler.schematicRodY0}
            x2={daimler.schematicRodX}
            y2={daimler.schematicRodY1}
            stroke="#e2e8f0"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Enclosed Flywheel Crankcase */}
          <circle
            cx={daimler.schematicFlywheelCx}
            cy={daimler.schematicFlywheelCy}
            r={daimler.schematicFlywheelR}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <circle
            cx={daimler.schematicFlywheelCx}
            cy={daimler.schematicFlywheelCy - 10}
            r={daimler.schematicHubR}
            fill="#fbbf24"
          />
          <text x="200" y="285" fill="#fbbf24" fontSize="9" textAnchor="middle">
            Balanced Crankcase Flywheels
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
      const diesel = FrankenSimEngine.stepDieselEngine({ compressionRatio: 18, engineRpm: 150 });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x={diesel.schematicCylinderX}
            y={diesel.schematicCylinderY}
            width={diesel.schematicCylinderW}
            height={diesel.schematicCylinderH}
            rx="6"
            stroke="#94a3b8"
          />
          <rect
            x={diesel.schematicInjectorX}
            y={diesel.schematicInjectorY}
            width={diesel.schematicInjectorW}
            height={diesel.schematicInjectorH}
            rx="3"
            fill="#fbbf24"
            stroke="#d97706"
          />
          <text x="200" y="10" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Blast-Air Injector (65 bar)
          </text>
          <rect
            x={diesel.schematicPistonX}
            y={diesel.schematicPistonY}
            width={diesel.schematicPistonW}
            height={diesel.schematicPistonH}
            rx="3"
            fill="#38bdf8"
            fillOpacity="0.2"
            stroke="#38bdf8"
          />
          <line
            x1={diesel.schematicRodX}
            y1={diesel.schematicRodY0}
            x2={diesel.schematicRodX}
            y2={diesel.schematicRodY1}
            stroke="#e2e8f0"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Crankshaft */}
          <circle
            cx={diesel.schematicFlywheelCx}
            cy={diesel.schematicFlywheelCy}
            r={diesel.schematicFlywheelR}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <text x="200" y="295" fill="#4ade80" fontSize="9" textAnchor="middle">
            Adiabatic Compression Ratio 18:1 (680°C)
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
          <text x="75" y="85" fill="#f87171" fontSize="8" textAnchor="middle">
            200-Bar Comp
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
          {/* JT Valve & Vacuum Vessel */}
          <polygon points="200,195 190,210 210,210" fill="#fbbf24" stroke="#d97706" />
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
          <text x="200" y="240" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Liquid Air (-193°C)
          </text>
          <text x="200" y="20" fill="#38bdf8" fontSize="9" textAnchor="middle">
            Counter-Current Regenerator
          </text>
        </g>
      );
    }
    case "carrier-air-conditioner": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Plenum Chamber */}
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
          {/* Chilled Water Nozzle Sprays */}
          <line x1="120" y1="70" x2="120" y2="190" stroke="#0284c7" strokeWidth="3" />
          {[90, 120, 150, 180].map((y) => (
            <polygon
              key={y}
              points={`120,${y} 150,${y - 12} 150,${y + 12}`}
              fill="#38bdf8"
              fillOpacity="0.4"
            />
          ))}
          {/* Zigzag Baffles */}
          {[190, 205, 220].map((x) => (
            <polyline
              key={x}
              points={`${x},70 ${x + 8},100 ${x},130 ${x + 8},160 ${x},190`}
              stroke="#94a3b8"
              strokeWidth="2"
            />
          ))}
          {/* Steam Reheat Coil */}
          <rect
            x="270"
            y="70"
            width="18"
            height="120"
            rx="2"
            fill="#ef4444"
            fillOpacity="0.3"
            stroke="#ef4444"
          />
          <text x="120" y="50" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Chilled Spray
          </text>
          <text x="205" y="50" fill="#94a3b8" fontSize="8" textAnchor="middle">
            Eliminators
          </text>
          <text x="280" y="50" fill="#ef4444" fontSize="8" textAnchor="middle">
            Reheat
          </text>
          <text x="200" y="225" fill="#4ade80" fontSize="9" textAnchor="middle">
            Psychrometric Dew-Point Control Cycle
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
    case "hopkins-potash": {
      return (
        <g stroke="#10b981" strokeWidth="1.5" fill="none">
          {/* Calcination Kiln */}
          <rect
            x="40"
            y="80"
            width="90"
            height="120"
            rx="6"
            stroke="#f59e0b"
            strokeWidth="2"
            fill="#78350f"
            fillOpacity="0.3"
          />
          <path
            d="M 50 160 Q 85 110 120 160 Z"
            stroke="#ef4444"
            strokeWidth="2"
            fill="#ef4444"
            fillOpacity="0.2"
          />
          {/* Leaching Vat */}
          <rect
            x="155"
            y="80"
            width="90"
            height="120"
            rx="4"
            stroke="#10b981"
            strokeWidth="2"
            fill="#064e3b"
            fillOpacity="0.2"
          />
          {/* Evaporating Kettle */}
          <path
            d="M 270 120 L 270 170 Q 315 200 360 170 L 360 120 Z"
            stroke="#64748b"
            strokeWidth="2"
            fill="#1e293b"
            fillOpacity="0.3"
          />
          {/* Labels */}
          <text x="85" y="72" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">
            CALCINING KILN
          </text>
          <text x="200" y="72" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">
            LIXIVIATION VAT
          </text>
          <text x="315" y="112" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
            PEARL ASH KETTLE
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
    case "pasteur-fermentation": {
      const pasteur = stepPasteurFermentation({
        pasteurizationTempC: params?.pasteurizationTempC,
        holdTimeMin: params?.holdTimeMin,
        wortTempC: params?.wortTempC ?? params?.tempCelsius,
      });
      const yeast = pasteurSchematicYeast(
        pasteur.schematicYeastX,
        pasteur.schematicYeastY,
        pasteur.schematicYeastW,
        pasteur.schematicYeastH,
      );
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path
            d={pasteur.schematicVesselD}
            stroke="#38bdf8"
            fill="#0284c7"
            fillOpacity="0.15"
            strokeWidth="2"
          />
          <path d={pasteur.schematicSwanD} stroke="#4ade80" strokeWidth="2.5" />
          <rect
            x={yeast.x}
            y={yeast.y}
            width={yeast.w}
            height={yeast.h}
            rx="3"
            fill="#f59e0b"
            fillOpacity="0.35"
            stroke="#d97706"
          />
          {Array.from({ length: pasteur.schematicBubbleCount }, (_, i) => (
            <circle
              key={i}
              cx={pasteurSchematicBubbleX(
                i,
                pasteur.schematicBubbleOriginX,
                pasteur.schematicBubblePitchX,
              )}
              cy={pasteur.schematicBubbleY}
              r={pasteur.schematicBubbleR}
              fill="#38bdf8"
              fillOpacity="0.5"
            />
          ))}
          <text x="250" y="30" fill="#4ade80" fontSize="8" textAnchor="middle">
            Sterile Swan-Neck
          </text>
          <text x="200" y="130" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Anaerobic Fermenter
          </text>
          <text x="200" y="212" fill="#f59e0b" fontSize="8" textAnchor="middle">
            Pure Yeast Strain Bed
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
            Mica Diaphragm &amp; Stylus
          </text>
          <text x="190" y="205" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Grooved Brass Cylinder (Tinfoil)
          </text>
        </g>
      );
    }
    case "pelton-water-wheel": {
      const pelton = stepPeltonWheel({
        headMeters: params?.headMeters,
        runnerRpm: params?.runnerRpm ?? params?.rotorRpm,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Wheel Rim */}
          <circle
            cx={pelton.schematicRunnerCx}
            cy={pelton.schematicRunnerCy}
            r={pelton.schematicRunnerR}
            stroke="#94a3b8"
            strokeWidth="2"
          />
          {/* Double Split-Buckets */}
          {Array.from({ length: pelton.schematicBucketCount }, (_, i) => {
            const bucket = peltonSchematicBucket(
              i * pelton.schematicBucketPitchDeg,
              pelton.schematicRunnerCx,
              pelton.schematicRunnerCy,
              pelton.schematicRunnerR,
            );
            return (
              <g key={i}>
                <ellipse
                  cx={bucket.x}
                  cy={bucket.y}
                  rx={pelton.schematicBucketRx}
                  ry={pelton.schematicBucketRy}
                  stroke="#fbbf24"
                  fill="#d97706"
                />
                <line
                  x1={bucket.x - pelton.schematicSplitDx}
                  y1={bucket.y}
                  x2={bucket.x + pelton.schematicSplitDx}
                  y2={bucket.y}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
          {/* Needle Nozzle High-Pressure Water Jet */}
          <polygon points={pelton.schematicNozzlePoints} fill="#0284c7" stroke="#38bdf8" />
          <line
            x1={pelton.schematicJetX1}
            y1={pelton.schematicJetY}
            x2={pelton.schematicJetX2}
            y2={pelton.schematicJetY}
            stroke="#38bdf8"
            strokeWidth={2 + pelton.jetCrateDensity * 4}
            strokeDasharray="4 2"
            opacity={pelton.jetOpacity}
          />
          <text x="70" y="175" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Needle Nozzle
          </text>
          <text x="200" y="55" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Split-Bucket Runner
          </text>
          <text x="200" y="220" fill="#4ade80" fontSize="8" textAnchor="middle">
            165° Jet Energy Extraction
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
            Plastic Fusion Interface ($I^2Rt$)
          </text>
          <text x="200" y="145" fill="#f59e0b" fontSize="8" textAnchor="middle">
            Massive Secondary Transformer Bar
          </text>
        </g>
      );
    }
    case "parsons-turbine": {
      const parsons = stepParsonsTurbine({
        rotorRpm: params?.rotorRpm,
        inletPressurePsi: params?.inletPressurePsi,
      });
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Stepped Rotor Core */}
          <polygon
            points={parsons.schematicRotorPoints}
            stroke="#94a3b8"
            fill="#1e293b"
            fillOpacity="0.3"
            strokeWidth="2"
          />
          {/* Multi-Stage Blade Rings */}
          {parsons.schematicStageXs.map((x) => (
            <line
              key={x}
              x1={x}
              y1={parsons.schematicBladeY0}
              x2={x}
              y2={parsons.schematicBladeY1}
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="3 2"
            />
          ))}
          {/* Expanding Casing */}
          <line
            x1={parsons.schematicCasingX1}
            y1={parsons.schematicCasingY0}
            x2={parsons.schematicCasingX2}
            y2={parsons.schematicCasingY1}
            stroke="#60a5fa"
            strokeWidth="2.5"
          />
          <line
            x1={parsons.schematicCasingX1}
            y1={parsons.schematicCasingY2}
            x2={parsons.schematicCasingX2}
            y2={parsons.schematicCasingY3}
            stroke="#60a5fa"
            strokeWidth="2.5"
          />
          <line
            x1={parsons.schematicInletX1}
            y1={parsons.schematicInletY}
            x2={parsons.schematicInletX2}
            y2={parsons.schematicInletY}
            stroke="#fbbf24"
            strokeWidth="3"
          />
          <text x="55" y="130" fill="#fbbf24" fontSize="8" textAnchor="middle">
            HP Steam In
          </text>
          <text x="200" y="50" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Continuous Axial Expansion
          </text>
          <text x="200" y="235" fill="#4ade80" fontSize="8" textAnchor="middle">
            Stepped Multi-Stage Reaction Rotor
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

  // Keyboard navigation for pins
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevPin, handleNextPin]);

  if (!activeDrawing) return null;

  return (
    <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-5 sm:p-6 shadow-patent space-y-5">
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
              className="p-1 rounded hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-40 text-ink-700 dark:text-ink-300"
              aria-label="Zoom out schematic"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-bold text-ink-800 dark:text-ink-200">
              {zoomLevel.toFixed(2)}x
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => (z < 1.75 ? z + 0.25 : 1.75))}
              disabled={zoomLevel >= 1.75}
              className="p-1 rounded hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-40 text-ink-700 dark:text-ink-300"
              aria-label="Zoom in schematic"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 1 && (
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="ml-1 p-1 rounded hover:bg-parchment-300 dark:hover:bg-ink-800 text-ink-500"
                aria-label="Reset zoom"
              >
                <RotateCcw className="w-3 h-3" />
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
                  className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors border ${
                    activeFigIndex === idx
                      ? "bg-amber-700 text-white font-bold border-amber-800 dark:bg-amber-600 shadow-xs"
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
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#fbf7ee] dark:bg-[#061121] p-4 sm:p-6 border border-parchment-300 dark:border-ink-800 relative min-h-[380px] shadow-inner overflow-hidden transition-colors duration-300">
          {/* Blueprint / parchment background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e7dec8_1px,transparent_1px),linear-gradient(to_bottom,#e7dec8_1px,transparent_1px)] opacity-70 dark:bg-[linear-gradient(to_right,#0c2340_1px,transparent_1px),linear-gradient(to_bottom,#0c2340_1px,transparent_1px)] dark:opacity-60 bg-[size:24px_24px] rounded-2xl pointer-events-none" />

          {/* Schematic SVG Vector Frame */}
          <div
            className="relative w-full max-w-2xl aspect-[4/3] flex items-center justify-center transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
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
                  className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[28px] max-w-[3.5rem] h-7 px-2 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 shadow-md truncate ${
                    isSelected
                      ? "bg-amber-500 text-ink-950 ring-4 ring-amber-500/50 scale-125 z-20 shadow-amber-500/30"
                      : isHovered
                        ? "bg-amber-600 text-white scale-115 ring-2 ring-amber-400 z-15"
                        : "bg-ink-900/90 text-amber-300 border border-amber-500/60 hover:scale-110 hover:bg-amber-600 hover:text-white z-10"
                  }`}
                  title={`${callout.label}: ${callout.description}`}
                >
                  {pinText}
                </button>
              );
            })}
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
