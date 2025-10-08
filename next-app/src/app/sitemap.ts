import { MetadataRoute } from 'next';
import { getBlogPosts, BlogPost } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fluxtrade.vercel.app'; // Use the correct canonical domain

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/strategies`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/strategies/max-pain`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/strategies/gamma-guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // Dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const result = await getBlogPosts();
    if (result.posts) {
      blogPosts = result.posts.map((post: BlogPost) => ({
        url: `${baseUrl}/community/post/${post._id.toString()}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticPages, ...blogPosts];
} 