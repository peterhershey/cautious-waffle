"use client";

/* User-flow flowchart for the Veo / Gemini case study.
   Standard flow-diagram conventions: pill = terminal, rect = process,
   diamond = decision. Whole graph renders dim by default; hovering a
   node lights it (and the edges touching it) to its tone — white for
   the primary path, mint for success, mustard for the disambiguate
   cycle, rose for failure, navy for the terminal punt.

   Submit is the gravitational center of the experience, so it ships
   as a filled mustard "primary" node — the one shape that's saturated
   even at rest. The disambiguate cycle to its right (clear → suggest →
   clarify → submit) is the friction loop users get stuck in: those
   three edges animate with a marching dash so the cycle visibly
   churns even when nothing is hovered. */

import { useState, type ReactNode } from "react";

type NodeKind = "terminal" | "process" | "decision";
type Tone = "default" | "success" | "refine" | "failure" | "punt";

type FlowNode = {
  id: string;
  kind: NodeKind;
  tone?: Tone;
  cx: number;
  cy: number;
  w: number;
  h: number;
  label: ReactNode;
  /** Decision shapes get a smaller foreignObject so the diamond's
      diagonal edges don't clip the text — independent x/y/w/h. */
  textBox?: { x: number; y: number; w: number; h: number };
  /** Marks Submit as the primary CTA — filled mustard at rest. */
  primary?: boolean;
};

type FlowEdge = {
  id: string;
  from: string;
  to: string;
  d: string;
  tone?: Tone;
  /** Loop-back edges render dashed and stay extra dim until hovered. */
  loop?: boolean;
  /** Cycle edges animate (marching dash) to show the disambiguate
      loop as an active churn that users get stuck in. */
  cycle?: boolean;
  label?: { x: number; y: number; text: string };
};

const NODES: FlowNode[] = [
  // Linear input flow — straight vertical down the center column.
  { id: "discovery", kind: "terminal", cx: 560, cy: 70, w: 180, h: 44, label: "Discovery" },
  { id: "intent", kind: "process", cx: 560, cy: 150, w: 200, h: 44, label: "Initial intent" },
  { id: "prompt", kind: "process", cx: 560, cy: 230, w: 220, h: 44, label: "Compose prompt" },
  // Submit — the primary CTA. Bigger box, filled mustard at rest.
  {
    id: "submit",
    kind: "process",
    cx: 560,
    cy: 315,
    w: 220,
    h: 56,
    label: "Submit",
    primary: true,
  },
  // First decision: clear enough to send, or does it need disambiguation?
  {
    id: "clear",
    kind: "decision",
    tone: "refine",
    cx: 560,
    cy: 415,
    w: 240,
    h: 96,
    label: "Clear & specific?",
    textBox: { x: 470, y: 395, w: 180, h: 40 },
  },
  // The disambiguate cycle — system asks for clarification, user clarifies,
  // user resubmits. Two stops on the right that loop back into Submit.
  {
    id: "suggest",
    kind: "process",
    tone: "refine",
    cx: 880,
    cy: 415,
    w: 220,
    h: 44,
    label: "Suggest clarifications",
  },
  {
    id: "clarify",
    kind: "process",
    tone: "refine",
    cx: 880,
    cy: 315,
    w: 220,
    h: 44,
    label: "User clarifies prompt",
  },
  // Generation phase — the latency-heavy black box.
  { id: "generate", kind: "process", cx: 560, cy: 525, w: 240, h: 44, label: "Generate (latency)" },
  // While generating, users either stay in the app or background it and
  // come back to a push notification. Both routes converge into Fulfilled.
  {
    id: "wait_choice",
    kind: "decision",
    cx: 560,
    cy: 615,
    w: 220,
    h: 80,
    label: "Stay or leave?",
    textBox: { x: 480, y: 595, w: 160, h: 40 },
  },
  { id: "wait", kind: "process", cx: 380, cy: 720, w: 200, h: 44, label: "Wait in app" },
  { id: "background", kind: "process", cx: 740, cy: 720, w: 200, h: 44, label: "Background app" },
  { id: "notify", kind: "process", cx: 740, cy: 800, w: 220, h: 44, label: "Push notify · return" },
  // Outcome decision — pushed down to leave room for the wait/leave fork.
  {
    id: "fulfilled",
    kind: "decision",
    cx: 560,
    cy: 900,
    w: 220,
    h: 90,
    label: "Fulfilled?",
    textBox: { x: 490, y: 880, w: 140, h: 40 },
  },
  // Success branch — show, then save / share / regen.
  { id: "show", kind: "process", tone: "success", cx: 240, cy: 1000, w: 220, h: 44, label: "Show video" },
  { id: "save", kind: "terminal", tone: "success", cx: 240, cy: 1080, w: 220, h: 44, label: "Save · Share · Regen" },
  // Failure branch — diagnose what went wrong.
  { id: "diagnose", kind: "process", tone: "failure", cx: 900, cy: 1000, w: 240, h: 44, label: "Diagnose failure" },
  // Failure causes.
  { id: "safety", kind: "process", cx: 720, cy: 1100, w: 140, h: 44, label: "Safety filter" },
  { id: "quality", kind: "process", cx: 880, cy: 1100, w: 140, h: 44, label: "Quality miss" },
  { id: "system", kind: "process", cx: 1040, cy: 1100, w: 140, h: 44, label: "System error" },
  // Terminal punt — capability gap, recommend a different modality.
  { id: "punt", kind: "terminal", tone: "punt", cx: 1240, cy: 1100, w: 200, h: 44, label: "Punt → image gen" },
];

