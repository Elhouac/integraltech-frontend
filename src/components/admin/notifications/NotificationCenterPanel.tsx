import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, CheckCheck, ExternalLink, ShieldAlert, FileText, Wrench, Image as ImageIcon, User, Inbox, Info } from "lucide-react";
import { adminService } from "../../../services/adminService";
import type { AdminNotification, NotificationType } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

interface NotificationCenterPanelProps {
  userId: number;
  role: string;
  onClose: () => void;
  onStateChange?: () => void;
}

const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  system: Info,
  content: FileText,
  review: Wrench,
  security: ShieldAlert,
  lead: Inbox,
  media: ImageIcon,
  account: User,
};

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  if (diffDays === 1) return "Hier";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function NotificationCenterPanel({
  userId,
  role,
  onClose,
  onStateChange,
}: NotificationCenterPanelProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPanelNotifications = useCallback(async () => {
    try {
      const data = await adminService.getCurrentUserNotifications(userId, role);
      // Display up to 5 non-archived notifications
      const activeList = data.filter((n) => n.status !== "archived").slice(0, 5);
      setNotifications(activeList);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [userId, role]);

  useEffect(() => {
    fetchPanelNotifications();
  }, [fetchPanelNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await adminService.markAllNotificationsAsRead(userId, role);
      await fetchPanelNotifications();
      onStateChange?.();
    } catch {
      /* ignore */
    }
  };

  const handleItemClick = async (notif: AdminNotification) => {
    if (notif.status === "unread") {
      try {
        await adminService.markNotificationAsRead(notif.id);
        onStateChange?.();
      } catch {
        /* ignore */
      }
    }
    if (notif.actionUrl) {
      onClose();
      navigate(notif.actionUrl);
    }
  };

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  return (
    <motion.div
      className="admin-notif-panel"
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      role="region"
      aria-label="Centre de notifications"
    >
      {/* Header */}
      <div className="admin-notif-panel-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Bell size={16} style={{ color: ACCENT }} />
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(249, 115, 22, 0.12)",
                color: ACCENT,
                fontFamily: "var(--font-sans)",
              }}
            >
              {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              border: "none",
              background: "transparent",
              color: TEXT_SECONDARY,
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}
            title="Tout marquer comme lu"
          >
            <CheckCheck size={14} />
            <span className="admin-header-username">Tout lire</span>
          </button>
        )}
      </div>

      {/* Body */}
      <div className="admin-notif-panel-body">
        {loading ? (
          <div style={{ padding: 24, textAlign: "center", fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
            Chargement...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center" }}>
            <Bell size={24} style={{ color: TEXT_SECONDARY, opacity: 0.5, marginBottom: 8 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>
              Aucune notification
            </div>
            <div style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", marginTop: 4 }}>
              Vous êtes à jour !
            </div>
          </div>
        ) : (
          notifications.map((notif) => {
            const Icon = TYPE_ICONS[notif.type] || Info;
            const isUnread = notif.status === "unread";
            return (
              <div
                key={notif.id}
                className={`admin-notif-item${isUnread ? " unread" : ""}`}
                onClick={() => handleItemClick(notif)}
                style={{ cursor: notif.actionUrl || isUnread ? "pointer" : "default" }}
              >
                <div className={`admin-notif-type-icon ${notif.type}`}>
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: isUnread ? 700 : 600,
                        color: TEXT,
                        fontFamily: "var(--font-sans)",
                        lineHeight: 1.3,
                      }}
                    >
                      {notif.title}
                    </span>
                    <span style={{ fontSize: 11, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: TEXT_SECONDARY,
                      fontFamily: "var(--font-sans)",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {notif.message}
                  </p>
                  {notif.actionLabel && (
                    <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: ACCENT, fontFamily: "var(--font-sans)" }}>
                      <span>{notif.actionLabel}</span>
                      <ExternalLink size={10} />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="admin-notif-panel-footer">
        <button
          onClick={() => {
            onClose();
            navigate("/admin/notifications");
          }}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-md)",
            background: SURFACE,
            color: TEXT,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "background 0.15s",
          }}
        >
          Voir toutes les notifications
        </button>
      </div>
    </motion.div>
  );
}
