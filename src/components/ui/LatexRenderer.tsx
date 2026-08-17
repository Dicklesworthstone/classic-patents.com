"use client";

import katex from "katex";
import React, { useMemo } from "react";

interface LatexRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

export function LatexRenderer({ math, block = false, className = "" }: LatexRendererProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        output: "htmlAndMathml",
      });
    } catch (_err) {
      return `<span class="text-red-500 font-mono">${math}</span>`;
    }
  }, [math, block]);

  return (
    <span
      className={`latex-container inline-block ${className}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX renders trusted sanitized MathML/HTML
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
    const parts = text.split(/(\$\$[\s\S]+?\$\$|\$.+?\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const formula = part.slice(2, -2);
        return <LatexRenderer key={index} math={formula} block={true} />;
      }
      if (part.startsWith("$") && part.endsWith("$")) {
        const formula = part.slice(1, -1);
        return <LatexRenderer key={index} math={formula} block={false} />;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  }, [text]);

  return <span className={className}>{elements}</span>;
}
