import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { Search, Globe, Sun, Menu, X, Moon } from "lucide-react";
import useSearch from "../../context/SearchContext";
import { useLanguage, useTranslation } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import type { Language } from "../../i18n";
import { ORANGE, NAVY, DARK, BORDER } from "../../constants";
import { BLOG_SEEN_NEW_ARTICLES_KEY, newBlogArticleIds } from "../../data/blogArticles";
import MegaMenu from "./MegaMenu";
import { megaMenuServices, megaMenuSolutions } from "../../data/homeData";

type OpenMegaMenu = "solutions" | "services" | null;

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { openSearch } = useSearch();
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [newArticleCount, setNewArticleCount] = useState(0);
  const [openMegaMenu, setOpenMegaMenu] = useState<OpenMegaMenu>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const solutionsTriggerRef = useRef<HTMLAnchorElement>(null);
  const servicesTriggerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateNewArticleCount = () => {
      try {
        const seen = new Set<number>(JSON.parse(localStorage.getItem(BLOG_SEEN_NEW_ARTICLES_KEY) ?? "[]"));
        setNewArticleCount(newBlogArticleIds.filter((id) => !seen.has(id)).length);
      } catch {
        setNewArticleCount(newBlogArticleIds.length);
      }
    };
    updateNewArticleCount();
    window.addEventListener("storage", updateNewArticleCount);
    window.addEventListener("integraltech:blog:new-articles-seen", updateNewArticleCount);
    return () => {
      window.removeEventListener("storage", updateNewArticleCount);
      window.removeEventListener("integraltech:blog:new-articles-seen", updateNewArticleCount);
    };
  }, []);

  const cancelMegaMenuClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeMegaMenu = useCallback(() => {
    cancelMegaMenuClose();
    setOpenMegaMenu(null);
  }, [cancelMegaMenuClose]);

  const scheduleMegaMenuClose = useCallback(() => {
    cancelMegaMenuClose();
    closeTimerRef.current = setTimeout(() => setOpenMegaMenu(null), 140);
  }, [cancelMegaMenuClose]);

  useEffect(() => () => cancelMegaMenuClose(), [cancelMegaMenuClose]);

  useEffect(() => {
    if (!openMegaMenu) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const trigger = openMegaMenu === "solutions" ? solutionsTriggerRef.current : servicesTriggerRef.current;
      closeMegaMenu();
      trigger?.focus();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeMegaMenu, openMegaMenu]);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/solutions", label: t.nav.solutions },
    { to: "/services", label: t.nav.services },
    { to: "/blog", label: t.nav.blog },
  ];

  const closeMobile = () => setMobileOpen(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  const renderLinkLabel = (link: (typeof links)[number]) => (
    <>
      <span>{link.label}</span>
      {link.to === "/blog" && location.pathname !== "/blog" && newArticleCount > 0 && (
        <span className="navbar-blog-badge" aria-label={t.blogPage.newArticlesLabel(newArticleCount)}>
          {newArticleCount > 9 ? "9+" : newArticleCount}
        </span>
      )}
    </>
  );

  const megaMenuTranslation = (key: string) => t.megaMenu[key as keyof typeof t.megaMenu];

  const getLinkColor = (isActive: boolean) => {
    if (isActive) return ORANGE;
    return theme === "dark" ? "rgba(255, 255, 255, 0.92)" : "var(--text)";
  };

  const getUtilityIconColor = () => {
    return theme === "dark" ? "rgba(255, 255, 255, 0.9)" : "var(--text)";
  };

  return (
    <header className="navbar-fixed-wrapper">
      <motion.nav
        className="navbar-shell"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          pointerEvents: "auto",
          width: "100%",
          margin: 0,
          background: isScrolled ? "var(--glass-bg)" : "transparent",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
          border: isScrolled ? "1px solid var(--glass-border)" : "1px solid transparent",
          boxShadow: isScrolled ? "var(--shadow-md)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "18px",
          boxSizing: "border-box",
          transition: "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease",
        }}
      >
      {/* Brand Logo */}
      <div className="navbar-logo" style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo.png"
          alt="Integral Progress Technology"
          style={{
            objectFit: "contain",
            filter: theme === "dark" ? "brightness(0) invert(1)" : "none",
            transition: "filter 0.3s ease",
          }}
        />
      </div>

      {/* Desktop Links */}
      <div className="navbar-links" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {links.map((link) => {
          const menuType = link.to === "/solutions" ? "solutions" : link.to === "/services" ? "services" : null;
          const isMenuOpen = menuType !== null && openMegaMenu === menuType;
          const triggerId = menuType ? `navbar-${menuType}-trigger` : undefined;
          const menuId = menuType ? `navbar-${menuType}-menu` : undefined;
          const triggerRef = menuType === "solutions" ? solutionsTriggerRef : menuType === "services" ? servicesTriggerRef : undefined;
          const linkElement = (
            <NavLink
              key={link.to}
              ref={triggerRef}
              to={link.to}
              id={triggerId}
              aria-haspopup={menuType ? "menu" : undefined}
              aria-expanded={menuType ? isMenuOpen : undefined}
              aria-controls={menuType ? menuId : undefined}
              onClick={() => menuType && closeMegaMenu()}
              onFocus={() => menuType && setOpenMegaMenu(menuType)}
              onKeyDown={(event) => {
                if (menuType && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  cancelMegaMenuClose();
                  setOpenMegaMenu(menuType);
                }
              }}
              style={({ isActive }: { isActive: boolean }) => ({
                color: getLinkColor(isActive),
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                textDecoration: "none",
                fontFamily: "Outfit, sans-serif",
                padding: "8px 16px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                position: "relative",
                transition: "all 0.2s ease",
              })}
              onMouseEnter={(e) => {
                const isActive = location.pathname === link.to;
                if (!isActive) {
                  e.currentTarget.style.color = ORANGE;
                  e.currentTarget.style.backgroundColor = isScrolled && theme === "light"
                    ? "rgba(249, 115, 22, 0.08)"
                    : "rgba(255, 255, 255, 0.12)";
                }
              }}
              onMouseLeave={(e) => {
                const isActive = location.pathname === link.to;
                if (!isActive) {
                  e.currentTarget.style.color = getLinkColor(false);
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {({ isActive }) => (
                <>
                  {renderLinkLabel(link)}
                  {menuType && <span style={{ marginInlineStart: 4, fontSize: 8 }}>▼</span>}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-dot"
                      style={{
                        position: "absolute",
                        bottom: -2,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: ORANGE,
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );

          if (!menuType) return linkElement;

          return (
            <div
              key={link.to}
              className="navbar-mega-menu-anchor"
              onMouseEnter={() => { cancelMegaMenuClose(); setOpenMegaMenu(menuType); }}
              onMouseLeave={scheduleMegaMenuClose}
              onFocus={cancelMegaMenuClose}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleMegaMenuClose();
              }}
            >
              {linkElement}
              <MegaMenu
                id={menuId!}
                labelledBy={triggerId!}
                items={menuType === "solutions" ? megaMenuSolutions : megaMenuServices}
                isOpen={isMenuOpen}
                onClose={closeMegaMenu}
              />
            </div>
          );
        })}
      </div>

      {/* Right Side Actions */}
      <div className="navbar-actions" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* Theme Toggle */}
        <button
          className="navbar-utility-button"
          onClick={toggleTheme}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 38,
            borderRadius: "10px",
            color: getUtilityIconColor(),
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = ORANGE;
            e.currentTarget.style.backgroundColor = isScrolled && theme === "light"
              ? "rgba(249, 115, 22, 0.08)"
              : "rgba(255, 255, 255, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = getUtilityIconColor();
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          aria-label={theme === "light" ? t.a11y.activateDarkMode : t.a11y.activateLightMode}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Language Selector */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setShowLanguageMenu(true)}
          onMouseLeave={() => setShowLanguageMenu(false)}
        >
          <button
            className="navbar-utility-button"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: "10px",
              color: getUtilityIconColor(),
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = ORANGE;
              e.currentTarget.style.backgroundColor = isScrolled && theme === "light"
                ? "rgba(249, 115, 22, 0.08)"
                : "rgba(255, 255, 255, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = getUtilityIconColor();
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            aria-label={t.nav.language}
            aria-expanded={showLanguageMenu}
          >
            <Globe size={18} />
          </button>

          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  insetInlineEnd: 0,
                  marginTop: 6,
                  background: "var(--surface)",
                  borderRadius: 12,
                  border: `1px solid ${BORDER}`,
                  boxShadow: "var(--shadow-lg)",
                  overflow: "hidden",
                  minWidth: 140,
                  zIndex: 1000,
                }}
              >
                {(["fr", "en", "ar"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "none",
                      background: language === lang ? "rgba(249, 115, 22, 0.08)" : "transparent",
                      color: language === lang ? ORANGE : DARK,
                      cursor: "pointer",
                      fontSize: 13,
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: language === lang ? 600 : 500,
                      textAlign: "start",
                      transition: "background-color 0.15s",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                    onMouseEnter={(e) => {
                      if (language !== lang) {
                        e.currentTarget.style.backgroundColor = "var(--hover)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (language !== lang) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <span>{lang === "fr" ? "🇫🇷" : lang === "en" ? "🇬🇧" : "🇲🇦"}</span>
                    <span>
                      {lang === "fr" ? t.nav.french : lang === "en" ? t.nav.english : t.nav.arabic}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button */}
        <button
          className="navbar-utility-button"
          onClick={() => openSearch()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 38,
            borderRadius: "10px",
            color: getUtilityIconColor(),
            transition: "all 0.2s ease",
            marginInlineEnd: 4,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = DARK;
            e.currentTarget.style.backgroundColor = theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = getUtilityIconColor();
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          aria-label={t.search.placeholder}
        >
          <Search size={18} />
        </button>

        {/* Desktop CTA Button (Contact) */}
        <div className="navbar-links">
          <NavLink
            to="/contact"
            style={({ isActive }: { isActive: boolean }) => ({
              background: ORANGE,
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              fontFamily: "Outfit, sans-serif",
              padding: "10px 20px",
              borderRadius: "10px",
              display: "inline-flex",
              alignItems: "center",
              boxShadow: "0 4px 10px rgba(249, 115, 22, 0.15)",
              transition: "all 0.2s ease",
            })}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 14px rgba(249, 115, 22, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(249, 115, 22, 0.15)";
            }}
          >
            {t.nav.contact}
          </NavLink>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="navbar-icon-button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? t.a11y.menuClose : t.a11y.menuOpen}
          aria-expanded={mobileOpen}
          style={{
            background: NAVY,
            border: "none",
            borderRadius: "10px",
            width: 38,
            height: 38,
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            marginInlineStart: 4,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
          }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar-mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{
              position: "absolute",
              insetInlineStart: 0,
              insetInlineEnd: 0,
              background: "var(--mobile-menu-bg)",
              backdropFilter: "blur(16px)",
              border: `1px solid ${BORDER}`,
              borderRadius: "16px",
              boxShadow: theme === "dark"
                ? "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 4px 10px -4px rgba(0, 0, 0, 0.4)"
                : "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
              padding: "20px 24px",
              flexDirection: "column",
              gap: 8,
              zIndex: 100,
            }}
          >
            {links.map((link) => (
              <div key={link.to} style={{ display: "flex", flexDirection: "column" }}>
                <NavLink
                  to={link.to}
                  onClick={closeMobile}
                  style={({ isActive }: { isActive: boolean }) => ({
                    color: isActive ? ORANGE : (theme === "dark" ? "rgba(255, 255, 255, 0.92)" : "var(--text)"),
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 15,
                    textDecoration: "none",
                    fontFamily: "Outfit, sans-serif",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: isActive ? "rgba(249, 115, 22, 0.05)" : "transparent",
                    transition: "all 0.2s ease",
                  })}
                >
                  <span className="navbar-mobile-link-label">{renderLinkLabel(link)}</span>
                </NavLink>
                {link.to === "/services" && (
                  <div style={{ paddingInlineStart: 16, display: "flex", flexDirection: "column", gap: 2, margin: "2px 0 6px" }}>
                    {megaMenuServices.map((srv) => {
                      const Icon = srv.icon;
                      const title = t.services[srv.titleKey as keyof typeof t.services] ?? srv.titleKey;
                      return (
                        <NavLink
                          key={srv.slug}
                          to={srv.href}
                          onClick={closeMobile}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            fontSize: 13,
                            padding: "8px 12px",
                            borderRadius: 8,
                            color: "var(--text-secondary)",
                            textDecoration: "none",
                            fontFamily: "Outfit, sans-serif",
                          }}
                        >
                          <Icon size={15} color="var(--accent)" />
                          <span>{title}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {/* Contact CTA in Mobile Menu */}
            <NavLink
              to="/contact"
              onClick={closeMobile}
              style={{
                background: ORANGE,
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                fontFamily: "Outfit, sans-serif",
                padding: "12px 16px",
                borderRadius: "10px",
                textAlign: "center",
                marginTop: 8,
                boxShadow: "0 4px 10px rgba(249, 115, 22, 0.15)",
                display: "block",
              }}
            >
              {t.nav.contact}
            </NavLink>

            <div
              className="navbar-mobile-tools"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 8,
                paddingTop: 12,
                borderTop: `1px solid ${BORDER}`,
              }}
            >
              <button
                type="button"
                onClick={() => { closeMobile(); openSearch(); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 12px",
                  border: "none",
                  borderRadius: 8,
                  background: "transparent",
                  color: "var(--text)",
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: "Outfit, sans-serif",
                  textAlign: "start",
                }}
              >
                <Search size={16} />
                <span>{t.search.placeholder}</span>
              </button>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(["fr", "en", "ar"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => { handleLanguageChange(lang); closeMobile(); }}
                    aria-pressed={language === lang}
                    style={{
                      flex: "1 1 0",
                      minWidth: 72,
                      padding: "9px 10px",
                      border: `1px solid ${language === lang ? ORANGE : BORDER}`,
                      borderRadius: 8,
                      background: language === lang ? "rgba(249, 115, 22, 0.08)" : "transparent",
                      color: language === lang ? ORANGE : "var(--text-secondary)",
                      cursor: "pointer",
                      fontSize: 13,
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: language === lang ? 600 : 500,
                    }}
                  >
                    {lang === "fr" ? t.nav.french : lang === "en" ? t.nav.english : t.nav.arabic}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.nav>
    </header>
  );
}
