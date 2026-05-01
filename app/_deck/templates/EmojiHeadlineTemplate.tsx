/* Template — Emoji row + headline.
   A small horizontal row of emoji glyphs above a single centered
   monospace headline. Used for short framing beats — a "thesis" line
   with iconography that hints at the subject.

   The headline types on character-by-character once the slide is in
   view, with a blinking caret that cycles through the brand palette.
   Replays each time the slide returns to view (same pattern as
   StrokeHeroMetric). prefers-reduced-motion shows the headline fully
   typed; only the caret blinks. */

"use client";

import {
  Fragment,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactElement,
  type ReactNode,
} from "react";

function subscribeMounted() {
  return () => {};
}
function getMountedClient(): boolean {
  return true;
}
function getMountedServer(): boolean {
  return false;
}

export type EmojiHeadlineTemplateProps = {
  /** Row of emoji shown above the headline. Order matters. */
  emojis: ReactNode[];
  /** The headline. Default text reads dim; wrap emphasized fragments in
      <strong> to make them bright. */
  title: ReactNode;
  /** Optional small secondary line shown below the headline. Fades in once
      the type-on animation finishes (or immediately under reduced motion). */
  note?: ReactNode;
};

const PER_CHAR_MS = 70;

/* Recursively count text characters in a ReactNode tree so we know how
   many type-on steps the headline has. Mirrors the structure of `walk`
   below — they must agree on what counts as a character. */
function countChars(node: ReactNode): number {
  if (node == null || typeof node === "boolean") return 0;
  if (typeof node === "string" || typeof node === "number") {
    return Array.from(String(node)).length;
  }
  if (Array.isArray(node)) {
    return node.reduce<number>((acc, n) => acc + countChars(n), 0);
  }
  if (isValidElement(node)) {
    return countChars(
      (node.props as { children?: ReactNode }).children ?? null,
    );
  }
  return 0;
}

type WalkCtx = {
  idx: number;
  revealed: number;
  cursorPlaced: boolean;
};

/* Walk the title, splitting every text leaf into per-character spans.
   Wrapping elements (e.g. <strong>) are preserved by cloning. The cursor
   is inserted inline at the next-to-reveal position so it follows the
   typing front, then sticks at the end once the headline is complete. */
function walk(node: ReactNode, ctx: WalkCtx): ReactNode {
  if (node == null || typeof node === "boolean") return node;
  if (typeof node === "string" || typeof node === "number") {
    const chars = Array.from(String(node));
    const out: ReactNode[] = [];
    for (const ch of chars) {
      const i = ctx.idx;
      if (!ctx.cursorPlaced && i === ctx.revealed) {
        out.push(
          <span
            key="cur"
            className="wipu-tpl-emojihead-cursor"
            aria-hidden
          />,
        );
        ctx.cursorPlaced = true;
      }
      out.push(
        <span
          key={`c${i}`}
          className="wipu-tpl-emojihead-ch"
          data-visible={i < ctx.revealed ? true : undefined}
        >
          {ch}
        </span>,
      );
      ctx.idx += 1;
    }
    return out;
  }
  if (Array.isArray(node)) {
    return node.map((n, k) => (
      <Fragment key={`a${k}`}>{walk(n, ctx)}</Fragment>
    ));
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(el, undefined, walk(el.props.children ?? null, ctx));
  }
  return node;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function EmojiHeadlineTemplate({
  emojis,
  title,
  note,
}: EmojiHeadlineTemplateProps) {
  const total = useMemo(() => countChars(title), [title]);
  const [revealed, setRevealed] = useState(total);
  /* Walk-based per-character markup only happens after mount. SSR and the
     first client render emit the title verbatim — guarantees identical
     markup on both sides (no hydration mismatch). */
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getMountedClient,
    getMountedServer,
  );
  const wrapRef = useRef<HTMLDivElement | null>(null);

  /* IntersectionObserver retrigger — restart typing each time the slide
     returns to centerline. Mirrors StrokeHeroMetric's replay-on-revisit
     behavior so a return-trip looks identical to a first visit. */
  useEffect(() => {
    if (!mounted) return;
    const el = wrapRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      // Already in the fully-typed state from useState(total); nothing to do.
      return;
    }
    let intervalId: number | null = null;
    const stop = () => {
      if (intervalId != null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            stop();
            setRevealed(0);
            intervalId = window.setInterval(() => {
              setRevealed((r) => {
                if (r >= total) {
                  stop();
                  return total;
                }
                return r + 1;
              });
            }, PER_CHAR_MS);
          } else {
            stop();
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [mounted, total]);

  const rendered = useMemo(() => {
    if (!mounted) {
      // SSR + first hydration: render the title verbatim so the client
      // and server agree on every node. Cursor still blinks at the end.
      return (
        <>
          {title}
          <span
            key="cur-end"
            className="wipu-tpl-emojihead-cursor"
            aria-hidden
          />
        </>
      );
    }
    const ctx: WalkCtx = { idx: 0, revealed, cursorPlaced: false };
    const tree = walk(title, ctx);
    /* Cursor wasn't placed inline (typing is complete) — append it at
       the very end so it keeps blinking after the last character. */
    if (!ctx.cursorPlaced) {
      return (
        <>
          {tree}
          <span
            key="cur-end"
            className="wipu-tpl-emojihead-cursor"
            aria-hidden
          />
        </>
      );
    }
    return tree;
  }, [title, revealed, mounted]);

  return (
    <div ref={wrapRef} className="wipu-tpl-emojihead">
      <div className="wipu-tpl-emojihead-row" aria-hidden>
        {emojis.map((e, i) => (
          <span key={i} className="wipu-tpl-emojihead-emoji">
            {e}
          </span>
        ))}
      </div>
      <h2 className="wipu-tpl-emojihead-title">
        {/* Full title for assistive tech — typing tree is aria-hidden. */}
        <span className="wipu-tpl-emojihead-sr">{title}</span>
        <span className="wipu-tpl-emojihead-typed" aria-hidden="true">
          {rendered}
        </span>
      </h2>
      {note && (
        <p
          className="wipu-tpl-emojihead-note"
          data-visible={revealed >= total ? true : undefined}
        >
          {note}
        </p>
      )}
    </div>
  );
}
