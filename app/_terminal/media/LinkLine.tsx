"use client";

import { useEffect, useRef } from "react";

type Props = {
  label: string;
  href: string;
  active: boolean;
  onDone?: () => void;
};

/** A launch line that opens an external thing (a prototype) in a new tab —
 *  the spec's "link out, don't embed" approach. */
export function LinkLine({ label, href, active, onDone }: Props) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    onDoneRef.current?.();
  }, [active]);

  return (
    <a className="term-launch" href={href} target="_blank" rel="noreferrer">
      <span className="term-prompt-sym">↗</span>{" "}
      <span className="term-command">{label}</span>{" "}
      <span className="term-faint">— opens in a new tab</span>
    </a>
  );
}
