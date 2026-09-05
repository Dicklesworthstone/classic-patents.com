"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { PatentCatalogEntry } from "@/data/patentCatalog";

interface PatentCatalog {
  patents: readonly PatentCatalogEntry[];
  featuredIds: readonly string[];
}

const PatentCatalogContext = createContext<PatentCatalog | null>(null);

/** Root layout supplies one server-derived projection shared across navigation. */
export function PatentCatalogProvider({
  catalog,
  children,
}: {
  catalog: PatentCatalog;
  children: ReactNode;
}) {
  return <PatentCatalogContext.Provider value={catalog}>{children}</PatentCatalogContext.Provider>;
}

export function usePatentCatalog() {
  const catalog = useContext(PatentCatalogContext);
  if (!catalog) throw new Error("Patent navigation requires PatentCatalogProvider.");
  return catalog;
}
