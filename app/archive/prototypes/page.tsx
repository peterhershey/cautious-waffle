import Link from "next/link";
import { prototypes } from "@/lib/prototypes";
import { SiteFrame } from "../../components/SiteFrame";

export default function PrototypesIndex() {
  return (
    <>
      <SiteFrame label="PROTOTYPES" scrambleKey="/archive/prototypes" />
      <main className="proto-index">
      <h1 className="proto-index-heading">Prototypes</h1>
      <p className="proto-index-lede">
        Standalone interactive sketches. Each one is a working demo of an idea
        from the portfolio — linked from the case studies where it lives.
      </p>

      <div className="proto-index-grid">
        {prototypes.map((p) => (
          <Link
            key={p.slug}
            href={`/archive/prototypes/${p.slug}`}
            className="proto-index-card"
          >
            <div className="proto-index-card-meta">
              <span>{p.year}</span>
              <span>{p.scenarios.length} scenarios</span>
            </div>
            <h2 className="proto-index-card-title">{p.title}</h2>
            <p className="proto-index-card-summary">{p.summary}</p>
          </Link>
        ))}
      </div>
    </main>
    </>
  );
}
