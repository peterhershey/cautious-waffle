"use client";

import { useEffect, useRef, useState } from "react";

export type HoverGifProps = {
  src: string;
  alt?: string;
  className?: string;
};

/* On desktop the live GIF only plays while hovered; otherwise we show a
   canvas-extracted first frame so animations don't fight for attention.
   On touch devices there's no hover, so we render the live GIF by default
   — and we honor `prefers-reduced-motion` by sticking on the static frame
   regardless of pointer type. */
const VIDEO_RE = /\.(mp4|webm|mov)$/i;

/* Inline emoji video — replaces the old multi-MB animated GIFs. Sized at
   1em like the gif <img> it stands in for. Autoplays muted+looped; honors
   reduced-motion by holding on the first frame instead of playing. */
function EmojiVideo({ src, alt = "", className }: HoverGifProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduceMotion) v.pause();
    else void v.play().catch(() => {});
  }, [reduceMotion]);
  return (
    <span
      className={className}
      aria-label={alt || undefined}
      role={alt ? "img" : undefined}
      style={{
        display: "inline-block",
        lineHeight: 0,
        padding: "0.4em",
        margin: "-0.4em",
      }}
    >
      <video
        ref={ref}
        src={src}
        autoPlay={!reduceMotion}
        loop
        muted
        playsInline
        draggable={false}
        style={{ height: "1em", width: "auto", display: "block" }}
      />
    </span>
  );
}

export function HoverGif(props: HoverGifProps) {
  /* Branch in a hookless wrapper so each leaf component's hooks stay
     unconditional (rules of hooks). Video srcs use the lightweight
     <video> path; legacy .gif srcs keep the hover-frame behavior. */
  if (VIDEO_RE.test(props.src)) return <EmojiVideo {...props} />;
  return <HoverGifImage {...props} />;
}

function HoverGifImage({ src, alt = "", className }: HoverGifProps) {
  const [hovered, setHovered] = useState(false);
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  /* `null` until the effect runs (SSR has no `window`); a boolean once
     we know whether the device has a hover-capable pointer. */
  const [canHover, setCanHover] = useState<boolean | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    const hoverMq = window.matchMedia("(hover: none)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncHover = () => setCanHover(!hoverMq.matches);
    const syncMotion = () => setReduceMotion(motionMq.matches);
    syncHover();
    syncMotion();
    hoverMq.addEventListener("change", syncHover);
    motionMq.addEventListener("change", syncMotion);
    return () => {
      hoverMq.removeEventListener("change", syncHover);
      motionMq.removeEventListener("change", syncMotion);
    };
  }, []);

  /* Only extract the static first frame when we'll actually use it —
     i.e. on devices with a hover pointer, or any device honoring
     reduced-motion. Touch devices that allow motion skip the canvas work. */
  const needsStaticFrame = canHover === true || reduceMotion;

  useEffect(() => {
    if (!needsStaticFrame) return;
    cancelled.current = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled.current) return;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      try {
        setFrameUrl(canvas.toDataURL("image/png"));
      } catch {
        /* tainted canvas — fall through to live src */
      }
    };
    img.src = src;
    return () => {
      cancelled.current = true;
    };
  }, [src, needsStaticFrame]);

  /* Show the live GIF when:
     - reduced-motion is requested → never (use the static frame instead)
     - the device has no hover pointer → always
     - otherwise → only while hovered, falling back to live until the
       static frame is ready. */
  const showLive = reduceMotion
    ? false
    : canHover === false
      ? true
      : hovered || !frameUrl;

  /* Skip hover wiring on touch devices — the listeners would never fire
     anyway, but this keeps the DOM intent honest. */
  const hoverProps =
    canHover === false
      ? {}
      : {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        };

  return (
    <span
      className={className}
      {...hoverProps}
      style={{
        display: "inline-block",
        lineHeight: 0,
        padding: "0.4em",
        margin: "-0.4em",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={showLive ? src : frameUrl ?? src}
        alt={alt}
        draggable={false}
        style={{ height: "1em", width: "auto", display: "block" }}
      />
    </span>
  );
}
