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
  MOCK_ADMIN_PROFILES,
  MOCK_ACCOUNT_SESSIONS,
  MOCK_ADMIN_NOTIFICATIONS,
  MOCK_NOTIFICATION_PREFERENCES,
  MOCK_ADMIN_AUDIT_EVENTS,
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
  AdminProfile,
  MockAccountSession,
  AdminNotification,
  NotificationPreferences,
  AdminAuditEvent,
  AnalyticsDateRange,
  AnalyticsMetric,
  AnalyticsTimeSeriesPoint,
  AnalyticsBreakdownItem,
  AnalyticsBreakdownGroup,
  AnalyticsReportSection,
  AnalyticsOverview,
  AnalyticsFilterOptions,
  AnalyticsSectionId,
  AnalyticsExportReport,
  AnalyticsExportRow,
} from "../types/admin";
import type { UserRole } from "../context/AuthContext";

// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const DAY_MS = 24 * 60 * 60 * 1000;

const ANALYTICS_RANGE_OPTIONS: AnalyticsFilterOptions["ranges"] = [
  { value: "7d", label: "7 derniers jours" },
  { value: "30d", label: "30 derniers jours" },
  { value: "90d", label: "90 derniers jours" },
  { value: "all", label: "Toutes les données" },
];

const ANALYTICS_CAPABILITIES: Record<UserRole, { sections: AnalyticsSectionId[]; canExport: boolean }> = {
  super_admin: {
    sections: ["content", "media", "leads", "subscribers", "users", "notifications", "audit"],
    canExport: true,
  },
  admin: {
    sections: ["content", "media", "leads", "subscribers", "users", "notifications", "audit"],
    canExport: true,
  },
  editor: { sections: ["content", "media"], canExport: false },
  support: { sections: ["leads", "subscribers", "notifications"], canExport: false },
  viewer: { sections: ["content", "media", "leads", "subscribers"], canExport: false },
  reader: { sections: [], canExport: false },
};

interface AnalyticsDateWindow {
  range: AnalyticsDateRange;
  start: number | null;
  endExclusive: number | null;
  previousStart: number | null;
  previousEndExclusive: number | null;
}

function getAnalyticsDateWindow(range: AnalyticsDateRange, now = new Date()): AnalyticsDateWindow {
  if (range === "all") {
    return { range, start: null, endExclusive: null, previousStart: null, previousEndExclusive: null };
  }

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const end = new Date(now);
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() + 1);
  const endExclusive = end.getTime();
  const start = endExclusive - days * DAY_MS;

  return {
    range,
    start,
    endExclusive,
    previousStart: start - days * DAY_MS,
    previousEndExclusive: start,
  };
}

