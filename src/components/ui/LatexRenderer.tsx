"use client";

import katex from "katex";
import React, { useLayoutEffect, useMemo, useRef } from "react";

interface LatexRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

export function LatexRenderer({ math, block = false, className = "" }: LatexRendererProps) {
  const hostRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    try {
      katex.render(math, host, {
        displayMode: block,
        throwOnError: false,
        output: "htmlAndMathml",
      });
    } catch {
      host.replaceChildren();
      host.textContent = math;
    }
  }, [math, block]);

  return <span ref={hostRef} className={`latex-container inline-block ${className}`} />;
}

/**
 * TextWithLatex parses a mixed text string containing $inline$ and $$block$$ math delimiters
 * and renders both text and mathematical formulas seamlessly.
 */
export function TextWithLatex({ text, className = "" }: { text: string; className?: string }) {
  const elements = useMemo(() => {
    if (!text) return null;

    // Match $$block$$ or $inline$
    const parts = text.split(/(\$\$[\s\S]+?\$\$|\$.+?\$)/g);

    const seen = new Map<string, number>();
    return parts.map((part) => {
      const n = (seen.get(part) ?? 0) + 1;
      seen.set(part, n);
      const key = `${n}:${part.slice(0, 48)}`;
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const formula = part.slice(2, -2);
        return <LatexRenderer key={key} math={formula} block={true} />;
      }
      if (part.startsWith("$") && part.endsWith("$")) {
        const formula = part.slice(1, -1);
        return <LatexRenderer key={key} math={formula} block={false} />;
      }
      return <React.Fragment key={key}>{part}</React.Fragment>;
    });
  }, [text]);

  return <span className={className}>{elements}</span>;
}

/** HUD/slider copy that may contain $inline$ TeX. */
export function HudText({ text, className = "" }: { text: string; className?: string }) {
  return <TextWithLatex text={text} className={className} />;
}
