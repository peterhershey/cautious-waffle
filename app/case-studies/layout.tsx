import { IBM_Plex_Mono } from "next/font/google";
import "../_deck/styles/theme.css";
import "../_deck/styles/glass.css";
import "../_deck/styles/hud.css";
import "../_deck/styles/deck.css";
import "../_deck/styles/board.css";
import "../_deck/styles/annotations.css";
import "../_deck/templates/templates.css";
import "../_deck/chrome/chrome.css";
import "./_shared/sample.css";
import "./_shared/gel.css";
import "./[id]/case-study.css";
/* Prototype styles for direct-mounted PrototypeEmbed slides. All selectors
   are prefixed (.proto-, .gemini-) — no leakage into deck styles. */
import "../archive/prototypes/theme.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${plexMono.variable} wipu-root`}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
