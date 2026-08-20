export interface RoombaControls {
  wheelSpeedMps: number;
  turnRateRadSec: number;
  roomWidth: number;
  roomHeight: number;
}

export interface RoombaState {
  x: number;
  y: number;
  heading: number; // radians
  mode: "spiral" | "straight" | "turn" | "backup";
  timeInMode: number;
  randomSeed: number;
  displayX: number;
  displayY: number;
}

function nextRandom(seed: number) {
  return (seed * 1103515245 + 12345) & 0x7fffffff;
}

export function stepRoomba(c: RoombaControls, s?: RoombaState, dt: number = 1 / 120): RoombaState {
  const state = s
    ? { ...s }
    : {
        x: 0,
        y: 0,
        heading: 0,
        mode: "spiral" as const,
        timeInMode: 0,
        randomSeed: 42,
        displayX: 0,
        displayY: 0,
      };

  const speed = c.wheelSpeedMps;
  const turnSpeed = c.turnRateRadSec;

  state.timeInMode += dt;

  const isBumping =
    state.x > c.roomWidth / 2 - 0.17 ||
    state.x < -c.roomWidth / 2 + 0.17 ||
    state.y > c.roomHeight / 2 - 0.17 ||
    state.y < -c.roomHeight / 2 + 0.17;

  if (isBumping && state.mode !== "backup" && state.mode !== "turn") {
    state.mode = "backup";
    state.timeInMode = 0;
  }

  if (state.mode === "backup" && state.timeInMode > 0.4) {
    state.mode = "turn";
    state.timeInMode = 0;
    state.randomSeed = nextRandom(state.randomSeed);
  } else if (state.mode === "turn") {
    const turnDuration = 0.4 + ((state.randomSeed % 100) / 100) * 1.2;
    if (state.timeInMode > turnDuration) {
      state.mode = "straight";
      state.timeInMode = 0;
    }
  }

  let dx = 0;
  let dy = 0;
  let dtheta = 0;

  if (state.mode === "spiral") {
    const radius = 0.12 + state.timeInMode * 0.045;
    dtheta = speed / radius;
    dx = speed * Math.cos(state.heading);
    dy = speed * Math.sin(state.heading);
  } else if (state.mode === "straight") {
    dx = speed * Math.cos(state.heading);
    dy = speed * Math.sin(state.heading);
  } else if (state.mode === "backup") {
    dx = -speed * Math.cos(state.heading);
    dy = -speed * Math.sin(state.heading);
  } else if (state.mode === "turn") {
    dtheta = turnSpeed;
  }

  state.x += dx * dt;
  state.y += dy * dt;
  state.heading += dtheta * dt;

  state.displayX = state.x;
  state.displayY = state.y;

  return state;
}
