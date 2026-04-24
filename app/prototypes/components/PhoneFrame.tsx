"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { StreamStatus } from "./StreamStatus";
import { VisualOverlay } from "./VisualOverlay";

type PhoneFrameProps = {
  title?: string;
  isLive?: boolean;
  chipLabel?: string;
  backgroundVideo?: string;
  platform?: "ios" | "android";
  streamEnabled?: boolean;
  streamStatus?: "good" | "poor";
  children?: ReactNode;
};

const ZOOM_LEVELS = [1, 1.5, 2];
const ZOOM_EASE = [0.22, 0.9, 0.24, 1] as const;
const ZOOM_LAYOUT_MS = 0.32;
const ZOOM_FADE_MS = 0.18;
const ZOOM_AUTOCOLLAPSE_MS = 2500;
const ZOOM_SETTLE_MS = 650;

export function PhoneFrame({
  title = "Live",
  isLive = true,
  chipLabel = "Peter Labs",
  backgroundVideo,
  platform = "ios",
  streamEnabled = true,
  streamStatus = "good",
  children,
}: PhoneFrameProps) {
  const [zoom, setZoom] = useState(1);
  const [zoomExpanded, setZoomExpanded] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [captionAnchor, setCaptionAnchor] = useState<"top" | "bottom">("top");
  const [videoOn, setVideoOn] = useState(true);
  const [vo, setVo] = useState<{
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const collapseTimerRef = useRef<number | null>(null);
  const screenInnerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const captionY = useMotionValue(0);
  const bottomOffsetRef = useRef(0);
  const captionDraggingRef = useRef(false);

  const computeBottomOffset = () => {
    if (!screenInnerRef.current || !captionRef.current) return 0;
    const innerH = screenInnerRef.current.clientHeight;
    const capH = captionRef.current.offsetHeight || 60;
    const bottomTopY = innerH - 14 - 44 - 10 - capH;
    return Math.max(0, bottomTopY - 24);
  };

  useLayoutEffect(() => {
    if (!captionsEnabled) return;
    bottomOffsetRef.current = computeBottomOffset();
    captionY.set(captionAnchor === "bottom" ? bottomOffsetRef.current : 0);
    // Only sync on caption mount / toggle — anchor changes are animated via drag handler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captionsEnabled]);

  useEffect(() => {
    if (!captionsEnabled || !captionRef.current) return;
    const ro = new ResizeObserver(() => {
      bottomOffsetRef.current = computeBottomOffset();
      if (captionAnchor === "bottom") {
        animate(captionY, bottomOffsetRef.current, {
          type: "spring",
          stiffness: 400,
          damping: 40,
        });
      }
    });
    ro.observe(captionRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captionsEnabled, captionAnchor]);

  const handleCaptionDragEnd = () => {
    // Recompute at drag end so the value is always fresh — the phone-frame
    // remounts on video toggle and the ResizeObserver can be attached to a
    // stale node, which left bottomOffsetRef at 0 and made every drag snap
    // back to the top.
    const offset = computeBottomOffset();
    bottomOffsetRef.current = offset;
    const currentY = captionY.get();
    const mid = offset / 2;
    const newAnchor: "top" | "bottom" = currentY > mid ? "bottom" : "top";
    const target = newAnchor === "top" ? 0 : offset;
    setCaptionAnchor(newAnchor);
    animate(captionY, target, {
      type: "spring",
      stiffness: 400,
      damping: 36,
    });
    // The synthesized click event fires after onDragEnd — keep the flag set
    // through that click, then clear on the next frame.
    requestAnimationFrame(() => {
      captionDraggingRef.current = false;
    });
  };

  const handleFrameClick = (e: MouseEvent<HTMLDivElement>) => {
    if (captionDraggingRef.current) return;
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const margin = 16;
    const size = 125 + Math.random() * 40;
    const ratio = 0.72 + Math.random() * 0.68;
    const r = Math.sqrt(ratio);
    const width = Math.round(size * r);
    const height = Math.round(size / r);
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    const x = Math.max(
      margin + width / 2,
      Math.min(rect.width - margin - width / 2, rawX),
    );
    const y = Math.max(
      margin + height / 2,
      Math.min(rect.height - margin - height / 2, rawY),
    );
    setVo({ id: Date.now(), x, y, width, height });
  };

  useEffect(() => {
    if (!zoomExpanded) return;
    collapseTimerRef.current = window.setTimeout(
      () => setZoomExpanded(false),
      ZOOM_AUTOCOLLAPSE_MS,
    );
    return () => {
      if (collapseTimerRef.current !== null) {
        window.clearTimeout(collapseTimerRef.current);
        collapseTimerRef.current = null;
      }
    };
  }, [zoomExpanded]);

  return (
    <div
      className="proto-phone"
      data-platform={platform}
      role="figure"
      aria-label={`${title} prototype`}
    >
      <div className="proto-phone-header">
        <div className="proto-phone-header-slot" data-align="start">
          {chipLabel ? (
            <span className="proto-phone-header-chip">{chipLabel}</span>
          ) : null}
        </div>
        <div className="proto-phone-header-slot" data-align="center">
          <span className="proto-phone-header-live">
            {isLive ? <IconSparkle /> : null}
            {title}
          </span>
        </div>
        <div className="proto-phone-header-slot" data-align="end">
          <button
            type="button"
            className="proto-phone-header-action"
            data-active={captionsEnabled ? "true" : "false"}
            aria-label={captionsEnabled ? "Turn captions off" : "Turn captions on"}
            aria-pressed={captionsEnabled}
            onClick={() => setCaptionsEnabled((v) => !v)}
          >
            <IconCaptions enabled={captionsEnabled} />
          </button>
        </div>
      </div>
      <div className="proto-phone-screen">
        <AnimatePresence initial={false}>
          {videoOn ? (
            <motion.div
              key="video-frame"
              className="proto-phone-frame"
              onClick={handleFrameClick}
              initial={{ clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
              exit={{ clipPath: "inset(100% 0% 0% 0%)", opacity: 0 }}
              transition={{
                duration: 0.42,
                ease: [0.22, 0.9, 0.24, 1],
              }}
            >
              {backgroundVideo ? (
            <video
              className="proto-phone-media"
              src={backgroundVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden
              style={{ transform: `scale(${zoom})` }}
            />
          ) : null}
          {streamEnabled ? <StreamStatus status={streamStatus} /> : null}
          <div className="proto-phone-screen-inner" ref={screenInnerRef}>
            {captionsEnabled ? (
              <motion.div
                ref={captionRef}
                className="proto-caption-wrapper"
                style={{ y: captionY }}
                drag="y"
                dragMomentum={false}
                dragElastic={0.12}
                onDragStart={() => {
                  captionDraggingRef.current = true;
                  bottomOffsetRef.current = computeBottomOffset();
                }}
                onDragEnd={handleCaptionDragEnd}
              >
                {children}
              </motion.div>
            ) : null}
            <div className="proto-video-controls">
              <motion.div
                layout
                className="proto-zoom"
                transition={{
                  layout: { duration: ZOOM_LAYOUT_MS, ease: ZOOM_EASE },
                }}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {ZOOM_LEVELS.map((z) => {
                    const isActive = z === zoom;
                    if (!zoomExpanded && !isActive) return null;
                    return (
                      <motion.button
                        key={z}
                        layout="position"
                        type="button"
                        className="proto-zoom-option"
                        data-active={isActive ? "true" : "false"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          layout: { duration: ZOOM_LAYOUT_MS, ease: ZOOM_EASE },
                          opacity: { duration: ZOOM_FADE_MS, ease: ZOOM_EASE },
                        }}
                        onClick={() => {
                          if (!zoomExpanded) {
                            setZoomExpanded(true);
                            return;
                          }
                          if (collapseTimerRef.current !== null) {
                            window.clearTimeout(collapseTimerRef.current);
                            collapseTimerRef.current = null;
                          }
                          const delay =
                            z === zoom ? 0 : ZOOM_SETTLE_MS;
                          if (z !== zoom) setZoom(z);
                          collapseTimerRef.current = window.setTimeout(
                            () => {
                              setZoomExpanded(false);
                              collapseTimerRef.current = null;
                            },
                            delay,
                          );
                        }}
                        aria-label={!zoomExpanded ? "Zoom" : undefined}
                      >
                        <AnimatePresence initial={false}>
                          {zoomExpanded && isActive ? (
                            <motion.span
                              key="hl"
                              layoutId="zoom-highlight"
                              className="proto-zoom-highlight"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                layout: {
                                  duration: ZOOM_LAYOUT_MS,
                                  ease: ZOOM_EASE,
                                },
                                opacity: {
                                  duration: ZOOM_LAYOUT_MS,
                                  ease: ZOOM_EASE,
                                },
                              }}
                            />
                          ) : null}
                        </AnimatePresence>
                        <span className="proto-zoom-label">
                          {formatZoom(z, isActive)}
                        </span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
              <button
                type="button"
                className="proto-video-control"
                aria-label="Flip camera"
              >
                <IconFlipCamera />
              </button>
            </div>
          </div>
              {vo ? (
                <VisualOverlay
                  key={vo.id}
                  x={vo.x}
                  y={vo.y}
                  width={vo.width}
                  height={vo.height}
                  onDone={() =>
                    setVo((prev) => (prev?.id === vo.id ? null : prev))
                  }
                />
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="proto-phone-footer">
        <div className="proto-button-row">
          <button
            type="button"
            className="proto-pill"
            data-selected={videoOn ? "true" : "false"}
            aria-pressed={videoOn}
            aria-label={videoOn ? "Turn video off" : "Turn video on"}
            onClick={() => setVideoOn((v) => !v)}
          >
            <IconCamera filled={videoOn} />
          </button>
          <span className="proto-pill" aria-label="Share screen" aria-hidden>
            <IconShareScreen />
          </span>
          <span className="proto-pill" aria-label="Microphone" aria-hidden>
            <IconMic />
          </span>
          <span
            className="proto-pill"
            data-variant="record"
            aria-label="End"
            aria-hidden
          >
            <IconClose />
          </span>
        </div>
      </div>
    </div>
  );
}

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

function IconCamera({ filled = false }: { filled?: boolean }) {
  if (filled) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="7" width="13" height="10" rx="2" />
        <path d="M16 10.5 L21 8 V16 L16 13.5 Z" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="7" width="13" height="10" rx="2" />
      <path d="M16 10.5 L21 8 V16 L16 13.5 Z" />
    </svg>
  );
}

function IconShareScreen() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M12 9 V14" />
      <path d="M9.5 11.5 L12 9 L14.5 11.5" />
      <path d="M8 20 H16" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...stroke}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 12 C6 15.3 8.7 18 12 18 C15.3 18 18 15.3 18 12" />
      <path d="M12 18 V21" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...stroke}>
      <path d="M6 6 L18 18" />
      <path d="M18 6 L6 18" />
    </svg>
  );
}

function IconFlipCamera() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...stroke}>
      <path d="M5 9 H19" />
      <path d="M16 6 L19 9 L16 12" />
      <path d="M19 15 H5" />
      <path d="M8 12 L5 15 L8 18" />
    </svg>
  );
}

function IconSparkle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="2" y="6" width="2" height="4" rx="1" />
      <rect x="7" y="3" width="2" height="10" rx="1" />
      <rect x="12" y="5" width="2" height="6" rx="1" />
    </svg>
  );
}

function IconCaptions({ enabled = true }: { enabled?: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="7" width="18" height="11" rx="2.5" />
      <path d="M6.5 12 H10" />
      <path d="M12 12 H17.5" />
      <path d="M6.5 15 H14" />
      <path d="M16 15 H17.5" />
      {enabled ? null : <path d="M4.5 19.5 L19.5 5.5" />}
    </svg>
  );
}

function formatZoom(z: number, isActive: boolean) {
  return isActive ? `${z}x` : `${z}`;
}
