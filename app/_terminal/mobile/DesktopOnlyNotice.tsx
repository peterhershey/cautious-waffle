import Link from "next/link";

/** Shown below 1024px (see .term-mobile-gate in terminal.css). The terminal
 *  desktop conceit needs room; on phones we send recruiters to the real site. */
export function DesktopOnlyNotice() {
  return (
    <div className="term-notice">
      <div className="term-notice-card glass">
        <p className="term-notice-eyebrow term-accent">peter@portfolio</p>
        <h1 className="term-notice-title">Best viewed on a larger screen.</h1>
        <p className="term-notice-body term-dim">
          This is an experimental terminal-driven build, designed to be driven
          live on a laptop. The full portfolio reads great on mobile.
        </p>
        <Link href="/" className="term-notice-link">
          View the portfolio →
        </Link>
      </div>
    </div>
  );
}
