/* True on phones / touch tablets — primary input is touch with no
   hover. Used by the deck scroll handlers to skip JS swipe-snap on
   mobile and let native scroll + CSS scroll-snap take over. */
export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}
