"use client";

import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  coupleLinks,
  datedScenarios,
  fidelityField,
  intervalGhosts,
  kittyHawkResidual,
  smokePolicy,
  spectralModes,
} from "@/physics/weaveSurfaces";
import { useWeaveInstrumentInteractions } from "./useWeaveInstrumentInteractions";
import { WeaveInteractionPanels, WeaveReadoutPanels } from "./WeaveInstrumentPanels";

interface WeaveInstrumentProps {
  patentId: string;
}

export function WeaveInstrument({ patentId }: WeaveInstrumentProps) {
  const { params, updateParam } = usePatentPhysics(patentId);
  const ghosts = intervalGhosts(patentId, params);
  const fidelity = fidelityField(patentId, params);
  const smoke = smokePolicy(patentId, params);
  const modes = spectralModes(patentId, params);
  const scenarios = datedScenarios(patentId);
  const couples = coupleLinks(patentId, params);
  const isWright = patentId.includes("wright-flyer") || patentId.includes("821393");
  const isBell =
    (patentId.includes("bell") && patentId.includes("telephone")) || patentId.includes("174465");
  const isMorse = patentId.includes("morse") || patentId.includes("1647");
  const isLamarr = patentId.includes("lamarr");
  const kittyHawk = isWright ? kittyHawkResidual(params) : null;
  const interactions = useWeaveInstrumentInteractions(updateParam);

  const hasInstrumentContent = [
    ghosts.length > 0,
    Boolean(fidelity),
    scenarios.length > 0,
    couples.length > 0,
    modes.length > 0,
    isWright,
    isBell,
    isMorse,
    isLamarr,
  ].some(Boolean);
  if (!hasInstrumentContent) return null;

  return (
    <div className="space-y-3">
      <WeaveReadoutPanels
        patentId={patentId}
        params={params}
        updateParam={updateParam}
        ghosts={ghosts}
        fidelity={fidelity}
        kittyHawk={kittyHawk}
        couples={couples}
        smoke={smoke}
        modes={modes}
        scenarios={scenarios}
      />
      <WeaveInteractionPanels
        patentId={patentId}
        params={params}
        updateParam={updateParam}
        bankActive={interactions.bankActive}
        enableDeviceBank={interactions.enableDeviceBank}
        voiceActive={interactions.voiceActive}
        sampleVoice={interactions.sampleVoice}
        stopVoiceSampling={interactions.stopVoiceSampling}
      />
    </div>
  );
}
