/**
 * cortPuddlingRollingModel.ts
 *
 * Procedural museum-grade 3D WebGL model of Henry Cort's 1784
 * Reverberatory Puddling Furnace & Grooved Rolling Mill (GB 1420).
 *
 * Faithfully constructs:
 * - Reverberatory Puddling Furnace: brick hearth, coal firebox, arched roof crown,
 *   working door with puddler rabble rod, molten decarburizing bath, chimney stack.
 * - Grooved Rolling Mill: heavy cast-iron stanchions, counter-rotating chilled-iron
 *   rolls with graduated profile grooves (box, diamond, flat, round), screw-down
 *   adjustment wheels, hot billet and slag squeeze droplets.
 */

import * as THREE from "three";

export interface CortModel {
  root: THREE.Group;
  furnaceGroup: THREE.Group;
  roofGroup: THREE.Group;
  rabbleGroup: THREE.Group;
  puddleBallMesh: THREE.Mesh;
  moltenBathMesh: THREE.Mesh;
  topRollGroup: THREE.Group;
  bottomRollGroup: THREE.Group;
  billetMesh: THREE.Mesh;
  sparkParticles: THREE.Points;
  calloutSprites: THREE.Sprite[];
  setCutaway: (enabled: boolean) => void;
  setShowCallouts: (enabled: boolean) => void;
  updateAnimation: (
    timeSec: number,
    isComingToNature: boolean,
    rollOmegaRadPerS: number,
    rabbleOmegaRadPerS: number,
  ) => void;
  dispose: () => void;
}