const EDGES: FlowEdge[] = [
  { id: "e1", from: "discovery", to: "intent", d: "M 560 92 V 128" },
  { id: "e2", from: "intent", to: "prompt", d: "M 560 172 V 208" },
  { id: "e3", from: "prompt", to: "submit", d: "M 560 252 V 287" },
  // Submit → Clear is part of the cycle as well as the primary path.
  // Tone stays default but it joins the cycle animation so the loop reads
  // as one continuous active churn.
  { id: "e4", from: "submit", to: "clear", d: "M 560 343 V 367", tone: "refine", cycle: true },
  // Clear-no → suggest (right), clear-yes → generate (down).
  {
    id: "e5",
    from: "clear",
    to: "suggest",
    d: "M 680 415 H 770",
    tone: "refine",
    cycle: true,
    label: { x: 725, y: 405, text: "no" },
  },
  {
    id: "e6",
    from: "clear",
    to: "generate",
    d: "M 560 463 V 503",
    label: { x: 580, y: 488, text: "yes" },
  },
  // The cycle's right side — suggest → clarify (up), clarify → submit (left).
  { id: "e7", from: "suggest", to: "clarify", d: "M 880 393 V 337", tone: "refine", cycle: true },
  { id: "e8", from: "clarify", to: "submit", d: "M 770 315 H 670", tone: "refine", cycle: true },
  // Generate → wait/leave decision.
  { id: "e9", from: "generate", to: "wait_choice", d: "M 560 547 V 575" },
  // Stay path — left vertex of decision out and down to "Wait in app".
  {
    id: "e9a",
    from: "wait_choice",
    to: "wait",
    d: "M 450 615 H 380 V 698",
    label: { x: 415, y: 605, text: "stay" },
  },
  // Leave path — right vertex out, down to "Background app", then "Push
  // notify · return". Both stay and notify routes converge at fulfilled.
  {
    id: "e9b",
    from: "wait_choice",
    to: "background",
    d: "M 670 615 H 740 V 698",
    label: { x: 705, y: 605, text: "leave" },
  },
  { id: "e9c", from: "background", to: "notify", d: "M 740 742 V 778" },
  // Convergence — both wait and notify aim for the upper edges of the
  // fulfilled diamond at y=877.5 so each arrow lands cleanly on a face
  // rather than piling up at the same vertex point.
  { id: "e9d", from: "wait", to: "fulfilled", d: "M 380 742 V 877.5 H 505" },
  { id: "e9e", from: "notify", to: "fulfilled", d: "M 740 822 V 877.5 H 615" },
  // Fulfilled → success vs failure.
  {
    id: "e10",
    from: "fulfilled",
    to: "show",
    d: "M 450 900 H 240 V 978",
    tone: "success",
    label: { x: 360, y: 890, text: "success" },
  },
  {
    id: "e11",
    from: "fulfilled",
    to: "diagnose",
    d: "M 670 900 H 900 V 978",
    tone: "failure",
    label: { x: 785, y: 890, text: "failure" },
  },
  { id: "e12", from: "show", to: "save", d: "M 240 1022 V 1058", tone: "success" },
  // Diagnose fans out to four causes.
  { id: "e13", from: "diagnose", to: "safety", d: "M 900 1022 V 1050 H 720 V 1078", tone: "failure" },
  { id: "e14", from: "diagnose", to: "quality", d: "M 900 1022 V 1050 H 880 V 1078", tone: "failure" },
  { id: "e15", from: "diagnose", to: "system", d: "M 900 1022 V 1050 H 1040 V 1078", tone: "failure" },
  { id: "e16", from: "diagnose", to: "punt", d: "M 900 1022 V 1050 H 1240 V 1078", tone: "punt" },
];

