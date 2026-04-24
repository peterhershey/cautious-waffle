"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, useAnimationFrame, useMotionValue } from "framer-motion";
import { StreamStatus } from "./StreamStatus";

type DoshiPhoneProps = {
  platform?: "ios" | "android";
  streamEnabled?: boolean;
  streamStatus?: "good" | "poor";
  backgroundVideo?: string;
  children?: ReactNode;
};

// --- Mic button geometry --------------------------------------------
const MIC_VIEWBOX = 100;
const MIC_CENTER = 50;
const MIC_RADIUS = 40; // resting circle radius inside 100x100 viewbox
const MIC_BUMPS = 11; // 10% more scallops for a softer cadence
const MIC_DEPTH = 3.6; // lower amplitude blunts the peaks
const MIC_SAMPLES = 176; // ~16 samples per bump

// --- Breathing oscillation (active state) ---------------------------
// Three low-frequency sines, each at different angular + temporal
// frequencies so different bumps pulse out of phase. Amplitudes are
// multiplied by the current depth, so they vanish cleanly at rest.
const BREATHE = [
  { tFreq: 0.44, aFreq: 3, amp: 0.32 },
  { tFreq: 0.56, aFreq: 5, amp: 0.22 },
  { tFreq: 0.38, aFreq: 7, amp: 0.16 },
];

// Rotation — one lazy revolution per ~14 seconds when active.
const ROT_RPS_ACTIVE = 1 / 14;

function buildFlowerPath(
  depth: number,
  rotationRad: number,
  timeMs: number,
): string {
  const tSec = timeMs / 1000;
  let d = "";
  for (let i = 0; i <= MIC_SAMPLES; i++) {
    const s = (i / MIC_SAMPLES) * Math.PI * 2;
    const thetaBumps = s + rotationRad;
    let modulation = Math.cos(MIC_BUMPS * thetaBumps);
    for (const b of BREATHE) {
      modulation += b.amp * Math.sin(tSec * Math.PI * 2 * b.tFreq + thetaBumps * b.aFreq);
    }
    const r = MIC_RADIUS + depth * modulation;
    const x = MIC_CENTER + r * Math.cos(s);
    const y = MIC_CENTER + r * Math.sin(s);
    d += (i === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2);
  }
  return d + "Z";
}

