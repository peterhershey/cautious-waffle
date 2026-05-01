import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import "../_deck/styles/theme.css";
import "../_deck/styles/glass.css";
import "../_deck/styles/deck.css";
import "../_deck/templates/templates.css";
import "../_deck/slides/field-notes/field-notes.css";
import "../_deck/slides/movie-embed/movie-embed.css";
import "../_deck/slides/text-image/text-image.css";
import "../_deck/styles/board.css";
import "../_deck/styles/annotations.css";
import "../_deck/chrome/chrome.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Peter Hershey — Portfolio",
  description:
    "Peter Hershey — Senior AI product designer. A slide-by-slide introduction.",
};

const themeInit = `
(function(){try{
  var saved = localStorage.getItem('wipu-theme');
  var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  var t = saved || (prefersLight ? 'light' : 'dark');
  var r = document.querySelector('.wipu-root');
  if(r) r.setAttribute('data-theme', t);
}catch(e){}})();
`;

export default function DeckLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${plexMono.variable} wipu-root`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <Script
        id="wipu-theme-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: themeInit }}
      />
      {children}
    </div>
  );
}
