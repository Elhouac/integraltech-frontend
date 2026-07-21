import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  const [toast, setToast] = useState<string | null>(null);

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
    try {
      const data = await adminService.getCurrentUserNotifications(userId, role);
      setNotifications(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [userId, role]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
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
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedNotifications.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedNotifications, currentPage]);

  const paginationMeta: PaginationMeta = {
    currentPage,
    lastPage: totalPages,
    perPage: ITEMS_PER_PAGE,
    total: totalItems,
    from: totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1,
    to: Math.min(currentPage * ITEMS_PER_PAGE, totalItems),
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
      await adminService.markNotificationAsRead(id);
      await fetchNotifications();
      showToast("Notification marquée comme lue.");
    } catch {
      /* ignore */
    }
  };

  const handleMarkUnread = async (id: number) => {
    try {
      await adminService.markNotificationAsUnread(id);
      await fetchNotifications();
      showToast("Notification marquée comme non lue.");
    } catch {
      /* ignore */
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await adminService.archiveNotification(id);
      await fetchNotifications();
      showToast("Notification archivée.");
    } catch {
      /* ignore */
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await adminService.restoreNotification(id);
      await fetchNotifications();
      showToast("Notification restaurée.");
    } catch {
      /* ignore */
    }
  };

  const handleDeleteSingle = async () => {
    if (singleDeleteId === null) return;
    try {
      await adminService.deleteNotification(singleDeleteId);
      await fetchNotifications();
      setSelectedIds((prev) => prev.filter((i) => i !== singleDeleteId));
      showToast("Notification supprimée.");
    } catch {
      /* ignore */
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

  // Bulk Actions
  const handleBulkMarkRead = async () => {
    if (selectedIds.length === 0) return;
    try {
      await adminService.bulkMarkNotificationsAsRead(selectedIds);
      await fetchNotifications();
      showToast(`${selectedIds.length} notification(s) marquée(s) comme lue(s).`);
      setSelectedIds([]);
    } catch {
      /* ignore */
    }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;
    try {
      await adminService.bulkArchiveNotifications(selectedIds);
      await fetchNotifications();
      showToast(`${selectedIds.length} notification(s) archivée(s).`);
      setSelectedIds([]);
    } catch {
      /* ignore */
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
      await adminService.bulkDeleteNotifications(deletableIds);
      await fetchNotifications();
      showToast(`${deletableIds.length} notification(s) supprimée(s).`);
      setSelectedIds([]);
    } catch {
      /* ignore */
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
      /* ignore */
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
      <div className="admin-profile-tabs" role="tablist">
        <button
          className={`admin-profile-tab${activeTab === "list" ? " active" : ""}`}
          onClick={() => setActiveTab("list")}
          role="tab"
          aria-selected={activeTab === "list"}
        >
          <Bell size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
          Centre de notifications
        </button>
        <button
          className={`admin-profile-tab${activeTab === "preferences" ? " active" : ""}`}
          onClick={() => setActiveTab("preferences")}
          role="tab"
          aria-selected={activeTab === "preferences"}
        >
          <Settings2 size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
          Préférences de notification
        </button>
      </div>

      {/* Tab 1: Notification List View */}
      {activeTab === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                  onClick={handleBulkMarkRead}
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
                  <CheckCheck size={14} /> Marquer lues
                </button>
                <button
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
            <div style={{ padding: 48, textAlign: "center", fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
              Chargement des notifications...
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
      {activeTab === "preferences" && <NotificationPreferencesPanel userId={userId} />}

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