export function DoshiPhone({
  platform = "ios",
  streamEnabled = true,
  streamStatus = "good",
  backgroundVideo,
  children,
}: DoshiPhoneProps) {
  const [videoOn, setVideoOn] = useState(true);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [micPressed, setMicPressed] = useState(false);

  // Depth animates with an under-damped spring on press-in (overshoots
  // and settles) and a snappy ease-out on release. Breathing oscillation
  // layers on top inside buildFlowerPath — not animated here.
  const micDepth = useMotionValue(0);
  // Rotation SPEED (revolutions per second), ramped in/out so the
  // rotation doesn't just snap to full speed at press time.
  const micRotSpeed = useMotionValue(0);
  const rotAccumRef = useRef(0);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let depthCtrl: ReturnType<typeof animate>;
    let speedCtrl: ReturnType<typeof animate>;
    if (micPressed) {
      depthCtrl = animate(micDepth, MIC_DEPTH, {
        type: "spring",
        mass: 1,
        stiffness: 180,
        damping: 14,
      });
      speedCtrl = animate(micRotSpeed, ROT_RPS_ACTIVE, {
        duration: 0.6,
        ease: [0.22, 0.9, 0.24, 1],
      });
    } else {
      depthCtrl = animate(micDepth, 0, {
        duration: 0.4,
        ease: [0.33, 0, 0.2, 1], // ease-out — fast snap to stillness
      });
      speedCtrl = animate(micRotSpeed, 0, {
        duration: 0.4,
        ease: [0.33, 0, 0.2, 1],
      });
    }
    return () => {
      depthCtrl.stop();
      speedCtrl.stop();
    };
  }, [micPressed, micDepth, micRotSpeed]);

  useAnimationFrame((time, delta) => {
    // Advance the rotation accumulator by current speed * delta.
    const speed = micRotSpeed.get();
    rotAccumRef.current = (rotAccumRef.current + speed * (delta / 1000)) % 1;
    const rotationRad = rotAccumRef.current * Math.PI * 2;
    const depth = micDepth.get();
    if (pathRef.current) {
      pathRef.current.setAttribute(
        "d",
        buildFlowerPath(depth, rotationRad, time),
      );
    }
  });

  const releaseMic = () => setMicPressed(false);

  return (
    <div
      className="doshi-phone proto-phone"
      data-platform={platform}
      role="figure"
      aria-label="DOSHI prototype"
    >
      {videoOn && backgroundVideo ? (
        <video
          className="doshi-media"
          src={backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
      ) : null}

      {!videoOn ? (
        <div className="doshi-video-off" aria-live="polite">
          <IconCameraOff />
          <span>Video off</span>
        </div>
      ) : null}

      <div className="doshi-header">
        <div className="doshi-header-slot" data-align="start">
          <span className="proto-phone-header-chip">Peter Labs</span>
        </div>
        <div className="doshi-header-slot" data-align="center">
          <span className="proto-phone-header-live">
            <IconSparkle />
            Live
          </span>
        </div>
        <div className="doshi-header-slot" data-align="end">
          <button
            type="button"
            className="proto-phone-header-action"
            aria-label={captionsEnabled ? "Turn captions off" : "Turn captions on"}
            aria-pressed={captionsEnabled}
            onClick={() => setCaptionsEnabled((v) => !v)}
          >
            <IconCaptions enabled={captionsEnabled} />
          </button>
        </div>
      </div>

      {streamEnabled ? <StreamStatus status={streamStatus} /> : null}

      {captionsEnabled ? (
        <div className="doshi-caption-wrapper">{children}</div>
      ) : null}

      <div className="doshi-button-row">
        <button
          type="button"
          className="doshi-side-btn"
          aria-label="Flip camera"
        >
          <IconFlipCamera />
        </button>

        <button
          type="button"
          className="doshi-mic"
          data-pressed={micPressed}
          aria-label="Hold to listen"
          aria-pressed={micPressed}
          onPointerDown={() => setMicPressed(true)}
          onPointerUp={releaseMic}
          onPointerLeave={releaseMic}
          onPointerCancel={releaseMic}
        >
          <svg
            className="doshi-mic-shape"
            viewBox={`0 0 ${MIC_VIEWBOX} ${MIC_VIEWBOX}`}
            aria-hidden
          >
            <path ref={pathRef} />
          </svg>
          <span className="doshi-mic-glyph" aria-hidden>
            <IconMic filled={micPressed} />
          </span>
        </button>

        <button
          type="button"
          className="doshi-side-btn"
          data-active={videoOn}
          aria-label={videoOn ? "Turn video off" : "Turn video on"}
          aria-pressed={videoOn}
          onClick={() => setVideoOn((v) => !v)}
        >
          <IconCamera filled={videoOn} />
        </button>
      </div>
    </div>
  );
}

/* Local icons — duplicated from PhoneFrame.tsx so DoshiPhone is
   self-contained. */

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

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

function IconFlipCamera() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <path d="M5 9 H19" />
      <path d="M16 6 L19 9 L16 12" />
      <path d="M19 15 H5" />
      <path d="M8 12 L5 15 L8 18" />
    </svg>
  );
}

function IconCamera({ filled = false }: { filled?: boolean }) {
  if (filled) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="7" width="13" height="10" rx="2" />
        <path d="M16 10.5 L21 8 V16 L16 13.5 Z" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <rect x="3" y="7" width="13" height="10" rx="2" />
      <path d="M16 10.5 L21 8 V16 L16 13.5 Z" />
    </svg>
  );
}

function IconCameraOff() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" {...stroke} strokeWidth={1.25}>
      <rect x="3" y="7" width="13" height="10" rx="2" />
      <path d="M16 10.5 L21 8 V16 L16 13.5 Z" />
      <path d="M4 4 L20 20" strokeWidth={1.5} />
    </svg>
  );
}

function IconMic({ filled = false }: { filled?: boolean }) {
  if (filled) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M6 12 C6 15.3 8.7 18 12 18 C15.3 18 18 15.3 18 12" fill="none" />
        <path d="M12 18 V21" fill="none" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 12 C6 15.3 8.7 18 12 18 C15.3 18 18 15.3 18 12" />
      <path d="M12 18 V21" />
    </svg>
  );
}
