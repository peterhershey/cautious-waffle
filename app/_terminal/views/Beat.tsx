"use client";

import { useEffect, useRef, useState } from "react";
import type { Beat as BeatT, OutputBlock, Phase } from "../beat-machine";
import { beatLayout } from "../beat-machine";
import { Streamed } from "../stream/Streamed";
import { useTerminal } from "../TerminalContext";

// The command keeps a believable "hand-typed" pace (it's short, and it's the
// interactive moment). Boot lines and body output PRINT fast — char-by-char is
// charming once, but tedious across a whole case study of paragraphs.
const COMMAND_CPS = 42;
const BOOT_CPS = 220;
const OUTPUT_CPS = 230;

type BeatProps = {
  beat: BeatT;
  isActive: boolean;
  phase: Phase; // only meaningful when isActive; history beats render "done"
  onPhaseDone: () => void;
};

/** Renders one beat's column flow: a typed command + (optional) boot lines +
 *  streamed output. The active beat animates per `phase`; history beats render
 *  fully. Side media (image / carousel) and pop-ups live in the shell's sticky
 *  stage, NOT here — this is purely the continuous text column. */
export function Beat({ beat, isActive, phase, onPhaseDone }: BeatProps) {
  const { gallerySlide, startGallery } = useTerminal();
  const typing = isActive && phase === "typing";
  const booting = isActive && phase === "booting";
  const streaming = isActive && phase === "streaming";

  const showBoot = !isActive || phase !== "typing";
  const showOutput = !isActive || phase === "streaming" || phase === "done";

  const beatActive = isActive;

  const main = (
    <>
      <div className="term-line">
        <span className="term-prompt-sym">peter@portfolio</span>
        <span className="term-dim"> ~ % </span>
        <Streamed
          text={beat.command}
          active={typing}
          cps={COMMAND_CPS}
          cursor={typing}
          className="term-command"
          onDone={typing ? onPhaseDone : undefined}
        />
      </div>

      {beat.bootLines && beat.bootLines.length > 0 && showBoot ? (
        <div className="term-boot term-faint">
          <Streamed
            text={beat.bootLines.join("\n")}
            active={booting}
            cps={BOOT_CPS}
            cursor={booting}
            className="term-stream"
            onDone={booting ? onPhaseDone : undefined}
          />
        </div>
      ) : null}

      {showOutput ? (
        <BeatOutput
          blocks={beat.output}
          streaming={streaming}
          beatActive={beatActive}
          onAllDone={onPhaseDone}
        />
      ) : null}

      {beat.gallery && isActive && showOutput ? (
        <button
          type="button"
          className="term-launch"
          onClick={startGallery}
        >
          <span className="term-prompt-sym">▣</span>{" "}
          <span className="term-command">open {beat.gallery.title}</span>{" "}
          <span className="term-faint">
            —{" "}
            {beat.gallery.items.length === 1
              ? "space to open"
              : `${beat.gallery.items.length} frames · space to open`}
          </span>
        </button>
      ) : null}
    </>
  );

  // Side-stage carousel: while it runs, the column's text tracks the image in
  // the stage — each frame is a milestone (title + date + note) under the
  // command. (Pop-up carousels carry their own caption, so the column there
  // keeps its normal output instead.)
  if (
    isActive &&
    beat.gallery &&
    gallerySlide !== null &&
    beatLayout(beat) === "sxs-carousel"
  ) {
    const item = beat.gallery.items[gallerySlide];
    return (
      <div className="term-beat term-beat-gallery">
        <div className="term-line">
          <span className="term-prompt-sym">peter@portfolio</span>
          <span className="term-dim"> ~ % </span>
          <span className="term-command">{beat.command}</span>
        </div>
        <div className="term-gallery-frame">
          {item.title ? (
            <div className="term-gallery-frame-title term-head">
              ## {item.title}
            </div>
          ) : null}
          {item.date ? <div className="term-faint">{item.date}</div> : null}
          {item.note ? (
            <div className="term-gallery-frame-note term-dim">↳ {item.note}</div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={`term-beat${beat.feature ? " term-beat-feature" : ""}`}>
      {main}
    </div>
  );
}

// ── Sequential output reveal ─────────────────────────────────────────
function BeatOutput({
  blocks,
  streaming,
  beatActive,
  onAllDone,
}: {
  blocks: OutputBlock[];
  streaming: boolean;
  beatActive: boolean;
  onAllDone: () => void;
}) {
  const [revealed, setRevealed] = useState(() =>
    streaming ? 0 : blocks.length,
  );
  const onAllDoneRef = useRef(onAllDone);
  onAllDoneRef.current = onAllDone;

  // Reset when entering/leaving the streaming phase.
  useEffect(() => {
    setRevealed(streaming ? 0 : blocks.length);
  }, [streaming, blocks]);

  // Fire once all blocks have streamed.
  useEffect(() => {
    if (streaming && revealed >= blocks.length) onAllDoneRef.current();
  }, [streaming, revealed, blocks.length]);

  const visible = streaming ? Math.min(revealed + 1, blocks.length) : blocks.length;
  const advance = () => setRevealed((r) => r + 1);

  return (
    <div className="term-output">
      {blocks.slice(0, visible).map((block, i) => {
        const active = streaming && i === revealed;
        const key = block.kind === "node" ? block.key : `${block.kind}-${i}`;

        if (block.kind === "gap") {
          return <GapBlock key={key} active={active} onDone={advance} />;
        }
        if (block.kind === "node") {
          // Only the active node drives the sequence. Passing advance to an
          // inactive node would double-fire when it transitions active→done.
          return (
            <div key={key} className="term-line">
              {block.render({
                active,
                beatActive,
                onDone: active ? advance : undefined,
              })}
            </div>
          );
        }
        return (
          <div key={key} className="term-line">
            <Streamed
              text={block.text}
              active={active}
              cps={OUTPUT_CPS}
              cursor={active}
              className={`term-stream ${block.className ?? ""}`}
              onDone={active ? advance : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}

function GapBlock({ active, onDone }: { active: boolean; onDone: () => void }) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    if (active) onDoneRef.current();
  }, [active]);
  return <div className="term-gap" aria-hidden="true" />;
}
