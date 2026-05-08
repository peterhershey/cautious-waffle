import Link from "next/link";
import type { CaseStudySlide, CaseStudyMeta } from "./CaseStudyDeck";
import { teaser } from "../../content";
import "./teaser.css";

/* Server-rendered preview of a locked case study. Renders the first
   slide using the same wrappers `CaseStudyDeck` uses, so the visual
   matches the unlocked view, then a sticky-bottom paywall that POSTs
   to the existing `/api/auth/login` route. None of the locked slides'
   HTML ships to unauthenticated visitors. */
export function CaseStudyTeaser({
  slide,
  meta,
  returnPath,
}: {
  slide: CaseStudySlide;
  meta: CaseStudyMeta;
  returnPath: string;
}) {
  const backHref = meta.backHref ?? "/";
  const backLabel = meta.backLabel ?? "← Back to portfolio";

  return (
    <div className="wipu-sample-root wpd-cs-teaser-root">
      {slide.selfContained ? (
        slide.content
      ) : (
        <section
          className="wipu-sample-slide"
          data-theme={slide.dark ? "dark" : undefined}
        >
          <div className="wipu-sample-inner">{slide.content}</div>
        </section>
      )}

      <aside className="wpd-cs-paywall" aria-label="Locked content">
        <div className="wpd-cs-paywall-fade" aria-hidden />
        <div className="wpd-cs-paywall-card glass">
          <div className="wpd-cs-paywall-text">
            <div className="wpd-cs-paywall-eyebrow">{teaser.eyebrow}</div>
            <h2 className="wpd-cs-paywall-title">{teaser.title}</h2>
          </div>
          <form
            method="POST"
            action="/api/auth/login"
            autoComplete="off"
            className="wpd-cs-paywall-form"
          >
            <input type="hidden" name="next" value={returnPath} />
            <input
              className="wpd-login-input wpd-cs-paywall-input"
              name="password"
              type="password"
              placeholder={teaser.passwordPlaceholder}
              aria-label={teaser.passwordPlaceholder}
              required
            />
            <button
              className="wpd-login-submit wpd-cs-paywall-submit"
              type="submit"
            >
              {teaser.submit}
            </button>
          </form>
          <p className="wpd-cs-paywall-foot">
            <Link href={backHref} className="wpd-cs-paywall-back">
              {backLabel}
            </Link>
          </p>
        </div>
      </aside>
    </div>
  );
}
