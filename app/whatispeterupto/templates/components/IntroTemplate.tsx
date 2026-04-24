/* Template 01 — Intro / Closing.
   Centered hero card with optional emoji, greeting, name, and a small note.
   Used by:
   - main page slide 1 (HeroSlide)
   - sample presentation slide 01 (IntroSlide) */

import type { ReactNode } from "react";

export type IntroTemplateProps = {
  /** Optional display-scale glyph above the headline. */
  emoji?: ReactNode;
  /** Small dim greeting line above the name (e.g. "Hi, I'm"). */
  greeting?: ReactNode;
  /** Big name / title line — required. */
  name: ReactNode;
  /** Small faint note below the name. */
  note?: ReactNode;
};

export function IntroTemplate({ emoji, greeting, name, note }: IntroTemplateProps) {
  return (
    <div className="wipu-tpl-intro">
      {emoji && (
        <div className="wipu-tpl-intro-emoji" aria-hidden>
          {emoji}
        </div>
      )}
      <h1 className="wipu-tpl-intro-headline">
        {greeting && (
          <span className="wipu-tpl-intro-greeting">{greeting}</span>
        )}
        <span className="wipu-tpl-intro-name">{name}</span>
      </h1>
      {note && <p className="wipu-tpl-intro-note">{note}</p>}
    </div>
  );
}
