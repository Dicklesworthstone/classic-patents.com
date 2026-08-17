"use client";

import { useMemo } from "react";
import { specClausesFor } from "@/physics/specClauses";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

interface SpecClauseTextProps {
  patentId: string;
  text: string;
  className?: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function SpecClauseText({ patentId, text, className }: SpecClauseTextProps) {
  const { params } = usePatentPhysics(patentId);
  const clauses = useMemo(() => specClausesFor(patentId, params), [patentId, params]);
  const active = clauses.filter((c) => c.active && text.includes(c.phrase));

  if (active.length === 0) {
    return <div className={className}>{text}</div>;
  }

  const pattern = new RegExp(`(${active.map((c) => escapeRegExp(c.phrase)).join("|")})`, "g");
  const parts = text.split(pattern);
  const byPhrase = new Map(active.map((c) => [c.phrase, c]));

  return (
    <div className={className}>
      {parts.map((part, i) => {
        const clause = byPhrase.get(part);
        if (!clause) return <span key={`${i}-${part.slice(0, 12)}`}>{part}</span>;
        const tone =
          clause.tone === "broken"
            ? "bg-red-200/80 dark:bg-red-900/50 text-red-950 dark:text-red-100 ring-1 ring-red-400/70"
            : clause.tone === "held"
              ? "bg-emerald-200/80 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-400/70"
              : "bg-amber-200/80 dark:bg-amber-900/40 text-amber-950 dark:text-amber-100 ring-1 ring-amber-400/70";
        return (
          <mark
            key={`${clause.id}-${i}`}
            className={`rounded-sm px-0.5 ${tone}`}
            title={clause.caption}
          >
            {part}
          </mark>
        );
      })}
    </div>
  );
}