function NodeShape({ node }: { node: FlowNode }) {
  const { kind, cx, cy, w, h, primary } = node;
  if (kind === "decision") {
    const top = `${cx},${cy - h / 2}`;
    const right = `${cx + w / 2},${cy}`;
    const bottom = `${cx},${cy + h / 2}`;
    const left = `${cx - w / 2},${cy}`;
    return <polygon className="wpd-flow-shape" points={`${top} ${right} ${bottom} ${left}`} />;
  }
  const x = cx - w / 2;
  const y = cy - h / 2;
  // Primary nodes get a more pronounced "button" radius; terminals are
  // fully-rounded pills; default process boxes get the standard 8px.
  const rx = kind === "terminal" ? h / 2 : primary ? 14 : 8;
  return <rect className="wpd-flow-shape" x={x} y={y} width={w} height={h} rx={rx} ry={rx} />;
}

export function VeoFlowchart() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="wpd-flow">
      <svg
        className="wpd-flow-svg"
        viewBox="0 0 1440 1160"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="User flow for video generation: discovery, prompt, the disambiguate cycle around submit, generation with a stay-or-leave fork (wait in app, or background and return via push notification), fulfillment with success and failure branches."
      >
        <defs>
          <marker
            id="wpd-flow-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>

        {/* Edges first so nodes paint on top. */}
        <g className="wpd-flow-edges">
          {EDGES.map((edge) => {
            const isActive = active === edge.from || active === edge.to;
            return (
              <g
                key={edge.id}
                className="wpd-flow-edge"
                data-tone={edge.tone ?? "default"}
                data-loop={edge.loop ? "true" : undefined}
                data-cycle={edge.cycle ? "true" : undefined}
                data-active={isActive ? "true" : undefined}
              >
                <path d={edge.d} markerEnd="url(#wpd-flow-arrow)" />
                {edge.label && (
                  <text
                    className="wpd-flow-edge-label"
                    x={edge.label.x}
                    y={edge.label.y}
                    textAnchor="middle"
                  >
                    {edge.label.text}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        <g className="wpd-flow-nodes">
          {NODES.map((node) => {
            const tb = node.textBox ?? {
              x: node.cx - node.w / 2,
              y: node.cy - node.h / 2,
              w: node.w,
              h: node.h,
            };
            // Primary node (Submit) is filled with the same purple gel
            // texture from the timeline's "what's next?" slot — three
            // blurred blobs drifting on offset timings, scaled smaller to
            // fit the button. Painted behind the rect outline + label.
            const gelBox = {
              x: node.cx - node.w / 2,
              y: node.cy - node.h / 2,
              w: node.w,
              h: node.h,
            };
            return (
              <g
                key={node.id}
                className="wpd-flow-node"
                data-node={node.id}
                data-kind={node.kind}
                data-tone={node.tone ?? "default"}
                data-primary={node.primary ? "true" : undefined}
                data-active={active === node.id ? "true" : undefined}
                onMouseEnter={() => setActive(node.id)}
                onMouseLeave={() => setActive((cur) => (cur === node.id ? null : cur))}
                onFocus={() => setActive(node.id)}
                onBlur={() => setActive((cur) => (cur === node.id ? null : cur))}
                tabIndex={0}
              >
                {node.primary && (
                  <foreignObject
                    x={gelBox.x}
                    y={gelBox.y}
                    width={gelBox.w}
                    height={gelBox.h}
                    aria-hidden="true"
                  >
                    <div className="wpd-flow-gel">
                      <span className="wpd-flow-gel-blob" />
                      <span className="wpd-flow-gel-blob" />
                      <span className="wpd-flow-gel-blob" />
                    </div>
                  </foreignObject>
                )}
                <NodeShape node={node} />
                <foreignObject x={tb.x} y={tb.y} width={tb.w} height={tb.h}>
                  <div className="wpd-flow-label">{node.label}</div>
                </foreignObject>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
