import { expect, test } from "bun:test";

test("a successful generic WASM load invalidates pre-load fallback cache entries", async () => {
  const code = String.raw`
    const { ensureGenericWasm, gaMotorOrbit, genericKernelSource } =
      await import("./src/physics/genericWasm.ts");
    const sentinel = 4242.125;
    const fallback = gaMotorOrbit(11, 13);
    if (genericKernelSource() !== "unloaded" || fallback[2] === sentinel) {
      throw new Error("pre-load sample did not use the fallback");
    }
    const moduleSource = [
      "export default async function init() {}",
      "export function ga_motor_orbit(n, steps) {",
      "  const out = new Float64Array(2 + n * steps * 3);",
      "  out[0] = n;",
      "  out[1] = steps;",
      "  out[2] = " + sentinel + ";",
      "  return out;",
      "}",
      "export function heat_frames(n, frames) {",
      "  return new Float64Array(n * n * frames).fill(" + sentinel + ");",
      "}",
      "export const wave2d_frames = heat_frames;",
      "export function fluid_frames(n, frames) { return new Float64Array(n * n * frames); }",
      "export function cyclic_symmetry(n) { return new Float64Array(1 + 4 * n); }",
      "export function laplacian_modes(n, k) { return new Float64Array(k + k * n); }",
    ].join("\n");
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
    globalThis.fetch = async () => new Response(moduleSource, { status: 200 });
    if (await ensureGenericWasm() !== "wasm") throw new Error("synthetic WASM did not bind");
    const stepped = gaMotorOrbit(11, 13);
    if (stepped === fallback || stepped[2] !== sentinel) {
      throw new Error("post-load sample reused the cached fallback");
    }
    console.log("cache-handoff-ok");
  `;
  const child = Bun.spawn({
    cmd: [process.execPath, "-e", code],
    cwd: process.cwd(),
    stdout: "pipe",
    stderr: "pipe",
  });
  const [exitCode, stdout, stderr] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);

  expect(stderr).toBe("");
  expect(exitCode).toBe(0);
  expect(stdout.trim()).toBe("cache-handoff-ok");
});
