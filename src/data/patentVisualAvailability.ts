/** A source hold retains the text/PDF reader but exposes no physical model. */
export function patentVisualAvailability(id: string): "source-hold" | "interactive" {
  return id === "us-3671542-kwolek-kevlar" ? "source-hold" : "interactive";
}
