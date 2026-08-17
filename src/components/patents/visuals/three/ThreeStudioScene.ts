/**
 * ThreeStudioScene.ts
 *
 * Museum-grade architectural studio lighting, vibrant atmospheric blue sky with
 * procedural cumulus clouds, high-luminosity sun illumination, and responsive orbit controls
 * for Classic Patents 3D WebGL physics simulations.
 *
 * Provides:
 * - Vibrant Blue Sky with Procedural Fluffy 3D Cumulus Clouds
 * - Warm Natural Sunlight with Soft Shadow Casting (PCF Soft Shadows)
 * - ACES Filmic Tone Mapping with High Dynamic Range Exposure (Zero dark/muddy renders)
 * - Auto-detecting Theme Studio & Sky Environments
 * - Smooth Touch/Mouse Orbit Controls with Inertial Damping
 * - Reduced Motion Awareness
 */

import * as THREE from "three";

export type EnvironmentStyle = "sky" | "studio" | "laboratory" | "ocean";

export interface StudioOptions {
  container: HTMLDivElement;
  cameraPos?: [number, number, number];
  targetPos?: [number, number, number];
  fov?: number;
  isDark?: boolean;
  environmentStyle?: EnvironmentStyle;
  enableClouds?: boolean;
  enableFloorGrid?: boolean;
  floorColor?: number;
  gridColor?: number;
  ambientIntensity?: number;
  sunIntensity?: number;
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
  updateEnvironment: () => void;
  dispose: () => void;
}

/**
 * Generates a smooth procedural atmospheric sky canvas texture.
 */
