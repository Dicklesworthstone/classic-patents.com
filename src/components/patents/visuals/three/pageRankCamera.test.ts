import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import { stepPageRank } from "@/physics/pageRankKernel";
import { buildPageRankModel } from "./PageRankModel";
import { pageRankCameraForViewport } from "./pageRankCamera";

function projectedTabletDocumentBounds() {
  const model = buildPageRankModel();
  try {
    let ranks = [1 / 3, 1 / 3, 1 / 3];
    for (let iteration = 0; iteration < 20; iteration += 1) {
      ranks = stepPageRank({ dampingFactor: 0.85 }, ranks).ranks;
    }
    model.nodes.forEach((node, index) => {
      node.scale.setScalar(0.25 + ranks[index] * 3.2);
    });
    model.root.updateMatrixWorld(true);

    const view = pageRankCameraForViewport("iso", 718);
    const camera = new THREE.PerspectiveCamera(42, 718 / 460, 0.1, 1000);
    camera.position.set(...view.pos);
    camera.lookAt(...view.target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    const projected = model.nodes.flatMap((node) => {
      const bounds = new THREE.Box3().setFromObject(node);
      return [bounds.min.x, bounds.max.x].flatMap((x) =>
        [bounds.min.y, bounds.max.y].flatMap((y) =>
          [bounds.min.z, bounds.max.z].map((z) => new THREE.Vector3(x, y, z).project(camera)),
        ),
      );
    });
    return {
      minX: Math.min(...projected.map((point) => point.x)),
      maxX: Math.max(...projected.map((point) => point.x)),
      minY: Math.min(...projected.map((point) => point.y)),
      maxY: Math.max(...projected.map((point) => point.y)),
    };
  } finally {
    model.dispose();
  }
}

function projectedPhoneTopologyBounds(viewportWidth: number, viewportHeight: number) {
  const model = buildPageRankModel();
  try {
    let ranks = [1 / 3, 1 / 3, 1 / 3];
    for (let iteration = 0; iteration < 20; iteration += 1) {
      ranks = stepPageRank({ dampingFactor: 0.85 }, ranks).ranks;
    }
    model.nodes.forEach((node, index) => {
      node.scale.setScalar(0.25 + ranks[index] * 3.2);
    });
    model.root.updateMatrixWorld(true);

    const view = pageRankCameraForViewport("iso", viewportWidth);
    const camera = new THREE.PerspectiveCamera(42, viewportWidth / viewportHeight, 0.1, 1000);
    camera.position.set(...view.pos);
    camera.lookAt(...view.target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);

    const bounds = {
      minX: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    };
    model.root.traverse((part) => {
      if (!(part instanceof THREE.Mesh)) return;
      const positions = part.geometry.getAttribute("position");
      if (!positions) return;
      for (let index = 0; index < positions.count; index += 1) {
        const projected = new THREE.Vector3()
          .fromBufferAttribute(positions, index)
          .applyMatrix4(part.matrixWorld)
          .project(camera);
        bounds.minX = Math.min(bounds.minX, projected.x);
        bounds.maxX = Math.max(bounds.maxX, projected.x);
        bounds.minY = Math.min(bounds.minY, projected.y);
        bounds.maxY = Math.max(bounds.maxY, projected.y);
      }
    });
    return bounds;
  } finally {
    model.dispose();
  }
}

describe("US 6,285,999 PageRank responsive overview camera", () => {
  test("keeps the desktop and phone poses while giving the tablet its own safe overview", () => {
    expect(pageRankCameraForViewport("iso", 1214)).toEqual({
      pos: [0, 0.7, 12],
      target: [0, 0.7, 0],
    });
    expect(pageRankCameraForViewport("iso", 718)).toEqual({
      pos: [0, 0.5, 10.8],
      target: [0, 0.5, 0],
    });
    expect(pageRankCameraForViewport("iso", 375)).toEqual({
      pos: [0, 0.8, 17],
      target: [0, 0.8, 0],
    });
  });

  test("keeps converged ranked document nodes inside the 718 px tablet canvas", () => {
    const frame = projectedTabletDocumentBounds();

    expect(frame.minX).toBeGreaterThan(-0.9);
    expect(frame.maxX).toBeLessThan(0.9);
    expect(frame.minY).toBeGreaterThan(-0.9);
    expect(frame.maxY).toBeLessThan(0.9);
  });

  test("keeps the finite link-grid dais and converged topology inside 320 px and 375 px phone canvases", () => {
    for (const [viewportWidth, viewportHeight] of [
      [286, 380],
      [341, 380],
    ]) {
      const frame = projectedPhoneTopologyBounds(viewportWidth, viewportHeight);
      expect(frame.minX).toBeGreaterThan(-0.94);
      expect(frame.maxX).toBeLessThan(0.94);
      expect(frame.minY).toBeGreaterThan(-0.9);
      expect(frame.maxY).toBeLessThan(0.5);
    }
  });
});
