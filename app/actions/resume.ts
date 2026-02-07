"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  ResumeDataSchema,
  ResumeMetadataSchema,
  DEFAULT_RESUME_DATA,
  DEFAULT_RESUME_METADATA,
  type ResumeData,
  type ResumeMetadata,
  type ResumeListItem,
} from "@/types/resume";

// === ERROR HANDLING ===

class ActionError extends Error {
  code: "UNAUTHORIZED" | "NOT_FOUND" | "FORBIDDEN" | "VALIDATION" | "SERVER";

  constructor(
    message: string,
    code: "UNAUTHORIZED" | "NOT_FOUND" | "FORBIDDEN" | "VALIDATION" | "SERVER"
  ) {
    super(message);
    this.name = "ActionError";
    this.code = code;
  }
}

// === HELPERS ===

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new ActionError("Please sign in to continue", "UNAUTHORIZED");
  }
  return user;
}

async function verifyOwnership(resumeId: string, userId: string) {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    select: { userId: true },
  });

  if (!resume) {
    throw new ActionError("Resume not found", "NOT_FOUND");
  }

  if (resume.userId !== userId) {
    throw new ActionError("You don't have access to this resume", "FORBIDDEN");
  }
}

// === ACTIONS ===

/**
 * Get all resumes for the authenticated user
 */
export async function getResumes(): Promise<ResumeListItem[]> {
  const user = await getAuthenticatedUser();

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      templateId: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return resumes;
}

/**
 * Get a single resume by ID with ownership verification
 */
export async function getResume(id: string) {
  const user = await getAuthenticatedUser();

  const resume = await prisma.resume.findUnique({
    where: { id },
  });

  if (!resume) {
    throw new ActionError("Resume not found", "NOT_FOUND");
  }

  if (resume.userId !== user.id) {
    throw new ActionError("You don't have access to this resume", "FORBIDDEN");
  }

  // Cast JSON values from database to proper types
  const data: ResumeData = {
    basics: resume.basics as unknown as ResumeData["basics"],
    work: (resume.work as unknown as ResumeData["work"]) || [],
    education: (resume.education as unknown as ResumeData["education"]) || [],
    skills: (resume.skills as unknown as ResumeData["skills"]) || [],
    languages: ((resume as any).languages as unknown as ResumeData["languages"]) || [],
    projects: ((resume as any).projects as unknown as ResumeData["projects"]) || [],
  };

  return {
    id: resume.id,
    data,
    metadata: {
      title: resume.title,
      templateId: resume.templateId as ResumeMetadata["templateId"],
      accentColor: resume.accentColor,
    },
    updatedAt: resume.updatedAt,
  };
}

/**
 * Create a new resume with default values
 */
export async function createResume(title?: string) {
  const user = await getAuthenticatedUser();

  // Check resume limit (prevent abuse)
  const count = await prisma.resume.count({ where: { userId: user.id } });
  if (count >= 50) {
    throw new ActionError("Maximum resume limit reached (50)", "VALIDATION");
  }

  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      title: title || DEFAULT_RESUME_METADATA.title,
      templateId: DEFAULT_RESUME_METADATA.templateId,
      accentColor: DEFAULT_RESUME_METADATA.accentColor,
      basics: DEFAULT_RESUME_DATA.basics as any,
      work: DEFAULT_RESUME_DATA.work as any,
      education: DEFAULT_RESUME_DATA.education as any,
      skills: DEFAULT_RESUME_DATA.skills as any,
    },
    select: {
      id: true,
      title: true,
      templateId: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  revalidatePath("/dashboard");
  return resume;
}

/**
 * Update resume content with validation
 */
export async function updateResume(id: string, data: ResumeData) {
  const user = await getAuthenticatedUser();
  await verifyOwnership(id, user.id);

  // Validate input (will throw ZodError if invalid)
  const validated = ResumeDataSchema.parse(data);

  const resume = await prisma.resume.update({
    where: { id },
    data: {
      basics: validated.basics as any,
      work: validated.work as any,
      education: validated.education as any,
      skills: validated.skills as any,
      updatedAt: new Date(),
    },
    select: { updatedAt: true },
  });

  return { updatedAt: resume.updatedAt };
}

/**
 * Update resume metadata (title, template, color)
 */
export async function updateResumeMetadata(id: string, data: ResumeMetadata) {
  const user = await getAuthenticatedUser();
  await verifyOwnership(id, user.id);

  const validated = ResumeMetadataSchema.parse(data);

  // Build update object with only provided fields
  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (validated.title !== undefined) updateData.title = validated.title;
  if (validated.templateId !== undefined) updateData.templateId = validated.templateId;
  if (validated.accentColor !== undefined) updateData.accentColor = validated.accentColor;

  await prisma.resume.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Delete a resume with ownership verification
 */
export async function deleteResume(id: string) {
  const user = await getAuthenticatedUser();
  await verifyOwnership(id, user.id);

  await prisma.resume.delete({ where: { id } });

  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Generate a unique public slug
 */
function generatePublicSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

/**
 * Toggle public link status for a resume
 */
export async function togglePublicLink(id: string, isPublic: boolean) {
  const user = await getAuthenticatedUser();
  await verifyOwnership(id, user.id);

  // Get current resume state
  const resume = await prisma.resume.findUnique({
    where: { id },
    select: { publicSlug: true, isPublic: true },
  });

  if (!resume) {
    throw new ActionError("Resume not found", "NOT_FOUND");
  }

  let publicSlug = resume.publicSlug;

  // Generate a new slug if enabling public access and no slug exists
  if (isPublic && !publicSlug) {
    // Keep trying until we get a unique slug
    let attempts = 0;
    while (attempts < 10) {
      publicSlug = generatePublicSlug();
      const existing = await prisma.resume.findUnique({
        where: { publicSlug },
        select: { id: true },
      });
      if (!existing) break;
      attempts++;
    }
    if (attempts >= 10) {
      throw new ActionError("Could not generate unique link", "SERVER");
    }
  }

  await prisma.resume.update({
    where: { id },
    data: {
      isPublic,
      publicSlug: isPublic ? publicSlug : resume.publicSlug, // Keep slug even when disabled
    },
  });

  return {
    isPublic,
    publicSlug: isPublic ? publicSlug : null,
    publicUrl: isPublic && publicSlug ? `/r/${publicSlug}` : null,
  };
}

/**
 * Get public link info for a resume
 */
export async function getPublicLinkInfo(id: string) {
  const user = await getAuthenticatedUser();
  await verifyOwnership(id, user.id);

  const resume = await prisma.resume.findUnique({
    where: { id },
    select: { isPublic: true, publicSlug: true },
  });

  if (!resume) {
    throw new ActionError("Resume not found", "NOT_FOUND");
  }

  return {
    isPublic: resume.isPublic,
    publicSlug: resume.publicSlug,
    publicUrl: resume.isPublic && resume.publicSlug ? `/r/${resume.publicSlug}` : null,
  };
}
