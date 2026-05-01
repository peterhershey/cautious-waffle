"use client";

import { useEffect } from "react";
import { getPrototype } from "@/lib/prototypes";
import { CaptionBar } from "../../prototypes/components/CaptionBar";
import { PhoneFrame } from "../../prototypes/components/PhoneFrame";
import { usePlayback } from "../../prototypes/components/usePlayback";

/**
 * Embedded version of the /prototypes/voice-chat prototype — the Gemini Live
 * Video Streaming experience. Same PhoneFrame + CaptionBar + usePlayback, just
 * without the controls panel. Auto-plays the first scenario and loops.
 */
export function LiveVideoEmbed() {
  const proto = getPrototype("voice-chat");
  const scenario = proto?.scenarios[0];
  const { status, words, play, restart } = usePlayback(scenario?.turns ?? []);

  useEffect(() => {
    play();
  }, [play]);

  useEffect(() => {
    if (status !== "ended") return;
    const t = setTimeout(() => {
      restart();
      play();
    }, 1400);
    return () => clearTimeout(t);
  }, [status, play, restart]);

  return (
    <div className="wipu-live-embed proto-root">
      <PhoneFrame title="Live" backgroundVideo={proto?.backgroundVideo}>
        <CaptionBar words={words} />
      </PhoneFrame>
    </div>
  );
}
