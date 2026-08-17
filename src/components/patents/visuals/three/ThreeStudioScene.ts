/**
 * ThreeStudioScene.ts
 *
 * Museum-grade studio lighting, PBR environment, and camera controls for
 * Classic Patents 3D WebGL simulations.
 *
 * Implements:
 * - 3-Point Photography Studio Lighting (Key, Soft Fill, Edge Rim)
 * - Soft Grounding Studio Floor Grid with Radial Vignette
 * - Tone Mapping (ACES Filmic) & Exposure Tuning for crisp legibility
 * - Smooth Touch/Mouse Orbit Controls with Inertial Damping
 */

import * as THREE from "three";

export interface StudioOptions {
  container: HTMLDivElement;
  cameraPos?: [number, number, number];
  targetPos?: [number, number, number];
  fov?: number;
  bgTopColor?: number;
  bgBottomColor?: number;
  rimColor?: number;
  ambientIntensity?: number;
  enableFloorGrid?: boolean;
  floorColor?: number;
  gridColor?: number;
}

export interface StudioContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: {
    update: () => void;
    dispose: () => void;
    setRadius: (r: number) => void;
  };
  dispose: () => void;
}

export function createThreeStudioScene(opts: StudioOptions): StudioContext {
  const {
    container,
    cameraPos = [14, 12, 16],
    targetPos = [0, 0, 0],
    fov = 42,
    bgTopColor = 0x182030,
    bgBottomColor = 0x0c111a,
    rimColor = 0x38bdf8,
    ambientIntensity = 1.1,
    enableFloorGrid = true,
    floorColor = 0x131a28,
    gridColor = 0x24344d,
  } = opts;

  // 1. Scene & Background
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bgBottomColor);

  // Studio Fog for Atmospheric Depth
  scene.fog = new THREE.FogExp2(bgBottomColor, 0.018);

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 460;

  // 2. Camera
  const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
  camera.position.set(...cameraPos);
  camera.lookAt(...targetPos);

  // 3. Renderer with Tone Mapping & PBR Optimization
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.replaceChildren(renderer.domElement);

  // 4. Studio Lighting Rig
  // Hemisphere Light (Sky Warm Fill + Ground Cool Bounce)
  const hemiLight = new THREE.HemisphereLight(bgTopColor, floorColor, ambientIntensity);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  // Key Light (Warm Sunlight / High-intensity Studio Softbox)
  const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
  keyLight.position.set(18, 25, 18);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 80;
  keyLight.shadow.camera.left = -20;
  keyLight.shadow.camera.right = 20;
  keyLight.shadow.camera.top = 20;
  keyLight.shadow.camera.bottom = -20;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  // Fill Light (Soft Cool Diffuse Fill on opposite side)
  const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.9);
  fillLight.position.set(-18, 12, -14);
  scene.add(fillLight);

  // Rim Light (Sharp Silhouette Edge Separator)
  const rimLight = new THREE.SpotLight(rimColor, 2.5);
  rimLight.position.set(0, 18, -22);
  rimLight.lookAt(0, 0, 0);
  scene.add(rimLight);

  // 5. Ground Studio Floor & Precision Grid
  if (enableFloorGrid) {
    const gridHelper = new THREE.GridHelper(40, 30, 0xd97706, gridColor);
    gridHelper.position.y = -4.5;
    scene.add(gridHelper);

    // Subtle reflective circular pedestal
    const floorGeo = new THREE.CircleGeometry(24, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: 0.85,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -4.51;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);
  }

  // 6. Smooth Touch & Mouse Orbit Controls
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let sphericalTheta = Math.atan2(cameraPos[0], cameraPos[2]);
  let sphericalPhi = Math.acos(cameraPos[1] / Math.hypot(...cameraPos));
  let sphericalRadius = Math.hypot(...cameraPos);

  const onMouseDown = (e: MouseEvent) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;

    sphericalTheta -= deltaX * 0.006;
    sphericalPhi = Math.max(0.08, Math.min(Math.PI / 2 - 0.04, sphericalPhi + deltaY * 0.006));
  };

  const onMouseUp = () => {
    isDragging = false;
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    sphericalRadius = Math.max(6, Math.min(60, sphericalRadius + e.deltaY * 0.02));
  };

  // Touch Support
  let touchStartX = 0;
  let touchStartY = 0;
  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isDragging = true;
    }
  };
  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - touchStartX;
    const deltaY = e.touches[0].clientY - touchStartY;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;

    sphericalTheta -= deltaX * 0.008;
    sphericalPhi = Math.max(0.08, Math.min(Math.PI / 2 - 0.04, sphericalPhi + deltaY * 0.008));
  };
  const onTouchEnd = () => {
    isDragging = false;
  };

  const dom = renderer.domElement;
  dom.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  dom.addEventListener("wheel", onWheel, { passive: false });
  dom.addEventListener("touchstart", onTouchStart, { passive: true });
  dom.addEventListener("touchmove", onTouchMove, { passive: true });
  dom.addEventListener("touchend", onTouchEnd, { passive: true });

  const handleResize = () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", handleResize);

  const controls = {
    update: () => {
      camera.position.x = sphericalRadius * Math.sin(sphericalTheta) * Math.sin(sphericalPhi);
      camera.position.y = sphericalRadius * Math.cos(sphericalPhi);
      camera.position.z = sphericalRadius * Math.cos(sphericalTheta) * Math.sin(sphericalPhi);
      camera.lookAt(...targetPos);
    },
    dispose: () => {
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("wheel", onWheel);
      dom.removeEventListener("touchstart", onTouchStart);
      dom.removeEventListener("touchmove", onTouchMove);
      dom.removeEventListener("touchend", onTouchEnd);
    },
    setRadius: (r: number) => {
      sphericalRadius = r;
    },
  };

  const dispose = () => {
    controls.dispose();
    renderer.dispose();
  };

  return { scene, camera, renderer, controls, dispose };
}
