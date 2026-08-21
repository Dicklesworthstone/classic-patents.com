/**
 * Host-pumped tick scheduler (FrankenSim wright-flyer transport).
 * Service time, lateness, and backlog are separate. Unbounded catch-up is refused.
 */

export class TickScheduler {
  private readonly tickS: number;
  private readonly maxCatchup: number;
  private nextDueS: number;
  ticksRun = 0;
  reanchors = 0;

  constructor(tickS: number, startS: number, maxCatchup = 3) {
    this.tickS = tickS;
    this.maxCatchup = maxCatchup;
    this.nextDueS = startS;
  }

  pump(nowS: number, runTick: () => void): number {
    let backlog = Math.floor((nowS - this.nextDueS) / this.tickS) + (nowS >= this.nextDueS ? 1 : 0);
    if (backlog < 0) backlog = 0;
    if (backlog > this.maxCatchup) {
      this.reanchors += 1;
      this.nextDueS = nowS;
    }
    let ran = 0;
    while (this.nextDueS <= nowS) {
      runTick();
      this.ticksRun += 1;
      this.nextDueS += this.tickS;
      ran += 1;
      if (ran > this.maxCatchup) {
        this.reanchors += 1;
        this.nextDueS = nowS + this.tickS;
        break;
      }
    }
    return ran;
  }
}

/** Host-fed rAF clock for catalog 3Ds. Bounded catch-up; no fake 1/60 physics dt. */
export function createStudioClock(tickS = 1 / 60) {
  const scheduler = new TickScheduler(tickS, 0);
  let lastMs: number | undefined;
  let simTimeSec = 0;
  return {
    get simTimeSec() {
      return simTimeSec;
    },
    pump(nowMs: number): { dt: number; simTimeSec: number } {
      const dt = lastMs !== undefined ? Math.min((nowMs - lastMs) / 1000, 0.1) : 0;
      lastMs = nowMs;
      scheduler.pump(nowMs / 1000, () => {
        simTimeSec += tickS;
      });
      return { dt, simTimeSec };
    },
  };
}
