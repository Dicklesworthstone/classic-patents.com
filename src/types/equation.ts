/**
 * src/types/equation.ts
 *
 * Type definitions for Interactive Colorized Math Equations across Classic Patents.
 * Implements the BetterExplained dual-coding pedagogical model with live FrankenSim SI physics bindings.
 */

export type ColorVariant =
  | "crimson" // Rich red / ruby: penalties, losses, thermal heat, inputs
  | "sapphire" // Deep royal blue: core fields, velocities, voltages
  | "emerald" // Vibrant green: positive output, lift, efficiency, power
  | "amber" // Warm golden amber: frequencies, geometric constants, bounds
  | "amethyst" // Royal purple / violet: resultant vectors, energy, states
  | "cyan" // Electric cyan: magnetic flux, capacitance, quantum packets
  | "coral" // Radiant coral / orange: currents, resistance, acceleration
  | "rose" // Vivid pink / magenta: time intervals, rates of change, decay
  | "teal"; // Deep blue-green: materials, cross-sections, permeability

/**
 * JSON-serializable formatting instructions for live equation telemetry.
 *
 * Equations are assembled in a Server Component and consumed by a Client
 * Component, so executable callbacks are not valid catalogue data. A closed,
 * declarative format preserves custom precision and unit scaling while
 * remaining safe to transport through the React Server Component boundary.
 */
export interface EquationValueFormat {
  style: "fixed";
  /** Decimal places accepted by Number.toFixed (0 through 20). */
  fractionDigits: number;
  /** Multiplier applied before formatting; for example 1e-3 converts W to kW. */
  scale?: number;
  prefix?: string;
  suffix?: string;
}

export interface EquationVariable {
  id: string;
  symbol: string;
  name: string;
  color: ColorVariant;
  role: string;
  unit: string;
  dimension?: string;
  explanation: string;
  telemetryKey?: string;
  telemetryMetricLabel?: string;
  valueFormat?: EquationValueFormat;
}

export interface SentenceFragment {
  text: string;
  variableId?: string;
}

export interface ColorizedEquation {
  id: string;
  patentId: string;
  title: string;
  category: string;
  rawLatex: string;
  colorizedLatex: string;
  plainEnglishSentence: SentenceFragment[];
  variables: EquationVariable[];
  pedagogicalNote: string;
  claimRef?: number;
  historicalSignificance?: string;
}
