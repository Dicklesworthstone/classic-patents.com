/**
 * Source-bounded procedural apparatus for Fessenden US 706,737.
 * Geometry follows the alternator, coil, cylindrical cage, receiving
 * conductor, fine wire, magnetic field, and battery/relay relationships in
 * the grant. It does not assert later detector, voice, or measured output
 * behavior.
 */
import * as THREE from "three";

export interface FessendenWirelessModelNodes {
  root: THREE.Group;
  alternatorRotor: THREE.Group;
  tuningCoil: THREE.Group;
  cageAntenna: THREE.Group;
  cageWires: THREE.Mesh[];
  waveRings: THREE.Mesh[];
  receivingConductor: THREE.Group;
  fineWire: THREE.Mesh;
  magneticField: THREE.Group;
  microphonicContact: THREE.Mesh;
  sourceRelay: THREE.Group;
  receiverInstrument: THREE.Group;
  materials: THREE.Material[];
  setCutaway?: (cutaway: boolean) => void;
}

export function buildFessendenWirelessModel(): FessendenWirelessModelNodes {
  const root = new THREE.Group();
  root.name = "fessenden-wireless-root";
  const materials: THREE.Material[] = [];
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.8, metalness: 0.1 });
  const castIronMat = new THREE.MeshStandardMaterial({ color: 0x24272c, roughness: 0.6, metalness: 0.8 });
  const copperMat = new THREE.MeshStandardMaterial({ color: 0xc86d3b, roughness: 0.3, metalness: 0.9 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.35, metalness: 0.85 });
  const porcelainMat = new THREE.MeshStandardMaterial({ color: 0xededed, roughness: 0.2, metalness: 0.1 });
  const wireMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4, metalness: 0.8, emissive: 0x0284c7, emissiveIntensity: 0.4 });
  const waveMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3, wireframe: true });
  materials.push(woodMat, castIronMat, copperMat, brassMat, porcelainMat, wireMat, waveMat);

  const bench = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 3), woodMat);
  bench.position.set(0, -0.1, 0);
  root.add(bench);

  const alternatorGroup = new THREE.Group();
  alternatorGroup.name = "alternator-source-assembly";
  alternatorGroup.position.set(-1.8, 0.4, 0);
  alternatorGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 0.9), castIronMat));
  for (const x of [-0.45, 0.45]) {
    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.3), castIronMat);
    pedestal.position.set(x, 0.25, 0);
    alternatorGroup.add(pedestal);
  }
  const stator = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.12, 16, 32), castIronMat);
  stator.position.set(0, 0.35, 0);
  alternatorGroup.add(stator);
  const alternatorRotor = new THREE.Group();
  alternatorRotor.name = "alternator-rotor";
  alternatorRotor.position.set(0, 0.35, 0);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 16), brassMat);
  shaft.rotation.z = Math.PI / 2;
  alternatorRotor.add(shaft);
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.15, 24), brassMat);
  disc.rotation.z = Math.PI / 2;
  alternatorRotor.add(disc);
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.04), copperMat);
    tooth.position.set(0, Math.sin(angle) * 0.34, Math.cos(angle) * 0.34);
    alternatorRotor.add(tooth);
  }
  alternatorGroup.add(alternatorRotor);
  root.add(alternatorGroup);

  const tuningCoil = new THREE.Group();
  tuningCoil.name = "source-resonance-coil";
  tuningCoil.position.set(-0.6, 0.4, 0);
  tuningCoil.add(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.08, 24), woodMat));
  for (let i = 0; i < 8; i++) {
    const turn = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.02, 12, 24), copperMat);
    turn.rotation.x = Math.PI / 2;
    turn.position.y = 0.1 + i * 0.08;
    tuningCoil.add(turn);
  }
  const sliderRod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 12), brassMat);
  sliderRod.position.set(0.28, 0.45, 0);
  tuningCoil.add(sliderRod);
  root.add(tuningCoil);

  const cageAntenna = new THREE.Group();
  cageAntenna.name = "cylindrical-cage-antenna";
  cageAntenna.position.set(0.5, 0.1, 0);
  cageAntenna.add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 0.3, 16), porcelainMat));
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 16), woodMat);
  mast.position.y = 1.75;
  cageAntenna.add(mast);
  const cageWires: THREE.Mesh[] = [];
  const cageRadius = 0.45;
  for (const yElev of [0.6, 1.4, 2.2, 3.0]) {
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(cageRadius, 0.012, 12, 32), brassMat);
    hoop.rotation.x = Math.PI / 2;
    hoop.position.y = yElev;
    cageAntenna.add(hoop);
  }
  for (let w = 0; w < 12; w++) {
    const angle = (w * 2 * Math.PI) / 12;
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 2.4, 8), wireMat);
    wire.position.set(Math.cos(angle) * cageRadius, 1.8, Math.sin(angle) * cageRadius);
    cageAntenna.add(wire);
    cageWires.push(wire);
    const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.45, 8), copperMat);
    lead.position.set(Math.cos(angle) * cageRadius / 2, 0.4, Math.sin(angle) * cageRadius / 2);
    lead.lookAt(0, 0.25, 0);
    lead.rotateX(Math.PI / 2);
    cageAntenna.add(lead);
  }
  root.add(cageAntenna);

  const waveRings: THREE.Mesh[] = [];
  for (let r = 0; r < 5; r++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8 + r * 0.5, 0.02, 12, 32), waveMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0.5, 1.8, 0);
    root.add(ring);
    waveRings.push(ring);
  }

  const receivingConductor = new THREE.Group();
  receivingConductor.name = "receiving-conductor-and-contact";
  receivingConductor.position.set(1.9, 0.2, 0);
  const receiverMast = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.7, 10), copperMat);
  receiverMast.position.y = 0.85;
  receivingConductor.add(receiverMast);
  receivingConductor.add(new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.05, 0.35), woodMat));
  root.add(receivingConductor);

  const fineWire = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.42, 8), copperMat);
  fineWire.name = "fine-wire-receiver-element";
  fineWire.position.set(2.35, 0.52, 0);
  fineWire.rotation.z = Math.PI / 2;
  root.add(fineWire);
  const magneticField = new THREE.Group();
  magneticField.name = "constant-or-independent-magnetic-field";
  magneticField.position.set(2.35, 0.52, 0);
  magneticField.add(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.12), castIronMat));
  root.add(magneticField);
  const microphonicContact = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), brassMat);
  microphonicContact.name = "microphonic-contact";
  microphonicContact.position.set(2.35, 0.52, 0.08);
  root.add(microphonicContact);
  const sourceRelay = new THREE.Group();
  sourceRelay.name = "battery-and-relay-circuit";
  sourceRelay.position.set(2.55, 0.18, 0);
  sourceRelay.add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), porcelainMat));
  const relay = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.12), brassMat);
  relay.position.x = 0.18;
  sourceRelay.add(relay);
  root.add(sourceRelay);
  const receiverInstrument = new THREE.Group();
  receiverInstrument.name = "telephone-receiver-instrument";
  receiverInstrument.position.set(2.75, 0.16, 0.35);
  receiverInstrument.add(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.22), castIronMat));
  root.add(receiverInstrument);

  const setCutaway = (cutaway: boolean) => {
    castIronMat.transparent = cutaway;
    castIronMat.opacity = cutaway ? 0.35 : 1;
    castIronMat.needsUpdate = true;
    woodMat.transparent = cutaway;
    woodMat.opacity = cutaway ? 0.45 : 1;
    woodMat.needsUpdate = true;
  };
  return { root, alternatorRotor, tuningCoil, cageAntenna, cageWires, waveRings, receivingConductor, fineWire, magneticField, microphonicContact, sourceRelay, receiverInstrument, materials, setCutaway };
}

