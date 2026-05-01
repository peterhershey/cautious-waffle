import Link from "next/link";
import { GROUPS, TEMPLATES } from "./meta";
import { SiteFrame } from "../components/SiteFrame";
import "./templates.css";

export const metadata = {
  title: "Templates — What is Peter up to?",
  description: "Master list of slide templates for the portfolio.",
};

export default function TemplatesPage() {
  return (
    <>
      <SiteFrame label="TEMPLATES" scrambleKey="/templates" />
      <main className="wipu-tpl" id="main">
        <div className="wipu-tpl-inner">
          <header className="wipu-tpl-head">
            <p className="wipu-tpl-eyebrow">Catalog · v0.1</p>
            <h1 className="wipu-tpl-title">
              Slide <em>templates</em>.
            </h1>
            <p className="wipu-tpl-lede">
              Master list of reusable layouts for the main page and case
              studies. Full reference with primitives and variants lives in{" "}
              <code>TEMPLATES.md</code> at the route root.
            </p>
            <p className="wipu-tpl-cta">
              <Link href="/templates/sample">
                See one of each in action →
              </Link>
            </p>
          </header>

          {GROUPS.map((g) => (
            <section key={g.key} className="wipu-tpl-group">
              <div className="wipu-tpl-group-head">
                <span className="wipu-tpl-group-num">{g.num}</span>
                <h2 className="wipu-tpl-group-name">{g.name}</h2>
              </div>
              <div className="wipu-tpl-grid">
                {TEMPLATES.filter((t) => t.group === g.key).map((t) => (
                  <article key={t.slug} className="wipu-tpl-card">
                    <Link
                      href={`/templates/preview/${t.slug}`}
                      className="wipu-tpl-preview"
                      aria-label={`Open ${t.name} preview`}
                    >
                      <iframe
                        src={`/templates/preview/${t.slug}`}
                        title={`${t.name} preview`}
                        className="wipu-tpl-preview-iframe"
                        loading="lazy"
                        aria-hidden="true"
                        tabIndex={-1}
                      />
                      <span
                        className="wipu-tpl-preview-shield"
                        aria-hidden="true"
                      />
                    </Link>
                    <div className="wipu-tpl-card-foot">
                      <span className="wipu-tpl-card-tag">
                        {t.slug} · {g.name}
                      </span>
                      <h3 className="wipu-tpl-card-name">{t.name}</h3>
                      <p className="wipu-tpl-use">{t.use}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <Link href="/" className="wipu-tpl-back">
            ← Back to deck
          </Link>
        </div>
      </main>
    </>
  );
}
