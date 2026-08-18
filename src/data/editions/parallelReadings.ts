/**
 * Hand-authored, paragraph-level companion readings for published archival
 * editions. These are editorial translations, not OCR cleanup or generated
 * summaries. Each entry retains the material mechanism, conditions, and
 * limitations of its matching source block. Keys are explicit block positions
 * in the edition file.
 */

import { bardeenTransistorParallelReadings } from "./bardeenTransistorEdition";
import { bellTelephoneParallelReadings } from "./bellTelephoneEdition";
import { boyleSmithCcdParallelReadings } from "./boyleSmithCcdEdition";
import { carrierAirConditionerParallelReadings } from "./carrierAirConditionerEdition";
import { coltRevolverParallelReadings } from "./coltRevolverEdition";
import { corlissSteamEngineParallelReadings } from "./corlissSteamEngineEdition";
import { davenportElectricMotorParallelReadings } from "./davenportElectricMotorEdition";
import { delavalSeparatorParallelReadings } from "./delavalSeparatorEdition";
import { dieselEngineParallelReadings } from "./dieselEngineEdition";
import { eastmanKodakParallelReadings } from "./eastmanKodakEdition";
import { edisonLightbulbParallelReadings } from "./edisonLightbulbEdition";
import { edisonPhonographParallelReadings } from "./edisonPhonographEdition";
import { einsteinRefrigeratorParallelReadings } from "./einsteinRefrigeratorEdition";
import { engelbartMouseParallelReadings } from "./engelbartMouseEdition";
import { ericssonPropellerParallelReadings } from "./ericssonPropellerEdition";
import { farnsworthTvParallelReadings } from "./farnsworthTvEdition";
import { fermiReactorParallelReadings } from "./fermiReactorEdition";
import { gatlingGunParallelReadings } from "./gatlingGunEdition";
import { gliddenBarbedWireParallelReadings } from "./gliddenBarbedWireEdition";
import { goddardRocketParallelReadings } from "./goddardRocketEdition";
import { goodyearRubberParallelReadings } from "./goodyearRubberEdition";
import { grammeDynamoParallelReadings } from "./grammeDynamoEdition";
import { hollerithTabulatingParallelReadings } from "./hollerithTabulatingEdition";
import { hyattCelluloidParallelReadings } from "./hyattCelluloidEdition";
import { kwolekKevlarParallelReadings } from "./kwolekKevlarEdition";
import { lamarrFrequencyHoppingParallelReadings } from "./lamarrFrequencyHoppingEdition";
import { lincolnBuoyParallelReadings } from "./lincolnBuoyEdition";
import { lindeAirLiquefactionParallelReadings } from "./lindeAirLiquefactionEdition";
import { marconiRadioParallelReadings } from "./marconiRadioEdition";
import { maximMachineGunParallelReadings } from "./maximMachineGunEdition";
import { mccormickReaperParallelReadings } from "./mccormickReaperEdition";
import { mergenthalerLinotypeParallelReadings } from "./mergenthalerLinotypeEdition";
import { morseTelegraphParallelReadings } from "./morseTelegraphEdition";
import { nobelDynamiteParallelReadings } from "./nobelDynamiteEdition";
import { noyceIcParallelReadings } from "./noyceIcEdition";
import { otisElevatorParallelReadings } from "./otisElevatorParallelReading";
import { ottoEngineParallelReadings } from "./ottoEngineEdition";
import { parsonsTurbineParallelReadings } from "./parsonsTurbineEdition";
import { pasteurFermentationParallelReadings } from "./pasteurFermentationParallelReading";
import { peltonWaterWheelParallelReadings } from "./peltonWaterWheelEdition";
import { renoEscalatorParallelReadings } from "./renoEscalatorEdition";
import { sholesTypewriterParallelReadings } from "./sholesTypewriterEdition";
import { spencerMicrowaveParallelReadings } from "./spencerMicrowaveEdition";
import { teslaCoil593138ParallelReadings } from "./teslaCoil593138Edition";
import { teslaMotorParallelReadings } from "./teslaMotorEdition";
import { teslaTeleautomatonParallelReadings } from "./teslaTeleautomatonEdition";
import { thomsonWeldingParallelReadings } from "./thomsonWeldingEdition";
import { HOWE_SEWING_MACHINE_PARALLEL_READINGS } from "./us-4750-howe-sewing-machine";
import { DAIMLER_MARINE_ENGINE_PARALLEL_READINGS } from "./us-361931-daimler-engine";
import { westinghouseAirBrakeParallelReadings } from "./westinghouseAirBrakeEdition";
import { whitneyCottonGinParallelReadings } from "./whitneyCottonGinEdition";
import { wozniakAppleParallelReadings } from "./wozniakAppleEdition";
import { zeppelinAirshipParallelReadings } from "./zeppelinAirshipEdition";

