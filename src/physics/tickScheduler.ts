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
