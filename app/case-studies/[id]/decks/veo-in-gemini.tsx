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
import {
  TimelineSample,
  type TimelineStop,
} from "../../_shared/TimelineSample";
import { VeoHero, VeoMetricHero, VeoGlanceField } from "./VeoHero";
import { VeoFlowchart } from "./VeoFlowchart";
import { PrototypeEmbed } from "../../_shared/PrototypeEmbed";
import type { CaseStudyDeckEntry } from "../CaseStudyDeck";

const SORA_LANDSCAPE: MediaTextMedia = {
  src: "/portfolio%20transfer/veo/competitive%20landscape/251006-Sora-2-openai-aa-237-1e9e42.jpg",
  alt: "OpenAI Sora 2 announcement",
};
const VEO2_CAPABILITY: MediaTextMedia = {
  src: "/portfolio%20transfer/veo/veo2_stage.webp",
  alt: "Veo 2 — Google DeepMind's state-of-the-art video generation model",
};
const CREATIVE_PARTNER_STOPS: TimelineStop[] = [
  {
    tint: "terracotta",
    title: "Centralized hub for media gen in Gemini",
    image: {
      src: "/portfolio%20transfer/veo/creative%20partner/crpa_mediahub.png",
      alt: "Creative Partner — centralized media-gen hub in Gemini",
    },
  },
  {
    tint: "mustard",
    title: "New frameworks for interacting with images",
    images: [
      {
        src: "/portfolio%20transfer/veo/creative%20partner/crpa_swap_cinematic.mp4",
        alt: "Swap face — recasting a generated character within the scene",
      },
      {
        src: "/portfolio%20transfer/veo/creative%20partner/crpa_swap_closeup.mp4",
        alt: "Swap character — high-fidelity close-up of an in-place character swap",
      },
    ],
  },
  {
    tint: "mint",
    title: "Where we landed",
    image: {
      src: "/portfolio%20transfer/veo/creative%20partner/crpa_finalproduct.png",
      alt: "Creative Partner — where we landed",
    },
  },
];

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
        <VeoGlanceField>
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
        </VeoGlanceField>
      ),
    },
    {
      slug: "crpa-intro",
      name: "Creative partner · Framing",
      content: (
        <EmojiHeadlineTemplate
          emojis={["🤠"]}
          staticLead={<>What does it look like for Gemini to be a{" "}</>}
          title={<strong>creative partner?</strong>}
        />
      ),
    },
    {
      slug: "11",
      name: "Prototype · Image editing",
      selfContained: true,
      hideChrome: true,
      content: <PrototypeEmbed slug="image-editing" />,
    },
    {
      slug: "crpa",
      name: "Creative Partner",
      selfContained: true,
      content: <TimelineSample stops={CREATIVE_PARTNER_STOPS} />,
    },
    {
      slug: "pivot",
      name: "The Pivot · Divider",
      content: (
        <EmojiHeadlineTemplate
          emojis={["🔀"]}
          title={
            <>
              <strong>The Pivot.</strong>
            </>
          }
        />
      ),
    },
    {
      slug: "06",
      name: "Landscape & model",
      content: (
        <div className="wipu-veo-twoup">
          <div className="wipu-veo-twoup-col">
            <figure className="wipu-tpl-mediatext-media wipu-veo-twoup-well">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SORA_LANDSCAPE.src}
                alt={SORA_LANDSCAPE.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="wipu-tpl-mediatext-text">
              <div className="wipu-tpl-mediatext-eyebrow">THE LANDSCAPE</div>
              <h2 className="wipu-tpl-mediatext-title">
                The competitive landscape.
              </h2>
              <div className="wipu-tpl-mediatext-body">
                <p>
                  OpenAI dominated the conversation, but the broader media-gen
                  ecosystem was wide and changing fast — new players, new
                  modalities, new flows shipping every month.
                </p>
              </div>
            </div>
          </div>
          <div className="wipu-veo-twoup-col">
            <figure className="wipu-tpl-mediatext-media wipu-veo-twoup-well">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={VEO2_CAPABILITY.src}
                alt={VEO2_CAPABILITY.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="wipu-tpl-mediatext-text">
              <div className="wipu-tpl-mediatext-eyebrow">THE MODEL</div>
              <h2 className="wipu-tpl-mediatext-title">The capabilities.</h2>
              <div className="wipu-tpl-mediatext-body">
                <p>
                  Inside Google DeepMind, a new video model —{" "}
                  <strong>Veo 2</strong> — had moved past research into a
                  state-of-the-art capability ready for a consumer surface.
                </p>
              </div>
            </div>
          </div>
        </div>
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
              <GoalTarget id="fast">
                <strong>Move fast</strong>
              </GoalTarget>{" "}
              to make{" "}
              <GoalTarget id="best">
                <strong>state of the art</strong>
              </GoalTarget>{" "}
              video generation a{" "}
              <GoalTarget id="native">
                <strong>native capability</strong>
              </GoalTarget>{" "}
              in the Gemini app.
            </>
          }
          annotations={[
            {
              position: "tl",
              target: "fast",
              text: (
                <>
                  SOTA doesn&apos;t last forever — speed to market is the
                  difference between defining the category and chasing it.
                </>
              ),
            },
            {
              position: "br",
              target: "best",
              text: (
                <>
                  Veo 2 leads on motion quality, physics, and prompt adherence —
                  a genuine step change in what video generation can do.
                </>
              ),
            },
            {
              position: "bl",
              target: "native",
              text: (
                <>
                  Not a bolted-on tool — generation has to fold seamlessly into
                  the app&apos;s conversational framework.
                </>
              ),
            },
          ]}
        />
      ),
    },
    {
      slug: "06",
      name: "User flow",
      selfContained: true,
      content: <VeoFlowchart />,
    },
    {
      slug: "04",
      name: "What's guiding the process?",
      content: (
        <div className="wipu-sample-section">
          <h2 className="wipu-sample-section-title">
            What&apos;s guiding the process?
          </h2>
          <ThreeUpTemplate
            blocks={[
              {
                eyebrow: "01",
                title: "Video gen tools skew more experimental.",
                body: "The existing landscape leans novelty over utility — impressive demos wrapped in flows that assume you're here to play, not to make something you'll actually keep. That gap is the opening: design for immediate, practical value instead of spectacle.",
              },
              {
                eyebrow: "02",
                title: "Laying the groundwork for Gemini's mediagen framework.",
                body: "Veo isn't a one-off feature — it's the first surface of a broader media-generation system. The patterns I set here (preview states, generation controls, the generate → refine → share loop) have to hold up as image, video, and whatever comes next converge on one framework.",
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
      slug: "dealbreakers",
      name: "Dealbreakers",
      content: (
        <EmojiHeadlineTemplate
          emojis={["🚀", "⛔"]}
          title={
            <>
              Moving at speed means deciding your{" "}
              <strong>dealbreakers</strong>.
            </>
          }
        />
      ),
    },
    {
      slug: "11",
      name: "Prototype",
      selfContained: true,
      hideChrome: true,
      content: <PrototypeEmbed slug="video-generation" />,
    },
    {
      slug: "results",
      name: "The results · Divider",
      content: (
        <EmojiHeadlineTemplate
          emojis={["📈"]}
          title={
            <>
              <strong>The results.</strong>
            </>
          }
        />
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
          staticLead={<>Users praised Veo 2&apos;s{" "}</>}
          title={<strong>exceptional quality and intuitive simplicity.</strong>}
          note="— gUP User Insights"
        />
      ),
    },
    {
      slug: "thanks",
      name: "Thank you",
      content: (
        <EmojiHeadlineTemplate
          className="is-small"
          emojis={["✌️"]}
          title={<strong>Thank you.</strong>}
        />
      ),
    },
  ],
};
