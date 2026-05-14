/* Template 01 — Intro / Closing.
   Centered hero card with optional emoji, greeting, name, and a small note.
   Used by:
   - main page slide 1 (HeroSlide)
   - sample presentation slide 01 (IntroSlide) */

import type { ReactNode } from "react";
import { EmailLink } from "@/app/components/EmailLink";

export type IntroContactTone =
  | "terracotta"
  | "mint"
  | "mustard"
  | "rose"
  | "navy";

export type IntroContact = {
  label: string;
  /** Required for normal links. Omit when `email` is set — EmailLink
   *  assembles its href client-side. */
  href?: string;
  tone?: IntroContactTone;
  /** When set, the contact renders via <EmailLink> with parts decoded
   *  client-side. Keeps the address out of the SSR HTML. */
  email?: { user: string; domain: string };
};

export type IntroTemplateProps = {
  /** Optional display-scale glyph above the headline. */
  emoji?: ReactNode;
  /** Small dim greeting line above the name (e.g. "Hi, I'm"). */
  greeting?: ReactNode;
  /** Big name / title line — required. */
  name: ReactNode;
  /** Medium dim subtitle below the name (e.g. role / tagline). */
  subtitle?: ReactNode;
  /** Small faint note below the name. */
  note?: ReactNode;
  /** Optional row of contact / social links rendered below the subtitle. */
  contacts?: ReadonlyArray<IntroContact>;
};

export function IntroTemplate({ emoji, greeting, name, subtitle, note, contacts }: IntroTemplateProps) {
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
      {subtitle && <p className="wipu-tpl-intro-subtitle">{subtitle}</p>}
      {contacts && contacts.length > 0 && (
        <ul className="wipu-tpl-intro-contacts">
          {contacts.map((c) => {
            if (c.email) {
              return (
                <li key={c.label}>
                  <EmailLink
                    className="wipu-tpl-intro-contact"
                    tone={c.tone ?? "terracotta"}
                    label={c.label}
                    user={c.email.user}
                    domain={c.email.domain}
                  />
                </li>
              );
            }
            const href = c.href ?? "#";
            const isExternal = !href.startsWith("mailto:");
            return (
              <li key={href}>
                <a
                  className="wipu-tpl-intro-contact"
                  data-tone={c.tone ?? "terracotta"}
                  href={href}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {c.label}
                  {isExternal && <span aria-hidden> ↗</span>}
                </a>
              </li>
            );
          })}
        </ul>
      )}
      {note && <p className="wipu-tpl-intro-note">{note}</p>}
    </div>
  );
}
