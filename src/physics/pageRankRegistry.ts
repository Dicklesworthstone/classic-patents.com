import { stepPageRank } from "./pageRankKernel";

export const pageRankRegistryEntry = {
  domain: "Network_Analysis",
  domainTitle: "Network Probability Dynamics",
  equationName: "PageRank Centrality",
  governingEquation: "PR(u) = \\frac{1-d}{N} + d \\sum_{v \\in B_u} \\frac{PR(v)}{L(v)}",
  engineMethod: "stepPageRank",
  controls: [
    {
      id: "dampingFactor",
      label: "Damping Factor (d)",
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
    "PageRank converges on the steady-state probability distribution of a random surfer clicking links, scaled by the damping factor (d) representing the chance they jump randomly instead.",
};
