// Resume Types - Following JSON Resume standard
// https://jsonresume.org/schema

import { z } from "zod";

// === ZOD SCHEMAS (runtime validation) ===

export const LocationSchema = z.object({
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  countryCode: z.string().max(10).optional(),
}).optional();

export const ProfileSchema = z.object({
  network: z.string().min(1).max(50),
  username: z.string().max(100).optional(),
  url: z.string().url(),
});

export const ResumeBasicsSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  label: z.string().max(100).optional(),
  email: z.string().email("Invalid email").or(z.literal("")),
  phone: z.string().max(30).optional(),
  url: z.string().url().optional().or(z.literal("")),
  summary: z.string().max(2000).optional(),
  image: z.string().url().optional().or(z.literal("")),
  location: LocationSchema,
  profiles: z.array(ProfileSchema).max(10).optional(),
});

export const WorkEntrySchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required").max(100),
  position: z.string().min(1, "Position is required").max(100),
  url: z.string().url().optional().or(z.literal("")),
  startDate: z.string(),
  endDate: z.string().optional(),
  summary: z.string().max(500).optional(),
  highlights: z.array(z.string().max(300)).max(10),
});

export const EducationEntrySchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required").max(100),
  url: z.string().url().optional().or(z.literal("")),
  area: z.string().max(100),
  studyType: z.string().max(50),
  startDate: z.string(),
  endDate: z.string().optional(),
  score: z.string().max(20).optional(),
  courses: z.array(z.string().max(100)).max(20).optional(),
});

export const SkillEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required").max(50),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
  keywords: z.array(z.string().max(50)).max(20).optional(),
});

export const LanguageEntrySchema = z.object({
  id: z.string(),
  language: z.string().min(1).max(50),
  fluency: z.string().max(50),
});

export const ProjectEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  highlights: z.array(z.string().max(300)).max(10).optional(),
  keywords: z.array(z.string().max(50)).max(20).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
});

export const ResumeDataSchema = z.object({
  basics: ResumeBasicsSchema,
  work: z.array(WorkEntrySchema).max(20),
  education: z.array(EducationEntrySchema).max(10),
  skills: z.array(SkillEntrySchema).max(50),
  languages: z.array(LanguageEntrySchema).max(10),
  projects: z.array(ProjectEntrySchema).max(20),
});

export const ResumeMetadataSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  templateId: z.enum(["classic", "modern", "minimal"]).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

// === TYPESCRIPT INTERFACES (for type checking) ===

export interface ResumeBasics {
  name: string;
  label?: string; // e.g., "Software Engineer"
  email: string;
  phone?: string;
  url?: string; // Portfolio/website
  summary?: string;
  image?: string; // Profile photo URL
  location?: {
    address?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    countryCode?: string;
  };
  profiles?: {
    network: string; // e.g., "LinkedIn", "GitHub"
    username?: string;
    url: string;
  }[];
}

export interface WorkExperience {
  id: string; // For React key and drag-drop
  company: string;
  position: string;
  url?: string;
  startDate: string; // Format: YYYY-MM
  endDate?: string; // null/undefined = Present
  summary?: string;
  highlights: string[]; // Bullet points
}

export interface Education {
  id: string;
  institution: string;
  url?: string;
  area: string; // e.g., "Computer Science"
  studyType: string; // e.g., "Bachelor", "Master"
  startDate: string;
  endDate?: string;
  score?: string; // GPA
  courses?: string[];
}

export interface Skill {
  id: string;
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  keywords?: string[];
}

export interface Language {
  id: string;
  language: string;
  fluency: string; // e.g., "Native", "Fluent", "Intermediate"
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  highlights?: string[];
  keywords?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
}

// Complete Resume Data Structure
export interface ResumeData {
  basics: ResumeBasics;
  work: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
}

// Resume with metadata (from database)
export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  accentColor: string;
  basics: ResumeBasics;
  work: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

// Default values for new resume
export const DEFAULT_RESUME_DATA: ResumeData = {
  basics: {
    name: "",
    email: "",
    label: "",
    phone: "",
    summary: "",
    location: {
      city: "",
      countryCode: "",
    },
    profiles: [],
  },
  work: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
};

