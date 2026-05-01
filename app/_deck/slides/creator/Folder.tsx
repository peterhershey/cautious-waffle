type Props = {
  drawn: boolean;
};

export function Folder({ drawn }: Props) {
  return (
    <svg
      className="creator-folder-svg"
      viewBox="0 0 160 110"
      width="160"
      height="110"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-drawn={drawn ? "true" : "false"}
      aria-hidden
    >
      {/* Outer folder contour: tab + body as one continuous path */}
      <path
        className="creator-folder-path creator-folder-outline"
        pathLength="1"
        d="M 22 30 L 22 22 Q 22 14 30 14 L 62 14 Q 70 14 74 22 L 78 30 L 144 30 Q 150 30 150 36 L 150 94 Q 150 100 144 100 L 16 100 Q 10 100 10 94 L 10 36 Q 10 30 16 30 Z"
      />
      {/* Front flap — a line suggesting the opening */}
      <path
        className="creator-folder-path creator-folder-crease"
        pathLength="1"
        d="M 14 42 L 146 42"
      />
    </svg>
  );
}
