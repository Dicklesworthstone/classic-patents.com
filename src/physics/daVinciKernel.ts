export interface DaVinciControls {
  motionScaleRatio: number; // illustrative calibration-offset control
  tremorFilterEnabled: boolean; // compatibility signal presence probe
  masterInputSpeedMps: number; // illustrative drive trajectory speed
  gripAngleDeg: number; // illustrative end-effector angle [0..60] deg
  /** Optional custom cup initial / target position [x, y, z] */
  cupInitialPos?: [number, number, number];
}

export const DA_VINCI_DEFAULT_CONTROLS = {
  motionScaleRatio: 3,
  tremorFilterEnabled: true,
  masterInputSpeedMps: 0.5,
  gripAngleDeg: 30,
} as const satisfies DaVinciControls;

export const DA_VINCI_CUP_RADIUS_M = 0.075;
export const DA_VINCI_CUP_HEIGHT_M = 0.13;
export const DA_VINCI_END_EFFECTOR_RADIUS_M = 0.024;
export const DA_VINCI_TABLE_SURFACE_Y_M = -0.15;
export const DA_VINCI_MODEL_BASE_HEIGHT_M = 0.65;

export interface DaVinciControlParams {
  motionScaleRatio?: number;
  tremorFilterEnabled?: number | boolean;
  masterInputSpeedMps?: number;
  gripAngleDeg?: number;
}

