"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import type { DoshiRecommendation } from "@/lib/prototypes";
import type { DoshiChip } from "./usePlayback";
import { StreamStatus } from "./StreamStatus";

type DoshiPhoneProps = {
  platform?: "ios" | "android";
  streamEnabled?: boolean;
  streamStatus?: "good" | "poor";
  backgroundVideo?: string;
  title?: string | null;
  thinking?: boolean;
  chips?: DoshiChip[];
  recommendations?: DoshiRecommendation[] | null;
  stage?: 1 | 2;
  children?: ReactNode;
};

const STRIP_EASE = [0.22, 0.9, 0.24, 1] as const;
// Sliding window: only the most recent N chips stay visible. Older chips
// collapse leftward into the overflow ⋯ button as new ones pop on.
const MAX_VISIBLE_CHIPS = 2;
// Sample project list shown when the user taps the title — placeholder
// content; real list will eventually come from the agent's task store.
const SAMPLE_PROJECTS = [
  "Brown boots repair",
  "Repotting the fiddle leaf",
  "Living room redo",
  "Trip to Lisbon",
  "Sunday dinner ideas",
];

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
  title,
  thinking = false,
  chips,
  recommendations,
  stage = 1,
  children,
}: DoshiPhoneProps) {
  const [videoOn, setVideoOn] = useState(true);
  const [micPressed, setMicPressed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const chipList = chips ?? [];
  const visibleChips = chipList.slice(-MAX_VISIBLE_CHIPS);
  const collapsedCount = Math.max(0, chipList.length - MAX_VISIBLE_CHIPS);
  const showOverflow = collapsedCount > 0;
  const hasChipRow = thinking || visibleChips.length > 0 || showOverflow;

  return (
    <div
      className="doshi-phone proto-phone"
      data-platform={platform}
      data-stage={stage}
      data-has-recommendations={recommendations && recommendations.length > 0 ? "true" : undefined}
      role="figure"
      aria-label="DOSHI prototype"
    >
      {videoOn && backgroundVideo ? (
        <video
          key={backgroundVideo}
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

      <div className="doshi-top-scrim" aria-hidden />
      <div className="doshi-bottom-scrim" aria-hidden />

      <div className="gemini-statusbar doshi-statusbar" aria-hidden>
        <span className="gemini-statusbar-time">9:41</span>
        <div className="gemini-statusbar-signals">
          <SignalBars />
          <WifiGlyph />
          <BatteryGlyph />
        </div>
      </div>
      {platform === "ios" ? (
        <div className="gemini-device-island" aria-hidden />
      ) : (
        <div className="gemini-device-punch" aria-hidden />
      )}

      <div className="doshi-header">
        <div className="doshi-header-slot" data-align="start">
          <button
            type="button"
            className="doshi-header-icon-btn"
            aria-label="Back"
          >
            <IconBack />
          </button>
        </div>
        <div className="doshi-header-slot" data-align="center">
          <button
            type="button"
            className="doshi-header-title"
            data-open={menuOpen ? "true" : undefined}
            aria-label={title ? `${title} — switch project` : "Untitled task"}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => title && setMenuOpen((o) => !o)}
            disabled={!title}
          >
            <AnimatePresence mode="wait" initial={false}>
              {title ? (
                <motion.span
                  key={title}
                  className="doshi-header-title-text"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.32, ease: STRIP_EASE }}
                >
                  {title}
                </motion.span>
              ) : null}
            </AnimatePresence>
            {title ? <IconCaret open={menuOpen} /> : null}
          </button>
        </div>
        <div className="doshi-header-slot" data-align="end">
          <button
            type="button"
            className="doshi-header-icon-btn"
            aria-label="Sound"
          >
            <IconSpeaker />
          </button>
        </div>
      </div>

      {streamEnabled ? <StreamStatus status={streamStatus} /> : null}

      {hasChipRow ? (
        <div className="doshi-chip-row" role="list">
          <AnimatePresence initial={false}>
            {showOverflow ? (
              <motion.button
                key="__overflow"
                layout
                type="button"
                className="doshi-chip-overflow"
                aria-label="Show all chips"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.42, ease: STRIP_EASE }}
              >
                <IconOverflow />
              </motion.button>
            ) : null}
            {thinking ? (
              <motion.span
                key="__thinking"
                layout
                role="listitem"
                className="doshi-chip"
                data-thinking="true"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.42, ease: STRIP_EASE }}
              >
                Thinking
                <span className="doshi-thinking-dots" aria-hidden>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </motion.span>
            ) : null}
            {visibleChips.map((c) => (
              <motion.span
                key={c.id}
                layout
                role="listitem"
                className="doshi-chip"
                data-category={c.category}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                // Collapse leftward into the overflow ⋯ when bumped out.
                exit={{ opacity: 0, scale: 0.4, x: -56 }}
                transition={{ duration: 0.5, ease: STRIP_EASE }}
              >
                {c.category === "location" ? <ChipIconPin /> : null}
                <span className="doshi-chip-label">{c.label}</span>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      ) : null}

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.div
              key="menu-backdrop"
              className="doshi-menu-backdrop"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
            <motion.div
              key="menu"
              className="doshi-project-menu"
              role="menu"
              aria-label="Ongoing projects"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: STRIP_EASE }}
            >
              <div className="doshi-project-menu-kicker">Ongoing</div>
              <div className="doshi-project-menu-list">
                {SAMPLE_PROJECTS.map((p) => {
                  const active = p === title;
                  return (
                    <button
                      key={p}
                      type="button"
                      role="menuitemradio"
                      aria-checked={active}
                      className="doshi-project-menu-item"
                      data-active={active ? "true" : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>{p}</span>
                      {active ? <IconCheck /> : null}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <div className="doshi-caption-wrapper">{children}</div>

      <AnimatePresence>
        {recommendations && recommendations.length > 0 ? (
          <motion.div
            className="doshi-rec-carousel"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.4, ease: STRIP_EASE }}
          >
            {recommendations.map((r) => (
              <article key={r.id} className="doshi-rec-card">
                <h3 className="doshi-rec-title">
                  {r.icon ? (
                    <span aria-hidden className="doshi-rec-icon">
                      {r.icon}
                    </span>
                  ) : null}
                  {r.title}
                </h3>
                <p className="doshi-rec-body">{r.body}</p>
              </article>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

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

      <div className="gemini-home-indicator doshi-home-indicator" aria-hidden />
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

function IconBack() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} strokeWidth={1.6}>
      <path d="M14 6 L8 12 L14 18" />
    </svg>
  );
}

function IconCaret({ open = false }: { open?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
      style={{
        transform: open ? "rotate(180deg)" : undefined,
        transition: "transform 180ms ease",
      }}
    >
      <path d="M3 6 L8 11 L13 6 Z" />
    </svg>
  );
}

function ChipIconPin() {
  // Tiny map pin — used on chips that represent a place (e.g. a zip code).
  return (
    <svg
      width="11"
      height="13"
      viewBox="0 0 11 13"
      fill="currentColor"
      aria-hidden
      className="doshi-chip-icon"
    >
      <path d="M5.5 0.5 C 2.7 0.5, 0.6 2.6, 0.6 5.3 C 0.6 8.6, 5.5 12.5, 5.5 12.5 C 5.5 12.5, 10.4 8.6, 10.4 5.3 C 10.4 2.6, 8.3 0.5, 5.5 0.5 Z" />
      <circle cx="5.5" cy="5.2" r="1.6" fill="rgba(0,0,0,0.55)" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12.5 L10 17 L19 7" />
    </svg>
  );
}

function SignalBars() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden>
      <rect x="0" y="8" width="3" height="3" rx="0.6" />
      <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.6" />
      <rect x="9" y="3" width="3" height="8" rx="0.6" />
      <rect x="13.5" y="0" width="3" height="11" rx="0.6" />
    </svg>
  );
}

function WifiGlyph() {
  return (
    <svg
      width="15"
      height="11"
      viewBox="0 0 15 11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M1.5 4.5 C4 2.2 7 1 7.5 1 C8 1 11 2.2 13.5 4.5" />
      <path d="M3.5 6.8 C5 5.5 6.8 4.8 7.5 4.8 C8.2 4.8 10 5.5 11.5 6.8" />
      <circle cx="7.5" cy="9.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <rect x="2" y="2" width="19" height="8" rx="1.6" fill="currentColor" />
      <rect
        x="23.5"
        y="4"
        width="1.5"
        height="4"
        rx="0.6"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

function IconSpeaker() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" />
      <path
        d="M16.5 8.5 C 18.5 10.5, 18.5 13.5, 16.5 15.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <path
        d="M19 6.5 C 22 9.5, 22 14.5, 19 17.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconOverflow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="6" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18" cy="12" r="1.6" />
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
