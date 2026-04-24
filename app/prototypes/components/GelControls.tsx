"use client";

import { useEffect, useState } from "react";

type Knob = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  format: (n: number) => string;
  apply: (n: number, el: HTMLElement) => void;
};

/* CSS custom properties live on .proto-phone-screen; the SVG filter
   nodes live globally under their ids. Each knob writes to wherever it
   needs to — a style property, an SVG attribute, or both. */
const KNOBS: Knob[] = [
  {
    key: "speed",
    label: "Reactivity",
    min: 0.8,
    max: 20,
    step: 0.2,
    default: 6,
    format: (n) => `${n.toFixed(1)}s`,
    apply: (n, el) => {
      el.style.setProperty("--gel-speed", `${n}s`);
      const turb = document.getElementById("gel-turb-anim");
      // Turbulence morph runs slower than the CSS undulation so they
      // don't lock in phase.
      if (turb) turb.setAttribute("dur", `${Math.max(3, n * 2.2)}s`);
    },
  },
  {
    key: "strength",
    label: "Strength",
    min: 0,
    max: 260,
    step: 2,
    default: 100,
    format: (n) => `${Math.round(n)}`,
    apply: (n) => {
      const disp = document.getElementById("gel-displace");
      if (disp) disp.setAttribute("scale", String(n));
    },
  },
  {
    key: "height",
    label: "Height",
    min: 15,
    max: 90,
    step: 1,
    default: 45,
    format: (n) => `${Math.round(n)}%`,
    apply: (n, el) => el.style.setProperty("--gel-height", `${n}%`),
  },
  {
    key: "scale",
    label: "Scale",
    min: 0,
    max: 0.9,
    step: 0.01,
    default: 0.22,
    format: (n) => `${Math.round(n * 100)}%`,
    apply: (n, el) => el.style.setProperty("--gel-scale", `${n}`),
  },
  {
    key: "drift",
    label: "Drift",
    min: 0,
    max: 22,
    step: 0.5,
    default: 7,
    format: (n) => `${n}%`,
    apply: (n, el) => el.style.setProperty("--gel-drift", `${n}%`),
  },
  {
    key: "hue",
    label: "Hue shift",
    min: 0,
    max: 60,
    step: 1,
    default: 18,
    format: (n) => `${n}°`,
    apply: (n, el) => el.style.setProperty("--gel-hue", `${n}deg`),
  },
  {
    key: "glow",
    label: "Glow",
    min: 0.2,
    max: 3,
    step: 0.05,
    default: 1.1,
    format: (n) => n.toFixed(2),
    apply: (n, el) => el.style.setProperty("--gel-glow", `${n}`),
  },
];

export function GelControls() {
  const [open, setOpen] = useState(true);
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(KNOBS.map((k) => [k.key, k.default])),
  );

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".proto-phone-screen");
    if (!el) return;
    for (const knob of KNOBS) knob.apply(values[knob.key], el);
  }, [values]);

  const reset = () =>
    setValues(Object.fromEntries(KNOBS.map((k) => [k.key, k.default])));

  return (
    <div className="proto-panel-section gel-panel">
      <button
        type="button"
        className="gel-panel-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="proto-panel-kicker">Gel</span>
        <span className="gel-panel-chevron" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      {open ? (
        <div className="gel-panel-body">
          {KNOBS.map((knob) => (
            <label key={knob.key} className="gel-knob">
              <span className="gel-knob-row">
                <span className="gel-knob-label">{knob.label}</span>
                <span className="gel-knob-value">
                  {knob.format(values[knob.key])}
                </span>
              </span>
              <input
                type="range"
                min={knob.min}
                max={knob.max}
                step={knob.step}
                value={values[knob.key]}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    [knob.key]: Number(e.target.value),
                  }))
                }
              />
            </label>
          ))}
          <button
            type="button"
            className="gel-panel-reset"
            onClick={reset}
          >
            Reset
          </button>
        </div>
      ) : null}
    </div>
  );
}
