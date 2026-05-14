import { IntroTemplate } from "../../../_deck/templates/IntroTemplate";
import { HoverGif } from "../../../_deck/templates/HoverGif";
import { QuoteTemplate } from "../../../_deck/templates/QuoteTemplate";
import { ThreeUpTemplate } from "../../../_deck/templates/ThreeUpTemplate";
import { StickyCardsTemplate } from "../../../_deck/templates/StickyCardsTemplate";
import { StrokeHeroMetric } from "../../../_deck/templates/StrokeHeroMetric";
import { MetricQuoteSplit } from "../../../_deck/templates/MetricQuoteSplit";
import { MediaTextTemplate } from "../../../_deck/templates/MediaTextTemplate";
import {
  SectionHeader,
  type SectionHeaderItem,
} from "../../../_deck/templates/SectionHeader";
import {
  GoalTemplate,
  GoalTarget,
} from "../../../_deck/templates/GoalTemplate";
import { TypeOnText } from "../../../_deck/templates/TypeOnText";
import { EmojiHeadlineTemplate } from "../../../_deck/templates/EmojiHeadlineTemplate";
import {
  TimelineSample,
  type TimelineStop,
} from "../../_shared/TimelineSample";
import { Gel } from "../../_shared/Gel";
import {
  MultimodalCarousel,
  type MultimodalCase,
} from "../../_shared/MultimodalCarousel";
import type { CaseStudyDeckEntry } from "../CaseStudyDeck";
import { EyeAscii } from "./EyeAscii";
import {
  FortranCodingSheet,
  FortranShippedSheet,
} from "./FortranCodingSheet";

const MULTIMODAL_USE_CASES: MultimodalCase[] = [
  {
    tone: "terracotta",
    emoji: "🎨",
    category: "Creative Collaboration",
    query: "What are some ways I can make this space feel less cluttered?",
    reply: "Analyzes the space, suggests strategies, proposes ideas.",
  },
  {
    tone: "mint",
    emoji: "🪴",
    category: (
      <>
        Visual Troubleshooting &amp; Guidance
      </>
    ),
    query: "Why does my plant look so droopy?",
    reply: "Analyzes the problem, asks clarifying questions, suggests solutions.",
  },
  {
    tone: "mustard",
    emoji: "📚",
    category: (
      <>
        In-Context Learning &amp; Skill Development
      </>
    ),
    query: "What are these socks made of, and how do I wash them?",
    reply: "Analyzes visual characteristics, provides relevant explanations and actionable guidance.",
  },
];

const TIMELINE_STOPS: TimelineStop[] = [
  {
    tint: "navy",
    title: "Assistant",
    date: "PRE-2024",
    media: (
      <div className="wpd-tl-video-stage">
        <div
          className="wpd-tl-video-glow"
          aria-hidden
          style={{
            backgroundImage:
              "url(https://i.ytimg.com/vi/ARA0AxrnHdM/hqdefault.jpg)",
          }}
        />
        <div
          className="wpd-tl-video-frame"
          role="img"
          aria-label="Google Assistant launch — the era before Gemini"
        >
          <iframe
            src="https://www.youtube-nocookie.com/embed/ARA0AxrnHdM?autoplay=1&mute=1&loop=1&playlist=ARA0AxrnHdM&controls=0&rel=0&playsinline=1&modestbranding=1&showinfo=0"
            title="Google Assistant launch — the era before Gemini"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    ),
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
    annotations: [
      {
        position: "tr",
        text: (
          <>
            <strong>2 patents</strong> for{" "}
            <strong>Screen Context</strong> UI framework.
          </>
        ),
      },
    ],
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
    title: "Next?",
    media: <Gel />,
  },
];

const SECTIONS: [SectionHeaderItem, SectionHeaderItem, SectionHeaderItem] = [
  {
    num: "1",
    title: "Project Dashi",
    meta: "New York · November 2023",
  },
  {
    num: "2",
    title: "Multimodal Launcher",
    meta: "California · 2024",
  },
  {
    num: "3",
    title: "Realtime Video",
    meta: "Zürich · January 2025",
  },
];

