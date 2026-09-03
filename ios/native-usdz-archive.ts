import { strFromU8, unzipSync } from "fflate";

const localFileHeader = 0x04034b50;
const centralDirectoryHeader = 0x02014b50;
const endOfCentralDirectory = 0x06054b50;
const canonicalDosDate = 0x0021; // 1980-01-01, the earliest valid DOS date.

const findEndOfCentralDirectory = (view: DataView): number => {
  const minimumOffset = Math.max(0, view.byteLength - 65_557);
  for (let offset = view.byteLength - 22; offset >= minimumOffset; offset -= 1) {
    if (view.getUint32(offset, true) === endOfCentralDirectory) return offset;
  }
  throw new Error("USDZ archive has no end-of-central-directory record");
};

/**
 * Normalize only ZIP metadata timestamps. USDZExporter otherwise emits stable
 * bytes, but wall-clock DOS timestamps caused every generated model to appear
 * modified on every export.
 */
export const canonicalizeUSDZArchive = (archive: Uint8Array): Uint8Array => {
  const result = archive.slice();
  const view = new DataView(result.buffer, result.byteOffset, result.byteLength);
  const endOffset = findEndOfCentralDirectory(view);
  const entryCount = view.getUint16(endOffset + 10, true);
  let centralOffset = view.getUint32(endOffset + 16, true);

  for (let index = 0; index < entryCount; index += 1) {
    if (view.getUint32(centralOffset, true) !== centralDirectoryHeader) {
      throw new Error(`USDZ archive has an invalid central-directory entry at ${centralOffset}`);
    }
    const localOffset = view.getUint32(centralOffset + 42, true);
    if (view.getUint32(localOffset, true) !== localFileHeader) {
      throw new Error(`USDZ archive has an invalid local-file entry at ${localOffset}`);
    }

    view.setUint16(localOffset + 10, 0, true);
    view.setUint16(localOffset + 12, canonicalDosDate, true);
    view.setUint16(centralOffset + 12, 0, true);
    view.setUint16(centralOffset + 14, canonicalDosDate, true);

    const nameLength = view.getUint16(centralOffset + 28, true);
    const extraLength = view.getUint16(centralOffset + 30, true);
    const commentLength = view.getUint16(centralOffset + 32, true);
    centralOffset += 46 + nameLength + extraLength + commentLength;
  }
  return result;
};

export const usdzArchivesHaveEqualContent = (left: Uint8Array, right: Uint8Array): boolean => {
  if (left.byteLength !== right.byteLength) return false;
  const canonicalLeft = canonicalizeUSDZArchive(left);
  const canonicalRight = canonicalizeUSDZArchive(right);
  return (
    canonicalLeft.length === canonicalRight.length &&
    canonicalLeft.every((byte, index) => byte === canonicalRight[index])
  );
};

type SemanticArchiveEntry = {
  name: string;
  payload: string | Uint8Array;
};

const generatedUSDIdentifier = /\b(Geometry|Material|Object)_(\d+)\b/g;

const semanticArchiveEntries = (archive: Uint8Array): SemanticArchiveEntry[] => {
  // fflate is allowed to reuse/mutate its input storage while decoding. This
  // comparator is also used immediately before deciding whether to preserve
  // an existing checked-in model, so mutating either caller-owned archive can
  // silently defeat the byte-preservation decision.
  // Uint8Array#slice copies, but Node/Bun Buffer#slice returns a shared view.
  // Uint8Array.from is an owning copy for both concrete input types.
  const files = unzipSync(Uint8Array.from(archive));
  const identifiers = new Map<string, string>();
  const counters = new Map<string, number>();
  const normalizeIdentifiers = (value: string): string =>
    value.replace(generatedUSDIdentifier, (token, kind: string) => {
      const existing = identifiers.get(token);
      if (existing) return existing;
      const ordinal = counters.get(kind) ?? 0;
      counters.set(kind, ordinal + 1);
      const normalized = `${kind}_${ordinal}`;
      identifiers.set(token, normalized);
      return normalized;
    });

  // The root layer contains every cross-file reference. Visiting it first
  // gives equivalent archives the same local identifier map even when Three
  // has advanced its process-global Object3D/Geometry/Material counters.
  const orderedNames = Object.keys(files).sort((left, right) => {
    if (left === "model.usda") return -1;
    if (right === "model.usda") return 1;
    return 0;
  });
  return orderedNames.map((name) => {
    const bytes = files[name];
    if (!bytes) throw new Error(`USDZ archive entry vanished while reading ${name}`);
    const normalizedName = normalizeIdentifiers(name);
    return {
      name: normalizedName,
      payload: name.endsWith(".usda") ? normalizeIdentifiers(strFromU8(bytes)) : bytes,
    };
  });
};

/**
 * Compare authored USDZ content while ignoring both ZIP timestamps and the
 * process-global numeric suffixes assigned by Three.js. The suffixes are not
 * model identity: importing one additional builder earlier in the catalog can
 * renumber every later asset even when its transforms, materials, and geometry
 * are byte-for-byte unchanged.
 */
export const usdzArchivesHaveEquivalentPayload = (left: Uint8Array, right: Uint8Array): boolean => {
  if (usdzArchivesHaveEqualContent(left, right)) return true;
  const leftEntries = semanticArchiveEntries(left);
  const rightEntries = semanticArchiveEntries(right);
  if (leftEntries.length !== rightEntries.length) return false;
  return leftEntries.every((leftEntry, index) => {
    const rightEntry = rightEntries[index];
    if (!rightEntry || leftEntry.name !== rightEntry.name) return false;
    if (typeof leftEntry.payload === "string" || typeof rightEntry.payload === "string") {
      return leftEntry.payload === rightEntry.payload;
    }
    return (
      leftEntry.payload.length === rightEntry.payload.length &&
      leftEntry.payload.every((byte, byteIndex) => byte === rightEntry.payload[byteIndex])
    );
  });
};
