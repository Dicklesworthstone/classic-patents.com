export interface PageRankParams {
  dampingFactor?: number;
  randomSurfers?: number;
}

export interface PageRankState {
  ranks: number[];
  displayOmega: number;
  omegaRadPerSec: number;
}

export function stepPageRank(params: PageRankParams, currentState?: number[]): PageRankState {
  const d = params.dampingFactor ?? 0.85;
  const N = 5;

  // Graph adjacency structure
  // Node 0 (Page A) links to 1, 2
  // Node 1 (Page B) links to 2
  // Node 2 (Page C) links to 0
  // Node 3 (Page D) links to 2
  // Node 4 (Page E) links to 0, 3
  const links = [[1, 2], [2], [0], [2], [0, 3]];

  const ranks = currentState || Array(N).fill(1 / N);
  const nextRanks = Array(N).fill(0);

  for (let i = 0; i < N; i++) {
    nextRanks[i] = (1 - d) / N;
  }

  for (let i = 0; i < N; i++) {
    const outbound = links[i];
    const contribution = d * (ranks[i] / outbound.length);
    for (const target of outbound) {
      nextRanks[target] += contribution;
    }
  }

  const omegaRadPerSec = Number((0.8 * (d / 0.85)).toFixed(4));
  return {
    ranks: nextRanks,
    displayOmega: omegaRadPerSec,
    omegaRadPerSec,
  };
}
