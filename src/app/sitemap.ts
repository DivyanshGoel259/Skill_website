import { MetadataRoute } from 'next';
import { getAllSkills } from '@/lib/skills';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Update this to your official domain
  const baseUrl = 'https://skills-anthropic.vercel.app';
  
  const allSkills = getAllSkills();
  
  const skillUrls = allSkills.map((skill) => ({
    url: `${baseUrl}/skill/${skill.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...skillUrls,
  ];
}
