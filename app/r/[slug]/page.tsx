import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { templates } from "@/lib/templates";
import { toTemplateFormat, DEFAULT_RESUME_DATA } from "@/types/resume";
import { PublicResumeView } from "./PublicResumeView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const resume = await prisma.resume.findFirst({
    where: {
      publicSlug: slug,
      isPublic: true,
    },
    select: {
      title: true,
      basics: true,
    },
  });

  if (!resume) {
    return {
      title: "Resume Not Found",
    };
  }

  const basics = resume.basics as { name?: string; label?: string } | null;
  const name = basics?.name || "Professional";
  const title = basics?.label || resume.title;

  return {
    title: `${name} - ${title}`,
    description: `View ${name}'s professional resume`,
    openGraph: {
      title: `${name} - ${title}`,
      description: `View ${name}'s professional resume`,
      type: "profile",
    },
  };
}

export default async function PublicResumePage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch the public resume
  const resume = await prisma.resume.findFirst({
    where: {
      publicSlug: slug,
      isPublic: true,
    },
    select: {
      id: true,
      title: true,
      templateId: true,
      basics: true,
      work: true,
      education: true,
      skills: true,
      languages: true,
    },
  });

  if (!resume) {
    notFound();
  }

  // Get the template
  const template = templates.find(t => t.id === resume.templateId) || templates[0];

  // Convert to display format (cast JSON to proper types)
  const resumeData = {
    basics: resume.basics as unknown as typeof DEFAULT_RESUME_DATA.basics,
    work: resume.work as unknown as typeof DEFAULT_RESUME_DATA.work,
    education: resume.education as unknown as typeof DEFAULT_RESUME_DATA.education,
    skills: resume.skills as unknown as typeof DEFAULT_RESUME_DATA.skills,
    languages: resume.languages as unknown as typeof DEFAULT_RESUME_DATA.languages,
    projects: [] as typeof DEFAULT_RESUME_DATA.projects,
  };

  const templateData = toTemplateFormat(resumeData);

  return (
    <PublicResumeView
      template={template}
      templateData={templateData}
      title={resume.title}
    />
  );
}
