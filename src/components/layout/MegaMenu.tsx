import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "../../context/LanguageContext";

export interface MegaMenuItem {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  href: string;
}

interface MegaMenuProps {
  id: string;
  labelledBy: string;
  items: MegaMenuItem[];
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Desktop compact dropdown panel for Services & Solutions.
 * Clean 2-column grid layout with icon, title, and short description per item.
 */
export default function MegaMenu({ id, labelledBy, items, isOpen, onClose }: MegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const t = useTranslation();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClick);
    };
  }, [isOpen, onClose]);

  // Helper to resolve translation for title / desc
  const getTitle = (key: string) => {
    return (
      (t.services as Record<string, string>)[key] ||
      (t.megaMenu as Record<string, string>)[key] ||
      key
    );
  };

  const getDesc = (key: string) => {
    return (
      (t.services as Record<string, string>)[key] ||
      (t.megaMenu as Record<string, string>)[key] ||
      key
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          id={id}
          aria-labelledby={labelledBy}
          initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.98 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: 10, x: "-50%", scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            insetInlineStart: "50%",
            background: "var(--surface)",
            borderRadius: 16,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-xl)",
            padding: "20px",
            width: 580,
            maxWidth: "90vw",
            zIndex: 1001,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            boxSizing: "border-box",
          }}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.titleKey}
                to={item.href}
                onClick={onClose}
                role="menuitem"
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "background 0.15s ease",
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    theme === "dark" ? "rgba(255, 255, 255, 0.06)" : "var(--hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background:
                      theme === "dark" ? "rgba(249, 115, 22, 0.15)" : "rgba(30, 58, 138, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text)",
                      marginBottom: 3,
                      lineHeight: 1.3,
                    }}
                  >
                    {getTitle(item.titleKey)}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      lineHeight: 1.45,
                    }}
                  >
                    {getDesc(item.descKey)}
                  </div>
                </div>
              </NavLink>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
