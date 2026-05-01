"use client";

type Props = { dateline?: string };

export default function LeftRail({ dateline }: Props) {
  const short = (dateline ?? "Friday, April 17, 2026").split(" — ")[0];
  return (
    <aside className="left-rail">
      <div className="rail-block">
        <b>{short}</b>
      </div>
      <hr />
      <div className="rail-block">
        <b>Find out by e-mail</b>
        <br />
        <a href="#">what's new</a> this week.
      </div>
      <hr />
      <div className="rail-block" style={{ textAlign: "center" }}>
        <div className="rail-thumb" aria-hidden>
          <div className="rail-thumb-inner" />
          <div className="rail-thumb-caption">
            front page:
            <br />
            the print edition
          </div>
        </div>
      </div>
      <hr />
      <div className="rail-block">
        <b>Did you see this symbol</b>
        <br />
        in the printed Ledger?
        <br />
        Get the <a href="#">extra info</a> here.
      </div>
      <hr />
      <div className="rail-block" style={{ textAlign: "center" }}>
        <div className="rail-badge" aria-hidden>
          Ledger
          <br />
          <b>WORLD</b>
        </div>
      </div>
      <hr />
      <div className="rail-block">
        Take note of our <a href="#">music</a> calendar database.
      </div>
      <hr />
      <div className="rail-block">
        Read <a href="#">editorials</a> from today's Ledger.
      </div>
      <hr />
      <div className="rail-block">
        <b>NEED HELP?</b>
        <div>
          <span className="sq" /> Skim the <a href="#">Site Index</a>.
        </div>
        <div>
          <span className="sq" /> See the <a href="#">User Guide</a>.
        </div>
        <div>
          <span className="sq" /> <a href="#">Search</a> the site.
        </div>
      </div>
    </aside>
  );
}
