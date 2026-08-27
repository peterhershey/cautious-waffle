#!/usr/bin/env bash
# One-off: convert referenced animated GIFs to web-friendly MP4 (H.264).
# Produces foo.mp4 next to foo.gif. Originals are left in place; pruning
# happens in a separate step. Skips unreferenced GIFs.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

BACKUP="$(pwd)/.media-originals"
mkdir -p "$BACKUP"

# Encode settings: yuv420p + even dims for universal playback, faststart so
# the moov atom is up front, no audio, crf 26 (good size/quality for GIF src).
encode() {
  local in="$1" out="$2"
  ffmpeg -nostdin -y -loglevel error -i "$in" \
    -movflags +faststart -pix_fmt yuv420p \
    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
    -an -c:v libx264 -crf 26 -preset slow "$out"
}

total_before=0
total_after=0
count=0

while IFS= read -r -d '' gif; do
  base="${gif%.gif}"
  mp4="${base}.mp4"
  before=$(stat -f%z "$gif")
  encode "$gif" "$mp4"
  if [ -f "$mp4" ]; then
    after=$(stat -f%z "$mp4")
    total_before=$((total_before + before))
    total_after=$((total_after + after))
    count=$((count + 1))
    printf "%6.1fMB -> %5.1fMB  %s\n" \
      "$(echo "scale=2;$before/1048576" | bc)" \
      "$(echo "scale=2;$after/1048576" | bc)" \
      "${gif#public/}"
  else
    echo "FAILED: $gif"
  fi
done < <(
  find public -iname "*.gif" \
    ! -name "stop-5.gif" \
    ! -name "talos-principle.gif" \
    -print0
)

echo "---"
printf "Converted %d gifs: %.1fMB -> %.1fMB (%.0f%% smaller)\n" \
  "$count" \
  "$(echo "scale=2;$total_before/1048576" | bc)" \
  "$(echo "scale=2;$total_after/1048576" | bc)" \
  "$(echo "scale=0;(1 - $total_after/$total_before)*100" | bc)"
