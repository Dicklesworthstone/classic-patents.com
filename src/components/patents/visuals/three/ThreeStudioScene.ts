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
  /** True while the canvas intersects the viewport (true until first IO callback). */
  isVisible: () => boolean;
  dispose: () => void;
  cleanup: () => void;
}

/**
 * A finger must travel far enough to express an intentional horizontal orbit
 * before the studio takes ownership. Until then, vertical movement remains a
 * normal document scroll.
 */
export const TOUCH_ORBIT_THRESHOLD_PX = 8;

export type SingleTouchGestureIntent = "pending" | "scroll" | "orbit";

/**
 * Classify the initial one-finger movement without consuming a vertical page
 * scroll. Ties deliberately favor scrolling so a diagonal reading gesture
 * does not unexpectedly rotate the model.
 */
export function classifySingleTouchGesture(
  deltaX: number,
  deltaY: number,
): SingleTouchGestureIntent {
  const horizontalDistance = Math.abs(deltaX);
  const verticalDistance = Math.abs(deltaY);

  if (Math.max(horizontalDistance, verticalDistance) < TOUCH_ORBIT_THRESHOLD_PX) {
    return "pending";
  }

  return horizontalDistance > verticalDistance ? "orbit" : "scroll";
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

    // Natural, luminous, realistic daylight sky with soft horizon haze
    gradient.addColorStop(0.0, "#60a5fa"); // Soft sky blue zenith
    gradient.addColorStop(0.28, "#93c5fd"); // Light azure mid-sky
    gradient.addColorStop(0.65, "#bae6fd"); // Gentle airy daylight
    gradient.addColorStop(0.88, "#e0f2fe"); // Soft luminous horizon haze
    gradient.addColorStop(1.0, "#fef3c7"); // Subtle warm sunlit horizon line

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle natural sun flare on the sky canvas
    const sunGradient = ctx.createRadialGradient(380, 80, 0, 380, 80, 200);
    sunGradient.addColorStop(0.0, "rgba(255, 255, 245, 0.4)");
    sunGradient.addColorStop(0.4, "rgba(254, 243, 199, 0.18)");
    sunGradient.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
    ctx.fillStyle = sunGradient;
    ctx.fillRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates 3D procedural fluffy cumulus clouds that float and drift in the sky in all 360 degrees.
 */
function createCumulusCloudPuff(
  cloudGroup: THREE.Group,
  baseX: number,
  baseY: number,
  baseZ: number,
  scale = 1.0,
) {
  const cloudMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.88,
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
        ? document.documentElement.classList.contains("dark")
        : false;

  // 1. Scene & Background Sky
  const scene = new THREE.Scene();
  const skyTexture = createProceduralSkyTexture(isDark, environmentStyle);
  scene.background = skyTexture;

  // Atmospheric Fog: Matches horizon for soft atmospheric depth
  const fogColor = 0xdbeafe;
  scene.fog = new THREE.FogExp2(fogColor, 0.003);

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
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // Do not let setSize write inline pixel CSS — that fights the container and
  // retriggers ResizeObserver (black flashes while the page scrolls).
  renderer.setSize(width, height, false);
  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  // Preserve ordinary vertical document scrolling. The gesture engine claims
  // only an intentional horizontal orbit or a two-finger camera gesture.
  canvas.style.touchAction = "pan-y";
  canvas.style.outline = "none";
  canvas.style.transform = "translateZ(0)";
  container.style.isolation = "isolate";
  container.style.contain = "layout paint";
  container.style.transform = "translateZ(0)";
  container.replaceChildren(canvas);

  // Mobile GPU resets silently kill WebGL contexts. preventDefault on loss
  // keeps the context restorable; three.js re-uploads programs, geometries,
  // and textures lazily on restore, so the next rendered frame just works
  // instead of leaving a frozen black canvas until a manual remount.
  const onContextLost = (e: Event) => {
    e.preventDefault();
  };
  const onContextRestored = () => {
    // No explicit action: three.js re-initializes GL state on next render.
  };
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  // 4. Studio & Sun Lighting Rig
  // A. Sky & Ground Hemisphere Light (Natural atmospheric fill)
  const hemiSkyColor = 0x38bdf8;
  const hemiGroundColor = 0xfef3c7;
  const hemiLight = new THREE.HemisphereLight(
    hemiSkyColor,
    hemiGroundColor,
    opts.ambientIntensity ?? 2.4,
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
  const bounceLight = new THREE.DirectionalLight(0xffedd5, 1.2);
  bounceLight.position.set(0, -15, 12);
  scene.add(bounceLight);

  // E. Specular Rim / Sunlight Edge Highlight
  const rimLight = new THREE.SpotLight(0xfef08a, 2.2);
  rimLight.position.set(-15, 25, -28);
  rimLight.lookAt(0, 0, 0);
  scene.add(rimLight);

  // 5. 3D 360-Degree Cumulus Clouds Layer (Surrounds the model at all angles)
  const cloudsGroup = new THREE.Group();
  if (enableClouds) {
    // Generate scattered puffy clouds across all 360 degrees of azimuth
    const cloudAngles = [
      0,
      Math.PI / 4,
      Math.PI / 2,
      (3 * Math.PI) / 4,
      Math.PI,
      (5 * Math.PI) / 4,
      (3 * Math.PI) / 2,
      (7 * Math.PI) / 4,
    ];
    cloudAngles.forEach((angle, idx) => {
      const radius = 55 + (idx % 3) * 12;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 16 + (idx % 4) * 4;
      const scale = 1.1 + (idx % 3) * 0.35;
      createCumulusCloudPuff(cloudsGroup, x, y, z, scale);
    });
    scene.add(cloudsGroup);
  }

  // 6. Ground Pedestal / Architectural Floor & Grid
  if (opts.enableFloorGrid !== false) {
    const gridHelper = new THREE.GridHelper(48, 32, 0x0284c7, 0x93c5fd);
    gridHelper.position.y = -4.5;
    if (gridHelper.material && "opacity" in gridHelper.material) {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.45;
    }
    scene.add(gridHelper);

    // Luminous shadow-receiving circular pedestal ground (soft semi-transparent to let sky breathe)
    const floorGeo = new THREE.CircleGeometry(32, 64);
    const floorMat = new THREE.ShadowMaterial({
      opacity: 0.22,
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

  // Multi-pointer state tracking (unifies mouse, pen, and touch)
  const activePointers = new Map<number, { x: number; y: number; pointerType: string }>();
  type TouchGesture = "idle" | "pending" | "scroll" | "orbit" | "pinch";
  let touchGesture: TouchGesture = "idle";
  let touchStartX = 0;
  let touchStartY = 0;
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

  const minRadius = Math.max(1.5, opts.cameraMinDistance ?? 1.5);
  const maxRadius = Math.min(80.0, opts.cameraMaxDistance ?? 80.0);

  const domEl = renderer.domElement;
  domEl.style.touchAction = "pan-y";
  domEl.style.userSelect = "none";
  domEl.style.webkitUserSelect = "none";
  if (container) {
    container.style.touchAction = "pan-y";
    container.style.userSelect = "none";
  }

  const activeTouchPointers = () =>
    Array.from(activePointers.values()).filter((pointer) => pointer.pointerType === "touch");

  const armSingleTouch = (point: { x: number; y: number }) => {
    touchGesture = "pending";
    isDragging = false;
    isPinching = false;
    isPanning = false;
    touchStartX = point.x;
    touchStartY = point.y;
    prevSingleX = point.x;
    prevSingleY = point.y;
    velTheta = 0;
    velPhi = 0;
  };

  const beginPinchGesture = (points: readonly { x: number; y: number }[]) => {
    const [firstPoint, secondPoint] = points;
    if (!firstPoint || !secondPoint) return;

    touchGesture = "pinch";
    isDragging = false;
    isPinching = true;
    isPanning = true;
    initialPinchDist = Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);
    initialPinchRadius = targetSpherical.radius;
    prevPinchMidX = (firstPoint.x + secondPoint.x) / 2;
    prevPinchMidY = (firstPoint.y + secondPoint.y) / 2;
    velTheta = 0;
    velPhi = 0;
  };

  // Pan helper: translate centerTarget in camera plane
  const panCamera = (deltaX: number, deltaY: number) => {
    const factor = (targetSpherical.radius / 800) * 1.2;
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    centerTarget.addScaledVector(right, -deltaX * factor);
    centerTarget.addScaledVector(up, deltaY * factor);
  };

  // Reset to initial framing
  const resetFraming = () => {
    centerTarget.copy(initialCenter);
    const offset = initialCamPos.clone().sub(initialCenter);
    targetSpherical.setFromVector3(offset);
    velTheta = 0;
    velPhi = 0;
  };

  // Unified Pointer Handlers with Window Tracking for uninhibited dragging
  const onPointerDown = (e: PointerEvent) => {
    activePointers.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY,
      pointerType: e.pointerType,
    });

    if (e.pointerType === "touch") {
      const touchPointers = activeTouchPointers();
      if (touchPointers.length >= 2) {
        beginPinchGesture(touchPointers);
        if (e.cancelable) e.preventDefault();
      } else {
        const touchPointer = touchPointers[0];
        if (touchPointer) armSingleTouch(touchPointer);
      }
    } else if (activePointers.size === 1) {
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
    } else if (activePointers.size >= 2) {
      beginPinchGesture(Array.from(activePointers.values()));
    }

    if (typeof window !== "undefined") {
      window.addEventListener("pointermove", onPointerMove, { passive: false });
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    const pointer = activePointers.get(e.pointerId);
    if (!pointer) return;
    activePointers.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY,
      pointerType: pointer.pointerType,
    });

    const touchPointers = activeTouchPointers();
    if (touchPointers.length >= 2) {
      if (touchGesture !== "pinch") beginPinchGesture(touchPointers);
      // `touch-action: pan-y` retains vertical page scroll for an idle finger.
      // Only an active two-finger camera gesture suppresses browser handling.
      if (e.cancelable) e.preventDefault();

      const [firstPoint, secondPoint] = touchPointers;
      if (!firstPoint || !secondPoint) return;
      const dist = Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);
      if (initialPinchDist > 0 && dist > 0) {
        const pinchFactor = initialPinchDist / dist;
        targetSpherical.radius = Math.max(
          minRadius,
          Math.min(maxRadius, initialPinchRadius * pinchFactor),
        );
      }

      const midX = (firstPoint.x + secondPoint.x) / 2;
      const midY = (firstPoint.y + secondPoint.y) / 2;
      panCamera(midX - prevPinchMidX, midY - prevPinchMidY);
      prevPinchMidX = midX;
      prevPinchMidY = midY;
      return;
    }

    if (pointer.pointerType === "touch") {
      if (touchGesture === "pending") {
        const intent = classifySingleTouchGesture(e.clientX - touchStartX, e.clientY - touchStartY);
        if (intent === "pending") return;
        if (intent === "scroll") {
          touchGesture = "scroll";
          return;
        }

        touchGesture = "orbit";
        isDragging = true;
        isPanning = false;
      }

      if (touchGesture === "scroll") return;
      if (touchGesture === "orbit") {
        // Deliberate horizontal orbit: prevent default only after the intent
        // threshold, never while a visitor is trying to read the page.
        if (e.cancelable) e.preventDefault();
        const dx = e.clientX - prevSingleX;
        const dy = e.clientY - prevSingleY;
        velTheta = -dx * 0.0065;
        velPhi = dy * 0.0065;
        targetSpherical.theta -= dx * 0.0065;
        targetSpherical.phi = Math.max(
          0.02,
          Math.min(Math.PI - 0.02, targetSpherical.phi + dy * 0.0065),
        );
        prevSingleX = e.clientX;
        prevSingleY = e.clientY;
      }
      return;
    }

    if (activePointers.size === 1) {
      const dx = e.clientX - prevSingleX;
      const dy = e.clientY - prevSingleY;

      if (isPanning) {
        panCamera(dx, dy);
      } else if (isDragging) {
        velTheta = -dx * 0.0065;
        velPhi = dy * 0.0065;

        targetSpherical.theta -= dx * 0.0065;
        targetSpherical.phi = Math.max(
          0.02,
          Math.min(Math.PI - 0.02, targetSpherical.phi + dy * 0.0065),
        );
      }

      prevSingleX = e.clientX;
      prevSingleY = e.clientY;
    } else if (activePointers.size >= 2) {
      const pts = Array.from(activePointers.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (initialPinchDist > 0 && dist > 0) {
        const pinchFactor = initialPinchDist / dist;
        targetSpherical.radius = Math.max(
          minRadius,
          Math.min(maxRadius, initialPinchRadius * pinchFactor),
        );
      }

      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      panCamera(midX - prevPinchMidX, midY - prevPinchMidY);
      prevPinchMidX = midX;
      prevPinchMidY = midY;
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    const releasedPointer = activePointers.get(e.pointerId);
    activePointers.delete(e.pointerId);

    const touchPointers = activeTouchPointers();
    if (touchPointers.length >= 2) {
      beginPinchGesture(touchPointers);
    } else if (releasedPointer?.pointerType === "touch" || touchGesture !== "idle") {
      const remainingTouch = touchPointers[0];
      if (remainingTouch) {
        // Once one finger leaves a pinch, require a fresh horizontal intent
        // before taking control again; a vertical follow-up remains a scroll.
        armSingleTouch(remainingTouch);
      } else {
        touchGesture = "idle";
        isDragging = false;
        isPinching = false;
        isPanning = false;
      }
    }

    if (activePointers.size === 0) {
      isDragging = false;
      isPinching = false;
      isPanning = false;
      touchGesture = "idle";
      if (typeof window !== "undefined") {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
      }
    } else if (touchPointers.length >= 2) {
      // A 3+ finger gesture lost one pointer: the remaining pair needs its
      // own pinch baseline, or the next move zooms from stale distances.
      const pair = touchPointers;
      initialPinchDist = Math.hypot(pair[0].x - pair[1].x, pair[0].y - pair[1].y);
      initialPinchRadius = targetSpherical.radius;
      prevPinchMidX = (pair[0].x + pair[1].x) / 2;
      prevPinchMidY = (pair[0].y + pair[1].y) / 2;
    } else if (activePointers.size === 1 && releasedPointer?.pointerType !== "touch") {
      isPinching = false;
      isPanning = false;
      isDragging = true;
      const remaining = activePointers.values().next().value;
      if (remaining) {
        prevSingleX = remaining.x;
        prevSingleY = remaining.y;
      }
    }
  };

  // Wheel Zoom (Trackpad pinch & mouse wheel with smooth proportional scaling)
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY * 0.0015 * targetSpherical.radius;
    targetSpherical.radius = Math.max(
      minRadius,
      Math.min(maxRadius, targetSpherical.radius + zoomFactor),
    );
  };

  // Prevent context menu on right-click drag
  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  // Double click to reset camera framing
  const onDblClick = (e: MouseEvent) => {
    e.preventDefault();
    resetFraming();
  };

  // Safari emits proprietary gesture events for pinch gestures. Limit this
  // prevention to the canvas so the rest of the document still zooms normally.
  const onSafariGesture = (e: Event) => {
    e.preventDefault();
  };

  // Register Event Listeners on canvas
  domEl.addEventListener("pointerdown", onPointerDown, { passive: false });
  domEl.addEventListener("wheel", onWheel, { passive: false });
  domEl.addEventListener("contextmenu", onContextMenu);
  domEl.addEventListener("dblclick", onDblClick);
  domEl.addEventListener("gesturestart", onSafariGesture, { passive: false });
  domEl.addEventListener("gesturechange", onSafariGesture, { passive: false });
  domEl.addEventListener("gestureend", onSafariGesture, { passive: false });

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

  // Offscreen gate: faces poll isVisible() in their rAF loops and skip
  // physics/render work while the canvas is scrolled out of view (120px
  // margin so faces just below the fold keep painting). Defaults to true
  // until the first intersection callback, so above-fold sims never flash.
  let containerVisible = true;
  const intersectionObserver =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          (entries) => {
            containerVisible = entries[0]?.isIntersecting ?? true;
          },
          { rootMargin: "120px" },
        )
      : null;
  intersectionObserver?.observe(container);
  const isVisible = () => containerVisible;

  const controls = {
    update: () => {
      // Inertial coasting when finger or mouse is released
      if (!isDragging && !isPinching && !isPanning && !isReducedMotion) {
        if (Math.abs(velTheta) > 0.00005 || Math.abs(velPhi) > 0.00005) {
          targetSpherical.theta += velTheta;
          targetSpherical.phi = Math.max(
            0.02,
            Math.min(Math.PI - 0.02, targetSpherical.phi + velPhi),
          );
          velTheta *= 0.92;
          velPhi *= 0.92;
        }
      }

      const lerpFactor = 0.22;
      spherical.theta += (targetSpherical.theta - spherical.theta) * lerpFactor;
      spherical.phi += (targetSpherical.phi - spherical.phi) * lerpFactor;
      spherical.radius += (targetSpherical.radius - spherical.radius) * lerpFactor;

      camera.position.setFromSpherical(spherical).add(centerTarget);
      camera.lookAt(centerTarget);

      // Cloud drift animation smoothly orbiting across the 360-degree sky
      if (enableClouds && !isReducedMotion) {
        cloudsGroup.rotation.y += 0.0005;
      }
    },
    dispose: () => {
      domEl.removeEventListener("pointerdown", onPointerDown);
      domEl.removeEventListener("wheel", onWheel);
      domEl.removeEventListener("contextmenu", onContextMenu);
      domEl.removeEventListener("dblclick", onDblClick);
      domEl.removeEventListener("gesturestart", onSafariGesture);
      domEl.removeEventListener("gesturechange", onSafariGesture);
      domEl.removeEventListener("gestureend", onSafariGesture);
      if (typeof window !== "undefined") {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", applyViewportSize);
      }
      intersectionObserver?.disconnect();
    },
    setRadius: (r: number) => {
      targetSpherical.radius = r;
      spherical.radius = r;
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
      velTheta = 0;
      velPhi = 0;
      camera.lookAt(centerTarget);
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
        velTheta = 0;
        velPhi = 0;
        camera.lookAt(centerTarget);
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
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
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

  return {
    scene,
    camera,
    renderer,
    controls,
    updateEnvironment,
    isVisible,
    dispose,
    cleanup: dispose,
  };
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
