import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, User, LogOut, ChevronDown } from "lucide-react";
import AdminBreadcrumb from "./AdminBreadcrumb";
import NotificationCenterPanel from "../notifications/NotificationCenterPanel";
import { useAuth } from "../../../context/AuthContext";
import { adminService, ADMIN_NOTIFICATIONS_CHANGED_EVENT } from "../../../services/adminService";
import { ACCENT, BORDER, TEXT, TEXT_SECONDARY, SURFACE } from "../../../constants";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  sidebarExpanded: boolean;
}

export default function AdminHeader({ onToggleSidebar, sidebarExpanded }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  const userId = user?.id || 1;
  const role = user?.role || "reader";

  const fetchUnread = useCallback(async () => {
    try {
      const count = await adminService.getUnreadNotificationCount(userId, role);
      setUnreadCount(count);
    } catch {
      /* ignore */
    }
  }, [userId, role]);

  useEffect(() => {
    fetchUnread();
  }, [fetchUnread]);

  useEffect(() => {
    const refresh = () => void fetchUnread();
    window.addEventListener(ADMIN_NOTIFICATIONS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(ADMIN_NOTIFICATIONS_CHANGED_EVENT, refresh);
  }, [fetchUnread]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!userMenuOpen && !notifPanelOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (notifPanelOpen) {
        setNotifPanelOpen(false);
        notificationButtonRef.current?.focus();
      }
      if (userMenuOpen) {
        setUserMenuOpen(false);
        userMenuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [notifPanelOpen, userMenuOpen]);


  return (
    <header
      className="admin-header"
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: `1px solid ${BORDER}`,
        background: SURFACE,
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left: Toggle + Breadcrumb */}
      <div className="admin-header-left" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarExpanded ? "Réduire la navigation" : "Ouvrir la navigation"}
          aria-expanded={sidebarExpanded}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            border: "none",
            borderRadius: "var(--radius-sm)",
            background: "transparent",
            color: TEXT_SECONDARY,
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          <Menu size={20} />
        </button>
        <AdminBreadcrumb />
      </div>

      {/* Right: Notifications + User */}
      <div className="admin-header-actions" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Notification bell */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            ref={notificationButtonRef}
            type="button"
            onClick={() => {
              setNotifPanelOpen((prev) => !prev);
              setUserMenuOpen(false);
              fetchUnread();
            }}
            aria-label="Notifications"
            aria-expanded={notifPanelOpen}
            aria-controls="admin-notification-panel"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              border: "none",
              borderRadius: "var(--radius-sm)",
              background: notifPanelOpen ? "var(--hover)" : "transparent",
              color: notifPanelOpen ? TEXT : TEXT_SECONDARY,
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
            }}
          >
            <Bell size={18} />
            {/* Dynamic unread Badge */}
            {unreadCount > 0 && (
              <span className="admin-notif-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifPanelOpen && (
              <NotificationCenterPanel
                userId={userId}
                role={role}
                onClose={() => setNotifPanelOpen(false)}
                onStateChange={fetchUnread}
              />
            )}
          </AnimatePresence>
        </div>

        {/* User dropdown */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            ref={userMenuButtonRef}
            type="button"
            onClick={() => {
              setUserMenuOpen((prev) => !prev);
              setNotifPanelOpen(false);
            }}
            aria-expanded={userMenuOpen}
            aria-controls="admin-user-menu"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              border: "none",
              borderRadius: "var(--radius-md)",
              background: "transparent",
              color: TEXT,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 500,
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `linear-gradient(135deg, var(--primary), ${ACCENT})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <span className="admin-header-username">{user?.name || "Admin"}</span>
            <ChevronDown
              size={14}
              style={{
                transition: "transform 0.2s",
                transform: userMenuOpen ? "rotate(180deg)" : "none",
              }}
            />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                id="admin-user-menu"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: 200,
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-lg)",
                  overflow: "hidden",
                  zIndex: 50,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate("/admin/profile");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "10px 16px",
                    border: "none",
                    background: "transparent",
                    color: TEXT,
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <User size={15} />
                  <span style={{ flex: 1, textAlign: "start" }}>Mon Profil</span>
                </button>
                <div style={{ height: 1, background: BORDER }} />
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                    navigate("/admin/login");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "10px 16px",
                    border: "none",
                    background: "transparent",
                    color: "var(--danger)",
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <LogOut size={15} />
                  Déconnexion
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
