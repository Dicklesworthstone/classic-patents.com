import { stepPageRank } from "./pageRankKernel";

export const pageRankRegistryEntry = {
  domain: "Network_Analysis",
  domainTitle: "Network Probability Dynamics",
  equationName: "PageRank Centrality",
  governingEquation:
    "PR(u) = \\frac{\\alpha}{N} + (1-\\alpha) \\sum_{v \\in B_u} \\frac{PR(v)}{L(v)}",
  engineMethod: "stepPageRank",
  controls: [
    {
      id: "dampingFactor",
      label: "Link-follow probability (1−α)",
      min: 0.0,
      max: 1.0,
      step: 0.05,
      defaultValue: 0.85,
      unit: "",
    },
  ],
  computeMetrics: (params: Record<string, number>) => {
    const out = stepPageRank({ dampingFactor: params.dampingFactor ?? 0.85 });
    const maxRank = Math.max(...out.ranks);
    return [
      {
        label: "Max Node Centrality",
        value: maxRank.toFixed(3),
        unit: "PR",
        badgeColor: "cyan" as const,
        progressPct: (maxRank / 1.0) * 100,
      },
    ];
  },
  pedagogicalInsight:
    "The patent calls alpha the random-jump probability. The UI exposes its complement, 1−alpha, as link-follow probability; each source rank is divided by its forward-link count before propagation.",
};
