export interface PageRankParams {
  dampingFactor?: number;
  randomSurfers?: number;
}

export interface PageRankState {
  ranks: number[];
  iterations: number;
  displayRate: number;
}

/**
 * One source-bounded PageRank update for the three-document FIG. 2 example.
 * The UI calls `dampingFactor` the link-follow probability (1 - alpha), while
 * the patent calls alpha the random-jump probability.
 */
export function stepPageRank(params: PageRankParams, currentState?: number[]): PageRankState {
  const d = Math.min(1, Math.max(0, params.dampingFactor ?? 0.85));
  const N = 3;

  // FIG. 2: C points to A; A points to B and C; B points to C.
  const links = [[1, 2], [2], [0]];

  const ranks = currentState?.slice(0, N) ?? Array(N).fill(1 / N);
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

  return {
    ranks: nextRanks,
    iterations: 1,
    displayRate: Number((0.8 * d).toFixed(4)),
  };
}
