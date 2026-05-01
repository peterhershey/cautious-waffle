import type { Metadata } from "next";
import "./archive.css";

export const metadata: Metadata = {
  title: "Archive — Peter Hershey",
  description: "Internal reference. Not part of the main portfolio.",
  robots: { index: false, follow: false },
};

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="archive-root">{children}</div>;
}
