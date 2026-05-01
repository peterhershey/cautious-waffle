const VARIATIONS = [
  {
    src: "/zurich-variations/hierarchy.png",
    caption: "Hierarchy — control surfaces in priority layers",
  },
  {
    src: "/zurich-variations/video.png",
    caption: "Video — live preview states",
  },
  {
    src: "/zurich-variations/audio-visualizer.png",
    caption: "Audio visualiser — voice input treatments",
  },
  {
    src: "/zurich-variations/footprint.png",
    caption: "Footprint — surface size exploration",
  },
] as const;

/**
 * Horizontal strip of shipping-UI variations explored in Zurich.
 * Continuous overflow scroll (no pin, no snap) — drag, trackpad, or
 * shift-wheel to pan through. Each image keeps its natural aspect.
 */
export function ZurichScroller() {
  return (
    <section
      className="wipu-zurich-strip"
      aria-label="Shipping UI variations explored in Zurich"
    >
      <div className="wipu-zurich-strip-inner">
        <header className="wipu-zurich-strip-head">
          <span className="wipu-zurich-strip-label">VARIATIONS · ZURICH</span>
          <p className="wipu-zurich-strip-hint" aria-hidden="true">
            scroll →
          </p>
        </header>
        <div className="wipu-zurich-strip-scroll">
          <ul className="wipu-zurich-strip-list">
            {VARIATIONS.map((v) => (
              <li key={v.src} className="wipu-zurich-strip-item">
                <img
                  src={v.src}
                  alt={v.caption}
                  className="wipu-zurich-strip-image"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <figcaption className="wipu-zurich-strip-caption">
                  {v.caption}
                </figcaption>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
