"use client";

import { useEffect } from "react";

/**
 * SceneEffects wires up page-wide immersion:
 *   - rAF-throttled parallax for any [data-parallax="n"] element. The element's
 *     translateY is set based on its distance from the viewport center, scaled
 *     by `n`. Higher = stronger drift.
 *   - IntersectionObserver-based reveal — anything with [data-reveal] gets
 *     `.is-revealed` added as it enters the viewport (content fades + rises).
 *
 * Respects prefers-reduced-motion: reveals instantly, no parallax.
 * Does NOT hijack scroll. Native scroll still drives everything.
 */
export function SceneEffects() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    // ——— Parallax loop ———
    let raf = 0;
    const parallaxEls: { el: HTMLElement; rate: number }[] = [];
    const collectParallax = () => {
      parallaxEls.length = 0;
      document
        .querySelectorAll<HTMLElement>("[data-parallax]")
        .forEach((el) => {
          parallaxEls.push({
            el,
            rate: parseFloat(el.dataset.parallax || "0.05"),
          });
        });
    };
    collectParallax();

    const update = () => {
      const vh = window.innerHeight;
      const center = vh / 2;
      for (const { el, rate } of parallaxEls) {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const delta = (elCenter - center) * -rate;
        el.style.transform = `translate3d(0, ${delta.toFixed(2)}px, 0)`;
      }
      raf = 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // ——— Reveal on enter ———
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => io.observe(el));

    // Re-collect parallax + re-observe reveals when new nodes mount
    const mo = new MutationObserver(() => {
      collectParallax();
      document
        .querySelectorAll("[data-reveal]:not(.is-revealed)")
        .forEach((el) => io.observe(el));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

/** Global fixed-position dot grid. Parallax-ed by SceneEffects. */
export function SceneBackground() {
  return (
    <div className="wipu-scene-bg" aria-hidden="true">
      <div className="wipu-scene-bg-grid" data-parallax="0.025" />
    </div>
  );
}
