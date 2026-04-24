import { notFound } from "next/navigation";
import { caseStudyDetails, getCaseStudyDetail } from "../../content";
import { CaseStudyView } from "./CaseStudyView";

export function generateStaticParams() {
  return caseStudyDetails.map((c) => ({ id: c.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = getCaseStudyDetail(id);
  if (!detail) notFound();
  return <CaseStudyView detail={detail} />;
}