const NYC_EXPLORATIONS_STOPS: TimelineStop[] = [
  {
    tint: "terracotta",
    title: "A focus on task-based collaboration",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/nyc_explorations_1.png",
      alt: "NYC exploration — task-based collaboration",
    },
  },
  {
    tint: "mustard",
    title: "Exploring orchestration through simultaneous input",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/nyc_explorations_2.png",
      alt: "NYC exploration — orchestration through simultaneous input",
    },
  },
  {
    tint: "mint",
    title: "An AI that proactively guides users through complex problems",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/nyc_explorations_3.png",
      alt: "NYC exploration — AI that proactively guides users",
    },
  },
];

const ZRH_EXPLORATIONS_STOPS: TimelineStop[] = [
  {
    tint: "rose",
    title: "Gel placement",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/zrh_explorations_4.png",
      alt: "Zürich exploration — gel placement",
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
    tint: "navy",
    title: "Entrypoints",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/zrh_explorations_5.png",
      alt: "Zürich exploration — entrypoints",
    },
  },
  {
    tint: "terracotta",
    title: "Icon placement and grouping",
    image: {
      src: "/portfolio%20transfer/case%20study%20live%20video/zrh_explorations_1.png",
      alt: "Zürich exploration — icon placement and grouping",
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
          emoji={<EyeAscii />}
          greeting={<>CASE STUDY · 2025</>}
          name={<>Teaching Gemini to See.</>}
          note="Evolving Gemini Live into a multimodal conversational product."
        />
      ),
    },
    {
      slug: "01b",
      name: "Hero · Coding Form",
      selfContained: true,
      content: (
        <section className="wipu-sample-slide wpd-fortran-slide" data-cs-slide-content="fortran">
          <FortranCodingSheet />
        </section>
      ),
    },
    {
      slug: "03",
      name: "What I shipped · Coding Form",
      selfContained: true,
      content: (
        <section className="wipu-sample-slide wpd-fortran-slide" data-cs-slide-content="fortran">
          <FortranShippedSheet />
        </section>
      ),
    },
    {
      slug: "05",
      name: "Teach computers to talk like humans",
      content: (
        <div className="wipu-tpl-mediatext wpd-talkhumans" data-media-side="left">
          <figure className="wipu-sample-video">
            <div className="wipu-sample-video-stage">
              <div
                className="wipu-sample-video-glow"
                style={{
                  backgroundImage:
                    "url(https://i.ytimg.com/vi/YnnGbcM-H8c/hqdefault.jpg)",
                }}
                aria-hidden
              />
              <div className="wipu-sample-video-frame">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/YnnGbcM-H8c?rel=0&playsinline=1&start=127&autoplay=1&mute=1"
                  title="Early computing — historical footage"
                  className="wipu-sample-video-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </figure>
          <div className="wipu-tpl-mediatext-text">
            <div className="wipu-tpl-mediatext-eyebrow">EARLY COMPUTING</div>
            <h2 className="wipu-tpl-mediatext-title">
              Teach computers to talk like humans. Not the other way around.
            </h2>
            <div className="wipu-tpl-mediatext-body">
              For decades, using a computer meant learning its language. The
              promise of conversational AI is the inverse: software that meets
              people where they already are.
            </div>
          </div>
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
      slug: "sec",
      name: "Section · Project Dashi",
      content: (
        <SectionHeader
          current={1}
          sections={SECTIONS}
          cityKey="nyc"
          stampCity="New York"
          stampDate="NOV · 2023"
        />
      ),
    },
    {
      slug: "15",
      name: "NYC · Multimodality",
      content: (
        <div className="wpd-multimodality">
          <QuoteTemplate
            emojis={[
              <img
                key="sundar"
                src="/assets/sundar-avatar.png"
                alt=""
                style={{ height: "1.5em", width: "auto", display: "block" }}
              />,
            ]}
            quote={
              <>
                &ldquo;What I&rsquo;m hoping for by 2024 […] we have a
                simplified product which I can interact with much more
                natural than today,{" "}
                <strong>easily switch between </strong>
                <TypeOnText>
                  <strong>
                    talking, typing, pointing it at something and asking
                    questions.
                  </strong>
                  &rdquo;
                </TypeOnText>
              </>
            }
          />
        </div>
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
              I&rsquo;m looking for a certain type of heel, but I
              don&rsquo;t know what it&rsquo;s called.{" "}
              <strong>
                I have to do a lot of work to figure it out myself
              </strong>{" "}
              instead of it helping leading me where I might want to go.
            </>
          }
          attribution="Study Participant 13"
        />
      ),
    },
    {
      slug: "08",
      name: "NYC · Multimodal use cases",
      content: (
        <div className="wpd-multimodal-uc-board">
          <div className="wpd-multimodal-uc-board-label" aria-hidden>
            <span>USE CASES · NYC</span>
            <span>Where users wanted multimodal help.</span>
          </div>
          <MultimodalCarousel cases={MULTIMODAL_USE_CASES} />
        </div>
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
      slug: "sec",
      name: "Section · Multimodal Launcher",
      content: (
        <SectionHeader
          current={2}
          sections={SECTIONS}
          cityKey="california"
          stampCity="California"
          stampDate="2024"
        />
      ),
    },
    {
      slug: "ml-initial",
      name: "Multimodal Launcher · Initial integration",
      content: (
        <div className="wpd-ml-initial">
          <MediaTextTemplate
            mediaSide="left"
            eyebrow="MULTIMODAL LAUNCHER"
            title={<>Initial integration attempt.</>}
            body="The first effort to bring camera input and image upload into the Gemini Live flow."
            media={{
              src: "/portfolio%20transfer/case%20study%20live%20video/multimodal-launcher-initial-integration.png",
              alt: "Three-screen flow showing the first attempt to bring camera capture and image upload into Gemini Live",
            }}
          />
        </div>
      ),
    },
    {
      slug: "ml-issues",
      name: "Multimodal Launcher · What didn't work",
      content: (
        <div className="wpd-ml-issues">
          <div className="wipu-tpl-mediatext" data-media-side="right">
            <div className="wipu-tpl-mediatext-text wpd-ml-issues-text">
              <div className="wpd-ml-issues-block">
                <h3 className="wpd-ml-issues-title">Increased UI complexity</h3>
                <p className="wpd-ml-issues-body">
                  The design introduced multiple fragmented states, which proved
                  confusing to users.
                </p>
              </div>
              <div className="wpd-ml-issues-block">
                <h3 className="wpd-ml-issues-title">Feature overload</h3>
                <p className="wpd-ml-issues-body">
                  Attempting to handle complex features like podcasts and legal
                  disclosures within the same interface contributed to a
                  convoluted user experience.
                </p>
              </div>
            </div>
            <div className="wipu-tpl-mediatext-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portfolio%20transfer/case%20study%20live%20video/mml.png"
                alt="Multimodal Launcher"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      slug: "ml-unpacked",
      name: "Multimodal Launcher · Samsung Unpacked",
      content: (
        <figure className="wipu-sample-video">
          <div className="wipu-sample-video-stage">
            <div
              className="wipu-sample-video-glow"
              style={{
                backgroundImage:
                  "url(https://i.ytimg.com/vi/SAWOLJRjBt0/hqdefault.jpg)",
              }}
              aria-hidden
            />
            <div className="wipu-sample-video-frame">
              <iframe
                src="https://www.youtube-nocookie.com/embed/SAWOLJRjBt0?rel=0&playsinline=1&start=291&autoplay=1&mute=1"
                title="Multimodal Launcher at Samsung Galaxy Unpacked 2025"
                className="wipu-sample-video-iframe"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <figcaption className="wipu-sample-video-title">
            Multimodal Launcher @ Samsung Galaxy Unpacked 2025
          </figcaption>
        </figure>
      ),
    },
    {
      slug: "sec",
      name: "Section · Realtime Video",
      content: (
        <SectionHeader
          current={3}
          sections={SECTIONS}
          cityKey="zurich"
          stampCity="Zürich"
          stampDate="JAN · 2025"
        />
      ),
    },
    {
      slug: "rv-learnings",
      name: "Realtime Video · Key learnings",
      content: (
        <div className="wipu-cs-learnings wipu-cs-learnings-hero">
          <div className="wipu-cs-learnings-title">
            <StrokeHeroMetric number={"What have\nwe learned?"} />
          </div>
          <ThreeUpTemplate
            blocks={[
              {
                eyebrow: "FROM PROJECT DASHI",
                title: "Friction kills the magic",
                body: "Early UXR on Dashi showed that users were highly frustrated by small frictions, such as having to tap a send button after speaking or having to manually unlock their phone. They expected to simply point and talk, with the system automatically understanding everything else.",
              },
              {
                eyebrow: "FROM MULTIMODAL LAUNCHER",
                title: "Too many concepts in one interface",
                body: "The multimodal launcher was a “trial run” that attempted to put too many concepts into one interface. This created a fragmented experience where users weren’t sure what state they were in or how to proceed to get what they want.",
              },
            ]}
          />
        </div>
      ),
    },
    {
      slug: "rv-mental-models",
      name: "Realtime Video · Mental models",
      content: (
        <ThreeUpTemplate
          variant="phone"
          blocks={[
            {
              eyebrow: "Asynchronous · Discrete · User-initiated",
              title: "Record & Send",
              body: "Snapchat, Telegram",
              image: {
                src: "/portfolio%20transfer/case%20study%20live%20video/telegram.png",
                alt: "Telegram — record and send mental model",
              },
            },
            {
              eyebrow: "Synchronous · Transactional · Momentary",
              title: "Point & Scan",
              body: "Google Lens",
              image: {
                src: "/portfolio%20transfer/case%20study%20live%20video/lens.png",
                alt: "Google Lens — point and scan mental model",
              },
            },
            {
              eyebrow: "Synchronous · Persistent · Always-on",
              title: "Continuous Stream",
              body: "FaceTime",
              image: {
                src: "/portfolio%20transfer/case%20study%20live%20video/facetime.png",
                alt: "FaceTime — continuous stream mental model",
              },
            },
          ]}
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
      slug: "zrh-socks-demo",
      name: "ZRH · Socks demo",
      content: (
        <figure
          style={{
            margin: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/portfolio%20transfer/case%20study%20live%20video/zrh-socks-demo.png"
            alt="Hand holding a phone running Gemini Live, pointed at a pile of patterned socks"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: 44,
              display: "block",
            }}
          />
        </figure>
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
      name: "By the numbers + recognition",
      content: (
        <div className="wipu-cs-numbers-awards">
          <figure className="wipu-sample-video is-vertical wipu-cs-numbers-awards-video">
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
          </figure>
          <div className="wipu-cs-numbers-awards-text">
            <div className="wipu-sample-metrics wipu-cs-numbers-awards-metrics">
              <h2 className="wipu-sample-metrics-title">In-product impact.</h2>
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
            <div className="wipu-cs-awards">
              <h3 className="wipu-cs-awards-title">External recognition.</h3>
              <p className="wipu-cs-awards-sub">
                Honored at 2025 Mobile World Congress in Barcelona.
              </p>
              <ul className="wipu-cs-awards-list">
                <li>
                  <span className="wipu-cs-awards-emoji" aria-hidden>
                    🏆
                  </span>
                  <span>
                    <strong>Android Authority</strong> Best of MWC
                  </span>
                </li>
                <li>
                  <span className="wipu-cs-awards-emoji" aria-hidden>
                    🏆
                  </span>
                  <span>
                    <strong>GLOMO</strong> Award for Breakthrough Device
                    Innovation
                  </span>
                </li>
                <li>
                  <span className="wipu-cs-awards-emoji" aria-hidden>
                    🏆
                  </span>
                  <span>
                    <strong>House of Technology</strong> Best AI Innovation of
                    MWC
                  </span>
                </li>
                <li>
                  <span className="wipu-cs-awards-emoji" aria-hidden>
                    🏆
                  </span>
                  <span>
                    <strong>Wired</strong> Top New Gadgets
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
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
            fontSize: "clamp(88px, 11vw, 160px)",
            lineHeight: 1,
          }}
        >
          <HoverGif
            src="/portfolio%20transfer/peace%20emoji%20.gif"
            alt="Peace"
          />
        </div>
      ),
    },
  ],
};
