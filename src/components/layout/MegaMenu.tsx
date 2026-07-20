import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import type { MegaMenuItem } from "../../data/homeData";
import { useTheme } from "../../context/ThemeContext";

interface MegaMenuProps {
  id: string;
  labelledBy: string;
  items: MegaMenuItem[];
  isOpen: boolean;
  onClose: () => void;
  /** i18n lookup — given a key, returns the translated string */
  t: (key: string) => string;
}

/**
 * Desktop mega-menu panel.
 * 2-column grid layout with icon, title, short description per item.
 * Closes on outside click; trigger hover/focus timing is owned by Navbar.
 */
export default function MegaMenu({ id, labelledBy, items, isOpen, onClose, t }: MegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay binding to avoid immediate close on open click
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClick);
    };
  }, [isOpen, onClose]);

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
            padding: "24px",
            width: 620,
            maxWidth: "90vw",
            zIndex: 1001,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
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
                  gap: 14,
                  alignItems: "flex-start",
                  padding: "14px 16px",
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "background 0.15s ease",
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme === "dark" ? "rgba(255, 255, 255, 0.06)" : "var(--hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: theme === "dark" ? "rgba(59, 130, 246, 0.15)" : "rgba(30, 58, 138, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
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
                    {t(item.titleKey)}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {t(item.descKey)}
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
