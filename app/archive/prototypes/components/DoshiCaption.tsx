"use client";

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SpokenWord } from "./usePlayback";

type Props = {
  words: SpokenWord[];
};

type PrevEntry = { id: string; text: string };

const EASE = [0.22, 0.9, 0.24, 1] as const;
// How long a prior turn stays visible before it drifts up and fades.
const PREV_TIMEOUT_MS = 5000;
// Delay from the new turn's first word to when the prior turn gets
// archived into the prev slot — lets the new turn start "pushing"
// before the prev actually slides back.
const PUSH_BACK_DELAY_MS = 650;

/**
 * DOSHI caption — one active turn at the bottom (capped at 4 lines,
 * scrolls internally past that) and at most one prior turn above it.
 * The push-back is deliberately delayed so it feels like the new turn
 * is shoving the old one up, not pre-empting it.
 */
export function DoshiCaption({ words }: Props) {
  const [prev, setPrev] = useState<PrevEntry | null>(null);
  const prevWordsRef = useRef<SpokenWord[]>([]);
  const turnCounterRef = useRef(0);
  const pushBackTimerRef = useRef<number | null>(null);
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const priorWords = prevWordsRef.current;
    const isFreshTurn =
      words.length === 1 &&
      words[0]?.startsTurn === true &&
      priorWords.length > 0 &&
      priorWords[priorWords.length - 1]?.id !== words[0].id;

    if (isFreshTurn) {
      const archivedText = priorWords.map((w) => w.text).join(" ");
      const archivedId = `t${turnCounterRef.current++}`;
      // Don't jump — let the new turn start pushing first, then the
      // prior turn slides up into the prev slot.
      if (pushBackTimerRef.current != null) {
        window.clearTimeout(pushBackTimerRef.current);
      }
      pushBackTimerRef.current = window.setTimeout(() => {
        setPrev({ id: archivedId, text: archivedText });
        pushBackTimerRef.current = null;
      }, PUSH_BACK_DELAY_MS);
    }

    if (words.length === 0) {
      if (pushBackTimerRef.current != null) {
        window.clearTimeout(pushBackTimerRef.current);
        pushBackTimerRef.current = null;
      }
      setPrev(null);
    }

    prevWordsRef.current = words;
  }, [words]);

  // Auto-dismiss the prior turn after a beat so the stage stays focused
  // on the active utterance. Timer resets whenever a new prev arrives.
  useEffect(() => {
    if (!prev) return;
    const t = window.setTimeout(() => setPrev(null), PREV_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [prev]);

  useEffect(
    () => () => {
      if (pushBackTimerRef.current != null) {
        window.clearTimeout(pushBackTimerRef.current);
      }
    },
    [],
  );

  // Keep the latest word in view — when the active turn overflows the
  // 4-line frame, scroll so the newest content stays at the bottom.
  useLayoutEffect(() => {
    const el = currentRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [words]);

  if (words.length === 0 && !prev) return null;

  return (
    <div className="doshi-caption-stack">
      <AnimatePresence initial={false}>
        {prev ? (
          <motion.div
            key={prev.id}
            className="doshi-caption-prev"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 0.55, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            {prev.text}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="doshi-caption-current" ref={currentRef}>
        {words.map((w, i) => (
          <Fragment key={w.id}>
            {i > 0 ? " " : ""}
            <motion.span
              className="doshi-caption-word"
              data-speaker={w.speaker}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              {w.text}
            </motion.span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
