/**
 * Source-bound operating state for US 608,969.  The patent's mechanism is a
 * valve-and-pipe network between marine turbine banks, not a new axial blade
 * stack.  Keep the route topology explicit so the visual, claim probe, and
 * future telemetry seat can observe the same causal change.
 */

export type ParsonsRoutingMode = "series" | "compound-parallel" | "simple-parallel";

export interface ParsonsMarineControls {
  routing?: ParsonsRoutingMode;
  reversing?: boolean;
  throttle?: number;
}

export interface ParsonsMarineState {
  routing: ParsonsRoutingMode;
  reversing: boolean;
  throttle: number;
  routeLabel: string;
  routeEdges: readonly [string, string][];
  activeTurbines: readonly string[];
  activeShafts: number;
  flowRateRelative: number;
  directionLabel: "ahead" | "astern";
}

const FIGURE_1_SERIES: readonly [string, string][] = [
  ["boiler", "A"],
  ["A", "A′"],
  ["A′", "B"],
  ["B", "B′"],
  ["B′", "C"],
  ["C", "C′"],
  ["C′", "D"],
  ["D", "D′"],
  ["D′", "condenser E"],
];

const FIGURE_1_COMPOUND_PARALLEL: readonly [string, string][] = [
  ["boiler", "A"],
  ["A", "B"],
  ["B", "C"],
  ["C", "D"],
  ["D", "condenser E"],
  ["boiler", "A′"],
  ["A′", "B′"],
  ["B′", "C′"],
  ["C′", "D′"],
  ["D′", "condenser E"],
];

const FIGURE_1_SIMPLE_PARALLEL: readonly [string, string][] = [
  ["boiler", "A"],
  ["A", "condenser E"],
  ["boiler", "B"],
  ["B", "condenser E"],
  ["boiler", "C"],
  ["C", "condenser E"],
  ["boiler", "D"],
  ["D", "condenser E"],
  ["boiler", "A′"],
  ["A′", "condenser E"],
  ["boiler", "B′"],
  ["B′", "condenser E"],
  ["boiler", "C′"],
  ["C′", "condenser E"],
  ["boiler", "D′"],
  ["D′", "condenser E"],
];

const TURBINES = ["A", "A′", "B", "B′", "C", "C′", "D", "D′"] as const;

export function stepParsonsMarine({
  routing = "series",
  reversing = false,
  throttle = 1,
}: ParsonsMarineControls = {}): ParsonsMarineState {
  const safeThrottle = Math.max(0, Math.min(1, throttle));
  if (reversing) {
    return {
      routing,
      reversing: true,
      throttle: safeThrottle,
      routeLabel: "Figure 2 astern: X / Y reversing turbines",
      routeEdges: [
        ["boiler", "X"],
        ["X", "condenser G"],
        ["boiler", "Y"],
        ["Y", "condenser H"],
      ],
      activeTurbines: ["X", "Y"],
      activeShafts: 2,
      flowRateRelative: safeThrottle,
      directionLabel: "astern",
    };
  }

  const routeEdges =
    routing === "compound-parallel"
      ? FIGURE_1_COMPOUND_PARALLEL
      : routing === "simple-parallel"
        ? FIGURE_1_SIMPLE_PARALLEL
        : FIGURE_1_SERIES;
  const activeTurbines = TURBINES.filter((name) =>
    routeEdges.some(([from, to]) => from === name || to === name),
  );
  return {
    routing,
    reversing: false,
    throttle: safeThrottle,
    routeLabel:
      routing === "series"
        ? "Figure 1 series: A → A′ → B → B′ → C → C′ → D → D′"
        : routing === "compound-parallel"
          ? "Figure 1 compound parallel: A–D and A′–D′ trains"
          : "Figure 1 simple parallel: each turbine to condenser E",
    routeEdges,
    activeTurbines,
    activeShafts: 4,
    flowRateRelative: safeThrottle * (routing === "simple-parallel" ? 1.6 : 1),
    directionLabel: "ahead",
  };
}
