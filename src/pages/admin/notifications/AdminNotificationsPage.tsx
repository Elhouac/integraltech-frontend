import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Archive, Trash2, Info, Settings2 } from "lucide-react";
import NotificationItem from "../../../components/admin/notifications/NotificationItem";
import NotificationFilters, { DateFilterOption, SortOption } from "../../../components/admin/notifications/NotificationFilters";
import NotificationPreferencesPanel from "../../../components/admin/notifications/NotificationPreferencesPanel";
import ConfirmDialog from "../../../components/admin/shared/ConfirmDialog";
import Pagination from "../../../components/admin/shared/Pagination";
import type { PaginationMeta } from "../../../components/admin/shared/Pagination";
import { adminService } from "../../../services/adminService";
import { useAuth } from "../../../context/AuthContext";
import type { AdminNotification, NotificationPriority } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

type PageTab = "list" | "preferences";

const ITEMS_PER_PAGE = 10;

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const userId = user?.id || 1;
  const role = user?.role || "reader";

  const [activeTab, setActiveTab] = useState<PageTab>("list");
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const tabRefs = useRef<Record<PageTab, HTMLButtonElement | null>>({ list: null, preferences: null });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Selection & Bulk State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Dialog State
  const [singleDeleteId, setSingleDeleteId] = useState<number | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await adminService.getCurrentUserNotifications(userId, role);
      setNotifications(data);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [userId, role]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, tab: PageTab) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextTab: PageTab = event.key === "Home"
      ? "list"
      : event.key === "End"
        ? "preferences"
        : tab === "list" ? "preferences" : "list";
    setActiveTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  };

  // Permission logic for deletion
  const canDeleteNotif = useCallback(
    (notif: AdminNotification) => {
      if (role === "super_admin" || role === "admin") return true;
      if (role === "editor") {
        return notif.priority === "low" || notif.priority === "normal";
      }
      return false;
    },
    [role]
  );

  // Filter & Search Logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Status filter
      if (statusFilter === "unread" && item.status !== "unread") return false;
      if (statusFilter === "read" && item.status !== "read") return false;
      if (statusFilter === "archived" && item.status !== "archived") return false;
      if (statusFilter === "all" && item.status === "archived") return false; // Default: hide archived unless requested

      // Type filter
      if (typeFilter !== "all" && item.type !== typeFilter) return false;

      // Priority filter
      if (priorityFilter !== "all" && item.priority !== priorityFilter) return false;

      // Date filter
      if (dateFilter !== "all") {
        const date = new Date(item.createdAt).getTime();
        const now = Date.now();
        if (dateFilter === "today") {
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          if (date < startOfDay.getTime()) return false;
        } else if (dateFilter === "7days") {
          if (now - date > 7 * 24 * 60 * 60 * 1000) return false;
        } else if (dateFilter === "30days") {
          if (now - date > 30 * 24 * 60 * 60 * 1000) return false;
        }
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchMessage = item.message.toLowerCase().includes(q);
        const matchResource = item.relatedResource?.resourceLabel.toLowerCase().includes(q);
        if (!matchTitle && !matchMessage && !matchResource) return false;
      }

      return true;
    });
  }, [notifications, statusFilter, typeFilter, priorityFilter, dateFilter, search]);

  // Sort Logic
  const sortedNotifications = useMemo(() => {
    const list = [...filteredNotifications];
    const priorityWeight: Record<NotificationPriority, number> = {
      critical: 4,
      high: 3,
      normal: 2,
      low: 1,
    };

    return list.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "priority") {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortBy === "unread_first") {
        if (a.status === "unread" && b.status !== "unread") return -1;
        if (a.status !== "unread" && b.status === "unread") return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [filteredNotifications, sortBy]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [search, statusFilter, typeFilter, priorityFilter, dateFilter, sortBy]);

  // Pagination calculation
  const totalItems = sortedNotifications.length;
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedNotifications.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedNotifications, currentPage]);

  const paginationMeta: PaginationMeta = {
    page: currentPage,
    perPage: ITEMS_PER_PAGE,
    total: totalItems,
  };

  // Summary Counters
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const readCount = notifications.filter((n) => n.status === "read").length;
  const archivedCount = notifications.filter((n) => n.status === "archived").length;
  const highCriticalCount = notifications.filter(
    (n) => n.priority === "high" || n.priority === "critical"
  ).length;

  const isFiltered =
    search !== "" ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    priorityFilter !== "all" ||
    dateFilter !== "all" ||
    sortBy !== "newest";

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setPriorityFilter("all");
    setDateFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Single Item Actions
  const handleMarkRead = async (id: number) => {
    try {
      await adminService.markNotificationAsRead(id, userId, role);
      await fetchNotifications();
      showToast("Notification marquée comme lue.");
    } catch {
      showToast("Impossible de modifier cette notification.");
    }
  };

  const handleMarkUnread = async (id: number) => {
    try {
      await adminService.markNotificationAsUnread(id, userId, role);
      await fetchNotifications();
      showToast("Notification marquée comme non lue.");
    } catch {
      showToast("Impossible de modifier cette notification.");
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await adminService.archiveNotification(id, userId, role);
      await fetchNotifications();
      showToast("Notification archivée.");
    } catch {
      showToast("Impossible d'archiver cette notification.");
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await adminService.restoreNotification(id, userId, role);
      await fetchNotifications();
      showToast("Notification restaurée.");
    } catch {
      showToast("Impossible de restaurer cette notification.");
    }
  };

  const handleDeleteSingle = async () => {
    if (singleDeleteId === null) return;
    try {
      await adminService.deleteNotification(singleDeleteId, userId, role);
      await fetchNotifications();
      setSelectedIds((prev) => prev.filter((i) => i !== singleDeleteId));
      showToast("Notification supprimée.");
    } catch {
      showToast("Impossible de supprimer cette notification.");
    } finally {
      setSingleDeleteId(null);
    }
  };

  // Bulk Selection Handlers
  const handleSelectAllCurrentPage = (checked: boolean) => {
    const pageIds = paginatedNotifications.map((n) => n.id);
    if (checked) {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleToggleSelectId = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const isAllCurrentPageSelected =
    paginatedNotifications.length > 0 &&
    paginatedNotifications.every((n) => selectedIds.includes(n.id));
  const selectedHasArchived = notifications.some(
    (notification) => selectedIds.includes(notification.id) && notification.status === "archived"
  );

  // Bulk Actions
  const handleBulkMarkRead = async () => {
    if (selectedIds.length === 0) return;
    try {
      await adminService.bulkMarkNotificationsAsRead(selectedIds, userId, role);
      await fetchNotifications();
      showToast(`${selectedIds.length} notification(s) marquée(s) comme lue(s).`);
      setSelectedIds([]);
    } catch {
      showToast("Impossible de modifier les notifications sélectionnées.");
    }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;
    try {
      await adminService.bulkArchiveNotifications(selectedIds, userId, role);
      await fetchNotifications();
      showToast(`${selectedIds.length} notification(s) archivée(s).`);
      setSelectedIds([]);
    } catch {
      showToast("Impossible d'archiver les notifications sélectionnées.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    // Filter out items user cannot delete based on role
    const deletableIds = selectedIds.filter((id) => {
      const n = notifications.find((item) => item.id === id);
      return n ? canDeleteNotif(n) : false;
    });

    if (deletableIds.length === 0) {
      showToast("Aucune notification sélectionnée n'est supprimable par votre rôle.");
      setBulkDeleteConfirmOpen(false);
      return;
    }

    try {
      await adminService.bulkDeleteNotifications(deletableIds, userId, role);
      await fetchNotifications();
      showToast(`${deletableIds.length} notification(s) supprimée(s).`);
      setSelectedIds([]);
    } catch {
      showToast("Impossible de supprimer les notifications sélectionnées.");
    } finally {
      setBulkDeleteConfirmOpen(false);
    }
  };

  const handleMarkAllReadGlobal = async () => {
    try {
      await adminService.markAllNotificationsAsRead(userId, role);
      await fetchNotifications();
      showToast("Toutes les notifications ont été marquées comme lues.");
    } catch {
      showToast("Impossible de marquer toutes les notifications comme lues.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}>
            Centre de Notifications
          </h1>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", margin: "4px 0 0" }}>
            Gérez vos alertes, demandes de validation et messages système.
          </p>
        </div>

        {/* Action Header Button */}
        {unreadCount > 0 && activeTab === "list" && (
          <button
            type="button"
            onClick={handleMarkAllReadGlobal}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              border: `1px solid ${BORDER}`,
              borderRadius: "var(--radius-md)",
              background: SURFACE,
              color: TEXT,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}
          >
            <CheckCheck size={14} style={{ color: ACCENT }} />
            <span>Tout marquer comme lu</span>
          </button>
        )}
      </div>

      {/* Demo Warning Banner */}
      <div className="admin-settings-demo-notice" role="status">
        <Info size={16} style={{ flexShrink: 0, marginTop: 1, color: ACCENT }} />
        <span>Mode démonstration : les notifications sont temporaires et seront réinitialisées après actualisation.</span>
      </div>

      {/* Summary Counters */}
      <div className="admin-notif-summary-cards">
        <div className="admin-notif-summary-card">
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
            Total
          </span>
          <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT }}>
            {totalCount}
          </span>
        </div>
        <div className="admin-notif-summary-card" style={{ borderLeft: `3px solid ${ACCENT}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: ACCENT, fontFamily: "var(--font-sans)" }}>
            Non lues
          </span>
          <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: ACCENT }}>
            {unreadCount}
          </span>
        </div>
        <div className="admin-notif-summary-card">
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
            Lues
          </span>
          <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT }}>
            {readCount}
          </span>
        </div>
        <div className="admin-notif-summary-card">
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
            Archivées
          </span>
          <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT }}>
            {archivedCount}
          </span>
        </div>
        <div className="admin-notif-summary-card">
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: DANGER, fontFamily: "var(--font-sans)" }}>
            Priorité Haute / Critique
          </span>
          <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: DANGER }}>
            {highCriticalCount}
          </span>
        </div>
      </div>

      {/* Page Main Navigation Tabs */}
      <div className="admin-profile-tabs" role="tablist" aria-label="Sections des notifications">
        <button
          ref={(element) => { tabRefs.current.list = element; }}
          type="button"
          className={`admin-profile-tab${activeTab === "list" ? " active" : ""}`}
          onClick={() => setActiveTab("list")}
          onKeyDown={(event) => handleTabKeyDown(event, "list")}
          role="tab"
          aria-selected={activeTab === "list"}
          aria-controls="notifications-panel-list"
          id="notifications-tab-list"
          tabIndex={activeTab === "list" ? 0 : -1}
        >
          <Bell size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
          Centre de notifications
        </button>
        <button
          ref={(element) => { tabRefs.current.preferences = element; }}
          type="button"
          className={`admin-profile-tab${activeTab === "preferences" ? " active" : ""}`}
          onClick={() => setActiveTab("preferences")}
          onKeyDown={(event) => handleTabKeyDown(event, "preferences")}
          role="tab"
          aria-selected={activeTab === "preferences"}
          aria-controls="notifications-panel-preferences"
          id="notifications-tab-preferences"
          tabIndex={activeTab === "preferences" ? 0 : -1}
        >
          <Settings2 size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
          Préférences de notification
        </button>
      </div>

      {/* Tab 1: Notification List View */}
      {activeTab === "list" && (
        <div
          role="tabpanel"
          id="notifications-panel-list"
          aria-labelledby="notifications-tab-list"
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {/* Filters Bar */}
          <NotificationFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onReset={handleResetFilters}
            isFiltered={isFiltered}
          />

          {/* Bulk Action Bar (Visible when items selected) */}
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                background: "rgba(249, 115, 22, 0.08)",
                border: `1px solid ${ACCENT}`,
                borderRadius: "var(--radius-md)",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="checkbox"
                  checked={isAllCurrentPageSelected}
                  onChange={(e) => handleSelectAllCurrentPage(e.target.checked)}
                  style={{ width: 16, height: 16, cursor: "pointer", accentColor: ACCENT }}
                />
                <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: "var(--font-sans)" }}>
                  {selectedIds.length} notification(s) sélectionnée(s)
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleBulkMarkRead}
                  disabled={selectedHasArchived}
                  title={selectedHasArchived ? "Restaurez d'abord les notifications archivées." : "Marquer la sélection comme lue"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: SURFACE,
                    color: TEXT,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "var(--font-sans)",
                    cursor: selectedHasArchived ? "not-allowed" : "pointer",
                    opacity: selectedHasArchived ? 0.55 : 1,
                  }}
                >
                  <CheckCheck size={14} /> Marquer lues
                </button>
                <button
                  type="button"
                  onClick={handleBulkArchive}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: SURFACE,
                    color: TEXT,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "var(--font-sans)",
                    cursor: "pointer",
                  }}
                >
                  <Archive size={14} /> Archiver
                </button>
                {(role === "super_admin" || role === "admin" || role === "editor") && (
                  <button
                    type="button"
                    onClick={() => setBulkDeleteConfirmOpen(true)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      border: `1px solid ${DANGER}`,
                      borderRadius: "var(--radius-md)",
                      background: SURFACE,
                      color: DANGER,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "var(--font-sans)",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={14} /> Supprimer
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    background: "transparent",
                    color: TEXT_SECONDARY,
                    fontSize: 12,
                    fontFamily: "var(--font-sans)",
                    cursor: "pointer",
                  }}
                >
                  Désélectionner
                </button>
              </div>
            </motion.div>
          )}

          {/* List Content */}
          {loading ? (
            <div role="status" aria-live="polite" style={{ padding: 48, textAlign: "center", fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
              Chargement des notifications...
            </div>
          ) : loadError ? (
            <div className="admin-alert admin-alert-error" role="alert">
              <span>Impossible de charger les notifications de démonstration.</span>
              <button type="button" onClick={() => void fetchNotifications()}>Réessayer</button>
            </div>
          ) : paginatedNotifications.length === 0 ? (
            <div
              style={{
                padding: 48,
                textAlign: "center",
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: "var(--radius-lg)",
              }}
            >
              <Bell size={32} style={{ color: TEXT_SECONDARY, opacity: 0.5, marginBottom: 12 }} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT }}>
                Aucune notification trouvée
              </h3>
              <p style={{ margin: "6px 0 16px", fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                {isFiltered
                  ? "Aucune notification ne correspond aux filtres sélectionnés."
                  : "Vous n'avez aucune notification pour le moment."}
              </p>
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  style={{
                    padding: "8px 16px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: "transparent",
                    color: TEXT,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "var(--font-sans)",
                    cursor: "pointer",
                  }}
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <div>
              {paginatedNotifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  selected={selectedIds.includes(notif.id)}
                  onSelectChange={(checked) => handleToggleSelectId(notif.id, checked)}
                  onMarkRead={handleMarkRead}
                  onMarkUnread={handleMarkUnread}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDeleteRequest={(id) => setSingleDeleteId(id)}
                  canDelete={canDeleteNotif(notif)}
                />
              ))}

              {/* Pagination */}
              <div style={{ marginTop: 16 }}>
                <Pagination
                  meta={paginationMeta}
                  onPageChange={(p) => {
                    setCurrentPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Preferences View */}
      {activeTab === "preferences" && (
        <div role="tabpanel" id="notifications-panel-preferences" aria-labelledby="notifications-tab-preferences">
          <NotificationPreferencesPanel userId={userId} />
        </div>
      )}

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={singleDeleteId !== null}
        title="Supprimer la notification"
        message="Êtes-vous sûr de vouloir supprimer cette notification de démonstration ? Cette action est temporaire et réinitialisée après actualisation."
        confirmLabel="Supprimer"
        onConfirm={handleDeleteSingle}
        onCancel={() => setSingleDeleteId(null)}
      />

      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        title="Supprimer les notifications sélectionnées"
        message={`Êtes-vous sûr de vouloir supprimer ${selectedIds.length} notification(s) de démonstration ?`}
        confirmLabel="Tout supprimer"
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />

      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="admin-settings-toast"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
