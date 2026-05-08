/* Single source of truth for site copy.
   Edit text here; the components below read from this file.

   Consumers:
   - app/_deck/slides/index.tsx     — hero, qualifications, ai-native, ai-in-practice, empathy, cases
   - app/_deck/slides/field-notes/  — slide header + card copy
   - app/_deck/chrome/NavCorner.tsx — page nav labels
   - app/login/page.tsx             — login screen copy
*/

// ── Site-wide ─────────────────────────────────────────────────────────

export const nav = {
  pages: [
    { href: "/", label: "Home" },
    {
      href: "/case-studies/teaching-gemini-to-see",
      label: "Teaching Gemini to See",
      matchPrefix: "/case-studies/teaching-gemini-to-see",
    },
    {
      href: "/case-studies/veo-in-gemini",
      label: "Everyone's a Director",
      matchPrefix: "/case-studies/veo-in-gemini",
    },
    { href: "/templates", label: "Templates", matchPrefix: "/templates" },
    { href: "/archive", label: "Archive", matchPrefix: "/archive" },
  ],
} as const;

export const login = {
  eyebrow: "What’s Peter doing",
  title: "Enter the password to continue.",
  passwordPlaceholder: "Password",
  submit: "Continue",
  error: "That password didn’t match.",
  foot: "Private portfolio. Ask Peter for the password.",
} as const;

export const teaser = {
  eyebrow: "Protected",
  title: "The rest of this case study is password-protected.",
  passwordPlaceholder: "Password",
  submit: "Unlock",
  foot: "Ask Peter for the password.",
} as const;

// ── Deck (home page slides) ───────────────────────────────────────────

export const hero = {
  label: "HERO · 00",
  greeting: "Hi, I’m",
  name: "Peter Hershey",
  subtitle: "Senior Product Designer & Creator",
} as const;

export const qualifications = {
  label: "CAREER · 01",
  blocks: [
    {
      eyebrow: "PREVIOUSLY",
      title: "Design Lead @ The Washington Post",
      body: "Redesigned the Washington Post homepage, their first in a decade, and helped bring the product org into maturity as a digital-first operation.",
    },
    {
      eyebrow: "CURRENTLY",
      title: "Senior AI Product Designer @ Google DeepMind",
      body: "Shaping the future of human-AI interaction across voice, vision, and real-time awareness in Gemini Live.",
    },
  ],
} as const;

export const fieldNotes = {
  label: "FIELD NOTES · 03",
  header: {
    title: ["Peter’s Field Notes"],
    subtitle:
      "A running collection of things I’ve made, places I’ve been, and a few side quests.",
  },
  cards: [
    {
      title: "🎬 Videography",
      body: "I shot a documentary series in Myanmar, a fully improvised modern dance film, and travel videos from all over. I love motion, editing, and the craft of cinematography.",
    },
    {
      title: "🎨 Generative Artwork",
      body: "Real-time visuals built with TouchDesigner and diffusion pipelines. Interactive, audio-reactive, and always a little unpredictable.",
    },
    {
      title: "🌍 Travel",
      body: "Nearly fifty countries. Some for work, some for curiosity, some just to see what’s out there.",
    },
    {
      title: "💻 Product",
      body: "The day job. Designing AI experiences at Google DeepMind and, before that, redesigning how people read the news at the Washington Post.",
    },
    {
      title: "📷 Photography",
      body: "In DC I shot everything from embassy dinners to pop-ups on the National Mall. Food photography, event photography, private fundraisers on Capitol Hill.",
    },
  ],
} as const;

export const aiNative = {
  label: "AI-NATIVE · 04",
  title: "🛠️ Always building. Always curious.",
  subtitle:
    "The design field is shifting fast, and generative AI is at the center of it. I’d rather be hands-on with what’s next than watching from the sidelines.",
} as const;

export const aiInPractice = {
  label: "AI IN PRACTICE · 05",
  title: "My AI toolkit.",
  blocks: [
    {
      eyebrow: "AT WORK",
      title: "Figma, Antigravity",
      body: "End-to-end design with Figma and agentic development. From concept to high-fidelity prototype, fast.",
    },
    {
      eyebrow: "AT HOME",
      title: "Claude Code, Wispr Flow",
      body: "Rethinking my personal workflow for the AI age. Coding with Claude, dictating with Wispr, rebuilding how I work from the ground up.",
    },
    {
      eyebrow: "GENERATIVE",
      title: "TouchDesigner, ComfyUI",
      body: "Using TouchDesigner and real-time diffusion pipelines to create live, interactive generative art experiences. The wildcard in the stack.",
    },
  ],
} as const;

export const empathy = {
  label: "EMPATHY · 07",
  title: "🌍 The best design research is lived experience.",
  subtitle:
    "Nearly fifty countries, some as a tourist, some as a digital nomad. All in service of understanding how other people live. It’s the most valuable thing I bring to my design practice.",
  pressLink: {
    source: "The Washington Post · Travel",
    headline: "My Digital Nomad Visa Tips",
    url: "https://www.washingtonpost.com/travel/tips/digital-nomad-visa-tips/",
  },
  photoCaption: "Pico Cão Grande, São Tomé",
  photoAlt: "Three friends in front of Pico Cão Grande, São Tomé",
} as const;

export const closer = {
  label: "FIN · 10",
  emoji: "✌️",
} as const;

export const cases = {
  label: "CASE STUDIES · 09",
  title: "Selected work.",
  blocks: [
    {
      eyebrow: "2025 · Google DeepMind",
      title: "Teaching Gemini to See",
      body: "Evolving Gemini Live into a voice-first, multimodal experience.",
      tone: "terracotta",
      href: "/case-studies/teaching-gemini-to-see",
    },
    {
      eyebrow: "2025 · Google DeepMind",
      title: "Everyone's a Director",
      body: "Designing the interface for Veo, Google's most advanced video generation model.",
      tone: "mint",
      href: "/case-studies/veo-in-gemini",
    },
  ],
} as const;
