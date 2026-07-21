import type { UserRole } from "../context/AuthContext";

export type Resource =
  | "dashboard"
  | "leads"
  | "subscribers"
  | "blog"
  | "categories"
  | "services"
  | "users"
  | "settings";

export type Action = "view" | "create" | "edit" | "delete" | "export";

const ALL_ACTIONS: Action[] = ["view", "create", "edit", "delete", "export"];

const PERMISSIONS_MATRIX: Record<UserRole, Partial<Record<Resource, Action[]>>> = {
  super_admin: {
    dashboard: ALL_ACTIONS,
    leads: ALL_ACTIONS,
    subscribers: ALL_ACTIONS,
    blog: ALL_ACTIONS,
    categories: ALL_ACTIONS,
    services: ALL_ACTIONS,
    users: ALL_ACTIONS,
    settings: ALL_ACTIONS,
  },
  admin: {
    dashboard: ALL_ACTIONS,
    leads: ALL_ACTIONS,
    subscribers: ALL_ACTIONS,
    blog: ALL_ACTIONS,
    categories: ALL_ACTIONS,
    services: ALL_ACTIONS,
    users: ALL_ACTIONS,
    settings: ALL_ACTIONS,
  },
  editor: {
    dashboard: ["view"],
    blog: ALL_ACTIONS,
    categories: ALL_ACTIONS,
    services: ["view", "create", "edit"],
  },
  support: {
    dashboard: ["view"],
    leads: ["view", "edit", "export"],
    subscribers: ALL_ACTIONS,
  },
  viewer: {
    dashboard: ["view"],
    leads: ["view"],
    subscribers: ["view"],
    blog: ["view"],
    categories: ["view"],
    services: ["view"],
  },
  reader: {
    dashboard: ["view"],
    leads: ["view"],
    subscribers: ["view"],
    blog: ["view"],
    categories: ["view"],
    services: ["view"],
  },
};

export function hasPermission(role: UserRole, resource: Resource, action: Action): boolean {
  const rolePermissions = PERMISSIONS_MATRIX[role];
  if (!rolePermissions) return false;

  const resourceActions = rolePermissions[resource];
  if (!resourceActions) return false;

  return resourceActions.includes(action);
}
