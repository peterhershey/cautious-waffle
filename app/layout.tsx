import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["italic", "normal"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Peter Hershey — Portfolio",
  description:
    "UX, visual, and AI product design. Selected work from Peter Hershey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-neutral-100">{children}</body>
    </html>
  );
}
