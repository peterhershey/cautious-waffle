"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Turn } from "@/lib/prototypes";

type Status = "idle" | "playing" | "paused" | "ended";

export type SpokenWord = {
  id: number;
  speaker: "user" | "assistant";
  text: string;
  startsTurn: boolean;
};

type TokenizedTurn = {
  speaker: "user" | "assistant";
  words: string[];
  holdMs: number;
};

const BETWEEN_TURNS_EXTRA_MS = 800;

function tokenize(turns: Turn[]): TokenizedTurn[] {
  return turns.map((t) => ({
    speaker: t.speaker,
    words: t.text.split(/\s+/).filter(Boolean),
    holdMs: t.holdMs,
  }));
}

// Roughly human speaking pace: ~3.5 words/sec for short words, slower for long.
// A trailing period/question mark adds a small beat.
function wordDelay(word: string): number {
  const clean = word.replace(/[^\p{L}\p{N}']/gu, "");
  let ms = 160 + 26 * Math.min(clean.length, 12);
  if (/[.!?]$/.test(word)) ms += 260;
  else if (/[,;:—]$/.test(word)) ms += 120;
  return ms;
}

export function usePlayback(turns: Turn[]) {
  const [words, setWords] = useState<SpokenWord[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  const tokenized = useMemo(() => tokenize(turns), [turns]);
  const tokenizedRef = useRef(tokenized);
  tokenizedRef.current = tokenized;

  const cursorRef = useRef({ turn: 0, word: 0 });
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<Status>("idle");

  const cancelTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setStat = useCallback((s: Status) => {
    statusRef.current = s;
    setStatus(s);
  }, []);

  const step = useCallback(() => {
    if (statusRef.current !== "playing") return;

    const { turn: turnIdx, word: wordIdx } = cursorRef.current;
    const turn = tokenizedRef.current[turnIdx];

    if (!turn) {
      setStat("ended");
      return;
    }

    const word = turn.words[wordIdx];

    if (word == null) {
      // Turn exhausted. Hold so the viewer can read the final line with
      // the previous content still visible, then fall through to the next
      // turn — whose first word will REPLACE the prior turn's words,
      // shrinking the bubble in one smooth step.
      const nextTurn = turnIdx + 1;
      if (nextTurn >= tokenizedRef.current.length) {
        timerRef.current = setTimeout(() => {
          if (statusRef.current !== "playing") return;
          setStat("ended");
        }, turn.holdMs);
        return;
      }
      timerRef.current = setTimeout(() => {
        if (statusRef.current !== "playing") return;
        cursorRef.current = { turn: nextTurn, word: 0 };
        step();
      }, turn.holdMs + BETWEEN_TURNS_EXTRA_MS);
      return;
    }

    const id = idRef.current++;
    const isNewTurn = wordIdx === 0 && turnIdx > 0;
    const spoken: SpokenWord = {
      id,
      speaker: turn.speaker,
      text: word,
      startsTurn: wordIdx === 0,
    };
    setWords((prev) => (isNewTurn ? [spoken] : [...prev, spoken]));

    cursorRef.current = { turn: turnIdx, word: wordIdx + 1 };
    timerRef.current = setTimeout(step, wordDelay(word));
  }, [setStat]);

  const play = useCallback(() => {
    cancelTimer();
    if (statusRef.current === "ended") {
      setWords([]);
      cursorRef.current = { turn: 0, word: 0 };
      idRef.current = 0;
    }
    setStat("playing");
    timerRef.current = setTimeout(step, 80);
  }, [cancelTimer, setStat, step]);

  const pause = useCallback(() => {
    cancelTimer();
    setStat("paused");
  }, [cancelTimer, setStat]);

  const restart = useCallback(() => {
    cancelTimer();
    setWords([]);
    cursorRef.current = { turn: 0, word: 0 };
    idRef.current = 0;
    setStat("idle");
  }, [cancelTimer, setStat]);

  useEffect(() => {
    cancelTimer();
    setWords([]);
    cursorRef.current = { turn: 0, word: 0 };
    idRef.current = 0;
    setStat("idle");
  }, [tokenized, cancelTimer, setStat]);

  useEffect(() => () => cancelTimer(), [cancelTimer]);

  return { status, words, play, pause, restart };
}
