"use client";

import { useEffect, useRef, useState } from "react";
import { createThreeStudioScene } from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { stepPageRank } from "@/physics/pageRankKernel";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildPageRankModel } from "./PageRankModel";

const EXHIBIT_ID = "us-6285999-pagerank";

export function PageRank3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [hud, setHud] = useState({ damping: 0.85, iter: 0, topRank: 0.38 });
  const { params } = usePatentPhysics(EXHIBIT_ID);
  const live = useLiveSimParams(params);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const studio = createThreeStudioScene({
      container,
      cameraPos: [0, 0, 8.5],
      targetPos: [0, 0, 0],
    });
    const model = buildPageRankModel();
    studio.scene.add(model.root);

    let renderedSteps = 0;
    const sched = new TickScheduler(1 / 10, 0);
    let displayAngle = 0;
    let hudCounter = 0;
    let rafId = 0;

    let currentRanks = [0.2, 0.2, 0.2, 0.2, 0.2];
    let iteration = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const p = live.current;

      sched.pump(renderedSteps / 60, () => {
        const out = stepPageRank({ dampingFactor: p.dampingFactor ?? 0.85 }, currentRanks);
        currentRanks = out.ranks;
        iteration += 1;
      });

      displayAngle += 0.05 * (1 / 60);
      model.mainGroup.rotation.y = displayAngle;

      currentRanks.forEach((rank, i) => {
        const targetScale = 0.25 + rank * 3.2;
        const cur = model.nodes[i].scale.x;
        const next = cur + (targetScale - cur) * 0.15;
        model.nodes[i].scale.set(next, next, next);
      });

      hudCounter += 1;
      if (hudCounter % 5 === 0) {
        setHud({
          damping: p.dampingFactor ?? 0.85,
          iter: iteration,
          topRank: Math.max(...currentRanks),
        });
      }

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute top-3 right-3 z-10">
        <button
          type="button"
          onClick={() => setShowUiOverlay((v) => !v)}
          className="p-2 rounded-xl bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
        >
          {showUiOverlay ? "hide" : "show"}
        </button>
      </div>
      {showUiOverlay && (
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none max-w-xs">
          <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs space-y-1">
            <div>
              Damping Factor <i>d</i>:{" "}
              <span className="font-mono font-bold">{hud.damping.toFixed(2)}</span>
            </div>
            <div>
              Convergence Step: <span className="font-mono font-bold">{hud.iter}</span>
            </div>
            <div>
              Max Centrality:{" "}
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {hud.topRank.toFixed(3)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageRank3D;