function safeTimestamp(value: string | null | undefined): number | null {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function filterRecordsByDate<T>(
  records: readonly T[],
  getDate: (record: T) => string | null | undefined,
  window: AnalyticsDateWindow,
  previous = false
): T[] {
  const start = previous ? window.previousStart : window.start;
  const end = previous ? window.previousEndExclusive : window.endExclusive;

  return records.filter((record) => {
    const timestamp = safeTimestamp(getDate(record));
    if (timestamp === null) return false;
    if (start === null || end === null) return !previous;
    return timestamp >= start && timestamp < end;
  });
}

function calculateDifference(
  value: number | null,
  previousValue: number | null
): Pick<AnalyticsMetric, "difference" | "differencePercentage" | "trend"> {
  if (value === null || previousValue === null) {
    return { difference: null, differencePercentage: null, trend: "unavailable" };
  }

  const difference = value - previousValue;
  return {
    difference,
    differencePercentage: previousValue === 0 ? null : (difference / previousValue) * 100,
    trend: difference > 0 ? "up" : difference < 0 ? "down" : "stable",
  };
}

function createMetric(
  id: string,
  label: string,
  value: number | null,
  previousValue: number | null,
  description: string,
  format: AnalyticsMetric["format"] = "number"
): AnalyticsMetric {
  return {
    id,
    label,
    value,
    previousValue,
    ...calculateDifference(value, previousValue),
    description,
    format,
    isDemo: true,
  };
}

function createBreakdown(
  entries: Array<{ id: string; label: string; value: number }>
): AnalyticsBreakdownItem[] {
  const total = entries.reduce((sum, entry) => sum + entry.value, 0);
  return entries.map((entry) => ({
    ...entry,
    percentage: total === 0 ? 0 : (entry.value / total) * 100,
  }));
}

function formatShortDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function buildTimeSeries(dateValues: Array<string | null | undefined>, window: AnalyticsDateWindow): AnalyticsTimeSeriesPoint[] {
  const timestamps = dateValues
    .map(safeTimestamp)
    .filter((timestamp): timestamp is number => timestamp !== null)
    .filter((timestamp) => {
      if (window.start === null || window.endExclusive === null) return true;
      return timestamp >= window.start && timestamp < window.endExclusive;
    });

  if (window.range === "all") {
    if (timestamps.length === 0) return [];
    const first = new Date(Math.min(...timestamps));
    const last = new Date(Math.max(...timestamps));
    let year = first.getFullYear();
    let month = first.getMonth();
    const endYear = last.getFullYear();
    const endMonth = last.getMonth();
    const points: AnalyticsTimeSeriesPoint[] = [];

    while (year < endYear || (year === endYear && month <= endMonth)) {
      const bucketStart = new Date(year, month, 1).getTime();
      const bucketEnd = new Date(year, month + 1, 1).getTime();
      points.push({
        date: new Date(bucketStart).toISOString().slice(0, 10),
        label: new Date(bucketStart).toLocaleDateString("fr-FR", { month: "short", year: "numeric" }),
        value: timestamps.filter((timestamp) => timestamp >= bucketStart && timestamp < bucketEnd).length,
      });
      month += 1;
      if (month === 12) {
        month = 0;
        year += 1;
      }
    }
    return points;
  }

  if (window.start === null || window.endExclusive === null) return [];
  const bucketDays = window.range === "90d" ? 7 : 1;
  const bucketMs = bucketDays * DAY_MS;
  const bucketCount = Math.ceil((window.endExclusive - window.start) / bucketMs);

  return Array.from({ length: bucketCount }, (_, index) => {
    const bucketStart = window.start! + index * bucketMs;
    const bucketEnd = Math.min(bucketStart + bucketMs, window.endExclusive!);
    return {
      date: new Date(bucketStart).toISOString().slice(0, 10),
      label: bucketDays === 1
        ? formatShortDate(bucketStart)
        : `${formatShortDate(bucketStart)} - ${formatShortDate(bucketEnd - 1)}`,
      value: timestamps.filter((timestamp) => timestamp >= bucketStart && timestamp < bucketEnd).length,
    };
  });
}

function getVisibleNotifications(userId: number, role: UserRole): AdminNotification[] {
  return MOCK_ADMIN_NOTIFICATIONS.filter(
    (notification) =>
      notification.recipientUserId === userId ||
      notification.recipientRole === role ||
      (!notification.recipientUserId && !notification.recipientRole)
  );
}

function countInvalidDates(values: Array<string | null | undefined>): number {
  return values.filter((value) => value !== null && value !== undefined && safeTimestamp(value) === null).length;
}

function getRangeLabel(range: AnalyticsDateRange): string {
  return ANALYTICS_RANGE_OPTIONS.find((option) => option.value === range)?.label ?? "Toutes les données";
}

function previousOrUnavailable(window: AnalyticsDateWindow, value: number): number | null {
  return window.range === "all" ? null : value;
}

function buildContentAnalytics(window: AnalyticsDateWindow): AnalyticsReportSection {
  const posts = filterRecordsByDate(MOCK_POSTS, (item) => item.created_at, window);
  const previousPosts = filterRecordsByDate(MOCK_POSTS, (item) => item.created_at, window, true);
  const services = filterRecordsByDate(MOCK_SERVICES, (item) => item.createdAt, window);
  const previousServices = filterRecordsByDate(MOCK_SERVICES, (item) => item.createdAt, window, true);
  const solutions = filterRecordsByDate(MOCK_SOLUTIONS, (item) => item.createdAt, window);
  const previousSolutions = filterRecordsByDate(MOCK_SOLUTIONS, (item) => item.createdAt, window, true);
  const categoryCount = window.range === "all" ? MOCK_CATEGORIES.length : null;

  const metrics: AnalyticsMetric[] = [
    createMetric("posts-total", "Articles créés", posts.length, previousOrUnavailable(window, previousPosts.length), "Articles dont la date de création appartient à la période."),
    createMetric("posts-published", "Articles publiés", posts.filter((item) => item.status === "published").length, previousOrUnavailable(window, previousPosts.filter((item) => item.status === "published").length), "Articles créés dans la période et actuellement publiés."),
    createMetric("posts-draft", "Articles en brouillon", posts.filter((item) => item.status === "draft").length, previousOrUnavailable(window, previousPosts.filter((item) => item.status === "draft").length), "Articles créés dans la période et actuellement en brouillon."),
    createMetric("posts-archived", "Articles archivés", posts.filter((item) => item.status === "archived").length, previousOrUnavailable(window, previousPosts.filter((item) => item.status === "archived").length), "Articles créés dans la période et actuellement archivés."),
    createMetric("categories-total", "Catégories", categoryCount, null, categoryCount === null ? "Donnée indisponible en mode démonstration pour une période bornée, car les catégories ne possèdent pas d’horodatage." : "Nombre actuel de catégories dans les données frontend."),
    createMetric("services-total", "Services créés", services.length, previousOrUnavailable(window, previousServices.length), "Services dont la date de création appartient à la période."),
    createMetric("services-published", "Services publiés", services.filter((item) => item.status === "published").length, previousOrUnavailable(window, previousServices.filter((item) => item.status === "published").length), "Services créés dans la période et actuellement publiés."),
    createMetric("services-pending", "Services en révision", services.filter((item) => item.status === "pending_review").length, previousOrUnavailable(window, previousServices.filter((item) => item.status === "pending_review").length), "Services créés dans la période et actuellement en attente de révision."),
    createMetric("solutions-total", "Solutions créées", solutions.length, previousOrUnavailable(window, previousSolutions.length), "Solutions dont la date de création appartient à la période."),
    createMetric("solutions-published", "Solutions publiées", solutions.filter((item) => item.status === "published").length, previousOrUnavailable(window, previousSolutions.filter((item) => item.status === "published").length), "Solutions créées dans la période et actuellement publiées."),
    createMetric("solutions-pending", "Solutions en révision", solutions.filter((item) => item.status === "pending_review").length, previousOrUnavailable(window, previousSolutions.filter((item) => item.status === "pending_review").length), "Solutions créées dans la période et actuellement en attente de révision."),
  ];

  const breakdowns: AnalyticsBreakdownGroup[] = [
    {
      id: "posts-status",
      title: "Articles par statut",
      description: "Répartition des articles créés pendant la période selon leur statut actuel.",
      items: createBreakdown([
        { id: "draft", label: "Brouillon", value: posts.filter((item) => item.status === "draft").length },
        { id: "published", label: "Publié", value: posts.filter((item) => item.status === "published").length },
        { id: "archived", label: "Archivé", value: posts.filter((item) => item.status === "archived").length },
      ]),
    },
    {
      id: "services-status",
      title: "Services par statut",
      description: "États de workflow des services créés pendant la période.",
      items: createBreakdown([
        { id: "draft", label: "Brouillon", value: services.filter((item) => item.status === "draft").length },
        { id: "pending_review", label: "En révision", value: services.filter((item) => item.status === "pending_review").length },
        { id: "changes_requested", label: "Modifications demandées", value: services.filter((item) => item.status === "changes_requested").length },
        { id: "approved", label: "Approuvé", value: services.filter((item) => item.status === "approved").length },
        { id: "published", label: "Publié", value: services.filter((item) => item.status === "published").length },
        { id: "archived", label: "Archivé", value: services.filter((item) => item.status === "archived").length },
      ]),
    },
    {
      id: "solutions-status",
      title: "Solutions par statut",
      description: "États de workflow des solutions créées pendant la période.",
      items: createBreakdown([
        { id: "draft", label: "Brouillon", value: solutions.filter((item) => item.status === "draft").length },
        { id: "pending_review", label: "En révision", value: solutions.filter((item) => item.status === "pending_review").length },
        { id: "changes_requested", label: "Modifications demandées", value: solutions.filter((item) => item.status === "changes_requested").length },
        { id: "approved", label: "Approuvé", value: solutions.filter((item) => item.status === "approved").length },
        { id: "published", label: "Publié", value: solutions.filter((item) => item.status === "published").length },
        { id: "archived", label: "Archivé", value: solutions.filter((item) => item.status === "archived").length },
      ]),
    },
  ];

  return {
    id: "content",
    title: "Contenu",
    description: "Articles, catégories, services et solutions calculés depuis les collections frontend autorisées.",
    metrics,
    breakdowns,
    trend: buildTimeSeries([
      ...MOCK_POSTS.map((item) => item.created_at),
      ...MOCK_SERVICES.map((item) => item.createdAt),
      ...MOCK_SOLUTIONS.map((item) => item.createdAt),
    ], window),
    trendTitle: "Contenus créés dans le temps",
    trendDescription: "Nombre quotidien, hebdomadaire ou mensuel d’articles, services et solutions créés.",
    tableColumns: [
      { key: "total", label: "Total", numeric: true, sortable: true },
      { key: "draft", label: "Brouillon", numeric: true, sortable: true },
      { key: "pending", label: "En révision", numeric: true, sortable: true },
      { key: "published", label: "Publié", numeric: true, sortable: true },
      { key: "archived", label: "Archivé", numeric: true, sortable: true },
    ],
    tableRows: [
      { id: "posts", label: "Articles", values: { total: posts.length, draft: posts.filter((item) => item.status === "draft").length, pending: "Non applicable", published: posts.filter((item) => item.status === "published").length, archived: posts.filter((item) => item.status === "archived").length } },
      { id: "categories", label: "Catégories", values: { total: categoryCount ?? "Indisponible", draft: "Non applicable", pending: "Non applicable", published: "Non applicable", archived: "Non applicable" } },
      { id: "services", label: "Services", values: { total: services.length, draft: services.filter((item) => item.status === "draft").length, pending: services.filter((item) => item.status === "pending_review").length, published: services.filter((item) => item.status === "published").length, archived: services.filter((item) => item.status === "archived").length } },
      { id: "solutions", label: "Solutions", values: { total: solutions.length, draft: solutions.filter((item) => item.status === "draft").length, pending: solutions.filter((item) => item.status === "pending_review").length, published: solutions.filter((item) => item.status === "published").length, archived: solutions.filter((item) => item.status === "archived").length } },
    ],
    authorized: true,
  };
}

function buildMediaAnalytics(window: AnalyticsDateWindow): AnalyticsReportSection {
  const media = filterRecordsByDate(MOCK_MEDIA_ASSETS, (item) => item.createdAt, window);
  const previousMedia = filterRecordsByDate(MOCK_MEDIA_ASSETS, (item) => item.createdAt, window, true);
  const totalBytes = media.reduce((sum, item) => sum + item.sizeBytes, 0);
  const previousBytes = previousMedia.reduce((sum, item) => sum + item.sizeBytes, 0);

  const metrics: AnalyticsMetric[] = [
    createMetric("media-total", "Médias ajoutés", media.length, previousOrUnavailable(window, previousMedia.length), "Fichiers média dont la date de création appartient à la période."),
    createMetric("media-active", "Médias actifs", media.filter((item) => item.status === "active").length, previousOrUnavailable(window, previousMedia.filter((item) => item.status === "active").length), "Médias ajoutés dans la période et actuellement actifs."),
    createMetric("media-archived", "Médias archivés", media.filter((item) => item.status === "archived").length, previousOrUnavailable(window, previousMedia.filter((item) => item.status === "archived").length), "Médias ajoutés dans la période et actuellement archivés."),
    createMetric("media-used", "Médias utilisés", media.filter((item) => item.usageReferences.length > 0).length, previousOrUnavailable(window, previousMedia.filter((item) => item.usageReferences.length > 0).length), "Médias possédant au moins une référence d’utilisation."),
    createMetric("media-unused", "Médias non utilisés", media.filter((item) => item.usageReferences.length === 0).length, previousOrUnavailable(window, previousMedia.filter((item) => item.usageReferences.length === 0).length), "Médias sans référence d’utilisation dans les données frontend."),
    createMetric("media-images", "Images", media.filter((item) => item.mediaType === "image").length, previousOrUnavailable(window, previousMedia.filter((item) => item.mediaType === "image").length), "Images ajoutées dans la période."),
    createMetric("media-documents", "Documents", media.filter((item) => item.mediaType === "document").length, previousOrUnavailable(window, previousMedia.filter((item) => item.mediaType === "document").length), "Documents ajoutés dans la période."),
    createMetric("media-videos", "Vidéos", media.filter((item) => item.mediaType === "video").length, previousOrUnavailable(window, previousMedia.filter((item) => item.mediaType === "video").length), "Vidéos ajoutées dans la période."),
    createMetric("media-size", "Taille totale simulée", totalBytes, previousOrUnavailable(window, previousBytes), "Somme des tailles déclarées par les fichiers média de la période.", "bytes"),
  ];

  const breakdowns: AnalyticsBreakdownGroup[] = [
    {
      id: "media-type",
      title: "Médias par type",
      description: "Répartition des médias ajoutés pendant la période.",
      items: createBreakdown([
        { id: "image", label: "Images", value: media.filter((item) => item.mediaType === "image").length },
        { id: "document", label: "Documents", value: media.filter((item) => item.mediaType === "document").length },
        { id: "video", label: "Vidéos", value: media.filter((item) => item.mediaType === "video").length },
      ]),
    },
    {
      id: "media-status",
      title: "Médias par statut",
      description: "Statut actuel des médias ajoutés pendant la période.",
      items: createBreakdown([
        { id: "active", label: "Actifs", value: media.filter((item) => item.status === "active").length },
        { id: "archived", label: "Archivés", value: media.filter((item) => item.status === "archived").length },
      ]),
    },
  ];

  return {
    id: "media",
    title: "Médias",
    description: "Volumes, usages, types et statuts calculés depuis la médiathèque frontend.",
    metrics,
    breakdowns,
    trend: buildTimeSeries(MOCK_MEDIA_ASSETS.map((item) => item.createdAt), window),
    trendTitle: "Médias ajoutés dans le temps",
    trendDescription: "Nombre de médias créés par intervalle dans la période sélectionnée.",
    tableColumns: [
      { key: "total", label: "Total", numeric: true, sortable: true },
      { key: "active", label: "Actifs", numeric: true, sortable: true },
      { key: "archived", label: "Archivés", numeric: true, sortable: true },
      { key: "used", label: "Utilisés", numeric: true, sortable: true },
      { key: "unused", label: "Non utilisés", numeric: true, sortable: true },
      { key: "size", label: "Taille simulée", sortable: true },
    ],
    tableRows: (["image", "document", "video"] as const).map((type) => {
      const items = media.filter((item) => item.mediaType === type);
      return {
        id: type,
        label: type === "image" ? "Images" : type === "document" ? "Documents" : "Vidéos",
        values: {
          total: items.length,
          active: items.filter((item) => item.status === "active").length,
          archived: items.filter((item) => item.status === "archived").length,
          used: items.filter((item) => item.usageReferences.length > 0).length,
          unused: items.filter((item) => item.usageReferences.length === 0).length,
          size: items.reduce((sum, item) => sum + item.sizeBytes, 0),
        },
      };
    }),
    authorized: true,
  };
}

function buildLeadAnalytics(window: AnalyticsDateWindow): AnalyticsReportSection {
  const leads = filterRecordsByDate(MOCK_LEADS, (item) => item.created_at, window);
  const previousLeads = filterRecordsByDate(MOCK_LEADS, (item) => item.created_at, window, true);
  const statusCount = (status: LeadStatus) => leads.filter((item) => item.status === status).length;
  const previousStatusCount = (status: LeadStatus) => previousLeads.filter((item) => item.status === status).length;

  return {
    id: "leads",
    title: "Prospects",
    description: "Comptages opérationnels agrégés sans noms, messages, coordonnées ou autres détails privés.",
    metrics: [
      createMetric("leads-total", "Prospects reçus", leads.length, previousOrUnavailable(window, previousLeads.length), "Prospects dont la date de création appartient à la période."),
      createMetric("leads-new", "Nouveaux prospects", statusCount("new"), previousOrUnavailable(window, previousStatusCount("new")), "Prospects créés dans la période et actuellement nouveaux."),
      createMetric("leads-progress", "Prospects en cours", statusCount("in_progress"), previousOrUnavailable(window, previousStatusCount("in_progress")), "Prospects créés dans la période et actuellement en cours de traitement."),
      createMetric("leads-resolved", "Prospects résolus", statusCount("resolved"), previousOrUnavailable(window, previousStatusCount("resolved")), "Prospects créés dans la période et actuellement résolus."),
      createMetric("leads-archived", "Prospects archivés", statusCount("archived"), previousOrUnavailable(window, previousStatusCount("archived")), "Prospects créés dans la période et actuellement archivés."),
    ],
    breakdowns: [{
      id: "leads-status",
      title: "Prospects par statut",
      description: "Répartition utilisant uniquement les statuts réellement définis dans le frontend.",
      items: createBreakdown([
        { id: "new", label: "Nouveau", value: statusCount("new") },
        { id: "in_progress", label: "En cours", value: statusCount("in_progress") },
        { id: "resolved", label: "Résolu", value: statusCount("resolved") },
        { id: "archived", label: "Archivé", value: statusCount("archived") },
      ]),
    }],
    trend: buildTimeSeries(MOCK_LEADS.map((item) => item.created_at), window),
    trendTitle: "Prospects reçus dans le temps",
    trendDescription: "Nombre de prospects créés par intervalle, sans exposer de données personnelles.",
    tableColumns: [
      { key: "total", label: "Total", numeric: true, sortable: true },
      { key: "new", label: "Nouveaux", numeric: true, sortable: true },
      { key: "progress", label: "En cours", numeric: true, sortable: true },
      { key: "resolved", label: "Résolus", numeric: true, sortable: true },
      { key: "archived", label: "Archivés", numeric: true, sortable: true },
    ],
    tableRows: [{ id: "leads", label: "Prospects", values: { total: leads.length, new: statusCount("new"), progress: statusCount("in_progress"), resolved: statusCount("resolved"), archived: statusCount("archived") } }],
    authorized: true,
  };
}

function buildSubscriberAnalytics(window: AnalyticsDateWindow): AnalyticsReportSection {
  const subscribers = filterRecordsByDate(MOCK_SUBSCRIBERS, (item) => item.subscribed_at, window);
  const previousSubscribers = filterRecordsByDate(MOCK_SUBSCRIBERS, (item) => item.subscribed_at, window, true);
  const active = subscribers.filter((item) => item.is_active).length;
  const inactive = subscribers.length - active;
  const previousActive = previousSubscribers.filter((item) => item.is_active).length;
  const previousInactive = previousSubscribers.length - previousActive;

  return {
    id: "subscribers",
    title: "Abonnements newsletter",
    description: "Agrégats d’abonnement calculés sans exposer les adresses électroniques.",
    metrics: [
      createMetric("subscribers-total", "Abonnements enregistrés", subscribers.length, previousOrUnavailable(window, previousSubscribers.length), "Abonnements dont la date d’inscription appartient à la période."),
      createMetric("subscribers-active", "Abonnements actifs", active, previousOrUnavailable(window, previousActive), "Abonnements de la période actuellement actifs."),
      createMetric("subscribers-inactive", "Abonnements inactifs", inactive, previousOrUnavailable(window, previousInactive), "Abonnements de la période actuellement désactivés."),
    ],
    breakdowns: [{
      id: "subscribers-status",
      title: "Abonnements par statut",
      description: "État actuel des abonnements enregistrés pendant la période.",
      items: createBreakdown([
        { id: "active", label: "Actifs", value: active },
        { id: "inactive", label: "Inactifs", value: inactive },
      ]),
    }],
    trend: buildTimeSeries(MOCK_SUBSCRIBERS.map((item) => item.subscribed_at), window),
    trendTitle: "Abonnements enregistrés dans le temps",
    trendDescription: "Nombre d’inscriptions newsletter par intervalle, sans adresse électronique.",
    tableColumns: [
      { key: "total", label: "Total", numeric: true, sortable: true },
      { key: "active", label: "Actifs", numeric: true, sortable: true },
      { key: "inactive", label: "Inactifs", numeric: true, sortable: true },
    ],
    tableRows: [{ id: "subscribers", label: "Newsletter", values: { total: subscribers.length, active, inactive } }],
    authorized: true,
  };
}

function buildUserAnalytics(window: AnalyticsDateWindow): AnalyticsReportSection {
  const available = window.range === "all";
  const users = available ? [...MOCK_SYSTEM_USERS] : [];
  const roles: UserRole[] = ["super_admin", "admin", "editor", "support", "viewer", "reader"];
  const roleLabels: Record<UserRole, string> = {
    super_admin: "Super Admin",
    admin: "Administrateur",
    editor: "Éditeur",
    support: "Support",
    viewer: "Observateur",
    reader: "Lecteur",
  };

  return {
    id: "users",
    title: "Utilisateurs Admin",
    description: available
      ? "Instantané agrégé des comptes Admin actuels, sans noms ni adresses électroniques."
      : "Donnée indisponible en mode démonstration pour une période bornée, car les comptes ne possèdent pas de date de création.",
    metrics: [
      createMetric("users-total", "Utilisateurs Admin", available ? users.length : null, null, available ? "Nombre actuel de comptes Admin." : "Donnée indisponible en mode démonstration pour cette période."),
      createMetric("users-active", "Utilisateurs actifs", available ? users.filter((item) => item.is_active).length : null, null, available ? "Nombre actuel de comptes Admin actifs." : "Donnée indisponible en mode démonstration pour cette période."),
      createMetric("users-inactive", "Utilisateurs inactifs", available ? users.filter((item) => !item.is_active).length : null, null, available ? "Nombre actuel de comptes Admin inactifs." : "Donnée indisponible en mode démonstration pour cette période."),
    ],
    breakdowns: available ? [{
      id: "users-role",
      title: "Utilisateurs par rôle",
      description: "Répartition agrégée des comptes Admin actuels.",
      items: createBreakdown(roles.map((role) => ({ id: role, label: roleLabels[role], value: users.filter((item) => item.role === role).length }))),
    }] : [],
    trend: [],
    trendTitle: "Création des utilisateurs dans le temps",
    trendDescription: "Donnée indisponible en mode démonstration, aucune date de création utilisateur n’est enregistrée.",
    tableColumns: [
      { key: "total", label: "Total", numeric: true, sortable: true },
      { key: "active", label: "Actifs", numeric: true, sortable: true },
      { key: "inactive", label: "Inactifs", numeric: true, sortable: true },
    ],
    tableRows: available ? roles.map((role) => {
      const roleUsers = users.filter((item) => item.role === role);
      return { id: role, label: roleLabels[role], values: { total: roleUsers.length, active: roleUsers.filter((item) => item.is_active).length, inactive: roleUsers.filter((item) => !item.is_active).length } };
    }) : [],
    authorized: true,
  };
}

function buildNotificationAnalytics(userId: number, role: UserRole, window: AnalyticsDateWindow): AnalyticsReportSection {
  const visibleNotifications = getVisibleNotifications(userId, role);
  const notifications = filterRecordsByDate(visibleNotifications, (item) => item.createdAt, window);
  const previousNotifications = filterRecordsByDate(visibleNotifications, (item) => item.createdAt, window, true);
  const statuses = ["unread", "read", "archived"] as const;
  const types = ["system", "content", "review", "security", "lead", "media", "account"] as const;
  const typeLabels: Record<(typeof types)[number], string> = {
    system: "Système",
    content: "Contenu",
    review: "Révision",
    security: "Sécurité",
    lead: "Prospect",
    media: "Média",
    account: "Compte",
  };

  return {
    id: "notifications",
    title: "Notifications visibles",
    description: "Agrégats calculés uniquement depuis les notifications visibles pour l’utilisateur et son rôle.",
    metrics: [
      createMetric("notifications-total", "Notifications visibles", notifications.length, previousOrUnavailable(window, previousNotifications.length), "Notifications autorisées dont la date de création appartient à la période."),
      createMetric("notifications-unread", "Non lues", notifications.filter((item) => item.status === "unread").length, previousOrUnavailable(window, previousNotifications.filter((item) => item.status === "unread").length), "Notifications de la période actuellement non lues."),
      createMetric("notifications-read", "Lues", notifications.filter((item) => item.status === "read").length, previousOrUnavailable(window, previousNotifications.filter((item) => item.status === "read").length), "Notifications de la période actuellement lues."),
      createMetric("notifications-archived", "Archivées", notifications.filter((item) => item.status === "archived").length, previousOrUnavailable(window, previousNotifications.filter((item) => item.status === "archived").length), "Notifications de la période actuellement archivées."),
      createMetric("notifications-priority", "Priorité élevée ou critique", notifications.filter((item) => item.priority === "high" || item.priority === "critical").length, previousOrUnavailable(window, previousNotifications.filter((item) => item.priority === "high" || item.priority === "critical").length), "Notifications visibles classées avec une priorité élevée ou critique."),
    ],
    breakdowns: [
      {
        id: "notifications-status",
        title: "Notifications par statut",
        description: "Statut actuel des notifications visibles créées pendant la période.",
        items: createBreakdown(statuses.map((status) => ({ id: status, label: status === "unread" ? "Non lue" : status === "read" ? "Lue" : "Archivée", value: notifications.filter((item) => item.status === status).length }))),
      },
      {
        id: "notifications-type",
        title: "Notifications par type",
        description: "Types des notifications visibles créées pendant la période.",
        items: createBreakdown(types.map((type) => ({ id: type, label: typeLabels[type], value: notifications.filter((item) => item.type === type).length }))),
      },
    ],
    trend: buildTimeSeries(visibleNotifications.map((item) => item.createdAt), window),
    trendTitle: "Notifications visibles dans le temps",
    trendDescription: "Nombre de notifications autorisées créées par intervalle.",
    tableColumns: [
      { key: "total", label: "Total", numeric: true, sortable: true },
      { key: "unread", label: "Non lues", numeric: true, sortable: true },
      { key: "read", label: "Lues", numeric: true, sortable: true },
      { key: "archived", label: "Archivées", numeric: true, sortable: true },
    ],
    tableRows: types.map((type) => {
      const items = notifications.filter((item) => item.type === type);
      return { id: type, label: typeLabels[type], values: { total: items.length, unread: items.filter((item) => item.status === "unread").length, read: items.filter((item) => item.status === "read").length, archived: items.filter((item) => item.status === "archived").length } };
    }),
    authorized: true,
  };
}

function buildAuditAnalytics(window: AnalyticsDateWindow): AnalyticsReportSection {
  const events = filterRecordsByDate(MOCK_ADMIN_AUDIT_EVENTS, (item) => item.createdAt, window);
  const previousEvents = filterRecordsByDate(MOCK_ADMIN_AUDIT_EVENTS, (item) => item.createdAt, window, true);
  const outcomes = ["success", "denied", "failed"] as const;
  const severities = ["info", "warning", "critical"] as const;

  return {
    id: "audit",
    title: "Activité système",
    description: "Agrégats globaux d’événements autorisés, sans noms d’acteurs, adresses IP ni détails de modifications.",
    metrics: [
      createMetric("audit-total", "Événements autorisés", events.length, previousOrUnavailable(window, previousEvents.length), "Événements d’audit dont la date appartient à la période."),
      createMetric("audit-success", "Événements réussis", events.filter((item) => item.outcome === "success").length, previousOrUnavailable(window, previousEvents.filter((item) => item.outcome === "success").length), "Événements autorisés avec un résultat réussi."),
      createMetric("audit-denied", "Événements refusés", events.filter((item) => item.outcome === "denied").length, previousOrUnavailable(window, previousEvents.filter((item) => item.outcome === "denied").length), "Événements autorisés avec un résultat refusé."),
      createMetric("audit-failed", "Événements en échec", events.filter((item) => item.outcome === "failed").length, previousOrUnavailable(window, previousEvents.filter((item) => item.outcome === "failed").length), "Événements autorisés avec un résultat en échec."),
      createMetric("audit-session", "Session actuelle", events.filter((item) => item.source === "current_session").length, previousOrUnavailable(window, previousEvents.filter((item) => item.source === "current_session").length), "Événements temporaires ajoutés pendant la session frontend actuelle."),
    ],
    breakdowns: [
      {
        id: "audit-outcome",
        title: "Événements par résultat",
        description: "Répartition agrégée des résultats autorisés.",
        items: createBreakdown(outcomes.map((outcome) => ({ id: outcome, label: outcome === "success" ? "Réussi" : outcome === "denied" ? "Refusé" : "Échec", value: events.filter((item) => item.outcome === outcome).length }))),
      },
      {
        id: "audit-severity",
        title: "Événements par sévérité",
        description: "Répartition agrégée des niveaux de sévérité autorisés.",
        items: createBreakdown(severities.map((severity) => ({ id: severity, label: severity === "info" ? "Information" : severity === "warning" ? "Avertissement" : "Critique", value: events.filter((item) => item.severity === severity).length }))),
      },
    ],
    trend: buildTimeSeries(MOCK_ADMIN_AUDIT_EVENTS.map((item) => item.createdAt), window),
    trendTitle: "Événements d’audit dans le temps",
    trendDescription: "Nombre d’événements autorisés par intervalle, sans détails sensibles.",
    tableColumns: [
      { key: "total", label: "Total", numeric: true, sortable: true },
      { key: "success", label: "Réussis", numeric: true, sortable: true },
      { key: "denied", label: "Refusés", numeric: true, sortable: true },
      { key: "failed", label: "Échecs", numeric: true, sortable: true },
    ],
    tableRows: severities.map((severity) => {
      const items = events.filter((item) => item.severity === severity);
      return { id: severity, label: severity === "info" ? "Information" : severity === "warning" ? "Avertissement" : "Critique", values: { total: items.length, success: items.filter((item) => item.outcome === "success").length, denied: items.filter((item) => item.outcome === "denied").length, failed: items.filter((item) => item.outcome === "failed").length } };
    }),
    authorized: true,
  };
}

const OVERVIEW_METRIC_IDS = new Set([
  "posts-total",
  "services-total",
  "solutions-total",
  "media-total",
  "media-used",
  "leads-total",
  "leads-new",
  "subscribers-total",
  "subscribers-active",
  "users-total",
  "users-active",
  "notifications-total",
  "notifications-unread",
  "audit-total",
]);

function buildCombinedTrend(sections: AnalyticsReportSection[]): AnalyticsTimeSeriesPoint[] {
  const points = new Map<string, AnalyticsTimeSeriesPoint>();
  sections.forEach((section) => {
    section.trend.forEach((point) => {
      const current = points.get(point.date);
      points.set(point.date, current
        ? { ...current, value: current.value + point.value }
        : { ...point });
    });
  });
  return Array.from(points.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function countAuthorizedInvalidDates(
  userId: number,
  role: UserRole,
  authorizedSections: AnalyticsSectionId[]
): number {
  let invalid = 0;
  if (authorizedSections.includes("content")) {
    invalid += countInvalidDates(MOCK_POSTS.map((item) => item.created_at));
    invalid += countInvalidDates(MOCK_SERVICES.map((item) => item.createdAt));
    invalid += countInvalidDates(MOCK_SOLUTIONS.map((item) => item.createdAt));
  }
  if (authorizedSections.includes("media")) invalid += countInvalidDates(MOCK_MEDIA_ASSETS.map((item) => item.createdAt));
  if (authorizedSections.includes("leads")) invalid += countInvalidDates(MOCK_LEADS.map((item) => item.created_at));
  if (authorizedSections.includes("subscribers")) invalid += countInvalidDates(MOCK_SUBSCRIBERS.map((item) => item.subscribed_at));
  if (authorizedSections.includes("notifications")) invalid += countInvalidDates(getVisibleNotifications(userId, role).map((item) => item.createdAt));
  if (authorizedSections.includes("audit")) invalid += countInvalidDates(MOCK_ADMIN_AUDIT_EVENTS.map((item) => item.createdAt));
  return invalid;
}

function buildAnalyticsOverview(userId: number, role: UserRole, range: AnalyticsDateRange): AnalyticsOverview {
  const capability = ANALYTICS_CAPABILITIES[role];
  if (!capability || capability.sections.length === 0) {
    throw new Error("Analytics access denied");
  }

  const window = getAnalyticsDateWindow(range);
  const sections: AnalyticsReportSection[] = [];
  capability.sections.forEach((sectionId) => {
    if (sectionId === "content") sections.push(buildContentAnalytics(window));
    if (sectionId === "media") sections.push(buildMediaAnalytics(window));
    if (sectionId === "leads") sections.push(buildLeadAnalytics(window));
    if (sectionId === "subscribers") sections.push(buildSubscriberAnalytics(window));
    if (sectionId === "users") sections.push(buildUserAnalytics(window));
    if (sectionId === "notifications") sections.push(buildNotificationAnalytics(userId, role, window));
    if (sectionId === "audit") sections.push(buildAuditAnalytics(window));
  });

  return {
    range,
    generatedAt: new Date().toISOString(),
    overviewMetrics: sections.flatMap((section) => section.metrics.filter((metric) => OVERVIEW_METRIC_IDS.has(metric.id))),
    combinedTrend: buildCombinedTrend(sections),
    sections,
    ignoredInvalidDates: countAuthorizedInvalidDates(userId, role, capability.sections),
    isDemo: true,
  };
}

function buildAnalyticsExportRows(sections: AnalyticsReportSection[]): AnalyticsExportRow[] {
  return sections.flatMap((section) => [
    ...section.metrics.map((metric) => ({
      section: section.title,
      group: "Indicateurs",
      indicator: metric.label,
      value: metric.value ?? "Donnée indisponible en mode démonstration",
    })),
    ...section.breakdowns.flatMap((group) => group.items.map((item) => ({
      section: section.title,
      group: group.title,
      indicator: item.label,
      value: item.value,
    }))),
  ]);
}

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

  // ── Admin Profile & Account ──

  async getCurrentAdminProfile(userId: number): Promise<AdminProfile | undefined> {
    await delay();
    return MOCK_ADMIN_PROFILES.find((p) => p.userId === userId);
  },

  async updateCurrentAdminProfile(userId: number, data: Partial<AdminProfile>): Promise<AdminProfile> {
    await delay();
    const idx = MOCK_ADMIN_PROFILES.findIndex((p) => p.userId === userId);
    if (idx === -1) throw new Error("Profile not found");
    // Prevent editing protected fields
    const { loginEmail: _le, role: _r, userId: _u, id: _id, createdAt: _ca, ...safeData } = data as AdminProfile;
    const updated: AdminProfile = {
      ...MOCK_ADMIN_PROFILES[idx],
      ...safeData,
      updatedAt: new Date().toISOString(),
    };
    MOCK_ADMIN_PROFILES[idx] = updated;
    this.appendCurrentSessionAuditEvent({
      actorUserId: userId,
      actorDisplayName: updated.displayName || "Utilisateur",
      actorRole: updated.role,
      action: "profile_update",
      resourceType: "profile",
      resourceId: updated.id,
      resourceLabel: `Profil ${updated.displayName}`,
      description: "Mise à jour des informations personnelles du profil.",
      severity: "info",
      outcome: "success",
      ipLabel: "192.0.2.xxx",
      deviceLabel: "Navigateur actuel",
      sessionLabel: "Session actuelle",
    }).catch(() => {});
    return updated;
  },

  async updateAdminProfilePreferences(
    userId: number,
    prefs: Pick<AdminProfile, "language" | "theme" | "interfaceDensity" | "timezone" | "dateFormat" | "timeFormat">
  ): Promise<AdminProfile> {
    await delay();
    const idx = MOCK_ADMIN_PROFILES.findIndex((p) => p.userId === userId);
    if (idx === -1) throw new Error("Profile not found");
    MOCK_ADMIN_PROFILES[idx] = { ...MOCK_ADMIN_PROFILES[idx], ...prefs, updatedAt: new Date().toISOString() };
    this.appendCurrentSessionAuditEvent({
      actorUserId: userId,
      actorDisplayName: MOCK_ADMIN_PROFILES[idx].displayName || "Utilisateur",
      actorRole: MOCK_ADMIN_PROFILES[idx].role,
      action: "preference_update",
      resourceType: "profile",
      resourceId: MOCK_ADMIN_PROFILES[idx].id,
      resourceLabel: `Préférences ${MOCK_ADMIN_PROFILES[idx].displayName}`,
      description: "Mise à jour des préférences d'interface du profil.",
      severity: "info",
      outcome: "success",
      ipLabel: "192.0.2.xxx",
      deviceLabel: "Navigateur actuel",
      sessionLabel: "Session actuelle",
    }).catch(() => {});
    return MOCK_ADMIN_PROFILES[idx];
  },

  async updateAdminProfileAvatar(userId: number, avatarUrl: string): Promise<AdminProfile> {
    await delay();
    const idx = MOCK_ADMIN_PROFILES.findIndex((p) => p.userId === userId);
    if (idx === -1) throw new Error("Profile not found");
    MOCK_ADMIN_PROFILES[idx] = { ...MOCK_ADMIN_PROFILES[idx], avatarUrl, updatedAt: new Date().toISOString() };
    this.appendCurrentSessionAuditEvent({
      actorUserId: userId,
      actorDisplayName: MOCK_ADMIN_PROFILES[idx].displayName || "Utilisateur",
      actorRole: MOCK_ADMIN_PROFILES[idx].role,
      action: "avatar_update",
      resourceType: "profile",
      resourceId: MOCK_ADMIN_PROFILES[idx].id,
      resourceLabel: `Photo de profil ${MOCK_ADMIN_PROFILES[idx].displayName}`,
      description: "Modification de la photo de profil en mode démonstration.",
      severity: "info",
      outcome: "success",
      ipLabel: "192.0.2.xxx",
      deviceLabel: "Navigateur actuel",
      sessionLabel: "Session actuelle",
    }).catch(() => {});
    return MOCK_ADMIN_PROFILES[idx];
  },

  async removeAdminProfileAvatar(userId: number): Promise<AdminProfile> {
    await delay();
    const idx = MOCK_ADMIN_PROFILES.findIndex((p) => p.userId === userId);
    if (idx === -1) throw new Error("Profile not found");
    MOCK_ADMIN_PROFILES[idx] = { ...MOCK_ADMIN_PROFILES[idx], avatarUrl: "", updatedAt: new Date().toISOString() };
    return MOCK_ADMIN_PROFILES[idx];
  },

  async changeMockAccountPassword(
    _userId: number,
    input: { currentPassword: string; newPassword: string; confirmPassword: string }
  ): Promise<{ success: boolean }> {
    await delay();
    // Validate input shape only — never inspect or compare real credentials
    if (!input.currentPassword || !input.newPassword || !input.confirmPassword) {
      throw new Error("All password fields are required");
    }
    if (input.newPassword !== input.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    if (input.newPassword === input.currentPassword) {
      throw new Error("New password must differ from current");
    }
    this.appendCurrentSessionAuditEvent({
      actorUserId: _userId,
      actorDisplayName: "Utilisateur",
      actorRole: "admin",
      action: "password_change_simulation",
      resourceType: "profile",
      resourceLabel: "Mot de passe du compte",
      description: "Simulation de modification du mot de passe de connexion.",
      severity: "warning",
      outcome: "success",
      changes: [{ field: "password", label: "Mot de passe", isSensitive: true }],
      ipLabel: "192.0.2.xxx",
      deviceLabel: "Navigateur actuel",
      sessionLabel: "Session actuelle",
    }).catch(() => {});
    // Simulate success — never persist or return password values
    return { success: true };
  },

  async getMockAccountSessions(userId: number): Promise<MockAccountSession[]> {
    await delay();
    return MOCK_ACCOUNT_SESSIONS.filter((s) => s.userId === userId).map((s) => ({ ...s }));
  },

  async revokeMockAccountSession(userId: number, sessionId: number): Promise<MockAccountSession> {
    await delay();
    const idx = MOCK_ACCOUNT_SESSIONS.findIndex((s) => s.id === sessionId && s.userId === userId);
    if (idx === -1) throw new Error("Session not found");
    if (MOCK_ACCOUNT_SESSIONS[idx].isCurrent) throw new Error("Cannot revoke current session");
    if (MOCK_ACCOUNT_SESSIONS[idx].status === "revoked") throw new Error("Session already revoked");
    MOCK_ACCOUNT_SESSIONS[idx] = { ...MOCK_ACCOUNT_SESSIONS[idx], status: "revoked" };
    return MOCK_ACCOUNT_SESSIONS[idx];
  },

  async revokeAllOtherMockAccountSessions(userId: number): Promise<void> {
    await delay();
    MOCK_ACCOUNT_SESSIONS.forEach((s, i) => {
      if (s.userId === userId && !s.isCurrent && s.status === "active") {
        MOCK_ACCOUNT_SESSIONS[i] = { ...s, status: "revoked" };
      }
    });
  },

  // ── Admin Notification Center ──

  async getCurrentUserNotifications(userId: number, role: string): Promise<AdminNotification[]> {
    await delay(150);
    return MOCK_ADMIN_NOTIFICATIONS.filter(
      (n) =>
        n.recipientUserId === userId ||
        n.recipientRole === role ||
        (!n.recipientUserId && !n.recipientRole)
    )
      .map((n) => ({ ...n }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getUnreadNotificationCount(userId: number, role: string): Promise<number> {
    const list = await this.getCurrentUserNotifications(userId, role);
    return list.filter((n) => n.status === "unread").length;
  },

  async markNotificationAsRead(id: number): Promise<AdminNotification> {
    await delay(100);
    const item = MOCK_ADMIN_NOTIFICATIONS.find((n) => n.id === id);
    if (!item) throw new Error("Notification not found");
    item.status = "read";
    item.readAt = new Date().toISOString();
    return { ...item };
  },

  async markNotificationAsUnread(id: number): Promise<AdminNotification> {
    await delay(100);
    const item = MOCK_ADMIN_NOTIFICATIONS.find((n) => n.id === id);
    if (!item) throw new Error("Notification not found");
    item.status = "unread";
    item.readAt = null;
    return { ...item };
  },

  async markAllNotificationsAsRead(userId: number, role: string): Promise<void> {
    await delay(150);
    const now = new Date().toISOString();
    MOCK_ADMIN_NOTIFICATIONS.forEach((n) => {
      if (
        (n.recipientUserId === userId || n.recipientRole === role || (!n.recipientUserId && !n.recipientRole)) &&
        n.status === "unread"
      ) {
        n.status = "read";
        n.readAt = now;
      }
    });
  },

  async archiveNotification(id: number): Promise<AdminNotification> {
    await delay(100);
    const item = MOCK_ADMIN_NOTIFICATIONS.find((n) => n.id === id);
    if (!item) throw new Error("Notification not found");
    item.status = "archived";
    item.archivedAt = new Date().toISOString();
    return { ...item };
  },

  async restoreNotification(id: number): Promise<AdminNotification> {
    await delay(100);
    const item = MOCK_ADMIN_NOTIFICATIONS.find((n) => n.id === id);
    if (!item) throw new Error("Notification not found");
    item.status = item.readAt ? "read" : "unread";
    item.archivedAt = null;
    return { ...item };
  },

  async deleteNotification(id: number): Promise<void> {
    await delay(100);
    const idx = MOCK_ADMIN_NOTIFICATIONS.findIndex((n) => n.id === id);
    if (idx !== -1) {
      MOCK_ADMIN_NOTIFICATIONS.splice(idx, 1);
    }
  },

  async bulkMarkNotificationsAsRead(ids: number[]): Promise<void> {
    await delay(150);
    const now = new Date().toISOString();
    const set = new Set(ids);
    MOCK_ADMIN_NOTIFICATIONS.forEach((n) => {
      if (set.has(n.id)) {
        n.status = "read";
        n.readAt = now;
      }
    });
  },

  async bulkArchiveNotifications(ids: number[]): Promise<void> {
    await delay(150);
    const now = new Date().toISOString();
    const set = new Set(ids);
    MOCK_ADMIN_NOTIFICATIONS.forEach((n) => {
      if (set.has(n.id)) {
        n.status = "archived";
        n.archivedAt = now;
      }
    });
  },

  async bulkDeleteNotifications(ids: number[]): Promise<void> {
    await delay(150);
    const set = new Set(ids);
    for (let i = MOCK_ADMIN_NOTIFICATIONS.length - 1; i >= 0; i--) {
      if (set.has(MOCK_ADMIN_NOTIFICATIONS[i].id)) {
        MOCK_ADMIN_NOTIFICATIONS.splice(i, 1);
      }
    }
  },

  async getNotificationPreferences(userId: number): Promise<NotificationPreferences> {
    await delay(100);
    if (!MOCK_NOTIFICATION_PREFERENCES[userId]) {
      MOCK_NOTIFICATION_PREFERENCES[userId] = {
        userId,
        inAppEnabled: true,
        contentReviewEnabled: true,
        leadAlertsEnabled: true,
        mediaAlertsEnabled: true,
        securityAlertsEnabled: true,
        accountAlertsEnabled: true,
        quietHoursEnabled: false,
        quietHoursStart: "22:00",
        quietHoursEnd: "07:00",
        digestFrequency: "daily",
        updatedAt: new Date().toISOString(),
      };
    }
    return { ...MOCK_NOTIFICATION_PREFERENCES[userId] };
  },

  async updateNotificationPreferences(
    userId: number,
    prefs: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    await delay(150);
    const current = await this.getNotificationPreferences(userId);
    const updated: NotificationPreferences = {
      ...current,
      ...prefs,
      securityAlertsEnabled: true, // Always mandatory
      updatedAt: new Date().toISOString(),
    };
    MOCK_NOTIFICATION_PREFERENCES[userId] = updated;
    return { ...updated };
  },

  // ── Admin Audit Log & Activity History ──

  async getCurrentUserAuditEvents(
    userId: number,
    role: string,
    scope: "my_activity" | "global" = "my_activity"
  ): Promise<AdminAuditEvent[]> {
    await delay(150);

    // Permission enforcement: non-admin roles can ONLY see their own activity
    const isGlobalAllowed = (role === "super_admin" || role === "admin") && scope === "global";

    return MOCK_ADMIN_AUDIT_EVENTS.filter((e) => {
      if (isGlobalAllowed) return true;
      return e.actorUserId === userId;
    })
      .map((e) => ({ ...e }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getAuditEventById(id: number): Promise<AdminAuditEvent | undefined> {
    await delay(100);
    const item = MOCK_ADMIN_AUDIT_EVENTS.find((e) => e.id === id);
    return item ? { ...item } : undefined;
  },

  async getAuditSummary(
    userId: number,
    role: string,
    scope: "my_activity" | "global" = "my_activity"
  ) {
    const list = await this.getCurrentUserAuditEvents(userId, role, scope);
    const todayStr = new Date().toISOString().slice(0, 10);

    const total = list.length;
    const today = list.filter((e) => e.createdAt.startsWith(todayStr)).length;
    const success = list.filter((e) => e.outcome === "success").length;
    const deniedFailed = list.filter((e) => e.outcome === "denied" || e.outcome === "failed").length;
    const highCritical = list.filter((e) => e.severity === "warning" || e.severity === "critical").length;
    const currentSession = list.filter((e) => e.source === "current_session").length;

    return { total, today, success, deniedFailed, highCritical, currentSession };
  },

  async appendCurrentSessionAuditEvent(
    eventData: Omit<AdminAuditEvent, "id" | "source" | "createdAt">
  ): Promise<AdminAuditEvent> {
    await delay(50);
    const maxId = MOCK_ADMIN_AUDIT_EVENTS.reduce((max, item) => Math.max(max, item.id), 700);
    const newEvent: AdminAuditEvent = {
      ...eventData,
      id: maxId + 1,
      source: "current_session",
      createdAt: new Date().toISOString(),
      isDemo: true,
      // Sanitize changes to ensure sensitive fields are scrubbed
      changes: eventData.changes?.map((c) => {
        const isSens =
          c.isSensitive ||
          /password|token|secret|credential|apiKey|smtpPassword|recoveryCode/i.test(c.field);
        if (isSens) {
          return {
            field: c.field,
            label: c.label,
            isSensitive: true,
          };
        }
        return c;
      }),
    };

    MOCK_ADMIN_AUDIT_EVENTS.unshift(newEvent);
    return { ...newEvent };
  },

  // ── Admin Analytics & Reports ──

  async getAnalyticsFilterOptions(role: UserRole): Promise<AnalyticsFilterOptions> {
    await delay(100);
    const capability = ANALYTICS_CAPABILITIES[role];
    return {
      ranges: ANALYTICS_RANGE_OPTIONS.map((option) => ({ ...option })),
      authorizedSections: capability ? [...capability.sections] : [],
      canExport: capability?.canExport ?? false,
    };
  },

  async getAnalyticsOverview(
    userId: number,
    role: UserRole,
    range: AnalyticsDateRange
  ): Promise<AnalyticsOverview> {
    await delay(180);
    return buildAnalyticsOverview(userId, role, range);
  },

  async getContentAnalytics(
    userId: number,
    role: UserRole,
    range: AnalyticsDateRange
  ): Promise<AnalyticsReportSection> {
    await delay(120);
    const section = buildAnalyticsOverview(userId, role, range).sections.find((item) => item.id === "content");
    if (!section) throw new Error("Analytics section not authorized");
    return section;
  },

  async getLeadAnalytics(
    userId: number,
    role: UserRole,
    range: AnalyticsDateRange
  ): Promise<AnalyticsReportSection[]> {
    await delay(120);
    const sections = buildAnalyticsOverview(userId, role, range).sections.filter(
      (item) => item.id === "leads" || item.id === "subscribers"
    );
    if (sections.length === 0) throw new Error("Analytics section not authorized");
    return sections;
  },

  async getMediaAnalytics(
    userId: number,
    role: UserRole,
    range: AnalyticsDateRange
  ): Promise<AnalyticsReportSection> {
    await delay(120);
    const section = buildAnalyticsOverview(userId, role, range).sections.find((item) => item.id === "media");
    if (!section) throw new Error("Analytics section not authorized");
    return section;
  },

  async getNotificationAnalytics(
    userId: number,
    role: UserRole,
    range: AnalyticsDateRange
  ): Promise<AnalyticsReportSection> {
    await delay(120);
    const section = buildAnalyticsOverview(userId, role, range).sections.find((item) => item.id === "notifications");
    if (!section) throw new Error("Analytics section not authorized");
    return section;
  },

  async getAuditAnalytics(
    userId: number,
    role: UserRole,
    range: AnalyticsDateRange
  ): Promise<AnalyticsReportSection> {
    await delay(120);
    const section = buildAnalyticsOverview(userId, role, range).sections.find((item) => item.id === "audit");
    if (!section) throw new Error("Analytics section not authorized");
    return section;
  },

  async exportAnalyticsReport(
    userId: number,
    role: UserRole,
    range: AnalyticsDateRange,
    requestedSectionIds?: AnalyticsSectionId[]
  ): Promise<AnalyticsExportReport> {
    await delay(120);
    const capability = ANALYTICS_CAPABILITIES[role];
    if (!capability?.canExport) throw new Error("Analytics export not authorized");

    const overview = buildAnalyticsOverview(userId, role, range);
    const sections = requestedSectionIds && requestedSectionIds.length > 0
      ? overview.sections.filter((section) => requestedSectionIds.includes(section.id))
      : overview.sections;

    return {
      filenameBase: `integraltech-analytics-${new Date().toISOString().slice(0, 10)}`,
      generatedAt: overview.generatedAt,
      range,
      rangeLabel: getRangeLabel(range),
      includedSections: sections.map((section) => section.title),
      rows: buildAnalyticsExportRows(sections),
      isDemo: true,
    };
  },
};
