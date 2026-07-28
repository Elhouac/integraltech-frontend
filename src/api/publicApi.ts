import { apiClient, ApiResponse } from "./client";

export interface MultilingualText {
  fr?: string;
  en?: string;
  ar?: string;
}

export interface ServiceDto {
  id: number;
  title: MultilingualText;
  slug: string;
  shortDescription: MultilingualText;
  fullDescription?: MultilingualText;
  features?: MultilingualText;
  benefits?: MultilingualText;
  icon?: string;
  imageUrl?: string;
  imageAlt?: MultilingualText;
  accentColor?: string;
  ctaLabel?: MultilingualText;
  ctaUrl?: string;
  displayOrder?: number;
  featured?: boolean;
  status?: string;
  seoTitle?: MultilingualText;
  seoDescription?: MultilingualText;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SolutionDto {
  id: number;
  title: MultilingualText;
  slug: string;
  shortDescription: MultilingualText;
  fullDescription?: MultilingualText;
  problem?: MultilingualText;
  approach?: MultilingualText;
  features?: MultilingualText;
  benefits?: MultilingualText;
  targetAudience?: MultilingualText;
  industries?: MultilingualText;
  relatedServices?: ServiceDto[];
  icon?: string;
  imageUrl?: string;
  imageAlt?: MultilingualText;
  accentColor?: string;
  ctaLabel?: MultilingualText;
  ctaUrl?: string;
  displayOrder?: number;
  featured?: boolean;
  status?: string;
  seoTitle?: MultilingualText;
  seoDescription?: MultilingualText;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryDto {
  id: number;
  name: MultilingualText;
  slug: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TagDto {
  id: number;
  name: MultilingualText;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostDto {
  id: number;
  title: MultilingualText;
  slug: string;
  excerpt?: MultilingualText;
  content: MultilingualText;
  category?: CategoryDto;
  tags?: TagDto[];
  imageUrl?: string;
  authorName?: string;
  readingTime?: number;
  featured?: boolean;
  status?: string;
  seoTitle?: MultilingualText;
  seoDescription?: MultilingualText;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface SiteSettingDto {
  key: string;
  group?: string;
  value: any;
  valueType?: string;
  label?: MultilingualText;
  description?: MultilingualText;
  isPublic?: boolean;
  updatedAt?: string;
}

export interface MediaAssetDto {
  id: number;
  name: string;
  originalName?: string;
  mediaType?: string;
  mimeType?: string;
  url: string;
  thumbnailUrl?: string;
  source?: string;
  title?: MultilingualText;
  altText?: MultilingualText;
  caption?: MultilingualText;
  description?: MultilingualText;
  folder?: string;
  tags?: string[];
  sizeBytes?: number;
  width?: number;
  height?: number;
  durationSeconds?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const publicApi = {
  fetchServices: (params?: { featured?: boolean }): Promise<ApiResponse<ServiceDto[]>> => {
    return apiClient.get<ServiceDto[]>("/public/services", params);
  },

  fetchServiceBySlug: (slug: string): Promise<ApiResponse<ServiceDto>> => {
    return apiClient.get<ServiceDto>(`/public/services/${slug}`);
  },

  fetchSolutions: (params?: { featured?: boolean }): Promise<ApiResponse<SolutionDto[]>> => {
    return apiClient.get<SolutionDto[]>("/public/solutions", params);
  },

  fetchSolutionBySlug: (slug: string): Promise<ApiResponse<SolutionDto>> => {
    return apiClient.get<SolutionDto>(`/public/solutions/${slug}`);
  },

  fetchPosts: (params?: { category?: string; tag?: string; search?: string; page?: number; per_page?: number }): Promise<ApiResponse<PostDto[]>> => {
    return apiClient.get<PostDto[]>("/public/posts", params);
  },

  fetchPostBySlug: (slug: string): Promise<ApiResponse<PostDto>> => {
    return apiClient.get<PostDto>(`/public/posts/${slug}`);
  },

  fetchCategories: (): Promise<ApiResponse<CategoryDto[]>> => {
    return apiClient.get<CategoryDto[]>("/public/categories");
  },

  fetchTags: (): Promise<ApiResponse<TagDto[]>> => {
    return apiClient.get<TagDto[]>("/public/tags");
  },

  submitLead: (payload: LeadPayload): Promise<ApiResponse<any>> => {
    return apiClient.post<any>("/public/leads", payload);
  },

  subscribeNewsletter: (email: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>("/public/subscribers", { email });
  },

  fetchSettings: (): Promise<ApiResponse<SiteSettingDto[]>> => {
    return apiClient.get<SiteSettingDto[]>("/public/settings");
  },

  fetchSettingByKey: (key: string): Promise<ApiResponse<SiteSettingDto>> => {
    return apiClient.get<SiteSettingDto>(`/public/settings/${key}`);
  },

  fetchMediaAssets: (params?: { type?: string; source?: string; search?: string }): Promise<ApiResponse<MediaAssetDto[]>> => {
    return apiClient.get<MediaAssetDto[]>("/public/media-assets", params);
  },
};
