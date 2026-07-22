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

// ── Solutions ──

export type SolutionStatus =
  | "draft"
  | "pending_review"
  | "changes_requested"
  | "approved"
  | "published"
  | "archived";

export interface Solution {
  id: number;
  title: MultiLang;
  slug: string;
  shortDescription: MultiLang;
  fullDescription: MultiLang;
  problem: MultiLang;
  approach: MultiLang;
  benefits: MultiLang[];
  features: MultiLang[];
  targetAudience: MultiLang[];
  industries: MultiLang[];
  relatedServiceIds: number[];
  icon: string;
  imageUrl: string;
  imageAlt: MultiLang;
  accentColor: string;
  ctaLabel: MultiLang;
  ctaUrl: string;
  order: number;
  featured: boolean;
  status: SolutionStatus;
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

// ── Media Library ──

export type MediaType = "image" | "document" | "video";
export type MediaSource = "local_mock" | "external_url" | "existing_asset";
export type MediaStatus = "active" | "archived";

export interface UsageReference {
  resourceType: string;
  resourceId: number;
  resourceLabel: string;
}

export interface MediaAsset {
  id: number;
  name: string;
  originalName: string;
  mediaType: MediaType;
  mimeType: string;
  url: string;
  thumbnailUrl: string;
  source: MediaSource;
  title: MultiLang;
  altText: MultiLang;
  caption: MultiLang;
  description: MultiLang;
  folder: string;
  tags: string[];
  sizeBytes: number;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  status: MediaStatus;
  usageReferences: UsageReference[];
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ── Admin Profile & Account ──

export type InterfaceLanguage = "fr" | "en" | "ar";
export type InterfaceTheme = "system" | "light" | "dark";
export type InterfaceDensity = "comfortable" | "compact";
export type DateFormatOption = "DD/MM/YYYY" | "YYYY-MM-DD" | "DD MMM YYYY";
export type TimeFormatOption = "24h" | "12h";
export type TwoFactorStatus = "unavailable" | "disabled" | "enabled";
export type SessionStatus = "active" | "revoked";

export interface AdminProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  displayName: string;
  loginEmail: string;
  contactEmail: string;
  phone: string;
  jobTitle: string;
  department: string;
  bio: string;
  avatarUrl: string;
  role: string;
  language: InterfaceLanguage;
  theme: InterfaceTheme;
  interfaceDensity: InterfaceDensity;
  timezone: string;
  dateFormat: DateFormatOption;
  timeFormat: TimeFormatOption;
  lastPasswordChangeAt: string | null;
  twoFactorStatus: TwoFactorStatus;
  lastSecurityReviewAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MockAccountSession {
  id: number;
  userId: number;
  deviceLabel: string;
  browserLabel: string;
  platformLabel: string;
  approximateLocationLabel: string;
  ipLabel: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
  status: SessionStatus;
}

// ── Admin Notification Center ──

export type NotificationType =
  | "system"
  | "content"
  | "review"
  | "security"
  | "lead"
  | "media"
  | "account";

export type NotificationPriority = "low" | "normal" | "high" | "critical";

export type NotificationStatus = "unread" | "read" | "archived";

export interface NotificationRelatedResource {
  resourceType: string;
  resourceId: number;
  resourceLabel: string;
}

export interface AdminNotification {
  id: number;
  recipientUserId?: number;
  recipientRole?: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  status: NotificationStatus;
  actionLabel?: string;
  actionUrl?: string;
  relatedResource?: NotificationRelatedResource;
  createdAt: string;
  readAt?: string | null;
  archivedAt?: string | null;
  expiresAt?: string | null;
  isDemo?: boolean;
}

export type DigestFrequency = "immediate" | "daily" | "weekly" | "disabled";

export interface NotificationPreferences {
  userId: number;
  inAppEnabled: boolean;
  contentReviewEnabled: boolean;
  leadAlertsEnabled: boolean;
  mediaAlertsEnabled: boolean;
  securityAlertsEnabled: boolean;
  accountAlertsEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  digestFrequency: DigestFrequency;
  updatedAt: string;
}

// ── Admin Audit Log & Activity History ──

export type AuditAction =
  | "create"
  | "update"
  | "duplicate"
  | "submit_review"
  | "request_changes"
  | "approve"
  | "publish"
  | "archive"
  | "restore"
  | "delete"
  | "bulk_update"
  | "preference_update"
  | "profile_update"
  | "avatar_update"
  | "password_change_simulation"
  | "session_revoke_simulation"
  | "notification_read"
  | "notification_archive"
  | "notification_delete"
  | "notification_preferences_update"
  | "export"
  | "access_denied"
  | "system";

export type AuditResourceType =
  | "service"
  | "solution"
  | "media"
  | "profile"
  | "session"
  | "notification"
  | "notification_preferences"
  | "post"
  | "category"
  | "lead"
  | "subscriber"
  | "user"
  | "settings"
  | "system";

export type AuditSeverity = "info" | "warning" | "critical";
export type AuditOutcome = "success" | "denied" | "failed";
export type AuditSource = "demo_seed" | "current_session";

export interface AuditChangeDetail {
  field: string;
  label: string;
  before?: string;
  after?: string;
  isSensitive?: boolean;
}

export interface AuditMetadataItem {
  label: string;
  value: string;
}

export interface AdminAuditEvent {
  id: number;
  actorUserId: number;
  actorDisplayName: string;
  actorRole: string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: number;
  resourceLabel: string;
  description: string;
  severity: AuditSeverity;
  outcome: AuditOutcome;
  source: AuditSource;
  changes?: AuditChangeDetail[];
  metadata?: AuditMetadataItem[];
  ipLabel: string;
  deviceLabel: string;
  sessionLabel: string;
  createdAt: string;
  isDemo?: boolean;
}


