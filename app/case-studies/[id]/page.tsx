import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { COOKIE_NAME, verifyCookie } from "@/lib/auth";
import { CaseStudyDeck } from "./CaseStudyDeck";
import { CaseStudyTeaser } from "./CaseStudyTeaser";
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

  /* Reading cookies opts this route into per-request rendering — the slug
     list still comes from generateStaticParams, but the response body is
     dynamic so we can branch on auth. */
  const cookieStore = await cookies();
  const authed = await verifyCookie(cookieStore.get(COOKIE_NAME)?.value);

  if (authed) {
    return <CaseStudyDeck slides={deck.slides} meta={deck.meta} />;
  }

  return (
    <CaseStudyTeaser
      slide={deck.slides[0]}
      meta={deck.meta}
      returnPath={`/case-studies/${id}`}
    />
  );
}
