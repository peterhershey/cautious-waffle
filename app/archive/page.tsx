import Link from "next/link";
import { SiteFrame } from "../components/SiteFrame";

const ENTRIES: { href: string; name: string; note: string }[] = [
  { href: "/archive/desk", name: "Desk", note: "Original parallax 'desk of images' homepage" },
  { href: "/archive/case-studies/teaching-gemini-to-see-deepdive", name: "Case study — Teaching Gemini to See (long version)", note: "Long-form deep dive — extended cut of the canonical case study" },
  { href: "/archive/design-system", name: "Design system", note: "Tokens, components, type scale reference" },
  { href: "/archive/prototypes", name: "Prototypes", note: "Standalone interactive sketches" },
  { href: "/archive/monoline", name: "Monoline illustrator", note: "Image → SVG generator (POC)" },
  { href: "/archive/news", name: "News", note: "Updates feed" },
];

export default function ArchiveIndex() {
  return (
    <>
      <SiteFrame label="ARCHIVE" scrambleKey="/archive" />
      <main className="archive-index">
      <h1>Archive</h1>
      <p className="archive-index-lede">
        Earlier experiments and reference pages. Not linked from the main portfolio.
      </p>
      <ul className="archive-list">
        {ENTRIES.map((e) => (
          <li key={e.href}>
            <Link href={e.href}>
              <span className="archive-list-name">{e.name}</span>
              <span className="archive-list-note">{e.note}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/" className="archive-back">
        ← Back to portfolio
      </Link>
    </main>
    </>
  );
}
