"use client";

import { getPrototype } from "@/lib/prototypes";
import { PrototypeView } from "../../archive/prototypes/[slug]/PrototypeView";
import { googleSans } from "../../archive/prototypes/fonts";

/* Direct-mounted prototype slide. Replaces the old same-origin iframe embed,
   which booted a second Next.js app on this thread (lag), throttled rAF/timers
   while offscreen (invisible/late elements), and walled off the deck's
   animation-pause + video-gating machinery. Mounting the component directly
   gives one React tree: instant paint, and the deck's slide-activity gating
   now reaches the prototype's videos and CSS animations.

   `.proto-root` carries the prototype design tokens (theme.css is imported by
   the case-studies layout); host-scoped overrides live in sample.css under
   `.wipu-sample-proto`. The standalone /archive/prototypes/[slug] pages and
   the terminal's `?embed=1` iframes keep using the same components. */
export function PrototypeEmbed({
  slug,
  doshi = false,
  defaultVideoOn = true,
}: {
  slug: string;
  doshi?: boolean;
  defaultVideoOn?: boolean;
}) {
  const prototype = getPrototype(slug);
  if (!prototype) return null;
  return (
    <section className="wipu-sample-proto" data-proto-embed="true">
      <div className={`${googleSans.variable} proto-root`}>
        <PrototypeView
          prototype={prototype}
          embed
          doshi={doshi}
          defaultVideoOn={defaultVideoOn}
        />
      </div>
    </section>
  );
}