function createProceduralSkyTexture(isDark: boolean, style: EnvironmentStyle): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);

    if (isDark) {
      // Crisp Twilight / Starlit Horizon
      gradient.addColorStop(0.0, "#0b1329"); // Deep midnight zenith
      gradient.addColorStop(0.4, "#162544"); // Navy mid-sky
      gradient.addColorStop(0.7, "#1e3a5f"); // Cobalt lower sky
      gradient.addColorStop(0.95, "#2563eb"); // Electric blue horizon glow
      gradient.addColorStop(1.0, "#1d4ed8"); // Horizon haze
    } else if (style === "studio" || style === "laboratory") {
      // Bright Sunlit Architectural Studio
      gradient.addColorStop(0.0, "#e0f2fe"); // Soft ice-blue ceiling
      gradient.addColorStop(0.3, "#f0f9ff"); // Luminous daylight
      gradient.addColorStop(0.7, "#f8fafc"); // Clean museum white
      gradient.addColorStop(1.0, "#e2e8f0"); // Soft shadow floor
    } else {
      // Crisp Radiant Blue Sky with Horizon Haze
      gradient.addColorStop(0.0, "#1d4ed8"); // Rich cerulean blue zenith
      gradient.addColorStop(0.25, "#2563eb"); // Vibrant royal azure
      gradient.addColorStop(0.55, "#3b82f6"); // Radiant sky blue
      gradient.addColorStop(0.8, "#93c5fd"); // Soft daylight cyan
      gradient.addColorStop(0.96, "#e0f2fe"); // Luminous golden-sun horizon haze
      gradient.addColorStop(1.0, "#fef3c7"); // Warm sunlight horizon line
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle sun flare on the sky canvas
    if (!isDark) {
      const sunGradient = ctx.createRadialGradient(380, 80, 0, 380, 80, 180);
      sunGradient.addColorStop(0.0, "rgba(255, 255, 240, 0.45)");
      sunGradient.addColorStop(0.4, "rgba(254, 240, 138, 0.2)");
      sunGradient.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
      ctx.fillStyle = sunGradient;
      ctx.fillRect(0, 0, 512, 512);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates 3D procedural fluffy cumulus clouds that float and drift in the sky.
 */
function createCumulusCloudPuff(
  cloudGroup: THREE.Group,
  baseX: number,
  baseY: number,
  baseZ: number,
  scale = 1.0,
  isDark = false,
) {
  const cloudMat = new THREE.MeshLambertMaterial({
    color: isDark ? 0x93c5fd : 0xffffff,
    transparent: true,
    opacity: isDark ? 0.4 : 0.85,
    depthWrite: false,
  });

  const puffCount = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < puffCount; i++) {
    const radius = (2.2 + Math.random() * 2.8) * scale;
    const geo = new THREE.SphereGeometry(radius, 12, 10);
    const mesh = new THREE.Mesh(geo, cloudMat);

    const ox = (Math.random() - 0.5) * 8 * scale;
    const oy = (Math.random() - 0.5) * 2 * scale;
    const oz = (Math.random() - 0.5) * 5 * scale;

    mesh.position.set(baseX + ox, baseY + oy, baseZ + oz);
    mesh.scale.set(1.4, 0.8, 1.0); // Flatten puffs into cumulus horizontal shape
    cloudGroup.add(mesh);
  }
}

/**
 * Checks whether user prefers reduced motion in OS/browser.
 */
export function checkPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Creates a high-luminosity, beautiful blue sky & studio environment for Three.js.
 */
export function createThreeStudioScene(opts: StudioOptions): StudioContext {
  const {
    container,
    cameraPos = [14, 12, 16],
    targetPos = [0, 0, 0],
    fov = 42,
    environmentStyle = "sky",
    enableClouds = true,
  } = opts;

  // Auto-detect theme
  const isDark =
    opts.isDark !== undefined
      ? opts.isDark
      : typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark") ||
          document.documentElement.classList.contains("theme-blueprint")
        : false;

  // 1. Scene & Background Sky
  const scene = new THREE.Scene();
  const skyTexture = createProceduralSkyTexture(isDark, environmentStyle);
  scene.background = skyTexture;

  // Atmospheric Fog: Matches horizon for soft atmospheric depth
  const fogColor = isDark ? 0x162544 : 0xdbeafe;
  scene.fog = new THREE.FogExp2(fogColor, isDark ? 0.008 : 0.004);

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
  renderer.toneMappingExposure = isDark ? 1.4 : 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.domElement.style.touchAction = "pan-y";
  container.replaceChildren(renderer.domElement);

  // 4. Studio & Sun Lighting Rig
  // A. Sky & Ground Hemisphere Light (Natural atmospheric fill)
  const hemiSkyColor = isDark ? 0x60a5fa : 0x38bdf8;
  const hemiGroundColor = isDark ? 0x1e293b : 0xfef3c7;
  const hemiLight = new THREE.HemisphereLight(
    hemiSkyColor,
    hemiGroundColor,
    opts.ambientIntensity ?? (isDark ? 1.8 : 2.2),
  );
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  // B. Warm Golden Sun Key Light (Direct Sunbeam & Soft Shadows)
  const sunLight = new THREE.DirectionalLight(
    isDark ? 0xffffff : 0xfffaed,
    opts.sunIntensity ?? (isDark ? 3.0 : 3.4),
  );
  sunLight.position.set(28, 38, 22);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 120;
  sunLight.shadow.camera.left = -30;
  sunLight.shadow.camera.right = 30;
  sunLight.shadow.camera.top = 30;
  sunLight.shadow.camera.bottom = -30;
  sunLight.shadow.bias = -0.0002;
  scene.add(sunLight);

  // C. Fill Light (Soft cool diffuse fill from the opposite side)
  const fillLight = new THREE.DirectionalLight(isDark ? 0x93c5fd : 0xeff6ff, isDark ? 1.4 : 1.6);
  fillLight.position.set(-25, 18, -18);
  scene.add(fillLight);

  // D. Upward Daylight Bounce (Illuminates bottoms of wings, coils, and gears)
  const bounceLight = new THREE.DirectionalLight(isDark ? 0x38bdf8 : 0xffedd5, 1.1);
  bounceLight.position.set(0, -15, 12);
  scene.add(bounceLight);

  // E. Specular Rim / Sunlight Edge Highlight
  const rimLight = new THREE.SpotLight(isDark ? 0x38bdf8 : 0xfef08a, isDark ? 2.5 : 2.2);
  rimLight.position.set(-15, 25, -28);
  rimLight.lookAt(0, 0, 0);
  scene.add(rimLight);

  // 5. 3D Cumulus Clouds Layer
  const cloudsGroup = new THREE.Group();
  if (enableClouds) {
    // Generate scattered puffy clouds across the sky background
    createCumulusCloudPuff(cloudsGroup, -45, 18, -40, 1.2, isDark);
    createCumulusCloudPuff(cloudsGroup, 20, 22, -50, 1.5, isDark);
    createCumulusCloudPuff(cloudsGroup, -15, 26, -60, 1.8, isDark);
    createCumulusCloudPuff(cloudsGroup, 50, 20, -35, 1.1, isDark);
    createCumulusCloudPuff(cloudsGroup, -60, 24, -45, 1.4, isDark);
    createCumulusCloudPuff(cloudsGroup, 5, 28, -70, 2.0, isDark);
    scene.add(cloudsGroup);
  }

  // 6. Ground Pedestal / Architectural Floor & Grid
  if (opts.enableFloorGrid !== false) {
    const gridHelper = new THREE.GridHelper(
      48,
      32,
      isDark ? 0x38bdf8 : 0xd97706,
      isDark ? 0x1e3a8a : 0x93c5fd,
    );
    gridHelper.position.y = -4.5;
    scene.add(gridHelper);

    // Luminous shadow-receiving circular pedestal ground
    const floorGeo = new THREE.CircleGeometry(28, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: opts.floorColor ?? (isDark ? 0x0f172a : 0xf1f5f9),
      roughness: 0.7,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -4.51;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);
  }

  // 7. Inertial Orbit Controls
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;
  const centerTarget = new THREE.Vector3(...targetPos);
  const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(centerTarget));
  const targetSpherical = spherical.clone();
  const isReducedMotion = checkPrefersReducedMotion();

  const pointerClient = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      if (!touch) return null;
      return { x: touch.clientX, y: touch.clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const onPointerDown = (e: MouseEvent | TouchEvent) => {
    const point = pointerClient(e);
    if (!point) return;
    isDragging = true;
    prevX = point.x;
    prevY = point.y;
  };

  const onPointerMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const point = pointerClient(e);
    if (!point) return;
    const clientX = point.x;
    const clientY = point.y;
    const dx = (clientX - prevX) * 0.006;
    const dy = (clientY - prevY) * 0.006;

    targetSpherical.theta -= dx;
    targetSpherical.phi = Math.max(0.08, Math.min(Math.PI / 2 - 0.05, targetSpherical.phi - dy));

    prevX = clientX;
    prevY = clientY;
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  const onWheel = (e: WheelEvent) => {
    // Only capture wheel for 3D zoom if modifier is held (Ctrl/Cmd) or during active dragging
    // to allow natural vertical document scrolling when hovering over 3D canvases
    if (e.ctrlKey || e.metaKey || isDragging) {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.02;
      targetSpherical.radius = Math.max(4, Math.min(55, targetSpherical.radius + zoomFactor));
    }
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
  const resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          onResize();
        })
      : null;
  resizeObserver?.observe(container);

  const controls = {
    update: () => {
      spherical.theta += (targetSpherical.theta - spherical.theta) * 0.12;
      spherical.phi += (targetSpherical.phi - spherical.phi) * 0.12;
      spherical.radius += (targetSpherical.radius - spherical.radius) * 0.12;

      camera.position.setFromSpherical(spherical).add(centerTarget);
      camera.lookAt(centerTarget);

      // Cloud drift animation across the sky
      if (enableClouds && !isReducedMotion) {
        cloudsGroup.position.x += 0.012;
        if (cloudsGroup.position.x > 80) {
          cloudsGroup.position.x = -80;
        }
      }
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
      resizeObserver?.disconnect();
    },
    setRadius: (r: number) => {
      targetSpherical.radius = r;
    },
  };

  let activeSkyTexture: THREE.CanvasTexture = skyTexture;

  const updateEnvironment = () => {
    const currentIsDark =
      document.documentElement.classList.contains("dark") ||
      document.documentElement.classList.contains("theme-blueprint");
    const nextSky = createProceduralSkyTexture(currentIsDark, environmentStyle);
    scene.background = nextSky;
    activeSkyTexture.dispose();
    activeSkyTexture = nextSky;
    scene.fog = new THREE.FogExp2(
      currentIsDark ? 0x162544 : 0xdbeafe,
      currentIsDark ? 0.008 : 0.004,
    );
  };

  const dispose = () => {
    controls.dispose();
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
        obj.geometry?.dispose();
        const material = obj.material;
        if (Array.isArray(material)) {
          for (const mat of material) mat.dispose();
        } else {
          material?.dispose();
        }
      }
    });
    activeSkyTexture.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    scene.clear();
  };

  return { scene, camera, renderer, controls, updateEnvironment, dispose };
}

/**
 * Creates a glowing circular point particle texture for streamlines and sparks.
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