export function articulateFessendenWireless(nodes: FessendenWirelessModelNodes, params: { timeSec?: number; sourcePeriodMatch?: number; distributedCapacity?: number; radiatingPortionFraction?: number; directResponse?: boolean }) {
  const timeSec = params.timeSec ?? 1;
  const sourcePeriodMatch = Math.max(0, Math.min(1, params.sourcePeriodMatch ?? 0.92));
  const distributedCapacity = Math.max(0, Math.min(1, params.distributedCapacity ?? 0.8));
  const radiatingPortionFraction = Math.max(0, Math.min(1, params.radiatingPortionFraction ?? 0.75));
  const directResponse = params.directResponse ?? true;
  const phase = (timeSec * (0.5 + sourcePeriodMatch)) % (Math.PI * 2);
  nodes.alternatorRotor.rotation.x = (timeSec * (0.35 + sourcePeriodMatch * 0.65)) % (Math.PI * 2);
  const wireGlow = 0.2 + 0.55 * distributedCapacity * Math.abs(Math.sin(phase));
  for (const wire of nodes.cageWires) {
    const material = wire.material as THREE.MeshStandardMaterial;
    material.emissive.setHex(sourcePeriodMatch >= 0.8 ? 0x10b981 : 0xf59e0b);
    material.emissiveIntensity = sourcePeriodMatch >= 0.8 ? wireGlow : wireGlow * 0.5;
  }
  for (let r = 0; r < nodes.waveRings.length; r++) {
    const ring = nodes.waveRings[r];
    const ringPhase = (timeSec * (0.25 + radiatingPortionFraction * 0.5) + r / nodes.waveRings.length) % 1;
    const scale = 0.5 + ringPhase * 2.5;
    ring.scale.set(scale, scale, scale);
    const material = ring.material as THREE.MeshBasicMaterial;
    material.opacity = Math.sin(ringPhase * Math.PI) * 0.35 * radiatingPortionFraction;
    material.color.setHex(sourcePeriodMatch >= 0.8 ? 0x38bdf8 : 0xf59e0b);
  }
  nodes.microphonicContact.position.y = 0.52 + (directResponse ? Math.sin(phase) * 0.018 : 0);
  nodes.sourceRelay.rotation.z = directResponse ? Math.sin(phase) * 0.06 : 0;
  nodes.receiverInstrument.position.y = 0.16 + (directResponse ? Math.sin(phase) * 0.004 : 0);
}
