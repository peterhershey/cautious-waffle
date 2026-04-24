import Link from "next/link";
import { HUD } from "../components/HUD";
import { SceneEffects } from "../components/Scene";
import "./design-system.css";

export const metadata = {
  title: "Design system — What is Peter up to?",
  description:
    "Tokens and components for the whatispeterupto site. A browsable reference.",
};

type Neutral = { name: string; varName: string; hex: string; hexLight: string };
const neutrals: Neutral[] = [
  { name: "Background", varName: "--wipu-bg", hex: "#000000", hexLight: "#f1ece2" },
  { name: "Elevated", varName: "--wipu-bg-elev", hex: "#0f0f12", hexLight: "#ffffff" },
  { name: "Ink", varName: "--wipu-ink", hex: "#f2efe6", hexLight: "#15150f" },
  { name: "Ink dim", varName: "--wipu-ink-dim", hex: "#9a9690", hexLight: "#504a40" },
  { name: "Ink faint", varName: "--wipu-ink-faint", hex: "#5a5650", hexLight: "#8a8478" },
  { name: "Rule", varName: "--wipu-rule", hex: "#1e1e22", hexLight: "#d4cdbe" },
  { name: "Rule strong", varName: "--wipu-rule-strong", hex: "#2d2d33", hexLight: "#a89f8c" },
];

type Accent = { name: string; key: "terracotta" | "mint" | "mustard" | "rose" | "navy"; hex: string };
const accents: Accent[] = [
  { name: "Terracotta", key: "terracotta", hex: "#e07a52" },
  { name: "Mint", key: "mint", hex: "#8ce0a8" },
  { name: "Mustard", key: "mustard", hex: "#f2d06a" },
  { name: "Rose", key: "rose", hex: "#a3636b" },
  { name: "Navy", key: "navy", hex: "#2640e2" },
];

const sections = [
  { id: "color", num: "01", title: "Color" },
  { id: "type", num: "02", title: "Typography" },
  { id: "space", num: "03", title: "Space, radius, motion" },
  { id: "components", num: "04", title: "Components" },
  { id: "archive", num: "05", title: "Archive templates" },
  { id: "annotations", num: "06", title: "Annotations" },
];

