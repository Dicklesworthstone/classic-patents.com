import * as THREE from "three";
import type { WatsonRemoteCenterCompliancePose } from "@/physics/watsonRemoteCenterComplianceKernel";

export interface WatsonRemoteCenterComplianceModel {
  root: THREE.Group;
  updatePose: (pose: WatsonRemoteCenterCompliancePose) => void;
  dispose: () => void;
}

function setBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3) {
  const direction = end.clone().sub(start);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.scale.set(1, direction.length(), 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
}

/**
 * A procedural museum model from the named Figure 1 parts: machine portion
 * 18, plate 20, ring 22, flexures 24/26/28 and 56/58/60, rod 16, and the
 * Figure 7 anti-twist bellows. Its coordinates are intentionally normalized.
 */
export function buildWatsonRemoteCenterComplianceModel(): WatsonRemoteCenterComplianceModel {
  const root = new THREE.Group();
  root.name = "US 4,098,001 normalized remote-center compliance exhibit";
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const geometry = <T extends THREE.BufferGeometry>(value: T): T => {
    geometries.push(value);
    return value;
  };
  const material = <T extends THREE.Material>(value: T): T => {
    materials.push(value);
    return value;
  };

  const baseMat = material(
    new THREE.MeshStandardMaterial({ color: 0x172554, metalness: 0.78, roughness: 0.25 }),
  );
  const axialMat = material(
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.6, roughness: 0.28 }),
  );
  const radialMat = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.62, roughness: 0.25 }),
  );
  const toolMat = material(
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.84, roughness: 0.17 }),
  );
  const markerMat = material(
    new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x075985,
      emissiveIntensity: 0.85,
    }),
  );
  const twistMat = material(
    new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.72,
      metalness: 0.45,
    }),
  );

  const base = new THREE.Mesh(geometry(new THREE.CylinderGeometry(1.24, 1.24, 0.18, 40)), baseMat);
  base.name = "machine portion 18";
  base.position.y = 1.44;
  root.add(base);
  const ring = new THREE.Group();
  ring.name = "intermediate ring 22";
  ring.position.y = 0.64;
  const ringMesh = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.96, 0.96, 0.13, 40)),
    baseMat,
  );
  ringMesh.name = "ring 22";
  ring.add(ringMesh);
  root.add(ring);
  const plate = new THREE.Group();
  plate.name = "plate 20 and rod 16";
  plate.position.y = -0.2;
  const plateMesh = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.84, 0.84, 0.13, 40)),
    baseMat,
  );
  plate.add(plateMesh);
  const rod = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.16, 0.16, 1.78, 24)), toolMat);
  rod.name = "operator rod 16";
  rod.position.y = -0.96;
  plate.add(rod);
  const rodTip = new THREE.Mesh(geometry(new THREE.ConeGeometry(0.16, 0.24, 24)), toolMat);
  rodTip.name = "rod 16 free end 52";
  rodTip.position.y = -1.97;
  rodTip.rotation.x = Math.PI;
  plate.add(rodTip);
  root.add(plate);

  const axialFlexures: THREE.Mesh[] = [];
  const radialFlexures: THREE.Mesh[] = [];
  const radialGuides: THREE.Line[] = [];
  const flexureGeometry = geometry(new THREE.CylinderGeometry(0.052, 0.052, 1, 14));
  const guideMaterial = material(
    new THREE.LineDashedMaterial({ color: 0x67e8f9, dashSize: 0.09, gapSize: 0.07 }),
  );
  for (let index = 0; index < 3; index += 1) {
    const angle = (index * Math.PI * 2) / 3;
    const x = Math.cos(angle) * 0.72;
    const z = Math.sin(angle) * 0.72;
    const axial = new THREE.Mesh(flexureGeometry, axialMat);
    axial.name = `translational flexure ${[56, 58, 60][index]}`;
    root.add(axial);
    axialFlexures.push(axial);
    const radial = new THREE.Mesh(flexureGeometry, radialMat);
    radial.name = `rotational flexure ${[24, 26, 28][index]}`;
    root.add(radial);
    radialFlexures.push(radial);
    axial.userData.baseAnchor = new THREE.Vector3(x, 1.35, z);
    axial.userData.ringAnchor = new THREE.Vector3(x, 0.07, z);
    radial.userData.ringAnchor = new THREE.Vector3(x * 0.94, -0.07, z * 0.94);
    radial.userData.plateAnchor = new THREE.Vector3(x * 0.71, 0.07, z * 0.71);

    const guideGeometry = geometry(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    );
    const guide = new THREE.Line(guideGeometry, guideMaterial);
    guide.name = `virtual radius through rotational flexure ${[24, 26, 28][index]}`;
    guide.computeLineDistances();
    root.add(guide);
    radialGuides.push(guide);
  }

  const remoteCenter = new THREE.Mesh(geometry(new THREE.SphereGeometry(0.115, 20, 16)), markerMat);
  remoteCenter.name = "remote center 50";
  root.add(remoteCenter);
  const bellows = new THREE.Mesh(geometry(new THREE.TorusGeometry(0.36, 0.05, 10, 28)), twistMat);
  bellows.name = "bellows 90, claim 2 torque-resistant means";
  bellows.rotation.x = Math.PI / 2;
  bellows.position.y = 0.08;
  plate.add(bellows);
  const hole = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.35, 0.5, 0.52, 32)), baseMat);
  hole.name = "illustrative chamfered hole 71";
  hole.position.set(0.86, -2.32, 0);
  root.add(hole);

  const updatePose = (pose: WatsonRemoteCenterCompliancePose) => {
    const x = pose.translationOffset * 0.62;
    ring.position.x = x;
    plate.position.x = x;
    plate.rotation.z = (pose.remainingAxisMismatch - 0.22) * 0.38;
    for (const axial of axialFlexures) {
      const baseAnchor = axial.userData.baseAnchor as THREE.Vector3;
      const ringAnchor = ring.localToWorld((axial.userData.ringAnchor as THREE.Vector3).clone());
      setBetween(axial, baseAnchor, ringAnchor);
    }
    const toolTip = plate.localToWorld(new THREE.Vector3(0, -1.97, 0));
    const localCenter = ring.localToWorld(new THREE.Vector3(0, -0.22, 0));
    const virtualCenter = pose.remoteCenterTopology ? toolTip : localCenter;
    remoteCenter.position.copy(virtualCenter);
    for (let index = 0; index < radialFlexures.length; index += 1) {
      const radial = radialFlexures[index];
      const ringAnchor = ring.localToWorld((radial.userData.ringAnchor as THREE.Vector3).clone());
      const plateAnchor = plate.localToWorld(
        (radial.userData.plateAnchor as THREE.Vector3).clone(),
      );
      setBetween(radial, ringAnchor, plateAnchor);

      const guide = radialGuides[index];
      const position = guide.geometry.getAttribute("position") as THREE.BufferAttribute;
      position.setXYZ(0, virtualCenter.x, virtualCenter.y, virtualCenter.z);
      position.setXYZ(1, ringAnchor.x, ringAnchor.y, ringAnchor.z);
      position.needsUpdate = true;
      guide.computeLineDistances();
    }
    bellows.visible = pose.antiTwistConstraint;
    markerMat.color.setHex(pose.remoteCenterTopology ? 0x06b6d4 : 0x64748b);
    markerMat.emissive.setHex(pose.remoteCenterTopology ? 0x075985 : 0x334155);
  };

  return {
    root,
    updatePose,
    dispose: () => {
      for (const item of geometries) {
        item.dispose();
      }
      for (const item of materials) {
        item.dispose();
      }
    },
  };
}
