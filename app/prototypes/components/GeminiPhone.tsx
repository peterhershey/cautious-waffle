"use client";

import { createContext, useState, type ReactNode } from "react";

export type Platform = "ios" | "android";

type GeminiPhoneProps = {
  children: ReactNode;
  platform?: Platform;
  onLabelClick?: () => void;
};

export const PhoneScreenContext = createContext<HTMLDivElement | null>(null);
export const PhonePlatformContext = createContext<Platform>("ios");

export function GeminiPhone({
  children,
  platform = "ios",
  onLabelClick,
}: GeminiPhoneProps) {
  const [screenEl, setScreenEl] = useState<HTMLDivElement | null>(null);

  return (
    <div
      className="proto-phone gemini-phone"
      data-platform={platform}
      role="figure"
      aria-label="Gemini video generation prototype"
    >
      <div className="gemini-phone-screen" ref={setScreenEl}>
        <PhonePlatformContext.Provider value={platform}>
        <PhoneScreenContext.Provider value={screenEl}>
          <div className="gemini-statusbar">
            <span className="gemini-statusbar-time">9:41</span>
            <div className="gemini-statusbar-signals">
              <SignalBars />
              <WifiGlyph />
              <BatteryGlyph />
            </div>
          </div>
          {platform === "ios" ? (
            <div className="gemini-device-island" aria-hidden />
          ) : (
            <div className="gemini-device-punch" aria-hidden />
          )}
          <header className="gemini-header">
            <button type="button" aria-label="Menu" className="gemini-icon-btn">
              <span className="proto-icon" style={{ fontSize: "calc(22 * var(--u, 1px))" }} aria-hidden>
                menu
              </span>
            </button>
            {onLabelClick ? (
              <button
                type="button"
                className="proto-phone-header-chip"
                onClick={onLabelClick}
                aria-label="Open prototype controls"
              >
                Peter Labs
              </button>
            ) : (
              <span className="proto-phone-header-chip">Peter Labs</span>
            )}
            <button type="button" aria-label="New chat" className="gemini-icon-btn">
              <span className="proto-icon" style={{ fontSize: "calc(22 * var(--u, 1px))" }} aria-hidden>
                edit_square
              </span>
            </button>
          </header>
          <div className="gemini-body">{children}</div>
          <div className="gemini-home-indicator" aria-hidden />
        </PhoneScreenContext.Provider>
        </PhonePlatformContext.Provider>
      </div>
    </div>
  );
}

function SignalBars() {
  return (
    <svg
      width="17"
      height="11"
      viewBox="0 0 17 11"
      fill="currentColor"
      aria-hidden
    >
      <rect x="0" y="8" width="3" height="3" rx="0.6" />
      <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.6" />
      <rect x="9" y="3" width="3" height="8" rx="0.6" />
      <rect x="13.5" y="0" width="3" height="11" rx="0.6" />
    </svg>
  );
}

function WifiGlyph() {
  return (
    <svg
      width="15"
      height="11"
      viewBox="0 0 15 11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M1.5 4.5 C4 2.2 7 1 7.5 1 C8 1 11 2.2 13.5 4.5" />
      <path d="M3.5 6.8 C5 5.5 6.8 4.8 7.5 4.8 C8.2 4.8 10 5.5 11.5 6.8" />
      <circle cx="7.5" cy="9.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg
      width="25"
      height="12"
      viewBox="0 0 25 12"
      fill="none"
      aria-hidden
    >
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <rect x="2" y="2" width="19" height="8" rx="1.6" fill="currentColor" />
      <rect
        x="23.5"
        y="4"
        width="1.5"
        height="4"
        rx="0.6"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}
