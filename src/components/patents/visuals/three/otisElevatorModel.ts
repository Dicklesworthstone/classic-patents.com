import * as THREE from "three";
import { otisSheaveCrate } from "@/physics/genericWasm";
import { stepOtisElevator } from "@/physics/machineKernels";

export interface OtisElevatorModelNodes {
  root: THREE.Group;
  hoistwayGroup: THREE.Group;
  leftPost: THREE.Mesh;
  rightPost: THREE.Mesh;
  topBeam: THREE.Mesh;
  crownSheave: THREE.Mesh;
  leftRackTeeth: THREE.Mesh[];
  rightRackTeeth: THREE.Mesh[];
  // Cab Carriage
  cabGroup: THREE.Group;
  cabPlatform: THREE.Mesh;
  cabRailings: THREE.Mesh;
  leftStile: THREE.Mesh;
  rightStile: THREE.Mesh;
  crossHeadBeam: THREE.Mesh;
  // Safety Mechanism (Claim 1 & Claim 2)
  leafSpringGroup: THREE.Group;
  springLeaves: THREE.Mesh[];
  springShackle: THREE.Mesh;
  leftPawlGroup: THREE.Group;
  rightPawlGroup: THREE.Group;
  leftPawl: THREE.Mesh;
  rightPawl: THREE.Mesh;
  leftLinkageRod: THREE.Mesh;
  rightLinkageRod: THREE.Mesh;
  // Hoisting Cable
  tautCable: THREE.Mesh;
  severedCableTop: THREE.Mesh;
  severedCableBottom: THREE.Mesh;
}

export interface OtisElevatorMaterials {
  agedTimberWood: THREE.MeshStandardMaterial;
  structuralIron: THREE.MeshStandardMaterial;
  temperedSpringSteel: THREE.MeshStandardMaterial;
  polishedBrass: THREE.MeshStandardMaterial;
  braidedHempRope: THREE.MeshStandardMaterial;
  frayedRopeEnd: THREE.MeshStandardMaterial;
}

export interface OtisElevatorModelResult {
  root: THREE.Group;
  nodes: OtisElevatorModelNodes;
  materials: OtisElevatorMaterials;
  dispose: () => void;
}

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Heavy American Yellow Pine Timber Texture
 */
function createPineTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#543d2b";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 85; i++) {
    const y = i * 6.0 + (deterministicUnit(i, 0) - 0.5) * 3;
    const alpha = 0.08 + (i % 4 === 0 ? 0.14 : 0.03);
    ctx.strokeStyle = `rgba(35, 20, 10, ${alpha})`;
    ctx.lineWidth = 1.3 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(160, y + 12, 340, y - 10, 512, y + 6);
    ctx.stroke();
  }

  for (let p = 0; p < 220; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(20, 10, 4, 0.28)";
    ctx.fillRect(px, py, 4 + deterministicUnit(p, 3) * 6, 1.8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const RACK_TOOTH_COUNT = 32;

export function buildOtisElevatorModel(): OtisElevatorModelResult {
  const root = new THREE.Group();
  const disposableGeometries: THREE.BufferGeometry[] = [];
  const disposableMaterials: THREE.Material[] = [];
  const disposableTextures: THREE.Texture[] = [];

  const pineTex = createPineTexture();
  if (pineTex) disposableTextures.push(pineTex);

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposableGeometries.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    disposableMaterials.push(mat);
    return mat;
  };

  // Authentic 1861 Elisha Otis Materials
  const materials: OtisElevatorMaterials = {
    agedTimberWood: trackMat(
      new THREE.MeshStandardMaterial({
        ...(pineTex ? { map: pineTex } : {}),
        color: 0x543d2b, // Heavy American yellow pine
        roughness: 0.8,
        metalness: 0.05,
      }),
    ),
    structuralIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x27272a, // Cast and wrought iron
        roughness: 0.45,
        metalness: 0.85,
      }),
    ),
    temperedSpringSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x71717a, // Oil-tempered laminated spring steel
        roughness: 0.25,
        metalness: 0.92,
      }),
    ),
    polishedBrass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd4af37, // Brass pivot bushings and shackle
        roughness: 0.22,
        metalness: 0.9,
      }),
    ),
    braidedHempRope: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x92400e, // Tarred Manila hemp rope
        roughness: 0.92,
        metalness: 0.0,
      }),
    ),
    frayedRopeEnd: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.95,
        metalness: 0.0,
      }),
    ),
  };

  // -------------------------------------------------------------
  // 1. Vertical Guide Frame with Notched Safety Racks (Claim 1)
  // -------------------------------------------------------------
  const hoistwayGroup = new THREE.Group();
  root.add(hoistwayGroup);

  const postSpacingX = 2.4;

  // Left & Right Heavy Pine Uprights
  const leftPost = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.55, 11.5, 0.55)),
    materials.agedTimberWood,
  );
  leftPost.position.set(-postSpacingX, 0, 0);
  leftPost.castShadow = true;
  hoistwayGroup.add(leftPost);

  const rightPost = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.55, 11.5, 0.55)),
    materials.agedTimberWood,
  );
  rightPost.position.set(postSpacingX, 0, 0);
  rightPost.castShadow = true;
  hoistwayGroup.add(rightPost);

  // Bottom Hoistway Timber Sill Foundation Beam & Pit Floor
  const bottomSill = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(6.2, 0.65, 3.8)),
    materials.agedTimberWood,
  );
  bottomSill.position.set(0, -5.75, 0);
  bottomSill.receiveShadow = true;
  hoistwayGroup.add(bottomSill);

  // Timber pit buffer stop blocks
  [-1.2, 1.2].forEach((bx) => {
    const buffer = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.6, 0.45, 0.6)),
      materials.structuralIron,
    );
    buffer.position.set(bx, -5.2, 0);
    buffer.castShadow = true;
    hoistwayGroup.add(buffer);
  });

  // Top Crown Header Crossbeam
  const topBeam = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.8, 0.65, 0.8)),
    materials.agedTimberWood,
  );
  topBeam.position.set(0, 5.6, 0);
  topBeam.castShadow = true;
  hoistwayGroup.add(topBeam);

  // Cast-Iron Crown Hoisting Sheave
  const crownSheave = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.75, 0.75, 0.22, 28)),
    materials.structuralIron,
  );
  crownSheave.rotation.x = Math.PI / 2;
  crownSheave.position.set(0, 5.6, 0);
  crownSheave.castShadow = true;
  hoistwayGroup.add(crownSheave);

  // Cast-Iron Safety Ratchet Racks along Guide Posts
  const leftRackTeeth: THREE.Mesh[] = [];
  const rightRackTeeth: THREE.Mesh[] = [];

  for (let i = 0; i < RACK_TOOTH_COUNT; i++) {
    const ty = -5.0 + i * 0.32;

    // Left Rack Tooth (Hooked downward/inward)
    const lTooth = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.12, 0.26, 4)),
      materials.structuralIron,
    );
    lTooth.rotation.z = -Math.PI / 2;
    lTooth.position.set(-postSpacingX + 0.32, ty, 0);
    lTooth.castShadow = true;
    hoistwayGroup.add(lTooth);
    leftRackTeeth.push(lTooth);

    // Right Rack Tooth
    const rTooth = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(0.12, 0.26, 4)),
      materials.structuralIron,
    );
    rTooth.rotation.z = Math.PI / 2;
    rTooth.position.set(postSpacingX - 0.32, ty, 0);
    rTooth.castShadow = true;
    hoistwayGroup.add(rTooth);
    rightRackTeeth.push(rTooth);
  }

  // -------------------------------------------------------------
  // 2. Elevator Cab / Carriage Assembly
  // -------------------------------------------------------------
  const cabGroup = new THREE.Group();
  root.add(cabGroup);

  // Timber Floor Platform
  const cabPlatform = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.0, 0.28, 3.4)),
    materials.agedTimberWood,
  );
  cabPlatform.position.set(0, -1.6, 0);
  cabPlatform.castShadow = true;
  cabPlatform.receiveShadow = true;
  cabGroup.add(cabPlatform);

  // Protective Perimeter Balustrade / Railings
  const cabRailings = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.8, 1.4, 3.2)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x3f2e1e,
        roughness: 0.7,
        wireframe: true,
      }),
    ),
  );
  cabRailings.position.set(0, -0.8, 0);
  cabGroup.add(cabRailings);

  // Vertical Carriage Stiles (Side Timber Uprights)
  const leftStile = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.24, 3.8, 0.35)),
    materials.agedTimberWood,
  );
  leftStile.position.set(-1.85, 0.2, 0);
  leftStile.castShadow = true;
  cabGroup.add(leftStile);

  const rightStile = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.24, 3.8, 0.35)),
    materials.agedTimberWood,
  );
  rightStile.position.set(1.85, 0.2, 0);
  rightStile.castShadow = true;
  cabGroup.add(rightStile);

  // Top Cross-Head Draw-Bar Beam
  const crossHeadBeam = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.2, 0.38, 0.45)),
    materials.agedTimberWood,
  );
  crossHeadBeam.position.set(0, 2.0, 0);
  crossHeadBeam.castShadow = true;
  cabGroup.add(crossHeadBeam);

  // -------------------------------------------------------------
  // 3. Multi-Leaf Laminated Wagon Spring (Claim 2)
  // -------------------------------------------------------------
  const leafSpringGroup = new THREE.Group();
  leafSpringGroup.position.set(0, 2.35, 0);
  cabGroup.add(leafSpringGroup);

  const springLeaves: THREE.Mesh[] = [];
  const leafSpans = [3.2, 2.5, 1.8, 1.1];

  leafSpans.forEach((span, idx) => {
    const leaf = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(span, 0.055, 0.22)),
      materials.temperedSpringSteel,
    );
    leaf.position.set(0, idx * 0.06, 0);
    leaf.castShadow = true;
    leafSpringGroup.add(leaf);
    springLeaves.push(leaf);
  });

  // Central Hoist Shackle & Clevis Eye
  const springShackle = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.2, 0.045, 10, 24)),
    materials.polishedBrass,
  );
  springShackle.rotation.x = Math.PI / 2;
  springShackle.position.set(0, 0.35, 0);
  leafSpringGroup.add(springShackle);

  // -------------------------------------------------------------
  // 4. Pivoted Hardened Steel Safety Pawls / Dogs (Claim 1)
  // -------------------------------------------------------------
  const leftPawlGroup = new THREE.Group();
  leftPawlGroup.position.set(-1.85, 1.9, 0);
  cabGroup.add(leftPawlGroup);

  const leftPawl = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.14, 0.48, 4)),
    materials.structuralIron,
  );
  leftPawl.rotation.z = -Math.PI / 3;
  leftPawl.position.set(-0.15, 0, 0);
  leftPawl.castShadow = true;
  leftPawlGroup.add(leftPawl);

  const rightPawlGroup = new THREE.Group();
  rightPawlGroup.position.set(1.85, 1.9, 0);
  cabGroup.add(rightPawlGroup);

  const rightPawl = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.14, 0.48, 4)),
    materials.structuralIron,
  );
  rightPawl.rotation.z = Math.PI / 3;
  rightPawl.position.set(0.15, 0, 0);
  rightPawl.castShadow = true;
  rightPawlGroup.add(rightPawl);

  // Connecting Linkage Rods between Leaf Spring Ends & Pawls
  const leftLinkageRod = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12)),
    materials.temperedSpringSteel,
  );
  leftLinkageRod.position.set(-1.6, 2.15, 0);
  leftLinkageRod.rotation.z = 0.2;
  cabGroup.add(leftLinkageRod);

  const rightLinkageRod = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12)),
    materials.temperedSpringSteel,
  );
  rightLinkageRod.position.set(1.6, 2.15, 0);
  rightLinkageRod.rotation.z = -0.2;
  cabGroup.add(rightLinkageRod);

  // -------------------------------------------------------------
  // 5. Hoisting Rope Assembly (Taut vs Severed)
  // -------------------------------------------------------------
  const tautCable = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 3.2, 12)),
    materials.braidedHempRope,
  );
  tautCable.position.set(0, 4.15, 0);
  root.add(tautCable);

  // Severed Frayed Cable Ends
  const severedCableTop = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.05, 0.07, 1.1, 10)),
    materials.frayedRopeEnd,
  );
  severedCableTop.position.set(0, 5.0, 0);
  severedCableTop.rotation.z = 0.15;
  severedCableTop.visible = false;
  root.add(severedCableTop);

  const severedCableBottom = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.07, 0.05, 0.9, 10)),
    materials.frayedRopeEnd,
  );
  severedCableBottom.position.set(0, 3.1, 0);
  severedCableBottom.rotation.z = -0.25;
  severedCableBottom.visible = false;
  cabGroup.add(severedCableBottom);

  const nodes: OtisElevatorModelNodes = {
    root,
    hoistwayGroup,
    leftPost,
    rightPost,
    topBeam,
    crownSheave,
    leftRackTeeth,
    rightRackTeeth,
    cabGroup,
    cabPlatform,
    cabRailings,
    leftStile,
    rightStile,
    crossHeadBeam,
    leafSpringGroup,
    springLeaves,
    springShackle,
    leftPawlGroup,
    rightPawlGroup,
    leftPawl,
    rightPawl,
    leftLinkageRod,
    rightLinkageRod,
    tautCable,
    severedCableTop,
    severedCableBottom,
  };

  const dispose = () => {
    for (const g of disposableGeometries) {
      g.dispose();
    }
    for (const m of disposableMaterials) {
      m.dispose();
    }
    for (const t of disposableTextures) {
      t.dispose();
    }
  };

  return { root, nodes, materials, dispose };
}

