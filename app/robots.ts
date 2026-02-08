import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/terms", "/privacy", "/r/"],
        disallow: [
          "/dashboard",
          "/editor",
          "/settings",
          "/billing",
          "/api/",
          "/resumes",
        ],
      },
    ],
    sitemap: "https://www.cvrizz.com/sitemap.xml",
  };
}
