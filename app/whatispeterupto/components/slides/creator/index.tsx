"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDeck } from "../../Deck";
import { Folder } from "./Folder";
import { TILES, type Tile } from "./tiles";

type OverlayState = "closed" | "opening" | "open" | "closing";

const SLIDE_ID = "creator";
const OPEN_MS = 800;
const CLOSE_MS = 500;

/* ── Magnetic drift constants ─────────────────────────────────────── */
const DRIFT_MAX_PX = 3; // ceiling for drift offset, applied uniformly to all images
const DRIFT_RADIUS = 600; // px — how far cursor influence reaches
const SPRING_STIFFNESS = 0.025; // how fast tiles chase target (lower = slower / heavier)
const SPRING_DAMPING = 0.92; // velocity persistence (higher = more glide / inertia)

/* ── FPS performance gate ─────────────────────────────────────────── */
const FPS_SAMPLE_SIZE = 30;
const FPS_THRESHOLD = 28; // drop magnetic drift below this

export function CreatorSlide() {
  const { activeIndex, setImmersive } = useDeck();
  const [state, setState] = useState<OverlayState>("closed");
  const [folderDrawn, setFolderDrawn] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]); // outer tile wrappers
  const tileInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isActive =
    activeIndex >= 0 && typeof window !== "undefined"
      ? document
          .querySelector<HTMLElement>(`[data-slide-id="${SLIDE_ID}"]`)
          ?.dataset.active === "true"
      : false;

  // Draw the folder once the slide becomes active
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(
      `[data-slide-id="${SLIDE_ID}"]`,
    );
    if (!el) return;
    const obs = new MutationObserver(() => {
      if (el.dataset.active === "true") setFolderDrawn(true);
    });
    obs.observe(el, { attributes: true, attributeFilter: ["data-active"] });
    if (el.dataset.active === "true") setFolderDrawn(true);
    return () => obs.disconnect();
  }, []);

  const open = useCallback(() => {
    if (state !== "closed") return;
    setState("opening");
    setImmersive(true);
    // Mount overlay in collapsed state, then flip to open on the next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setState("open"));
    });
  }, [state, setImmersive]);

  const close = useCallback(() => {
    if (state !== "open") return;
    setState("closing");
    setImmersive(false);
    window.setTimeout(() => setState("closed"), CLOSE_MS);
  }, [state, setImmersive]);

  // ESC to close when exploded
  useEffect(() => {
    if (state !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [state, close]);

  // If the user navigates away from the creator slide, auto-close overlay
  useEffect(() => {
    if (!isActive && (state === "open" || state === "opening")) {
      setState("closed");
      setImmersive(false);
    }
  }, [activeIndex, isActive, state, setImmersive]);

  /* ── Tidal Scroll: IntersectionObserver reveal ──────────────────── */
  useEffect(() => {
    if (state !== "open") return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Small delay so explosion animation finishes first
    let observer: IntersectionObserver | null = null;
    const revealTimer = window.setTimeout(() => {
      const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!tiles.length) return;

      if (reduce) {
        tiles.forEach((el) => el.setAttribute("data-revealed", "true"));
        return;
      }

      // Split: tiles already in viewport get revealed immediately (no flash),
      // tiles below the fold start hidden and reveal on scroll.
      const belowFold: HTMLDivElement[] = [];
      tiles.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.setAttribute("data-revealed", "true");
        } else {
          el.setAttribute("data-revealed", "false");
          belowFold.push(el);
        }
      });

      if (!belowFold.length) return;

      // Stagger delay based on horizontal position within each batch
      observer = new IntersectionObserver(
        (entries) => {
          const entering = entries.filter(
            (e) => e.isIntersecting && e.target.getAttribute("data-revealed") === "false",
          );
          if (!entering.length) return;

          // Sort left-to-right for stagger
          entering.sort(
            (a, b) =>
              a.boundingClientRect.left - b.boundingClientRect.left,
          );
          entering.forEach((entry, i) => {
            const el = entry.target as HTMLElement;
            el.style.setProperty("--reveal-delay", String(i * 60));
            el.setAttribute("data-revealed", "true");
          });
        },
        {
          root: overlayRef.current,
          rootMargin: "0px 0px -8% 0px",
          threshold: 0.15,
        },
      );

      belowFold.forEach((el) => observer!.observe(el));
    }, 750); // wait for explosion to settle

    return () => {
      window.clearTimeout(revealTimer);
      observer?.disconnect();
    };
  }, [state]);

  /* ── Combined rAF loop: parallax + magnetic drift ───────────────── */
  useEffect(() => {
    if (state === "closed") return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // ── Mouse tracking (magnetic drift) ──
    const mouse = { x: -9999, y: -9999, active: false };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    overlay.addEventListener("mousemove", onMove, { passive: true });
    overlay.addEventListener("mouseleave", onLeave, { passive: true });

    // ── Gyroscope fallback for mobile ──
    const gyro = { x: 0, y: 0, active: false };
    let gyroHandler: ((e: DeviceOrientationEvent) => void) | null = null;
    if ("ontouchstart" in window) {
      gyroHandler = (e: DeviceOrientationEvent) => {
        if (e.gamma == null || e.beta == null) return;
        // Normalize to -1..1 range (gamma: -90..90, beta: -180..180)
        gyro.x = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 30));
        gyro.y = Math.max(-1, Math.min(1, ((e.beta ?? 0) - 45) / 30));
        gyro.active = true;
      };
      window.addEventListener("deviceorientation", gyroHandler, { passive: true });
    }

    // ── Per-tile spring state ──
    const springs: { x: number; y: number; vx: number; vy: number }[] =
      TILES.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));

    // ── FPS monitor ──
    let frameTimes: number[] = [];
    let lastFrameTime = performance.now();
    let driftEnabled = true;

    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const dt = now - lastFrameTime;
      lastFrameTime = now;

      // FPS sampling — check every N frames
      frameTimes.push(dt);
      if (frameTimes.length >= FPS_SAMPLE_SIZE) {
        const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const fps = 1000 / avg;
        if (fps < FPS_THRESHOLD) {
          driftEnabled = false; // disable magnetic drift, keep parallax
        }
        frameTimes = [];
      }

      const vh = window.innerHeight;
      const vpCenter = vh / 2;

      for (let i = 0; i < tileInnerRefs.current.length; i++) {
        const el = tileInnerRefs.current[i];
        if (!el) continue;
        const tile = TILES[i];
        if (!tile) continue;

        // Cards are excluded from magnetic drift entirely — they sit still.
        if (tile.kind === "card") {
          el.style.transform = "translate3d(0, 0, 0)";
          continue;
        }

        const host = el.parentElement;
        if (!host) continue;
        const rect = host.getBoundingClientRect();

        // Skip tiles fully offscreen
        if (rect.bottom < -100 || rect.top > vh + 100) continue;

        // ── Compute magnetic drift for this image tile ──
        let driftX = 0;
        let driftY = 0;

        if (driftEnabled) {
          const maxDrift = DRIFT_MAX_PX;
          const tileCX = rect.left + rect.width / 2;
          const tileCY = rect.top + rect.height / 2;

          let targetX = 0;
          let targetY = 0;

          if (mouse.active) {
            const dx = mouse.x - tileCX;
            const dy = mouse.y - tileCY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < DRIFT_RADIUS) {
              const influence = 1 - dist / DRIFT_RADIUS;
              const pull = influence * influence; // quadratic falloff
              targetX = (dx / (dist || 1)) * maxDrift * pull;
              targetY = (dy / (dist || 1)) * maxDrift * pull;
            }
          } else if (gyro.active) {
            targetX = gyro.x * maxDrift;
            targetY = gyro.y * maxDrift;
          }

          // Spring physics
          const spring = springs[i];
          const ax = (targetX - spring.x) * SPRING_STIFFNESS;
          const ay = (targetY - spring.y) * SPRING_STIFFNESS;
          spring.vx = (spring.vx + ax) * SPRING_DAMPING;
          spring.vy = (spring.vy + ay) * SPRING_DAMPING;
          spring.x += spring.vx;
          spring.y += spring.vy;

          // Snap to zero if negligible (avoid sub-pixel jitter)
          if (Math.abs(spring.x) < 0.01 && Math.abs(spring.vx) < 0.01) {
            spring.x = 0;
            spring.vx = 0;
          }
          if (Math.abs(spring.y) < 0.01 && Math.abs(spring.vy) < 0.01) {
            spring.y = 0;
            spring.vy = 0;
          }

          driftX = spring.x;
          driftY = spring.y;
        }

        // ── Image tiles: parallax + drift ──
        if (tile.kb) {
          // Ken Burns + drift
          const progress = Math.max(
            0,
            Math.min(1, (vh - rect.top) / (vh + rect.height)),
          );
          const scale = 1 + progress * 0.12;
          el.style.transform = `translate3d(${driftX.toFixed(2)}px, ${driftY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
          continue;
        }

        if (tile.rate === 0 && driftX === 0 && driftY === 0) {
          el.style.transform = "translate3d(0, 0, 0)";
          continue;
        }

        // Parallax + drift
        let parallaxY = 0;
        if (tile.rate !== 0) {
          const delta = rect.top + rect.height / 2 - vpCenter;
          const raw = delta * tile.rate;
          const max = rect.height * 0.08;
          parallaxY = Math.max(-max, Math.min(max, raw));
        }
        el.style.transform = `translate3d(${driftX.toFixed(2)}px, ${(parallaxY + driftY).toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      overlay.removeEventListener("mousemove", onMove);
      overlay.removeEventListener("mouseleave", onLeave);
      if (gyroHandler) {
        window.removeEventListener("deviceorientation", gyroHandler);
      }
    };
  }, [state]);

  return (
    <div className="creator-slide" data-state={state}>
      {/* Intro — title + folder entry point */}
      <div className="creator-intro" aria-hidden={state !== "closed"}>
        <div className="creator-eyebrow">ALWAYS A CREATOR · 02</div>
        <h2 className="creator-title">
          Curious above
          <br />
          all else.
        </h2>
        <button
          type="button"
          className="creator-folder-btn"
          onClick={open}
          aria-label="Open the folder"
          disabled={state !== "closed"}
        >
          <Folder drawn={folderDrawn} />
        </button>
        <div className="creator-hint">Open the folder ↓</div>
      </div>

      {/* Exploded overlay */}
      {state !== "closed" && (
        <div
          ref={overlayRef}
          className="creator-overlay"
          data-state={state}
          role="dialog"
          aria-label="Curious above all else — image gallery"
          aria-modal="true"
        >
          <div className="creator-grid">
            {TILES.map((t, i) => (
              <TileCard
                key={i}
                tile={t}
                index={i}
                tileRef={(el) => {
                  tileRefs.current[i] = el;
                }}
                innerRef={(el) => {
                  tileInnerRefs.current[i] = el;
                }}
              />
            ))}
          </div>
          <button
            type="button"
            className="creator-x"
            onClick={close}
            aria-label="Close gallery"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

function TileCard({
  tile,
  index,
  tileRef,
  innerRef,
}: {
  tile: Tile;
  index: number;
  tileRef: (el: HTMLDivElement | null) => void;
  innerRef: (el: HTMLDivElement | null) => void;
}) {
  const sizeClass = `creator-tile-${tile.size}`;
  if (tile.kind === "image") {
    const innerStyle: React.CSSProperties = { ["--i" as string]: index } as React.CSSProperties;
    const parallaxStyle: React.CSSProperties = tile.kb
      ? { transformOrigin: `${tile.kb[0]}% ${tile.kb[1]}%` }
      : {};
    const isVideo = /\.(mp4|mov|webm)$/i.test(tile.src);
    const mediaStyle: React.CSSProperties | undefined = tile.objectPosition
      ? { objectPosition: tile.objectPosition }
      : undefined;
    return (
      <div
        ref={tileRef}
        className={`creator-tile creator-tile-image ${sizeClass}`}
        style={innerStyle}
        data-kb={tile.kb ? "true" : undefined}
      >
        <div ref={innerRef} className="creator-tile-inner" style={parallaxStyle}>
          {isVideo ? (
            <video
              src={tile.src}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              draggable={false}
              style={mediaStyle}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tile.src}
              alt={tile.alt}
              loading="lazy"
              draggable={false}
              style={mediaStyle}
            />
          )}
        </div>
      </div>
    );
  }
  return (
    <div
      ref={tileRef}
      className={`creator-tile creator-tile-card creator-tone-${tile.tone} ${sizeClass}`}
      style={{ ["--i" as string]: index }}
    >
      <div ref={innerRef} className="creator-tile-inner">
        <div className="creator-card-emoji" aria-hidden>
          {tile.emoji}
        </div>
        <div className="creator-card-text">{tile.text}</div>
      </div>
    </div>
  );
}
