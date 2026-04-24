"use client";

import { useState } from "react";
import Masthead from "./Masthead";
import ControlsPanel from "./ControlsPanel";
import LeftRail from "./LeftRail";
import HeroStandard from "../_modules/HeroStandard";
import HeroFeature from "../_modules/HeroFeature";
import HeroBreaking from "../_modules/HeroBreaking";
import Band from "../_modules/Band";
import BandInvestigation from "../_modules/BandInvestigation";
import TickerStrip from "../_modules/TickerStrip";
import LiveUpdatesBlock from "../_modules/LiveUpdatesBlock";
import BriefsList from "../_modules/BriefsList";
import OpinionsBand from "../_modules/OpinionsBand";
import {
  MarqueeStrip1996,
  UnderConstruction1996,
  Footer1996,
  AdSlot2004,
  NewsletterSignup2014,
} from "./EraChrome";
import { EDITIONS, DEFAULT_EDITION, type Block } from "@/lib/editions";
import { ERAS, DEFAULT_ERA } from "@/lib/eras";
import { getStory } from "@/lib/corpus";

function RowBlock({
  weights,
  children,
  keyPrefix,
}: {
  weights?: number[];
  children: Block[];
  keyPrefix: string;
}) {
  const cols = (weights ?? children.map(() => 1)).map((w) => `${w}fr`).join(" ");
  return (
    <div
      style={{ display: "grid", gap: 32, gridTemplateColumns: "1fr", alignItems: "start" }}
      className="news-row"
    >
      {children.map((c, i) => (
        <div key={`${keyPrefix}-${i}`}>{renderBlock(c, `${keyPrefix}-${i}`)}</div>
      ))}
      <style>{`@media (min-width: 1024px) { .news-row { grid-template-columns: ${cols} !important; gap: 40px; } }`}</style>
    </div>
  );
}

function renderBlock(block: Block, key: string): React.ReactNode {
  switch (block.kind) {
    case "hero-standard":
      return <HeroStandard key={key} ledeId={block.ledeId} secondaryIds={block.secondaryIds} opinionIds={block.opinionIds} />;
    case "hero-feature":
      return <HeroFeature key={key} featureId={block.featureId} briefIds={block.briefIds} opinionIds={block.opinionIds} />;
    case "hero-breaking":
      return <HeroBreaking key={key} ledeId={block.ledeId} secondaryIds={block.secondaryIds} updates={block.updates} />;
    case "ticker":
      return <TickerStrip key={key} items={block.items} tone={block.tone} />;
    case "live-updates":
      return <LiveUpdatesBlock key={key} title={block.title} items={block.items} />;
    case "band":
      return (
        <Band
          key={key}
          title={block.title}
          variant={block.variant}
          leadId={block.leadId}
          secondaryIds={block.secondaryIds}
          tailIds={block.tailIds}
        />
      );
    case "band-investigation":
      return <BandInvestigation key={key} title={block.title} storyId={block.storyId} />;
    case "briefs":
      return <BriefsList key={key} title={block.title} storyIds={block.storyIds} />;
    case "opinions":
      return <OpinionsBand key={key} opinionIds={block.opinionIds} />;
    case "row":
      return (
        <RowBlock key={key} keyPrefix={key} weights={block.weights}>
          {block.children}
        </RowBlock>
      );
  }
}

function extractHeadlines(blocks: Block[]): string[] {
  const out: string[] = [];
  for (const b of blocks) {
    if (out.length >= 6) break;
    if (b.kind === "hero-standard" || b.kind === "hero-breaking") out.push(getStory(b.ledeId).headline);
    else if (b.kind === "hero-feature") out.push(getStory(b.featureId).headline);
    else if (b.kind === "band") out.push(getStory(b.leadId).headline);
    else if (b.kind === "band-investigation") out.push(getStory(b.storyId).headline);
    else if (b.kind === "ticker") out.push(b.items.join(" · "));
  }
  return out;
}

export default function NewsShell() {
  const [editionId, setEditionId] = useState(DEFAULT_EDITION);
  const [eraId, setEraId] = useState(DEFAULT_ERA);
  const edition = EDITIONS[editionId];
  const era = ERAS[eraId];

  const showLeftRail = era.year === "1996";
  const headlines = extractHeadlines(edition.blocks);

  // Era-aware block stream with injected chrome
  const rendered: React.ReactNode[] = [];
  edition.blocks.forEach((b, i) => {
    rendered.push(renderBlock(b, `${editionId}-${i}`));

    // 2004 ADVERTISEMENT slot after the 1st and 3rd blocks
    if (era.year === "2004" && (i === 0 || i === 2)) {
      rendered.push(<AdSlot2004 key={`ad-${editionId}-${i}`} />);
    }
    // 1996 Under Construction strip once mid-page
    if (era.year === "1996" && i === 1) {
      rendered.push(<UnderConstruction1996 key={`uc-${editionId}-${i}`} />);
    }
    // 2014 Newsletter signup once mid-page
    if (era.year === "2014" && i === 2) {
      rendered.push(<NewsletterSignup2014 key={`nl-${editionId}-${i}`} />);
    }
  });

  const mainContent = (
    <div className="era-main">
      <Masthead dateline={edition.dateline} era={era.year} />
      {era.year === "1996" && <MarqueeStrip1996 headlines={headlines} />}
      <main className="news-container" style={{ paddingBottom: 140 }}>
        {rendered}

        {era.year === "1996" ? (
          <Footer1996 seed={editionId} />
        ) : (
          <footer
            style={{
              borderTop: "2px solid var(--ink)",
              marginTop: 40,
              paddingTop: 20,
            }}
            className="news-footer news-meta flex flex-wrap items-center justify-between gap-3"
          >
            <span className="news-wordmark" style={{ fontSize: 22 }}>
              The National Ledger
            </span>
            <span>© {era.year} · Mock edition · Built by Peter Hershey</span>
          </footer>
        )}
      </main>
    </div>
  );

  return (
    <div data-era={era.year} className="news-era">
      {era.year === "2004" && (
        <div className="era2004-visitor-bar">
          Welcome to The National Ledger Online — Best viewed at 1024×768 ·
          Visitor #00{Math.floor(100000 + editionId * 7919).toString()}
        </div>
      )}
      {era.year === "1996" && (
        <div className="era1996-topbar">
          <a href="#">home</a> | <a href="#">news</a> | <a href="#">search</a> |
          <a href="#"> help</a>
        </div>
      )}

      <div className="era-layout">
        {showLeftRail && <LeftRail dateline={edition.dateline} />}
        {mainContent}
      </div>

      <ControlsPanel
        intensity={editionId}
        onIntensityChange={setEditionId}
        era={eraId}
        onEraChange={setEraId}
      />
    </div>
  );
}
