import { expect, test } from "bun:test";
import * as THREE from "three";
import { createCrumpFdmModel } from "./crumpFdmModel";
import { buildDaVinciModel } from "./DaVinciModel";
import { createHullStereolithographyModel } from "./hullStereolithographyModel";
import { buildKamenTransporterModel } from "./kamenTransporterModel";
import { createLemelsonMachineVisionModel } from "./lemelsonMachineVisionModel";

interface DisposableModel {
  root: THREE.Object3D;
  dispose(): void;
}

function expectPortableLinewidth(root: THREE.Object3D): void {
  const lineMaterials: THREE.LineBasicMaterial[] = [];
  root.traverse((object) => {
    if (!(object instanceof THREE.Line)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      if (material instanceof THREE.LineBasicMaterial) lineMaterials.push(material);
    }
  });

  expect(lineMaterials.length).toBeGreaterThan(0);
  for (const material of lineMaterials) {
    expect(material.linewidth).toBe(1);
  }
}

test("procedural model lines use portable one-pixel WebGL semantics", () => {
  const models: readonly DisposableModel[] = [
    buildDaVinciModel(),
    createCrumpFdmModel(),
    createHullStereolithographyModel(),
    buildKamenTransporterModel(),
    createLemelsonMachineVisionModel(),
  ];

  for (const model of models) {
    try {
      expectPortableLinewidth(model.root);
    } finally {
      model.dispose();
    }
  }
});
