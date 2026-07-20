import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ACCENT, TEXT, TEXT_SECONDARY, BORDER } from "../../../constants";

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  collapsed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function SidebarLink({ to, label, icon: Icon, badge, collapsed, onClick, disabled = false }: SidebarLinkProps) {
  return (
    <NavLink
      to={disabled ? "#" : to}
      end={to === "/admin/dashboard"}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.();
      }}
      aria-label={disabled ? `${label} - Bientôt` : label}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      style={({ isActive: routeIsActive }) => {
        const isActive = routeIsActive && !disabled;
        return ({
        display: "flex",
        alignItems: "center",
        gap: collapsed ? 0 : 12,
        padding: collapsed ? "10px 0" : "10px 16px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: "var(--radius-md)",
        textDecoration: "none",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: isActive ? 600 : 400,
        color: isActive ? ACCENT : TEXT_SECONDARY,
        background: isActive ? "var(--hover)" : "transparent",
        transition: "background 0.2s, color 0.2s",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.58 : 1,
      }); }}
    >
      {({ isActive: routeIsActive }) => {
        const isActive = routeIsActive && !disabled;
        return (
        <>
          {/* Active indicator bar */}
          {isActive && (
            <motion.div
              layoutId="admin-sidebar-active"
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: 3,
                height: 20,
                borderRadius: 4,
                background: ACCENT,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}

          <Icon
            size={collapsed ? 20 : 18}
            strokeWidth={isActive ? 2.2 : 1.8}
            style={{ flexShrink: 0 }}
          />

          {!collapsed && (
            <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {label}
            </span>
          )}

          {!collapsed && badge !== undefined && badge > 0 && (
            <span
              style={{
                minWidth: 20,
                height: 20,
                padding: "0 6px",
                borderRadius: 10,
                background: ACCENT,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {badge > 99 ? "99+" : badge}
            </span>
          )}

          {!collapsed && disabled && (
            <span className="admin-coming-soon-badge">Bientôt</span>
          )}
        </>
      ); }}
    </NavLink>
  );
}
