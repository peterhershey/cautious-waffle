import { ProjectAtAGlanceTemplate } from "../../../_deck/templates/ProjectAtAGlanceTemplate";
import { ThreeUpTemplate } from "../../../_deck/templates/ThreeUpTemplate";
import {
  GoalTemplate,
  GoalTarget,
} from "../../../_deck/templates/GoalTemplate";
import { EmojiHeadlineTemplate } from "../../../_deck/templates/EmojiHeadlineTemplate";
import { StrokeHeroMetric } from "../../../_deck/templates/StrokeHeroMetric";
import {
  MediaTextTemplate,
  type MediaTextMedia,
} from "../../../_deck/templates/MediaTextTemplate";
import { VeoHero, VeoMetricHero } from "./VeoHero";
import type { CaseStudyDeckEntry } from "../CaseStudyDeck";

const SORA_LANDSCAPE: MediaTextMedia = {
  src: "/portfolio%20transfer/veo/competitive%20landscape/251006-Sora-2-openai-aa-237-1e9e42.jpg",
  alt: "OpenAI Sora 2 announcement",
};
const VEO2_CAPABILITY: MediaTextMedia = {
  src: "/portfolio%20transfer/veo/veo2_stage.webp",
  alt: "Veo 2 — Google DeepMind's state-of-the-art video generation model",
};