/**
 * Updates leaf-spring arch deflection, pawl engagement angle, and cab position.
 */
export function updateOtisElevatorKinematics(
  nodes: OtisElevatorModelNodes,
  _materials: OtisElevatorMaterials,
  dt: number,
  timeSec: number,
  isRopeSevered: boolean,
  springBowStudioY: number,
  isPawlEngaged: boolean,
  cabPayloadKg = 650,
  cableTensionPct = 100,
) {
  // 1. Hoisting Cable State
  nodes.tautCable.visible = !isRopeSevered;
  nodes.severedCableTop.visible = isRopeSevered;
  nodes.severedCableBottom.visible = isRopeSevered;

  const otis = stepOtisElevator({ cabPayloadKg, cableTensionPct });
  const sheaveFlex = otisSheaveCrate().sheaveFlex;

  // 2. Leaf Spring Elastic Deflection
  // Under tension (100%), spring bows upward in the center (+0.25m)
  // When severed (0%), spring flattens and pushes ends outwards
  const springBowY = isRopeSevered ? 0.0 : springBowStudioY;
  nodes.leafSpringGroup.position.y = otis.leafSpringHomeY + springBowY;
  nodes.springShackle.position.y = otis.shackleHomeY + springBowY * otis.shackleBowCoupling;

  // 3. Pawl Engagement Kinematics
  // Disengaged: pawls tilted upward/inward (clear of teeth by ~35mm)
  // Engaged: pawls rotated horizontally outward into the rack notches
  const targetPawlRotZ = isPawlEngaged ? 0.0 : otis.pawlDisengagedRotZ;
  const pawlLerp = Math.min(1.0, dt * otis.pawlLerpPerS);
  nodes.leftPawlGroup.rotation.z += (targetPawlRotZ - nodes.leftPawlGroup.rotation.z) * pawlLerp;
  nodes.rightPawlGroup.rotation.z += (-targetPawlRotZ - nodes.rightPawlGroup.rotation.z) * pawlLerp;

  // 4. Cab Hoist Motion / Catch Settling
  if (isRopeSevered) {
    // Stopped / locked on safety rack tooth with slight damped settle
    nodes.cabGroup.position.y = otis.cabCaughtY;
  } else {
    // Gentle hoisting float oscillation
    nodes.cabGroup.position.y = Math.sin(timeSec * otis.hoistOmega) * otis.hoistAmp * sheaveFlex;
  }

  // Rotate crown sheave with cable motion
  if (!isRopeSevered) {
    nodes.crownSheave.rotation.z =
      Math.sin(timeSec * otis.hoistOmega) * otis.sheaveAmp * sheaveFlex;
  }
}
