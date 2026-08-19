import * as THREE from "three";

export interface LindeLiquefactionModelNodes {
  root: THREE.Group;
  // Casing H and non-conducting packing around G′
  cryostatGroup: THREE.Group;
  solidCasingMesh: THREE.Mesh;
  cutawayCasingMesh: THREE.Mesh;
  supportLegs: THREE.Mesh[];
  // Counter-current apparatus G′: two coiled pipes, one within the other
  counterCurrentCoilGroup: THREE.Group;
  coilRings: THREE.Mesh[];
  inletSupplyPipe: THREE.Mesh;
  returnRecyclePipe: THREE.Mesh;
  // Nozzle N and regulating valve R′
  jtValveGroup: THREE.Group;
  jtSpindleRod: THREE.Mesh;
  jtHandwheel: THREE.Mesh;
  jtNeedleNozzle: THREE.Mesh;
  // Closed vessel V′, where the specification says liquid collects
  receiverVessel: THREE.Mesh;
  condensedGasVolume: THREE.Mesh;
  // Illustrative flow tracer, not an observation from the facsimile
  flowTracerPoints: THREE.Points;
}

export interface LindeLiquefactionMaterials {
  insulatingPacking: THREE.MeshStandardMaterial;
  apparatusMetal: THREE.MeshStandardMaterial;
  highPressurePath: THREE.MeshStandardMaterial;
  lowPressureReturn: THREE.MeshStandardMaterial;
  receiverGlass: THREE.MeshStandardMaterial;
  condensedGas: THREE.MeshStandardMaterial;
  flowTracer: THREE.PointsMaterial;
}

export interface LindeLiquefactionModelResult {
  root: THREE.Group;
  nodes: LindeLiquefactionModelNodes;
  materials: LindeLiquefactionMaterials;
  dispose: () => void;
}

const MIST_COUNT = 140;