export default function DesignSystemPage() {
  return (
    <>
      <HUD />
      <SceneEffects />
      <main className="wipu-ds" id="main">
        {/* ——— HEAD ——— */}
        <header className="wipu-ds-head">
          <p className="wipu-ds-eyebrow">Design system · v0.1</p>
          <h1 className="wipu-ds-title">
            Tokens &amp; <em>components</em>.
          </h1>
          <p className="wipu-ds-lede">
            The FigJam-board inspired visual language behind whatispeterup.to.
            Monospace type, sticky-note accents, dot-grid ground. Every token
            here is consumed directly from <code>theme.css</code>, every
            component from <code>board.css</code> — toggle the theme in the HUD
            to see both modes.
          </p>
          <nav className="wipu-ds-toc" aria-label="Design system sections">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.num} — {s.title}
              </a>
            ))}
          </nav>
        </header>

        {/* ——— 01 · COLOR ——— */}
        <section className="wipu-ds-section" id="color">
          <div className="wipu-ds-sec-head">
            <span className="wipu-ds-sec-num">01 · Color</span>
            <h2 className="wipu-ds-sec-title">Neutrals, accents, emphasis</h2>
          </div>
          <p className="wipu-ds-sec-blurb">
            Dark mode is canonical. Light mode mirrors the palette with a warm
            paper background. Accents are the five sticky-note / frame colors
            that recur across the site.
          </p>

          <h3 className="wipu-ds-subhead">Neutrals</h3>
          <div className="wipu-ds-swatches">
            {neutrals.map((c) => (
              <div key={c.varName} className="wipu-ds-swatch">
                <div
                  className="wipu-ds-swatch-chip"
                  data-ring
                  style={{ background: `var(${c.varName})` }}
                />
                <div className="wipu-ds-swatch-meta">
                  <span className="wipu-ds-swatch-name">{c.name}</span>
                  <span className="wipu-ds-swatch-var">{c.varName}</span>
                  <span className="wipu-ds-swatch-hex">
                    {c.hex} · light {c.hexLight}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="wipu-ds-subhead">Accents</h3>
          <p className="wipu-ds-sec-blurb">
            Each accent has a paired <code>-ink</code> variable — the
            foreground color to use when the accent is a full-bleed background
            (e.g. color-block slides, sticky notes, case-card callouts).
          </p>
          <div className="wipu-ds-swatches">
            {accents.map((a) => (
              <div key={a.key} className="wipu-ds-swatch is-paired">
                <div className="wipu-ds-swatch-chip" data-ring>
                  <span style={{ background: `var(--wipu-${a.key})` }} />
                  <span style={{ background: `var(--wipu-${a.key}-ink)` }} />
                </div>
                <div className="wipu-ds-swatch-meta">
                  <span className="wipu-ds-swatch-name">{a.name}</span>
                  <span className="wipu-ds-swatch-var">
                    --wipu-{a.key} / --wipu-{a.key}-ink
                  </span>
                  <span className="wipu-ds-swatch-hex">{a.hex}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="wipu-ds-subhead">Emphasis</h3>
          <div className="wipu-ds-rows">
            <div className="wipu-ds-row">
              <div className="wipu-ds-row-name">
                Blue underline
                <small>underline-emph</small>
              </div>
              <div className="wipu-ds-row-demo">
                <span style={{ fontSize: 18 }}>
                  A sentence with an{" "}
                  <span className="wipu-underline-emph">emphasized</span> phrase.
                </span>
              </div>
              <div className="wipu-ds-row-spec">
                <code>--wipu-emph</code> · #2640e2
                <br />
                2px thickness · 4px offset
              </div>
            </div>
          </div>
        </section>

        {/* ——— 02 · TYPE ——— */}
        <section className="wipu-ds-section" id="type">
          <div className="wipu-ds-sec-head">
            <span className="wipu-ds-sec-num">02 · Typography</span>
            <h2 className="wipu-ds-sec-title">IBM Plex Mono, tuned</h2>
          </div>
          <p className="wipu-ds-sec-blurb">
            One family, four weights (300 / 400 / 500 / 600). Negative letter
            spacing on display sizes, neutral on body, positive on
            uppercase labels. Italic is reserved for kickers and soft captions.
          </p>

          <div className="wipu-ds-rows">
            <TypeRow
              name="Hero greeting"
              sub="hero-row"
              demo={
                <p className="wipu-hero-row" style={{ textAlign: "left" }}>
                  <span className="wipu-hero-greet">Hi, I'm</span>
                  <span className="wipu-hero-name-big">Peter Hershey.</span>
                </p>
              }
              spec={
                <>
                  <code>.wipu-hero-row</code> · 500 · clamp(26 → 44)
                  <br />
                  <code>.wipu-hero-name-big</code> · 600 · clamp(34 → 72) · -0.02em
                </>
              }
            />
            <TypeRow
              name="Longform title"
              sub="display"
              demo={
                <h3 className="wipu-longform-title">
                  A creator, <em>before</em> anything else.
                </h3>
              }
              spec={
                <>
                  <code>.wipu-longform-title</code> · 600 · clamp(32 → 56) ·
                  -0.025em
                  <br />
                  <code>em</code> → 2px blue underline
                </>
              }
            />
            <TypeRow
              name="Kicker"
              sub="italic lede"
              demo={
                <p className="wipu-longform-kicker" style={{ margin: 0 }}>
                  A short italic lede used under long-form titles to set tone.
                </p>
              }
              spec={
                <>
                  <code>.wipu-longform-kicker</code> · 400 italic · clamp(16 → 20)
                </>
              }
            />
            <TypeRow
              name="Body"
              sub="long-form paragraph"
              demo={
                <div className="wipu-longform-body" style={{ margin: 0 }}>
                  <p>
                    Body copy sits at 15px with 1.7 line-height. Paragraphs
                    have 14px of bottom margin; the last one drops it.
                  </p>
                </div>
              }
              spec={<><code>.wipu-longform-body</code> · 15 / 1.7</>}
            />
            <TypeRow
              name="Slide label"
              sub="overline"
              demo={
                <span
                  className="wipu-slide-label"
                  style={{ position: "static", color: "var(--wipu-mustard)" }}
                >
                  02 · A creator
                </span>
              }
              spec={
                <>
                  <code>.wipu-slide-label</code> · 500 · 11px · 0.24em tracking ·
                  uppercase
                </>
              }
            />
            <TypeRow
              name="Pull number"
              sub="big stat"
              demo={
                <div className="wipu-pullnum" style={{ margin: 0 }}>
                  <span className="wipu-pullnum-n">30+</span>
                  <span className="wipu-pullnum-lbl">
                    countries
                    <br />
                    &amp; counting.
                  </span>
                </div>
              }
              spec={
                <>
                  <code>.wipu-pullnum-n</code> · 300 · clamp(72 → 180) ·
                  -0.045em
                </>
              }
            />
            <TypeRow
              name="Footnote"
              sub="captions, asides"
              demo={
                <p className="wipu-footnote" style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}>
                  Footnotes carry metadata — dates, sources, or the small
                  print you want findable but quiet.
                </p>
              }
              spec={<><code>.wipu-footnote</code> · 400 · 12px · 0.04em</>}
            />
          </div>
        </section>

        {/* ——— 03 · SPACE / RADIUS / MOTION ——— */}
        <section className="wipu-ds-section" id="space">
          <div className="wipu-ds-sec-head">
            <span className="wipu-ds-sec-num">03 · Space, radius, motion</span>
            <h2 className="wipu-ds-sec-title">The measured rhythm</h2>
          </div>

          <h3 className="wipu-ds-subhead">Radius</h3>
          <div className="wipu-ds-rows">
            <div className="wipu-ds-row">
              <div className="wipu-ds-row-name">
                Frame
                <small>cards, panels</small>
              </div>
              <div className="wipu-ds-row-demo">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "var(--wipu-bg-elev)",
                    border: "1px solid var(--wipu-rule-strong)",
                    borderRadius: "var(--wipu-frame-radius)",
                  }}
                />
              </div>
              <div className="wipu-ds-row-spec">
                <code>--wipu-frame-radius</code> · 10px
              </div>
            </div>
            <div className="wipu-ds-row">
              <div className="wipu-ds-row-name">
                Note
                <small>sticky notes</small>
              </div>
              <div className="wipu-ds-row-demo">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "var(--wipu-mustard)",
                    borderRadius: "var(--wipu-note-radius)",
                  }}
                />
              </div>
              <div className="wipu-ds-row-spec">
                <code>--wipu-note-radius</code> · 3px
              </div>
            </div>
          </div>

          <h3 className="wipu-ds-subhead">Slide rhythm</h3>
          <p className="wipu-ds-sec-blurb">
            Every slide is min-100vh, padded{" "}
            <code>96px clamp(24px, 5vw, 96px)</code>. Max content width 1080px.
            Long-form layouts use a 1.05fr / 1fr two-column grid, collapsing to
            one column at 800px.
          </p>

          <h3 className="wipu-ds-subhead">Motion</h3>
          <div className="wipu-ds-motion">
            <div className="wipu-ds-motion-card">
              <h4>Reveal on enter</h4>
              <p>
                24px rise + fade-in when <code>[data-reveal]</code> intersects
                the viewport. Sequence with <code>data-reveal-delay="1|2|3"</code>.
              </p>
              <pre>{`opacity 760ms + transform 880ms
cubic-bezier(.22, .8, .2, 1)
delays: 80 / 160 / 240 ms`}</pre>
            </div>
            <div className="wipu-ds-motion-card">
              <h4>Parallax</h4>
              <p>
                Background grid and slide labels drift at fractional rates on
                scroll. Subtle — never more than 0.06.
              </p>
              <pre>{`[data-parallax="0.05"] → translate3d
will-change: transform`}</pre>
            </div>
            <div className="wipu-ds-motion-card">
              <h4>Theme swap</h4>
              <p>
                Root background + color cross-fade when{" "}
                <code>data-theme</code> flips.
              </p>
              <pre>{`transition: 240ms ease
bg + color only`}</pre>
            </div>
            <div className="wipu-ds-motion-card">
              <h4>Reduced motion</h4>
              <p>
                All transitions collapse to 0.01ms when the user prefers
                reduced motion.
              </p>
              <pre>{`@media (prefers-reduced-motion: reduce)`}</pre>
            </div>
          </div>
        </section>

        {/* ——— 04 · COMPONENTS ——— */}
        <section className="wipu-ds-section" id="components">
          <div className="wipu-ds-sec-head">
            <span className="wipu-ds-sec-num">04 · Components</span>
            <h2 className="wipu-ds-sec-title">Building blocks</h2>
          </div>

          {/* BUTTONS */}
          <h3 className="wipu-ds-subhead">Buttons</h3>
          <p className="wipu-ds-comp-desc">
            Pill-shaped, uppercase, tracked. Ghost variant inherits
            <code>currentColor</code> so it adapts to full-bleed accent slides.
            Solid variant uses ink-on-bg for primary CTAs.
          </p>
          <div className="wipu-ds-sandbox">
            <span className="wipu-ds-sandbox-label">Example</span>
            <div className="wipu-ds-sandbox-cluster">
              <button type="button" className="wipu-btn">
                Read case →
              </button>
              <button type="button" className="wipu-btn is-solid">
                Get in touch
              </button>
            </div>
          </div>

          {/* NOTES */}
          <h3 className="wipu-ds-subhead">Sticky notes</h3>
          <p className="wipu-ds-comp-desc">
            Board artifacts. Positioned absolutely on the scatter canvas.
            Color is applied inline from the accent pair (bg + -ink fg). Size
            modifiers: <code>.is-lg</code>, <code>.is-sm</code>.
          </p>
          <div className="wipu-ds-sandbox is-board">
            <span className="wipu-ds-sandbox-label">Example · on grid</span>
            <div className="wipu-ds-sandbox-cluster">
              {accents.map((a) => (
                <div
                  key={a.key}
                  className="wipu-note"
                  style={{
                    background: `var(--wipu-${a.key})`,
                    color: `var(--wipu-${a.key}-ink)`,
                  }}
                >
                  <span className="wipu-note-kicker">Kicker</span>
                  {a.name} sticky note with a line of context.
                  <span className="wipu-note-sub">Small caption</span>
                </div>
              ))}
            </div>
          </div>

          {/* CALLOUT PILL */}
          <h3 className="wipu-ds-subhead">Callout pill</h3>
          <p className="wipu-ds-comp-desc">
            Small, rounded, colored — used as a tag that points to a board
            target (typically followed by a dashed arrow).
          </p>
          <div className="wipu-ds-sandbox is-board">
            <span className="wipu-ds-sandbox-label">Example</span>
            <div className="wipu-ds-sandbox-cluster">
              <span
                className="wipu-callout"
                style={{
                  background: "var(--wipu-mint)",
                  color: "var(--wipu-mint-ink)",
                }}
              >
                <span className="wipu-note-kicker">Homepage</span>
                Washington Post, 2019
              </span>
              <span
                className="wipu-callout"
                style={{
                  background: "var(--wipu-terracotta)",
                  color: "var(--wipu-terracotta-ink)",
                }}
              >
                <span className="wipu-note-kicker">Live video</span>
                CBS News
              </span>
            </div>
          </div>

          {/* QUOTE */}
          <h3 className="wipu-ds-subhead">Quote card</h3>
          <p className="wipu-ds-comp-desc">
            Heavier shadow, slightly larger radius. <code>.is-lg</code> for a
            headline quote.
          </p>
          <div className="wipu-ds-sandbox is-board">
            <span className="wipu-ds-sandbox-label">Example</span>
            <div className="wipu-ds-sandbox-cluster">
              <div
                className="wipu-quote is-lg"
                style={{
                  background: "var(--wipu-bg-elev)",
                  color: "var(--wipu-ink)",
                }}
              >
                Design is <em>empathy</em>. Travel is practice.
              </div>
            </div>
          </div>

          {/* STAT SCATTER */}
          <h3 className="wipu-ds-subhead">Pull-stat</h3>
          <p className="wipu-ds-comp-desc">
            Huge thin number + two-line label. Used standalone or in a scatter
            row with <code>data-indent="0–4"</code> for rhythmic offsets, and{" "}
            <code>data-accent</code> to tint the number.
          </p>
          <div className="wipu-ds-sandbox">
            <span className="wipu-ds-sandbox-label">Example · scatter</span>
            <div className="wipu-stats-scatter" style={{ margin: 0 }}>
              <div className="wipu-stat" data-indent="0" data-accent="mint">
                <span className="wipu-stat-n">750M</span>
                <span className="wipu-stat-lbl">
                  <span className="wipu-stat-lbl-pri">people reached</span>
                  <span className="wipu-stat-lbl-sub">Google DeepMind</span>
                </span>
              </div>
              <div className="wipu-stat" data-indent="2" data-accent="mustard">
                <span className="wipu-stat-n">1B</span>
                <span className="wipu-stat-lbl">
                  <span className="wipu-stat-lbl-pri">users transitioned</span>
                  <span className="wipu-stat-lbl-sub">Assistant → Gemini</span>
                </span>
              </div>
            </div>
          </div>

          {/* HERO STAT — single full-slide metric */}
          <h3 className="wipu-ds-subhead">Hero stat · single metric</h3>
          <p className="wipu-ds-comp-desc">
            When one number carries the slide. The number is rendered as
            SVG <code>&lt;text&gt;</code> so it can{" "}
            <em>stroke-draw itself on</em> — outline first (~1.9s), then the
            ink fills in. Eyebrow fades before, label fades after. Centered,
            min-height 60vh so there's real space around it. Scroll past and
            back to replay.
          </p>
          <div className="wipu-ds-sandbox is-board" style={{ padding: 0 }}>
            <span className="wipu-ds-sandbox-label">Example · full slide</span>
            <div
              className="wipu-herostat"
              data-reveal
              data-accent="mint"
            >
              <span className="wipu-herostat-eyebrow">
                Gemini Live · 2025
              </span>
              <svg
                className="wipu-herostat-num"
                viewBox="0 0 800 280"
                preserveAspectRatio="xMidYMid meet"
                aria-label="1B"
              >
                <text
                  x="400"
                  y="216"
                  textAnchor="middle"
                  className="wipu-herostat-num-text"
                >
                  1B
                </text>
              </svg>
              <p className="wipu-herostat-label">
                users transitioned from Google Assistant to Gemini
              </p>
            </div>
          </div>

          {/* LOGO STRIP */}
          <h3 className="wipu-ds-subhead">Logo strip</h3>
          <p className="wipu-ds-comp-desc">
            Inline wordmark wall above a dashed top-rule. Use{" "}
            <code>.wipu-logo-serif</code> for publications that read as serif.
          </p>
          <div className="wipu-ds-sandbox">
            <span className="wipu-ds-sandbox-label">Example</span>
            <div className="wipu-logo-strip" style={{ marginTop: 0 }}>
              <span className="wipu-logo">Google DeepMind</span>
              <span className="wipu-logo wipu-logo-serif">The Washington Post</span>
              <span className="wipu-logo">CBS News</span>
              <span className="wipu-logo">NPR</span>
              <span className="wipu-logo wipu-logo-serif">The Atlantic</span>
            </div>
          </div>

          {/* AGENDA ITEM */}
          <h3 className="wipu-ds-subhead">Agenda list</h3>
          <p className="wipu-ds-comp-desc">
            Numbered two-column list — big mustard numeral, title + muted
            subtitle. Used for section summaries.
          </p>
          <div className="wipu-ds-sandbox">
            <span className="wipu-ds-sandbox-label">Example</span>
            <ul className="wipu-agenda-list">
              <li className="wipu-agenda-item">
                <span className="wipu-agenda-num">01</span>
                <div className="wipu-agenda-body">
                  <h4 className="wipu-agenda-body-title">What I make</h4>
                  <p className="wipu-agenda-body-sub">
                    Products, patents, prototypes.
                  </p>
                </div>
              </li>
              <li className="wipu-agenda-item">
                <span className="wipu-agenda-num">02</span>
                <div className="wipu-agenda-body">
                  <h4 className="wipu-agenda-body-title">How I work</h4>
                  <p className="wipu-agenda-body-sub">
                    Travel, research, sketch, ship.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* CASE CARD */}
          <h3 className="wipu-ds-subhead">Case-study card</h3>
          <p className="wipu-ds-comp-desc">
            A tonal card with kicker, title, blurb, CTA, phone-bar motif, and a
            corner callout pill tinted to the accent.
          </p>
          <div className="wipu-ds-sandbox">
            <span className="wipu-ds-sandbox-label">Example</span>
            <div className="wipu-cases">
              <div className="wipu-cases-grid">
                <article className="wipu-case wipu-tone-mint">
                  <p className="wipu-case-label">Case · 2019</p>
                  <h3 className="wipu-case-title">Rebuilding the homepage</h3>
                  <p className="wipu-case-blurb">
                    A front page that prioritizes visual hierarchy over
                    inventory count.
                  </p>
                  <Link href="#" className="wipu-btn">
                    Read case →
                  </Link>
                  <span
                    className="wipu-case-callout"
                    style={{
                      background: "var(--wipu-mint)",
                      color: "var(--wipu-mint-ink)",
                    }}
                  >
                    ◆ Homepage
                  </span>
                  <div className="wipu-phone" aria-hidden="true">
                    <div className="wipu-phone-bar is-full" />
                    <div className="wipu-phone-bar" />
                    <div className="wipu-phone-bar" />
                    <div
                      className="wipu-phone-bar is-accent"
                      style={{ background: "var(--wipu-mint)" }}
                    />
                    <div className="wipu-phone-bar" />
                    <div className="wipu-phone-bar" />
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ——— 05 · ARCHIVE TEMPLATES ——— */}
        <section className="wipu-ds-section" id="archive">
          <div className="wipu-ds-sec-head">
            <span className="wipu-ds-sec-num">05 · Archive templates</span>
            <h2 className="wipu-ds-sec-title">The FigJam board vocabulary</h2>
          </div>
          <p className="wipu-ds-sec-blurb">
            The archive folder on the home page opens into a 3360×2380 navy
            canvas where scattered artifacts represent your work, life, and
            side-quests. Each artifact is one of these templates — pick the
            shape that fits the content, not a grid cell.
          </p>

          <div className="wipu-ds-archive-intro">
            <div className="wipu-ds-archive-stat">
              <span className="wipu-ds-archive-stat-n">14</span>
              <span className="wipu-ds-archive-stat-lbl">Template kinds</span>
            </div>
            <div className="wipu-ds-archive-stat">
              <span className="wipu-ds-archive-stat-n">3</span>
              <span className="wipu-ds-archive-stat-lbl">
                Wired to <code>FolderstuffKind</code>
              </span>
            </div>
            <div className="wipu-ds-archive-stat">
              <span className="wipu-ds-archive-stat-n">11</span>
              <span className="wipu-ds-archive-stat-lbl">
                CSS-ready, awaiting <code>kind</code> entries
              </span>
            </div>
          </div>

          <p className="wipu-ds-comp-desc">
            Every template sits inside a <code>.wipu-fs-bi</code> wrapper — the
            base card box that provides the board shadow. Background and ink
            are applied inline per instance so the same template can wear any
            accent. Sizes below are typical board-canvas dimensions; rotate ±2°
            for that pinned-up feel.
          </p>

          <div className="wipu-ds-archive-grid">

            {/* POLAROID */}
            <ArchiveItem
              title="Polaroid"
              cls=".wipu-fs-polaroid + tint"
              size="280×320"
              desc="The default artifact. Square tinted photo on paper card, kicker + label below. 5 tints — use the accent that matches the work's mood."
              stageSize="polaroid"
            >
              <div className="wipu-fs-bi wipu-fs-polaroid wipu-fs-polaroid-tint-mint">
                <div className="wipu-fs-polaroid-photo" />
                <div className="wipu-fs-polaroid-cap">
                  <span className="wipu-fs-kicker">Documentary</span>
                  <span className="wipu-fs-label">Myanmar + Thailand</span>
                </div>
              </div>
            </ArchiveItem>

            {/* IMAGE TILE (borderless) */}
            <ArchiveItem
              title="Image tile"
              cls=".wipu-fs-image + tint"
              size="200×200 typical"
              desc="Borderless tinted square. No frame, no caption — pure visual filler. Use to break up a wall of captioned polaroids and add texture. 5 tints."
              stageSize="image"
            >
              <div className="wipu-fs-bi wipu-fs-image wipu-fs-image-tint-navy" />
            </ArchiveItem>

            {/* VIDEO */}
            <ArchiveItem
              title="Video polaroid"
              cls=".wipu-fs-video"
              size="380×320"
              desc="Polaroid frame wrapping a YouTube embed. Click-through plays inline. Use for talks, keynotes, demo reels."
              stageSize="wide"
            >
              <div className="wipu-fs-bi wipu-fs-polaroid wipu-fs-video">
                <div
                  className="wipu-fs-video-frame"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 24,
                  }}
                >
                  ▶
                </div>
                <div className="wipu-fs-polaroid-cap">
                  <span className="wipu-fs-kicker">Video · 02</span>
                  <span className="wipu-fs-label">Watch ↗</span>
                </div>
              </div>
            </ArchiveItem>

            {/* NOTE */}
            <ArchiveItem
              title="Sticky note"
              cls=".wipu-fs-note"
              size="220×140"
              desc="Single-thought sticky. Bright accent background, dark ink. Pair with a callout or a polaroid it's commenting on."
              stageSize="sm"
            >
              <div
                className="wipu-fs-bi wipu-fs-note"
                style={{
                  background: "var(--wipu-mustard)",
                  color: "var(--wipu-mustard-ink)",
                }}
              >
                <span className="wipu-fs-kicker">Note · 04</span>
                <p className="wipu-fs-note-body" style={{ margin: 0 }}>
                  "The homepage is not inventory — it's a newsroom with
                  pronouns."
                </p>
              </div>
            </ArchiveItem>

            {/* QUOTE */}
            <ArchiveItem
              title="Quote"
              cls=".wipu-fs-quote"
              size="280×200"
              desc="Pull quote with attribution. Two underline variants — blue-on-mint and blue-on-mustard — mimic the press-clipping feel."
            >
              <div className="wipu-fs-bi wipu-fs-quote wipu-fs-quote-blue-on-mustard">
                <p className="wipu-fs-quote-body" style={{ margin: 0 }}>
                  Peter led the team that shipped Gemini Live to a billion
                  users.
                </p>
                <span className="wipu-fs-quote-sub">Google · 2025</span>
              </div>
            </ArchiveItem>

            {/* STAT */}
            <ArchiveItem
              title="Stat"
              cls=".wipu-fs-stat"
              size="280×140"
              desc="Big thin number + two-line label. Reach, counts, anything quantifiable. Keep it to one stat per card — let it breathe."
              stageSize="sm"
            >
              <div
                className="wipu-fs-bi wipu-fs-stat"
                style={{
                  background: "var(--wipu-bg-elev)",
                  color: "var(--wipu-ink)",
                }}
              >
                <span
                  className="wipu-fs-stat-num"
                  style={{ color: "var(--wipu-mint)" }}
                >
                  750M
                </span>
                <span className="wipu-fs-stat-lbl">
                  <span className="wipu-fs-stat-kicker">People reached</span>
                  <span className="wipu-fs-stat-sub">Google DeepMind</span>
                </span>
              </div>
            </ArchiveItem>

            {/* CALLOUT */}
            <ArchiveItem
              title="Callout pill"
              cls=".wipu-fs-callout"
              size="260×52"
              desc="Tag-like pointer. Typically followed by a dashed arrow targeting another artifact. Keep copy to 3–4 words."
              stageSize="pill"
            >
              <div
                className="wipu-fs-bi wipu-fs-callout"
                style={{
                  background: "var(--wipu-terracotta)",
                  color: "var(--wipu-terracotta-ink)",
                }}
              >
                Watch the demo →
              </div>
            </ArchiveItem>

            {/* PHONE */}
            <ArchiveItem
              title="Phone mock"
              cls=".wipu-fs-phone"
              size="220×360"
              desc="Bare device frame — paper body, black outline, stacked bars with accent rows. Use for a raw product snapshot."
              stageSize="tall"
            >
              <div className="wipu-fs-bi wipu-fs-phone">
                <span className="wipu-fs-phone-notch" />
                <span className="wipu-fs-phone-bar is-full" />
                <span className="wipu-fs-phone-bar" />
                <span className="wipu-fs-phone-bar is-short" />
                <span className="wipu-fs-phone-bar is-accent" />
                <span className="wipu-fs-phone-bar" />
                <span className="wipu-fs-phone-bar is-short" />
                <span className="wipu-fs-phone-bar" />
              </div>
            </ArchiveItem>

            {/* PHONE ANNOTATED */}
            <ArchiveItem
              title="Annotated phone"
              cls=".wipu-fs-phonea"
              size="420×440"
              desc="Navy board with centered phone + labeled pills pointing to UI regions. Dashed arrows. For a case-study moment: this is where the bet was made."
              stageSize="xl"
            >
              <div className="wipu-fs-bi wipu-fs-phonea">
                <span className="wipu-fs-phonea-kicker">
                  Gemini Live · annotation
                </span>
                <div className="wipu-fs-phonea-body">
                  <span
                    className="wipu-fs-phonea-pill"
                    style={{
                      top: 20,
                      left: 8,
                      background: "var(--wipu-mustard)",
                      color: "var(--wipu-mustard-ink)",
                    }}
                  >
                    Live state
                  </span>
                  <div
                    className="wipu-fs-phonea-phone"
                    style={{ width: 120, height: 220 }}
                  >
                    <span className="wipu-fs-phone-notch" />
                    <span className="wipu-fs-phone-bar is-full" />
                    <span className="wipu-fs-phone-bar is-accent" />
                    <span className="wipu-fs-phone-bar" />
                    <span className="wipu-fs-phone-bar is-short" />
                  </div>
                  <span
                    className="wipu-fs-phonea-pill"
                    style={{
                      bottom: 20,
                      right: 8,
                      background: "var(--wipu-mint)",
                      color: "var(--wipu-mint-ink)",
                    }}
                  >
                    Tap to speak
                  </span>
                </div>
                <p className="wipu-fs-phonea-caption">
                  One tap, one continuous conversation.
                </p>
              </div>
            </ArchiveItem>

            {/* TRIAD */}
            <ArchiveItem
              title="Triad (3-phone)"
              cls=".wipu-fs-triad"
              size="420×300"
              desc="Navy comparison strip. Three columns with tag + tiny phone + bullets each. Great for before / during / after or v1 / v2 / v3."
              stageSize="xl"
            >
              <div className="wipu-fs-bi wipu-fs-triad">
                <span className="wipu-fs-triad-kicker">
                  Evolution · 2023 → 2025
                </span>
                <div className="wipu-fs-triad-row">
                  {[
                    { tag: "Legacy", bg: "var(--wipu-rose)" },
                    { tag: "Launch", bg: "var(--wipu-mustard)" },
                    { tag: "Now", bg: "var(--wipu-mint)" },
                  ].map((c) => (
                    <div key={c.tag} className="wipu-fs-triad-col">
                      <span
                        className="wipu-fs-triad-tag"
                        style={{ background: c.bg, color: "var(--wipu-navy)" }}
                      >
                        {c.tag}
                      </span>
                      <div className="wipu-fs-triad-phone">
                        <span className="wipu-fs-phone-notch" />
                        <span className="wipu-fs-phone-bar is-accent" />
                      </div>
                      <ul className="wipu-fs-triad-bullets">
                        <li>voice</li>
                        <li>live state</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </ArchiveItem>

            {/* OVERLAP */}
            <ArchiveItem
              title="Overlap stack"
              cls=".wipu-fs-overlap"
              size="320×240"
              desc="Three cards deliberately overlapping — a numbered sequence. Use when the story is stepwise but visual order matters more than a clean list."
              relative
            >
              <div
                className="wipu-fs-bi wipu-fs-overlap"
                style={{
                  background: "var(--wipu-bg-elev)",
                  color: "var(--wipu-ink)",
                }}
              >
                <span className="wipu-fs-overlap-kicker">
                  Release · three acts
                </span>
                <div className="wipu-fs-overlap-stage">
                  {[
                    { n: "01", t: "Gather the room.", top: 0, left: 0, bg: "var(--wipu-mustard)", ink: "var(--wipu-mustard-ink)" },
                    { n: "02", t: "Name the hard part.", top: 30, left: 60, bg: "var(--wipu-mint)", ink: "var(--wipu-mint-ink)" },
                    { n: "03", t: "Ship a tiny slice.", top: 60, left: 20, bg: "var(--wipu-terracotta)", ink: "var(--wipu-terracotta-ink)" },
                  ].map((c) => (
                    <div
                      key={c.n}
                      className="wipu-fs-overlap-card"
                      style={{
                        top: c.top,
                        left: c.left,
                        minWidth: 140,
                        maxWidth: 180,
                        fontSize: 11,
                        background: c.bg,
                        color: c.ink,
                      }}
                    >
                      <span className="wipu-fs-overlap-num">{c.n}</span>
                      <span className="wipu-fs-overlap-body">{c.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ArchiveItem>

            {/* AGENDA */}
            <ArchiveItem
              title="Agenda list"
              cls=".wipu-fs-agenda"
              size="280×240"
              desc="Numbered mustard-tinted list. Use for chapter markers, roadmap entries, or a quick index of what this section of the board covers."
            >
              <div
                className="wipu-fs-bi wipu-fs-agenda"
                style={{
                  background: "var(--wipu-bg-elev)",
                  color: "var(--wipu-ink)",
                }}
              >
                <ul className="wipu-fs-agenda-list">
                  <li>
                    <span className="wipu-fs-agenda-n">01</span>
                    <span className="wipu-fs-agenda-label">Gemini Live</span>
                  </li>
                  <li>
                    <span className="wipu-fs-agenda-n">02</span>
                    <span className="wipu-fs-agenda-label">Veo 3</span>
                  </li>
                  <li>
                    <span className="wipu-fs-agenda-n">03</span>
                    <span className="wipu-fs-agenda-label">Assistant → Gemini</span>
                  </li>
                </ul>
              </div>
            </ArchiveItem>

            {/* EMOJI */}
            <ArchiveItem
              title="Emoji tile"
              cls=".wipu-fs-emoji"
              size="160×160"
              desc="Big glyph + uppercase label. Mood markers — travel, music, a joke, a souvenir. Use sparingly; they can overwhelm."
              stageSize="square"
            >
              <div
                className="wipu-fs-bi wipu-fs-emoji"
                style={{
                  background: "var(--wipu-terracotta)",
                  color: "var(--wipu-terracotta-ink)",
                }}
              >
                <span className="wipu-fs-emoji-glyph">🎻</span>
                <span className="wipu-fs-emoji-label">Age 16</span>
              </div>
            </ArchiveItem>

            {/* LOGO */}
            <ArchiveItem
              title="Wordmark card"
              cls=".wipu-fs-logo"
              size="220×140"
              desc="Paper card with serif italic wordmark. Use for publications, institutions, byline credits."
              stageSize="sm"
            >
              <div className="wipu-fs-bi wipu-fs-logo">
                The Washington Post
              </div>
            </ArchiveItem>

            {/* SHAPES */}
            <ArchiveItem
              title="Shapes"
              cls=".wipu-fs-shape-*"
              size="varies"
              desc="Decorative geometry — circle, rect, line, triangle. Fill the dead space, echo an accent. Four variants, ship as needed."
              stageSize="square"
            >
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="wipu-fs-shape-circle"
                  style={{
                    width: 56,
                    height: 56,
                    background: "var(--wipu-mint)",
                  }}
                />
                <div
                  className="wipu-fs-shape-rect"
                  style={{
                    width: 48,
                    height: 48,
                    background: "var(--wipu-mustard)",
                  }}
                />
                <div
                  className="wipu-fs-shape-triangle"
                  style={{ borderBottomColor: "var(--wipu-terracotta)" }}
                />
              </div>
            </ArchiveItem>
          </div>

          <p
            className="wipu-ds-comp-desc"
            style={{ marginTop: 24, fontStyle: "italic" }}
          >
            Eleven of these templates (everything except polaroid + video) have
            CSS ready but aren't yet wired into <code>FolderstuffKind</code> in
            <code> content.ts</code>. To add one to the archive: extend the
            union, add a render case in <code>FolderstuffRender</code>, and
            append items to <code>folderstuffItems</code>.
          </p>
        </section>

        {/* ——— 06 · ANNOTATIONS ——— */}
        <section className="wipu-ds-section" id="annotations">
          <div className="wipu-ds-sec-head">
            <span className="wipu-ds-sec-num">06 · Annotations</span>
            <h2 className="wipu-ds-sec-title">Arrows, marks, and marginalia</h2>
          </div>
          <p className="wipu-ds-sec-blurb">
            The decorative layer that makes the board feel alive — dashed
            arrows connecting artifacts, highlighter passes, washi tape,
            pushpins, rubber stamps. Classes live in{" "}
            <code>annotations.css</code>; accent via{" "}
            <code>data-tone</code>.
          </p>

          {/* SHOWCASE — arrows + artifacts composed */}
          <h3 className="wipu-ds-subhead">In composition</h3>
          <div className="wipu-ds-anno-showcase">
            <div
              style={{
                position: "absolute",
                top: 60,
                left: 60,
                width: 200,
                padding: "14px 16px",
                background: "var(--wipu-mustard)",
                color: "var(--wipu-mustard-ink)",
                borderRadius: 3,
                fontSize: 13,
                lineHeight: 1.4,
                transform: "rotate(-2deg)",
                boxShadow: "0 14px 28px rgba(0,0,0,0.28), 0 2px 0 rgba(0,0,0,0.18)",
              }}
            >
              <span className="wipu-anno-tape is-narrow" style={{ position: "absolute", top: -12, left: 20 }} data-tone="neutral" />
              The{" "}
              <span className="wipu-anno-circle-wrap">
                live state
                <svg className="wipu-anno-circle" viewBox="0 0 120 40" preserveAspectRatio="none">
                  <path d="M 6 22 Q 10 6, 60 5 T 114 20 Q 118 34, 70 36 T 8 24 Q 4 18, 10 14" />
                </svg>
              </span>{" "}
              is the whole pitch.
            </div>

            <svg
              className="wipu-anno-arrow"
              style={{ top: 100, left: 270, width: 180, height: 140 }}
              viewBox="0 0 180 140"
              data-tone="emph"
            >
              <path className="line" d="M 8 20 Q 90 10, 120 90" />
              <path className="head" d="M 123 74 L 120 90 L 108 80" />
            </svg>

            <div
              style={{
                position: "absolute",
                top: 220,
                left: 420,
                fontSize: 18,
                maxWidth: 280,
                lineHeight: 1.4,
                color: "var(--wipu-ink)",
              }}
            >
              Gemini Live ships to{" "}
              <span className="wipu-anno-mark">1B users</span> — one tap, one
              continuous conversation.
            </div>

            <span
              className="wipu-anno-stamp"
              style={{ position: "absolute", top: 40, right: 60 }}
              data-tone="terracotta"
            >
              Ships 2025
            </span>

            <span
              className="wipu-anno-label"
              style={{ position: "absolute", top: 280, left: 140 }}
              data-tone="ink"
            >
              <span className="glyph">↖</span> the bet that paid off
            </span>

            <span
              className="wipu-anno-pin is-lg"
              style={{ position: "absolute", top: 24, left: 72 }}
              data-tone="terracotta"
            />
          </div>

          <h3 className="wipu-ds-subhead">Individual elements</h3>
          <div className="wipu-ds-anno-grid">
            {/* 1. DASHED ARROW */}
            <AnnoItem
              title="Dashed arrow"
              cls=".wipu-anno-arrow"
              desc="SVG path — dashed body, solid head. Connect any two artifacts. Supports data-tone, is-solid, is-heavy."
            >
              <svg
                className="wipu-anno-arrow"
                style={{ position: "relative", width: 200, height: 80 }}
                viewBox="0 0 200 80"
              >
                <path className="line" d="M 8 60 Q 80 0, 180 28" />
                <path className="head" d="M 169 17 L 180 28 L 165 32" />
              </svg>
            </AnnoItem>

            {/* 2. HIGHLIGHTER */}
            <AnnoItem
              title="Highlighter mark"
              cls=".wipu-anno-mark"
              desc="Inline semi-transparent band behind text — slight skew for a hand-marker feel. Tones: mustard (default), mint, terracotta, rose, emph."
            >
              <p style={{ fontSize: 16, lineHeight: 1.5, color: "var(--wipu-ink)", margin: 0, textAlign: "center" }}>
                The homepage is not{" "}
                <span className="wipu-anno-mark" data-tone="mint">inventory</span>{" "}
                — it's a{" "}
                <span className="wipu-anno-mark">newsroom</span>.
              </p>
            </AnnoItem>

            {/* 3. WASHI TAPE */}
            <AnnoItem
              title="Washi tape"
              cls=".wipu-anno-tape"
              desc="Diagonal-striped strip, soft torn edges. Drop over a card corner to suggest it's taped to the board. Five tones, three widths."
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
                <span className="wipu-anno-tape" />
                <span className="wipu-anno-tape is-wide is-tilt-right" data-tone="mint" />
                <span className="wipu-anno-tape is-narrow" data-tone="rose" />
              </div>
            </AnnoItem>

            {/* 4. PUSH PIN */}
            <AnnoItem
              title="Push pin"
              cls=".wipu-anno-pin"
              desc="Radial-gradient dot with a glint. Place in the corner of a note or polaroid. Five tones, two sizes."
            >
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span className="wipu-anno-pin" />
                <span className="wipu-anno-pin is-lg" data-tone="mint" />
                <span className="wipu-anno-pin" data-tone="mustard" />
                <span className="wipu-anno-pin is-lg" data-tone="navy" />
                <span className="wipu-anno-pin" data-tone="rose" />
              </div>
            </AnnoItem>

            {/* 5. STAMP */}
            <AnnoItem
              title="Stamp"
              cls=".wipu-anno-stamp"
              desc="Rubber-stamp badge — thick border, tracked caps, 8° rotation. Use for status markers: SHIPPED, WIP, AGE 16. Variants: is-round."
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
                <span className="wipu-anno-stamp">Shipped 2025</span>
                <span className="wipu-anno-stamp is-round" data-tone="mint">WIP</span>
              </div>
            </AnnoItem>

            {/* 6. SCRIBBLE */}
            <AnnoItem
              title="Scribble"
              cls=".wipu-anno-scribble"
              desc="Hand-drawn asterisk — three crossed strokes with rounded caps. Emphasis mark for something that deserves a closer look."
            >
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <svg className="wipu-anno-scribble" width="40" height="40" viewBox="0 0 40 40" data-tone="emph">
                  <line x1="20" y1="4" x2="20" y2="36" />
                  <line x1="6" y1="12" x2="34" y2="28" />
                  <line x1="6" y1="28" x2="34" y2="12" />
                </svg>
                <svg className="wipu-anno-scribble" width="40" height="40" viewBox="0 0 40 40" data-tone="terracotta">
                  <path d="M 4 20 L 36 20 M 20 4 L 20 36 M 10 10 L 30 30 M 10 30 L 30 10" />
                </svg>
                <svg className="wipu-anno-scribble" width="40" height="40" viewBox="0 0 40 40" data-tone="mustard">
                  <path d="M 20 4 L 24 16 L 36 18 L 27 26 L 30 38 L 20 31 L 10 38 L 13 26 L 4 18 L 16 16 Z" />
                </svg>
              </div>
            </AnnoItem>

            {/* 7. MARKER CIRCLE */}
            <AnnoItem
              title="Marker circle"
              cls=".wipu-anno-circle"
              desc="Rough hand-drawn oval around a target word. Wrap the word in .wipu-anno-circle-wrap and drop in an SVG with the sketchy path."
            >
              <p style={{ fontSize: 18, color: "var(--wipu-ink)", margin: 0, textAlign: "center" }}>
                The part that{" "}
                <span className="wipu-anno-circle-wrap">
                  matters
                  <svg className="wipu-anno-circle" viewBox="0 0 120 40" preserveAspectRatio="none">
                    <path d="M 6 22 Q 10 6, 60 5 T 114 20 Q 118 34, 70 36 T 8 24 Q 4 18, 10 14" />
                  </svg>
                </span>.
              </p>
            </AnnoItem>

            {/* 8. ANNOTATION LABEL */}
            <AnnoItem
              title="Annotation label"
              cls=".wipu-anno-label"
              desc="Italic mono caption + directional glyph (↖ ↗ ↘ ↙ → ←). The marginalia voice — short aside, quiet color."
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span className="wipu-anno-label">
                  <span className="glyph">↖</span> tap to speak
                </span>
                <span className="wipu-anno-label" data-tone="ink">
                  <span className="glyph">→</span> this is where the bet was made
                </span>
                <span className="wipu-anno-label">
                  <span className="glyph">↘</span> press here if stuck
                </span>
              </div>
            </AnnoItem>
          </div>

          <p
            className="wipu-ds-comp-desc"
            style={{ marginTop: 24, fontStyle: "italic" }}
          >
            Annotations are composition helpers — they exist to point, group,
            emphasize, or pin things down. If an artifact could stand alone,
            skip the annotation; if it needs a reader's eye held for a beat,
            reach for one of these.
          </p>
        </section>

        <nav className="wipu-ds-footer" aria-label="Design system footer">
          <Link href="/whatispeterupto">← Back to site</Link>
          <span>v0.1 · living doc</span>
        </nav>
      </main>
    </>
  );
}

function TypeRow({
  name,
  sub,
  demo,
  spec,
}: {
  name: string;
  sub: string;
  demo: React.ReactNode;
  spec: React.ReactNode;
}) {
  return (
    <div className="wipu-ds-row">
      <div className="wipu-ds-row-name">
        {name}
        <small>{sub}</small>
      </div>
      <div className="wipu-ds-row-demo">{demo}</div>
      <div className="wipu-ds-row-spec">{spec}</div>
    </div>
  );
}

function AnnoItem({
  title,
  cls,
  desc,
  children,
}: {
  title: string;
  cls: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="wipu-ds-anno-item">
      <div className="wipu-ds-anno-stage">{children}</div>
      <div className="wipu-ds-anno-meta">
        <div className="wipu-ds-anno-name">
          <span className="wipu-ds-anno-name-title">{title}</span>
          <span className="wipu-ds-anno-name-class">{cls}</span>
        </div>
        <p className="wipu-ds-anno-desc">{desc}</p>
      </div>
    </div>
  );
}

function ArchiveItem({
  title,
  cls,
  size,
  desc,
  stageSize,
  relative,
  children,
}: {
  title: string;
  cls: string;
  size: string;
  desc: string;
  stageSize?: "sm" | "wide" | "tall" | "xl" | "pill" | "square" | "polaroid" | "image";
  relative?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="wipu-ds-archive-item">
      <div
        className={`wipu-ds-archive-stage${relative ? " is-relative" : ""}`}
        data-size={stageSize}
      >
        {children}
      </div>
      <div className="wipu-ds-archive-meta">
        <div className="wipu-ds-archive-name">
          <span className="wipu-ds-archive-name-title">{title}</span>
          <span className="wipu-ds-archive-name-class">{size}</span>
        </div>
        <p className="wipu-ds-archive-desc">
          <code>{cls}</code> — {desc}
        </p>
      </div>
    </div>
  );
}
