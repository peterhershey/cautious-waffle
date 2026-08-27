"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { MediaWindow } from "./types";
import { SHELL_SPRING } from "../motion";
import { TrafficLights } from "../chrome/TrafficLights";

type Props = {
  window: MediaWindow;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

/** A second terminal window that moves in over the first (which stays visible
 *  behind a light scrim) — a story point that "opens in a new window." Pages
 *  through frames like the side stage, but presented as a floating Quick Look
 *  pane. Reuses the .term-media-* chrome; framer drives the entrance/exit. */
export function PopupWindow({ window: win, index, onPrev, onNext, onClose }: Props) {
  const reduce = useReducedMotion();
  const item = win.items[index];
  const label = [item.title, item.date].filter(Boolean).join(" · ");
  const count = win.items.length;

  return (
    <motion.div
      className="term-media-scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className="term-media-window"
        initial={reduce ? false : { opacity: 0, scale: 0.94, y: 22 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 14 }}
        transition={reduce ? { duration: 0 } : SHELL_SPRING}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="term-media-titlebar">
          <TrafficLights />
          <span className="term-media-title term-dim">{win.title}</span>
          <button type="button" className="term-media-ctl" onClick={onClose}>
            esc
          </button>
        </div>

        {win.variant === "article" ? (
          <article className="term-article">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="term-article-hero" src={item.src} alt={item.alt} draggable={false} />
            {item.kicker ? (
              <p className="term-article-kicker term-accent">{item.kicker}</p>
            ) : null}
            <h2 className="term-article-headline">{item.title}</h2>
            {item.dek ? <p className="term-article-dek term-dim">{item.dek}</p> : null}
            {item.byline ? (
              <p className="term-article-byline term-faint">{item.byline}</p>
            ) : null}
            {item.href ? (
              <a
                className="term-article-cta"
                href={item.href}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {item.cta ?? "Continue reading →"}
              </a>
            ) : null}
          </article>
        ) : (
          <>
        <div className="term-media-body">
          {count > 1 ? (
            <button
              type="button"
              className="term-media-nav term-media-prev"
              onClick={onPrev}
              disabled={index === 0}
              aria-label="Previous"
            >
              ‹
            </button>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="term-media-img" src={item.src} alt={item.alt} draggable={false} />
          {count > 1 ? (
            <button
              type="button"
              className="term-media-nav term-media-next"
              onClick={onNext}
              disabled={index === count - 1}
              aria-label="Next"
            >
              ›
            </button>
          ) : null}
        </div>
        <div className="term-media-foot">
          <span className="term-accent">{label || item.name}</span>
          {item.note ? <span className="term-dim">↳ {item.note}</span> : null}
          {item.href ? (
            <a
              className="term-media-link term-link"
              href={item.href}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {item.cta ?? "Open →"}
            </a>
          ) : null}
          {count > 1 ? (
            <span className="term-media-count term-dim">
              {index + 1} / {count}
            </span>
          ) : null}
        </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
