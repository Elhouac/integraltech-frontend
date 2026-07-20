export type BlogCategory = "cybersecurity" | "cloud" | "erp" | "digitalTransform" | "news";

export interface BlogArticleMetadata {
  id: number;
  category: BlogCategory;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  isNew: boolean;
  contentReference: `art${number}`;
  color: string;
}

export const BLOG_SEEN_NEW_ARTICLES_KEY = "integraltech:blog:seen-new-articles";

export const blogArticles: readonly BlogArticleMetadata[] = [
  { id: 1, category: "cybersecurity", publishedAt: "2026-06-15", readingTime: 5, featured: true, isNew: true, contentReference: "art1", color: "#F97316" },
  { id: 2, category: "cloud", publishedAt: "2026-06-08", readingTime: 7, featured: false, isNew: true, contentReference: "art2", color: "#29B6F6" },
  { id: 3, category: "erp", publishedAt: "2026-06-01", readingTime: 8, featured: false, isNew: false, contentReference: "art3", color: "#CE93D8" },
  { id: 4, category: "digitalTransform", publishedAt: "2026-05-20", readingTime: 6, featured: false, isNew: false, contentReference: "art4", color: "#66BB6A" },
  { id: 5, category: "news", publishedAt: "2026-05-12", readingTime: 3, featured: false, isNew: false, contentReference: "art5", color: "#FF7043" },
  { id: 6, category: "cybersecurity", publishedAt: "2026-05-05", readingTime: 9, featured: false, isNew: false, contentReference: "art6", color: "#F97316" },
  { id: 7, category: "cloud", publishedAt: "2026-04-28", readingTime: 10, featured: false, isNew: false, contentReference: "art7", color: "#29B6F6" },
  { id: 8, category: "digitalTransform", publishedAt: "2026-04-15", readingTime: 5, featured: false, isNew: false, contentReference: "art8", color: "#66BB6A" },
  { id: 9, category: "erp", publishedAt: "2026-04-05", readingTime: 7, featured: false, isNew: false, contentReference: "art9", color: "#CE93D8" },
];

export const newBlogArticleIds = blogArticles.filter((article) => article.isNew).map((article) => article.id);
