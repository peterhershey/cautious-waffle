"use client";

/* Gel — purple noise-like organic undulation. Stand-in for "what's next?"
   slots where there's no real artifact yet. Three blurred radial blobs
   drift on offset timings; mix-blend-mode: screen makes them fold over
   each other for an organic, alive feel. Sized via .wipu-sample-tl-image
   so it matches the timeline's other figure slots. */

export function Gel() {
  return (
    <div
      className="wipu-sample-tl-image wpd-gel"
      role="img"
      aria-label="Future chapter — what's next"
    >
      <span className="wpd-gel-blob" />
      <span className="wpd-gel-blob" />
      <span className="wpd-gel-blob" />
    </div>
  );
}
