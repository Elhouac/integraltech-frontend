import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { BACKGROUND } from "../../../constants";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ── Track viewport width ──
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(false); // Reset collapse state on mobile
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  // ── Close mobile menu on route change would be handled by SidebarLink onClick ──

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const sidebarWidth = isMobile ? 0 : collapsed ? 72 : 260;

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="admin-layout"
        style={{
          minHeight: "100vh",
          background: BACKGROUND,
          fontFamily: "var(--font-sans)",
        }}
      >
        <a className="admin-skip-link" href="#admin-content">
          Aller au contenu principal
        </a>

        {/* Sidebar */}
        <AdminSidebar
          collapsed={isMobile ? false : collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main content area */}
        <motion.div
          animate={{ marginLeft: sidebarWidth }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          <AdminHeader
            onToggleSidebar={toggleSidebar}
            sidebarExpanded={isMobile ? mobileOpen : !collapsed}
          />

          <main
            id="admin-content"
            tabIndex={-1}
            style={{
              flex: 1,
              padding: "24px",
              maxWidth: 1400,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Outlet />
          </main>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
