"use client";

import { useEffect, useRef } from "react";

type Props = {
  name: string;
  avatarSrc: string;
  active: boolean;
  onDone?: () => void;
};

/** A quote attribution with a small round avatar — used to bring the Sundar
 *  portrait back into the vision pull-quote. */
export function Attribution({ name, avatarSrc, active, onDone }: Props) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    onDoneRef.current?.();
  }, [active]);

  return (
    <span className="term-attribution">
      <img className="term-attribution-avatar" src={avatarSrc} alt="" />
      <span className="term-accent">— {name}</span>
    </span>
  );
}
