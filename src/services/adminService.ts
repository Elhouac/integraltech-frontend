import {
  MOCK_KPI_DATA,
  MOCK_ACTIVITIES,
  MOCK_LEADS,
  MOCK_LEAD_NOTES,
  MOCK_SUBSCRIBERS,
  MOCK_CATEGORIES,
  MOCK_POSTS,
  MOCK_SYSTEM_USERS,
  MOCK_SERVICES,
  MOCK_SOLUTIONS,
  MOCK_MEDIA_ASSETS,
} from "../data/admin-mocks";
import type {
  KpiData,
  ActivityData,
  Lead,
  LeadNote,
  Subscriber,
  Post,
  Category,
  SystemUser,
  LeadStatus,
  Service,
  ServiceStatus,
  Solution,
  SolutionStatus,
  MediaAsset,
  MediaStatus,
} from "../types/admin";

// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminService = {
  async getKpiData(): Promise<KpiData[]> {
    await delay();
    return [...MOCK_KPI_DATA];
  },

  async getActivities(): Promise<ActivityData[]> {
    await delay();
    return [...MOCK_ACTIVITIES];
  },

  async getLeads(): Promise<Lead[]> {
    await delay();
    return [...MOCK_LEADS];
  },

  async getLeadById(id: number): Promise<Lead | undefined> {
    await delay();
    return MOCK_LEADS.find((l) => l.id === id);
  },

  async getLeadNotes(leadId: number): Promise<LeadNote[]> {
    await delay();
    return MOCK_LEAD_NOTES.filter((n) => n.lead_id === leadId);
  },

  async addLeadNote(leadId: number, author: string, content: string): Promise<LeadNote> {
    await delay();
    const newNote: LeadNote = {
      id: Date.now(),
      lead_id: leadId,
      author,
      content,
      created_at: new Date().toISOString(),
    };
    MOCK_LEAD_NOTES.push(newNote);
    return newNote;
  },

  async updateLeadStatus(id: number, status: LeadStatus): Promise<Lead | undefined> {
    await delay();
    const lead = MOCK_LEADS.find((l) => l.id === id);
    if (lead) {
      lead.status = status;
      lead.is_read = true;
    }
    return lead;
  },

  async markLeadAsRead(id: number): Promise<Lead | undefined> {
    await delay();
    const lead = MOCK_LEADS.find((l) => l.id === id);
    if (lead) {
      lead.is_read = true;
    }
    return lead;
  },

  async getSubscribers(): Promise<Subscriber[]> {
    await delay();
    return [...MOCK_SUBSCRIBERS];
  },

  async updateSubscriberStatus(ids: number[], active: boolean): Promise<void> {
    await delay();
    MOCK_SUBSCRIBERS.forEach((sub) => {
      if (ids.includes(sub.id)) {
        sub.is_active = active;
      }
    });
  },

  async deleteSubscribers(ids: number[]): Promise<void> {
    await delay();
    for (const id of ids) {
      const idx = MOCK_SUBSCRIBERS.findIndex((s) => s.id === id);
      if (idx !== -1) {
        MOCK_SUBSCRIBERS.splice(idx, 1);
      }
    }
  },

  async getPosts(): Promise<Post[]> {
    await delay();
    return [...MOCK_POSTS];
  },

  async savePost(postData: Omit<Post, "id" | "created_at" | "slug"> & { id?: number }): Promise<Post> {
    await delay();
    const isEdit = postData.id !== undefined && postData.id !== null;
    if (isEdit) {
      const idx = MOCK_POSTS.findIndex((p) => p.id === postData.id);
      if (idx !== -1) {
        const updated: Post = {
          ...MOCK_POSTS[idx],
          ...postData,
          slug: postData.title.fr.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        } as Post;
        MOCK_POSTS[idx] = updated;
        return updated;
      }
      throw new Error("Post not found");
    } else {
      const newPost: Post = {
        ...postData,
        id: Date.now(),
        slug: postData.title.fr.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        created_at: new Date().toISOString(),
      } as Post;
      MOCK_POSTS.push(newPost);
      return newPost;
    }
  },

  async deletePost(id: number): Promise<void> {
    await delay();
    const idx = MOCK_POSTS.findIndex((p) => p.id === id);
    if (idx !== -1) {
      MOCK_POSTS.splice(idx, 1);
    }
  },

  async getCategories(): Promise<Category[]> {
    await delay();
    return [...MOCK_CATEGORIES];
  },

  async saveCategory(catData: Omit<Category, "id"> & { id?: number }): Promise<Category> {
    await delay();
    const isEdit = catData.id !== undefined && catData.id !== null;
    if (isEdit) {
      const idx = MOCK_CATEGORIES.findIndex((c) => c.id === catData.id);
      if (idx !== -1) {
        const updated: Category = {
          ...MOCK_CATEGORIES[idx],
          ...catData,
        };
        MOCK_CATEGORIES[idx] = updated;
        return updated;
      }
      throw new Error("Category not found");
    } else {
      const newCat: Category = {
        ...catData,
        id: Date.now(),
      };
      MOCK_CATEGORIES.push(newCat);
      return newCat;
    }
  },

  async deleteCategory(id: number): Promise<void> {
    await delay();
    const idx = MOCK_CATEGORIES.findIndex((c) => c.id === id);
    if (idx !== -1) {
      MOCK_CATEGORIES.splice(idx, 1);
    }
  },

  async getSystemUsers(): Promise<SystemUser[]> {
    await delay();
    return [...MOCK_SYSTEM_USERS];
  },

  async saveSystemUser(userData: Omit<SystemUser, "id" | "last_login"> & { id?: number }): Promise<SystemUser> {
    await delay();
    const isEdit = userData.id !== undefined && userData.id !== null;
    if (isEdit) {
      const idx = MOCK_SYSTEM_USERS.findIndex((u) => u.id === userData.id);
      if (idx !== -1) {
        const updated: SystemUser = {
          ...MOCK_SYSTEM_USERS[idx],
          ...userData,
        } as SystemUser;
        MOCK_SYSTEM_USERS[idx] = updated;
        return updated;
      }
    }
    
    // Create
    const newUser: SystemUser = {
      ...userData,
      id: Date.now(),
      last_login: null,
    } as SystemUser;
    MOCK_SYSTEM_USERS.push(newUser);
    return newUser;
  },

  async deleteSystemUser(id: number): Promise<void> {
    await delay();
    const idx = MOCK_SYSTEM_USERS.findIndex((u) => u.id === id);
    if (idx !== -1) {
      MOCK_SYSTEM_USERS.splice(idx, 1);
    }
  },

  async toggleSystemUserStatus(id: number): Promise<SystemUser | undefined> {
    await delay();
    const user = MOCK_SYSTEM_USERS.find((u) => u.id === id);
    if (user) {
      user.is_active = !user.is_active;
    }
    return user;
  },

  // ── Services ──

  async getServices(): Promise<Service[]> {
    await delay();
    return [...MOCK_SERVICES];
  },

  async getServiceById(id: number): Promise<Service | undefined> {
    await delay();
    return MOCK_SERVICES.find((s) => s.id === id);
  },

  async createService(data: Omit<Service, "id" | "createdAt" | "updatedAt">): Promise<Service> {
    await delay();
    const newService: Service = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_SERVICES.push(newService);
    return newService;
  },

  async updateService(id: number, data: Partial<Service>): Promise<Service> {
    await delay();
    const idx = MOCK_SERVICES.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Service not found");
    const updated: Service = {
      ...MOCK_SERVICES[idx],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    MOCK_SERVICES[idx] = updated;
    return updated;
  },

  async duplicateService(id: number): Promise<Service> {
    await delay();
    const source = MOCK_SERVICES.find((s) => s.id === id);
    if (!source) throw new Error("Service not found");
    const copy: Service = {
      ...JSON.parse(JSON.stringify(source)),
      id: Date.now(),
      title: {
        fr: `${source.title.fr} (copie)`,
        en: source.title.en ? `${source.title.en} (copy)` : "",
        ar: source.title.ar ? `${source.title.ar} (نسخة)` : "",
      },
      slug: `${source.slug}-copie-${Date.now()}`,
      status: "draft" as ServiceStatus,
      featured: false,
      submittedBy: null,
      submittedAt: null,
      reviewedBy: null,
      reviewedAt: null,
      reviewNote: null,
      publishedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_SERVICES.push(copy);
    return copy;
  },

  async deleteService(id: number): Promise<void> {
    await delay();
    const idx = MOCK_SERVICES.findIndex((s) => s.id === id);
    if (idx !== -1) {
      MOCK_SERVICES.splice(idx, 1);
    }
  },

  async archiveService(id: number): Promise<Service> {
    await delay();
    const idx = MOCK_SERVICES.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Service not found");
    MOCK_SERVICES[idx] = {
      ...MOCK_SERVICES[idx],
      status: "archived",
      updatedAt: new Date().toISOString(),
    };
    return MOCK_SERVICES[idx];
  },

  async updateServiceStatus(
    id: number,
    status: ServiceStatus,
    meta?: { reviewedBy?: string; reviewNote?: string; publishedAt?: string }
  ): Promise<Service> {
    await delay();
    const idx = MOCK_SERVICES.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Service not found");
    const now = new Date().toISOString();
    const updates: Partial<Service> = { status, updatedAt: now };
    if (status === "pending_review") {
      updates.submittedAt = now;
    }
    if (status === "approved" || status === "changes_requested") {
      updates.reviewedBy = meta?.reviewedBy ?? null;
      updates.reviewedAt = now;
      updates.reviewNote = meta?.reviewNote ?? null;
    }
    if (status === "published") {
      updates.publishedAt = meta?.publishedAt ?? now;
    }
    MOCK_SERVICES[idx] = { ...MOCK_SERVICES[idx], ...updates };
    return MOCK_SERVICES[idx];
  },

  async reorderServices(orderedIds: number[]): Promise<void> {
    await delay();
    orderedIds.forEach((id, index) => {
      const svc = MOCK_SERVICES.find((s) => s.id === id);
      if (svc) svc.order = index + 1;
    });
  },

  // ── Solutions ──

  async getSolutions(): Promise<Solution[]> {
    await delay();
    return [...MOCK_SOLUTIONS];
  },

  async getSolutionById(id: number): Promise<Solution | undefined> {
    await delay();
    return MOCK_SOLUTIONS.find((s) => s.id === id);
  },

  async createSolution(data: Omit<Solution, "id" | "createdAt" | "updatedAt">): Promise<Solution> {
    await delay();
    const newSolution: Solution = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_SOLUTIONS.push(newSolution);
    return newSolution;
  },

  async updateSolution(id: number, data: Partial<Solution>): Promise<Solution> {
    await delay();
    const idx = MOCK_SOLUTIONS.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Solution not found");
    const updated: Solution = {
      ...MOCK_SOLUTIONS[idx],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    MOCK_SOLUTIONS[idx] = updated;
    return updated;
  },

  async duplicateSolution(id: number): Promise<Solution> {
    await delay();
    const source = MOCK_SOLUTIONS.find((s) => s.id === id);
    if (!source) throw new Error("Solution not found");
    const copy: Solution = {
      ...JSON.parse(JSON.stringify(source)),
      id: Date.now(),
      title: {
        fr: `${source.title.fr} (copie)`,
        en: source.title.en ? `${source.title.en} (copy)` : "",
        ar: source.title.ar ? `${source.title.ar} (نسخة)` : "",
      },
      slug: `${source.slug}-copie-${Date.now()}`,
      status: "draft" as SolutionStatus,
      featured: false,
      submittedBy: null,
      submittedAt: null,
      reviewedBy: null,
      reviewedAt: null,
      reviewNote: null,
      publishedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_SOLUTIONS.push(copy);
    return copy;
  },

  async deleteSolution(id: number): Promise<void> {
    await delay();
    const idx = MOCK_SOLUTIONS.findIndex((s) => s.id === id);
    if (idx !== -1) {
      MOCK_SOLUTIONS.splice(idx, 1);
    }
  },

  async archiveSolution(id: number): Promise<Solution> {
    await delay();
    const idx = MOCK_SOLUTIONS.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Solution not found");
    MOCK_SOLUTIONS[idx] = {
      ...MOCK_SOLUTIONS[idx],
      status: "archived",
      updatedAt: new Date().toISOString(),
    };
    return MOCK_SOLUTIONS[idx];
  },

  async updateSolutionStatus(
    id: number,
    status: SolutionStatus,
    meta?: { reviewedBy?: string; reviewNote?: string; publishedAt?: string }
  ): Promise<Solution> {
    await delay();
    const idx = MOCK_SOLUTIONS.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Solution not found");
    const now = new Date().toISOString();
    const updates: Partial<Solution> = { status, updatedAt: now };
    if (status === "pending_review") {
      updates.submittedAt = now;
    }
    if (status === "approved" || status === "changes_requested") {
      updates.reviewedBy = meta?.reviewedBy ?? null;
      updates.reviewedAt = now;
      updates.reviewNote = meta?.reviewNote ?? null;
    }
    if (status === "published") {
      updates.publishedAt = meta?.publishedAt ?? now;
    }
    MOCK_SOLUTIONS[idx] = { ...MOCK_SOLUTIONS[idx], ...updates };
    return MOCK_SOLUTIONS[idx];
  },

  async reorderSolutions(orderedIds: number[]): Promise<void> {
    await delay();
    orderedIds.forEach((id, index) => {
      const sol = MOCK_SOLUTIONS.find((s) => s.id === id);
      if (sol) sol.order = index + 1;
    });
  },

  // ── Media Library ──

  async getMediaAssets(): Promise<MediaAsset[]> {
    await delay();
    return [...MOCK_MEDIA_ASSETS];
  },

  async getMediaAssetById(id: number): Promise<MediaAsset | undefined> {
    await delay();
    return MOCK_MEDIA_ASSETS.find((m) => m.id === id);
  },

  async createMediaAsset(data: Omit<MediaAsset, "id" | "createdAt" | "updatedAt">): Promise<MediaAsset> {
    await delay();
    const asset: MediaAsset = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_MEDIA_ASSETS.push(asset);
    return asset;
  },

  async updateMediaAsset(id: number, data: Partial<MediaAsset>): Promise<MediaAsset> {
    await delay();
    const idx = MOCK_MEDIA_ASSETS.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error("Media asset not found");
    const updated: MediaAsset = {
      ...MOCK_MEDIA_ASSETS[idx],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    MOCK_MEDIA_ASSETS[idx] = updated;
    return updated;
  },

  async duplicateMediaAsset(id: number): Promise<MediaAsset> {
    await delay();
    const source = MOCK_MEDIA_ASSETS.find((m) => m.id === id);
    if (!source) throw new Error("Media asset not found");
    const copy: MediaAsset = {
      ...JSON.parse(JSON.stringify(source)),
      id: Date.now(),
      name: `${source.name}-copie`,
      status: "active" as MediaStatus,
      usageReferences: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_MEDIA_ASSETS.push(copy);
    return copy;
  },

  async archiveMediaAsset(id: number): Promise<MediaAsset> {
    await delay();
    const idx = MOCK_MEDIA_ASSETS.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error("Media asset not found");
    MOCK_MEDIA_ASSETS[idx] = { ...MOCK_MEDIA_ASSETS[idx], status: "archived", updatedAt: new Date().toISOString() };
    return MOCK_MEDIA_ASSETS[idx];
  },

  async restoreMediaAsset(id: number): Promise<MediaAsset> {
    await delay();
    const idx = MOCK_MEDIA_ASSETS.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error("Media asset not found");
    MOCK_MEDIA_ASSETS[idx] = { ...MOCK_MEDIA_ASSETS[idx], status: "active", updatedAt: new Date().toISOString() };
    return MOCK_MEDIA_ASSETS[idx];
  },

  async deleteMediaAsset(id: number): Promise<void> {
    await delay();
    const idx = MOCK_MEDIA_ASSETS.findIndex((m) => m.id === id);
    if (idx !== -1) MOCK_MEDIA_ASSETS.splice(idx, 1);
  },

  async bulkArchiveMediaAssets(ids: number[]): Promise<void> {
    await delay();
    ids.forEach((id) => {
      const m = MOCK_MEDIA_ASSETS.find((a) => a.id === id);
      if (m) { m.status = "archived"; m.updatedAt = new Date().toISOString(); }
    });
  },

  async bulkDeleteMediaAssets(ids: number[]): Promise<void> {
    await delay();
    ids.forEach((id) => {
      const idx = MOCK_MEDIA_ASSETS.findIndex((a) => a.id === id);
      if (idx !== -1) MOCK_MEDIA_ASSETS.splice(idx, 1);
    });
  },
};
