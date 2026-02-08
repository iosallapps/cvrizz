import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.cvrizz.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic public resume pages
  let publicResumes: MetadataRoute.Sitemap = [];
  try {
    const resumes = await prisma.resume.findMany({
      where: { isPublic: true, publicSlug: { not: null } },
      select: { publicSlug: true, updatedAt: true },
    });
    publicResumes = resumes.map((r: { publicSlug: string | null; updatedAt: Date }) => ({
      url: `${baseUrl}/r/${r.publicSlug}`,
      lastModified: r.updatedAt,
    }));
  } catch {
    // Silently fail if DB isn't available during build
  }

  return [...staticPages, ...publicResumes];
}
