import { existsSync } from "node:fs";
import { join } from "node:path";

/** Directory existence is the invariant: even an empty or .keep-only Pages
 * Router directory violates the repository's App Router architecture. */
export function appRouterArchitectureError(
  root: string,
  exists: (path: string) => boolean = existsSync,
): string | null {
  return exists(join(root, "src", "pages"))
    ? "🚨 ARCHITECTURAL VIOLATION: src/pages exists. This Next.js 15 App Router repository prohibits that path, including empty directories and directories containing only .keep or declaration files. All routes belong in src/app."
    : null;
}
