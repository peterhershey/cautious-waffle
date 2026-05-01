import { IntroTemplate } from "../../../_deck/templates/IntroTemplate";
import { ProjectAtAGlanceTemplate } from "../../../_deck/templates/ProjectAtAGlanceTemplate";
import { QuoteTemplate } from "../../../_deck/templates/QuoteTemplate";
import { ThreeUpTemplate } from "../../../_deck/templates/ThreeUpTemplate";
import { StickyCardsTemplate } from "../../../_deck/templates/StickyCardsTemplate";
import { StrokeHeroMetric } from "../../../_deck/templates/StrokeHeroMetric";
import { MetricQuoteSplit } from "../../../_deck/templates/MetricQuoteSplit";
import { ChapterHeader } from "../../../_deck/templates/ChapterHeader";
import { MediaTextTemplate } from "../../../_deck/templates/MediaTextTemplate";
import {
  GoalTemplate,
  GoalTarget,
} from "../../../_deck/templates/GoalTemplate";
import { EmojiHeadlineTemplate } from "../../../_deck/templates/EmojiHeadlineTemplate";
import {
  TimelineSample,
  type TimelineStop,
} from "../../_shared/TimelineSample";
import type { CaseStudyDeckEntry } from "../CaseStudyDeck";

const TIMELINE_STOPS: TimelineStop[] = [
  {
    tint: "navy",
    title: "Assistant",
    date: "PRE-2024",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/ss_assistant.jpg",
      alt: "Google Assistant — the era before Gemini",
    },
  },
  {
    tint: "terracotta",
    title: "Gemini App Launch",
    date: "FEB 2024",
    images: [
      {
        src: "/portfolio%20transfer/case%20study%20live%20video/ss_gemini.png",
        alt: "Gemini app launch on iOS and Android",
      },
      {
        src: "/portfolio%20transfer/case%20study%20live%20video/ss_gemini_2.png",
        alt: "Gemini app launch — additional view",
      },
    ],
    annotations: [
      {
        position: "bl",
        text: (
          <>
            Holder of <strong>2 patents</strong> for{" "}
            <strong>screen context</strong>.
          </>
        ),
      },
      {
        position: "tr",
        text: (
          <>
            Earned a <strong>T rating</strong> for{" "}
            <strong>transformative impact</strong>.
          </>
        ),
      },
    ],
  },
  {
    tint: "mustard",
    title: "Screen Context",
    date: "MAY 2024",
    image: {
      src: "/gemini-timeline/stop-2.gif",
      alt: "Gemini Screen Context — sharing the current phone screen with Gemini",
    },
  },
  {
    tint: "mint",
    title: "Live",
    date: "AUG 2024",
    image: {
      src: "/gemini-timeline/stop-3.webp",
      alt: "Gemini Live — voice-only dark screen with waveform bloom and Hold/End controls",
    },
  },
  {
    tint: "rose",
    title: "Video Streaming",
    date: "FEB 2025",
    image: {
      src: "/gemini-timeline/stop-4.png",
      alt: "Gemini Live Video Streaming — live camera sharing with Gemini",
    },
  },
  {
    tint: "navy",
    title: "Visual Cues",
    date: "OCT 2025",
    image: {
      src: "/gemini-timeline/stop-5.gif",
      alt: "Gemini Live Visual Cues — bounding-box overlays referencing objects in frame",
    },
  },
];

const SHIPPED_ITEMS: { emoji: string; label: string }[] = [
  { emoji: "📹", label: "Gemini Live Video" },
  { emoji: "🎬", label: "Veo in Gemini" },
  { emoji: "🖼️", label: "Visual Overlays" },
  { emoji: "🎨", label: "Gemini x 4G" },
  { emoji: "💬", label: "AI Salon" },
  { emoji: "🔊", label: "Audio Overviews" },
  { emoji: "🚀", label: "Multimodal Launcher" },
  { emoji: "🐣", label: "Gemini App" },
  { emoji: "🛟", label: "Floaty + Screen Context" },
];

const NYC_EXPLORATIONS_STOPS: TimelineStop[] = [
  {
    tint: "terracotta",
    title: "Round 1",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/nyc_explorations_1.png",
      alt: "NYC exploration round 1",
    },
  },
  {
    tint: "mustard",
    title: "Round 2",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/nyc_explorations_2.png",
      alt: "NYC exploration round 2",
    },
  },
  {
    tint: "mint",
    title: "Round 3",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/nyc_explorations_3.png",
      alt: "NYC exploration round 3",
    },
  },
];