export function buildLindeLiquefactionModel(): LindeLiquefactionModelResult {
  const root = new THREE.Group();
  const disposableGeometries: THREE.BufferGeometry[] = [];
  const disposableMaterials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposableGeometries.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    disposableMaterials.push(mat);
    return mat;
  };

  // Diagrammatic materials only. US 727,650 identifies wool as one possible
  // non-conducting packing but does not prescribe the metals or finishes.
  const materials: LindeLiquefactionMaterials = {
    insulatingPacking: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x4a3728,
        roughness: 0.6,
        metalness: 0.1,
      }),
    ),
    apparatusMetal: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.22,
        metalness: 0.9,
      }),
    ),
    highPressurePath: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.3,
        metalness: 0.9,
      }),
    ),
    lowPressureReturn: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8, // Cryogenic frosted copper
        roughness: 0.25,
        metalness: 0.85,
      }),
    ),
    receiverGlass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        transparent: true,
        opacity: 0.55,
        roughness: 0.1,
        metalness: 0.3,
      }),
    ),
    condensedGas: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0284c7, // Pale blue liquid oxygen/nitrogen mix
        transparent: true,
        opacity: 0.85,
        roughness: 0.05,
        metalness: 0.1,
      }),
    ),
    flowTracer: trackMat(
      new THREE.PointsMaterial({
        size: 0.3,
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      }),
    ),
  };

  // -------------------------------------------------------------
  // 1. Casing H around counter-current apparatus G′
  // -------------------------------------------------------------
  const cryostatGroup = new THREE.Group();
  root.add(cryostatGroup);

  // Diagrammatic support legs. Their material and count are not specified.
  const supportLegs: THREE.Mesh[] = [];
  for (let l = 0; l < 3; l++) {
    const lAngle = (l * Math.PI * 2) / 3;
    const leg = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.08, 0.12, 1.6, 12)),
      materials.apparatusMetal,
    );
    leg.position.set(Math.cos(lAngle) * 1.3, -2.6, Math.sin(lAngle) * 1.3);
    leg.rotation.z = Math.cos(lAngle) * 0.15;
    leg.rotation.x = -Math.sin(lAngle) * 0.15;
    leg.receiveShadow = true;
    cryostatGroup.add(leg);
    supportLegs.push(leg);
  }

  // Solid view of casing H and its non-conducting packing.
  const solidCasingMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.4, 1.4, 4.6, 32)),
    materials.insulatingPacking,
  );
  solidCasingMesh.position.set(0, 0.4, 0);
  solidCasingMesh.castShadow = true;
  solidCasingMesh.visible = false;
  cryostatGroup.add(solidCasingMesh);

  // Cutaway of casing H, to show G′'s nested coiled pipes.
  const cutawayCasingGeo = trackGeo(
    new THREE.CylinderGeometry(1.4, 1.4, 4.6, 32, 1, false, 0, Math.PI),
  );
  cutawayCasingGeo.rotateY(Math.PI / 2);
  const cutawayCasingMesh = new THREE.Mesh(cutawayCasingGeo, materials.insulatingPacking);
  cutawayCasingMesh.position.set(0, 0.4, 0);
  cutawayCasingMesh.castShadow = true;
  cryostatGroup.add(cutawayCasingMesh);

  // Diagrammatic end rings; the source drawing does not specify their metal.
  [-1.9, 2.7].forEach((fy) => {
    const flange = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.48, 1.48, 0.15, 32)),
      materials.apparatusMetal,
    );
    flange.position.set(0, fy, 0);
    cryostatGroup.add(flange);
  });

  // -------------------------------------------------------------
  // 2. Counter-current apparatus G′: two coiled pipes, one inside the other.
  // -------------------------------------------------------------
  const counterCurrentCoilGroup = new THREE.Group();
  root.add(counterCurrentCoilGroup);

  const coilRings: THREE.Mesh[] = [];
  const coilTurns = 18;

  // Color distinguishes the source-described high-pressure inner path from
  // the low-pressure annular return; it does not assert an observed material.
  for (let c = 0; c < coilTurns; c++) {
    const fraction = c / (coilTurns - 1);
    const coilMat = fraction < 0.5 ? materials.highPressurePath : materials.lowPressureReturn;

    const ring = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.95, 0.08, 12, 36)), coilMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 2.3 - c * 0.22, 0);
    counterCurrentCoilGroup.add(ring);
    coilRings.push(ring);
  }

  // High-pressure supply into G′ from cooler K.
  const inletSupplyPipe = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12)),
    materials.highPressurePath,
  );
  inletSupplyPipe.position.set(-1.2, 2.8, 0);
  inletSupplyPipe.rotation.z = Math.PI / 4;
  counterCurrentCoilGroup.add(inletSupplyPipe);

  // Low-pressure return from G′ to the suction of C through a and T a′.
  const returnRecyclePipe = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 1.2, 12)),
    materials.lowPressureReturn,
  );
  returnRecyclePipe.position.set(1.2, 2.8, 0);
  returnRecyclePipe.rotation.z = -Math.PI / 4;
  counterCurrentCoilGroup.add(returnRecyclePipe);

  // -------------------------------------------------------------
  // 3. Nozzle N with regulating valve R′ at the bottom of G′.
  // -------------------------------------------------------------
  const jtValveGroup = new THREE.Group();
  jtValveGroup.position.set(0, -1.6, 0);
  root.add(jtValveGroup);

  // Valve Body Casting
  const jtBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.6, 16)),
    materials.apparatusMetal,
  );
  jtValveGroup.add(jtBody);

  // Diagrammatic nozzle N / valve R′, not a reconstructed valve geometry.
  const jtNeedleNozzle = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.12, 0.35, 12)),
    materials.apparatusMetal,
  );
  jtNeedleNozzle.rotation.x = Math.PI;
  jtNeedleNozzle.position.set(0, -0.4, 0);
  jtValveGroup.add(jtNeedleNozzle);

  // Diagrammatic valve stem.
  const jtSpindleRod = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 4.8, 12)),
    materials.apparatusMetal,
  );
  jtSpindleRod.position.set(0, 2.3, 0);
  jtValveGroup.add(jtSpindleRod);

  // Diagrammatic regulator handle; the source labels R′ but gives no detail.
  const jtHandwheel = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.38, 0.05, 8, 24)),
    materials.apparatusMetal,
  );
  jtHandwheel.rotation.x = Math.PI / 2;
  jtHandwheel.position.set(0, 4.7, 0);
  jtValveGroup.add(jtHandwheel);

  // -------------------------------------------------------------
  // 4. Closed vessel V′ beneath G′. It is not identified as a Dewar.
  // -------------------------------------------------------------
  const receiverVessel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.75, 0.75, 0.9, 24)),
    materials.receiverGlass,
  );
  receiverVessel.position.set(0, -2.25, 0);
  root.add(receiverVessel);

  // A symbolic pool for the condensed portion stated to collect in V′.
  const condensedGasVolume = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.68, 0.68, 0.5, 24)),
    materials.condensedGas,
  );
  condensedGasVolume.position.set(0, -2.4, 0);
  root.add(condensedGasVolume);

  // -------------------------------------------------------------
  // 5. Illustrative flow tracer at N/R′. It has no measured flow rate.
  // -------------------------------------------------------------
  const mistGeo = trackGeo(new THREE.BufferGeometry());
  const mistPositions = new Float32Array(MIST_COUNT * 3);

  for (let i = 0; i < MIST_COUNT; i++) {
    const r = Math.sqrt((i + 1) / MIST_COUNT) * 0.55;
    const a = i * 2.39996; // Golden angle
    mistPositions[i * 3 + 0] = Math.cos(a) * r;
    mistPositions[i * 3 + 1] = -1.7 - (i / MIST_COUNT) * 0.6;
    mistPositions[i * 3 + 2] = Math.sin(a) * r;
  }

  mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPositions, 3));
  const flowTracerPoints = new THREE.Points(mistGeo, materials.flowTracer);
  root.add(flowTracerPoints);

  const nodes: LindeLiquefactionModelNodes = {
    root,
    cryostatGroup,
    solidCasingMesh,
    cutawayCasingMesh,
    supportLegs,
    counterCurrentCoilGroup,
    coilRings,
    inletSupplyPipe,
    returnRecyclePipe,
    jtValveGroup,
    jtSpindleRod,
    jtHandwheel,
    jtNeedleNozzle,
    receiverVessel,
    condensedGasVolume,
    flowTracerPoints,
  };

  const dispose = () => {
    for (const g of disposableGeometries) {
      g.dispose();
    }
    for (const m of disposableMaterials) {
      m.dispose();
    }
  };

  return { root, nodes, materials, dispose };
}

