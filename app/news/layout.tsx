import type { Metadata } from "next";
import "./news.css";

export const metadata: Metadata = {
  title: "The National Ledger",
  description: "Democracy in daylight.",
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="news-root">{children}</div>;
}