export type ArchivalParallelReading = readonly string[];

export const ARCHIVAL_PARALLEL_READINGS: Readonly<
  Record<string, Readonly<Record<number, readonly string[]>>>
> = {
  "us-x72-whitney-cotton-gin": whitneyCottonGinParallelReadings,
  "us-x8277-mccormick-reaper": mccormickReaperParallelReadings,
  "us-x9430-colt-revolver": coltRevolverParallelReadings,
  "us-132-davenport-electric-motor": davenportElectricMotorParallelReadings,
  "us-588-ericsson-propeller": ericssonPropellerParallelReadings,
  "us-1647-morse-telegraph": morseTelegraphParallelReadings,
  "us-3633-goodyear-rubber": goodyearRubberParallelReadings,
  "us-4750-howe-sewing-machine": HOWE_SEWING_MACHINE_PARALLEL_READINGS,
  "us-6162-corliss-steam-engine": corlissSteamEngineParallelReadings,
  "us-6469-lincoln-buoy": lincolnBuoyParallelReadings,
  "us-31128-otis-elevator": otisElevatorParallelReadings,
  "us-36836-gatling-gun": gatlingGunParallelReadings,
  "us-78317-nobel-dynamite": nobelDynamiteParallelReadings,
  "us-79265-sholes-typewriter": sholesTypewriterParallelReadings,
  "us-105338-hyatt-celluloid": hyattCelluloidParallelReadings,
  "us-120057-gramme-dynamo": grammeDynamoParallelReadings,
  "us-124404-westinghouse-air-brake": westinghouseAirBrakeParallelReadings,
  "us-135245-pasteur-fermentation": pasteurFermentationParallelReadings,
  "us-157124-glidden-barbed-wire": gliddenBarbedWireParallelReadings,
  "us-174465-bell-telephone": bellTelephoneParallelReadings,
  "us-194047-otto-engine": ottoEngineParallelReadings,
  "us-200521-edison-phonograph": edisonPhonographParallelReadings,
  "us-223898-edison-lightbulb": edisonLightbulbParallelReadings,
  "us-233692-pelton-water-wheel": peltonWaterWheelParallelReadings,
  "us-247804-delaval-separator": delavalSeparatorParallelReadings,
  "us-313224-mergenthaler-linotype": mergenthalerLinotypeParallelReadings,
  "us-319596-maxim-machine-gun": maximMachineGunParallelReadings,
  "us-347140-thomson-welding": thomsonWeldingParallelReadings,
  "us-361931-daimler-engine": DAIMLER_MARINE_ENGINE_PARALLEL_READINGS,
  "us-381968-tesla-motor": teslaMotorParallelReadings,
  "us-388850-eastman-kodak": eastmanKodakParallelReadings,
  "us-395781-hollerith-tabulating": hollerithTabulatingParallelReadings,
  "us-470918-reno-escalator": renoEscalatorParallelReadings,
  "us-542846-diesel-engine": dieselEngineParallelReadings,
  "us-586193-marconi-radio": marconiRadioParallelReadings,
  "us-593138-tesla-coil": teslaCoil593138ParallelReadings,
  "us-608969-parsons-turbine": parsonsTurbineParallelReadings,
  "us-613809-tesla-teleautomaton": teslaTeleautomatonParallelReadings,
  "us-621195-zeppelin-airship": zeppelinAirshipParallelReadings,
  "us-727650-linde-air-liquefaction": lindeAirLiquefactionParallelReadings,
  "us-808897-carrier-air-conditioner": carrierAirConditionerParallelReadings,
  "us-1102653-goddard-rocket": goddardRocketParallelReadings,
  "us-1773980-farnsworth-tv": farnsworthTvParallelReadings,
  "us-1781541-einstein-refrigerator": einsteinRefrigeratorParallelReadings,
  "us-2292387-lamarr-frequency-hopping": lamarrFrequencyHoppingParallelReadings,
  "us-2495429-spencer-microwave": spencerMicrowaveParallelReadings,
  "us-2524035-bardeen-transistor": bardeenTransistorParallelReadings,
  "us-2708656-fermi-reactor": fermiReactorParallelReadings,
  "us-2981877-noyce-ic": noyceIcParallelReadings,
  "us-3541541-engelbart-mouse": engelbartMouseParallelReadings,
  "us-3671542-kwolek-kevlar": kwolekKevlarParallelReadings,
  "us-3858232-boyle-smith-ccd": boyleSmithCcdParallelReadings,
  "us-4136359-wozniak-apple": wozniakAppleParallelReadings,

  "us-821393-wright-flyer": {
    4: [
      "This is the standard public notice at the start of a United States patent. It addresses any reader who may need to know what the inventors claim to have made.",
    ],
    5: [
      "The inventors establish their names, citizenship, and residence in Dayton, Ohio. They state they have invented new and useful improvements in flying-machines.",
      "The rest of the document is the legal specification: a description detailed enough to explain the apparatus and the boundaries of the invention claimed at the end.",
    ],
    6: [
      "The patent concerns a machine supported by aerodynamic force. One or more wing surfaces move edgewise through the air at a small angle, so the air exerts an upward reaction on them.",
      "The forward motion can come from mechanical power, such as an engine and propellers, or from gravity while a machine glides downward and forward. The control system is intended to work in either case.",
    ],
    7: [
      "The Wrights list four design jobs: preserve or restore lateral balance, guide the machine vertically, guide it horizontally, and build the structure with low weight, adequate strength, and practical construction.",
      "“Lateral balance” means preventing one side of the aircraft from falling while the other rises. Vertical guidance concerns pitch and climb or descent; horizontal guidance concerns the direction of travel.",
    ],
    8: [
      "They will first describe the physical features they consider new. After the description, the numbered claims will define the legal combinations for which they seek protection.",
    ],
    9: [
      "Figure 1 gives a perspective view of one form of the apparatus. Figure 2 gives a plan view, partly cut in horizontal section and partly broken away so internal relationships can be seen.",
      "Figure 3 is a side elevation. Figures 4 and 5 enlarge one flexible joint used between an upright standard and an aeroplane. The figure links open the corresponding primary facsimile, rather than a reconstructed drawing.",
    ],
    10: [
      "A flying machine of this kind stays aloft because moving air presses against the underside of one or more aeroplanes presented at a small angle of incidence. Relative airflow can come from a headwind while the craft travels, from a combined forward-and-downward glide from altitude, or from engine-driven forward motion.",
      "In each case the wing can support the machine, but the conditions are variable. Wind pressure, changes of speed, and other disturbances can move the machine away from the attitude and path that produce the desired result.",
      "Their main object is a mechanism that remedies those shifts. The following construction explains how the airframe and controls supply that correction.",
    ],
    11: [
      "The description begins with the main supporting surfaces: a superposed pair of flexible fabric wings arranged in a biplane truss, although the inventors note that a single wing surface can also embody the control principle.",
      "Letters a, b, c, and d name the four corners of the upper wing; e, f, g, and h name the matching corners of the lower wing. The text then identifies the front, side, and rear edges by those letter pairs. Those names matter because the cable system moves particular corners and margins rather than moving a generic wing surface.",
    ],
    12: [
      "Before describing the control action, the Wrights describe how the two aeroplanes are made and how they are joined. The construction must permit controlled twisting while keeping the two wing surfaces connected.",
    ],
    13: [
      "Each aeroplane has two transverse spars, numbered 3, that run across the machine. Bows 4 connect their ends from front to rear. A series of parallel ribs 5 connects the front and rear spars and extends somewhat beyond the rear spar. The Wrights prefer wood because it combines strength, lightness, and flexibility.",
      "Fabric forms the supporting surface over that framework. Before attaching it, they cut the cloth on the bias and make it into one piece roughly the size and shape of the aeroplane. Its threads then run diagonally across the transverse spars and longitudinal ribs, as shown at 6 in Figure 2. The diagonal threads act as the diagonal members of a truss with the spars and ribs.",
      "A hem at the rear edge contains wire 7. The wire connects to the rear spar ends and to the rearward ends of the ribs, creating a rearward flexible flap. The resulting surface resists lateral and longitudinal loads yet can bend or twist as the control method requires.",
    ],
    14: [
      "With two aeroplanes, upright standards 8 connect their edges. The standards are substantially rigid wood members of equal length, equally spaced along the front and rear edges. Hinged or universal joints at their upper and lower ends connect them to the aeroplanes, so the wings can twist while the standards keep their separation.",
      "Figures 4 and 5 show one possible joint. Each end of a standard has an eye 9 that engages hook 10 on bracket-plate 11, which is fastened to spar 3. Diagonal stay-wires 12 run from each standard end to the opposite ends of neighboring standards. A second hook 13 receives one wire, while hook 10 carries the other; the bent hook and pin 14 retain the wires and eye in position.",
      "These crossed wires form a truss that gives the whole machine transverse stiffness and strength. The jointed connections still allow the aeroplanes to bend or twist in the next operation.",
    ],
    15: [
      "The description continues with the forward elevator or horizontal rudder used for pitch control.",
      "The elevator is carried on forward outriggers and pivoted so the pilot can tilt its angle of incidence up or down with a hand lever.",
    ],
    16: [
      "Next they describe the vertical rear rudder used for directional yaw control.",
      "The vertical rudder is mounted on rearward outriggers and linked to the wing-warping system so yaw and roll are coordinated automatically.",
    ],
    17: [
      "The inventors explain the pilot's operating station: a sliding hip cradle mounted on the lower wing center section.",
      "By shifting their hips sideways in the cradle, the pilot pulls cables that twist the wing tips in opposite directions and simultaneously swings the rear rudder toward the high-drag wing.",
    ],
    18: [
      "The described cable geometry twists each aeroplane around a line that crosses the wing near the middle of its side margins. It gives the surface a helicoidal warp: its angle changes gradually from the central longitudinal line toward each side, rather than kinking at one point.",
      "The Wrights prefer that continuous surface because each side gains or loses incidence gradually from the center outward. They expressly say the invention is broader than this exact construction. Any arrangement that changes the angular relation of the two lateral margins in opposite directions can fall within the principle.",
      "They also distinguish angles relative to the wing's normal plane from heights relative to a horizontal plane. In flight the aeroplanes normally slope downward from front to rear, so a margin moved below its normal plane need not end below horizontal. Equal and opposite movement of both sides is preferred, but the invention also covers moving one side without an equal opposite movement on the other.",
    ],
    19: [
      "Wind pressure and other causes can make the machine roll, with one side sinking and the other rising about the longitudinal axis. The operator uses the cable arrangement to restore lateral balance.",
      "If the side left of an observer in Figures 1 and 2 begins to fall, moving cradle 18 right sets margins a-d and e-h at a larger angle of incidence than the opposite margins. The higher-incidence side meets the resisting air at a greater angle and tends to lift upward, restoring balance. Moving the cradle the other way corrects a fall on the other side.",
      "The same aerodynamic effect applies to a machine with one aeroplane. The paired biplane structure is an illustrated form, not a requirement for the balancing principle.",
    ],
    20: [
      "The rear vertical rudder, or tail 22, turns about a vertical axis. It sits at the rear of arms 23 whose forward ends pivot on the rear margins of the upper and lower aeroplanes. The arms are preferably V-shaped, with widely spaced front pivots 24, and can swing upward at their rear ends as Figure 3 shows. A stop limits their downward movement.",
      "Vertical pivots 25 support the rudder. One carries pulley 26, around which tiller-rope 27 passes. The rope ends attach to opposite sides of rope 19, so shifting cradle 18 also turns the rudder to one side of the line of flight.",
      "A warped side at greater incidence gains lift but also meets more forward resistance. It lags; the lower-resistance side advances, producing a yaw that can turn the craft about a vertical axis and eventually leave one wing below the other. The linked rudder faces the lower-resistance side and retards that faster side, keeping the nose aligned with the path and the body balanced. The upward-swinging arms let the rudder yield if it reaches the ground first, reducing breakage.",
    ],
    21: [
      "Struts 28 project forward horizontally from the lower aeroplane. Struts 29 project downward and forward from the upper aeroplane and join 28 at their front ends, which turn upward at 30. Together they form truss-skids ahead of the frame to prevent a forward rollover on landing.",
      "The upper part of the machine has inertia after the lower part stops against the ground. Struts 29 brace it against continuing forward motion, which otherwise would put a violent load on rope 19 because that rope connects upper and lower portions through its guides. The same struts carry the front horizontal rudder described next.",
    ],
    22: [
      "Front rudder 31 is a horizontal, flexible control surface. Three stiff crosspieces 32, 33, and 34, joined by flexible longitudinal ribs 35, make its frame; fabric covers it. Crosspiece 32 attaches to struts 29 near the center of pressure, slightly ahead of the midpoint between the front and rear edges, and forms the pivot axis of a balanced rudder.",
      "Springs 36 connect the front edge to upturned strut ends 30 and resist upward or downward movement at that edge. The pilot moves the rear edge through roller 37, bands 38, forward roller 39, arms 40, and links 41. In its neutral position the rudder is roughly parallel to aeroplanes 1 and 2.",
      "Raising or lowering the rear edge bends ribs 35 while the springs restrain the front. The surface becomes concave above or below its normal plane: incidence is small at the front and increases rapidly toward the rear. That curvature makes the surface more effective than a flat plane of equal area. Changing pressure on its upper and lower surfaces turns the main frame about its transverse axis, letting the pilot direct the craft upward or downward and maintain longitudinal balance.",
    ],
    23: [
      "The Wrights put the horizontal rudder in front of the aeroplanes at a negative angle and use no horizontal tail. In ordinary flight that front surface has little pressure on it. If speed falls far below normal, it becomes a useful lifting surface even without a control movement.",
      "They say this lift counteracts the rearward shift of the center of pressure on the main aeroplanes, a shift that could pitch a machine downward and forward into the ground. They acknowledge earlier forward horizontal rudders used with both a supporting surface and a rear horizontal rudder, but say those arrangements did not achieve this particular protective effect.",
    ],
    24: [
      "For this specification and its claims, “aeroplane” means the supporting surface or surfaces that sustain the machine in air. It can be any suitable normally flat supporting surface; the term does not require a complete powered aircraft.",
      "The preferred cloth-covered surfaces may curve somewhat under air resistance. That incidental curvature does not take them outside the definition.",
    ],
    25: [
      "The Wrights reserve the right to vary the construction details shown in the drawings. Their biplane may twist along its full length, but they say the principle needs only the movable lateral portions. If only those portions move, only the standards supporting those portions need flexible end connections.",
    ],
    26: [
      "The description is complete. What follows are the numbered claims, the part of the patent that states the combinations the Wrights ask the government to protect.",
    ],
    45: [
      "Orville Wright and Wilbur Wright sign the completed specification. Their signatures adopt the description and claims as the inventors' statement to the Patent Office.",
    ],
    46: [
      "Charles E. Taylor and E. Earle Forrer are listed as witnesses to the signing. Their names document execution of the instrument; they do not identify additional inventors or technical features.",
    ],
  },
};

export function archivalParallelReadingsFor(
  patentId: string,
): Readonly<Record<number, readonly string[]>> {
  const reading = ARCHIVAL_PARALLEL_READINGS[patentId];
  if (!reading) {
    throw new Error(`No hand-authored archival parallel reading is published for ${patentId}.`);
  }
  return reading;
}
