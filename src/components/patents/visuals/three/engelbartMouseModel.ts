/**
 * engelbartMouseModel.ts
 *
 * Museum-grade procedural 3D model for Douglas C. Engelbart's position indicator
 * (US Patent 3,541,541 - "X-Y Position Indicator for a Display System").
 *
 * Reconstructs the source-bounded Fig. 2/3 preferred embodiment:
 * 1. Rounded hand-held housing 26 and bottom wall 28.
 * 2. One connected right-angle bracket 30 with arms 32/36.
 * 3. Three pushbuttons 22 over three switches 34.
 * 4. Perpendicular position wheels 42/46 fixed to potentiometer shafts 44/48.
 * 5. Ball-bearing support 54 completing the patent's three-point desk contact.
 * 6. A flexible conductor 18 that remains attached to the moving housing and
 *    bends toward a fixed computer-side anchor instead of moving as a rigid prop.
 */

import * as THREE from "three";
import { stepEngelbartResolver } from "@/physics/machineKernels";

export interface EngelbartMouseModelNodes {
  rootGroup: THREE.Group;
  mouseGroup: THREE.Group;
  body: THREE.Mesh;
  basePlate: THREE.Group;
  redButton: THREE.Mesh;
  buttonCaps: THREE.Mesh[];
  microswitchGroup: THREE.Group;
  switchLeaf: THREE.Mesh;
  switchLeaves: THREE.Mesh[];
  xWheelGroup: THREE.Group;
  xWheelRim: THREE.Mesh;
  xPotWiper: THREE.Mesh;
  yWheelGroup: THREE.Group;
  yWheelRim: THREE.Mesh;
  yPotWiper: THREE.Mesh;
  rightAngleBracket: THREE.Group;
  ballSupport: THREE.Group;
  ballBearing: THREE.Mesh;
  boot: THREE.Mesh;
  cord: THREE.Group;
  cordSegments: THREE.Mesh[];
  bearingBlocks: THREE.Mesh[];
}

export const ENGELBART_DESK_Y = -0.74;
const WHEEL_CENTER_Y = 0.16;
const WHEEL_RADIUS_STUDIO = 0.9;
const BUTTON_REST_Y = 2.48;
const BUTTON_DEPRESSED_Y = 2.34;

function roundedPlanGeometry(width: number, depth: number, height: number): THREE.ExtrudeGeometry {
  const radius = 0.58;
  const x0 = -width / 2;
  const y0 = -depth / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x0 + radius, y0);
  shape.lineTo(x0 + width - radius, y0);
  shape.quadraticCurveTo(x0 + width, y0, x0 + width, y0 + radius);
  shape.lineTo(x0 + width, y0 + depth - radius);
  shape.quadraticCurveTo(x0 + width, y0 + depth, x0 + width - radius, y0 + depth);
  shape.lineTo(x0 + radius, y0 + depth);
  shape.quadraticCurveTo(x0, y0 + depth, x0, y0 + depth - radius);
  shape.lineTo(x0, y0 + radius);
  shape.quadraticCurveTo(x0, y0, x0 + radius, y0);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.14,
    bevelThickness: 0.12,
    curveSegments: 8,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function placeCylinderBetween(segment: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3) {
  const delta = end.clone().sub(start);
  const length = delta.length();
  segment.position.copy(start).add(end).multiplyScalar(0.5);
  segment.scale.set(1, Math.max(0.001, length), 1);
  segment.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
}

export interface EngelbartMouseMaterials {
  woodHousing: THREE.MeshStandardMaterial;
  woodHousingXRay: THREE.MeshPhysicalMaterial;
  positionWheel: THREE.MeshStandardMaterial;
  redButton: THREE.MeshStandardMaterial;
  potentiometer: THREE.MeshStandardMaterial;
  wiperCopper: THREE.MeshStandardMaterial;
  baseMetal: THREE.MeshStandardMaterial;
  rubberBoot: THREE.MeshStandardMaterial;
  cable: THREE.MeshStandardMaterial;
  steelPivot: THREE.MeshStandardMaterial;
}

export interface EngelbartMouseModelResult {
  rootGroup: THREE.Group;
  nodes: EngelbartMouseModelNodes;
  materials: EngelbartMouseMaterials;
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
 * Procedural Hand-Carved American Walnut Texture
 */
function createWalnutTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Warm hand-oiled walnut brown
  ctx.fillStyle = "#8a3010";
  ctx.fillRect(0, 0, 512, 512);

