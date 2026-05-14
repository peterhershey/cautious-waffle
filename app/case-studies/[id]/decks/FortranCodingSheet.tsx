"use client";

/* FORTRAN coding-form slides for "Teaching Gemini to See".
   The premise: humans used to communicate with computers by writing
   instructions onto paper that was punched into cards; this case study
   is about evolving how humans and computers communicate. The "program"
   on each slide types itself in like a typewriter striking the form. */

import { useEffect, useRef, useState } from "react";

export type FortranLine = {
  /* cols 1-5: statement number (e.g. "10"). Ignored when `comment` is true. */
  num?: string;
  /* col 6: any non-blank, non-zero char marks a continuation. */
  cont?: string;
  /* cols 7-72: the FORTRAN statement (the part that gets typed). */
  stmt?: string;
  /* cols 73-80: optional identification stamp. */
  ident?: string;
  /* render the row as a comment: `C` in col 1, no num. */
  comment?: boolean;
};

type FortranMeta = {
  program: string;
  programmer: string;
  date: string;
  page: string;
  graphic: string;
  punch: string;
  identification: string;
};

export type FortranSheetProps = {
  meta: FortranMeta;
  lines: FortranLine[];
  totalRows?: number;
  /** Animate the code typing in when the slide enters view. */
  typing?: boolean;
  /** Per-character cadence in ms (default 14ms — fast typewriter). */
  perCharMs?: number;
  /** Pause between lines after a line finishes (default 90ms). */
  lineGapMs?: number;
  /** Initial wait before typing begins after entering view (default 280ms). */
  startDelayMs?: number;
};

