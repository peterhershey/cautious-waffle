"use client";

import { EDITIONS } from "@/lib/editions";
import { ERAS } from "@/lib/eras";

type Props = {
  intensity: number;
  onIntensityChange: (n: number) => void;
  era: number;
  onEraChange: (n: number) => void;
};

export default function ControlsPanel({
  intensity,
  onIntensityChange,
  era,
  onEraChange,
}: Props) {
  const edition = EDITIONS[intensity];
  const erameta = ERAS[era];

  return (
    <div
      aria-label="Prototype controls"
      style={{
        position: "fixed",
        bottom: 22,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 80,
        width: "min(520px, calc(100vw - 32px))",
        padding: "12px 16px 13px",
        background: "rgba(12,14,18,0.42)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 18,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.08) inset, 0 14px 48px rgba(0,0,0,0.35)",
        backdropFilter: "blur(30px) saturate(1.6)",
        WebkitBackdropFilter: "blur(30px) saturate(1.6)",
        color: "rgba(255,255,255,0.88)",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.04em",
      }}
    >
      <Row
        label="EDITION"
        index={intensity}
        total={EDITIONS.length}
        value={edition.label.toUpperCase()}
        onChange={onIntensityChange}
        ticks={EDITIONS.length}
      />

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.10) 20%, rgba(255,255,255,0.10) 80%, transparent)",
          margin: "10px 0",
        }}
      />

      <Row
        label="ERA"
        index={era}
        total={ERAS.length}
        value={`${erameta.year} · ${erameta.label.toUpperCase()}`}
        onChange={onEraChange}
        ticks={ERAS.length}
      />

      <style>{`
        .cp-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          width: 100%;
          height: 16px;
          margin: 0;
          cursor: pointer;
          display: block;
        }
        .cp-slider:focus { outline: none; }
        .cp-slider::-webkit-slider-runnable-track {
          height: 1px;
          background: rgba(255,255,255,0.22);
          border: none;
        }
        .cp-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ffffff;
          border: 0;
          margin-top: -4.5px;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.08);
          transition: box-shadow 160ms ease, transform 160ms ease;
        }
        .cp-slider:hover::-webkit-slider-thumb,
        .cp-slider:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 6px rgba(255,255,255,0.14);
          transform: scale(1.05);
        }
        .cp-slider::-moz-range-track {
          height: 1px;
          background: rgba(255,255,255,0.22);
          border: none;
        }
        .cp-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ffffff;
          border: 0;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.08);
        }
      `}</style>
    </div>
  );
}

function Row({
  label,
  value,
  index,
  total,
  onChange,
  ticks,
}: {
  label: string;
  value: string;
  index: number;
  total: number;
  onChange: (n: number) => void;
  ticks: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "64px 1fr auto",
        alignItems: "center",
        gap: 14,
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.48)", fontWeight: 500 }}>
        {label}
      </span>

      <div style={{ position: "relative" }}>
        <input
          type="range"
          min={0}
          max={total - 1}
          step={1}
          value={index}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="cp-slider"
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pointerEvents: "none",
            padding: "0 4px",
          }}
        >
          {Array.from({ length: ticks }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 2,
                height: 2,
                borderRadius: "50%",
                background:
                  i === index ? "transparent" : "rgba(255,255,255,0.28)",
              }}
            />
          ))}
        </div>
      </div>

      <span
        style={{
          color: "rgba(255,255,255,0.96)",
          fontVariantNumeric: "tabular-nums",
          minWidth: 0,
          textAlign: "right",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 180,
        }}
      >
        {value}
      </span>
    </div>
  );
}