  // Walnut longitudinal grain & subtle wood swirl
  for (let i = 0; i < 90; i++) {
    const x = i * 5.8 + (deterministicUnit(i, 0) - 0.5) * 4;
    const alpha = 0.08 + (i % 4 === 0 ? 0.15 : 0.04);
    ctx.strokeStyle = `rgba(50, 16, 6, ${alpha})`;
    ctx.lineWidth = 1.3 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 14, 160, x - 12, 360, x + 6, 512);
    ctx.stroke();
  }

  // Wood pores & light hand-sanded highlights
  for (let p = 0; p < 280; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(30, 8, 4, 0.28)";
    ctx.fillRect(px, py, 1.8, 5 + deterministicUnit(p, 3) * 7);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildEngelbartMouseModel(): EngelbartMouseModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  const walnutTex = createWalnutTexture();
  if (walnutTex) texturesToDispose.push(walnutTex);

  // Materials
  const materials: EngelbartMouseMaterials = {
    woodHousing: trackMat(
      new THREE.MeshStandardMaterial({
        ...(walnutTex ? { map: walnutTex } : {}),
        color: 0x9a3412,
        roughness: 0.35,
        metalness: 0.05,
      }),
    ),
    woodHousingXRay: trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x9a3412,
        transmission: 0.55,
        opacity: 0.2,
        transparent: true,
        roughness: 0.15,
        ior: 1.4,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    ),
    positionWheel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.18,
        metalness: 0.92,
      }),
    ),
    redButton: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.25,
        metalness: 0.1,
      }),
    ),
    potentiometer: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.3,
        metalness: 0.85,
      }),
    ),
    wiperCopper: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.15,
        metalness: 0.95,
      }),
    ),
    baseMetal: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.85,
        roughness: 0.3,
      }),
    ),
    rubberBoot: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.9,
      }),
    ),
    cable: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.5,
      }),
    ),
    steelPivot: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.12,
        metalness: 0.96,
      }),
    ),
  };

  const mouseGroup = new THREE.Group();
  mouseGroup.name = "Position indicator control 16";
  rootGroup.add(mouseGroup);

  // 1. Rounded housing 26. The source is a solid shell; cutaway mode changes
  // only its inspection material and never disconnects the internals.
  const bodyGeo = trackGeo(roundedPlanGeometry(4.5, 5.8, 2.15));
  const body = new THREE.Mesh(bodyGeo, materials.woodHousing);
  body.name = "Rounded hand-held housing 26";
  body.position.y = 0.28;
  body.castShadow = true;
  body.receiveShadow = true;
  mouseGroup.add(body);

  // 2. Bottom wall 28 is tiled around the actual perpendicular wheel slots
  // 50 and 52. A single solid box here would visibly pass through both rims.
  const basePlate = new THREE.Group();
  basePlate.name = "Bottom wall 28";
  const xCuts = [-2.07, -1.98, 0.18, 0.4, 0.76, 2.07];
  const zCuts = [-2.71, -1.34, -0.96, -0.24, 1.88, 2.71];
  for (let xIndex = 0; xIndex < xCuts.length - 1; xIndex += 1) {
    for (let zIndex = 0; zIndex < zCuts.length - 1; zIndex += 1) {
      const x0 = xCuts[xIndex];
      const x1 = xCuts[xIndex + 1];
      const z0 = zCuts[zIndex];
      const z1 = zCuts[zIndex + 1];
      const cx = (x0 + x1) / 2;
      const cz = (z0 + z1) / 2;
      const insideSlot50 = cx > -1.98 && cx < 0.18 && cz > -1.34 && cz < -0.96;
      const insideSlot52 = cx > 0.4 && cx < 0.76 && cz > -0.24 && cz < 1.88;
      if (insideSlot50 || insideSlot52) continue;
      const panel = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(x1 - x0, 0.12, z1 - z0)),
        materials.baseMetal,
      );
      panel.name = `Bottom wall 28 panel ${xIndex}-${zIndex}`;
      panel.position.set(cx, 0.12, cz);
      panel.receiveShadow = true;
      basePlate.add(panel);
    }
  }
  mouseGroup.add(basePlate);

  // Base Plate Corner Fastener Screws
  [
    [-1.8, -2.5],
    [1.8, -2.5],
    [-1.8, 2.5],
    [1.8, 2.5],
  ].forEach(([sx, sz]) => {
    const screw = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12)),
      materials.baseMetal,
    );
    screw.position.set(sx, 0.22, sz);
    basePlate.add(screw);
  });

  // 3. Three pushbuttons 22 and three switches 34, as printed. The middle
  // button is the interactive one; its cap remains mechanically aligned with
  // the matching leaf and switch box beneath it.
  const microswitchGroup = new THREE.Group();
  microswitchGroup.name = "Three pushbutton switches 34";
  const buttonCaps: THREE.Mesh[] = [];
  const switchLeaves: THREE.Mesh[] = [];
  [-0.68, 0, 0.68].forEach((x, index) => {
    const buttonBezel = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.28, 0.32, 0.12, 20)),
      materials.baseMetal,
    );
    buttonBezel.name = `Pushbutton bezel ${index + 1}`;
    buttonBezel.position.set(x, 2.28, -1.9);
    mouseGroup.add(buttonBezel);

    const cap = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.34, 20)),
      materials.redButton,
    );
    cap.name = `Pushbutton 22-${index + 1}`;
    cap.position.set(x, BUTTON_REST_Y, -1.9);
    cap.castShadow = true;
    buttonCaps.push(cap);
    mouseGroup.add(cap);

    const switchBox = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.48, 0.34, 0.62)),
      materials.potentiometer,
    );
    switchBox.name = `Pushbutton switch 34-${index + 1}`;
    switchBox.position.set(x, 1.82, -1.9);
    microswitchGroup.add(switchBox);

    const leaf = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.25, 0.035, 0.5)),
      materials.wiperCopper,
    );
    leaf.name = `Switch leaf 34-${index + 1}`;
    leaf.position.set(x, 2.02, -1.9);
    switchLeaves.push(leaf);
    microswitchGroup.add(leaf);
  });
  const redButton = buttonCaps[1];
  const switchLeaf = switchLeaves[1];
  mouseGroup.add(microswitchGroup);

  // 4. Rear Rubber Strain Relief Boot & Cable
  const bootGeo = trackGeo(new THREE.ConeGeometry(0.32, 0.8, 16));
  const boot = new THREE.Mesh(bootGeo, materials.rubberBoot);
  boot.name = "Flexible conductor strain relief";
  boot.rotation.x = -Math.PI / 2;
  boot.position.set(0, 0.54, 3.18);
  mouseGroup.add(boot);

  const cord = new THREE.Group();
  cord.name = "Flexible conductor 18";
  const cordSegments: THREE.Mesh[] = [];
  const cordSegmentGeometry = trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 1, 10));
  for (let index = 0; index < 22; index += 1) {
    const segment = new THREE.Mesh(cordSegmentGeometry, materials.cable);
    segment.name = `Flexible conductor segment ${index + 1}`;
    segment.castShadow = true;
    cordSegments.push(segment);
    cord.add(segment);
  }
  rootGroup.add(cord);

  // 4. One connected right-angle bracket 30. Its base flange is fastened to
  // bottom wall 28; perpendicular arms 32/36 carry the two transducers.
  const rightAngleBracket = new THREE.Group();
  rightAngleBracket.name = "Right-angle bracket 30 with arms 32 and 36";
  const bracketBaseX = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.0, 0.12, 0.22)),
    materials.baseMetal,
  );
  bracketBaseX.name = "Bracket 30 X-arm base flange";
  bracketBaseX.position.set(-0.3, 0.24, -0.47);
  rightAngleBracket.add(bracketBaseX);
  const bracketBaseY = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.22, 0.12, 2.6)),
    materials.baseMetal,
  );
  bracketBaseY.name = "Bracket 30 Y-arm base flange";
  bracketBaseY.position.set(1.2, 0.24, 0.72);
  rightAngleBracket.add(bracketBaseY);
  const arm32 = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.1, 1.05, 0.12)),
    materials.baseMetal,
  );
  arm32.name = "Bracket arm 32 carrying X transducer";
  arm32.position.set(-0.9, 0.72, -0.47);
  rightAngleBracket.add(arm32);
  const arm36 = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.12, 1.05, 2.0)),
    materials.baseMetal,
  );
  arm36.name = "Bracket arm 36 carrying Y transducer";
  arm36.position.set(1.2, 0.72, 0.82);
  rightAngleBracket.add(arm36);
  mouseGroup.add(rightAngleBracket);

  // 5. X-position wheel 42. Its axle is along world Z, so its vertical wheel
  // plane rolls for world-X displacement. All spinning children rotate about
  // local Y after the assembly orientation is applied at the group level.
  const xWheelGroup = new THREE.Group();
  xWheelGroup.name = "X position wheel 42 and potentiometer 38";
  xWheelGroup.position.set(-0.9, WHEEL_CENTER_Y, -1.15);
  xWheelGroup.rotation.x = Math.PI / 2;

  const xWheelRim = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(WHEEL_RADIUS_STUDIO, WHEEL_RADIUS_STUDIO, 0.14, 40)),
    materials.positionWheel,
  );
  xWheelRim.name = "X position wheel rim 42";
  xWheelRim.castShadow = true;
  xWheelGroup.add(xWheelRim);

  const xAxle = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.075, 0.075, 1.55, 16)),
    materials.steelPivot,
  );
  xAxle.name = "X potentiometer shaft 44";
  xWheelGroup.add(xAxle);

  const xPotBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.46, 0.46, 0.55, 24)),
    materials.potentiometer,
  );
  xPotBody.name = "X multiturn potentiometer 38";
  xPotBody.position.y = 0.93;
  xWheelGroup.add(xPotBody);

  const xPotWiper = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.08, 0.08, 0.55)),
    materials.wiperCopper,
  );
  xPotWiper.name = "X potentiometer wiper 72";
  xPotWiper.position.set(0, 1.23, 0.18);
  xWheelGroup.add(xPotWiper);

  mouseGroup.add(xWheelGroup);

  // 6. Y-position wheel 46. Its axle is along world X and the wheel rolls for
  // world-Z displacement, exactly perpendicular to wheel 42.
  const yWheelGroup = new THREE.Group();
  yWheelGroup.name = "Y position wheel 46 and potentiometer 40";
  yWheelGroup.position.set(0.58, WHEEL_CENTER_Y, 0.82);
  yWheelGroup.rotation.z = -Math.PI / 2;

  const yWheelRim = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(WHEEL_RADIUS_STUDIO, WHEEL_RADIUS_STUDIO, 0.14, 40)),
    materials.positionWheel,
  );
  yWheelRim.name = "Y position wheel rim 46";
  yWheelRim.castShadow = true;
  yWheelGroup.add(yWheelRim);

  const yAxle = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.075, 0.075, 1.55, 16)),
    materials.steelPivot,
  );
  yAxle.name = "Y potentiometer shaft 48";
  yWheelGroup.add(yAxle);

  const yPotBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.46, 0.46, 0.55, 24)),
    materials.potentiometer,
  );
  yPotBody.name = "Y multiturn potentiometer 40";
  yPotBody.position.y = 0.93;
  yWheelGroup.add(yPotBody);

  const yPotWiper = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.55, 0.08, 0.08)),
    materials.wiperCopper,
  );
  yPotWiper.name = "Y potentiometer wiper 74";
  yPotWiper.position.set(0.18, 1.23, 0);
  yWheelGroup.add(yPotWiper);

  mouseGroup.add(yWheelGroup);

  // Small bearing blocks tie both shafts into the bracket instead of leaving
  // the wheels and transducers floating inside the housing.
  const bearingBlocks: THREE.Mesh[] = [];
  [
    [-0.9, 0.34, -0.52, 0.5, 0.42, 0.22],
    [0.02, 0.34, 0.82, 0.22, 0.42, 0.5],
  ].forEach(([x, y, z, width, height, depth], index) => {
    const block = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(width, height, depth)),
      materials.steelPivot,
    );
    block.name = `${index === 0 ? "X shaft 44" : "Y shaft 48"} bearing block`;
    block.position.set(x, y, z);
    bearingBlocks.push(block);
    mouseGroup.add(block);
  });

  // 7. Ball-bearing support 54 completes the same tangent plane as both
  // wheel rims. The stem overlaps bottom wall 28 and the ball touches the desk.
  const ballSupport = new THREE.Group();
  ballSupport.name = "Ball-bearing third-point support 54";
  ballSupport.position.set(1.48, 0, -1.28);
  const supportStem = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.1, 0.13, 0.48, 16)),
    materials.steelPivot,
  );
  supportStem.name = "Ball support 54 stem fixed to bottom wall 28";
  supportStem.position.y = -0.06;
  ballSupport.add(supportStem);
  const ballBearing = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.23, 20, 12)),
    materials.steelPivot,
  );
  ballBearing.name = "Ball bearing support 54 desk contact";
  ballBearing.position.y = ENGELBART_DESK_Y + 0.23;
  ballSupport.add(ballBearing);
  mouseGroup.add(ballSupport);

  const nodes: EngelbartMouseModelNodes = {
    rootGroup,
    mouseGroup,
    body,
    basePlate,
    redButton,
    buttonCaps,
    microswitchGroup,
    switchLeaf,
    switchLeaves,
    xWheelGroup,
    xWheelRim,
    xPotWiper,
    yWheelGroup,
    yWheelRim,
    yPotWiper,
    rightAngleBracket,
    ballSupport,
    ballBearing,
    boot,
    cord,
    cordSegments,
    bearingBlocks,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates planar position tracking, orthogonal wheel rotation, button clicks, and X-ray mode.
 */
export function updateEngelbartMouseKinematics(
  nodes: EngelbartMouseModelNodes,
  materials: EngelbartMouseMaterials,
  _dt: number,
  timeSec: number,
  pathDisplayOmega: number,
  resolverSvgScale: number,
  mouseTrajectory: "figure8" | "circle" | "horizontal" | "vertical",
  wheelRadiusMm: number,
  pulsesPerRev: number,
  isClicking: boolean,
  isXRayMode: boolean,
  claim1Active: boolean = true,
) {
  // Casing X-Ray Toggle
  nodes.body.material = isXRayMode ? materials.woodHousingXRay : materials.woodHousing;

  // Trajectory computation
  const speed = pathDisplayOmega;
  let posX = 0;
  let posZ = 0;

  if (mouseTrajectory === "horizontal") {
    posX = Math.sin(timeSec * speed) * 3.5;
    posZ = 0;
  } else if (mouseTrajectory === "vertical") {
    posX = 0;
    posZ = Math.sin(timeSec * speed) * 3.5;
  } else if (mouseTrajectory === "circle") {
    posX = Math.cos(timeSec * speed) * 3.0;
    posZ = Math.sin(timeSec * speed) * 3.0;
  } else {
    // Figure 8
    posX = Math.sin(timeSec * speed) * 3.2;
    posZ = Math.sin(timeSec * speed * 2.0) * 1.8;
  }

  // Removing Claim 1's second perpendicular wheel leaves one measured
  // coordinate. The exhibit therefore refuses Y travel while the chassis
  // stays planted on the desk; an incomplete resolver is not a new force.
  if (!claim1Active) posZ = 0;
  nodes.mouseGroup.position.set(posX, 0, posZ);
  nodes.mouseGroup.rotation.z = 0;

  // Solve absolute no-slip wheel coordinates from absolute chassis travel.
  // This produces identical poses for identical time/parameter inputs at any
  // animation frame rate; no angle is accumulated in the render loop.
  const resolved = stepEngelbartResolver(
    posX * resolverSvgScale,
    posZ * resolverSvgScale,
    wheelRadiusMm,
    pulsesPerRev,
  );

  nodes.xWheelRim.rotation.y = -resolved.dThetaX;
  nodes.xPotWiper.rotation.y = -resolved.dThetaX;
  nodes.yWheelRim.rotation.y = claim1Active ? -resolved.dThetaY : 0;
  nodes.yPotWiper.rotation.y = claim1Active ? -resolved.dThetaY : 0;

  // A bounded geometric lens makes the modern wheel-radius scenario visible
  // while maintaining the patent's common three-point tangent plane.
  const radiusFraction = Math.min(1, Math.max(0, (wheelRadiusMm - 6) / 12));
  const displayRadius = 0.72 + radiusFraction * 0.26;
  const radialScale = displayRadius / WHEEL_RADIUS_STUDIO;
  nodes.xWheelRim.scale.set(radialScale, 1, radialScale);
  nodes.yWheelRim.scale.set(radialScale, 1, radialScale);
  const wheelCenterY = ENGELBART_DESK_Y + displayRadius;
  nodes.xWheelGroup.position.y = wheelCenterY;
  nodes.yWheelGroup.position.y = wheelCenterY;
  nodes.yWheelGroup.visible = claim1Active;

  // Microswitch Button Depress
  nodes.redButton.position.y = isClicking ? BUTTON_DEPRESSED_Y : BUTTON_REST_Y;
  nodes.switchLeaf.rotation.x = isClicking ? 0.08 : 0;

  // Flexible conductor 18 follows the moving housing at one end and a fixed
  // computer-side anchor at the other. Segment endpoints overlap slightly so
  // the cable remains visibly continuous throughout the figure-eight path.
  const cableStart = new THREE.Vector3(0, 0.48, 3.58)
    .applyEuler(nodes.mouseGroup.rotation)
    .add(nodes.mouseGroup.position);
  const cableEnd = new THREE.Vector3(5.7, ENGELBART_DESK_Y + 0.12, 8.1);
  const controlA = cableStart.clone().add(new THREE.Vector3(0.2, -0.5, 1.45));
  const controlB = new THREE.Vector3(3.6, ENGELBART_DESK_Y + 0.12, 6.6);
  const curve = new THREE.CubicBezierCurve3(cableStart, controlA, controlB, cableEnd);
  const points = curve.getPoints(nodes.cordSegments.length);
  nodes.cordSegments.forEach((segment, index) => {
    placeCylinderBetween(segment, points[index], points[index + 1]);
  });
}
