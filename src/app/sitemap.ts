import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/content";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getAllSlugs();
  return [
    { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    ...items.map((i) => ({ url: `${site.url}/${i.slug}`, lastModified: i.updatedAt })),
  ];
}
