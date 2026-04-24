"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import type { SpokenWord } from "./usePlayback";

const EASE = [0.2, 0.7, 0.2, 1] as const;

type CaptionBarProps = {
  words: SpokenWord[];
};

export function CaptionBar({ words }: CaptionBarProps) {
  if (words.length === 0) return null;

  return (
    <motion.div
      className="proto-caption-window"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        layout: { duration: 0.4, ease: EASE },
        opacity: { duration: 0.24, ease: EASE },
      }}
      aria-live="polite"
    >
      <div className="proto-caption-content">
        {words.map((w, i) => (
          <Fragment key={w.id}>
            {i > 0 ? " " : ""}
            <motion.span
              className="proto-caption-word"
              data-speaker={w.speaker}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              {w.text}
            </motion.span>
          </Fragment>
        ))}
      </div>
    </motion.div>
  );
}
