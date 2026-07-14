import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, User, LogOut, ChevronDown } from "lucide-react";
import AdminBreadcrumb from "./AdminBreadcrumb";
import { useAuth } from "../../../context/AuthContext";
import { ACCENT, BORDER, TEXT, TEXT_SECONDARY, SURFACE } from "../../../constants";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
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
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Notification bell */}
        <button
          aria-label="Notifications"
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
            position: "relative",
            transition: "background 0.2s",
          }}
        >
          <Bell size={18} />
          {/* Badge */}
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: ACCENT,
              border: `2px solid ${SURFACE}`,
            }}
          />
        </button>

        {/* User dropdown */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
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
                  onClick={() => { setUserMenuOpen(false); navigate("/admin/profile"); }}
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
                  Mon Profil
                </button>
                <div style={{ height: 1, background: BORDER }} />
                <button
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
