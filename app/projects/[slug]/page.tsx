import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
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
  return <ProjectView project={project} />;
}
