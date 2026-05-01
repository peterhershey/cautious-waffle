"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export type VideoGenStep =
  | "welcome"
  | "tools-open"
  | "tool-selected"
  | "typing"
  | "planning"
  | "sent"
  | "ready";

type Status = "idle" | "playing" | "paused" | "ended";

const PROMPT =
  "Generate a video of a dog swimming in a pool with a pink floaty and sunglasses";

const HOLD_WELCOME = 1400;
const HOLD_TOOLS_OPEN = 1100;
const HOLD_TOOL_SELECTED = 650;
const TYPE_END_PAUSE = 700;
const DEFAULT_LOADING_MS = 10000;

function typeDelay(nextChar: string): number {
  if (/[.!?]/.test(nextChar)) return 260;
  if (/[,;:]/.test(nextChar)) return 140;
  if (nextChar === " ") return 40;
  return 28 + Math.random() * 22;
}

type PendingKind =
  | { kind: "step-transition"; to: VideoGenStep }
  | { kind: "type-char"; nextIndex: number }
  | { kind: "complete-typing" }
  | { kind: "finish-loading" };

export function useVideoGenPlayback({
  loadingMs = DEFAULT_LOADING_MS,
  submitStep = "sent",
}: { loadingMs?: number; submitStep?: VideoGenStep } = {}) {
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState<VideoGenStep>("welcome");
  const [typed, setTyped] = useState("");
  const loadingMsRef = useRef(loadingMs);
  loadingMsRef.current = loadingMs;
  const submitStepRef = useRef(submitStep);
  submitStepRef.current = submitStep;

  const statusRef = useRef<Status>("idle");
  const stepRef = useRef<VideoGenStep>("welcome");
  const typedRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<PendingKind | null>(null);
  const resumeAtRef = useRef<number>(0);
  const remainingRef = useRef<number>(0);

  const setStat = useCallback((s: Status) => {
    statusRef.current = s;
    setStatus(s);
  }, []);

  const setStepSafe = useCallback((s: VideoGenStep) => {
    stepRef.current = s;
    setStep(s);
  }, []);

  const cancel = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const runRef = useRef<() => void>(() => {});

  const schedule = useCallback((delay: number, pending: PendingKind) => {
    pendingRef.current = pending;
    resumeAtRef.current = Date.now() + delay;
    remainingRef.current = delay;
    timerRef.current = setTimeout(() => runRef.current(), delay);
  }, []);

  const advance = useCallback(() => {
    if (statusRef.current !== "playing") return;
    const s = stepRef.current;

    if (s === "welcome") {
      schedule(HOLD_WELCOME, { kind: "step-transition", to: "tools-open" });
      return;
    }
    if (s === "tools-open") {
      schedule(HOLD_TOOLS_OPEN, { kind: "step-transition", to: "tool-selected" });
      return;
    }
    if (s === "tool-selected") {
      schedule(HOLD_TOOL_SELECTED, { kind: "step-transition", to: "typing" });
      return;
    }
    if (s === "typing") {
      const nextIndex = typedRef.current.length + 1;
      if (nextIndex > PROMPT.length) {
        // Typing complete. Beat to read the prompt, then auto-submit so the
        // demo flows continuously into the loading state. Manual interaction
        // (send button / return key) still works mid-typing via pause + jumpTo.
        schedule(TYPE_END_PAUSE, { kind: "complete-typing" });
        return;
      }
      const nextChar = PROMPT[nextIndex - 1];
      schedule(typeDelay(nextChar), { kind: "type-char", nextIndex });
      return;
    }
    if (s === "planning") {
      // Halt at the plan — never auto-advance into loading. The user
      // confirms the plan manually via the Generate button (wired to
      // confirmPlan → jumpTo("sent")), which restarts playback.
      setStat("paused");
      return;
    }
    if (s === "sent") {
      schedule(loadingMsRef.current, { kind: "finish-loading" });
      return;
    }
  }, [schedule, setStat]);

  useLayoutEffect(() => {
    runRef.current = () => {
      if (statusRef.current !== "playing") return;
      const p = pendingRef.current;
      pendingRef.current = null;
      timerRef.current = null;
      if (!p) return;

      if (p.kind === "step-transition") {
        setStepSafe(p.to);
        advance();
        return;
      }
      if (p.kind === "type-char") {
        const nextStr = PROMPT.slice(0, p.nextIndex);
        typedRef.current = nextStr;
        setTyped(nextStr);
        advance();
        return;
      }
      if (p.kind === "complete-typing") {
        setStepSafe(submitStepRef.current);
        advance();
        return;
      }
      if (p.kind === "finish-loading") {
        setStepSafe("ready");
        setStat("ended");
        return;
      }
    };
  }, [advance, setStat, setStepSafe]);

  const play = useCallback(() => {
    cancel();
    pendingRef.current = null;
    if (statusRef.current === "ended") {
      typedRef.current = "";
      setTyped("");
      stepRef.current = "welcome";
      setStep("welcome");
    }
    setStat("playing");
    advance();
  }, [advance, cancel, setStat]);

  const pause = useCallback(() => {
    if (statusRef.current !== "playing") return;
    if (timerRef.current != null) {
      const remaining = Math.max(0, resumeAtRef.current - Date.now());
      remainingRef.current = remaining;
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setStat("paused");
  }, [setStat]);

  const resume = useCallback(() => {
    if (statusRef.current !== "paused") return;
    setStat("playing");
    if (pendingRef.current) {
      const delay = Math.max(0, remainingRef.current);
      resumeAtRef.current = Date.now() + delay;
      timerRef.current = setTimeout(() => runRef.current(), delay);
    } else {
      advance();
    }
  }, [advance, setStat]);

  const playOrResume = useCallback(() => {
    if (statusRef.current === "paused") {
      resume();
    } else {
      play();
    }
  }, [play, resume]);

  const restart = useCallback(() => {
    cancel();
    pendingRef.current = null;
    typedRef.current = "";
    setTyped("");
    stepRef.current = "welcome";
    setStep("welcome");
    setStat("idle");
  }, [cancel, setStat]);

  const startTyping = useCallback(() => {
    cancel();
    pendingRef.current = null;
    typedRef.current = "";
    setTyped("");
    stepRef.current = "typing";
    setStep("typing");
    setStat("playing");
    advance();
  }, [advance, cancel, setStat]);

  const jumpTo = useCallback(
    (target: VideoGenStep, typedText?: string) => {
      cancel();
      pendingRef.current = null;
      if (statusRef.current === "playing" || statusRef.current === "paused") {
        setStat("idle");
      }
      if (typedText !== undefined) {
        typedRef.current = typedText;
        setTyped(typedText);
      }
      stepRef.current = target;
      setStep(target);
      if (target === "sent") {
        setStat("playing");
        advance();
      }
    },
    [advance, cancel, setStat]
  );

  useEffect(() => () => cancel(), [cancel]);

  return {
    status,
    step,
    typedPrompt: typed,
    fullPrompt: PROMPT,
    play: playOrResume,
    pause,
    restart,
    jumpTo,
    startTyping,
  };
}
