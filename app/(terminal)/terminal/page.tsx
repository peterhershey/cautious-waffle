import { Desktop } from "../../_terminal/Desktop";
import { DesktopOnlyNotice } from "../../_terminal/mobile/DesktopOnlyNotice";

export default function TerminalPage() {
  // Both render server-side; terminal.css picks one by viewport width
  // (no JS, no hydration flash). See .term-desktop-gate / .term-mobile-gate.
  return (
    <>
      <div className="term-desktop-gate">
        <Desktop />
      </div>
      <div className="term-mobile-gate">
        <DesktopOnlyNotice />
      </div>
    </>
  );
}
