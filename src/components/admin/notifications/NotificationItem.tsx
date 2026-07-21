import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  RotateCcw,
  Archive,
  Trash2,
  MoreVertical,
  ExternalLink,
  ShieldAlert,
  FileText,
  Wrench,
  Image as ImageIcon,
  User,
  Inbox,
  Info,
  Clock,
  Tag,
} from "lucide-react";
import type { AdminNotification, NotificationType, NotificationPriority } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

interface NotificationItemProps {
  notification: AdminNotification;
  selected: boolean;
  onSelectChange: (selected: boolean) => void;
  onMarkRead: (id: number) => void;
  onMarkUnread: (id: number) => void;
  onArchive: (id: number) => void;
  onRestore: (id: number) => void;
  onDeleteRequest: (id: number) => void;
  canDelete: boolean;
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

const PRIORITY_LABELS: Record<NotificationPriority, string> = {
  low: "Basse",
  normal: "Normale",
  high: "Haute",
  critical: "Critique",
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationItem({
  notification,
  selected,
  onSelectChange,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onRestore,
  onDeleteRequest,
  canDelete,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const Icon = TYPE_ICONS[notification.type] || Info;
  const isUnread = notification.status === "unread";
  const isArchived = notification.status === "archived";

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent triggering if user clicked input, button, link, or menu
    const target = e.target as HTMLElement;
    if (target.closest("input, button, a, .notif-menu")) return;

    if (isUnread) {
      onMarkRead(notification.id);
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnread) {
      onMarkRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <div
      className={`admin-notif-item${isUnread ? " unread" : ""}`}
      onClick={handleCardClick}
      style={{
        borderRadius: "var(--radius-md)",
        border: `1px solid ${selected ? ACCENT : BORDER}`,
        opacity: isArchived ? 0.75 : 1,
        marginBottom: 8,
      }}
    >
      {/* Selection checkbox */}
      <div style={{ display: "flex", alignItems: "center", paddingTop: 2 }}>
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelectChange(e.target.checked)}
          aria-label={`Sélectionner la notification ${notification.title}`}
          style={{ width: 16, height: 16, cursor: "pointer", accentColor: ACCENT }}
        />
      </div>

      {/* Type Icon */}
      <div className={`admin-notif-type-icon ${notification.type}`}>
        <Icon size={18} />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: isUnread ? 700 : 600,
              color: TEXT,
              fontFamily: "var(--font-sans)",
            }}
          >
            {notification.title}
          </span>

          {/* Priority Badge */}
          <span className={`admin-notif-priority-badge ${notification.priority}`}>
            {PRIORITY_LABELS[notification.priority]}
          </span>

          {/* Status Badge */}
          {isUnread && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: "var(--radius-sm)",
                background: ACCENT,
                color: "#fff",
                fontFamily: "var(--font-sans)",
              }}
            >
              Nouveau
            </span>
          )}
          {isArchived && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "1px 6px",
                borderRadius: "var(--radius-sm)",
                background: "var(--background)",
                color: TEXT_SECONDARY,
                fontFamily: "var(--font-sans)",
              }}
            >
              Archivé
            </span>
          )}
        </div>

        <p
          style={{
            margin: "0 0 8px",
            fontSize: 13,
            color: TEXT_SECONDARY,
            fontFamily: "var(--font-sans)",
            lineHeight: 1.5,
          }}
        >
          {notification.message}
        </p>

        {/* Metadata row: Resource & Timestamp & Action Button */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Clock size={12} />
            {formatDate(notification.createdAt)}
          </span>

          {notification.relatedResource && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--background)", padding: "2px 6px", borderRadius: "var(--radius-sm)" }}>
              <Tag size={11} />
              <span>{notification.relatedResource.resourceType}:</span>
              <strong>{notification.relatedResource.resourceLabel}</strong>
            </span>
          )}

          {notification.actionLabel && notification.actionUrl && (
            <button
              onClick={handleActionClick}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                border: "none",
                background: "transparent",
                color: ACCENT,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span>{notification.actionLabel}</span>
              <ExternalLink size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Action Menu */}
      <div ref={menuRef} className="notif-menu" style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Actions de notification"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            border: "none",
            borderRadius: "var(--radius-sm)",
            background: "transparent",
            color: TEXT_SECONDARY,
            cursor: "pointer",
          }}
        >
          <MoreVertical size={16} />
        </button>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "100%",
              width: 170,
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              zIndex: 30,
              overflow: "hidden",
              padding: 4,
            }}
          >
            {isUnread ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onMarkRead(notification.id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: TEXT,
                  fontSize: 12,
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <Check size={14} /> Marquer comme lu
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onMarkUnread(notification.id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: TEXT,
                  fontSize: 12,
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <Bell size={14} /> Marquer non lu
              </button>
            )}

            {isArchived ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onRestore(notification.id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: TEXT,
                  fontSize: 12,
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <RotateCcw size={14} /> Restaurer
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onArchive(notification.id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: TEXT,
                  fontSize: 12,
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <Archive size={14} /> Archiver
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteRequest(notification.id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  color: DANGER,
                  fontSize: 12,
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <Trash2 size={14} /> Supprimer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
