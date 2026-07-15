import {
  MOCK_KPI_DATA,
  MOCK_ACTIVITIES,
  MOCK_LEADS,
  MOCK_LEAD_NOTES,
  MOCK_SUBSCRIBERS,
  MOCK_CATEGORIES,
  MOCK_POSTS,
  MOCK_SYSTEM_USERS,
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
};
