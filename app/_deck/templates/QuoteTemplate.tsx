/* Template 02 — Quote.
   Centered pull quote with optional attribution. */

import type { ReactNode } from "react";

export type QuoteTemplateProps = {
  quote: ReactNode;
  attribution?: ReactNode;
};

export function QuoteTemplate({ quote, attribution }: QuoteTemplateProps) {
  return (
    <p className="wipu-tpl-quote">
      {quote}
      {attribution && (
        <span className="wipu-tpl-quote-attr">{attribution}</span>
      )}
    </p>
  );
}
