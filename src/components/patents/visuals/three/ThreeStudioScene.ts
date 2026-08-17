/**
 * ThreeStudioScene.ts
 *
 * Museum-grade architectural studio lighting, PBR environment, particle engines,
 * and responsive orbit controls for Classic Patents 3D WebGL physics simulations.
 *
 * Provides:
 * - High-luminosity 3-Point Photography Studio Lighting (Key, Soft Fill, Edge Rim, Bounce)
 * - Auto-detecting Theme Studio Environments (Luminous Parchment & Deep Blueprint Slate)
 * - ACES Filmic Tone Mapping with High-Dynamic-Range Exposure (No dark or muddy renders)
 * - Procedural Glowing Particle Textures & Vector Field Visualizers
 * - Smooth Touch/Mouse Orbit Controls with Inertial Damping
 */

import * as THREE from "three";

export interface StudioOptions {
  container: HTMLDivElement;
  cameraPos?: [number, number, number];
  targetPos?: [number, number, number];
  fov?: number;
  isDark?: boolean;
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

/**
 * Creates a high-luminosity, crisp Three.js studio environment.
 */
export function createThreeStudioScene(opts: StudioOptions): StudioContext {
  const { container, cameraPos = [14, 12, 16], targetPos = [0, 0, 0], fov = 42 } = opts;

  // Auto-detect theme from document if not explicitly passed
  const isDark =
    opts.isDark !== undefined
      ? opts.isDark
      : typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark") ||
          document.documentElement.classList.contains("theme-blueprint")
        : false;

  // Dynamic Palette Configuration: High Clarity & Luminous Studio Lighting
  const bgTopColor = opts.bgTopColor ?? (isDark ? 0x182438 : 0xfcfaf7);
  const bgBottomColor = opts.bgBottomColor ?? (isDark ? 0x0c131f : 0xede4d4);
  const floorColor = opts.floorColor ?? (isDark ? 0x111a2c : 0xf5eedf);
  const gridColor = opts.gridColor ?? (isDark ? 0x223a5e : 0xcbbba2);
  const rimColor = opts.rimColor ?? (isDark ? 0x38bdf8 : 0xd97706);
  const ambientIntensity = opts.ambientIntensity ?? (isDark ? 1.6 : 2.0);

  // 1. Scene & Background
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bgBottomColor);

  // Gentle atmospheric fog to blend the horizon without obscuring models
  scene.fog = new THREE.FogExp2(bgBottomColor, isDark ? 0.012 : 0.008);

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 460;

  // 2. Camera
  const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
  camera.position.set(...cameraPos);
  camera.lookAt(...targetPos);

  // 3. High-Dynamic-Range WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = isDark ? 1.55 : 1.45;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.replaceChildren(renderer.domElement);

  // 4. Multi-Point Studio Lighting Rig
  // A. Sky & Ground Hemisphere Light
  const hemiLight = new THREE.HemisphereLight(bgTopColor, floorColor, ambientIntensity);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  // B. Powerful Warm Key Light (Studio Softbox)
  const keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 2.8 : 3.2);
  keyLight.position.set(20, 30, 20);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 100;
  keyLight.shadow.camera.left = -25;
  keyLight.shadow.camera.right = 25;
  keyLight.shadow.camera.top = 25;
  keyLight.shadow.camera.bottom = -25;
  keyLight.shadow.bias = -0.0003;
  scene.add(keyLight);

  // C. Fill Light (Soft Cool Diffuse Fill from opposite quadrant)
  const fillLight = new THREE.DirectionalLight(isDark ? 0x93c5fd : 0xfff8ee, isDark ? 1.5 : 1.8);
  fillLight.position.set(-20, 15, -15);
  scene.add(fillLight);

  // D. Front Uplight Bounce (Eliminates pitch-black underside shadows)
  const bounceLight = new THREE.DirectionalLight(isDark ? 0x3b82f6 : 0xfde68a, 0.9);
  bounceLight.position.set(0, -10, 15);
  scene.add(bounceLight);

  // E. Edge Rim Light (Sharp Specular Silhouette Highlight)
  const rimLight = new THREE.SpotLight(rimColor, isDark ? 3.0 : 2.2);
  rimLight.position.set(-5, 22, -25);
  rimLight.lookAt(0, 0, 0);
  scene.add(rimLight);

  // 5. Studio Pedestal Floor & Concentric Grid
  if (opts.enableFloorGrid !== false) {
    const gridHelper = new THREE.GridHelper(44, 32, isDark ? 0xf59e0b : 0xb45309, gridColor);
    gridHelper.position.y = -4.5;
    scene.add(gridHelper);

    // Reflective circular pedestal
    const floorGeo = new THREE.CircleGeometry(26, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: isDark ? 0.75 : 0.65,
      metalness: isDark ? 0.25 : 0.1,
      side: THREE.DoubleSide,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -4.51;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);
  }

  // 6. Inertial Orbit Controls
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;
  const spherical = new THREE.Spherical().setFromVector3(camera.position);
  const targetSpherical = spherical.clone();
  const centerTarget = new THREE.Vector3(...targetPos);

  const onPointerDown = (e: MouseEvent | TouchEvent) => {
    isDragging = true;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    prevX = clientX;
    prevY = clientY;
  };

  const onPointerMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const dx = (clientX - prevX) * 0.006;
    const dy = (clientY - prevY) * 0.006;

    targetSpherical.theta -= dx;
    targetSpherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, targetSpherical.phi - dy));

    prevX = clientX;
    prevY = clientY;
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    targetSpherical.radius = Math.max(6, Math.min(60, targetSpherical.radius + e.deltaY * 0.02));
  };

  const domEl = renderer.domElement;
  domEl.addEventListener("mousedown", onPointerDown);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);
  domEl.addEventListener("touchstart", onPointerDown, { passive: true });
  window.addEventListener("touchmove", onPointerMove, { passive: true });
  window.addEventListener("touchend", onPointerUp);
  domEl.addEventListener("wheel", onWheel, { passive: false });

  const onResize = () => {
    if (!container) return;
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 460;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", onResize);

  const controls = {
    update: () => {
      spherical.theta += (targetSpherical.theta - spherical.theta) * 0.12;
      spherical.phi += (targetSpherical.phi - spherical.phi) * 0.12;
      spherical.radius += (targetSpherical.radius - spherical.radius) * 0.12;

      camera.position.setFromSpherical(spherical).add(centerTarget);
      camera.lookAt(centerTarget);
    },
    dispose: () => {
      domEl.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      domEl.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      domEl.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
    },
    setRadius: (r: number) => {
      targetSpherical.radius = r;
    },
  };

  const dispose = () => {
    controls.dispose();
    renderer.dispose();
    scene.clear();
  };

  return { scene, camera, renderer, controls, dispose };
}

/**
 * Creates a soft glowing circular particle texture for flow streamlines and field lines.
 */
export function createGlowPointTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.7)");
    gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