const DEFAULT_TOTAL_ROWS = 23;
const RULER_NUM = [1, 5];
const RULER_STMT = [7, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 72];
const RULER_IDENT = [73, 80];

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function FortranSheet({
  meta,
  lines,
  totalRows = DEFAULT_TOTAL_ROWS,
  typing = false,
  perCharMs = 14,
  lineGapMs = 90,
  startDelayMs = 280,
}: FortranSheetProps) {
  /* Typing state — `progressLine` is the index of the line currently
     being typed; `progressChar` is how many chars of that line's stmt
     have been revealed. Lines below `progressLine` are blank; lines
     above are fully revealed. */
  const [progressLine, setProgressLine] = useState<number>(
    typing ? -1 : lines.length,
  );
  const [progressChar, setProgressChar] = useState<number>(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!typing) return;
    const el = wrapRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setProgressLine(lines.length);
      setProgressChar(0);
      return;
    }

    let line = 0;
    let char = 0;

    const clearTimer = () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const tick = () => {
      timerRef.current = null;
      const current = lines[line];
      if (!current) return;
      const stmt = current.stmt ?? "";
      if (char < stmt.length) {
        char += 1;
        setProgressLine(line);
        setProgressChar(char);
        timerRef.current = window.setTimeout(tick, perCharMs);
      } else {
        /* Line complete — advance. The display of the just-finished
           line is preserved because we keep progressLine until we
           bump it; below we move it forward. */
        line += 1;
        char = 0;
        setProgressLine(line);
        setProgressChar(0);
        if (line < lines.length) {
          timerRef.current = window.setTimeout(tick, lineGapMs);
        }
      }
    };

    const start = () => {
      clearTimer();
      line = 0;
      char = 0;
      setProgressLine(0);
      setProgressChar(0);
      timerRef.current = window.setTimeout(tick, startDelayMs);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            start();
          } else {
            clearTimer();
            setProgressLine(-1);
            setProgressChar(0);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimer();
    };
  }, [typing, lines, perCharMs, lineGapMs, startDelayMs]);

  const padded: (FortranLine | null)[] = [];
  for (let i = 0; i < totalRows; i++) padded.push(lines[i] ?? null);

  return (
    <div
      ref={wrapRef}
      className="wpd-fortran"
      aria-label="FORTRAN coding form title card"
    >
      <div className="wpd-fortran-sheet">
        <div className="wpd-fortran-paper-grain" aria-hidden />

        <header className="wpd-fortran-head">
          <div className="wpd-fortran-head-row wpd-fortran-head-row--top">
            <div className="wpd-fortran-cell wpd-fortran-cell--program">
              <span className="wpd-fortran-cell-label">PROGRAM</span>
              <span className="wpd-fortran-cell-value">{meta.program}</span>
            </div>
            <div className="wpd-fortran-cell wpd-fortran-cell--programmer">
              <span className="wpd-fortran-cell-label">PROGRAMMER</span>
              <span className="wpd-fortran-cell-value">{meta.programmer}</span>
            </div>
            <div className="wpd-fortran-cell wpd-fortran-cell--date">
              <span className="wpd-fortran-cell-label">DATE</span>
              <span className="wpd-fortran-cell-value">{meta.date}</span>
            </div>
            <div className="wpd-fortran-cell wpd-fortran-cell--page">
              <span className="wpd-fortran-cell-label">PAGE</span>
              <span className="wpd-fortran-cell-value">{meta.page}</span>
            </div>
          </div>

          <div className="wpd-fortran-title-row">
            <h1 className="wpd-fortran-title">FORTRAN Coding Form</h1>
            <div className="wpd-fortran-punch">
              <div className="wpd-fortran-punch-left">
                <span className="wpd-fortran-cell-label">PUNCHING</span>
                <span className="wpd-fortran-cell-label">INSTRUCTIONS</span>
              </div>
              <div className="wpd-fortran-punch-right">
                <div className="wpd-fortran-punch-cell">
                  <span className="wpd-fortran-cell-label">GRAPHIC</span>
                  <span className="wpd-fortran-cell-value wpd-fortran-cell-value--sm">
                    {meta.graphic}
                  </span>
                </div>
                <div className="wpd-fortran-punch-cell">
                  <span className="wpd-fortran-cell-label">PUNCH</span>
                  <span className="wpd-fortran-cell-value wpd-fortran-cell-value--sm">
                    {meta.punch}
                  </span>
                </div>
              </div>
            </div>
            <div className="wpd-fortran-cell wpd-fortran-cell--ident">
              <span className="wpd-fortran-cell-label">IDENTIFICATION</span>
              <span className="wpd-fortran-cell-value wpd-fortran-cell-value--sm">
                {meta.identification}
              </span>
            </div>
          </div>
        </header>

        <div className="wpd-fortran-column-head">
          <div className="wpd-fortran-col wpd-fortran-col--num">
            <span className="wpd-fortran-col-label">STATEMENT</span>
            <span className="wpd-fortran-col-label wpd-fortran-col-label--sub">
              NUMBER
            </span>
          </div>
          <div className="wpd-fortran-col wpd-fortran-col--cont">
            <span className="wpd-fortran-col-label wpd-fortran-col-label--vertical">
              CONTINUATION
            </span>
          </div>
          <div className="wpd-fortran-col wpd-fortran-col--stmt">
            <span className="wpd-fortran-col-label">FORTRAN STATEMENT</span>
          </div>
          <div className="wpd-fortran-col wpd-fortran-col--ident">
            <span className="wpd-fortran-col-label">IDENTIFICATION</span>
          </div>
        </div>

        <div className="wpd-fortran-ruler" aria-hidden>
          <div className="wpd-fortran-ruler-col wpd-fortran-ruler-col--num">
            {RULER_NUM.map((n) => (
              <span key={n} className="wpd-fortran-ruler-tick">
                {n}
              </span>
            ))}
          </div>
          <div className="wpd-fortran-ruler-col wpd-fortran-ruler-col--cont">
            <span className="wpd-fortran-ruler-tick">6</span>
          </div>
          <div className="wpd-fortran-ruler-col wpd-fortran-ruler-col--stmt">
            {RULER_STMT.map((n) => (
              <span key={n} className="wpd-fortran-ruler-tick">
                {n}
              </span>
            ))}
          </div>
          <div className="wpd-fortran-ruler-col wpd-fortran-ruler-col--ident">
            {RULER_IDENT.map((n) => (
              <span key={n} className="wpd-fortran-ruler-tick">
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="wpd-fortran-body" role="presentation">
          {padded.map((line, i) => {
            const isPast = i < progressLine;
            const isCurrent = i === progressLine && line != null;
            const isFuture = i > progressLine;
            const stmt = line?.stmt ?? "";
            const typedStmt = isCurrent ? stmt.slice(0, progressChar) : stmt;
            const showCells = !isFuture && line != null;
            return (
              <div
                key={i}
                className="wpd-fortran-row"
                data-row={String(i + 1).padStart(2, "0")}
              >
                <div className="wpd-fortran-row-num">
                  {showCells && line?.comment ? (
                    <span className="wpd-fortran-mark wpd-fortran-mark--c">
                      C
                    </span>
                  ) : showCells && line?.num ? (
                    <span className="wpd-fortran-mark">{line.num}</span>
                  ) : null}
                </div>
                <div className="wpd-fortran-row-cont">
                  {showCells && line?.cont && (
                    <span className="wpd-fortran-mark">{line.cont}</span>
                  )}
                </div>
                <div className="wpd-fortran-row-stmt">
                  {showCells && (
                    <span className="wpd-fortran-mark wpd-fortran-mark--stmt">
                      {typedStmt}
                      {isCurrent && (
                        <span
                          className="wpd-fortran-caret"
                          aria-hidden
                        />
                      )}
                    </span>
                  )}
                </div>
                <div className="wpd-fortran-row-ident">
                  {isPast && line?.ident && (
                    <span className="wpd-fortran-mark wpd-fortran-mark--ident">
                      {line.ident}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <footer className="wpd-fortran-footer" aria-hidden>
          <span>
            ★ NOTE — A standard card form is available for punching source
            statements from this form.
          </span>
          <span className="wpd-fortran-footer-stamp">IBM · GX28-1464-6</span>
        </footer>
      </div>
    </div>
  );
}

/* ---- Slide 01b — title card ---- */

const INTRO_META: FortranMeta = {
  program: "TEACHING GEMINI TO SEE",
  programmer: "PETER HERSHEY",
  date: "2025",
  page: "1 OF 2",
  graphic: "CONVERSATION",
  punch: "MULTIMODAL",
  identification: "TGTS · GEMINI · LIVE",
};

const INTRO_LINES: FortranLine[] = [
  { comment: true, stmt: "TEACHING GEMINI TO SEE" },
  { comment: true, stmt: "BY PETER HERSHEY · CASE STUDY 2025" },
  { comment: true },
  { stmt: "PROGRAM TEACH-GEMINI-TO-SEE", ident: "PH 2025" },
  { stmt: "DIMENSION EYES(2), VOICE(1)", ident: "PH 2025" },
  { comment: true },
  { stmt: "READ (5,*) PIXELS", ident: "PH 2025" },
  { stmt: "READ (5,*) AUDIO", ident: "PH 2025" },
  { comment: true },
  { num: "10", stmt: "IF (.NOT. UNDERSTAND) GOTO 20", ident: "PH 2025" },
  { stmt: "CALL CONVERSE (HUMAN, MODEL)", ident: "PH 2025" },
  { stmt: "GOTO 30", ident: "PH 2025" },
  { num: "20", stmt: "CALL OBSERVE (PIXELS, AUDIO)", ident: "PH 2025" },
  { stmt: "GOTO 10", ident: "PH 2025" },
  { comment: true },
  {
    num: "30",
    stmt: "PRINT 100, 'EVOLVING GEMINI LIVE INTO'",
    ident: "PH 2025",
  },
  { cont: "X", stmt: "'A MULTIMODAL CONVERSATIONAL'", ident: "PH 2025" },
  { cont: "X", stmt: "'PRODUCT.'", ident: "PH 2025" },
  { num: "100", stmt: "FORMAT (A)", ident: "PH 2025" },
  { stmt: "STOP", ident: "PH 2025" },
  { stmt: "END", ident: "PH 2025" },
];

export function FortranCodingSheet() {
  return <FortranSheet meta={INTRO_META} lines={INTRO_LINES} typing />;
}

/* ---- Slide 03 — what I shipped ---- */

const SHIPPED_META: FortranMeta = {
  program: "WHAT I'VE SHIPPED AT GEMINI",
  programmer: "PETER HERSHEY",
  date: "2024-2025",
  page: "2 OF 2",
  graphic: "APP · MULTIMODAL · MEDIA",
  punch: "SALON",
  identification: "TGTS · SHIPPED · 8",
};

const SHIPPED_LINES: FortranLine[] = [
  { comment: true, stmt: "WHAT I'VE SHIPPED AT GEMINI · 2024-2025" },
  { comment: true },
  { stmt: "PROGRAM SHIPPED", ident: "PH 2025" },
  { stmt: "DIMENSION MULTIMODAL(4), MEDIA(2)", ident: "PH 2025" },
  { comment: true, stmt: "THE APP" },
  { num: "01", stmt: "CALL LAUNCH ('GEMINI APP')", ident: "PH 2025" },
  { comment: true },
  { comment: true, stmt: "MULTIMODAL COMMUNICATION" },
  { num: "10", stmt: "MULTIMODAL(1) = 'GEMINI LIVE VIDEO'", ident: "PH 2025" },
  { num: "20", stmt: "MULTIMODAL(2) = 'VISUAL OVERLAYS'", ident: "PH 2025" },
  {
    num: "30",
    stmt: "MULTIMODAL(3) = 'MULTIMODAL LAUNCHER'",
    ident: "PH 2025",
  },
  {
    num: "40",
    stmt: "MULTIMODAL(4) = 'FLOATY + SCREEN CONTEXT'",
    ident: "PH 2025",
  },
  { comment: true },
  { comment: true, stmt: "MEDIA GENERATION" },
  { num: "50", stmt: "MEDIA(1) = 'VEO VIDEO GENERATION'", ident: "PH 2025" },
  { num: "60", stmt: "MEDIA(2) = 'AUDIO OVERVIEWS'", ident: "PH 2025" },
  { comment: true },
  { comment: true, stmt: "COMMUNITY" },
  { num: "70", stmt: "CALL HOST ('MONTHLY AI SALON')", ident: "PH 2025" },
  { comment: true },
  { stmt: "CALL DEPLOY (MULTIMODAL, MEDIA)", ident: "PH 2025" },
  { stmt: "STOP", ident: "PH 2025" },
  { stmt: "END", ident: "PH 2025" },
];

export function FortranShippedSheet() {
  return <FortranSheet meta={SHIPPED_META} lines={SHIPPED_LINES} typing />;
}
