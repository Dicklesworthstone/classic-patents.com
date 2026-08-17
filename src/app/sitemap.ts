import type { MetadataRoute } from "next";
import { allPatents } from "@/data/patents";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://classic-patents.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/timeline`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const patentRoutes: MetadataRoute.Sitemap = allPatents.map((patent) => ({
    url: `${baseUrl}/patents/${patent.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...patentRoutes];
}