export const veoInGemini: CaseStudyDeckEntry = {
  meta: {
    title: "Everyone's a Director",
    backHref: "/",
    backLabel: "← Back to portfolio",
  },
  slides: [
    {
      slug: "01",
      name: "Hero",
      content: <VeoHero />,
    },
    {
      slug: "16",
      name: "Project at a glance",
      content: (
        <ProjectAtAGlanceTemplate
          title="Veo Video Generation in Gemini"
          team="Google DeepMind · Gemini"
          timeline="Jan 2025 → Apr 2025 ship"
          platforms="iOS · Android · Web"
          scope="End-to-end video generation experience"
          role="Sole interaction designer"
          coreTeam="1 PM · 1 tPGM · 2 engineers"
          crossFunctional="Legal · Research · Marketing"
        />
      ),
    },
    {
      slug: "06",
      name: "Competitive landscape",
      content: (
        <MediaTextTemplate
          eyebrow="THE LANDSCAPE"
          title={<>The competitive landscape.</>}
          body={
            <p>
              OpenAI dominated the conversation, but the broader media-gen
              ecosystem was wide and changing fast — new players, new
              modalities, new flows shipping every month.
            </p>
          }
          media={SORA_LANDSCAPE}
          mediaSide="left"
        />
      ),
    },
    {
      slug: "06",
      name: "Capabilities",
      content: (
        <MediaTextTemplate
          eyebrow="THE MODEL"
          title={<>The capabilities.</>}
          body={
            <p>
              Inside Google DeepMind, a new video model — <strong>Veo 2</strong>{" "}
              — had moved past research into a state-of-the-art capability
              ready for a consumer surface.
            </p>
          }
          media={VEO2_CAPABILITY}
          mediaSide="right"
        />
      ),
    },
    {
      slug: "14",
      name: "Goal",
      content: (
        <GoalTemplate
          eyebrow="GOAL"
          emoji="🎯"
          goal={
            <>
              Ship the{" "}
              <GoalTarget id="best">
                <strong>world&apos;s best</strong>
              </GoalTarget>{" "}
              video gen model —{" "}
              <GoalTarget id="fast">
                <strong>fast</strong>
              </GoalTarget>
              .
            </>
          }
          annotations={[
            {
              position: "tl",
              target: "best",
              text: (
                <>
                  Veo 2 leads on motion quality, physics, and prompt adherence —
                  a genuine step change in what video gen can do.
                </>
              ),
            },
            {
              position: "br",
              target: "fast",
              text: (
                <>
                  SOTA doesn&apos;t last forever — speed to market is the
                  difference between defining the category and chasing it.
                </>
              ),
            },
          ]}
        />
      ),
    },
    {
      slug: "15",
      name: "Foundation",
      content: (
        <EmojiHeadlineTemplate
          emojis={["🏗️", "🧱"]}
          title={
            <>
              Laying a <strong>foundation</strong>
              {" "}for Gemini&apos;s media-gen framework.
            </>
          }
        />
      ),
    },
    {
      slug: "04",
      name: "What guided my explorations?",
      content: (
        <div className="wipu-sample-section">
          <h2 className="wipu-sample-section-title">
            What guided my explorations?
          </h2>
          <ThreeUpTemplate
            blocks={[
              {
                eyebrow: "01",
                title: "Understanding the landscape.",
                body: "Before touching pixels, I did independent research on the media generation space — how competitors structured their flows, what users expected from gen tools, where existing products created friction. This research directly informed the design decisions that followed.",
              },
              {
                eyebrow: "02",
                title: "Navigating technical constraints.",
                body: "Video gen has hard constraints that image gen doesn't: longer wait times, larger file sizes, more complex preview states. I worked closely with product and eng to define a product that was lean and intuitive within those constraints — not a feature-complete creative suite, but something with immediate user value.",
              },
              {
                eyebrow: "03",
                title: "Sharing as the growth engine.",
                body: "A generated video is shareable in a way a text response never will be. I designed the download / share flow as a first-class feature, not an afterthought — the path from 'I made something cool' to 'look at this' had to be near-zero friction. The data validated the bet: 34% of generations downloaded vs. 11% for image gen.",
              },
            ]}
          />
        </div>
      ),
    },
    {
      slug: "11",
      name: "Prototype",
      selfContained: true,
      hideChrome: true,
      content: (
        <section className="wipu-sample-proto">
          <iframe
            src="/archive/prototypes/video-generation?embed=1"
            title="Veo video generation prototype"
            className="wipu-sample-proto-iframe"
            loading="lazy"
            allow="autoplay; encrypted-media"
          />
        </section>
      ),
    },
    {
      slug: "09",
      name: "Hero metric",
      content: <VeoMetricHero />,
    },
    {
      slug: "10",
      name: "Launch & visibility",
      content: (
        <div className="wipu-veo-mediaMetrics" data-side="left">
          <div className="wipu-veo-mediaMetrics-text">
            <div className="wipu-sample-metrics" data-cols="auto">
              <h2 className="wipu-sample-metrics-title">Launch & visibility.</h2>
              <div>
                <span className="wipu-sample-metric-n" data-tone="mustard">
                  46%
                </span>
                <div className="wipu-sample-metric-lbl">
                  Of I/O 2025
                  <br />
                  social mentions
                </div>
              </div>
              <div>
                <span className="wipu-sample-metric-n" data-tone="mint">
                  +19%
                </span>
                <div className="wipu-sample-metric-lbl">
                  Share of voice
                  <br />
                  vs. ChatGPT
                </div>
              </div>
              <p className="wipu-sample-metrics-tagline">
                Veo dominated the conversation at I/O 2025 — taking the
                video-gen narrative back from ChatGPT&apos;s Sora.
              </p>
            </div>
          </div>
          <div className="wipu-veo-mediaMetrics-media">
            <img
              src="/portfolio%20transfer/veo/hero/7kaDt3rWZgSMERJ.webp"
              alt="Veo 2 generated video frame"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      ),
    },
    {
      slug: "10",
      name: "Adoption & engagement",
      content: (
        <div className="wipu-veo-mediaMetrics" data-side="right">
          <div className="wipu-veo-mediaMetrics-text">
            <div className="wipu-sample-metrics" data-cols="auto">
              <h2 className="wipu-sample-metrics-title">
                Adoption & engagement.
              </h2>
              <div>
                <span className="wipu-sample-metric-n" data-tone="mint">
                  +230%
                </span>
                <div className="wipu-sample-metric-lbl">
                  DAU growth,
                  <br />
                  first month
                </div>
              </div>
              <div>
                <span className="wipu-sample-metric-n" data-tone="mustard">
                  1M
                </span>
                <div className="wipu-sample-metric-lbl">
                  Highly-engaged
                  <br />
                  weekly users
                </div>
              </div>
              <div>
                <span className="wipu-sample-metric-n" data-tone="rose">
                  ~40%
                </span>
                <div className="wipu-sample-metric-lbl">
                  Day-2 return
                  <br />
                  on Veo 3
                </div>
              </div>
              <div>
                <span className="wipu-sample-metric-n" data-tone="navy">
                  20%
                </span>
                <div className="wipu-sample-metric-lbl">
                  Pro & Ultra
                  <br />
                  subscriber usage
                </div>
              </div>
            </div>
          </div>
          <div className="wipu-veo-mediaMetrics-media">
            <StrokeHeroMetric
              number="3X"
              label="more downloads than image gen"
            />
          </div>
        </div>
      ),
    },
    {
      slug: "15",
      name: "Press & user reaction",
      content: (
        <EmojiHeadlineTemplate
          emojis={["💬", "⭐", "✨"]}
          title={
            <>
              Users praised Veo 2&apos;s{" "}
              <strong>exceptional quality</strong> and intuitive{" "}
              <strong>simplicity</strong>.
            </>
          }
          note="— gUP User Insights"
        />
      ),
    },
    {
      slug: "peace",
      name: "Peace",
      content: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            fontSize: "clamp(44px, 5.5vw, 80px)",
            lineHeight: 1,
          }}
        >
          <span role="img" aria-label="Peace">
            ✌️
          </span>
        </div>
      ),
    },
  ],
};
