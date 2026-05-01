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

export function PrototypeView({
  prototype,
  embed = false,
  doshi = false,
}: {
  prototype: Prototype;
  embed?: boolean;
  doshi?: boolean;
}) {
  if (prototype.kind === "video-generation") {
    return <VideoGenerationView prototype={prototype} embed={embed} />;
  }
  return (
    <VoiceChatView prototype={prototype} embed={embed} initialDoshi={doshi} />
  );
}

type Platform = "ios" | "android";
type StreamStatus = "good" | "poor";

function VoiceChatView({
  prototype,
  embed,
  initialDoshi = false,
}: {
  prototype: Prototype;
  embed: boolean;
  initialDoshi?: boolean;
}) {
  const [doshiEnabled, setDoshiEnabled] = useState(initialDoshi);
  const initialScenarios =
    initialDoshi && (prototype.doshiScenarios?.length ?? 0) > 0
      ? prototype.doshiScenarios!
      : prototype.scenarios;
  const [scenarioId, setScenarioId] = useState(initialScenarios[0]?.id ?? "");
  const [platform, setPlatform] = useState<Platform>("ios");
  const [streamEnabled, setStreamEnabled] = useState(false);
  const [streamStatus, setStreamStatus] = useState<StreamStatus>("good");

  const doshiScenarios = prototype.doshiScenarios ?? [];
  const activeScenarios =
    doshiEnabled && doshiScenarios.length > 0
      ? doshiScenarios
      : prototype.scenarios;

  // When DOSHI flips, the scenario list swaps too — reset the cursor
  // to the first scenario in whichever list is now active.
  const handleDoshiChange = (on: boolean) => {
    setDoshiEnabled(on);
    const nextList =
      on && doshiScenarios.length > 0 ? doshiScenarios : prototype.scenarios;
    setScenarioId(nextList[0]?.id ?? "");
  };

  const scenario = useMemo(
    () => activeScenarios.find((s) => s.id === scenarioId) ?? activeScenarios[0],
    [activeScenarios, scenarioId]
  );

  const { status, words, doshi, toast, play, pause, restart } = usePlayback(
    scenario?.turns ?? []
  );

  const doshiBackground =
    doshi.backgroundSrc ??
    prototype.doshiBackgroundVideo ??
    prototype.backgroundVideo;

  return (
    <main className="proto-stage" data-embed={embed ? "true" : undefined}>
      {doshiEnabled ? null : <GelFilter />}
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
        scenarios={activeScenarios}
        activeScenarioId={scenario?.id ?? ""}
        onScenarioChange={setScenarioId}
        status={status}
        onPlay={play}
        onPause={pause}
        onRestart={restart}
      >
        <div className="proto-panel-section">
          <span className="proto-panel-kicker">Project Dashi</span>
          <DoshiControls
            enabled={doshiEnabled}
            onEnabledChange={handleDoshiChange}
          />
        </div>
        {doshiEnabled ? null : (
          <>
            <div className="proto-panel-section">
              <span className="proto-panel-kicker">Experiments</span>
              <div className="proto-experiments">
                <StreamControls
                  enabled={streamEnabled}
                  onEnabledChange={setStreamEnabled}
                  status={streamStatus}
                  onChange={setStreamStatus}
                />
              </div>
            </div>
            <GelControls />
          </>
        )}
      </ControlsPanel>
      <section className="proto-phone-stage">
        {doshiEnabled ? (
          <DoshiPhone
            platform={platform}
            streamEnabled={false}
            streamStatus={streamStatus}
            backgroundVideo={doshiBackground}
            title={doshi.title}
            thinking={doshi.thinking}
            chips={doshi.chips}
            recommendations={doshi.recommendations}
            stage={doshi.stage}
          >
            <DoshiCaption words={words} />
          </DoshiPhone>
        ) : (
          <PhoneFrame
            title="Live"
            platform={platform}
            streamEnabled={streamEnabled}
            streamStatus={streamStatus}
            backgroundVideo={scenario?.backgroundVideo ?? prototype.backgroundVideo}
            toast={toast}
          >
            <CaptionBar words={words} />
          </PhoneFrame>
        )}
      </section>
    </main>
  );
}
