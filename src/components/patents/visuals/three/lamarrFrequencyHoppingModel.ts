/**
 * Procedural Three.js Model Builder for US 2,292,387
 * Hedy Kiesler Markey (Hedy Lamarr) & George Antheil — Secret Communication System (1942)
 *
 * Implements the illustrated record-controlled torpedo apparatus:
 * - Clockwork-driven perforated record strip and matching receiver strip
 * - Seven transmitter tuning positions and four receiver positions
 * - False transmitter channels A–C, useful receiver channels D–G, and a warning lamp
 * - Discrete record movement and rudder-command presentation
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface LamarrFrequencyHoppingModel {
  root: THREE.Group;
  apparatusGroup: THREE.Group;
  drum1: THREE.Mesh;
  drum2: THREE.Mesh;
  paperWeb: THREE.Mesh;
  comb: THREE.Mesh;
  receiverDrum1: THREE.Mesh;
  receiverDrum2: THREE.Mesh;
  receiverPaperWeb: THREE.Mesh;
  receiverComb: THREE.Mesh;
  receiverTrain: THREE.Group;
  recordLink: THREE.Line;
  bulkheadRings: THREE.Mesh[];
  sidePlates: THREE.Mesh[];
  frontDrumFlanges: THREE.Mesh[];
  spectrumBarsGroup: THREE.Group;
  barMeshes: THREE.Mesh[];
  hopPoints: THREE.Points;
  materials: {
    brassMat: THREE.MeshStandardMaterial;
    pianoRollPaperMat: THREE.MeshStandardMaterial;
    torpedoBayMat: THREE.MeshStandardMaterial;
    goldCombMat: THREE.MeshStandardMaterial;
    pinMat: THREE.MeshStandardMaterial;
    hopMat: THREE.PointsMaterial;
    aluminumBayMat?: THREE.MeshStandardMaterial;
  };
  updateKinematics: (
    activeChan: number,
    receiverTuned: boolean,
    lampOn: boolean,
    isCutaway?: boolean,
    recordSynchronizationPresent?: boolean,
  ) => void;
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
 * Procedural Perforated Player Piano Roll Paper Texture
 */
function createPianoRollTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Aged Manila player piano roll tone
  ctx.fillStyle = "#fef8e7";
  ctx.fillRect(0, 0, 512, 512);

  // Subtle paper fibers
  for (let f = 0; f < 250; f++) {
    const fx = deterministicUnit(f, 0) * 512;
    const fy = deterministicUnit(f, 1) * 512;
    ctx.strokeStyle = "rgba(190, 160, 110, 0.2)";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + 6, fy + (deterministicUnit(f, 2) - 0.5) * 4);
    ctx.stroke();
  }

  // Margin alignment guide tracks
  ctx.strokeStyle = "rgba(160, 120, 70, 0.4)";
  ctx.lineWidth = 1.0;
  ctx.strokeRect(16, 0, 480, 512);

  // Perforated record-strip slots
  ctx.fillStyle = "#1e293b";
  for (let row = 0; row < 18; row++) {
    for (let col = 0; col < 12; col++) {
      if (deterministicUnit(row * 12 + col, 3) > 0.45) {
        const px = 32 + col * 38 + (deterministicUnit(row, 4) - 0.5) * 8;
        const py = 20 + row * 27;
        const isLong = deterministicUnit(row * 12 + col, 5) > 0.7;
        ctx.beginPath();
        ctx.roundRect(px, py, isLong ? 26 : 14, 8, 3);
        ctx.fill();
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildLamarrFrequencyHoppingModel(): LamarrFrequencyHoppingModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19420811);

  const paperTex = createPianoRollTexture();
  if (paperTex) disposables.push(paperTex);

  // --- AUTHENTIC MATERIALS ---
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.18,
    metalness: 0.92,
  });
  disposables.push(brassMat);

  const pianoRollPaperMat = new THREE.MeshStandardMaterial({
    ...(paperTex ? { map: paperTex } : {}),
    color: 0xfef9e7,
    roughness: 0.8,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  disposables.push(pianoRollPaperMat);

  const torpedoBayMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.35,
    side: THREE.BackSide,
    transparent: true,
    opacity: 1.0,
  });
  disposables.push(torpedoBayMat);

  const goldCombMat = new THREE.MeshStandardMaterial({
    color: 0xca8a04,
    roughness: 0.2,
    metalness: 0.95,
  });
  disposables.push(goldCombMat);

  const pinMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    metalness: 0.95,
  });
  disposables.push(pinMat);

  // ==========================================
  // TORPEDO INSTRUMENT BAY & PIANO ROLL ASSEMBLY (CLAIM 1)
  // ==========================================
  const apparatusGroup = new THREE.Group();
  root.add(apparatusGroup);

  // Torpedo Bay Aluminum Shell with Bulkhead Rings
  const bayGeo = new THREE.CylinderGeometry(4.2, 4.2, 7.8, 36, 1, true);
  disposables.push(bayGeo);
  const torpedoBay = new THREE.Mesh(bayGeo, torpedoBayMat);
  torpedoBay.rotation.z = Math.PI / 2;
  torpedoBay.position.y = 0.5;
  apparatusGroup.add(torpedoBay);

  // Bulkhead Ring Ribs
  const bulkheadRings: THREE.Mesh[] = [];
  [-3.8, 3.8].forEach((rx) => {
    const ringGeo = new THREE.TorusGeometry(4.22, 0.08, 12, 36);
    disposables.push(ringGeo);
    const ring = new THREE.Mesh(ringGeo, brassMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(rx, 0.5, 0);
    apparatusGroup.add(ring);
    bulkheadRings.push(ring);
  });

  // Brass Framework Sideplates with Weight-Reduction Cutouts
  const sidePlates: THREE.Mesh[] = [];
  [-2.6, 2.6].forEach((zPos) => {
    const plateGeo = new THREE.BoxGeometry(7.2, 2.8, 0.15);
    disposables.push(plateGeo);
    const sidePlate = new THREE.Mesh(plateGeo, brassMat);
    sidePlate.position.set(0, 0.4, zPos);
    sidePlate.castShadow = true;
    apparatusGroup.add(sidePlate);
    sidePlates.push(sidePlate);
  });

  // Supply and Take-Up Piano Roll Drums with Flanges
  const drumGeo = new THREE.CylinderGeometry(0.75, 0.75, 5.0, 32);
  disposables.push(drumGeo);

  const drum1 = new THREE.Mesh(drumGeo, brassMat);
  drum1.rotation.x = Math.PI / 2;
  drum1.position.set(-1.8, 0.6, 0);
  drum1.castShadow = true;
  apparatusGroup.add(drum1);

  const drum2 = new THREE.Mesh(drumGeo, brassMat);
  drum2.rotation.x = Math.PI / 2;
  drum2.position.set(1.8, 0.6, 0);
  drum2.castShadow = true;
  apparatusGroup.add(drum2);

  // Drum Brass End Flanges
  const frontDrumFlanges: THREE.Mesh[] = [];
  [
    [-1.8, -2.5],
    [-1.8, 2.5],
    [1.8, -2.5],
    [1.8, 2.5],
  ].forEach(([dx, dz]) => {
    const flangeGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.06, 24);
    disposables.push(flangeGeo);
    const flange = new THREE.Mesh(flangeGeo, brassMat);
    flange.rotation.x = Math.PI / 2;
    flange.position.set(dx, 0.6, dz);
    apparatusGroup.add(flange);
    if (dz > 0) frontDrumFlanges.push(flange);
  });

  // Slotted perforated paper web
  const webGeo = new THREE.PlaneGeometry(3.6, 4.8, 24, 16);
  disposables.push(webGeo);
  const paperWeb = new THREE.Mesh(webGeo, pianoRollPaperMat);
  paperWeb.rotation.x = -Math.PI / 2;
  paperWeb.position.set(0, 1.35, 0);
  paperWeb.castShadow = true;
  apparatusGroup.add(paperWeb);

  // ==========================================
  // Record-responsive sensing comb (Claim 2)
  // ==========================================
  const combGeo = new THREE.BoxGeometry(0.35, 0.4, 4.9);
  disposables.push(combGeo);
  const comb = new THREE.Mesh(combGeo, goldCombMat);
  comb.position.set(0, 1.6, 0);
  comb.castShadow = true;
  apparatusGroup.add(comb);

  for (let p = 0; p < 7; p++) {
    const pinGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.35, 8);
    disposables.push(pinGeo);
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.name = `transmitter_record_contact_${String.fromCharCode(65 + p)}`;
    pin.position.set(0, 1.4, (p - 3) * 0.55);
    apparatusGroup.add(pin);
  }

  // The receiver carries a distinct copy of the punched record (37′), not a
  // decorative duplicate of the transmitter web.  It is positioned below the
  // transmitter train in this cutaway so the matched supply/take-up path,
  // sensing comb, and the causal link can all be inspected together.
  const receiverTrain = new THREE.Group();
  receiverTrain.name = "receiver_record_train_37_prime";
  receiverTrain.position.y = -1.55;
  apparatusGroup.add(receiverTrain);

  const receiverDrum1 = new THREE.Mesh(drumGeo, brassMat);
  receiverDrum1.name = "receiver_supply_drum";
  receiverDrum1.rotation.x = Math.PI / 2;
  receiverDrum1.position.set(-1.8, 0.6, 0);
  receiverTrain.add(receiverDrum1);
  const receiverDrum2 = new THREE.Mesh(drumGeo, brassMat);
  receiverDrum2.name = "receiver_takeup_drum";
  receiverDrum2.rotation.x = Math.PI / 2;
  receiverDrum2.position.set(1.8, 0.6, 0);
  receiverTrain.add(receiverDrum2);

  // Each receiver drum axis terminates in the existing structural sideplates;
  // these collars make those bearings visible instead of leaving both rolls
  // apparently suspended in the bay.
  for (const x of [-1.8, 1.8]) {
    for (const z of [-2.5, 2.5]) {
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.16, 16), brassMat);
      disposables.push(collar.geometry);
      collar.name = "receiver_drum_bearing_collar";
      collar.rotation.x = Math.PI / 2;
      collar.position.set(x, 0.6, z);
      receiverTrain.add(collar);
    }
  }

  const receiverPaperWeb = new THREE.Mesh(webGeo, pianoRollPaperMat);
  receiverPaperWeb.name = "receiver_perforated_record_37_prime";
  receiverPaperWeb.rotation.x = -Math.PI / 2;
  receiverPaperWeb.position.set(0, 1.35, 0);
  receiverTrain.add(receiverPaperWeb);
  const receiverComb = new THREE.Mesh(combGeo, goldCombMat);
  receiverComb.name = "receiver_sensing_comb";
  receiverComb.position.set(0, 1.6, 0);
  receiverTrain.add(receiverComb);

  for (let p = 3; p < 7; p++) {
    const receiverPin = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 8), pinMat);
    disposables.push(receiverPin.geometry);
    receiverPin.name = `receiver_record_contact_${String.fromCharCode(65 + p)}`;
    receiverPin.position.set(0, 1.4, (p - 3) * 0.55);
    receiverTrain.add(receiverPin);
  }

  // Dashed museum overlay: the geographically separated records share phase,
  // but the patent does not put a physical shaft or cable between stations.
  const recordLinkGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(1.8, 0.6, 0),
    new THREE.Vector3(2.35, 0.6, 0),
    new THREE.Vector3(2.35, -0.95, 0),
    new THREE.Vector3(1.8, -0.95, 0),
  ]);
  disposables.push(recordLinkGeometry);
  const recordLink = new THREE.Line(
    recordLinkGeometry,
    new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      dashSize: 0.16,
      gapSize: 0.12,
    }),
  );
  recordLink.name = "matched_record_timing_link";
  recordLink.userData.pedagogicalOverlay = "synchronized records; not a physical conductor";
  recordLink.computeLineDistances();
  const recordLinkMaterial = recordLink.material as THREE.LineDashedMaterial;
  disposables.push(recordLinkMaterial);
  apparatusGroup.add(recordLink);

  // ==========================================
  // Seven transmitter tuning positions; D–G are receiver-effective
  // ==========================================
  const spectrumBarsGroup = new THREE.Group();
  spectrumBarsGroup.position.set(0, -2.4, 0);
  root.add(spectrumBarsGroup);

  const maxDisplayChannels = 7;
  const barMeshes: THREE.Mesh[] = [];

  for (let c = 0; c < maxDisplayChannels; c++) {
    const barGeo = new THREE.BoxGeometry(0.12, 0.4, 0.12);
    disposables.push(barGeo);

    const barMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.8,
    });
    disposables.push(barMat);

    const bar = new THREE.Mesh(barGeo, barMat);
    const xPos = (c - (maxDisplayChannels - 1) / 2) * 0.18;
    bar.position.set(xPos, 0.2, 0);
    spectrumBarsGroup.add(bar);
    barMeshes.push(bar);
  }

  // Deterministic record-position points
  const hopCount = 7;
  const hopGeo = new THREE.BufferGeometry();
  disposables.push(hopGeo);
  const hopPos = new Float32Array(hopCount * 3);

  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < hopCount; i++) {
    const idx = i * 3;
    hopPos[idx] = (i - (hopCount - 1) / 2) * 0.18;
    hopPos[idx + 1] = 0.8 + lcg() * 0.03;
    hopPos[idx + 2] = 0;
  }

  hopGeo.setAttribute("position", new THREE.BufferAttribute(hopPos, 3));

  const hopMat = new THREE.PointsMaterial({
    size: 0.4,
    map: glowTex,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(hopMat);

  const hopPoints = new THREE.Points(hopGeo, hopMat);
  hopPoints.name = "channel-row-indicator-points";
  spectrumBarsGroup.add(hopPoints);

  const updateKinematics = (
    activeChan: number,
    receiverTuned: boolean,
    lampOn: boolean,
    isCutaway = false,
    recordSynchronizationPresent = true,
  ) => {
    updateLamarrFrequencyHoppingKinematics(
      model,
      activeChan,
      receiverTuned,
      lampOn,
      isCutaway,
      recordSynchronizationPresent,
    );
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  const model: LamarrFrequencyHoppingModel = {
    root,
    apparatusGroup,
    drum1,
    drum2,
    paperWeb,
    comb,
    receiverDrum1,
    receiverDrum2,
    receiverPaperWeb,
    receiverComb,
    receiverTrain,
    recordLink,
    bulkheadRings,
    sidePlates,
    frontDrumFlanges,
    spectrumBarsGroup,
    barMeshes,
    hopPoints,
    materials: {
      brassMat,
      pianoRollPaperMat,
      torpedoBayMat,
      goldCombMat,
      pinMat,
      hopMat,
    },
    updateKinematics,
    dispose,
  };

  return model;
}

/**
 * Updates the matched record strips, source-illustrated channel mapping, and cutaway.
 */
export function updateLamarrFrequencyHoppingKinematics(
  model: LamarrFrequencyHoppingModel,
  activeChan: number,
  receiverTuned: boolean,
  lampOn: boolean,
  isCutaway = false,
  recordSynchronizationPresent = true,
): void {
  const recordIndex = Math.max(0, Math.min(6, Math.round(activeChan)));
  const indexAngle = (recordIndex * Math.PI * 2) / 7;
  // Both source-named records index by the exact same discrete position. No
  // wall-clock spin is presented as a claimed tape speed.
  // The web is tangent to the top of both drums, so a forward paper step has
  // the same surface-velocity sign at both rollers.
  model.drum1.rotation.y = -indexAngle;
  model.drum2.rotation.y = -indexAngle;
  model.receiverDrum1.rotation.y = -indexAngle;
  model.receiverDrum2.rotation.y = -indexAngle;
  model.paperWeb.position.x = (recordIndex - 3) * 0.05;
  model.receiverPaperWeb.position.x = (recordIndex - 3) * 0.05;
  model.comb.position.y = 1.6 + (recordIndex - 3) * 0.012;
  model.receiverComb.position.y = 1.6 + (recordIndex - 3) * 0.012;
  model.receiverTrain.visible = recordSynchronizationPresent;
  model.recordLink.visible = recordSynchronizationPresent;

  const maxDisplayChannels = model.barMeshes.length;
  for (let c = 0; c < maxDisplayChannels; c++) {
    const bar = model.barMeshes[c];
    bar.visible = true;

    const mat = bar.material as THREE.MeshStandardMaterial;
    const isActive = c === activeChan;
    if (isActive) {
      bar.scale.y = receiverTuned ? 3.5 : 2.5;
      bar.position.y = 0.7;
      mat.color.setHex(receiverTuned ? 0x38bdf8 : 0xfbbf24);
      mat.emissive.setHex(receiverTuned ? 0x0284c7 : 0xb45309);
      mat.emissiveIntensity = 0.8;
    } else if (c < 3) {
      bar.scale.y = 1.6;
      bar.position.y = 0.44;
      mat.color.setHex(lampOn ? 0xf59e0b : 0x475569);
      mat.emissive.setHex(lampOn ? 0xb45309 : 0x000000);
      mat.emissiveIntensity = 0.4;
    } else {
      bar.scale.y = 1.0;
      bar.position.y = 0.2;
      mat.color.setHex(0x334155);
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0.0;
    }
  }

  // Cutaway mode: make torpedo outer aluminum shell translucent
  model.materials.torpedoBayMat.opacity = isCutaway ? 0.16 : 1.0;
  model.materials.torpedoBayMat.transparent = isCutaway;
  for (const ring of model.bulkheadRings) ring.visible = !isCutaway;
  // The default camera looks through +Z. A real section removes only that
  // facing wall while retaining the rear plate as structural context.
  model.sidePlates[0].visible = true;
  model.sidePlates[1].visible = !isCutaway;
  for (const flange of model.frontDrumFlanges) flange.visible = !isCutaway;
  (model.recordLink.material as THREE.LineBasicMaterial).color.setHex(
    receiverTuned ? 0x38bdf8 : 0xf59e0b,
  );
}
