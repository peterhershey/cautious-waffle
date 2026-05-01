import type { Metadata } from "next";
import { Google_Sans, IBM_Plex_Mono } from "next/font/google";
import "./theme.css";

const googleSans = Google_Sans({
  variable: "--proto-font",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Prototypes — Peter Hershey",
  description: "Interactive prototypes from Peter Hershey's portfolio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0&display=block"
      />
      <div className={`${googleSans.variable} ${plexMono.variable} proto-root`}>
        {children}
      </div>
    </>
  );
}
