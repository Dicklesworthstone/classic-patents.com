import { createLcg } from "@/utils/lcg";
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

const lcg = createLcg(1630);

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
  cameraMinDistance?: number;
  cameraMaxDistance?: number;
}

export interface StudioContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: {
    update: () => void;
    dispose: () => void;
    setRadius: (r: number) => void;
    setView: (pos: [number, number, number], target: [number, number, number]) => void;
    target: { set: (x: number, y: number, z: number) => void };
  };
  updateEnvironment: () => void;
  dispose: () => void;
  cleanup: () => void;
}

/**
 * Generates a smooth procedural atmospheric sky canvas texture.
 */
function createProceduralSkyTexture(
  _isDark: boolean,
  _style: EnvironmentStyle,
): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.Texture() as unknown as THREE.CanvasTexture;
  }
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);

    // Signature Radiant Cerulean Blue Sky with Sunlight Horizon Haze
    gradient.addColorStop(0.0, "#1d4ed8"); // Rich cerulean blue zenith
    gradient.addColorStop(0.25, "#2563eb"); // Vibrant royal azure
    gradient.addColorStop(0.55, "#3b82f6"); // Radiant sky blue
    gradient.addColorStop(0.8, "#93c5fd"); // Soft daylight cyan
    gradient.addColorStop(0.96, "#e0f2fe"); // Luminous golden-sun horizon haze
    gradient.addColorStop(1.0, "#fef3c7"); // Warm sunlight horizon line

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle sun flare on the sky canvas
    const sunGradient = ctx.createRadialGradient(380, 80, 0, 380, 80, 180);
    sunGradient.addColorStop(0.0, "rgba(255, 255, 240, 0.45)");
    sunGradient.addColorStop(0.4, "rgba(254, 240, 138, 0.2)");
    sunGradient.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
    ctx.fillStyle = sunGradient;
    ctx.fillRect(0, 0, 512, 512);
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
  _isDark = false,
) {
  const cloudMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });

  const puffCount = 6 + Math.floor(lcg() * 4);
  for (let i = 0; i < puffCount; i++) {
    const radius = (2.2 + lcg() * 2.8) * scale;
    const geo = new THREE.SphereGeometry(radius, 12, 10);
    const mesh = new THREE.Mesh(geo, cloudMat);

    const ox = (lcg() - 0.5) * 8 * scale;
    const oy = (lcg() - 0.5) * 2 * scale;
    const oz = (lcg() - 0.5) * 5 * scale;

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
  const fogColor = 0xdbeafe;
  scene.fog = new THREE.FogExp2(fogColor, 0.004);

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
  renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Do not let setSize write inline pixel CSS — that fights the container and
  // retriggers ResizeObserver (black flashes while the page scrolls).
  renderer.setSize(width, height, false);
  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.touchAction = "none";
  canvas.style.outline = "none";
  canvas.style.transform = "translateZ(0)";
  container.style.isolation = "isolate";
  container.style.contain = "layout paint";
  container.style.transform = "translateZ(0)";
  container.replaceChildren(canvas);

  // 4. Studio & Sun Lighting Rig
  // A. Sky & Ground Hemisphere Light (Natural atmospheric fill)
  const hemiSkyColor = 0x38bdf8;
  const hemiGroundColor = 0xfef3c7;
  const hemiLight = new THREE.HemisphereLight(
    hemiSkyColor,
    hemiGroundColor,
    opts.ambientIntensity ?? 2.2,
  );
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  // B. Warm Golden Sun Key Light (Direct Sunbeam & Soft Shadows)
  const sunLight = new THREE.DirectionalLight(0xfffaed, opts.sunIntensity ?? 3.4);
  sunLight.position.set(28, 38, 22);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 120;
  sunLight.shadow.camera.left = -30;
  sunLight.shadow.camera.right = 30;
  sunLight.shadow.camera.top = 30;
  sunLight.shadow.camera.bottom = -30;
  sunLight.shadow.bias = -0.0002;
  scene.add(sunLight);

  // C. Fill Light (Soft cool diffuse fill from the opposite side)
  const fillLight = new THREE.DirectionalLight(0xeff6ff, 1.6);
  fillLight.position.set(-25, 18, -18);
  scene.add(fillLight);

  // D. Upward Daylight Bounce (Illuminates bottoms of wings, coils, and gears)
  const bounceLight = new THREE.DirectionalLight(0xffedd5, 1.1);
  bounceLight.position.set(0, -15, 12);
  scene.add(bounceLight);

  // E. Specular Rim / Sunlight Edge Highlight
  const rimLight = new THREE.SpotLight(0xfef08a, 2.2);
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

  // 7. Inertial Orbit & Multi-Touch Gesture Engine (Full iPhone/iPad/Desktop parity)
  const initialCenter = new THREE.Vector3(...targetPos);
  const initialCamPos = camera.position.clone();
  const centerTarget = initialCenter.clone();
  const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(centerTarget));
  const targetSpherical = spherical.clone();
  const isReducedMotion = checkPrefersReducedMotion();

  // Multi-pointer and touch state tracking
  const activePointers = new Map<number, { x: number; y: number }>();
  let isDragging = false;
  let isPinching = false;
  let isPanning = false;

  let prevSingleX = 0;
  let prevSingleY = 0;
  let velTheta = 0;
  let velPhi = 0;

  let initialPinchDist = 0;
  let initialPinchRadius = 0;
  let prevPinchMidX = 0;
  let prevPinchMidY = 0;

  let lastTapTime = 0;

  const minRadius = Math.max(2.0, opts.cameraMinDistance ?? 2.0);
  const maxRadius = Math.min(65.0, opts.cameraMaxDistance ?? 65.0);

  const domEl = renderer.domElement;
  domEl.style.touchAction = "none";
  domEl.style.userSelect = "none";
  domEl.style.webkitUserSelect = "none";
  if (container) {
    container.style.touchAction = "none";
    container.style.userSelect = "none";
  }

  // Pan helper: translate centerTarget in camera plane
  const panCamera = (deltaX: number, deltaY: number) => {
    const factor = (targetSpherical.radius / 800) * 1.2;
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    centerTarget.addScaledVector(right, -deltaX * factor);
    centerTarget.addScaledVector(up, deltaY * factor);
  };

  // Reset to initial framing on double-tap
  const resetFraming = () => {
    centerTarget.copy(initialCenter);
    const offset = initialCamPos.clone().sub(initialCenter);
    targetSpherical.setFromVector3(offset);
    velTheta = 0;
    velPhi = 0;
  };

  // Native Touch Handlers for iOS Safari & Android
  const onTouchStart = (e: TouchEvent) => {
    if (e.cancelable) e.preventDefault();

    const now = Date.now();
    if (now - lastTapTime < 320 && e.touches.length === 1) {
      resetFraming();
      lastTapTime = 0;
      return;
    }
    lastTapTime = now;

    if (e.touches.length === 1) {
      const t = e.touches[0];
      isDragging = true;
      isPinching = false;
      isPanning = false;
      prevSingleX = t.clientX;
      prevSingleY = t.clientY;
      velTheta = 0;
      velPhi = 0;
    } else if (e.touches.length >= 2) {
      isDragging = false;
      isPinching = true;
      isPanning = true;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      initialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      initialPinchRadius = targetSpherical.radius;
      prevPinchMidX = (t1.clientX + t2.clientX) / 2;
      prevPinchMidY = (t1.clientY + t2.clientY) / 2;
      velTheta = 0;
      velPhi = 0;
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    // Only prevent default native scrolling if we are actively dragging/pinching the 3D scene.
    // Otherwise, this breaks all page scrolling on mobile devices when attached to window!
    if ((isDragging || isPinching || isPanning) && e.cancelable) {
      e.preventDefault();
    }

    if (isDragging && e.touches.length === 1) {
      const t = e.touches[0];
      const dx = (t.clientX - prevSingleX) * 0.0075;
      const dy = (t.clientY - prevSingleY) * 0.0075;

      velTheta = -dx;
      velPhi = -dy;

      targetSpherical.theta -= dx;
      targetSpherical.phi = Math.max(0.04, Math.min(Math.PI - 0.04, targetSpherical.phi - dy));

      prevSingleX = t.clientX;
      prevSingleY = t.clientY;
    } else if (isPinching && e.touches.length >= 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (initialPinchDist > 0 && dist > 0) {
        const pinchFactor = initialPinchDist / dist;
        targetSpherical.radius = Math.max(
          minRadius,
          Math.min(maxRadius, initialPinchRadius * pinchFactor),
        );
      }

      // Two-finger pan
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;
      panCamera(midX - prevPinchMidX, midY - prevPinchMidY);
      prevPinchMidX = midX;
      prevPinchMidY = midY;
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (e.touches.length === 0) {
      isDragging = false;
      isPinching = false;
      isPanning = false;
    } else if (e.touches.length === 1) {
      isPinching = false;
      isPanning = false;
      isDragging = true;
      const t = e.touches[0];
      prevSingleX = t.clientX;
      prevSingleY = t.clientY;
    }
  };

  const onGesturePrevent = (e: Event) => {
    if (e.cancelable) e.preventDefault();
  };

  // Pointer Event Handlers (Desktop Mouse & Stylus)
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "touch") return; // Touch is handled by native touch listeners above
    try {
      domEl.setPointerCapture(e.pointerId);
    } catch {
      // Ignored if unsupported
    }
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (e.button === 2 || e.shiftKey) {
      isPanning = true;
      isDragging = false;
    } else {
      isDragging = true;
      isPanning = false;
    }
    prevSingleX = e.clientX;
    prevSingleY = e.clientY;
    velTheta = 0;
    velPhi = 0;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (!activePointers.has(e.pointerId)) return;
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const dx = e.clientX - prevSingleX;
    const dy = e.clientY - prevSingleY;

    if (isPanning) {
      panCamera(dx, dy);
    } else if (isDragging) {
      velTheta = -dx * 0.007;
      velPhi = -dy * 0.007;

      targetSpherical.theta -= dx * 0.007;
      targetSpherical.phi = Math.max(
        0.04,
        Math.min(Math.PI - 0.04, targetSpherical.phi - dy * 0.007),
      );
    }

    prevSingleX = e.clientX;
    prevSingleY = e.clientY;
  };

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    try {
      if (domEl.hasPointerCapture(e.pointerId)) {
        domEl.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignored
    }
    activePointers.delete(e.pointerId);
    if (activePointers.size === 0) {
      isDragging = false;
      isPanning = false;
    }
  };

  const onPointerCancel = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    try {
      if (domEl.hasPointerCapture(e.pointerId)) {
        domEl.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignored
    }
    activePointers.delete(e.pointerId);
    isDragging = false;
    isPanning = false;
  };

  // Wheel Zoom (Trackpad pinch & mouse wheel)
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY * 0.02;
    targetSpherical.radius = Math.max(
      minRadius,
      Math.min(maxRadius, targetSpherical.radius + zoomFactor),
    );
  };

  // Prevent context menu on right-click drag
  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  // Register Event Listeners
  domEl.addEventListener("touchstart", onTouchStart, { passive: false });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: false });
  window.addEventListener("touchcancel", onTouchEnd, { passive: false });

  domEl.addEventListener("gesturestart", onGesturePrevent, { passive: false });
  domEl.addEventListener("gesturechange", onGesturePrevent, { passive: false });
  domEl.addEventListener("gestureend", onGesturePrevent, { passive: false });

  domEl.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerCancel);
  domEl.addEventListener("wheel", onWheel, { passive: false });
  domEl.addEventListener("contextmenu", onContextMenu);

  let lastResizeW = width;
  let lastResizeH = height;
  const applyViewportSize = () => {
    if (!container) return;
    const w = Math.max(1, Math.round(container.clientWidth || 600));
    const h = Math.max(1, Math.round(container.clientHeight || 460));
    if (Math.abs(w - lastResizeW) < 2 && Math.abs(h - lastResizeH) < 2) return;
    lastResizeW = w;
    lastResizeH = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  const resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          applyViewportSize();
        })
      : null;
  if (resizeObserver) {
    resizeObserver.observe(container);
  } else {
    window.addEventListener("resize", applyViewportSize);
  }

  const controls = {
    update: () => {
      // Inertial coasting when finger or mouse is released
      if (!isDragging && !isPinching && !isPanning && !isReducedMotion) {
        if (Math.abs(velTheta) > 0.00005 || Math.abs(velPhi) > 0.00005) {
          targetSpherical.theta += velTheta;
          targetSpherical.phi = Math.max(
            0.04,
            Math.min(Math.PI - 0.04, targetSpherical.phi + velPhi),
          );
          velTheta *= 0.92;
          velPhi *= 0.92;
        }
      }

      spherical.theta += (targetSpherical.theta - spherical.theta) * 0.14;
      spherical.phi += (targetSpherical.phi - spherical.phi) * 0.14;
      spherical.radius += (targetSpherical.radius - spherical.radius) * 0.14;

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
      domEl.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);

      domEl.removeEventListener("gesturestart", onGesturePrevent);
      domEl.removeEventListener("gesturechange", onGesturePrevent);
      domEl.removeEventListener("gestureend", onGesturePrevent);

      domEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      domEl.removeEventListener("wheel", onWheel);
      domEl.removeEventListener("contextmenu", onContextMenu);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", applyViewportSize);
      }
    },
    setRadius: (r: number) => {
      targetSpherical.radius = r;
    },
    setView: (pos: [number, number, number], target: [number, number, number]) => {
      centerTarget.set(target[0], target[1], target[2]);
      camera.position.set(pos[0], pos[1], pos[2]);
      const offset = camera.position.clone().sub(centerTarget);
      if (offset.lengthSq() < 1e-8) {
        offset.set(0, 0, 10);
      }
      spherical.setFromVector3(offset);
      targetSpherical.copy(spherical);
    },
    // Compatibility for scenes that still call OrbitControls-style `controls.target.set`.
    // Must run *after* camera.position.set so the spherical is rebuilt from the new pose.
    target: {
      set: (x: number, y: number, z: number) => {
        centerTarget.set(x, y, z);
        const offset = camera.position.clone().sub(centerTarget);
        if (offset.lengthSq() < 1e-8) {
          offset.set(0, 0, 10);
        }
        spherical.setFromVector3(offset);
        targetSpherical.copy(spherical);
      },
    },
  };

  let activeSkyTexture: THREE.CanvasTexture = skyTexture;

  const updateEnvironment = () => {
    if (typeof document === "undefined") return;
    const nextSky = createProceduralSkyTexture(false, environmentStyle);
    scene.background = nextSky;
    activeSkyTexture.dispose();
    activeSkyTexture = nextSky;
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.004);
  };

  const dispose = () => {
    controls.dispose();
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
        obj.geometry?.dispose();
        const material = obj.material;
        const disposeMat = (mat: THREE.Material) => {
          const mapped = mat as THREE.Material & { map?: THREE.Texture | null };
          mapped.map?.dispose();
          mat.dispose();
        };
        if (Array.isArray(material)) {
          for (const mat of material) disposeMat(mat);
        } else if (material) {
          disposeMat(material);
        }
      }
    });
    activeSkyTexture.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    scene.clear();
  };

  return { scene, camera, renderer, controls, updateEnvironment, dispose, cleanup: dispose };
}

/**
 * Creates a glowing circular point particle texture for streamlines and sparks.
 */
export function createGlowPointTexture(): THREE.Texture {
  if (typeof document === "undefined") {
    return new THREE.Texture();
  }
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