const ZRH_EXPLORATIONS_STOPS: TimelineStop[] = [
  {
    tint: "terracotta",
    title: "Icon placement and grouping",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/zrh_explorations_1.png",
      alt: "Zürich exploration — icon placement and grouping",
    },
  },
  {
    tint: "mustard",
    title: "Mic treatment",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/zrh_explorations_2.png",
      alt: "Zürich exploration — mic treatment",
    },
  },
  {
    tint: "mint",
    title: "Arrangement & Z-index",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/zrh_explorations_3.png",
      alt: "Zürich exploration — arrangement and Z-index",
    },
  },
  {
    tint: "rose",
    title: "Gel placement",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/zrh_explorations_4.png",
      alt: "Zürich exploration — gel placement",
    },
  },
  {
    tint: "navy",
    title: "Entrypoints",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/zrh_explorations_5.png",
      alt: "Zürich exploration — entrypoints",
    },
  },
];

export const teachingGeminiToSee: CaseStudyDeckEntry = {
  meta: {
    title: "Teaching Gemini to See",
    backHref: "/",
    backLabel: "← Back to portfolio",
  },
  slides: [
    {
      slug: "01",
      name: "Hero",
      content: (
        <IntroTemplate
          emoji="👁️"
          greeting={<>CASE STUDY · 2025</>}
          name={<>Teaching Gemini to See.</>}
          note="Evolving Gemini Live into a multimodal conversational product."
        />
      ),
    },
    {
      slug: "16",
      name: "Project at a glance",
      content: (
        <ProjectAtAGlanceTemplate
          eyebrow="MAIN PROJECT"
          title="Gemini Live Realtime Video Streaming"
          team="Google DeepMind · Gemini"
          timeline="Nov 2023 → Mar 2025 ship"
          platforms="iOS · Android"
          role={
            <>
              Lead UX designer, Video Streaming{" "}
              <span className="wipu-tpl-glance-aside">
                (peer split with another designer who owned screenshare)
              </span>
            </>
          }
          scope="End-to-end video streaming experience"
          uxTeam="1 UX researcher · 1 motion designer · 3 conversation designers"
          uxCollaborators="Project Astra · GenAI (advisory)"
          crossFunctional="Engineering (Gemini Live + Astra) · PM · Legal (camera/privacy) · Marketing"
          secondary={{
            eyebrow: "FOLLOW-ON",
            title: "Visual Overlays",
            fields: [
              {
                label: "Role",
                value: "Sole UX designer (DRI), limited motion + conversation design support",
              },
              { label: "Timeline", value: "Spring–Summer 2025" },
            ],
          }}
        />
      ),
    },
    {
      slug: "03",
      name: "What I shipped at Gemini",
      content: (
        <div className="wipu-cs-shipped">
          <h2 className="wipu-cs-shipped-title">
            Features I&apos;ve shipped at Gemini
          </h2>
          <ul className="wipu-cs-shipped-list">
            {SHIPPED_ITEMS.map((it) => (
              <li key={it.label} className="wipu-cs-shipped-item">
                <span className="wipu-cs-shipped-emoji" aria-hidden>
                  {it.emoji}
                </span>
                <span>{it.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      slug: "07",
      name: "From Google Assistant to Visual Overlays",
      selfContained: true,
      content: (
        <TimelineSample stops={TIMELINE_STOPS} />
      ),
    },
    {
      slug: "05",
      name: "Teach computers to talk like humans",
      content: (
        <MediaTextTemplate
          mediaSide="left"
          eyebrow="EARLY COMPUTING"
          title={
            <>
              Teach computers to talk like humans. Not the other way around.
            </>
          }
          body="For decades, using a computer meant learning its language. The promise of conversational AI is the inverse: software that meets people where they already are."
          media={{
            src: "/portfolio%20transfer/case%20study%20live%20video/punchcard-algol-fortran.jpg",
            alt: "ALGOL/FORTRAN punch card — programming the machine in its language",
          }}
        />
      ),
    },
    {
      slug: "04",
      name: "Three cities",
      content: (
        <ThreeUpTemplate
          blocks={[
            {
              eyebrow: "ACT I · NOV 2023",
              title: "New York",
              body: "Defining the real problem.",
              image: {
                src: "/portfolio%20transfer/nyc_2.png",
                alt: "New York — workshop, November 2023",
              },
            },
            {
              eyebrow: "ACT II · JAN 2025",
              title: "Zürich",
              body: "The shipping sprint.",
              image: {
                src: "/portfolio%20transfer/zrh_2.png",
                alt: "Zürich — shipping sprint, January 2025",
              },
            },
            {
              eyebrow: "ACT III · SUMMER 2025",
              title: "Mexico City",
              body: "Chasing the user signal.",
              image: {
                src: "/portfolio%20transfer/cdmx_2.png",
                alt: "Mexico City — visual overlays, summer 2025",
              },
            },
          ]}
        />
      ),
    },
    {
      slug: "ch",
      name: "Chapter · New York",
      content: (
        <ChapterHeader
          chapter="01"
          city="New York"
          date="NOVEMBER 2023"
          cityKey="nyc"
          stampDate="NOV · 2023"
        />
      ),
    },
    {
      slug: "15",
      name: "NYC · Multimodality",
      content: (
        <EmojiHeadlineTemplate
          emojis={["💁", "💬", "🧓"]}
          title={
            <>
              <strong>Multimodality</strong> is a core feature of human
              conversation.
            </>
          }
        />
      ),
    },
    {
      slug: "09",
      name: "NYC · The signal",
      content: (
        <MetricQuoteSplit
          metric={
            <StrokeHeroMetric
              number="20–30%"
              label={
                <>
                  of phone calls in the U.S.
                  <br />
                  are already video
                </>
              }
              note="Project Astra showed video input meaningfully extends session length vs. voice-only."
            />
          }
          quote={
            <>
              I feel like, I&rsquo;m looking for a certain type of heel, but I
              don&rsquo;t know what it&rsquo;s called. So that&rsquo;s why, my
              search is really vague&hellip;{" "}
              <strong>
                I have to do a lot of work to figure it out myself instead of it
                helping leading me where I might want to go.
              </strong>
            </>
          }
          attribution="Study Participant 13"
        />
      ),
    },
    {
      slug: "14",
      name: "NYC · Goal",
      content: (
        <GoalTemplate
          eyebrow="GOAL"
          emoji="🎯"
          goal={
            <>
              Design a{" "}
              <GoalTarget id="speak">
                <strong>conversational AI</strong>
              </GoalTarget>{" "}
              product that allows users to{" "}
              <GoalTarget id="remember">
                <strong>seamlessly switch</strong>
              </GoalTarget>{" "}
              between{" "}
              <GoalTarget id="see">
                <strong>modalities</strong>
              </GoalTarget>
              .
            </>
          }
          annotations={[
            {
              position: "tr",
              target: "speak",
              text: (
                <>
                  Gemini Live is a voice-first product, not a search bar. The
                  UI has to support open-ended, back-and-forth dialogue where
                  the AI remembers context across turns.
                </>
              ),
            },
            {
              position: "br",
              target: "remember",
              text: (
                <>
                  Users shouldn&apos;t have to stop, change modes, or restart.
                  Turning on the camera mid-conversation should feel as natural
                  as holding something up to a friend on a video call.
                </>
              ),
            },
            {
              position: "bl",
              target: "see",
              text: (
                <>
                  Video, voice, and text aren&apos;t three separate features.
                  They&apos;re three inputs to one conversation. The design
                  challenge is making them feel unified, not bolted together.
                </>
              ),
            },
          ]}
        />
      ),
    },
    {
      slug: "07",
      name: "NYC · Explorations",
      selfContained: true,
      content: (
        <TimelineSample stops={NYC_EXPLORATIONS_STOPS} />
      ),
    },
    {
      slug: "11",
      name: "ZRH · Prototype (Dashi)",
      selfContained: true,
      hideChrome: true,
      content: (
        <section className="wipu-sample-proto">
          <iframe
            src="/archive/prototypes/voice-chat?embed=1&doshi=1"
            title="Voice chat prototype — Dashi"
            className="wipu-sample-proto-iframe"
            loading="lazy"
            allow="autoplay; encrypted-media"
          />
        </section>
      ),
    },
    {
      slug: "ch",
      name: "Chapter · Zürich",
      content: (
        <ChapterHeader
          chapter="02"
          city="Zürich"
          date="JANUARY 2025"
          cityKey="zurich"
          stampDate="JAN · 2025"
        />
      ),
    },
    {
      slug: "15",
      name: "ZRH · The model is the product",
      content: (
        <EmojiHeadlineTemplate
          emojis={["🤖"]}
          title={
            <>
              <strong>The model</strong> is the product.
            </>
          }
        />
      ),
    },
    {
      slug: "17",
      name: "ZRH · What guided my explorations?",
      content: (
        <StickyCardsTemplate
          blocks={[
            {
              eyebrow: "01",
              title: "Latency.",
              body: "Treated as the most important constraint above all other visual considerations. Anything that slowed the model's response was rejected, regardless of how good it looked.",
              tone: "terracotta",
            },
            {
              eyebrow: "02",
              title: "UI bloat.",
              body: "The original prototype was busy. Strong instinct on the team to add affordances; my job was to push back.",
              tone: "mustard",
            },
            {
              eyebrow: "03",
              title: "Ergonomics.",
              body: "Holding a phone up to the world is awkward. The product had to make sense for someone walking around, one-handed, scanning a shelf or a plant — not framing a shot.",
              tone: "mint",
            },
          ]}
        />
      ),
    },
    {
      slug: "02",
      name: "ZRH · Pullquote",
      content: (
        <QuoteTemplate
          quote={
            <>
              &ldquo;Is video something you send, something you toggle on, or
              something that&rsquo;s just there?&rdquo;
            </>
          }
        />
      ),
    },
    {
      slug: "07",
      name: "ZRH · Explorations",
      selfContained: true,
      content: (
        <TimelineSample stops={ZRH_EXPLORATIONS_STOPS} className="is-low-titles" />
      ),
    },
    {
      slug: "11",
      name: "ZRH · Prototype",
      selfContained: true,
      hideChrome: true,
      content: (
        <section className="wipu-sample-proto">
          <iframe
            src="/archive/prototypes/voice-chat?embed=1"
            title="Voice chat prototype"
            className="wipu-sample-proto-iframe"
            loading="lazy"
            allow="autoplay; encrypted-media"
          />
        </section>
      ),
    },
    {
      slug: "09",
      name: "Week-over-week retention",
      content: (
        <StrokeHeroMetric
          number="+17%"
          label={
            <>
              Week-over-week
              <br />
              retention, causal
            </>
          }
        />
      ),
    },
    {
      slug: "10",
      name: "By the numbers",
      content: (
        <div className="wipu-sample-metrics">
          <h2 className="wipu-sample-metrics-title">By the numbers.</h2>
          <div>
            <span className="wipu-sample-metric-n" data-tone="mint">
              +13%
            </span>
            <div className="wipu-sample-metric-lbl">
              Gemini Live
              <br />
              DAU lift
            </div>
          </div>
          <div>
            <span className="wipu-sample-metric-n" data-tone="terracotta">
              97%
            </span>
            <div className="wipu-sample-metric-lbl">
              Positive-to-neutral
              <br />
              initial reactions
            </div>
          </div>
        </div>
      ),
    },
    {
      slug: "13",
      name: "Mexico City — short",
      content: (
        <figure className="wipu-sample-video is-vertical">
          <div className="wipu-sample-video-stage">
            <div
              className="wipu-sample-video-glow"
              style={{
                backgroundImage:
                  "url(https://i.ytimg.com/vi/2qT9EDkLfC0/hqdefault.jpg)",
              }}
              aria-hidden
            />
            <div className="wipu-sample-video-frame">
              <iframe
                src="https://www.youtube-nocookie.com/embed/2qT9EDkLfC0?rel=0&playsinline=1"
                title="Mexico City — YouTube short"
                className="wipu-sample-video-iframe"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <figcaption className="wipu-sample-video-title">
            From the Mexico City sprint.
          </figcaption>
        </figure>
      ),
    },
    {
      slug: "04",
      name: "Launch & visibility",
      content: (
        <ThreeUpTemplate
          blocks={[
            {
              eyebrow: "JAN 2025",
              title: "Samsung Unpacked 2025",
              body: "Shipped in time for and featured at Samsung Unpacked.",
              image: {
                src: "/portfolio%20transfer/case%20study%20live%20video/samsungunpacked.png",
                alt: "Samsung Unpacked 2025 — Gemini Live Video featured",
              },
            },
            {
              eyebrow: "MAY 2025",
              title: "Google I/O 2025",
              body: "Featured prominently at Google I/O.",
              image: {
                src: "/portfolio%20transfer/case%20study%20live%20video/googleio.png",
                alt: "Google I/O 2025 — Gemini Live Video featured",
              },
            },
            {
              eyebrow: "Q2 2025",
              title: "Samsung campaign refresh",
              body: "Hero feature of Samsung's Q2 2025 multimillion-dollar campaign refresh.",
              image: {
                src: "/portfolio%20transfer/gemini_vss_commercial_lindsaylohan.gif",
                alt: "Samsung Q2 2025 campaign — Gemini Visual Cues commercial featuring Lindsay Lohan",
              },
            },
          ]}
        />
      ),
    },
    {
      slug: "17",
      name: "Reflections",
      content: (
        <StickyCardsTemplate
          blocks={[
            {
              eyebrow: "01",
              title: "Design with the grain of the model.",
              body: "Good design here starts with a deep understanding of what the model can actually do. That understanding is what makes real restraint possible.",
              tone: "terracotta",
            },
            {
              eyebrow: "02",
              title: "Discoverability in conversational AI is unsolved.",
              body: "Invisible features need a surface to live on, but every solution on the shelf violates the minimalism that makes these products work. The tension I most want to keep pulling on.",
              tone: "mint",
            },
          ]}
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
