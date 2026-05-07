/* Split slide — hero metric on the left, pull quote on the right.
   Designed to pair a single quantitative signal with a qualitative
   one on the same beat. Stacks vertically below 1024px. */

import type { ReactNode } from "react";

export type MetricQuoteSplitProps = {
  metric: ReactNode;
  quote: ReactNode;
  attribution?: ReactNode;
};

export function MetricQuoteSplit({
  metric,
  quote,
  attribution,
}: MetricQuoteSplitProps) {
  return (
    <div className="wipu-tpl-mqs">
      <div className="wipu-tpl-mqs-left">{metric}</div>
      <figure className="wipu-tpl-mqs-right">
        <div className="wipu-tpl-mqs-block">
          <span className="wipu-tpl-mqs-mark wipu-tpl-mqs-mark-open" aria-hidden>
            &ldquo;
          </span>
          <blockquote className="wipu-tpl-mqs-quote">{quote}</blockquote>
          <span className="wipu-tpl-mqs-mark wipu-tpl-mqs-mark-close" aria-hidden>
            &rdquo;
          </span>
          {attribution && (
            <figcaption className="wipu-tpl-mqs-attr">
              — {attribution}
            </figcaption>
          )}
        </div>
      </figure>
    </div>
  );
}
