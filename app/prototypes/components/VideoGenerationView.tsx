"use client";

import { useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import type { Prototype } from "@/lib/prototypes";
import { ControlsPanel } from "./ControlsPanel";
import {
  GeminiPhone,
  PhoneScreenContext,
  PhonePlatformContext,
  type Platform,
} from "./GeminiPhone";
import { useVideoGenPlayback, type VideoGenStep } from "./useVideoGenPlayback";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const SPARKLE_SRC = "/prototypes/video-generation/gemini-sparkle.svg";
const VIDEO_SRC = "/prototypes/video-generation/generated-video.mp4";
const VIDEO_SRC_CAR = "/prototypes/video-generation/veo/car-becomes-spaceship.mp4";
const CAR_IMAGE_SRC = "/assets/samples/camera-roll-car.jpg";

function Icon({
  name,
  size = 24,
  filled = false,
}: {
  name: string;
  size?: number;
  filled?: boolean;
}) {
  return (
    <span
      className="proto-icon"
      style={{
        fontSize: `calc(${size} * var(--u, 1px))`,
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function VideoGenerationView({ prototype }: { prototype: Prototype }) {
  const [chipActive, setChipActive] = useState(false);
  const [greetingTop, setGreetingTop] = useState(false);
  const [platform, setPlatform] = useState<Platform>("ios");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [experiments, setExperiments] = useState<Experiments>({
    imageIn: false,
    imageInAdvanced: false,
    loadingTutorials: false,
    videoPlan: false,
  });

  const {
    status,
    step,
    typedPrompt,
    fullPrompt,
    play,
    pause,
    restart,
    jumpTo,
    startTyping,
  } = useVideoGenPlayback({
    loadingMs: experiments.loadingTutorials ? 20000 : 10000,
  });

  // imageIn <-> imageInAdvanced are mutex with each other.
  // videoPlan is mutex with all other experiments.
  // loadingTutorials is otherwise additive.
  const toggleExperiment = useCallback((key: keyof Experiments) => {
    setExperiments((prev) => {
      const turningOn = !prev[key];
      const next = { ...prev, [key]: !prev[key] };
      if (turningOn) {
        if (key === "videoPlan") {
          next.imageIn = false;
          next.imageInAdvanced = false;
          next.loadingTutorials = false;
        } else {
          next.videoPlan = false;
          if (key === "imageIn") next.imageInAdvanced = false;
          if (key === "imageInAdvanced") next.imageIn = false;
        }
      }
      return next;
    });
  }, []);

  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Keep the sheet in sync with autoplay step transitions only. Opening or
  // closing the sheet manually does NOT change `step`, so the keyboard /
  // content-area stay put — the greeting only moves when the keyboard does.
  useEffect(() => {
    setSheetOpen(step === "tools-open");
  }, [step]);

  const imageSuggestions = experiments.imageInAdvanced
    ? [
        "Epic space battle",
        "Gentle falling snow",
        "Golden hour drift",
        "Neon rain",
      ]
    : [
        "A subtle breeze moves through the frame",
        "Morning light shifts across the scene",
        "Neon signs flicker awake at dusk",
        "Rain begins to fall lightly",
      ];
  const inputPlaceholder = attachedImage
    ? experiments.imageInAdvanced
      ? "Describe your video"
      : "Animate your image"
    : chipActive
      ? "Describe your video"
      : "Ask Gemini";
  const isLoading = step === "sent";
  // After submit, the attachment has been "used" — pill stays collapsed
  // through planning (video-plan experiment), loading, and ready.
  const inputCollapsed =
    step === "sent" || step === "ready" || step === "planning";

  // Submit helper: video-plan experiment inserts a proposal step before
  // the actual generation; otherwise we go straight to loading.
  const submitPrompt = useCallback(
    (prompt: string) => {
      if (experiments.videoPlan) {
        jumpTo("planning", prompt);
      } else {
        jumpTo("sent", prompt);
      }
    },
    [experiments.videoPlan, jumpTo],
  );

  const confirmPlan = useCallback(() => {
    jumpTo("sent", typedPrompt || fullPrompt);
  }, [jumpTo, typedPrompt, fullPrompt]);
  const videoSrc =
    experiments.imageInAdvanced && attachedImage === CAR_IMAGE_SRC
      ? VIDEO_SRC_CAR
      : VIDEO_SRC;

  // Advanced image-to-image: tapping a starter chip is a one-tap submit —
  // skip typing and jump straight to the loading (or planning) stage.
  const selectSuggestion = useCallback(
    (s: string) => {
      submitPrompt(s);
    },
    [submitPrompt],
  );
  const imageMode: "simple" | "advanced" = experiments.imageInAdvanced
    ? "advanced"
    : "simple";

  const [settingsOpen, setSettingsOpen] = useState(false);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const dismissSettings = useCallback(() => setSettingsOpen(false), []);

  const [shareOpen, setShareOpen] = useState(false);
  const openShare = useCallback(() => setShareOpen(true), []);
  const dismissShare = useCallback(() => setShareOpen(false), []);

  // Clear settings sheet if advanced experiment or image goes away.
  useEffect(() => {
    if (!experiments.imageInAdvanced || !attachedImage) {
      setSettingsOpen(false);
    }
  }, [experiments.imageInAdvanced, attachedImage]);

  const attachImage = useCallback((src: string) => {
    setAttachedImage(src);
    setSheetOpen(false);
    // Step is left untouched — keyboard/greeting state is preserved.
  }, []);

  const removeAttachedImage = useCallback(() => {
    setAttachedImage(null);
  }, []);

  // If neither image experiment is on, clear any attached image so the pill
  // returns to its default state.
  useEffect(() => {
    if (!experiments.imageIn && !experiments.imageInAdvanced && attachedImage) {
      setAttachedImage(null);
    }
  }, [experiments.imageIn, experiments.imageInAdvanced, attachedImage]);

  useEffect(() => {
    if (step === "welcome") {
      setChipActive(false);
      setGreetingTop(false);
    } else if (step === "tool-selected" || step === "typing") {
      setGreetingTop(true);
    }
    // tools-open / sent / ready: preserve existing greeting position
  }, [step]);

  const chipVisible =
    chipActive && (step === "tool-selected" || step === "typing");

  const focusInput = useCallback(() => {
    setChipActive(false);
    if (step === "welcome") {
      jumpTo("tool-selected", "");
    }
  }, [jumpTo, step]);

  const dismissInput = useCallback(() => {
    if (step === "tool-selected" || step === "typing") {
      jumpTo("welcome", "");
    }
  }, [jumpTo, step]);

  const selectVideoTool = useCallback(() => {
    setChipActive(true);
    setSheetOpen(false);
    jumpTo("tool-selected", "");
  }, [jumpTo]);

  const jumpToPhase = useCallback(
    (phase: FlowPhaseId) => {
      switch (phase) {
        case "welcome":
          jumpTo("welcome", "");
          break;
        case "discovery":
          jumpTo("tools-open", "");
          break;
        case "input":
          jumpTo("tool-selected", "");
          break;
        case "loading":
          jumpTo("sent", fullPrompt);
          break;
        case "ready":
          jumpTo("ready", fullPrompt);
          break;
      }
    },
    [jumpTo, fullPrompt],
  );

  return (
    <main className="proto-stage">
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
        <button
          type="button"
          className="proto-theme-btn"
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          aria-pressed={theme === "dark"}
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        >
          <Icon
            name={theme === "light" ? "dark_mode" : "light_mode"}
            size={18}
            filled
          />
        </button>
      </div>
      <ControlsPanel
        prototype={prototype}
        activeScenarioId={prototype.scenarios[0]?.id ?? ""}
        onScenarioChange={() => {}}
        status={status}
        onPlay={play}
        onPause={pause}
        onRestart={restart}
      >
        <FlowTimeline currentStep={step} onJump={jumpToPhase} />
        <ExperimentsPanel
          experiments={experiments}
          onToggle={toggleExperiment}
        />
      </ControlsPanel>
      <section
        className="proto-phone-stage proto-gemini"
        data-theme={theme}
      >
        <div className="proto-phone-column">
        <GeminiPhone platform={platform}>
          <div className="gemini-screen-stack">
            <div className="gemini-content-area" onClick={dismissInput}>
              <AnimatePresence mode="wait">
                {step === "sent" || step === "ready" || step === "planning" ? (
                  <ChatState
                    key="chat"
                    prompt={typedPrompt || fullPrompt}
                    step={step}
                    videoSrc={videoSrc}
                    tutorials={
                      experiments.loadingTutorials ? LOADING_TUTORIALS : null
                    }
                    onConfirmPlan={confirmPlan}
                    onShare={openShare}
                  />
                ) : (
                  <WelcomeState
                    key="welcome-state"
                    centered={!greetingTop}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="gemini-bottom-dock">
              <InputPill
                text={step === "typing" ? typedPrompt : ""}
                showCaret={step === "typing" || step === "tool-selected"}
                chipVisible={chipVisible}
                onFocus={focusInput}
                onOpenTools={() => setSheetOpen(true)}
                onRemoveChip={() => jumpTo("welcome", "")}
                onSend={() => submitPrompt(fullPrompt)}
                placeholder={inputPlaceholder}
                imageSrc={attachedImage}
                imageSuggestions={imageSuggestions}
                imageMode={imageMode}
                onRemoveImage={removeAttachedImage}
                onOpenSettings={openSettings}
                onSelectSuggestion={
                  experiments.imageInAdvanced ? selectSuggestion : undefined
                }
                isLoading={isLoading}
                collapsed={inputCollapsed}
                onStop={() => jumpTo("typing", typedPrompt || fullPrompt)}
              />
              <AnimatePresence>
                {step === "tool-selected" || step === "typing" ? (
                  <Keyboard
                    key="kb"
                    onFill={startTyping}
                    onSend={() => submitPrompt(fullPrompt)}
                  />
                ) : null}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {sheetOpen ? (
                <ToolSheet
                  key="sheet"
                  onSelectVideo={selectVideoTool}
                  onDismiss={() => {
                    setSheetOpen(false);
                    if (step === "tools-open") jumpTo("welcome", "");
                  }}
                  onSelectImage={
                    experiments.imageIn || experiments.imageInAdvanced
                      ? attachImage
                      : undefined
                  }
                />
              ) : null}
            </AnimatePresence>
            <AnimatePresence>
              {settingsOpen && attachedImage ? (
                <VideoSettingsSheet
                  key="settings"
                  imageSrc={attachedImage}
                  onDismiss={dismissSettings}
                />
              ) : null}
            </AnimatePresence>
            <SharePortalHost>
              <AnimatePresence>
                {shareOpen ? (
                  <motion.div
                    key="share-scrim"
                    className="gemini-sheet-scrim"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    onClick={dismissShare}
                  />
                ) : null}
              </AnimatePresence>
              <AnimatePresence>
                {shareOpen ? (
                  <ShareSheet
                    key="share"
                    platform={platform}
                    videoSrc={videoSrc}
                    onDismiss={dismissShare}
                  />
                ) : null}
              </AnimatePresence>
            </SharePortalHost>
          </div>
        </GeminiPhone>
        </div>
      </section>
    </main>
  );
}

function WelcomeState({ centered }: { centered: boolean }) {
  return (
    <motion.div
      className="gemini-welcome"
      data-centered={centered}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <motion.div
        layout
        className="gemini-sparkle-large"
        transition={{ layout: { duration: 0.38, ease: EASE } }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SPARKLE_SRC} alt="" width={56} height={56} />
      </motion.div>
      <motion.h2
        layout
        className="gemini-greeting"
        transition={{ layout: { duration: 0.38, ease: EASE } }}
      >
        Hi Peter, how can I help?
      </motion.h2>
    </motion.div>
  );
}

function ChatState({
  prompt,
  step,
  tutorials,
  videoSrc,
  onConfirmPlan,
  onShare,
}: {
  prompt: string;
  step: VideoGenStep;
  tutorials?: TutorialVignette[] | null;
  videoSrc: string;
  onConfirmPlan?: () => void;
  onShare?: () => void;
}) {
  const tutorialsActive = step === "sent" && !!tutorials && tutorials.length > 0;
  const assistantText =
    step === "ready"
      ? "Your video is ready!"
      : step === "planning"
        ? "Here's a proposal for that video. If you need to update it, let me know!"
        : "On it! Working on your video, feel free to leave and check back later.";
  return (
    <motion.div
      className="gemini-chat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <motion.div
        className="gemini-user-bubble"
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        {prompt}
      </motion.div>

      <div className="gemini-assistant-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SPARKLE_SRC}
          alt=""
          width={22}
          height={22}
          className="gemini-sparkle-inline"
        />
        <motion.p
          className="gemini-assistant-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3, ease: EASE }}
        >
          {assistantText}
        </motion.p>
      </div>

      <motion.div
        layout
        className="gemini-media-card"
        data-state={step}
        transition={{ layout: { duration: 0.6, ease: EASE } }}
      >
        <AnimatePresence mode="wait">
          {step === "planning" ? (
            <VideoPlanCard
              key="plan"
              prompt={prompt}
              onGenerate={() => onConfirmPlan?.()}
            />
          ) : step === "sent" ? (
            tutorialsActive ? (
              <LoadingTutorialCard
                key="loader-tutorials"
                tutorials={tutorials!}
              />
            ) : (
              <motion.div
                key="loader"
                className="gemini-loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <SpinnerGlyph />
                <div className="gemini-loader-text">
                  <div className="gemini-loader-title">Generating your video…</div>
                  <div className="gemini-loader-sub">This can take 1-2 minutes</div>
                </div>
              </motion.div>
            )
          ) : (
            <Player key={videoSrc} src={videoSrc} onShare={onShare} />
          )}
        </AnimatePresence>
      </motion.div>

      {step === "ready" ? (
        <motion.div
          className="gemini-action-row"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3, ease: EASE }}
        >
          <ActionIcon label="Like">
            <Icon name="thumb_up" size={20} />
          </ActionIcon>
          <ActionIcon label="Dislike">
            <Icon name="thumb_down" size={20} />
          </ActionIcon>
          <ActionIcon label="Share">
            <Icon name="share" size={20} />
          </ActionIcon>
          <ActionIcon label="More">
            <Icon name="more_horiz" size={20} />
          </ActionIcon>
          <div className="gemini-action-spacer" />
          <ActionIcon label="Volume">
            <Icon name="volume_up" size={20} />
          </ActionIcon>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "00:00";
  const s = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

function Player({ src, onShare }: { src: string; onShare?: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const draggingRef = useRef(false);
  const hideTimerRef = useRef<number | null>(null);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const portalTarget = useContext(PhoneScreenContext);
  const platform = useContext(PhonePlatformContext);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false);
      hideTimerRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    showControls();
    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [showControls]);

  useEffect(() => {
    if (!isPlaying) return;
    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v) setCurrentTime(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying]);

  const toggleFullscreen = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setFullscreen((v) => !v);
      showControls();
    },
    [showControls],
  );

  const togglePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
      showControls();
    },
    [showControls],
  );

  const seekToFraction = useCallback((fraction: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration === 0) return;
    v.currentTime = Math.max(0, Math.min(1, fraction)) * v.duration;
  }, []);

  const handleScrubPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rail = e.currentTarget;
    rail.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    const rect = rail.getBoundingClientRect();
    seekToFraction((e.clientX - rect.left) / rect.width);
    showControls();
  };

  const handleScrubPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    seekToFraction((e.clientX - rect.left) / rect.width);
    showControls();
  };

  const handleScrubPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    draggingRef.current = false;
  };

  const progress = duration > 0 ? currentTime / duration : 0;
  const progressPct = `${progress * 100}%`;

  const content = (
    <motion.div
      className={`gemini-player${fullscreen ? " is-fullscreen" : ""}`}
      data-controls-visible={controlsVisible ? "true" : "false"}
      onClick={showControls}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <video
        ref={videoRef}
        className="gemini-player-video"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      />
      <div className="gemini-player-topright">
        <button
          type="button"
          className="gemini-player-chip"
          aria-label="Share"
          onClick={(e) => {
            e.stopPropagation();
            onShare?.();
          }}
        >
          <Icon
            name={platform === "ios" ? "ios_share" : "share"}
            size={18}
          />
        </button>
        <span className="gemini-player-chip" aria-label="Download">
          <Icon name="download" size={18} />
        </span>
      </div>
      <button
        type="button"
        className="gemini-player-play"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={togglePlay}
      >
        <Icon name={isPlaying ? "pause" : "play_arrow"} size={32} filled />
      </button>
      <div className="gemini-player-bottom">
        <div className="gemini-player-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="gemini-player-scrub-row">
          <div
            className="gemini-player-scrubber"
            onPointerDown={handleScrubPointerDown}
            onPointerMove={handleScrubPointerMove}
            onPointerUp={handleScrubPointerUp}
            onPointerCancel={handleScrubPointerUp}
          >
            <div
              className="gemini-player-progress"
              style={{ width: progressPct }}
            />
            <div
              className="gemini-player-thumb"
              style={{ left: progressPct }}
            />
          </div>
          <button
            type="button"
            className="gemini-player-expand"
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={toggleFullscreen}
          >
            <Icon name={fullscreen ? "fullscreen_exit" : "fullscreen"} size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (fullscreen && portalTarget) {
    return createPortal(content, portalTarget);
  }
  return content;
}

function InputPill({
  text,
  showCaret,
  chipVisible,
  onOpenTools,
  onRemoveChip,
  onSend,
  onFocus,
  placeholder = "Ask Gemini",
  imageSrc = null,
  imageSuggestions = [],
  imageMode = "simple",
  onRemoveImage,
  onOpenSettings,
  onSelectSuggestion,
  isLoading = false,
  collapsed = false,
  onStop,
}: {
  text: string;
  showCaret: boolean;
  chipVisible: boolean;
  onOpenTools: () => void;
  onRemoveChip: () => void;
  onSend: () => void;
  onFocus: () => void;
  placeholder?: string;
  imageSrc?: string | null;
  imageSuggestions?: string[];
  imageMode?: "simple" | "advanced";
  onRemoveImage?: () => void;
  onOpenSettings?: () => void;
  onSelectSuggestion?: (suggestion: string) => void;
  isLoading?: boolean;
  collapsed?: boolean;
  onStop?: () => void;
}) {
  const hasText = text.length > 0;
  const hasImage = imageSrc !== null;
  // Once submitted (loading or ready), the pill collapses — the attachment
  // has been used, so no image preview, attachments, or chip reappear.
  const isCollapsed = isLoading || collapsed;
  const showAdvancedPreview =
    hasImage && imageMode === "advanced" && !isCollapsed;
  const showSimpleAttachments =
    hasImage && imageMode !== "advanced" && !isCollapsed;
  const showChip = chipVisible && !isCollapsed;
  const isExpanded = showChip || showAdvancedPreview || showSimpleAttachments;

  // Staggered suggestion reveal: each chip keeps its natural size but shows
  // a diagonal shimmer until its turn to resolve into the real text.
  const [revealedCount, setRevealedCount] = useState(0);
  useEffect(() => {
    if (!imageSrc) {
      setRevealedCount(0);
      return;
    }
    setRevealedCount(0);
    const total = imageSuggestions.length;
    const base = 2000; // initial shimmer before first chip resolves
    const step = 1800; // time between each chip resolving
    const timers: number[] = [];
    for (let i = 0; i < total; i++) {
      timers.push(
        window.setTimeout(() => {
          setRevealedCount(i + 1);
        }, base + i * step),
      );
    }
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [imageSrc, imageSuggestions.length]);
  return (
    <motion.div
      layout
      className="gemini-input"
      data-expanded={isExpanded ? "true" : undefined}
      data-mode={showAdvancedPreview ? "advanced" : undefined}
      data-loading={isLoading ? "true" : undefined}
      onClick={isCollapsed ? undefined : onFocus}
      transition={{ layout: { duration: 0.32, ease: EASE } }}
    >
      <AnimatePresence initial={false}>
        {showAdvancedPreview ? (
          <motion.div
            key="preview"
            layout
            className="gemini-input-preview"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="gemini-input-preview-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc ?? undefined} alt="" />
              <button
                type="button"
                className="gemini-input-preview-x"
                aria-label="Remove image"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage?.();
                }}
              >
                <Icon name="close" size={16} />
              </button>
              {imageSuggestions.length > 0 ? (
                <div className="gemini-input-preview-chips">
                  {imageSuggestions.slice(0, 2).map((s, i) => {
                    const ready = i < revealedCount;
                    const clickable = !!onSelectSuggestion && ready;
                    const body = (
                      <motion.span
                        className="gemini-preview-chip-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: ready ? 1 : 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        {s}
                      </motion.span>
                    );
                    if (clickable) {
                      return (
                        <button
                          key={i}
                          type="button"
                          className="gemini-preview-chip"
                          data-state="ready"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSuggestion?.(s);
                          }}
                        >
                          {body}
                        </button>
                      );
                    }
                    return (
                      <div
                        key={i}
                        className="gemini-preview-chip"
                        data-state={ready ? "ready" : "loading"}
                      >
                        {body}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="gemini-input-preview-tune"
              aria-label="Video settings"
              onClick={(e) => {
                e.stopPropagation();
                onOpenSettings?.();
              }}
            >
              <Icon name="tune" size={20} />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {showSimpleAttachments ? (
          <motion.div
            key="attachments"
            layout
            className="gemini-input-attachments"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <div className="gemini-input-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc ?? undefined} alt="" />
              <button
                type="button"
                className="gemini-input-image-x"
                aria-label="Remove image"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage?.();
                }}
              >
                <Icon name="close" size={14} />
              </button>
            </div>
            {imageSuggestions.length > 0 ? (
              <div className="gemini-input-suggest">
                {imageSuggestions.map((s, i) => {
                  const ready = i < revealedCount;
                  return (
                    <div
                      key={i}
                      className="gemini-suggest-chip"
                      data-state={ready ? "ready" : "loading"}
                    >
                      <motion.span
                        className="gemini-suggest-chip-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: ready ? 1 : 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        {s}
                      </motion.span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <motion.div layout className="gemini-input-row">
        <span className="gemini-input-text" data-empty={!hasText}>
          {showCaret && !hasText ? (
            <span className="gemini-caret" aria-hidden />
          ) : null}
          {hasText ? text : placeholder}
          {showCaret && hasText ? (
            <span className="gemini-caret" aria-hidden />
          ) : null}
        </span>
        <button
          type="button"
          className="gemini-input-btn"
          aria-label="Add"
          onClick={onOpenTools}
        >
          <Icon name="add" size={22} />
        </button>
        <AnimatePresence initial={false}>
          {showChip ? (
            <motion.div
              key="chip"
              layout
              className="gemini-input-chip-slot"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <VideoChip onRemove={onRemoveChip} />
            </motion.div>
          ) : null}
        </AnimatePresence>
        {isLoading ? (
          <button
            type="button"
            className="gemini-input-btn gemini-input-stop"
            aria-label="Stop generating"
            onClick={(e) => {
              e.stopPropagation();
              onStop?.();
            }}
          >
            <Icon name="stop" size={20} filled />
          </button>
        ) : (
          <>
            <span className="gemini-input-btn" aria-label="Voice">
              <Icon name="mic" size={20} />
            </span>
            {hasText ? (
              <button
                type="button"
                className="gemini-input-btn gemini-input-send"
                aria-label="Send"
                onClick={onSend}
              >
                <Icon name="send" size={20} filled />
              </button>
            ) : (
              <span className="gemini-input-btn" aria-label="Live">
                <Icon name="graphic_eq" size={20} />
              </span>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function VideoChip({ onRemove }: { onRemove: () => void }) {
  return (
    <div className="gemini-chip">
      <Icon name="movie" size={16} />
      <span>Video</span>
      <button
        type="button"
        aria-label="Remove"
        className="gemini-chip-x"
        onClick={onRemove}
      >
        <Icon name="close" size={14} />
      </button>
    </div>
  );
}

const SHEET_Y_COLLAPSED = "50%"; // 50% visible
const SHEET_Y_EXPANDED = "10%"; // 90% visible
const SHEET_Y_HIDDEN = "100%";
const SHEET_SPRING = { type: "spring" as const, stiffness: 360, damping: 34, mass: 0.7 };

type ShareContact = {
  name: string;
  initials: string;
  bg: string;
  badgeIcon: string;
  badgeBg: string;
};

type ShareApp = {
  name: string;
  icon: string;
  bg: string;
  color?: string;
};

const ANDROID_SHARE_CONTACTS: ShareContact[] = [
  { name: "Anna", initials: "A", bg: "#f0c0a8", badgeIcon: "chat", badgeBg: "#25d366" },
  { name: "Bruno", initials: "B", bg: "#c0d4e8", badgeIcon: "photo_camera", badgeBg: "linear-gradient(135deg, #fbbf24 0%, #ff0080 45%, #9333ea 100%)" },
  { name: "Jennifer", initials: "J", bg: "#d5b8e0", badgeIcon: "forum", badgeBg: "#0066ff" },
  { name: "Rohit", initials: "R", bg: "#e8d3a8", badgeIcon: "send", badgeBg: "#26a5e4" },
  { name: "Louise", initials: "L", bg: "#c0e0c8", badgeIcon: "chat", badgeBg: "#6f64df" },
];

const ANDROID_SHARE_APPS: ShareApp[] = [
  { name: "WhatsApp", icon: "chat", bg: "#25d366" },
  { name: "Messages", icon: "sms", bg: "#1a73e8" },
  { name: "Messenger Chats", icon: "bolt", bg: "linear-gradient(135deg, #9333ea, #ff0099)" },
  { name: "Instagram", icon: "photo_camera", bg: "linear-gradient(135deg, #fbbf24 0%, #ff0080 45%, #9333ea 100%)" },
  { name: "Telegram", icon: "send", bg: "#26a5e4" },
];

const IOS_SHARE_CONTACTS: ShareContact[] = [
  { name: "Sandy Wilder Cheng", initials: "SC", bg: "#e8c39a", badgeIcon: "sms", badgeBg: "#30d158" },
  { name: "Kevin Leong", initials: "KL", bg: "#c9b79b", badgeIcon: "sms", badgeBg: "#30d158" },
  { name: "Sandy and Kevin", initials: "SK", bg: "#cdb7e6", badgeIcon: "sms", badgeBg: "#30d158" },
  { name: "Juliana Mejia", initials: "JM", bg: "#e8c1c1", badgeIcon: "sms", badgeBg: "#30d158" },
  { name: "Greg Arcand", initials: "GA", bg: "#b9d6c5", badgeIcon: "sms", badgeBg: "#30d158" },
];

const IOS_SHARE_APPS: ShareApp[] = [
  { name: "AirDrop", icon: "wifi_tethering", bg: "#ffffff", color: "#0a84ff" },
  { name: "Messages", icon: "sms", bg: "#30d158" },
  { name: "Mail", icon: "mail", bg: "linear-gradient(180deg, #64d2ff 0%, #0a84ff 100%)" },
  { name: "Notes", icon: "sticky_note_2", bg: "#ffd60a", color: "#8a6d00" },
  { name: "Reminders", icon: "check_circle", bg: "#ffffff", color: "#ff453a" },
];

const IOS_SHARE_ACTIONS: Array<{ label: string; icon: string }> = [
  { label: "Save video", icon: "file_download" },
  { label: "Markup", icon: "edit" },
  { label: "Print", icon: "print" },
];

function SharePortalHost({ children }: { children: ReactNode }) {
  const target = useContext(PhoneScreenContext);
  if (!target) return null;
  return createPortal(children, target);
}

function StillPreview({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const seek = () => {
      try {
        v.currentTime = 0.2;
      } catch {}
    };
    if (v.readyState >= 1) seek();
    v.addEventListener("loadedmetadata", seek);
    return () => v.removeEventListener("loadedmetadata", seek);
  }, [src]);
  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="auto"
      className={className}
    />
  );
}

function ShareSheet({
  platform,
  videoSrc,
  onDismiss,
}: {
  platform: Platform;
  videoSrc: string;
  onDismiss: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const dragControls = useDragControls();
  const targetY = expanded ? SHEET_Y_EXPANDED : SHEET_Y_COLLAPSED;

  return (
    <motion.div
      className="gemini-tool-sheet gemini-share-sheet"
      data-platform={platform}
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.08}
      initial={{ y: SHEET_Y_HIDDEN }}
      animate={{ y: targetY }}
      exit={{ y: SHEET_Y_HIDDEN }}
      transition={SHEET_SPRING}
      onDragEnd={(_, info) => {
        const dy = info.offset.y;
        const vy = info.velocity.y;
        const swipeUp = dy < -60 || vy < -500;
        const swipeDown = dy > 60 || vy > 500;
        if (expanded) {
          if (swipeDown) setExpanded(false);
        } else {
          if (swipeUp) setExpanded(true);
          else if (swipeDown) onDismiss();
        }
      }}
    >
      <div
        className="gemini-tool-sheet-grip"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="gemini-tool-sheet-handle" aria-hidden />
      </div>
      <div className="gemini-tool-sheet-scroll gemini-share-scroll">
        {platform === "android" ? (
          <>
            <div className="gemini-share-title">Sharing video</div>
            <div className="gemini-share-preview">
              <StillPreview src={videoSrc} />
            </div>
            <div className="gemini-share-row gemini-share-row-contacts">
              {ANDROID_SHARE_CONTACTS.map((c) => (
                <div key={c.name} className="gemini-share-contact">
                  <div
                    className="gemini-share-avatar"
                    style={{ background: c.bg }}
                  >
                    <span className="gemini-share-avatar-initials">
                      {c.initials}
                    </span>
                    <span
                      className="gemini-share-badge"
                      style={{ background: c.badgeBg }}
                    >
                      <Icon name={c.badgeIcon} size={10} filled />
                    </span>
                  </div>
                  <span className="gemini-share-contact-name">{c.name}</span>
                </div>
              ))}
            </div>
            <div className="gemini-share-row gemini-share-row-apps">
              {ANDROID_SHARE_APPS.map((a) => (
                <div key={a.name} className="gemini-share-app">
                  <div
                    className="gemini-share-app-tile"
                    style={{ background: a.bg, color: a.color ?? "#fff" }}
                  >
                    <Icon name={a.icon} size={22} filled />
                  </div>
                  <span className="gemini-share-app-name">{a.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="gemini-share-ios-head">
              <div className="gemini-share-ios-thumb">
                <StillPreview src={videoSrc} />
              </div>
              <button
                type="button"
                className="gemini-share-ios-close"
                aria-label="Close"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            <div className="gemini-share-row gemini-share-row-contacts gemini-share-row-scroll">
              {IOS_SHARE_CONTACTS.map((c) => (
                <div key={c.name} className="gemini-share-contact">
                  <div
                    className="gemini-share-avatar"
                    style={{ background: c.bg }}
                  >
                    <span className="gemini-share-avatar-initials">
                      {c.initials}
                    </span>
                    <span
                      className="gemini-share-badge gemini-share-badge-ios"
                      style={{ background: c.badgeBg }}
                    >
                      <Icon name={c.badgeIcon} size={10} filled />
                    </span>
                  </div>
                  <span className="gemini-share-contact-name">{c.name}</span>
                </div>
              ))}
            </div>
            <div className="gemini-share-divider" aria-hidden />
            <div className="gemini-share-row gemini-share-row-apps gemini-share-row-scroll">
              {IOS_SHARE_APPS.map((a) => (
                <div key={a.name} className="gemini-share-app">
                  <div
                    className="gemini-share-app-tile gemini-share-app-tile-ios"
                    style={{ background: a.bg, color: a.color ?? "#fff" }}
                  >
                    <Icon name={a.icon} size={24} filled />
                  </div>
                  <span className="gemini-share-app-name">{a.name}</span>
                </div>
              ))}
            </div>
            <div className="gemini-share-divider" aria-hidden />
            <div className="gemini-share-actions">
              {IOS_SHARE_ACTIONS.map((act, i) => (
                <div
                  key={act.label}
                  className="gemini-share-action"
                  data-divided={i < IOS_SHARE_ACTIONS.length - 1}
                >
                  <span className="gemini-share-action-label">{act.label}</span>
                  <Icon name={act.icon} size={20} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function VideoSettingsSheet({
  imageSrc,
  onDismiss,
}: {
  imageSrc: string;
  onDismiss: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const dragControls = useDragControls();
  const targetY = expanded ? SHEET_Y_EXPANDED : SHEET_Y_COLLAPSED;

  const chips: Array<{ icon: string; label: string }> = [
    { icon: "movie", label: "Veo 3 Experimental" },
    { icon: "crop_landscape", label: "Landscape" },
    { icon: "timer", label: "8 seconds" },
    { icon: "hd", label: "720p" },
  ];

  return (
    <motion.div
      className="gemini-tool-sheet gemini-settings-sheet"
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.08}
      initial={{ y: SHEET_Y_HIDDEN }}
      animate={{ y: targetY }}
      exit={{ y: SHEET_Y_HIDDEN }}
      transition={SHEET_SPRING}
      onDragEnd={(_, info) => {
        const dy = info.offset.y;
        const vy = info.velocity.y;
        const swipeUp = dy < -60 || vy < -500;
        const swipeDown = dy > 60 || vy > 500;
        if (expanded) {
          if (swipeDown) setExpanded(false);
        } else {
          if (swipeUp) setExpanded(true);
          else if (swipeDown) onDismiss();
        }
      }}
    >
      <div
        className="gemini-tool-sheet-grip"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="gemini-tool-sheet-handle" aria-hidden />
      </div>
      <div className="gemini-tool-sheet-scroll gemini-settings-scroll">
        <div className="gemini-settings-title">
          <Icon name="tune" size={20} />
          <span>Video Settings</span>
        </div>
        <div className="gemini-settings-timeline">
          <div className="gemini-settings-frames">
            <div className="gemini-settings-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt="Start frame" />
              <button
                type="button"
                className="gemini-input-preview-x"
                aria-label="Remove start frame"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
            <button
              type="button"
              className="gemini-settings-frame gemini-settings-frame-empty"
              aria-label="Add end frame"
            >
              <span className="gemini-settings-frame-empty-inner" aria-hidden>
                <Icon name="add_photo_alternate" size={22} filled />
              </span>
            </button>
          </div>
          <div className="gemini-settings-legend">
            <span className="gemini-settings-node">
              <span className="gemini-settings-diamond" aria-hidden />
              <span>Start</span>
            </span>
            <span className="gemini-settings-trail" aria-hidden />
            <span className="gemini-settings-node">
              <span>End</span>
              <span className="gemini-settings-diamond" aria-hidden />
            </span>
          </div>
        </div>
        <div className="gemini-settings-chips">
          {chips.map((c) => (
            <span key={c.label} className="gemini-settings-chip">
              <Icon name={c.icon} size={16} />
              <span>{c.label}</span>
            </span>
          ))}
        </div>
        <div className="gemini-settings-foot">
          <Icon name="schedule" size={16} />
          <span>Takes 1–2 minutes</span>
        </div>
      </div>
    </motion.div>
  );
}

function ToolSheet({
  onSelectVideo,
  onDismiss,
  onSelectImage,
}: {
  onSelectVideo: () => void;
  onDismiss: () => void;
  onSelectImage?: (src: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const dragControls = useDragControls();

  const targetY = expanded ? SHEET_Y_EXPANDED : SHEET_Y_COLLAPSED;

  const tools: Array<{
    label: string;
    sub: string;
    icon: ReactNode;
    badge?: string;
    highlight?: boolean;
  }> = [
    { label: "Images", sub: "Create and edit", icon: <Icon name="image" /> },
    {
      label: "Videos",
      sub: "Bring ideas to life",
      icon: <Icon name="movie" />,
    },
    {
      label: "Music",
      sub: "Make audio tracks",
      icon: <Icon name="music_note" />,
    },
    {
      label: "Canvas",
      sub: "Code, write, or make slides",
      icon: <Icon name="note_stack_add" />,
    },
    {
      label: "Deep research",
      sub: "Get detailed reports",
      icon: <Icon name="travel_explore" />,
    },
    {
      label: "Guided learning",
      sub: "Get step-by-step help",
      icon: <Icon name="school" />,
    },
    {
      label: "Agent",
      sub: "Get things done for you",
      icon: <Icon name="send" />,
      badge: "Labs",
    },
    {
      label: "Dynamic view",
      sub: "Go beyond text responses",
      icon: <Icon name="dashboard" />,
      badge: "Labs",
    },
    {
      label: "More uploads",
      sub: "Files, Drive, Notebook LLM",
      icon: <Icon name="more_horiz" />,
    },
  ];

  const media = [
    "/assets/samples/camera-roll-car.jpg",
    "/assets/samples/hongkong-slideshow_0000_Layer-3.png",
    "/assets/samples/hongkong-slideshow_0003_PH_464_P400_008941-R1-071-34.png",
    "/assets/samples/hongkong-slideshow_0005_000005080003.png",
    "/assets/samples/hongkong-slideshow_0009_000005080021.png",
    "/assets/samples/hongkong-slideshow_0002_Layer-1.png",
    "/assets/samples/hongkong-slideshow_0007_000005080013.png",
  ];

  return (
    <motion.div
      className="gemini-tool-sheet"
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.08}
      initial={{ y: SHEET_Y_HIDDEN }}
      animate={{ y: targetY }}
      exit={{ y: SHEET_Y_HIDDEN }}
      transition={SHEET_SPRING}
      onDragEnd={(_, info) => {
        const dy = info.offset.y;
        const vy = info.velocity.y;
        const swipeUp = dy < -60 || vy < -500;
        const swipeDown = dy > 60 || vy > 500;
        if (expanded) {
          if (swipeDown) setExpanded(false);
        } else {
          if (swipeUp) setExpanded(true);
          else if (swipeDown) onDismiss();
        }
      }}
    >
      <div
        className="gemini-tool-sheet-grip"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="gemini-tool-sheet-handle" aria-hidden />
      </div>
      <div className="gemini-tool-sheet-scroll">
        <div className="gemini-tool-tiles">
          <button type="button" className="gemini-tool-tile">
            <Icon name="photo_library" size={32} />
            <span>Photos</span>
          </button>
          <button type="button" className="gemini-tool-tile">
            <Icon name="photo_camera" size={32} />
            <span>Camera</span>
          </button>
          <div className="gemini-tool-media">
            {media.map((src, i) =>
              onSelectImage ? (
                <button
                  key={i}
                  type="button"
                  className="gemini-tool-media-item"
                  style={{ backgroundImage: `url(${src})` }}
                  aria-label="Attach image"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectImage(src);
                  }}
                />
              ) : (
                <div
                  key={i}
                  className="gemini-tool-media-item"
                  style={{ backgroundImage: `url(${src})` }}
                />
              ),
            )}
          </div>
        </div>

        <div className="gemini-tool-list">
          {tools.map((t) => (
            <button
              key={t.label}
              type="button"
              className="gemini-tool-row"
              data-highlight={t.highlight ? "true" : undefined}
              onClick={t.label === "Videos" ? onSelectVideo : undefined}
            >
              <span className="gemini-tool-icon">{t.icon}</span>
              <div className="gemini-tool-text">
                <div className="gemini-tool-title">
                  <span>{t.label}</span>
                  {t.badge ? (
                    <span className="gemini-tool-badge">{t.badge}</span>
                  ) : null}
                </div>
                <div className="gemini-tool-sub">{t.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Keyboard({
  onFill,
  onSend,
}: {
  onFill: () => void;
  onSend: () => void;
}) {
  const platform = useContext(PhonePlatformContext);
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

  return (
    <motion.div
      className="gemini-keyboard"
      data-platform={platform}
      initial={{ height: 0, y: 16 }}
      animate={{ height: "auto", y: 0 }}
      exit={{ height: 0, y: 16 }}
      transition={{ duration: 0.32, ease: EASE }}
      style={{ overflow: "hidden" }}
      onClick={onFill}
      role="presentation"
    >
      {platform === "android" ? (
        <>
          <div className="gemini-keyboard-toolbar">
            <span className="gemini-keyboard-tool gemini-keyboard-tool-active">
              <Icon name="apps" size={20} />
            </span>
            <span className="gemini-keyboard-tool">
              <Icon name="mood" size={20} />
            </span>
            <span className="gemini-keyboard-tool gemini-keyboard-tool-text">
              GIF
            </span>
            <span className="gemini-keyboard-tool">
              <Icon name="g_translate" size={20} />
            </span>
            <span className="gemini-keyboard-tool">
              <Icon name="settings" size={20} />
            </span>
            <span className="gemini-keyboard-tool">
              <Icon name="palette" size={20} />
            </span>
            <span className="gemini-keyboard-tool">
              <Icon name="more_horiz" size={20} />
            </span>
            <span className="gemini-keyboard-tool">
              <Icon name="mic" size={20} />
            </span>
          </div>
          <div className="gemini-keyboard-row">
            {"qwertyuiop".split("").map((k) => (
              <span key={k} className="gemini-key">
                {k}
              </span>
            ))}
          </div>
          <div className="gemini-keyboard-row">
            {"asdfghjkl".split("").map((k) => (
              <span key={k} className="gemini-key">
                {k}
              </span>
            ))}
          </div>
          <div className="gemini-keyboard-row">
            <span className="gemini-key gemini-key-mod">
              <Icon name="arrow_upward" size={18} />
            </span>
            {"zxcvbnm".split("").map((k) => (
              <span key={k} className="gemini-key">
                {k}
              </span>
            ))}
            <span className="gemini-key gemini-key-mod">
              <Icon name="backspace" size={18} />
            </span>
          </div>
          <div className="gemini-keyboard-row">
            <span className="gemini-key gemini-key-sys">?123</span>
            <span className="gemini-key gemini-key-sys">,</span>
            <span className="gemini-key gemini-key-sys">
              <Icon name="language" size={18} />
            </span>
            <span className="gemini-key gemini-key-space" />
            <span className="gemini-key gemini-key-sys">.</span>
            <span
              className="gemini-key gemini-key-return"
              onClick={(e) => {
                e.stopPropagation();
                onSend();
              }}
            >
              <Icon name="keyboard_return" size={18} />
            </span>
          </div>
        </>
      ) : (
        <>
          {rows.map((row, i) => (
            <div key={i} className="gemini-keyboard-row">
              {i === 2 ? (
                <span className="gemini-key gemini-key-wide" />
              ) : null}
              {row.split("").map((k) => (
                <span key={k} className="gemini-key">
                  {k}
                </span>
              ))}
              {i === 2 ? (
                <span className="gemini-key gemini-key-wide" />
              ) : null}
            </div>
          ))}
          <div className="gemini-keyboard-row gemini-keyboard-bottom">
            <span className="gemini-key gemini-key-xs">123</span>
            <span className="gemini-key gemini-key-xs">🙂</span>
            <span className="gemini-key gemini-key-space">space</span>
            <span
              className="gemini-key gemini-key-xs gemini-key-return"
              onClick={(e) => {
                e.stopPropagation();
                onSend();
              }}
            >
              return
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
}

type Experiments = {
  imageIn: boolean;
  imageInAdvanced: boolean;
  loadingTutorials: boolean;
  videoPlan: boolean;
};

type TutorialVignette = {
  title: string;
  body: string;
  image: string;
};

const LOADING_TUTORIALS: TutorialVignette[] = [
  {
    title: "Set a camera angle",
    body: "“Low-angle tracking shot, slow motion moving forward ending with a close up.”",
    image: "/assets/samples/hongkong-slideshow_0003_PH_464_P400_008941-R1-071-34.png",
  },
  {
    title: "Choose a scene",
    body: "“Neon street at night, reflective wet pavement, tight framing on the lead.”",
    image: "/assets/samples/hongkong-slideshow_0005_000005080003.png",
  },
  {
    title: "Add atmosphere",
    body: "“Golden hour, soft diffused light, dust motes drifting through the frame.”",
    image: "/assets/samples/hongkong-slideshow_0000_Layer-3.png",
  },
];

type ExperimentDef = {
  key: keyof Experiments;
  label: string;
  description: string;
};

const EXPERIMENTS: ExperimentDef[] = [
  {
    key: "imageIn",
    label: "Image-to-image starters",
    description: "Attach an image to kick off with animated prompt suggestions.",
  },
  {
    key: "imageInAdvanced",
    label: "Advanced image-to-image settings",
    description:
      "Bigger preview, inline starter chips, and a video-settings sheet.",
  },
  {
    key: "loadingTutorials",
    label: "Loading tutorials",
    description:
      "Cycle through short how-to vignettes while the video is generating.",
  },
  {
    key: "videoPlan",
    label: "Video plan",
    description:
      "Review an editable proposal — title, description, settings — before generating.",
  },
];

function deriveVideoPlanTitle(prompt: string): string {
  const stripped = prompt
    .replace(/^generate (a )?video of (a )?/i, "")
    .replace(/[."!,?]+$/g, "")
    .trim();
  const words = stripped.split(/\s+/).filter(Boolean).slice(0, 3);
  const title = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  return title ? `${title} Video` : "Generated Video";
}

function VideoPlanCard({
  prompt,
  onGenerate,
}: {
  prompt: string;
  onGenerate: () => void;
}) {
  const title = deriveVideoPlanTitle(prompt);
  const chips: Array<{ icon: string; label: string }> = [
    { icon: "movie", label: "Veo 3 Experimental" },
    { icon: "crop_landscape", label: "16:9 Landscape" },
    { icon: "timer", label: "8 seconds" },
    { icon: "hd", label: "720p" },
  ];

  return (
    <motion.div
      className="gemini-plan-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: EASE }}
    >
      <div className="gemini-plan-header">
        <div className="gemini-plan-thumb" aria-hidden />
        <span className="gemini-plan-title">{title}</span>
        <button
          type="button"
          className="gemini-plan-edit"
          aria-label="Edit video plan"
        >
          <Icon name="edit" size={18} />
        </button>
      </div>
      <p className="gemini-plan-desc">{prompt}</p>
      <div className="gemini-plan-chips">
        {chips.map((c) => (
          <span key={c.label} className="gemini-plan-chip">
            <Icon name={c.icon} size={16} />
            <span>{c.label}</span>
          </span>
        ))}
      </div>
      <div className="gemini-plan-ready">
        <Icon name="schedule" size={16} />
        <span>Ready in 1–2 minutes</span>
      </div>
      <button
        type="button"
        className="gemini-plan-generate"
        onClick={onGenerate}
      >
        Generate video
      </button>
    </motion.div>
  );
}

function SpinnerGlyph() {
  return (
    <div className="gemini-spinner" aria-hidden>
      <svg className="gemini-spinner-ring" viewBox="0 0 44 44" fill="none">
        <defs>
          <linearGradient id="gemini-spinner-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7a83ff" />
            <stop offset="55%" stopColor="#bd99fe" />
            <stop offset="100%" stopColor="#ff8a58" />
          </linearGradient>
        </defs>
        <circle
          cx="22"
          cy="22"
          r="18"
          pathLength={100}
          stroke="url(#gemini-spinner-g)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="78 100"
        />
      </svg>
      <Icon name="movie" size={20} filled />
    </div>
  );
}

function TutorialWords({
  title,
  body,
  cycleKey,
}: {
  title: string;
  body: string;
  cycleKey: number;
}) {
  const words = [
    ...`${title}:`.split(/\s+/).filter(Boolean).map((w) => ({ text: w, bold: true })),
    ...body.split(/\s+/).filter(Boolean).map((w) => ({ text: w, bold: false })),
  ];
  return (
    <p className="gemini-loader-tutorial-text">
      {words.map((w, i) => (
        <motion.span
          // eslint-disable-next-line react/jsx-key
          key={`${cycleKey}-${i}`}
          className={w.bold ? "gemini-tutorial-word-bold" : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24, delay: i * 0.055, ease: EASE }}
        >
          {w.text}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

function LoadingTutorialCard({
  tutorials,
}: {
  tutorials: TutorialVignette[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (tutorials.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % tutorials.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [tutorials.length]);

  const current = tutorials[index];

  return (
    <motion.div
      className="gemini-loader gemini-loader-rich"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="gemini-loader-rich-head">
        <SpinnerGlyph />
        <span className="gemini-loader-rich-title">Creating your video…</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="gemini-loader-tutorial"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <TutorialWords
            title={current.title}
            body={current.body}
            cycleKey={index}
          />
          <div className="gemini-loader-tutorial-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image} alt="" />
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function ExperimentsPanel({
  experiments,
  onToggle,
}: {
  experiments: Experiments;
  onToggle: (key: keyof Experiments) => void;
}) {
  return (
    <div className="proto-panel-section">
      <span className="proto-panel-kicker">Experiments</span>
      <div className="proto-experiments">
        {EXPERIMENTS.map((e) => {
          const on = experiments[e.key];
          return (
            <button
              key={e.key}
              type="button"
              className="proto-experiment"
              data-on={on ? "true" : undefined}
              onClick={() => onToggle(e.key)}
            >
              <span className="proto-experiment-copy">
                <span className="proto-experiment-label">{e.label}</span>
                <span className="proto-experiment-sub">{e.description}</span>
              </span>
              <span
                className="proto-experiment-switch"
                data-on={on ? "true" : undefined}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

type FlowPhaseId = "welcome" | "discovery" | "input" | "loading" | "ready";

const FLOW: { id: FlowPhaseId; label: string }[] = [
  { id: "welcome", label: "Welcome" },
  { id: "discovery", label: "Feature discovery" },
  { id: "input", label: "Input" },
  { id: "loading", label: "Loading" },
  { id: "ready", label: "Ready" },
];

function phaseForStep(step: VideoGenStep): FlowPhaseId {
  switch (step) {
    case "welcome":
      return "welcome";
    case "tools-open":
      return "discovery";
    case "tool-selected":
    case "typing":
    case "planning":
      return "input";
    case "sent":
      return "loading";
    case "ready":
      return "ready";
  }
}

function FlowTimeline({
  currentStep,
  onJump,
}: {
  currentStep: VideoGenStep;
  onJump: (phase: FlowPhaseId) => void;
}) {
  const currentIdx = FLOW.findIndex((p) => p.id === phaseForStep(currentStep));

  return (
    <div className="proto-panel-section">
      <span className="proto-panel-kicker">User flow</span>
      <div className="proto-flow">
        {FLOW.map((phase, i) => {
          const state =
            i < currentIdx ? "done" : i === currentIdx ? "active" : "upcoming";
          return (
            <button
              key={phase.id}
              type="button"
              className="proto-flow-item"
              data-state={state}
              onClick={() => onJump(phase.id)}
            >
              <span className="proto-flow-dot" aria-hidden />
              <span className="proto-flow-label">{phase.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ActionIcon({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <span className="gemini-action-icon" aria-label={label}>
      {children}
    </span>
  );
}
