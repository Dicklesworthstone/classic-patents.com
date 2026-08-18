"use client";

import type { TrustContext } from "katex";
import katex from "katex";
import React, { useMemo } from "react";

interface LatexRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

/**
 * ColorizedEquation emits these two KaTeX extensions for its own stable,
 * authored variable tokens. Full `trust: true` would also enable \href,
 * \includegraphics, and style-bearing HTML commands for every prose field
 * rendered by TextWithLatex.
 */
function trustInteractiveTokenMarkup(context: TrustContext): boolean {
  return context.command === "\\htmlClass" || context.command === "\\htmlData";
}

export function LatexRenderer({ math, block = false, className = "" }: LatexRendererProps) {
  const html = useMemo(() => {
    if (!math) return "";
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        output: "htmlAndMathml",
        trust: trustInteractiveTokenMarkup,
        strict: false,
      });
    } catch {
      return null;
    }
  }, [math, block]);

  if (!html) {
    return <span className={`latex-container inline-block ${className}`}>{math}</span>;
  }

  return (
    <span
      className={`latex-container inline-block ${className}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX serializes the formula; trust is restricted above.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * TextWithLatex parses a mixed text string containing $inline$ and $$block$$ math delimiters
 * and renders both text and mathematical formulas seamlessly.
 */
export function TextWithLatex({ text, className = "" }: { text: string; className?: string }) {
  const elements = useMemo(() => {
    if (!text) return null;

    // Match $$block$$ or $inline$
    const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);

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
