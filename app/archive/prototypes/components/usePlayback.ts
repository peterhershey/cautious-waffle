"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  DoshiChipCategory,
  DoshiEffect,
  DoshiRecommendation,
  ToastPayload,
  Turn,
} from "@/lib/prototypes";

type Status = "idle" | "playing" | "paused" | "ended";

export type SpokenWord = {
  id: number;
  speaker: "user" | "assistant";
  text: string;
  startsTurn: boolean;
};

export type DoshiChip = {
  id: string;
  label: string;
  category?: DoshiChipCategory;
};

export type DoshiTimelineState = {
  title: string | null;
  thinking: boolean;
  chips: DoshiChip[];
  backgroundSrc: string | null;
  recommendations: DoshiRecommendation[] | null;
  stage: 1 | 2;
};

const INITIAL_DOSHI: DoshiTimelineState = {
  title: null,
  thinking: false,
  chips: [],
  backgroundSrc: null,
  recommendations: null,
  stage: 1,
};

type TokenizedTurn = {
  speaker: "user" | "assistant";
  words: string[];
  holdMs: number;
  effects: DoshiEffect[];
};

const BETWEEN_TURNS_EXTRA_MS = 800;

function tokenize(turns: Turn[]): TokenizedTurn[] {
  return turns.map((t) => ({
    speaker: t.speaker,
    words: t.text.split(/\s+/).filter(Boolean),
    holdMs: t.holdMs,
    effects: t.effects ?? [],
  }));
}

function applyEffects(
  state: DoshiTimelineState,
  effects: DoshiEffect[],
): DoshiTimelineState {
  let next = state;
  for (const effect of effects) {
    next = applyEffect(next, effect);
  }
  return next;
}

function applyEffect(
  state: DoshiTimelineState,
  effect: DoshiEffect,
): DoshiTimelineState {
  switch (effect.kind) {
    case "set-title":
      return { ...state, title: effect.value };
    case "set-thinking":
      return { ...state, thinking: effect.value };
    case "add-chip": {
      const filtered = state.chips.filter((c) => c.id !== effect.id);
      return {
        ...state,
        chips: [
          ...filtered,
          { id: effect.id, label: effect.label, category: effect.category },
        ],
      };
    }
    case "set-background":
      return { ...state, backgroundSrc: effect.src };
    case "show-recommendations":
      return { ...state, recommendations: effect.cards };
    case "set-stage":
      return { ...state, stage: effect.value };
    case "show-toast":
    case "clear-toast":
      // Toasts are tracked outside the doshi timeline state — handled
      // separately in the playback loop.
      return state;
  }
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
  const [doshi, setDoshi] = useState<DoshiTimelineState>(INITIAL_DOSHI);
  const [toast, setToast] = useState<ToastPayload | null>(null);

  const tokenized = useMemo(() => tokenize(turns), [turns]);
  const tokenizedRef = useRef(tokenized);
  tokenizedRef.current = tokenized;

  const cursorRef = useRef({ turn: 0, word: 0 });
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<Status>("idle");
  const firedEffectsRef = useRef<Set<number>>(new Set());
  const effectTimersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const cancelTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cancelEffectTimers = useCallback(() => {
    for (const t of effectTimersRef.current) clearTimeout(t);
    effectTimersRef.current.clear();
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

    if (
      wordIdx === 0 &&
      turn.effects.length > 0 &&
      !firedEffectsRef.current.has(turnIdx)
    ) {
      firedEffectsRef.current.add(turnIdx);

      // Group effects by their `at` offset so co-scheduled effects apply
      // in a single state update (one chip + thinking-toggle look atomic).
      const groups = new Map<number, DoshiEffect[]>();
      for (const e of turn.effects) {
        const at = e.at ?? 0;
        const bucket = groups.get(at);
        if (bucket) bucket.push(e);
        else groups.set(at, [e]);
      }

      const applyGrouped = (effects: DoshiEffect[]) => {
        setDoshi((prev) => applyEffects(prev, effects));
        for (const effect of effects) {
          if (effect.kind === "show-toast") setToast(effect.toast);
          else if (effect.kind === "clear-toast") setToast(null);
        }
      };

      for (const [at, effects] of groups) {
        if (at <= 0) {
          applyGrouped(effects);
          continue;
        }
        const handle = setTimeout(() => {
          effectTimersRef.current.delete(handle);
          if (statusRef.current === "playing") {
            applyGrouped(effects);
          }
        }, at);
        effectTimersRef.current.add(handle);
      }
    }

    cursorRef.current = { turn: turnIdx, word: wordIdx + 1 };
    timerRef.current = setTimeout(step, wordDelay(word));
  }, [setStat]);

  const play = useCallback(() => {
    cancelTimer();
    if (statusRef.current === "ended") {
      cancelEffectTimers();
      setWords([]);
      setDoshi(INITIAL_DOSHI);
      setToast(null);
      firedEffectsRef.current = new Set();
      cursorRef.current = { turn: 0, word: 0 };
      idRef.current = 0;
    }
    setStat("playing");
    timerRef.current = setTimeout(step, 80);
  }, [cancelEffectTimers, cancelTimer, setStat, step]);

  const pause = useCallback(() => {
    cancelTimer();
    cancelEffectTimers();
    setStat("paused");
  }, [cancelEffectTimers, cancelTimer, setStat]);

  const restart = useCallback(() => {
    cancelTimer();
    cancelEffectTimers();
    setWords([]);
    setDoshi(INITIAL_DOSHI);
    setToast(null);
    firedEffectsRef.current = new Set();
    cursorRef.current = { turn: 0, word: 0 };
    idRef.current = 0;
    setStat("idle");
  }, [cancelEffectTimers, cancelTimer, setStat]);

  useEffect(() => {
    cancelTimer();
    cancelEffectTimers();
    setWords([]);
    setDoshi(INITIAL_DOSHI);
    setToast(null);
    firedEffectsRef.current = new Set();
    cursorRef.current = { turn: 0, word: 0 };
    idRef.current = 0;
    setStat("idle");
  }, [tokenized, cancelEffectTimers, cancelTimer, setStat]);

  useEffect(
    () => () => {
      cancelTimer();
      cancelEffectTimers();
    },
    [cancelEffectTimers, cancelTimer],
  );

  return { status, words, doshi, toast, play, pause, restart };
}
