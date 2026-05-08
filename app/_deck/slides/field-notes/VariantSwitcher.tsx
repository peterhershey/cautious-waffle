"use client";

import type { VariantId } from "./tiles";

const OPTIONS: { id: VariantId; label: string }[] = [
  { id: "mosaic", label: "Mosaic" },
  { id: "editorial", label: "Editorial" },
  { id: "salon", label: "Salon" },
];

export function VariantSwitcher({
  variant,
  onChange,
  hidden,
}: {
  variant: VariantId;
  onChange: (next: VariantId) => void;
  hidden: boolean;
}) {
  return (
    <div
      className="field-notes-variant-switcher"
      role="radiogroup"
      aria-label="Gallery layout"
      aria-hidden={hidden}
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="radio"
          aria-checked={variant === opt.id}
          data-active={variant === opt.id ? "true" : "false"}
          className="field-notes-variant-btn"
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
