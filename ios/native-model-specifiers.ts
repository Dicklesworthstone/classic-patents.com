const nativeModelAlias = "@/components/patents/visuals/three/";

/**
 * Resolve model-builder imports used by a web spatial component into paths
 * relative to that component. Both the historical local import style and the
 * current TypeScript alias are valid source shapes.
 */
export const nativeModelSpecifiers = (source: string): string[] => {
  const specifiers = [...source.matchAll(/from\s+["']([^"']+)["']/g)]
    .map((match) => match[1])
    .map((specifier) => {
      if (specifier.startsWith("./")) return specifier;
      if (specifier.startsWith(nativeModelAlias)) {
        return `./${specifier.slice(nativeModelAlias.length)}`;
      }
      return null;
    })
    .filter((specifier): specifier is string => specifier !== null)
    .map((specifier) => specifier.replace(/\.(?:ts|tsx)$/, ""))
    .filter((specifier) => /(?:model|airframe)$/i.test(specifier));

  return [...new Set(specifiers)];
};
