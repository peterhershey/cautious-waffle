"use client";

import { useEffect, useRef, useState } from "react";

/* Lazy YouTube embed for the case-study deck. Every slide in a deck is
   mounted at once inside one scroll container, so an <iframe> with
   `autoplay=1` in its src begins playing the moment the page loads —
   even while it is far off-screen. This component holds back the iframe
   until its slide first scrolls into view (IntersectionObserver against
   the viewport), then keeps it mounted so scrolling away and back does
   not reload or restart it. Before first view it shows the blurred
   thumbnail glow behind the empty frame as a poster. */

export type VideoEmbedProps = {
  /** YouTube video id. */
  id: string;
  /** Accessible iframe title. */
  title: string;
  /** Query string appended after the id (no leading "?"), e.g.
      "rel=0&playsinline=1&start=127&autoplay=1&mute=1". */
  params: string;
  /** Thumbnail URL for the blurred glow shown behind the frame. */
  thumb?: string;
  /** Class on the iframe (decks use "wipu-sample-video-iframe"). */
  iframeClassName?: string;
  /** iframe `allow` attribute. */
  allow?: string;
  /** Override the stage/glow/frame classes — e.g. the timeline figure
      slot uses "wpd-tl-video-*" for its rounded frame + ambient glow. */
  stageClassName?: string;
  glowClassName?: string;
  frameClassName?: string;
  /** Pressing M toggles mute while this embed is the one on screen.
      Default on for every deck video. Adds enablejsapi=1 to the src;
      initial mute state is read from `mute=1` in `params`. A transient
      pill confirms the state. */
  muteHotkey?: boolean;
};

const DEFAULT_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

export function VideoEmbed({
  id,
  title,
  params,
  thumb,
  iframeClassName,
  allow,
  stageClassName = "wipu-sample-video-stage",
  glowClassName = "wipu-sample-video-glow",
  frameClassName = "wipu-sample-video-frame",
  muteHotkey = true,
}: VideoEmbedProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const mutedRef = useRef(/(^|&)mute=1(&|$)/.test(params));
  const pillTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [show, setShow] = useState(false);
  const [pill, setPill] = useState<string | null>(null);

  /* controls=0 embeds are decorative loops — keep clicks (and therefore
     focus) out of the iframe, since a focused cross-origin iframe
     swallows the M keypress. Embeds with visible controls stay clickable. */
  const decorative = /(^|&)controls=0(&|$)/.test(params);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShow(true);
            io.disconnect();
            return;
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  /* M toggles mute via the YouTube iframe API (postMessage commands need
     enablejsapi=1 on the src). Only fires while this embed is mostly
     on screen — off-pan timeline stops and scrolled-away slides sit
     (almost) fully outside the viewport, so "mostly visible" means
     "the one being looked at", even for embeds in off-center columns. */
  useEffect(() => {
    if (!muteHotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "m" && e.key !== "M") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t) {
        const tag = t.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) return;
      }
      const el = ref.current;
      const iframe = iframeRef.current;
      if (!el || !iframe?.contentWindow) return;
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const ix = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
      const iy = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      const visible = (ix * iy) / (r.width * r.height || 1);
      if (visible < 0.5) return;

      mutedRef.current = !mutedRef.current;
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: mutedRef.current ? "mute" : "unMute",
          args: [],
        }),
        "*",
      );
      setPill(mutedRef.current ? "Muted" : "Sound on");
      if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
      pillTimerRef.current = setTimeout(() => setPill(null), 1400);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
    };
  }, [muteHotkey]);

  const src = `https://www.youtube-nocookie.com/embed/${id}?${params}${
    muteHotkey ? "&enablejsapi=1" : ""
  }`;

  return (
    <div className={stageClassName} ref={ref}>
      {thumb && (
        <div
          className={glowClassName}
          style={{ backgroundImage: `url(${thumb})` }}
          aria-hidden
        />
      )}
      <div className={frameClassName}>
        {show && (
          <iframe
            ref={iframeRef}
            src={src}
            title={title}
            className={iframeClassName}
            allow={allow ?? DEFAULT_ALLOW}
            allowFullScreen
            style={muteHotkey && decorative ? { pointerEvents: "none" } : undefined}
            tabIndex={muteHotkey && decorative ? -1 : undefined}
          />
        )}
        {muteHotkey && pill && (
          <div className="wipu-video-mute-pill" aria-live="polite">
            {pill}
          </div>
        )}
      </div>
    </div>
  );
}
