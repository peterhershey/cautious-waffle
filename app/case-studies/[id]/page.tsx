import { notFound } from "next/navigation";
import { CaseStudyDeck } from "./CaseStudyDeck";
import { DECKS } from "./decks";

export function generateStaticParams() {
  return Object.keys(DECKS).map((id) => ({ id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deck = DECKS[id];
  if (!deck) notFound();
  return <CaseStudyDeck slides={deck.slides} meta={deck.meta} />;
}
