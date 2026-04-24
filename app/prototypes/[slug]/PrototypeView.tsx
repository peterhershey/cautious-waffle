"use client";

import { useMemo, useState } from "react";
import type { Prototype } from "@/lib/prototypes";
import { PhoneFrame } from "../components/PhoneFrame";
import { CaptionBar } from "../components/CaptionBar";
import { ControlsPanel } from "../components/ControlsPanel";
import { DoshiCaption } from "../components/DoshiCaption";
import { DoshiControls } from "../components/DoshiControls";
import { DoshiPhone } from "../components/DoshiPhone";
import { GelControls } from "../components/GelControls";
import { GelFilter } from "../components/GelFilter";
import { StreamControls } from "../components/StreamControls";
import { usePlayback } from "../components/usePlayback";
import { VideoGenerationView } from "../components/VideoGenerationView";

export function PrototypeView({ prototype }: { prototype: Prototype }) {
  if (prototype.kind === "video-generation") {
    return <VideoGenerationView prototype={prototype} />;
  }
  return <VoiceChatView prototype={prototype} />;
}

type Platform = "ios" | "android";
type StreamStatus = "good" | "poor";

function VoiceChatView({ prototype }: { prototype: Prototype }) {
  const [scenarioId, setScenarioId] = useState(prototype.scenarios[0]?.id ?? "");
  const [platform, setPlatform] = useState<Platform>("ios");
  const [doshiEnabled, setDoshiEnabled] = useState(false);
  const [streamEnabled, setStreamEnabled] = useState(true);
  const [streamStatus, setStreamStatus] = useState<StreamStatus>("good");

  const scenario = useMemo(
    () => prototype.scenarios.find((s) => s.id === scenarioId) ?? prototype.scenarios[0],
    [prototype.scenarios, scenarioId]
  );

  const { status, words, play, pause, restart } = usePlayback(
    scenario?.turns ?? []
  );

  // DOSHI and the stream indicator are mutually exclusive — turning
  // one on automatically flips the other off.
  const handleDoshiChange = (on: boolean) => {
    setDoshiEnabled(on);
    if (on) setStreamEnabled(false);
  };
  const handleStreamChange = (on: boolean) => {
    setStreamEnabled(on);
    if (on) setDoshiEnabled(false);
  };

  return (
    <main className="proto-stage">
      <GelFilter />
      <div className="proto-phone-toggles">
        <div
          className="proto-platform-toggle"
          role="tablist"
          aria-label="Platform"
        >
          <button
            type="button"
            role="tab"
            aria-selected={platform === "ios"}
            className="proto-platform-chip"
            data-active={platform === "ios"}
            onClick={() => setPlatform("ios")}
          >
            iOS
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={platform === "android"}
            className="proto-platform-chip"
            data-active={platform === "android"}
            onClick={() => setPlatform("android")}
          >
            Android
          </button>
        </div>
      </div>
      <ControlsPanel
        prototype={prototype}
        activeScenarioId={scenario?.id ?? ""}
        onScenarioChange={setScenarioId}
        status={status}
        onPlay={play}
        onPause={pause}
        onRestart={restart}
      >
        <div className="proto-panel-section">
          <span className="proto-panel-kicker">Experiments</span>
          <div className="proto-experiments">
            <DoshiControls
              enabled={doshiEnabled}
              onEnabledChange={handleDoshiChange}
            />
            <StreamControls
              enabled={streamEnabled}
              onEnabledChange={handleStreamChange}
              status={streamStatus}
              onChange={setStreamStatus}
            />
          </div>
        </div>
        <GelControls />
      </ControlsPanel>
      <section className="proto-phone-stage">
        {doshiEnabled ? (
          <DoshiPhone
            platform={platform}
            streamEnabled={false}
            streamStatus={streamStatus}
            backgroundVideo={prototype.backgroundVideo}
          >
            <DoshiCaption words={words} />
          </DoshiPhone>
        ) : (
          <PhoneFrame
            title="Live"
            platform={platform}
            streamEnabled={streamEnabled}
            streamStatus={streamStatus}
            backgroundVideo={prototype.backgroundVideo}
          >
            <CaptionBar words={words} />
          </PhoneFrame>
        )}
      </section>
    </main>
  );
}
