"use client";

/* Era-specific chrome pieces injected by NewsShell. */

export function MarqueeStrip1996({ headlines }: { headlines: string[] }) {
  const text = headlines.map((h) => `  ◆  ${h}  `).join("");
  return (
    <div
      style={{
        background: "#000066",
        color: "#ffff66",
        borderTop: "1px solid #000",
        borderBottom: "1px solid #000",
        fontFamily: "Verdana, Arial, sans-serif",
        fontSize: 11,
        padding: "3px 0",
      }}
    >
      {/* The real deal: the deprecated marquee element. Modern browsers
         still honor it, and it sells the period better than any CSS. */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(() => {
        const Mq = "marquee" as unknown as React.ElementType;
        return (
          <Mq scrollamount={4}>
            <b style={{ color: "#ff3333" }}>★ BREAKING NEWS ★</b>
            {text}
            <b style={{ color: "#ff3333" }}> ★ UPDATED CONTINUOUSLY ★</b>
          </Mq>
        );
      })()}
    </div>
  );
}

export function UnderConstruction1996() {
  return (
    <div
      style={{
        margin: "14px 0",
        padding: "8px 10px",
        border: "1px solid #b8860b",
        background: "#fffbe0",
        fontFamily: "Verdana, Arial, sans-serif",
        fontSize: 11,
        color: "#5a4a00",
        display: "flex",
        gap: 10,
        alignItems: "center",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 18,
          height: 18,
          background:
            "repeating-linear-gradient(45deg, #ffd700 0 4px, #000 4px 8px)",
          border: "1px solid #8a7500",
          flexShrink: 0,
        }}
      />
      <span>
        <b>Under Construction!</b> Pardon our dust — we're rolling out new
        features daily. <a href="#">Tell us what you think</a>.
      </span>
    </div>
  );
}

export function VisitorCounter1996({ seed }: { seed: number }) {
  const n = (492871 + seed * 7919).toString().padStart(7, "0");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "Verdana, Arial, sans-serif",
        fontSize: 11,
        color: "#444",
      }}
    >
      <span>You are visitor</span>
      <span
        style={{
          display: "inline-flex",
          gap: 1,
          padding: "2px 4px",
          background: "#000",
          border: "1px solid #555",
        }}
      >
        {n.split("").map((d, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              minWidth: 10,
              textAlign: "center",
              color: "#ffaa00",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 0,
              padding: "1px 2px",
              background: "#1a1a1a",
            }}
          >
            {d}
          </span>
        ))}
      </span>
    </div>
  );
}

export function Footer1996({ seed }: { seed: number }) {
  return (
    <div
      style={{
        background: "#eeeeee",
        borderTop: "1px solid #888",
        padding: "10px 14px",
        marginTop: 20,
        fontFamily: "Verdana, Arial, sans-serif",
        fontSize: 11,
        color: "#333",
        display: "flex",
        flexWrap: "wrap",
        gap: 14,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        © 1996 The National Ledger ·{" "}
        <a href="#" style={{ color: "#0033aa" }}>
          Site Index
        </a>{" "}
        ·{" "}
        <a href="#" style={{ color: "#0033aa" }}>
          Help
        </a>{" "}
        ·{" "}
        <a href="#" style={{ color: "#0033aa" }}>
          Feedback
        </a>
        <div style={{ marginTop: 4, color: "#666" }}>
          Best viewed with{" "}
          <a href="#" style={{ color: "#0033aa" }}>
            Netscape Navigator 3.0
          </a>{" "}
          or better at 800×600 · Requires cookies enabled
        </div>
      </div>
      <VisitorCounter1996 seed={seed} />
    </div>
  );
}

export function AdSlot2004({ kind = "banner" }: { kind?: "banner" | "sky" }) {
  const isSky = kind === "sky";
  return (
    <div
      style={{
        margin: isSky ? "16px 0" : "20px 0",
        textAlign: "center",
        fontFamily: "Verdana, Arial, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "#888",
          letterSpacing: "0.12em",
          marginBottom: 4,
          textTransform: "uppercase",
        }}
      >
        Advertisement
      </div>
      <div
        style={{
          margin: "0 auto",
          width: isSky ? 160 : 728,
          height: isSky ? 600 : 90,
          maxWidth: "100%",
          background:
            "repeating-linear-gradient(45deg, #d9d9d9 0 8px, #efefef 8px 16px)",
          border: "1px solid #999",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
          fontSize: 12,
          letterSpacing: "0.08em",
        }}
      >
        {isSky ? "160 × 600" : "728 × 90"}
      </div>
    </div>
  );
}

export function MostEmailed2004({ items }: { items: string[] }) {
  return (
    <div
      style={{
        border: "1px solid #999",
        background: "#f7f4ea",
        fontFamily: "Verdana, Arial, sans-serif",
        fontSize: 12,
        marginTop: 16,
      }}
    >
      <div
        style={{
          background: "#003366",
          color: "#fff",
          padding: "4px 10px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.04em",
        }}
      >
        <span
          aria-hidden
          style={{
            display: "inline-block",
            marginRight: 6,
            width: 10,
            height: 10,
            background: "#ff7f00",
            verticalAlign: -1,
          }}
        />
        MOST E-MAILED
      </div>
      <ol style={{ margin: 0, padding: "8px 14px 10px 32px", color: "#111" }}>
        {items.map((t, i) => (
          <li key={i} style={{ padding: "3px 0", lineHeight: 1.3 }}>
            <a href="#" style={{ color: "#0033aa", textDecoration: "underline" }}>
              {t}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function NewsletterSignup2014() {
  return (
    <div
      style={{
        background: "#f5f5f5",
        borderTop: "4px solid #c8102e",
        padding: "18px 20px",
        margin: "28px 0",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: "1 1 260px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "#c8102e",
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          NEWSLETTER
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#222",
          }}
        >
          The Morning Edition, in your inbox.
        </div>
        <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
          A hand-picked read, every weekday before 7am.
        </div>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "flex", gap: 8, flex: "1 1 260px" }}
      >
        <input
          type="email"
          placeholder="you@email.com"
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid #bbb",
            borderRadius: 2,
            fontFamily: "inherit",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 18px",
            background: "#c8102e",
            color: "#fff",
            border: 0,
            borderRadius: 2,
            fontWeight: 700,
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}
        >
          SIGN UP
        </button>
      </form>
    </div>
  );
}
