import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { QuickNav } from "../components/QuickNav";
import "./theme.css";
import "./deck.css";
import "./templates/components/templates.css";
import "./components/slides/creator/creator.css";
import "./components/slides/text-image/text-image.css";
import "./board.css";
import "./annotations.css";
import "../prototypes/theme.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "What is Peter up to?",
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${plexMono.variable} wipu-root`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      <QuickNav />
      {children}
    </div>
  );
}