function finiteOr(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/**
 * Read the public parameter bus into the one canonical control shape consumed
 * by the engine, registry, and both visual projections.
 */
export function readDaVinciControls(params: DaVinciControlParams): DaVinciControls {
  const filterValue = params.tremorFilterEnabled ?? DA_VINCI_DEFAULT_CONTROLS.tremorFilterEnabled;
  const motionScaleRatio = finiteOr(
    params.motionScaleRatio,
    DA_VINCI_DEFAULT_CONTROLS.motionScaleRatio,
  );
  const masterInputSpeedMps = finiteOr(
    params.masterInputSpeedMps,
    DA_VINCI_DEFAULT_CONTROLS.masterInputSpeedMps,
  );
  const gripAngleDeg = finiteOr(params.gripAngleDeg, DA_VINCI_DEFAULT_CONTROLS.gripAngleDeg);
  return {
    motionScaleRatio: Math.max(1, Math.min(10, motionScaleRatio)),
    tremorFilterEnabled: typeof filterValue === "boolean" ? filterValue : filterValue > 0.5,
    masterInputSpeedMps: Math.max(0.2, Math.min(1.5, masterInputSpeedMps)),
    gripAngleDeg: Math.max(0, Math.min(60, gripAngleDeg)),
  };
}

export interface DaVinciObstacle {
  id: string;
  type: "cup" | "block" | "table" | "trocar";
  x: number;
  y: number;
  z: number;
  radius: number;
  height: number;
}

export interface DaVinciState {
  masterX: number;
  masterY: number;
  masterZ: number;
  slaveX: number;
  slaveY: number;
  slaveZ: number;
  baseYawRad: number;
  shoulderPitchRad: number;
  elbowPitchRad: number;
  wristPitchRad: number;
  wristYawRad: number;
  wristRollRad: number;
  gripRad: number;
  compatibilitySignalPercent: number;
  tipVelocityMms: number;

  // Contact resolution and grasping telemetry.
  /** Resolved end-effector tip position in world space (prevented from clipping) */
  tipX: number;
  tipY: number;
  tipZ: number;
  /** Dynamic Coffee Cup / Specimen Object physical position */
  cupX: number;
  cupY: number;
  cupZ: number;
  cupVx: number;
  cupVy: number;
  cupVz: number;
  cupRotY: number;
  /** Collision detection flags & contact mechanics */
  isColliding: boolean;
  isCupContact: boolean;
  isTableContact: boolean;
  isGrasped: boolean;
  contactPointX: number;
  contactPointY: number;
  contactPointZ: number;
  contactNormalX: number;
  contactNormalY: number;
  contactNormalZ: number;
  contactForceN: number;
  penetrationDepthMm: number;
  obstacleDistanceMm: number;
}

// Physical constants for the illustrative robotic-tool contact model.
const CUP_MASS_KG = 0.28; // 280 grams ceramic cup
const STATIC_FRICTION_COEFF = 0.42;
const DYNAMIC_FRICTION_COEFF = 0.28;
const CONTACT_STIFFNESS_N_M = 1800; // 1.8 kN/m contact penalty stiffness

export function stepDaVinci(
  c: DaVinciControls,
  timeSec: number,
  prevState?: DaVinciState,
  dtSec = 1 / 60,
): DaVinciState {
  const dt = Math.max(0.001, Math.min(0.1, dtSec));
  const controls = readDaVinciControls(c);
  const scale = controls.motionScaleRatio;
  const speed = controls.masterInputSpeedMps;

  // 1. Master Console Surgeon Input Trajectory
  const rawMasterX = 0.35 * Math.cos(timeSec * speed * 1.8);
  const rawMasterY = 0.22 * Math.sin(timeSec * speed * 3.6);
  const rawMasterZ = 0.18 * Math.sin(timeSec * speed * 1.4);

  // Deterministic presentation tremor
  const interfaceNoiseFreq = 3.0 * 2.0 * Math.PI;
  const interfaceNoiseAmp = 0.015;
  const masterNoiseX = Math.sin(timeSec * interfaceNoiseFreq) * interfaceNoiseAmp;
  const masterNoiseY = Math.cos(timeSec * interfaceNoiseFreq * 1.1) * interfaceNoiseAmp;
  const masterNoiseZ = Math.sin(timeSec * interfaceNoiseFreq * 0.9) * interfaceNoiseAmp;

  const masterX = rawMasterX + masterNoiseX;
  const masterY = rawMasterY + masterNoiseY;
  const masterZ = rawMasterZ + masterNoiseZ;

  // 2. Kinematic Teleoperation Scaling & Tremor Filtering
  const targetX = controls.tremorFilterEnabled ? rawMasterX / scale : masterX / scale;
  const targetY = controls.tremorFilterEnabled ? rawMasterY / scale : masterY / scale;
  const targetZ = controls.tremorFilterEnabled ? rawMasterZ / scale : masterZ / scale;

  const referenceSmoothing = controls.tremorFilterEnabled ? 0.2 : 0.8;
  const smoothing = 1 - (1 - referenceSmoothing) ** (dt / (1 / 60));
  const prevSlaveX = prevState ? prevState.slaveX : targetX;
  const prevSlaveY = prevState ? prevState.slaveY : targetY;
  const prevSlaveZ = prevState ? prevState.slaveZ : targetZ;

  const slaveX = prevSlaveX + (targetX - prevSlaveX) * smoothing;
  const slaveY = prevSlaveY + (targetY - prevSlaveY) * smoothing;
  const slaveZ = prevSlaveZ + (targetZ - prevSlaveZ) * smoothing;

  const baseYawRad = Math.atan2(slaveX, slaveZ + 1.5);
  const r = Math.sqrt(slaveX * slaveX + (slaveZ + 1.5) * (slaveZ + 1.5));
  const shoulderPitchRad = -0.3 + slaveY * 0.8;
  const elbowPitchRad = 0.4 + r * 0.2;

  const wristPitchRad = Math.sin(timeSec * 1.5) * 0.45;
  const wristYawRad = Math.cos(timeSec * 1.2) * 0.35;
  const wristRollRad = (timeSec * 2.0) % (Math.PI * 2);
  const gripRad = (controls.gripAngleDeg * Math.PI) / 180;

  // 3. Compute Unconstrained Forward Kinematics for End-Effector Tip
  // Base carriage is at (slaveX, slaveY, slaveZ).
  // Relative to base: wrist pitch is at -0.42, yaw at -0.065, roll at -0.055, jaws at -0.22 => tip local Y = -0.76m.
  // Base nominal height is +0.65m, so tip world Y = slaveY + 0.65 - 0.76 = slaveY - 0.11m (right above table at -0.15m).
  const rawTipX = slaveX + Math.sin(baseYawRad) * 0.15 + Math.sin(wristYawRad) * 0.06;
  const rawTipY =
    slaveY - 0.11 + Math.sin(shoulderPitchRad) * 0.12 + Math.sin(wristPitchRad) * 0.06;
  const rawTipZ = slaveZ + Math.cos(baseYawRad) * 0.22 + Math.cos(wristPitchRad) * 0.06;

  // 4. State Tracking for Coffee Cup & Manipulation Object
  let cupX = prevState ? prevState.cupX : finiteOr(c.cupInitialPos?.[0], 0.22);
  let cupY = prevState
    ? prevState.cupY
    : finiteOr(c.cupInitialPos?.[1], DA_VINCI_TABLE_SURFACE_Y_M);
  let cupZ = prevState ? prevState.cupZ : finiteOr(c.cupInitialPos?.[2], 0.32);
  let cupVx = prevState ? prevState.cupVx : 0;
  let cupVy = prevState ? prevState.cupVy : 0;
  let cupVz = prevState ? prevState.cupVz : 0;
  let cupRotY = prevState ? prevState.cupRotY : 0;
  let isGrasped = prevState ? prevState.isGrasped : false;

  // 5. Cylinder-distance and contact tests.
  const dx = rawTipX - cupX;
  const dz = rawTipZ - cupZ;
  const distHoriz = Math.sqrt(dx * dx + dz * dz);
  const cupTopY = cupY + DA_VINCI_CUP_HEIGHT_M;
  const cupBottomY = cupY;

  // Signed distance to the coffee cup cylinder
  const radialDist = distHoriz - DA_VINCI_CUP_RADIUS_M;
  const verticalDist =
    rawTipY < cupBottomY ? cupBottomY - rawTipY : rawTipY > cupTopY ? rawTipY - cupTopY : 0;
  const obstacleDistanceMm = Math.max(
    0,
    Math.sqrt(Math.max(0, radialDist) ** 2 + verticalDist ** 2) * 1000,
  );

  // Grasp verification: jaws closed around cup rim or handle
  const isNearRim =
    Math.abs(rawTipY - cupTopY) < 0.06 && Math.abs(distHoriz - DA_VINCI_CUP_RADIUS_M) < 0.05;
  const isGripClosed = controls.gripAngleDeg < 16;
  const isGripOpen = controls.gripAngleDeg > 22;

  if (isNearRim && isGripClosed) {
    isGrasped = true;
  } else if (isGripOpen) {
    isGrasped = false;
  }

  let isCupContact = false;
  let isTableContact = false;
  let contactForceN = 0;
  let penetrationDepthMm = 0;
  let contactNormalX = 0;
  let contactNormalY = 0;
  let contactNormalZ = 0;
  let contactPointX = rawTipX;
  let contactPointY = rawTipY;
  let contactPointZ = rawTipZ;

  let tipX = rawTipX;
  let tipY = rawTipY;
  let tipZ = rawTipZ;

  if (isGrasped) {
    const carriedCupBottomOffsetM = DA_VINCI_CUP_HEIGHT_M * 0.85;
    const minTableY = DA_VINCI_TABLE_SURFACE_Y_M + carriedCupBottomOffsetM;
    if (tipY < minTableY) {
      isTableContact = true;
      const tableOverlap = minTableY - tipY;
      tipY = minTableY;
      contactForceN = tableOverlap * CONTACT_STIFFNESS_N_M;
      penetrationDepthMm = tableOverlap * 1000;
      contactNormalY = 1;
      contactPointX = tipX - Math.sin(wristYawRad) * (DA_VINCI_CUP_RADIUS_M * 0.7);
      contactPointY = DA_VINCI_TABLE_SURFACE_Y_M;
      contactPointZ = tipZ - Math.cos(wristYawRad) * (DA_VINCI_CUP_RADIUS_M * 0.7);
    }

    // Rigid body attachment: cup follows end-effector
    cupX = tipX - Math.sin(wristYawRad) * (DA_VINCI_CUP_RADIUS_M * 0.7);
    cupY = tipY - carriedCupBottomOffsetM;
    cupZ = tipZ - Math.cos(wristYawRad) * (DA_VINCI_CUP_RADIUS_M * 0.7);
    cupVx = 0;
    cupVy = 0;
    cupVz = 0;
    cupRotY = wristRollRad;
  } else {
    // 6. Collision Resolution & Anti-Clipping Projection against Coffee Cup
    const minRequiredDist = DA_VINCI_CUP_RADIUS_M + DA_VINCI_END_EFFECTOR_RADIUS_M;
    const isInsideVerticalSpan = rawTipY >= cupBottomY - 0.02 && rawTipY <= cupTopY + 0.02;

    if (distHoriz < minRequiredDist && isInsideVerticalSpan) {
      isCupContact = true;
      const overlap = minRequiredDist - distHoriz;
      penetrationDepthMm = overlap * 1000;

      const normX = distHoriz > 1e-4 ? dx / distHoriz : 1;
      const normZ = distHoriz > 1e-4 ? dz / distHoriz : 0;

      contactNormalX = normX;
      contactNormalY = 0;
      contactNormalZ = normZ;

      // Contact point on cup surface
      contactPointX = cupX + normX * DA_VINCI_CUP_RADIUS_M;
      contactPointY = Math.max(cupBottomY, Math.min(cupTopY, rawTipY));
      contactPointZ = cupZ + normZ * DA_VINCI_CUP_RADIUS_M;

      // Project the end-effector contact sphere outside the cup cylinder.
      tipX = cupX + normX * minRequiredDist;
      tipZ = cupZ + normZ * minRequiredDist;

      // Contact force calculation
      contactForceN = overlap * CONTACT_STIFFNESS_N_M;

      // Push the cup when the resolved contact exceeds static friction.
      const normalForce = Math.max(0.5, contactForceN);
      const maxStaticFrictionForce = STATIC_FRICTION_COEFF * CUP_MASS_KG * 9.81;

      if (normalForce > maxStaticFrictionForce) {
        // Dynamic push impulse in opposite direction of contact normal
        const pushForce = normalForce - maxStaticFrictionForce;
        const pushAccX = (-normX * pushForce) / CUP_MASS_KG;
        const pushAccZ = (-normZ * pushForce) / CUP_MASS_KG;

        cupVx += pushAccX * dt;
        cupVz += pushAccZ * dt;
      }
    }

    // 7. Table Surface Collision Resolution (Prevents clipping through the table/sterile drape)
    const minTableY = DA_VINCI_TABLE_SURFACE_Y_M + DA_VINCI_END_EFFECTOR_RADIUS_M;
    if (tipY < minTableY) {
      isTableContact = true;
      const tableOverlap = minTableY - tipY;
      tipY = minTableY; // Project onto table top
      contactForceN = Math.max(contactForceN, tableOverlap * CONTACT_STIFFNESS_N_M);
      penetrationDepthMm = Math.max(penetrationDepthMm, tableOverlap * 1000);
      if (!isCupContact) {
        contactNormalX = 0;
        contactNormalY = 1;
        contactNormalZ = 0;
        contactPointX = tipX;
        contactPointY = DA_VINCI_TABLE_SURFACE_Y_M;
        contactPointZ = tipZ;
      }
    }

    // 8. Cup Physics: Friction Damping, Inertia & Table Surface Boundary
    const speedHoriz = Math.sqrt(cupVx * cupVx + cupVz * cupVz);
    if (speedHoriz > 1e-4) {
      const frictionDecel = DYNAMIC_FRICTION_COEFF * 9.81;
      const nextSpeed = Math.max(0, speedHoriz - frictionDecel * dt);
      const ratio = nextSpeed / speedHoriz;
      cupVx *= ratio;
      cupVz *= ratio;
    } else {
      cupVx = 0;
      cupVz = 0;
    }

    // Gravity for the cup if elevated
    if (cupY > DA_VINCI_TABLE_SURFACE_Y_M) {
      cupVy -= 9.81 * dt;
    } else {
      cupVy = 0;
      cupY = DA_VINCI_TABLE_SURFACE_Y_M;
    }

    cupX += cupVx * dt;
    cupY = Math.max(DA_VINCI_TABLE_SURFACE_Y_M, cupY + cupVy * dt);
    cupZ += cupVz * dt;

    // Constrain cup to reachable surgical table perimeter
    cupX = Math.max(-1.4, Math.min(1.4, cupX));
    cupZ = Math.max(-1.2, Math.min(1.2, cupZ));
  }

  const prevTipX = prevState ? prevState.tipX : tipX;
  const prevTipY = prevState ? prevState.tipY : tipY;
  const prevTipZ = prevState ? prevState.tipZ : tipZ;

  const tipVelocityMms = Math.sqrt(
    (((tipX - prevTipX) / dt) * 1000) ** 2 +
      (((tipY - prevTipY) / dt) * 1000) ** 2 +
      (((tipZ - prevTipZ) / dt) * 1000) ** 2,
  );

  return {
    masterX,
    masterY,
    masterZ,
    slaveX,
    slaveY,
    slaveZ,
    baseYawRad,
    shoulderPitchRad,
    elbowPitchRad,
    wristPitchRad,
    wristYawRad,
    wristRollRad,
    gripRad,
    compatibilitySignalPercent: controls.tremorFilterEnabled ? 100.0 : 0.0,
    tipVelocityMms,

    // Collision & Anti-Clipping state
    tipX,
    tipY,
    tipZ,
    cupX,
    cupY,
    cupZ,
    cupVx,
    cupVy,
    cupVz,
    cupRotY,
    isColliding: isCupContact || isTableContact,
    isCupContact,
    isTableContact,
    isGrasped,
    contactPointX,
    contactPointY,
    contactPointZ,
    contactNormalX,
    contactNormalY,
    contactNormalZ,
    contactForceN,
    penetrationDepthMm,
    obstacleDistanceMm,
  };
}