export function buildCortPuddlingRollingModel(): CortModel {
  const root = new THREE.Group();
  root.name = "cort-puddling-rolling-assembly";

  // Materials
  const brickMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.85,
    metalness: 0.1,
  });

  const fireboxMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d1810,
    roughness: 0.9,
    metalness: 0.2,
  });

  const coalGlowMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4500,
    emissive: 0xff2200,
    emissiveIntensity: 0.8,
    roughness: 0.6,
  });

  const moltenBathMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6600,
    emissive: 0xdd3300,
    emissiveIntensity: 0.7,
    roughness: 0.3,
    metalness: 0.8,
  });

  const puddleBallMaterial = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    emissive: 0xff5500,
    emissiveIntensity: 0.9,
    roughness: 0.5,
    metalness: 0.7,
  });

  const ironMetalMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a3d40,
    roughness: 0.45,
    metalness: 0.85,
  });

  const chilledRollMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4e52,
    roughness: 0.3,
    metalness: 0.9,
  });

  const hotBilletMaterial = new THREE.MeshStandardMaterial({
    color: 0xff3300,
    emissive: 0xcc2200,
    emissiveIntensity: 0.95,
    roughness: 0.4,
  });

  // ==========================================
  // 1. REVERBERATORY PUDDLING FURNACE (LEFT)
  // ==========================================
  const furnaceGroup = new THREE.Group();
  furnaceGroup.position.set(-2.8, 0, 0);
  root.add(furnaceGroup);

  // Foundation Bedding
  const foundationGeo = new THREE.BoxGeometry(3.6, 0.4, 2.2);
  const foundation = new THREE.Mesh(foundationGeo, brickMaterial);
  foundation.position.set(0, 0.2, 0);
  furnaceGroup.add(foundation);

  // Firebox & Grate (Left side of furnace)
  const fireboxGeo = new THREE.BoxGeometry(1.0, 1.2, 1.8);
  const firebox = new THREE.Mesh(fireboxGeo, fireboxMaterial);
  firebox.position.set(-1.2, 1.0, 0);
  furnaceGroup.add(firebox);

  // Glowing Coal Bed
  const coalBedGeo = new THREE.BoxGeometry(0.8, 0.2, 1.4);
  const coalBed = new THREE.Mesh(coalBedGeo, coalGlowMaterial);
  coalBed.position.set(-1.2, 0.6, 0);
  furnaceGroup.add(coalBed);

  // Fire Bridge Wall
  const fireBridgeGeo = new THREE.BoxGeometry(0.3, 1.0, 1.8);
  const fireBridge = new THREE.Mesh(fireBridgeGeo, brickMaterial);
  fireBridge.position.set(-0.55, 0.9, 0);
  furnaceGroup.add(fireBridge);

  // Concave Sand Hearth Basin
  const hearthBasinGeo = new THREE.CylinderGeometry(0.9, 0.7, 0.4, 24);
  const hearthBasin = new THREE.Mesh(hearthBasinGeo, brickMaterial);
  hearthBasin.position.set(0.3, 0.6, 0);
  furnaceGroup.add(hearthBasin);

  // Molten Iron Pool
  const bathGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.1, 24);
  const moltenBathMesh = new THREE.Mesh(bathGeo, moltenBathMaterial);
  moltenBathMesh.position.set(0.3, 0.82, 0);
  furnaceGroup.add(moltenBathMesh);

  // Agglomerated Puddle Ball (Loup)
  const puddleBallGeo = new THREE.SphereGeometry(0.24, 16, 16);
  puddleBallGeo.scale(1.2, 0.7, 1.0);
  const puddleBallMesh = new THREE.Mesh(puddleBallGeo, puddleBallMaterial);
  puddleBallMesh.position.set(0.3, 0.92, 0);
  furnaceGroup.add(puddleBallMesh);

  // Chimney Stack (Right side of furnace)
  const stackGeo = new THREE.BoxGeometry(0.8, 3.2, 0.8);
  const stack = new THREE.Mesh(stackGeo, brickMaterial);
  stack.position.set(1.4, 2.0, 0);
  furnaceGroup.add(stack);

  // Chimney Flue Damper
  const damperGeo = new THREE.BoxGeometry(0.6, 0.05, 0.6);
  const damper = new THREE.Mesh(damperGeo, ironMetalMaterial);
  damper.position.set(1.4, 1.5, 0);
  furnaceGroup.add(damper);

  // Arched Reverberatory Roof (Cutaway capable)
  const roofGroup = new THREE.Group();
  const roofArchGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.6, 24, 1, false, 0, Math.PI);
  roofArchGeo.rotateZ(Math.PI / 2);
  const roof = new THREE.Mesh(roofArchGeo, brickMaterial);
  roof.position.set(0.1, 1.7, 0);
  roofGroup.add(roof);
  furnaceGroup.add(roofGroup);

  // Puddler Working Door & Rabble Rod
  const rabbleGroup = new THREE.Group();
  const doorFrameGeo = new THREE.BoxGeometry(0.6, 0.7, 0.1);
  const doorFrame = new THREE.Mesh(doorFrameGeo, ironMetalMaterial);
  doorFrame.position.set(0.3, 1.2, 0.95);
  furnaceGroup.add(doorFrame);

  // Rabble Iron Bar
  const rabbleRodGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.6, 12);
  rabbleRodGeo.rotateX(Math.PI / 3);
  const rabbleRod = new THREE.Mesh(rabbleRodGeo, ironMetalMaterial);
  rabbleRod.position.set(0.3, 1.05, 0.45);
  rabbleGroup.add(rabbleRod);
  furnaceGroup.add(rabbleGroup);

  // ==========================================
  // 2. GROOVED ROLLING MILL TRAIN (RIGHT)
  // ==========================================
  const millGroup = new THREE.Group();
  millGroup.position.set(2.0, 0, 0);
  root.add(millGroup);

  // Mill Bedplate Foundation
  const millBaseGeo = new THREE.BoxGeometry(2.4, 0.3, 1.8);
  const millBase = new THREE.Mesh(millBaseGeo, ironMetalMaterial);
  millBase.position.set(0, 0.15, 0);
  millGroup.add(millBase);

  // Left & Right Cast-Iron Stanchions / Housings
  const stanchionGeo = new THREE.BoxGeometry(0.35, 1.8, 0.8);
  const leftStanchion = new THREE.Mesh(stanchionGeo, ironMetalMaterial);
  leftStanchion.position.set(-0.85, 1.05, 0);
  millGroup.add(leftStanchion);

  const rightStanchion = new THREE.Mesh(stanchionGeo, ironMetalMaterial);
  rightStanchion.position.set(0.85, 1.05, 0);
  millGroup.add(rightStanchion);

  // Screw-Down Adjustment Spindles & Handwheels
  const screwGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 12);
  const leftScrew = new THREE.Mesh(screwGeo, ironMetalMaterial);
  leftScrew.position.set(-0.85, 2.05, 0);
  millGroup.add(leftScrew);

  const wheelGeo = new THREE.TorusGeometry(0.12, 0.025, 8, 16);
  wheelGeo.rotateX(Math.PI / 2);
  const leftWheel = new THREE.Mesh(wheelGeo, ironMetalMaterial);
  leftWheel.position.set(-0.85, 2.25, 0);
  millGroup.add(leftWheel);

  const rightScrew = new THREE.Mesh(screwGeo, ironMetalMaterial);
  rightScrew.position.set(0.85, 2.05, 0);
  millGroup.add(rightScrew);

  const rightWheel = new THREE.Mesh(wheelGeo, ironMetalMaterial);
  rightWheel.position.set(0.85, 2.25, 0);
  millGroup.add(rightWheel);

  // Grooved Rollers Assembly
  const topRollGroup = new THREE.Group();
  topRollGroup.position.set(0, 1.25, 0);
  millGroup.add(topRollGroup);

  const bottomRollGroup = new THREE.Group();
  bottomRollGroup.position.set(0, 0.75, 0);
  millGroup.add(bottomRollGroup);

  // Function to build a grooved roller with matching pass collars
  function buildGroovedRoller(): THREE.Group {
    const group = new THREE.Group();
    const mainBodyGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.35, 24);
    mainBodyGeo.rotateZ(Math.PI / 2);
    const mainBody = new THREE.Mesh(mainBodyGeo, chilledRollMaterial);
    group.add(mainBody);

    // Profile Grooves (Pass 1: Box, Pass 2: Diamond, Pass 3: Flat, Pass 4: Round)
    const grooveXPositions = [-0.4, -0.15, 0.1, 0.35];
    const grooveRadii = [0.18, 0.19, 0.2, 0.21];
    const grooveWidths = [0.14, 0.11, 0.12, 0.08];

    for (let i = 0; i < grooveXPositions.length; i++) {
      const gGeo = new THREE.CylinderGeometry(grooveRadii[i], grooveRadii[i], grooveWidths[i], 24);
      gGeo.rotateZ(Math.PI / 2);
      const gMesh = new THREE.Mesh(gGeo, ironMetalMaterial);
      gMesh.position.set(grooveXPositions[i], 0, 0);
      group.add(gMesh);
    }

    // Roll Necks / Journals
    const journalGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16);
    journalGeo.rotateZ(Math.PI / 2);
    const leftJournal = new THREE.Mesh(journalGeo, ironMetalMaterial);
    leftJournal.position.set(-0.78, 0, 0);
    group.add(leftJournal);

    const rightJournal = new THREE.Mesh(journalGeo, ironMetalMaterial);
    rightJournal.position.set(0.78, 0, 0);
    group.add(rightJournal);

    return group;
  }

  const topRoller = buildGroovedRoller();
  topRollGroup.add(topRoller);

  const bottomRoller = buildGroovedRoller();
  bottomRollGroup.add(bottomRoller);

  // Hot Wrought Iron Billet Passing Through Pass 1
  const billetGeo = new THREE.BoxGeometry(0.12, 0.1, 1.2);
  const billetMesh = new THREE.Mesh(billetGeo, hotBilletMaterial);
  billetMesh.position.set(-0.4, 1.0, 0);
  millGroup.add(billetMesh);

  // Slag / Spark Particles (Deterministic pseudo-random distribution)
  const sparkCount = 45;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(sparkCount * 3);
  for (let i = 0; i < sparkCount; i++) {
    const r1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const r2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
    const r3 = (Math.sin(i * 45.164) * 43758.5453) % 1;
    sparkPositions[i * 3] = -0.4 + (Math.abs(r1) - 0.5) * 0.2;
    sparkPositions[i * 3 + 1] = 0.95 - Math.abs(r2) * 0.4;
    sparkPositions[i * 3 + 2] = (Math.abs(r3) - 0.5) * 0.3;
  }
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
  const sparkMaterial = new THREE.PointsMaterial({
    color: 0xffaa00,
    size: 0.04,
    transparent: true,
    opacity: 0.85,
  });
  const sparkParticles = new THREE.Points(sparkGeo, sparkMaterial);
  millGroup.add(sparkParticles);

  // ==========================================
  // 3. CALLOUT SPRITES
  // ==========================================
  const calloutSprites: THREE.Sprite[] = [];
  const labels: { text: string; pos: [number, number, number] }[] = [
    { text: "A: Coal Grate", pos: [-4.0, 1.6, 0] },
    { text: "B: Fire Bridge", pos: [-3.35, 1.5, 0] },
    { text: "C: Puddling Hearth", pos: [-2.5, 1.2, 0] },
    { text: "D: Arched Crown", pos: [-2.7, 2.3, 0] },
    { text: "F: Chimney Stack", pos: [-1.4, 3.2, 0] },
    { text: "G: Rabble Rod", pos: [-2.5, 1.8, 0.8] },
    { text: "H: Mill Stands", pos: [1.15, 2.1, 0] },
    { text: "J: Grooved Rolls", pos: [2.0, 1.5, 0.5] },
    { text: "K: Screws", pos: [2.0, 2.4, 0] },
    { text: "L: Hot Billet", pos: [1.6, 0.9, 0.7] },
  ];

  function createTextSprite(message: string): THREE.Sprite {
    if (typeof document === "undefined") {
      const spriteMat = new THREE.SpriteMaterial({ depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.8, 0.2, 1);
      return sprite;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "rgba(10, 10, 12, 0.85)";
      ctx.strokeStyle = "#e7e5e4";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(4, 4, 248, 56, 10);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 24px monospace";
      ctx.fillStyle = "#fef08a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(message, 128, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.8, 0.2, 1);
    return sprite;
  }

  for (const item of labels) {
    const sprite = createTextSprite(item.text);
    sprite.position.set(...item.pos);
    root.add(sprite);
    calloutSprites.push(sprite);
  }

  return {
    root,
    furnaceGroup,
    roofGroup,
    rabbleGroup,
    puddleBallMesh,
    moltenBathMesh,
    topRollGroup,
    bottomRollGroup,
    billetMesh,
    sparkParticles,
    calloutSprites,

    setCutaway(enabled: boolean) {
      roofGroup.visible = !enabled;
    },

    setShowCallouts(enabled: boolean) {
      for (const s of calloutSprites) {
        s.visible = enabled;
      }
    },

    updateAnimation(
      timeSec: number,
      isComingToNature: boolean,
      rollOmegaRadPerS: number,
      rabbleOmegaRadPerS: number,
    ) {
      // 1. Rabble stirring oscillation from the kernel ω, not leftover 3 / 4.
      const rabbleAngle = Math.sin(timeSec * rabbleOmegaRadPerS) * 0.15;
      rabbleGroup.rotation.y = rabbleAngle;
      rabbleGroup.position.x = Math.sin(timeSec * rabbleOmegaRadPerS * (4 / 3)) * 0.08;

      // 2. Puddle ball growth and texture. Flicker drains rabble ω (15 rpm → leftover 5).
      const millDisplayScale = 10 / Math.PI;
      const puddleFlickerOmegaRadPerS = rabbleOmegaRadPerS * millDisplayScale;
      if (isComingToNature) {
        puddleBallMesh.scale.set(1.4, 0.85, 1.2);
        (puddleBallMesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.85 + Math.sin(timeSec * puddleFlickerOmegaRadPerS) * 0.1;
      } else {
        puddleBallMesh.scale.set(0.8, 0.5, 0.8);
      }

      // 3. Counter-rotating grooved rolls
      topRollGroup.rotation.x = -timeSec * rollOmegaRadPerS;
      bottomRollGroup.rotation.x = timeSec * rollOmegaRadPerS;

      // 4. Billet movement through rolls. Studio radius keeps default 30 RPM at 0.4 units/s.
      const studioBilletRadius = 0.4 / Math.PI;
      billetMesh.position.z = ((timeSec * rollOmegaRadPerS * studioBilletRadius) % 1.2) - 0.6;

      // 5. Spark particle animation. Hash rate drains roll ω (30 rpm → leftover 10).
      const sparkHashRate = rollOmegaRadPerS * millDisplayScale;
      const posAttr = sparkParticles.geometry.getAttribute("position") as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      for (let i = 0; i < sparkCount; i++) {
        posArr[i * 3 + 1] -= 0.015;
        if (posArr[i * 3 + 1] < 0.3) {
          posArr[i * 3 + 1] = 0.95;
          const rx = (Math.sin(i * 17.13 + timeSec * sparkHashRate) * 43758.5453) % 1;
          const rz = (Math.sin(i * 91.71 + timeSec * sparkHashRate) * 43758.5453) % 1;
          posArr[i * 3] = -0.4 + (Math.abs(rx) - 0.5) * 0.2;
          posArr[i * 3 + 2] = (Math.abs(rz) - 0.5) * 0.3;
        }
      }
      posAttr.needsUpdate = true;
    },

    dispose() {
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            for (const m of obj.material) m.dispose();
          } else if (obj.material) {
            obj.material.dispose();
          }
        } else if (obj instanceof THREE.Sprite) {
          obj.material.map?.dispose();
          obj.material.dispose();
        } else if (obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (obj.material instanceof THREE.Material) obj.material.dispose();
        }
      });
    },
  };
}
