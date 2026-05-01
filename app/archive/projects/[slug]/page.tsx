import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import { SiteFrame } from "../../../components/SiteFrame";
import { ProjectView } from "./ProjectView";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const label = `PROJECT · ${project.title.toUpperCase()}`;
  return (
    <>
      <SiteFrame label={label} scrambleKey={`/archive/projects/${project.slug}`} />
      <ProjectView project={project} />
    </>
  );
}
