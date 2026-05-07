/* Template 02 — Quote.
   Centered pull quote with optional emoji row + attribution. */

import type { ReactNode } from "react";

export type QuoteTemplateProps = {
  quote: ReactNode;
  attribution?: ReactNode;
  emojis?: ReactNode[];
};

export function QuoteTemplate({ quote, attribution, emojis }: QuoteTemplateProps) {
  return (
    <div className="wipu-tpl-quote-wrap">
      {emojis && emojis.length > 0 && (
        <div className="wipu-tpl-emojihead-row" aria-hidden>
          {emojis.map((e, i) => (
            <span key={i} className="wipu-tpl-emojihead-emoji">
              {e}
            </span>
          ))}
        </div>
      )}
      <p className="wipu-tpl-quote">
        {quote}
        {attribution && (
          <span className="wipu-tpl-quote-attr">{attribution}</span>
        )}
      </p>
    </div>
  );
}
