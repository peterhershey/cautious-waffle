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
  metadataBase: new URL("https://whatspeterdo.ing"),
  title: {
    default: "Peter Hershey",
    template: "%s — Peter Hershey",
  },
  description: "UX, visual, and AI product design.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Peter Hershey",
    description: "UX, visual, and AI product design.",
    url: "https://whatspeterdo.ing",
    siteName: "Peter Hershey",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peter Hershey",
    description: "UX, visual, and AI product design.",
  },
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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
