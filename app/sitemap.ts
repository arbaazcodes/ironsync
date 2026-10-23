import type { MetadataRoute } from "next";
import { PUBLISHED_EXERCISES } from "@/lib/exercises/catalog";
const origin = "https://www.ironsync.online";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/exercises`, changeFrequency: "weekly", priority: 0.9 },
    ...PUBLISHED_EXERCISES.map(exercise => ({ url: `${origin}/exercises/${exercise.id}`, lastModified: exercise.publication.checkedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
