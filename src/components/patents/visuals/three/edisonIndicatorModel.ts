import * as THREE from "three";

export interface EdisonIndicatorModelHandles {
  root: THREE.Group;
  update: (state: {
    filamentTemperatureK: number;
    galvoDeflectionDeg: number;
    plateBiasPolarity: string;
    mainsVoltageV: number;
  }) => void;
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

export function buildEdisonIndicatorModel(): EdisonIndicatorModelHandles {
  const root = new THREE.Group();
  root.name = "EdisonIndicatorModel_Root";

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(obj: T): T => {
    disposables.push(obj);
    return obj;
  };

  // 1. INSTRUMENT BASEBOARD (Polished Mahogany / Dark Walnut)
  const baseGeo = track(new THREE.BoxGeometry(4.2, 0.22, 2.6));
  const baseMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x3d2314,
      roughness: 0.45,
      metalness: 0.05,
    }),
  );
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.set(0, -0.11, 0);
  baseMesh.receiveShadow = true;
  root.add(baseMesh);

  // Beveled edge trim on base
  const trimGeo = track(new THREE.BoxGeometry(4.3, 0.05, 2.7));
  const trimMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x24150c,
      roughness: 0.5,
    }),
  );
  const trimMesh = new THREE.Mesh(trimGeo, trimMat);
  trimMesh.position.set(0, -0.22, 0);
  root.add(trimMesh);

  // 2. INDICATOR LAMP A (Left Side, x = -1.1)
  const lampGroup = new THREE.Group();
  lampGroup.position.set(-1.1, 0, 0);
  root.add(lampGroup);

  // Brass lamp socket receptacle
  const socketGeo = track(new THREE.CylinderGeometry(0.42, 0.45, 0.35, 32));
  const brassMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.3,
      metalness: 0.85,
    }),
  );
  const socketMesh = new THREE.Mesh(socketGeo, brassMat);
  socketMesh.position.set(0, 0.175, 0);
  socketMesh.castShadow = true;
  lampGroup.add(socketMesh);

  // Wooden socket collar
  const socketCollarGeo = track(new THREE.CylinderGeometry(0.5, 0.52, 0.12, 32));
  const socketCollarMesh = new THREE.Mesh(socketCollarGeo, baseMat);
  socketCollarMesh.position.set(0, 0.06, 0);
  lampGroup.add(socketCollarMesh);

  // Glass bulb stem press
  const stemGeo = track(new THREE.CylinderGeometry(0.12, 0.15, 0.45, 16));
  const glassStemMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.88,
      opacity: 1,
      transparent: true,
      roughness: 0.15,
      ior: 1.5,
    }),
  );
  const stemMesh = new THREE.Mesh(stemGeo, glassStemMat);
  stemMesh.position.set(0, 0.45, 0);
  lampGroup.add(stemMesh);

  // Glass bulb globe
  const bulbGeo = track(new THREE.SphereGeometry(0.78, 36, 28));
  const bulbGlassMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xdff4fc,
      transmission: 0.94,
      opacity: 1,
      transparent: true,
      roughness: 0.08,
      ior: 1.52,
      thickness: 0.05,
      specularIntensity: 0.9,
    }),
  );
  const bulbMesh = new THREE.Mesh(bulbGeo, bulbGlassMat);
  bulbMesh.position.set(0, 1.15, 0);
  lampGroup.add(bulbMesh);

  // Carbon Filament Horseshoe Loop
  // Procedural U-shape tube curve
  const filamentCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.16, 0.55, 0),
    new THREE.Vector3(-0.16, 1.15, 0),
    new THREE.Vector3(-0.08, 1.45, 0),
    new THREE.Vector3(0, 1.48, 0),
    new THREE.Vector3(0.08, 1.45, 0),
    new THREE.Vector3(0.16, 1.15, 0),
    new THREE.Vector3(0.16, 0.55, 0),
  ]);
  const filamentGeo = track(new THREE.TubeGeometry(filamentCurve, 40, 0.015, 8, false));
  const filamentMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xff9922,
      emissive: 0xff6600,
      emissiveIntensity: 1.8,
      roughness: 0.6,
    }),
  );
  const filamentMesh = new THREE.Mesh(filamentGeo, filamentMat);
  lampGroup.add(filamentMesh);

  // Internal Point Light for warm filament glow
  const filamentLight = new THREE.PointLight(0xffaa44, 2.5, 3.5, 1.2);
  filamentLight.position.set(0, 1.2, 0);
  lampGroup.add(filamentLight);

  // Central Platinum Collector Plate b
  const plateGeo = track(new THREE.BoxGeometry(0.14, 0.35, 0.015));
  const platinumMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xdde6ed,
      metalness: 0.95,
      roughness: 0.2,
    }),
  );
  const plateMesh = new THREE.Mesh(plateGeo, platinumMat);
  plateMesh.position.set(0, 1.15, 0);
  plateMesh.castShadow = true;
  lampGroup.add(plateMesh);

  // Platinum electrode lead wire 5
  const lead5Geo = track(new THREE.CylinderGeometry(0.008, 0.008, 0.7, 8));
  const lead5Mat = track(
    new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.3,
    }),
  );
  const lead5Mesh = new THREE.Mesh(lead5Geo, lead5Mat);
  lead5Mesh.position.set(0, 0.78, 0);
  lampGroup.add(lead5Mesh);

  // Thermionic Electron Particles Cloud (Simulated via Points)
  const particleCount = 120;
  const particleGeo = track(new THREE.BufferGeometry());
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    // Distributed around filament loop toward plate
    const t = (i / particleCount) * Math.PI * 2;
    const r = 0.05 + ((i * 17) % 100) * 0.0012;
    particlePos[i * 3] = Math.cos(t) * r;
    particlePos[i * 3 + 1] = 0.95 + ((i * 23) % 100) * 0.004;
    particlePos[i * 3 + 2] = Math.sin(t) * r * 0.6;
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
  const particleMat = track(
    new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.025,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    }),
  );
  const particlePoints = new THREE.Points(particleGeo, particleMat);
  lampGroup.add(particlePoints);

  // 3. TORSION GALVANOMETER B (Right Side, x = 1.0)
  const galvoGroup = new THREE.Group();
  galvoGroup.position.set(1.0, 0, 0);
  root.add(galvoGroup);

  // Galvanometer Frame Pillar
  const frameGeo = track(new THREE.BoxGeometry(1.6, 2.2, 0.6));
  const galvoFrameMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.2,
    }),
  );
  const galvoFrameMesh = new THREE.Mesh(frameGeo, galvoFrameMat);
  galvoFrameMesh.position.set(0, 1.1, -0.2);
  galvoFrameMesh.castShadow = true;
  galvoGroup.add(galvoFrameMesh);

  // Circular Dial Face
  const dialGeo = track(new THREE.CylinderGeometry(0.68, 0.68, 0.04, 36));
  const dialMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
    }),
  );
  const dialMesh = new THREE.Mesh(dialGeo, dialMat);
  dialMesh.rotation.x = Math.PI / 2;
  dialMesh.position.set(0, 1.25, 0.12);
  galvoGroup.add(dialMesh);

  // Dial Bezel Ring (Polished Brass)
  const bezelGeo = track(new THREE.TorusGeometry(0.68, 0.035, 16, 36));
  const bezelMesh = new THREE.Mesh(bezelGeo, brassMat);
  bezelMesh.position.set(0, 1.25, 0.14);
  galvoGroup.add(bezelMesh);

  // Torsion Suspension Wire Tube & Thumb-Nut j
  const torsionTubeGeo = track(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16));
  const torsionTubeMesh = new THREE.Mesh(torsionTubeGeo, brassMat);
  torsionTubeMesh.position.set(0, 2.15, 0);
  galvoGroup.add(torsionTubeMesh);

  const thumbNutGeo = track(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16));
  const thumbNutMesh = new THREE.Mesh(thumbNutGeo, brassMat);
  thumbNutMesh.position.set(0, 2.44, 0);
  galvoGroup.add(thumbNutMesh);

  // Indicator Needle Pivot & Pointer m
  const needlePivot = new THREE.Group();
  needlePivot.position.set(0, 1.25, 0.16);
  galvoGroup.add(needlePivot);

  // Red Aluminum Needle Pointer m
  const needleGeo = track(new THREE.BoxGeometry(0.025, 0.72, 0.008));
  const needleMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.4,
    }),
  );
  const needleMesh = new THREE.Mesh(needleGeo, needleMat);
  needleMesh.position.set(0, 0.22, 0);
  needlePivot.add(needleMesh);

  // Central Pivot Cap
  const capGeo = track(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 16));
  const capMesh = new THREE.Mesh(capGeo, brassMat);
  capMesh.rotation.x = Math.PI / 2;
  needlePivot.add(capMesh);

  // Articulated Relay Arm o extension
  const armGeo = track(new THREE.BoxGeometry(0.018, 0.35, 0.008));
  const armMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.7,
      roughness: 0.3,
    }),
  );
  const armMesh = new THREE.Mesh(armGeo, armMat);
  armMesh.position.set(0, 0.65, 0);
  needlePivot.add(armMesh);

  // Bilateral Contact Pillars p (High & Low Limit Pins)
  const contactMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.2,
    }),
  );
  const pinGeo = track(new THREE.CylinderGeometry(0.025, 0.025, 0.15, 12));

  // Low Contact Pin (-15 deg approx)
  const pinLowMesh = new THREE.Mesh(pinGeo, contactMat);
  pinLowMesh.rotation.x = Math.PI / 2;
  pinLowMesh.position.set(-0.25, 1.85, 0.15);
  galvoGroup.add(pinLowMesh);

  // High Contact Pin (+15 deg approx)
  const pinHighMesh = new THREE.Mesh(pinGeo, contactMat);
  pinHighMesh.rotation.x = Math.PI / 2;
  pinHighMesh.position.set(0.25, 1.85, 0.15);
  galvoGroup.add(pinHighMesh);

  // Binding Posts c and c' on base
  const bindingPostGeo = track(new THREE.CylinderGeometry(0.06, 0.08, 0.18, 16));
  const postCMesh = new THREE.Mesh(bindingPostGeo, brassMat);
  postCMesh.position.set(-0.4, 0.09, 0.8);
  galvoGroup.add(postCMesh);

  const postCPrimeMesh = new THREE.Mesh(bindingPostGeo, brassMat);
  postCPrimeMesh.position.set(0.4, 0.09, 0.8);
  galvoGroup.add(postCPrimeMesh);

  // 4. INTER-COMPONENT WIRING (Wires 5 and 6 in Aged Cloth/Copper)
  const wireCurve5 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.1, 0.45, 0),
    new THREE.Vector3(-1.1, 0.08, 0.5),
    new THREE.Vector3(-0.2, 0.08, 0.8),
    new THREE.Vector3(0.6, 0.08, 0.8),
  ]);
  const wireGeo5 = track(new THREE.TubeGeometry(wireCurve5, 30, 0.012, 8, false));
  const wireMat5 = track(
    new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.7,
    }),
  );
  const wireMesh5 = new THREE.Mesh(wireGeo5, wireMat5);
  root.add(wireMesh5);

  const update = (state: {
    filamentTemperatureK: number;
    galvoDeflectionDeg: number;
    plateBiasPolarity: string;
    mainsVoltageV: number;
  }) => {
    // 1. Update filament color and emission intensity based on temperature
    const glow = Math.max(0.1, Math.min(1.0, (state.filamentTemperatureK - 1800) / 500));
    filamentMat.emissiveIntensity = 0.5 + glow * 2.8;
    filamentMat.emissive.setRGB(1.0, 0.35 + glow * 0.45, 0.05 + glow * 0.55);
    filamentLight.intensity = 1.0 + glow * 3.5;

    // 2. Update needle rotation (degrees to radians, inverted for physical dial)
    const targetRad = (-state.galvoDeflectionDeg * Math.PI) / 180;
    needlePivot.rotation.z = THREE.MathUtils.lerp(needlePivot.rotation.z, targetRad, 0.18);

    // 3. Update plate material and electron particle visibility
    if (state.plateBiasPolarity === "positive") {
      platinumMat.emissive.setHex(0x0284c7);
      platinumMat.emissiveIntensity = 0.2;
      particleMat.opacity = 0.85 * glow;
    } else if (state.plateBiasPolarity === "negative") {
      platinumMat.emissive.setHex(0xef4444);
      platinumMat.emissiveIntensity = 0.15;
      particleMat.opacity = 0.05;
    } else {
      platinumMat.emissive.setHex(0x000000);
      platinumMat.emissiveIntensity = 0;
      particleMat.opacity = 0.2;
    }
  };

  const setCutaway = (cutaway: boolean) => {
    bulbGlassMat.opacity = cutaway ? 0.08 : 0.45;
    bulbGlassMat.needsUpdate = true;
  };

  const dispose = () => {
    disposables.forEach((d) => {
      d.dispose();
    });
  };

  return { root, update, setCutaway, dispose };
}
