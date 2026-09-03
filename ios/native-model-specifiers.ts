const nativeModelAlias = "@/components/patents/visuals/three/";

/**
 * Resolve model-builder imports used by a web spatial component into paths
 * relative to that component. Both the historical local import style and the
 * current TypeScript alias are valid source shapes.
 */
export const nativeModelSpecifiers = (source: string): string[] => {
  const specifiers: string[] = [];
  for (const match of source.matchAll(/from\s+["']([^"']+)["']/g)) {
    const sourceSpecifier = match[1];
    if (!sourceSpecifier) continue;

    const relativeSpecifier = sourceSpecifier.startsWith("./")
      ? sourceSpecifier
      : sourceSpecifier.startsWith(nativeModelAlias)
        ? `./${sourceSpecifier.slice(nativeModelAlias.length)}`
        : null;
    if (!relativeSpecifier) continue;

    const specifier = relativeSpecifier.replace(/\.(?:ts|tsx)$/, "");
    if (/(?:model|airframe)$/i.test(specifier)) specifiers.push(specifier);
  }

  return [...new Set(specifiers)];
};
