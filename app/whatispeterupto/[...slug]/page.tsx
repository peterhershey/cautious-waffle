import { redirect } from "next/navigation";

export default async function WhatIsPeterUpToCatchAll({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  // Templates moved to /templates (canonical, not archive); everything else → /archive/<slug>
  if (slug[0] === "templates") {
    redirect(`/templates${slug.length > 1 ? "/" + slug.slice(1).join("/") : ""}`);
  }
  redirect(`/archive/${slug.join("/")}`);
}
