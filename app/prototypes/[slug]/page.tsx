import { notFound } from "next/navigation";
import { getPrototype, prototypes } from "@/lib/prototypes";
import { PrototypeView } from "./PrototypeView";

export function generateStaticParams() {
  return prototypes.map((p) => ({ slug: p.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prototype = getPrototype(slug);
  if (!prototype) notFound();
  return <PrototypeView prototype={prototype} />;
}