// Template types
export type TemplateId = "classic" | "modern" | "minimal";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  preview: string; // Preview image URL
}

export const TEMPLATES: Template[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout, perfect for ATS",
    preview: "/templates/classic.png",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Two-column design with sidebar for skills",
    preview: "/templates/modern.png",
  },
];

// === HOOK TYPES ===

export type SaveStatus = "idle" | "saving" | "saved" | "error" | "offline";

export interface ResumeListItem {
  id: string;
  title: string;
  templateId: string;
  updatedAt: Date;
  createdAt: Date;
}

export type ResumeMetadata = z.infer<typeof ResumeMetadataSchema>;

// === DEFAULT VALUES ===

export const DEFAULT_RESUME_METADATA: Required<ResumeMetadata> = {
  title: "Untitled Resume",
  templateId: "classic",
  accentColor: "#2563eb",
};

// === TYPE CONVERSION UTILITIES ===
// Convert between DB format (ResumeData) and template format (TemplateResumeData)

import type {
  ResumeData as TemplateResumeData,
  Skill as TemplateSkill,
} from "@/lib/resume/types";

/**
 * Convert DB resume data to template format for rendering
 */
export function toTemplateFormat(data: ResumeData): TemplateResumeData {
  return {
    personalInfo: {
      fullName: data.basics.name || "",
      jobTitle: data.basics.label || "",
      email: data.basics.email || "",
      phone: data.basics.phone || "",
      location: [data.basics.location?.city, data.basics.location?.countryCode]
        .filter(Boolean)
        .join(", "),
      linkedin: data.basics.profiles?.find((p) => p.network.toLowerCase() === "linkedin")?.url,
      website: data.basics.url || "",
      summary: data.basics.summary || "",
    },
    workExperience: data.work.map((w) => ({
      id: w.id,
      company: w.company,
      position: w.position,
      location: "",
      startDate: w.startDate,
      endDate: w.endDate || null,
      description: w.summary || "",
      achievements: w.highlights || [],
    })),
    education: data.education.map((e) => ({
      id: e.id,
      institution: e.institution,
      degree: e.studyType || "",
      field: e.area || "",
      location: "",
      startDate: e.startDate,
      endDate: e.endDate || "",
      gpa: e.score,
      achievements: e.courses,
    })),
    skills: data.skills.map((s) => ({
      id: s.id,
      name: s.name,
      level: s.level?.toLowerCase() as TemplateSkill["level"],
      category: s.keywords?.[0],
    })),
    languages: data.languages?.map((l) => ({
      id: l.id,
      name: l.language,
      level: l.fluency as "basic" | "conversational" | "fluent" | "native",
    })),
  };
}

/**
 * Convert template format back to DB format for saving
 */
export function fromTemplateFormat(data: TemplateResumeData): ResumeData {
  return {
    basics: {
      name: data.personalInfo.fullName,
      label: data.personalInfo.jobTitle,
      email: data.personalInfo.email,
      phone: data.personalInfo.phone,
      url: data.personalInfo.website,
      summary: data.personalInfo.summary,
      location: {
        city: data.personalInfo.location.split(", ")[0] || "",
        countryCode: data.personalInfo.location.split(", ")[1] || "",
      },
      profiles: data.personalInfo.linkedin
        ? [{ network: "LinkedIn", url: data.personalInfo.linkedin }]
        : [],
    },
    work: data.workExperience.map((w) => ({
      id: w.id,
      company: w.company,
      position: w.position,
      startDate: w.startDate,
      endDate: w.endDate || undefined,
      summary: w.description,
      highlights: w.achievements,
    })),
    education: data.education.map((e) => ({
      id: e.id,
      institution: e.institution,
      area: e.field,
      studyType: e.degree,
      startDate: e.startDate,
      endDate: e.endDate || undefined,
      score: e.gpa,
      courses: e.achievements,
    })),
    skills: data.skills.map((s) => ({
      id: s.id,
      name: s.name,
      level: s.level ? (s.level.charAt(0).toUpperCase() + s.level.slice(1)) as Skill["level"] : undefined,
      keywords: s.category ? [s.category] : [],
    })),
    languages: data.languages?.map((l) => ({
      id: l.id,
      language: l.name,
      fluency: l.level,
    })) || [],
    projects: [],
  };
}
