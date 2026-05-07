/* Inline type-on for an arbitrary text fragment. Drop it inside a
   paragraph to type one portion while the rest of the surrounding
   copy reads as already-typed.

   Mirrors EmojiHeadlineTemplate: per-character spans hold layout
   (visibility, not display) so the line never reflows; cursor sits
   inline at the typing front and stays at the end after completion;
   IntersectionObserver replays each time the host slide returns to
   view; reduced-motion shows the fragment fully typed. */

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

export type TypeOnTextProps = {
  children: ReactNode;
  /** Per-character cadence in ms. Default matches EmojiHeadlineTemplate. */
  perCharMs?: number;
  /** Extra delay after revealing a whitespace character. */
  wordPauseMs?: number;
};

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

function flattenChars(node: ReactNode): string[] {
  if (node == null || typeof node === "boolean") return [];
  if (typeof node === "string" || typeof node === "number") {
    return Array.from(String(node));
  }
  if (Array.isArray(node)) {
    return node.flatMap(flattenChars);
  }
  if (isValidElement(node)) {
    return flattenChars(
      (node.props as { children?: ReactNode }).children ?? null,
    );
  }
  return [];
}

type WalkCtx = {
  idx: number;
  revealed: number;
  cursorPlaced: boolean;
};

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

export function TypeOnText({
  children,
  perCharMs = 70,
  wordPauseMs = 0,
}: TypeOnTextProps) {
  const total = useMemo(() => countChars(children), [children]);
  const chars = useMemo(() => flattenChars(children), [children]);
  const [revealed, setRevealed] = useState(total);
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getMountedClient,
    getMountedServer,
  );
  const wrapRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!mounted) return;
    const el = wrapRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    let timeoutId: number | null = null;
    const stop = () => {
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    const schedule = (next: number) => {
      if (next > total) return;
      const justRevealed = chars[next - 1];
      const delay =
        justRevealed && /\s/.test(justRevealed)
          ? perCharMs + wordPauseMs
          : perCharMs;
      timeoutId = window.setTimeout(() => {
        setRevealed(next);
        if (next < total) schedule(next + 1);
      }, delay);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            stop();
            setRevealed(0);
            schedule(1);
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
  }, [mounted, total, perCharMs, wordPauseMs, chars]);

  const rendered = useMemo(() => {
    if (!mounted) {
      return (
        <>
          {children}
          <span
            key="cur-end"
            className="wipu-tpl-emojihead-cursor"
            aria-hidden
          />
        </>
      );
    }
    const ctx: WalkCtx = { idx: 0, revealed, cursorPlaced: false };
    const tree = walk(children, ctx);
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
  }, [children, revealed, mounted]);

  return (
    <span ref={wrapRef} className="wipu-tpl-typeon">
      {/* Full text for assistive tech — typing tree is aria-hidden. */}
      <span className="wipu-tpl-emojihead-sr">{children}</span>
      <span aria-hidden="true">{rendered}</span>
    </span>
  );
}
