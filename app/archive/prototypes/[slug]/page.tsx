import { notFound } from "next/navigation";
import { getPrototype, prototypes } from "@/lib/prototypes";
import { SiteFrame } from "../../../components/SiteFrame";
import { PrototypeView } from "./PrototypeView";

export function generateStaticParams() {
  return prototypes.map((p) => ({ slug: p.slug }));
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ embed?: string; doshi?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const embed = sp?.embed === "1";
  const doshi = sp?.doshi === "1";
  const prototype = getPrototype(slug);
  if (!prototype) notFound();
  const label = `PROTOTYPE · ${prototype.title.toUpperCase()}`;
  return (
    <>
      {embed ? null : (
        <SiteFrame label={label} scrambleKey={`/archive/prototypes/${prototype.slug}`} />
      )}
      <PrototypeView prototype={prototype} embed={embed} doshi={doshi} />
    </>
  );
}
