import Script from "next/script";
import { IBM_Plex_Mono } from "next/font/google";
import "../_deck/styles/theme.css";
import "../_deck/styles/glass.css";
import "../_deck/styles/deck.css";
import "../_deck/styles/board.css";
import "../_deck/styles/annotations.css";
import "../_deck/templates/templates.css";
import "../_deck/chrome/chrome.css";
import "../templates/sample/sample.css";
import "./[id]/case-study.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const themeInit = `
(function(){try{
  var saved = localStorage.getItem('wipu-theme');
  var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  var t = saved || (prefersLight ? 'light' : 'dark');
  var r = document.querySelector('.wipu-root');
  if(r) r.setAttribute('data-theme', t);
}catch(e){}})();
`;

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${plexMono.variable} wipu-root`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <Script
        id="wipu-theme-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: themeInit }}
      />
      {children}
    </div>
  );
}
