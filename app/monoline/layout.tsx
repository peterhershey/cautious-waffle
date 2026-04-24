import type { Metadata } from "next";
import "./monoline.css";

export const metadata: Metadata = {
  title: "Monoline Illustrator",
  description: "Turn UI screenshots into monoline illustrations.",
};

export default function MonolineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="monoline-root">{children}</div>;
}
