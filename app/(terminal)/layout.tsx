import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "../_deck/styles/theme.css";
import "../_deck/styles/glass.css";
import "../_terminal/styles/terminal.css";
import "../_terminal/chrome/chrome.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Peter Hershey — Portfolio (terminal)",
  description:
    "Peter Hershey — AI Product Designer. A terminal-driven walk through the work.",
};

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${plexMono.variable} wipu-root term-root`}
      data-theme="dark"
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
