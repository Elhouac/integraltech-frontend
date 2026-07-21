import type { LucideIcon } from "lucide-react";
import type { UserRole } from "../context/AuthContext";

export interface KpiData {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
}

export interface ActivityData {
  id: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}

export interface QuickActionData {
  icon: LucideIcon;
  label: string;
  description: string;
  to: string;
  color: string;
  bg: string;
}

export type LeadStatus = "new" | "in_progress" | "resolved" | "archived";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: LeadStatus;
  is_read: boolean;
  created_at: string;
}

export interface LeadNote {
  id: number;
  lead_id: number;
  author: string;
  content: string;
  created_at: string;
}

export interface Subscriber {
  id: number;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export type PostStatus = "draft" | "published" | "archived";

export interface Category {
  id: number;
  name: { fr: string; en: string; ar: string };
  slug: string;
  order: number;
}

export interface Post {
  id: number;
  slug: string;
  title: { fr: string; en: string; ar: string };
  content: { fr: string; en: string; ar: string };
  excerpt: { fr: string; en: string; ar: string };
  category_id: number | null;
  author: string;
  cover_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  tags: string[];
}

export interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  last_login: string | null;
}

// ── Services ──

export interface MultiLang {
  fr: string;
  en: string;
  ar: string;
}

export type ServiceStatus =
  | "draft"
  | "pending_review"
  | "changes_requested"
  | "approved"
  | "published"
  | "archived";

export interface Service {
  id: number;
  title: MultiLang;
  slug: string;
  shortDescription: MultiLang;
  fullDescription: MultiLang;
  benefits: MultiLang[];
  features: MultiLang[];
  icon: string;
  imageUrl: string;
  imageAlt: MultiLang;
  accentColor: string;
  ctaLabel: MultiLang;
  ctaUrl: string;
  order: number;
  featured: boolean;
  status: ServiceStatus;
  seoTitle: MultiLang;
  seoDescription: MultiLang;
  createdAt: string;
  updatedAt: string;
  submittedBy: string | null;
  submittedAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  publishedAt: string | null;
}
