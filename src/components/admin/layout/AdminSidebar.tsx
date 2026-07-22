import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Inbox, Mail, FileText, FolderOpen,
  Image, Settings as SettingsIcon, Wrench, Lightbulb,
  Users, User, Bell, History, BarChart3, Sun, Moon, X,
} from "lucide-react";
import SidebarLink from "./SidebarLink";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { hasPermission } from "../../../utils/permissions";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

// ── Section divider ──
function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) {
    return <div style={{ height: 1, background: BORDER, margin: "8px 12px" }} />;
  }
  return (
    <div
      style={{
        padding: "16px 16px 6px",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: TEXT_SECONDARY,
        fontFamily: "var(--font-sans)",
        opacity: 0.7,
      }}
    >
      {label}
    </div>
  );
}

export default function AdminSidebar({ collapsed, mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const role = user?.role || "reader";

  const sidebarWidth = collapsed ? 72 : 260;

  const showLeads = hasPermission(role, "leads", "view");
  const showSubscribers = hasPermission(role, "subscribers", "view");
  const showBlog = hasPermission(role, "blog", "view");
  const showCategories = hasPermission(role, "categories", "view");
  const showUsers = hasPermission(role, "users", "view");
  const showSettings = hasPermission(role, "settings", "view");
  const showServices = hasPermission(role, "services", "view");
  const showSolutions = hasPermission(role, "solutions", "view");
  const showMedia = hasPermission(role, "media", "view");
  const showAnalytics = hasPermission(role, "analytics", "view");

  const navContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "0" : "0 20px",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        <Link
          to="/admin/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: TEXT,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              background: `linear-gradient(135deg, var(--primary), ${ACCENT})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              flexShrink: 0,
            }}
          >
            IT
          </div>
          {!collapsed && (
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT }}>
                IntegralTech
              </div>
              <div style={{ fontSize: 10, color: TEXT_SECONDARY, fontWeight: 500 }}>
                Admin Panel
              </div>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            aria-label="Fermer le menu"
            style={{
              marginLeft: "auto",
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
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav
        aria-label="Navigation admin"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "8px",
        }}
      >
        {/* Main */}
        {hasPermission(role, "dashboard", "view") && (
          <SidebarLink to="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} collapsed={collapsed} onClick={onCloseMobile} />
        )}

        {/* Section: Gestion */}
        {(showLeads || showSubscribers) && (
          <>
            <SectionLabel label="Gestion" collapsed={collapsed} />
            {showLeads && (
              <SidebarLink to="/admin/leads" label="Leads" icon={Inbox} badge={3} collapsed={collapsed} onClick={onCloseMobile} />
            )}
            {showSubscribers && (
              <SidebarLink to="/admin/subscribers" label="Newsletter" icon={Mail} collapsed={collapsed} onClick={onCloseMobile} />
            )}
          </>
        )}

        {/* Section: Contenu */}
        {(showBlog || showCategories || showServices || showSolutions || showMedia) && (
          <>
            <SectionLabel label="Contenu" collapsed={collapsed} />
            {showBlog && (
              <SidebarLink to="/admin/posts" label="Articles" icon={FileText} collapsed={collapsed} onClick={onCloseMobile} />
            )}
            {showCategories && (
              <SidebarLink to="/admin/categories" label="Catégories" icon={FolderOpen} collapsed={collapsed} onClick={onCloseMobile} />
            )}
            {showMedia && (
              <SidebarLink to="/admin/media" label="Médiathèque" icon={Image} collapsed={collapsed} onClick={onCloseMobile} />
            )}
            {showServices && (
              <SidebarLink to="/admin/services" label="Services" icon={Wrench} collapsed={collapsed} onClick={onCloseMobile} />
            )}
            {showSolutions && (
              <SidebarLink to="/admin/solutions" label="Solutions" icon={Lightbulb} collapsed={collapsed} onClick={onCloseMobile} />
            )}
          </>
        )}

        {/* Section: Pilotage */}
        {showAnalytics && (
          <>
            <SectionLabel label="Pilotage" collapsed={collapsed} />
            <SidebarLink to="/admin/analytics" label="Rapports & analyses" icon={BarChart3} collapsed={collapsed} onClick={onCloseMobile} />
          </>
        )}

        {/* Section: Système */}
        <SectionLabel label="Système" collapsed={collapsed} />
        {showUsers && (
          <SidebarLink to="/admin/users" label="Utilisateurs" icon={Users} collapsed={collapsed} onClick={onCloseMobile} />
        )}
        {showSettings && (
          <SidebarLink to="/admin/settings/general" label="Paramètres" icon={SettingsIcon} collapsed={collapsed} onClick={onCloseMobile} />
        )}
        <SidebarLink to="/admin/audit-log" label="Journal d’activité" icon={History} collapsed={collapsed} onClick={onCloseMobile} />

        {/* Mon profil & Notifications — always visible to authenticated users */}
        <SectionLabel label="Compte" collapsed={collapsed} />
        <SidebarLink to="/admin/profile" label="Mon Profil" icon={User} collapsed={collapsed} onClick={onCloseMobile} />
        <SidebarLink to="/admin/notifications" label="Notifications" icon={Bell} collapsed={collapsed} onClick={onCloseMobile} />
      </nav>

      {/* ── Footer: Theme toggle ── */}
      <div
        style={{
          padding: collapsed ? "12px 0" : "12px 16px",
          borderTop: `1px solid ${BORDER}`,
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: collapsed ? 0 : 10,
            padding: collapsed ? "8px" : "8px 12px",
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-md)",
            background: "transparent",
            color: TEXT_SECONDARY,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 500,
            width: collapsed ? 40 : "100%",
            justifyContent: "center",
            transition: "border-color 0.2s, color 0.2s",
          }}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          {!collapsed && (theme === "dark" ? "Mode clair" : "Mode sombre")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <motion.aside
        className="admin-sidebar-desktop"
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          background: SURFACE,
          borderRight: `1px solid ${BORDER}`,
          overflow: "hidden",
        }}
      >
        {navContent}
      </motion.aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <>
          <motion.div
            className="admin-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            style={{
              position: "fixed",
              inset: 0,
              background: "var(--overlay)",
              zIndex: 59,
            }}
          />
          <motion.aside
            className="admin-sidebar-mobile"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 280,
              height: "100vh",
              background: SURFACE,
              borderRight: `1px solid ${BORDER}`,
              zIndex: 60,
              overflow: "hidden",
            }}
          >
            {navContent}
          </motion.aside>
        </>
      )}
    </>
  );
}
