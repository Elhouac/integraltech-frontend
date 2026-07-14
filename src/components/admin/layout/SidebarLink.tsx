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
}

export default function SidebarLink({ to, label, icon: Icon, badge, collapsed, onClick }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      end={to === "/admin/dashboard"}
      onClick={onClick}
      aria-label={label}
      style={({ isActive }) => ({
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
        cursor: "pointer",
      })}
    >
      {({ isActive }) => (
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
        </>
      )}
    </NavLink>
  );
}
