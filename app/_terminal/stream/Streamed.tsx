"use client";

import { useTypewriter } from "./useTypewriter";

type Props = {
  text: string;
  /** When true, the text streams in; when false it's shown in full at once. */
  active: boolean;
  cps?: number;
  /** Show the blinking caret while streaming (and only while active). */
  cursor?: boolean;
  className?: string;
  onDone?: () => void;
};

/** A streamed run of text with an optional trailing terminal caret. */
export function Streamed({
  text,
  active,
  cps,
  cursor = false,
  className,
  onDone,
}: Props) {
  const { shown, done } = useTypewriter(text, { enabled: active, cps, onDone });
  return (
    <span className={className}>
      {shown}
      {cursor && active && !done ? (
        <span className="term-cursor" aria-hidden="true">
          ▍
        </span>
      ) : null}
    </span>
  );
}
