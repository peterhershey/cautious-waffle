import { notFound } from "next/navigation";
import { TEMPLATES, getTemplate } from "../../meta";
import { SiteFrame } from "../../../components/SiteFrame";
import { PreviewSlide } from "./PreviewSlide";
import "../../sample/sample.css";
import "../preview.css";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slide: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slide: string }>;
}) {
  const { slide } = await params;
  const t = getTemplate(slide);
  return {
    title: t ? `${t.name} — Template preview` : "Template preview",
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slide: string }>;
}) {
  const { slide } = await params;
  const meta = getTemplate(slide);
  if (!meta) notFound();
  const label = `TEMPLATE · ${meta.slug} · ${meta.name.toUpperCase()}`;

  return (
    <div className="wipu-preview-root">
      <SiteFrame label={label} scrambleKey={`/templates/preview/${slide}`} />
      <PreviewSlide slug={slide} />
    </div>
  );
}