/**
 * Updates explanatory flow tracing and cutaway state. The movement is not a
 * measured Linde apparatus velocity or a quantitative process simulation.
 */
export function updateLindeLiquefactionKinematics(
  nodes: LindeLiquefactionModelNodes,
  materials: LindeLiquefactionMaterials,
  dt: number,
  timeSec: number,
  highPressureAtm: number,
  showFlowTracer: boolean,
  cutawayMode: boolean,
) {
  // 1. Slow regulator motion indicates that R′ regulates the pressure difference.
  nodes.jtHandwheel.rotation.z = Math.sin(timeSec * 0.4) * 0.2;

  // 2. Cutaway Visibility
  nodes.solidCasingMesh.visible = !cutawayMode;
  nodes.cutawayCasingMesh.visible = cutawayMode;

  // 3. The source states that condensed air collects in V′; this is symbolic.
  nodes.condensedGasVolume.scale.y = 1.0 + Math.sin(timeSec * 3.0) * 0.04;

  // 4. Flow markers are scaled only to the source's 75-atmosphere example.
  materials.flowTracer.opacity = showFlowTracer
    ? Math.min(0.8, (highPressureAtm / 75) * 0.65)
    : 0.0;

  if (showFlowTracer) {
    const pos = nodes.flowTracerPoints.geometry.attributes.position.array as Float32Array;
    const jetSpeed = (highPressureAtm / 75) * 1.1;

    for (let i = 0; i < MIST_COUNT; i++) {
      const idx = i * 3;
      pos[idx + 1] -= jetSpeed * dt;

      // Recycle symbolic tracers at the bottom of vessel V′.
      if (pos[idx + 1] < -2.5) {
        const r = Math.sqrt((i + 1) / MIST_COUNT) * 0.4;
        const a = (i + timeSec * 10) * 2.39996;
        pos[idx + 0] = Math.cos(a) * r;
        pos[idx + 1] = -1.7;
        pos[idx + 2] = Math.sin(a) * r;
      }
    }
    nodes.flowTracerPoints.geometry.attributes.position.needsUpdate = true;
  }
}
